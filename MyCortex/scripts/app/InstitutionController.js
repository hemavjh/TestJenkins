var Institution = angular.module("InstitutionController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

Institution.controller("InstitutionController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'InstSub', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, InstSub, toastr) {
        $scope.CreatedBy = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.CountryFlag = false;
        $scope.StateFlag = false;
        $scope.CityFlag = false;
        $scope.CountryDuplicateId = "0";
        $scope.StateDuplicateId = "0";
        $scope.LocationDuplicateId = "0";
        $scope.Mode = $routeParams.Mode;
        //$scope.myService = myService;
        if ($routeParams.ModeType == undefined) {
            $scope.ModeType = "1";
        }
        else {
            $scope.ModeType = $routeParams.ModeType;
        }
        if ($scope.CreatedBy == 1 || $scope.CreatedBy == 3) {
            document.getElementById("mydiv").style.display = "none";
        }
        $scope.loadCount = 3;
        $scope.DropDownListValue = 2;
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        //Declaration and initialization of Scope Variables.
        $scope.listdata = [];
        $scope.Institution_Name = "";
        $scope.INSTITUTION_SHORTNAME = "";
        $scope.Address1 = "";
        $scope.Address2 = "";
        $scope.Address3 = "";
        $scope.ZipCode = "";
        $scope.Email = "";
        $scope.CountryId = "0";
        $scope.StateNameId = "0";
        $scope.LocationNameId = "0";
        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.IsActive = true;
        $scope.rowCollection = [];
        $scope.rowCollectionFilter = [];
        $scope.Id = 0;
        $scope.PhotoValue = 0;
        $scope.UserCount = 0;
        $scope.TotalUserCount = 0;
        $scope.startno = 0;
        $http.get(baseUrl + '/api/User/GetUserCount/').success(function (data) {
            $scope.UserCount = data;
            $scope.TotalUserCount = data;
        });

        $http.get(baseUrl + '/api/User/Get_Exist_AnyUnEncryptedUser/').success(function (data) {
            if (data == 0) {
                $("#newEncry").css('display', 'inline-block');
            } else if (data == 1) {
                $("#newEncry").css('display', 'none');
            }
        });

        $scope.Apply_New_Encryption_to_UserDetails = function () {
            if ($scope.UserCount != 0) {
                $("#newEncry").text('Processing...');
                $http.get(baseUrl + '/api/User/EncryptedUserList/?startno=' + $scope.startno).success(function (data) {
                    console.log(data);
                    if ($scope.UserCount > 0) {
                        $scope.startno = $scope.startno + 1;
                        $scope.UserCount = $scope.UserCount - 1000;
                        var te = parseInt((($scope.startno * 1000) / $scope.TotalUserCount) * 100);
                        $("#newEncry").css('display', 'none');
                        // $("#processtext").text(te.toString() + " % Completed");
                        $("#processtext").text($scope.startno * 1000 +" User Details Changed Out of " + $scope.TotalUserCount);
                        $scope.Apply_New_Encryption_to_UserDetails();
                    } else {
                        $("#newEncry").text('Apply New Encryption');
                        //$("#newEncry").css('display', 'inline-block');
                        $("#newEncry").css('display', 'none');
                        $("#processtext").text('');
                    }
                });
            }
        }

        $scope.AddInstitutionpopup = function () {
            $('#divInsCountry').addClass("ng-invalid");
            $('#divInsState').addClass("ng-invalid");
            $('#divInsCity').addClass("ng-invalid");
            $scope.submitted = false;
            $scope.Id = 0;
            $scope.loadCount = 0;
            $scope.InstitutionClear();
            $scope.DropDownListValue = 1;
            $scope.editInstbutton = 0;
            $('#btnsave1').attr("disabled", false);
            $('#btnsave2').attr("disabled", false);
            angular.element('#InstitutionCreateModal').modal('show');
        }

        $scope.CancelInstitutionpopup = function () {
            angular.element('#InstitutionCreateModal').modal('hide');
        }

        $scope.ViewInstitutionpopup = function () {
            angular.element('#ViewInstitutionModal').modal('show');
        }

        $scope.CancelViewInstitutionpopup = function () {
            angular.element('#ViewInstitutionModal').modal('hide');
        }

        /* on click view, view popup opened*/
        $scope.ViewInstitution = function (CatId) {
            $scope.InstitutionClear();
            $scope.Id = CatId;
            $scope.DropDownListValue = 2;
            $scope.InstitutionDetails_View();
            angular.element('#ViewInstitutionModal').modal('show');
        };
        $scope.editInstbutton = 0;
        /* on click Edit, edit popup opened*/
        $scope.EditInstitution = function (CatId, activeFlag) {
            if (activeFlag == 1) {
                $scope.InstitutionClear();
                $scope.Id = CatId;
                $scope.DropDownListValue = 1;
                $scope.InstitutionDetails_View();
                $('#btnsave').attr("disabled", false);
                angular.element('#InstitutionCreateModal').modal('show');
                $('#rowid').prop('disabled', true);
                $scope.editInstbutton = 1;
            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
            }
        };

        /* 
         Calling api method for the dropdown list in the html page for the fields 
         Country,State,Locaiton
         */
        /*  $scope.State_Template = [];
          $scope.City_Template = [];
          $scope.CountryNameList = [];
          $scope.StateNameList = [];
          $scope.CityNameList = [];*/

        $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
            $scope.CountryNameList = data;
        });

        $scope.CountryBased_StateFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CountryId).success(function (data) {
                    $scope.StateName_List = data;
                    $scope.LocationName_List = [];
                    $scope.LocationNameId = "0";
                    if ($scope.StateFlag == true) {
                        $scope.StateNameId = $scope.StateDuplicateId
                    }
                });
            }
        }
        $scope.StateBased_CityFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CountryId + '&StateId=' + $scope.StateNameId).success(function (data) {
                    $scope.LocationName_List = data;
                });
                if ($scope.CityFlag == true) {
                    $scope.LocationNameId = $scope.LocationDuplicateId
                }
            }
        }

        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterInstitutionList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = [];
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Institution_Name).match(searchstring) ||
                        angular.lowercase(value.INSTITUTION_SHORTNAME).match(searchstring) ||
                        angular.lowercase(value.CountryName).match(searchstring) ||
                        angular.lowercase(value.StateName).match(searchstring) ||
                        angular.lowercase(value.CityName).match(searchstring);
                });
            }
        }

        /* Validating the create page mandatory fields
            checking mandatory for the follwing fields
            InstituionName,InstitutionPrintName,Email,CountryName,StateName,LocationName,Registrationdate
            and showing alert message when it is null.
            */
        $scope.InstitutionAddEdit_Validations = function () {
            if (typeof ($scope.Institution_Name) == "undefined" || $scope.Institution_Name == "") {
                //alert("Please enter Institution Name");
                toastr.warning('Please enter Institution Name', 'warning');
                return false;
            }
            else if (typeof ($scope.INSTITUTION_SHORTNAME) == "undefined" || $scope.INSTITUTION_SHORTNAME == "") {
                //alert("Please enter Short Name");
                toastr.warning('Please enter Short Name', 'warning');
                return false;
            }
            else if (typeof ($scope.Email) == "undefined" || $scope.Email == "") {
                //alert("Please enter Email");
                toastr.warning("Please enter Email", "warning");
                return false;
            }
            else if (EmailFormate($scope.Email) == false) {
                //alert("Invalid email format");
                toastr.warning("Invalid email format", "warning");
                return false;
            }
            else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                //alert("Please select Country");
                toastr.warning("Please select Country", "warning");
                return false;
            }
            else if (typeof ($scope.StateNameId) == "undefined" || $scope.StateNameId == "0") {
                //alert("Please select State");
                toastr.warning("Please select State", "warning");
                return false;
            }
            else if (typeof ($scope.LocationNameId) == "undefined" || $scope.LocationNameId == "0") {
                //alert("Please select City");
                toastr.warning("Please select City", "warning");
                return false;
            }
            return true;
        }
        $('#InstitutionCreateModal').on('hide.bs.modal', function () {
            console.log('hide');
            //return false;
        })
        /*This is for getting a file url for uploading the url into the database*/
        $scope.dataURItoBlob = function (dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {
                type: mimeString
            });
        }

        /* Read file name for the  Photo and file */
        $scope.photoChange = function () {
            if ($('#InstitutionLogo')[0].files[0] != undefined) {
                $scope.FileName = $('#InstitutionLogo')[0].files[0]['name'];
            }
        }

        //this is for image upload function//
        $scope.uploadImage = function (Photo) {
            var filename = "";
            //var fd = new FormData();
            if ($('#InstitutionLogo')[0].files[0] != undefined) {
                FileName = $('#InstitutionLogo')[0].files[0]['name'];
            }
        }
        $scope.InstitutionAndSubscription = 0;
        $scope.Institution_AddEdit_AndSubscription = function () {
            $scope.InstitutionAndSubscription = 1;
            $scope.Institution_AddEdit();
        }

        $scope.Institution_AddAndEdit = function () {
            var activeButton = document.activeElement.id;
            if (activeButton == "btnsave2" && $scope.editInstbutton == 0) {
                $scope.Institution_AddEdit_AndSubscription();
            }
            else if (activeButton == "btnsave1" && $scope.editInstbutton == 1) {
                $scope.Institution_AddEdit();
            }
        }

        //$scope.insCountryChange = function () {
        //    var country = document.getElementById('countryselectpicker').value;
        //    if (country != "0") {
        //        $('#divInsCountry').removeClass("ng-invalid");
        //        $('#divInsCountry').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInsCountry').removeClass("ng-valid");
        //        $('#divInsCountry').addClass("ng-invalid");
        //    }
        //}

        //$scope.insStateChange = function () {
        //    var state = document.getElementById('stateselectpicker').value;
        //    if (state != "0") {
        //        $('#divInsState').removeClass("ng-invalid");
        //        $('#divInsState').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInsState').removeClass("ng-valid");
        //        $('#divInsState').addClass("ng-invalid");
        //    }
        //}

        //$scope.insCityChange = function () {
        //    var city = document.getElementById('cityselectpicker').value;
        //    if (city != "0") {
        //        $('#divInsCity').removeClass("ng-invalid");
        //        $('#divInsCity').addClass("ng-valid");
        //    }
        //    else {
        //        $('#divInsCity').removeClass("ng-valid");
        //        $('#divInsCity').addClass("ng-invalid");
        //    }
        //}

        /*on click Save calling the insert update function for Institution
             and check the Institution Name already exist,if exist it display alert message or its 
             calling the insert update function*/
        $scope.BlobFileName = "";
        $scope.Institution_AddEdit = function () {
            if ($scope.InstitutionAddEdit_Validations() == true) {
                $("#chatLoaderPV").show();
                $scope.PhotoFullpath = $('#item-img-output').attr('src');
                var FileName = "";
                var Licensefilename = "";
                var fd = new FormData();
                var imgBlob;
                var NationalimgBlob;
                var InsuranceimgBlob;
                var imgBlobfile;
                var itemIndexLogo = -1;
                var NationalitemIndexLogo = -1;
                var InsuranceitemIndexLogo = -1;
                var itemIndexdoc = -1;
                var fd = new FormData();
                //if ($('#InstitutionLogo')[0].files[0] != undefined) {
                //    FileName = $('#InstitutionLogo')[0].files[0]['name'];
                //    imgBlob = $scope.dataURItoBlob($scope.uploadme);
                //    itemIndexLogo = 0;
                //}
                //if (itemIndexLogo != -1) {
                //    fd.append('file', imgBlob);
                //}
                ///*
                //calling the api method for read the file path 
                //and saving the image uploaded in the local server. 
                //*/

                //$http.post(baseUrl + '/api/Common/AttachFile',
                //fd,
                //{
                //    transformRequest: angular.identity,
                //    headers: {
                //        'Content-Type': undefined
                //    }
                //}
                //)
                //.success(function (response) {
                //    if ($scope.FileName == "") {
                //        $scope.InstitutionLogo = "";
                //    }
                //    else if (itemIndexLogo > -1) {
                //        if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                //            $scope.InstitutionLogo = response[itemIndexLogo];
                //        }
                //    }
                var obj = {
                    Id: $scope.Id,
                    Institution_Name: $scope.Institution_Name,
                    INSTITUTION_SHORTNAME: $scope.INSTITUTION_SHORTNAME,
                    Institution_Address1: $scope.Address1,
                    Institution_Address2: $scope.Address2,
                    Institution_Address3: $scope.Address3,
                    ZipCode: $scope.ZipCode == 0 ? null : $scope.ZipCode,
                    Email: $scope.Email,
                    CountryId: $scope.CountryId,
                    StateId: $scope.StateNameId,
                    CityId: $scope.LocationNameId,
                    FileName: $scope.FileName,
                    Photo_Fullpath: $scope.PhotoFullpath,
                    Photo: $scope.InstitutionLogo,
                    Created_by: $scope.CreatedBy
                };
                $('#btnsave1').attr("disabled", true);
                $('#btnsave2').attr("disabled", true);
                $http.post(baseUrl + '/api/Institution/Institution_AddEdit/', obj).success(function (data) {
                    var insId = data.Institute[0].Id;
                    //alert(data.Message);
                    if (data.ReturnFlag == "1") {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == "0") {
                        toastr.info(data.Message, "info");
                    }
                    $('#btnsave1').attr("disabled", false);
                    $('#btnsave2').attr("disabled", false);


                    if ($scope.PhotoValue == 1) {
                        if ($('#InstitutionLogo')[0].files[0] != undefined) {
                            FileName = $('#InstitutionLogo')[0].files[0]['name'];
                            imgBlob = $scope.dataURItoBlob($scope.PhotoFullpath);
                            itemIndexLogo = 0;
                        }

                        if (itemIndexLogo != -1) {
                            fd.append('file', imgBlob);
                        }

                        $http.post(baseUrl + '/api/Institution/AttachPhoto?Id=' + insId,
                            fd,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .success(function (response) {
                                if ($scope.FileName == "") {
                                    $scope.InstitutionLogo = "";
                                }
                                else if (itemIndexLogo > -1) {
                                    if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                        $scope.InstitutionLogo = response[itemIndexLogo];
                                    }
                                }
                                $("#InstitutionLogo").val('');
                                if (data.ReturnFlag == 1) {
                                    $scope.CancelInstitution();
                                    if ($scope.InstitutionAndSubscription == 0) {
                                        InstSub.setInstiID(0);
                                        $scope.InstitutionDetailsListGo();
                                    }
                                    if ($scope.InstitutionAndSubscription == 1) {
                                        InstSub.setInstiID(insId);
                                        window.location.href = baseUrl + "/Home/Index#/Institution_Subscription";
                                    }
                                }
                            })
                    }
                    else {
                        $("#InstitutionLogo").val('');
                        if (data.ReturnFlag == 1) {
                            $scope.CancelInstitution();
                            if ($scope.InstitutionAndSubscription == 0) {
                                InstSub.setInstiID(0);
                                $scope.InstitutionDetailsListGo();
                            }
                            if ($scope.InstitutionAndSubscription == 1) {
                                InstSub.setInstiID(insId);
                                window.location.href = baseUrl + "/Home/Index#/Institution_Subscription";
                            }
                        }
                    }
                    $("#chatLoaderPV").hide();

                })
                    .error(function (response) {
                        $scope.Photo = "";
                        $scope.CancelInstitution();
                        $scope.InstitutionDetailsListGo();
                    });

                //})
            }
        }
        $scope.InstitutionClear = function () {
            $scope.Institution_Name = "";
            $scope.INSTITUTION_SHORTNAME = "";
            $scope.Address1 = "";
            $scope.Address2 = "";
            $scope.Address3 = "";
            $scope.ZipCode = "";
            $scope.Email = "";
            $scope.CountryId = 0;
            $scope.StateNameId = 0;
            $scope.LocationNameId = 0;
            $scope.FileName = "";
            $scope.Photo_Fullpath = "";
            $scope.InstitutionLogo = "";
            $scope.uploadme = "";
            $scope.PhotoValue = 0;
            $('#InstitutionLogo').val('');
        }
        $scope.PhotoUplaodSelected = function () {
            $scope.PhotoValue = 1;

        };
        $scope.NationalityPhotoUplaodSelected = function () {
            $scope.PhotoValue1 = 1;
            $scope.NationalPhotoValue = 1;
        };
        $scope.InsurancePhotoUplaodSelected = function () {
            $scope.PhotoValue2 = 1;
            $scope.InsurancePhotoValue = 1;
        };

        /* Clear the uploaded image */
        $scope.imageclear = function () {
            $scope.InstitutionLogo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#InstitutionLogo').val('');

        };
        /*THIS IS FOR LIST FUNCTION*/
        $scope.InstitutionDetailsListGo = function () {
            if ($window.localStorage['UserTypeId'] == 1) {

                $("#chatLoaderPV").show();
                $scope.emptydata = [];
                $scope.rowCollection = [];
                $scope.Institution_Id = "";
                $scope.TimeZone_Id = "";

                $scope.ISact = 1;       // default active
                if ($scope.IsActive == true) {
                    $scope.ISact = 1  //active
                }
                else if ($scope.IsActive == false) {
                    $scope.ISact = -1 //all
                }

                $http.get(baseUrl + '/api/Institution/InstitutionDetails_List/Id?=' + $scope.Institution_Id + '&IsActive=' + $scope.ISact).success(function (data) {
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

        /*THIS IS FOR View FUNCTION*/
        $scope.InstitutionDetails_View = function () {
            $("#chatLoaderPV").show();
            $scope.loadCount = 3;
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/Institution/Institution_GetPhoto/?Id=' + $scope.Id).success(function (data) {
                if (data.PhotoBlob != null) {
                    $scope.uploadme = 'data:image/png;base64,' + data.PhotoBlob;
                }
                else {
                    $scope.uploadme = null;
                }
            })
            $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Institution_Name = data.Institution_Name;
                $scope.INSTITUTION_SHORTNAME = data.INSTITUTION_SHORTNAME;
                $scope.Address1 = data.Institution_Address1;
                $scope.Address2 = data.Institution_Address2;
                $scope.Address3 = data.Institution_Address3;
                $scope.ZipCode = data.ZipCode;
                if (data.Email == null)
                    $scope.Email = "";
                else
                    $scope.Email = data.Email;
                $scope.CountryId = data.CountryId.toString();
                $scope.CountryDuplicateId = $scope.CountryId;
                $scope.CountryFlag = true;
                //$scope.Country_onChange();

                if ($scope.CountryId != "0") {
                    $('#divInsCountry').removeClass("ng-invalid");
                    $('#divInsCountry').addClass("ng-valid");
                }
                else {
                    $('#divInsCountry').removeClass("ng-valid");
                    $('#divInsCountry').addClass("ng-invalid");
                }

                // $scope.CountryBased_StateFunction();
                $scope.ViewCountryName = data.CountryName;
                $scope.StateNameId = data.StateId.toString();
                $scope.StateDuplicateId = $scope.StateNameId;
                $scope.StateFlag = true;

                if ($scope.StateNameId != "0") {
                    $('#divInsState').removeClass("ng-invalid");
                    $('#divInsState').addClass("ng-valid");
                }
                else {
                    $('#divInsState').removeClass("ng-valid");
                    $('#divInsState').addClass("ng-invalid");
                }

                //  $scope.StateBased_CityFunction();
                // $scope.State_onChange();
                $scope.ViewStateName = data.StateName;
                $scope.LocationNameId = data.CityId.toString();
                $scope.LocationDuplicateId = $scope.LocationNameId;
                $scope.CityFlag = true;

                if ($scope.LocationNameId != "0") {
                    $('#divInsCity').removeClass("ng-invalid");
                    $('#divInsCity').addClass("ng-valid");
                }
                else {
                    $('#divInsCity').removeClass("ng-valid");
                    $('#divInsCity').addClass("ng-invalid");
                }

                if ($scope.DropDownListValue == 1) {
                    $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                        $scope.CountryNameList = data;
                        if ($scope.CountryFlag == true) {
                            $scope.CountryId = $scope.CountryDuplicateId;
                            $scope.CountryFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                            if ($scope.CountryId != "0") {
                                $('#divInsCountry').removeClass("ng-invalid");
                                $('#divInsCountry').addClass("ng-valid");
                            }
                            else {
                                $('#divInsCountry').removeClass("ng-valid");
                                $('#divInsCountry').addClass("ng-invalid");
                            }
                        }
                    });
                    $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + data.CountryId.toString()).success(function (data) {
                        $scope.StateName_List = data;
                        if ($scope.StateFlag == true) {
                            $scope.StateNameId = $scope.StateDuplicateId;
                            $scope.StateFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                            if ($scope.StateNameId != "0") {
                                $('#divInsState').removeClass("ng-invalid");
                                $('#divInsState').addClass("ng-valid");
                            }
                            else {
                                $('#divInsState').removeClass("ng-valid");
                                $('#divInsState').addClass("ng-invalid");
                            }
                        }
                    });
                    $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + data.CountryId.toString() + '&StateId=' + data.StateId.toString()).success(function (data) {
                        //$scope.LocationName_List =data ;    
                        $scope.LocationName_List = data;
                        if ($scope.CityFlag == true) {
                            $scope.LocationNameId = $scope.LocationDuplicateId;
                            $scope.CityFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                            if ($scope.LocationNameId != "0") {
                                $('#divInsCity').removeClass("ng-invalid");
                                $('#divInsCity').addClass("ng-valid");
                            }
                            else {
                                $('#divInsCity').removeClass("ng-valid");
                                $('#divInsCity').addClass("ng-invalid");
                            }
                        }
                    });
                }
                $scope.ViewCityName = data.CityName;
                $scope.Photo = data.Photo;
                $scope.InstitutionLogo = data.Photo;
                //$scope.uploadme = data.Photo;
                $scope.FileName = data.FileName;
                $scope.PhotoFullpath = data.Photo_Fullpath;
                $("#chatLoaderPV").hide();
            });
        }

        /* THIS IS FUNCTION FOR CLOSE Page  */
        $scope.CancelInstitution = function () {
            angular.element('#InstitutionCreateModal').modal('hide');
        };

        /* 
        Calling the api method to detele the details of the Institution 
        for the  Institution Id,
        and redirected to the list page.
        */
        $scope.DeleteInstitution = function (comId) {
            $scope.Id = comId;
            $scope.Institution_Delete();
        };
        $scope.Institution_Delete = function () {
             Swal.fire({
                 title: 'Do you like to deactivate the selected Institution?',
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
                    $http.get(baseUrl + '/api/Institution/InstitutionDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Institution has been deactivated Successfully");
                        toastr.success("Selected Institution has been deactivated Successfully", "success");
                        $scope.InstitutionDetailsListGo();
                    }).error(function (data) {
                        $scope.error = "AN error has occured while deleting Institution!" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var del = confirm("Do you like to deactivate the selected Institution?");
            if (del == true) {
                $http.get(baseUrl + '/api/Institution/InstitutionDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Institution has been deactivated Successfully");
                    toastr.success("Selected Institution has been deactivated Successfully", "success");
                    $scope.InstitutionDetailsListGo();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Institution!" + data;
                });
            };*/
        };

        /*'Active' the Institution*/
        $scope.ReInsertInstitution = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertInstitutionDetails();

        };

        /* 
        Calling the api method to inactived the details of the company 
        for the  company Id,
        and redirected to the list page.
        */
        $scope.ReInsertInstitutionDetails = function () {
            Swal.fire({
                title: 'Do you like to activate the selected Institution?',
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
                    $http.get(baseUrl + '/api/Institution/InstitutionDetails_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Institution has been activated successfully");
                        toastr.success("Selected Institution has been activated successfully", "success");
                        $scope.InstitutionDetailsListGo();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ReInsertInstitutionDetails" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*var Ins = confirm("Do you like to activate the selected Institution?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/Institution/InstitutionDetails_Active/?Id=' + $scope.Id).success(function (data) {
                    //alert("Selected Institution has been activated successfully");
                    toastr.success("Selected Institution has been activated successfully", "success");
                    $scope.InstitutionDetailsListGo();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ReInsertInstitutionDetails" + data;
                });
            };*/
        }

        /*
        Calling the api method to insert the default data of the Institution
        for the  Institution Id,
        and redirected to the list page.
        */
        $scope.InsertDefaultData = function () {
            $http.get(baseUrl + '/api/Institution/InstitutionDefaultData_Insert/?Id=' + $scope.Id).success(function (data) {
                //alert("Institution Default Data Inserted successfully");
                toastr.success("Institution Default Data Inserted successfully", "success");
                // $scope.InstitutionDetailsListGo();
            }).error(function (data) {
                $scope.error = "An error has occurred while InsertInstitution Default Records" + data;
            });

        };
    }

]);
