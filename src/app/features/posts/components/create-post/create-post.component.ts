import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { getDownloadURL, ref, Storage, uploadBytesResumable, UploadTask, UploadTaskSnapshot } from '@angular/fire/storage';
import { FirebaseStorageService } from 'src/app/core/services/firebase-storage.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { catchError, forkJoin, map, Observable, of, startWith, tap } from 'rxjs';
import { PostsService } from 'src/app/core/services/posts.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { AcademicLevel, Axis, Subject } from 'src/app/core/types/posts.type';

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
    // TODO: Error handler
    // TODO: Just upload allowed files

    public form: FormGroup;
    public documentList: fileUploadInformation[] = [];

    public isLoading = true;
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

    public docTypes = {
        doc: ['doc','docm','docx','txt'],
        xls: ['csv','xlam','xls','xlsx','xml'],
        ppt: ['ppt','pptx']
    };

    constructor(
        private storage: Storage,
        private location: Location,
        private postsService: PostsService,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        this.form = new FormGroup(
            {
                title: new FormControl('', Validators.required),
                description: new FormControl(),
                academicLevel: new FormControl(null, Validators.required),
                subject: new FormControl(null, Validators.required),
                axis: new FormControl(null, Validators.required),
                documents: new FormArray([], [Validators.required, Validators.maxLength(5)])
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
            .subscribe(() => {
                this.prepareSelectsSearch();
            });
    }

    private prepareSelectsSearch(): void {
        this.filteredAcademicLevelsList = this.searchAcademicLevel.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value, this.academicLevelsList))
        );
        this.filteredSubjectList = this.searchSubject.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value, this.subjectList))
        );
        this.filteredAxesList = this.searchAxes.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value, this.axesList) as Axis[])
        );
    }

    public save(event: Event): void {
        event.preventDefault();
        console.log(this.form);
        // if (this.form.valid) {
        // }
    }

    public onFileSelected(event: Event): void {
        const files = Array.from((event.target as HTMLInputElement).files ?? []);
        if (!!files?.length && files?.length <= 5 && this.documentList?.length + files?.length <= 5) {
            files.forEach(file => {
                this.uploadFile(file);
            });
        } else {
            this.documentsControl.setErrors({ max: true });
        }
    }

    public onFileDroped(event: FileList): void {
        const files = Array.from(event);
        if (!!files?.length && files?.length <= 5 && this.documentList?.length + files?.length <= 5) {
            files.forEach(file => {
                this.uploadFile(file);
            });
        } else {
            this.documentsControl.setErrors({ max: true });
        }
    }

    // Upload file
    private async uploadFile(file: File): Promise<void> {
        const ext = file!.name.split('.').pop();
        const name = file!.name.split('.')[0];
        const date = new Date().getTime();
        const fileName = `${name}|${file.size}|${date}.${ext}`;
        const storageRef = ref(this.storage, `/posts/files/${fileName}`);

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
        if (doc) {
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
        if (this.getDocType(docUrl) === 'pdf') {
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
                tap(resp => this.academicLevelsList = resp),
                tap(() => this.isAcademicLevelsLoading = false)
            );
    }

    private getSubjects(): Observable<AcademicLevel[]> {
        return this.postsService.getSubjects()
            .pipe(
                tap(resp => this.subjectList = resp),
                tap(() => this.isSubjectsLoading = false)
            );
    }

    private getAxes(): Observable<AcademicLevel[]> {
        return this.postsService.getAxes()
            .pipe(
                tap(resp => this.axesList = resp),
                tap(() => this.isAxesLoading = false)
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
    public getDocType(docUrl: string): string {
        const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
        return docName[docName.length - 1];
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
