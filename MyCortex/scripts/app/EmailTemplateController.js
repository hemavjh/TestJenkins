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
        $scope.flag = 0;
        $scope.IsActive = true;
        $scope.TemplateName = "";
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.TemplateTagList = [];
        if ($window.localStorage['UserTypeId'] == 3) {
            $http.get(baseUrl + '/api/EmailTemplate/TemplateTag_List/?Id=' + $scope.InstituteId).success(function (data) {
                $scope.TemplateTagList = data;
            });
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }

        $scope.TemplateTagMappingList = [];
        $scope.TempMappinglist = function () {
            if ($scope.PageParameter == 1) {
                $scope.Type = "1"; //For Email
            }
            else if ($scope.PageParameter == 2) {
                $scope.Type = "2";//For Notification
            }
            else if ($scope.PageParameter == 3) {
                $scope.Type = "3";//For SMS
            }
            $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateTagMapping_List/?Id=' + $scope.Type + '&Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.TemplateTagMappingList = data;
            });
        };

        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            if ($scope.PageParameter == 1) {
                $scope.Template = (CKEDITOR.instances.editor1.getData());
            }
            else if ($scope.PageParameter == 3) {
                $scope.Template = (CKEDITOR.instances.editor1.getData());
            }
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
                    warning("Please enter Notification Title", "warning");

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
            //if ($scope.Validationcontrols() == true) {
            
            if ($scope.editor1 != "") {
                $('#divSMSEditor').removeClass("ng-valid");
                $('#divSMSEditor').addClass("ng-invalid");
            }
            else {
                $('#divSMSEditor').removeClass("ng-invalid");
                $('#divSMSEditor').addClass("ng-valid");
            }
            //$window.alert($scope.Template);
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
                    TemplateType_Id: $scope.PageParameter == 1 ? '1' : $scope.PageParameter == 2 ? '2' : $scope.PageParameter == 3 ? '3' : '',
                    //Type_Id: $scope.Type,
                    EmailSubject: $scope.EmailSubject,
                    EmailTemplate: $scope.Template,
                    ModifiedUser_Id: $scope.Patient_Id,
                    Created_By: $scope.Patient_Id,
                    EmailTemplateTagList: $scope.EmailTemplateTagDetails,
                    TemplateName: $scope.TemplateName
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
            //}
        }

        /* THIS IS FOR LIST PROCEDURE */
        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];

        $scope.EmailTemplatelist = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
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
                    $scope.rowCollection = data;
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

        /* THIS IS FOR VIEW FUNCTION */
        $scope.ViewEmailTempalte = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }

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
                if ($scope.TemplateType_Id == 1 || $scope.TemplateType_Id == 3) {
                    $scope.ViewTemplate = CKEDITOR.instances.editor1.setData($scope.Template);
                }
                $scope.TempMappinglist();
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
            angular.element('#EmailTemplateModal').modal('hide')
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
            $scope.Type = "0";
            $scope.Template = "";
            if ($scope.PageParameter == 1 || $scope.PageParameter == 3) {
                $scope.Template = CKEDITOR.instances.editor1.setData($scope.Template);
            }
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