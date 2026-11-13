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
const CACHE_NAME = 'cesta-punta-v2';

const urlsToCache = [
  './',
  'index.html',
  'accueil.html',
  'entrainements.html',
  'joueurs.html',
  'joueur.html',
  'match.html',
  'entraineurs.html',
  'comparaison.html',
  'staff.html',
  'statjoueur.html',
  'autre_joueur.html',
  'statistiques-partie.html',
  'ajouter_partie.html',
  'ajouter_joueur.html',
  'nouveau-entrainement.html',
  'parametres.html',
  'style.css',
  'logoce.png',
  'logojulien.png',
  'titre.png',
  'joueurs-data.js',
  'staff-data.js',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('index.html');
        }
      })
  );
});

// Réception des notifications Push Firebase (en arrière-plan ou écran verrouillé)
self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { data: { titre: "Cesta Punta", corps: event.data.text() } };
  }

  const payload = data.notification || data.data || {};
  const title = payload.title || payload.titre || "Cesta Punta";
  const options = {
    body: payload.body || payload.corps || "Nouvelle notification",
    icon: 'logoce.png',
    badge: 'logoce.png',
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
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
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