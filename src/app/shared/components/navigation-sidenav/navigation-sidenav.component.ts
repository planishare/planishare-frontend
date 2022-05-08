import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';

@Component({
    selector: 'app-navigation-sidenav',
    templateUrl: './navigation-sidenav.component.html',
    styleUrls: ['./navigation-sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavigationSidenavComponent implements OnInit {
    public isUserAuth = false;

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService
    ) { }

    public ngOnInit(): void {
        this.authService.isAuth$.subscribe(isAuth => {
            this.isUserAuth = !!isAuth;
        });
    }

    public logout(): void {
        this.authService.logout();
    }

    public hideSidenav(): void {
        this.sidenav.close();
    }
}
