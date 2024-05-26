import defaultTheme from "../../styles/theme";
import { BaseConfigType, filterTypes } from "../type";


export const baseConfig: BaseConfigType = {
    reviewSource: [
        { label: 'local', value: 'local' },
        { label: 'TrustPilot', value: 'trustpilot' },
    ],
    integration: [],
    filters: [filterTypes.location],
    theme: defaultTheme,
    brandImg: "https://marriott-hotels.marriott.com/wp-content/uploads/sites/9/2023/04/mhrs.1238136_2500x1875.jpg",
    brandTitle: "Sentiment 360 - Unleashing Insights, Elevating Experiences - Your Gateway to Comprehensive Feedback Management."
}