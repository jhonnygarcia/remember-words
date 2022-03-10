import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { appRoutes } from '../../common/app.routes';
import { helper } from '../../common/helpers.function';
import { NotificationDto } from '../../dto/notification.dto';
import { useMutateBrandNotification, useQueryNotification } from '../../hooks/notify.hook';

export const NotificationShowPage = () => {
    const { id } = useParams();
    if (!id) return <Navigate to={appRoutes.not_found} />;
    const { isLoading, data, refetch } = useQueryNotification(id, {
        retry: false,
        staleTime: Infinity,
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (not: NotificationDto) => {
            if (!not.open_at) {
                mutate(id, {
                    onSuccess: () => {
                        refetch();
                    }
                });
            }
        }
    });
    const { mutate } = useMutateBrandNotification();
    useEffect(() => {
        refetch();
    }, []);
    return (
        <fieldset disabled={isLoading} className="h-100 page-user-details px-5 pt-4 pb-5">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-10">
                        <div className="card card-body">
                            <h3 className="text-center card-title">Notificación</h3>
                            <div className="row mb-3">
                                <label className="form-label fw-bold col-lg-6 col-md-6 col-sm-12">Titulo</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data?.title}</span>
                            </div>
                            <div className="row mb-3">
                                <label className="form-label fw-bold col-lg-6 col-md-6 col-sm-12">Mensaje</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data?.message}</span>
                            </div>
                            <div className="row mb-3">
                                <label className="form-label fw-bold col-lg-6 col-md-6 col-sm-12">Privacidad</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {data?.user ? 'PRIVADA' : 'PUBLICA'}
                                </span>
                            </div>
                            <div className="row mb-3">
                                <label className="form-label fw-bold col-lg-6 col-md-6 col-sm-12">Enviado</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {helper.toDateTimeFormat(data?.created_at)}
                                </span>
                            </div>
                            <div className="row mb-3">
                                <label className="form-label fw-bold col-lg-6 col-md-6 col-sm-12">Visto</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {helper.toDateTimeFormat(data?.open_at)}
                                </span>
                            </div>
                            <div className="row mb-3">
                                <div className="col-auto">
                                    <Link className="btn btn-secondary" to={appRoutes.notifications}>
                                        Notificaciones
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
