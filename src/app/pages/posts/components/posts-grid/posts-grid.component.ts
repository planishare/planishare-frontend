import { Component, Input, OnInit } from '@angular/core';
import { PostDetail } from '../../models/post.model';
import { IPageable } from 'src/app/shared/models/pageable.model';

@Component({
    selector: 'app-posts-grid',
    templateUrl: './posts-grid.component.html',
    styleUrls: ['./posts-grid.component.scss']
})
export class PostsGridComponent {
    @Input() public loading: boolean = true;
    @Input() public posts?: IPageable<PostDetail>;

    constructor() { }
}
