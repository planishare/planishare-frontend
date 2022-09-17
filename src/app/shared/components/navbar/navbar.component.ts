import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SidenavComponent } from 'src/app/shared/enums/sidenav.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { NavbarService } from '../../services/navbar.service';
import { ButtonsConfig } from '../../types/navbar.type';
import { isMobile, isTablet } from '../../utils/window-width';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isMobile = isMobile;
    public isTablet = isTablet;
    public isUserAuth = false;

    public buttonConfig?: Observable<ButtonsConfig>;

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private navbarService: NavbarService
    ) {
        this.buttonConfig = this.navbarService.getButtonsConfig();
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
