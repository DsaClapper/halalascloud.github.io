self.addEventListener("activate", async (e) => {
    let sub = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BG_jzd40rAS03APRXVje5C9CDaTMLDpcckfHs5oA0umzvh-9UYUybphcjsTiDQ-Ru1hPoUEmYwvGDrihjYuarv4"
    });
})

self.addEventListener("push", e => {
    self.registration.showNotification("Wow", {
        body: e.data.text()
    })
})