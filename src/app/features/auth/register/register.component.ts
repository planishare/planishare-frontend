import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { BasicCredentials } from 'src/app/core/types/auth.type';

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
export class RegisterComponent implements OnInit {

    public form: FormGroup;
    public matcher = new MyErrorStateMatcher();

    public hidePassword = true;
    public hideRepeatPassword = true;

    constructor(
        private authService: AuthService
    ) {
        this.form = new FormGroup(
            {
                email: new FormControl('', [ Validators.required, Validators.email]),
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
    }

    public ngOnInit(): void {
        this.form.valueChanges.subscribe(resp => {
            console.log(this.form.hasError('notSame'));
            console.log(this.form.errors);
        });
    }

    public register(event: Event): void {
        event.preventDefault();
        if (this.form.valid) {
            const credentials: BasicCredentials = {
                email: this.form.get('email')?.value,
                password: this.form.get('password')?.value
            };
            this.authService.register(credentials).subscribe();
        } else {
            this.form.markAllAsTouched();
        }
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
    public getRepeatPasswordErrorMessage() {
        return !!this.repeatPasswordControl?.hasError('notSame') ? 'Las contraseñas no coinciden' : '';
    }
}
