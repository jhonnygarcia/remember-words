import { AxiosInstance, AxiosResponse } from 'axios';
import { helper } from '../common/helpers.function';

class AppService {
    constructor(private httpClient: AxiosInstance) { }

    async login(username: string, password: string): Promise<AxiosResponse> {
        const response = await this.httpClient.post('/auth/login', { username, password });
        return response;
    }
    async getWords(where: { search?: string, page?: number, perPage?: number }): Promise<AxiosResponse> {
        const query = helper.objToQueryString(where);
        const response = await this.httpClient.get(`/api/words?${query}`);
        return response;
    }
    async getUserConfig(): Promise<AxiosResponse> {
        return await this.httpClient.get('api/user-configs');
    }
    async saveUserConfig(payload: {
        remember_days: number,
        active: boolean,
        date: Date | string,
    }): Promise<AxiosResponse> {
        return await this.httpClient.post('api/user-configs', payload);
    }
}
export default AppService;