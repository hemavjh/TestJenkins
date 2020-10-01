var firebaseConfig = {
    apiKey: "AIzaSyB2TEBk_Zjep7njuZEidu9pZ0b0onK_TM0",
    authDomain: "mycortexandroid.firebaseapp.com",
    databaseURL: "https://mycortexandroid.firebaseio.com",
    projectId: "mycortexandroid",
    storageBucket: "mycortexandroid.appspot.com",
    messagingSenderId: "419028261987",
    appId: "1:419028261987:web:811ad0c7a9238f38d02c56",
    measurementId: "G-EEGLTE5S68"
};

jQuery.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=FIREBASE_CONFIG&Institution_Id=0')
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
            firebase.analytics();

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