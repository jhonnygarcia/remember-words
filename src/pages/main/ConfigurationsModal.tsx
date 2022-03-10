import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { Form, Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import { checkNotifications, subriberPushMessages } from '../webpush.utility';
import { registerServiceWorker } from '../../serviceWorker';
import { createHttpClient } from '../../common/http-comon';
import { useQueryConfig, useMutateConfig, KEY_CONFIG } from '../../hooks/config.hook';
import { UserConfigDto } from '../../dto';
import { useQueryClient } from 'react-query';

interface Props {
    show: boolean;
    close: () => void;
}

export const ConfigurationsModal = ({ show, close }: Props) => {
    const [notify, setNotify] = useState(0);
    const [sound, setSound] = useState(0);
    const [spanish, setSpanish] = useState(0);
    const { refetch } = useQueryConfig({
        enabled: false,
        onSuccess: (res: UserConfigDto) => {
            setNotify(res.active_notification == true ? 1 : 0);
            setSound(res.active_sound == true ? 1 : 0);
            setSpanish(res.sort_spanish_first == true ? 1 : 0);
        }
    });
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useMutateConfig();
    const hasUserMedia = () => !!navigator.mediaDevices.getUserMedia;

    const enabledSound = () => {
        if (typeof MediaRecorder === 'undefined' || !hasUserMedia()) {
            toast.info(
                'Tu navegador web no cumple los requisitos; por favor, actualiza a un navegador como Firefox o Google Chrome'
            );
            return;
        }
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
            toast.info('Acceso denegado a las notificaciones, cambie los permisos para permitir acceso a esta pagína');
            return false;
        }
        const httpClient = createHttpClient();
        if (checkNotify.permission == 'granted') {
            await subriberPushMessages(serviceWorkerRegister, httpClient);
            return true;
        }
        const permision = await Notification.requestPermission();
        if (permision === 'granted') {
            await subriberPushMessages(serviceWorkerRegister, httpClient);
            toast.success('¡Notificaciones habilitadas!');
            return true;
        }
        toast.info('Acceso denegado a las notificaciones, no es posible habilitar las notificaciones');
        return false;
    };

    const keyBoardEvent = (event: globalThis.KeyboardEvent) => {
        event.preventDefault();
    };
    const closeButton = () => {
        if (isLoading) return;
        close();
    };
    const changeChequed = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value) == 1 ? 0 : 1;
        if (e.target.name == 'notify') {
            setNotify(value);
        } else if (e.target.name == 'sound') {
            setSound(value);
        } else if (e.target.name == 'order_language') {
            setSpanish(value);
        }
    };
    const save = async () => {
        let payload = {
            active_sound: sound == 1,
            active_notification: notify == 1,
            sort_spanish_first: spanish == 1
        };
        if (payload.active_notification) {
            const result = await enabledNotifications();
            payload = { ...payload, active_notification: result };
        }
        if (payload.active_sound) {
            enabledSound();
        }
        mutate(payload, {
            onSuccess: () => {
                toast.success('se guardó su nueva configuración');
                queryClient.refetchQueries(KEY_CONFIG);
            },
            onError: () => {
                toast.error('Ha ocurrido un error inesperado al modificar su configuración');
            }
        });
    };
    return (
        <Modal backdrop="static" onShow={refetch} show={show} onHide={closeButton} onEscapeKeyDown={keyBoardEvent}>
            <Modal.Header>
                <Modal.Title>Permisos</Modal.Title>
            </Modal.Header>
            <fieldset disabled={isLoading}>
                <Modal.Body style={{ rowGap: '1.25rem' }} className="d-flex flex-column">
                    <div className="d-flex flex-row justify-content-between">
                        <label>Notificaciones</label>
                        <Form.Check
                            onChange={changeChequed}
                            value={notify}
                            name="notify"
                            checked={notify == 1}
                            type="switch"
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                        <label>Microfono</label>
                        <Form.Check
                            onChange={changeChequed}
                            value={sound}
                            name="sound"
                            checked={sound == 1}
                            type="switch"
                        />
                    </div>
                    <div className="d-flex flex-row justify-content-between">
                        <label>{spanish ? 'Español <=> Ingles' : 'Ingles <=> Español'}</label>
                        <Form.Check
                            onChange={changeChequed}
                            value={spanish}
                            name="order_language"
                            checked={spanish == 1}
                            type="switch"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="me-2" variant="secondary" onClick={close}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={save}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </fieldset>
        </Modal>
    );
};
