import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { FirebaseError } from 'firebase/app';
import { FirebaseAuthErrorCodes } from 'src/app/core/models/auth.enum';
import { BasicCredentials } from 'src/app/core/models/auth.model';

import { ForgotPasswordDialogComponent } from '../components/forgot-password-dialog/forgot-password-dialog.component';

import { inOutLeftAnimation, inOutRightAnimation } from 'src/app/shared/animations/animations';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [inOutLeftAnimation, inOutRightAnimation]
})
export class LoginComponent {
    public form = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        password: new FormControl<string>('', [Validators.required])
    });

    public showPassword = false;
    public wrongCredentials = false;
    public loading = false;
    public loadingGoogle = false;

    public redirectTo: string = '/';

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackbar: MatSnackBar,
        private matDialog: MatDialog,
        public windowResize: WindowResizeService
    ) {
        // Get url to redirect after login
        const params: Params = this.activatedRoute.snapshot.queryParams;
        this.redirectTo = params['redirectTo'] ?? '/posts/list';
    }

    public loginWithEmailAndPassword(event: Event): void {
        event.preventDefault();

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.wrongCredentials = false;
        const credentials: BasicCredentials = {
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
