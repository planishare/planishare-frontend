import { Component, OnInit } from '@angular/core';
import { delay, filter, pipe } from 'rxjs';
import { AuthService } from './core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public title = 'planishare';
    public isAuthCompleted = false;

    constructor (
        private authService: AuthService
    ) {}

    public ngOnInit(): void {
        this.authService.checkSesion();

        // TODO: Change loader and add animation
        this.authService.isCompleted$.asObservable()
            .pipe(
                // filter(isComplete => isComplete)
                delay(100)
            )
            .subscribe(() => {
                this.isAuthCompleted = true;
            });
    }
}
