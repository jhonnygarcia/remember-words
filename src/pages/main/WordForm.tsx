import React from 'react';

export default function WordForm() {
    return <div>WordForm</div>;
}

/*import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { WordDto } from '../../common/dto';
import { useStateValue } from '../../context/WordsState';
import { wordEdit$, cleanWordEdit } from '../../subscribers/edit-word.subscriber';

type HandleInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export default function WordForm() {
    const { addWord, editWord } = useStateValue();
    const initialState = {
        name: '',
        translate: '',
    };
    let nameInput: HTMLInputElement | null;
    const [word, setWord] = useState<WordDto>(initialState);

    useEffect(() => {
        wordEdit$.subscribe((word) => {
            setWord(word);
        });
        return () => {
            cleanWordEdit();
        };
    }, []);

    const handleInputChange = (e: HandleInputChange) => {
        setWord({
            ...word,
            [e.target.name]: e.target.value,
        });
    };
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let { name, translate } = word;
        name = (name || '').trim();
        translate = (translate || '').trim();
        if (name === '' || translate === '') {
            alert('El Texto y Traducción son requeridos');
            return;
        }
        if (word.id) {
            editWord(word);
        } else {
            addWord(word);
        }
        setWord(initialState);
        nameInput?.focus();
    };

    const cancel = () => {
        setWord(initialState);
        nameInput?.focus();
    };
    return (
        <div className="card card-body bg-secondary rounded-0">
            <form onSubmit={onSubmit}>
                <h3 className="card-title">{word.id ? 'Editar Texto' : 'Añadir Texto'}</h3>
                <div className="form-group">
                    <input
                        ref={(input) => {
                            nameInput = input;
                        }}
                        type="text"
                        className="form-control mb-3 rounded-0 shadow-none border-0"
                        placeholder="Texto"
                        onChange={handleInputChange}
                        name="name"
                        value={word.name}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        style={{ width: '100%' }}
                        name="translate"
                        cols={30}
                        rows={3}
                        placeholder="Traducción"
                        value={word.translate}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="submit" className="btn btn-primary btn-sm">
                        Guardar
                    </button>
                    {word.id && (
                        <button onClick={cancel} className="btn btn-secondary btn-sm">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
*/
