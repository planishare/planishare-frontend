import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, forkJoin, map, tap, takeUntil } from 'rxjs';

import { IPageable, Pageable } from 'src/app/shared/models/pageable.model';
import { IURLPostsParams, PostFilterStatus } from 'src/app/pages/posts/models/post-filter.model';
import { PostDetail } from 'src/app/pages/posts/models/post.model';
import { PostOrderingType, PostOrderingName, PostFilterName } from 'src/app/pages/posts/models/posts-filter.enum';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/pages/posts/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { IFilter, IFilterGroupOption, IFilterOption } from 'src/app/shared/models/filter.model';

@Component({
    selector: 'app-posts-list',
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent extends Unsubscriber implements OnInit {
    public filtersOptions: IFilter<string|number>[] = [];
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

    public ngOnInit(): void {
        // ?page=1&search=radio&academicLevel=6&subject=8&axis=38&ordering=created_at
        const queryParams: IURLPostsParams = this.activatedRoute.snapshot.queryParams;
        forkJoin([
            this.postsService.getAcademicLevels(),
            this.postsService.getSubjectWithAxis()
        ]).subscribe(([academicLevels, subjectWithAxis]) => {
            // Get query params
            const urlQueryParams: IURLPostsParams = this.activatedRoute.snapshot.queryParams;
            this.filtersStatus = new PostFilterStatus({
                page: queryParams.page ? Number(queryParams.page) : 1,
                search: queryParams.search ?? undefined,
                userId: queryParams.userId ? Number(queryParams.userId) : undefined
            });

            // Map academic levels
            const academicLevelOptions: IFilterOption<number>[] = academicLevels.map(el => {
                if (Number(urlQueryParams.academicLevel) === el.id) {
                    this.filtersStatus!.academicLevel = { text: el.name, value: el.id };
                }
                return { text: el.name, value: el.id };
            });

            // Map subjects
            const subjectOptions: IFilterOption<number>[] = subjectWithAxis.map(el => {
                if (Number(urlQueryParams.subject) === el.id) {
                    this.filtersStatus!.subject = { text: el.name, value: el.id };
                }
                return { text: el.name, value: el.id };
            });

            // Map axis
            const axisOptions: IFilterGroupOption<number>[] = subjectWithAxis.map(subject => {
                return {
                    text: subject.name,
                    groupOptions: subject.axis.map(el => {
                        if (Number(urlQueryParams.axis) === el.id) {
                            this.filtersStatus!.axis = { text: el.name, value: el.id };
                        }
                        return { text: el.name, value: el.id };
                    })
                };
            });

            // Map ordering
            const orderingOptions: IFilterOption<PostOrderingType>[] = [
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
            ];
            if (queryParams.ordering) {
                this.filtersStatus.ordering = {
                    text: PostOrderingName[queryParams.ordering],
                    value: queryParams.ordering
                };
            }

            // Set filters options
            this.filtersOptions.push({
                text: PostFilterName.ACADEMIC_LEVEL,
                id: PostFilterName.ACADEMIC_LEVEL,
                options: academicLevelOptions
            });
            this.filtersOptions.push({
                text: PostFilterName.SUBJECT,
                id: PostFilterName.SUBJECT,
                options: subjectOptions
            });
            this.filtersOptions.push({
                text: PostFilterName.AXIS,
                id: PostFilterName.AXIS,
                options: axisOptions
            });
            this.filtersOptions.push({
                text: PostFilterName.ORDERING,
                id: PostFilterName.ORDERING,
                options: orderingOptions
            });
            this.getPosts(this.filtersStatus!);
        });
    }

    public getPosts(filters: PostFilterStatus) {
        this.loading = true;
        this.setQueryParams(filters.toURLQueryParams());

        const apiQueryParams = filters.toAPIParams();
        this.postsService.getPosts(apiQueryParams).pipe(
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
        this.getPosts(this.filtersStatus!);
    }
}
