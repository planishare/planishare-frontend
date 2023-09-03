import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IFilter, IFilterOption } from '../../models/filter.model';

@Component({
    selector: 'app-collapsable-filters',
    templateUrl: './collapsable-filters.component.html',
    styleUrls: ['./collapsable-filters.component.scss']
})
export class CollapsableFiltersComponent {
    @Input() public loading: boolean = true;
    @Input() public filtersOptions: IFilter<unknown>[] = [];
    @Output() public filtersChange = new EventEmitter<IFilterOption<unknown>>();

    constructor() { }

    public selectOption(option: IFilterOption<unknown>): void {
        console.log(option);
        this.filtersChange.emit(option);
    }
}
