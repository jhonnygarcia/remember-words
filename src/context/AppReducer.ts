import { KEY_CACHE_WORDS } from "../configs/appConfig";
import { IWordContext } from "../models/context.dto";
import { WordDto } from "../models/word.dto";

type WORDS_ACTIONS = 'ADD_WORD' | 'EDIT_WORD' | 'DELETE_WORD' | 'SEARCH_WORD' | 'CHANGE_SEARCH';
const getCurrentTimestamp = (): number => new Date().getTime();
const stripSpecialChars = (text: string): string => {
    text = text == null ? '' : text;
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
export const appReducer = (state: IWordContext, action: { type: WORDS_ACTIONS, payload: any }) => {
    const updateStorage = (words: WordDto[]): void => {
        localStorage.setItem(KEY_CACHE_WORDS, JSON.stringify(words));
    }

    switch (action.type) {
        case "ADD_WORD":
            const words = [...state.words,
            { ...action.payload, id: getCurrentTimestamp(), complete: false }];
            updateStorage(words);
            return {
                ...state,
                words: words,
            };

        case "EDIT_WORD":
            {
                const current: WordDto = action.payload;
                const updatedWords = state.words.map((word) => {
                    if (word.id === current.id) {
                        return {
                            ...word,
                            name: current.name,
                            translate: current.translate,
                            complete: current.complete
                        };
                    }
                    return word;
                });
                updateStorage(updatedWords);
                return {
                    ...state,
                    words: updatedWords,
                };
            }
        case "DELETE_WORD":
            {
                const current: WordDto = action.payload;
                const newWords = [...state.words.filter(w => w.id != current.id)];
                updateStorage(newWords);
                return {
                    ...state,
                    words: newWords,
                };
            }

        case "SEARCH_WORD":
            let current: string = action.payload;
            current = stripSpecialChars(current.toLowerCase());
            const newWords = [...state.words];
            const finds = newWords.filter(w => stripSpecialChars(w.name.toLowerCase()).includes(current));
            return {
                ...state,
                find: finds,
            };
        case "CHANGE_SEARCH":
            const text: string = action.payload;
            return {
                ...state,
                search: text,
            };
    }
}

