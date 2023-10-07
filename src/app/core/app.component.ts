import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';

import { AuthService } from './services/auth.service';
import { WindowResizeService } from '../shared/services/window-resize.service';
import { LoadersService } from '../shared/services/loaders.service';

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
        this.windowResize.startListening();
        this.authService.loaded$.subscribe(loaded => {
            if (loaded && !this.inMaintenance) {
                this.loadersService.hideBookLoader();
            }
        });
    }

    public ngOnInit(): void {
        if (this.inMaintenance) {
            this.matSnackBar.open('Estamos trabajando en actualizaciones, te recomendamos volver más tarde. 🔧');
        }
    }
}
