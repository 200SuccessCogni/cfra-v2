import { mcCainTheme } from "../../styles/theme";
import { ecommerceReviewSource, socialReviewSource } from "../reviewSource";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const mcCainConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location, filterTypes.product],
    reviewSource: [...baseConfig.reviewSource, ...ecommerceReviewSource, ...socialReviewSource],
    integration: [...ecommerceReviewSource, ...socialReviewSource],
    theme: mcCainTheme,
    business: {
        businessId: "191919191",
        businessName: "McCain",
        address: "Toronto, Canada",
        businessUrl: "mcCain.com",
        domain: "mcCain.com",
        country: "Canada"
    }
}