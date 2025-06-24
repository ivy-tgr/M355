import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonButton,
  IonToast,
  IonText,
} from "@ionic/react";
import { camera, thumbsDownOutline, thumbsUpOutline } from "ionicons/icons";
import { usePhotoGallery, UserPhoto } from "../hooks/usePhotoGallery";
import { useHistory } from "react-router-dom";
import "./TakePhoto.css";

const TakePhoto: React.FC = () => {
  const { deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

  const handleTakePhoto = async () => {
    try {
      await takePhoto();
      setToastMessage("Foto erfolgreich aufgenommen!");
      setShowToast(true);
    } catch (error) {
      console.error("Fehler beim Aufnehmen des Fotos:", error);
      setToastMessage("Fehler beim Aufnehmen des Fotos");
      setShowToast(true);
    }
  };

  const handleBestätigen = async () => {
    setToastMessage("Rezept wird geöffnet...");
    setShowToast(true);
    history.push("/newRecipe");
  };

  const handleAbbrechen = async (photo: UserPhoto) => {
    deletePhoto(photo);
    setToastMessage("Foto abgebrochen und gelöscht");
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonContent className="content">
        <IonText className="center-title">
          <h1>TAKE PHOTO</h1>
        </IonText>

        {photos.length > 0 && (
          <IonCard className="photo-card">
            <IonCardContent>
              <img src={photos[0]?.webviewPath} alt="Aktuelles Foto" />
              <div className="photo-buttons">
                <IonButton className="thumb-buttons" onClick={handleBestätigen}>
                  <IonIcon icon={thumbsUpOutline} />
                </IonButton>
                <IonButton
                  className="thumb-buttons"
                  onClick={() => handleAbbrechen(photos[0])}
                >
                  <IonIcon icon={thumbsDownOutline} />
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

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
          <IonFabButton
            color="light"
            className="camera-button"
            onClick={handleTakePhoto}
          >
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

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
