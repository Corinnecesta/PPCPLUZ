importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBTujsGZneEGx1_V27zgRNf9-qM9zFFHQA",
    authDomain: "ppcestapunta64500.firebaseapp.com",
    projectId: "ppcestapunta64500",
    storageBucket: "ppcestapunta64500.firebasestorage.app",
    messagingSenderId: "80945272911",
    appId: "1:80945272911:web:154437e054b190e7ebb23a"
});

const messaging = firebase.messaging();

// Gestion de la réception en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Message reçu : ', payload);
    
    const notificationTitle = payload.notification ? payload.notification.title : "Pôle Performance";
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : "Nouvelle notification",
        icon: '/PPCPLUZ/pole.png',
        badge: '/PPCPLUZ/pole.png',
        data: {
            url: '/PPCPLUZ/accueil.html'
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Clic sur la notification : ouvre ou redirige vers l'application
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/PPCPLUZ/accueil.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('/PPCPLUZ/') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});