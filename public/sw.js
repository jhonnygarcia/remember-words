const CACHE_STATIC_NAME = 'learn-remembers-cache-v1';
const CACHE_INMUTABLE_NAME = 'learn-remembers-inmutable-v1';
var urlsToCache = [
    'icon_x48.png',
    'icon_x72.png',
    'icon_x96.png',
    'icon_x128.png',
    'icon_x192.png',
    'icon_x384.png',
    'icon_x512.png',
    'admin_x128.png',
    'favicon.ico',
    'admin.ico'
];

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('/');
}
function show_notity_word_from_job(word_id, callback) {
    const dbname = 'remembersdb';
    const tb_jobs = 'tb_jobs';
    const request = indexedDB.open(dbname, 1);
    let table_not_found = false;
    request.onupgradeneeded = () => {
        try {
            const store = request.transaction.objectStore(tb_jobs);
            console.log('[0]existe objectStore: tb_jobs');
        } catch (e) {
            table_not_found = true;
            //crear tabla set_interval
            console.log('[0]no existe objectStore: tb_jobs');
        }
    };
    request.onsuccess = (event) => {
        if (table_not_found) {
            return;
        }

        console.log('[0]open_db: onsuccess');
        const db = event.target.result;

        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');
        // report on the success of the transaction completing, when everything is done
        tran_tb_jobs.oncomplete = (event) => {
            console.log('[0]se completo la transaccion', event);
        };

        tran_tb_jobs.onerror = (event) => {
            console.log('[0]hubo un error en la transaccion', event);
        };
        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        let res_job_get = store_tb_jobs.get(word_id);
        res_job_get.onsuccess = (event_get) => {
            console.log('[0] succes-in-get', event);
            const data_result = event_get.target.result;
            if (data_result) {
                const new_repeat_remember = data_result.repeat_remember - 1;
                if (new_repeat_remember <= 0) {
                    deleted_kill_all_word(true, false, data_result.id);
                } else {
                    store_tb_jobs.put({
                        ...data_result,
                        repeat_remember: new_repeat_remember
                    });
                }

                self.registration.showNotification(data_result.data.text, {
                    icon: '/img/icons/icon_x128.png',
                    badge: '/favicon.ico',
                    timestamp: formatDate(new Date(data_result.date)),
                    openUrl: '/',
                    vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
                    body: data_result.data.translation
                });

                console.log('Se ha notificado el word con ID', word_id);
            } else {
                console.log('sea ha borrado el job con Id', word_id);
            }
        };
        db.close();
    };
}
function deleted_kill_all_word(isDeleted, isKill, word_id) {
    const indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB;
    if (indexedDB) {
        console.log('IndexedDB is supported.');
    } else {
        console.log('IndexedDB is not supprorted.');
        return;
    }
    const dbname = 'remembersdb';
    const tb_jobs = 'tb_jobs';

    //creamos la BBDD
    const request = indexedDB.open(dbname, 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('onupgradeneeded');
        try {
            const store = request.transaction.objectStore(tb_jobs);
            console.log('existe objectStore: tb_jobs');
        } catch (e) {
            //crar tabla set_interval
            const storeJobs = db.createObjectStore(tb_jobs, { keyPath: 'id' });
            storeJobs.createIndex(`${tb_jobs}_id_unqiue`, 'id', { unique: true });
            console.log('no existe objectStore: tb_jobs');
        }
    };

    request.onsuccess = (event) => {
        console.log('open_db: onsuccess');
        const db = event.target.result;

        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');

        console.log('created_transaction: OK');

        // report on the success of the transaction completing, when everything is done
        tran_tb_jobs.oncomplete = (event) => {
            console.log('se completo la transaccion', event);
        };

        tran_tb_jobs.onerror = (event) => {
            console.log('hubo un error en la transaccion', event);
        };

        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        console.log('objectStore creado: tb_jobs');

        if (isKill) {
            const resClear = store_tb_jobs.clear();
            resClear.onsuccess = () => {
                console.log('success clear jobs');
            };
            self.registration.getTags().then((tags) => {
                tags.forEach((tag) => {
                    self.registration.periodicSync.unregister(tag);
                });
            });
        } else if (isDeleted) {
            console.log('buscar por id: ' + word_id);
            try {
                let res_get = store_tb_jobs.get(word_id);
                res_get.onsuccess = (event_get) => {
                    const data_result = event_get.target.result;
                    if (data_result) {
                        console.log('se encontro en el storage: ', data_result);

                        self.registration.periodicSync.unregister(data_result.id);

                        console.log('job unregister');
                        store_tb_jobs.delete(word_id);
                        console.log('se elimino el job', word_id);
                    }
                };

                res_get.onerror = (eventError) => {
                    console.log('ocurrio un error al ejecutar el metodo: get', eventError);
                };
            } catch (e) {
                console.log('ocurrio un error al ejecutar el metodo: get', e);
            }
        }
        db.close();
    };
}

function created_user(data, pushParams) {
    self.registration.showNotification(data.title, {
        ...pushParams,
        body: data.message,
        icon: '/img/admin_x128.png',
        badge: '/img/admin.ico',
        data: {
            url: `/users/${data.userId}`
        }
    });
}
function notify_all(data, pushParams) {
    self.registration.showNotification(data.title, {
        ...pushParams,
        body: data.message,
        icon: '/img/admin_x128.png',
        badge: '/img/admin.ico'
    });
}

function createRememberWord(word_id, time) {
    setTimeout(() => {
        show_notity_word_from_job(word_id, () => {
            createRememberWord(word_id, time);
        });
    }, time);
}

