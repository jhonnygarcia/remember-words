import './Menu.css';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faUser, faUsersGear, faFileWord, faGear, faBell } from '@fortawesome/free-solid-svg-icons';
import { MouseEvent, useState } from 'react';
import { useAppService } from '../context/app.service';
import { environment } from '../environment';
import { userTokenStorage, KEY_USER_INFO } from '../hooks';
import { useQueryClient } from 'react-query';
import { appRoutes } from '../common/app.routes';

interface Props {
    title: string;
    openConfig: () => void;
}

export const Menu = ({ title, openConfig }: Props) => {
    const initialState = {
        show: false
    };

    const queryClient = useQueryClient();
    const identityInfo = userTokenStorage.getUserStorage();
    const appService = useAppService();
    const [state, setState] = useState(initialState);
    const navigate = useNavigate();

    const logout = async (e: MouseEvent) => {
        e.preventDefault();
        setState({ ...state, show: false });
        await appService.logout();
        navigate(appRoutes.login);
        await queryClient.invalidateQueries(KEY_USER_INFO);
    };
    const permisosClick = (e: MouseEvent) => {
        e.preventDefault();
        openConfig();
    };
    return (
        <Navbar variant="dark" expand={false} bg="primary">
            <Container fluid>
                <Navbar.Brand>{title}</Navbar.Brand>
                <Navbar.Toggle
                    onClick={() => {
                        setState({ ...state, show: true });
                    }}
                    aria-controls="responsive-navbar-nav"
                />
                <Navbar.Offcanvas
                    show={state.show}
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                    onHide={() => {
                        setState({ ...state, show: false });
                    }}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">
                            <Link
                                onClick={(e) => setState({ ...state, show: false })}
                                style={{ textDecoration: 'none' }}
                                to="/home"
                            >
                                {title}
                            </Link>
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        <Nav className="me-auto  mt-3">
                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/profile"
                                        className="fs-5"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/users/${identityInfo?.sub}/edit`);
                                            setState({ ...state, show: false });
                                        }}
                                    >
                                        <FontAwesomeIcon className="icon-border-radios" icon={faUser} size="1x" />{' '}
                                        {identityInfo?.username}
                                    </Nav.Link>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/main"
                                        className="fs-5"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/main');
                                            setState({ ...state, show: false });
                                        }}
                                    >
                                        <FontAwesomeIcon className="icon-border-radios" icon={faFileWord} size="1x" />{' '}
                                        Textos
                                    </Nav.Link>
                                </div>
                            </div>

                            {identityInfo?.roles.some((r) => r == environment.ROLE_ADMIN) && (
                                <div className="row mb-3">
                                    <div className="col-auto row-menu-link">
                                        <Nav.Link
                                            href="/users"
                                            className="fs-5"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/users');
                                                setState({ ...state, show: false });
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                className="icon-border-radios"
                                                size="1x"
                                                icon={faUsersGear}
                                            />{' '}
                                            Usuarios
                                        </Nav.Link>
                                    </div>
                                </div>
                            )}
                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/notifications"
                                        className="fs-5"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/notifications');
                                            setState({ ...state, show: false });
                                        }}
                                    >
                                        <FontAwesomeIcon className="icon-border-radios" size="1x" icon={faBell} />{' '}
                                        Notificaciones
                                    </Nav.Link>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/config"
                                        className="fs-5"
                                        onClick={(e) => {
                                            permisosClick(e);
                                            setState({ ...state, show: false });
                                        }}
                                    >
                                        <FontAwesomeIcon className="icon-border-radios" size="1x" icon={faGear} />{' '}
                                        Configuración
                                    </Nav.Link>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        className="fs-5"
                                        onClick={(e) => {
                                            logout(e);
                                        }}
                                    >
                                        <FontAwesomeIcon className="icon-border-radios" size="1x" icon={faPowerOff} />{' '}
                                        Cerrar sesión
                                    </Nav.Link>
                                </div>
                            </div>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};
