import { CreateEditWordDto, SaveConfigDto, WherePagedDto } from './parameters';
import { AxiosInstance, AxiosResponse } from 'axios';
import { helper } from '../common/helpers.function';

class AppService {
    constructor(private httpClient: AxiosInstance) { }

    async userProfile(): Promise<AxiosResponse> {
        return await this.httpClient.get('/auth/userinfo');
    }
    async logout(): Promise<AxiosResponse> {
        const response = await this.httpClient.get('/auth/logout');
        return response;
    }
    async login(username: string, password: string): Promise<AxiosResponse> {
        return await this.httpClient.post('/auth/login', { username, password });
    }
    async getWords(where: WherePagedDto): Promise<AxiosResponse> {
        const query = helper.objToQueryString(where);
        const response = await this.httpClient.get(`/api/words?${query}`);
        return response;
    }
    async getWord(wordId: string): Promise<AxiosResponse> {
        return await this.httpClient.get(`/api/words/${wordId}`);
    }
    async getUserConfig(): Promise<AxiosResponse> {
        return await this.httpClient.get('api/user-configs');
    }
    async addWord(param: CreateEditWordDto): Promise<AxiosResponse> {
        return await this.httpClient.post('api/words', param);
    }
    async removeWord(wordId: string): Promise<AxiosResponse> {
        return await this.httpClient.delete(`/api/words/${wordId}`);
    }
    async editWord(wordId: string, param: CreateEditWordDto): Promise<AxiosResponse> {
        return await this.httpClient.put(`api/words/${wordId}`, param);
    }
    async saveUserConfig(payload: SaveConfigDto): Promise<AxiosResponse> {
        return await this.httpClient.post('api/user-configs', payload);
    }
}
export default AppService;