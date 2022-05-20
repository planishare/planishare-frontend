import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { getDownloadURL, ref, Storage, uploadBytesResumable, UploadTask, UploadTaskSnapshot } from '@angular/fire/storage';
import { FirebaseStorageService } from 'src/app/core/services/firebase-storage.service';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';
import { Router } from '@angular/router';

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
export class CreatePostComponent {
    public form: FormGroup;
    public documents: FormArray;
    public documentList: fileUploadInformation[] = [];

    public isLoading = true;
    public isAcademicLevelsLoading = true;
    public isSubjectsLoading = true;
    public isAxesLoading = true;

    public academicLevelsList: RoundedSelectSearchOption[] = [];
    public subjectList: RoundedSelectSearchOption[] = [];
    public axesList: RoundedSelectSearchOption[] = [];

    public docTypes = {
        doc: ['doc','docm','docx','txt'],
        xls: ['csv','xlam','xls','xlsx','xml'],
        ppt: ['ppt','pptx']
    };

    constructor(
        private storage: Storage,
        private router: Router
    ) {
        this.form = new FormGroup(
            {
                title: new FormControl(),
                description: new FormControl(),
                academicLevel: new FormControl(),
                subject: new FormControl(),
                axis: new FormControl()
            }
        );
        this.documents = new FormArray([
            new FormControl('', Validators.required)
        ]);
    }

    public onFileSelected(event: Event): void {
        const files = Array.from((event.target as HTMLInputElement).files ?? []);
        if (!!files?.length) {
            files.forEach(file => {
                this.uploadFile(file);
            });
        }
    }

    public onFileDroped(event: FileList): void {
        const files = Array.from(event);
        if (!!files?.length) {
            files.forEach(file => {
                this.uploadFile(file);
            });
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
        }
        console.log(`${file.name}: ${url}`, this.documentList);
    }

    public removeFile(doc: fileUploadInformation): void {
        this.documentList = this.documentList.filter(file => file.name !== doc.name);
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
        this.router.navigate(['..']);
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

    // Utils
    public getDocType(docUrl: string): string {
        const docName =  docUrl.split('/o/')[1].split('?')[0].split('.');
        return docName[docName.length - 1];
    }
}
