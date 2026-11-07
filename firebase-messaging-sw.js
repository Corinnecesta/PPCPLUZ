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

// Gestion de la réception de la notification en arrière-plan / hors connexion
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notification reçue en arrière-plan :', payload);

  const notificationTitle = payload.notification.title || 'Pôle Performance Cesta Punta';
  const notificationOptions = {
    body: payload.notification.body || 'Une nouvelle mise à jour est disponible !',
    icon: 'logoce.png',
    badge: 'logoce.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});