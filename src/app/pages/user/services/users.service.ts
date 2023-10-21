import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { IUserDetail, IUserForm } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(
        private http: HttpClient
    ) { }

    public isEmailAvailable(email: string): Observable<any> {
        return this.http.get(`${environment.planishare.public}/users/is-email-available/${email}/`);
    }

    public getUserProfileByEmail(email: string): Observable<IUserDetail> {
        return this.http.get<IUserDetail>(`${environment.planishare.protected}/users/by-email/${email}/`);
    }

    public updateUserProfile(id: number, body: IUserForm): Observable<IUserDetail> {
        return this.http.patch<IUserDetail>(`${environment.planishare.protected}/users/update/${id}/`, body);
    }
}
