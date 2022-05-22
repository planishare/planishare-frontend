import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegionWithCommunes } from '../types/location.type';

@Injectable({
    providedIn: 'root'
})
export class LocationsService {

    constructor(
        private http: HttpClient
    ) { }

    public getRegionsWithCommunes(): Observable<RegionWithCommunes[]> {
        return this.http.get<RegionWithCommunes[]>(environment.apiUrl + '/regions-with-communes/');
    }
}
