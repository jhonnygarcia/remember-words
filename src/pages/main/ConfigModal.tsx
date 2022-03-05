import { ChangeEvent, FormEvent, useState } from 'react';

import moment from 'moment';
import { toast } from 'react-toastify';
import { Form, Modal, ButtonGroup, ToggleButton, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

import { helper } from '../../common/helpers.function';
import { checkNotifications, subriberPushMessages } from '../webpush.utility';
import { registerServiceWorker } from '../../serviceWorker';
import { useAppService } from '../../context/app.service';
import { createHttpClient } from '../../common/http-comon';
import { useQueryConfig, useMutateConfig } from '../../hooks/config.hook';
import { UserConfigDto } from '../../dto';

interface Props {
    show: boolean;
    close: () => void;
}

export const ConfigModal = ({ show, close }: Props) => {
    const [notify, setNotify] = useState(0);
    const [sound, setSound] = useState(0);
    const { refetch } = useQueryConfig({
        enabled: false,
        onSuccess: (res: UserConfigDto) => {
            setNotify(res.active_notification == true ? 1 : 0);
            setSound(res.active_sound == true ? 1 : 0);
        },
    });
    const { mutateAsync, isLoading } = useMutateConfig();
    const hasUserMedia = () => !!navigator.mediaDevices.getUserMedia;

    const enabledSound = () => {
        if (typeof MediaRecorder === 'undefined' || !hasUserMedia()) {
            toast.info(
                'Tu navegador web no cumple los requisitos; por favor, actualiza a un navegador como Firefox o Google Chrome',
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
            toast.info(
                'Acceso denegado a las notificaciones, cambie los permisos para permitir acceso a esta pagína',
            );
            return false;
        }
        const httpClient = createHttpClient();
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
            if (value == 1) {
                await enabledNotifications();
                await mutateAsync({ active_notification: true });
            } else {
                await mutateAsync(
                    { active_notification: false },
                    {
                        onSuccess: () => {
                            toast.success(
                                'Su subscripción a las notificaciones se han desactivado',
                            );
                        },
                    },
                );
            }
            setNotify(value);
        } else {
            if (value == 1) {
                enabledSound();
                await mutateAsync({ active_sound: true });
            } else {
                await mutateAsync({ active_sound: false });
            }

            setSound(value);
        }
    };
    return (
        <Modal
            backdrop="static"
            onShow={refetch}
            show={show}
            onHide={closeButton}
            onEscapeKeyDown={keyBoardEvent}
        >
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </fieldset>
        </Modal>
    );
};
