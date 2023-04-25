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
        $scope.TelePhone_User = 1;
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
        $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
            $scope.TimeZoneListID = response.data;
        }, function errorCallback(response) {
        });
        $http.get(baseUrl + '/api/DoctorShift/AppointmentModuleList/').then(function (response) {
            // only active Language    
            $scope.AppointmentModuleListID = response.data;
        }, function errorCallback(response) {
        });
        $http.get(baseUrl + '/api/InstitutionSubscription/TelephoningNameList/').then(function (response) {
            // only active Telephone    
            $scope.TelephoneList = response.data;
        }, function errorCallback(response) {
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
                $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                    $("#chatLoaderPV").hide();
                    $scope.DuplicatesId = response.data.Id;
                    $scope.InstitutiontypeList = response.data.Module_List;
                    $scope.InstitutionChildList = response.data.ChildModuleList;
                    $scope.LanguageList = response.data.Language_List;
                    $scope.InstitutionLanguageList = response.data.ChildLanguageList;
                    $scope.InstitutionLanguageName = response.data.ChildLanguageList;
                    $scope.PaymentList = response.data.Payment_List;
                    $scope.AllDeviceNameList = response.data.Device_list;
                    $scope.InstitutionDeviceList = response.data.ChildDeviceList;
                    $scope.InstitutionDeviceName = response.data.ChildDeviceList;
                    $scope.InstitutionInsurnceList = response.data.ChildInsuranceList;
                    $scope.InstitutionPaymentList = response.data.ChildPaymentList;
                    $scope.InstitutionLanguageList = response.data.ChildLanguageList;
                    $scope.Institution_Id = response.data.Institution_Id.toString();
                    $scope.ViewInstitution_Name = response.data.Institution.Institution_Name;
                    $scope.Email = response.data.Institution.Email;
                    $scope.Address1 = response.data.Institution.Institution_Address1;
                    $scope.Address2 = response.data.Institution.Institution_Address2;
                    $scope.Address3 = response.data.Institution.Institution_Address3;
                    $scope.ZipCode = response.data.Institution.ZipCode;
                    $scope.Country = response.data.Institution.CountryName;
                    $scope.State = response.data.Institution.StateName;
                    $scope.City = response.data.Institution.CityName;
                    $scope.Contract_Period_From = $filter('date')(response.data.Contract_PeriodFrom, "dd-MMM-yyyy");
                    $scope.Health_Care_Professionals = response.data.Health_Care_Professionals;
                    $scope.Patients = response.data.No_Of_Patients;
                    $scope.No_Of_Hive = response.data.No_Of_Hive;
                    $scope.No_Of_HiveChart = response.data.No_Of_HiveChart;
                    $scope.No_Of_Hive_Users = response.data.No_Of_HiveUsers;
                    $scope.No_Of_HiveChart_Users = response.data.No_Of_HiveChartUsers;
                    /*$scope.No_Of_Hive_Devices = data.No_Of_HiveDevices;
                    $scope.No_Of_HiveChart_Devices = data.No_Of_HiveChartDevices;*/
                    $scope.Contract_Period_To = $filter('date')(response.data.Contract_PeriodTo, "dd-MMM-yyyy");
                    $scope.Subscription_Type = response.data.Subscription_Type;
                    $scope.Recording_Type = response.data.Recording_Type;
                    $scope.TelePhone_User = response.data.TelePhone_User;
                    $scope.InsSub_Id = response.data.SubscriptionId;
                    $scope.TimeZoneId = response.data.TimeZone_ID;
                    $scope.AppointmentModuleId = response.data.Appointment_Module_Id;
                    $scope.TimeZoneIDName = "";
                    $scope.Chroniccc = response.data.ChronicCc;
                    $scope.Chroniccg = response.data.ChronicCg;
                    $scope.Chroniccl = response.data.ChronicCl;
                    $scope.Chronicsc = response.data.ChronicSc;
                    $scope.Created_No_Of_Patient = response.data.Created_No_Of_Patient;
                    $scope.Created_No_Of_HealthCareProf = response.data.Created_No_Of_HealthCareProf;
                    $scope.Remaining_No_Of_Patient = response.data.Remaining_No_Of_Patient;
                    $scope.Remaining_No_Of_HealthCareProf = response.data.Remaining_No_Of_HealthCareProf;
                    $scope.Created_No_Of_Hive = response.data.Created_No_Of_Hive;
                    $scope.Created_No_Of_Hivechart = response.data.Created_No_Of_Hivechart;
                    $scope.Remaining_No_Of_Hive = response.data.Remaining_No_Of_Hive;
                    $scope.Remaining_No_Of_Hivechart = response.data.Remaining_No_Of_Hivechart;
                    $scope.Created_No_Of_Hive_Users = response.data.Created_No_Of_Hive_Users;
                    $scope.Created_No_Of_Hivechart_Users = response.data.Created_No_Of_Hivechart_Users;
                    $scope.Remaining_No_Of_Hive_Users = response.data.Remaining_No_Of_Hive_Users;
                    $scope.Remaining_No_Of_Hivechart_Users = response.data.Remaining_No_Of_Hivechart_Users;
                    //$scope.Created_No_Of_Hive_Devices = data.Created_No_Of_Hive_Devices;
                    //$scope.Created_No_Of_Hivechart_Devices = data.Created_No_Of_Hivechart_Devices;
                    //$scope.Remaining_No_Of_Hive_Devices = data.Remaining_No_Of_Hive_Devices;
                    //$scope.Remaining_No_Of_Hivechart_Devices = data.Remaining_No_Of_Hivechart_Devices;
                    
                    if ($scope.Recording_Type == 0) {
                        $scope.RecordingType = 'Audio Only';
                    } else if ($scope.Recording_Type == 1) {
                        $scope.RecordingType = 'Audio & Video';
                    } else if ($scope.Recording_Type == 2) {
                        $scope.RecordingType = 'No';
                    }
                    $scope.TelePhone_User = response.data.TelePhone_User;
                    setTimeout(() => { angular.element($('#telephone_Id' + $scope.TelePhone_User)).prop('checked', true); }, 500);

                    $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).then(function (data2) {
                        $scope.TimeZoneList = data2.data;
                        for (i in data2.data) {
                            if ($scope.TimeZoneList[i].TimeZoneId == $scope.TimeZoneId) {
                                var TimeZoneRevealID = i;
                                $scope.TimeZoneIDName = data2.data[TimeZoneRevealID].TimeZoneDisplayName;
                                break;
                            }
                        }
                    }, function errorCallback(response) {
                    });
                    $http.get(baseUrl + '/api/DoctorShift/AppointmentModuleList/').then(function (response) {
                        // only active Language    
                        $scope.AppointmentModuleName = response.data[$scope.AppointmentModuleId - 1];
                    }, function errorCallback(response) {
                    });
                    $http.get(baseUrl + '/api/Common/InstitutionInsurance/').then(function (response) {
                        $scope.InstitutionInsuranceName = response.data;
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
                    }, function errorCallback(response) {
                    });

                    $http.get(baseUrl + '/api/Common/InstitutionPayment/').then(function (response) {
                        $scope.InstitutionPaymentMethod = response.data;

                        angular.forEach($scope.InstitutionPaymentMethod, function (item, modIndex) {

                            if ($ff($scope.InstitutionPaymentList, function (value) {
                                return value.Id == item.Id;
                            }).length > 0) {
                                $scope.InstitutionAddPaymentList[modIndex] = true;
                            }
                            else {
                                $scope.InstitutionAddPaymentList[modIndex] = false;
                            }
                        });
                        }, function errorCallback(response) {
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
                   

                }, function errorCallback(response) {
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
    }
]);