import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostDetail } from '../../models/post.model';
import { IPageable } from 'src/app/shared/models/pageable.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserDetail } from 'src/app/pages/user/models/user.model';

@Component({
    selector: 'app-posts-grid',
    templateUrl: './posts-grid.component.html',
    styleUrls: ['./posts-grid.component.scss']
})
export class PostsGridComponent {
    @Input() public loading: boolean = true;
    @Input() public posts?: IPageable<PostDetail>;
    @Input() public authUser?: UserDetail;

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
