var Parent = angular.module("ParentController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


Parent.controller("ParentController", ['$scope',
    function ($scope) {
        $scope.$on('$viewContentLoaded', function () {
            angular.element(".date input").keydown(function (event) {
                if (event.which != 46)
                    return false;
            });
        });
    }
]);