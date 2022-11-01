import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, forkJoin, map, merge, Observable, of, takeUntil, tap } from 'rxjs';

import { Pageable } from 'src/app/core/models/pageable.model';
import { IOrdering, PostFilters, PostsQueryParams } from 'src/app/core/models/post-filter.model';
import { IAcademicLevel, IAxis, IPostDetail, ISubject, PostDetail } from 'src/app/core/models/post.model';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { UserDetail } from 'src/app/core/types/users.type';
import { RoundedSelectOption, RoundedSelectGroup } from 'src/app/shared/types/rounded-select.type';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { ReportDialogComponent } from 'src/app/shared/components/report-dialog/report-dialog.component';
import { DeleteDialogComponent } from 'src/app/features/posts/components/delete-dialog/delete-dialog.component';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { fadeInOutAnimation, inOutLeftAnimation, inOutRightAnimation, inOutYAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss'],
    animations: [
        inOutYAnimation,
        inOutLeftAnimation,
        inOutRightAnimation,
        fadeInOutAnimation
    ]
})
export class PostsComponent extends Unsubscriber implements OnInit {
    @Input() public filterByOwner?: number;

    public isLoading = true;
    public hasData = true;
    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isAxesLoading = true;
    public hasFilters = false;

    public filterQueryParams: PostsQueryParams = {};
    public pageInfo?: Pageable<IPostDetail>;

    public postFilters = new PostFilters({
        page: 1,
        ordering: {
            id: OrderingType.MOST_RECENT,
            name: OrderingTypeName.MOST_RECENT
        }
    });

    public authUser: UserDetail | null;
    public posts: PostDetail[] = [];

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

    public form = new FormGroup({
        search: new FormControl<string | undefined>(undefined),
        academicLevel: new FormControl<RoundedSelectOption<IAcademicLevel> | undefined>(undefined),
        subject: new FormControl<RoundedSelectOption<ISubject> | undefined>(undefined),
        axis: new FormControl<RoundedSelectOption<IAxis> | undefined>(undefined),
        ordering: new FormControl<RoundedSelectOption<IOrdering>>(this.orderingList[0])
    });
    public searchControl = this.form.controls.search as FormControl;
    public academicLevelControl = this.form.controls.academicLevel as FormControl;
    public subjectControl = this.form.controls.subject as FormControl;
    public axisControl = this.form.controls.axis as FormControl;
    public orderingControl = this.form.controls.ordering as FormControl;

    public isDesktop = false;
    public showFilterCardContent = false;
    public orderingType = OrderingType;
    public orderingTypeName = OrderingTypeName;

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private dialog: MatDialog,
        private windowResize: WindowResizeService
    ) {
        super();
        this.authUser = this.authService.getUserProfile() ?? null;
        this.windowResize.isDesktop$.pipe(takeUntil(this.ngUnsubscribe$))
            .subscribe(value => {
                this.isDesktop = value;
                this.showFilterCardContent = value;
            });
    }

    public ngOnInit(): void {
        forkJoin([this.getAcademicLevels(), this.getSubjectsWithAxes()])
            .pipe(
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                }),
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
        this.filterQueryParams = this.activatedRoute.snapshot.queryParams;

        this.searchControl.setValue(this.filterQueryParams.search);
        this.academicLevelControl.setValue(
            this.academicLevelsList.find(el => el.data?.id === Number(this.filterQueryParams.academicLevel))
        );
        this.subjectControl.setValue(
            this.subjectList.find(el => el.data?.id === Number(this.filterQueryParams.subject))
        );
        this.axisControl.setValue(
            this.axisList.find(el => el.data?.id === Number(this.filterQueryParams.axis))
        );
        this.orderingControl.setValue(
            this.orderingList.find(el => el.data?.id === this.filterQueryParams.ordering) ?? this.orderingList[0]
        );

        this.postFilters.page = Number(this.filterQueryParams.page) || this.postFilters.page;
        this.postFilters.search = this.searchControl.value;
        this.postFilters.academicLevel = this.academicLevelControl.value?.data;
        this.postFilters.subject = this.subjectControl.value?.data;
        this.postFilters.axis = this.axisControl.value?.data;
        this.postFilters.ordering = this.orderingControl.value?.data;

        // Filter by owner if input has value
        this.postFilters.userId =  this.filterByOwner ?? (Number(this.filterQueryParams.userId) || undefined);

        this.setQueryParams();
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
                    this.isLoading = false;
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                }),
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
        this.filterQueryParams = this.postFilters.formatForQueryParams();
        this.filterQueryParams.ordering =
            this.filterQueryParams.ordering !== this.orderingType.MOST_RECENT ? this.filterQueryParams.ordering : undefined;
        this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: this.filterQueryParams });
    }

    private handleAxisAndSubjectChanges(): void {
        this.subjectControl.valueChanges.subscribe(value => {
            if (!!value) {
                const axis = this.axisControl.value;
                if (axis?.data?.subjectId !== value?.data?.id) {
                    this.axisControl.setValue(undefined);
                }
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

    public updateHasFilters(): void {
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

    public removeFilter(filter: string): any {
        if (filter === 'ordering') {
            return this.form.get(filter)?.setValue(this.orderingList[0]);
        }
        if (filter === 'search') {
            this.form.get(filter)?.setValue(undefined);
            this.doSearch(1);
            this.updateHasFilters();
            return;
        }
        return this.form.get(filter)?.setValue(undefined);
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
                })
            );
    }

    public report(post: PostDetail): any {
        if (!!!this.authUser) {
            this.commonSnackbarMsg.showLoginRequiredMessage('crear un reporte');
            return;
        }

        this.dialog.open(ReportDialogComponent, {
            data: {
                post,
                userId: this.authUser?.id
            },
            autoFocus: false,
            maxWidth: '95%'
        });
    }

    public deletePost(post: PostDetail): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: { post }
        });

        dialogRef.afterClosed().subscribe(refresh => {
            if (refresh) {
                this.doSearch(1);
            }
        });
    }
}
