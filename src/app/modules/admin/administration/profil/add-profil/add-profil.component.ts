import { TemplateProfil } from './../../../../../interfaces/administration/template-profil';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { ModuleService } from "app/services/administration/module.service";
import { ProfilService } from "app/services/administration/profil.service";
import { Droit } from 'app/interfaces/administration/droit';
import { Module } from 'app/interfaces/administration/module';
import { Profil } from 'app/interfaces/administration/profil';

@Component({
    selector: "app-add-profil",
    templateUrl: "./add-profil.component.html",
    styleUrls: ["./add-profil.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AddProfilComponent implements OnInit {
    panelOpenState = false;

    profilForm: FormGroup;
    listeProfil: Profil[] = [];
    listeModule: Module[] = [];
    listeDroit: Droit[];
    listeModuleDroitAttribuer = []

    profil: Profil;

    isLoading: boolean = false;
    
    modules = new FormControl("", Validators.required);

    routeSubscription: Subscription;

    displayedColumns: string[] = ['modules', 'fonctionnalites'];

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private profilService: ProfilService,
        private moduleService: ModuleService,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.generateForm();
        this.getModules();
        this.getProfil();
    }

    generateForm(){
        // Reactive Form
        this.profilForm = this._formBuilder.group({
            id: [null, Validators.required],
            libelle: ["", Validators.required],
            empty1: [null],
            empty2: [null],
            empty3: [null],
            geler: [0],
            dateCreation: [new Date()],
            idusrcreation: [1]
        });
    }

    getDefaultValue(){
        if(this.profil) {
            this.getModuleEtDroitAttribuer();
            // remplissage du formulaire avec les infos du profil
            this.profilForm.setValue({
                id: this.profil.id,
                libelle: this.profil.libelle,
                empty1: this.profil.empty1,
                empty2: this.profil.empty2,
                empty3: this.profil.empty3,
                geler: this.profil.geler,
                dateCreation: this.profil.dateCreation,
                idusrcreation: this.profil.idusrcreation,
            });

            this.modules.setValue(this.listeModuleDroitAttribuer);
            this.addCheckDroitToModules();
        }
        
    }

    getModuleEtDroitAttribuer(){
        let moduleTemp = []
        let modules: Module[] = [];

        if (this.profil) {
            // On parcours le tableau des templates profil
            for (let indexTemplateProfil = 0; indexTemplateProfil < this.profil.templateProfil.length; indexTemplateProfil++) {

                const template = this.profil.templateProfil[indexTemplateProfil];
                
                // Si le module n'est pas déja traité
                if(template.module && !moduleTemp.includes(template.module.id)){

                    let droits = [] //Liste des droits pour ce module

                    // ajout du module à la liste des traités
                    moduleTemp = [...moduleTemp, template.module.id]

                    let droitTemp = [] // liste des id des droits déja traités
                    
                    // On récupère la liste des droits séléctionnées du modules 
                    const listeTemplateDroit = this.profil.templateProfil.filter(temp => temp.module.id == template.module.id)

                    // On parcours le liste des droits séléctionnées du modules 
                    for (let indexTemplateDroit = 0; indexTemplateDroit < listeTemplateDroit.length; indexTemplateDroit++) {
                        const templateDroit = listeTemplateDroit[indexTemplateDroit];

                        // si le droit n'est pas déja traité
                        if (templateDroit.droit && !droitTemp.includes(templateDroit.droit.id)) {
                            // ajout du module à la liste des traités
                            droitTemp = [...droitTemp, templateDroit.droit.id]

                            droits = [...droits, templateDroit.droit]
                        }
                        
                    }
                                    
                    // Formatage du module avec ajout de la colonne isCheck au droit selectionné
                    const moduleAttribuer :Module = {
                        ...template.module,

                        moduleDroit: template.module.moduleDroit.map(moduledroit => {
                            return {
                                ...moduledroit,
                                droit: {
                                    ...moduledroit.droit,
                                    
                                    isCheck: droitTemp.includes(moduledroit.droit.id)
                                }
                            }
                        })
                    }
                    modules = [...modules, moduleAttribuer]

                }
            }
        }
        

        this.listeModuleDroitAttribuer = modules;
    }

    getProfil(){
        this.routeSubscription = this.route.queryParams.subscribe(params => {
            
            if(params){
                const getProfil = this.profilService.query({ 
                    where: { id: +params['id'] },
                    relations: [
                        "templateProfil",
                        "templateProfil.droit",
                        "templateProfil.module",
                        "templateProfil.module.moduleDroit",
                        "templateProfil.module.moduleDroit.droit",
                    ],
                });
        
                getProfil.subscribe((result) => {                    
                    this.profil = result[0];
                    this.getDefaultValue();
                });
            }
        });
    }

    save(): void {
        // this.inProgress = true; // Démarre le loader
        const profil = {
            ...this.profilForm.value,
            modulesAjouter: this.recupererListeModuleAjouter(),
            modulesRetirer: this.recupererListeModuleRetirer(),
            modulesModifier: this.recupererListeModuleModifier(),
        };

        const send = this.profilService.saveProfilAvecModuleEtcDroit(profil) ;
        
        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                await this._snackBar.open('Profil sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                this.router.navigateByUrl('/administration/profil')
            } else {
                this._snackBar.open('Impossible d\'enregistrer l\'utilisateur', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement  utilisateur', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });
    }

    getModulesAjouter(){
        const ModuleSelectionnner = this.modules.value;

        let modulesAjouter = [];
        for (let i = 0; i < ModuleSelectionnner.length; i++) {
            const module = ModuleSelectionnner[i];
            
            let droitsAjouter = [];

            for (let indexModuleDroit = 0; indexModuleDroit < module.moduleDroit.length; indexModuleDroit++) {
                const moduleDroit = module.moduleDroit[indexModuleDroit];
                
                if(moduleDroit.droit.isCheck == true) {
                    droitsAjouter = [...droitsAjouter, moduleDroit.droit];
                }
            }

            const moduleAjouter = {
                ...module,
                droitsAjouter
            };
            
            modulesAjouter = [...modulesAjouter, moduleAjouter];
        }

        return modulesAjouter;
    }

    recupererListeModuleAjouter() {
        const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
        let listeNouveauModule: any[] = this.modules.value; // Tableau des modules retournées
        const listeAncienModule: Module[] = this.profil ? this.listeModuleDroitAttribuer : []; // Tableau des anciens modules

        // Si d'anciens modules existent, on effectue le traitement sinon on le saute.
        if (listeAncienModule.length > 0) {
            // On parcours la liste des modules selectionnées
            for (let i = 0; i < listeModule.length; i++) {
                const module = listeModule[i];

                // Pour chacun des modules de selectionnées, on vérifie s'il n'exite pas parmi les anciens
                // s'il existe on le retire des modules à ajouter
                for (
                    let indexAncienModule = 0;
                    indexAncienModule < listeAncienModule.length;
                    indexAncienModule++
                ) {
                    const ancienModule = listeAncienModule[indexAncienModule];

                    if (module.id == ancienModule.id) {
                        listeNouveauModule = listeNouveauModule.filter(
                            (x) => x.id != ancienModule.id
                        );
                        break;
                    }
                }
            }
        }

        // Formatage des données retournées (correspondance avec les attentes de l'api)
        return listeNouveauModule.map((module) => {
            return {
                ...module,
                droitsAjouter: module.moduleDroit.filter(
                    (x) => x.droit.isCheck
                ).map(x => x.droit)
            };
        });
    }

    recupererListeModuleRetirer() {
        const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
        let listeModuleRetirer: Module[] = this.profil ? this.listeModuleDroitAttribuer : []; // Tableau des modules retournées
        const listeAncienModule: Module[] = this.profil ? this.listeModuleDroitAttribuer : []; // Tableau des anciens modules

        // Si d'anciens modules existent, on effectue le traitement sinon on le saute.
        if (listeAncienModule.length > 0) {
            // On parcours la liste des anciens modules selectionnées
            for (let i = 0; i < listeAncienModule.length; i++) {
                const ancienModule = listeAncienModule[i];

                // Pour chacun des anciens modules selectionnées, on vérifie s'il n'exite pas parmi la selection
                // s'il existe on le retire des modules à ajouter
                for (
                    let indexModule = 0;
                    indexModule < listeModule.length;
                    indexModule++
                ) {
                    const module = listeModule[indexModule];

                    if (ancienModule.id == module.id) {
                        listeModuleRetirer = listeModuleRetirer.filter(
                            (x) => x.id != module.id
                        );
                        break;
                    }
                }
            }
        }

        // Formatage des données retournées (correspondance avec les attentes de l'api)
        return listeModuleRetirer
    }

    recupererListeModuleModifier() {
        const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
        const listeAncienModule: Module[] = this.profil ? this.listeModuleDroitAttribuer : []; // Tableau des anciens modules
        let listeModuleModifier: any[] = []

        // Si d'anciens modules existent, on effectue le traitement sinon on le saute.
        if (listeAncienModule.length > 0) {
            // On parcours la liste des modules selectionnées
            for (let i = 0; i < listeModule.length; i++) {
                const module = listeModule[i];

                // Pour chacun des modules de selectionnées, on vérifie s'il n'exite pas parmi les anciens
                // s'il existe on récupère le module sinon on le laisse
                for (
                    let indexAncienModule = 0;
                    indexAncienModule < listeAncienModule.length;
                    indexAncienModule++
                ) {
                    const ancienModule = listeAncienModule[indexAncienModule];

                    if (module.id == ancienModule.id) {
                        listeModuleModifier.push({
                            ...module
                        })
                        break;
                    }
                }
            }
        }

        let modulesModifierFinale = [];

        // Pour chacune des modules anciens ayant été possiblement modifier
        for (let i = 0; i < listeModuleModifier.length; i++) {
            const moduleModifier = listeModuleModifier[i];
            let module = {
                ...moduleModifier,
                droitsAjouter: [],
                droitsRetirer: [],
            };

            // Pour chacun des droits du module
            for (let iModuleDroit = 0; iModuleDroit < moduleModifier.moduleDroit.length; iModuleDroit++) {
                const moduleDroit  = moduleModifier.moduleDroit[iModuleDroit];

                // On verifie voir si ce droit était déja selectionner
                let ancienDroit = null
                for (let iAncienModule = 0; iAncienModule < listeAncienModule.length; iAncienModule++) {
                    const ancienModule = listeAncienModule[iAncienModule];
                    if (ancienModule.id == module.id) {
                        
                        ancienDroit = this.profil.templateProfil.find(x => (
                            x.droit && x.droit.id == moduleDroit.droit.id && x.module.id == ancienModule.id
                        ))
                    }
                }

                // Si le droit n'existait pas et qu'il est coché alors on l'ajoute aux nouveaux droits
                if (!ancienDroit && moduleDroit.droit.isCheck) {
                    module.droitsAjouter.push(moduleDroit.droit)

                }
                // Sinon si c'est un ancien droit et qu'il est décoché alors on le retire des droits
                else if (
                    ancienDroit &&
                    moduleDroit.droit.isCheck != this.verifierDroitSelectionner(module, moduleDroit.droit)
                ) {
                    module.droitsRetirer.push({
                        ...moduleDroit.droit,
                        idTemplateProfil: ancienDroit.id
                    });
                }
            }
            // console.log(module);
            if(module.droitsAjouter.length > 0 || module.droitsRetirer.length > 0){
                modulesModifierFinale.push(module);
            }
        }

        // Formatage des données retournées (correspondance avec les attentes de l'api)
        return modulesModifierFinale
    }

    getModules() {
        // this.inProgress = true; // Démarre le loader
        const getModules = this.moduleService.query({
            order: { id: "DESC" },
            relations: ["moduleDroit", "moduleDroit.droit"],
        });

        getModules.subscribe((result) => {
            this.listeModule = result.map((x: Module) => {
                return {
                    ...x,
                    moduleDroit: x.moduleDroit.map((y) => {
                        return {
                            ...y,
                            droit: {
                                ...y.droit,isCheck: false,
                            },
                        };
                    }),
                };
            });
        });
    }

    addCheckDroitToModules() {
        const liste = this.listeModule;
        this.listeModule = liste.map((x: Module) => {            
            return {
                ...x,
                moduleDroit: x.moduleDroit.map((y) => {
                    return {
                        ...y,
                        droit: {
                            ...y.droit,
                            isCheck: this.verifierDroitSelectionner(x, y.droit),
                        },
                    };
                }),
            };
        });        
    }

    verifierDroitSelectionner(module: Module, droit: Droit): boolean {
        let verifier = false; // Statut de la recherche
        
        if(this.profil){

            // On parcours la liste des modules Attribuer
            for (
                let indexTemplateProfil = 0; indexTemplateProfil < this.profil.templateProfil.length; indexTemplateProfil++
            ) {
                const templateProfil: TemplateProfil = this.profil.templateProfil[indexTemplateProfil];
                if (templateProfil.module.id == module.id && templateProfil.droit && templateProfil.droit.id == droit.id) {
                    verifier = true;
                    break;
                }
            }
        }

        return verifier;
    }

    comparer(o1: any, o2: any): boolean {
        // if possible compare by object's name, and not by reference.
        return o1.id == o2.id;
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}
