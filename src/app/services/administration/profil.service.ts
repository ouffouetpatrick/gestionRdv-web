import { Profil } from './../../interfaces/administration/profil';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

    private url = `${environment.api}/profil`;
    constructor(private http: HttpClient) { }
    // Ajoute un nouvel enregistrement de Profil 
    save(Profil: Profil): Observable<any> {
        return this.http.post<any>(`${this.url}`, Profil);
    }


    // Modifier un enregistrement de Entity 
    update(Profil: Profil): Observable<any> {
        return this.http.put<any>(`${this.url}/${Profil.id}`, Profil);
    }


    // Supprime un enregistrement de Profil
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
    // Trouve tous les enregistrements de Profil
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }
    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);
        
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }
    // Trouve un seul enregistrements de Profil
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Enregistrer le module avec ses droits
    saveProfilAvecModuleEtcDroit(Utilisateur: any): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/profil/ajouter`, Utilisateur);
    }
    
}
