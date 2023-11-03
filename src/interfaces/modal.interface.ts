import { IReviewItem } from "./review.interface";

export interface IDateRangePicker {
    onDateSelect: (show: boolean, data?: any) => any;
}

export interface IReplyModal {
    show: boolean;
    title: string;
    rating?: number;
    description?: string;
    closeHandler: (show: boolean, data?: any) => any;
}
