import { TokenUserIdentity } from './identity-info';

export interface IWordContext {
    userToken: TokenUserIdentity | null;
    setUserToken: (userToken: TokenUserIdentity | null) => void;
    getToken: () => string | null;
}