export const registerServiceWorker = async () => {
    if (navigator.serviceWorker) {
        const serviceWorkerRegister = await navigator.serviceWorker.register('/sw.js');
        return serviceWorkerRegister;
    }
    return null;
};