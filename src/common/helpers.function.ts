import { AxiosResponse } from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { FormControlValue } from './dto';

const objToQueryString = (obj: any) => {
    return Object.keys(obj).map(key => `${key}=${obj[key] || ''}`).join('&');
}

const dateToFormat = (date: Date | moment.Moment, format?: string) => {
    return moment(date).format(format || 'DD/MM/YYYY');
}

/**
El metodo ejecuta un request Promise de axios, solo retorna un response sin devolver una excepción
@param request:  Promise de axios para ser ejecutado
@param observe:  Si el valor es 'response', se retorna el objecto Response,
Si el valor es 'body' se retorna solo el body del response
@returns: { response: any, success: boolean}
- success: "Se retorna un objeco con la propiedades 'success' en true si todo fue correcto y
    false si fallo" 
- response: la respuesta solo puede ser un Response o Response.Body dependiendo del parametro: 'observe'
*/
const axiosCall = async (config: {
    request: Promise<AxiosResponse>, observe?: 'response' | 'body',
    before?: () => void, after?: () => void
}):
    Promise<{
        response: any;
        success: boolean;
    }> => {
    try {
        if (config.before) config.before();
        const res = await config.request;
        if (config.after) config.after();
        if (config.observe == 'response') {
            return {
                response: res,
                success: true
            };
        }
        return {
            response: res.data,
            success: true
        };
    } catch (error: any) {
        if (config.after) config.after();
        return {
            response: error.response,
            success: false
        };
    }
}
const classValid = <T>(prop: FormControlValue<T>) => {
    const property: any = { ...prop };
    const toString: string = (property.value || '').toString();
    if (prop.dirty) {
        return toString.trim().length > 0 ? 'is-valid' : 'is-invalid';
    }
    return '';
};
const isValid = <T>(controls: FormControlValue<T>[]): boolean => {
    return !controls.some(prop => {
        const value: any = (prop.value || '');
        return String(value).trim().toString().length == 0;
    });
};
const showMsgRequest = (res: { success: boolean, response: any }, extra?: {
    statusFailed: number[],
    actionSuccess?: () => void,
    autoClose?: number
}): void => {
    const statusFailed = extra?.statusFailed || [];
    if (res.success) {
        if (extra?.autoClose) {
            toast.success('Operación realizada exitosamente', {
                autoClose: extra?.autoClose
            });
        } else {
            toast.success('Operación realizada exitosamente');
        }

        if (extra?.actionSuccess) extra.actionSuccess();
    } else if (statusFailed.length > 0 && statusFailed.includes(res.response.status)) {
        toast.warn(res.response.data.message);
    } else {
        toast.error('Ocurrio un erro inesperado');
    }
};
export const helper = { objToQueryString, dateToFormat, axiosCall, classValid, isValid, showMsgRequest }; 