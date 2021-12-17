var EmailUndeliveredcontroller = angular.module("EmailUndeliveredController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

EmailUndeliveredcontroller.controller("EmailUndeliveredController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.currentTab = "1";
        $scope.Id = "0";
        $scope.IsActive = 1;
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.loadCount = 0;
        $scope.TabClick = false;

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

        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.EthnicGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];
        $scope.BloodGroupList = [];
        $scope.GroupTypeList = [];

        $scope.MessageUndeliveredDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/').success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $scope.InstitutionBased_CountryStateList();
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

        $scope.InstitutionBased_CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;
            });
        }
        $scope.Country_onChange = function () {
            $scope.StateNameList = $ff($scope.State_Template, { CountryId: $scope.CountryId });
            setTimeout(function () {
                jQuery("#stateselectpicker").selectpicker('refresh')
            }, 500);
        };
        $scope.StateClearFunction = function () {
            $scope.StateId = "0";
        };
        $scope.State_onChange = function () {
            $scope.CityNameList = $ff($scope.City_Template, { StateId: $scope.StateId });
        };
        $scope.LocationClearFunction = function () {
            $scope.CityId = "0";
        };

        /*    $scope.Filter_Country_onChange = function () {
                $scope.StateNameList = $ff($scope.State_Template, { CountryId: $scope.filter_CountryId });
                setTimeout(function () {
                    jQuery("#stateselectpicker").selectpicker('refresh')
                }, 500);
            };
            $scope.Filter_State_onChange = function () {
                $scope.CityNameList = $ff($scope.City_Template, { StateId: $scope.filter_StataId });
            };
            */
        $scope.FilterValidation = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.Period_From = moment($scope.Period_From).format('DD-MMM-YYYY');
            $scope.Period_To = moment($scope.Period_To).format('DD-MMM-YYYY');

            if (typeof ($scope.Period_From) == "undefined" || $scope.Period_From == "") {
                //alert("Please select Period From");
                toastr.warning("Please select Period From", "warning");

                return false;
            }
            //else if (isDate($scope.Period_From) == false) {
            //    alert("Period From is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            if (typeof ($scope.Period_To) == "undefined" || $scope.Period_To == "") {
                //alert("Please select Period To");
                toastr.warning("Please select Period To", "warning");
                return false;
            }
            //else if (isDate($scope.Period_To) == false) {
            //    alert("Period To is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            if (($scope.Period_From != "") && ($scope.Period_To != "")) {
                if ((ParseDate($scope.Period_From) > ParseDate($scope.Period_To))) {
                    //alert("From Date should not be greater than To Date");
                    toastr.warning("From Date should not be greater than To Date", "warning");
                    $scope.Period_From = DateFormatEdit($scope.Period_From);
                    $scope.Period_To = DateFormatEdit($scope.Period_To);
                    return false;
                }
            }
            var date1 = new Date($scope.Period_From);
            var date2 = new Date($scope.Period_To);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 14) {
                //alert("14 days only allowed to filter");
                toastr.warning("14 days only allowed to filter", "warning");
                return false;
            }
            //if ((ParseDate($scope.Period_From) < ParseDate(today))) {
            //    //alert("FromDate Can Be Booked Only For Past");
            //    toastr.warning("FromDate Can Be Booked Only For Past", "warning");
            //    $scope.Period_From = DateFormatEdit($scope.Period_From);
            //    $scope.Period_To = DateFormatEdit($scope.Period_From);
            //    return false;
            //}
            //if ((ParseDate($scope.Period_To) < ParseDate(today))) {
            //    //alert("To Date Can Be Booked Only For Past");
            //    toastr.warning("To Date Can Be Booked Only For Past", "warning");
            //    $scope.Period_From = DateFormatEdit($scope.Period_From);
            //    $scope.Period_To = DateFormatEdit($scope.Period_From);
            //    return false;
            //}
            //if (($scope.Period_From != "") && ($scope.Period_To != "")) {
            //    if ((ParseDate($scope.Period_From) > ParseDate($scope.Period_To))) {
            //        //alert("From Date should not be greater than To Date");
            //        toastr.warning("From Date should not be greater than To Date", "warning");
            //        $scope.Period_From = DateFormatEdit($scope.Period_From);
            //        $scope.Period_To = DateFormatEdit($scope.Period_To);
            //        return false;
            //    }
            //}
            $scope.Period_From = DateFormatEdit($scope.Period_From);
            $scope.Period_To = DateFormatEdit($scope.Period_To);
            return true;
        };


        $scope.Emailemptydata = [];
        $scope.EmailrowCollectionFilter = [];
        $scope.Emaildatalist = [];
        $scope.UndeliveredEmailDetailslist = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                if ($scope.FilterValidation() == true) {
                    $("#chatLoaderPV").show();
                    $scope.Email_Stauts = "2";
                    $scope.Period_From = document.getElementById("Period_From").value;
                    $scope.Period_To = document.getElementById("Period_To").value;

                    $scope.Period_From = moment($scope.Period_From).format('YYYY-MM-DD');
                    $scope.Period_To = moment($scope.Period_To).format('YYYY-MM-DD');

                    $http.get(baseUrl + '/api/SendEmail/EmailHistory_List/?Id=' + $scope.Id + '&Period_From=' + $scope.Period_From + '&Period_To=' + $scope.Period_To + '&Email_Stauts=' + $scope.Email_Stauts
                        + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&IsActive=' + $scope.IsActive + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId']
                        + '&TemplateType_Id=' + $scope.PageParameter + '&Login_Session_Id=' + $scope.LoginSessionId
                    ).success(function (data) {
                        $scope.Emailemptydata = [];
                        $scope.EmailrowCollectionFilter = [];
                        $scope.Emailemptydata = data;
                        $scope.Emaildatalist = data;
                        $scope.EmailrowCollectionFilter = angular.copy($scope.Emailemptydata);
                        $("#chatLoaderPV").hide();
                    });
                }
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.searchquerylist = "";

        //$scope.EmailrowCollectionFilter =[];
        /* FILTER THE LIST FUNCTION.*/
        $scope.filterEmailHistoryList = function () {
            $scope.EmailrowCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquerylist);
            if ($scope.searchquerylist == "") {
                if ($scope.Emaildatalist.length > 0) {
                    $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
                }
            }
            else {
                $scope.EmailrowCollectionFilter = $ff($scope.Emaildatalist, function (value) {

                    return angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.TypeName).match(searchstring) ||
                        angular.lowercase(value.TemplateName).match(searchstring) ||
                        angular.lowercase(value.EmailSubject).match(searchstring) ||
                        angular.lowercase(value.EmailTemplate).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Send_Date, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.Email_Error_Reason).match(searchstring);
                });
            }
        }


        $scope.ResetPatientFilter = function () {
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
        }
        $scope.Generated_TemplateList = [];
        $scope.GenerateTemplate = function (EmailTemplate, EmailId, EmailSubject) {
            angular.element('#Template_PreviewModel').modal('show');
            $scope.EmailSubject = EmailSubject;
            $scope.Generated_Template = EmailTemplate;
            $scope.EmailId = EmailId;
        }
        $scope.ClearValues = function () {
            angular.forEach($scope.Filter_SendEmailUserList, function (SelectedUser, index) {
                SelectedUser.SelectedUser = false;
            });
            $scope.SelectedAllUser = false;
        }
        $scope.CancelPreview_PopUp = function () {
            angular.element('#Template_PreviewModel').modal('hide');
        }

        $scope.checkAll = function () {
            if ($scope.SelectedAllUser == true) {
                $scope.SelectedAllUser = true;
            } else {
                $scope.SelectedAllUser = false;
            }
            angular.forEach($scope.EmailrowCollectionFilter, function (row) {
                row.SelectedUser = $scope.SelectedAllUser;
            });
        };

        $scope.UndeliveredEmail_Insert = function () {

            var cnt = ($filter('filter')($scope.EmailrowCollectionFilter, 'true')).length;
            if (cnt == 0) {
                //alert("Please select atleast one User");
                toastr.warning("Please select atleast one User", "warning");
            }
            else {
                var msg = confirm("Do you like to Resend the Email for Selected User?");
                if (msg == true) {
                    $("#chatLoaderPV").show();
                    $scope.SelectedUserList = [];
                    angular.forEach($scope.EmailrowCollectionFilter, function (SelectedUser, index) {
                        if (SelectedUser.SelectedUser == true) {

                            var obj = {
                                UserId: SelectedUser.Id,
                                Template_Id: SelectedUser.Template_Id,
                                Created_By: $scope.UserId,
                                Institution_Id: $scope.InstituteId,
                                EmailId: SelectedUser.EmailId,
                                TemplateType_Id: $scope.PageParameter
                            };
                            $('#btnsave').attr("disabled", true);
                            $scope.SelectedUserList.push(obj);
                        }
                    });
                    $http.post(baseUrl + '/api/SendEmail/UndeliveredEmail_Insert/', $scope.SelectedUserList).success(function (data) {
                        //alert(data.Message);
                        toastr.success(data.Message, "success");
                        $('#btnsave').attr("disabled", false);
                        if (data.ReturnFlag == 1) {
                            $scope.ClearValues();
                            $scope.UndeliveredEmailDetailslist();
                        }
                        $("#chatLoaderPV").hide();
                    });
                }
            }
        }

        $scope.UndeliveredEmail_EditModel = function (EmailTemplate, EmailId, EmailSubject, SendEmail_Id, UserId) {
            angular.element('#EditModal').modal('show');
            $('#btnsave').attr("disabled", false);
            $('#send').attr("disabled", false);
            $scope.SendEmail_Id = SendEmail_Id;
            $scope.EmailSubject = EmailSubject;
            $scope.Generated_Template = EmailTemplate;
            $scope.PrimaryKeyId = UserId;
            if ($scope.PageParameter == 2) {
                $scope.EditEmail_Body = EmailTemplate;
            }
            if ($scope.PageParameter == 1) {
                $scope.Generated_Template = CKEDITOR.instances.editor1.setData($scope.Generated_Template);
            }
            $scope.EmailId = EmailId;
        }

        $scope.UndeliveredEmail_Edit = function () {
            $("#chatLoaderPV").show();
            $('#save').attr("disabled", true);
            $('#send').attr("disabled", true);
            if ($scope.PageParameter == 1) {
                $scope.EditEmail_Body = (CKEDITOR.instances.editor1.getData());
            }
            $scope.SelectedUserList = [];
            var obj = {
                Id: $scope.SendEmail_Id,
                UserId: $scope.PrimaryKeyId,
                Created_By: $window.localStorage['UserId'],
                Institution_Id: $scope.InstituteId,
                EmailId: $scope.EmailId,
                Email_Body: $scope.EditEmail_Body,
                Email_Subject: $scope.EmailSubject
            };
            $http.post(baseUrl + '/api/SendEmail/UndeliveredEmail_Edit/', obj).success(function (data) {
                //alert(data.Message);
                if (data.ReturnFlag == 1) {
                    toastr.success(data.Message, "success");
                }
                else if (data.ReturnFlag == 0) {
                    toastr.info(data.Message, "info");
                }
                $('#save').attr("disabled", false);
                $('#send').attr("disabled", false);
                if (data.ReturnFlag == 1) {
                    angular.element('#EditModal').modal('hide');
                    $scope.UndeliveredEmailDetailslist();
                }
                $("#chatLoaderPV").hide();
            });
        }
        $scope.UndeliveredEmail_Cancel = function () {
            angular.element('#EditModal').modal('hide');
        }
    }
]);