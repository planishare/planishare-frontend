import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin, map, Observable, takeUntil, tap } from 'rxjs';
import { OrderingType } from 'src/app/core/enums/posts.enum';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostsQueryParams } from 'src/app/core/types/posts.type';
import { RoundedSelectSearchOption } from '../../types/rounded-select-search.type';
import { isMobile } from '../../utils';
import { Unsubscriber } from '../../utils/unsubscriber';

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent extends Unsubscriber implements OnInit {
    public isMobile = isMobile;

    public form: FormGroup;

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];

    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isaxesLoading = true;

    constructor(
        private postsService: PostsService,
        private router: Router,
        private dialogRef: MatDialogRef<SearchDialogComponent>
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

            this.dialogRef.close();
            this.router.navigate(['/results'], {
                queryParams: searchParams
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
                tap(resp => this.academicLevelsList = resp),
                takeUntil(this.ngUnsubscribe$)
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
                tap(resp => this.subjectList = resp),
                takeUntil(this.ngUnsubscribe$)
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
                tap(resp => this.axesList = resp),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(() => {
                this.isaxesLoading = false;
            });
    }
}
