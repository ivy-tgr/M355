import {
  IonContent,
  IonPage,
  IonSearchbar,
  IonIcon,
  IonCard,
  IonCardContent,
  IonLabel,
  IonText,
  IonThumbnail,
  IonImg,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import "./Recipes.css";
import { useEffect, useState } from "react";
import { supabase } from "../data/supabase";

const RECIPES_PER_PAGE = 6;

interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string;
  stars?: number;
}

const Recipes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("id, name, category, description, image_url, stars");

      if (error) {
        console.error(error);
      } else if (data) {
        setRecipes(data as Recipe[]);
      }
    };
    fetchRecipes();
  }, []);

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filtered.length / RECIPES_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );

  const handleStarClick = async (id: string, starIndex: number) => {
    const newStars = starIndex + 1;
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, stars: newStars } : r))
    );

    const { error } = await supabase
      .from("recipes")
      .update({ stars: newStars })
      .eq("id", id);

    if (error) {
      console.error(error);
    }
  };

  return (
    <IonPage>
      <IonContent className="recipes-page" fullscreen>
        <IonText className="center-title">
          <h1>RECIPES</h1>
        </IonText>
        <div className="container">
          <IonSearchbar
            placeholder="Search"
            className="search-bar"
            value={searchTerm}
            searchIcon="none"
            onIonInput={(e) => setSearchTerm(e.detail.value!)}
          />
          {paginated.map((item) => (
            <IonCard className="recipe-card" key={item.id}>
              <IonCardContent className="recipe-card-content">
                <div className="recipe-category">
                  <IonThumbnail className="recipe-thumbnail">
                    <IonImg className="recipe-image"
                      alt={item.name}
                      src={
                        item.image_url ||
                        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic3.bigstockphoto.com%2F0%2F3%2F3%2Flarge1500%2F330698995.jpg&f=1&nofb=1&ipt=fe672a8603167ca730f02c749724d31821e003366d6f6228d17efe20786f5873"
                      }
                    />
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{item.name}</h2>
                    <IonText>{item.category}</IonText>
                  </IonLabel>
                </div>
                <div className="recipe-stars">
                  {[...Array(4)].map((_, i) => (
                    <IonIcon
                      key={i}
                      icon={i < (item.stars || 0) ? star : starOutline}
                      className="star-icon"
                      onClick={() => handleStarClick(item.id, i)}
                    />
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
        {pageCount > 1 && (
          <div className="pagination">
            {Array.from({ length: pageCount }, (_, i) => (
              <span
                key={i}
                className={`page-number ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </span>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Recipes;
