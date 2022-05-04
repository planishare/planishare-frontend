import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SidenavComponent } from 'src/app/core/enums/sidenav.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { isMobile } from '../../utils';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isMobile = isMobile;
    public isUserAuth = false;

    constructor(
        private sidenav: SidenavService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute
    ) { }

    public ngOnInit(): void {
        this.authService.isAuth$
            .asObservable()
            .subscribe(isAuth => {
                this.isUserAuth = isAuth;
            });

        this.activatedRoute.data.subscribe(x => console.log(x));
        console.log(this.activatedRoute.snapshot.data);
    }

    public openSidenav(): void {
        this.sidenav.open(SidenavComponent.NAVIGATION_SIDENAV);
    }

    public logout(): void {
        this.authService.logout();
    }
}
