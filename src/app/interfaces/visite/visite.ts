import { Utilisateur } from "../administration/utilisateur";
import { Motif } from "../motif/motif";
import { StatutVisite } from "../statutVisite/statutVisite";

export interface Visite {
    id?: number;
    date: string;
    heure: string;
    objet: string;
    motif: Motif;
    employe?: Utilisateur;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
    statutVisite:StatutVisite[];
}
