import { WordDto } from './../models/word.dto';
import { Subject } from "rxjs";

export let wordEdit$ = new Subject<WordDto>();
export const cleanWordEdit = () => {
    wordEdit$.complete();
    wordEdit$ = new Subject<WordDto>();
};