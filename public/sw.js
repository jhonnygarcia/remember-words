function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/');
}

self.addEventListener('push', (e) => {
    const pushData = e.data.json();
    const action = pushData.action;
    const sendDate = pushData.sendDate;
    const params = {
        icon: '/img/general_72.png',
        badge: '/general.ico',
        timestamp: formatDate(new Date(sendDate)),
        openUrl: '/',
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
    };
    if (action == 'word') {
        self.registration.showNotification(pushData.data.text, {
            ...params,
            body: data.data.translation,
            icon: '/img/remember_64.png',
            badge: '/favicon.ico',
        });
    } else if (action == 'notify_all') {
        self.registration.showNotification(pushData.data.title, {
            ...params,
            body: pushData.data.message,
        });
    } else if (action == 'create_user') {
        self.registration.showNotification(pushData.data.title, {
            ...params,
            body: pushData.data.message,
            data: pushData.data.data,
        });
    }
});

self.addEventListener('fetch', (event) => {
    const offlineResp = new Response(`    
    Bienvenido a mi Página Web
    Disculpa, pero para usar la applicación necesitas de internet
`);
    const resp = fetch(event.request).catch(() => offlineResp);
    event.respondWith(resp);
});
