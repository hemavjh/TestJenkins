var MyHomecontroller = angular.module("MyHomeController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


MyHomecontroller.controller("MyHomeController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        $scope.IsActive = true;
        $scope.Is_Active = true;
        $scope.currentTab = "1";
        $scope.TabName = "";
        $scope.RefId = "";
        $scope.Model = "";
        $scope.OS = "";
        $scope.current_page = 1;
        $scope.current_MyHomepage = 1;
        $scope.total_page = 1;
        $scope.total_MyHomepage = 1;
        $scope.total_Devicepage = 1;
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.LanguageText = [];
        $scope.DevicesListid = "0";
        $scope.DevicesListid = [];
        $scope.InstitutionLanguageList = [];
        $scope.SelectedTabUser = "0";
        $scope.SelectedDevice = "0";
        $scope.SelectedTabPIN = "0";
        $scope.InstitutionDeviceList = [];
        $scope.Devicepage_size = $window.localStorage['Pagesize'];
        $scope.Devicepage_size1 = $window.localStorage['Pagesize'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.CREATED_BY = $window.localStorage['UserId'];
        $scope.UserTypeId = parseInt($window.localStorage["UserTypeId"]);
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.IsEdit = false;
        $scope.IsShow = false;
        $scope.showSave = true;
        $scope.IsMaster = 0;
        $scope.EditDeviceType = "";
        $scope.View = 2;
        $scope.MyHomeRow = "-1";
        $scope.HomeId = "0";
        $scope.UserLists = [];
        $scope.MyHomeflag = "0";
        $scope.DeviceId = "0";
        $scope.MyDeviceflag = "0";
        $scope.ISact = 1;
        $scope.PIN = "1234";
        $scope.DisplayView = '';
        $scope.DeviceNameAdmin = "";
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        //$http.get(baseUrl + '/api/Common/Deviceslist/').success(function (data) {
        //    $scope.DevicesLists = data;
        //});
        /*$scope.InstitutionDeviceList = [];
        $http.get(baseUrl + '/api/MyHome/DeviceInstitutionList/?Institution_Id=' + $window.localStorage['InstitutionId']
        ).success(function (data) {
            $scope.InstitutionDeviceList = [];
            $scope.InstitutionDeviceList = data;
        });*/
        /* if ($location.$$path == "/Hive") {
             $http.get(baseUrl + '/api/MyHome/Device_List/?IsActive=' + $scope.ISact + '&InstitutionId=' + $window.localStorage['InstitutionId'] + '&HiveType=' + 1).success(function (data) {
                 $scope.DevicesLists = data.TabDeviceList;
             });
         } else {
             $http.get(baseUrl + '/api/MyHome/Device_List/?IsActive=' + $scope.ISact + '&InstitutionId=' + $window.localStorage['InstitutionId'] + '&HiveType=' + 2).success(function (data) {
                 $scope.DevicesLists = data.TabDeviceList;
             });
         }*/
        //$http.get(baseUrl + '/api/Common/UserList/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
        //    $scope.UserLists = data;
        //});
        if ($location.$$path == "/Hive") {
            $scope.IsMaster = 0;
            $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + 2 + '&InstitutionId=' + $window.localStorage['InstitutionId'] + '&IS_MASTER=' + $scope.IsMaster).success(function (data) {
                $scope.UserLists = data;
            });
        } else {
            $http.get(baseUrl + '/api/User/UserDetails_List/?Id=' + 2 + '&InstitutionId=' + $window.localStorage['InstitutionId'] + '&IsActive=' + 1 + '&Login_Session_Id=' + $scope.LoginSessionId + '&UserType_Id=' + $scope.UserTypeId).success(function (data) {
                $scope.UserLists = data;
            });
        }


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
            //$scope.DeviceId = $scope.DeviceName;
        }
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddTabPopUP = function (HiveType = 1) {
            if (HiveType == 1 && $scope.No_Of_Hive <= 0) {
                toastr.warning("You don't have Hive subscription!", "warning");
            } else if (HiveType == 1 && $scope.Remaining_No_Of_Hive == 0) {
                toastr.warning("Your Hive subscription limit is exceeded!", "warning");
            } else if (HiveType == 2 && $scope.No_Of_HiveChart <= 0) {
                toastr.warning("You don't have Hive Chart subscription!", "warning");
            } else if (HiveType == 2 && $scope.Remaining_No_Of_Hivechart == 0) {
                toastr.warning("Your Hive Chart subscription limit is exceeded!", "warning");
            } else {
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
                $scope.AddUserParameters = [];
                $scope.AddDeviceParameters = [];
                //$scope.AddUserParameters = [{
                //    'Id': 0,
                //    'UserId': 0,
                //    'PIN': $scope.PIN,
                //    'IsActive': true
                //}];
                //$scope.AddDeviceParameters = [{
                //    'Id': 0,
                //    'DeviceId': 0,
                //    'IsActive': true
                //}];
                $scope.showSave = true;
                var $sel2 = $('#tabdevice');
                $sel2.multiselect('enable');
                angular.element('#TabAddModal').modal('show');
                $scope.DeviceList(1);
            }
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
            $scope.DeviceEmpty = true;
            angular.element('#TabAddModal').modal('hide');
        }
        $scope.Cancel_MYTAB = function () {
            $scope.currentTab = "1";
            $scope.DeviceEmpty = true;
            $scope.UserInfoEmpty = true;
            //$location.path("/Hive");
            //$location.path("/HiveChart");
            $scope.ClearPopUp();
        }

        $scope.Cancel_MYTABView = function () {
            angular.element('#TabViewModal').modal('hide');
        }


        $scope.setMyHomePage = function (PageNo, HiveChart = 1) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else {
                $scope.inputPageNo = PageNo;
            }
            $scope.current_MyHomepage = PageNo;
            $scope.TabList(HiveChart);

        }
        /*THIS IS FOR LIST FUNCTION*/
        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];

        $scope.TabList = function (HiveType = 1) {
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
                $scope.HiveUsersCount = 0;
                $http.get(baseUrl + '/api/MyHome/Tab_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd + '&HiveType=' + HiveType).success(function (data) {
                    if (data != null && data !== undefined) {
                        $scope.emptydataTab = [];
                        $scope.rowCollectionTab = [];
                        $scope.rowCollectionTab = data;

                        $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            if (data != null && data !== undefined) {
                                $scope.Remaining_No_Of_Hive = data.Remaining_No_Of_Hive;
                                $scope.No_Of_Hive = data.No_Of_Hive;
                                $scope.Remaining_No_Of_Hivechart = data.Remaining_No_Of_Hivechart;
                                $scope.No_Of_HiveChart = data.No_Of_HiveChart;

                                $scope.No_Of_HiveChart_User = data.No_Of_HiveChartUsers;
                                $scope.No_Of_Hive_User = data.No_Of_HiveUsers;
                                /*$scope.No_Of_HiveChart_Devices = data.No_Of_HiveChartDevices;
                                $scope.No_Of_Hive_Devices = data.No_Of_HiveDevices;*/
                                $scope.Remaining_No_Of_Hive_Users = data.Remaining_No_Of_Hive_Users;
                                $scope.Remaining_No_Of_Hivechart_Users = data.Remaining_No_Of_Hivechart_Users;
                                /* $scope.Remaining_No_Of_Hive_Devices = data.Remaining_No_Of_Hive_Devices;
                                 $scope.Remaining_No_Of_Hivechart_Devices = data.Remaining_No_Of_Hivechart_Devices;*/
                                //if ($scope.rowCollectionTab.length > 0) {
                                //    angular.forEach($scope.rowCollectionTab, function (value, index) {
                                //        $scope.UsersCount = $scope.UsersCount + value.UsersCount;
                                //    });
                                //}
                                ////get the pending users count
                                //$scope.PendingUsersCount = $scope.Remaining_No_Of_Hive_Users;
                                $("#chatLoaderPV").hide();
                            } else {
                                $("#chatLoaderPV").hide();
                            }

                        });

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
                    } else {
                        $("#chatLoaderPV").hide();
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
            $scope.DeviceList(1);
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
        $scope.DeleteMYTAB = function (DId, HiveChart = 1) {
            $scope.Id = DId;
            $scope.MyTAB_Delete(HiveChart);
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.MyTAB_Delete = function (HiveChart) {
            Swal.fire({
                title: HiveChart == 1 ? 'Are you sure, you want to deactivate the selected Hive?' : 'Are you sure, you want to deactivate the selected Hive Chart?',
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
                        //alert("Hive details has been deactivated Successfully");
                        toastr.success(HiveChart == 1 ? "Hive deactivated Successfully" : "Hive Chart deactivated Successfully", "success");
                        $scope.TabList(HiveChart);
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Hive" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Hive details?");
            if (del == true) {
                $http.get(baseUrl + '/api/MyHome/Tab_List_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert("Hive details has been deactivated Successfully");
                    toastr.success("Hive details has been deactivated Successfully", "success");
                    $scope.TabList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Hive details" + data;
                });
            }*/
        };

        $scope.DeleteMYTABDeactive = function (DId, HiveChart = 1) {
            $scope.Id = DId;
            $scope.MyTAB_DeleteDeactive(HiveChart);
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.MyTAB_DeleteDeactive = function (HiveChart) {
            Swal.fire({
                title: HiveChart == 1 ? 'Are you sure, you want to activate the selected Hive?' : 'Are you sure, you want to activate the selected Hive Chart?',
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
                        //alert("Hive details has been  Activated Successfully");
                        toastr.success(HiveChart == 1 ? "Hive activated successfully" : "Hive Chart activated successfully", "success");
                        $scope.TabList(HiveChart);
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Hive" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*  var del = confirm("Do you like to activate the selected Hive details?");
              if (del == true) {
                  $http.get(baseUrl + '/api/MyHome/Tab_List_Delete/?Id=' + $scope.Id).success(function (data) {
                      //alert("Hive details has been  Activated Successfully");
                      toastr.success("Hive details has been  Activated Successfully", "success");
                      $scope.TabList();
                  }).error(function (data) {
                      $scope.error = "An error has occurred while deleting Hive details" + data;
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
            $scope.DeviceList(1);
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
            'ID': $scope.HomeId,
            'UserId': $scope.UserId,
            'PIN': $scope.PIN,
            'IsActive': true
        }];

        $scope.ChangeUserInfo = function (UserId) {
            console.log(UserId);
            if (UserId != null) {
                $scope.UserInfoEmpty = true;
            }
            else {
                $scope.UserInfoEmpty = false;
            }
        }
        $scope.UserInfoEmpty = true;
        /*This is a Addrow function to add new row and save  */
        $scope.MyHomeAdd = function () {
            var TSDuplicate = 0;
            var UserinfoAdd = 0;
            if ($scope.UserInfoEmpty == true) {
                $scope.UserInfoEmpty = false;
            } else {
                toastr.warning("Please Select in User Info Tab", "Warning");
                return false;
            }
            
            angular.forEach($scope.AddUserParameters, function (value1, index1) {
                angular.forEach($scope.AddUserParameters, function (value2, index2) {
                    if (index1 > index2 && value1.UserId == value2.UserId && (value1.IsActive == true && value2.IsActive == true)) {
                        TSDuplicate = 1;
                    };
                });
            });

            if (TSDuplicate == 1) {
                toastr.info("User Name already exist, cannot be Duplicated", "info");
                UserinfoAdd = 1;
                $scope.UserInfoEmpty = true;
                return false;
            }

            if ($scope.MyHomeRow >= 0) {
                if (UserinfoAdd == 0) {
                    var obj = {
                        'ID': $scope.HomeId,
                        'UserId': $scope.UserId,
                        'PIN': $scope.PIN,
                        'IsActive': true
                    }
                    $scope.AddUserParameters[$scope.MyHomeRow] = obj;
                }

            }
            else {
                $scope.AddUserParameters.push({
                    'ID': $scope.HomeId,
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

        $scope.MyHomeDelete = function (Delete_Id, rowIndex, UserId) {
            $scope.UserInfoEmpty = true;
            Swal.fire({
                title: 'Do you like to delete this Hive Id Details?',
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
                    $scope.$apply(() => {
                        var Previous_MyHomeItem = [];
                        if ($scope.Id == 0) {
                            angular.forEach($scope.AddUserParameters, function (selectedPre, index) {
                                if (index != rowIndex)
                                    Previous_MyHomeItem.push(selectedPre);
                            });
                            $scope.AddUserParameters = Previous_MyHomeItem;
                        } else if ($scope.Id > 0) {
                            angular.forEach($scope.AddUserParameters, function (selectedPre, index) {
                                //if (selectedPre.ID == Delete_Id) {
                                //    selectedPre.IsActive = false;
                                //    //$scope.AddUserParameters.splice(rowIndex, 1);
                                //}
                                if (index == rowIndex) {
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
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })

            //var del = confirm("Do you like to delete this Hive Id Details?");
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
        /*$scope.AddDeviceParameters = [{
            'Id': $scope.DeviceId,
            'DeviceId': $scope.Id
        }];*/
        $scope.ChangeDevice = function (Id) {
            console.log(Id);
            if (Id != null) {
                $scope.DeviceEmpty = true;
            }
            else {
                $scope.DeviceEmpty = false;
            }
        }
        $scope.DeviceEmpty = true;
        $scope.MyDeviceAdd = function () {
            $scope.DuplicateDevice = 0;
            var deviceadd = 0;
            if ($scope.DeviceEmpty == true) {
                $scope.DeviceEmpty = false;
                
            }else {
                toastr.warning("Please Select Device Info Tab", "Warning");
                
                return false;
            }

           

            angular.forEach($scope.AddDeviceParameters, function (value1, index1) {
                angular.forEach($scope.AddDeviceParameters, function (value2, index2) {
                    if (index1 > index2 && value1.Id == value2.Id && (value1.IsActive == true && value2.IsActive == true)) {
                        $scope.DuplicateDevice = 1;
                    };
                });
            });

            if ($scope.DuplicateDevice == 1) {
                toastr.info("Device already exist, cannot be Duplicated", "info");
                deviceadd = 1;
                $scope.DeviceEmpty = true;
                return false;
            }
            if ($scope.MyDeviceRow >= 0) {
                if (deviceadd == 0) {

                    var obj = {
                        'Id': 0,
                        'DeviceId': 0,
                        'DeviceName': '',
                        'TabId': null,
                        'UserId': null,
                        'IsActive': true
                    }
                    $scope.AddDeviceParameters[$scope.MyDeviceRow] = obj;
                }
            }
            else {
                $scope.AddDeviceParameters.push({
                    'Id': 0,
                    'DeviceId': 0,
                    'DeviceName': '',
                    'TabId': null,
                    'UserId': null,
                    'IsActive': true
                })
            }
            
        };

        $scope.MyDeviceDelete = function (Delete_Id, rowIndex) {
            $scope.DeviceEmpty = true;
            Swal.fire({
                title: 'Do you like to delete this Hive Device Details?',
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
                    $scope.$apply(() => {
                        var Previous_MyDeviceItem = [];
                        if ($scope.Id == 0) {
                            angular.forEach($scope.AddDeviceParameters, function (selectedPre, index) {
                                if (index != rowIndex)
                                    Previous_MyDeviceItem.push(selectedPre);
                            });
                            $scope.AddDeviceParameters = Previous_MyDeviceItem;
                        } else if ($scope.Id > 0) {
                            angular.forEach($scope.AddDeviceParameters, function (selectedPre, index) {
                                //if (selectedPre.Id == Delete_Id) {
                                //    selectedPre.IsActive = false;
                                //}
                                if (index == rowIndex)
                                    selectedPre.IsActive = false;
                            });
                            if ($ff($scope.AddDeviceParameters, { IsActive: true }).length > 0) {
                                $scope.MyDeviceflag = 1;
                            }
                            else {
                                $scope.MyDeviceflag = 0;
                            }
                        }
                    });

                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            });
        };
        /*var del = confirm("Do you like to delete this Hive Device Details?");
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
        }*/



        $scope.MYTAB_InsertUpdate_validation = function () {
            var TSDuplicate = 0;
            var UserEmpty = 0;
            var DuplicateUserId = '';
            angular.forEach($scope.AddUserParameters, function (value1, index1) {
                angular.forEach($scope.AddUserParameters, function (value2, index2) {
                    if (index1 > index2 && value1.UserId == value2.UserId && (value1.IsActive == true && value2.IsActive == true)) {
                        TSDuplicate = 1;
                        DuplicateUserId = DuplicateUserId + ' ' + value2.UserId + ',';
                    };
                    if (value1.UserId == undefined && value1.ID == "0")
                        value1.IsActive = false;

                    if (value2.UserId == undefined && value2.ID == "0")
                        value2.IsActive = false;
                });
            });
            angular.forEach($ff($scope.AddUserParameters, { IsActive: true }), function (valuser) {
                if (valuser.UserId == undefined && valuser.PIN == undefined) {
                    UserEmpty = 1;
                }
                if (valuser.UserId == undefined && (valuser.ID == "0" || valuser.ID == 0))
                    valuser.IsActive = false;
            });
            //if ($scope.AddUserParameters.length > 0) {
            //    $scope.CurrentUsersCount = $scope.AddUserParameters.length;
            //}
            //if ($scope.CurrentUsersCount > $scope.PendingUsersCount) {
            //    toastr.info("No. of users count exceeded from allocated users count", "info");
            //    return false;
            //}
            if (TSDuplicate == 1) {
                //alert('User Name already exist, cannot be Duplicated');
                toastr.warning("User Name already exist, cannot be Duplicated", "info");
                return false;
            }
            if (UserEmpty == 1) {
                //alert('Data missing in user info tab');
                toastr.warning("Data missing in user info tab", "warning");
                return false;
            }
            var DuplicateDevice = 0;
            var DeviceEmpty = 0;
            var DuplicateDeviceId = '';
            angular.forEach($scope.AddDeviceParameters, function (value1, index1) {
                angular.forEach($scope.AddDeviceParameters, function (value2, index2) {
                    if (index1 > index2 && value1.Id == value2.Id && (value1.IsActive == true && value2.IsActive == true)) {
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
                toastr.warning("Device already exist, cannot be Duplicated", "info");
                return false;
            }
            if (DeviceEmpty == 1) {
                //alert('Data missing in Device tab');
                toastr.warning("Data missing in Device tab", "warning");
                return false;
            }

            return true;
        }

        $scope.MYTAB_InsertUpdate = function (HiveType = 1) {
            if ($scope.Validationcontrols() == true) {
                if ($scope.MYTAB_InsertUpdate_validation() == true) {
                    $("#chatLoaderPV").show();

                    angular.forEach($ff($scope.AddUserParameters, { IsActive: true }), function (value, index) {
                        return value.UserId != '';
                    });
                    angular.forEach($ff($scope.InstitutionDeviceList, { IsActive: true }), function (value, index) {
                        return value.Id != '';
                    });
                    /* var DevicesListid = $ff($scope.DevicesLists, function (value) {
                         return value.ID != '';
                     });*/
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
                            DeviceId: value.Id,
                            DeviceName: value.DeviceName
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
                        /*DevicesList: $scope.DevicesLists,*/
                        DevicesList: $scope.AddDeviceParameters,
                        SelectedTabDeviceList: $scope.UserDeviceDetails_List,
                        HiveType: HiveType
                    };
                    $('#savemytab').attr("disabled", true);
                    $http.post(baseUrl + '/api/MyHome/Tab_Insert_Update/', obj).success(function (data) {
                        $("#chatLoaderPV").hide();
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.warning(data.Message, "warning");
                        }
                        $('#savemytab').attr("disabled", false);
                        $scope.TabList(HiveType);
                        $scope.Cancel_MYTAB();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Parameter" + data;
                    });

                }
            }
        }

        //$scope.rembemberCurrentPage = function (p) {
        //    $scope.current_page = p
        //}
        //$scope.setPage = function (PageNo) {
        //    if (PageNo == 0) {
        //        PageNo = $scope.inputPageNo;
        //    }
        //    else
        //        $scope.inputPageNo = PageNo;

        //    $scope.current_page = PageNo;
        //    $scope.DeviceList();
        //}
        /* Device List */
        //$scope.DeviceList = function (HiveType = 1) {
        //    $("#chatLoaderPV").show();
        //    $scope.emptydataDevice = [];
        //    $scope.rowCollectionDevice = [];
        //    $scope.EditDevice = [];
        //    $scope.DevicesLists = [];
        //    $scope.DeviceType = [];
        //    $scope.ConfigCode = "PATIENTPAGE_COUNT";
        //    $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        //    $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
        //        $scope.page_size = data1[0].ConfigValue;
        //        $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
        //        $scope.PageEnd = $scope.current_page * $scope.page_size;

        //        $scope.ISact = 1;       // default active
        //        if ($scope.IsActive == true) {
        //            $scope.ISact = 1  //active
        //        }
        //        else if ($scope.IsActive == false) {
        //            $scope.ISact = 0 //all
        //        }
        //        $http.get(baseUrl + '/api/MyHome/DeviceName_Admin_List/?IsActive=' + $scope.ISact + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
        //            $("#chatLoaderPV").hide();
        //            $scope.emptydataDevice = data.TabDeviceList;
        //            $scope.rowCollectionDevice = [];
        //            $scope.rowCollectionDevice = data.TabDeviceList;
        //            if ($scope.rowCollectionDevice.length > 0) {
        //                $scope.TabDataCount = $scope.rowCollectionDevice[0].TotalRecord;
        //            } else {
        //                $scope.TabDataCount = 0;
        //            }

        //            angular.forEach(data.TabDeviceList, function (value, index) {
        //                $scope.EditDevice.push(value.ID);
        //                $scope.DeviceType = $scope.EditDevice;
        //            });
        //            $scope.DeviceData_ListFilterdata = data.TabDeviceList;
        //            $scope.rowCollectionDeviceFilter = angular.copy($scope.rowCollectionDevice);
        //            if ($scope.rowCollectionDeviceFilter.length > 0) {
        //                $scope.flag = 1;
        //            }
        //            else {
        //                $scope.flag = 0;
        //            }

        //            $scope.total_Devicepage = Math.ceil(($scope.TabDataCount) / ($scope.page_size));
        //            $("#chatLoaderPV").hide();
        //        }).error(function (data) {
        //            $scope.error = "AN error has occured while Listing the records!" + data;
        //        });
        //    });
        //}

        $scope.DeviceList = function (HiveType = 1) {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage["UserTypeId"] == 1) {
                $("#chatLoaderPV").show();
                $scope.ISact = 1;       // default active

                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }
                $http.get(baseUrl + '/api/MyHome/DeviceInstitutionList/?Institution_Id=' + $window.localStorage['InstitutionId']
                ).success(function (data) {
                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.rowCollectionDeviceFilter = [];
                    $scope.InstitutionDeviceList = [];
                    $scope.InstitutionDeviceList = data;
                    $scope.emptydataDevice = data;
                    $scope.rowCollection = data;
                    $scope.rowCollectionDeviceFilter = angular.copy($scope.rowCollection);
                    if ($scope.rowCollectionDeviceFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
            


        $scope.searchquery = "";
        /* FILTER THE  MyHome  LIST FUNCTION.*/
        $scope.filterDeviceListed = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionDeviceFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionDeviceFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.DeviceName).match(searchstring) ||
                        angular.lowercase(value.DeviceType).match(searchstring) ||
                        angular.lowercase(value.Make).match(searchstring) ||
                        angular.lowercase(value.ModelNumber).match(searchstring)
                        
                });
            }
            $scope.emptydataDevice = $scope.rowCollectionTabFilter;
        }

        $scope.DeviceDropDown = function () {
            $("#chatLoaderPV").show();
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
            //$scope.AllDeviceNameList = [];
            //$http.get(baseUrl + '/api/MyHome/DeviceName_List/?IsActive=' + 1).success(function (data1) {
            //    $scope.AllDeviceNameList = data1.TabDeviceList;
            //});

            $http.get(baseUrl + '/api/ParameterSettings/ProtocolParameterMasterList/').success(function (data1) {
                $("#chatLoaderPV").hide();
                $scope.ProtocolParametersList = data1;
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
            $scope.DeviceDropDown();
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
            $scope.ViewDevice();
            $scope.DisplayView = '';
            angular.element('#DeviceAddModal').modal('show');
        }

        /* THIS IS OPENING POP WINDOW VIEW */
        $scope.ViewDevicePopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.DisplayView = 'View';
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
            $scope.AllDeviceNameList = [];
            $http.get(baseUrl + '/api/MyHome/ViewDevice_List/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                //$scope.DeviceId = data.DeviceId;
                $scope.DeviceName = data.DeviceName;

                if (data.DeviceType == "Medical Device") {
                    $scope.DeviceType = 2;
                }
                if (data.DeviceType == "Wearable") {
                    $scope.DeviceType = 1;
                }
                /*if (data.DeviceName == "FORA P20") {
                    $scope.DeviceName = 1;
                }*/
                //$scope.DeviceType = data.DeviceTypeId;
                $scope.DeviceMake = data.Make;
                $scope.DeviceModel = data.ModelNumber;
                var pname = data.ParameterList[0].ParameterName.toString();

                if (pname.indexOf(',') > 0) {
                    var det = data.ParameterList[0].ParameterName.split(',');
                    if (det == 'undefined') {
                        $scope.Editselectedparam.push(parseInt(pname));
                    } else {
                        for (i = 0; i < det.length; i++) {
                            $scope.Editselectedparam.push(parseInt(det[i]));
                        }
                    }
                } else {
                    $scope.Editselectedparam.push(parseInt(pname));
                }
                $scope.SelectedParamter = $scope.Editselectedparam;

            });
        }

        /*Active the Device*/
        $scope.ReInsertDevice = function (comId, HiveType = 1) {
            $scope.Id = comId;
            $scope.ReInsertDeviceDetails(HiveType);

        };
        /* 
        Calling the api method to inactived the details of the Device List,
        and redirected to the list page.
        */
        $scope.ReInsertDeviceDetails = function (HiveType) {
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
                        $scope.DeviceList(HiveType);
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ReInsertDeviceDetails" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
        }


        /* THIS IS FOR DEACTIVATE FUNCTION*/
        $scope.DeleteDevice = function (DId, HiveType = 1) {
            $scope.Id = DId;
            $scope.Device_Delete(HiveType);
        };
        /*THIS IS FOR DEACTIVE FUNCTION */
        $scope.Device_Delete = function (HiveType) {
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
                        $scope.DeviceList(HiveType);
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  Device details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
        };
        $scope.ReInsertDeleteDeviceName = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertDeviceNameDetails();

        };
        
        $scope.ReInsertDeviceNameDetails = function () {
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
                    $http.get(baseUrl + '/api/MyHome/DeviceName_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Institution has been activated successfully");
                        toastr.success("Selected Device has been activated successfully", "success");
                        $scope.DeviceListAdmin();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ReInsertDevice" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
        }
        $scope.DeleteDeviceName = function (comId) {
            $scope.Id = comId;
            $scope.DeviceNamelist_Delete();
        };
        $scope.DeviceNamelist_Delete = function () {
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
                    $http.get(baseUrl + '/api/MyHome/DeviceName_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Institution has been deactivated Successfully");
                        toastr.success("Selected Device has been deactivated Successfully", "success");
                        $scope.DeviceListAdmin();
                    }).error(function (data) {
                        $scope.error = "AN error has occured while deleting Device!" + data;
                    });
                } else if (result.isDenied) {
                }
            })
        };
        $scope.CancelDeviceList = function () {
            $scope.DeviceId = "";
            $scope.DeviceName = "";
            $scope.DeviceNameAdmin = "";
            $scope.DeviceType = "";
            $scope.DeviceMake = "";
            $scope.DeviceModel = "";
            $scope.SelectedParamter = "0";
            angular.element('#DeviceAddModal').modal('hide');
        }
        
        $scope.ViewDeviceNameAdmin = function () {
            $("#chatLoaderPV").show();
            $scope.AllDeviceNameList = [];
            $scope.SelectedParamter = [];
            $scope.Editselectedparam = [];
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/MyHome/ViewDeviceName_List/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                //$scope.DeviceId = data.DeviceId;
                $scope.DeviceNameAdmin = data.DeviceName;
                if (data.DeviceType == "Medical Device") {
                    $scope.DeviceType = 2;
                }
                if (data.DeviceType == "Wearable") {
                    $scope.DeviceType = 1;
                }
                $scope.DeviceMake = data.Make;
                $scope.DeviceModel = data.ModelNumber;
                var pname = data.ParameterList[0].ParameterName.toString();

                if (pname.indexOf(',') > 0) {
                    var det = data.ParameterList[0].ParameterName.split(',');
                    if (det == 'undefined') {
                        $scope.Editselectedparam.push(parseInt(pname));
                    } else {
                        for (i = 0; i < det.length; i++) {
                            $scope.Editselectedparam.push(parseInt(det[i]));
                        }
                    }
                } else {
                    $scope.Editselectedparam.push(parseInt(pname));
                }
                $scope.SelectedParamter = $scope.Editselectedparam;
            });
        }
        $scope.DeviceName_Validationantrols = function () {
            if (typeof ($scope.DeviceNameAdmin) == "undefined" || $scope.DeviceNameAdmin == "" || $scope.DeviceNameAdmin == null) {
                //alert("Please Select Device Name");
                toastr.warning("Please Select Device Name", "warning");
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

        $scope.AddDeviceNamePopUP = function () {
            $scope.submitted = false;
            $scope.Id = 0;
            $('#btnsave').attr("disabled", false);
            $scope.CancelDeviceList();
            $scope.DisplayView = '';
            $('#DeviceNameAdmin').prop('disabled', false);
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
        $scope.ViewDeviceName = function (CatId) {           
            $scope.Id = CatId;
            $('#DeviceNameAdmin').prop('disabled', true);
            $('#DeviceType').prop('disabled', true);
            $('#DeviceMake').prop('disabled', true);
            $('#DeviceModel').prop('disabled', true);
            $('#Parameter').prop('disabled', true);
            var $sel2 = $('#Parameter');
            $sel2.multiselect('disable');
            $scope.showSave = false;
            $scope.showSave = false;            
            $scope.showSave = false;
            $scope.DisplayView = 'View';
            $scope.CancelDeviceList();
            $scope.DeviceDropDown();
            $scope.ViewDeviceNameAdmin();
            angular.element('#DeviceAddModal').modal('show');
        }
        $scope.EditDeviceName = function (CatId) {
            $scope.Id = CatId;
            $scope.Editid = CatId;
            $scope.DeviceDropDown();
            $scope.CancelDeviceList();
            $scope.ViewDeviceNameAdmin();
            $('#btnsave').attr("disabled", false);
            $('#DeviceNameAdmin').prop('disabled', false);
            $('#DeviceType').prop('disabled', false);
            $('#DeviceMake').prop('disabled', false);
            $('#DeviceModel').prop('disabled', false);
            $('#Parameter').prop('disabled', false);
            $scope.DisplayView = '';
            $scope.showSave = true;
            var $sel2 = $('#Parameter');
            $sel2.multiselect('enable');
            angular.element('#DeviceAddModal').modal('show');
        }
        $scope.setDevicePage = function (PageNo) {
            if (PageNo > $scope.total_Devicepage) {
                return false;
            } else if (PageNo == 0) {
                return false;
            }
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else {
                $scope.inputPageNo = PageNo;
            }
        $scope.current_page = PageNo;
        $scope.DeviceListAdmin();
        }
        //$scope.DeviceListAdmin = function () {
        //        $("#chatLoaderPV").show();
        //        $scope.ISact = 1;       // default active

        //       if ($scope.Is_Active == true) {
        //             $scope.ISact = 1  //active
        //        }
        //        else if ($scope.Is_Active == false) {
        //            $scope.ISact = 0 //all
        //        }

        //        $scope.ConfigCode = "PATIENTPAGE_COUNT";
        //        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        //        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
        //            $scope.page_size = data1[0].ConfigValue;
        //            $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
        //            $scope.PageEnd = $scope.current_page * $scope.page_size;
        //            $http.get(baseUrl + '/api/MyHome/DeviceName_Admin_List/?IsActive=' + $scope.ISact ).success(function (data) {
        //                $("#chatLoaderPV").hide();
        //                $scope.emptydataDevice = data.TabDeviceList;
        //                $scope.rowCollectionDevice = [];
        //                $scope.rowCollectionDevice = data.TabDeviceList;
        //                if ($scope.rowCollectionDevice.length > 0) {
        //                    $scope.TabDataCount = $scope.rowCollectionDevice[0].TotalRecord;
        //                } else {
        //                    $scope.TabDataCount = 0;
        //                }
        //                $scope.rowCollectionDeviceFilter = angular.copy($scope.rowCollectionDevice);
        //                if ($scope.rowCollectionDeviceFilter.length > 0) {
        //                    $scope.flag = 1;
        //                }
        //                else {
        //                    $scope.flag = 0;
        //                }
        //                $scope.total_Devicepage = Math.ceil(($scope.TabDataCount) / ($scope.page_size));
        //            }).error(function (data) {
        //                $("#chatLoaderPV").hide();
        //                $scope.error = "AN error has occured while Listing the records!" + data;
        //            });
        //        });
        //};

        $scope.DeviceListAdmin = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage["UserTypeId"] == 1) {
                $("#chatLoaderPV").show();
                $scope.ISact = 1;       // default active

                if ($scope.Is_Active == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.Is_Active == false) {
                    $scope.ISact = 0 //all
                }
                $http.get(baseUrl + '/api/MyHome/DeviceName_Admin_List/?IsActive=' + $scope.ISact).success(function (data) {
                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.rowCollectionTabFilter = [];
                    $scope.emptydataDevice = data.TabDeviceList;
                    $scope.rowCollection = data.TabDeviceList;
                    $scope.rowCollectionTabFilter = angular.copy($scope.rowCollection);
                    if ($scope.rowCollectionTabFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    //if ($scope.rowCollectionTabFilter.length > 0) {
                    //    $scope.TabDataCount = $scope.rowCollectionTabFilter[0].TotalRecord;
                    //} else {
                    //    $scope.TabDataCount = 0;
                    //}
                    //$scope.total_Devicepage = Math.ceil(($scope.TabDataCount) / ($scope.page_size));
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
        
        $scope.DeviceName_insert = function () {
            if ($scope.DeviceName_Validationantrols() == true) {
                $("#chatLoaderPV").show();

                angular.forEach($scope.AllDevice, function (value, index) {
                    if (value.ID == $scope.DeviceType) {
                        $scope.EditDeviceType = value.DeviceTypeName
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
                    DeviceName: $scope.DeviceNameAdmin,
                    DeviceType: $scope.EditDeviceType,
                    Make: $scope.DeviceMake,
                    ModelNumber: $scope.DeviceModel,
                    ParameterList: $scope.ProtocolParametersList,
                    SelectedDeviceParameterList: $scope.ParameterDetails_List,
                    CreatedBy: $window.localStorage['UserId']
                };
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/MyHome/AddDeviceNameInsertUpdate/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 0) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    $('#btnsave').attr("disabled", false);
                    $scope.DeviceListAdmin();
                    $scope.CancelDeviceList();

                }).error(function (data) {
                    $scope.error = "An error has occurred while Adding Device" + data;
                });

            }
        }

        $scope.searchquery = "";
        /* FILTER THE  MyHome  LIST FUNCTION.*/
        $scope.filterDeviceNameList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionTabFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionTabFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.DeviceName).match(searchstring) ||
                        angular.lowercase(value.DeviceType).match(searchstring) ||
                        angular.lowercase(value.Make).match(searchstring) ||
                        angular.lowercase(value.ModelNumber).match(searchstring);

                });
            }
            $scope.emptydataDevice = $scope.rowCollectionTabFilter;
        }
        $scope.Device_InsertUpdate = function (HiveType = 1) {
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
                        $scope.DeviceName = value.DeviceName;
                    }
                });
                angular.forEach($scope.AllDevice, function (value, index) {
                    if (value.ID == $scope.DeviceType) {
                        $scope.DeviceType = value.DeviceTypeName
                    }
                });
                angular.forEach($scope.AllDeviceNameList, function (value, index) {
                    if (value.DeviceId == $scope.DeviceName) {
                        $scope.DeviceName = value.DeviceName;
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
                    HiveType: HiveType
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
                    $scope.DeviceList(HiveType);
                    $scope.CancelDeviceList();

                }).error(function (data) {
                    $scope.error = "An error has occurred while Adding Device" + data;
                });
            }
        }

        /* THIS IS FOR DEVICE ADD EDIT VALIDATION CONTROL */
        $scope.DeviceValidationcontrols = function () {
            /*if (typeof ($scope.DeviceId) == "undefined" || $scope.DeviceId == "") {
                //alert("Please enter Device Id");
                toastr.warning("Please enter Device Id", "warning");
                return false;
            }
            else */
            //$window.alert($scope.DeviceId);
            if (typeof ($scope.DeviceName) == "undefined" || $scope.DeviceName == "" || $scope.DeviceName == null) {
                //alert("Please Select Device Name");
                toastr.warning("Please Select Device Name", "warning");
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