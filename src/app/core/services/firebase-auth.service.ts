import { Injectable } from '@angular/core';
import {
    Auth,
    sendEmailVerification,
    sendPasswordResetEmail
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseError } from 'firebase/app';
import { FirebaseAuthErrorCodes } from '../enums/auth.enum';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService {

    constructor(
        private auth: Auth,
        private matSnackbar: MatSnackBar
    ) { }

    public sendEmailVerification(): void {
        sendEmailVerification(this.auth.currentUser!)
            .then(() => {
                this.matSnackbar.open('Te enviamos un email para validar tu cuenta (revisa spam).', 'Cerrar', {
                    duration: 4000
                });
            })
            .catch(() => {
                this.showErrorMessage();
            });
    }

    public sendPasswordResetEmail(email: string): void {
        sendPasswordResetEmail(this.auth, email)
            .then(() => {
                this.matSnackbar.open('Te enviaremos un email para que cambies tu contraseña :)', 'Cerrar', {
                    duration: 4000
                });
            })
            .catch((error: FirebaseError) => {
                if (error.code === FirebaseAuthErrorCodes.USER_NOT_FOUND) {
                    this.showErrorMessage('Emm... el email ingresado no está registrado 😅');
                } else {
                    this.showErrorMessage();
                }
            });
    }

    private showErrorMessage(
        msg = 'Ups! ha ocurrido un problema, recarga la página o intentalo más tarde'
    ): void {
        const action = 'Cerrar';
        this.matSnackbar.open(msg, action);
    }
}
