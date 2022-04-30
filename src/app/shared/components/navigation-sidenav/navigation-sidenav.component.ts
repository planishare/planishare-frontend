import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SidenavService } from 'src/app/core/services/sidenav.service';

@Component({
    selector: 'app-navigation-sidenav',
    templateUrl: './navigation-sidenav.component.html',
    styleUrls: ['./navigation-sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavigationSidenavComponent {

    constructor(
        private sidenav: SidenavService
    ) { }

    public hideSidenav(): void {
        this.sidenav.close();
    }
}
