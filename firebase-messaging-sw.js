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

// Interception des notifications Push et mise à jour du badge de l'application
self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { data: { titre: "Pôle Performance", corps: event.data.text() } };
  }

  const payload = data.notification || data.data || {};
  const title = payload.title || payload.titre || "Pôle Performance";
  const options = {
    body: payload.body || payload.corps || "Nouvelle notification",
    icon: 'pole.png',
    badge: 'pole.png',
    vibrate: [200, 100, 200],
    data: { url: payload.url || './accueil.html' }
  };

  // Affichage du badge rouge sur l'icône de la PWA sur le téléphone
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge().catch(err => console.log("Erreur badge:", err));
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion du clic sur la notification : redirection et effacement du badge
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  // Effacer le badge rouge lorsque l'utilisateur clique sur la notification
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(err => console.log("Erreur clear badge:", err));
  }

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './accueil.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});