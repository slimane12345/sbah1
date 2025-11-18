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
    icon: payload.notification.icon || '/assets/icons/icon-192x192.png',
    data: {
        url: payload.data.url // Pass the URL to the notification data object
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event.notification.data);
    event.notification.close();

    const urlToOpen = event.notification.data.url;

    event.waitUntil(clients.matchAll({
        type: "window",
        includeUncontrolled: true
    }).then((clientList) => {
        for (const client of clientList) {
            // Check if a client is already open and focus it.
            if (client.url.includes('/driver.html') && 'focus' in client) {
                // If found, navigate the existing client to the new URL
                if (client.navigate) {
                    client.navigate(urlToOpen);
                }
                return client.focus();
            }
        }
        // If no client is open, open a new window.
        if (clients.openWindow && urlToOpen) {
            return clients.openWindow(urlToOpen);
        }
    }));
});