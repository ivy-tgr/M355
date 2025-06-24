import {
  IonContent,
  IonPage,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonImg,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import "./Home.css";
import { useEffect, useState } from "react";
import { supabase } from "../data/supabase";

interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url?: string;
  stars?: number;
}

const Home: React.FC = () => {
  const [randomRecipes, setRandomRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, name, category, description, image_url, stars");

      if (error) {
        console.error(error);
        setLoading(false);
      } else if (data && data.length > 0) {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setRandomRecipes(shuffled.slice(0, 6));
        setLoading(false);
      }
    };

    fetchRandomRecipes();
  }, []);

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="custom-content-home">
          <IonText className="center-title">
            <h1>HOME</h1>
          </IonText>
          <div className="loading-container-home">Lade Rezepte...</div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="custom-content-home">
        <IonText className="center-title">
          <h1>HOME</h1>
        </IonText>
        <div className="recipes-container-home">
          {randomRecipes.map((recipe) => (
            <IonCard key={recipe.id} className="recipe-card-home">
              <IonImg src={recipe.image_url} alt={recipe.name} />
              <IonCardHeader>
                <IonCardTitle>{recipe.name}</IonCardTitle>
                <IonCardSubtitle>{recipe.category}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="stars">
                {[...Array(4)].map((_, i) => (
                  <IonIcon
                    key={i}
                    icon={i < (recipe.stars || 0) ? star : starOutline}
                  />
                ))}
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
