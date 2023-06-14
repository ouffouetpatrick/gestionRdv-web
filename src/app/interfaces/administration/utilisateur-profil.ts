import { Profil } from './profil';
import { Utilisateur } from './utilisateur';
export interface UtilisateurProfil {
    id?: number;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
    profil?: Profil;
    utilisateur?: Utilisateur;
}