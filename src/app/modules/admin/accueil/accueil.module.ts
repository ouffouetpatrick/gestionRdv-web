import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route, RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { AccueilComponent } from 'app/modules/admin/accueil/accueil.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';

const accueilRoutes: Route[] = [
    {
        path     : '',
        component: AccueilComponent
    }
];

@NgModule({
    declarations: [
        AccueilComponent
    ],
    imports     : [
        RouterModule.forChild(accueilRoutes),
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseAlertModule,
        SharedModule,
        MatButtonModule
    ]
})
export class AccueilModule
{
}
