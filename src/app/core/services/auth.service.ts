import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, from, map, Observable, of, retry, skip, switchMap, take, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
    Auth,
    User,
    UserCredential,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInAnonymously,
    createUserWithEmailAndPassword,
    signOut
} from '@angular/fire/auth';

import { FirebaseAuthService } from './firebase-auth.service';
import { UsersService } from './users.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { BasicCredentials } from '../types/auth.type';
import { IUserDetail, IUserForm, UserDetail } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Emits true when completes a new sesion process
    public isCompleted$ = new BehaviorSubject<boolean>(false);

    // Emits the User instance of Firebase Auth
    public isAuth$ = new BehaviorSubject<User | null>(null);

    private alreadyRegistered$ = new BehaviorSubject<boolean>(false);
    private _userDetail: UserDetail | null = null;
    private _accessToken: string | null = null;

    constructor(
        private auth: Auth,
        private http: HttpClient,
        private userService: UsersService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private firebaseAuthService: FirebaseAuthService,
        private router: Router
    ) {
        let isFirstAccess = true;
        onAuthStateChanged(auth, (user: User | null) => {
            if (!user) {
                this.authLog('onAuthStateChanged: no auth', user);
                signInAnonymously(this.auth);
                return;
            }

            if (user.isAnonymous) {
                this.authLog('onAuthStateChanged: anonymous auth', user);
                user.getIdToken().then(token => {
                    this._accessToken = token;
                    this._userDetail = null;
                    this.isAuth$.next(null);
                    this.isCompleted$.next(true);
                });
                return;
            }

            // Login with email or Login/Register with Google
            this.authLog('onAuthStateChanged: auth', user);
            this.alreadyRegistered$.next(isFirstAccess);
            isFirstAccess = false;
            this.alreadyRegistered$.pipe(
                filter(value => value),
                take(1),
                switchMap(() => {
                    return from(user.getIdToken());
                }),
                switchMap((accessToken: string) => {
                    this._accessToken = accessToken;
                    return this.userService.getUserProfileByEmail(user.email!);
                }),
                retry(1),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.logout();
                    return of();
                }),
                takeUntil(this.isCompleted$.pipe(skip(1)))
            ).subscribe((userDetail: IUserDetail) => {
                this._userDetail = new UserDetail(userDetail);
                this.isAuth$.next(user);
                this.isCompleted$.next(true);
            });
            return;
        },
        error => {
            console.log(error);
            this.commonSnackbarMsg.showErrorMessage();
            this.isCompleted$.next(true);
        });
    }

    // Register in planishare backend
    public register(newUser: IUserForm | BasicCredentials): Observable<any> {
        return this.http.post(environment.apiUrl + '/auth/register/', newUser).pipe(
            tap(() => {
                this.alreadyRegistered$.next(true);
            })
        );
    }

    public loginWithEmailAndPassword(credentials: BasicCredentials): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
            tap(() => this.alreadyRegistered$.next(true))
        );
    }

    public loginWithGoogle(): Observable<UserCredential> {
        return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
            switchMap((userCredential: UserCredential | any) => {
                const data = userCredential._tokenResponse;
                if (data.isNewUser) {
                    const newUser: IUserForm = {
                        email: data.email,
                        first_name: data.firstName,
                        last_name: data.lastName
                    };
                    return this.register(newUser).pipe(map(() => userCredential));
                }
                this.alreadyRegistered$.next(true);
                return of(userCredential);
            })
        );
    }

    public registerWithEmailAndPassword(credentials: BasicCredentials): Observable<any> {
        return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                switchMap(() => {
                    this.firebaseAuthService.sendEmailVerification();
                    return this.register(credentials);
                })
            );
    }

    public logout(): void {
        signOut(this.auth);
        this.isAuth$.asObservable().pipe(
            filter(user => !!user),
            take(1)
        ).subscribe(() => {
            this.authLog('logout');
            this.router.navigate(['/auth/login']);
        });
    }

    public getAccessToken(): string | undefined {
        return this._accessToken ?? undefined;
    }

    public setUserDetail(data: UserDetail | null) {
        this._userDetail = data;
        localStorage.setItem('authUserDetail', JSON.stringify(data ?? {}));
    }

    // Get in memory auth user detail
    public getUserDetail(): UserDetail | null {
        return this._userDetail;
    }

    // Request backend auth user detail
    public refreshUserDetail(): Observable<IUserDetail | undefined> {
        const user = this.isAuth$.getValue();
        if (!!user) {
            return this.userService.getUserProfileByEmail(user.email!).pipe(
                tap((userDetail: IUserDetail) => {
                    this._userDetail = new UserDetail(userDetail);
                })
            );
        }
        return of(undefined);
    }

    private authLog(...data: any[]): void {
        if (!environment.production) {
            console.log(
                `%c (AUTH-SERVICE): ${data[0]}`,
                'background: #222; color: #bada55',
                ...data.splice(1,1)
            );
        }
    }
}
