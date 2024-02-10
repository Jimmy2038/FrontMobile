import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';




/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import React from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import List from "./pages/List";
import FormAnnonce from "./pages/FormAnnonce";
import AddPhoto from "./pages/AddPhoto";
import AnnonceCard from "./components/AnnonceCard";
import Example from "./pages/Modal";
import Bar from "./pages/Bar";
import AnnonceDetail from "./pages/AnnonceDetail";
import ListAnnonce from "./pages/ListAnnonce";
import {add, home, list} from "ionicons/icons";

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Routes exclues de la barre d'onglets */}
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>

          {/* Redirection par défaut vers la page de connexion */}


          {/* Routes incluses dans la barre d'onglets */}
          <IonTabs>
            <IonRouterOutlet>
              {/* Redirection par défaut vers l'onglet "annonce" */}
              <Redirect exact from="/" to="/login" />
              <Route path="/annonce" component={FormAnnonce} exact={true} />
              <Route path="/list" component={ListAnnonce} exact={true} />
              <Route path="/detail/:id" component={AnnonceDetail} />
            </IonRouterOutlet>

            {/* Onglets */}
            <IonTabBar slot="bottom">
              <IonTabButton tab="ListAnnonce" href="/list">
                <IonIcon icon={list} />
                <IonLabel>Liste</IonLabel>
              </IonTabButton>
              <IonTabButton tab="annonce" href="/annonce">
                <IonIcon icon={add} />
                <IonLabel>Creer</IonLabel>
              </IonTabButton>
              {/*<IonTabButton tab="porfile" href="/">*/}
              {/*  <IonIcon icon={add} />*/}
              {/*  <IonLabel>Profile</IonLabel>*/}
              {/*</IonTabButton>*/}
            </IonTabBar>
          </IonTabs>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
);

export default App;
