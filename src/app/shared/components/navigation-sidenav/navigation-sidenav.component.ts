import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { UserDetail } from 'src/app/core/types/users.type';

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
        this.authService.isAuth$.subscribe(() => {
            this.authUser = this.authService.getUserProfile();
        });
    }

    public logout(): void {
        this.authService.logout();
    }

    public hideSidenav(): void {
        this.sidenav.close();
    }
}
