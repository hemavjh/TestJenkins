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
        $scope.usertoken = $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='];

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
            setTimeout(function () {
                $("#Filter_GenderId").val('0').trigger('change');
                $("#filter_NationalityId").val('0').trigger('change');
                $("#filter_EthinicGroupId").val('0').trigger('change');
                $("#filter_MaritalStatus").val('0').trigger('change');
                $("#filter_BloodGroupId").val('0').trigger('change');
                $("#filter_CountryId").val('0').trigger('change');
                $("#filter_StataId").val('0').trigger('change');
                $("#filter_CityId").val('0').trigger('change');
                $("#filter_GroupId").val('').trigger('change');
            });
            $scope.PatientApprovalList();
        }

        $scope.PatientApprovalDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $scope.LoadGenderList();
                $scope.LoadGroupTypeList();
                $scope.LoadNationalityList();
                $scope.LoadMaritalStatusList();
                $scope.LoadEthnicGroupList();
                $scope.LoadBloodGroupList();
                $scope.LoadCountryList();
                $scope.LoadStateList();
                $scope.LoadCityList();

                //$http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                //    $scope.BloodGroupList = data;
                //});
                //$http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                //    $scope.MaritalStatusList = data;
                //});
                //$http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                //    $scope.GroupTypeList = data;
                //});
                //$http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                //    $scope.GenderList = data;
                //});
                //$http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                //    $scope.NationalityList = data;
                //});
                //$http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                //    $scope.EthnicGroupList = data;
                //});
                //$scope.CountryStateList();
            }
        };

        $scope.LoadGenderList = function () {
            if ($scope.GenderList.length === 0) {
                URL = baseUrl + '/api/Common/CloneGenderList/';
                $('#Filter_GenderId').select2({
                    placeholder: "Select",
                    ajax: {
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                        },
                        dataType: "json",
                        url: URL,
                        data: function (params) {
                            return {
                                q: params.term, // search term
                            };
                        },
                        processResults: function (data) {
                            var results = [];
                            $.each(data, function (index, gender) {
                                results.push({
                                    id: gender.Id,
                                    text: gender.Gender_Name
                                });
                            });
                            return {
                                results: results
                            };
                        },
                        cache: true
                    },
                    width: '100%'
                });
            }
        };

        $scope.LoadGroupTypeList = function () {
            URL = baseUrl + '/api/Common/CloneGroupTypeList/';
            $('#filter_GroupId').select2({
                placeholder: "Select",
                selectAll: true,
                ajax: {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                    },
                    dataType: "json",
                    url: URL,
                    data: function (params) {
                        return {
                            q: params.term, // search term
                            Institution_Id: $scope.InstitutionId
                        };
                    },
                    processResults: function (data) {
                        var results = [];
                        $scope.GroupTypeList = [];
                        $.each(data, function (index, group_type) {
                            results.push({
                                id: group_type.Id,
                                text: group_type.GROUP_NAME
                            });
                        });
                        $scope.GroupTypeList = results;
                        return {
                            results: results
                        };
                    },
                    cache: true
                },
                width: '100%'
            });
        };

        $scope.LoadNationalityList = function () {
            if ($scope.NationalityList.length === 0) {
                URL = baseUrl + '/api/Common/CloneNationalityList/';
                $('#filter_NationalityId').select2({
                    placeholder: "Select",
                    ajax: {
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                        },
                        dataType: "json",
                        url: URL,
                        data: function (params) {
                            return {
                                q: params.term, // search term
                            };
                        },
                        processResults: function (data) {
                            var results = [];
                            $.each(data, function (index, nationality) {
                                results.push({
                                    id: nationality.Id,
                                    text: nationality.Name
                                });
                            });
                            return {
                                results: results
                            };
                        },
                        cache: true
                    },
                    width: '100%'
                });
            }
        };

        $scope.LoadMaritalStatusList = function () {
            if ($scope.MaritalStatusList.length === 0) {
                URL = baseUrl + '/api/Common/CloneMaritalStatusList/';
                $('#filter_MaritalStatus').select2({
                    placeholder: "Select",
                    ajax: {
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                        },
                        dataType: "json",
                        url: URL,
                        data: function (params) {
                            return {
                                q: params.term, // search term
                            };
                        },
                        processResults: function (data) {
                            $scope.MaritalStatusListTemp = [];
                            $scope.MaritalStatusListTemp = data;
                            var results = [];
                            $.each(data, function (index, marg_status) {
                                results.push({
                                    id: marg_status.Id,
                                    text: marg_status.Name
                                });
                            });
                            return {
                                results: results
                            };
                        },
                        cache: true
                    },
                    width: '100%'
                });
            }
        };

        $scope.LoadEthnicGroupList = function () {
            if ($scope.EthnicGroupList.length === 0) {
                URL = baseUrl + '/api/Common/CloneEthnicGroupList/';
                $('#filter_EthinicGroupId').select2({
                    placeholder: "Select",
                    ajax: {
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                        },
                        dataType: "json",
                        url: URL,
                        data: function (params) {
                            return {
                                q: params.term, // search term
                            };
                        },
                        processResults: function (data) {
                            $scope.EthnicGroupListTemp = [];
                            $scope.EthnicGroupListTemp = data;
                            var results = [];
                            $.each(data, function (index, ethnic_group) {
                                results.push({
                                    id: ethnic_group.Id,
                                    text: ethnic_group.Name
                                });
                            });
                            return {
                                results: results
                            };
                        },
                        cache: true
                    },
                    width: '100%'
                });
            }
        };

        $scope.LoadBloodGroupList = function () {
            if ($scope.BloodGroupList.length === 0) {
                URL = baseUrl + '/api/Common/CloneBloodGroupList/';
                $('#filter_BloodGroupId').select2({
                    placeholder: "Select",
                    ajax: {
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                        },
                        dataType: "json",
                        url: URL,
                        data: function (params) {
                            return {
                                q: params.term, // search term
                            };
                        },
                        processResults: function (data) {
                            $scope.BloodGroupListTemp = [];
                            $scope.BloodGroupListTemp = data;
                            var results = [];
                            $.each(data, function (index, blood_group) {
                                results.push({
                                    id: blood_group.Id,
                                    text: blood_group.BloodGroup_Name
                                });
                            });
                            return {
                                results: results
                            };
                        },
                        cache: true
                    },
                    width: '100%'
                });
            }
        };

        $scope.LoadCountryList = function () {
            URL = baseUrl + '/api/Common/CloneCountryList/';
            $('#filter_CountryId').select2({
                placeholder: "Select",
                ajax: {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                    },
                    dataType: "json",
                    url: URL,
                    data: function (params) {
                        return {
                            q: params.term, // search term
                        };
                    },
                    processResults: function (data) {
                        var results = [];
                        $.each(data, function (index, country) {
                            results.push({
                                id: country.Id,
                                text: country.CountryName
                            });
                        });
                        return {
                            results: results
                        };
                    },
                    cache: true
                },
                width: '100%'
            });
        };

        $scope.LoadStateList = function () {
            URL = baseUrl + '/api/Common/Clone_Get_StateList/';
            $('#filter_StataId').select2({
                placeholder: "Select",
                ajax: {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                    },
                    dataType: "json",
                    url: URL,
                    data: function (params) {
                        return {
                            q: params.term, // search term,
                            CountryId: $scope.filter_CountryId
                        };
                    },
                    processResults: function (data) {
                        var results = [];
                        $.each(data, function (index, state) {
                            results.push({
                                id: state.Id,
                                text: state.StateName
                            });
                        });
                        return {
                            results: results
                        };
                    },
                    cache: true
                },
                width: '100%'
            });
        };

        $scope.LoadCityList = function () {
            URL = baseUrl + '/api/Common/Clone_Get_LocationList/';
            $('#filter_CityId').select2({
                placeholder: "Select",
                ajax: {
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + $scope.usertoken);
                    },
                    dataType: "json",
                    url: URL,
                    data: function (params) {
                        return {
                            q: params.term, // search term,
                            CountryId: $scope.filter_CountryId,
                            StateId: $scope.filter_StataId
                        };
                    },
                    processResults: function (data) {
                        var results = [];
                        $.each(data, function (index, city) {
                            results.push({
                                id: city.Id,
                                text: city.LocationName
                            });
                        });
                        
                        return {
                            results: results
                        };
                    },
                    cache: true
                },
                width: '100%'
            });
        };

        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        //$scope.CountryStateList = function () {
        //    $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
        //        $scope.CountryNameList = data;
        //    });
        //}
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
            //if ($scope.loadCount == 0) {
            //    $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.filter_CountryId).success(function (data) {
            //        $scope.StateNameList = data;
            //        $scope.CityNameList = [];
            //        $scope.filter_CityId = "0";
            //    });
            //}
            $scope.LoadStateList($scope.filter_CountryId);
        }
        $scope.Filter_State_onChange = function () {
            //if ($scope.loadCount == 0) {
            //    $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.filter_CountryId + '&StateId=' + $scope.filter_StataId).success(function (data) {
            //        $scope.CityNameList = data;
            //    });
            //}
            $scope.LoadCityList($scope.filter_CountryId, $scope.filter_StataId);
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
                ).then(function (response) {

                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.rowCollection = response.data;
                    $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.Approvalflag = 1;
                    }
                    else {
                        $scope.Approvalflag = 0;
                    }
                    $("#chatLoaderPV").hide();
                }, function errorCallback(response) {
                    $scope.error = "AN error has occured while Listing the records!" + response.data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.Active_PatientApproval = function (PId) {
            $scope.Id = PId;
            $location.path("/PatientView/" + $scope.Id + "/0/3");
        };

        $scope.splitMobileNumber = function (string, nb) {
            if (string != null) {
                var array = string.split('~');
                var cc = array[0];
                var number;
                if (array.length > 1) {
                    number = array[1];
                }
                var mNumber = typeof (number) == "undefined" ? string : number;
                //return array[nb];
                return mNumber;
            }
        }

        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterPatientList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = $scope.searchquery
            searchstring = searchstring.toLowerCase();
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return (value.FullName.toLowerCase()).match(searchstring) ||
                        //angular.lowercase(value.MRN_NO).match(searchstring) ||
                        (value.Mobile_No.toLowerCase()).match(searchstring) ||
                        (value.EmailId.toLowerCase()).match(searchstring) ||
                        (value.PendingSince.toLowerCase()).match(searchstring);
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
                $http.get(baseUrl + '/api/PatientApproval/Get_PatientCount/?InstitutionId=' + $scope.InstitutionId).then(function (response) {
                    $scope.PatientCount = response.data[0].PatientCount;
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
                                $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).then(function (response) {
                                    //alert(data.Message);
                                    toastr.success(response.data.Message, "success");
                                    $('#btnsave').attr("disabled", false);
                                    if (response.data.ReturnFlag == 1) {
                                        $scope.PatientApprovalList();
                                        $scope.SelectedAllPatient = false;
                                    }
                                }, function errorCallback(response) {
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
                }, function errorCallback(response) {
                });
            }
        }
    }
]);