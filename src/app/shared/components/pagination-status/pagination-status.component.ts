import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pageable } from '../../models/pageable.model';

@Component({
    selector: 'app-pagination-status',
    templateUrl: './pagination-status.component.html',
    styleUrls: ['./pagination-status.component.scss']
})
export class PaginationStatusComponent {
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
