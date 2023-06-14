import { UtilisateurModuleDroit } from './utilisateur-module-droit';
import { UtilisateurProfil } from './utilisateur-profil';
import { Profil } from './profil';
export interface Utilisateur {
    id?: number
    nom: string;
    prenom: string;
    pseudo: string;
    email: string;
    contact: string;
    motDePasse?: string;
    profil?: Profil;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: string;
    dateCreation?: string;
    idusrcreation: string;
    utilisateurProfil?: UtilisateurProfil[];
    utilisateurModuleDroit?: UtilisateurModuleDroit[];
    avatar?: string;
    status?: string;
}