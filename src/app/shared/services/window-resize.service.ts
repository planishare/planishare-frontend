import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowResizeService {
    private desktopMql: MediaQueryList = window.matchMedia('(min-width: 1024px)'); // 64rem
    private mobileMql: MediaQueryList = window.matchMedia('(min-width: 768px)'); // 48rem (NEGATION)

    public desktop$: BehaviorSubject<boolean> = new BehaviorSubject(this.desktopMql.matches);
    public mobile$: BehaviorSubject<boolean> = new BehaviorSubject(!this.mobileMql.matches);

    constructor() {}

    // Call this only one time in app.component.ts
    public startListening(): void {
        this.desktopMql.addEventListener('change', (event: MediaQueryListEvent) => {
            this.desktop$.next(event.matches);
        });
        this.mobileMql.addEventListener('change', (event: MediaQueryListEvent) => {
            this.mobile$.next(!event.matches);
        });
    }
}
