import { AxiosInstance } from 'axios';
import AppService from '../../context/app.service';
import { TokenUserIdentity } from './identity-info';

export interface IWordContext {
    userToken: TokenUserIdentity | null;
    httpClient: AxiosInstance;
    appService: AppService;
    setUserToken: (userToken: TokenUserIdentity | null) => void;
    getToken: () => string | null;
}