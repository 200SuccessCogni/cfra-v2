import { mcdTheme } from "../../styles/theme";
import { hotelReviewSource, socialReviewSource } from "../../constants/reviewSource.constant";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const mcdConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location],
    reviewSource: [...baseConfig.reviewSource, ...hotelReviewSource, ...socialReviewSource],
    integration: [...hotelReviewSource, ...socialReviewSource],
    theme: mcdTheme,
    business: {
        businessId: "1289112891",
        businessName: "MCD",
        address: "Bethesda, Maryland, United States",
        businessUrl: "mcd.com",
        domain: "mcd.com",
        country: "United States"
    }
}

