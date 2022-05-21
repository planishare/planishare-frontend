import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { getDownloadURL, ref, Storage, uploadBytesResumable, UploadTask, UploadTaskSnapshot } from '@angular/fire/storage';
import { FirebaseStorageService } from 'src/app/core/services/firebase-storage.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { catchError, forkJoin, map, Observable, of, startWith, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { AcademicLevel, Axis, PostForm, Subject } from 'src/app/core/types/posts.type';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

type fileUploadInformation = {
    name: string,
    ext: string,
    url: string,
    progress: number,
    isUploadComplete: boolean
};
@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
    // TODO: Add logic if subject is selected then filter axis

    public form: FormGroup;
    public documentList: fileUploadInformation[] = [];

    public isLoading = false;
    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isAxesLoading = true;

    public academicLevelsList: AcademicLevel[] = [];
    public subjectList: Subject[] = [];
    public axesList: Axis[] = [];

    public filteredAcademicLevelsList?: Observable<AcademicLevel[]>;
    public filteredSubjectList?: Observable<Subject[]>;
    public filteredAxesList?: Observable<Axis[]>;

    public searchAcademicLevel: FormControl;
    public searchSubject: FormControl;
    public searchAxes: FormControl;

    public maxFileSize = 3000000; // 4Mb
    public maxFilesMsg = 'Puedes subir máximo 5 archivos';
    public maxFileSizeMsg = `No puedes subir archivos que pesen más de ${this.maxFileSize / 1000000}MB`;
    public firstDocTypeMsg = 'El primer archivo debe ser pdf, doc, ppt o xls';

    // Allowed ext for main file
    public docTypes = ['pdf', 'doc','docm','docx','txt', 'csv','xlam','xls','xlsx','xml','ppt','pptx'];

    constructor(
        private storage: Storage,
        private location: Location,
        private postsService: PostsService,
        private authService: AuthService,
        private router: Router,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackbar: MatSnackBar
    ) {
        this.form = new FormGroup(
            {
                title: new FormControl('', Validators.required),
                description: new FormControl(),
                academicLevel: new FormControl(null, Validators.required),
                subject: new FormControl(null, Validators.required),
                axis: new FormControl(null, Validators.required),
                documents: new FormArray([], [Validators.required, Validators.maxLength(5), this.isFirstFileTypeAllowed.bind(this)])
            }
        );

        this.searchAcademicLevel = new FormControl();
        this.searchSubject = new FormControl();
        this.searchAxes = new FormControl();
    }

    public ngOnInit(): void {
        forkJoin([this.getAcademicLevels(), this.getSubjects(), this.getAxes() ])
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                })
            )
            .subscribe();
    }

    // Validates first doc have an allowed type
    private isFirstFileTypeAllowed(control: AbstractControl): any {
        console.log(control);
        const firstFileType = this.getDocTypeFromFirebaseUrl(control.value[0] ?? '');
        console.log(firstFileType);
        if (firstFileType && !this.docTypes.find(type => type === firstFileType)) {
            this.matSnackbar.open(this.firstDocTypeMsg, 'OK', { duration: 3000 });
            return { firstDocType: true };
        }
        return null;
    }

    public save(event: Event): any {
        event.preventDefault();

        // Validate all files uploaded
        if (this.documentsControl.length !== this.documentList.length) {
            return this.matSnackbar.open('Espera a que se suban todos los archivos', 'OK', { duration: 2000 });
        }

        const userId = this.authService.getUserProfile()?.id;
        console.log(this.form.valid, !this.isLoading, userId);
        if (this.form.valid && !this.isLoading && userId) {
            this.isLoading = true;
            const body: PostForm = {
                user: userId,
                title: this.titleControl.value,
                description: this.descriptionControl.value,
                image: 'https://image.slidesharecdn.com/ceciliaacosta-151125173652-lva1-app6892/85/planificacion-5-320.jpg?cb=1448473158', // TODO: Add upload img and add it here
                academic_level: this.academicLevelControl.value,
                axis: this.axisControl.value,
                main_file: this.documentsControl.value[0],
                suporting_material: this.documentsControl.value.slice(1, this.documentsControl.value.length)
            };
            console.log(body);
            this.postsService.createPost(body)
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
                        this.matSnackbar.open('Publicación creada con exito', 'Cerrar');
                    }
                    this.isLoading = false;
                });
        }
    }

    public onFileSelected(event: Event): any {
        const files = Array.from((event.target as HTMLInputElement).files ?? []);

        if (!!files?.length && this.documentList?.length + files?.length <= 5) {
            files.forEach(file => {
                console.log(file);
                if (file.size <= this.maxFileSize) {
                    this.uploadFile(file);
                } else {
                    this.matSnackbar.open(this.maxFileSizeMsg, 'OK', { duration: 3000 });
                    this.documentsControl.setErrors({ maxSize: true });
                }
            });
        } else {
            this.matSnackbar.open(this.maxFilesMsg, 'OK', { duration: 3000  });
            this.documentsControl.setErrors({ max: true });
        }
    }

    public onFileDroped(event: FileList): void {
        const files = Array.from(event);

        if (!!files?.length && this.documentList?.length + files?.length <= 5) {
            files.forEach(file => {
                console.log(file);
                if (file.size <= this.maxFileSize) {
                    this.uploadFile(file);
                } else {
                    this.matSnackbar.open(this.maxFileSizeMsg, 'OK', { duration: 3000 });
                    this.documentsControl.setErrors({ maxSize: true });
                }
            });
        } else {
            this.matSnackbar.open(this.maxFilesMsg, 'OK', { duration: 3000 });
            this.documentsControl.setErrors({ max: true });
        }
    }

    // Upload file
    private async uploadFile(file: File): Promise<void> {
        const ext = file!.name.split('.').pop();
        const name = file!.name.split('.')[0];
        const date = new Date().getTime();
        const fileName = `${name}__${file.size}__${date}.${ext}`;
        const storageRef = ref(this.storage, fileName);

        // Add file in documentList
        this.documentList.push({
            name: file.name,
            ext: ext ?? '',
            url: '',
            progress: 0,
            isUploadComplete: false
        });

        await uploadBytesResumable(storageRef, file);

        const url = await getDownloadURL(storageRef);
        const doc = this.documentList.find(doc => doc.name === file.name);
        if (!!doc && !!url) {
            doc.url = url;
            doc.progress = 100;
            doc.isUploadComplete = true;
            this.documentsControl.push(new FormControl(doc.url));
        }
        console.log(`${file.name}: ${url}`, this.documentList);
    }

    public removeFile(index: number): void {
        this.documentList.splice(index, 1);
        this.documentsControl.removeAt(index);
        // TODO: Delete file from firebase
    }

    public download(docUrl: string): void {
        if (this.getDocTypeFromFirebaseUrl(docUrl) === 'pdf') {
            window.open(docUrl, '_blank');
        } else {
            location.href = docUrl;
        }
    }

    public goBack(): void {
        this.location.back();
    }

    private getAcademicLevels(): Observable<AcademicLevel[]> {
        return this.postsService.getAcademicLevels()
            .pipe(
                tap(resp => {
                    this.academicLevelsList = resp;
                    this.isAcademicLevelsLoading = false;
                    this.filteredAcademicLevelsList = this.searchAcademicLevel.valueChanges.pipe(
                        startWith(''),
                        map(value => this.filter(value, this.academicLevelsList))
                    );
                })
            );
    }

    private getSubjects(): Observable<AcademicLevel[]> {
        return this.postsService.getSubjects()
            .pipe(
                tap(resp => {
                    this.subjectList = resp;
                    this.isSubjectsLoading = false;
                    this.filteredSubjectList = this.searchSubject.valueChanges.pipe(
                        startWith(''),
                        map(value => this.filter(value, this.subjectList))
                    );
                })
            );
    }

    private getAxes(): Observable<AcademicLevel[]> {
        return this.postsService.getAxes()
            .pipe(
                tap(resp => {
                    this.axesList = resp;
                    this.isAxesLoading = false;
                    this.filteredAxesList = this.searchAxes.valueChanges.pipe(
                        startWith(''),
                        map(value => this.filter(value, this.axesList) as Axis[])
                    );
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

    public get subjectControl() {
        return this.form.get('subject') as FormControl;
    }

    public get axisControl() {
        return this.form.get('axis') as FormControl;
    }

    public get documentsControl() {
        return this.form.get('documents') as FormArray;
    }

    // Utils
    public getDocTypeFromFirebaseUrl(docUrl: string): string {
        if (!!docUrl.length) {
            const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
            return docName[docName.length - 1];
        }
        return '';
    }

    private filter(
        searchValue: string,
        optionList: (AcademicLevel | Subject | Axis)[]): (AcademicLevel | Subject | Axis)[] {
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
}
