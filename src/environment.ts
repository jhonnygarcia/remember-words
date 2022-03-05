interface AppSettings {
    serverUri: string;
    STORAGE_TOKEN: string;
    ROLE_ADMIN: string;
    STORAGE_USER: string;
}
export const environment: AppSettings = {
    STORAGE_TOKEN: 'token',
    STORAGE_USER: 'user',
    serverUri: process.env.REACT_APP_SERVER_URI || window.location.origin,
    ROLE_ADMIN: 'ADMIN'
};
