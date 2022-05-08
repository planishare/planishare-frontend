import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ReactionsService {
    private api_url = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // public createLike(): Observable<PostPageable> {
    //     const params: RealPostsQueryParams = {
    //         page: queryParams.page ?? 1,
    //         search: queryParams.search ?? '',
    //         user__id: queryParams.userId ?? '',
    //         academic_level__id: queryParams.academicLevel ?? '',
    //         axis__subject__id: queryParams.subject ?? '',
    //         axis__id: queryParams.axis ?? '',
    //         ordering: queryParams.ordering ?? ''
    //     };

    //     // TODO: remove this after implement interceptor
    //     const headers = {
    //         Authorization: 'Bearer ' + this.authService.accessToken$.value
    //     };
    //     if (!!this.authService.accessToken$.value) {
    //         return this.http.get<PostPageable>(this.api_url + '/posts/', {
    //             params,
    //             headers
    //         });
    //     }
    //     return this.http.get<PostPageable>(this.api_url + '/posts/', {
    //         params
    //     });
    // }
}
