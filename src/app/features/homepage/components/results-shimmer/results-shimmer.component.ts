import { Component } from '@angular/core';
import { isMobile } from 'src/app/shared/utils/window-width';

@Component({
    selector: 'app-results-shimmer',
    templateUrl: './results-shimmer.component.html',
    styleUrls: ['./results-shimmer.component.scss']
})
export class ResultsShimmerComponent {
    public isMobile = isMobile;

    constructor() { }

}
