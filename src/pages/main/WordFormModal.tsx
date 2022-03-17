import { ChangeEvent, FormEvent, useState } from 'react';

import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { FormControlValue, WordDto } from '../../dto';
import { helper } from '../../common/helpers.function';
import { KEY_WORDS, useMutateWord, useQueryWord } from '../../hooks/words.hook';
import { useQueryClient } from 'react-query';
import { TextAreaMicrofone } from '../../components/TextAreaMicrofone';

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
    const COMPLETE = 'complete';
    const PENDING = 'pending';
    const initialState = {
        text: { value: '', dirty: false },
        translation: { value: '', dirty: false },
        each_minutes: { value: '', dirty: false },
        repeat_remember: { value: '', dirty: false }
    };
    const queryClient = useQueryClient();
    const [state, setState] = useState<StateFormWord>(initialState);
    const [complete, setComplete] = useState(PENDING);
    const [fakeText, setFakeText] = useState(false);
    const [fakeTranslate, setFakeTranslate] = useState(false);
    const [fakeComment, setFakeComment] = useState(false);
    const [comment, setComment] = useState('');

    const { isLoading: getLoading, refetch } = useQueryWord(wordId, {
        enabled: false,
        retry: false,
        onSuccess: (wordFound: WordDto) => {
            setComplete(wordFound.complete ? COMPLETE : PENDING);
            setComment(wordFound.comment || '');
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
        onError: (error: any) => {
            if (error.response.status == 500) {
                toast.error('Ha ocurrido un error inesperado al obtener el recurso');
            } else {
                toast.error('El recurso ha sido eliminado');
            }
            close();
        }
    });

    const { mutate, isLoading: saveLoading } = useMutateWord(wordId, {
        onSuccess: () => {
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
        if (e.target.name == 'comment') {
            setComment(e.target.value);
        } else {
            setState({
                ...state,
                [e.target.name]: { value: e.target.value, dirty: true }
            });
        }
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

        const payload: any = {
            each_minutes: state.each_minutes.value == '' ? undefined : state.each_minutes.value,
            repeat_remember: state.repeat_remember.value == '' ? undefined : state.repeat_remember.value,
            text: state.text.value,
            translation: state.translation.value,
            comment
        };
        if (wordId) {
            payload.complete = complete == COMPLETE ? true : false;
        }
        mutate(payload, {
            onError: (error: any) => {
                if (error.response == null || error.response.status == 500) {
                    toast.error('Ocurrio un error inesperado');
                    return;
                }
                const message = error.response.data.message;
                if (typeof message == 'string') {
                    toast.warn(message);
                } else {
                    toast.warn(message[0]);
                }
            },
            onSuccess: () => {
                if (!wordId) {
                    toast.success('Operación realizada exitosamente', {
                        autoClose: 1000
                    });
                    setState(initialState);
                }
            }
        });
    };
    const changeComplete = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value == COMPLETE ? PENDING : COMPLETE;
        setComplete(value);
    };
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
                {wordId && (
                    <Form.Check
                        onChange={changeComplete}
                        value={complete}
                        checked={complete == COMPLETE}
                        type="switch"
                    />
                )}
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <fieldset disabled={saveLoading || getLoading}>
                    <Modal.Body>
                        <div className="form-group mb-3">
                            <TextAreaMicrofone
                                language="en-US"
                                fake={fakeText}
                                init={() => {
                                    setFakeComment(true);
                                    setFakeTranslate(true);
                                }}
                                finish={() => {
                                    setFakeComment(false);
                                    setFakeTranslate(false);
                                }}
                                speech={(speech) =>
                                    setState({
                                        ...state,
                                        text: { value: speech, dirty: true }
                                    })
                                }
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
                            <TextAreaMicrofone
                                language="es-ES"
                                fake={fakeTranslate}
                                init={() => {
                                    setFakeComment(true);
                                    setFakeText(true);
                                }}
                                finish={() => {
                                    setFakeComment(false);
                                    setFakeText(false);
                                }}
                                speech={(speech) =>
                                    setState({
                                        ...state,
                                        translation: { value: speech, dirty: true }
                                    })
                                }
                                className={'form-control ' + helper.classValid(state.translation)}
                                style={{ width: '100%' }}
                                cols={30}
                                rows={3}
                                placeholder="Traducción"
                                onChange={handleInputChange}
                                name="translation"
                                value={state.translation.value}
                            />
                            <div className="invalid-feedback">Requerido</div>
                        </div>
                        <div className="form-group mb-3">
                            <TextAreaMicrofone
                                language="es-ES"
                                fake={fakeComment}
                                init={() => {
                                    setFakeTranslate(true);
                                    setFakeText(true);
                                }}
                                finish={() => {
                                    setFakeTranslate(false);
                                    setFakeText(false);
                                }}
                                speech={(speech) => setComment(speech)}
                                className="form-control"
                                style={{ width: '100%' }}
                                cols={30}
                                rows={3}
                                placeholder="Comentarios"
                                onChange={handleInputChange}
                                name="comment"
                                value={comment}
                            />
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
