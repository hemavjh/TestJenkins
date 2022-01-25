//var firebaseConfig = {
//    apiKey: "AIzaSyBQRI1TZ3k9f13rtedqMtz0Ef8jtgYCeOY",
//    authDomain: "mycortex-2b207.firebaseapp.com",
//    databaseURL: "https://mycortex-2b207.firebaseio.com",
//    projectId: "mycortex-2b207",
//    storageBucket: "mycortex-2b207.appspot.com",
//    messagingSenderId: "538725094029",
//    appId: "1:538725094029:web:e1de3f6e70fd5bf464c8c4",
//    measurementId: "G-PYBLJGPE0S"
//};

jQuery.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=FIREBASE_CONFIG&Institution_Id=' + window.localStorage.getItem('InstitutionId'))
    .done(function (data) {
        var jsonobj = jQuery.parseJSON(data[0].ConfigValue);
        // Your web app's Firebase configuration
        var firebaseConfig = {
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
        firebase.analytics();

        //if ('serviceWorker' in navigator) {
        //    navigator.serviceWorker.register('firebase-messagin-sw.js').then(function () {
        //        return navigator.serviceWorker.ready;
        //    }).then(function (reg) {
        //        console.log('Service Worker is ready', reg);
        //        reg.pushManager.subscribe({ userVisibleOnly: true }).then(function (sub) {

        //            console.log('endpoint:', sub.endpoint);
        //            reg.active.postMessage(JSON.stringify({ uid: uid, token: token }));
        //            console.log("Posted message");

        //        });
        //    }).catch(function (error) {
        //        console.log('Error : ', error);
        //    });
        //}
        // Retrieve Firebase Messaging object.
        const messaging = firebase.messaging();

        messaging
            .requestPermission()
            .then(function () {
                //MsgElem.innerHTML = "Notification permission granted." 
                console.log("Notification permission granted.");

                // get the token in the form of promise
                return messaging.getToken()
            })
            .then(function (token) {
                //TokenElem.innerHTML = "token is : " + token
                //console.log("token", token);
                var obj = {
                    User_Id: window.localStorage['UserId'],
                    FCMToken: token,
                    DeviceType: "web"
                };


                var usertoken = '';
                usertoken = window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='];
                $.ajax({
                    url: baseUrl + '/api/SendEmail/UpdateUser_FCMTocken',
                    type: "POST",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + usertoken);
                    },
                    data: obj,
                    dataType: "json"
                })
            })
            .catch(function (err) {
                //ErrElem.innerHTML =  ErrElem.innerHTML + "; " + err
                console.log("Unable to get permission to notify.", err);
            });

        // [START refresh_token]
        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.', refreshedToken);
                var obj = {
                    User_Id: window.localStorage['UserId'],
                    FCMToken: refreshedToken,
                    DeviceType: "web"
                };

                var usertoken = '';
                usertoken = window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='];
                $.ajax({
                    url: baseUrl + '/api/SendEmail/UpdateUser_FCMTocken',
                    type: "POST",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + usertoken);
                    },
                    data: obj,
                    dataType: "json"
                })

                // [END_EXCLUDE]
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
                //showToken('Unable to retrieve refreshed token ', err);
            });
        });
        messaging.onMessage((payload) => {
            //console.log('Message received. ', payload);

            var notificationOptions = {
                body: payload.notification.body,
                icon: payload.notification.icon,
                click_action: payload.notification.click_action
            };
            new Notification(payload.notification.title, notificationOptions);

        });

    });