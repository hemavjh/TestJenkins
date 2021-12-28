﻿var MyHomecontroller = angular.module("MyHomeController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


MyHomecontroller.controller("MyHomeController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        $scope.IsActive = true;
        $scope.currentTab = "1";
        $scope.TabName = "";
        $scope.RefId = "";
        $scope.Model = "";
        $scope.OS = "";
        $scope.current_page = 1;
        $scope.current_MyHomepage = 1;
        $scope.total_page = 1;
        $scope.total_MyHomepage = 1;
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.LanguageText = [];
        $scope.DevicesListid = "0";
        $scope.DevicesListid = [];
        $scope.InstitutionLanguageList = [];
        $scope.SelectedTabUser = "0";
        $scope.SelectedDevice = "0";
        $scope.SelectedTabPIN = "0";
        $scope.DevicesLists = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.CREATED_BY = $window.localStorage['UserId'];
        $scope.IsEdit = false;
        $scope.IsShow = false;
        $scope.showSave = true;
        $scope.View = 2;
        $scope.MyHomeRow = "-1";
        $scope.HomeId = "0";
        $scope.UserLists = [];
        $scope.MyHomeflag = "0";
        $scope.DeviceId = "0";
        $scope.MyDeviceflag = "0";
        $scope.ISact = 1;
        $scope.PIN = "1234";

        //$http.get(baseUrl + '/api/Common/Deviceslist/').success(function (data) {
        //    $scope.DevicesLists = data;
        //});
        $http.get(baseUrl + '/api/MyHome/Device_List/?IsActive=' + $scope.ISact + '&InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.DevicesLists = data.TabDeviceList;
        });
        //$http.get(baseUrl + '/api/Common/UserList/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
        //    $scope.UserLists = data;
        //});
        $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + 2 + '&InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.UserLists = data;
        });


        $scope.checkTab = function () {
            if (typeof ($scope.TabName) != "undefined" && $scope.TabName != "") {
                $scope.currentTab = 3;
            }
            //else if ($scope.row.Id != "" ) {
            //    $scope.currentTab = 3;
            //}
            else
                $scope.currentTab = 1;
        }

        $scope.onCategoryChange = function () {
            $scope.DeviceId = $scope.DeviceName;
        }
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddTabPopUP = function () {
            $scope.submitted = false;
            $scope.currentTab = "1";
            //$scope.ClearPopup(); 
            $scope.TabName = "";
            $scope.RefId = "";
            $scope.Model = "";
            $scope.OS = "";
            $scope.Id = "0";
            $scope.PIN = "1234";
            $scope.SelectedDevice = "0";
            $('#savemytab').attr("disabled", false);
            $('#tabname').prop('disabled', false);
            $('#refidtab').prop('disabled', false);
            $('#modeltab').prop('disabled', false);
            $('#ostab').prop('disabled', false);
            $('#pintab').prop('disabled', false);
            $('#Image2').prop('disabled', false);
            $('#Image2').prop('title', 'Click to Delete');
            $('#tabdevice').prop('disabled', false);
            $scope.IsEdit = false;
            $scope.IsShow = true;
            $scope.AddUserParameters = [{
                'Id': 0,
                'UserId': 0,
                'PIN': $scope.PIN,
                'IsActive': true
            }];
            $scope.AddDeviceParameters = [{
                'Id': 0,
                'DeviceId': 0,
                'IsActive': true
            }];
            $scope.showSave = true;
            var $sel2 = $('#tabdevice');
            $sel2.multiselect('enable');
            angular.element('#TabAddModal').modal('show');
        }
        $scope.ClearPopUp = function () {
            $scope.TabName = "";
            $scope.RefId = "";
            $scope.Model = "";
            $scope.OS = "";
            $scope.Id = "0";
            $scope.SelectedDevice = "0";
            $scope.InstitutionId = "";
            $scope.CancelPopup();
        }

        $scope.CancelTabPopUP = function () {
            $scope.Id = 0;
            // $scope.AppoinmentSlotClear();
            angular.element('#TabAddModal').modal('hide');
            angular.element('#TabViewModal').modal('hide');

        }
        $scope.CancelPopup = function () {
            angular.element('#TabAddModal').modal('hide');
        }
        $scope.Cancel_MYTAB = function () {
            $scope.currentTab = "1";
            $location.path("/Hive");
            $scope.ClearPopUp();
        }

        $scope.Cancel_MYTABView = function () {
            angular.element('#TabViewModal').modal('hide');
        }


        $scope.setMyHomePage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else {
                $scope.inputPageNo = PageNo;
            }
            $scope.current_MyHomepage = PageNo;
            $scope.TabList();

        }
        /*THIS IS FOR LIST FUNCTION*/
        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.TabList = function () {
            $("#chatLoaderPV").show();
            $scope.emptydataTab = [];
            $scope.rowCollectionTab = [];
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_MyHomepage - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_MyHomepage * $scope.page_size;

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }

                $http.get(baseUrl + '/api/MyHome/Tab_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    $("#chatLoaderPV").hide();
                    if (data != null && data !== undefined) {
                        $scope.emptydataTab = [];
                        $scope.rowCollectionTab = [];
                        $scope.rowCollectionTab = data;
                        if ($scope.rowCollectionTab.length > 0) {
                            $scope.TabDataCount = $scope.rowCollectionTab[0].TotalRecord;
                        } else {
                            $scope.TabDataCount = 0;
                        }
                        $scope.TabData_ListFilterdata = data;
                        $scope.rowCollectionTabFilter = angular.copy($scope.rowCollectionTab);
                        if ($scope.rowCollectionTabFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                    }
                    $scope.total_MyHomepage = Math.ceil(($scope.TabDataCount) / ($scope.page_size));


                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            })

        }

        $scope.searchquery = "";
        /* FILTER THE  MyHome  LIST FUNCTION.*/
        $scope.filterTabList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionTabFilter = angular.copy($scope.rowCollectionTab);
            }
            else {
                $scope.rowCollectionTabFilter = $ff($scope.rowCollectionTab, function (value) {
                    return angular.lowercase(value.RefId).match(searchstring) ||
                        angular.lowercase(value.TabName).match(searchstring) ||
                        angular.lowercase(value.OS).match(searchstring) ||
                        angular.lowercase(value.Model).match(searchstring)
                });
                $scope.total_MyHomepage = Math.ceil(($scope.rowCollectionTabFilter) / ($scope.page_size));
            }
        }

        /* THIS IS OPENING POP WINDOW VIEW */
        $scope.ViewMYTABPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.currentTab = "1";
            $('#tabname').prop('disabled', true);
            $('#refidtab').prop('disabled', true);
            $('#modeltab').prop('disabled', true);
            $('#ostab').prop('disabled', true);
            $('#pintab').prop('disabled', true);
            $('#Image2').prop('disabled', true);
            $('#Image2').prop('title', 'Disable the Delete Icon');
            $('#tabdevice').prop('disabled', true);
            $('#tabdevice3').prop('disabled', true);
            $('#MyHomeUserList *').attr('disabled', 'disabled');
            $("#MyHomeUserTable *").attr("disabled", "disabled").off('click');
            $("#MyHomeDeviceTable *").attr("disabled", "disabled").off('click');
            $('.myhomedropdown *').attr("disabled", "disabled").off('click');
            $scope.showSave = false;
            //$scope.IsEdit = true;
            $scope.IsShow = false;
            var $sel2 = $('#tabdevice');
            $sel2.multiselect('disable');
            var $sel3 = $('#tabdeviceview');
            $sel3.multiselect('disable');
            $scope.ViewMyTab();
            angular.element('#TabViewModal').modal('show');
        }
        /* THIS IS CANCEL VIEW POPUP FUNCTION  */
        $scope.CancelViewPopup = function () {
            angular.element('#TabAddModal').modal('hide');
        }

        /* THIS IS FOR VIEW PROCEDURE */
        $scope.ViewMyTab = function () {
            $("#chatLoaderPV").show();
            $scope.SelectedDevice = [];
            $scope.EditSelectedDevice = [];
            $scope.SelectedTabUser = [];
            $scope.EditSelectedTABUser = [];
            $scope.SelectedTabPIN = [];
            $scope.EditSelectedTABPIN = [];
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }

            $http.get(baseUrl + '/api/MyHome/Tab_ListView/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = data.Id;
                $scope.TabName = data.TabName;
                $scope.RefId = data.RefId;
                $scope.Model = data.Model;
                $scope.OS = data.OS;
                $scope.AddUserParameters = data.UserList;
                angular.forEach(data.UserList, function (value, index) {
                    $scope.EditSelectedTABUser.push(value.ID);
                    $scope.SelectedTabUser = $scope.EditSelectedTABUser;
                });
                if ($scope.AddUserParameters.length > 0) {
                    $scope.MyHomeflag = 1;
                }
                else {
                    $scope.MyHomeflag = 0;
                }
                $scope.AddDeviceParameters = data.SelectedTabDeviceList;
                if ($scope.AddDeviceParameters.length > 0) {
                    $scope.MyDeviceflag = 1;
                }
                else {
                    $scope.MyDeviceflag = 0;
                }
                /*angular.forEach(data.SelectedTabDeviceList, function (value, index) {
                    $scope.EditSelectedDevice.push(value.Id);
                    $scope.SelectedDevice = $scope.EditSelectedDevice;
                });*/

                //$scope.UserPinValidation($scope.SelectedTabPIN);
            });
        }

        /* THIS IS FOR DELETE FUNCTION*/
        $scope.DeleteMYTAB = function (DId) {
            $scope.Id = DId;
            $scope.MyTAB_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.MyTAB_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected My Home details?',
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
                    $http.get(baseUrl + '/api/MyHome/Tab_List_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert(" My Home details has been deactivated Successfully");
                        toastr.success(" My Home details has been deactivated Successfully", "success");
                        $scope.TabList();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  My Home details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected My Home details?");
            if (del == true) {
                $http.get(baseUrl + '/api/MyHome/Tab_List_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert(" My Home details has been deactivated Successfully");
                    toastr.success(" My Home details has been deactivated Successfully", "success");
                    $scope.TabList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  My Home details" + data;
                });
            }*/
        };

        $scope.DeleteMYTABDeactive = function (DId) {
            $scope.Id = DId;
            $scope.MyTAB_DeleteDeactive();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.MyTAB_DeleteDeactive = function () {
            Swal.fire({
                title: 'Do you like to activate the selected My Home details?',
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
                    $http.get(baseUrl + '/api/MyHome/Tab_List_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert(" My Home details has been  Activated Successfully");
                        toastr.success(" My Home details has been  Activated Successfully", "success");
                        $scope.TabList();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  My Home details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
          /*  var del = confirm("Do you like to activate the selected My Home details?");
            if (del == true) {
                $http.get(baseUrl + '/api/MyHome/Tab_List_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert(" My Home details has been  Activated Successfully");
                    toastr.success(" My Home details has been  Activated Successfully", "success");
                    $scope.TabList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  My Home details" + data;
                });
            }*/
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

        /* THIS IS EDIT POPUP FUNCTION */
        $scope.EditMYTABPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.Editid = CatId;
            $scope.currentTab = "1";
            $('#savemytab').attr("disabled", false);
            $('#tabname').prop('disabled', false);
            $('#refidtab').prop('disabled', false);
            $('#modeltab').prop('disabled', false);
            $('#ostab').prop('disabled', false);
            $('#userlisttab').prop('disabled', false);
            $('#pintab').prop('disabled', false);
            $('#Image2').prop('disabled', false);
            $('#Image2').prop('title', 'Click to Delete');
            $('#tabdevice').prop('disabled', false);
            $('#MyHomeUserList *').removeAttr("disabled");
            $("#MyHomeUserTable *").removeAttr("disabled");
            $('.myhomedropdown').removeAttr("disabled");
            $('#MyHomeDeviceList *').removeAttr("disabled");
            $("#MyHomeDeviceTable *").removeAttr("disabled");
            $('.myhomedevicedropdown').removeAttr("disabled");
            $('#Image3').prop('disabled', false);
            $('#Image3').prop('title', 'Click to Delete');
            $scope.showSave = true;
            $scope.IsEdit = true;
            $scope.IsShow = true;
            $scope.ViewMyTab();
            angular.element('#TabAddModal').modal('show');
        }

        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }
        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            if (typeof ($scope.TabName) == "undefined" || $scope.TabName == "") {
                //alert("Please enter Tab Name");
                toastr.warning("Please enter Tab Name", "warning");
                return false;
            }
            //else if (typeof ($scope.RefId) == "undefined" || $scope.RefId == "") {
            //    //alert("Please enter Ref Id");
            //    toastr.warning("Please enter Ref Id", "warning");
            //    return false;
            //}
            /*else if (typeof ($scope.Category_ID) == "undefined" || $scope.Category_ID == "0") {
                alert("Please select Category");
                return false;
            }*/
            return true;
        };



        $scope.MyHomeRow = "-1";
        // Add row concept for Patient Vital Parameters
        $scope.AddUserParameters = [{
            'Id': $scope.HomeId,
            'UserId': $scope.UserId,
            'PIN': $scope.PIN,
            'IsActive': true
        }];


        /*This is a Addrow function to add new row and save  */
        $scope.MyHomeAdd = function () {
            if ($scope.MyHomeRow >= 0) {
                var obj = {
                    'Id': $scope.HomeId,
                    'UserId': $scope.UserId,
                    'PIN': $scope.PIN,
                    'IsActive': true
                }
                $scope.AddUserParameters[$scope.MyHomeRow] = obj;
            }
            else {
                $scope.AddUserParameters.push({
                    'Id': $scope.HomeId,
                    'UserId': $scope.UserId,
                    'PIN': $scope.PIN,
                    'IsActive': true
                })
            }
        };

        $scope.PinChange = function (PinId, rowIndex, UserId) {
            //alert('Set', PinId, rowIndex);
            var obj = {
                InstitutionId: $window.localStorage['InstitutionId'],
                TabId: $scope.Id,
                UserId: UserId,
                PIN: $scope.PIN,
                IsTemp: 1
            }
            $("#chatLoaderPV").show();
            $http.post(baseUrl + '/api/MyHome/Tab_User_Pin_Update/', obj).success(function (data) {
                if (data.ReturnFlag == 1) {
                    toastr.success("User Pin Is" + "(" + $scope.PIN + ")" + "Updated Successfully", "success");
                    $("#chatLoaderPV").hide();
                }
                else {
                    toastr.info(data.Message, "info");
                    $("#chatLoaderPV").hide();
                }
            });
        };

        $scope.MyHomeDelete = function (Delete_Id, rowIndex) {

            Swal.fire({
                title: 'Do you like to delete this My Home Id Details?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    var Previous_MyHomeItem = [];
                    if ($scope.Id == 0) {
                        angular.forEach($scope.AddUserParameters, function (selectedPre, index) {
                            if (index != rowIndex)
                                Previous_MyHomeItem.push(selectedPre);
                        });
                        $scope.AddUserParameters = Previous_MyHomeItem;
                    } else if ($scope.Id > 0) {
                        angular.forEach($scope.AddUserParameters, function (selectedPre, index) {
                            if (selectedPre.ID == Delete_Id) {
                                selectedPre.IsActive = false;
                            }
                        });
                        if ($ff($scope.AddUserParameters, { IsActive: true }).length > 0) {
                            $scope.MyHomeflag = 1;
                        }
                        else {
                            $scope.MyHomeflag = 0;
                        }
                    }
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })

            //var del = confirm("Do you like to delete this My Home Id Details?");
            //if (del == true) {
            //    var Previous_MyHomeItem = [];
            //    if ($scope.Id == 0) {
            //        angular.forEach($scope.AddUserParameters, function (selectedPre, index) {
            //            if (index != rowIndex)
            //                Previous_MyHomeItem.push(selectedPre);
            //        });
            //        $scope.AddUserParameters = Previous_MyHomeItem;
            //    } else if ($scope.Id > 0) {
            //        angular.forEach($scope.AddUserParameters, function (selectedPre, index) {
            //            if (selectedPre.ID == Delete_Id) {
            //                selectedPre.IsActive = false;
            //            }
            //        });
            //        if ($ff($scope.AddUserParameters, { IsActive: true }).length > 0) {
            //            $scope.MyHomeflag = 1;
            //        }
            //        else {
            //            $scope.MyHomeflag = 0;
            //        }
            //    }
            //}
        };

        $scope.MyDeviceRow = "-1";
        $scope.AddDeviceParameters = [{
            'Id': $scope.DeviceId,
            'DeviceId': $scope.Id
        }];
        $scope.MyDeviceAdd = function () {
            if ($scope.MyDeviceRow >= 0) {
                var obj = {
                    'Id': $scope.DeviceId,
                    'DeviceId': $scope.Id,
                    'IsActive': true
                }
                $scope.AddDeviceParameters[$scope.MyDeviceRow] = obj;
            }
            else {
                $scope.AddDeviceParameters.push({
                    'Id': $scope.DeviceId,
                    'DeviceId': $scope.Id,
                    'IsActive': true
                })
            }
        };

        $scope.MyDeviceDelete = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this My Home Device Details?");
            if (del == true) {
                var Previous_MyDeviceItem = [];
                if ($scope.Id == 0) {
                    angular.forEach($scope.AddDeviceParameters, function (selectedPre, index) {
                        if (index != rowIndex)
                            Previous_MyDeviceItem.push(selectedPre);
                    });
                    $scope.AddDeviceParameters = Previous_MyDeviceItem;
                } else if ($scope.Id > 0) {
                    angular.forEach($scope.AddDeviceParameters, function (selectedPre, index) {
                        if (selectedPre.Id == Delete_Id) {
                            selectedPre.IsActive = false;
                        }
                    });
                    if ($ff($scope.AddDeviceParameters, { IsActive: true }).length > 0) {
                        $scope.MyDeviceflag = 1;
                    }
                    else {
                        $scope.MyDeviceflag = 0;
                    }
                }
            }
        };


        $scope.MYTAB_InsertUpdate_validation = function () {
            var TSDuplicate = 0;
            var UserEmpty = 0;
            var DuplicateUserId = '';
            angular.forEach($scope.AddUserParameters, function (value1, index1) {
                angular.forEach($scope.AddUserParameters, function (value2, index2) {
                    if (index1 > index2 && value1.UserId == value2.UserId) {
                        TSDuplicate = 1;
                        DuplicateUserId = DuplicateUserId + ' ' + value2.UserId + ',';
                    };
                });
            });
            angular.forEach($ff($scope.AddUserParameters, { IsActive: true }), function (valuser) {
                if (valuser.UserId == undefined && valuser.PIN == undefined) {
                    UserEmpty = 1;
                }
            });
            if (TSDuplicate == 1) {
                //alert('User Name already exist, cannot be Duplicated');
                toastr.info("User Name already exist, cannot be Duplicated", "info");
                return false;
            }
            if (UserEmpty == 1) {
                //alert('Data missing in user info tab');
                toastr.warning("User Name already exist, cannot be Duplicated", "warning");
                return false;
            }
            var DuplicateDevice = 0;
            var DeviceEmpty = 0;
            var DuplicateDeviceId = '';
            angular.forEach($scope.AddDeviceParameters, function (value1, index1) {
                angular.forEach($scope.AddDeviceParameters, function (value2, index2) {
                    if (index1 > index2 && value1.Id == value2.Id) {
                        DuplicateDevice = 1;
                        DuplicateDeviceId = DuplicateDeviceId + ' ' + value2.DeviceName + ',';
                    };
                    /*if (index1)*/
                });
            });
            angular.forEach($ff($scope.AddDeviceParameters, { IsActive: true }), function (valdevice) {
                if (valdevice.Id == "0") {
                    DeviceEmpty = 1;
                }
            });
            if (DuplicateDevice == 1) {
                //alert('Device already exist, cannot be Duplicated');
                toastr.info("Device already exist, cannot be Duplicated", "info");
                return false;
            }
            if (DeviceEmpty == 1) {
                //alert('Data missing in Device tab');
                toastr.warning("Data missing in Device tab", "warning");
                return false;
            }


            return true;
        }

        $scope.MYTAB_InsertUpdate = function () {
            if ($scope.Validationcontrols() == true) {
                if ($scope.MYTAB_InsertUpdate_validation() == true) {
                    $("#chatLoaderPV").show();
                    angular.forEach($ff($scope.AddUserParameters, { IsActive: true }), function (value, index) {
                        return value.UserId != '';
                    });
                    var DevicesListid = $ff($scope.DevicesLists, function (value) {
                        return value.ID != '';
                    });
                    $scope.UserTabDetails_List = [];
                    angular.forEach($scope.SelectedTabUser, function (value, index) {
                        var obj = {
                            Id: 0,
                            Id: value
                        }
                        $scope.UserTabDetails_List.push(obj);
                    });

                    $scope.UserDeviceDetails_List = [];
                    angular.forEach($ff($scope.AddDeviceParameters, { IsActive: true }), function (value, index) {
                        var obj = {
                            Id: 0,
                            DeviceId: value.Id
                        }
                        $scope.UserDeviceDetails_List.push(obj);
                    });


                    var obj = {
                        ID: $scope.Id,
                        TabName: $scope.TabName,
                        RefId: $scope.RefId,
                        Model: $scope.Model,
                        OS: $scope.OS,
                        InstitutionId: $window.localStorage['InstitutionId'],
                        CreatedBy: $scope.CREATED_BY,
                        UserList: $scope.AddUserParameters,
                        DevicesList: $scope.DevicesLists,
                        SelectedTabDeviceList: $scope.UserDeviceDetails_List
                    };
                    $('#savemytab').attr("disabled", true);
                    $http.post(baseUrl + '/api/MyHome/Tab_InsertUpdate/', obj).success(function (data) {
                        $("#chatLoaderPV").hide();
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        $('#savemytab').attr("disabled", false);
                        $scope.TabList();
                        $scope.Cancel_MYTAB();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Parameter" + data;
                    });

                }
            }
        }

        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.setPage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else
                $scope.inputPageNo = PageNo;

            $scope.current_page = PageNo;
            $scope.DeviceList();
        }
        /* Device List */
        $scope.DeviceList = function () {
            $("#chatLoaderPV").show();
            $scope.emptydataDevice = [];
            $scope.rowCollectionDevice = [];
            $scope.EditDevice = [];
            $scope.DevicesLists = [];
            $scope.DeviceType = [];
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_page * $scope.page_size;

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }
                $http.get(baseUrl + '/api/MyHome/Device_List/?IsActive=' + $scope.ISact + '&InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.emptydataDevice = data.TabDeviceList;
                    $scope.rowCollectionDevice = [];
                    $scope.rowCollectionDevice = data.TabDeviceList;
                    if ($scope.rowCollectionDevice.length > 0) {
                        $scope.DeviceDataCount = $scope.rowCollectionDevice[0].TotalRecord;
                    } else {
                        $scope.TabDataCount = 0;
                    }

                    angular.forEach(data.TabDeviceList, function (value, index) {
                        $scope.EditDevice.push(value.ID);
                        $scope.DeviceType = $scope.EditDevice;
                    });
                    $scope.DeviceData_ListFilterdata = data.TabDeviceList;
                    $scope.rowCollectionDeviceFilter = angular.copy($scope.rowCollectionDevice);
                    if ($scope.rowCollectionDeviceFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }

                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                });
            });
        }

        $scope.DeviceDropDown = function () {
            $("#chatLoaderPV").show();
            $scope.AllDeviceNameList = [];
            //$http.get(baseUrl + '/api/Common/Deviceslist/').success(function (data) {
            $scope.AllDevice = [
                {
                    ID: 1,
                    DeviceTypeName: "Wearable"
                },
                {
                    ID: 2,
                    DeviceTypeName: "Medical Device"
                }
            ];
            //});
            $http.get(baseUrl + '/api/MyHome/DeviceName_List/?IsActive=' + 1).success(function (data1) {
                $scope.AllDeviceNameList = data1.TabDeviceList;
            });

            $http.get(baseUrl + '/api/Protocol/ParameterNameList/?InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.ParameterTypeList = data;
            });
        };

    /*    $scope.DeviceChange = function () {

            var DeviceChange = document.getElementById('DeviceName').value;
            if (DeviceChange != "") {
                $('#divDeviceNameChange').removeClass("ng-invalid");
                $('#divDeviceNameChange').addClass("ng-valid");
            }
            else {
                $('#divDeviceNameChange').removeClass("ng-valid");
                $('#divDeviceNameChange').addClass("ng-invalid");
            }
        }


        $scope.DeviceTypeChange = function () {

            var DeviceTypeChange = document.getElementById('DeviceType').value;
            if (DeviceTypeChange != "") {
                $('#divDeviceType').removeClass("ng-invalid");
                $('#divDeviceType').addClass("ng-valid");
            }
            else {
                $('#divDeviceType').removeClass("ng-valid");
                $('#divDeviceType').addClass("ng-invalid");
            }
        }

        $scope.DeviceParameter = function () {

            var DeviceParameter = document.getElementById('Parameter').value;
            if (DeviceParameter != "") {
                $('#divDeviceParameter').removeClass("ng-invalid");
                $('#divDeviceParameter').addClass("ng-valid");
            }
            else {
                $('#divDeviceParameter').removeClass("ng-valid");
                $('#divDeviceParameter').addClass("ng-invalid");
            }
        }
*/
    


        $scope.AddDevicePopUP = function () {
            $scope.submitted = false;
            $scope.Id = 0;
            $scope.CancelDeviceList();
            $('#btnsave').attr("disabled", false);
            $('#DeviceId').prop('disabled', false);
            $('#DeviceName').prop('disabled', false);
            $('#DeviceType').prop('disabled', false);
            $('#DeviceMake').prop('disabled', false);
            $('#DeviceModel').prop('disabled', false);
            $('#Parameter').prop('disabled', false);
            $scope.showSave = true;
            var $sel2 = $('#Parameter');
            $sel2.multiselect('enable');
            $scope.showSave = true;
            $scope.DeviceDropDown();

            angular.element('#DeviceAddModal').modal('show');
        }

        $scope.EditDevicePopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.Editid = CatId;
            $scope.CancelDeviceList();
            $('#btnsave').attr("disabled", false);
            $('#DeviceId').prop('disabled', false);
            $('#DeviceName').prop('disabled', false);
            $('#DeviceType').prop('disabled', false);
            $('#DeviceMake').prop('disabled', false);
            $('#DeviceModel').prop('disabled', false);
            $('#Parameter').prop('disabled', false);
            $scope.showSave = true;
            var $sel2 = $('#Parameter');
            $sel2.multiselect('enable');
            $scope.DeviceDropDown();
            $scope.ViewDevice();
            angular.element('#DeviceAddModal').modal('show');
        }

        /* THIS IS OPENING POP WINDOW VIEW */
        $scope.ViewDevicePopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.CancelDeviceList();
            $('#DeviceId').prop('disabled', true);
            $('#DeviceName').prop('disabled', true);
            $('#DeviceType').prop('disabled', true);
            $('#DeviceMake').prop('disabled', true);
            $('#DeviceModel').prop('disabled', true);
            $('#Parameter').prop('disabled', true);
            $scope.showSave = false;
            var $sel2 = $('#Parameter');
            $sel2.multiselect('disable');
            $scope.DeviceDropDown();
            $scope.ViewDevice();
            angular.element('#DeviceAddModal').modal('show');
        }

        /* THIS IS FOR VIEW DEVICE*/
        $scope.ViewDevice = function () {
            $("#chatLoaderPV").show();
            $scope.SelectedParamter = [];
            $scope.Editselectedparam = [];
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/MyHome/ViewDevice_List/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DeviceId = data.DeviceId;
                $scope.DeviceName = data.DeviceName;
                if (data.DeviceName == "FORA") {
                    $scope.DeviceName = "FORA P20";
                }
                if (data.DeviceName == "BLEsmart_0000011AB0495F0337C2") {
                    $scope.DeviceName = "OMRON BPM";
                }
                if (data.DeviceType == "Medical Device") {
                    $scope.DeviceType = 2;
                }
                if (data.DeviceType == "Wearable") {
                    $scope.DeviceType = 1;
                }
                if (data.DeviceName == "FORA P20") {
                    $scope.DeviceName = 1;
                }
                //$scope.DeviceType = data.DeviceTypeId;
                $scope.DeviceMake = data.Make;
                $scope.DeviceModel = data.ModelNumber;
                var pname = data.ParameterList[0].ParameterName.toString();
                if (pname.indexOf(',') >= 0) {
                    var det = data.ParameterList[0].ParameterName.split(',');
                    for (i = 0; i < det.length; i++) {
                        $scope.Editselectedparam.push(parseInt(det[i]));
                    }
                }
                $scope.SelectedParamter = $scope.Editselectedparam;
            });
        }

        /*Active the Device*/
        $scope.ReInsertDevice = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertDeviceDetails();

        };
        /* 
        Calling the api method to inactived the details of the Device List,
        and redirected to the list page.
        */
        $scope.ReInsertDeviceDetails = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Device?',
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
                    $http.get(baseUrl + '/api/MyHome/Device_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Device has been activated successfully");
                        toastr.success("Selected Device has been activated successfully", "success");
                        $("#chatLoaderPV").hide();
                        $scope.DeviceList();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ReInsertDeviceDetails" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* var Dev = confirm("Do you like to activate the selected Device?");
            if (Dev == true) {
                $http.get(baseUrl + '/api/MyHome/Device_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Device has been activated successfully");
                    toastr.success("Selected Device has been activated successfully", "success");
                    $scope.DeviceList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ReInsertDeviceDetails" + data;
                });
            };*/
        }


        /* THIS IS FOR DEACTIVATE FUNCTION*/
        $scope.DeleteDevice = function (DId) {
            $scope.Id = DId;
            $scope.Device_Delete();
        };
        /*THIS IS FOR DEACTIVE FUNCTION */
        $scope.Device_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Device?',
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
                    $http.get(baseUrl + '/api/MyHome/Device_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert(" Device details has been deactivated Successfully");
                        toastr.success(" Device details has been deactivated Successfully", "success");
                        $("#chatLoaderPV").hide();
                        $scope.DeviceList();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  Device details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Device?");
            if (del == true) {
                $http.get(baseUrl + '/api/MyHome/Device_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert(" Device details has been deactivated Successfully");
                    toastr.success(" Device details has been deactivated Successfully", "success");
                    $scope.DeviceList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  Device details" + data;
                });
            }*/
        };

        $scope.CancelDeviceList = function () {
            $scope.DeviceId = "";
            $scope.DeviceName = "";
            $scope.DeviceType = "";
            $scope.DeviceMake = "";
            $scope.DeviceModel = "";
            $scope.SelectedParamter = "0";
            angular.element('#DeviceAddModal').modal('hide');
        }

        $scope.Device_InsertUpdate = function () {
            if ($scope.DeviceValidationcontrols() == true) {
                //if ($scope.Device_InsertUpdate_validation() == true) {
                $("#chatLoaderPV").show();
                //var filteredObj = $ff($scope.AddUserParameters, function (value) {
                //    return value.ID != '';
                //});
                //var DevicesListid = $ff($scope.DevicesLists, function (value) {
                //    return value.ID != '';
                //});
                //var devicetypechange = $scope.DeviceType.toString();
                angular.forEach($scope.AllDeviceNameList, function (value, index) {
                    if (value.ID == $scope.DeviceName) {
                        $scope.DeviceName = value.DeviceName
                    }
                });
                angular.forEach($scope.AllDevice, function (value, index) {
                    if (value.ID == $scope.DeviceType) {
                        $scope.DeviceType = value.DeviceTypeName
                    }
                });
                angular.forEach($scope.AllDeviceNameList, function (value, index) {
                    /* if (value.ID == $scope.DeviceName) {
                         $scope.DeviceName = value.DeviceName
                     }*/
                    if (value.DeviceId == $scope.DeviceName) {
                        $scope.DeviceName = value.DeviceName
                    }
                });

                $scope.ParameterDetails_List = [];
                angular.forEach($scope.SelectedParamter, function (value, index) {
                    var obj = {
                        //ID: 0,
                        Id: value,
                        IsActive: 1
                    }
                    $scope.ParameterDetails_List.push(obj);
                });

                var obj = {
                    ID: $scope.Id,
                    InstitutionId: $window.localStorage['InstitutionId'],
                    DeviceId: $scope.DeviceId,
                    DeviceName: $scope.DeviceName,
                    DeviceType: $scope.DeviceType,
                    Make: $scope.DeviceMake,
                    ModelNumber: $scope.DeviceModel,
                    ParameterList: $scope.ParameterTypeList,
                    SelectedDeviceParameterList: $scope.ParameterDetails_List,
                    CreatedBy: $window.localStorage['UserId'],
                };
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/MyHome/AddDeviceInsertUpdate/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    $('#btnsave').attr("disabled", false);
                    $scope.DeviceList();
                    $scope.CancelDeviceList();

                }).error(function (data) {
                    $scope.error = "An error has occurred while Addeing Device" + data;
                });

                //}
            }
        }

        /* THIS IS FOR DEVICE ADD EDIT VALIDATION CONTROL */
        $scope.DeviceValidationcontrols = function () {
            if (typeof ($scope.DeviceId) == "undefined" || $scope.DeviceId == "") {
                //alert("Please enter Device Id");
                toastr.warning("Please enter Device Id", "warning");
                return false;
            }
            else if (typeof ($scope.DeviceName) == "undefined" || $scope.DeviceName == "" || $scope.DeviceName == null) {
                //alert("Please Select Device Name");
                toastr.warning("Please enter Device Id", "warning");
                return false;
            }
            else if (typeof ($scope.DeviceMake) == "undefined" || $scope.DeviceMake == "") {
                //alert("Please enter DeviceMake");
                toastr.warning("Please enter DeviceMake", "warning");
                return false;
            }
            else if (typeof ($scope.DeviceModel) == "undefined" || $scope.DeviceModel == "") {
                //alert("Please enter DeviceModel");
                toastr.warning("Please enter DeviceModel", "warning");
                return false;
            }
            else if (typeof ($scope.DeviceType) == "undefined" || $scope.DeviceType == "" || $scope.DeviceType == "0" || $scope.DeviceType == null) {
                //alert("Please Select DeviceType");
                toastr.warning("Please Select DeviceType", "warning");
                return false;
            }
            else if (typeof ($scope.SelectedParamter) == "undefined" || $scope.SelectedParamter == "" || $scope.SelectedParamter == "0") {
                //alert("Please Select Parameter");
                toastr.warning("Please Select Parameter", "warning");
                return false;
            }

            return true;
        };

    }
]);