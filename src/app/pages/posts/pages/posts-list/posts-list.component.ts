import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, forkJoin, map, takeUntil, BehaviorSubject } from 'rxjs';

import { Pageable } from 'src/app/shared/models/pageable.model';
import { APIPostsParams, URLPostsParams, MapPostFilters, PostFilters, PostOrderingName, PostOrderingType, PostFiltersOptions } from 'src/app/pages/posts/models/post-filter.model';
import { PostDetail } from 'src/app/pages/posts/models/post.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/pages/posts/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { FilterOption } from 'src/app/shared/models/filter.model';
import { UserDetail } from 'src/app/pages/user/models/user.model';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends Unsubscriber implements OnInit {
    public filters: PostFilters = { page: 1 };
    public filters$: BehaviorSubject<PostFilters> = new BehaviorSubject<PostFilters>(this.filters);
    public loading = true;
    public posts?: Pageable<PostDetail>;
    public authUser?: UserDetail;
    public options: PostFiltersOptions = {
        academicLevel: [],
        subject: [],
        axis: [],
        ordering: [
            {
                text: PostOrderingName[PostOrderingType.MOST_RECENT],
                value: PostOrderingType.MOST_RECENT
            },
            {
                text: PostOrderingName[PostOrderingType.LESS_RECENT],
                value: PostOrderingType.LESS_RECENT
            },
            {
                text: PostOrderingName[PostOrderingType.MOST_LIKED],
                value: PostOrderingType.MOST_LIKED
            },
            {
                text: PostOrderingName[PostOrderingType.MOST_VIEWED],
                value: PostOrderingType.MOST_VIEWED
            }
        ]
    };

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router
    ) {
        super();
        this.authUser = this.authService.getUserDetail() ?? undefined;
    }

    public ngOnInit(): void {
        this.setFiltersByUrlParams();
        this.getPosts(MapPostFilters.toAPIParams(this.filters));

        forkJoin([
            this.postsService.getAcademicLevels(),
            this.postsService.getSubjectWithAxis()
        ]).pipe(
            takeUntil(this.ngUnsubscribe$),
            catchError(() => {
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            })
        ).subscribe(([academicLevels, subjectWithAxis]) => {
            // Set filters options and text of current values
            academicLevels.forEach(lvl => {
                this.options.academicLevel.push({ text: lvl.name, value: lvl.id });
                if (lvl.id === this.filters.academicLevel?.value) {
                    this.filters.academicLevel.text = lvl.name;
                }
            });

            subjectWithAxis.forEach(sub => {
                this.options.subject.push({ text: sub.name, value: sub.id });
                if (sub.id === this.filters.subject?.value) {
                    this.filters.subject.text = sub.name;
                }

                const options: FilterOption<number>[] = [];
                sub.axis.forEach(ax => {
                    options.push({
                        text: ax.name,
                        value: ax.id
                    });
                    if (ax.id === this.filters.axis?.value) {
                        this.filters.axis.text = ax.name;
                    }
                });
                this.options.axis.push({
                    text: sub.name,
                    options
                });
            });
            console.log(this.filters);
            this.options = { ...this.options }; // Force template inputs update
            this.filters = { ...this.filters }; // Force template inputs update
        });
    }

    public getPosts(apiFilters: APIPostsParams) {
        this.loading = true;
        this.postsService.getPosts(apiFilters).pipe(
            map(posts => {
                return new Pageable<PostDetail>({
                    count: posts.count,
                    next: posts.next,
                    previous: posts.previous,
                    results: posts.results.map(post => new PostDetail(post))
                });
            }),
            takeUntil(this.ngUnsubscribe$),
            catchError(() => {
                this.loading = false;
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            })
        ).subscribe(posts => {
            this.loading = false;
            this.posts = posts;
        });
    }

    private setFiltersByUrlParams(): void {
        // Example query: ?page=1&search=radio&academicLevel=6&subject=8&axis=38&ordering=created_at
        const params: URLPostsParams = this.activatedRoute.snapshot.queryParams;
        if (params.page) {
            this.filters.page = Number(params.page);
        }
        if (params.search) {
            this.filters.search = params.search;
        }
        if (params.userId) {
            this.filters.userId = Number(params.userId);
        }
        if (params.academicLevel) {
            this.filters.academicLevel = { text: 'Loading', value: Number(params.academicLevel) };
        }
        if (params.subject) {
            this.filters.subject = { text: 'Loading', value: Number(params.subject) };
        }
        if (params.axis) {
            this.filters.axis = { text: 'Loading', value: Number(params.axis) };
        }
        if (params.ordering) {
            this.filters.ordering = { text: PostOrderingName[params.ordering], value: params.ordering };
        }
    }

    private setQueryParams(queryParams: URLPostsParams): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams
        });
    }

    public changePage(page: number) {
        this.filters!.page = page;
        this.filters = { ...this.filters }; // Force template inputs update
        this.getPosts(MapPostFilters.toAPIParams(this.filters));
        this.setQueryParams(MapPostFilters.toURLQueryParams(this.filters));
    }

    public changeFilters(filters: PostFilters) {
        this.filters = filters;
        this.getPosts(MapPostFilters.toAPIParams(this.filters));
        this.setQueryParams(MapPostFilters.toURLQueryParams(this.filters));
    }
}
