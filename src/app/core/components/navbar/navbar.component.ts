import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { WindowResizeService } from '../../../shared/services/window-resize.service';

import { SidenavComponent } from 'src/app/core/models/sidenav.enum';

import { Unsubscriber } from '../../../shared/utils/unsubscriber';
import { UserDetail } from 'src/app/features/user/models/user.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends Unsubscriber implements OnInit {
    public authUser?: UserDetail;
    public isDesktop = false;
    public onScroll = false;

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService,
        private windowResize: WindowResizeService
    ) {
        super();
        this.windowResize.isDesktop$.pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(value => this.isDesktop = value);
    }

    public ngOnInit(): void {
        this.authService.servicesLoaded$.pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(() => {
                this.authUser = this.authService.getUserDetail() ?? undefined;
            });
    }

    public openSidenav(): void {
        this.sidenav.open(SidenavComponent.NAVIGATION_SIDENAV);
    }

    public logout(): void {
        this.authService.logout();
    }
}
