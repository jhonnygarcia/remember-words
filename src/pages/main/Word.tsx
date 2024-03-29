import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil, faInfoCircle, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { WordDto } from '../../dto';
import { ConfirmModal } from '../../components/ConfirmModal';
import { WordFormModal } from './WordFormModal';
import { useAppService } from '../../context/app.service';
import { helper } from '../../common/helpers.function';
import { Link } from 'react-router-dom';
import { KEY_WORDS } from '../../hooks';
import { speech } from '../../common/speech';

interface Props {
    word: WordDto;
    sort_spanish_first: boolean;
}
export default function Word({ word, sort_spanish_first }: Props) {
    const appService = useAppService();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const queryClient = useQueryClient();
    const { mutate: mutateRemove, isLoading: isLoadingRemove } = useMutation(() => appService.removeWord(word._id), {
        onSuccess: () => {
            toast.success('Texto eliminado !');
            queryClient.refetchQueries(KEY_WORDS);
            setShowConfirm(false);
        },
        onError: (error: any) => {
            helper.showMessageResponseError('warn', {
                response: error.response,
                statusCodes: [404]
            });
        }
    });
    const playSpeechText = async () => {
        const result = await speech(word.text || '');
        if (result) {
            toast.info(result);
        }
    };
    return (
        <>
            <div className={'card card-body shadow-lg bg-body rounded' + (word.complete ? ' word-complete' : '')}>
                <div className="d-flex justify-content-between">
                    <h5 className="card-title text-break">
                        <Link
                            to=""
                            onClick={(e) => {
                                e.preventDefault();
                                playSpeechText();
                            }}
                        >
                            <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                        </Link>{' '}
                        {sort_spanish_first ? word.translation : word.text}
                    </h5>
                </div>
                <p className="text-break">{sort_spanish_first ? word.text : word.translation}</p>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
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

                        <Link title="Detalle" to={`/words/${word._id}/details`} className="btn btn-info btn-sm m-1">
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </Link>
                    </div>
                    <div>
                        {word.each_minutes && <span>M:{word.each_minutes}</span>}{' '}
                        {word.repeat_remember && <span>R:{word.repeat_remember}</span>}
                    </div>
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
                <WordFormModal wordId={word._id} show={showEditModal} close={() => setShowEditModal(false)} />
            )}
        </>
    );
}
