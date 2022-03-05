import { Link } from 'react-router-dom';
import { appRoutes } from '../common/app.routes';

export const NotFoundPage = () => {
    return (
        <div className="container">
            <h3>
                El recurso no ha sido eliminado o no existe, <Link to={appRoutes.main}>Ir a pagina principal</Link>
            </h3>
        </div>
    );
};
