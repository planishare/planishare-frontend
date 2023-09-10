import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PostDetail } from 'src/app/pages/posts/models/post.model';

// TODO
// [ ] Save query params when view post detail

@Component({
    selector: 'app-post-card',
    templateUrl: './post-card.component.html',
    styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
    @Input() public post?: PostDetail;
    @Input() public ownPost = false;
    @Input() public loading = true;

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
