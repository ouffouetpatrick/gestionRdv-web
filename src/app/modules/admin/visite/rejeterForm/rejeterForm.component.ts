import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { Motif } from 'app/interfaces/motif/motif';
import { Visite } from 'app/interfaces/visite/visite';
import { MotifService } from 'app/services/parametrage/motif.service';
import { VisiteService } from 'app/services/visite/visite.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'motif-compose',
    templateUrl  : './rejeterForm.component.html',
    styleUrls    : ["./rejeterForm.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class rejeterFormComponent implements OnInit
{
    formFieldHelpers: string[] = [''];
    rejeterForm: FormGroup;
    //variable contenant la liste des utilisateurs(employés)
    //retounée par la fonction getUtilisateur()
    listeMotif: Motif[] = [];
    //contient l'utilisateur selectionné
    // motifs = new FormControl("", Validators.required);
    isLoading: boolean = false;
    user: Utilisateur;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     * 
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<rejeterFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _motifService: MotifService,
        private _visiteService: VisiteService,
        private _userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: { visite: Visite }
    ){}


    ngOnInit(): void{
      // Fonction pour recupérer l'utilisateur connecté
      this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
              });
      this.getMotif()
      this.generateForm();
    }

  getMotif() {
    // this.inProgress = true; // Démarre le loader
    const getMotif = this._motifService.query({order: { id: 'DESC'}});

    getMotif.subscribe((result) => {
        this.listeMotif = result;
        console.log(this.listeMotif,'listeMotif');
    });
    
  }

  generateForm(): void
  {
    // Create the form
    this.rejeterForm = this._formBuilder.group({
      id: [this.data.visite ? this.data.visite.id : null],
      date   : [this.data.visite ? this.data.visite.date : ''],
      heure     : [this.data.visite ? this.data.visite.heure : ''],
      objet: [ this.data.visite ? this.data.visite.objet : ''],
      motif: [ this.data.visite ? this.data.visite.motif : ''],
      empty1: [ this.user.utilisateurProfil[0].profil.id == 1? "admin" : "employe"],
      empty2: [null],
      empty3: [null],
      geler: [0],
      dateCreation: [new Date().toISOString()],
      idusrcreation   : [ this.data.visite ? this.data.visite.idusrcreation : ''],
    });
  }
  
  save(): void {
      // this.inProgress = true; // Démarre le loader
      const visite: Visite = this.rejeterForm.value;
      // const motif = {
      //   ...this.rejeterForm.value,
      //   motifs: this.motifs.value,
      //   empty1: this.user.utilisateurProfil[0].profil.id == 1? "admin" : "employe"
      // };
      const send = this._visiteService.rejeterVisite(visite);
      send.subscribe(async (result) => {
        // this.inProgress = false; // stop le loader
        if (result) {
          this._snackBar.open('Visite rejetée avec succès', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
          this.matDialogRef.close({ status: 'save' });
  
        } else {
          this._snackBar.open('Impossible de rejeter la visite', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
        }
      },
        (err) => {
          this._snackBar.open('Erreur rejet  visite', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
        });
    }
    
  close(): void {
    // Close the dialog
    this.matDialogRef.close();
  }
 
}
