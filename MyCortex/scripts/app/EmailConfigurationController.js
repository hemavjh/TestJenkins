var EmailConfigurationcontroller = angular.module("EmailConfigurationController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

EmailConfigurationcontroller.controller("EmailConfigurationController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {


        // Declaration and initialization of Scope Variables.
        $scope.Id = 0;
        $scope.InstitutionName = "0";
        $scope.SSL_Enable = "0";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.UserTypeId = parseInt($window.localStorage["UserTypeId"]);
        /*clear the company details */
        $scope.clearInstitution = function () {
            if ($scope.InstitutionName != null) {
                $scope.ClearFields();
            }
        };

        /* Email configuration Validation function   */
        $scope.EmailConfigurationValidation = function () {
            if (typeof ($scope.Sender_Email_Id) == "undefined" || $scope.Sender_Email_Id == "") {
                //alert("Please enter Sender Email ID");
                toastr.warning("Please enter Sender Email ID", "warning");
                return false;
            }
            else if (typeof ($scope.U_Name) == "undefined" || $scope.U_Name == "") {
                //alert("Please enter User Name");
                toastr.warning("Please enter User Name", "warning");
                return false;
            }
            else if (typeof ($scope.P_word) == "undefined" || $scope.P_word == "") {
                //alert("Please enter Password");
                toastr.warning("Please enter Password", "warning");
                return false;
            }
            else if (typeof ($scope.ServerName) == "undefined" || $scope.ServerName == "") {
                //alert("Please enter Server Name(SMTP)");
                toastr.warning("Please enter Server Name(SMTP)", "warning");
                return false;
            }
            else if (typeof ($scope.PortNo) == "undefined" || $scope.PortNo == "") {
                //alert("Please enter Port No");
                toastr.warning("Please enter Port No", "warning");
                return false;
            }
            else if (typeof ($scope.DisplayName) == "undefined" || $scope.DisplayName == "") {
                //alert("Please enter Display Name");
                toastr.warning("Please enter Display Name", "warning");
                return false;
            }
            else if (typeof ($scope.SSL_Enable) == "undefined" || $scope.SSL_Enable == 0) {
                //alert("Please select SSL Enable");
                toastr.warning("Please select SSL Enable", "warning");
                return false;
            }
            if (EmailFormate($scope.Sender_Email_Id) == false) {
                //alert("Invalid email format");
                toastr.warning("Invalid email format", "warning");
                return false;
            }
            return true;
        };

        // Validation
        $scope.SSLEnableChange = function () {
            var sslenable = document.getElementById('SSL_Enable').value;
            if (sslenable != "0") {
                $('#divSSLEnable').removeClass("ng-invalid");
                $('#divSSLEnable').addClass("ng-valid");
            }
            else {
                $('#divSSLEnable').removeClass("ng-valid");
                $('#divSSLEnable').addClass("ng-invalid");
            }
        }
        /* Institution Dropdown function  */
        $scope.InstitutionList = [];
        $scope.InstitutionFilterList = [];
        $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            if (data != null) {
                $scope.Insitution_Name = data.Institution_Name;
            }
            //$scope.Insitution_Name = data.Institution_Name;
            // $scope.InstitutionFilterList =  angular.copy($scope.InstitutionList); 
        });

        $scope.Id = 0;
        $scope.Sender_Email_Id = "";
        $scope.U_Name = "";
        $scope.P_word = "";
        $scope.ServerName = "";
        $scope.PortNo = "";
        $scope.DisplayName = "";
        $scope.SSL_Enable = "0";
        $scope.Id = "0";
        $scope.Remarks = "";
        /* Email configurations Save and Update Function*/
        $scope.EmailConfiguration_AddEdit = function () {
            //if ($scope.EmailConfigurationValidation() == true) {
                $("#chatLoaderPV").show();
                var val_sslen = 2;
                if ($scope.SSL_Enable == "1") {
                    val_sslen = 1;
                }
                else {
                    val_sslen = 2;
                }
            if ($scope.SSL_Enable != "0") {
                $('#divSSLEnable').removeClass("ng-invalid");
                $('#divSSLEnable').addClass("ng-valid");
            }
            else {
                $('#divSSLEnable').removeClass("ng-valid");
                $('#divSSLEnable').addClass("ng-invalid");
            }
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $window.localStorage['InstitutionId'],
                    Sender_Email_Id: $scope.Sender_Email_Id,
                    UserName: $scope.User_Name,
                    Password: $scope.P_word,
                    ServerName: $scope.ServerName,
                    PortNo: $scope.PortNo,
                    DisplayName: $scope.DisplayName,
                    EConfigSSL_Enable: val_sslen,
                    Remarks: $scope.Remarks,
                    Created_By: $window.localStorage['UserId']
                };
                $('#save').attr("disabled", true);
                $http.post(baseUrl + '/api/EmailConfiguration/EmailConfiguration_AddEdit/', obj).success(function (data) {
                    //alert("Email setup saved successfully");
                    toastr.success("Email setup saved successfully", "success");
                    $('#save').attr("disabled", false);
                    $scope.EmailConfiguration_ViewEdit();
                    //$scope.ClearFields();
                    //   $scope.clearInstitution();
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "An error has occurred while adding Email Configuration!" + data.ExceptionMessage;
                });
            //}
        };
        /* Email configurations View and Edit Function*/
        $scope.EmailConfiguration_ViewEdit = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 1) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/EmailConfiguration/EmailConfiguration_View/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                    if (data != null) {
                        $scope.Id = data.Id;
                        $scope.Insitution_Name = data.Institution_Name;
                        $scope.Sender_Email_Id = data.Sender_Email_Id;
                        $scope.U_Name = data.UserName;
                        $scope.P_word = data.Password;
                        $scope.ServerName = data.ServerName;
                        $scope.PortNo = data.PortNo;
                        $scope.DisplayName = data.DisplayName;
                        $scope.SSL_Enable = data.EConfigSSL_Enable.toString();
                        //   $scope.SSL_Enable = data.SSL_Enable.toString();
                        $scope.Remarks = data.Remarks;
                    }
                    $("#chatLoaderPV").hide();
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };


        /* Clear the scope variables */
        $scope.ClearFields = function () {
            $scope.Id = 0;
            $scope.Sender_Email_Id = "";
            $scope.U_Name = "";
            $scope.P_word = "";
            $scope.ServerName = "";
            $scope.PortNo = "";
            $scope.DisplayName = "";
            $scope.SSL_Enable = "0";
            $scope.Id = "0";
            $scope.Remarks = "";
        }


        $scope.check_email_configuration = function () {
            if ($scope.EmailConfigurationValidation() == true) {
                var val_sslen = 2;
                if ($scope.SSL_Enable == "1") {
                    val_sslen = 1;
                }
                else {
                    val_sslen = 2;
                }
                if ($scope.SSL_Enable != "0") {
                    $('#divSSLEnable').removeClass("ng-invalid");
                    $('#divSSLEnable').addClass("ng-valid");
                }
                else {
                    $('#divSSLEnable').removeClass("ng-valid");
                    $('#divSSLEnable').addClass("ng-invalid");
                }
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $window.localStorage['InstitutionId'],
                    Sender_Email_Id: $scope.Sender_Email_Id,
                    UserName: $scope.U_Name,
                    Password: $scope.P_word,
                    ServerName: $scope.ServerName,
                    PortNo: $scope.PortNo,
                    DisplayName: $scope.DisplayName,
                    EConfigSSL_Enable: val_sslen,
                    Remarks: $scope.Remarks,
                    Created_By: $window.localStorage['UserId']
                };
                $("#chatLoaderPV").show();
                $http.post(baseUrl + 'api/EmailConfiguration/CheckEmailConfiguration/', obj).success(function (data) {
                    if (data != null) {
                        //console.log(data);
                        if (data == true) {
                            toastr.success("Email Setup Working Properly", "Success");
                        } else {
                            toastr.warning("Email Setup Not Working Properly", "Warning");
                        }
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) { toastr.warning("Email Setup Server Error", "Warning"); });
            }
        }

    }
]);