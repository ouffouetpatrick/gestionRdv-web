import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { Visite } from 'app/interfaces/visite/visite';
import { VisiteService } from 'app/services/visite/visite.service';

@Component({
    selector     : 'motif-compose',
    templateUrl  : './attributeForm.component.html',
    styleUrls    : ["./attributeForm.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class attributeFormComponent implements OnInit
{
    formFieldHelpers: string[] = [''];
    attributeForm: FormGroup;
    //variable contenant la liste des utilisateurs(employés)
    //retounée par la fonction getUtilisateur()
    listeUtilisateur: Utilisateur[] = [];
    listeNbrVisiteEmploye: any[] = [];
    //contient l'utilisateur selectionné
    // utilisateurs = new FormControl("", Validators.required);
    isLoading: boolean = false;
    /**
     * Constructor
     * 
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<attributeFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _visiteService: VisiteService,
        @Inject(MAT_DIALOG_DATA) public data: { visite: Visite }
    ){}

    /**
     * On init
     */

    ngOnInit(): void{
      this.getUtilisateur()
      this.generateForm();
    }

  getUtilisateur() {
    const getProfil = this._visiteService.getListeEmployeAndNbrVisite();
    getProfil.subscribe((result) => {
        this.listeUtilisateur = result;
    });
  }

  generateForm(): void
  {
    // Creation du formulaire d'attribution de visite
    this.attributeForm = this._formBuilder.group({
      id: [this.data.visite ? this.data.visite.id : null],
      date: [this.data.visite ? this.data.visite.date : ''],
      heure: [this.data.visite ? this.data.visite.heure : ''],
      objet: [ this.data.visite ? this.data.visite.objet : ''],
      employe: [ this.data.visite ? this.data.visite.employe : ''],
      empty1: [null],
      empty2: [null],
      empty3: [null],
      geler: [0],
      dateCreation: [new Date().toISOString()],
      idusrcreation   : [ this.data.visite ? this.data.visite.idusrcreation : ''],
    });
  }
  
  save(): void {
        const visite: Visite = this.attributeForm.value;
        const send = this._visiteService.attribuerVisite(visite);
        send.subscribe(async (result) => {
          // this.inProgress = false; // stop le loader
          if (result) {
            this._snackBar.open('visite attribuée avec succès', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'attribuer la visite', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur attribution  visite', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
    }
    
  close(): void {
    // Close the dialog
    this.matDialogRef.close();
  }
 
}
