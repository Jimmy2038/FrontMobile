import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent, IonCol,
    IonContent, IonFab, IonFabButton, IonGrid,
    IonHeader, IonIcon, IonImg,
    IonInput,
    IonItem,
    IonList, IonLoading,
    IonPage, IonRefresher, IonRefresherContent,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle, IonToast,
    IonToolbar, RefresherEventDetail
} from '@ionic/react';

import './FormAnnonce.css'
import {loadData} from "../class/loadData";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {Energie, Marque, Model, Transmission} from "../types/Annonce";
import API_URL from "../types/config";

function FormAnnonce() {
    const [error,setError] = useState("");
    const idUser = localStorage.getItem('idUser')
    const {models,transmissions,energie,marques,getModels} = loadData();
    const [imageList, setImageList] = useState<string[]>([]);
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [showToast, setShowToast] = useState(false);

    const [donne, setDonne] = useState({
        idUtilisateur: idUser,
        daty: "2022-11-02T13:01:00",
        idModel: null,
        idEnergie: null,
        idTransmision: null,
        kilometrage: 0,
        annee: 0,
        descri: "",
        prix: 0
    })
    const jwtToken = localStorage.getItem('jwtToken')
    const handleInputChangeMarque = (e: any) => {
        const {name,value} = e.target;
        setDonne((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
        getModels(value)
    };
    const handleInputChange = (e: any) => {
        const {name,value} = e.target;
        setDonne((prevUser) => ({
            ...prevUser,
            [name]: value
        }));

        console.log(donne)
    };
    const handleInsert = async () => {
        console.log(donne)
        try {
            const jwtToken = localStorage.getItem('jwtToken');

            const response = await fetch(API_URL+'/annonce/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({
                    "idUtilisateur": donne.idUtilisateur,
                    "daty": donne.daty,
                    "model": {
                        "idModel": donne.idModel
                    },
                    "energie": {
                        "idEnergie": donne.idEnergie
                    },
                    "transmission": {
                        "idTransmision": donne.idTransmision
                    },
                    "kilometrage": donne.kilometrage,
                    "annee": donne.annee,
                    "descri": donne.descri,
                    "prix": donne.prix
                }),
            });

            if (response.ok) {
                setError("Annonce creer")
                console.log("Annonce creer")
            } else {
                setError(response.status.toString())
                console.log("error")
            }
        } catch (error) {
            setError(error+"")
            console.error('Erreur réseau', error);
        }
    };

    // const captureImage = async () => {
    //   try {
    //     const image = await Camera.getPhoto({
    //       quality: 90,
    //       allowEditing: false,
    //       resultType: CameraResultType.DataUrl,
    //       source: CameraSource.Prompt,
    //     });
    //
    //     if (image.dataUrl) {
    //       setLoading(true);
    //       setImageList((prev) => [...prev, image.dataUrl]);
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     console.error('Error capturing image:', error);
    //   }
    // };

    // const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     if (files && files.length > 0) {
    //         const fileReader = new FileReader();
    //         fileReader.onload = (e) => {
    //             const dataUrl = e.target?.result as string;
    //             setImageList((prev) => [...prev, dataUrl]);
    //
    //         };
    //         fileReader.readAsDataURL(files[0]);
    //     }
    // };

    const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    // Vérifier si la taille de l'image dépasse les dimensions maximales
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg');

                    setImageList((prev) => [...prev, dataUrl]);
                };
                img.src = e.target?.result as string;
            };

            fileReader.readAsDataURL(file);
        }
    };

    function dataURLtoBlob(dataUrl: string): Blob {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const handleFinish = async () => {
        try {
            setLoading(true);

            const formData = new FormData();

            imageList.forEach((dataUrl, index) => {
                const blob = dataURLtoBlob(dataUrl);
                formData.append('files', blob, `image_${index}.jpg`);
            });

            formData.append('annonce',JSON.stringify({
                "idUtilisateur": donne.idUtilisateur,
                "daty": donne.daty,
                "model": {
                    "idModel": donne.idModel
                },
                "energie": {
                    "idEnergie": donne.idEnergie
                },
                "transmission": {
                    "idTransmission": donne.idTransmision
                },
                "kilometrage": donne.kilometrage,
                "annee": donne.annee,
                "descri": donne.descri,
                "prix": donne.prix
            }));
            const response = await fetch(API_URL+'/annonce/insertAnnonce', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message)
            } else {
                const data = await response.json();
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error+'')
            console.error('Erreur lors de la requête API:', error);
        } finally {
            setLoading(false);
            setShowToast(true)
        }
    };

    function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
        setTimeout(() => {
            // Any calls to load data go here
            console.log('Refresh')
            clearForm()
            event.detail.complete();
        }, 1000);
    }

    const clearForm = () => {
        setDonne({
            idUtilisateur: idUser,
            daty: "2022-11-02T13:01:00",
            idModel: null,
            idEnergie: null,
            idTransmision: null,
            kilometrage: 0,
            annee: 0,
            descri: "",
            prix: 0
        });
        history.go(0)
    };

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Creer un annonce</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent color="light">
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                    <form>
                        <IonList inset={true}>
                            <IonItem>
                                <IonTextarea
                                    name={"descri"}
                                    label="Description"
                                    placeholder={"description de l'annonce"}
                                    label-placement="floating"
                                    rows={5}
                                    onIonInput={(event) =>handleInputChange(event)}
                                    required
                                ></IonTextarea>
                            </IonItem>
                        </IonList>

                        <IonList inset={true}>
                            <IonItem>
                                <IonSelect
                                    name={"idMarque"}
                                    label="Marque"
                                    labelPlacement="floating"
                                    placeholder="Select Marque"
                                    interface={"popover"}
                                    onIonChange={(event) => handleInputChangeMarque(event)}
                                >
                                    {marques.map((model:Marque) => (
                                        <IonSelectOption key={model.idMarque} value={model.idMarque}>
                                            {model.nomMarque}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonSelect
                                    name={"idModel"}
                                    label="Model"
                                    labelPlacement="floating"
                                    placeholder="Select Modele"
                                    interface={"popover"}
                                    onIonChange={(event) => handleInputChange(event)}
                                >
                                    {models.map((model:Model) => (
                                        <IonSelectOption key={model.idModel} value={model.idModel}>
                                            {model.nomModel}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonSelect
                                    name={"idTransmision"}
                                    className="never-flip"
                                    interface={"popover"}
                                    label="Transmission"
                                    labelPlacement={"floating"}
                                    placeholder="Select Transmission"
                                    onIonChange={(event) => handleInputChange(event)}
                                >
                                    {transmissions.map((model:Transmission) => (
                                        <IonSelectOption key={model.idTransmision} value={model.idTransmision}>
                                            {model.nomTransmission}
                                        </IonSelectOption>
                                    ))}

                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonSelect
                                    name={"idEnergie"}
                                    className="never-flip"
                                    interface={"popover"}
                                    label="Energie"
                                    labelPlacement={"floating"}
                                    placeholder="Select Energie"
                                    onIonChange={(event) => handleInputChange(event)}
                                >
                                    {energie.map((model:Energie) => (
                                        <IonSelectOption key={model.idEnergie} value={model.idEnergie}>
                                            {model.nomEnergie}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonSelect
                                    name={"annee"}
                                    label="Anne"
                                    labelPlacement="floating"
                                    placeholder="Anne"
                                    interface={"popover"}
                                    onIonChange={(event) => handleInputChange(event)}>
                                    <IonSelectOption value="2024">2013</IonSelectOption>
                                    <IonSelectOption value="2024">2014</IonSelectOption>
                                    <IonSelectOption value="2024">2015</IonSelectOption>
                                    <IonSelectOption value="2024">2016</IonSelectOption>
                                    <IonSelectOption value="2024">2017</IonSelectOption>
                                    <IonSelectOption value="2024">2018</IonSelectOption>
                                    <IonSelectOption value="2024">2019</IonSelectOption>
                                    <IonSelectOption value="2024">2020</IonSelectOption>
                                    <IonSelectOption value="2024">2021</IonSelectOption>
                                    <IonSelectOption value="2022">2022</IonSelectOption>
                                    <IonSelectOption value="2023">2023</IonSelectOption>

                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    onIonInput={(event) =>handleInputChange(event)}
                                    name={"kilometrage"}
                                    label={"Kilometrage"}
                                    type={"number"}
                                    required>

                                </IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    onIonInput={(event) =>handleInputChange(event)}
                                    name={"prix"}
                                    label={"Prix"}
                                    type={"number"} required>

                                </IonInput>
                            </IonItem>
                        </IonList>
                        <IonList inset={true}>
                            {/*<h3>Photo </h3>*/}
                            <IonItem>
                                <input type="file" multiple accept="image/*" onChange={handleImageInput} />
                            </IonItem>
                            <IonGrid>
                                <IonCard>
                                    <IonRow>
                                        {imageList.map((dataUrl, index) => (
                                            <IonCol size='3' key={index}>
                                                <IonImg style={{ margin: 0 }} src={dataUrl} alt={`img-${index}`} />
                                            </IonCol>
                                        ))}
                                    </IonRow>
                                </IonCard>
                            </IonGrid>
                            <br/>
                            <IonItem>
                                <IonButton onClick={handleFinish} className={"custom-input"} expand={"full"} shape={"round"} > Creer </IonButton>
                            </IonItem>
                            <br/><br/>
                        </IonList>
                    </form>
                    <IonLoading
                        isOpen={loading}
                        message={'Chargement en cours...'}
                    />
                </IonContent>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    duration={30000}
                    message={message}
                    className="custom-toast"
                    buttons={[
                        {
                            text: 'OK',
                            role: 'cancel'
                        }
                    ]}
                />
            </IonPage>
        </>
    );
}
export default FormAnnonce;