var UsersLog = angular.module("UsersLogController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

UsersLog.controller("UsersLogController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'InstSub', 'toastr',
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

        // load users list
        $scope.User_Log_List = function () {
            $("#chatLoaderPV").show();
            $scope.CCCG_DetailsList = [];
            $http.get(baseUrl + 'api/UsersLog/GetAll_UserLists/?InstitutionId=' + $scope.InstituteId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.CCCG_DetailsList = data;
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
    }
]);