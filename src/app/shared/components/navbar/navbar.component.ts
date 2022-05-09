import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidenavComponent } from 'src/app/core/enums/sidenav.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { NavbarService } from '../../services/navbar.service';
import { ButtonsConfig } from '../../types/navbar.type';
import { isMobile } from '../../utils';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isMobile = isMobile;
    public isUserAuth = false;

    public buttons: ButtonsConfig = {
        desktopSearchButton: true,
        desktopLogo: false,
        mobileSearchButton: true,
        mobileLogo: false
    };

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService,
        private navbarService: NavbarService
    ) {
        this.navbarService.getButtonConfig().subscribe(buttonsConfig => this.buttons = buttonsConfig);
    }

    public ngOnInit(): void {
        this.authService.isAuth$.subscribe(isAuth => {
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
