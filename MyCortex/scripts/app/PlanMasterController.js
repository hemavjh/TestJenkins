var PlanMastercontroller = angular.module("PlanMasterController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

PlanMastercontroller.controller("PlanMasterController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        $scope.Id = "0";
        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.Category_ID = "0";
        $scope.IsActive = true;
        $scope.SelectedPayor = [];
        $scope.PayorMasterList = [];
        $scope.PlanName = "";
        $scope.SelectedPlan = [];
        $scope.ShortCode = "";
        $scope.Description = "";
        $scope.PackageName = "";
        $scope.FinancialClass = "";
        $scope.PriceCode = "";
        $scope.ReferCode = "";
        $scope.ValidFromDate = new Date();
        $scope.ValidToDate = new Date();
        $scope.PlanSave = true;

        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.total_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.User_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.ConfigCode = "PATIENTPAGE_COUNT";
        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
            $scope.page_size = data1[0].ConfigValue;
            $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
            $scope.PageEnd = $scope.current_page * $scope.page_size;
            $http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                $scope.PayorMasterList = data;
            });
        }).error(function (data) {
            $scope.error = "AN error has occured while Listing the records!" + data;
        })

        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            $scope.ValidFromDate = moment($scope.ValidFromDate).format('DD-MMM-YYYY');
            $scope.ValidToDate = moment($scope.ValidToDate).format('DD-MMM-YYYY');

            if (typeof ($scope.SelectedPayor) == "undefined" || $scope.SelectedPayor == "0" || $scope.SelectedPayor == "" || $scope.SelectedPayor == null) {
                //alert("Please Select Any Payor");
                toastr.warning("Please Select Any Payor", "warning");
                return false;
            }
            else if (typeof ($scope.PlanName) == "undefined" || $scope.PlanName == "") {
                //alert("Please enter PlanName");
                toastr.warning("Please enter PlanName", "warning");
                return false;
            }

            if (typeof ($scope.ShortCode) == "undefined" || $scope.ShortCode == "") {
                //alert("Please enter ShortCode");
                toastr.warning("Please enter ShortCode", "warning");
                return false;
            }
            else if (typeof ($scope.Description) == "undefined" || $scope.Description == "") {
                //alert("Please enter Description");
                toastr.warning("Please enter Description", "warning");
                return false;
            }
            else if (typeof ($scope.PackageName) == "undefined" || $scope.PackageName == "") {
                //alert("Please enter PackageName");
                toastr.warning("Please enter PackageName", "warning");
                return false;
            }
            else if (typeof ($scope.FinancialClass) == "undefined" || $scope.FinancialClass == "") {
                //alert("Please enter FinancialClass");
                toastr.warning("Please enter FinancialClass", "warning");
                return false;
            }
            else if (typeof ($scope.PriceCode) == "undefined" || $scope.PriceCode == "") {
                //alert("Please enter PriceCode");
                toastr.warning("Please enter PriceCode", "warning");
                return false;
            }
            else if (typeof ($scope.ReferCode) == "undefined" || $scope.ReferCode == "") {
                //alert("Please enter ReferCode");
                toastr.warning("Please enter ReferCode", "warning");
                return false;
            }
            else if (typeof ($scope.ValidFromDate) == "undefined" || $scope.ValidFromDate == "") {
                //alert("Please enter ValidFromDate");
                toastr.warning("Please enter ValidFromDate", "warning");
                return false;
            }
            else if (typeof ($scope.ValidToDate) == "undefined" || $scope.ValidToDate == "") {
                //alert("Please enter ValidToDate");
                toastr.warning("Please enter ValidToDate", "warning");
                return false;
            }
            if (($scope.ValidFromDate !== null) && ($scope.ValidToDate !== null)) {
                if ((ParseDate($scope.ValidToDate) < ParseDate($scope.ValidFromDate))) {
                    //alert("From Date should not be greater than To Date");
                    toastr.warning("From Date should not be greater than To Date", "warning");
                    $scope.ValidFromDate = DateFormatEdit($scope.ValidFromDate);
                    $scope.ValidToDate = DateFormatEdit($scope.ValidToDate);
                    return false;
                }
            }
            $scope.ValidFromDate = DateFormatEdit($scope.ValidFromDate);
            $scope.ValidToDate = DateFormatEdit($scope.ValidToDate);
            return true;
        };

        $scope.Planlist = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.ISact = 1;       // default active

                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = 0 //all
                }

                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                    $scope.page_size = data1[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $http.get(baseUrl + '/api/PlanMaster/PlanList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + $scope.PageStart +
                        '&EndRowNumber=' + $scope.PageEnd + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            $("#chatLoaderPV").hide();
                            $scope.emptydata = [];
                            $scope.rowCollection = [];
                            $scope.rowCollection = data;
                            if ($scope.rowCollection.length > 0) {
                                $scope.PatientCount = $scope.rowCollection[0].TotalRecord;
                            } else {
                                $scope.PatientCount = 0;
                            }
                            //$scope.PatientCount = $scope.rowCollection[0].TotalRecord;
                            $scope.rowCollectionFilter = angular.copy($scope.rowCollection);

                            if ($scope.rowCollectionFilter.length > 0) {
                                $scope.flag = 1;
                            }
                            else {
                                $scope.flag = 0;
                            }
                            $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.page_size));
                        })
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        /* THIS IS FOR ADD/EDIT PROCEDURE */
        $scope.PlanAddEdit = function () {
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    SelectPayor: parseInt($scope.SelectedPayor),
                    PlanName: $scope.PlanName,
                    ShortCode: $scope.ShortCode,
                    Description: $scope.Description,
                    FinancialClass: $scope.FinancialClass,
                    PackageName: $scope.PackageName,
                    PriceCode: $scope.PriceCode,
                    ReferCode: $scope.ReferCode,
                    ValidFromDate: $scope.ValidFromDate,
                    ValidToDate: $scope.ValidToDate,
                    CreatedBy: $scope.User_Id,
                    InstitutionId: $scope.InstituteId
                }
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/PlanMaster/PlanMasterAddEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
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
                        $scope.Planlist();
                        angular.element('#PlanMasterModal').modal('hide');
                    }
                    //$scope.AddId = data;
                    //angular.element('#ICD10Modal').modal('hide');
                });
            }
        }

        /* THIS IS FOR LIST PROCEDURE */
        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.setPage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else
                $scope.inputPageNo = PageNo;

            $scope.current_page = PageNo;
            $scope.Planlist();
        }

        $scope.searchquery = "";
        /* FILTER THE MASTER LIST FUNCTION.*/
        $scope.fliterPayorList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.PayorName).match(searchstring) ||
                        angular.lowercase(value.ShortCode).match(searchstring) ||
                        angular.lowercase(value.ReferCode).match(searchstring) ||
                        angular.lowercase(value.Description).match(searchstring);
                });
            }
        }

        /* THIS IS FOR VIEW PROCEDURE */

        $scope.ViewPlan = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $scope.EditSelectedPayor = [];
            //$scope.SelectedPayor = [];
            $http.get(baseUrl + '/api/PlanMaster/PlanMasterView/Id?=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SelectedPayor = [];
                $scope.EditSelectedPayor = data.SelectPayor.toString();
                $scope.SelectedPayor.push($scope.EditSelectedPayor);
                $scope.PlanName = data.PlanName;
                $scope.ShortCode = data.ShortCode;
                $scope.Description = data.Description;
                $scope.PackageName = data.PackageName;
                $scope.FinancialClass = data.FinancialClass;
                $scope.PriceCode = data.PriceCode;
                $scope.ReferCode = data.ReferCode;
                $scope.ValidFromDate = DateFormatEdit($filter('date')(data.ValidFromDate, "dd-MMM-yyyy"));
                $scope.ValidToDate = DateFormatEdit($filter('date')(data.ValidToDate, "dd-MMM-yyyy"));

            });
            $("#chatLoaderPV").hide();
        }

        $scope.DeletePlan = function (DId) {
            $scope.Id = DId;
            $scope.PlanMaster_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.PlanMaster_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Plan Master details?',
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
                    $http.get(baseUrl + '/api/PlanMaster/PlanMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Plan details has been deactivated Successfully");
                        toastr.success("Plan details has been deactivated Successfully", "success");
                        $("#chatLoaderPV").hide();
                        $scope.Planlist();
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "An error has occurred while deleting  Plan Master details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Plan Master details?");
            if (del == true) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/PlanMaster/PlanMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert("Plan details has been deactivated Successfully");
                    toastr.success("Plan details has been deactivated Successfully", "success");
                    $("#chatLoaderPV").hide();
                    $scope.Planlist();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while deleting  Plan Master details" + data;
                });
            }*/
        };

        $scope.ActivePlan = function (PId) {
            $scope.Id = PId;
            $scope.PlanMaster_Active();
        };

        $scope.PlanMaster_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Plan Master details?',
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
                    $http.get(baseUrl + '/api/PlanMaster/PlanMaster_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Plan details has been activated successfully");
                        toastr.success("Selected Plan details has been activated successfully", "success");
                        $("#chatLoaderPV").hide();
                        $scope.Planlist();
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "An error has occured while deleting Payor records" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Plan Master details?");
            if (Ins == true) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/PlanMaster/PlanMaster_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Plan details has been activated successfully");
                    toastr.success("Selected Plan details has been activated successfully", "success");
                    $("#chatLoaderPV").hide();
                    $scope.Planlist();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occured while deleting Payor records" + data;
                });
            }*/
        };

       /* $scope.Active_ErrorFunction = function () {
            //alert("Inactive Payor details cannot be edited");
            toastr.info("Inactive Payor details cannot be edited", "info");
        };*/

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

      /*  $scope.PayorChange = function () {

            var PayorChange = document.getElementById('SelectedPayor').value;
            if (PayorChange != "0") {
                $('#divPayorChange').removeClass("ng-invalid");
                $('#divPayorChange').addClass("ng-valid");
            }
            else {
                $('#divPayorChange').removeClass("ng-valid");
                $('#divPayorChange').addClass("ng-invalid");
            }
        }

        $scope.ValidFromDateChange = function () {

            var ValidFromDate = document.getElementById('ValidFromDate').value;
            if (ValidFromDate != "0") {
                $('#divValidFromDateChange').removeClass("ng-invalid");
                $('#divValidFromDateChange').addClass("ng-valid");
            }
            else {
                $('#divValidFromDateChange').removeClass("ng-valid");
                $('#divValidFromDateChange').addClass("ng-invalid");
            }
        }

        $scope.ValidToDateChange = function () {

            var ValidToDate = document.getElementById('ValidToDate').value;
            if (ValidToDate != "0") {
                $('#divValidToDateChange').removeClass("ng-invalid");
                $('#divValidToDateChange').addClass("ng-valid");
            }
            else {
                $('#divValidToDateChange').removeClass("ng-valid");
                $('#divValidToDateChange').addClass("ng-invalid");
            }
        }*/


        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddPlanPopUP = function () {
            $scope.submitted = false;
            $scope.Id = 0;
            $scope.PlanSave = true;
            var sel1 = $('#SelectedPayor');
            sel1.prop('disabled', false);
            $('#btnsave').attr("disabled", false);
            $("#PlanName").attr("disabled", false);
            $("#ShortCode").attr("disabled", false);
            $("#Description").attr("disabled", false);
            $("#FinancialClass").attr("disabled", false);
            $("#PackageName").attr("disabled", false);
            $("#PriceCode").attr("disabled", false);
            $("#ReferCode").attr("disabled", false);
            $("#ValidFromDate").attr("disabled", false);
            $("#ValidToDate").attr("disabled", false);
            $("#ReferCode").attr("disabled", false);
            angular.element('#PlanMasterModal').modal('show');
            $scope.ClearPopup();
        }
        /* THIS IS OPENING POP WINDOW FORM VIEW */
        $scope.ViewPlanPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewPlan();
            $scope.PlanSave = false;
            var sel1 = $('#SelectedPayor');
            sel1.prop('disabled', true);
            $("#PlanName").attr("disabled", true);
            $("#ShortCode").attr("disabled", true);
            $("#Description").attr("disabled", true);
            $("#FinancialClass").attr("disabled", true);
            $("#PackageName").attr("disabled", true);
            $("#PriceCode").attr("disabled", true);
            $("#ReferCode").attr("disabled", true);
            $("#ValidFromDate").attr("disabled", true);
            $("#ValidToDate").attr("disabled", true);
            $("#ReferCode").attr("disabled", true);
            angular.element('#PlanMasterModal').modal('show');
        }
        /* THIS IS OPENING POP WINDOW FORM EDIT */
        $scope.EditPlanPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewPlan();
            $scope.PlanSave = true;
            var sel1 = $('#SelectedPayor');
            sel1.prop('disabled', false);
            $('#btnsave').attr("disabled", false);
            $("#PlanName").attr("disabled", false);
            $("#ShortCode").attr("disabled", false);
            $("#Description").attr("disabled", false);
            $("#FinancialClass").attr("disabled", false);
            $("#PackageName").attr("disabled", false);
            $("#PriceCode").attr("disabled", false);
            $("#ReferCode").attr("disabled", false);
            $("#ValidFromDate").attr("disabled", false);
            $("#ValidToDate").attr("disabled", false);
            $("#ReferCode").attr("disabled", false);
            angular.element('#PlanMasterModal').modal('show');
        }
        /* THIS IS CANCEL POPUP FUNCTION */
        $scope.CancelPopUP = function () {
            $scope.ClearPopup();
            angular.element('#PlanMasterModal').modal('hide')
        }
        /* THIS IS CANCEL VIEW POPUP FUNCTION*/
        $scope.CancelViewPopup = function () {
            $scope.ClearPopup();
            angular.element('#PlanMasterModal').modal('hide')
        }
        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.PlanName = "";
            $scope.SelectedPayor = [];
            $scope.ShortCode = "";
            $scope.Description = "";
            $scope.PackageName = "";
            $scope.FinancialClass = "";
            $scope.PriceCode = "";
            $scope.ReferCode = "";
            $scope.ValidFromDate = new Date();
            $scope.ValidToDate = new Date();
        }
        /* THIS IS OPENING POP WINDOW FORM LIST */
        $scope.ListPayorPopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;

        }
    }
]);