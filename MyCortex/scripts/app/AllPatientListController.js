var AllPatientList = angular.module("AllPatientListController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


AllPatientList.controller("AllPatientListController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.SearchMsg = "No Data Available";
        $scope.searchquery = "";
        $scope.SearchEncryptedQuery = "";
        $scope.PatientFilter = [];
        $scope.PatientList = [];
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.Filter_FirstName = "";
        $scope.Filter_LastName = "";
        $scope.Filter_MRN = "";
        $scope.filter_CGSearchFieldId = "0";
        $scope.Filter_PatientNo2 = "";
        $scope.filter_InsuranceId2 = "";
        $scope.filter_MOBILE_NO2 = "";
        $scope.filter_Email2 = "";
        $scope.filter_NationalityId2 = "";
        $scope.Filter_FirstName2 = "";
        $scope.Filter_LastName2 = "";
        $scope.Filter_MRN2 = "";
        $scope.flag = 0;
        $scope.CommaSeparated_Group = $scope.filter_GroupId.toString();
        $scope.Doctor_Id = $window.localStorage['UserId'];
        $scope.ActiveStatus = "1";
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.PageCountArray = [];
        $scope.Patient_PerPage = 0;
        $scope.PatientCount = 0;
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.PageNumber = 1;
        $scope.loadCount = 0;
        $scope.TabClick = false;

        $scope.ResetPatientFilter = function () {
            $scope.Filter_PatientNo2 = "";
            $scope.filter_InsuranceId2 = "";
            $scope.filter_MOBILE_NO2 = "";
            $scope.filter_Email2 = "";
            $scope.filter_NationalityId2 = "";
            $scope.Filter_FirstName2 = "";
            $scope.Filter_LastName2 = "";
            $scope.Filter_MRN2 = "";
            $scope.Filter_PatientNo = "";
            $scope.filter_InsuranceId = "";
            $scope.Filter_GenderId = "0";
            $scope.filter_NationalityId = "";
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
            $scope.Filter_FirstName = "";
            $scope.Filter_LastName = "";
            $scope.Filter_MRN = "";
            //$scope.PatientListFunction(1);
            $scope.Next_PatientListFunction(1);
        }

        $scope.AllPatientsDropdownList = function () {
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
        $scope.PatientFilterCopy = [];
        $scope.PatientFilterCopyList = [];


        $scope.PatientListFunction = function (PageNumber) {
            if ($window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 5 || $window.localStorage['UserTypeId'] == 6 || $window.localStorage['UserTypeId'] == 7) {
                $("#chatLoaderPV").show();
                $scope.PageNumber = PageNumber;
                $scope.PageCountArray = [];
                //Get the Count of All Patient List
                //  $http.get(baseUrl + '/api/AllPatientList/GetPatientList_Count/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&UserTypeId=' + $scope.UserTypeId 
                //).success(function (data) {
                //    $scope.PatientCount = data[0].PatientCount;
                //Get the Patient Per Page Count
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $scope.UserTypeId = $window.localStorage['UserTypeId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                    $scope.Patient_PerPage = data1[0].ConfigValue;
                    $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                    $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                    $scope.Input_Type = 1;
                    $scope.SearchEncryptedQuery = $scope.searchquery;
                    var obj = {
                        InputType: $scope.Input_Type,
                        DecryptInput: $scope.SearchEncryptedQuery
                    };
                    $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                        $scope.SearchEncryptedQuery = data;

                        //Get the Patient List
                        $http.get(baseUrl + '/api/AllPatientList/PatientList/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&UserTypeId=' + $scope.UserTypeId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd + '&SearchQuery=' + $scope.searchquery + '&SearchEncryptedQuery=' + $scope.SearchEncryptedQuery
                        ).success(function (Patientdata) {
                            $("#chatLoaderPV").hide();
                            $scope.SearchMsg = "No Data Available";
                            $scope.PageCountArray = [];
                            $scope.Patientemptydata = [];
                            $scope.PatientList = [];
                            $scope.PatientList = Patientdata;
                            $scope.Patientemptydata = Patientdata;
                            //$scope.PatientCount = $scope.PatientList.length;
                            if ($scope.PatientList.length > 0) {
                                $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                            }
                            if ($scope.searchquery == '') {
                                total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                for (var i = 0; i < total; i++) {
                                    var obj = {
                                        PageNumber: i + 1
                                    }
                                    $scope.PageCountArray.push(obj);
                                }
                            }
                            $scope.PatientFilter = angular.copy($scope.PatientList);
                            $scope.PatientFilterCopyList = angular.copy($scope.PatientList);

                        });
                    });
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }
        $scope.filterPatientList = function () {
            $("#chatLoaderPV").show();
            $scope.Patientemptydata = [];
            if ($scope.searchquery == "") {
                $scope.PatientListFunction(1);
            } else {
                if ($scope.filter_CGSearchFieldId == "0") {
                    toastr.warning("Please select Search Field", "Warning");
                } else if ($scope.filter_CGSearchFieldId == "1") {
                    $scope.Filter_PatientNo2 = $scope.searchquery;
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "2") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = $scope.searchquery;
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "3") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = $scope.searchquery;
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "4") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = $scope.searchquery;
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "5") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = $scope.searchquery;
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "6") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = $scope.searchquery;
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "7") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = $scope.searchquery;
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = "";
                } else if ($scope.filter_CGSearchFieldId == "8") {
                    $scope.Filter_PatientNo2 = "";
                    $scope.filter_InsuranceId2 = "";
                    $scope.filter_MOBILE_NO2 = "";
                    $scope.filter_Email2 = "";
                    $scope.filter_NationalityId2 = "";
                    $scope.Filter_FirstName2 = "";
                    $scope.Filter_LastName2 = "";
                    $scope.Filter_MRN2 = $scope.searchquery;
                } else {
                    $scope.Filter_PatientNo2 = $scope.searchquery;
                    $scope.filter_InsuranceId2 = $scope.searchquery;
                    $scope.filter_MOBILE_NO2 = $scope.searchquery;
                    $scope.filter_Email2 = $scope.searchquery;
                    $scope.filter_NationalityId2 = $scope.searchquery;
                    $scope.Filter_FirstName2 = $scope.searchquery;
                    $scope.Filter_LastName2 = $scope.searchquery;
                    $scope.Filter_MRN2 = $scope.searchquery;
                }
                $scope.CG_PatientSearch();
            }
        }
        $scope.AdvancefilterPatientList = function () {
            $scope.Filter_PatientNo2 = $scope.Filter_PatientNo;
            $scope.filter_InsuranceId2 = $scope.filter_InsuranceId;
            $scope.filter_MOBILE_NO2 = $scope.filter_MOBILE_NO;
            $scope.filter_Email2 = $scope.filter_Email;
            $scope.filter_NationalityId2 = $scope.filter_NationalityId;
            $scope.Filter_FirstName2 = $scope.Filter_FirstName;
            $scope.Filter_LastName2 = $scope.Filter_LastName;
            $scope.Filter_MRN2 = $scope.Filter_MRN;
            $scope.CG_PatientSearch();
        }
        $scope.CG_PatientSearch = function () {
            $http.get(baseUrl + '/api/AllPatientList/SearchPatientList/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo2 + '&INSURANCEID=' + $scope.filter_InsuranceId2 + '&NATIONALITY_ID=' + $scope.filter_NationalityId2 + '&MOBILE_NO=' + $scope.filter_MOBILE_NO2 + '&FIRSTNAME=' + $scope.Filter_FirstName2 + '&LASTNAME=' + $scope.Filter_LastName2 + '&MRN=' + $scope.Filter_MRN2 + '&EMAILID=' + $scope.filter_Email2 + '&UserTypeId=' + $scope.UserTypeId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd
            ).success(function (Patientdata) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.PageCountArray = [];
                $scope.Patientemptydata = [];
                $scope.PatientList = [];
                $scope.PatientList = Patientdata;
                $scope.Patientemptydata = Patientdata;
                //$scope.PatientCount = $scope.PatientList.length;
                $scope.PatientCount = Patientdata.length;
                if ($scope.searchquery == '') {
                    total = Math.ceil(($scope.PatientCount) / ($scope.PatientCount));
                    for (var i = 0; i < total; i++) {
                        var obj = {
                            PageNumber: i + 1
                        }
                        $scope.PageCountArray.push(obj);
                    }
                }
                $scope.PatientFilter = angular.copy($scope.PatientList);
                $scope.PatientFilterCopyList = angular.copy($scope.PatientList);

            });
        }
        $scope.Next_PatientListFunction = function (PageNumber) {
            $scope.PageNumber = PageNumber;
            $("#chatLoaderPV").show();
            $scope.Patientemptydata = [];
            $scope.PatientListFunction(PageNumber);
        }
        $scope.AllPatient_PatientData = function (eventId) {
            //All Patients
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/4";
        }
    }
]);