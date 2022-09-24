import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { WindowResizeService } from '../../services/window-resize.service';

import { SidenavComponent } from 'src/app/shared/enums/sidenav.enum';

import { Unsubscriber } from '../../utils/unsubscriber';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends Unsubscriber implements OnInit {
    public isUserAuth = false;
    public isDesktop = false;

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService,
        private windowResize: WindowResizeService
    ) {
        super();
        this.windowResize.isDesktop$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(value => this.isDesktop = value);
    }

    public ngOnInit(): void {
        this.authService.isAuth$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(isAuth => {
                this.isUserAuth = !!isAuth;
            });
    }

    public openSidenav(): void {
        this.sidenav.open(SidenavComponent.NAVIGATION_SIDENAV);
    }

    public logout(): void {
        this.authService.logout();
    }
}
