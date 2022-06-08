import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Auth,
    sendEmailVerification
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

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
                this.matSnackbar.open('Revisa tu email para validar tu cuenta :)', 'Cerrar', {
                    duration: 4000
                });
            })
            .catch(() => {
                this.showErrorMessage();
            });
    }

    private showErrorMessage(): void {
        const msg = 'Ups! ha ocurrido un problema, recarga la página o intentalo más tarde';
        const action = 'Cerrar';
        this.matSnackbar.open(msg, action);
    }
}
