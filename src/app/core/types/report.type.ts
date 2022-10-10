import { ReportType } from "../../shared/enums/report.enum";
import { PostDetail } from "../models/post.model";

export type APIReportBody = {
    report_type: ReportType,
    user: number,
    description: string,
    active: true,
    user_reported?: number,
    post_reported?: number
}

export type ReportInput = {
    post: PostDetail,
    userId: number
}
