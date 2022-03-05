import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { WordFormModal } from './WordFormModal';

export const NewWord = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <div className="card card-body shadow-lg bg-body rounded">
                <h3 className="card-title">Añadir texto</h3>
                <div>
                    <Button
                        onClick={() => setShowModal(true)}
                        variant="success"
                        title="Añadir nuevo"
                    >
                        <FontAwesomeIcon icon={faAdd} />
                    </Button>
                </div>
            </div>
            {showModal && <WordFormModal show={showModal} close={() => setShowModal(false)} />}
        </>
    );
};
