import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { catchError, debounceTime, forkJoin, map, merge, Observable, of, startWith, takeUntil, tap } from 'rxjs';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { UsersService } from 'src/app/core/services/users.service';
import { PostDetail, PostPageable, PostsQueryParams } from 'src/app/core/types/posts.type';
import { UserDetail } from 'src/app/core/types/users.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { RoundedSelectSearchGroup, RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils/window-width';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { DeleteDialogComponent } from '../components/delete-dialog/delete-dialog.component';

@Component({
    selector: 'app-user-posts',
    templateUrl: './user-posts.component.html',
    styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent extends Unsubscriber implements OnInit {
    public isMobile = isMobile;
    public isLoading = true;
    public hasData = true;

    public pageInfo?: PostPageable;
    public searchParams: PostsQueryParams = {
        page: 1
    };
    public maxPage = 1;

    public posts: PostDetail[] = [];
    public form: FormGroup;

    public user = this.authService.getUserProfile();

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

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        public dialog: MatDialog,
        private userService: UsersService
    ) {
        super();
        this.form = new FormGroup(
            {
                search: new FormControl(),
                academicLevel: new FormControl(),
                subject: new FormControl(),
                axis: new FormControl(),
                ordering: new FormControl()
            }
        );
    }

    public ngOnInit(): void {
        forkJoin([this.getAcademicLevels(), this.getSubjectsWithAxes(), this.getUserStats() ])
            .pipe(
                takeUntil(this.ngUnsubscribe$),
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    if (!!this.user?.total_posts) {
                        this.doSearch(1);
                    } else {
                        this.isLoading = false;
                    }
                    this.onFormChange();
                    this.handleAxisAndSubjectChanges();
                } else {
                    this.hasData = false;
                }
            });
    }

    private onFormChange(): void {
        merge(
            this.academicLevelControl.valueChanges,
            this.subjectControl.valueChanges,
            this.axisControl.valueChanges,
            this.orderingControl.valueChanges
        )
            .pipe(
                debounceTime(500)
            )
            .subscribe(value => {
                this.doSearch(1);
                this.displayRemoveFiltersButton();
            });
    }

    public doSearch(page?: number): void {
        this.isLoading = true;
        if (!!page) {
            this.searchParams.page = page;
        }
        this.searchParams.userId = this.authService.getUserProfile()?.id;
        this.searchParams.search = this.searchControl.value;
        this.searchParams.academicLevel = this.academicLevelControl.value?.data.id;
        this.searchParams.subject = this.subjectControl.value?.data.id;
        this.searchParams.axis = this.axisControl.value?.data.id;
        this.searchParams.ordering = this.orderingControl.value?.data;

        if (this.form.valid) {
            this.getPosts(this.searchParams);
        }
    }

    public getPosts(params: PostsQueryParams): void {
        // this.postsService.getPosts(params)
        //     .pipe(
        //         takeUntil(this.ngUnsubscribe$),
        //         catchError(error => {
        //             this.commonSnackbarMsg.showErrorMessage();
        //             return of(null);
        //         })
        //     )
        //     .subscribe(resp => {
        //         if (!!resp) {
        //             this.pageInfo = resp;
        //             this.maxPage = this.pageInfo.count <= 10 ? 1 : ((this.pageInfo.count - this.pageInfo.count % 10) / 10) + 1;
        //             this.posts = resp.results;
        //             this.hasData = !!this.posts.length;
        //             console.log(this.pageInfo);
        //         } else {
        //             this.hasData;
        //         }
        //         this.isLoading = false;
        //     });
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

    public nextPage(): void {
        if (this.pageInfo?.next) {
            this.searchParams.page = (Number(this.searchParams.page) ?? 0) + 1;
            this.doSearch();
        }
    }

    public previousPage(): void {
        if (this.pageInfo?.previous) {
            this.searchParams.page = (Number(this.searchParams.page) ?? 0) - 1;
            this.doSearch();
        }
    }

    public deletePost(post: PostDetail): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                post
            }
        });

        dialogRef.afterClosed().subscribe(refresh => {
            if (refresh) {
                this.doSearch(1);

                const currentUserData = this.authService.getUserProfile();
                this.user = {
                    ...currentUserData!,
                    total_posts: currentUserData!.total_posts - 1,
                    total_likes: currentUserData!.total_likes - post.total_likes,
                    total_views: currentUserData!.total_views - post.total_views
                };
                this.authService.setUserProfile(this.user);
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

    public clearSearchControl(): void {
        this.searchControl.setValue('');
        this.doSearch(1);
    }

    public clearFilterControls(): void {
        this.form.setValue(
            {
                search: null,
                academicLevel: null,
                subject: null,
                axis: null,
                ordering: null
            }
        );
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

    public getUserStats(): Observable<UserDetail> {
        return this.authService.refreshUserProfile().pipe(
            tap(resp => this.user = resp)
        );
    }

    private displayRemoveFiltersButton(): void {
        if (
            !!this.searchParams.search ||
            !!this.searchParams.academicLevel ||
            !!this.searchParams.subject ||
            !!this.searchParams.axis ||
            !!this.searchParams.ordering
        ) {
            this.showDeleteButton = true;
        } else {
            this.showDeleteButton = false;
        }
    }
}
