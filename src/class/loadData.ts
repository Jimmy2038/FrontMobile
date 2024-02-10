import {useEffect, useState} from "react";
import API_URL from "../types/config";
import {Marque, Model} from "../types/Annonce";


export const loadData = () => {

    const [marques, setMarques] = useState<Marque[]>([])
    const [models, setModels] = useState([])
    const [transmissions, setTransmissions] = useState([])
    const [energie, setEnergie] = useState([])
    const [idMarque, setIdMarque] = useState()

    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        getAllModel()
        getAllTransmission()
        getAllEnergie()
        getAllMarque()
    }, []);

    const getAllMarque = async () => {
        try {
            const response = await fetch(API_URL+'/marque/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMarques(data);

                console.log(models)
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    };
    const getAllModel = async () => {
        try {
            const response = await fetch(API_URL+'/model/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setModels(data);

                console.log(models)
                // console.log(data)
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    };

    const getModels = async (id:string) => {
        try {
            const response = await fetch(API_URL+`/model/getByMarque/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setModels(data)
                console.log(transmissions)
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    };

    const getAllTransmission = async () => {
        try {
            const response = await fetch(API_URL+'/transmission/getAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTransmissions(data)
                console.log(transmissions)
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    };
    const getAllEnergie = async () => {
        try {
            const response = await fetch(API_URL+'/energie/getAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setEnergie(data)
                console.log(energie)
            } else {
                console.error('Accès non autorisé');
            }
        } catch (error) {
            console.error('Erreur réseau', error);
        } finally {
            // setLoading(false);
        }
    };

    return {
        models,
        transmissions,
        energie,
        marques,
        getModels
    }
}