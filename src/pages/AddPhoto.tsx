import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton,
  IonLabel,
  IonImg,
  IonLoading,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const AddPhotos: React.FC = () => {
  const [imageList, setImageList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageList((prev) => [...prev, dataUrl]);
      };
      fileReader.readAsDataURL(files[0]);
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
      formData.append('idAnnonce','1');

      imageList.forEach((dataUrl, index) => {
        const blob = dataURLtoBlob(dataUrl);
        formData.append('files', blob, `image_${index}.jpg`);
      });

      console.log(formData)
      const response = await fetch('http://localhost:8081/annonce/insertPhoto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOm51bGwsImlkIjoxLCJleHAiOjE3MDc1ODM4MDMsImlhdCI6MTcwNzIzODIwM30.jYltBaHyCO3f8PIwjVExwZOOpwnajDfcrmkPjsiUyX8`, // Ajouter le token à l'en-tête Authorization
        },
        body: formData,
      });

      // Vérifiez la réponse de l'API
      // if (response.status === 200) {
      //   console.log('Photos téléchargées avec succès:', response);
      //   // Redirigez l'utilisateur ou effectuez d'autres actions nécessaires après l'insertion
      //   history.push('/liste-publications');
      // } else {
      //   console.error('Erreur lors du téléchargement des photos:', response);
      // }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
      <IonPage>
        <IonHeader>
          <IonToolbar color={'secondary'}>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Add photos</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardContent>
              <IonLabel>Image:</IonLabel>
              {/*<IonButton onClick={captureImage}>Capture Image</IonButton>*/}
              <input type="file" multiple accept="image/*" onChange={handleImageInput} />
            </IonCardContent>
          </IonCard>

          <IonLoading isOpen={loading} message={'Chargement en cours...'} />

          <IonGrid>
            <IonCard>
              <IonRow>
                {imageList.map((dataUrl, index) => (
                    <IonCol size='3' key={index}>
                      <IonImg style={{ margin: 0 }} src={dataUrl} alt={`captured-${index}`} />
                    </IonCol>
                ))}
              </IonRow>
            </IonCard>
          </IonGrid>
        </IonContent>
        <IonButton onClick={handleFinish}>Publier</IonButton>
      </IonPage>
  );
};

export default AddPhotos;
