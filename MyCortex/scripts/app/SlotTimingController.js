var SlotTiming = angular.module("SlotTimingController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



SlotTiming.controller("SlotTimingController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        //  $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.ShiftName = "";
        $scope.IsActive = true;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.currentTab = "1";

        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).then(function (response) {
            if (response.data[0] != undefined) {
                $scope.page_size = parseInt(response.data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        }, function errorCallback(response) {
        });
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.ViewShiftTimingsSlot = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewShiftTimings();
            angular.element('#ViewAppointmentSlotModal').modal('show');
        }

        $scope.EditShiftTimingsSlot = function (CatId, ActiveFlag) {
            if (ActiveFlag == 1) {
                $scope.ClearShiftTimingPopUp();
                $scope.Id = CatId;
                $scope.ViewShiftTimings();
                angular.element('#AppointmentSlotModal').modal('show');
            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
            }
        };

        $scope.AddTiming = function () {
            angular.element('#AppointmentSlotModal').modal('show');
        }

        $scope.CancelTiming = function () {
            angular.element('#AppointmentSlotModal').modal('hide');
        }

        $scope.AddDoctorShift = function () {
            angular.element('#DoctorShiftModal').modal('show');
        }

        $scope.CancelDoctorShift = function () {
            angular.element('#DoctorShiftModal').modal('hide');
        }
        $scope.Convert24to12Timeformat = function (inputTime) {
            var outputTime = null;
            if (inputTime != '' && inputTime != null) {
                inputTime = inputTime.toString(); //value to string for splitting
                var splitTime = inputTime.split(':');
                splitTime.splice(2, 1);
                var ampm = (splitTime[0] >= 12 ? ' PM' : ' AM'); //determine AM or PM
                splitTime[0] = splitTime[0] % 12;
                splitTime[0] = (splitTime[0] == 0 ? 12 : splitTime[0]); //adjust for 0 = 12
                outputTime = splitTime.join(':') + ampm;
            }
            return outputTime;
        };
        $scope.Convert12To24Timeformat = function (timeval) {
            var outputTime = null;
            if (timeval != '' && timeval != null) {
                var time = timeval;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12) hours = hours + 12;
                if (AMPM == "AM" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                outputTime = sHours + ":" + sMinutes;
            }
            return outputTime;
        };

        $scope.ShiftTimings_InsertUpdateValidations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.ShiftFromDate = moment($scope.ShiftFromDate).format('DD-MMM-YYYY');
            $scope.ShiftToDate = moment($scope.ShiftToDate).format('DD-MMM-YYYY');

            if ($scope.ShiftName == "") {
                //alert("Please enter Shift");
                toastr.warning("Please enter Shift", "warning");
                return false;
            }
            else if ((ParseDate($scope.ShiftFromDate) < ParseDate(today))) {
                //alert("Shift Timing From Date Can Be Booked Only For Future");
                toastr.warning("Shift Timing From Date Can Be Booked Only For Future", "warning");
                $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                return false;
            }
            else if ((ParseDate($scope.ShiftToDate) < ParseDate(today))) {
                //alert("Shift Timing ToDate Can Be Booked Only For Future");
                toastr.warning("Shift Timing ToDate Can Be Booked Only For Future", "warning");
                $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                return false;
            }
            else if ((typeof ($scope.ShiftFromDate) != "") && (typeof ($scope.ShiftToDate) != "")) {

                if (moment($scope.ShiftFromDate + " " + $scope.ShiftFromTime) > moment($scope.ShiftToDate + " " + $scope.ShiftEndTime)) {
                    if (($scope.ShiftFromDate !== null) && ($scope.ShiftToDate !== null)) {
                        if ((ParseDate($scope.ShiftToDate) < ParseDate($scope.ShiftFromDate))) {
                            //alert("From Date Should not be greater than To Date");
                            toastr.warning("From Date Should not be greater than To Date", "warning");
                            $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                            $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                            return false;
                        }
                        //alert("Shift From Time should not be greater than Shift To Time");
                        toastr.warning("Shift From Time should not be greater than Shift To Time", "warning");
                        $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                        $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                        return false;
                    }

                }
            }
            else if ($scope.ShiftFromTime == "") {
                //alert("Please select Shift From time");
                toastr.warning("Please select Shift From time", "warning");
                return false;
            }
            else if ($scope.ShiftEndTime == "") {
                //alert("Please select Shift To time");
                toastr.warning("Please select Shift To time", "warning");
                return false;
            }

            else if (typeof ($scope.ShiftFromDate) == "undefined" || $scope.ShiftFromDate == 0) {
                //alert("Please select From Date");
                toastr.warning("Please select From Date", "warning");
                return false;
            }
            else if (typeof ($scope.ShiftToDate) == "undefined" || $scope.ShiftToDate == 0) {
                //alert("Please select To Date");
                toastr.warning("Please select To Date", "warning");
                return false;
            }
            $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
            $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
            return true;
        };

        $scope.ShiftTimingAddEdit = function () {
            if ($scope.ShiftTimings_InsertUpdateValidations() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    InstituteId: $window.localStorage['InstitutionId'],
                    ShiftName: $scope.ShiftName,
                    ShiftFromTime: $scope.ShiftFromTime == '' ? null : $scope.Convert12To24Timeformat($scope.ShiftFromTime),
                    ShiftEndTime: $scope.ShiftEndTime == '' ? null : $scope.Convert12To24Timeformat($scope.ShiftEndTime),
                    ShiftFromDate: moment($scope.ShiftFromDate).format('DD-MMM-YYYY'),
                    ShiftToDate: moment($scope.ShiftToDate).format('DD-MMM-YYYY'),
                };
                $http.post(baseUrl + '/api/ShiftTmings/ShiftTimings_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).then(function (response) {
                    //alert(data.Message);
                    if (response.data.ReturnFlag == 1) {
                        toastr.success(response.data.Message, "success");
                    }
                    else if (response.data.ReturnFlag == 0) {
                        toastr.info(response.data.Message, "info");
                    }
                    $scope.ShiftTimingList();
                    $scope.ClearShiftTimingPopUp();
                }, function errorCallback(response) {
                    $scope.error = "An error has occurred while deleting Parameter" + response.data;
                });
                $("#chatLoaderPV").hide();
            }
        };

        $scope.searchquerySlotTimings = "";
        /* Filter the master list function.*/
        $scope.FilterSlotTimingList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquerySlotTimings);
            if (searchstring == "") {
                $scope.rowCollectionShiftTimingsFilter = [];
                $scope.rowCollectionShiftTimingsFilter = angular.copy($scope.rowCollectionShiftTimings);
            }
            else {
                $scope.rowCollectionShiftTimingsFilter = $ff($scope.rowCollectionShiftTimings, function (value) {
                    return angular.lowercase(value.ShiftName).match(searchstring) ||
                        angular.lowercase($filter('date')(value.ShiftToDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.ShiftFromDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ShiftFromTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ShiftEndTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);

                });
            }
        }
        $scope.ShiftTimingList = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.emptydataShiftTimings = [];
                $scope.rowCollectionShiftTimings = [];

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }

                $http.get(baseUrl + '/api/ShiftTmings/ShiftTimings_List/Id?=0' + '&IsActive=' + $scope.ISact + '&InstituteId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                    $scope.emptydataShiftTimings = [];
                    $scope.rowCollectionShiftTimings = [];
                    $scope.rowCollectionShiftTimings = response.data;
                    $scope.rowCollectionShiftTimingsFilter = angular.copy($scope.rowCollectionShiftTimings);
                    if ($scope.rowCollectionShiftTimingsFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                }, function errorCallback(response) {
                    $scope.error = "AN error has occured while Listing the records!" + response.data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
        $scope.ClearShiftTimingPopUp = function () {
            $scope.Id = 0;
            $scope.InstituteId = "";
            $scope.ShiftName = "";
            $scope.ShiftFromTime = "";
            $scope.ShiftEndTime = "";
            $scope.ShiftFromDate = "";
            $scope.ShiftToDate = "";
            $scope.CancelShiftTimingPopUp();
        }

        $scope.CancelShiftTimingPopUp = function () {
            angular.element('#AppointmentSlotModal').modal('hide');
            angular.element('#ViewAppointmentSlotModal').modal('hide');

        };

        $scope.ViewShiftTimings = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/ShiftTmings/ShiftTimings_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                $scope.DuplicatesId = response.data.Id;
                $scope.Id = response.data.Id;
                $scope.ShiftName = response.data.ShiftName;
                var SFD = moment(data.ShiftFromDate).format('DD-MMM-YYYY');
                $scope.ShiftFromDate = DateFormatEdit(SFD);
                var STD = moment(data.ShiftToDate).format('DD-MMM-YYYY');
                $scope.ShiftToDate = DateFormatEdit(STD);
                $scope.ShiftFromTime = $filter('date')(data.ShiftFromTime, "hh:mm a");
                $scope.ShiftEndTime = $filter('date')(data.ShiftEndTime, "hh:mm a");
            }, function errorCallback(response) {
            });
            $("#chatLoaderPV").hide();
        };

        /* 
    Calling the api method to detele the details of the Allergy
    for the  Allergy Id,
    and redirected to the list page.
    */
        $scope.DeleteShiftTimingsSlot = function (comId) {
            $scope.Id = comId;
            $scope.ShiftTimings_InActive();
        };
        $scope.ShiftTimings_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Shift Slot?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/ShiftTmings/ShiftTimings_InActive/', obj).then(function (response) {
                    //alert(data.Message);
                    toastr.success(response.data.Message, "success");
                    $scope.ShiftTimingList();
                }, function errorCallback(response) {
                    $scope.error = "An error has occurred while deleting Shift Slot" + response.data;
                });
            };
        };

        /*'Active' the Allergy*/
        $scope.ReInsertShiftTimingsSlot = function (comId) {
            $scope.Id = comId;
            $scope.ShiftTimings_Active();
        };
        /* 
        Calling the api method to inactived the details of the Allergy 
        for the  Allergy Id,
        and redirected to the list page.
        */
        $scope.ShiftTimings_Active = function () {
            $http.get(baseUrl + '/api/ShiftTmings/ActivateShiftTiming_List/?Id=' + $scope.Id
                + '&Institution_Id=' + $window.localStorage['InstitutionId']
            ).success(function (data) {
                if (data.returnval == 1) {
                    //alert("Activate Shift Slot is already created, Please check");
                    toastr.info("Activate Shift Slot is already created, Please check", "info");
                }
                else {
                    var Ins = confirm("Do you like to activate the selected Shift Slot?");
                    if (Ins == true) {
                        var obj =
                        {
                            Id: $scope.Id,
                            Modified_By: $window.localStorage['UserId']
                        }

                        $http.post(baseUrl + '/api/ShiftTmings/ShiftTimings_Active/', obj).then(function (response) {
                            //alert(data.Message);
                            toastr.success(response.data.Message, "success");
                            $scope.ShiftTimingList();
                        }, function errorCallback(response) {
                            $scope.error = "An error has occurred while deleting Shift Slot" + response.data;
                        });
                    };
                }
            })
        }

        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

    }

]);