import { AxiosResponse } from 'axios';
import moment from 'moment';

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
const axiosCall = async (config: { request: Promise<AxiosResponse>, observe?: 'response' | 'body' }):
    Promise<{
        response: any;
        success: boolean;
    }> => {
    try {
        const res = await config.request;
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
        return {
            response: error.response,
            success: false
        };
    }
}
export const helper = { objToQueryString, dateToFormat, axiosCall }; 