function create_periodic_background_job(pushData) {
    const indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB;
    if (indexedDB) {
        console.log('IndexedDB is supported.');
    } else {
        console.log('IndexedDB is not supprorted.');
        return;
    }

    const dataMessage = pushData.data;
    const timeNow = pushData.sendDate;
    const word_id = pushData.data.id;
    console.log(pushData);

    const dbname = 'remembersdb';
    const tb_jobs = 'tb_jobs';
    const request = indexedDB.open(dbname, 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('[0]onupgradeneeded');
        try {
            const store = request.transaction.objectStore(tb_jobs);
            console.log('[0]existe objectStore: tb_jobs');
        } catch (e) {
            //crar tabla set_interval
            const storeJobs = db.createObjectStore(tb_jobs, { keyPath: 'id' });
            storeJobs.createIndex(`${tb_jobs}_id_unqiue`, 'id', { unique: true });
            console.log('no existe objectStore: tb_jobs');
        }
    };
    request.onsuccess = (event) => {
        console.log('[0]open_db: onsuccess');
        const db = event.target.result;

        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');
        // report on the success of the transaction completing, when everything is done
        tran_tb_jobs.oncomplete = (event) => {
            console.log('[0]se completo la transaccion', event);
        };

        tran_tb_jobs.onerror = (event) => {
            console.log('[0]hubo un error en la transaccion', event);
        };
        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        let res_job_get = store_tb_jobs.get(word_id);
        res_job_get.onsuccess = (event_get) => {
            console.log('[0] succes-in-get', event);
            const data_result = event_get.target.result;

            if (data_result) {
                console.log(`[0] existe el registro con id: ${word_id}`, event);
                self.registration.periodicSync.unregister(word_id);
                const resPut = store_tb_jobs.put({
                    id: word_id,
                    each_minutes: dataMessage.each_minutes,
                    repeat_remember: dataMessage.repeat_remember,
                    time: timeNow,
                    data: { text: dataMessage.text, translation: dataMessage.translation }
                });
                resPut.onsuccess = () => {
                    console.log('[0] .periodicSync.register');
                    self.registration.periodicSync
                        .register(word_id, {
                            minInterval: dataMessage.each_minutes * 60 * 1000,
                            minPeriod: dataMessage.each_minutes * 60 * 1000,
                            minDelay: dataMessage.each_minutes * 60 * 1000
                        })
                        .then((res) => {
                            console.log('si se pudo registrar 1', res);
                        })
                        .catch((error) => {
                            console.log('no se pudo registrar 1', error);
                        });
                    console.log('[0] .periodicSync.register succes');
                };
            } else {
                const resAdd = store_tb_jobs.add({
                    id: word_id,
                    each_minutes: dataMessage.each_minutes,
                    repeat_remember: dataMessage.repeat_remember,
                    time: timeNow,
                    data: { text: dataMessage.text, translation: dataMessage.translation }
                });
                resAdd.onsuccess = () => {
                    console.log('[1] .periodicSync.register', {
                        word_id,
                        minutes: dataMessage.each_minutes
                    });
                    self.registration.periodicSync
                        .register(word_id, {
                            minInterval: dataMessage.each_minutes * 60 * 1000,
                            minPeriod: dataMessage.each_minutes * 60 * 1000,
                            minDelay: dataMessage.each_minutes * 60 * 1000
                        })
                        .then((res) => {
                            console.log('si se pudo registrar 1', res);
                        })
                        .catch((error) => {
                            console.log('no se pudo registrar 1', error);
                        });
                    console.log('[2] .periodicSync.register succes');
                };
            }
        };

        db.close();
    };
}
self.addEventListener('push', (e) => {
    const pushData = e.data.json();
    console.log(pushData);
    const action = pushData.action;
    const sendDate = pushData.sendDate;
    const params = {
        icon: '/img/icons/icon_x128.png',
        badge: '/favicon.ico',
        timestamp: formatDate(new Date(sendDate)),
        openUrl: '/',
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600]
    };
    switch (action) {
        case 'created_word':
            create_periodic_background_job(pushData);
            break;
        case 'updated_word':
            let calcAction = 'updated_word';
            if (pushData.data.complete) {
                calcAction = 'deleted_word';
                deleted_kill_all_word(true, false, pushData.data.id);
            }
            if (!pushData.data.each_minutes || !pushData.data.repeat_remember) {
                calcAction = 'deleted_word';
                deleted_kill_all_word(true, false, pushData.data.id);
            }
            if (calcAction === 'updated_word') {
                create_periodic_background_job(pushData);
            }
            break;
        case 'deleted_word':
            deleted_kill_all_word(true, false, pushData.data.id);
            break;
        case 'created_user':
            created_user(pushData.data, params);
            break;
        case 'notify_all':
            notify_all(pushData.data, params);
            break;
        case 'kill_all_notify':
            deleted_kill_all_word(false, true, pushData.data.id);
            break;
        default:
            console.log('invalid action: ' + action);
            break;
    }
});

self.addEventListener('fetch', (event) => {
    if (!urlsToCache.some((url) => event.request.url.includes(url))) {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
        );
    }
});

self.addEventListener('install', (e) => {
    const cacheProm = caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    });

    e.waitUntil(Promise.all([cacheProm]));
});

self.addEventListener('notificationclose', (e) => {});

self.addEventListener('notificationclick', (e) => {
    const notification = e.notification;
    if (notification.data?.url) {
        const result = clients.matchAll().then((tabs) => {
            const tabOpen = tabs.find((t) => t.visibilityState == 'visible');
            if (tabOpen) {
                tabOpen.navigate(notification.data.url);
                tabOpen.focus();
            } else {
                clients.openWindow(notification.data.url);
            }
            return notification.close();
        });
        e.waitUntil(result);
    }
});
