let request = indexedDB.open("camera", 1);
let db;
request.onsuccess = function (e) {
    db = request.result;
}
request.onerror = function (err) {
    console.log(err);
}
request.onupgradeneeded = function () {
    db = request.result;
    db.createObjectStore("img", { keyPath: "mid" });
    db.createObjectStore("video", { keyPath: "mid" });
}
function addMediaToDb(data, table) {
    if (db) {
        let tx = db.transaction(table, "readwrite");
        let store = tx.objectStore(table);
        store.add({ mid: Date.now(), media: data });
    }else{
        alert("db is loading");
    }
}