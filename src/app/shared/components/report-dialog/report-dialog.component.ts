import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';

import { ReportType } from 'src/app/shared/models/report.model';
import { APIReportBody, ReportInput } from 'src/app/shared/models/report.model';

import { ReportService } from 'src/app/pages/posts/services/report.service';
import { CommonSnackbarMsgService } from '../../services/common-snackbar-msg.service';
import { inOutLeftAnimation, inOutRightAnimation } from '../../animations/animations';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss'],
    animations: [inOutLeftAnimation, inOutRightAnimation]
})
export class ReportDialogComponent {
    public form = new FormGroup({
        type: new FormControl<ReportType>(ReportType.POST, [Validators.required]),
        description: new FormControl<string | undefined>(undefined, [
            Validators.required,
            Validators.maxLength(1000),
            Validators.minLength(3)
        ])
    });

    public loading = false;
    public reportType = ReportType;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ReportInput,
        public dialogRef: MatDialogRef<ReportDialogComponent>,
        private reportService: ReportService,
        private matSnackBar: MatSnackBar,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {}

    public createReport(event: Event): any {
        event.preventDefault();
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loading = true;
        const reportData: APIReportBody = {
            report_type: this.form.controls.type.value!,
            user: this.data.userId,
            description: this.form.controls.description.value!,
            active: true,
            user_reported: this.data.post.user.id,
            post_reported: this.data.post.id
        };
        this.reportService.createReport(reportData)
            .pipe(
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.loading = false;
                    return of();
                })
            )
            .subscribe(() => {
                this.matSnackBar.open('Reporte enviado 👀', 'Cerrar', { duration: 2000 });
                this.loading = false;
                this.dialogRef.close();
            });
    }
}
