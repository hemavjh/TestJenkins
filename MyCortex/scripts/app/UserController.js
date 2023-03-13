var Usercontroller = angular.module("UserController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

//Usercontroller.service('InstSub', ['$log', function ($log) {
//    this.myService = 0;
//    this.SubscriptionInstiID = 0;
//    return {
//        getInstiID: function () {
//            return this.myService;
//        },
//        setInstiID: function (data) {
//            this.myService = data;
//        },
//        getSubID: function () {
//            return this.SubscriptionInstiID;
//        },
//        setSubID: function (data) {
//            this.SubscriptionInstiID = data;
//        }
//    };
//}]);

Usercontroller.controller("UserController", ['$scope', '$q', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', '$rootScope', 'InstSub', 'toastr',
    function ($scope, $q, $http, $filter, $routeParams, $location, $window, $ff, $rootScope, InstSub, toastr) {
        //$scope.alertConfrimationVisible = false;
        //$scope.alertType = "alert-danger";
        //$scope.alertConfrimationMessage = "Do you like to deactivate the selected User?";
        //$scope.btn1Type = "btn-success";
        //$scope.btn2Type = "btn-danger";
        //$scope.btn1Text = "Ok";
        //$scope.btn2Text = "Cancel";
        //$scope.alertbtn1Show = true;
        //$scope.alertbtn2Show = true;

        //$scope.isPatientSignUp = "";
        //$scope.InsModule_List = $rootScope.InsModuleList;
        //if ($rootScope.InsModuleList != undefined) {
        //    if ($rootScope.InsModuleList.length > 0) {
        //        $scope.isPatientSignUp = $filter('filter')($rootScope.InsModuleList, { Module_Id: '24' })[0];
        //    }
        //}
        $scope.LoginLogo = function () {
            $http.get(baseUrl + '/Home/LoginLogoDetails/').then(function (resImage) {
                document.getElementById.toString("patient_ins").src = resImage.data[0];
            });
        }
        $scope.PageStart = 1;
        $scope.PageEnd = 20;
        $scope.SearchMsg = "No Data Available";
        $scope.AdminFlowdata = InstSub.getSubID();
        $scope.currentTab = "1";
        $scope.CountryFlag = false;
        $scope.StateFlag = false;
        $scope.CityFlag = false;
        $scope.CountryDuplicateId = "0";
        $scope.StateDuplicateId = "0";
        $scope.LocationDuplicateId = "0";
        $scope.Id = "0";
        $scope.rowId = "0"
        $scope.UserType = "0";
        $scope.InstitutionId = "0";
        $scope.FirstName = "";
        $scope.MiddleName = "";
        $scope.LastName = "";
        $scope.Employee_No = "";
        $scope.editcertificate = "";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.MobileNo_CC = ""; 
        $scope.DepartmentId = "0";
        $scope.UserTypeId = "0";
        $scope.GenderId = "0";
        $scope.Patient_Search = 0;
        $scope.Health_License = "";
        $scope.Title_Id = 0;
        $scope.NationalityId = "0";
        $scope.DOB = "";
        $scope.ExpiryDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        //$scope.DOB = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.Address1 = "";
        $scope.Address2 = "";
        $scope.Address3 = "";
        $scope.PostalZipCode = "";
        $scope.EMR_Avalability = "";
        $scope.EthnicGroupId = "0";
        $scope.CountryId = "0";
        $scope.StateId = "0";
        $scope.CityId = "0";
        $scope.MaritalStatusId = "0";
        $scope.BloodGroupId = "0";
        $scope.Smoker = "0";
        $scope.Diabetic = "0";
        $scope.HyperTension = "0";
        $scope.Cholestrol = "0";
        $scope.CurrentMedicineflag = "0";
        $scope.PastMedicineflag = "0";
        $scope.MedicalHistoryflag = "0";
        $scope.MNR_No = "";
        $scope.FullNameFormula = "";
        $scope.PrefixMRN = "";
        $scope.PatientNo = "";
        $scope.Createdby_ShortName = "";
        $scope.NationalId = "";
        $scope.UID = "";
        $scope.InsuranceId = "";
        $scope.EMERG_CONT_FIRSTNAME = "";
        $scope.EMERG_CONT_MIDDLENAME = "";
        $scope.EMERG_CONT_LASTNAME = "";
        $scope.CAFFEINATEDBEVERAGES_TEXT = "";
        $scope.ALCOHALSUBSTANCE_TEXT = "";
        $scope.SMOKESUBSTANCE_TEXT = "";
        $scope.ALERGYSUBSTANCE_TEXT = "";
        $scope.EXCERCISE_TEXT = "";
        $scope.MaritalStatusId = "0";
        $scope.BloodGroupId = "0";
        $scope.EMERG_CONT_RELATIONSHIP_ID = "0";
        $scope.DIETDESCRIBE_ID = "0";
        $scope.EXCERCISE_SCHEDULEID = "0";
        $scope.ALERGYSUBSTANCE_ID = "0";
        $scope.SMOKESUBSTANCE_ID = "0";
        $scope.ALCOHALSUBSTANCE_ID = "0";
        $scope.CAFFEINATED_BEVERAGESID = "0";
        $scope.InstitutionList = [];
        $scope.DepartmentList = [];
        $scope.UserDetailsList = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.searchquery = "";
        $scope.UserTypeList = [];
        $scope.GroupTypeList = [];
        $scope.IsActive = true;
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.MaritalStatusList = [];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.RelationshipList = [];
        $scope.DietTypeList = [];
        $scope.CountryList = [];
        $scope.StateList = [];
        $scope.LocationList = [];
        $scope.Nationalityresumedoc = [];
        $scope.UIDshow = [];
        $scope.SelectedInstitution = "0";
        $scope.UserGroupDetails_List = [];
        $scope.UserInstitutionDetails_List = [];
        $scope.UserLanguageDetails_List = [];
        $scope.SelectedLanuage = [];
        $scope.Patientsearchquery = "";
        $scope.UserDetailsList = [];
        $scope.rowCollectionFilter = [];
        $scope.MedicineRow = "-1";
        $scope.MedicalHistoryRow = "-1";
        $scope.HealthProblemRow = "-1";
        $scope.BusinessUserList = [];
        $scope.BusinessUserFilter = [];
        $scope.BusinessUserflag = 0;
        $scope.Filter_PatientNo2 = "";
        $scope.filter_NationalityId2 = "";
        $scope.Filter_FirstName2 = "";
        $scope.Filter_LastName2 = "";
        $scope.filter_InsuranceId2 = "";
        $scope.filter_Email2 = "";
        $scope.filter_MOBILE_NO2 = "";
        $scope.Filter_MRN2 = "";
        $scope.filter_SearchFieldId = "0";
        $scope.Filter_PatientNo = "";
        $scope.Filter_FirstName = "";
        $scope.Filter_LastName = "";
        $scope.Filter_MRN = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.FileType = "";
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
        $scope.searchquery = "";
        $scope.SearchEncryptedQuery = "";
        $scope.Business_Usersearchquery = "";
        $scope.PatientList = [];
        $scope.PatientListFilter = [];
        $scope.Patientemptydata = [];
        $scope.Patientflag = 0;
        $scope.Patientsearchquery = "";
        $scope.PatientChronicCondition_List = [];
        $scope.ChildId = "0";
        $scope.HealthProblem_Id = "0";
        $scope.Medical_History_Id = "0";
        $scope.VACCINATIONS = "2";
        $scope.CURRENTLY_TAKEMEDICINE = "2";
        $scope.PAST_MEDICALHISTORY = "2";
        $scope.FAMILYHEALTH_PROBLEMHISTORY = "2";
        $scope.MenuTypeId = 0;
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.Pat_UserTypeId = $window.localStorage['UserTypeId'];
        $scope.filter_CL_SearchFieldId = "0";
        $scope.filter_CL_UserType = "0";
        $scope.filter_CL_Group = "";
        $scope.Filter_CL_Nationality = "0";
        $scope.filter_SASearchFieldId = "0";
        $scope.InsCountryId = "0";
        $scope.InsStateId = "0";
        $scope.InsCityId = "0";
        $scope.InsCountryName = "";
        $scope.InsStateName = "";
        $scope.InsCityName = "";
        $scope.PhotoValue = 0;
        $scope.PhotoValue1 = 0;
        $scope.PhotoValue2 = 0;
        $scope.UserPhotoValue = 0;
        $scope.Patient_Type = "1";
        $scope.Emergency_MobileNo = "";
        $scope.CertificateValue = 0;
        var photoview = false;
        var photoview1 = false;
        var photoview3 = false;
        var photoview2 = false;
        $scope.uploadview = false;
        $scope.Nationaluploadview = false;
        $scope.UIDuploadview = false;
        $scope.Insuranceuploadview = false;
        $scope.uploadme = null;
        $scope.NationalUploadme = [];
        $scope.UIDLogo = [];
        $scope.UIDUploadme = [];
        $scope.uploadme1 = null;
        $scope.uploadme3 = null;
        $scope.uploadme2 = null;
        $scope.DropDownListValue = 2;
        $scope.EditParameter = $routeParams.Editpatient;
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.total_pages = 1;
        $scope.Chronic = [];
        $scope.Chronic_Details = [];
        $scope.Chronic_Name = "";
        $scope.Member_ID = "";
        $scope.Policy_Number = "";
        $scope.Reference_ID = "";

        //$scope.Expiry_Date = "";
        $scope.SelectedPayor = "0";
        $scope.SelectedPlan = "0";
        $scope.EditPayorId = [];
        $scope.EditPlanId = [];
        $scope.DoctorInstitutionList = [];
        $scope.LanguageList = [];
        $scope.UserGroupDetails_List = [];
        $scope.GroupTypeList = [];
        $scope.UserInstitutionDetails_List = [];
        $scope.UserLanguageDetails_List = [];
        $scope.PatientChronicCondition_List = [];
        $scope.ChronicConditionList = [];
        $scope.AddMedicines = [];
        $scope.AddMedicalHistory = [];
        $scope.AddHealthProblem = [];
        $scope.DoctorInstitutionList = [];
        $scope.emiratesID = "";
        $scope.createby = "";
        $scope.orderon = "";
        $scope.eligibilityDate = "";
        $scope.cardno = "";
        $scope.package = "";
        $scope.clinician = "";
        $scope.speciality = "";
        $scope.ServiceCategory = "0";
        $scope.ConsultationCategory = "0";
        $scope.Clinicianlist = "0";
        $http.get(baseUrl + '/api/User/InsuranceServiceCategory/').then(function (response) {
            $scope.ServiceCategoryList = response.data;
        });
        $http.get(baseUrl + '/api/User/InsuranceConsultationCategory/').then(function (response) {
            $scope.ConsultationCategoryList = response.data;
        });
        $scope.serviceCategory = "";
        $scope.usertoken = $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='];

        //$scope.maxdateDOB = '';
        // get minimum age from configuration set max date in DOB
        $scope.ConfigCode = "PATIENT_MIN_AGE";
        $scope.Today_Date = $filter('date')(new Date(), 'dd-MMM-yyyy');
        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).
            then(function (response) {
                if (response.data[0] != undefined) {
                    $scope.PatientMinAge = parseInt(response.data[0].ConfigValue);
                    $scope.maxdateDOB = moment().subtract($scope.PatientMinAge, 'years').format("YYYY-MM-DD");
                    var MDOB = $scope.maxdateDOB;
                    angular.element(document.getElementById('maxdateDOB')).val(MDOB);
                    angular.element('#Date_Birth').attr('max', $scope.maxdateDOB);
                }
            });


        $http.get(baseUrl + '/api/Login/GetProduct_Details/').then(function (response) {           

            $scope.ProductName = response.data[0].ProductName;
            if ($scope.ProductName == 'MyCortex') {               
                $scope.Id1 = 'Identification Number 1';
                $scope.Id2 = 'Identification Number 2';
                $scope.Id3 = 'Identification Number 3';
                $scope.mandatory = '';
            } else if ($scope.ProductName == 'MyHealth') {               
                $scope.Id1 = 'Emirates Id';
                $scope.Id2 = 'UID';
                $scope.Id3 = 'Insurance ID';
                $scope.mandatory = '<sup><font class="mandatory-field">*</font></sup>';
            } else {                
                $scope.Id1 = 'Identification Number 1';
                $scope.Id2 = 'Identification Number 2';
                $scope.Id3 = 'Identification Number 3';
                $scope.mandatory = '';
            }
        });

        function changeGender() {
            $scope.PatientgetBase64Image();
        }

       //if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 2) {
        $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionDetailList/?Id=' + $scope.SelectedInstitutionId).then(function (response) {

            //this is for country code display based on settings
                //var InitialCountry = "auto";
                //if (data != null) {
                //    if (data.CountryName == null || data.CountryName == undefined) {
                //        $scope.CountryISO2 = "";
                //        InitialCountry = "auto";
                //    } else {
                //        $scope.CountryISO2 = data.CountryISO2;
                //        InitialCountry = $scope.CountryISO2;
                //    }
                //}

                //var input = document.querySelector("#txtMobile");
                //var inputPhoneNo = window.intlTelInput(input, {
                //    formatOnDisplay: true,
                //    separateDialCode: true,
                //    initialCountry: InitialCountry,

                //    geoIpLookup: function (callback) {
                //        $.get("http://ipinfo.io", function () { }, "jsonp").always(function (resp) {
                //            var countryCode = (resp && resp.country) ? resp.country : "";
                //            callback(countryCode);
                //        });
                //    },
                //    //preferredCountries: ["in"],
                //    utilsScript: "scripts/utils.js",
                //});

        }, function errorCallback(response) {
            $scope.error = "AN error has occured while Listing the records!" + response.data;
            });
        //} else {
        //    var view_name = $location.$$path.split('/')[1];
        //    if (view_name != "PatientView") {
        //        var input = document.querySelector("#txtMobile");
        //        var inputPhoneNo = window.intlTelInput(input, {
        //            formatOnDisplay: true,
        //            separateDialCode: true,
        //            //initialCountry: InitialCountry,

        //            geoIpLookup: function (callback) {
        //                $.get("http://ipinfo.io", function () { }, "jsonp").always(function (resp) {
        //                    var countryCode = (resp && resp.country) ? resp.country : "";
        //                    callback(countryCode);
        //                });
        //            },
        //            //preferredCountries: ["in"],
        //            utilsScript: "scripts/utils.js",
        //        });
        //    }
        //}

        $scope.EditgroupOption = 0;
        if ($window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 5 || $window.localStorage['UserTypeId'] == 6) {
            $scope.EditgroupOption = 1;
        }

        $scope.loadCount = 3;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.LoginType = $routeParams.LoginUserType;

        $scope.ClearGroup = function () {
            $scope.SelectedGroup = "0";
        }

        $scope.LoadGenderList = function () {
            if ($scope.GenderList.length === 0) {
                //$http.get(baseUrl + '/api/Common/GenderList/').success(function (resp_gender_data) {
                //    $scope.GenderList = resp_gender_data;
                //});
                URL = baseUrl + '/api/Common/CloneGenderList/';
                $('#GenderId').select2({
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
                            $scope.GenderList = results;
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

        $scope.LoadChronicConditionList = function () {
            if ($scope.ChronicConditionList.length === 0) {
                //$http.get(baseUrl + '/api/Common/ChronicConditionList/').success(function (resp_cc_data) {
                //    $scope.ChronicConditionList = resp_cc_data;
                //});
                URL = baseUrl + '/api/Common/CloneChronicConditionList/';
                $('#SelectedChronicCondition').select2({
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
                            };
                        },
                        processResults: function (data) {
                            var results = [];
                            $.each(data, function (index, chronic_condition) {
                                results.push({
                                    id: chronic_condition.Id,
                                    text: chronic_condition.Name
                                });
                            });
                            $scope.ChronicConditionList = results;
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
            $('#SelectedGroup').select2({
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
                            Institution_Id: $scope.InstituteId
                        };
                    },
                    processResults: function (data) {
                        var results = [];
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

        $scope.LoadDepartmentList = function () {
            if ($scope.DepartmentList.length == 0) {
                URL = baseUrl + '/api/User/CloneDepartmentList/';
                $('#DepartmentId').select2({
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
                            };
                        },
                        processResults: function (data) {
                            var results = [];
                            $.each(data, function (index, department) {
                                results.push({
                                    id: department.Id,
                                    text: department.Department_Name
                                });
                            });
                            $scope.DepartmentList = results;
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

        $scope.LoadBusinessUser_UserTypeList = function () {
            if ($scope.UserTypeList.length === 0) {
                URL = baseUrl + '/api/user/Clone_BusinessUser_UserTypeList/';
                $('#UserTypeId').select2({
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
                            };
                        },
                        processResults: function (data) {
                            var results = [];
                            $.each(data, function (index, user_type) {
                                results.push({
                                    id: user_type.Id,
                                    text: user_type.UserName
                                });
                            });
                            $scope.UserTypeList = results;
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

        $scope.LoadFilterBusinessUser_UserTypeList = function () {
            URL = baseUrl + '/api/user/Clone_BusinessUser_UserTypeList/';
            $('#filter_CL_UserType').select2({
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
                        };
                    },
                    processResults: function (data) {
                        var results = [];
                        $.each(data, function (index, user_type) {
                            results.push({
                                id: user_type.Id,
                                text: user_type.UserName
                            });
                        });
                        $scope.UserTypeList = results;
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
                $('#NationalityId').select2({
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

        $scope.LoadFilterCLNationalityList = function () {
            URL = baseUrl + '/api/Common/CloneNationalityList/';
            $('#Filter_CL_Nationality').select2({
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
        };

        $scope.LoadFilterNationalityList = function () {
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
        };

        $scope.LoadMaritalStatusList = function () {
            if ($scope.MaritalStatusList.length === 0) {
                URL = baseUrl + '/api/Common/CloneMaritalStatusList/';
                $('#MaritalStatusId').select2({
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
                $('#EthnicGroupId').select2({
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
                $('#BloodGroupId').select2({
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

        $scope.LoadRelationshipList = function () {
            if ($scope.RelationshipList.length === 0) {
                URL = baseUrl + '/api/Common/CloneRelationshipList/';
                $('#EMERG_CONT_RELATIONSHIP_ID').select2({
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
                            $.each(data, function (index, relations_ship) {
                                results.push({
                                    id: relations_ship.Id,
                                    text: relations_ship.Name
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
            $('#CountryId').select2({
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

        $scope.LoadStateList = function (countryId) {
            URL = baseUrl + '/api/Common/Clone_Get_StateList/';
            $('#StateId').select2({
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
                            CountryId: countryId
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

        $scope.LoadCityList = function (countryId, stateId) {
            URL = baseUrl + '/api/Common/Clone_Get_LocationList/';
            $('#CityId').select2({
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
                            CountryId: countryId,
                            StateId: stateId
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

        $scope.LoadDietTypeList = function () {
            if ($scope.DietTypeList.length === 0) {
                $http.get(baseUrl + '/api/Common/DietTypeList/').then(function (resp_diet_data) {
                    $scope.DietTypeList = resp_diet_data.data;
                });
            }
        };

        $scope.DropDownListValues = function () {
            $http.get(baseUrl + '/api/Common/ChronicConditionList/').then(function (resp_cc_data) {
                $scope.ChronicConditionList = resp_cc_data.data;
            });
            $http.get(baseUrl + '/api/Common/GenderList/').then(function (resp_gender_data) {
                $scope.GenderList = resp_gender_data.data;
            });
            $http.get(baseUrl + '/api/User/DepartmentList/').then(function (resp_department_data) {
                $scope.DepartmentList = resp_department_data.data;
            });
            $http.get(baseUrl + '/api/User/BusinessUser_UserTypeList/').then(function (resp_bu_data) {
                $scope.UserTypeList = resp_bu_data.data;
            });
            $http.get(baseUrl + '/api/Common/NationalityList/').then(function (resp_nationality_data) {
                $scope.NationalityList = resp_nationality_data.data;
            });
            $http.get(baseUrl + '/api/Common/MaritalStatusList/').then(function (resp_marg_data) {
                $scope.MaritalStatusListTemp = [];
                $scope.MaritalStatusListTemp = resp_marg_data.data;
                $scope.MaritalStatusList = angular.copy($scope.MaritalStatusListTemp);
            });
            $http.get(baseUrl + '/api/Common/EthnicGroupList/').then(function (resp_eg_data) {
                $scope.EthnicGroupListTemp = [];
                $scope.EthnicGroupListTemp = resp_eg_data.data;
                $scope.EthnicGroupList = angular.copy($scope.EthnicGroupListTemp);
                //validation checking for ethnic group
                //$scope.PatientEthnicChange();
            });
            $http.get(baseUrl + '/api/Common/BloodGroupList/').then(function (resp_bg_data) {
                $scope.BloodGroupListTemp = [];
                $scope.BloodGroupListTemp = resp_bg_data.data;
                $scope.BloodGroupList = angular.copy($scope.BloodGroupListTemp);
            });
            $http.get(baseUrl + '/api/Common/RelationshipList/').then(function (resp_relationship_data) {
                $scope.RelationshipList = resp_relationship_data.data;
            });
            $http.get(baseUrl + '/api/Common/DietTypeList/').then(function (resp_diet_data) {
                $scope.DietTypeList = resp_diet_data.data;
            });
            //$scope.NationalityList2 = [];
            //$scope.UserTypeList2 = [];
            //$http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
            //    $scope.NationalityList2 = data;
            //});
            //$http.get(baseUrl + '/api/User/BusinessUser_UserTypeList/').success(function (data) {
            //    $scope.UserTypeList2 = data;
            //});
        }

        //$scope.genderChange = function () {
        //    var genderId = document.getElementById('Select3').value;
        //    if (genderId != "0") {
        //        $('#divGender').removeClass("ng-invalid");
        //        $('#divGender').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divGender').removeClass("ng-valid");
        //        $('#divGender').addClass("ng-invalid");
        //    }
        //}

        //$scope.departmentChange = function () {
        //    var deptId = document.getElementById('Select1').value;
        //    if (deptId != "0") {
        //        $('#divDepartment').removeClass("ng-invalid");
        //        $('#divDepartment').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divDepartment').removeClass("ng-valid");
        //        $('#divDepartment').addClass("ng-invalid");
        //    }
        //}

        //$scope.UserTypeChange = function () {
        //    var userType = document.getElementById('Select2').value;
        //    if (userType != "0") {
        //        $('#divUserType').removeClass("ng-invalid");
        //        $('#divUserType').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divUserType').removeClass("ng-valid");
        //        $('#divUserType').addClass("ng-invalid");
        //    }
        //}

        //$scope.nationalityChange = function () {
        //    var nationality = document.getElementById('Select5').value;
        //    if (nationality != "0") {
        //        $('#divNationality').removeClass("ng-invalid");
        //        $('#divNationality').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divNationality').removeClass("ng-valid");
        //        $('#divNationality').addClass("ng-invalid");
        //    }
        //}

        //$scope.countryChange = function () {
        //    var country = document.getElementById('countryselectpicker').value;
        //    if (country != "0") {
        //        $('#divCountry').removeClass("ng-invalid");
        //        $('#divCountry').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divCountry').removeClass("ng-valid");
        //        $('#divCountry').addClass("ng-invalid");
        //    }
        //}

        //$scope.cityChange = function () {
        //    var city = document.getElementById('SelectCity').value;
        //    if (city != "0") {
        //        $('#divCity').removeClass("ng-invalid");
        //        $('#divCity').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divCity').removeClass("ng-valid");
        //        $('#divCity').addClass("ng-invalid");
        //    }
        //}

        //$scope.stateChange = function () {
        //    var state = document.getElementById('stateselectpicker').value;
        //    if (state != "0") {
        //        $('#divState').removeClass("ng-invalid");
        //        $('#divState').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divState').removeClass("ng-valid");
        //        $('#divState').addClass("ng-invalid");
        //    }
        //}
        //$scope.dobChange = function () {
        //    if ($scope.DOB != "") {
        //        $('#divDOB').removeClass("ng-invalid");
        //        $('#divDOB').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divDOB').removeClass("ng-valid");
        //        $('#divDOB').addClass("ng-invalid");
        //    }
        //}
        $scope.TabClick = false;

        $scope.checkTab = function () {
            if ($scope.FirstName == undefined) { $scope.FirstName = ""; }
            if ($scope.LastName == undefined) { $scope.LastName = ""; }
            if ($scope.Employee_No == undefined) { $scope.Employee_No = ""; }
            if ($scope.EmailId == undefined) { $scope.EmailId = ""; }
            if ($scope.MobileNo == undefined) { $scope.MobileNo = ""; }
            if ($scope.Health_License == undefined) { $scope.Health_License = ""; }

            if (!($scope.FirstName != "" && $scope.LastName != "" && $scope.Employee_No != ""
                && $scope.EmailId != "" && $scope.MobileNo != "" && $scope.Health_License != "")) {

                if ($scope.FirstName != "" && $scope.LastName != "" && $scope.Employee_No != ""
                    && $scope.EmailId != "" && $scope.MobileNo != "") {
                    $scope.currentTab = 2;
                }
                else
                    $scope.currentTab = 1;
            }
            else
                if ($scope.Health_License != "") {
                    $scope.currentTab = 2;
                }
                else {
                    //$scope.currentTab = 1;
                }
        }

        $scope.checkTab1 = function () {
            if ($scope.FirstName == undefined) { $scope.FirstName = ""; }
            if ($scope.LastName == undefined) { $scope.LastName = ""; }
            if ($scope.NationalId == undefined) { $scope.NationalId = ""; }
            if ($scope.EmailId == undefined) { $scope.EmailId = ""; }
            if ($scope.MobileNo == undefined) { $scope.MobileNo = ""; }
            if ($scope.InsuranceId == undefined) { $scope.InsuranceId = ""; }

            //if (!($scope.FirstName != "" && $scope.LastName != "" && $scope.NationalId != ""
            //    && $scope.InsuranceId != "" && $scope.MobileNo != "" && $scope.EmailId != "")) {
            if ($scope.FirstName != "" && $scope.LastName != "" && $scope.NationalId != "" && $scope.InsuranceId != ""
                && $scope.EmailId != "" && $scope.MobileNo != "") {
                $scope.currentTab = 2;
            }
            else
                $scope.currentTab = 1;
            //}
        }
        $scope.EligibilityCancelPopUP = function () {
            angular.element('#EligibilityModel').modal('hide');
            $scope.ServiceCategory = "";
            $scope.Clinicianlist = "";
            $scope.ConsultationCategory = "";
        }
        $scope.EligibilityNationalId = "";
        $scope.EligibilityPopup = function () {
            $scope.ClinicianDetailsList = [];
            $http.get(baseUrl + '/api/User/ClinicianDetails/?INSTITUTION_ID=' + $scope.InstituteId).then(function (response) {
                $scope.ClinicianDetailsList =response.data;
            });
            angular.element('#EligibilityModel').modal('show');
        }
        $scope.Businessuesrclickcount = 1;
        $scope.AddUserPopUP = function () {
            if ($scope.LoginType == '1') {
                $('#divInstitution').addClass("ng-invalid");
                $('#divInstitution').removeClass("ng-valid");
            }
            else {
                $('#divInstitution').addClass("ng-valid");
                $('#divInstitution').removeClass("ng-invalid");
            }

            $('#divGender').addClass("ng-invalid");
            $('#divDepartment').addClass("ng-invalid");
            $('#divUserType').addClass("ng-invalid");
            $('#divNationality').addClass("ng-invalid");
            $('#divDOB').addClass("ng-invalid");
            $('#divCountry').addClass("ng-invalid");
            $('#divCity').addClass("ng-invalid");
            $('#divState').addClass("ng-invalid");
            $scope.submitted = false;
            $scope.editcertificate = false;
            $('#btnsave').attr("disabled", false);
            $('#btnsave2').attr("disabled", false);
            $("#UserLogo").val('');
            photoview = false;
            photoview1 = false;
            photovie3 = false;
            photoview2 = false;
            $scope.GenderId = "0";
            $scope.uploadview = false;
            $scope.loadCount = 3;
            $scope.currentTab = "1";
            $scope.getBase64Image();
            if ($scope.Pat_UserTypeId != 1) {
                $scope.InstitutionSubscriptionLicensecheck(4);
            }
            // var UserTypeId = 4;
            //$scope.InstitutionSubscriptionLicensecheck(UserTypeId);
            $scope.AppConfigurationProfileImageList();
            $scope.DropDownListValue = 1;
            if ($scope.Businessuesrclickcount == 1) {
                // $scope.BusinessUserDropdownList();
                $scope.LoadBusinessUser_UserTypeList();
            }
            $scope.status = 2;
            $('[data-id="selectpicker"]').prop('disabled', false);
            
            $scope.LoadGenderList();
            $scope.LoadGroupTypeList();
            $scope.LoadDepartmentList();
            $scope.LoadNationalityList();
            $scope.LoadBusinessUser_UserTypeList();
            $scope.SuperAdminDropdownsList();
            //$scope.DOB = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            angular.element('#UserModal').modal('show');
        }

        $scope.DefaultCountryState = function () {
            //$scope.CountryId = $scope.InsCountryId;
            //$scope.StateId = $scope.InsStateId;
            //$scope.CountryBased_StateFunction();
            ////$scope.Country_onChange();
            //$scope.CityId = $scope.InsCityId;
            $scope.loadCount = $scope.loadCount - 1;
            // $scope.CountryId = $scope.InsCountryId;

            var cId = $scope.CountryId;
            if (cId != "0") {
                $('#divCountry').removeClass("ng-invalid");
                $('#divCountry').addClass("ng-valid");
            }

            //$http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.InsCountryId).success(function (data) {
            //    $scope.StateName_List = data;
            //    $scope.StateId = $scope.InsStateId;
            //    $scope.loadCount = $scope.loadCount - 1;

            //    var sId = $scope.StateId;
            //    if (sId != "0") {
            //        $('#divState').removeClass("ng-invalid");
            //        $('#divState').addClass("ng-valid");
            //    }

            //});

            URL = baseUrl + '/api/Common/Clone_Get_StateList/';
            $('#StateId').select2({
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
                            CountryId: $scope.InsCountryId
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
                        // $scope.StateName_List = data;
                        // $scope.StateId = $scope.InsStateId;
                        //$scope.loadCount = $scope.loadCount - 1;

                        //var sId = $scope.StateId;
                        //if (sId != "0") {
                        //    $('#divState').removeClass("ng-invalid");
                        //    $('#divState').addClass("ng-valid");
                        //}
                        return {
                            results: results
                        };
                    },
                    cache: true
                },
                width: '100%'
            });

            //$http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.InsCountryId + '&StateId=' + $scope.InsStateId).success(function (data) {
            //    //$scope.LocationName_List =data ;    
            //    $scope.LocationName_List = data;
            //    $scope.CityId = $scope.InsCityId;
            //    $scope.loadCount = $scope.loadCount - 1;

            //    var cId = $scope.CityId;
            //    if (cId != "0") {
            //        $('#divCity').removeClass("ng-invalid");
            //        $('#divCity').addClass("ng-valid");
            //    }
            //});

            URL = baseUrl + '/api/Common/Clone_Get_LocationList/';
            $('#CityId').select2({
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
                            CountryId: $scope.InsCountryId,
                            StateId: $scope.InsStateId
                        };
                    },
                    processResults: function (data) {
                        var results = [];
                        $.each(data, function (index, city) {
                            results.push({
                                id: city.Id,
                                text: city.CityName
                            });
                        });
                        // $scope.LocationName_List = data;
                        // $scope.CityId = $scope.InsCityId;
                        //$scope.loadCount = $scope.loadCount - 1;

                        //var cId = $scope.CityId;
                        //if (cId != "0") {
                        //    $('#divCity').removeClass("ng-invalid");
                        //    $('#divCity').addClass("ng-valid");
                        //}
                        return {
                            results: results
                        };
                    },
                    cache: true
                },
                width: '100%'
            });
            setTimeout(function () {
                $("#CountryId").select2("trigger", "select", {
                    data: { id: $scope.InsCountryId.toString(), text: $scope.InsCountryName }
                });
                $("#StateId").select2("trigger", "select", {
                    data: { id: $scope.InsStateId.toString(), text: $scope.InsStateName }
                });
                $("#CityId").select2("trigger", "select", {
                    data: { id: $scope.InsCityId.toString(), text: $scope.InsCityName }
                });
            });
        }
        $scope.ViewUserPopUP = function (CatId) {
            $("#UserLogo").val('');
            $scope.uploadme = null;
            $scope.uploadme1 = null;
            $scope.uploadme3 = null;
            $scope.uploadme2 = null;
            $scope.Id = CatId;
            photoview = true;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.DropDownListValue = 2;
            $scope.Admin_View($scope.MenuTypeId);
            $scope.currentTab = "1";
            angular.element('#UserViewModel').modal('show');
        }

        $scope.EditUserPopUP = function (CatId) {
            if ($scope.LoginType == '1') {
                $('#divInstitution').addClass("ng-invalid");
                $('#divInstitution').removeClass("ng-valid");
            }
            else {
                $('#divInstitution').addClass("ng-valid");
                $('#divInstitution').removeClass("ng-invalid");
            }

            $scope.submitted = false;
            $scope.editcertificate = true;
            $('#btnsave').attr("disabled", false);
            $('#btnsave2').attr("disabled", false);
            $scope.uploadme = null;
            $scope.uploadme1 = null;
            $scope.uploadme2 = null;
            $scope.uploadme3 = null;
            $scope.Biography = '';
            $scope.Id = CatId;
            photoview = true;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.EditParameter = 4;
            $scope.DropDownListValue = 1;
            $scope.status = 0;
            $('[data-id="selectpicker"]').prop('disabled', true);
            $scope.SuperAdminDropdownsList();
            if ($scope.Businessuesrclickcount == 1) {
                $scope.InstitutionBased_CountryStateList();
                $scope.BusinessUserDropdownList();
            }
            $scope.AppConfigurationProfileImageList();
            $scope.Admin_View($scope.MenuTypeId);           
            $scope.currentTab = "1";
            angular.element('#UserModal').modal('show');
            $('#spradminrowid').prop('disabled', true);
            $('#hosadminrowid').prop('disabled', true);
        }

        $scope.PatientView_Cancel = function () {
            if ($scope.PageParameter == 2) {
                $scope.currentTab = "1";
                $location.path("/PatientList/3");
                $scope.ClearPopUp();
            }
            else if ($scope.PageParameter == 1) {
                $window.localStorage['CurrentTabId'] = 1;
                $location.path("/PatientVitals/0/1");
            }
            else if ($scope.PageParameter == 3) {
                // Today Appointment Page
                $location.path("/PatientVitals/" + $scope.Id + "/2");
            }
            else if ($scope.PageParameter == 4) {
                // 30days Appointment Page
                $location.path("/PatientVitals/" + $scope.Id + "/3");
            }
            else if ($scope.PageParameter == 5) {
                // User Profile Patient Vitals
                $location.path("/PatientVitals/" + $scope.Id + "/4");
            }
            else if ($scope.PageParameter == 6) {
                // Diagostic Alert
                $location.path("/PatientVitals/" + $scope.Id + "/5");
            }
            else if ($scope.PageParameter == 7) {
                // Compliance Alert
                $location.path("/PatientVitals/" + $scope.Id + "/6");
            }
            else if ($scope.PageParameter == 8) {
                // Care Giver Assigned Patients
                $location.path("/PatientVitals/" + $scope.Id + "/7");
            }
            else if ($scope.PageParameter == 0) {
                // Patient Approval
                $location.path("/PatientApproval");
            }
        };

        photoview = false;
        photoview1 = false;
        photoview3 = false;
        photoview2 = false;
        var request = "";
        $scope.getBase64Image = function () {
            $scope.Editclearimage();
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $("#GenderId").val();
                $scope.UserTypeId1 = $('#UserTypeId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                
              
                //super clinician  
                if (typeof ($scope.Gender_Name) != "undefined") {
                    if ($scope.UserTypeId1 == 7 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/Clinician_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 7 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/Clinician_Female.png";
                    }
                    //care coordinator
                    else if ($scope.UserTypeId1 == 6 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/CC_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 6 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/CC_Female.png";
                    }
                    //care giver
                    else if ($scope.UserTypeId1 == 5 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/CG_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 5 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/CG_Female.png";
                    }
                    //clinician
                    else if ($scope.UserTypeId1 == 4 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/Clinician_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 4 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/Clinician_Female.png";
                    }
                    else {
                        picPath = "../../Images/others.png";
                    }
                    if (photoview == false) {
                        var request = new XMLHttpRequest();
                        request.open('GET', picPath, true);
                        request.responseType = 'blob';
                        request.onload = function () {
                            var reader = new FileReader();
                            reader.readAsDataURL(request.response);
                            reader.onload = function (e) {
                                $scope.uploadmes = e.target.result;
                                $scope.uploadme = $scope.uploadmes;
                                $scope.uploadme1 = $scope.uploadmes;
                                $scope.uploadme3 = $scope.uploadmes;
                                $scope.uploadme2 = $scope.uploadmes;
                                $scope.$apply();
                            };
                        };
                        request.send();
                    }
                } else if ($scope.GenderList?.length == 0 && $scope.Id > 0) {
                    var genderid = $scope.genid;
                    $scope.Gender_Name1 = $scope.ViewGender;
                    if ($scope.Gender_Name1.toLowerCase() == "male") {
                        maleId = genderid.toString();
                    }
                    else if ($scope.Gender_Name1.toLowerCase() == "female") {
                        feMaleId = genderid.toString();
                    }
                    if ($scope.UserTypeId1 == 7 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/Clinician_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 7 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/Clinician_Female.png";
                    }
                    //care coordinator
                    else if ($scope.UserTypeId1 == 6 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/CC_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 6 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/CC_Female.png";
                    }
                    //care giver
                    else if ($scope.UserTypeId1 == 5 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/CG_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 5 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/CG_Female.png";
                    }
                    //clinician
                    else if ($scope.UserTypeId1 == 4 && $scope.GenderId1 == maleId) {
                        picPath = "../../Images/Clinician_Male.png";
                    }
                    else if ($scope.UserTypeId1 == 4 && $scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/Clinician_Female.png";
                    }
                    if ($scope.UserTypeList?.length != 0) {
                        if (photoview == false) {
                            var request1 = new XMLHttpRequest();
                            request1.open('GET', picPath, true);
                            request1.responseType = 'blob';
                            request1.onload = function () {
                                var reader1 = new FileReader();
                                reader1.readAsDataURL(request1.response);
                                reader1.onload = function (e) {
                                    $scope.uploadmes = e.target.result;
                                    $scope.uploadme1 = $scope.uploadmes;
                                    $scope.uploadme2 = $scope.uploadmes;
                                    $scope.uploadme3 = $scope.uploadmes;
                                    $scope.$apply();
                                };
                            };
                            request1.send();

                            var request = new XMLHttpRequest();
                            request.open('GET', picPath, true);
                            request.responseType = 'blob';
                            request.onload = function () {
                                var reader = new FileReader();
                                reader.readAsDataURL(request.response);
                                reader.onload = function (e) {
                                    $scope.uploadmes = e.target.result;
                                    $scope.uploadme = $scope.uploadmes;
                                    $scope.$apply();
                                };
                            };
                            request.send();
                        }

                    }
                } else if ($scope.GenderList?.length == 0 && $scope.Id == 0) {
                    var picPath = "../../Images/others.png";

                    if (photoview == false) {
                        var request1 = new XMLHttpRequest();
                        request1.open('GET', picPath, true);
                        request1.responseType = 'blob';
                        request1.onload = function () {
                            var reader1 = new FileReader();
                            reader1.readAsDataURL(request1.response);
                            reader1.onload = function (e) {
                                $scope.uploadmes = e.target.result;
                                $scope.uploadme1 = $scope.uploadmes;
                                $scope.uploadme2 = $scope.uploadmes;
                                $scope.uploadme3 = $scope.uploadmes;
                                $scope.$apply();
                            };
                        };
                        request1.send();

                        var request = new XMLHttpRequest();
                        request.open('GET', picPath, true);
                        request.responseType = 'blob';
                        request.onload = function () {
                            var reader = new FileReader();
                            reader.readAsDataURL(request.response);
                            reader.onload = function (e) {
                                $scope.uploadmes = e.target.result;
                                $scope.uploadme = $scope.uploadmes;
                                $scope.$apply();
                            };
                        };
                        request.send();
                    }
                }
            }
        };
        //$scope.$watch('GenderId', function () {
        //    $scope.PatientgetBase64Image();
        //});

        $scope.getBase64Image_clear = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                var picPath = "../../Images/others.png";
                if (photoview == false) {
                    var request = new XMLHttpRequest();
                    request.open('GET', picPath, true);
                    request.responseType = 'blob';
                    request.onload = function () {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);
                        reader.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };

        // patient creation
        $scope.PatientgetBase64Image = function () {
            $scope.Editclearimage();
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();                        
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();                       
                    }
                });

                
                    var picPath1 = "../../Images/National_Male.png";
                    if (typeof ($scope.Gender_Name) != "undefined")
                        if ($scope.GenderId1 == feMaleId) {
                            picPath1 = "../../Images/National_Female.png";
                        }
                        else if ($scope.GenderId1 == maleId) {
                            picPath1 = "../../Images/National_Male.png";
                        }

                    var picPath = "../../Images/others.png";
                    if (typeof ($scope.Gender_Name) != "undefined")
                        if ($scope.GenderId1 == feMaleId) {
                            picPath = "../../Images/Patient_Female.png";
                        }
                        else if ($scope.GenderId1 == maleId) {
                            picPath = "../../Images/Patient_Male.png";
                        }
                if (($scope.GenderList?.length == 0 && $scope.Id == 0) || ($scope.GenderList?.length > 0 && $scope.Id > 0) || ($scope.GenderList?.length > 0 && $scope.Id == 0)) {
                    if (photoview == false) {
                        var request1 = new XMLHttpRequest();
                        request1.open('GET', picPath1, true);
                        request1.responseType = 'blob';
                        request1.onload = function () {
                            var reader1 = new FileReader();
                            reader1.readAsDataURL(request1.response);
                            reader1.onload = function (e) {
                                $scope.uploadmes = e.target.result;
                                $scope.uploadme1 = $scope.uploadmes;
                                $scope.uploadme2 = $scope.uploadmes;
                                $scope.uploadme3 = $scope.uploadmes;
                                $scope.$apply();
                            };
                        };
                        request1.send();

                        var request = new XMLHttpRequest();
                        request.open('GET', picPath, true);
                        request.responseType = 'blob';
                        request.onload = function () {
                            var reader = new FileReader();
                            reader.readAsDataURL(request.response);
                            reader.onload = function (e) {
                                $scope.uploadmes = e.target.result;
                                $scope.uploadme = $scope.uploadmes;
                                $scope.$apply();
                            };
                        };
                        request.send();
                    }
                }}   
                //if ($scope.GenderId1 > 0) {
                //$scope.GenderId = $scope.GenderId1;
                //    $scope.$apply();
                //}
            }          
        };
        
        $scope.PatientgetBase64Image_Profile = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                var picPath = "../../Images/others.png";
                if (typeof ($scope.Gender_Name) != "undefined")
                    if ($scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/Patient_Female.png";
                    }
                    else if ($scope.GenderId1 == maleId) {
                        picPath = "../../Images/Patient_Male.png";
                    }

                if (photoview == false) {
                    var request = new XMLHttpRequest();
                    request.open('GET', picPath, true);
                    request.responseType = 'blob';
                    request.onload = function () {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);
                        reader.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };
        $scope.PatientgetBase64Image_Insurance = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                var picPath1 = "../../Images/National_Male.png";
                if (typeof ($scope.Gender_Name) != "undefined")
                    if ($scope.GenderId1 == feMaleId) {
                        picPath1 = "../../Images/National_Female.png";
                    }
                    else if ($scope.GenderId1 == maleId) {
                        picPath1 = "../../Images/National_Male.png";
                    }

                if (photoview == false) {
                    var request1 = new XMLHttpRequest();
                    request1.open('GET', picPath1, true);
                    request1.responseType = 'blob';
                    request1.onload = function () {
                        var reader1 = new FileReader();
                        reader1.readAsDataURL(request1.response);
                        reader1.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme2 = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request1.send();
                }
            }
        };
        $scope.PatientgetBase64Image_National = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                var picPath1 = "../../Images/National_Male.png";
                if (typeof ($scope.Gender_Name) != "undefined")
                    if ($scope.GenderId1 == feMaleId) {
                        picPath1 = "../../Images/National_Female.png";
                    }
                    else if ($scope.GenderId1 == maleId) {
                        picPath1 = "../../Images/National_Male.png";
                    }
                if (photoview == false) {
                    var request1 = new XMLHttpRequest();
                    request1.open('GET', picPath1, true);
                    request1.responseType = 'blob';
                    request1.onload = function () {
                        var reader1 = new FileReader();
                        reader1.readAsDataURL(request1.response);
                        reader1.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme1 = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request1.send();
                }
            }
        };
        $scope.PatientgetBase64Image_UID = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                var picPath1 = "../../Images/National_Male.png";
                if (typeof ($scope.Gender_Name) != "undefined")
                    if ($scope.GenderId1 == feMaleId) {
                        picPath1 = "../../Images/National_Female.png";
                    }
                    else if ($scope.GenderId1 == maleId) {
                        picPath1 = "../../Images/National_Male.png";
                    }
                if (photoview == false) {
                    var request1 = new XMLHttpRequest();
                    request1.open('GET', picPath1, true);
                    request1.responseType = 'blob';
                    request1.onload = function () {
                        var reader1 = new FileReader();
                        reader1.readAsDataURL(request1.response);
                        reader1.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme3 = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request1.send();
                }
            }
        };

        //Admin creation
        $scope.AdmingetBase64Image = function () {
            $scope.Editclearimage();
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });
                //if ($scope.GenderList > 0) {
                var picPath = "";
                if (typeof ($scope.Gender_Name) != "undefined") {
                    if ($scope.GenderId1 == feMaleId) {
                        picPath = "../../Images/female.png";
                    }
                    else if ($scope.GenderId1 == maleId) {
                        picPath = "../../Images/Patient_Male.png";
                    }
                    else {
                        picPath = "../../Images/others.png";
                    }
                    if (photoview == false) {
                        var request = new XMLHttpRequest();
                        request.open('GET', picPath, true);
                        request.responseType = 'blob';
                        request.onload = function () {
                            var reader = new FileReader();
                            reader.readAsDataURL(request.response);
                            reader.onload = function (e) {
                                $scope.uploadmes = e.target.result;
                                $scope.uploadme = $scope.uploadmes;
                                $scope.uploadme1 = $scope.uploadmes;
                                $scope.uploadme3 = $scope.uploadmes;
                                $scope.uploadme2 = $scope.uploadmes;
                                $scope.$apply();
                            };
                        };
                        request.send();
                    }
                } else if ($scope.GenderList?.length == 0 && $scope.Id > 0) {
                    var genderid = $scope.genid;
                    $scope.Gender_Name1 = $scope.ViewGender;
                    if ($scope.Gender_Name1.toLowerCase() == "male") {
                        maleId = genderid.toString();
                    }
                    else if ($scope.Gender_Name1.toLowerCase() == "female") {
                        feMaleId = genderid.toString();
                    }
                    if ($scope.GenderId == feMaleId) {
                        picPath = "../../Images/female.png";
                    }
                    else if ($scope.GenderId == maleId) {
                        picPath = "../../Images/Patient_Male.png";
                    }
                    else {
                        picPath = "../../Images/others.png";
                    }
                    if ($scope.UserTypeList?.length != 0) {
                        if (photoview == false) {
                            var request1 = new XMLHttpRequest();
                            request1.open('GET', picPath, true);
                            request1.responseType = 'blob';
                            request1.onload = function () {
                                var reader1 = new FileReader();
                                reader1.readAsDataURL(request1.response);
                                reader1.onload = function (e) {
                                    $scope.uploadmes = e.target.result;
                                    $scope.uploadme1 = $scope.uploadmes;
                                    $scope.uploadme2 = $scope.uploadmes;
                                    $scope.uploadme3 = $scope.uploadmes;
                                    $scope.$apply();
                                };
                            };
                            request1.send();

                            var request = new XMLHttpRequest();
                            request.open('GET', picPath, true);
                            request.responseType = 'blob';
                            request.onload = function () {
                                var reader = new FileReader();
                                reader.readAsDataURL(request.response);
                                reader.onload = function (e) {
                                    $scope.uploadmes = e.target.result;
                                    $scope.uploadme = $scope.uploadmes;
                                    $scope.$apply();
                                };
                            };
                            request.send();
                        }
                    }
                }
            }
        };
        $scope.AdmingetBase64Image_Clear = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                $scope.GenderId1 = $('#GenderId').val();
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.text;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.id.toString();
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.id.toString();
                    }
                });

                var picPath = "../../Images/others.png";


                if (photoview == false) {
                    var request = new XMLHttpRequest();
                    request.open('GET', picPath, true);
                    request.responseType = 'blob';
                    request.onload = function () {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);
                        reader.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };
        $scope.CancelPopup = function () {
            angular.element('#UserModal').modal('hide');
            angular.element('#UserViewModel').modal('hide');
            angular.element('#PatientCreateModal').modal('hide');
            angular.element('#PatientViewModel').modal('hide');
            InstSub.setSubID(0);
            InstSub.setInstiID(0);
            $scope.ClearPopUp();
        }

        $scope.AddPatientPopup = function () {

            //if (typeof ($scope.isPatientSignUp) != 'undefined' && $scope.isPatientSignUp != "") {
            //    $scope.currentTab = "1";
            //    $scope.DropDownListValue = 1;
            //    var UserTypeId = 2;
            //    $scope.InstitutionSubscriptionLicensecheck(UserTypeId);
            //    $scope.AppConfigurationProfileImageList();
            //    $scope.ExpiryDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            //    //$scope.DOB = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            //    $location.path("/PatientCreate/" + "2" + "/" + "3");
            //}
            //else {
            //    toastr.warning("You are not rights to access patient sign up", "warning");
            //}

            $scope.currentTab = "1";
            $scope.DropDownListValue = 1;
            var UserTypeId = 2;
            $scope.InstitutionSubscriptionLicensecheck(UserTypeId);
            $scope.AppConfigurationProfileImageList();
            $scope.ExpiryDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            /*$scope.ConfigCode = "PATIENT_MIN_AGE";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).
            success(function (data) {
                if (data[0] != undefined) {
                    $scope.PatientMinAge = parseInt(data[0].ConfigValue);
                    $scope.maxdateDOB = moment().subtract($scope.PatientMinAge, 'years').format("YYYY-MM-DD");*/
            $scope.maxdateDOB = $scope.maxdateDOB;
            angular.element('#maxdateDOB').val($scope.maxdateDOB);
            angular.element('#Date_Birth').attr('max', $scope.maxdateDOB);
            /*}
        });*/

            $location.path("/PatientCreate/" + "2" + "/" + "3");
        }

        $scope.SubscriptionValidation = function () {
            if ($scope.Id == 0 && $scope.InstitutionId > 0)
                $scope.InstitutionSubscriptionLicensecheck(3);
        }

        //$scope.adminInsChange = function () {
        //    var ins = document.getElementById('selectpicker').value;
        //    if (ins != "0") {
        //        $('#divInstitution').removeClass("ng-invalid");
        //        $('#divInstitution').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInstitution').removeClass("ng-valid");
        //        $('#divInstitution').addClass("ng-invalid");
        //    }
        //}

        $scope.InstitutionSubscriptionLicensecheck = function (UserTypeId) {
            if (UserTypeId == 3) {
                var obj = {
                    INSTITUTION_ID: $scope.InstitutionId,
                    UserType_Id: UserTypeId,
                };
            }
            else {
                var obj = {
                    INSTITUTION_ID: $window.localStorage['InstitutionId'],
                    UserType_Id: UserTypeId,
                };
            }
            $http.post(baseUrl + '/api/User/InstitutionSubscriptionLicensecheck/', obj).then(function (response) {
                if (response.data.ReturnFlag == 0) {
                    //alert(data.Message);
                    toastr.warning(response.data.Message, "warning");
                }
            }, function errorCallback(response) {
                $scope.error = "An error has occurred InstitutionSubscriptionLicensecheck" + response.data;
            });

        };
        $scope.ViewId = 1;
        $scope.ViewPatientPopUp = function (CatId) {
            $scope.Id = CatId;
            $scope.currentTab = "1";
            $scope.DropDownListValue = 1;
            //$scope.Admin_View($scope.MenuTypeId);
            $location.path("/PatientView/" + $scope.Id + "/2" + "/" + "3");
        }
        $scope.EditPatientPopUp = function (CatId) {
            $scope.Id = CatId;
            $scope.DropDownListValue = 3;
            $scope.submitted = false;
            $('#btnsave1').attr("disabled", false);
            $scope.AppConfigurationProfileImageList();
            $('#btnsave').attr("disabled", true);
            $('#btnsave2').attr("disabled", true);
            //$scope.Admin_View($scope.MenuTypeId);
            $location.path("/PatientEdit/" + $scope.Id + "/2" + "/" + "3" + "/4");

        }

        $scope.ClearPopUp = function () {
            $scope.Id = "0";
            $scope.UserType = "0";
            $scope.InstitutionId = "0";
            $scope.FirstName = "";
            $scope.MiddleName = "";
            $scope.LastName = "";
            $scope.Employee_No = "";
            $scope.EmailId = "";
            $scope.MobileNo = "";
            $scope.MobileNo_CC = "";
            $scope.DepartmentId = "0";
            $scope.UserTypeId = "0";
            $scope.GenderId = "0";
            $scope.Health_License = "";
            $scope.Title_Id = 0;
            $scope.NationalityId = "0";
            $scope.DOB = "";
            $scope.Address1 = "";
            $scope.Address2 = "";
            $scope.Address3 = "";
            $scope.PostalZipCode = "";
            $scope.EMR_Avalability = "";
            $scope.EthnicGroupId = "0";
            $scope.CountryId = "0";
            $scope.StateId = "0";
            $scope.CityId = "0";
            $scope.MaritalStatusId = "0";
            $scope.BloodGroupId = "0";
            $scope.Smoker = "0";
            $scope.Diabetic = "0";
            $scope.HyperTension = "0";
            $scope.Cholestrol = "0";
            //$scope.CurrentMedicineflag = "0";
            //$scope.PastMedicineflag = "0";
            //$scope.MedicalHistoryflag = "0";
            $scope.MNR_No = "";
            $scope.FullNameFormula = "";
            $scope.PrefixMRN = "";
            $scope.PatientNo = "";
            $scope.NationalId = "";
            $scope.UID = "";
            $scope.InsuranceId = "";
            $scope.EMERG_CONT_FIRSTNAME = "";
            $scope.EMERG_CONT_MIDDLENAME = "";
            $scope.EMERG_CONT_LASTNAME = "";
            $scope.CAFFEINATEDBEVERAGES_TEXT = "";
            $scope.ALCOHALSUBSTANCE_TEXT = "";
            $scope.SMOKESUBSTANCE_TEXT = "";
            $scope.ALERGYSUBSTANCE_TEXT = "";
            $scope.EXCERCISE_TEXT = "";
            $scope.MaritalStatusId = "0";
            $scope.BloodGroupId = "0";
            $scope.EMERG_CONT_RELATIONSHIP_ID = "0";
            $scope.DIETDESCRIBE_ID = "0";
            $scope.EXCERCISE_SCHEDULEID = "0";
            $scope.ALERGYSUBSTANCE_ID = "0";
            $scope.SMOKESUBSTANCE_ID = "0";
            $scope.ALCOHALSUBSTANCE_ID = "0";
            $scope.CAFFEINATED_BEVERAGESID = "0";
            $scope.ChronicConditionList = [];
            $scope.RelationshipList = [];
            $scope.PayorMasterList = [];
            $scope.PayorBasedPlanList = [];
            $scope.DietTypeList = [];
            $scope.ScheduleList = [];
            $scope.AlergySubstanceList = [];
            $scope.BloodGroupList = [];
            $scope.EthnicGroupList = [];
            $scope.MaritalStatusList = [];
            $scope.PatientChronicCondition_List = [];
            // $scope.SelectedGroup = "0";
            $scope.GroupTypeList = [];
            $scope.SelectedInstitution = "0";
            $scope.SelectedLanguage = "0";
            $scope.Home_PhoneNo = "";
            $scope.HomeAreaCode = "";
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = null;
            $scope.uploadme1 = null;
            $scope.uploadme3 = null;
            $scope.uploadme2 = null;
            $('#UserLogo').val('');
            $('#NationalLogo').val('');
            $('#UIDLogo').val('');
            $('#InsuranceLogo').val('');
            $scope.PhotoValue = 0;
            $scope.PhotoValue1 = 0;
            $scope.PhotoValue2 = 0;
            $scope.resumedoc = "";
            $('#Userdocument').val('');
            $scope.CertificateFileName = "";
            $scope.FileType = "";
            $scope.Google_EmailId = "";
            $scope.FB_EmailId = "";
            $scope.SelectedChronicCondition = "0";
            $scope.MedicineRow = "-1";
            //$scope.MedicalHistoryRow = "-1";
            $scope.HealthProblemRow = "-1";
            $scope.PhotoValue = 0;
            $scope.CertificateValue = 0;
            $scope.Emergency_MobileNo = "";
            $scope.EditFileName = "";
            $scope.Editresumedoc = "";
            $('#EditDocument').val('');
            $scope.CertificateFileName = "";
            $scope.appleUserID = "";
            $scope.PATIENT_ID = "";
            $scope.TimeZone_Id = "0";
            $scope.TimeZoneId = "0";
            $scope.Member_ID = "";
            $scope.Policy_Number = "";
            $scope.Reference_ID = "";
            $scope.ExpiryDate = "";
            $scope.SelectedPayor = "0";
            $scope.SelectedPlan = "0";

            $scope.DepartmentList = [];
            $scope.UserTypeList = [];
            $('#SelectedChronicCondition').html('').select2({ data: { id: null, text: null } });
            $('#SelectedGroup').html('').select2({ data: { id: null, text: null } });
            $scope.ServiceCategory = [];
            $scope.ConsultationCategory = [];
        }


        // editable time value from app settings	

        $scope.AppConfigurationProfileImageList = function () {
           $scope.ProfileImageSize = "5242880";    // 5 MB
            $scope.ConfigCode = "PROFILE_PICTURE";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).
                then(function (response) {
                    if (response.data[0] != undefined) {
                        $scope.ProfileImageSize = parseInt(response.data[0].ConfigValue);
                    }
                });
        }

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }
        //$http.get(baseUrl + '/api/Common/InstitutionNameList/').then(function (response) {
        //    $scope.InstitutionList = response.data;
        //}, function errorCallback(response) {
        //});
        $scope.SuperAdminDropdownsList = function () {
            if ($scope.LoginType == 1 || $scope.LoginType == 3) {
                $http.get(baseUrl + '/api/Common/InstitutionNameList/?status=' + $scope.status).then(function (response) {
                    $scope.InstitutiondetailsListTemp = [];
                    $scope.InstitutiondetailsListTemp = response.data;
                    var obj = { "Id": 0, "Name": "Select", "IsActive": 0, "Country_ISO3": 0};
                    $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
                    //$scope.InstitutiondetailsListTemp.push(obj);
                    $scope.InstitutionList = angular.copy($scope.InstitutiondetailsListTemp);
                        if ($scope.AdminFlowdata != undefined) {
                            $scope.InstitutionId = $scope.AdminFlowdata.toString();
                            var d = $scope.InstitutionList.filter(x => x.Id === parseInt($scope.InstitutionId));
                            var iso2 = d[0].Country_ISO2;
                            var countryCode = d[0].CountryCode;
                            var input = document.querySelector("#txtMobile");
                            var inputPhoneNo = window.intlTelInput(input, {
                                formatOnDisplay: true,
                                separateDialCode: true,
                                initialCountry: iso2,
                                //onlyCountries: [iso2],
                                geoIpLookup: function (callback) {
                                    $.get("http://ipinfo.io", function () { }, "jsonp").always(function (resp) {
                                        var countryCode = (resp && resp.country) ? resp.country : "";
                                        callback(countryCode);
                                    });
                                },
                                //preferredCountries: ["in"],
                                utilsScript: "scripts/utils.js",
                            });
                            $scope.InputPhoneNo1 = inputPhoneNo;
                            const PhoneNumber = inputPhoneNo.getNumber();
                            var countryData = inputPhoneNo.getSelectedCountryData();
                            var countryCode = countryData.dialCode; // using updated doc, code has been replaced with dialCode
                            var iso2 = iso2;//countryData.iso2;
                            var number = document.getElementById("txtMobile").value;
                            document.getElementById("txthdCountryiso2").value = iso2;
                            document.getElementById("txthdCountryCode").value = countryCode;
                            document.getElementById("txthdFullNumber").value = countryCode + "~" + number;
                        } else if ($scope.Id == '0') {
                            var input = document.querySelector("#txtMobile");
                            var inputPhoneNo = window.intlTelInput(input, {
                                formatOnDisplay: true,
                                separateDialCode: true,
                                geoIpLookup: function (callback) {
                                    $.get("http://ipinfo.io", function () { }, "jsonp").always(function (resp) {
                                        var countryCode = (resp && resp.country) ? resp.country : "";
                                        callback(countryCode);
                                    });
                                },
                                //preferredCountries: ["in"],
                                utilsScript: "scripts/utils.js",
                            });
                        } else {
                            //$http.get(baseUrl + '/api/Common/InstitutionNameList/?status=' + $scope.status).success(function (data) {
                                $scope.InstitutiondetailsListTemp1 = [];
                            $scope.InstitutiondetailsListTemp1 = $scope.InstitutionList;
                                $scope.InsListId = $scope.InsListId1;
                                var Inslist = $scope.InstitutiondetailsListTemp1.filter(x => x.Id === parseInt($scope.InsListId));
                            var iso2 = Inslist[0].Country_ISO2;
                            if (iso2 != null) {
                                iso2 = iso2;
                            } else { 
                                iso2 = 'AF';
                            }
                                //$scope.InstitutionId = $scope.AdminFlowdata.toString();
                                var input = document.querySelector("#txtMobile");
                                var inputPhoneNo = window.intlTelInput(input, {
                                    formatOnDisplay: true,
                                    separateDialCode: true,
                                    initialCountry: iso2,
                                    // onlyCountries: [iso2],
                                    geoIpLookup: function (callback) {
                                        $.get("http://ipinfo.io", function () { }, "jsonp").always(function (resp) {
                                            var countryCode = (resp && resp.country) ? resp.country : "";
                                            callback(countryCode);
                                        });
                                    },
                                    //preferredCountries: ["in"],
                                    utilsScript: "scripts/utils.js",
                                });
                            $scope.InputPhoneNo1 = inputPhoneNo;
                            const PhoneNumber = inputPhoneNo.getNumber();
                            var countryData = inputPhoneNo.getSelectedCountryData();
                            var countryCode = countryData.dialCode; // using updated doc, code has been replaced with dialCode
                            var iso2 = iso2;//countryData.iso2;
                            var number = document.getElementById("txtMobile").value;
                            document.getElementById("txthdCountryiso2").value = iso2;
                            document.getElementById("txthdCountryCode").value = countryCode;
                            document.getElementById("txthdFullNumber").value = countryCode + "~" + number;
                           // });
                    }

                    if ($scope.InstitutionId != "0") {
                        $('#divInstitution').removeClass("ng-invalid");
                        $('#divInstitution').addClass("ng-valid");
                    }
                    else {
                        $('#divInstitution').removeClass("ng-valid");
                        $('#divInstitution').addClass("ng-invalid");
                    }
                }, function errorCallback(response) {
                });

                //$scope.txtPhoneChange = function () {
                //   //var input = document.querySelector("#txtMobile");
                //    var inputPhoneNo = $scope.inputPhoneNo1;
                //    const PhoneNumber = inputPhoneNo.getNumber();
                //    var countryData = inputPhoneNo.getSelectedCountryData();
                //    var countryCode = countryData.dialCode; // using updated doc, code has been replaced with dialCode
                //    var iso2 = countryData.iso2;
                //    countryCode = "+" + countryCode;
                //    var number = document.getElementById("txtMobile").value;
                //    document.getElementById("txthdCountryiso2").value = iso2;
                //    document.getElementById("txthdCountryCode").value = countryCode;
                //    //document.getElementById("txthdFullNumber").value = PhoneNumber;
                //    document.getElementById("txthdFullNumber").value = countryCode + "~" + number;
                //    if (PhoneNumber != "") {
                //        var isValidNum = inputPhoneNo.isValidNumber();
                //        if (!isValidNum) {
                //            swal.fire("Phone number invalid");
                //            document.getElementById("txthdFullNumber").value = "";
                //        }
                //        else {
                //            document.getElementById("txthdFullNumber").value = countryCode + "~" + number;
                //        }
                //    }
                //    //inputPhoneNo.setCountry(txtiso2);
                //}


                //$http.get(baseUrl + '/api/Common/GenderList/').success(
                //    function (data) {
                //        $scope.GenderList = data;
                //        if ($scope.GenderId != "0") {
                //            $('#divGender').removeClass("ng-invalid");
                //            $('#divGender').addClass("ng-valid");
                //        }
                //        else {
                //            $('#divGender').removeClass("ng-valid");
                //            $('#divGender').addClass("ng-invalid");
                //        }
                //    });

                if ($scope.GenderId != "0") {
                    $('#divGender').removeClass("ng-invalid");
                    $('#divGender').addClass("ng-valid");
                }
                else {
                    $('#divGender').removeClass("ng-valid");
                    $('#divGender').addClass("ng-invalid");
                }

                //$http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                //    $scope.DepartmentList = data;
                //    if ($scope.DepartmentId != "0") {
                //        $('#divDepartment').removeClass("ng-invalid");
                //        $('#divDepartment').addClass("ng-valid");
                //    }
                //    else {
                //        $('#divDepartment').removeClass("ng-valid");
                //        $('#divDepartment').addClass("ng-invalid");
                //    }
                //});
                //if ($scope.DepartmentId != "0") {
                //    $('#divDepartment').removeClass("ng-invalid");
                //    $('#divDepartment').addClass("ng-valid");
                //}
                //else {
                //    $('#divDepartment').removeClass("ng-valid");
                //    $('#divDepartment').addClass("ng-invalid");
                //}
            }
        }

        $scope.Businesstab1 = 0;
        $scope.BusinessUserDropdownList = function () {
            if ($scope.LoginType == 2 && $scope.DropDownListValue == 1) {

                //$http.get(baseUrl + '/api/User/BusinessUser_UserTypeList/').success(function (data) {
                //    console.log(data);
                //    $scope.UserTypeList = data;
                //    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                //    if ($scope.UserTypeId != "0") {
                //        $('#divUserType').removeClass("ng-invalid");
                //        $('#divUserType').addClass("ng-valid");
                //    }
                //    else {
                //        $('#divUserType').removeClass("ng-valid");
                //        $('#divUserType').addClass("ng-invalid");
                //    }
                //});
                $scope.Businesstab1 = $scope.Businesstab1 + 1;

                //$http.get(baseUrl + '/api/Common/GenderList/').success(
                //    function (data) {
                //        $scope.GenderList = data;
                //        $scope.Businesstab1 = $scope.Businesstab1 + 1;
                //    });

                //$http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                //    $scope.DepartmentList = data;
                //    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                //    if ($scope.DepartmentId != "0") {
                //        $('#divDepartment').removeClass("ng-invalid");
                //        $('#divDepartment').addClass("ng-valid");
                //    }
                //    else {
                //        $('#divDepartment').removeClass("ng-valid");
                //        $('#divDepartment').addClass("ng-invalid");
                //    }
                //});

                if ($scope.DepartmentId != "0") {
                    $('#divDepartment').removeClass("ng-invalid");
                    $('#divDepartment').addClass("ng-valid");
                }
                else {
                    $('#divDepartment').removeClass("ng-valid");
                    $('#divDepartment').addClass("ng-invalid");
                }
            }
            $scope.Businessuesrclickcount = $scope.Businessuesrclickcount + 1;
        }

        $scope.$watch('Businesstab1', function () {
            if ($scope.Businesstab1 == 3) {
                //$http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                //    $scope.NationalityList = data;
                //    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                //});
                $scope.Businesstab1 = $scope.Businesstab1 + 1;
                $http.get(baseUrl + '/api/User/DoctorInstitutionList/').then(function (response) {
                    $scope.DoctorInstitutionList = response.data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
            if ($scope.Businesstab1 == 5) {
                $http.get(baseUrl + '/api/Common/LanguageList/').then(function (response) {
                    $scope.LanguageList = response.data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
        });

        if ($scope.LoginType == 2) {
            $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                $scope.GroupTypeList = response.data;
            });
            $scope.LoadFilterCLNationalityList();
            $scope.LoadFilterBusinessUser_UserTypeList();
            //URL = baseUrl + '/api/Common/CloneGroupTypeList/';
            //$('#AssignedGroup').select2({
            //    placeholder: "Select",
            //    selectAll: true,
            //    ajax: {
            //        dataType: "json",
            //        url: URL,
            //        data: function (params) {
            //            return {
            //                q: params.term, // search term
            //                Institution_Id: $scope.InstituteId
            //            };
            //        },
            //        processResults: function (data) {
            //            var results = [];
            //            $.each(data, function (index, group_type) {
            //                results.push({
            //                    id: group_type.Id,
            //                    text: group_type.GROUP_NAME
            //                });
            //            });
            //            $scope.GroupTypeList = results;
            //            return {
            //                results: results
            //            };
            //        },
            //        cache: true
            //    },
            //    width: '100%'
            //});
        }
        //$scope.Patientcreatefunction = function()
        //{
        $scope.tab1 = 0;
        $scope.Patientcreatefunction = function () {
            //$http.get(baseUrl + '/api/Common/GenderList/').success(
            //    function (data) {
            //        $scope.GenderList = data;
            //        $scope.tab1 = $scope.tab1 + 1;
            //        $scope.PatientgetBase64Image();
            //        // validation for Gender
            //        //$scope.PatientGenderChange();
            //    });

            $scope.tab1 = $scope.tab1 + 1;
            $scope.PatientgetBase64Image();
            $scope.LoadGroupTypeList();

            //$http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
            //    $scope.GroupTypeList = data;
            //    $scope.tab1 = $scope.tab1 + 1;
            //});

            $http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + 1 + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + 1 + '&EndRowNumber=' + 30).then(function (response) {
                $scope.PayorMasterList = response.data;
            });

            $scope.ConfigCode = "MRN_PREFIX";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data2) {
                if (data2.data.length !== 0) {
                    $scope.PrefixMRN = data2.data[0].ConfigValue;
                }
            });
        }

        $scope.$watch('tab1', function () {
            if ($scope.tab1 == 2) {
                //$http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                //    $scope.NationalityListTemp = [];
                //    $scope.NationalityListTemp = data;
                //    /*var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                //    $scope.NationalityListTemp.splice(0, 0, obj);*/
                //    $scope.NationalityList = angular.copy($scope.NationalityListTemp);
                //    $scope.tab1 = $scope.tab1 + 1;
                //    //validation when loading nationality
                //    //$scope.PatientNationalityChange();
                //});

                $scope.NationalityListTemp = $scope.NationalityList;
                $scope.NationalityList = angular.copy($scope.NationalityListTemp);
                $scope.tab1 = $scope.tab1 + 1;

                //$http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                //    $scope.MaritalStatusListTemp = [];
                //    $scope.MaritalStatusListTemp = data;
                //    /* var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                //     $scope.MaritalStatusListTemp.splice(0, 0, obj);*/
                //    $scope.MaritalStatusList = angular.copy($scope.MaritalStatusListTemp);
                //    $scope.tab1 = $scope.tab1 + 1;
                //    //validation for marital status
                //    //$scope.PatientMaritalChange();
                //});

                $scope.MaritalStatusListTemp = [];
                $scope.MaritalStatusListTemp = $scope.MaritalStatusList;
                /* var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                 $scope.MaritalStatusListTemp.splice(0, 0, obj);*/
                $scope.MaritalStatusList = angular.copy($scope.MaritalStatusListTemp);
                $scope.tab1 = $scope.tab1 + 1;

                //$http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                //    $scope.EthnicGroupListTemp = [];
                //    $scope.EthnicGroupListTemp = data;
                //    /* var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                //     $scope.EthnicGroupListTemp.splice(0, 0, obj);*/
                //    $scope.EthnicGroupList = angular.copy($scope.EthnicGroupListTemp);
                //    $scope.tab1 = $scope.tab1 + 1;
                //    //validation checking for ethnic group
                //    //$scope.PatientEthnicChange();
                //});

                $scope.EthnicGroupListTemp = [];
                $scope.EthnicGroupListTemp = $scope.EthnicGroupList;
                /* var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                 $scope.EthnicGroupListTemp.splice(0, 0, obj);*/
                $scope.EthnicGroupList = angular.copy($scope.EthnicGroupListTemp);
                $scope.tab1 = $scope.tab1 + 1;

                //$http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                //    /*$scope.BloodGroupList = data;*/
                //    $scope.BloodGroupListTemp = [];
                //    $scope.BloodGroupListTemp = data;
                //    /* var obj = { "Id": 0, "BloodGroup_Name": "Select", "IsActive": 1 };
                //     $scope.BloodGroupListTemp.splice(0, 0, obj);*/
                //    $scope.BloodGroupList = angular.copy($scope.BloodGroupListTemp);
                //    $scope.tab1 = $scope.tab1 + 1;
                //    //validation checking for blood grp when loading.
                //    //$scope.PatientBldGrpChange();
                //});

                $scope.BloodGroupListTemp = [];
                $scope.BloodGroupListTemp = $scope.BloodGroupList;
                /* var obj = { "Id": 0, "BloodGroup_Name": "Select", "IsActive": 1 };
                 $scope.BloodGroupListTemp.splice(0, 0, obj);*/
                $scope.BloodGroupList = angular.copy($scope.BloodGroupListTemp);
                $scope.tab1 = $scope.tab1 + 1;

                //$http.get(baseUrl + '/api/Common/ChronicConditionList/').success(function (data) {
                //    $scope.ChronicConditionList = data;
                //    $scope.tab1 = $scope.tab1 + 1;
                //});
            }

            if ($scope.tab1 == 7) {
                $http.get(baseUrl + '/api/Common/RelationshipList/').then(function (response) {
                    $scope.RelationshipList = response.data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
            }
            if ($scope.tab1 == 8) {
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.ISact = 1;
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1) {
                    $scope.page_size = data1.data[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $scope.tab1 = $scope.tab1 + 1;

                    //$http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.SelectedInstitutionId + '&StartRowNumber=' + $scope.PageStart +
                    //    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    //        $scope.PayorMasterList = data;
                    //        $scope.tab1 = $scope.tab1 + 1;
                    //    });
                });
            }

            if ($scope.tab1 == 9) {
                $http.get(baseUrl + '/api/Common/OptionTypeList/').then(function (response) {
                    $scope.OptionTypeList = response.data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                //$http.get(baseUrl + '/api/Common/RelationshipList/').success(function (data) {
                //    $scope.RelationshipList = data;
                //    $scope.tab1=$scope.tab1+1;
                //});
                $http.get(baseUrl + '/api/Common/DietTypeList/').then(function (response) {
                    $scope.DietTypeList = response.data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/ScheduleList/').then(function (response) {
                    $scope.ScheduleList = response.data;
                    $scope.tab1 = $scope.tab1 + 1;
                });

                $http.get(baseUrl + 'api/User/AllergyTypeList/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                    $scope.AlergySubstanceList = response.data;
                    $scope.tab1 = $scope.tab1 + 1;
                })
            }

        });


        //}   
        $scope.patientDropdownList = function () {
            if ($scope.LoginType == 3 && $scope.TabClick == false) {
                $scope.TabClick = true;
                //$http.get(baseUrl + '/api/Common/GenderList/').success(
                //    function (data) {
                //        $scope.GenderList = data;
                //    });
                //$http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                //    $scope.NationalityList = data;
                //});
                //$http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                //    $scope.EthnicGroupList = data;
                //});
                //$http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                //    $scope.MaritalStatusList = data;
                //});
                //$http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                //    $scope.BloodGroupList = data;
                //});
                //$http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                //    $scope.GroupTypeList = data;
                //});

                //$http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                //    //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List').success(function (data) {
                //    $scope.CountryNameList = data;
                //});
            }
        };
        /*$http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
            $scope.CountryList = data;
        });
        $http.get(baseUrl + '/api/Common/StateList/').success(function (data) {
            $scope.StateList = data;
        });
        $http.get(baseUrl + '/api/Common/GetLocationList/').success(function (data) {
            $scope.LocationList = data;
        });*/

        /*
        Calling api method for the dropdown list in the html page for the fields
        Country,State,Locaiton  
        */
        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];
        //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List/').success(function (data) {
        //    //only active Country
        //    $scope.CountryNameList = $ff(data.CountryList, { IsActive: 1 });
        //    $scope.State_Template = data.StateList;
        //    $scope.City_Template = data.LocationList;
        //});
        $scope.InstitutionBased_CountryStateList = function () {
            if (typeof ($routeParams.Id) == "undefined") {
                //$http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                //    //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List').success(function (data) {
                //    $scope.CountryNameList = data;
                //    //only active Country
                //    //$scope.CountryNameList = $ff(data.CountryList, { IsActive: 1 });
                //    //$scope.State_Template = data.StateList;
                //    //$scope.City_Template = data.LocationList;
                //    $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                //        $scope.InsCountryId = data.CountryId.toString();
                //        $scope.InsStateId = data.StateId.toString();
                //        $scope.InsCityId = data.CityId.toString();
                //        $scope.DefaultCountryState();
                //        /*$scope.CountryBased_StateFunction();
                //        //$scope.Country_onChange();
                //        //  $scope.CityId = $scope.InsCityId;
                //        $scope.StateBased_CityFunction();*/
                //    });
                //});
                URL = baseUrl + '/api/Common/CloneCountryList/';
                $('#CountryId').select2({
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
                $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                    $scope.InsCountryId = response.data.CountryId.toString();
                    $scope.InsCountryName = response.data.CountryName;

                    $scope.InsStateId = response.data.StateId.toString();
                    $scope.InsStateName = response.data.StateName;

                    $scope.InsCityId = response.data.CityId.toString();
                    $scope.InsCityName = response.data.CityName;

                    $scope.DefaultCountryState();
                });

            }
        }
        $scope.PayorBased_PlanFunction = function (id) {
            if ($scope.SelectedPayor != "0") {
                $http.get(baseUrl + '/api/PlanMaster/PayorBasedPlan/?Id=' + $scope.SelectedPayor).then(function (response) {
                    $scope.PayorBasedPlanList = response.data;
                });
            } else {
                $scope.PayorBasedPlanList = [];
            }
        }

        $scope.CountryBased_StateFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CountryId).then(function (response) {
                    $scope.StateName_List = response.data;
                    $scope.LocationName_List = [];
                    $scope.CityId = "0";
                });
            }
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
        $scope.StateBased_CityFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CountryId + '&StateId=' + $scope.StateId).then(function (response) {
                    $scope.LocationName_List = response.data;
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

        $scope.CountryBasedStateFunction = function () {
            $scope.StateId = '0';
            $scope.CityId = '0';
            $scope.CountryId1 = $("#CountryId").val();
            $scope.LoadStateList($scope.CountryId1);
        }
        $scope.StateBasedCityFunction = function () {
            $scope.CityId = '0';
            $scope.CountryId1 = $("#CountryId").val();
            $scope.StateId1 = $("#StateId").val();
            $scope.LoadCityList($scope.CountryId1, $scope.StateId1);
        }
        $scope.Filter_Country_OnChange = function () {
            $scope.LoadStateList($scope.filter_CountryId);
        }

        $scope.Filter_State_OnChange = function () {
            $scope.LoadCityList($scope.filter_CountryId, $scope.filter_StataId);
        }

        $scope.User_Admin_List = function (MenuType) {
            if ($window.localStorage['UserTypeId'] == 1 || $window.localStorage['UserTypeId'] == 3) {
                $scope.UserTypeId = $window.localStorage['UserTypeId'];
                $("#chatLoaderPV").show();
                $scope.MenuTypeId = MenuType;
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
                $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.MenuTypeId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId + '&UserType_Id=' + $scope.UserTypeId).then(function (response) {
                    $scope.emptydata = [];
                    $scope.UserDetailsList = [];
                    $scope.UserDetailsList = response.data;
                    $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                    $scope.SearchMsg = "No Data Available";
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }

        $scope.BusinessUser_List = function (MenuType) {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.UserTypeId = $window.localStorage['UserTypeId'];
                $scope.MenuTypeId = MenuType;
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;

                $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.MenuTypeId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId + '&UserType_Id=' + $scope.UserTypeId).then(function (response) {
                    $scope.BusineessUseremptydata = [];
                    $scope.BusinessUserList = [];
                    $scope.BusinessUserList = response.data;
                    $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                        $scope.Remaining_No_Of_HealthCareProf = response.data.Remaining_No_Of_HealthCareProf;
                        $scope.Health_Care_Professionals = response.data.Health_Care_Professionals;
                    });
                    $scope.BusinessUserFilter = angular.copy($scope.BusinessUserList);
                    if ($scope.BusinessUserFilter.length > 0) {
                        $scope.BusinessUserflag = 1;
                    }
                    else {
                        $scope.BusinessUserflag = 0;
                    }
                    $("#chatLoaderPV").hide();
                    $scope.SearchMsg = "No Data Available";
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }


        $scope.setPage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else
                $scope.inputPageNo = PageNo;

            $scope.current_page = PageNo;
            if ($scope.Patientsearchquery == "" && $scope.Filter_PatientNo == "" && $scope.filter_InsuranceId == "" && $scope.filter_NationalityId == "" && $scope.filter_MOBILE_NO == "" && $scope.filter_Email == "" && $scope.Filter_FirstName == "" && $scope.Filter_LastName == "" && $scope.Filter_MRN == "") {
                $scope.Patient_List(3);
            }
            else {
                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_page * $scope.page_size;
                getallpatientlist();
            }
        }

        $scope.Patient_List = function (MenuType) {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.MenuTypeId = MenuType;
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
                $scope.CommaSeparated_Group = $scope.filter_GroupId.toString();

                $scope.PageCountArray = [];
                $scope.Patientemptydata = [];
                $scope.PatientList = [];
                $scope.ISact = 1;

                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];

                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1) {
                    $scope.page_size = data1.data[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $scope.Input_Type = 1;
                    $scope.SearchEncryptedQuery = $scope.searchquery;
                    allpatientlist();
                    //var obj = {
                    //    InputType: $scope.Input_Type,
                    //    DecryptInput: $scope.SearchEncryptedQuery
                    //};
                    //$http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                    //    $scope.SearchEncryptedQuery = data;


                    //});
                });
                //$http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                //    $scope.Remaining_No_Of_Patient = data.Remaining_No_Of_Patient;
                //    $scope.Patients = data.No_Of_Patients;
                //    //$scope.Created_No_Of_HealthCareProf = data.Created_No_Of_HealthCareProf;
                //});

                $scope.loadCount = 0;
                if ($scope.LoginType == 3) {
                    $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                        $scope.GroupTypeList = response.data;
                        $scope.tab1 = $scope.tab1 + 1;
                    });
                }
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }

        allpatientlist = function () {
            $http.get(baseUrl + '/api/User/Patient_List/Id?=' + $scope.Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId +
                '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' +
                $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus +
                '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId +
                '&Group_Id=' + $scope.filter_GroupId + '&IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId'] + '&StartRowNumber=' + $scope.PageStart +
                '&EndRowNumber=' + $scope.PageEnd + '&SearchQuery=' + $scope.searchquery + '&SearchEncryptedQuery=' + $scope.SearchEncryptedQuery + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                    $("#chatLoaderPV").hide();
                    $scope.Patientemptydata = [];
                    $scope.PatientList = [];
                    $scope.PatientList = response.data.itemizedUserDetailsModels;
                    $scope.Patientemptydata = response.data.itemizedUserDetailsModels;
                    $scope.Patients = response.data.userCountDetails.Number_User;
                    $scope.Remaining_No_Of_Patient = response.data.userCountDetails.Remaind_User;
                    if (response.data.length == 0) {
                        $scope.SearchMsg = "No Data Available";
                        $scope.PatientCount = 0;
                    } else {
                        $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                    }
                    $scope.total_pages = Math.ceil(parseInt($scope.PatientCount) / ($scope.page_size));
                });
        }

        $scope.splitMobileNumber = function (string, nb) {
            var array = string.split('~');
            var cc = array[0];
            var number = array[1];
            var mNumber = typeof (number) == "undefined" ? string : number;
            //return array[nb];
            return mNumber;
        }

        /* Filter the master list function.*/
        $scope.filterInstitutionList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = ($scope.searchquery.toLowerCase());
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
            }
            else {
                //$scope.rowCollectionFilter = $ff($scope.UserDetailsList, function (value) {
                //    return angular.lowercase(value.InstitutionName).match(searchstring) ||
                //        angular.lowercase(value.FullName).match(searchstring) ||
                //        angular.lowercase(value.Department_Name).match(searchstring) ||
                //        angular.lowercase(value.EMAILID).match(searchstring) ||
                //        angular.lowercase(value.EMPLOYEMENTNO).match(searchstring);
                //});
                if ($scope.filter_SASearchFieldId == "0") {
                    toastr.warning("Please select Search Field", "Warning");
                } else {
                    if ($scope.filter_SASearchFieldId == "1") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.PATIENT_ID != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.PATIENT_ID.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "2") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.NATIONALID != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.NATIONALID.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "3") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.FirstName != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.FirstName.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "4") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.LastName != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.LastName.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "5") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.INSURANCEID != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.INSURANCEID.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "6") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.EMAILID != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.EMAILID.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "7") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.MOBILE_NO != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.MOBILE_NO.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "8") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.MNR_NO != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.MNR_NO.toLowerCase()).match(searchstring));
                    } else if ($scope.filter_SASearchFieldId == "9") {
                        var NotNull_User = $scope.UserDetailsList.filter(x => x.EMPLOYEMENTNO != null);
                        $scope.rowCollectionFilter = NotNull_User.filter(x => (x.EMPLOYEMENTNO.toLowerCase()).match(searchstring));
                    }
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                }
            }
        }

        $scope.filterBusinessList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = ($scope.Business_Usersearchquery.toLowerCase());
            if ($scope.Business_Usersearchquery == "") {
                $scope.BusinessUserFilter = angular.copy($scope.BusinessUserList);
            }
            else {
                if ($scope.filter_CL_SearchFieldId == "0") {
                    toastr.warning("Please select Search Field", "Warning");
                    //$scope.BusinessUserFilter = $ff($scope.BusinessUserList, function (value) {
                    //    return angular.lowercase(value.FullName).match(searchstring) ||
                    //        angular.lowercase(value.EMAILID).match(searchstring) ||
                    //        angular.lowercase(value.Department_Name).match(searchstring) ||
                    //        angular.lowercase(value.EMPLOYEMENTNO).match(searchstring) ||
                    //        angular.lowercase(value.UserName).match(searchstring) ||
                    //        angular.lowercase(value.GroupName).match(searchstring);
                    //});
                } else if ($scope.filter_CL_SearchFieldId == "1") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.EMPLOYEMENTNO != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.EMPLOYEMENTNO.toLowerCase()).match(searchstring));
                } else if ($scope.filter_CL_SearchFieldId == "2") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.Department_Name != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.Department_Name.toLowerCase()).match(searchstring));
                } else if ($scope.filter_CL_SearchFieldId == "3") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.FirstName != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.FirstName.toLowerCase()).match(searchstring));
                } else if ($scope.filter_CL_SearchFieldId == "4") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.LastName != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.LastName.toLowerCase()).match(searchstring));
                } else if ($scope.filter_CL_SearchFieldId == "5") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.HEALTH_LICENSE != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.HEALTH_LICENSE.toLowerCase()).match(searchstring));
                } else if ($scope.filter_CL_SearchFieldId == "6") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.EMAILID != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.EMAILID.toLowerCase()).match(searchstring));
                } else if ($scope.filter_CL_SearchFieldId == "7") {
                    var NotNull_User = $scope.BusinessUserList.filter(x => x.MOBILE_NO != null);
                    $scope.BusinessUserFilter = NotNull_User.filter(x => (x.MOBILE_NO.toLowerCase()).match(searchstring));
                }
                if ($scope.BusinessUserFilter.length > 0) {
                    $scope.BusinessUserflag = 1;
                }
                else {
                    $scope.BusinessUserflag = 0;
                }
            }
        }

        $scope.CareCoordinator_AdvanceFilter = function () {            
            $scope.filter_CL_UserType1 = $("#filter_CL_UserType").val();
            $scope.Filter_CL_Nationality1 = $("#Filter_CL_Nationality").val();
            var ustype = [], usgroup = [], usnation = [];
            if ($scope.filter_CL_UserType1 != "0" && $scope.filter_CL_Group != "" && $scope.Filter_CL_Nationality1 != "0") {
                var NotNull_User = $scope.BusinessUserList.filter(x => x.UserType_Id != null);
                ustype = NotNull_User.filter(x => x.UserType_Id == parseInt($scope.filter_CL_UserType1) && x.GroupName.toString().includes($scope.filter_CL_Group) && x.NATIONALITY_ID == parseInt($scope.Filter_CL_Nationality1));
            }
            else if ($scope.filter_CL_UserType1 != "0" && $scope.filter_CL_Group != "") {
                var NotNull_User = $scope.BusinessUserList.filter(x => x.GroupName != null);
                //usgroup = NotNull_User.filter(x => angular.lowercase(x.GroupName).match($scope.filter_CL_Group));
                usgroup = NotNull_User.filter(x => x.UserType_Id == parseInt($scope.filter_CL_UserType1) && x.GroupName.toString().includes($scope.filter_CL_Group));
            }
            else if ($scope.filter_CL_UserType1 != "0" && $scope.Filter_CL_Nationality1 != "0") {
                var NotNull_User = $scope.BusinessUserList.filter(x => x.NATIONALITY_ID != null);
                usnation = NotNull_User.filter(x => x.UserType_Id == parseInt($scope.filter_CL_UserType1) && x.NATIONALITY_ID == parseInt($scope.Filter_CL_Nationality1));
            }
            else if ($scope.filter_CL_UserType1 != "0") {
                var NotNull_User = $scope.BusinessUserList.filter(x => x.UserType_Id != null);
                ustype = NotNull_User.filter(x => x.UserType_Id == parseInt($scope.filter_CL_UserType1));
            }
            else if ($scope.filter_CL_Group != "") {
                var NotNull_User = $scope.BusinessUserList.filter(x => x.GroupName != null);
                //usgroup = NotNull_User.filter(x => angular.lowercase(x.GroupName).match($scope.filter_CL_Group));
                usgroup = NotNull_User.filter(x => x.GroupName.toString().includes($scope.filter_CL_Group));
            }
            else if ($scope.Filter_CL_Nationality1 != "0") {
                var NotNull_User = $scope.BusinessUserList.filter(x => x.NATIONALITY_ID != null);
                usnation = NotNull_User.filter(x => x.NATIONALITY_ID == parseInt($scope.Filter_CL_Nationality1));
            }
            var fil = [];
            $scope.BusinessUserFilter = fil.concat(ustype, usgroup, usnation);
            if ($scope.BusinessUserFilter.length > 0) {
                $scope.BusinessUserflag = 1;
            }
            else {
                $scope.BusinessUserflag = 0;
            }
        }

        $scope.PatientSearch = function () {
            $scope.PageStart = 1;
            $scope.PageEnd = 20;
            if ($scope.Patientsearchquery == "") {
                allpatientlist();
            } else {
                if ($scope.filter_SearchFieldId == "0") {
                    toastr.warning("Please select Search Field", "Warning");
                } else {
                    if ($scope.filter_SearchFieldId == "1") {
                        $scope.Filter_PatientNo2 = $scope.Patientsearchquery;
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "2") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = $scope.Patientsearchquery;
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "3") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = $scope.Patientsearchquery;
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "4") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = $scope.Patientsearchquery;
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "5") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = $scope.Patientsearchquery;
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "6") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = $scope.Patientsearchquery;
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "7") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = $scope.Patientsearchquery;
                        $scope.Filter_MRN2 = "";
                    } else if ($scope.filter_SearchFieldId == "8") {
                        $scope.Filter_PatientNo2 = "";
                        $scope.filter_NationalityId2 = "";
                        $scope.Filter_FirstName2 = "";
                        $scope.Filter_LastName2 = "";
                        $scope.filter_InsuranceId2 = "";
                        $scope.filter_Email2 = "";
                        $scope.filter_MOBILE_NO2 = "";
                        $scope.Filter_MRN2 = $scope.Patientsearchquery;
                    } else {
                        $scope.Filter_PatientNo2 = $scope.Patientsearchquery;
                        $scope.filter_NationalityId2 = $scope.Patientsearchquery;
                        $scope.Filter_FirstName2 = $scope.Patientsearchquery;
                        $scope.Filter_LastName2 = $scope.Patientsearchquery;
                        $scope.filter_InsuranceId2 = $scope.Patientsearchquery;
                        $scope.filter_Email2 = $scope.Patientsearchquery;
                        $scope.filter_MOBILE_NO2 = $scope.Patientsearchquery;
                        $scope.Filter_MRN2 = $scope.Patientsearchquery;
                    }
                    $scope.Patient_Search = 0;
                    getallpatientlist();
                }
            }
        }

        $scope.PatientAdvanceSearch = function () {
            $scope.Filter_PatientNo2 = $scope.Filter_PatientNo;
            $scope.filter_NationalityId2 = $scope.filter_NationalityId;
            $scope.Filter_FirstName2 = $scope.Filter_FirstName;
            $scope.Filter_LastName2 = $scope.Filter_LastName;
            $scope.filter_InsuranceId2 = $scope.filter_InsuranceId;
            $scope.filter_Email2 = $scope.filter_Email;
            $scope.filter_MOBILE_NO2 = $scope.filter_MOBILE_NO;
            $scope.Filter_MRN2 = $scope.Filter_MRN;
            $scope.Patient_Search = 1;
            getallpatientlist();
        }

        getallpatientlist = function () {
            $("#chatLoaderPV").show();
            $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
            $http.get(baseUrl + '/api/User/Search_Patient_List?IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId'] + '&SearchQuery=' + $scope.Patientsearchquery + '&PATIENTNO=' + $scope.Filter_PatientNo2
                + '&INSURANCEID=' + $scope.filter_InsuranceId2 + '&NATIONALITY_ID=' + $scope.filter_NationalityId2 + '&MOBILE_NO=' +
                $scope.filter_MOBILE_NO2 + '&EMAILID=' + $scope.filter_Email2 + '&FIRSTNAME=' + $scope.Filter_FirstName2 + '&LASTNAME=' + $scope.Filter_LastName2 + '&MRNNO=' + $scope.Filter_MRN2 + '&StartRowNumber=' + $scope.PageStart +
                '&EndRowNumber=' + $scope.PageEnd + '&AdvanceFilter=' + $scope.Patient_Search).then(function (response) {
                    $("#chatLoaderPV").hide();
                    if (response.data.length == 0) {
                        $scope.SearchMsg = "No Data Available";
                    }
                    $scope.Patientemptydata = [];
                    $scope.PatientList = [];
                    $scope.PatientList = response.data;
                    $scope.Patientemptydata = response.data;                    
                    if ($scope.PatientList.length > 0) {
                        $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                        $scope.total_pages = Math.ceil(($scope.PatientCount) / ($scope.page_size));
                    } else {
                        $scope.PatientCount =0;
                        $scope.total_pages = 0;
                    }
                });
        }

        //getallpatientlist();

        $scope.Eligibility_Logs_List = function () {
            var DatetimepickerdtToday = new Date();
            var Datetimepickermonth = DatetimepickerdtToday.getMonth() + 1;
            var Datetimepickerday = DatetimepickerdtToday.getDate();
            var Datetimepickeryear = DatetimepickerdtToday.getFullYear();
            if (Datetimepickermonth < 10)
                Datetimepickermonth = '0' + Datetimepickermonth.toString();
            if (Datetimepickerday < 10)
                Datetimepickerday = '0' + Datetimepickerday.toString();
            var DatetimepickermaxDate = Datetimepickeryear + '-' + Datetimepickermonth + '-' + Datetimepickerday;
            $scope.SearchDate = new Date(DatetimepickermaxDate);
            $scope.SearchEndDate = new Date(DatetimepickermaxDate);
            $('#ddlsearchfield').val('');
            $("#chatLoaderPV").show();
            $scope.CCCG_DetailsList = [];
            $http.get(baseUrl + 'api/EligibilityLogs/Eligibility_Logs_List_With_Patient/?InstitutionId=' + $scope.InstituteId + "&Patient_Id=" + $scope.Id).then(function (response) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = response.data;
                $scope.CCCG_DetailsList = response.data;
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
                $scope.SearchMsg = "No Data Available";
            }
            // $("#chatLoaderPV").hide();
        }

        $scope.Eligibility_Logs_Filters = function () {
            var sDate = new Date($scope.SearchDate).getFullYear().toString() + '-' + (((new Date($scope.SearchDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchDate).getDate().toString().length > 1) ? new Date($scope.SearchDate).getDate().toString() : ('0' + new Date($scope.SearchDate).getDate().toString()))
            var eDate = new Date($scope.SearchEndDate).getFullYear().toString() + '-' + (((new Date($scope.SearchEndDate).getMonth() + 1).toString().length > 1) ? (new Date($scope.SearchEndDate).getMonth() + 1).toString() : ('0' + (new Date($scope.SearchEndDate).getMonth() + 1).toString())) + '-' + ((new Date($scope.SearchEndDate).getDate().toString().length > 1) ? new Date($scope.SearchEndDate).getDate().toString() : ('0' + new Date($scope.SearchEndDate).getDate().toString()))
            if (sDate > eDate) {
                toastr.warning("Start Date should be Lesser than End date", "warning");
                return false;
            }
            $scope.Eligibility_Status = $('#ddlsearchfield').val();
            if ($scope.Eligibility_Status == 0) {
                toastr.warning("Please Select Eligibility Status", "warning");
                return;
            }
            $("#chatLoaderPV").show();
            $scope.CCCG_DetailsList = [];
            $http.get(baseUrl + 'api/EligibilityLogs/Eligibility_Logs_With_Patient_Filters/?InstitutionId=' + $scope.InstituteId + "&Patient_Id=" + $scope.Id + "&sDate=" + sDate + "&eDate=" + eDate + "&EligibilityStatus=" + $scope.Eligibility_Status + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                $("#chatLoaderPV").hide();
                $scope.rowCollectionFilter = response.data;
                $scope.CCCG_DetailsList = response.data;
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
                $scope.SearchMsg = "No Data Available";
            }
            // $("#chatLoaderPV").hide();
        }

        //select on Change load -userslist
        $scope.SearchByUserID = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/UsersLog/Admin_Userslog_List/?Institution_Id=' + $scope.InstituteId + "&login_session_id=" + $scope.LoginSessionId + "&User_Id=" + $scope.SelectedCCCG).then(function (response) {
                $scope.emptydata = [];
                $scope.UserDetailsList = [];
                $scope.UserDetailsList = response.data;
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                    $scope.SearchMsg = "No Data Available";
                }
                $("#chatLoaderPV").hide();
            });
        }


        /* Filter the master list function.*/
        $scope.PatientFilterChange = function () {
            //$scope.ResultListFiltered = [];
            //var searchstring = angular.lowercase($scope.Patientsearchquery);
            //if ($scope.Patientsearchquery == "") {
            //    $scope.PatientListFilter = angular.copy($scope.PatientList);
            //}
            //else {
            //    $scope.PatientListFilter = $ff($scope.PatientList, function (value) {
            //        return angular.lowercase(value.MNR_NO).match(searchstring) ||
            //            angular.lowercase(value.FullName).match(searchstring) ||
            //            angular.lowercase(value.MOBILE_NO).match(searchstring) ||
            //            angular.lowercase(value.EMAILID).match(searchstring) ||
            //            angular.lowercase(value.GroupName == null ? "" : value.GroupName).match(searchstring);
            //    });
            //    if ($scope.PatientListFilter.length > 0) {
            //        $scope.Patientflag = 1;
            //    }
            //    else {
            //        $scope.Patientflag = 0;
            //    }
            //}
            $("#chatLoaderPV").show();
            $scope.Patientemptydata = [];
            $scope.Patient_List(3);
        }
        $scope.Adminimageclear = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.AdmingetBase64Image_Clear();
        };

        $scope.Editclearimage = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
        }

        $scope.imageclear = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.getBase64Image_clear();
        };

        $scope.imageclearPatient = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.PatientgetBase64Image_Profile();
        };

        $scope.imageclearPatientNational = function () {
            $scope.NationalPhoto = "";
            $scope.NationalPhotoFilename = "";
            $scope.uploadme1 = "";
            $scope.NationalFileName = []; 
            $scope.Nationalityresumedoc = [];
            $scope.NationalUploadme = [];
            $('#NationalLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.Nationaluploadview = false;
            $scope.NationalPhotoValue = 0;
            $scope.PatientgetBase64Image_National();
        };

        $scope.imageclearPatientUID = function () {
            $scope.UIDLogo = [];
            $scope.UIDFileName = [];
            $scope.UIDshow = [];
            $scope.UIdPhotoFilename = "";
            $scope.uploadme3 = "";
            $('#UIDLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.UIDuploadview = false;
            $scope.UIDPhotoValue = 0;
            $scope.PatientgetBase64Image_UID();
        };
        $scope.imageclearPatientInsurance = function () {
            $scope.InsurancePhoto = "";
            $scope.InsurancePhotoFilename = "";
            $scope.uploadme2 = "";
            $('#InsuranceLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.Insuranceuploadview = false;
            $scope.InsurancePhotoValue = 0;
            $scope.PatientgetBase64Image_Insurance();
        };

        /* Read file name for the  Photo and file */
        /*$scope.Editfile=[]*/
        $scope.EditdocfileChange = function (e) {
            if ($('#EditDocument')[0].files[0] != undefined) {
                $scope.CertificateFileName = $('#EditDocument')[0].files[0]['name'];
                $scope.FileType = $('#EditDocument')[0].files[0]['type'];
            }
            //$scope.Editfile = []
            //$scope.Editfile.push(e.files[0])
        }

        /*This is for getting a file url for uploading the url into the database*/
            $scope.dataURItoBlob = function (dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {
                    type: mimeString
                });
        }

        $scope.files = [];
        /* Read file name for the  National Photo and file */
        $scope.NationalphotoChange = function (e) {
            if (e.files.length <= 4) {
                let maxSize = (2  * 1024) * 1024;
                let fileSize = 0; 
                let filesizewarn = 0;
                $scope.Nationalityresumedoc = [];
                $scope.NationalPhoto = "";
            $scope.uploadme1 = "";
            $('#NationalLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview3 = false;
            photoview2 = false;
            $scope.Nationaluploadview = false;
            $scope.NationalPhotoValue = 0;
                photoview1 = false;
                for (var i = 0; i < e.files.length; i++) {
                    fileSize = e.files[i].size; 
                    if (fileSize >= maxSize) {
                        $scope.fileexceed = "Each Image size exceeds 2 MB";               
                        filesizewarn = 1;
                    }                   
                }
                if (filesizewarn == 0) {
                    for (var i = 0; i < e.files.length; i++) {
                        $scope.Nationalityresumedoc.push(e.files[i])
                    }
                    //$scope.UIDshow = [];
                    //$scope.UIDshow = '';
                } else {
                    toastr.warning($scope.fileexceed, "File Size");
                }
            } 
            else { 
                toastr.warning("Maximum 4 images should be allowed", "Files Count");
                $scope.NationalUploadme = [];
            }
           
        }
        $scope.UIDfileChange = function (e) {
            if (e.files.length <= 4) {
                let maxSize = (2 * 1024) * 1024;
                let fileSize = 0;
                let filesizewarn = 0;
                $scope.UIDshow = [];
                $scope.uploadme3 = "";
                photoview1 = true;
                for (var i = 0; i < e.files.length; i++) {
                    fileSize = e.files[i].size;
                    if (fileSize >= maxSize) {
                        $scope.fileexceed = "Each Image size exceeds 2 MB";
                        filesizewarn = 1;
                    }
                }
                if (filesizewarn == 0) {
                    for (var i = 0; i < e.files.length; i++) {
                        $scope.UIDshow.push(e.files[i])
                    }
                    //$scope.Nationalityresumedoc = [];
                    //$scope.Nationalityresumedoc = '';
                } else {
                    toastr.warning($scope.fileexceed, "File Size");
                }
            }
            else {
                toastr.warning("Maximum 4 images should be allowed", "Files Count");
                $scope.UIDLogo = [];
            }
        }
        /* Read file name for the  National Photo and file */
        $scope.InsurancephotoChange = function () {
            if ($('#InsuranceLogo')[0].files[0] != undefined) {
                $scope.InsurancePhotoFilename = $('#InsuranceLogo')[0].files[0]['name'];
            }
        }

        /* Read file name for the  Photo and file */
        $scope.photoChange = function () {
            if ($('#UserLogo')[0].files[0] != undefined) {
                $scope.FileName = $('#UserLogo')[0].files[0]['name'];
            }
        }

        //this is for image upload function//
        $scope.uploadImage = function (Photo) {
            var filename = "";
            //var fd = new FormData();
            if ($('#UserLogo')[0].files[0] != undefined) {
                FileName = $('#UserLogo')[0].files[0]['name'];
            }
        }

        $scope.User_Admin_AddEdit_Validations = function () {
            if ($scope.MenuTypeId == 1 || $scope.MenuTypeId == 2) {
                if (($scope.MenuTypeId == 1) && (($scope.InstitutionId) == "undefined" || $scope.InstitutionId == "0")) {
                    //alert("Please select Institution");
                    toastr.warning("Please select Institution", "Warning");
                    $("#chatLoaderPV").hide();
                    return false;
                }
                else if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                    //alert("Please enter First Name");
                    toastr.warning("Please enter First Name", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                    //alert("Please enter Last Name");
                    toastr.warning("Please enter Last Name", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if ((typeof ($scope.Employee_No) == "undefined" || $scope.Employee_No == "") && $scope.LoginType != "1" && $scope.LoginType != "3") {
                    toastr.warning("Please enter Employment No.", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if ((typeof ($scope.GenderId1) == "undefined" || $scope.GenderId1 == "0") && $scope.LoginType != "1" && $scope.LoginType != "3") {
                    toastr.warning("Please select Gender", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if ((typeof ($scope.DepartmentId1) == "undefined" || $scope.DepartmentId1 == "0") && $scope.LoginType != "1" && $scope.LoginType != "3") {
                    toastr.warning("Please select Department", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                    //alert("Please enter Email");
                    toastr.warning("Please enter Email", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (EmailFormate($scope.EmailId) == false) {
                    //alert("Invalid email format");
                    toastr.warning("Invalid email format", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                    //alert("Please enter Mobile No.");
                    toastr.warning("Please enter Mobile No.", "Warning");
                    $("#chatLoaderPV").hide();
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }

                if ($scope.uploadme != "" && $scope.uploadme != null) {
                    $scope.Image = filetype = $scope.uploadme.split(',')[0].split(':')[1].split(';')[0];
                    $scope.filetype = $scope.Image.split("/");
                    var fileval = 0;
                    var fileExtenstion = "";
                    if ($scope.filetype.length > 0) {
                        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                    }
                    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico") {// check more condition with MIME type                      
                        fileval = 1;
                    }
                    else {
                        fileval = 2;
                    }
                    if (fileval == 2) {
                        //alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico");
                        toastr.warning("Please choose files of type jpeg/jpg/png/bmp/gif/ico", "warning");
                        $("#chatLoaderPV").hide();
                        return false;
                    }
                }
            }
            if ($scope.MenuTypeId == 2) {
                $scope.DOB = DateFormatEdit($filter('date')(document.getElementById("Date_Birth").value, "dd-MMM-yyyy"));
                if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                    //alert("Please select Type of User");
                    toastr.warning("Please select Type of User", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.Health_License) == "undefined" || $scope.Health_License == "") {
                    //alert("Please enter Health License under Additional Info");
                    toastr.warning("Please enter Health License under Additional Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 2;
                    return false;
                }
                //else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                //    //alert("Please select Nationality under Additional Info");
                //    toastr.warning("Please select Nationality under Additional Info", "warning");
                //    $("#chatLoaderPV").hide();
                //    $scope.currentTab = 2;
                //    return false;
                //}
                else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "" || $scope.DOB == 'yyyy-mm-dd') {
                    //alert("Please select Date of Birth under Additional info");
                    toastr.warning("Please select Date of Birth under Additional info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.DOB = DateFormatEdit($scope.DOB, "dd-MMM-yyyy");
                    $scope.currentTab = 2;
                    return false;
                }
                //else if (isDate($scope.DOB) == false) {
                //    alert("Date of Birth is in Invalid format, please enter dd-mm-yyyy");
                //    $scope.currentTab = 2;
                //    return false;
                //}
                else if ($scope.AgeRestrictioncalculation() == false) {
                    //alert("Age should be more than " + $scope.JAge + " years.Please enter a valid Date of Birth");
                    toastr.warning("Age should be more than " + $scope.JAge + " years.Please enter a valid Date of Birth", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.CountryId1) == "undefined" || $scope.CountryId1 == "0") {
                    //alert("Please select Country under Address Info");
                    toastr.warning("Please select Country under Address Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.StateId1) == "undefined" || $scope.StateId1 == "0") {
                    //alert("Please select State under Address Info");
                    toastr.warning("Please select State under Address Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.CityId1) == "undefined" || $scope.CityId1 == "0") {
                    //alert("Please select City under Address Info");
                    toastr.warning("Please select City under Address Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 3;
                    return false;
                }

                if ($scope.CertificateFileName != "") {
                    var fileval = 0;
                    $scope.filetype = $scope.CertificateFileName.split(".");
                    var fileExtenstion = "";
                    if ($scope.filetype.length > 0) {
                        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                    }
                    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico"
                        || fileExtenstion.toLocaleLowerCase() == "pdf" || fileExtenstion.toLocaleLowerCase() == "xls" || fileExtenstion.toLocaleLowerCase() == "xlsx"
                        || fileExtenstion.toLocaleLowerCase() == "doc" || fileExtenstion.toLocaleLowerCase() == "docx" || fileExtenstion.toLocaleLowerCase() == "odt"
                        || fileExtenstion.toLocaleLowerCase() == "txt" || fileExtenstion.toLocaleLowerCase() == "pptx" || fileExtenstion.toLocaleLowerCase() == "ppt"
                        || fileExtenstion.toLocaleLowerCase() == "rtf" || fileExtenstion.toLocaleLowerCase() == "tex"
                    ) {// check more condition with MIME type                      
                        fileval = 1;
                    }
                    else {
                        fileval = 2;
                    }
                    if (fileval == 2) {
                        //alert("Please choose jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex file.");
                        toastr.warning("Please choose jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex file.", "warning");
                        $("#chatLoaderPV").hide();
                        return false;
                    }
                }
            }
            if ($scope.MenuTypeId == 3) {
                //$scope.ExpiryDate = DateFormatEdit($filter('date')(document.getElementById("Expiry_Date").value, "dd-MMM-yyyy"));
                //$scope.DOB = DateFormatEdit($filter('date')(document.getElementById("Date_Birth").value, "dd-MMM-yyyy"));
                if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                    //alert("Please enter First Name");
                    toastr.warning("Please enter First Name", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                    //alert("Please enter Last Name");
                    toastr.warning("Please enter Last Name", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.GenderId1) == "undefined" || $scope.GenderId1 == "0") {
                    //alert("Please select Gender");
                    toastr.warning("Please select Gender", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                //else if (typeof ($scope.MNR_No) == "undefined" || $scope.MNR_No == "") {
                //    alert("Please enter MNR No.");
                //    $scope.currentTab = 1;
                //    return false;
                //}
                //else if (typeof ($scope.InsuranceId) == "undefined" || $scope.InsuranceId == "") {
                //    //alert("Please enter Insurance ID");
                //    toastr.warning("Please enter Insurance ID", "warning");
                //    $("#chatLoaderPV").hide();
                //    $scope.currentTab = 1;
                //    return false;
                //}
                else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                    //alert("Please enter Email");
                    toastr.warning("Please enter Email", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.EmailId) == false) {
                    //alert("Invalid email format");
                    toastr.warning("Invalid email format", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.Google_EmailId) == false) {
                    //alert("Invalid Google Email format");
                    toastr.warning("Invalid Google Email format", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.FB_EmailId) == false) {
                    //alert("Invalid Facebook Email format");
                    toastr.warning("Invalid Facebook Email format", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                } else if (EmailFormate($scope.appleUserID) == false) {
                    //alert("Invalid Apple Email format");
                    toastr.warning("Invalid Apple Email format", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                    //alert("Please enter Mobile No.");
                    toastr.warning("Please enter Mobile No.", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.MaritalStatusId1) == "undefined" || $scope.MaritalStatusId1 == "0") {
                    //alert("Please select Marital Status under Additional Info");
                    toastr.warning("Please select Marital Status under Additional Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.BloodGroupId1) == "undefined" || $scope.BloodGroupId1 == "0") {
                    //alert("Please select Blood Group under Additional Info");
                    toastr.warning("Please select Blood Group under Additional Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.EthnicGroupId1) == "undefined" || $scope.EthnicGroupId1 == "0") {
                    //alert("Please select Ethnic Group under Additional Info");
                    toastr.warning("Please select Ethnic Group under Additional Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "" || $scope.DOB == null || $scope.DOB == 'yyyy-mm-dd') {
                    //alert("Please select Date of Birth under Additional info");
                    toastr.warning("Please select Date of Birth under Additional info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.DOB = DateFormatEdit($scope.DOB, "dd-MMM-yyyy");
                    $scope.currentTab = 2;
                    return false;
                }
                //else if (isDate($scope.DOB) == false) {
                //    alert("Date of Birth is in Invalid format, please enter dd-mm-yyyy");
                //    $scope.currentTab = 2;
                //    return false;
                //}
                else if ($scope.AgeRestrictioncalculation() == false) {
                    //alert("Age should be more than " + $scope.JAge + " years.Please enter a valid Date of Birth");
                    toastr.warning("Age should be more than " + $scope.JAge + " years.Please enter a valid Date of Birth", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.CountryId1) == "undefined" || $scope.CountryId1 == "0") {
                    //alert("Please select Country under Address Info");
                    toastr.warning("Please select Country under Address Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.StateId1) == "undefined" || $scope.StateId1 == "0") {
                    //alert("Please select State under Address Info");
                    toastr.warning("Please select State under Address Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.CityId1) == "undefined" || $scope.CityId1 == "0") {
                    //alert("Please select City under Address Info");
                    toastr.warning("Please select City under Address Info", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 3;
                    return false;
                } else if ($scope.NationalId == "" && $scope.UID == "" && $scope.ProductName == "MyHealth") {
                    //alert("Please select Date of Birth");
                    toastr.warning("Please Enter Emirates ID or UID", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 7;
                    return false;
                }
                else if ($scope.Nationalityresumedoc.length == 0 && $scope.UIDshow.length == 0 && $scope.ProductName == "MyHealth") {
                    //alert("Please select Date of Birth");
                    toastr.warning("Please Select Emirates or UID Images ", "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 7;
                    return false;
                }
                
                if ($scope.CURRENTLY_TAKEMEDICINE == 1) {
                    if (($ff($scope.AddMedicines, { Status: 1 }).length == 0)) {
                        //alert("Please add atleast one row for Currrently Take Medicine under Medical Info");
                        toastr.warning("Please add atleast one row for Currrently Take Medicine under Medical Info", "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 5;
                        return false;
                    }
                    else {
                        var AMitem = 0;
                        angular.forEach($scope.AddMedicines, function (value, index) {
                            if ((value.MedicineName == null) || (value.MedicineName == undefined) || (value.MedicineName == "")) {
                                AMitem = 1;
                            }
                        });
                        if ($scope.AddMedicines.length < 1 || AMitem == 1) {
                            //alert("Please enter Medicine Name under Medical Info");
                            toastr.warning("Please enter Medicine Name under Medical Info", "warning");
                            $("#chatLoaderPV").hide();
                            $scope.currentTab = 5;
                            return false;
                        }
                    }
                }
                if ($scope.PAST_MEDICALHISTORY == 1 && ($ff($scope.AddMedicalHistory, { Status: 1 }).length > 0)) {
                    var MHitem = 0;
                    angular.forEach($scope.AddMedicalHistory, function (value, index) {
                        if (value.Medical_History == null || value.Medical_History == undefined || value.Medical_History == "") {
                            MHitem = 1;
                        }
                    });
                    if ($scope.AddMedicalHistory.length < 1 || MHitem == 1) {
                        //alert("Please enter Medical History under Medical Info");
                        toastr.warning("Please enter Medical History under Medical Info", "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 5;
                        return false;
                    }
                }
                if ($scope.FAMILYHEALTH_PROBLEMHISTORY == 1) {
                    if (($ff($scope.AddHealthProblem, { Status: 1 }).length == 0)) {
                        //alert("Please add atleast one row for family Health Problem History under Medical Info");
                        toastr.warning("Please add atleast one row for family Health Problem History under Medical Info", "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 5;
                        return false;
                    }
                    else {
                        var Relation_Healthitem = 0;
                        var HealthProb_Item = 0;
                        angular.forEach($ff($scope.AddHealthProblem, { Status: 1 }), function (value, index) {
                            if (value.Relationship_Id == 0 || value.Relationship_Id == undefined || value.Relationship_Id == null) {
                                Relation_Healthitem = 1;
                            }
                            if (value.Health_Problem == null || value.Health_Problem == undefined || value.Health_Problem == "") {
                                HealthProb_Item = 1;
                            }
                        });
                        if ($scope.AddHealthProblem.length < 1 || Relation_Healthitem == 1) {
                            //alert("Please select Relationship under Medical Info");
                            toastr.warning("Please select Relationship under Medical Info", "warning");
                            $("#chatLoaderPV").hide();
                            $scope.currentTab = 5;
                            return false;
                        }
                        if ($scope.AddHealthProblem.length < 1 || HealthProb_Item == 1) {
                            //alert("Please enter Health Problem under Medical Info");
                            toastr.warning("Please enter Health Problem under Medical Info", "warning");
                            $("#chatLoaderPV").hide();
                            $scope.currentTab = 5;
                            return false;
                        }
                    }
                }
                if ($scope.uploadme != "" && $scope.uploadme != null) {
                    $scope.Image = filetype = $scope.uploadme.split(',')[0].split(':')[1].split(';')[0];
                    $scope.filetype = $scope.Image.split("/");
                    var fileval = 0;
                    var fileExtenstion = "";
                    if ($scope.filetype.length > 0) {
                        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                    }
                    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico") {// check more condition with MIME type                      
                        fileval = 1;
                    }
                    else {
                        fileval = 2;
                    }
                    if (fileval == 2) {
                        //alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico");
                        toastr.warning("Please choose files of type jpeg/jpg/png/bmp/gif/ico", "warning");
                        $("#chatLoaderPV").hide();
                        return false;
                    }
                }
            }
            if ($scope.uploadme != "" && $scope.uploadme != null) {
                if ($scope.dataURItoBlob($scope.uploadme).size > $scope.ProfileImageSize) {
                    var alertmsg = "Uploaded Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024 / 1024).toString() + "MB";
                    if ($scope.ProfileImageSize <= 1045504) {
                        alertmsg = "Uploaded Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024).toString() + "KB";
                    }
                    //alert(alertmsg);
                    toastr.warning(alertmsg, "warning");
                    $("#chatLoaderPV").hide();
                    $scope.currentTab = 1;
                    return false;
                }
            }

            if ($scope.uploadme1 != "" && $scope.uploadme1 != null) {
                if ($scope.NatUploadme != '../../Images/National_Male.png') {
                    if ($scope.dataURItoBlob($scope.uploadme1).size > $scope.ProfileImageSize) {
                        var alertmsg = "Uploaded National Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024 / 1024).toString() + "MB";
                        if ($scope.ProfileImageSize <= 1045504) {
                            alertmsg = "Uploaded National Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024).toString() + "KB";
                        }
                        //alert(alertmsg);
                        toastr.warning(alertmsg, "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 7;
                        return false;
                    }
                }
            }

            if ($scope.uploadme3 != "" && $scope.uploadme3 != null) {
                if ($scope.UIDUploadme != '../../Images/National_Male.png') {
                    if ($scope.dataURItoBlob($scope.uploadme3).size > $scope.ProfileImageSize) {
                        var alertmsg = "Uploaded National Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024 / 1024).toString() + "MB";
                        if ($scope.ProfileImageSize <= 1045504) {
                            alertmsg = "Uploaded National Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024).toString() + "KB";
                        }
                        //alert(alertmsg);
                        toastr.warning(alertmsg, "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 7;
                        return false;
                    }
                }
            }
            if ($scope.uploadme2 != "" && $scope.uploadme2 != null) {
                if ($scope.INSUploadme != '../../Images/National_Male.png') {
                    if ($scope.dataURItoBlob($scope.uploadme2).size > $scope.ProfileImageSize) {
                        var alertmsg = "Uploaded Insurance Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024 / 1024).toString() + "MB";
                        if ($scope.ProfileImageSize <= 1045504) {
                            alertmsg = "Uploaded Insurance Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024).toString() + "KB";
                        }
                        //alert(alertmsg);
                        toastr.warning(alertmsg, "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 6;
                        return false;
                    }
                }
            }

            if ($scope.Editresumedoc != null) {
                if ($scope.Editresumedoc != undefined && $scope.Editresumedoc != null && $scope.Editresumedoc != "") {
                    if ($scope.dataURItoBlob($scope.Editresumedoc).size > 1048576) {
                        //alert("Certificate file size cannot be greater than 1MB");
                        toastr.warning("Certificate file size cannot be greater than 1MB", "warning");
                        $("#chatLoaderPV").hide();
                        $scope.currentTab = 5;
                        return false;
                    }
                }
            }
            return true;
        }

        $scope.AgeRestictLimit = function () {
            $scope.JAge = 18;
            var deferred = $q.defer();

            if ($scope.MenuTypeId == 2)
                $scope.ConfigCode = "BUSINESS_USER_MIN_AGE";
            else if ($scope.MenuTypeId == 3)
                $scope.ConfigCode = "PATIENT_MIN_AGE";

            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).then(function (response) {
                if (response.data[0] != undefined) {
                    $scope.JAge = parseInt(response.data[0].ConfigValue);
                }
                deferred.resolve($scope.JAge);
            });
            return deferred.promise;
        };

        //$scope.AgeRestrictioncalculation = function () {
        //    $scope.Today_Date = $filter('date')(new Date(), 'DD-MMM-YYYY');
        //    $scope.Join_Day = moment(ParseDate($scope.Today_Date).subtract($scope.JAge, 'years')).format("DD-MMM-YYYY");
        //    if ((ParseDate($scope.DOB)) > (ParseDate($scope.Join_Day))) {
        //        return false;
        //    }
        //    return true;
        //};
        $scope.AgeRestrictioncalculation = function () {
            $scope.Today_Date = $filter('date')(new Date(), 'dd-MMM-yyyy');
            $scope.Join_Day = moment(ParseDate($scope.Today_Date).subtract($scope.JAge, 'years')).format("DD-MMM-YYYY");
            $scope.DOB = moment($scope.DOB).format('DD-MMM-YYYY');
            if ((ParseDate($scope.DOB)) > (ParseDate($scope.Join_Day))) {
                $scope.DOB = DateFormatEdit($scope.DOB, "dd-MMM-yyyy");
                return false;
            }
            $scope.DOB = DateFormatEdit($scope.DOB, "dd-MMM-yyyy");
            return true;
        };
        //$scope.Country_onChange = function () {
        //    $scope.StateNameList = [];            
        //    $scope.StateNameList = $ff($scope.StateList, { CountryId: $scope.CountryId });
        //};
        //$scope.StateClearFunction = function () {
        //    $scope.StateId = "0";
        //    $scope.CityId = "0";
        //};
        //$scope.State_onChange = function () {
        //    $scope.CityNameList = [];
        //    $scope.CityNameList = $ff($scope.LocationList, { StateId: $scope.StateId });
        //};
        //$scope.LocationClearFunction = function () {
        //    $scope.CityId = "0";
        //};
        $scope.PatientView = function () {
            $scope.PatientMenu = $scope.MenuTypeId;
            $scope.EditPatientChronicCondition = 0;
            $scope.EditPatientChronic = function () {
                $scope.EditPatientChronicCondition = 1;
                $http.get(baseUrl + '/api/Common/ChronicConditionList/').then(function (resp_cc_data) {
                    $scope.ChronicConditionList = resp_cc_data.data;
                });
            }
            $scope.EditPatientGroupId = 0;
            $scope.GroupTypeList = [];
            $scope.EditPatientGroup = function () {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                    $scope.GroupTypeList = response.data;
                });
                $("#chatLoaderPV").hide();
                $scope.EditPatientGroupId = 1;
            }
            $scope.EditSavePatientgroup = function (SelectedGroup) {
                $("#chatLoaderPV").show();
                $scope.PatientGroupDetails_List = [];
                angular.forEach(SelectedGroup, function (value, index) {
                    var obj = {
                        Id: 0,
                        Group_Id: value
                    }
                    $scope.PatientGroupDetails_List.push(obj);
                });
                var obj1 = {
                    EditSelectedGroupList: $scope.PatientGroupDetails_List,
                    GroupTypeList: $scope.GroupTypeList,
                    UserId: $scope.Id,
                    CreatedBy: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/User/PatientGroupEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj1).then(function (response) {
                    $("#chatLoaderPV").hide();
                    if (response.data == 1) {
                        $scope.EditPatientGroupId = 0;
                        $scope.Admin_View($scope.PatientMenu);
                    }
                    if (response.data == 0) {
                        alert("Nothing Happened")
                    }
                });
            }
            $scope.SelectedChronicConditionEdit = "0";
            $scope.EditSavePatientChronic = function (SelectedChronicConditionEdit) {
                $("#chatLoaderPV").show();
                $scope.PatientEditChronicCondition_List = [];
                $scope.PatientMenu = $scope.MenuTypeId;
                angular.forEach(SelectedChronicConditionEdit, function (value, index) {
                    var obj = {
                        Id: 0,
                        Chronic_Id: value
                    }
                    $scope.PatientEditChronicCondition_List.push(obj);
                });
                var obj1 = {
                    EditSelectedChronicCondition: $scope.PatientEditChronicCondition_List,
                    ChronicConditionList: $scope.ChronicConditionList,
                    UserId: $scope.Id,
                    CreatedBy: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/User/PatientChronicEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj1).then(function (response) {
                    $("#chatLoaderPV").hide();
                    if (response.data == 1) {
                        $scope.EditPatientChronicCondition = 0;
                        $scope.Admin_View($scope.PatientMenu);
                    }
                });
            }
        }
        $scope.Admin_View = function (MenuType) {
            $("#chatLoaderPV").show();
            $scope.ChronicConditionList = [];
            if (($scope.LoginType == 3 || $scope.LoginType == 2) && $scope.EditParameter == 4) {
                $scope.DropDownListValue = 4;
            }
            $http.get(baseUrl + 'api/User/AllergyTypeList/?Institution_Id=' + $scope.InstituteId).then(function (resp_allergy_data) {
                $scope.AlergySubstanceList = resp_allergy_data.data;
            })
            $http.get(baseUrl + '/api/Common/ScheduleList/').then(function (resp_schedule_data) {
                $scope.ScheduleList = resp_schedule_data.data;
            });
            $http.get(baseUrl + '/api/Common/OptionTypeList/').then(function (resp_option_data) {
                $scope.OptionTypeList = resp_option_data.data;
            });
            // $scope.DropDownListValues();

     
            //Load Patient Dropdown lists
            $scope.LoadGenderList();
            $scope.LoadNationalityList();
            $scope.LoadMaritalStatusList();
            $scope.LoadEthnicGroupList();
            $scope.LoadBloodGroupList();
            $scope.LoadChronicConditionList();
            $scope.LoadRelationshipList();
            $scope.LoadBusinessUser_UserTypeList();
            $scope.LoadDepartmentList();
            $scope.LoadGroupTypeList();
            
            $scope.loadCount = 3;
            $("#chatLoaderPV").show();
            photoview = true;
            photoview1 = true;
            photoview2 = true;
            photoview3 = true;
            var methodcnt = 2;
            var methodcnt1 = 2;
            var methodcnt2 = 2;
            var methodcnt3 = 2;

            $scope.MenuTypeId = MenuType;
            if (MenuType == 3) {
                if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                    $scope.Id = $routeParams.Id;
                    $scope.DuplicatesId = $routeParams.Id;
                }
            }
            $scope.NationalPhotoBlob = [];
            $scope.EditSelectedGroup = [];
            $scope.EditPayorId = [];
            $scope.EditPlanId = [];
            $scope.ProfileUpload = [];
            $scope.SelectedGroup = [];
            $scope.MultipleDocuments = [];
            $scope.EditSelectedInstitution = [];
            $scope.SelectedInstitution = [];
            $scope.EditSelectedLanguage = [];
            $scope.SelectedLanguage = [];
            $scope.EditSelectedChronicondition = [];
            $scope.SelectedChronicCondition = [];
            $scope.SelectedChronicConditionEdit = [];
            $scope.EditChronicOption = 0;
            if ($scope.Id > 0) {
                //$http.get(baseUrl + '/api/User/UserDetails_GetPhoto/?Id=' + $scope.Id).success(function (data1) {
                //    methodcnt = methodcnt - 1;
                //    if (methodcnt == 0)
                //        $scope.uploadview = true;
                //    if (data1.PhotoBlob != null) {
                //        $scope.uploadme = 'data:image/png;base64,' + data1.PhotoBlob;

                //    }
                //    else {
                //        $scope.uploadme = null;
                //    }
                //});

                //if ($scope.LoginType == 2) {
                //    $http.get(baseUrl + '/api/User/UserDetails_GetCertificate/?Id=' + $scope.Id).success(function (data) {
                //        if (data.CertificateBlob != null) {
                //            $scope.Editresumedoc = 'data:image/png;base64,' + data.CertificateBlob;
                //        }
                //        else {
                //            $scope.Editresumedoc = null;
                //        }
                //    })
                //}

                //$http.get(baseUrl + '/api/User/UserDetails_GetNationalPhoto/?Id=' + $scope.Id).success(function (data) {
                //    methodcnt1 = methodcnt1 - 1;
                //    if (methodcnt1 == 0)
                //        $scope.Nationaluploadview = true;
                //    if (data.NationalPhotoBlob != null) {
                //        $scope.uploadme1 = 'data:image/png;base64,' + data.NationalPhotoBlob;

                //    }
                //    else {
                //        $scope.uploadme1 = '../../Images/National_Male.png';//null;
                //    }
                //});
                //$http.get(baseUrl + '/api/User/UserDetails_GetInsurancePhoto/?Id=' + $scope.Id).success(function (data) {
                //    methodcnt2 = methodcnt2 - 1;
                //    if (methodcnt2 == 0)
                //        $scope.Insuranceuploadview = true;
                //    if (data.InsurancePhotoBlob != null) {
                //        $scope.uploadme2 = 'data:image/png;base64,' + data.InsurancePhotoBlob;

                //    }
                //    else {
                //        $scope.uploadme2 = '../../Images/National_Male.png';//null;
                //    }
                //});
                $scope.ConfigCode = "CHRONIC CODE";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (app_data) {
                    if (app_data.data.length !== 0) {
                        var ChronicDet = app_data.data[0].ConfigValue.split(',')

                        angular.forEach(ChronicDet, function (value, index) {
                            if (value != "") {
                                if (value == 'CL') {
                                    $scope.Chroniccl = true;
                                }
                                if (value == 'CG') {
                                    $scope.Chroniccg = true;
                                }
                                if (value == 'CC') {
                                    $scope.Chroniccc = true;
                                }
                                if (value == 'SC') {
                                    $scope.Chronicsc = true;
                                }
                            }
                        });

                        if ($window.localStorage['UserTypeId'] == 6 & $scope.Chroniccc == true) {
                            $scope.EditChronicOption = 1;
                        }
                        if ($window.localStorage['UserTypeId'] == 5 & $scope.Chroniccg == true) {
                            $scope.EditChronicOption = 1;
                        }
                        if ($window.localStorage['UserTypeId'] == 4 & $scope.Chroniccl == true) {
                            $scope.EditChronicOption = 1;
                        }
                        if ($window.localStorage['UserTypeId'] == 7 & $scope.Chronicsc == true) {
                            $scope.EditChronicOption = 1;
                        }
                    }
                });

                //$http.get(baseUrl + '/api/User/GETPATIENTINSTITUTION/?ID=' + $scope.Id).success(function (data) {
                //    $("#chatLoaderPV").hide();
                //    var PatientInstituteId = data[0].Institution_Id;

                    // if ($window.localStorage['UserTypeId'] == 1 || PatientInstituteId == $window.localStorage['InstitutionId']) {
              
                $http.get(baseUrl + '/api/User/GetUserDetails/Id?=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId + '&Logged_User_Id=' + $window.localStorage['UserId']).then(function (response) {
                    if (response.data.flag == 0) {
                        window.location.href = baseUrl + "/Home/LoginIndex";
                    } else {
                        $scope.Id = response.data.Id;
                        $scope.rowId = response.data.Id;
                        $scope.InstitutionId = response.data.INSTITUTION_ID.toString();
                        $scope.InsListId1= $scope.InstitutionId;
                        $scope.DepartmentId = response.data.DEPARTMENT_ID.toString();
                        $scope.FirstName = response.data.FirstName;
                        $scope.MiddleName = response.data.MiddleName;
                        $scope.LastName = response.data.LastName;
                        $scope.Employee_No = response.data.EMPLOYEMENTNO;
                        $scope.EmailId = response.data.EMAILID;
                        $scope.Biography = response.data.Clinician_Bio;

                        $scope.MobileNo = response.data.MOBILE_NO;
                        var splitmobno = response.data.MOBILE_NO.includes('~');
                        if (splitmobno == true) {
                            var mobilenoFields = response.data.MOBILE_NO.split('~');
                            var countrycode = mobilenoFields[0];
                            var mNumber = mobilenoFields[1];
                        } else {
                            var countrycode = "";
                            var mNumber = response.data.MOBILE_NO;
                        }
                        var mNumberCC = countrycode + mNumber;

                        if (countrycode == "") {
                            var isccodeavail = response.data.MOBILE_NO;
                        }
                        else {
                            var isccodeavail = mNumber;
                        }
                        $scope.MobileNoView = typeof (mNumber) == "undefined" ? isccodeavail : mNumberCC; //mNumber //data.MOBILE_NO : mNumber;
                        $scope.MobileNo = typeof (mNumber) == "undefined" ? isccodeavail : mNumber; //mNumber //data.MOBILE_NO : mNumber;

                        $scope.ViewDepartmentName = response.data.Department_Name;
                        $scope.ViewInstitutionName = response.data.InstitutionName;
                        $scope.Photo = response.data.Photo;
                        $scope.UserLogo = response.data.Photo;
                        $scope.FileName = response.data.FileName;
                        $scope.PhotoFullpath = response.data.Photo_Fullpath;
                        $scope.PhotoBlob = response.data.PhotoBlob;
                        $scope.NationalPhotoFullpath = response.data.NationalPhotoFullpath;
                        $scope.UIDPhotoFullpath = response.data.NationalPhotoFullpath;
                        $scope.InsurancePhotoFullpath = response.data.InsurancePhotoFullpath;
                        $scope.UserTypeId = response.data.UserType_Id.toString();

                        $scope.Health_License = response.data.HEALTH_LICENSE;
                        $scope.File_Name = response.data.FILE_NAME;
                        $scope.CertificateFileName = response.data.FILE_NAME;
                        $scope.FileType = response.data.FILETYPE;
                        $scope.Resume = response.data.FILE_NAME;
                        $scope.resumedoc = response.data.FILE_NAME;
                        $scope.File_FullPath = response.data.FILE_FULLPATH;
                        $scope.Upload_FileName = response.data.UPLOAD_FILENAME;
                        $scope.GenderId = response.data.GENDER_ID.toString();
                        $scope.genid = response.data.GENDER_ID.toString();
                        // $scope.NationalityId = data.NATIONALITY_ID.toString();
                        $scope.LoadCountryList();
                        $scope.LoadStateList(response.data.COUNTRY_ID);
                        $scope.LoadCityList(response.data.COUNTRY_ID, response.data.STATE_ID);
                         setTimeout(function () {
                            $("#NationalityId").select2("trigger", "select", {
                                data: { id: response.data.NATIONALITY_ID.toString(), text: response.data.Nationality }
                            });
                            $("#DepartmentId").select2("trigger", "select", {
                                data: { id: response.data.DEPARTMENT_ID.toString(), text: response.data.Department_Name }
                            });
                             $("#UserTypeId").select2("trigger", "select", {
                                 data: { id: response.data.UserType_Id.toString(), text: response.data.UserName }
                            });
                            $("#GenderId").select2("trigger", "select", {
                                data: { id: response.data.GENDER_ID.toString(), text: response.data.GENDER_NAME }
                            });
                            $("#MaritalStatusId").select2("trigger", "select", {
                                data: { id: response.data.MARITALSTATUS_ID.toString(), text: response.data.MaritalStatus }
                            });
                            $("#EthnicGroupId").select2("trigger", "select", {
                                data: { id: response.data.ETHINICGROUP_ID.toString(), text: response.data.EthnicGroup }
                            });
                            $("#BloodGroupId").select2("trigger", "select", {
                                data: { id: response.data.BLOODGROUP_ID.toString(), text: response.data.BLOODGROUP_NAME }
                            });
                            $("#EMERG_CONT_RELATIONSHIP_ID").select2("trigger", "select", {
                                data: { id: response.data.EMERG_CONT_RELATIONSHIP_ID.toString(), text: response.data.RelationShipName }
                            });
                             angular.forEach(response.data.SelectedChronicConnditionList, function (value, index) {
                                $scope.EditSelectedChronicondition.push(value.Chronic_Id);
                                $scope.SelectedChronicCondition = $scope.EditSelectedChronicondition;
                                $scope.SelectedChronicConditionEdit = $scope.EditSelectedChronicondition;
                                $("#SelectedChronicCondition").select2("trigger", "select", {
                                    data: { id: value.Chronic_Id.toString(), text: value.ChronicCondition }
                                });
                            });
                             angular.forEach(response.data.SelectedGroupList, function (value, index) {
                                $scope.EditSelectedGroup.push(value.Group_Id);
                                $scope.SelectedGroup = $scope.EditSelectedGroup;
                                $("#SelectedGroup").select2("trigger", "select", {
                                    data: { id: value.Group_Id.toString(), text: value.GroupName }
                                });
                            });
                            $("#CountryId").select2("trigger", "select", {
                                data: { id: response.data.COUNTRY_ID.toString(), text: response.data.COUNTRY_NAME }
                            });
                            $("#StateId").select2("trigger", "select", {
                                data: { id: response.data.STATE_ID.toString(), text: response.data.StateName }
                            });
                            $("#CityId").select2("trigger", "select", {
                                data: { id: response.data.CITY_ID.toString(), text: response.data.LocationName }
                            });
                         });

                        // $scope.EthnicGroupId = data.ETHINICGROUP_ID.toString();
                        $scope.DOB = DateFormatEdit($filter('date')(response.data.DOB, "dd-MMM-yyyy"));

                        $scope.HomeAreaCode = response.data.HOME_AREACODE;
                        $scope.Home_PhoneNo = response.data.HOME_PHONENO;
                        $scope.MobileAreaCode = response.data.MOBIL_AREACODE;
                        $scope.PostalZipCode = response.data.POSTEL_ZIPCODE;
                        $scope.EMR_Avalability = response.data.EMR_AVAILABILITY;
                        $scope.Address1 = response.data.ADDRESS1;
                        $scope.Address2 = response.data.ADDRESS2;
                        $scope.Address3 = response.data.ADDRESS3;
                        //$scope.CountryId = data.COUNTRY_ID.toString();
                        //$scope.StateId = data.STATE_ID.toString();
                        //$scope.CityId = data.CITY_ID.toString();

                        $scope.CountryDuplicateId = $scope.CountryId;
                        $scope.CountryFlag = true;
                        $scope.StateDuplicateId =  $scope.StateId;
                        $scope.StateFlag = true;
                        $scope.LocationDuplicateId = $scope.CityId;
                        $scope.CityFlag = true;
                        if ($scope.DropDownListValue == 4) {

                            // $http.get(baseUrl + '/api/Common/CountryList/').success(function (country_data) {
                                //$scope.CountryNameList = country_data;
                            if ($scope.CountryFlag == true) {
                                $scope.CountryId = $scope.CountryDuplicateId;
                                $scope.CountryFlag = false;
                                $scope.loadCount = $scope.loadCount - 1;
                            }
                            // });
                            // $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + data.COUNTRY_ID.toString()).success(function (state_data) {
                                // $scope.StateName_List = state_data;
                            if ($scope.StateFlag == true) {
                                $scope.StateId = $scope.StateDuplicateId;
                                $scope.StateFlag = false;
                                $scope.loadCount = $scope.loadCount - 1;
                            }
                            // });
                            // $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + data.COUNTRY_ID.toString() + '&StateId=' + data.STATE_ID.toString()).success(function (city_data) {
                                //$scope.LocationName_List =data ;    
                                // $scope.LocationName_List = city_data;
                            if ($scope.CityFlag == true) {
                                $scope.CityId = $scope.LocationDuplicateId;
                                $scope.CityFlag = false;
                                $scope.loadCount = $scope.loadCount - 1;
                            }
                            // });
                        }
                        //$scope.MaritalStatusId = data.MARITALSTATUS_ID.toString();
                        //$scope.BloodGroupId = data.BLOODGROUP_ID.toString();
                        $scope.PatientNo = response.data.PATIENTNO;
                        $scope.Createdby_ShortName = response.data.Createdby_ShortName;
                        $scope.InsuranceId = response.data.INSURANCEID;
                        $scope.MNR_No = response.data.MNR_NO;
                        $scope.DropDownListValue = 3; 
                        $scope.NationalId = response.data.NATIONALID.toString();
                        $scope.UID = response.data.UID;
                        $scope.EthnicGroup = response.data.EthnicGroup;
                        $scope.ViewGender = response.data.GENDER_NAME;
                        $scope.ViewNationality = response.data.Nationality;
                        $scope.ViewUserName = response.data.UserName;
                        $scope.ViewGroupName = response.data.GroupName;
                        $scope.ViewCountryName = response.data.COUNTRY_NAME;
                        $scope.ViewStateName = response.data.StateName;
                        $scope.ViewLocationName = response.data.LocationName;
                        $scope.Institution = response.data.Institution;
                        $scope.LanguageKnown = response.data.LanguageKnown;
                        $scope.MaritalStatus = response.data.MaritalStatus;
                        $scope.ViewBloodGroup = response.data.BLOODGROUP_NAME;
                        $scope.RelationShipName = response.data.RelationShipName;
                        $scope.DietDescribe = response.data.DietDescribe;
                        $scope.AlergySubstance = response.data.AlergySubstance;
                        $scope.ChronicCondition = response.data.ChronicCondition;
                        $scope.EXCERCISE_SCHEDULE = response.data.EXCERCISE_SCHEDULE;
                        $scope.SMOKESUBSTANCE = response.data.SMOKESUBSTANCE;
                        $scope.ALCOHALSUBSTANCE = response.data.ALCOHALSUBSTANCE;
                        $scope.CAFFEINATED_BEVERAGES = response.data.CAFFEINATED_BEVERAGES;
                        $scope.DIETDESCRIBE_ID = response.data.DIETDESCRIBE_ID.toString();
                        $scope.EXCERCISE_SCHEDULEID = response.data.EXCERCISE_SCHEDULEID.toString();
                        $scope.ALERGYSUBSTANCE_ID = response.data.ALERGYSUBSTANCE_ID.toString();
                        $scope.SMOKESUBSTANCE_ID = response.data.SMOKESUBSTANCE_ID.toString();
                        $scope.ALCOHALSUBSTANCE_ID = response.data.ALCOHALSUBSTANCE_ID.toString();
                        $scope.CAFFEINATED_BEVERAGESID = response.data.CAFFEINATED_BEVERAGESID.toString();
                        $scope.EMERG_CONT_RELATIONSHIP_ID = response.data.EMERG_CONT_RELATIONSHIP_ID.toString();
                        $scope.CURRENTLY_TAKEMEDICINE = response.data.CURRENTLY_TAKEMEDICINE;
                        $scope.PAST_MEDICALHISTORY = response.data.PAST_MEDICALHISTORY;
                        $scope.FAMILYHEALTH_PROBLEMHISTORY = response.data.FAMILYHEALTH_PROBLEMHISTORY;
                        $scope.VACCINATIONS = response.data.VACCINATIONS;
                        $scope.EXCERCISE_TEXT = response.data.EXCERCISE_TEXT;
                        $scope.ALERGYSUBSTANCE_TEXT = response.data.ALERGYSUBSTANCE_TEXT;
                        $scope.SMOKESUBSTANCE_TEXT = response.data.SMOKESUBSTANCE_TEXT;
                        $scope.ALCOHALSUBSTANCE_TEXT = response.data.ALCOHALSUBSTANCE_TEXT;
                        $scope.CAFFEINATEDBEVERAGES_TEXT = response.data.CAFFEINATEDBEVERAGES_TEXT;
                        $scope.EMERG_CONT_FIRSTNAME = response.data.EMERG_CONT_FIRSTNAME;
                        $scope.EMERG_CONT_MIDDLENAME = response.data.EMERG_CONT_MIDDLENAME;
                        $scope.EMERG_CONT_LASTNAME = response.data.EMERG_CONT_LASTNAME;
                        $scope.Emergency_MobileNo = response.data.Emergency_MobileNo;
                        $scope.Google_EmailId = response.data.GOOGLE_EMAILID;
                        $scope.FB_EmailId = response.data.FB_EMAILID;
                        $scope.appleUserID = response.data.appleUserID;
                       
                        $scope.PATIENT_ID = response.data.PatientId;
                        $scope.Diabetic = response.data.DIABETIC.toString();
                        $scope.HyperTension = response.data.HYPERTENSION.toString();
                        $scope.Cholestrol = response.data.CHOLESTEROL.toString();

                        $scope.ViewDiabetic = response.data.Diabetic_Option;
                        $scope.ViewCholestrol = response.data.Cholesterol_Option;
                        $scope.ViewHyperTension = response.data.HyperTension_Option;

                        $scope.AddMedicines = response.data.AddMedicines;
                        $scope.AddMedicalHistory = response.data.AddMedicalHistory;
                        $scope.AddHealthProblem = response.data.AddHealthProblem;
                        $scope.ApprovalFlag = response.data.Approval_flag;
                        $scope.PayorName = response.data.PayorName;
                        $scope.SelectedPayor = response.data.PayorName; 
                        $scope.PlanName = response.data.PlanName;
                        $scope.Member_ID = response.data.Memberid;
                        $scope.Policy_Number = response.data.PolicyNumber;
                        $scope.Reference_ID = response.data.RefernceId;
                        $scope.ExpiryDate = DateFormatEdit($filter('date')(response.data.ExpiryDate, "dd-MMM-yyyy"));
                        $scope.ConfigCode = "PATIENTPAGE_COUNT";
                        $scope.ISact = 1;
                        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                        // Bind User Photo and User Certificates Details
                        methodcnt = methodcnt - 1;
                        if (methodcnt == 0)
                            $scope.uploadview = true;
                        if (response.data.PhotoBlob != null) {
                            $scope.uploadme = 'data:image/png;base64,' + response.data.PhotoBlob;1;
                        }
                        else {
                            $scope.uploadme = nul0;
                        }

                        if ($scope.LoginType == 2) {
                            if (response.data.CertificateBlob != null) {
                                $scope.Editresumedoc = 'data:image/png;base64,' + response.data.CertificateBlob;
                            }
                            else {
                                $scope.Editresumedoc = null;
                            }
                        }
                        angular.forEach(response.data.ProfileDocuments, function (value, index) {
                            if (value.PhotoBlob != null && value.Type == "Emirates_Id") {
                                $scope.ProfileUpload.push('data:image/png;base64,'+ value.PhotoBlob);
                                $scope.NationalUpload.push(value.NATIONAL_PHOTO_FILENAME);
                            } else {
                                $scope.UIDUpload.push('data:image/png;base64,' +value.PhotoBlob);
                                $scope.UID_Upload.push(value.NATIONAL_PHOTO_FILENAME);
                                $scope.UIDLogo = $scope.UIDUpload;
                                $scope.UIDshow = $scope.UID_Upload;
                            }
                        })
                        $scope.NationalUploadme = $scope.ProfileUpload;
                        $scope.Nationalityresumedoc = $scope.NationalUpload;
                        methodcnt1 = methodcnt1 - 1;
                        if (methodcnt1 == 0)
                            $scope.Nationaluploadview = true;
                        if (response.data.NationalPhotoBlob != null) {
                            if (response.data.Type == "Nationality_Id") {
                                $scope.uploadme1 = 'data:image/png;base64,' + response.data.NationalPhotoBlob;
                            }
                        }
                        else {
                                $scope.uploadme1 = '../../Images/National_Male.png';//null;
                                var uploadmee1 = $scope.uploadme1;
                                $scope.NatUploadme = uploadmee1;
                        }
                        

                        methodcnt3 = methodcnt1 - 1;
                        if (methodcnt3 == 0)
                            $scope.UIDuploadview = true;
                        if (response.data.NationalPhotoBlob != null) {

                            if (response.data.Type == "UID") {
                                $scope.uploadme3 = 'data:image/png;base64,' + response.data.NationalPhotoBlob;
                            }

                        }
                        else {
                            $scope.uploadme3 = '../../Images/National_Male.png';//null;
                            var uploadmee3 = $scope.uploadme3;
                            $scope.UIDUploadme = uploadmee3;
                        }

                        methodcnt2 = methodcnt2 - 1;
                        if (methodcnt2 == 0)
                            $scope.Insuranceuploadview = true;
                        if (response.data.InsurancePhotoBlob != null) {
                            $scope.uploadme2 = 'data:image/png;base64,' + response.data.InsurancePhotoBlob;
                        }
                        else {
                            $scope.uploadme2 = '../../Images/National_Male.png';//null;
                            var uploadmee2 = $scope.uploadme2;
                            $scope.INSUploadme = uploadmee2;
                        }
                        
                        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1) {
                            if (data1.data.length != 0) {
                                $scope.page_size = data1.data[0].ConfigValue;
                            }
                            //$scope.page_size = data1[0].ConfigValue;
                            $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                            $scope.PageEnd = $scope.current_page * $scope.page_size;
                            $http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.SelectedInstitutionId + '&StartRowNumber=' + $scope.PageStart +
                                '&EndRowNumber=' + $scope.PageEnd).then(function (data1) {
                                    $scope.PayorMasterList = data1.data;
                                    //$scope.SelectedPayor = "";
                                    if (response.data.PayorId != null && response.data.PayorId != "") {
                                        $scope.EditPayorId = response.data.PayorId;
                                        //$scope.SelectedPayor.push($scope.EditPayorId);
                                        $http.get(baseUrl + '/api/PlanMaster/PayorBasedPlan/?Id=' + response.data.PayorId).then(function (resp_data) {
                                            $scope.PayorBasedPlanList = resp_data.data;
                                            if (response.data.length != 0 && response.data.length != undefined) {
                                                //$scope.SelectedPlan = "";
                                                $scope.EditPlanId = "";
                                                $scope.EditPlanId = resp_data.data[0].Id.toString();
                                                $scope.PlanName = resp_data.data[0].PlanName;
                                                //$scope.SelectedPlan.push($scope.EditPlanId);
                                                // setTimeout(function () {
                                                    $scope.SelectedPayor = $scope.EditPayorId;
                                                    $scope.SelectedPlan = $scope.EditPlanId;
                                                // }, 1000);
                                            }
                                        });
                                    }
                                });
                        });

                        methodcnt = methodcnt - 1;
                        if (methodcnt == 0)
                            $scope.uploadview = true;

                        methodcnt1 = methodcnt1 - 1;
                        if (methodcnt1 == 0)
                            $scope.Nationaluploadview = true;

                        methodcnt2 = methodcnt2 - 1;
                        if (methodcnt2 == 0)
                            $scope.Insuranceuploadview = true;

                        if ($scope.UserTypeId == 2) {
                            if ($scope.AddMedicines.length > 0) {
                                $scope.CurrentMedicineflag = 1;
                            }
                            else {
                                $scope.CurrentMedicineflag = 0;
                            }
                            if ($scope.AddMedicalHistory.length > 0) {
                                $scope.PastMedicineflag = 1;
                            }
                            else {
                                $scope.PastMedicineflag = 0;
                            }

                            if ($scope.AddHealthProblem.length > 0) {
                                $scope.MedicalHistoryflag = 1;
                            }
                            else {
                                $scope.MedicalHistoryflag = 0;
                            }
                        }
                        angular.forEach(response.data.SelectedGroupList, function (value, index) {
                            $scope.EditSelectedGroup.push(value.Group_Id);
                            $scope.SelectedGroup = $scope.EditSelectedGroup;
                        });
                        angular.forEach(response.data.SelectedInstitutionList, function (value, index) {
                            $scope.EditSelectedInstitution.push(value.Institution_Id);
                            $scope.SelectedInstitution = $scope.EditSelectedInstitution;
                        });
                        angular.forEach(response.data.SelectedLanguageList, function (value, index) {
                            $scope.EditSelectedLanguage.push(value.Language_Id);
                            $scope.SelectedLanguage = $scope.EditSelectedLanguage;
                        });
                        //angular.forEach(data.SelectedChronicConnditionList, function (value, index) {
                        //    $scope.EditSelectedChronicondition.push(value.Chronic_Id);
                        //    $scope.SelectedChronicCondition = $scope.EditSelectedChronicondition;
                        //    $scope.SelectedChronicConditionEdit = $scope.EditSelectedChronicondition;
                        //});

                        $('#patientrowid').prop('disabled', true);
                        $("#chatLoaderPV").hide();
                        inputPhoneNo.setNumber(mNumberCC);
                        //$scope.inputPhoneNo1 = inputPhoneNo;
                        document.getElementById("txthdCountryCode").value = countrycode;
                        document.getElementById('txthdFullNumber').value = mNumberCC;
                        $scope.Patient_Type = response.data.Patient_Type;
                        setTimeout(() => { angular.element($('#Patient_Type' + $scope.Patient_Type)).prop('checked', true); }, 500);
                        setTimeout(() => {
                            $("#CountryId").select2("trigger", "select", {
                                data: { id: response.data.COUNTRY_ID.toString(), text: response.data.COUNTRY_NAME }
                            });
                        }, 500);
                        setTimeout(() => {
                            $("#StateId").select2("trigger", "select", {
                                data: { id: response.data.STATE_ID.toString(), text: response.data.StateName }
                            });
                        }, 500);
                        setTimeout(() => {
                            $("#CityId").select2("trigger", "select", {
                                data: { id: response.data.CITY_ID.toString(), text: response.data.LocationName }
                            });
                        }, 700);
                    }
                });
                    ////}
                    //else {
                    //    window.location.href = baseUrl + "/Home/LoginIndex";
                    //}
               // });
            }
            else {
                $("#chatLoaderPV").hide();
                photoview = false;
                photoview1 = false;
                photoview3 = false;
                photoview2 = false;
            }

        }

        $scope.CertificateView = function (Id, filetype) {
            if ($scope.editcertificate == true) {
                $http.get(baseUrl + '/api/User/UserDetails_GetCertificate?Id=' + Id + '&Login_Session_Id=' + $scope.LoginSessionId + '&FILETYPE=' + $scope.FileType,).then(function (response) {
                    //var mtype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    //\var url = 'data:' + mtype + ';base64,' + data.DocumentBlobData.toString();
                    /*window.open(url);*/
                    console.log("response.data: " + response.data.FileType.toString() + "; base64, " + response.data.CertificateBlob.toString() + "#toolbar = 0 & navpanes=0 & scrollbar=0")
                    let pdfWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=500,height=400");
                    pdfWindow.document.write("<html><head><title>Test</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
                    pdfWindow.document.write("<body><embed width='100%' height='100%' src='data:" + response.data.FileType.toString() + ";base64, " + response.data.CertificateBlob.toString() + "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>");
                });
            } else {

            }
        }

        $scope.PhotoUplaodSelected = function () {
            $scope.PhotoValue = 1;
            $scope.UserPhotoValue = 1;
        };
        $scope.NationalityPhotoUplaodSelected = function () {
            $scope.PhotoValue1 = 1;
            $scope.NationalPhotoValue = 1;
        };
        $scope.UIDPhotoUplaodSelected = function () {
            $scope.PhotoValue1 = 1;
            $scope.UIDPhotoValue = 1;
        };
        $scope.InsurancePhotoUplaodSelected = function () {
            $scope.PhotoValue2 = 1;
            $scope.InsurancePhotoValue = 1;
        };

        $scope.CertificateUplaodSelected = function () {
            $scope.CertificateValue = 1;
        };

        $scope.UserDetails_InActive = function (GetId) {
            var Usertype = parseInt(localStorage.getItem('UserTypeId'));
            for (var k = 0; k < $scope.UserDetailsList.length; k++) {
                if ($scope.UserDetailsList[k].Id === GetId && $scope.UserDetailsList[k].Is_Master === true && Usertype !== 1) {
                    //alert("Could not deactivate the selected User!");
                    toastr.info("Could not deactivate the selected User!", "info");
                    return false;
                }
            }

            $scope.Id = GetId;

            Swal.fire({
                title: 'Do you like to deactivate the selected User?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $http.get(baseUrl + '/api/User/UserDetails_InActive/?Id=' + $scope.Id).then(function (response) {
                        if (response.data.Status == "True") {
                            //alert(data.Message);
                            toastr.success(response.data.Message, "success");
                            if ($scope.MenuTypeId == 1)
                                $scope.User_Admin_List($scope.MenuTypeId);
                            else if ($scope.MenuTypeId == 2)
                                $scope.BusinessUser_List($scope.MenuTypeId);
                            else if ($scope.MenuTypeId == 3)
                                $scope.Patient_List($scope.MenuTypeId);
                        }
                        else {
                            //alert(data.Message);
                            toastr.info(response.data.Message, "info");
                        }
                    }, function errorCallback(response) {
                        $scope.error = "An error has occurred while deleting User Details" + response.data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })

            //var del = confirm("Do you like to deactivate the selected User?");
            //if (del == true) {
            //    $http.get(baseUrl + '/api/User/UserDetails_InActive/?Id=' + $scope.Id).success(function (data) {
            //        if (data.Status == "True") {
            //            //alert(data.Message);
            //            toastr.success(data.Message, "success");
            //            if ($scope.MenuTypeId == 1)
            //                $scope.User_Admin_List($scope.MenuTypeId);
            //            else if ($scope.MenuTypeId == 2)
            //                $scope.BusinessUser_List($scope.MenuTypeId);
            //            else if ($scope.MenuTypeId == 3)
            //                $scope.Patient_List($scope.MenuTypeId);
            //        }
            //        else {
            //            //alert(data.Message);
            //            toastr.info(data.Message, "info");
            //        }
            //    }).error(function (data) {
            //        $scope.error = "An error has occurred while deleting User Details" + data;
            //    });
            //}
        };
        $scope.UserDetails_Active = function (GetId) {
            $scope.Id = GetId;

            Swal.fire({
                title: 'Do you like to activate the selected User?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $http.get(baseUrl + '/api/User/UserDetails_Active/?Id=' + $scope.Id).then(function (response) {
                        if (response.data.Status == "True") {
                            //alert("User Details has been activated Successfully");
                            toastr.success("User Details has been activated Successfully", "success");
                            if ($scope.MenuTypeId == 1)
                                $scope.User_Admin_List($scope.MenuTypeId);
                            else if ($scope.MenuTypeId == 2)
                                $scope.BusinessUser_List($scope.MenuTypeId);
                            else if ($scope.MenuTypeId == 3)
                                $scope.Patient_List($scope.MenuTypeId);
                        }
                        else {
                            //alert(data.Message);
                            toastr.info(response.data.Message, "info");
                        }
                    }, function errorCallback(response) {
                        $scope.error = "An error has occurred while deleting User Details" + response.data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })

            //var del = confirm("Do you like to activate the selected User?");
            //if (del == true) {
            //    $http.get(baseUrl + '/api/User/UserDetails_Active/?Id=' + $scope.Id).success(function (data) {
            //        if (data.Status == "True") {
            //            //alert("User Details has been activated Successfully");
            //            toastr.success("User Details has been activated Successfully", "success");
            //            if ($scope.MenuTypeId == 1)
            //                $scope.User_Admin_List($scope.MenuTypeId);
            //            else if ($scope.MenuTypeId == 2)
            //                $scope.BusinessUser_List($scope.MenuTypeId);
            //            else if ($scope.MenuTypeId == 3)
            //                $scope.Patient_List($scope.MenuTypeId);
            //        }
            //        else {
            //            //alert(data.Message);
            //            toastr.info(data.Message, "info");
            //        }
            //    }).error(function (data) {
            //        $scope.error = "An error has occurred while deleting User Details" + data;
            //    });
            //}
        };
        // Add row concept
        $scope.AddMedicines = [{
            'Id': $scope.ChildId,
            'MedicineName': $scope.MedicineName,
            'Remarks': $scope.Remarks,
            'Status': 1
        }];
        /*This is a Addrow function to add new row and save Medicine details*/
        $scope.AddMedicine_Insert = function () {
            if ($scope.MedicineRow >= 0) {
                var obj = {
                    'Id': $scope.ChildId,
                    'MedicineName': $scope.MedicineName,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                }
                $scope.AddMedicines[$scope.MedicineRow] = obj;
            }
            else {
                $scope.AddMedicines.push({
                    'Id': $scope.ChildId,
                    'MedicineName': $scope.MedicineName,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                })
            }
        };
        $scope.AddHealthProblem = [{
            'Id': $scope.HealthProblem_Id,
            'Relationship_Id': $scope.Relationship_Id,
            'Health_Problem': $scope.Health_Problem,
            'Remarks': $scope.Remarks,
            'Status': 1
        }];
        //$scope.AddMedicalHistory = [{
        //    'Id': $scope.Medical_History_Id,
        //    'Medical_History': $scope.Medical_History,
        //    'Remarks': $scope.Remarks,
        //    'Status': 1
        //}];
        $scope.AddMedicalHistory = [];
        /*This is a Addrow function to add new row and save Medical History details*/
        $scope.AddMedicalHistory_Insert = function () {
            if ($scope.MedicalHistoryRow >= 0) {
                var obj = {
                    'Id': $scope.Medical_History_Id,
                    'Medical_History': $scope.Medical_History,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                }
                $scope.AddMedicalHistory[$scope.MedicalHistoryRow] = obj;
            }
            else {
                $scope.AddMedicalHistory.push({
                    'Id': $scope.Medical_History_Id,
                    'Medical_History': $scope.Medical_History,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                })
            }
        };
        $scope.AddHealthProblem = [{
            'Id': $scope.HealthProblem_Id,
            'Relationship_Id': $scope.Relationship_Id,
            'Health_Problem': $scope.Health_Problem,
            'Remarks': $scope.Remarks,
            'Status': 1
        }];
        /*This is a Addrow function to add new row and save Family Health Problem details*/
        $scope.AddHealthProblem_Insert = function () {
            if ($scope.HealthProblemRow >= 0) {
                var obj = {
                    'Id': $scope.HealthProblem_Id,
                    'Relationship_Id': $scope.Relationship_Id,
                    'Health_Problem': $scope.Health_Problem,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                }
                $scope.AddHealthProblem[$scope.HealthProblemRow] = obj;
            }
            else {
                $scope.AddHealthProblem.push({
                    'Id': $scope.HealthProblem_Id,
                    'Relationship_Id': $scope.Relationship_Id,
                    'Health_Problem': $scope.Health_Problem,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                })
            }
        };

        //$scope.PatientGenderChange = function () {
        //    var Gender = document.getElementById('Select10').value;
        //    if (Gender != "0") {
        //        $('#divPatientGender').removeClass("ng-invalid");
        //        $('#divPatientGender').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientGender').removeClass("ng-valid");
        //        $('#divPatientGender').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientCityChange = function () {
        //    var city = document.getElementById('CityId').value;
        //    if (city != "0") {
        //        $('#divPatientCity').removeClass("ng-invalid");
        //        $('#divPatientCity').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientCity').removeClass("ng-valid");
        //        $('#divPatientCity').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientNationalityChange = function () {
        //    var nationality = document.getElementById('Select5').value;
        //    if (nationality != "0") {
        //        $('#divPatientNationality').removeClass("ng-invalid");
        //        $('#divPatientNationality').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientNationality').removeClass("ng-valid");
        //        $('#divPatientNationality').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientMaritalChange = function () {
        //    var MaritalStatus = document.getElementById('Select1').value;
        //    if (MaritalStatus != "0") {
        //        $('#divPatientMarital').removeClass("ng-invalid");
        //        $('#divPatientMarital').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientMarital').removeClass("ng-valid");
        //        $('#divPatientMarital').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientBldGrpChange = function () {
        //    var BldGrp = document.getElementById('Select2').value;
        //    if (BldGrp != "0") {
        //        $('#divPatientBldGrp').removeClass("ng-invalid");
        //        $('#divPatientBldGrp').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientBldGrp').removeClass("ng-valid");
        //        $('#divPatientBldGrp').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientCountryChange = function () {
        //    var country = document.getElementById('countryselectpicker').value;
        //    if (country != "0") {
        //        $('#divPatientCountry').removeClass("ng-invalid");
        //        $('#divPatientCountry').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientCountry').removeClass("ng-valid");
        //        $('#divPatientCountry').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientEthnicChange = function () {
        //    var ethnicgroup = document.getElementById('Select3').value;
        //    if (ethnicgroup != "0") {
        //        $('#divPatientEthnic').removeClass("ng-invalid");
        //        $('#divPatientEthnic').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientEthnic').removeClass("ng-valid");
        //        $('#divPatientEthnic').addClass("ng-invalid");
        //    }
        //}
        ////validation
        //$scope.PatientStateChange = function () {
        //    var city = document.getElementById('stateselectpicker').value;
        //    if (city != "0") {
        //        $('#divPatientState').removeClass("ng-invalid");
        //        $('#divPatientState').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divPatientState').removeClass("ng-valid");
        //        $('#divPatientState').addClass("ng-invalid");
        //    }
        //}

        $scope.Validationcontrols = function () {
            if (typeof ($scope.SelectedPayor) == "undefined" || $scope.SelectedPayor == "" || $scope.SelectedPayor == "0") {
                //alert("Please enter PayorName");
                toastr.warning("Please enter Insurner ", "warning");
                return false;
            }
            else if (typeof ($scope.ServiceCategory) == "undefined" || $scope.ServiceCategory == "" || $scope.ServiceCategory == "0") {
                //alert("Please enter ShortCode");
                toastr.warning("Please enter Service Category", "warning");
                return false;
            }
            else if (typeof ($scope.ConsultationCategory) == "undefined" || $scope.ConsultationCategory == "" || $scope.ConsultationCategory == "0") {
                //alert("Please enter Description");
                toastr.warning("Please enter Consultation Category", "warning");
                return false;
            }
            else if (typeof ($scope.Clinicianlist) == "undefined" || $scope.Clinicianlist == "" || $scope.Clinicianlist == "0") {
                //alert("Please enter ReferCode");
                toastr.warning("Please enter Clinician", "warning");
                return false;
            }
            else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "" || $scope.MobileNo == "0") {
                //alert("Please enter ReferCode");
                toastr.warning("Please enter MobileNo", "warning");
                return false;
            }

            return true;
        };
        $scope.eligibilityId = "";
        $scope.Eligibility_InsertUpdate = function () {
            // Mobile Number Validation...
            var countryData = inputPhoneNo.getSelectedCountryData();
            var countryCode = countryData.dialCode;
            $scope.countrycode = countryCode;

            countrycode = "+" + countryCode;
            document.getElementById("txthdCountryCode").value = countryCode;
            var isValidNum = inputPhoneNo.isValidNumber();

            if (!isValidNum) {
                swal.fire("Phone number invalid");
                document.getElementById("txthdFullNumber").value = "";
                return;
            } else {
                document.getElementById("txthdFullNumber").value = document.getElementById("txtMobile").value

            }
            
            $scope.MobileNo_CC = document.getElementById("txthdFullNumber").value;
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    ServiceCategory: $scope.ServiceCategory,
                    ConsultationCategory: $scope.ConsultationCategory,
                    MOBILE_NO: $scope.MobileNo_CC,
                    NATIONALITY_ID: $scope.NationalId,
                    PayorId: $scope.SelectedPayor,
                    Clinicianlist: $scope.Clinicianlist,
                    countrycode: $scope.countrycode
                }
                $('#Elibtnsave1').attr("disabled", true);
                $http.post(baseUrl + '/api/EligibilityCheck/AddEligibilityEequest/', obj).then(function (response) {
                    // $("#chatLoaderPV").hide();
                    if (response.data != null) {
                        if (response.data.status == -2 || response.data.status == 1) {
                            var elid = 0;
                            if (response.data.status == -2) {
                                $("#chatLoaderPV").hide();
                                $('#Elibtnsave1').attr("disabled", false);
                                elid = response.data.errors[0].split('/')[response.data.errors[0].split('/').length - 1];
                                toastr.warning("particular patient already requested...", "warning");
                            } else if (response.data.status == 1) {
                                elid = response.data.data.eligibilityId;
                                $scope.eligibility_Id = elid;
                                $scope.Clinician = $scope.Clinicianlist;
                            }

                            $http.get(baseUrl + '/api/PayBy/EligibilityRequestDetail?eligibilityID=' + elid + '&facilityLicense=MF2007').then(function (response_data) {
                                if (response_data.data != null) {
                                    if (response_data.data.data != null) {
                                        console.log(response_data.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerId);
                                        $scope.emiratesID = response_data.data.data.eligibilityCheck.emiratesId;
                                        $scope.createby = response_data.data.data.eligibilityCheck.payer.payerName;
                                        $scope.orderon = response_data.data.data.eligibilityCheck.eligibilityCheckAnswer.authorizationEndDate;
                                        $scope.eligibilityDate = response_data.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerMembers[0].startDate;
                                        $scope.cardno = response_data.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerMembers[0].cardNumber;
                                        $scope.package = response_data.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerMembers[0].packageName;
                                        $scope.clinician = response_data.data.data.eligibilityCheck.clinician.fullName;
                                        $scope.speciality = response_data.data.data.eligibilityCheck.clinician.specialty;
                                        $scope.serviceCategory = response_data.data.data.eligibilityCheck.serviceCategory.description;
                                    }
                                    $scope.eligibilityId = $scope.eligibility_Id
                                    var elid = $scope.eligibilityId
                                    $scope.eligibilityId = elid;
                                    //$scope.Clinicia = $scope.Clinician;
                                    //var Clinicianlist = $scope.Clinicia;
                                    //$scope.Clinicia = Clinicianlist;

                                    var Eligiurl = baseUrl + '/api/PayBy/EligibilityRequestDetail?eligibilityID=' + elid + '&facilityLicense=MF2007'
                                    var eligibility_request = {
                                        "url": Eligiurl,
                                        "eligibilityID": elid,
                                        "facilityLicense": 'MF2007'
                                    };
                                    eligibility_response = response_data.data.data;
                                    $scope.user_id = $scope.Id;
                                    $scope.save_user_eligibility_logs($scope.eligibilityId, eligibility_request, eligibility_response, $scope.user_id);
                                }
                            });
                        } else if (response.data.status == -3 || response.data.status == -1) {
                            $('#Elibtnsave1').attr("disabled", false);
                            $("#chatLoaderPV").hide();
                            toastr.warning(response.data.errors[0], "warning");
                        }
                    }
                    angular.element('#EligibilityModel').modal('hide');
                    $scope.ClearEligibility();
                });
            }
        }

        $scope.save_user_eligibility_logs = function (eligibilityId, eligibility_request, eligibility_response, user_id) {
            Obj = {
                "eligibility_response": JSON.stringify(eligibility_response),
                "eligibility_request": JSON.stringify(eligibility_request)
            }
            $http.post(baseUrl + '/api/User/Save_User_Eligibility/?eligibility_id=' + eligibilityId + '&patient_id=' + user_id, Obj).then(function (response) {
                $("#chatLoaderPV").hide();
                $('#Elibtnsave1').attr("disabled", false);
                if (response.data.data == 1) {
                    console.log('saved logs');
                }
            });
        }
        $scope.ClearEligibility = function () {
            $scope.ServiceCategory = "";
            $scope.Clinicianlist = "";
            $scope.ConsultationCategory = "";
        }
        $scope.AdminDefaultConfiguration = 0;
        $scope.AdminInstitutionCreation = function () {
            $scope.AdminDefaultConfiguration = 1;
            $scope.User_InsertUpdate();
        }
        $scope.ConfigCode = "PROFILE_PICTURE";
        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).
            then(function (response) {
                if (response.data[0] != undefined) {
                    $scope.ProfileImageSize = parseInt(response.data[0].ConfigValue);
                }
            });
        $scope.NationalUploadme = [];
        $scope.NationalUpload = [];
        $scope.UIDUpload = [];
        $scope.UID_Upload = [];
        $scope.UIDLogo = [];
        $scope.User_InsertUpdate = function () {

            $scope.GenderId1 = $("#GenderId").val();
            $scope.UserTypeId = $('#UserTypeId').val();
            $scope.DepartmentId1 = $("#DepartmentId").val();
            $scope.MaritalStatusId1 = $("#MaritalStatusId").val();
            $scope.BloodGroupId1 = $("#BloodGroupId").val();
            $scope.EthnicGroupId1 = $("#EthnicGroupId").val();
            $scope.SelectedChronicCondition1 = $("#SelectedChronicCondition").val();
            $scope.CountryId1 = $("#CountryId").val();
            $scope.StateId1 = $("#StateId").val();
            $scope.CityId1 = $("#CityId").val();
            $scope.SelectedGroup1 = $("#SelectedGroup").val();
            $scope.EMERG_CONT_RELATIONSHIP_ID1 = $("#EMERG_CONT_RELATIONSHIP_ID").val();
            $scope.NationalityId1 = $("#NationalityId").val();
                        
            // Mobile Number Validation...
            if ($scope.InputPhoneNo1 == "" || $scope.InputPhoneNo1 == undefined || $scope.InputPhoneNo1 == null) {
            } else {
                var countryData = $scope.InputPhoneNo1;
                var countryCode = countryData.dialCodes; // using updated doc, code has been replaced with dialCode

                countryCode = "+" + countryCode;
                document.getElementById("txthdCountryCode").value = countryCode;

                var isValidNum = $scope.InputPhoneNo1.isValidNumber();

                if (!isValidNum) {
                    swal.fire("Phone number invalid");
                    document.getElementById("txthdFullNumber").value = "";
                    return;
                } else {
                    document.getElementById("txthdFullNumber").value = document.getElementById("txthdCountryCode").value + "~" + document.getElementById("txtMobile").value;
                }
            }
            document.getElementById("txthdFullNumber").value = document.getElementById("txthdCountryCode").value + "~" + document.getElementById("txtMobile").value;
            $scope.MobileNo_CC = document.getElementById("txthdFullNumber").value;

            $('#btnsave').attr("disabled", true);
            $('#btnsave1').attr("disabled", true);
            $('#btnsave2').attr("disabled", true);
            var myPromise = $scope.AgeRestictLimit();
            $scope.Is_Master = false;
            $("#chatLoaderPV").show();
            myPromise.then(function (resolve) {

                if (($scope.MenuTypeId == 2 || $scope.MenuTypeId == 3) || ($scope.MenuTypeId == 1 && $scope.LoginType == 3)) // for business users
                {
                    $scope.InstitutionId = $window.localStorage['InstitutionId'];
                }
                if ($scope.MenuTypeId == 1 && $scope.LoginType == 1) {
                    $scope.Is_Master = true;
                }
                if ($scope.User_Admin_AddEdit_Validations() == true) {
                    $("#chatLoaderPV").show();
                    $scope.PhotoFullpath = $('#item-img-output').attr('src');
                    $scope.InsurancePhotoFullpath = $scope.uploadme2; //$('#item-img-output2').attr('src');
                    $scope.UserInstitutionDetails_List = [];
                    angular.forEach($scope.SelectedInstitution, function (value, index) {
                        var Institutionobj = {
                            Id: 0,
                            Institution_Id: value
                        }
                        $scope.UserInstitutionDetails_List.push(Institutionobj);
                    });
                    $scope.UserLanguageDetails_List = [];
                    angular.forEach($scope.SelectedLanguage, function (value, index) {
                        var Languageobj = {
                            Id: 0,
                            Language_Id: value
                        }
                        $scope.UserLanguageDetails_List.push(Languageobj);
                    });
                    $scope.UserGroupDetails_List = [];
                    angular.forEach($scope.SelectedGroup, function (value, index) {
                        var obj = {
                            Id: 0,
                            Group_Id: value
                        }
                        $scope.UserGroupDetails_List.push(obj);
                    });
                    $scope.PatientChronicCondition_List = [];
                    angular.forEach($scope.SelectedChronicCondition, function (value, index) {
                        var obj = {
                            Id: 0,
                            Chronic_Id: parseInt(value)
                        }
                        $scope.PatientChronicCondition_List.push(obj);
                    });
                    var FileName = "";
                    var CertificateFileName = "";
                    var FileType = "";
                    var Licensefilename = "";
                    var fd = new FormData();
                    var imgBlob;
                    var NationalimgBlob;
                    var InsuranceimgBlob;
                    var imgBlobfile;
                    var NationalitemIndexLogo = -1;
                    var InsuranceitemIndexLogo = -1;
                    var itemIndexLogo = -1;
                    var itemIndexfile = -1;
                    var fd = new FormData();
                    //if ($('#UserLogo')[0].files[0] != undefined) {
                    //    FileName = $('#UserLogo')[0].files[0]['name'];
                    //    imgBlob = $scope.dataURItoBlob($scope.uploadme);
                    //    itemIndexLogo = 0;
                    //}

                    //if (itemIndexLogo != -1) {
                    //    fd.append('file', imgBlob);
                    //}
                    /*
                    calling the api method for read the file path 
                    and saving the image uploaded in the local server. 
                    */
                    $scope.EmptyValueCheckingInsert();
                    if ($scope.DOB == "" || $scope.DOB == undefined || $scope.DOB == null) {
                        var obj = {
                            Id: $scope.Id,
                            INSTITUTION_ID: $scope.InstitutionId == 0 ? null : $scope.InstitutionId,
                            FirstName: $scope.FirstName,
                            MiddleName: $scope.MiddleName,
                            LastName: $scope.LastName,
                            EMPLOYEMENTNO: $scope.Employee_No,
                            DEPARTMENT_ID: $scope.DepartmentId == 0 ? null : $scope.DepartmentId,
                            EMAILID: $scope.EmailId,
                            MOBILE_NO: $scope.MobileNo_CC,
                            FileName: $scope.FileName,
                            Photo_Fullpath: $scope.PhotoFullpath,

                            NationalPhotoFullpath: $scope.NationalPhotoFullpath,
                            NationalPhotoFilename: $scope.NationalPhotoFilename,
                            NationalPhotoFilename: $scope.UIdPhotoFilename,
                            InsurancePhotoFullpath: $scope.InsurancePhotoFullpath,
                            InsurancePhotoFilename: $scope.InsurancePhotoFilename,
                            Photo: $scope.UserLogo,
                            NationalPhoto: $scope.NationalPhoto,
                            InsurancePhoto: $scope.InsurancePhoto,
                            UserType_Id: $scope.MenuTypeId == 1 ? 3 : $scope.MenuTypeId == 3 ? 2 : $scope.UserTypeId,
                            TITLE_ID: $scope.Title_Id == 0 ? null : $scope.Title_Id,
                            HEALTH_LICENSE: $scope.Health_License,
                            FILE_NAME: $scope.CertificateFileName,
                            FILETYPE: $scope.FileType,
                            FILE_FULLPATH: "",
                            UPLOAD_FILENAME: $scope.Resume,

                            GENDER_ID: $scope.GenderId1 == 0 ? null : $scope.GenderId1,
                            NATIONALITY_ID: $scope.NationalityId1 == 0 ? null : $scope.NationalityId1,
                            ETHINICGROUP_ID: $scope.EthnicGroupId1 == 0 ? null : $scope.EthnicGroupId1,
                            DOB: "",
                            HOME_AREACODE: $scope.HomeAreaCode,
                            HOME_PHONENO: $scope.Home_PhoneNo,
                            MOBIL_AREACODE: $scope.MobileAreaCode,
                            POSTEL_ZIPCODE: $scope.PostalZipCode,
                            EMR_AVAILABILITY: $scope.EMR_Avalability,
                            ADDRESS1: $scope.Address1,
                            ADDRESS2: $scope.Address2,
                            ADDRESS3: $scope.Address3,
                            COUNTRY_ID: $scope.CountryId1 == 0 ? null : $scope.CountryId1,
                            STATE_ID: $scope.StateId1 == 0 ? null : $scope.StateId1,
                            CITY_ID: $scope.CityId1 == 0 ? null : $scope.CityId1,
                            MARITALSTATUS_ID: $scope.MaritalStatusId1 == 0 ? null : $scope.MaritalStatusId1,
                            BLOODGROUP_ID: $scope.BloodGroupId1 == 0 ? null : $scope.BloodGroupId1,
                            PATIENTNO: $scope.PatientNo,
                            INSURANCEID: $scope.InsuranceId,
                            //MNR_NO: $scope.MNR_No,
                            NATIONALID: $scope.NationalId,
                            UID: $scope.UID,
                            SMOKER: $scope.Smoker == 0 ? null : $scope.Smoker,
                            DIABETIC: $scope.Diabetic == 0 ? null : $scope.Diabetic,
                            HYPERTENSION: $scope.HyperTension == 0 ? null : $scope.HyperTension,
                            CHOLESTEROL: $scope.Cholestrol == 0 ? null : $scope.Cholestrol,
                            SelectedGroupList: $scope.UserGroupDetails_List,
                            GroupTypeList: $scope.GroupTypeList,
                            SelectedInstitutionList: $scope.UserInstitutionDetails_List,
                            InstitutionList: $scope.DoctorInstitutionList,
                            SelectedLanguageList: $scope.UserLanguageDetails_List,
                            LanguageList: $scope.LanguageList,
                            CURRENTLY_TAKEMEDICINE: $scope.CURRENTLY_TAKEMEDICINE,
                            PAST_MEDICALHISTORY: $scope.PAST_MEDICALHISTORY,
                            FAMILYHEALTH_PROBLEMHISTORY: $scope.FAMILYHEALTH_PROBLEMHISTORY,
                            VACCINATIONS: $scope.VACCINATIONS,
                            DIETDESCRIBE_ID: $scope.DIETDESCRIBE_ID == 0 ? null : $scope.DIETDESCRIBE_ID,
                            EXCERCISE_SCHEDULEID: $scope.EXCERCISE_SCHEDULEID == 0 ? null : $scope.EXCERCISE_SCHEDULEID,
                            EXCERCISE_TEXT: $scope.EXCERCISE_TEXT,
                            ALERGYSUBSTANCE_ID: $scope.ALERGYSUBSTANCE_ID == 0 ? null : $scope.ALERGYSUBSTANCE_ID,
                            ALERGYSUBSTANCE_TEXT: $scope.ALERGYSUBSTANCE_TEXT,
                            SMOKESUBSTANCE_ID: $scope.SMOKESUBSTANCE_ID == 0 ? null : $scope.SMOKESUBSTANCE_ID,
                            SMOKESUBSTANCE_TEXT: $scope.SMOKESUBSTANCE_TEXT,
                            ALCOHALSUBSTANCE_ID: $scope.ALCOHALSUBSTANCE_ID == 0 ? null : $scope.ALCOHALSUBSTANCE_ID,
                            ALCOHALSUBSTANCE_TEXT: $scope.ALCOHALSUBSTANCE_TEXT,
                            CAFFEINATED_BEVERAGESID: $scope.CAFFEINATED_BEVERAGESID == 0 ? null : $scope.CAFFEINATED_BEVERAGESID,
                            CAFFEINATEDBEVERAGES_TEXT: $scope.CAFFEINATEDBEVERAGES_TEXT,
                            EMERG_CONT_FIRSTNAME: $scope.EMERG_CONT_FIRSTNAME,
                            EMERG_CONT_MIDDLENAME: $scope.EMERG_CONT_MIDDLENAME,
                            EMERG_CONT_LASTNAME: $scope.EMERG_CONT_LASTNAME,
                            EMERG_CONT_RELATIONSHIP_ID: $scope.EMERG_CONT_RELATIONSHIP_ID == 0 ? null : $scope.EMERG_CONT_RELATIONSHIP_ID,
                            SelectedChronicConnditionList: $scope.PatientChronicCondition_List,
                            ChronicConditionList: $scope.ChronicConditionList,
                            AddMedicines: $scope.AddMedicines,
                            AddMedicalHistory: $scope.AddMedicalHistory,
                            AddHealthProblem: $scope.AddHealthProblem,
                            MenuType: $scope.MenuTypeId,
                            GOOGLE_EMAILID: $scope.Google_EmailId,
                            FB_EMAILID: $scope.FB_EmailId,
                            CREATED_BY: $window.localStorage['UserId'],
                            ApprovalFlag: "1",      //  USER APPROVED WHEN IT IS CREATED BY HOSPITAL ADMIN OR SUPER ADMIN
                            Patient_Type: $scope.Patient_Type,
                            Emergency_MobileNo: $scope.Emergency_MobileNo,
                            IS_MASTER: $scope.Is_Master,
                            appleUserID: $scope.appleUserID,
                            PatientId: $scope.PATIENT_ID,
                            MrnPrefix: $scope.PrefixMRN,
                            User_Id: $window.localStorage['UserId'],
                            Memberid: $scope.Member_ID,
                            PolicyNumber: $scope.Policy_Number,
                            RefernceId: $scope.Reference_ID,
                            ExpiryDate: $scope.ExpiryDate,
                            PayorId: $scope.SelectedPayor,
                            PlanId: $scope.SelectedPlan,
                            InstitutionName: "",
                            Department_Name: "",
                            INSTITUTION_CODE: "",
                            FullName: "",
                            //Photo: "",
                            //FileName: "",
                            UserName: "",
                            //FILE_NAME: "",
                            //UPLOAD_FILENAME: "",
                            //MOBIL_AREACODE: "",
                            PayorName: "",
                            PlanName: "",
                            MNR_NO: "",
                            GroupName: "",
                            GENDER_NAME: "",
                            Nationality: "",
                            COUNTRY_NAME: "",
                            EthnicGroup: "",
                            StateName: "",
                            LocationName: "",
                            Institution: "",
                            LanguageKnown: "",
                            Createdby_ShortName: "",
                            MaritalStatus: "",
                            BLOODGROUP_NAME: "",
                            RelationShipName: "",
                            DietDescribe: "",
                            AlergySubstance: "",
                            EXCERCISE_SCHEDULE: "",
                            SMOKESUBSTANCE: "",
                            ALCOHALSUBSTANCE: "",
                            CAFFEINATED_BEVERAGES: "",
                            ChronicCondition: "",
                            PASSWORD: "",
                            Diabetic_Option: "",
                            HyperTension_Option: "",
                            Cholesterol_Option: "",
                            DOB_Encrypt: "",
                            ProtocolName: "",
                            PHOTOBLOB_LOW: "",
                            PHOTOBLOB_THUMB: "",
                            TAB_PIN: "",
                            TAB_PHOTO: "",
                            TAB_FINGERPRINT: "",
                            Approval_flag: "0",
                            flag: "0",
                            CREATED_DT: "",
                            TimeZone_Id: "0",
                            LoginTime: "",
                            ISACTIVE: "1",  //Default 1 
                            IsActive: "1",
                            Appointment_Module_Id: "0",
                            Group_Id: "0",
                            Protocol_Id: "0",
                            Unitgroup_preference: "0",
                            Language_preference: "0",
                            Payment_preference: "0",
                            Insurance_Preference: "0",
                            Modified_By: "0",
                            Clinician_Bio: $scope.Biography,
                            //FullNameFormula: $scope.FullNameFormula,
                            //InstitutionList: [{ "InstitutionName": "" }],
                            //LanguageList: [{ "Name": "" }]
                        }
                    } else {
                        var obj = {
                            Id: $scope.Id,
                            INSTITUTION_ID: $scope.InstitutionId == 0 ? null : $scope.InstitutionId,
                            FirstName: $scope.FirstName,
                            MiddleName: $scope.MiddleName,
                            LastName: $scope.LastName,
                            EMPLOYEMENTNO: $scope.Employee_No,
                            DEPARTMENT_ID: $scope.DepartmentId1 == 0 ? null : $scope.DepartmentId1,
                            EMAILID: $scope.EmailId,
                            MOBILE_NO: $scope.MobileNo_CC,
                            FileName: $scope.FileName,
                            Photo_Fullpath: $scope.PhotoFullpath,
                            NationalPhotoFullpath: $scope.NationalPhotoFullpath,
                            NationalPhotoFilename: $scope.NationalPhotoFilename,
                            NationalPhotoFilename: $scope.UIdPhotoFilename,
                            InsurancePhotoFullpath: $scope.InsurancePhotoFullpath,
                            InsurancePhotoFilename: $scope.InsurancePhotoFilename,
                            Photo: $scope.UserLogo,
                            NationalPhoto: $scope.NationalPhoto,
                            InsurancePhoto: $scope.InsurancePhoto,
                            UserType_Id: $scope.MenuTypeId == 1 ? 3 : $scope.MenuTypeId == 3 ? 2 : $scope.UserTypeId,
                            TITLE_ID: $scope.Title_Id == 0 ? null : $scope.Title_Id,
                            HEALTH_LICENSE: $scope.Health_License,
                            FILE_NAME: $scope.CertificateFileName,
                            FILETYPE: $scope.FileType,
                            FILE_FULLPATH: "",
                            UPLOAD_FILENAME: $scope.Resume,
                            GENDER_ID: $scope.GenderId1 == 0 ? null : $scope.GenderId1,
                            NATIONALITY_ID: $scope.NationalityId1 == 0 ? null : $scope.NationalityId1,
                            ETHINICGROUP_ID: $scope.EthnicGroupId1 == 0 ? null : $scope.EthnicGroupId1,
                            DOB: moment($scope.DOB).format('DD-MMM-YYYY'),
                            HOME_AREACODE: $scope.HomeAreaCode,
                            HOME_PHONENO: $scope.Home_PhoneNo,
                            MOBIL_AREACODE: $scope.MobileAreaCode,
                            POSTEL_ZIPCODE: $scope.PostalZipCode,
                            EMR_AVAILABILITY: $scope.EMR_Avalability,
                            ADDRESS1: $scope.Address1,
                            ADDRESS2: $scope.Address2,
                            ADDRESS3: $scope.Address3,
                            COUNTRY_ID: $scope.CountryId1 == 0 ? null : $scope.CountryId1,
                            STATE_ID: $scope.StateId1 == 0 ? null : $scope.StateId1,
                            CITY_ID: $scope.CityId1 == 0 ? null : $scope.CityId1,
                            MARITALSTATUS_ID: $scope.MaritalStatusId1 == 0 ? null : $scope.MaritalStatusId1,
                            BLOODGROUP_ID: $scope.BloodGroupId1 == 0 ? null : $scope.BloodGroupId1,
                            PATIENTNO: $scope.PatientNo,
                            INSURANCEID: $scope.InsuranceId,
                            //MNR_NO: $scope.MNR_No,
                            NATIONALID: $scope.NationalId,
                            UID: $scope.UID,
                            SMOKER: $scope.Smoker == 0 ? null : $scope.Smoker,
                            DIABETIC: $scope.Diabetic == 0 ? null : $scope.Diabetic,
                            HYPERTENSION: $scope.HyperTension == 0 ? null : $scope.HyperTension,
                            CHOLESTEROL: $scope.Cholestrol == 0 ? null : $scope.Cholestrol,
                            SelectedGroupList: $scope.UserGroupDetails_List,
                            GroupTypeList: $scope.GroupTypeList,
                            SelectedInstitutionList: $scope.UserInstitutionDetails_List,
                            InstitutionList: $scope.DoctorInstitutionList,
                            SelectedLanguageList: $scope.UserLanguageDetails_List,
                            LanguageList: $scope.LanguageList,
                            CURRENTLY_TAKEMEDICINE: $scope.CURRENTLY_TAKEMEDICINE,
                            PAST_MEDICALHISTORY: $scope.PAST_MEDICALHISTORY,
                            FAMILYHEALTH_PROBLEMHISTORY: $scope.FAMILYHEALTH_PROBLEMHISTORY,
                            VACCINATIONS: $scope.VACCINATIONS,
                            DIETDESCRIBE_ID: $scope.DIETDESCRIBE_ID == 0 ? null : $scope.DIETDESCRIBE_ID,
                            EXCERCISE_SCHEDULEID: $scope.EXCERCISE_SCHEDULEID == 0 ? null : $scope.EXCERCISE_SCHEDULEID,
                            EXCERCISE_TEXT: $scope.EXCERCISE_TEXT,
                            ALERGYSUBSTANCE_ID: $scope.ALERGYSUBSTANCE_ID == 0 ? null : $scope.ALERGYSUBSTANCE_ID,
                            ALERGYSUBSTANCE_TEXT: $scope.ALERGYSUBSTANCE_TEXT,
                            SMOKESUBSTANCE_ID: $scope.SMOKESUBSTANCE_ID == 0 ? null : $scope.SMOKESUBSTANCE_ID,
                            SMOKESUBSTANCE_TEXT: $scope.SMOKESUBSTANCE_TEXT,
                            ALCOHALSUBSTANCE_ID: $scope.ALCOHALSUBSTANCE_ID == 0 ? null : $scope.ALCOHALSUBSTANCE_ID,
                            ALCOHALSUBSTANCE_TEXT: $scope.ALCOHALSUBSTANCE_TEXT,
                            CAFFEINATED_BEVERAGESID: $scope.CAFFEINATED_BEVERAGESID == 0 ? null : $scope.CAFFEINATED_BEVERAGESID,
                            CAFFEINATEDBEVERAGES_TEXT: $scope.CAFFEINATEDBEVERAGES_TEXT,
                            EMERG_CONT_FIRSTNAME: $scope.EMERG_CONT_FIRSTNAME,
                            EMERG_CONT_MIDDLENAME: $scope.EMERG_CONT_MIDDLENAME,
                            EMERG_CONT_LASTNAME: $scope.EMERG_CONT_LASTNAME,
                            EMERG_CONT_RELATIONSHIP_ID: $scope.EMERG_CONT_RELATIONSHIP_ID == 0 ? null : $scope.EMERG_CONT_RELATIONSHIP_ID,
                            SelectedChronicConnditionList: $scope.PatientChronicCondition_List,
                            ChronicConditionList: $scope.ChronicConditionList,
                            AddMedicines: $scope.AddMedicines,
                            AddMedicalHistory: $scope.AddMedicalHistory,
                            AddHealthProblem: $scope.AddHealthProblem,
                            MenuType: $scope.MenuTypeId,
                            GOOGLE_EMAILID: $scope.Google_EmailId,
                            FB_EMAILID: $scope.FB_EmailId,
                            CREATED_BY: $window.localStorage['UserId'],
                            ApprovalFlag: "1",      //  USER APPROVED WHEN IT IS CREATED BY HOSPITAL ADMIN OR SUPER ADMIN
                            Patient_Type: $scope.Patient_Type,
                            Emergency_MobileNo: $scope.Emergency_MobileNo,
                            IS_MASTER: $scope.Is_Master,
                            appleUserID: $scope.appleUserID,
                            PatientId: $scope.PATIENT_ID,
                            MrnPrefix: $scope.PrefixMRN,
                            User_Id: $window.localStorage['UserId'],
                            Memberid: $scope.Member_ID,
                            PolicyNumber: $scope.Policy_Number,
                            RefernceId: $scope.Reference_ID,
                            ExpiryDate: $scope.ExpiryDate,
                            PayorId: $scope.SelectedPayor,
                            PlanId: $scope.SelectedPlan,
                            InstitutionName: "",
                            Department_Name: "",
                            INSTITUTION_CODE: "",
                            FullName: "",
                            //Photo: "",
                            //FileName: "",
                            UserName: "",
                            //FILE_NAME: "",
                            //UPLOAD_FILENAME: "",
                            //MOBIL_AREACODE: "",
                            PayorName: "",
                            PlanName: "",
                            MNR_NO: "",
                            GroupName: "",
                            GENDER_NAME: "",
                            Nationality: "",
                            COUNTRY_NAME: "",
                            EthnicGroup: "",
                            StateName: "",
                            LocationName: "",
                            Institution: "",
                            LanguageKnown: "",
                            Createdby_ShortName: "",
                            MaritalStatus: "",
                            BLOODGROUP_NAME: "",
                            RelationShipName: "",
                            DietDescribe: "",
                            AlergySubstance: "",
                            EXCERCISE_SCHEDULE: "",
                            SMOKESUBSTANCE: "",
                            ALCOHALSUBSTANCE: "",
                            CAFFEINATED_BEVERAGES: "",
                            ChronicCondition: "",
                            PASSWORD: "",
                            Diabetic_Option: "",
                            HyperTension_Option: "",
                            Cholesterol_Option: "",
                            DOB_Encrypt: "",
                            ProtocolName: "",
                            PHOTOBLOB_LOW: "",
                            PHOTOBLOB_THUMB: "",
                            TAB_PIN: "",
                            TAB_PHOTO: "",
                            TAB_FINGERPRINT: "",
                            Approval_flag: "0",
                            flag: "0",
                            CREATED_DT: "",
                            TimeZone_Id: "0",
                            LoginTime: "",
                            ISACTIVE: "1",  //Default 1 
                            IsActive: "1",
                            Appointment_Module_Id: "0",
                            Group_Id: "0",
                            Protocol_Id: "0",
                            Unitgroup_preference: "0",
                            Language_preference: "0",
                            Payment_preference: "0",
                            Insurance_Preference: "0",
                            Modified_By: "0",
                            Clinician_Bio: $scope.Biography,
                            //FullNameFormula: $scope.FullNameFormula,
                            //InstitutionList: [{ "InstitutionName": "" }],
                            //LanguageList: [{ "Name": "" }]
                        }
                    }
                    $http.post(baseUrl + '/api/User/User_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj,
                    //{
                    //    transformRequest: angular.identity,
                    //    headers: {
                    //        'Content-Type': 'application/json' 
                    //    }
                        //}
                    ).then(function (response) {
                        /*alert(data.Message);*/
                        if (response.data.ReturnFlag == 0) {
                            toastr.info(response.data.Message, "info");
                        }
                        else if (response.data.ReturnFlag == 1) {
                            InstSub.setSubID(0);
                            InstSub.setInstiID(0);
                            toastr.success(response.data.Message, "success");
                        }
                        $('#btnsave').attr("disabled", false);
                        $('#btnsave1').attr("disabled", false);
                        $('#btnsave2').attr("disabled", false);
                        $scope.InstitutionCreatedID = response.data.UserDetails.INSTITUTION_ID;
                        /*if (data.Message == "Email already exists cannot be Duplicated") {
                            alert("Email already exists, cannot be Duplicate");
                            return false;
                        }
                        else if (data.Message == "User created successfully") {
                            alert("User created successfully");
                        }
                        else if (data.Message == "User updated successfully") {
                            alert("User updated successfully");
                        }*/
                        var userid = response.data.UserDetails.Id;

                        $scope.UserImageAttach(userid);
                        $scope.UserImageAttach1(userid);
                        $scope.UserImageAttach2(userid);
                        if (response.data.ReturnFlag == "1") {
                            if ($scope.AdminDefaultConfiguration == 1) {
                                $scope.InstitueDefaultConfiguration();
                            }
                            $scope.UserTypeId = $window.localStorage['UserTypeId'];
                            if ($scope.MenuTypeId == 1) {
                                $scope.User_Admin_List($scope.MenuTypeId);
                            }
                            if ($scope.MenuTypeId == 2) {
                                $scope.BusinessUser_List($scope.MenuTypeId);
                            }
                            if ($scope.MenuTypeId == 3) {
                                if ($scope.UserTypeId != 2) {
                                    $scope.ListRedirect();
                                }
                            }
                            $scope.CancelPopup();
                            if ($scope.PageParameter == 1) {
                                $scope.Cancel_PatientData_Edit();
                            }
                            if ($scope.PageParameter == 0) {
                                $scope.Cancel_PatientAppproval_Edit();
                            }
                            $("#UserLogo").val('');
                            $("#NationalLogo").val('');
                            $("#UIDLogo").val('');
                            $("#InsuranceLogo").val('');
                            $('#btnsave').attr("disabled", false);
                            $('#btnsave1').attr("disabled", false);
                            $('#btnsave2').attr("disabled", false);
                        }

                        $("#chatLoaderPV").hide();
                    }, function errorCallback(response) {
                        toastr.error(response.data.Message, "warning");
                    });
                }
                else {
                    $('#btnsave').attr("disabled", false);
                    $('#btnsave1').attr("disabled", false);
                    $('#btnsave2').attr("disabled", false);
                }
            });
        }

        $scope.InstitueDefaultConfiguration = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=1', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration2();
            }, function errorCallback(response) {
                //alert("Error In Step 1");
                toastr.error("Error In Step 1", "warning");
                $scope.InstitueDefaultConfiguration2();
            });
        };

        $scope.InstitueDefaultConfiguration2 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=2', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration3();
            }, function errorCallback(response) {
                //alert("Error In Step 2");
                toastr.error("Error In Step 2", "warning");
                $scope.InstitueDefaultConfiguration3();
            });
        };

        $scope.InstitueDefaultConfiguration3 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=3', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration4();
            }, function errorCallback(response) {
                //alert("Error In Step 3");
                toastr.error("Error In Step 3", "warning");
                $scope.InstitueDefaultConfiguration4();
            });
        };

        $scope.InstitueDefaultConfiguration4 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=4', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration5();
            }, function errorCallback(response) {
                //alert("Error In Step 4");
                toastr.error("Error In Step 4", "warning");
                $scope.InstitueDefaultConfiguration5();
            });
        };

        $scope.InstitueDefaultConfiguration5 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=5', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration6();
            }, function errorCallback(response) {
                //alert("Error In Step 5");
                toastr.error("Error In Step 5", "warning");
                $scope.InstitueDefaultConfiguration6();
            });
        };

        $scope.InstitueDefaultConfiguration6 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=6', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration7();
            }, function errorCallback(response) {
                //alert("Error In Step 6");
                toastr.error("Error In Step 6", "warning");
                $scope.InstitueDefaultConfiguration7();
            });
        };

        $scope.InstitueDefaultConfiguration7 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=7', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration8();
            }, function errorCallback(response) {
                //alert("Error In Step 7");
                toastr.error("Error In Step 7", "warning");
                $scope.InstitueDefaultConfiguration8();
            });
        };

        $scope.InstitueDefaultConfiguration8 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=8', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration9();
            }, function errorCallback(response) {
                //alert("Error In Step 8");
                toastr.error("Error In Step 8", "warning");
                $scope.InstitueDefaultConfiguration9();
            });
        };

        $scope.InstitueDefaultConfiguration9 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=9', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration10();
            }, function errorCallback(response) {
                //alert("Error In Step 9");
                toastr.error("Error In Step 9", "warning");
                $scope.InstitueDefaultConfiguration10();
            });
        };

        $scope.InstitueDefaultConfiguration10 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=10', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration11();
            }, function errorCallback(response) {
                //alert("Error In Step 10");
                toastr.error("Error In Step 10", "warning");
                $scope.InstitueDefaultConfiguration11();
            });
        };

        $scope.InstitueDefaultConfiguration11 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=11', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration12();
            }, function errorCallback(response) {
                //alert("Error In Step 11");
                toastr.error("Error In Step 11", "warning");
                $scope.InstitueDefaultConfiguration12();
            });
        };

        $scope.InstitueDefaultConfiguration12 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=12', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration13();
            }, function errorCallback(response) {
                //alert("Error In Step 12");
                toastr.error("Error In Step 12", "warning");
                $scope.InstitueDefaultConfiguration13();
            });
        };

        $scope.InstitueDefaultConfiguration13 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=13', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration14();
            }, function errorCallback(response) {
                //alert("Error In Step 13");
                toastr.error("Error In Step 13", "warning");
                $scope.InstitueDefaultConfiguration14();
            });
        };

        $scope.InstitueDefaultConfiguration14 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=14', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration15();
            }, function errorCallback(response) {
                //alert("Error In Step 14");
                toastr.error("Error In Step 14", "warning");
                $scope.InstitueDefaultConfiguration15();
            });
        };

        $scope.InstitueDefaultConfiguration15 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=15', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration16();
            }, function errorCallback(response) {
                //alert("Error In Step 15");
                toastr.error("Error In Step 15", "warning");
                $scope.InstitueDefaultConfiguration16();
            });
        };

        $scope.InstitueDefaultConfiguration16 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=16', $scope.InstitutionCreatedID).then(function (response) {
                $scope.InstitueDefaultConfiguration17();
            }, function errorCallback(response) {
                //alert("Error In Step 16");
                toastr.error("Error In Step 16", "warning");
                $scope.InstitueDefaultConfiguration17();
            });
        };
        $scope.InstitueDefaultConfiguration17 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=17', $scope.InstitutionCreatedID).then(function (response) {
            }, function errorCallback(response) {
                //alert("Error In Step 17");
                toastr.error("Error In Step 17", "warning");
            });
        };


        $scope.UserImageAttach = function (userid) {
            var userid = userid;
            var FileName = "";
            var CertificateFileName = "";
            var FileType = "";
            var Licensefilename = "";
            var fd = new FormData();
            var imgBlob;
            var NationalimgBlob = [];
            var InsuranceimgBlob;
            var imgBlobfile;
            var itemIndexLogo = -1;
            var NationalitemIndexLogo = -1;
            var InsuranceitemIndexLogo = -1;
            var itemIndexfile = -1;
            var fd1 = new FormData();
            var fd2 = new FormData();
            var fd3 = new FormData();
            var fd4 = new FormData();

            if (photoview == false) {
                photoview = true;

                if ($scope.PhotoFullpath != undefined && $scope.PhotoFullpath !== "" && $scope.PhotoFullpath != null) {
                    imgBlob = $scope.dataURItoBlob($scope.PhotoFullpath);
                    itemIndexLogo = 0;

                    if (itemIndexLogo != -1) {
                        fd.append('file', imgBlob);
                    }
                    /*
                    calling the api method for read the file path 
                    and saving the image uploaded in the local server. 
                    */

                    $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=1' + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
                        fd,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    )
                        .then(function (response) {
                            if ($scope.FileName == "") {
                                $scope.UserLogo = "";
                            }
                            else if (itemIndexLogo > -1) {
                                if ($scope.FileName != "" && response.data[itemIndexLogo] != "") {
                                    $scope.UserLogo = response.data[itemIndexLogo];
                                }
                            }
                        });
                }
            }
        }
        $scope.UserImageAttach1 = function (userid) {
            var userid = userid;
            var FileName = "";
            var CertificateFileName = "";
            var FileType = "";
            var Licensefilename = "";
            var fd = new FormData();
            var imgBlob;
            var NationalimgBlob = [];
            var InsuranceimgBlob;
            var imgBlobfile;
            var itemIndexLogo = -1;
            var NationalitemIndexLogo = -1;
            var InsuranceitemIndexLogo = -1;
            var itemIndexfile = -1;
            var fd1 = new FormData();
            var fd2 = new FormData();
            var fd3 = new FormData();
            var fd4 = new FormData();

            if ($scope.Nationalityresumedoc.length > 0) {
                $scope.PhotoValue = 1;
                for (var i = 0; i < $scope.Nationalityresumedoc.length; i++) {
                    $scope.NationalFileName = $scope.Nationalityresumedoc[i]['name'];
                    $scope.FileType = $scope.Nationalityresumedoc[i]['type'];
                    fd1.append('file1', $scope.Nationalityresumedoc[i]);
                }
                $http.post(baseUrl + '/api/User/Attach_UserDocuments/?UserId=' + userid + '&Type=Emirates_Id ',
                    fd1,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                ).then(function (response) {
                    $scope.Nationalityresumedoc = [];
                    $scope.NationalFileName = [];
                })
            }
        }
        $scope.UserImageAttach2 = function (userid) {
            var userid = userid;
            var FileName = "";
            var CertificateFileName = "";
            var FileType = "";
            var Licensefilename = "";
            var fd = new FormData();
            var imgBlob;
            var NationalimgBlob = [];
            var InsuranceimgBlob;
            var imgBlobfile;
            var itemIndexLogo = -1;
            var NationalitemIndexLogo = -1;
            var InsuranceitemIndexLogo = -1;
            var itemIndexfile = -1;
            var fd1 = new FormData();
            var fd2 = new FormData();
            var fd3 = new FormData();
            var fd4 = new FormData();

            try {
                if ($scope.UIDshow.length > 0) {
                    $scope.PhotoValue = 1;
                    for (var i = 0; i < $scope.UIDshow.length; i++) {
                        if ($scope.UIDshow[i] != null) {
                            $scope.UIDFileName = $scope.UIDshow[i]['name'];
                            $scope.FileType = $scope.UIDshow[i]['type'];
                        }
                        fd3.append('file1', $scope.UIDshow[i]);

                    }
                    $http.post(baseUrl + '/api/User/Attach_UserDocuments/?UserId=' + userid + '&Type=UID',
                        fd3,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    ).then(function (response) {
                        $scope.UIDshow = [];
                        $scope.UIDFileName = [];
                    })
                }


                if (photoview2 == false) {
                    photoview2 = true;
                    if ($scope.InsurancePhotoFullpath != undefined && $scope.InsurancePhotoFullpath != "" && $scope.InsurancePhotoFullpath != null) {

                        InsuranceimgBlob = $scope.dataURItoBlob($scope.InsurancePhotoFullpath);

                        InsuranceitemIndexLogo = 0;
                        if (InsuranceitemIndexLogo != -1) {
                            fd4.append('file', InsuranceimgBlob);
                        }
                        /*
                        calling the api method for read the file path 
                        and saving the image uploaded in the local server. 
                        */

                        $http.post(baseUrl + '/api/User/AttachInsurancePhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue2 + '&CREATED_BY=' + $window.localStorage['UserId'],
                            fd4,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .then(function (response) {
                                if ($scope.InsurancePhotoFilename == "") {
                                    $scope.InsuranceLogo = "";
                                }
                                else if (InsuranceitemIndexLogo > -1) {
                                    if ($scope.InsurancePhotoFilename != "" && response.data[InsuranceitemIndexLogo] != "") {
                                        $scope.InsuranceLogo = response.data[InsuranceitemIndexLogo];
                                    }
                                }
                            });
                    }
                }

                if ($scope.PhotoValue == 1 && photoview == false && $scope.Id == 0) {
                    if ($scope.PhotoFullpath != undefined && $scope.PhotoFullpath != "" && $scope.PhotoFullpath != null) {
                        if ($('#UserLogo')[0].files[0] != undefined) {
                            FileName = $('#UserLogo')[0].files[0]['name'];
                            imgBlob = $scope.dataURItoBlob($scope.PhotoFullpath);
                            itemIndexLogo = 0;
                        }
                        if (itemIndexLogo != -1) {
                            fd.append('file', imgBlob);
                            /*	
                            calling the api method for read the file path 	
                            and saving the image uploaded in the local server. 	
                            */
                            $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
                                fd,
                                {
                                    transformRequest: angular.identity,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }
                            )
                                .then(function (response) {
                                    if ($scope.FileName == "") {
                                        $scope.UserLogo = "";
                                    }
                                    else if (itemIndexLogo > -1) {
                                        if ($scope.FileName != "" && response.data[itemIndexLogo] != "") {
                                            $scope.UserLogo = response.data[itemIndexLogo];
                                        }
                                    }
                                });
                        }
                    }
                }
                if ($scope.PhotoValue2 == 1 && photoview2 == false && $scope.Id == 0) {
                    if ($scope.InsurancePhotoFullpath != undefined && $scope.InsurancePhotoFullpath != "" && $scope.InsurancePhotoFullpath != null) {
                        if ($('#InsuranceLogo')[0].files[0] != undefined) {
                            InsurancePhotoFilename = $('#InsuranceLogo')[0].files[0]['name'];
                            InsuranceimgBlob = $scope.dataURItoBlob($scope.InsurancePhotoFullpath);
                            InsuranceitemIndexLogo = 0;
                        }
                        if (InsuranceitemIndexLogo != -1) {
                            fd4.append('file', InsuranceimgBlob);

                            /*	
                            calling the api method for read the file path 	
                            and saving the image uploaded in the local server. 	
                            */
                            $http.post(baseUrl + '/api/User/AttachInsurancePhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue2 + '&CREATED_BY=' + $window.localStorage['UserId'],
                                fd4,
                                {
                                    transformRequest: angular.identity,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }
                            )
                                .then(function (response) {
                                    if ($scope.InsurancePhotoFilename == "") {
                                        $scope.InsuranceLogo = "";
                                    }
                                    else if (InsuranceitemIndexLogo > -1) {
                                        if ($scope.InsurancePhotoFilename != "" && response.data[InsuranceitemIndexLogo] != "") {
                                            $scope.InsuranceLogo = response.data[InsuranceitemIndexLogo];
                                        }
                                    }
                                });
                        }
                    }
                }

                if ($scope.PhotoValue == 1 && photoview == true && $scope.Id > 0) {
                    if ($scope.PhotoFullpath != undefined && $scope.PhotoFullpath != "" && $scope.PhotoFullpath != null) {
                        if ($('#UserLogo')[0].files[0] != undefined) {
                            FileName = $('#UserLogo')[0].files[0]['name'];
                            imgBlob = $scope.dataURItoBlob($scope.PhotoFullpath);
                            itemIndexLogo = 0;

                            if ($scope.MenuTypeId == 1) {
                                document.getElementById("profileIcon").src = $scope.PhotoFullpath;
                            }
                        }
                        if (itemIndexLogo != -1) {
                            fd.append('file', imgBlob);

                            /*
                            calling the api method for read the file path 
                            and saving the image uploaded in the local server. 
                            */

                            $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
                                fd,
                                {
                                    transformRequest: angular.identity,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }
                            )
                                .then(function (response) {
                                    if ($scope.FileName == "") {
                                        $scope.UserLogo = "";
                                    }
                                    else if (itemIndexLogo > -1) {
                                        if ($scope.FileName != "" && response.data[itemIndexLogo] != "") {
                                            $scope.UserLogo = response.data[itemIndexLogo];
                                        }
                                    }
                                });
                        }
                    }
                }

                if ($scope.PhotoValue2 == 1 && photoview2 == true && $scope.Id > 0) {
                    if ($scope.InsurancePhotoFullpath != undefined && $scope.InsurancePhotoFullpath != "" && $scope.InsurancePhotoFullpath != null) {
                        if ($('#InsuranceLogo')[0].files[0] != undefined) {
                            InsurancePhotoFilename = $('#InsuranceLogo')[0].files[0]['name'];
                            InsuranceimgBlob = $scope.dataURItoBlob($scope.InsurancePhotoFullpath);
                            InsuranceitemIndexLogo = 0;

                            // if ($scope.MenuTypeId == 1) {
                            // document.getElementById("profileIcon").src = $scope.PhotoFullpath;
                            // }
                        }
                        if (InsuranceitemIndexLogo != -1) {
                            fd4.append('file', InsuranceimgBlob);
                            /*
                            calling the api method for read the file path 
                            and saving the image uploaded in the local server. 
                            */

                            $http.post(baseUrl + '/api/User/AttachInsurancePhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue2 + '&CREATED_BY=' + $window.localStorage['UserId'],
                                fd4,
                                {
                                    transformRequest: angular.identity,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }
                            )
                                .then(function (response) {
                                    if ($scope.InsurancePhotoFilename == "") {
                                        $scope.InsuranceLogo = "";
                                    }
                                    else if (InsuranceitemIndexLogo > -1) {
                                        if ($scope.InsurancePhotoFilename != "" && response.data[InsuranceitemIndexLogo] != "") {
                                            $scope.InsuranceLogo = response.data[InsuranceitemIndexLogo];
                                        }
                                    }
                                });
                        }
                    }
                }

                if ($scope.CertificateValue == 1) {
                    if ($scope.MenuTypeId == 2) {
                        if ($('#EditDocument')[0].files[0] != undefined) {
                            $scope.CertificateFileName = $('#EditDocument')[0].files[0]['name'];
                            $scope.FileType = $('#EditDocument')[0].files[0]['type'];
                            imgBlobfile = $scope.dataURItoBlob($scope.Editresumedoc);
                            if (itemIndexLogo == -1) {
                                itemIndexfile = 0;
                            }
                            else {
                                itemIndexfile = 1;
                            }
                        }
                        if (itemIndexfile != -1) {
                            fd.append('file1', imgBlobfile);
                        }
                    }
                    $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
                        fd,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    )
                        .then(function (response) {
                            if ($scope.Resume == "") {
                                $scope.EditDocument = "";
                            }
                            //else if (itemIndexLogo > -1) {
                            //    if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                            //        $scope.UserLogo = response[itemIndexLogo];
                            //    }
                            //}
                            if ($scope.MenuTypeId === 2) {
                                if ($scope.EditDocument == "") {
                                    $scope.Resume = "";
                                }

                                else if (itemIndexfile > -1) {
                                    if ($scope.CertificateFileName != "" && response.data[itemIndexfile] != "") {
                                        $scope.Resume = response.data[itemIndexfile];
                                    }
                                }
                            }
                        })
                }
            } catch (e) { }
        }

        $scope.EmptyValueCheckingInsert = function () {
            if ($scope.AddMedicines == null) {
                $scope.AddMedicines = [];
            }
            if ($scope.AddMedicalHistory == null) {
                $scope.AddMedicalHistory = [];
            }
            if ($scope.AddHealthProblem == null) {
                $scope.AddHealthProblem = [];
            }
            if ($scope.LanguageList == null) {
                $scope.LanguageList = [];
            }
            if ($scope.UserGroupDetails_List == "" || $scope.UserGroupDetails_List.length == 0) {
                var ch = [];
                ch = [{
                    "UserName": "",
                    "GroupName": "",
                    "DeptName": "",
                    "GenderName": ""
                }]
                $scope.UserGroupDetails_List = ch;
            }
            if ($scope.GroupTypeList == "" || $scope.GroupTypeList.length == 0) {
                var ch1 = [];
                ch1 = [{
                    "Id": "",
                    "GROUP_NAME": "",
                    "IsActive": ""
                }]
                $scope.GroupTypeList = ch1;
            }
            if ($scope.UserInstitutionDetails_List == "" || $scope.UserInstitutionDetails_List.length == 0) {
                var ch2 = [];
                ch2 = [{ "Institution": "" }]
                $scope.UserInstitutionDetails_List = ch2;
            }
            if ($scope.UserLanguageDetails_List == "" || $scope.UserLanguageDetails_List.length == 0) {
                var ch2 = [];
                ch2 = [{ "Language": "" }]
                $scope.UserLanguageDetails_List = ch2;
            }
            if ($scope.PatientChronicCondition_List == "" || $scope.PatientChronicCondition_List.length == 0) {
                var ch3 = [];
                ch3 = [{ "ChronicGroup": "", "ChronicCondition": "" }]
                $scope.PatientChronicCondition_List = ch3;
            }
            if ($scope.ChronicConditionList == "" || $scope.ChronicConditionList.length == 0) {
                var ch4 = [];
                ch4 = [{
                    "Id": "",
                    "Name": "",
                    "IsActive": ""
                }]
                $scope.ChronicConditionList = ch4;
            }
            if ($scope.AddMedicines == null || $scope.AddMedicines == "" || $scope.AddMedicines.length == 0) {
                var ch5 = [];
                ch5 = [{
                    "Id": "",
                    "Status": "", "MedicineName": "", "Remarks": ""
                }]
                $scope.AddMedicines = ch5;
            }
            if ($scope.AddMedicalHistory == null || $scope.AddMedicalHistory == "" || $scope.AddMedicalHistory.length == 0) {
                var ch6 = [];
                ch6 = [{ "Medical_History": "", "Remarks": "" }]
                $scope.AddMedicalHistory = ch6;
            }
            if ($scope.AddHealthProblem == null || $scope.AddHealthProblem == "" || $scope.AddHealthProblem == 0) {
                var ch7 = [];
                //$scope.AddHealthProblem = [];
                ch7 = [{
                    "Id": "",
                    "Status": "",
                    "Health_Problem": "",
                    "Remarks": "",
                    "Relationship_Name": ""
                }]
                $scope.AddHealthProblem = ch7;
            }
            if ($scope.DoctorInstitutionList == "" || $scope.DoctorInstitutionList == undefined || $scope.DoctorInstitutionList.length == 0) {
                var ch8 = [];
                ch8 = [{ "InstitutionName": "" }]
                $scope.DoctorInstitutionList = ch8;
            }
            if ($scope.LanguageList == "" || $scope.LanguageList == undefined || $scope.LanguageList.length == 0) {
                var ch9 = [];
                ch9 = [{ "Name": "" }]
                $scope.LanguageList = ch9;
            }
            //if ($scope.SelectedPayor.length == 1) {
            //    $scope.SelectedPayor = "";
            //    $scope.SelectedPayor = $scope.SelectedPayor[0];
            //} else {
            //    $scope.SelectPayor = "";
            //}
            //if ($scope.SelectedPlan.length == 1) {
            //    $scope.SelectedPlan = "";
            //    $scope.SelectedPlan = $scope.SelectedPlan[0];
            //} else {
            //    $scope.SelectedPlan = "";
            //}
        }

        $scope.Reset_CC_Filter = function () {
            $scope.filter_CL_Group = "";
            $scope.filter_CL_UserType = "0";
            $scope.Filter_CL_Nationality = "0";
            setTimeout(function () {
                $("#filter_CL_UserType").val('0').trigger('change');
                $("#Filter_CL_Nationality").val('0').trigger('change');
            });
            $scope.BusinessUserFilter = $scope.BusinessUserList;
        }

        $scope.ResetPatientFilter = function () {
            $scope.Filter_PatientNo2 = "";
            $scope.filter_NationalityId2 = "";
            $scope.Filter_FirstName2 = "";
            $scope.Filter_LastName2 = "";
            $scope.filter_InsuranceId2 = "";
            $scope.filter_Email2 = "";
            $scope.filter_MOBILE_NO2 = "";
            $scope.Filter_MRN2 = "";
            $scope.Filter_FirstName = "";
            $scope.Filter_LastName = "";
            $scope.Filter_MRN = "";
            $scope.Filter_PatientNo = "";
            $scope.filter_InsuranceId = "";
            $scope.Filter_GenderId = "0";
            $scope.filter_NationalityId = "";
            $scope.filter_SearchFieldId = "0";
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
            $scope.Patient_List($scope.MenuTypeId);
        }
        $scope.ListRedirect = function () {
            $scope.Patient_List($scope.MenuTypeId);
            $location.path("/PatientList/3");
        };
        $scope.fileclear = function () {
            $scope.Editresumedoc = "";
            $('#EditDocument').val('');
            $scope.CertificateFileName = "";
            $scope.FileType = "";
        };
        $scope.RemoveMedicine_Item = function (Delete_Id, rowIndex) {

            //var del = confirm("Do you like to delete this Current Medical Details?");
            //if (del == true) {
            var Previous_Item = [];
            if ($scope.Id == 0) {
                angular.forEach($scope.AddMedicines, function (selectedPre, index) {
                    if (index != rowIndex)
                        Previous_Item.push(selectedPre);
                });
                $scope.AddMedicines = Previous_Item;
            }
            else if ($scope.Id > 0) {
                angular.forEach($scope.AddMedicines, function (selectedPre, index) {
                    if (selectedPre.Id == Delete_Id) {
                        selectedPre.Status = 0;
                    }
                });
                if ($ff($scope.AddMedicines, { StatusId: 1 }).length > 0) {
                    $scope.CurrentMedicineflag = 1;
                }
                else {
                    $scope.CurrentMedicineflag = 0;
                }
            }
            //}
        };
        $scope.RemoveMedicalHistory_Item = function (Delete_Id, rowIndex) {
            //var del = confirm("Do you like to delete this Past Medical Details?");
            // if (del == true) {
            var Previous_MedicalHistoryItem = [];
            if ($scope.Id == 0) {
                angular.forEach($scope.AddMedicalHistory, function (selectedPre, index) {
                    if (index != rowIndex)
                        Previous_MedicalHistoryItem.push(selectedPre);
                });
                $scope.AddMedicalHistory = Previous_MedicalHistoryItem;
            } else if ($scope.Id > 0) {
                angular.forEach($scope.AddMedicalHistory, function (selectedPre, index) {
                    if (selectedPre.Id == Delete_Id) {
                        selectedPre.Status = 0;
                    }
                });
                if ($ff($scope.AddMedicalHistory, { StatusId: 1 }).length > 0) {
                    $scope.PastMedicineflag = 1;
                }
                else {
                    $scope.PastMedicineflag = 0;
                }
            }
            //}
        };
        $scope.RemoveHealthProblem_Item = function (Delete_Id, rowIndex) {
            //var del = confirm("Do you like to delete this Family Health Problem Details?");
            //if (del == true) {
            var Previous_HealthProblemItem = [];
            if ($scope.Id == 0) {
                angular.forEach($scope.AddHealthProblem, function (selectedPre, index) {
                    if (index != rowIndex)
                        Previous_HealthProblemItem.push(selectedPre);
                });
                $scope.AddHealthProblem = Previous_HealthProblemItem;
            } else if ($scope.Id > 0) {
                angular.forEach($scope.AddHealthProblem, function (selectedPre, index) {
                    if (selectedPre.Id == Delete_Id) {
                        selectedPre.Status = 0;
                    }
                });
                if ($ff($scope.AddHealthProblem, { StatusId: 1 }).length > 0) {
                    $scope.MedicalHistoryflag = 1;
                }
                else {
                    $scope.MedicalHistoryflag = 0;
                }
            }
            // }
        };

        $scope.ClearHealthProblem = function () {
            $scope.AddHealthProblem = [{
                'Id': 0,
                'Relationship_Id': 0,
                'Health_Problem': "",
                'Remarks': "",
                'Status': 1
            }];

        };
        $scope.ClearMedicalHistory = function () {
            angular.forEach($scope.AddMedicalHistory, function (value, index) {
                value.Id = 0;
                value.Medical_History = "";
                value.Remarks = "";
                value.Status = 1;
            });
        };
        $scope.ClearMedicine_Item = function () {
            $scope.AddMedicines = [{
                'Id': 0,
                'MedicineName': "",
                'Remarks': "",
                'Status': 1,
            }];
        };
        $scope.Url = baseUrl;
        $scope.AssignedGroupList = [];
        // $scope.AssignedGroup = "0";
        $scope.AssignedGroup_Id = "0";
        $scope.CreateGroupName = "";
        $scope.Create_GroupId = "0";
        $scope.checkAll = function () {
            if ($scope.SelectedAllPatient == true) {
                $scope.SelectedAllPatient = true;
            } else {
                $scope.SelectedAllPatient = false;
            }
            angular.forEach($scope.Patientemptydata, function (row) {
                row.SelectedPatient = $scope.SelectedAllPatient;
            });
        };
        $scope.AssignGroup = function () {
            var cnt = ($filter('filter')($scope.Patientemptydata, 'true')).length;
            if (cnt == 0) {
                //alert("Please select atleast one Patient to Assign Group");
                toastr.info("Please select atleast one Patient to Assign Group", "info");
            }
            else if (typeof ($scope.AssignedGroup) == "undefined" || $scope.AssignedGroup == "0") {
                //alert("Please select Group");
                toastr.warning("Please select Group", "warning");
                return false;
            }
            else {
                $scope.AssignedGroupList = [];
                angular.forEach($scope.Patientemptydata, function (SelectedPatient, index) {
                    if (SelectedPatient.SelectedPatient == true) {
                        var AssignGroupobj = {
                            Id: $scope.AssignedGroup_Id,
                            Group_Id: $scope.AssignedGroup.toString(),
                            User_Id: SelectedPatient.Id
                        };
                        $scope.AssignedGroupList.push(AssignGroupobj);
                    }
                });
                $http.post(baseUrl + '/api/User/AssignedGroup_Insert/', $scope.AssignedGroupList).then(function (response) {
                    if (response.data == 1) {
                        //alert("Group updated successfully");
                        toastr.success("Group updated successfully", "success");
                        $scope.ClearPatientGroupPopup();
                        $scope.Patient_List(3);
                    }
                });
            }
        }
        $scope.ClearPatientGroupPopup = function () {
            $scope.AssignedGroup = "0";
            $scope.SelectedAllPatient = false;
            angular.forEach($scope.PatientListFilter, function (SelectedPatient, index) {
                SelectedPatient.SelectedPatient = false;
            });
        }
        $scope.Eligiblity_pupop = function () {
            angular.element('#InsuranceModel').modal('show');
            var obj = {};
            $http.post(baseUrl + '/api/PayBy/EligibilityRequestCall/', obj).then(function (response) {
                //console.log(data);
                if (response.data != null) {
                    if (response.data.status == -2 || response.data.status == 1) {
                        var elid = 0;
                        if (response.data.status == -2) {
                            elid = response.data.errors[0].split('/')[response.data.errors[0].split('/').length - 1];
                            toastr.warning("particular patient already requested...", "warning");
                        } else if (response.data.status == 1) {
                            elid = response.data.data.eligibilityId;
                        }
                        $http.get(baseUrl + '/api/PayBy/EligibilityRequestDetail?eligibilityID=' + elid + '&facilityLicense=MF2007').then(function (response1) {
                            if (response1.data != null) {
                                if (response1.data.data != null) {
                                    console.log(response1.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerId);
                                    $scope.emiratesID = response1.data.data.eligibilityCheck.emiratesId;
                                    $scope.createby = response1.data.data.eligibilityCheck.payer.payerName;
                                    $scope.orderon = response1.data.data.eligibilityCheck.eligibilityCheckAnswer.authorizationEndDate;
                                    $scope.eligibilityDate = response1.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerMembers[0].startDate;
                                    $scope.cardno = response1.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerMembers[0].cardNumber;
                                    $scope.package = response1.data.data.eligibilityCheck.eligibilityCheckAnswer.eligibilityCheckAnswerMembers[0].packageName;
                                    $scope.clinician = response1.data.data.eligibilityCheck.clinician.fullName;
                                    $scope.speciality = response1.data.data.eligibilityCheck.clinician.specialty;
                                    $scope.serviceCategory = response1.data.data.eligibilityCheck.serviceCategory.description;
                                }
                            }
                        });
                    } else if (response.data.status == -3 || response.data.status == -1) {
                        toastr.warning(data.errors[0], "warning");
                    }
                }
            });
            //$http.get(baseUrl + '/api/User/UserDetails_View/Id?=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            //    $scope.FirstName = data.FirstName;
            //    $scope.MiddleName = data.MiddleName;
            //    $scope.LastName = data.LastName;
            //    $scope.ViewGender = data.GENDER_NAME;
            //    $scope.DOB = DateFormatEdit($filter('date')(data.DOB, "dd-MMM-yyyy"));
            //    $scope.MobileNo = data.MOBILE_NO;
            //    var splitmobno = data.MOBILE_NO.includes('~');
            //    if (splitmobno == true) {
            //        var mobilenoFields = data.MOBILE_NO.split('~');
            //        var countrycode = mobilenoFields[0];
            //        var mNumber = mobilenoFields[1];
            //    } else {
            //        var countrycode = "";
            //        var mNumber = data.MOBILE_NO;
            //    }
            //    var mNumberCC = countrycode + mNumber;

            //    if (countrycode == "") {
            //        var isccodeavail = data.MOBILE_NO;
            //    }
            //    else {
            //        var isccodeavail = mNumber;
            //    }
            //    $scope.MobileNoView = typeof (mNumber) == "undefined" ? isccodeavail : mNumberCC; //mNumber //data.MOBILE_NO : mNumber;
            //    $scope.MobileNo = typeof (mNumber) == "undefined" ? isccodeavail : mNumber; //mNumber //data.MOBILE_NO : mNumber;
            //    /*$scope.check_user_eligibility();*/
            //});
        }

        //$scope.check_user_eligibility = function () {
        //    var formData = {
        //        "emiratesId": "784199765832854",
        //        "clinicianLicense": "GN30148",
        //        "consultationCategoryId": 4,
        //        "countryCode": "+971",
        //        "mobileNumber": "566767676",
        //        "payerId": 305,
        //        "referralLetterRefNo": "",
        //        "serviceCategoryId": 12,
        //        "facilityLicense": "MF2007"
        //    }

        //    //$http.post('https://integration.inhealth.ae/api/eligibilitycheck/addeligibilityrequest', formData).success(function (response_data) {
        //    //    if (response_data.status == "1") {
        //    //        response_data.data['eligibilityId'];
        //    //        console.log(response_data.data['eligibilityId']);
        //    //        $scope.get_user_elibility_details(response_data.data['eligibilityId'], formData, $scope.Id);
        //    //    }
        //    //});

        //    var path = "https://integration.inhealth.ae/api/eligibilitycheck/addeligibilityrequest";
        //    $http({
        //        method: 'POST',
        //        headers: {
        //            "Content-Type": "application/json",
        //            "Authorization": "c2d0928a-7463-428d-bd12-72fda8757089"
        //        },
        //        url: path,
        //        data: formData
        //    }).then(function (response_data) {
        //        if (response_data.status == "1") {
        //            response_data.data['eligibilityId'];
        //            console.log(response_data.data['eligibilityId']);
        //            $scope.get_user_elibility_details(response_data.data['eligibilityId'], formData, $scope.Id);
        //        }
        //    }, function (error) {
        //        console.log(error);

        //    });
        //}

        //$scope.get_user_eligibility_details = function (eligibilityId, formData, user_id) {
        //    var path = 'https://integration.inhealth.ae/api/EligibilityCheck/GetEligibilityRequestDetailsByEligibilityId'
        //    //$http.get(path + '?eligibilityID=' + eligibilityId + '&facilityLicense=MF2007', {header: { "Authorization": "c2d0928a-7463-428d-bd12-72fda8757089" }}).success(function (response_data) {
        //    //    if (response_data.status == "1") {
        //    //        user_eligibility_response = response_data.data['data'];
        //    //        console.log(user_eligibility_response);
        //    //        var eligibility_request = formData;
        //    //        $scope.save_user_eligibility_logs(eligibilityId, eligibility_request, user_eligibility_response, user_id);
        //    //    }
        //    //});
        //    $http({
        //        method: 'GET',
        //        headers: {
        //            "Content-Type": "application/json",
        //            "Authorization": "c2d0928a-7463-428d-bd12-72fda8757089"
        //        },
        //        url: path + '?eligibilityID=' + eligibilityId + '&facilityLicense=MF2007',
        //    }).then(function (response_data) {
        //        if (response_data.status == "1") {
        //            user_eligibility_response = response_data.data['data'];
        //            var eligibility_request = formData;
        //            $scope.save_user_eligibility_logs(eligibilityId, eligibility_request, user_eligibility_response, user_id);
        //        }
        //    }, function (error) {
        //        console.log(error);

        //    });
        //}
        //$scope.save_user_eligibility_logs = function (eligibilityId, eligibility_request, eligibility_response, user_id) {
        //    $http.post(baseUrl + '/api/User/Save_User_Eligibility/eligibiltyId?=' + eligibilityId + '&eligibility_request=' + eligibility_request + '&eligibility_response=' + eligibility_response + '&patient_id=' + user_id).success(function (resp_data) {
        //        if (resp_data == 1) {
        //            console.log('saved logs');
        //        }
        //    });
        //}

        $scope.CancelInsurancePopup = function () {
            angular.element('#InsuranceModel').modal('hide');

        }
        $scope.AddGroupPopup = function () {
            angular.element('#GroupCreateModal').modal('show');
        }
        $scope.CancelGroupPopup = function () {
            angular.element('#GroupCreateModal').modal('hide');
            $scope.GroupClearPopUp();
        }
        $scope.GroupClearPopUp = function () {
            $scope.CreateGroupName = "";
            $scope.Create_GroupId = "0";
        };
        $scope.AddGroup_Insert = function () {
            if (typeof ($scope.CreateGroupName) == "undefined" || $scope.CreateGroupName == "") {
                //alert("Please enter Group Name");
                toastr.warning("Please enter Group Name", "warning");
                return false;
            }
            else {
                var Groupobj = {
                    Id: $scope.Create_GroupId,
                    CreateGroupName: $scope.CreateGroupName,
                    Institution_Id: $window.localStorage['InstitutionId'],

                }
                $http.post(baseUrl + '/api/User/GroupMaster_Insert/', Groupobj).then(function (response) {
                    //alert(data.returnMessage);
                    toastr.success(response.data.returnMessage, "success");
                    if (response.data.flag == "2") // clear only if group is valid and record updated
                    {
                        $scope.CancelGroupPopup();
                        $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                            $scope.GroupTypeList = response.data;
                        });
                    }
                })
            }
        }
        $scope.Cancel_PatientEdit = function () {
            if ($scope.PageParameter == 2) {
                $scope.currentTab = "1";
                $location.path("/PatientList/3");
                $scope.ClearPopUp();
            }
            else if ($scope.PageParameter == 1) {
                $scope.Id = $routeParams.Id;
                $window.localStorage['CurrentTabId'] = $scope.currentTab;
                //$scope.Admin_View($scope.MenuTypeId);
                $location.path("/PatientView/" + $scope.Id + "/1" + "/3");
            }
            else if ($scope.PageParameter == 0) {
                $window.localStorage['CurrentTabId'] = $scope.currentTab;
                $scope.Id = $routeParams.Id;
                $location.path("/PatientView/" + $scope.Id + "/0" + "/3");
            }
        }
        $scope.Cancel_PatientData_Edit = function () {
            $scope.Id = $routeParams.Id;
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $location.path("/PatientView/" + $scope.Id + "/1" + "/3");
        }
        $scope.Cancel_PatientAppproval_Edit = function () {
            $scope.Id = $routeParams.Id;
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $location.path("/PatientView/" + $scope.Id + "/0" + "/3");
        }
        $scope.EditPatientData = function () {
            //$scope.Admin_View($scope.MenuTypeId);
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $scope.Id = $routeParams.Id;
            $location.path("/PatientEdit/" + $scope.Id + "/1" + "/3/4");
        }
        $scope.EditCurrentTab = '1';
        if ($scope.PageParameter == 1) {
            $scope.EditCurrentTab = $window.localStorage['CurrentTabId'];
        }
        else {
            $window.localStorage['CurrentTabId'] = 1;
        }

        //$scope.Active_PatientApproval = function () {
        //    var msg = confirm("Do you like to Approve the Patient?");
        //    if (msg == true) {
        //        $http.get(baseUrl + '/api/PatientApproval/PatientApproval_Active/?Id=' + $routeParams.Id).success(function (data) {
        //            alert(data.Message);
        //            $location.path("/PatientApproval");
        //        }).error(function (data) {
        //            $scope.error = "AN error has occured while deleting patient approval records" + data;
        //        });
        //    }
        //};

        $scope.EditPatientData_Approval = function () {
            //$scope.Admin_View($scope.MenuTypeId);
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $scope.Id = $routeParams.Id;
            $location.path("/PatientEdit/" + $scope.Id + "/0" + "/3/4");
        }


        $scope.MoreInfoPopup = function () {
            $scope.Remarks = "";
            angular.element('#MoreInfoModal').modal('show');
        }
        $scope.Cancel_MoreInfoPopup = function () {
            $scope.Remarks = "";
            angular.element('#MoreInfoModal').modal('hide');
        }
        $scope.Patient_Approval_Id = "0";
        $scope.PatientApproval_History_Insert = function () {
            if (typeof ($scope.Remarks) == "undefined" || $scope.Remarks == "") {
                //alert("Please enter Remarks");
                toastr.warning("Please enter Remarks", "warning");
                return false;
            }
            else {
                var obj = {
                    Id: $scope.Patient_Approval_Id,
                    Patient_Id: $routeParams.Id,
                    Remarks: $scope.Remarks,
                    Created_By: $window.localStorage['UserId']
                };
                $http.post(baseUrl + '/api/PatientApproval/PatientApproval_History_Insert/', obj).then(function (response) {
                    if (response.data == 1) {
                        //alert("Patient Approval History Inserted Successfully");
                        //location.href = 'mailto:' + $scope.EmailId;
                        $scope.Cancel_MoreInfoPopup();
                        $location.path("/PatientApproval");
                    }
                });
            }
        }

        /** Check All Functions for Businner users Group **/
        $scope.BuisnessUsercheckAll = function () {
            if ($scope.SelectedAllBuisnessUser == true) {
                $scope.SelectedAllBuisnessUser = true;
            } else {
                $scope.SelectedAllBuisnessUser = false;
            }
            angular.forEach($scope.BusinessUserFilter, function (row) {
                if (row.UserType_Id != 7)
                    row.SelectedBuisnessuser = $scope.SelectedAllBuisnessUser;
            });
        };

        /**Buisness User Update Assigned Group**/
        $scope.SelectedBuisnessuser = $window.localStorage['UserId'];
        $scope.BuisnessuserAssignGroup = function () {
            var cnt = ($filter('filter')($scope.BusinessUserFilter, 'true')).length;
            if (cnt == 0) {
                //alert("Please select atleast one Clinical User to Assign Group");
                toastr.info("Please select atleast one Clinical User to Assign Group", "info");
            }
            else if (typeof ($scope.AssignedGroup) == "undefined" || $scope.AssignedGroup == "0") {
                //alert("Please select Group");
                toastr.warning("Please select Group", "warning");
                return false;
            }
            else {
                $scope.AssignedGroupList = [];
                angular.forEach($scope.BusinessUserFilter, function (SelectedBuisnessuser, index) {
                    if (SelectedBuisnessuser.SelectedBuisnessuser == true) {
                        var AssignGroupobj = {
                            Id: $scope.AssignedGroup_Id,
                            Group_Id: $scope.AssignedGroup.toString(),
                            User_Id: SelectedBuisnessuser.Id
                        };
                        $scope.AssignedGroupList.push(AssignGroupobj);
                    }
                });
                $http.post(baseUrl + '/api/User/AssignedGroup_Insert/', $scope.AssignedGroupList).then(function (response) {
                    $scope.AssignedGroup = "";
                    if (response.data == 1) {
                        //alert("Group updated successfully");
                        toastr.success("Group updated successfully", "success");
                        $scope.ClearUserGroupPopup();
                        //$scope.AssignedGroup="0";
                        $scope.BusinessUser_List(2);
                    }
                });
            }
        }

        $scope.ClearUserGroupPopup = function () {
            $scope.AssignedGroup = "0";
            $scope.SelectedAllBuisnessUser = false;
            angular.forEach($scope.BusinessUserFilter, function (SelectedBuisnessuser, index) {
                SelectedBuisnessuser.SelectedBuisnessuser = false;
            });
        }
        $scope.Active_PatientApproval = function () {
            $scope.ApprovedPatientList = [];
            var msg = confirm("Do you like to Approve the Patient?");
            if (msg == true) {
                var ApprovePatientobj = {
                    Patient_Id: $routeParams.Id
                };
                $scope.ApprovedPatientList.push(ApprovePatientobj);
                $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).then(function (response) {
                    //alert(data.Message);
                    toastr.success(response.data.Message, "success");
                    if (response.data.ReturnFlag == 1) {
                        $location.path("/PatientApproval");
                    }
                }, function errorCallback(response) {
                    $scope.error = "AN error has occured while deleting patient approval records" + response.data;
                });
            }
        };
        if ($scope.AdminFlowdata > 0) {
            $scope.AddUserPopUP();
        }
    }
]);