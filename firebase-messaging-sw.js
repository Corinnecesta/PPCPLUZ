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

// 1. Gestion de la réception en arrière-plan (campagnes ou push serveur)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Message de campagne reçu en arrière-plan :', payload);
    
    const notificationTitle = payload.notification?.title || "Pôle Performance";
    const notificationOptions = {
        body: payload.notification?.body || "Nouvelle information disponible",
        icon: '/PPCPLUZ/pole.png',
        badge: '/PPCPLUZ/pole.png',
        data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 2. Gestion du clic sur la notification (ouverture / redirection vers l'appli)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Détermination de l'URL cible (par défaut sur entrainements.html)
    const targetUrl = event.notification.data?.url || '/PPCPLUZ/entrainements.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Si l'application est déjà ouverte, on met au premier plan la fenêtre
            for (let client of windowClients) {
                if (client.url.includes('/PPCPLUZ/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sinon on ouvre une nouvelle fenêtre avec l'URL de l'application
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});