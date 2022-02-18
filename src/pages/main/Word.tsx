import { WordDto } from '../../common/dto';
import { useStateValue } from '../../context/WordsState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { helper } from '../../common/helpers.function';
import { ConfirmModal } from '../../components/ConfirmModal';
import { ChangeEvent, useState } from 'react';
import { Form } from 'react-bootstrap';

interface Props {
    word: WordDto;
    openEdit: (wordId: string) => void;
    refreshWords: () => void;
}

interface WordSate {
    showConfirm: boolean;
    complete: string;
}
export default function Word({ word, openEdit, refreshWords }: Props) {
    const COMPLETE = 'complete';
    const PENDING = 'pending';
    const initialState = {
        showConfirm: false,
        complete: word.complete ? COMPLETE : PENDING,
    };
    const [state, setState] = useState<WordSate>(initialState);
    const { appService } = useStateValue();

    const deleteWord = async () => {
        const res = await helper.axiosCall({
            request: appService.removeWord(word._id),
            observe: 'body',
        });
        helper.showMsgRequest(res, { statusFailed: [404] });
        refreshWords();
    };
    const changeComplete = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value == COMPLETE ? PENDING : COMPLETE;
        setState({ ...state, complete: value });

        const completed = value == COMPLETE ? true : false;
        const res = await helper.axiosCall({
            request: appService.editWord(word._id, { complete: completed }),
            observe: 'body',
        });
        helper.showMsgRequest(res, { statusFailed: [404, 400], autoClose: 1000 });
        refreshWords();
    };
    return (
        <>
            <div className="card card-body shadow-lg bg-body rounded">
                <div className="d-flex justify-content-between">
                    <h4 className="card-title">{word.text}</h4>
                    <Form.Check
                        onChange={changeComplete}
                        value={state.complete}
                        checked={state.complete == COMPLETE}
                        type="switch"
                    />
                </div>

                <p>{word.translation}</p>
                <div className="d-flex align-items-center">
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
