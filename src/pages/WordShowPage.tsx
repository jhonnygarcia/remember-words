import { ChangeEvent, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appRoutes } from '../common/app.routes';
import { helper } from '../common/helpers.function';
import { WordDto } from '../dto';
import { useMutateCompleteWord, useQueryWord } from '../hooks';

export const WordShowPage = () => {
    const { id } = useParams();
    if (!id) return <Navigate to={appRoutes.not_found} />;
    const COMPLETE = 'complete';
    const PENDING = 'pending';
    const initialState = {
        complete: PENDING
    };
    const navigate = useNavigate();
    const [state, setState] = useState(initialState);
    const { isLoading: isLoadingComplete, mutate } = useMutateCompleteWord(id, {
        onSuccess: () => {
            if (state.complete == COMPLETE) {
                toast.success('El texto ha sido marcado como completado');
            } else {
                toast.success('El texto ha vuelto a marcarse para seguir recordandose');
            }
            refetch();
        }
    });
    const { isLoading, data, refetch } = useQueryWord(id, {
        retry: false,
        staleTime: Infinity,
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (word: WordDto) => {
            setState({ ...state, complete: word.complete ? COMPLETE : PENDING });
        },
        onError: (error: any) => {
            if (error.response.status === 404) {
                toast.warn('No existe ningún texto con el ID proporcionado');
                navigate(appRoutes.not_found);
            } else if (error.response.status === 400) {
                toast.warn('El recurso le pertenece a otro usuario');
                navigate(appRoutes.main);
            } else {
                toast.error('Ocurrio un error inesperado');
            }
        }
    });
    const changeComplete = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value == COMPLETE ? PENDING : COMPLETE;
        setState({ ...state, complete: value });
        mutate(value == COMPLETE);
    };
    useEffect(() => {
        refetch();
    }, []);
    return !data ? null : (
        <fieldset disabled={isLoading || isLoadingComplete} className="h-100 page-user-details px-5 pt-4 pb-5">
            <div className="container h-100">
                <div className="row justify-content-sm-center h-100">
                    <div className="col-xl-8 col-lg-8 col-md-12 col-sm-10">
                        <div className="card card-body">
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Texto</label>
                                <span className="col-lg-auto col-md-6 col-sm-12">{data.text}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Traducción</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.translation}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Minutos</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.each_minutes}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Repetir</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">{data.repeat_remember}</span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Creado</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {helper.toDateTimeFormat(data.created_at)}
                                </span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Completado</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    {helper.toDateTimeFormat(data.completed_at)}
                                </span>
                            </div>
                            <div className="row">
                                <label className="form-label col-lg-6 col-md-6 col-sm-12">Completar</label>
                                <span className="col-lg-auto col-md-auto col-sm-12">
                                    <Form.Check
                                        onChange={changeComplete}
                                        value={state.complete}
                                        checked={state.complete == COMPLETE}
                                        type="switch"
                                    />
                                </span>
                            </div>

                            <div className="row">
                                <div className="col-auto">
                                    <Link className="form-label" to={appRoutes.main}>
                                        Ir al listado
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
    );
};
