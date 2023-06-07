import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { inOutLeftAnimation, inOutRightAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-forgot-password-dialog',
    templateUrl: './forgot-password-dialog.component.html',
    styleUrls: ['./forgot-password-dialog.component.scss'],
    animations: [inOutLeftAnimation, inOutRightAnimation]
})
export class ForgotPasswordDialogComponent {
    public email = new FormControl<string>('', [Validators.required, Validators.email]);
    public loading = false;

    constructor(
        private firebaseAuthService: FirebaseAuthService,
        public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>
    ) {}

    public resetPassword(): void {
        if (this.email.invalid) {
            this.email.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.firebaseAuthService.sendPasswordResetEmail(this.email.value!).pipe(
            take(1)
        ).subscribe(emailSended => {
            if (emailSended) {
                this.dialogRef.close();
            }
            this.loading = false;
        });
    }
}
