import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from 'src/app/core/enums/sidenav.enum';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { isMobile } from '../../utils';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
    public isMobile = isMobile;

    constructor(
        private sidenav: SidenavService
    ) { }

    public openSidenav(): void {
        this.sidenav.open(SidenavComponent.NAVIGATION_SIDENAV);
    }
}
