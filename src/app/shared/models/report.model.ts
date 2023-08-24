import { PostDetail } from "../../pages/posts/models/post.model";
import { ReportType } from "./report.enum";

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
