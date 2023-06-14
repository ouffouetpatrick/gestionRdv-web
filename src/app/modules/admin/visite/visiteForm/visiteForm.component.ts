import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { Visite } from 'app/interfaces/visite/visite';
import { VisiteService } from 'app/services/visite/visite.service';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
    selector     : 'motif-compose',
    templateUrl  : './visiteForm.component.html',
    styleUrls    : ["./visiteForm.component.scss"],
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None
})
export class VisiteFormComponent implements OnInit
{
    formFieldHelpers: string[] = [''];
    visiteForm: FormGroup;
    //restriction sur la selection d'une date et heure anterieure
    currentDate : any = new Date();
    user: Utilisateur;
    public minDate: moment.Moment | any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        public matDialogRef: MatDialogRef<VisiteFormComponent>,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _visiteService: VisiteService,
        private _userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: { visite: Visite },
        private datePipe: DatePipe,
    )
    {
      //personnaliser le format d'une date (variable) 
      // this.currentDate = this.datePipe.transform(this.currentDate, 'dd/M/yyyy,HH:mm:ss');
    }

    ngOnInit(): void
    {
      this._userService.user$
        .pipe((takeUntil(this._unsubscribeAll)))
        .subscribe((user: any) => {
          this.user = user;               
      });

        // Create the form
        this.visiteForm = this._formBuilder.group({
            id: [this.data.visite ? this.data.visite.id : null],
            date   : [this.data.visite ? this.data.visite.date : '', [Validators.required]],
            heure     : [this.data.visite ? this.data.visite.heure : '',],
            objet: [ this.data.visite ? this.data.visite.objet : '', [Validators.required]],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date().toISOString()],
            idusrcreation   : [this.user.id],//id de l'utilisateur connecté
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    save(): void {

        // this.inProgress = true; // Démarre le loader
        const visite: Visite = this.visiteForm.value;
        const send = (!this.visiteForm.value.id) ? this._visiteService.demandeVisite(visite) : this._visiteService.update(this.visiteForm.value);
    
        send.subscribe(async (result) => {
          // this.inProgress = false; // stop le loader
          if (result) {
            this._snackBar.open('Visite enregistrée', 'Fermer', { duration: 2000, panelClass: ['success-snackbar'] });
            this.matDialogRef.close({ status: 'save' });
    
          } else {
            this._snackBar.open('Impossible d\'enregistrer la visite', 'Fermer', { duration: 2000, panelClass: ['warning-snackbar'] });
          }
        },
          (err) => {
            this._snackBar.open('Erreur enregistrement  visite', 'Fermer', { duration: 2000, panelClass: ['error-snackbar'] });
          });
      }
    
      close(): void {
        // Close the dialog
        this.matDialogRef.close();
      }
 
}
