var EmailHistorycontroller = angular.module("EmailHistoryController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

EmailHistorycontroller.controller("EmailHistoryController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.PageParameter = $routeParams.PageParameter;

        $scope.currentTab = "1";
        $scope.Id = "0";
        $scope.IsActive = true;
        $scope.ActiveStatus = 1;
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.loadCount = 0;
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.TabClick = false;
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.Period_From = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.Period_To = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.EthnicGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];
        $scope.BloodGroupList = [];
        $scope.GroupTypeList = [];

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

        $scope.MessageingHistoryDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $scope.InstitutionBased_CountryStateList();
            }
        }

        $scope.TemplateTagList = [];
        $http.get(baseUrl + '/api/EmailTemplate/TemplateTag_List/?Id=' + $scope.InstituteId).success(function (data) {
            $scope.TemplateTagList = data;
        });
        $scope.ConfigCode = "EMAILHISTORY_DATE_LIMIT";
        $scope.ValidateDays = 14;
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.InstituteId)
            .success(function (data) {
                if (data[0] != undefined) {
                    $scope.ValidateDays = parseInt(data[0].ConfigValue);
                }
                else {
                    $scope.ValidateDays = 14;
                }
            });

        $scope.FilterValidation = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.Period_From = moment($scope.Period_From).format('DD-MMM-YYYY');
            $scope.Period_To = moment($scope.Period_To).format('DD-MMM-YYYY');

            if (typeof ($scope.Period_From) == "undefined" || $scope.Period_From == "") {
                //alert("Please select Period From");
                toastr.warning("Please select Period From", "warning");
                return false;
            }
            if (typeof ($scope.Period_To) == "undefined" || $scope.Period_To == "") {
                //alert("Please select Period To");
                toastr.warning("Please select Period To", "warning");
                return false;
            }
            
            var date1 = new Date($scope.Period_From);
            var date2 = new Date($scope.Period_To);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= $scope.ValidateDays) {
                toastr.warning($scope.ValidateDays + '  ' + "days only allowed to filter", "warning");
                return false;
            }

            var retval = true;
            if (($scope.Period_From != "") && ($scope.Period_To != "")) {

                if ((ParseDate($scope.Period_From) > ParseDate($scope.Period_To))) {
                    toastr.warning("From Date should not be greater than To Date", "warning");
                    $scope.Period_From = DateFormatEdit($scope.Period_From);
                    $scope.Period_To = DateFormatEdit($scope.Period_To);
                    retval = false;
                    return false;
                }
            }

            $scope.Period_From = DateFormatEdit($scope.Period_From);
            $scope.Period_To = DateFormatEdit($scope.Period_To);
            return retval;
        };

        $scope.DefaultCountryState = function () {
            $scope.CountryId = $scope.InsCountryId;
            $scope.StateId = $scope.InsStateId;
            $scope.Country_onChange();
            $scope.CityId = $scope.InsCityId;
            $scope.State_onChange();

            var cId = $scope.CountryId;
            if (cId != "0") {

            }
        }
        $scope.InstitutionBased_CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;

            });
        }
        $scope.Country_onChange = function () {
            $scope.StateNameList = $ff($scope.State_Template, { CountryId: $scope.CountryId });
            setTimeout(function () {
                jQuery("#stateselectpicker").selectpicker('refresh')
            }, 500);
        };
        $scope.StateClearFunction = function () {
            $scope.StateId = "0";
        };
        $scope.State_onChange = function () {
            $scope.CityNameList = $ff($scope.City_Template, { StateId: $scope.StateId });
        };
        $scope.LocationClearFunction = function () {
            $scope.CityId = "0";
        };

        $scope.TemplateTagMappingList = [];
        $scope.TempMappinglist = function () {
            $scope.Type = "1"; //For Email
            $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateTagMapping_List/?Id=' + $scope.Type + '&Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.TemplateTagMappingList = data;
            });
        };

        $scope.Emailemptydata = [];
        $scope.EmailrowCollectionFilter = [];
        $scope.Emaildatalist = [];
        $scope.EmailHistoryDetailslist = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                if ($scope.FilterValidation() == true) {
                    $("#chatLoaderPV").show();
                    $scope.Period_From = document.getElementById("Period_From").value;
                    $scope.Period_To = document.getElementById("Period_To").value;
                    $http.get(baseUrl + '/api/SendEmail/EmailHistory_List/?Id=' + $scope.Id + '&Period_From=' + $scope.Period_From + '&Period_To=' + $scope.Period_To + '&Email_Stauts=' + $scope.Email_Stauts
                        + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId']
                        + '&TemplateType_Id=' + $scope.PageParameter + '&Login_Session_Id=' + $scope.LoginSessionId
                    ).success(function (data) {
                        //$scope.Emailemptydata = [];
                        $scope.EmailrowCollectionFilter = [];
                        $scope.Emaildatalist = data;
                        //$scope.EmailrowCollectionFilter = data;
                        $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
                        $("#chatLoaderPV").hide();
                    });
                }
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.Email_Stauts = "0"
        $scope.searchquerylist = "";
        //$scope.EmailrowCollectionFilter =[];
        /* FILTER THE LIST FUNCTION.*/
        $scope.filterEmailHistoryList = function () {
            // $scope.EmailStatusList();
            $scope.EmailrowCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquerylist);
            /* if ($scope.searchquerylist == "") {
                 if ($scope.EmailrowCollectionFilter.length > 0) {
                     $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
                 }
             }*/
            if ($scope.searchquerylist == "") {
                //  $scope.EmailrowCollectionFilter = [];
                $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
            }
            else {
                $scope.EmailrowCollectionFilter = $ff($scope.Emaildatalist, function (value) {
                    if (value.Email_Status == 0) {
                        val = "";
                    }
                    else {
                        val = value.Email_Status;
                    }
                    return angular.lowercase(value.EmailId).match(searchstring) ||
                        angular.lowercase(value.TypeName).match(searchstring) ||
                        angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.TemplateName).match(searchstring) ||
                        angular.lowercase(value.EmailSubject).match(searchstring) ||
                        angular.lowercase(value.EmailTemplate).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Send_Date, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(val).match(searchstring) ||
                        angular.lowercase(value.Email_Error_Reason).match(searchstring) ||
                        angular.lowercase(value.EmailStatusType).match(searchstring);
                });
            }
        }

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
        }
        $scope.EmailBody_ViewModel = function (EmailId, EmailSubject, EmailBody) {
            angular.element('#EmailBody_ViewModel').modal('show');
            $scope.EmailId = EmailId;
            $scope.EmailSubject = EmailSubject;
            $scope.Generated_Template = EmailBody;
        }

        $scope.SMSBody_ViewModel = function (MobileNO, EmailSubject, EmailBody) {
            angular.element('#EmailBody_ViewModel').modal('show');
            $scope.MobileNO = MobileNO;
            $scope.EmailSubject = EmailSubject;
            $scope.Generated_Template = EmailBody;
        }

        $scope.EmailBody_CancelModel = function () {
            angular.element('#EmailBody_ViewModel').modal('hide');
        }

    }
]);