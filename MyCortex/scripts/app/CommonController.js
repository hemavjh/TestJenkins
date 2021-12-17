var Commoncontroller = angular.module("CommonController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


Commoncontroller.controller("CommonController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.DecryptInput = "";
        $scope.Input_Type = 1;
        if ($window.localStorage['UserTypeId'] == 1) {
            $scope.EncryptDecryptvalue = function () {
                var obj = {
                    InputType: $scope.Input_Type,
                    DecryptInput: $scope.DecryptInput
                };
                $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                    $scope.DecryptResult = data;
                })
                    .error(function () {
                        $scope.DecryptResult = "Invalid format";
                    });
            };
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }
    }
]);