export interface IdentityInfo {
    sub: string;
    name: string;
    login: string;
    username: string;
    email: string;
    hasNotify: boolean;
    roles: string[];
}

export interface TokenUserIdentity {
    user: IdentityInfo;
    accessToken: string;
}