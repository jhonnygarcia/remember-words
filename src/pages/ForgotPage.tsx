import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { helper } from '../common/helpers.function';
import { useMutateForgot } from '../hooks';
import { environment } from '../environment';

export const ForgotPage = () => {
    const initialState = {
        email: { value: '', dirty: false }
    };
    const navigate = useNavigate();
    const captcha = useRef(null);
    const [state, setState] = useState(initialState);
    const [captchaIsValid, setCaptchaIsValid] = useState<boolean | null>(null);
    const [captchaValue, setCaptcha] = useState<string>('');
    const { isLoading, mutate } = useMutateForgot();
    const [message, setMessage] = useState<string>('');

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({
            ...state,
            email: { ...state.email, dirty: true }
        });
        const isValid = helper.isValid([state.email]);
        if (!isValid || captchaIsValid == null || captchaIsValid == false) {
            setCaptchaIsValid(false);
            return;
        }
        const payload = {
            email: state.email.value,
            captcha: captchaValue
        };
        mutate(payload, {
            onSuccess: () => {
                navigate('/forgot-success', {
                    state: { email: state.email.value }
                });
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
        setMessage('');
    };
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
                                <h1 className="fs-4 card-title text-center fw-bold my-4">Recuperar contraseña</h1>
                                <form autoComplete="off" onSubmit={onSubmit} className="form-login needs-validation">
                                    <div className="mb-2">
                                        <label className="mb-2 text-muted">Email</label>
                                        <input
                                            className={`form-control ${helper.classValid(state.email)}`}
                                            name="email"
                                            type="email"
                                            value={state.email.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Nombre de usuario requerido</div>
                                    </div>
                                    <div className="g-recaptcha mb-3">
                                        <ReCAPTCHA
                                            ref={captcha}
                                            sitekey={environment.CAPTCHA_PUBLIC}
                                            onChange={onChangeRecaptcha}
                                        />
                                    </div>
                                    {captchaIsValid == false && (
                                        <div className="mb-3">
                                            <span className="text-danger">Por favor acepta el captcha !</span>
                                        </div>
                                    )}
                                    {message && (
                                        <div className="mb-3">
                                            <span className="text-danger">{message}</span>
                                        </div>
                                    )}
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
                                            {' Enviar'}
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
