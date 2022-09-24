/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    template: ''
})
export abstract class Unsubscriber implements OnDestroy {

    public ngUnsubscribe$: Subject<void> = new Subject<void>();

    public ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
