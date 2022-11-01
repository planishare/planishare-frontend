import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, forkJoin, takeUntil, catchError, tap, startWith, map, delay } from 'rxjs';

import { IAcademicLevel, IAxis, IPostDetail, IPostForm, ISubjectWithAxis, PostDetail, PostFile } from 'src/app/core/models/post.model';
import { inOutLeftAnimation, inOutRightAnimation, inOutYAnimation } from 'src/app/shared/animations/animations';

import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { AuthService } from 'src/app/core/services/auth.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-post-form',
    templateUrl: './post-form.component.html',
    styleUrls: ['./post-form.component.scss'],
    animations: [inOutRightAnimation, inOutLeftAnimation]
})
export class PostFormComponent extends Unsubscriber implements OnInit {
    public isEditForm = false;
    public post?: PostDetail;
    public isPostDataLoading = false;

    public form = new FormGroup({
        title: new FormControl<string>('', Validators.required),
        description: new FormControl<string>('', [Validators.required, Validators.maxLength(1000)]),
        academicLevel: new FormControl<number | undefined>(undefined, Validators.required),
        axis: new FormControl<number | undefined>(undefined, Validators.required),
        files: new FormArray<FormControl<string>>([], [Validators.required, Validators.maxLength(5)])
    });

    public academicLevels: IAcademicLevel[] = [];
    public subjectWithAxis: ISubjectWithAxis[] = [];
    public searchAcademicLevel: FormControl = new FormControl<string>('');
    public searchAxis: FormControl = new FormControl<string>('');
    public filteredAcademicLevels: Observable<IAcademicLevel[]> = of();
    public filteredSubjectAxis: Observable<ISubjectWithAxis[]> = of();

    public fileList: PostFile[] = [];

    public isLoading = false;
    public isAcademicLevelsLoading = true;
    public isAxesLoading = true;

    public maxFileSize = 3000000; // 3Mb
    public fileInputMsg = {
        minFiles: 'Debes subir al menos un archivo',
        maxFiles: 'Puedes subir máximo 5 archivos',
        maxFileSize: `No puedes subir archivos que pesen más de ${ this.maxFileSize / 1000000 }MB`,
        invalidFileName: 'Archivo con nombre inválido'
    };

    constructor(
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private postsService: PostsService,
        private authService: AuthService,
        private matSnackbar: MatSnackBar,
        private storage: Storage,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();
    }

