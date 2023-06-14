import { ModuleService } from './../../../../../services/administration/module.service';
import { ProfilService } from "./../../../../../services/administration/profil.service";
import { Component, Inject,  OnInit, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl,  FormGroup, Validators, } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModuleFormComponent } from "../../module/moduleForm/moduleForm.component";
import {MatSnackBar} from '@angular/material/snack-bar';
import { Droit } from 'app/interfaces/administration/droit';
import { Profil } from 'app/interfaces/administration/profil';
import { Module } from 'app/interfaces/administration/module';

// import { ProfilModule } from 'app/interfaces/profil-module';

@Component({
    selector: "app-profilForm",
    templateUrl: "./profilForm.component.html",
    styleUrls: ["./profilForm.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ProfilFormComponent implements OnInit {

    profilForm: FormGroup;

    // modules = new FormControl(this.data.profil ? this.data.profil.modules : "", Validators.required);
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private profilService: ProfilService,
        private moduleService: ModuleService,
        public dialogRef: MatDialogRef<ModuleFormComponent>,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { profil: Profil }
    ) {}

    listeModule: Module[] = [];
    listeDroit: Droit[];
    modules = new FormControl(null);
    /**
     * On init
     */
    ngOnInit(): void {
        this.getModules();
        this.generateForm();
    }

    generateForm(){
        // Reactive Form
        this.profilForm = this._formBuilder.group({
            id: [this.data.profil ? this.data.profil.id : null],
            libelle: [this.data.profil ? this.data.profil.libelle : "", Validators.required],
            empty1: [this.data.profil ? this.data.profil.empty1 : null ],
            empty2: [this.data.profil ? this.data.profil.empty2 : null ],
            empty3: [this.data.profil ? this.data.profil.empty3 : null ],
            geler: [this.data.profil ? this.data.profil.geler : 0 ],
            dateCreation: [this.data.profil ? this.data.profil.dateCreation : new Date() ],
            idusrcreation: [this.data.profil ? this.data.profil.idusrcreation : 1 ]
        });
    }

    save(): void {
    
        // this.inProgress = true; // Démarre le loader
        const profil = {
            ...this.profilForm.value,
            modulesAjouter: [],
            // modulesAjouter: this.recupererListeModuleAjouter(),
            // modulesRetirer: this.recupererListeModuleRetirer(),
            // modulesModifier: this.recupererListeModuleModifier(),
        }
        
        const send = this.profilService.saveProfilAvecModuleEtcDroit(profil)
        
        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                await this._snackBar.open('Profil sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                await this.dialogRef.close({status: "save"});
  
            } else {
                this._snackBar.open('Impossible d\'enregistrer l\'profil', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement  profil', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });      
    }
    
    getModules() {
        // this.inProgress = true; // Démarre le loader
        const getModules = this.moduleService.query({
            order: { id: "DESC" },
            relations: ["moduleDroit", "moduleDroit.droit"],
        });

        getModules.subscribe((result) => {
            this.listeModule = result
            // this.listeModule = result.map((x: Module) => {
            //     return {
            //         ...x,
            //         moduleDroit: x.moduleDroit.map((y) => {
            //             return {
            //                 ...y,
            //                 droit: {
            //                     ...y.droit,isCheck: this.verifierDroitSelectionner(x,y.droit),
            //                 },
            //             };
            //         }),
            //     };
            // });
        });
    }

    // verifierDroitSelectionner(module: Module, droit: Droit): boolean {
    //     let verifier = false; // Statut de la recherche

    //     if(this.data.profil){
    //         for (let indexprofilModule = 0; indexprofilModule < this.data.profil.profilModule.length; indexprofilModule++) {
    //             const profilModule = this.data.profil.profilModule[indexprofilModule];
    //             if (profilModule.module.id == module.id) {
    //                 for (let indexprofilModuleDroit = 0; indexprofilModuleDroit < profilModule.profilModuleDroit.length; indexprofilModuleDroit++) {
    //                     const profilModuleDroit = profilModule.profilModuleDroit[indexprofilModuleDroit];
    
    //                     if (profilModuleDroit.droit.id == droit.id) {
    //                         verifier = true;
    //                         break;
    //                     }
    //                 }
    
    //                 break;
    //             }
    //         }
    //     }

    //     return verifier;
    // }

    // recupererListeModuleAjouter() {
    //     const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
    //     let listeNouveauModule: any[] = this.modules.value; // Tableau des modules retournées
    //     const listeAncienModule: ProfilModule[] = this.data.profil
    //         ? this.data.profil.profilModule
    //         : []; // Tableau des anciens modules

    //     // Si d'anciens modules existent, on effectue le traitement sinon on le saute.
    //     if (listeAncienModule.length > 0) {
    //         // On parcours la liste des modules selectionnées
    //         for (let i = 0; i < listeModule.length; i++) {
    //             const module = listeModule[i];

    //             // Pour chacun des modules de selectionnées, on vérifie s'il n'exite pas parmi les anciens
    //             // s'il existe on le retire des modules à ajouter
    //             for (
    //                 let indexAncienModule = 0;
    //                 indexAncienModule < listeAncienModule.length;
    //                 indexAncienModule++
    //             ) {
    //                 const ancienModule = listeAncienModule[indexAncienModule];

    //                 if (module.id == ancienModule.module.id) {
    //                     listeNouveauModule = listeNouveauModule.filter(
    //                         (x) => x.id != ancienModule.module.id
    //                     );
    //                     break;
    //                 }
    //             }
    //         }
    //     }

    //     // Formatage des données retournées (correspondance avec les attentes de l'api)
    //     return listeNouveauModule.map((module) => {
    //         return {
    //             ...module,
    //             droitsAjouter: module.moduleDroit.filter(
    //                 (x) => x.droit.isCheck
    //             ).map(x => x.droit)
    //         };
    //     });
    // }

    // recupererListeModuleRetirer() {
    //     const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
    //     let listeModuleRetirer: ProfilModule[] = this.data.profil ? this.data.profil.profilModule : []; // Tableau des modules retournées
    //     const listeAncienModule: ProfilModule[] = this.data.profil
    //         ? this.data.profil.profilModule
    //         : []; // Tableau des anciens modules

    //     // Si d'anciens modules existent, on effectue le traitement sinon on le saute.
    //     if (listeAncienModule.length > 0) {
    //         // On parcours la liste des anciens modules selectionnées
    //         for (let i = 0; i < listeAncienModule.length; i++) {
    //             const ancienModule = listeAncienModule[i];

    //             // Pour chacun des anciens modules selectionnées, on vérifie s'il n'exite pas parmi la selection
    //             // s'il existe on le retire des modules à ajouter
    //             for (
    //                 let indexModule = 0;
    //                 indexModule < listeModule.length;
    //                 indexModule++
    //             ) {
    //                 const module = listeModule[indexModule];

    //                 if (ancienModule.module.id == module.id) {
    //                     listeModuleRetirer = listeModuleRetirer.filter(
    //                         (x) => x.module.id != module.id
    //                     );
    //                     break;
    //                 }
    //             }
    //         }
    //     }

    //     // Formatage des données retournées (correspondance avec les attentes de l'api)
    //     return listeModuleRetirer.map((profilModule) => {
    //         return {
    //             ...profilModule.module,
    //             idProfilModule: profilModule.id
    //         };
    //     });
    // }

    // recupererListeModuleModifier() {
    //     const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
    //     const listeAncienModule: ProfilModule[] = this.data.profil
    //         ? this.data.profil.profilModule
    //         : []; // Tableau des anciens modules
    //     let listeModuleModifier: any[] = []

    //     // Si d'anciens modules existent, on effectue le traitement sinon on le saute.
    //     if (listeAncienModule.length > 0) {
    //         // On parcours la liste des modules selectionnées
    //         for (let i = 0; i < listeModule.length; i++) {
    //             const module = listeModule[i];

    //             // Pour chacun des modules de selectionnées, on vérifie s'il n'exite pas parmi les anciens
    //             // s'il existe on récupère le module sinon on le laisse
    //             for (
    //                 let indexAncienModule = 0;
    //                 indexAncienModule < listeAncienModule.length;
    //                 indexAncienModule++
    //             ) {
    //                 const ancienModule = listeAncienModule[indexAncienModule];

    //                 if (module.id == ancienModule.module.id) {
    //                     listeModuleModifier.push({
    //                         ...module,
    //                         idProfilModule: ancienModule.id
    //                     })
    //                     break;
    //                 }
    //             }
    //         }
    //     }

    //     let modulesModifierFinale = [];

    //     // Pour chacune des modules anciens ayant été possiblement modifier
    //     for (let i = 0; i < listeModuleModifier.length; i++) {
    //         const moduleModifier = listeModuleModifier[i];
    //         let module = {
    //             ...moduleModifier,
    //             droitsAjouter: [],
    //             droitsRetirer: [],
    //         };

    //         // Pour chacun des droits du module
    //         for (let iModuleDroit = 0; iModuleDroit < moduleModifier.moduleDroit.length; iModuleDroit++) {
    //             const moduleDroit  = moduleModifier.moduleDroit[iModuleDroit];

    //             // On verifie voir si ce droit était déja selectionner
    //             let ancienDroit = null
    //             for (let iAncienModule = 0; iAncienModule < listeAncienModule.length; iAncienModule++) {
    //                 const ancienModule = listeAncienModule[iAncienModule];
    //                 if (ancienModule.module.id == module.id) {
                        
    //                     ancienDroit = ancienModule.profilModuleDroit.find(x => x.droit.id == moduleDroit.droit.id)
    //                 }
    //             }

    //             // Si le droit n'existait pas et qu'il est coché alors on l'ajoute aux nouveaux droits
    //             if (!ancienDroit && moduleDroit.droit.isCheck) {
    //                 module.droitsAjouter.push(moduleDroit.droit)

    //             }
    //             // Sinon si c'est un ancien droit et qu'il est décoché alors on le retire des droits
    //             else if (
    //                 ancienDroit &&
    //                 moduleDroit.droit.isCheck != this.verifierDroitSelectionner(module, moduleDroit.droit)
    //             ) {
    //                 module.droitsRetirer.push({
    //                     ...moduleDroit.droit,
    //                     idProfilModuleDroit: ancienDroit.id
    //                 })
    //             }
    //         }
    //         console.log(module);
    //         if(module.droitsAjouter.length > 0 || module.droitsRetirer.length > 0){
    //             modulesModifierFinale.push(module);
    //         }
    //     }

    //     // Formatage des données retournées (correspondance avec les attentes de l'api)
    //     return modulesModifierFinale
    // }


    comparer(o1: any, o2: any): boolean {
      // if possible compare by object's name, and not by reference.
      return o1 && o2 ? o1.id === o2.id : o2 === o2;
    }
}
