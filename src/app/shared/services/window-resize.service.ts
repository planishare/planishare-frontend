import { Injectable } from '@angular/core';
import { debounceTime, fromEvent, map, startWith, Observable, throttleTime } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WindowResizeService {
    // TODO: update performance https://www.cocomore.com/blog/dont-use-window-onresize

    // Config
    private delay = 100;

    constructor() {}

    // Observables
    public isMobile$: Observable<boolean> = fromEvent(window, 'resize').pipe(
        throttleTime(this.delay),
        debounceTime(this.delay),
        startWith(null),
        map(() => {
            return window.innerWidth < 768; // 48rem
        })
    );

    public isDesktop$: Observable<boolean> = fromEvent(window, 'resize').pipe(
        throttleTime(this.delay),
        debounceTime(this.delay),
        startWith(null),
        map(() => {
            console.log(window.innerWidth);
            return window.innerWidth >= 1024; // 64rem
        })
    );
}
