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

// Interception des notifications en arrière-plan ou écran verrouillé
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

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './accueil.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let client of clientList) {
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