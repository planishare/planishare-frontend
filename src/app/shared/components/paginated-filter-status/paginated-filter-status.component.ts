import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pageable } from '../../models/pageable.model';
import { PostFilterStatus } from 'src/app/pages/posts/models/post-filter.model';

@Component({
    selector: 'app-paginated-filter-status',
    templateUrl: './paginated-filter-status.component.html',
    styleUrls: ['./paginated-filter-status.component.scss']
})
export class PaginatedFilterStatusComponent {
    @Input() public loading: boolean = true;
    @Input() public pageResults?: Pageable<any>;
    @Input() public filtersStatus?: PostFilterStatus;

    @Output() public changePage = new EventEmitter<number>();
    // @Output() public removeFilter = new EventEmitter<string>();

    constructor() { }

    public nextPage(): void {
        if (this.pageResults?.next) {
            const newPage = (this.filtersStatus?.page ?? 0) + 1;
            this.changePage.next(newPage);
        }
    }

    public previousPage(): void {
        if (this.pageResults?.previous) {
            const newPage = (this.filtersStatus?.page ?? 0) - 1;
            this.changePage.next(newPage);
        }
    }

    public changePageByNumber(newPage: number): void {
        if (newPage !== this.filtersStatus?.page) {
            this.changePage.next(newPage);
        }
    }

    // public removeFilterByName(filterName: string): void {
    //     this.removeFilter.next(filterName);
    // }
}
