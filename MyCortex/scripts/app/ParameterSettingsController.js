var ParameterSettings = angular.module("ParameterSettingsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

ParameterSettings.controller("ParameterSettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$timeout', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $timeout, toastr) {
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.Units_ID = [];
        $scope.Units_Name = [];
        $scope.ProtocolParametersList = [];
        $scope.UnitMasterList = [];
        $scope.Min_Possible = [];
        $scope.NormalRange_High = [];
        $scope.NormalRange_low = [];
        $scope.Average = [];
        $scope.Max_Possible = [];
        $scope.Remarks = [];
        $scope.Diagnostic_Flag = [];
        $scope.Compliance_Flag = [];
        $scope.UnitGroupType = 1;

        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.ParameterSettings_Validations = function () {

            var validateflag = true;
            var validationMsg = "";
            angular.forEach($scope.ProtocolParametersList, function (value, index) {

                var minval = 0;
                if ((parseFloat($scope.Min_Possible[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.Min_Possible[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Maximum Possible is greater than Minimum Possible for " + value.Name;
                    //alert("Maximum Possible is greater than Minimum Possible, cannot Save " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_low[value.Id]) > ($scope.NormalRange_High[value.Id])) && ($scope.NormalRange_low[value.Id] != "" && $scope.NormalRange_High[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range High is greater than normal Range Low for " + value.Name;
                    //alert("Please enter Normal Range High is greater than normal Range Low " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_High[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.NormalRange_High[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range High is less than than Maximum Possible for " + value.Name;
                    //alert("Please enter Normal Range High is less than than Maximum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_High[value.Id]) < ($scope.Min_Possible[value.Id])) && ($scope.NormalRange_High[value.Id] != "" && $scope.Min_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range High is less than Minimum Possible for " + value.Name;
                    //alert("Please enter Normal Range High is less than Minimum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }

                if ((parseFloat($scope.NormalRange_low[value.Id]) < ($scope.Min_Possible[value.Id])) && ($scope.NormalRange_low[value.Id] != "" && $scope.Min_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range Low is less than Minimum Possible for " + value.Name;
                    //alert("Please enter Normal Range Low is less than Minimum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_low[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.NormalRange_low[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range Low is greater than Maximum Possible for " + value.Name;
                    //alert("Please enter Normal Range Low is greater than Maximum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }

                if ((parseFloat($scope.Average[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.Average[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is greater than Maximum Possible for " + value.Name;
                    //alert("Please enter Average is grater than Maximum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.Average[value.Id]) < ($scope.Min_Possible[value.Id])) && ($scope.Average[value.Id] != "" && $scope.Min_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is less than Minimum Possible for " + value.Name;
                    //alert("Please enter Average is less than Minimum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }

                if ((parseFloat($scope.Average[value.Id]) > ($scope.NormalRange_High[value.Id])) && ($scope.Average[value.Id] != "" && $scope.NormalRange_High[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is grater than Normal Range High for " + value.Name;
                    //alert("Please enter Average is grater than Normal Range High " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.Average[value.Id]) < ($scope.NormalRange_low[value.Id])) && ($scope.Average[value.Id] != "" && $scope.NormalRange_low[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is less than Normal Range Low for " + value.Name;
                    //alert("Please enter Average is less than Normal Range Low " + value.Name);
                    validateflag = false;
                    return false;
                }

                if (($scope.Min_Possible[value.Id] != "" || $scope.Max_Possible[value.Id] != "" || $scope.NormalRange_High[value.Id] != ""
                    || $scope.NormalRange_low[value.Id] != "" || $scope.Average[value.Id] != "") && ($scope.Units_ID[value.Id] == null || $scope.Units_ID[value.Id] == undefined)) {
                    validationMsg = validationMsg + "\n" + "Please select Units for " + value.Name;
                    //alert("Please select Units");
                    validateflag = false;
                    //return false;
                }
            });

            if (validateflag == false) {
                //alert(validationMsg + "\n" + "cannot Save ");
                toastr.info(validationMsg + "\n" + "cannot Save ","info");
                return false;
            }
            return true;
        }

        /* 
        Calling api method for the dropdown list in the html page for the field Category
        */
        //$http.get(baseUrl + '/api/ParameterSettings/ProtocolParameterMasterList/').success(function (data) {
        //    $scope.ProtocolParametersList = data;
        //    $scope.ResultListFiltered = $scope.ProtocolParametersList;
        //});

        /*Set Unit Group Preference*/
        $scope.SetUnitGroupPreference = function () {
            $http.get(baseUrl + '/api/ParameterSettings/UnitGroupPreferenceGet/?institutionId=' + $window.localStorage['InstitutionId']).then(function (response) {
                $scope.UnitGroupType = response.data.PreferenceType;
            }, function errorCallback(response) {
            });
        }

        /*Store Chat Preference*/
        $scope.SaveUnitGroupPreference = function () {
            var type = $scope.UnitGroupType;
            $http.get(baseUrl + '/api/ParameterSettings/UnitGroupPreferenceSave/?institutionId=' + $window.localStorage['InstitutionId'] + '&preferenceType=' + type).then(function (response) {
                return response.data;
            }, function errorCallback(response) {
            });
        }

        //$http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=0&Unitgroup_Type=1').success(function (data) {
        //    $scope.UnitMasterList = data;
        //});

        $scope.query = "";
        /* Filter the master list function.*/
        $scope.StandardFilterlist = function () {
            var searchstring = $scope.query.toLowerCase();
            if ($scope.query == "") {
                $scope.ProtocolParametersList = angular.copy($scope.ResultListFiltered);
            }
            else {
                $scope.ProtocolParametersList = $ff($scope.ResultListFiltered, function (value, index) {
                    var UnitsList_Name = "";

                    if ($ff($scope.UnitMasterList, function (unititem, unitindex) {
                        return unititem.Units_ID == $scope.Units_ID[value.Id];
                    })[0]) {
                        UnitsList_Name = $ff($scope.UnitMasterList, function (unititem, unitindex) {
                            return unititem.Units_ID == $scope.Units_ID[value.Id];
                        })[0].Units_Name
                    }
                    return (value.Name.toLowerCase()).match(searchstring) ||
                        (UnitsList_Name.toLowerCase()).match(searchstring)
                });
            }
        };

        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.ChatSettings_ViewEdit = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                // $scope.UnitGroupType = UnitGroupType;
                $http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=0&Unitgroup_Type=' + $scope.UnitGroupType + '&Institution_Id=' + $scope.InstituteId).then(function (response) {
                    $scope.UnitMasterList = response.data;
                    $http.get(baseUrl + '/api/ParameterSettings/ProtocolParameterMasterList/').then(function (data1) {
                        $scope.ProtocolParametersList = data1.data;
                        $scope.ResultListFiltered = $scope.ProtocolParametersList;
                        $http.get(baseUrl + 'api/ParameterSettings/ViewEditProtocolParameters/?Id=' + $scope.InstituteId + '&Unitgroup_Type=' + $scope.UnitGroupType).then(function (response) {
                            $scope.ViewParamList = response.data;
                            $("#chatLoaderPV").hide();
                            angular.forEach($scope.ProtocolParametersList, function (masterVal, masterInd) {
                                $scope.ViewParamList1 = $ff($scope.ViewParamList, { Parameter_ID: masterVal.Id }, true)[0];
                                if ($scope.ViewParamList1 != undefined) {

                                    $scope.Units_ID[masterVal.Id] = $scope.ViewParamList1.Units_ID == null ? "0" : $scope.ViewParamList1.Units_ID.toString();
                                    if ($scope.IsEdit == false) {
                                        $scope.Units_Name[masterVal.Id] = $scope.ViewParamList1.Units_Name == null ? "" : $scope.ViewParamList1.Units_Name.toString();
                                    }
                                    $scope.Diagnostic_Flag[masterVal.Id] = $scope.ViewParamList1.Diagnostic_Flag == null ? true : $scope.ViewParamList1.Diagnostic_Flag;
                                    $scope.Compliance_Flag[masterVal.Id] = $scope.ViewParamList1.Compliance_Flag == null ? true : $scope.ViewParamList1.Compliance_Flag;
                                    $scope.Max_Possible[masterVal.Id] = $scope.ViewParamList1.Max_Possible == null ? "" : parseFloat($scope.ViewParamList1.Max_Possible).toFixed(2);
                                    $scope.Min_Possible[masterVal.Id] = $scope.ViewParamList1.Min_Possible == null ? "" : parseFloat($scope.ViewParamList1.Min_Possible).toFixed(2);
                                    $scope.NormalRange_High[masterVal.Id] = $scope.ViewParamList1.NormalRange_High == null ? "" : parseFloat($scope.ViewParamList1.NormalRange_High).toFixed(2);
                                    $scope.NormalRange_low[masterVal.Id] = $scope.ViewParamList1.NormalRange_low == null ? "" : parseFloat($scope.ViewParamList1.NormalRange_low).toFixed(2);
                                    $scope.Average[masterVal.Id] = $scope.ViewParamList1.Average == null ? "" : parseFloat($scope.ViewParamList1.Average).toFixed(2);
                                    $scope.Remarks[masterVal.Id] = $scope.ViewParamList1.Remarks == null ? "" : $scope.ViewParamList1.Remarks;
                                }
                                else {
                                    $scope.Units_ID[masterVal.Id] = "0";
                                    $scope.Diagnostic_Flag[masterVal.Id] = true;
                                    $scope.Compliance_Flag[masterVal.Id] = true;
                                    $scope.Max_Possible[masterVal.Id] = "";
                                    $scope.Min_Possible[masterVal.Id] = "";
                                    $scope.NormalRange_High[masterVal.Id] = "";
                                    $scope.NormalRange_low[masterVal.Id] = "";
                                    $scope.Average[masterVal.Id] = "";
                                    $scope.Remarks[masterVal.Id] = "";
                                }
                            });

                        }, function errorCallback(response) {
                            $("#chatLoaderPV").hide();
                            $scope.error = "An error has occcurred while viewing standard parameter Details!" + response.data;
                            alert($scope.error);
                        });
                    }, function errorCallback(data1) {
                    });
                }, function errorCallback(response) {
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.User_Id = $window.localStorage['UserId'];
        $scope.UnitsParameterdata = [];
        /* THIS IS FOR ADD/EDIT PROCEDURE */

        $scope.StandardParameter_AddEdit = function () {
            $scope.SaveUnitGroupPreference();
            $scope.UnitsParameterdata = [];
            if ($scope.ParameterSettings_Validations() == true) {
                $("#chatLoaderPV").show();
                $('#save').attr("disabled", true);
                angular.forEach($scope.ProtocolParametersList, function (value, index) {
                    var obj = {
                        Id: $scope.Id,
                        Institution_ID: $scope.InstituteId,
                        //   User_Id: $scope.User_Id,
                        Parameter_ID: value.Id,
                        Units_ID: $scope.Units_ID[value.Id] == 0 ? null : $scope.Units_ID[value.Id],
                        Diagnostic_Flag: $scope.Diagnostic_Flag[value.Id] == null ? false : $scope.Diagnostic_Flag[value.Id],
                        Compliance_Flag: $scope.Compliance_Flag[value.Id] == null ? false : $scope.Compliance_Flag[value.Id],
                        Max_Possible: $scope.Max_Possible[value.Id] == null ? "" : parseFloat($scope.Max_Possible[value.Id]).toFixed(2),
                        Min_Possible: $scope.Min_Possible[value.Id] == null ? "" : parseFloat($scope.Min_Possible[value.Id]).toFixed(2),
                        NormalRange_High: $scope.NormalRange_High[value.Id] == null ? "" : parseFloat($scope.NormalRange_High[value.Id]).toFixed(2),
                        NormalRange_low: $scope.NormalRange_low[value.Id] == null ? "" : parseFloat($scope.NormalRange_low[value.Id]).toFixed(2),
                        Average: $scope.Average[value.Id] == null ? "" : parseFloat($scope.Average[value.Id]).toFixed(2),
                        Remarks: $scope.Remarks[value.Id] == null ? "" : $scope.Remarks[value.Id],
                    }
                    $scope.UnitsParameterdata.push(obj);
                });

                angular.forEach($scope.UnitsParameterdata, function (value, index) {
                    if (value.Units_ID == undefined) {
                        value.Units_ID = null;
                    }
                })

                $http.post(baseUrl + '/api/ParameterSettings/ParameterSettings_AddEdit/', $scope.UnitsParameterdata).then(function (response) {
                    $("#chatLoaderPV").hide();
                    //alert("Standard parameter saved successfully");
                    toastr.success("Standard parameter saved successfully", "success");
                    $('#save').attr("disabled", false);
                    $scope.ChatSettings_ViewEdit();
                    $scope.IsEdit = false;
                    //$location.path("/ParameterSettings");
                }, function errorCallback(response) {
                });
            }
        };

        $scope.IsEdit = false;
        $scope.StandardParameterEdit = function () {
            $scope.IsEdit = true;
            $scope.ChatSettings_ViewEdit();
        }
        $scope.IsEdit = false;
        $scope.StandardParameterCancel = function () {
            $scope.ChatSettings_ViewEdit();
            $scope.IsEdit = false;
            // $location.path("/ParameterSettings");
        }
    }
]);