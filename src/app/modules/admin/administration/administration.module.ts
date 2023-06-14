import { NgModule } from '@angular/core';
import { ModuleModule } from './module/module.module';
import { ProfilModule } from './profil/profil.module';
import { DroitModule } from './droit/droit.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';



@NgModule({
  declarations: [],
  imports: [
    ModuleModule,
    ProfilModule,
    UtilisateurModule,
    DroitModule
  ]
})
export class AdministrationModule { }
