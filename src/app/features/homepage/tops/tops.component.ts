import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { PostDetail } from 'src/app/core/types/posts.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { isMobile } from 'src/app/shared/utils/window-width';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-tops',
    templateUrl: './tops.component.html',
    styleUrls: ['./tops.component.scss']
})
export class TopsComponent extends Unsubscriber implements OnInit {
    public isMobile = isMobile;

    public popular: PostDetail[] = [];
    public mostLiked: PostDetail[] = [];

    public isLoadingPopular = true;
    public isLoadingMostLiked = true;

    // 1: Most popular
    // 2: Most liked
    public showList = 2;

    public docTypes = {
        doc: ['doc','docm','docx','txt'],
        xls: ['csv','xlam','xls','xlsx','xml'],
        ppt: ['ppt','pptx']
    };

    constructor(
        private postsService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router,
        private reactionService: ReactionsService,
        private authService: AuthService
    ) {
        super();
    }

    public ngOnInit(): void {
        // Get most liked
        this.postsService.getMostLikedPosts()
            .pipe(
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.mostLiked = resp;
                    this.isLoadingMostLiked = false;
                }
            });

        // Get most popular
        this.postsService.getPopularPosts()
            .pipe(
                takeUntil(this.ngUnsubscribe$),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.popular = resp;
                    this.isLoadingPopular = false;
                }
            });
    }

    public navigateToDetail(postId: number): void {
        this.router.navigate(['/posts/view/', postId]);
    }

    // public toggleLike(post: PostDetail): any {
    //     const user = this.authService.getUserProfile();
    //     if (!!!user) {
    //         this.commonSnackbarMsg.showLoginMessage('dar Me gusta');
    //         return;
    //     }
    //     if (!!post.already_liked) {
    //         // Visual efect
    //         const likeId = post.already_liked;
    //         post.already_liked = null;
    //         post.total_likes--;

    //         // Request
    //         this.reactionService.deleteLike(likeId)
    //             .pipe(
    //                 catchError(() => {
    //                     post.already_liked = likeId;
    //                     post.total_likes++;
    //                     this.commonSnackbarMsg.showErrorMessage();
    //                     return of(null);
    //                 })
    //             )
    //             .subscribe(() => {
    //                 console.log('Delete like!');
    //             });
    //     } else {
    //         // Visual efect
    //         post.already_liked = 1;
    //         post.total_likes++;

    //         // Request
    //         this.reactionService.createLike(user.id, post.id)
    //             .pipe(
    //                 catchError(() => {
    //                     post.already_liked = null;
    //                     post.total_likes--;
    //                     this.commonSnackbarMsg.showErrorMessage();
    //                     return of(null);
    //                 })
    //             )
    //             .subscribe(like => {
    //                 if (!!like) {
    //                     post.already_liked = like.id;
    //                     console.log('Like!');
    //                 }
    //             });
    //     }
    // }
}
