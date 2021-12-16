var Coordinator = angular.module("CoordinatorController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


Coordinator.controller("CoordinatorController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Mode = $routeParams.Id;


        $scope.CGAddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/1");
        }

        $scope.AddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/2");
        }

        $scope.AddPatientHomePopup = function () {
            $location.path("/Carecoordinatorpatient/4");
        }


        $scope.searchDoctor = function () {

            angular.element('#searchDoctor').modal('show');
        }
        $scope.openProtocol = function () {

            angular.element('#MonitoringProtocolCreateModal').modal('show');
        }


        $scope.PatientAppointmentpopup = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }
        $scope.CancelPatientAppointment = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }
    }
]);