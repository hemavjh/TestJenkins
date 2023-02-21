var allergyMasterList = angular.module("AllergyMasterList", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

allergyMasterList.controller("AllergyMasterList", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {

        $scope.AllergyMasterflag = 0;
        $scope.IsActive = true;
        //$scope.AllergyMasterIsActive = true;

        $scope.AllergyMasteremptydata = [];
        $scope.AllergyMasterListData = [];

        $scope.Institution_Id = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

        // THIS IS FOR VALIDATION CONTROL /
        $scope.Validationcontrols = function () {
            if (typeof ($scope.AllergyTypeId) == "" || $scope.AllergyTypeId == "0") {
                //alert("Please select Allergy Type Name ");
                toastr.warning("Please select Allergy Type Name ", "warning");
                return false;
            }
            else if (typeof ($scope.AllergenName) == "" || $scope.AllergenName == undefined) {
                //alert("Please select Allergen Name");
                toastr.warning("Please select Allergen Name", "warning");
                return false;
            }
            return true;
        };
        // THIS IS FOR ADD/EDIT PROCEDURE 
        $scope.AllergyAddEdit = function () {
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                $scope.Patient_Id = $window.localStorage['UserId'];
                var obj = {
                    Id: $scope.Id,
                    AllergyTypeId: $scope.AllergyTypeId == 0 ? null : $scope.AllergyTypeId,
                    AllergenId: $scope.AllergenId,
                    AllergenName: $scope.AllergenName,
                    InstitutionId: $scope.Institution_Id,
                    Created_By: $scope.Patient_Id
                }
                $("#btnsave").attr("disabled", true);
                $http.post(baseUrl + '/api/MasterAllergy/MasterAllergy_AddEdit/', obj).then(function (reponse) {
                    $("#chatLoaderPV").hide();
                    //alert(data.Message);
                    if (reponse.data.ReturnFlag == 1) {
                        toastr.success(reponse.data.Message, "success");
                    }
                    else if (reponse.data.ReturnFlag == 0) {
                        toastr.info(reponse.data.Message, "info");
                    }
                    $("#btnsave").attr("disabled", false);
                    if (reponse.data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.AllergyMasterList_Details();
                    }
                    //$scope.AddId = data;
                    angular.element('#AllergyModal').modal('hide');
                }, function errorCallback(response) {
                });
            }

        }


        //List Page Pagination.
        $scope.current_page = 1;
        $scope.Allergt_pages = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.allergyActive = true;
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.setPage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else
                $scope.inputPageNo = PageNo;

            $scope.current_page = PageNo;

            if ($scope.AllergyMastersearchquery == "") {
                $scope.AllergyMasterList_Details();
            } else {
                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_page * $scope.page_size;
                $scope.AllergyMasterList_Details();
            }
        }
      
        $scope.AllergyMasterList_Details = function () {
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
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data1) {
                    $scope.page_size = data1.data[0].ConfigValue;
                    $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                    $scope.PageEnd = $scope.current_page * $scope.page_size;
                    $http.get(baseUrl + '/api/User/AllergtMaster_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + $scope.Institution_Id + '&StartRowNumber=' + $scope.PageStart +
                        '&EndRowNumber=' + $scope.PageEnd).then(function (reponse) {
                            $("#chatLoaderPV").hide();
                            if (reponse.data.length != 0 && reponse.data != null && reponse.data !== undefined) {
                                $scope.AllergyMasteremptydata = [];
                                $scope.AllergyMasterListData = [];
                                $scope.AllergyMasterListData = reponse.data;
                                if ($scope.AllergyMasterListData.length > 0) {
                                    $scope.AllergyCount = $scope.AllergyMasterListData[0].TotalRecord;
                                }
                                $scope.AllergyMasterListFilterData = reponse.data;
                                $scope.AllergyMasterList = angular.copy($scope.AllergyMasterListData);
                                if ($scope.AllergyMasterList.length > 0) {
                                    $scope.flag = 1;
                                }
                                else {
                                    $scope.flag = 0;
                                }
                            } else {
                                $scope.AllergyMasterList = [];
                                $scope.AllergyCount = 0;
                            }

                            if ($scope.AllergyMasterListData.length > 0) {
                                $scope.AllergyTypeList = [];
                                $http.get(baseUrl + 'api/MasterAllergy/MasterAllergyTypeList/?institution_id=' + $scope.Institution_Id).then(function (response) {
                                    $("#chatloaderpv").hide();
                                    $scope.AllergyTypeListTemp = [];
                                    $scope.AllergyTypeListTemp = response.data;
                                    var obj = { "Id": 0, "AllergyTypeName": "Select", "IsActive": 1 };
                                    $scope.AllergyTypeListTemp.splice(0, 0, obj);
                                    $scope.AllergyTypeList = angular.copy($scope.AllergyTypeListTemp);
                                }, function errorCallback(response) {
                                });
                                //$scope.AllergenListfilter = [];
                                //$scope.AllegenBasedType = function (AllergyTypeId) {
                                //    var id = "0"
                                //    id = $scope.AllergenId;
                                //    $http.get(baseUrl + 'api/MasterAllergy/MasterAllergenList/?ALLERGYTYPE_ID=' + AllergyTypeId + '&Institution_Id=' + $scope.Institution_Id).success(function (data) {
                                //        $scope.AllergenListTemp = [];
                                //        $scope.AllergenListTemp = data;
                                //        var obj = { "Id": 0, "AllergenName": "Select", "IsActive": 1 };
                                //        $scope.AllergenListTemp.splice(0, 0, obj);
                                //        $scope.AllergenListfilter = angular.copy($scope.AllergenListTemp);
                                //        $scope.AllergenId = id;

                                //    })
                                //}
                            
                                $scope.Allergt_pages = Math.ceil(($scope.AllergyCount) / ($scope.page_size));
                            } else {
                                $scope.Allergt_pages = 1;
                            }

                        })
                }, function errorCallback(reponse) {
                    $scope.error = "AN error has occured while Listing the records!" + reponse.data;
                });
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        /*  This is for Allergy searchquery*/
        $scope.filterAllergyMasterList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = $scope.AllergyMastersearchquery.toLowerCase();
            if ($scope.AllergyMastersearchquery == "") {
                $scope.AllergyMasterList = angular.copy($scope.AllergyMasterListFilterData);
                $scope.AllergySearch();
            }
            else {
                var val;
                $scope.AllergyMasterList = $ff($scope.AllergyMasterListFilterData, function (value) {
                    return (value.AllergyTypeName.toLowerCase()).match(searchstring) ||
                        (value.AllergenName.toLowerCase()).match(searchstring);
                });
                if ($scope.AllergyMasterList.length > 0) {
                    $scope.AllergyMasterflag = 1;
                    $scope.AllergySearch();
                }
                else {
                    $scope.AllergyMasterflag = 0;
                    $scope.AllergySearch();
                }
            }
        }

        $scope.AllergySearch = function () {
            //$scope.PageStart = 1;
            //$scope.PageEnd = 10;
            if ($scope.AllergyMastersearchquery == "") {
                $scope.AllergyMasterList_Details();
            } else {
                $("#chatLoaderPV").show();
                $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
                $http.get(baseUrl + '/api/MasterAllergy/Search_Allergy_List/?IsActive=' + $scope.ActiveStatus + '&InstitutionId=' + $window.localStorage['InstitutionId'] + '&SearchQuery=' + $scope.AllergyMastersearchquery +
                    '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd).then(function (response) {
                        $("#chatLoaderPV").hide();
                        $scope.AllergyMasteremptydata = [];
                        $scope.AllergyMasterListData = [];
                        $scope.AllergyMasterListData = response.data;
                        
                        $scope.AllergyMasterListFilterData = response.data;
                        $scope.AllergyMasterList = angular.copy($scope.AllergyMasterListData);
                        if ($scope.AllergyMasterList.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        if ($scope.AllergyMasterListData.length > 0) {
                            $scope.AllergyCount = $scope.AllergyMasterListData[0].TotalRecord;
                            $scope.Allergt_pages = Math.ceil(($scope.AllergyCount) / ($scope.page_size));
                        } else {
                            $scope.Allergt_pages =1
                        }
                    }, function errorCallback(response) {
                    });
            }
        }

        // THIS IS FOR VIEW PROCEDURE 
        $scope.AllergyTypeDuplicateId = "0";
        $scope.AllergenDuplicateId = "0";
        $scope.ViewICD10 = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/MasterAllergy/MasterAllergyView/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                $("#chatLoaderPV").hide();
                $scope.AllergyTypeId = response.data.AllergyTypeId.toString();
                $scope.AllergyTypeDuplicateId = $scope.AllergyTypeId;
                $scope.AllergenId = response.data.AllergenId.toString();
                $scope.AllergenDuplicateId = $scope.AllergenId;
                /* if ($scope.AllergyDropDown == 2) {
                     $scope.AllegenBasedType($scope.AllergyTypeId);
                 }*/
                $scope.ViewAllergyType = response.data.AllergyTypeName;
                $scope.AllergenName = response.data.AllergenName;
                $scope.ViewAllegenName = response.data.AllergenName;
            }, function errorCallback(response) {
                //alert('Error Occurred');
                toastr.error("Error Occurred", "warning");

            });
        }

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            //alert("Inactive record cannot be edited");
            toastr.info("Inactive record cannot be edited", "info");
        }

        // THIS IS OPENING POP WINDOW FORM LIST FOR ADD 
        $scope.AddMasterAllergyPopUP = function () {
            angular.element('#AllergyModal').modal('show');
            $("#btnsave").attr("disabled", false);
            $scope.ClearPopup();
        }
        // THIS IS CLEAR POPUP FUNCTION 
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.AllergyTypeId = "0";
            $scope.AllergenId = "0";
            $scope.AllergenName = "";
        }
        $scope.CancelPopUP = function () {
            angular.element('#AllergyViewModal').modal('hide');
            angular.element('#AllergyModal').modal('hide')
        }
        $scope.ViewAllergyPopUP = function (value) {
            $scope.ClearPopup();
            angular.element('#AllergyViewModal').modal('show');
            $scope.AllergyDropDown = 2;
            $scope.Id = value;
            $scope.ViewICD10();
        }
        $scope.EditAllergyPopUP = function (value) {
            angular.element('#AllergyModal').modal('show');
            $("#btnsave").attr("disabled", false);
            $scope.AllergyDropDown = 2;
            $scope.Id = value;
            $scope.ViewICD10();
        }
        /*THIS IS FOR DELETE FUNCTION */
        $scope.AllergyMaster_Delete = function () {
            Swal.fire({
                title: 'Do you like to deactivate the selected Allergies details?',
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
                    $http.get(baseUrl + '/api/MasterAllergy/AllergyMaster_Delete/?Id=' + $scope.Id).then(function (response) {
                        //alert(" Allergy detail has been deactivated Successfully");
                        toastr.success(" Allergy detail has been deactivated Successfully", "success");
                        $scope.AllergyMasterList_Details();
                    }, function errorCallback(response) {
                        $scope.error = "An error has occurred while deleting Allergy details" + response.data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Allergies details?");
            if (del == true) {
                $http.get(baseUrl + '/api/MasterAllergy/AllergyMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert(" Allergy detail has been deactivated Successfully");
                    toastr.success(" Allergy detail has been deactivated Successfully", "success");
                    $scope.AllergyMasterList_Details();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Allergy details" + data;
                });
            }*/
        }

        $scope.DeleteAllergy = function (AId) {
            $scope.Id = AId;
            $scope.AllergyMaster_Delete();
        }

        /*'Active the Allergy*/
        $scope.AllergyActive = function (comId) {
            $scope.Id = comId;
            $scope.Allergy_Active();
        }

        /* Calling the api method to inactived the details of the Allergy for the  Allergy Id, and redirected to the list page.*/
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
                if (result.isConfirmed) {
                    var obj =
                    {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId']
                    }

                    $http.post(baseUrl + '/api/MasterAllergy/AllergyMaster_Active/', obj).then(function (response) {
                        //alert(data.Message);
                        if (response.data.ReturnFlag == 2) {
                            toastr.success(response.data.Message, "success");
                        }
                        $scope.AllergyMasterList_Details();
                    }, function errorCallback(response) {
                        $scope.error = "An error has occurred while deleting Allergies" + response.data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Allergy?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/MasterAllergy/AllergyMaster_Active/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    $scope.AllergyMasterList_Details();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Allergies" + data;
                });
            };*/
        }
    }
]);