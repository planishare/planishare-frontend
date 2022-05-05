import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs';
import { OrderingType, OrderingTypeName } from 'src/app/core/enums/posts.enum';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostsQueryParams } from 'src/app/core/types/posts.type';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobileX } from 'src/app/shared/utils';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
    public isMobile = isMobileX;

    public form: FormGroup;

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];
    public orderingList: RoundedSelectSearchOption[] = [
        {
            data: OrderingType.CREATED_AT_AS,
            text: OrderingTypeName.CREATED_AT_AS
        },
        {
            data: OrderingType.CREATED_AT_DES,
            text: OrderingTypeName.CREATED_AT_DES
        },
        {
            data: OrderingType.TOTAL_DOWNLOADS_AS,
            text: OrderingTypeName.TOTAL_DOWNLOADS_AS
        },
        {
            data: OrderingType.TOTAL_DOWNLOADS_DES,
            text: OrderingTypeName.TOTAL_DOWNLOADS_DES
        },
        {
            data: OrderingType.TOTAL_LIKES_AS,
            text: OrderingTypeName.TOTAL_LIKES_AS
        },
        {
            data: OrderingType.TOTAL_LIKES_DES,
            text: OrderingTypeName.TOTAL_LIKES_DES
        }
    ];

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
                axis: new FormControl(),
                ordering: new FormControl()
            }
        );
    }

    public ngOnInit(): void {
        this.getAcademicLevels();
        this.getSubjects();
        this.getAxes();

        this.form.valueChanges.subscribe(() => this.makeSearch());
    }

    public makeSearch(event?: Event): void {
        event?.preventDefault();
        if (this.form.valid) {
            const searchParams: PostsQueryParams = {
                search: this.searchControl?.value,
                academicLevel: this.academicLevelControl.value?.data.id,
                subject: this.subjectControl.value?.data.id,
                axis: this.axisControl.value?.data.id,
                ordering: this.orderingControl.value?.data
            };

            this.postsService.getPosts(searchParams)
                .subscribe(resp => {
                    console.log(resp);
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

    // Filters requests
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
