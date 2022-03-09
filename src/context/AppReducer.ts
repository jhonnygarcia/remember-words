import { IWordContext } from "../dto/context.dto";
import { TokenUserIdentity } from "../dto/identity-info";
import { environment } from "../environment";

type WORDS_ACTIONS = 'SET_TOKEN';

export const initialState = {
    userToken: null,
    setUserToken: (userToken: TokenUserIdentity | null) => { },
    getToken: () => null
};

export const appReducer = (state: IWordContext, action: { type: WORDS_ACTIONS, payload: any }) => {
    switch (action.type) {
        case "SET_TOKEN":
            const userToken: TokenUserIdentity = action.payload;
            if (userToken) {
                localStorage.setItem(environment.STORAGE_TOKEN, userToken.accessToken);
            } else {
                localStorage.removeItem(environment.STORAGE_TOKEN);
            }
            return {
                ...state,
                userToken: userToken
            };
        default:
            return state;
    }
}

