import { Component, OnInit } from '@angular/core';
import { isMobile } from 'src/app/shared/utils';

@Component({
    selector: 'app-results-shimmer',
    templateUrl: './results-shimmer.component.html',
    styleUrls: ['./results-shimmer.component.scss']
})
export class ResultsShimmerComponent {
    public isMobile = isMobile;

    constructor() { }

}
