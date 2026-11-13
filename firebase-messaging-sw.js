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

// Interception universelle des messages en arrière-plan (compatible data-only et notification)
self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { notification: { title: "Cesta Punta", body: event.data.text() } };
  }

  // Récupère les données qu'elles viennent de "data" (Cloud Function) ou "notification"
  const notificationPayload = data.notification || data.data || {};
  
  const title = notificationPayload.title || notificationPayload.titre || "Cesta Punta";
  const options = {
    body: notificationPayload.body || notificationPayload.corps || "Nouvel événement enregistré",
    icon: '/pole.png',
    badge: '/pole.png',
    data: { url: notificationPayload.url || './accueil.html' }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion du clic sur la notification pour rediriger l'utilisateur
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './accueil.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
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