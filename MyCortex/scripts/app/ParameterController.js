var Parameter = angular.module("ParameterController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

Parameter.controller("ParameterController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, toastr) {

        $scope.AddParameterPopup = function () {

            angular.element('#ParameterCreateModal').modal('show');
        }

        $scope.CancelParameterPopup = function () {

            angular.element('#ParameterCreateModal').modal('hide');
        }

        $scope.ViewIntstitutionPopup = function () {

            angular.element('#ViewModal').modal('show');
        }

        $scope.CancelViewIntstitutionPopup = function () {

            angular.element('#ViewModal').modal('hide');
        }

    }

]);