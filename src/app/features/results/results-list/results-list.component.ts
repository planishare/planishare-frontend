import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, filter, forkJoin, map, merge, Observable, of, takeUntil, tap } from 'rxjs';

import { Pageable } from 'src/app/core/models/pageable.model';
import { IOrdering, PostFilters, PostsQueryParams } from 'src/app/core/models/post-filter.model';
import { IAcademicLevel, IAxis, IPostDetail, ISubject, PostDetail } from 'src/app/core/models/post.model';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { ReportType } from 'src/app/shared/enums/report.enum';
import { ReportForm } from 'src/app/core/types/report.type';
import { UserDetail } from 'src/app/core/types/users.type';
import { RoundedSelectOption, RoundedSelectGroup } from 'src/app/shared/types/rounded-select.type';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { ReportDialogComponent } from 'src/app/shared/components/report-dialog/report-dialog.component';
import { DeleteDialogComponent } from 'src/app/features/posts/components/delete-dialog/delete-dialog.component';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';

@Component({
    selector: 'app-results-list',
    templateUrl: './results-list.component.html',
    styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent extends Unsubscriber implements OnInit {
    public isLoading = true;
    public hasData = true;
    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isAxesLoading = true;
    public hasFilters = false;

    public pageInfo?: Pageable<IPostDetail>;

    public postFilters = new PostFilters({
        page: 1,
        ordering: {
            id: OrderingType.MOST_RECENT,
            name: OrderingTypeName.MOST_RECENT
        }
    });

    public user: UserDetail | null;
    public posts: PostDetail[] = [];

    public form: FormGroup;
    public searchControl: FormControl;
    public academicLevelControl: FormControl;
    public subjectControl: FormControl;
    public axisControl: FormControl;
    public orderingControl: FormControl;

    public academicLevelsList: RoundedSelectOption<IAcademicLevel>[] = [];
    public subjectWithAxis: RoundedSelectGroup<IAxis>[] = [];
    public axisList: RoundedSelectOption<IAxis>[] = [];
    public subjectList: RoundedSelectOption<ISubject>[] = [];
    public orderingList: RoundedSelectOption<IOrdering>[] = [
        {
            data: {
                id: OrderingType.MOST_RECENT,
                name: OrderingTypeName.MOST_RECENT
            },
            text: OrderingTypeName.MOST_RECENT
        },
        {
            data: {
                id: OrderingType.LESS_RECENT,
                name: OrderingTypeName.LESS_RECENT
            },
            text: OrderingTypeName.LESS_RECENT
        },
        {
            data: {
                id: OrderingType.MOST_LIKED,
                name: OrderingTypeName.MOST_LIKED
            },
            text: OrderingTypeName.MOST_LIKED
        },
        {
            data: {
                id: OrderingType.MOST_VIEWED,
                name: OrderingTypeName.MOST_VIEWED
            },
            text: OrderingTypeName.MOST_VIEWED
        }
    ];

    public isDesktop = false;
    public reportType = ReportType;
    public orderingType = OrderingType;
    public orderingTypeName = OrderingTypeName;

    constructor(
        private postsService: PostsService,
        private reactionService: ReactionsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private dialog: MatDialog,
        private windowResize: WindowResizeService
    ) {
        super();

        this.form = new FormGroup({
            search: new FormControl<string | undefined>(undefined),
            academicLevel: new FormControl<RoundedSelectOption<IAcademicLevel> | undefined>(undefined),
            subject: new FormControl<RoundedSelectOption<ISubject> | undefined>(undefined),
            axis: new FormControl<RoundedSelectOption<IAxis> | undefined>(undefined),
            ordering: new FormControl<RoundedSelectOption<IOrdering>>(this.orderingList[0])
        });

        this.searchControl = this.form.controls['search'] as FormControl;
        this.academicLevelControl = this.form.controls['academicLevel'] as FormControl;
        this.subjectControl = this.form.controls['subject'] as FormControl;
        this.axisControl = this.form.controls['axis'] as FormControl;
        this.orderingControl = this.form.controls['ordering'] as FormControl;

        this.user = this.authService.getUserProfile() ?? null;

        this.windowResize.isDesktop$
            .pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(value => this.isDesktop = value);
    }

    public ngOnInit(): void {
        forkJoin([this.getAcademicLevels(), this.getSubjectsWithAxes()])
            .pipe(
                catchError(() => {
                    this.hasData = false;
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                }),
                filter(value => !!value),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(() => {
                this.getQueryParams();

                const filtersListener = merge(
                    this.academicLevelControl.valueChanges,
                    this.subjectControl.valueChanges,
                    this.axisControl.valueChanges,
                    this.orderingControl.valueChanges
                );
                filtersListener.pipe(debounceTime(100)).subscribe(() => {
                    this.doSearch(1);
                    this.updateHasFilters();
                });

                this.handleAxisAndSubjectChanges();
            });
    }

    // Make first request based on query params
    private getQueryParams(): void {
        const params: PostsQueryParams = this.activatedRoute.snapshot.queryParams;

        this.searchControl.setValue(params.search);
        this.academicLevelControl.setValue(
            this.academicLevelsList.find(el => el.data?.id === Number(params.academicLevel))
        );
        this.subjectControl.setValue(
            this.subjectList.find(el => el.data?.id === Number(params.subject))
        );
        this.axisControl.setValue(
            this.axisList.find(el => el.data?.id === Number(params.axis))
        );
        this.orderingControl.setValue(
            this.orderingList.find(el => el.data?.id === params.ordering) ?? this.orderingList[0]
        );

        this.postFilters.page = Number(params.page) || this.postFilters.page;
        this.postFilters.search = this.searchControl.value;
        this.postFilters.academicLevel = this.academicLevelControl.value?.data;
        this.postFilters.subject = this.subjectControl.value?.data;
        this.postFilters.axis = this.axisControl.value?.data;
        this.postFilters.ordering = this.orderingControl.value?.data;

        this.updateHasFilters();
        this.getPosts(this.postFilters);
    }

    // Make request based on filters changes
    public doSearch(page?: number): void {
        if (!!page) {
            this.postFilters.page = page;
        }
        this.postFilters.search = this.searchControl.value;
        this.postFilters.academicLevel = this.academicLevelControl.value?.data;
        this.postFilters.subject = this.subjectControl.value?.data;
        this.postFilters.axis = this.axisControl.value?.data;
        this.postFilters.ordering = this.orderingControl.value?.data;

        if (this.form.valid) {
            this.getPosts(this.postFilters);
            this.setQueryParams();
        }
    }

    public getPosts(filters: PostFilters): void {
        this.isLoading = true;
        this.postsService.getPosts(filters.formatForAPI())
            .pipe(
                catchError(() => {
                    this.hasData = false;
                    this.isLoading = false;
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                }),
                filter(resp => !!resp),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(resp => {
                this.pageInfo = new Pageable(resp!);
                this.posts = resp!.results.map(post => new PostDetail(post));
                this.hasData = !!this.posts.length;
                this.isLoading = false;
            });
    }

    private setQueryParams(): void {
        const queryParams = this.postFilters.formatForQueryParams();
        queryParams.ordering =
            queryParams.ordering !== this.orderingType.MOST_RECENT ? queryParams.ordering : undefined;
        this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });
    }

    private handleAxisAndSubjectChanges(): void {
        this.subjectControl.valueChanges.subscribe(value => {
            const axis = this.axisControl.value;
            if (axis?.data?.subjectId !== value?.data?.id) {
                this.axisControl.setValue(undefined);
            }
        });
        this.axisControl.valueChanges.subscribe(value => {
            if (!!value) {
                const subject = this.subjectList.find(el => el.data?.id === value?.data?.subjectId);
                if (!!subject) {
                    this.subjectControl.setValue(subject);
                }
            }
        });
    }

    public toggleLike(post: PostDetail): any {
        if (!!!this.user) {
            this.commonSnackbarMsg.showLoginRequiredMessage('dar Me gusta');
            return;
        }

        post.totalLikes = !!post.alreadyLiked ? post.totalLikes - 1 : post.totalLikes + 1;
        post.alreadyLiked = post.alreadyLiked ?? -1;

        this.reactionService.toggleLike(this.user.id, post.id)
            .pipe(
                catchError(() => {
                    post.totalLikes = !!post.alreadyLiked ? post.totalLikes - 1 : post.totalLikes + 1;
                    post.alreadyLiked = post.alreadyLiked ?? -1;
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(resp => {
                post.alreadyLiked = resp?.id;
            });
    }

    public changePage(newPage: number): void {
        if (newPage !== this.postFilters.page) {
            this.postFilters.page = newPage;
            this.doSearch();
        }
    }

    public nextPage(): void {
        if (this.pageInfo?.next) {
            this.postFilters.page = (this.postFilters.page ?? 0) + 1;
            this.doSearch();
        }
    }

    public previousPage(): void {
        if (this.pageInfo?.previous) {
            this.postFilters.page = (this.postFilters.page ?? 0) - 1;
            this.doSearch();
        }
    }

    public clearSearchControl(): void {
        this.searchControl.setValue('');
        this.doSearch(1);
    }

    private updateHasFilters(): void {
        this.hasFilters =
            !!this.postFilters.search ||
            !!this.postFilters.academicLevel ||
            !!this.postFilters.subject ||
            !!this.postFilters.axis;
    }

    public removeFilters(): void {
        this.form.setValue({
            search: null,
            academicLevel: null,
            subject: null,
            axis: null,
            ordering: this.orderingList[0]
        });
    }

    public removeFilter(filter: string): void {
        this.form.get(filter)?.setValue(undefined);
    }

    public navigateToDetail(postId: number): void {
        this.router.navigate(['/posts/view/', postId], {
            queryParams: this.postFilters
        });
    }

    private getAcademicLevels(): Observable<RoundedSelectOption<IAcademicLevel>[]> {
        return this.postsService.getAcademicLevels()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectOption<IAcademicLevel>;
                    });
                }),
                tap(resp => this.academicLevelsList = resp),
                tap(() => this.isAcademicLevelsLoading = false)
            );
    }

    private getSubjectsWithAxes(): Observable<any> {
        return this.postsService.getSubjectWithAxis()
            .pipe(
                tap(resp => {
                    if (!!resp) {
                        resp.forEach(subject => {
                            this.subjectList.push({
                                text: subject.name,
                                data: subject
                            } as RoundedSelectOption<ISubject>);

                            const options = subject.axis.map(axis => {
                                return {
                                    text: axis.name,
                                    data: { ...axis, subjectId: subject.id }
                                } as RoundedSelectOption<IAxis>;
                            });

                            this.axisList.push(...options);

                            this.subjectWithAxis.push({
                                text: subject.name,
                                options
                            } as RoundedSelectGroup<IAxis>);
                        });
                        this.isAxesLoading = false;
                        this.isSubjectsLoading = false;
                    }
                }),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            );
    }

    public report(post: PostDetail, type: ReportType): any {
        if (!!!this.user) {
            this.commonSnackbarMsg.showLoginRequiredMessage('crear un reporte');
            return;
        }

        const reportData: ReportForm = {
            report_type: type,
            active: true,
            description: '',
            user: this.user.id,
            post_reported: post.id,
            user_reported: post.user.id
        };

        this.dialog.open(ReportDialogComponent, {
            data: reportData
        });
    }

    public deletePost(post: PostDetail): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                post
            }
        });

        dialogRef.afterClosed().subscribe(refresh => {
            if (refresh) {
                this.router.navigate(['/', 'results']);
            }
        });
    }
}
