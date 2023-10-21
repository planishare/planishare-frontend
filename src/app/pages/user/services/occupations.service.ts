import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { IPageable } from '../../../shared/models/pageable.model';
import { IEducation, IInstitution } from '../models/institution.model';

@Injectable({
    providedIn: 'root'
})
export class OccupationsService {

    constructor(
        private http: HttpClient
    ) { }

    public getEducations(): Observable<IEducation[]> {
        return this.http.get<IEducation[]>(environment.planishare.public + '/educations/');
    }

    public getInstitutions(search: string): Observable<IPageable<IInstitution>> {
        return this.http.get<IPageable<IInstitution>>(environment.planishare.public + '/institutions/', {
            params: {
                search
            }
        });
    }
}
