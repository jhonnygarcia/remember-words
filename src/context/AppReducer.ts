import { KEY_CACHE_WORDS } from "../common/appConfig";
import { WordDto } from "../common/dto";
import { IWordContext } from "../common/dto/context.dto";
import { IdentityInfo } from "../common/dto/identity-info";
import { environment } from "../environment";
import { createHttpClient } from '../http-comon';
import AppService from "./app.service";

type WORDS_ACTIONS = 'ADD_WORD' | 'EDIT_WORD' | 'DELETE_WORD'
    | 'SET_TOKEN' | 'SET_USER' | 'SET_WORDS' | 'REFRESH_WORDS';

const axiosInstance = createHttpClient();

export const initialState = {
    search: '',
    words: [],
    find: [],
    httpClient: axiosInstance,
    appService: new AppService(axiosInstance),
    user: null,
    setToken: (token: string) => { },
    setUser: (user: IdentityInfo | null) => { },
    addWord: (word: WordDto) => { },
    editWord: (word: WordDto) => { },
    deleteWord: (word: WordDto) => { },
    setWords: (words: WordDto[]) => { }
};

const getCurrentTimestamp = (): number => new Date().getTime();

const pushMessage = (word: WordDto) => {

}

export const appReducer = (state: IWordContext, action: { type: WORDS_ACTIONS, payload: any }) => {
    const updateStorage = (words: WordDto[]): void => {
        localStorage.setItem(KEY_CACHE_WORDS, JSON.stringify(words));
    }

    switch (action.type) {
        case "ADD_WORD":
            const words = [...state.words,
            { ...action.payload, id: getCurrentTimestamp(), complete: false }];
            updateStorage(words);
            pushMessage(action.payload);
            return {
                ...state,
                words: words,
            };
        case "EDIT_WORD":
            {
                return state;
            }
        case "DELETE_WORD":
            {
                const current: WordDto = action.payload;
                const newWords = [...state.words.filter(w => w._id != current._id)];
                updateStorage(newWords);
                return {
                    ...state,
                    words: newWords,
                };
            }
        case "SET_TOKEN":
            const accessToken: string = action.payload;
            let successToken = true;
            if (accessToken == null || accessToken == '') {
                successToken = false;
                localStorage.removeItem(environment.keyTokenStorage);
            } else {
                localStorage.setItem(environment.keyTokenStorage, accessToken);
            }
            const http = createHttpClient(accessToken);
            return successToken ? {
                ...state,
                token: accessToken,
                httpClient: http,
                appService: new AppService(http)
            } :
                {
                    ...state,
                    token: accessToken,
                    httpClient: http,
                    user: null,
                    appService: new AppService(http)
                };
        case "SET_WORDS": {
            const words: WordDto[] = action.payload;
            return {
                ...state,
                words: words,
            };
        }
        case "SET_USER": {
            const user: IdentityInfo = action.payload;
            return user ? { ...state, user: user } : { ...state, user: user, token: null };
        }

        default:
            return state;
    }
}

