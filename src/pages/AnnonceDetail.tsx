import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonImg,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonLabel,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonThumbnail,
    IonNote, IonAlert, IonRefresher, IonRefresherContent, RefresherEventDetail
} from '@ionic/react';
import axios from 'axios';
import {useHistory, useParams} from 'react-router';
import API_URL from "../types/config";
import '../css/AnnonceDetail.css'
import {Annonce} from "../types/Annonce";

function AnnonceDetail()  {
    const { id } = useParams<{ id: string }>();
    const jwtToken = localStorage.getItem('jwtToken');
    const history = useHistory();
    const [Vendu, setVendu] = useState(0)
    const [annonce, setAnnonce] = useState<Annonce|null>({
        annee: 0,
        dateValidation: [0, 0, 0, 0, 0, 0, 0],
        daty: [0, 0, 0, 0, 0, 0, 0],
        descri: "",
        etat: 0,
        energie: {idEnergie:0,nomEnergie:''},
        etatString: "",
        idAnnonce: 0,
        idUtilisateur: 0,
        kilometrage: 0,
        model: {idModel:0,nomModel:'',marque:{idMarque:0,nomMarque:''}},
        photos: [],
        prix: 0,
        transmission: {nomTransmission:'',idTransmision:0},
        dateVente:[0,0,0,0,0,0,0]}
    )

    const fetchData = async () => {
        try {
            if (!jwtToken) {
                console.error('Jetons JWT non trouvés');
                history.push('/')
                return;
            }

            const response = await fetch(API_URL+'/annonce/getByIdAnnonce/'+id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAnnonce(data);
                setVendu(data.etat)
                if (data.dateVente === null) {
                    setAnnonce(prevAnnonce => {
                        if (prevAnnonce !== null) {
                            return {
                                ...prevAnnonce,
                                dateVente: [0, 0, 0, 0, 0, 0, 0] // Valeur par défaut pour dateVente
                            };
                        }
                        return null;
                    });
                } else {
                    setAnnonce(data);
                }
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
    },[id,Vendu]);

    const changeStatus =async ()=> {
        setVendu(10)
        try {

            await fetch(API_URL+'/vendu/'+id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    }

    const transformDateFromArray = (annee:any,moi:any,jour:any)=> {
        // const annee = array[0]
        // const moi = array[1]-1;
        // const jour = array[2];
        const date = new  Date();
        date.setMonth(moi-1)
        date.setDate(jour)
        date.setFullYear(annee)
        return date;
    }
    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            // Any calls to load data go here
            console.log('Refresh')
            fetchData();
            event.detail.complete();
        }, 2000);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{transformDateFromArray(annonce?.daty[0],annonce?.daty[1],annonce?.daty[2]).toDateString()}</IonCardTitle>
                        <IonCardSubtitle><p>{annonce?.descri}</p></IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonList>
                            {Vendu!=0 && (
                            <IonItem>
                                <p> <b>Date Validation : </b>{transformDateFromArray(annonce?.dateValidation[0],annonce?.dateValidation[1],annonce?.dateValidation[2]).toDateString()} </p>
                            </IonItem>
                            )}
                            <IonItem>
                                <p> <b>Prix : </b>{annonce?.prix} Ar</p>
                            </IonItem>
                            <IonItem>
                                <p> <b>Marque : </b> {annonce?.model.marque.nomMarque}</p>
                            </IonItem>
                            <IonItem>
                                <p> <b>Model : </b> {annonce?.model.nomModel}</p>
                            </IonItem>
                            <IonItem>
                                <p><b> Energie : </b> {annonce?.energie.nomEnergie}</p>
                            </IonItem>
                            <IonItem>
                                <p><b> Transmission : </b> {annonce?.transmission.nomTransmission}</p>
                            </IonItem>
                            <IonItem>
                                <p><b>Kilometrage : </b>{annonce?.kilometrage} km</p>
                            </IonItem>
                            <IonItem>
                                <p><b>Anne : </b>{annonce?.annee}</p>
                            </IonItem>
                        </IonList>
                        {(Vendu==10)&& (
                            <IonItem>
                                <p> <b>Vendu le : </b>{transformDateFromArray(annonce?.dateVente[0],annonce?.dateVente[1],annonce?.dateVente[2]).toDateString()} </p>
                            </IonItem>
                        )}
                        {Vendu==5&& (
                            <>
                                <IonButton size={'small'} id="present-alert">
                                    Vendu
                                </IonButton>

                                <IonAlert
                                    header="Voulez vous vraiment confirme ?"
                                    trigger="present-alert"
                                    buttons={[
                                        {
                                            text: 'Cancel',
                                            role: 'cancel',
                                            handler: () => {
                                                console.log('Alert canceled');
                                            },
                                        },
                                        {
                                            text: 'Oui',
                                            role: 'confirm',
                                            handler: () => {
                                                changeStatus()
                                            },
                                        },
                                    ]}
                                    onDidDismiss={({ detail }) => console.log(`Dismissed with role: ${detail.role}`)}
                                ></IonAlert>
                            </>
                        )}
                    </IonCardContent>

                </IonCard>

                <IonList inset={true}>
                    <IonItem>
                        <h2>Photos</h2>
                    </IonItem>
                    <br/>
                    {annonce?.photos.map((photo, index) => (
                        <IonItem key={photo.idSary}>
                            <IonImg key={photo.idSary} src={photo.binDecode} className="grid-item" alt={`Photo ${index}`} />
                        </IonItem>
                    ))}
                    <br/>

                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default AnnonceDetail;
