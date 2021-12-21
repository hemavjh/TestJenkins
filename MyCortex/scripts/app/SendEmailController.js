var SendEmailcontroller = angular.module("SendEmailController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

SendEmailcontroller.controller("SendEmailController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.UserId = $window.localStorage['UserId'];
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.UserTypeId = "0";
        $scope.Template_Id = "0";
        $scope.Usertypelistdata = [];
        $scope.SentEmailTemplateList = [];
        $scope.SendEmailUserList = [];
        $scope.Generated_TemplateList = [];
        $scope.Filter_SendEmailUserList = [];
        $scope.flag = "0";
        //More Filter Initialization
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.loadCount = 0;
        $scope.TabClick = false;

        $scope.ResetPatientFilter = function () {
            $scope.Filter_PatientNo = "";
            $scope.filter_InsuranceId = "";
            $scope.Filter_GenderId = "0";
            $scope.filter_NationalityId = "0";
            $scope.filter_EthinicGroupId = "0";
            $scope.filter_MOBILE_NO = "";
            $scope.filter_HomePhoneNo = "";
            $scope.filter_Email = "";
            $scope.filter_MaritalStatus = "0";
            $scope.filter_CountryId = "0";
            $scope.filter_StataId = "0";
            $scope.filter_CityId = "0";
            $scope.filter_BloodGroupId = "0";
            $scope.filter_GroupId = "0";
            $scope.Get_SendEmail_UserList();
        }

        $scope.Filter_Country_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.filter_CountryId).success(function (data) {
                    $scope.StateNameList = data;
                    $scope.CityNameList = [];
                    $scope.filter_CityId = "0";
                });
            }
        }
        $scope.Filter_State_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.filter_CountryId + '&StateId=' + $scope.filter_StataId).success(function (data) {
                    $scope.CityNameList = data;
                });
            }
        }

        $scope.SendEmailDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $scope.CountryStateList();
            }
        }

        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;
            });
        }
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.GenerateTemplate = function (GetId, EmailId) {
            if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                //alert("Please select Template");
                toastr.warning("Please select Template", "warning");
                return false;
            }
            else {
                angular.element('#Template_PreviewModel').modal('show');
                $scope.PrimaryKeyId = GetId;
                $http.post(baseUrl + '/api/SendEmail/GenerateTemplate/?Id=' + $scope.PrimaryKeyId + '&Template_Id=' + $scope.Template_Id + '&Institution_Id=' + $scope.InstitutionId + '&TemplateType_Id=' + $scope.PageParameter).success(function (data) {
                    $scope.Generated_TemplateList = data;
                    $scope.EmailSubject = $scope.Generated_TemplateList.Email_Subject;
                    $scope.Generated_Template = $scope.Generated_TemplateList.Email_Body;
                    $scope.EmailId = EmailId;
                });
            }
        }

        $scope.GenerateSMSTemplate = function (GetId, MobileNO) {
            if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                toastr.warning("Please select Template", "warning");
                return false;
            }
            else {
                angular.element('#Template_PreviewModel').modal('show');
                $scope.PrimaryKeyId = GetId;
                $http.post(baseUrl + '/api/SendEmail/GenerateTemplate/?Id=' + $scope.PrimaryKeyId + '&Template_Id=' + $scope.Template_Id + '&Institution_Id=' + $scope.InstitutionId + '&TemplateType_Id=' + $scope.PageParameter).success(function (data) {
                    $scope.Generated_TemplateList = data;
                    $scope.EmailSubject = $scope.Generated_TemplateList.Email_Subject;
                    $scope.Generated_Template = $scope.Generated_TemplateList.Email_Body;
                    $scope.MobileNO = MobileNO;
                });
            }
        }

        /* Get the List of User Type */
        if ($window.localStorage['UserTypeId'] == 3) {
            $http.get(baseUrl + '/api/SendEmail/Email_UserTypeList/').success(function (data) {
                $scope.Usertypelistdata = data;
            });


            /*Get the List of Template */
            $http.get(baseUrl + '/api/SendEmail/Email_TemplateTypeList/?InstitutionId=' + $scope.InstitutionId + '&TemplateType_Id=' + $scope.PageParameter).success(function (data) {
                $scope.SentEmailTemplateList = data;
            });
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }
        /* Get the list of User for Send Email */
        $scope.Get_SendEmail_UserList = function () {

            if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                //alert("Please select User Type");
                toastr.warning("Please select User Type", "warning");
                return false;
            }
            else if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                //alert("Please select Template");
                toastr.warning("Please select Template", "warning");
                return false;
            }
            else {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/SendEmail/Get_SendEmail_UserList/?UserTypeId=' + $scope.UserTypeId + '&Institution_Id=' + $scope.InstitutionId + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId).success(function (data) {
                    $scope.emptydata = [];
                    $scope.SendEmailUserList = data;
                    $scope.Filter_SendEmailUserList = angular.copy($scope.SendEmailUserList);
                    if ($scope.Filter_SendEmailUserList.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                });
            }
        }
        $scope.searchquery = "";
        /* FILTER THE LIST FUNCTION.*/
        $scope.ListFilter = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.Filter_SendEmailUserList = angular.copy($scope.SendEmailUserList);
            }
            else {
                $scope.Filter_SendEmailUserList = $ff($scope.SendEmailUserList, function (value) {
                    return angular.lowercase(value.UserName).match(searchstring) ||
                        angular.lowercase(value.UserType).match(searchstring) ||
                        angular.lowercase(value.EmailId).match(searchstring);
                });
                if ($scope.Filter_SendEmailUserList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        $scope.checkAll = function () {
            if ($scope.SelectedAllUser == true) {
                $scope.SelectedAllUser = true;
            } else {
                $scope.SelectedAllUser = false;
            }
            angular.forEach($scope.Filter_SendEmailUserList, function (row) {
                row.SelectedUser = $scope.SelectedAllUser;
            });
        };

        $scope.SendEmail_Insert = function () {

            var cnt = ($filter('filter')($scope.Filter_SendEmailUserList, 'true')).length;
            if (cnt == 0) {
                //alert("Please select atleast one User");
                toastr.warning("Please select atleast one User", "warning");
            }
            else if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                //alert("Please select Template");
                toastr.warning("Please select Template", "warning");
                return false;
            }
            else {
                $("#chatLoaderPV").show();
                var msgtype = "email";
                if ($scope.PageParameter == "2")
                    msgtype = "notification";
                else if ($scope.PageParameter == "3")
                    msgtype = "sms";
                var msg = confirm("Do you like to send " + msgtype + " for selected users?");
                if (msg == true) {
                    $scope.SelectedUserList = [];
                    angular.forEach($scope.Filter_SendEmailUserList, function (SelectedUser, index) {
                        if (SelectedUser.SelectedUser == true) {

                            var obj = {
                                UserId: SelectedUser.Id,
                                Template_Id: $scope.Template_Id,
                                Created_By: $scope.UserId,
                                Institution_Id: $scope.InstitutionId,
                                TemplateType_Id: $scope.PageParameter,
                                MobileNO: SelectedUser.MobileNO
                            };
                            $('#btnsave').attr("disabled", true);
                            $scope.SelectedUserList.push(obj);
                        }
                    });
                    $http.post(baseUrl + '/api/SendEmail/SendEmail_AddEdit/', $scope.SelectedUserList).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        $('#btnsave').attr("disabled", false);
                        if (data.ReturnFlag == 1) {
                            $scope.ClearValues();
                            $scope.Get_SendEmail_UserList();
                        }
                        $("#chatLoaderPV").hide();
                    });

                }
            }
        }
        $scope.ClearValues = function () {
            angular.forEach($scope.Filter_SendEmailUserList, function (SelectedUser, index) {
                SelectedUser.SelectedUser = false;
            });
            $scope.SelectedAllUser = false;
        }
        $scope.CancelPreview_PopUp = function () {
            angular.element('#Template_PreviewModel').modal('hide');
        }
    }
]);