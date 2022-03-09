import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { helper } from '../../common/helpers.function';
import { useMutateSendAllNofity, useMutateSendNofity } from '../../hooks/notify.hook';

type HandleInputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export const SendNotificaton = () => {
    const initialState = {
        title: { value: '', dirty: false },
        message: { value: '', dirty: false }
    };
    const navigate = useNavigate();
    const [state, setState] = useState(initialState);
    const { userId } = useParams();
    const { mutate: notityUser, isLoading: isLoadingSingle } = useMutateSendNofity();
    const { mutate: notifyAll, isLoading: isLoadingAll } = useMutateSendAllNofity();
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState({
            ...state,
            title: { ...state.title, dirty: true },
            message: { ...state.message, dirty: true }
        });
        const isValid = helper.isValid([state.title, state.message]);
        if (!isValid) {
            return;
        }
        const payload = {
            title: state.title.value,
            message: state.message.value
        };
        if (userId) {
            notityUser(
                { ...payload, userId },
                {
                    onSuccess: () => {
                        setState(initialState);
                    }
                }
            );
        } else {
            notifyAll(payload, {
                onSuccess: () => {
                    setState(initialState);
                }
            });
        }
    };
    const handleInputChange = (e: HandleInputChange) => {
        setState({
            ...state,
            [e.target.name]: { value: e.target.value, dirty: true }
        });
    };
    return (
        <fieldset disabled={isLoadingSingle || isLoadingAll} className="h-100 page-user-details px-5 pt-4 pb-5">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-10">
                        <div className="card card-body">
                            <h3 className="text-center card-title">Enviar notificación</h3>
                            <form autoComplete="off" onSubmit={onSubmit} className="form-login needs-validation">
                                <div className="form-group mb-3">
                                    <label className="form-label">Titulo</label>
                                    <textarea
                                        style={{ width: '100%' }}
                                        cols={30}
                                        rows={2}
                                        className={'form-control ' + helper.classValid(state.title)}
                                        placeholder="Texto"
                                        onChange={handleInputChange}
                                        name="title"
                                        value={state.title.value}
                                    />
                                    <div className="invalid-feedback">Requerido</div>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Mensaje</label>
                                    <textarea
                                        style={{ width: '100%' }}
                                        cols={30}
                                        rows={2}
                                        className={'form-control ' + helper.classValid(state.message)}
                                        placeholder="Mensaje"
                                        onChange={handleInputChange}
                                        name="message"
                                        value={state.message.value}
                                    />
                                    <div className="invalid-feedback">Requerído</div>
                                </div>
                                <div className="row">
                                    <div className="col-auto">
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(-1);
                                            }}
                                            className="btn btn-secondary me-2"
                                        >
                                            Volver
                                        </Link>
                                        <Button variant="primary" type="submit">
                                            {isLoadingSingle ||
                                                (isLoadingAll && (
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                ))}
                                            Enviar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};
