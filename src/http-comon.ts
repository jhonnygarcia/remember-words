import { environment } from './environment';
import axios from 'axios';

export const createHttpClient = (token?: string) => {
    const headers: any = {
        "Content-type": "application/json"
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }
    return axios.create({
        baseURL: `${environment.serverUri}`,
        headers: headers
    });
}