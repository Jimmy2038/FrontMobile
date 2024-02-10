export interface Marque {
    idMarque: number;
    nomMarque: string;
}
export interface Model {
    idModel: number;
    nomModel: string;
    marque: Marque;
}
export interface Transmission {
    idTransmision: number;
    nomTransmission: string;
}
export interface Energie {
    idEnergie: number;
    nomEnergie: string;
}
export interface Annonce {
    idAnnonce:number;
    idUtilisateur: number;
    daty: [
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    model: Model;
    energie: Energie;
    transmission: Transmission;
    kilometrage: number;
    annee: number;
    descri: string;
    prix: number;
    etatString: string;
    etat: number;
    photos:PhotoAnnonce[];
    dateValidation:[
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    dateVente:[
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
}

export interface PhotoAnnonce {
    idSary: string,
    idAnnonce: string,
    nom: string,
    taille: number,
    type: string,
    bin: string,
    binDecode: string
}