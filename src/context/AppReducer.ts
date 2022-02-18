import { IWordContext } from "../common/dto/context.dto";
import { TokenUserIdentity } from "../common/dto/identity-info";
import { environment } from "../environment";
import { createHttpClient } from '../http-comon';
import AppService from "./app.service";

type WORDS_ACTIONS = 'SET_TOKEN';

const axiosInstance = createHttpClient();

export const initialState = {
    userToken: null,
    httpClient: axiosInstance,
    appService: new AppService(axiosInstance),
    setUserToken: (userToken: TokenUserIdentity | null) => { },
    getToken: () => null
};

export const appReducer = (state: IWordContext, action: { type: WORDS_ACTIONS, payload: any }) => {
    switch (action.type) {
        case "SET_TOKEN":
            const userToken: TokenUserIdentity = action.payload;
            if (userToken) {
                localStorage.setItem(environment.keyTokenStorage, userToken.accessToken);
            } else {
                localStorage.removeItem(environment.keyTokenStorage);
            }
            const http = createHttpClient(userToken?.accessToken);
            return {
                ...state,
                userToken: userToken,
                httpClient: http,
                appService: new AppService(http)
            };
        default:
            return state;
    }
}

