import { ChangeEvent, FormEvent, useState } from 'react';

import moment from 'moment';
import { toast } from 'react-toastify';
import { Form, Modal, ButtonGroup, ToggleButton, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import { helper } from '../../common/helpers.function';
import { useStateValue } from '../../context/WordsState';
import { checkNotifications, subriberPushMessages } from '../webpush.utility';
import { registerServiceWorker } from '../../serviceWorker';
import { Button } from 'react-bootstrap';

interface Props {
    show: boolean;
    close: () => void;
}
interface ConfigUserModel {
    _id: string;
    end_remember: Date;
    active: boolean;
    updated_at: Date;
}
interface StateConfigModal {
    hasNotify: boolean;
    endRemember: string | null;
    rememberDays: number | string;
    active: string;
    dirtyrememberDays: boolean;
    loading: boolean;
    saving: boolean;
}
export const ConfigModal = ({ show, close }: Props) => {
    const initialState = {
        hasNotify: false,
        rememberDays: '',
        active: '0',
        endRemember: null,
        dirtyrememberDays: false,
        loading: false,
        saving: false,
    };
    const [state, setState] = useState<StateConfigModal>(initialState);
    const { appService, httpClient } = useStateValue();
    const radios = [
        { name: 'Si', value: '1' },
        { name: 'No', value: '0' },
    ];
    const getConfig = async () => {
        const res = await helper.axiosCall({
            request: appService.getUserConfig(),
            observe: 'body',
        });
        if (!res.success) {
            setState(initialState);
            return;
        }
        const config: ConfigUserModel = res.response;
        const endRemember = moment(config.end_remember).local();
        const now = moment().local();
        const diffDays = endRemember.diff(now, 'day');
        setState({
            ...state,
            hasNotify: config.active,
            rememberDays: diffDays + 1,
            active: config.active ? '1' : '0',
            endRemember: endRemember.format('DD/MM/YYYY hh:mm:ss'),
        });
    };

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        let endDate: string | null = null;
        if (e.target.value.length > 0) {
            const todayAddDays = moment().add(Number(e.target.value), 'd');
            endDate = helper.dateToFormat(todayAddDays, 'DD/MM/YYYY hh:mm:ss');
        }
        setState({
            ...state,
            rememberDays: e.target.value,
            endRemember: endDate,
            dirtyrememberDays: true,
        });
    };

    const enabledNotifications = async (): Promise<boolean> => {
        const serviceWorkerRegister = await registerServiceWorker();
        if (!serviceWorkerRegister) {
            toast.info('Su navegador no tiene soporte para services worker');
            return false;
        }

        const checkNotify = checkNotifications();
        if (!checkNotify.hasSuport) {
            toast.info('Su navegador no tiene soporte para notificaciones');
            return false;
        }

        if (checkNotify.permission == 'denied') {
            toast.info(
                'Acceso denegado a las notificaciones, cambie los permisos para permitir acceso a esta pagína',
            );
            return false;
        }

        if (checkNotify.permission == 'granted') {
            await subriberPushMessages(serviceWorkerRegister, httpClient);
            toast.success('¡Notificaciones habilitadas!');
            return true;
        }
        const permision = await Notification.requestPermission();
        if (permision === 'granted') {
            await subriberPushMessages(serviceWorkerRegister, httpClient);
            toast.success('¡Notificaciones habilitadas!');
            return true;
        }
        toast.info(
            'Acceso denegado a las notificaciones, no es posible habilitar las notificaciones',
        );
        return false;
    };
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setState({
            ...state,
            dirtyrememberDays: true,
        });

        const rememberDays = Number(state.rememberDays);
        if (rememberDays > 30 || rememberDays < 1) {
            toast.warn('El campo recordarme por X dias tiene que estar entre 1 - 30');
            return;
        }

        if (state.active == '1') {
            setState({ ...state, loading: true });
            const enabled = await enabledNotifications();
            if (!enabled) {
                setState({ ...state, loading: false });
                return;
            }
        } else {
            setState({ ...state, loading: true });
        }

        const response = await helper.axiosCall({
            request: appService.saveUserConfig({
                remember_days: rememberDays,
                active: state.active == '1',
                date: moment().toISOString(),
            }),
            observe: 'response',
        });
        setState({ ...state, hasNotify: false, loading: false });

        if (response.success) {
            toast.success('Operación realizada exitosamente');
            if (state.active == '0') {
                toast.info('Se limpiaron todas sus subscripciones a las notificaciones');
            }
        } else {
            toast.error('Ha ocurrido un error inesperado');
        }
    };
    const getClassForm = (name: string) => {
        const form: any = { ...state };
        const dirty: boolean = form[`dirty${name}`];
        const value: string = (form[name] || '').toString();
        if (dirty) {
            return (value.trim().length > 0 ? 'is-valid' : 'is-invalid') + ' form-control';
        }
        return 'form-control';
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
    const forzarNotificaciones = async () => {
        setState({ ...state, loading: true });
        await enabledNotifications();
        setState({ ...state, hasNotify: false, loading: false });
    };
    return (
        <Modal
            backdrop="static"
            onShow={getConfig}
            show={show}
            onHide={closeButton}
            onEscapeKeyDown={keyBoardEvent}
        >
            <Modal.Header closeButton={!state.loading}>
                <Modal.Title>Notificaciones</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <fieldset disabled={state.loading}>
                    <Modal.Body>
                        <div className="row d-flex align-items-center">
                            <label className="form-label col">
                                Recordarme:{' '}
                                {state.endRemember && (
                                    <span className="text-muted fs-7 fst-italic">
                                        (hasta: {state.endRemember})
                                    </span>
                                )}
                            </label>
                        </div>
                        <div className="row">
                            <div className="col">
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    name="rememberDays"
                                    onChange={changeInput}
                                    value={state.rememberDays}
                                    className={getClassForm('rememberDays')}
                                    placeholder="Dias"
                                />
                                <div className="invalid-feedback">Este campo es requerido</div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <label className="form-label col">Activo:</label>
                        </div>
                        <div className="row">
                            <div className="col">
                                <ButtonGroup>
                                    {radios.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={
                                                idx % 2 ? 'outline-primary' : 'outline-primary'
                                            }
                                            name="radio"
                                            value={radio.value}
                                            checked={state.active === radio.value}
                                            onChange={(e) =>
                                                setState({
                                                    ...state,
                                                    active: e.currentTarget.value,
                                                })
                                            }
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer
                        className={state.hasNotify ? 'd-flex justify-content-between' : 'd-flex'}
                    >
                        {state.hasNotify && (
                            <Button
                                variant="outline-warning"
                                type="button"
                                onClick={forzarNotificaciones}
                            >
                                <FontAwesomeIcon
                                    style={{ marginRight: '0.313rem' }}
                                    icon={faBell}
                                    size="1x"
                                />{' '}
                                Activar
                            </Button>
                        )}
                        <div className={state.hasNotify ? 'd-flex justify-content-end' : 'd-flex'}>
                            <Button variant="secondary" type="button" onClick={close}>
                                Cancelar
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
