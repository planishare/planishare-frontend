import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { viewerType } from 'ngx-doc-viewer';
import { catchError, of, takeUntil } from 'rxjs';
import { ReportType } from 'src/app/core/enums/report.enum';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { PostDetail, PostsQueryParams } from 'src/app/core/types/posts.type';
import { Report } from 'src/app/core/types/report.type';
import { UserDetail } from 'src/app/core/types/users.type';
import { ReportDialogComponent } from 'src/app/shared/components/report-dialog/report-dialog.component';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { isMobile } from 'src/app/shared/utils';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';
import { DeleteDialogComponent } from '../components/delete-dialog/delete-dialog.component';

@Component({
    selector: 'app-post-detail',
    templateUrl: './post-detail.component.html',
    styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent extends Unsubscriber implements OnInit {
    public isMobile = isMobile;
    public searchParams: Params | PostsQueryParams;

    public user: UserDetail;

    public postId: number;
    public post?: PostDetail;
    public currentDocUrl: string = '';
    public currentViewer: viewerType = 'google';

    public isLoading = true;
    public hasData = true;

    public docTypes = {
        doc: ['doc','docm','docx','txt'],
        xls: ['csv','xlam','xls','xlsx','xml'],
        ppt: ['ppt','pptx']
    };

    // DELETE_THIS: Dev porposes
    public pdf = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/ER_Directorio_Oficial_EE_WEB.pdf?alt=media&token=a1c252ec-766a-4844-8d80-de913b7d09bc';
    public docx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Formulario-Inscripci%C3%B3n-de-Tesis.docx?alt=media&token=ca6883f2-e4ef-46d4-88f2-d251adb177c3';
    public doc = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/plantilla_informepracticaformato.doc?alt=media&token=5c4ed8f6-96fc-43be-aaac-5d7a39a75fdc';
    public pptx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Consultas%20a%20Documentos%20Anidados%20y%20Arreglos.pptx?alt=media&token=db8b8bbc-7967-4c42-88aa-37e0a65b356f';
    public xlsx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Buscador_Instituciones_2022%20(1).xlsx?alt=media&token=4efc7001-dc13-4c00-92f3-ad289ea1b35c';

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private router: Router,
        private authService: AuthService,
        private reactionService: ReactionsService,
        public dialog: MatDialog
    ) {
        super();
        this.postId = Number(this.route.snapshot.paramMap.get('id'));
        this.searchParams = this.route.snapshot.queryParams;
        this.user = this.authService.getUserProfile() as UserDetail;
    }

    public ngOnInit(): void {
        this.postsService.getPostById(this.postId)
            .pipe(
                takeUntil(this.ngUnsubscribe$),
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.hasData = false;
                    return of(null);
                })
            )
            .subscribe(post => {
                if (!!post) {
                    this.post = post;
                    console.log(this.post);
                    this.viewDocument(post.main_file);
                    this.isLoading = false;

                    this.registerView(this.post!);
                }
            });
    }

    public viewDocument(docUrl: string): void {
        const docType = this.getDocType(docUrl);
        const viewer = this.getViewer(docType) as viewerType;

        if (!!viewer) {
            if (!!docUrl && docUrl !== this.currentDocUrl) {
                this.currentViewer = viewer;
                this.currentDocUrl = docUrl;
            }
        } else {
            this.download(docUrl);
        }
    }

    public getDocType(docUrl: string): string {
        const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
        return docName[docName.length - 1];
    }

    public getViewer(docType: string): string | viewerType {
        if (docType === 'pdf') {
            return this.isMobile ? 'google' : 'pdf'; // TODO: add safari support
        }
        if (this.docTypes.doc.find(ext => ext === docType)) {
            return 'office';
        }
        if (this.docTypes.ppt.find(ext => ext === docType)) {
            return 'office';
        }
        if (this.docTypes.xls.find(ext => ext === docType)) {
            return 'office';
        }
        return '';
    }

    public toggleLike(post: PostDetail): any {
        if (!!!this.user) {
            this.commonSnackbarMsg.showLoginMessage('dar Me gusta');
            return;
        }

        post.total_likes = !!post.already_liked ? post.total_likes - 1 : post.total_likes + 1;
        post.already_liked = !!post.already_liked ? null : -1;

        this.reactionService.toggleLike(this.user.id, post.id)
            .pipe(
                catchError(() => {
                    post.total_likes = !!post.already_liked ? post.total_likes - 1 : post.total_likes + 1;
                    post.already_liked = !!post.already_liked ? null : -1;
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                post.already_liked = resp?.id!;
            });
    }

    public deletePost(post: PostDetail): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: {
                post
            }
        });

        dialogRef.afterClosed().subscribe(refresh => {
            if (refresh) {
                this.router.navigate(['/', 'results']);
            }
        });
    }

    private registerView(post: PostDetail): void {
        const isAuth = !!this.authService.isAuth$.value;
        const isOwner = post.user.email === this.user?.email;

        // if ((isAuth && !isOwner) || !isAuth) {}
        this.reactionService.registerView(this.postId)
            .pipe(
                catchError(error => of())
            )
            .subscribe(() => {
                this.post!.total_views += 1;
            });
    }

    // Utils
    public scroll(el: HTMLElement): any {
        return this.isMobile ? el.scrollIntoView({ behavior: 'smooth' }) : null;
    }

    public goBack(): void {
        this.router.navigate(['/results'], {
            queryParams: this.searchParams
        });
    }

    public download(docUrl: string): void {
        if (this.getDocType(docUrl) === 'pdf') {
            window.open(docUrl, '_blank');
        } else {
            location.href = docUrl;
        }
    }

    public reportPost(post: PostDetail): any {
        if (!!!this.user) {
            this.commonSnackbarMsg.showLoginMessage('crear un reporte');
            return;
        }

        const reportData: Report = {
            report_type: ReportType.POST_REPORT,
            active: true,
            description: '',
            user: this.user.id,
            post_reported: post.id,
            user_reported: post.user.id
        };

        this.dialog.open(ReportDialogComponent, {
            data: reportData
        });
    }

    public reportUser(post: PostDetail): any {
        if (!!!this.user) {
            this.commonSnackbarMsg.showLoginMessage('crear un reporte');
            return;
        }

        const reportData: Report = {
            report_type: ReportType.USER_REPORT,
            active: true,
            description: '',
            user: this.user.id,
            user_reported: post.user.id
        };

        this.dialog.open(ReportDialogComponent, {
            data: reportData
        });
    }
}
