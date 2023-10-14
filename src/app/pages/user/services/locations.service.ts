import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { IRegionWithCommunes } from '../models/location.model';

@Injectable({
    providedIn: 'root'
})
export class LocationsService {

    constructor(
        private http: HttpClient
    ) { }

    public getRegionsWithCommunes(): Observable<IRegionWithCommunes[]> {
        return this.http.get<IRegionWithCommunes[]>(environment.planishare.public + '/regions-with-communes/');
    }
}
