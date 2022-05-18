import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoundedSelectSearchOption } from 'src/app/shared/types/rounded-select-search.type';

@Component({
    selector: 'app-create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
    public post = {
        "id": 2,
        "user": {
            "email": "mariela.bustamante@gmail.com",
            "first_name": "Mariela",
            "last_name": "Bustamante",
            "education": {
                "id": 2,
                "name": "Profesor"
            },
            "institution": {
                "id": 1,
                "name": "Escuela el Maitenal",
                "institution_type": {
                    "id": 1,
                    "name": "Colegio"
                }
            }
        },
        "title": "Planificación de 1ro básico - Geometría",
        "description": "Esta es una planificación de escritura de ejemplo (postman)",
        "image": "https://image.slidesharecdn.com/ceciliaacosta-151125173652-lva1-app6892/85/planificacion-5-320.jpg?cb=1448473158",
        "academic_level": {
            "id": 1,
            "name": "1ro Básico"
        },
        "axis": {
            "id": 1,
            "name": "Geometría",
            "subject": {
                "id": 1,
                "name": "Matemática"
            }
        },
        "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare-dev.appspot.com/o/plantilla_informepracticaformato.doc?alt=media&token=ee2be652-adc7-4249-823a-679556b0da9e",
        "suporting_material": [
            "https://firebasestorage.googleapis.com/v0/b/planishare-dev.appspot.com/o/Procedimiento%20de%20titulaci%C3%B3n%20y%20obtenci%C3%B3n%20de%20grado.pdf?alt=media&token=67509c41-c271-4e59-85eb-7321d3baf286",
            "https://firebasestorage.googleapis.com/v0/b/planishare-dev.appspot.com/o/ModeloSeguridad.xlsx?alt=media&token=1cfc2f34-27d3-4409-b474-0db5ac35ebc8",
            "https://firebasestorage.googleapis.com/v0/b/planishare-dev.appspot.com/o/Operaciones%20Esenciales%20en%20MongoDB.pptx?alt=media&token=71a71d0f-16ba-43fe-a738-1f0d77993e6a"
        ],
        "created_at": "2022-05-13T20:21:37.402586Z",
        "updated_at": "2022-05-17T04:35:08.794900Z",
        "likes": 2,
        "views": 7,
        "already_liked": null,
        "already_viewed": null
    };

    public form: FormGroup;
    public documents: FormArray;

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

    constructor() {
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

    public onFileDroped(event: Event): void {
        console.log(event);
    }

    public download(docUrl: string): void {
        if (this.getDocType(docUrl) === 'pdf') {
            window.open(docUrl, '_blank');
        } else {
            location.href = docUrl;
        }
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
