import React, {useEffect, useRef, useState} from 'react';
import {
    IonApp,
    IonButton,
    IonCardContent,
    IonContent,
    IonInput, IonLabel, IonLoading, IonRouterLink
} from '@ionic/react';

import './Login.css'
import {useHistory} from "react-router";
import API_URL from "../types/config";

function Login() {

    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean>();
    const history = useHistory();
    const jwtToken = localStorage.getItem('jwtToken');
    const [message, setMessage] = useState("")
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

    const [user, setUser] = useState({
        email: 'fehizoro@gmail.com',
        password: 'fehizoro'
    });

    const handleInputChange = (e: any) => {
        const {name,value} = e.target;

        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };
    const markTouched = () => {
        setIsTouched(true);
    };

    // useEffect(() => {
    //     if (jwtToken) {
    //         // console.error('Jetons JWT non trouvés');
    //         history.go(0)
    //         history.push('/list')
    //         return;
    //     }
    // }, []);

    const handleLogin = async () => {
        setLoading(true)
        try {
            const response = await fetch(API_URL+'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": user.email,
                    "mdp": user.password
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                localStorage.setItem('jwtToken', token);
                localStorage.setItem('idUser',data.idUser);
                // console.log(data)
                history.push('/list');
            } else {
                const data = await response.json();
                // console.log(data)
                setMessage(data.message)
            }
        } catch (error) {
            setMessage(error+" "+API_URL)
            // console.error('Erreur réseau', error);
        } finally {
            setLoading(false)
        }
        // history.push('/list');
    };


    return (
        <IonApp>
            <IonContent className="ion-padding">

                <div className="login-container">
                    <div>
                        <IonCardContent >
                            <IonInput
                                className={`${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
                                type="email"
                                label="Adress e-maill"
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
                                value={user.email}
                            required></IonInput>
                            <br />
                            <IonInput
                                // shape={"round"}
                                type={"password"}
                                label="Motde passe"
                                name={"password"}
                                fill={"outline"}
                                labelPlacement="floating"
                                clearInput={true}
                                onIonInput={(event) =>handleInputChange(event)}
                                value={user.password}
                            required></IonInput>
                            <br />
                            <IonLabel color={"danger"}>{message}</IonLabel>

                            {/*<button className={"custom-input"} > Sign Up  </button>*/}
                            <IonButton className={"custom-input"} expand={"full"} shape={"round"} onClick={handleLogin} > Login </IonButton>
                        </IonCardContent>
                        <br/>

                        <div className={"label"}> Vous n'avez pas de compte ? <IonRouterLink href="/signup"> Inscription </IonRouterLink></div>
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
export default Login;