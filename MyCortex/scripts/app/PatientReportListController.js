var PatientReportList = angular.module("PatientReportListController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


PatientReportList.controller("PatientReportListController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        if ($window.localStorage['UserTypeId'] == 3) {
            $scope.current_page = 1;
            $scope.TotalPageAuditReport = 1;
            $scope.page_size = $window.localStorage['Pagesize'];
            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
            $scope.rembemberCurrentPage = function (p) {
                $scope.current_page = p
            }

            $scope.Reportflag = 0;
            $scope.UserTypeId = "0";
            $scope.UserNameId = "0";
            $scope.Id = "0";
            $scope.Usertype_listdata = [];
            $scope.UserName_listdata = [];
            $scope.ShortNameId = "";

            $scope.Period_From = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $scope.Period_To = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $scope.PeriodFromTime = DateFormatEdit($filter('date')(new Date(), 'hh:mm'));
            $scope.PeriodToTime = DateFormatEdit($filter('date')(new Date(), 'hh:mm'));

            $scope.InstituteId = $window.localStorage['InstitutionId'];

            $http.get(baseUrl + '/api/ReportDetails/TableShortName_List/').success(function (data) {
                $scope.TableShortName_listdata = data;
            });

            /* User type details list*/
            $http.get(baseUrl + '/api/Login/Usertypedetailslist/').success(function (data) {
                $scope.Usertype_listdataTemp = [];
                $scope.Usertype_listdataTemp = data;
                var obj = { "Id": 0, "TypeName": "Select", "IsActive": 1 };
                $scope.Usertype_listdataTemp.splice(0, 0, obj);
                $scope.Usertype_listdata = angular.copy($scope.Usertype_listdataTemp);
                $scope.UserTypeId = 0;
            });




            $scope.UserTypeBaseduserName = function () {
                $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + $scope.UserTypeId + '&InstitutionId=' + $scope.InstituteId).success(function (data) {
                    $scope.UserName_listdataTemp = [];
                    $scope.UserName_listdataTemp = data;
                    var obj = { "Id": 0, "FullName": "Select", "IsActive": 1 };
                    $scope.UserName_listdataTemp.splice(0, 0, obj);
                    $scope.UserName_listdata = angular.copy($scope.UserName_listdataTemp);
                    $scope.UserNameId = 0;
                });
            }

            $scope.ConfigCode = "REPORT_DATE_LIMIT";
            $scope.ValidateDays = 90;
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.InstituteId)
                .success(function (data) {
                    if (data[0] != undefined) {
                        $scope.ValidateDays = parseInt(data[0].ConfigValue);
                    }
                    else {
                        $scope.ValidateDays = 90;
                    }
                });

            $scope.patientReportValidation = function () {
                if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                    //alert("Please select User Type");
                    toastr.warning("Please select User Type", "warning");
                    return false;
                }
                else if (typeof ($scope.UserNameId) == "undefined" || $scope.UserNameId == "0") {
                    //alert("Please select User Name");
                    toastr.warning("Please select User Name", "warning");
                    return false;
                }
                else if ($scope.ShortNameId == "" || $scope.ShortNameId == "0") {
                    //alert("Please select Table Short Name");
                    toastr.warning("Please select Table Short Name", "warning");
                    return false;
                }
                //else if (typeof ($scope.PeriodFromTime) == "undefined" || $scope.PeriodFromTime   == "") {
                //    alert("Please select Period To Time");
                //    return false;
                //}
                //else if (typeof ($scope.PeriodToTime) == "undefined" || $scope.PeriodToTime  == "") {
                //    alert("Please select Period To Time");
                //    return false;
                //}

                //else if (isDate($scope.Period_From) == false) {
                //    alert("Period From is in Invalid format, please enter dd-mm-yyyy");
                //    return false;
                //}
                //if (typeof ($scope.Period_To) == "undefined" || $scope.Period_To == "") {
                //    alert("Please select Period To");
                //    return false;
                //}
                //else if (isDate($scope.Period_To) == false) {
                //    alert("Period To is in Invalid format, please enter dd-mm-yyyy");
                //    return false;
                //}
                //var date1 = new Date($scope.Period_From);
                var date1 = new Date($('#datetimepicker').val());
                var date2 = new Date($('#datetimepicker_mask').val());
                var diffTime = Math.abs(date2 - date1);
                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= $scope.ValidateDays) {
                    //alert($scope.ValidateDays.toString() + " days only allowed Audit Report");
                    toastr.warning($scope.ValidateDays.toString() + " days only allowed Audit Report", "warning");
                    return false;
                }
                var retval = true;
                if (($scope.Period_From != "") && ($scope.Period_To != "")) {
                    $scope.Period_From = moment($scope.Period_From).format('DD-MMM-YYYY');
                    $scope.Period_To = moment($scope.Period_To).format('DD-MMM-YYYY');

                    if ((ParseDate($scope.Period_From + " " + $scope.PeriodFromTime) > ParseDate($scope.Period_To + " " + $scope.PeriodToTime))) {
                        //alert("From Date should not be greater than To Date");
                        toastr.warning("From Date should not be greater than To Date", "warning");
                        $scope.Period_From = DateFormatEdit($scope.Period_From);
                        $scope.Period_To = DateFormatEdit($scope.Period_To);
                        retval = false;
                        return false;
                    }
                    $scope.Period_From = DateFormatEdit($scope.Period_From);
                    $scope.Period_To = DateFormatEdit($scope.Period_To);
                }

                return retval;
            };

            $scope.PatientReportListData = [];
            $scope.filterReportList = function () {
                $scope.ResultListFiltered = [];
                var searchstring = angular.lowercase($scope.searchreportquery);
                if ($scope.searchreportquery == "") {
                    $scope.PatientDetailsFilteredDataList = [];
                    $scope.PatientDetailsFilteredDataList = angular.copy($scope.ReportDetails_ListOrder);

                }
                else {
                    $scope.PatientDetailsFilteredDataList = $ff($scope.ReportDetails_ListOrder, function (value) {
                        return angular.lowercase(value.ShortName).match(searchstring) ||
                            angular.lowercase(value.TableDisplayName).match(searchstring) ||
                            angular.lowercase(value.Details).match(searchstring) ||
                            angular.lowercase(value.ColumnOrder).match(searchstring) ||
                            angular.lowercase(value.Action).match(searchstring) ||
                            angular.lowercase(value.NewValue).match(searchstring) ||
                            angular.lowercase(value.OldValue == null ? "" : value.OldValue).match(searchstring) ||
                            angular.lowercase(($filter('date')(value.ActionDateTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);


                    });
                }
            };
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
            $scope.setPage = function (PageNo) {
                if (PageNo == 0) {
                    PageNo = $scope.inputPage;
                }
                else {
                    $scope.inputPage = PageNo;
                }
                $scope.current_page = PageNo;
                $scope.PatientReportDetailslist();

            }


            //$scope.UserType = function () {

            //    var UserTypeId = document.getElementById('stateselectpicker').value;
            //    if (UserTypeId != "0") {
            //        $('#divUserType').removeClass("ng-invalid");
            //        $('#divUserType').addClass("ng-valid");
            //    }
            //    else {
            //        $('#divUserType').removeClass("ng-valid");
            //        $('#divUserType').addClass("ng-invalid");
            //    }
            //}


            //$scope.UserName = function () {

            //    var UserNameId = document.getElementById('Select1').value;
            //    if (UserNameId != "0") {
            //        $('#divUserNameChange').removeClass("ng-invalid");
            //        $('#divUserNameChange').addClass("ng-valid");
            //    }
            //    else {
            //        $('#divUserNameChange').removeClass("ng-valid");
            //        $('#divUserNameChange').addClass("ng-invalid");
            //    }
            //}

            //$scope.TableName = function () {

            //    var ShortNameId = document.getElementById('SelectPicker').value;
            //    if (ShortNameId != "0") {
            //        $('#divTableName').removeClass("ng-invalid");
            //        $('#divTableName').addClass("ng-valid");
            //    }
            //    else {
            //        $('#divTableName').removeClass("ng-valid");
            //        $('#divTableName').addClass("ng-invalid");
            //    }
            //}

            //$scope.PeriodFromChange = function () {
            //    var Period_From = document.getElementById('datetimepicker').value;
            //    if (Period_From != "") {
            //        $('#Div13').removeClass("ng-invalid");
            //        $('#Div13').addClass("ng-valid");
            //    }
            //    else {
            //        $('#Div13').removeClass("ng-valid");
            //        $('#Div13').addClass("ng-invalid");
            //    }
            //}

            //$scope.PeriodToChange = function () {
            //    var Period_To = document.getElementById('datetimepicker_mask').value;
            //    if (Period_To != "") {
            //        $('#PeriodTo').removeClass("ng-invalid");
            //        $('#PeriodTo').addClass("ng-valid");
            //    }
            //    else {
            //        $('#PeriodTo').removeClass("ng-valid");
            //        $('#PeriodTo').addClass("ng-invalid");
            //    }
            //}




            $scope.ReportDetailsemptydata = [];
            $scope.ReportPatienAudit = [];
            $scope.PatientDetailsFilteredDataList = [];
            $scope.PatientReportDetailslist = function () {
                //$('#divUserType').addClass("ng-invalid");
                //$('#divUserNameChange').addClass("ng-invalid");
                //$('#divTableName').addClass("ng-invalid");
                //$('#Div13').addClass("ng-invalid");
                //$('#PeriodTo').addClass("ng-invalid");
                if ($scope.patientReportValidation() == true) {
                    $("#chatLoaderPV").show();
                    $scope.ConfigCode = "PATIENTPAGE_COUNT";
                    $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                    $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                        $scope.page_size = data1[0].ConfigValue;
                        $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                        $scope.PageEnd = $scope.current_page * $scope.page_size;


                        //var PeriodFromTime = $scope.PeriodFromTime == "" ? null : $scope.Convert12To24Timeformat($scope.PeriodFromTime);
                        //var PeriodToTime  =  $scope.PeriodToTime == "" ? null : $scope.Convert12To24Timeformat($scope.PeriodToTime);   

                        var periodsplitfromdate = $('#datetimepicker').val().split(' ')[0];
                        var periodsplittodate = $('#datetimepicker_mask').val().split(' ')[0];
                        var PeriodFromTime = $scope.Convert24to12Timeformat($('#datetimepicker').val().split(' ')[1]);
                        var PeriodToTime = $scope.Convert24to12Timeformat($('#datetimepicker_mask').val().split(' ')[1]);
                        var fromtime2 = PeriodFromTime;
                        var totime = PeriodToTime;


                        $http.get(baseUrl + '/api/ReportDetails/PatientReportDetails_List?' +
                            'Period_From=' + moment(periodsplitfromdate).format('YYYY-MMM-DD') +
                            '&Period_To=' + moment(periodsplittodate).format('YYYY-MMM-DD') +
                            '&PeriodFromTime=' + fromtime2 +
                            '&PeriodToTime=' + totime +
                            '&ShortNameId=' + $scope.ShortNameId +
                            '&UserNameId=' + $scope.UserNameId
                            + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber='
                            + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                                if (data.length == 0) {
                                    $("#chatLoaderPV").hide();
                                    $scope.TotalPageAuditReport = 1;
                                    $scope.ReportDetailsemptydata = "";
                                    if ($scope.PatientDetailsFilteredDataList.length > 0) {

                                    } else {
                                        $scope.Reportflag = 0;
                                    }
                                    $scope.SearchMsg = "No Data Available";
                                } else {
                                    $scope.ReportDetails_ListOrder = [];
                                    $scope.ReportDetails_ListOrder = data;
                                    $scope.ReportDetailsCount = $scope.ReportDetails_ListOrder[0].TotalRecord;
                                    $scope.ReportDetailsCountFilterData = data;
                                    $scope.PatientDetailsFilteredDataList = angular.copy($scope.ReportDetails_ListOrder);
                                    if ($scope.PatientDetailsFilteredDataList.length > 0) {
                                        $scope.Reportflag = 1;
                                    }
                                    else {
                                        $scope.Reportflag = 0;
                                    }
                                    $scope.TotalPageAuditReport = Math.ceil(($scope.ReportDetailsCount) / ($scope.page_size));
                                    $("#chatLoaderPV").hide();
                                }
                            })
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "AN error has occured while Listing the records!" + data;
                    })
                }
            }


        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }

    }
]);