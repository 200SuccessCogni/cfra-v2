import { mcCainTheme } from "../../styles/theme";
import { ecommerceReviewSource, socialReviewSource } from "../../constants/reviewSource.constant";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const mcCainConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location, filterTypes.product],
    reviewSource: [...baseConfig.reviewSource, ...ecommerceReviewSource, ...socialReviewSource],
    integration: [...ecommerceReviewSource, ...socialReviewSource],
    brandImg: "https://www.mccain.com/media/3879/mccain-foods-fries-on-plate.gif",
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