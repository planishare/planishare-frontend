import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, debounceTime, delay, forkJoin, map, merge, Observable, of, race, switchMap, takeUntil, tap, throttleTime } from 'rxjs';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { Axis, PostDetail, PostPageable, PostsQueryParams } from 'src/app/core/types/posts.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { RoundedSelectSearchGroup, RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends Unsubscriber implements OnInit {
    public isMobile = isMobile;
    public isLoading = true;
    public hasData = true;

    public pageInfo?: PostPageable;
    public searchParams: PostsQueryParams = {
        page: 1,
        ordering: OrderingType.MOST_RECENT
    };
    public maxPage = 1;

    public posts: PostDetail[] = [];
    public form: FormGroup;

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public subjectWithAxis: RoundedSelectSearchGroup[] = [];
    public axisList: RoundedSelectSearchOption[] = [];

    public orderingList: RoundedSelectSearchOption[] = [
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

    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isAxesLoading = true;

    public showDeleteButton = false;

    public docTypes = {
        doc: ['doc','docm','docx','txt'],
        xls: ['csv','xlam','xls','xlsx','xml'],
        ppt: ['ppt','pptx']
    };

    constructor(
        private postsService: PostsService,
        private reactionService: ReactionsService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private navbarService: NavbarService
    ) {
        super();

        this.navbarService.setButtonConfig({ showSeachButton: false });
        this.ngUnsubscribe$.asObservable().subscribe(() => this.navbarService.resetConfig());

        this.form = new FormGroup(
            {
                search: new FormControl(),
                academicLevel: new FormControl(),
                subject: new FormControl(),
                axis: new FormControl(),
                ordering: new FormControl(
                    {
                        data: OrderingType.MOST_RECENT,
                        text: OrderingTypeName.MOST_RECENT
                    }
                )
            }
        );
    }

    public ngOnInit(): void {
        forkJoin([this.getAcademicLevels(), this.getSubjectsWithAxes()])
            .pipe(
                takeUntil(this.ngUnsubscribe$),
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.getQueryParams();
                    merge(
                        this.academicLevelControl.valueChanges,
                        this.subjectControl.valueChanges,
                        this.axisControl.valueChanges,
                        this.orderingControl.valueChanges
                    )
                        .pipe(
                            debounceTime(100)
                        )
                        .subscribe(() => {
                            this.doSearch(1);
                            this.displayRemoveFiltersButton();
                        });
                    this.handleAxisAndSubjectChanges();
                } else {
                    this.hasData = false;
                }
            });
    }

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
                takeUntil(this.ngUnsubscribe$),
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.pageInfo = resp;
                    this.maxPage = ((this.pageInfo.count - this.pageInfo.count % 10) / 10) + 1;
                    this.posts = resp.results;
                    this.hasData = !!this.posts.length;
                    console.log(this.pageInfo);
                } else {
                    this.hasData;
                }
                this.isLoading = false;
            });
    }

    private setQueryParams(): void {
        const queryParams: PostsQueryParams = {};
        if (!!this.searchControl?.value) {
            queryParams.search = this.searchControl?.value;
        }
        if (!!this.academicLevelControl?.value) {
            queryParams.academicLevel = this.academicLevelControl.value?.data.id;
        }
        if (!!this.subjectControl?.value) {
            queryParams.subject = this.subjectControl.value?.data.id;
        }
        if (!!this.axisControl?.value) {
            queryParams.axis = this.axisControl.value?.data.id;
        }
        if (!!this.orderingControl?.value) {
            queryParams.ordering = this.orderingControl?.value?.data;
        }
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: queryParams
            }
        );
    }

    private getQueryParams(): void {
        const params: Params | PostsQueryParams = this.activatedRoute.snapshot.queryParams;
        this.getPosts({ ...params, ordering: OrderingType.MOST_RECENT });
        this.searchControl.setValue(params.search);
        this.academicLevelControl.setValue(this.academicLevelsList.find(el => el.data?.id === Number(params.academicLevel)));
        this.subjectControl.setValue(this.subjectList.find(el => el.data?.id === Number(params.subject)));
        this.axisControl.setValue(this.axisList.find(el => el.data.id === Number(params.axis)));
        this.orderingControl.setValue(this.orderingList.find(el => el.data === params.ordering) ?? this.orderingControl.value);

        // Set search params to pass them to detail-post
        this.searchParams.page = params.page ?? this.searchParams.page;
        this.searchParams.search = params.search ?? this.searchParams.search;
        this.searchParams.academicLevel = params.academicLevel ?? this.searchParams.academicLevel;
        this.searchParams.subject = params.subject ?? this.searchParams.subject;
        this.searchParams.axis = params.axis ?? this.searchParams.axis;
        this.searchParams.ordering = params.ordering ?? this.searchParams.ordering;

        this.displayRemoveFiltersButton();
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

    public toggleLike(post: PostDetail): any {
        const user = this.authService.getUserProfile();
        if (!!!user) {
            this.commonSnackbarMsg.showLoginMessage('dar Me gusta');
            return;
        }
        if (!!post.already_liked) {
            // Visual efect
            const likeId = post.already_liked;
            post.already_liked = null;
            post.likes--;

            // Request
            this.reactionService.deleteLike(likeId)
                .pipe(
                    catchError(() => {
                        post.already_liked = likeId;
                        post.likes++;
                        this.commonSnackbarMsg.showErrorMessage();
                        return of(null);
                    })
                )
                .subscribe(() => {
                    console.log('Delete like!');
                });
        } else {
            // Visual efect
            post.already_liked = 1;
            post.likes++;

            // Request
            this.reactionService.createLike(user.id, post.id)
                .pipe(
                    catchError(() => {
                        post.already_liked = null;
                        post.likes--;
                        this.commonSnackbarMsg.showErrorMessage();
                        return of(null);
                    })
                )
                .subscribe(like => {
                    if (!!like) {
                        post.already_liked = like.id;
                        console.log('Like!');
                    }
                });
        }
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

    public clearSearchControl(): void {
        this.searchControl.setValue('');
        this.doSearch(1);
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

    private displayRemoveFiltersButton(): void {
        if (
            !!this.searchParams.search ||
            !!this.searchParams.academicLevel ||
            !!this.searchParams.subject ||
            !!this.searchParams.axis
            // !!this.searchParams.ordering
        ) {
            this.showDeleteButton = true;
        } else {
            this.showDeleteButton = false;
        }
    }

    public navigateToDetail(postId: number): void {
        this.router.navigate(['/posts/view/', postId], {
            queryParams: this.searchParams
        });
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

    // Filters requests
    private getAcademicLevels(): Observable<RoundedSelectSearchOption[]> {
        return this.postsService.getAcademicLevels()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectSearchOption;
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
                        let subjects: RoundedSelectSearchOption[] = [];
                        let axisGroups: RoundedSelectSearchGroup[] = [];
                        resp.forEach(subject => {
                            let options: RoundedSelectSearchOption[] = [];
                            // Add subject to list
                            subjects.push({
                                text: subject.name,
                                data: subject
                            });

                            options = subject.axis.map(axis => {
                                return {
                                    text: axis.name,
                                    data: { ...axis, subjectId: subject.id }
                                };
                            });
                            this.axisList.push(...options);  // used to find axis by id

                            axisGroups.push({
                                groupName: subject.name,
                                options
                            });
                        });
                        this.subjectList = subjects;
                        this.subjectWithAxis = axisGroups;
                        this.isAxesLoading = false;
                        this.isSubjectsLoading = false;
                    }
                }),
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            );
    }
}
