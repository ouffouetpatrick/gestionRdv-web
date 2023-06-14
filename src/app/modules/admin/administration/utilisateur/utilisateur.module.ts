import { SharedModule } from './../../../../shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { UtilisateurComponent } from './utilisateur.component';
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
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { UtilisateurFormComponent } from './utilisateurForm/utilisateurForm.component';
import { AddUtilisateurComponent } from './add-utilisateur/add-utilisateur.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

const routes = [
  {
    path: 'utilisateur',
    component: UtilisateurComponent,
  },
  {
    path: 'utilisateur/edition-utilisateur/:id',
    component: AddUtilisateurComponent,
  },
];

@NgModule({
  declarations: [
    UtilisateurComponent,
    UtilisateurFormComponent,
    AddUtilisateurComponent
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
    MatExpansionModule,
    SharedModule,
    MatSnackBarModule,
    QuillModule.forRoot(),
    MatMomentDateModule
  ]
})
export class UtilisateurModule { }
