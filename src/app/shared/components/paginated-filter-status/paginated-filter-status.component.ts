import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pageable } from '../../models/pageable.model';
import { PostFilters } from 'src/app/pages/posts/models/post-filter.model';
import { FilterChange } from '../../models/filter.model';

@Component({
    selector: 'app-paginated-filter-status',
    templateUrl: './paginated-filter-status.component.html',
    styleUrls: ['./paginated-filter-status.component.scss']
})
export class PaginatedFilterStatusComponent {
    @Input() public loading: boolean = true;
    @Input() public pageResults?: Pageable<any>;
    @Input() public filters?: { page: number, [key: string]: any };

    @Output() public changePage = new EventEmitter<number>();

    constructor() { }

    public nextPage(): void {
        if (this.pageResults?.next) {
            const newPage = (this.filters?.page ?? 0) + 1;
            this.changePage.next(newPage);
        }
    }

    public previousPage(): void {
        if (this.pageResults?.previous) {
            const newPage = (this.filters?.page ?? 0) - 1;
            this.changePage.next(newPage);
        }
    }

    public changePageByNumber(newPage: number): void {
        if (newPage !== this.filters?.page) {
            this.changePage.next(newPage);
        }
    }
}
