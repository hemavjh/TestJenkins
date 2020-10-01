$(document).ready(function() {

    // Global variables
    //window.COMETCHAT_APP_ID = '14486fdf7b13a9c';
    //window.COMETCHAT_API_KEY = 'b484a6e2d73b4d97bbc7b9afbcd44747ba64492d';

    // Initialize app
    //chatService.initializeApp();
    //pushNotificationService.initializeFirebase();

    // Send message
    /*$('#sendmsgbutton').click(function (e) {
        e.preventDefault(); 
        $('.old-chats').remove();
        chatService.sendMessage();		
		//chatService.startTypeingNot();
        //chatService.sendMessage();
		//chatService.endTypeingNot();
    });*/

    // Send message
    $('#callbutton').click(function(e) {    
        e.preventDefault(); 
		chatService.initiateCall();
    });
	
    // Send message
    $('#receivecallbutton').click(function(e) {    
        e.preventDefault(); 
		chatService.callAccept();
    });

});