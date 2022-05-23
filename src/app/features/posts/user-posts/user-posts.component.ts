import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, forkJoin, map, merge, Observable, of, startWith, tap } from 'rxjs';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostDetail, PostPageable, PostsQueryParams } from 'src/app/core/types/posts.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';

@Component({
    selector: 'app-user-posts',
    templateUrl: './user-posts.component.html',
    styleUrls: ['./user-posts.component.scss']
})
export class UserPostsComponent implements OnInit {

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

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];
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
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
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
        forkJoin([this.getAcademicLevels(), this.getSubjects(), this.getAxes() ])
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {

                    merge(
                        this.academicLevelControl.valueChanges,
                        this.subjectControl.valueChanges,
                        this.axisControl.valueChanges,
                        this.orderingControl.valueChanges
                    )
                        .pipe(
                            debounceTime(500),
                            startWith(true)
                        )
                        .subscribe(value => {
                            if (!!value) {
                                this.showDeleteButton = true;
                            }
                            this.doSearch(1);
                        });
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
        }
    }

    public getPosts(params: PostsQueryParams): void {
        this.isLoading = true;
        this.postsService.getPosts(params)
            .pipe(
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
        this.showDeleteButton = false;
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

    private getSubjects(): Observable<RoundedSelectSearchOption[]> {
        return this.postsService.getSubjects()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectSearchOption;
                    });
                }),
                tap(resp => this.subjectList = resp),
                tap(() => this.isSubjectsLoading = false)
            );
    }

    private getAxes(): Observable<RoundedSelectSearchOption[]> {
        return this.postsService.getAxes()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectSearchOption;
                    });
                }),
                tap(resp => this.axesList = resp),
                tap(() => this.isAxesLoading = false)
            );
    }
}
