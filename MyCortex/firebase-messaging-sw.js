if ('undefined' === typeof window) {

    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js');
    // Initialize Firebase

    var config =
    {
        "apiKey": "AIzaSyBH_s066I9pvBwVcEGF433XsKDEE2SZnH8", "authDomain": "mycortexuat1.firebaseapp.com", "projectId": "mycortexuat1"
        ,"storageBucket": "mycortexuat1.appspot.com", "messagingSenderId": "574239655245", "appId": "1:574239655245:web:c4db7da21140a8937c6304"
        ,"measurementId": "G-SV884WCG5F"
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