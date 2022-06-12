import { ReportType } from "../enums/report.enum";

export type Report = {
    report_type: ReportType,
    user: number,
    description: string,
    active: true,
    user_reported?: number,
    post_reported?: number
}
