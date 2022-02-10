import { KEY_CACHE_WORDS } from "../common/appConfig";
import { WordDto } from "../common/dto";
import { IWordContext } from "../common/dto/context.dto";
import { createHttpClient } from '../http-comon';
import AppService from "./app.service";

type WORDS_ACTIONS = 'ADD_WORD' | 'EDIT_WORD' | 'DELETE_WORD'
    | 'SET_TOKEN' | 'SET_WORDS';

const axiosInstance = createHttpClient();

export const initialState = {
    token: null,
    search: '',
    words: [],
    find: [],
    httpClient: axiosInstance,
    appService: new AppService(axiosInstance),
    setToken: (token: string) => { },
    addWord: (word: WordDto) => { },
    editWord: (word: WordDto) => { },
    deleteWord: (word: WordDto) => { },
    setWords: (words: WordDto[]) => { }
};

const getCurrentTimestamp = (): number => new Date().getTime();
const stripSpecialChars = (text: string): string => {
    text = text == null ? '' : text;
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

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
            const http = createHttpClient(accessToken);
            return {
                ...state,
                token: accessToken,
                httpClient: http,
                appService: new AppService(http)
            };
        case "SET_WORDS": {
            const words: WordDto[] = action.payload;
            return {
                ...state,
                words: words,
            };
        }

        default:
            return state;
    }
}

