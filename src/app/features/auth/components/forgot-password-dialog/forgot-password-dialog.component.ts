import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';

@Component({
    selector: 'app-forgot-password-dialog',
    templateUrl: './forgot-password-dialog.component.html',
    styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
    public email: FormControl;
    public isLoading = false;

    constructor(
        private firebaseAuthService: FirebaseAuthService,
        public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>
    ) {
        this.email = new FormControl(null, [Validators.required, Validators.email]);
    }

    public resetPassword(): void {
        if (!!this.email.valid) {
            this.isLoading = true;
            this.firebaseAuthService.sendPasswordResetEmail(this.email.value);

            setTimeout(() => {
                this.dialogRef.close();
            }, 1500);
        }
    }

    public getEmailErrorMessage() {
        if (this.email?.hasError('required')) {
            return 'Ingresa un email';
        }
        return this.email?.hasError('email') ? 'Email no válido' : '';
    }
}
