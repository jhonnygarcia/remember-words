import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPencil, faBell } from '@fortawesome/free-solid-svg-icons';

import { Button, ButtonGroup, Table, ToggleButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMutateActivateUser, useQueryUsers } from '../../hooks';
import { Paged, PagedInfo } from '../../components/Paged';
import { UserDto } from '../../dto';

export const UsersPage = () => {
    const radios = [
        { name: 'Todos', value: '-1' },
        { name: 'Si', value: '1' },
        { name: 'No', value: '0' }
    ];
    const [active, setActive] = useState('-1');
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState({
        perPage: 10,
        currentPage: 1
    });
    const { data, refetch } = useQueryUsers(
        () => {
            const payload = {
                search,
                active: active == '-1' ? undefined : active == '1',
                page: paginate.currentPage,
                perPage: paginate.perPage
            };
            return payload;
        },
        { enabled: false }
    );
    const { mutate } = useMutateActivateUser({
        onSuccess: () => {
            refetch();
        }
    });
    const getRoles = (roles: string[]) => {
        return (
            <ul>
                {roles.map((rol, index) => (
                    <li key={index}>{rol}</li>
                ))}
            </ul>
        );
    };
    const setActiveUser = (user: UserDto) => {
        mutate({ id: user._id || '', active: user.active });
    };
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
                        <div className="col-md-6 col-sm-12 col-lg-6">
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
                        <div className="col-md-6 col-sm-12 col-lg-6">
                            <label className="mb-3">Activo</label>
                            <div>
                                <ButtonGroup>
                                    {radios.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant={idx % 2 ? 'outline-primary' : 'outline-primary'}
                                            name="radio"
                                            value={radio.value}
                                            checked={active === radio.value}
                                            onChange={(e) => setActive(e.currentTarget.value)}
                                        >
                                            {radio.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Button variant="primary" onClick={() => refetch()}>
                                Buscar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card card-body d-flex flex-column" style={{ overflowX: 'auto' }}>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Login</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.map((user) => (
                            <tr key={user._id} className="">
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{getRoles(user.roles)}</td>
                                <td className="text-center">
                                    {user.hasNotify && (
                                        <Link
                                            to={`/users/${user._id}/notify`}
                                            title="Enviar notificación"
                                            className="me-2"
                                        >
                                            <FontAwesomeIcon icon={faBell} size="1x" className="text-primary" />
                                        </Link>
                                    )}
                                    <Link to={`/users/${user._id}/show`} title="Detalle" className="me-2">
                                        <FontAwesomeIcon icon={faInfoCircle} size="1x" />
                                    </Link>
                                    <Link to={`/users/${user._id}/edit`} title="Editar">
                                        <FontAwesomeIcon icon={faPencil} size="1x" />
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
