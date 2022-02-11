import { AxiosInstance } from 'axios';
import { environment } from '../environment';

const checkNotifications = (): {
    hasSuport: boolean,
    permission: 'granted' | 'denied' | 'default'
} => {
    if (!window.Notification) {
        return { hasSuport: false, permission: 'default' };
    }
    if (Notification.permission === 'granted') {
        return { hasSuport: true, permission: 'granted' };
    }

    return {
        hasSuport: true, permission:
            Notification.permission === 'denied' ? 'denied' : 'default'
    };
};

const subriberPushMessages = async (serviceWorkerRegister: ServiceWorkerRegistration,
    httpClient: AxiosInstance) => {

    const publicKey = await fetch(`${environment.serverUri}/api/key`, { method: 'GET' })
        .then((res) => res.arrayBuffer())
        .then((key) => new Uint8Array(key));

    const subscription = await serviceWorkerRegister.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
    });
    
    await httpClient.post('/api/subscribe', {
        action: 'subscribe',
        subscription,
    });
};

export { checkNotifications, subriberPushMessages }