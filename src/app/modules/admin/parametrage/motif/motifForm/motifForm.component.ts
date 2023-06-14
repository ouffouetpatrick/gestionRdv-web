import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Motif } from 'app/interfaces/motif/motif';
import { MotifService } from 'app/services/parametrage/motif.service';

@Component({
    selector     : 'motif-compose',
    templateUrl  : './motifForm.component.html',
    styleUrls : ["./motifForm.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class MotifFormComponent implements OnInit
{
    formFieldHelpers: string[] = [''];
    motifForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MotifFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _motifService: MotifService,
        // interface motif
        @Inject(MAT_DIALOG_DATA) public data: { motif: Motif }
    )
    {
    }

     /**
     * On init
     */
     ngOnInit(): void
     {
         // Create the form
         this.motifForm = this._formBuilder.group({
             id: [this.data.motif ? this.data.motif.id : null],
             libelle: [this.data.motif ? this.data.motif.libelle : '', [Validators.required]],
             empty1: [null],
             empty2: [null],
             empty3: [null],
             geler: [0],
             dateCreation: [new Date().toISOString()],
             idusrcreation   : [1],
         });
     }
 
     // -----------------------------------------------------------------------------------------------------
     // @ Public methods
     // -----------------------------------------------------------------------------------------------------
 
     save(): void {

        // this.inProgress = true; // Démarre le loader
        const motif: Motif = this.motifForm.value;
        const send = (!this.motifForm.value.id) ? this._motifService.save(motif) : this._motifService.update(this.motifForm.value);
    
        send.subscribe(async (result) => {
          // this.inProgress = false; // stop le loader
          if (result) {
            this._snackBar.open('motif sauvegardé', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer le motif', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  motif', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
      }
    
     
       close(): void {
         // Close the dialog
         this.matDialogRef.close();
       }
}
