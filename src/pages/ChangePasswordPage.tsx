import '../Captcha.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { appRoutes } from '../common/app.routes';
import { useGetActivateKey, useMutateChangePwd } from '../hooks';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { helper } from '../common/helpers.function';
import { toast } from 'react-toastify';

export const ChangePasswordPage = () => {
    const { key } = useParams();
    const initialState = {
        password: { value: '', dirty: false },
        confirmPassword: { value: '', dirty: false }
    };
    const navigate = useNavigate();
    const [state, setState] = useState(initialState);
    const [message, setMessage] = useState('');
    if (!key) return <Navigate to={appRoutes.not_found} />;
    const {
        isLoading: isLoadingGet,
        data,
        refetch
    } = useGetActivateKey(() => key, {
        retry: false,
        staleTime: Infinity,
        enabled: false,
        refetchOnWindowFocus: false,
        onError: () => {
            navigate('/invalid-key');
        }
    });
    const { isLoading, mutate } = useMutateChangePwd();
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setState({
            ...state,
            password: { ...state.password, dirty: true },
            confirmPassword: { ...state.password, dirty: true }
        });
        const isValid = helper.isValid([state.password, state.confirmPassword]);
        if (!isValid || message.length > 0) {
            return;
        }
        const payload = {
            activateKey: key,
            password: state.password.value
        };
        mutate(payload, {
            onSuccess: () => {
                toast.success('Su contraseña ha sido modificado con éxito', {
                    autoClose: 6000
                });
                navigate(appRoutes.login);
            },
            onError: (error: any) => {
                const response = error.response;
                if (response.status == 400) {
                    if (Array.isArray(response.data.message)) {
                        const messages = response.data.message as string[];
                        toast.warn(messages);
                    } else {
                        toast.warn(response.data.message);
                    }
                } else {
                    toast.error('Ocurrio un error no controlado contactese con su administrator');
                }
            }
        });
    };
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newState = {
            ...state,
            [e.target.name]: { value: e.target.value, dirty: true }
        };
        setState(newState);
        if (
            newState.password.value.length > 0 &&
            newState.confirmPassword.value.length > 0 &&
            newState.password.value != newState.confirmPassword.value
        ) {
            setMessage('Las contraseñas no coinciden');
        } else {
            setMessage('');
        }
    };
    useEffect(() => {
        refetch();
    }, []);
    return (
        <fieldset disabled={isLoadingGet || isLoading} className="h-100">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                        <div className="text-center pt-4">
                            <img src="/img/icons/icon_x192.png" alt="logo" width="100" />
                        </div>
                        <div className="card shadow-lg mt-4">
                            <div className="card-body px-5 pb-5">
                                <h1 className="fs-4 card-title text-center fw-bold my-4">Actualizar contraseña</h1>
                                {data?.name && <h3 className="fs-6 text-center my-4">{data?.name}</h3>}
                                <form autoComplete="off" onSubmit={onSubmit} className="form-login needs-validation">
                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Contraseña</label>
                                        <input
                                            className={`form-control ${helper.classValid(state.password)}`}
                                            name="password"
                                            type="password"
                                            value={state.password.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Campo requerido</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="mb-2 text-muted">Repetir contraseña</label>
                                        <input
                                            className={`form-control ${
                                                message.length > 0
                                                    ? 'is-invalid'
                                                    : helper.classValid(state.confirmPassword)
                                            }`}
                                            name="confirmPassword"
                                            type="password"
                                            value={state.confirmPassword.value}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">
                                            {message.length > 0 ? message : 'Campo requerido'}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
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
