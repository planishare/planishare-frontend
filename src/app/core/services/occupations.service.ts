import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegionWithCommunes } from '../types/location.type';
import { Education, Institution, InstitutionPageable } from '../types/users.type';

@Injectable({
    providedIn: 'root'
})
export class OccupationsService {

    constructor(
        private http: HttpClient
    ) { }

    public getEducations(): Observable<Education[]> {
        return this.http.get<Education[]>(environment.apiUrl + '/educations/');
    }

    public getInstitutions(search: string): Observable<InstitutionPageable> {
        return this.http.get<InstitutionPageable>(environment.apiUrl + '/institutions/', {
            params: {
                search
            }
        });
    }
}
