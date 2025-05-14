chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "notify") {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Notificación",
            message: request.message
        }, (notificationId) => {
            if (chrome.runtime.lastError) {
                console.error("Error al crear la notificación:", chrome.runtime.lastError);
            } else {
                console.log("🔔 Notificación enviada:", notificationId);
            }
        });
    }

    if (request.type === "saveConfig") {
        chrome.storage.sync.set(request.config, () => {
            console.log("✅ Configuración guardada:", request.config);
            sendResponse({ status: "ok" });
        });
        return true; 
    }
});
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("✅ AutoAgenda Visa instalada.");
    } else if (details.reason === "update") {
        console.log("🔄 AutoAgenda Visa actualizada.");
    }
});
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get(["id", "locationAsc", "MAX_MONTHS", "MULTIPLOS", "MILIISEG"], (config) => {
        if (chrome.runtime.lastError) {
            console.error("❌ Error al cargar configuración:", chrome.runtime.lastError);
        } else {
            console.log("🔹 Configuración cargada:", config);
        }
    });
});
