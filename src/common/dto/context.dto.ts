import { AxiosInstance } from 'axios';
import AppService from '../../context/app.service';
import { WordDto } from './word.dto';

export interface IWordContext {
    token: string | null;
    search: string;
    words: WordDto[];
    find: WordDto[];
    httpClient: AxiosInstance;
    appService: AppService;
    setToken: (token: string) => void,
    addWord: (word: WordDto) => void;
    editWord: (word: WordDto) => void;
    deleteWord: (word: WordDto) => void;
    setWords: (words: WordDto[]) => void;
}