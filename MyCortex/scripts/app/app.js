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
    'RecordController',
    "AppointmentApprovalController",
    'EligibilityLogsController'
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
//EmpApp.controller('homeController', function ($scope, $route) {
//});
//EmpApp.controller('UserController', function ($scope, $route) {
//    var p = $route.current.params;
//    $scope.path = decodeURIComponent(p.p1);
//});
EmpApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    var baseUrl = $("base").first().attr("href");

    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);
    //console.log(baseUrl);
    $routeProvider.
        //when('/', {
        //    templateUrl: baseUrl + 'Home/Views/HomePage.html',
        //    controller: 'homeController'
        //}).
        when('/Home/Index/login', {
            templateUrl: baseUrl + 'Login/Views/Login.html',
            controller: 'LoginController'
        }).
        when('/Home/Index/signup/:InstitutionCode', {
            templateUrl: baseUrl + 'Login/Views/Signup.html',
            controller: 'SignupController'
        }).
        when('/Home/Index/home', {
            templateUrl: '/Home/Views/HomePage.html',
            controller: 'homeController'
        }).
        when('/Home/Index/Googlehome', {
            templateUrl: baseUrl + 'Home/Views/HomePage.html',
            controller: 'GooglehomeController'
        }).
        when('/Home/Index/Institution', {
            templateUrl: '/Admin/Views/Institutionlist.html',
            controller: 'InstitutionController', reloadOnSearch: false
        }).
        when('/Home/Index/Institution_Subscription', {
            templateUrl: baseUrl + 'Admin/Views/InstitutionSubscriptionlist.html',
            controller: 'InstitutionSubscriptionController', reloadOnSearch: false
        }).
        when('/Home/Index/Device', {
            templateUrl: baseUrl + 'Admin/Views/DeviceNameAdminList.html',
            controller: 'MyHomeController'
        }).
        when('/Home/Index/SuperAdmin_UserList/:LoginUserType', {
            templateUrl: baseUrl + 'User/Views/SuperAdmin_Userlist.html',
            controller: 'UserController', reloadOnSearch: false
        }).
        when('/Home/Index/Admin_UserList/:LoginUserType', {
            templateUrl: baseUrl + 'User/Views/SuperAdmin_Userlist.html',
            controller: 'UserController'
        }).
        when('/Home/Index/HospitalAdmin_UserList/:LoginUserType', {
            templateUrl: baseUrl + 'User/Views/HospitalAdmin_Userlist.html',
            controller: 'UserController'
        }).
        when('/Home/Index/InstitutionHospitalAdmin_view', {
            templateUrl: baseUrl + 'Admin/Views/InstitutionView.html',
            controller: 'InstitutionHospitalAdminController'
        }).

        when('/Home/Index/EditInstitutionHospitalAdmin', {
            templateUrl: baseUrl + 'Admin/Views/InstitutionDetails.html',
            controller: 'InstitutionHospitalAdminController'
        }).

        when('/Home/Index/InstitutionSubscriptionHospitalAdmin_view', {
            templateUrl: baseUrl + 'Admin/Views/InstitutionSubscriptionView.html',
            controller: 'InstitutionSubscriptionHospitalAdminController'
        }).
        when('/Home/Index/PatientList/:LoginUserType', {
            templateUrl: baseUrl + 'User/Views/Patientlist.html',
            controller: 'UserController'
        }).
        when('/Home/Index/PatientCreate/:PageParameter/:LoginUserType', {
            templateUrl: baseUrl + 'User/Views/PatientCreate.html',
            controller: 'UserController'
        }).
        when('/Home/Index/PatientView/:Id/:PageParameter/:LoginUserType', {
            templateUrl: baseUrl + 'User/Views/PatientView.html',
            controller: 'UserController'
        }).
        when('/Home/Index/PatientEdit/:Id/:PageParameter/:LoginUserType/:Editpatient', {
            templateUrl: baseUrl + 'User/Views/PatientCreate.html',
            controller: 'UserController'
        }).
        when('/Home/Index/PatientVitals/:Id/:PageParameter', {
            templateUrl: baseUrl + 'User/Views/PatientVitals.html',
            controller: 'UserHealthDataDetailsController'
        }).

        when('/Home/Index/Thirtydays_appointments', {
            templateUrl: baseUrl + 'User/Views/ThirtydaysAppointments.html',
            controller: 'PatientAppointmentController'
        }).
        when('/Home/Index/TodaysAppoint_ments', {
            templateUrl: baseUrl + 'User/Views/TodayAppointments.html',
            controller: 'PatientAppointmentController'
        }).

        when('/Home/Index/UnderConstruction', {
            templateUrl: baseUrl + 'UnderConstruction.html',
            controller: 'UnderConstructionController'
        }).
        when('/Home/Index/PatientAppointments', {
            templateUrl: baseUrl + 'User/Views/AllPatientList.html',
            controller: 'AllPatientListController'
        }).
        when('/Home/Index/ParameterSettings', {
            templateUrl: baseUrl + 'Masters/Views/ParameterSettings.html',
            controller: 'ParameterSettingsController'
        }).
        when('/Home/Index/CarecoordinatorCompliance/:PageParameter', {
            templateUrl: baseUrl + 'User/Views/CareCoordinator_Compliance.html',
            controller: 'CareCoordinatorController'
        }).
        when('/Home/Index/Carecoordinator/:PageParameter', {
            templateUrl: baseUrl + 'User/Views/CareCoordinator.html',
            controller: 'CareCoordinatorController'
        }).
        when('/Home/Index/CareGiverAssignedPatients', {
            templateUrl: baseUrl + 'User/Views/CareGiverAssignedPatients.html',
            controller: 'CareGiverAssignedPatientsController'
        }).
        when('/Home/Index/ChatSetting/:Id', {
            templateUrl: baseUrl + 'Masters/Views/ChatSettings.html',
            controller: 'ChatSettingsController'
        }).
        when('/Home/Index/EditChatSettings/:Id', {
            templateUrl: baseUrl + 'Masters/Views/ChatSettings.html',
            controller: 'ChatSettingsController'
        }).

        when('/Home/Index/ChatSetting/:Id', {
            templateUrl: baseUrl + 'Masters/Views/ChatSettings.html',
            controller: 'ChatSettingsController'
        }).
        when('/Home/Index/MonitoringProtocolList', {
            templateUrl: baseUrl + 'Admin/Views/MonitoringProtocolList.html',
            controller: 'MonitoringProtocolController'
        }).
        //when('/ChangePassword', {
        //    templateUrl: baseUrl + 'Admin/Views/ChangePassword.html',
        //    controller: 'PasswordController'
        //}).
        when('/Home/Index/ResetPassword', {
            templateUrl: baseUrl + 'Admin/Views/ResetPassword.html',
            controller: 'PasswordController'
        }).
        when('/Home/Index/SuperAdminResetPassword', {
            templateUrl: baseUrl + 'Admin/Views/SuperAdminResetPassword.html',
            controller: 'PasswordController'
        }).
        when('/Home/Index/PatientApproval', {
            templateUrl: baseUrl + 'User/Views/PatientApproval.html',
            controller: 'PatientApprovalController'
        }).
        when('/Home/Index/ICD10Master', {
            templateUrl: baseUrl + 'Masters/Views/MasterICDlist.html',
            controller: 'ICD10Controller'
        }).
        when('/Home/Index/Payor', {
            templateUrl: baseUrl + 'Masters/Views/Payor.html',
            controller: 'PayorMasterController'
        }).
        when('/Home/Index/Plan', {
            templateUrl: baseUrl + 'Masters/Views/PlanMaster.html',
            controller: 'PlanMasterController'
        }).
        when('/Home/Index/DrugDBMaster', {
            templateUrl: baseUrl + 'Masters/Views/DrugDBlist.html',
            controller: 'DrugDBController'
        }).
        when('/Home/Index/EmailTemplate/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/Templatelist.html',
            controller: 'EmailTemplateController'
        }).
        when('/Home/Index/MessagingSend/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/Messaging.html',
            controller: 'SendEmailController'
        }).
        when('/Home/Index/MessagingHistory/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/MessagingHistory.html',
            controller: 'EmailHistoryController'
        }).
        when('/Home/Index/EncryptDecryptlist', {
            templateUrl: baseUrl + 'Admin/Views/EncryptDecrypt.html',
            controller: 'CommonController'
        }).
        when('/Home/Index/SMSTemplate/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/TemplatelistSMS.html',
            controller: 'EmailTemplateController'
        }).
        when('/Home/Index/SMSSend/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/SMSMessaging.html',
            controller: 'SendEmailController'
        }).
        when('/Home/Index/SMSUndeliver/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/SMSUndelivered.html',
            controller: 'EmailUndeliveredController'
        }).
        when('/Home/Index/SMSHistory/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/SMSHistory.html',
            controller: 'EmailHistoryController'
        }).
        when('/Home/Index/NotificationView', {
            templateUrl: baseUrl + 'Template/Views/NotificationView.html',
            controller: 'NotificationViewController'
        }).
        when('/Home/Index/AuditReport', {
            templateUrl: baseUrl + 'Report/Views/AuditReportList.html',
            controller: 'PatientReportListController'
        }).
        when('/Home/Index/AppointmentSlot', {
            templateUrl: baseUrl + 'User/Views/AppointmentSlot.html',
            controller: 'AppointmentSlotController'
        }).
        when('/Home/Index/SlotTiming', {
            templateUrl: baseUrl + 'Masters/Views/SlotTiming.html',
            controller: 'SlotTimingController'
        }).
        when('/Home/Index/DoctorShift', {
            templateUrl: baseUrl + 'Masters/Views/DoctorShift.html',
            controller: 'DoctorShiftController'
        }).
        when('/Home/Index/DoctorHoliday', {
            templateUrl: baseUrl + 'Masters/Views/AttendanceDetails.html',
            controller: 'AttendanceDetailsController'
        }).
        when('/Home/Index/MyAppointmentSetting', {
            templateUrl: baseUrl + 'Masters/Views/MyAppointmentSetting.html',
            controller: 'DoctorShiftController'
        }).
        when('/Home/Index/WebConfiguration', {
            templateUrl: baseUrl + 'Masters/Views/WebConfiguration.html',
            controller: 'WebConfigurationController'
        }).
        when('/Home/Index/LanguageSettings', {
            templateUrl: baseUrl + 'Masters/Views/LanguageSettings.html',
            controller: 'LanguageSettingsController'
        }).
        when('/Home/Index/GateWaySettings', {
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

        when('/Home/Index/Password_Policy', {
            templateUrl: baseUrl + 'Masters/Views/PasswordPolicy.html',
            controller: 'PasswordController'
        }).
        when('/Home/Index/EditPasswordPolicy', {
            templateUrl: baseUrl + 'Masters/Views/PasswordPolicy.html',
            controller: 'PasswordController'
        }).
        when('/Home/Index/MasterEmailConfigurationList', {
            templateUrl: baseUrl + 'Masters/Views/EmailConfiguration.html',
            controller: 'EmailConfigurationController'
        }).
        when('/Home/Index/MasterSmsConfigurationList', {
            templateUrl: baseUrl + 'Masters/Views/SMSConfiguration.html',
            controller: 'SMSConfigurationController'
        }).
        when('/Home/Index/AdminEmailConfigurationList/:LoginUserType', {
            templateUrl: baseUrl + 'Masters/Views/EmailConfiguration.html',
            controller: 'EmailConfigurationController'
        }).
        //when('/AdminEmailConfigurationList/:LoginUserType', {
        //    templateUrl: baseUrl + 'Masters/Views/AdminEmailConfiguration.html',
        //    controller: 'EmailConfigurationController'
        //}).
        when('/Home/Index/MasterAlertConfigurationList', {
            templateUrl: baseUrl + 'Template/Views/AlertConfiguration.html',
            controller: 'EmailAlertlistController'
        }).
        //when('/ParameterSetting', {
        //    templateUrl: baseUrl + 'Admin/Views/ParameterSettings.html',
        //    controller: 'UserController'
        //}).
        when('/Home/Index/Messaging', {
            templateUrl: baseUrl + 'Admin/Views/MessagingCreate.html',
            controller: 'UserController'
        }).
        when('/Home/Index/MessagingUndelivered/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/MessagingUndelivered.html',
            controller: 'EmailUndeliveredController'
        }).
        //when('/MessagingHistory', {
        //    templateUrl: baseUrl + 'Admin/Views/MessagingHistory.html',
        //    controller: 'UserController'
        //}).
        when('/Home/Index/Notification/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/Notification.html',
            controller: 'EmailTemplateController'
        }).
        when('/Home/Index/NotificationSend/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/NotificationSend.html',
            controller: 'SendEmailController'
        }).
        when('/Home/Index/NotificationUndelivered/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/NotificationUndelivered.html',
            controller: 'EmailUndeliveredController'
        }).
        when('/Home/Index/NotificationHistory/:PageParameter', {
            templateUrl: baseUrl + 'Template/Views/NotificationHistory.html',
            controller: 'EmailHistoryController'
        }).

        when('/Home/Index/ChangePassword/:Id', {
            templateUrl: baseUrl + 'Login/Views/Changepasswordpopup.html',
            controller: 'PasswordController'
        }).
        when('/Home/Index/AllergyMaster', {
            templateUrl: baseUrl + 'Masters/Views/AllergyMasterlist.html',
            controller: 'AllergyMasterList'
        }).
        when('/Home/Index/DirectCall/:CallSessionId', {
            templateUrl: baseUrl + 'User/Views/DirectCall.html',
            controller: 'DirectCallController'
        }).
        when('/Home/Index/DirectVideoCall/:CallSessionId', {
            templateUrl: baseUrl + 'User/Views/DirectVideoCall.html',
            controller: 'DirectVideoCallController'
        }).
        when('/Home/Index/Hive', {
            templateUrl: baseUrl + 'Masters/Views/Myhome.html',
            controller: 'MyHomeController'
        }).
        when('/Home/Index/DeviceList', {
            templateUrl: baseUrl + 'Masters/Views/DeviceList.html',
            controller: 'MyHomeController'
        }).
        when('/Home/Index/HiveChart', {
            templateUrl: baseUrl + 'Masters/Views/MyhomeChart.html',
            controller: 'MyHomeController'
        }).
        when('/Home/Index/Recording', {
            templateUrl: baseUrl + 'Masters/Views/Recording.html',
            controller: 'RecordController'
        }).
        when('/Home/Index/DeviceListChart', {
            templateUrl: baseUrl + 'Masters/Views/DeviceListChart.html',
            controller: 'MyHomeController'
        }).
        when('/Home/Index/Admin_Userslog_List', {
            templateUrl: baseUrl + 'Admin/Views/HospitalAdmin_Userslog.html',
            controller: 'UsersLogController'
        }).
        when('/Home/Index/Admin_Eligibility_Logs_List', {
            templateUrl: baseUrl + 'Admin/Views/HospitalAdmin_Eligibility_Logs.html',
            controller: 'EligibilityLogsController'
        }).
        when('/Home/Index/DoctorAppointmentDetails', {
            templateUrl: baseUrl + 'Masters/Views/DoctorAppointmentDetails_For_Others.html',
            controller: 'DoctorAppointmentDetailsForOthersController'
        }).
        when('/Home/Index/AppointmentApproval', {
            templateUrl: baseUrl + 'Masters/Views/AppointmentApproval.html',
            controller: 'AppointmentApprovalController'
        }).
        otherwise({
            //redirectTo: '/Googlehome'
            redirectTo: '/'
        });
      // $locationProvider.html5Mode(true);
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
            $window.location.href = baseUrl + "/Home/LoginIndex/";
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
            $window.location.href = baseUrl + "/Home/LoginIndex/";
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
                    $window.location.href = baseUrl + "/Home/LoginIndex/";
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
                            $window.location.href = baseUrl + "/Home/LoginIndex/";
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

