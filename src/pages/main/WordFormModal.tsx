import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FormControlValue, WordDto } from '../../common/dto';
import { useStateValue } from '../../context/WordsState';
import { helper } from '../../common/helpers.function';
import { toast } from 'react-toastify';

type HandleInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
interface Props {
    wordId: string | null;
    show: boolean;
    close: () => void;
    refreshWords: () => void;
}
interface StateFormWord {
    text: FormControlValue<string>;
    translation: FormControlValue<string>;
    each_minutes: FormControlValue<number | string>;
    repeat_remember: FormControlValue<number | string>;
    loading: boolean;
    saving: boolean;
}
export const WordFormModal = ({ refreshWords, wordId, show, close }: Props) => {
    const { appService } = useStateValue();
    const initialState = {
        text: { value: '', dirty: false },
        translation: { value: '', dirty: false },
        each_minutes: { value: '', dirty: false },
        repeat_remember: { value: '', dirty: false },
        loading: false,
        saving: false,
    };
    const [state, setState] = useState<StateFormWord>(initialState);
    const handleInputChange = (e: HandleInputChange) => {
        setState({
            ...state,
            [e.target.name]: { value: e.target.value, dirty: true },
        });
    };
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({
            ...state,
            text: { ...state.text, dirty: true },
            translation: { ...state.translation, dirty: true },
            each_minutes: { ...state.each_minutes, dirty: true },
            repeat_remember: { ...state.repeat_remember, dirty: true },
        });
        const isValid = helper.isValid([
            state.text,
            state.translation,
            state.each_minutes,
            state.repeat_remember,
        ]);
        if (!isValid) return;

        setState({ ...state, loading: true, saving: true });
        const payload = {
            each_minutes: Number(state.each_minutes.value),
            repeat_remember: Number(state.repeat_remember.value),
            text: state.text.value,
            translation: state.translation.value,
        };
        const res = await helper.axiosCall({
            request: wordId ? appService.editWord(wordId, payload) : appService.addWord(payload),
        });
        if (!wordId) {
            setState(initialState);
        } else {
            setState({ ...state, loading: false, saving: false });
        }
        setState(!wordId ? initialState : { ...state, loading: false, saving: false });
        helper.showMsgRequest(res, [400], () => {
            refreshWords();
        });
    };
    const getWord = async () => {
        if (!wordId) {
            setState(initialState);
            return;
        }

        const res = await helper.axiosCall({
            request: appService.getWord(wordId),
            observe: 'body',
            before: () => setState({ ...state, loading: true }),
        });

        if (!res.success) {
            setState({ ...state, loading: false });
            toast.error('El recurso ha sido eliminado');
            close();
            return;
        }

        const wordFound: WordDto = res.response;
        setState({
            ...state,
            loading: false,
            text: { ...state.text, value: wordFound.text || '', dirty: true },
            translation: { ...state.translation, value: wordFound.translation || '', dirty: true },
            each_minutes: {
                ...state.each_minutes,
                value: wordFound.each_minutes || '',
                dirty: true,
            },
            repeat_remember: {
                ...state.repeat_remember,
                value: wordFound.repeat_remember || '',
                dirty: true,
            },
        });
    };
    const keyBoardEvent = (event: globalThis.KeyboardEvent) => {
        if (state.loading) {
            event.preventDefault();
        }
    };
    const closeButton = () => {
        if (state.loading) return;
        close();
    };
    return (
        <Modal
            backdrop="static"
            onShow={getWord}
            show={show}
            onHide={closeButton}
            onEscapeKeyDown={keyBoardEvent}
        >
            <Modal.Header>
                <Modal.Title>{wordId ? 'Editar texto' : 'Nuevo texto'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <fieldset disabled={state.loading}>
                    <Modal.Body>
                        <div className="form-group mb-3">
                            <input
                                type="text"
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
                            ></textarea>
                            <div className="invalid-feedback">Requerido</div>
                        </div>
                        <div className="from-group">
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="number"
                                        min={10}
                                        max={60}
                                        name="each_minutes"
                                        onChange={handleInputChange}
                                        value={state.each_minutes.value}
                                        className={
                                            'form-control ' + helper.classValid(state.each_minutes)
                                        }
                                        placeholder="Minutos"
                                    />
                                    <div className="invalid-feedback">Requerido</div>
                                </div>
                                <div className="col">
                                    <input
                                        type="number"
                                        min={3}
                                        max={30}
                                        name="repeat_remember"
                                        onChange={handleInputChange}
                                        value={state.repeat_remember.value}
                                        className={
                                            'form-control ' +
                                            helper.classValid(state.repeat_remember)
                                        }
                                        placeholder="Repeticiones"
                                    />
                                    <div className="invalid-feedback">Requerido</div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" type="button" onClick={close}>
                                Cerrar
                            </Button>
                            <Button
                                style={{ marginLeft: '0.625rem' }}
                                variant="primary"
                                type="submit"
                            >
                                {state.saving && (
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
