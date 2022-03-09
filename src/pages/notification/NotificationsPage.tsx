import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Paged, PagedInfo } from '../../components/Paged';
import { useQueryNotifications } from '../../hooks/notify.hook';
import { helper } from '../../common/helpers.function';
import { appRoutes } from '../../common/app.routes';
import { userTokenStorage } from '../../hooks';
import { environment } from '../../environment';

export const NotificationsPage = () => {
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState({
        perPage: 10,
        currentPage: 1
    });
    const userStorage = userTokenStorage.getUserStorage();
    const { data, refetch } = useQueryNotifications(
        () => {
            const payload = {
                search,
                page: paginate.currentPage,
                perPage: paginate.perPage
            };
            return payload;
        },
        { enabled: false }
    );

    const pageChanged = (info: PagedInfo) => {
        setPaginate({
            ...paginate,
            currentPage: info.currentPage
        });
    };
    useEffect(() => {
        refetch();
    }, [paginate]);
    return (
        <div className="container p-4 page-users d-flex flex-column">
            <div className="card mb-2">
                <div className="card-body">
                    <h5>Filtros</h5>
                    <div className="row mb-3">
                        <div className="col">
                            <label className="mb-3">Buscar</label>
                            <input
                                type="text"
                                value={search}
                                className="form-control"
                                placeholder="Buscar"
                                name="search"
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key.toLowerCase() == 'enter') {
                                        refetch();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col ">
                            <Button variant="primary" onClick={() => refetch()}>
                                Buscar
                            </Button>
                            {userStorage?.roles.some((r) => r == environment.ROLE_ADMIN) && (
                                <Link to={appRoutes.notify_all} className="btn btn-primary ms-2">
                                    Nuevo
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="card card-body d-flex flex-column" style={{ overflowX: 'auto' }}>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Titulo</th>
                            <th>Mensaje</th>
                            <th>Privacidad</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!data?.data || data?.data.length == 0) && (
                            <tr>
                                <td className="text-center" colSpan={5}>
                                    No hay notificaciones
                                </td>
                            </tr>
                        )}
                        {data?.data.map((notification) => (
                            <tr key={notification._id} className="">
                                <td>{helper.toDateTimeFormat(notification.created_at)}</td>
                                <td>
                                    <span title={notification.title}>
                                        {notification.title.length > 50
                                            ? notification.title.substring(0, 49) + '...'
                                            : notification.title}
                                    </span>
                                </td>
                                <td>
                                    <span title={notification.message}>
                                        {notification.message.length > 50
                                            ? notification.message.substring(0, 49) + '...'
                                            : notification.message}
                                    </span>
                                </td>
                                <td>{notification.user ? 'PRIVADA' : 'PUBLICA'}</td>
                                <td className="text-center">
                                    <Link
                                        to={`/notifications/${notification._id}/show`}
                                        title="Detalle"
                                        className="me-2"
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} size="1x" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paged
                    totalRecords={data?.meta.totalCount}
                    pageSize={paginate.perPage}
                    currentPage={paginate.currentPage}
                    maxSize={5}
                    onPageChange={pageChanged}
                ></Paged>
            </div>
        </div>
    );
};
