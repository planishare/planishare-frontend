import { Component } from '@angular/core';
import { fadeInOutAnimation } from '../../animations/animations';
import { WindowScrollService } from '../../services/window-scroll.service';

@Component({
    selector: 'app-scroll-to-top-button',
    templateUrl: './scroll-to-top-button.component.html',
    styleUrls: ['./scroll-to-top-button.component.scss'],
    animations: [fadeInOutAnimation]
})
export class ScrollToTopButtonComponent {
    public heightToShow = 300;

    constructor(
        public windowScroll: WindowScrollService
    ) { }

    public scrollToTop(): void {
        return window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }
}
