import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from 'app/interfaces/utilisateur/utilisateur';

@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {

    private url = `${environment.api}employe`;
    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de Utilisateur
    save(utilisateur: Utilisateur): Observable<any> {
        return this.http.post<any>(`${this.url}`, utilisateur);
    }

    // Modifier un enregistrement de Utilisateur
    update(utilisateur: Utilisateur): Observable<any> {
        return this.http.put<any>(`${this.url}/${utilisateur.id}`, utilisateur);
    }

    // Supprime un enregistrement de Utilisateur
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Trouve tous les enregistrements de Utilisateur
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }

    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }

    // Trouve un seul enregistrements de Utilisateur
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // Traiter un icident en ajoutant le commantaire
    updateCommentaireUtilisateur(utilisateur: Utilisateur): Observable<any> {
        return this.http.put<any>(`${this.url}/${utilisateur.id}`, utilisateur);
    }

    // Récupère la liste des utilisateurs pour un utilisateur ou l'administrateur
    getListeUtilisateurAdministrateur(): Observable<any> {
        return this.http.get<any>(`${environment.api}metier/utilisateur/listeUtilisateur`);
    }

}
