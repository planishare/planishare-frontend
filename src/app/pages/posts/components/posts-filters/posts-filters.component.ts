import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterOption } from 'src/app/shared/models/filter.model';
import { PostFilters, PostFiltersOptions } from '../../models/post-filter.model';
import { cloneAsJson } from 'src/app/shared/utils/clone-object.util';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { takeUntil } from 'rxjs';
import { inOutYAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-posts-filters[filters][options]',
    templateUrl: './posts-filters.component.html',
    styleUrls: ['./posts-filters.component.scss'],
    animations: [inOutYAnimation]
})
export class PostsFiltersComponent extends Unsubscriber implements OnChanges {
    @Input() public filters?: PostFilters;
    @Input() public options?: PostFiltersOptions;
    @Output() public filtersChange = new EventEmitter<PostFilters>();

    public form = new FormGroup({
        search: new FormControl<string|undefined>(undefined),
        academicLevel: new FormControl<FilterOption<number>|undefined>(undefined),
        subject: new FormControl<FilterOption<number>|undefined>(undefined),
        axis: new FormControl<FilterOption<number>|undefined>(undefined),
        ordering: new FormControl<FilterOption<string>|undefined>(undefined)
    });

    public searchCtrl = this.form.controls.search as FormControl<string|undefined>;
    public academicLevelCtrl = this.form.controls.academicLevel as FormControl<FilterOption<number>|undefined>;
    public subjectCtrl = this.form.controls.subject as FormControl<FilterOption<number>|undefined>;
    public axisCtrl = this.form.controls.axis as FormControl<FilterOption<number>|undefined>;
    public orderingCtrl = this.form.controls.ordering as FormControl<FilterOption<string>|undefined>;

    public desktop$ = this.windowResize.desktop$.pipe(takeUntil(this.ngUnsubscribe$));

    public open = false;

    constructor(
        private windowResize: WindowResizeService,
        private el: ElementRef
    ) {
        super();
    }

    public ngOnChanges({ filters, options, open }: SimpleChanges): void {
        if (options || filters) {
            this.form.patchValue({
                search: this.filters?.search,
                academicLevel: this.filters?.academicLevel,
                subject: this.filters?.subject,
                axis: this.filters?.axis,
                ordering: this.filters?.ordering
            });
        }
        if (options) {
            this.options = cloneAsJson(this.options); // Force template inputs update
        }
    }

    public applyFilters(): void {
        if (this.form.valid) {
            const filters: PostFilters = {
                page: 1,
                search: this.searchCtrl.value,
                academicLevel: this.academicLevelCtrl.value,
                subject: this.subjectCtrl.value,
                axis: this.axisCtrl.value,
                ordering: this.orderingCtrl.value
            };
            console.log(filters);
            this.filtersChange.emit(filters);
            this.closeFilters();
        }
    }

    public removeFilters(): void {
        this.form.reset();
        this.filtersChange.emit({
            page: 1
        });
        this.closeFilters();
    }

    public closeFilters(): void {
        this.el.nativeElement.classList.remove('open');
        this.open = false;
    }

    public openFilters(): void {
        this.el.nativeElement.classList.add('open');
        this.open = true;
    }
}
