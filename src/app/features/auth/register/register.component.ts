import { Component } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

import { FirebaseError } from 'firebase/app';
import { FirebaseAuthErrorCodes } from 'src/app/core/models/auth.model';
import { BasicCredentials } from 'src/app/core/models/auth.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from 'src/app/features/user/services/users.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { inOutLeftAnimation, inOutRightAnimation } from 'src/app/shared/animations/animations';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: [inOutLeftAnimation, inOutRightAnimation]
})
export class RegisterComponent {

    public form = new FormGroup(
        {
            email: new FormControl<string>(
                '',
                [Validators.required, Validators.email],
                this.isEmailAvailableValidator.bind(this)
            ),
            password: new FormControl<string>('', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/(?=.*?[a-z])(?=.*\d)/)
            ]),
            passwordConfirmation: new FormControl<string>('', Validators.required)
        },
        {
            validators: this.checkPasswords
        } as AbstractControlOptions
    );

    public redirectTo: string = '/';

    public showPassword = false;
    public showPasswordConfirmation = false;
    public loading = false;
    public loadingGoogle = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UsersService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackbar: MatSnackBar,
        public windowResize: WindowResizeService
    ) {
        // Get url to redirect after login
        const params: Params = this.activatedRoute.snapshot.queryParams;
        this.redirectTo = params['redirectTo'] ?? '/';
    }

    public registerWithEmailAndPassword(event: Event): void {
        event.preventDefault();

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        const credentials: BasicCredentials = {
            email: this.form.controls.email.value!,
            password: this.form.controls.password.value!
        };

        this.authService.registerWithEmailAndPassword(credentials).pipe(
            catchError((error: FirebaseError) => {
                switch (error.code) {
                    case FirebaseAuthErrorCodes.EMAIL_ALREADY_USED:
                        this.form.controls.email.setErrors({ alreadyUsed: true });
                        this.matSnackbar.open(
                            'Ya existe una cuenta registrada con este email 👀',
                            'Cerrar'
                        );
                        break;
                    default:
                        this.commonSnackbarMsg.showErrorMessage();
                        break;
                }
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
                switch (error.code) {
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
                this.loadingGoogle = false;
                return of();
            })
        ).subscribe(() => {
            this.router.navigate([this.redirectTo]);
        });
    }

    public checkPasswords(group: FormGroup): null | { notSame: true } {
        const password: string = group.controls['password'].value;
        const passwordConfirmation: string = group.controls['passwordConfirmation'].value;
        if (password !== passwordConfirmation) {
            group.controls['passwordConfirmation'].setErrors({ notSame: true });
            return { notSame: true };
        }
        return null;
    }

    public isEmailAvailableValidator(control: AbstractControl): Observable<null | { alreadyUsed: true }> {
        const email = control.value;
        return this.userService.isEmailAvailable(email).pipe(
            map(data => {
                return data.isAvailable ? null : { alreadyUsed: true };
            })
        );
    }
}
