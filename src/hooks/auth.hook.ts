import { useMutation } from 'react-query';

import { useAppService } from './../context/app.service';
import { LoginDto, RegisterDto } from '../dto';

const KEY_AUTH = 'auth';

export const useMutateLogin = () => {
    const appService = useAppService();
    return useMutation(
        (data: LoginDto) => {
            return appService.login(data);
        }
    );
};

export const useMutateRegister = () => {
    const appService = useAppService();
    return useMutation(
        (data: RegisterDto) => {
            return appService.register(data);
        }
    );
};