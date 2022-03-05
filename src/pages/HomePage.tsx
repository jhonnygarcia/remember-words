import { userTokenStorage } from '../hooks';

export const Home = () => {
    const storageUser = userTokenStorage.getUserStorage();
    return (
        <div className="container">
            <h3 className="text-center">
                Bienvenido <b>{storageUser?.name}</b>, a tu applicación amiga para recordar palabras / textos
            </h3>
            <div className="text-center mt-5 text-muted">Copyright &copy; 2021-2022 &mdash; {'Jhonny Garcia'}</div>
        </div>
    );
};
