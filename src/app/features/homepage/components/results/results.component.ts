import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostsQueryParams } from 'src/app/core/types/posts.type';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
    public form: FormGroup;

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];

    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isaxesLoading = true;

    constructor(
        private postsService: PostsService
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
    }

    public makeSearch(event: Event): void {
        event.preventDefault();
        if (this.form.valid) {
            const searchParams: PostsQueryParams = {
                search: this.searchControl?.value,
                academicLevel: this.academicLevelControl.value?.data,
                subject: this.subjectControl.value?.data,
                axis: this.axisControl.value?.data
            };

            // TODO: Redirect to result page
            this.postsService.getPosts(searchParams)
                .subscribe(resp => {
                    console.log(resp);
                });
        }
    }

    // public atLeastOneSearchParam(group: FormGroup): any {
    //     const valid =
    //         !!group.controls['search'].value ||
    //         !!group.controls['academicLevel'].value ||
    //         !!group.controls['subject'].value ||
    //         !!group.controls['axis'].value;
    //     if (!valid) {
    //         return { emptyParams: true };
    //     }
    //     return null;
    // }

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
}
