import defaultTheme from "../../styles/theme";
import { hotelReviewSource, socialReviewSource } from "../reviewSource";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const whitBreadConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location],
    reviewSource: [...baseConfig.reviewSource, ...hotelReviewSource, ...socialReviewSource],
    integration: [...hotelReviewSource, ...socialReviewSource],
    theme: defaultTheme,
    business: {
        businessId: "1289112891",
        businessName: "Whitbread",
        address: "Dunstable, United Kingdom",
        businessUrl: "https://www.whitbread.co.uk/",
        domain: "https://www.whitbread.co.uk/",
        country: "United Kingdom"
    }
}

