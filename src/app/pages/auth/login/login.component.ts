import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, of, takeUntil } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { FirebaseError } from 'firebase/app';
import { FirebaseAuthErrorCodes } from 'src/app/core/models/auth.enum';
import { LoginCredentials } from 'src/app/core/models/auth.model';

import { ForgotPasswordDialogComponent } from '../components/forgot-password-dialog/forgot-password-dialog.component';

import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Unsubscriber {
    public form = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        password: new FormControl<string>('', [Validators.required])
    });

    public showPassword = false;
    public wrongCredentials = false;
    public loading = false;
    public loadingGoogle = false;
    public redirectTo: string = '/';

    public mobile$ = this.windowResize.mobile$.pipe(takeUntil(this.ngUnsubscribe$));
    public desktop$ = this.windowResize.desktop$.pipe(takeUntil(this.ngUnsubscribe$));

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackbar: MatSnackBar,
        private matDialog: MatDialog,
        public windowResize: WindowResizeService
    ) {
        super();
        // Get url to redirect after login
        const params: Params = this.activatedRoute.snapshot.queryParams;
        this.redirectTo = params['redirectTo'] ?? '/homepage';
    }

    public loginWithEmailAndPassword(event: Event): void {
        event.preventDefault();
        this.loading = true;
        this.wrongCredentials = false;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.loading = false;
            return;
        }

        const credentials: LoginCredentials = {
            email: this.form.controls.email.value!,
            password: this.form.controls.password.value!
        };

        this.authService.loginWithEmailAndPassword(credentials).pipe(
            catchError((error: FirebaseError) => {
                this.handleAuthError(error.code);
                this.loading = false;
                return of();
            })
        ).subscribe(() => {
            this.loading = false;
            this.router.navigate([this.redirectTo]);
        });

    }

    public loginWithGoogle(): void {
        this.loadingGoogle = true;
        this.authService.loginWithGoogle().pipe(
            catchError((error: FirebaseError) => {
                this.handleAuthError(error.code);
                this.loadingGoogle = false;
                return of();
            })
        ).subscribe(() => {
            this.loadingGoogle = false;
            this.router.navigate([this.redirectTo]);
        });
    }

    public openForgotPasswordDialog(): void {
        this.matDialog.open(ForgotPasswordDialogComponent, {
            autoFocus: false
        });
    }

    private handleAuthError(error: string): void {
        switch (error) {
            case FirebaseAuthErrorCodes.EMAIL_NOT_FOUND:
                this.form.controls.password.setValue('');
                this.wrongCredentials = true;
                break;
            case FirebaseAuthErrorCodes.INVALID_PASSWORD:
                this.form.controls.password.setValue('');
                this.wrongCredentials = true;
                break;
            case FirebaseAuthErrorCodes.TOO_MANY_REQUESTS:
                this.matSnackbar.open(
                    'Has hecho demasiados intentos, intenta más tarde 😢',
                    'Cerrar'
                );
                break;
            case FirebaseAuthErrorCodes.USER_DISABLED:
                this.matSnackbar.open(
                    'Tu cuenta está desactivada 🕵️',
                    'Cerrar'
                );
                break;
            case FirebaseAuthErrorCodes.POPUP_CLOSED_BY_USER:
                break;
            default:
                this.commonSnackbarMsg.showErrorMessage();
                break;
        }
    }
}
