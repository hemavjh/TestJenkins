if ('undefined' === typeof window) {

    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js');
    // Initialize Firebase

    var config = {
        apiKey: "AIzaSyB2TEBk_Zjep7njuZEidu9pZ0b0onK_TM0",
        authDomain: "mycortexandroid.firebaseapp.com",
        databaseURL: "https://mycortexandroid.firebaseio.com",
        projectId: "mycortexandroid",
        storageBucket: "mycortexandroid.appspot.com",
        messagingSenderId: "419028261987",
        appId: "1:419028261987:web:811ad0c7a9238f38d02c56",
        measurementId: "G-EEGLTE5S68"
    };

    firebase.initializeApp(config);
    
    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function (payload) {
        console.log('Handling background message ', payload);

        return self.registration.showNotification(payload.data.title, {
            body: payload.data.body,
            icon: payload.data.icon,
            tag: payload.data.tag,
            data: payload.data.link
        });
    });

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        event.waitUntil(self.clients.openWindow(event.notification.data));
    });
}