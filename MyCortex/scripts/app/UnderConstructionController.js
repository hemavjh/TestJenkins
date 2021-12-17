var UnderConstruction = angular.module("UnderConstructionController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


UnderConstruction.controller("UnderConstructionController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService) {
        $scope.underConstruction = function () {

        }
    }
]);