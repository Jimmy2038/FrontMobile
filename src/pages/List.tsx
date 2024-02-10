import React, {useEffect, useState} from 'react';
import {
    IonApp,
    IonButton,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote, IonRefresher, IonRefresherContent, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,
    IonText,
    IonTitle,
    IonToolbar, RefresherEventDetail,
} from '@ionic/react';
import {chevronDownCircleOutline, chevronForward, library, listCircle, playCircle, radio, search} from 'ionicons/icons';

import './main.css';
import {useHistory} from "react-router";
import AnnonceCard from "../components/AnnonceCard";
import {Annonce} from "../types/Annonce";
import API_URL from "../types/config";
import {Route} from "react-router-dom";
import Example from "./Modal";
import FormAnnonce from "./FormAnnonce";
import Login from "./Login";
import SignUp from "./SignUp";
import AddPhoto from "./AddPhoto";
import {IonReactRouter} from "@ionic/react-router";

function List() {
    const jwtToken = localStorage.getItem('jwtToken');
    const idUser = localStorage.getItem('idUser');
    const history = useHistory();

    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const fetchData = async () => {
        try {
            if (!jwtToken) {
                console.error('Jetons JWT non trouvés');
                history.push('/')
                return;
            }

            const response = await fetch(API_URL+'/annonce/getAllByUser/'+idUser, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAnnonces(data);
                console.log(data)
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            // Any calls to load data go here
            console.log('Refresh')
            fetchData();
            event.detail.complete();
        }, 2000);
    }

    const handleDetailsClick = (id: number) => {
        history.push(`/detail/${id}`);
    };
    return (
        <IonApp>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Example</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light">
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        pullingText="refresh"
                        refreshingSpinner="circles"
                        refreshingText="Refreshing..."
                    ></IonRefresherContent>
                </IonRefresher>
                <div className="ion-content-scroll-host ion-padding">
                    {
                        annonces.map((annonce, index) => (
                            <AnnonceCard
                                key={index}
                                annonce={annonce}
                            />
                        ))
                    }
                </div>
            </IonContent>
        </IonApp>
    );
}
export default List;