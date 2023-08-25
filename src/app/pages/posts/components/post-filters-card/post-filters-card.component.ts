import { Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, merge, takeUntil, BehaviorSubject, filter, take } from 'rxjs';

import { inOutYAnimation } from 'src/app/shared/animations/animations';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

import { WindowResizeService } from 'src/app/shared/services/window-resize.service';

import { OrderingType, OrderingTypeName } from 'src/app/pages/posts/models/posts.enum';
import { IOrdering, IURLPostsQueryParams, PostFilters } from 'src/app/pages/posts/models/post-filter.model';
import { IAcademicLevel, IAxis, ISubject, ISubjectWithAxis } from 'src/app/pages/posts/models/post.model';
import { RoundedSelectGroup, RoundedSelectOption } from 'src/app/shared/models/rounded-select.type';

@Component({
    selector: 'app-post-filters-card',
    templateUrl: './post-filters-card.component.html',
    styleUrls: ['./post-filters-card.component.scss'],
    animations: [inOutYAnimation]
})
export class PostFiltersCardComponent extends Unsubscriber implements OnInit, OnChanges {
    @Input() public urlQueryParams?: IURLPostsQueryParams;
    @Input() public academicLevels: IAcademicLevel[] = [];
    @Input() public subjectWithAxis: ISubjectWithAxis[] = [];

    // Set as objects to force detect changes
    @Input() public removeFilter: { value: string } | undefined;
    @Input() public changePage: { value: number } | undefined;

    @Output() public filtersChange = new EventEmitter<PostFilters>();

    public filtersLoaded$ = new BehaviorSubject<boolean>(false);
    public academicLevelsLoading = true;
    public axesLoading = true;
    public subjectsLoading = true;

    public academicLevelsOptions: RoundedSelectOption<IAcademicLevel>[] = [];
    public axesGroupOptions: RoundedSelectGroup<IAxis>[] = [];
    public axesOptions: RoundedSelectOption<IAxis>[] = [];
    public subjectsOptions: RoundedSelectOption<ISubject>[] = [];
    public orderOptions: RoundedSelectOption<IOrdering>[] = [
        {
            data: {
                id: OrderingType.MOST_RECENT,
                name: OrderingTypeName.MOST_RECENT
            },
            text: OrderingTypeName.MOST_RECENT
        },
        {
            data: {
                id: OrderingType.LESS_RECENT,
                name: OrderingTypeName.LESS_RECENT
            },
            text: OrderingTypeName.LESS_RECENT
        },
        {
            data: {
                id: OrderingType.MOST_LIKED,
                name: OrderingTypeName.MOST_LIKED
            },
            text: OrderingTypeName.MOST_LIKED
        },
        {
            data: {
                id: OrderingType.MOST_VIEWED,
                name: OrderingTypeName.MOST_VIEWED
            },
            text: OrderingTypeName.MOST_VIEWED
        }
    ];

    public form = new FormGroup({
        search: new FormControl<string | undefined>(undefined),
        academicLevel: new FormControl<RoundedSelectOption<IAcademicLevel> | undefined>(undefined),
        subject: new FormControl<RoundedSelectOption<ISubject> | undefined>(undefined),
        axis: new FormControl<RoundedSelectOption<IAxis> | undefined>(undefined),
        ordering: new FormControl<RoundedSelectOption<IOrdering>>(this.orderOptions[0])
    });

    public searchControl = this.form.controls.search as FormControl<string | undefined>;
    public academicLevelControl = this.form.controls.academicLevel as FormControl<RoundedSelectOption<IAcademicLevel> | undefined>;
    public subjectControl = this.form.controls.subject as FormControl<RoundedSelectOption<ISubject> | undefined>;
    public axisControl = this.form.controls.axis as FormControl<RoundedSelectOption<IAxis> | undefined>;
    public orderingControl = this.form.controls.ordering as FormControl<RoundedSelectOption<IOrdering>>;

    public filters = new PostFilters({
        page: 1,
        ordering: this.orderOptions[0].data
    });
    public hasFilters = false;

    public showFilters = false;
    public isDesktop = false;
    public orderingType = OrderingType;

    constructor(
        private windowResize: WindowResizeService
    ) {
        super();
        this.windowResize.desktop$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(value => {
            this.isDesktop = value;
            this.showFilters = value;
        });
    }

