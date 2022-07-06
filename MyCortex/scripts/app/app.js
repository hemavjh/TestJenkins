/// <reference path="app.js" />
var EmpApp = angular.module('EmpApp', [
    'ngRoute',
    'AllyControllers',
    'ngSanitize',
    'ngIdle',
    'toastr',
    'ngFileUpload',
    'AllergyMasterList',
    'ICD10Controller',
    'DrugDBController',
    'PayorMasterController',
    'PlanMasterController',
    'ParameterSettingsController',
    'ChatSettingsController',
    'PasswordController',
    'EmailConfigurationController',
    'SMSConfigurationController',
    'EmailAlertlistController',
    'WebConfigurationController',
    'LanguageSettingsController',
    'GateWaySettingsController',
    'EmailTemplateController',
    'SendEmailController',
    'EmailUndeliveredController',
    'EmailHistoryController',
    'PatientReportListController',
    'DoctorShiftController',
    'AttendanceDetailsController',
    'MyHomeController',
    'InstitutionSubscriptionHospitalAdminController',
    'InstitutionHospitalAdminController',
    'UserController',
    'PatientApprovalController',
    'InstitutionController',
    'InstitutionSubscriptionController',
    'UserHealthDataDetailsController',
    'NotificationViewController',
    'CareCoordinatorController',
    'AllPatientListController',
    'CareGiverAssignedPatientsController',
    'MonitoringProtocolController',
    'PatientAppointmentController',
    'PatientAppointmentListController',
    'homeController',
    'GooglehomeController',
    'UsersLogController',
    'DirectCallController',
    'DirectVideoCallController',
    'ParameterController',
    'UnderConstructionController',
    'ParentController',
    'AlertConfigurationController',
    'ProtocolController',
    'PatientController',
    'DoctorProfileController',
    'CoordinatorController',
    'CommonController',
    'AppointmentSlotController',
    'SlotTimingController',
    'DoctorAppointmentDetailsForOthersController',
    "AppointmentApprovalController"
]);


EmpApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});

EmpApp.run(function ($rootScope, $http, $window) {
    //$http.get(baseUrl + "/api/CommonMenu/CommonModule_List?InsId=" + $window.localStorage['InstitutionId']).success(function (response) {
    //    $rootScope.InsModuleList = response;
    //});
});

EmpApp.run(function ($rootScope) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        var chk = localStorage.getItem('callisRunning');
        if (chk == '1') {
            event.preventDefault();
        }
    });
});

