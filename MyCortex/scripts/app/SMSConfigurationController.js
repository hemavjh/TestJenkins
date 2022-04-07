var SMSConfigurationController = angular.module("SMSConfigurationController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

SMSConfigurationController.controller("SMSConfigurationController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        // Declaration and initialization of Scope Variables.
        $scope.Id = 0;
        $scope.InstitutionName = "0";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.UserTypeId = parseInt($window.localStorage["UserTypeId"]);

    
        /* Institution Dropdown function  */
        $scope.InstitutionList = [];
        $scope.InstitutionFilterList = [];
        $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            $scope.Insitution_Name = data.Institution_Name;
        });


        $scope.Source_Id = "";
        $scope.UserName = "";
        $scope.ApiId = "";
        $scope.Id = "0";
        /* SMS configurations Save and Update Function*/
        $scope.SMSConfiguration_AddEdit = function () {
            if ($scope.SMS_ConfigurationValidation() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $window.localStorage['InstitutionId'],
                    Source_Id: $scope.Source_Id,
                    UserName: $scope.UserName,
                    ApiId: $scope.ApiId,
                    Created_By: $window.localStorage['UserId']
                };
                $('#save').attr("disabled", true);
                $http.post(baseUrl + '/api/SMSConfiguration/SMSConfiguration_AddEdit/', obj).success(function (data) {
                    toastr.success("SMS setup saved successfully", "success");
                    $('#save').attr("disabled", false);
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "An error has occurred while adding SMS Configuration!" + data.ExceptionMessage;
                });
            }

        }

        $scope.SMSConfiguration_ViewEdit = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 1) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/SMSConfiguration/SMSConfiguration_View/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                    if (data != null) {
                        $scope.Id = data.Id;
                        $scope.Insitution_Name = data.Institution_Name;
                        $scope.Source_Id = data.Source_Id;
                        $scope.UserName = data.UserName;
                        $scope.ApiId = data.ApiId;
                        $scope.Remarks = data.Remarks;
                    }
                    $("#chatLoaderPV").hide();
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        /* SMS_Setup configuration Validation function   */
        $scope.SMS_ConfigurationValidation = function () {
            if (typeof ($scope.Source_Id) == "undefined" || $scope.Source_Id == "") {
                toastr.warning("Please enter Source_Id", "warning");
                return false;
            }
            else if (typeof ($scope.UserName) == "undefined" || $scope.UserName == "") {
                toastr.warning("Please enter User Name", "warning");
                return false;
            }
            else if (typeof ($scope.ApiId) == "undefined" || $scope.ApiId == "") {
                toastr.warning("Please enter Api_Id", "warning");
                return false;
            }
            return true;
        };

        $scope.CheckSmsConfigurationValidation = function () {
            if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                toastr.warning("Please enter MobileNo", "warning");
                return false;
            }
            else if (typeof ($scope.Subject) == "undefined" || $scope.Subject == "") {
                toastr.warning("Please enter User Subject", "warning");
                return false;
            }
            else if (typeof ($scope.Body) == "undefined" || $scope.Body == "") {
                toastr.warning("Please enter Body", "warning");
                return false;
            }
            return true;
        };

        $scope.clearfields = function () {
            $scope.MobileNo = "";
            $scope.Subject = "";
            $scope.Body = "";
        }

        $scope.check_sms_configuration = function () {
            //$scope.smsUrl = "https://txt.speroinfotech.ae/API/SendSMS?";
            //$scope.smsUserName = "MyHealth";
            //$scope.smsApiId = "Kv2n09u8";
            ////$scope.smsDestination = "971552433557"; //Mobile Number
            //$scope.smsDestination = $('#txthdFullNumber').val(); //Mobile Number
            //$scope.smsSource = $scope.Subject; // AD-Medspero // Header Text
            //$scope.smsText = $scope.ServerName;   //"Test";
            //$http.get($scope.smsUrl + 'username=' + $scope.smsUserName + '&apiId=' + $scope.smsApiId + '&json=True&destination=' + $scope.smsDestination + '&source=' + $scope.smsSource + '&text=' + $scope.smsText).success(function (data) {
            //    $scope.smsResponse = data;
            //});
            if ($scope.CheckSmsConfigurationValidation() == true) {
                //var val_sslen = 2;
                //if ($scope.SSL_Enable == "1") {
                //    val_sslen = 1;
                //}
                //else {
                //    val_sslen = 2;
                //}
                //if ($scope.SSL_Enable != "0") {
                //    $('#divSSLEnable').removeClass("ng-invalid");
                //    $('#divSSLEnable').addClass("ng-valid");
                //}
                //else {
                //    $('#divSSLEnable').removeClass("ng-valid");
                //    $('#divSSLEnable').addClass("ng-invalid");
                //}
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $window.localStorage['InstitutionId'],
                    //MobileNo: $scope.MobileNo,
                    MobileNo: $('#txthdFullNumber').val(),
                    Subject: $scope.Subject,
                    Body: $scope.Body,
                    Created_By: $window.localStorage['UserId']
                };
                $("#chatLoaderPV").show();
                $http.post(baseUrl + 'api/SMSConfiguration/CheckSMSConfiguration/', obj).success(function (data) {
                    if (data != null) {
                        //console.log(data);
                        if (data == true) {
                            toastr.success("SMS Setup Working Properly", "Success");
                        } else {
                            toastr.warning("SMS Setup Not Working Properly", "Warning");
                        }
                    }
                    $scope.clearfields();
                    $("#chatLoaderPV").hide();
                }).error(function (data) { toastr.warning("SMS Setup Server Error", "Warning"); });
            }
        }

    }
]);