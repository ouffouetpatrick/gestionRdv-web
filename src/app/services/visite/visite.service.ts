import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Visite } from 'app/interfaces/visite/visite';

@Injectable({
    providedIn: 'root'
})
export class VisiteService {

    private url = `${environment.api}/visite`;

    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de Visite
    save(visite: Visite): Observable<any> {
        return this.http.post<any>(`${this.url}`, visite);
    }

    // Modifier un enregistrement de Visite
    update(visite: Visite): Observable<any> {
        return this.http.put<any>(`${this.url}/${visite.id}`, visite);
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
    updateCommentaireVisite(visite: Visite): Observable<any> {
        return this.http.put<any>(`${this.url}/${visite.id}`, visite);
    }

    // Route API metier


    // Récupère la liste des visites en attent
    // Passer le même que celui passer dans le component
    demandeVisite(visite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/visite/demandeVisite`,visite);
    }

    //Valider une visite qui est en attente
    ValidationVisite(statutVisite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/validerVisite`, statutVisite);
    }

    //Annuler une visite 
    annulationVisite(statutVisite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/annulerVisite`, statutVisite);
    }

    //Confirmer une visite qui est en attente
    ConfirmationVisite(statutVisite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/confirmerVisite`, statutVisite);
    }

    //Récupère la liste des employé (profil)
    getListeEmployeAndNbrVisite(): Observable<any> {
        return this.http.get<any>(`${environment.api}/metier/utilisateurProfil/recupererListeEmployeAndNbrVisite`);
    }

    // Liste des employés uniquement
    getListeEmploye(): Observable<any> {
        return this.http.get<any>(`${environment.api}/metier/utilisateurProfil/recupererListeEmploye`);
    }

     //Attribuer une visite à un employé
    attribuerVisite(visite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/visite/attribuerVisite`, visite);
    }

    rejeterVisite(visite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/visite/rejeterVisite`,visite);
    }

    //Marquer une visite comme effectuée
    marquerEffectuer(statutVisite): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/statutVisite/marquerEffectuer`, statutVisite);
    }

    //Supprimer (geler) une visite
    SupprimerVisiteAttente(visiteAttente): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/visite/SupprimerVisiteAttente`, visiteAttente);
    }

    getListeVisiteAvecStatut(): Observable<any> {
        return this.http.get<any>(`${environment.api}/metier/statutVisite/recupererVisiteAttenteAll`);
    }
}
