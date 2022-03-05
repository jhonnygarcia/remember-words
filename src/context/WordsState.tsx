import { createContext, FC, useContext, useReducer } from 'react';

import { appReducer, initialState } from './AppReducer';
import { IWordContext } from '../dto/context.dto';
import { environment } from '../environment';
import { TokenUserIdentity } from '../dto/identity-info';

export const StateContext = createContext<IWordContext>(initialState);

export const GlobalStateProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const setUserToken = (userToken: TokenUserIdentity | null) => {
        dispatch({
            type: 'SET_TOKEN',
            payload: userToken,
        });
    };
    const getToken = (): string | null => {
        if (state.userToken?.accessToken) {
            return state.userToken.accessToken;
        } else {
            return localStorage.getItem(environment.STORAGE_TOKEN);
        }
    };
    return (
        <StateContext.Provider
            value={{
                userToken: state.userToken,
                setUserToken,
                getToken
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);
