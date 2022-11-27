import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ReportDialogComponent } from 'src/app/shared/components/report-dialog/report-dialog.component';
import { fadeInOutAnimation, inOutLeftAnimation, inOutRightAnimation } from 'src/app/shared/animations/animations';

import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { OrderingType } from 'src/app/features/posts/constants/posts.enum';
import { Pageable } from 'src/app/shared/models/pageable.model';
import { IURLPostsQueryParams, PostFilters } from 'src/app/features/posts/models/post-filter.model';
import { PostDetail } from 'src/app/features/posts/models/post.model';
import { UserDetail } from 'src/app/features/user/models/user.model';

@Component({
    selector: 'app-post-paginated-list',
    templateUrl: './post-paginated-list.component.html',
    styleUrls: ['./post-paginated-list.component.scss'],
    animations: [fadeInOutAnimation, inOutLeftAnimation, inOutRightAnimation]
})
export class PostPaginatedListComponent implements OnChanges {
    @Input() public pageResults?: Pageable<PostDetail>;
    @Input() public isLoading = true;
    @Input() public authUser: UserDetail | null = null;
    @Input() public currentFilters?: PostFilters;
    @Input() public urlQueryParams?: IURLPostsQueryParams;

    @Output() public changePage = new EventEmitter<number>();
    @Output() public removeFilter = new EventEmitter<string>();

    public posts: PostDetail[] = [];

    public orderingType = OrderingType;

    constructor(
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private dialog: MatDialog
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['pageResults']) {
            this.posts = this.pageResults?.results ?? [];
        }
    }

    public changePageByNumber(newPage: number): void {
        if (newPage !== this.currentFilters?.page) {
            this.changePage.next(newPage);
        }
    }

    public nextPage(): void {
        if (this.pageResults?.next) {
            const newPage = (this.currentFilters?.page ?? 0) + 1;
            this.changePage.next(newPage);
        }
    }

    public previousPage(): void {
        if (this.pageResults?.previous) {
            const newPage = (this.currentFilters?.page ?? 0) - 1;
            this.changePage.next(newPage);
        }
    }

    public removeFilterByName(filterName: string): void {
        this.removeFilter.next(filterName);
    }

    public report(post: PostDetail): any {
        if (!!!this.authUser) {
            this.commonSnackbarMsg.showLoginRequiredMessage('crear un reporte');
            return;
        }

        this.dialog.open(ReportDialogComponent, {
            data: {
                post,
                userId: this.authUser?.id
            },
            autoFocus: false,
            maxWidth: '95%'
        });
    }

    public deletePost(post: PostDetail): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: { post }
        });

        dialogRef.afterClosed().subscribe(refresh => {
            if (refresh) {
                this.changePage.next(1);
            }
        });
    }
}
