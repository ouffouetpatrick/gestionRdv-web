import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { StatutVisite } from 'app/interfaces/statutVisite/statutVisite';

@Injectable({
    providedIn: 'root'
})
export class GestionEtatsService {

    private url = `${environment.api}/statutVisite`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de Visite
    save(statutVisite: StatutVisite): Observable<any> {
        return this.http.post<any>(`${this.url}`, statutVisite);
    }

    // Modifier un enregistrement de Visite
    update(statutVisite: StatutVisite): Observable<any> {
        return this.http.put<any>(`${this.url}/${statutVisite.id}`, statutVisite);
    }

    // Supprime un enregistrement de Visite
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de Visite
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de Visite
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Traiter un icident en ajoutant le commantaire
    updateCommentaireVisite(statutVisite: StatutVisite): Observable<any> {
        return this.http.put<any>(`${this.url}/${statutVisite.id}`, statutVisite);
    }

    // Route API metier

    //Recherche journalière
    getVisiteRechercheeByDay(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/rechercherByDay`, queryParameter);
    }

    //Recherche hebdomadaire
    getVisiteRechercheeByWeek(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/rechercherByWeek`, queryParameter);
    }

    //Recherche mensuelle
    getVisiteRechercheeByMonth(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/rechercherByMonth`, queryParameter);
    }

    //Recherche annuelle
    getVisiteRechercheeByYear(queryParameter): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/rechercherByYear`, queryParameter);
    }

}
