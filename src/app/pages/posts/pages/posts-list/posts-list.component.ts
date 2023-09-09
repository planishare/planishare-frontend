import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, forkJoin, map, takeUntil, BehaviorSubject, Observable } from 'rxjs';

import { Pageable } from 'src/app/shared/models/pageable.model';
import { APIPostsParams, URLPostsParams, MapPostFilters, PostFilterName, PostFilters, PostOrderingName, PostOrderingType } from 'src/app/pages/posts/models/post-filter.model';
import { IAcademicLevel, ISubjectWithAxis, PostDetail } from 'src/app/pages/posts/models/post.model';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/pages/posts/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { Filter, FilterChange, FilterOption } from 'src/app/shared/models/filter.model';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends Unsubscriber implements OnInit {
    public filtersLoading = true;

    public filters: PostFilters = {
        page: 1,
        search: undefined,
        userId: undefined,
        academicLevel: {
            name: PostFilterName.ACADEMIC_LEVEL,
            options: [],
            currentOption: undefined
        },
        subject: {
            name: PostFilterName.SUBJECT,
            options: [],
            currentOption: undefined
        },
        axis: {
            name: PostFilterName.AXIS,
            options: [],
            currentOption: undefined
        },
        ordering: {
            name: PostFilterName.ORDERING,
            options: [
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
            ],
            currentOption: undefined
        }
    };
    public filters$: BehaviorSubject<PostFilters> = new BehaviorSubject<PostFilters>(this.filters);

    public loading = true;
    public posts?: Pageable<PostDetail>;

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router
    ) {
        super();
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
                this.filtersLoading = false;
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            })
        ).subscribe(([academicLevels, subjectWithAxis]) => {
            // Set filters options and text of current values
            academicLevels.forEach(lvl => {
                this.filters.academicLevel.options.push({ text: lvl.name, value: lvl.id });
                if (lvl.id === this.filters.academicLevel.currentOption?.value) {
                    this.filters.academicLevel.currentOption.text = lvl.name;
                }
            });

            subjectWithAxis.forEach(sub => {
                this.filters.subject.options.push({ text: sub.name, value: sub.id });
                if (sub.id === this.filters.subject.currentOption?.value) {
                    this.filters.subject.currentOption.text = sub.name;
                }

                sub.axis.forEach(ax => {
                    this.filters.axis.options.push({ text: ax.name, value: ax.id });
                    if (ax.id === this.filters.axis.currentOption?.value) {
                        this.filters.axis.currentOption.text = ax.name;
                    }
                });
            });
            this.filtersLoading = false;
            this.filters$.next(this.filters);
            console.log(this.filters);
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
            this.filters.academicLevel.currentOption = { text: 'Loading', value: Number(params.academicLevel) };
        }
        if (params.subject) {
            this.filters.subject.currentOption = { text: 'Loading', value: Number(params.subject) };
        }
        if (params.axis) {
            this.filters.axis.currentOption = { text: 'Loading', value: Number(params.axis) };
        }
        if (params.ordering) {
            this.filters.ordering.currentOption = { text: PostOrderingName[params.ordering], value: params.ordering };
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
        this.filters$.next({ ...this.filters }); // Use spread operator to force update
        this.getPosts(MapPostFilters.toAPIParams(this.filters));
        this.setQueryParams(MapPostFilters.toURLQueryParams(this.filters));
    }

    public changeFilter(filterChange: FilterChange<any>) {
        console.log({ filterChange });
        this.filters.page = 1;
        const option = filterChange.option;
        const remove = filterChange.remove;
        switch (filterChange.name) {
            case PostFilterName.ACADEMIC_LEVEL:
                this.filters.academicLevel.currentOption = remove ? undefined : { text: option.text, value: Number(option.value) };
                break;
            case PostFilterName.SUBJECT:
                this.filters.subject.currentOption = remove ? undefined : { text: option.text, value: Number(option.value) };
                break;
            case PostFilterName.AXIS:
                this.filters.axis.currentOption = remove ? undefined : { text: option.text, value: Number(option.value) };
                break;
            case PostFilterName.ORDERING:
                this.filters.ordering.currentOption = remove ? undefined : { text: option.text, value: String(option.value) };
                break;
        }
        this.filters$.next({ ...this.filters }); // Use spread operator to force update
        this.getPosts(MapPostFilters.toAPIParams(this.filters));
        this.setQueryParams(MapPostFilters.toURLQueryParams(this.filters));
    }
}
