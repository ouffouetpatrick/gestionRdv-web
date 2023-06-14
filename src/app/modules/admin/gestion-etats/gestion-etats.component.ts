import { Component, OnInit, ViewChild, ViewEncapsulation,AfterViewInit, ChangeDetectionStrategy,} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pagination } from 'app/interfaces/utils/Pagination';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from 'app/constants';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from 'app/services/administration/utilisateur.service';
import moment from 'moment';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';
import { Visite } from 'app/interfaces/visite/visite';
import { VisiteService } from 'app/services/visite/visite.service';
import { GestionEtatsService } from 'app/services/gestion-etats/gestion-etats.service';
import * as XLSX from 'xlsx';
import { TDocumentDefinitions } from 'pdfmake/build/pdfmake';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'visite',
    templateUrl: './gestion-etats.component.html',
    styleUrls: ['./gestion-etats.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class GestionEtatsComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('paginationDay') paginationDay: MatPaginator;
    @ViewChild('paginationWeek') paginationWeek: MatPaginator;
    @ViewChild('paginationMonth') paginationMonth: MatPaginator;
    @ViewChild('paginationYear') paginationYear: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSourceDay = new MatTableDataSource<any>([]);
    dataSourceWeek = new MatTableDataSource<any>([]);
    dataSourceMonth = new MatTableDataSource<any>([]);
    dataSourceYear = new MatTableDataSource<any>([]);

    SearchJourform: FormGroup;
    SearchSemaineform: FormGroup;
    SearchMoisform: FormGroup;
    SearchAnneeform: FormGroup;
    detailLink: string = '';
    displayedColumns: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'demandeur',
        'employe',
        'motif',
        'statut',
        'datecreation',
    ];
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    showPagination: number = 0;
    visiteRechercheeJour: Visite[];
    visiteRechercheeSemaine: Visite[];
    visiteRechercheeMois: Visite[];
    visiteRechercheeAnnee: Visite[];
    listeEmploye: any[];
    temp: any[];
    visiteExportation: any[];
    user: any;
    selectValue: String;
    selectValueEmploye: String;

    isLoading: boolean = false;
    fileName: any = 'Liste_Visite' + moment(new Date()).format('YYYY-MM-DD') + '.xlsx';

    searchInputControl: FormControl = new FormControl();

    mois: any[] = [
        {
            id: 1,
            name: 'Janvier',
        },
        {
            id: 2,
            name: 'Février',
        },
        {
            id: 3,
            name: 'Mars',
        },
        {
            id: 4,
            name: 'Avril',
        },
        {
            id: 5,
            name: 'Mai',
        },
        {
            id: 6,
            name: 'Juin',
        },
        {
            id: 7,
            name: 'Juillet',
        },
        {
            id: 8,
            name: 'Août',
        },
        {
            id: 9,
            name: 'Septembre',
        },
        {
            id: 10,
            name: 'Octobre',
        },
        {
            id: 11,
            name: 'Novembre',
        },
        {
            id: 12,
            name: 'Décembre',
        },
    ];

    annees: any[] = [];

    ListeSemaineGeneral: any[] = [];

    ListeAnneeGeneral: any[] = [];
    ListeStatutVisite = [
        { id: 'All', libelle: 'Tous' },
        { id: '1', libelle: 'En attente' },
        { id: '2', libelle: 'Validée' },
        { id: '3', libelle: 'Réjetée' },
        { id: '4', libelle: 'Effectuée' },
    ];

    currentWeek: number;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        public router: Router,
        private _visiteService: VisiteService,
        private _gestionEtatsService: GestionEtatsService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.getUtilisateur();
        this.selectValue = 'All';
        this.selectValueEmploye = 'All';

        const dateActuel = new Date();
        const currentYear = dateActuel.getFullYear();

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.initFormAnnee();
                this.initFormMois();
                this.initFormSemaine();
                this.initFormJour();
            });

        // rempli le tableau des année pour la recherche annuelle
        for (var i = currentYear; i >= 2000; i--) {
            let el = {
                id: i,
                name: `${i}`,
            };
            this.annees.push(el);
            this.ListeAnneeGeneral.push(el);
        }

        // rempli le tableau des semaines pour la recherche hebdomadaire
        for (let j = 1; j <= 52; j++) {
            let element = { IdSemaine: j, NomSemaine: `${j}` };

            this.ListeSemaineGeneral.push(element);
        }
    }

    ngAfterViewInit(): void {
        this.getCurrentWeek();
    }

    /**
     * === INITIALISATION DES FORMULAIRES POUR LES RECHERCHES
     */
    initFormJour(): void {
        if (this.user.utilisateurProfil[0].profil?.id === 2) {
            this.SearchJourform = this._formBuilder.group({
                dateJour: [new Date(), Validators.required],
                statutVisite: [''],
                utilisateurs: [this.user.id],
            });
        } else {
            this.SearchJourform = this._formBuilder.group({
                dateJour: [new Date(), Validators.required],
                statutVisite: [''],
                utilisateurs: [''],
            });
        }
    }

    initFormSemaine(): void {
        this.getCurrentWeek();
        const year = new Date().getFullYear();
        const debut_debut = moment()
            .day('Monday')
            .year(year)
            .week(this.currentWeek);
        const debut_fin = debut_debut.clone().weekday(7);
        // const all = 'Tous';

        if (this.user.utilisateurProfil[0].profil?.id === 2) {
            this.SearchSemaineform = this._formBuilder.group({
                dateDebut: [debut_debut.toISOString(), Validators.required],
                dateFin: [debut_fin.toISOString(), Validators.required],
                semaine: [''],
                annee: [year],
                statutVisite: [''],
                utilisateurs: [this.user.id],
            });
        } else {
            this.SearchSemaineform = this._formBuilder.group({
                dateDebut: [debut_debut.toISOString(), Validators.required],
                dateFin: [debut_fin.toISOString(), Validators.required],
                semaine: [''],
                annee: [year],
                statutVisite: [''],
                utilisateurs: [''],
            });
        }
    }

    getCurrentWeek(): void {
        // retourne le numéro de la semaine dans laquelle on se trouce
        function getWeekNumber(date): any {
            // Copy date so don't modify original
            date = new Date(
                Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            );
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
            // Get first day of year
            let yearStart: any = new Date(
                Date.UTC(date.getUTCFullYear(), 0, 1)
            );
            // Calculate full weeks to nearest Thursday
            let weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
            // Return array of year and week number
            return weekNo;
        }

        this.currentWeek = getWeekNumber(new Date());

        this.ListeSemaineGeneral.map((item) => {
            if (item.IdSemaine === this.currentWeek) {
                this.SearchSemaineform.patchValue({ semaine: item.IdSemaine });
            }
        });
    }

    initFormMois(): void {
        this.getCurrentWeek();
        const year = new Date().getFullYear();
        const debut_debut = moment()
            .day('Monday')
            .year(year)
            .week(this.currentWeek);
        const debut_fin = debut_debut.clone().weekday(7);
        const all = 'Tous';

        if (this.user.utilisateurProfil[0].profil?.id === 2) {
            this.SearchMoisform = this._formBuilder.group({
                mois: [1],
                annee: [year],
                statutVisite: [all],
                utilisateurs: [this.user.id],
            });
        } else {
            this.SearchMoisform = this._formBuilder.group({
                mois: [1],
                annee: [year],
                statutVisite: [all],
                utilisateurs: [''],
            });
        }
    }

    initFormAnnee(): void {
        this.getCurrentWeek();
        const year = new Date().getFullYear();
        const debut_debut = moment()
            .day('Monday')
            .year(year)
            .week(this.currentWeek);
        const debut_fin = debut_debut.clone().weekday(7);
        const all = 'Tous';

        if (this.user.utilisateurProfil[0].profil?.id === 2) {
            this.SearchAnneeform = this._formBuilder.group({
                annee: [year],
                statutVisite: [all],
                utilisateurs: [this.user.id],
            });
        } else {
            this.SearchAnneeform = this._formBuilder.group({
                annee: [year],
                statutVisite: [all],
                utilisateurs: [''],
            });
        }
    }

    getNewWeekDayInterval(annee, semaine = this.currentWeek): void {
        const newMoment = moment().set('year', annee);
        const dateDebut = moment()
            .day('Monday')
            .year(this.SearchSemaineform.value['annee'])
            .week(this.SearchSemaineform.value['semaine']);
        const dateFin = dateDebut.clone().weekday(7);

        this.SearchSemaineform.patchValue({
            dateDebut: dateDebut.toISOString(),
            dateFin: dateFin.toISOString(),
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceDay.filter = filterValue.trim().toLowerCase();

        if (this.dataSourceDay.paginator) {
            this.dataSourceDay.paginator.firstPage();
        }
    }

    // récupère les utilisateur
    getUtilisateur() {
        // this.inProgress = true; // Démarre le loader
        const getProfil = this._visiteService.getListeEmploye();

        getProfil.subscribe((result) => {
            this.listeEmploye = result.map((x) => x.utilisateur);
            // Ajouter l'option 'tous' au select du resultat retourné
            this.temp = [...this.listeEmploye, { id: 'All', nom: 'Tous' }];
        });
    }

    // dirige vers la page de détail
    onRowClick(id) {
        const detailLink: string = '/gestion-equipement/visite-detail';
        this.router.navigate([detailLink + '/' + id]);
    }

    /**
     * ***RECHERCHE JOURNALIERE****
     */

    searchFilterJournalier(): void {
        const getVisiteRecherchee =
            this._gestionEtatsService.getVisiteRechercheeByDay({
                dateJour: this.SearchJourform.value['dateJour'],
                statutVisite: this.SearchJourform.value['statutVisite'],
                utilisateurs: this.SearchJourform.value['utilisateurs'],
            });

        getVisiteRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.visiteRechercheeJour = result;
            this.visiteExportation = result;
            this.dataSourceDay = new MatTableDataSource<any>(result);
            this.dataSourceDay.paginator = this.paginator;
            this.dataSourceDay.sort = this.sort;

            // pagination
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    /**
     * ***RECHERCHE HEBDOMADAIRE****
     */

    searchFilterHebdomadaire(): void {
        const getVisiteRecherchee =
            this._gestionEtatsService.getVisiteRechercheeByWeek({
                dateDebut: this.SearchSemaineform.value['dateDebut'],
                dateFin: this.SearchSemaineform.value['dateFin'],
                statutVisite: this.SearchSemaineform.value['statutVisite'],
                utilisateurs: this.SearchSemaineform.value['utilisateurs'],
            });

        getVisiteRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.visiteRechercheeSemaine = result;
            this.visiteExportation = result;
            this.dataSourceWeek = new MatTableDataSource<any>(result);
            this.dataSourceWeek.paginator = this.paginator;
            this.dataSourceWeek.sort = this.sort;
            // pagination
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    /**
     * ***RECHERCHE MENSUELLE****
     */

    searchFilterMensuel(): void {
        const getVisiteRecherchee =
            this._gestionEtatsService.getVisiteRechercheeByMonth({
                mois: this.SearchMoisform.value['mois'],
                annee: this.SearchMoisform.value['annee'],
                statutVisite: this.SearchMoisform.value['statutVisite'],
                utilisateurs: this.SearchMoisform.value['utilisateurs'],
            });

        getVisiteRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.visiteRechercheeMois = result;
            this.visiteExportation = result;
            this.dataSourceMonth = new MatTableDataSource<any>(result);
            this.dataSourceMonth.paginator = this.paginator;
            this.dataSourceMonth.sort = this.sort;
            // pagination
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    /**
     * ***RECHERCHE ANNUELLE****
     */

    searchFilterAnnuel(): void {
        const getVisiteRecherchee =
            this._gestionEtatsService.getVisiteRechercheeByYear({
                annee: this.SearchAnneeform.value['annee'],
                statutVisite: this.SearchAnneeform.value['statutVisite'],
                utilisateurs: this.SearchAnneeform.value['utilisateurs'],
            });

        getVisiteRecherchee.subscribe((result) => {
            this.isLoading = false;
            this.visiteRechercheeAnnee = result;
            this.visiteExportation = result;
            this.dataSourceYear = new MatTableDataSource<any>(result);
            this.dataSourceYear.paginator = this.paginator;
            this.dataSourceYear.sort = this.sort;

            // pagination
            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
    }

    onTabsChange(event): void {
        this.showPagination = event.index;

        if (this.showPagination === 0) {
            this.searchFilterJournalier();
        }

        if (this.showPagination === 1) {
            this.searchFilterHebdomadaire();
        }

        if (this.showPagination === 2) {
            this.searchFilterMensuel();
        }

        if (this.showPagination === 3) {
            this.searchFilterAnnuel();
        }
    }

    pageChanged(event): void {
        const pageIndex = event.pageIndex;
        const previousIndex = event.previousPageIndex;
        this.pagination.startIndex = pageIndex;
        this.pagination.page = pageIndex + 1;
        this.pagination.size = event.pageSize;
    }

    moisCompletFrench = function (NbreMois) {
        // initializing an array
        const months = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre',
        ];
        return months[NbreMois];
    };

    exportPdf() {
        // Determination de la période suivant le type //
        var PeriodeEtat = null;

        switch (this.showPagination) {
            case 0:
                var DateJour = new Date(this.SearchJourform.value['dateJour']);
                PeriodeEtat = {
                    text:'Liste des visites du' + ' ' + moment(DateJour).format('DD/MM/YYYY'),
                };
                break;

            case 1:
                var date_debut = new Date(this.SearchSemaineform.value['dateDebut']);
                var date_fin = new Date(this.SearchSemaineform.value['dateFin']);
                PeriodeEtat = {
                    text:'Liste des visites du' + ' ' + moment(date_debut).format('DD/MM/YYYY') + ' au ' + ' ' + moment(date_fin).format('DD/MM/YYYY'),
                };
                break;

            case 2:
                PeriodeEtat = {
                    text: 'Liste des visites du mois de' + ' ' + this.moisCompletFrench(this.SearchMoisform.value['mois'] - 1 ) + ' ' + this.SearchMoisform.value['annee'],
                };
                break;

            case 3:
                PeriodeEtat = {
                    text:"Liste des visites de l'année" + ' ' + this.SearchAnneeform.value['annee'],
                };
                break;

            default:
                PeriodeEtat = null;
                break;
        }

        let rows: any[] = [
            [
                { text: 'Date du RDV', style: 'tableHeader' },
                { text: 'Heure', style: 'tableHeader' },
                { text: 'Objet', style: 'tableHeader' },
                { text: 'Employé', style: 'tableHeader' },
                { text: 'Motif', style: 'tableHeader' },
                { text: 'Statut', style: 'tableHeader' },
                { text: 'Date Creation', style: 'tableHeader' },
            ],
        ];
        for (let i = 0; i < this.visiteExportation.length; i++) {
            const element = this.visiteExportation[i];

            let ident = [
                { text: moment(element?.date).format('DD/MM/YYYY') },
                { text: moment(element?.date).format('HH:mm') },
                { text: element?.objet },
                { text: element?.employe?.nom ? element?.employe?.nom : 'Pas encore attribuée'},
                { text: element?.motif?.libelle ? element?.motif?.libelle : 'Aucun motif'},
                { text: element?.statutVisite[0].statut?.libelle },
                { text: moment(element.dateCreation).format('DD/MM/YYYY') },
            ];

            rows.push(ident);
        }

        const documentDefinition: TDocumentDefinitions = {
            pageOrientation: 'portrait',
            header: [{ text: 'GESTION DES RENDEZ-VOUS', style: 'entete' }],

            content: [
                PeriodeEtat,
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body: rows,
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 1
                                : 1;
                        },
                        vLineWidth: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 1
                                : 1;
                        },
                        hLineColor: function (i, node) {
                            return i === 0 || i === node.table.body.length
                                ? 'gray'
                                : 'gray';
                        },
                        vLineColor: function (i, node) {
                            return i === 0 || i === node.table.widths.length
                                ? 'gray'
                                : 'gray';
                        },
                        fillColor: function (rowIndex, node, columnIndex) {
                            return rowIndex === 0 ? '#1d62db' : null;
                        },
                    },
                },
            ],
            styles: {
                entete: {
                    bold: true,
                    fontSize: 25,
                    color: '#1d62db',
                    alignment: 'center',
                    decoration: 'underline',
                    decorationColor: '#1d62db',
                    margin: [0, 4, 0, 0],
                },
                entete1: {
                    bold: true,
                    fontSize: 20,
                    color: 'black',
                    alignment: 'center',
                    margin: [0, 15, 0, 15],
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                    fontSize: 8,
                },

                tableHeader: {
                    bold: true,
                    fontSize: 8,
                    color: 'white',
                },
            },
        };
        pdfMake.createPdf(documentDefinition).open();
    }

    exportExcel(): void {
        const exportData = this.visiteExportation.map((element) => {
            return {
                Date_du_RDV: moment(element?.date).format('DD/MM/YYYY'),
                Heure: element?.heure,
                Objet: element?.objet,
                Employe: element?.employe?.nom ? element?.employe?.nom : 'Pas encore attribuée',
                Motif: element?.motif?.libelle ? element?.motif?.libelle : 'Aucun motif',
                Statut: element?.statutVisite[0].statut?.libelle,
                Date_de_creation: moment(element.dateCreation).format('DD/MM/YYYY'),
            };
        });
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
}
