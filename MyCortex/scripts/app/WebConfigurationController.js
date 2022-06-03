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
        $scope.UserTypeId = parseInt($window.localStorage["UserTypeId"]);
        $scope.Institution_Id = $window.localStorage["InstitutionId"];

        $scope.IsEdit = false;
        $scope.status = 0;
        $http.get(baseUrl + '/api/Common/InstitutionNameList/?status=' + $scope.status).success(function (data) {
            $scope.InstitutiondetailsListTemp = [];
            $scope.InstitutiondetailsListTemp = data;
            $scope.InstitutiondetailsListTemp = data;
            var obj = { "Id": -1, "Name": "Default", "IsActive": 1 };
            $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
            //$scope.InstitutiondetailsListTemp.push(obj);
            $scope.InstitutiondetailsList = angular.copy($scope.InstitutiondetailsListTemp);
        });
        $scope.WebConfigEdit = function () {
            $scope.IsEdit = true;
            $scope.ChronicEdit();
        }

        $scope.WebConfigCancel = function () {
            $scope.WebConfigurationList();
            //$scope.ChronicEdit();
            $scope.IsEdit = false;
        }

        $scope.Ins_WebConfigCancel = function () {
            $scope.InstituteGetDetails($scope.Institution_Id);
            //$scope.ChronicEdit();
            $scope.IsEdit = false;
        }

        
        $scope.ChronicEdit = function () {
            var EditChronicEdit = [];
            var EditChronicId = "";
            angular.forEach($scope.rowCollectionWebConfiguration, function (SplitChronic, Id) {
                //if (SplitChronic["CONFIGVALUE"] != "" && SplitChronic["CONFIGCODE"] == "LIVEDATA_STARTFROM") {
                //    if (SplitChronic["CONFIGVALUE"] > 2) {
                //        //$('#livedatastartfrom1').attr('checked','checked');
                //        angular.element('#livedatastartfrom1').attr('checked', 'checked');
                //    }
                //}
                if (SplitChronic["CONFIGVALUE"] != "" && SplitChronic["CONFIGCODE"] == "CHRONIC CODE") {
                    var ConfigListValue = $scope.Config_value[SplitChronic["ID"]];
                    EditChronicId = SplitChronic["ID"];
                    var SplitChronic = ConfigListValue.split(',');
                    for (var a = 0; a < SplitChronic.length; a++) {
                        if (SplitChronic.length > 0) {
                            var option = SplitChronic[a];
                            if (option != "") {
                                if (option == "CL") {                                   
                                    EditChronicEdit.push(option);
                                    var status = $('#chkCL').is(":checked");
                                    if (status == false) {
                                        
                                    }                                    
                                }
                                if (option == "CG") {
                                    
                                    EditChronicEdit.push(option);
                                    var status = $('#chkCG').is(":checked");
                                    if (status == false) {
                                        
                                    }
                                    
                                }
                                if (option == "CC") {
                                   
                                    EditChronicEdit.push(option);
                                    var status = $('#chkCC').is(":checked");
                                    if (status == false) {
                                       
                                    }
                                   
                                }
                                if (option == "SC") {                                    
                                    EditChronicEdit.push(option);
                                    var status = $('#chkSC').is(":checked");
                                    if (status == false) {
                                      
                                    }                                    
                                }
                            }
                        }
                    }
                    $scope.Config_value[EditChronicId] = EditChronicEdit;
                }
            });
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
        //$scope.EditChronicList = [];
        $scope.InstituteGetDetails = function (Institution_Id) {
            $scope.emptydataWebConfiguration = [];
            $scope.rowCollectionWebConfiguration = [];
            if (Institution_Id != "0" && typeof (Institution_Id != "undefined") && Institution_Id != "" && Institution_Id != 0) {
                $scope.Institution_Id = Institution_Id;
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/WebConfiguration/InsWebConfiguration_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + Institution_Id
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
                    angular.forEach($scope.rowCollectionWebConfiguration, function (masterVal, masterInd) {
                        $scope.Config_value[masterVal.ID] = masterVal.CONFIGVALUE;
                    });
                });
                $("#chatLoaderPV").hide();
            }
            
        }
         
        $scope.WebConfigurationList = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 1) {
                $("#chatLoaderPV").show();
                var inst_id = "";
                if ($window.localStorage['UserTypeId'] == 1) {
                    inst_id = $scope.Institution_Id;
                }
                if ($window.localStorage['UserTypeId'] == 3) {
                    inst_id = $window.localStorage["InstitutionId"];
                }
                $scope.emptydataWebConfiguration = [];
                $scope.rowCollectionWebConfiguration = [];

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }

                $http.get(baseUrl + '/api/WebConfiguration/WebConfiguration_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + inst_id
                ).success(function (data) {
                    $scope.emptydataWebConfiguration = [];
                    $scope.rowCollectionWebConfiguration = [];
                    $scope.rowCollectionWebConfiguration = data;
                    //angular.forEach(data.CHRONIC_CODE, function (value, Index) {
                    //    $scope.EditChronicList.push(value.CONFIGVALUE);
                    //});
                    //$scope.SelectedChronic = $scope.EditChronicList;
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
                        if (masterVal.CONFIGCODE == "LIVEDATA_STARTFROM") {
                            if (masterVal.CONFIGVALUE != 2 || masterVal.CONFIGVALUE==1) {
                                //$('#livedatastartfrom1').attr('checked', 'checked');
                                $scope.Config_value[masterVal.ID] = "1";
                               // angular.element('#livedatastartfrom1').attr('checked', 'checked');
                            }
                        }
                        if (masterVal.CONFIGCODE == "AUTO_SIGNUP_APPROVAL") {
                            if (masterVal.CONFIGVALUE ==null || masterVal.CONFIGVALUE =='') {
                                //$('#livedatastartfrom1').attr('checked', 'checked');
                                $scope.Config_value[masterVal.ID] = 'Active';
                                // angular.element('#livedatastartfrom1').attr('checked', 'checked');
                            }
                        }
                       /* if (masterVal.CONFIGVALUE != "" && masterVal.CONFIGCODE == "CHRONIC CODE") {
                            var ConfigListValue = $scope.Config_value[masterVal.ID];
                            EditChronicId = masterVal.ID;
                            var SplitChronic = ConfigListValue.split(',');
                            for (var a = 0; a < SplitChronic.length; a++) {
                                if (SplitChronic.length > 0) {
                                    var option = SplitChronic[a];
                                    if (option != "") {
                                        if (option == "CL") {

                                            $("#chkCL").prop("checked", 'true');                                            
                                        }
                                        else if (option == "CG") {
                                            $("#chkCG").prop("checked", 'true');
                                        }
                                        else if (option == "CC") {                                            
                                            $("#chkCC").prop("checked", 'true');
                                        }
                                        else if (option == "SC") {
                                            $("#chkSC").prop("checked", 'true');
                                        }
                                    }
                                }
                            }
                        }*/
                    });                  
                    $scope.ChronicEdit();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
               /* $http.get(baseUrl + '/api/WebConfiguration/ChronicCodeList/').success(function (data) {
                    $scope.ChronicCodeList = data;
                });*/
            }
            else {
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
                if ($window.localStorage['UserTypeId'] == 3) {
                    $scope.WebConfigurationList();
                }
                if ($window.localStorage['UserTypeId'] == 1) {
                    $scope.InstituteGetDetails($scope.Institution_Id);
                }
                //$scope.WebConfigurationList();
                $scope.ClearWebConfigurationPopUp();
                $scope.searchqueryWebConfiguration = "";
                $("#chatLoaderPV").hide();
            }).error(function (data) {
                $scope.error = "An error has occurred while deleting Parameter" + data;
            });

        };

        var CHRONIC_CODE = "";
        $scope.WebConfigurationDetails = [];
        $scope.Configuration_AddEdit_Validations = function () {
            var CheckTrue = "";
            angular.forEach($scope.rowCollectionWebConfiguration, function (value, index) {
                if ($scope.rowCollectionWebConfiguration[index]["CONFIGCODE"] == "PATIENT_MIN_AGE") {
                    var id = value.CONFIGCODE;
                    var patientAge = document.getElementById(id).value;
                    if (patientAge == "0" || patientAge == 0) {
                        CheckTrue = 1;
                    } 
                }
                if ($scope.rowCollectionWebConfiguration[index]["CONFIGCODE"] == "PROFILE_PICTURE") {
                    var id = value.CONFIGCODE;
                    var profilepicture = document.getElementById(id).value;
                    if (profilepicture > 5242880) {
                        CheckTrue = 2;
                    }
                }
                if ($scope.rowCollectionWebConfiguration[index]["CONFIGCODE"] == "User.defaultPassword") {
                    var id = value.CONFIGCODE;
                    var UserDefaultPassword	 = document.getElementById(id).value;
                    if (UserDefaultPassword == "0" || UserDefaultPassword	 == "") {
                        CheckTrue = 3;
                    }
                }
            });
            if (CheckTrue == 1) {
                toastr.info("PATIENT_MIN_AGE Config Value Is Below 1 Year", "info");
                $('#save').attr("disabled", false);
                return false
            } else if (CheckTrue == 2) {
                toastr.info("PROFILE_PICTURE Config Value is less than or equal to 5MB(5242880)", "info");                
                $('#save').attr("disabled", false);
                return false
            }
            else if (CheckTrue == 3) {
                toastr.info("Please Enter Password", "info");
                $('#save').attr("disabled", false);
            }
            else {
                return true
            }
        }
        $scope.Configuration_AddEdit = function () {
            $("#chatLoaderPV").show();
            if ($scope.Configuration_AddEdit_Validations() == true) {
                angular.forEach($scope.rowCollectionWebConfiguration, function (value, index) {
                    //var obj = {
                    //    Id: value.ID,
                    //    INSTITUTION_ID: value.INSTITUTION_ID, //$scope.INSTITUTION_ID,
                    //    CONFIGVALUE: $scope.Config_value[value.ID] == 0 || $scope.Config_value[value.ID] == "" ? '' : $scope.Config_value[value.ID],
                    //}
                    //$('#save').attr("disabled", true);
                    //$scope.WebConfigurationDetails.push(obj);

                    /*if (index = 32) {
                        obj = {
                            Id: value.ID,
                            INSTITUTION_ID: value.INSTITUTION_ID,
                            CONFIGVALUE: CHRONIC_CODE == 0 || CHRONIC_CODE == "" ? '' : CHRONIC_CODE,
                        }
                    }
                    else {
                        obj = {
                            Id: value.ID,
                            INSTITUTION_ID: value.INSTITUTION_ID,
                            CONFIGVALUE: $scope.Config_value[value.ID] == 0 || $scope.Config_value[value.ID] == "" ? '' : $scope.Config_value[value.ID],
                        }
                    }*/

                    var obj = "";
                    if ($scope.rowCollectionWebConfiguration[index]["CONFIGCODE"] == "CHRONIC CODE") {
                        obj = {
                            Id: value.ID,
                            INSTITUTION_ID: value.INSTITUTION_ID,
                            CONFIGVALUE: CHRONIC_CODE == 0 || CHRONIC_CODE == "" ? '' : CHRONIC_CODE,
                        }
                    } 
                    else {
                        obj = {
                            Id: value.ID,
                            INSTITUTION_ID: value.INSTITUTION_ID,
                            CONFIGVALUE: $scope.Config_value[value.ID] == 0 || $scope.Config_value[value.ID] == "" ? '' : $scope.Config_value[value.ID],
                        }
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
                    /*$scope.WebConfigurationList();*/
                    if ($window.localStorage['UserTypeId'] == 3) {
                        $scope.WebConfigurationList();
                    }
                    if ($window.localStorage['UserTypeId'] == 1) {
                        $scope.InstituteGetDetails($scope.Institution_Id);
                    }
                    $scope.IsEdit = false;
                    //$location.path("/ParameterSettings");
                });
            }
            $("#chatLoaderPV").hide();
        };
/*
        $scope.insSubChronicChange = function () {
            //alert($scope.Chroniccc);
            if ($scope.Chroniccc == false && $scope.Chroniccg == false && $scope.Chroniccl == false && $scope.Chronicsc == false) {
                $('#divInssChronicEdit').removeClass("ng-valid");
                $('#divInssChronicEdit').addClass("ng-invalid");
            }
            else {
                $('#divInssChronicEdit').removeClass("ng-invalid");
                $('#divInssChronicEdit').addClass("ng-valid");
            }
        }*/

        
        //$scope.onChangeChronic = function () {
            CHRONIC_CODE = "";
            //var ConfigValue = $scope.rowCollectionWebConfiguration["32"]["CONFIGVALUE"];
            /*var ConfigValue = $scope.Config_value[$scope.Config_value.length - 1];*/
            //var ConfigRowId = $scope.Config_value.length - 1;
            //angular.forEach($scope.Config_value[ConfigRowId], function (ID, index) {
            //    if ($scope.Config_value[ConfigRowId].length == 1) {
            //        CHRONIC_CODE = ID.toString();
            //    }
            //    else if (CHRONIC_CODE != "" || $scope.Config_value[ConfigRowId].length > 1) {
            //        CHRONIC_CODE = CHRONIC_CODE + ID + ',';

            //    }
            //});

            //var CHRONIC_CODE = "";
            //angular.forEach($scope.Config_value[row.ID], function (Chronic_Id, index) {
            //    if ($scope.Config_value[row.ID].length == 1) {
            //        CHRONIC_CODE = Chronic_Id.toString();
            //    }
            //    else if (CHRONIC_CODE != "" || $scope.Config_value[row.ID].length > 1) {
            //        CHRONIC_CODE = CHRONIC_CODE + Chronic_Id + ',';

            //    }
            //});
        //}


/*
        $scope.chronicChange = function (index) {
            if ($scope.Chroniccc == true)
                CHRONIC_CODE="
        }*/

       /*$scope.onChangeChronic = function () {
            var SelectedINSTITUTION_ID = "";
            angular.forEach($scope.SelectedConfig_value, function (Id, index) {
                if ($scope.SelectedConfig_value.length == 0) {
                    SelectedINSTITUTION_ID = Id.toString();
                }
                else if (SelectedINSTITUTION_ID != "" || $scope.SelectedConfig_value.length > 0) {
                    SelectedINSTITUTION_ID = SelectedINSTITUTION_ID + Id + ',';

                }
            });
        }*/

        $scope.onChangeChronic = function (ID, ConfigRowId) {
            CHRONIC_CODE = "";
            //var ConfigValue = $scope.rowCollectionWebConfiguration["31"]["CONFIGVALUE"];
            /*var ConfigValue = $scope.Config_value[$scope.Config_value.length - 1];*/
            //var ConfigRowId = $scope.Config_value.length - 1;
            angular.forEach($scope.Config_value[ConfigRowId], function (ID, index) {
                if ($scope.Config_value[ConfigRowId].length == 1) {
                    CHRONIC_CODE = ID.toString();
                }
                else if (CHRONIC_CODE != "" || $scope.Config_value[ConfigRowId].length > 1) {
                    CHRONIC_CODE = CHRONIC_CODE + ID + ',';

                }
            });

            //var CHRONIC_CODE = "";
            //angular.forEach($scope.Config_value[row.ID], function (Chronic_Id, index) {
            //    if ($scope.Config_value[row.ID].length == 1) {
            //        CHRONIC_CODE = Chronic_Id.toString();
            //    }
            //    else if (CHRONIC_CODE != "" || $scope.Config_value[row.ID].length > 1) {
            //        CHRONIC_CODE = CHRONIC_CODE + Chronic_Id + ',';

            //    }
            //});
        }

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