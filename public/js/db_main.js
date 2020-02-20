var DB_VERSION = 1;
var DB_NAME = "sales-leads";

var openDatabase = function() {
    return new Promise(function(resolve, reject) {
        // Make sure IndexedDB is supported before attempting to use it
        if (!self.indexedDB) {
            reject("IndexedDB not supported");
        }
        var request = self.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = function(event) {
            reject("Database error: " + event.target.error);
        };

        request.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains("leads")) {
                db.createObjectStore("leads",
                    { keyPath: "id" }
                );
            }
        };

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
    });
};

var openObjectStore = function(db, storeName, transactionMode) {
    return db
        .transaction(storeName, transactionMode)
        .objectStore(storeName);
};

var addToObjectStore = function(storeName, object) {
    return new Promise(function(resolve, reject) {
        openDatabase().then(function(db) {
            openObjectStore(db, storeName, "readwrite")
                .add(object).onsuccess = resolve;
        }).catch(function(errorMessage) {
            reject(errorMessage);
        });
    });
};

var updateInObjectStore = function(storeName, id, object) {
    return new Promise(function(resolve, reject) {
        openDatabase().then(function(db) {
            openObjectStore(db, storeName, "readwrite")
                .openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (!cursor) {
                    reject("Leads not found in object store");
                }
                if (cursor.value.id === id) {
                    cursor.update(object).onsuccess = resolve;
                    return;
                }
                cursor.continue();
            };
        }).catch(function(errorMessage) {
            reject(errorMessage);
        });
    });
};


var getLeads = function() {
    return new Promise(function(resolve) {
        openDatabase().then(function(db) {
            var objectStore = openObjectStore(db, "leads");
            var leads = [];
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    leads.push(cursor.value);
                    cursor.continue();
                }
            };
            return leads;
        }).catch(function() {

        });
    });
};

var getLeadsFromServer = function() {
    // TODO
};
