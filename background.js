
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SAVE_DATA" && message.productos) {
        chrome.storage.local.set({ productos: message.productos }, () => {
            console.log("Productos guardados en storage:", message.productos);
        });
    }
});
