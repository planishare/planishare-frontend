import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicCredentials } from '../types/auth.type';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // public accessToken?: string;

    private api_url = environment.API_URL;

    public accessToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    public isAuth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.accessToken.value);

    constructor(
        private http: HttpClient
    ) { }

    public login(credentials: BasicCredentials): Observable<any> {
        return this.http.post(this.api_url + '/login/', credentials, { withCredentials: true })
            .pipe(
                tap((resp: any) => this.accessToken.next(resp.access))
                // tap((resp: any) => console.log(this.accessToken.value))
            );
    }

    public register(credentials: BasicCredentials): Observable<any> {
        return this.http.post(this.api_url + '/users/create/', credentials)
            .pipe(
                switchMap(resp => {
                    return this.login(credentials);
                })
                // tap((resp: any) => console.log(this.accessToken.value))
            );
    }
}
