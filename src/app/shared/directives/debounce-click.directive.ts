// Directive similar to: https://coryrylan.com/blog/creating-a-custom-debounce-click-directive-in-angular
// By: Cory Rylan

import {
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input() public debounceTime = 500;
    @Output() public debounceClick = new EventEmitter();
    private clicks = new Subject();
    private subscription?: Subscription;

    constructor() {}

    public ngOnInit() {
        this.subscription = this.clicks
            .pipe(
                throttleTime(this.debounceTime)
                // debounceTime(this.debounceTime)
            )
            .subscribe(e => this.debounceClick.emit(e));
    }

    public ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    @HostListener('click', ['$event'])
    public clickEvent(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
