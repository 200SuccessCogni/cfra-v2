import { marriottTheme } from "../../styles/theme";
import { hotelReviewSource, socialReviewSource } from "../reviewSource";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const marriotConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location],
    reviewSource: [...baseConfig.reviewSource, ...hotelReviewSource, ...socialReviewSource],
    integration: [...hotelReviewSource, ...socialReviewSource],
    theme: marriottTheme,
    business: {
        businessId: "1289112891",
        businessName: "Marriott",
        address: "Bethesda, Maryland, United States",
        businessUrl: "marriott.com",
        domain: "marriott.com",
        country: "United States"
    }
}

