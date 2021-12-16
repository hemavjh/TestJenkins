var AppointmentSlot = angular.module("AppointmentSlotController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}



AppointmentSlot.controller("AppointmentSlotController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {

        //List Page Pagination.
        if ($window.localStorage['UserTypeId'] == 3) {
            $scope.current_page = 1;
            $scope.page_size = $window.localStorage['Pagesize'];
            $scope.rembemberCurrentPage = function (p) {
                $scope.current_page = p
            }
            $scope.listdata = [];
            $scope.Institution_Name = "";
            $scope.Doctor_Id = "0";
            $scope.Doctor_Name = "";
            // $scope.Appoinment_Hours = "";
            $scope.Appoinment_Minutes = "";
            $scope.FollowUp_Appoinment = "";
            $scope.SlotInterval = "";
            $scope.DuplicateId = "0";
            $scope.flag = 0;
            $scope.IsActive = true;
            $scope.rowCollection = [];
            $scope.rowCollectionFilter = [];
            $scope.Id = 0;
            $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

            $scope.AddSlot = function () {
                $scope.Id = 0;
                // $scope.AppoinmentSlotClear();
                angular.element('#AppointmentSlotModal').modal('show');
            }
            $scope.CancelSlot = function () {
                angular.element('#AppointmentSlotModal').modal('hide');
            }

            $scope.ViewAppoinmentpopup = function () {
                angular.element('#ViewAppoinmentSlot').modal('show');
            }

            $scope.CancelViewAppoinmentpopup = function () {
                angular.element('#ViewAppoinmentSlot').modal('hide');
            }

            /* on click view, view popup opened*/
            $scope.ViewAppoinmentSlot = function (CatId, DoctorId) {
                $scope.AppoinmentSlotClear();
                $scope.Id = CatId;
                $scope.AppoinmentSlot_View(CatId, DoctorId);
                angular.element('#ViewAppoinmentSlot').modal('show');
            };
            /* on click Edit, edit popup opened*/
            $scope.EditAppoinmentSlot = function (CatId, activeFlag, DoctorId) {
                if (activeFlag == 1) {
                    $scope.AppoinmentSlotClear();
                    $scope.Id = CatId;
                    $scope.AppoinmentSlot_View(CatId, DoctorId);
                    angular.element('#AppointmentSlotModal').modal('show');
                }
                else {
                    //alert("Inactive record cannot be edited");
                    toastr.info("Inactive record cannot be edited", "info");
                }
            };
            /* 
         Calling api method for the dropdown list in the html page for the fields 
         Doctor List
         */
            $scope.InstituteId = $window.localStorage['InstitutionId'];
            $scope.DoctorList = [];
            $scope.DoctorListActive = [];
            $http.get(baseUrl + '/api/AppoinmentSlot/Doctors_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.DoctorList = $ff(data, { IsActive: 1 });
                $scope.DoctorListActive = data;
            });

            $scope.searchquery = "";
            /* Filter the master list function.*/
            $scope.filterAppoinmentSlotList = function () {
                $scope.ResultListFiltered = [];
                var searchstring = angular.lowercase($scope.searchquery);
                if (searchstring == "") {
                    $scope.rowCollectionFilter = [];
                    $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                }
                else {
                    $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                        return angular.lowercase(value.Doctor_Name).match(searchstring) ||
                            angular.lowercase(value.Department_Name).match(searchstring)

                    });
                }
            }
            /* Validating the create page mandatory fields
               checking mandatory for the follwing fields
               InstituionName,InstitutionPrintName,Email,CountryName,StateName,LocationName,Registrationdate
               and showing alert message when it is null.
               */
            $scope.AppoinmentSlotAddEdit_Validations = function () {
                if (typeof ($scope.SelectedDoctor) == "undefined" || $scope.SelectedDoctor == "0" && $scope.Id == 0) {
                    //alert("Please select Doctor");
                    toastr.warning("Please select Doctor", "warning");
                    return false;
                }
                if (typeof ($scope.SelectedDoctor1) == "undefined" || $scope.SelectedDoctor1 == "0" && $scope.Id > 0) {
                    //alert("Please select Doctor");
                    toastr.warning("Please select Doctor", "warning");
                    return false;
                }
                //else if (typeof ($scope.Appoinment_Hours) == "undefined" || $scope.Appoinment_Hours == "") {
                //    alert("Please enter New Appointment Hours");
                //    return false;
                //}
                else if (typeof ($scope.Appoinment_Minutes) == "undefined" || $scope.Appoinment_Minutes == "") {
                    //alert("Please enter New Appointment Minutes");
                    toastr.warning("Please enter New Appointment Minutes", "warning");
                    return false;
                }
                else if (typeof ($scope.FollowUp_Appoinment) == "undefined" || $scope.FollowUp_Appoinment == "") {
                    //alert("Please enter Followup Appointment");
                    toastr.warning("Please enter Followup Appointment", "warning");
                    return false;
                }
                else if (typeof ($scope.SlotInterval) == "undefined" || $scope.SlotInterval == "") {
                    //alert("Please enter Slot Interval");
                    toastr.warning("Please enter Slot Interval", "warning");
                    return false;
                }
                return true;
            }
            $('#AppointmentSlotModal').on('hide.bs.modal', function () {
                console.log('hide');
                //return false;
            })

            $scope.SelectedDoctorval = function (val) {
                if ($scope.Id == 0) {
                    if (($scope.SelectedDoctor.length) == 1) {
                        angular.forEach($scope.DoctorList, function (Selected, index) {
                            $scope.DepartmentName = Selected.Department_Name;
                        });
                    }
                    else {
                        $scope.DepartmentName = ""
                    }
                }
            }

            /*on click Save calling the insert update function for Appoinment Slot
             and check the Doctor Appoinment already exist,if exist it display alert message or its 
             calling the insert update function*/
            $scope.AppoinmentDetails = [];
            $scope.SelectedDoctor = [];
            $scope.AppoinmentSlot_AddEdit = function () {
                $scope.DoctorListDetails = [];
                if ($scope.AppoinmentSlotAddEdit_Validations() == true) {
                    $("#chatLoaderPV").show();
                    if ($scope.Id == 0) {
                        angular.forEach($scope.SelectedDoctor, function (Selected, index) {

                            var obj = {
                                Id: $scope.Id,
                                Institution_Id: $window.localStorage['InstitutionId'],
                                Doctor_Id: Selected,
                                //    Appoinment_Hours:$scope.Appoinment_Hours,
                                Appoinment_Minutes: $scope.Appoinment_Minutes,
                                FollowUp_Appoinment: $scope.FollowUp_Appoinment,
                                SlotInterval: $scope.SlotInterval,
                                Created_By: $window.localStorage['UserId'],
                                Modified_By: $window.localStorage['UserId'],
                            };
                            $scope.DoctorListDetails.push(obj)
                        });
                    }
                    else {
                        var obj1 = {
                            Id: $scope.Id,
                            Institution_Id: $window.localStorage['InstitutionId'],
                            Doctor_Id: $scope.SelectedDoctor1,
                            // Appoinment_Hours:$scope.Appoinment_Hours,
                            Appoinment_Minutes: $scope.Appoinment_Minutes,
                            FollowUp_Appoinment: $scope.FollowUp_Appoinment,
                            SlotInterval: $scope.SlotInterval,
                            Created_By: $window.localStorage['UserId'],
                            Modified_By: $window.localStorage['UserId'],
                        };
                        $scope.DoctorListDetails.push(obj1)
                    }

                    $http.post(baseUrl + '/api/AppoinmentSlot/AppoinmentSlot_AddEdit/', $scope.DoctorListDetails).success(function (data) {
                        // $("#chatLoaderPV").hide();
                        alert(data.Message);
                        if (data.ReturnFlag == "1") {
                            $scope.CancelSlot();
                            $scope.AppoinmentSlotListGo();
                        }
                        $("#chatLoaderPV").hide();
                    })
                }
            }

            $scope.AppoinmentSlotClear = function () {
                $scope.SelectedDoctor1 = "0";
                $scope.SelectedDoctor = "0";
                $scope.Doctor_Id = "0";
                //  $scope.Appoinment_Hours="";
                $scope.Appoinment_Minutes = "";
                $scope.FollowUp_Appoinment = "";
                $scope.SlotInterval = "";
                $scope.Created_By = "";
                $scope.Modified_By = "";
                $scope.DepartmentName = ""
            }

            /*THIS IS FOR LIST FUNCTION*/
            $scope.AppoinmentSlotListGo = function () {
                $("#chatLoaderPV").show();
                $scope.emptydata = [];
                $scope.rowCollection = [];
                $scope.Institution_Id = "";

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }

                $http.get(baseUrl + '/api/AppoinmentSlot/AppoinmentSlot_List/Id?=0' + '&IsActive=' + $scope.ISact + '&Institution_Id=' + $scope.InstituteId).success(function (data) {

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
            };


            $scope.EditSelectedDoctor = [];
            $scope.EditSelectedDoctorList = [];
            $scope.CCCG_DetailsList = [];
            /*THIS IS FOR View FUNCTION*/
            $scope.AppoinmentSlot_View = function (Id, DoctorId) {
                $("#chatLoaderPV").show();
                $scope.EditSelectedDoctor = [];
                if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                    $scope.Id = $routeParams.Id;
                    $scope.DuplicatesId = $routeParams.Id;
                }

                $http.get(baseUrl + '/api/AppoinmentSlot/AppoinmentSlot_View/?Id=' + Id).success(function (data) {
                    $scope.Id = data.Id;
                    $scope.DuplicatesId = data.Id;
                    $scope.Doctor_Id = data.Doctor_Id.toString();
                    $scope.SelectedDoctor1 = $scope.Doctor_Id;
                    $scope.DepartmentName = data.Department_Name;
                    $scope.Doctor_Name = data.Doctor_Name;
                    //  $scope.Appoinment_Hours = data.Appoinment_Hours;
                    $scope.Appoinment_Minutes = data.Appoinment_Minutes;
                    $scope.FollowUp_Appoinment = data.FollowUp_Appoinment;
                    $scope.SlotInterval = data.SlotInterval;
                    //$scope.EditSelectedDoctor.push(data.Doctor_Id);
                    //$scope.SelectedDoctor = $scope.EditSelectedDoctor;
                    //$scope.SelectedDoctorval();
                    $("#chatLoaderPV").hide();
                });

            }

            /* 
           Calling the api method to detele the details of the Appoinment Slot 
           for the  Appoinment Slot Id,
           and redirected to the list page.
           */
            $scope.DeleteAppoinmentSlot = function (comId) {
                $scope.Id = comId;
                $scope.AppoinmentSlot_Delete();
            };
            $scope.AppoinmentSlot_Delete = function () {
                var del = confirm("Do you like to deactivate the selected Appoinment Slot?");
                if (del == true) {

                    var obj =
                    {
                        Id: $scope.Id,
                        Modified_By: $window.localStorage['UserId']
                    }

                    //  $http.post(baseUrl + '/api/MasterICD/MasterICD_AddEdit/', obj).success(function (data) {
                    $http.post(baseUrl + '/api/AppoinmentSlot/AppoinmentSlot_Delete/', obj).success(function (data) {
                        alert(data.Message);
                        $scope.AppoinmentSlotListGo();
                    }).error(function (data) {
                        $scope.error = "AN error has occured while deleting Institution!" + data;
                    });
                };
            };

            /*'Active' the Appoinment  Slot */
            $scope.ReInsertAppoinmentSlot = function (comId, DoctorId) {
                $scope.Id = comId;
                $scope.ReInsertAppoinmentSlotList(DoctorId);
            };

            /* 
            Calling the api method to inactived the details of the Appoinment  Slot 
            for the  company Id,
            and redirected to the list page.
            */
            $scope.ReInsertAppoinmentSlotList = function (DoctorId) {
                $http.get(baseUrl + '/api/AppoinmentSlot/ActivateDoctorSlot_List/?Id=' + $scope.Id
                    + '&Institution_Id=' + $window.localStorage['InstitutionId']
                    + '&Doctor_Id=' + DoctorId
                ).success(function (data) {
                    if (data.returnval == 1) {
                        alert("Activate Doctor Appoinment Slot is already created, Please check");
                    }
                    else {
                        var Ins = confirm("Do you like to activate the selected Appoinment Slot?");
                        if (Ins == true) {
                            var obj =
                            {
                                Id: $scope.Id,
                                Modified_By: $window.localStorage['UserId']
                            }
                            $http.post(baseUrl + '/api/AppoinmentSlot/AppoinmentSlot_Active/', obj).success(function (data) {
                                alert(data.Message);
                                $scope.AppoinmentSlotListGo();
                            }).error(function (data) {
                                $scope.error = "An error has occurred while ReInsertAppoinment Slot" + data;
                            });
                        };
                    }
                })
            }
        } else {
            window.location.href = baseUrl + "/Home/LoginIndex";
        }
    }
]);