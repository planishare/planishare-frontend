import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, takeUntil } from 'rxjs';

import { Pageable } from 'src/app/core/models/pageable.model';
import { PostFilters, IURLPostsQueryParams } from 'src/app/core/models/post-filter.model';
import { PostDetail } from 'src/app/core/models/post.model';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { UserDetail } from 'src/app/core/models/user.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends Unsubscriber implements OnInit {
    public urlQueryParams?: IURLPostsQueryParams;
    public pageInfo?: Pageable<PostDetail>;

    public isLoading = true;
    public hasData = true;

    public authUser: UserDetail | null;

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router
    ) {
        super();
        this.authUser = this.authService.getUserDetail();
    }

    public ngOnInit(): void {
        this.urlQueryParams = this.activatedRoute.snapshot.queryParams;
    }

    public getPosts(postFilters: PostFilters): void {
        console.log('getPosts', postFilters);
        this.isLoading = true;
        this.setQueryParams(postFilters.formatForURL());

        this.postsService.getPosts(postFilters.formatForAPI()).pipe(
            catchError(() => {
                this.isLoading = false;
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(resp => {
            const posts: PostDetail[] = resp!.results.map(post => new PostDetail(post));
            this.pageInfo = new Pageable<PostDetail>({
                ...resp,
                results: posts
            });
            this.hasData = !!this.pageInfo.results.length;
            this.isLoading = false;
        });
    }

    private setQueryParams(urlQueryParams: IURLPostsQueryParams): void {
        urlQueryParams.ordering =
            urlQueryParams.ordering !== OrderingType.MOST_RECENT ? urlQueryParams.ordering : undefined;
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: urlQueryParams
        });
    }
}
