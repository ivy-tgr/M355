import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Recipes from "./pages/Recipes";
import Home from "./pages/Home";
import NewRecipe from "./pages/NewRecipe";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import "./App.css";
import { add, documentText, home } from "ionicons/icons";
import TakePhoto from "./pages/TakePhoto";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/recipes">
            <Recipes />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/newRecipe">
            <NewRecipe />
          </Route>
            <Route exact path="/takePhoto">
            <TakePhoto />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" className="ion-tab-bar">
          <IonTabButton className="ion-tab-bar" tab="recipes" href="/recipes">
            <IonIcon icon={documentText} />
            <IonLabel>Recipes</IonLabel>
          </IonTabButton>
          <IonTabButton className="ion-tab-bar" tab="home" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton
            className="ion-tab-bar"
            tab="newRecipe"
            href="/newRecipe"
          >
            <IonIcon icon={add} />
            <IonLabel>New</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
