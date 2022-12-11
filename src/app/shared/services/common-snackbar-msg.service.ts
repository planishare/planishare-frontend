import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';

@Injectable({
    providedIn: 'root'
})
export class CommonSnackbarMsgService {

    constructor(
        private matSnackbar: MatSnackBar,
        private router: Router,
        private firebaseAuthService: FirebaseAuthService
    ) { }

    public showLoginRequiredMessage(actionMsg: string): void {
        const msg = `Debes iniciar sesión para ${actionMsg} :(`;
        const action = 'Iniciar sesión';
        this.matSnackbar.open(msg, action, {
            duration: 4000
        }).onAction()
            .subscribe(() => this.router.navigate(['/', 'auth', 'login']));
    }

    public showVerficatedMessage(): void {
        const msg = `Primero debes verificar tu cuenta, si ya lo hiciste recarga la página 🙌`;
        const action = 'Reenviar email';
        this.matSnackbar.open(msg, action, {
            duration: 4000
        }).onAction()
            .subscribe(() => {
                this.firebaseAuthService.sendEmailVerification();
            });
    }

    public showErrorMessage(): void {
        const msg = 'Ups! ha ocurrido un problema, recarga la página o intentalo más tarde 😢';
        const action = 'Cerrar';
        this.matSnackbar.open(msg, action);
    }
}
