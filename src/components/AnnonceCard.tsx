import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardHeader,
    IonButton,
    IonRouterLink, IonCardTitle, IonCardSubtitle, IonLabel, IonCardContent, IonChip, IonItem
} from '@ionic/react';
import "./AnnonceCard.css"
import { useHistory } from 'react-router-dom';
import {Annonce} from "../types/Annonce";

interface PublicationProps {
    annonce:Annonce;
}

const AnnonceCard: React.FC<PublicationProps> = ({ annonce }) => {
    const history = useHistory();
    const handleDetailsClick = (id: number) => {
        history.push(`/detail/${id}`);
    };

    const transformDateFromArray = (array:any)=> {
        const annee = array[0]
        const moi = array[1]-1;
        const jour = array[2];
        const date = new  Date();
        date.setMonth(moi)
        date.setDate(jour)
        date.setFullYear(annee)
        return date;
    }

    return (
        <IonRouterLink onClick={() => handleDetailsClick(annonce.idAnnonce)} routerDirection="forward">
            <IonCard>
                <img alt="Silhouette of mountains" src={annonce.photos[0].binDecode} className={"custom-image"}/>
                <IonCardHeader>
                    <IonCardTitle>{transformDateFromArray(annonce.daty).toDateString()}</IonCardTitle>
                    <IonCardSubtitle> {annonce.model.marque.nomMarque} {annonce.model.nomModel} </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    <p>
                        {annonce.descri}
                    </p>
                    <br/>
                    <div className="ion-chip-container">
                        <IonChip color="dark">{annonce.etatString}</IonChip>
                    </div>
                </IonCardContent>
            </IonCard>
        </IonRouterLink>
    );
};

export default AnnonceCard;