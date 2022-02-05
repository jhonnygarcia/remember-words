import { WordDto } from './word.dto';

export interface IWordContext {
    search: string;
    words: WordDto[];
    find: WordDto[];
    addWord: (word: WordDto) => void;
    editWord: (word: WordDto) => void;
    deleteWord: (word: WordDto) => void;
    searchWord: (word: string) => void;
    setSearch: (text: string) => void,
}