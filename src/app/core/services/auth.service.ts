import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicCredentials } from '../types/auth.type';
import { JwtService } from './jwt.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private api_url = environment.API_URL;

    public accessToken$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    public isAuth$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // Emits true when auth services finish loading
    public isCompleted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private jwtService: JwtService,
        private router: Router
    ) {
        this.localStorageChange();
    }

    public login(credentials: BasicCredentials): Observable<any> {
        return this.http.post(this.api_url + '/login/', credentials, { withCredentials: true })
            .pipe(
                tap((resp: any) => {
                    if (!!resp) {
                        this.setNewLogin(resp.access);
                    }
                })
            );
    }

    private setNewLogin(accessToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        this.accessToken$.next(localStorage.getItem('accessToken'));
        this.isAuth$.next(true);
        this.refreshTokenTimeout();
        this.isCompleted$.next(true);
        this.authServiceConsoleLog('Session setted!', this.accessToken$.value);
    }

    private refreshToken(): void {
        this.authServiceConsoleLog('Request new accessToken with refreshToken');
        this.http.post(this.api_url + '/login/token-refresh/', {}, { withCredentials: true })
            .pipe(
                catchError(error => {
                    console.error(error);
                    return of(null);
                }),
                tap((resp: any) => {
                    if (!!resp) {
                        this.setNewLogin(resp.access);
                    } else {
                        this.authServiceConsoleLog('refreshToken cookie is not valid!');
                        this.logout();
                    }
                })
            )
            .subscribe();
    }

    private refreshTokenTimeout(): void {
        const accessToken = this.accessToken$.value;
        if (!!accessToken) {
            const expDate = new Date(this.jwtService.getTokenExpirationDate(accessToken));
            expDate.setMinutes(expDate.getMinutes() - 1);
            const now = new Date();
            const expMs = expDate.getTime() - now.getTime();
            setTimeout(() => {
                this.refreshToken();
            }, expMs);
        } else {
            this.authServiceConsoleLog('Cant set timeout, no accessToken!');
            this.logout();
        }
    }

    public verifyToken(token: string): Observable<any> {
        return this.http.post(this.api_url + '/login/token-verify/', { token });
    }

    public checkSesion(): void {
        this.authServiceConsoleLog('Checking sesion...');
        const accessToken = localStorage.getItem('accessToken');
        if (!!accessToken) {
            this.verifyToken(accessToken)
                .pipe(
                    catchError(error => {
                        console.error(error);
                        return of(null);
                    })
                )
                .subscribe(resp => {
                    // If accessToken still valid
                    if (!!resp) {
                        this.authServiceConsoleLog('Setting existing sesion...');
                        this.setNewLogin(accessToken);
                    } else {
                        this.refreshToken();
                    }
                });
        } else {
            this.authServiceConsoleLog('No accessToken found in localStorage!');
            this.logout();
        }

    }

    public logout(): void {
        localStorage.removeItem('accessToken');
        this.accessToken$.next(null);
        this.isAuth$.next(false);
        this.isCompleted$.next(true);
        this.authServiceConsoleLog('Logout!');
    }

    public register(credentials: BasicCredentials): Observable<any> {
        return this.http.post(this.api_url + '/users/create/', credentials)
            .pipe(
                switchMap(resp => {
                    return this.login(credentials);
                })
            );
    }

    private localStorageChange(): void {
        window.addEventListener('storage', () => {
            const savedAccessToken = localStorage.getItem('accessToken');
            if (!!savedAccessToken) {
                this.authServiceConsoleLog('Login from another tab!', savedAccessToken);
                this.setNewLogin(savedAccessToken);
                this.router.navigate([]);
            } else {
                this.authServiceConsoleLog('Logout from another tab!', savedAccessToken);
                this.logout();
                this.router.navigate([]);
            }
        });
    }

    private authServiceConsoleLog(...data: any[]): void {
        console.log(
            `%c (AUTH-SERVICE): ${data[0]}`,
            'background: #222; color: #bada55',
            ...data.splice(1,1)
        );
    }
}
