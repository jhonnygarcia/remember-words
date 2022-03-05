import { Button } from 'react-bootstrap';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appRoutes } from '../../common/app.routes';
import { helper } from '../../common/helpers.function';
import { useQueryUser, useMutateActivateUser } from '../../hooks';

export const UserPage = () => {
    const { id } = useParams();
    if (!id) return <Navigate to={appRoutes.not_found} />;

    const navigate = useNavigate();
    const { data, refetch } = useQueryUser(
        () => {
            return id || '';
        },
        {
            onError: (error: any) => {
                if (error.response.status === 404) {
                    toast.warn('No existe ningún usuario con el ID proporcionado');
                    navigate(appRoutes.users);
                } else if (error.response.status === 401) {
                    toast.warn('Usted no tiene permisos de administrador para ver otras cuentas');
                    navigate(appRoutes.users);
                } else {
                    toast.error('Ocurrio un error inesperado');
                }
            }
        }
    );
    const { isLoading, mutate } = useMutateActivateUser({
        onSuccess: () => {
            toast.success('Activación de cuenta realizada con éxito');
            refetch();
        }
    });

    return !data ? null : (
        <fieldset disabled={isLoading} className="h-100 page-user-details px-5 pt-4 pb-5">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-10">
                        <div className="card card-body">
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Nombre</label>
                                <span className="col-lg-auto col-md-6 col-sm-12">{data.name}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Activo</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.active ? 'Si' : 'No'}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Email</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.email}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Usuario</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.username}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Roles</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.roles.join(', ')}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Creado</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {helper.toDateTimeFormat(data.created_at)}
                                </span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Notificaciones</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {data.hasNotify ? 'Habilitadas' : 'Desabilitadas'}
                                </span>
                            </div>
                            <div className="row">
                                <div className="col-auto">
                                    <Button
                                        onClick={() => mutate({ id: id || '', active: !data.active })}
                                        variant="primary"
                                        className="me-2"
                                    >
                                        {isLoading && (
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        )}
                                        {data.active ? ' Inactivar' : ' Activar'}
                                    </Button>
                                    <Link to="/users" className="btn btn-secondary">
                                        Ir al Listado
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};
