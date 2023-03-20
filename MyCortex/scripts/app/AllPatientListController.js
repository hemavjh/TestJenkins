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
        $scope.Patient_Search = 0;
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
        $scope.IsPagenation = false;
        $scope.current_page = 1;
        $scope.total_page = 1;

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
                $http.get(baseUrl + '/api/Common/BloodGroupList/').then(function (response) {
                    $scope.BloodGroupList = response.data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').then(function (response) {
                    $scope.MaritalStatusList = response.data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).then(function (response) {
                    $scope.GroupTypeList = response.data;
                });
                $http.get(baseUrl + '/api/Common/GenderList/').then(function (response) {
                    $scope.GenderList = response.data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').then(function (response) {
                    $scope.NationalityList = response.data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').then(function (response) {
                    $scope.EthnicGroupList = response.data;
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
            $http.get(baseUrl + '/api/Common/CountryList/').then(function (response) {
                $scope.CountryNameList = response.data;

            });
        }
        $scope.Filter_Country_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.filter_CountryId).then(function (response) {
                    $scope.StateNameList = response.data;
                    $scope.CityNameList = [];
                    $scope.filter_CityId = "0";
                });
            }
        }
        $scope.Filter_State_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.filter_CountryId + '&StateId=' + $scope.filter_StataId).then(function (response) {
                    $scope.CityNameList = response.data;
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
                //).then(function (data) {
                //    $scope.PatientCount = data[0].PatientCount;
                //Get the Patient Per Page Count
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $scope.UserTypeId = $window.localStorage['UserTypeId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1){
                    $scope.Patient_PerPage = data1.data[0].ConfigValue;
                    $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                    $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                    $scope.Input_Type = 1;
                    $scope.SearchEncryptedQuery = $scope.searchquery;
                    var obj = {
                        InputType: $scope.Input_Type,
                        DecryptInput: $scope.SearchEncryptedQuery
                    };
                    $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).then(function (response){
                        $scope.SearchEncryptedQuery = response.data;

                        //Get the Patient List
                        $http.get(baseUrl + '/api/AllPatientList/PatientList/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&UserTypeId=' + $scope.UserTypeId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd + '&SearchQuery=' + $scope.searchquery + '&SearchEncryptedQuery=' + $scope.SearchEncryptedQuery
                        ).then(function (Patientdata){
                            /*$("#chatLoaderPV").hide();*/
                            $scope.SearchMsg = "No Data Available";
                            $scope.PageCountArray = [];
                            $scope.Patientemptydata = [];
                            $scope.PatientList = [];

                            if ($scope.UserTypeId === "6") {
                                $scope.CC_PatientNo = "";
                                $scope.CC_InsuranceId = "";
                                $scope.CC_GenderId = "0";
                                $scope.CC_NationalityId = "";
                                $scope.CC_EthinicGroupId = "0";
                                $scope.CC_MOBILE_NO = "";
                                $scope.CC_HomePhoneNo = "";
                                $scope.CC_Email = "";
                                $scope.CC_MaritalStatus = "0";
                                $scope.CC_CountryId = "0";
                                $scope.CC_StataId = "0";
                                $scope.CC_CityId = "0";
                                $scope.CC_BloodGroupId = "0";
                                $scope.CC_GroupId = "0";
                                $scope.PageNumber = 1;
                                $scope.PageParameter = 1;
                                $http.post(baseUrl + '/api/CareCoordinnator/CareCoordinator_PatientList/?Coordinator_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.CC_PatientNo + '&INSURANCEID=' + $scope.CC_InsuranceId + '&GENDER_ID=' + $scope.CC_GenderId + '&NATIONALITY_ID=' + $scope.CC_NationalityId + '&ETHINICGROUP_ID=' + $scope.CC_EthinicGroupId + '&MOBILE_NO=' + $scope.CC_MOBILE_NO + '&HOME_PHONENO=' + $scope.CC_HomePhoneNo + '&EMAILID=' + $scope.CC_Email + '&MARITALSTATUS_ID=' + $scope.CC_MaritalStatus + '&COUNTRY_ID=' + $scope.CC_CountryId + '&STATE_ID=' + $scope.CC_StataId + '&CITY_ID=' + $scope.CC_CityId + '&BLOODGROUP_ID=' + $scope.CC_BloodGroupId + '&Group_Id=' + $scope.CC_GroupId + '&TypeId=' + $scope.PageParameter + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId
                                ).then(function (patient_data){
                                    $scope.rowCollectionFilter = $ff(patient_data.data, function (value) {
                                        angular.forEach(Patientdata.data, function (item) {
                                            if (item.Id === value.Id) {

                                                item.HighCount = value.HighCount;
                                                item.MediumCount = value.MediumCount;
                                                item.LowCount = value.LowCount;

                                                return (value.HighCount > 0 && $scope.HighSelected == true) ||
                                                    (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                                                    (value.LowCount > 0 && $scope.LowSelected == true) ||
                                                    ($scope.NoAlertSelected == true && value.HighCount == 0 && value.MediumCount == 0 && value.LowCount == 0);
                                            }
                                        });
                                    });
                                    $scope.PatientList = Patientdata.data;
                                    $scope.Patientemptydata = Patientdata.data;
                                    //$scope.PatientCount = $scope.PatientList.length;
                                    if ($scope.PatientList.length > 0) {
                                        $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                                    }
                                    if ($scope.searchquery == '') {
                                        total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                        $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                        for (var i = 0; i < total; i++) {
                                            var obj = {
                                                PageNumber: i + 1
                                            }
                                            $scope.PageCountArray.push(obj);
                                        }
                                        if ($scope.PageCountArray.length > 1) {
                                            $scope.IsPagenation = true;
                                        }
                                    }
                                    $scope.PatientFilter = angular.copy($scope.PatientList);
                                    $scope.PatientFilterCopyList = angular.copy($scope.PatientList);
                                    $("#chatLoaderPV").hide();
                                }, function errorCallback(patient_data) {

                                });
                            } else if ($scope.UserTypeId === "5") {
                                $scope.CG_PatientNo = "";
                                $scope.CG_InsuranceId = "";
                                $scope.CG_GenderId = 0;
                                $scope.CG_NationalityId = 0;
                                $scope.CG_EthinicGroupId = 0;
                                $scope.CG_MOBILE_NO = "";
                                $scope.CG_HomePhoneNo = "";
                                $scope.CG_Email = "";
                                $scope.CG_MaritalStatus = 0;
                                $scope.CG_CountryId = "0";
                                $scope.CG_StateId = "0";
                                $scope.CG_CityId = "0";
                                $scope.CG_BloodGroupId = "0";
                                $scope.CG_GroupId = "0";
                                $scope.PageNumber = 1;

                                $scope.HighSelected = false;
                                $scope.MediumSelected = false;
                                $scope.LowSelected = false;
                                $scope.NoAlertSelected = false;

                                $http.get(baseUrl + '/api/CareGiver/CareGiver_AssignedPatientList/?CareGiver_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.CG_PatientNo + '&INSURANCEID=' + $scope.CG_InsuranceId + '&GENDER_ID=' + $scope.CG_GenderId + '&NATIONALITY_ID=' + $scope.CG_NationalityId + '&ETHINICGROUP_ID=' + $scope.CG_EthinicGroupId + '&MOBILE_NO=' + $scope.CG_MOBILE_NO + '&HOME_PHONENO=' + $scope.CG_HomePhoneNo + '&EMAILID=' + $scope.CG_Email + '&MARITALSTATUS_ID=' + $scope.CG_MaritalStatus + '&COUNTRY_ID=' + $scope.CG_CountryId + '&STATE_ID=' + $scope.CG_StataId + '&CITY_ID=' + $scope.CG_CityId + '&BLOODGROUP_ID=' + $scope.CG_BloodGroupId + '&Group_Id=' + $scope.CG_GroupId + '&PageNumber=' + $scope.PageNumber + '&Login_Session_Id=' + $scope.LoginSessionId
                                ).then(function (patient_data){
                                    $scope.rowCollectionFilter = $ff(patient_data.data, function (value) {
                                        angular.forEach(Patientdata.data, function (item) {
                                            if (item.Id === value.Id) {

                                                item.HighCount = value.HighCount;
                                                item.MediumCount = value.MediumCount;
                                                item.LowCount = value.LowCount;

                                                return (value.HighCount > 0 && $scope.HighSelected == true) ||
                                                    (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                                                    (value.LowCount > 0 && $scope.LowSelected == true) ||
                                                    ($scope.NoAlertSelected == true && value.HighCount == 0 && value.MediumCount == 0 && value.LowCount == 0);
                                            }
                                        });
                                    });
                                    $scope.PatientList = Patientdata.data;
                                    $scope.Patientemptydata = Patientdata.data;
                                    //$scope.PatientCount = $scope.PatientList.length;
                                    if ($scope.PatientList.length > 0) {
                                        $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                                    }
                                    if ($scope.searchquery == '') {
                                        total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                        $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                        for (var i = 0; i < total; i++) {
                                            var obj = {
                                                PageNumber: i + 1
                                            }
                                            $scope.PageCountArray.push(obj);
                                        }
                                        if ($scope.PageCountArray.length > 1) {
                                            $scope.IsPagenation = true;
                                        }
                                    }
                                    $scope.PatientFilter = angular.copy($scope.PatientList);
                                    $scope.PatientFilterCopyList = angular.copy($scope.PatientList);
                                    $("#chatLoaderPV").hide();
                                }, function errorCallback(patient_data) {

                                });
                            }
                            else if ($scope.UserTypeId === "4" || $scope.UserTypeId === "7") {
                                angular.forEach(Patientdata.data, function (item) {
                                    var temp_HighCount = 0, temp_MediumCount = 0, temp_LowCount;
                                    $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + item.Id + '&UserTypeId=2&Login_Session_Id=' + $scope.LoginSessionId
                                    ).then(function (patient_data)
                                    {
                                        $scope.rowCollectionFilter = $ff(patient_data.data, function (value) {
                                            temp_HighCount = temp_HighCount + value.HighCount;
                                            temp_MediumCount = temp_MediumCount + value.MediumCount;
                                            temp_LowCount = temp_LowCount + value.LowCount;

                                            return (value.HighCount > 0 && $scope.HighSelected == true) ||
                                                (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                                                (value.LowCount > 0 && $scope.LowSelected == true) ||
                                                ($scope.NoAlertSelected == true && value.HighCount == 0 && value.MediumCount == 0 && value.LowCount == 0);
                                        });
                                        item.HighCount = temp_HighCount;
                                        item.MediumCount = temp_MediumCount;
                                        item.LowCount = temp_LowCount;

                                        $scope.PatientList = Patientdata.data;
                                        $scope.Patientemptydata = Patientdata.data;
                                        //$scope.PatientCount = $scope.PatientList.length;
                                        if ($scope.PatientList.length > 0) {
                                            $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                                        }
                                        if ($scope.searchquery == '') {
                                            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                            $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                            for (var i = 0; i < total; i++) {
                                                var obj = {
                                                    PageNumber: i + 1
                                                }
                                                $scope.PageCountArray.push(obj);
                                            }
                                            if ($scope.PageCountArray.length > 1) {
                                                $scope.IsPagenation = true;
                                            }
                                        }
                                        $scope.PatientFilter = angular.copy($scope.PatientList);
                                        $scope.PatientFilterCopyList = angular.copy($scope.PatientList);
                                        $("#chatLoaderPV").hide();
                                    }, function errorCallback(patient_data) {

                                    });
                                });
                            } else {
                                $scope.PatientList = Patientdata.data;
                                $scope.Patientemptydata = Patientdata.data;
                                //$scope.PatientCount = $scope.PatientList.length;
                                if ($scope.PatientList.length > 0) {
                                    $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                                }
                                if ($scope.searchquery == '') {
                                    total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                    $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                                    for (var i = 0; i < total; i++) {
                                        var obj = {
                                            PageNumber: i + 1
                                        }
                                        $scope.PageCountArray.push(obj);
                                    }
                                    if ($scope.PageCountArray.length > 1) {
                                        $scope.IsPagenation = true;
                                    }
                                }
                                $scope.PatientFilter = angular.copy($scope.PatientList);
                                $scope.PatientFilterCopyList = angular.copy($scope.PatientList);
                                $("#chatLoaderPV").hide();
                            }
                        }, function errorCallback(Patientdata) {

                        });
                    }, function errorCallback(response) {

                    });
                }, function errorCallback(data1) {

                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }
        $scope.filterPatientList = function () {
            $scope.Patientemptydata = [];
            if ($scope.searchquery == "") {
                $("#chatLoaderPV").show();
                $scope.PatientListFunction(1);
            } else {
                if ($scope.filter_CGSearchFieldId == "0") {
                    toastr.warning("Please select Search Field", "Warning");
                } else {
                    $("#chatLoaderPV").show();
                    if ($scope.filter_CGSearchFieldId == "1") {
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
                    $scope.Patient_Search = 0;
                    $scope.CG_PatientSearch();
                }
            }
        }
        $scope.AdvancefilterPatientList = function () {
            $("#chatLoaderPV").show();
            $scope.Filter_PatientNo2 = $scope.Filter_PatientNo;
            $scope.filter_InsuranceId2 = $scope.filter_InsuranceId;
            $scope.filter_MOBILE_NO2 = $scope.filter_MOBILE_NO;
            $scope.filter_Email2 = $scope.filter_Email;
            $scope.filter_NationalityId2 = $scope.filter_NationalityId;
            $scope.Filter_FirstName2 = $scope.Filter_FirstName;
            $scope.Filter_LastName2 = $scope.Filter_LastName;
            $scope.Filter_MRN2 = $scope.Filter_MRN;
            $scope.Patient_Search = 1;
            $scope.CG_PatientSearch();
        }
        $scope.CG_PatientSearch = function () {
            $http.get(baseUrl + '/api/AllPatientList/SearchPatientList/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo2 + '&INSURANCEID=' + $scope.filter_InsuranceId2 + '&NATIONALITY_ID=' + $scope.filter_NationalityId2 + '&MOBILE_NO=' + $scope.filter_MOBILE_NO2 + '&FIRSTNAME=' + $scope.Filter_FirstName2 + '&LASTNAME=' + $scope.Filter_LastName2 + '&MRN=' + $scope.Filter_MRN2 + '&EMAILID=' + $scope.filter_Email2 + '&UserTypeId=' + $scope.UserTypeId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd + '&AdvanceFilter=' + $scope.Patient_Search
            ).then(function (Patientdata){
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.PageCountArray = [];
                $scope.Patientemptydata = [];
                $scope.PatientList = [];
                $scope.PatientList = Patientdata.data;
                $scope.Patientemptydata = Patientdata.data;
                //$scope.PatientCount = $scope.PatientList.length;
                $scope.PatientCount = Patientdata.data.length;
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

            }, function errorCallback(Patientdata) {

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
            $window.location.href = baseUrl + "/Home/Index/PatientVitals/" + $scope.Id + "/4";
        }
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.setPage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else
                $scope.inputPageNo = PageNo;

            $scope.current_page = PageNo;
            $scope.PatientListFunction($scope.current_page);
        }
    }
]);