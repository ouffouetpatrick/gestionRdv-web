import { Droit } from '../../interfaces/administration/droit';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DroitService {

    private url = `${environment.api}/droit`;
    constructor(private http: HttpClient) { }

    // Ajoute un nouvel enregistrement de Droit 
    save(Droit: Droit): Observable<any> {
        return this.http.post<any>(`${this.url}`, Droit);
    }

    // Modifier un enregistrement de Entity 
    update(Droit: Droit): Observable<any> {
        return this.http.put<any>(`${this.url}/${Droit.id}`, Droit);
    }

    // Supprime un enregistrement de Droit
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
    // Trouve tous les enregistrements de Droit
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }
    query(queryParameter: any): Observable<any> {
        console.log(queryParameter);
        
        return this.http.get<any[]>(`${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }
    // Trouve un seul enregistrements de Droit
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(`${this.url}/${encodeURI(JSON.stringify(primaryKey))}`);
    }
    
}
