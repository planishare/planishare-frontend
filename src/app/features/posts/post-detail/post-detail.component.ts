import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { viewerType } from 'ngx-doc-viewer';
import { catchError, of } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { PostDetail } from 'src/app/core/types/posts.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { isMobileX } from 'src/app/shared/utils';

@Component({
    selector: 'app-post-detail',
    templateUrl: './post-detail.component.html',
    styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
    public isMobile = isMobileX;

    public postId: number;
    public post?: PostDetail;
    public currentDocUrl: string = '';
    public currentViewer: viewerType = 'google';

    public isLoading = true;
    public hasData = true;

    public docTypes = {
        doc: [
            'doc',
            'docm',
            'docx',
            'txt'
        ],
        xls: [
            'csv',
            'xlam',
            'xls',
            'xlsx',
            'xml'
        ],
        ppt: [
            'ppt',
            'pptx'
        ]

    };

    public pdf = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/ER_Directorio_Oficial_EE_WEB.pdf?alt=media&token=a1c252ec-766a-4844-8d80-de913b7d09bc';
    public docx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Formulario-Inscripci%C3%B3n-de-Tesis.docx?alt=media&token=ca6883f2-e4ef-46d4-88f2-d251adb177c3';
    public doc = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/plantilla_informepracticaformato.doc?alt=media&token=5c4ed8f6-96fc-43be-aaac-5d7a39a75fdc';
    public pptx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Consultas%20a%20Documentos%20Anidados%20y%20Arreglos.pptx?alt=media&token=db8b8bbc-7967-4c42-88aa-37e0a65b356f';
    public xlsx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Buscador_Instituciones_2022%20(1).xlsx?alt=media&token=4efc7001-dc13-4c00-92f3-ad289ea1b35c';

    constructor(
        private route: ActivatedRoute,
        private postsService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        this.postId = Number(this.route.snapshot.paramMap.get('id'));
    }

    public ngOnInit(): void {
        this.postsService.getPostById(this.postId)
            .pipe(
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
            // TODO: Download file
        }
    }

    public getDocType(docUrl: string): string {
        const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
        return docName[docName.length - 1];
    }

    // TODO: change for mobile
    public getViewer(docType: string): string | viewerType {
        if (docType === 'pdf') {
            return 'google';
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

    public getDocName(docUrl: string): string {
        return docUrl.split('/o/')[1].split('?')[0];
    }
}
