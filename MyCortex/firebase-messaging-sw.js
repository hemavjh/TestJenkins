if ('undefined' === typeof window) {

    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.13.2/firebase-messaging.js');
    // Initialize Firebase

    jQuery.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=FIREBASE_CONFIG&Institution_Id=' + window.localStorage.getItem('InstitutionId'))
        .done(function (data) {
            var jsonobj = jQuery.parseJSON(data[0].ConfigValue);
            // Your web app's Firebase configuration
            firebaseConfig = {
                apiKey: jsonobj.apiKey,
                authDomain: jsonobj.authDomain,
                databaseURL: jsonobj.databaseURL,
                projectId: jsonobj.projectId,
                storageBucket: jsonobj.storageBucket,
                messagingSenderId: jsonobj.messagingSenderId,
                appId: jsonobj.appId,
                measurementId: jsonobj.measurementId
            };

            firebase.initializeApp(firebaseConfig);

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
        });

    
}