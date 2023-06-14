import { Visite } from "../visite/visite";

export interface Motif {
    id?: number;
    libelle: string;
    visite: Visite[];
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
}
