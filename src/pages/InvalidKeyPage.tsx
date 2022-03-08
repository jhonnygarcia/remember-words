import { Link } from 'react-router-dom';

export const InvalidKeyPage = () => {
    return (
        <div className="container text-center p-4">
            <h4>
                El link ha expirado o ya fue usado. Ir a la página de <Link to="/login">login</Link>
            </h4>
        </div>
    );
};
