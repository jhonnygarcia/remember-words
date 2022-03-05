import { environment } from '../environment';
import axios from 'axios';

export const createHttpClient = () => {
    const token = localStorage.getItem(environment.STORAGE_TOKEN);
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