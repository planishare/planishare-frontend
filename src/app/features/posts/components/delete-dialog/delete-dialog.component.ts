import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostDetail } from 'src/app/core/models/post.model';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent extends Unsubscriber {
    public isLoading = false;
    public post?: PostDetail;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { post: PostDetail },
        public dialogRef: MatDialogRef<DeleteDialogComponent>,
        private postService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackBar: MatSnackBar
    ) {
        super();
        this.post = this.data.post;
    }

    public deletePost(): void {
        this.isLoading = true;
        this.postService.deletePostById(this.post!.id)
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.isLoading = false;
                    return of();
                })
            )
            .subscribe(resp => {
                this.matSnackBar.open('Publicación eliminada 🗑️', 'Cerrar', { duration: 2000 });
                this.isLoading = false;
                this.dialogRef.close(true);
            });
    }
}
