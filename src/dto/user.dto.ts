import { WherePagedDto } from '../context/parameters';

export interface UserDto {
    _id: string;
    name: string;
    username: string;
    email: string;
    roles: string[];
    created_at: Date;
    active: boolean;
    hasNotify: boolean;
}
export interface UsersWherePagedDto extends WherePagedDto {
    active?: boolean;
}

export interface UpdateUserDto {
    username?: string;
    password?: string;
    name?: string;
    email?: string;
}
