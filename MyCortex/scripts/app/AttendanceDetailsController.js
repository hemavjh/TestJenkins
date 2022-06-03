var AttendanceDetailscontroller = angular.module("AttendanceDetailsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

AttendanceDetailscontroller.controller("AttendanceDetailsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        //  $scope.InstituteId = $window.localStorage['InstitutionId'];
        //Declaration and initialization of Scope Variables.
        $scope.ShiftName = "";
        $scope.IsActive = true;
        $scope.Id = 0;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.page_size = 0;
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
        /* on click Add New, Add popup opened*/
        $scope.AddAttendance = function () {
            $scope.DoctorName = "";
            var FromdtAppo = "";
            var TodtAppo = "";
            $scope.AttendanceFromDate = "";
            $scope.AttendanceToDate = "";
            FromdtAppo = moment($filter('date')(new Date(), 'yyyy/MM/dd HH:mm'));
            $scope.AttendanceFromDate = FromdtAppo["_i"]
            TodtAppo = moment($filter('date')(new Date(), 'yyyy/MM/dd HH:mm'));
            $scope.AttendanceToDate = TodtAppo["_i"]
            $scope.Remarks = "";
            angular.element('#AttendanceAddModal').modal('show');
            $('#btnsave').attr("disabled", false);
        }
        /* on click view, view popup opened*/
        $scope.ViewAttendance = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewAttendanceList();
            angular.element('#ViewAttendanceModal').modal('show');
        }
        /* on click Edit, edit popup opened*/
        $scope.EditAttendance = function (CatId, ActiveFlag, AttendanceToDate) {
            $scope.AttendanceTo_Date = $filter('date')(AttendanceToDate, "dd-MMM-yyyy hh:mm:ss a");
            $scope.Today_Date = $filter('date')(new Date(), 'dd-MMM-yyyy hh:mm:ss a');
            $('#btnsave').attr("disabled", false);
            if (ActiveFlag == 1) {
                $scope.ClearAttendancePopUp();
                $scope.Id = CatId;
                $scope.ViewAttendanceList();
                if ((ParseDate($scope.Today_Date) < ParseDate($scope.AttendanceTo_Date))) {
                    angular.element('#AttendanceAddModal').modal('show');
                }
                else {
                    //alert("Completed To date  record cannot be edited");
                    toastr.info("Completed To date  record cannot be edited", "info");
                }
            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
            }
        };

        $scope.CancelSlot = function () {
            angular.element('#AttendanceModal').modal('hide');
        }

        $scope.CancelAttendanceDetails = function () {
            angular.element('#AttendanceAddModal').modal('hide');
        }

        /* User basic details list*/
        /*  $scope.InstituteId=$window.localStorage['InstitutionId'];
          $scope.DoctorList = [];
          $scope.DoctorListActive = [];
      
              $http.get(baseUrl + '/api/Attendance/UserType_List/?Institution_Id=' +$window.localStorage['InstitutionId']).success(function (data) {  
               
                      $scope.UserTypeList =data;   
           
          });*/
        $scope.UserListType = [];
        $http.get(baseUrl + '/api/Attendance/Clinician_UserList/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.UserTypeList = $ff(data, { IsActive: 1 });;
            $scope.UserTypeList = data;
        });

        //$scope.InstituteId=$window.localStorage['InstitutionId'];
        //$scope.Attendance_List = [];
        //$http.get(baseUrl + '/api/Attendance/Attendance_List/?Institution_Id=' +$scope.InstituteId).success(function (data) {        
        //    $scope.Attendance_List =data;
        //});


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

        /* Validating the create page mandatory fields
           checking mandatory for the follwing fields
           Doctor Name,From Date,To Date
           and showing alert message when it is null.
           */
        $scope.DoctorAttendance_InsertUpdateValidations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY  hh:mm:ss');
            $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY  hh:mm:ss');

            if ($scope.SelectedAttendance == "" || $scope.SelectedAttendance == undefined) {
                //alert("Please select User");
                toastr.warning("Please select User", "warning");
                $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
                $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
                return false;
            }

            else if (typeof ($scope.AttendanceFromDate) == "undefined" || $scope.AttendanceFromDate == 0) {
                //alert("Please select From Date");
                toastr.warning("Please select From Date", "warning");
                $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
                $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
                return false;
            }
            else if (typeof ($scope.AttendanceToDate) == "undefined" || $scope.AttendanceToDate == 0) {
                //alert("Please select To Date");
                toastr.warning("Please select To Date", "warning");
                $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
                $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
                return false;
            }
            else if ((ParseDate($scope.AttendanceFromDate) < ParseDate(today))) {
                //alert("From Date Can Be Booked Only For Future");
                toastr.warning("From Date Can Be Booked Only For Future", "warning");
                $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
                $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
                return false;
            }
            else if ((ParseDate($scope.AttendanceToDate) < ParseDate(today))) {
                //alert("To Date Can Be Booked Only For Future");
                toastr.warning("To Date Can Be Booked Only For Future", "warning");
                $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
                $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
                return false;
            }

            else if (($scope.AttendanceFromDate !== null) && ($scope.AttendanceToDate !== null)) {
                if ((ParseDate($scope.AttendanceToDate) < ParseDate($scope.AttendanceFromDate))) {
                    //alert("From Date Should not be greater than To Date");
                    toastr.warning("From Date Should not be greater than To Date", "warning");
                    $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
                    $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
                    return false;
                }
            }
            $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
            $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
            return true;
        };
        /*on click Save calling the insert update function for Doctor Holiday
            and check the Doctor Name  already exist between From Date and To Date,if exist it display alert message or its 
            calling the insert update function*/
        $scope.SelectedAttendance = [];
        $scope.DoctorAttendanceDetails = [];
        $scope.AttendanceAddEdit = function () {
            $scope.DoctorAttendanceDetails = [];
            $scope.AttendanceFromDate = moment($('#datetimepickerholiday_From').val()).format('DD-MMM-YYYY hh:mm:ss');
            $scope.AttendanceToDate = moment($('#datetimepickerholiday_To').val()).format('DD-MMM-YYYY hh:mm:ss');
            if ($scope.DoctorAttendance_InsertUpdateValidations() == true) {
                $("#chatLoaderPV").show();
                var AttendanceFromDate = $('#datetimepickerholiday_From').val().split(' ')[0];
                var AttendanceToDate = $('#datetimepickerholiday_To').val().split(' ')[0];
                var AttendanceFromDateTime = $('#datetimepickerholiday_From').val().split(' ')[1];
                var AttendanceToDateTime = $('#datetimepickerholiday_To').val().split(' ')[1];
                $scope.AttendanceFromDate = AttendanceFromDate;
                $scope.AttendanceToDate = AttendanceToDate;
                $scope.fromtime = AttendanceFromDateTime;
                $scope.totime = AttendanceToDateTime;
                if ($scope.Id == 0) {
                    angular.forEach($scope.SelectedAttendance, function (value, index) {
                        var obj = {
                            Id: $scope.Id,
                            Institution_Id: $window.localStorage['InstitutionId'],
                            AttendanceFromDate: moment($scope.AttendanceFromDate).format('DD-MMM-YYYY'),
                            AttendanceToDate: moment($scope.AttendanceToDate).format('DD-MMM-YYYY'),
                            AttendanceFromTime: $scope.fromtime,
                            AttendanceToTime: $scope.totime,
                            Doctor_Id: value,
                            Remarks: $scope.Remarks
                        };
                        $('#btnsave').attr("disabled", true);
                        $scope.DoctorAttendanceDetails.push(obj)
                    });
                }
                else {
                    var obj = {
                        Id: $scope.Id,
                        Institution_Id: $window.localStorage['InstitutionId'],
                        AttendanceFromDate: moment($scope.AttendanceFromDate).format('DD-MMM-YYYY'),
                        AttendanceToDate: moment($scope.AttendanceToDate).format('DD-MMM-YYYY'),
                        AttendanceFromTime: $scope.fromtime,
                        AttendanceToTime: $scope.totime,
                        Doctor_Id: $scope.EditSelectedAttendance,
                        Remarks: $scope.Remarks
                    };
                    $('#btnsave').attr("disabled", true);
                    $scope.DoctorAttendanceDetails.push(obj)
                }
                $http.post(baseUrl + '/api/Attendance/AttendanceDetails_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.DoctorAttendanceDetails).success(function (data) {
                    if (data.ReturnFlag == 1) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        $('#btnsave').attr("disabled", false);
                        $scope.AttendanceList();
                        $scope.ClearAttendancePopUp();
                        $("#chatLoaderPV").hide();
                    } else {
                        $("#chatLoaderPV").hide();
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.info(data.Message, "info");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        $('#btnsave').attr("disabled", false);
                        $scope.ClearAttendancePopUp();
                        return false;
                    }
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Parameter" + data;
                });
            }
        };

        $scope.searchqueryAttendance = "";
        /* Filter the master list function for Search*/
        $scope.FilterAttendanceList = function () {

            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchqueryAttendance);
            if (searchstring == "") {
                $scope.rowCollectionAttendanceFilter = [];
                $scope.rowCollectionAttendanceFilter = angular.copy($scope.rowCollectionAttendance);
            }
            else {
                $scope.rowCollectionAttendanceFilter = $ff($scope.rowCollectionAttendance, function (value) {
                    return angular.lowercase(value.DoctorName).match(searchstring) ||
                        angular.lowercase($filter('date')(value.AttendanceFromDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.AttendanceToDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase(value.CreatedByName).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a")).match(searchstring);

                });
            }
        }
        /*THIS IS FOR LIST FUNCTION*/

        $scope.AttendanceList = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.emptydataAttendance = [];
                $scope.rowCollectionAttendance = [];

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }

                $http.get(baseUrl + '/api/Attendance/Attendance_List/?Id=0' + '&IsActive=' + $scope.ISact + '&Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId
                ).success(function (data) {
                    $scope.emptydataAttendance = [];
                    $scope.rowCollectionAttendance = [];
                    $scope.rowCollectionAttendance = data;
                    $scope.rowCollectionAttendanceFilter = angular.copy($scope.rowCollectionAttendance);
                    if ($scope.rowCollectionAttendanceFilter.length > 0) {
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

        /*THIS IS FOR View FUNCTION*/
        $scope.Edit_SelectedDoctor = [];
        $scope.Edit_SelectedDoctorList = [];
        $scope.ViewAttendanceList = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/Attendance/Attendance_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId + '&institution_id=' + $window.localStorage['InstitutionId']).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Doctor_Id = data.Doctor_Id.toString();
                $scope.DoctorName = data.DoctorName;
                var ATT_FROM = moment(data.AttendanceFromDate).format('DD-MMM-YYYY hh:mm:ss');
                //$scope.AttendanceFromDate = DateFormatEdit(ATT_FROM);
                $scope.AttendanceFromDate = ATT_FROM;
                var ATT_TO = moment(data.AttendanceToDate).format('DD-MMM-YYYY hh:mm:ss');
                $scope.AttendanceToDate = ATT_TO;
                $scope.Edit_SelectedDoctor.push(data.Doctor_Id);
                $scope.EditSelectedAttendance = data.Doctor_Id.toString();
                $scope.SelectedAttendance = $scope.Edit_SelectedDoctor;
                $scope.Remarks = data.Remarks;
                $("#chatLoaderPV").hide();
            });
        };

        $scope.ClearAttendancePopUp = function () {
            $scope.Id = 0;
            $scope.InstituteId = "";
            $scope.Remarks = "";
            $scope.SelectedAttendance = [];
            $scope.AttendanceFromDate = "";
            $scope.AttendanceToDate = "";
            $scope.CancelAttendancePopUp();
        }
        /* THIS IS FUNCTION FOR CLOSE Modal Window  */
        $scope.CancelAttendancePopUp = function () {
            angular.element('#AttendanceAddModal').modal('hide');
            angular.element('#ViewAttendanceModal').modal('hide');
        };
        /*InActive the Doctor Holiday*/
        $scope.DeleteAttendance = function (comId) {
            $scope.Id = comId;
            $scope.Attendance_InActive();
        };
        /* 
        Calling the api method to inactived the details of the  Holiday 
        for the  Doctor ,
        and redirected to the list page.
        */
        $scope.Attendance_InActive = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Holiday?',
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

                    $http.post(baseUrl + '/api/Attendance/Attendance_InActive/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $scope.AttendanceList();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Holiday" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Holiday?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/Attendance/Attendance_InActive/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    $scope.AttendanceList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Holiday" + data;
                });
            };*/
        };

        /*Active the Doctor Holiday*/
        $scope.ReInsertAttendance = function (comId) {
            $scope.Id = comId;
            $scope.Attendance_Active();
        };
        /* 
       Calling the api method to Actived the details of the  Holiday 
       for the  Doctor ,
       and redirected to the list page.
       */
        $scope.Attendance_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected  Holiday?',
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

                    $http.post(baseUrl + '/api/Attendance/Attendance_Active/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        } else if (data.ReturnFlag == 2) {
                            toastr.info(data.Message, "info");
                        }
                        if (data.ReturnFlag == 1) {
                            $scope.AttendanceList();
                        }
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  Drug DB details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* var Ins = confirm("Do you like to activate the selected  Holiday?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/Attendance/Attendance_Active/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    $scope.AttendanceList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Holiday" + data;
                });
            };*/
        }

        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

    }

]);