import axios, { Axios } from 'axios';

let axiosPromise: Axios | null = null;

export async function  getAxios() {
    if (!axiosPromise) {
        axiosPromise = await initializeAxios();
    }

    return axiosPromise;
}

async function initializeAxios() {
    const backendApi = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return backendApi;
}
