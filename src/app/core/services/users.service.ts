import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDetail } from '../types/users.type';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(
        private http: HttpClient
    ) { }

    public isEmailAvailable(email: string): Observable<any> {
        return this.http.get(`${environment.API_URL}/users/is-email-available/${email}/`);
    }

    public getUserProfileByEmail(email: string): Observable<UserDetail> {
        return this.http.get<UserDetail>(`${environment.API_URL}/users/by-email/${email}/`);
    }
}
