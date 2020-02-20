export default class IndexDBSales {
    constructor(DBName = 'gnsales', DBVer = 1) {
        this.DBName = DBName;
        this.DBVer = DBVer;
    }

    openDatabase() {
        return new Promise((resolve, reject) => {
            // Make sure IndexedDB is supported before attempting to use it
            if (!window.indexedDB) {
                reject("IndexedDB not supported");
            }
            const request = window.indexedDB.open(this.DBName, this.DBVer);
            request.onerror = (event) => {
                reject("Database error: " + event.target.error);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('leads')) {
                    db.createObjectStore('leads',
                        { keyPath: 'id' }
                    );
                }
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };


        });
    }

    openObjectStore(db, storeName, transactionMode) {
        return db
            .transaction(storeName, transactionMode)
            .objectStore(storeName);
    }

    addToObjectStore(storeName, object) {
        return new Promise((resolve, reject) => {
            this.openDatabase().then((db) => {
                this.openObjectStore(db, storeName, 'readwrite')
                    .add(object).onsuccess = resolve;
            }).catch((errorMessage) => {
                console.log(errorMessage);
                reject(errorMessage);
            });
        });
    }

    getFromObjectStore(storeName) {
        return new Promise((resolve) => {
            this.openDatabase().then((db) => {
                const objectStore = this.openObjectStore(db, storeName);
                const row = [];
                objectStore.openCursor().onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        row.push(cursor.value);
                        cursor.continue();
                    }
                };
                resolve(row);
            }).catch(() => {

            });
        });
    }
}
