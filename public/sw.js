const dbname = 'remembersdb';
const tb_jobs = 'tb_jobs';
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
function show_notity_word_from_job(word_id) {
    const request = indexedDB.open(dbname, 1);
    let table_not_found = false;
    request.onupgradeneeded = () => {
        try {
            const store = request.transaction.objectStore(tb_jobs);
        } catch (e) {
            table_not_found = true;
            //crear tabla set_interval
            console.log('show_notity_word_from_job: tb_jobs has been removed');
        }
    };
    request.onsuccess = (event) => {
        if (table_not_found) {
            return;
        }
        const db = event.target.result;
        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');
        // report on the success of the transaction completing, when everything is done
        tran_tb_jobs.oncomplete = (event) => {
            console.log('show_notity_word_from_job: transaction:completed');
        };
        tran_tb_jobs.onerror = (event) => {
            console.log('show_notity_word_from_job: transaction:error', event);
        };

        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        let res_job_get = store_tb_jobs.get(word_id);
        res_job_get.onsuccess = (event_get) => {
            const data_result = event_get.target.result;
            if (data_result) {
                const new_repeat_remember = data_result.repeat_remember - 1;
                if (new_repeat_remember <= 0) {
                    deleted_kill_all_word(true, false, data_result.id);
                } else {
                    const timeout_id = createRememberWord(data_result.id, data_result.each_minutes * 60 * 1000);
                    store_tb_jobs.put({
                        ...data_result,
                        repeat_remember: new_repeat_remember,
                        timeout_id
                    });
                }

                self.registration.showNotification(data_result.data.text, {
                    icon: '/img/icons/icon_x128.png',
                    badge: '/favicon.ico',
                    timestamp: formatDate(new Date(data_result.date)),
                    openUrl: '/',
                    vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
                    body: data_result.data.translation,
                    data: {
                        url: `/words/${data_result.id}/details`
                    }
                });
            }
        };
        db.close();
    };
}
function deleted_kill_all_word(isDeleted, isKill, word_id) {
    const indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB;
    if (!indexedDB) {
        console.log('IndexedDB is not supprorted.');
        return;
    }
    const request = indexedDB.open(dbname, 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        try {
            const store = request.transaction.objectStore(tb_jobs);
        } catch (e) {
            //crar tabla set_interval
            const storeJobs = db.createObjectStore(tb_jobs, { keyPath: 'id' });
            storeJobs.createIndex(`${tb_jobs}_id_unqiue`, 'id', { unique: true });
            console.log('deleted_kill_all_word: tb_jobs has been removed');
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');

        tran_tb_jobs.oncomplete = (event) => {
            console.log('deleted_kill_all_word: transaction:completed');
        };

        tran_tb_jobs.onerror = (event) => {
            console.log('deleted_kill_all_word: transaction:error', event);
        };

        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        if (isKill) {
            const cursorJobs = store_tb_jobs.openCursor();
            cursorJobs.onsuccess = (eventCursorJob) => {
                let cursor = eventCursorJob.target.result;
                if (cursor) {
                    let key = cursor.primaryKey;
                    let value = cursor.value;
                    clearTimeout(value.timeout_id);
                    cursor.continue();
                }
            };
            const resClear = store_tb_jobs.clear();
            resClear.onsuccess = () => {
                console.log('deleted_kill_all_word: kill:all:process');
            };
        } else if (isDeleted) {
            try {
                let res_get = store_tb_jobs.get(word_id);
                res_get.onsuccess = (event_get) => {
                    const data_result = event_get.target.result;
                    if (data_result) {
                        clearTimeout(data_result.timeout_id);
                        store_tb_jobs.delete(word_id);
                    }
                };
            } catch (e) {
                console.log('deleted_kill_all_word: error deleting a reminder', e);
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
            url: `/users/${data.userId}/show`
        }
    });
}
function notify(data, pushParams) {
    self.registration.showNotification(data.title, {
        ...pushParams,
        body: data.message,
        icon: '/img/admin_x128.png',
        badge: '/img/admin.ico',
        data: {
            url: `/notifications/${data.id}/show`
        }
    });
}

function createRememberWord(word_id, time) {
    const timeout_id = setTimeout(() => {
        show_notity_word_from_job(word_id);
    }, time);
    return timeout_id;
}

function create_periodic_background_job(pushData) {
    const indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB;
    if (!indexedDB) {
        console.log('IndexedDB is not supprorted.');
        return;
    }

    const dataMessage = pushData.data;
    const timeNow = pushData.sendDate;
    const word_id = pushData.data.id;

    const request = indexedDB.open(dbname, 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        try {
            const store = request.transaction.objectStore(tb_jobs);
        } catch (e) {
            const storeJobs = db.createObjectStore(tb_jobs, { keyPath: 'id' });
            storeJobs.createIndex(`${tb_jobs}_id_unqiue`, 'id', { unique: true });
            console.log('create_periodic_background_job: tb_jobs:created');
        }
    };
    request.onsuccess = (event) => {
        const db = event.target.result;

        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');
        tran_tb_jobs.oncomplete = (event) => {
            console.log('create_periodic_background_job: transaction:completed');
        };

        tran_tb_jobs.onerror = (event) => {
            console.log('create_periodic_background_job: transaction:error', event);
        };
        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        let res_job_get = store_tb_jobs.get(word_id);
        res_job_get.onsuccess = (event_get) => {
            const data_result = event_get.target.result;

            if (data_result) {
                clearTimeout(data_result.timeout_id);
                const timeout_id = createRememberWord(word_id, dataMessage.each_minutes * 60 * 1000);
                store_tb_jobs.put({
                    id: word_id,
                    each_minutes: dataMessage.each_minutes,
                    repeat_remember: dataMessage.repeat_remember,
                    time: timeNow,
                    timeout_id,
                    data: { text: dataMessage.text, translation: dataMessage.translation }
                });
            } else {
                const timeout_id = createRememberWord(word_id, dataMessage.each_minutes * 60 * 1000);
                store_tb_jobs.add({
                    id: word_id,
                    each_minutes: dataMessage.each_minutes,
                    repeat_remember: dataMessage.repeat_remember,
                    time: timeNow,
                    timeout_id,
                    data: { text: dataMessage.text, translation: dataMessage.translation }
                });
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
            if ((pushData.data.each_minutes || 0) > 0 && (pushData.data.repeat_remember || 0) > 0) {
                create_periodic_background_job(pushData);
            }
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
        case 'notify':
            notify(pushData.data, params);
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
    notification.close();
});
