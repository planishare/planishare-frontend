import { Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { catchError, debounceTime, forkJoin, map, merge, Observable, of, takeUntil, tap } from 'rxjs';

import { Pageable } from 'src/app/core/models/pageable.model';
import { IOrdering, PostFilters, IURLPostsQueryParams } from 'src/app/core/models/post-filter.model';
import { IAcademicLevel, IAxis, ISubject, PostDetail } from 'src/app/core/models/post.model';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { UserDetail } from 'src/app/core/models/user.model';
import { RoundedSelectOption, RoundedSelectGroup } from 'src/app/shared/types/rounded-select.type';

import { PostsService } from 'src/app/core/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { ReportDialogComponent } from 'src/app/shared/components/report-dialog/report-dialog.component';
import { DeleteDialogComponent } from 'src/app/features/posts/components/delete-dialog/delete-dialog.component';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { fadeInOutAnimation, inOutLeftAnimation, inOutRightAnimation, inOutYAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-posts-filters',
    templateUrl: './posts-filters.component.html',
    styleUrls: ['./posts-filters.component.scss'],
    animations: [
        inOutYAnimation,
        inOutLeftAnimation,
        inOutRightAnimation,
        fadeInOutAnimation
    ]
})
export class PostsFiltersComponent extends Unsubscriber implements OnChanges, OnInit {
    @Input() public pageInfo?: Pageable<PostDetail>;
    @Input() public urlQueryParams?: IURLPostsQueryParams;
    @Input() public isLoading = true;
    @Input() public authUser: UserDetail | null = null;
    @Output() public getPosts = new EventEmitter<PostFilters>();

    // For filter selects
    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isAxesLoading = true;
    public academicLevels: RoundedSelectOption<IAcademicLevel>[] = [];
    public axesGroup: RoundedSelectGroup<IAxis>[] = [];
    public axes: RoundedSelectOption<IAxis>[] = [];
    public subjects: RoundedSelectOption<ISubject>[] = [];
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

    public searchControl = this.form.controls.search as FormControl<string | undefined>;
    public academicLevelControl = this.form.controls.academicLevel as FormControl<RoundedSelectOption<IAcademicLevel> | undefined>;
    public subjectControl = this.form.controls.subject as FormControl<RoundedSelectOption<ISubject> | undefined>;
    public axisControl = this.form.controls.axis as FormControl<RoundedSelectOption<IAxis> | undefined>;
    public orderingControl = this.form.controls.ordering as FormControl<RoundedSelectOption<IOrdering>>;

    public postFilters = new PostFilters({
        page: 1,
        ordering: {
            id: OrderingType.MOST_RECENT,
            name: OrderingTypeName.MOST_RECENT
        }
    });
    public hasFilters = false;

    public showFilters = false;
    public isDesktop = false;
    public orderingType = OrderingType;

    public posts: PostDetail[] = [];

    constructor(
        private postsService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private dialog: MatDialog,
        private windowResize: WindowResizeService
    ) {
        super();
        this.windowResize.isDesktop$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(value => {
            this.isDesktop = value;
            this.showFilters = value;
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['pageInfo']) {
            this.posts = this.pageInfo?.results ?? [];
        }
    }

    public ngOnInit() {
        forkJoin([this.getAcademicLevels(), this.getSubjectsAndAxes()]).pipe(
            catchError(() => {
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(() => {
            this.handleAxisAndSubjectChanges();
            const filtersObs$ = merge(
                this.academicLevelControl.valueChanges,
                this.subjectControl.valueChanges,
                this.axisControl.valueChanges,
                this.orderingControl.valueChanges
            );
            filtersObs$.pipe(debounceTime(100)).subscribe(() => {
                this.doSearch(1);
                this.updateHasFilters();
            });
            this.setFilterFromUrlParams(this.urlQueryParams);
        });
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
            this.getPosts.next(this.postFilters);
        }
    }

    private setFilterFromUrlParams(urlQueryParams?: IURLPostsQueryParams): void {
        if (!urlQueryParams) {
            return;
        }

        this.form.patchValue({
            search: urlQueryParams.search,
            academicLevel: this.academicLevels.find(el => el.data?.id === Number(urlQueryParams.academicLevel)),
            subject: this.subjects.find(el => el.data?.id === Number(urlQueryParams.subject)),
            axis: this.axes.find(el => el.data?.id === Number(urlQueryParams.axis)),
            ordering: this.orderingList.find(el => el.data?.id === urlQueryParams.ordering) ?? this.orderingList[0]
        });

        this.postFilters.page = Number(urlQueryParams.page) || this.postFilters.page;
        this.postFilters.search = this.searchControl.value;
        this.postFilters.academicLevel = this.academicLevelControl.value?.data;
        this.postFilters.subject = this.subjectControl.value?.data;
        this.postFilters.axis = this.axisControl.value?.data;
        this.postFilters.ordering = this.orderingControl.value?.data;

        this.updateHasFilters();
    }

    public getAcademicLevels(): Observable<RoundedSelectOption<IAcademicLevel>[]> {
        return this.postsService.getAcademicLevels().pipe(
            map(resp => {
                return resp.map(el => {
                    return {
                        text: el.name,
                        data: el
                    } as RoundedSelectOption<IAcademicLevel>;
                });
            }),
            tap(data => {
                this.academicLevels = data;
                this.isAcademicLevelsLoading = false;
            })
        );
    }

    private getSubjectsAndAxes(): Observable<any> {
        return this.postsService.getSubjectWithAxis().pipe(
            tap(resp => {
                // Map subjects
                this.subjects = resp.map(subject => {
                    const option: RoundedSelectOption<ISubject> = {
                        text: subject.name,
                        data: subject
                    };
                    return option;
                });
                this.isSubjectsLoading = false;
            }),
            tap(resp => {
                // Map axes
                this.axesGroup = resp.map(subject => {
                    const axisOpts = subject.axis.map(axis => {
                        const option: RoundedSelectOption<IAxis> = {
                            text: axis.name,
                            data: {
                                ...axis,
                                subject: subject
                            }
                        };
                        return option;
                    });
                    this.axes.push(...axisOpts);

                    const option: RoundedSelectGroup<IAxis> = {
                        text: subject.name,
                        options: axisOpts
                    };
                    return option;
                });
                this.isAxesLoading = false;
            })
        );
    }

    private handleAxisAndSubjectChanges(): void {
        this.subjectControl.valueChanges.subscribe(value => {
            if (!!value) {
                const axis = this.axisControl.value;
                if (axis?.data.subject.id !== value.data.id) {
                    this.axisControl.setValue(undefined);
                }
            }
        });
        this.axisControl.valueChanges.subscribe(value => {
            if (!!value) {
                this.subjectControl.setValue({
                    text: value.data.subject.name,
                    data: value.data.subject
                });
            }
        });
    }

    public updateHasFilters(): void {
        this.hasFilters =
            !!this.postFilters.search ||
            !!this.postFilters.academicLevel ||
            !!this.postFilters.subject ||
            !!this.postFilters.axis;
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
