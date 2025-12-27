importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB9jRchzpJFOWhYL9JUAKmXrzbb29yZRwc',
  authDomain: 'pwa-indoretail.firebaseapp.com',
  projectId: 'pwa-indoretail',
  storageBucket: 'pwa-indoretail.firebasestorage.app',
  messagingSenderId: '323072087622',
  appId: '1:323072087622:web:1fb33a43d74fea7e319c47'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  });
});

