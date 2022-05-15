import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, from, map, Observable, of, skip, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicCredentials, RegisterInfo } from '../types/auth.type';

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
import { UsersService } from './users.service';
import { UserDetail } from '../types/users.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public isAuth$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    // Emits true when auth services finish loading
    public isCompleted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private accessToken?: string;
    private userProfile?: UserDetail;

    private isRegistered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private auth: Auth,
        private http: HttpClient,
        private userService: UsersService,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        let isFirstAccess = true;
        onAuthStateChanged(auth, (user: any) => {
            if (!!user) {
                if (user?.isAnonymous) {
                    this.authServiceConsoleLog('onAuthStateChanged (anonymous)', user);
                    this.accessToken = user?.accessToken;
                    this.isAuth$.next(null);
                    this.isCompleted$.next(true);
                } else {
                    // The user is already registered if is firts access and user is auth
                    if (isFirstAccess) {
                        this.isRegistered$.next(true);
                        isFirstAccess = false;
                    }

                    // Authenticate with Google or Email and password
                    this.authServiceConsoleLog('onAuthStateChanged', user);
                    this.accessToken = user?.accessToken;
                    this.isAuth$.next(user);

                    // Get user profile info from planishare backend
                    this.isRegistered$.asObservable()
                        .pipe(
                            filter(isRegisted => isRegisted), // If is registered
                            take(1), // Take one and complete, for performance
                            switchMap(() => {
                                return this.userService.getUserProfileByEmail(user.email);
                            }),
                            catchError(() => {
                                this.commonSnackbarMsg.showErrorMessage();
                                this.isCompleted$.next(false);
                                return of(null);
                            })
                        )
                        .subscribe((userProfile: UserDetail | null) => {
                            if (!!userProfile) {
                                this.userProfile = userProfile;
                                this.isCompleted$.next(true);
                            }
                        });
                }
            } else {
                // Authenticate anonimous, need for make ps-backend requests
                this.loginAnonymously();
            }
        });
    }

    public loginAnonymously(): Observable<UserCredential | null> {
        this.userProfile = undefined;
        return from(signInAnonymously(this.auth))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('loginAnonymously', resp);
                }),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.isCompleted$.next(false);
                    return of(null);
                })
            );
    }

    public loginWithEmailAndPassword(credentials: BasicCredentials): Observable<UserCredential> {
        return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('loginWithEmailAndPassword', resp);
                    this.isRegistered$.next(true);
                })
            );
    }

    public loginWithGoogle(): Observable<UserCredential> {
        return from(signInWithPopup(this.auth, new GoogleAuthProvider()))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('loginOrRegisterWithGoogle', resp);
                }),
                switchMap((resp: any) => {
                    const data = resp._tokenResponse;
                    // If is new user then save data in planishare database
                    if (data.isNewUser) {
                        const registerInfo: RegisterInfo = {
                            email: data.email,
                            first_name: data.firstName,
                            last_name: data.lastName
                        };
                        return this.register(registerInfo);
                    }
                    this.isRegistered$.next(true);
                    return of(resp);
                })
            );
    }

    // Register in firebase
    public registerWithEmailAndPassword(credentials: BasicCredentials): Observable<UserCredential> {
        return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                tap(resp => {
                    this.authServiceConsoleLog('registerWithEmailAndPassword', resp);
                }),
                switchMap(resp => {
                    return this.register(credentials);
                })
            );
    }

    // Register in planishare backend
    public register(credentials: BasicCredentials | RegisterInfo): Observable<any> {
        return this.http.post(environment.apiUrl + '/auth/register/', credentials)
            .pipe(
                tap((userProfile: any) => {
                    this.authServiceConsoleLog('register', userProfile);
                    this.isRegistered$.next(true);
                })
            );
    }

    public logout(): void {
        this.authServiceConsoleLog('Logout!');
        this.isRegistered$.next(false);
        from(signOut(this.auth));
    }

    // Utils
    public getAccessToken(): string | undefined {
        return this.accessToken;
    }

    public getUserProfile(): UserDetail | undefined {
        return this.userProfile;
    }

    private authServiceConsoleLog(...data: any[]): void {
        console.log(
            `%c (AUTH-SERVICE): ${data[0]}`,
            'background: #222; color: #bada55',
            ...data.splice(1,1)
        );
    }
}
