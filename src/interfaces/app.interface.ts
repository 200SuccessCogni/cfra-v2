import { CompanyWiseConfigType } from "../config/type";
import { IResort } from "./resort.interface";
import { Iuser } from "./user.interface";


export interface IApp {
    config: ConfigType;
    currentPage: string;
    loader: boolean;
    user: Iuser | null;
    alert: IAlert;
    resortList: any[];
    productList: any[];
    selectedDateRange: any;
    selectedLocation: any;
    selectedProduct: any;
    allReviews: any[];
    setSelectedDateRange: (data: any) => undefined;
    setSelectedLocation: (data: any) => undefined;
    setSelectedProduct: (data: any) => undefined;
    setLoader: (data: boolean) => undefined;
    setUser: (data: any) => undefined;
    setResort: (data: IResort[]) => undefined;
    setProducts: (data: any) => undefined;
    setALLReviews: (data: any[]) => undefined;
    setAlert: (data: IAlert) => undefined;
    setConfig: (data: ConfigType) => undefined;
}

export interface INotification {
    open: boolean;
    anchorEl: any;
    handleClose: () => void;
}

export interface IAlert {
    show: boolean;
    title: string;
    message: string;
}

export interface ConfigType extends CompanyWiseConfigType {
    others?: any;
} 

export enum CompanyNameTypes {
    marriott = "marriott",
    pji = "pji", // Papa Johns
    mcd = "mcd", // mcd
    kohler = "kohler",
    mccain = "mccain",
    whitbread = 'whitebread'
}