    public ngOnInit(): void {
        forkJoin([this.getAcademicLevels(), this.getAxis(), this.getPostToEdit() ])
            .pipe(
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe();
    }

    public getPostToEdit(): Observable<IPostDetail | null> {
        const postId = Number(this.route.snapshot.paramMap.get('id'));
        this.isEditForm = !!postId;
        if (this.isEditForm) {
            this.isPostDataLoading = true;
            this.form.disable();
            return this.postsService.getPostById(postId)
                .pipe(
                    tap(data => {
                        this.post = new PostDetail(data);

                        // Patch values
                        this.form.patchValue({
                            title: this.post.title,
                            academicLevel: this.post.academicLevel.id,
                            axis: this.post.axis.id,
                            description: this.post.description
                        });
                        this.fileList = [this.post.mainFile, ...this.post.supportingMaterial];
                        this.isPostDataLoading = false;
                        this.form.controls.files.clearValidators();
                        this.form.enable();
                    })
                );
        }
        return of(null);
    }

    public onFileSelected(event: Event): void {
        const files = Array.from((event.target as HTMLInputElement).files ?? []);
        this.handleFiles(files);
    }

    public onFileDroped(event: FileList): void {
        const files = Array.from(event);
        this.handleFiles(files);
    }

    private async handleFiles(files: File[]): Promise<any> {
        if (!files || files?.length === 0) {
            return;
        }

        if (this.fileList.length + files.length > 5) {
            this.matSnackbar.open(this.fileInputMsg.maxFiles, 'Cerrar', { duration: 3000  });
            return;
        }

        // Add file in fileList
        const filesToUpload = files.filter((file: File) => {
            if (file.size > this.maxFileSize) {
                this.matSnackbar.open(this.fileInputMsg.maxFileSize, 'Cerrar', { duration: 3000 });
                return false;
            }

            // Already added
            if (this.fileList.find(el => el.fullName === file.name)) {
                return false;
            }

            const newFile = new PostFile('', file);
            this.fileList.push(newFile);
            return true;
        });

        try {
            const uploadedFiles = await Promise.all(filesToUpload.map(file => this.uploadFile(file)));
            uploadedFiles.forEach(fileUrl => {
                if (!!fileUrl) {
                    this.form.controls.files.push(new FormControl(fileUrl) as FormControl<string>);
                }
            });
        } catch (error) {
            this.commonSnackbarMsg.showErrorMessage();
        }
        return true;
    }

    // Upload file, get firebase url and update file status in template
    private async uploadFile(newFile: File): Promise<string | null> {
        const file = this.fileList.find(el => el.fullName === newFile.name);
        if (!file) {
            return null;
        }
        const ext = file.ext;
        const name = file.name;
        const date = new Date().getTime();
        const storageFileName = `${name}___${newFile.size}___${date}.${ext}`;
        let url = '';

        if (!ext.length || !name.length) {
            this.matSnackbar.open(this.fileInputMsg.invalidFileName, 'Cerrar', { duration: 3000 });
            return null;
        }

        try {
            const storageRef = ref(this.storage, storageFileName);
            await uploadBytesResumable(storageRef, newFile);
            url = await getDownloadURL(storageRef);
        } catch (error) {
            this.commonSnackbarMsg.showErrorMessage();
            return null;
        }

        // Update file status
        if (!!url) {
            file.url = url;
            file.progress = 100;
            file.uploadCompleted = true;
        }

        // Return url for formcontrol
        return url;
    }

    public removeFile(index: number): void {
        this.fileList.splice(index, 1);
        this.form.controls.files.removeAt(index);
        this.form.updateValueAndValidity();
        // TODO: Delete file from firebase
    }

    public save(event: Event): any {
        event.preventDefault();
        if (this.isLoading || this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.isEditForm) {
            this.editPost();
        } else {
            this.createPost();
        }
    }

    private createPost(): void {
        this.isLoading = true;
        const userId = this.authService.getUserProfile()?.id;
        const files = this.form.controls.files.value!;
        if (this.form.valid && userId) {
            const postData: IPostForm = {
                user: userId,
                title: this.form.controls.title.value!,
                description: this.form.controls.description.value!,
                academic_level: this.form.controls.academicLevel.value!,
                axis: this.form.controls.axis.value!,
                main_file: files[0],
                suporting_material: files.length > 1 ? files.slice(1) : []
            };
            this.postsService.createPost(postData)
                .pipe(
                    catchError(() => {
                        this.commonSnackbarMsg.showErrorMessage();
                        this.isLoading = false;
                        return of();
                    }),
                    takeUntil(this.ngUnsubscribe$)
                )
                .subscribe(resp => {
                    if (resp) {
                        this.router.navigate(['/posts/view/', resp.id]);
                        this.matSnackbar.open('Publicación creada 🙌', 'Cerrar', { duration: 2000 });
                    } else {
                        this.commonSnackbarMsg.showErrorMessage();
                    }
                    this.isLoading = false;
                });
        }
    }

    private editPost(): void {
        this.isLoading = true;
        if (this.form.valid && !!this.post) {
            const postData: IPostForm = {
                title: this.form.controls.title.value!,
                description: this.form.controls.description.value!,
                academic_level: this.form.controls.academicLevel.value!,
                axis: this.form.controls.axis.value!
            };
            this.postsService.updatePostById(this.post.id, postData)
                .pipe(
                    catchError(() => {
                        this.commonSnackbarMsg.showErrorMessage();
                        this.isLoading = false;
                        return of();
                    }),
                    takeUntil(this.ngUnsubscribe$)
                )
                .subscribe(resp => {
                    if (resp) {
                        this.router.navigate(['/posts/view/', resp.id]);
                        this.matSnackbar.open('Publicación editada 🪄', 'Cerrar', { duration: 2000 });
                    } else {
                        this.commonSnackbarMsg.showErrorMessage();
                    }
                    this.isLoading = false;
                });
        }
    }

    private getAcademicLevels(): Observable<IAcademicLevel[]> {
        return this.postsService.getAcademicLevels()
            .pipe(
                tap(resp => {
                    this.academicLevels = resp;
                    this.isAcademicLevelsLoading = false;
                    this.filteredAcademicLevels = this.searchAcademicLevel.valueChanges.pipe(
                        startWith(''),
                        map(value => this.simpleFilter(value, this.academicLevels))
                    );
                })
            );
    }

    private getAxis(): Observable<ISubjectWithAxis[]> {
        return this.postsService.getSubjectWithAxis()
            .pipe(
                tap(resp => {
                    this.subjectWithAxis = resp;
                    this.isAxesLoading = false;
                    this.filteredSubjectAxis = this.searchAxis.valueChanges.pipe(
                        startWith(''),
                        map(value => this.groupFilter(value, this.subjectWithAxis))
                    );
                })
            );
    }

    // Utils
    private simpleFilter(
        inputText: string, simpleOptions: IAcademicLevel[]
    ): IAcademicLevel[] {
        inputText = this.normilizeText(inputText);
        return simpleOptions.filter(option => {
            const textNormalized = this.normilizeText(option.name);
            return textNormalized.includes(inputText);
        });
    }

    private groupFilter(
        inputText: string, optionGroups: ISubjectWithAxis[]
    ): ISubjectWithAxis[] {
        const results: ISubjectWithAxis[] = [];
        inputText = this.normilizeText(inputText);
        optionGroups.forEach(el => {
            const groupTextNormalized = this.normilizeText(el.name);
            const filteredOptions: IAxis[] = [];
            el.axis.forEach(option => {
                const optionTextNormalized = this.normilizeText(option.name);
                if (optionTextNormalized.includes(inputText)) {
                    filteredOptions.push(option);
                }
            });

            if (groupTextNormalized.includes(inputText)) {
                results.push(el);
            } else if (filteredOptions.length) {
                results.push(
                    { ...el, axis: filteredOptions }
                );
            }
        });
        return results;
    }

    private normilizeText(value: string): string {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