EmpApp.run(['$sce', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$interval', 'toastr',
    function ($sce, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $interval, toastr) {
        //document.getElementById('timer').innerHTML = window.localStorage['timer'];
        countdown();
        function countdown() {
            let seconds = window.localStorage['timer'];;
            const timer = setInterval(function () {
                const minutesLeft = Math.floor(seconds / 60);
                let secondsLeft = seconds % 60;
                secondsLeft = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
                //console.log(`${minutesLeft}:${secondsLeft}`);
                if (seconds < 300) {
                    var tokendata = "grant_type=refresh_token" + "&refresh_token=" + $window.localStorage['RfhNcOpcvbERFHxx65+==0qs'] + "&client_id=" + window.localStorage['UserId'];
                    $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;
                        $window.localStorage['RfhNcOpcvbERFHxx65+==0qs'] = response.refresh_token;
                        $window.localStorage['timer'] = response.expires_in;
                        countdown();
                    })
                    clearInterval(timer);
                }
                seconds--;
                //console.log(seconds);
                $window.localStorage['timer'] = seconds;
            }, 1000);
        }
    }
]);
EmpApp.run([ '$sce', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$interval', 'toastr',
    function ( $sce, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $interval, toastr) {
    const swListener = new BroadcastChannel('swListener');
    swListener.onmessage = function (e) {
        console.log('swListener Received', e.data);
        var Title = e.data.notification.body;
        let Array = e.data.data;
        var conferencename = Object.values(Array)[1];
        Swal.fire({
            position: 'top',
            title: Title,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Accept',
            confirmButtonColor: '#008000',
            confirmButtonClass: 'btn bg- green rounded text - white text - sm px - 3 py - 1 mx - 1',
            cancelButtonClass: 'btn bg-green rounded text-white text-sm  px-3 py-1 mx-1',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Reject',
            focusCancel: true,
            allowOutsideClick: false,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                jQuery.get(baseUrl + '/api/Common/Hivemeet_popup/?ConferenceName=' + conferencename).done(function (data) {
                    const popuplist = data.PatientAppointmentList;
                    var PatId = popuplist[0].Patient_Id;
                    //window.location.href = baseUrl + "/Home/Index/PatientVitals/" + PatId + "/4";
                    $location.path = baseUrl + "/Home/Index/PatientVitals/" + PatId + "/4";
                    setTimeout(openvideocall_popup, 5000)
                    function openvideocall_popup() {
                        $('#Patient_AppointmentPanel').removeClass('show');
                        $('#Patient_AppointmentPanel').addClass('hidden');
                        $('#Patient_VideoCall').removeClass('hidden');
                        $('#Patient_VideoCall').addClass('show');
                        var IsAdmin = false;
                        var IsRecording = true;
                        //if ($scope.Recording == 1) {
                        //    var IsRecording = true;
                        //} else {
                        //    var IsRecording = false;
                        //}
                        if (window.localStorage["UserTypeId"] == 2) {
                            IsAdmin = false;
                            userId = window.localStorage["UserId"];
                        }
                        else if (window.localStorage["UserTypeId"] != 2) {
                            IsAdmin = true;
                            userId = window.localStorage["UserId"];
                        }
                        ConferenceId = conferencename;
                        patientName = window.localStorage["FullName"];
                        var tag = $sce.trustAsHtml('<iframe allow="camera; microphone; display-capture" scrolling="" src = "https://demoserver.livebox.co.in:3030/?conferencename=' + ConferenceId + '&isadmin=' + IsAdmin + '&displayname=' + patientName + '&userid=' + userId + '" width = "600" height = "600" allowfullscreen = "" webkitallowfullscreen = "" mozallowfullscreen = "" oallowfullscreen = "" msallowfullscreen = "" ></iframe >');
                        //var tag = $sce.trustAsHtml('<iframe allow="camera; microphone; display-capture" scrolling="" src = "https://meet.hive.clinic:3030/?conferencename=' + ConferenceId + '&isadmin=' + IsAdmin + '&displayname=' + patientName + '&userid=' + userId + '" width = "600" height = "600" allowfullscreen = "" webkitallowfullscreen = "" mozallowfullscreen = "" oallowfullscreen = "" msallowfullscreen = "" ></iframe >');
                        document.getElementById('Patient_VideoCall').innerHTML = tag;

                        /*Getting the Event */
                        //var GetEvent = io('https://demoserver.livebox.co.in:3030/', { transports: ['websocket'] });
                        var GetEvent = io('https://meet.hive.clinic:3030/', { transports: ['websocket'] });

                        /* Passing the Event */
                        GetEvent.on("endConferenceListenerData", function (conferenceData) {
                            /* dispatch the Event */
                            document.dispatchEvent(new CustomEvent("EndCallEvent", {
                                detail: { conferenceData }, bubbles: true, cancelable: true, composed: false
                            }, false));
                        });
                        /* addeventListener for EndcallEvent */
                        var EndcallEventClick = document;
                        EndcallEventClick.addEventListener("EndCallEvent", function (event) {
                            var ConferenceData = event.detail.conferenceData;
                            console.log("endCallEventPassed", ConferenceData);
                            iframeConfernecename = ConferenceId;
                            iframeUserId = userId;
                            if (iframeConfernecename == ConferenceData.conferencename) {
                                if (iframeUserId == ConferenceData.userid) {
                                    setTimeout(endTiming, 3000)
                                    function endTiming() {
                                        var tag = $sce.trustAsHtml('');
                                        document.getElementById('Patient_VideoCall').innerHTML = tag;
                                        $('#Patient_AppointmentPanel').removeClass('hidden');
                                        $('#Patient_AppointmentPanel').addClass('show');
                                        $('#Patient_VideoCall').removeClass('show');
                                        $('#Patient_VideoCall').addClass('hidden');
                                    }
                                }
                            }
                            else {
                                if (iframeUserId == ConferenceData.userid) {
                                    setTimeout(endTiming, 3000)
                                    function endTiming() {
                                        var tag = $sce.trustAsHtml('');
                                        document.getElementById('Patient_VideoCall').innerHTML = tag;
                                        $('#Patient_AppointmentPanel').removeClass('hidden');
                                        $('#Patient_AppointmentPanel').addClass('show');
                                        $('#Patient_VideoCall').removeClass('show');
                                        $('#Patient_VideoCall').addClass('hidden');
                                    }
                                }
                            }
                        });
                        //var tag = $sce.trustAsHtml('<iframe allow="camera; microphone; display-capture" scrolling="" src = "https://demoserver.livebox.co.in:3030/?conferencename=' + ConferenceId + '&isadmin=' + IsAdmin + '&displayname=' + patientName + '&recording=' + IsRecording + '&userid=' + userId + '" width = "600" height = "600" allowfullscreen = "" webkitallowfullscreen = "" mozallowfullscreen = "" oallowfullscreen = "" msallowfullscreen = "" ></iframe >');
                        var tag = $sce.trustAsHtml('<iframe allow="camera; microphone; display-capture" scrolling="" src = "https://meet.hive.clinic:3030/?conferencename=' + ConferenceId + '&isadmin=' + IsAdmin + '&displayname=' + patientName + '&recording=' + IsRecording + '&userid=' + userId + '" width = "600" height = "600" allowfullscreen = "" webkitallowfullscreen = "" mozallowfullscreen = "" oallowfullscreen = "" msallowfullscreen = "" ></iframe >');
                        document.getElementById('Patient_VideoCall').innerHTML = tag;
                    }
                });
            } else if (result.isDenied) {
                //Swal.fire('Changes are not saved', '', 'info')
            }
        })
    };
}
]);
