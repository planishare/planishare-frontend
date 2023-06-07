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
import { UsersService } from '../../features/user/services/users.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { BasicCredentials } from '../types/auth.type';
import { IUserDetail, IUserForm, UserDetail } from '../../features/user/models/user.model';
import { IAuthUser } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Emits the Firebase accessToken even if is anon auth
    private _accessToken$ = new BehaviorSubject<string | null>(null);
    public accessToken$ = this._accessToken$.asObservable();

    // Emits true when Firebase auth completes and initial services are loaded.
    private _servicesLoaded$ = new BehaviorSubject<boolean>(false);
    public servicesLoaded$ = this._servicesLoaded$.asObservable();

    // Store user authentication data. TODO: use as observable
    public user: IAuthUser|null = null;

    // To manage internal service logic related to registration
    private _alreadyRegistered$ = new BehaviorSubject<boolean>(false);

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
            this._alreadyRegistered$.next(isFirstAccess);
            isFirstAccess = false;

            if (!user) {
                this.router.navigate(['/auth/login']);
                this.authLog('onAuthStateChanged: no auth', user);
                signInAnonymously(this.auth);
                return;
            }

            if (user.isAnonymous) {
                this.authLog('onAuthStateChanged: anonymous auth', user);
                user.getIdToken().then(token => {
                    this.user = {
                        firebaseUser: user,
                        isAnon: true
                    };
                    this._accessToken$.next(token);
                    this._servicesLoaded$.next(true);
                    this._alreadyRegistered$.next(false);
                });
                return;
            }

            // Login with email or Login/Register with Google
            this.authLog('onAuthStateChanged: auth', user);
            this._alreadyRegistered$.pipe(
                filter(value => value),
                take(1),
                switchMap(() => {
                    return from(user.getIdToken());
                }),
                switchMap((token: string) => {
                    this.user = {
                        firebaseUser: user,
                        isAnon: false
                    };
                    this._accessToken$.next(token);
                    return this.userService.getUserProfileByEmail(user.email!);
                }),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.logout();
                    return of();
                }),
                takeUntil(this._servicesLoaded$.pipe(skip(1)))
            ).subscribe((data: IUserDetail) => {
                this.setUserDetail(new UserDetail(data));
                this._servicesLoaded$.next(true);
            });
            return;
        },
        error => {
            console.log(error);
            this.commonSnackbarMsg.showErrorMessage();
            this._servicesLoaded$.next(true);
        });
    }

    public registerWithEmailAndPassword(credentials: BasicCredentials): Observable<boolean> {
        return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                switchMap(() => {
                    return this.registerInPlanishare(credentials);
                }),
                switchMap(() => {
                    this.firebaseAuthService.sendEmailVerification();
                    return this._servicesLoaded$.asObservable();
                }),
                filter(loaded => !!loaded)
            );
    }

    public registerInPlanishare(newUser: IUserForm | BasicCredentials): Observable<any> {
        return this.http.post(environment.planishare.protectedAnon + '/auth/register/', newUser).pipe(
            tap(() => {
                this._alreadyRegistered$.next(true);
            })
        );
    }

    public loginWithEmailAndPassword(credentials: BasicCredentials): Observable<boolean> {
        return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
            tap(() => this._alreadyRegistered$.next(true)),
            switchMap(() => {
                return this._servicesLoaded$.asObservable();
            }),
            filter(loaded => !!loaded)
        );
    }

    public loginWithGoogle(): Observable<boolean> {
        return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
            switchMap((userCredential: UserCredential | any) => {
                const data = userCredential._tokenResponse;
                if (data.isNewUser) {
                    const newUser: IUserForm = {
                        email: data.email,
                        first_name: data.firstName,
                        last_name: data.lastName
                    };
                    return this.registerInPlanishare(newUser).pipe(map(() => userCredential));
                }
                this._alreadyRegistered$.next(true);
                return of(userCredential);
            }),
            switchMap(() => {
                return this._servicesLoaded$.asObservable();
            }),
            filter(loaded => !!loaded)
        );
    }

    public logout(): void {
        this._servicesLoaded$.next(false);
        signOut(this.auth);
    }

    // Current user methods
    public setUserDetail(data: UserDetail | null) {
        if (this.user && !this.user.isAnon) {
            this.user.detail = data ?? undefined;
            localStorage.setItem('authUserDetail', JSON.stringify(data ?? {}));
        }
    }

    public getUserDetail(): UserDetail | null {
        return this.user?.detail ?? null;
    }

    public refreshUserDetail(): Observable<IUserDetail | null> {
        if (this.user && !this.user.isAnon) {
            return this.userService.getUserProfileByEmail(this.user.firebaseUser.email!).pipe(
                tap((userDetail: IUserDetail) => {
                    this.user!.detail = new UserDetail(userDetail);
                })
            );
        }
        return of(null);
    }

    // Utils
    private authLog(...data: any[]): void {
        console.log(
            `%c (AUTH-SERVICE): ${data[0]}`,
            'background: #222; color: #bada55',
            ...data.splice(1,1)
        );
    }
}
