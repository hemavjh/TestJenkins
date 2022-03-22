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
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        $scope.AppointmentReasonTypeList = [];
        $scope.ReasonTypeId = 0;
        $scope.Cancelled_Remarks = "";
        $scope.Appointment_Id = 0;
        $http.get(baseUrl + '/api/PatientAppointments/AppointmentReasonType_List/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.AppointmentReasonTypeListTemp = [];
            $scope.AppointmentReasonTypeListTemp = data;
            var obj = { "ReasonTypeId": 0, "ReasonType": "Select", "IsActive": 1 };
            $scope.AppointmentReasonTypeListTemp.splice(0, 0, obj);
            $scope.AppointmentReasonTypeList = angular.copy($scope.AppointmentReasonTypeListTemp);
        });
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.CG_PatientAppointmentList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/CG_PatientAppointmentList/?UserId=' + $window.localStorage['UserId'] + '&Login_Session_Id=' + $scope.LoginSessionId + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data1) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = data1.PatientAppointmentList;
                if (data1.PatientAppointmentList.length == 0) {
                    $scope.flag = 0;
                } else {
                    $scope.flag = 1;
                }
            }).error(function (data) { $("#chatLoaderPV").hide(); });
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
                    $http.post(baseUrl + '/api/User/CG_Confirm_PatientAppointments/', obj).success(function (data) {
                        $("#chatLoaderPV").hide();
                        if (data.ReturnFlag == 1) {
                            $scope.CG_PatientAppointmentList();
                            //alert(data.Message);
                            toastr.success(data.Message, "success");
                        } else {
                            //alert(data.Message);
                            toastr.info(data.Message, "info");
                        }
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
                $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    if (data.AppointmentDetails.PaymentStatusId == 3) {
                        $scope.refundAppointmentId = data.AppointmentDetails.Id;
                        $scope.refundMerchantOrderNo = data.AppointmentDetails.MerchantOrderNo;
                        $scope.refundAmount = data.AppointmentDetails.Amount;
                        $scope.refundOrderNo = data.AppointmentDetails.OrderNo;
                        $scope.refundInstitutionId = data.AppointmentDetails.Institution_Id;

                        var obj = {
                            refundAppointmentId: data.AppointmentDetails.Id,
                            refundMerchantOrderNo: data.AppointmentDetails.MerchantOrderNo,
                            refundAmount: data.AppointmentDetails.Amount,
                            refundOrderNo: data.AppointmentDetails.OrderNo,
                            refundInstitutionId: data.AppointmentDetails.Institution_Id
                        };

                        $http.post(baseUrl + '/api/PayBy/RefundPayByCheckoutSession/', obj).success(function (data) {
                            console.log(data);
                        }).error(function (data) { console.log(data); });

                    }
                    $scope.Cancel_CancelledAppointment();
                    if (data.ReturnFlag == 1) {
                        $scope.CG_PatientAppointmentList();
                    }
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
                    $scope.Appointment_Id = id;
                    angular.element('#PatientAppointmentModal').modal('show');
                } else if (result.isDenied) {
                }
            });
        }
    }
]);
