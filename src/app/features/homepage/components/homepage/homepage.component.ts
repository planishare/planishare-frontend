import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';
import { AcademicLevel, Axis, PostDetail, PostsQueryParams, Subject } from 'src/app/core/types/posts.type';
import { Router } from '@angular/router';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
    public isMobile = isMobile;

    public form: FormGroup;

    public latestPosts: PostDetail[] = [];
    public mostLikedPosts: PostDetail[] = [];
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
        private router: Router
    ) {
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

            this.postsService.getPosts(searchParams)
                .subscribe(resp => {
                    this.router.navigate(['/results'], {
                        queryParams: searchParams
                    });
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
                tap(resp => this.academicLevelsList = resp)
            )
            .subscribe(() => {
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
                tap(resp => this.subjectList = resp)
            )
            .subscribe(() => {
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
                tap(resp => this.axesList = resp)
            )
            .subscribe(() => {
                this.isaxesLoading = false;
            });
    }

    public scroll(element: HTMLElement): void {
        element.scrollIntoView({ behavior: 'smooth' });
    }

    private getTopPosts(): void {
        forkJoin([
            this.getLatestPosts(),
            this.getMostLikedPosts()
        ]).subscribe(resp => {
            console.log('Tops', resp);
            this.isTopLoading = false;
        });
    }

    private getLatestPosts(): Observable<PostDetail[]> {
        return this.postsService.getLatestPosts()
            .pipe(
                tap(resp => this.latestPosts = resp)
            );
    }

    private getMostLikedPosts(): Observable<PostDetail[]> {
        return this.postsService.getMostLikedPosts()
            .pipe(
                tap(resp => this.mostLikedPosts = resp)
            );
    }
}
