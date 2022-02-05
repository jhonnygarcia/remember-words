import { useContext } from 'react';
import { WordContext } from '../context/WordsState';
import { wordEdit$ } from '../subjects/word.subject';
import { WordDto } from './../models/word.dto';

interface Props {
    word: WordDto;
}
export default function Word({ word }: Props) {
    const { deleteWord } = useContext(WordContext);
    return (
        <>
            <div className="card card-body">
                <h3 className="card-title">{word.name}</h3>
                <p>{word.translate}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => wordEdit$.next(word)} className="btn btn-primary btn-sm mr-2">
                        Editar
                    </button>
                    <button onClick={() => deleteWord(word)} className="btn btn-danger btn-sm">
                        Eliminar
                    </button>
                </div>
            </div>
        </>
    );
}
