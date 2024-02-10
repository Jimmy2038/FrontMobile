import { Redirect, Route } from 'react-router-dom';
import {
    IonApp, IonButton, IonContent, IonHeader,
    IonIcon,
    IonLabel, IonPage, IonRefresher, IonRefresherContent,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs, IonTitle, IonToolbar,
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

import {add, addCircle, chevronDownCircleOutline, library, list, playCircle, radio, search} from "ionicons/icons";
import List from "./List";
import React, {useState} from "react";
import FormAnnonce from "./FormAnnonce";
import Example from "./Modal";
import Login from "./Login";
import SignUp from "./SignUp";
import AddPhoto from "./AddPhoto";
import AnnonceCard from "../components/AnnonceCard";
import ListAnnonce from "./ListAnnonce";
import AnnonceDetail from "./AnnonceDetail";
import {addIcons} from "ionicons";
import {useHistory} from "react-router";



const Bar: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonTabs>
                <IonRouterOutlet>
                    <Redirect exact path="/" to="/annonce" />
                    <Route path="/annonce" render={() => <FormAnnonce />} exact={true} />

                    {/*<Route path="/annonce" render={() => <FormAnnonce />} exact={true} />*/}
                    <Route exact path="/list">
                        <ListAnnonce />
                    </Route>
                    <Route path="/detail/:id" component={AnnonceDetail} />
                </IonRouterOutlet>

                <IonTabBar slot="bottom">
                    <IonTabButton tab="annonce" href="/annonce" >
                        <IonIcon icon={add} />
                        <IonLabel>Creer</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="ListAnnonce" href="/list">
                        <IonIcon icon={list} />
                        <IonLabel>Liste</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    </IonApp>
);
export default Bar;
