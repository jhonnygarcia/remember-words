interface AppSettings {
    serverUri: string;
    STORAGE_TOKEN: string;
    ROLE_ADMIN: string;
    STORAGE_USER: string;
    CAPTCHA_PUBLIC: string;
}
export const environment: AppSettings = {
    STORAGE_TOKEN: 'token',
    STORAGE_USER: 'user',
    //serverUri: process.env.REACT_APP_SERVER_URI || window.location.origin,
    serverUri: window.location.origin,
    ROLE_ADMIN: 'ADMIN',
    CAPTCHA_PUBLIC: '6LfGDZoeAAAAAPOzo8oTL2OIbGgcpaxM1W-VTfHq'
};
