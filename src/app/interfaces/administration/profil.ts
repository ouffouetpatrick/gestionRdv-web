import { TemplateProfil } from './template-profil';
import { UtilisateurProfil } from "./utilisateur-profil";

export interface Profil {
    id?: number;
    libelle: string;
    empty1: string,
    empty2: string,
    empty3: string,
    geler: string,
    dateCreation?: string;
    idusrcreation: string;
    utilisateurProfil?: UtilisateurProfil[];
    templateProfil?: TemplateProfil[]
}