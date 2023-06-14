import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardsService {
    private url = `${environment.api}/visite`;
    constructor(private http: HttpClient) {}

    //total des visites par staut
    getTotalVisiteParStatut(): Observable<any> {
        return this.http.get<any>(
            `${environment.api}/metier/statutVisite/total-visite-par-statut`
        );
    }

    //total des visites par employe
    getTotalVisiteParEmploye(): Observable<any> {
        return this.http.get<any>(
            `${environment.api}/metier/statutVisite/total-visite-attribue`
        );
    }
}
