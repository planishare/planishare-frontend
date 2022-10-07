import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, filter, forkJoin, map, merge, Observable, of, takeUntil, tap } from 'rxjs';

import { Pageable } from 'src/app/core/models/pageable.model';
import { IPostDetail, PostDetail } from 'src/app/core/models/post.model';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { ReportType } from 'src/app/shared/enums/report.enum';
import { PostsQueryParams } from 'src/app/core/types/posts.type';
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
    public showRemoveFilters = false;

    public pageInfo?: Pageable<IPostDetail>;

    public searchParams: PostsQueryParams = {
        page: 1,
        ordering: OrderingType.MOST_RECENT
    };

    public user: UserDetail | null;
    public posts: PostDetail[] = [];

    public form: FormGroup;

    public academicLevelsList: RoundedSelectOption[] = [];
    public subjectWithAxis: RoundedSelectGroup[] = [];
    public axisList: RoundedSelectOption[] = [];
    public subjectList: RoundedSelectOption[] = [];
    public orderingList: RoundedSelectOption[] = [
        {
            data: OrderingType.MOST_RECENT,
            text: OrderingTypeName.MOST_RECENT
        },
        {
            data: OrderingType.LESS_RECENT,
            text: OrderingTypeName.LESS_RECENT
        },
        {
            data: OrderingType.MOST_LIKED,
            text: OrderingTypeName.MOST_LIKED
        },
        {
            data: OrderingType.MOST_VIEWED,
            text: OrderingTypeName.MOST_VIEWED
        }
    ];

    public isDesktop = false;
    public reportType = ReportType;

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
            search: new FormControl(),
            academicLevel: new FormControl(),
            subject: new FormControl(),
            axis: new FormControl(),
            ordering: new FormControl({
                data: OrderingType.MOST_RECENT,
                text: OrderingTypeName.MOST_RECENT
            })
        });

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
                    this.changeRemoveFiltersVisibility();
                });

                this.handleAxisAndSubjectChanges();
            });
    }

    // Make first request based on query params
    private getQueryParams(): void {
        const params: PostsQueryParams = this.activatedRoute.snapshot.queryParams;
        this.getPosts({
            ...params,
            ordering: params.ordering ?? this.orderingControl.value.data
        });

        // Save search params
        this.searchParams.page = Number(params.page) || this.searchParams.page;
        this.searchParams.search = params.search;
        this.searchParams.academicLevel = Number(params.academicLevel);
        this.searchParams.subject = Number(params.subject);
        this.searchParams.axis = Number(params.axis);
        this.searchParams.ordering = params.ordering ?? this.searchParams.ordering;

        // Set search and filters control values
        this.searchControl.setValue(this.searchParams.search);
        this.academicLevelControl.setValue(
            this.academicLevelsList.find(el => el.data?.id === this.searchParams.academicLevel)
        );
        this.subjectControl.setValue(
            this.subjectList.find(el => el.data?.id === this.searchParams.subject)
        );
        this.axisControl.setValue(
            this.axisList.find(el => el.data.id === this.searchParams.axis)
        );
        this.orderingControl.setValue(
            this.orderingList.find(el => el.data === this.searchParams.ordering) ?? this.orderingControl.value
        );

        this.changeRemoveFiltersVisibility();
    }

    // Make request based on filters changes
    public doSearch(page?: number): void {
        if (!!page) {
            this.searchParams.page = page;
        }
        this.searchParams.search = this.searchControl.value;
        this.searchParams.academicLevel = this.academicLevelControl.value?.data.id;
        this.searchParams.subject = this.subjectControl.value?.data.id;
        this.searchParams.axis = this.axisControl.value?.data.id;
        this.searchParams.ordering = this.orderingControl.value?.data;

        if (this.form.valid) {
            this.getPosts(this.searchParams);
            this.setQueryParams();
        }
    }

    public getPosts(params: PostsQueryParams): void {
        this.isLoading = true;
        this.postsService.getPosts(params)
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
        const queryParams: PostsQueryParams = {
            search: this.searchControl?.value ?? undefined,
            academicLevel: this.academicLevelControl.value?.data.id ?? undefined,
            subject: this.subjectControl.value?.data.id ?? undefined,
            axis: this.axisControl.value?.data.id ?? undefined,
            ordering: this.orderingControl?.value?.data ?? undefined
        };
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
        if (newPage !== this.searchParams.page) {
            this.searchParams.page = newPage;
            this.doSearch();
        }
    }

    public nextPage(): void {
        if (this.pageInfo?.next) {
            this.searchParams.page = (this.searchParams.page ?? 0) + 1;
            this.doSearch();
        }
    }

    public previousPage(): void {
        if (this.pageInfo?.previous) {
            this.searchParams.page = (this.searchParams.page ?? 0) - 1;
            this.doSearch();
        }
    }

    public clearSearchControl(): void {
        this.searchControl.setValue('');
        this.doSearch(1);
    }

    private changeRemoveFiltersVisibility(): void {
        this.showRemoveFilters =
            !!this.searchParams.search ||
            !!this.searchParams.academicLevel ||
            !!this.searchParams.subject ||
            !!this.searchParams.axis;
    }

    public clearFilterControls(): void {
        this.form.setValue({
            search: null,
            academicLevel: null,
            subject: null,
            axis: null,
            ordering: {
                data: OrderingType.MOST_RECENT,
                text: OrderingTypeName.MOST_RECENT
            }
        });
    }

    public navigateToDetail(postId: number): void {
        this.router.navigate(['/posts/view/', postId], {
            queryParams: this.searchParams
        });
    }

    private getAcademicLevels(): Observable<RoundedSelectOption[]> {
        return this.postsService.getAcademicLevels()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectOption;
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
                            });

                            const options = subject.axis.map(axis => {
                                return {
                                    text: axis.name,
                                    data: { ...axis, subjectId: subject.id }
                                };
                            });

                            this.axisList.push(...options);

                            this.subjectWithAxis.push({
                                text: subject.name,
                                options
                            });
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

    // Form stuff
    public get searchControl() {
        return this.form.get('search') as FormControl;
    }
    public get academicLevelControl() {
        return this.form.get('academicLevel') as FormControl;
    }
    public get subjectControl() {
        return this.form.get('subject') as FormControl;
    }
    public get axisControl() {
        return this.form.get('axis') as FormControl;
    }
    public get orderingControl() {
        return this.form.get('ordering') as FormControl;
    }
}
