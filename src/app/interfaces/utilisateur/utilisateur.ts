import { Visite } from "../visite/visite";

export interface Utilisateur {
    id?: number;
    nom: string;
    prenom: string;
    poste: string;
    sexe: string;
    email: string;
    dateNaissance?: string;
    visite: Visite[]
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
}
