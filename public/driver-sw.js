importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDKs7QQjax0FcogazrXOeSExrDxlVlfbBE",
  authDomain: "sbah-ece2e.firebaseapp.com",
  projectId: "sbah-ece2e",
  storageBucket: "sbah-ece2e.appspot.com",
  messagingSenderId: "1018203020293",
  appId: "1:1018203020293:web:3adeab254fab74d234906c",
  measurementId: "G-VKZFW5QPN6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[driver-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event.notification.tag);
    event.notification.close();

    const urlToOpen = new URL('/driver.html?view=active_orders', self.location.origin).href;

    event.waitUntil(clients.matchAll({
        type: "window",
        includeUncontrolled: true
    }).then((clientList) => {
        for (const client of clientList) {
            if (client.url.includes('/driver.html') && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
        }
    }));
});