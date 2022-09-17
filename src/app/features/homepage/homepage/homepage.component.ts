import { Component, OnDestroy } from '@angular/core';
import { isMobile } from 'src/app/shared/utils/window-width';
import { NavbarService } from 'src/app/shared/services/navbar.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnDestroy {
    public isMobile = isMobile;

    constructor(
        private navbarService: NavbarService
    ) {
        this.navbarService.setButtonConfig({
            backgroundColor: 'var(--pink-light)'
        });
    }

    public ngOnDestroy(): void {
        this.navbarService.resetConfig();
    }
}
