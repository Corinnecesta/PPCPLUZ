// Importation des scripts Firebase (Version Compat pour Service Worker)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuration Firebase de votre projet
const firebaseConfig = {
    apiKey: "AIzaSyBTujsGZneEGx1_V27zgRNf9-qM9zFFHQA",
    authDomain: "ppcestapunta64500.firebaseapp.com",
    projectId: "ppcestapunta64500",
    storageBucket: "ppcestapunta64500.firebasestorage.app",
    messagingSenderId: "80945272911",
    appId: "1:80945272911:web:154437e054b190e7ebb23a",
    measurementId: "G-SCYGWMW7VF"
};

// Initialisation de Firebase dans le Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// --- GESTION DU STOCKAGE LOCAL DU BADGE (IndexedDB) ---
async function openBadgeDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('BadgeStore', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('badge');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function getBadgeCount() {
    try {
        const db = await openBadgeDB();
        return new Promise((resolve) => {
            const tx = db.transaction('badge', 'readonly');
            const req = tx.objectStore('badge').get('count');
            req.onsuccess = () => resolve(req.result || 0);
            req.onerror = () => resolve(0);
        });
    } catch (e) {
        return 0;
    }
}

async function saveBadgeCount(val) {
    try {
        const db = await openBadgeDB();
        return new Promise((resolve) => {
            const tx = db.transaction('badge', 'readwrite');
            tx.objectStore('badge').put(val, 'count');
            tx.oncomplete = () => resolve();
        });
    } catch (e) {}
}

async function incrementerBadge() {
    if ('setAppBadge' in navigator) {
        try {
            let count = await getBadgeCount();
            count += 1;
            await saveBadgeCount(count);
            await navigator.setAppBadge(count);
        } catch (e) {
            // Fallback si le compteur précis échoue : affiche au moins une pastille
            navigator.setAppBadge(1);
        }
    }
}

// --- RÉCEPTION DES NOTIFICATIONS EN ARRIÈRE-PLAN ---
messaging.onBackgroundMessage(async (payload) => {
    console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan :', payload);

    // 1. Incrémente le compteur et allume la pastille sur l'icône du téléphone
    await incrementerBadge();

    // 2. Affiche la notification push native
    const notificationTitle = payload.notification?.title || payload.data?.title || "Pôle Performance";
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || "Nouvelle information disponible",
        icon: '/PPCPLUZ/pole.png',
        badge: '/PPCPLUZ/pole.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- GESTION DU CLIC SUR LA NOTIFICATION ---
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Récupère l'URL cible transmise dans les données de la notification ou ouvre les entraînements par défaut
    const targetUrl = event.notification.data?.url || './entrainements.html';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});