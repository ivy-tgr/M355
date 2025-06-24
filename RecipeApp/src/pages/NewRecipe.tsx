import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonIcon,
  IonText,
  IonToast,
  IonLoading,
} from "@ionic/react";
import { add, camera } from "ionicons/icons";
import { supabase, base64ToBlob, Recipe } from "../data/supabase";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import "./NewRecipe.css";

const RecipeForm: React.FC = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredient: "", amount: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("success");

  const { photos, clearAllPhotos, getLatestPhoto } = usePhotoGallery();

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", amount: "" }]);
  };

  const handleIngredientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...ingredients];
    updated[index][field as "ingredient" | "amount"] = value;
    setIngredients(updated);
  };

  const uploadImageToSupabase = async (photo: any): Promise<string | null> => {
    try {
      let base64Data: string;

      if (photo.webviewPath?.startsWith("data:")) {
        base64Data = photo.webviewPath;
      } else {
        const response = await fetch(photo.webviewPath!);
        const blob = await response.blob();
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const blob = base64ToBlob(base64Data, "image/jpeg");

      const fileName = `recipe-${Date.now()}.jpeg`;

      const { error } = await supabase.storage
        .from("recipe-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.error("Upload Error:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("recipe-images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setToastMessage("Bitte gib einen Namen für das Rezept ein");
      setToastColor("danger");
      setShowToast(true);
      return;
    }

    if (!category) {
      setToastMessage("Bitte wähle eine Kategorie aus");
      setToastColor("danger");
      setShowToast(true);
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.ingredient.trim() && ing.amount.trim()
    );

    if (validIngredients.length === 0) {
      setToastMessage("Bitte gib mindestens eine Zutat an");
      setToastColor("danger");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl: string | null = null;

      if (photos.length > 0) {
        const latestPhoto = getLatestPhoto();
        if (latestPhoto) {
          imageUrl = await uploadImageToSupabase(latestPhoto);

          if (!imageUrl) {
            setToastMessage("Fehler beim Hochladen des Bildes");
            setToastColor("warning");
            setShowToast(true);
          }
        }
      }

      const recipe: Omit<Recipe, "id" | "created_at"> = {
        name: name.trim(),
        category,
        description: description.trim(),
        ingredients: validIngredients,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from("recipes")
        .insert([recipe])
        .select();

      if (error) {
        console.error("Database Error:", error);
        setToastMessage("Fehler beim Speichern des Rezepts");
        setToastColor("danger");
        setShowToast(true);
        return;
      }

      setToastMessage("Rezept erfolgreich gespeichert!");
      setToastColor("success");
      setShowToast(true);

      setName("");
      setCategory("");
      setDescription("");
      setIngredients([{ ingredient: "", amount: "" }]);

      if (photos.length > 0) {
        await clearAllPhotos();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setToastMessage("Ein unerwarteter Fehler ist aufgetreten");
      setToastColor("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonText className="center-title-home">
        <h1>New Recipe</h1>
      </IonText>

      <IonContent className="recipe-content">
        <div className="form-container">
          <IonItem lines="none" className="input-item">
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              placeholder="Value"
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
            />
          </IonItem>

          <div className="photo-button-wrapper">
            <IonButton
              fill="outline"
              size="small"
              href="/takePhoto"
              color="dark"
            >
              <IonIcon icon={camera} slot="start" />
              Create Photo
              {photos.length > 0 && (
                <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                  ({photos.length})
                </span>
              )}
            </IonButton>
          </div>

          <IonItem lines="none" className="input-item">
            <IonLabel position="stacked">Category</IonLabel>
            <IonSelect
              placeholder="Value"
              value={category}
              onIonChange={(e) => setCategory(e.detail.value!)}
            >
              <IonSelectOption value="dessert">Dessert</IonSelectOption>
              <IonSelectOption value="main">Main</IonSelectOption>
              <IonSelectOption value="drink">Drink</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem lines="none" className="input-item">
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea
              placeholder="Value"
              autoGrow
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
            />
          </IonItem>

          {ingredients.map((item, index) => (
            <div className="ingredient-row" key={index}>
              <IonItem lines="none" className="ingredient-input">
                <IonLabel position="stacked">Ingredient</IonLabel>
                <IonInput
                  placeholder="Value"
                  value={item.ingredient}
                  onIonChange={(e) =>
                    handleIngredientChange(
                      index,
                      "ingredient",
                      e.detail.value || ""
                    )
                  }
                />
              </IonItem>

              <IonItem lines="none" className="amount-input">
                <IonLabel position="stacked">Amount</IonLabel>
                <IonInput
                  placeholder="Value"
                  value={item.amount}
                  onIonChange={(e) =>
                    handleIngredientChange(
                      index,
                      "amount",
                      e.detail.value || ""
                    )
                  }
                />
              </IonItem>
            </div>
          ))}

          <div className="add-button-inline">
            <IonButton fill="clear" color={"dark"} onClick={addIngredient}>
              <IonIcon icon={add} className="add-button" />
            </IonButton>
          </div>

          <IonButton
            expand="block"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Wird gespeichert..." : "ADD"}
          </IonButton>
        </div>

        <IonLoading isOpen={isLoading} message="Rezept wird gespeichert..." />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default RecipeForm;
