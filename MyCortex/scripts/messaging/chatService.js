const utilService = function()
{
    return {
        initializeFirebase: function()
        {
            return "test";
        },
        convertOnlyDate: function(strTime) 
        {
            var timestamp = Number(strTime) * 1000;
            var date = new Date(timestamp);
            return ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
        },
        convertStringToDate: function(strTime) 
        {
            var timestamp = Number(strTime) * 1000;
            var date = new Date(timestamp);
            var timestr = this.formatAMPM(date);
            return timestr.toString();
        },
        formatAMPM: function(date) 
        {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? "0" + minutes : minutes;
            var strTime = hours + ":" + minutes + " " + ampm;
            return strTime;
        },
        createGUID: function()
        {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
                var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
                return v.toString(16);  
            });  
        },
        callRejectAction: function()
        {
            checkCallStatus = false;
            $.stopSound();
            $('#addressBook').show();
            $('.chatBody').removeClass('chatBodyHalf');
            $('#addressBook').addClass('aqua');
            $('.chatBox').removeClass('chatBoxBig');
            $("#msg-page").attr("style", "display:block");                  
            $("#call-accept").attr("style", "display:none");
            $("#call-reject").attr("style", "display:none");
            $("#call-page").attr("style", "display:none");
            $("#showchatIcon").hide();
        },
        callEndAction: function()
        {
            checkCallStatus = false;
            $('#addressBook').show();
            $('.chatBody').removeClass('chatBodyHalf');
            $('#addressBook').addClass('aqua');
            $('.chatBox').removeClass('chatBoxBig');
            $("#msg-page").attr("style", "display:block");                  
            $("#call-accept").attr("style", "display:none");
            $("#call-reject").attr("style", "display:none");
            $("#call-page").attr("style", "display:none");
            $("#showchatIcon").hide();
        },
        initializeChat: function()
        {
            /*$.get(baseUrl + '/api/Common/getCometchatAppId')
            .done(function (data) {
                var arrayComet = data.split(",");
                //window.COMETCHAT_APP_ID = arrayComet[0];
                //window.COMETCHAT_API_KEY = arrayComet[1];

                window.COMETCHAT_FROM_USER = window.localStorage['UserId'];
                
                                window.COMETCHAT_MSGCOUNT = 100;
                $.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=CHATMSGHISTORY_COUNT&Institution_Id=' + window.localStorage['InstitutionId'])
                .done(function (data) {
                    if (data[0] != undefined) {
                        window.COMETCHAT_MSGCOUNT = parseInt(data[0].ConfigValue);
                    }

                    //chatService.initializeApp();
                });

            });*/

            window.COMETCHAT_FROM_USER = window.localStorage['UserId'];

            window.COMETCHAT_MSGCOUNT = 100;
            $.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=CHATMSGHISTORY_COUNT&Institution_Id=' + window.localStorage['InstitutionId'])
            .done(function (data) {
                if (data[0] !== undefined) {
                    window.COMETCHAT_MSGCOUNT = parseInt(data[0].ConfigValue);
                }

                //chatService.initializeApp();
            });
            
            $.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=COMETCHAT_APPID&Institution_Id=0')
                .done(function (data) {
                    window.COMETCHAT_APP_ID = data[0].ConfigValue;

                    $.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=COMETCHAT_APPKEY&Institution_Id=0')
                        .done(function (data1) {
                            window.COMETCHAT_API_KEY = data1[0].ConfigValue;
                            chatService.initializeApp();

                        });
                });

        },
        openChatPage: function (callId, userDataLoad) {
            $('#btnopenchat').attr("style", "display:none");
            $('#chatBox').attr("style", "display:block");

            window.COMETCHAT_FROM_USER = window.localStorage['UserId'];
            window.COMETCHAT_TO_USER = "";
            // CC, CG, Clinician - open the selected patient id
            // for patient - appointment selected doctor id
            if (callId !== "")
                window.COMETCHAT_TO_USER = callId;
            else {
                if (window.localStorage['UserTypeId'] !== "2") {
                    window.COMETCHAT_TO_USER = window.localStorage['SelectedPatientId'];
                }
                else {
                    window.COMETCHAT_TO_USER = window.localStorage['selectedDoctor'];
                }
            }

            //chatService.initializeApp();
            if (window.COMETCHAT_TO_USER !== undefined) {
                if (window.COMETCHAT_TO_USER !== "" && window.COMETCHAT_FROM_USER !== window.COMETCHAT_TO_USER)
                    var vuser = false;
                $.each(userDataLoad, function (contIndex, contValue) {
                    if (window.COMETCHAT_TO_USER === contValue.User_Id) {
                        vuser = true;
                    }
                });
                openUserChat("u", window.COMETCHAT_TO_USER, vuser);
                if (vuser === false) {
                    $('#linkcallIcon').hide();
                    $('#linkvideoIcon').hide();
                    $('#input-text').prop('disabled', true);
                    $("#btnfilechat").attr("style", "display:none");
                }
                else {
                    $('#linkcallIcon').show();
                    $('#linkvideoIcon').show();
                    $('#input-text').prop('disabled', false);
                    $("#btnfilechat").attr("style", "display:block");
                }
            }
            else {
                chatService.getaddressbookDetails($('#contactSearch').val());
            }
            // if chat window minimized, open it
            if ($(".chatBox").hasClass("chatBoxClose") === true) {
                chatarrowclick();
            }

        },
        convertMessageArrayTODisplay: function (messageArray, FromUser, ToUser) {
            //console.log(messageArray);
            //<i class="fas fa-check-double msgRead"></i>
            //               <i class="fas fa-check msgSend"></i>
            var sentDate = "";
            var lastCallDetails = "";
            var callStartTime = "";
            $.each(messageArray, function (index, value) {
                if (value.receiverType === "group")
                    CometChat.markAsRead(value.id, ToUser, value.receiverType);
                else
                    CometChat.markAsRead(value.id, ToUser, value.receiverType);

                var messageList;
                var currentLoggedUID = FromUser;
                messageList = "";
                if (sentDate !== utilService.convertOnlyDate(value.sentAt)) {
                    messageList = `<li><p>` + utilService.convertOnlyDate(value.sentAt) + `</p></li>`;
                    $('#group-message-holder').append(messageList);
                }
                messageList = "";
                sentDate = utilService.convertOnlyDate(value.sentAt);
                if (`${value.category}` === "message" && `${value.type}` === "text") {
                    if (value.sender.uid !== currentLoggedUID) {
                        messageList = `<li class="chatBodyRight">
                                    <div class="chatBodyRightDiv">
                                    ${value.data.text} 
                                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    } else {
                        messageList = `<li class="chatBodyLeft">
                                        <div class="chatBodyLeftDiv">
                                        ${value.data.text} <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    }
                }
                else if (`${value.category}` === "message" && `${value.type}` === "image") {
                    if (value.sender.uid !== currentLoggedUID) {
                        messageList = `<li class="chatBodyRight">
                                <div class="chatBodyRightDiv">
                                <a href=${value.data.url} target="_blank" class="hasAttachement"><img style="width:100%;height:100%" src=${value.data.url} /></a>
                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    } else {
                        messageList = `<li class="chatBodyLeft">
                                    <div class="chatBodyLeftDiv">
                                    <a href=${value.data.url} target="_blank" class="hasAttachement"><img style="width:100%;height:100%" src=${value.data.url} /></a>
                                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    }
                }
                else if (`${value.category}` === "message" && `${value.type}` === "audio") {
                    if (value.sender.uid !== currentLoggedUID) {
                        messageList = `<li class="chatBodyRight">
                                <div class="chatBodyRightDiv">
                                <a href=${value.data.url} target="_blank" class="hasAttachement">${value.attachment.fileName}<i class="fas fa-paperclip"></i></a>
                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    } else {
                        messageList = `<li class="chatBodyLeft">
                                    <div class="chatBodyLeftDiv">\
                                    <a href=${value.data.url} target="_blank" class="hasAttachement">${value.attachment.fileName}<i class="fas fa-paperclip"></i></a>
                                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    }
                }
                else if (`${value.category}` === "message" && `${value.type}` === "video") {
                    if (value.sender.uid !== currentLoggedUID) {
                        messageList = `<li class="chatBodyRight">
                                <div class="chatBodyRightDiv">
                                <a href=${value.data.url} target="_blank" class="hasAttachement">${value.attachment.fileName}<i class="fas fa-paperclip"></i></a>
                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    } else {
                        messageList = `<li class="chatBodyLeft">
                                    <div class="chatBodyLeftDiv">
                                    <a href=${value.data.url} target="_blank" class="hasAttachement">${value.attachment.fileName}<i class="fas fa-paperclip"></i></a>
                                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    }
                }
                else if (`${value.category}` === "call" && `${value.type}` === "audio" && `${value.action}` === "initiated") {
                    lastCallDetails = `<li><p><i class="fas fa-phone-alt"></i> call{calltime}<br/>` + utilService.convertStringToDate(value.initiatedAt) + `</p></li>`;
                }
                else if (`${value.category}` === "call" && `${value.type}` === "video" && `${value.action}` === "initiated") {
                    lastCallDetails = `<li><p><i class="fas fa-video"></i> call{calltime}<br/>` + utilService.convertStringToDate(value.initiatedAt) + `</p></li>`;
                }
                else if (`${value.type}` === "file") {
                    if (value.sender.uid !== currentLoggedUID) {
                        messageList = `<li class="chatBodyRight">
                                <div class="chatBodyRightDiv">
                                <a href=${value.data.url} target="_blank" class="hasAttachement">${value.attachment.fileName}<i class="fas fa-paperclip"></i></a>
                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    } else {
                        messageList = `<li class="chatBodyLeft">
                                    <div class="chatBodyLeftDiv">
                                    <a href=${value.data.url} target="_blank" class="hasAttachement">${value.attachment.fileName}<i class="fas fa-paperclip"></i></a>
                                    <span>` + utilService.convertStringToDate(value.sentAt) + `</span><i class="fas fa-check-double msgDelivered"></i></div></li>`;
                    }
                }
                if (`${value.category}` === "call" && (`${value.type}` === "audio" || `${value.type}` === "video") && (`${value.action}` === "cancelled" || `${value.action}` === "rejected" || `${value.action}` === "unanswered")) {
                    if (lastCallDetails !== "") {
                        lastCallDetails = lastCallDetails.replace("{calltime}", " " + `${value.action}`);
                    }
                    if (lastCallDetails !== "") {
                        $('#group-message-holder').append(lastCallDetails);
                        lastCallDetails = "";
                    }
                }
                else if (lastCallDetails !== "" & (`${value.category}` === "message" || `${value.type}` === "file")) {
                    lastCallDetails = lastCallDetails.replace("{calltime}", "");

                    if (lastCallDetails !== "") {
                        $('#group-message-holder').append(lastCallDetails);
                        lastCallDetails = "";
                    }
                }
                else if (`${value.category}` === "call" && (`${value.type}` === "audio" || `${value.type}` === "video") && (`${value.action}` === "ended")) {

                    var starttime = Number(`${value.data.entities.on.entity.initiatedAt}`) * 1000;
                    var endtime = Number(`${value.data.entities.on.entity.endedAt}`) * 1000;

                    var timeDiff = "";
                    var diff = Math.abs(new Date(endtime) - new Date(starttime));
                    var seconds = Math.floor(diff / 1000); //ignore any left over units smaller than a second

                    var minutes = Math.floor(seconds / 60);
                    seconds = seconds % 60;
                    var hours = Math.floor(minutes / 60);
                    minutes = minutes % 60;
                    if (hours > 0) timeDiff = hours + "h ";
                    if (minutes > 0) timeDiff = timeDiff + minutes + "m ";
                    if (seconds > 0) timeDiff = timeDiff + seconds + "s";

                    if (lastCallDetails !== "") {
                        lastCallDetails = lastCallDetails.replace("{calltime}", " " + timeDiff);
                    }

                    if (lastCallDetails !== "") {
                        $('#group-message-holder').append(lastCallDetails);
                        lastCallDetails = "";
                    }
                }
                else if (messageList !== "") {
                    if (messageList !== "")
                        $('#group-message-holder').append(messageList);
                }

            });
            $("#chatLoader").attr("style", "display:none");
        }

    };
}();

const chatService = function() {
    $('#empty-chat').hide();
    $('#group-message-holder').hide();
    $('#loading-message-container').hide();
    $('#send-message-spinner').hide();

    let messageArray = [];
    //let userid=$('#chatUserUID').val();
    let userid="0";//"superhero2";
    let currentusertype="";
    let callAcceptedStatus=false;
    let callInitiatorFlag = false;
    let checkCallStatus = false;
    let userDataLoad = "";
    //let userid="";
    return {
        initializeApp: function () {
            let cometChatSettings = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion('eu').build();

            CometChat.init(COMETCHAT_APP_ID, cometChatSettings).then(
                () => {
                    //console.log("Initialization completed successfully");
                    //const username = prompt(`Welcome to our jQuery chat demo powered by CometChat. Login with the username superhero1 or superhero2 and test the chat out. To create your own user, copy this link 'https://prodocs.cometchat.com/reference#createuser' and paste into your address-bar`);
                    //const username="superhero1";
                    username = COMETCHAT_FROM_USER;
                    //userid = COMETCHAT_TO_USER;
                    this.authLoginUser(username);
                },
                error => {
                    console.log("Initialization failed with error:", error);

                }
            );
        },
        authLoginUser: function (username) {
            let apiKey = COMETCHAT_API_KEY;
            $('#loading-message-container').show();

            CometChat.login(username, apiKey).then(
                () => {
                    //console.log("Login successfully");
                    $('#btnopenchat').show();
                    this.getLoggedInUser();
                    //console.log($('#contactSearch').val());
                    //this.getaddressbookDetails($('#contactSearch').val());

                    $.get(baseUrl + '/api/User/UserBasedDept_List?User_Id=' + username)
                        .done(function (data) {
                            userDataLoad = data;
                        });

                    this.getUserOnlineStatus();
                    this.onMessageReceived();
                    this.callReceiving();
                },
                error => {
                    alert("Chat login is not created for this User, please contact Admin");
                    console.log("Login failed with error:", error.code);
                }
            );
        },
        getLoggedInUser: function () {
            CometChat.getLoggedinUser().then(
                user => {
                    $('#loggedInUsername').text(user.name);
                    $('#loggedInUserAvatar').attr("src", user.avatar);
                    $('#loggedInUID').val(user.uid);

                    $('#loading-message-container').hide();
                    //this.createGroup("MyGroup","35,52,82");

                    // update firebase logged in user
                    //pushNotificationService.updateFirebaseLoggedInUser(user.uid);
                },
                error => {
                    console.log(error);
                }
            );
        },
        fetchMessages: function (userType, viewUserId) {
            $("#chatLoader").attr("style", "display:block");
            userid = viewUserId;
            currentusertype = userType;
            window.COMETCHAT_TO_USER = userid;
            //$("#message-form")[0].reset();
            $('#group-message-holder').empty();
            messageArray = [];
            this.getUserDetails(userType, userid, "");
            if (userType === "u") {
                $("#deleteGroup").hide();
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                    .setUID(userid)
                    .setLimit(window.COMETCHAT_MSGCOUNT)
                    .build();
                messagesRequest.fetchPrevious().then(
                    messages => {
                        messageArray = [...messageArray, ...messages];
                        utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);

                        this.getaddressbookDetails($('#contactSearch').val());
                        this.scrollToBottom();
                    },
                    error => {
                        console.log("Message fetching failed with error:", error);
                    }
                );
                //$("#chatLoader").attr("style", "display:none")
            }
            else if (userType === "g") {
                $("#deleteGroup").show();
                const messagesRequest = new CometChat.MessagesRequestBuilder()
                    .setGUID(userid)
                    .setLimit(window.COMETCHAT_MSGCOUNT)
                    .build();
                messagesRequest.fetchPrevious().then(
                    messages => {
                        //console.log(messages);
                        messageArray = [...messageArray, ...messages];
                        utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);

                        this.getaddressbookDetails($('#contactSearch').val());
                        this.scrollToBottom();
                    },
                    error => {
                        console.log("Message fetching failed with error:", error);
                    }
                );
            }

        },
        sendCustomMessage: function (customData, customType) {
            let receiverID = customData.ReceiverId;
            //var customData = {
            //    latitude: "50.6192171633316",
            //    longitude: "-72.68182268750002"
            //};

            //var customType = "location";
            var receiverType = CometChat.RECEIVER_TYPE.USER;
            var customMessage = new CometChat.CustomMessage(
                receiverID,
                receiverType,
                customType,
                customData
            );
            CometChat.sendCustomMessage(customMessage).then(
                message => {
                    // Message sent successfully.
                    console.log("custom message sent successfully", message);
                },
                error => {
                    console.log("custom message sending failed with error", error);
                    // Handle exception.
                }
            );
        },
        sendMessage: function () {
            $('#send-message-spinner').show();
            let receiverID = userid;
            let messageText = $('#input-text').val();
            let messageType = CometChat.MESSAGE_TYPE.TEXT;
            let receiverType;
            if (currentusertype === "u")
                receiverType = CometChat.RECEIVER_TYPE.USER;
            else if (currentusertype === "g")
                receiverType = CometChat.RECEIVER_TYPE.GROUP;

            let textMessage = new CometChat.TextMessage(
                receiverID, messageText, receiverType
            );
            $("#chatLoader").attr("style", "display:block");
            CometChat.sendMessage(textMessage).then(
                message => {
                    //$('#message-form').trigger('reset');
                    //$("#message-form")[0].reset();
                    $('#input-text').val('');
                    $('#group-message-holder').empty();
                    messageArray = [...messageArray, message];
                    utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);
                    this.getaddressbookDetails($('#contactSearch').val());
                    //this.onMessageReceived();

                    this.scrollToBottom();

                },
                error => {
                    console.log("Message sending failed with error:", error);
                }
            );
        },
        sendMediaMessage: function () {
            $("#chatLoader").attr("style", "display:block");
            let receiverID = userid;
            let messageobj = document.getElementById('filechat').files[0];

            let receiverType;
            if (currentusertype === "u")
                receiverType = CometChat.RECEIVER_TYPE.USER;
            else if (currentusertype === "g")
                receiverType = CometChat.RECEIVER_TYPE.GROUP;
            if (messageobj['type'].split('/')[0] === 'image') {
                let messageType = CometChat.MESSAGE_TYPE.IMAGE;
                let mediaMessage = new CometChat.MediaMessage(
                    receiverID, messageobj, messageType, receiverType
                );

                CometChat.sendMessage(mediaMessage).then(
                    message => {
                        //$('#message-form').trigger('reset');
                        //$("#message-form")[0].reset();
                        $('#group-message-holder').empty();
                        messageArray = [...messageArray, message];
                        utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);
                        this.getaddressbookDetails($('#contactSearch').val());
                        //this.onMessageReceived();

                        this.scrollToBottom();

                    },
                    error => {
                        console.log("Message sending failed with error:", error);
                    }
                );
            }
            else if (messageobj['type'].split('/')[0] === 'audio') {
                let messageType = CometChat.MESSAGE_TYPE.AUDIO;
                let mediaMessage = new CometChat.MediaMessage(
                    receiverID, messageobj, messageType, receiverType
                );
                CometChat.sendMessage(mediaMessage).then(
                    message => {
                        //$('#message-form').trigger('reset');
                        //$("#message-form")[0].reset();
                        $('#group-message-holder').empty();
                        messageArray = [...messageArray, message];
                        utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);

                        //this.onMessageReceived();

                        this.scrollToBottom();

                    },
                    error => {
                        console.log("Message sending failed with error:", error);
                    }
                );
            }
            else if (messageobj['type'].split('/')[0] === 'video') {
                let messageType = CometChat.MESSAGE_TYPE.VIDEO;
                let mediaMessage = new CometChat.MediaMessage(
                    receiverID, messageobj, messageType, receiverType
                );
                CometChat.sendMessage(mediaMessage).then(
                    message => {
                        //$('#message-form').trigger('reset');
                        //$("#message-form")[0].reset();
                        $('#group-message-holder').empty();
                        messageArray = [...messageArray, message];
                        utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);

                        //this.onMessageReceived();

                        this.scrollToBottom();

                    },
                    error => {
                        console.log("Message sending failed with error:", error);
                    }
                );
                $("#chatLoader").attr("style", "display:none");
            }
            else {
                let messageType = CometChat.MESSAGE_TYPE.FILE;
                let mediaMessage = new CometChat.MediaMessage(
                    receiverID, messageobj, messageType, receiverType
                );
                CometChat.sendMessage(mediaMessage).then(
                    message => {
                        //$('#message-form').trigger('reset');
                        //$("#message-form")[0].reset();
                        $('#group-message-holder').empty();
                        messageArray = [...messageArray, message];
                        utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);

                        //this.onMessageReceived();

                        this.scrollToBottom();

                    },
                    error => {
                        console.log("Message sending failed with error:", error);
                    }
                );
            }

            $("#chatLoader").attr("style", "display:none");
        },
        onMessageReceived: function () {
            $('#empty-chat').hide();
            $('#group-message-holder').show();
            $('#send-message-spinner').hide();
            let listenerID = "UNIQUE_LISTENER_ID";

            CometChat.addMessageListener(
                listenerID,
                new CometChat.MessageListener({
                    onTypingStarted: typingIndicator => {
                        //console.log("Typing started :", typingIndicator);
                        if (typingIndicator.sender.uid === userid)
                            this.getUserDetails(currentusertype, userid, "(typing...)");
                    },
                    onTypingEnded: typingIndicator => {
                        //console.log("Typing ended :", typingIndicator);
                        if (typingIndicator.sender.uid === userid)
                            this.getUserDetails(currentusertype, userid, "");

                    },
                    onMediaMessageReceived: mediaMessage => {
                        //console.log("Media message received successfully", mediaMessage);
                        messageArray = [...messageArray, mediaMessage];
                        //CometChat.markAsRead(mediaMessage.id, mediaMessage.receiverId, mediaMessage.receiverType);
                        if ($("#chatBox").attr("style") === "display:none") {
                            utilService.openChatPage(mediaMessage.sender.uid, userDataLoad);
                        }
                        if ((mediaMessage.sender.uid === userid && mediaMessage.receiverType === "user") || ((mediaMessage.receiverId === userid && mediaMessage.receiverType === "group"))) {
                            $("#chatLoader").attr("style", "display:block");
                            //$('#message-form').trigger('reset');
                            $('#group-message-holder').empty();
                            utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);
                            this.scrollToBottom();
                            $("#chatLoader").attr("style", "display:none");
                        }
                        this.getaddressbookDetails($('#contactSearch').val());
                    },
                    onTextMessageReceived: textMessage => {
                        messageArray = [...messageArray, textMessage];
                        //$('.old-chats').remove();
                        //console.log(textMessage);
                        if ($("#chatBox").attr("style") === "display:none") {
                            utilService.openChatPage(mediaMessage.sender.uid, userDataLoad);
                        }
                        //CometChat.markAsRead(mediaMessage.id, mediaMessage.receiverId, mediaMessage.receiverType);
                        if ((textMessage.sender.uid === userid && textMessage.receiverType === "user") || ((textMessage.receiverId === userid && textMessage.receiverType === "group"))) {
                            $("#chatLoader").attr("style", "display:block");
                            //$('#message-form').trigger('reset');
                            $('#group-message-holder').empty();
                            utilService.convertMessageArrayTODisplay(messageArray, COMETCHAT_FROM_USER, userid);
                            this.scrollToBottom();
                            $("#chatLoader").attr("style", "display:none");
                        }
                        this.getaddressbookDetails($('#contactSearch').val());
                    },
                    onCustomMessageReceived: customMessage => {
                        console.log("Custom message received successfully", customMessage);
                        if (customMessage.type === "Join Request") {
                            var proceed = confirm(customMessage.sender.name + " wants to joins the call.");
                            var CustomData, CustomType;
                            if (proceed) {
                                if (customMessage.data.customData.CallType === "Audio") {
                                    CustomData = {
                                        UserId: customMessage.sender.uid,
                                        CallSessionId: "1234-1234",
                                        ReceiverId: "754",
                                        ResponseAnswer: "Yes",
                                        CallType: "Audio"
                                    };
                                    CustomType = "Join Response";
                                    this.sendCustomMessage(CustomData, CustomType);
                                } else {
                                    CustomData = {
                                        UserId: customMessage.sender.uid,
                                        CallSessionId: "1234-1234",
                                        ReceiverId: "754",
                                        ResponseAnswer: "Yes",
                                        CallType: "Video"
                                    };
                                    CustomType = "Join Response";
                                    this.sendCustomMessage(CustomData, CustomType);
                                }
                            } else {
                                CustomData = {
                                    UserId: customMessage.sender.uid,
                                    CallSessionId: "1234-1234",
                                    ReceiverId: "754",
                                    ResponseAnswer: "No"
                                };
                                CustomType = "Join Response";
                                this.sendCustomMessage(CustomData, CustomType);
                            }
                        } else if (customMessage.type === "Join Response") {
                            if (customMessage.data.customData.ResponseAnswer === "Yes") {
                                if (customMessage.data.customData.CallType === "Audio") {
                                    $("#WaitingCall-Page").hide();
                                    $("#directCall-Page").show();
                                    this.initiateDirectCall(customMessage.data.customData.CallSessionId);
                                } else {
                                    $("#WaitingCall-Page").hide();
                                    $("#directCall-Page").show();
                                    this.initiateDirectVideoCall(customMessage.data.customData.CallSessionId);
                                }
                            } else {
                                $("#WaitingCall-Page").hide();
                                $("#directCall-Page").hide();
                                $("#RejectCall-Page").show();
                            }
                        }
                        // Handle custom message
                    }
                })
            );
        },
        initiateCall: function () {
            var receiverID = userid;
            var callType = CometChat.CALL_TYPE.AUDIO;
            //var receiverType = CometChat.RECEIVER_TYPE.USER;/
            let receiverType;
            if (currentusertype === "u")
                receiverType = CometChat.RECEIVER_TYPE.USER;
            else if (currentusertype === "g")
                receiverType = CometChat.RECEIVER_TYPE.GROUP;

            var call = new CometChat.Call(receiverID, callType, receiverType);

            CometChat.initiateCall(call).then(
                outGoingCall => {
                    callAcceptedStatus = false;
                    callInitiatorFlag = true;
                    checkCallStatus = true;
                    $.playSound('/images/vivo-ringtone.mp3');
                    messageList = `<p><i class="fas fa-phone-alt"></i> call</p><br/>`;
                    $('#group-message-holder').append(messageList);
                    $('#callSessionID').val(outGoingCall.sessionId);
                    $("#add-book").hide();
                    $("#groupsList").hide();
                    $("#msg-page").attr("style", "display:none");
                    $("#call-reject").attr("style", "display:flex");
                    $("#call-accept").attr("style", "display:none");
                    $("#call-page").attr("style", "display:flex");
                    $("#showchatIcon").show();
                    $('#addressBook').hide();

                    //console.log("Call initiated successfully:", outGoingCall);
                    // perform action on success. Like show your calling screen.
                },
                error => {
                    console.log("Call initialization failed with exception:", error);
                }
            );
        },
        initiateDirectCall: function (SessionId) {
            let sessionID = SessionId;
            let audioOnly = true;
            let deafaultLayout = true;

            let callSettings = new CometChat.CallSettingsBuilder()
                .enableDefaultLayout(deafaultLayout)
                .setSessionID(sessionID)
                .setIsAudioOnlyCall(audioOnly)
                .build();
            CometChat.startCall(
                callSettings,
                document.getElementById("directCall-Page"),
                new CometChat.OngoingCallListener({
                    onCallEnded: call => {
                        console.log("Call ended:", call);
                    },
                    onError: error => {
                        console.log("Error :", error);
                    }
                })
            );
        },
        initiateDirectVideoCall: function (SessionId) {
            let sessionID = SessionId;
            let audioOnly = false;
            let deafaultLayout = true;

            let callSettings = new CometChat.CallSettingsBuilder()
                .enableDefaultLayout(deafaultLayout)
                .setSessionID(sessionID)
                .setIsAudioOnlyCall(audioOnly)
                .build();
            CometChat.startCall(
                callSettings,
                document.getElementById("directCall-Page"),
                new CometChat.OngoingCallListener({
                    onCallEnded: call => {
                        console.log("Call ended:", call);
                    },
                    onError: error => {
                        console.log("Error :", error);
                    }
                })
            );
        },
        initiateVideCall: function () {
            var receiverID = userid;
            var callType = CometChat.CALL_TYPE.VIDEO;
            //var receiverType = CometChat.RECEIVER_TYPE.USER;

            let receiverType;
            if (currentusertype === "u")
                receiverType = CometChat.RECEIVER_TYPE.USER;
            else if (currentusertype === "g")
                receiverType = CometChat.RECEIVER_TYPE.GROUP;

            var call = new CometChat.Call(receiverID, callType, receiverType);

            CometChat.initiateCall(call).then(
                outGoingCall => {
                    callAcceptedStatus = false;
                    callInitiatorFlag = true;
                    checkCallStatus = true;
                    messageList = `<p><i class="fas fa-video"></i> call</p><br />`;
                    $('#group-message-holder').append(messageList);
                    $('#callSessionID').val(outGoingCall.sessionId);
                    $("#add-book").hide();
                    $("#groupsList").hide();
                    $("#msg-page").attr("style", "display:none");
                    $("#call-accept").attr("style", "display:none");
                    $("#call-reject").attr("style", "display:flex");
                    $("#call-page").attr("style", "display:flex");
                    $("#showchatIcon").show();
                    $('#addressBook').hide();
                    $.playSound('/images/vivo-ringtone.mp3');
                    //console.log("Call initiated successfully:", outGoingCall);
                    // perform action on success. Like show your calling screen.
                },
                error => {
                    console.log("Call initialization failed with exception:", error);
                }
            );
        },
        callReceiving: function () {
            //console.log("callReceiving");
            var listnerID = "UNIQUE_LISTENER_ID";
            CometChat.addCallListener(
                listnerID,
                new CometChat.CallListener({
                    onIncomingCallReceived(call) {
                        //console.log("Incoming call:", call);
                        if ($("#chatBox").attr("style") === "display:none") {
                            utilService.openChatPage(call.sender.uid, userDataLoad);
                        }

                        if ($('.chatBox').hasClass("chatBoxClose") === true) {
                            $('.chatBox').toggleClass('chatBoxClose');
                            $('#chatBoxOpener').find('i').toggleClass('fa-arrow-up');
                            $('#chatBoxOpener').find('i').toggleClass('fa-arrow-down');
                        }
                        if ($("#addressBook").hasClass("aqua") === true) {
                            $('.chatBody').toggleClass('chatBodyHalf');
                            $('.contactList').toggle();
                            $('#groupsList').hide();
                            $('#addressBook').toggleClass('aqua');
                            $('.chatBox').toggleClass('chatBoxBig');
                        }
                        messageList = `<p><i class="fas fa-video"></i> call</p><br />`;
                        if (call.type === "audio") {
                            messageList = `<p><i class="fas fa-phone-alt"></i> call</p><br />`;
                        }
                        else if (call.type === "video") {
                            messageList = `<p><i class="fas fa-video"></i> call</p><br />`;
                        }
                        $('#group-message-holder').append(messageList);

                        $.playSound('/images/vivo-ringtone.mp3');

                        $('#callinitiatorname').empty();
                        $('#callinitiatorname').append(call.callInitiator.name);
                        $('#callinitiatorname').append(`<span> calling...</span>`);

                        $('#callSessionID').val(call.sessionId);
                        $("#add-book").hide();
                        $("#groupsList").hide();
                        $("#msg-page").attr("style", "display:none");
                        $("#call-accept").attr("style", "display:flex");
                        $("#call-reject").attr("style", "display:flex");
                        $("#call-page").attr("style", "display:flex");
                        $("#showchatIcon").show();
                        // Handle incoming call
                    },
                    onOutgoingCallAccepted(call) {
                        callAcceptedStatus = true;
                        checkCallStatus = true;
                        $.stopSound();
                        //console.log("Outgoing call accepted:", call);
                        //$('#callSessionID').val(call.sessionId)	;   
                        //var sessionID = $('#callSessionID').val();
                        //console.log(sessionID);
                        $("#add-book").hide();
                        $("#groupsList").hide();
                        $("#msg-page").attr("style", "display:none");
                        $("#call-reject").attr("style", "display:none");
                        $("#call-accept").attr("style", "display:none");
                        $("#call-page").attr("style", "display:flex");
                        $("#showchatIcon").show();

                        CometChat.startCall(
                            call.sessionId,
                            document.getElementById("call-page"),
                            new CometChat.OngoingCallListener({
                                onUserJoined: user => {
                                    /* Notification received here if another user joins the call. */
                                    //console.log("User joined call:", user);
                                    /* this method can be use to display message or perform any actions if someone joining the call */
                                },
                                onUserLeft: user => {
                                    /* Notification received here if another user left the call. */
                                    //console.log("User left call:", user);
                                    /* this method can be use to display message or perform any actions if someone leaving the call */
                                },
                                onCallEnded: call => {
                                    /* Notification received here if current ongoing call is ended. */
                                    checkCallStatus = false;
                                    //CometChat.removeCallListener(listenerID);
                                    $('#addressBook').show();
                                    $('.chatBody').removeClass('chatBodyHalf');
                                    $('#addressBook').addClass('aqua');
                                    $('.chatBox').removeClass('chatBoxBig');
                                    $("#msg-page").attr("style", "display:block");
                                    $("#call-page").attr("style", "display:none");
                                    $("#showchatIcon").hide();
                                    //CometChat.removeCallListener(listnerID);
                                    CometChat.endCall(call.sessionId).then(
                                        call => {
                                            //console.log("Call ended: endCall", call);
                                        }, err => {
                                            console.log("error while ending call", err);
                                        }
                                    );
                                    //console.log("Call ended:onCallEnded", call);
                                    /* hiding/closing the call screen can be done here. */
                                }
                            })
                        );
                        // Outgoing Call Accepted
                    },
                    onOutgoingCallRejected(call) {
                        $.stopSound();
                        //CometChat.removeCallListener(listenerID);
                        utilService.callEndAction();
                        //console.log("Outgoing call rejected:", call);
                        // Outgoing Call Rejected
                    },
                    onIncomingCallCancelled(call) {
                        $.stopSound();
                        //CometChat.removeCallListener(listenerID);
                        utilService.callEndAction();
                        //console.log("Incoming call cancelled:", call);
                        var fromutype, toutype;
                        $.each(userDataLoad, function (index, value) {
                            if (call.callReceiver.uid === value.User_Id)
                                fromutype = value.GroupName;
                            if (call.callInitiator.uid === value.User_Id)
                                toutype = value.GroupName;
                        });

                        $.get(baseUrl + '/api/User/userCallMissed_Alert?UserId=' + call.callReceiver.uid + '&from=' + fromutype + '&missedby=' + toutype + '&Institution_Id=' + window.localStorage['InstitutionId'])
                            .done(function (data) {
                                var result = data;
                            });

                    }
                })
            );
        },
        callAccept: function () {
            var sessionID = $('#callSessionID').val();
            checkCallStatus = true;
            CometChat.acceptCall(sessionID).then(
                call => {
                    //console.log("Call accepted successfully:", call);
                    $.stopSound();
                    CometChat.startCall(
                        call.sessionId,
                        document.getElementById("call-page"),
                        new CometChat.OngoingCallListener({
                            onUserJoined: user => {
                                /* Notification received here if another user joins the call. */
                                //console.log("User joined call:", user);
                                $("#add-book").hide();
                                $("#groupsList").hide();
                                $("#msg-page").attr("style", "display:none");
                                $("#call-accept").attr("style", "display:none");
                                $("#call-reject").attr("style", "display:none");
                                $("#call-page").attr("style", "display:flex");
                                $("#showchatIcon").show();
                                $('#callinitiatorname').empty();
                                /* this method can be use to display message or perform any actions if someone joining the call */
                            },
                            onUserLeft: user => {
                                /* Notification received here if another user left the call. */
                                //console.log("User left call:", user);

                                utilService.callEndAction();

                                /* this method can be use to display message or perform any actions if someone leaving the call */
                            },
                            onCallEnded: call => {

                                utilService.callEndAction();
                                CometChat.endCall(call.sessionId).then(
                                    call => {
                                        //console.log("Call ended: endCall", call);
                                    }, err => {
                                        console.log("error while ending call", err);
                                    }
                                );
                                /* Notification received here if current ongoing call is ended. */
                                //console.log("Call ended:", call);
                                /* hiding/closing the call screen can be done here. */
                            }
                        })
                    );
                    // start the call using the startCall() method
                },
                error => {
                    utilService.callEndAction();
                    console.log("Call acceptance failed with error", error);
                    // handle exception
                }
            );
        },
        callReject: function () {
            var sessionID = $('#callSessionID').val();
            var status;
            checkCallStatus = false;
            if (callAcceptedStatus === false)
                status = CometChat.CALL_STATUS.CANCELLED;
            else
                status = CometChat.CALL_STATUS.REJECTED;

            CometChat.rejectCall(sessionID, status).then(
                call => {
                    //console.log("Call rejected successfully", call);

                    if (callInitiatorFlag === true) {
                        CometChat.endCall(call.sessionId).then(
                            call => {
                                //console.log("Call ended: endCall", call);
                            }, err => {
                                console.log("error while ending call", err);
                            });
                    }

                    utilService.callRejectAction();
                },
                error => {
                    console.log("Call rejection failed with error:", error);
                    utilService.callRejectAction();
                }
            );
        },
        groupMemberDetails: function (groupGUID) {
            var GUID = groupGUID;
            var limit = 30;
            var groupMemberRequest = new CometChat.GroupMembersRequestBuilder(GUID)
                .setLimit(limit)
                .build();
            var memType = "";
            groupMemberRequest.fetchNext().then(
                groupMembers => {
                    //console.log("Group Member list fetched successfully:", groupMembers);
                    var memberList = "Members in the group are,\n";

                    $.each(groupMembers, function (index, value) {
                        memType = "";
                        $.each(userDataLoad, function (m_index, m_value) {
                            if (m_value.User_Id === value.uid) {
                                memType = m_value.GroupName;
                            }
                        });
                        memberList = memberList + value.name + '(' + memType + ')' + '\n';
                    });

                    alert(memberList);

                },
                error => {
                    console.log("Group Member list fetching failed with exception:", error);
                }
            );
        },
        getUserDetails: function (userType, UserId, msgToDisplay) {
            if (userType === "u") {
                CometChat.getUser(UserId).then(
                    user => {
                        //console.log("User details fetched for user:", user);
                        $('#h1user').empty();
                        $('#h1user').append(user.name);
                        $('#h1user').append(`<br/><span>` + user.status + msgToDisplay + `</span>`);
                    },
                    error => {
                        console.log("User details fetching failed with error:", error);
                    }
                );
            }
            else if (userType === "g") {
                CometChat.getGroup(UserId).then(
                    group => {
                        $('#h1user').empty();
                        $('#h1user').append(group.name);
                        $('#h1user').append(`<br/><span style="cursor:pointer" onclick="chatService.groupMemberDetails('` + UserId + `')">` + group.membersCount + ` participants</span>`);
                        //console.log("Group details fetched successfully:", group);
                    },
                    error => {
                        console.log("Group details fetching failed with exception:", error);
                    }
                );
            }

        },
        deleteGroupDetails: function () {
            var conf = confirm("Are you sure to delete this group?");
            if (conf === true) {
                var GUID = userid;

                CometChat.deleteGroup(GUID).then(
                    response => {
                        //console.log("Groups deleted successfully:", response);
                        this.getaddressbookDetails($('#contactSearch').val());
                    },
                    error => {

                        CometChat.leaveGroup(GUID).then(
                            hasLeft => {
                                //console.log("Group left successfully:", hasLeft);
                                this.getaddressbookDetails($('#contactSearch').val());
                            },
                            error => {
                                console.log("Group leaving failed with exception:", error);
                                alert("Error in deleting the group");
                            }
                        );
                        console.log("Group delete failed with exception:", error);
                    }
                );
            }
        },
        getaddressbookDetails: function (searchContact) {
            var validuser = true;
            $("#chatLoader_add").attr("style", "display:block");
            var conversationsRequest = new CometChat.ConversationsRequestBuilder()
                .setLimit(50)
                .build();

            conversationsRequest.fetchNext().then(
                conversationList => {
                    $('#address-user').empty();
                    //console.log("Conversations list received:", conversationList);
                    $.each(conversationList, function (index, value) {
                        if (value.conversationWith.name.toLowerCase().indexOf(searchContact.toLowerCase()) !== -1) {
                            var messageList;
                            var messagedisplay = "";
                            var uid = "";
                            var lastsent = "";
                            var userType = "";

                            var useronlinestatus = "on";
                            var gendername = "male.png";
                            if (value.conversationType === "user") {
                                userType = "u";
                                lastsent = utilService.convertStringToDate(value.lastMessage.sentAt);
                                uid = value.conversationWith.uid;
                                if (value.lastMessage.category === "message" && value.lastMessage.type === "text")
                                    messagedisplay = value.lastMessage.text;
                                else if (value.lastMessage.category === "message" && value.lastMessage.type === "image")
                                    messagedisplay = value.lastMessage.attachment.fileName;
                                else if (value.lastMessage.category === "message" && value.lastMessage.type === "audio")
                                    messagedisplay = value.lastMessage.attachment.fileName;
                                else if (value.lastMessage.category === "message" && value.lastMessage.type === "video")
                                    messagedisplay = value.lastMessage.attachment.fileName;
                                else if (value.lastMessage.category === "call" && value.lastMessage.type === "audio")
                                    messagedisplay = "call";
                                else if (value.lastMessage.category === "call" && value.lastMessage.type === "video")
                                    messagedisplay = "call";
                                else if (value.lastMessage.type === "file")
                                    messagedisplay = value.lastMessage.attachment.fileName;


                                if (value.conversationWith.status === "offline")
                                    useronlinestatus = "off";

                                validuser = false;
                                $.each(userDataLoad, function (contIndex, contValue) {
                                    if (value.conversationWith.uid === contValue.User_Id) {
                                        if (contValue.GenderName.toLowerCase() === "male") {
                                            gendername = "male.png";
                                        }
                                        else if (contValue.GenderName.toLowerCase() === "female") {
                                            gendername = "female.png";
                                        }
                                        else {
                                            gendername = "others.png";
                                        }
                                        validuser = true;
                                    }
                                });

                            }
                            else if (value.conversationType === "group") {
                                userType = "g";
                                lastsent = "";//utilService.convertStringToDate(value.lastMessage.sentAt);
                                uid = value.conversationWith.guid;
                                if (value.lastMessage !== undefined) {
                                    lastsent = utilService.convertStringToDate(value.lastMessage.sentAt);
                                    if (value.lastMessage.category === "message" && value.lastMessage.type === "text")
                                        messagedisplay = value.lastMessage.text;
                                    else if (value.lastMessage.category === "message" && value.lastMessage.type === "image")
                                        messagedisplay = value.lastMessage.attachment.fileName;
                                    else if (value.lastMessage.category === "message" && value.lastMessage.type === "audio")
                                        messagedisplay = value.lastMessage.attachment.fileName;
                                    else if (value.lastMessage.category === "message" && value.lastMessage.type === "video")
                                        messagedisplay = value.lastMessage.attachment.fileName;
                                    else if (value.lastMessage.category === "call" && value.lastMessage.type === "audio")
                                        messagedisplay = "call";
                                    else if (value.lastMessage.category === "call" && value.lastMessage.type === "video")
                                        messagedisplay = "call";
                                    else if (value.lastMessage.type === "file")
                                        messagedisplay = value.lastMessage.attachment.fileName;
                                }

                                validuser = true;
                                /*$.each(userDataLoad, function (contIndex, contValue) {
                                    if (uid == contValue.User_Id) {
                                        validuser = true;
                                    }
                                })*/
                            }

                            var msgcountdisplay = "";
                            if (value.unreadMessageCount > 0) {
                                msgcountdisplay = `<label class="chatCount">` + value.unreadMessageCount + `</label>`;
                            }
                            else {
                                msgcountdisplay = `<label class="chatNoCount"></label>`;
                            }
                            messageList = `<li id=` + $.trim(uid) + ` style="cursor:pointer" onclick="openUserChat('` + userType + `', '` + $.trim(uid) + `', '` + validuser + `')">
                                <div class = "userOnlineInfo ` + useronlinestatus + `" >
                                    <img src= "../../Images/` + gendername + `" alt="Profile">
                                </div>
                               <section>
                                   <span>` + value.conversationWith.name + `</span>
                                   ` + msgcountdisplay + `
                                   <article>` + messagedisplay + `<span>` + lastsent + `</span></article>
                                   </section>
                               </li>`;
                            $('#address-user').append(messageList);
                        }
                    });

                    var baseUrl = $("base").first().attr("href");
                    if (baseUrl === "/") {
                        baseUrl = "";
                    }
                    validuser = true;
                    var contactExist = false;
                    var gendername = "male";
                    $.each(userDataLoad, function (index, value) {
                        contactExist = false;
                        $.each(conversationList, function (contIndex, contValue) {
                            if (contValue.conversationType === "user") {
                                if (contValue.conversationWith.uid === value.User_Id)
                                    contactExist = true;
                            }
                        });

                        if (value.GenderName.toLowerCase() === "male") {
                            gendername = "male.png";
                        }
                        else if (value.GenderName.toLowerCase() === "female") {
                            gendername = "female.png";
                        }
                        else {
                            gendername = "others.png";
                        }
                        if (value.UserName.toLowerCase().indexOf(searchContact.toLowerCase()) !== -1 && contactExist === false && value.User_Id !== username) {
                            messageList = `<li id=` + value.User_Id + `  style="cursor:pointer" onclick="openUserChat('u', '` + value.User_Id + `', '` + validuser + `')">
                                    <div class="userOnlineInfo off">
                                        <img src= "../../Images/` + gendername + `" alt="Profile">
                                    </div>
                                   <section>
                                       <span>` + value.UserName + `</span>
                                       <label class="chatNoCount"></label>
                                       <article><span></span></article>
                                       </section>
                                   </li>`;
                            $('#address-user').append(messageList);
                        }
                    });

                },
                error => {
                    console.log("Conversations list fetching failed with error:", error);
                }
            );
            $("#chatLoader_add").attr("style", "display:none");

        },
        groupaddressbookDetails: function () {

            $('#group-user').empty();
            var baseUrl = $("base").first().attr("href");
            if (baseUrl === "/") {
                baseUrl = "";
            }
            var gendername = "";
            var contactExist = false;

            $.each(userDataLoad, function (index, value) {

                if (value.GenderName.toLowerCase() === "male") {
                    gendername = "male.png";
                }
                else if (value.GenderName.toLowerCase() === "female") {
                    gendername = "female.png";
                }
                else {
                    gendername = "others.png";
                }
                if (value.User_Id !== username) {
                    messageList = `<li id=` + value.User_Id + `  style="cursor:pointer">       
                        <div class="selectContact">
                            <input type="checkbox" id="chk` + value.User_Id + `"/>
                        </div>
                        <div class="userOnlineInfo off">
                            <img src= "../../Images/` + gendername + `" alt="Profile">
                        </div>
                            <section>
                                <span>` + value.UserName + `</span>
                                   
                                <article><span></span></article>
                                </section>
                            </li>`;
                    $('#group-user').append(messageList);
                }
            });


        },
        createGroup: function (groupname) {
            var GUID = utilService.createGUID();
            var groupName = groupname;
            var groupType = CometChat.GROUP_TYPE.PUBLIC;
            var password = "";
            var userlist = "";
            var validGroup = false;
            var baseUrl = $("base").first().attr("href");
            if (baseUrl === "/") {
                baseUrl = "";
            }
            var contactExist = false;

            $.each(userDataLoad, function (index, value) {
                if (value.User_Id !== username && document.getElementById("chk" + value.User_Id).checked === true) {
                    if (userlist !== "") {
                        userlist = userlist + ",";
                        validGroup = true;
                    }
                    userlist = userlist + value.User_Id.toString();

                }
            });
            if (validGroup === false) {
                alert("Minimum two users to be selected to create group");
                return false;
            }

            var group = new CometChat.Group(GUID, groupName, groupType, password);

            var userarray = userlist.split(',');

            let membersList = [];
            $.each(userarray, function (ui, uv) {
                membersList.push(new CometChat.GroupMember(uv, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT));
            });
            //console.log(membersList);
            CometChat.createGroup(group).then(
                group => {
                    //console.log("Group created successfully:", group);
                    //let GUID = "GUID";
                    let membersList = [];
                    $.each(userarray, function (ui, uv) {
                        membersList.push(new CometChat.GroupMember(uv, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT));
                    });
                    CometChat.addMembersToGroup(GUID, membersList, []).then(
                        response => {
                            alert("Group created successfully");

                            $('#addGroup').click();
                        },
                        error => {
                            console.log("Something went wrong", error);
                        }
                    );


                },
                error => {
                    console.log("Group creation failed with exception:", error);
                }
            );

        },
        startTypeingNot: function () {
            let receiverId = userid;

            let receiverType;
            if (currentusertype === "u")
                receiverType = CometChat.RECEIVER_TYPE.USER;
            else if (currentusertype === "g")
                receiverType = CometChat.RECEIVER_TYPE.GROUP;

            let typingNotification = new CometChat.TypingIndicator(
                receiverId,
                receiverType
            );
            CometChat.startTyping(typingNotification);
        },
        endTypeingNot: function () {
            let receiverId = userid;
            let receiverType;
            if (currentusertype === "u")
                receiverType = CometChat.RECEIVER_TYPE.USER;
            else if (currentusertype === "g")
                receiverType = CometChat.RECEIVER_TYPE.GROUP;

            let typingNotification = new CometChat.TypingIndicator(
                receiverId,
                receiverType
            );
            CometChat.endTyping(typingNotification);
        },
        openChatfromOtherPage: function () {
            utilService.openChatPage("", userDataLoad);
        },
        getUserOnlineStatus: function () {
            var listenerID = "UNIQUE_LISTENER_ID";
            CometChat.addUserListener(
                listenerID,
                new CometChat.UserListener({
                    onUserOnline: onlineUser => {
                        if ($("#" + onlineUser.uid) !== undefined)
                            $("#" + onlineUser.uid).find("div.userOnlineInfo").attr("class", "userOnlineInfo on");
                        /* when someuser/friend comes online, user will be received here */
                        //console.log("On User Online:", { onlineUser });
                    },
                    onUserOffline: offlineUser => {
                        /* when someuser/friend went offline, user will be received here */
                        if ($("#" + offlineUser.uid) !== undefined)
                            $("#" + offlineUser.uid).find("div.userOnlineInfo").attr("class", "userOnlineInfo off");
                        //console.log("On User Offline:", { offlineUser });
                    }
                })
            );
        },
        scrollToBottom() {
            const chat = document.getElementById("msg-page");
            chat.scrollTo(0, chat.scrollHeight);
        },
        checkCall: function (userId) {
            if (window.COMETCHAT_TO_USER === userId)
                return false;
            else
                return checkCallStatus;
        }
    };
}();