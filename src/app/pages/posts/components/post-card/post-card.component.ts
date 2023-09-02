import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IURLPostsParams } from 'src/app/pages/posts/models/post-filter.model';
import { PostDetail } from 'src/app/pages/posts/models/post.model';

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
    @Input() public post?: PostDetail;
    @Input() public isOwner = false;
    @Input() public urlQueryParams: IURLPostsParams = {};
    @Output() public report = new EventEmitter<PostDetail>();
    @Output() public delete = new EventEmitter<PostDetail>();

    constructor() {}

    public reportPost(post: PostDetail) {
        this.report.next(post);
    }

    public deletePost(post: PostDetail) {
        this.delete.next(post);
    }
}
