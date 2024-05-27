import defaultTheme from "../../styles/theme";
import { hotelReviewSource, socialReviewSource } from "../../constants/reviewSource.constant";
import { CompanyWiseConfigType, filterTypes } from "../type";
import { baseConfig } from "./baseConfig";

export const whitBreadConfig: CompanyWiseConfigType = {
    ...baseConfig,
    filters: [filterTypes.location],
    reviewSource: [...baseConfig.reviewSource, ...hotelReviewSource, ...socialReviewSource],
    integration: [...hotelReviewSource, ...socialReviewSource],
    theme: defaultTheme,
    brandImg: "https://cdn.whitbread.co.uk/media/2021/02/21104913/hub-slide-2.jpg",
    brandTitle: "We’re hospitality experts, running some of the UK’s most-loved brands and operating over 900 hotels across the UK and Germany as well as some of the UK’s favourite restaurant chains.",
    business: {
        businessId: "1289112891",
        businessName: "Whitbread",
        address: "Dunstable, United Kingdom",
        businessUrl: "https://www.whitbread.co.uk/",
        domain: "https://www.whitbread.co.uk/",
        country: "United Kingdom"
    }
}

