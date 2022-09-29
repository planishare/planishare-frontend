import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay, filter, pipe } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public title = 'planishare';
    public inMaintenance = false;
    public isAuthCompleted = false;

    constructor (
        private authService: AuthService,
        private matSnackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {
        this.authService.isCompleted$.asObservable()
            .subscribe((isAuthCompleted: boolean) => {
                this.isAuthCompleted = isAuthCompleted;
            });

        if (this.inMaintenance) {
            this.matSnackBar.open('Estamos trabajando en actualizaciones, te recomendamos volver más tarde. 🔧');
        }

        window.addEventListener("scroll", () => {
            console.log('scroll!');
        });
    }
}
