import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Filter, FilterChange, FilterOption } from '../../models/filter.model';

@Component({
    selector: 'app-collapsable-filters',
    templateUrl: './collapsable-filters.component.html',
    styleUrls: ['./collapsable-filters.component.scss']
})
export class CollapsableFiltersComponent {
    // Only get Filter type properties
    @Input() public set filters(filters: {[key: string]: Filter<any>|any}) {
        this._filters = Object.values(filters).filter((filter: any) => filter?.name && filter?.options);
        console.log(this._filters);
    };
    @Input() public loading: boolean = true;
    @Output() public filtersChange = new EventEmitter<FilterChange<any>>();

    public _filters: Filter<any>[] = [];

    constructor() {
    }

    public selectOption(filter: Filter<any>, option: FilterOption<any>, remove: boolean = false): void {
        console.log({ filter, option });
        this.filtersChange.emit({ name: filter.name, option, remove });
    }
}
