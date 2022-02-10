import { createContext, FC, useContext, useReducer } from 'react';

import { appReducer, initialState } from './AppReducer';
import { IWordContext } from '../common/dto/context.dto';
import { WordDto } from '../common/dto/word.dto';
import AppService from './app.service';
export const StateContext = createContext<IWordContext>(initialState);

export const StateProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

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
    const setToken = (token: string) => {
        dispatch({
            type: 'SET_TOKEN',
            payload: token,
        });
    };
    const setWords = (words: WordDto[]) => {
        dispatch({
            type: 'SET_WORDS',
            payload: words,
        });
    };
    return (
        <StateContext.Provider
            value={{
                find: state.find,
                search: state.search,
                token: state.token,
                words: state.words,
                deleteWord,
                addWord,
                editWord,
                setToken,
                setWords,
                httpClient: state.httpClient,
                appService: state.appService
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);
