var AppointmentApprovalController = angular.module("AppointmentApprovalController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}
AppointmentApprovalController.controller("AppointmentApprovalController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        $scope.emptydata = [];
        $scope.rowCollectionFilter = [];
        $scope.ConfigCode = "PAGINATION";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).then(function (response) {
            if (response.data[0] != undefined) {
                $scope.page_size = parseInt(response.data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        }, function errorCallback(response) {

        });
        $scope.AppointmentReasonTypeList = [];
        $scope.ReasonTypeId = 0;
        $scope.Cancelled_Remarks = "";
        $scope.Appointment_Id = 0;
        $http.get(baseUrl + '/api/PatientAppointments/AppointmentReasonType_List/?Institution_Id=' + $window.localStorage['InstitutionId']).then(function (response) {
            $scope.AppointmentReasonTypeListTemp = [];
            $scope.AppointmentReasonTypeListTemp = response.data;
            var obj = { "ReasonTypeId": 0, "ReasonType": "Select", "IsActive": 1 };
            $scope.AppointmentReasonTypeListTemp.splice(0, 0, obj);
            $scope.AppointmentReasonTypeList = angular.copy($scope.AppointmentReasonTypeListTemp);
        }, function errorCallback(response) {

        });
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.CG_PatientAppointmentList = function () {
            $("#chatLoaderPV").show();
            var BrowserTZ = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];
            $http.get(baseUrl + '/api/User/CG_PatientAppointmentList/?UserId=' + $window.localStorage['UserId'] + '&Login_Session_Id=' + $scope.LoginSessionId + '&Institution_Id=' + $window.localStorage['InstitutionId'] + '&TimeZoneName=' + BrowserTZ).then(function (data1) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = data1.data.PatientAppointmentList;
                if (data1.data.PatientAppointmentList.length == 0) {
                    $scope.flag = 0;
                } else {
                    $scope.flag = 1;
                }
            }, function errorCallback(data1){
                $("#chatLoaderPV").hide();
            });
        }

        $scope.CG_PatientAppointmentList();

        $scope.ApproveAppointment = function (id) {
            Swal.fire({
                title: 'Confirm to appointment',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
                allowOutsideClick: false,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $("#chatLoaderPV").show();
                    var obj = {
                        "Id": id,
                        "SESSION_ID": $window.localStorage['Login_Session_Id'],
                        "Institution_Id": $window.localStorage['InstitutionId'],
                        "user_id": $window.localStorage['UserId']
                    }
                    $http.post(baseUrl + '/api/User/CG_Confirm_PatientAppointments/', obj).then(function (response) {
                        $("#chatLoaderPV").hide();
                        if (response.data.ReturnFlag == 1) {
                            $scope.CG_PatientAppointmentList();
                            //alert(data.Message);
                            toastr.success(response.data.Message, "success");
                        } else {
                            //alert(data.Message);
                            toastr.info(response.data.Message, "info");
                        }
                    }, function errorCallback(response) {

                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
        }

        $scope.Update_CancelledAppointment = function () {
            if (typeof ($scope.ReasonTypeId) == "undefined" || $scope.ReasonTypeId == "0") {
                toastr.warning("Please select Reason Type", "warning");
                return false;
            }
            else {
                var obj = {
                    CancelledBy_Id: $window.localStorage['UserId'],
                    Id: $scope.Appointment_Id,
                    Cancelled_Remarks: $scope.Cancelled_Remarks,
                    ReasonTypeId: $scope.ReasonTypeId
                }
                $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, obj).then(function (response) {
                    if (response.data.ReturnFlag == 1) {
                        toastr.success(response.data.Message, "success");
                    }
                    else if (response.data.ReturnFlag == 0) {
                        toastr.info(response.data.Message, "info");
                    }
                    if (response.data.AppointmentDetails.PaymentStatusId == 3 && response.data.ReturnFlag == 1) {
                        $scope.refundAppointmentId = response.data.AppointmentDetails.Id;
                        $scope.refundMerchantOrderNo = response.data.AppointmentDetails.MerchantOrderNo;
                        $scope.refundAmount = response.data.AppointmentDetails.Amount;
                        $scope.refundOrderNo = response.data.AppointmentDetails.OrderNo;
                        $scope.refundInstitutionId = response.data.AppointmentDetails.Institution_Id;

                        var obj = {
                            refundAppointmentId: response.data.AppointmentDetails.Id,
                            refundMerchantOrderNo: response.data.AppointmentDetails.MerchantOrderNo,
                            refundAmount: response.data.AppointmentDetails.Amount,
                            refundOrderNo: response.data.AppointmentDetails.OrderNo,
                            refundInstitutionId: response.data.AppointmentDetails.Institution_Id
                        };

                        $http.post(baseUrl + '/api/PayBy/RefundPayByCheckoutSession/', obj).then(function (response) {
                            console.log(response.data);
                        }).error(function (response) { console.log(response.data); });

                    }
                    $scope.Cancel_CancelledAppointment();
                    if (response.data.ReturnFlag == 1) {
                        $scope.CG_PatientAppointmentList();
                    }
                }, function errorCallback(response) {

                });
            }
        }

        $scope.Cancel_CancelledAppointment = function () {
            angular.element('#PatientAppointmentModal').modal('hide');
            $scope.Cancelled_Remarks = "";
            $scope.ReasonTypeId = '0';
        }

        $scope.CancelAppointment = function (id) {
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
                    $scope.Cancelled_Remarks = "";
                    $scope.ReasonTypeId = '0';
                    $scope.Appointment_Id = id;
                    angular.element('#PatientAppointmentModal').modal('show');
                    setTimeout(() => { setres(); }, 500);
                } else if (result.isDenied) {
                }
            });
        }
    }
]);
