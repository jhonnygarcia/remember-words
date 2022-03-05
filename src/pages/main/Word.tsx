import { ChangeEvent, useState } from 'react';

import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { WordDto } from '../../dto';
import { ConfirmModal } from '../../components/ConfirmModal';
import { WordFormModal } from './WordFormModal';
import { useAppService } from '../../context/app.service';
import { helper } from '../../common/helpers.function';

interface Props {
    word: WordDto;
}

interface WordSate {
    complete: string;
}
export default function Word({ word }: Props) {
    const COMPLETE = 'complete';
    const PENDING = 'pending';
    const initialState = {
        complete: word.complete ? COMPLETE : PENDING,
    };
    const appService = useAppService();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [state, setState] = useState<WordSate>(initialState);
    const queryClient = useQueryClient();
    const { mutate: mutateRemove, isLoading: isLoadingRemove } = useMutation(
        () => appService.removeWord(word._id),
        {
            onSuccess: () => {
                toast.success('Texto eliminado !');
                queryClient.invalidateQueries('words');
            },
            onError: (error: any) => {
                helper.showMessageResponseError('warn', {
                    response: error.response,
                    statusCodes: [404],
                });
            },
        },
    );
    const { mutate: mutateEdit } = useMutation(
        (completed: boolean) => {
            return appService.editWord(word._id, { complete: completed });
        },
        {
            onError: (error: any) => {
                helper.showMessageResponseError('warn', {
                    response: error.response,
                    statusCodes: [404],
                });
            },
        },
    );

    const changeComplete = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value == COMPLETE ? PENDING : COMPLETE;
        setState({ ...state, complete: value });
        mutateEdit(value == COMPLETE);
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
                        onClick={() => setShowEditModal(true)}
                        className="btn btn-primary btn-sm m-1"
                    >
                        <FontAwesomeIcon icon={faPencil} />
                    </button>
                    <button
                        title="Eliminar"
                        onClick={() => setShowConfirm(true)}
                        className="btn btn-danger btn-sm m-1"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
            {showConfirm && (
                <ConfirmModal
                    title="Eliminar texto"
                    show={showConfirm}
                    isLoading={isLoadingRemove}
                    ok={() => mutateRemove()}
                    cancel={() => setShowConfirm(false)}
                >
                    Esta seguro de eliminar el texto: <span className="fw-bold">{word.text}</span>
                </ConfirmModal>
            )}
            {showEditModal && (
                <WordFormModal
                    wordId={word._id}
                    show={showEditModal}
                    close={() => setShowEditModal(false)}
                />
            )}
        </>
    );
}
