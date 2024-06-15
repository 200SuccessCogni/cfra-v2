import { kohlerTheme } from "../../styles/theme";
import { ecommerceReviewSource, socialReviewSource } from "../../constants/reviewSource.constant";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const pjiConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location, filterTypes.product],
    reviewSource: [...baseConfig.reviewSource, ...ecommerceReviewSource, ...socialReviewSource],
    integration: [...ecommerceReviewSource, ...socialReviewSource],
    theme: kohlerTheme,
    brandImg: 'pji.jpeg',
    business: {
        businessId: "909090910",
        businessName: "Papa Johns",
        address: "Louisville, United states",
        businessUrl: "papajohns.com",
        domain: "papajohns.com",
        country: "United States"
    }
}
