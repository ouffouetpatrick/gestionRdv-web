import { ModuleService } from './../../../../services/administration/module.service';
import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    AfterViewInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ModuleFormComponent } from './moduleForm/moduleForm.component';
import { MatDialog } from '@angular/material/dialog';

import { Pagination } from 'app/interfaces/utils/Pagination';
import { FormControl } from '@angular/forms';
import { Module } from 'app/interfaces/administration/module';


@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class ModuleComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns = ['ModuleParent', 'Libelle', 'Icon', 'Lien', 'action'];

    dataSource = new MatTableDataSource<Module>([]);

    modules: Module[];

    isLoading: boolean = false;
    pagination: Pagination = { page: 1, size: 10, startIndex: 0 };
    searchInputControl: FormControl = new FormControl();


    constructor(
        public dialog: MatDialog,
        private moduleService: ModuleService,
    ) { }

    ngOnInit(): void {
        this.getModule();
    }

    openDialogmoduleForm(module: Module): void {
        console.log(module);

        const dialogRef = this.dialog.open(ModuleFormComponent, {
            data: {
                module: module ? module : undefined,
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result.status === 'save') {
                this.getModule();
            }
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getModule(): void {

        this.isLoading = true; // Démarre le loader
        // const getPays = this.paysService.findAll();
        const getModule = this.moduleService.query({
            order: { ordre: 'DESC' },
            relations: ['moduleParent', 'moduleDroit', 'moduleDroit.droit']
        });

        getModule.subscribe((result) => {

            this.modules = result;

            console.log('module', this.modules)

            this.isLoading = false; // stop le loader
            this.dataSource = new MatTableDataSource<any>(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            // pagination
            // this.pagination.size = 10;
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
    }
}
