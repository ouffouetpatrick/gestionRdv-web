import { Droit } from './droit';
import { Utilisateur } from './utilisateur';
import { Module } from './module';
import { TemplateProfil } from './template-profil';
export interface UtilisateurModuleDroit {
    id?: number;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
    utilisateur?: Utilisateur;
    module?: Module;
    droit?: Droit;
    templateProfil?: TemplateProfil;
}