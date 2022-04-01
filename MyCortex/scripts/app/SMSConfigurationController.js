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

    }
]);