import './Menu.css';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faUser, faHouse, faBell } from '@fortawesome/free-solid-svg-icons';
import { MouseEvent, useEffect, useState } from 'react';
import { useStateValue } from '../context/WordsState';
import { IdentityInfo } from '../common/dto/identity-info';
interface Props {
    title: string;
    openConfig: () => void;
}

export const Menu = ({ title, openConfig }: Props) => {
    const initialState = {
        name: '',
        show: false,
    };
    const [state, setState] = useState(initialState);
    const navigation = useNavigate();
    const { appService, setToken } = useStateValue();
    const userProfile = async () => {
        const res = await appService.userProfile();
        const profile = res.data as IdentityInfo;
        setState({
            ...state,
            name: profile.login,
        });
    };
    const logout = async () => {
        await appService.logout();
        setToken('');
    };
    const cancelLink = (e: MouseEvent, to?: string) => {
        e.preventDefault();
        setState({ ...state, show: false });
        if (to) navigation(to);
    };
    useEffect(() => {
        userProfile();
    }, []);
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
                            <span className="font-bold font-monospace">{state.name}</span>
                        </Navbar.Text>
                        <Nav className="me-auto  mt-3">
                            <div className="row mb-3">
                                <div className="col-auto row-menu-link">
                                    <Nav.Link
                                        href="/"
                                        className="fs-5"
                                        onClick={(e) => {
                                            cancelLink(e, '/');
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
                                            cancelLink(e);
                                            openConfig();
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
                                        href="/"
                                        className="fs-5"
                                        onClick={(e) => {
                                            cancelLink(e);
                                            logout();
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
