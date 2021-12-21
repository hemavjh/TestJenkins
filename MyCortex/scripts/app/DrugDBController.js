var DrugDBcontroller = angular.module("DrugDBController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


DrugDBcontroller.controller("DrugDBController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        // Declaration and initialization of Scope Variables.
        $scope.Id = "0";
        $scope.Name = "0";
        $scope.Dosage_From_ID = "0";
        $scope.Dosage_FromName = "0";
        $scope.Strength_ID = "0";
        $scope.Item_Code = "";
        $scope.Drug_Code = "";
        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.DuplicateId = 0;
        $scope.DuplicateId = "0";
        $scope.IsActive = true;

        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.total_pageDrug = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {

            if (typeof ($scope.Generic_Name) == "undefined" || $scope.Generic_Name == 0) {
                //alert("Please enter Generic Name");
                toastr.warning("Please enter Generic Name", "warning");
                return false;
            }
            else if (typeof ($scope.Strength_ID) == "undefined" || $scope.Strength_ID == 0) {
                //alert("Please select Strength");
                toastr.warning("Please select Strength", "warning");
                return false;
            }
            else if (typeof ($scope.Dosage_From_ID) == "undefined" || $scope.Dosage_From_ID == 0) {
                //alert("Please select Dosage Form");
                toastr.warning("Please select Dosage Form", "warning");
                return false;
            }
            /*else if(typeof ($scope.Item_Code) == "undefined" || $scope.Item_Code == 0) {
                alert("Please enter Item Code");
                return false;
            }
            else if(typeof ($scope.Drug_Code) == "undefined" || $scope.Drug_Code == 0) {
                alert("Please enter Drug Code");
                return false;
            }*/
            return true;
        };


        /*
        Calling api method for the dropdown list in the html page for the fields
        Strength, DosageForm, DosageTime & Administration
       */
        $scope.StrengthIDList = [];
        $scope.DosageFromIDList = [];

        /* THIS IS FOR ADD/EDIT PROCEDURE */
        $scope.DrugDBAddEdit = function () {
            $scope.submitted = false;
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    Generic_name: $scope.Generic_Name,
                    Strength_ID: $scope.Strength_ID,
                    Dosage_From_ID: $scope.Dosage_From_ID,
                    Item_Code: $scope.Item_Code == 0 ? null : $scope.Item_Code,
                    Drug_Code: $scope.Drug_Code == 0 ? null : $scope.Drug_Code,
                    InstitutionId: $scope.InstituteId,
                    Created_By: $scope.Patient_Id
                };
                $("#btnsave").attr("disabled", true);

                $http.post(baseUrl + '/api/DrugDBMaster/DrugDBMaster_AddEdit/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
                    $("#btnsave").attr("disabled", false);
                    if (data.ReturnFlag == 1) {
                        $scope.CancelPopup();
                        $scope.DrugDB_List();
                        $("#chatLoaderPV").hide();
                    }
                    //angular.element('#DrugDBModal').modal('hide');
                    // $scope.ClearPopup();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while adding DrugDBMaster details" + data.ExceptionMessage;
                });
            };
        }

        $scope.Active_ErrorFunction = function () {
            //alert("Inactive Drug DB details cannot be edited");
            toastr.info("Inactive Drug DB details cannot be edited", "info");
        };


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
            $scope.DrugDB_List();
        }

        $scope.DrugDB_List = function () {
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
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                    $scope.page_size = data1[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMasterList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + $scope.PageStart +
                        '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                            $scope.emptydata = [];
                            $scope.rowCollection = [];
                            $scope.rowCollection = data;
                            if ($scope.rowCollection.length > 0) {
                                $scope.DrugCount = $scope.rowCollection[0].TotalRecord;
                            }
                            $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                            if ($scope.rowCollectionFilter.length > 0) {
                                $scope.flag = 1;
                            }
                            else {
                                $scope.flag = 0;
                            }

                            $("#chatLoaderPV").hide();

                            $http.get(baseUrl + '/api/DrugDBMaster/DrugStrengthList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                                $scope.StrengthIDListTemp = [];
                                $scope.StrengthIDListTemp = data;

                                var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                                $scope.StrengthIDListTemp.splice(0, 0, obj);

                                $scope.StrengthIDList = angular.copy($scope.StrengthIDListTemp);
                            })
                            $http.get(baseUrl + '/api/DrugDBMaster/DosageFormList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                                $scope.DosageFromIDListTemp = [];
                                $scope.DosageFromIDListTemp = data;

                                var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                                $scope.DosageFromIDListTemp.splice(0, 0, obj);

                                $scope.DosageFromIDList = angular.copy($scope.DosageFromIDListTemp);
                            })
                            $scope.total_pageDrug = Math.ceil(($scope.DrugCount) / ($scope.page_size));
                        })
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "AN error has occured while Listing the records!" + data;
                })
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };
        /* CANCEL POPUP FUNCTION*/
        $scope.CancelPopup = function () {
            angular.element('#DrugDBModal').modal('hide');
        }

        //$http.get(baseUrl + '/api/DrugDBMaster/DrugStrengthList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
        //    $scope.StrengthIDListTemp = [];
        //    $scope.StrengthIDListTemp = data;

        //    var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
        //    $scope.StrengthIDListTemp.splice(0, 0, obj);

        //    $scope.StrengthIDList = angular.copy($scope.StrengthIDListTemp);
        //})
        //$http.get(baseUrl + '/api/DrugDBMaster/DosageFormList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
        //    $scope.DosageFromIDListTemp = [];
        //    $scope.DosageFromIDListTemp = data;

        //    var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
        //    $scope.DosageFromIDListTemp.splice(0, 0, obj);

        //    $scope.DosageFromIDList = angular.copy($scope.DosageFromIDListTemp);
        //})
        $scope.searchquery = "";
        /* FILTER THE MASTER LIST FUNCTION.*/
        $scope.filterInstitutionList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Generic_name).match(searchstring) ||
                        angular.lowercase(value.StrengthName).match(searchstring) ||
                        angular.lowercase(value.Dosage_FromName).match(searchstring) ||
                        angular.lowercase(value.Item_Code).match(searchstring) ||
                        angular.lowercase(value.Drug_Code).match(searchstring)

                });
            }
        }
        /* THIS IS FOR VIEW PROCEDURE */
        $scope.ViewDrugDB = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMasterView/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = data.Id;
                $scope.Generic_Name = data.Generic_name;
                $scope.Strength_ID = data.Strength_ID.toString();
                $scope.ViewStrengthName = data.StrengthName;
                $scope.Dosage_From_ID = data.Dosage_From_ID.toString();
                $scope.ViewDosage_FromName = data.Dosage_FromName;
                $scope.Item_Code = data.Item_Code;
                $scope.Drug_Code = data.Drug_Code;
            });
        }

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }


        $scope.StrengthChange = function () {

            var StrengthId = document.getElementById('selectpicker').value;
            if (StrengthId != "0") {
                $('#divStrength').removeClass("ng-invalid");
                $('#divStrength').addClass("ng-valid");
            }
            else {
                $('#divStrength').removeClass("ng-valid");
                $('#divStrength').addClass("ng-invalid");
            }
        }

        $scope.DosageFromChange = function () {

            var Dosage_From_ID = document.getElementById('selectpicker').value;
            if (Dosage_From_ID != "0") {
                $('#divDosageFrom').removeClass("ng-invalid");
                $('#divDosageFrom').addClass("ng-valid");
            }
            else {
                $('#divDosageFrom').removeClass("ng-valid");
                $('#divDosageFrom').addClass("ng-invalid");
            }
        }


        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddDrugDBPopUP = function () {
            $scope.submitted = false;
            $('#divStrength').addClass("ng-invalid");
            $('#divDosageFrom').addClass("ng-invalid");
            $scope.ClearPopup();
            angular.element('#DrugDBModal').modal('show');
            $("#btnsave").attr("disabled", false);
        }
        /* THIS IS OPENING POP WINDOW VIEW */
        $scope.ViewDrugDBPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewDrugDB();
            angular.element('#DrugDBViewModal').modal('show');
        }
        /* THIS IS EDIT POPUP FUNCTION */
        $scope.EditDrugDBPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewDrugDB();
            angular.element('#DrugDBModal').modal('show');
            $("#btnsave").attr("disabled", false);
        }
        /* THIS IS CANCEL VIEW POPUP FUNCTION  */
        $scope.CancelViewPopup = function () {
            angular.element('#DrugDBViewModal').modal('hide');
        }
        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.Generic_Name = "";
            $scope.Strength_ID = "0";
            $scope.Dosage_From_ID = "0";
            $scope.Item_Code = "";
            $scope.Drug_Code = "";
        }

        //$scope.CancelPopup = function () {
        //    angular.element('#DrugDBModal').modal('hide');
        //};

        /* THIS IS FOR DELETE FUNCTION*/
        $scope.DeleteDrugDB = function (DId) {
            $scope.Id = DId;
            $scope.DrugDBMaster_Delete();
        };


        /*THIS IS FOR DELETE FUNCTION */
        $scope.DrugDBMaster_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Drug DB details?',
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
                    $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert(" Drug DB details has been deactivated Successfully");
                        toastr.success(" Drug DB details has been deactivated Successfully", "success");
                        $scope.DrugDB_List();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while deleting  Drug DB details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Drug DB details?");
            if (del == true) {
                $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert(" Drug DB details has been deactivated Successfully");
                    toastr.success(" Drug DB details has been deactivated Successfully", "success");
                    $scope.DrugDB_List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  Drug DB details" + data;
                });
            }*/
        };

        $scope.ActiveDrugDB = function (PId) {
            $scope.Id = PId;
            $scope.DrugDBMasterActive();
        };
        /*
            Calling the api method to activate the details of the Patient
            matching the specified Patient Id,
            and redirected to the list page.
           */
        $scope.DrugDBMasterActive = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Drug DB details?',
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
                    $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMaster_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Drug DB details has been activated successfully");
                        toastr.success("Selected Drug DB details has been activated successfully", "success");
                        $scope.DrugDB_List();
                    }).error(function (data) {
                        $scope.error = "An error has occured while deleting Drug DB records" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* var Ins = confirm("Do you like to activate the selected Drug DB details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMaster_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Drug DB details has been activated successfully");
                    toastr.success("Selected Drug DB details has been activated successfully", "success");
                    $scope.DrugDB_List();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting Drug DB records" + data;
                });
            }*/
        };
    }
]);