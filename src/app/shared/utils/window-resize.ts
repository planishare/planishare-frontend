/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnDestroy } from '@angular/core';
import { fromEvent, Subscription, tap, throttleTime } from 'rxjs';

@Component({
    selector: 'app-window-resize-listener',
    template: ''
})
export class WindowResizeListener implements OnDestroy {
    public isMobile = window.innerWidth < 768;
    private sub: Subscription;

    constructor() {
        this.sub = fromEvent(window, 'resize')
            .pipe(
                throttleTime(500),
                tap(() => console.log('kie'))
            )
            .subscribe(() => this.isMobile = window.innerWidth < 768);
    }

    public ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
