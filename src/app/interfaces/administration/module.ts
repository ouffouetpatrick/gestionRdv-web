import { ModuleDroit } from './module-droit';
export interface Module {
    id?: number;
    moduleParent?: Module;
    libelle: string;
    icone: string;
    lien: string;
    empty1?: string;
    empty2?: string;
    empty3?: string;
    geler: number;
    dateCreation: string;
    idusrcreation: number;
    sousModules?: Module[]
    moduleDroit?: ModuleDroit[]
}
