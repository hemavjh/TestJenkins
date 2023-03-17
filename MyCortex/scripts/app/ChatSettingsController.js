var ChatSettingscontroller = angular.module("ChatSettingsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

ChatSettingscontroller.controller("ChatSettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$timeout', '$document', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $timeout, $document, toastr) {
        $scope.Id = 0;
        $scope.Flag = [];
        $scope.UserGroupList = [];
        $scope.checkboxObj = [];
        $scope.UserGroupListtwo = [];

        $scope.ChatSettingslist = [];
        $scope.User_Id = $window.localStorage['UserId'];
        $scope.Institution_Id = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        // inittialize the list object for user type
        if ($window.localStorage['UserTypeId'] == 3) {
            $http.get(baseUrl + '/api/ChatSettings/ChatSettingsUserType_List/').then(function (response) {

                $scope.UserGroupList = response.data;
                $scope.UserGroupListtwo = response.data;
                $scope.firstobj = [];
                $scope.secondobj = [];
                angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {

                    angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {
                        var name = Ivalue.Id.toString();
                    })
                })
            }, function errorCallback(response) {
            });

            $http.get(baseUrl + '/api/ChatSettings/ChatPreferenceGet/').then(function (response) {

                $scope.UserGroupList = response.data;
                $scope.UserGroupListtwo = response.data;
                $scope.firstobj = [];
                $scope.secondobj = [];
                angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {

                    angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {
                        var name = Ivalue.Id.toString();
                    })
                })
            }, function errorCallback(response) {
            });
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }


        //Assign the usertype true or false
        $scope.updateCheckValue = function (OId, IId, $event) {
            var obj = { "OuterId": OId, "InnerId": IId, "Flag": true[0] }
            $scope.checkboxObj.push(obj);

            var checkbox = $event.target;
            var filterObj = $ff($scope.checkboxObj, { "OuterId": OId, "InnerId": IId }, true)[0];
            var checkbox = checkbox.checked;
            if (checkbox == true) {
                filterObj.Flag = 1;
            }
            else {
                filterObj.Flag = 0;
            }
        }


        $scope.ViewupdateCheckValue = function (idx, parentidx, $event) {
            $("#chatLoaderPV").show();
            // call after binding all checkboxes
            if (idx == $scope.UserGroupList.length && parentidx == $scope.UserGroupList.length) {
                setTimeout(function () {
                    $http.get(baseUrl + 'api/ChatSettings/ViewEditChatSettings/?Id=' + $scope.Institution_Id).then(function (response) {
                        $scope.ChatSettingslist = response.data;

                        angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {
                            angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {

                                var target = document.getElementById('chk-' + Ovalue.Id + '-' + Ivalue.Id);
                                target.checked = false;
                                var filObj = $ff($scope.ChatSettingslist, { "FromUser_TypeId": Ovalue.Id, "ToUser_TypeId": Ivalue.Id }, 1)

                                if ((typeof (filObj) != undefined || typeof (filObj) != null) && filObj.length > 0) {
                                    if (filObj[0].Flag == 1) {
                                        target.checked = true;
                                        var obj = { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id, "Flag": true }
                                        $scope.checkboxObj.push(obj);
                                    }
                                    else {
                                        var obj = { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id, "Flag": false }
                                        $scope.checkboxObj.push(obj);
                                    }
                                }
                                else {
                                    var obj = { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id, "Flag": false }
                                    $scope.checkboxObj.push(obj);
                                }
                            });
                        });
                        $("#chatLoaderPV").hide();
                    }, function errorCallback(response) {
                    });
                }, 1500);
            }

        }


        $scope.FromUser_TypeId = [];
        $scope.ToUser_TypeId = [];
        /*
          Call the api method for insert and Update the record for a chat settings
          and display the record of selected chat settings when Id is greater than 0
          in edit.html and provide an option for select and modify the chat settings and save the chat settings record
          */
        $scope.ChatSettings_AddEdit = function () {

            $scope.SaveChatPreference();

            var savecnt = $scope.UserGroupList.length * 2;
            var lpcnt = 0;
            $("#chatLoaderPV").show();
            angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {
                angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {
                    var flagstatus = 0;

                    if (($scope.checkboxObj != undefined || $scope.checkboxObj != null) && $scope.checkboxObj.length > 0) {
                        flagstatus = $ff($scope.checkboxObj, { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id }, 1)[0].Flag
                    }
                    else {
                        flagstatus = $ff($scope.checkboxObj, { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id }, 0)[0]
                    };

                    var obj = {
                        Id: $scope.Id,
                        Institution_Id: $scope.Institution_Id,
                        FromUser_TypeId: Ovalue.Id,
                        ToUser_TypeId: Ivalue.Id,
                        Flag: flagstatus,
                        Created_by: $scope.User_Id
                    }
                    $('#save').attr("disabled", true);

                    if (obj.Flag == true) {
                        obj.Flag = 1;
                    }
                    else {
                        obj.Flag = 0;
                    };


                    $http.post(baseUrl + '/api/ChatSettings/ChatSettings_AddEdit/', obj).then(function (response) {

                        lpcnt = lpcnt + 1
                        if (savecnt == lpcnt) {
                            //alert(data.Message);
                            toastr.success(response.data.Message, "success");
                            $('#save').attr("disabled", false);
                            $location.path("/EditChatSettings/" + $scope.Institution_Id);
                            //$scope.loading = false;
                            //$rootScope.$broadcast('hide'); 
                            $("#chatLoaderPV").hide();
                        }
                    }, function errorCallback(response) {
                    });

                })
            })

        };

        /*Store Chat Preference*/
        $scope.SaveChatPreference = function () {
            var type = $scope.Preference_Type;
            $http.get(baseUrl + '/api/ChatSettings/ChatPreferenceSave/?institutionId=' + $window.localStorage['InstitutionId'] + '&preferenceType=' + type).then(function (response) {
                return response.data;
            }, function errorCallback(response) {
            });
        }

        /*Set Chat Preference*/
        $scope.SetChatPreference = function () {
            $http.get(baseUrl + '/api/ChatSettings/ChatPreferenceGet/?institutionId=' + $window.localStorage['InstitutionId']).then(function (response) {
                $scope.Preference_Type = response.data.PreferenceType;
            }, function errorCallback(response) {
            });
        }

        /*LIST REDIRECT FUNCTION */
        $scope.ListRedirect = function () {
            $location.path("/ChatSettings");
        }
    }
]);
