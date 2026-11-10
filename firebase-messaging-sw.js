// Importation des SDK Firebase Compat dans le Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Configuration Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBTujsGZneEGx1_V27zgRNf9-qM9zFFHQA",
    authDomain: "ppcestapunta64500.firebaseapp.com",
    projectId: "ppcestapunta64500",
    storageBucket: "ppcestapunta64500.firebasestorage.app",
    messagingSenderId: "80945272911",
    appId: "1:80945272911:web:154437e054b190e7ebb23a",
    measurementId: "G-SCYGWMW7VF"
});

const messaging = firebase.messaging();

// 1. Gestion de la réception en arrière-plan (lorsque l'application est fermée)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan :', payload);
    
    const notificationTitle = payload.notification?.title || "Pôle Performance";
    const notificationOptions = {
        body: payload.notification?.body || "Nouvelle information disponible",
        icon: 'pole.png',
        badge: 'pole.png',
        data: {
            url: payload.notification?.click_action || payload.data?.url || './accueil.html'
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. Gestion du clic sur la notification (redirection vers l'application)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const targetUrl = event.notification.data?.url || './accueil.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Si l'application est déjà ouverte dans un onglet, on l'active
            for (let client of windowClients) {
                if ('focus' in client) {
                    client.focus();
                    if (client.url !== targetUrl && 'navigate' in client) {
                        return client.navigate(targetUrl);
                    }
                    return;
                }
            }
            // Sinon, on ouvre une nouvelle fenêtre/onglet vers la page cible
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});