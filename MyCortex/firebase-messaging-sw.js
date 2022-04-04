if ('undefined' === typeof window) {

    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js');
    var config =
    {
        "apiKey": "AIzaSyBZ3ngEh5UXs08uS1nOrbPlkiS56bgxG8Q",
        "authDomain": "mycortex-dev.firebaseapp.com", "projectId": "mycortex-dev",
        "storageBucket": "mycortex-dev.appspot.com", "messagingSenderId": "171592136761", "appId": "1:171592136761:web:ded72d25bd95d037e275e8",
        "measurementId": "G-SHJXQ7LYEF"
    };
    //var config = {
    //    apiKey: jsonobj.apiKey,
    //    authDomain: jsonobj.authDomain,
    //    databaseURL: jsonobj.databaseURL,
    //    projectId: jsonobj.projectId,
    //    storageBucket: jsonobj.storageBucket,
    //    messagingSenderId: jsonobj.messagingSenderId,
    //    appId: jsonobj.appId,
    //    measurementId: jsonobj.measurementId
    //};

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

    self.addEventListener('message', (event) => {
        console.log(event);
        
    });
}