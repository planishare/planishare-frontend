import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostDetail } from 'src/app/core/types/posts.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {
    public isLoading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<DeleteDialogComponent>,
        private postService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {}

    public deletePost(): void {
        this.isLoading = true;
        this.postService.deletePostById(this.data.post.id)
            .pipe(
                catchError(error => {
                    this.dialogRef.close(false);
                    this.isLoading = false;
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                })
            )
            .subscribe(resp => {
                this.dialogRef.close(true);
            });
    }
}
