import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPageable } from '../../../shared/models/pageable.model';
import { APIPostsParams } from '../models/post-filter.model';
import { IPostDetail, IAcademicLevel, ISubject, IAxis, ISubjectWithAxis, IPostForm } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private academicLevels?: IAcademicLevel[];
    private subjects?: ISubject[];
    private axes?: IAxis[];
    private subjectWithAxes?: ISubjectWithAxis[];

    constructor(
        private http: HttpClient
    ) { }

    public getPosts(queryParams: APIPostsParams): Observable<IPageable<IPostDetail>> {
        // return of({
        //     "count": 11,
        //     "next": "http://planishare-backend-dev.onrender.com/api/protected/a/posts/?page=2",
        //     "previous": 'null',
        //     "results": [
        //         {
        //             "id": 5,
        //             "user": {
        //                 "id": 3,
        //                 "email": "fruzbustamante@gmail.com",
        //                 "first_name": "Francisca",
        //                 "last_name": "Ruz Bustamante",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": null
        //             },
        //             "title": "Cabios físicos y químicos",
        //             "description": "Explicar los cambios físicos y químicos de la materia con sus características y reversibilidad mediante una actividad practica.",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 7,
        //                 "name": "7mo Básico"
        //             },
        //             "axis": {
        //                 "id": 16,
        //                 "name": "Química",
        //                 "subject": {
        //                     "id": 2,
        //                     "name": "Ciencias Naturales"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Planificacion%207%C2%B0%20Basico%20Unidad%201%20Qu%C3%ADmica%20(camb___68027___1655847213664.docx?alt=media&token=e2b7db7c-367a-4fe6-b051-eeaf73608828",
        //             "suporting_material": [],
        //             "created_at": "2022-06-21T17:34:15.298752-04:00",
        //             "updated_at": "2022-07-22T15:34:53.401824-04:00",
        //             "total_likes": 4,
        //             "total_views": 9,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 10,
        //             "user": {
        //                 "id": 9,
        //                 "email": "marcelo.retamal18@gmail.com",
        //                 "first_name": "Marcelo",
        //                 "last_name": "Retamal",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": null
        //             },
        //             "title": "Countries and Cultures.",
        //             "description": "- Unidad: Countries, Cultures and \n    Customs.\n-  Escribir un breve párrafo relacionado a \n    culturas extranjeras.",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 8,
        //                 "name": "8vo Básico"
        //             },
        //             "axis": {
        //                 "id": 32,
        //                 "name": "Expresión escrita",
        //                 "subject": {
        //                     "id": 6,
        //                     "name": "Inglés"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/English%20Language%20Class___126063___1656525455639.docx?alt=media&token=cab8ab7f-993b-4b49-9639-7ad614abd323",
        //             "suporting_material": [],
        //             "created_at": "2022-06-29T14:05:17.615598-04:00",
        //             "updated_at": "2023-06-11T14:38:49.576816-04:00",
        //             "total_likes": 4,
        //             "total_views": 28,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 2,
        //             "user": {
        //                 "id": 2,
        //                 "email": "marilu.pucv@gmail.com",
        //                 "first_name": "Mariela",
        //                 "last_name": "Bustamante Estay",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": {
        //                     "id": 2739,
        //                     "name": "Escuela el Maitenal",
        //                     "institution_type": {
        //                         "id": 4,
        //                         "name": "Colegio"
        //                     }
        //                 }
        //             },
        //             "title": "Los incas",
        //             "description": "Clase los incas características",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 4,
        //                 "name": "4to Básico"
        //             },
        //             "axis": {
        //                 "id": 24,
        //                 "name": "Historia",
        //                 "subject": {
        //                     "id": 5,
        //                     "name": "Historia, Geografía y Ciencias Sociales"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/planificacion%20clase%201%20los%20incas___68608___1655751130563.doc?alt=media&token=73730195-3ba0-46f1-996a-b8a63bc5d7b6",
        //             "suporting_material": [],
        //             "created_at": "2022-06-20T14:52:16.968822-04:00",
        //             "updated_at": "2022-07-09T11:59:02.643491-04:00",
        //             "total_likes": 2,
        //             "total_views": 14,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 4,
        //             "user": {
        //                 "id": 3,
        //                 "email": "fruzbustamante@gmail.com",
        //                 "first_name": "Francisca",
        //                 "last_name": "Ruz Bustamante",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": null
        //             },
        //             "title": "Separación de mezclas homogéneas y heterogéneas",
        //             "description": "Clase de laboratorio: Objetivo Identificar los procesos de separación de mezclas homogéneas y heterogéneas mediante el trabajo practico.",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 7,
        //                 "name": "7mo Básico"
        //             },
        //             "axis": {
        //                 "id": 16,
        //                 "name": "Química",
        //                 "subject": {
        //                     "id": 2,
        //                     "name": "Ciencias Naturales"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Planificacion%207%C2%B0%20Basico%20Unidad%201%20Qu%C3%ADmica___68263___1655846475854.docx?alt=media&token=a5b65c49-2922-4892-85f6-cf8035ba2276",
        //             "suporting_material": [],
        //             "created_at": "2022-06-21T17:21:22.822720-04:00",
        //             "updated_at": "2023-02-14T12:51:25.761220-03:00",
        //             "total_likes": 4,
        //             "total_views": 10,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 9,
        //             "user": {
        //                 "id": 5,
        //                 "email": "macarena.torresgamboa@gmail.com",
        //                 "first_name": "Macarena Pia",
        //                 "last_name": "Torres Gamboa",
        //                 "education": null,
        //                 "institution": null
        //             },
        //             "title": "Radioteatro (Narrador y personaje)",
        //             "description": "Analizar relatos de terror en radioteatro e identificar la voz de los personajes.\nSe adjunta clase pdf y guión de radioteatro Dr. Mortis \"Un loco anda suelto\" Escuchar en youtube https://www.youtube.com/watch?v=ctR5p4XOoAw\nLa guerra de los mundos radioteatro: https://www.youtube.com/watch?v=SxaJGuIPxms&t=220s\nLa guerra de los mundos Los Simpson: https://www.youtube.com/watch?v=U-vhpEqnVFg",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 6,
        //                 "name": "6to Básico"
        //             },
        //             "axis": {
        //                 "id": 38,
        //                 "name": "Lectura",
        //                 "subject": {
        //                     "id": 8,
        //                     "name": "Lenguaje y Comunicación"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/clase%207%20Radioteatro___2767377___1655932624481.pdf?alt=media&token=ac33f43e-abfe-4526-85f0-a5b622a3a511",
        //             "suporting_material": [
        //                 "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Narrador%20personaje%20Dr%20Mortis___15301___1655932883272.docx?alt=media&token=b842927a-feca-4f04-b6e7-fa4c1f3479da"
        //             ],
        //             "created_at": "2022-06-22T17:21:29.912476-04:00",
        //             "updated_at": "2023-01-02T20:02:53.285520-03:00",
        //             "total_likes": 3,
        //             "total_views": 22,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 1,
        //             "user": {
        //                 "id": 2,
        //                 "email": "marilu.pucv@gmail.com",
        //                 "first_name": "Mariela",
        //                 "last_name": "Bustamante Estay",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": {
        //                     "id": 2739,
        //                     "name": "Escuela el Maitenal",
        //                     "institution_type": {
        //                         "id": 4,
        //                         "name": "Colegio"
        //                     }
        //                 }
        //             },
        //             "title": "Comparar fracciones",
        //             "description": "Planificación de clase: comparar fracciones amplificando y simplificando",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 5,
        //                 "name": "5to Básico"
        //             },
        //             "axis": {
        //                 "id": 44,
        //                 "name": "Números y operaciones",
        //                 "subject": {
        //                     "id": 10,
        //                     "name": "Matemática"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Planificacion%20AO7___85167___1655750974811.docx?alt=media&token=b2683972-a239-4a98-aca4-79db807c76c4",
        //             "suporting_material": [],
        //             "created_at": "2022-06-20T14:49:43.286664-04:00",
        //             "updated_at": "2022-09-07T18:40:25.966154-03:00",
        //             "total_likes": 4,
        //             "total_views": 24,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 6,
        //             "user": {
        //                 "id": 3,
        //                 "email": "fruzbustamante@gmail.com",
        //                 "first_name": "Francisca",
        //                 "last_name": "Ruz Bustamante",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": null
        //             },
        //             "title": "Estructura atómica",
        //             "description": "Clase: Teoría atómica, partículas subatómicas y tipos de átomos",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 8,
        //                 "name": "8vo Básico"
        //             },
        //             "axis": {
        //                 "id": 16,
        //                 "name": "Química",
        //                 "subject": {
        //                     "id": 2,
        //                     "name": "Ciencias Naturales"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Clase%20Estructura%20del%20%20atomo___616445___1655847646938.pdf?alt=media&token=c90acc8c-9e71-402e-90dd-bd59993fa0a2",
        //             "suporting_material": [],
        //             "created_at": "2022-06-21T17:41:10.102548-04:00",
        //             "updated_at": "2022-07-05T20:26:55.202662-04:00",
        //             "total_likes": 4,
        //             "total_views": 9,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 7,
        //             "user": {
        //                 "id": 4,
        //                 "email": "salvatierranav@gmail.com",
        //                 "first_name": "",
        //                 "last_name": "",
        //                 "education": null,
        //                 "institution": null
        //             },
        //             "title": "Planificacion Esc. de Voleibol - Octubre",
        //             "description": "Planificación Esc. de Voleibol Club Molina correspondiente al mes de octubre",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 8,
        //                 "name": "8vo Básico"
        //             },
        //             "axis": {
        //                 "id": 20,
        //                 "name": "Vida activa y saludable",
        //                 "subject": {
        //                     "id": 4,
        //                     "name": "Educación Física y Salud"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/2___419769___1655851245191.pdf?alt=media&token=c15914d4-25bd-4547-aacc-b536870eee4a",
        //             "suporting_material": [],
        //             "created_at": "2022-06-21T18:42:14.920578-04:00",
        //             "updated_at": "2022-09-07T18:42:20.032866-03:00",
        //             "total_likes": 4,
        //             "total_views": 13,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 8,
        //             "user": {
        //                 "id": 5,
        //                 "email": "macarena.torresgamboa@gmail.com",
        //                 "first_name": "Macarena Pia",
        //                 "last_name": "Torres Gamboa",
        //                 "education": null,
        //                 "institution": null
        //             },
        //             "title": "Taller de escritura",
        //             "description": "Taller de escritura creativa, temática del terror.\nFicha de escritura etapa de planificación.\nRúbrica analítica de evaluación de escritura.",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 6,
        //                 "name": "6to Básico"
        //             },
        //             "axis": {
        //                 "id": 37,
        //                 "name": "Escritura",
        //                 "subject": {
        //                     "id": 8,
        //                     "name": "Lenguaje y Comunicación"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/ficha___705551___1655932304452.pdf?alt=media&token=1d2e7c8f-1a41-4e87-ae20-806360fa4270",
        //             "suporting_material": [
        //                 "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/Ru%CC%81brica%20anali%CC%81tica___430130___1655932326946.pdf?alt=media&token=6e960f05-beb7-4f2e-837e-72ebd5316b0e"
        //             ],
        //             "created_at": "2022-06-22T17:13:57.405505-04:00",
        //             "updated_at": "2023-01-31T00:03:03.292003-03:00",
        //             "total_likes": 3,
        //             "total_views": 8,
        //             "already_liked": null
        //         },
        //         {
        //             "id": 3,
        //             "user": {
        //                 "id": 2,
        //                 "email": "marilu.pucv@gmail.com",
        //                 "first_name": "Mariela",
        //                 "last_name": "Bustamante Estay",
        //                 "education": {
        //                     "id": 2,
        //                     "name": "Docente"
        //                 },
        //                 "institution": {
        //                     "id": 2739,
        //                     "name": "Escuela el Maitenal",
        //                     "institution_type": {
        //                         "id": 4,
        //                         "name": "Colegio"
        //                     }
        //                 }
        //             },
        //             "title": "Nutrientes",
        //             "description": "Clase para analizar la cantidad de energía consumida y dieta",
        //             "image": 'null',
        //             "academic_level": {
        //                 "id": 5,
        //                 "name": "5to Básico"
        //             },
        //             "axis": {
        //                 "id": 32,
        //                 "name": "Expresión escrita",
        //                 "subject": {
        //                     "id": 6,
        //                     "name": "Inglés"
        //                 }
        //             },
        //             "main_file": "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/clase%20de%20ingles%20___50907___1655751526435.pdf?alt=media&token=4c215465-c3cd-43ff-878b-d455f6a703a0",
        //             "suporting_material": [
        //                 "https://firebasestorage.googleapis.com/v0/b/planishare.appspot.com/o/nutrients%20clase%20de%20ingles___455067___1655751526436.pdf?alt=media&token=11cda4f8-4f59-49a7-af28-2b9dd4284c29"
        //             ],
        //             "created_at": "2022-06-20T14:58:59.459150-04:00",
        //             "updated_at": "2022-07-08T22:55:47.914463-04:00",
        //             "total_likes": 4,
        //             "total_views": 17,
        //             "already_liked": null
        //         }
        //     ]
        // });
        return this.http.get<IPageable<IPostDetail>>(environment.planishare.protectedAnon + '/posts/', {
            params: { ...queryParams }
        });
    }

    public getLatestPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.planishare.protected + '/posts/latest/');
    }

    public getPopularPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.planishare.protected + '/posts/popular/');
    }

    public getMostLikedPosts(): Observable<IPostDetail[]> {
        return this.http.get<IPostDetail[]>(environment.planishare.protected + '/posts/most-liked/');
    }

    public getPostById(postId: number): Observable<IPostDetail> {
        return this.http.get<IPostDetail>(environment.planishare.protectedAnon + `/posts/${postId}/`);
    }

    public deletePostById(postId: number): Observable<IPostDetail> {
        return this.http.delete<IPostDetail>(environment.planishare.protected + `/posts/delete/${postId}/`);
    }

    public updatePostById(postId: number, postData: IPostForm): Observable<IPostDetail> {
        return this.http.patch<IPostDetail>(environment.planishare.protected + `/posts/update/${postId}/`, postData);
    }

    public createPost(postData: IPostForm): Observable<any> {
        return this.http.post(environment.planishare.protected + '/posts/create/', postData);
    }

    // Academic Level, Subjects and IAxis
    public getAcademicLevels(): Observable<IAcademicLevel[]> {
        if (!!!this.academicLevels) {
            return this.http.get<IAcademicLevel[]>(environment.planishare.public + '/academic-levels/').pipe(
                tap(data => this.academicLevels = data)
            );
        }
        return of(this.academicLevels);
    }

    public getSubjects(): Observable<ISubject[]> {
        if (!!!this.subjects) {
            return this.http.get<ISubject[]>(environment.planishare.public + '/subjects/').pipe(
                tap(data => this.subjects = data)
            );
        }
        return of(this.subjects);
    }

    public getAxes(): Observable<IAxis[]> {
        if (!!!this.axes) {
            return this.http.get<IAxis[]>(environment.planishare.public + '/axis/').pipe(
                tap(data => this.axes = data)
            );
        }
        return of(this.axes);
    }

    public getSubjectWithAxis(): Observable<ISubjectWithAxis[]> {
        if (!!!this.subjectWithAxes) {
            return this.http.get<ISubjectWithAxis[]>(environment.planishare.public + '/subjects-with-axis/').pipe(
                tap(data => this.subjectWithAxes = data)
            );
        }
        return of(this.subjectWithAxes);
    }
}
