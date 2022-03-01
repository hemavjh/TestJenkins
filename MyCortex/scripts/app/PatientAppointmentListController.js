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
        intial_loading();
        function intial_loading() {
            patientAppointmentList();
            getPreviousAppointmentList();
            if ($scope.$parent.userTypeId == 5) {
                CG_PatientAppointment_List();
            }
        }
        function patientAppointmentList() {
            $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.UpComingAppointmentDetails = [];
                $scope.UpComingAppointmentDetails = data.PatientAppointmentList;
                compareAppointmentDates();
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
                var startdate1 = moment(new Date($scope.UpComingAppointmentDetails[i].Appointment_FromTime));
                var enddate1 = moment(new Date());
                var diff1 = Math.abs(enddate1 - startdate1);
                //var days1 = Math.floor(diff1 / (60 * 60 * 24 * 1000));
                //var hours1 = Math.floor(diff1 / (60 * 60 * 1000)) - (days1 * 24);
                //var minutes1 = Math.floor(diff1 / (60 * 1000)) - ((days1 * 24 * 60) + (hours1 * 60));
                //var seconds1 = Math.floor(diff1 / 1000) - ((days1 * 24 * 60 * 60) + (hours1 * 60 * 60) + (minutes1 * 60));
                var CallRemain1 = Math.floor(diff1 / (60 * 1000));
                $scope.CallButton1 = CallRemain1;
                var date_future = new Date($scope.UpComingAppointmentDetails[i].Appointment_FromTime);
                var date_now = new Date();

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
            $http.get(baseUrl + '/api/User/PatientPreviousAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.PreviousAppointmentDetails = data.PatientAppointmentList;
                if (data.PatientAppointmentList != null && data.PatientAppointmentList != undefined) {
                    $scope.PreviousAppointmentCount = $scope.PreviousAppointmentDetails.length;
                }
            });
        }
        $scope.$on("appointment_list", intial_loading);
    }
]);