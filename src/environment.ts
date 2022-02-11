interface AppConfig {
    serverUri: string;
}
export const environment: AppConfig = {
    serverUri: window.location.origin
    // serverUri: 'http://localhost:5001'
};