    public ngOnInit(): void {
        this.handleAxisAndSubjectChanges();

        this.filtersLoaded$.pipe(
            filter(loaded => loaded),
            take(1),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(() => {
            // Do first search
            this.setFilterFromUrlParams(this.urlQueryParams!);
            this.doSearch();

            // When filters changes then do search
            const filtersValueChanges$ = merge(
                this.academicLevelControl.valueChanges,
                this.subjectControl.valueChanges,
                this.axisControl.valueChanges,
                this.orderingControl.valueChanges
            ).pipe(
                debounceTime(100),
                takeUntil(this.ngUnsubscribe$)
            );

            filtersValueChanges$.subscribe(() => {
                this.doSearch(1);
            });
        });
    }

    public ngOnChanges({ academicLevels, subjectWithAxis, removeFilter, changePage }: SimpleChanges) {
        const filtersLoaded =
            (!!academicLevels || !!subjectWithAxis) &&
            !!this.academicLevels.length &&
            !!this.subjectWithAxis.length &&
            !!this.urlQueryParams;
        this.filtersLoaded$.next(filtersLoaded);

        if (!!academicLevels) {
            this.academicLevelsOptions = this.getAcademicLevelOptions(academicLevels.currentValue);
            this.academicLevelsLoading = false;
        }

        if (!!subjectWithAxis) {
            const [
                axesOptions,
                subjectsOptions,
                axesGroupOptions
            ] = this.getSubjectAndAxesOptions(subjectWithAxis.currentValue);
            this.axesOptions = axesOptions;
            this.axesGroupOptions = axesGroupOptions;
            this.subjectsOptions = subjectsOptions;

            this.axesLoading = false;
            this.subjectsLoading = false;
        }

        if (!!removeFilter) {
            this.removeFilterByName(removeFilter.currentValue?.value);
        }

        if (!!changePage) {
            this.changePageByNumber(changePage.currentValue?.value);
        }
    }

    private setFilterFromUrlParams(urlQueryParams: IURLPostsQueryParams): void {
        this.form.patchValue({
            search: urlQueryParams.search ?? undefined,
            academicLevel: this.academicLevelsOptions.find(el => el.data?.id === Number(urlQueryParams.academicLevel)) ?? undefined,
            subject: this.subjectsOptions.find(el => el.data?.id === Number(urlQueryParams.subject)) ?? undefined,
            axis: this.axesOptions.find(el => el.data?.id === Number(urlQueryParams.axis)) ?? undefined,
            ordering: this.orderOptions.find(el => el.data?.id === urlQueryParams.ordering) ?? this.orderOptions[0]
        });
        this.filters.page = Number(urlQueryParams.page ?? '1');
    }

    public doSearch(page?: number): void {
        if (this.form.valid) {
            this.filters.page = page ?? this.filters.page;
            this.filters.search = this.searchControl.value;
            this.filters.academicLevel = this.academicLevelControl.value?.data;
            this.filters.subject = this.subjectControl.value?.data;
            this.filters.axis = this.axisControl.value?.data;
            this.filters.ordering = this.orderingControl.value?.data;

            this.filtersChange.next(this.filters);
            this.updateHasFilters();
        }
    }

    private getAcademicLevelOptions(academicLevels: IAcademicLevel[]): RoundedSelectOption<IAcademicLevel>[] {
        return academicLevels.map(el => {
            return {
                text: el.name,
                data: el
            } as RoundedSelectOption<IAcademicLevel>;
        });
    }

    private getSubjectAndAxesOptions(subjectWithAxis: ISubjectWithAxis[]): [
        RoundedSelectOption<IAxis>[],
        RoundedSelectOption<ISubject>[],
        RoundedSelectGroup<IAxis>[],
    ] {
        const axesOptions: RoundedSelectOption<IAxis>[] = [];
        const axesGroupOptions = subjectWithAxis.map(subject => {
            const axisOpts = subject.axis.map(axis => {
                const option: RoundedSelectOption<IAxis> = {
                    text: axis.name,
                    data: {
                        ...axis,
                        subject: subject
                    }
                };
                return option;
            });
            axesOptions.push(...axisOpts);

            const option: RoundedSelectGroup<IAxis> = {
                text: subject.name,
                options: axisOpts
            };
            return option;
        });

        const subjectsOptions = subjectWithAxis.map(subject => {
            const option: RoundedSelectOption<ISubject> = {
                text: subject.name,
                data: subject
            };
            return option;
        });

        return [ axesOptions, subjectsOptions, axesGroupOptions ];
    }

    private handleAxisAndSubjectChanges(): void {
        this.subjectControl.valueChanges.subscribe(value => {
            if (!!value) {
                const axis = this.axisControl.value;
                if (axis?.data.subject.id !== value.data.id) {
                    this.axisControl.setValue(undefined);
                }
            }
        });
        this.axisControl.valueChanges.subscribe(value => {
            if (!!value) {
                this.subjectControl.setValue({
                    text: value.data.subject.name,
                    data: value.data.subject
                });
            }
        });
    }

    public updateHasFilters(): void {
        this.hasFilters =
            !!this.filters.search ||
            !!this.filters.academicLevel ||
            !!this.filters.subject ||
            !!this.filters.axis;
    }

    public clearSearchControl(): void {
        this.searchControl.setValue('');
        this.doSearch(1);
    }

    public removeFilters(): void {
        this.form.setValue({
            search: null,
            academicLevel: null,
            subject: null,
            axis: null,
            ordering: this.orderOptions[0]
        });
    }

    public removeFilterByName(name?: string): void {
        if (!name) {
            return;
        }

        this.filters.page = 1;
        switch (name) {
            case 'ordering':
                this.form.controls.ordering.setValue(this.orderOptions[0]);
                break;
            case 'search':
                this.form.controls.search.setValue(undefined);
                this.doSearch(1);
                break;
            default:
                this.form.get(name)?.setValue(undefined);
                break;
        }
    }

    public changePageByNumber(newPage?: number): void {
        if (!newPage || newPage === this.filters.page) {
            return;
        }

        this.filters.page = newPage;
        this.doSearch();
    }
}
