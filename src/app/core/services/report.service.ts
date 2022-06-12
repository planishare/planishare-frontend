import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Report } from '../types/report.type';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(
        private http: HttpClient
    ) { }

    public createReport(report: Report): Observable<any> {
        return this.http.post(environment.apiUrl + '/report/create/', report);
    }
}
