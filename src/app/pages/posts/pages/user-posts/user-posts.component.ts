import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, takeUntil } from 'rxjs';

import { Pageable } from 'src/app/shared/models/pageable.model';
import { PostFilters, IURLPostsQueryParams } from 'src/app/pages/posts/models/post-filter.model';
import { IAcademicLevel, ISubjectWithAxis, PostDetail } from 'src/app/pages/posts/models/post.model';
import { OrderingType } from 'src/app/pages/posts/constants/posts.enum';
import { UserDetail } from 'src/app/pages/user/models/user.model';
import { PostsStats } from '../../types/posts-stats.type';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/pages/posts/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-user-posts',
    templateUrl: './user-posts.component.html',
    styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent extends Unsubscriber implements OnInit  {
    public urlQueryParams?: IURLPostsQueryParams;
    public pageResults?: Pageable<PostDetail>;
    public loading = true;
    public authUser: UserDetail | null;
    public academicLevels$: Observable<IAcademicLevel[]> = of();
    public subjectWithAxes$: Observable<ISubjectWithAxis[]> = of();
    public currentFilters?: PostFilters;
    public removeFilter?: { value: string };
    public changePage?: { value: number };

    public ownerId?: number;
    public showOwnPosts = false;
    public stats: PostsStats = {
        likes: {
            text: 'Me gusta',
            icon: 'favorite_outline',
            color: 'red'
        },
        views: {
            text: 'Visualizaciones',
            icon: 'visibility',
            color: 'blue'
        },
        posts: {
            text: 'Publicaciones',
            icon: 'description',
            color: 'green'
        }
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
        this.urlQueryParams = this.activatedRoute.snapshot.queryParams;
        this.authUser = this.authService.getUserDetail();

        const userId = this.route.snapshot.paramMap.get('id');
        this.ownerId = userId ? Number(userId) : undefined;
        this.showOwnPosts = !!this.authUser && this.ownerId === this.authUser?.id;

        if (this.showOwnPosts) {
            this.setStatsValues(this.authUser);  // Temporal info
        }

    }

    public ngOnInit(): void {
        if (!!this.ownerId) {
            this.academicLevels$ = this.postsService.getAcademicLevels();
            this.subjectWithAxes$ = this.postsService.getSubjectWithAxis();
        }

        if (this.showOwnPosts) {
            this.authService.refreshUserDetail().pipe(
                takeUntil(this.ngUnsubscribe$)
            ).subscribe(userDetail => {
                if (!!userDetail) {
                    this.authUser = new UserDetail(userDetail);
                    this.setStatsValues(this.authUser); // Updated info
                }
            });
        }
    }

    public setStatsValues(user: UserDetail | null): void {
        if (!user) {
            return;
        }

        this.stats.likes.value = this.authUser?.totalLikes ?? 0;
        this.stats.views.value = this.authUser?.totalViews ?? 0;
        this.stats.posts.value = this.authUser?.totalPosts ?? 0;
    }

    public getPosts(postFilters: PostFilters): void {
        postFilters.userId = this.ownerId;
        this.currentFilters = postFilters;
        this.loading = true;
        this.urlQueryParams = postFilters.formatForURL();
        console.log('Filters: ', this.urlQueryParams);
        this.setQueryParams(this.urlQueryParams);

        this.postsService.getPosts(postFilters.formatForAPI()).pipe(
            catchError(() => {
                this.loading = false;
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
            console.log('Results: ', this.pageResults);
            this.loading = false;
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
