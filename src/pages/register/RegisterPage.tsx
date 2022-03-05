import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { FormControlValue } from '../../dto';
import { helper } from '../../common/helpers.function';
import { InputPassword } from '../../components/Password';
import { useMutateRegister } from '../../hooks/auth.hook';
import { appRoutes } from '../../common/app.routes';

interface RegisterState {
    username: FormControlValue<string>;
    email: FormControlValue<string>;
    name: FormControlValue<string>;
    password: FormControlValue<string>;
}
export const RegisterPage = () => {
    const captcha = useRef(null);
    const initialState = {
        username: { value: '', dirty: false },
        email: { value: '', dirty: false },
        name: { value: '', dirty: false },
        password: { value: '', dirty: false }
    };
    const navigate = useNavigate();
    const [state, setState] = useState<RegisterState>(initialState);
    const [captchaIsValid, setCaptchaIsValid] = useState<boolean | null>(null);
    const [captchaValue, setCaptcha] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const { mutate, isLoading } = useMutateRegister();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({
            ...state,
            username: { ...state.username, dirty: true },
            email: { ...state.email, dirty: true },
            name: { ...state.name, dirty: true },
            password: { ...state.password, dirty: true }
        });
        const isValid = helper.isValid([state.username, state.password, state.email, state.name]);
        if (!isValid || captchaIsValid == null || captchaIsValid == false) {
            setCaptchaIsValid(false);
            return;
        }
        const payload = {
            username: state.username.value,
            email: state.email.value,
            name: state.name.value,
            password: state.password.value,
            captcha: captchaValue
        };
        mutate(payload, {
            onSuccess: () => {
                toast.success(
                    'La cuenta se ha creado exitosamente, una vez los administradores la habiliten se le enviara un correo de confirmación gracias.',
                    {
                        autoClose: 7000
                    }
                );
                navigate(appRoutes.login);
            },
            onError: (error: any) => {
                (captcha.current as any)?.reset();
                if (error.response == null || error.response == undefined) {
                    setMessages(['Ocurrio un error no controlado contactese con su administrator']);
                    return;
                }
                const response = error.response;
                if (response.status == 400) {
                    if (Array.isArray(response.data.message)) {
                        const messages = response.data.message as string[];
                        setMessages(messages);
                    } else {
                        setMessages([response.data.message]);
                    }
                } else {
                    setMessages(['Ocurrio un error no controlado contactese con su administrator']);
                }
            }
        });
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: { value: e.target.value, dirty: true }
        });
    };
    const onChangeRecaptcha = () => {
        const value = (captcha.current as any)?.getValue();
        const isValid = value != null && value != undefined;
        setCaptchaIsValid(isValid);
        setCaptcha(value);
        setMessages([]);
    };
    const marginB = 'mb-2';
    useEffect(() => {
        setState({
            ...state,
            username: { value: '', dirty: false },
            email: { value: '', dirty: false },
            name: { value: '', dirty: false },
            password: { value: '', dirty: false }
        });
    }, []);
    return (
        <fieldset disabled={isLoading} className="h-100">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                        <div className="text-center pt-4">
                            <img src="/img/icons/icon_x192.png" alt="logo" width="100" />
                        </div>
                        <div className="card shadow-lg mt-4">
                            <div className="card-body px-5 pb-5">
                                <h1 className="fs-4 card-title text-center fw-bold my-4">Registrarme</h1>
                                <form autoComplete="off" onSubmit={onSubmit} className="form-login needs-validation">
                                    <div className={marginB}>
                                        <label className="mb-2 text-muted">Usuario</label>
                                        <input
                                            className={`form-control ${helper.classValid(state.username)}`}
                                            name="username"
                                            value={state.username.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Nombre de usuario requerido</div>
                                    </div>

                                    <div className={marginB}>
                                        <label className="mb-2 text-muted">Email</label>
                                        <input
                                            className={`form-control ${helper.classValid(state.email)}`}
                                            name="email"
                                            type="email"
                                            value={state.email.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Email requerido</div>
                                    </div>

                                    <div className={marginB}>
                                        <label className="mb-2 text-muted">Nombre</label>
                                        <input
                                            className={`form-control ${helper.classValid(state.name)}`}
                                            name="name"
                                            value={state.name.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Nombre requerido</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Contraseña</label>
                                        <InputPassword
                                            autoComplete="off"
                                            show={false}
                                            className={`form-control ${helper.classValid(state.password)}`}
                                            name="password"
                                            value={state.password.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Contraseña</div>
                                    </div>
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
                                    {messages.length > 0 &&
                                        messages.map((msg, index) => (
                                            <div key={index} className="mb-3">
                                                <span className="text-danger">{msg}</span>
                                            </div>
                                        ))}
                                    <div className="d-flex align-items-center">
                                        <Link type="button" to="/login" className="btn btn-secondary">
                                            Volver
                                        </Link>
                                        <button type="submit" disabled={isLoading} className="btn btn-primary ms-auto">
                                            {isLoading && (
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            {' Registrarme'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="text-center mt-5 text-muted">
                            Copyright &copy; 2021-2022 &mdash; {'Jhonny Garcia'}
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};
