import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, of, take, takeUntil } from 'rxjs';

import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/pages/posts/services/posts.service';
import { ReactionsService } from 'src/app/pages/posts/services/reactions.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { URLPostsParams } from 'src/app/pages/posts/models/post-filter.model';
import { UserDetail } from 'src/app/pages/user/models/user.model';
import { IPostFile, PostDetail, PostFile } from 'src/app/pages/posts/models/post.model';
import { viewerType } from 'ngx-doc-viewer';

import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { WindowResizeService } from 'src/app/shared/services/window-resize.service';

import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { ReportDialogComponent } from 'src/app/shared/components/report-dialog/report-dialog.component';

@Component({
    selector: 'app-post-detail',
    templateUrl: './post-detail.component.html',
    styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent extends Unsubscriber implements OnInit {
    public postId: number;
    public searchParams: URLPostsParams;

    public post?: PostDetail;
    public user: UserDetail|null;

    public currentFile: PostFile|null = null;
    public currentViewer: viewerType|null = null;

    public desktop$ = this.windowResize.desktop$.pipe(takeUntil(this.ngUnsubscribe$));

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router,
        private authService: AuthService,
        private reactionService: ReactionsService,
        public dialog: MatDialog,
        private windowResize: WindowResizeService
    ) {
        super();
        this.postId = Number(this.route.snapshot.paramMap.get('id'));
        this.searchParams = this.route.snapshot.queryParams;
        this.user = this.authService.getUserDetail();
    }

    public ngOnInit(): void {
        this.postsService.getPostById(this.postId)
            .pipe(
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(post => {
                this.post = new PostDetail(post);
                const firstPreview = !!this.post.mainFile.ngxDocViewer
                    ? this.post.mainFile
                    : this.post.supportingMaterial.find(file => !!file.ngxDocViewer);
                if (!!firstPreview) {
                    this.viewDocument(firstPreview);
                }
                // this.registerView(this.post);
            });
    }

    public viewDocument(file: PostFile): void {
        // Set null to force reload ngx-doc-viewer
        this.currentViewer = null;
        this.currentFile = null;
        this.currentViewer = file.ngxDocViewer;
        this.currentFile = file;
    }

    // public report(post: PostDetail): any {
    //     if (!!!this.user) {
    //         this.commonSnackbarMsg.showLoginRequiredMessage('crear un reporte');
    //         return;
    //     }

    //     this.dialog.open(ReportDialogComponent, {
    //         data: {
    //             post,
    //             userId: this.user?.id
    //         },
    //         autoFocus: false,
    //         maxWidth: '95%'
    //     });
    // }

    // public deletePost(post: PostDetail): void {
    //     const dialogRef = this.dialog.open(DeleteDialogComponent, {
    //         data: { post }
    //     });

    //     dialogRef.afterClosed().subscribe(done => {
    //         if (done) {
    //             this.router.navigate(['/posts'], {
    //                 queryParams: this.searchParams
    //             });
    //         }
    //     });
    // }

    // public toggleLike(post: PostDetail): any {
    //     if (!!!this.user) {
    //         this.commonSnackbarMsg.showLoginRequiredMessage('dar Me gusta');
    //         return;
    //     }

    //     post.totalLikes = !!post.alreadyLiked ? post.totalLikes - 1 : post.totalLikes + 1;
    //     post.alreadyLiked = !!post.alreadyLiked ? null : -1;

    //     this.reactionService.toggleLike(this.user.id, post.id)
    //         .pipe(
    //             catchError(() => {
    //                 post.totalLikes = !!post.alreadyLiked ? post.totalLikes - 1 : post.totalLikes + 1;
    //                 post.alreadyLiked = post.alreadyLiked ?? -1;
    //                 this.commonSnackbarMsg.showErrorMessage();
    //                 return of();
    //             })
    //         )
    //         .subscribe(resp => {
    //             post.alreadyLiked = resp.id!;
    //         });
    // }

    // private registerView(post: PostDetail): void {
    //     this.reactionService.registerView(post.id)
    //         .pipe(
    //             catchError(() => of()),
    //             takeUntil(this.ngUnsubscribe$)
    //         )
    //         .subscribe(() => {
    //             this.post!.totalViews += 1;
    //         });
    // }

    public scroll(el: HTMLElement): any {
        this.desktop$.pipe(take(1), filter(desktop => !desktop)).subscribe(() => {
            el.scrollIntoView({ behavior: 'smooth' });
        });
    }
}
