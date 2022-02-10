import { WordDto } from '../../common/dto';
import { useStateValue } from '../../context/WordsState';
import { wordEdit$ } from '../../subscribers/edit-word.subscriber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

interface Props {
    word: WordDto;
}
export default function Word({ word }: Props) {
    const { deleteWord } = useStateValue();
    return (
        <>
            <div className="card card-body shadow-lg bg-body rounded">
                <h3 className="card-title">{word.text}</h3>
                <p>{word.translation}</p>
                <div>
                    <button title='Editar' onClick={() => wordEdit$.next(word)} className="btn btn-primary btn-sm m-1">
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button title='Eliminar' onClick={() => deleteWord(word)} className="btn btn-danger btn-sm m-1">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </>
    );
}
