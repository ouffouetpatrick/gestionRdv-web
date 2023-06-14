import { UtilisateurModuleDroit } from './../../../../../interfaces/administration/utilisateur-module-droit';
import { ActivatedRoute, Router } from '@angular/router';
import { REGEX_EMAIL, REGEX_STRONG_PASSWORD } from './../../../../../constants';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { fuseAnimations } from "@fuse/animations";
import { ModuleService } from "app/services/administration/module.service";
import { UtilisateurService } from "app/services/administration/utilisateur.service";
import { Subscription } from 'rxjs';
import { Droit } from 'app/interfaces/administration/droit';
import { Module } from 'app/interfaces/administration/module';
import { Profil } from 'app/interfaces/administration/profil';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';

@Component({
    selector: "app-add-utilisateur",
    templateUrl: "./add-utilisateur.component.html",
    styleUrls: ["./add-utilisateur.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class AddUtilisateurComponent implements OnInit {
    panelOpenState = false;

    utilisateurForm: FormGroup;
    listeProfil: Profil[] = [];
    listeModule: Module[] = [];
    listeDroit: Droit[];

    utilisateur: Utilisateur;

    listeModuleDroitAttribuer = []
    
    modules = new FormControl("", Validators.required);

    routeSubscription: Subscription;

    isLoading: boolean = false;

    displayedColumns: string[] = ['modules', 'fonctionnalites'];

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private utilisateurService: UtilisateurService,
        private moduleService: ModuleService,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getModules();
        this.generateForm();
        this.getUtilisateur()
    }

    generateForm() {
        this.utilisateurForm = this._formBuilder.group({
            id: [this.utilisateur ? this.utilisateur.id : null],
            nom: [
                this.utilisateur ? this.utilisateur.nom : "",
                Validators.required,
            ],
            prenom: [
                this.utilisateur ? this.utilisateur.prenom : "",
                Validators.required,
            ],
            pseudo: [
                this.utilisateur ? this.utilisateur.pseudo : "",
                Validators.required,
            ],
            motDePasse: [this.utilisateur ? this.utilisateur : "", [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
            email: [
                this.utilisateur ? this.utilisateur.email : "",
                [Validators.required, Validators.email, Validators.pattern(REGEX_EMAIL)]
            ],
            contact: [
                this.utilisateur ? this.utilisateur.contact : "",
                Validators.required,
            ],
            empty1: [
                this.utilisateur ? this.utilisateur.empty1 : null,
            ],
            empty2: [
                this.utilisateur ? this.utilisateur.empty2 : null,
            ],
            empty3: [
                this.utilisateur ? this.utilisateur.empty3 : null,
            ],
            geler: [this.utilisateur ? this.utilisateur.geler : 0],
            dateCreation: [
                this.utilisateur
                    ? this.utilisateur.dateCreation
                    : new Date(),
            ],
            idusrcreation: [
                this.utilisateur ? this.utilisateur.idusrcreation : 1,
            ],
        });
    }

    save(): void {
        // this.inProgress = true; // Démarre le loader
        const utilisateur = {
            ...this.utilisateurForm.value,
            modulesAjouter: this.recupererListeModuleAjouter(),
            modulesRetirer: this.recupererListeModuleRetirer(),
            modulesModifier: this.recupererListeModuleModifier(),
        };
        
        console.log(utilisateur);

        const send = this.utilisateurService.updateUtilisateurAvecModuleEtDroit(utilisateur) ;

        send.subscribe(async result => {
            // this.inProgress = false; // stop le loader
            if (result) {
                await this._snackBar.open('Utilisateur sauvegardé', 'Fermer', { duration: 2000 ,panelClass: ['success-snackbar'] });
                this.router.navigateByUrl('/administration/utilisateur')
            } else {
                this._snackBar.open('Impossible d\'enregistrer l\'utilisateur', 'Fermer', { duration: 2000 , panelClass: ['warning-snackbar'] });
            }
        },
        err =>{
          this._snackBar.open('Erreur enregistrement  utilisateur', 'Fermer', { duration: 2000 , panelClass: ['error-snackbar'] });
        });
    }

    getUtilisateur(){
        this.routeSubscription = this.route.params.subscribe(params => {
            
            if(params){
                const getUtilisateur = this.utilisateurService.query({ 
                    where: { id: +params['id'] },
                    relations: [
                        "utilisateurProfil",
                        "utilisateurModuleDroit",
                        "utilisateurModuleDroit.droit",
                        "utilisateurModuleDroit.module",
                        "utilisateurModuleDroit.module.moduleDroit",
                        "utilisateurModuleDroit.module.moduleDroit.droit",
                    ],
                });
        
                getUtilisateur.subscribe((result) => {                    
                    this.utilisateur = result[0];
                    this.getDefaultValue();
                });
            }
        });
    }

    getDefaultValue(){
        if(this.utilisateur) {
            this.getModuleEtDroitAttribuer();
            // remplissage du formulaire avec les infos du profil
            this.utilisateurForm.setValue({
                id: this.utilisateur.id,
                nom: this.utilisateur.nom,
                pseudo: this.utilisateur.pseudo,
                prenom: this.utilisateur.prenom,
                motDePasse: this.utilisateur.motDePasse,
                email: this.utilisateur.email,
                contact: this.utilisateur.contact,
                empty1: this.utilisateur.empty1,
                empty2: this.utilisateur.empty2,
                empty3: this.utilisateur.empty3,
                geler: this.utilisateur.geler,
                dateCreation: this.utilisateur.dateCreation,
                idusrcreation: this.utilisateur.idusrcreation,
            });

            this.modules.setValue(this.listeModuleDroitAttribuer);
            this.addCheckDroitToModules();
        }
        
    }

    getModuleEtDroitAttribuer(){
        let moduleTemp = []
        let modules: Module[] = [];

        if (this.utilisateur) {
            // On parcours le tableau des templates profil
            for (let indexUtilisateurModuleDroit = 0; indexUtilisateurModuleDroit < this.utilisateur.utilisateurModuleDroit.length; indexUtilisateurModuleDroit++) {

                const template = this.utilisateur.utilisateurModuleDroit[indexUtilisateurModuleDroit];
                
                // Si le module n'est pas déja traité
                if(template.module && !moduleTemp.includes(template.module.id)){

                    let droits = [] //Liste des droits pour ce module

                    // ajout du module à la liste des traités
                    moduleTemp = [...moduleTemp, template.module.id]

                    let droitTemp = [] // liste des id des droits déja traités
                    
                    // On récupère la liste des droits séléctionnées du modules 
                    const listeTemplateDroit = this.utilisateur.utilisateurModuleDroit.filter(temp => temp.module.id == template.module.id)

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

    recupererListeModuleAjouter() {
        const listeModule: Module[] = this.modules.value; // Tableau des modules sélectionnées
        let listeNouveauModule: any[] = this.modules.value; // Tableau des modules retournées
        const listeAncienModule: Module[] = this.utilisateur ? this.listeModuleDroitAttribuer : []; // Tableau des anciens modules

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
        let listeModuleRetirer: Module[] = this.utilisateur ? this.listeModuleDroitAttribuer : []; // Tableau des modules retournées
        const listeAncienModule: Module[] = this.utilisateur ? this.listeModuleDroitAttribuer : []; // Tableau des anciens modules

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
        const listeAncienModule: Module[] = this.utilisateur ? this.listeModuleDroitAttribuer : []; // Tableau des anciens modules
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
                        
                        ancienDroit = this.utilisateur.utilisateurModuleDroit.find(x => (
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
                        idUtilisateurModuleDroit: ancienDroit.id
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
        console.log(liste);
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
        
        if(this.utilisateur){

            // On parcours la liste des modules Attribuer
            for (
                let indexUtilisateurModuleDroit = 0; indexUtilisateurModuleDroit < this.utilisateur.utilisateurModuleDroit.length; indexUtilisateurModuleDroit++
            ) {
                const utilisateurModuleDroit: UtilisateurModuleDroit = this.utilisateur.utilisateurModuleDroit[indexUtilisateurModuleDroit];
                if (utilisateurModuleDroit.module.id == module.id && utilisateurModuleDroit.droit && utilisateurModuleDroit.droit.id == droit.id) {
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
}
