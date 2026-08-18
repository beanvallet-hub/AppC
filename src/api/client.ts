import axios, { Axios } from 'axios';
import {API_URL} from '../constants/static';

let axiosPromise: Axios | null = null;

export function getAxios() {
    if (!axiosPromise) {
        axiosPromise = initializeAxios();
    }

    return axiosPromise;
}

function initializeAxios() {
    console.log('Axios initialized');

    const backendApi = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return backendApi;
}
