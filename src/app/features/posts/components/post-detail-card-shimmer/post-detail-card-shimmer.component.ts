import { Component } from '@angular/core';
import { isMobile } from 'src/app/shared/utils/window-width';

@Component({
    selector: 'app-post-detail-card-shimmer',
    templateUrl: './post-detail-card-shimmer.component.html',
    styleUrls: ['./post-detail-card-shimmer.component.scss']
})
export class PostDetailCardShimmerComponent {
    public isMobile = isMobile;

    constructor() { }
}
