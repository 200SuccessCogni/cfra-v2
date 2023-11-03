export interface IReviewItem {
    category?: "evaluate" | "neutral" | "positive" | "negative";
    city?: string;
    country?: string;
    cusCity?: string;
    cusCountry?: string;
    cusName?: string;
    cusStat?: string;
    date: string;
    desc?: string;
    isActioned?: boolean;
    locationId: string;
    locationName: string;
    isSeen?: boolean;
    rating?: number;
    replyMessage?: string;
    // resortId: string;
    // resortName: string;
    sentimentMagnitude?: number;
    sentimentScore?: number;
    source: string;
    state?: string;
    title: string;
    upVote?: number;
    userId?: string;
    id?: string;
    listView?: boolean;
}
