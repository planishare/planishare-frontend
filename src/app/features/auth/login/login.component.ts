import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { BasicCredentials } from 'src/app/core/types/auth.type';

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

    constructor(
        private authService: AuthService,
        private router: Router
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
                    catchError((error: HttpErrorResponse) => {
                        // TODO: Check if this still working
                        if (error.status === 401) {
                            this.wrongCredentials = true;
                        }
                        return of(null);
                    })
                )
                .subscribe(resp => {
                    if (!!resp) {
                        // TODO-OPT: redirect to a specific route
                        this.router.navigate(['/']);
                    }
                    this.isLoading = false;
                });

        } else {
            this.form.markAllAsTouched();
        }
    }

    public loginWithGoogle(): void {
        this.authService.loginWithGoogle()
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // TODO: Check if this still working
                    if (error.status === 401) {
                        this.wrongCredentials = true;
                    }
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    // TODO-OPT: redirect to a specific route
                    this.router.navigate(['/']);
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
}
