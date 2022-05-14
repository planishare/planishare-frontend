/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// Based on
// http://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription?answertab=active#tab-top
@Component({
    selector: 'app-unsubscriber',
    template: ''
})
export class Unsubscriber implements OnDestroy {

    public ngUnsubscribe$: Subject<void> = new Subject<void>();

    public ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
