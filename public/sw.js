self.addEventListener('push', (e) => {
    const pushData = e.data.json();
    const params = {
        icon: '/img/general_72.png',
        badge: '/general.ico',
        timestamp: new Date().format('dd/MM/yyyy'),
        openUrl: '/',
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
    };
    if (pushData.action == 'word') {
        self.registration.showNotification(pushData.data.text, {
            ...params,
            body: data.data.translation,
            icon: '/img/remember_64.png',
            badge: '/favicon.ico',
        });
    } else if (pushData.action == 'general') {
        self.registration.showNotification(pushData.data.title, {
            ...params,
            body: pushData.data.message,
        });
    } else if (pushData.action == 'create_user') {
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

    if (event.request.url.includes('api/')) {
        console.log(event.request);
    }

    event.respondWith(fetch(event.request));
});
