import { Theme } from "@mui/material";
import { IResort } from "./resort.interface";
import { Iuser } from "./user.interface";

export interface IApp {
    theme: Theme;
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
    setTheme: (data: Theme) => undefined;
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
