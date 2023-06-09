﻿var EmailAlertlistcontroller = angular.module("EmailAlertlistController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

EmailAlertlistcontroller.controller("EmailAlertlistController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        $scope.currentTab = "1";
        $scope.Id = "0";
        $scope.UserTypeId = $window.localStorage["UserTypeId"];

        $scope.flag = 0;
        $scope.IsActive = true;

        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.Member_ID = "";
        $scope.Policy_Number = "";
        $scope.Reference_ID = "";
        $scope.ExpiryDate = "";
        $scope.SelectedPayor = [];
        $scope.SelectedPlan = [];
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            if (typeof ($scope.Event) == "undefined" || $scope.Event == "0") {
                //alert("Please select Event");
                toastr.warning("Please select Event", "warning");
                return false;
            }
            else if (($scope.EmailTemplate == 0) && $scope.EmailFlag == true) {
                //alert("Please select Email Template");
                toastr.warning("Please select Email Template", "warning");
                return false;
            }
            else if (($scope.AppTemplate == 0) && $scope.AppFlag == true) {
                //alert("Please select App Template");
                toastr.warning("Please select App Template", "warning");
                return false;
            }
            else if (($scope.WebTemplate == 0) && $scope.WebFlag == true) {
                //alert("Please select Web Template");
                toastr.warning("Please select Web Template", "warning");
                return false;
            }
            else if (($scope.SMSTemplate == 0) && $scope.SMSFlag == true) {
                toastr.warning("Please select SMS Template", "warning");
                return false;
            }

            if (($scope.EmailFlag == false) && ($scope.AppFlag == false) && ($scope.WebFlag == false) && ($scope.SMSFlag == false)) {
                //alert("Please select Email or App or Web for alert");
                toastr.warning("Please select Email or App or Web or Sms for alert", "warning");
                return false;
            } 
            $scope.EventCodeName = "";
            angular.forEach($scope.AlertEvent, function (Selected, index) {
                if ($scope.Event == Selected.Id) {
                    $scope.Eventtype = Selected.EventType_Id;
                    $scope.Eventtype = Selected.EventCode
                }
            })
            //if ($scope.Eventtype == "DOCTOR_APPOINTMENT_REMINDER" || $scope.Eventtype == "PAT_APPOINTMENT_REMINDER" ||
               if ($scope.Eventtype == "PASSWORD_EXPIRY" || $scope.Eventtype == "NEAR_PAT_LIMIT" || $scope.Eventtype == "NEAR_USR_LIMIT" ||
                $scope.Eventtype == "TARGET_DAILY" || $scope.Eventtype == "TARGET_WEEKLY") {
                if ($scope.AlertDays != null) {
                    if (($scope.AlertDays + "") == "") {
                        //alert("Please enter valid values");
                        toastr.warning("Please enter valid values", "warning");
                        $scope.DurationDisplayCheck();
                        return false;
                    }
                }
            }
            return true;
        };

        /* Email Alert List Function*/
        $scope.AlertEvent = [];
        $scope.AlertEventType = [];
        $scope.EmailTempalteTypeList = [];
        $scope.AppTempalteTypeList = [];
        $scope.TempalteTypeList = [];
        $scope.SMSTempalteTypeList = [];

        $scope.Eventselected = function () {
            if ($scope.UserTypeId == 1) {
                $scope.status = 2;
            }
            else if ($scope.UserTypeId == 3) {
                $scope.status = 0;
            } else {
                $scope.status = 1;
            }
            $http.get(baseUrl + '/api/EmailAlertConfig/AlertEvent_List/?Institution_Id=' + $scope.InstituteId + '&Id=' + 0
                + '&status=' + $scope.status).success(function (data) {
                    $scope.AlertListTemp = [];
                    $scope.AlertListTemp = data;
                    if (data != null) {
                        /*var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                        $scope.AlertListTemp.splice(0, 0, obj);*/
                        $scope.AlertEvent = angular.copy($scope.AlertListTemp);
                    }
                });
        };
        $scope.Eventselected();
        $scope.EventDurationUOM = "";
        $scope.DurationDisplayCheck = function () {
            $scope.Eventtype = "1";
            angular.forEach($scope.AlertEvent, function (Selected, index) {
                if ($scope.Event == Selected.Id) {
                    $scope.Eventtype = Selected.EventType_Id;

                    if (Selected.EventCode == "DOCTOR_APPOINTMENT_REMINDER" || Selected.EventCode == "PAT_APPOINTMENT_REMINDER") {
                        $scope.EventDurationUOM = "mins"
                    }
                    else if (Selected.EventCode == "PASSWORD_EXPIRY") {
                        $scope.EventDurationUOM = "days"
                    }
                    else if (Selected.EventCode == "NEAR_PAT_LIMIT" || Selected.EventCode == "NEAR_USR_LIMIT"
                        || Selected.EventCode == "TARGET_DAILY" || Selected.EventCode == "TARGET_WEEKLY") {
                        $scope.EventDurationUOM = "%"
                    }
                }
            })
        }

        /* Email Flag List Function*/
        $scope.Emailselectlist = function () {
            $scope.EmailTempId = 1;
            $http.get(baseUrl + '/api/EmailAlertConfig/Template_List/?Institution_Id=' + $scope.InstituteId + '&TemplateType_Id=' + $scope.EmailTempId).success(function (data) {
                $scope.EmailTempalteTypeListTemp = [];
                $scope.EmailTempalteTypeListTemp = data;
                /*var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                $scope.EmailTempalteTypeListTemp.splice(0, 0, obj);*/
                $scope.EmailTempalteTypeList = angular.copy($scope.EmailTempalteTypeListTemp);
            });
        }
        $scope.Emailselectlist();

        /* Email Notification List Function*/
        $scope.Appselect = function () {
            $scope.AppTempId = 2;
            $http.get(baseUrl + '/api/EmailAlertConfig/Template_List/?Institution_Id=' + $scope.InstituteId + '&TemplateType_Id=' + $scope.AppTempId).success(function (data) {

                $scope.AppTempalteTypeListTemp = [];
                $scope.AppTempalteTypeListTemp = data;
                /*var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                $scope.AppTempalteTypeListTemp.splice(0, 0, obj);*/
                $scope.AppTempalteTypeList = angular.copy($scope.AppTempalteTypeListTemp);

                $scope.TempalteTypeList = angular.copy($scope.AppTempalteTypeListTemp);
            });

        }
        $scope.Appselect();

        $scope.EventBasedToList = function () {
            $http.get(baseUrl + '/api/EmailAlertConfig/EventTo_List/?EventId=' + $scope.Event).success(function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        $scope.EventCC = data[0].EventCC;
                        $scope.EventTo = data[0].EventTo;
                    }
                }
            });
        };
        $scope.EventToClearFunction = function () {
            $scope.EventCC = "";
            $scope.EventTo = "";
        }

        /* SMS Flag List Function*/
        $scope.SMSselectlist = function () {
            $scope.SMSTempId = 3;
            $http.get(baseUrl + '/api/EmailAlertConfig/Template_List/?Institution_Id=' + $scope.InstituteId + '&TemplateType_Id=' + $scope.SMSTempId).success(function (data) {
                $scope.SMSTempalteTypeListTemp = [];
                $scope.SMSTempalteTypeListTemp = data;
                $scope.SMSTempalteTypeList = angular.copy($scope.SMSTempalteTypeListTemp);
            });
        }
        $scope.SMSselectlist();

        $scope.EmailTemplate = "0";
        $scope.AppTemplate = "0";
        $scope.WebTemplate = "0";
        /* THIS IS FOR ADD/EDIT FUNCTION */
        $scope.EmailAlertAddEdit = function () {
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $scope.InstituteId,
                    Event_Id: $scope.Event,
                    EmailFlag: $scope.EmailFlag,
                    AppFlag: $scope.AppFlag,
                    WebFlag: $scope.WebFlag,
                    SMSFlag: $scope.SMSFlag,
                    EmailTemplate_Id: $scope.EmailTemplate == 0 ? null : $scope.EmailTemplate,
                    AppTemplate_Id: $scope.AppTemplate == 0 ? null : $scope.AppTemplate,
                    WebTemplate_Id: $scope.WebTemplate == 0 ? null : $scope.WebTemplate,
                    SMSTemplate_Id: $scope.SMSTemplate == 0 ? null : $scope.SMSTemplate,
                    AlertDays: $scope.AlertDays,
                    ModifiedUser_Id: $scope.Patient_Id,
                    Created_By: $scope.Patient_Id
                }
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/EmailAlertConfig/EmailAlertDetails_AddEdit/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    $('#btnsave').attr("disabled", false);
                    if (data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.CancelPopUP();
                        $scope.EmailAlertlist();
                    }
                    $("#chatLoaderPV").hide();
                })
            }
        }

        /* THIS IS FOR LIST PROCEDURE */
        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.Id = 0;
        $scope.EmailAlertlist = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage["UserTypeId"] == 1) {
                $("#chatLoaderPV").show();
                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }
                $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_List/?Id=' + $scope.InstituteId + '&IsActive=' + $scope.ISact).success(function (data) {
                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.rowCollection = data;
                    if (data != null) {
                        $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                        if ($scope.rowCollectionFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.searchquery = "";
        /* FILTER THE LIST FUNCTION.*/
        $scope.filteralertList = function () {
            $scope.rowCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.EventName).match(searchstring) ||
                        angular.lowercase(value.EmailTemplate == null ? '' : value.EmailTemplate).match(searchstring) ||
                        angular.lowercase(value.AppTemplate == null ? '' : value.AppTemplate).match(searchstring) ||
                        angular.lowercase(value.WebTemplate == null ? '' : value.WebTemplate).match(searchstring) ||
                        angular.lowercase(value.SMSTemplate == null ? '' : value.SMSTemplate).match(searchstring);
                });
            }
        }
        $scope.DuplicatesId = 0;
        $scope.assignedEvent = "";
        $scope.assignedEmailTemplate = "";
        $scope.assignedNotificationTemplate = "";
        $scope.assignedAppTemplate = "";
        /* THIS IS FOR VIEW FUNCTION */
        $scope.ViewEmailAlert = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_View/?Id=' + $scope.Id).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Institution_Id = data.Institution_Id;
                $scope.Institution_Name = data.Institution_Name;

                $scope.EmailFlag = data.EmailFlag;
                $scope.AppFlag = data.AppFlag;
                $scope.WebFlag = data.WebFlag;
                $scope.SMSFlag = data.SMSFlag;
                if (data.EmailTemplate_Id != null) {
                    $scope.EmailTemplate = data.EmailTemplate_Id.toString();
                    $scope.EmailTempId = 1;
                    $scope.ViewEmailTemplateName = data.EmailTemplate;
                    $scope.EmailFlag = true;
                } else {
                    $scope.EmailFlag = false;
                }
                if (data.AppTemplate_Id != null) {
                    $scope.AppTemplate = data.AppTemplate_Id.toString();
                    $scope.AppTempId = 2;
                    $scope.ViewAppTemplateName = data.AppTemplate;
                    $scope.AppFlag = true;
                } else {
                    $scope.AppFlag = false;
                }

                if (data.WebTemplate_Id != null) {
                    $scope.WebTemplate = data.WebTemplate_Id.toString();
                    $scope.WebTempId = 2;
                    $scope.ViewWebTemplateName = data.WebTemplate;
                    $scope.WebFlag = true;
                } else {
                    $scope.WebFlag = false;
                }

                if (data.SMSTemplate_Id != null) {
                    $scope.SMSTemplate = data.SMSTemplate_Id.toString();
                    $scope.SMSTempId = 3;
                    $scope.ViewSMSTemplateName = data.SMSTemplate;
                    $scope.SMSFlag = true;
                } else {
                    $scope.SMSFlag = false;
                }

                $scope.AlertDays = data.AlertDays == null ? "" : data.AlertDays;

                $scope.Event = data.Event_Id.toString();
                $scope.ViewEvent = data.EventName;
                $scope.assignedEvent = $scope.Event;
                $scope.Event = $scope.Event;
                $scope.DurationDisplayCheck();
                $scope.EventBasedToList();
                $("#chatLoaderPV").hide();
            });
        }

        $scope.DeleteEmailAlert = function (DId) {
            $scope.Id = DId;
            $scope.EmailAlert_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.EmailAlert_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Alert details?',
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
                    $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Alert has been deactivated Successfully");
                        toastr.success("Alert has been deactivated Successfully", "success");
                        $scope.EmailAlertlist();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting Alert details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* var del = confirm("Do you like to deactivate the selected Alert details?");
            if (del == true) {
                $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert("Alert has been deactivated Successfully");
                    toastr.success("Alert has been deactivated Successfully", "success");
                    $scope.EmailAlertlist();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Alert details" + data;
                });
            }*/
        };

        /* THIS IS FOR ACTIVE FUNCTION*/
        $scope.ActiveEmailAlert = function (PId) {
            $scope.Id = PId;
            $scope.EmailAlert_Active();
        };

        /* 
            Calling the api method to activate the details of Email Template
            matching the specified Email Template Id,
            and redirected to the list page.
           */
        $scope.EmailAlert_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Alert details?',
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
                    $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Alert details has been activated successfully");
                        toastr.success("Selected Alert details has been activated successfully", "success");
                        $scope.EmailAlertlist();
                    }).error(function (data) {
                        $scope.error = "An error has occured while deleting alert records" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Alert details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Alert details has been activated successfully");
                    toastr.success("Selected Alert details has been activated successfully", "success");
                    $scope.EmailAlertlist();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting alert records" + data;
                });
            }*/
        };

        $scope.Active_ErrorFunction = function () {
            //alert("Inactive Alert details cannot be edited");
            toastr.info("Inactive Alert details cannot be edited", "info");
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddEmailAlertPopUP = function () {
            angular.element('#EmailAlertModal').modal('show');
            $('#btnsave').attr("disabled", false);
            $scope.status = 1;
            //$scope.ClearPopup();
            $('[data-id="select1"]').prop('disabled', false);
            $scope.Eventselected();

        }

        /* THIS IS OPENING POP WINDOW FORM VIEW */
        $scope.ViewEmailAlertPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.EventClear();
            $scope.ViewEmailAlert();
            angular.element('#EmailAlertViewModal').modal('show');
        }

        /* THIS IS OPENING POP WINDOW FORM EDIT */
        $scope.EditEmailAlert = function (CatId) {
            $scope.Id = CatId;
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/EmailAlertConfig/AlertEvent_List/?Institution_Id=' + $scope.InstituteId + '&Id=' + 0
                + '&status=3').success(function (data) {
                $scope.AlertListTemp = [];
                $scope.AlertListTemp = data;
                if (data != null) {
                    $scope.AlertEvent = angular.copy($scope.AlertListTemp);
                }
                $scope.EventClear();
                $scope.ViewEmailAlert();
                    $scope.status = 0;
                $('[data-id="select1"]').prop('disabled', true);
                angular.element('#EmailAlertModal').modal('show');
                $('#btnsave').attr("disabled", false);
            });
        }

        /* THIS IS CANCEL POPUP FUNCTION */
        $scope.CancelPopUP = function () {
            angular.element('#EmailAlertModal').modal('hide')
        }

        /* THIS IS CANCEL VIEW POPUP FUNCTION*/
        $scope.CancelViewPopup = function () {
            $scope.ClearPopup();
            angular.element('#EmailAlertViewModal').modal('hide')
            angular.element('#EmailAlertModal').modal('hide')
        }
        $scope.EventClear = function () {
            $scope.Institution_Id = "0";
            $scope.Institution_Name = "";
            //$scope.EmailFlag = 0;
            $scope.EmailTemplate = "0";
          //  $scope.AppFlag = 0;
           // $scope.AppTemplate = "0";
           // $scope.AppFlag = 0;
            $scope.AppTemplate = "0";
            $scope.AlertDays = "";
            $scope.WebTempId = -1;
            $scope.AppTempId = -1;
            $scope.EmailTempId = -1;
            $scope.EventCC = "";
            $scope.EventTo = "";
            //$scope.SMSFlag = 0;
            $scope.SMSTemplate = "0";
            $scope.SMSTempId = -1;
        };

        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.Institution_Id = "0";
            $scope.Institution_Name = "";
            $scope.Event_Id = "0";
            $scope.Event = "0";
            $scope.EmailFlag = 0;
            $scope.EmailTemplate = "0";
            $scope.AppFlag = 0;
            $scope.AppTemplate = "0";
            $scope.WebFlag = 0;
            $scope.WebTemplate = "0";
            $scope.SMSFlag = 0;
            $scope.SMSTemplate = "0";
            $scope.AlertDays = "";
            $scope.WebTempId = -1;
            $scope.AppTempId = -1;
            $scope.EmailTempId = -1;
            $scope.SMSTemplate = -1;
        }

        /* THIS IS OPENING POP WINDOW FORM LIST */
        $scope.ListEmailAlertPopUP = function (EmailAlertCatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.EmailAlertList();
        }
    }
]);