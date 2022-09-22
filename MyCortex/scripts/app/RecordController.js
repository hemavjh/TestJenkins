var Record = angular.module("RecordController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

Record.controller("RecordController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'InstSub', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, InstSub, toastr) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $scope.DoctorList = [];
        $scope.emptydata = [];
        $scope.rowCollectionFilter = [];
        //$scope.TimeZoneList = [];
        $scope.TimeZoneID = 0;
        $scope.DoctorId = 0;
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
        $scope.SearchEndDate = new Date(DatetimepickermaxDate);
        $scope.AppointmentReasonTypeList = [];
        $scope.ReasonTypeId = 0;
        $scope.Cancelled_Remarks = "";
        $scope.Appointment_Id = 0;
        //$scope.TimeZone_ID = 0;
        $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            $("#chatLoaderPV").show();
            if (data.TimeZone_ID != "") {
                $scope.TimeZone_ID = data.TimeZone_ID;
            } else {
                toastr.warning("Please Set Timezone for Institution", "warning");
            }
            $scope.getTimeZoneList();
        });
        
        $http.get(baseUrl + '/api/PatientAppointments/AppointmentReasonType_List/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.AppointmentReasonTypeListTemp = [];
            $scope.AppointmentReasonTypeListTemp = data;
            var obj = { "ReasonTypeId": 0, "ReasonType": "Select", "IsActive": 1 };
            $scope.AppointmentReasonTypeListTemp.splice(0, 0, obj);
            $scope.AppointmentReasonTypeList = angular.copy($scope.AppointmentReasonTypeListTemp);
        });
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        $scope.ConfigCode1 = "CURRENCY_FORMAT_TYPE";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode1 + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.CurrencyValue = data[0].ConfigValue;
            
        });
        $http.get(baseUrl + '/api/Attendance/Clinician_UserList/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.DoctorList = $ff(data, { IsActive: 1, TypeName: "Clinician" });;
           // $scope.DoctorList = data;
        });
        $scope.getTimeZoneList = function () {
            //$scope.TimeZoneList = [];
            $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.TimeZoneCopy = [];
                $scope.TimeZoneCopy = data;
                var obj = { "TimeZoneId": 0, "TimeZoneName": "", "UtcOffSet": "", "TimeZoneDisplayName": "Select", "IsActive": 1 };
                $scope.TimeZoneCopy.splice(0, 0, obj);
                angular.forEach($scope.TimeZoneCopy, function (value, index) {
                    $scope.TimeZoneCopy[index].TimeZoneName = $scope.TimeZoneCopy[index].TimeZoneName.replaceAll(' ', '_')
                });
                $scope.TimeZoneList = angular.copy($scope.TimeZoneCopy);
                //var BrowserTZ = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
                var TimeZone_ID = "";
                angular.forEach($scope.TimeZoneList, function (value, index) {
                    console.log($scope.TimeZone_ID);

                    if (value.TimeZoneId == $scope.TimeZone_ID) {
                        $scope.TimeZoneID = $scope.TimeZone_ID;
                        setTimeout(() => {
                            settimezone((value.TimeZoneName).replaceAll(' ', '_'));
                            $("#chatLoaderPV").hide();
                        }, 5000);
                    }
                });
                $("#chatLoaderPV").hide();
            });
        }
        $scope.getTimeZoneList();
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];

        $scope.DoctorAppointmentlist = function () {

            if ($scope.TimeZoneID == 0) {
                toastr.warning("Please Select Timezone", "warning");
                return;
            }
            if ($scope.SelectedDoctor == 0 || $scope.SelectedDoctor == '') {
                toastr.warning("Please Select Doctor", "warning");
                return;
            }
            $("#chatLoaderPV").show();
            var datee = new Date($scope.SearchDate).getFullYear().toString() + '-' + (((new Date($scope.SearchDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchDate).getDate().toString().length > 1) ? new Date($scope.SearchDate).getDate().toString() : ('0' + new Date($scope.SearchDate).getDate().toString()))
            var datee1 = new Date($scope.SearchEndDate).getFullYear().toString() + '-' + (((new Date($scope.SearchEndDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchEndDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchEndDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchEndDate).getDate().toString().length > 1) ? new Date($scope.SearchEndDate).getDate().toString() : ('0' + new Date($scope.SearchEndDate).getDate().toString()))
            $http.get(baseUrl + '/api/PatientAppointments/GetAppointmentDoctorDetails/?DoctorId=' + $scope.SelectedDoctor + '&Date=' + datee + '&EndDate=' + datee1 + '&Login_Session_Id=' + $scope.LoginSessionId + '&TimeZoneId=' + $scope.TimeZoneID + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data1) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = data1.DoctorAppointmentTimeSlotList;
                if (data1.DoctorAppointmentTimeSlotList.length == 0) {
                    $scope.flag = 0;
                } else {
                    $scope.flag = 1;
                }
            }).error(function (data) { $("#chatLoaderPV").hide(); });
            //}
        }

        //$scope.rembemberCurrentPage = function (p) {
        //    $scope.current_page = p
        //}

        //$scope.CancelPatientShift = function (Id) {
        //    Swal.fire({
        //        title: 'Confirm to cancel appointment',
        //        html: '',
        //        showDenyButton: true,
        //        showCancelButton: false,
        //        confirmButtonText: 'Yes',
        //        denyButtonText: 'No',
        //        showCloseButton: true,
        //        allowOutsideClick: false,
        //    }).then((result) => {
        //        if (result.isConfirmed) {
        //            $scope.Cancelled_Remarks = "";
        //            $scope.Appointment_Id = Id;
        //            $scope.ReasonTypeId = '0';
        //            angular.element('#PatientAppointmentModal').modal('show');
        //            setTimeout(() => { setres(); }, 500);
        //        } else if (result.isDenied) {
        //        }
        //    });
        //}

        //$scope.Update_CancelledAppointment = function () {
        //    if (typeof ($scope.ReasonTypeId) == "undefined" || $scope.ReasonTypeId == "0") {
        //        toastr.warning("Please select Reason Type", "warning");
        //        return false;
        //    }
        //    else {
        //        var obj = {
        //            CancelledBy_Id: $window.localStorage['UserId'],
        //            Id: $scope.Appointment_Id,
        //            Cancelled_Remarks: $scope.Cancelled_Remarks,
        //            ReasonTypeId: $scope.ReasonTypeId
        //        }
        //        $("#chatLoaderPV").show();
        //        $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
        //            $("#chatLoaderPV").hide();
        //            if (data.ReturnFlag == 1) {
        //                toastr.success(data.Message, "success");
        //            }
        //            else if (data.ReturnFlag == 0) {
        //                toastr.info(data.Message, "info");
        //            }
        //            if (data.AppointmentDetails.PaymentStatusId == 3 && data.ReturnFlag == 1) {
        //                $scope.refundAppointmentId = data.AppointmentDetails.Id;
        //                $scope.refundMerchantOrderNo = data.AppointmentDetails.MerchantOrderNo;
        //                $scope.refundAmount = data.AppointmentDetails.Amount;
        //                $scope.refundOrderNo = data.AppointmentDetails.OrderNo;
        //                $scope.refundInstitutionId = data.AppointmentDetails.Institution_Id;

        //                var obj = {
        //                    refundAppointmentId: data.AppointmentDetails.Id,
        //                    refundMerchantOrderNo: data.AppointmentDetails.MerchantOrderNo,
        //                    refundAmount: data.AppointmentDetails.Amount,
        //                    refundOrderNo: data.AppointmentDetails.OrderNo,
        //                    refundInstitutionId: data.AppointmentDetails.Institution_Id
        //                };

        //                $http.post(baseUrl + '/api/PayBy/RefundPayByCheckoutSession/', obj).success(function (data) {
        //                    console.log(data);
        //                }).error(function (data) { console.log(data); });

        //            }
        //            $scope.Cancel_CancelledAppointment();
        //            if (data.ReturnFlag == 1) {
        //                $scope.DoctorAppointmentlist();
        //            }
        //        });
        //    }
        //}

        //$scope.Cancel_CancelledAppointment = function () {
        //    angular.element('#PatientAppointmentModal').modal('hide');
        //    $scope.Cancelled_Remarks = "";
        //    $scope.ReasonTypeId = '0';
        //}

    }
  ]);