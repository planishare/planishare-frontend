import { Component } from '@angular/core';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends Unsubscriber {
    public desktop$ = this.windowResize.desktop$.pipe(takeUntil(this.ngUnsubscribe$));
    public authUser$ = this.authService.accessToken$;

    public navOpen = false;

    constructor(
        private windowResize: WindowResizeService,
        private authService: AuthService
    ) {
        super();
    }

    public logout(): void {
        this.authService.logout();
    }

    public closeSidenav(): void {
        this.navOpen = false;
    }
}
