import { WordDto } from '../../common/dto';
import { useStateValue } from '../../context/WordsState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { helper } from '../../common/helpers.function';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useState } from 'react';

interface Props {
    word: WordDto;
    openEdit: (wordId: string) => void;
    refreshWords: () => void;
}
export default function Word({ word, openEdit, refreshWords }: Props) {
    const initialState = {
        showConfirm: false,
    };
    const [state, setState] = useState(initialState);
    const { appService } = useStateValue();

    const deleteWord = async () => {
        const res = await helper.axiosCall({
            request: appService.removeWord(word._id),
            observe: 'body',
        });
        helper.showMsgRequest(res, [404]);
        refreshWords();
    };
    return (
        <>
            <div className="card card-body shadow-lg bg-body rounded">
                <h3 className="card-title">{word.text}</h3>
                <p>{word.translation}</p>
                <div>
                    <button
                        title="Editar"
                        onClick={() => openEdit(word._id)}
                        className="btn btn-primary btn-sm m-1"
                    >
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button
                        title="Eliminar"
                        onClick={() => setState({ ...state, showConfirm: true })}
                        className="btn btn-danger btn-sm m-1"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
            <ConfirmModal
                title="Eliminar texto"
                show={state.showConfirm}
                okAction={deleteWord}
                cancelAction={() => {
                    setState({ ...state, showConfirm: false });
                }}
            >
                Esta seguro de eliminar el texto: <span className="fw-bold">{word.text}</span>
            </ConfirmModal>
        </>
    );
}
