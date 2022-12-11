import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, throttleTime } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowScrollService {
    public delay = 250;

    public scrollYPos$ = new BehaviorSubject(window.scrollY || window.pageYOffset);

    constructor() {}

    // TODO: Fix this to not emit changes to all app
    public startListening(): void {
        // fromEvent(window, 'scroll').pipe(
        //     throttleTime(this.delay),
        //     debounceTime(this.delay)
        // ).subscribe(() => {
        //     const scrollY = window.scrollY || window.pageYOffset;
        //     this.scrollYPos$.next(scrollY);
        // });
    }
}
