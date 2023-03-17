var InstitutionHAcontroller = angular.module("InstitutionHospitalAdminController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

InstitutionHAcontroller.controller("InstitutionHospitalAdminController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        //Declaration and initialization of Scope Variables.
        $scope.CountryFlag = false;
        $scope.StateFlag = false;
        $scope.CityFlag = false;
        $scope.CountryDuplicateId = "0";
        $scope.StateDuplicateId = "0";
        $scope.LocationDuplicateId = "0";

        $scope.listdata = [];
        $scope.Institution_Name = "";
        $scope.INSTITUTION_SHORTNAME = "";
        $scope.Address1 = "";
        $scope.Address2 = "";
        $scope.Address3 = "";
        $scope.ZipCode = "";
        $scope.Email = "";
        //   $scope.CountryId = "0";
        //  $scope.StateNameId = "0";
        $scope.LocationNameId = "0";
        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.IsActive = true;
        $scope.rowCollection = [];
        $scope.rowCollectionFilter = [];
        $scope.Id = 0;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.PhotoValue = 0;

        $scope.loadCount = 3;
        /*THIS IS FOR View FUNCTION*/
        $scope.InstitutionDetails_View = function (DropDownListValue) {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/Institution/Institution_GetPhoto/?Id=' + $scope.InstituteId).then(function (response) {
                if (response.data.PhotoBlob != null) {
                    $scope.uploadme = 'data:image/png;base64,' + response.data.PhotoBlob;
                }
                else {
                    $scope.uploadme = '';
                }
            }, function errorCallback(response) {
            });
            $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).then(function (response) {
                $scope.DuplicatesId = response.data.Id;
                $scope.Institution_Name = response.data.Institution_Name;
                $scope.INSTITUTION_SHORTNAME = response.data.INSTITUTION_SHORTNAME;
                $scope.Address1 = response.data.Institution_Address1;
                $scope.Address2 = response.data.Institution_Address2;
                $scope.Address3 = response.data.Institution_Address3;
                $scope.ZipCode = response.data.ZipCode;
                $scope.Email = response.data.Email;
                $scope.CountryId = response.data.CountryId.toString();
                $scope.CountryDuplicateId = $scope.CountryId;
                $scope.CountryFlag = true;
                //$scope.Country_onChange();           
                $scope.ViewCountryName = response.data.CountryName;
                //   $scope.CountryBased_StateFunction();
                $scope.StateNameId = response.data.StateId.toString();
                $scope.StateDuplicateId = $scope.StateNameId;
                $scope.StateFlag = true;

                //$scope.State_onChange();
                //  $scope.StateBased_CityFunction();
                $scope.ViewStateName = response.data.StateName;
                $scope.LocationNameId = response.data.CityId.toString();
                $scope.LocationDuplicateId = $scope.LocationNameId;
                $scope.CityFlag = true;
                if (DropDownListValue == 1) {
                    $http.get(baseUrl + '/api/Common/CountryList/').then(function (response) {
                        $scope.CountryNameList = response.data;
                        if ($scope.CountryFlag == true) {
                            $scope.CountryId = $scope.CountryDuplicateId;
                            $scope.CountryFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    }, function errorCallback(response) {
                    });
                    $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + response.data.CountryId.toString()).then(function (response) {
                        $scope.StateName_List = response.data;
                        if ($scope.StateFlag == true) {
                            $scope.StateNameId = $scope.StateDuplicateId;
                            $scope.StateFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    }, function errorCallback(response) {
                    });
                    $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + response.data.CountryId.toString() + '&StateId=' + response.data.StateId.toString()).then(function (response) {
                        //$scope.LocationName_List =data ;    
                        $scope.LocationName_List = response.data;
                        if ($scope.CityFlag == true) {
                            $scope.LocationNameId = $scope.LocationDuplicateId;
                            $scope.CityFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    }, function errorCallback(response) {
                    });
                }
                $scope.ViewCityName = response.data.CityName;
                $scope.Photo = response.data.Photo;
                $scope.InstitutionLogo = response.data.Photo;
                //$scope.uploadme = data.Photo;
                $scope.FileName = response.data.FileName;
                $scope.PhotoFullpath = response.data.Photo_Fullpath;
                $("#chatLoaderPV").hide();
            }, function errorCallback(response) {
            });
        }


        $scope.EditInstitutionHospitalAdmin = function () {
            //$scope.InstitutionDetails_View();
            $scope.DropDownListValue = 1;
            $location.path("/EditInstitutionHospitalAdmin");
        };


        $scope.CountryBased_StateFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CountryId).then(function (response) {
                    $scope.StateName_List = response.data;
                    $scope.LocationName_List = [];
                    $scope.LocationNameId = "0";
                    if ($scope.StateFlag == true) {
                        $scope.StateNameId = $scope.StateDuplicateId
                    }
                }, function errorCallback(response) {
                });
            }
        }
        $scope.StateClearFunction = function () {
            $scope.StateNameId = "0";
        };

        $scope.StateBased_CityFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CountryId + '&StateId=' + $scope.StateNameId).then(function (response) {
                    $scope.LocationName_List = response.data;
                    if ($scope.CityFlag == true) {
                        $scope.LocationNameId = $scope.LocationDuplicateId
                    }
                }, function errorCallback(response) {
                });
            }
        }

        $scope.LocationClearFunction = function () {
            $scope.LocationNameId = "0";
        };
        /* Validating the create page mandatory fields
            checking mandatory for the follwing fields
            InstituionName,InstitutionPrintName,Email,CountryName,StateName,LocationName,Registrationdate
            and showing alert message when it is null.
            */
        $scope.InstitutionAddEdit_Validations = function () {
            if (typeof ($scope.Institution_Name) == "undefined" || $scope.Institution_Name == "") {
                //alert("Please enter Institution Name");
                toastr.warning("Please enter Institution Name", "warning");
                return false;
            }
            else if (typeof ($scope.INSTITUTION_SHORTNAME) == "undefined" || $scope.INSTITUTION_SHORTNAME == "") {
                //alert("Please enter Short Name");
                toastr.warning("Please enter Short Name", "warning");
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
            if ($scope.uploadme != "" && $scope.uploadme != null) {
                $scope.Image = filetype = $scope.uploadme.split(',')[0].split(':')[1].split(';')[0];
                $scope.filetype = $scope.Image.split("/");
                var fileval = 0;
                var fileExtenstion = "";
                if ($scope.filetype.length > 0) {
                    fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                }
                if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                    || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico") {// check more condition with MIME type                      
                    fileval = 1;
                }
                else {
                    fileval = 2;
                }
                if (fileval == 2) {
                    //alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico");
                    toastr.warning("Please choose files of type jpeg/jpg/png/bmp/gif/ico", "warning");
                    return false;
                }
            }
            return true;
        }

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

        /*on click Save calling the insert update function for Institution
             and check the Institution Name already exist,if exist it display alert message or its 
             calling the insert update function*/
        $scope.BlobFileName = "";
        $scope.Institution_AddEdit = function () {
            if ($scope.InstitutionAddEdit_Validations() == true) {
                $scope.PhotoFullpath = $('#item-img-output').attr('src');
                var obj = {
                    Id: $scope.InstituteId,
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
                };
                $("#btnsave").attr("disabled", true);
                $http.post(baseUrl + '/api/Institution/Institution_AddEdit/', obj).then(function (response) {
                    var insId = response.data.Institute[0].Id;

                    if ($scope.PhotoValue == 1) {
                        var FileName = "";
                        var Licensefilename = "";
                        var fd = new FormData();
                        var imgBlob;
                        var imgBlobfile;
                        var itemIndexLogo = -1;
                        var itemIndexdoc = -1;
                        var fd = new FormData();
                        if ($('#InstitutionLogo')[0].files[0] != undefined) {
                            FileName = $('#InstitutionLogo')[0].files[0]['name'];
                            imgBlob = $scope.dataURItoBlob($scope.PhotoFullpath);
                            itemIndexLogo = 0;
                        }
                        if (itemIndexLogo != -1) {
                            fd.append('file', imgBlob);
                        }
                        /*
                        calling the api method for read the file path 
                        and saving the image uploaded in the local server. 
                        */

                        $http.post(baseUrl + '/api/Institution/AttachPhoto?Id=' + insId,
                            fd,
                            {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        )
                            .then(function (response) {
                                if ($scope.FileName == "") {
                                    $scope.InstitutionLogo = "";
                                }
                                else if (itemIndexLogo > -1) {
                                    if ($scope.FileName != "" && response.data[itemIndexLogo] != "") {
                                        $scope.InstitutionLogo = response.data[itemIndexLogo];
                                    }
                                }
                                $http.get(baseUrl + '/Home/LoginLogoDetails/').then(function (resImage) {
                                    document.getElementById("InstLogo").src = resImage.data[0];
                                    //alert(data.Message);
                                    toastr.success(response.data.Message, "success");
                                    $("#btnsave").attr("disabled", false);
                                    $scope.CancelInstitutionHospitalAdmin();
                                }, function errorCallback(resImage) {
                                    $scope.Photo = "";
                                });
                            }, function errorCallback(response) {
                                $scope.Photo = "";
                            });
                    }
                    else {
                        //alert(data.Message);
                        toastr.success(response.data.Message, "success");
                        $("#btnsave").attr("disabled", false);
                        $scope.CancelInstitutionHospitalAdmin();
                    }
                    $("#InstitutionLogo").val('');
                    $("#btnsave").attr("disabled", false);
                }, function errorCallback(response) {
                });
            }
        }
        $scope.PhotoUplaodSelected = function () {
            $scope.PhotoValue = 1;
        };
        $scope.InstitutionClear = function () {
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
            $scope.FileName = "";
            $scope.Photo_Fullpath = "";
            $scope.InstitutionLogo = "";
            $scope.uploadme = "";
            $('#InstitutionLogo').val('');
            $scope.PhotoValue = 0;
        }

        /* Clear the uploaded image */
        $scope.imageclear = function () {
            $scope.InstitutionLogo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#InstitutionLogo').val('');

        };

        /* THIS IS FUNCTION FOR CLOSE Page  */
        $scope.CancelInstitutionHospitalAdmin = function () {
            $location.path("/InstitutionHospitalAdmin_view/");
            //$scope.ClearInstitutionPopup();
        };

        $scope.DeleteCometChatUsers = function () {
            Swal.fire({
                title: 'Are you sure you want to Run this Settings?',
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
                    $("#runCometchat").text('Processing(0%)....');
                    $("#runCometchat").addClass('disabled');
                    let isComplete = false;
                    $http.get(baseUrl + 'api/User/GetCometChatUserList?InstitutionId=' + $scope.InstituteId).then(function (response) {
                        if (response.data.length > 0) {
                            var usercount = response.data.length;
                            angular.forEach(response.data, function (item, modIndex) {
                                $http.get(baseUrl + 'api/User/DeleteCometchat_User?Id=' + item.Id + '&Institution=' + $scope.InstituteId).then(function (response) {
                                    var obj = {
                                        Id: item.Id,
                                        FullName: item.FullName,
                                        EMAILID: item.EmailId
                                    };
                                    $http.post(baseUrl + 'api/User/CreateCometchat_User?Institution=' + $scope.InstituteId, obj).then(function (response) {
                                        if (parseInt(usercount) - 1 === modIndex) {
                                            isComplete = true;
                                            $("#runCometchat").text('CometChat User Configuration');
                                            $("#runCometchat").removeClass('disabled');
                                        }
                                        else {
                                            if (!isComplete) {
                                                var percentage = (modIndex / usercount) * 100;
                                                $("#runCometchat").text('Processing(' + percentage + '%)....');
                                            }
                                        }
                                    }, function errorCallback(response) {

                                    });
                                }, function errorCallback(response) {
                                });
                            });
                        }
                    }, function errorCallback(response) {
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
           /* if (confirm("Are you sure you want to Run this Settings?")) {
                $("#runCometchat").text('Processing(0%)....');
                $("#runCometchat").addClass('disabled');
                let isComplete = false;
                $http.get(baseUrl + 'api/User/GetCometChatUserList?InstitutionId=' + $scope.InstituteId).success(function (data) {
                    if (data.length > 0) {
                        var usercount = data.length;
                        angular.forEach(data, function (item, modIndex) {
                            $http.get(baseUrl + 'api/User/DeleteCometchat_User?Id=' + item.Id + '&Institution=' + $scope.InstituteId).success(function (data) {
                                var obj = {
                                    Id: item.Id,
                                    FullName: item.FullName,
                                    EMAILID: item.EmailId
                                };
                                $http.post(baseUrl + 'api/User/CreateCometchat_User?Institution=' + $scope.InstituteId, obj).success(function (data) {
                                    if (parseInt(usercount) - 1 === modIndex) {
                                        isComplete = true;
                                        $("#runCometchat").text('CometChat User Configuration');
                                        $("#runCometchat").removeClass('disabled');
                                    }
                                    else {
                                        if (!isComplete) {
                                            var percentage = (modIndex / usercount) * 100;
                                            $("#runCometchat").text('Processing(' + percentage + '%)....');
                                        }
                                    }
                                }).error(function (data) {

                                });
                            }).error(function (data) {
                            });
                        });
                    }
                }).error(function (data) {
                });
            }*/
        };

        $scope.InstitueConfiguration = function () {
            Swal.fire({
                title: 'Are you sure you want to Run this Configuration Settings?',
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
                    $("#runConfig").text('Processing(0%)....');
                    $("#runConfig").addClass('disabled');
                    $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=1', $scope.InstituteId).then(function (response) {
                        $("#runConfig").text('Processing(5%)....');
                        $scope.InstitueConfigurationStep2();
                    }, function errorCallback(response) {
                        //alert("Error In Step 1");
                        toastr.info("Error In Step 1", "info");
                        $("#runConfig").text('Processing(5%)....');
                        $scope.InstitueConfigurationStep2();
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /*if (confirm("Are you sure you want to Run this Configuration Settings?")) {
                $("#runConfig").text('Processing(0%)....');
                $("#runConfig").addClass('disabled');
                $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=1', $scope.InstituteId).success(function (data) {
                    $("#runConfig").text('Processing(5%)....');
                    $scope.InstitueConfigurationStep2();
                }).error(function (data) {
                    alert("Error In Step 1");
                    $("#runConfig").text('Processing(5%)....');
                    $scope.InstitueConfigurationStep2();
                });
            }*/
        };

        $scope.InstitueConfigurationStep2 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=2', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(10%)....');
                $scope.InstitueConfigurationStep3();
            }, function errorCallback(response) {
                //alert("Error In Step 2");
                toastr.info("Error In Step 2", "info");
                $("#runConfig").text('Processing(10%)....');
                $scope.InstitueConfigurationStep3();
            });
        };

        $scope.InstitueConfigurationStep3 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=3', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(15%)....');
                $scope.InstitueConfigurationStep4();
            }, function errorCallback(response) {
                //alert("Error In Step 3");
                toastr.info("Error In Step 3", "info");
                $("#runConfig").text('Processing(15%)....');
                $scope.InstitueConfigurationStep4();
            });
        };

        $scope.InstitueConfigurationStep4 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=4', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(20%)....');
                $scope.InstitueConfigurationStep5();
            }, function errorCallback(response) {
                //alert("Error In Step 4");
                toastr.info("Error In Step 4", "info");
                $("#runConfig").text('Processing(20%)....');
                $scope.InstitueConfigurationStep5();
            });
        };

        $scope.InstitueConfigurationStep5 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=5', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(25%)....');
                $scope.InstitueConfigurationStep6();
            }, function errorCallback(response) {
                //alert("Error In Step 5");
                toastr.info("Error In Step 5", "info");
                $("#runConfig").text('Processing(25%)....');
                $scope.InstitueConfigurationStep6();
            });
        };

        $scope.InstitueConfigurationStep6 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=6', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(30%)....');
                $scope.InstitueConfigurationStep7();
            }, function errorCallback(response) {
                //alert("Error In Step 6");
                toastr.info("Error In Step 6", "info");
                $("#runConfig").text('Processing(30%)....');
                $scope.InstitueConfigurationStep7();
            });
        };

        $scope.InstitueConfigurationStep7 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=7', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(35%)....');
                $scope.InstitueConfigurationStep8();
            }, function errorCallback(response) {
                //alert("Error In Step 7");
                toastr.info("Error In Step 7", "info");
                $("#runConfig").text('Processing(35%)....');
                $scope.InstitueConfigurationStep8();
            });
        };

        $scope.InstitueConfigurationStep8 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=8', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(40%)....');
                $scope.InstitueConfigurationStep9();
            }, function errorCallback(response) {
                //alert("Error In Step 8");
                toastr.info("Error In Step 8", "info");
                $("#runConfig").text('Processing(40%)....');
                $scope.InstitueConfigurationStep9();
            });
        };

        $scope.InstitueConfigurationStep9 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=9', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(50%)....');
                $scope.InstitueConfigurationStep10();
            }, function errorCallback(response) {
                //alert("Error In Step 9");
                toastr.info("Error In Step 9", "info");
                $("#runConfig").text('Processing(50%)....');
                $scope.InstitueConfigurationStep10();
            });
        };

        $scope.InstitueConfigurationStep10 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=10', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(55%)....');
                $scope.InstitueConfigurationStep11();
            }, function errorCallback(response) {
                //alert("Error In Step 10");
                toastr.info("Error In Step 10", "info");
                $("#runConfig").text('Processing(55%)....');
                $scope.InstitueConfigurationStep11();
            });
        };

        $scope.InstitueConfigurationStep11 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=11', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(60%)....');
                $scope.InstitueConfigurationStep12();
            }, function errorCallback(response) {
                //alert("Error In Step 11");
                toastr.info("Error In Step 11", "info");
                $("#runConfig").text('Processing(60%)....');
                $scope.InstitueConfigurationStep12();
            });
        };

        $scope.InstitueConfigurationStep12 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=12', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(70%)....');
                $scope.InstitueConfigurationStep13();
            }, function errorCallback(response) {
                //alert("Error In Step 12");
                toastr.info("Error In Step 12", "info");
                $("#runConfig").text('Processing(70%)....');
                $scope.InstitueConfigurationStep13();
            });
        };

        $scope.InstitueConfigurationStep13 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=13', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(80%)....');
                $scope.InstitueConfigurationStep14();
            }, function errorCallback(response) {
                //alert("Error In Step 13");
                toastr.info("Error In Step 13", "info");
                $("#runConfig").text('Processing(80%)....');
                $scope.InstitueConfigurationStep14();
            });
        };

        $scope.InstitueConfigurationStep14 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=14', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(90%)....');
                $scope.InstitueConfigurationStep15();
            }, function errorCallback(response) {
                //alert("Error In Step 14");
                toastr.info("Error In Step 14", "info");
                $("#runConfig").text('Processing(90%)....');
                $scope.InstitueConfigurationStep15();
            });
        };

        $scope.InstitueConfigurationStep15 = function () {
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=15', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(95%)....');
                $scope.InstitueConfigurationStep16();
            }, function errorCallback(response) {
                //alert("Error In Step 15");
                toastr.info("Error In Step 15", "info");
                $("#runConfig").text('Processing(95%)....');
                $scope.InstitueConfigurationStep16();
            });
        };

        $scope.InstitueConfigurationStep16 = function () {
            /*$("#runConfig").text('Processing(98%)....');*/
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=16', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(98%)....');
                $scope.InstitueConfigurationStep17();
                //setTimeout(function () {
                //    //alert("Configuration Steps Completed!");
                //    toastr.success("Configuration Steps Completed!", "success");
                //}, 5000);
                //$("#runConfig").text('Re-run configuration');
                //$("#runConfig").removeClass('disabled');
            }, function errorCallback(response) {
                //$("#runConfig").text('Processing(98%)....');
                //alert("Error In Step 16");
                toastr.info("Error In Step 16", "info");
                $("#runConfig").text('Processing(98%)....');
                $scope.InstitueConfigurationStep17();
                //$("#runConfig").text('Re-run configuration');
                //$("#runConfig").removeClass('disabled');
            });
        };

        $scope.InstitueConfigurationStep17 = function () {
            $("#runConfig").text('Processing(100%)....');
            $http.post(baseUrl + 'api/Common/DefaultConfig_InsertUpdate/?Step=17', $scope.InstituteId).then(function (response) {
                $("#runConfig").text('Processing(100%)....');
                setTimeout(function () {
                    //alert("Configuration Steps Completed!");
                    toastr.success("Configuration Steps Completed!", "success");
                }, 5000);

                $("#runConfig").text('Re-run configuration');
                $("#runConfig").removeClass('disabled');
            }, function errorCallback(response) {
                $("#runConfig").text('Processing(100%)....');
                //alert("Error In Step 16");
                toastr.info("Error In Step 17", "info");
                $("#runConfig").text('Re-run configuration');
                $("#runConfig").removeClass('disabled');
            });
        };

    }

]);
