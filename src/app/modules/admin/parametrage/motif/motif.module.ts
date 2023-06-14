import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MotifComponent } from 'app/modules/admin/parametrage/motif/motif.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MotifFormComponent } from './motifForm/motifForm.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { QuillModule } from 'ngx-quill';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const motifRoutes: Route[] = [
    {
        path     : 'motif',
        component: MotifComponent
    }
];

@NgModule({
    declarations: [
        MotifComponent,
        MotifFormComponent
    ],
    imports     : [
        RouterModule.forChild(motifRoutes),
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatMenuModule,
        MatRadioModule,
        MatSelectModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatInputModule,
        MatGridListModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSnackBarModule,
        QuillModule.forRoot(),
        SharedModule,
        MatDatepickerModule,
        MatMomentDateModule
    ]
})
export class MotifModule
{
}
