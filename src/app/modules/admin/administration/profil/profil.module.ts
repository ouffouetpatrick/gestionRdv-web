import { SharedModule } from './../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { AddProfilComponent } from './add-profil/add-profil.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { ProfilComponent } from './profil.component';
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
import { ProfilFormComponent } from './profilForm/profilForm.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


const routes = [
  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'profil/edition',
    component: AddProfilComponent,
  },
];

@NgModule({
  declarations: [
    ProfilComponent,
    ProfilFormComponent,
    AddProfilComponent
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
    MatSlideToggleModule,
    MatCardModule,
    MatSnackBarModule,
    SharedModule
  ]
})
export class ProfilModule { }
