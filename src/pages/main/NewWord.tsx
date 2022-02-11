import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

interface Props {
    openNewWord: () => void;
}
export const NewWord = ({ openNewWord }: Props) => {
    return (
        <>
            <div className="card card-body shadow-lg bg-body rounded">
                <h3 className="card-title">Añadir texto</h3>
                <div>
                    <Button onClick={() => openNewWord()} variant="success" title="Añadir nuevo">
                        <FontAwesomeIcon icon={faAdd} />
                    </Button>
                </div>
            </div>
        </>
    );
};
