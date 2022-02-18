import './Menu.css';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faUser, faHouse, faBell } from '@fortawesome/free-solid-svg-icons';
import { MouseEvent, useState } from 'react';
import { useStateValue } from '../context/WordsState';

interface Props {
    title: string;
    openConfig: () => void;
}

export const Menu = ({ title, openConfig }: Props) => {
    const initialState = {
        show: false,
    };
    const [state, setState] = useState(initialState);
    const navigation = useNavigate();
    const { appService, userToken, setUserToken } = useStateValue();

    const logout = async (e: MouseEvent) => {
        e.preventDefault();

        setUserToken(null);
        setState({ ...state, show: false });
        await appService.logout();
        navigation('/login');
    };
    const notificationClick = (e: MouseEvent) => {
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
                        <Offcanvas.Title id="offcanvasNavbarLabel">{title}</Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        <Navbar.Text className="fs-5 align-items-center">
                            <FontAwesomeIcon className="icon-border-radios" icon={faUser} />{' '}
                            <span className="font-bold font-monospace">
                                {userToken?.user?.username}
                            </span>
                        </Navbar.Text>
                        <Nav className="me-auto  mt-3">
                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/"
                                        className="fs-5"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigation('/');
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            className="icon-border-radios"
                                            icon={faHouse}
                                        />{' '}
                                        Home
                                    </Nav.Link>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/"
                                        className="fs-5"
                                        onClick={(e) => {
                                            notificationClick(e);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            className="icon-border-radios"
                                            icon={faBell}
                                        />{' '}
                                        Notificaciones
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
                                        <FontAwesomeIcon
                                            className="icon-border-radios"
                                            icon={faPowerOff}
                                        />{' '}
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
