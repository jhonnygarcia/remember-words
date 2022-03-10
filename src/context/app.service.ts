import { CreateEditWordDto, SaveConfigDto, WherePagedDto } from './parameters';
import { AxiosInstance, AxiosResponse } from 'axios';
import { helper } from '../common/helpers.function';
import { createHttpClient } from '../common/http-comon';
import { LoginDto, RegisterDto, UpdateUserDto, UsersWherePagedDto } from '../dto';
import { userTokenStorage } from '../hooks';

class AppService {
    httpClient: AxiosInstance;
    constructor() {
        this.httpClient = createHttpClient();
    }
    async userProfile(): Promise<AxiosResponse> {
        const token = userTokenStorage.getTokenStorage();
        if (token) {
            return await this.httpClient
                .get('/auth/userinfo', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    userTokenStorage.setStorage({ user: res.data });
                    return res;
                })
                .catch((error) => {
                    userTokenStorage.cleanStorage();
                    return Promise.reject(error);
                });
        } else {
            return await this.httpClient.get('/auth/userinfo').catch((error) => {
                userTokenStorage.cleanStorage();
                return Promise.reject(error);
            });
        }
    }
    async logout(): Promise<AxiosResponse> {
        const response = await this.httpClient.get('/auth/logout').then((res) => {
            userTokenStorage.cleanStorage();
            return res;
        });
        return response;
    }
    async login(data: LoginDto): Promise<AxiosResponse> {
        return await this.httpClient
            .post('/auth/login', data)
            .then((res) => {
                const { user, accessToken } = res.data;
                userTokenStorage.setStorage({ user, accessToken });
                return res;
            })
            .catch((error) => {
                userTokenStorage.cleanStorage();
                return Promise.reject(error);
            });
    }
    async register(data: RegisterDto) {
        return await this.httpClient.post('/auth/create-free', data);
    }
    async getWords(where: WherePagedDto): Promise<AxiosResponse> {
        const query = helper.objToQueryString(where);
        const response = await this.httpClient.get(`/api/words?${query}`);
        return response;
    }
    async getNotifications(where: WherePagedDto): Promise<AxiosResponse> {
        const query = helper.objToQueryString(where);
        const response = await this.httpClient.get(`/api/notifications?${query}`);
        return response;
    }
    async getNotification(id: string): Promise<AxiosResponse> {
        const response = await this.httpClient.get(`/api/notifications/${id}`);
        return response;
    }
    async brandShowNotification(id: string): Promise<AxiosResponse> {
        const response = await this.httpClient.post(`/api/notifications/${id}/brand-show`, {});
        return response;
    }
    async getUsers(where: UsersWherePagedDto): Promise<AxiosResponse> {
        const query = helper.objToQueryString(where);
        const response = await this.httpClient.get(`/api/users?${query}`);
        return response;
    }
    async getUser(id: string): Promise<AxiosResponse> {
        const response = await this.httpClient.get(`/api/users/${id}`);
        return response;
    }
    async setActiveUser(id: string, active: boolean): Promise<AxiosResponse> {
        const response = await this.httpClient.post('/auth/set-active', { id, active });
        return response;
    }
    async pushNotify(userId: string, title: string, message: string): Promise<AxiosResponse> {
        const response = await this.httpClient.post(`/api/users/${userId}/send-notify`, { title, message });
        return response;
    }

    async deleteNotification(id: string): Promise<AxiosResponse> {
        const response = await this.httpClient.delete(`/api/notifications/${id}`);
        return response;
    }

    async pushAllNotify(title: string, message: string): Promise<AxiosResponse> {
        const response = await this.httpClient.post('/api/send-notify', { title, message });
        return response;
    }
    async forgot(email: string, captcha: string): Promise<AxiosResponse> {
        const response = await this.httpClient.post('/auth/forgot', { email, captcha });
        return response;
    }
    async getActivateKey(activateKey: string): Promise<AxiosResponse> {
        const response = await this.httpClient.get(`/auth/activate-key/${activateKey}`);
        return response;
    }
    async changePassword(password: string, activate_key: string): Promise<AxiosResponse> {
        const response = await this.httpClient.post('/auth/change-pwd', { password, activate_key });
        return response;
    }
    async updateUser(id: string, data: UpdateUserDto): Promise<AxiosResponse> {
        const response = await this.httpClient.put(`/api/users/${id}`, data);
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

export const useAppService = () => {
    return new AppService();
};
