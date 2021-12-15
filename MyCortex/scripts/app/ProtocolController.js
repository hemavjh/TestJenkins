var Protocol = angular.module("ProtocolController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



Protocol.controller("ProtocolController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddProtocolPopUP = function () {
            angular.element('#ProtocolModal').modal('show');
        }
        $scope.ViewProtocolPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10();
            angular.element('#ProtocolViewModal').modal('show');
        }

        $scope.EditProtocolPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewITSection();
            angular.element('#ProtocolModal').modal('show');
        }

        $scope.CancelProtocolPopUP = function () {
            angular.element('#ProtocolModal').modal('hide')
        }


        $scope.ListProtocolPopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.DrugDBList();

        }

    }
]);