import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from 'src/app/shared/enums/sidenav.enum';
import { SidenavService } from 'src/app/core/services/sidenav.service';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
    public sidenavComponent = SidenavComponent;
    public isOpened = false;
    public component: SidenavComponent | null = null;

    constructor(
        private sidenav: SidenavService
    ) {
        this.sidenav.opened.asObservable()
            .subscribe(value => {
                this.isOpened = !!value;
                this.component = value;
            });
    }

}
