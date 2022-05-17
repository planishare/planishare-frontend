import { Component, OnInit } from '@angular/core';
import { isMobile } from 'src/app/shared/utils';

@Component({
    selector: 'app-post-detail-card-shimmer',
    templateUrl: './post-detail-card-shimmer.component.html',
    styleUrls: ['./post-detail-card-shimmer.component.scss']
})
export class PostDetailCardShimmerComponent implements OnInit {
    public isMobile = isMobile;

    constructor() { }

    ngOnInit(): void {
    }

}
