import { createContext, FC, useReducer } from 'react';

import { appReducer } from './AppReducer';
import { WordDto } from '../models/word.dto';
import { IWordContext } from '../models/context.dto';
import { KEY_CACHE_WORDS } from '../configs/appConfig';
import samples from '../samples/words.json';

const initialState = () => {
    const cache = localStorage.getItem(KEY_CACHE_WORDS);
    let data: WordDto[];
    try {
        data = JSON.parse(cache || '') as WordDto[];
    } catch (err) {
        data = [];
    }
    const transform = samples as WordDto[];
    if (!data.some((d) => transform.some((t) => t.id === d.id))) {
        data = [...data, ...transform];
    }
    data = data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    return {
        search: '',
        words: data,
        find: [],
        addWord: (word: WordDto) => {},
        editWord: (word: WordDto) => {},
        deleteWord: (word: WordDto) => {},
        searchWord: (word: string) => {},
        setSearch: (text: string) => {},
    };
};

export const WordContext = createContext<IWordContext>(initialState());

export const WordProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState());

    const addWord = (word: WordDto) => {
        dispatch({
            type: 'ADD_WORD',
            payload: word,
        });
    };

    const editWord = (word: WordDto) => {
        dispatch({
            type: 'EDIT_WORD',
            payload: word,
        });
    };

    const deleteWord = (word: WordDto) => {
        dispatch({
            type: 'DELETE_WORD',
            payload: word,
        });
    };

    const searchWord = (word: string) => {
        dispatch({
            type: 'SEARCH_WORD',
            payload: word,
        });
    };
    const setSearch = (text: string) => {
        dispatch({
            type: 'CHANGE_SEARCH',
            payload: text,
        });
    };
    return (
        <WordContext.Provider
            value={{
                search: state.search,
                words: state.words,
                find: state.find,
                addWord,
                editWord,
                deleteWord,
                searchWord,
                setSearch
            }}
        >
            {children}
        </WordContext.Provider>
    );
};
