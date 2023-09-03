import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, forkJoin, map, takeUntil } from 'rxjs';

import { Pageable } from 'src/app/shared/models/pageable.model';
import { IAPIPostsParams, IURLPostsParams, PostFilterStatus } from 'src/app/pages/posts/models/post-filter.model';
import { PostDetail } from 'src/app/pages/posts/models/post.model';
import { PostOrderingType, PostOrderingName, PostFilterName } from 'src/app/pages/posts/models/posts-filter.enum';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/pages/posts/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { IFilter, IFilterOption } from 'src/app/shared/models/filter.model';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends Unsubscriber implements OnInit {
    public filtersOptions: IFilter<string|number>[] = [];
    public filtersLoading = true;
    public filtersStatus?: PostFilterStatus;

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

    private getFiltersByUrlParams(): PostFilterStatus {
        // Example query: ?page=1&search=radio&academicLevel=6&subject=8&axis=38&ordering=created_at
        const params: IURLPostsParams = this.activatedRoute.snapshot.queryParams;
        return new PostFilterStatus({
            page: params.page ? Number(params.page) : 1,
            search: params.search ?? undefined,
            userId: params.userId ? Number(params.userId) : undefined,
            academicLevel: params.academicLevel ? { value: Number(params.academicLevel) } : undefined,
            subject: params.subject ? { value: Number(params.subject) } : undefined,
            axis: params.axis ? { value: Number(params.axis) } : undefined,
            ordering: params.ordering ? { value: params.ordering } : undefined
        });
    }

    public ngOnInit(): void {
        this.filtersStatus = this.getFiltersByUrlParams();
        console.log({ filtersStatus: this.filtersStatus });
        this.getPosts(this.filtersStatus!.toAPIParams());

        // Set filters options and current filters text
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
            this.filtersLoading = false;
            // Map academic levels
            const academicLevelOptions: IFilterOption<number>[] = academicLevels.map(el => {
                if (this.filtersStatus?.academicLevel?.value === el.id) {
                    this.filtersStatus.academicLevel.text = el.name;
                }
                return { text: el.name, value: el.id, optionOf: PostFilterName.ACADEMIC_LEVEL };
            });
            this.filtersOptions.push({
                title: PostFilterName.ACADEMIC_LEVEL,
                options: academicLevelOptions
            });

            // Map subjects
            const subjectOptions: IFilterOption<number>[] = subjectWithAxis.map(el => {
                if (this.filtersStatus?.subject?.value === el.id) {
                    this.filtersStatus.subject.text = el.name;
                }
                return { text: el.name, value: el.id, optionOf: PostFilterName.SUBJECT };
            });
            this.filtersOptions.push({
                title: PostFilterName.SUBJECT,
                options: subjectOptions
            });

            // Map axis
            const axisOptions: IFilterOption<number>[] = subjectWithAxis.map(subject => {
                return {
                    text: subject.name,
                    value: subject.id,
                    optionOf: PostFilterName.SUBJECT,
                    options: subject.axis.map(el => {
                        if (this.filtersStatus?.axis?.value === el.id) {
                            this.filtersStatus.axis.text = el.name;
                        }
                        return { text: el.name, value: el.id, optionOf: PostFilterName.AXIS };
                    })
                };
            });
            this.filtersOptions.push({
                title: PostFilterName.AXIS,
                options: axisOptions
            });

            // Map ordering
            const orderingOptions: IFilterOption<PostOrderingType>[] = [
                {
                    text: PostOrderingName[PostOrderingType.MOST_RECENT],
                    value: PostOrderingType.MOST_RECENT,
                    optionOf: PostFilterName.ORDERING
                },
                {
                    text: PostOrderingName[PostOrderingType.LESS_RECENT],
                    value: PostOrderingType.LESS_RECENT,
                    optionOf: PostFilterName.ORDERING
                },
                {
                    text: PostOrderingName[PostOrderingType.MOST_LIKED],
                    value: PostOrderingType.MOST_LIKED,
                    optionOf: PostFilterName.ORDERING
                },
                {
                    text: PostOrderingName[PostOrderingType.MOST_VIEWED],
                    value: PostOrderingType.MOST_VIEWED,
                    optionOf: PostFilterName.ORDERING
                }
            ];
            if (this.filtersStatus?.ordering?.value) {
                const type = this.filtersStatus.ordering.value;
                this.filtersStatus.ordering.text = PostOrderingName[type as PostOrderingType];
            }
            this.filtersOptions.push({
                title: PostFilterName.ORDERING,
                options: orderingOptions
            });

            console.log({ filtersOptions: this.filtersOptions });
        });
    }

    public getPosts(apiFilters: IAPIPostsParams) {
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
            console.log('getPosts', posts);
            this.loading = false;
            this.posts = posts;
        });
    }

    private setQueryParams(queryParams: IURLPostsParams): void {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams
        });
    }

    public changePage(page: number) {
        this.filtersStatus!.page = page;
        this.getPosts(this.filtersStatus!.toAPIParams());
        this.setQueryParams(this.filtersStatus!.toURLQueryParams());
    }
}
