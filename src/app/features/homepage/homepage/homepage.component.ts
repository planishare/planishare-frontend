import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of, takeUntil, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';
import { AcademicLevel, Axis, PostDetail, PostsQueryParams, Subject } from 'src/app/core/types/posts.type';
import { Router } from '@angular/router';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent extends Unsubscriber implements OnInit {
    public isMobile = isMobile;

    public form: FormGroup;

    public latestPosts: PostDetail[] = [];
    public popularPost: PostDetail[] = [];
    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];

    public isTopLoading = true;
    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isaxesLoading = true;

    public showSearchButton = false;

    constructor(
        private postsService: PostsService,
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        super();
        this.form = new FormGroup(
            {
                search: new FormControl(),
                academicLevel: new FormControl(),
                subject: new FormControl(),
                axis: new FormControl()
            }
            // {
            //     validators: this.atLeastOneSearchParam
            // } as AbstractControlOptions
        );
    }

    public ngOnInit(): void {
        this.getAcademicLevels();
        this.getSubjects();
        this.getAxes();
        this.getTopPosts();

        this.form.valueChanges.subscribe(() => this.showSearchButton = true);
    }

    public makeSearch(event: Event): void {
        event.preventDefault();
        if (this.form.valid) {
            const searchParams: PostsQueryParams = {
                search: this.searchControl?.value,
                academicLevel: this.academicLevelControl.value?.data.id,
                subject: this.subjectControl.value?.data.id,
                axis: this.axisControl.value?.data.id
            };

            this.router.navigate(['/results'], {
                queryParams: searchParams
            });
        }
    }

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

    private getAcademicLevels(): void {
        this.postsService.getAcademicLevels()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectSearchOption;
                    });
                }),
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.academicLevelsList = resp;
                }
                this.isAcademicLevelsLoading = false;
            });
    }

    private getSubjects(): void {
        this.postsService.getSubjects()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectSearchOption;
                    });
                }),
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.subjectList = resp;
                }
                this.isSubjectsLoading = false;
            });
    }

    private getAxes(): void {
        this.postsService.getAxes()
            .pipe(
                map(resp => {
                    return resp.map(el => {
                        return {
                            text: el.name,
                            data: el
                        } as RoundedSelectSearchOption;
                    });
                }),
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.axesList = resp;
                }
                this.isaxesLoading = false;
            });
    }

    public scroll(element?: HTMLElement): void {
        element?.scrollIntoView({ behavior: 'smooth' });
    }

    private getTopPosts(): void {
        forkJoin([
            this.getLatestPosts(),
            this.getPopularPosts()
        ])
            .pipe(
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    console.log('Tops', resp);
                }
                this.isTopLoading = false;
            });
    }

    private getLatestPosts(): Observable<PostDetail[]> {
        return this.postsService.getLatestPosts()
            .pipe(
                tap(resp => this.latestPosts = resp)
            );
    }

    private getPopularPosts(): Observable<PostDetail[]> {
        return this.postsService.getPopularPosts()
            .pipe(
                tap(resp => this.popularPost = resp)
            );
    }
}
