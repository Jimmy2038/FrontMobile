import {
    IonApp, IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent, IonCol,
    IonContent, IonFab, IonFabButton, IonGrid,
    IonHeader, IonIcon, IonImg,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonMenuButton, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar, RefresherEventDetail
} from '@ionic/react';

import './FormAnnonce.css'
import {loadData} from "../class/loadData";
import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {Annonce, Energie, Marque, Model, Transmission} from "../types/Annonce";
import API_URL from "../types/config";
import {OverlayEventDetail} from "@ionic/core/components";
import {camera, chevronDownCircleOutline} from "ionicons/icons";
import AnnonceCard from "../components/AnnonceCard";

function ListAnnonce() {
    const  history = useHistory()

    const jwtToken = localStorage.getItem('jwtToken');
    const idUser = localStorage.getItem('idUser');

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

    const deconnexion = async ()=>{
        try {
            const response = await fetch(API_URL+'/deconnexion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.removeItem('jwtToken')
                localStorage.removeItem('idUser')
                history.push('/')
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    }

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Liste</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent color="light">
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    <IonButton shape={"round"} size={"small"} onClick={deconnexion} >Deconnexion</IonButton>
                    <div className="ion-content-scroll-host ion-padding">
                        {annonces.length === 0 ? (
                            <IonLabel>Vous n'avez pas encore d'annonce</IonLabel>
                        ) : (
                            annonces.map((annonce, index) => (
                                <AnnonceCard
                                    key={index}
                                    annonce={annonce}
                                />
                            ))
                        )}
                    </div>
                </IonContent>
            </IonPage>
        </>
    );
}
export default ListAnnonce;