var EmailTemplatecontroller = angular.module("EmailTemplateController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

EmailTemplatecontroller.controller("EmailTemplateController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.Id = "0";
        $scope.DuplicateId = "0";
        $scope.UserTypeId = parseInt($window.localStorage["UserTypeId"]);
        $scope.flag = 0;
        $scope.TagType = 0;
        $scope.InsTagType = 0;
        $scope.IsActive = true;
        $scope.TemplateName = "";
        $scope.AlertTagName = "";
        $scope.Event = "";
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.InsAlertEvent = [];
        $scope.eventalertins = [];
        $scope.eventalertins1 = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.SectionType = "";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.TemplateTagList = [];
        if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage["UserTypeId"] == 1) {
            $http.get(baseUrl + '/api/EmailTemplate/TemplateTag_List/?Id=' + $scope.InstituteId).success(function (data) {
                $scope.TemplateTagList = data;
            });
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }
        //var selobj = { "EventName": "Select", "Id": "0", "IsActive": 1 };
        //$scope.InsAlertEvent.push(selobj);
        var obj = { "EventName": "User Creation", "Id": "1", "IsActive": 1 };
        $scope.InsAlertEvent.push(obj);
        var obj1 = { "EventName": "Institution And Subscription Creation", "Id": "2", "IsActive": 1 };
        $scope.InsAlertEvent.push(obj1);
        
        $scope.TemplateTagMappingList = [];
        //$scope.TempMappinglist = function () {
        //    if ($scope.UserTypeId != 1) {
        //        if ($scope.PageParameter == 1) {
        //            $scope.Type = "1"; //For Email
        //        }
        //        else if ($scope.PageParameter == 2) {
        //            $scope.Type = "2";//For Notification
        //        }
        //        else if ($scope.PageParameter == 3) {
        //            $scope.Type = "3";//For SMS
        //        }
        //        $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateTagMapping_List/?Id=' + $scope.Type + '&Institution_Id=' + $scope.InstituteId).success(function (data) {
        //            $scope.TemplateTagMappingList = data;
        //        });
        //    }
        //    else {
        //        if ($scope.PageParameter == 1) {
        //            $scope.Type = "1"; //For Email
        //        }
        //        else if ($scope.PageParameter == 2) {
        //            $scope.Type = "2";//For Notification
        //        }
        //        else if ($scope.PageParameter == 3) {
        //            $scope.Type = "3";//For SMS
        //        }
        //        $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateTagMapping_List/?Id=' + $scope.Type + '&Institution_Id=' + $scope.InstituteId).success(function (data) {
        //            $scope.TemplateTagMappingList = data;
        //        });
        //    }
        //};

        $scope.OnChangeIns_TypeBasedTagList = function (InsTagType) {
            if (InsTagType == "1") {
                $scope.SectionType = "BASIC";
                $scope.AlertTagName = InsTagType.toString();
                $scope.InsTagType = InsTagType.toString();
            }
            if (InsTagType == "2") {
                $scope.SectionType = "INS_SUB_DETAILS";
                $scope.AlertTagName = InsTagType.toString();
                $scope.InsTagType = InsTagType.toString();
            }
            $scope.TemplateTagMappingList = [];
            if ($scope.PageParameter == 1) {
                $scope.Type = "1"; //For Email
            }
            else if ($scope.PageParameter == 2) {
                $scope.Type = "2";//For Notification
            }
            else if ($scope.PageParameter == 3) {
                $scope.Type = "3";//For SMS
            }
            if (InsTagType != "" && InsTagType != "0" && InsTagType != 0) {
                $http.get(baseUrl + '/api/EmailTemplate/SectionEmailTemplateTagMapping_List/?Id=' + 0 + '&Institution_Id=' + $scope.InstituteId + '&SectionName=' + $scope.SectionType + '&Type=' + $scope.Type).success(function (data) {
                    $scope.TemplateTagMappingList = data;
                    $scope.rowCollectionTagFilter = angular.copy($scope.TemplateTagMappingList);
                });
            }
        }

        $scope.OnChangeTypeBasedTagList = function (TagType) {
            var Mode = "";
            if ($scope.UserTypeId == '1')
                Mode = 1;
            if ($scope.UserTypeId == '3')
                Mode = 2;
            if (Mode == 2) {
                var TZ = $scope.AlertEvent.filter(x => x.Id == TagType);
                var EmailSectionType = TZ[0].EventName;
                $scope.AlertTagName = TagType;
                $scope.SectionType = "";
                if (EmailSectionType == "Appointment approval for CG")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Appointment approved by CG")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Appointment Cancellation Reason")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Business User Creation")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "CG assignment by CC email")
                    $scope.SectionType = "BASIC,CG_ASSIGN";
                else if (EmailSectionType == "Change Password")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Clinicians Note")
                    $scope.SectionType = "BASIC,CLINICIAN_NOTE";
                else if (EmailSectionType == "Compliance Alert High")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Compliance Alert Low")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Compliance Alert Medium")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Diagnostic Alert High")
                    $scope.SectionType = "BASIC,DIAG_COMP_ALERT";
                else if (EmailSectionType == "Diagnostic Alert Low")
                    $scope.SectionType = "BASIC,DIAG_COMP_ALERT";
                else if (EmailSectionType == "Diagnostic Alert Medium")
                    $scope.SectionType = "BASIC,DIAG_COMP_ALERT";
                else if (EmailSectionType == "Missed Call by doctor")
                    $scope.SectionType = "APPOINTMENT,CG_ASSIGN";
                else if (EmailSectionType == "Missed Call by patient")
                    $scope.SectionType = "APPOINTMENT,CG_ASSIGN";
                else if (EmailSectionType == "Patient Appointment Cancellation")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Patient Appointment Creation")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Patient Appointment Reminder(to Doctor)")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Patient Appointment Reminder(to Patient)")
                    $scope.SectionType = "BASIC,APPOINTMENT";
                else if (EmailSectionType == "Patient Sign up")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Patient Sign up Approved")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Patient sign up more information required")
                    $scope.SectionType = "BASIC,PATIENT_MOREINFO";
                else if (EmailSectionType == "Patient SignUp for Hospital Admin")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Reset Password")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Doctor Shift Expiry")
                    $scope.SectionType = "DOCTOR_SHIFT";
                else if (EmailSectionType == "Nearing user limit")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Nearing patient limit")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Target Achieved Daily")
                    $scope.SectionType = "BASIC,APPOINTMENT,CG_ASSIGN";
                else if (EmailSectionType == "Target Achieved weekly")
                    $scope.SectionType = "BASIC,APPOINTMENT,CG_ASSIGN";
                else if (EmailSectionType == "New data captured - indication")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "CG assignment by CC email")
                    $scope.SectionType = "BASIC,CG_ASSIGN";
                else if (EmailSectionType == "Password Expiry Period")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Licence expiry")
                    $scope.SectionType = "BASIC";
                else if (EmailSectionType == "Notify to Admin for Expiring Doctor Shift Expiry")
                    $scope.SectionType = "DOCTOR_SHIFT";
                else if (EmailSectionType == "Payment Success")
                    $scope.SectionType = "APPOINTMENT,DOCTOR_SHIFT";
                else if (EmailSectionType == "Payment Failure")
                    $scope.SectionType = "APPOINTMENT,DOCTOR_SHIFT";
            }
            else if (Mode == 1) {
                if (TagType == "1") {
                    $scope.SectionType = "BASIC";
                    $scope.AlertTagName = TagType.toString();
                    $scope.TagType = TagType.toString();
                }
                if (TagType == "2") {
                    $scope.SectionType = "INS_SUB_DETAILS";
                    $scope.AlertTagName = TagType.toString();
                    $scope.TagType = TagType.toString();
                }
            }
            else (EmailSectionType == "0" || EmailSectionType == null || EmailSectionType == undefined || EmailSectionType == "")
                $scope.TemplateTagMappingList = [];
            if ($scope.PageParameter == 1) {
                $scope.Type = "1"; //For Email
            }
            else if ($scope.PageParameter == 2) {
                $scope.Type = "2";//For Notification
            }
            else if ($scope.PageParameter == 3) {
                $scope.Type = "3";//For SMS
            }
            $http.get(baseUrl + '/api/EmailTemplate/SectionEmailTemplateTagMapping_List/?Id=' + 0 + '&Institution_Id=' + $scope.InstituteId + '&SectionName=' + $scope.SectionType + '&Type=' + $scope.Type).success(function (data) {
                $scope.TemplateTagMappingList = data;
                $scope.rowCollectionTagFilter = angular.copy($scope.TemplateTagMappingList);
            });
        };

        $scope.Eventselected = function () {
            if ($scope.UserTypeId == 1) {
                $scope.status = 2;
            }
            else if ($scope.UserTypeId == 3) {
                $scope.status = 0;
            } else {
                $scope.status = 1;
            }
            //if ($scope.PageParameter == 1) {
            //    $scope.Type = "1"; //For Email
            //}
            //else if ($scope.PageParameter == 2) {
            //    $scope.Type = "2";//For Notification
            //}
            //else if ($scope.PageParameter == 3) {
            //    $scope.Type = "3";//For SMS
            //}
            if ($scope.UserTypeId == 1) {
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
            }
            else if ($scope.UserTypeId == 3) {
                $http.get(baseUrl + '/api/EmailAlertConfig/DefaultAlertEvent_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                        $scope.AlertListTemp = [];
                        $scope.AlertListTemp = data;
                        if (data != null) {
                            /*var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                            $scope.AlertListTemp.splice(0, 0, obj);*/
                            $scope.AlertEvent = angular.copy($scope.AlertListTemp);
                        }
                    });
            }
        };

        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            //if ($scope.PageParameter == 1 || $scope.PageParameter == 3) {
            $scope.Template = (CKEDITOR.instances.editor1.getData());
            //}
            if (typeof ($scope.TemplateName) == "undefined" || $scope.TemplateName == "") {
                //alert("Please enter Template Name");
                toastr.warning("Please enter Template Name", "warning");
                return false;
            }

            else if (typeof ($scope.EmailSubject) == "undefined" || $scope.EmailSubject == "") {
                if ($scope.PageParameter == 1)
                    //alert("Please enter Email Subject");
                    toastr.warning("Please enter Email Subject", "warning");
                else
                    //alert("Please enter Notification Title");
                    toastr.warning("Please enter Notification Title", "warning");

                return false;
            }
            else if (typeof ($scope.Template) == "undefined" || $scope.Template == "") {
                if ($scope.PageParameter == 1)
                    //alert("Please enter Email Template");
                    toastr.warning("Please enter Email Template", "warning");
                else if ($scope.PageParameter == 3)
                    toastr.warning("Please enter SMS Template", "warning");
                else
                    //alert("Please enter Notification Message");
                    toastr.warning("Please enter Notification Message", "warning");

                return false;
            }
            else if (typeof ($scope.EmailSubject) == "undefined" || $scope.EmailSubject == "") {
                if ($scope.PageParameter == 3)
                    toastr.warning("Please enter SMS Template", "warning");
                return false;
            }
            return true;
        };

        /* Array initialization */
        $scope.EamilTemplateTaglist = [];
        $scope.EamilTemplateTaglist = [{
            'Id': 0,
            'Institution_Id': 0,
            'Email_TemplateId': '',
            'TagName': '',
            'Institution_Name': '',
            'IsActive': 0,
            'Created_By': ''
        }];

        $scope.EmailTemplateTagDetails = [];

        /* THIS IS FOR ADD/EDIT FUNCTION */
        $scope.EmailTemplateAddEdit = function () {
            //if ($scope.PageParameter == 1 || $scope.PageParameter == 3) {
            if (CKEDITOR.instances['editor1'].getData() != "") {
                $('#divEditor').removeClass('ng-invalid');
                $('#divEditor').addClass('ng-valid');
            } else {
                $('#divEditor').removeClass('ng-valid');
                $('#divEditor').addClass('ng-invalid');
                return false;
            }
            //}

            //if ($scope.PageParameter == 1 || $scope.PageParameter == 3) {
            $scope.Template = (CKEDITOR.instances.editor1.getData());
            //}
            if ($scope.Validationcontrols() == true) {

                var TemplateChildList = [],

                    rxp = /{([^}]+)}/g,

                    TagName = $scope.Template,

                    arr;
                while (arr = rxp.exec(TagName)) {
                    TemplateChildList.push({
                        'TempName': arr[1]
                    });
                }

                angular.forEach(TemplateChildList, function (value, index) {

                    angular.forEach($scope.EamilTemplateTaglist, function (Selected, index) {

                        var obj = {
                            Id: Selected.Id,
                            Institution_Id: $scope.InstituteId,
                            Email_TemplateId: $scope.PageParameter == 1 ? '1' : $scope.PageParameter == 2 ? '2' : $scope.PageParameter == 3 ? '3' : '',
                            TagName: value.TempName,
                            IsActive: Selected.IsActive,
                            Created_By: $scope.Patient_Id
                        }
                        $scope.EmailTemplateTagDetails.push(obj);
                    });
                });

                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $scope.InstituteId,
                    TemplateType_Id: $scope.PageParameter == 1 ? 1 : $scope.PageParameter == 2 ? 2 : $scope.PageParameter == 3 ? 3 : '',
                    //Type_Id: $scope.Type,
                    EmailSubject: $scope.EmailSubject,
                    EmailTemplate: $scope.Template,
                    ModifiedUser_Id: $scope.Patient_Id,
                    Created_By: $scope.Patient_Id,
                    EmailTemplateTagList: $scope.EmailTemplateTagDetails,
                    TemplateName: $scope.TemplateName,
                    TemplateAlertType: $scope.AlertTagName != '' ? $scope.AlertTagName : 0
                }
                $("#chatLoaderPV").show();
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/EmailTemplate/EmailTemplateTag_AddEdit/', obj).success(function (data) {
                    //alert(data.Message);
                    toastr.success(data.Message, "success");
                    $("#chatLoaderPV").hide();
                    $('#btnsave').attr("disabled", false);
                    if (data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.EmailTemplatelist();
                    }
                    //$scope.AddId = data;
                    $("#chatLoaderPV").hide();
                    angular.element('#EmailTemplateModal').modal('hide');
                })
            }
        } 

        /* THIS IS FOR LIST PROCEDURE */
        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];

        $scope.EmailTemplatelist = function () {
            if ($window.localStorage['UserTypeId'] == 3 || $window.localStorage["UserTypeId"] == 1) {
                $("#chatLoaderPV").show();
                $scope.ISact = 1;       // default active

                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }
                $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateTag_List/?Id=' + $scope.InstituteId + '&IsActive=' + $scope.ISact + '&TemplateType_Id=' + $scope.PageParameter).success(function (data) {
                    $scope.emptydata = [];
                    $scope.rowCollection = [];
                    $scope.EmailTempalteCollection  = [];
                    $scope.rowCollection = data;
                    angular.forEach($scope.rowCollection, function (value, index) {
                        value.EmailTemplate = value.EmailTemplate.replace("<p>", "").replace("</p>", "").replace("<br>", "").replace("</br>", "").replace("?\r\n", "").replace("<p>", "");
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

        $scope.searchquery = "";
        /* FILTER THE LIST FUNCTION.*/
        $scope.fliterTemplateList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Institution_Name).match(searchstring) ||
                        angular.lowercase(value.TemplateName).match(searchstring) ||
                        angular.lowercase(value.EmailSubject).match(searchstring) ||
                        angular.lowercase(value.EmailTemplate).match(searchstring);
                });
            }
        }

        $scope.searchquery1 = "";
        $scope.fliterTagList = function () {
            $scope.ResultTagListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery1);
            if ($scope.searchquery1 == "") {
                $scope.TemplateTagMappingList = angular.copy($scope.rowCollectionTagFilter);
            }
            else {
                $scope.TemplateTagMappingList = $ff($scope.rowCollectionTagFilter, function (value) {
                    return angular.lowercase(value.TagList).match(searchstring);
                });
            }
        }

        /* THIS IS FOR VIEW FUNCTION */
        $scope.ViewEmailTempalte = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $scope.Eventselected();
            $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateDetails_View/?Id=' + $scope.Id).success(function (data) {

                $scope.DuplicatesId = data.Id;
                $scope.Institution_Id = data.Institution_Id;
                $scope.Institution_Name = data.Institution_Name;
                $scope.TemplateType_Id = data.TemplateType_Id;
                $scope.TemplateName = data.TemplateName;
                $scope.EmailSubject = data.EmailSubject;
                $scope.Template = data.EmailTemplate;
                $scope.Type = data.Type_Id.toString();
                $scope.ViewType_Name = data.Type_Name;
                $scope.TemplateTagMappingList = data.EmailTemplateTagList;
                //if ($scope.TemplateType_Id == 1 || $scope.TemplateType_Id == 3) {
                $scope.ViewTemplate = CKEDITOR.instances.editor1.setData($scope.Template);
                //}
                //$scope.TempMappinglist();
                if ($scope.UserTypeId == 3) {
                    $scope.TagType = data.TemplateAlertType.toString();
                    $scope.OnChangeTypeBasedTagList($scope.TagType);
                }
                if ($scope.UserTypeId == 1) {
                    $scope.InsTagType = data.TemplateAlertType.toString();
                    $scope.OnChangeTypeBasedTagList($scope.InsTagType);
                }
                //$scope.TagType = data.TemplateAlertType.toString();
                //$scope.OnChangeTypeBasedTagList($scope.TagType);
                $("#chatLoaderPV").hide();
            });
        }

        $scope.DeleteEmailTempalte = function (DId) {
            $scope.Id = DId;
            $scope.EmailTempalte_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.EmailTempalte_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Template?',
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
                    $http.get(baseUrl + '/api/EmailTemplate/EmailTemplate_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Template has been deactivated Successfully");
                        toastr.success("Template has been deactivated Successfully", "success");
                        $scope.EmailTemplatelist();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var del = confirm("Do you like to deactivate the selected Template?");
             if (del == true) {
                 $http.get(baseUrl + '/api/EmailTemplate/EmailTemplate_Delete/?Id=' + $scope.Id).success(function (data) {
                     //alert("Template has been deactivated Successfully");
                     toastr.success("Template has been deactivated Successfully", "success");
                     $scope.EmailTemplatelist();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                 });
             }*/
        };

        /* THIS IS FOR ACTIVE FUNCTION*/
        $scope.ActiveEmailTempalte = function (PId) {
            $scope.Id = PId;
            $scope.EmailTempalte_Active();
        };

        /* 
            Calling the api method to activate the details of Email Template
            matching the specified Email Template Id,
            and redirected to the list page.
           */
        $scope.EmailTempalte_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Template?',
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
                    $http.get(baseUrl + '/api/EmailTemplate/EmailTemplate_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Template has been activated successfully");
                        toastr.success("Selected Template has been activated successfully", "success");
                        $scope.EmailTemplatelist();
                    }).error(function (data) {
                        $scope.error = "An error has occured while deleting ICD 1O records" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Template?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/EmailTemplate/EmailTemplate_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Template has been activated successfully");
                    toastr.success("Selected Template has been activated successfully", "success");
                    $scope.EmailTemplatelist();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting ICD 1O records" + data;
                });
            }*/
        };

        $scope.Active_ErrorFunction = function () {
            //alert("Inactive Template cannot be edited");
            toastr.info("Inactive Template cannot be edited", "info");
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddEmailTemplatePopUP = function () {
            $scope.submitted = false;
            angular.element('#EmailTemplateModal').modal('show');
            $('#btnsave').attr("disabled", false);
            $scope.ClearPopup();
        }

        /* THIS IS OPENING POP WINDOW FORM VIEW */
        $scope.ViewEmailTemplatePopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewEmailTempalte();
            angular.element('#EmailTemplateViewModal').modal('show');
        }

        /* THIS IS OPENING POP WINDOW FORM EDIT */
        $scope.EditEmailTemplate = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewEmailTempalte();
            angular.element('#EmailTemplateModal').modal('show');
            $('#btnsave').attr("disabled", false);
        }

        /* THIS IS CANCEL POPUP FUNCTION */
        $scope.CancelPopUP = function () {
            angular.element('#EmailTemplateModal').modal('hide');
            $scope.TagType = 0;
            $scope.InsTagType = 0;
            $scope.TemplateTagMappingList = [];
            $scope.searchquery1 = "";
        }

        /* THIS IS CANCEL VIEW POPUP FUNCTION*/
        $scope.CancelViewPopup = function () {
            angular.element('#EmailTemplateViewModal').modal('hide')
        }

        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.Institution_Id = "0";
            $scope.Institution_Name = "";
            $scope.TemplateType_Id = "0";
            $scope.TemplateName = "";
            $scope.EmailSubject = "";
            $scope.EmailTemplate = "";
            $scope.searchquery1 = "";
            $scope.Type = "0";
            $scope.Template = "";
            //if ($scope.PageParameter == 1 || $scope.PageParameter == 3) {
            $scope.Template = CKEDITOR.instances.editor1.setData($scope.Template);
            $scope.TagType = 0;
            $scope.InsTagType = 0;
            $scope.TemplateTagMappingList = [];
            //}
        }

        /* THIS IS OPENING POP WINDOW FORM LIST */
        $scope.ListICD10PopUP = function (EmailTemplateCatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.EmailTemplateList();
        }
    }
]);