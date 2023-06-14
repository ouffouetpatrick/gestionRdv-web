// import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
// import { FuseNavigation } from '@fuse/types';
// import { MODULES, NAVIGATION, UTILISATEUR } from 'app.constant';
import { environment } from 'environments/environment';
// import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, Subject } from 'rxjs';
import { Utilisateur } from '../../interfaces/administration/utilisateur';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
// import { LISTE_UTILISATEUR } from '../storage/initialeDataUtilisateur';

@Injectable()
export class UtilisateurService {
    // navigationSubject = new Subject<FuseNavigation[]>();
    // modulesSubject = new Subject<FuseNavigation[]>();
    utilisateurSubject = new Subject<Utilisateur>();

    private url = `${environment.api}/utilisateur`;
    constructor(
        //   @Inject(LOCAL_STORAGE) private storage: StorageService,
        private _fuseNavigationService: FuseNavigationService,
        private route: Router,
        private http: HttpClient
    ) { }

    // Ajoute un nouvel enregistrement de Utilisateur
    save(Utilisateur: Utilisateur): Observable<any> {
        return this.http.post<any>(`${this.url}`, Utilisateur);
    }

    // Modifier un enregistrement de Entity
    update(Utilisateur: Utilisateur): Observable<any> {
        return this.http.put<any>(`${this.url}/${Utilisateur.id}`, Utilisateur);
    }

    // Supprime un enregistrement de Utilisateur
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(
            `${this.url}/${encodeURI(JSON.stringify(primaryKey))}`
        );
    }

    // Trouve tous les enregistrements de Utilisateur
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);

        return this.http.get<any[]>(
            `${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`
        );
    }

    // Trouve un seul enregistrements de Utilisateur
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(
            `${this.url}/${encodeURI(JSON.stringify(primaryKey))}`
        );
    }

    // Enregistrer le module avec ses droits
    saveUtilisateurAvecModuleEtDroit(Utilisateur: any): Observable<any> {
        return this.http.post<any>(
            `${environment.api}/metier/utilisateur/ajouter`,
            Utilisateur
        );
    }

    // Enregistrer le module avec ses droits
    updateUtilisateurAvecModuleEtDroit(Utilisateur: any): Observable<any> {
        return this.http.post<any>(
            `${environment.api}/metier/utilisateur/update`,
            Utilisateur
        );
    }

    // retourne les 5 derniers utilisateurs enregistré
    getLastUtilisateur(): Observable<any> {
        return this.http.get<any>(`${environment.api}/metier/utilisateur/last`);
    }

    deconnexion = () => {
        // this.storage.remove(NAVIGATION);
        // this.storage.remove(UTILISATEUR);
        // this.storage.remove(MODULES);

        // this._fuseNavigationService.unregister('main')
        // this.navigationSubject.next([]);
        this.utilisateurSubject.next(null);
        // this.modulesSubject.next([]);

        this.route.navigateByUrl('/connexion');
    };
}
