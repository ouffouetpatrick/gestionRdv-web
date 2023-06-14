import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit,
} from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from "app/constants";
import { Pagination } from "app/interfaces/utils/Pagination";
import { MotifFormComponent } from "./motifForm/motifForm.component";
import { FuseConfirmationService } from "@fuse/services/confirmation/confirmation.service";
import { MatSort } from "@angular/material/sort";
import { Motif } from "app/interfaces/motif/motif";
import { MatTableDataSource } from "@angular/material/table";
import { MotifService } from "app/services/parametrage/motif.service";


@Component({
    selector: "motif",
    templateUrl: "./motif.component.html",
    styleUrls: ["./motif.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})

export class MotifComponent implements OnInit, AfterViewInit {

    motif: Motif[];
    displayedColumns: string[] = ['libelle', 'dateCreation', 'action'];
    dataSource = new MatTableDataSource<Motif>([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    // pagination variables
    page = { pageSize: PAGE_SIZE, pageSizeOptions: PAGE_SIZE_OPTIONS };
    isLoading: boolean = false;
    configForm: FormGroup;
    searchInputControl: FormControl = new FormControl();

  
  /**
  * Constructor
  */
   constructor( 
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private motifService: MotifService
    ){}


    ngOnInit(): void {
      this.getMotif();
      this.generateForm();
    }

    AfterViewInit(): void {
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
    }

    openDialogMotifForm(motif?: any): void
   {
       // Open the dialog
       const dialogRef = this._matDialog.open(MotifFormComponent, {
        data: {
          motif: motif ? motif : undefined,
        }
      });

      // pour recuperer les donnée d'une ligne dans le modal
      dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMotif();
      }
    });
   }

   ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

  getMotif(): void {

    this.isLoading = true; // Démarre le loader
    // const getPays = this.paysService.findAll();
    const getMotif = this.motifService.query({order: { id: 'DESC'}});

    getMotif.subscribe((result) => {
        this.motif = result;
        this.isLoading = false; // stop le loader
        this.dataSource = new MatTableDataSource<any>(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        // pagination
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

pageChanged(event): void {
    const pageIndex = event.pageIndex;
    const previousIndex = event.previousPageIndex;
    this.pagination.startIndex = pageIndex;
    this.pagination.page = pageIndex+1;
    this.pagination.size = event.pageSize;
  }

  /**
     * Open confirmation dialog to delete
     */
  suprimer(motif): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        const deleteReq = this.motifService.delete(motif.id);
        deleteReq.subscribe(() => {
          this.getMotif()
        })
      }
    });
  }

  generateForm() {
    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Suppression de la visite',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement cet motif? <span class="font-medium">Cette action ne peut pas être annulée!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Supprimer',
          color: 'warn'
        }),
      cancel: this._formBuilder.group({
          show: true,
          label: 'Annuler'
        })
      }),
      dismissible: true
    });
  }

  }