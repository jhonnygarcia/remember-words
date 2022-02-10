import { Subject } from "rxjs";
import { WordDto } from "../common/dto";

export let wordEdit$ = new Subject<WordDto>();
export const cleanWordEdit = () => {
    wordEdit$.complete();
    wordEdit$ = new Subject<WordDto>();
};