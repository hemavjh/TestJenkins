var InstitutionSubscriptionHAcontroller = angular.module("InstitutionSubscriptionHospitalAdminController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

InstitutionSubscriptionHAcontroller.controller("InstitutionSubscriptionHospitalAdminController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {

        //Declaration and initialization of Scope Variables.
        //$scope.InsModule_List = $rootScope.InsModuleList;
        $scope.ChildId = 0;
        $scope.Institution_Id = "0";
        $scope.Health_Care_Professionals = "";
        $scope.Patients = "";
        $scope.Contract_Period_From = "";
        $scope.Contract_Period_To = "";
        $scope.Subscription_Type = "1";
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.Chroniccc = false;
        $scope.Chroniccg = false;
        $scope.Chroniccl = false;
        $scope.Chronicsc = false;

        $scope.InstitutionViewList = [];
        $scope.IsActive = true;

        /* on click view, view popup opened*/
        $scope.ViewInstitution = function () {
            $scope.InstitutionDetails_View();
            alert("test");
            $location.path("/InstitutionHospitalAdmin_view/" + $scope.InstituteId);
        };
        $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
            $scope.TimeZoneListID = data;
        });
        $http.get(baseUrl + '/api/DoctorShift/AppointmentModuleList/').success(function (data) {
            // only active Language    
            $scope.AppointmentModuleListID = data;
        });
        // This is for to get Institution Modiule List 
        //$http.get(baseUrl + '/api/InstitutionSubscription/ModuleNameList/').success(function (data) {
        //    // only active Country    
        //    $scope.InstitutiontypeList = data;
        //});

        /*on click Save calling the insert update function for Institution Subscription */
        $scope.InstitutionAddList = [];
        $scope.InstitutionDeviceList = [];
        $scope.InstitutionAddLanguageList = [];
        $scope.InstitutionAddDeviceName = [];
        $scope.InstitutionModule_List = [];
        $scope.InstitutionLanguage_List = [];
        $scope.InstitutionInsurance_List = [];
        $scope.InstitutionPayment_List = [];
        $scope.InstitutionChildList = [];
        $scope.InstitutionAddInsuranceList = [];
        $scope.InstitutionAddPaymentList = [];
        /*THIS IS FOR View FUNCTION*/
        $scope.InstitutionSubscriptionDetails_View = function () {
            $scope.TimeZoneIDName = "";
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            if ($window.localStorage['UserTypeId'] == 3) {

                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.DuplicatesId = data.Id;
                    $scope.InstitutiontypeList = data.Module_List;
                    $scope.InstitutionChildList = data.ChildModuleList;
                    $scope.LanguageList = data.Language_List;
                    $scope.InstitutionLanguageList = data.ChildLanguageList;
                    $scope.InstitutionLanguageName = data.ChildLanguageList;
                    $scope.PaymentList = data.Payment_List;
                    $scope.AllDeviceNameList = data.Device_list;
                    $scope.InstitutionDeviceList = data.ChildDeviceList;
                    $scope.InstitutionDeviceName = data.ChildDeviceList;
                    $scope.InstitutionInsurnceList = data.ChildInsuranceList;
                    $scope.InstitutionPaymentList = data.ChildPaymentList;
                    $scope.InstitutionLanguageList = data.ChildLanguageList;
                    $scope.Institution_Id = data.Institution_Id.toString();
                    $scope.ViewInstitution_Name = data.Institution.Institution_Name;
                    $scope.Email = data.Institution.Email;
                    $scope.Address1 = data.Institution.Institution_Address1;
                    $scope.Address2 = data.Institution.Institution_Address2;
                    $scope.Address3 = data.Institution.Institution_Address3;
                    $scope.ZipCode = data.Institution.ZipCode;
                    $scope.Country = data.Institution.CountryName;
                    $scope.State = data.Institution.StateName;
                    $scope.City = data.Institution.CityName;
                    $scope.Contract_Period_From = $filter('date')(data.Contract_PeriodFrom, "dd-MMM-yyyy");
                    $scope.Health_Care_Professionals = data.Health_Care_Professionals;
                    $scope.Patients = data.No_Of_Patients;
                    $scope.No_Of_Hive = data.No_Of_Hive;
                    $scope.No_Of_HiveChart = data.No_Of_HiveChart;
                    $scope.No_Of_Hive_Users = data.No_Of_HiveUsers;
                    $scope.No_Of_HiveChart_Users = data.No_Of_HiveChartUsers;
                    $scope.No_Of_Hive_Devices = data.No_Of_HiveDevices;
                    $scope.No_Of_HiveChart_Devices = data.No_Of_HiveChartDevices;
                    $scope.Contract_Period_To = $filter('date')(data.Contract_PeriodTo, "dd-MMM-yyyy");
                    $scope.Subscription_Type = data.Subscription_Type;
                    $scope.InsSub_Id = data.SubscriptionId;
                    $scope.TimeZoneId = data.TimeZone_ID;
                    $scope.AppointmentModuleId = data.Appointment_Module_Id;
                    $scope.TimeZoneIDName = "";
                    $scope.Chroniccc = data.ChronicCc;
                    $scope.Chroniccg = data.ChronicCg;
                    $scope.Chroniccl = data.ChronicCl;
                    $scope.Chronicsc = data.ChronicSc;
                    $scope.Created_No_Of_Patient = data.Created_No_Of_Patient;
                    $scope.Created_No_Of_HealthCareProf = data.Created_No_Of_HealthCareProf;
                    $scope.Remaining_No_Of_Patient = data.Remaining_No_Of_Patient;
                    $scope.Remaining_No_Of_HealthCareProf = data.Remaining_No_Of_HealthCareProf;
                    $scope.Created_No_Of_Hive = data.Created_No_Of_Hive;
                    $scope.Created_No_Of_Hivechart = data.Created_No_Of_Hivechart;
                    $scope.Remaining_No_Of_Hive = data.Remaining_No_Of_Hive;
                    $scope.Remaining_No_Of_Hivechart = data.Remaining_No_Of_Hivechart;
                    $scope.Created_No_Of_Hive_Users = data.Created_No_Of_Hive_Users;
                    $scope.Created_No_Of_Hivechart_Users = data.Created_No_Of_Hivechart_Users;
                    $scope.Remaining_No_Of_Hive_Users = data.Remaining_No_Of_Hive_Users;
                    $scope.Remaining_No_Of_Hivechart_Users = data.Remaining_No_Of_Hivechart_Users;
                    $scope.Created_No_Of_Hive_Devices = data.Created_No_Of_Hive_Devices;
                    $scope.Created_No_Of_Hivechart_Devices = data.Created_No_Of_Hivechart_Devices;
                    $scope.Remaining_No_Of_Hive_Devices = data.Remaining_No_Of_Hive_Devices;
                    $scope.Remaining_No_Of_Hivechart_Devices = data.Remaining_No_Of_Hivechart_Devices;

                    $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).success(function (data2) {
                        $scope.TimeZoneList = data2;
                        for (i in data2) {
                            if ($scope.TimeZoneList[i].TimeZoneId == $scope.TimeZoneId) {
                                var TimeZoneRevealID = i;
                                $scope.TimeZoneIDName = data2[TimeZoneRevealID].TimeZoneDisplayName;
                                break;
                            }
                        }
                    });
                    $http.get(baseUrl + '/api/DoctorShift/AppointmentModuleList/').success(function (data) {
                        // only active Language    
                        $scope.AppointmentModuleName = data[$scope.AppointmentModuleId - 1];
                    });
                    $http.get(baseUrl + '/api/Common/InstitutionInsurance/').success(function (data) {
                        $scope.InstitutionInsuranceName = data;
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
                    });

                    $http.get(baseUrl + '/api/Common/InstitutionPayment/').success(function (data) {
                        $scope.InstitutionPaymentMethod = data;

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
                    });
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
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

    }
]);