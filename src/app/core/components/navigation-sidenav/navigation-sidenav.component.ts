import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserDetail } from 'src/app/features/user/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';

@Component({
    selector: 'app-navigation-sidenav',
    templateUrl: './navigation-sidenav.component.html',
    styleUrls: ['./navigation-sidenav.component.scss']
})
export class NavigationSidenavComponent implements OnInit {
    public authUser?: UserDetail;

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService
    ) { }

    public ngOnInit(): void {
        this.authService.servicesLoaded$.subscribe(() => {
            this.authUser = this.authService.getUserDetail() ?? undefined;
        });
    }

    public logout(): void {
        this.authService.logout();
    }

    public hideSidenav(): void {
        this.sidenav.close();
    }
}
