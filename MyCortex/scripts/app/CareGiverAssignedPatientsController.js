var CareGiverAssignedPatients = angular.module("CareGiverAssignedPatientsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


CareGiverAssignedPatients.controller("CareGiverAssignedPatientsController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr', 
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.caregiver_PatientList = [];
        $scope.CareGiver_PatientList2 = [];
        $scope.caregiver_searchquery = "";
        $scope.CareGiver_Id = $window.localStorage['UserId'];
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.CG_PatientNo = "";
        $scope.CG_InsuranceId = "";
        $scope.CG_GenderId = "0";
        $scope.CG_NationalityId = "0";
        $scope.CG_EthinicGroupId = "0";
        $scope.CG_MOBILE_NO = "";
        $scope.CG_HomePhoneNo = "";
        $scope.CG_Email = "";
        $scope.CG_MaritalStatus = "0";
        $scope.CG_CountryId = "0";
        $scope.CG_StateId = "0";
        $scope.CG_CityId = "0";
        $scope.CG_BloodGroupId = "0";
        $scope.CG_GroupId = "0";
        $scope.PageNumber = 1;
        $scope.TabClick = false;
        $scope.filter_CG_Assig_SearchFieldId = "0";
        $scope.ResetFilter = function () {
            $scope.CG_PatientNo = "";
            $scope.CG_InsuranceId = "";
            $scope.CG_GenderId = "0";
            $scope.CG_NationalityId = "0";
            $scope.CG_EthinicGroupId = "0";
            $scope.CG_MOBILE_NO = "";
            $scope.CG_HomePhoneNo = "";
            $scope.CG_Email = "";
            $scope.CG_MaritalStatus = "0";
            $scope.CG_CountryId = "0";
            $scope.CG_StateId = "0";
            $scope.CG_CityId = "0";
            $scope.CG_BloodGroupId = "0";
            $scope.CG_GroupId = "0";
            $scope.CareGiver_PatientListFunction(1);
        }

        $scope.CaregiverPatientsDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/BloodGroupList/').then(function (response) {
                    $scope.BloodGroupList = response.data;
                }, function errorCallback(response) {

                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').then(function (response) {
                    $scope.MaritalStatusList = response.data;
                }, function errorCallback(response) {
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).then(function (response) {
                    $scope.GroupTypeList = response.data;
                }, function errorCallback(response) {
                });
                $http.get(baseUrl + '/api/Common/GenderList/').then(function (response) {
                    $scope.GenderList = response.data;
                }, function errorCallback(response) {
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').then(function (response) {
                    $scope.NationalityList = response.data;
                }, function errorCallback(response) {
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').then(function (response) {
                    $scope.EthnicGroupList = response.data;
                }, function errorCallback(response) {

                });
                $scope.CountryStateList();
            }
        }
        $scope.loadCount = 0;
        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').then(function (response) {
                $scope.CountryNameList = response.data;

            }, function errorCallback(response) {

            });
        }
        $scope.CG_Country_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.filter_CountryId).then(function (response) {
                    $scope.StateNameList = response.data;
                    $scope.CityNameList = [];
                    $scope.filter_CityId = "0";
                }, function errorCallback(response) {

                });
            }
        };
        $scope.CG_State_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.filter_CountryId + '&StateId=' + $scope.filter_StataId).then(function (response) {
                    $scope.CityNameList = response.data;
                }, function errorCallback(response) {

                });
            }
        };
        $scope.PageCountArray = [];
        $scope.PatientFilterCopy = [];
        $scope.PatientFilterCopyList = [];
        $scope.CareGiver_PatientListFunction = function (PageNumber) {
            if ($window.localStorage['UserTypeId'] == 5) {

                $("#chatLoaderPV").show();
                $scope.PageNumber = PageNumber;
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1){
                    $scope.Patient_PerPage = data1.data[0].ConfigValue;
                    $http.get(baseUrl + '/api/CareGiver/CareGiver_AssignedPatientList/?CareGiver_Id=' + $scope.CareGiver_Id + '&PATIENTNO=' + $scope.CG_PatientNo + '&INSURANCEID=' + $scope.CG_InsuranceId + '&GENDER_ID=' + $scope.CG_GenderId + '&NATIONALITY_ID=' + $scope.CG_NationalityId + '&ETHINICGROUP_ID=' + $scope.CG_EthinicGroupId + '&MOBILE_NO=' + $scope.CG_MOBILE_NO + '&HOME_PHONENO=' + $scope.CG_HomePhoneNo + '&EMAILID=' + $scope.CG_Email + '&MARITALSTATUS_ID=' + $scope.CG_MaritalStatus + '&COUNTRY_ID=' + $scope.CG_CountryId + '&STATE_ID=' + $scope.CG_StataId + '&CITY_ID=' + $scope.CG_CityId + '&BLOODGROUP_ID=' + $scope.CG_BloodGroupId + '&Group_Id=' + $scope.CG_GroupId + '&PageNumber=' + $scope.PageNumber + '&Login_Session_Id=' + $scope.LoginSessionId
                    ).then(function (response){
                        $("#chatLoaderPV").hide();
                        $scope.emptydata = [];
                        $scope.CareGiver_PatientList = [];
                        $scope.CareGiver_PatientList = response.data;
                        $scope.CareGiver_PatientList2 = response.data;
                        $scope.PatientCount = $scope.CareGiver_PatientList.length;
                        total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                        for (var i = 0; i < total; i++) {
                            var obj = {
                                PageNumber: i + 1
                            }
                            $scope.PageCountArray.push(obj);
                        }
                        $scope.rowCollectionFilter = angular.copy($scope.CareGiver_PatientList);
                        $scope.PatientFilterCopyList = angular.copy($scope.CareGiver_PatientList);
                        $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                        $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                        //Get the records for Page Load
                        $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value, index) {
                            return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
                        });
                        if ($scope.rowCollectionFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                    }, function errorCallback(response) {

                    });
                }, function errorCallback(data1) {

                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }
        $scope.Next_CareGiver_PatientListFunction = function (PageNumber) {
            $scope.PageNumber = PageNumber;
            $scope.SelectedFilter = $scope.Filter_Selected.toString();
            //if($scope.caregiver_searchquery == "" && (($scope.SelectedFilter.match('1')) && ($scope.SelectedFilter.match('2')) && ($scope.SelectedFilter.match('3'))))
            //{
            //    $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopyList);
            //}
            //else
            //{
            //    $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopy);
            //}
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            //Get the records for Page Load
            $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }

        $scope.HighSelected = false;
        $scope.MediumSelected = false;
        $scope.LowSelected = false;
        $scope.NoAlertSelected = false;
        $scope.Filter_Selected = ["1", "2", "3", "4"];
        $scope.Coordinator_Filter = function () {
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            $scope.HighSelected = false;
            $scope.MediumSelected = false;
            $scope.LowSelected = false;
            $scope.NoAlertSelected = false;
            $scope.SelectedFilter = $scope.Filter_Selected.toString();
            /*if ((($scope.SelectedFilter.match('1')) && ($scope.SelectedFilter.match('2')) && ($scope.SelectedFilter.match('3')) && ($scope.SelectedFilter.match('4')))) {
                $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopyList);
            }
            else*/
            if ($scope.CareGiver_PatientList.length == 0) {
                $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopyList);
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
            if (($scope.SelectedFilter.match('4'))) {
                $scope.NoAlertSelected = true;
            }
            $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value) {
                return (value.HighCount > 0 && $scope.HighSelected == true) ||
                    (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                    (value.LowCount > 0 && $scope.LowSelected == true) ||
                    ($scope.NoAlertSelected == true && value.HighCount == 0 && value.MediumCount == 0 && value.LowCount == 0);

            });
        }

        $scope.CareGiver_ListFilter = function () {
            var searchstring = ($scope.caregiver_searchquery.toLowerCase());
            if (searchstring == "") {
                $scope.CareGiver_PatientListFunction(1);
            } else {
                if ($scope.filter_CG_Assig_SearchFieldId == "0") {
                    toastr.warning("Please Select Search Field", "warning");
                } else {
                    $scope.ResultListFiltered = [];
                    $scope.PageCountArray = [];
                    $scope.PageNumber = 1;
                    if ($scope.caregiver_searchquery == "") {
                        $scope.rowCollectionFilter = angular.copy($scope.CareGiver_PatientList2);
                    }
                    else {
                        //$scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value) {
                        //    return angular.lowercase(value.PatientName).match(searchstring) ||
                        //        angular.lowercase(value.MRN_NO).match(searchstring);
                        //});
                        if ($scope.filter_CG_Assig_SearchFieldId == "1") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.Patient_No != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x => (x.Patient_No.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "2") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.National_ID != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x => (x.National_ID.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "3") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.FirstName != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x =>(x.FirstName.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "4") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.LastName != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x =>(x.LastName.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "5") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.Insurance_ID != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x =>(x.Insurance_ID.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "6") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.Email != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x =>(x.Email.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "7") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.Mobile != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x =>(x.Mobile.toLowerCase()).match(searchstring));
                        } else if ($scope.filter_CG_Assig_SearchFieldId == "8") {
                            var NotNull_User = $scope.CareGiver_PatientList2.filter(x => x.MRN_NO != null);
                            $scope.rowCollectionFilter = NotNull_User.filter(x =>(x.MRN_NO.toLowerCase()).match(searchstring));
                        }
                    }
                    $scope.PatientCount = $scope.rowCollectionFilter.length;
                    total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                    for (var i = 0; i < total; i++) {
                        var obj = {
                            PageNumber: i + 1
                        }
                        $scope.PageCountArray.push(obj);
                    }
                    $scope.CareGiver_PatientList = $scope.rowCollectionFilter;
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
            }
        }
        $scope.CareGiver_AssignedPatients = function (eventId) {
            //Care Giver Assigned patients
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index/PatientVitals/" + $scope.Id + "/7";
        }
    }
]);