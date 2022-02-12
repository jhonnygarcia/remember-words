import './Login.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from '../../context/WordsState';
import { useNavigate } from 'react-router-dom';

interface StateLogin {
    username: string;
    password: string;
    dirtyusername: boolean;
    dirtypassword: boolean;
    loading: boolean;
    message?: string;
}
interface Props {
    loggedinOk: () => void;
}
type HandleInputChange = ChangeEvent<HTMLInputElement>;
export const LoginPage = ({ loggedinOk }: Props) => {
    const { setToken, setUser, appService } = useStateValue();
    const navigate = useNavigate();

    const initialState = {
        username: '',
        password: '',
        dirtyusername: false,
        dirtypassword: false,
        loading: false,
    };
    const [state, setState] = useState<StateLogin>(initialState);
    const handleInputChange = (e: HandleInputChange) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            [`dirty${e.target.name}`]: true,
        });
    };
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setState({
            ...state,
            dirtyusername: true,
            dirtypassword: true,
        });

        if (state.username.length == 0 || state.password.length == 0) {
            return;
        }

        setState({
            ...state,
            loading: true,
        });

        try {
            const response = await appService.login(state.username, state.password);
            setToken(response.data.accessToken);
            setUser(response.data.user);
            loggedinOk();
            navigate('/main');
        } catch (error) {
            setState({
                ...state,
                message: 'Credenciales incorrectas',
                loading: false,
            });
        }
    };
    const getClassForm = (name: string) => {
        const form: any = { ...state };
        const dirty: boolean = form[`dirty${name}`];
        const value: string = form[name];
        if (dirty) {
            return (value.trim().length > 0 ? 'is-valid' : 'is-invalid') + ' form-control';
        }
        return 'form-control';
    };
    return (
        <>
            <section className="h-100">
                <div className="container h-100">
                    <div className="row justify-content-sm-center h-100">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                            <div className="text-center my-5">
                                <img src="/img/remember_512.png" alt="logo" width="100" />
                            </div>
                            <div className="card shadow-lg">
                                <div className="card-body p-5">
                                    <h1 className="fs-4 card-title fw-bold mb-4">Iniciar sesión</h1>
                                    <form
                                        onSubmit={onSubmit}
                                        className="form-login needs-validation"
                                    >
                                        <div className="mb-3">
                                            <label className="mb-2 text-muted">
                                                Usuario ó email
                                            </label>
                                            <input
                                                className={getClassForm('username')}
                                                name="username"
                                                value={state.username}
                                                onChange={handleInputChange}
                                            />
                                            <div className="invalid-feedback">
                                                Usuario requerido
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="mb-2 w-100">
                                                <label className="text-muted">Contraseña</label>
                                                <Link
                                                    tabIndex={-1}
                                                    className="float-end"
                                                    to="/login"
                                                >
                                                    Olvide mi contraseña
                                                </Link>
                                            </div>
                                            <input
                                                className={getClassForm('password')}
                                                type="password"
                                                name="password"
                                                value={state.password}
                                                onChange={handleInputChange}
                                            />
                                            <div className="invalid-feedback">
                                                Contraseña requerida
                                            </div>
                                        </div>
                                        {state.message && (
                                            <div className="mb-3">
                                                <span className="text-danger">
                                                    Credenciales incorrectas
                                                </span>
                                            </div>
                                        )}
                                        <div className="d-flex align-items-center">
                                            <button
                                                type="submit"
                                                disabled={state.loading}
                                                className="btn btn-primary ms-auto"
                                            >
                                                {state.loading && (
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                )}
                                                {' Ingresar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer py-3 border-0">
                                    <div className="text-center">
                                        {'¿No tienes una cuenta?'}{' '}
                                        <Link to="/login">Crear una</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-5 text-muted">
                                Copyright &copy; 2021-2022 &mdash; {'Jhonny Garcia'}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
