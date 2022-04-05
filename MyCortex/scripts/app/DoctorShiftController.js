var DoctorShiftcontroller = angular.module("DoctorShiftController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


DoctorShiftcontroller.controller("DoctorShiftController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.currentTab = "1";
        $scope.DoctorSave = true;
        $scope.DevicesLists = [];
        $scope.SelectedDepartment = [];
        $scope.SelectedSpecialist = [];
        $scope.SelectedCCCG = [];
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.listdata = [];
        $scope.Institution_Name = "";
        $scope.Doctor_Id = "0";
        $scope.Doctor_Name = "";
        $scope.SundayChildModuleList = [];
        $scope.MondayChildModuleList = [];
        $scope.TuesdayChildModuleList = [];
        $scope.WednessdayChildModuleList = [];
        $scope.ThursdayChildModuleList = [];
        $scope.FridayChildModuleList = [];
        $scope.SaturdayChildModuleList = [];
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.Doctor_Id = [];
        $scope.SpecialitiesSelectList = [];
        $scope.Specialitiesinput = "";
        $scope.SelectedDays = [];

        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.IsActive = true;
        $scope.rowCollection = [];
        $scope.rowCollectionFilter = [];

        $scope.Id = 0;
        $scope.CC_Id = 3;
        $('#SundayCheck').hide();
        $('#MondayCheck').hide();
        $('#TuesdayCheck').hide();
        $('#WednesdayCheck').hide();
        $('#ThursdayCheck').hide();
        $('#FridayCheck').hide();
        $('#SaturdayCheck').hide();
        $("#SundayId").attr("disabled", true);
        $("#MondayId").attr("disabled", true);
        $("#TuesdayId").attr("disabled", true);
        $("#WednesdayId").attr("disabled", true);
        $("#ThursdayId").attr("disabled", true);
        $("#FridayId").attr("disabled", true);
        $("#SaturdayId").attr("disabled", true);
        $scope.TimeSlot1 = new Date();
        $scope.TimeSlot2 = new Date();
        $scope.TimeSlot3 = new Date();
        $scope.TimeSlot4 = new Date();
        $scope.TimeSlot5 = new Date();
        $scope.TimeSlot6 = new Date();
        $scope.TimeSlot7 = new Date();
        $scope.TimeSlot8 = new Date();
        $scope.TimeSlot9 = new Date();
        $scope.TimeSlot10 = new Date();
        $scope.TimeSlot11 = new Date();
        $scope.TimeSlot12 = new Date();
        $scope.TimeSlot13 = new Date();
        $scope.TimeSlot14 = new Date();
        $scope.TimeSlot15 = new Date();
        $scope.TimeSlot16 = new Date();
        $scope.TimeSlot17 = new Date();
        $scope.TimeSlot18 = new Date();
        $scope.TimeSlot19 = new Date();
        $scope.TimeSlot20 = new Date();
        $scope.TimeSlot21 = new Date();
        $scope.TimeSlot22 = new Date();
        $scope.TimeSlot23 = new Date();
        $scope.TimeSlot24 = new Date();
        $scope.TimeSlot25 = new Date();
        $scope.TimeSlot26 = new Date();
        $scope.TimeSlot27 = new Date();
        $scope.TimeSlot28 = new Date();
        $scope.TimeSlot29 = new Date();
        $scope.TimeSlot30 = new Date();
        $scope.TimeSlot31 = new Date();
        $scope.TimeSlot32 = new Date();
        $scope.TimeSlot33 = new Date();
        $scope.TimeSlot34 = new Date();
        $scope.TimeSlot35 = new Date();
        $scope.TimeSlot36 = new Date();
        $scope.TimeSlot37 = new Date();
        $scope.TimeSlot38 = new Date();
        $scope.TimeSlot39 = new Date();
        $scope.TimeSlot40 = new Date();
        $scope.TimeSlot41 = new Date();
        $scope.TimeSlot42 = new Date();
        $scope.TimeSlot43 = new Date();
        $scope.TimeSlot44 = new Date();
        $scope.TimeSlot45 = new Date();
        $scope.TimeSlot46 = new Date();
        $scope.TimeSlot47 = new Date();
        $scope.TimeSlot48 = new Date();
        $scope.TimeSlot49 = new Date();
        $scope.TimeSlot50 = new Date();
        $scope.TimeSlot51 = new Date();
        $scope.TimeSlot52 = new Date();
        $scope.TimeSlot53 = new Date();
        $scope.TimeSlot54 = new Date();
        $scope.TimeSlot55 = new Date();
        $scope.TimeSlot56 = new Date();
        $scope.NewAppointment2 = "0";
        $scope.followup2 = "0";
        $scope.NewAppointmentPrice2 = "0";
        $scope.followupPrice2 = "0";
        $scope.IntervalBt2 = "0";
        $scope.Days2 = "0";
        $scope.Minutes2 = "0";
        $http.get(baseUrl + '/api/User/DepartmentListByInstitution/').success(function (data) {
            $scope.DepartmentList = data;
        });
        $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.CC_Id + '&IsActive=' + 1 + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            $scope.CCCG_DetailsList = data;
        });

        $scope.AddSlot = function () {
            $("#chatLoaderPV").show();
            $scope.Id = 0;
            $scope.DoctorSave = true;
            $('#Shift1Select').prop('checked', false);
            $('#Shift2Select').prop('checked', false);
            $('#Shift3Select').prop('checked', false);
            $('#Shift4Select').prop('checked', false);
            var $sel1 = $('#department');
            $sel1.multiselect('enable');
            var $sel2 = $('#Specialist');
            $sel2.multiselect('enable');
            var $sel3 = $('#CCCG');
            $sel3.multiselect('enable');
            $scope.EditShiftDoctor();
            // $scope.AppoinmentSlotClear();
            $scope.onDateRange();
            $('#saveDoctorShift1').attr("disabled", false);
            $('#saveDoctorShift2').attr("disabled", false);
            $('#saveDoctorShift3').attr("disabled", false);
            angular.element('#DoctorShiftModal').modal('show');
            $("#chatLoaderPV").hide();
        }
        $scope.onChangeDepartment = function () {
            $("#chatLoaderPV").show();
            var today = moment(new Date()).format('DD-MMM-YYYY');
            var SelectedDepartmentId = "";
            angular.forEach($scope.SelectedDepartment, function (Department_Id, index) {
                if ($scope.SelectedDepartment.length == 1) {
                    SelectedDepartmentId = Department_Id.toString();
                }
                else if (SelectedDepartmentId != "" || $scope.SelectedDepartment.length > 1) {
                    SelectedDepartmentId = SelectedDepartmentId + Department_Id + ',';

                }
            });
            if ($scope.SelectedDepartment.length != 1) {
                SelectedDepartmentId = SelectedDepartmentId.toString().slice(0, -1);
            }
            if (SelectedDepartmentId != "") {
                $http.get(baseUrl + '/api/PatientAppointments/DepartmentwiseDoctorList/?DepartmentIds=' + SelectedDepartmentId + '&InstitutionId=' + $window.localStorage['InstitutionId'] +
                    '&Date=' + today + '&Login_Session_Id=' + $scope.LoginSessionId + '&IsShift=1').success(function (data) {
                        $scope.SelectedDoctorList = data;
                    });
            } else {
                $scope.SelectedDoctorList = [];
            }
            $("#chatLoaderPV").hide();
        }

        $scope.OrgDefaultClick = function (event) {
            var checked = $('#OrgDefaultId').is(":checked")
            if (checked == true) {
                if (($scope.NewAppointment2 == "0" && $scope.followup2 == "0" && $scope.IntervalBt2 == "0") || ($scope.NewAppointment2.toString().trim() == "" && $scope.followup2.toString().trim() == "" && $scope.IntervalBt2.toString().trim() == "")) {
                    $("#chatLoaderPV").show();
                    $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingView/?InstitutionId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                        $("#chatLoaderPV").hide();
                        if (data != null && data.length != 0) {
                            //$scope.Days = data.MaxScheduleDays;
                            //$scope.Minutes = data.MinRescheduleMinutes;
                            $scope.Days2 = data.MaxScheduleDays;
                            $scope.Minutes2 = data.MinRescheduleMinutes;
                            $scope.NewAppointment = data.NewAppointmentDuration;
                            $scope.followup = data.FollowUpDuration;
                            $scope.NewAppointmentPrice = data.NewAppointmentPrice;
                            $scope.followupPrice = data.FollowUpPrice;
                            $scope.IntervalBt = data.AppointmentInterval;
                            $scope.NewAppointment2 = data.NewAppointmentDuration;
                            $scope.followup2 = data.FollowUpDuration;
                            $scope.NewAppointmentPrice2 = data.NewAppointmentPrice;
                            $scope.followupPrice2 = data.FollowUpPrice;
                            $scope.IntervalBt2 = data.AppointmentInterval;
                        } else {
                            $('#OrgDefaultId').prop('checked', false);
                        }

                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                    });
                } else {
                    $scope.NewAppointment = $scope.NewAppointment2;
                    $scope.followup = $scope.followup2;
                    $scope.IntervalBt = $scope.IntervalBt2;
                }
            } else {
                $scope.NewAppointment = "0";
                $scope.followup = "0";
                $scope.IntervalBt = "0";
                $scope.NewAppointmentPrice = "0";
                $scope.followupPrice = "0";
            }
        }

        $scope.OrgBookInfoDefaultClick = function (event) {
            var checked = $('#OrgBookInfoId').is(":checked")
            if (checked == true) {
                if (($scope.Days2 == "0" && $scope.Minutes2 == "0") || ($scope.Days2.toString().trim() == "" && $scope.Minutes2.toString().trim() == "")) {
                    $("#chatLoaderPV").show();
                    $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingView/?InstitutionId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                        $("#chatLoaderPV").hide();
                        if (data != null && data.length != 0) {
                            $scope.Days = data.MaxScheduleDays;
                            $scope.Minutes = data.MinRescheduleMinutes;
                            $scope.Days2 = data.MaxScheduleDays;
                            $scope.Minutes2 = data.MinRescheduleMinutes;
                            //$scope.NewAppointment = data.NewAppointmentDuration;
                            //$scope.followup = data.FollowUpDuration;
                            //$scope.IntervalBt = data.AppointmentInterval;
                            $scope.NewAppointment2 = data.NewAppointmentDuration;
                            $scope.followup2 = data.FollowUpDuration;
                            $scope.NewAppointmentPrice2 = data.NewAppointmentPrice;
                            $scope.followupPrice2 = data.FollowUpPrice;
                            $scope.IntervalBt2 = data.AppointmentInterval;
                        } else {
                            $('#OrgBookInfoId').prop('checked', false);
                        }
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                    });
                } else {
                    $scope.Days = $scope.Days2;
                    $scope.Minutes = $scope.Minutes2;
                }
            } else {
                $scope.Days = "0";
                $scope.Minutes = "0";
            }
        }

        $scope.Shift1_SelectAllClick = function (event) {
            var checked = $('#Shift1Select').is(":checked")
            if (checked == true) {
                if (($scope.TimeSlot1 == 0 && $scope.TimeSlot2 == 0) && ($scope.TimeSlot7 == 0 && $scope.TimeSlot8 == 0) && ($scope.TimeSlot13 == 0 && $scope.TimeSlot14 == 0) && ($scope.TimeSlot19 == 0 && $scope.TimeSlot20 == 0) &&
                    ($scope.TimeSlot25 == 0 && $scope.TimeSlot26 == 0) && ($scope.TimeSlot31 == 0 && $scope.TimeSlot32 == 0) && ($scope.TimeSlot37 == 0 && $scope.TimeSlot38 == 0)) {
                    //alert('Please Enter Any One Shift !');
                    toastr.warning("Please Enter Any One Shift !", "warning");
                    $('#Shift1Select').prop('checked', false);
                }
                else {
                    $("#chatLoaderPV").show();
                    if ($scope.TimeSlot1 != 0 && $scope.TimeSlot2 != 0) {
                        $scope.TimeSlot7 = angular.copy($scope.TimeSlot1);
                        $scope.TimeSlot8 = angular.copy($scope.TimeSlot2);

                        $scope.TimeSlot13 = angular.copy($scope.TimeSlot1);
                        $scope.TimeSlot14 = angular.copy($scope.TimeSlot2);

                        $scope.TimeSlot19 = angular.copy($scope.TimeSlot1);
                        $scope.TimeSlot20 = angular.copy($scope.TimeSlot2);

                        $scope.TimeSlot25 = angular.copy($scope.TimeSlot1);
                        $scope.TimeSlot26 = angular.copy($scope.TimeSlot2);

                        $scope.TimeSlot31 = angular.copy($scope.TimeSlot1);
                        $scope.TimeSlot32 = angular.copy($scope.TimeSlot2);

                        $scope.TimeSlot37 = angular.copy($scope.TimeSlot1);
                        $scope.TimeSlot38 = angular.copy($scope.TimeSlot2);
                    }
                    else if ($scope.TimeSlot7 != 0 && $scope.TimeSlot8 != 0) {
                        $scope.TimeSlot1 = angular.copy($scope.TimeSlot7);
                        $scope.TimeSlot2 = angular.copy($scope.TimeSlot8);

                        $scope.TimeSlot13 = angular.copy($scope.TimeSlot7);
                        $scope.TimeSlot14 = angular.copy($scope.TimeSlot8);

                        $scope.TimeSlot19 = angular.copy($scope.TimeSlot7);
                        $scope.TimeSlot20 = angular.copy($scope.TimeSlot8);

                        $scope.TimeSlot25 = angular.copy($scope.TimeSlot7);
                        $scope.TimeSlot26 = angular.copy($scope.TimeSlot8);

                        $scope.TimeSlot31 = angular.copy($scope.TimeSlot7);
                        $scope.TimeSlot32 = angular.copy($scope.TimeSlot8);

                        $scope.TimeSlot37 = angular.copy($scope.TimeSlot7);
                        $scope.TimeSlot38 = angular.copy($scope.TimeSlot8);
                    }
                    else if ($scope.TimeSlot13 != 0 && $scope.TimeSlot14 != 0) {
                        $scope.TimeSlot1 = angular.copy($scope.TimeSlot13);
                        $scope.TimeSlot2 = angular.copy($scope.TimeSlot14);

                        $scope.TimeSlot7 = angular.copy($scope.TimeSlot13);
                        $scope.TimeSlot8 = angular.copy($scope.TimeSlot14);

                        $scope.TimeSlot19 = angular.copy($scope.TimeSlot13);
                        $scope.TimeSlot20 = angular.copy($scope.TimeSlot14);

                        $scope.TimeSlot25 = angular.copy($scope.TimeSlot13);
                        $scope.TimeSlot26 = angular.copy($scope.TimeSlot14);

                        $scope.TimeSlot31 = angular.copy($scope.TimeSlot13);
                        $scope.TimeSlot32 = angular.copy($scope.TimeSlot14);

                        $scope.TimeSlot37 = angular.copy($scope.TimeSlot13);
                        $scope.TimeSlot38 = angular.copy($scope.TimeSlot14);
                    }
                    else if ($scope.TimeSlot19 != 0 && $scope.TimeSlot20 != 0) {
                        $scope.TimeSlot1 = angular.copy($scope.TimeSlot19);
                        $scope.TimeSlot2 = angular.copy($scope.TimeSlot20);

                        $scope.TimeSlot7 = angular.copy($scope.TimeSlot19);
                        $scope.TimeSlot8 = angular.copy($scope.TimeSlot20);

                        $scope.TimeSlot13 = angular.copy($scope.TimeSlot19);
                        $scope.TimeSlot14 = angular.copy($scope.TimeSlot20);

                        $scope.TimeSlot25 = angular.copy($scope.TimeSlot19);
                        $scope.TimeSlot26 = angular.copy($scope.TimeSlot20);

                        $scope.TimeSlot31 = angular.copy($scope.TimeSlot19);
                        $scope.TimeSlot32 = angular.copy($scope.TimeSlot20);

                        $scope.TimeSlot37 = angular.copy($scope.TimeSlot19);
                        $scope.TimeSlot38 = angular.copy($scope.TimeSlot20);
                    }
                    else if ($scope.TimeSlot25 != 0 && $scope.TimeSlot26 != 0) {
                        $scope.TimeSlot1 = angular.copy($scope.TimeSlot25);
                        $scope.TimeSlot2 = angular.copy($scope.TimeSlot26);

                        $scope.TimeSlot7 = angular.copy($scope.TimeSlot25);
                        $scope.TimeSlot8 = angular.copy($scope.TimeSlot26);

                        $scope.TimeSlot13 = angular.copy($scope.TimeSlot25);
                        $scope.TimeSlot14 = angular.copy($scope.TimeSlot26);

                        $scope.TimeSlot19 = angular.copy($scope.TimeSlot25);
                        $scope.TimeSlot20 = angular.copy($scope.TimeSlot26);

                        $scope.TimeSlot31 = angular.copy($scope.TimeSlot25);
                        $scope.TimeSlot32 = angular.copy($scope.TimeSlot26);

                        $scope.TimeSlot37 = angular.copy($scope.TimeSlot25);
                        $scope.TimeSlot38 = angular.copy($scope.TimeSlot26);
                    }
                    else if ($scope.TimeSlot31 != 0 && $scope.TimeSlot32 != 0) {
                        $scope.TimeSlot1 = angular.copy($scope.TimeSlot31);
                        $scope.TimeSlot2 = angular.copy($scope.TimeSlot32);

                        $scope.TimeSlot7 = angular.copy($scope.TimeSlot31);
                        $scope.TimeSlot8 = angular.copy($scope.TimeSlot32);

                        $scope.TimeSlot13 = angular.copy($scope.TimeSlot31);
                        $scope.TimeSlot14 = angular.copy($scope.TimeSlot32);

                        $scope.TimeSlot19 = angular.copy($scope.TimeSlot31);
                        $scope.TimeSlot20 = angular.copy($scope.TimeSlot32);

                        $scope.TimeSlot25 = angular.copy($scope.TimeSlot31);
                        $scope.TimeSlot26 = angular.copy($scope.TimeSlot32);

                        $scope.TimeSlot37 = angular.copy($scope.TimeSlot31);
                        $scope.TimeSlot38 = angular.copy($scope.TimeSlot32);
                    }
                    else if ($scope.TimeSlot37 != 0 && $scope.TimeSlot38 != 0) {
                        $scope.TimeSlot1 = angular.copy($scope.TimeSlot37);
                        $scope.TimeSlot2 = angular.copy($scope.TimeSlot38);

                        $scope.TimeSlot7 = angular.copy($scope.TimeSlot37);
                        $scope.TimeSlot8 = angular.copy($scope.TimeSlot38);

                        $scope.TimeSlot13 = angular.copy($scope.TimeSlot37);
                        $scope.TimeSlot14 = angular.copy($scope.TimeSlot38);

                        $scope.TimeSlot19 = angular.copy($scope.TimeSlot37);
                        $scope.TimeSlot20 = angular.copy($scope.TimeSlot38);

                        $scope.TimeSlot25 = angular.copy($scope.TimeSlot37);
                        $scope.TimeSlot26 = angular.copy($scope.TimeSlot38);

                        $scope.TimeSlot31 = angular.copy($scope.TimeSlot37);
                        $scope.TimeSlot32 = angular.copy($scope.TimeSlot38);
                    }
                    else {
                        //alert('Please Enter Proper Shift FromTime And ToTime !');
                        toastr.info("Please Enter Proper Shift FromTime And ToTime !", "info");
                        $('#Shift1Select').prop('checked', false);
                        return false;
                    }
                    $("#chatLoaderPV").hide();
                }
            } else {
                $scope.TimeSlot1 = "";
                $scope.TimeSlot2 = "";
                $scope.TimeSlot7 = "";
                $scope.TimeSlot8 = "";
                $scope.TimeSlot13 = "";
                $scope.TimeSlot14 = "";
                $scope.TimeSlot19 = "";
                $scope.TimeSlot20 = "";
                $scope.TimeSlot25 = "";
                $scope.TimeSlot26 = "";
                $scope.TimeSlot31 = "";
                $scope.TimeSlot32 = "";
                $scope.TimeSlot37 = "";
                $scope.TimeSlot38 = "";
            }
        }

        $scope.Shift2_SelectAllClick = function (event) {
            var checked = $('#Shift2Select').is(":checked")
            if (checked == true) {
                if (($scope.TimeSlot3 == 0 && $scope.TimeSlot4 == 0) && ($scope.TimeSlot9 == 0 && $scope.TimeSlot10 == 0) && ($scope.TimeSlot15 == 0 && $scope.TimeSlot16 == 0) && ($scope.TimeSlot21 == 0 && $scope.TimeSlot22 == 0) &&
                    ($scope.TimeSlot27 == 0 && $scope.TimeSlot28 == 0) && ($scope.TimeSlot33 == 0 && $scope.TimeSlot34 == 0) && ($scope.TimeSlot39 == 0 && $scope.TimeSlot40 == 0)) {
                    //alert('Please Enter Any One Shift !');
                    toastr.warning("Please Enter Any One Shift !", "warning");
                    $('#Shift2Select').prop('checked', false);
                }
                else {
                    $("#chatLoaderPV").show();
                    if ($scope.TimeSlot3 != 0 && $scope.TimeSlot4 != 0) {
                        $scope.TimeSlot9 = angular.copy($scope.TimeSlot3);
                        $scope.TimeSlot10 = angular.copy($scope.TimeSlot4);

                        $scope.TimeSlot15 = angular.copy($scope.TimeSlot3);
                        $scope.TimeSlot16 = angular.copy($scope.TimeSlot4);

                        $scope.TimeSlot21 = angular.copy($scope.TimeSlot3);
                        $scope.TimeSlot22 = angular.copy($scope.TimeSlot4);

                        $scope.TimeSlot27 = angular.copy($scope.TimeSlot3);
                        $scope.TimeSlot28 = angular.copy($scope.TimeSlot4);

                        $scope.TimeSlot33 = angular.copy($scope.TimeSlot3);
                        $scope.TimeSlot34 = angular.copy($scope.TimeSlot4);

                        $scope.TimeSlot39 = angular.copy($scope.TimeSlot3);
                        $scope.TimeSlot40 = angular.copy($scope.TimeSlot4);
                    }
                    else if ($scope.TimeSlot9 != 0 && $scope.TimeSlot10 != 0) {
                        $scope.TimeSlot3 = angular.copy($scope.TimeSlot9);
                        $scope.TimeSlot4 = angular.copy($scope.TimeSlot10);

                        $scope.TimeSlot15 = angular.copy($scope.TimeSlot9);
                        $scope.TimeSlot16 = angular.copy($scope.TimeSlot10);

                        $scope.TimeSlot21 = angular.copy($scope.TimeSlot9);
                        $scope.TimeSlot22 = angular.copy($scope.TimeSlot10);

                        $scope.TimeSlot27 = angular.copy($scope.TimeSlot9);
                        $scope.TimeSlot28 = angular.copy($scope.TimeSlot10);

                        $scope.TimeSlot33 = angular.copy($scope.TimeSlot9);
                        $scope.TimeSlot34 = angular.copy($scope.TimeSlot10);

                        $scope.TimeSlot39 = angular.copy($scope.TimeSlot9);
                        $scope.TimeSlot40 = angular.copy($scope.TimeSlot10);
                    }
                    else if ($scope.TimeSlot15 != 0 && $scope.TimeSlot16 != 0) {
                        $scope.TimeSlot3 = angular.copy($scope.TimeSlot15);
                        $scope.TimeSlot4 = angular.copy($scope.TimeSlot16);

                        $scope.TimeSlot9 = angular.copy($scope.TimeSlot15);
                        $scope.TimeSlot10 = angular.copy($scope.TimeSlot16);

                        $scope.TimeSlot21 = angular.copy($scope.TimeSlot15);
                        $scope.TimeSlot22 = angular.copy($scope.TimeSlot16);

                        $scope.TimeSlot27 = angular.copy($scope.TimeSlot15);
                        $scope.TimeSlot28 = angular.copy($scope.TimeSlot16);

                        $scope.TimeSlot33 = angular.copy($scope.TimeSlot15);
                        $scope.TimeSlot34 = angular.copy($scope.TimeSlot16);

                        $scope.TimeSlot39 = angular.copy($scope.TimeSlot15);
                        $scope.TimeSlot40 = angular.copy($scope.TimeSlot16);
                    }
                    else if ($scope.TimeSlot21 != 0 && $scope.TimeSlot22 != 0) {
                        $scope.TimeSlot3 = angular.copy($scope.TimeSlot21);
                        $scope.TimeSlot4 = angular.copy($scope.TimeSlot22);

                        $scope.TimeSlot9 = angular.copy($scope.TimeSlot21);
                        $scope.TimeSlot10 = angular.copy($scope.TimeSlot22);

                        $scope.TimeSlot15 = angular.copy($scope.TimeSlot21);
                        $scope.TimeSlot16 = angular.copy($scope.TimeSlot22);

                        $scope.TimeSlot27 = angular.copy($scope.TimeSlot21);
                        $scope.TimeSlot28 = angular.copy($scope.TimeSlot22);

                        $scope.TimeSlot33 = angular.copy($scope.TimeSlot21);
                        $scope.TimeSlot34 = angular.copy($scope.TimeSlot22);

                        $scope.TimeSlot39 = angular.copy($scope.TimeSlot21);
                        $scope.TimeSlot40 = angular.copy($scope.TimeSlot22);
                    }
                    else if ($scope.TimeSlot27 != 0 && $scope.TimeSlot28 != 0) {
                        $scope.TimeSlot3 = angular.copy($scope.TimeSlot27);
                        $scope.TimeSlot4 = angular.copy($scope.TimeSlot28);

                        $scope.TimeSlot9 = angular.copy($scope.TimeSlot27);
                        $scope.TimeSlot10 = angular.copy($scope.TimeSlot28);

                        $scope.TimeSlot15 = angular.copy($scope.TimeSlot27);
                        $scope.TimeSlot16 = angular.copy($scope.TimeSlot28);

                        $scope.TimeSlot21 = angular.copy($scope.TimeSlot27);
                        $scope.TimeSlot22 = angular.copy($scope.TimeSlot28);

                        $scope.TimeSlot33 = angular.copy($scope.TimeSlot27);
                        $scope.TimeSlot34 = angular.copy($scope.TimeSlot28);

                        $scope.TimeSlot39 = angular.copy($scope.TimeSlot27);
                        $scope.TimeSlot40 = angular.copy($scope.TimeSlot28);
                    }
                    else if ($scope.TimeSlot33 != 0 && $scope.TimeSlot34 != 0) {
                        $scope.TimeSlot3 = angular.copy($scope.TimeSlot33);
                        $scope.TimeSlot4 = angular.copy($scope.TimeSlot34);

                        $scope.TimeSlot9 = angular.copy($scope.TimeSlot33);
                        $scope.TimeSlot10 = angular.copy($scope.TimeSlot34);

                        $scope.TimeSlot15 = angular.copy($scope.TimeSlot33);
                        $scope.TimeSlot16 = angular.copy($scope.TimeSlot34);

                        $scope.TimeSlot21 = angular.copy($scope.TimeSlot33);
                        $scope.TimeSlot22 = angular.copy($scope.TimeSlot34);

                        $scope.TimeSlot27 = angular.copy($scope.TimeSlot33);
                        $scope.TimeSlot28 = angular.copy($scope.TimeSlot34);

                        $scope.TimeSlot39 = angular.copy($scope.TimeSlot33);
                        $scope.TimeSlot40 = angular.copy($scope.TimeSlot34);
                    }
                    else if ($scope.TimeSlot39 != 0 && $scope.TimeSlot40 != 0) {
                        $scope.TimeSlot3 = angular.copy($scope.TimeSlot39);
                        $scope.TimeSlot4 = angular.copy($scope.TimeSlot40);

                        $scope.TimeSlot9 = angular.copy($scope.TimeSlot39);
                        $scope.TimeSlot10 = angular.copy($scope.TimeSlot40);

                        $scope.TimeSlot15 = angular.copy($scope.TimeSlot39);
                        $scope.TimeSlot16 = angular.copy($scope.TimeSlot40);

                        $scope.TimeSlot21 = angular.copy($scope.TimeSlot39);
                        $scope.TimeSlot22 = angular.copy($scope.TimeSlot40);

                        $scope.TimeSlot27 = angular.copy($scope.TimeSlot39);
                        $scope.TimeSlot28 = angular.copy($scope.TimeSlot40);

                        $scope.TimeSlot33 = angular.copy($scope.TimeSlot39);
                        $scope.TimeSlot34 = angular.copy($scope.TimeSlot40);
                    }
                    else {
                        alert('Please Enter Proper Shift FromTime And ToTime !');
                        $('#Shift2Select').prop('checked', false);
                        return false;
                    }
                    $("#chatLoaderPV").hide();
                }
            } else {
                $scope.TimeSlot3 = "";
                $scope.TimeSlot4 = "";
                $scope.TimeSlot9 = "";
                $scope.TimeSlot10 = "";
                $scope.TimeSlot15 = "";
                $scope.TimeSlot16 = "";
                $scope.TimeSlot21 = "";
                $scope.TimeSlot22 = "";
                $scope.TimeSlot27 = "";
                $scope.TimeSlot28 = "";
                $scope.TimeSlot33 = "";
                $scope.TimeSlot34 = "";
                $scope.TimeSlot39 = "";
                $scope.TimeSlot40 = "";

            }
        }

        $scope.Shift3_SelectAllClick = function (event) {
            var checked = $('#Shift3Select').is(":checked")
            if (checked == true) {
                if (($scope.TimeSlot5 == 0 && $scope.TimeSlot6 == 0) && ($scope.TimeSlot11 == 0 && $scope.TimeSlot12 == 0) && ($scope.TimeSlot17 == 0 && $scope.TimeSlot18 == 0) && ($scope.TimeSlot23 == 0 && $scope.TimeSlot24 == 0) &&
                    ($scope.TimeSlot29 == 0 && $scope.TimeSlot30 == 0) && ($scope.TimeSlot35 == 0 && $scope.TimeSlot36 == 0) && ($scope.TimeSlot41 == 0 && $scope.TimeSlot42 == 0)) {
                    //alert('Please Enter Any One Shift !');
                    toastr.warning("Please Enter Any One Shift!", "warning");
                    $('#Shift3Select').prop('checked', false);
                }
                else {
                    $("#chatLoaderPV").show();
                    if ($scope.TimeSlot5 != 0 && $scope.TimeSlot6 != 0) {
                        $scope.TimeSlot11 = angular.copy($scope.TimeSlot5);
                        $scope.TimeSlot12 = angular.copy($scope.TimeSlot6);

                        $scope.TimeSlot17 = angular.copy($scope.TimeSlot5);
                        $scope.TimeSlot18 = angular.copy($scope.TimeSlot6);

                        $scope.TimeSlot23 = angular.copy($scope.TimeSlot5);
                        $scope.TimeSlot24 = angular.copy($scope.TimeSlot6);

                        $scope.TimeSlot29 = angular.copy($scope.TimeSlot5);
                        $scope.TimeSlot30 = angular.copy($scope.TimeSlot6);

                        $scope.TimeSlot35 = angular.copy($scope.TimeSlot5);
                        $scope.TimeSlot36 = angular.copy($scope.TimeSlot6);

                        $scope.TimeSlot41 = angular.copy($scope.TimeSlot5);
                        $scope.TimeSlot42 = angular.copy($scope.TimeSlot6);
                    }
                    else if ($scope.TimeSlot11 != 0 && $scope.TimeSlot12 != 0) {
                        $scope.TimeSlot5 = angular.copy($scope.TimeSlot11);
                        $scope.TimeSlot6 = angular.copy($scope.TimeSlot12);

                        $scope.TimeSlot17 = angular.copy($scope.TimeSlot11);
                        $scope.TimeSlot18 = angular.copy($scope.TimeSlot12);

                        $scope.TimeSlot23 = angular.copy($scope.TimeSlot11);
                        $scope.TimeSlot24 = angular.copy($scope.TimeSlot12);

                        $scope.TimeSlot29 = angular.copy($scope.TimeSlot11);
                        $scope.TimeSlot30 = angular.copy($scope.TimeSlot12);

                        $scope.TimeSlot35 = angular.copy($scope.TimeSlot11);
                        $scope.TimeSlot36 = angular.copy($scope.TimeSlot12);

                        $scope.TimeSlot41 = angular.copy($scope.TimeSlot11);
                        $scope.TimeSlot42 = angular.copy($scope.TimeSlot12);
                    }
                    else if ($scope.TimeSlot17 != 0 && $scope.TimeSlot18 != 0) {
                        $scope.TimeSlot5 = angular.copy($scope.TimeSlot17);
                        $scope.TimeSlot6 = angular.copy($scope.TimeSlot18);

                        $scope.TimeSlot11 = angular.copy($scope.TimeSlot17);
                        $scope.TimeSlot12 = angular.copy($scope.TimeSlot18);

                        $scope.TimeSlot23 = angular.copy($scope.TimeSlot17);
                        $scope.TimeSlot24 = angular.copy($scope.TimeSlot18);

                        $scope.TimeSlot29 = angular.copy($scope.TimeSlot17);
                        $scope.TimeSlot30 = angular.copy($scope.TimeSlot18);

                        $scope.TimeSlot35 = angular.copy($scope.TimeSlot17);
                        $scope.TimeSlot36 = angular.copy($scope.TimeSlot18);

                        $scope.TimeSlot41 = angular.copy($scope.TimeSlot17);
                        $scope.TimeSlot42 = angular.copy($scope.TimeSlot18);
                    }
                    else if ($scope.TimeSlot23 != 0 && $scope.TimeSlot24 != 0) {
                        $scope.TimeSlot5 = angular.copy($scope.TimeSlot23);
                        $scope.TimeSlot6 = angular.copy($scope.TimeSlot24);

                        $scope.TimeSlot11 = angular.copy($scope.TimeSlot23);
                        $scope.TimeSlot12 = angular.copy($scope.TimeSlot24);

                        $scope.TimeSlot17 = angular.copy($scope.TimeSlot23);
                        $scope.TimeSlot18 = angular.copy($scope.TimeSlot24);

                        $scope.TimeSlot29 = angular.copy($scope.TimeSlot23);
                        $scope.TimeSlot30 = angular.copy($scope.TimeSlot24);

                        $scope.TimeSlot35 = angular.copy($scope.TimeSlot23);
                        $scope.TimeSlot36 = angular.copy($scope.TimeSlot24);

                        $scope.TimeSlot41 = angular.copy($scope.TimeSlot23);
                        $scope.TimeSlot42 = angular.copy($scope.TimeSlot24);
                    }
                    else if ($scope.TimeSlot29 != 0 && $scope.TimeSlot30 != 0) {
                        $scope.TimeSlot5 = angular.copy($scope.TimeSlot29);
                        $scope.TimeSlot6 = angular.copy($scope.TimeSlot30);

                        $scope.TimeSlot11 = angular.copy($scope.TimeSlot29);
                        $scope.TimeSlot12 = angular.copy($scope.TimeSlot30);

                        $scope.TimeSlot17 = angular.copy($scope.TimeSlot29);
                        $scope.TimeSlot18 = angular.copy($scope.TimeSlot30);

                        $scope.TimeSlot23 = angular.copy($scope.TimeSlot29);
                        $scope.TimeSlot24 = angular.copy($scope.TimeSlot30);

                        $scope.TimeSlot35 = angular.copy($scope.TimeSlot29);
                        $scope.TimeSlot36 = angular.copy($scope.TimeSlot30);

                        $scope.TimeSlot41 = angular.copy($scope.TimeSlot29);
                        $scope.TimeSlot42 = angular.copy($scope.TimeSlot30);
                    }
                    else if ($scope.TimeSlot35 != 0 && $scope.TimeSlot36 != 0) {
                        $scope.TimeSlot5 = angular.copy($scope.TimeSlot35);
                        $scope.TimeSlot6 = angular.copy($scope.TimeSlot36);

                        $scope.TimeSlot11 = angular.copy($scope.TimeSlot35);
                        $scope.TimeSlot12 = angular.copy($scope.TimeSlot36);

                        $scope.TimeSlot17 = angular.copy($scope.TimeSlot35);
                        $scope.TimeSlot18 = angular.copy($scope.TimeSlot36);

                        $scope.TimeSlot23 = angular.copy($scope.TimeSlot35);
                        $scope.TimeSlot24 = angular.copy($scope.TimeSlot36);

                        $scope.TimeSlot29 = angular.copy($scope.TimeSlot35);
                        $scope.TimeSlot30 = angular.copy($scope.TimeSlot36);

                        $scope.TimeSlot41 = angular.copy($scope.TimeSlot35);
                        $scope.TimeSlot42 = angular.copy($scope.TimeSlot36);
                    }
                    else if ($scope.TimeSlot41 != 0 && $scope.TimeSlot42 != 0) {
                        $scope.TimeSlot5 = angular.copy($scope.TimeSlot41);
                        $scope.TimeSlot6 = angular.copy($scope.TimeSlot42);

                        $scope.TimeSlot11 = angular.copy($scope.TimeSlot41);
                        $scope.TimeSlot12 = angular.copy($scope.TimeSlot42);

                        $scope.TimeSlot17 = angular.copy($scope.TimeSlot41);
                        $scope.TimeSlot18 = angular.copy($scope.TimeSlot42);

                        $scope.TimeSlot23 = angular.copy($scope.TimeSlot41);
                        $scope.TimeSlot24 = angular.copy($scope.TimeSlot42);

                        $scope.TimeSlot29 = angular.copy($scope.TimeSlot41);
                        $scope.TimeSlot30 = angular.copy($scope.TimeSlot42);

                        $scope.TimeSlot35 = angular.copy($scope.TimeSlot41);
                        $scope.TimeSlot36 = angular.copy($scope.TimeSlot42);
                    }
                    else {
                        //alert('Please Enter Proper Shift FromTime And ToTime !');
                        toastr.warning("Please Enter Proper Shift FromTime And ToTime!", "warning");
                        $('#Shift3Select').prop('checked', false);
                        return false;
                    }
                    $("#chatLoaderPV").hide();
                }
            } else {
                $scope.TimeSlot5 = "";
                $scope.TimeSlot6 = "";
                $scope.TimeSlot11 = "";
                $scope.TimeSlot12 = "";
                $scope.TimeSlot17 = "";
                $scope.TimeSlot18 = "";
                $scope.TimeSlot23 = "";
                $scope.TimeSlot24 = "";
                $scope.TimeSlot29 = "";
                $scope.TimeSlot30 = "";
                $scope.TimeSlot35 = "";
                $scope.TimeSlot36 = "";
                $scope.TimeSlot41 = "";
                $scope.TimeSlot42 = "";
            }
        }

        $scope.Shift4_SelectAllClick = function (event) {
            var checked = $('#Shift4Select').is(":checked")
            if (checked == true) {
                if (($scope.TimeSlot43 == 0 && $scope.TimeSlot44 == 0) && ($scope.TimeSlot45 == 0 && $scope.TimeSlot46 == 0) && ($scope.TimeSlot47 == 0 && $scope.TimeSlot48 == 0) && ($scope.TimeSlot49 == 0 && $scope.TimeSlot50 == 0) &&
                    ($scope.TimeSlot51 == 0 && $scope.TimeSlot52 == 0) && ($scope.TimeSlot53 == 0 && $scope.TimeSlot54 == 0) && ($scope.TimeSlot55 == 0 && $scope.TimeSlot56 == 0)) {
                    //alert('Please Enter Any One Shift !');
                    toastr.warning("Please Enter Any One Shift!", "warning");
                    $('#Shift4Select').prop('checked', false);
                }
                else {
                    $("#chatLoaderPV").show();
                    if ($scope.TimeSlot43 != 0 && $scope.TimeSlot44 != 0) {
                        $scope.TimeSlot45 = angular.copy($scope.TimeSlot43);
                        $scope.TimeSlot46 = angular.copy($scope.TimeSlot44);

                        $scope.TimeSlot47 = angular.copy($scope.TimeSlot43);
                        $scope.TimeSlot48 = angular.copy($scope.TimeSlot44);

                        $scope.TimeSlot49 = angular.copy($scope.TimeSlot43);
                        $scope.TimeSlot50 = angular.copy($scope.TimeSlot44);

                        $scope.TimeSlot51 = angular.copy($scope.TimeSlot43);
                        $scope.TimeSlot52 = angular.copy($scope.TimeSlot44);

                        $scope.TimeSlot53 = angular.copy($scope.TimeSlot43);
                        $scope.TimeSlot54 = angular.copy($scope.TimeSlot44);

                        $scope.TimeSlot55 = angular.copy($scope.TimeSlot43);
                        $scope.TimeSlot56 = angular.copy($scope.TimeSlot44);
                    }
                    else if ($scope.TimeSlot45 != 0 && $scope.TimeSlot46 != 0) {
                        $scope.TimeSlot43 = angular.copy($scope.TimeSlot45);
                        $scope.TimeSlot44 = angular.copy($scope.TimeSlot46);

                        $scope.TimeSlot47 = angular.copy($scope.TimeSlot45);
                        $scope.TimeSlot48 = angular.copy($scope.TimeSlot46);

                        $scope.TimeSlot49 = angular.copy($scope.TimeSlot45);
                        $scope.TimeSlot50 = angular.copy($scope.TimeSlot46);

                        $scope.TimeSlot51 = angular.copy($scope.TimeSlot45);
                        $scope.TimeSlot52 = angular.copy($scope.TimeSlot46);

                        $scope.TimeSlot53 = angular.copy($scope.TimeSlot45);
                        $scope.TimeSlot54 = angular.copy($scope.TimeSlot46);

                        $scope.TimeSlot55 = angular.copy($scope.TimeSlot45);
                        $scope.TimeSlot56 = angular.copy($scope.TimeSlot46);
                    }
                    else if ($scope.TimeSlot47 != 0 && $scope.TimeSlot48 != 0) {
                        $scope.TimeSlot43 = angular.copy($scope.TimeSlot47);
                        $scope.TimeSlot44 = angular.copy($scope.TimeSlot48);

                        $scope.TimeSlot45 = angular.copy($scope.TimeSlot47);
                        $scope.TimeSlot46 = angular.copy($scope.TimeSlot48);

                        $scope.TimeSlot49 = angular.copy($scope.TimeSlot47);
                        $scope.TimeSlot50 = angular.copy($scope.TimeSlot48);

                        $scope.TimeSlot51 = angular.copy($scope.TimeSlot47);
                        $scope.TimeSlot52 = angular.copy($scope.TimeSlot48);

                        $scope.TimeSlot53 = angular.copy($scope.TimeSlot47);
                        $scope.TimeSlot54 = angular.copy($scope.TimeSlot48);

                        $scope.TimeSlot55 = angular.copy($scope.TimeSlot47);
                        $scope.TimeSlot56 = angular.copy($scope.TimeSlot48);
                    }
                    else if ($scope.TimeSlot49 != 0 && $scope.TimeSlot50 != 0) {
                        $scope.TimeSlot43 = angular.copy($scope.TimeSlot49);
                        $scope.TimeSlot44 = angular.copy($scope.TimeSlot50);

                        $scope.TimeSlot45 = angular.copy($scope.TimeSlot49);
                        $scope.TimeSlot46 = angular.copy($scope.TimeSlot50);

                        $scope.TimeSlot47 = angular.copy($scope.TimeSlot49);
                        $scope.TimeSlot48 = angular.copy($scope.TimeSlot50);

                        $scope.TimeSlot51 = angular.copy($scope.TimeSlot49);
                        $scope.TimeSlot52 = angular.copy($scope.TimeSlot50);

                        $scope.TimeSlot53 = angular.copy($scope.TimeSlot49);
                        $scope.TimeSlot54 = angular.copy($scope.TimeSlot50);

                        $scope.TimeSlot55 = angular.copy($scope.TimeSlot49);
                        $scope.TimeSlot56 = angular.copy($scope.TimeSlot50);
                    }
                    else if ($scope.TimeSlot51 != 0 && $scope.TimeSlot52 != 0) {
                        $scope.TimeSlot43 = angular.copy($scope.TimeSlot51);
                        $scope.TimeSlot44 = angular.copy($scope.TimeSlot52);

                        $scope.TimeSlot45 = angular.copy($scope.TimeSlot51);
                        $scope.TimeSlot46 = angular.copy($scope.TimeSlot52);

                        $scope.TimeSlot47 = angular.copy($scope.TimeSlot51);
                        $scope.TimeSlot48 = angular.copy($scope.TimeSlot52);

                        $scope.TimeSlot49 = angular.copy($scope.TimeSlot51);
                        $scope.TimeSlot50 = angular.copy($scope.TimeSlot52);

                        $scope.TimeSlot53 = angular.copy($scope.TimeSlot51);
                        $scope.TimeSlot54 = angular.copy($scope.TimeSlot52);

                        $scope.TimeSlot55 = angular.copy($scope.TimeSlot51);
                        $scope.TimeSlot56 = angular.copy($scope.TimeSlot52);
                    }
                    else if ($scope.TimeSlot53 != 0 && $scope.TimeSlot54 != 0) {
                        $scope.TimeSlot43 = angular.copy($scope.TimeSlot53);
                        $scope.TimeSlot44 = angular.copy($scope.TimeSlot54);

                        $scope.TimeSlot45 = angular.copy($scope.TimeSlot53);
                        $scope.TimeSlot46 = angular.copy($scope.TimeSlot54);

                        $scope.TimeSlot47 = angular.copy($scope.TimeSlot53);
                        $scope.TimeSlot48 = angular.copy($scope.TimeSlot54);

                        $scope.TimeSlot49 = angular.copy($scope.TimeSlot53);
                        $scope.TimeSlot50 = angular.copy($scope.TimeSlot54);

                        $scope.TimeSlot51 = angular.copy($scope.TimeSlot53);
                        $scope.TimeSlot52 = angular.copy($scope.TimeSlot54);

                        $scope.TimeSlot55 = angular.copy($scope.TimeSlot53);
                        $scope.TimeSlot56 = angular.copy($scope.TimeSlot54);
                    }
                    else if ($scope.TimeSlot55 != 0 && $scope.TimeSlot56 != 0) {
                        $scope.TimeSlot43 = angular.copy($scope.TimeSlot55);
                        $scope.TimeSlot44 = angular.copy($scope.TimeSlot56);

                        $scope.TimeSlot45 = angular.copy($scope.TimeSlot55);
                        $scope.TimeSlot46 = angular.copy($scope.TimeSlot56);

                        $scope.TimeSlot47 = angular.copy($scope.TimeSlot55);
                        $scope.TimeSlot48 = angular.copy($scope.TimeSlot56);

                        $scope.TimeSlot49 = angular.copy($scope.TimeSlot55);
                        $scope.TimeSlot50 = angular.copy($scope.TimeSlot56);

                        $scope.TimeSlot51 = angular.copy($scope.TimeSlot55);
                        $scope.TimeSlot52 = angular.copy($scope.TimeSlot56);

                        $scope.TimeSlot53 = angular.copy($scope.TimeSlot55);
                        $scope.TimeSlot54 = angular.copy($scope.TimeSlot56);
                    }
                    else {
                        //alert('Please Enter Proper Shift FromTime And ToTime !');
                        toastr.info("Please Enter Proper Shift FromTime And ToTime !", "info");
                        $('#Shift4Select').prop('checked', false);
                        return false;
                    }
                    $("#chatLoaderPV").hide();
                }
            } else {
                $scope.TimeSlot43 = "";
                $scope.TimeSlot44 = "";
                $scope.TimeSlot45 = "";
                $scope.TimeSlot46 = "";
                $scope.TimeSlot47 = "";
                $scope.TimeSlot48 = "";
                $scope.TimeSlot49 = "";
                $scope.TimeSlot50 = "";
                $scope.TimeSlot51 = "";
                $scope.TimeSlot52 = "";
                $scope.TimeSlot53 = "";
                $scope.TimeSlot54 = "";
                $scope.TimeSlot55 = "";
                $scope.TimeSlot56 = "";
            }
        }

        $scope.SundayClick = function (event) {
            var checked = $('#SundayId').is(":checked")
            if (checked == true) {
                $('#SundayCheck').show();
            } else {
                $('#SundayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Sun") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }

        $scope.MondayClick = function (event) {
            var checked = $('#MondayId').is(":checked")
            if (checked == true) {
                $('#MondayCheck').show();
            } else {
                $('#MondayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Mon") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }

        $scope.TuesdayClick = function (event) {
            var checked = $('#TuesdayId').is(":checked")
            if (checked == true) {
                $('#TuesdayCheck').show();
            } else {
                $('#TuesdayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Tue") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }

        $scope.WednesdayClick = function (event) {
            var checked = $('#WednesdayId').is(":checked")
            if (checked == true) {
                $('#WednesdayCheck').show();
            } else {
                $('#WednesdayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Wed") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }

        $scope.ThursdayClick = function (event) {
            var checked = $('#ThursdayId').is(":checked")
            if (checked == true) {
                $('#ThursdayCheck').show();
            } else {
                $('#ThursdayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Thu") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }

        $scope.FridayClick = function (event) {
            var checked = $('#FridayId').is(":checked")
            if (checked == true) {
                $('#FridayCheck').show();
            } else {
                $('#FridayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Fri") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }

        $scope.SaturdayClick = function (event) {
            var checked = $('#SaturdayId').is(":checked")
            if (checked == true) {
                $('#SaturdayCheck').show();
            } else {
                $('#SaturdayCheck').hide();
            }
            angular.forEach($scope.SelectedDays, function (value, index) {
                var Day = new Date(value.Day).toString();
                if (Day.includes("Sat") == true) {
                    if (checked == true) {
                        value.exist = 1;
                    } else {
                        value.exist = 0;
                    }
                }
            });
        }


        $scope.CancelSlot = function () {
            angular.element('#DoctorShiftModal').modal('hide');
        }
        $scope.CancelDoctorShift = function () {
            $scope.DoctorShiftClear();
            angular.element('#DoctorShiftModal').modal('hide');
        }
        $scope.CancelDoctorShift = function () {
            $scope.DoctorShiftClear();
            angular.element('#DoctorShiftModal').modal('hide');
        }
        $scope.ViewAppoinmentpopup = function () {
            angular.element('#ViewDoctorShiftModal').modal('show');
        }

        $scope.DoctorShift_InsertUpdate = function () {
            if ($scope.ValidationcontrolsDoctorShift() == true) {
                /*$("#chatLoaderPV").show();*/
                /*document.getElementById("saveDoctorShift").disabled = true;*/
                $scope.SelectedDepartment_List = [];
                angular.forEach($scope.SelectedDepartment, function (value, index) {
                    var obj = {
                        //ID: 0,
                        Id: value,
                        IsActive: 1
                    }
                    $scope.SelectedDepartment_List.push(obj);
                });
                $scope.SelectedSpecialist_List = [];
                angular.forEach($scope.SelectedSpecialist, function (value, index) {
                    var obj = {
                        //ID: 0,
                        DoctorId: value,
                        IsActive: 1
                    }
                    $scope.SelectedSpecialist_List.push(obj);
                });
                $scope.SelectedCCCG_List = [];
                angular.forEach($scope.SelectedCCCG, function (value, index) {
                    var obj = {
                        //ID: 0,
                        CcCg_Id: value,
                        IsActive: 1
                    }
                    $scope.SelectedCCCG_List.push(obj);
                });

                angular.forEach($scope.SelectedDays, function (value, index) {
                    var Day = new Date(value.Day).toString();
                    if (Day.includes("Sun") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot1), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot2), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot3), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot4), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot5), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot6), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot43), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot44), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    else if (Day.includes("Mon") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot7), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot8), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot9), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot10), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot11), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot12), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot45), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot46), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    else if (Day.includes("Tue") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot13), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot14), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot15), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot16), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot17), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot18), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot47), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot48), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    else if (Day.includes("Wed") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot19), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot20), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot21), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot22), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot23), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot24), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot49), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot50), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    else if (Day.includes("Thu") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot25), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot26), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot27), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot28), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot29), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot30), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot51), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot52), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    else if (Day.includes("Fri") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot31), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot32), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot33), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot34), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot35), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot36), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot53), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot54), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    else if (Day.includes("Sat") == true && value.exist == 1) {
                        var shift1 = {};
                        shift1 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot37), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot38), Shift: 1 }
                        value.TimeSlot[0] = shift1;

                        var shift2 = {};
                        shift2 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot39), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot40), Shift: 2 }
                        value.TimeSlot[1] = shift2;

                        var shift3 = {};
                        shift3 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot41), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot42), Shift: 3 }
                        value.TimeSlot[2] = shift3;

                        var shift4 = {};
                        shift4 = { TimeSlotFromTime: Convert12To24Timeformat($scope.TimeSlot55), TimeSlotToTime: Convert12To24Timeformat($scope.TimeSlot56), Shift: 4 }
                        value.TimeSlot[3] = shift4;
                    }
                    value.Day = moment(value.Day).format('DD-MMM-YYYY');
                });
                var daylen = $scope.SelectedDays.length;
                var chk2 = 0;
                for (let i = 0; i < daylen; i++) {
                    var dateName = '';
                    if (new Date($scope.SelectedDays[i].Day).toString().includes('Sun')) {
                        dateName = 'Sunday';
                    } else if (new Date($scope.SelectedDays[i].Day).toString().includes('Mon')) {
                        dateName = 'Monday';
                    } else if (new Date($scope.SelectedDays[i].Day).toString().includes('Tue')) {
                        dateName = 'Tuesday';
                    } else if (new Date($scope.SelectedDays[i].Day).toString().includes('Wed')) {
                        dateName = 'Wednesday';
                    } else if (new Date($scope.SelectedDays[i].Day).toString().includes('Thu')) {
                        dateName = 'Thursday';
                    } else if (new Date($scope.SelectedDays[i].Day).toString().includes('Fri')) {
                        dateName = 'Friday';
                    } else if (new Date($scope.SelectedDays[i].Day).toString().includes('Sat')) {
                        dateName = 'Saturday';
                    }
                    var y = $scope.SelectedDays[i].TimeSlot.filter(x => x.TimeSlotFromTime === null && x.TimeSlotToTime === null);
                    if (y.length === 4 && $scope.SelectedDays[i].exist == 1) {
                        //alert('Please Enter any one time slot for ' + dateName + '');
                        toastr.warning('Please Enter any one time slot for ' + dateName + '', "warning");
                        chk2 = 1;
                        break;
                    }
                    y = $scope.SelectedDays[i].TimeSlot.filter(x => x.TimeSlotFromTime !== null && x.TimeSlotToTime === null);
                    if (y.length > 0) {
                        //alert('Please Enter To time slot for ' + dateName + '');
                        toastr.warning('Please Enter To time slot for ' + dateName + '', "warning");
                        chk2 = 1;
                        break;
                    }
                    y = $scope.SelectedDays[i].TimeSlot.filter(x => x.TimeSlotFromTime === null && x.TimeSlotToTime !== null);
                    if (y.length > 0) {
                        //alert('Please Enter From time slot for ' + dateName + '');
                        toastr.warning('Please Enter From time slot for ' + dateName + '', "warning");
                        chk2 = 1;
                        break;
                    }
                }
                if (chk2 === 1) {
                    return false;
                }
                var chk = 2;
                for (let y = 0; y < daylen; y++) {
                    var timeshift = $scope.SelectedDays[y].TimeSlot.length;
                    var arr = [];
                    for (let z = 0; z < timeshift; z++) {
                        if ($scope.SelectedDays[y].TimeSlot[z].TimeSlotFromTime !== null && $scope.SelectedDays[y].TimeSlot[z].TimeSlotToTime !== null && $scope.SelectedDays[y].exist == 1) {
                            var from = new Date($scope.SelectedDays[y].Day + ' ' + $scope.SelectedDays[y].TimeSlot[z].TimeSlotFromTime).getTime();
                            var to = new Date($scope.SelectedDays[y].Day + ' ' + $scope.SelectedDays[y].TimeSlot[z].TimeSlotToTime).getTime();
                            if (arr.length == 0) {
                                if (from < to) {
                                    arr.push({ from: from, to: to });
                                } else {
                                    chk = 0;
                                    break;
                                }
                            } else {
                                var len = arr.length;
                                for (let x = 0; x < len; x++) {
                                    if (from > to) {
                                        chk = 0;
                                        break;
                                    } else {
                                        if (arr[x].from < from && arr[x].to < from && arr[x].from < to && arr[x].to < to) {
                                            arr.push({ from: from, to: to });
                                            chk = 1;
                                        } else {
                                            chk = 0;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (chk === 0) {
                                break;
                            }
                        }
                    }
                    if (chk === 0) {
                        break;
                    }
                }
                var selectedCheckedDays = $scope.SelectedDays.filter(x => x.exist == 1);
                if (selectedCheckedDays.length <= 0) {
                    chk = 3;
                }
                if (chk === 1 || chk == 2) {
                    angular.forEach($scope.SelectedDays, function (value, index) {
                        for (let i = 3; i >= 0; i--) {
                            const y = $scope.SelectedDays[index].TimeSlot.filter(x => (x.TimeSlotFromTime === null && x.TimeSlotToTime === null) || (x.TimeSlotFromTime === undefined && x.TimeSlotToTime === undefined));
                            if (y.length !== 0) {
                                const h = $scope.SelectedDays[index].TimeSlot.findIndex(x => x.TimeSlotFromTime === null && x.TimeSlotToTime === null);
                                $scope.SelectedDays[index].TimeSlot.splice(h, 1);
                            }
                        }
                    });
                    //var seldays = $scope.SelectedDays.length;
                    //for (i = seldays - 1; i >= 0; i--) {
                    //    if ($scope.SelectedDays[i].exist == 0) {
                    //        $scope.SelectedDays.splice(i, 1);
                    //    }
                    //}
                    var obj = {
                        ID: $scope.Id,
                        Institution_Id: $window.localStorage['InstitutionId'],
                        CreatedBy: $window.localStorage['UserId'],
                        SelectDepartment: $scope.SelectedDepartment_List,
                        Doctor_Id: $scope.SelectedSpecialist_List,
                        CC_CG: $scope.SelectedCCCG_List,
                        FromDate: $scope.FromDate,
                        ToDate: $scope.ToDate,
                        NewAppointment: $scope.NewAppointment,
                        FollowUp: $scope.followup,
                        NewAppointmentPrice: $scope.NewAppointmentPrice,
                        FollowUpPrice: $scope.followupPrice,
                        Intervel: $scope.IntervalBt,
                        CustomSlot: parseInt($scope.CustomSlot),
                        BookingOpen: $scope.Days,
                        BookingCancelLock: parseInt($scope.Minutes),
                        SelectedDaysList: selectedCheckedDays
                    };
                    $('#saveDoctorShift1').attr("disabled", true);
                    $('#saveDoctorShift2').attr("disabled", true);
                    $('#saveDoctorShift3').attr("disabled", true);
                    $("#chatLoaderPV").show();
                    $http.post(baseUrl + '/api/PatientAppointments/AddDoctorShiftInsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        $('#saveDoctorShift1').attr("disabled", false);
                        $('#saveDoctorShift2').attr("disabled", false);
                        $('#saveDoctorShift3').attr("disabled", false);
                        $("#chatLoaderPV").hide();
                        if (data.ReturnFlag == 1) {
                            $scope.DoctorShiftClear();
                            $scope.CancelDoctorShift();
                            $scope.DoctorShiftListGo();
                        }
                        else {
                            return false;
                        }

                    }).error(function (data) {
                        $scope.error = "An error has occurred while Adding Docor Shift" + data;
                    });
                } else if (chk == 0) {
                    //alert('Please Enter Valid Timeslot!');
                    toastr.warning("Please Enter Valid Timeslot!", "warning");
                } else if (chk == 3) {
                    //alert('Please Select Any One Day');
                    toastr.warning("Please Select Any One Day", "warning");
                }
            }
        }
        /* THIS IS FOR VALIDATION CONTROL FOR DOCTOR SHIFT TIME SLOT */
        $scope.TimeSlotValidationCheck = function () {
            var SlotChecking = [];
            angular.forEach($scope.SelectedDays, function (value, index) {
                if ($('#SundayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('Sunday Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("Sunday Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
                if ($('#MondayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('Monday Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("Monday Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
                if ($('#TuesdayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('TuesDay Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("TuesDay Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
                if ($('#WednesdayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('WednesDay Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("WednesDay Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
                if ($('#ThursdayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('ThursDay Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("ThursDay Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
                if ($('#FridayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('Friday Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("Friday Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
                if ($('#SaturdayId').prop('disabled') == false) {
                    angular.forEach(value.TimeSlot, function (value1, index1) {
                        if (ParseDate(value1.TimeSlotFromTime) > ParseDate(value1.TimeSlotToTime)) {
                            //alert('Saturday Slot FromTime Can Be Less Than To Time!');
                            toastr.warning("Saturday Slot FromTime Can Be Less Than To Time!", "warning");
                            return false;
                        }
                    });
                }
            });
            return true;
        }

        /* THIS IS FOR VALIDATION CONTROL FOR  DOCTOR SHIFT */
        $scope.ValidationcontrolsDoctorShift = function () {
            var today = moment(new Date()).format('YYYY-MM-DD');
            var fromDt = moment($scope.FromDate).format('YYYY-MM-DD');
            var toDt = moment($scope.ToDate).format('YYYY-MM-DD');
            //$scope.FromDate = moment($scope.FromDate).format('DD-MM-YYYY');
            //$scope.ToDate = moment($scope.ToDate).format('DD-MM-YYYY');

            $scope.FromDate = document.getElementById("FromDate").value;
            $scope.ToDate = document.getElementById("ToDate").value;
             
            if (typeof ($scope.SelectedDepartment) == "undefined" || $scope.SelectedDepartment == "") {
                //alert("Please Select Department");
                toastr.warning("Please Select Department", "warning");
                return false;
            }
            else if (typeof ($scope.SelectedSpecialist) == "undefined" || $scope.SelectedSpecialist == "") {
                //alert("Please Select Specialist");
                toastr.warning("Please Select Specialist", "warning");
                return false;
            }
            else if (typeof ($scope.SelectedCCCG) == "undefined" || $scope.SelectedCCCG == "") {
                //alert("Please Select CCCG");
                toastr.warning("Please Select CCCG", "warning");
                return false;
            }
            else if ($scope.FromDate == "undefined" || $scope.FromDate == "") {
                //alert("Please select From Date");
                toastr.warning("Please select Start Date", "warning");
                return false;
            }
            else if (today > fromDt) {
                toastr.warning("Please avoid past date as Start Date", "warning");
                return false;
            }
            else if ($scope.ToDate == "undefined" || $scope.ToDate == "") {
                //alert("Please select  End Date");
                toastr.warning("Please select End Date", "warning");
                return false;
            }
            else if (today > toDt) {
                toastr.warning("Please avoid past date as End Date", "warning");
                return false;
            }
            else if ($scope.FromDate > $scope.ToDate) {
                toastr.warning("Start Date should not be greater than End Date", "warning");
                $scope.FromDate = DateFormatEdit($scope.FromDate);
                $scope.ToDate = DateFormatEdit($scope.ToDate);
                return false;
            }
            else if (typeof ($scope.NewAppointment) == "undefined" || $scope.NewAppointment == "0" || $scope.NewAppointment == '') {
                //alert("Please Enter NewAppointment Time Slot");
                toastr.warning("Please Enter NewAppointment Time Slot", "warning");
                return false;
            }
            else if (typeof ($scope.NewAppointmentPrice) == "undefined" || $scope.NewAppointmentPrice == "0" || $scope.NewAppointmentPrice == "") {
                //alert("Please Enter NewAppointment");
                toastr.warning("Please Enter New Appointment Price", "warning");
                return false;
            }
            else if (typeof ($scope.followup) == "undefined" || $scope.followup == "0" || $scope.followup == '') {
                //alert("Please Enter followup Time Slot");
                toastr.warning("Please Enter followup Time Slot", "warning");
                return false;
            }
            else if (typeof ($scope.followupPrice) == "undefined" || $scope.followupPrice == "0" || $scope.followupPrice == "") {
                //alert("Please Enter FollowUp");
                toastr.warning("Please Enter Follow Up Price", "warning");
                return false;
            }
            else if (typeof ($scope.IntervalBt) == "undefined" || $scope.IntervalBt == "0" || $scope.IntervalBt == '') {
                //alert("Please Enter Interval Time Slot");
                toastr.warning("Please Enter Interval Time Slot", "warning");
                return false;
            }
            /*else if (typeof ($scope.CustomSlot) == "undefined" || $scope.CustomSlot == "0" || $scope.CustomSlot == '') {
                alert("Please Enter CustomSlot Time");
                return false;
            }*/
            else if (typeof ($scope.Days) == "undefined" || $scope.Days == "0" || $scope.Days == '') {
                //alert("Please Enter Days");
                toastr.warning("Please Enter Days", "warning");
                return false;
            }
            else if (typeof ($scope.Minutes) == "undefined" || $scope.Minutes == "0" || $scope.Minutes == '') {
                //alert("Please Enter Minutes");
                toastr.warning("Please Enter Minutes", "warning");
                return false;
            }
            //else if (($scope.FromDate !== null) && ($scope.ToDate !== null)) {
            //    if ((ParseDate($scope.ToDate) < ParseDate($scope.FromDate))) {
            //        //alert("Start Date should not be greater than End Date");
            //        toastr.warning("Start Date should not be greater than End Date", "warning");
            //        $scope.FromDate = DateFormatEdit($scope.FromDate);
            //        $scope.ToDate = DateFormatEdit($scope.ToDate);
            //        return false;
            //    }
            //}

            //$scope.FromDate = DateFormatEdit($scope.FromDate);
            //$scope.ToDate = DateFormatEdit($scope.ToDate);
            return true;
        };
        $scope.OrganisationSettingsSelectedDays = function () {
            $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingView/?InstitutionId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                if (data != null) {
                    const OrgDay = "";
                    const OrgSelectedDate = data.DefaultWorkingDays.split(',');
                    angular.forEach($scope.SelectedDays, function (value, index) {
                        angular.forEach(OrgSelectedDate, function (value1, index1) {
                            if (value1 == "monday") {
                                value1 = "mon";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Mon") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                            else if (value1 == "tuesday") {
                                value1 = "tue";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Tue") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                            else if (value1 == "wednesday") {
                                value1 = "wed";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Wed") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                            else if (value1 == "thursday") {
                                value1 = "thu";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Thu") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                            else if (value1 == "friday") {
                                value1 = "fri";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Fri") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                            else if (value1 == "saturday") {
                                value1 = "sat";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Sat") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                            else if (value1 == "sunday") {
                                value1 = "sun";
                                var DateDay = $scope.SelectedDays[index].Day;
                                DateDay = DateDay.toString();
                                if (DateDay.includes("Sun") == true) {
                                    $scope.SelectedDays[index].exist = 1;
                                }
                            }
                        });
                    });
                    const xy = $scope.SelectedDays.filter(x => x.exist == 1);
                    $scope.SelectedDays = xy;

                    angular.forEach($scope.SelectedDays, function (value2, index) {
                        var Day = value2.Day.toString();
                        if (Day.includes("Sun") == true) {
                            $("#SundayId").removeAttr("disabled");
                            $('#SundayId').prop('checked', true);
                            $('#SundayCheck').show();
                        }
                        if (Day.includes("Mon") == true) {
                            $("#MondayId").removeAttr("disabled");
                            $('#MondayId').prop('checked', true);
                            $('#MondayCheck').show();
                        }
                        if (Day.includes("Tue") == true) {
                            $("#TuesdayId").removeAttr("disabled");
                            $('#TuesdayId').prop('checked', true);
                            $('#TuesdayCheck').show();
                        }
                        if (Day.includes("Wed") == true) {
                            $("#WednesdayId").removeAttr("disabled");
                            $('#WednesdayId').prop('checked', true);
                            $('#WednesdayCheck').show();
                        }
                        if (Day.includes("Thu") == true) {
                            $("#ThursdayId").removeAttr("disabled");
                            $('#ThursdayId').prop('checked', true);
                            $('#ThursdayCheck').show();
                        }
                        if (Day.includes("Fri") == true) {
                            $("#FridayId").removeAttr("disabled");
                            $('#FridayId').prop('checked', true);
                            $('#FridayCheck').show();
                        }
                        if (Day.includes("Sat") == true) {
                            $("#SaturdayId").removeAttr("disabled");
                            $('#SaturdayId').prop('checked', true);
                            $('#SaturdayCheck').show();
                        }
                    });
                }
                if (data == null) {
                    //alert('Please Check OrgSettings, Default Working Days Is Empty!');
                    toastr.info("Please Check OrgSettings, Default Working Days Is Empty!", "info");
                    return false;
                }
            });

        }
        $scope.TimeslotClear = function () {
            $scope.TimeSlot1 = "";
            $scope.TimeSlot2 = "";
            $scope.TimeSlot3 = "";
            $scope.TimeSlot4 = "";
            $scope.TimeSlot5 = "";
            $scope.TimeSlot6 = "";
            $scope.TimeSlot7 = "";
            $scope.TimeSlot8 = "";
            $scope.TimeSlot9 = "";
            $scope.TimeSlot10 = "";
            $scope.TimeSlot11 = "";
            $scope.TimeSlot12 = "";
            $scope.TimeSlot13 = "";
            $scope.TimeSlot14 = "";
            $scope.TimeSlot15 = "";
            $scope.TimeSlot16 = "";
            $scope.TimeSlot17 = "";
            $scope.TimeSlot18 = "";
            $scope.TimeSlot19 = "";
            $scope.TimeSlot20 = "";
            $scope.TimeSlot21 = "";
            $scope.TimeSlot22 = "";
            $scope.TimeSlot23 = "";
            $scope.TimeSlot24 = "";
            $scope.TimeSlot25 = "";
            $scope.TimeSlot26 = "";
            $scope.TimeSlot27 = "";
            $scope.TimeSlot28 = "";
            $scope.TimeSlot29 = "";
            $scope.TimeSlot30 = "";
            $scope.TimeSlot31 = "";
            $scope.TimeSlot32 = "";
            $scope.TimeSlot33 = "";
            $scope.TimeSlot34 = "";
            $scope.TimeSlot35 = "";
            $scope.TimeSlot36 = "";
            $scope.TimeSlot37 = "";
            $scope.TimeSlot38 = "";
            $scope.TimeSlot39 = "";
            $scope.TimeSlot40 = "";
            $scope.TimeSlot41 = "";
            $scope.TimeSlot42 = "";
            $scope.TimeSlot43 = "";
            $scope.TimeSlot44 = "";
            $scope.TimeSlot45 = "";
            $scope.TimeSlot46 = "";
            $scope.TimeSlot47 = "";
            $scope.TimeSlot48 = "";
            $scope.TimeSlot49 = "";
            $scope.TimeSlot50 = "";
            $scope.TimeSlot51 = "";
            $scope.TimeSlot52 = "";
            $scope.TimeSlot53 = "";
            $scope.TimeSlot54 = "";
            $scope.TimeSlot55 = "";
            $scope.TimeSlot56 = "";
        }
        $scope.onDateRange = function () {
            if ((typeof $scope.FromDate) != undefined && $scope.FromDate != "" && (typeof ($scope.ToDate) != undefined && $scope.ToDate != 0)) {
                $("#chatLoaderPV").show();
                $scope.SelectedDays = dateRange($scope.FromDate, $scope.ToDate);
                $('#SundayCheck').hide();
                $('#MondayCheck').hide();
                $('#TuesdayCheck').hide();
                $('#WednesdayCheck').hide();
                $('#ThursdayCheck').hide();
                $('#FridayCheck').hide();
                $('#SaturdayCheck').hide();
                $("#SundayId").attr("disabled", true);
                $("#MondayId").attr("disabled", true);
                $("#TuesdayId").attr("disabled", true);
                $("#WednesdayId").attr("disabled", true);
                $("#ThursdayId").attr("disabled", true);
                $("#FridayId").attr("disabled", true);
                $("#SaturdayId").attr("disabled", true);
                $scope.TimeslotClear();
                $scope.OrganisationSettingsSelectedDays();
                $("#chatLoaderPV").hide();
            }
        }

        $scope.CancelDoctorShiftpopup = function () {
            angular.element('#ViewDoctorShiftModal').modal('hide');
        }

        $scope.updateCheckSpecialities = function (Id, Department_Name, $event) {

            var checked = $('#' + Id).is(":checked")
            if (checked == true) {
                $scope.SpecialitiesSelectList.push({
                    Id: Id,
                    Department: Department_Name
                })
                $('#Specialities').tagsinput('add', Department_Name);
                //$scope.Specialitiesinput = Department_Name;
                //$('.bootstrap-tagsinput').tagsinput('add', { Id: Id, Department: Department_Name });

            } else {
                angular.forEach($scope.SpecialitiesSelectList, function (Department_Name, index) {
                    if (Id == Department_Name.Id) {
                        $scope.SpecialitiesSelectList.splice(index, 1);
                        $('#Specialities').tagsinput('remove', Department_Name.Department);
                    }
                });
            }
        }

        /* on click view, view popup opened*/
        $scope.ViewDoctorShift = function (DId, DoctorId, Institution_Id) {
            $scope.DoctorShiftClear();
            $scope.Id = DId;
            $scope.DoctorShift_View(DId, DoctorId, Institution_Id);
            $scope.ViewShiftDoctor();
            angular.element('#DoctorShiftModal').modal('show');

        };
        /* on click Edit, edit popup opened*/
        $scope.EditDoctorShift = function (DId, activeFlag, DoctorId, Institution_Id) {
            if (activeFlag == 1) {
                $http.get(baseUrl + '/api/PatientAppointments/DoctorShift_Editable/?Id=' + DId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    if (data == 0) {
                        angular.element('#DoctorShiftModal').modal('show');
                        $('#saveDoctorShift1').attr("disabled", false);
                        $('#saveDoctorShift2').attr("disabled", false);
                        $('#saveDoctorShift3').attr("disabled", false);
                        $scope.DoctorShiftClear();
                        $scope.Id = DId;
                        $scope.DoctorShift_View(DId, DoctorId, Institution_Id);
                        $scope.EditShiftDoctor();
                    } else {
                        toastr.info("Particular Doctor Shift cannot be Editable", "info");
                    }
                });
            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
            }
        };
        /*calling Alert message for cannot edit inactive record function */
        //$scope.EditDoctorShift = function () {
        //    //alert("Inactive record cannot be edited");
        //    toastr.info("Inactive record cannot be edited", "info");
        //}
        /* 
     Calling api method for the dropdown list in the html page for the fields 
     Doctor List
     */
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.DoctorList = [];
        $scope.DoctorListActive = [];
        $scope.DoctorShiftListTemp = [];
        $http.get(baseUrl + '/api/AppoinmentSlot/Doctors_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {

            //var obj = { "Id": 0, "Name": "Select", "IsActive": 0 };
            //$scope.DoctorShiftListTemp.splice(0, 0, obj);
            ////$scope.InstitutiondetailsListTemp.push(obj);
            //$scope.DoctorList = angular.copy($scope.DoctorShiftListTemp);
            $scope.DoctorList = data;
            //$ff(data, { IsActive: 1 });
            $scope.DoctorListActive = data;
        });
        $scope.DoctorShiftList = [];
        $scope.DoctorShiftListActive = [];
        $http.get(baseUrl + '/api/DoctorShift/Shift_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {
            $scope.DoctorShiftList = $ff(data, { IsActive: 1 });
            $scope.DoctorShiftListActive = data;
        });

        $scope.WeekdayList = [];
        $scope.WeekdayActiveList = [];
        $http.get(baseUrl + '/api/DoctorShift/Days_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {
            $scope.WeekdayList = data;
            $scope.WeekdayActiveList = $ff(data, { IsActive: 1 });

            $scope.day1 = data[0].WeekDayName;
            $scope.day1Id = data[0].Id;
            $scope.day2 = data[1].WeekDayName;
            $scope.day2Id = data[1].Id;
            $scope.day3 = data[2].WeekDayName;
            $scope.day3Id = data[2].Id;
            $scope.day4 = data[3].WeekDayName;
            $scope.day4Id = data[3].Id;
            $scope.day5 = data[4].WeekDayName;
            $scope.day5Id = data[4].Id;
            $scope.day6 = data[5].WeekDayName;
            $scope.day6Id = data[5].Id;
            $scope.day7 = data[6].WeekDayName;
            $scope.day7Id = data[6].Id;
        });

        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterDoctorShiftList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if (searchstring == "") {
                $scope.rowCollectionFilter = [];
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Doctor_Name).match(searchstring) ||
                        angular.lowercase(value.ShiftName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.FromDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ToDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring)
                });
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        /* Validating the create page mandatory fields
           checking mandatory for the follwing fields
            Doctor Id, Sunday shift, Monday Shift, Tuesday Shift, Wednesday Shift, Thursday Shift, Friday Shift, Saturday Shift, From date, To date
           and showing alert message when it is null.
           */
        $scope.DoctorShiftAddEdit_Validations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.FromDate = moment($scope.FromDate).format('DD-MMM-YYYY');
            $scope.ToDate = moment($scope.ToDate).format('DD-MMM-YYYY');

            if (($scope.Doctor_Id.length == 0) && $scope.Id == 0) {
                //alert("Please select Doctor");
                toastr.warning("Please select Doctor", "warning");
                return false;
            }
            if (typeof ($scope.Doctor_Id1) == "undefined" || $scope.Doctor_Id1 == "0" && $scope.Id > 0) {
                //alert("Please select Doctor");
                toastr.warning("Please select Doctor", "warning");
                return false;
            }
            //else if ($scope.SundayShift.length == 0) {
            //    alert("Please select " + $scope.day1);
            //    return false;
            //}
            //else if ($scope.MondayShift.length == 0) {
            //    alert("Please select " + $scope.day2);
            //    return false;
            //}
            //else if ($scope.TuesdayShift.length == 0) {
            //    alert("Please select " + $scope.day3);
            //    return false;
            //}
            //else if ($scope.WednessdayShift.length == 0) {
            //    alert("Please select " + $scope.day4);
            //    return false;
            //}
            //else if ($scope.ThursdayShift.length == 0) {
            //    alert("Please select " + $scope.day5);
            //    return false;
            //}
            //else if ($scope.FridayShift.length == 0) {
            //    alert("Please select " + $scope.day6);
            //    return false;
            //}
            //else if ($scope.SaturdayShift.length == 0) {
            //    alert("Please select " + $scope.day7);
            //    return false;
            //}
            else if (typeof ($scope.FromDate) == "undefined" || $scope.FromDate == null) {
                //alert("Please select From Date");
                toastr.warning("Please select From Date", "warning");
                return false;
            }
            else if (typeof ($scope.ToDate) == "undefined" || $scope.ToDate == null) {
                //alert("Please select To Date");
                toastr.warning("Please select To Date", "warning");
                return false;
            }
            else if ((ParseDate($scope.FromDate) < ParseDate(today))) {
                //alert("FromDate Can Be Booked Only For Past");
                toastr.warning("FromDate Can Be Booked Only For Past", "warning");
                $scope.FromDate = DateFormatEdit($scope.FromDate);
                $scope.ToDate = DateFormatEdit($scope.ToDate);
                return false;
            }
            else if ((ParseDate($scope.ToDate) < ParseDate(today))) {
                //alert("To Date Can Be Booked Only For Past");
                toastr.warning("To Date Can Be Booked Only For Past", "warning");
                $scope.FromDate = DateFormatEdit($scope.FromDate);
                $scope.ToDate = DateFormatEdit($scope.ToDate);
                return false;
            }
            if (($scope.FromDate !== null) && ($scope.ToDate !== null)) {
                if ((ParseDate($scope.ToDate) < ParseDate($scope.FromDate))) {
                    //alert("From Date should not be greater than To Date");
                    toastr.warning("From Date should not be greater than To Date", "warning");
                    $scope.FromDate = DateFormatEdit($scope.FromDate);
                    $scope.ToDate = DateFormatEdit($scope.ToDate);
                    return false;
                }
            }
            $scope.FromDate = DateFormatEdit($scope.FromDate);
            $scope.ToDate = DateFormatEdit($scope.ToDate);
            return true;
        }

        $('#AppointmentSlotModal').on('hide.bs.modal', function () {
            console.log('hide');
            //return false;
        })

        /*on click Save calling the insert update function for Doctor shift
         and check the  Doctor shift already exist,if exist it display alert message or its 
         calling the insert update function*/

        $scope.DoctorShift_AddEdit = function () {

            $scope.ShiftDetails = [];
            $scope.DoctorListfiltersDetails = [];
            if ($scope.DoctorShiftAddEdit_Validations() == true) {
                $("#chatLoaderPV").show();

                $scope.SundayShiftDetails = [];
                angular.forEach($scope.SundayShift, function (value, index1) {
                    var obj = {
                        Id: 0,
                        DayMaster_Id: $scope.day1Id == 0 ? null : $scope.day1Id,
                        Shift_Id: value,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.SundayShiftDetails.push(obj);
                });

                $scope.MondayShiftDetails = [];
                angular.forEach($scope.MondayShift, function (Selected1, index) {
                    var obj1 = {
                        Id: 0,
                        DayMaster_Id: $scope.day2Id == 0 ? null : $scope.day2Id,
                        Shift_Id: Selected1,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.MondayShiftDetails.push(obj1);
                });

                $scope.TuesdayShiftDetails = [];
                angular.forEach($scope.TuesdayShift, function (Selected2, index) {
                    var obj2 = {
                        Id: 0,
                        DayMaster_Id: $scope.day3Id == 0 ? null : $scope.day3Id,
                        Shift_Id: Selected2,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.TuesdayShiftDetails.push(obj2);

                });

                $scope.WednessdayShiftDetails = [];
                angular.forEach($scope.WednessdayShift, function (Selected3, index) {
                    var obj3 = {
                        Id: 0,
                        DayMaster_Id: $scope.day4Id == 0 ? null : $scope.day4Id,
                        Shift_Id: Selected3,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.WednessdayShiftDetails.push(obj3);
                });

                $scope.ThursdayShiftDetails = [];
                angular.forEach($scope.ThursdayShift, function (Selected4, index) {
                    var obj4 = {
                        Id: 0,
                        DayMaster_Id: $scope.day5Id == 0 ? null : $scope.day5Id,
                        Shift_Id: Selected4,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.ThursdayShiftDetails.push(obj4);
                });

                $scope.FridayShiftDetails = [];
                angular.forEach($scope.FridayShift, function (Selected5, index) {
                    var obj5 = {
                        Id: 0,
                        DayMaster_Id: $scope.day6Id == 0 ? null : $scope.day6Id,
                        Shift_Id: Selected5,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.FridayShiftDetails.push(obj5);
                });

                $scope.SaturdayShiftDetails = [];
                angular.forEach($scope.SaturdayShift, function (Selected6, index) {

                    var obj6 = {
                        Id: 0,
                        DayMaster_Id: $scope.day7Id == 0 ? null : $scope.day7Id,
                        Shift_Id: Selected6,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.SaturdayShiftDetails.push(obj6);
                });

                if ($scope.Id == 0) {
                    angular.forEach($scope.Doctor_Id, function (Selected, index) {

                        var obj8 = {
                            Id: $scope.Id,
                            Institution_Id: $window.localStorage['InstitutionId'],
                            Doctor_Id: Selected,
                            FromDate: moment($scope.FromDate).format('DD-MMM-YYYY'),
                            ToDate: moment($scope.ToDate).format('DD-MMM-YYYY'),
                            Created_By: $window.localStorage['UserId'],
                            Modified_By: $window.localStorage['UserId'],
                            SundayChildModuleList: $scope.SundayShiftDetails,
                            MondayChildModuleList: $scope.MondayShiftDetails,
                            TuesdayChildModuleList: $scope.TuesdayShiftDetails,
                            WednessdayChildModuleList: $scope.WednessdayShiftDetails,
                            ThursdayChildModuleList: $scope.ThursdayShiftDetails,
                            FridayChildModuleList: $scope.FridayShiftDetails,
                            SaturdayChildModuleList: $scope.SaturdayShiftDetails,
                            DoctorShiftList: $scope.DoctorShiftList
                        };
                        $scope.DoctorListfiltersDetails.push(obj8)
                    })
                }
                else {
                    var obj9 = {
                        Id: $scope.Id,
                        Institution_Id: $window.localStorage['InstitutionId'],
                        Doctor_Id: $scope.Doctor_Id1,
                        FromDate: $scope.FromDate,
                        ToDate: $scope.ToDate,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                        SundayChildModuleList: $scope.SundayShiftDetails,
                        MondayChildModuleList: $scope.MondayShiftDetails,
                        TuesdayChildModuleList: $scope.TuesdayShiftDetails,
                        WednessdayChildModuleList: $scope.WednessdayShiftDetails,
                        ThursdayChildModuleList: $scope.ThursdayShiftDetails,
                        FridayChildModuleList: $scope.FridayShiftDetails,
                        SaturdayChildModuleList: $scope.SaturdayShiftDetails,
                        DoctorShiftList: $scope.DoctorShiftList
                    };
                    $scope.DoctorListfiltersDetails.push(obj9)
                }

                $http.post(baseUrl + '/api/DoctorShift/DoctorShift_AddEdit/', $scope.DoctorListfiltersDetails).success(function (data) {
                    // $("#chatLoaderPV").hide();
                    alert(data.Message);
                    if (data.ReturnFlag == "1") {
                        $scope.CancelSlot();
                        $scope.DoctorShiftClear();
                        $scope.DoctorShiftListGo();
                    }
                })
                $("#chatLoaderPV").hide();
            }
        }

        $scope.DoctorShiftClear = function () {
            $("#chatLoaderPV").show();
            $scope.currentTab = "1";
            $scope.SelectedDepartment = [];
            $scope.SelectedSpecialist = [];
            $scope.SelectedCCCG = [];
            $scope.FromDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $scope.ToDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $scope.NewAppointment = "0";
            $scope.NewAppointmentPrice = "0";
            $scope.followupPrice = "0";
            $scope.followup = "0";
            $scope.IntervalBt = "0";
            $scope.CustomSlot = "0";
            $scope.Days = "0";
            $scope.Minutes = "0";
            $('#SundayCheck').hide();
            $('#MondayCheck').hide();
            $('#TuesdayCheck').hide();
            $('#WednesdayCheck').hide();
            $('#ThursdayCheck').hide();
            $('#FridayCheck').hide();
            $('#SaturdayCheck').hide();
            $("#SundayId").attr("disabled", true);
            $("#MondayId").attr("disabled", true);
            $("#TuesdayId").attr("disabled", true);
            $("#WednesdayId").attr("disabled", true);
            $("#ThursdayId").attr("disabled", true);
            $("#FridayId").attr("disabled", true);
            $("#SaturdayId").attr("disabled", true);
            $('#SundayId').prop('checked', false);
            $('#MondayId').prop("checked", false);
            $('#TuesdayId').prop('checked', false);
            $('#WednesdayId').prop("checked", false);
            $('#ThursdayId').prop('checked', false);
            $('#FridayId').prop('checked', false);
            $('#SaturdayId').prop('checked', false);
            $('#OrgDefaultId').prop('checked', false);
            $('#OrgBookInfoId').prop("checked", false);
            $scope.TimeslotClear();
            $("#chatLoaderPV").hide();
        }

        $scope.ViewShiftDoctor = function () {
            $("#chatLoaderPV").show();
            $scope.currentTab = "1";
            $scope.DoctorSave = false;
            var $sel1 = $('#department');
            $sel1.multiselect('disable');
            var $sel2 = $('#Specialist');
            $sel2.multiselect('disable');
            var $sel3 = $('#CCCG');
            $sel3.multiselect('disable');
            document.getElementById("FromDate").disabled = true;
            document.getElementById("ToDate").disabled = true;
            $("#OrgDefaultId").attr("disabled", true);
            $("#OrgBookInfoId").attr("disabled", true);
            $('#NewAppointment').prop('disabled', true);
            $('#NewAppointmentPrice').prop('disabled', true);
            $('#followup').prop('disabled', true);
            $('#followupPrice').prop('disabled', true);
            $('#IntervalBt').prop('disabled', true);
            $('#CustomSlot').prop('disabled', true);
            $('#Days').prop('disabled', true);
            $('#Minutes').prop('disabled', true);
            $("#SundayId").attr("disabled", true);
            $("#MondayId").attr("disabled", true);
            $("#TuesdayId").attr("disabled", true);
            $("#WednesdayId").attr("disabled", true);
            $("#ThursdayId").attr("disabled", true);
            $("#FridayId").attr("disabled", true);
            $("#SaturdayId").attr("disabled", true);
            $('#timepicker1').prop('disabled', true);
            $('#timepicker2').prop('disabled', true);
            $('#timepicker3').prop('disabled', true);
            $('#timepicker4').prop('disabled', true);
            $('#timepicker5').prop('disabled', true);
            $('#timepicker6').prop('disabled', true);
            $('#timepicker7').prop('disabled', true);
            $('#timepicker8').prop('disabled', true);
            $('#timepicker9').prop('disabled', true);
            $('#timepicker10').prop('disabled', true);
            $('#timepicker11').prop('disabled', true);
            $('#timepicker12').prop('disabled', true);
            $('#timepicker13').prop('disabled', true);
            $('#timepicker14').prop('disabled', true);
            $('#timepicker15').prop('disabled', true);
            $('#timepicker16').prop('disabled', true);
            $('#timepicker17').prop('disabled', true);
            $('#timepicker18').prop('disabled', true);
            $('#timepicker19').prop('disabled', true);
            $('#timepicker20').prop('disabled', true);
            $('#timepicker21').prop('disabled', true);
            $('#timepicker22').prop('disabled', true);
            $('#timepicker23').prop('disabled', true);
            $('#timepicker24').prop('disabled', true);
            $('#timepicker25').prop('disabled', true);
            $('#timepicker26').prop('disabled', true);
            $('#timepicker27').prop('disabled', true);
            $('#timepicker28').prop('disabled', true);
            $('#timepicker29').prop('disabled', true);
            $('#timepicker30').prop('disabled', true);
            $('#timepicker31').prop('disabled', true);
            $('#timepicker32').prop('disabled', true);
            $('#timepicker33').prop('disabled', true);
            $('#timepicker34').prop('disabled', true);
            $('#timepicker35').prop('disabled', true);
            $('#timepicker36').prop('disabled', true);
            $('#timepicker37').prop('disabled', true);
            $('#timepicker38').prop('disabled', true);
            $('#timepicker39').prop('disabled', true);
            $('#timepicker40').prop('disabled', true);
            $('#timepicker41').prop('disabled', true);
            $('#timepicker42').prop('disabled', true);
            $('#timepicker43').prop('disabled', true);
            $('#timepicker44').prop('disabled', true);
            $('#timepicker45').prop('disabled', true);
            $('#timepicker46').prop('disabled', true);
            $('#timepicker47').prop('disabled', true);
            $('#timepicker48').prop('disabled', true);
            $('#timepicker49').prop('disabled', true);
            $('#timepicker50').prop('disabled', true);
            $('#timepicker51').prop('disabled', true);
            $('#timepicker52').prop('disabled', true);
            $('#timepicker53').prop('disabled', true);
            $('#timepicker54').prop('disabled', true);
            $('#timepicker55').prop('disabled', true);
            $('#timepicker56').prop('disabled', true);
            $("#chatLoaderPV").hide();
        }

        $scope.EditShiftDoctor = function () {
            $("#chatLoaderPV").show();
            $scope.currentTab = "1";
            $scope.DoctorSave = true;
            //var $sel1 = $('#department');
            //$sel1.multiselect('enable');
            //var $sel2 = $('#Specialist');
            //$sel2.multiselect('enable');
            //var $sel3 = $('#CCCG');
            //$sel3.multiselect('enable');
            document.getElementById("FromDate").disabled = false;
            document.getElementById("ToDate").disabled = false;
            $("#OrgDefaultId").attr("disabled", false);
            $("#OrgBookInfoId").attr("disabled", false);
            $('#NewAppointment').prop('disabled', false);
            $('#NewAppointmentPrice').prop('disabled', false);
            $('#followup').prop('disabled', false);
            $('#followupPrice').prop('disabled', false);
            $('#IntervalBt').prop('disabled', false);
            $('#CustomSlot').prop('disabled', false);
            $('#Days').prop('disabled', false);
            $('#Minutes').prop('disabled', false);
            $("#SundayId").attr("disabled", false);
            $("#MondayId").attr("disabled", false);
            $("#TuesdayId").attr("disabled", false);
            $("#WednesdayId").attr("disabled", false);
            $("#ThursdayId").attr("disabled", false);
            $("#FridayId").attr("disabled", false);
            $("#SaturdayId").attr("disabled", false);
            $('#timepicker1').prop('disabled', false);
            $('#timepicker2').prop('disabled', false);
            $('#timepicker3').prop('disabled', false);
            $('#timepicker4').prop('disabled', false);
            $('#timepicker5').prop('disabled', false);
            $('#timepicker6').prop('disabled', false);
            $('#timepicker7').prop('disabled', false);
            $('#timepicker8').prop('disabled', false);
            $('#timepicker9').prop('disabled', false);
            $('#timepicker10').prop('disabled', false);
            $('#timepicker11').prop('disabled', false);
            $('#timepicker12').prop('disabled', false);
            $('#timepicker13').prop('disabled', false);
            $('#timepicker14').prop('disabled', false);
            $('#timepicker15').prop('disabled', false);
            $('#timepicker16').prop('disabled', false);
            $('#timepicker17').prop('disabled', false);
            $('#timepicker18').prop('disabled', false);
            $('#timepicker19').prop('disabled', false);
            $('#timepicker20').prop('disabled', false);
            $('#timepicker21').prop('disabled', false);
            $('#timepicker22').prop('disabled', false);
            $('#timepicker23').prop('disabled', false);
            $('#timepicker24').prop('disabled', false);
            $('#timepicker25').prop('disabled', false);
            $('#timepicker26').prop('disabled', false);
            $('#timepicker27').prop('disabled', false);
            $('#timepicker28').prop('disabled', false);
            $('#timepicker29').prop('disabled', false);
            $('#timepicker30').prop('disabled', false);
            $('#timepicker31').prop('disabled', false);
            $('#timepicker32').prop('disabled', false);
            $('#timepicker33').prop('disabled', false);
            $('#timepicker34').prop('disabled', false);
            $('#timepicker35').prop('disabled', false);
            $('#timepicker36').prop('disabled', false);
            $('#timepicker37').prop('disabled', false);
            $('#timepicker38').prop('disabled', false);
            $('#timepicker39').prop('disabled', false);
            $('#timepicker40').prop('disabled', false);
            $('#timepicker41').prop('disabled', false);
            $('#timepicker42').prop('disabled', false);
            $('#timepicker43').prop('disabled', false);
            $('#timepicker44').prop('disabled', false);
            $('#timepicker45').prop('disabled', false);
            $('#timepicker46').prop('disabled', false);
            $('#timepicker47').prop('disabled', false);
            $('#timepicker48').prop('disabled', false);
            $('#timepicker49').prop('disabled', false);
            $('#timepicker50').prop('disabled', false);
            $('#timepicker51').prop('disabled', false);
            $('#timepicker52').prop('disabled', false);
            $('#timepicker53').prop('disabled', false);
            $('#timepicker54').prop('disabled', false);
            $('#timepicker55').prop('disabled', false);
            $('#timepicker56').prop('disabled', false);
            $("#chatLoaderPV").hide();
        }


        $scope.SundayShift2 = [];
        $scope.MondayShift2 = [];
        $scope.TuesdayShift2 = [];
        $scope.WednessdayShift2 = [];
        $scope.ThursdayShift2 = [];
        $scope.FridayShift2 = [];
        $scope.SaturdayShift2 = [];

        /*THIS IS FOR LIST FUNCTION*/
        $scope.DoctorShiftListGo = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.emptydata = [];
                $scope.rowCollection = [];
                $scope.Institution_Id = "";
                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }

                $http.get(baseUrl + '/api/DoctorShift/DoctorShift_List/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.rowCollection = data;
                    $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                    if ($scope.rowCollectionFilter.length > 0) {
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


        $scope.EditSelectedDoctor = [];
        $scope.EditSelectedDoctorList = [];
        $scope.EditSundayChildModuleList = [];
        $scope.EditMondayChildModuleList = [];
        $scope.EditTuesdayChildModuleList = [];
        $scope.EditWednessdayChildModuleList = [];
        $scope.EditThursdayChildModuleList = [];
        $scope.EditFridayChildModuleList = [];
        $scope.EditSaturdayChildModuleList = [];
        $scope.ChildModuleList = [];

        $scope.SundayShift = [];
        $scope.MondayShift = [];
        $scope.TuesdayShift = [];
        $scope.WednessdayShift = [];
        $scope.ThursdayShift = [];
        $scope.FridayShift = [];
        $scope.SaturdayShift = [];
        $scope.SundayShiftview = "";
        $scope.MondayShiftview = "";
        $scope.TuesdayShiftview = "";
        $scope.WednessdayShiftview = "";
        $scope.ThursdayShiftview = "";
        $scope.FridayShiftview = "";
        $scope.SaturdayShiftview = "";

        $scope.EditSundayChildModuleList1 = [];
        /*THIS IS FOR View FUNCTION*/
        $scope.DoctorShift_View = function (DId, DoctorId, Institution_Id) {
            $("#chatLoaderPV").show();
            /*document.getElementById("saveDoctorShift1").disabled = false;
            document.getElementById("saveDoctorShift2").disabled = false;
            document.getElementById("saveDoctorShift3").disabled = false;*/
            $scope.EditSelectedDoctor = [];
            $scope.EditSelectedDepartment = [];
            $scope.EditSelectedCCCG = [];
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/DoctorShift/DoctorShift_View/?DoctorId=' + DoctorId + '&Id=' + DId + '&Login_Session_Id=' + $scope.LoginSessionId + '&Institution_Id=' + Institution_Id).success(function (data) {
                if (data != null) {
                    $scope.EditSelectedDepartment.push(data.DepartmentId);
                    $scope.SelectedDepartment = $scope.EditSelectedDepartment;
                    $scope.onChangeDepartment();
                    $scope.EditSelectedDoctor.push(data.DoctorId);
                    $scope.SelectedSpecialist = $scope.EditSelectedDoctor;
                    $scope.FromDate = DateFormatEdit($filter('date')(data.FromDate, "dd-MMM-yyyy"));
                    $scope.ToDate = DateFormatEdit($filter('date')(data.ToDate, "dd-MMM-yyyy"));
                    $scope.onDateRange();
                    $('#OrgDefaultId').prop('checked', true);
                    $('#OrgBookInfoId').prop("checked", true);
                    $scope.NewAppointment = data.NewAppointment;
                    $scope.followup = data.FollowUp;
                    $scope.NewAppointmentPrice = data.NewAppointmentPrice;
                    $scope.followupPrice = data.FollowUpPrice;
                    $scope.IntervalBt = data.Intervel;
                    $scope.CustomSlot = data.CustomSlot;
                    $scope.Days = data.BookingOpen;
                    $scope.Minutes = data.BookingCancelLock;
                    angular.forEach(data.CC_CG, function (value, index) {
                        $scope.EditSelectedCCCG.push(value.CcCg_Id);
                    });
                    $scope.SelectedCCCG = $scope.EditSelectedCCCG;
                    angular.forEach(data.SelectedDaysList, function (value, index) {
                        //Day = value.Day.toString();
                        Day = DateFormatEdit($filter('date')(value.Day, "dd-MMM-yyyy")).toString();
                        if (Day.includes("Sun") == true) {
                            $('#SundayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot1 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot2 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot3 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot4 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot5 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot6 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot43 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot44 = Convert24to12Timeformat(Set_Time1);
                            }

                        }
                        if (Day.includes("Mon") == true) {
                            $('#MondayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot7 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot8 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot9 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot10 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot11 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot12 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot45 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot46 = Convert24to12Timeformat(Set_Time1);
                            }
                        }
                        if (Day.includes("Tue") == true) {
                            $('#TuesdayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot13 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot14 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot15 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot16 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot17 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot18 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot47 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot48 = Convert24to12Timeformat(Set_Time1);
                            }
                        }
                        if (Day.includes("Wed") == true) {
                            $('#WednesdayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot19 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot20 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot21 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot22 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot23 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot24 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot49 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot50 = Convert24to12Timeformat(Set_Time1);
                            }
                        }
                        if (Day.includes("Thu") == true) {
                            $('#ThursdayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot25 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot26 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot27 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot28 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot29 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot30 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot51 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot52 = Convert24to12Timeformat(Set_Time1);
                            }
                        }
                        if (Day.includes("Fri") == true) {
                            $('#FridayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot31 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot32 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot33 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot34 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot35 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot36 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot53 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot54 = Convert24to12Timeformat(Set_Time1);
                            }
                        }
                        if (Day.includes("Sat") == true) {
                            $('#SaturdayId').prop('checked', true);
                            if (value.SHIFT == 1) {
                                var From = value.TimeSlotFromTime;
                                var From1 = From.split('T')[1];
                                var Set_Time = From1.slice(0, 5);
                                $scope.TimeSlot37 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot38 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 2) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot39 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot40 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 3) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot41 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot42 = Convert24to12Timeformat(Set_Time1);
                            }
                            if (value.SHIFT == 4) {
                                var From = value.TimeSlotFromTime;
                                var From_To = From.split('T')[1];
                                var Set_Time = From_To.slice(0, 5);
                                $scope.TimeSlot55 = Convert24to12Timeformat(Set_Time);

                                var To = value.TimeSlotToTime;
                                var To1 = To.split('T')[1];
                                var Set_Time1 = To1.slice(0, 5);
                                $scope.TimeSlot56 = Convert24to12Timeformat(Set_Time1);
                            }
                        }
                    });
                    /*document.getElementById("saveDoctorShift1").disabled = false;
                    document.getElementById("saveDoctorShift2").disabled = false;
                    document.getElementById("saveDoctorShift3").disabled = false;*/
                }
                //$("#chatLoaderPV").hide();
                if ($scope.DoctorSave == true) {
                    var sel1 = $('#department');
                    sel1.multiselect('disable');
                    var sel2 = $('#Specialist');
                    sel2.multiselect('disable');
                    var sel3 = $('#CCCG');
                    sel3.multiselect('enable');
                }
                if ($scope.DoctorSave == false) {
                    $scope.ViewShiftDoctor();
                    var sel1 = $('#department');
                    sel1.multiselect('disable');
                    var sel2 = $('#Specialist');
                    sel2.multiselect('disable');
                    var sel3 = $('#CCCG');
                    sel3.multiselect('disable');
                }
            })
            $("#chatLoaderPV").hide();
        };

        /* 
        Calling the api method to detele the details of the Doctor shift
        for the Doctor shift Id,
        and redirected to the list page.
        */
        $scope.DeleteDoctorShift = function (ID, DoctorId) {
            $scope.Id = ID;
            $scope.DoctorShift_Delete();
        };
        $scope.DoctorShift_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Doctor Shift?',
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
                    var obj =
                    {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId']
                    }
                    $http.post(baseUrl + '/api/DoctorShift/DoctorShift_Delete/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }

                        $scope.DoctorShiftListGo();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  Drug DB details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Doctor Shift?");
            if (del == true) {
                $("#chatLoaderPV").show();
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/DoctorShift/DoctorShift_Delete/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }

                    $scope.DoctorShiftListGo();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Institution!" + data;
                });
                $("#chatLoaderPV").hide();
            };*/
        };

        /*'Active' the Doctor shift */
        $scope.ReInsertDoctorShift = function (comId, DoctorId) {
            $scope.Id = comId;
            $scope.ReInsertDoctorShiftList(DoctorId);
        };

        /* 
        Calling the api method to inactived the details of the Doctor shift
        for the Doctor shift Id,
        and redirected to the list page.
        */
        $scope.ReInsertDoctorShiftList = function (DoctorId) {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/DoctorShift/ActivateDoctorShift_List/?Id=' + $scope.Id
                + '&Institution_Id=' + $window.localStorage['InstitutionId']
                + '&Doctor_Id=' + DoctorId
            ).success(function (data) {
                if (data.returnval == 1) {
                    //alert("Activate Doctor Shift is already created, Please check");
                    toastr.info("Activate Doctor Shift is already created, Please check", "info");
                }
                else {
                    Swal.fire({
                        title: 'Do you like to activate the selected Doctor Shift?',
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
                            var obj =
                            {
                                Id: $scope.Id,
                                Modified_By: $window.localStorage['UserId']
                            }
                            $http.post(baseUrl + '/api/DoctorShift/DoctorShift_Active/', obj).success(function (data) {
                                //alert(data.Message);
                                toastr.success(data.Message, "success");
                                $scope.DoctorShiftListGo();
                            }).error(function (data) {
                                $scope.error = "An error has occurred while ReInsertDoctor Shift" + data;
                            });
                        } else if (result.isDenied) {
                            //Swal.fire('Changes are not saved', '', 'info')
                        }
                    })
                    /*var Ins = confirm("Do you like to activate the selected Doctor Shift?");
                    if (Ins == true) {
                        var obj =
                        {
                            Id: $scope.Id,
                            Modified_By: $window.localStorage['UserId']
                        }
                        $http.post(baseUrl + '/api/DoctorShift/DoctorShift_Active/', obj).success(function (data) {
                            alert(data.Message);
                            $scope.DoctorShiftListGo();
                        }).error(function (data) {
                            $scope.error = "An error has occurred while ReInsertDoctor Shift" + data;
                        });
                    };*/
                }
            })
            $("#chatLoaderPV").hide();
        }

        //Appointment Settings 
        $scope.NewAppointmentPrice = "0";
        $scope.followupPrice = "0";
        $scope.NewAppointment = "0";
        $scope.followup = "0";
        $scope.IntervalBt = "0";
        $scope.CustomSlot = "0";
        $scope.Days = "0";
        $scope.AppointmentDay = "";
        $scope.Minutes = "0";
        $scope.TimeZoneList = [];
        $scope.SelectedTimeZone = "";
        $scope.sunday = true;
        $scope.monday = true;
        $scope.tuesday = true;
        $scope.wednesday = true;
        $scope.thursday = true;
        $scope.friday = true;
        $scope.saturday = true;
        $scope.SelectDefHoliday = "0";
        $scope.cc = "1";
        $scope.cg = "1";
        $scope.cl = "1";
        $scope.sc = "1";
        $scope.userpatient = "1";
        $scope.DayLists = [];
        $scope.HourLists = [];
        $scope.MinuteLists = [];
        $scope.SelectedDay = [];
        $scope.SelectedMinute = [];
        $scope.SelectedHour = [];
        $scope.DefaultWorkingDays = [];
        $scope.SelectedDefaultholidayday = [];
        $scope.SelectedDefaultholidayhour = [];
        $scope.SelectedDefaultholidayMinute = [];
        $scope.DefaultHolidayList = [];
        $scope.DayLists = [];
        $scope.HourLists = [];
        $scope.MinuteLists = [];
        $scope.BookEnable = "1";
        $scope.confirmBook = "1";
        $scope.AutoEnable = "1";
        $scope.AppointmentId = "";
        $scope.MyAppointmentRow = "-1";


        $scope.AddReminderParameters = [{
            'ID': $scope.AppointmentId,
            'ReminderDays': $scope.ReminderDays,
            'ReminderHours': $scope.ReminderHours,
            'ReminderMinutes': $scope.ReminderMinutes,
            'IsActive': 1
        }];

        /*This is a Addrow function to add new row and save  */
        $scope.ReminderUserAdd = function () {
            if ($scope.MyAppointmentRow >= 0) {
                var obj = {
                    'ID': $scope.AppointmentId,
                    'ReminderDays': $scope.ReminderDays,
                    'ReminderHours': $scope.ReminderHours,
                    'ReminderMinutes': $scope.ReminderMinutes,
                    'IsActive': 1
                }
                $scope.AddReminderParameters[$scope.MyAppointmentRow] = obj;
            }
            else {
                $scope.AddReminderParameters.push({
                    'ID': $scope.AppointmentId,
                    'ReminderDays': $scope.ReminderDays,
                    'ReminderHours': $scope.ReminderHours,
                    'ReminderMinutes': $scope.ReminderMinutes,
                    'IsActive': 1
                })
            }
        };
        $scope.Reset_MyAppointment = function () {
            Swal.fire({
                title: 'Do you like to Reset the AppointmentSetting  details?',
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
                    $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingDelete/?InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                        //alert("AppointmentSetting  has been Reset Successfully");
                        toastr.success("AppointmentSetting  has been Reset Successfully", "success");
                        $scope.AppointmentSettings();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  AppointmentSettings details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* var del = confirm("Do you like to Reset the AppointmentSetting  details?");
            if (del == true) {
                $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingDelete/?InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                    //alert("AppointmentSetting  has been Reset Successfully");
                    toastr.success("AppointmentSetting  has been Reset Successfully", "success");
                    $scope.AppointmentSettings();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  AppointmentSettings details" + data;
                });
            }*/

        }

        $scope.remindDelete = function (Delete_Id, rowIndex) {
            if ($scope.AddReminderParameters.length > 1) {
                $scope.ReminderUserDelete(Delete_Id, rowIndex);
            }
            else if ($scope.Id == 0) {
                $scope.ReminderUserDelete();
                angular.forEach($scope.AddReminderParameters, function (selectedPre, index) {
                    if (index != rowIndex)
                        Previous_MyReminderItem.push(selectedPre);
                });
            }
        }

        $scope.ReminderUserDelete = function (Delete_Id, rowIndex) {
            Swal.fire({
                title: 'Do you like to delete User Remainder Details?',
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
                        var Previous_MyReminderItem = [];
                        if ($scope.Id == 0) {
                            angular.forEach($scope.AddReminderParameters, function (selectedPre, index) {
                                if (index != rowIndex)
                                    Previous_MyReminderItem.push(selectedPre);
                            });
                            $scope.AddReminderParameters = Previous_MyReminderItem;
                        } else if ($scope.Id > 0) {
                            angular.forEach($scope.AddReminderParameters, function (selectedPre, index) {
                                if (index != rowIndex)
                                    Previous_MyReminderItem.push(selectedPre);
                            });
                            $scope.AddReminderParameters = Previous_MyReminderItem;
                        }
                    
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* var del = confirm("Do you like to delete User Remainder Details?");
            if (del == true) {
                var Previous_MyReminderItem = [];
                if ($scope.Id == 0) {
                    angular.forEach($scope.AddReminderParameters, function (selectedPre, index) {
                        if (index != rowIndex)
                            Previous_MyReminderItem.push(selectedPre);
                    });
                    $scope.AddReminderParameters = Previous_MyReminderItem;
                } else if ($scope.Id > 0) {
                    angular.forEach($scope.AddReminderParameters, function (selectedPre, index) {
                        if (index != rowIndex)
                            Previous_MyReminderItem.push(selectedPre);
                    });
                    $scope.AddReminderParameters = Previous_MyReminderItem;
                }
            }*/
        };
        $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/').success(function (data) {
            $scope.TimeZoneList = data;
        });

        $scope.DefaultHolidayList
        [
            {
                "Name": "1",
                "ID": 1
            },
            {
                "Name": "2",
                "ID": 2
            }
        ]




        $scope.AppointmentSettings = function () {
            $("#chatLoaderPV").show();

            angular.forEach($scope.TimeZoneList, function (value, index) {
                if (value.SelectedTimeZone == $scope.SelectedTimeZone) {
                    $scope.SelectedTimeZone = value.SelectedTimeZone;
                }
            });

            $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingView/?InstitutionId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.sunday = false;
                $scope.monday = false;
                $scope.tuesday = false;
                $scope.wednesday = false;
                $scope.thursday = false;
                $scope.friday = false;
                $scope.saturday = false;
                if (data != '' && data != null && data != undefined) {
                    $scope.DuplicatesId = data.ID;
                    $scope.InstitutionId = data.InstitutionId;
                    $scope.MyAppConfigId = data.MyAppConfigId;
                    $scope.NewAppointment = data.NewAppointmentDuration;
                    $scope.followup = data.FollowUpDuration;
                    $scope.NewAppointmentPrice = data.NewAppointmentPrice;
                    $scope.followupPrice = data.FollowUpPrice;
                    $scope.IntervalBt = data.AppointmentInterval;
                    $scope.AppointmentDay = data.MaxScheduleDays;
                    $scope.Minutest = data.MinRescheduleMinutes;
                    //$scope.SelectedTimeZone = data.DefautTimeZone;
                    $scope.DefaultworkingDays = data.DefaultWorkingDays;
                    $scope.SelectedDefaultholiday = data.DefaultHoliDays;
                    $scope.BookEnable = data.IsAppointmentInHolidays;
                    $scope.cc = data.IsCc;
                    $scope.cg = data.IsCg;
                    $scope.cl = data.IsCl;
                    $scope.sc = data.IsSc;
                    $scope.userpatient = data.IsPatient;
                    $scope.confirmBook = data.IsDirectAppointment;
                    $scope.AddReminderParameters = data.ReminderTimeInterval;
                    $scope.AutoEnable = data.IsAutoReschedule;
                    $scope.ReduceNumberofavailableAppointmentes = data.MinRescheduleDays;
                    var weekly = data.DefaultWorkingDays.split(',');

                    angular.forEach(weekly, function (value, index) {
                        if ($('#sunday').val() == value) {
                            $scope.sunday = true;
                        }
                        if ($('#monday').val() == value) {
                            $scope.monday = true;
                        }
                        if ($('#tuesday').val() == value) {
                            $scope.tuesday = true;
                        }
                        if ($('#wednesday').val() == value) {
                            $scope.wednesday = true;
                        }
                        if ($('#thursday').val() == value) {
                            $scope.thursday = true;
                        }
                        if ($('#friday').val() == value) {
                            $scope.friday = true;
                        }
                        if ($('#saturday').val() == value) {
                            $scope.saturday = true;
                        }

                    });
                } else {
                    $scope.sunday = true;
                    $scope.monday = true;
                    $scope.tuesday = true;
                    $scope.wednesday = true;
                    $scope.thursday = true;
                    $scope.friday = true;
                    $scope.saturday = true;
                    $scope.cc = true;
                    $scope.cg = true;
                    $scope.cl = true;
                    $scope.sc = true;
                    $scope.userpatient = true;
                }



            });
        }

        $scope.AppointmentSettings1 = function () {
            $("#chatLoaderPV").show();

            $scope.MyAppConfigId = "";
            $scope.NewAppointment = "";
            $scope.followup = "";
            $scope.IntervalBt = "";
            $scope.AppointmentDay = "";
            $scope.Minutest = "";
            $scope.SelectedTimeZone = "";
            $scope.workingdays = "";
            $scope.SelectedDefaultholiday = "";
            $scope.BookEnable = "1";
            $scope.cc = true;
            $scope.cg = true;
            $scope.cl = true;
            $scope.sc = true;
            $scope.userpatient = true;
            $scope.confirmBook = "1";
            $scope.sunday = true;
            $scope.monday = true;
            $scope.tuesday = true;
            $scope.wednesday = true;
            $scope.thursday = true;
            $scope.friday = true;
            $scope.saturday = true;
            $scope.AddReminderParameters = [];
            $scope.AutoEnable = "1";
            $scope.ReduceNumberofavailableAppointmentes = "";
            $("#chatLoaderPV").hide();


        }




        /* THIS IS FOR VALIDATION CONTROL */
        $scope.ValidationcontrolsAppointment = function () {
            if (typeof ($scope.NewAppointment) == "undefined" || $scope.NewAppointment == "0") {
                //alert("Please Enter NewAppointment");
                toastr.warning("Please Enter NewAppointment", "warning");
                return false;
            }
            else if (typeof ($scope.NewAppointmentPrice) == "undefined" || $scope.NewAppointmentPrice == "0" || $scope.NewAppointmentPrice == "") {
                //alert("Please Enter NewAppointment");
                toastr.warning("Please Enter New Appointment Price", "warning");
                return false;
            }
            else if (typeof ($scope.followup) == "undefined" || $scope.followup == "0") {
                //alert("Please Enter FollowUp");
                toastr.warning("Please Enter FollowUp", "warning");
                return false;
            }
            else if (typeof ($scope.followupPrice) == "undefined" || $scope.followupPrice == "0" || $scope.followupPrice == "") {
                //alert("Please Enter FollowUp");
                toastr.warning("Please Enter Follow Up Price", "warning");
                return false;
            }
            else if (typeof ($scope.IntervalBt) == "undefined" || $scope.IntervalBt == "0") {
                //alert("Please Enter IntervalBetween");
                toastr.warning("Please Enter IntervalBetween", "warning");
                return false;
            }
            else if (typeof ($scope.AppointmentDay) == "undefined" || $scope.AppointmentDay == "0") {
                //alert("Please Enter AppointmentDay");
                toastr.warning("Please Enter AppointmentDay", "warning");
                return false;
            }
            else if (typeof ($scope.Minutest) == "undefined" || $scope.Minutest == "0") {
                //alert("Please Enter Minutes");
                toastr.warning("Please Enter Minutes", "warning");
                return false;
            }

            return true;
        };

        $scope.MyAppointment_InsertUpdate = function () {
            if ($scope.ValidationcontrolsAppointment() == true) {
                $("#chatLoaderPV").show();

                if ($("input[name='bookenable']:checked").val() == "1") {
                    $scope.BookEnable = 1;
                } else {
                    $scope.BookEnable = 0;
                }


                if ($("input[name='confirm']:checked").val() == "1") {
                    $scope.confirmBook = 1;
                } else {
                    $scope.confirmBook = 0;
                }

                if ($("input[name='autoenable']:checked").val() == "1") {
                    $scope.AutoEnable = 1;
                } else {
                    $scope.AutoEnable = 0;
                }

                if ($("input[name='cc']:checked").val() == "1") {
                    $scope.cc = 1;
                } else {
                    $scope.cc = 0;
                }

                if ($("input[name='cg']:checked").val() == "1") {
                    $scope.cg = 1;
                } else {
                    $scope.cg = 0;
                }

                if ($("input[name='cl']:checked").val() == "1") {
                    $scope.cl = 1;
                } else {
                    $scope.cl = 0;
                }

                if ($("input[name='sc']:checked").val() == "1") {
                    $scope.sc = 1;
                } else {
                    $scope.sc = 0;
                }

                if ($("input[name='userpatient']:checked").val() == "1") {
                    $scope.userpatient = 1;
                } else {
                    $scope.userpatient = 0;
                }




                $scope.temp = '';
                if ($("#sunday").is(":checked") == true) {
                    $scope.temp = 'sunday';
                }
                if ($("#monday").is(":checked") == true) {
                    if ($scope.temp != '') {
                        $scope.temp = $scope.temp + ',' + 'monday';
                    } else {
                        $scope.temp = 'monday';
                    }
                }
                if ($("#tuesday").is(":checked") == true) {
                    if ($scope.temp != '') {
                        $scope.temp = $scope.temp + ',' + 'tuesday';
                    } else {
                        $scope.temp = 'tuesday';
                    }
                }
                if ($("#wednesday").is(":checked") == true) {
                    if ($scope.temp != '') {
                        $scope.temp = $scope.temp + ',' + 'wednesday';
                    } else {
                        $scope.temp = 'wednesday';
                    }
                }

                if ($("#thursday").is(":checked") == true) {
                    if ($scope.temp != '') {
                        $scope.temp = $scope.temp + ',' + 'thursday';
                    } else {
                        $scope.temp = 'thursday';
                    }
                }

                if ($("#friday").is(":checked") == true) {
                    if ($scope.temp != '') {
                        $scope.temp = $scope.temp + ',' + 'friday';
                    } else {
                        $scope.temp = 'friday';
                    }
                }

                if ($("#saturday").is(":checked") == true) {
                    if ($scope.temp != '') {
                        $scope.temp = $scope.temp + ',' + 'saturday';
                    } else {
                        $scope.temp = 'saturday';
                    }
                }
                if ($scope.temp != '') {
                    $scope.DefaultWorkingDays = $scope.temp;
                }

                angular.forEach($scope.TimeZoneList, function (value, index) {
                    if (value.TimeZoneName == $scope.SelectedTimeZone) {
                        $scope.SelectedTimeZone = value.TimeZoneName;
                    }
                });

                var obj = {
                    ID: $scope.id,
                    InstitutionId: $window.localStorage['InstitutionId'],
                    CreatedBy: $window.localStorage['UserId'],
                    NewAppointmentDuration: $scope.NewAppointment,
                    NewAppointmentPrice: $scope.NewAppointmentPrice,
                    FollowUpDuration: $scope.followup,
                    FollowUpPrice: $scope.followupPrice,
                    AppointmentInterval: $scope.IntervalBt,
                    MinRescheduleDays: $scope.ReduceNumberofavailableAppointmentes,
                    MinRescheduleMinutes: $scope.Minutest,
                    DefautTimeZone: $scope.SelectedTimeZone == null ? "" : $scope.SelectedTimeZone,
                    DefaultWorkingDays: $scope.DefaultWorkingDays,
                    DefaultHoliDays: $scope.SelectedDefaultholiday,
                    IsAppointmentInHolidays: $scope.BookEnable,
                    IsCc: $scope.cc,
                    IsCg: $scope.cg,
                    IsCl: $scope.cl,
                    IsSc: $scope.sc,
                    IsPatient: $scope.userpatient,
                    IsDirectAppointment: $scope.confirmBook,
                    ReminderTimeInterval: $scope.AddReminderParameters,
                    IsAutoReschedule: $scope.AutoEnable,
                    MaxScheduleDays: $scope.AppointmentDay
                };
                $('#save').attr("disabled", true);
                console.log(obj)
                $http.post(baseUrl + '/api/DoctorShift/Org_AppointmentSettings_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    $('#save').attr("disabled", false);
                    $scope.AppointmentSettings();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Parameter" + data;
                });
            }
        }
    }
]);