import { useContext } from 'react';
import { WordContext } from '../context/WordsState';
import Word from './Word';

export default function WordList() {
    const { search, words, find } = useContext(WordContext);
    const show = search.length > 0 ? find : words;
    return (
        <>
            {show.map((word) => (
                <div key={word.id} className="col-md-4 mt-2">
                    <Word word={word} />
                </div>
            ))}
        </>
    );
}
