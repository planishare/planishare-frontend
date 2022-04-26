import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidenavComponent } from '../enums/sidenav.enum';

@Injectable({
    providedIn: 'root'
})
export class SidenavService {
    public opened: BehaviorSubject<SidenavComponent|null> = new BehaviorSubject<SidenavComponent|null>(null);

    constructor() { }

    public open(componentName: SidenavComponent): void {
        this.opened.next(componentName);
    }

    public close(): void {
        this.opened.next(null);
    }
}
