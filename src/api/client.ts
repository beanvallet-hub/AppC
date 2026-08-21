import axios from 'axios';

import { API_URL } from '@env';

export const axiosIns = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
