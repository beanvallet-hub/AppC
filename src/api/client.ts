import axios from 'axios';
import { env } from '../config/env';

export const axiosIns = axios.create({
    baseURL: env.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10_000,
});
