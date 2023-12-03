export type AnalyticsOverviewCard = {
    bgColor: string;
    headerTitle: string;
    contentText: string;
    iconBgColor?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    count?: number | string;
};

export interface ScoreAccordCardType extends InsightType {
    expanded: boolean;
    onClick: (data: any) => void;
}

export type OverallScoreType = {
    scores: InsightType[];
    backgroundColor?: string;
};

export type InsightType = {
    label: string;
    count: number;
    score: number;
    value: number;
    checked?: boolean;
    descArr: string[];
};

export type AnalyticsChartType = {
    data: any;
    options?: any;
    label: string;
};
