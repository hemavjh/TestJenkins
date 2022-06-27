var PatientAppointmentList = angular.module("PatientAppointmentListController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

PatientAppointmentList.controller("PatientAppointmentListController", ['$scope', '$sce', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$interval',
    function ($scope, $sce, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $interval) {
        $scope.UpComingAppointmentDetails = [];
        $scope.PreviousAppointmentDetails = [];
        $scope.UpComingWaitingAppointmentDetails = [];
        $scope.UpComingAppointmentCount = 0;
        $scope.PreviousAppointmentCount = 0;
        $scope.UpComingWaitingAppointmentCount = 0;
        $scope.paymentHistory = [];
        $scope.calcNewYear;
        $scope.isvideo = false;
        $scope.islivebox = "";
        $http.get(baseUrl + '/api/CommonMenu/CommonTelephone_List?InstitutionId=' + $window.localStorage['InstitutionId']).success(function (response) {
            if (response != null) {
                if (response.length > 0) {
                    $scope.islivebox = $filter('filter')(response, { ID: '2' })[0];
                    angular.forEach(response, function (item, index) {
                        $scope.Name = item.NAME;
                        if ($scope.Name == 'LiveBox') {
                            $('#MyvideoDisable').attr("disabled", true);
                            $scope.isvideo = true;
                        }
                        else {
                            $('#MyvideoDisable').attr("disabled", false);
                        }
                    })
                }
            }
        });

        intial_loading();
        function intial_loading() {
            //get the browser timezone.
            //$scope.getTimeZone = new Date().getTimezoneOffset(); //Intl.DateTimeFormat().resolvedOptions().timeZone; 
            
            patientAppointmentList();
            getPreviousAppointmentList();
            //if ($scope.$parent.userTypeId == 5) {
            //    CG_PatientAppointment_List();
            //}
        }
        $scope.Patient_PerPage = 0;
        $scope.Patient_PerPage_past = 0;
        //$scope.PageStart = 0;
        //$scope.PageEnd = 0;
        $scope.NextPage = function (id,id1) {
            //angular.element(myElement).hasClass('my-class');
            var element1 = angular.element(document.querySelector('#' + id));
            var element = angular.element(document.querySelector('#' + id1));
            if (element1.hasClass('active') == true) {
                var scr = element.scrollTop()
                var height = element[0].scrollHeight;
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                //$scope.UserTypeId = $window.localStorage['UserTypeId'];

                //console.log(Math.round(element.scrollTop() + element[0].offsetHeight))
                //console.log(element[0].scrollHeight)
                if (Math.round(element.scrollTop() + element[0].offsetHeight) == element[0].scrollHeight) {
                    if ($scope.Patient_PerPage == 0) {
                        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                            $scope.Patient_PerPage = data1[0].ConfigValue;
                            //alert($scope.Patient_PerPage)
                            $scope.PageStart = 0
                            $scope.PageEnd = $scope.Patient_PerPage
                            $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                                $scope.UpComingAppointmentDetails = [];
                                $scope.UpComingAppointmentDetails = data.PatientAppointmentList;
                                compareAppointmentDates();
                            });
                            //$scope.Input_Type = 1;
                            //$scope.SearchEncryptedQuery = $scope.searchquery;
                        });
                    }
                    else {
                        //var li = parseInt($scope.PageEnd)



                        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                            //$scope.Patient_PerPage = data1[0].ConfigValue;
                            //alert($scope.Patient_PerPage)
                            $scope.PageStart = parseInt($scope.UpComingAppointmentDetails.length) + 1
                            $scope.PageEnd = parseInt($scope.UpComingAppointmentDetails.length) + parseInt(data1[0].ConfigValue)
                            //if ($scope.UpComingAppointmentDetails.length < parseInt($scope.PageEnd)) {
                            $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                                //$scope.UpComingAppointmentDetails = [];
                                Array.prototype.push.apply($scope.UpComingAppointmentDetails, data.PatientAppointmentList);
                                //$scope.UpComingAppointmentDetails.push(data.PatientAppointmentList);
                                compareAppointmentDates();                            

                            });
                            //}
                            //$scope.Input_Type = 1;
                            //$scope.SearchEncryptedQuery = $scope.searchquery;
                        });
                    }


                }
                //$http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                //    $scope.Patient_PerPage = data1[0].ConfigValue;
                //    alert($scope.Patient_PerPage)
                //    //$scope.PageStart = ((PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                //    //$scope.PageEnd = PageNumber * $scope.Patient_PerPage;
                //    //$scope.Input_Type = 1;
                //    //$scope.SearchEncryptedQuery = $scope.searchquery;
                //});
                //alert('ji')
                //if ($scope.CurrentPage < $scope.TotalPage) {
                //    $scope.CurrentPage += 1;
                //    GetEmployeeData($scope.CurrentPage);
                //}
            }
            else {
                var scr = element.scrollTop()
                var height = element[0].scrollHeight;
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                if (Math.round(element.scrollTop() + element[0].offsetHeight) == element[0].scrollHeight) {
                    if ($scope.Patient_PerPage_past == 0) {
                        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                            $scope.Patient_PerPage_past = data1[0].ConfigValue;
                            //alert($scope.Patient_PerPage)
                            $scope.PageStart = 0
                            $scope.PageEnd = $scope.Patient_PerPage_past
                            $http.get(baseUrl + '/api/User/PatientPreviousAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                                $scope.PreviousAppointmentDetails = [];
                                $scope.PreviousAppointmentDetails = data.PatientAppointmentList;
                                if (data.PatientAppointmentList != null && data.PatientAppointmentList != undefined) {
                                    $scope.PreviousAppointmentCount = $scope.PreviousAppointmentDetails.length;
                                }
                            });
                            
                       
                        });
                    }
                    else {
                        //var li = parseInt($scope.PageEnd)



                        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                            //$scope.Patient_PerPage = data1[0].ConfigValue;
                            //alert($scope.Patient_PerPage)
                            $scope.PageStart = parseInt($scope.PreviousAppointmentDetails.length) + 1
                            $scope.PageEnd = parseInt($scope.PreviousAppointmentDetails.length) + parseInt(data1[0].ConfigValue)
                            //if ($scope.UpComingAppointmentDetails.length < parseInt($scope.PageEnd)) {
                            $http.get(baseUrl + '/api/User/PatientPreviousAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                                Array.prototype.push.apply($scope.PreviousAppointmentDetails, data.PatientAppointmentList);
                                //$scope.PreviousAppointmentDetails = data.PatientAppointmentList;
                                if (data.PatientAppointmentList != null && data.PatientAppointmentList != undefined) {
                                    $scope.PreviousAppointmentCount = $scope.PreviousAppointmentDetails.length;
                                }
                            });
                            
                        });
                    }


                }
            }

        }
        function patientAppointmentList() {
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.Patient_PerPage = data1[0].ConfigValue;
                //alert($scope.Patient_PerPage)
                $scope.PageStart = 0
                $scope.PageEnd = $scope.Patient_PerPage
                //$scope.Input_Type = 1;
                //$scope.SearchEncryptedQuery = $scope.searchquery;                

                // get the appointment payment status from subscription settings
                $http.get(baseUrl + '/api/User/UserDetails_View?Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.AppointmoduleID = data.Appointment_Module_Id;
                });

                $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    $scope.UpComingAppointmentDetails = [];
                    $scope.UpComingAppointmentDetails = data.PatientAppointmentList;
                    compareAppointmentDates();
                });
            });
        }
      
        function compareAppointmentDates() {
            $scope.calcNewYear = setInterval(checkdates(), 1000);
        }
        $scope.show_payment_history = function (Row) {
            //$scope.paymentHistory = [];
            //$("#payment_waveLoader").show();
            //angular.element('#appointment_payment_history').modal('show');
            //document.getElementsByClassName('modal-backdrop')[0].className = "";
            //$http.get(baseUrl + '/api/PatientAppointments/AppointmentPaymentHistory/?appointmentId=' + Row.Id + '&Login_Session_Id=' + $scope.LoginSessionId + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data1) {
            //    $scope.paymentHistory = data1;
            //    $("#payment_waveLoader").hide();
            //}).error(function (data) { console.log(data); $("#payment_waveLoader").hide(); });
            localStorage.setItem('rowId', Row.Id);
            $rootScope.$emit("show_payment_history", {id: Row.Id});
        }
        function checkdates() {
            var AppoinList = $scope.UpComingAppointmentDetails;
            for (i = 0; i < AppoinList.length; i++) {
                var startdate1 = moment(new Date($scope.UpComingAppointmentDetails[i].Appointment_FromTime+'Z'));
                var enddate1 = moment(new Date());
                var diff1 = Math.abs(enddate1 - startdate1);
                //var days1 = Math.floor(diff1 / (60 * 60 * 24 * 1000));
                //var hours1 = Math.floor(diff1 / (60 * 60 * 1000)) - (days1 * 24);
                //var minutes1 = Math.floor(diff1 / (60 * 1000)) - ((days1 * 24 * 60) + (hours1 * 60));
                //var seconds1 = Math.floor(diff1 / 1000) - ((days1 * 24 * 60 * 60) + (hours1 * 60 * 60) + (minutes1 * 60));
                var CallRemain1 = Math.floor(diff1 / (60 * 1000));
                $scope.CallButton1 = CallRemain1;
                var date_future = (new Date($scope.UpComingAppointmentDetails[i].Appointment_FromTime+'Z'));
               
                var date_now = (new Date());

                var seconds = Math.floor((date_future - (date_now)) / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {

                }
                hours = hours - (days * 24);
                minutes = minutes - (days * 24 * 60) - (hours * 60);
                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                var timeDiffString1 = "";
                if (days != 0) {
                    timeDiffString1 = timeDiffString1 + days + ' day ';
                }
                if (hours != 0) {
                    timeDiffString1 = timeDiffString1 + hours + ' hr ';
                }
                if (minutes != 0) {
                    timeDiffString1 = timeDiffString1 + minutes + ' min ';
                }
                if (seconds != 0) {
                    timeDiffString1 = timeDiffString1 + seconds + ' sec';
                }
                AppoinList[i].TimeDifference = timeDiffString1;
                AppoinList[i]['RemainingTimeInMinutes'] = CallRemain1;
            }
            if ($scope.UpComingAppointmentDetails != null) {
                $scope.UpComingAppointmentCount = $scope.UpComingAppointmentDetails.length;
            }
            $scope.UpComingAppointmentDetails = AppoinList;
            //$scope.$apply();
        }
        function CG_PatientAppointment_List() {
            $http.get(baseUrl + '/api/User/CG_PatientAppointmentList/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId + '&UserId=' + $window.localStorage['UserId']).success(function (data) {
                $scope.UpComingWaitingAppointmentDetails = data.PatientAppointmentList;
                if ($scope.UpComingWaitingAppointmentDetails != null) {
                    $scope.UpComingWaitingAppointmentCount = $scope.UpComingWaitingAppointmentDetails.length;
                }
            });
        }
        function getPreviousAppointmentList() {
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.Patient_PerPage_past = data1[0].ConfigValue;
                //alert($scope.Patient_PerPage)
                $scope.PageStart = 0
                $scope.PageEnd = $scope.Patient_PerPage_past
                $http.get(baseUrl + '/api/User/PatientPreviousAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    $scope.PreviousAppointmentDetails = data.PatientAppointmentList;
                    if (data.PatientAppointmentList != null && data.PatientAppointmentList != undefined) {
                        $scope.PreviousAppointmentCount = $scope.PreviousAppointmentDetails.length;
                    }
                });
            });
        }
        $scope.$on("appointment_list", intial_loading);

        $scope.openvideocall = function (patientName, ConferenceId) {
           // if (typeof ($scope.islivebox) != 'undefined' && $scope.islivebox != "") {
                var emp = JSON.parse(JSON.parse(window.localStorage["18792f60bb2dbf1:common_store/user"]));
                patientName = emp.name;
                $('#Patient_AppointmentPanel').addClass('hidden');
                $('#Patient_VideoCall').addClass('show');
                var IsAdmin = false;
                if ($window.localStorage["UserTypeId"] == 2) {
                    IsAdmin = false;
                }
                else if ($window.localStorage["UserTypeId"] != 2) {
                    IsAdmin = true;
                }
                var tag = $sce.trustAsHtml('<iframe allow="camera; microphone; display-capture" scrolling="" src = "https://demoserver.livebox.co.in:3030/?conferencename=' + ConferenceId + '&isadmin=' + IsAdmin + '&displayname=' + patientName + '" width = "600" height = "600" allowfullscreen = "" webkitallowfullscreen = "" mozallowfullscreen = "" oallowfullscreen = "" msallowfullscreen = "" ></iframe >');
                document.getElementById('Patient_VideoCall').innerHTML = tag;
           // }
            //else {
            //    toastr.warning("You Haven't Subscribed For This Livebox. Please Contact Your Administrator", "warning");
            //}
        }
    }
]);

PatientAppointmentList.directive('infinityscroll', function () {
    //alert("hi")
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('scroll', function () {
                //if ((element[0].scrollTop + element[0].offsetHeight) == element[0].scrollHeight) {
                    //scroll reach to end
                    scope.$apply(attrs.infinityscroll)
                    //alert("hi")
                //}
            });
        }
    }
});