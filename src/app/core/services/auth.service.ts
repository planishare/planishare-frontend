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
    // Emits true when:
    //  - Anon users: Firebase authentication completes
    //  - No Anon users: Firebase authentication completes and get user details from planishare backend
    private _isCompleted$ = new BehaviorSubject<boolean>(false);
    public isCompleted$ = from(this._isCompleted$);

    // Store user authentication data
    public user: IAuthUser|null = null;

    // Emits the Firebase accessToken (also for anon auth)
    private accessToken$ = new BehaviorSubject<string | null>(null);

    // For internal service logic
    private alreadyRegistered$ = new BehaviorSubject<boolean>(false);

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
            this.alreadyRegistered$.next(isFirstAccess);
            isFirstAccess = false;

            if (!user) {
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
                    this.accessToken$.next(token);
                    this._isCompleted$.next(true);
                    this.alreadyRegistered$.next(false);
                });
                return;
            }

            // Login with email or Login/Register with Google
            this.authLog('onAuthStateChanged: auth', user);
            this.alreadyRegistered$.pipe(
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
                    this.accessToken$.next(token);
                    return this.userService.getUserProfileByEmail(user.email!);
                }),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.logout();
                    return of();
                }),
                takeUntil(this._isCompleted$.pipe(skip(1)))
            ).subscribe((data: IUserDetail) => {
                this.setUserDetail(new UserDetail(data));
                this._isCompleted$.next(true);
            });
            return;
        },
        error => {
            console.log(error);
            this.commonSnackbarMsg.showErrorMessage();
            this._isCompleted$.next(true);
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
                    return this._isCompleted$.asObservable();
                }),
                filter(isCompleted => !!isCompleted)
            );
    }

    public registerInPlanishare(newUser: IUserForm | BasicCredentials): Observable<any> {
        return this.http.post(environment.planishare.protectedAnon + '/auth/register/', newUser).pipe(
            tap(() => {
                this.alreadyRegistered$.next(true);
            })
        );
    }

    public loginWithEmailAndPassword(credentials: BasicCredentials): Observable<boolean> {
        return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
            tap(() => this.alreadyRegistered$.next(true)),
            switchMap(() => {
                return this._isCompleted$.asObservable();
            }),
            filter(isCompleted => !!isCompleted)
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
                this.alreadyRegistered$.next(true);
                return of(userCredential);
            }),
            switchMap(() => {
                return this._isCompleted$.asObservable();
            }),
            filter(isCompleted => !!isCompleted)
        );
    }

    public logout(): void {
        this._isCompleted$.next(false);
        signOut(this.auth);

        // Listen isCompleted$ when emit true in onAuthStateChanged
        this.isCompleted$.pipe(
            filter(user => !!user),
            take(1)
        ).subscribe(() => {
            this.authLog('logout');
            this.router.navigate(['/auth/login']);
        });
    }

    public getAccessToken(): Observable<string | null> {
        return this.accessToken$.asObservable();
    }

    public setUserDetail(data: UserDetail | null) {
        if (this.user) {
            this.user.detail = data ?? undefined;
            localStorage.setItem('authUserDetail', JSON.stringify(data ?? {}));
        }
    }

    public getUserDetail(): UserDetail | null {
        return this.user?.detail ?? null;
    }

    public refreshUserDetail(): Observable<IUserDetail | undefined> {
        if (this.user && !this.user.isAnon) {
            return this.userService.getUserProfileByEmail(this.user.firebaseUser.email!).pipe(
                tap((userDetail: IUserDetail) => {
                    this.user!.detail = new UserDetail(userDetail);
                })
            );
        }
        return of(undefined);
    }

    private authLog(...data: any[]): void {
        console.log(
            `%c (AUTH-SERVICE): ${data[0]}`,
            'background: #222; color: #bada55',
            ...data.splice(1,1)
        );
    }
}
