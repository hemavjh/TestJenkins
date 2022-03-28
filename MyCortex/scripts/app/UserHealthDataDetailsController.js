var UserHealthDataDetails = angular.module("UserHealthDataDetailsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

UserHealthDataDetails.controller("UserHealthDataDetailsController", ['$scope', '$sce', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$interval', 'toastr',
    function ($scope, $sce, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $interval, toastr) {

        var dtToday = new Date();

        var month = dtToday.getMonth() + 1;
        var day = dtToday.getDate();
        var year = dtToday.getFullYear();
        if (month < 10)
            month = '0' + month.toString();
        if (day < 10)
            day = '0' + day.toString();

        var maxDate = year + '-' + month + '-' + day;

        $scope.startDateMin = maxDate;
        $scope.EndDateMin = maxDate;
        $rootScope.$on("show_payment_history", function (data) {
            show_payment_history(data);
        });
        function show_payment_history(data) {
            $scope.paymentHistory = [];
            var RowId = localStorage.getItem('rowId');
            $("#payment_waveLoader").show();
            angular.element('#appointment_payment_history').modal('show');
            $http.get(baseUrl + '/api/PatientAppointments/AppointmentPaymentHistory/?appointmentId=' + RowId + '&Login_Session_Id=' + $scope.LoginSessionId + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data1) {
                $scope.paymentHistory = data1;
                $("#payment_waveLoader").hide();
                localStorage.removeItem('rowId');
            }).error(function (data) { console.log(data); $("#payment_waveLoader").hide(); localStorage.removeItem('rowId'); });
        }
        if (chatService.checkCall($routeParams.Id)) {
            //alert('You cannot switch patient during call.')
            toastr.info("You cannot switch patient during call.", "info");
            $window.history.back();
            return false;
        }
        $scope.NewAppointmentDuration = 0;
        $scope.FollowUpDuration = 0;
        $scope.SearchMsg = "No Data Available";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.LiveDataCurrentTime = "";
        $scope.PatientLiveDataList = [];
        $scope.paymentHistory = [];
        $scope.PatientType = 1;
        $scope.LiveTabClick = function () {
            $('.chartTabs').addClass('charTabsNone');
            $("#chatLoaderPV").show();
            var ConfigCode = "LIVEDATA_STARTFROM";
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.date_size = data1[0].ConfigValue;
                var tempp = new Date(new Date().setDate(new Date().getDate() - ($scope.date_size - 1)));
                $scope.tempdate = $filter('date')(tempp, "dd-MMM-yyyy");
            });
            $scope.LiveDataPromise = $interval(function () {
                $http.get(baseUrl + '/api/User/PatientLiveData_List/?Patient_Id=' + $scope.SelectedPatientId + '&DataTime=' + $scope.tempdate + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.PatientLiveDataList = angular.copy(data.PatientHealthDataList);
                })
                $("#chatLoaderPV").hide();
            }, 10000) // 10000 ms execution

        }
        $scope.CancelLiveData = function () {
            if (angular.isDefined($scope.LiveDataPromise)) {
                $interval.cancel($scope.LiveDataPromise);
            }
        }
        $scope.LiveData_IsImage = function (FileName) {
            var file = FileName;
            var fileType = file.substr((file.lastIndexOf('.') + 1));
            var validImageTypes = ["gif", "jpeg", "png", "jpg", "ico", "gif"];
            if ($.inArray(fileType, validImageTypes) >= 0) {
                return true;
            }
            else { return false; }
        }
        $scope.AppointmoduleID = 1;
        $scope.AppointmoduleID1 = 1;
        $scope.Tick = false;
        //$scope.UpComingAppointmentDetails = [];
        //$scope.UpComingWaitingAppointmentDetails = [];
        $scope.userTypeId = $window.localStorage['UserTypeId'];
        //$scope.PreviousAppointmentDetails = [];
        $scope.flag = 0;
        $scope.MNR_No = "";
        $scope.StartDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.EndDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.OnSetDate = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.Type_Id = 0;
        $scope.LSType_Id = 0;
        $scope.VitalsType_Id = 0;
        $scope.VitalChart = '1';
        $scope.PatientHealthDataTableList = [];
        // $scope.Mode = $routeParams.Id;
        $scope.AppointmentFromTime = new Date();
        $scope.AppointmentToTime = new Date();
        $scope.Doctor_Id = "";
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.current_pageNote = 1;
        $scope.current_pageICD = 1;
        $scope.current_pagePillBox = 1;
        $scope.current_PatientAllergyPages = 1;
        $scope.current_others = 1;
        $scope.patientvitals_pages = 1;
        $scope.PatientNotes_pages = 1;
        $scope.PatientPillBoxPages = 1;
        $scope.PatientIcdPages = 1;
        $scope.PatientAllergyPages = 1;
        $scope.Patientothers = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.allergyActive = true;
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
            $scope.current_pageNote = p;
            $scope.current_pagePillBox = p;
            $scope.current_PatientAllergyPages = p;
            $scope.current_others = p;
        }
        //Reason text area is empty in New patient appointment
          $scope.TextArea1 = '';
        

        $scope.showMainBox = true;
        // $scope.ParamGroup_Id=2;    
        $scope.GroupParameterNameList = [];
        $scope.VitalsParameterList_Data = [];
        $scope.ParameterMappingList = [];
        $scope.LabParameterList_Data = [];
        $scope.ParameterId = "0";
        $scope.BookNewSettings = false;
        $scope.getParameterList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/GroupParameterNameList/?Patient_Id=' + $scope.SelectedPatientId + '&UnitGroupType_Id=' + $scope.unitgrouptype).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.Tick = true;
                $scope.GroupParameterNameList = data;

            });
        }

        $scope.getParameterMappingList = function (row) {
            $scope.ParameterId = row.ParameterId;
            $scope.UnitGroupType = row.UnitGroupType;
            $http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=' + $scope.ParameterId + '&Institution_Id=' + $window.localStorage['InstitutionId'] + '&Unitgroup_Type=' + $scope.UnitGroupType).success(function (data) {
                $scope.ParameterMappingList = data;
            });
        }
        AllParameterMappingList();
        function AllParameterMappingList() {
            $http.get(baseUrl + '/api/ParameterSettings/AllParameterMappingList/').success(function (data) {
                $scope.ParameterMappingList = data;
                for (let i = 0; i < $scope.AddVitalParameters.length; i++) {
                    $scope.AddVitalParameters[i].All_UnitLists = data;
                }
            });
        }

        // editable time value from app settings
        $scope.PATIENTDATA_EDITTIME = 0;
        $scope.ConfigCode = "PATIENTDATA_EDITTIME";
        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data) {
            if (data[0] != undefined) {
                $scope.PATIENTDATA_EDITTIME = parseInt(data[0].ConfigValue);
            }
        });
        //get the value from configuration (true /False)
        $scope.ConfigCode1 = "MEDICATION_END_DATE";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode1 + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
            $scope.Medication_End_Date = data1[0].ConfigValue;
        });
        // is editale check based on allowed editable time configuration
        $scope.IsEditableCheck = function (itemDate) {
            var diffminutes = moment().diff(moment(itemDate), 'minutes');
            if ($scope.PATIENTDATA_EDITTIME < diffminutes) {
                return false;
            }
            else {
                return true;
            }
        }

        $scope.PageParameter = $routeParams.PageParameter;
        if ($routeParams.PageParameter == "1") {
            $scope.SelectedPatientId = $window.localStorage['UserId'];
        }
        else {
            $scope.SelectedPatientId = $routeParams.Id;
        }
        $window.localStorage['SelectedPatientId'] = $scope.SelectedPatientId;

        $scope.PatientToTrans_CancelPopup = function () {
            //For Today Appointment Page
            $location.path("/TodaysAppoint_ments/");
        }

        $scope.CGAddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/1");
        }

        $scope.AddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/2");
        }

        $scope.AddPatientHomePopup = function () {
            $location.path("/Carecoordinatorpatient/4");
        }


        $scope.searchDoctor = function () {
            angular.element('#searchDoctor').modal('show');
        }
        $scope.ParameterSettingslist = [];
        /*ARRAY LIST FOR THE CHILD TABLE CUSTOMER DETAILS */
        $scope.ParameterSettingslist = [{
            'Id': 0,
            'Protocol_Id': 0,
            'ProtocolName': '',
            'Institution_Id': 0,
            'Institution_Name': '',
            'Parameter_Id': 0,
            'ParameterName': '',
            'Units_ID': 0,
            'UnitsName': '',
            'Com_DurationType': 0,
            'DurationName': '',
            'Diag_HighMax_One': '',
            'Diag_HighMin_One': '',
            'Diag_MediumMax_One': '',
            'Diag_MediumMin_One': '',
            'Diag_LowMax_One': '',
            'Diag_LowMin_One': '',
            'Diag_HighMax_Two': '',
            'Diag_HighMin_Two': '',
            'Diag_MediumMax_Two': '',
            'Diag_MediumMin_Two': '',
            'Diag_LowMax_Two': '',
            'Diag_LowMin_Two': '',
            'Comp_Duration': '',
            'Comp_High': '',
            'Comp_Medium': '',
            'Comp_Low': '',
            'Isactive': 1,
            'Created_By': '',
            'NormalRange_High': '',
            'NormalRange_Low': ''
        }];

        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.ParameterSettingslist1 = [];
        $http.get(baseUrl + 'api/ParameterSettings/ViewEditProtocolParameters/?Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.ViewParamList = data;
        });
        $scope.ParameterSettings_ViewEdit = function () {

            angular.forEach($scope.ParameterSettingslist, function (masterVal, masterInd) {
                $scope.ViewParamList1 = $ff($scope.ViewParamList, { Parameter_ID: masterVal.Parameter_Id }, true);

                if ($scope.ViewParamList1.length > 0) {
                    angular.forEach($scope.ViewParamList1, function (masterVal1, masterInd1) {

                        masterVal.NormalRange_High = masterVal1.NormalRange_High;
                        masterVal.NormalRange_Low = masterVal1.NormalRange_low;
                    })
                }

                else {
                    masterVal.NormalRange_High = "";
                    masterVal.NormalRange_Low = "";

                };

            });
        };


        $scope.ProtocolDetails_View = function () {
            if ($scope.assignedProtocolId == "" || typeof ($scope.assignedProtocolId) == undefined) {
                //alert("Monitoring Protocol is not assigned");
                toastr.warning("Monitoring Protocol is not assigned", "warning");
            }
            else {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/User/ProtocolMonitoringProtocolView/?Id=' + $scope.assignedProtocolId).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.PROTOCOLNAME = data.Protocol_Name;
                    $scope.ParameterSettingslist = data.ChildModuleList;

                    if ($scope.ParameterSettingslist.length > 0) {
                        angular.element('#MonitoringProtocolCreateModal').modal('show');
                    }
                    else {
                        //alert("Monitoring protocol is not assigned");
                        toastr.warning("Monitoring protocol is not assigned", "warning");
                    }
                });
            }
        }
        /*Open the monitoring protocol */
        $scope.openProtocol = function () {

            $scope.ProtocolDetails_View();
        }
        /*Cancel the monitoring protocol */
        $scope.CancelProtocol = function () {
            angular.element('#MonitoringProtocolCreateModal').modal('hide');
        }

        $scope.PatientAppointmentpopup = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }

        $scope.CancelPatientAppointment = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }

        $scope.PatientDetailsView = function () {
            if ($scope.PageParameter == 1) {
                //Patient data page to Patient View profile
                $location.path("/PatientView/" + $scope.Id + "/1/3");
            }
            else if ($scope.PageParameter == 2) {
                //Doctor Pages -> Patient Data pages -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/3/3");
            }
            else if ($scope.PageParameter == 3) {
                $location.path("/PatientView/" + $scope.Id + "/4/3");
            }
            else if ($scope.PageParameter == 4) {
                //Doctor Pages -> All Patients -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/5/3");
            }
            else if ($scope.PageParameter == 5) {
                //Care Coordinator ->Diagostic Alert -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/6/3");
            }
            else if ($scope.PageParameter == 6) {
                //Care Coordinator ->Compliance Alert -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/7/3");
            }
            else if ($scope.PageParameter == 7) {
                //Care Giver ->Assigned Patient -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/8/3");
            }
        }

        $scope.EditPatientDetails = function () {
            $location.path("/PatientEdit/" + $scope.Id + "/1/3");
        }

        $scope.PatientGroupList = function () {
            $scope.PatientGroupNameList();
            angular.element('#PatientGroupListModal').modal('show');
        }
        $scope.PatientGroupflag = 0;
        $scope.GroupName_List = [];
        /*This function is for List the Group Name based on UserId*/
        $scope.PatientGroupNameList = function () {
            $http.get(baseUrl + '/api/User/PatientGroupNameList/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                $scope.GroupName_List = data;
                $scope.SearchMsg = "No Data Available";

            })
        };

        $scope.PatientAllergiesList = function (row) {
            $scope.data = row;
            if ($scope.data.length == 0) {
                angular.element('#PatientAllergyListModal').modal('hide');
            }
            else {
                $scope.PatientAllergiesNameList();
                angular.element('#PatientAllergyListModal').modal('show');
            }
        }

        //$scope.PatientAllergiesNameList = function () {
        //    $scope.PatientId = $window.localStorage['UserId'];
        //    $http.get(baseUrl + '/api/User/PatientAllergiesNameList/?PatientId=' + $scope.PatientId).success(function (data) {
        //        $scope.AllergiesName_List = data;
        //    })
        //};

        $scope.CancelPatientGroupNamePopup = function () {
            angular.element('#PatientGroupListModal').modal('hide');

        };
        $scope.CancelPatientMonitoringProtocolModal = function () {
            angular.element('#PatientMonitoringProtocolModal').modal('hide');
        }
        $scope.CancelPatientAllergyNamePopup = function () {
            angular.element('#PatientAllergyListModal').modal('hide');
        }

        $scope.PatientEditProfileCancel = function () {
            $location.path("/Carecoordinatorpatient/Id");
        }
        $scope.MonitoringProtocolId = "";
        $scope.Monitoring_ProtocolId = "";
        $scope.assignedProtocolId = "";
        $scope.MonitoringProtocolName = [];

        var photoview = false;
        var photoview1 = false;
        var photoview2 = false;
        $scope.uploadview = false;
        $scope.unitgrouptype = 1;
        $scope.UnitGroupTypeList = [];
        $scope.MyAppoinmentdata = [];
        $scope.MyAppointment = [];

        $scope.getUnitGroupType_List = function () {
            $http.get(baseUrl + '/api/Common/getUnitGroupType/').success(function (data) {
                $scope.UnitGroupTypeList = data;
            });

        }
        $scope.appdocfile = ''
        $scope.appdocfilename = ''
        $scope.fileexceed = ""
        $scope.filetype = ''
        $scope.files = [];
        $scope.appdocfileChange = function (e, index) {
            let maxSize = (5 * 1024) * 1024;
            let fileSize = e.files[0].size;
            if (fileSize >= maxSize) {
                $scope.fileexceed = "File size exceeds 5 MB";
            }
            else {
                $scope.appdocfilename = e.files[0]['name'];
                $scope.filetype = e.files[0].type;
                $scope.files.push(e.files[0])
            }

        }

        $scope.UnitGroupPreference = function () {
            //$http.get(baseUrl + '/api/ParameterSettings/UnitGroupPreferenceGet/?institutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
            //    $scope.unitgrouptype = data.PreferenceType;
            //})

        }

        $scope.MyAppointments = function () {
            $("#chatLoaderPV").show();
            $scope.ChronicDetails();
            $http.get(baseUrl + '/api/User/DoctorAppoinmentsList/?PatientId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.getMyAppointments();
                //var Patient = parseInt(window.localStorage['SelectedPatientId']);
                $scope.MyAppoinmentdata = data;
                //angular.forEach($scope.MyAppoinmentdata, function (value, index) {
                //    if (Patient === value.Patient_Id) {
                //        $scope.MyAppointment.push(value);
                //    }
                //});
            });
        }

        $scope.DefaultChronic = function () {
            var Brain = document.getElementById('Brain');
            Brain.innerHTML = '<img src="images/image004.png">';

            var detail = document.getElementById('Alzheimer');
            detail.innerHTML = "";
            var detail = document.getElementById('Arthritis');
            detail.innerHTML = "";
            var detail = document.getElementById('Epilepsy');
            detail.innerHTML = "";
            var detail = document.getElementById('Parkinson_Disease');
            detail.innerHTML = "";
            var detail = document.getElementById('Sclerosis');
            detail.innerHTML = "";
            var detail = document.getElementById('Stroke');
            detail.innerHTML = "";

            var Lungs = document.getElementById('Lungs');
            Lungs.innerHTML = '<img src="images/image006.png">';

            var detail = document.getElementById('Pulmonary_Disease');
            detail.innerHTML = "";
            var detail = document.getElementById('Lung_Disease');
            detail.innerHTML = "";
            var detail = document.getElementById('Asthma');
            detail.innerHTML = "";
            var detail = document.getElementById('Cancer');
            detail.innerHTML = "";
            var detail = document.getElementById('Diabetes');
            detail.innerHTML = "";

            var Heart = document.getElementById('Heart');
            Heart.innerHTML = '<img src="images/image009.png">';
            var detail = document.getElementById('Heart_Disease');
            detail.innerHTML = "";
            var detail = document.getElementById('Hypertension');
            detail.innerHTML = "";
            var detail = document.getElementById('Kidney_Disease');
            detail.innerHTML = "";
        }

        $scope.ChronicDetails = function () {
            $http.get(baseUrl + '/api/User/Chronic_Conditions/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                if (data.length !== 0 && data != null && data != undefined) {
                    $scope.DefaultChronic();
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].ChronicGroup == 1) {
                            var Brain = document.getElementById('Brain');
                            Brain.innerHTML = '<img src="images/image004Active.png">';

                            if (data[i].ChronicCondition === "Alzheimer") {
                                var detail = document.getElementById('Alzheimer');
                                detail.innerHTML = "<img src='images/image004Active.png' /> <label class='LetFont1'>Alzheimer</label>";
                            }
                            else if (data[i].ChronicCondition === "Arthritis") {
                                var Arthritis = document.getElementById('Bone');
                                Arthritis.innerHTML = '<img src="images/image005Active.png">';

                                var detail = document.getElementById('Arthritis');
                                detail.innerHTML = "<img src='images/image005Active.png' /> <label class='LetFont1'>Arthritis</label>";
                            }
                            else if (data[i].ChronicCondition === "Epilepsy") {
                                var detail = document.getElementById('Epilepsy');
                                detail.innerHTML = "<img src='images/image004Active.png' /> <label class='LetFont1'>Epilepsy</label>";
                            }
                            else if (data[i].ChronicCondition === "Parkinson Disease") {
                                var detail = document.getElementById('Parkinson_Disease');
                                detail.innerHTML = "<img src='images/image004Active.png' /> <label class='LetFont1'>Parkinson Disease</label>";
                            }
                            else if (data[i].ChronicCondition === "Sclerosis") {
                                var detail = document.getElementById('Sclerosis');
                                detail.innerHTML = "<img src='images/image004Active.png' /> <label class='LetFont1'>Sclerosis</label>";
                            }
                            else if (data[i].ChronicCondition === "Stroke") {
                                var detail = document.getElementById('Stroke');
                                detail.innerHTML = "<img src='images/image004Active.png' /> <label class='LetFont1'>Stroke</label>";
                            }
                        }

                        if (data[i].ChronicGroup == 2) {
                            if (data[i].ChronicCondition === "Pulmonary Disease") {
                                var Lungs = document.getElementById('Lungs');
                                Lungs.innerHTML = '<img src="images/image006Active.png">';

                                var detail = document.getElementById('Pulmonary_Disease');
                                detail.innerHTML = "<img src='images/image006Active.png' /> <label class='LetFont1'>Pulmonary Disease</label>";
                            }
                            else if (data[i].ChronicCondition === "Lung Disease") {
                                var Lungs = document.getElementById('Lungs');
                                Lungs.innerHTML = '<img src="images/image006Active.png">';

                                var detail = document.getElementById('Lung_Disease');
                                detail.innerHTML = "<img src='images/image006Active.png' /> <label class='LetFont1'>Lung Disease</label>";
                            }
                            else if (data[i].ChronicCondition === "Asthma") {
                                var Lungs = document.getElementById('Lungs');
                                Lungs.innerHTML = '<img src="images/image006Active.png">';

                                var detail = document.getElementById('Asthma');
                                detail.innerHTML = "<img src='images/image006Active.png' /> <label class='LetFont1'>Asthma</label>";
                            }
                            else if (data[i].ChronicCondition === "Cancer") {
                                var Cancer = document.getElementById('Ribbon');
                                Cancer.innerHTML = '<img src="images/image007Active.png">';

                                var detail = document.getElementById('Cancer');
                                detail.innerHTML = "<img src='images/image007Active.png' /> <label class='LetFont1'>Cancer</label>";
                            }
                            else if (data[i].ChronicCondition === "Diabetes") {
                                var Diabetes = document.getElementById('Diabetes');
                                Diabetes.innerHTML = '<img src="images/image008Active.png">';

                                var detail = document.getElementById('sugarblood');
                                detail.innerHTML = "<img src='images/image008Active.png' /> <label class='LetFont1'>Diabetes</label>";
                            }
                        }

                        if (data[i].ChronicGroup == 3) {
                            var Heart = document.getElementById('Heart');
                            Heart.innerHTML = '<img src="images/image009Active.png">';

                            if (data[i].ChronicCondition === "Heart Disease") {
                                var detail = document.getElementById('Heart_Disease');
                                detail.innerHTML = "<img src='images/image009Active.png' /> <label class='LetFont1'>Heart Disease</label>";
                            }
                            else if (data[i].ChronicCondition === "Hypertension") {
                                var detail = document.getElementById('Hypertension');
                                detail.innerHTML = "<img src='images/image009Active.png' /> <label class='LetFont1'>Hypertension</label>";
                            }
                            else if (data[i].ChronicCondition === "Kidney Disease") {
                                var Diabetes = document.getElementById('Kidney');
                                Diabetes.innerHTML = '<img src="images/image0010Active.png">';

                                var detail = document.getElementById('Kidney_Disease');
                                detail.innerHTML = "<img src='images/image0010Active.png' /> <label class='LetFont1'>Kidney Disease</label>";
                            }
                        }
                    }
                }
            });
        }

        $http.get(baseUrl + '/api/SendEmail/User_get_NotificationList/?User_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

            var NotificationCount = document.getElementById('notificationCount');
            NotificationCount.textContent = data.NotificationUnread;
        });
        $scope.PatientBasicDetails_List = function () {
            if ($window.localStorage['UserTypeId'] == 2 || $window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 5 || $window.localStorage['UserTypeId'] == 6 || $window.localStorage['UserTypeId'] == 7) {
                $("#chatLoaderPV").show();
                photoview = true;
                //$scope.UpComingAppointmentCount = 0;
                //$scope.PreviousAppointmentCount = 0;
                var methodcnt = 2;
                $http.get(baseUrl + '/api/User/UserDetails_GetPhoto/?Id=' + $scope.SelectedPatientId).success(function (data) {
                    methodcnt = methodcnt - 1;
                    if (methodcnt == 0)
                        $scope.uploadview = true;
                    if (data.PhotoBlob != null) {
                        $scope.uploadme = 'data:image/png;base64,' + data.PhotoBlob;
                    }
                    else {
                        $scope.uploadme = null;
                    }
                })
                $http.get(baseUrl + '/api/User/PatientBasicDetailsList/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.Id = data.PatientId;
                    $scope.FullName = data.FullName;
                    $scope.MobileNo = data.MOBILE_NO;
                    $scope.Photo = data.Photo;
                    $scope.FileName = data.FileName;
                    $scope.DOB = $filter('date')(data.DOB, "dd-MMM-yyyy");
                    $scope.MNR_No = data.MNR_NO;
                    $scope.NationalId = data.NATIONALID;
                    $scope.GenderId = data.GenderId;
                    $scope.ViewGenderName = data.GENDER_NAME;
                    $scope.PatientType = data.Patient_Type;
                    $scope.showUserType = data.UserType;
                    $scope.PhotoBlobs = data.PhotoBlobs;
                    methodcnt = methodcnt - 1;
                    $('#User_id').show();
                    $('#patient_profile').show();
                    $('#BrainGroup').show();
                    $('#KnownGroup').show();
                    var imgSrc = document.getElementById('imgSrc');
                    imgSrc.src = $scope.PhotoBlobs;
                    var NATIONALITY_ID = document.getElementById('NATIONALITY_ID');
                    NATIONALITY_ID.textContent = $scope.NationalId;

                    var USERTYPE_ID = document.getElementById('USERTYPE_ID');
                    USERTYPE_ID.textContent = $scope.showUserType;
                    var MOBILE_NO = document.getElementById('MOBILE_NO');
                    MOBILE_NO.textContent = $scope.MobileNo;

                    var DOB = document.getElementById('DOB');
                    $scope.DOB = moment($scope.DOB).format('DD-MMM-YYYY')
                    DOB.textContent = $scope.DOB;

                    var fullname = document.getElementById('fullname');
                    fullname.textContent = $scope.FullName;

                    var Gender = document.getElementById('Gender');
                    Gender.textContent = $scope.ViewGenderName;

                    var dob = $scope.DOB;
                    var gt = DateFormat(dob);
                    dob = gt.replace(/-/gi, '');
                    var year = dob.substr(4, 9);
                    var month = dob.substr(2, 2);
                    var day = dob.substr(0, 2);
                    var today = new Date();
                    var age = today.getFullYear() - year;

                    Age = document.getElementById('Age');
                    Age.textContent = age.toString();
                    if (methodcnt == 0)
                        $scope.uploadview = true;
                    if ($scope.PatientType == 2) {
                        $('#divPatientType').attr('style', 'display : none');
                    }
                    else
                        $('#divPatientType').attr('style', 'display : none');
                    if (data.Protocol_Id != null) {
                        $scope.MonitoringProtocolId = data.Protocol_Id.toString();
                        $scope.ViewProtocolName = data.ProtocolName;
                        $scope.MonitoringProtocolName = data.ProtocolName;
                        $scope.assignedProtocolId = $scope.MonitoringProtocolId;
                        $scope.Monitoring_ProtocolId = $scope.MonitoringProtocolId;
                    }
                    if ($scope.UserTypeId != 2) {
                        $scope.chattingWith = data.FullName;
                    }
                    //patientAppointmentList();
                    //function patientAppointmentList() {
                    //    $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    //        $scope.UpComingAppointmentDetails = [];
                    //        $scope.UpComingAppointmentDetails = data.PatientAppointmentList;
                    //        compareAppointmentDates();
                    //    });
                    //}
                    //$scope.calcNewYear;
                    //function compareAppointmentDates() {
                    //    $scope.calcNewYear = setInterval(checkdates(), 1000);
                    //}
                    //function checkdates() {
                    //    var AppoinList = $scope.UpComingAppointmentDetails;
                    //    for (i = 0; i < AppoinList.length; i++) {
                    //        var startdate1 = moment(new Date($scope.UpComingAppointmentDetails[i].Appointment_FromTime));
                    //        var enddate1 = moment(new Date());
                    //        var diff1 = Math.abs(enddate1 - startdate1);
                    //        //var days1 = Math.floor(diff1 / (60 * 60 * 24 * 1000));
                    //        //var hours1 = Math.floor(diff1 / (60 * 60 * 1000)) - (days1 * 24);
                    //        //var minutes1 = Math.floor(diff1 / (60 * 1000)) - ((days1 * 24 * 60) + (hours1 * 60));
                    //        //var seconds1 = Math.floor(diff1 / 1000) - ((days1 * 24 * 60 * 60) + (hours1 * 60 * 60) + (minutes1 * 60));
                    //        var CallRemain1 = Math.floor(diff1 / (60 * 1000));
                    //        $scope.CallButton1 = CallRemain1;
                    //        var date_future = new Date($scope.UpComingAppointmentDetails[i].Appointment_FromTime);
                    //        var date_now = new Date();

                    //        var seconds = Math.floor((date_future - (date_now)) / 1000);
                    //        var minutes = Math.floor(seconds / 60);
                    //        var hours = Math.floor(minutes / 60);
                    //        var days = Math.floor(hours / 24);
                    //        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {

                    //        }
                    //        hours = hours - (days * 24);
                    //        minutes = minutes - (days * 24 * 60) - (hours * 60);
                    //        seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                    //        var timeDiffString1 = "";
                    //        if (days != 0) {
                    //            timeDiffString1 = timeDiffString1 + days + ' day ';
                    //        }
                    //        if (hours != 0) {
                    //            timeDiffString1 = timeDiffString1 + hours + ' hr ';
                    //        }
                    //        if (minutes != 0) {
                    //            timeDiffString1 = timeDiffString1 + minutes + ' min ';
                    //        }
                    //        if (seconds != 0) {
                    //            timeDiffString1 = timeDiffString1 + seconds + ' sec';
                    //        }
                    //        AppoinList[i].TimeDifference = timeDiffString1;
                    //        AppoinList[i]['RemainingTimeInMinutes'] = CallRemain1;
                    //    }
                    //    if ($scope.UpComingAppointmentDetails != null) {
                    //        $scope.UpComingAppointmentCount = $scope.UpComingAppointmentDetails.length;
                    //    }
                    //    $scope.UpComingAppointmentDetails = AppoinList;
                    //    $scope.$apply();
                    //}
                    //if ($scope.userTypeId == 5) {
                    //    CG_PatientAppointment_List();
                    //}
                    //function CG_PatientAppointment_List() {
                    //    $http.get(baseUrl + '/api/User/CG_PatientAppointmentList/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    //        $scope.UpComingWaitingAppointmentDetails = data.PatientAppointmentList;
                    //        if ($scope.UpComingWaitingAppointmentDetails != null) {
                    //            $scope.UpComingWaitingAppointmentCount = $scope.UpComingWaitingAppointmentDetails.length;
                    //        }
                    //    });
                    //}
                    //$http.get(baseUrl + '/api/User/PatientPreviousAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    //    $scope.PreviousAppointmentDetails = data.PatientAppointmentList;
                    //    $scope.PreviousAppointmentCount = $scope.PreviousAppointmentDetails.length;
                    //});

                    //alert(moment(new Date()).format('DD-MMM-YYYY'));
                    $scope.ByDateDeptList = function () {
                        var AppDate = document.getElementById('dateee').value; //$scope.AppoimDate;
                        var res = convert(AppDate);
                        $scope.DepartmentList1 = [];
                        $http.get(baseUrl + '/api/DoctorShift/ByDateDept_List/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Filter_Date=' + res + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                            $scope.DepartmentList1 = data;
                        });
                    }
                    $http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                        $scope.DepartmentList = data;
                    });

                    $http.get(baseUrl + '/api/DoctorShift/TimeZoneList/?Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                        $scope.TimeZoneList = data;
                    });
                    $scope.bookcc = 0;
                    $scope.bookCg = 0;
                    $scope.bookCl = 0;
                    $scope.bookSc = 0;
                    $scope.bookpa = 0;
                    var current_date = new Date().getFullYear() + '-' + (((new Date().getMonth() + 1).toString().length > 1) ? ((new Date().getMonth() + 1).toString()) : '0' + (new Date().getMonth() + 1).toString()) + '-' + (((new Date().getDate()).toString().length > 1) ? ((new Date().getDate()).toString()) : '0' + (new Date().getDate()).toString());
                    angular.element(document.getElementById('datee')).attr('min', current_date);
                    $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingView/?InstitutionId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                        if (data != null) {
                            if (data.IsCc) { $scope.bookcc = 6; }
                            if (data.IsCg) { $scope.bookCg = 5; }
                            if (data.IsCl) { $scope.bookCl = 4; }
                            if (data.IsSc) { $scope.bookSc = 7; }
                            if (data.IsPatient) { $scope.bookpa = 2; }
                            $scope.NewAppointmentDuration = data.NewAppointmentDuration;
                            $scope.FollowUpDuration = data.FollowUpDuration;
                            if (data.MaxScheduleDays) {
                                var futu_date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + data.MaxScheduleDays);
                                var futureDate = futu_date.getFullYear() + '-' + (((futu_date.getMonth() + 1).toString().length > 1) ? ((futu_date.getMonth() + 1).toString()) : '0' + (futu_date.getMonth() + 1).toString()) + '-' + (((futu_date.getDate()).toString().length > 1) ? ((futu_date.getDate()).toString()) : '0' + (futu_date.getDate()).toString());
                                angular.element(document.getElementById('datee')).attr('max', futureDate);
                            }
                            $scope.UserTypeId = $window.localStorage['UserTypeId'];
                            if ($scope.bookcc == $scope.UserTypeId || $scope.bookCg == $scope.UserTypeId || $scope.bookCl == $scope.UserTypeId || $scope.bookSc == $scope.UserTypeId || $scope.bookpa == $scope.UserTypeId) {
                                document.getElementById("BookNew").disabled = false;
                                $scope.BookNewSettings = true;
                            } else {
                                document.getElementById("BookNew").disabled = true;
                                $scope.BookNewSettings = false;
                            }
                        }
                        if (data == null) {
                            //alert('Please Check OrgSettings, Appointment User Is Empty!');
                            toastr.info("Please Check OrgSettings, Appointment User Is Empty!", "info");
                            return false;
                        }
                    });

                    $scope.SearchAvailibleDoctorsList = function () {
                        var dt = moment(new Date()).format('DD-MM-YYYY');
                        var AppointmentDate = moment($scope.AppoimDate).format('DD-MM-YYYY');
                        $scope.DoctorListWithTimeZone = [];
                        $scope.DoctorListWithTimeZone1 = [];
                        document.getElementById("show").disabled = true;
                        if (($scope.AppoimDate != "" || $scope.AppoimDate != undefined) && (ParseDate(dt) > ParseDate($scope.AppoimDate))) {
                            toastr.warning("Please avoid past date as AppointmentDate", "warning");
                        }
                        else if ($scope.SelectedSpeciality == undefined || $scope.SelectedSpeciality == null || $scope.SelectedSpeciality == "") {
                            //alert('Please select Speciality')
                            toastr.warning("Please select Speciality", "warning");
                        } else if ($scope.AppoimDate == undefined || $scope.AppoimDate == null || $scope.AppoimDate == "") {
                            //alert('Please select Date')
                            toastr.warning("Please select Date", "warning");
                        }/* else if ($scope.TimeZoneID == undefined || $scope.TimeZoneID == null || $scope.TimeZoneID == "") {
                    alert('Please select TimeZone')
                }*/ else {
                            $("#appoint_waveLoader").show();
                            var DeptID = $scope.DeptIDAsSTR;
                            var AppDate = $scope.AppoimDate;
                            var res = convert(AppDate);
                            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                            $http.get(baseUrl + '/api/PatientAppointments/DepartmentwiseDoctorList/?DepartmentIds=' + DeptID + '&InstitutionId=' + $scope.SelectedInstitutionId + '&Date=' + res + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                                $("#appoint_waveLoader").hide();
                                $scope.DoctorListWithTimeZone = data;
                                $scope.DoctorListWithTimeZone1 = $scope.DoctorListWithTimeZone;
                            }).error(function (data) { $("#appoint_waveLoader").hide(); });
                        }

                    }
                    $scope.DeptIDStr = function () {
                        $scope.DeptIDAsSTR = [];
                        angular.forEach($scope.SelectedSpeciality, function (value, key) {
                            var obj = value.toString();
                            $scope.DeptIDAsSTR.push(obj);
                        });
                    }
                    $scope.ViewDoctorBio = function (Doctor_Id) {
                        angular.element('#DoctorBioModal').modal('show');
                        $scope.DoctorID = Doctor_Id;
                        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                        $http.get(baseUrl + '/api/User/UserDetails_View?Id=' + $scope.DoctorID + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            $scope.DoctorDetailList = data;
                        })
                    }
                    $scope.DoctorDetailList = [];
                    $scope.idSelectedVote = null;
                    $scope.GetDoctorDetails = function (list) {
                        $("#chatLoaderPV").show();
                        $scope.DoctorID = [];
                        document.getElementById("DocDetails").hidden = false;
                        document.getElementById("show").disabled = false;
                        $scope.idSelectedVote = list;
                        $scope.DoctorID = list.Doctor_Id;
                        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                        $scope.ViewGender = '';
                            $http.get(baseUrl + '/api/User/UserDetails_View?Id=' + $scope.DoctorID + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            $scope.DoctorDetailList = data;
                                                            
                            $("#chatLoaderPV").hide();
                            $scope.AppointmoduleID = data.Appointment_Module_Id;
                            $scope.AppointmoduleID1 = data.Appointment_Module_Id;
                            $scope.paymentdepartmentId = data.DEPARTMENT_ID;
                            $scope.paymentInstitutionId = data.INSTITUTION_ID;
                            $scope.TimeZoneID = data.TimeZone_Id.toString();
                            if (data.Appointment_Module_Id == 2) {
                                setTimeout(function () { document.getElementById('Radio1').click(); }, 5000);
                            }
                            else if (data.Appointment_Module_Id == 3) {
                                setTimeout(function () { document.getElementById('Radio2').click(); }, 5000);
                            }
                        })
                        

                    }
                    function convert(str) {
                        var date = new Date(str),
                            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                            day = ("0" + date.getDate()).slice(-2);
                        return [date.getFullYear(), mnth, day].join("-");
                    }
                    $scope.newAppoinmentDates = function () {
                        $scope.TextArea1='';
                        var dt = moment(new Date()).format('DD-MM-YYYY');
                        var AppointmentDate = moment($scope.AppoimDate).format('DD-MM-YYYY');
                        $scope.DoctorListWithTimeZone = [];
                        document.getElementById("show").disabled = true;
                        if (($scope.AppoimDate != "" || $scope.AppoimDate != undefined) && (ParseDate(dt) > ParseDate($scope.AppoimDate))) {
                            toastr.warning("Please avoid past date as AppointmentDate", "warning");
                        }
                        else if ($scope.DoctorID == undefined || $scope.DoctorID.length == 0 || $scope.DoctorID == null) {
                            //alert('Please select Doctor')
                            toastr.warning("Please select Doctor", "warning");
                        } else {
                            //alert(Intl.DateTimeFormat().resolvedOptions().timeZone);
                            //var timezone = new Date().toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4);
                            //for (i = 0; i <= $scope.TimeZoneList.length - 1; i++) {
                            //    if ($scope.TimeZoneList[i].TimeZoneName == timezone) {
                            //        $scope.TimeZoneID = $scope.TimeZoneList[i].TimeZoneId.toString();
                            //    }
                            //}
                            $scope.newScheduledDates = [];
                            $scope.DataNotAvailible = 0;
                            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                            //document.getElementById("main-box").style = "display:none";
                            //document.getElementById("box").style = "";
                            $scope.showMainBox = false;
                            TimeSlot();
                            $http.get(baseUrl + '/api/PatientAppointments/GetScheduledDates/?&Login_Session_Id=' + $scope.LoginSessionId + '&InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                                $scope.newScheduledDates = data;
                                var dattas = data.ScheduledDaysList;
                                var AppDate = $scope.AppoimDate;
                                var ApppDate = AppDate.getTime();

                                for (i = 0; i <= dattas.length - 1; i++) {
                                    var today = dattas[i].Date;
                                    var toToday = new Date(today);
                                    var ApppoDate = toToday.getTime();
                                    var Currentdt = moment(toToday).format('DD-MM-YYYY');
                                    var CurrentAppointmentDate = moment($scope.AppoimDate).format('DD-MM-YYYY');

                                    if (ApppDate == ApppoDate || CurrentAppointmentDate == Currentdt) {
                                        $scope.a = i - 2;
                                        $scope.b = i + 3;
                                        if ($scope.a == -1 || $scope.a == -2) {
                                            $scope.a = 0;
                                            $scope.b = 5;
                                        } else if ($scope.b >= dattas.length - 1) {
                                            $scope.a = dattas.length - 5;
                                            $scope.b = dattas.length;
                                        } else {
                                            $scope.a = i - 2;
                                            $scope.b = i + 3;
                                        }
                                        workingDate();
                                        $scope.idSelectedSchedule = dattas[i];
                                        var list = dattas[i];
                                        var day = list.Day;
                                        var month = list.Month;
                                        var Datee = new Date(list.Date);
                                        var year = Datee.getFullYear();
                                        var AppoiDate = (day + "-" + month + "-" + year)
                                        $scope.AppoiDate = AppoiDate;
                                        break;
                                    }
                                    else {
                                        $scope.a = 0;
                                        $scope.b = 5;
                                        workingDate();
                                    }
                                }

                            })
                        }
                    }
                    $scope.IsNew = 1;
                    function TimeSlotChange(AppoiDate) {
                        $scope.AppoimDate = AppoiDate;
                        TimeSlot();
                    }
                    $scope.IsNew = 1;
                    function TimeSlot() {
                        $("#appoint_waveLoader").show();
                        //$scope.AppoiDate = [];
                        $scope.AppoiFromTime = [];
                        $scope.AppoiToTime = [];
                        $scope.newAppoiTimeSlot = [];
                        var DoctorIDs = $scope.DoctorID;
                        var AppoDate = $scope.AppoimDate;
                        var res1 = convert(AppoDate);
                        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                        $http.get(baseUrl + '/api/PatientAppointments/GetDoctorAppointmentTimeSlot/?DoctorId=' + DoctorIDs + '&Date=' + res1 + '&IsNew=' + $scope.IsNew + '&Login_Session_Id=' + $scope.LoginSessionId + '&TimeZoneId=' + $scope.TimeZoneID + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data1) {
                            $("#appoint_waveLoader").hide();
                            $scope.newAppoiTimeSlot = data1.DoctorAppointmentTimeSlotList;
                            if ($scope.newAppoiTimeSlot.length == 0) {
                                $scope.DataNotAvailible = 1;
                            } else {
                                $scope.DataNotAvailible = 0;
                            }
                        }).error(function (data) { $("#appoint_waveLoader").hide(); });
                    }
                    $scope.ddltimezonechange = function () { TimeSlot(); }
                    $scope.clickNewBooking = function () {
                        $scope.IsNew = 1;
                        TimeSlot();
                    }
                    $scope.clickFollowUp = function () {
                        $scope.IsNew = 0;
                        TimeSlot();
                    }
                    $scope.a = 0;
                    $scope.b = 5;
                    function workingDate() {
                        $scope.newScheduledDatesSplit = [];
                        var a = $scope.a;
                        var b = $scope.b;
                        data = $scope.newScheduledDates;
                        var datas = data.ScheduledDaysList;
                        $scope.newScheduledDatesSplit = datas.slice(a, b);
                    }
                    $scope.DateMInus = function () {
                        if ($scope.a != 0) {
                            $scope.a = $scope.a - 1;
                            $scope.b = $scope.b - 1;
                        }
                        workingDate();
                    }
                    $scope.DatePlus = function () {
                        data = $scope.newScheduledDates.ScheduledDaysList.length;
                        if ($scope.b != data) {
                            $scope.a = $scope.a + 1;
                            $scope.b = $scope.b + 1;
                        }
                        workingDate();
                    }
                    $scope.idSelectedSchedule = null;
                    $scope.clickSchedule = function (list) {
                        $scope.AppoiDate = [];
                        $scope.idSelectedSchedule = list;
                        var day = list.Day;
                        var month = list.Month;
                        var Datee = new Date(list.Date);
                        var year = Datee.getFullYear();
                        var AppoiDate = (day + "-" + month + "-" + year)
                        $scope.AppoiDate = AppoiDate;
                        TimeSlotChange(AppoiDate);
                    }
                    $scope.idSelectedAppoi = null;
                    $scope.AppoiFromTime = [];
                    $scope.AppoiToTime = [];
                    $scope.ClickAppointment = function (list) {
                        $scope.idSelectedAppoi = list;
                        //var AppointmentFrom = list.AppointmentFromDateTime;
                        //var AppointmentTo = list.AppointmentToDateTime;
                        //var From = AppointmentFrom.split('T')[1];
                        //var To = AppointmentTo.split('T')[1];
                        //$scope.AppoiFromTime = From.slice(0, 5);
                        //$scope.AppoiToTime = To.slice(0, 5);
                        $scope.AppoiFromTime = list.AppointmentFromDateTime;
                        $scope.AppoiToTime = list.AppointmentToDateTime;

                    }
                    $scope.ClosePaymentAppointmentHistory = function () {
                        angular.element('#appointment_payment_history').modal('hide');
                    }
                    $scope.setappoint_type = function (type) {
                        $scope.AppointmoduleID1 = type;
                    }
                    $scope.BackToDoc = function () {
                        $scope.DoctorListWithTimeZone = $scope.DoctorListWithTimeZone1;
                        $scope.showMainBox = true;
                    }
                    $http.get(baseUrl + '/api/User/DocumentTypeList/').success(function (data) {
                        $scope.DocumentTypeList = data;
                    })
                    function convertdate(date) {
                        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                            day = ("0" + date.getDate()).slice(-2);
                        return [date.getFullYear(), mnth, day].join("-") + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
                    }
                    $scope.SavePatientAppointment = function () {
                        if ($scope.AppoiDate == undefined || $scope.AppoiDate == null || $scope.AppoiDate == "") {
                            //alert('Please select Appointment Date')
                            toastr.warning("Please select Appointment Date", "warning");
                        } else if ($scope.AppoiFromTime == undefined || $scope.AppoiFromTime == null || $scope.AppoiFromTime == "") {
                            //alert('Please select Appointment Time')
                            toastr.warning("Please select Appointment Time", "warning");
                        } else if ($scope.AppoiToTime == undefined || $scope.AppoiToTime == null || $scope.AppoiToTime == "") {
                            //alert('Please select Appointment Time')
                            toastr.warning("Please select Appointment Time", "warning");
                        } else if ($scope.TextArea1 == undefined || $scope.TextArea1 == null || $scope.TextArea1 == "") {                            
                            toastr.warning("Please enter the reason", "warning");
                        }/* else if ($scope.TimeZoneID == undefined || $scope.TimeZoneID == null || $scope.TimeZoneID == "") {
                    alert('Please select TimeZone')
                } */else {
                            $scope.RedirectParam = $window.location.hash.replace('#/PatientVitals/', '');
                            //$scope.RedirectParam = $scope.RedirectParam.replace('?orderId=414768633924763654', '');

                            var Appointment_Module = 1;
                            if ($scope.AppointmoduleID1 === 2) {
                                Appointment_Module = 2;
                            }
                            if ($scope.AppointmoduleID1 === 3) {
                                Appointment_Module = 3;
                            }
                            $("#appoint_waveLoader").show();


                            if ($scope.OldAppointmentID == null) {
                                var objectSave = {
                                    "Institution_Id": $scope.SelectedInstitutionId,
                                    "Doctor_Id": $scope.DoctorID,
                                    "Patient_Id": $scope.SelectedPatientId,
                                    "Appointment_Date": $scope.AppoiDate,
                                    "AppointmentFromTime": $scope.AppoiFromTime,
                                    "AppointmentToTime": $scope.AppoiToTime,
                                    "TimeZone_Id": $scope.TimeZoneID,
                                    "Appointment_Type": "1",
                                    "ReasonForVisit": document.getElementById("TextArea1").value,
                                    "Status": 1,
                                    "Created_By": $window.localStorage['UserId'],
                                    "Page_Type": 0,
                                    "Appointment_Module_Id": Appointment_Module
                                }
                                $('#shown').attr("disabled", true);
                                $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                                
                                $http.post(baseUrl + '/api/PatientAppointments/PatientAppointment_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, objectSave).success(function (data) {
                                    //alert(data.Message);
                                    if (data.ReturnFlag == 1) {
                                        toastr.success(data.Message, "success");
                                    }
                                    else if (data.ReturnFlag == 0) {
                                        toastr.info(data.Message, "info");
                                    }
                                    $('#shown').attr("disabled", false);
                                    if (data.ReturnFlag == 1) {
                                        $scope.Id = "0";
                                        var fd = new FormData();
                                        var imgBlob;
                                        var imgBlobfile;
                                        var itemIndexLogo = -1;
                                        var itemIndexdoc = -1;
                                        if ($scope.appdocfilename !== "") {
                                            console.log($scope.appdocfile)
                                            imgBlob = $scope.dataURItoBlob($scope.appdocfile);
                                            fd.append('file', imgBlob);
                                            var fddata = new FormData();

                                            fddata.append("Value", "value1");

                                            for (i = 0; i < $scope.files.length; i++) {
                                                fddata.append('files' + i, $scope.files[i]);
                                            }



                                            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                                            $http.post(baseUrl + '/api/User/Patient_OtherData_InsertUpdate/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&Appointment_Id=' + data.PatientAppointmentList[0].Id + '&Id=' + $scope.Id + '&FileName=' + '&DocumentName=""' + '&Remarks=Appointment' + '&Created_By=' + $window.localStorage['UserId'] + '&DocumentDate=' + convertdate(new Date()) + '&Is_Appointment=1&Filetype=' + $scope.filetype.toString(),
                                                fddata,
                                                {
                                                    transformRequest: angular.identity,
                                                    headers: {
                                                        'Content-Type': undefined
                                                    }
                                                }
                                            )
                                                .success(function (response) {
                                                    $("#appoint_waveLoader").hide();
                                                    $scope.files = [];
                                                    angular.element('#BookAppointmentModal').modal('hide');
                                                    document.getElementById("TextArea1").value = "";
                                                    //document.getElementById("main-box").style = "";
                                                    //document.getElementById("box").style = "display:none";
                                                    $scope.showMainBox = true;
                                                    document.getElementById("show").disabled = true;
                                                    document.getElementById("DocDetails").hidden = true;
                                                    $scope.SelectedSpeciality = "";
                                                    $scope.AppoimDate = "";
                                                    $scope.TimeZoneID = "";
                                                    $scope.DoctorID = [];
                                                    $scope.DoctorListWithTimeZone = [];
                                                    $scope.DeptIDAsSTR = [];
                                                    $scope.DoctorDetailList = [];
                                                    $scope.newScheduledDates = [];
                                                    $scope.newAppoiTimeSlot = [];
                                                    $scope.newScheduledDatesSplit = [];
                                                    //$scope.AppoiDate = [];
                                                    $scope.AppoiFromTime = [];
                                                    $scope.AppoiToTime = [];
                                                    $scope.IsNew = 1;
                                                    $scope.OldAppointmentID = null;
                                                    if ($scope.AppointmoduleID1 == 2) {
                                                        $scope.paymentappointmentId = data.PatientAppointmentList[0].Id;
                                                        //var post = $http({
                                                        //    method: "POST",
                                                        //    url: baseUrl + "/Home/CreatePayByCheckoutSession/",
                                                        //    dataType: 'json',
                                                        //    data: { appointmentId: $scope.paymentappointmentId },
                                                        //    headers: { "Content-Type": "application/json" }
                                                        //});
                                                        //post.success(function (data, status) {
                                                        //    alert("Hello: " + data.Name + " .\nCurrent Date and Time: " + data.DateTime);
                                                        //});

                                                        //post.error(function (data, status) {
                                                        //    alert(data.Message);
                                                        //});
                                                        //$http.post(baseUrl + '/Home/CreatePayByCheckoutSession?appointmentId=' + data.PatientAppointmentList[0].Id).success(function (data) {

                                                        //});
                                                        setTimeout(function () { document.getElementById('but_payby').click(); }, 100);
                                                    } else {
                                                        $scope.$broadcast("appointment_list");
                                                    }
                                                    $scope.appdocfilename = "";
                                                }).error(function (response) {
                                                    $scope.appdocfilename = "";


                                                });
                                        }
                                        else {
                                            $("#appoint_waveLoader").hide();
                                            $scope.files = [];
                                            angular.element('#BookAppointmentModal').modal('hide');
                                            //document.getElementById("main-box").style = "";
                                            //document.getElementById("box").style = "display:none";
                                            $scope.showMainBox = true;
                                            document.getElementById("show").disabled = true;
                                            document.getElementById("DocDetails").hidden = true;
                                            $scope.SelectedSpeciality = "";
                                            $scope.AppoimDate = "";
                                            $scope.TimeZoneID = "";
                                            $scope.DoctorID = [];
                                            $scope.DoctorListWithTimeZone = [];
                                            $scope.DeptIDAsSTR = [];
                                            $scope.DoctorDetailList = [];
                                            $scope.newScheduledDates = [];
                                            $scope.newAppoiTimeSlot = [];
                                            $scope.newScheduledDatesSplit = [];
                                            //$scope.AppoiDate = [];
                                            $scope.AppoiFromTime = [];
                                            $scope.AppoiToTime = [];
                                            $scope.IsNew = 1;
                                            $scope.OldAppointmentID = null;
                                            if ($scope.AppointmoduleID1 == 2) {
                                                $scope.paymentappointmentId = data.PatientAppointmentList[0].Id;
                                                //var post = $http({
                                                //    method: "POST",
                                                //    url: baseUrl + "/Home/CreatePayByCheckoutSession/",
                                                //    dataType: 'json',
                                                //    data: { appointmentId: $scope.paymentappointmentId },
                                                //    headers: { "Content-Type": "application/json" }
                                                //});
                                                //post.success(function (data, status) {
                                                //    alert("Hello: " + data.Name + " .\nCurrent Date and Time: " + data.DateTime);
                                                //});

                                                //post.error(function (data, status) {
                                                //    alert(data.Message);
                                                //});
                                                //$http.post(baseUrl + '/Home/CreatePayByCheckoutSession?appointmentId=' + data.PatientAppointmentList[0].Id).success(function (data) {

                                                //});
                                                setTimeout(function () { document.getElementById('but_payby').click(); }, 100);
                                            } else {
                                                $scope.$broadcast("appointment_list");
                                            }
                                            $scope.appdocfilename = "";
                                        }
                                    }

                                }).error(function (data) { $("#appoint_waveLoader").hide(); });;
                            } else {
                                var objectReshedule = {
                                    "Id": $scope.OldAppointmentID,
                                    "CancelledBy_Id": $window.localStorage['UserId'],
                                    "Cancelled_Remarks": "Reschedule",
                                    "ReasonTypeId": 76,
                                    "Institution_Id": $scope.SelectedInstitutionId,
                                    "Doctor_Id": $scope.DoctorID,
                                    "Patient_Id": $scope.SelectedPatientId,
                                    "Appointment_Date": $scope.AppoiDate,
                                    "AppointmentFromTime": $scope.AppoiFromTime,
                                    "AppointmentToTime": $scope.AppoiToTime,
                                    "Appointment_Type": "1",
                                    "ReasonForVisit": "Test",
                                    "Status": "1",
                                    "Created_By": $window.localStorage['UserId'],
                                    "Page_Type": "0",
                                    "TimeZone_Id": $scope.TimeZoneID,
                                    "Appointment_Module_Id": Appointment_Module
                                }
                                $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                                $http.post(baseUrl + '/api/PatientAppointments/AppointmentReSchedule_InsertUpdate?Login_Session_Id=' + $scope.LoginSessionId, objectReshedule).success(function (data) {
                                    //alert(data.Message);
                                    if (data.ReturnFlag == 1) {
                                        toastr.success(data.Message, "success");
                                    }
                                    else if (data.ReturnFlag == 0) {
                                        toastr.info(data.Message, "info");
                                    }
                                    if (data.ReturnFlag == 1) {
                                        $scope.Id = "0";
                                        var fd = new FormData();
                                        var imgBlob;
                                        var imgBlobfile;
                                        var itemIndexLogo = -1;
                                        var itemIndexdoc = -1;
                                        $scope.paymentappointmentId = data.PatientAppointmentList[0].NewAppointmentId;
                                        if ($scope.appdocfilename !== "") {
                                            console.log($scope.appdocfile)
                                            imgBlob = $scope.dataURItoBlob($scope.appdocfile);
                                            fd.append('file', imgBlob);
                                            var fddata = new FormData();

                                            fddata.append("Value", "value1");

                                            for (i = 0; i < $scope.files.length; i++) {
                                                fddata.append('files' + i, $scope.files[i]);
                                            }

                                            //var url = baseUrl + '/api/User/Patient_OtherData_InsertUpdate/?Patient_Id=' + $scope.SelectedPatientId + '&Id=' + $scope.Id + '&FileName=' + $scope.appdocfilename + '&DocumentName=' + $scope.appdocfilename + '&Remarks="Appointment"' + '&Created_By=' + $window.localStorage['UserId'] + '&Is_Appointment=1';

                                            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                                            $http.post(baseUrl + '/api/User/Patient_OtherData_InsertUpdate/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&Appointment_Id=' + data.PatientAppointmentList[0].Id + '&Id=' + $scope.Id + '&FileName=' + '&DocumentName=""' + '&Remarks=Appointment' + '&Created_By=' + $window.localStorage['UserId'] + '&DocumentDate=' + convertdate(new Date()) + '&Is_Appointment=1&Filetype=' + $scope.filetype.toString(),
                                                fddata,
                                                {
                                                    transformRequest: angular.identity,
                                                    headers: {
                                                        'Content-Type': undefined
                                                    }
                                                }
                                            )
                                                .success(function (response) {
                                                    $scope.appdocfilename = "";
                                                    $scope.files = [];
                                                }).error(function (response) {
                                                    $scope.appdocfilename = "";


                                                });
                                        }
                                        $("#appoint_waveLoader").hide();
                                        angular.element('#BookAppointmentModal').modal('hide');
                                        //document.getElementById("main-box").style = "";
                                        //document.getElementById("box").style = "display:none";
                                        $scope.showMainBox = true;
                                        document.getElementById("show").disabled = true;
                                        document.getElementById("DocDetails").hidden = true;
                                        $scope.SelectedSpeciality = "";
                                        $scope.AppoimDate = "";
                                        $scope.TimeZoneID = "";
                                        $scope.DoctorID = [];
                                        $scope.DoctorListWithTimeZone = [];
                                        $scope.DeptIDAsSTR = [];
                                        $scope.DoctorDetailList = [];
                                        $scope.newScheduledDates = [];
                                        $scope.newAppoiTimeSlot = [];
                                        $scope.newScheduledDatesSplit = [];
                                        //$scope.AppoiDate = [];
                                        $scope.AppoiFromTime = [];
                                        $scope.AppoiToTime = [];
                                        $scope.IsNew = 1;
                                        var objectCancel = {
                                            "Id": $scope.OldAppointmentID,
                                            "CancelledBy_Id": $window.localStorage['UserId'],
                                            "Cancel_Remarks": "Test",
                                            "ReasonTypeId": "1",
                                            "SESSION_ID": $scope.LoginSessionId
                                        }
                                        $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, objectCancel).success(function (data) {
                                            //alert(data.Message);
                                            if (data.ReturnFlag == 1) {
                                                toastr.success(data.Message, "success");
                                            }
                                            else if (data.ReturnFlag == 0) {
                                                toastr.info(data.Message, "info");
                                            }
                                            if (data.AppointmentDetails.PaymentStatusId == 3) {
                                                $scope.refundAppointmentId = data.AppointmentDetails.Id;
                                                $scope.refundMerchantOrderNo = data.AppointmentDetails.MerchantOrderNo;
                                                $scope.refundAmount = data.AppointmentDetails.Amount;
                                                $scope.refundOrderNo = data.AppointmentDetails.OrderNo;
                                                $scope.refundInstitutionId = data.AppointmentDetails.Institution_Id;

                                                //setTimeout(function () { document.getElementById('but_paybyrefund').click(); }, 100);

                                                var obj = {
                                                    refundAppointmentId: data.AppointmentDetails.Id,
                                                    refundMerchantOrderNo: data.AppointmentDetails.MerchantOrderNo,
                                                    refundAmount: data.AppointmentDetails.Amount,
                                                    refundOrderNo: data.AppointmentDetails.OrderNo,
                                                    refundInstitutionId: data.AppointmentDetails.Institution_Id
                                                };

                                                $http.post(baseUrl + '/api/PayBy/RefundPayByCheckoutSession/', obj).success(function (data) {
                                                    console.log(data);
                                                    $scope.$broadcast("appointment_list");
                                                }).error(function (data) { console.log(data); });

                                            }
                                            //if (data.ReturnFlag == 1) {
                                            //    $scope.$broadcast("appointment_list");
                                            //}
                                            if ($scope.AppointmoduleID1 == 2) {
                                                $scope.OldAppointmentID = null;
                                                setTimeout(function () { document.getElementById('but_payby').click(); }, 100);
                                            } else {
                                                $scope.$broadcast("appointment_list");
                                            }
                                        });
                                    }

                                }).error(function (data) { $("#appoint_waveLoader").hide(); });;
                            }




                        }
                    }
                    $scope.CancelMyAppointment = function () {
                        angular.element('#BookAppointmentModal').modal('hide');
                        //document.getElementById("main-box").style = "";
                        //document.getElementById("box").style = "display:none";
                        $scope.showMainBox = true;
                        document.getElementById("show").disabled = true;
                        document.getElementById("DocDetails").hidden = true;
                        $scope.SelectedSpeciality = "";
                        $scope.AppoimDate = "";
                        $scope.TimeZoneID = "";
                        $scope.DoctorID = [];
                        $scope.DoctorListWithTimeZone = [];
                        $scope.DeptIDAsSTR = [];
                        $scope.DoctorDetailList = [];
                        $scope.newScheduledDates = [];
                        $scope.newAppoiTimeSlot = [];
                        $scope.newScheduledDatesSplit = [];
                        $scope.AppoiDate = [];
                        $scope.AppoiFromTime = [];
                        $scope.AppoiToTime = [];
                        $scope.IsNew = 1;
                    }
                    $scope.OldAppointmentID = null;
                    $scope.RescheduleDocAppointment = function (Row) {
                        $scope.OldAppointmentID = Row.Id;
                        angular.element('#BookAppointmentModal').modal('show');
                    }
                    $scope.CancelDocAppointment = function (Row) {
                        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                        $("#chatLoaderPV").show();
                        //console.log(Row);
                        var objectCancel = {
                            "Id": Row.Id,
                            "CancelledBy_Id": $window.localStorage['UserId'],
                            "Cancel_Remarks": "Test",
                            "ReasonTypeId": "1",
                            "SESSION_ID": $scope.LoginSessionId
                        }
                        Swal.fire({
                            title: 'Confirm to cancel appointment',
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
                                $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, objectCancel).success(function (data) {
                                    //alert(data.Message);
                                    if (data.ReturnFlag == 1) {
                                        toastr.success(data.Message, "success");
                                    }
                                    else if (data.ReturnFlag == 0) {
                                        toastr.info(data.Message, "info");
                                    }
                                    if (data.AppointmentDetails.PaymentStatusId == 3) {
                                        $scope.refundAppointmentId = data.AppointmentDetails.Id;
                                        $scope.refundMerchantOrderNo = data.AppointmentDetails.MerchantOrderNo;
                                        $scope.refundAmount = data.AppointmentDetails.Amount;
                                        $scope.refundOrderNo = data.AppointmentDetails.OrderNo;
                                        $scope.refundInstitutionId = data.AppointmentDetails.Institution_Id;

                                        //setTimeout(function () { document.getElementById('but_paybyrefund').click(); }, 100);

                                        var obj = {
                                            refundAppointmentId: data.AppointmentDetails.Id,
                                            refundMerchantOrderNo: data.AppointmentDetails.MerchantOrderNo,
                                            refundAmount: data.AppointmentDetails.Amount,
                                            refundOrderNo: data.AppointmentDetails.OrderNo,
                                            refundInstitutionId: data.AppointmentDetails.Institution_Id
                                        };

                                        $http.post(baseUrl + '/api/PayBy/RefundPayByCheckoutSession/', obj).success(function (data) {
                                            console.log(data);
                                            $scope.$broadcast("appointment_list");
                                        }).error(function (data) { console.log(data); });

                                    }
                                    if (data.ReturnFlag == 1) {
                                        $scope.$broadcast("appointment_list");
                                    }
                                });
                            } else if (result.isDenied) {
                                //Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                        /*if (confirm("Confirm to cancel appointment")) {
                            $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, objectCancel).success(function (data) {
                                //alert(data.Message);
                                if (data.ReturnFlag == 1) {
                                    toastr.success(data.Message, "success");
                                }
                                else if (data.ReturnFlag == 0) {
                                    toastr.info(data.Message, "info");
                                }
                                if (data.AppointmentDetails.PaymentStatusId == 3) {
                                    $scope.refundAppointmentId = data.AppointmentDetails.Id;
                                    $scope.refundMerchantOrderNo = data.AppointmentDetails.MerchantOrderNo;
                                    $scope.refundAmount = data.AppointmentDetails.Amount;
                                    $scope.refundOrderNo = data.AppointmentDetails.OrderNo;
                                    $scope.refundInstitutionId = data.AppointmentDetails.Institution_Id;

                                    //setTimeout(function () { document.getElementById('but_paybyrefund').click(); }, 100);

                                    var obj = {
                                        refundAppointmentId: data.AppointmentDetails.Id,
                                        refundMerchantOrderNo: data.AppointmentDetails.MerchantOrderNo,
                                        refundAmount: data.AppointmentDetails.Amount,
                                        refundOrderNo: data.AppointmentDetails.OrderNo,
                                        refundInstitutionId: data.AppointmentDetails.Institution_Id
                                    };

                                    $http.post(baseUrl + '/api/PayBy/RefundPayByCheckoutSession/', obj).success(function (data) {
                                        console.log(data);
                                        $scope.$broadcast("appointment_list");
                                    }).error(function (data) { console.log(data); });

                                }
                                if (data.ReturnFlag == 1) {
                                    $scope.$broadcast("appointment_list");
                                }
                            });
                        }*/
                        $("#chatLoaderPV").hide();
                    }
                    $scope.ConfirmAppointment = function (Row) {
                        Swal.fire({
                            title: 'Confirm to appointment',
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
                                $("#chatLoaderPV").show();
                                var obj = {
                                    "Id": Row.Id,
                                    "SESSION_ID": $window.localStorage['Login_Session_Id'],
                                    "Institution_Id": $window.localStorage['InstitutionId'],
                                    "user_id": $window.localStorage['UserId']
                                }
                                $http.post(baseUrl + '/api/User/CG_Confirm_PatientAppointments/', obj).success(function (data) {
                                    $("#chatLoaderPV").hide();
                                    if (data.ReturnFlag == 1) {
                                        CG_PatientAppointment_List();
                                        //alert(data.Message);
                                        toastr.success(data.Message, "success");
                                    } else {
                                        //alert(data.Message);
                                        toastr.info(data.Message, "info");
                                    }
                                });
                            } else if (result.isDenied) {
                                //Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                        /* if (confirm("Confirm to appointment")) {
                             $("#chatLoaderPV").show();
                             var obj = {
                                 "Id": Row.Id,
                                 "SESSION_ID": $window.localStorage['Login_Session_Id'],
                                 "Institution_Id": $window.localStorage['InstitutionId'],
                                 "user_id": $window.localStorage['UserId']
                             }
                             $http.post(baseUrl + '/api/User/CG_Confirm_PatientAppointments/', obj).success(function (data) {
                                 $("#chatLoaderPV").hide();
                                 if (data.ReturnFlag == 1) {
                                     CG_PatientAppointment_List();
                                     alert(data.Message);
                                 } else {
                                     alert(data.Message);
                                 }
                             });
                         }*/
                    }
                    $scope.AppointmentPayment = function (Row) {
                        $scope.RedirectParam = $window.location.hash.replace('#/PatientVitals/', '');
                        $scope.paymentappointmentId = Row.Id;
                        $scope.paymentdepartmentId = Row.DoctorDepartmentId;
                        $scope.paymentInstitutionId = Row.Institution_Id;
                        setTimeout(function () { document.getElementById('but_payby').click(); }, 100);
                    }
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        }



        $scope.myMeetingURL = '';
        $scope.myMeeting = function (meetingdomain) {
            var key = "";

            var obj =
            {
                name: "conference38",
                username: "appsAdmin",
                key: "ab3049da9a0cd8d6e8b7c62586752472"
            }

            $http.post('https://mymeeting.mycortex.ca/apps/apiservice/api/getconferencedetails', obj).success(function (data) {
                if (data == "Conference not available") {
                    var objAdd =
                    {
                        "action": "Add",
                        "username": "appsAdmin",
                        "key": "ab3049da9a0cd8d6e8b7c62586752472",
                        "name": "conference38",
                        "audio": "on",
                        "video": "off",
                        "chat": "off",
                    }
                    $http.post('https://mymeeting.mycortex.ca/apps/apiservice/api/videoConfSettings', objAdd).success(function (data) {
                        if (data.status == "Added") {
                            var objAdd =
                            {
                                "action": "changeConferenceMode",
                                "username": "appsAdmin",
                                "key": "ab3049da9a0cd8d6e8b7c62586752472",
                                "name": "conference38",
                                "conferenceMode": "on"
                            }
                            $http.post('https://mymeeting.mycortex.ca/apps/apiservice/api/videoConfSettings', objAdd).success(function (data) {
                                if (data.status != "") {
                                    key = data.hashKey;
                                    if (meetingdomain == 1) {
                                        url = 'https://mymeeting.mycortex.ca/meeting/?key=' + key;
                                    } else if (meetingdomain == 2) {
                                        url = 'https://mycortex.livebox.co.in/meeting/?key=' + key;
                                    }
                                    $scope.myMeetingURL = $sce.trustAsResourceUrl(url);
                                    angular.element('#ViewMyMeetingModal').modal('show');
                                    //window.open(url);
                                }
                            });
                        }
                    });
                }
                else {
                    key = data.Hashkey;
                    if (meetingdomain == 1) {
                        url = 'https://mymeeting.mycortex.ca/meeting/?key=' + key;
                    } else if (meetingdomain == 2) {
                        url = 'https://mycortex.livebox.co.in/meeting/?key=' + key;
                    }
                    $scope.myMeetingURL = $sce.trustAsResourceUrl(url);
                    angular.element('#ViewMyMeetingModal').modal('show');
                    // window.open(url);
                }

            }).error(function (data) {
                $scope.error = "Error: " + data;
            });
        }

        $scope.CancelMyMeeting = function () {
            $scope.myMeetingURL = '';
            angular.element('#ViewMyMeetingModal').modal('hide');
        }

        $scope.HelathDataList = [];

        $scope.DayDetailsList = function (TabClicked) {
            $scope.Type_Id = 1;
            $scope.ActivitiesDaysClick(TabClicked, 1);

        }
        $scope.WeeKDetailsList = function (TabClicked) {
            $scope.Type_Id = 2;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }
        $scope.OneWeekDetailsList = function (TabClicked) {
            $scope.Type_Id = 3;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }

        $scope.ThreeMonthDetailsList = function (TabClicked) {
            $scope.Type_Id = 4;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }
        $scope.OneYearKDetailsList = function (TabClicked) {
            $scope.Type_Id = 5;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }

        $scope.FromYearDetailsList = function (TabClicked) {
            $scope.Type_Id = 6;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }
        $scope.AllDetailsList = function (TabClicked, ChartORData) {
            $scope.Type_Id = 7;
            $scope.ActivitiesDaysClick(TabClicked, ChartORData);
        }
        $scope.ActivitiesDaysClick = function (TabClicked, ChartORData) {
            if (TabClicked == "1") {
                $scope.LSType_Id = $scope.Type_Id;
                $scope.ParamGroup_Id = 1;
            }
            else if (TabClicked == "2") {
                $scope.VitalsType_Id = $scope.Type_Id;
                $scope.ParamGroup_Id = 2;
            }
            else if (TabClicked == "3") {
                $scope.VitalsType_Id = $scope.Type_Id;
                $scope.ParamGroup_Id = 3;
            }
            $scope.GeneralFunction($scope.ParamGroup_Id, ChartORData);
        }


        $scope.setPage = function (PageNo) {
            if (PageNo > $scope.patientvitals_pages) {
                return false;
            } else if (PageNo == 0) {
                return false;
            }
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else {
                $scope.inputPageNo = PageNo;
            }

            $scope.current_page = PageNo;
            $scope.GeneralFunction($scope.ParamGroup_Id, 2);
        }
        $scope.GeneralFunction = function (ParamGroup_Id, ChartORData) {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/GETPATIENTINSTITUTION/?ID=' + $scope.SelectedPatientId).success(function (data) {
                $("#chatLoaderPV").hide();
                var PatientInstituteId = data[0].Institution_Id;
                $scope.ParameterList = [];
                $scope.PatientHealthDataChartList = [];
                $scope.ParamGroup_Id = ParamGroup_Id;
                $("#chatLoaderPV").show();
                $scope.getParameterList();
                if (PatientInstituteId == $window.localStorage['InstitutionId']) {
                    $scope.ConfigCode = "PATIENTPAGE_COUNT";
                    $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                    $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                        $scope.page_size = data1[0].ConfigValue;
                        $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                        $scope.PageEnd = $scope.current_page * $scope.page_size;
                        $scope.Active = 1;       // default active
                        if ($scope.VitalsIsActive == true) {
                            $scope.Active = 1  //active
                        }
                        else if ($scope.VitalsIsActive == false) {
                            $scope.Active = -1 //all
                        }

                        if (ChartORData == 1) {
                            $scope.PageStart = 0;
                            $scope.PageEnd = 0;
                        }
                        $http.get(baseUrl + '/api/User/PatientHealthDataDetails_List/?Patient_Id=' + $scope.SelectedPatientId + '&OptionType_Id=' + $scope.Type_Id + '&Group_Id=' + $scope.ParamGroup_Id + '&Login_Session_Id=' + $scope.LoginSessionId + '&UnitsGroupType=' + $scope.unitgrouptype + '&StartRowNumber=' + $scope.PageStart +
                            '&EndRowNumber=' + $scope.PageEnd + '&Active=' + $scope.Active).success(function (data) {
                                $("#chatLoaderPV").hide();
                                $scope.SearchMsg = "No Data Available";
                                // only active items for Chart
                                if (ChartORData == 1) {
                                    $scope.PatientHealthDataChartList = $ff(data.PatientHealthDataList, { IsActive: 1 }, true);
                                    $scope.Parameter_List = [];
                                    $scope.ParameterChild_List = [];

                                    if ($scope.GroupParameterNameList.length != '0') {
                                        angular.forEach($ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true), function (valueparam, indexparam) {
                                            if (valueparam.ParameterParent_Id == "0") {
                                                var currentParam = {
                                                    Id: valueparam.ParameterId,
                                                    Name: 'Chart' + valueparam.ParameterId,
                                                    hadChild: valueparam.ParameterHas_Child,
                                                    ParamName: valueparam.ParameterName,
                                                    GroupId: valueparam.Group_Id
                                                };
                                                $scope.Parameter_List.push(currentParam);
                                            }
                                            else {
                                                var currentParamChild = {
                                                    Id: valueparam.ParameterId,
                                                    Parent_Id: valueparam.ParameterParent_Id,
                                                    Name: 'Chart' + valueparam.ParameterId,
                                                    GroupId: valueparam.Group_Id,
                                                    ParamName: valueparam.ParameterName,
                                                };
                                                $scope.ParameterChild_List.push(currentParamChild);
                                            }


                                        });
                                    } else if ($scope.Tick == false) {
                                        //5356
                                        $scope.getParameterList();
                                        $scope.GeneralFunction(ParamGroup_Id, ChartORData);
                                    }
                                    if ($scope.Tick == true) {
                                        $scope.PatientHealthRecordDetailsList($ff($scope.Parameter_List, { GroupId: ParamGroup_Id }, true), $scope.PatientHealthDataChartList, $scope.ParameterChild_List);
                                    }
                                }
                                // all active&inactive items for tableview/detail view
                                else if (ChartORData == 2) {
                                    //$scope.PatientHealthDataChartList = data.PatientHealthDataList;

                                    $scope.PatientHealthDataChartList = data.PatientHealthDataList;
                                    //$scope.vitalsFilterAllItem();
                                    $scope.emptydataVitalLab = [];
                                    $scope.emptydataVitalLab = $scope.PatientHealthDataChartList;
                                    $scope.PatientHealthCount = $scope.emptydataVitalLab[0].TotalRecord;
                                    if ($scope.VitalsIsActive == true) {
                                        $scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($filter('orderBy')(angular.copy($ff($scope.emptydataVitalLab, { IsActive: 1 }, true)), 'Id', true)));
                                        $scope.PatientHealthActiveCount = $scope.PatientHealthDataTableList;

                                        if ($scope.PatientHealthActiveCount.length > 0) {
                                            $scope.flag = 1;
                                        }
                                        else {
                                            $scope.flag = 0;
                                        }
                                    } else {
                                        $scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($scope.filterExcludeBMI($filter('orderBy')(angular.copy($scope.emptydataVitalLab), 'Id', true))));
                                        $scope.PatientHealthActiveCount = $scope.PatientHealthDataTableList;

                                        if ($scope.PatientHealthActiveCount.length > 0) {
                                            $scope.flag = 1;
                                        }
                                        else {
                                            $scope.flag = 0;
                                        }
                                    }
                                    $scope.patientvitals_pages = Math.ceil(($scope.PatientHealthCount) / ($scope.page_size));
                                }
                            })
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "AN error has occured while Listing the records!" + data;
                    })
                } else {
                    window.location.href = baseUrl + "/Home/LoginIndex";
                }
            });
        };
        $scope.VitalsIsActive = true;
        $scope.vitalsFilterAllItem = function () {
            $("#chatLoaderPV").show();
            if ($scope.VitalsIsActive == true) {
                $scope.Active = 1
                $scope.GeneralFunction($scope.ParamGroup_Id, 2);
                // if active   - filter only active        
                //$scope.PatientHealthDataTableList = $filter('orderBy')(angular.copy($ff($scope.PatientHealthDataChartList, {IsActive :1}, true)), 'Id', true);
                //$scope.emptydataVitalLab = [];
                //$scope.emptydataVitalLab = $scope.PatientHealthDataChartList;
                //$scope.PatientHealthCount = $scope.emptydataVitalLab[0].TotalRecord;
                //$scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($filter('orderBy')(angular.copy($ff($scope.emptydataVitalLab, { IsActive: 1 }, true)), 'Id', true)));
                ////$scope.patientvitals_pages = Math.ceil(($scope.PatientHealthDataTableList) / ($scope.page_size));
                //$scope.PatientHealthActiveCount = $scope.PatientHealthDataTableList;

                //if ($scope.PatientHealthActiveCount.length > 0) {
                //    $scope.flag = 1;
                //}
                //else {
                //    $scope.flag = 0;
                //}
                //$scope.patientvitals_pages = Math.ceil(($scope.PatientHealthCount) / ($scope.page_size));

            }
            else {
                // if inactive - filter all
                $scope.Active = -1 //all  
                //$scope.GeneralFunction($scope.ParamGroup_Id, 2);
                $scope.GeneralFunction($scope.ParamGroup_Id, 2);
                //$scope.emptydataVitalLab = [];
                //$scope.emptydataVitalLab = $scope.PatientHealthDataChartList;
                //$scope.PatientHealthCount = $scope.emptydataVitalLab[0].TotalRecord;
                //$scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($scope.filterExcludeBMI($filter('orderBy')(angular.copy($scope.emptydataVitalLab), 'Id', true))));
                //$scope.PatientHealthActiveCount = $scope.PatientHealthDataTableList;

                //if ($scope.PatientHealthActiveCount.length > 0) {
                //    $scope.flag = 1;
                //}
                //else {
                //    $scope.flag = 0;
                //}
                //$scope.patientvitals_pages = Math.ceil(($scope.PatientHealthCount) / ($scope.page_size));
            }
            // to refresh sorting
            //setTimeout(function () {
            //    $scope.$apply(function () {
            //        $scope.PatientHealthDataTableList = angular.copy($scope.PatientHealthDataTableList);
            //    });
            //}, 100);
            angular.forEach($scope.PatientHealthDataTableList, function (value2, index2) {
                $scope.EditVitalRow_EditFlag[index2] = 1;
            });
            $("#chatLoaderPV").hide();
        }
        $scope.filterExcludeBMI = function (rowSet) {
            $scope.localfilterSet = [];
            angular.forEach(rowSet, function (row, rowIndex) {
                if (row.ParameterId != "13")
                    $scope.localfilterSet.push(row);
            });
            return $scope.localfilterSet;
        }


        /* Filter the master list function.*/
        $scope.filterParameterList = function () {
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.PatientHealthDataTableList = [];
                $scope.vitalsFilterAllItem();
            }
            else {
                $scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($filter('orderBy')($ff($scope.PatientHealthDataTableList, function (value) {
                    return angular.lowercase(value.ParameterName).match(searchstring) ||
                        angular.lowercase(value.UOM_Name).match(searchstring) ||
                        angular.lowercase(value.ParameterValue.toString()).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Activity_DateTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.Createdby_FullName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                }), 'Id', true)));
                // to refresh sorting
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.PatientHealthDataTableList = angular.copy($scope.PatientHealthDataTableList);
                        if ($scope.PatientHealthDataTableList.length > 0) {
                            $scope.flag = 1;
                        } else {
                            $scope.flag = 0;
                        }
                        $scope.patientvitals_pages = Math.ceil(($scope.PatientHealthDataTableList.length) / ($scope.page_size));
                    });
                }, 100);
            }

        }

        // are Tabs clicked once    -- 0 not clicked , 1 - clicked
        $scope.LifestyleTab_Clicked = "0";
        $scope.VitalTab_Clicked = "0";
        $scope.LabTab_Clicked = "0";
        $scope.TabClickDataLoad = function (TabClicked) {
            var callFunction = true;
            $scope.current_page = 1;
            $scope.inputPageNo = 1;
            $('.chartTabs').removeClass('charTabsNone');
            $scope.ParamGroup_Id = 0;
            if (TabClicked == "1" && $scope.LifestyleTab_Clicked == "0") {
                callFunction = false
                $scope.LSType_Id = 2;
                $scope.Type_Id = 2;
                $scope.ParamGroup_Id = 1;
            }
            else if (TabClicked == "2" && $scope.VitalTab_Clicked == "0") {
                callFunction = false;
                $scope.VitalsType_Id = 2;
                $scope.Type_Id = 2;
                $scope.ParamGroup_Id = 2;
                //$scope.getParameterList();
                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
                //console.log($scope.VitalsParameterList_Data);
            }
            else if (TabClicked == "2" && $scope.VitalTab_Clicked == "1") {
                callFunction = false;
                $scope.ParamGroup_Id = 2;
                //$scope.getParameterList();
                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
                //console.log($scope.VitalsParameterList_Data);
            }
            else if (TabClicked == "3" && $scope.LabTab_Clicked == "0") {
                callFunction = false;
                $scope.VitalsType_Id = 2;
                $scope.Type_Id = 2;
                $scope.ParamGroup_Id = 3;
                //$scope.getParameterList();

                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
            }
            else if (TabClicked == "3" && $scope.LabTab_Clicked == "1") {
                callFunction = false;
                $scope.ParamGroup_Id = 3;
                //$scope.getParameterList();

                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
            }

            if (callFunction == true) {
                if (TabClicked == "1") {
                    $scope.Type_Id = $scope.LSType_Id;
                }
                else if (TabClicked == "2") {
                    $scope.Type_Id = $scope.VitalsType_Id;
                }
                else if (TabClicked == "3") {
                    $scope.Type_Id = $scope.VitalsType_Id;
                }
            }
            if (callFunction == false) {
                $scope.GeneralFunction($scope.ParamGroup_Id, 1);
                if (TabClicked == "1") {
                    $scope.LifestyleTab_Clicked = "1";
                }
                else if (TabClicked == "2") {
                    $scope.VitalTab_Clicked = "1";
                }
                else if (TabClicked == "3") {
                    $scope.LabTab_Clicked = "1";
                }
            }
        }

        // $scope.getParameterList();
        setTimeout(function () {
        }, 1000);
        setTimeout(function () {
            $scope.$apply(function () {
                // default tab is LifeStyle, and load data for Lifestyle
                $scope.TabClickDataLoad("1");
            });
        }, 1000);

        $scope.PatientHealthRecordDetailsList = function (ParameterList, PatientHealthDataChartList, ParameterChild_List) {
            $scope.XAxisHealthDataSummary = [];
            $scope.HelathDataChartSummary = [];
            $scope.yName = [];
            $scope.SChartTitle = [];
            $scope.ParameterList = [];
            $scope.PatientHealthDataChartList = [];
            $scope.ParameterList = ParameterList;
            $scope.PatientHealthDataChartList = PatientHealthDataChartList;
            $scope.ParameterChild_List = ParameterChild_List;
            $scope.parameterItemsList = [];
            var chartxvalue;
            chartxvalue = 'Days';
            angular.forEach($scope.ParameterList, function (value2, index2) {
                $scope.HelathDataChartSummary = [];
                $scope.HelathDataChartSummaryCollection = [];
                $scope.XAxisHealthDataSummary = [];
                $scope.HelathDataChartSummaryArray = [];
                $scope.HelathDataChartSummaryArrayCollection = [];
                $scope.yName = [];
                $scope.SChartTitle = [];
                $scope.parameterItemsList = [];
                if (value2.hadChild == 1) {
                    $scope.parameterItemsList = $ff($scope.ParameterChild_List, { Parent_Id: value2.Id }, true);
                }
                else {
                    var paramItem = {
                        Id: value2.Id,
                        Parent_Id: 0,
                        Name: value2.Name,
                    };
                    $scope.parameterItemsList.push(paramItem)
                }
                $scope.HelathDataChartSummary = [];
                $scope.HelathDataChartSummaryArray = [];
                $scope.HelathDataChartSummaryCollection = [];
                $scope.XAxisHealthDataSummary = [];
                $scope.XAxisHealthDataSummaryCollection = [];

                $scope.HelathDataChartSummaryArrayCollection = [];
                var minval = 0;
                var maxval = 0;
                var normalRangeTitle = "";
                angular.forEach($scope.parameterItemsList, function (value4, index4) {
                    $scope.HelathDataChartSummary = [];
                    //$scope.XAxisHealthDataSummary = [];
                    angular.forEach($ff($scope.PatientHealthDataChartList, { ParameterId: value4.Id }, true), function (value1, index1) {

                        $scope.HelathDataChartSummary.push(
                            {
                                "name": value4.XAxis,
                                "y": value1.ParameterValue,
                                "ActivityDate": $filter('date')(value1.Activity_DateTime, "dd-MMM-yyyy hh:mm:ss a"),
                                "UOM": value1.UOM_Name,
                                "DeviceType": value1.DeviceType,
                                "DeviceNo": value1.DeviceNo,
                                "TypeName": value1.TypeName,
                                "Createdby_ShortName": value1.Createdby_ShortName,
                            }
                        )
                        $scope.XAxisHealthDataSummary.push(value1.XAxis);

                        if ((value1.ParameterValue < minval && value1.ParameterValue != 0) || minval == 0) {
                            minval = value1.ParameterValue;
                        }
                        if (value1.ParameterValue > maxval && value1.ParameterValue != 0) {
                            maxval = value1.ParameterValue;
                        }
                    })

                    if ($scope.parameterItemsList.length > 1) {
                        $scope.HelathDataChartSummaryCollection.push({
                            name: value4.ParamName,//$ff($scope.GroupParameterNameList, { ParameterId: value4.Id }, true)[0].ParameterName,
                            data: $scope.HelathDataChartSummary,
                        });
                        //lineWidth: 5,
                    }
                    else {
                        $scope.HelathDataChartSummaryCollection = [{
                            name: value2.ParamName,//$ff($scope.GroupParameterNameList, { ParameterId: value4.Id }, true)[0].ParameterName,
                            data: $scope.HelathDataChartSummary
                        }];
                        //lineWidth: 5,
                    }

                })
                // 
                var normalRangeBandMin = 0;
                var normalRangeBandMax = 0;
                $scope.Max_Possible = "";
                $scope.Min_Possible = "";
                $scope.yName = "";
                $scope.SChartTitle = "";
                var bandcolor = "rgba(68, 170, 213, 0.1)";
                var objfil = $ff($scope.GroupParameterNameList, { ParameterId: value2.Id }, true)
                if (objfil.length > 0) {
                    if (objfil[0].ParameterHas_Child == "1") {
                        var currentItem = 0;
                        angular.forEach($ff($scope.GroupParameterNameList, { ParameterParent_Id: value2.Id }, true), function (valchild, indexchild) {
                            if (currentItem != 0 && currentItem < valchild.Average) {
                                normalRangeBandMin = currentItem;
                                normalRangeBandMax = valchild.Average;
                            }
                            else if (currentItem != 0 && currentItem > valchild.Average) {
                                normalRangeBandMin = valchild.Average;
                                normalRangeBandMax = currentItem;
                            }
                            currentItem = valchild.Average;
                        });
                        normalRangeTitle = normalRangeBandMin + "-" + normalRangeBandMax;

                    }
                    else {
                        normalRangeBandMin = objfil[0].Average;
                        normalRangeBandMax = objfil[0].Average;
                        bandcolor = "#292a4d";
                        normalRangeTitle = normalRangeBandMin;
                    }
                }
                if (objfil.length > 0) {
                    $scope.yName = objfil[0].UOM_Name;
                    $scope.SChartTitle = objfil[0].ParameterName;

                    $scope.Max_Possible = objfil[0].Max_Possible;
                    $scope.Min_Possible = objfil[0].Min_Possible;
                }
                if ($scope.Max_Possible == 0) $scope.Max_Possible = maxval;
                if ($scope.Max_Possible == 0) $scope.Min_Possible = minval;

                var tickInterval = 1;
                if ($scope.Max_Possible < tickInterval)
                    tickInterval = $scope.Max_Possible;
                Highcharts.chart(value2.Name, {
                    chart:
                    {
                        zoomType: 'x'
                    },
                    title: {
                        text: $scope.SChartTitle
                    },
                    subtitle: {
                        text: 'Normal Value : ' + normalRangeTitle,
                        align: 'right'
                    },
                    credits: {
                        enabled: false
                    },
                    yAxis: {
                        allowDecimals: false,
                        tickInterval: tickInterval,
                        //startOnTick: true,
                        max: $scope.Max_Possible,
                        min: $scope.Min_Possible,
                        title: {
                            text: $scope.yName
                        },
                        labels: {
                            formatter: function () {
                                return '' + this.value;
                            }
                        },
                        plotBands: [{
                            color: bandcolor, // Color value
                            thickness: '50%',
                            from: normalRangeBandMin, // Start of the plot band
                            to: normalRangeBandMax// End of the plot band
                        }]
                    },
                    xAxis: {
                        type: 'datetime',
                        categories: $scope.XAxisHealthDataSummary,
                    },
                    tooltip: {
                        split: false,
                        //useHtml: true,
                        shared: false,
                        //pointFormat: '<b>{point.ActivityDate}</b> <b>{point.y} {point.UOM}</b>' 

                        formatter: function () {
                            return '<b>' + this.point.ActivityDate + '</b><br/>' +
                                '<b>' + this.point.y + '</b> ' + this.point.UOM + '<br/>' + this.point.DeviceType + ' ' + this.point.DeviceNo
                                + '<br>' + this.point.TypeName + ':' + this.point.Createdby_ShortName;
                        },

                    },
                    series: $scope.HelathDataChartSummaryCollection
                })

            })
        };

        /**
                     * In the chart render event, add icons on top of the circular shapes
                     */
        function renderIcons() {

            // Move icon
            if (!this.series[0].icon) {
                this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
                    .attr({
                        stroke: '#303030',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[2].group);
            }
            this.series[0].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
                (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
            );

            // Exercise icon
            if (!this.series[1].icon) {
                this.series[1].icon = this.renderer.path(
                    ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8]
                )
                    .attr({
                        stroke: '#ffffff',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[2].group);
            }
            this.series[1].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
                (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
            );

            // Stand icon
            if (!this.series[2].icon) {
                this.series[2].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
                    .attr({
                        stroke: '#303030',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[2].group);
            }

            this.series[2].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[2].points[0].shapeArgs.innerR -
                (this.series[2].points[0].shapeArgs.r - this.series[2].points[0].shapeArgs.innerR) / 2
            );
            /*sleep icon*/
            if (!this.series[3].icon) {
                this.series[3].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
                    .attr({
                        stroke: '#303030',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'stroke-width': 2,
                        zIndex: 10
                    })
                    .add(this.series[3].group);
            }

            this.series[3].icon.translate(
                this.chartWidth / 2 - 10,
                this.plotHeight / 2 - this.series[3].points[0].shapeArgs.innerR -
                (this.series[3].points[0].shapeArgs.r - this.series[3].points[0].shapeArgs.innerR) / 2
            );
        }

        $scope.GoalDataDateBasedDeatailsList = [];
        $scope.HealthDataDateBasedDeatailsList = [];

        $scope.StepCountDateBased = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/PatientDailyGoalData_List/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.GoalDataDateBasedDeatailsList = data.PatientHealthDataList;
                $scope.StepCount_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 1
                }, true)
                $scope.CaloriesExpanded_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 2
                }, true)
                $scope.DistanceCovered_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 3
                }, true)
                $scope.Sleeping_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 4
                }, true)
                $scope.ActualStepCountList = [];
                $scope.ActualStepCountRadius = [];
                $scope.ActualDistanceCoveredList = [];
                $scope.ActualDistanceCoveredRadius = [];
                $scope.ActualCaloriesExpandedList = [];
                $scope.ActualCaloriesExpandedRadius = [];
                $scope.ActualHeartRateList = [];
                $scope.ActualHeartRateRadius = [];
                $scope.ActualSleepingList = [];
                $scope.ActualSleepingRadius = [];
                var radiusMaster = 80;
                var radius = radiusMaster;
                var colorIndex = 1;
                var GoalStepCounts;
                var GoalCaloriesExpended;
                var GoalDistanceCovered;
                var GoalHeartRate;
                var GoalSleeping;
                var incValue = 40;
                //angular.forEach($scope.GoalDataDateBasedDeatailsList, function (value, index) {
                angular.forEach($scope.StepCount_List, function (value, index) {
                    var PercentageStepCount = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objStepCount = {
                        name: 'Steps',
                        data: [{
                            color: "#fd950c",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageStepCount,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualStepCountList.push(objStepCount);


                    var objStepCountRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualStepCountRadius.push(objStepCountRadius);
                    GoalStepCounts = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;

                })
                radius = radiusMaster;
                angular.forEach($scope.CaloriesExpanded_List, function (value, index) {
                    var PercentageCaloriesExpanded = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objCaloriesExpanded = {
                        name: 'Calories',
                        data: [{
                            color: "#4aa64e",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageCaloriesExpanded,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualCaloriesExpandedList.push(objCaloriesExpanded);


                    var objCaloriesExpandedRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualCaloriesExpandedRadius.push(objCaloriesExpandedRadius);
                    GoalCaloriesExpanded = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;

                })
                radius = radiusMaster;
                angular.forEach($scope.DistanceCovered_List, function (value, index) {
                    var PercentageDistanceCovered = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objDistanceCovered = {
                        name: 'Distance',
                        data: [{
                            color: "#e63d39",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageDistanceCovered,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualDistanceCoveredList.push(objDistanceCovered);

                    var objDistanceCoveredRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualDistanceCoveredRadius.push(objDistanceCoveredRadius);
                    GoalDistanceCovered = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;

                })
                radius = radiusMaster;
                angular.forEach($scope.Sleeping_List, function (value, index) {
                    var PercentageSleeping = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objSleeping = {
                        name: 'Sleeping',
                        data: [{
                            color: "#04afc4",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageSleeping,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualSleepingList.push(objSleeping);


                    var objSleepingRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualSleepingRadius.push(objSleepingRadius);
                    GoalSleeping = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;
                })



                $('#DemoChart').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                        events: {
                            render: renderIcons
                        }
                    },
                    title: {
                        text: 'Activity',
                        style: {
                            fontSize: '24px'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px'
                        },
                        valueSuffix: '%',
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move --steps
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise--calories
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Stand -- workout
                            outerRadius: '62%',
                            innerRadius: '38%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        },
                        {// Track for sleep
                            outerRadius: '37%',
                            innerRadius: '13%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[3])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },

                    series: [{
                        name: 'Steps',
                        data: [{
                            color: Highcharts.getOptions().colors[0],
                            radius: '112%',
                            innerRadius: '88%',
                            y: $scope.ActualStepCountList[0]["data"][0].y
                        }]
                    },
                    {
                        name: 'Calories',
                        data: [{
                            color: Highcharts.getOptions().colors[1],
                            radius: '87%',
                            innerRadius: '63%',
                            y: $scope.ActualCaloriesExpandedList[0]["data"][0].y
                        }]
                    }, {
                        name: 'Workout',
                        data: [{
                            color: Highcharts.getOptions().colors[2],
                            radius: '62%',
                            innerRadius: '38%',
                            y: $scope.ActualDistanceCoveredList[0]["data"][0].y
                        }]
                    },
                    {
                        name: 'Sleep',
                        data: [{
                            color: Highcharts.getOptions().colors[3],
                            radius: '37%',
                            innerRadius: '13%',
                            y: $scope.ActualSleepingList[0]["data"][0].y
                        }]
                    }]
                });
                $('#Step_Count').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: "110%"
                    },

                    title: {
                        //text: 'StepCount:' + GoalStepCounts,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },
                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualStepCountRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {
                                    return (`<div class='datalabel'><p class="datalabelh"><i class="fas fa-shoe-prints"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalStepCounts}</p></div>`);
                                },
                            },


                        }
                    },
                    series: $scope.ActualStepCountList

                })
                //${45}/${GoalStepCounts}
                $('#Calories_Expended').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        //text: 'Calories:' + GoalCaloriesExpanded,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualCaloriesExpandedRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {

                                    return (`<div class='datalabel'><p class="datalabelh_rot"><i class="fas fa-dumbbell"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalCaloriesExpanded}</p></div>`);
                                },
                            },


                        }
                    },
                    series:
                        $scope.ActualCaloriesExpandedList
                })

                $('#Distance_Covered').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                    },
                    title: {
                        //text: 'StepCount:' + GoalStepCounts,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },
                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualDistanceCoveredRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {

                                    return (`<div class='datalabel'><p class="datalabelh_rot"><i class="fas fa-burn"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalDistanceCovered}</p></div>`);
                                },
                            },


                        }
                    },
                    series:
                        $scope.ActualDistanceCoveredList
                })
                $('#SleepingChart').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                    },
                    title: {
                        //text: 'StepCount:' + GoalStepCounts,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },
                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',GoalDistanceCovered
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualSleepingRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {

                                    return (`<div class='datalabel'><p class="datalabelh_rot"><i class="fas fa-bed"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalSleeping}</p></div>`);
                                },
                            },


                        }
                    },
                    series:
                        $scope.ActualSleepingList
                })

            })
        };

        $scope.PatientListData = [];
        $scope.PatientData = [];
        $scope.PatientAppointmentCount = 0;
        $scope.appointmentDoctorId = 0;
        $scope.getMyAppointments = function () {
            $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (Patientdata) {
                $scope.PatientListData = Patientdata.PatientAppointmentList;
                if ($scope.PatientListData != null) {
                    $scope.PatientAppointmentCount = $scope.PatientListData.length;
                }
                // to show first appointment
                if ($scope.PatientAppointmentCount > 0) {
                    $scope.PatientData = $scope.PatientListData[0];
                    $scope.DoctorName = $scope.PatientData.DoctorName;
                    $scope.appointmentDoctorId = $scope.PatientData.Doctor_Id;
                    $scope.AppointmentTime = $scope.PatientData.Appointment_FromTime;
                    $scope.Appointmentdate = DateFormatEdit(moment($scope.PatientData.Appointment_Date).format('DD-MMM-YYYY'));
                    //$scope.AppointmentDate = DateFormatEdit(Declare);
                    $scope.PhotoBlob = $scope.PatientData.PhotoBlob;
                    $scope.ViewGenderName = $scope.PatientData.ViewGenderName;
                    $window.localStorage['selectedDoctor'] = $scope.appointmentDoctorId;
                    //  $scope.TimeDifference = $scope.PatientData.TimeDifference;
                    if ($scope.AppointmentTime != null) {
                        var startdate = moment(new Date($scope.AppointmentTime));
                        var enddate = moment(new Date());
                        var diff = Math.abs(enddate - startdate);
                        var days = Math.floor(diff / (60 * 60 * 24 * 1000));
                        var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
                        var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                        var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

                        var timeDiffString = "";
                        if (days != 0) {
                            timeDiffString = timeDiffString + days + ' day ';
                        }
                        else if (hours != 0) {
                            timeDiffString = timeDiffString + hours + ' hr ';
                        }
                        else if (minutes != 0) {
                            timeDiffString = timeDiffString + minutes + ' min ';
                        }
                        else if (seconds != 0) {
                            timeDiffString = timeDiffString + seconds + ' sec';
                        }
                        $scope.TimeDifference = timeDiffString;
                    }
                    $scope.Appointment_Id = $scope.PatientData.Id;
                    if ($scope.UserTypeId == 4 || $scope.UserTypeId == 7) {
                        $scope.chattingWith = $scope.DoctorName;
                    }
                }
            });
        }
        // call my appointments only in patient login
        if ($routeParams.PageParameter == "1") {
            $scope.getMyAppointments();
        }


        $scope.index = 0;
        $scope.Next_PatientAppointment = function (Type) {
            if (Type == 1) {
                $scope.index = $scope.index + 1;
                $scope.disable_Next = ($scope.PatientAppointmentCount) - 1;
            }
            if (Type == 2) {
                $scope.index = $scope.index - 1;
            }
            $scope.PatientData = $scope.PatientListData[$scope.index];
            if ($scope.PatientData !== undefined && $scope.PatientData !== null) {
                $scope.appointmentDoctorId = $scope.PatientData.Doctor_Id;
                $scope.DoctorName = $scope.PatientData.DoctorName;
                $scope.AppointmentTime = $scope.PatientData.Appointment_FromTime;
                $scope.Appointmentdate = DateFormatEdit(moment($scope.PatientData.Appointment_Date).format('DD-MMM-YYYY'));
                $window.localStorage['selectedDoctor'] = $scope.appointmentDoctorId;
                //$scope.TimeDifference = $scope.PatientData.TimeDifference;

                if ($scope.AppointmentTime != null) {
                    var startdate = moment(new Date($scope.AppointmentTime));
                    var enddate = moment(new Date());
                    var diff = Math.abs(enddate - startdate);
                    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
                    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
                    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

                    var timeDiffString = "";
                    if (days != 0) {
                        timeDiffString = timeDiffString + days + ' day ';
                    }
                    else if (hours != 0) {
                        timeDiffString = timeDiffString + hours + ' hr ';
                    }
                    else if (minutes != 0) {
                        timeDiffString = timeDiffString + minutes + ' min ';
                    }
                    else if (seconds != 0) {
                        timeDiffString = timeDiffString + seconds + ' sec';
                    }
                    $scope.TimeDifference = timeDiffString;
                }
                $scope.PhotoBlob = $scope.PatientData.PhotoBlob;
                $scope.ViewGenderName = $scope.PatientData.ViewGenderName;
                $scope.Appointment_Id = $scope.PatientData.Id;
            }
            if ($scope.UserTypeId == 4 || $scope.UserTypeId == 7) {
                $scope.chattingWith = $scope.DoctorName;
            }
        }

        $scope.AddVitalsPopUp = function () {
            //for (let i = 0; i < $scope.AddVitalParameters.length; i++) {
            //    $scope.AddVitalParameters[i].All_UnitLists = $scope.ParameterMappingList;
            //}
            angular.element('#PatientVitalsCreateModal').modal('show');
            $scope.AddVitalParameters = [{
                'Id': 0,
                'ParameterId': 0,
                'Units_ID': 0,
                'UOM_Name': '',
                'ParameterValue': '',
                'chkDateTime': false,
                'ActivityDate': new Date().toJSON().slice(0, 19),
                'IsActive': 1,
                'All_UnitLists': $scope.ParameterMappingList,
                'ParameterMappingList': []
            }];            
        }

        $scope.smsResponse = [];
        $scope.smsUrl = "";
        $scope.smsUserName = "";
        $scope.smsApiId = "";
        $scope.smsDestination = "";
        $scope.smsSource = "";
        $scope.smsText = "";
        $scope.SendSMS = function () {
            $scope.smsUrl = "https://txt.speroinfotech.ae/API/SendSMS?";
            $scope.smsUserName = "MyHealth";
            $scope.smsApiId = "Kv2n09u8";
            //$scope.smsDestination = "971552433557"; //Mobile Number
            $scope.smsDestination = $window.localStorage['User_Mobile_No']; //Mobile Number
            $scope.smsSource = "Medspero"; // AD-Medspero // Header Text
            $scope.smsText = "Test";
            $http.get($scope.smsUrl + 'username=' + $scope.smsUserName + '&apiId=' + $scope.smsApiId + '&json=True&destination=' + $scope.smsDestination + '&source=' + $scope.smsSource + '&text=' + $scope.smsText).success(function (data) {
                $scope.smsResponse = data;
            });
        }

        $scope.ShowAppointmentBookingPopUp = function () {
            //document.getElementById("main-box").style = "";
            //document.getElementById("box").style = "display:none";
            //$scope.SendSMS();
            $scope.showMainBox = true;
            $http.get(baseUrl + '/api/DoctorShift/AppointmentSettingView/?InstitutionId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                //$scope.NewAppointment = data.NewAppointmentDuration;
                if (data == null || data.length == 0 || data.DefautTimeZone == "" || data.DefautTimeZone == 0) {
                    //alert('Please Check Organisation Settings!');
                    toastr.info("Please Check Organisation Settings!", "info");
                    angular.element('#BookAppointmentModal').modal('hide');
                    document.getElementById("BookNew").disabled = true;
                    document.getElementById("BookNew").title = 'Set Organisation Settings TimeZone Value!';
                }
                else {
                    angular.element('#BookAppointmentModal').modal('show');
                }
                $scope.AppoimDate = new Date(DatetimepickermaxDate);
            });
            // load department list --department list shown by default for current date            
            var res = moment(new Date()).format('YYYY-MM-DD')// convert(AppDate);
            $scope.DepartmentList1 = [];
            $http.get(baseUrl + '/api/DoctorShift/ByDateDept_List/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Filter_Date=' + res + '&Login_Session_Id=' + $window.localStorage['Login_Session_Id']).success(function (data) {
                $scope.DepartmentList1 = data;
            });

        }
        $scope.ShowStripePopup = function () {
            angular.element('#StripePayOptions').modal('show');
        }

        $scope.patientVitalsrowChkChange = function (itemIndex) {
            //alert(itemIndex);
            $("#ptDateTimePicker" + itemIndex).val(new Date().toJSON().slice(0, 19));
            $("#ptDateTimePicker" + itemIndex).attr('max', new Date().toJSON().slice(0, 19));
        }

        $scope.get_SubParameterMappingList = function (index) {
            var pid = $scope.AddVitalParameters[index].ParameterId;
            var unitlist = $scope.AddVitalParameters[index].All_UnitLists;
            if (unitlist.length != 0) {
                var newlist = unitlist.filter(x => x.Parameter_ID == pid);
                $scope.AddVitalParameters[index].ParameterMappingList = newlist;
            }
        }

        // Add row concept for Patient Vital Parameters
        $scope.AddVitalParameters = [{
            'Id': 0,
            'ParameterId': 0,
            'Units_ID': 0,
            'UOM_Name': '',
            'ParameterValue': '',
            'chkDateTime': false,
            'ActivityDate': new Date().toJSON().slice(0, 19),
            'IsActive': 1,
            'All_UnitLists': $scope.ParameterMappingList,
            'ParameterMappingList': []
        }];

        /*This is a Addrow function to add new row and save Family Health Problem details*/
        $scope.AddParameterVitals_Insert = function () {
            if ($scope.AddVitalParameters.length > 0) {
                var obj = {
                    'Id': 0,
                    'ParameterId': 0,
                    'Units_ID': 0,
                    'UOM_Name': '',
                    'ParameterValue': '',
                    'chkDateTime': false,
                    'ActivityDate': new Date().toJSON().slice(0, 19),
                    'IsActive': 1,
                    'All_UnitLists': $scope.ParameterMappingList,
                    'ParameterMappingList': []
                }
                $scope.AddVitalParameters.push(obj);
            }
            else {
                $scope.AddVitalParameters = [{
                    'Id': 0,
                    'ParameterId': 0,
                    'Units_ID': 0,
                    'UOM_Name': '',
                    'ParameterValue': '',
                    'chkDateTime': false,
                    'ActivityDate': new Date().toJSON().slice(0, 19),
                    'IsActive': 1,
                    'All_UnitLists': $scope.ParameterMappingList,
                    'ParameterMappingList': []
                }];
            }
        };

        $scope.ejDTonChange = function (event, index) {
            var datee = document.getElementById('ptDateTimePicker' + index).value;
            $scope.AddVitalParameters[index].ActivityDate = datee;
        }

        $scope.VitalParameterDelete = function (itemIndex) {
            Swal.fire({
                title: 'Do you like to delete the selected Parameter?',
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
                    //  var del = confirm("Do you like to delete the selected Parameter?");
                    // if (del == true) {
                    $scope.$apply(() => {
                        $scope.AddVitalParameters.splice(itemIndex, 1);
                        if ($scope.AddVitalParameters.length == 0) {
                            $scope.AddVitalParameters = [{
                                'Id': 0,
                                'ParameterId': 0,
                                'Units_ID': 0,
                                'UOM_Name': '',
                                'ParameterValue': '',
                                'chkDateTime': false,
                                'ActivityDate': new Date().toJSON().slice(0, 19),
                                'IsActive': 1,
                                'All_UnitLists': $scope.ParameterMappingList,
                                'ParameterMappingList': []
                            }];
                        }
                    });
                    //}
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            });

        };

        $scope.ParameterInsert_UpdateValidations = function () {
            var TSDuplicate = 0;
            var varlidationCheck = 0;
            var paramExist = 0;
            var unitIdExist = 0;
            var DuplicateParam = '';
            //angular.forEach($scope.VitalsParameterList_Data, function (value, index) {
            angular.forEach($scope.AddVitalParameters, function (value1, index1) {
                if (value1.ParameterId != '' && value1.ParameterId > 0) {
                    paramExist = 1;
                } else {
                    paramExist = 0;
                }
                if (value1.Units_ID != '' && value1.Units_ID > 0) {
                    unitIdExist = 1;
                } else {
                    unitIdExist = 0;
                }
                var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: value1.ParameterId }, true)[0]
                if (checkobj != null) {
                    angular.forEach($scope.AddVitalParameters, function (value2, index2) {
                        if (index1 > index2 && value1.ParameterId == value2.ParameterId) {
                            TSDuplicate = 1;
                            if (DuplicateParam != '')
                                DuplicateParam = DuplicateParam + ',';
                            DuplicateParam = DuplicateParam + checkobj.ParameterName;
                        };
                    });
                    if (value1.ParameterValue == '' || value1.ParameterValue <= 0) {
                        varlidationCheck = 1;
                        //alert("Please enter value for " + checkobj.ParameterName);
                        toastr.warning("Please enter value for " + checkobj.ParameterName, "warning");
                        return false;
                    }
                    else if (checkobj.Min_Possible > parseFloat(value1.ParameterValue) && checkobj.Min_Possible > 0) {
                        varlidationCheck = 1;
                        //alert(checkobj.ParameterName + " value cannot be less than " + checkobj.Min_Possible);
                        toastr.warning(checkobj.ParameterName + " value cannot be less than " + checkobj.Min_Possible, "warning");
                        return false;
                    }
                    else if (checkobj.Max_Possible < parseFloat(value1.ParameterValue) && checkobj.Max_Possible > 0) {
                        varlidationCheck = 1;
                        //alert(checkobj.ParameterName + " value cannot be greater than " + checkobj.Max_Possible);
                        toastr.warning(checkobj.ParameterName + " value cannot be greater than " + checkobj.Max_Possible, "warning");
                        return false;
                    }
                }
            });
            if (TSDuplicate == 1) {
                //alert('Parameters ' + DuplicateParam + 'already exist, cannot be Duplicated');
                toastr.error('Parameters ' + DuplicateParam + 'already exist, cannot be Duplicated', "warning");
                return false;
            }
            else if (varlidationCheck == 1) {
                return false;
            }
            else if (paramExist == 0) {
                //alert('Please enter Parameter details to Save');
                toastr.warning("Please enter Parameter details to Save", "warning");
                return false;
            }
            else if (unitIdExist == 0) {
                //alert('Please enter Unit details to Save');
                toastr.warning("Please enter Unit details to Save", "warning");
                return false;
            }
            return true;

        };
        $scope.ParameterInsert_Update = function (itemIndex) {
            if ($scope.ParameterInsert_UpdateValidations() == true) {
                $("#chatLoaderPV").show();
                var filteredObj = $ff($scope.AddVitalParameters, function (value) {
                    return value.ParameterId != '';
                });
                for (let i = 0; i < filteredObj.length; i++) {
                    if (filteredObj[i].chkDateTime == false) {
                        filteredObj[i].Activity_Date = $filter('date')(new Date(), 'dd-MMM-yyyy HH:mm:ss')
                    } else {
                        filteredObj[i].Activity_Date = $filter('date')(filteredObj[i].ActivityDate, 'dd-MMM-yyyy HH:mm:ss')
                    }
                }
                var obj = {
                    Id: $scope.Id,
                    ActivityDate: $filter('date')(new Date(), 'dd-MMM-yyyy HH:mm:ss'),
                    Created_By: $window.localStorage['UserId'],
                    Patient_Id: $scope.SelectedPatientId,
                    DeviceType: 'MANUAL',
                    Device_No: 'MANUAL',
                    PatientHealthDataModel: filteredObj,
                    Modified_By: $window.localStorage['UserId'],
                }
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/User/PatientHealthDataBulk_Insert_Update/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    var alemsg = "";
                    if ($scope.currentTab == '2') {
                        alemsg = "Vitals data inserted Successfully"
                        $('#btnsave').attr("disabled", false);
                    }
                    else {
                        alemsg = "Lab data inserted Successfully"
                        $('#btnsave').attr("disabled", false);
                    }
                    if (data == '1') {
                        //alert(alemsg);
                        toastr.success(alemsg, "success");
                        $scope.ParameterCancelPopup();
                        $scope.HistoryDetails($scope.currentTab);      // vitals grid view refresh

                    }
                    else {
                        //alert("Error in creating Vitals!");
                        toastr.warning("Error in creating Vitals!", "warning");
                    }
                });
            }

        };
        $scope.ParameterClickEdit = function (rowData, rowIndex) {
            if (rowData.IsActive == 0) {
                toastr.warning("Inactive records cannot be edited", "warning");
            }
            else {
                var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: rowData.ParameterId }, true)[0];
                if (checkobj.IsFormulaParam == "1") {
                    //alert(checkobj.ParameterName + " cannot be edited");
                    toastr.warning(checkobj.ParameterName + " cannot be edited", "warning");
                }
                else {
                    if ($scope.IsEditableCheck(rowData.Activity_Date) == false) {
                        //alert("Parameter value cannot be edited");
                        toastr.info("Parameter value cannot be edited", "info");
                    }
                    else {
                        $scope.EditVitalRow_EditFlag[rowIndex] = 2;
                    }
                }
            }

        }
        /*  *//*calling Alert message for cannot edit inactive record function *//*
          $scope.ParameterClickEdit = function () {
             //alert("Parameter value cannot be edited");
              toastr.info("Parameter value cannot be edited", "info");
          }
  */
        /*calling Alert message for cannot edit inactive record function *//*
        $scope.ParameterClickEdit = function () {
              //alert("Parameter value cannot be edited");
            toastr.info("Inactive records cannot be edited", "info");
        }*/
        $scope.ParameterEdit_Update = function (rowData, rowIndex) {
            if (rowData.newParameterValue == '') {
                //alert("Please enter value");
                toastr.warning("Please enter value", "warning");
                return false;
            }
            var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: rowData.ParameterId }, true)[0];
            if (checkobj.Min_Possible > parseFloat(rowData.newParameterValue) && checkobj.Min_Possible > 0) {
                //alert(checkobj.ParameterName + " value cannot be less than " + checkobj.Min_Possible);
                toastr.warning(checkobj.ParameterName + " value cannot be less than " + checkobj.Min_Possible, "warning");
                return false;
            }
            else if (checkobj.Max_Possible < parseFloat(rowData.newParameterValue) && checkobj.Max_Possible > 0) {
                //alert(checkobj.ParameterName + " value cannot be greater than " + checkobj.Max_Possible);
                toastr.warning(checkobj.ParameterName + " value cannot be greater than " + checkobj.Max_Possible, "warning");
                return false;
            }


            if (rowData.Id == 0) {
                rowData.Modified_By == null;
            }
            else {
                rowData.Modified_By = $window.localStorage['UserId'];
            }
            rowData.ParameterValue = rowData.newParameterValue;
            $("#chatLoaderPV").show();
            $http.post(baseUrl + '/api/User/PatientHealthData_Insert_Update/?Login_Session_Id=' + $scope.LoginSessionId, rowData).success(function (data) {
                $("#chatLoaderPV").hide();
                if (data.ReturnFlag == "1") {
                    $scope.EditVitalRow_EditFlag[rowIndex] = 1;
                    //alert("Vitals data updated Successfully");
                    toastr.success("Vitals data updated Successfully", "success");
                }
                else {
                    $("#chatLoaderPV").hide();
                    //alert("Error in creating Vitals!");
                    toastr.warning("Error in creating Vitals!", "warning");
                }

            });

        };
        $scope.ChartActive = function () {
            $scope.VitalChart = 1;
        }
        $scope.EditVitalRow_EditFlag = [];
        $scope.HistoryDetails = function (current_Tab) {
            $scope.TabClicked = current_Tab;
            if ($scope.VitalChart == '1') {
                var ChartORData = '1';
            } else if ($scope.VitalChart == '2') {
                var ChartORData = 2;
            }
            //var ChartORData = 2;
            $scope.AllDetailsList($scope.TabClicked, ChartORData);
        };

        $scope.VitalParametersDetailsHistory = function () {
            angular.element('#PatientVitalsParameterHistoryCreateModal').modal('show');
        }


        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.CancelEdit = function (row, rownum) {
            var del = confirm("Do you like to cancel the Edit?");
            if (del == true) {
                $scope.EditVitalRow_EditFlag[rownum] = 1;
                row.newParameterValue = row.ParameterValue;
            }
        };
        $scope.DeleteParameters = function (comId, paramId) {
            var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: paramId }, true)[0]
            if (checkobj.IsFormulaParam == "1") {
                //alert(checkobj.ParameterName + " cannot be deactivated");
                toastr.warning(checkobj.ParameterName + " cannot be deactivated", "warning");
            }
            else {
                $scope.Id = comId;
                $scope.Parameter_Delete();
            }
        };
        $scope.Parameter_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Parameter?',
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
                    var obj =
                    {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId']
                    }
                    $http.post(baseUrl + '/api/User/ParametersDetails_Delete/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 0) {
                            toastr.error(data.Message, "warning");
                        }
                        $scope.HistoryDetails();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Parameter" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Parameter?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/User/ParametersDetails_Delete/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.error(data.Message, "warning");
                    }
                    $scope.HistoryDetails();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Parameter" + data;
                });

            }*/;
        };

        /*'Active' the Institution*/
        $scope.ReInsertParameters = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertParametersDetails();

        };

        /* 
        Calling the api method to inactived the details of the company 
        for the  company Id,
        and redirected to the list page.
        */
        $scope.ReInsertParametersDetails = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Parameter?',
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
                    var obj =
                    {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId']
                    }
                    $http.post(baseUrl + '/api/User/ParametersDetails_Active/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $scope.HistoryDetails();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ReInsertParameterDetails" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var Ins = confirm("Do you like to activate the selected Parameter?");
             if (Ins == true) {
                 var obj =
                 {
                     Id: $scope.Id,
                     Modified_By: $window.localStorage['UserId']
                 }
                 $http.post(baseUrl + '/api/User/ParametersDetails_Active/', obj).success(function (data) {
                     //alert(data.Message);
                     if (data.ReturnFlag == 2) {
                         toastr.success(data.Message, "success");
                     }
                     $scope.HistoryDetails();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while ReInsertParameterDetails" + data;
                 });
             };*/
        }
        /* on click view, view popup opened*/
        /* on click view, view popup opened*/
        $scope.ParameterViewPopUP = function (rowData) {

            $scope.Id = rowData.Id;
            $scope.ParameterName = rowData.ParameterName;
            $scope.UOM_Name = rowData.UOM_Name;
            $scope.newParameterValue = rowData.newParameterValue;
            $scope.Created_Dt = rowData.Created_Dt;
            angular.element('#ParameterViewModal').modal('show');
        };

        $scope.EditVitalParameters = function (CatId, activeFlag) {
            if (activeFlag == 1) {
                // $scope.InstitutionClear();
                $scope.Id = CatId;
                //$scope.VitalParametersView();

            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
            }
        };
        $scope.CancelViewParameter = function () {
            angular.element('#ParameterViewModal').modal('hide');
            $scope.ClearParameterPopup();
        }
        $scope.ParameterCancelPopup = function () {
            angular.element('#PatientVitalsCreateModal').modal('hide');
            $scope.ClearParameterPopup();
        }
        $scope.ClearParameterPopup = function () {
            $scope.AddVitalParameters = [{
                'Id': 0,
                'ParameterId': 0,
                'Units_ID': 0,
                'UOM_Name': '',
                'ParameterValue': '',
                'chkDateTime': false,
                'ActivityDate': new Date().toJSON().slice(0, 19),
                'IsActive': 1,
                'All_UnitLists': $scope.ParameterMappingList,
                'ParameterMappingList': []
            }];
            $scope.UOMName = "";
        }
        $scope.PatientTo30days_CancelPopup = function () {
            //For Today Appointment Page	
            $location.path("/Thirtydays_appointments/");
        }

        $scope.CancelAppointmentModal = function (AppointmentId) {
            Swal.fire({
                title: 'Do you like to Cancel the Patient Appointment',
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
                    $scope.Cancelled_Remarks = "";
                    $scope.Appointment_Id = AppointmentId;
                    angular.element('#PatientAppointmentModal').modal('show');
                    $scope.ReasonTypeDropList();
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var msg = confirm("Do you like to Cancel the Patient Appointment?");
             if (msg == true) {
                 $scope.Cancelled_Remarks = "";
                 $scope.Appointment_Id = AppointmentId;
                 angular.element('#PatientAppointmentModal').modal('show');
                 $scope.ReasonTypeDropList();
             }*/
        }
        $scope.ReasonTypeDropList = function () {
            // if($window.localStorage['UserTypeId']==2 || $window.localStorage['UserTypeId']==4  ||$window.localStorage['UserTypeId']==7 ){

            $http.get(baseUrl + '/api/PatientAppointments/AppointmentReasonType_List/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AppointmentReasonTypeListTemp = [];
                $scope.AppointmentReasonTypeListTemp = data;
                var obj = { "ReasonTypeId": 0, "ReasonType": "Select", "IsActive": 1 };
                $scope.AppointmentReasonTypeListTemp.splice(0, 0, obj);
                $scope.AppointmentReasonTypeList = angular.copy($scope.AppointmentReasonTypeListTemp);
            });
            //  }
        }
        $scope.Cancel_CancelledAppointment = function (AppointmentId) {
            angular.element('#PatientAppointmentModal').modal('hide');
            $scope.Cancelled_Remarks = "";
            $scope.ReasonTypeId = '0';
        }

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.Update_CancelledAppointment = function (Appointment_Id) {
            if (typeof ($scope.ReasonTypeId) == "undefined" || $scope.ReasonTypeId == "0") {
                //alert("Please select Reason Type");
                toastr.warning("Please select Reason Type", "warning");
                return false;
            }
            else {
                var obj = {
                    CancelledBy_Id: $scope.SelectedPatientId,
                    Id: $scope.Appointment_Id,
                    Cancelled_Remarks: $scope.Cancelled_Remarks,
                    ReasonTypeId: $scope.ReasonTypeId
                }
                $("#chatLoaderPV").show();
                $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    angular.element('#PatientAppointmentModal').modal('hide');
                    $scope.Cancelled_Remarks = "";
                    $scope.ReasonTypeId = '0';
                    $scope.getMyAppointments();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while Updating Appointment Details" + data;
                });
            }
        }
        $scope.DiagosticAlert_CancelPopup = function () {
            //Diagostic Alert
            $location.path("/Carecoordinator/1");
        }
        $scope.ComplianceAlert_CancelPopup = function () {
            //Compliaance Alert
            $location.path("/CarecoordinatorCompliance/2");
        }
        $scope.CareGiver_CancelPopup = function () {
            //Care Giver Assigned Patient
            $location.path("/CareGiverAssignedPatients");
        }
        $scope.UserTypeId = $window.localStorage['UserTypeId'];
        $scope.UserId = $window.localStorage['UserId'];
        $scope.CareGiverAssign_Function = function () {
            if ($scope.UserTypeId == "6") {
                //Assign care Giver only in Coordinator Login
                //$scope.ParameterValueList = [];
                //$http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                //    $scope.ParameterValueList = data;
                //});

                $scope.CareGiverList = [];
                $http.post(baseUrl + '/api/CareCoordinnator/CareGiver_List/?Id=' + $scope.SelectedPatientId).success(function (data) {
                    $scope.CareGiverList = data;
                });
            }
        }
        var HighCountVital;

        if ($scope.UserTypeId != "3" || $scope.UserTypeId != "1") {
            //Assign care Giver only in Coordinator Login

            $scope.ParameterValueList = [];
            /*$scope.ParameterValueListCount = [];
            
            $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValueCount/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data1) {
                $scope.ParameterValueListCount = data1;
                angular.forEach($scope.ParameterValueListCount, function (value, index) {
                    //console.log(value);
                    $scope.HighParamCount = value.HighCount;
                    $scope.LowParamCount = value.LowCount;
                    $scope.MediumParamCount = value.MediumCount;
                });
            });*/

            $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.ParameterValueList = data;
                //angular.forEach($scope.ParameterValueList, function (value, index) {
                //    console.log(value);
                //    if(value.HighCount!= 0) 
                //    {
                //        HighCountVital= (value.HighCount).length;
                //        console.log(HighCountVital);
                //    }
                //});


            });
        }


        $scope.yellowcount = 1;
        $scope.AlertCountDisplay = function () {
            $scope.redcount = 1;
            $scope.greencount = 1;
            $('.jinglebelllow').removeClass('active');
            $('#Highcount').addClass('fa fa-bell-o myhighBell');
            $('.jinglebellhigh').removeClass('active');
            $('#Lowcount').addClass('fa fa-bell-o mylowBell');
            $('.jinglebellmedium').addClass('active');
            $('#Medcount').removeClass('fa fa-bell-o mymediumBell');
            $('#Medcount').addClass('fas fa-bell mymediumBell');
            var x = document.getElementById("tableid");
            var i = document.getElementById("tableid_img");
            i.src = "../../Images/expand.gif"
            x.style.display = "none";
            document.getElementById('tableid_img').title = 'Click to Expand';
            $('#tableid').hide();
            $('#tableid1').hide();
            $('#tableid2').hide();
            $scope.yellowcount++;

            var MediumCountVital;
            $scope.MediumCountVitalList = [];
            if ($scope.yellowcount == 2) {
                angular.forEach($scope.ParameterValueList, function (value, index) {
                    console.log(value);
                    if (value.MediumCount != 0) {
                        MediumCountVital = value.MediumCount;
                        console.log(MediumCountVital);
                        $scope.MediumCountVitalList.push(value);
                    }
                });
                if ($scope.MediumCountVitalList.length > 0) {
                    $('#tableid1').show();
                    $('#tableid3').hide();
                    $('#tableid2').hide();
                    $('#tableid4').hide();
                    $('#tableid5').hide();
                    $('#tableid6').hide();
                    return true;
                } else {
                    $('#tableid1').hide();
                    $('#tableid3').hide();
                    $('#tableid2').hide();
                    $('#tableid4').hide();
                    $('#tableid5').hide();
                    $('#tableid6').hide();
                    return true;
                }

            } else if ($scope.yellowcount == 3) {
                $('#tableid3').hide();
                $('#tableid5').hide();
                $('#tableid1').hide();
                $('#tableid2').show();
                $('#tableid4').hide();
                $('#tableid6').hide();

            } else {

                //i.src = "../../Images/expand.gif"
                $('#tableid1').hide();
                $('#tableid2').hide();
                $('.jinglebellmedium').removeClass('active');
                $('.jinglebellmedium i').removeClass('fas fa-bell mymediumBell');
                $('.jinglebellmedium i').addClass('fa fa-bell-o mymediumBell');
                $scope.yellowcount = 1;
                //document.getElementById(tableid + '_img').title = 'Click to Expand';
                //count = $scope.yellowcount - 3;

            }
            return true;
        };

        $scope.redcount = 1;
        $scope.AlertCountredDisplay = function () {
            $scope.yellowcount = 1;
            $scope.greencount = 1;
            $('.jinglebellmedium').removeClass('active');
            $('#Medcount').addClass('fa fa-bell-o mymediumBell');
            $('.jinglebellhigh').removeClass('active');
            $('#Lowcount').addClass('fa fa-bell-o mylowBell');
            $('.jinglebelllow').addClass('active');
            $('#Highcount').removeClass('fa fa-bell-o myhighBell');
            $('#Highcount').addClass('fas fa-bell myhighBell');
            var x = document.getElementById("tableid");
            var i = document.getElementById("tableid_img");
            i.src = "../../Images/expand.gif"
            x.style.display = "none";
            document.getElementById('tableid_img').title = 'Click to Expand';
            $('#tableid').hide();
            $('#tableid3').hide();
            $('#tableid4').hide();
            $scope.redcount++;

            var HighCountVital;
            $scope.HighCountVitalList = [];
            if ($scope.redcount == 2) {
                angular.forEach($scope.ParameterValueList, function (value, index) {
                    console.log(value);
                    if (value.HighCount != 0) {
                        HighCountVital = value.HighCount;
                        console.log(HighCountVital);
                        $scope.HighCountVitalList.push(value);
                    }
                });
                if ($scope.HighCountVitalList.length > 0) {
                    $('#tableid3').show();
                    $('#tableid1').hide();
                    $('#tableid2').hide();
                    $('#tableid5').hide();
                    $('#tableid6').hide();
                    return true;
                } else {
                    $('#tableid3').hide();
                    $('#tableid1').hide();
                    $('#tableid2').hide();
                    $('#tableid5').hide();
                    $('#tableid6').hide();

                    return true;
                }

            } else if ($scope.redcount == 3) {
                $('#tableid1').hide();
                $('#tableid5').hide();
                $('#tableid3').hide();
                $('#tableid4').show();
                $('#tableid2').hide();
                $('#tableid6').hide();

            } else {

                //i.src = "../../Images/expand.gif"

                $('#tableid3').hide();
                $('#tableid4').hide();
                $('.jinglebelllow').removeClass('active');
                $('.jinglebelllow i').removeClass('fas fa-bell myhighBell');
                $('.jinglebelllow i').addClass('fa fa-bell-o myhighBell');
                $scope.redcount = 1;
                //document.getElementById(tableid + '_img').title = 'Click to Expand';
                //count = $scope.yellowcount - 3;

            }
            return true;
        };

        $scope.greencount = 1;
        $scope.AlertCountgreenDisplay = function () {
            $scope.redcount = 1;
            $scope.yellowcount = 1;
            $('.jinglebelllow').removeClass('active');
            $('#Highcount').addClass('fa fa-bell-o myhighBell');
            $('.jinglebellmedium').removeClass('active');
            $('#Medcount').addClass('fa fa-bell-o mymediumBell');
            $('.jinglebellhigh').addClass('active');
            $('#Lowcount').removeClass('fa fa-bell-o mylowBell');
            $('#Lowcount').addClass('fas fa-bell mylowBell');
            var x = document.getElementById("tableid");
            var i = document.getElementById("tableid_img");
            i.src = "../../Images/expand.gif"
            x.style.display = "none";
            document.getElementById('tableid_img').title = 'Click to Expand';
            $('#tableid').hide();
            $('#tableid5').hide();
            $('#tableid6').hide();
            $scope.greencount++;

            var LowCountVital;
            $scope.LowCountVitalList = [];
            if ($scope.greencount == 2) {
                angular.forEach($scope.ParameterValueList, function (value, index) {
                    console.log(value);
                    if (value.LowCount != 0) {
                        LowCountVital = value.LowCount;
                        console.log(LowCountVital);
                        $scope.LowCountVitalList.push(value);
                    }
                });
                if ($scope.LowCountVitalList.length > 0) {
                    $('#tableid5').show();
                    $('#tableid1').hide();
                    $('#tableid4').hide();
                    $('#tableid3').hide();
                    $('#tableid2').hide();
                    $('#tableid6').hide();
                    return true;
                } else {
                    $('#tableid5').hide();
                    $('#tableid1').hide();
                    $('#tableid4').hide();
                    $('#tableid3').hide();
                    $('#tableid2').hide();
                    $('#tableid6').hide();
                    return true;
                }

            } else if ($scope.greencount == 3) {
                $('#tableid1').hide();
                $('#tableid4').hide();
                $('#tableid5').hide();
                $('#tableid6').show();
                $('#tableid2').hide();
                $('#tableid4').hide();
                $('#tableid3').hide();

            } else {

                //i.src = "../../Images/expand.gif"

                $('#tableid5').hide();
                $('#tableid6').hide();
                $('.jinglebellhigh').removeClass('active');
                $('.jinglebellhigh i').removeClass('fas fa-bell mylowBell');
                $('.jinglebellhigh i').addClass('fa fa-bell-o mylowBell');
                $scope.greencount = 1;
                //document.getElementById(tableid + '_img').title = 'Click to Expand';
                //count = $scope.yellowcount - 3;

            }
            return true;
        };
        /* $scope.yellowcount = 1;
         $scope.AlertCountDisplay = function () {
             $scope.redcount = 1;
             $scope.greencount = 1;
             $('.jinglebelllow').removeClass('active');
             $('#Highcount').addClass('fa fa-bell-o myhighBell');
             $('.jinglebellhigh').removeClass('active');
             $('#Lowcount').addClass('fa fa-bell-o mylowBell');
             $('.jinglebellmedium').addClass('active');
             $('#Medcount').removeClass('fa fa-bell-o mymediumBell');
             $('#Medcount').addClass('fas fa-bell mymediumBell');
             var x = document.getElementById("tableid");
             var i = document.getElementById("tableid_img");
             i.src = "../../Images/expand.gif"
             x.style.display = "none";
             document.getElementById('tableid_img').title = 'Click to Expand';
             $('#tableid').hide();
             $('#tableid1').hide();
             $('#tableid2').hide();
             $scope.yellowcount++;
 
             var MediumCountVital;
             $scope.MediumCountVitalList = [];
             if ($scope.yellowcount == 2) {
                 $scope.ParameterValueList = [];
                 $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                     $scope.ParameterValueList = data;
                 });
 
                 angular.forEach($scope.ParameterValueList, function (value, index) {
                     console.log(value);
                     if (value.MediumCount != 0) {
                         MediumCountVital = value.MediumCount;
                         console.log(MediumCountVital);
                         $scope.MediumCountVitalList.push(value);
                     }
                 });
                 if ($scope.MediumCountVitalList.length > 0) {
                     $('#tableid1').show();
                     $('#tableid3').hide();
                     $('#tableid2').hide();
                     $('#tableid4').hide();
                     $('#tableid5').hide();
                     $('#tableid6').hide();
                     return true;
                 } else {
                     $('#tableid1').hide();
                     $('#tableid3').hide();
                     $('#tableid2').hide();
                     $('#tableid4').hide();
                     $('#tableid5').hide();
                     $('#tableid6').hide();
                     return true;
                 }
 
             } else if ($scope.yellowcount == 3) {
                 $('#tableid3').hide();
                 $('#tableid5').hide();
                 $('#tableid1').hide();
                 $('#tableid2').show();
                 $('#tableid4').hide();
                 $('#tableid6').hide();
 
             } else {
 
                 //i.src = "../../Images/expand.gif"
                 $('#tableid1').hide();
                 $('#tableid2').hide();
                 $('.jinglebellmedium').removeClass('active');
                 $('.jinglebellmedium i').removeClass('fas fa-bell mymediumBell');
                 $('.jinglebellmedium i').addClass('fa fa-bell-o mymediumBell');
                 $scope.yellowcount = 1;
                 //document.getElementById(tableid + '_img').title = 'Click to Expand';
                 //count = $scope.yellowcount - 3;
 
             }
             return true;
         };
 
         $scope.redcount = 1;
         $scope.AlertCountredDisplay = function () {
             $scope.yellowcount = 1;
             $scope.greencount = 1;
             $('.jinglebellmedium').removeClass('active');
             $('#Medcount').addClass('fa fa-bell-o mymediumBell');
             $('.jinglebellhigh').removeClass('active');
             $('#Lowcount').addClass('fa fa-bell-o mylowBell');
             $('.jinglebelllow').addClass('active');
             $('#Highcount').removeClass('fa fa-bell-o myhighBell');
             $('#Highcount').addClass('fas fa-bell myhighBell');
             var x = document.getElementById("tableid");
             var i = document.getElementById("tableid_img");
             i.src = "../../Images/expand.gif"
             x.style.display = "none";
             document.getElementById('tableid_img').title = 'Click to Expand';
             $('#tableid').hide();
             $('#tableid3').hide();
             $('#tableid4').hide();
             $scope.redcount++;
 
             var HighCountVital;
             $scope.HighCountVitalList = [];
             if ($scope.redcount == 2) {
                 $scope.ParameterValueList = [];
                 $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                     $scope.ParameterValueList = data;
                 });
                 angular.forEach($scope.ParameterValueList, function (value, index) {
                     console.log(value);
                     if (value.HighCount != 0) {
                         HighCountVital = value.HighCount;
                         console.log(HighCountVital);
                         $scope.HighCountVitalList.push(value);
                     }
                 });
                 if ($scope.HighCountVitalList.length > 0) {
                     $('#tableid3').show();
                     $('#tableid1').hide();
                     $('#tableid2').hide();
                     $('#tableid5').hide();
                     $('#tableid6').hide();
                     return true;
                 } else {
                     $('#tableid3').hide();
                     $('#tableid1').hide();
                     $('#tableid2').hide();
                     $('#tableid5').hide();
                     $('#tableid6').hide();
 
                     return true;
                 }
 
             } else if ($scope.redcount == 3) {
                 $('#tableid1').hide();
                 $('#tableid5').hide();
                 $('#tableid3').hide();
                 $('#tableid4').show();
                 $('#tableid2').hide();
                 $('#tableid6').hide();
 
             } else {
 
                 //i.src = "../../Images/expand.gif"
 
                 $('#tableid3').hide();
                 $('#tableid4').hide();
                 $('.jinglebelllow').removeClass('active');
                 $('.jinglebelllow i').removeClass('fas fa-bell myhighBell');
                 $('.jinglebelllow i').addClass('fa fa-bell-o myhighBell');
                 $scope.redcount = 1;
                 //document.getElementById(tableid + '_img').title = 'Click to Expand';
                 //count = $scope.yellowcount - 3;
 
             }
             return true;
         };
 
         $scope.greencount = 1;
         $scope.AlertCountgreenDisplay = function () {
             $scope.redcount = 1;
             $scope.yellowcount = 1;
             $('.jinglebelllow').removeClass('active');
             $('#Highcount').addClass('fa fa-bell-o myhighBell');
             $('.jinglebellmedium').removeClass('active');
             $('#Medcount').addClass('fa fa-bell-o mymediumBell');
             $('.jinglebellhigh').addClass('active');
             $('#Lowcount').removeClass('fa fa-bell-o mylowBell');
             $('#Lowcount').addClass('fas fa-bell mylowBell');
             var x = document.getElementById("tableid");
             var i = document.getElementById("tableid_img");
             i.src = "../../Images/expand.gif"
             x.style.display = "none";
             document.getElementById('tableid_img').title = 'Click to Expand';
             $('#tableid').hide();
             $('#tableid5').hide();
             $('#tableid6').hide();
             $scope.greencount++;
 
             var LowCountVital;
             $scope.LowCountVitalList = [];
             if ($scope.greencount == 2) {
                 $scope.ParameterValueList = [];
                 $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                     $scope.ParameterValueList = data;
                 });
                 angular.forEach($scope.ParameterValueList, function (value, index) {
                     console.log(value);
                     if (value.LowCount != 0) {
                         LowCountVital = value.LowCount;
                         console.log(LowCountVital);
                         $scope.LowCountVitalList.push(value);
                     }
                 });
                 if ($scope.LowCountVitalList.length > 0) {
                     $('#tableid5').show();
                     $('#tableid1').hide();
                     $('#tableid4').hide();
                     $('#tableid3').hide();
                     $('#tableid2').hide();
                     $('#tableid6').hide();
                     return true;
                 } else {
                     $('#tableid5').hide();
                     $('#tableid1').hide();
                     $('#tableid4').hide();
                     $('#tableid3').hide();
                     $('#tableid2').hide();
                     $('#tableid6').hide();
                     return true;
                 }
 
             } else if ($scope.greencount == 3) {
                 $('#tableid1').hide();
                 $('#tableid4').hide();
                 $('#tableid5').hide();
                 $('#tableid6').show();
                 $('#tableid2').hide();
                 $('#tableid4').hide();
                 $('#tableid3').hide();
 
             } else {
 
                 //i.src = "../../Images/expand.gif"
 
                 $('#tableid5').hide();
                 $('#tableid6').hide();
                 $('.jinglebellhigh').removeClass('active');
                 $('.jinglebellhigh i').removeClass('fas fa-bell mylowBell');
                 $('.jinglebellhigh i').addClass('fa fa-bell-o mylowBell');
                 $scope.greencount = 1;
                 //document.getElementById(tableid + '_img').title = 'Click to Expand';
                 //count = $scope.yellowcount - 3;
 
             }
             return true;
         };*/


        $scope.Assign_CareGiver_Id = "0";
        $scope.CC_Remarks = "";
        $scope.CareGiver_Id = "0";
        $scope.ReasonTypeId = '0';
        $scope.AllPatient_CancelPopup = function () {
            //All Patients
            $location.path("/PatientAppointments");
        }
        $scope.Assign_CareGiver = function () {
            if (typeof ($scope.CareGiver_Id) == "undefined" || $scope.CareGiver_Id == "0") {
                //alert("Please select Care Giver");
                toastr.warning("Please select Care Giver", "warning");
                return false;
            }
            else {
                var obj = {
                    Id: $scope.Assign_CareGiver_Id,
                    Coordinator_Id: $scope.UserId,
                    Patient_Id: $scope.SelectedPatientId,
                    CareGiver_Id: $scope.CareGiver_Id.toString(),
                    CC_Remarks: $scope.CC_Remarks,
                    Created_By: $scope.UserId,
                    CC_Date: moment($window.localStorage['CC_Date']).format('YYYY-MM-DD HH:mm:ss'),
                    Page_Type: $scope.PageParameter == 5 ? 0 : 1,
                    Institution_Id: $window.localStorage['InstitutionId'],
                }
                $("#chatLoaderPV").show();
                $('#msg').attr("disabled", true);
                $http.post(baseUrl + '/api/CareCoordinnator/Assign_CareGiver/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 0) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 1) {
                        toastr.info(data.Message, "info");
                    }
                    $('#msg').attr("disabled", false);
                    $scope.CareGiver_Id = "0";
                    $scope.CC_Remarks = "";
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while Assigning CareGiver" + data;
                });
            }
        }
        //Care Giver Login
        $scope.CG_Remarks = "";
        $scope.CG_Update_ClearAlerts = function () {
            if (typeof ($scope.CG_Remarks) == "undefined" || $scope.CG_Remarks == "") {
                //alert("Please enter Notes / Remarks to clear alert");
                toastr.warning("Please enter Notes / Remarks to clear alert", "warning");
                return false;
            }
            else {
                var obj = {
                    Patient_Id: $scope.SelectedPatientId,
                    CareGiver_Id: $scope.UserId,
                    CG_Remarks: $scope.CG_Remarks,
                    Page_Type: $scope.PageParameter == 7 ? 0 : 1
                }
                $("#chatLoaderPV").show();
                $('#clear').attr("disabled", true);
                $http.post(baseUrl + '/api/CareGiver/CG_Update_ClearAlerts/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    if ((data == 1) || (data == 3)) {
                        //alert("Clear Alerts updated successfully");
                        toastr.success("Clear Alerts updated successfully", "success");
                        $scope.submitted = false;
                        $('#clear').attr("disabled", false);
                        $scope.CG_Remarks = "";
                        $scope.ParameterValueList = [];
                        $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=2&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            $scope.ParameterValueList = data;
                        });
                    }
                    else if (data == 2) {
                        //alert("Alert already cleared by Caregiver, cannot be cleared");
                        toastr.warning("Alert already cleared by Caregiver, cannot be cleared", "warning");
                    }
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while Update Clear Alerts" + data;
                });
            }
        }

        $scope.appointmentClear = function () {
            $scope.searchquery = '';
            $scope.Doctor_Id = '';
            $scope.AppointmentFromTime = '';
            $scope.AppointmentToTime = '';
            $scope.AppointmentDate = '';
            $scope.ReasonForVisit = '';
            $scope.ReasonTypeId = '0';
        }
        $scope.DoctorSeachPopup = function () {
            $scope.DoctorListforAppointments();
            $scope.filterDoctorList();
            angular.element('#DoctorSelectionModal').modal('show');

        }

        /* Patient Based Group Based PatientBasedGroupBasedClinicianList*/
        $scope.searchquery = '';
        $scope.DoctorsDetailsList = [];
        $scope.DoctorListforAppointments = function () {
            $http.get(baseUrl + '/api/PatientAppointments/PatientBasedGroupBasedClinicianList/?Patient_Id=' + $scope.SelectedPatientId).success(function (data) {
                $scope.DoctorsDetailsList = data;
                $scope.filterDoctorListforAppointmentCreation();
            });
        }
        $scope.Convert24to12Timeformat = function (inputTime) {
            var outputTime = null;
            if (inputTime != '' && inputTime != null) {
                inputTime = inputTime.toString(); //value to string for splitting
                var splitTime = inputTime.split(':');
                splitTime.splice(2, 1);
                var ampm = (splitTime[0] >= 12 ? ' PM' : ' AM'); //determine AM or PM
                splitTime[0] = splitTime[0] % 12;
                splitTime[0] = (splitTime[0] == 0 ? 12 : splitTime[0]); //adjust for 0 = 12
                outputTime = splitTime.join(':') + ampm;
            }
            return outputTime;
        };
        $scope.Convert12To24Timeformat = function (timeval) {
            var outputTime = null;
            if (timeval != '' && timeval != null) {
                var time = timeval;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12) hours = hours + 12;
                if (AMPM == "AM" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                outputTime = sHours + ":" + sMinutes;
            }
            return outputTime;
        };
        /* Validating the create page Appointment From Time Should not be greater than Appointment to time
       */
        $scope.PatientAppointment_InsertUpdateValidations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.AppointmentDate = moment($scope.AppointmentDate).format('DD-MMM-YYYY');

            if ($scope.Doctor_Id == "") {
                //alert("Please select Doctor");
                toastr.warning("Please select Doctor", "warning");
                return false;
            }
            else if ($scope.AppointmentDate == "") {
                //alert("Please select Appointment Date");
                toastr.warning("Please select Appointment Date", "warning");
                return false;
            }
            else if ($scope.AppointmentFromTime == "") {
                //alert("Please select Appointment From time");
                toastr.warning("Please select Appointment From time", "warning");
                return false;
            }
            else if ($scope.AppointmentToTime == "") {
                //alert("Please select Appointment To time");
                toastr.warning("Please select Appointment To time", "warning");
                return false;
            }
            else if ($scope.ReasonForVisit == "" || $scope.ReasonForVisit == undefined) {
                //alert("Please enter Reason for Visit");
                toastr.warning("Please enter Reason for Visit", "warning");
                return false;
            }
            /*else if (($scope.AppointmentToTime) < ($scope.AppointmentFromTime)) {
                alert("Appointment From Time should not be greater than Appointment To Time");
                return false;
            }*/
            else if ((ParseDate($scope.AppointmentDate) < ParseDate(today))) {
                //alert("Appointment Date Can Be Booked Only For Future");
                toastr.warning("Appointment Date Can Be Booked Only For Future", "warning");
                return false;
            }
            else if ($scope.AppointmentDate != "") {
                if (moment($scope.AppointmentDate + " " + $scope.AppointmentFromTime) > moment($scope.AppointmentDate + " " + $scope.AppointmentToTime)) {
                    //alert("Appointment From Time should not be greater than Appointment To Time");
                    toastr.warning("Appointment From Time should not be greater than Appointment To Time", "warning");
                    $scope.AppointmentDate = DateFormatEdit($scope.AppointmentDate);
                    return false;
                }
            }
            else if (moment().diff(moment($scope.AppointmentDate + " " + $scope.AppointmentFromTime), 'minute') > 0) {
                //alert("Appointment can be booked only for future");
                toastr.warning("Appointment can be booked only for future", "warning");
                return false;
            }
            $scope.AppointmentDate = DateFormatEdit($scope.AppointmentDate);
            return true;
        };
        $scope.Institution_Id = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.PatientAppointment_InsertUpdate = function (SelectedDoctor_Id) {

            if ($scope.PatientAppointment_InsertUpdateValidations() == true) {
                var obj = {
                    Institution_Id: $scope.Institution_Id,
                    Doctor_Id: $scope.Doctor_Id,
                    Patient_Id: $scope.SelectedPatientId,
                    Appointment_Date: moment($scope.AppointmentDate).format('DD-MMM-YYYY'),
                    AppointmentFromTime: $scope.AppointmentFromTime == '' ? null : $scope.Convert12To24Timeformat($scope.AppointmentFromTime),
                    AppointmentToTime: $scope.AppointmentToTime == '' ? null : $scope.Convert12To24Timeformat($scope.AppointmentToTime),
                    Appointment_Type: 1,
                    ReasonForVisit: $scope.ReasonForVisit == null ? '' : $scope.ReasonForVisit,
                    //Remarks:'Heavy Headache',
                    Status: 1,
                    Created_By: $window.localStorage['UserId'],
                    Page_Type: $scope.PageParameter == 7 ? 0 : 1
                }
                $("#chatLoaderPV").show();
                $http.post(baseUrl + '/api/PatientAppointments/PatientAppointment_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.getMyAppointments();
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    $scope.appointmentClear();
                    $scope.MyAppointments();
                })
            }
        }

        $scope.DoctorCollectionFilter = [];
        $scope.searchquery = "";
        $scope.filterDoctorListforAppointmentCreation = function () {
            $scope.DoctorCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == '') {
                if ($scope.DoctorsDetailsList.length > 0) {
                    $scope.DoctorCollectionFilter = angular.copy($scope.DoctorsDetailsList);
                }
            }
            else {
                $scope.DoctorCollectionFilter = $ff($scope.DoctorsDetailsList, function (value) {
                    return angular.lowercase(value.DoctorName).match(searchstring) ||
                        angular.lowercase(value.Doctor_DepartmentName).match(searchstring)
                });
            }
        }

        $scope.DoctorSelection = function (rowDoctor) {
            $scope.searchquery = rowDoctor.DoctorName;
            $scope.Doctor_Id = rowDoctor.Doctor_Id
            angular.element('#DoctorSelectionModal').modal('hide');
        }

        $scope.CancelDoctorSelectionModalPopup = function () {
            angular.element('#DoctorSelectionModal').modal('hide');
        }
        /* Open doctor appointment history popup*/
        $scope.DoctorAppoinmentModal = function () {
            $scope.DoctorAppoinmentList();
            angular.element('#DoctorAppoinmentModal').modal('show');
        }
        /* Cancel doctor appointment history popup*/
        $scope.CancelDoctorAppoinmentModal = function () {
            angular.element('#DoctorAppoinmentModal').modal('hide');
        }

        $scope.DoctorAppointmentsearchquery = "";
        $scope.filterDoctorList = function () {
            $scope.DoctorAppoinmentFilter = [];
            // $scope.DoctorAppoinmentFilter = [];
            var searchstring = angular.lowercase($scope.DoctorAppointmentsearchquery);
            if ($scope.searchstring == "") {
                $scope.DoctorAppoinmentFilter = [];
                $scope.DoctorAppoinmentFilter = angular.copy($scope.DoctorAppoinmentdata);
            }
            else {
                $scope.DoctorAppoinmentFilter = $ff($scope.DoctorAppoinmentdata, function (value) {
                    return angular.lowercase(($filter('date')(value.Appointment_Date, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.DoctorName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Appointment_FromTime, "hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Appointment_ToTime, "hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.Created_By_Name).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.ReasonForVisit).match(searchstring) ||
                        angular.lowercase(value.ReasonType).match(searchstring) ||
                        angular.lowercase(value.PatientName).match(searchstring);
                });
            }
        }

        /* doctor appoinment list function.*/
        $scope.DoctorAppoinmentdata = [];
        $scope.DoctorAppoinmentemptydata = [];
        $scope.DoctorAppoinmentFilter = [];
        $scope.Appointmentflag = 0;

        $scope.DoctorAppoinmentList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/DoctorAppoinmentHistoryList/?PatientId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.DoctorAppoinmentemptydata = data;
                $scope.DoctorAppoinmentdata = data;
                $scope.DoctorAppoinmentFilter = angular.copy($scope.DoctorAppoinmentdata);
                if ($scope.DoctorAppoinmentFilter.length > 0) {
                    $scope.Appointmentflag = 1;
                }
                else {
                    $scope.Appointmentflag = 0;
                }
            });

        }


        /* Care Co-ordinator popup function*/
        $scope.CareCoordinatorModal = function () {
            $scope.CareCoordinatorList();
            angular.element('#CareCoordinatorModal').modal('show');
        }

        $scope.CancelCareCoordinatorModal = function () {
            angular.element('#CareCoordinatorModal').modal('hide');
        }

        /* FILTER THE MASTER LIST FUNCTION.*/

        $scope.CareCoordinatorsearchquery = "";
        $scope.filterCareCoordinatorList = function () {
            $scope.CareCoordinatorFilter = [];
            var searchstring = angular.lowercase($scope.CareCoordinatorsearchquery);
            if ($scope.searchstring == "") {
                $scope.CareCoordinatorFilter = angular.copy($scope.CareCoordinatordata);
            }
            else {
                $scope.CareCoordinatorFilter = $ff($scope.CareCoordinatordata, function (value) {
                    return angular.lowercase(value.Coordinator).match(searchstring) ||
                        angular.lowercase(value.CareGiver).match(searchstring) ||
                        angular.lowercase(value.CC_Remarks).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
            }
        }


        /* Filter the Co-ordinator list function.*/
        $scope.CareCoordinatordata = [];
        $scope.CareCoordinatoremptydata = [];
        $scope.CareCoordinatorFilter = [];
        $scope.flag = 0;

        $scope.CareCoordinatorList = function () {
            $http.get(baseUrl + '/api/CareCoordinnator/Care_Coordinatorhistory/?CareGiverId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.CareCoordinatoremptydata = data;
                $scope.CareCoordinatordata = data;
                $scope.CareCoordinatorFilter = angular.copy($scope.CareCoordinatordata);
                if ($scope.CareCoordinatorFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                $scope.SearchMsg = "No Data Available";
            });

        }

        $scope.CancelAlertHistorypopup = function () {
            angular.element('#ViewClearAlertsHistoryModal').modal('hide');
        }

        // cancel function in pop up menu
        $scope.CancelPopup = function () {
            angular.element('#ViewClearAlertsHistoryModal').modal('hide')
        }


        $scope.ViewClearAlertHistoryPopup = function (ViewAlert) {
            $scope.AlertsClear();
            $scope.SelectedPatientIdvalue = ViewAlert;
            $scope.ViewAlertHistory();
            $scope.FilterViewData = [];

            angular.element('#ViewClearAlertsHistoryModal').modal('show');
        };

        $scope.SelectedPatientIdvalue = [];
        $scope.ViewData = [];

        $scope.FilterViewData = [];

        //View for Clear alerts history

        $scope.ViewAlertHistory = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/CareGiver/AlertHistory_View/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.FilterView = [];
                $scope.FilterView = data
                $scope.ViewData = data;
                //$scope.FilterView=data;


            }).error(function (data) {

                $scope.error = "An error has occcurred " + data.ExceptionMessage;
            });
        }

        $scope.AlertsClear = function () {
            $scope.CareGiverIdvalue = "";
            $scope.SelectedPatientIdvalue = "";
            $scope.alerts = "";
            $scope.createddate = "";
        }

        //Search filter for clear alert history view
        $scope.searchqueryval = "";
        $scope.filterViewAlertHistory = function () {
            $scope.ResultViewFiltered = [];
            var searchstring = angular.lowercase($scope.searchqueryval);
            if ($scope.searchqueryval == "") {
                $scope.FilterViewData = angular.copy($scope.ViewData);

            }
            else {
                $scope.FilterViewData = $ff($scope.ViewData, function (value) {
                    return angular.lowercase(value.CaregiverName).match(searchstring) ||
                        angular.lowercase(value.CC_Remarks).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);

                });
            }
        }

        /***Monitoring Protocol Search dropdown list based Institution_Id***/
        $scope.MonitoringProtocolList = function () {
            //UserTypeId ==4||UserTypeId==7
            $scope.MonitoringProtocol_List = [];
            if ($scope.UserTypeId == "4" || $scope.UserTypeId == "7") {
                $http.get(baseUrl + '/api/Protocol/StandardProtocol_List/?IsActive=1&InstitutionId=' + $scope.Institution_Id).success(function (data) {
                    $scope.MonitoringProtocolListTemp = [];
                    $scope.MonitoringProtocolListTemp = data;
                    var obj = { "Id": "", "ProtocolName": "No protocol assigned", "IsActive": 1 };
                    $scope.MonitoringProtocolListTemp.splice(0, 0, obj);
                    $scope.MonitoringProtocol_List = angular.copy($scope.MonitoringProtocolListTemp);
                    if ($scope.assignedProtocolId != "") {
                        $scope.Monitoring_ProtocolId = $scope.assignedProtocolId;
                    }
                });
            }

        }

        /** Insert and Update Patient Assigned monitoring protocol controller functions */
        $scope.AssignedProtocol_InsertUpdate = function (Monitoring_ProtocolId) {
            if ($scope.assignedProtocolId == $scope.Monitoring_ProtocolId) {
                //alert('This protocol is already assigned to this patient');
                toastr.info("This protocol is already assigned to this patient");
                return false;
            }
            var del = true;
            if ($scope.Monitoring_ProtocolId == 0) {
                del = confirm('Are you sure to Remove Protocol to this patient?');
            }
            if (del == true) {
                $("#chatLoaderPV").show();
                var prtobj = {
                    PatientId: $scope.SelectedPatientId,
                    Protocol_Id: $scope.Monitoring_ProtocolId == 0 ? '' : $scope.Monitoring_ProtocolId,
                    Created_By: $window.localStorage['UserId']
                };
                $('#save').attr("disabled", true);
                $http.post(baseUrl + '/api/User/PatientAssignedProtocol_InsertUpdate', prtobj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.assignedProtocolId = $scope.Monitoring_ProtocolId;
                    //alert('Protocol updated successfully')
                    toastr.success('Protocol updated successfully', "success");
                    $('#save').attr("disabled", false);
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while assigning Protocol " + data;
                    alert($scope.error);
                });
            }
        }


        /* This is for MonitoringHistoryListPopUP */
        $scope.MonitoringHistoryListPopUP = function () {
            $scope.MonitoringProtocolHistoryList();
            angular.element('#MonitoringProtocolHistoryPopup').modal('show');
        }


        /* This is for MonitoringProtocolHistoryListData */
        $scope.PatientAssignedProtocolDataList = [];
        $scope.MonitoringProtocolHistoryListData = [];
        $scope.MonitoringProtocolHistoryList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/User/ProtocolHistorylist/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.MonitoringProtocolEmptyData = [];
                $scope.MonitoringProtocolHistoryListData = [];
                $scope.MonitoringProtocolHistoryListData = data;
                $scope.PatientAssignedProtocolDataList = angular.copy($scope.MonitoringProtocolHistoryListData);
                if ($scope.PatientAssignedProtocolDataList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }

            })
        }

        $scope.searchquery = "";
        $scope.filterassignedProtocolList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.PatientAssignedProtocolDataList = [];
                $scope.PatientAssignedProtocolDataList = angular.copy($scope.MonitoringProtocolHistoryListData);
            }
            else {
                var val;
                $scope.PatientAssignedProtocolDataList = $ff($scope.MonitoringProtocolHistoryListData, function (value) {
                    if (value.ProtocolName == null) {
                        val = "";
                    }
                    else {
                        val = value.ProtocolName;
                    }
                    return angular.lowercase(val).match(searchstring) ||
                        angular.lowercase(value.Doctor_Name).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Protocol_Assigned_On, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
            }
        }

        /* This is for MonitoringProtocolHistoryListCancelPopUp */
        $scope.MonitoringProtocolHistoryListCancelPopUp = function () {
            angular.element('#MonitoringProtocolHistoryPopup').modal('hide');
        }

        //For ICD10
        $scope.ICDTabCount = 1;
        /* This is for AddNewpopup function from List  window page */
        $scope.AddPatientICD10Popup = function () {
            $scope.Id = 0;
            $scope.Icd10AddnewClear();

            $('#buttonsave').attr("disabled", false);
            //$scope.ICD10CategoryClearFunction();
            $scope.Icd10Clear();
            angular.element('#CreateICDModal').modal('show');
             $scope.ICD10codeSearchPopup(0);

            setTimeout(function () {
                $scope.calenderSet($scope.AddICD10List.length);
            }, 1000);

        }

        /* This is for Cancel  function from View Popup window page */
        $scope.CancelViewICD10Popup = function () {
            angular.element('#ViewICD10modal').modal('hide');
        }

        /* This is for Cancel  function for  edit Popup window page */
        $scope.CancelEditICD10Popup = function () {
            angular.element('#EditICD10Modal').modal('hide');
        }

        /* This is for Cancel function from Addnew Popup window page */
        $scope.CancelAddICD10Popup = function () {
            angular.element('#CreateICDModal').modal('hide');
        }

        /* This is for View Popup function from List  window page */
        $scope.ViewPatientICD10 = function (CatId, editval) {

            if (editval == 2) {
                $scope.Id = CatId;
                $scope.PatientICD10Details_View();
                angular.element('#ViewICD10modal').modal('show');
            }
        };

        /* This is for Edit Popup function from List  window page */
        $scope.EditPatientICD10 = function (CatId, createdDt, editval) {
            $('#buttonsave1').attr("disabled", false);
            /*if ($scope.IsEditableCheck(createdDt) == false) {
                //alert("ICD10 Cannot be edited");
                toastr.info("ICD10 Cannot be edited", "info");
            }
            else {*/
            $scope.Icd10AddnewClear();
            $scope.Icd10Clear();
            $scope.Id = CatId;
            $scope.PatientICD10Details_View();
            angular.element('#EditICD10Modal').modal('show');
            //}
        };

        /* This is for Patient ICD10 Details Delete function*/
        $scope.DeletePatientICD10 = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10_Delete();
        };
        $scope.Category_ID = "0";
        $scope.AddICD10List = [];
        $scope.CategoryIDList = [];
        $scope.ICDCodeList = [];
        $scope.rowcollectionfiltericd10 = [];

        /* This is for intilize Addrow Columns scope values */
        $scope.AddICD10List = [{
            'Id': 0,
            'Category_ID': 0,
            'Category_Name': '',
            'Code_ID': '0',
            'ICDCode': '',
            'ICD_Description': '',
            'ICD_Remarks': '',
            'Active_From': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
            'Active_To': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'))

        }];


        $scope.Icd10AddnewClear = function () {
            $scope.AddICD10List = [{
                'Id': 0,
                'Category_ID': 0,
                'Category_Name': '',
                'Code_ID': '0',
                'ICDCode': '',
                'ICD_Description': '',
                'ICD_Remarks': '',
                'Active_From': '',
                'Active_To': ''

            }];

        }



        /**ICD10_CATEGORY_LIST function**/

        //$http.get(baseUrl + '/api/User/ICD10_CategoryList/').success(function (data) {        
        //});

        /* This is for to add new Add row  function  */
        $scope.PatientICD10Insert = function () {
            if ($scope.AddICD10List.length > 0) {
                var obj = {
                    'Id': 0,
                    'Category_ID': "0",
                    'Category_Name': '',
                    'Code_ID': '0',
                    'ICDCode': '',
                    'ICD_Description': '',
                    'ICD_Remarks': '',
                    'Active_From': '',
                    'Active_To': ''
                }
                $scope.AddICD10List.push(obj);
            }
            else {
                $scope.AddICD10List = [{
                    'Id': 0,
                    'Category_ID': '0',
                    'Category_Name': '',
                    'Code_ID': '0',
                    'ICDCode': '',
                    'ICD_Description': '',
                    'ICD_Remarks': '',
                    'Active_From': '',
                    'Active_To': ''
                }];
            }
            $scope.ICD10codeSearchPopup($scope.AddICD10List.length - 1);

            setTimeout(function () {
                $scope.calenderSet($scope.AddICD10List.length);
            }, 1000);

        }
        $scope.calenderSet = function (idxval) {


            $("#DivICDFrom" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });

            $("#DivICDTo" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });
        }

        /* This is for delete row  function  */
        $scope.ICD10Delete = function (itemIndex) {
            Swal.fire({
                title: 'Do you like to delete the selected ICD10 Details?',
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
                    //    var del = confirm("Do you like to delete the selected ICD10 Details?");
                    //    if (del == true) {
                    $scope.$apply(() => {
                        $scope.AddICD10List.splice(itemIndex, 1);
                        if ($scope.AddICD10List.length == 0) {
                            $scope.AddICD10List = [{
                                'Id': 0,
                                'Category_ID': 0,
                                'Category_Name': '',
                                'Code_ID': '0',
                                'ICDCode': '',
                                'ICD_Description': '',
                                'ICD_Remarks': '',
                                'Active_From': '',
                                'Active_To': ''
                            }];

                        }
                    });
                    //  }
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })

        }

        /* This is for PatientICD10 Insert and update Validations */
        $scope.PatientICD10_InsertUpdateValidations = function () {

            var validateflag = true;
            var validationMsg = "";
            var Active_From = "";
            var Active_To = "";

            angular.forEach($scope.AddICD10List, function (value, index) {
                if (value.Active_From != false && value.Active_From != null && value.Active_To != false && value.Active_To != null) {
                    value.Active_From = moment(value.Active_From).format('DD-MMM-YYYY');
                    Active_From = moment(value.Active_From).format('DD-MMM-YYYY');
                    value.Active_To = moment(value.Active_To).format('DD-MMM-YYYY');
                    Active_To = moment(value.Active_To).format('DD-MMM-YYYY');
                    value.Active_From = DateFormatEdit(value.Active_From);
                    value.Active_To = DateFormatEdit(value.Active_To);
                }
                if (value.Active_To == false || value.Active_To == null || value.Active_To == undefined) {
                    value.Active_To = "";
                }
                if ((value.Active_From) == "") {
                    validationMsg = validationMsg + "Please select Active From Date";
                    validateflag = false;
                    return false;
                }
                /*if ((value.Active_To) == "") {
                    validationMsg = validationMsg + "Please select Active To Date";
                    validateflag = false;
                    return false;
                }*/
                if ((value.Active_From !== null) && (value.Active_To !== null)) {
                    if ((ParseDate(value.Active_To) < ParseDate(value.Active_From))) {
                        validationMsg = validationMsg + "Active From Date should not be greater than Active To Date";
                        value.Active_From = DateFormatEdit(value.Active_From);
                        value.Active_To = DateFormatEdit(value.Active_To);
                        validateflag = false;
                        return false;
                    }
                }

                //value.Active_From = DateFormatEdit(value.Active_From);
                //value.Active_To = DateFormatEdit(value.Active_To);

            });

            var TSDuplicate = 0;
            var Duplicateparameter = '';
            angular.forEach($scope.AddICD10List, function (value1, index1) {
                angular.forEach($scope.AddICD10List, function (value2, index2) {
                    if (index1 > index2 && value1.Category_ID == value2.Category_ID && value1.Code_ID == value2.Code_ID) {
                        TSDuplicate = 1;
                        Duplicateparameter = Duplicateparameter + value2.Category_Name + ',';
                    };
                });
            });
            if (TSDuplicate == 1) {
                //alert('Category Name' + Duplicateparameter + ' already exist, cannot be Duplicated');
                toastr.error('Category Name' + Duplicateparameter + ' already exist, cannot be Duplicated', "warning");
                return false;
            }

            if (validateflag == false) {
                //alert(validationMsg);
                toastr.warning(validationMsg, "warning");
                return false;
            }

            return true;
        }


        /* This is for Patient ICD10 Insert and Update function  */
        $scope.AddICD10List = [];
        $scope.Id = 0;
        $scope.PatientICD10_InsertUpdate = function () {
            if ($scope.PatientICD10_InsertUpdateValidations() == true) {
                $('#buttonsave').attr("disabled", true);
                $('#buttonsave1').attr("disabled", true);
                $scope.insertcount = 0;
                $scope.ICD10GroupList = [];
                $("#chatLoaderPV").show();
                angular.forEach($scope.AddICD10List, function (value, index) {
                    var obj = {
                        Id: $scope.Id,
                        Code_ID: value.Code_ID,
                        Remarks: value.ICD_Remarks,
                        Patient_Id: $scope.SelectedPatientId,
                        Active_From: $filter('date')(value.Active_From, "dd-MMM-yyyy"),
                        Active_To: $filter('date')(value.Active_To, "dd-MMM-yyyy"),
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                        InstitutionId: $window.localStorage['InstitutionId']
                    }
                    $scope.ICD10GroupList.push(obj);
                })

                $http.post(baseUrl + '/api/User/Patient_ICD10Details_AddEdit/?Login_Session_Id=' + $scope.LoginSessionId, $scope.ICD10GroupList).success(function (data) {
                    //$scope.insertcount = $scope.insertcount+1;                
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 1) {
                        toastr.info(data.Message, "info");
                    }
                    $('#buttonsave').attr("disabled", false);
                    $('#buttonsave1').attr("disabled", false);
                    if (data.ReturnFlag == "2") {
                        $scope.CancelAddICD10Popup();
                        $scope.CancelEditICD10Popup();
                        $scope.PatientICD10List();
                    }
                });
            }
        }


        $scope.ActiveStatus = 1;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.ICDListpageTabCount = 1;
        $scope.ICD10TabLoadList = function () {
            $('.chartTabs').addClass('charTabsNone');
            if ($scope.ICDListpageTabCount == 1) {
                $scope.PatientICD10List();
            }
            $scope.ICDListpageTabCount = $scope.ICDListpageTabCount + 1;
        }

        $scope.setPage2 = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageICD;
            }
            else {
                $scope.inputPageICD = PageNo;
            }
            $scope.current_pageICD = PageNo;
            $scope.PatientICD10List();

        }

        /* Patient ICD10 Details list function*/
        $scope.ICDListTabCount = 1;
        $scope.PatientICD10List = function () {
            $scope.ICD10_flag = 0;
            $scope.DiagnosisICD10List = [];
            $scope.rowcollectionfiltericd10 = [];
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_pageICD - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_pageICD * $scope.page_size;
                $scope.ISact = 1;
                if ($scope.allergyActive == true) {
                    $scope.ISact = 1
                }
                else if ($scope.allergyActive == false) {
                    $scope.ISact = -1
                }
                $("#chatLoaderPV").show();
                $scope.SearchMsg = "No Data Available"
                $http.get(baseUrl + 'api/User/PatientICD10_Details_List/?Patient_Id=' + $scope.SelectedPatientId + '&Isactive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart +
                    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.DiagnosisICD10List = [];
                        $scope.DiagnosisICD10List = data.MasterICD;
                        if ($scope.DiagnosisICD10List.length > 0) {
                            $scope.ICD10Count = $scope.DiagnosisICD10List[0].TotalRecord;
                        } else {
                            $scope.ICD10Count = 0
                        }
                        $scope.rowcollectionfiltericd10 = angular.copy($scope.DiagnosisICD10List);
                        if ($scope.rowcollectionfiltericd10.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        $scope.PatientIcdPages = Math.ceil(($scope.ICD10Count) / ($scope.page_size));
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "the error occured! " + data;
                    })
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
            $scope.SearchMsg = "No Data Available";
        }


        /* FILTER THE  LIST FUNCTION.*/
        $scope.searchquerydata = "";
        $scope.rowcollectionfiltericd10emptyData = [];
        $scope.filterICD10List = function () {
            $scope.ResultListFiltered = [];
            $scope.rowcollectionfiltericd10emptyData = [];
            var searchstring = angular.lowercase($scope.searchquerydata);
            if ($scope.searchquerydata == "") {
                $scope.rowcollectionfiltericd10 = [];
                $scope.rowcollectionfiltericd10 = angular.copy($scope.DiagnosisICD10List);
            }
            else {
                $scope.rowcollectionfiltericd10 = $ff($scope.DiagnosisICD10List, function (value) {
                    return angular.lowercase(value.CategoryName).match(searchstring) ||
                        angular.lowercase(value.ICD_Code).match(searchstring) ||
                        angular.lowercase(value.Description).match(searchstring) ||
                        angular.lowercase(value.Doctor_Name).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Active_From, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Active_To, "dd-MMM-yyyy")).match(searchstring);
                });
                $scope.PatientIcdPages = Math.ceil(($scope.rowcollectionfiltericd10) / ($scope.page_size));
            }
        }


        /* Patient ICD10 Details View function*/
        $scope.PatientICD10Details_View = function () {
            $scope.AddICD10List = [];
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/PatientICD10_Details_View/?ID=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.AddICD10List = [{
                    'Id': data.Id,
                    'Category_ID': data.Category_ID == null ? 0 : data.Category_ID.toString(),
                    'Category_Name': data.CategoryName,
                    'Code_ID': data.Code_ID.toString(),
                    'ICD_Code': data.ICD_Code,
                    'ICD_Description': data.Description,
                    'Created_By': data.Doctor_Name,
                    'Active_From': DateFormatEdit(moment(data.Active_From).format('DD-MMM-YYYY')),
                    'Active_To': DateFormatEdit(moment(data.Active_To).format('DD-MMM-YYYY')),
                    'ICD_Remarks': data.Remarks
                }];

                $scope.Id = data.Id;
                $scope.Category_ID = data.Category_ID;
                $scope.Code_ID = data.Code_ID;
                $scope.CategoryName = data.CategoryName;
                $scope.ICD_Code = data.ICD_Code;
                $scope.ICD_Description = data.Description;
                $scope.Created_By = data.Doctor_Name;
                $scope.Active_From = DateFormatEdit(moment(data.Active_From).format('DD-MMM-YYYY'));
                $scope.Active_To = DateFormatEdit(moment(data.Active_To).format('DD-MMM-YYYY'));
                $scope.ICD_Remarks = data.Remarks;
                //$scope.Icd10Clear();
                // $scope.ICD10CodeByCategory($scope.Category_ID);
            });
        }


        $scope.Defaultcategory = function () {
            $scope.Category_ID = $scope.Category_ID;
        }

        $scope.Icd10Clear = function () {
            $scope.Id = 0,
                $scope.Category_ID = 0,
                $scope.ICD_Description = "",
                $scope.ICDCode = "",
                $scope.Category_Name = "",
                $scope.Active_From = "",
                $scope.Active_To = "",
                $scope.Code_ID = "",
                $scope.ICD10CodeList = [];
            $scope.ICD10CodeListsFilter = [];
            $scope.selectedICD10Row = "";

            $scope.Active_From = new Date(DatetimepickermaxDate);
            $scope.Active_To = new Date(DatetimepickermaxDate);
        }

        /*THIS IS FOR DELETE FUNCTION */
        $scope.ViewICD10_Delete = function () {

            var del = confirm("Do you like to deactivate the selected ICD 10 details?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/PatientICD10_Details_InActive/?ID=' + $scope.Id).success(function (data) {
                    //alert(" ICD10 details has been deactivated Successfully");
                    toastr.success("ICD10 details has been deactivated Successfully", "success");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                });
            }
        };

        /* Patient ICD10 Details Active function*/
        $scope.ActiveICD10 = function (PId) {
            $scope.Id = PId;
            $scope.ICDMaster_Active();
        };

        $scope.PatientICD10_Active = function () {

            var Ins = confirm("Do you like to activate the selected ICD10 details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/User/PatientICD10_Details_Active/?ID=' + $scope.Id).success(function (data) {
                    //alert("Selected ICD 10 details has been activated successfully");
                    toastr.success("Selected ICD 10 details has been activated successfully", "success");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting ICD1O records" + data;
                });
            }
        };
        /***To get ICD10Code Search filter List Function**/
        $scope.ICD10CodeSearch = "";
        $scope.ICD10CodeList = [];
        $scope.ICD10CodeListsFilter = [];
        $scope.selectedICD10Row = 0;

        $scope.ICD10codesearchkey = function (Selectedrow) {
            var SearchICD10Code = angular.lowercase($scope.ICD10CodeSearch);

            if (SearchICD10Code.length >= 3) {
                $http.get(baseUrl + 'api/User/ICD10Code_List/?ICD10CodeSearch=' + SearchICD10Code + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                    SearchMsg = "No Data Available";
                    $scope.ICD10CodeList = [];
                    $scope.ICD10CodeListsFilter = [];
                    $scope.ICD10CodeList = data;
                    $scope.ICD10CodeListsFilter = angular.copy($scope.ICD10CodeList);
                    if ($scope.ICD10CodeListsFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                });
            }
                 else {
                    $scope.ICD10CodeList = [];
                    $scope.ICD10CodeListsFilter = [];
                }
                angular.element('#ICD10CodeListModal').modal('show');

        }

        /**ICD10 Code Search button Click Popup window**/
        $scope.ICD10codeSearchPopup = function (SelectedRow) {
            $scope.ICD10CodeSearch = "";
            $scope.ICD10CodeListsFilter = [];
            $scope.selectedICD10Row = SelectedRow;
            angular.element('#ICD10CodeListModal').modal('show');
            $("#txtICD10CodeSearch").focus();
        }
        /**ICD10 Code Select button Click Popup window**/
        $scope.ICD10CodeSelect = function (ICD10codeItem) {
            angular.forEach($scope.AddICD10List, function (value, index) {

                if (index == $scope.selectedICD10Row) {
                    value.Code_ID = ICD10codeItem.Id;
                    value.ICD_Code = ICD10codeItem.ICD_Code;
                    value.CategoryName = ICD10codeItem.CategoryName;
                    value.Description = ICD10codeItem.Description;
                }
            });
            if ($scope.Id > 0) {
                angular.forEach($scope.AddICD10List, function (value, index) {
                    $scope.Description = value.Description;
                    $scope.CategoryName = value.CategoryName;
                });
            }
            angular.element('#ICD10CodeListModal').modal('hide');
        }

        /**ICD10 Code Cancel Popup window**/
        $scope.ICD10codeSearchCancelPopup = function () {
            angular.element('#ICD10CodeListModal').modal('hide');
        }

        $scope.InActiveICDPatient = function (comId) {
            $scope.Id = comId;
            $scope.ICD10Details_Delete();
        };
        $scope.ICD10Details_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected ICD10 Details?',
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
                    $http.get(baseUrl + '/api/User/PatientICD10Details_InActive/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected ICD10 Details has been deactivated Successfully");
                        toastr.success("Selected ICD10 Details has been deactivated Successfully", "success");
                        $scope.PatientICD10List();
                    }).error(function (data) {
                        $scope.error = "AN error has occured while deleting ICD10 Details!" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected ICD10 Details?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/PatientICD10Details_InActive/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected ICD10 Details has been deactivated Successfully");
                    toastr.success("Selected ICD10 Details has been deactivated Successfully", "success");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting ICD10 Details!" + data;
                });
            };*/
        };

        /*'Active' the ICD10Details*/
        $scope.ActiveICDPatient = function (comId) {
            $scope.Id = comId;
            $scope.ICD10Details();

        };

        /* 
        Calling the api method to inactived the details of the ICD10Details 
        for the  ICD10Details Id,
        and redirected to the list page.
        */
        $scope.ICD10Details = function () {
            Swal.fire({
                title: 'Do you like to activate the selected ICD10 Details?',
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
                    $http.get(baseUrl + '/api/User/PatientICD10Details_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected ICD10 Details has been activated successfully");
                        toastr.success("Selected ICD10 Details has been activated successfully", "success");
                        $scope.PatientICD10List();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ICD10 Details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var Ins = confirm("Do you like to activate the selected ICD10 Details?");
             if (Ins == true) {
                 $http.get(baseUrl + '/api/User/PatientICD10Details_Active/?Id=' + $scope.Id).success(function (data) {
                     //alert("Selected ICD10 Details has been activated successfully");
                     toastr.success("Selected ICD10 Details has been activated successfully", "success");
                     $scope.PatientICD10List();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while ICD10 Details" + data;
                 });
             };*/
        }

        //  This is for  Patient Medication function	
        // This is for AddPopup	
        $scope.MedicationTabCount = 1;
        $scope.AddMedicationPopUp = function () {
            $scope.PatientMedicationCreateModalClear();
            
            if ($scope.MedicationTabCount == 1) {
                $scope.DropLoadMedication();
                $scope.MedicationTabCount = $scope.MedicationTabCount + 1;
            }
            $('#save1').attr("disabled", false);
            $scope.DrugbasedDetails($scope.DrugId, 0);
            angular.element('#PatientMedicationCreateModal').modal('show');
            $scope.DrugcodeSearchPopup(0);
            setTimeout(function () {
                $scope.calenderSet1($scope.AddMedicationDetails.length);
            }, 1000);

        }
        $scope.CancelMedicationPopUp = function () {
            angular.element('#PatientMedicationCreateModal').modal('hide');
        }
        $scope.DrugDropDown = 2;
        //This is for viewpopup	
        $scope.MedicationViewPopup = function (MedicationViewId, editval) {
            if (editval == 2) {
                $scope.Id = MedicationViewId;
                $scope.PatientMedicationView();
                $scope.DrugDropDown = 1;
                $scope.PatientMedicationCreateModalClear();
               
                angular.element('#ViewMedicationPopModal').modal('show');
            }
        }
        $scope.CancelViewPopup = function () {
            $scope.PatientMedicationCreateModalClear();
            angular.element('#ViewMedicationPopModal').modal('hide');
        }
        //This is for Editpopup	
        $scope.EditMedication = function (MedicationViewId, createdDt, editval) {
            $('#save1').attr("disabled", false);
            /*if ($scope.IsEditableCheck(createdDt) == false) {
                //alert("Medication Cannot be edited");
                toastr.info("Medication Cannot be edited", "info");
            }
            else { */
            if (editval == 3) {
                if ($scope.MedicationTabCount == 1) {
                    $scope.DropLoadMedication();
                    $scope.MedicationTabCount = $scope.MedicationTabCount + 1;
                }
                // $scope.medId=MedicationViewId;	
                $scope.Id = MedicationViewId;
                
                $scope.DrugDropDown = 2;
                $scope.PatientMedicationCreateModalClear();
                $scope.PatientMedicationView();
                angular.element('#PatientMedicationEditModal').modal('show');
            }
            //}
        }
        $scope.CancelEditPopUp = function () {
            $scope.PatientMedicationCreateModalClear();
            angular.element('#PatientMedicationEditModal').modal('hide');
        }

        $scope.MedicationListTabCount = 1;
        $scope.MedicationTabLoadList = function () {
            $('.chartTabs').addClass('charTabsNone');
            if ($scope.MedicationListTabCount == 1) {
                $scope.PatientMedicationList();
            }
            $scope.MedicationListTabCount = $scope.MedicationListTabCount + 1;
        }
        $scope.FrequencyDuplicateId = "0";
        $scope.RouteDuplicateId = "0";
        $scope.DropLoadMedication = function () {
            if ($scope.UserTypeId == 4 || $scope.UserTypeId == 5 || $scope.UserTypeId == 7) {
                // This is for DropDown list	
                $scope.DrugIds = "0";
                $scope.DrugId = "0";
                $scope.RouteId = "0";
                FrequencyId = "0";
                $scope.DrugbasedDetails = function (DrugId, $index) {
                    $scope.DrugId = DrugId;
                    $http.get(baseUrl + '/api/User/DrugCodeBased_DrugDetails/?DrugCodeId=' + $scope.DrugId + '&Institution_Id=' + $scope.Institution_Id).success(function (data) {
                        angular.forEach($scope.AddMedicationDetails, function (value1, index1) {
                            angular.forEach(data, function (value, index) {
                                if (value1.DrugId == value.DrugId) {
                                    value1.GenericName = value.Generic_name;
                                    value1.StrengthName = value.StrengthName;
                                    value1.Dosage_FromName = value.Dosage_FromName;
                                    value1.Item_Code = value.Item_Code;
                                }
                            });
                        });
                    });
                }
                $scope.DrugbasedDetailsClearFunction = function () {
                    $scope.DrugCodeId = "0";
                }
                $scope.RouteList = [];
                $http.get(baseUrl + 'api/User/RouteList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                    $scope.RouteListTemp = [];
                    $scope.RouteListTemp = data;
                    var obj = { "Id": 0, "RouteName": "Select", "IsActive": 1 };
                    $scope.RouteListTemp.splice(0, 0, obj);
                    $scope.RouteList = angular.copy($scope.RouteListTemp);
                })
                $scope.FrequencyList = [];
                $http.get(baseUrl + 'api/User/FrequencyList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                    $scope.FrequencyListTemp = [];
                    $scope.FrequencyListTemp = data;
                    var obj = { "Id": 0, "FrequencyName": "Select", "IsActive": 1 };
                    $scope.FrequencyListTemp.splice(0, 0, obj);
                    $scope.FrequencyList = angular.copy($scope.FrequencyListTemp);
                })
                $scope.FrequencybasedDetailslist = function (row) {
                    $scope.FrequencyId = row.FrequencyId;
                    $http.get(baseUrl + '/api/User/FrequencybasedDetails/?FrequencyId=' + $scope.FrequencyId).success(function (data) {
                        row.NoOfDays = data.NoOfDays;
                        $scope.NoOfDays = data.NoOfDays;
                    });
                }
            }
        }
        $scope.NumberOfDays = function (NoOfDays, rowItem, EndDate) {
            $scope.sDate = moment($scope.StartDate).format('DD-MMM-YYYY');
            $scope.EndDate = moment($scope.sDate).add(NoOfDays, 'days').format('YYYY-MM-DD');
            angular.forEach($scope.AddMedicationDetails, function (value, index) {
                if (rowItem == index) {
                    value.EndDate = DateFormatEdit($filter('date')($scope.EndDate, 'dd-MMM-yyyy'));
                }
            });
            $scope.AddMedicationDetails = angular.copy($scope.AddMedicationDetails);
            //document.getElementById('End_Date').value = $scope.EndDate;
        }

        $scope.ChangeDate = function (NoOfDays, StartDate, rowItem) {
            $scope.sDate = moment(StartDate).format('DD-MMM-YYYY');
            $scope.EndDate = moment($scope.sDate).add(NoOfDays, 'days').format('YYYY-MM-DD');
            angular.forEach($scope.AddMedicationDetails, function (value, index) {
                if (rowItem == index) {
                    value.EndDate = DateFormatEdit($filter('date')($scope.EndDate, 'dd-MMM-yyyy'));
                }
            });
            $scope.AddMedicationDetails = angular.copy($scope.AddMedicationDetails);
        }
        // Add row concept  for Patient MedicationDetails
        $scope.AddMedicationDetails = [{
            'Id': 0,
            'PatientId': 0,
            'DrugId': "",
            'FrequencyId': 0,
            'RouteId': 0,
            'NoOfDays': "",
            'StartDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
            'EndDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
            ' Created_By': 0

        }];
        // Add row function for Patient MedicationDetails
        $scope.AddMedicationDetailsInsert = function () {
            if ($scope.AddMedicationDetails.length > 0) {
                var obj = {
                    'Id': 0,
                    'PatientId': 0,
                    'DrugId': "",
                    'FrequencyId': 0,
                    'RouteId': 0,
                    'NoOfDays': "",
                    'StartDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                    'EndDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                    ' Created_By': 0
                }
                $scope.AddMedicationDetails.push(obj);
            }
            else {
                $scope.AddMedicationDetails = [{
                    'Id': 0,
                    'PatientId': 0,
                    'DrugId': "",
                    'FrequencyId': 0,
                    'RouteId': 0,
                    'NoOfDays': "",
                    'StartDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                    'EndDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                    ' Created_By': 0
                }];
            }
            $scope.DrugcodeSearchPopup($scope.AddMedicationDetails.length - 1);
            setTimeout(function () {
                $scope.calenderSet1($scope.AddMedicationDetails.length);
            }, 1000);

        };
        $scope.calenderSet1 = function (idxval) {
            $("#DivMedicationFrom" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });

            $("#DivMedicationTo" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });
        }
        //This is for MedicationDetailsDelete
        $scope.MedicationDetailsDelete = function (itemIndex) {
            Swal.fire({
                title: 'Do you like to delete the selected Details?',
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
                    // var del = confirm("Do you like to delete the selected Details?");
                    // if (del == true) {
                    $scope.$apply(() => {
                        $scope.AddMedicationDetails.splice(itemIndex, 1);
                        if ($scope.AddMedicationDetails.length == 0) {
                            $scope.AddMedicationDetails = [{
                                'Id': 0,
                                'PatientId': 0,
                                'DrugId': "",
                                'FrequencyId': 0,
                                'RouteId': 0,
                                'NoOfDays': "",
                                'StartDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                                'EndDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                                'Created_By': 0
                            }];
                        }
                    });
                    //}
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            });

        };
        ///* This is for PatientMedication Insert and update Validations */
        $scope.PatientMedication_InsertUpdate_Validationcontrols = function () {
            var Drugflag = 0;
            var Frequency = 0;
            var Route = 0;
            var Startdate = 0;
            var Enddate = 0;
            var dateval = 0;
            var validateflag = true;
            var validationMsg = "";
            angular.forEach($scope.AddMedicationDetails, function (value, index) {

                if (value.DrugCodeId == null) {
                    Drugflag = 1;
                }
                if (value.FrequencyId == "") {
                    Frequency = 1;
                }
                if (value.RouteId == "") {
                    Route = 1;
                }
                if (value.StartDate == null || value.StartDate == "") {
                    Startdate = 1;
                }
                if ((value.EndDate == null || value.EndDate == "") && $scope.Medication_End_Date=='True') {
                    Enddate = 1;
                }
                if ((value.StartDate !== null) && (value.EndDate !== null)) {
                    value.StartDate = moment(value.StartDate).format('DD-MMM-YYYY');
                    value.EndDate = moment(value.EndDate).format('DD-MMM-YYYY');

                    if ((ParseDate(value.EndDate) < ParseDate(value.StartDate))) {
                        dateval = 1;
                    }
                    value.StartDate = DateFormatEdit(value.StartDate);
                    value.EndDate = DateFormatEdit(value.EndDate);
                }
            });
            if (Drugflag == 1) {
                //alert("Please select Drug Code");
                toastr.warning("Please select Drug Code", "warning");
                return false;
            }
            if (Frequency == 1) {
                //alert("Please select Frequency");
                toastr.warning("Please select Frequency", "warning");
                return false;
            }
            if (Route == 1) {
                //alert("Please select Route");
                toastr.warning("Please select Route", "warning");
                return false;
            }
            if (Startdate == 1) {
                //alert("Please select Start date");
                toastr.warning("Please select Start date", "warning");
                return false;
            }
            if (Enddate == 1) {
                //alert("Please select End date");
                toastr.warning("Please select End date", "warning");
                return false;
            }
            if (dateval == 1) {
                //alert("Start Date Should not be greater than End Date");
                toastr.warning("Start Date Should not be greater than End Date", "warning");
                return false;
            };
            return true;
        }

        //search  query
        $scope.filterMedicationList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.Medicationsearchquery);
            if ($scope.Medicationsearchquery == "") {
                $scope.PatientMedicationListData = angular.copy($scope.PatientMedicationListFilterData);

            }
            else {
                $scope.PatientMedicationListData = $ff($scope.PatientMedicationListFilterData, function (value) {
                    return angular.lowercase(value.Drug_Code).match(searchstring) ||
                        angular.lowercase(value.FrequencyName).match(searchstring) ||
                        angular.lowercase(value.FrequencyName).match(searchstring) ||
                        angular.lowercase(value.Generic_name).match(searchstring) ||
                        angular.lowercase(value.Item_Code).match(searchstring) ||
                        angular.lowercase(value.Dosage_FromName).match(searchstring) ||
                        angular.lowercase(value.StrengthName).match(searchstring) ||
                        //  angular.lowercase(value.NoOfDays).match(searchstring)||
                        angular.lowercase(value.RouteName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.StartDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.EndDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);


                });
            }
        }
        /***To get Drug Code Search filter List Function**/
        $scope.CodeSearch = "";
        $scope.DrugCodeList = [];
        $scope.DrugCodeListsFilter = [];
        $scope.selectedMedicationRow = 0;
        $scope.Drugcodesearchkey = function (selectedRow) {
            var SearchDrugCode = angular.lowercase($scope.CodeSearch);
            if (SearchDrugCode.length > 2) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/User/DrugCode_List/?DrugCodeSearch=' + SearchDrugCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.SearchMsg = "No Data Available";
                    $scope.DrugCodeList = [];
                    $scope.DrugCodeListsFilter = [];
                    $scope.DrugCodeList = data;
                    $scope.DrugCodeListsFilter = angular.copy($scope.DrugCodeList);
                    if ($scope.DrugCodeListsFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }

                });
            }
            else {
                $scope.DrugCodeList = [];
                $scope.DrugCodeListsFilter = [];
            }
            angular.element('#DrugCodeListModal').modal('show');

        }
        /**Drug Code Search button Click Popup window**/
        $scope.DrugcodeSearchPopup = function (selectedRow) {
            $scope.CodeSearch = "";
            $scope.DrugCodeListsFilter = [];
            $scope.selectedMedicationRow = selectedRow;
            angular.element('#DrugCodeListModal').modal('show');
            $("#txtdrugCodeSearch").focus();
        }
        $scope.DrugCodeSelect = function (rowItem) {
            angular.forEach($scope.AddMedicationDetails, function (value, index) {
                if (index == $scope.selectedMedicationRow) {
                    value.DrugCodeId = rowItem.Id;
                    value.DrugCode = rowItem.Drug_Code;
                    value.Generic_name = rowItem.Generic_name;
                    value.StrengthName = rowItem.StrengthName;
                    value.Dosage_FormName = rowItem.Dosage_FromName;
                    value.Item_Code = rowItem.Item_Code;
                }
            });

            if ($scope.Id > 0) {
                angular.forEach($scope.AddMedicationDetails, function (value, index) {
                    $scope.Generic_name = value.GenericName;
                });
            }
            angular.element('#DrugCodeListModal').modal('hide');
        }       

        $scope.DrugcodeSearchCancelPopup = function () {
            angular.element('#DrugCodeListModal').modal('hide');
        }
        $scope.PatientMedication_EditInsert_Validationcontrols = function () {
            if (typeof ($scope.DrugId) == "undefined" || $scope.DrugId == 0) {
                //alert("Please select Drug Code");
                toastr.warning("Please select Drug Code", "warning");
                return false;
            }
            else if (typeof ($scope.FrequencyId) == "undefined" || $scope.FrequencyId == 0) {
                //alert("Please select Frequency");
                toastr.warning("Please select Frequency", "warning");
                return false;
            }
            else if (typeof ($scope.NoOfDays) == "undefined" || $scope.FrequencyId == "") {
                //alert("Please enter No. of Days");
                toastr.warning("Please enter No. of Days", "warning");
                return false;
            }
            else if (typeof ($scope.RouteId) == "undefined" || $scope.RouteId == 0) {
                //alert("Please select Route");
                toastr.warning("Please select Route", "warning");
                return false;
            }
            else if (typeof ($scope.StartDate) == "undefined" || $scope.StartDate == 0) {
                //alert("Please select StartDate");
                toastr.warning("Please select StartDate", "warning");
                return false;
            }
            else if ((typeof ($scope.EndDate) == "undefined" || $scope.EndDate == null || $scope.EndDate == 0) && $scope.Medication_End_Date=='True') {
                //alert("Please select EndDate");
                toastr.warning("Please select EndDate", "warning");
                return false;
            }
            else if (($scope.StartDate !== null) && ($scope.EndDate !== null)) {
                $scope.StartDate = moment($scope.StartDate).format('DD-MMM-YYYY');
                $scope.EndDate = moment($scope.EndDate).format('DD-MMM-YYYY');

                if ((ParseDate($scope.EndDate) < ParseDate($scope.StartDate))) {
                    //alert("Start Date Should not be greater than End Date");
                    toastr.warning("Start Date Should not be greater than End Date", "warning");
                    $scope.StartDate = DateFormatEdit($scope.StartDate);
                    $scope.EndDate = DateFormatEdit($scope.EndDate);
                    return false;
                }
                $scope.StartDate = DateFormatEdit($scope.StartDate);
                $scope.EndDate = DateFormatEdit($scope.EndDate);
            }
            return true;
        };
        $scope.NoOfDaysEdit = function (NoOfDays, EndDate) {
            $scope.sDate = moment($scope.StartDate).format('DD-MMM-YYYY');
            $scope.EndDate = moment($scope.sDate).add(NoOfDays, 'days').format('YYYY-MM-DD');
            document.getElementById('E_Date').value = $scope.EndDate;
            $scope.EndDate = DateFormatEdit($filter('date')($scope.EndDate, 'dd-MMM-yyyy'));
        }

        $scope.EditChangeDate = function (NoOfDays, StartDate) {
            $scope.sDate = moment(StartDate).format('DD-MMM-YYYY');
            $scope.EndDate = moment($scope.sDate).add(NoOfDays, 'days').format('YYYY-MM-DD');
            document.getElementById('E_Date').value = $scope.EndDate;
            $scope.EndDate = DateFormatEdit($filter('date')($scope.EndDate, 'dd-MMM-yyyy'));
        }
        $scope.MedicationList = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.PatientMedication_EditInsert = function () {
            if ($scope.EndDate == null || $scope.EndDate == '') $scope.EndDateIE = $scope.EndDate;
            else $scope.EndDateIE = moment($scope.EndDate).format('DD-MMM-YYYY');
            $scope.MedicationList = [];
            if ($scope.PatientMedication_EditInsert_Validationcontrols() == true) {
                $('#save2').attr("disabled", true);
                var Medicationobj = {
                    Id: $scope.Id,
                    PatientId: $scope.SelectedPatientId,
                    DrugId: $scope.DrugCodeId,
                    FrequencyId: $scope.FrequencyId,
                    RouteId: $scope.RouteId,
                    NoOfDays: $scope.NoOfDays,
                    StartDate: moment($scope.StartDate).format('DD-MMM-YYYY'),
                    EndDate: $scope.EndDateIE,
                    Created_By: $window.localStorage['UserId'],
                    Modified_By: $window.localStorage['UserId'],
                    InstitutionId: $window.localStorage['InstitutionId']
                }
                $scope.MedicationList.push(Medicationobj);
                $http.post(baseUrl + '/api/User/MedicationInsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.MedicationList).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.error(data.Message, "warning");
                    }
                    $('#save2').attr("disabled", false);
                    if (data.ReturnFlag == "2") {
                        $scope.PatientMedicationCreateModalClear();
                        $scope.CancelMedicationPopUp();
                        $scope.CancelEditPopUp();
                        $scope.PatientMedicationList();
                    }

                });
            }
        };

        // This is for Medication InsertUpdate
        $scope.Id = 0;
        $scope.AddMedicationDetails = [];
        $scope.PatientMedication_InsertUpdate = function (itemIndex) {

            if ($scope.PatientMedication_InsertUpdate_Validationcontrols() == true) {
                $('#save1').attr("disabled", true);
                $scope.MedicationList = [];
                $("#chatLoaderPV").show();
                //var Varenddate;
                angular.forEach($scope.AddMedicationDetails, function (value, index) {
                    if (value.EndDate == '' || value.EndDate == null) $scope.Varenddate = value.EndDate;
                    else $scope.Varenddate = moment(value.EndDate).format('DD-MMM-YYYY');
                    var Medicationobj = {
                        Id: value.Id,
                        PatientId: $scope.SelectedPatientId,
                        DrugId: value.DrugCodeId,
                        FrequencyId: value.FrequencyId,
                        RouteId: value.RouteId,
                        NoOfDays: value.NoOfDays,
                        //StartDate: value.StartDate,
                        //EndDate: value.EndDate,
                        StartDate: moment(value.StartDate).format('DD-MMM-YYYY'),
                        EndDate: $scope.Varenddate,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.MedicationList.push(Medicationobj);
                });

                $http.post(baseUrl + '/api/User/MedicationInsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.MedicationList).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    $('#save1').attr("disabled", false);
                    if (data.ReturnFlag == "2") {
                        $scope.PatientMedicationCreateModalClear();
                        $scope.CancelMedicationPopUp();
                        $scope.CancelEditPopUp();
                        $scope.PatientMedicationList();
                    }

                });
            }
        }

        $scope.setPage3 = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageBox;
            }
            else {
                $scope.inputPageBox = PageNo;
            }
            $scope.current_pagePillBox = PageNo;
            $scope.PatientMedicationList();

        }

        //MedicationList
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.Medication_flag = 0;
        $scope.MedicationActive = true;
        $scope.PatientMedicationEmptyData = [];
        $scope.PatientMedicationListData = [];
        $scope.PatientMedicationListFilterData = [];
        $scope.PatientMedicationList = function () {
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_pagePillBox - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_pagePillBox * $scope.page_size;

                $scope.ISact = 1;       // default active
                if ($scope.MedicationActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.MedicationActive == false) {
                    $scope.ISact = -1 //all
                }
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/User/MedicationList/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart +
                    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {

                        $("#chatLoaderPV").hide();
                        $scope.SearchMsg = "No Data Available";
                        $scope.PatientMedicationEmptyData = [];
                        $scope.PatientMedicationDataList = [];
                        $scope.PatientMedicationListData = data.DrugDBMaster;
                        if ($scope.PatientMedicationListData.length > 0) {
                            $scope.PatientMedicationcount = $scope.PatientMedicationListData[0].TotalRecord;
                        } else {
                            $scope.PatientMedicationcount = 0
                        }
                        $scope.PatientMedicationListFilterData = data.DrugDBMaster;
                        $scope.PatientMedicationDataList = angular.copy($scope.PatientMedicationListData);
                        if ($scope.PatientMedicationDataList.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        $scope.PatientPillBoxPages = Math.ceil(($scope.PatientMedicationcount) / ($scope.page_size));
                    })
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        }
        //Medication View	
        $scope.PatientMedicationView = function () {
            $http.get(baseUrl + 'api/User/MedicationView/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                if (data.EndDate == null || data.EndDate == '')
                {
                    $scope.ViewEndDate = data.EndDate;
                    $scope.EndDateView = data.EndDate;
                }
                else
                {
                    $scope.ViewEndDate = DateFormatEdit($filter('date')(data.EndDate, "dd-MMM-yyyy"));
                    $scope.EndDateView = moment(data.EndDate).format('DD-MMM-YYYY');
                }

                $scope.AddMedicationDetails = [{
                    'Id': data.Id,
                    'DrugId': data.DrugId.toString(),
                    'DrugCode': data.Drug_Code,
                    'Generic_name': data.Generic_name,
                    'StrengthName': data.StrengthName,
                    'Item_Code': data.Item_Code,
                    'FrequencyId': data.FrequencyId.toString(),
                    'NoOfDays': data.NoOfDays,
                    'RouteId': data.RouteId.toString(),
                    'StartDate': DateFormatEdit($filter('date')(data.StartDate, "dd-MMM-yyyy")),
                    'EndDate': $scope.ViewEndDate
                }];
                $scope.Id = data.Id,
                    $scope.DrugId = data.DrugId.toString();
                $scope.Drug_Code = data.Drug_Code;
                $scope.DrugCodeId = data.DrugId,
                    $scope.Generic_name = data.Generic_name,
                    $scope.Item_Code = data.Item_Code,
                    $scope.StrengthName = data.StrengthName,
                    $scope.Dosage_FromName = data.Dosage_FromName,
                    $scope.ViewDrugCode = data.Drug_Code,
                    $scope.FrequencyId = data.FrequencyId.toString(),
                    $scope.FrequencyDuplicateId = $scope.FrequencyId;
                $scope.ViewFrequencyName = data.FrequencyName,
                    $scope.NoOfDays = data.NoOfDays,
                    $scope.RouteId = data.RouteId.toString(),
                    $scope.RouteDuplicateId = $scope.RouteId;
                $scope.ViewRouteName = data.RouteName,
                    //    $scope.StartDate = DateFormatEdit($filter('date')(data.StartDate, "dd-MMM-yyyy"));
                    //$scope.EndDate = DateFormatEdit($filter('date')(data.EndDate, "dd-MMM-yyyy"));
                    $scope.StartDate = DateFormatEdit($filter('date')(data.StartDate, "dd-MMM-yyyy")); //moment(data.StartDate).format('DD-MMM-YYYY'),
                    $scope.StartDateView = moment(data.StartDate).format('DD-MMM-YYYY'),                    
                    $scope.EndDate = $scope.ViewEndDate //moment(data.EndDate).format('DD-MMM-YYYY')

                if ($scope.DrugDropDown == 2) {
                    $scope.DrugbasedDetails($scope.DrugId);
                }
            });
        }
        $scope.PatientMedicationCreateModalClear = function () {
            $scope.AddMedicationDetails = [{
                'Id': 0,
                'DrugId': 0,
                'Generic_name': '',
                'Item_Code': '',
                'Dosage_FromName': '',
                'StrengthName': '',
                'FrequencyId': 0,
                'NoOfDays': '',
                'RouteId': 0,
                'StartDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy')),
                'EndDate': DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'))
            }];
        }
        $scope.CancelEditMedicationPopUp = function () {
            $scope.PatientMedicationCreateModalClear();
            angular.element('#PatientMedicationEditModal').modal('hide');
        }



        /* 
       Calling the api method to detele the details of the Medication
       for the  Medication Id,
       and redirected to the list page.
       */
        $scope.InActiveMedication = function (MedId) {
            $scope.Id = MedId;
            $scope.Medication_Delete();
        };
        $scope.Medication_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Medication?',
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
                    $http.get(baseUrl + '/api/User/MedicationDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Medication has been deactivated Successfully");
                        toastr.success("Selected Medication has been deactivated Successfully", "success");
                        $scope.PatientMedicationList();
                    }).error(function (data) {
                        $scope.error = "AN error has occured while deleting Medication!" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var del = confirm("Do you like to deactivate the selected Medication?");
             if (del == true) {
                 $http.get(baseUrl + '/api/User/MedicationDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                     //alert("Selected Medication has been deactivated Successfully");
                     toastr.success("Selected Medication has been deactivated Successfully", "success");
                     $scope.PatientMedicationList();
                 }).error(function (data) {
                     $scope.error = "AN error has occured while deleting Medication!" + data;
                 });
             };*/
        };

        /*'Active' the Medication*/
        $scope.ActiveMedication = function (MedId) {
            $scope.Id = MedId;
            $scope.MedicationDetails();
        };

        /* 
        Calling the api method to inactived the details of the Medication 
        for the  Medication Id,
        and redirected to the list page.
        */
        $scope.MedicationDetails = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Medication?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
                allowOutsideClick: false,
            }).then((result) => {
                // Read more about isConfirmed, isDenied below 
                if (result.isConfirmed) {
                    $http.get(baseUrl + '/api/User/MedicationDetails_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Medication has been activated successfully");
                        toastr.success("Selected Medication has been activated successfully", "success");
                        $scope.PatientMedicationList();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while Medication" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var Ins = confirm("Do you like to activate the selected Medication?");
             if (Ins == true) {
                 $http.get(baseUrl + '/api/User/MedicationDetails_Active/?Id=' + $scope.Id).success(function (data) {
                     //alert("Selected Medication has been activated successfully");
                     toastr.success("Selected Medication has been activated successfully", "success");
                     $scope.PatientMedicationList();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while Medication" + data;
                 });
             };*/
        }

        $scope.AllergyTabClick = 1;
        $scope.AllergyClickDetailsList = function () {
            if ($scope.AllergyTabClick == 1) {
                $scope.AllergyDetailsList();
                $scope.AllergyTabClick = $scope.AllergyTabClick + 1;
            }
        }


        $scope.AllergyDropDown = 2;
        $scope.AllergenId = "0";
        $scope.AllergyTypeId = "0";
        $scope.AllergyOnsetId = "0";
        $scope.AllergySeverityId = "0";
        $scope.AllergyReactionId = "0";
        $scope.AllergyDetailsList = function () {
            /* This is for Patient Allergy Details*/
            $scope.AllergyTypeList = [];
            $http.get(baseUrl + 'api/User/AllergyTypeList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergyTypeListTemp = [];
                $scope.AllergyTypeListTemp = data;
                var obj = { "Id": 0, "AllergyTypeName": "Select", "IsActive": 1 };
                $scope.AllergyTypeListTemp.splice(0, 0, obj);
                $scope.AllergyTypeList = angular.copy($scope.AllergyTypeListTemp);
            })


            $scope.AllergenListfilter = [];
            $scope.AllegenBasedType = function (AllergyTypeId) {
                var id = "0"
                id = $scope.AllergenId;
                $http.get(baseUrl + 'api/User/AllergenList/?ALLERGYTYPE_ID=' + AllergyTypeId + '&Institution_Id=' + $scope.Institution_Id).success(function (data) {
                    $scope.AllergenListTemp = [];
                    $scope.AllergenListTemp = data;
                    var obj = { "Id": 0, "AllergenName": "Select", "IsActive": 1 };
                    $scope.AllergenListTemp.splice(0, 0, obj);
                    $scope.AllergenListfilter = angular.copy($scope.AllergenListTemp);
                    $scope.AllergenId = id;

                })               
            }


            $scope.AllergenNameClearFunction = function () {
                $scope.AllergenId = "0";
            }

            $scope.AllergyOnsetList = [];
            $http.get(baseUrl + 'api/User/AllergyOnsetList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergyOnsetListTemp = [];
                $scope.AllergyOnsetListTemp = data;
                var obj = { "Id": 0, "AllergyOnsetName": "Select", "IsActive": 1 };
                $scope.AllergyOnsetListTemp.splice(0, 0, obj);
                $scope.AllergyOnsetList = angular.copy($scope.AllergyOnsetListTemp);
            })
            $scope.AllergySeverityList = [];
            $http.get(baseUrl + 'api/User/AllergySeverityList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergySeverityListTemp = [];
                $scope.AllergySeverityListTemp = data;
                var obj = { "Id": 0, "AllergySeverityName": "Select", "IsActive": 1 };
                $scope.AllergySeverityListTemp.splice(0, 0, obj);
                $scope.AllergySeverityList = angular.copy($scope.AllergySeverityListTemp);
            })
            $scope.AllergyReactionList = [];
            $http.get(baseUrl + 'api/User/AllergyReactionList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergyReactionList = data;
            })
        }


        $scope.AddAllergyPopUp = function () {
            $scope.PatientAllergyCreateModalClear();
            $scope.AllergyClickDetailsList();
            $('#Allergysave').attr("disabled", false);
            angular.element('#PatientAllergyCreateModal').modal('show');
        }
        $scope.CancelAllergyPopUp = function () {
            angular.element('#PatientAllergyCreateModal').modal('hide');
        }

        /*This is for Patient Allergy View Popup*/
        $scope.PatientAllergyViewPopUp = function (AllergyViewId) {
            $scope.PatientAllergyCreateModalClear();
            $scope.Id = AllergyViewId;
            $scope.PatientAllergyView();
            $scope.AllergyDropDown = 1;
            angular.element('#ViewAllergyPopModal').modal('show');
        }
        $scope.CancelViewAllergypopup = function () {
            angular.element('#ViewAllergyPopModal').modal('hide');
        }

        /* This is for Patient Allergy Edit Popup*/
        $scope.EditAllergy = function (AllergyViewId, createdDt) {
            $('#Allergysave').attr("disabled", false);
            /* if ($scope.IsEditableCheck(createdDt) == false) {
                 //alert("Allergy Cannot be edited");
                 toastr.info("Allergy Cannot be edited", "info");
             }
             else {*/
            $scope.AllergyClickDetailsList();
            $scope.Id = AllergyViewId;
            $scope.PatientAllergyView();
            $scope.AllergyDropDown = 2;
            angular.element('#PatientAllergyCreateModal').modal('show');
            //}
        }
        $scope.CancelPopUp = function () {
            angular.element('#PatientAllergyCreateModal').modal('hide');
        }
        /* This is for Allergy Insert Update*/

        $scope.SelectedAllergyReaction = [];
        $scope.SelectedAllergyReactionList = [];
        $scope.Id = 0;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.AllergyInsert_Update = function () {
            if ($scope.AllergyInsert_Update_Validationcontrols() == true) {
                if ($scope.Known_noKnownAllergyValidation() == true) {
                    $('#Allergysave').attr("disabled", true);
                    $("#chatLoaderPV").show();
                    $scope.SelectedAllergyReactionList = [];
                    angular.forEach($scope.SelectedAllergyReaction, function (value, index) {

                        var obj = {
                            Id: value
                        }
                        $scope.SelectedAllergyReactionList.push(obj);
                    });

                    var obj = {
                        Id: $scope.Id,
                        OnSetDate: $scope.OnSetDate,
                        AllergenId: $scope.AllergenId,
                        AllergyTypeId: $scope.AllergyTypeId,
                        AllergyOnsetId: $scope.AllergyOnsetId == 0 ? null : $scope.AllergyOnsetId,
                        AllergySeverityId: $scope.AllergySeverityId == 0 ? null : $scope.AllergySeverityId,
                        AllergyReactionId: $scope.AllergyReactionId == 0 ? null : $scope.AllergyReactionId,
                        Remarks: $scope.Remarks == '' ? null : $scope.Remarks,
                        SelectedAllergyList: $scope.SelectedAllergyReactionList,
                        AllergyReaction_List: $scope.AllergyReactionList,
                        Patient_Id: $scope.SelectedPatientId,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    };
                    $("#chatLoaderPV").show();
                    $http.post(baseUrl + 'api/User/Allergy_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                        $("#chatLoaderPV").hide();
                        //alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            toastr.success(data.Message, "success");
                        }
                        else if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $('#Allergysave').attr("disabled", false);
                        $scope.PatientAllergyList();
                        $scope.PatientAllergyCreateModalClear();
                        $scope.CancelAllergyPopUp();


                    });
                }
            }
        }

        /* This is for Mandatorycondition*/
        $scope.AllergyInsert_Update_Validationcontrols = function () {
            if (typeof ($scope.AllergyTypeId) == "" || $scope.AllergyTypeId == "0") {
                //alert("Please select Allergy Type Name ");
                toastr.warning("Please select Allergy Type Name ", "warning");
                return false;
            }
            else if (typeof ($scope.AllergenId) == "" || $scope.AllergenId == "0") {
                //alert("Please select Allergen Name");
                toastr.warning("Please select Allergen Name", "warning");
                return false;
            }
            return true;
        }

        /*Known/no Known Allergy validation*/
        $scope.Known_noKnownAllergyValidation = function () {
            var
                TSDuplicate = 0, ExistingPatientAllergyTypeName, IsActiveAllergyType, DefaultAlleryTypeName = 'No Known Allergies';

            //get the allergy type name from the text box. The text box filled when the select box onchange.
            var x = angular.element(document.getElementById("alltypename"));
            $scope.alltypename = x.val();
            angular.forEach($scope.PatientAllergyListData, function (value1, index1) {

                ExistingPatientAllergyTypeName = $scope.PatientAllergyListData[index1].AllergyTypeName;
                IsActiveAllergyType = $scope.PatientAllergyListData[index1].IsActive;

                if ((ExistingPatientAllergyTypeName != DefaultAlleryTypeName) && (IsActiveAllergyType == 1)) {
                    if ($scope.alltypename == DefaultAlleryTypeName) {
                        TSDuplicate = 1;                       
                    }                    
                }
                if ((ExistingPatientAllergyTypeName == DefaultAlleryTypeName) && (IsActiveAllergyType == 1)) {
                    if ($scope.alltypename != DefaultAlleryTypeName) {
                        TSDuplicate = 2;                        
                    }                     
                }
                //this section for deactivate to activate checking
                var x1 = angular.element(document.getElementById("alltypename" + $scope.Id));
                $scope.alltypename1 = x1.val();
                if ($scope.alltypename1 != "") {
                    if ((ExistingPatientAllergyTypeName != DefaultAlleryTypeName) && (IsActiveAllergyType == 1)) {

                        // $scope.alltypename1 = x1.val();
                        if ($scope.alltypename1 == DefaultAlleryTypeName) {
                            TSDuplicate = 1;
                        }
                    }
                    if ((ExistingPatientAllergyTypeName == DefaultAlleryTypeName) && (IsActiveAllergyType == 1)) {

                        if ($scope.alltypename1 != DefaultAlleryTypeName) {
                            TSDuplicate = 2;
                        }
                    }
                }              
            });

            if (TSDuplicate == 1) {
                toastr.error('Deactivate the known allergy, before activating the no known allergy', "warning");
                return false;
            } else if(TSDuplicate == 2){
                toastr.error('Deactivate the no known allergy, before activating the known allergy', "warning");
                return false;
            }
            else { return true; }
        }
        
        $scope.setPage4 = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageAllergy;
            }
            else {
                $scope.inputPageAllergy = PageNo;
            }
            $scope.current_PatientAllergyPages = PageNo;
            $scope.PatientAllergyList();

        }
        /* This is for Patient Allergy List*/
        $scope.Allergy_flag = 0;
        $scope.PatientAllergyListData = [];
        $scope.PatientAllergyListFilterData = [];
        $scope.PatientAssignedknownAllergyDataList = [];
        $scope.PatientAssignedknownAllergyActiveDataList = [];
        $scope.PatientAssignedAllergyDataList = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.PatientAllergyList = function () {
            $("#chatLoaderPV").show();
            $('.chartTabs').addClass('charTabsNone');
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_PatientAllergyPages - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_PatientAllergyPages * $scope.page_size;
                $scope.ISact = 1;       // default active
                if ($scope.allergyActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.allergyActive == false) {
                    $scope.ISact = -1 //all
                }
                $http.get(baseUrl + 'api/User/PatientAllergylist/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.SearchMsg = "No Data Available";
                    $scope.PatientAllergyEmptyData = [];
                    $scope.PatientAllergyListData = [];
                    $scope.PatientAssignedAllergyDataList = [];
                    $scope.PatientAllergyListData = data.PatientAllergyDetails;
                    if ($scope.PatientAllergyListData.length > 0) {
                        $scope.PatientAllergyCount = $scope.PatientAllergyListData[0].TotalRecord;
                    } else {
                        $scope.PatientAllergyCount = 0;
                    }

                    $scope.PatientAllergyListFilterData = data.PatientAllergyDetails;
                    $scope.PatientAllergyCountFilterData = data.PatientAllergyDetails;
                    for (i = 0; i < $scope.PatientAllergyListFilterData.length; i++) {
                        if ($scope.PatientAllergyListFilterData[0].IsActive == 1) {
                            if ($scope.PatientAllergyListFilterData[0].AllergyTypeName === "No Known Allergies") {
                                document.getElementById("IconAllergy").style.color = '#32CD32';
                            }
                            else if ($scope.PatientAllergyListFilterData[0].AllergyTypeName === "Unknown") {
                                document.getElementById("IconAllergy").style.color = '#FFD700';
                            }
                            else if (($scope.PatientAllergyListFilterData[0].AllergenName != "No Known Allergies") || ($scope.PatientAllergyListFilterData[0].AllergyTypeName != "Unknown")) {
                                document.getElementById("IconAllergy").style.color = '#ff0000';
                            }
                            //else if ($scope.PatientAllergyListFilterData[0].AllergenName === "Unknown") {
                            //    document.getElementById("IconAllergy").style.color = '#FFD700';
                            //}
                            else {
                                //document.getElementById("IconAllergy").style.color = '#FF0000';
                            }
                        }
                    }
                    if ($scope.PatientAllergyListFilterData.length == 0) {
                        document.getElementById("IconAllergy").style.color = '#FFD700';
                    }
                    $scope.PatientAssignedAllergyDataList = angular.copy($scope.PatientAllergyListData);

                    // $scope.PatientAssignedknownAllergyDataList =angular.copy($scope.PatientAssignedAllergyDataList);
                    $scope.PatientAssignedknownAllergyActiveDataList = $ff($scope.PatientAllergyListFilterData, { IsActive: 1 }, true);

                    if ($scope.PatientAssignedAllergyDataList.length > 0) {
                        $scope.Allergy_flag = 1;
                    }
                    else {
                        $scope.Allergy_flag = 0;
                    }
                    $scope.PatientAllergyPages = Math.ceil(($scope.PatientAllergyCount) / ($scope.page_size));

                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            });
        };
        /* 
     Calling the api method to detele the details of the Allergy
     for the  Allergy Id,
     and redirected to the list page.
     */

        $scope.InActiveAllergy = function (comId) {
            $scope.Id = comId;
            $scope.Allergy_InActive();
        };
        $scope.Allergy_InActive = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Allergy?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
                allowOutsideClick: false,
            }).then((result) => {
                    if (result.isConfirmed) {
                        var obj =
                        {
                            Id: $scope.Id,
                            Modified_By: $window.localStorage['UserId']
                        }

                        $http.post(baseUrl + '/api/User/AllergyDetails_InActive/', obj).success(function (data) {
                            //alert(data.Message);
                            if (data.ReturnFlag == 2) {
                                toastr.success(data.Message, "success");
                            }
                            $scope.PatientAllergyList();
                        }).error(function (data) {
                            $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                        });
                    } else if (result.isDenied) {
                        //Swal.fire('Changes are not saved', '', 'info')
                    }                
            })
            /*var del = confirm("Do you like to deactivate the selected Allergy?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/User/AllergyDetails_InActive/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    $scope.PatientAllergyList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                });
            };*/
        };

        /*'Active' the Allergy*/
        $scope.ActiveAllergy = function (comId) {
            $scope.Id = comId;
            $scope.Allergy_Active();
        };
        /* 
        Calling the api method to inactived the details of the Allergy 
        for the  Allergy Id,
        and redirected to the list page.
        */
        $scope.Allergy_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Allergy?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
                allowOutsideClick: false,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if ($scope.Known_noKnownAllergyValidation() == true) {
                    if (result.isConfirmed) {
                        var obj =
                        {
                            Id: $scope.Id,
                            Modified_By: $window.localStorage['UserId']
                        }

                        $http.post(baseUrl + '/api/User/AllergyDetails_Active/', obj).success(function (data) {
                            //alert(data.Message);
                            if (data.ReturnFlag == 2) {
                                toastr.success(data.Message, "success");
                            }
                            $scope.PatientAllergyList();
                        }).error(function (data) {
                            $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                        });
                    } else if (result.isDenied) {
                        //Swal.fire('Changes are not saved', '', 'info')
                    }
                }
            })
            /* var Ins = confirm("Do you like to activate the selected Allergy?");
             if (Ins == true) {
                 var obj =
                 {
                     Id: $scope.Id,
                     Modified_By: $window.localStorage['UserId']
                 }
 
                 $http.post(baseUrl + '/api/User/AllergyDetails_Active/', obj).success(function (data) {
                     //alert(data.Message);
                     if (data.ReturnFlag == 2) {
                         toastr.success(data.Message, "success");
                     }
                     $scope.PatientAllergyList();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                 });
             };*/
        }

        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }
        $scope.AllergyTypeeId = "0";
        $scope.SeverityIdTemp = "";
        $scope.AssignedSeverityId = "";
        $scope.AllergyTypeDuplicateId = "0";
        $scope.AllergenDuplicateId = "0";
        /*This is for Patient Allergy View*/
        $scope.EditSelectedAllergyReaction = [];
        $scope.PatientAllergyView = function () {
            $("#chatLoaderPVV").show();
            $scope.AllergenListfilter = [];
            $scope.EditSelectedAllergyReaction = []

            $http.get(baseUrl + 'api/User/PatientAllergyView/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                console.log(data);
                $scope.AllergyTypeId = data.AllergyTypeId.toString();
                $scope.AllergyTypeDuplicateId = $scope.AllergyTypeId;

                $scope.AllergenId = data.AllergenId.toString();
                $scope.AllergenDuplicateId = $scope.AllergenId;
                if ($scope.AllergyDropDown == 2) {
                    $scope.AllegenBasedType($scope.AllergyTypeId);
                }
                $scope.ViewAllergyType = data.AllergyTypeName;
                $scope.AllergenName = data.AllergenName;
                $scope.ViewAllegenName = data.AllergenName;
                if (data.AllergySeverityId != null) {
                    $scope.SeverityIdTemp = data.AllergySeverityId;
                    $scope.ViewSeverity = data.AllergySeverityName;
                    $scope.AssignedSeverityId = $scope.SeverityIdTemp;
                    $scope.AllergySeverityId = $scope.SeverityIdTemp.toString();
                }
                else {
                    $scope.ViewSeverity = "";
                    $scope.AllergySeverityId = "0";
                }
                if (data.AllergyOnsetId == null) {
                    $scope.AllergyOnsetId = "0";
                }
                else {
                    $scope.AllergyOnsetId = data.AllergyOnsetId.toString();
                }
                $scope.ViewOnset = data.AllergyOnsetName,
                    $scope.OnSetDate = DateFormatEdit($filter('date')(data.OnSetDate, "dd-MMM-yyyy"));
                $scope.Remarks = data.Remarks;
                $scope.ViewAllergyReactionName = data.AllergyReactionName;
                // For Multiselect dropdown	
                angular.forEach(data.AllergyReaction_List, function (value, index) {
                    $scope.EditSelectedAllergyReaction.push(value.Id);
                    $scope.SelectedAllergyReaction = $scope.EditSelectedAllergyReaction;
                });
            });
            $("#chatLoaderPVV").hide();
        }
        /*  This is for Allergy searchquery*/
        $scope.filterAllergyList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.Allergysearchquery);
            if ($scope.Allergysearchquery == "") {
                $scope.PatientAssignedAllergyDataList = angular.copy($scope.PatientAllergyListFilterData);
            }
            else {
                var val;
                $scope.PatientAssignedAllergyDataList = $ff($scope.PatientAllergyListFilterData, function (value) {


                    return angular.lowercase(value.AllergyTypeName).match(searchstring) ||
                        angular.lowercase(value.AllergenName).match(searchstring) ||
                        angular.lowercase(value.AllergySeverityName).match(searchstring) ||
                        angular.lowercase(value.AllergyOnsetName).match(searchstring) ||
                        angular.lowercase(value.AllergyReactionName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.OnSetDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
                if ($scope.PatientAssignedAllergyDataList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                $scope.PatientAllergyPages = Math.ceil(($scope.PatientAssignedAllergyDataList) / ($scope.page_size));
            }
        }

        $scope.PatientAllergyCreateModalClear = function () {
            $scope.Id = "0";
            $scope.AllergenId = "0";
            $scope.AllergyTypeId = "0";
            $scope.AllergyOnsetId = "0";
            $scope.AllergySeverityId = "0";
            $scope.AllergyReactionId = "0";
            $scope.OnSetDate = "";
            $scope.Remarks = "";
            $scope.SelectedAllergyReaction = "";
            $scope.OnSetDate = new Date(DatetimepickermaxDate);
        }



        //Initilization For Patient Notes
        $scope.Id = "0";
        $scope.Notes = "";
        $scope.PatientNotesrowCollectionFilter = [];

        //To open a popup window form for add new notes
        $scope.PatientNotesAddPopup = function () {
            $scope.submitted = false;
            $scope.Id = 0;
            $scope.PatientNotesClear();
            $('#saved').attr("disabled", false);
            angular.element('#PatientNotesAddEditModal').modal('show');
        }

        //To Close the patient notes model window for Add and Edit function. 
        $scope.CancelPatientNotesAddPopup = function () {
            angular.element('#PatientNotesAddEditModal').modal('hide');
        }


        //This is opening popup window form for view
        $scope.ViewPatientNotesPopUP = function (PatNoteId) {
            $scope.PatientNotesClear();
            $scope.Id = PatNoteId;
            $scope.PatientDetails_View();
            angular.element('#ViewPatientNoteModal').modal('show');

        }


        //To close the view patient popup modal
        $scope.CancelViewPatientNotespopup = function () {
            angular.element('#ViewPatientNoteModal').modal('hide');
        }


        //Edit Function for doctor notes open in modal window with data
        $scope.EditPatientNotes = function (PatNoteId, createdDt, createdBy) {
            $('#saved').attr("disabled", false);
            if ($window.localStorage['UserId'] == createdBy) {
                $scope.Id = PatNoteId;
                $scope.PatientDetails_View();
                angular.element('#PatientNotesAddEditModal').modal('show');
            } else {
                //alert('Notes only edited by author');
                toastr.info("Notes can be edited by Author only", "info");
            }

        }
        /*calling Alert message for cannot edit inactive record function *//*
        $scope.EditPatientNotes = function () {
             //alert('Notes only edited by author');
            toastr.info("Inactive record cannot be edited ", "info");
        }*/


        //Validation for insert function
        $scope.PatientNotesInsertUpdate_Validations = function () {
            if (typeof ($scope.Notes) == "" || $scope.Notes == "") {
                //alert("Please enter Notes");
                toastr.warning("Please enter Notes", "warning");
                return false;
            }
            return true;
        };

        //Insert function for doctor Notes
        $scope.PatientNotesInsertUpdate = function () {
            if ($scope.PatientNotesInsertUpdate_Validations() == true) {
                $('#saved').attr("disabled", true);
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    PatientId: $scope.SelectedPatientId,
                    Notes: $scope.Notes,
                    Created_By: $window.localStorage['UserId'],
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/PatientNotesInsertUpdate/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.warning(data.Message, "warning");
                    }
                    $('#saved').attr("disabled", false);
                    if (data.ReturnFlag == "1") {
                        $scope.CancelPatientNotesAddPopup();
                        $scope.patientnotelist();
                    }
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while adding patient notes" + data.ExceptionMessage;
                });
            }
        }
        $scope.PatientNotesListTabCount = 1;
        $scope.ClinicalNotesListData = function (CurrentTab) {
            if (CurrentTab == 7) {
                if ($scope.PatientNotesListTabCount == 1) {
                    $('.chartTabs').addClass('charTabsNone');
                    $scope.patientnotelist();
                }
                $scope.PatientNotesListTabCount = $scope.PatientNotesListTabCount + 1;
            }
        }
        $scope.setPage1 = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNote;
            }
            else {
                $scope.inputPageNote = PageNo;
            }
            $scope.current_pageNote = PageNo;
            $scope.patientnotelist();

        }

        $scope.NotesActive = true;

        //List function for doctor Notes   
        $scope.patientnotelist = function () {
            $scope.PatientNotesemptydata = [];
            $scope.PatientNotesrowCollection = [];
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_pageNote - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_pageNote * $scope.page_size;
                $scope.ISact = 1;
                if ($scope.NotesActive == true) {
                    $scope.ISact = 1
                }
                else if ($scope.NotesActive == false) {
                    $scope.ISact = -1
                }
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/User/PatientNotes_List/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart +
                    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.SearchMsg = "No Data Available";
                        $scope.PatientNotesemptydata = [];
                        $scope.PatientNotesrowCollection = [];
                        //$scope.PatientNotesrowCollection = data;
                        //$scope.NotesCount = $scope.PatientNotesrowCollection[0].TotalRecord;
                        //$scope.NotesCountFilterData = data; 
                        $scope.PatientNotesrowCollection = data.NotesDetails;
                        if ($scope.PatientNotesrowCollection.length > 0) {
                            $scope.NotesCount = $scope.PatientNotesrowCollection[0].TotalRecord;
                        } else {
                            $scope.NotesCount = 0;
                        }
                        $scope.NotesCountFilterData = data.NotesDetails;
                        $scope.PatientNotesrowCollectionFilter = angular.copy($scope.PatientNotesrowCollection);
                        if ($scope.PatientNotesrowCollectionFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        $scope.PatientNotes_pages = Math.ceil(($scope.NotesCount) / ($scope.page_size));
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "the error occured! " + data;
                    })
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        }

        //Search function for doctor notes
        $scope.filterPatientNotesList = function () {
            var searchstring = angular.lowercase($scope.searchNotesData);
            if ($scope.searchNotesData == "") {
                $scope.PatientNotesrowCollectionFilter = [];
                $scope.PatientNotesrowCollectionFilter = angular.copy($scope.PatientNotesrowCollection);
            }
            else {
                $scope.PatientNotesrowCollectionFilter = $ff($scope.PatientNotesrowCollection, function (value) {
                    return angular.lowercase(value.Notes).match(searchstring) ||
                        angular.lowercase(value.Created_By_Name).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
                $scope.PatientNotes_pages = Math.ceil(($scope.PatientNotesrowCollectionFilter) / ($scope.page_size));
            }
        }

        //View Function for Doctor Notes
        $scope.PatientDetails_View = function () {
            $http.get(baseUrl + '/api/User/PatientNotes_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.Notes = data.Notes;
            });
        }

        //To open a patient notes show more function modal window
        $scope.NotesPopupModal = function (Notes, rowlist) {
            $scope.NotesFilterList = [];
            $scope.PatientNotesFilterNo = [];
            $scope.Notes = rowlist.Notes;
            angular.element('#ViewPatientNoteModal').modal('show');

        };

        //list page show 'more' function
        $(function () {
            $('[data-toggle="modal"]').hover(function () {
                var modalId = $(this).data('target');
                $(modalId).modal('hide');
            });

        });

        //To Clear the Notes in popup window
        $scope.PatientNotesClear = function () {
            $scope.Notes = "";
        }

        // Patient Other Data
        $scope.Patient_OtherData_AddModal = function () {
            $('#other_Datasave').attr("disabled", false);
            angular.element('#Patient_OtherData_AddModal').modal('show');
        }
        $scope.b64toBlob = function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }
        $scope.Patient_OtherData_ViewModal = function (Id) {
            var contentType = 'image/png';
            $scope.Patient_OtherData_View(Id);
            //var blob = b64toBlob(b64Data, contentType);
            //var blobUrl = URL.createObjectURL(blob);
            angular.element('#Patient_OtherData_ViewModal').modal('show');
        }


        $scope.Patient_OtherData_Image_View = function (Id, filetype) {
            $http.get(baseUrl + '/api/User/Patient_OtherData_GetDocument?Id=' + Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                //var mtype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                //\var url = 'data:' + mtype + ';base64,' + data.DocumentBlobData.toString();
                /*window.open(url);*/
                console.log(typeof (data.DocumentBlobData))
                let pdfWindow = window.open("", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=500,height=400");
                pdfWindow.document.write("<html><head><title>Test</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>");
                pdfWindow.document.write("<body><embed width='100%' height='100%' src='data:" + data.Filetype.toString() + ";base64, " + data.DocumentBlobData.toString() + "#toolbar=0&navpanes=0&scrollbar=0'></embed></body></html>");
                /*pdfWindow.target = '_top';*/

            });
        }

        $scope.Patient_OtherData_EditModal = function (Id, createdDt) {
            $('#other_Datasave1').attr("disabled", false);
            if ($scope.IsEditableCheck(createdDt) == false) {
                //alert("Other Data Cannot be edited");
                toastr.info("Other Data Cannot be edited", "info");
            }
            else {
                $scope.Patient_OtherData_View(Id);
                angular.element('#OtherData_EditModel').modal('show');
            }
        }
        $scope.OtherData_CancelPopup = function () {
            angular.element('#Patient_OtherData_AddModal').modal('hide');
            angular.element('#Patient_OtherData_ViewModal').modal('hide');
            angular.element('#OtherData_EditModel').modal('hide');
            $scope.OtherData_ClearPopup();
        }
        $scope.OtherData_ClearPopup = function () {
            $scope.Patient_OtherData = [{
                'OtherData_Id': 0,
                'DocumentDate': new Date(),
                'DocumentType': '',
                'resumedoc': $scope.resumedoc,
                'file': '',
                'DocumentName': '',
                'Remarks': '',
            }];
            $scope.Remarks = "";
            $scope.DocumentDate = new Date();
            $scope.DocumentType = "";
            $scope.DocumentName = "";
            $scope.EditFileName = "";
            $scope.Editresumedoc = "";
        }
        $scope.Patient_OtherData = [];
        $scope.Patient_OtherData = [{
            'OtherData_Id': 0,
            'DocumentDate': new Date(),
            'resumedoc': $scope.resumedoc,
            'DocumentType': '',
            'DocumentName': '',
            'file': '',
            'Remarks': '',
        }];

        $scope.AddPatient_OtherData = function () {
            if ($scope.Patient_OtherData.length > 0) {
                var obj =
                {
                    'OtherData_Id': 0,
                    'resumedoc': $scope.resumedoc,
                    'DocumentDate': new Date(),
                    'DocumentType': '',
                    'DocumentName': '',
                    'Remarks': '',
                    'file': ''
                }
                $scope.Patient_OtherData.push(obj);
            }
            else {
                $scope.Patient_OtherData = [{
                    'OtherData_Id': 0,
                    'resumedoc': $scope.resumedoc,
                    'DocumentName': '',
                    'Remarks': '',
                    'DocumentDate': new Date(),
                    'DocumentType': '',
                    'file': ''
                }];
            };
        };
        $scope.docfileChange = function (e, index) {
            //if ($('#Userdocument')[0].files[0] != undefined) {
            //    $scope.CertificateFileName = $('#Userdocument')[0].files[0]['name'];
            //}
            var row = $scope.Patient_OtherData[index];
            if (row != undefined)
                $scope.Patient_OtherData[index]['file'] = e.files[0]
            row.CertificateFileName = e.files[0]['name'];

        }
        $scope.Editfile = []
        $scope.EditdocfileChange = function (e) {
            if ($('#EditDocument')[0].files[0] != undefined) {
                $scope.EditFileName = $('#EditDocument')[0].files[0]['name'];
            }
            $scope.Editfile = []
            $scope.Editfile.push(e.files[0])
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
        $scope.Patient_OtherData_Insert_Validations = function () {
            if ($scope.Patient_OtherData.length == 0) {
                //alert("Please add atleast one row");
                toastr.info("Please add atleast one row", "info");
                return false;
            }
            else {
                var AMitem = 0;
                angular.forEach($scope.Patient_OtherData, function (value, index) {
                    if ((value.DocumentName == null) || (value.DocumentName == undefined) || (value.DocumentName == "")) {
                        AMitem = 1;
                    }
                    if ((value.CertificateFileName == null) || (value.CertificateFileName == undefined) || (value.CertificateFileName == "")) {
                        toastr.warning("Please select a file", "warning");
                        return false;
                    }

                    $scope.filetype = value.CertificateFileName.split(".");
                    var fileExtenstion = "";
                    if ($scope.filetype.length > 0) {
                        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                    }

                    //OpenDocument Text Documen (.odt),Microsoft Word Open XML Document (.docx),Microsoft Word Document (.doc),LaTex (.tex)
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
                        //alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex");
                        toastr.warning("Please choose files of type jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex", "warning");
                        return false;
                    }
                });

                if ($scope.Patient_OtherData.length < 1 || AMitem == 1) {
                    //alert("Please enter Document Name");
                    toastr.warning("Please enter Document Name", "warning");
                    return false;
                }
                var Uploaditem = 0;
                angular.forEach($scope.Patient_OtherData, function (value, index) {
                    if ((value.CertificateFileName == null) || (value.CertificateFileName == undefined) || (value.CertificateFileName == "")) {
                        Uploaditem = 1;
                    }
                    else if ($scope.dataURItoBlob(value.resumedoc).size > 5242880) {

                        Uploaditem = 2;
                    }
                });
                if ($scope.Patient_OtherData.length < 1 || Uploaditem == 1) {
                    //alert("Please upload Document");
                    toastr.warning("Please upload Document", "warning");
                    return false;
                }
                else if (Uploaditem == 2) {
                    //alert("Uploaded file size cannot be greater than 5MB");
                    toastr.warning("Uploaded file size cannot be greater than 5MB", "warning");
                    return false;
                }
            }
            return true;
        }
        function convert(str) {
            var date = new Date(str),
                mnth = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), mnth, day].join("-") + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
        }
        $scope.Patient_OtherData_InsertUpdate = function () {
            if ($scope.Patient_OtherData_Insert_Validations() == true) {
                $('#other_Datasave').attr("disabled", true);
                $("#chatLoaderPV").show();
                var cnt = $scope.Patient_OtherData.length;
                $scope.insertcount = 0;
                angular.forEach($scope.Patient_OtherData, function (value, index) {
                    $scope.Id = "0",
                        $scope.Patient_Id = $scope.SelectedPatientId,
                        $scope.FileName = value.CertificateFileName,
                        $scope.DocumentName = value.DocumentName,
                        $scope.DocumentType = value.DocumentType,
                        $scope.DocumentDate = convert(value.DocumentDate),
                        $scope.Remarks = value.Remarks,
                        $scope.Created_By = $window.localStorage['UserId'];
                    $scope.Modified_By = $window.localStorage['UserId'];
                    var fd = new FormData();
                    //var imgBlob;
                    //var imgBlobfile;
                    //var itemIndexLogo = -1;
                    //var itemIndexdoc = -1;
                    //imgBlob = $scope.dataURItoBlob(value.resumedoc);
                    //itemIndexLogo = 0;
                    //if (itemIndexLogo != -1) {
                    fd.append('file', value.file);
                    /*}*/
                    /*
                    calling the api method for read the file path
                    and saving the image uploaded in the local server.
                    */
                    $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                    $http.post(baseUrl + '/api/User/Patient_OtherData_InsertUpdate?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&Appointment_Id=0' + '&Id=' + $scope.Id + '&FileName=' + value.CertificateFileName + '&DocumentName=' + $scope.DocumentName + '&Remarks=' + $scope.Remarks + '&Created_By=' + $scope.Created_By + '&DocumentDate=' + $scope.DocumentDate + '&DocumentType=' + $scope.DocumentType,
                        fd,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    )
                        .success(function (response) {
                            $scope.insertcount = $scope.insertcount + 1;

                            if (cnt == $scope.insertcount) {
                                $("#chatLoaderPV").hide();
                                //alert(response.Message);
                                toastr.success(response.Message, "success");
                                $('#other_Datasave').attr("disabled", false);
                                $scope.OtherData_CancelPopup();
                                $scope.Patient_OtherData_List();
                            }
                        });
                });
            }
        }

        $scope.Patient_OtherData_Update_Validations = function () {


            if (typeof ($scope.DocumentName) == "undefined" || $scope.DocumentName == "" || $scope.DocumentName == null) {
                //alert("Please enter Document Name");
                toastr.warning("Please enter Document Name", "warning");
                return false;
            }
            if (typeof ($scope.EditFileName) == "undefined" || $scope.EditFileName == "" || $scope.EditFileName == null) {
                //alert("Please Upload Document");
                toastr.warning("Please Upload Document", "warning");
                return false;
            }
            if (typeof ($scope.DocumentType) == "undefined" || $scope.DocumentType == "" || $scope.DocumentType == null) {
                //alert("Please Upload Document");
                toastr.warning("Please Select DocumentType", "warning");
                return false;
            }
            var fileval = 0;
            $scope.filetype = $scope.EditFileName.split(".");
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
            //if ($scope.CertificateValue == 1) {
            //    if ($scope.dataURItoBlob($scope.EditFileName).size > 5242880) {
            //        //alert("Uploaded file size cannot be greater than 5MB");
            //        toastr.warning("Uploaded file size cannot be greater than 5MB", "warning");
            //        return false;
            //    }
            //}
            return true;
        }

        $scope.CertificateValue = 0;
        $scope.CertificateUplaodSelected = function () {
            $scope.CertificateValue = 1;
        };
        $scope.Editresumedoc = "";
        $scope.Patient_OtherData_Edit = function () {
            if ($scope.Patient_OtherData_Update_Validations() == true) {
                $("#chatLoaderPV").show();
                $('#other_Datasave1').attr("disabled", true);
                $scope.Id = $scope.OtherData_Id,
                    $scope.Patient_Id = $scope.SelectedPatientId;
                $scope.Created_By = $window.localStorage['UserId'];
                $scope.Modified_By = $window.localStorage['UserId'];
                var fd = new FormData();
                var imgBlob;
                var imgBlobfile;
                var itemIndexLogo = -1;
                var itemIndexdoc = -1;

                if ($('#EditDocument')[0].files[0] != undefined) {
                    CertificateFileName = $('#EditDocument')[0].files[0]['name'];
                    //imgBlob = $scope.dataURItoBlob($scope.Editresumedoc);
                    //if (itemIndexLogo == -1) {
                    //    itemIndexfile = 0;
                    //}
                    //else {
                    //    itemIndexfile = 1;
                    //}
                }
                /*if (itemIndexLogo != -1) {*/
                if ($scope.Editfile.length !== 0) {
                    fd.append('file', $scope.Editfile[0]);
                }


                //}
                /*
                calling the api method for read the file path
                and saving the image uploaded in the local server.
                */
                $scope.Remarks = $scope.Remarks == null ? "" : $scope.Remarks;
                $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
                $http.post(baseUrl + '/api/User/Patient_OtherData_InsertUpdate?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId + '&Appointment_Id=0' + '&Id=' + $scope.Id + '&FileName=' + $scope.EditFileName + '&DocumentName=' + $scope.DocumentName + '&Remarks=' + $scope.Remarks + '&Created_By=' + $scope.Created_By + '&DocumentDate=' + convert($scope.DocumentDate) + '&Filetype=' + $scope.Filetype + '&DocumentType=' + $scope.DocumentType,
                    fd,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                )
                    .success(function (response) {
                        $("#chatLoaderPV").hide();
                        //alert(response.Message);
                        toastr.success(response.Message, "success");
                        $('#other_Datasave1').attr("disabled", false);
                        $scope.OtherData_CancelPopup();
                        $scope.Patient_OtherData_List();
                        $("#EditDocument").val('');
                    });
            }
        }

        $scope.PatientOtherDataListTabCount = 1;
        $scope.OthersListData = function (CurrentTab) {
            if (CurrentTab == 8) {
                if ($scope.PatientOtherDataListTabCount == 1) {
                    $('.chartTabs').addClass('charTabsNone');
                    $scope.Patient_OtherData_List();
                }
                $scope.PatientOtherDataListTabCount = $scope.PatientOtherDataListTabCount + 1;
            }
        }
        $scope.setPage5 = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageOthers;
            }
            else {
                $scope.inputPageOthers = PageNo;
            }
            $scope.current_others = PageNo;
            $scope.Patient_OtherData_List();

        }

        $scope.OtherData_IsActive = true;
        $scope.OtherData_List = [];
        $scope.OtherData_ListData = [];
        $scope.OtherDataflag = 0;
        $scope.Add_OtherDataflag = 0;
        $scope.OtherData_searchquery == ""
        $scope.Patient_OtherData_List = function () {
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_others - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_others * $scope.page_size;
                $scope.ISact = 1;
                $scope.ActiveStatus = $scope.OtherData_IsActive == true ? 1 : -1;
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/User/Patient_OtherData_List/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId + '&StartRowNumber=' + $scope.PageStart +
                    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.SearchMsg = "No Data Available";
                        $scope.OtherDataEmptyData = [];
                        $scope.OtherData_List = [];
                        $scope.OtherData_List = data.DocumentDetails1;
                        if ($scope.OtherData_List.length > 0) {
                            $scope.OtherDataCount = $scope.OtherData_List[0].TotalRecord;
                        } else {
                            $scope.OtherDataCount = 0;
                        }
                        $scope.OtherData_ListFilterdata = data.DocumentDetails1;
                        $scope.OtherData_ListData = angular.copy($scope.OtherData_List);
                        if ($scope.OtherData_ListData.length > 0) {
                            $scope.OtherDataflag = 1;
                        }
                        else {
                            $scope.OtherDataflag = 0;
                        }
                        $scope.Patientothers = Math.ceil(($scope.OtherDataCount) / ($scope.page_size));
                    })
            })
        }
        $scope.filter_OtherData = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.OtherData_searchquery);
            if ($scope.OtherData_searchquery == "") {
                $scope.OtherData_ListData = angular.copy($scope.OtherData_List);
            }
            else {
                $scope.OtherData_ListData = $ff($scope.OtherData_List, function (value) {
                    return angular.lowercase(value.DocumentName).match(searchstring) ||
                        angular.lowercase(value.FileName).match(searchstring) ||
                        angular.lowercase(value.Created_Name).match(searchstring) ||
                        angular.lowercase(value.DocumentType).match(searchstring) ||
                        angular.lowercase(value.Created_Date).match(searchstring);
                });
                if ($scope.OtherData_ListData.length > 0) {
                    $scope.OtherDataflag = 1;
                }
                else {
                    $scope.OtherDataflag = 0;
                }
                $scope.Patientothers = Math.ceil(($scope.OtherData_ListData) / ($scope.page_size));
            }

        }
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }
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
        $scope.DownloadDocument = function (GetId) {
            $scope.OtherData_Id = GetId;
            var a = document.createElement("a");
            document.body.appendChild(a);
            $http.get(baseUrl + '/Home/GetPatient_OtherDataDocument/?Id=' + $scope.OtherData_Id).success(function (data) {
            });

        };
        $scope.Filetype = "";
        $scope.Patient_OtherData_View = function (Id) {
            $scope.OtherData_Id = Id;
            $http.get(baseUrl + '/api/User/Patient_OtherData_View/?Id=' + $scope.OtherData_Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.OtherData_Id = data.Id;
                $scope.FileName = data.FileName;
                $scope.EditFileName = data.FileName;
                $scope.DocumentDate = new Date(data.DocumentDate);
                $scope.DocumentType = data.DocumentType;
                $scope.DocumentName = data.DocumentName;
                $scope.Remarks = data.Remarks;
                $scope.Filetype = data.Filetype;
            });
        }
        $scope.RemovePatient_OtherData_Item = function (rowIndex) {
            Swal.fire({
                title: 'Do you like to delete document',
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
                    //var del = confirm("Do you like to delete document");
                    //  if (del == true) {
                    $scope.$apply(() => {
                        var Previous_DocumentItem = [];

                        angular.forEach($scope.Patient_OtherData, function (selectedPre, index) {
                            if (index != rowIndex)
                                Previous_DocumentItem.push(selectedPre);
                        });
                        $scope.Patient_OtherData = Previous_DocumentItem;
                        if ($scope.Patient_OtherData.length > 0) {
                            $scope.Add_OtherDataflag = 1;
                        }
                        else {
                            $scope.Add_OtherDataflag = 0;
                        }
                    });
                    // }
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            });

        };
        $scope.Patient_OtherData_InActive = function (GetId) {
            $scope.Id = GetId;
            Swal.fire({
                title: 'Do you like to deactivate the selected Document?',
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
                    var obj = {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $http.post(baseUrl + '/api/User/Patient_OtherData_InActive', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $scope.Patient_OtherData_List();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Document" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var del = confirm("Do you like to deactivate the selected Document?");
             if (del == true) {
                 var obj = {
                     Id: $scope.Id,
                     Modified_By: $window.localStorage['UserId'],
                 }
                 $http.post(baseUrl + '/api/User/Patient_OtherData_InActive', obj).success(function (data) {
                     //alert(data.Message);
                     if (data.ReturnFlag == 2) {
                         toastr.success(data.Message, "success");
                     }
                     $scope.Patient_OtherData_List();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while deleting Document" + data;
                 });
             }*/
        };

        $scope.Patient_OtherData_Active = function (GetId) {
            $scope.Id = GetId;
            Swal.fire({
                title: 'Do you like to activate the selected Document?',
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
                    var obj = {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $http.post(baseUrl + '/api/User/Patient_OtherData_Active', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $scope.Patient_OtherData_List();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Document" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var del = confirm("Do you like to activate the selected Document?");
             if (del == true) {
                 var obj = {
                     Id: $scope.Id,
                     Modified_By: $window.localStorage['UserId'],
                 }
                 $http.post(baseUrl + '/api/User/Patient_OtherData_Active', obj).success(function (data) {
                     //alert(data.Message);
                     if (data.ReturnFlag == 2) {
                         toastr.success(data.Message, "success");
                     }
                     $scope.Patient_OtherData_List();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while deleting Document" + data;
                 });
             }*/
        };

        $scope.Allergies = function () {
            angular.element('#PatientAllergyListModal').modal('show');
        }

        $scope.NoknownAllergies = function () {
            angular.element('#PatientAllergyListModal').modal('show');
        }

        $scope.DoctorNotesDetails_InActive = function (comId) {
            if ($window.localStorage['UserTypeId'] == 2) {
                //alert('Not allowed');
                toastr.info("Not allowed", "info");
            } else {
                $scope.Id = comId;
                $scope.DoctorNotes_Delete();
            }
        };
        $scope.DoctorNotes_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Notes?',
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
                    var obj = {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $http.post(baseUrl + '/api/User/DoctorNotesDetails_InActive/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $scope.patientnotelist();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var del = confirm("Do you like to deactivate the selected Notes?");
             if (del == true) {
                 var obj = {
                     Id: $scope.Id,
                     Modified_By: $window.localStorage['UserId'],
                 }
                 $http.post(baseUrl + '/api/User/DoctorNotesDetails_InActive/', obj).success(function (data) {
                     //alert(data.Message);
                     if (data.ReturnFlag == 2) {
                         toastr.success(data.Message, "success");
                     }
                     $scope.patientnotelist();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                 });
             }*/
        };

        /*'Active' the Institution*/
        $scope.DoctorNotesDetails_Active = function (comId) {
            if ($window.localStorage['UserTypeId'] == 2) {
                //alert('Not Allowed');
                toastr.info("Not Allowed", "info");
            } else {
                $scope.Id = comId;
                $scope.ReInsertDoctorNotesDetails();
            }

        };

        /* 
        Calling the api method to inactived the details of the company 
        for the  company Id,
        and redirected to the list page.
        */
        $scope.ReInsertDoctorNotesDetails = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Notes?',
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
                    var obj = {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $http.post(baseUrl + '/api/User/DoctorNotesDetails_Active/', obj).success(function (data) {
                        //alert(data.Message);
                        if (data.ReturnFlag == 2) {
                            toastr.success(data.Message, "success");
                        }
                        $scope.patientnotelist();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Notes?");
            if (Ins == true) {
                var obj = {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/DoctorNotesDetails_Active/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    $scope.patientnotelist();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                });

            };*/
        }
        //$scope.$on("show_payment_history", show_payment_history);
    }
]);