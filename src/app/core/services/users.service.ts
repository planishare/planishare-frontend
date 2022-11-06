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
        return this.http.get(`${environment.apiUrl}/users/is-email-available/${email}/`);
    }

    public getUserById(id: number): Observable<IUserDetail> {
        return this.http.get<IUserDetail>(`${environment.apiUrl}/users/${id}/`);
    }

    public getUserProfileByEmail(email: string): Observable<IUserDetail> {
        return this.http.get<IUserDetail>(`${environment.apiUrl}/users/by-email/${email}/`);
    }

    public updateUserProfile(id: number, body: IUserForm): Observable<IUserDetail> {
        return this.http.patch<IUserDetail>(`${environment.apiUrl}/users/update/${id}/`, body);
    }
}
