import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
interface Props {
    title: string;
    openConfig: () => void;
}

export const Menu = ({ title, openConfig }: Props) => {
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
                            <Link onClick={openConfig} title="Notificaciones" className="nav-link" to="/main">
                                <FontAwesomeIcon icon={faGear} size="2x" />
                            </Link>
                        </li>
                    </ul>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};
