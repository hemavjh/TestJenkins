var DoctorProfile = angular.module("DoctorProfileController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



DoctorProfile.controller("DoctorProfileController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

        $scope.AddDoctorProfileCreatePopup = function () {

            angular.element('#DoctorProfilePopupCreateModal').modal('show');
        }
        $scope.CancelIntstitutionSubPopup = function () {

            angular.element('#InstitutionsubCreateModal').modal('hide');
        }
        $scope.ViewIntstitutionSubPopup = function () {

            angular.element('#ViewsubModal').modal('show');
        }
        $scope.CancelCreateDoctorProfilePopup = function () {

            angular.element('#DoctorProfilePopupCreateModal').modal('hide');
        }
    }
]);