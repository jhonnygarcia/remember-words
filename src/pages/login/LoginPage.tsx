import './Login.css';
import { ChangeEvent, FormEvent, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import { useNavigate } from 'react-router-dom';
import { useMutateLogin } from '../../hooks/auth.hook';
import { useQueryClient } from 'react-query';
import { KEY_USER_INFO } from '../../hooks';
import { appRoutes } from '../../common/app.routes';

interface StateLogin {
    username: string;
    password: string;
    dirtyusername: boolean;
    dirtypassword: boolean;
}
type HandleInputChange = ChangeEvent<HTMLInputElement>;
export const LoginPage = () => {
    const captcha = useRef(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const initialState = {
        username: '',
        password: '',
        dirtyusername: false,
        dirtypassword: false
    };
    const [state, setState] = useState<StateLogin>(initialState);
    const [captchaIsValid, setCaptchaIsValid] = useState<boolean | null>(null);
    const [captchaValue, setCaptcha] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { mutate, isLoading } = useMutateLogin();

    const handleInputChange = (e: HandleInputChange) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            [`dirty${e.target.name}`]: true
        });
    };
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setState({
            ...state,
            dirtyusername: true,
            dirtypassword: true
        });

        if (
            state.username.length == 0 ||
            state.password.length == 0 ||
            captchaIsValid == null ||
            captchaIsValid == false
        ) {
            setCaptchaIsValid(false);
            return;
        }
        const payload = {
            username: state.username,
            password: state.password,
            captcha: captchaValue
        };
        mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries(KEY_USER_INFO).then(() => {
                    navigate(appRoutes.main);
                });
            },
            onError: (error: any) => {
                (captcha.current as any)?.reset();
                if (!error.response) {
                    setMessage('Ocurrio un error no controlado contactese con su administrator');
                    return;
                }
                const response = error.response;
                if (response.status == 400 || response.status == 409) {
                    setMessage(response.data.message);
                } else {
                    setMessage('Ocurrio un error no controlado contactese con su administrator');
                }
            }
        });
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
    const onChangeRecaptcha = () => {
        const value = (captcha.current as any)?.getValue();
        const isValid = value != null && value != undefined;
        setCaptchaIsValid(isValid);
        setCaptcha(value);
        setMessage('');
    };
    return (
        <section className="h-100 page-login">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                        <div className="text-center my-5">
                            <img src="/img/icons/icon_x512.png" alt="logo" width="120" />
                        </div>
                        <div className="card shadow-lg">
                            <div className="card-body p-5">
                                <h1 className="fs-4 card-title fw-bold mb-4">Iniciar sesión</h1>
                                <form onSubmit={onSubmit} className="form-login needs-validation">
                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Usuario ó email</label>
                                        <input
                                            className={getClassForm('username')}
                                            name="username"
                                            value={state.username}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Usuario requerido</div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="mb-2 w-100">
                                            <label className="text-muted">Contraseña</label>
                                            <Link tabIndex={-1} className="float-end" to="/login">
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
                                        <div className="invalid-feedback">Contraseña requerida</div>
                                    </div>
                                    {message && (
                                        <div className="mb-3">
                                            <span className="text-danger">{message}</span>
                                        </div>
                                    )}
                                    <div className="g-recaptcha mb-3">
                                        <ReCAPTCHA
                                            ref={captcha}
                                            sitekey="6LfGDZoeAAAAAPOzo8oTL2OIbGgcpaxM1W-VTfHq"
                                            onChange={onChangeRecaptcha}
                                        />
                                    </div>
                                    {captchaIsValid == false && (
                                        <div className="mb-3">
                                            <span className="text-danger">Por favor acepta el captcha !</span>
                                        </div>
                                    )}
                                    <div className="d-flex align-items-center">
                                        <button type="submit" disabled={isLoading} className="btn btn-primary ms-auto">
                                            {isLoading && (
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
                                    {'¿No tienes una cuenta?'} <Link to="/register">Crear una</Link>
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
    );
};
