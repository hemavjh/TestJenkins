var EligibilityLogs = angular.module("EligibilityLogsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

EligibilityLogs.controller("EligibilityLogsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'InstSub', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, InstSub, toastr) {
        $scope.CreatedBy = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.rowCollectionFilter = [];
        $scope.MenuTypeId = 0;

        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        // load eligibility logs list
        $scope.Eligibility_Logs_List = function () {
            $scope.rowCollectionFilter = [];
            var DatetimepickerdtToday = new Date();
            var Datetimepickermonth = DatetimepickerdtToday.getMonth() + 1;
            var Datetimepickerday = DatetimepickerdtToday.getDate();
            var Datetimepickeryear = DatetimepickerdtToday.getFullYear();
            if (Datetimepickermonth < 10)
                Datetimepickermonth = '0' + Datetimepickermonth.toString();
            if (Datetimepickerday < 10)
                Datetimepickerday = '0' + Datetimepickerday.toString();
            var DatetimepickermaxDate = Datetimepickeryear + '-' + Datetimepickermonth + '-' + Datetimepickerday;
            $scope.SearchDate = new Date(DatetimepickermaxDate);
            $scope.SearchEndDate = new Date(DatetimepickermaxDate);
            $scope.SelectedPatient = "";
            $('#ddlsearchfield').val('');
            $("#chatLoaderPV").show();
       
            $http.get(baseUrl + 'api/EligibilityLogs/Eligibility_Logs_List/?InstitutionId=' + $scope.InstituteId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = data;
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
                $scope.SearchMsg = "No Data Available";
            }
            // $("#chatLoaderPV").hide();
        }

        $scope.Eligibility_Logs_Filters = function () {
            $scope.rowCollectionFilter = [];
            if ($scope.SelectedPatient == null || $scope.SelectedPatient == "") {
                toastr.warning("Please Select Patient", "warning");
                return;
            }
            var sDate = new Date($scope.SearchDate).getFullYear().toString() + '-' + (((new Date($scope.SearchDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchDate).getDate().toString().length > 1) ? new Date($scope.SearchDate).getDate().toString() : ('0' + new Date($scope.SearchDate).getDate().toString()))
            var eDate = new Date($scope.SearchEndDate).getFullYear().toString() + '-' + (((new Date($scope.SearchEndDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchEndDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchEndDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchEndDate).getDate().toString().length > 1) ? new Date($scope.SearchEndDate).getDate().toString() : ('0' + new Date($scope.SearchEndDate).getDate().toString()))
            if (sDate > eDate) {
                toastr.warning("Start Date should be Lesser than End date", "warning");
                return false;
            }

            $scope.Eligibility_Status = $('#ddlsearchfield').val();
            if ($scope.Eligibility_Status == 0) {
                toastr.warning("Please Select Eligibility Status", "warning");
                return;
            }
            
            $("#chatLoaderPV").show();
            $scope.CCCG_DetailsList = [];
            $http.get(baseUrl + 'api/EligibilityLogs/Eligibility_Logs_With_Patient_Filters/?InstitutionId=' + $scope.InstituteId + "&Patient_Id=" + $scope.SelectedPatient + "&sDate=" + sDate + "&eDate=" + eDate + "&EligibilityStatus=" + $scope.Eligibility_Status + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = data;
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
                $scope.SearchMsg = "No Data Available";
            }
            // $("#chatLoaderPV").hide();
        }

        //select on Change load -userslist
        $scope.SearchByUserID = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/UsersLog/Admin_Userslog_List/?Institution_Id=' + $scope.InstituteId + "&login_session_id=" + $scope.LoginSessionId + "&User_Id=" + $scope.SelectedCCCG).success(function (data) {
                $scope.emptydata = [];
                $scope.UserDetailsList = [];
                $scope.UserDetailsList = data;
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                    $scope.SearchMsg = "No Data Available";
                }
                $("#chatLoaderPV").hide();
            });
        }
        /* Filter the User Log list function.*/
        $scope.filterListUserLog = function () {
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.UserDetailsList, function (value) {
                    return angular.lowercase(value.FULLNAME).match(searchstring) ||
                        angular.lowercase($filter('date')(value.LOGINTIME, "dd-MMM-yyyy hh:mm a")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.LOGOUTTIME, "dd-MMM-yyyy hh:mm a")).match(searchstring);
                });
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                } else {
                    $scope.flag = 0;
                }
            }
        };

        $scope.All_Patient_List = function () {
            $http.get(baseUrl + '/api/EligibilityLogs/GetPatientList/?InstitutionId=' + $scope.InstituteId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.Patientemptydata = [];
                $scope.PatientList = [];
                $scope.PatientList = data;
                $scope.Patientemptydata = data;
                
            });
        }
    }
]);