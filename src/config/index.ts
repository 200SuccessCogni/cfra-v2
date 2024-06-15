import { CompanyNameTypes } from "../interfaces/app.interface";
import { kohlerConfig } from "./company-configs/kohler";
import { marriotConfig } from "./company-configs/marriott";
import { mcdConfig } from "./company-configs/mcd";
import { whitBreadConfig } from "./company-configs/whitBread";
import { mcCainConfig } from "./company-configs/mcCain";
import { pjiConfig } from "./company-configs/pji";
export { baseConfig } from "./company-configs/baseConfig";
import { CompanyWiseConfigType } from "./type";


export default function getConfig(company: CompanyNameTypes): CompanyWiseConfigType {
    if(company === CompanyNameTypes.marriott) {
        return marriotConfig;
    } else if(company === CompanyNameTypes.pji) {
        return pjiConfig;
    } else if(company === CompanyNameTypes.kohler) {
        return kohlerConfig;
    } else if(company === CompanyNameTypes.mccain) {
        return mcCainConfig;
    } else if(company === CompanyNameTypes.mcd) {
        return mcdConfig;
    } else if(company === CompanyNameTypes.whitbread) {
        return whitBreadConfig;
    } else {
        return baseConfig;
    }
}

