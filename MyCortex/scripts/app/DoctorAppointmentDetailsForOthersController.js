var DoctorAppointmentDetails = angular.module("DoctorAppointmentDetailsForOthersController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}
DoctorAppointmentDetails.controller("DoctorAppointmentDetailsForOthersController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $scope.DoctorList = [];
        $scope.emptydata = [];
        $scope.rowCollectionFilter = [];
        $scope.TimeZoneList = [];
        $scope.TimeZoneID = 0;
        $scope.SelectedDoctor = 0;
        $scope.flag = 0;
        var DatetimepickerdtToday = new Date();
        var Datetimepickermonth = DatetimepickerdtToday.getMonth() + 1;
        var Datetimepickerday = DatetimepickerdtToday.getDate();
        var Datetimepickeryear = DatetimepickerdtToday.getFullYear();
        if (Datetimepickermonth < 10)
            Datetimepickermonth = '0' + Datetimepickermonth.toString();
        if (Datetimepickerday < 10)
            Datetimepickerday = '0' + Datetimepickerday.toString();
        var DatetimepickermaxDate = Datetimepickeryear + '-' + Datetimepickermonth + '-' + Datetimepickerday;
        $scope.SearchDate = new Date(DatetimepickermaxDate);

        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        $http.get(baseUrl + '/api/AppoinmentSlot/Doctors_List/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.DoctorList = data;
            }
        });
        $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            $scope.TimeZoneList = data;
        });
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];

        $scope.DoctorAppointmentlist = function () {
            //$scope.SelectedDoctor_List = [];
            //angular.forEach($scope.SelectedDoctor, function (value, index) {
            //    $scope.SelectedDoctor_List.push(value);
            //});
            //console.log($scope.SelectedDoctor_List);
            //console.log($scope.SearchDate);
            //console.log($scope.TimeZoneID);
            if ($scope.TimeZoneID == 0) {
                toastr.warning("Please Select Timezone", "warning");
                return;
            }
            if ($scope.SelectedDoctor_List == 0 || $scope.SelectedDoctor_List == '') {
                toastr.warning("Please Select Doctor", "warning");
                return;
            }
            $("#chatLoaderPV").show();
            var datee = new Date($scope.SearchDate).getFullYear().toString() + '-' + (((new Date($scope.SearchDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchDate).getDate().toString().length > 1) ? new Date($scope.SearchDate).getDate().toString() : ('0' + new Date($scope.SearchDate).getDate().toString()))
            $http.get(baseUrl + '/api/PatientAppointments/GetDoctorAppointmentDetails/?DoctorId=' + $scope.SelectedDoctor + '&Date=' + datee + '&Login_Session_Id=' + $scope.LoginSessionId + '&TimeZoneId=' + $scope.TimeZoneID + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data1) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = data1.DoctorAppointmentTimeSlotList;
                if ($scope.DoctorAppointmentTimeSlotList.length == 0) {
                    $scope.flag = 1;
                } else {
                    $scope.flag = 0;
                }
            }).error(function (data) { $("#chatLoaderPV").hide(); });
        }

        //$scope.rembemberCurrentPage = function (p) {
        //    $scope.current_page = p
        //}

        $scope.CancelPatientShift = function (Id) {
            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
            $("#chatLoaderPV").show();
            var objectCancel = {
                "Id": Id,
                "CancelledBy_Id": $window.localStorage['UserId'],
                "Cancel_Remarks": "Test",
                "ReasonTypeId": "1",
                "SESSION_ID": $scope.LoginSessionId
            }
            Swal.fire({
                title: 'Confirm to cancel appointment',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, objectCancel).success(function (data) {
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        if (data.ReturnFlag == 1) {
                            $scope.DoctorAppointmentlist();
                        }
                    });
                } else if (result.isDenied) {
                }
            });
            $("#chatLoaderPV").hide();
        }
    }
]);
