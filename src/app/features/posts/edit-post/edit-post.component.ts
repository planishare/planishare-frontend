import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, startWith, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { AcademicLevel, Axis, PostDetail, PostForm, SubjectWithAxis } from 'src/app/core/types/posts.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

@Component({
    selector: 'app-edit-post',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {

    public post!: PostDetail;
    public postId: number;
    public form: FormGroup;

    public isLoading = true;
    public isLoadingSave = false;
    public isAcademicLevelsLoading = true;
    public isAxesLoading = true;
    public isPostInfoLoading = true;

    public academicLevelsList: AcademicLevel[] = [];
    public subjectWithAxisList: SubjectWithAxis[] = [];

    public filteredAcademicLevelsList?: Observable<AcademicLevel[]>;
    public filteredSubjectAxis?: Observable<SubjectWithAxis[]>;

    public searchAcademicLevel: FormControl;
    public searchAxes: FormControl;

    public docTypes = {
        doc: ['doc','docm','docx','txt'],
        xls: ['csv','xlam','xls','xlsx','xml'],
        ppt: ['ppt','pptx']
    };

    constructor(
        private postsService: PostsService,
        private authService: AuthService,
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackbar: MatSnackBar,
        private route: ActivatedRoute
    ) {
        this.postId = Number(this.route.snapshot.paramMap.get('id'));

        this.form = new FormGroup(
            {
                title: new FormControl('', Validators.required),
                description: new FormControl(''),
                academicLevel: new FormControl(null, Validators.required),
                axis: new FormControl(null, Validators.required)
            }
        );

        this.searchAcademicLevel = new FormControl();
        this.searchAxes = new FormControl();
    }

    public ngOnInit(): void {
        forkJoin([this.getPostInfo(), this.getAcademicLevels(), this.getAxes() ])
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                })
            )
            .subscribe(() => {
                this.form.patchValue({
                    title: this.post.title,
                    description: this.post.description,
                    academicLevel: this.post.academic_level.id,
                    axis: this.post.axis.id
                });
                this.isLoading = false;
            });
    }

    public save(event: Event): any {
        event.preventDefault();

        const userId = this.authService.getUserProfile()?.id;
        if (this.form.valid && !this.isLoadingSave && userId) {
            this.isLoadingSave = true;
            const body: PostForm = {
                user: userId,
                title: this.titleControl.value,
                description: this.descriptionControl.value,
                academic_level: this.academicLevelControl.value,
                axis: this.axisControl.value
            };
            console.log(body);
            this.postsService.updatePostById(this.post.id, body)
                .pipe(
                    catchError(error => {
                        this.commonSnackbarMsg.showErrorMessage();
                        return of(null);
                    })
                )
                .subscribe(resp => {
                    if (resp) {
                        const postId = resp.id;
                        this.router.navigate(['/posts/view/', postId]);
                        this.matSnackbar.open('Publicación editada :)', 'Cerrar', { duration: 2000 });
                    }
                    this.isLoadingSave = false;
                });
        }
    }

    public download(docUrl: string): void {
        if (this.getDocType(docUrl) === 'pdf') {
            window.open(docUrl, '_blank');
        } else {
            location.href = docUrl;
        }
    }

    private getAcademicLevels(): Observable<AcademicLevel[]> {
        return this.postsService.getAcademicLevels()
            .pipe(
                tap(resp => {
                    this.academicLevelsList = resp;
                    this.isAcademicLevelsLoading = false;
                    this.filteredAcademicLevelsList = this.searchAcademicLevel.valueChanges.pipe(
                        startWith(''),
                        map(value => this.namefilter(value, this.academicLevelsList))
                    );
                })
            );
    }

    private getAxes(): Observable<SubjectWithAxis[]> {
        return this.postsService.getSubjectWithAxis()
            .pipe(
                tap(resp => {
                    this.subjectWithAxisList = resp;
                    this.isAxesLoading = false;
                    this.filteredSubjectAxis = this.searchAxes.valueChanges.pipe(
                        startWith(''),
                        map(value => this.axisfilter(value, [...this.subjectWithAxisList]))
                        // map(value => this.subjectWithAxisList)
                    );
                })
            );
    }

    private getPostInfo(): Observable<PostDetail> {
        return this.postsService.getPostById(this.postId)
            .pipe(
                tap(data => {
                    this.post = data;
                    this.isPostInfoLoading = false;
                })
            );
    }

    // Form stuff
    public get titleControl() {
        return this.form.get('title') as FormControl;
    }

    public get descriptionControl() {
        return this.form.get('description') as FormControl;
    }

    public get academicLevelControl() {
        return this.form.get('academicLevel') as FormControl;
    }

    public get axisControl() {
        return this.form.get('axis') as FormControl;
    }

    // Utils
    public getDocType(docUrl: string): string {
        const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
        return docName[docName.length - 1];
    }

    private namefilter(
        searchValue: string,
        optionList: (AcademicLevel | Axis)[]): (AcademicLevel | Axis)[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return optionList.filter(el => {
                const textNormalized = el.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return textNormalized.includes(searchValue);
            });
        } else {
            return optionList;
        }
    }

    private axisfilter(
        searchValue: string,
        optionList: SubjectWithAxis[]): SubjectWithAxis[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const results: SubjectWithAxis[] = [];
            optionList.forEach(subject => {
                const subjectNameNormalized = subject.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const filteredAxis: Axis[] = [];
                subject.axis.forEach(axis => {
                    const axisNameNormalized = axis.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (axisNameNormalized.includes(searchValue)) {
                        filteredAxis.push(axis);
                    }
                });

                if (subjectNameNormalized.includes(searchValue)) {
                    results.push(subject);
                } else if (filteredAxis.length) {
                    results.push(
                        { ...subject, axis: filteredAxis }
                    );
                }
            });
            return results;
        } else {
            return optionList;
        }
    }

}
