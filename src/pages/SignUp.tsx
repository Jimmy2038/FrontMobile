import React, {useRef, useState} from 'react';
import {
    IonApp,
    IonButton,
    IonCardContent,
    IonContent,
    IonInput, IonLoading, IonToast
} from '@ionic/react';

import './Login.css'
import {logIn} from "ionicons/icons";
import {useHistory} from "react-router";
import API_URL from "../types/config";

function SignUp() {
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();
    const history = useHistory();
    const [message, setMessage] = useState('Annonce cree')
    const [loading, setLoading] = useState(false)
    const validateEmail = (email: string) => {
        return email.match(
            /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
    };

    const validate = (ev: Event) => {
        const value = (ev.target as HTMLInputElement).value;

        setIsValid(undefined);

        if (value === '') return;

        validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
    };

    const [user, setUser] = useState(
        {
            pseudo: null,
            mdp: null,
            email: null
        }
    );

    const handleInputChange = (e: any) => {
        const {name,value} = e.target;

        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));

        // console.log(user)
    };

    const markTouched = () => {
        setIsTouched(true);
    };

    const handleInscription = async () => {
        setLoading(true)
        try {
            const response = await fetch(API_URL+'/inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            // console.log(user)

            if (response.ok) {
                // const data = await response.json();
                // console.log(data.message)
                history.push('/');
            } else {
                // const data = await response.json();
                // console.log(data.message)
                // setMessage(data)
                history.push('/signup');
            }
        } catch (error) {
            setMessage(error+'')
            console.error('Erreur réseau', error);
        }  finally {
            setLoading(false)
        }
    };

    return (
        <IonApp>
            <IonContent className="ion-padding">

                <div className="login-container">
                    <div>
                        <IonCardContent >
                            <IonInput
                                type="text"
                                label="Pseudo"
                                // shape={"round"}
                                name={"pseudo"}
                                fill={"outline"}
                                labelPlacement="floating"
                                clearInput={true}
                                errorText="Invalid email"
                                onIonInput={(event) => {
                                    handleInputChange(event);
                                }}
                                onIonBlur={() => markTouched()}
                            ></IonInput>
                            <IonInput
                                className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                                type="email"
                                label="Adress e-mail"
                                // shape={"round"}
                                name={"email"}
                                fill={"outline"}
                                labelPlacement="floating"
                                clearInput={true}
                                errorText="Invalid email"
                                onIonInput={(event) => {
                                    validate(event);
                                    handleInputChange(event);
                                }}
                                onIonBlur={() => markTouched()}
                            ></IonInput>

                            <IonInput
                                // shape={"round"}
                                type={"password"}
                                label="Motde passe"
                                name={"mdp"}
                                fill={"outline"}
                                labelPlacement="floating"
                                clearInput={true}
                                onIonInput={(event) =>handleInputChange(event)}
                            ></IonInput>
                            <br />

                            {/*<button className={"custom-input"} > Sign Up  </button>*/}
                            <IonButton className={"custom-input"} expand={"full"} shape={"round"} onClick={handleInscription} > Sign Up </IonButton>
                        </IonCardContent>
                        <br/>
                    </div>
                </div>
                <IonLoading
                    isOpen={loading}
                    message={'Chargement en cours...'}
                />

            </IonContent>
        </IonApp>
    );
}
export default SignUp;