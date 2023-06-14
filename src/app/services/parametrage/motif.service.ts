import { Motif } from "app/interfaces/motif/motif";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MotifService {

    private url = `${environment.api}/motif`;
    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de Motif 
    save(Motif: Motif): Observable<any> {
        return this.http.post<any>(`${this.url}`, Motif);
    }

    // Modifier un enregistrement de Entity 
    update(Motif: Motif): Observable<any> {
        return this.http.put<any>(`${this.url}/${Motif.id}`, Motif);
    }

    // Supprime un enregistrement de Motif
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
    // Trouve tous les enregistrements de Motif
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }
    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);
        
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }
    // Trouve un seul enregistrements de Motif
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
    
}
