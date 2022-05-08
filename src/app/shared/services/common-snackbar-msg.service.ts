import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CommonSnackbarMsgService {

    constructor(
        private matSnackbar: MatSnackBar,
        private router: Router
    ) { }

    public showLoginMessage(actionMsg: string): void {
        const msg = `Debes iniciar sesión para ${actionMsg} :(`;
        const action = 'Iniciar sesión';
        this.matSnackbar.open(msg, action).onAction()
            .subscribe(() => this.router.navigate(['/', 'auth', 'login']));
    }

    public showErrorMessage(): void {
        const msg = 'Ups! ha ocurrido un problema, intenta recargar';
        const action = 'Recargar';
        this.matSnackbar.open(msg, action).onAction()
            .subscribe(() => this.router.navigate(['']));
    }
}
