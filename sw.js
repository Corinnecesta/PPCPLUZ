const CACHE_NAME = 'cesta-punta-v1';

// Liste complète des fichiers à mettre en cache pour l'accès hors-ligne
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

// Phase 1 : Installation du Service Worker et mise en cache initiale des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Mise en cache initiale des ressources PWA');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Phase 2 : Activation et suppression des anciens caches lors des mises à jour
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l'ancien cache :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Phase 3 : Interception des requêtes (Cache d'abord, puis Réseau en secours)
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-GET ou externes vers Firebase/Google APIs
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne le fichier depuis le cache s'il existe
        if (response) {
          return response;
        }
        // Sinon effectue la requête réseau habituelle
        return fetch(event.request).then(networkResponse => {
          // Si la réponse est valide, on met à jour le cache à la volée
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
        // Fallback en cas de rupture de connexion sur les pages HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('index.html');
        }
      })
  );
});