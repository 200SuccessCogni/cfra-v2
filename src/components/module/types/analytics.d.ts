export type AnalyticsOverviewCard = {
    bgColor: string;
    headerTitle: string;
    contentText: string;
    iconBgColor?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    count?: number | string;
};

export type OverallScoreType = {
    scores: { label: string; value: number; summary: string }[];
    backgroundColor?: string;
};

export type AnalyticsChartType = {
    data: any;
    options?: any;
    label: string;
};
