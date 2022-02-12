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
function deleteJob(wordId) {
    const dbname = 'remembersdb';
    const tb_jobs = 'tb_jobs';
    const request = indexedDB.open(dbname, 1);
    let table_not_found = false;
    request.onupgradeneeded = (event) => {
        try {
            const store = request.transaction.objectStore(tb_jobs);
        } catch (e) {
            table_not_found = true;
            console.log('[deleteJob]', e);
        }
    };
    request.onsuccess = (event) => {
        if (table_not_found) {
            return;
        }
        const db = event.target.result;

        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');
        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        let res_job_get = store_tb_jobs.get(wordId);
        res_job_get.onsuccess = (event_get) => {
            const data_result = event_get.target.result;
            if (data_result) {
                store_tb_jobs.delete(wordId);
            }
        };
        db.close();
    };
}
function created_updated_deleted_kill_all_word(payload, pushParams, action) {
    const indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB;
    if (!indexedDB) {
        console.log('IndexedDB is not supprorted.');
        return;
    }
    const dbname = 'remembersdb';
    const tb_jobs = 'tb_jobs';

    const wordId = payload.id;

    const isCreated = action == 'created_word';
    const isUpdated = action == 'updated_word';
    const isDeleted = action == 'deleted_word';
    const isKill = action == 'kill_all_notify';

    const push_message = () => {
        self.registration.showNotification(payload.text, {
            ...pushParams,
            body: payload.translation,
        });
    };

    const request = indexedDB.open(dbname, 1);
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        try {
            const store = request.transaction.objectStore(tb_jobs);
        } catch (e) {
            const storeJobs = db.createObjectStore(tb_jobs, { keyPath: 'id' });
            storeJobs.createIndex(`${tb_jobs}_id_unqiue`, 'id', { unique: true });
            console.log('[created_updated_deleted_kill_all_word]', e);
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const tran_tb_jobs = db.transaction([tb_jobs], 'readwrite');
        const store_tb_jobs = tran_tb_jobs.objectStore(tb_jobs);
        if (isKill) {
            const cursorJobs = store_tb_jobs.openCursor();
            cursorJobs.onsuccess = (eventCursorJob) => {
                let cursor = eventCursorJob.target.result;
                if (cursor) {
                    let key = cursor.primaryKey;
                    let value = cursor.value;

                    clearInterval(value.interval_id);
                    clearTimeout(value.timeout_id);

                    cursor.continue();
                }
            };
            store_tb_jobs.clear();
        } else {
            try {
                let res_job = store_tb_jobs.get(wordId);
                res_job.onsuccess = (event_get) => {
                    const data_result = event_get.target.result;
                    if (data_result) {
                        const set_timeout_id = data_result.timeout_id;
                        const set_interval_id = data_result.interval_id;

                        clearInterval(set_interval_id);
                        clearTimeout(set_timeout_id);

                        if (isDeleted) {
                            store_tb_jobs.delete(wordId);
                        } else if (isUpdated) {
                            const intervalId = setInterval(() => {
                                push_message();
                            }, parseInt(payload.each_minutes) * 60 * 1000);

                            const timeoutId = setTimeout(() => {
                                clearInterval(intervalId);
                                deleteJob(wordId);
                            }, parseInt(payload.each_minutes) * 60 * 1000 * parseInt(payload.repeat_remember));

                            store_tb_jobs.put({
                                id: wordId,
                                interval_id: intervalId,
                                timeout_id: timeoutId,
                                each_minutes: payload.each_minutes,
                                repeat_remember: payload.repeat_remember,
                                date: new Date().toISOString(),
                            });
                        }
                    } else {
                        if (!isDeleted) {
                            const intervalId = setInterval(() => {
                                push_message();
                            }, parseInt(payload.each_minutes) * 60 * 1000);

                            const timeoutId = setTimeout(() => {
                                clearInterval(intervalId);
                                deleteJob(wordId);
                            }, parseInt(payload.each_minutes) * 60 * 1000 * parseInt(payload.repeat_remember));

                            store_tb_jobs.add({
                                id: wordId,
                                interval_id: intervalId,
                                timeout_id: timeoutId,
                                each_minutes: payload.each_minutes,
                                repeat_remember: payload.repeat_remember,
                                date: new Date().toISOString(),
                            });
                        }
                    }
                };
            } catch (e) {
                console.log('[GET_JOB_REMOVE_EDIT_ADD]', e);
            }
        }
        db.close();
    };
}

function created_user(data, pushParams) {
    self.registration.showNotification(data.title, {
        ...pushParams,
        body: data.message,
        icon: '/img/admin_128.png',
        badge: '/admin.ico',
    });
}
function notify_all(data, pushParams) {
    self.registration.showNotification(data.title, {
        ...pushParams,
        body: data.message,
        icon: '/img/admin_128.png',
        badge: '/admin.ico',
    });
}

self.addEventListener('push', (e) => {
    const pushData = e.data.json();
    const action = pushData.action;
    const sendDate = pushData.sendDate;
    const params = {
        icon: '/img/remember_128.png',
        badge: '/favicon.ico',
        timestamp: formatDate(new Date(sendDate)),
        openUrl: '/',
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
    };
    switch (action) {
        case 'created_word':
            created_updated_deleted_kill_all_word(pushData.data, params, 'created_word');
            break;
        case 'updated_word':
            let calcAction = 'updated_word';
            if (pushData.data.complete) {
                calcAction = 'deleted_word';
            }
            if (!pushData.data.each_minutes || !pushData.data.repeat_remember) {
                calcAction = 'deleted_word';
            }
            created_updated_deleted_kill_all_word(pushData.data, params, calcAction);
            break;
        case 'deleted_word':
            created_updated_deleted_kill_all_word(pushData.data, params, 'deleted_word');
            break;
        case 'created_user':
            created_user(pushData.data, params);
            break;
        case 'notify_all':
            notify_all(pushData.data, params);
            break;
        case 'kill_all_notify':
            created_updated_deleted_kill_all_word(pushData.data, params, 'kill_all_notify');
            break;
        default:
            console.log('invalid action: ' + action);
            break;
    }
});
