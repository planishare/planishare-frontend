import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private api_url = environment.API_URL;

    constructor(
        private http: HttpClient
    ) { }

    public isEmailAvailable(email: string): Observable<any> {
        return this.http.get(`${this.api_url}/users/is-email-available/${email}/`);
    }
}
