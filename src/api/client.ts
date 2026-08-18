import axios, { Axios } from 'axios';

let axiosPromise: Axios | null = null;

export function getAxios() {
    if (!axiosPromise) {
        axiosPromise = initializeAxios();
    }

    return axiosPromise;
}

function initializeAxios() {
    const backendApi = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return backendApi;
}
