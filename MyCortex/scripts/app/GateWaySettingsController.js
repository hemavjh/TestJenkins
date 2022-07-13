var GateWaySettingscontroller = angular.module("GateWaySettingsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

GateWaySettingscontroller.controller("GateWaySettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        $scope.IsActive = true;
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.GatewayText = [];
        $scope.InstitutionGatewayList = [];
        $scope.selectedGatewaySettings = "0";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.UserTypeId = parseInt($window.localStorage["UserTypeId"]);
        $scope.status = 0;

        $http.get(baseUrl + '/api/Common/InstitutionNameList/?status=' + $scope.status).success(function (data) {
            $scope.InstitutiondetailsListTemp = [];
            $scope.InstitutiondetailsListTemp = data;
            $scope.InstitutiondetailsListTemp = data;
            var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
            $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
            //$scope.InstitutiondetailsListTemp.push(obj);
            $scope.InstitutiondetailsList = angular.copy($scope.InstitutiondetailsListTemp);
        });
        $scope.Institution_Id = $window.localStorage["InstitutionId"];
        $scope.PaymentList = function () {
            var inst_id = "";
            if ($window.localStorage['UserTypeId'] == 1) {
                inst_id = $scope.Institution_Id;
            }
            if ($window.localStorage['UserTypeId'] == 3) {
                inst_id = $window.localStorage["InstitutionId"];
            }
            $http.get(baseUrl + '/api/Common/getInstitutionPayment/?Institution_Id=' + $scope.Institution_Id
            ).success(function (data) {
                $scope.InstitutionGatewayList = [];
                if (data != null && data.length != 0) {
                    $scope.InstitutionGatewayList = data;
                    $scope.selectedGateway = data[0].DefaultPaymentGatewayId.toString();
                }
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            });
        };

        $scope.InstituteGetDetails = function () {
            $scope.InstitutionGatewayList = [];
            $scope.emptydataGatewaySettings = [];
            $scope.rowCollectionGatewaySettings = [];
            $scope.selectedGatewaySettings = "0";
        }

        $scope.InsuranceList = function () {
            var inst_id = "";
            if ($window.localStorage['UserTypeId'] == 1) {
                inst_id = $scope.Institution_Id;
            }
            if ($window.localStorage['UserTypeId'] == 3) {
                inst_id = $window.localStorage["InstitutionId"];
            }
            $http.get(baseUrl + '/api/Common/getInstitutionInsurance/?Institution_Id=' + inst_id
            ).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.InstitutionGatewayList = [];
                if (data != null && data.length != 0) {
                    $scope.InstitutionGatewayList = data;
                    $scope.selectedGateway = data[0].DefaultPaymentGatewayId.toString();
                }
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            });
        };

        $scope.IsEdit = false;
        $scope.GatewaySettingsEdit = function () {
            $scope.IsEdit = true;
        }

        $scope.GatewaySettingsCancel = function () {
            $scope.GatewaySettingsList();
            $scope.IsEdit = false;
        }

        $scope.searchqueryGatewaySettings = "";
        /* Filter the master list function for Search*/
        $scope.FilterGatewaySettingsList = function () {
            var data = $scope.rowCollectionGatewaySettings.filter(item => item.GatewayId === parseInt($scope.selectedGateway));

            var searchstring = angular.lowercase($scope.searchqueryGatewaySettings);
            if ($scope.searchqueryGatewaySettings == "") {
                $scope.rowCollectionGatewaySettings = angular.copy(data);
            }
            else {
                $scope.rowCollectionGatewaySettings = $ff(data, function (value, index) {
                    return angular.lowercase(value.GatewayId).match(searchstring)
                });
            }
            angular.forEach($scope.rowCollectionGatewaySettings, function (masterVal, masterInd) {
                $scope.GatewayText[masterVal.Id] = masterVal.GatewayValue;
            });
        };

        /*THIS IS FOR LIST FUNCTION*/
        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.GatewaySettingsList = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 1) {
                $("#chatLoaderPV").show();
                $scope.selectedGateway = 0;
                var inst_id = "";
                if ($window.localStorage['UserTypeId'] == 1) {
                    inst_id = $scope.Institution_Id;
                }
                if ($window.localStorage['UserTypeId'] == 3) {
                    inst_id = $window.localStorage["InstitutionId"];
                }
                if ($scope.selectedGatewaySettings == 1) {
                    $scope.PaymentList();
                } else if ($scope.selectedGatewaySettings == 2) {
                    $scope.InsuranceList();
                } else if ($scope.selectedGatewaySettings <= 0) {

                }
                //$scope.LanguageList();

                $scope.emptydataGatewaySettings = [];
                $scope.rowCollectionGatewaySettings = [];

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }

                $http.get(baseUrl + '/api/GatewaySettings/GatewaySettings_List/?Institution_Id=' + inst_id + '&Login_Session_Id=' + $scope.LoginSessionId
                ).success(function (data) {

                    $("#chatLoaderPV").hide();
                    $scope.emptydataGatewaySettings = [];
                    $scope.rowCollectionGatewaySettings = [];
                    if (data != null && data.length != 0) {
                        $scope.rowCollectionGatewaySettingsFilter = angular.copy(data);
                        $scope.rowCollectionGatewaySettings = data.filter(item => item.GatewayId === parseInt($scope.selectedGateway));
                        if ($scope.rowCollectionGatewaySettingsFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        angular.forEach($scope.rowCollectionGatewaySettings, function (masterVal, masterInd) {
                            $scope.GatewayText[masterVal.Id] = masterVal.GatewayValue;
                        });
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                    $("#chatLoaderPV").hide();
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.GatewaySettingsDetails = [];
        $scope.GatewaySettings_Edit = function () {
            $("#chatLoaderPV").show();
            angular.forEach($scope.rowCollectionGatewaySettings, function (value, index) {
                var obj = {
                    Id: value.Id,
                    InstitutionId: $scope.Institution_Id,
                    GatewayId: parseInt($scope.selectedGateway),
                    GatewayValue: $scope.GatewayText[value.Id],
                }
                $scope.GatewaySettingsDetails.push(obj);
                $('#save').attr("disabled", true);
            });

            $http.post(baseUrl + '/api/GatewaySettings/GatewaySettings_Edit/', $scope.GatewaySettingsDetails).success(function (data) {
                $scope.GatewaySettingsDetails = [];
                $scope.GatewayText = [];
                $scope.searchqueryGatewaySettings = "";
                $scope.GatewaySettingsList();
                $("#chatLoaderPV").hide();
                //alert("GatewaySettings Data saved successfully");
                toastr.success("GatewaySettings Data saved successfully", "success");
                $('#save').attr("disabled", false);
                $scope.IsEdit = false;
            });

        };

        $scope.GatewayDefaultSave = function () {
            $("#chatLoaderPV").show();
            $('#save1').attr("disabled", true);
            $http.get(baseUrl + '/api/GatewaySettings/GatewayDefault_Save/?InstitutionId=' + $scope.Institution_Id + '&GatewayTypeId=' + $scope.selectedGatewaySettings + '&GatewayId=' + $scope.selectedGateway
            ).success(function (data) {
                if (data == 1) {
                    if ($scope.selectedGatewaySettings == 1) {
                        $scope.PaymentList();
                    } else if ($scope.selectedGatewaySettings == 2) {
                        $scope.InsuranceList();
                    }
                    $("#chatLoaderPV").hide();
                    //alert("Saved successfully.");
                    toastr.success("Saved successfully.", "success");
                    $('#save1').attr("disabled", false);
                }
                else {
                    $("#chatLoaderPV").hide();
                    //alert("Error occurred.");
                    toastr.error("Error occurred.", "warning");
                }
            })
        }
    }
]);