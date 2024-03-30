const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error("No support for service worker!")
    }

    if (!('Notification' in window)) {
        throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
        throw new Error("No support for Push API")
    }
}

const registerSW = async () => {
    let email = localStorage.getItem("email")
    if(!email)return (window.location.reload());

    let db = indexedDB.open("Hls Db", 1)

    db.onupgradeneeded = (event) => {
        const d = event.target.result;

        const objectStore = d.createObjectStore("user", { keyPath: "ssn" });
        objectStore.createIndex(email, "email", { unique: false });

        objectStore.transaction.oncomplete = (event) => {
            const email = d.transaction("user", "readwrite").objectStore("user")
            console.log(email)
        }
    }
    const registration = await navigator.serviceWorker.register('sw.js');
    return registration;
}

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
        throw new Error("Notification permission not granted")
    }

}

const main = async () => {
    checkPermission()
    await requestNotificationPermission()
    await registerSW()
}
