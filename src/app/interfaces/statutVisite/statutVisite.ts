import { Statut } from "../statut/statut";
import { Visite } from "../visite/visite";

export interface StatutVisite {
    id?: number;
    actif: number;
    effectue: number;
    satisfaction: string;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
    visite: Visite;
    statut:Statut;
}
