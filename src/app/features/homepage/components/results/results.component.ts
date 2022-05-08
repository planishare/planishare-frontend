import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, tap } from 'rxjs';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostDetail, PostsQueryParams } from 'src/app/core/types/posts.type';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobileX } from 'src/app/shared/utils';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
    public isMobile = isMobileX;
    public isLoading = true;

    public hasData = true;

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
            data: OrderingType.MOST_DOWNLOADED,
            text: OrderingTypeName.MOST_DOWNLOADED
        }
    ];

    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isaxesLoading = true;

    constructor(
        private postsService: PostsService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private matSnackbar: MatSnackBar
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
                    this.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.getQueryParams();
                    this.academicLevelControl.valueChanges.subscribe(() => this.doSearch());
                    this.subjectControl.valueChanges.subscribe(() => this.doSearch());
                    this.axisControl.valueChanges.subscribe(() => this.doSearch());
                    this.orderingControl.valueChanges.subscribe(() => this.doSearch());
                } else {
                    this.hasData = false;
                }
            });
    }

    public doSearch(): void {
        const searchParams: PostsQueryParams = {
            search: this.searchControl?.value,
            academicLevel: this.academicLevelControl.value?.data.id,
            subject: this.subjectControl.value?.data.id,
            axis: this.axisControl.value?.data.id,
            ordering: this.orderingControl.value?.data
        };
        if (this.form.valid) {
            this.getPosts(searchParams);
            this.setQueryParams();
        }
    }

    public getPosts(params: PostsQueryParams): void {
        this.isLoading = true;
        this.postsService.getPosts(params)
            .pipe(
                catchError(error => {
                    this.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                console.log(resp);
                if (!!resp) {
                    this.posts = resp.results;
                    this.hasData = !!this.posts.length;
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
        this.getPosts(params);
        this.form.patchValue(
            {
                search: params.search,
                academicLevel: this.academicLevelsList.find(el => el.data?.id === Number(params.academicLevel)),
                subject: this.subjectList.find(el => el.data?.id === Number(params.subject)),
                axis: this.axesList.find(el => el.data?.id === Number(params.axis)),
                ordering: this.orderingList.find(el => el.data === params.ordering)
            }
        );
    }

    public toggleLike(): void {
        console.log('Like!');
        // TODO: Make request and change buutton style
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
        this.doSearch();
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
                tap(() => this.isaxesLoading = false)
            );
    }

    private showErrorMessage(): void {
        const msg = 'Ups! ha ocurrido un problema, intenta recargar';
        const action = 'Recargar';
        this.matSnackbar.open(msg, action).onAction()
            .subscribe(() => this.router.navigate(['']));
    }
}
