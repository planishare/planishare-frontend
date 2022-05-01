import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { forkJoin, map, Observable, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { isMobile } from 'src/app/shared/utils';
import { AcademicLevel, Axis, PostDetail, Subject } from 'src/app/core/types/posts.type';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
    public isMobile = isMobile;

    public academicLevelControl: FormControl;
    public subjectControl: FormControl;
    public axisControl: FormControl;

    public latestPosts: PostDetail[] = [];
    public mostLikedPosts: PostDetail[] = [];
    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];

    public isTopLoading = true;
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
        this.getTopPosts();

        this.academicLevelControl.valueChanges.subscribe(val => console.log('curso', val));
        this.subjectControl.valueChanges.subscribe(val => console.log('asignatura', val));
        this.axisControl.valueChanges.subscribe(val => console.log('eje', val));
    }

    public scroll(element: HTMLElement): void {
        element.scrollIntoView({ behavior: 'smooth' });
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
