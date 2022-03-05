import { Button, Modal, Spinner } from 'react-bootstrap';

interface Props {
    show: boolean;
    title: string;
    isLoading: boolean;
    children: any;
    ok: () => void | Promise<void>;
    cancel: () => void;
}
export const ConfirmModal = ({ show, title, children, isLoading, ok, cancel }: Props) => {
    return (
        <>
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={cancel} disabled={isLoading} variant="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={ok} disabled={isLoading} variant="primary">
                        {isLoading && (
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
