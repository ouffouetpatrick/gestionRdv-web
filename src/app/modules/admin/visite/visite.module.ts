import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { VisiteComponent } from 'app/modules/admin/visite/visite.component';
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
import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { 
    NgxMatDatetimePickerModule, 
    NgxMatTimepickerModule, 
    NgxMatNativeDateModule
 } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VisiteFormComponent } from './visiteForm/VisiteForm.component';
import { attributeFormComponent } from './attributeForm/attributeForm.component';
import { rejeterFormComponent } from './rejeterForm/rejeterForm.component';
import {  MatBadgeModule } from '@angular/material/badge';

const visiteRoutes: Route[] = [
    {
        path     : '',
        component: VisiteComponent
    }
];

@NgModule({
    declarations: [
        VisiteComponent,
        VisiteFormComponent,
        attributeFormComponent,
        rejeterFormComponent
    ],
    imports     : [
        RouterModule.forChild(visiteRoutes),
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
        NgxMaterialTimepickerModule,
        MatMomentDateModule,
        MatBadgeModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        NgxMatMomentModule
    ],
    bootstrap:    [ VisiteComponent ],
})
export class VisiteModule
{
}
