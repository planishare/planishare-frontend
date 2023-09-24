import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostFilters } from '../../models/post-filter.model';
import { cloneAsJson } from 'src/app/shared/utils/clone-object.util';
import { inOutLeftAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-post-filter-tags',
    templateUrl: './post-filter-tags.component.html',
    styleUrls: ['./post-filter-tags.component.scss'],
    animations: [inOutLeftAnimation]
})
export class PostFilterTagsComponent {
    @Input() public filters?: PostFilters;
    @Output() public filtersChange = new EventEmitter<PostFilters>();

    constructor() { }

    public removeFilter(name: string): void {
        const filters = cloneAsJson(this.filters);
        filters[name] = undefined;
        this.filtersChange.emit(filters);
    }
}
