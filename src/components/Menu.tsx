import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPowerOff } from '@fortawesome/free-solid-svg-icons';
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
    };
    const [state, setState] = useState(initialState);
    const { appService, setToken } = useStateValue();
    const userProfile = async () => {
        const res = await appService.userProfile();
        const profile = res.data as IdentityInfo;
        setState({
            ...state,
            name: profile.login,
        });
    };
    const logout = async (e: MouseEvent) => {
        e.preventDefault();
        await appService.logout();
        setToken('');
    };
    useEffect(() => {
        userProfile();
    }, []);
    return (
        <Navbar className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    {title}
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="collapse navbar-collapse" id="basic-navbar-nav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                onClick={openConfig}
                                title="Notificaciones"
                                className="nav-link"
                                to="/main"
                            >
                                <FontAwesomeIcon icon={faGear} size="2x" />
                            </Link>
                        </li>
                    </ul>
                    <Navbar.Text className="fs-5">
                        <span className="font-monospace">{state.name}</span>{' '}
                        <Link to="/" onClick={logout}>
                            <FontAwesomeIcon icon={faPowerOff} />
                        </Link>
                    </Navbar.Text>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};
