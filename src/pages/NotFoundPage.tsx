import { Link } from 'react-router-dom';
import { appRoutes } from '../common/app.routes';

export const NotFoundPage = () => {
    return (
        <div className="container text-center p-4">
            <h4>
                El recurso no ha sido eliminado o no existe, Ir a pagina <Link to={appRoutes.main}>principal</Link>
            </h4>
        </div>
    );
};
