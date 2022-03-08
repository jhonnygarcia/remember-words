import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export const ForgotSuccessPage = () => {
    return (
        <div className="container text-center p-4">
            <h4>
                <FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon> Se envio un link para cambiar su contraseña a a
                su correo electronico. Ir a la pagina de <Link to="/login">login</Link>
            </h4>
        </div>
    );
};
