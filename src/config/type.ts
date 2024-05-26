interface reviewSourceType {
    label: string;
    value: string;
    imgSrc?: string;
}

export enum filterTypes {
    location = 'location',
    product = 'product'
}

interface IntegrationType extends reviewSourceType{
    label: string;
    desc?: string;
}


export interface BaseConfigType {
    reviewSource: reviewSourceType[],
    integration: IntegrationType[],
    filters: filterTypes[],
    theme: any;
    brandTitle: string;
    brandImg: string;
}

export interface CompanyWiseConfigType extends BaseConfigType {
    business?: any;
}