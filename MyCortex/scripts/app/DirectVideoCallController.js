var DirectVideoCall = angular.module("DirectVideoCallController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



DirectVideoCall.controller("DirectVideoCallController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        $scope.UserId = $window.localStorage['UserId'];
        $scope.UserTypeId = $window.localStorage['UserTypeId'];
        $scope.CallSessionId = $routeParams.CallSessionId;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        if ($scope.UserTypeId !== "2") {
            $("#directCall-Page").show();
            chatService.initiateDirectVideoCall($scope.CallSessionId);
        } else {
            $("#WaitingCall-Page").show();
            var CustomData = {
                UserId: $scope.UserId,
                CallSessionId: $scope.CallSessionId,
                ReceiverId: "779",
                CallType: "Video"
            };
            var CustomType = "Join Request";
            chatService.sendCustomMessage(CustomData, CustomType);
        }
    }
]);