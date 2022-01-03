var PatientApproval = angular.module("PatientApprovalController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


PatientApproval.controller("PatientApprovalController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {

        $scope.Id = "0";
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
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Approvalflag = 0;
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.loadCount = 0;
        $scope.rowCollectionFilter = [];
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
            $scope.PatientApprovalList();
        }

        $scope.PatientApprovalDropdownList = function () {
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
        };

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
        /*   $scope.Filter_Country_onChange = function () {
               $scope.StateNameList = $ff($scope.State_Template, { CountryId: $scope.filter_CountryId });
               setTimeout(function () {
                   jQuery("#stateselectpicker").selectpicker('refresh')
               }, 500);
           };
           $scope.Filter_State_onChange = function () {
               $scope.CityNameList = $ff($scope.City_Template, { StateId: $scope.filter_StataId });
           };*/

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

        //* THIS IS FOR LIST FUNCTION */

        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.Approvalflag = 0;
        $scope.rowCollectionFilter = [];
        /*List Page Pagination*/

        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.PatientApprovalList = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/PatientApproval/PatientApproval_List/?InstitutionId=' + $scope.InstitutionId + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId
                ).success(function (data) {

                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.rowCollection = data;
                    $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.Approvalflag = 1;
                    }
                    else {
                        $scope.Approvalflag = 0;
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.Active_PatientApproval = function (PId) {
            $scope.Id = PId;
            $location.path("/PatientView/" + $scope.Id + "/0/3");
        };


        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterPatientList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.MRN_NO).match(searchstring) ||
                        angular.lowercase(value.Mobile_No).match(searchstring) ||
                        angular.lowercase(value.EmailId).match(searchstring) ||
                        angular.lowercase(value.PendingSince).match(searchstring);
                });
            }
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.Approvalflag = 1;
            }
            else {
                $scope.Approvalflag = 0;
            }
        }
        $scope.checkAll = function () {
            if ($scope.SelectedAllPatient == true) {
                $scope.SelectedAllPatient = true;
            } else {
                $scope.SelectedAllPatient = false;
            }
            angular.forEach($scope.rowCollectionFilter, function (row) {
                if (row.Approval_Flag == 0)
                    row.SelectedPatient = $scope.SelectedAllPatient;
            });
        };
        $scope.ApprovePatient = function () {
            //var cnt = ($filter('filter')($scope.rowCollectionFilter, 'true')).length;
            var cnt = $ff(($filter('filter')($scope.rowCollectionFilter, 'true')), { Approval_Flag: 0 }).length;
            $('#btnsave').attr("disabled", true);
            if (cnt == 0) {
                //alert("Please select atleast one Patient to Approve");
                toastr.warning("Please select atleast one Patient to Approve", "warning");
                $('#btnsave').attr("disabled", false);
            }
            else {
                $http.get(baseUrl + '/api/PatientApproval/Get_PatientCount/?InstitutionId=' + $scope.InstitutionId).success(function (data) {
                    $scope.PatientCount = data[0].PatientCount;
                    if ($scope.PatientCount >= cnt) {
                        Swal.fire({
                            title: 'Do you like to Approve the Selected Patient?',
                            html: '',
                            showDenyButton: true,
                            showCancelButton: false,
                            confirmButtonText: 'Yes',
                            denyButtonText: 'No',
                            showCloseButton: true,
                            allowOutsideClick: false,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                $scope.ApprovedPatientList = [];
                                angular.forEach($scope.rowCollectionFilter, function (SelectedPatient, index) {
                                    if (SelectedPatient.SelectedPatient == true) {
                                        if (SelectedPatient.Approval_Flag == 0) {
                                            var ApprovePatientobj = {
                                                Patient_Id: SelectedPatient.Id
                                            };
                                            $scope.ApprovedPatientList.push(ApprovePatientobj);
                                        }
                                    }
                                });
                                $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).success(function (data) {
                                    //alert(data.Message);
                                    toastr.success(data.Message, "success");
                                    $('#btnsave').attr("disabled", false);
                                    if (data.ReturnFlag == 1) {
                                        $scope.PatientApprovalList();
                                        $scope.SelectedAllPatient = false;
                                    }
                                });
                                   
                            } else if (result.isDenied) {
                                //Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                        //var msg = confirm("Do you like to Approve the Selected Patient?");
                       /* if (msg == true) {
                            $scope.ApprovedPatientList = [];
                            angular.forEach($scope.rowCollectionFilter, function (SelectedPatient, index) {
                                if (SelectedPatient.SelectedPatient == true) {
                                    if (SelectedPatient.Approval_Flag == 0) {
                                        var ApprovePatientobj = {
                                            Patient_Id: SelectedPatient.Id
                                        };
                                        $scope.ApprovedPatientList.push(ApprovePatientobj);
                                    }
                                }
                            });
                            $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).success(function (data) {
                                //alert(data.Message);
                                toastr.success(data.Message, "success");
                                $('#btnsave').attr("disabled", false);
                                if (data.ReturnFlag == 1) {
                                    $scope.PatientApprovalList();
                                    $scope.SelectedAllPatient = false;
                                }
                            });
                        }*/
                    }
                    else {
                        //alert("Maximum Number of Patient License reached already, cannot be approved");
                        toastr.info("Maximum Number of Patient License reached already, cannot be approved", "info");
                        $('#btnsave').attr("disabled", false);
                        return false;
                    }
                });
            }
        }
    }

]);
