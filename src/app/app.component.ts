import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { inOutYAnimation } from './shared/animations/animations';
import { WindowResizeService } from './shared/services/window-resize.service';
import { LoadersService } from './shared/services/loaders.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public inMaintenance = false;

    constructor (
        private authService: AuthService,
        private matSnackBar: MatSnackBar,
        private windowResize: WindowResizeService,
        private loadersService: LoadersService
    ) {
        this.authService.servicesLoaded$.subscribe(loaded => {
            if (loaded && !this.inMaintenance) {
                this.loadersService.hideBookLoader();
            }
        });
        this.windowResize.startListening();
    }

    public ngOnInit(): void {
        if (this.inMaintenance) {
            this.matSnackBar.open('Estamos trabajando en actualizaciones, te recomendamos volver más tarde. 🔧');
        }
    }
}
