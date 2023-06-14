import { Pagination } from './../../../../interfaces/utils/Pagination';
import { DroitService } from './../../../../services/administration/droit.service';
import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { DroitFormComponent } from './droitForm/droitForm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Droit } from 'app/interfaces/administration/droit';

@Component({
    selector: 'app-droit',
    templateUrl: './droit.component.html',
    styleUrls: ['./droit.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DroitComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    detailLink: string = '';
    displayedColumns = ['Droit', 'dateCreation', 'action'];

    dataSource = new MatTableDataSource<Droit>([]);

    droits: Droit[];

    isLoading: boolean = false;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    searchInputControl: FormControl = new FormControl();

    constructor(
        private _matDialog: MatDialog,
        private droitService: DroitService
    ) {}

    ngOnInit(): void {
        this.getDroit();
    }

    openDialogdroitForm(droit: Droit): void {
        const dialogRef = this._matDialog.open(DroitFormComponent, {
            data: {
                droit: droit ? droit : undefined,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result) {
                this.getDroit();
                //   this.dataSource = new MatTableDataSource<Droit>(this.droitService.listeDroit);
                //   this.dataSource.paginator = this.paginator;
                //   this.dataSource.sort = this.sort;
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

    getDroit(): void {
        this.isLoading = true; // Démarre le loader
        // const getPays = this.paysService.findAll();
        const getDroit = this.droitService.query({ order: { id: 'DESC' } });

        getDroit.subscribe((result) => {
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
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    pageChanged(event): void {
        console.log('event', event);
        const pageIndex = event.pageIndex;
        const previousIndex = event.previousPageIndex;
        // let pageSize = 5;

        this.pagination.startIndex = pageIndex;
        this.pagination.page = pageIndex + 1;
        this.pagination.size = event.pageSize;

        // let previousSize = pageSize * pageIndex;

        // this.getNextData(previousSize);
    }
}
