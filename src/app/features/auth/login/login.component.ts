import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { catchError, of } from 'rxjs';
import { FirebaseAuthErrorCodes } from 'src/app/core/enums/auth.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { BasicCredentials } from 'src/app/core/types/auth.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { ForgotPasswordDialogComponent } from '../components/forgot-password-dialog/forgot-password-dialog.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public form: FormGroup;
    public hidePassword = true;

    public wrongCredentials = false;
    public isLoading = false;

    public redirectTo: string = '/';

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackbar: MatSnackBar,
        private firebaseAuthService: FirebaseAuthService,
        private matDialog: MatDialog
    ) {
        this.form = new FormGroup(
            {
                email: new FormControl('', [ Validators.required, Validators.email]),
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/(?=.*?[a-z])(?=.*\d)/)
                ])
            }
        );

        // Get url to redirect after login
        const params: Params = this.activatedRoute.snapshot.queryParams;
        this.redirectTo = params['redirectTo'] ?? '/';
    }

    public ngOnInit(): void {
        this.form.valueChanges.subscribe();
    }

    public loginWithEmailAndPassword(event: Event): void {
        event.preventDefault();
        if (this.form.valid) {
            const credentials: BasicCredentials = {
                email: this.form.get('email')?.value,
                password: this.form.get('password')?.value
            };
            this.isLoading = true;

            this.authService.loginWithEmailAndPassword(credentials)
                .pipe(
                    catchError((error: FirebaseError) => {
                        if (
                            error.code === FirebaseAuthErrorCodes.EMAIL_NOT_FOUND ||
                            error.code === FirebaseAuthErrorCodes.INVALID_PASSWORD
                        ) {
                            this.wrongCredentials = true;
                        } else
                        if (error.code === FirebaseAuthErrorCodes.TOO_MANY_REQUESTS) {
                            this.matSnackbar.open(
                                'Has hecho demasiados intentos, intenta más tarde 😢',
                                'Cerrar'
                            );
                        } else
                        if (error.code === FirebaseAuthErrorCodes.USER_DISABLED) {
                            this.matSnackbar.open(
                                'Tu cuenta está desactivada 🕵️',
                                'Cerrar'
                            );
                        } else {
                            this.commonSnackbarMsg.showErrorMessage();
                        }
                        return of(null);
                    })
                )
                .subscribe(resp => {
                    if (!!resp) {
                        this.router.navigate([this.redirectTo]);
                    }
                    this.isLoading = false;
                });

        } else {
            this.form.markAllAsTouched();
        }
    }

    public loginWithGoogle(): void {
        this.isLoading = true;
        this.authService.loginWithGoogle()
            .pipe(
                catchError((error: FirebaseError) => {
                    if (error.code === FirebaseAuthErrorCodes.USER_DISABLED) {
                        this.matSnackbar.open(
                            'Tu cuenta está desactivada 🕵️',
                            'Cerrar'
                        );
                    } else {
                        this.commonSnackbarMsg.showErrorMessage();
                    }
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.router.navigate([this.redirectTo]);
                }
                this.isLoading = false;
            });
    }

    public get emailControl() {
        return this.form.get('email');
    }
    public get passwordControl() {
        return this.form.get('password');
    }

    public getEmailErrorMessage() {
        if (this.emailControl?.hasError('required')) {
            return 'Ingresa un email';
        }
        return this.emailControl?.hasError('email') ? 'Email no válido' : '';
    }
    public getPasswordErrorMessage() {
        if (this.passwordControl?.hasError('required')) {
            return 'Ingresa una contraseña';
        }
        return !!this.passwordControl?.errors ? 'Contraseña no válida' : '';
    }

    public openForgotPasswordDialog(): void {
        this.matDialog.open(ForgotPasswordDialogComponent, {
            autoFocus: false
        });
    }
}
