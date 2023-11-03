import { IResort } from "./resort.interface";
import { Iuser } from "./user.interface";

export interface IApp {
    theme: string;
    currentPage: string;
    loader: boolean;
    user: Iuser | null;
    alert: IAlert;
    resortList: any[];
    selectedDateRange: any;
    selectedLocation: any;
    allReviews: any[];
    setSelectedDateRange: (data: any) => undefined;
    setSelectedLocation: (data: any) => undefined;
    setLoader: (data: boolean) => undefined;
    setUser: (data: any) => undefined;
    setResort: (data: IResort[]) => undefined;
    setALLReviews: (data: any[]) => undefined;
    setAlert: (data: IAlert) => undefined;
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
