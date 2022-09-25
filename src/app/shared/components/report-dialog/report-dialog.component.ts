import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';
import { ReportType, ReportTypeName } from 'src/app/shared/enums/report.enum';
import { ReportService } from 'src/app/core/services/report.service';
import { ReportForm } from 'src/app/core/types/report.type';
import { CommonSnackbarMsgService } from '../../services/common-snackbar-msg.service';

@Component({
    selector: 'app-report-dialog',
    templateUrl: './report-dialog.component.html',
    styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent {

    public form: FormControl;
    public reportTypeName?: ReportTypeName;
    public isLoading = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ReportForm,
        public dialogRef: MatDialogRef<ReportDialogComponent>,
        private reportService: ReportService,
        private matSnackBar: MatSnackBar,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        this.form = new FormControl(null, [Validators.required, Validators.maxLength(1000)]);
        switch (this.data.report_type) {
            case ReportType.USER_REPORT:
                this.reportTypeName = ReportTypeName.USER_REPORT;
                break;
            case ReportType.POST_REPORT:
                this.reportTypeName = ReportTypeName.POST_REPORT;
                break;
        }
    }

    public createReport(): void {
        this.isLoading = true;
        if (this.form.valid) {
            const reportData: ReportForm = {
                ...this.data,
                description: this.form.value
            };
            this.reportService.createReport(reportData)
                .pipe(
                    catchError(error => {
                        this.commonSnackbarMsg.showErrorMessage();
                        return of(null);
                    })
                )
                .subscribe(resp => {
                    if (!!resp) {
                        this.matSnackBar.open('Reporte enviado, gracias! :)', 'Cerrar', { duration: 2000 });
                    }
                    this.dialogRef.close();
                });
        }
    }
}
