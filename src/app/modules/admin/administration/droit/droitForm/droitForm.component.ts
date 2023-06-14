import { ModuleService } from './../../../../../services/administration/module.service';
import { DroitService } from "./../../../../../services/administration/droit.service";
import { Component, Inject,  OnInit, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl,  FormGroup, Validators, } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';
import { Module } from 'app/interfaces/administration/module';
import { Droit } from 'app/interfaces/administration/droit';

@Component({
    selector: "app-droitForm",
    templateUrl: "./droitForm.component.html",
    styleUrls: ["./droitForm.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DroitFormComponent implements OnInit {

    droitForm: FormGroup;

    // modules = new FormControl(this.data.droit ? this.data.droit.modules : "", Validators.required);
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private droitService: DroitService,
        private moduleService: ModuleService,
        public dialogRef: MatDialogRef<DroitFormComponent>,
        private _snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: { droit: Droit }
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
      console.log(this.data);
      
        // Reactive Form
        this.droitForm = this._formBuilder.group({
            id: [this.data.droit ? this.data.droit.id : null],
            libelle: [this.data.droit ? this.data.droit.libelle : "", Validators.required],
            empty1: [this.data.droit ? this.data.droit.empty1 : null ],
            empty2: [this.data.droit ? this.data.droit.empty2 : null ],
            empty3: [this.data.droit ? this.data.droit.empty3 : null ],
            geler: [this.data.droit ? this.data.droit.geler : 0 ],
            dateCreation: [this.data.droit ? this.data.droit.dateCreation : new Date() ],
            idusrcreation: [this.data.droit ? this.data.droit.idusrcreation : 1 ]
        });

        // if(this.data.droit) {
        //   this.modules.setValue(this.data.droit.modules)
        // }
    }

    save(): void {
    
        // this.inProgress = true; // Démarre le loader
        const droit: Droit  = this.droitForm.value;
        const send = (!this.droitForm.value.id) ? this.droitService.save(droit) : this.droitService.update(this.droitForm.value);
        
        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                this._snackBar.open('Droit sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                this.dialogRef.close({status: "save"});
  
            } else {
                this._snackBar.open('Impossible d\'enregistrer l\'droit', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement  droit', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });      
    }
    
    public get listeModule() : Module[] {
      return this.moduleService.listeModule
    }


    comparer(o1: any, o2: any): boolean {
      // if possible compare by object's name, and not by reference.
      return o1 && o2 ? o1.id === o2.id : o2 === o2;
    }

    close(): void
    {
        // Close the dialog
        this.dialogRef.close();
    }
}
