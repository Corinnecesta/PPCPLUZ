// Import des scripts Firebase Cloud Messaging (compat version 9.22.2) pour le Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Configuration Firebase du projet
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

// Gestion de la réception des messages lorsque l'application est en arrière-plan ou fermée
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan : ', payload);

    const notificationTitle = payload.notification ? payload.notification.title : "Pôle Performance Cesta Punta";
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : "Nouvelle information disponible.",
        icon: '/PPCPLUZ/logoce.png',
        badge: '/PPCPLUZ/logoce.png',
        data: {
            url: (payload.data && payload.data.url) ? payload.data.url : 'https://corinnecesta.github.io/PPCPLUZ/index.html'
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// --- GESTION DU CLIC SUR LA NOTIFICATION (Redirection vers index.html) ---
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    // Récupère l'URL cible définie dans les données de la notification ou pointe par défaut vers index.html
    const targetUrl = (event.notification.data && event.notification.data.url) 
        ? event.notification.data.url 
        : 'https://corinnecesta.github.io/PPCPLUZ/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Si une fenêtre de l'application est déjà ouverte, on l'active et on la redirige
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('/PPCPLUZ/') && 'focus' in client) {
                    client.focus();
                    return client.navigate(targetUrl);
                }
            }
            // Sinon, on ouvre un nouvel onglet/fenêtre directement sur index.html
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});