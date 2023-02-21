var ICD10controller = angular.module("ICD10Controller", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

ICD10controller.controller("ICD10Controller", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        $scope.Id = "0";
        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.Category_ID = "0";
        $scope.IsActive = true;

        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.total_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            if (typeof ($scope.ICD_Code) == "undefined" || $scope.ICD_Code == 0) {
                //alert("Please enter ICD Code");
                toastr.warning("Please enter ICD Code", "warning");
                return false;
            }
            else if (typeof ($scope.Description) == "undefined" || $scope.Description == 0) {
                //alert("Please enter ICD Description");
                toastr.warning("Please enter ICD Description", "warning");
                return false;
            }
            /*else if (typeof ($scope.Category_ID) == "undefined" || $scope.Category_ID == "0") {
                alert("Please select Category");
                return false;
            }*/
            return true;
        };

        /* THIS IS FOR ADD/EDIT PROCEDURE */
        $scope.ICD10AddEdit = function () {
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    ICD_Code: $scope.ICD_Code,
                    Category_ID: $scope.Category_ID == 0 ? null : $scope.Category_ID,
                    Description: $scope.Description,
                    InstitutionId: $scope.InstituteId,
                    Created_By: $scope.Patient_Id
                }
                $("#btnsave").attr("disabled", true);
                $http.post(baseUrl + '/api/MasterICD/MasterICD_AddEdit/', obj).then(function (response) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (response.data.ReturnFlag == 1) {
                        toastr.success(response.data.Message, "success");
                    }
                    else if (response.data.ReturnFlag == 0) {
                        toastr.info(response.data.Message, "info");
                    }
                    $("#btnsave").attr("disabled", false);
                    if (response.data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.ICD10list();
                    }
                    //$scope.AddId = data;
                    angular.element('#ICD10Modal').modal('hide');
                }, function errorCallback(response) {
                });
            }
        }

        /*
  Calling api method for the dropdown list in the html page for the field Category
 */
        //$("#chatLoaderPV").show();
        //$http.get(baseUrl + '/api/MasterICD/CategoryMasterList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
        //    $("#chatLoaderPV").hide();
        //    $scope.CategoryIDListTemp = [];
        //    $scope.CategoryIDListTemp = data;
        //    var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
        //    $scope.CategoryIDListTemp.splice(0, 0, obj);
        //    $scope.CategoryIDList = angular.copy($scope.CategoryIDListTemp);
        //});


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
            if ($scope.searchquery == "") {
                $scope.ICD10list();
            } else {
                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_page * $scope.page_size;
                $scope.ICD10Search();
            }
            
        }

        $scope.ICD10list = function () {
            if ($window.localStorage['UserTypeId'] == 3) {
                $("#chatLoaderPV").show();
                $scope.ISact = 1;       // default active

                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }

                $scope.ConfigCode = "PATIENTPAGE_COUNT";
                $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1) {
                    $scope.page_size = data1.data[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $http.get(baseUrl + '/api/MasterICD/ICDMasterList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + $scope.PageStart +
                        '&EndRowNumber=' + $scope.PageEnd).then(function (response) {
                            $("#chatLoaderPV").hide();
                            $scope.emptydata = [];
                            $scope.rowCollection = [];
                            $scope.rowCollection = response.data;
                            $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                            if ($scope.rowCollectionFilter.length > 0) {
                                $scope.flag = 1;
                            }
                            else {
                                $scope.flag = 0;
                            }
                            if ($scope.rowCollection.length > 0) {
                                $scope.PatientCount = $scope.rowCollection[0].TotalRecord;
                                $http.get(baseUrl + '/api/MasterICD/CategoryMasterList/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                                    $("#chatLoaderPV").hide();
                                    $scope.CategoryIDListTemp = [];
                                    $scope.CategoryIDListTemp = response.data;
                                    var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                                    $scope.CategoryIDListTemp.splice(0, 0, obj);
                                    $scope.CategoryIDList = angular.copy($scope.CategoryIDListTemp);
                                }, function errorCallback(response) {
                                });
                                $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.page_size));
                            } else {
                                $scope.total_page = 1;
                            }
                        }, function errorCallback(response) {
                        });
                }, function errorCallback(response) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "AN error has occured while Listing the records!" + response.data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.searchquery = "";
        /* FILTER THE MASTER LIST FUNCTION.*/
        $scope.fliterICD10List = function () {
            $scope.ResultListFiltered = [];
            var searchstring = $scope.searchquery.toLowerCase();
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return (value.ICD_Code.toLowerCase()).match(searchstring) ||
                        (value.Description.toLowerCase()).match(searchstring) ||
                        (value.CategoryName.toLowerCase()).match(searchstring);
                });
            }
        }
        $scope.ICD10Search = function () {
            //$scope.PageStart = 1;
            //$scope.PageEnd = 10;
            if ($scope.searchquery == "") {
                $scope.ICD10list();
            } else {
                $("#chatLoaderPV").show();
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
                $http.get(baseUrl + '/api/MasterICD/Search_ICD10_List/?IsActive=' + $scope.ActiveStatus + '&InstitutionId=' + $window.localStorage['InstitutionId'] + '&SearchQuery=' + $scope.searchquery +
                    '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).then(function (response) {
                        $("#chatLoaderPV").hide();
                        $scope.emptydata = [];
                        $scope.rowCollection = [];
                        $scope.rowCollection = response.data;
                        $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                        if ($scope.rowCollectionFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        if ($scope.rowCollection.length > 0) {
                            $scope.PatientCount = $scope.rowCollection[0].TotalRecord; 
                            $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.page_size));
                        } else {
                            $scope.total_page = 1;                          
                        }
                    }, function errorCallback(response) {
                    });
            }
        }

        /* THIS IS FOR VIEW PROCEDURE */

        $scope.ViewICD10 = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }

            $http.get(baseUrl + '/api/MasterICD/ICDMasterView/?Id=' + $scope.Id).then(function (response) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = response.data.Id;
                $scope.ICD_Code = response.data.ICD_Code;
                $scope.Description = response.data.Description;
                $scope.Category_ID = response.data.Category_ID.toString();
                $scope.ViewCategoryName = response.data.CategoryName;
            }, function errorCallback(response) {
            });
        }

        $scope.DeleteICD10 = function (DId) {
            $scope.Id = DId;
            $scope.ICDMaster_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.ICDMaster_Delete = function () {

            Swal.fire({
                title: 'Do you like to deactivate the selected ICD 10 details?',
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
                    $http.get(baseUrl + '/api/MasterICD/ICDMaster_Delete/?Id=' + $scope.Id).then(function (response) {
                        //alert(" ICD 10 details has been deactivated Successfully");
                        toastr.success(" ICD 10 details has been deactivated Successfully", "success");
                        $scope.ICD10list();
                    }, function errorCallback(response) {
                        $scope.error = "An error has occurred while deleting  ICD 10 details" + response.data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })

           /* var del = confirm("Do you like to deactivate the selected ICD 10 details?");
            if (del == true) {
                $http.get(baseUrl + '/api/MasterICD/ICDMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert(" ICD 10 details has been deactivated Successfully");
                    toastr.success(" ICD 10 details has been deactivated Successfully", "success");
                    $scope.ICD10list();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                });
            }*/
        };

        $scope.ActiveICD10 = function (PId) {
            $scope.Id = PId;
            $scope.ICDMaster_Active();
        };


        /* 
            Calling the api method to activate the details of ICD 10 
            matching the specified ICD 10 Id,
            and redirected to the list page.
           */
        $scope.ICDMaster_Active = function () {
            Swal.fire({
                title: 'Do you like to activate the selected ICD 10 details?',
                html: '',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                showCloseButton: true,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $http.get(baseUrl + '/api/MasterICD/ICDMaster_Active/?Id=' + $scope.Id).then(function (response) {
                        //alert("Selected ICD 10 details has been activated successfully");
                        toastr.success("Selected ICD 10 details has been activated successfully", "success");
                        $scope.ICD10list();
                    }, function errorCallback(response) {
                        $scope.error = "An error has occured while deleting ICD 1O records" + response.data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected ICD 10 details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/MasterICD/ICDMaster_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected ICD 10 details has been activated successfully");
                    toastr.success("Selected ICD 10 details has been activated successfully", "success");
                    $scope.ICD10list();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting ICD 1O records" + data;
                });
            }*/
        };

        $scope.Active_ErrorFunction = function () {
            //alert("Inactive ICD 10 details cannot be edited");
            toastr.info("Inactive ICD 10 details cannot be edited", "info");
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }


        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddICD10PopUP = function () {
            $scope.submitted = false;
            angular.element('#ICD10Modal').modal('show');
            $("#btnsave").attr("disabled", false);
            $scope.ClearPopup();
        }
        /* THIS IS OPENING POP WINDOW FORM VIEW */
        $scope.ViewICD1OPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10();
            angular.element('#ICD10ViewModal').modal('show');
        }
        /* THIS IS OPENING POP WINDOW FORM EDIT */
        $scope.EditICD10PopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10();
            angular.element('#ICD10Modal').modal('show');
            $("#btnsave").attr("disabled", false);
        }
        /* THIS IS CANCEL POPUP FUNCTION */
        $scope.CancelPopUP = function () {
            angular.element('#ICD10Modal').modal('hide')
        }
        /* THIS IS CANCEL VIEW POPUP FUNCTION*/
        $scope.CancelViewPopup = function () {
            angular.element('#ICD10ViewModal').modal('hide')
        }
        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.ICD_Code = "";
            $scope.Description = "";
            $scope.Category_ID = "0";
        }
        /* THIS IS OPENING POP WINDOW FORM LIST */
        $scope.ListICD10PopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.ICDCodeList();

        }
    }
]);