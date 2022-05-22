import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDetail, UserForm } from '../types/users.type';

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

    public getUserProfileByEmail(email: string): Observable<UserDetail> {
        return this.http.get<UserDetail>(`${environment.apiUrl}/users/by-email/${email}/`);
    }

    public updateUserProfile(id: number, body: UserForm): Observable<UserDetail> {
        return this.http.patch<UserDetail>(`${environment.apiUrl}/users/update/${id}/`, body);
    }
}
