import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, catchError, of } from 'rxjs';
import { OrderingType } from 'src/app/core/enums/posts.enum';
import { Pageable } from 'src/app/core/models/pageable.model';
import { IAPIPostsQueryParams, IURLPostsQueryParams, PostFilters } from 'src/app/core/models/post-filter.model';
import { PostDetail } from 'src/app/core/models/post.model';
import { UserDetail } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

type Stat = { text: string, value?: number, icon?: string, color?: string };

@Component({
    selector: 'app-user-posts',
    templateUrl: './user-posts.component.html',
    styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent extends Unsubscriber implements OnInit  {
    public urlQueryParams: IURLPostsQueryParams = {};
    public pageResults?: Pageable<PostDetail>;
    public isLoading = true;
    public authUser: UserDetail | null;

    public ownerId?: number;
    public showOwnPosts = false;

    public stats: Stat[] = [];
    public likes: Stat = {
        text: 'Me gusta',
        icon: 'favorite_outline',
        color: 'red'
    };
    public views: Stat = {
        text: 'Visualizaciones',
        icon: 'visibility',
        color: 'blue'
    };
    public posts: Stat = {
        text: 'Publicaciones',
        icon: 'description',
        color: 'green'
    };

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private postsService: PostsService,
        private router: Router
    ) {
        super();
        const userId = this.route.snapshot.paramMap.get('id');
        this.ownerId = userId ? Number(userId) : undefined;
        this.authUser = this.authService.getUserDetail();
        this.showOwnPosts = !!this.authUser && this.ownerId === this.authUser?.id;

        if (this.showOwnPosts) {
            this.setStatsValues(this.authUser);  // Temporal info
        }

    }

    public ngOnInit(): void {
        if (this.showOwnPosts) {
            this.authService.refreshUserDetail().pipe(
                takeUntil(this.ngUnsubscribe$)
            ).subscribe(userDetail => {
                if (!!userDetail) {
                    this.authUser = new UserDetail(userDetail);
                    this.setStatsValues(this.authUser);
                }
            });
        }

        this.urlQueryParams = this.activatedRoute.snapshot.queryParams;

    }

    public setStatsValues(user: UserDetail | null): void {
        if (!user) {
            return;
        }

        this.stats = [];
        this.likes.value = this.authUser?.totalLikes ?? 0;
        this.views.value = this.authUser?.totalViews ?? 0;
        this.posts.value = this.authUser?.totalPosts ?? 0;
        this.stats.push(this.likes, this.views);
    }

    public getPosts(postFilters: PostFilters): void {
        this.isLoading = true;
        postFilters.userId = this.ownerId;
        this.urlQueryParams = postFilters.formatForURL();
        this.setQueryParams(this.urlQueryParams);

        this.postsService.getPosts(postFilters.formatForAPI()).pipe(
            catchError(() => {
                this.isLoading = false;
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(resp => {
            const posts: PostDetail[] = resp!.results.map(post => new PostDetail(post));
            this.pageResults = new Pageable<PostDetail>({
                ...resp,
                results: posts
            });
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
