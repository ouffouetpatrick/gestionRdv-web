import { Injectable } from "@angular/core";
import { Module } from "app/interfaces/administration/module";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class ModuleService {

    constructor(private http: HttpClient) { }

    private url = `${environment.api}/module`;
    
    public listeModule: Module[] = [];

    getOne(id: number) {
        return this.listeModule.find((item) => item.id == id);
    }

    ajouterModule(module) {
        module.id = new Date().getTime();
        this.listeModule.push(module);
    }

    modifierModule(module: Module) {
        for (let i = 0; i < this.listeModule.length; i++) {
            if (this.listeModule[i].id == module.id) {
                this.listeModule[i].libelle = module.libelle;
                this.listeModule[i].lien = module.lien;
                this.listeModule[i].icone = module.icone;
                this.listeModule[i].moduleParent = module.moduleParent;
            }
        }
    }

    supprimerModule(id: number) {
        const nouvelleListe = this.listeModule.filter((item) => item.id != id);

        this.listeModule = nouvelleListe;
    }

    // Ajoute un nouvel enregistrement de Module
    save(Module: Module): Observable<any> {
        return this.http.post<any>(`${this.url}`, Module);
    }

    // Modifier un enregistrement de Entity
    update(Module: Module): Observable<any> {
        return this.http.put<any>(`${this.url}/${Module.id}`, Module);
    }

    // Supprime un enregistrement de Module
    delete(primaryKey: any): Observable<any> {
        return this.http.delete<any>(
            `${this.url}/${encodeURI(JSON.stringify(primaryKey))}`
        );
    }
    // Trouve tous les enregistrements de Module
    findAll(): Observable<any> {
        return this.http.get<any>(`${this.url}`);
    }
    query(queryParameter: any): Observable<any> {
        return this.http.get<any[]>(
            `${this.url}/query/${encodeURI(JSON.stringify(queryParameter))}`
        );
    }
    // Trouve un seul enregistrements de Module
    findOne(primaryKey: any): Observable<any> {
        return this.http.get<any>(
            `${this.url}/${encodeURI(JSON.stringify(primaryKey))}`
        );
    }

    // Enregistrer le module avec ses droits
    saveModuleAvecDroit(Module: any): Observable<any> {
        return this.http.post<any>(`${environment.api}/metier/module/add-module`, Module);
    }

}
