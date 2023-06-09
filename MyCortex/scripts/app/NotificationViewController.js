﻿var NotificationView = angular.module("NotificationViewController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

NotificationView.controller("NotificationViewController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage['UserTypeId'] == 5 || $window.localStorage['UserTypeId'] == 2 || $window.localStorage['UserTypeId'] == 7 || $window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 6) {
            $scope.User_Id = $window.localStorage['UserId'];
            $scope.listdata = [];
            $scope.current_page = 1;
            $scope.page_size = $window.localStorage['Pagesize'];
            $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

            $scope.rembemberCurrentPage = function (p) {
                $scope.current_page = p
            }
            $scope.changeBackColor = [];
            $scope.NotificationUpdate = function (index1, SendEmailId, MessageSubject, MessageContent, ReadFlag) {
                $scope.changeBackColor = [];
                angular.element('#NotificationViewModel').modal('show');
                $scope.SendEmail_Id = SendEmailId;
                $scope.MessageSubject = MessageSubject;
                $scope.MessageContent = MessageContent;
                if (ReadFlag == 1) {
                    var obj = {
                        Id: $scope.SendEmail_Id,
                    }
                    $http.post(baseUrl + '/api/SendEmail/Notification_Update/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {

                        angular.forEach($scope.UserNotificationList_Filter, function (row, index) {
                            if (index == index1)
                                row.ReadFlag = "2";
                            $('#id' + index1).removeClass('tdBackColor');
                            $('#msubj' + index1).removeClass('tdBackColor');
                            $('#mbody' + index1).removeClass('tdBackColor');
                            $('#msend' + index1).removeClass('tdBackColor');
                            $('#viewid' + index1).removeClass('tdBackColor');


                        });
                    });
                    $http.get(baseUrl + '/api/SendEmail/CountNotification_Update/?User_Id=' + $scope.User_Id).success(function (data) {
                        document.getElementById("UnreadCountIcon").title = "Unread Notifications: " + data.NotificationUnread;
                        var NotificationCount = document.getElementById('notificationCount');
                        NotificationCount.textContent = data.NotificationUnread;
                    });

                }


            }
            $scope.UserNotificationList = [];
            $scope.flag = 0;
            $scope.UserNotificationList_Filter = [];
            $scope.searchquery = "";
            $scope.NotificationList = function () {
                $http.get(baseUrl + '/api/SendEmail/User_get_NotificationList/?User_Id=' + $scope.User_Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.emptydata = [];
                    $scope.UserNotificationList = data.usernotification;
                    angular.forEach($scope.UserNotificationList, function (value, index) {
                        value.MessageBody = value.MessageBody.replace("<p>", "").replace("</p>", "").replace("<br>", "").replace("</br>", "").replace("?\r\n", "").replace("<p>", "");
                    });
                    $scope.UserNotificationList_Filter = angular.copy($scope.UserNotificationList);
                    if ($scope.UserNotificationList_Filter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    document.getElementById("UnreadCountIcon").title = "Unread Notifications: " + data.NotificationUnread;
                    var NotificationCount = document.getElementById('notificationCount');
                    NotificationCount.textContent = data.NotificationUnread;
                });

            }
            $scope.SelectedPatientId = $window.localStorage['UserId'];
            $scope.MyAppointmentsNotification = function () {
                $("#chatLoaderPV").show();
                $scope.ChronicDetails();
                $http.get(baseUrl + '/api/User/DoctorAppoinmentsList/?PatientId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $("#chatLoaderPV").hide();
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
            $scope.PatientAllergyNotificationList = function () {
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
                            if ($scope.PatientAllergyListFilterData[0].AllergyTypeName === "No Known Allergies") {
                                document.getElementById("IconAllergy").style.color = '#32CD32';
                            }
                            else if ($scope.PatientAllergyListFilterData[0].AllergyTypeName === "Unknown") {
                                document.getElementById("IconAllergy").style.color = '#FFD700';
                            }
                            else if ($scope.PatientAllergyListFilterData[0].AllergenName === "No Known Allergies") {
                                document.getElementById("IconAllergy").style.color = '#32CD32';
                            }
                            else if ($scope.PatientAllergyListFilterData[0].AllergenName === "Unknown") {
                                document.getElementById("IconAllergy").style.color = '#FFD700';
                            }
                            else {
                                //document.getElementById("IconAllergy").style.color = '#FF0000';
                            }
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
            $scope.PatientNotification = function () {
                $scope.SelectedPatientId = $window.localStorage['UserId']; 
                //|| $window.localStorage['UserTypeId'] == 4
                if ($window.localStorage['UserTypeId'] == 2  || $window.localStorage['UserTypeId'] == 5 || $window.localStorage['UserTypeId'] == 6 || $window.localStorage['UserTypeId'] == 7) {
                    $("#chatLoaderPV").show();
                    $scope.ProtocolDetails_View();
                    $scope.PatientGroupNameList();
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
                    });
                }
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
            $scope.ProtocolDetails_View = function () {

                if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                    $scope.Id = $routeParams.Id;
                    $scope.DuplicatesId = $routeParams.Id;
                }
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_View/?Id=' + $scope.Id).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.DuplicatesId = data.Id;
                    $scope.Institution_Name = data.Institution_Id;
                    $scope.ViewInstitution_Name = data.Institution_Name;
                    $scope.ProtocolName = data.Protocol_Name;
                    $scope.ParameterSettingslist = data.ChildModuleList;

                    angular.forEach($scope.ParameterSettingslist, function (value, index) {
                        if (value.NormalRange_High == null || value.NormalRange_Low == null) {
                            $scope.ParameterSettings_ViewEdit();
                        }
                    })
                });
            }
            $scope.CancelPatientGroupNamePopup = function () {
                angular.element('#PatientGroupListModal').modal('hide');

            };
            $scope.CancelPatientMonitoringProtocolModal = function () {
                angular.element('#PatientMonitoringProtocolModal').modal('hide');
            }
            $scope.CancelPatientAllergyNamePopup = function () {
                angular.element('#PatientAllergyListModal').modal('hide');
            }
            $scope.ListFilter = function () {
                $scope.ResultListFiltered = [];
                var searchstring = angular.lowercase($scope.searchquery);
                if ($scope.searchquery == "") {
                    $scope.UserNotificationList_Filter = angular.copy($scope.UserNotificationList);
                }
                else {
                    $scope.UserNotificationList_Filter = $ff($scope.UserNotificationList, function (value) {
                        return angular.lowercase(value.MessageSubject).match(searchstring) ||
                            angular.lowercase(value.MessageBody).match(searchstring) ||
                            angular.lowercase(($filter('date')(value.SentDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                    });
                    if ($scope.UserNotificationList_Filter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                }
            }
            $scope.closeNotification = function () {
                window.location.href = baseUrl + "/Home/Index#/home";
            }
            $scope.clearAllNotification = function () {
                if ($scope.UserNotificationList_Filter.length !== 0) {
                    $('#clear').attr("disabled", true);
                    $http.get(baseUrl + '/api/SendEmail/ClearNotification_Update/?User_Id=' + $scope.User_Id).success(function (data) {
                        //alert("Cleared All Notifications!");
                        toastr.info("Cleared All Notifications!", "info");
                        $('#clear').attr("disabled", false);
                        $scope.emptydata = "";
                        if ($scope.emptydata == "") {
                            $scope.UserNotificationList_Filter.length = 0;
                            $scope.flag = 0;

                        }
                        document.getElementById("UnreadCountIcon").title = "Unread Notifications: " + data.NotificationUnread;
                        var NotificationCount = document.getElementById('notificationCount');
                        NotificationCount.textContent = data.NotificationUnread;
                    });
                }
            }
            $scope.CancelModel = function () {
                angular.element('#NotificationViewModel').modal('hide');

            }
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }
    }
]);