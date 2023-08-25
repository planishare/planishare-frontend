import { Component } from '@angular/core';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends Unsubscriber {
    public desktop = this.windowResize.isDesktop$.pipe(takeUntil(this.ngUnsubscribe$));
    public mobile = this.windowResize.isMobile$.pipe(takeUntil(this.ngUnsubscribe$));

    public navOpen = false;

    constructor(
        private windowResize: WindowResizeService
    ) {
        super();
    }
}
