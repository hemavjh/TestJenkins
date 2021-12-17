var Patient = angular.module("PatientController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



Patient.controller("PatientController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddPatientPopup = function () {
            $('#btnsave1').attr("disabled", false);
            angular.element('#PatientCreateModal').modal('show');
        }

        $scope.CancelPopup = function () {
            angular.element('#PatientCreateModal').modal('hide')
        }
        $scope.AdvanceSearchPopup = function () {
            angular.element('#ViewModal').modal('show')
        }
    }
]);