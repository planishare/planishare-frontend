import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { RoundedSelectSearchOption } from '../../types/rounded-select-search.type';
import { isMobile } from '../../utils';

@Component({
    selector: 'app-search-dialog',
    templateUrl: './search-dialog.component.html',
    styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
    public isMobile = isMobile;

    public search: string = '';

    public academicLevelControl: FormControl;
    public subjectControl: FormControl;
    public axisControl: FormControl;

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];

    public isFiltersLoading = true;

    constructor(
        private postsService: PostsService
    ) {
        this.academicLevelControl = new FormControl();
        this.subjectControl = new FormControl();
        this.axisControl = new FormControl();
    }

    public ngOnInit(): void {
        this.getFilters();

        this.academicLevelControl.valueChanges.subscribe(val => console.log('curso', val));
        this.subjectControl.valueChanges.subscribe(val => console.log('asignatura', val));
        this.axisControl.valueChanges.subscribe(val => console.log('eje', val));
    }

    private getFilters(): void {
        forkJoin([
            this.getAcademicLevels(),
            this.getSubjects(),
            this.getAxes()
        ]).subscribe(resp => {
            console.log('Filters', this.academicLevelsList, this.subjectList, this.axesList);
            this.isFiltersLoading = false;
        });
    }

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
                tap(resp => this.academicLevelsList = resp)
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
                tap(resp => this.subjectList = resp)
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
                tap(resp => this.axesList = resp)
            );
    }
}
