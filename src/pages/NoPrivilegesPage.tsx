import { Link } from 'react-router-dom';
import { appRoutes } from '../common/app.routes';

export const NoPrivilegesPage = () => {
    return (
        <div className="container p-5 text-center">
            <h3>
                No tiene los privilegios para ingresar a esta ruta volver a la pagina de{' '}
                <Link to={appRoutes.login}>Login</Link>
            </h3>
        </div>
    );
};
