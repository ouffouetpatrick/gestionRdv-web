import { StatutVisite } from "../statutVisite/statutVisite";

export interface Statut {
    id?: number;
    libelle: string;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
    statutVisite:StatutVisite[];
}
