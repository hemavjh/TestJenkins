﻿var Googlehome = angular.module("GooglehomeController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



Googlehome.controller("GooglehomeController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).then(function (response) {
            if (response.data[0] != undefined) {
                $scope.page_size = parseInt(response.data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        }, function errorCallback(response) {
        });


        $scope.getCredentialDetails = function () {
            $http.get(baseUrl + '/api/Login/GoogleLogin_get_Email/').then(function (response) {


                $scope.UserId = response.data.UserId;
                $scope.UserTypeId = response.data.UserTypeId;
                $scope.InstitutionId = response.data.InstitutionId;
                $window.localStorage['UserId'] = $scope.UserId;
                $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                $window.localStorage['InstitutionId'] = $scope.InstitutionId;

                if ($window.localStorage['UserTypeId'] == "1")
                    window.location.href = baseUrl + "/Home/Index/Institution";
                else if ($window.localStorage['UserTypeId'] == "3")
                    window.location.href = baseUrl + "/Home/Index/InstitutionSubscriptionHospitalAdmin_view";
                else if ($window.localStorage['UserTypeId'] == "2")
                    window.location.href = baseUrl + "/Home/Index/PatientVitals/0/1";
                else if ($window.localStorage['UserTypeId'] == "4")
                    window.location.href = baseUrl + "/Home/Index/TodaysAppoint_ments";
                else if ($window.localStorage['UserTypeId'] == "5")
                    window.location.href = baseUrl + "/Home/Index/CareGiverAssignedPatients";
                else if ($window.localStorage['UserTypeId'] == "6")
                    window.location.href = baseUrl + "/Home/Index/Carecoordinator/1";
                else if ($window.localStorage['UserTypeId'] == "7")
                    window.location.href = baseUrl + "/Home/Index/TodaysAppoint_ments";
            }, function errorCallback(response) {
            });
        }
        $scope.getCredentialDetails();

    }
]);