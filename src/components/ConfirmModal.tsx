import { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';

interface Props {
    show: boolean;
    title: string;
    children: any;
    okAction: () => void | Promise<void>;
    cancelAction: () => void;
}
export const ConfirmModal = ({ show, title, children, okAction, cancelAction }: Props) => {
    const initialState = {
        loading: false,
    };
    const [state, setState] = useState(initialState);
    const confirmOk = async () => {
        setState({ ...state, loading: true });
        await okAction();
        setState({ ...state, loading: false });
        cancelAction();
    };
    return (
        <>
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={cancelAction} variant="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={confirmOk} variant="primary">
                        {state.loading && (
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
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
