import { ModuleDroit } from './../../../../../interfaces/administration/module-droit';
import { Droit } from "./../../../../../interfaces/administration/droit";
import { DroitService } from "./../../../../../services/administration/droit.service";
import { ModuleService } from "../../../../../services/administration/module.service";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Module } from "./../../../../../interfaces/administration/module";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: "app-moduleForm",
    templateUrl: "./moduleForm.component.html",
    styleUrls: ["./moduleForm.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ModuleFormComponent implements OnInit {
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private moduleService: ModuleService,
        private droitService: DroitService,
        public dialogRef: MatDialogRef<ModuleFormComponent>,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { module: Module }
    ) {}

    moduleForm: FormGroup;
    droits = new FormControl(this.data.module ? this.data.module.moduleDroit.map(x => x.droit) : "", Validators.required);
    listeDroit: Droit[];
    listeModuleParent: Module[]

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getDroit();
        this.getModule();
        this.generateForm();
    }

    generateForm(){
        // Reactive Form
        this.moduleForm = this._formBuilder.group({
            id: [this.data.module ? this.data.module.id : null],
            libelle: [this.data.module ? this.data.module.libelle : "", Validators.required],
            icone: [this.data.module ? this.data.module.icone : ""],
            lien: [this.data.module ? this.data.module.lien : ""],
            moduleParent: [null],
            empty1: [this.data.module ? this.data.module.empty1 : null ],
            empty2: [this.data.module ? this.data.module.empty2 : null ],
            empty3: [this.data.module ? this.data.module.empty3 : null ],
            geler: [this.data.module ? this.data.module.geler : 0 ],
            dateCreation: [this.data.module ? this.data.module.dateCreation : new Date().toISOString() ],
            idusrcreation: [this.data.module ? this.data.module.idusrcreation : 1 ]
        });
        
        if(this.data.module) {

          this.moduleForm.get('moduleParent').setValue(this.data.module.moduleParent);
        }
    }

    save(): void {
    
        // this.inProgress = true; // Démarre le loader
        const droit = {
            ...this.moduleForm.value,
            droitsAjouter: this.recupererListeDroitAjouter(),
            droitsRetirer: this.recupererListeDroitRetirer(),
        }        

        const send = this.moduleService.saveModuleAvecDroit(droit);
        
        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                this._snackBar.open('Module sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                this.dialogRef.close({status: "save"});
  
            } else {
                this._snackBar.open('Impossible d\'enregistrer le Module', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement module', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });      
    }

    getModule() {
        const getModule = this.moduleService.query({
            order: { id: "DESC" },
            relations: ["moduleParent"],
            where: { moduleParent: null }
        });

        getModule.subscribe((result) => {
            this.listeModuleParent = result;
        });
    }

    getDroit() {
        const getDroit = this.droitService.query({ order: { id: "DESC" } });

        getDroit.subscribe((result) => {
            this.listeDroit = result;
        });
    }

    recupererListeDroitAjouter(){
        const listeDroit: Droit[] = this.droits.value // Tableau des droits sélectionnées
        let listeNouveauDroit: any[] = this.droits.value // Tableau des droits retournées
        const listeAncienDroit = this.data.module ? this.data.module.moduleDroit : [] // Tableau des anciens droits
        
        // Si d'anciens droits existes, on effectue le traitement sinon on le saute.
        if (listeAncienDroit.length > 0) {
            
            // On parcours la liste des droits selectionnées
            for (let i = 0; i < listeDroit.length; i++) {
                const droit = listeDroit[i];

                // Pour chacun des droits de selectionnées, on vérifie s'il n'exite pas parmi les anciens
                // s'il existe on le retire des droits à ajouter
                for (let indexAncienDroit = 0; indexAncienDroit < listeAncienDroit.length; indexAncienDroit++) {
                    const ancienDroit = listeAncienDroit[indexAncienDroit];

                    if (droit.id == ancienDroit.droit.id) {
                        listeNouveauDroit = listeNouveauDroit.filter(x => x.id != ancienDroit.droit.id)
                        break
                    }
                }
            }
        }

        return listeNouveauDroit;
    }

    recupererListeDroitRetirer(){
        const listeDroit: Droit[] = this.droits.value // Tableau des droits sélectionnées
        const listeAncienDroit = this.data.module ? this.data.module.moduleDroit : [] // Tableau des anciens droits
        let listeDroitRetirer: ModuleDroit[] = this.data.module ? this.data.module.moduleDroit : [] // Tableau des droits a retirer

        // Si d'anciens droits existes, on effectue le traitement sinon on le saute.
        if (listeAncienDroit.length > 0) {
            
            // On parcours la liste des anciens droits 
            for (let i = 0; i < listeAncienDroit.length; i++) {
                const ancienDroit = listeAncienDroit[i];

                // Pour chacun des anciens droits , on vérifie s'il n'exite pas parmi la selection
                // s'il existe on le retire des droits à retirer
                for (let indexDroit = 0; indexDroit < listeDroit.length; indexDroit++) {
                    const droit = listeDroit[indexDroit];

                    if (ancienDroit.droit.id == droit.id) {
                        listeDroitRetirer = listeDroitRetirer.filter(x => x.droit.id != droit.id)
                        break
                    }
                }
            }
        }

        return listeDroitRetirer.map(moduleDroit => {
            return {
                ...moduleDroit.droit,
                idModuleDroit: moduleDroit.id
            }

        });
    }


    comparer(o1: any, o2: any) {
        return o1.id == o2.id;
    }

    close(): void
    {
        // Close the dialog
        this.dialogRef.close();
    }
}
