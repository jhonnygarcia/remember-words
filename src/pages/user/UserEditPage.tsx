import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appRoutes } from '../../common/app.routes';
import { FormControlValue, UserDto } from '../../dto';
import { helper } from '../../common/helpers.function';
import { InputPassword } from '../../components/Password';
import { useMutateUpdateUser, useQueryUser, userTokenStorage } from '../../hooks';
import { environment } from '../../environment';

interface UpdateState {
    username: FormControlValue<string | undefined>;
    email: FormControlValue<string | undefined>;
    name: FormControlValue<string | undefined>;
}
export const UserEditPage = () => {
    const initialState = {
        username: { value: '', dirty: false },
        email: { value: '', dirty: false },
        name: { value: '', dirty: false }
    };
    const [state, setState] = useState<UpdateState>(initialState);
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');

    const { id } = useParams();
    if (!id) return <Navigate to={appRoutes.not_found} />;

    const userStorage = userTokenStorage.getUserStorage();
    const navigate = useNavigate();
    const { data, refetch } = useQueryUser(
        () => {
            return id || '';
        },
        {
            enabled: false,
            onSuccess: (data: UserDto) => {
                setState({
                    ...state,
                    username: { value: data.username, dirty: true },
                    email: { value: data.email, dirty: true },
                    name: { value: data.name, dirty: true }
                });
                const role = data.roles.find((r) => true);
                setRol(role || '');
                setTimeout(() => {
                    setPassword('');
                }, 2000);
            },
            onError: (error: any) => {
                if (error.response.status === 404) {
                    toast.warn('No existe ningún usuario con el ID proporcionado');
                    navigate(appRoutes.users);
                } else if (error.response.status === 401) {
                    toast.warn('Usted no tiene permisos de administrador para ver otras cuentas');
                    navigate(appRoutes.users);
                } else {
                    toast.error('Ocurrio un error inesperado');
                }
            }
        }
    );
    const { mutate, isLoading } = useMutateUpdateUser({
        onSuccess: () => {
            toast.success('Los datos han sido actualizados correctamente');
            setPassword('');
            refetch();
        }
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name == 'password') {
            setPassword(e.target.value);
        } else {
            setState({
                ...state,
                [e.target.name]: { value: e.target.value, dirty: true }
            });
        }
    };
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({
            ...state,
            username: { ...state.username, dirty: true },
            email: { ...state.email, dirty: true },
            name: { ...state.name, dirty: true }
        });
        const isValid = helper.isValid([state.username, state.email, state.name]);
        if (!isValid) {
            return;
        }
        const payload = {
            email: state.email.value,
            username: state.username.value,
            name: state.name.value,
            password: password
        };
        mutate({ id, payload });
    };
    const marginB = 'mb-2';
    useEffect(() => {
        refetch();
    }, []);
    return !data ? null : (
        <fieldset disabled={isLoading} className="h-100">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                        <div className="card shadow-lg mt-4">
                            <div className="card-body px-5 pb-5">
                                <h1 className="fs-4 card-title text-center fw-bold my-4">Perfil</h1>
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
                                            className="form-control"
                                            name="password"
                                            value={password}
                                            onChange={handleInputChange}
                                        />
                                        <div className="invalid-feedback">Contraseña</div>
                                    </div>
                                    {userStorage?.roles.some((r) => r == environment.ROLE_ADMIN) && (
                                        <div className="mb-3">
                                            <label className="mb-2 text-muted">Rol</label>
                                            <select
                                                onChange={(e) => setRol(e.target.value)}
                                                className="form-control"
                                                value={rol}
                                            >
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="USER">USER</option>
                                            </select>
                                            <div className="invalid-feedback">Contraseña</div>
                                        </div>
                                    )}
                                    <div className="d-flex align-items-center">
                                        <Link type="button" to="/users" className="btn btn-secondary">
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
                                            {' Guardar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};
