import { SharedModule } from './../../../../shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { ModuleComponent } from './module.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { ModuleFormComponent } from './moduleForm/moduleForm.component';


const routes = [
  {
    path: 'module',
    component: ModuleComponent,
  },
];

@NgModule({
  declarations: [
    ModuleComponent,
    ModuleFormComponent

  ],
  imports: [
    RouterModule.forChild(routes),
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
    SharedModule
  ]
})
export class ModuleModule { }
