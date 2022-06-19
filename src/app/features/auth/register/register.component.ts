import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from 'src/app/core/services/users.service';
import { BasicCredentials } from 'src/app/core/types/auth.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

class MyErrorStateMatcher implements ErrorStateMatcher {
    public isErrorState(control: FormControl | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

    public form: FormGroup;
    public matcher = new MyErrorStateMatcher();

    public hidePassword = true;
    public hideRepeatPassword = true;

    public isLoading = false;

    public redirectTo: string = '/';

    constructor(
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UsersService,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        this.form = new FormGroup(
            {
                email: new FormControl('', [ Validators.required, Validators.email], this.isEmailAvailableValidator.bind(this)),
                password: new FormControl('', [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(/(?=.*?[a-z])(?=.*\d)/)
                ]),
                repeatPassword: new FormControl('')
            },
            {
                validators: this.checkPasswords
            } as AbstractControlOptions
        );

        // Get url to redirect after login
        const params: Params = this.activatedRoute.snapshot.queryParams;
        this.redirectTo = params['redirectTo'] ?? '/';
    }

    public registerWithEmailAndPassword(event: Event): void {
        event.preventDefault();
        if (this.form.valid) {
            const credentials: BasicCredentials = {
                email: this.form.get('email')?.value,
                password: this.form.get('password')?.value
            };
            this.isLoading = true;

            this.authService.registerWithEmailAndPassword(credentials)
                .pipe(
                    catchError((error: FirebaseError) => {
                        this.commonSnackbarMsg.showErrorMessage();
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
                    this.commonSnackbarMsg.showErrorMessage();
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
    public get repeatPasswordControl() {
        return this.form.get('repeatPassword');
    }

    public checkPasswords(group: FormGroup): any {
        const pass = group.controls['password'].value;
        const repeatPass = group.controls['repeatPassword'].value;
        if (pass !== repeatPass) {
            group.controls['repeatPassword'].setErrors({ notSame: true });
            return { notSame: true };
        }
        return null;
    }

    public isEmailAvailableValidator(control: AbstractControl): Observable<any> {
        const email = control.value;
        return this.userService.isEmailAvailable(email)
            .pipe(
                map(data => {
                    if (data.isAvailable) {
                        return null;
                    }
                    return { alreadyUsed: true };
                })
            );
    }

    public getEmailErrorMessage() {
        if (this.emailControl?.hasError('required')) {
            return 'Ingresa un email';
        }
        if (this.emailControl?.hasError('alreadyUsed')) {
            return 'Este email ya tiene una cuenta creada';
        }
        return this.emailControl?.hasError('email') ? 'Email no válido' : '';
    }
    public getPasswordErrorMessage() {
        if (this.passwordControl?.hasError('required')) {
            return 'Ingresa una contraseña';
        }
        if (this.passwordControl?.hasError('minlength')) {
            return 'Debe tener al menos 8 carácteres';
        }
        if (this.passwordControl?.hasError('pattern')) {
            return 'Debe tener al menos una letra y un número';
        }
        return !!this.passwordControl?.errors ? 'Contraseña no válida' : '';
    }
    public getRepeatPasswordErrorMessage() {
        return !!this.repeatPasswordControl?.hasError('notSame') ? 'Las contraseñas no coinciden' : '';
    }
}
