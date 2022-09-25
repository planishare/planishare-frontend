import { ReportType } from "../../shared/enums/report.enum";

export type ReportForm = {
    report_type: ReportType,
    user: number,
    description: string,
    active: true,
    user_reported?: number,
    post_reported?: number
}
