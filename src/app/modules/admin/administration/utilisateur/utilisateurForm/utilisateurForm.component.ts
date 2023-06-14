// import { TypeBeneficiaire } from 'app/interfaces/parametre/type-beneficiaire';

import { REGEX_EMAIL, REGEX_STRONG_PASSWORD } from './../../../../../constants';
import { ModuleService } from './../../../../../services/administration/module.service';

import { UtilisateurService } from './../../../../../services/administration/utilisateur.service';
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


import { ProfilService } from "app/services/administration/profil.service";
import {MatSnackBar} from '@angular/material/snack-bar';
// import { TypeBeneficiaireService } from 'app/services/parametre/type-beneficiaire.service';
import { Droit } from 'app/interfaces/administration/droit';
import { Module } from 'app/interfaces/administration/module';
import { Profil } from 'app/interfaces/administration/profil';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';

@Component({
    selector: "app-utilisateurForm",
    templateUrl: "./utilisateurForm.component.html",
    styleUrls: ["./utilisateurForm.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class UtilisateurFormComponent implements OnInit {
    utilisateurForm: FormGroup;
    listeProfil: Profil[] = [];
    // listeTypeBeneficiaire: TypeBeneficiaire[] = [];
    listeModule: Module[] = [];
    listeDroit: Droit[];
    profils = new FormControl("", Validators.required);
    typeBeneficiaire = new FormControl("", Validators.required);

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private profilService: ProfilService,
        // private typeBeneficiaireService: TypeBeneficiaireService,
        private utilisateurService: UtilisateurService,
        public dialogRef: MatDialogRef<UtilisateurFormComponent>,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { utilisateur: Utilisateur }
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getProfil();
        this.getTypeUtilisateur()
        // this.getModules();
        // Reactive Form
        this.generateForm();
    }

    generateForm() {
        this.utilisateurForm = this._formBuilder.group({
            id: [this.data.utilisateur ? this.data.utilisateur.id : null],
            nom: [
                this.data.utilisateur ? this.data.utilisateur.nom : "",
                Validators.required,
            ],
            prenom: [
                this.data.utilisateur ? this.data.utilisateur.prenom : "",
                Validators.required,
            ],
            pseudo: [
                this.data.utilisateur ? this.data.utilisateur.pseudo : "",
                Validators.required,
            ],
            motDePasse: ["", [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
            email: [
                this.data.utilisateur ? this.data.utilisateur.email : "",
                [Validators.required, Validators.email, Validators.pattern(REGEX_EMAIL)]
            ],
            contact: [
                this.data.utilisateur ? this.data.utilisateur.contact : "",
                [Validators.required, Validators.minLength(8), Validators.maxLength(10), Validators.pattern(/^(\d+$)/)]
            ],
            empty1: [
                this.data.utilisateur ? this.data.utilisateur.empty1 : null,
            ],
            empty2: [
                this.data.utilisateur ? this.data.utilisateur.empty2 : null,
            ],
            empty3: [
                this.data.utilisateur ? this.data.utilisateur.empty3 : null,
            ],
            geler: [this.data.utilisateur ? this.data.utilisateur.geler : 0],
            dateCreation: [
                this.data.utilisateur
                    ? this.data.utilisateur.dateCreation
                    : new Date(),
            ],
            idusrcreation: [
                this.data.utilisateur ? this.data.utilisateur.idusrcreation : 1,
            ],
        });
    }

    save(): void {
        // this.inProgress = true; // Démarre le loader
        const utilisateur = {
            ...this.utilisateurForm.value,
            profils: this.profils.value
        };

        const send = this.utilisateurService.saveUtilisateurAvecModuleEtDroit(utilisateur) ;

        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                await this._snackBar.open('Utilisateur sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                await this.dialogRef.close({status: "save"});

            } else {
                this._snackBar.open('Impossible d\'enregistrer l\'utilisateur', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement  utilisateur', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });
    }

    getProfil() {
        // this.inProgress = true; // Démarre le loader
        const getProfil = this.profilService.query({ order: { id: "DESC" } });

        getProfil.subscribe((result) => {
            this.listeProfil = result;
        });
    }

    getTypeUtilisateur() {
        // this.inProgress = true; // Démarre le loader
        // const getTypeUtilisateur = this.typeBeneficiaireService.query({ order: { id: "DESC" } });

        // getTypeUtilisateur.subscribe((result) => {
        //     this.listeTypeBeneficiaire = result;
        //     console.log(this.listeTypeBeneficiaire)
        // });
    }
    
    comparer(o1: any, o2: any): boolean {
        // if possible compare by object's name, and not by reference.
        return o1.id == o2.id;
    }

    close(): void
    {
        // Close the dialog
        this.dialogRef.close();
    }
}
