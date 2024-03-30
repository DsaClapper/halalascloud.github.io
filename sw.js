const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription, email) => {
    const response = await fetch('https://hc-server.onrender.com/save-subs', {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify({
            sub: subscription,
            em: email
    })
    })
    return response.json()
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array("BG_jzd40rAS03APRXVje5C9CDaTMLDpcckfHs5oA0umzvh-9UYUybphcjsTiDQ-Ru1hPoUEmYwvGDrihjYuarv4")
    })
    let open = indexedDB.open("Hls Db", 1)
    open.onsuccess = async function(event) {
        let db = open.result
        let transaction = db.transaction("user", "readwrite");
        let objectStore = transaction.objectStore("user");
        let em = objectStore.get("ssn").source.indexNames[0]
        
    const response = await saveSubscription(subscription, em)
    console.log(response)
    }
})

self.addEventListener("push", e => {
    self.registration.showNotification("Wohoo!!", { body: e.data.text() })
})
