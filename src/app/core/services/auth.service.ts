import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, from, map, Observable, of, first, skip, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
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
import { UsersService } from '../../pages/user/services/users.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { LoginCredentials } from '../models/auth.model';
import { IUserDetail, IUserForm, UserDetail } from '../../pages/user/models/user.model';
import { IAuthUser } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Emits the Firebase accessToken even if is anon auth
    private _accessToken$ = new BehaviorSubject<string|null>(null);
    public accessToken$ = this._accessToken$.asObservable();

    // Emits true when Firebase auth completes and initial services are loaded.
    private _loaded$ = new BehaviorSubject<boolean>(false);
    public loaded$ = this._loaded$.asObservable();

    // Store user authentication data
    public user: IAuthUser|null = null;
    private _user$ = new BehaviorSubject<IAuthUser|null>(this.user);
    public user$ = this._user$.asObservable();

    constructor(
        private auth: Auth,
        private http: HttpClient,
        private userService: UsersService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private firebaseAuthService: FirebaseAuthService,
        private router: Router
    ) {
        onAuthStateChanged(auth, (user: User|null) => {
            if (!user) {
                this.authLog('onAuthStateChanged: no auth', user);
                this._accessToken$.next(null);
                this._loaded$.next(true);
                return;
            }

            // Login with email or Login/Register with Google
            this.authLog('onAuthStateChanged: auth', user);
            from(user.getIdToken()).pipe(
                first(),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.logout();
                    return of();
                })
            ).subscribe((token: string) => {
                this.user = { firebaseUser: user };
                // this._user$.next(this.user);
                this._accessToken$.next(token);
                this._loaded$.next(true);

                this.requestUserDetail(user.email!).subscribe();
            });
        },
        error => {
            console.log(error);
            this.commonSnackbarMsg.showErrorMessage();
            this._loaded$.next(true);
        });
    }

    public registerWithEmailAndPassword(credentials: LoginCredentials): Observable<boolean> {
        return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password))
            .pipe(
                switchMap(() => {
                    return this.registerInPlanishare(credentials);
                }),
                switchMap(() => {
                    this.firebaseAuthService.sendEmailVerification();
                    return this._loaded$.asObservable();
                }),
                filter(loaded => !!loaded)
            );
    }

    public registerInPlanishare(newUser: IUserForm|LoginCredentials): Observable<any> {
        return this.http.post(environment.planishare.public + '/auth/register/', newUser).pipe(
            switchMap(() => this.requestUserDetail(this.user?.firebaseUser.email!))
        );
    }

    public loginWithEmailAndPassword(credentials: LoginCredentials): Observable<boolean> {
        return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
            switchMap(() => {
                return this._loaded$.asObservable();
            }),
            filter(loaded => !!loaded)
        );
    }

    public loginWithGoogle(): Observable<boolean> {
        return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
            switchMap((userCredential: UserCredential|any) => {
                const data = userCredential._tokenResponse;
                if (data.isNewUser) {
                    const newUser: IUserForm = {
                        email: data.email,
                        first_name: data.firstName,
                        last_name: data.lastName
                    };
                    return this.registerInPlanishare(newUser).pipe(map(() => userCredential));
                }
                return of(userCredential);
            }),
            switchMap(() => {
                return this._loaded$.asObservable();
            }),
            filter(loaded => !!loaded)
        );
    }

    public logout(): void {
        this._loaded$.next(false);
        signOut(this.auth);
        this.router.navigate(['/']);
    }

    public requestUserDetail(email: string): Observable<IUserDetail|null> {
        return this.userService.getUserProfileByEmail(email).pipe(
            tap((userDetail: IUserDetail) => {
                if (this.user) {
                    this.user.detail = new UserDetail(userDetail);
                    this._user$.next(this.user);
                    localStorage.setItem('authUserDetail', JSON.stringify(userDetail ?? {})); // For Rollbar logs
                }
            })
        );
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
