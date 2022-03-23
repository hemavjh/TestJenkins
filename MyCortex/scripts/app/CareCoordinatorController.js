var CareCoordinator = angular.module("CareCoordinatorController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


CareCoordinator.controller("CareCoordinatorController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.currentTab = '1';
        $scope.flag = 0;
        $scope.Coordinator_Id = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.UserTypeId = $window.localStorage['UserTypeId'];

        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.rowCollectionFilter = [];
        $scope.CareCoordinator_PatientList = [];
        $scope.filter_CCComSearchFieldId = "0";
        $scope.coordinator_searchquery = "";
        $scope.Filter_FirstName = "";
        $scope.Filter_LastName = "";
        $scope.Filter_MRN = "";
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
        $scope.loadCount = 0;
        $scope.TabClick = false;
        $scope.CC_PatientNo2 = "";
        $scope.CC_InsuranceId2 = "";
        $scope.CC_MOBILE_NO2 = "";
        $scope.CC_Email2 = "";
        $scope.CC_NationalityId2 = "";
        $scope.Filter_FirstName2 = "";
        $scope.Filter_LastName2 = "";
        $scope.Filter_MRN2 = "";
        $scope.Patient_Search = 0;

        $scope.Reset_CC_Filter = function () {
            $scope.CC_PatientNo2 = "";
            $scope.CC_InsuranceId2 = "";
            $scope.CC_MOBILE_NO2 = "";
            $scope.CC_Email2 = "";
            $scope.CC_NationalityId2 = "";
            $scope.Filter_FirstName2 = "";
            $scope.Filter_LastName2 = "";
            $scope.Filter_MRN2 = "";
            $scope.CC_PatientNo = "";
            $scope.CC_InsuranceId = "";
            $scope.CC_GenderId = "0";
            $scope.CC_NationalityId = "0";
            $scope.CC_EthinicGroupId = "0";
            $scope.CC_MOBILE_NO = "";
            $scope.CC_HomePhoneNo = "";
            $scope.CC_Email = "";
            $scope.Filter_FirstName = "";
            $scope.Filter_LastName = "";
            $scope.Filter_MRN = "";
            $scope.CC_NationalityId = "";
            $scope.CC_MaritalStatus = "0";
            $scope.CC_CountryId = "0";
            $scope.CC_StataId = "0";
            $scope.CC_CityId = "0";
            $scope.CC_BloodGroupId = "0";
            $scope.CC_GroupId = "0";
            $scope.CareCoordinator_PatientListFunction(1);
        }

        $scope.CarecoordinatorDropdownList = function () {
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
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
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

        $scope.CC_Country_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CC_CountryId).success(function (data) {
                    $scope.StateNameList = data;
                    $scope.CityNameList = [];
                    $scope.CC_CityId = "0";
                });
            }
        }
        $scope.CC_State_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CC_CountryId + '&StateId=' + $scope.CC_StataId).success(function (data) {
                    $scope.CityNameList = data;
                });
            }
        }
        $scope.PatientFilterCopy = [];
        $scope.PatientFilterCopyList = [];
        $scope.PageCountArray = [];
        $scope.CareCoordinator_PatientListFunction = function (PageNumber) {
            if ($window.localStorage['UserTypeId'] == 6) {

                $("#chatLoaderPV").show();
                $scope.PatientFilterCopy = [];
                $scope.PageNumber = PageNumber;
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                    $scope.Patient_PerPage = data1[0].ConfigValue;
                    $http.post(baseUrl + '/api/CareCoordinnator/CareCoordinator_PatientList/?Coordinator_Id=' + $scope.Coordinator_Id + '&PATIENTNO=' + $scope.CC_PatientNo + '&INSURANCEID=' + $scope.CC_InsuranceId + '&GENDER_ID=' + $scope.CC_GenderId + '&NATIONALITY_ID=' + $scope.CC_NationalityId + '&ETHINICGROUP_ID=' + $scope.CC_EthinicGroupId + '&MOBILE_NO=' + $scope.CC_MOBILE_NO + '&HOME_PHONENO=' + $scope.CC_HomePhoneNo + '&EMAILID=' + $scope.CC_Email + '&MARITALSTATUS_ID=' + $scope.CC_MaritalStatus + '&COUNTRY_ID=' + $scope.CC_CountryId + '&STATE_ID=' + $scope.CC_StataId + '&CITY_ID=' + $scope.CC_CityId + '&BLOODGROUP_ID=' + $scope.CC_BloodGroupId + '&Group_Id=' + $scope.CC_GroupId + '&TypeId=' + $scope.PageParameter + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId
                    ).success(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.emptydata = [];
                        $scope.CareCoordinator_PatientList = [];
                        $window.localStorage['CC_Date'] = new Date();
                        $scope.CareCoordinator_PatientList = data;
                        $scope.PatientCount = $scope.CareCoordinator_PatientList.length;
                        total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                        for (var i = 0; i < total; i++) {
                            var obj = {
                                PageNumber: i + 1
                            }
                            $scope.PageCountArray.push(obj);
                        }
                        $scope.rowCollectionFilter = angular.copy($scope.CareCoordinator_PatientList);
                        $scope.PatientFilterCopyList = angular.copy($scope.CareCoordinator_PatientList);
                        $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                        $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                        //Get the records for Page Load
                        $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value, index) {
                            return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
                        });
                        if ($scope.rowCollectionFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                    });
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }

        }

        $scope.CareCoordinator_Filter = function () {
            if ($scope.coordinator_searchquery == "") {
                $scope.PatientFilterCopy = [];
                $("#chatLoaderPV").show();
                $scope.CareCoordinator_PatientListFunction(1);
            } else {
                if ($scope.filter_CCComSearchFieldId == "0") {
                    toastr.warning("Please select Search Field", "Warning");
                } else {
                    $scope.PatientFilterCopy = [];
                    $("#chatLoaderPV").show();
                    if ($scope.filter_CCComSearchFieldId == "1") {
                        $scope.CC_PatientNo2 = $scope.coordinator_searchquery;
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "2") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = $scope.coordinator_searchquery;
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "3") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = $scope.coordinator_searchquery;
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "4") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = $scope.coordinator_searchquery;
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "5") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = $scope.coordinator_searchquery;
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "6") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = $scope.coordinator_searchquery;
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "7") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = $scope.coordinator_searchquery;
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_CCComSearchFieldId == "8") {
                        $scope.CC_PatientNo2 = "";
                        $scope.CC_InsuranceId2 = "";
                        $scope.CC_MOBILE_NO2 = "";
                        $scope.CC_Email2 = "";
                        $scope.CC_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.Filter_MRN2 = $scope.coordinator_searchquery;
                    } else {
                        $scope.CC_PatientNo2 = $scope.coordinator_searchquery;
                        $scope.CC_InsuranceId2 = $scope.coordinator_searchquery;
                        $scope.CC_MOBILE_NO2 = $scope.coordinator_searchquery;
                        $scope.CC_Email2 = $scope.coordinator_searchquery;
                        $scope.CC_NationalityId2 = $scope.coordinator_searchquery;
                        $scope.Filter_FirstName2 = $scope.coordinator_searchquery;
                        $scope.Filter_LastName2 = $scope.coordinator_searchquery;
                        $scope.Filter_MRN2 = $scope.coordinator_searchquery;
                    }
                    $scope.Patient_Search = 0;
                    $scope.CareCoordinator_FilterListFunction();
                }
            }
        }

        $scope.CareCoordinator_AdvanceFilter = function () {
            $scope.CC_PatientNo2 = $scope.CC_PatientNo;
            $scope.CC_InsuranceId2 = $scope.CC_InsuranceId;
            $scope.CC_MOBILE_NO2 = $scope.CC_MOBILE_NO;
            $scope.CC_Email2 = $scope.CC_Email;
            $scope.CC_NationalityId2 = $scope.CC_NationalityId;
            $scope.Filter_FirstName2 = $scope.Filter_FirstName;
            $scope.Filter_LastName2 = $scope.Filter_LastName;
            $scope.Filter_MRN2 = $scope.Filter_MRN;
            $scope.Patient_Search = 1;
            $scope.CareCoordinator_FilterListFunction();
        }

        $scope.CareCoordinator_FilterListFunction = function () {
            if ($window.localStorage['UserTypeId'] == 6) {
                $("#chatLoaderPV").show();
                $scope.PatientFilterCopy = [];
                $scope.PageNumber = 1;
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.post(baseUrl + '/api/CareCoordinnator/CareCoordinator_FilterPatientList/?Coordinator_Id=' + $scope.Coordinator_Id + '&PATIENTNO=' + $scope.CC_PatientNo2 + '&FIRSTNAME=' + $scope.Filter_FirstName2 + '&LASTNAME=' + $scope.Filter_LastName2 + '&MRN=' + $scope.Filter_MRN2 + '&INSURANCEID=' + $scope.CC_InsuranceId2 + '&NATIONALITY_ID=' + $scope.CC_NationalityId2 + '&MOBILE_NO=' + $scope.CC_MOBILE_NO2 + '&EMAILID=' + $scope.CC_Email2 + '&UserTypeId=' + $scope.UserTypeId + '&TypeId=' + $scope.PageParameter + '&Login_Session_Id=' + $scope.LoginSessionId + '&AdvanceFilter=' + $scope.Patient_Search
                ).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.emptydata = [];
                    $scope.CareCoordinator_PatientList = [];
                    $window.localStorage['CC_Date'] = new Date();
                    $scope.CareCoordinator_PatientList = data;
                    $scope.PatientCount = $scope.CareCoordinator_PatientList.length;
                    total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                    for (var i = 0; i < total; i++) {
                        var obj = {
                            PageNumber: i + 1
                        }
                        $scope.PageCountArray.push(obj);
                    }
                    $scope.rowCollectionFilter = angular.copy($scope.CareCoordinator_PatientList);
                    $scope.PatientFilterCopyList = angular.copy($scope.CareCoordinator_PatientList);
                    $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                    $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                    //Get the records for Page Load
                    $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value, index) {
                        return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
                    });
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }

        }

        $scope.Next_CareCoordinator_PatientListFunction = function (PageNumber) {
            $scope.PageNumber = PageNumber;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            //Get the records for Page Load
            $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }

        $scope.Coordinator_ListFilter = function () {
            $scope.ResultListFiltered = [];
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            var searchstring = angular.lowercase($scope.coordinator_searchquery);
            if ($scope.coordinator_searchquery == "") {
                $scope.rowCollectionFilter = [];
                $scope.rowCollectionFilter = angular.copy($scope.PatientFilterCopyList);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.PatientFilterCopyList, function (value) {
                    return angular.lowercase(value.PatientName).match(searchstring) ||
                        angular.lowercase(value.MRN_NO).match(searchstring) ||
                        angular.lowercase(value.Smoker_Option).match(searchstring) ||
                        angular.lowercase(value.Diabetic_Option).match(searchstring) ||
                        angular.lowercase(value.Diabetic_Option).match(searchstring) ||
                        angular.lowercase(value.Cholestrol_Option).match(searchstring);
                });

            }
            $scope.PatientCount = $scope.rowCollectionFilter.length;
            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
            for (var i = 0; i < total; i++) {
                var obj = {
                    PageNumber: i + 1
                }
                $scope.PageCountArray.push(obj);
            }
            $scope.CareCoordinator_PatientList = $scope.rowCollectionFilter;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            $scope.rowCollectionFilter = $ff($scope.rowCollectionFilter, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }
        $scope.AlertArray = [];
        $scope.HighSelected = false;
        $scope.MediumSelected = false;
        $scope.LowSelected = false;
        $scope.Filter_Selected = ["1", "2", "3"];
        $scope.Coordinator_Filter = function () {
            $scope.PageNumber = 1;
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            $scope.HighSelected = false;
            $scope.MediumSelected = false;
            $scope.LowSelected = false;
            $scope.SelectedFilter = $scope.Filter_Selected.toString();
            /*if ((($scope.SelectedFilter.match('1')) && ($scope.SelectedFilter.match('2')) && ($scope.SelectedFilter.match('3')))) {
                $scope.CareCoordinator_PatientList = angular.copy($scope.PatientFilterCopyList);
            }*/
            if ($scope.CareCoordinator_PatientList.length == 0) {
                $scope.CareCoordinator_PatientList = angular.copy($scope.PatientFilterCopyList);
            }
            if (($scope.SelectedFilter.match('1'))) {
                $scope.HighSelected = true;
            }
            if (($scope.SelectedFilter.match('2'))) {
                $scope.MediumSelected = true;
            }
            if (($scope.SelectedFilter.match('3'))) {
                $scope.LowSelected = true;
            }
            $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value) {
                return (value.HighCount > 0 && $scope.HighSelected == true) ||
                    (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                    (value.LowCount > 0 && $scope.LowSelected == true);

                /*return ((value.HighCount > 0 && $scope.HighSelected == true) || (value.HighCount == 0 && ($scope.MediumSelected == true || $scope.LowSelected == true)) ||
                ($scope.HighSelected == false && ($scope.MediumSelected == true || $scope.LowSelected == true))) &&
                ((value.MediumCount > 0 && $scope.MediumSelected == true) || (value.MediumCount == 0 && ($scope.HighSelected == true || $scope.LowSelected == true)) ||
                ($scope.MediumSelected == false && ($scope.HighSelected == true || $scope.LowSelected == true))) &&
                ((value.LowCount > 0 && $scope.LowSelected == true) || (value.LowCount == 0 && ($scope.HighSelected == true || $scope.MediumSelected == true)) ||
                ($scope.LowSelected == false && ($scope.HighSelected == true || $scope.MediumSelected == true)))
                ;*/
            });
            $scope.PatientCount = $scope.rowCollectionFilter.length;
            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
            for (var i = 0; i < total; i++) {
                var obj = {
                    PageNumber: i + 1
                }
                $scope.PageCountArray.push(obj);
            }
            $scope.CareCoordinator_PatientList = $scope.rowCollectionFilter;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            $scope.rowCollectionFilter = $ff($scope.rowCollectionFilter, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }
        $scope.DiagosticAlert_PatientData = function (eventId) {
            //Diagostic Alert
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/5";
        }
        $scope.ComplianceAlert_PatientData = function (eventId) {
            //Compliance Alert
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/6";
        }
    }
]);