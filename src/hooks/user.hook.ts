import { useMutation, useQuery } from 'react-query';
import { PagedListDto, UpdateUserDto, UserDto, UsersWherePagedDto } from '../dto';
import { IdentityInfo } from '../dto/identity-info';
import { useAppService } from '../context/app.service';
import { environment } from '../environment';

export const KEY_USERS = 'users';
export const KEY_USER_INFO = 'userinfo';
export const useQueryUsers = (queryFn: () => UsersWherePagedDto, options?: any) => {
    const appService = useAppService();
    const payload = queryFn();
    return useQuery<PagedListDto<UserDto>>(
        [KEY_USERS],
        () => {
            return appService.getUsers(payload).then((res) => res.data as PagedListDto<UserDto>);
        },
        options || {}
    );
};

export const useQueryUser = (queryFn: () => string, options?: any) => {
    const appService = useAppService();
    const id = queryFn();
    return useQuery<UserDto>(
        [KEY_USERS, id],
        () => {
            return appService.getUser(id).then((res) => res.data as UserDto);
        },
        Object.assign({ retry: false }, options || {})
    );
};

export const useQueryUserInfo = (options?: any) => {
    const opt = Object.assign({ retry: false }, options || {});
    return useQuery<IdentityInfo>(
        [KEY_USER_INFO],
        () => {
            const appService = useAppService();
            return appService.userProfile().then((res) => res.data as IdentityInfo);
        },
        opt
    );
};

export const useMutateActivateUser = (options?: any) => {
    const appService = useAppService();
    return useMutation((data: { id: string; active: boolean }) => {
        return appService.setActiveUser(data.id, data.active);
    }, options || {});
};

export const useMutateUpdateUser = (options?: any) => {
    const appService = useAppService();
    const opt = Object.assign({}, options || {});
    return useMutation((data: { id: string; payload: UpdateUserDto }) => {
        return appService.updateUser(data.id, data.payload);
    }, opt);
};

export const useMutateForgot = (options?: any) => {
    const appService = useAppService();
    const opt = Object.assign({}, options || {});
    return useMutation((email: string) => {
        return appService.forgot(email);
    }, opt);
};

const getTokenStorage = (): string | null => {
    try {
        const token = localStorage.getItem(environment.STORAGE_TOKEN);
        return token;
    } catch (e) {
        return null;
    }
};

const getUserStorage = (): IdentityInfo | null => {
    try {
        const value = localStorage.getItem(environment.STORAGE_USER);
        const identityInfo = JSON.parse(value || '');
        return identityInfo;
    } catch (e) {
        return null;
    }
};

const setUserTokenStorage = (data: { user?: IdentityInfo; accessToken?: string }): void => {
    try {
        const { user, accessToken } = data;
        if (user) {
            localStorage.setItem(environment.STORAGE_USER, JSON.stringify(user));
        }
        if (accessToken) {
            localStorage.setItem(environment.STORAGE_TOKEN, accessToken);
        }
    } catch (e) {
        localStorage.removeItem(environment.STORAGE_USER);
        localStorage.removeItem(environment.STORAGE_TOKEN);
    }
};

const cleanUserTokenStorage = (): void => {
    localStorage.removeItem(environment.STORAGE_USER);
    localStorage.removeItem(environment.STORAGE_TOKEN);
};

export const userTokenStorage = {
    getTokenStorage,
    getUserStorage,
    setStorage: setUserTokenStorage,
    cleanStorage: cleanUserTokenStorage
};
