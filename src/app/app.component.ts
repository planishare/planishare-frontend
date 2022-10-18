import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './core/services/auth.service';
import { inOutYAnimation } from './shared/animations/animations';
import { WindowResizeService } from './shared/services/window-resize.service';
import { WindowScrollService } from './shared/services/window-scroll.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [inOutYAnimation]
})
export class AppComponent implements OnInit {
    public inMaintenance = false;
    public isAuthCompleted = false;

    constructor (
        private authService: AuthService,
        private matSnackBar: MatSnackBar,
        private windowResize: WindowResizeService,
        private windowScroll: WindowScrollService
    ) {
        this.windowResize.startListening();
        this.windowScroll.startListening();
    }

    public ngOnInit(): void {
        this.authService.isCompleted$.asObservable()
            .subscribe((isAuthCompleted: boolean) => {
                this.isAuthCompleted = isAuthCompleted;
            });

        if (this.inMaintenance) {
            this.matSnackBar.open('Estamos trabajando en actualizaciones, te recomendamos volver más tarde. 🔧');
        }
    }
}
