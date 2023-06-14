import { ProfilService } from "./../../../../services/administration/profil.service";
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { ProfilFormComponent } from "./profilForm/profilForm.component";
import { MatDialog } from "@angular/material/dialog";
import { Pagination } from "app/interfaces/utils/Pagination";
import { FormControl } from "@angular/forms";
import { Profil } from "app/interfaces/administration/profil";

@Component({
    selector: "app-profil",
    templateUrl: "./profil.component.html",
    styleUrls: ["./profil.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ProfilComponent implements OnInit, AfterViewInit {
    detailLink: string =
        "/gouvernance/conseil-administration/detail-administrateur/";
    displayedColumns = ["Profil", "dateCreation", "action"];

    dataSource = new MatTableDataSource<Profil>([]);

    droits: Profil[];

    isLoading: boolean = false;
    pagination: Pagination = {page: 1, size: 10, startIndex: 0};
    searchInputControl: FormControl = new FormControl();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialog: MatDialog,
        private profilService: ProfilService
    ) {}

    ngOnInit(): void {
        this.getProfil();
    }

    openDialogprofilForm(profil: Profil) {
        const dialogRef = this.dialog.open(ProfilFormComponent, {
            panelClass: "profilForm-dialog",
            data: {
              profil: profil ? profil : undefined,
          }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result && result.status == "save"){
                this.getProfil();
            }
      });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getProfil() {

        this.isLoading = true; // Démarre le loader
        const getProfil = this.profilService.query({
            order: { id: "DESC"},
            relations:[
                'templateProfil',
                'templateProfil.droit',
                'templateProfil.module',
                'templateProfil.module.moduleDroit',
                'templateProfil.module.moduleDroit.droit',
            ]
        });
    
        getProfil.subscribe(result => {

            this.droits = result;
        
            this.isLoading = false; // stop le loader
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.pagination.page = 1;
            this.pagination.startIndex = 0;
            this.pagination.length = result.length;
        });
      
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
     trackByFn(index: number, item: any): any
     {
         return item.id || index;
     }
 
     pageChanged(event) {
         console.log("event", event);
         let pageIndex = event.pageIndex;
         let previousIndex = event.previousPageIndex;
         // let pageSize = 5;
 
 
         this.pagination.startIndex = pageIndex;
         this.pagination.page = pageIndex+1;
         this.pagination.size = event.pageSize;
     }
}
