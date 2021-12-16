var AlertConfiguration = angular.module("AlertConfigurationController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


AlertConfiguration.controller("AlertConfigurationController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddAlertConfigurationPopUP = function () {
            angular.element('#AlertConfigurationModal').modal('show');
        }

        $scope.ViewICD10PopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10();
            angular.element('#AlertConfigurationViewModal').modal('show');
        }

        $scope.EditICD10PopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewITSection();
            angular.element('#AlertConfigurationModal').modal('show');
        }

        $scope.CancelPopUP = function () {
            angular.element('#AlertConfigurationModal').modal('hide')
        }

        $scope.ListICD10PopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.ICDCodeList();

        }
    }
]);