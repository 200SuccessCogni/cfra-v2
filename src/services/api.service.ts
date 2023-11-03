import axios from "axios";

const axiosConfig = {
    baseURL: import.meta.env.DEV
        ? "http://localhost:4000/api/v1.0/"
        : import.meta.env.VITE_API_BASE_URL,
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

const axiosClient = axios.create(axiosConfig);

// Add token in headers
axiosClient.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Token ${token}`;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token;

    return config;
});

function erroHandler(error: any) {
    const errMsg = {
        message: "",
        data: "",
    };
    if (error.message) {
        errMsg.message = error.message;
    }
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        if (error.response.data) {
            errMsg.data =
                error.response.data?.detail || "Something went wrong!";
            return Promise.reject(errMsg);
        }
        // console.log(error.response.data);
        // console.log(error.response.status);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request);
        errMsg.data = "No response from server";
        return Promise.reject(errMsg);
    } else {
        // Something happened in setting up the request that triggered an Error
        // console.log("Error", error.message);
        errMsg.data = "No response from server";
        return Promise.reject(errMsg);
    }
}
/**
 * Axios Get request
 * @param {string} URL
 * @param {any} payload
 * @returns Promise
 */
export function GET(URL: string, configs?: any) {
    let getConfigs;
    if (configs) getConfigs = { url: URL, method: "GET", ...configs };
    return axiosClient
        .get(getConfigs ? getConfigs : `${URL}`)
        .then((response) => response);
}

/**
 * Axios Post request
 * @param {string} URL
 * @param {any} payload
 * @returns Promise
 */
export function POST(URL: string, payload: any) {
    return axiosClient
        .post(`${URL}`, payload)
        .then((response) => response)
        .catch((err) => erroHandler(err));
}
/**
 * Axios Put request
 * @param {string} URL
 * @param {any} payload
 * @returns Promise
 */
export function PUT(URL: string, payload: any) {
    return axiosClient
        .put(`${URL}`, payload)
        .then((response) => response)
        .catch((err) => erroHandler(err));
}
/**
 * Axios Patch request
 * @param {string} URL
 * @param {any} payload
 * @returns Promise
 */
export function PATCH(URL: string, payload: any) {
    return axiosClient
        .patch(`${URL}`, payload)
        .then((response) => response)
        .catch((err) => erroHandler(err));
}

/**
 * Axios Delete request
 * @param {string} URL
 * @returns Promise
 */
export function DELETE(URL: string) {
    return axiosClient
        .delete(`${URL}`)
        .then((response) => response)
        .catch((err) => erroHandler(err));
}
/**
 * Axios multiple get requests
 * @param  {...any} urls [string]
 * @returns Promise
 */
export function MULTIPLE_GET(...urls: [string]) {
    return Promise.all(urls.map((e) => axios.get(e)))
        .then((response) => response)
        .catch((err) => erroHandler(err));
}
