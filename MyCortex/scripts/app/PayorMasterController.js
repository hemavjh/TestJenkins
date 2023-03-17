var PayorMastercontroller = angular.module("PayorMasterController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

PayorMastercontroller.controller("PayorMasterController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        $scope.Id = "0";
        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.Category_ID = "0";
        $scope.IsActive = true;
        $scope.Payor = "";
        $scope.Plan = "";
        $scope.PayorName = "";
        $scope.ShortCode = "";
        $scope.Description = "";
        $scope.ReferCode = "";
        $scope.PayorSave = true;

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
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            //if (typeof ($scope.Payor) == "undefined" || $scope.Payor == "") {
            //    alert("Please enter Payor");
            //    return false;
            //}
            //else if (typeof ($scope.Plan) == "undefined" || $scope.Plan == "") {
            //    alert("Please enter ICD Description");
            //    return false;
            //}
            if (typeof ($scope.PayorName) == "undefined" || $scope.PayorName == "") {
                //alert("Please enter PayorName");
                toastr.warning("Please enter PayorName", "warning");
                return false;
            }
            else if (typeof ($scope.ShortCode) == "undefined" || $scope.ShortCode == "") {
                //alert("Please enter ShortCode");
                toastr.warning("Please enter ShortCode", "warning");
                return false;
            }
            //else if (typeof ($scope.Description) == "undefined" || $scope.Description == "") {
            //    //alert("Please enter Description");
            //    toastr.warning("Please enter Description", "warning");
            //    return false;
            //}
            //else if (typeof ($scope.ReferCode) == "undefined" || $scope.ReferCode == "") {
            //    //alert("Please enter ReferCode");
            //    toastr.warning("Please enter ReferCode", "warning");
            //    return false;
            //}

            return true;
        };

        $scope.Payorlist = function () {
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
                    $http.get(baseUrl + '/api/PayorMaster/PayorList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + $scope.PageStart +
                        '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
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
        $scope.PayorAddEdit = function () {
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    PayorName: $scope.PayorName,
                    ShortCode: $scope.ShortCode,
                    Description: $scope.Description,
                    ReferCode: $scope.ReferCode,
                    InstitutionId: $scope.InstituteId,
                    Created_By: $scope.User_Id
                }
                $('#btnsave').attr("disabled", true);
                $http.post(baseUrl + '/api/PayorMaster/PayorMaster_AddEdit/', obj).success(function (data) {
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
                        $scope.Payorlist();
                        angular.element('#PayorModal').modal('hide');
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
            $scope.Payorlist();
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

        $scope.ViewPayor = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }

            $http.get(baseUrl + '/api/PayorMaster/PayorMasterView/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.PayorName = data.PayorName;
                $scope.ShortCode = data.ShortCode;
                $scope.Description = data.Description;
                $scope.ReferCode = data.ReferCode;
            });
        }

        $scope.DeletePayor = function (DId) {
            $scope.Id = DId;
            $scope.PayorMaster_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.PayorMaster_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Payor Master details?',
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
                    $http.get(baseUrl + '/api/PayorMaster/PayorMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Payor details has been deactivated Successfully");
                        toastr.success("Payor details has been deactivated Successfully", "success");
                        $("#chatLoaderPV").hide();
                        $scope.Payorlist();
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "An error has occurred while deleting  Payor Master details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Payor Master details?");
            if (del == true) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/PayorMaster/PayorMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert("Payor details has been deactivated Successfully");
                    toastr.success("Payor details has been deactivated Successfully", "success");
                    $("#chatLoaderPV").hide();
                    $scope.Payorlist();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while deleting  Payor Master details" + data;
                });
            }*/
        };

        $scope.ActivePayor = function (PId) {
            $scope.Id = PId;
            $scope.PayorMaster_Active();
        };

        $scope.PayorMaster_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Payor Master details?',
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
                    $http.get(baseUrl + '/api/PayorMaster/PayorMaster_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Payor details has been activated successfully");
                        toastr.success("Selected Payor details has been activated successfully", "success");
                        $("#chatLoaderPV").hide();
                        $scope.Payorlist();
                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "An error has occured while deleting Payor records" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Payor Master details?");
            if (Ins == true) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/PayorMaster/PayorMaster_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Payor details has been activated successfully");
                    toastr.success("Selected Payor details has been activated successfully", "success");
                    $("#chatLoaderPV").hide();
                    $scope.Payorlist();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occured while deleting Payor records" + data;
                });
            }*/
        };

        /*$scope.Active_ErrorFunction = function () {
            //alert("Inactive Payor details cannot be edited");
            toastr.info("Inactive Payor details cannot be edited", "info");
        };
*/
        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }


        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddPayorPopUP = function () {
            $scope.submitted = false;
            $scope.Id = 0;
            $scope.PayorSave = true;
            $('#btnsave').attr("disabled", false);
            $("#PayorName").attr("disabled", false);
            $("#ShortCode").attr("disabled", false);
            $("#Description").attr("disabled", false);
            $("#ReferCode").attr("disabled", false);
            angular.element('#PayorModal').modal('show');
            $scope.ClearPopup();
        }
        /* THIS IS OPENING POP WINDOW FORM VIEW */
        $scope.ViewPayorPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewPayor();
            $scope.PayorSave = false;
            $("#PayorName").attr("disabled", true);
            $("#ShortCode").attr("disabled", true);
            $("#Description").attr("disabled", true);
            $("#ReferCode").attr("disabled", true);
            angular.element('#PayorModal').modal('show');
        }
        /* THIS IS OPENING POP WINDOW FORM EDIT */
        $scope.EditPayorPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewPayor();
            $scope.PayorSave = true;
            $('#btnsave').attr("disabled", false);
            $("#PayorName").attr("disabled", false);
            $("#ShortCode").attr("disabled", false);
            $("#Description").attr("disabled", false);
            $("#ReferCode").attr("disabled", false);
            angular.element('#PayorModal').modal('show');
        }
        /* THIS IS CANCEL POPUP FUNCTION */
        $scope.CancelPopUP = function () {
            $scope.ClearPopup();
            angular.element('#PayorModal').modal('hide')
        }
        /* THIS IS CANCEL VIEW POPUP FUNCTION*/
        $scope.CancelViewPopup = function () {
            $scope.ClearPopup();
            angular.element('#PayorModal').modal('hide')
        }
        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.PayorName = "";
            $scope.Description = "";
            $scope.ReferCode = "";
            $scope.ShortCode = "";
        }
        /* THIS IS OPENING POP WINDOW FORM LIST */
        $scope.ListPayorPopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.PayorCodeList();

        }
    }
]);