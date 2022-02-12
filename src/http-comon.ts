import { environment } from './environment';
import axios from 'axios';

export const createHttpClient = (accessToken?: string) => {
    const token = accessToken || localStorage.getItem(environment.keyTokenStorage)
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