import {AfterViewInit,ChangeDetectionStrategy,ChangeDetectorRef,Component,OnDestroy,OnInit,ViewChild,ViewEncapsulation} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import {debounceTime,map,merge,Observable,startWith,Subject,switchMap,takeUntil,} from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Visite } from 'app/interfaces/visite/visite';
import { VisiteService } from 'app/services/visite/visite.service';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { attributeFormComponent } from './attributeForm/attributeForm.component';
import { rejeterFormComponent } from './rejeterForm/rejeterForm.component';
import { UserService } from 'app/core/user/user.service';
import { Utilisateur } from 'app/interfaces/administration/utilisateur';
import { StatutVisite } from 'app/interfaces/statutVisite/statutVisite';
import { GestionEtatsService } from 'app/services/gestion-etats/gestion-etats.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { VisiteFormComponent } from './visiteForm/VisiteForm.component';

@Component({
    selector: 'visite',
    templateUrl: './visite.component.html',
    styleUrls: ['./visite.component.scss'],
    animations: fuseAnimations,
    providers: [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class VisiteComponent implements OnInit, AfterViewInit, OnDestroy {
    /*
     * DECLARATION DE VARIABLES
     *
     */
    public listeUser: string[]=[];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('paginationEnAttente') paginationEnAttente: MatPaginator;
    @ViewChild('paginationValidee') paginationValidee: MatPaginator;
    @ViewChild('paginationRejetee') paginationRejetee: MatPaginator;
    @ViewChild('paginationEffectuee') paginationEffectuee: MatPaginator;
    @ViewChild('paginationConfirmee') paginationConfirmee: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'datecreation',
        'demandeur',
        'employe',
        'action'
    ];
    displayedColumnsRejeter: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'datecreation',
        'demandeur',
        'employe',
        'motif',
        'statutRejet',
        'action',
    ];
    displayedColumnsEffectuer: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'datecreation',
        'demandeur',
        'employe',
    ];
    displayedColumnsAttribue: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'demandeur',
        'employe',
        'datecreation',
        'action'
    ];
    displayedColumnsAttente: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'datecreation',
        'statutTraitement',
        'demandeur',
        'employe',
        'action',
    ];
    displayedColumnsConfirmee: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'datecreation',
        'demandeur',
        'employe',
        'action',
    ];
    dataSourceAttente = new MatTableDataSource<any>([]);
    dataSourceValidee = new MatTableDataSource<any>([]);
    dataSourceRejetee = new MatTableDataSource<any>([]);
    dataSourceEffectuee = new MatTableDataSource<any>([]);
    dataSourceConfirmee = new MatTableDataSource<any>([]);
    isLoading: boolean = false;
    nbrAttente: number = 0;
    nbrValidee: number = 0;
    nbrRejetee: number = 0;
    nbrEffectuee: number = 0;
    nbrConfirmee: number = 0;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    // pagination variables
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    validateForm: FormGroup;
    effectuerForm: FormGroup;
    deleteVisiteForm: FormGroup;
    confirmerForm: FormGroup;
    user: Utilisateur;
    statutVisite: StatutVisite;
    // pagination variable, changement de variable en fonction du statut
    // Permet de savoir quelle pagination utilisée
    // Il utilisé dans le html div pagination avec ngif
    showPagination: number = 0;
    isShow : number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    SearchJourform: FormGroup;
    visiteRechercheeJour: Visite[];
    currentDate : any = new Date();
    visiteForm : FormGroup;

    //variable contenant la liste des utilisateurs(employés)
    //retounée par la fonction getUtilisateur()
    listeUtilisateur: Observable<string[]>;
    optionsprofil: string[] = [];

    private _gestionEtatsService: GestionEtatsService;

    // Variable filtrer sur les colonnes
    dateFilter = new FormControl('');
    objetFilter = new FormControl('');
    dateCreationFilter = new FormControl('');
    heureFilter = new FormControl('');
    employeFilter = new FormControl('');

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _visiteService: VisiteService,
        private _userService: UserService,
        //datepipe utilisé pour personnaliser le format d'une date se trouvant dans une variable
        private datePipe: DatePipe,
    ) 
    {
        //personnaliser le format d'une date (variable) 
        this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-ddTHH:mm:ss');
    }

    ngOnDestroy(): void {}

    ngOnInit(): void {

        // Fonction pour recuperer user connecté
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.getVisiteAll(); 
            });
        this.generateForm();
    }

    ngAfterViewInit(): void {}
    
    // Filtrer les visites
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceAttente.filter = filterValue.trim().toLowerCase();
        this.dataSourceValidee.filter = filterValue.trim().toLowerCase();
        this.dataSourceRejetee.filter = filterValue.trim().toLowerCase();
        this.dataSourceEffectuee.filter = filterValue.trim().toLowerCase();
        this.dataSourceConfirmee.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceAttente.paginator) {
            this.dataSourceAttente.paginator.firstPage();
        } else if (this.dataSourceValidee.paginator) {
            this.dataSourceValidee.paginator.firstPage();
        } else if (this.dataSourceRejetee.paginator) {
            this.dataSourceRejetee.paginator.firstPage();
        } else if (this.dataSourceEffectuee.paginator) {
            this.dataSourceEffectuee.paginator.firstPage();
        } else if (this.dataSourceConfirmee.paginator) {
            this.dataSourceConfirmee.paginator.firstPage();
        }
    }

    // fonction ouvrir le formulaire pour enregistrer une visite
    openDialogVisiteForm(visite?: any): void {
        const dialogRef = this._matDialog.open(VisiteFormComponent, {
            data: {
                visite: visite ? visite : undefined,
            },
        });

        // pour recuperer les donnée d'une ligne dans le modal
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVisiteAll()
            }
        });
    }

    // fonction pour ouvrir le modal attribuer une visite à un utilisateur
    // On lui passe en parametre l'id de la visite
    openDialogAttributeForm(visite?: any): void {
        const dialogRef = this._matDialog.open(attributeFormComponent, {
            data: {
                visite: visite ? visite : undefined,
            },
        });

        // pour recuperer les donnée d'une ligne dans le modal
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVisiteAll();
            }
        });
    }

    openDialogRejeterForm(visite?: any): void {
        const dialogRef = this._matDialog.open(rejeterFormComponent, {
            data: {
                visite: visite ? visite : undefined,
            },
        });

        // pour recuperer les donnée d'une ligne dans le modal
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.getVisiteAll()
            }
        });
    }

    //Fonction pour valider une visite
    validerVisite(visite?: any): void {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(
            this.validateForm.value
        );
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                //Crée une constante qui sera envoyé dans le back avec l'id
                //de la visite
                const statutVisite: any = {
                    actif: 0,
                    effectue: null,
                    satisfaction: null,
                    geler: 0,
                    dateCreation: new Date().toISOString(),
                    idusrcreation: visite.idusrcreation,
                    visite: visite.id,
                };
                const validateReq =
                    this._visiteService.ValidationVisite(statutVisite);
                validateReq.subscribe(() => {
                    this.getVisiteAll()
                });
            }
        });
    }

    //Fonction pour marquer une visite comme effectuée
    //Cette fonction est appellée dans le html de visite
    effectuer(visite?: any): void {
        const dialogRef = this._fuseConfirmationService.open(
            this.effectuerForm.value
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const statutVisite: any = {
                    actif: 0,
                    effectue: null,
                    satisfaction: null,
                    geler: 0,
                    dateCreation: new Date().toISOString(),
                    idusrcreation: 1,
                    visite: visite.id,
                };
                const effectuerReq =
                    this._visiteService.marquerEffectuer(statutVisite);
                effectuerReq.subscribe(() => {
                    this.getVisiteAll()
                });
            }
        });
    }

    //Fonction pour confirmer une visite
    confirmerVisite(visite?: any): void {
        // Open the dialog and save the reference of it
        const dialogRef = this._fuseConfirmationService.open(
            this.confirmerForm.value
        );
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                //Crée une constante qui sera envoyé dans le back avec l'id
                //de la visite
                const statutVisite: any = {
                    actif: 0,
                    effectue: null,
                    satisfaction: null,
                    geler: 0,
                    dateCreation: new Date().toISOString(),
                    idusrcreation: 1,
                    visite: visite.id,
                };
                const validateReq =
                    this._visiteService.ConfirmationVisite(statutVisite);
                validateReq.subscribe(() => {
                    this.getVisiteAll()
                });
            }
        });
    }

    generateForm() {
        this.validateForm = this._formBuilder.group({
            title: 'Validation de la visite',
            message:
                'Êtes-vous sûr de vouloir valider cette visite? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:check',
                color: 'success',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Valider',
                    color: 'primary',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Annuler',
                }),
            }),
            dismissible: true,
        });

        this.effectuerForm = this._formBuilder.group({
            title: 'Marquer une visite comme effectuée',
            message:
                'Êtes-vous sûr de vouloir marquer cette visite comme effectuée? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:check',
                color: 'success',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Valider',
                    color: 'primary',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Retour',
                }),
            }),
            dismissible: true,
        });

        this.confirmerForm = this._formBuilder.group({
            title: 'Confirmation de la visite',
            message:
                'Êtes-vous sûr de vouloir confirmer cette visite? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:check',
                color: 'success',
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Confirmer',
                    color: 'primary',
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Annuler',
                }),
            }),
            dismissible: true,
        });

        // this.deleteVisiteForm = this._formBuilder.group({
        //     title: 'Suppression de la visite',
        //     message:
        //         'Êtes-vous sûr de vouloir supprimer définitivement cette visite? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
        //     icon: this._formBuilder.group({
        //         show: true,
        //         name: 'heroicons_outline:exclamation',
        //         color: 'warn',
        //     }),
        //     actions: this._formBuilder.group({
        //         confirm: this._formBuilder.group({
        //             show: true,
        //             label: 'Supprimer',
        //             color: 'warn',
        //         }),
        //         cancel: this._formBuilder.group({
        //             show: true,
        //             label: 'Annuler',
        //         }),
        //     }),
        //     dismissible: true,
        // });
    }

    getVisiteAll(): void {

        let where: any;

        if (this.user.utilisateurProfil[0].profil.id == 3) {
            where = {
                idusrcreation: this.user.id,
            };
            
        }
        else if (this.user.utilisateurProfil[0].profil.id == 2) {
            where = {
                employe: this.user.id
            };
        } 
        else {
            where 
        }

        const getVisite = this._visiteService.query({
            where,
            order: { id: 'DESC'},
            relations: [
                'statutVisite', 
                'statutVisite.statut', 
                'employe', 
                'utilisateur', 
                'motif'
            ]
        });
        getVisite.subscribe((result: Visite[]) => {
            const visiteAttente = [];
            const visiteValidee = [];
            const visiteRejetee = [];
            const visiteEffectuee = [];
            const visiteConfirmee = [];
            const liste = result.map((sp) => {
                const x = {
                    ...sp,
                    statutVisite: sp.statutVisite.length > 1 ? sp.statutVisite.sort((a, b) => b.id - a.id) : sp.statutVisite
                };

                 if (x.statutVisite[0]?.statut?.id === 1) {
                    visiteAttente.push(x);
                    this.nbrAttente = visiteAttente.length;
                 }
                 
                 if (x.statutVisite[0]?.statut?.id === 2) {
                    visiteValidee.push(x);
                    this.nbrValidee = visiteValidee.length;
                }

                if (x.statutVisite[0]?.statut?.id === 3) {
                    visiteRejetee.push(x);
                    this.nbrRejetee = visiteRejetee.length;
                }

                //Les visites rejetées sont vues en fonction des profils utilisateur
                //Code utiliser pour les cas où les visites rejetées par un employé ne sont pas visibles
                //par le client, seulement celles rejetées par l'admin sont visibles par le client.
                // if (x.statutVisite[0]?.statut?.id === 3 && this.user.utilisateurProfil[0].profil.id != 3) {
                //     visiteRejetee.push(x);
                //     this.nbrRejetee = visiteRejetee.length;
                // }

                // if (x.statutVisite[0]?.statut?.id === 3 && this.user.utilisateurProfil[0].profil.id == 3 && x.empty1 === 'admin') {
                //     visiteRejetee.push(x);
                //     this.nbrRejetee = visiteRejetee.length;
                // }
                
                if (x.statutVisite[0]?.statut?.id === 4) {
                    visiteEffectuee.push(x);
                    this.nbrEffectuee = visiteEffectuee.length;
                }
                
                if (x.statutVisite[0]?.statut?.id === 7 ) {
                    visiteConfirmee.push(x);
                    this.nbrConfirmee = visiteConfirmee.length;
                }
                return x;
            });
            this.isLoading = false; // stop le loader
            console.log(visiteAttente, 'visiteAttente');
            
            //Tableaux qui recoivent les données retournées
            this.dataSourceAttente = new MatTableDataSource<any>(visiteAttente);
            this.dataSourceValidee = new MatTableDataSource<any>(visiteValidee);
            this.dataSourceRejetee = new MatTableDataSource<any>(visiteRejetee);
            this.dataSourceEffectuee = new MatTableDataSource<any>(visiteEffectuee);
            this.dataSourceConfirmee = new MatTableDataSource<any>(visiteConfirmee);

            //la pagination des tableaux
            this.dataSourceAttente.paginator = this.paginationEnAttente;
            this.dataSourceAttente.sort = this.sort;
            this.dataSourceValidee.paginator = this.paginationValidee;
            this.dataSourceValidee.sort = this.sort;
            this.dataSourceRejetee.paginator = this.paginationRejetee;
            this.dataSourceRejetee.sort = this.sort;
            this.dataSourceEffectuee.paginator = this.paginationEffectuee;
            this.dataSourceEffectuee.sort = this.sort;
            this.dataSourceConfirmee.paginator = this.paginationConfirmee;
            this.dataSourceConfirmee.sort = this.sort;

            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }
    
    onTabsChange(event): void {
        this.showPagination = event.index;
        this.getVisiteAll();
    }

    pageChanged(event): void {
        const pageIndex = event.pageIndex;
        const previousIndex = event.previousPageIndex;
        this.pagination.startIndex = pageIndex;
        this.pagination.page = pageIndex + 1;
        this.pagination.size = event.pageSize;
    }

    limit(string = '', limit = 0) {
        return string.substring(0, limit);
    }
}
