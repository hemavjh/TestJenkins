var Usercontroller = angular.module("UserController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


Usercontroller.controller("UserController", ['$scope', '$q', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'InstSub', 'toastr',
    function ($scope, $q, $http, $filter, $routeParams, $location, $window, $ff, InstSub, toastr) {
        //$scope.alertConfrimationVisible = false;
        //$scope.alertType = "alert-danger";
        //$scope.alertConfrimationMessage = "Do you like to deactivate the selected User?";
        //$scope.btn1Type = "btn-success";
        //$scope.btn2Type = "btn-danger";
        //$scope.btn1Text = "Ok";
        //$scope.btn2Text = "Cancel";
        //$scope.alertbtn1Show = true;
        //$scope.alertbtn2Show = true;
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
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.MobileNo_CC = "";
        $scope.DepartmentId = "0";
        $scope.UserTypeId = "0";
        $scope.GenderId = "0";
        $scope.Health_License = "";
        $scope.Title_Id = 0;
        $scope.NationalityId = "0";
        //$scope.DOB = "";
        $scope.ExpiryDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.DOB = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
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
        $scope.CountryList = [];
        $scope.StateList = [];
        $scope.LocationList = [];
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
        $scope.Filter_PatientNo = "";
        $scope.Filter_FirstName = "";
        $scope.Filter_LastName = "";
        $scope.Filter_MRN = "";
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
        $scope.PAST_MEDICALHISTORY = "1";
        $scope.FAMILYHEALTH_PROBLEMHISTORY = "2";
        $scope.MenuTypeId = 0;
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.Pat_UserTypeId = $window.localStorage['UserTypeId'];

        $scope.InsCountryId = "0";
        $scope.InsStateId = "0";
        $scope.InsCityId = "0";
        $scope.PhotoValue = 0;
        $scope.PhotoValue1 = 0;
        $scope.PhotoValue2 = 0;
        $scope.UserPhotoValue = 0;
        $scope.Patient_Type = "1";
        $scope.Emergency_MobileNo = "";
        $scope.CertificateValue = 0;
        var photoview = false;
        var photoview1 = false;
        var photoview2 = false;
        $scope.uploadview = false;
        $scope.Nationaluploadview = false;
        $scope.Insuranceuploadview = false;
        $scope.uploadme = null;
        $scope.uploadme1 = null;
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
        $scope.DoctorInstitutionList = [];

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

        $scope.genderChange = function () {
            var genderId = document.getElementById('Select3').value;
            if (genderId != "0") {
                $('#divGender').removeClass("ng-invalid");
                $('#divGender').addClass("ng-valid");
            }
            else {
                $('#divGender').removeClass("ng-valid");
                $('#divGender').addClass("ng-invalid");
            }
        }

        $scope.departmentChange = function () {
            var deptId = document.getElementById('Select1').value;
            if (deptId != "0") {
                $('#divDepartment').removeClass("ng-invalid");
                $('#divDepartment').addClass("ng-valid");
            }
            else {
                $('#divDepartment').removeClass("ng-valid");
                $('#divDepartment').addClass("ng-invalid");
            }
        }

        $scope.UserTypeChange = function () {
            var userType = document.getElementById('Select2').value;
            if (userType != "0") {
                $('#divUserType').removeClass("ng-invalid");
                $('#divUserType').addClass("ng-valid");
            }
            else {
                $('#divUserType').removeClass("ng-valid");
                $('#divUserType').addClass("ng-invalid");
            }
        }

        $scope.nationalityChange = function () {
            var nationality = document.getElementById('Select5').value;
            if (nationality != "0") {
                $('#divNationality').removeClass("ng-invalid");
                $('#divNationality').addClass("ng-valid");
            }
            else {
                $('#divNationality').removeClass("ng-valid");
                $('#divNationality').addClass("ng-invalid");
            }
        }

        $scope.countryChange = function () {
            var country = document.getElementById('countryselectpicker').value;
            if (country != "0") {
                $('#divCountry').removeClass("ng-invalid");
                $('#divCountry').addClass("ng-valid");
            }
            else {
                $('#divCountry').removeClass("ng-valid");
                $('#divCountry').addClass("ng-invalid");
            }
        }

        $scope.cityChange = function () {
            var city = document.getElementById('SelectCity').value;
            if (city != "0") {
                $('#divCity').removeClass("ng-invalid");
                $('#divCity').addClass("ng-valid");
            }
            else {
                $('#divCity').removeClass("ng-valid");
                $('#divCity').addClass("ng-invalid");
            }
        }

        $scope.stateChange = function () {
            var state = document.getElementById('stateselectpicker').value;
            if (state != "0") {
                $('#divState').removeClass("ng-invalid");
                $('#divState').addClass("ng-valid");
            }
            else {
                $('#divState').removeClass("ng-valid");
                $('#divState').addClass("ng-invalid");
            }
        }
        $scope.dobChange = function () {
            if ($scope.DOB != "") {
                $('#divDOB').removeClass("ng-invalid");
                $('#divDOB').addClass("ng-valid");
            }
            else {
                $('#divDOB').removeClass("ng-valid");
                $('#divDOB').addClass("ng-invalid");
            }
        }
        $scope.TabClick = false;

        $scope.checkTab = function () {
            if ($scope.FirstName != "" && $scope.LastName != "" && $scope.Employee_No != ""
                && $scope.GenderId != "" && $scope.DepartmentId != "" && $scope.EmailId != ""
                && $scope.MobileNo != "") {
                $scope.currentTab = 2;
            }
            else if ($scope.Health_License != "" && $scope.NationalityId != "" && $scope.DOB != "") {
                $scope.currentTab = 3;
            }
            else
                $scope.currentTab = 1;
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
            $('#btnsave').attr("disabled", false);
            $('#btnsave2').attr("disabled", false);
            $("#UserLogo").val('');
            photoview = false;
            photoview1 = false;
            photoview2 = false;
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
                $scope.BusinessUserDropdownList();
            }
            $scope.status = 1;
            $('[data-id="selectpicker"]').prop('disabled', false);
            $scope.SuperAdminDropdownsList();
            $scope.DOB = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            angular.element('#UserModal').modal('show');
        }

        $scope.DefaultCountryState = function () {
            //$scope.CountryId = $scope.InsCountryId;
            //$scope.StateId = $scope.InsStateId;
            //$scope.CountryBased_StateFunction();
            ////$scope.Country_onChange();
            //$scope.CityId = $scope.InsCityId;
            $scope.loadCount = $scope.loadCount - 1;
            $scope.CountryId = $scope.InsCountryId;

            var cId = $scope.CountryId;
            if (cId != "0") {
                $('#divCountry').removeClass("ng-invalid");
                $('#divCountry').addClass("ng-valid");
            }

            $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.InsCountryId).success(function (data) {
                $scope.StateName_List = data;
                $scope.StateId = $scope.InsStateId;
                $scope.loadCount = $scope.loadCount - 1;

                var sId = $scope.StateId;
                if (sId != "0") {
                    $('#divState').removeClass("ng-invalid");
                    $('#divState').addClass("ng-valid");
                }

            });
            $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.InsCountryId + '&StateId=' + $scope.InsStateId).success(function (data) {
                //$scope.LocationName_List =data ;    
                $scope.LocationName_List = data;
                $scope.CityId = $scope.InsCityId;
                $scope.loadCount = $scope.loadCount - 1;

                var cId = $scope.CityId;
                if (cId != "0") {
                    $('#divCity').removeClass("ng-invalid");
                    $('#divCity').addClass("ng-valid");
                }
            });

            //$scope.StateBased_CityFunction();
            ////$scope.State_onChange();

            //$scope.CountryDuplicateId = $scope.CountryId;
            //$scope.StateDuplicateId = $scope.StateId;
            //$scope.LocationDuplicateId = $scope.CityId;

            //if ($scope.CountryFlag = true) {
            //    $scope.CountryId = $scope.CountryDuplicateId;
            //    $scope.CountryFlag = false;
            //}
            //if ($scope.StateFlag = true) {
            //    $scope.StateId = $scope.StateDuplicateId;
            //    $scope.StateFlag = false;
            //}
            //if ($scope.CityFlag = true) {
            //    $scope.CityId = $scope.LocationDuplicateId;
            //    $scope.CityFlag = false;
            //}
        }
        $scope.ViewUserPopUP = function (CatId) {
            $("#UserLogo").val('');
            $scope.uploadme = null;
            $scope.uploadme1 = null;
            $scope.uploadme2 = null;
            $scope.Id = CatId;
            photoview = true;
            photoview1 = false;
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
            $('#btnsave').attr("disabled", true);
            $('#btnsave2').attr("disabled", true);
            $scope.uploadme = null;
            $scope.uploadme1 = null;
            $scope.uploadme2 = null;
            $scope.Id = CatId;
            photoview = true;
            photoview1 = false;
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
        photoview2 = false;
        var request = "";
        $scope.getBase64Image = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.Gender_Name;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.Id;
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.Id;
                    }
                });

                var picPath = "";
                //super clinician           
                if ($scope.UserTypeId == 7 && $scope.GenderId == maleId) {
                    picPath = "../../Images/Clinician_Male.png";
                }
                else if ($scope.UserTypeId == 7 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/Clinician_Female.png";
                }
                //care coordinator
                else if ($scope.UserTypeId == 6 && $scope.GenderId == maleId) {
                    picPath = "../../Images/CC_Male.png";
                }
                else if ($scope.UserTypeId == 6 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/CC_Female.png";
                }
                //care giver
                else if ($scope.UserTypeId == 5 && $scope.GenderId == maleId) {
                    picPath = "../../Images/CG_Male.png";
                }
                else if ($scope.UserTypeId == 5 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/CG_Female.png";
                }
                //clinician
                else if ($scope.UserTypeId == 4 && $scope.GenderId == maleId) {
                    picPath = "../../Images/Clinician_Male.png";
                }
                else if ($scope.UserTypeId == 4 && $scope.GenderId == feMaleId) {
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
                            $scope.uploadme2 = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };

        // patient creation
        $scope.PatientgetBase64Image = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.Gender_Name;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.Id;
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.Id;
                    }
                });

                var picPath = "../../Images/others.png";
                if (typeof ($scope.Gender_Name) != "undefined")
                    if ($scope.GenderId == feMaleId) {
                        picPath = "../../Images/Patient_Female.png";
                    }
                    else if ($scope.GenderId == maleId) {
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
                            $scope.uploadme1 = $scope.uploadmes;
                            $scope.uploadme2 = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };

        //Admin creation
        $scope.AdmingetBase64Image = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.Gender_Name;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.Id;
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.Id;
                    }
                });

                var picPath = "";
                if ($scope.GenderId == feMaleId) {
                    picPath = "../../Images/female.png";
                }
                else if ($scope.GenderId == maleId) {
                    picPath = "../../Images/male.png";
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
                            $scope.uploadme2 = $scope.uploadmes;
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
            $scope.ClearPopUp();
        }

        $scope.AddPatientPopup = function () {
            $scope.currentTab = "1";
            $scope.DropDownListValue = 1;
            var UserTypeId = 2;
            $scope.InstitutionSubscriptionLicensecheck(UserTypeId);
            $scope.AppConfigurationProfileImageList();
            $scope.ExpiryDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $scope.DOB = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $location.path("/PatientCreate/" + "2" + "/" + "3");
        }
        $scope.SubscriptionValidation = function () {
            if ($scope.Id == 0 && $scope.InstitutionId > 0)
                $scope.InstitutionSubscriptionLicensecheck(3);
        }

        $scope.adminInsChange = function () {
            var ins = document.getElementById('selectpicker').value;
            if (ins != "0") {
                $('#divInstitution').removeClass("ng-invalid");
                $('#divInstitution').addClass("ng-valid");
            }
            else {
                $('#divInstitution').removeClass("ng-valid");
                $('#divInstitution').addClass("ng-invalid");
            }
        }

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
            $http.post(baseUrl + '/api/User/InstitutionSubscriptionLicensecheck/', obj).success(function (data) {
                if (data.ReturnFlag == 0) {
                    //alert(data.Message);
                    toastr.warning(data.Message, "warning");
                }
            }).error(function (data) {
                $scope.error = "An error has occurred InstitutionSubscriptionLicensecheck" + data;
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
            $('#btnsave1').attr("disabled", false);
            $scope.AppConfigurationProfileImageList();
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
            $scope.SelectedGroup = "0";
            $scope.SelectedInstitution = "0";
            $scope.SelectedLanguage = "0";
            $scope.Home_PhoneNo = "";
            $scope.HomeAreaCode = "";
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = null;
            $scope.uploadme1 = null;
            $scope.uploadme2 = null;
            $('#UserLogo').val('');
            $('#NationalLogo').val('');
            $('#InsuranceLogo').val('');
            $scope.PhotoValue = 0;
            $scope.PhotoValue1 = 0;
            $scope.PhotoValue2 = 0;
            $scope.resumedoc = "";
            $('#Userdocument').val('');
            $scope.CertificateFileName = "";
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
        }


        // editable time value from app settings	

        $scope.AppConfigurationProfileImageList = function () {
            $scope.ProfileImageSize = "5242880";    // 5 MB
            $scope.ConfigCode = "PROFILE_PICTURE";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).
                success(function (data) {
                    if (data[0] != undefined) {
                        $scope.ProfileImageSize = parseInt(data[0].ConfigValue);
                    }
                });
        }

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }
        //$http.get(baseUrl + '/api/Common/InstitutionNameList/').success(function (data) {
        //    $scope.InstitutionList = data;
        //});
        $scope.SuperAdminDropdownsList = function () {
            if ($scope.LoginType == 1 || $scope.LoginType == 3) {
                $http.get(baseUrl + '/api/Common/InstitutionNameList/?status=' + $scope.status).success(function (data) {
                    $scope.InstitutiondetailsListTemp = [];
                    $scope.InstitutiondetailsListTemp = data;
                    var obj = { "Id": 0, "Name": "Select", "IsActive": 0 };
                    $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
                    //$scope.InstitutiondetailsListTemp.push(obj);
                    $scope.InstitutionList = angular.copy($scope.InstitutiondetailsListTemp);
                    $scope.InstitutionId = $scope.AdminFlowdata.toString();

                    if ($scope.InstitutionId != "0") {
                        $('#divInstitution').removeClass("ng-invalid");
                        $('#divInstitution').addClass("ng-valid");
                    }
                    else {
                        $('#divInstitution').removeClass("ng-valid");
                        $('#divInstitution').addClass("ng-invalid");
                    }

                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(
                    function (data) {
                        $scope.GenderList = data;
                        if ($scope.GenderId != "0") {
                            $('#divGender').removeClass("ng-invalid");
                            $('#divGender').addClass("ng-valid");
                        }
                        else {
                            $('#divGender').removeClass("ng-valid");
                            $('#divGender').addClass("ng-invalid");
                        }
                    });

                $http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                    $scope.DepartmentList = data;
                    if ($scope.DepartmentId != "0") {
                        $('#divDepartment').removeClass("ng-invalid");
                        $('#divDepartment').addClass("ng-valid");
                    }
                    else {
                        $('#divDepartment').removeClass("ng-valid");
                        $('#divDepartment').addClass("ng-invalid");
                    }
                });
            }
        }

        $scope.Businesstab1 = 0;
        $scope.BusinessUserDropdownList = function () {
            if ($scope.LoginType == 2 && $scope.DropDownListValue == 1) {

                $http.get(baseUrl + '/api/User/BusinessUser_UserTypeList/').success(function (data) {
                    console.log(data);
                    $scope.UserTypeList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                    if ($scope.UserTypeId != "0") {
                        $('#divUserType').removeClass("ng-invalid");
                        $('#divUserType').addClass("ng-valid");
                    }
                    else {
                        $('#divUserType').removeClass("ng-valid");
                        $('#divUserType').addClass("ng-invalid");
                    }
                });

                $http.get(baseUrl + '/api/Common/GenderList/').success(
                    function (data) {
                        $scope.GenderList = data;
                        $scope.Businesstab1 = $scope.Businesstab1 + 1;
                    });
                $http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                    $scope.DepartmentList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                    if ($scope.DepartmentId != "0") {
                        $('#divDepartment').removeClass("ng-invalid");
                        $('#divDepartment').addClass("ng-valid");
                    }
                    else {
                        $('#divDepartment').removeClass("ng-valid");
                        $('#divDepartment').addClass("ng-invalid");
                    }
                });
            }
            $scope.Businessuesrclickcount = $scope.Businessuesrclickcount + 1;
        }

        $scope.$watch('Businesstab1', function () {
            if ($scope.Businesstab1 == 3) {
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
                $http.get(baseUrl + '/api/User/DoctorInstitutionList/').success(function (data) {
                    $scope.DoctorInstitutionList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
            if ($scope.Businesstab1 == 5) {
                $http.get(baseUrl + '/api/Common/LanguageList/').success(function (data) {
                    $scope.LanguageList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
        });

        if ($scope.LoginType == 2) {
            $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.GroupTypeList = data;
            });
        }
        //$scope.Patientcreatefunction = function()
        //{
        $scope.tab1 = 0;
        $scope.Patientcreatefunction = function () {
            $http.get(baseUrl + '/api/Common/GenderList/').success(
                function (data) {
                    $scope.GenderList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                    $scope.PatientgetBase64Image();
                });

            $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.GroupTypeList = data;
                $scope.tab1 = $scope.tab1 + 1;
            });

            $http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + 1 + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + 1 + '&EndRowNumber=' + 30).success(function (data) {
                $scope.PayorMasterList = data;
            });

            $scope.ConfigCode = "MRN_PREFIX";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data2) {
                if (data2.length !== 0) {
                    $scope.PrefixMRN = data2[0].ConfigValue;
                }
            });
        }

        $scope.$watch('tab1', function () {
            if ($scope.tab1 == 2) {
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityListTemp = [];
                    $scope.NationalityListTemp = data;
                    /*var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                    $scope.NationalityListTemp.splice(0, 0, obj);*/
                    $scope.NationalityList = angular.copy($scope.NationalityListTemp);
                    $scope.tab1 = $scope.tab1 + 1;
                });

                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusListTemp = [];
                    $scope.MaritalStatusListTemp = data;
                    /* var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                     $scope.MaritalStatusListTemp.splice(0, 0, obj);*/
                    $scope.MaritalStatusList = angular.copy($scope.MaritalStatusListTemp);
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupListTemp = [];
                    $scope.EthnicGroupListTemp = data;
                    /* var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                     $scope.EthnicGroupListTemp.splice(0, 0, obj);*/
                    $scope.EthnicGroupList = angular.copy($scope.EthnicGroupListTemp);
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    /*$scope.BloodGroupList = data;*/
                    $scope.BloodGroupListTemp = [];
                    $scope.BloodGroupListTemp = data;
                    /* var obj = { "Id": 0, "BloodGroup_Name": "Select", "IsActive": 1 };
                     $scope.BloodGroupListTemp.splice(0, 0, obj);*/
                    $scope.BloodGroupList = angular.copy($scope.BloodGroupListTemp);
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/ChronicConditionList/').success(function (data) {
                    $scope.ChronicConditionList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
            }

            if ($scope.tab1 == 7) {
                $http.get(baseUrl + '/api/Common/RelationshipList/').success(function (data) {
                    $scope.RelationshipList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
            }
            if ($scope.tab1 == 8) {
                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.ISact = 1;
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                    $scope.page_size = data1[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;

                    //$http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.SelectedInstitutionId + '&StartRowNumber=' + $scope.PageStart +
                    //    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    //        $scope.PayorMasterList = data;
                    //        $scope.tab1 = $scope.tab1 + 1;
                    //    });
                });
            }

            if ($scope.tab1 == 9) {
                $http.get(baseUrl + '/api/Common/OptionTypeList/').success(function (data) {
                    $scope.OptionTypeList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                //$http.get(baseUrl + '/api/Common/RelationshipList/').success(function (data) {
                //    $scope.RelationshipList = data;
                //    $scope.tab1=$scope.tab1+1;
                //});
                $http.get(baseUrl + '/api/Common/DietTypeList/').success(function (data) {
                    $scope.DietTypeList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/ScheduleList/').success(function (data) {
                    $scope.ScheduleList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });

                $http.get(baseUrl + 'api/User/AllergyTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.AlergySubstanceList = data;
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
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
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
                $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                    //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List').success(function (data) {
                    $scope.CountryNameList = data;
                    //only active Country
                    //$scope.CountryNameList = $ff(data.CountryList, { IsActive: 1 });
                    //$scope.State_Template = data.StateList;
                    //$scope.City_Template = data.LocationList;
                    $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                        $scope.InsCountryId = data.CountryId.toString();
                        $scope.InsStateId = data.StateId.toString();
                        $scope.InsCityId = data.CityId.toString();
                        $scope.DefaultCountryState();
                        /*$scope.CountryBased_StateFunction();
                        //$scope.Country_onChange();
                        //  $scope.CityId = $scope.InsCityId;
                        $scope.StateBased_CityFunction();*/
                    });
                });
            }
        }
        $scope.PayorBased_PlanFunction = function (id) {
            if ($scope.SelectedPayor != "0") {
                $http.get(baseUrl + '/api/PlanMaster/PayorBasedPlan/?Id=' + $scope.SelectedPayor).success(function (data) {
                    $scope.PayorBasedPlanList = data;
                });
            } else {
                $scope.PayorBasedPlanList = [];
            }
        }

        $scope.CountryBased_StateFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CountryId).success(function (data) {
                    $scope.StateName_List = data;
                    $scope.LocationName_List = [];
                    $scope.CityId = "0";
                });
            }
        }
        $scope.StateBased_CityFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CountryId + '&StateId=' + $scope.StateId).success(function (data) {
                    $scope.LocationName_List = data;
                });
            }
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

        $scope.User_Admin_List = function (MenuType) {
            if ($window.localStorage['UserTypeId'] == 1 || $window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.MenuTypeId = MenuType;
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
                $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.MenuTypeId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.emptydata = [];
                    $scope.UserDetailsList = [];
                    $scope.UserDetailsList = data;
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
                $scope.MenuTypeId = MenuType;
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
                $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.MenuTypeId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

                    $scope.BusineessUseremptydata = [];
                    $scope.BusinessUserList = [];
                    $scope.BusinessUserList = data;
                    $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                        $scope.Remaining_No_Of_HealthCareProf = data.Remaining_No_Of_HealthCareProf;
                        $scope.Health_Care_Professionals = data.Health_Care_Professionals;
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
            if ($scope.Patientsearchquery == "" && $scope.Filter_PatientNo == "" && $scope.filter_InsuranceId == "" && $scope.filter_NationalityId == "0" && $scope.filter_MOBILE_NO == "" && $scope.filter_Email == "" && $scope.Filter_FirstName == "" && $scope.Filter_LastName == "" && $scope.Filter_MRN == "") {
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
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                    $scope.page_size = data1[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $scope.Input_Type = 1;
                    $scope.SearchEncryptedQuery = $scope.searchquery;
                    $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                        $scope.Remaining_No_Of_Patient = data.Remaining_No_Of_Patient;
                        $scope.Patients = data.No_Of_Patients;
                        //$scope.Created_No_Of_HealthCareProf = data.Created_No_Of_HealthCareProf;
                    });
                    var obj = {
                        InputType: $scope.Input_Type,
                        DecryptInput: $scope.SearchEncryptedQuery
                    };
                    $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                        $scope.SearchEncryptedQuery = data;

                        allpatientlist();
                    });
                });
                $scope.loadCount = 0;
                if ($scope.LoginType == 3) {
                    $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                        $scope.GroupTypeList = data;
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
                '&EndRowNumber=' + $scope.PageEnd + '&SearchQuery=' + $scope.searchquery + '&SearchEncryptedQuery=' + $scope.SearchEncryptedQuery).success(function (data) {
                    $("#chatLoaderPV").hide();
                    if (data.length == 0) {
                        $scope.SearchMsg = "No Data Available";
                    }
                    $scope.Patientemptydata = [];
                    $scope.PatientList = [];
                    $scope.PatientList = data;
                    $scope.Patientemptydata = data;
                    $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                    $scope.total_pages = Math.ceil(($scope.PatientCount) / ($scope.page_size));


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
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.UserDetailsList, function (value) {
                    return angular.lowercase(value.InstitutionName).match(searchstring) ||
                        angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.Department_Name).match(searchstring) ||
                        angular.lowercase(value.EMAILID).match(searchstring) ||
                        angular.lowercase(value.EMPLOYEMENTNO).match(searchstring);
                });
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        $scope.filterBusinessList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.Business_Usersearchquery);
            if ($scope.Business_Usersearchquery == "") {
                $scope.BusinessUserFilter = angular.copy($scope.BusinessUserList);
            }
            else {
                $scope.BusinessUserFilter = $ff($scope.BusinessUserList, function (value) {
                    return angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.EMAILID).match(searchstring) ||
                        angular.lowercase(value.Department_Name).match(searchstring) ||
                        angular.lowercase(value.EMPLOYEMENTNO).match(searchstring) ||
                        angular.lowercase(value.UserName).match(searchstring) ||
                        angular.lowercase(value.GroupName).match(searchstring);
                });
                if ($scope.BusinessUserFilter.length > 0) {
                    $scope.BusinessUserflag = 1;
                }
                else {
                    $scope.BusinessUserflag = 0;
                }
            }
        }


        $scope.PatientSearch = function () {
            if ($scope.Patientsearchquery == "") {
                allpatientlist();
            } else {
                getallpatientlist();
            }
        }

        $scope.PatientAdvanceSearch = function () {
            getallpatientlist();
        }

        getallpatientlist = function () {
            $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
            $http.get(baseUrl + '/api/User/Search_Patient_List?IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId'] + '&SearchQuery=' + $scope.Patientsearchquery + '&PATIENTNO=' + $scope.Filter_PatientNo
                + '&INSURANCEID=' + $scope.filter_InsuranceId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&MOBILE_NO=' +
                $scope.filter_MOBILE_NO + '&EMAILID=' + $scope.filter_Email + '&FIRSTNAME=' + $scope.Filter_FirstName + '&LASTNAME=' + $scope.Filter_LastName + '&MRNNO=' + $scope.Filter_MRN + '&StartRowNumber=' + $scope.PageStart +
                '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    if (data.length == 0) {
                        $scope.SearchMsg = "No Data Available";
                    }
                    $scope.Patientemptydata = [];
                    $scope.PatientList = [];
                    $scope.PatientList = data;
                    $scope.Patientemptydata = data;
                    if ($scope.PatientList.length > 0) {
                        $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                        $scope.total_pages = Math.ceil(($scope.PatientCount) / ($scope.page_size));
                    }
                });
        }

        //getallpatientlist();


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
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.AdmingetBase64Image();
        };


        $scope.imageclear = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.getBase64Image();
        };

        $scope.imageclearPatient = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview2 = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.PatientgetBase64Image();
        };

        $scope.imageclearPatientNational = function () {
            $scope.NationalPhoto = "";
            $scope.NationalPhotoFilename = "";
            $scope.uploadme1 = "";
            $('#NationalLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview2 = false;
            $scope.Nationaluploadview = false;
            $scope.NationalPhotoValue = 0;
            $scope.PatientgetBase64Image();
        };
        $scope.imageclearPatientInsurance = function () {
            $scope.InsurancePhoto = "";
            $scope.InsurancePhotoFilename = "";
            $scope.uploadme2 = "";
            $('#InsuranceLogo').val('');
            photoview = false;
            photoview1 = false;
            photoview2 = false;
            $scope.Insuranceuploadview = false;
            $scope.InsurancePhotoValue = 0;
            $scope.PatientgetBase64Image();
        };

        /* Read file name for the  Photo and file */
        /*$scope.Editfile=[]*/
        $scope.EditdocfileChange = function (e) {
            if ($('#EditDocument')[0].files[0] != undefined) {
                $scope.CertificateFileName = $('#EditDocument')[0].files[0]['name'];
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

        /* Read file name for the  National Photo and file */
        $scope.NationalphotoChange = function () {
            if ($('#NationalLogo')[0].files[0] != undefined) {
                $scope.NationalPhotoFilename = $('#NationalLogo')[0].files[0]['name'];
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
                    return false;
                }
                else if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                    //alert("Please enter First Name");
                    toastr.warning("Please enter First Name", "Warning");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                    //alert("Please enter Last Name");
                    toastr.warning("Please enter Last Name", "Warning");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                /*else if (typeof ($scope.Employee_No) == "undefined" || $scope.Employee_No == "") {
                    alert("Please enter Employment No.");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                    alert("Please select Gender");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.DepartmentId) == "undefined" || $scope.DepartmentId == "0") {
                    alert("Please select Department");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }*/
                else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                    //alert("Please enter Email");
                    toastr.warning("Please enter Email", "Warning");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (EmailFormate($scope.EmailId) == false) {
                    //alert("Invalid email format");
                    toastr.warning("Invalid email format", "Warning");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                    //alert("Please enter Mobile No.");
                    toastr.warning("Please enter Mobile No.", "Warning");
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
                        return false;
                    }
                }
            }
            if ($scope.MenuTypeId == 2) {
                $scope.DOB = DateFormatEdit($filter('date')(document.getElementById("Date_Birth").value, "dd-MMM-yyyy"));
                if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                    //alert("Please select Type of User");
                    toastr.warning("Please select Type of User", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.Health_License) == "undefined" || $scope.Health_License == "") {
                    //alert("Please enter Health License under Additional Info");
                    toastr.warning("Please enter Health License under Additional Info", "warning");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                    //alert("Please select Nationality under Additional Info");
                    toastr.warning("Please select Nationality under Additional Info", "warning");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
                    //alert("Please select Date of Birth under Additional info");
                    toastr.warning("Please select Date of Birth under Additional info", "warning");
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
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                    //alert("Please select Country under Address Info");
                    toastr.warning("Please select Country under Address Info", "warning");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.StateId) == "undefined" || $scope.StateId == "0") {
                    //alert("Please select State under Address Info");
                    toastr.warning("Please select State under Address Info", "warning");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.CityId) == "undefined" || $scope.CityId == "0") {
                    //alert("Please select City under Address Info");
                    toastr.warning("Please select City under Address Info", "warning");
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
                        return false;
                    }
                }
            }
            if ($scope.MenuTypeId == 3) {
                $scope.ExpiryDate = DateFormatEdit($filter('date')(document.getElementById("Expiry_Date").value, "dd-MMM-yyyy"));
                $scope.DOB = DateFormatEdit($filter('date')(document.getElementById("Date_Birth").value, "dd-MMM-yyyy"));
                if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                    //alert("Please enter First Name");
                    toastr.warning("Please enter First Name", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                    //alert("Please enter Last Name");
                    toastr.warning("Please enter Last Name", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                    //alert("Please select Gender");
                    toastr.warning("Please select Gender", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                //else if (typeof ($scope.MNR_No) == "undefined" || $scope.MNR_No == "") {
                //    alert("Please enter MNR No.");
                //    $scope.currentTab = 1;
                //    return false;
                //}
                else if (typeof ($scope.NationalId) == "undefined" || $scope.NationalId == "") {
                    //alert("Please enter National ID");
                    toastr.warning("Please enter National ID", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.InsuranceId) == "undefined" || $scope.InsuranceId == "") {
                    //alert("Please enter Insurance ID");
                    toastr.warning("Please enter Insurance ID", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                    //alert("Please enter Email");
                    toastr.warning("Please enter Email", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.EmailId) == false) {
                    //alert("Invalid email format");
                    toastr.warning("Invalid email format", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.Google_EmailId) == false) {
                    //alert("Invalid Google Email format");
                    toastr.warning("Invalid Google Email format", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.FB_EmailId) == false) {
                    //alert("Invalid Facebook Email format");
                    toastr.warning("Invalid Facebook Email format", "warning");
                    $scope.currentTab = 1;
                    return false;
                } else if (EmailFormate($scope.appleUserID) == false) {
                    //alert("Invalid Apple Email format");
                    toastr.warning("Invalid Apple Email format", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                    //alert("Please enter Mobile No.");
                    toastr.warning("Please enter Mobile No.", "warning");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                    //alert("Please select Nationality under Additional Info");
                    toastr.warning("Please select Nationality under Additional Info", "warning");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.MaritalStatusId) == "undefined" || $scope.MaritalStatusId == "0") {
                    //alert("Please select Marital Status under Additional Info");
                    toastr.warning("Please select Marital Status under Additional Info", "warning");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.BloodGroupId) == "undefined" || $scope.BloodGroupId == "0") {
                    //alert("Please select Blood Group under Additional Info");
                    toastr.warning("Please select Blood Group under Additional Info", "warning");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.EthnicGroupId) == "undefined" || $scope.EthnicGroupId == "0") {
                    //alert("Please select Ethnic Group under Additional Info");
                    toastr.warning("Please select Ethnic Group under Additional Info", "warning");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
                    //alert("Please select Date of Birth under Additional info");
                    toastr.warning("Please select Date of Birth under Additional info", "warning");
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
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                    //alert("Please select Country under Address Info");
                    toastr.warning("Please select Country under Address Info", "warning");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.StateId) == "undefined" || $scope.StateId == "0") {
                    //alert("Please select State under Address Info");
                    toastr.warning("Please select State under Address Info", "warning");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.CityId) == "undefined" || $scope.CityId == "0") {
                    //alert("Please select City under Address Info");
                    toastr.warning("Please select City under Address Info", "warning");
                    $scope.currentTab = 3;
                    return false;
                }
                if ($scope.CURRENTLY_TAKEMEDICINE == 1) {
                    if (($ff($scope.AddMedicines, { Status: 1 }).length == 0)) {
                        //alert("Please add atleast one row for Currrently Take Medicine under Medical Info");
                        toastr.warning("Please add atleast one row for Currrently Take Medicine under Medical Info", "warning");
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
                        $scope.currentTab = 5;
                        return false;
                    }
                }
                if ($scope.FAMILYHEALTH_PROBLEMHISTORY == 1) {
                    if (($ff($scope.AddHealthProblem, { Status: 1 }).length == 0)) {
                        //alert("Please add atleast one row for family Health Problem History under Medical Info");
                        toastr.warning("Please add atleast one row for family Health Problem History under Medical Info", "warning");
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
                            $scope.currentTab = 5;
                            return false;
                        }
                        if ($scope.AddHealthProblem.length < 1 || HealthProb_Item == 1) {
                            //alert("Please enter Health Problem under Medical Info");
                            toastr.warning("Please enter Health Problem under Medical Info", "warning");
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
                    $scope.currentTab = 1;
                    return false;
                }
            }
            if ($scope.Editresumedoc != null) {
                if ($scope.Editresumedoc != undefined && $scope.Editresumedoc != null && $scope.Editresumedoc != "") {
                    if ($scope.dataURItoBlob($scope.Editresumedoc).size > 1048576) {
                        //alert("Certificate file size cannot be greater than 1MB");
                        toastr.warning("Certificate file size cannot be greater than 1MB", "warning");
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

            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                if (data[0] != undefined) {
                    $scope.JAge = parseInt(data[0].ConfigValue);
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
            $scope.Today_Date = $filter('date')(new Date(), 'DD-MMM-YYYY');
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
            }
            $scope.EditPatientGroupId = 0;
            $scope.GroupTypeList = [];
            $scope.EditPatientGroup = function () {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.GroupTypeList = data;
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
                $http.post(baseUrl + '/api/User/PatientGroupEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj1).success(function (data) {
                    $("#chatLoaderPV").hide();
                    if (data == 1) {
                        $scope.EditPatientGroupId = 0;
                        $scope.Admin_View($scope.PatientMenu);
                    }
                    if (data == 0) {
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
                $http.post(baseUrl + '/api/User/PatientChronicEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj1).success(function (data) {
                    $("#chatLoaderPV").hide();
                    if (data == 1) {
                        $scope.EditPatientChronicCondition = 0;
                        $scope.Admin_View($scope.PatientMenu);
                    }
                });
            }
        }
        $scope.Admin_View = function (MenuType) {
            $scope.ChronicConditionList = [];
            $("#chatLoaderPV").show();
            if (($scope.LoginType == 3 || $scope.LoginType == 2) && $scope.EditParameter == 4) {
                $scope.DropDownListValue = 4;
            }
            $http.get(baseUrl + '/api/Common/ChronicConditionList/').success(function (data) {
                $scope.ChronicConditionList = data;
            });
            $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                $scope.GenderList = data;
            });
            $http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                $scope.DepartmentList = data;
            });
            $http.get(baseUrl + '/api/User/BusinessUser_UserTypeList/').success(function (data) {
                $scope.UserTypeList = data;
            });
            $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                $scope.NationalityList = data;
            });
            $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                $scope.MaritalStatusListTemp = [];
                $scope.MaritalStatusListTemp = data;
                $scope.MaritalStatusList = angular.copy($scope.MaritalStatusListTemp);
            });
            $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                $scope.EthnicGroupListTemp = [];
                $scope.EthnicGroupListTemp = data;
                $scope.EthnicGroupList = angular.copy($scope.EthnicGroupListTemp);
            });
            $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                $scope.BloodGroupListTemp = [];
                $scope.BloodGroupListTemp = data;
                $scope.BloodGroupList = angular.copy($scope.BloodGroupListTemp);
            });

            $scope.loadCount = 3;
            $("#chatLoaderPV").show();
            photoview = true;
            photoview1 = true;
            photoview2 = true;
            var methodcnt = 2;
            var methodcnt1 = 2;
            var methodcnt2 = 2;
            $scope.MenuTypeId = MenuType;
            if (MenuType == 3) {
                if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                    $scope.Id = $routeParams.Id;
                    $scope.DuplicatesId = $routeParams.Id;
                }
            }
            $scope.EditSelectedGroup = [];
            $scope.EditPayorId = [];
            $scope.EditPlanId = [];
            $scope.SelectedGroup = [];
            $scope.EditSelectedInstitution = [];
            $scope.SelectedInstitution = [];
            $scope.EditSelectedLanguage = [];
            $scope.SelectedLanguage = [];
            $scope.EditSelectedChronicondition = [];
            $scope.SelectedChronicCondition = [];
            $scope.SelectedChronicConditionEdit = [];
            $scope.EditChronicOption = 0;
            if ($scope.Id > 0) {
                $http.get(baseUrl + '/api/User/UserDetails_GetPhoto/?Id=' + $scope.Id).success(function (data1) {
                    methodcnt = methodcnt - 1;
                    if (methodcnt == 0)
                        $scope.uploadview = true;
                    if (data1.PhotoBlob != null) {
                        $scope.uploadme = 'data:image/png;base64,' + data1.PhotoBlob;

                    }
                    else {
                        $scope.uploadme = null;
                    }
                });

                if ($scope.LoginType == 2) {
                    $http.get(baseUrl + '/api/User/UserDetails_GetCertificate/?Id=' + $scope.Id).success(function (data) {
                        if (data.CertificateBlob != null) {
                            $scope.Editresumedoc = 'data:image/png;base64,' + data.CertificateBlob;
                        }
                        else {
                            $scope.Editresumedoc = null;
                        }
                    })
                }

                $http.get(baseUrl + '/api/User/UserDetails_GetNationalPhoto/?Id=' + $scope.Id).success(function (data) {
                    methodcnt1 = methodcnt1 - 1;
                    if (methodcnt1 == 0)
                        $scope.Nationaluploadview = true;
                    if (data.NationalPhotoBlob != null) {
                        $scope.uploadme1 = 'data:image/png;base64,' + data.NationalPhotoBlob;

                    }
                    else {
                        $scope.uploadme1 = null;
                    }
                });
                $http.get(baseUrl + '/api/User/UserDetails_GetInsurancePhoto/?Id=' + $scope.Id).success(function (data) {
                    methodcnt2 = methodcnt2 - 1;
                    if (methodcnt2 == 0)
                        $scope.Insuranceuploadview = true;
                    if (data.InsurancePhotoBlob != null) {
                        $scope.uploadme2 = 'data:image/png;base64,' + data.InsurancePhotoBlob;

                    }
                    else {
                        $scope.uploadme2 = null;
                    }
                });
                $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.Chroniccc = data.ChronicCc;
                    $scope.Chroniccg = data.ChronicCg;
                    $scope.Chroniccl = data.ChronicCl;
                    $scope.Chronicsc = data.ChronicSc;
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
                });

                $http.get(baseUrl + '/api/User/GETPATIENTINSTITUTION/?ID=' + $scope.Id).success(function (data) {
                    $("#chatLoaderPV").hide();
                    var PatientInstituteId = data[0].Institution_Id;

                    if ($window.localStorage['UserTypeId'] == 1 || PatientInstituteId == $window.localStorage['InstitutionId']) {
                        $http.get(baseUrl + '/api/User/UserDetails_View/Id?=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            $scope.Id = data.Id;
                            $scope.rowId = data.Id;
                            $scope.InstitutionId = data.INSTITUTION_ID.toString();
                            if ($scope.InstitutionId != "0" || $scope.InstitutionId != "") {
                                $('#divInstitution').removeClass("ng-invalid");
                                $('#divInstitution').addClass("ng-valid");
                            }
                            else {
                                $('#divInstitution').removeClass("ng-valid");
                                $('#divInstitution').addClass("ng-invalid");
                            }

                            $scope.DepartmentId = data.DEPARTMENT_ID.toString();
                            if ($scope.DepartmentId != "0" || $scope.DepartmentId != "") {
                                $('#divDepartment').removeClass("ng-invalid");
                                $('#divDepartment').addClass("ng-valid");
                            }
                            else {
                                $('#divDepartment').removeClass("ng-valid");
                                $('#divDepartment').addClass("ng-invalid");
                            }
                            $scope.FirstName = data.FirstName;
                            $scope.MiddleName = data.MiddleName;
                            $scope.LastName = data.LastName;
                            $scope.Employee_No = data.EMPLOYEMENTNO;
                            $scope.EmailId = data.EMAILID;
                            $scope.MobileNo = data.MOBILE_NO;
                            var mobilenoFields = data.MOBILE_NO.split('~');
                            var countrycode = mobilenoFields[0];
                            var mNumber = mobilenoFields[1];
                            var mNumberCC = countrycode + mNumber;
                            //$scope.MobileNo = data.MOBILE_NO;
                            $scope.MobileNo = typeof (mNumber) == "undefined" ? data.MOBILE_NO : mNumber;
                            //inputPhoneNo.setNumber(mNumberCC);
                            $scope.ViewDepartmentName = data.Department_Name;
                            $scope.ViewInstitutionName = data.InstitutionName;
                            $scope.Photo = data.Photo;
                            $scope.UserLogo = data.Photo;
                            //$scope.uploadme = data.Photo;
                            $scope.FileName = data.FileName;
                            $scope.PhotoFullpath = data.Photo_Fullpath;
                            $scope.NationalPhotoFullpath = data.NationalPhotoFullpath;
                            $scope.InsurancePhotoFullpath = data.InsurancePhotoFullpath;
                            $scope.UserTypeId = data.UserType_Id.toString();
                            if ($scope.UserTypeId != "0" || $scope.UserTypeId != "") {
                                $('#divUserType').removeClass("ng-invalid");
                                $('#divUserType').addClass("ng-valid");
                            }
                            else {
                                $('#divUserType').removeClass("ng-valid");
                                $('#divUserType').addClass("ng-invalid");
                            }
                            $scope.Health_License = data.HEALTH_LICENSE;
                            $scope.File_Name = data.FILE_NAME;
                            $scope.CertificateFileName = data.FILE_NAME;
                            $scope.Resume = data.FILE_NAME;
                            $scope.resumedoc = data.FILE_NAME;
                            $scope.File_FullPath = data.FILE_FULLPATH;
                            $scope.Upload_FileName = data.UPLOAD_FILENAME;
                            $scope.GenderId = data.GENDER_ID.toString();
                            if ($scope.GenderId != "0" || $scope.GenderId != "") {
                                $('#divGender').removeClass("ng-invalid");
                                $('#divGender').addClass("ng-valid");
                            }
                            else {
                                $('#divGender').removeClass("ng-valid");
                                $('#divGender').addClass("ng-invalid");
                            }
                            $scope.NationalityId = data.NATIONALITY_ID.toString();
                            if ($scope.NationalityId != "0" || $scope.NationalityId !="") {
                                $('#divNationality').removeClass("ng-invalid");
                                $('#divNationality').addClass("ng-valid");
                            }
                            else {
                                $('#divNationality').removeClass("ng-valid");
                                $('#divNationality').addClass("ng-invalid");
                            }
                            $scope.EthnicGroupId = data.ETHINICGROUP_ID.toString();
                            $scope.DOB = DateFormatEdit($filter('date')(data.DOB, "dd-MMM-yyyy"));
                            if ($scope.DOB != "" || $scope.DOB != null) {
                                $('#divDOB').removeClass("ng-invalid");
                                $('#divDOB').addClass("ng-valid");
                            }
                            else {
                                $('#divDOB').removeClass("ng-valid");
                                $('#divDOB').addClass("ng-invalid");
                            }
                            $scope.HomeAreaCode = data.HOME_AREACODE;
                            $scope.Home_PhoneNo = data.HOME_PHONENO;
                            $scope.MobileAreaCode = data.MOBIL_AREACODE;
                            $scope.PostalZipCode = data.POSTEL_ZIPCODE;
                            $scope.EMR_Avalability = data.EMR_AVAILABILITY;
                            $scope.Address1 = data.ADDRESS1;
                            $scope.Address2 = data.ADDRESS2;
                            $scope.Address3 = data.ADDRESS3;
                            $scope.CountryId = data.COUNTRY_ID.toString();
                            $scope.StateId = data.STATE_ID.toString();
                            $scope.CityId = data.CITY_ID.toString();
                            if ($scope.CountryId != "0" || $scope.CountryId != "") {
                                $('#divCountry').removeClass("ng-invalid");
                                $('#divCountry').addClass("ng-valid");
                            }
                            else {
                                $('#divCountry').removeClass("ng-valid");
                                $('#divCountry').addClass("ng-invalid");
                            }
                            if ($scope.StateId != "0" || $scope.StateId != "") {
                                $('#divState').removeClass("ng-invalid");
                                $('#divState').addClass("ng-valid");
                            }
                            else {
                                $('#divState').removeClass("ng-valid");
                                $('#divState').addClass("ng-invalid");
                            }
                            if ($scope.CityId != "0" || $scope.CityId != "") {
                                $('#divCity').removeClass("ng-invalid");
                                $('#divCity').addClass("ng-valid");
                            }
                            else {
                                $('#divCity').removeClass("ng-valid");
                                $('#divCity').addClass("ng-invalid");
                            }
                            $scope.CountryDuplicateId = $scope.CountryId;
                            $scope.CountryFlag = true;
                            $scope.StateDuplicateId = $scope.StateId;
                            $scope.StateFlag = true;
                            $scope.LocationDuplicateId = $scope.CityId;
                            $scope.CityFlag = true;
                            if ($scope.DropDownListValue == 4) {

                                $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                                    $scope.CountryNameList = data;
                                    if ($scope.CountryFlag == true) {
                                        $scope.CountryId = $scope.CountryDuplicateId;
                                        $scope.CountryFlag = false;
                                        $scope.loadCount = $scope.loadCount - 1;
                                    }
                                });
                                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + data.COUNTRY_ID.toString()).success(function (data) {
                                    $scope.StateName_List = data;
                                    if ($scope.StateFlag == true) {
                                        $scope.StateId = $scope.StateDuplicateId;
                                        $scope.StateFlag = false;
                                        $scope.loadCount = $scope.loadCount - 1;
                                    }
                                });
                                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + data.COUNTRY_ID.toString() + '&StateId=' + data.STATE_ID.toString()).success(function (data) {
                                    //$scope.LocationName_List =data ;    
                                    $scope.LocationName_List = data;
                                    if ($scope.CityFlag == true) {
                                        $scope.CityId = $scope.LocationDuplicateId;
                                        $scope.CityFlag = false;
                                        $scope.loadCount = $scope.loadCount - 1;
                                    }
                                });
                            }
                            $scope.MaritalStatusId = data.MARITALSTATUS_ID.toString();
                            $scope.BloodGroupId = data.BLOODGROUP_ID.toString();
                            $scope.PatientNo = data.PATIENTNO;
                            $scope.Createdby_ShortName = data.Createdby_ShortName;
                            $scope.InsuranceId = data.INSURANCEID;
                            $scope.MNR_No = data.MNR_NO;
                            $scope.DropDownListValue = 3;
                            $scope.NationalId = data.NATIONALID;
                            $scope.EthnicGroup = data.EthnicGroup;
                            $scope.ViewGender = data.GENDER_NAME;
                            $scope.ViewNationality = data.Nationality;
                            $scope.ViewUserName = data.UserName;
                            $scope.ViewGroupName = data.GroupName;
                            $scope.ViewCountryName = data.COUNTRY_NAME;
                            $scope.ViewStateName = data.StateName;
                            $scope.ViewLocationName = data.LocationName;
                            $scope.Institution = data.Institution;
                            $scope.LanguageKnown = data.LanguageKnown;
                            $scope.MaritalStatus = data.MaritalStatus;
                            $scope.ViewBloodGroup = data.BLOODGROUP_NAME;
                            $scope.RelationShipName = data.RelationShipName;
                            $scope.DietDescribe = data.DietDescribe;
                            $scope.AlergySubstance = data.AlergySubstance;
                            $scope.ChronicCondition = data.ChronicCondition;
                            $scope.EXCERCISE_SCHEDULE = data.EXCERCISE_SCHEDULE;
                            $scope.SMOKESUBSTANCE = data.SMOKESUBSTANCE;
                            $scope.ALCOHALSUBSTANCE = data.ALCOHALSUBSTANCE;
                            $scope.CAFFEINATED_BEVERAGES = data.CAFFEINATED_BEVERAGES;
                            $scope.DIETDESCRIBE_ID = data.DIETDESCRIBE_ID.toString();
                            $scope.EXCERCISE_SCHEDULEID = data.EXCERCISE_SCHEDULEID.toString();
                            $scope.ALERGYSUBSTANCE_ID = data.ALERGYSUBSTANCE_ID.toString();
                            $scope.SMOKESUBSTANCE_ID = data.SMOKESUBSTANCE_ID.toString();
                            $scope.ALCOHALSUBSTANCE_ID = data.ALCOHALSUBSTANCE_ID.toString();
                            $scope.CAFFEINATED_BEVERAGESID = data.CAFFEINATED_BEVERAGESID.toString();
                            $scope.EMERG_CONT_RELATIONSHIP_ID = data.EMERG_CONT_RELATIONSHIP_ID.toString();
                            $scope.CURRENTLY_TAKEMEDICINE = data.CURRENTLY_TAKEMEDICINE;
                            $scope.PAST_MEDICALHISTORY = data.PAST_MEDICALHISTORY;
                            $scope.FAMILYHEALTH_PROBLEMHISTORY = data.FAMILYHEALTH_PROBLEMHISTORY;
                            $scope.VACCINATIONS = data.VACCINATIONS;
                            $scope.EXCERCISE_TEXT = data.EXCERCISE_TEXT;
                            $scope.ALERGYSUBSTANCE_TEXT = data.ALERGYSUBSTANCE_TEXT;
                            $scope.SMOKESUBSTANCE_TEXT = data.SMOKESUBSTANCE_TEXT;
                            $scope.ALCOHALSUBSTANCE_TEXT = data.ALCOHALSUBSTANCE_TEXT;
                            $scope.CAFFEINATEDBEVERAGES_TEXT = data.CAFFEINATEDBEVERAGES_TEXT;
                            $scope.EMERG_CONT_FIRSTNAME = data.EMERG_CONT_FIRSTNAME;
                            $scope.EMERG_CONT_MIDDLENAME = data.EMERG_CONT_MIDDLENAME;
                            $scope.EMERG_CONT_LASTNAME = data.EMERG_CONT_LASTNAME;
                            $scope.Emergency_MobileNo = data.Emergency_MobileNo;
                            $scope.Google_EmailId = data.GOOGLE_EMAILID;
                            $scope.FB_EmailId = data.FB_EMAILID;
                            $scope.appleUserID = data.appleUserID;
                            $scope.Patient_Type = data.Patient_Type;
                            $scope.PATIENT_ID = data.PatientId;
                            $scope.Diabetic = data.DIABETIC.toString();
                            $scope.HyperTension = data.HYPERTENSION.toString();
                            $scope.Cholestrol = data.CHOLESTEROL.toString();

                            $scope.ViewDiabetic = data.Diabetic_Option;
                            $scope.ViewCholestrol = data.Cholesterol_Option;
                            $scope.ViewHyperTension = data.HyperTension_Option;

                            $scope.AddMedicines = data.AddMedicines;
                            $scope.AddMedicalHistory = data.AddMedicalHistory;
                            $scope.AddHealthProblem = data.AddHealthProblem;
                            $scope.ApprovalFlag = data.Approval_flag;
                            $scope.PayorName = data.PayorName;
                            $scope.PlanName = data.PlanName;
                            $scope.Member_ID = data.Memberid;
                            $scope.Policy_Number = data.PolicyNumber;
                            $scope.Reference_ID = data.RefernceId;
                            $scope.ExpiryDate = DateFormatEdit($filter('date')(data.ExpiryDate, "dd-MMM-yyyy"));
                            $scope.ConfigCode = "PATIENTPAGE_COUNT";
                            $scope.ISact = 1;
                            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                            setTimeout(function () {
                                $scope.GenderId = data.GENDER_ID.toString();
                                $scope.NationalityId = data.NATIONALITY_ID.toString();
                                $scope.MaritalStatusId = data.MARITALSTATUS_ID.toString();
                                $scope.EthnicGroupId = data.ETHINICGROUP_ID;
                                $scope.BloodGroupId = data.BLOODGROUP_ID.toString();
                                $scope.UserTypeId = data.UserType_Id.toString();
                                $scope.DepartmentId = data.DEPARTMENT_ID.toString();
                                $scope.EthnicGroup = data.EthnicGroup.toString();
                                $scope.MaritalStatusId = data.MARITALSTATUS_ID.toString();
                                $scope.BloodGroupId = data.BLOODGROUP_ID.toString();
                                $('#btnsave').attr("disabled", false);
                                $('#btnsave2').attr("disabled", false);
                            }, 10000);

                            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                                if (data1.length != 0) {
                                    $scope.page_size = data1[0].ConfigValue;
                                }
                                //$scope.page_size = data1[0].ConfigValue;
                                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                                $scope.PageEnd = $scope.current_page * $scope.page_size;
                                $http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.SelectedInstitutionId + '&StartRowNumber=' + $scope.PageStart +
                                    '&EndRowNumber=' + $scope.PageEnd).success(function (data1) {
                                        $scope.PayorMasterList = data1;
                                        //$scope.SelectedPayor = "";
                                        if (data.PayorId != null && data.PayorId != "") {
                                            $scope.EditPayorId = data.PayorId;
                                            //$scope.SelectedPayor.push($scope.EditPayorId);
                                            $http.get(baseUrl + '/api/PlanMaster/PayorBasedPlan/?Id=' + data.PayorId).success(function (data) {
                                                $scope.PayorBasedPlanList = data;
                                                if (data.length != 0) {
                                                    //$scope.SelectedPlan = "";
                                                    $scope.EditPlanId = "";
                                                    $scope.EditPlanId = data[0].Id.toString();
                                                    $scope.PlanName = data[0].PlanName;
                                                    //$scope.SelectedPlan.push($scope.EditPlanId);
                                                    setTimeout(function () {
                                                        $scope.SelectedPayor = $scope.EditPayorId;
                                                        $scope.SelectedPlan = $scope.EditPlanId;
                                                    }, 5000);
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
                            angular.forEach(data.SelectedGroupList, function (value, index) {
                                $scope.EditSelectedGroup.push(value.Group_Id);
                                $scope.SelectedGroup = $scope.EditSelectedGroup;
                            });
                            angular.forEach(data.SelectedInstitutionList, function (value, index) {
                                $scope.EditSelectedInstitution.push(value.Institution_Id);
                                $scope.SelectedInstitution = $scope.EditSelectedInstitution;
                            });
                            angular.forEach(data.SelectedLanguageList, function (value, index) {
                                $scope.EditSelectedLanguage.push(value.Language_Id);
                                $scope.SelectedLanguage = $scope.EditSelectedLanguage;
                            });
                            angular.forEach(data.SelectedChronicConnditionList, function (value, index) {
                                $scope.EditSelectedChronicondition.push(value.Chronic_Id);
                                $scope.SelectedChronicCondition = $scope.EditSelectedChronicondition;
                                $scope.SelectedChronicConditionEdit = $scope.EditSelectedChronicondition;
                            });
                            //$scope.CountryBased_StateFunction();
                            //$scope.StateBased_CityFunction();
                            //$scope.Country_onChange();
                            //$scope.State_onChange();
                            $('#patientrowid').prop('disabled', true);
                            $("#chatLoaderPV").hide();
                            inputPhoneNo.setNumber(mNumberCC);
                            document.getElementById('txthdFullNumber').value = mNumberCC;
                        });
                    } else {
                        window.location.href = baseUrl + "/Home/LoginIndex";
                    }
                });
            }
            else {
                $("#chatLoaderPV").hide();
                photoview = false;
                photoview1 = false;
                photoview2 = false;
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
                    $http.get(baseUrl + '/api/User/UserDetails_InActive/?Id=' + $scope.Id).success(function (data) {
                        if (data.Status == "True") {
                            //alert(data.Message);
                            toastr.success(data.Message, "success");
                            if ($scope.MenuTypeId == 1)
                                $scope.User_Admin_List($scope.MenuTypeId);
                            else if ($scope.MenuTypeId == 2)
                                $scope.BusinessUser_List($scope.MenuTypeId);
                            else if ($scope.MenuTypeId == 3)
                                $scope.Patient_List($scope.MenuTypeId);
                        }
                        else {
                            //alert(data.Message);
                            toastr.info(data.Message, "info");
                        }
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting User Details" + data;
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
                    $http.get(baseUrl + '/api/User/UserDetails_Active/?Id=' + $scope.Id).success(function (data) {
                        if (data.Status == "True") {
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
                            toastr.info(data.Message, "info");
                        }
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting User Details" + data;
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
        $scope.AdminDefaultConfiguration = 0;
        $scope.AdminInstitutionCreation = function () {
            $scope.AdminDefaultConfiguration = 1;
            $scope.User_InsertUpdate();
        }
        $scope.User_InsertUpdate = function () {
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
                    $scope.PhotoFullpath = $('#item-img-output').attr('src');
                    $scope.NationalPhotoFullpath = $('#item-img-output1').attr('src');
                    $scope.InsurancePhotoFullpath = $('#item-img-output2').attr('src');
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
                            Chronic_Id: value
                        }
                        $scope.PatientChronicCondition_List.push(obj);
                    });
                    var FileName = "";
                    var CertificateFileName = "";
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
                            InsurancePhotoFullpath: $scope.InsurancePhotoFullpath,
                            InsurancePhotoFilename: $scope.InsurancePhotoFilename,
                            Photo: $scope.UserLogo,
                            NationalPhoto: $scope.NationalPhoto,
                            InsurancePhoto: $scope.InsurancePhoto,
                            UserType_Id: $scope.MenuTypeId == 1 ? 3 : $scope.MenuTypeId == 3 ? 2 : $scope.UserTypeId,
                            TITLE_ID: $scope.Title_Id == 0 ? null : $scope.Title_Id,
                            HEALTH_LICENSE: $scope.Health_License,
                            FILE_NAME: $scope.CertificateFileName,
                            FILE_FULLPATH: "",
                            UPLOAD_FILENAME: $scope.Resume,
                            GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                            NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                            ETHINICGROUP_ID: $scope.EthnicGroupId == 0 ? null : $scope.EthnicGroupId,
                            DOB: "",
                            HOME_AREACODE: $scope.HomeAreaCode,
                            HOME_PHONENO: $scope.Home_PhoneNo,
                            MOBIL_AREACODE: $scope.MobileAreaCode,
                            POSTEL_ZIPCODE: $scope.PostalZipCode,
                            EMR_AVAILABILITY: $scope.EMR_Avalability,
                            ADDRESS1: $scope.Address1,
                            ADDRESS2: $scope.Address2,
                            ADDRESS3: $scope.Address3,
                            COUNTRY_ID: $scope.CountryId == 0 ? null : $scope.CountryId,
                            STATE_ID: $scope.StateId == 0 ? null : $scope.StateId,
                            CITY_ID: $scope.CityId == 0 ? null : $scope.CityId,
                            MARITALSTATUS_ID: $scope.MaritalStatusId == 0 ? null : $scope.MaritalStatusId,
                            BLOODGROUP_ID: $scope.BloodGroupId == 0 ? null : $scope.BloodGroupId,
                            PATIENTNO: $scope.PatientNo,
                            INSURANCEID: $scope.InsuranceId,
                            //MNR_NO: $scope.MNR_No,
                            NATIONALID: $scope.NationalId,
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
                            DEPARTMENT_ID: $scope.DepartmentId == 0 ? null : $scope.DepartmentId,
                            EMAILID: $scope.EmailId,
                            MOBILE_NO: $scope.MobileNo_CC,
                            FileName: $scope.FileName,
                            Photo_Fullpath: $scope.PhotoFullpath,
                            NationalPhotoFullpath: $scope.NationalPhotoFullpath,
                            NationalPhotoFilename: $scope.NationalPhotoFilename,
                            InsurancePhotoFullpath: $scope.InsurancePhotoFullpath,
                            InsurancePhotoFilename: $scope.InsurancePhotoFilename,
                            Photo: $scope.UserLogo,
                            NationalPhoto: $scope.NationalPhoto,
                            InsurancePhoto: $scope.InsurancePhoto,
                            UserType_Id: $scope.MenuTypeId == 1 ? 3 : $scope.MenuTypeId == 3 ? 2 : $scope.UserTypeId,
                            TITLE_ID: $scope.Title_Id == 0 ? null : $scope.Title_Id,
                            HEALTH_LICENSE: $scope.Health_License,
                            FILE_NAME: $scope.CertificateFileName,
                            FILE_FULLPATH: "",
                            UPLOAD_FILENAME: $scope.Resume,
                            GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                            NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                            ETHINICGROUP_ID: $scope.EthnicGroupId == 0 ? null : $scope.EthnicGroupId,
                            DOB: moment($scope.DOB).format('DD-MMM-YYYY'),
                            HOME_AREACODE: $scope.HomeAreaCode,
                            HOME_PHONENO: $scope.Home_PhoneNo,
                            MOBIL_AREACODE: $scope.MobileAreaCode,
                            POSTEL_ZIPCODE: $scope.PostalZipCode,
                            EMR_AVAILABILITY: $scope.EMR_Avalability,
                            ADDRESS1: $scope.Address1,
                            ADDRESS2: $scope.Address2,
                            ADDRESS3: $scope.Address3,
                            COUNTRY_ID: $scope.CountryId == 0 ? null : $scope.CountryId,
                            STATE_ID: $scope.StateId == 0 ? null : $scope.StateId,
                            CITY_ID: $scope.CityId == 0 ? null : $scope.CityId,
                            MARITALSTATUS_ID: $scope.MaritalStatusId == 0 ? null : $scope.MaritalStatusId,
                            BLOODGROUP_ID: $scope.BloodGroupId == 0 ? null : $scope.BloodGroupId,
                            PATIENTNO: $scope.PatientNo,
                            INSURANCEID: $scope.InsuranceId,
                            //MNR_NO: $scope.MNR_No,
                            NATIONALID: $scope.NationalId,
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
                            //FullNameFormula: $scope.FullNameFormula,
                            //InstitutionList: [{ "InstitutionName": "" }],
                            //LanguageList: [{ "Name": "" }]
                        }
                    }
                    $http.post(baseUrl + '/api/User/User_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                        /*alert(data.Message);*/
                        if (data.ReturnFlag == 0) {
                            toastr.info(data.Message, "info");
                        }
                        else if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        $('#btnsave').attr("disabled", false);
                        $('#btnsave1').attr("disabled", false);
                        $('#btnsave2').attr("disabled", false);
                        $scope.InstitutionCreatedID = data.UserDetails.INSTITUTION_ID;
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
                        var userid = data.UserDetails.Id;

                        $scope.UserImageAttach(userid);
                        if (data.ReturnFlag == "1") {
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
                            $("#InsuranceLogo").val('');
                            $('#btnsave').attr("disabled", false);
                        }

                        $("#chatLoaderPV").hide();
                    });
                }
                else {
                    $('#btnsave').attr("disabled", false);
                    $('#btnsave1').attr("disabled", false);
                    $('#btnsave2').attr("disabled", false);
                    $("#chatLoaderPV").hide();
                }
            });
        }

        $scope.InstitueDefaultConfiguration = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=1', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration2();
            }).error(function (data) {
                //alert("Error In Step 1");
                toastr.error("Error In Step 1", "warning");
                $scope.InstitueDefaultConfiguration2();
            });
        };

        $scope.InstitueDefaultConfiguration2 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=2', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration3();
            }).error(function (data) {
                //alert("Error In Step 2");
                toastr.error("Error In Step 2", "warning");
                $scope.InstitueDefaultConfiguration3();
            });
        };

        $scope.InstitueDefaultConfiguration3 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=3', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration4();
            }).error(function (data) {
                //alert("Error In Step 3");
                toastr.error("Error In Step 3", "warning");
                $scope.InstitueDefaultConfiguration4();
            });
        };

        $scope.InstitueDefaultConfiguration4 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=4', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration5();
            }).error(function (data) {
                //alert("Error In Step 4");
                toastr.error("Error In Step 4", "warning");
                $scope.InstitueDefaultConfiguration5();
            });
        };

        $scope.InstitueDefaultConfiguration5 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=5', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration6();
            }).error(function (data) {
                //alert("Error In Step 5");
                toastr.error("Error In Step 5", "warning");
                $scope.InstitueDefaultConfiguration6();
            });
        };

        $scope.InstitueDefaultConfiguration6 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=6', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration7();
            }).error(function (data) {
                //alert("Error In Step 6");
                toastr.error("Error In Step 6", "warning");
                $scope.InstitueDefaultConfiguration7();
            });
        };

        $scope.InstitueDefaultConfiguration7 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=7', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration8();
            }).error(function (data) {
                //alert("Error In Step 7");
                toastr.error("Error In Step 7", "warning");
                $scope.InstitueDefaultConfiguration8();
            });
        };

        $scope.InstitueDefaultConfiguration8 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=8', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration9();
            }).error(function (data) {
                //alert("Error In Step 8");
                toastr.error("Error In Step 8", "warning");
                $scope.InstitueDefaultConfiguration9();
            });
        };

        $scope.InstitueDefaultConfiguration9 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=9', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration10();
            }).error(function (data) {
                //alert("Error In Step 9");
                toastr.error("Error In Step 9", "warning");
                $scope.InstitueDefaultConfiguration10();
            });
        };

        $scope.InstitueDefaultConfiguration10 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=10', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration11();
            }).error(function (data) {
                //alert("Error In Step 10");
                toastr.error("Error In Step 10", "warning");
                $scope.InstitueDefaultConfiguration11();
            });
        };

        $scope.InstitueDefaultConfiguration11 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=11', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration12();
            }).error(function (data) {
                //alert("Error In Step 11");
                toastr.error("Error In Step 11", "warning");
                $scope.InstitueDefaultConfiguration12();
            });
        };

        $scope.InstitueDefaultConfiguration12 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=12', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration13();
            }).error(function (data) {
                //alert("Error In Step 12");
                toastr.error("Error In Step 12", "warning");
                $scope.InstitueDefaultConfiguration13();
            });
        };

        $scope.InstitueDefaultConfiguration13 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=13', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration14();
            }).error(function (data) {
                //alert("Error In Step 13");
                toastr.error("Error In Step 13", "warning");
                $scope.InstitueDefaultConfiguration14();
            });
        };

        $scope.InstitueDefaultConfiguration14 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=14', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration15();
            }).error(function (data) {
                //alert("Error In Step 14");
                toastr.error("Error In Step 14", "warning");
                $scope.InstitueDefaultConfiguration15();
            });
        };

        $scope.InstitueDefaultConfiguration15 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=15', $scope.InstitutionCreatedID).success(function (data) {
                $scope.InstitueDefaultConfiguration16();
            }).error(function (data) {
                //alert("Error In Step 15");
                toastr.error("Error In Step 15", "warning");
                $scope.InstitueDefaultConfiguration16();
            });
        };

        $scope.InstitueDefaultConfiguration16 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=16', $scope.InstitutionCreatedID).success(function (data) {
            }).error(function (data) {
                //alert("Error In Step 16");
                toastr.error("Error In Step 16", "warning");
            });
        };


        $scope.UserImageAttach = function (userid) {
            var userid = userid;
            var FileName = "";
            var CertificateFileName = "";
            var Licensefilename = "";
            var fd = new FormData();
            var imgBlob;
            var NationalimgBlob;
            var InsuranceimgBlob;
            var imgBlobfile;
            var itemIndexLogo = -1;
            var NationalitemIndexLogo = -1;
            var InsuranceitemIndexLogo = -1;
            var itemIndexfile = -1;
            var fd1 = new FormData();
            var fd2 = new FormData();

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
                        .success(function (response) {
                            if ($scope.FileName == "") {
                                $scope.UserLogo = "";
                            }
                            else if (itemIndexLogo > -1) {
                                if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                    $scope.UserLogo = response[itemIndexLogo];
                                }
                            }
                        });
                }
            }

            if (photoview1 == false) {
                photoview1 = true;

                if ($scope.NationalPhotoFullpath != undefined && $scope.NationalPhotoFullpath != "" && $scope.NationalPhotoFullpath != null) {
                    NationalimgBlob = $scope.dataURItoBlob($scope.NationalPhotoFullpath);
                    NationalitemIndexLogo = 0;

                    if (NationalitemIndexLogo != -1) {
                        fd1.append('file', NationalimgBlob);
                    }
                    /*
                    calling the api method for read the file path 
                    and saving the image uploaded in the local server. 
                    */

                    $http.post(baseUrl + '/api/User/AttachNationalPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue1 + '&CREATED_BY=' + $window.localStorage['UserId'],
                        fd1,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    )
                        .success(function (response) {
                            if ($scope.NationalPhotoFilename == "") {
                                $scope.NationalLogo = "";
                            }
                            else if (NationalitemIndexLogo > -1) {
                                if ($scope.NationalPhotoFilename != "" && response[NationalitemIndexLogo] != "") {
                                    $scope.NationalLogo = response[NationalitemIndexLogo];
                                }
                            }
                        });
                }
            }

            if (photoview2 == false) {
                photoview2 = true;
                if ($scope.InsurancePhotoFullpath != undefined && $scope.InsurancePhotoFullpath != "" && $scope.InsurancePhotoFullpath != null) {
                    InsuranceimgBlob = $scope.dataURItoBlob($scope.InsurancePhotoFullpath);
                    InsuranceitemIndexLogo = 0;

                    if (InsuranceitemIndexLogo != -1) {
                        fd2.append('file', InsuranceimgBlob);
                    }
                    /*
                    calling the api method for read the file path 
                    and saving the image uploaded in the local server. 
                    */

                    $http.post(baseUrl + '/api/User/AttachInsurancePhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue2 + '&CREATED_BY=' + $window.localStorage['UserId'],
                        fd2,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    )
                        .success(function (response) {
                            if ($scope.InsurancePhotoFilename == "") {
                                $scope.InsuranceLogo = "";
                            }
                            else if (InsuranceitemIndexLogo > -1) {
                                if ($scope.InsurancePhotoFilename != "" && response[InsuranceitemIndexLogo] != "") {
                                    $scope.InsuranceLogo = response[InsuranceitemIndexLogo];
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
                            .success(function (response) {
                                if ($scope.FileName == "") {
                                    $scope.UserLogo = "";
                                }
                                else if (itemIndexLogo > -1) {
                                    if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                        $scope.UserLogo = response[itemIndexLogo];
                                    }
                                }
                            });
                    }
                }
            }

            if ($scope.PhotoValue1 == 1 && photoview1 == false && $scope.Id == 0) {
                if ($scope.NationalPhotoFullpath != undefined && NationalPhotoFullpath != "" && NationalPhotoFullpath != null) {
                    if ($('#NationalLogo')[0].files[0] != undefined) {
                        NationalPhotoFilename = $('#NationalLogo')[0].files[0]['name'];
                        NationalimgBlob = $scope.dataURItoBlob($scope.NationalPhotoFullpath);
                        NationalitemIndexLogo = 0;
                    }
                    if (NationalitemIndexLogo != -1) {
                        fd1.append('file', NationalimgBlob);

                        /*	
                        calling the api method for read the file path 	
                        and saving the image uploaded in the local server. 	
                        */
                        $http.post(baseUrl + '/api/User/AttachNationalPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue1 + '&CREATED_BY=' + $window.localStorage['UserId'],
                            fd1,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .success(function (response) {
                                if ($scope.NationalPhotoFilename == "") {
                                    $scope.NationalLogo = "";
                                }
                                else if (NationalitemIndexLogo > -1) {
                                    if ($scope.NationalPhotoFilename != "" && response[NationalitemIndexLogo] != "") {
                                        $scope.NationalLogo = response[NationalitemIndexLogo];
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
                        fd2.append('file', InsuranceimgBlob);

                        /*	
                        calling the api method for read the file path 	
                        and saving the image uploaded in the local server. 	
                        */
                        $http.post(baseUrl + '/api/User/AttachInsurancePhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue2 + '&CREATED_BY=' + $window.localStorage['UserId'],
                            fd2,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .success(function (response) {
                                if ($scope.InsurancePhotoFilename == "") {
                                    $scope.InsuranceLogo = "";
                                }
                                else if (InsuranceitemIndexLogo > -1) {
                                    if ($scope.InsurancePhotoFilename != "" && response[InsuranceitemIndexLogo] != "") {
                                        $scope.InsuranceLogo = response[InsuranceitemIndexLogo];
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
                            .success(function (response) {
                                if ($scope.FileName == "") {
                                    $scope.UserLogo = "";
                                }
                                else if (itemIndexLogo > -1) {
                                    if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                        $scope.UserLogo = response[itemIndexLogo];
                                    }
                                }
                            });
                    }
                }
            }

            if ($scope.PhotoValue1 == 1 && photoview1 == true && $scope.Id > 0) {
                if ($scope.NationalPhotoFullpath != undefined && $scope.NationalPhotoFullpath != "" && $scope.NationalPhotoFullpath != null) {
                    if ($('#NationalLogo')[0].files[0] != undefined) {
                        NationalPhotoFilename = $('#NationalLogo')[0].files[0]['name'];
                        NationalimgBlob = $scope.dataURItoBlob($scope.NationalPhotoFullpath);
                        NationalitemIndexLogo = 0;

                        // if ($scope.MenuTypeId == 1) {
                        // document.getElementById("profileIcon").src = $scope.PhotoFullpath;
                        // }
                    }
                    if (NationalitemIndexLogo != -1) {
                        fd1.append('file', NationalimgBlob);

                        /*
                        calling the api method for read the file path 
                        and saving the image uploaded in the local server. 
                        */

                        $http.post(baseUrl + '/api/User/AttachNationalPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue1 + '&CREATED_BY=' + $window.localStorage['UserId'],
                            fd1,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .success(function (response) {
                                if ($scope.NationalPhotoFilename == "") {
                                    $scope.NationalLogo = "";
                                }
                                else if (NationalitemIndexLogo > -1) {
                                    if ($scope.NationalPhotoFilename != "" && response[NationalitemIndexLogo] != "") {
                                        $scope.NationalLogo = response[NationalitemIndexLogo];
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
                        fd2.append('file', InsuranceimgBlob);
                        /*
                        calling the api method for read the file path 
                        and saving the image uploaded in the local server. 
                        */

                        $http.post(baseUrl + '/api/User/AttachInsurancePhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue2 + '&CREATED_BY=' + $window.localStorage['UserId'],
                            fd2,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .success(function (response) {
                                if ($scope.InsurancePhotoFilename == "") {
                                    $scope.InsuranceLogo = "";
                                }
                                else if (InsuranceitemIndexLogo > -1) {
                                    if ($scope.InsurancePhotoFilename != "" && response[InsuranceitemIndexLogo] != "") {
                                        $scope.InsuranceLogo = response[InsuranceitemIndexLogo];
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
                    .success(function (response) {
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
                                if ($scope.CertificateFileName != "" && response[itemIndexfile] != "") {
                                    $scope.Resume = response[itemIndexfile];
                                }
                            }
                        }
                    })
            }
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
            if ($scope.AddMedicines != null || $scope.AddMedicines == "" || $scope.AddMedicines.length == 0) {
                var ch5 = [];
                ch5 = [{
                    "Id": "",
                    "Status": "", "MedicineName": "", "Remarks": ""
                }]
                $scope.AddMedicines = ch5;
            }
            if ($scope.AddMedicalHistory != null || $scope.AddMedicalHistory == "" || $scope.AddMedicalHistory.length == 0) {
                var ch6 = [];
                ch6 = [{ "Medical_History": "", "Remarks": "" }]
                $scope.AddMedicalHistory = ch6;
            }
            if ($scope.AddHealthProblem != null || $scope.AddHealthProblem[0].Id == 0) {
                var ch7 = [];
                $scope.AddHealthProblem = [];
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

        $scope.ResetPatientFilter = function () {
            $scope.Filter_FirstName = "";
            $scope.Filter_LastName = "";
            $scope.Filter_MRN = "";
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
        };
        $scope.RemoveMedicine_Item = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this Current Medical Details?");
            if (del == true) {
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
            }
        };
        $scope.RemoveMedicalHistory_Item = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this Past Medical Details?");
            if (del == true) {
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
            }
        };
        $scope.RemoveHealthProblem_Item = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this Family Health Problem Details?");
            if (del == true) {
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
            }
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
        $scope.AssignedGroup = "0";
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
                alert("Please select Group");
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
                $http.post(baseUrl + '/api/User/AssignedGroup_Insert/', $scope.AssignedGroupList).success(function (data) {
                    if (data == 1) {
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
                $http.post(baseUrl + '/api/User/GroupMaster_Insert/', Groupobj).success(function (data) {
                    //alert(data.returnMessage);
                    toastr.success(data.returnMessage, "success");
                    if (data.flag == "2") // clear only if group is valid and record updated
                    {
                        $scope.CancelGroupPopup();
                        $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                            $scope.GroupTypeList = data;
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
                $http.post(baseUrl + '/api/PatientApproval/PatientApproval_History_Insert/', obj).success(function (data) {
                    if (data == 1) {
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
                $http.post(baseUrl + '/api/User/AssignedGroup_Insert/', $scope.AssignedGroupList).success(function (data) {
                    $scope.AssignedGroup = "";
                    if (data == 1) {
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
                $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).success(function (data) {
                    //alert(data.Message);
                    toastr.success(data.Message, "success");
                    if (data.ReturnFlag == 1) {
                        $location.path("/PatientApproval");
                    }
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting patient approval records" + data;
                });
            }
        };
        if ($scope.AdminFlowdata > 0) {
            $scope.AddUserPopUP();
        }
    }
]);