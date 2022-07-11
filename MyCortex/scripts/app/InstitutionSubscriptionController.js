var InstitutionSubscription = angular.module("InstitutionSubscriptionController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


InstitutionSubscription.controller("InstitutionSubscriptionController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'InstSub', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, InstSub, toastr) {

        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate() - 1;
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var maxDate = year + '-' + month + '-' + day;
        $scope.StartToDateMin = moment(maxDate).format('YYYY-MM-DD');


        //Declaration and initialization of Scope Variables.
        $scope.serviceData = InstSub.getInstiID();
        $scope.ChildId = 0;
        $scope.Institution_Id = "0";
        $scope.TimeZone_Id = "0";
        $scope.TimeZoneId = "0";
        $scope.AppointmentModule_Id = "0";
        $scope.AppointmentModuleId = "0";
        $scope.Health_Care_Professionals = "";
        $scope.Patients = "";
        $scope.Hive = 0;
        $scope.HiveChart = 0;
        $scope.Hive_Users = 0;
        $scope.HiveChart_Users = 0;
       // $scope.Hive_Devices = 0;
        $scope.HiveChart_Devices = 0;
        $scope.Contract_Period_From = "";
        $scope.Contract_Period_To = "";
        $scope.V_Contract_Period_From = "";
        $scope.V_Contract_Period_To = "";
        $scope.Subscription_Type = "1";
        $scope.TelePhone_User = 1;
        /* $scope.Chroniccc = false;
         $scope.Chroniccg = false;
         $scope.Chroniccl = false;
         $scope.Chronicsc = false;*/
        $scope.Hcp_Pat = false;

        $scope.InstitutionViewList = [];
        $scope.IsActive = true;
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        /*$scope.myService = myService;
        $scope.update();
        $scope.update = function (str) {
            $scope.myService.setValue(str);
        }*/

        $scope.AddIntstitutionSubPopup = function () {
            $('#divInssInstitute').addClass("ng-invalid");
            $('#divInssTimeZone').addClass("ng-invalid");
            $('#divInssChronicEdit').addClass("ng-invalid");
            $('#divInssApModule').addClass("ng-invalid");
            $scope.submitted = false;
            $scope.Id = 0;
            $scope.Institution_Id = "0";
            $scope.TimeZone_Id = "0";
            $scope.Hcp_Pat = false;
            $scope.status = 1;
            $scope.Institutestatus();
            $scope.ClearInstitutionSubscriptionPopup();
            //document.getElementById("Contract_Period_To").min = $scope.StartToDateMin;
            $scope.Contract_Period_From = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
            $scope.Contract_Period_To = DateFormatEdit($filter('date')(new Date(new Date().setDate(new Date().getDate() + 30)), 'dd-MMM-yyyy'));
            $('#btnsave').attr("disabled", false);
            $('#btnsave1').attr("disabled", false);
            $("#insselectpicker").attr("disabled", false);
            $scope.EditInstSub = 0;
            angular.element('#InstitutionSubscriptionCreateModal').modal('show');
        }
        $scope.CancelIntstitutionSubPopup = function () {
            angular.element('#InstitutionSubscriptionCreateModal').modal('hide');
            $scope.TelePhone_User = 1;
            InstSub.setSubID(0);
            InstSub.setInstiID(0);
        }
        $scope.EditInstSub = 0;
        $scope.EditIntstitutionSubPopup = function (InsSubId, ActiveFlag) {
            if (ActiveFlag == "1") {
                $('#divInssInstitute').addClass("ng-invalid");
                $('#divInssTimeZone').addClass("ng-invalid");
                $('#divInssChronicEdit').addClass("ng-invalid");
                $('#divInssApModule').addClass("ng-invalid");
                $scope.submitted = false;
                $scope.StartToDateMin = "";
                $scope.ClearInstitutionSubscriptionPopup();
                $scope.Id = InsSubId;
                $scope.Hcp_Pat = true;
                $scope.status = 0;
                $scope.Institutestatus();
                $scope.InstitutionSubscriptionDetails_View();
                $('#btnsave').attr("disabled", false);
                $("#insselectpicker").attr("disabled", true);
                angular.element('#InstitutionSubscriptionCreateModal').modal('show');
                $('#subscriptionrowid').prop('disabled', true);
                $scope.EditInstSub = 1;
            }
            else {
                //alert("Inactive Institution's Subscription cannot be edited")
                toastr.info("Inactive Institution's Subscription cannot be edited", "info");
            }
        }
        $scope.ViewIntstitutionSubPopup = function (InsSubId) {
            $scope.ClearInstitutionSubscriptionPopup();
            $scope.Id = InsSubId;
            $scope.InstitutionSubscriptionDetails_View();
            angular.element('#ViewInstitutionSubscriptionModal').modal('show');
        }
        $scope.CancelViewIntstitutionSubPopup = function () {
            angular.element('#ViewInstitutionSubscriptionModal').modal('hide');
        }
        /* on click Add Institution Subscription tool tip in list page calling the Add New  method and Open the Institution Subscription Details Add*/
        $scope.AddInstitutionSubsciption = function () {
            $scope.Id = 1;
            $location.path("/SaveInstitution_Subscription/");
        };
        // This is for to get Institution Details List 
        $scope.Institutestatus = function () {
            $http.get(baseUrl + '/api/Common/InstitutionNameList/?status=' + $scope.status).success(function (data) {
                $scope.InstitutiondetailsListTemp = [];
                $scope.InstitutiondetailsListTemp = data;
                var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
                //$scope.InstitutiondetailsListTemp.push(obj);
                $scope.InstitutiondetailsList = angular.copy($scope.InstitutiondetailsListTemp);
                $scope.Institution_Id = $scope.serviceData.toString();

                if ($scope.Institution_Id != "0") {
                    $('#divInssInstitute').removeClass("ng-invalid");
                    $('#divInssInstitute').addClass("ng-valid");
                }
                else {
                    $('#divInssInstitute').removeClass("ng-valid");
                    $('#divInssInstitute').addClass("ng-invalid");
                }

                $scope.InstituteGetDetails();

            })
        }
        // This is for to get Institution Modiule List 
        $http.get(baseUrl + '/api/InstitutionSubscription/ModuleNameList/').success(function (data) {
            // only active Module    
            $scope.InstitutiontypeList = data;
        });
        $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            $scope.TimeZoneListID = data;
        });
        // This is for to get Institution Language List 
        $http.get(baseUrl + '/api/InstitutionSubscription/LanguageNameList/').success(function (data) {
            // only active Language    
            $scope.LanguageList = data;
        });
        $scope.TelephoneList = [];
        $http.get(baseUrl + '/api/InstitutionSubscription/TelephoningNameList/').success(function (data) {
            // only active Telephone    
            $scope.TelephoneList = data;
            $scope.TelephoneDataList = data;
        });
        $http.get(baseUrl + '/api/InstitutionSubscription/PaymentModule_List/').success(function (data) {
            // only active Language    
            $scope.PaymentList = data;
        });
        $http.get(baseUrl + '/api/Common/InstitutionInsurance/').success(function (data) {
            $scope.InstitutionInsuranceName = data;
        });
        $scope.AllDeviceNameList = [];
        $http.get(baseUrl + '/api/InstitutionSubscription/DeviceName_List/').success(function (data) {
            $scope.AllDeviceNameList = data;
        });
        $http.get(baseUrl + '/api/Common/InstitutionPayment/').success(function (data) {
            $scope.InstitutionPaymentMethod = data;
        });
        $http.get(baseUrl + '/api/DoctorShift/AppointmentModuleList/').success(function (data) {
            // only active Language    
            $scope.AppointmentModuleListID = data;
        });
        /*This is for Auto fill Details by selected Name of the Institution */
        $scope.InstituteGetDetails = function () {
            if ($scope.Institution_Id == "0") // if Select option selected
            {
                $scope.ClearInstitutionSubscriptionPopup();
                return false;
            }

            $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionDetailList/?Id=' + $scope.Institution_Id).success(function (data) {
                if (data.Email == null)
                    $scope.Email = "";
                else
                    $scope.Email = data.Email;
                $scope.Address1 = data.Institution_Address1;
                $scope.Address2 = data.Institution_Address2;
                $scope.Address3 = data.Institution_Address3;
                $scope.ZipCode = data.ZipCode;
                $scope.Country = data.CountryName;
                $scope.State = data.StateName;
                $scope.City = data.CityName;
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            });
            $scope.loading = false;
        }
        $scope.SubscriptionAndAdmin = 0;
        $scope.AndSubscription_AndAdmin = function () {
            $scope.SubscriptionAndAdmin = 1;
            $scope.Institution_SubscriptionAddEdit();
        }

        $scope.Institution_SubscriptionAddAndEdit = function () {
            var activeButton = document.activeElement.id;
            if (activeButton == "btnsave1" && $scope.EditInstSub == 0) {
                $scope.AndSubscription_AndAdmin();
            }
            else if (activeButton == "btnsave" && $scope.EditInstSub == 1) {
                $scope.Institution_SubscriptionAddEdit();
            }
        }
        //$scope.Contract_Period_To = DateFormatEdit($filter('date')(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'dd-MMM-yyyy'));

        $scope.DateChange = function () {
            document.getElementById('Contract_Period_To').min = moment($scope.Contract_Period_From).add(30, 'days').format('YYYY-MM-DD');
        }

        $scope.ChangeDate = function (Contract_Period_From) {
            var StartDate = moment($scope.Contract_Period_From);
            var EndDate = moment($scope.Contract_Period_To);
            $scope.IsDate = moment(EndDate).diff(moment(StartDate), 'days');
            if ($scope.IsDate <= 30) {
                $scope.sDate = moment(Contract_Period_From).format('DD-MMM-YYYY');
                $scope.Contract_Period_To = moment($scope.sDate).add(30, 'days').format('YYYY-MM-DD');
                //value.Contract_Period_To = DateFormatEdit($filter('date')($scope.EndDate, 'dd-MMM-yyyy'));
                document.getElementById('Contract_Period_To').value = $scope.Contract_Period_To;
            }
            else {
            }
        }

        $scope.TelePhoneChange = function (Id, value) {
            $scope.TelePhone_User = value.Id;
        }
       
        $scope.Module_listAdd = [];
        $scope.ModulelistChange = function (Id, value) {
            var checked = $('#' + Id).is(":checked");
            if (checked == true) {
                    var obj = {
                        Id: 0,
                        Institution_Subcription_Id: $scope.Id,
                        ModuleId: value.Id
                    }
                    $scope.Module_listAdd.push(obj);
            } else {
                angular.forEach($scope.Module_listAdd, function (item, index) {
                    if (value.Id == item.ModuleId) {
                        $scope.Module_listAdd.splice(index,1);
                    }
                });
            }
        }
        $scope.InstitutionDeviceName = [];
        $scope.DevicelistChange = function (Id, value) {
            var checked = $('#' + Id).is(":checked");
            if (checked == true) {
                var obj = {
                    Id: 0,
                    Institution_Subcription_Id: $scope.Id,
                    DeviceId: value.Id
                }
                $scope.InstitutionDeviceName.push(obj);
            } else {
                angular.forEach($scope.InstitutionDeviceName, function (item, index) {
                    if (value.Id == item.DeviceId) {
                        $scope.InstitutionDeviceName.splice(index, 1);
                    }
                });
            }
        }

        $scope.InstitutionLanguageName = [];
        $scope.LanguagelistChange = function (Id, value) {
            var checked = $('#' + Id).is(":checked");
            if (checked == true) {
                var obj = {
                    Id: 0,
                    Institution_Subcription_Id: $scope.Id,
                    LanguageId: value.Id
                }
                $scope.InstitutionLanguageName.push(obj);
            } else {
                angular.forEach($scope.InstitutionLanguageName, function (item, index) {
                    if (value.Id == item.LanguageId) {
                        $scope.InstitutionLanguageName.splice(index, 1);
                    }
                });
            }
        }
        //$scope.insSubInstituteChange = function () {
        //    var ins = document.getElementById('insselectpicker').value;
        //    if (ins != "0") {
        //        $('#divInssInstitute').removeClass("ng-invalid");
        //        $('#divInssInstitute').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInssInstitute').removeClass("ng-valid");
        //        $('#divInssInstitute').addClass("ng-invalid");
        //    }
        //}

        //$scope.insSubTimeZoneChange = function () {
        //    var tz = document.getElementById('TimeZoneID').value;
        //    if (tz != "0") {
        //        $('#divInssTimeZone').removeClass("ng-invalid");
        //        $('#divInssTimeZone').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInssTimeZone').removeClass("ng-valid");
        //        $('#divInssTimeZone').addClass("ng-invalid");
        //    }
        //}

        //$scope.insSubTypeChange = function () {
        //    if ($scope.Subscription_Type == "1" || $scope.Subscription_Type == "2") {
        //        $('#divInssType').removeClass("ng-invalid");
        //        $('#divInssType').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInssType').removeClass("ng-valid");
        //        $('#divInssType').addClass("ng-invalid");
        //    }
        //}

        //$scope.insSubChronicChange = function () {
        //    //alert($scope.Chroniccc);
        //    if ($scope.Chroniccc == false && $scope.Chroniccg == false && $scope.Chroniccl == false && $scope.Chronicsc == false) {
        //        $('#divInssChronicEdit').removeClass("ng-valid");
        //        $('#divInssChronicEdit').addClass("ng-invalid");
        //    }
        //    else {
        //        $('#divInssChronicEdit').removeClass("ng-invalid");
        //        $('#divInssChronicEdit').addClass("ng-valid");
        //    }
        //}

        //$scope.insSubAppointmentModuleChange = function () {
        //    var am = document.getElementById('AppointmentModuleID').value;
        //    if (am != "0") {
        //        $('#divInssApModule').removeClass("ng-invalid");
        //        $('#divInssApModule').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInssApModule').removeClass("ng-valid");
        //        $('#divInssApModule').addClass("ng-invalid");
        //    }
        //}

        /* Validating the create page mandatory fields
        checking mandatory for the follwing fields
        Health Care Professionals,Patients,Contract Period From,Contract Period To
        and showing alert message when it is null.
        */
        $scope.Institution_SubscriptionAddEditValidations = function () {
            if (typeof ($scope.Institution_Id) == "undefined" || $scope.Institution_Id == "0") {
                //alert("Please select Institution");
                toastr.warning("Please select Institution", "warning");
                return false;
            }
            else if (typeof ($scope.TimeZone_Id) == "undefined" || $scope.TimeZone_Id == "0") {
                //alert("Please select TimeZone");
                toastr.warning("Please select TimeZone", "warning");
                return false;
            }
            else if (typeof ($scope.Health_Care_Professionals) == "undefined" || $scope.Health_Care_Professionals == "") {
                //alert("Please enter No. of Health Care Professionals");
                toastr.warning("Please enter No. of Health Care Professionals", "warning");
                return false;
            }
            else if (typeof ($scope.Patients) == "undefined" || $scope.Patients == "") {
                //alert("Please enter No. of Patients");
                toastr.warning("Please enter No. of Patients", "warning");
                return false;
            }
            /*else if (typeof ($scope.Hive) == "undefined" || $scope.Hive == "") {
                //alert("Please enter No. of Health Care Professionals");
                toastr.warning("Please enter No. of Hive", "warning");
                return false;
            }
            else if (typeof ($scope.HiveChart) == "undefined" || $scope.HiveChart == "") {
                //alert("Please enter No. of Health Care Professionals");
                toastr.warning("Please enter No. of HiveChart", "warning");
                return false;
            }
            else if (typeof ($scope.HiveChart_Users) == "undefined" || $scope.HiveChart_Users == "") {
                //alert("Please enter No. of Health Care Professionals");
                toastr.warning("Please enter No. of HiveChart Users", "warning");
                return false;
            }
            else if (typeof ($scope.Hive_Users) == "undefined" || $scope.Hive_Users == "") {
                //alert("Please enter No. of Health Care Professionals");
                toastr.warning("Please enter No. of Hive Users", "warning");
                return false;
            }         */   
            else if (typeof ($scope.Contract_Period_From) == "undefined" || $scope.Contract_Period_From == "") {
                //alert("Please select Contract Period From");
                toastr.warning("Please select Contract Period From", "warning");
                return false;
            }
            else if (typeof ($scope.Contract_Period_To) == "undefined" || $scope.Contract_Period_To == "") {
                //alert("Please select Contract Period To");
                toastr.warning("Please select Contract Period To", "warning");
                return false;
            }
            else if (typeof ($scope.AppointmentModule_Id) == "undefined" || $scope.AppointmentModule_Id == "0") {
                //alert("Please select AppointmentModule");
                toastr.warning("Please select AppointmentModule", "warning");
                return false;
            }

            if (($scope.Contract_Period_From != "0") && ($scope.Contract_Period_To != "0")) {

                $scope.Contract_Period_From = moment($scope.Contract_Period_From).format('DD-MMM-YYYY');
                $scope.Contract_Period_To = moment($scope.Contract_Period_To).format('DD-MMM-YYYY');

                if ((ParseDate($scope.Contract_Period_To) < ParseDate($scope.Contract_Period_From))) {
                    //alert("Contract Period From should not be greater than Contract Period To");
                    toastr.warning("Contract Period From should not be greater than Contract Period To", "warning");
                    $scope.Contract_Period_From = DateFormatEdit($scope.Contract_Period_From);
                    $scope.Contract_Period_To = DateFormatEdit($scope.Contract_Period_To);
                    return false;
                }
                $scope.Contract_Period_From = DateFormatEdit($scope.Contract_Period_From);
                $scope.Contract_Period_To = DateFormatEdit($scope.Contract_Period_To);
            }
            /*if ($scope.Chroniccc == false && $scope.Chroniccg == false && $scope.Chroniccl == false && $scope.Chronicsc == false) {
                toastr.warning("Please select Any One In Chronic Edi", "warning");
                return false;
            }*/

            if ($scope.Hive > 0) {
                if (typeof ($scope.Hive_Users) == "undefined" || $scope.Hive_Users == "" || $scope.Hive_Users == 0) {
                    toastr.warning("Please enter No. of Hive Users", "warning");
                    return false;
                }
            }

            if ($scope.Hive_Users > 0) {
                if (typeof ($scope.Hive) == "undefined" || $scope.Hive == "" || $scope.Hive == 0) {
                    toastr.warning("Please enter No. of Hive", "warning");
                    return false;
                }
            }

            if ($scope.HiveChart > 0) {
                if (typeof ($scope.HiveChart_Users) == "undefined" || $scope.HiveChart_Users == "" || $scope.HiveChart_Users == 0) {
                    toastr.warning("Please enter No. of HiveChart Users", "warning");
                    return false;
                }
            }

            if ($scope.HiveChart_Users > 0) {
                if (typeof ($scope.HiveChart) == "undefined" || $scope.HiveChart == "" || $scope.HiveChart == 0) {
                    toastr.warning("Please enter No. of HiveChart", "warning");
                    return false;
                }
            }

            return true;
        };
        /*on click Save calling the insert update function for Institution Subscription */
        $scope.InstitutionAddList = [];
        $scope.InstitutionAddLanguageList = [];
        $scope.InstitutionAddDeviceName = [];
        $scope.InstitutionAddInsuranceList = [];
        $scope.InstitutionAddPaymentList = [];
        $scope.InstitutionModule_List = [];
        $scope.InstitutionLanguage_List = [];
        $scope.InstitutionDevice_list = [];
        $scope.InstitutionInsurance_List = [];
        $scope.InstitutionPayment_List = [];
        $scope.Institution_SubscriptionAddEdit = function () {
            $scope.InstitutionModule_List = [];
            $scope.InstitutionLanguage_List = [];
            $scope.InstitutionDevice_list = [];
            $scope.InstitutionInsurance_List = [];
            $scope.InstitutionPayment_List = [];
            if ($scope.Institution_SubscriptionAddEditValidations() == true) {
                $("#chatLoaderPV").show();
                $scope.InstitutionModule_List = $scope.Module_listAdd;
                $scope.InstitutionDevice_list = $scope.InstitutionDeviceName;
                $scope.InstitutionLanguage_List = $scope.InstitutionLanguageName;
                /*angular.forEach($scope.InstitutionAddList, function (SelectedInstitutiontype, index) {
                    if (SelectedInstitutiontype == true) {
                        {
                            var obj = {
                                Id: 0,
                                Institution_Subcription_Id: $scope.Id,
                                ModuleId: index + 1
                            }
                            $scope.InstitutionModule_List.push(obj);
                        }
                    }
                });*/
                /*angular.forEach($scope.InstitutionAddLanguageList, function (SelectedInstitutiontype, index) {
                    if (SelectedInstitutiontype == true) {
                        {
                            var obj = {
                                Id: 0,
                                Institution_Subcription_Id: $scope.Id,
                                LanguageId: index + 1
                            }
                            $scope.InstitutionLanguage_List.push(obj);
                        }
                    }
                });*/
                angular.forEach($scope.InstitutionAddInsuranceList, function (SelectedInstitutiontype, index) {
                    if (SelectedInstitutiontype == true) {
                        {
                            var obj = {
                                Id: $scope.InstitutionInsuranceName[index].Id
                            }
                            $scope.InstitutionInsurance_List.push(obj);
                        }
                    }
                });
                angular.forEach($scope.InstitutionAddPaymentList, function (SelectedInstitutiontype, index) {
                    if (SelectedInstitutiontype == true) {
                        {
                            var obj = {
                                Id: $scope.InstitutionPaymentMethod[index].Id
                            }
                            $scope.InstitutionPayment_List.push(obj);
                        }
                    }
                });
                var obj1 = $scope.InstitutionInsurance_List;
                var obj2 = $scope.InstitutionPayment_List;
                var Payment_List_Id = obj2.concat(obj1);
                var objInstituteName = $scope.InstitutionInsuranceName;
                var obj2InstitutePay = $scope.InstitutionPaymentMethod;
                var InstitutionSelectedPaymentList = obj2InstitutePay.concat(objInstituteName);
                /*Array.prototype.push.apply(obj2InstitutePay, objInstituteName);
                console.log(obj2InstitutePay);*/
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $scope.Institution_Id,
                    Health_Care_Professionals: $scope.Health_Care_Professionals,
                    No_Of_Patients: $scope.Patients,
                    No_Of_HiveChartUsers: $scope.HiveChart_Users,
                    No_Of_HiveUsers: $scope.Hive_Users,
                    No_Of_Hive: $scope.Hive,
                    No_Of_HiveChart: $scope.HiveChart,
                   // No_Of_HiveDevices: typeof($scope.Hive_Devices) == "undefined" || $scope.Hive_Devices == "" ? 0 : $scope.Hive_Devices,
                    No_Of_HiveChartDevices: typeof($scope.HiveChart_Devices) == "undefined" || $scope.HiveChart_Devices == "" ? 0 : $scope.HiveChart_Devices,
                    Contract_PeriodFrom: moment($scope.Contract_Period_From).format('DD-MMM-YYYY'),
                    Contract_PeriodTo: moment($scope.Contract_Period_To).format('DD-MMM-YYYY'),
                    Subscription_Type: $scope.Subscription_Type,
                    TelePhone_User: $scope.TelePhone_User,
                    Institution_Modules: $scope.InstitutionModule_List,
                    Module_List: $scope.InstitutiontypeList,
                    Institution_Languages: $scope.InstitutionLanguage_List,
                    Institution_DeviceName_list: $scope.InstitutionDevice_list,
                    Language_List: $scope.LanguageList,
                    Device_List: $scope.AllDeviceNameList,
                    TimeZone_ID: $scope.TimeZone_Id,
                    Appointment_Module_Id: $scope.AppointmentModule_Id,
                    Payment_List: InstitutionSelectedPaymentList,
                    Payment_Module_Id: Payment_List_Id,
                   /* ChronicCc: $scope.Chroniccc,
                    ChronicCg: $scope.Chroniccg,
                    ChronicCl: $scope.Chroniccl,
                    ChronicSc: $scope.Chronicsc*/
                }
                $('#btnsave').attr("disabled", true);
                $('#btnsave1').attr("disabled", true);
                $http.post(baseUrl + '/api/InstitutionSubscription/InstitutionSubscription_AddEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 0) {
                        toastr.error(data.Message, "Warning");
                    }
                    else if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    $('#btnsave').attr("disabled", false);
                    $('#btnsave1').attr("disabled", false);
                    if (data.ReturnFlag == "1") {
                        $scope.CancelIntstitutionSubPopup();
                        $scope.TimeZone_Id = "";
                        $scope.AppointmentModule_Id = "";
                        if ($scope.SubscriptionAndAdmin == 0) {
                            InstSub.setSubID(0);
                            $scope.InstitutionSubscriptionDetailsListTemplate();
                        }
                        if ($scope.SubscriptionAndAdmin == 1) {
                            InstSub.setSubID(data.Institute[0].Institution_Id);
                            window.location.href = baseUrl + "/Home/Index#/SuperAdmin_UserList/1";
                        }
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "An error has occurred while adding InstitutionSubcription details" + data.ExceptionMessage;
                });
            }
        }
        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterInstitutionSubscriptionList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Institution.Institution_Name).match(searchstring) ||
                        angular.lowercase(value.Institution.INSTITUTION_SHORTNAME).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Contract_PeriodFrom, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Contract_PeriodTo, "dd-MMM-yyyy")).match(searchstring);
                });
            }
        }

        /*THIS IS FOR LIST FUNCTION*/
        $scope.InstitutionSubscriptionDetailsListTemplate = function () {
            if ($window.localStorage['UserTypeId'] == 1) {
                $("#chatLoaderPV").show();
                $scope.rowCollectionTemplate = [];
                $scope.Institution_Id = "0";
                $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscription_List/Id?=' + $scope.Institution_Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.rowCollectionTemplate = data;
                    $scope.rowCollection = $ff($scope.rowCollectionTemplate, function (value) {
                        return value.Institution.IsActive == "1";
                    });
                    $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
        /*THIS IS FOR LIST FUNCTION*/
        $scope.InstitutionSubscriptionDetailsFilter = function () {

            if ($scope.IsActive == true) {
                $scope.rowCollection = $ff($scope.rowCollectionTemplate, function (value) {
                    return value.Institution.IsActive == "1";
                })
            }
            else if ($scope.IsActive == false) {
                $scope.rowCollection = angular.copy($scope.rowCollectionTemplate);
            }

            $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        };
        $scope.InstitutionChildList = [];
        $scope.InstitutionLanguageList = [];
        $scope.InstitutionDeviceList = [];
        /*THIS IS FOR View FUNCTION*/
        $scope.InstitutionSubscriptionDetails_View = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 1) {

                $("#chatLoaderPV").show();
                if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                    $scope.Id = $routeParams.Id;
                    $scope.DuplicatesId = $routeParams.Id;
                }
                $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionDetails_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.DuplicatesId = data.Id;
                    $scope.InstitutiontypeList = data.Module_List;
                    $scope.InstitutionChildList = data.ChildModuleList;
                    $scope.Module_listAdd = data.ChildModuleList;
                    $scope.LanguageList = data.Language_List;
                    $scope.InstitutionLanguageList = data.ChildLanguageList;
                    $scope.InstitutionLanguageName = data.ChildLanguageList;
                    $scope.AllDeviceNameList = data.Device_list;
                    $scope.InstitutionDeviceList = data.ChildDeviceList;
                    $scope.InstitutionDeviceName = data.ChildDeviceList;
                    $scope.PaymentList = data.Payment_List;
                    $scope.InstitutionInsurnceList = data.ChildInsuranceList;
                    $scope.InstitutionPaymentList = data.ChildPaymentList;
                    $scope.Institution_Id = data.Institution_Id.toString();
                    if ($scope.Institution_Id != "0") {
                        $('#divInssInstitute').removeClass("ng-invalid");
                        $('#divInssInstitute').addClass("ng-valid");
                    }
                    else {
                        $('#divInssInstitute').removeClass("ng-valid");
                        $('#divInssInstitute').addClass("ng-invalid");
                    }
                    $scope.ViewInstitution_Name = data.Institution.Institution_Name;
                    $scope.Email = data.Institution.Email;
                    $scope.Address1 = data.Institution.Institution_Address1;
                    $scope.Address2 = data.Institution.Institution_Address2;
                    $scope.Address3 = data.Institution.Institution_Address3;
                    $scope.ZipCode = data.Institution.ZipCode;
                    $scope.Country = data.Institution.CountryName;
                    $scope.State = data.Institution.StateName;
                    $scope.City = data.Institution.CityName;
                    $scope.TimeZoneId = data.TimeZone_ID;
                    $scope.TimeZone_Id = data.TimeZone_ID;
                    $scope.AppointmentModuleId = data.Appointment_Module_Id;
                    $scope.AppointmentModule_Id = data.Appointment_Module_Id;
                    //$scope.Contract_Period_From = $filter('date')(data.Contract_PeriodFrom, "dd-MMM-yyyy");
                    $scope.Contract_Period_From = DateFormatEdit($filter('date')(data.Contract_PeriodFrom, "dd-MMM-yyyy"));
                    $scope.Health_Care_Professionals = data.Health_Care_Professionals;
                    $scope.Patients = data.No_Of_Patients;
                    $scope.Hive = data.No_Of_Hive;
                    $scope.HiveChart = data.No_Of_HiveChart;
                    $scope.Hive_Users = data.No_Of_HiveUsers;
                    $scope.HiveChart_Users = data.No_Of_HiveChartUsers;
                    //$scope.Hive_Devices = data.No_Of_HiveDevices;
                    $scope.HiveChart_Devices = data.No_Of_HiveChartDevices;
                    //$scope.Contract_Period_To = $filter('date')(data.Contract_PeriodTo, "dd-MMM-yyyy");
                    $scope.Contract_Period_To = DateFormatEdit($filter('date')(data.Contract_PeriodTo, "dd-MMM-yyyy"));
                    $scope.Subscription_Type = data.Subscription_Type;
                    $scope.TelephoneList = [];
                    if (data.TelePhone_User == 0) {
                        $scope.TelePhone_User = 1;
                    } else {
                        $scope.TelePhone_User = data.TelePhone_User;
                    }
                    $scope.InsSub_Id = data.SubscriptionId;
                    /*$scope.Chroniccc = data.ChronicCc;
                    $scope.Chroniccg = data.ChronicCg;
                    $scope.Chroniccl = data.ChronicCl;
                    $scope.Chronicsc = data.ChronicSc;*/
                    //$scope.insSubChronicChange();
                    $scope.Created_No_Of_Patient = data.Created_No_Of_Patient;
                    $scope.Created_No_Of_HealthCareProf = data.Created_No_Of_HealthCareProf;
                    $scope.Remaining_No_Of_Patient = data.Remaining_No_Of_Patient;
                    $scope.Remaining_No_Of_HealthCareProf = data.Remaining_No_Of_HealthCareProf;
                    $scope.Created_No_Of_Hive = data.Created_No_Of_Hive;
                    $scope.Created_No_Of_Hivechart = data.Created_No_Of_Hivechart;
                    $scope.Remaining_No_Of_Hive= data.Remaining_No_Of_Hive;
                    $scope.Remaining_No_Of_Hivechart = data.Remaining_No_Of_Hivechart;
                    $scope.Created_No_Of_Hive_Users = data.Created_No_Of_Hive_Users;
                    $scope.Created_No_Of_Hivechart_Users = data.Created_No_Of_Hivechart_Users;
                    $scope.Remaining_No_Of_Hive_Users = data.Remaining_No_Of_Hive_Users;
                    $scope.Remaining_No_Of_Hivechart_Users = data.Remaining_No_Of_Hivechart_Users;

                    angular.forEach($scope.InstitutiontypeList, function (item, modIndex) {

                        if ($ff($scope.InstitutionChildList, function (value) {
                            return value.ModuleId == item.Id;
                        }).length > 0) {
                            $scope.InstitutionAddList[modIndex] = true;
                        }
                        else {
                            $scope.InstitutionAddList[modIndex] = false;
                        }
                    })
                    angular.forEach($scope.AllDeviceNameList, function (item, modIndex) {

                        if ($ff($scope.InstitutionDeviceList, function (value) {
                            return value.DeviceId == item.Id;
                        }).length > 0) {
                            $scope.InstitutionAddDeviceName[modIndex] = true;
                        }
                        else {
                            $scope.InstitutionAddDeviceName[modIndex] = false;
                        }
                    })
                    angular.forEach($scope.LanguageList, function (item, modIndex) {

                        if ($ff($scope.InstitutionLanguageList, function (value) {
                            return value.LanguageId == item.Id;
                        }).length > 0) {
                            $scope.InstitutionAddLanguageList[modIndex] = true;
                        }
                        else {
                            $scope.InstitutionAddLanguageList[modIndex] = false;
                        }
                    })
                    $scope.InstitutionAddInsuranceList = [];
                    angular.forEach($scope.InstitutionInsuranceName, function (item, modIndex) {

                        if ($ff($scope.InstitutionInsurnceList, function (value) {
                            return value.Id == item.Id;
                        }).length > 0) {
                            $scope.InstitutionAddInsuranceList[modIndex] = true;
                        }
                        else {
                            $scope.InstitutionAddInsuranceList[modIndex] = false;
                        }
                    })
                    $scope.InstitutionAddPaymentList = [];
                    angular.forEach($scope.InstitutionPaymentMethod, function (item, modIndex) {

                        if ($ff($scope.InstitutionPaymentList, function (value) {
                            return value.Id == item.Id;
                        }).length > 0) {
                            $scope.InstitutionAddPaymentList[modIndex] = true;
                        }
                        else {
                            $scope.InstitutionAddPaymentList[modIndex] = false;
                        }
                    })
                    $("#chatLoaderPV").hide();
                    $scope.TelephoneList = $scope.TelephoneDataList;
                    setTimeout(() => { angular.element($('#telephone_Id' + $scope.TelePhone_User)).prop('checked', true); }, 500);
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
       
        //This is for clear the contents in the Page
        $scope.ClearInstitutionSubscriptionPopup = function () {
            $scope.Health_Care_Professionals = "";
            $scope.Patients = "";
            $scope.Hive = 0;
            $scope.HiveChart = 0;
            $scope.Hive_Users = 0;
            $scope.HiveChart_Users = 0;
            //$scope.Hive_Devices = 0;
            $scope.HiveChart_Devices = 0;
            $scope.Contract_Period_From = "";
            $scope.Contract_Period_To = "";
            $scope.Subscription_Type = "1";
            $scope.TelePhone_User = 1;
            $scope.InstitutionModule_List = [];
            $scope.InstitutionAddList = [];
            $scope.InstitutionAddLanguageList = [];
            $scope.InstitutionAddDeviceName = [];
            $scope.Institution_Id = "0";
            $scope.Email = "";
            $scope.Address1 = "";
            $scope.Address2 = "";
            $scope.Address3 = "";
            $scope.ZipCode = "";
            $scope.Country = "";
            $scope.State = "";
            $scope.City = "";
            $scope.TimeZone_ID = "0";
            $scope.TimeZoneId = "0";
            $scope.AppointmentModule_Id = "0";
            $scope.AppointmentModuleId = "0";
            $scope.InstitutionAddInsuranceList = [];
            $scope.InstitutionAddPaymentList = [];

           /* $scope.Chroniccc = false;
            $scope.Chroniccg = false;
            $scope.Chroniccl = false;
            $scope.Chronicsc = false;*/
            $scope.Hcp_Pat = false;
            $scope.Created_No_Of_Patient = "";
            $scope.Created_No_Of_HealthCareProf = "";
            $scope.Remaining_No_Of_Patient = "";
            $scope.Remaining_No_Of_HealthCareProf = "";
            $scope.Created_No_Of_Hive = "";
            $scope.Created_No_Of_HiveChart = "";
            $scope.Remaining_No_Of_Hive = "";
            $scope.Remaining_No_Of_HiveChart = "";

        }
        $scope.InstitutionSubscription_Delete = function () {
            //alert("Subscription cannot be activated / deactivated")
            toastr.info("Subscription cannot be activated / deactivated", "info");
        };
        if ($scope.serviceData > 0) {
            $scope.AddIntstitutionSubPopup();
        }

    }
]);