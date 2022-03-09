import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { FormControlValue, WordDto } from '../../dto';
import { helper } from '../../common/helpers.function';
import { KEY_WORDS, useMutateWord, useQueryWord } from '../../hooks/words.hook';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

type HandleInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
interface Props {
    wordId?: string | null;
    show: boolean;
    close: () => void;
}
interface StateFormWord {
    text: FormControlValue<string>;
    translation: FormControlValue<string>;
    each_minutes: FormControlValue<number | string>;
    repeat_remember: FormControlValue<number | string>;
}
export const WordFormModal = ({ wordId, show, close }: Props) => {
    const initialState = {
        text: { value: '', dirty: false },
        translation: { value: '', dirty: false },
        each_minutes: { value: '', dirty: false },
        repeat_remember: { value: '', dirty: false }
    };
    const queryClient = useQueryClient();
    const [state, setState] = useState<StateFormWord>(initialState);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const { isLoading: getLoading, refetch } = useQueryWord(wordId, {
        enabled: false,
        onSuccess: (wordFound: WordDto) => {
            setState({
                ...state,
                text: { ...state.text, value: wordFound.text || '', dirty: true },
                translation: {
                    ...state.translation,
                    value: wordFound.translation || '',
                    dirty: true
                },
                each_minutes: {
                    ...state.each_minutes,
                    value: wordFound.each_minutes || '',
                    dirty: true
                },
                repeat_remember: {
                    ...state.repeat_remember,
                    value: wordFound.repeat_remember || '',
                    dirty: true
                }
            });
        },
        onError: () => {
            toast.error('El recurso ha sido eliminado');
            close();
        }
    });

    const { mutate, isLoading: saveLoading } = useMutateWord(wordId, {
        onSuccess: () => {
            toast.success('Operación realizada exitosamente');
            queryClient.refetchQueries(KEY_WORDS);
        },
        onError: (res: any) => {
            helper.showMessageResponseError('warn', {
                response: res.response,
                statusCodes: [404, 400]
            });
        }
    });

    const handleInputChange = (e: HandleInputChange) => {
        setState({
            ...state,
            [e.target.name]: { value: e.target.value, dirty: true }
        });
    };
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({
            ...state,
            text: { ...state.text, dirty: true },
            translation: { ...state.translation, dirty: true },
            each_minutes: { ...state.each_minutes, dirty: true },
            repeat_remember: { ...state.repeat_remember, dirty: true }
        });
        const isValid = helper.isValid([state.text, state.translation]);
        if (!isValid) return;

        const payload = {
            each_minutes: state.each_minutes.value == '' ? undefined : state.each_minutes.value,
            repeat_remember: state.repeat_remember.value == '' ? undefined : state.repeat_remember.value,
            text: state.text.value,
            translation: state.translation.value
        };
        mutate(payload, {
            onSuccess: () => {
                if (!wordId) setState(initialState);
            }
        });
    };
    const onStop = () => {
        setState({ ...state, text: { ...state.text, value: transcript, dirty: true } });
        resetTranscript();
        SpeechRecognition.stopListening();
    };
    const onRecording = () => {
        if (!navigator.onLine) {
            toast.info('El reconocimiento de voz solo funciona con una conexion a internet');
            return;
        }
        if (!browserSupportsSpeechRecognition) {
            toast.info('Su navegador no soporta el uso del microfono');
            return;
        }
        SpeechRecognition.startListening({
            language: 'en'
        });
    };
    useEffect(() => {
        if ((transcript || '').length > 0) {
            setState({ ...state, text: { ...state.text, value: transcript, dirty: true } });
            resetTranscript();
        }
    }, [listening]);
    return (
        <Modal
            backdrop="static"
            onShow={() => {
                if (wordId) refetch();
            }}
            show={show}
            onHide={() => {
                if (saveLoading || getLoading) return;
                close();
            }}
            onEscapeKeyDown={(event) => {
                if (saveLoading || getLoading) {
                    event.preventDefault();
                }
            }}
        >
            <Modal.Header>
                <Modal.Title>{wordId ? 'Editar texto' : 'Nuevo texto'}</Modal.Title>
                <Link
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (listening) {
                            onStop();
                        } else {
                            onRecording();
                        }
                    }}
                    type="button"
                >
                    <FontAwesomeIcon size="2x" icon={listening ? faMicrophone : faMicrophoneSlash} />
                </Link>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <fieldset disabled={saveLoading || getLoading}>
                    <Modal.Body>
                        <div className="form-group mb-3">
                            <textarea
                                style={{ width: '100%' }}
                                cols={30}
                                rows={2}
                                className={'form-control ' + helper.classValid(state.text)}
                                placeholder="Texto"
                                onChange={handleInputChange}
                                name="text"
                                value={state.text.value}
                            />
                            <div className="invalid-feedback">Requerido</div>
                        </div>
                        <div className="form-group mb-3">
                            <textarea
                                className={'form-control ' + helper.classValid(state.translation)}
                                style={{ width: '100%' }}
                                name="translation"
                                cols={30}
                                rows={3}
                                placeholder="Traducción"
                                value={state.translation.value}
                                onChange={handleInputChange}
                            />
                            <div className="invalid-feedback">Requerido</div>
                        </div>
                        <div className="from-group">
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="number"
                                        min={1}
                                        max={60}
                                        name="each_minutes"
                                        onChange={handleInputChange}
                                        value={state.each_minutes.value}
                                        className="form-control"
                                        placeholder="Minutos"
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="number"
                                        min={1}
                                        max={30}
                                        name="repeat_remember"
                                        onChange={handleInputChange}
                                        value={state.repeat_remember.value}
                                        className="form-control"
                                        placeholder="Repeticiones"
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" type="button" onClick={close}>
                                Cerrar
                            </Button>
                            <Button style={{ marginLeft: '0.625rem' }} variant="primary" type="submit">
                                {saveLoading && (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{' '}
                                    </>
                                )}
                                Guardar
                            </Button>
                        </div>
                    </Modal.Footer>
                </fieldset>
            </Form>
        </Modal>
    );
};
