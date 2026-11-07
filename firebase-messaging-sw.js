// Import des scripts Firebase Compat nécessaires pour le Service Worker (version 9.22.2)
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Configuration Firebase (identique à celle de vos pages HTML)
firebase.initializeApp({
    apiKey: "AIzaSyBTujsGZneEGx1_V27zgRNf9-qM9zFFHQA",
    authDomain: "ppcestapunta64500.firebaseapp.com",
    projectId: "ppcestapunta64500",
    storageBucket: "ppcestapunta64500.firebasestorage.app",
    messagingSenderId: "80945272911",
    appId: "1:80945272911:web:154437e054b190e7ebb23a",
    measurementId: "G-SCYGWMW7VF"
});

// Initialisation de la messagerie en arrière-plan
const messaging = firebase.messaging();

// Gestion de la réception du message lorsque l'application est en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan : ', payload);
    
    const notificationTitle = payload.notification ? payload.notification.title : "Pôle Performance Cesta Punta";
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : "Nouvelle notification",
        icon: '/PPCPLUZ/logoce.png',
        badge: '/PPCPLUZ/logoce.png',
        data: {
            url: '/PPCPLUZ/index.html' // URL de redirection ciblée
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- GESTION DU CLIC SUR LA NOTIFICATION ---
self.addEventListener('notificationclick', function(event) {
    console.log('[firebase-messaging-sw.js] Clic sur la notification détecté', event);
    event.notification.close();

    // Récupération de l'URL cible (ou fallback sur index.html)
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/PPCPLUZ/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Si une fenêtre de l'application est déjà ouverte, on la focalise et on navigue vers index.html
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('/PPCPLUZ/') && 'focus' in client) {
                    client.focus();
                    return client.navigate(targetUrl);
                }
            }
            // Sinon, on ouvre une nouvelle fenêtre sur index.html
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});