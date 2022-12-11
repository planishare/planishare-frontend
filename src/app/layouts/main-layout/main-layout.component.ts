import { Component } from '@angular/core';
import { SidenavComponent } from 'src/app/shared/enums/sidenav.enum';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { takeUntil } from 'rxjs';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent extends Unsubscriber {
    public sidenavComponent = SidenavComponent;
    public isOpened = false;
    public component: SidenavComponent | null = null;

    constructor(
        private sidenav: SidenavService
    ) {
        super();
        this.sidenav.opened.asObservable()
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(value => {
                this.isOpened = !!value;
                this.component = value;
            });
    }
}
