var WebConfigurationcontroller = angular.module("WebConfigurationController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

WebConfigurationcontroller.controller("WebConfigurationController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        $scope.IsActive = true;
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.Config_value = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.IsEdit = false;
        $scope.WebConfigEdit = function () {
            $scope.IsEdit = true;
        }

        $scope.WebConfigCancel = function () {
            $scope.WebConfigurationList();
            $scope.IsEdit = false;
        }

        $scope.searchqueryWebConfiguration = "";
        /* Filter the master list function for Search*/
        $scope.FilterWebConfigurationList = function () {
            var searchstring = angular.lowercase($scope.searchqueryWebConfiguration);
            if ($scope.searchqueryWebConfiguration == "") {
                $scope.rowCollectionWebConfiguration = angular.copy($scope.rowCollectionWebConfigurationFilter);
            }
            else {
                $scope.rowCollectionWebConfiguration = $ff($scope.rowCollectionWebConfigurationFilter, function (value, index) {
                    return angular.lowercase(value.CONFIGCODE).match(searchstring)
                });
            }
        };

        /* on click Add New, Add popup opened*/
        $scope.AddWebConfiguration = function () {
            angular.element('#WebConfigurationAddModal').modal('show');
        }

        $scope.CancelWebConfigurationDetails = function () {
            angular.element('#WebConfigurationAddModal').modal('hide');
        }

        $scope.ClearWebConfigurationPopUp = function () {
            $scope.Id = 0;
            $scope.Institution_Id = "";
            $scope.Remarks = "";
            $scope.Config_Code = "";
            $scope.Config_Name = "";
            $scope.Config_Value = "";
            $scope.Config_Type = "";
            $scope.CancelWebConfigurationPopUp();
        }

        /*THIS IS FOR LIST FUNCTION*/
        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.WebConfigurationList = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.emptydataWebConfiguration = [];
                $scope.rowCollectionWebConfiguration = [];

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }

                $http.get(baseUrl + '/api/WebConfiguration/WebConfiguration_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + $window.localStorage['InstitutionId']
                ).success(function (data) {
                    $scope.emptydataWebConfiguration = [];
                    $scope.rowCollectionWebConfiguration = [];
                    $scope.rowCollectionWebConfiguration = data;
                    $scope.rowCollectionWebConfigurationFilter = angular.copy($scope.rowCollectionWebConfiguration);
                    if ($scope.rowCollectionWebConfigurationFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                    angular.forEach($scope.rowCollectionWebConfiguration, function (masterVal, masterInd) {
                        $scope.Config_value[masterVal.ID] = masterVal.CONFIGVALUE;
                    });
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        /* on click view, view popup opened*/
        $scope.ViewWebConfiguration = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewWebConfigurationList();
            angular.element('#ViewWebConfigurationModal').modal('show');
        }

        $scope.ViewWebConfigurationList = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/WebConfiguration/WebConfiguration_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.DuplicatesId = data.ID;
                $scope.Institution_Id = data.INSTITUTION_ID.toString();
                $scope.Config_Code = data.CONFIGCODE;
                $scope.Config_Name = data.CONFIGINFO;
                $scope.Config_Value = data.CONFIGVALUE;
                $scope.Config_Type = data.CONFIG_TYPEDEFINITION;
                $scope.Remarks = data.REMARKS;
                $("#chatLoaderPV").hide();
            });
        };

        /* THIS IS FUNCTION FOR CLOSE Modal Window  */
        $scope.CancelWebConfigurationPopUp = function () {
            angular.element('#WebConfigurationAddModal').modal('hide');
            angular.element('#ViewWebConfigurationModal').modal('hide');
        };

        $scope.WebConfigurationDetails = [];
        $scope.WebConfigurationAddEdit = function () {
            $("#chatLoaderPV").show();
            $scope.WebConfigurationDetails = [];
            var obj = {
                ID: $scope.Id,
                INSTITUTION_ID: $window.localStorage['InstitutionId'],
                CONFIGCODE: $scope.Config_Code,
                CONFIGINFO: $scope.Config_Name,
                CONFIGVALUE: $scope.Config_Value,
                CONFIG_TYPEDEFINITION: $scope.Config_Type,
                REMARKS: $scope.Remarks
            };
            $scope.WebConfigurationDetails.push(obj)
            $http.post(baseUrl + '/api/WebConfiguration/WebConfiguration_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.WebConfigurationDetails).success(function (data) {
                //alert(data.Message);
                toastr.success(data.Message, "success");
                $scope.WebConfigurationList();
                $scope.ClearWebConfigurationPopUp();
                $scope.searchqueryWebConfiguration = "";
                $("#chatLoaderPV").hide();
            }).error(function (data) {
                $scope.error = "An error has occurred while deleting Parameter" + data;
            });

        };

        $scope.WebConfigurationDetails = [];
        $scope.Configuration_AddEdit = function () {
            $("#chatLoaderPV").show();
            angular.forEach($scope.rowCollectionWebConfiguration, function (value, index) {
                var obj = {
                    Id: value.ID,
                    INSTITUTION_ID: value.INSTITUTION_ID, //$scope.INSTITUTION_ID,
                    CONFIGVALUE: $scope.Config_value[value.ID] == 0 || $scope.Config_value[value.ID] == "" ? '' : $scope.Config_value[value.ID],
                }
                $('#save').attr("disabled", true);
                $scope.WebConfigurationDetails.push(obj);
            });

            $http.post(baseUrl + '/api/WebConfiguration/Configuration_AddEdit/', $scope.WebConfigurationDetails).success(function (data) {
                $("#chatLoaderPV").hide(); 
                //alert("Configuration Data saved successfully");
                toastr.success("Configuration Data saved successfully", "success");
                $('#save').attr("disabled", false);
                $scope.WebConfigurationDetails = [];
                $scope.Config_value = [];
                $scope.searchqueryWebConfiguration = "";
                $scope.WebConfigurationList();
                $scope.IsEdit = false;
                //$location.path("/ParameterSettings");
            });

        };

        /* on click Edit, edit popup opened*/
        $scope.EditWebConfiguration = function (CatId, ActiveFlag) {
            if (ActiveFlag == 1) {
                $scope.ClearWebConfigurationPopUp();
                $scope.Id = CatId;
                $scope.ViewWebConfigurationList();
                angular.element('#WebConfigurationAddModal').modal('show');
            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
            }
        };

        /*InActive the WebConfiguration*/
        $scope.DeleteWebConfiguration = function (comId) {
            $scope.Id = comId;
            $scope.WebConfiguration_InActive();
        };
        /*
        Calling the api method to inactived the details of the  WebConfiguration ,
            and redirected to the list page.
            */
        $scope.WebConfiguration_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Web Configuration?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/WebConfiguration/WebConfiguration_InActive/', obj).success(function (data) {
                    //alert(data.Message);
                    toastr.success(data.Message, "success");
                    $scope.WebConfigurationList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Holiday" + data;
                });
            };
        };

        /*Active the Doctor Holiday*/
        $scope.ReInsertWebConfiguration = function (comId) {
            $scope.Id = comId;
            $scope.WebConfiguration_Active();
        };
        /* 
       Calling the api method to Actived the details of the  WebConfiguration,
       and redirected to the list page.
       */
        $scope.WebConfiguration_Active = function () {
            var Ins = confirm("Do you like to activate the selected  Web Configuration?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/WebConfiguration/WebConfiguration_Active/', obj).success(function (data) {
                    ///alert(data.Message);
                    toastr.success(data.Message, "success");
                    $scope.WebConfigurationList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while Activating WebConfiguration" + data;
                });
            };
        }
    }
]);