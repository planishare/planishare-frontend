import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIReportBody } from '../../../shared/types/report.type';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(
        private http: HttpClient
    ) { }

    public createReport(report: APIReportBody): Observable<any> {
        return this.http.post(environment.planishare.protected + '/report/create/', report);
    }
}
