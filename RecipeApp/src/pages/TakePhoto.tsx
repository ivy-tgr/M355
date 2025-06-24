import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
  IonToast,
} from "@ionic/react";
import { camera, trash, close } from "ionicons/icons";
import { usePhotoGallery, UserPhoto } from "../hooks/usePhotoGallery";
import { useHistory } from "react-router-dom";
import "./TakePhoto.css";

const TakePhoto: React.FC = () => {
  const { deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

  const handleTakePhoto = async () => {
    try {
      await takePhoto();
      setToastMessage("Foto erfolgreich aufgenommen!");
      setShowToast(true);

      setTimeout(() => {
        history.push("/newRecipe");
      }, 3000);
    } catch (error) {
      console.error("Fehler beim Aufnehmen des Fotos:", error);
      setToastMessage("Fehler beim Aufnehmen des Fotos");
      setShowToast(true);
    }
  };
  return (
    <IonPage>
      <IonContent className="content">
        <div className="center-title">
          <IonTitle>Take Photo</IonTitle>
        </div>

        <IonGrid className="photo-grid">
          <IonRow className="photo-grid">
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <div className="photo-container">
                  <IonImg
                    onClick={() => setPhotoToDelete(photo)}
                    src={photo.webviewPath}
                    className="photo-image"
                  />
                  {index === 0 && <div className="newest-label">Neuestes</div>}
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {photos.length === 0 && (
          <div className="no-photos">
            <IonIcon icon={camera} />
            <p>
              Noch keine Fotos aufgenommen.
              <br />
              Tippe auf den Kamera-Button um zu starten!
            </p>
          </div>
        )}

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton color={"light"} className="camera-button" onClick={handleTakePhoto}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
            {
              text: "Löschen",
              role: "destructive",
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete);
                  setPhotoToDelete(undefined);
                  setToastMessage("Foto gelöscht");
                  setShowToast(true);
                }
              },
            },
            {
              text: "Abbrechen",
              icon: close,
              role: "cancel",
            },
          ]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default TakePhoto;
