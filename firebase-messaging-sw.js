importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Configuration Firebase (Version Compat 9.22.2)
firebase.initializeApp({
    apiKey: "AIzaSyBTujsGZneEGx1_V27zgRNf9-qM9zFFHQA",
    authDomain: "ppcestapunta64500.firebaseapp.com",
    projectId: "ppcestapunta64500",
    storageBucket: "ppcestapunta64500.firebasestorage.app",
    messagingSenderId: "80945272911",
    appId: "1:80945272911:web:154437e054b190e7ebb23a"
});

const messaging = firebase.messaging();

// GESTION DE LA RÉCEPTION EN ARRIÈRE-PLAN
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan : ', payload);
    
    const notificationTitle = payload.notification ? payload.notification.title : "Pôle Performance";
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : "Nouvelle notification disponible",
        icon: '/PPCPLUZ/pole.png',
        badge: '/PPCPLUZ/pole.png',
        data: {
            url: '/PPCPLUZ/accueil.html'
        }
    };

    // --- MISE À JOUR DU BADGE ROUGE SUR L'ICÔNE DU TÉLÉPHONE ---
    if ('setAppBadge' in navigator) {
        navigator.setAppBadge(1).catch((err) => console.log("Erreur d'application du badge :", err));
    }

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// CLIC SUR LA NOTIFICATION
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Si une URL spécifique est fournie dans le payload, on l'utilise, sinon par défaut accueil.html
    const targetUrl = (event.notification.data && event.notification.data.url) 
        ? event.notification.data.url 
        : '/PPCPLUZ/accueil.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Si l'application est déjà ouverte dans un onglet, on remet le focus dessus
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url.includes('/PPCPLUZ/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sinon, on ouvre une nouvelle fenêtre/onglet vers l'URL cible
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});