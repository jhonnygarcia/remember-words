interface AppConfig {
    serverUri: string;
    keyTokenStorage: string;
}
export const environment: AppConfig = {
    keyTokenStorage: 'token',
    //serverUri: window.location.origin
    serverUri: 'http://localhost:5001'
};