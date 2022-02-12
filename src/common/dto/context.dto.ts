import { AxiosInstance } from 'axios';
import AppService from '../../context/app.service';
import { IdentityInfo } from './identity-info';
import { WordDto } from './word.dto';

export interface IWordContext {
    search: string;
    words: WordDto[];
    find: WordDto[];
    httpClient: AxiosInstance;
    appService: AppService;
    user?: IdentityInfo | null;
    setUser: (user: IdentityInfo | null) => void;
    setToken: (token: string) => void,
    addWord: (word: WordDto) => void;
    editWord: (word: WordDto) => void;
    deleteWord: (word: WordDto) => void;
    setWords: (words: WordDto[]) => void;
}