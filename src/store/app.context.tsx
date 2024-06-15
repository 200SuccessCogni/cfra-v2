import { Iuser } from "../interfaces/user.interface";
import { ConfigType, IAlert, IApp } from "../interfaces/app.interface";
import { IResort } from "../interfaces/resort.interface";
import { useContext, useReducer, createContext } from "react";
import theme from "../styles/theme";
import { mccainProducts, pjiProducts } from "../constants/app.constant";
import { baseConfig } from "../config/index";

const initAppData: IApp = {
    config: baseConfig,
    currentPage: "",
    loader: false,
    user: null,
    alert: {
        title: "",
        message: "",
        show: false,
    },
    resortList: [],
    productList: [...pjiProducts],
    selectedDateRange: null,
    selectedLocation: null,
    selectedProduct: null,
    allReviews: [],
    setConfig: (config: ConfigType) => undefined,
    setSelectedDateRange: (data: any) => undefined,
    setSelectedLocation: (data: IResort) => undefined,
    setSelectedProduct: (data: any) => undefined,
    setLoader: (data: boolean) => undefined,
    setUser: (data: any) => undefined,
    setResort: (data: IResort[]) => undefined,
    setProducts: (data: any) => undefined,
    setALLReviews: (data: any[]) => undefined,
    setAlert: (data: IAlert) => undefined,
};

const appReducer = (prevState: any, action: any) => {
    if (action.type === "SET_SELECTED_DATE_RANGE") {
        return { ...prevState, selectedDateRange: action.data };
    } else if (action.type === "SET_SELECTED_LOCATION") {
        return { ...prevState, selectedLocation: action.data };
    } else if (action.type === "SET_SELECTED_PRODUCT") {
        return { ...prevState, selectedProduct: action.data };
    } else if (action.type === "SET_LOADER") {
        return { ...prevState, loader: action.data };
    } else if (action.type === "SET_RESORT") {
        return { ...prevState, resortList: action.data };
    } else if (action.type === "SET_PRODUCT") {
        return { ...prevState, productList: action.data };
    } else if (action.type === "SET_USER") {
        return { ...prevState, user: action.data };
    } else if (action.type === "SET_ALL_REVIEWS") {
        return { ...prevState, allReviews: action.data };
    } else if (action.type === "SET_ALERT") {
        return { ...prevState, alert: action.data };
    } else if (action.type === "SET_CONFIG") {
        return { ...prevState, config: action.data };
    } else return initAppData;
};

const AppContext = createContext(initAppData);

export const AppContextProvidor = (props: any) => {
    const [appState, appDispatch] = useReducer(appReducer, initAppData);

    const setConfig = (data: ConfigType) => {
        appDispatch({ type: "SET_CONFIG", data });
    };

    const setLoader = (data: boolean) => {
        appDispatch({ type: "SET_LOADER", data });
    };

    const setSelectedDateRange = (data: any) => {
        appDispatch({ type: "SET_SELECTED_DATE_RANGE", data });
    };

    const setSelectedLocation = (data: any) => {
        // console.log({ data });
        appDispatch({ type: "SET_SELECTED_LOCATION", data });
    };

    const setSelectedProduct = (data: any) => {
        // console.log({ data });
        appDispatch({ type: "SET_SELECTED_PRODUCT", data });
    };

    const setUser = (data: Iuser) => {
        appDispatch({ type: "SET_USER", data });
    };

    const setResort = (data: any[]) => {
        // console.log({ data });
        appDispatch({ type: "SET_RESORT", data });
    };

    const setProducts = (data: any[]) => {
        // console.log({ data });
        appDispatch({ type: "SET_PRODUCT", data });
    };

    const setALLReviews = (data: any[]) => {
        appDispatch({ type: "SET_ALL_REVIEWS", data });
    };

    const setAlert = (data: IAlert) => {
        appDispatch({ type: "SET_ALERT", data });
    };

    const reset = () => {
        appDispatch({
            type: "RESET",
            data: {
                ...initAppData,
            },
        });
    };

    return (
        <AppContext.Provider
            value={{
                ...appState,
                setSelectedDateRange,
                setSelectedLocation,
                setSelectedProduct,
                setLoader,
                setUser,
                setResort,
                setProducts,
                reset,
                setALLReviews,
                setAlert,
                setConfig,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default function useApp() {
    const appCtx = useContext(AppContext);

    if (!appCtx) {
        throw new Error("useAuth must be used within AppProvider");
    }

    return appCtx;
}
