import { kohlerTheme } from "../../styles/theme";
import { ecommerceReviewSource, socialReviewSource } from "../reviewSource";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const kohlerConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location, filterTypes.product],
    reviewSource: [...baseConfig.reviewSource, ...ecommerceReviewSource, ...socialReviewSource],
    integration: [...ecommerceReviewSource, ...socialReviewSource],
    theme: kohlerTheme,
    brandImg: 'bg-kohler.png',
    brandTitle: `Kohler is your one stop destination for luxury
                sanitaryware, bathroom fittings, wash basin, bathtubs
                showers etc`,
    business: {
        businessId: "909090909",
        businessName: "Kohler",
        address: "Kohler, Wisconsin, United states",
        businessUrl: "kohler.com",
        domain: "kohler.com",
        country: "United States"
    }
}