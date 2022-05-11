import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

    public pdf = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/ER_Directorio_Oficial_EE_WEB.pdf?alt=media&token=a1c252ec-766a-4844-8d80-de913b7d09bc';
    public docx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Formulario-Inscripci%C3%B3n-de-Tesis.docx?alt=media&token=ca6883f2-e4ef-46d4-88f2-d251adb177c3';
    public doc = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/plantilla_informepracticaformato.doc?alt=media&token=5c4ed8f6-96fc-43be-aaac-5d7a39a75fdc';
    public pptx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Consultas%20a%20Documentos%20Anidados%20y%20Arreglos.pptx?alt=media&token=db8b8bbc-7967-4c42-88aa-37e0a65b356f';
    public xlsx = 'https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Buscador_Instituciones_2022%20(1).xlsx?alt=media&token=4efc7001-dc13-4c00-92f3-ad289ea1b35c';

    public post = {
        "id": 1,
        "user": {
            "email": "mariela.bustamante@gmail.com",
            "first_name": "Mariela",
            "last_name": "Bustamante",
            "education": {
                "id": 1,
                "name": "Profesor"
            },
            "institution": {
                "id": 2,
                "name": "Colegio Adventista de Molina",
                "institution_type": 1
            }
        },
        "title": "Planificación 2do básico de geometría",
        "description": "Esta es una planificación de geometría de ejemplo",
        "image": "https://i.calameoassets.com/191009031420-8f8e963e31351bd9cc0e720be370ac13/large.jpg",
        "academic_level": {
            "id": 2,
            "name": "2do Básico"
        },
        "axis": {
            "id": 2,
            "name": "Geometría",
            "subject": {
                "id": 1,
                "name": "Matemática"
            }
        },
        "main_file": "http://diposit.ub.edu/dspace/bitstream/2445/32363/1/Fundamentos%20de%20planificaci%C3%B3n.pdf",
        "suporting_material": [
            "asdasd"
        ],
        "created_at": "2022-05-07T04:20:35.866069Z",
        "updated_at": "2022-05-07T04:20:35.867071Z",
        "likes": 1,
        "downloads": 0,
        "is_liked": null
    };
}