EmpApp.config(['IdleProvider', function (IdleProvider) {
    // configure Idle settings
    //console.log('KeepaliveProvider')
    IdleProvider.idle(window.localStorage['IdleDays']);
   // IdleProvider.idle(60*10);
    IdleProvider.timeout(60);
    //KeepaliveProvider.interval(10);
    IdleProvider.interrupt('keydown wheel mousedown touchstart touchmove scroll');
}])
.run(function (Idle) {
    // start watching when the app runs. also starts the Keepalive service by default.
    Idle.watch();
});
EmpApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    var baseUrl = $("base").first().attr("href");

    $routeProvider.
    when('/login', {
        templateUrl: baseUrl + 'Login/Views/Login.html',
        controller: 'LoginController'
    }).
    when('/signup/:InstitutionCode', {
        templateUrl: baseUrl + 'Login/Views/Signup.html',
        controller: 'SignupController'
    }).
   when('/home', {
       templateUrl: baseUrl + 'Home/Views/HomePage.html',
       controller: 'homeController'
   }).
   when('/Googlehome', {
       templateUrl: baseUrl + 'Home/Views/HomePage.html',
       controller: 'GooglehomeController'
   }).
    when('/Institution', {
	    templateUrl: baseUrl + 'Admin/Views/Institutionlist.html',
	    controller: 'InstitutionController'
    }).
    when('/Institution_Subscription', {
        templateUrl: baseUrl + 'Admin/Views/InstitutionSubscriptionlist.html',
        controller: 'InstitutionSubscriptionController'
    }).
    when('/Device', {
        templateUrl: baseUrl + 'Admin/Views/DeviceNameAdminList.html',
        controller: 'MyHomeController'
    }).
    when('/SuperAdmin_UserList/:LoginUserType', {
        templateUrl: baseUrl + 'User/Views/SuperAdmin_Userlist.html',
        controller: 'UserController'
    }).
    when('/Admin_UserList/:LoginUserType', {
        templateUrl: baseUrl + 'User/Views/SuperAdmin_Userlist.html',
        controller: 'UserController'
    }).
    when('/HospitalAdmin_UserList/:LoginUserType', {
        templateUrl: baseUrl + 'User/Views/HospitalAdmin_Userlist.html',
        controller: 'UserController'
    }).
    when('/InstitutionHospitalAdmin_view', {
        templateUrl: baseUrl + 'Admin/Views/InstitutionView.html',
        controller: 'InstitutionHospitalAdminController'
    }).  

    when('/EditInstitutionHospitalAdmin', {
        templateUrl: baseUrl + 'Admin/Views/InstitutionDetails.html',
        controller: 'InstitutionHospitalAdminController'
    }).

    when('/InstitutionSubscriptionHospitalAdmin_view', {
        templateUrl: baseUrl + 'Admin/Views/InstitutionSubscriptionView.html',
        controller: 'InstitutionSubscriptionHospitalAdminController'
    }).
    when('/PatientList/:LoginUserType', {
        templateUrl: baseUrl + 'User/Views/Patientlist.html',
        controller: 'UserController'
    }).
     when('/PatientCreate/:PageParameter/:LoginUserType', {
         templateUrl: baseUrl + 'User/Views/PatientCreate.html',
         controller: 'UserController'
     }).
    when('/PatientView/:Id/:PageParameter/:LoginUserType', {
        templateUrl: baseUrl + 'User/Views/PatientView.html',
        controller: 'UserController'
    }).
    when('/PatientEdit/:Id/:PageParameter/:LoginUserType/:Editpatient', {
        templateUrl: baseUrl + 'User/Views/PatientCreate.html',
        controller: 'UserController'
    }).
      when('/PatientVitals/:Id/:PageParameter', {
          templateUrl: baseUrl + 'User/Views/PatientVitals.html',
          controller: 'UserHealthDataDetailsController'
      }).

    when('/Thirtydays_appointments', {
        templateUrl: baseUrl + 'User/Views/ThirtydaysAppointments.html',
        controller: 'PatientAppointmentController'
    }).
    when('/TodaysAppoint_ments', {
        templateUrl: baseUrl + 'User/Views/TodayAppointments.html',
        controller: 'PatientAppointmentController'
    }).

      when('/UnderConstruction', {
          templateUrl: baseUrl + 'UnderConstruction.html',
          controller: 'UnderConstructionController'
      }).
    when('/PatientAppointments', {
        templateUrl: baseUrl + 'User/Views/AllPatientList.html',
        controller: 'AllPatientListController'
    }).
    when('/ParameterSettings', {
        templateUrl: baseUrl + 'Masters/Views/ParameterSettings.html',
        controller: 'ParameterSettingsController'
    }).
    when('/CarecoordinatorCompliance/:PageParameter', {
        templateUrl: baseUrl + 'User/Views/CareCoordinator_Compliance.html',
        controller: 'CareCoordinatorController'
    }).
    when('/Carecoordinator/:PageParameter', {
        templateUrl: baseUrl + 'User/Views/CareCoordinator.html',
        controller: 'CareCoordinatorController'
    }).
    when('/CareGiverAssignedPatients', {
        templateUrl: baseUrl + 'User/Views/CareGiverAssignedPatients.html',
        controller: 'CareGiverAssignedPatientsController'
    }).
    when('/ChatSetting/:Id', {
        templateUrl: baseUrl + 'Masters/Views/ChatSettings.html',
        controller: 'ChatSettingsController'
    }).
    when('/EditChatSettings/:Id', {
        templateUrl: baseUrl + 'Masters/Views/ChatSettings.html',
        controller: 'ChatSettingsController'
    }).

    when('/ChatSetting/:Id', {
        templateUrl: baseUrl + 'Masters/Views/ChatSettings.html',
        controller: 'ChatSettingsController'
    }).
    when('/MonitoringProtocolList', {
        templateUrl: baseUrl + 'Admin/Views/MonitoringProtocolList.html',
        controller: 'MonitoringProtocolController'
    }).
  	//when('/ChangePassword', {
  	//    templateUrl: baseUrl + 'Admin/Views/ChangePassword.html',
  	//    controller: 'PasswordController'
  	//}).
    when('/ResetPassword', {
        templateUrl: baseUrl + 'Admin/Views/ResetPassword.html',
        controller: 'PasswordController'
    }).
    when('/SuperAdminResetPassword', {
        templateUrl: baseUrl + 'Admin/Views/SuperAdminResetPassword.html',
        controller: 'PasswordController'
    }).
    when('/PatientApproval', {
        templateUrl: baseUrl + 'User/Views/PatientApproval.html',
        controller: 'PatientApprovalController'
    }).
    when('/ICD10Master', {
        templateUrl: baseUrl + 'Masters/Views/MasterICDlist.html',
        controller: 'ICD10Controller'
    }).
    when('/Payor', {
        templateUrl: baseUrl + 'Masters/Views/Payor.html',
        controller: 'PayorMasterController'
    }).
    when('/Plan', {
        templateUrl: baseUrl + 'Masters/Views/PlanMaster.html',
        controller: 'PlanMasterController'
    }).
    when('/DrugDBMaster', {
        templateUrl: baseUrl + 'Masters/Views/DrugDBlist.html',
        controller: 'DrugDBController'
    }).
    when('/EmailTemplate/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/Templatelist.html',
        controller: 'EmailTemplateController'
    }).
    when('/MessagingSend/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/Messaging.html',
        controller: 'SendEmailController'
    }).
    when('/MessagingHistory/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/MessagingHistory.html',
        controller: 'EmailHistoryController'
    }).
    when('/EncryptDecryptlist', {
        templateUrl: baseUrl + 'Admin/Views/EncryptDecrypt.html',
        controller: 'CommonController'
    }).
    when('/SMSTemplate/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/TemplatelistSMS.html',
        controller: 'EmailTemplateController'
    }).
    when('/SMSSend/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/SMSMessaging.html',
        controller: 'SendEmailController'
    }).
    when('/SMSUndeliver/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/SMSUndelivered.html',
        controller: 'EmailUndeliveredController'
    }).
    when('/SMSHistory/:PageParameter', {
        templateUrl: baseUrl + 'Template/Views/SMSHistory.html',
        controller: 'EmailHistoryController'
    }).
    when('/NotificationView', {
        templateUrl: baseUrl + 'Template/Views/NotificationView.html',
        controller: 'NotificationViewController'
    }).
    when('/AuditReport', {
        templateUrl: baseUrl + 'Report/Views/AuditReportList.html',
        controller: 'PatientReportListController'
    }).
    when('/AppointmentSlot', {
        templateUrl: baseUrl + 'User/Views/AppointmentSlot.html',
        controller: 'AppointmentSlotController'
    }).
     when('/SlotTiming', {
         templateUrl: baseUrl + 'Masters/Views/SlotTiming.html',
         controller: 'SlotTimingController'
     }).
    when('/DoctorShift', {
        templateUrl: baseUrl + 'Masters/Views/DoctorShift.html',
        controller: 'DoctorShiftController'
    }).
   when('/DoctorHoliday', {
       templateUrl: baseUrl + 'Masters/Views/AttendanceDetails.html',
       controller: 'AttendanceDetailsController'
   }).
    when('/MyAppointmentSetting', {
        templateUrl: baseUrl + 'Masters/Views/MyAppointmentSetting.html',
        controller: 'DoctorShiftController'
    }).
    when('/WebConfiguration', {
        templateUrl: baseUrl + 'Masters/Views/WebConfiguration.html',
        controller: 'WebConfigurationController'
    }).
    when('/LanguageSettings', {
        templateUrl: baseUrl + 'Masters/Views/LanguageSettings.html',
        controller: 'LanguageSettingsController'
    }).
    when('/GateWaySettings', {
        templateUrl: baseUrl + 'Masters/Views/GateWaySettings.html',
        controller: 'GateWaySettingsController'
    }).
    //when('/EditParameterSettings/:Id', {
    //    templateUrl: baseUrl + 'Masters/Views/ParameterSettings.html',
    //    controller: 'ParameterSettingsController'
    //}).
        /*only html*/

    //when('/PatientAppointments', {
    //    templateUrl: baseUrl + 'Admin/Views/PatientAppointments.html',
    //    controller: 'AllPatientListController'
    //}).

          when('/Password_Policy', {
              templateUrl: baseUrl + 'Masters/Views/PasswordPolicy.html',
              controller: 'PasswordController'
          }).
          when('/EditPasswordPolicy', {
              templateUrl: baseUrl + 'Masters/Views/PasswordPolicy.html',
              controller: 'PasswordController'
          }).
         when('/MasterEmailConfigurationList', {
             templateUrl: baseUrl + 'Masters/Views/EmailConfiguration.html',
             controller: 'EmailConfigurationController'
         }).
        when('/MasterSmsConfigurationList', {
            templateUrl: baseUrl + 'Masters/Views/SMSConfiguration.html',
            controller: 'SMSConfigurationController'
        }).
        when('/AdminEmailConfigurationList/:LoginUserType', {
            templateUrl: baseUrl + 'Masters/Views/EmailConfiguration.html',
            controller: 'EmailConfigurationController'
        }).
        //when('/AdminEmailConfigurationList/:LoginUserType', {
        //    templateUrl: baseUrl + 'Masters/Views/AdminEmailConfiguration.html',
        //    controller: 'EmailConfigurationController'
        //}).
        when('/MasterAlertConfigurationList', {
            templateUrl: baseUrl + 'Template/Views/AlertConfiguration.html',
            controller: 'EmailAlertlistController'
        }).
        //when('/ParameterSetting', {
        //    templateUrl: baseUrl + 'Admin/Views/ParameterSettings.html',
        //    controller: 'UserController'
        //}).
        when('/Messaging', {
            templateUrl: baseUrl + 'Admin/Views/MessagingCreate.html',
            controller: 'UserController'
        }).
        when('/MessagingUndelivered/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/MessagingUndelivered.html',
            controller: 'EmailUndeliveredController'
        }).
        //when('/MessagingHistory', {
        //    templateUrl: baseUrl + 'Admin/Views/MessagingHistory.html',
        //    controller: 'UserController'
        //}).
        when('/Notification/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/Notification.html',
            controller: 'EmailTemplateController'
        }).
        when('/NotificationSend/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/NotificationSend.html',
            controller: 'SendEmailController'
        }).
        when('/NotificationUndelivered/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/NotificationUndelivered.html',
            controller: 'EmailUndeliveredController'
        }).
        when('/NotificationHistory/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/NotificationHistory.html',
            controller: 'EmailHistoryController'
        }).

        when('/ChangePassword/:Id', {
            templateUrl: baseUrl + 'Login/Views/Changepasswordpopup.html',
            controller: 'PasswordController'
        }).
         when('/AllergyMaster', {
             templateUrl: baseUrl + 'Masters/Views/AllergyMasterlist.html',
             controller: 'AllergyMasterList'
         }).
        when('/DirectCall/:CallSessionId', {
            templateUrl: baseUrl + 'User/Views/DirectCall.html',
            controller: 'DirectCallController'
        }).
        when('/DirectVideoCall/:CallSessionId', {
            templateUrl: baseUrl + 'User/Views/DirectVideoCall.html',
            controller: 'DirectVideoCallController'
        }).
        when('/Hive', {
            templateUrl: baseUrl + 'Masters/Views/Myhome.html',
            controller: 'MyHomeController'
        }). 
        when('/DeviceList', {
            templateUrl: baseUrl + 'Masters/Views/DeviceList.html',
            controller: 'MyHomeController'
        }).
        when('/HiveChart', {
            templateUrl: baseUrl + 'Masters/Views/MyhomeChart.html',
            controller: 'MyHomeController'
        }).
        when('/DeviceListChart', {
            templateUrl: baseUrl + 'Masters/Views/DeviceListChart.html',
            controller: 'MyHomeController'
        }).
        when('/Admin_Userslog_List', {
            templateUrl: baseUrl + 'Admin/Views/HospitalAdmin_Userslog.html',
            controller: 'UsersLogController'
        }).
        when('/DoctorAppointmentDetails', {
            templateUrl: baseUrl + 'Masters/Views/DoctorAppointmentDetails_For_Others.html',
            controller: 'DoctorAppointmentDetailsForOthersController'
        }).
        when('/AppointmentApproval', {
            templateUrl: baseUrl + 'Masters/Views/AppointmentApproval.html',
            controller: 'AppointmentApprovalController'
        }).
    otherwise({
        redirectTo: '/Googlehome'
    });

}])
.factory('authInterceptorService', ['$q', '$location', '$window', function ($q, $location, $window) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {
        config.headers = config.headers || {};

        //var authData = localStorageService.get('authorizationData');
        var token = '';
        token = $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='];
        if (token !== '') {
            config.headers.Authorization = 'Bearer ' + token;//authData.token;
        }
        return config;
    };

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            //$location.path('/login');
            var UserId = $window.localStorage['UserId'];
            var SessionId = $window.localStorage['Login_Session_Id'];
            $.get(baseUrl + "/api/Login/User_Logout?UserId=" + UserId + "&Login_Session_Id=" + SessionId, function (data, Status) {
                console.log(data);
                //if (data["Status"]) {    
                //}
            });
            $window.location.href = baseUrl + "/Home/LoginIndex#/";
        }
        return $q.reject(rejection);
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
    $(document).ready(function () {
        User_id = window.localStorage['UserTypeId'];

        $('#logout').on('click', function () {
            sessionStorage.clear();
        });
        $('#logoutalldevice').on('click', function () {
            sessionStorage.clear();
        });

    });
    $(document).click(function (e) { //Here is when you click in your entire document
        if ($(e.target).closest('.jinglebelllow').length == 0) { // If click is not paragraph
            $('.jinglebelllow').removeClass('active');
            $('.jinglebelllow i').removeClass('fas fa-bell myhighBell');
            $('.jinglebelllow i').addClass('fa fa-bell-o myhighBell'); //It removes this class existed from any paragraph
        }
        if ($(e.target).closest('.jinglebellmedium').length == 0) { // If click is not paragraph
            $('.jinglebellmedium').removeClass('active');
            $('.jinglebellmedium i').removeClass('fas fa-bell mymediumBell');
            $('.jinglebellmedium i').addClass('fa fa-bell-o mymediumBell'); //It removes this class existed from any paragraph
        }
        if ($(e.target).closest('.jinglebellhigh').length == 0) { // If click is not paragraph
            $('.jinglebellhigh').removeClass('active');
            $('.jinglebellhigh i').removeClass('fas fa-bell mylowBell');
            $('.jinglebellhigh i').addClass('fa fa-bell-o mylowBell'); //It removes this class existed from any paragraph
        }
    })

    return authInterceptorServiceFactory;
}])
.run(['$rootScope', 'Idle', '$window', function ($rootScope, Idle, $window) {
    $rootScope.$on('$locationChangeSuccess', function (e, newLocation, oldLocation) {
        if (oldLocation.includes("PatientVitals")) {
            // alert("Yes");
            $('#User_id').hide();
            $('#patient_profile').hide();
            $('#chronic').hide();
        }
        $('#divPatientType').attr('style', 'display : none');
        $rootScope.previousPage = oldLocation;
        // to handle back button after logout
        if ($window.localStorage['UserId'] === "0")
        {
            $window.location.href = baseUrl + "/Home/LoginIndex#/";
        }          
    });
    var uid = window.localStorage['UserTypeId'];
    if (uid != "1") {
        $rootScope.$on('IdleStart', function () {
            console.log('IdleStart');
            var interval;
            var timeLeft = 60;
            Swal.fire({
                position: 'top',
                title: '<h6 class="text-lg" style="color: var(--bg-green);">Your session is about to expire due to inactivity</h6>',
                html: 'MyCortex will logout in <b>60</b> seconds.',
                timer: timeLeft * 1000,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: 'Logout',
                confirmButtonColor: '#d33',
                confirmButtonClass: 'btn bg-green rounded text-white text-sm  px-3 py-1 mx-1',
                cancelButtonClass: 'btn bg-green rounded text-white text-sm px-3 py-1 mx-1',
                cancelButtonColor: '#008000',
                cancelButtonText: 'Stay',
                focusCancel: true,
                allowOutsideClick: false,
                didOpen: () => {
                    interval = setInterval(() => {
                        if (timeLeft > 0) {
                            timeLeft--;
                        } else {
                            timeLeft = 60;
                        }
                        const content = swal.getContent();
                        if (content) {
                            const b = content.querySelector('b');
                            if (b) {
                                b.textContent = timeLeft.toString();
                            }
                        }
                    }, 1000);
                },
                willClose: () => {
                    timeLeft = 60;
                    clearInterval(interval);
                }
            }).then((result) => {
                if (result.value) {
                    $window.localStorage['inactivity_logout'] = 1;
                    var UserId = $window.localStorage['UserId'];
                    var SessionId = $window.localStorage['Login_Session_Id'];
                    $.get(baseUrl + "/api/Login/User_Logout?UserId=" + UserId + "&Login_Session_Id=" + SessionId, function (data, Status) {
                        console.log(data);
                        //if (data["Status"]) {
                        //}
                    });
                    clearFirebaseToken();
                    $window.location.href = baseUrl + "/Home/LoginIndex#/";
                } else {
                    if (result.dismiss) {
                        if (result.dismiss === swal.DismissReason.timer) {
                            $window.localStorage['inactivity_logout'] = 1;
                            var UserId = $window.localStorage['UserId'];
                            var SessionId = $window.localStorage['Login_Session_Id'];
                            $.get(baseUrl + "/api/Login/User_Logout?UserId=" + UserId + "&Login_Session_Id=" + SessionId, function (data, Status) {
                                console.log(data);
                                //if (data["Status"]) {;
                                //}
                            });
                            clearFirebaseToken();
                            $window.location.href = baseUrl + "/Home/LoginIndex#/";
                        } else {
                            timeLeft = 60;
                            clearInterval(interval);
                            Idle.resetTimer();
                            //IdleProvider.resetTimer();
                        }
                    }
                }
            });
            // the user appears to have gone idle
        });
        $rootScope.$on('IdleTimeout', function () {
            //console.log('IdleTimeout');


            //$window.location.href = baseUrl + "/Home/LoginIndex#/";
            // the user has timed out, let log them out
        });
        $rootScope.$on('IdleEnd', function () {
            //console.log('IdleEnd');
            // the user has come back from AFK and is doing stuff
        });
    }
}]);

function clearFirebaseToken() {
    var msgSenderId = window.localStorage.getItem('fcmsgid');
    if (msgSenderId != null) {
        firebase.messaging().deleteToken(msgSenderId, 'FCM').then(function () { console.log('succ') }).catch(function () { console.log('err') });
        window.localStorage.removeItem('fcmsgid');
    }
}

EmpApp.config(function ($httpProvider) {
    //console.log('authInterceptorService')
    $httpProvider.interceptors.push('authInterceptorService');
});

//EmpApp.service('modulelistService', function () {

//    this.moduleExists = false;

//    var getDetails = function (insId, moduleId) {

//        $.get(baseUrl + "/api/CommonMenu/CommonModule_List?InsId=" + insId, function (data) {
//            if (data.length != 0) {
//                this.moduleExists = true;
//            }
//            else {
//                this.moduleExists = false;
//            }
//        });

//        return this.moduleExists;
//    };

//    var setDetails = function (param) {
//        this.moduleExists = param;
//    };

//    return {
//        getDetails: getDetails,
//        setDetails: setDetails,
//    };
//});

