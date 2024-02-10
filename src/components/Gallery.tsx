import {PhotoItem} from "../types/PhotoItem";
import {IonCol, IonGrid, IonImg, IonRow, IonText} from "@ionic/react";

type Props = {
    photos : PhotoItem[],
    deletePhoto : (fileName:string) => void
}

const Gallery: React.FC<Props> = ({photos}) => {

    return (
        <IonGrid>
            <IonText> Liste  </IonText>
            <IonRow>
                {photos.map((photo,i)=>(
                    <IonCol size="6" key={i}>
                        {/*<IonText> {photo.filePath}|| web :{ photo.webViewPath} </IonText>*/}
                        {/*<IonImg src={photo.webViewPath}/>*/}
                    </IonCol>
                ))}
            </IonRow>
        </IonGrid>
    )

};

export default Gallery;
