import { useState, useEffect } from "react";
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    const loadSaved = async () => {
      const { value } = await Preferences.get({key: PHOTO_STORAGE });

      const photosInPreferences = (value ? JSON.parse(value) : []) as UserPhoto[];
      if (!isPlatform('hybrid')) {
        for (let photo of photosInPreferences) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          });
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
      }
      setPhotos(photosInPreferences);
    };
    loadSaved();
  }, []);

  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });
      
      const fileName = new Date().getTime() + '.jpeg';
      const savedFileImage = await savePicture(photo, fileName);
      const newPhotos = [savedFileImage, ...photos];
      
      setPhotos(newPhotos);
      await Preferences.set({key: PHOTO_STORAGE, value: JSON.stringify(newPhotos)});
      
      return savedFileImage; 
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  };

  const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
    let base64Data: string;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }
    
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (isPlatform('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  };

  const deletePhoto = async (photo: UserPhoto) => {
    try {
      // Remove this photo from the Photos reference data array
      const newPhotos = photos.filter(p => p.filepath !== photo.filepath);

      // Update photos array cache by overwriting the existing photo array
      await Preferences.set({key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });

      // delete photo file from filesystem
      const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
      
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  };

  // Neue Hilfsfunktion: Alle Fotos löschen (nützlich nach erfolgreichem Upload)
  const clearAllPhotos = async () => {
    try {
      // Alle Dateien aus dem Filesystem löschen
      for (const photo of photos) {
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
          path: filename,
          directory: Directory.Data
        });
      }
      
      // Cache leeren
      await Preferences.set({key: PHOTO_STORAGE, value: JSON.stringify([]) });
      setPhotos([]);
    } catch (error) {
      console.error('Error clearing photos:', error);
      throw error;
    }
  };

  // Hilfsfunktion: Neuestes Foto abrufen
  const getLatestPhoto = (): UserPhoto | null => {
    return photos.length > 0 ? photos[0] : null;
  };

  return {
    deletePhoto,
    photos,
    takePhoto,
    clearAllPhotos,
    getLatestPhoto
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('method did not return a string')
      }
    };
    reader.readAsDataURL(blob);
  });
}