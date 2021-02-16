var MyCortexControllers = angular.module("AllyControllers", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

MyCortexControllers.factory('rememberMe', function () {
    function fetchValue(name) {
        var gCookieVal = document.cookie.split("; ");
        for (var i = 0; i < gCookieVal.length; i++) {
            // a name/value pair (a crumb) is separated by an equal sign
            var gCrumb = gCookieVal[i].split("=");
            if (name === gCrumb[0]) {
                var value = '';
                try {
                    value = angular.fromJson(gCrumb[1]);
                } catch (e) {
                    value = unescape(gCrumb[1]);
                }
                return value;
            }
        }
        // a cookie with the requested name does not exist
        return null;
    }

    return function (name, values) {
        if (arguments.length === 1) return fetchValue(name);
        var cookie = name + '=';
        if (typeof values === 'object') {
            var expires = '';
            cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
            if (values.expires) {
                var date = new Date();
                date.setTime(date.getTime() + (values.expires * 24 * 60 * 60 * 1000));
                expires = date.toGMTString();
            }
            cookie += (!values.session) ? 'expires=' + expires + ';' : '';
            cookie += (values.path) ? 'path=' + values.path + ';' : '';
            cookie += (values.secure) ? 'secure;' : '';
        } else {
            cookie += values + ';';
        }
        document.cookie = cookie;
    }

});


MyCortexControllers.controller("ParentController", ['$scope',
    function ($scope) {
        $scope.$on('$viewContentLoaded', function () {
            angular.element(".date input").keydown(function (event) {
                if (event.which != 46)
                    return false;
            });
        });
    }
]);
MyCortexControllers.directive('stRatio', function () {
    return {
        link: function (scope, element, attr) {
            var ratio = +(attr.stRatio);

            element.css('width', ratio + '%');

        }
    };
});
MyCortexControllers.directive('searchWatchModel', function () {
    return {
        require: '^stTable',
        scope: {
            searchWatchModel: '='
        },
        link: function (scope, ele, attr, ctrl) {
            var table = ctrl;

            scope.$watch('searchWatchModel', function (val) {
                ctrl.search(val);
            });

        }
    };
});

MyCortexControllers.directive('multiselectDropdown', [function () {
    return function (scope, element, attributes) {
        // Below setup the dropdown:
        element.multiselect({
            maxHeight: 200,
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            // Replicate the native functionality on the elements so
            // that angular can handle the changes for us.
            onChange: function (optionElement, checked) {
                optionElement.removeAttr('selected');
                if (checked) {
                    optionElement.prop('selected', 'selected');
                }
                element.change();
            }
        });
        // Watch for any changes to the length of our select element
        scope.$watch(function () {
            return element[0].length;
        }, function () {
            element.multiselect('rebuild');
        });
        // Watch for any changes from outside the directive and refresh
        scope.$watch(attributes.ngModel, function () {
            element.multiselect('refresh');
        });
        // Below maybe some additional setup
    }
}]);
MyCortexControllers.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
MyCortexControllers.directive("fileread", [
    function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                            //scope.filename = changeEvent.target.files[0].name;
                        });
                    }
                    if (changeEvent.target.files[0].lenght !== 0) {
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    } 
                });
            }
        }
    }
]);

MyCortexControllers.directive('toggleCheckbox', function () {
    // based on https://github.com/minhur/bootstrap-toggle/issues/19

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModelController) {
            element.on('change.toggle', function (event) { // note that ".toogle" is our namespace, used further down to remove the handler again
                var checked = element.prop('checked');
                ngModelController.$setViewValue(checked);
            });

            ngModelController.$render = function () {
                element.bootstrapToggle(ngModelController.$viewValue ? 'on' : 'off');
            };

            scope.$on('$destroy', function () {
                // clean up
                element.off('change.toggle');
                element.bootstrapToggle('destroy');
            });

            // we set the 'checked' property once so the Bootstrap toggle is initialized to the correct value, i.e.,  without flashing the 'off' state and then switch to the 'on' state in case of an initial value of 'true';
            // this is not needed if your markup already contains the correct 'checked' property;
            // note that we can't use ngModelController.$viewValue since at this stage, it's still uninitialized as NaN
            var initialValue = scope.$eval(attributes.ngModel);
            element.prop('checked', initialValue);
        }
    };
});
MyCortexControllers.directive('uploadFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var file_uploaded = $parse(attrs.uploadFile);
            element.bind('change', function () {
                scope.$apply(function () {
                    file_uploaded.assign(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
MyCortexControllers.directive("datepicker", function () {
    function link(scope, element, attrs) {
        // CALL THE "datepicker()" METHOD USING THE "element" OBJECT.
        /*element.datepicker({
            dateFormat: "dd-MMM-yyyy"
        });*/
        element.datepicker({
            format: "dd-M-yyyy",
            forceParse: false,
            autoclose: true,
            todayHighlight: true,
            toggleActive: true,
            todayBtn: true
        });
    }
    return {
        require: 'ngModel',
        link: link
    };
});
MyCortexControllers.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
            .success(function () {
            })
            .error(function () {
            });
    }
}]);


/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("UnderConstructionController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService) {
        $scope.underConstruction = function () {

        }
    }
]);

/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("homeController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService) {
        $scope.UserId = $window.localStorage['UserId'];
        $scope.UserTypeId = $window.localStorage['UserTypeId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });

        if ($scope.UserTypeId != 1) {
            $http.get(baseUrl + '/api/Login/GetPasswordHistory_Count/?UserId=' + $scope.UserId).success(function (data) {
                $scope.PasswordCount = data.PasswordCount;
                if ($scope.PasswordCount == "0") {
                    window.location.href = baseUrl + "/Home/Index#/ChangePassword/1";
                }
                else {
                    if ($window.localStorage['UserTypeId'] == "1")
                        window.location.href = baseUrl + "/Home/Index#/Institution";
                    else if ($window.localStorage['UserTypeId'] == "3")
                        window.location.href = baseUrl + "/Home/Index#/InstitutionSubscriptionHospitalAdmin_view";
                    else if ($window.localStorage['UserTypeId'] == "2")
                        window.location.href = baseUrl + "/Home/Index#/PatientVitals/0/1";
                    else if ($window.localStorage['UserTypeId'] == "4")
                        window.location.href = baseUrl + "/Home/Index#/Thirtydays_appointments";
                    else if ($window.localStorage['UserTypeId'] == "5")
                        window.location.href = baseUrl + "/Home/Index#/CareGiverAssignedPatients";
                    else if ($window.localStorage['UserTypeId'] == "6")
                        window.location.href = baseUrl + "/Home/Index#/Carecoordinator/1";
                    else if ($window.localStorage['UserTypeId'] == "7")
                        window.location.href = baseUrl + "/Home/Index#/TodaysAppoint_ments";
                }
            });
        }
        else {
            //for Super Admin
            if ($window.localStorage['UserTypeId'] == "1")
                window.location.href = baseUrl + "/Home/Index#/Institution";
            else if ($window.localStorage['UserTypeId'] == "3")
                window.location.href = baseUrl + "/Home/Index#/InstitutionSubscriptionHospitalAdmin_view";
            else if ($window.localStorage['UserTypeId'] == "2")
                window.location.href = baseUrl + "/Home/Index#/PatientVitals/0/1";
            else if ($window.localStorage['UserTypeId'] == "4")
                window.location.href = baseUrl + "/Home/Index#/Thirtydays_appointments";
            else if ($window.localStorage['UserTypeId'] == "5")
                window.location.href = baseUrl + "/Home/Index#/CareGiverAssignedPatients";
            else if ($window.localStorage['UserTypeId'] == "6")
                window.location.href = baseUrl + "/Home/Index#/Carecoordinator/1";
            else if ($window.localStorage['UserTypeId'] == "7")
                window.location.href = baseUrl + "/Home/Index#/TodaysAppoint_ments";
        }
        //else
        //    window.location.href = baseUrl + "/Home/Index#/InstitutionHospitalAdmin_view";
    }
]);

/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("GooglehomeController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });


        $scope.getCredentialDetails = function () {
            $http.get(baseUrl + '/api/Login/GoogleLogin_get_Email/').success(function (data) {


                $scope.UserId = data.UserId;
                $scope.UserTypeId = data.UserTypeId;
                $scope.InstitutionId = data.InstitutionId;
                $window.localStorage['UserId'] = $scope.UserId;
                $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                $window.localStorage['InstitutionId'] = $scope.InstitutionId;

                if ($window.localStorage['UserTypeId'] == "1")
                    window.location.href = baseUrl + "/Home/Index#/Institution";
                else if ($window.localStorage['UserTypeId'] == "3")
                    window.location.href = baseUrl + "/Home/Index#/InstitutionSubscriptionHospitalAdmin_view";
                else if ($window.localStorage['UserTypeId'] == "2")
                    window.location.href = baseUrl + "/Home/Index#/PatientVitals/0/1";
                else if ($window.localStorage['UserTypeId'] == "4")
                    window.location.href = baseUrl + "/Home/Index#/TodaysAppoint_ments";
                else if ($window.localStorage['UserTypeId'] == "5")
                    window.location.href = baseUrl + "/Home/Index#/CareGiverAssignedPatients";
                else if ($window.localStorage['UserTypeId'] == "6")
                    window.location.href = baseUrl + "/Home/Index#/Carecoordinator/1";
                else if ($window.localStorage['UserTypeId'] == "7")
                    window.location.href = baseUrl + "/Home/Index#/TodaysAppoint_ments";
            });
        }
        $scope.getCredentialDetails();

    }
]);
/* THIS IS FOR INSTITUTION CONTROLLER FUNCTION */
MyCortexControllers.controller("InstitutionController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        $scope.CreatedBy = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.CountryFlag = false;
        $scope.StateFlag = false;
        $scope.CityFlag = false;
        $scope.CountryDuplicateId = "0";
        $scope.StateDuplicateId = "0";
        $scope.LocationDuplicateId = "0";
        $scope.Mode = $routeParams.Mode;
        if ($routeParams.ModeType == undefined) {
            $scope.ModeType = "1";
        }
        else {
            $scope.ModeType = $routeParams.ModeType;
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

        $scope.AddInstitutionpopup = function () {
            $scope.Id = 0;
            $scope.loadCount = 0;
            $scope.InstitutionClear();
            $scope.DropDownListValue = 1;
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

        /* on click Edit, edit popup opened*/
        $scope.EditInstitution = function (CatId, activeFlag) {
            if (activeFlag == 1) {
                $scope.InstitutionClear();
                $scope.Id = CatId;
                $scope.DropDownListValue = 1;
                $scope.InstitutionDetails_View();
                angular.element('#InstitutionCreateModal').modal('show');
            }
            else {
                alert("Inactive record cannot be edited");
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
                alert("Please enter Institution Name");
                return false;
            }
            else if (typeof ($scope.INSTITUTION_SHORTNAME) == "undefined" || $scope.INSTITUTION_SHORTNAME == "") {
                alert("Please enter Short Name");
                return false;
            }
            else if (typeof ($scope.Email) == "undefined" || $scope.Email == "") {
                alert("Please enter Email");
                return false;
            }
            else if (EmailFormate($scope.Email) == false) {
                alert("Invalid email format");
                return false;
            }
            else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                alert("Please select Country");
                return false;
            }
            else if (typeof ($scope.StateNameId) == "undefined" || $scope.StateNameId == "0") {
                alert("Please select State");
                return false;
            }
            else if (typeof ($scope.LocationNameId) == "undefined" || $scope.LocationNameId == "0") {
                alert("Please select City");
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

        /*on click Save calling the insert update function for Institution
             and check the Institution Name already exist,if exist it display alert message or its 
             calling the insert update function*/
        $scope.BlobFileName = "";
        $scope.Institution_AddEdit = function () {
            if ($scope.InstitutionAddEdit_Validations() == true) {
                $("#chatLoaderPV").show();
                var FileName = "";
                var Licensefilename = "";
                var fd = new FormData();
                var imgBlob;
                var imgBlobfile;
                var itemIndexLogo = -1;
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
                    Photo_Fullpath: "",
                    Photo: $scope.InstitutionLogo,
                    Created_by: $scope.CreatedBy
                };
                $http.post(baseUrl + '/api/Institution/Institution_AddEdit/', obj).success(function (data) {
                    var insId = data.Institute[0].Id;
                    alert(data.Message);

                    if ($scope.PhotoValue == 1) {
                        if ($('#InstitutionLogo')[0].files[0] != undefined) {
                            FileName = $('#InstitutionLogo')[0].files[0]['name'];
                            imgBlob = $scope.dataURItoBlob($scope.uploadme);
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
                                    $scope.InstitutionDetailsListGo();
                                }
                            })
                    }
                    else {
                        $("#InstitutionLogo").val('');
                        if (data.ReturnFlag == 1) {
                            $scope.CancelInstitution();
                            $scope.InstitutionDetailsListGo();
                        }
                    }
                    $("#chatLoaderPV").hide();

                })
                    .error(function (response) {
                        $scope.Photo = "";
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
            $scope.CountryId = "0";
            $scope.StateNameId = "0";
            $scope.LocationNameId = "0";
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
        /* Clear the uploaded image */
        $scope.imageclear = function () {
            $scope.InstitutionLogo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#InstitutionLogo').val('');

        };
        /*THIS IS FOR LIST FUNCTION*/
        $scope.InstitutionDetailsListGo = function () {
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
            $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.Id).success(function (data) {
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

                // $scope.CountryBased_StateFunction();
                $scope.ViewCountryName = data.CountryName;
                $scope.StateNameId = data.StateId.toString();
                $scope.StateDuplicateId = $scope.StateNameId;
                $scope.StateFlag = true;
                //  $scope.StateBased_CityFunction();
                // $scope.State_onChange();
                $scope.ViewStateName = data.StateName;
                $scope.LocationNameId = data.CityId.toString();
                $scope.LocationDuplicateId = $scope.LocationNameId;
                $scope.CityFlag = true;
                if ($scope.DropDownListValue == 1) {
                    $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                        $scope.CountryNameList = data;
                        if ($scope.CountryFlag == true) {
                            $scope.CountryId = $scope.CountryDuplicateId;
                            $scope.CountryFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    });
                    $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + data.CountryId.toString()).success(function (data) {
                        $scope.StateName_List = data;
                        if ($scope.StateFlag == true) {
                            $scope.StateNameId = $scope.StateDuplicateId;
                            $scope.StateFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    });
                    $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + data.CountryId.toString() + '&StateId=' + data.StateId.toString()).success(function (data) {
                        //$scope.LocationName_List =data ;    
                        $scope.LocationName_List = data;
                        if ($scope.CityFlag == true) {
                            $scope.LocationNameId = $scope.LocationDuplicateId;
                            $scope.CityFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
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
            var del = confirm("Do you like to deactivate the selected Institution?");
            if (del == true) {
                $http.get(baseUrl + '/api/Institution/InstitutionDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Institution has been deactivated Successfully");
                    $scope.InstitutionDetailsListGo();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Institution!" + data;
                });
            };
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
            var Ins = confirm("Do you like to activate the selected Institution?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/Institution/InstitutionDetails_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Institution has been activated successfully");
                    $scope.InstitutionDetailsListGo();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ReInsertInstitutionDetails" + data;
                });
            };
        }

        /*
        Calling the api method to insert the default data of the Institution
        for the  Institution Id,
        and redirected to the list page.
        */
        $scope.InsertDefaultData = function () {
            $http.get(baseUrl + '/api/Institution/InstitutionDefaultData_Insert/?Id=' + $scope.Id).success(function (data) {
                alert("Institution Default Data Inserted successfully");
                // $scope.InstitutionDetailsListGo();
            }).error(function (data) {
                $scope.error = "An error has occurred while InsertInstitution Default Records" + data;
            });

        };
    }

]);

/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("InstitutionSubscriptionController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {

        //Declaration and initialization of Scope Variables.
        $scope.ChildId = 0;
        $scope.Institution_Id = "0";
        $scope.Health_Care_Professionals = "";
        $scope.Patients = "";
        $scope.Contract_Period_From = "";
        $scope.Contract_Period_To = "";
        $scope.V_Contract_Period_From = "";
        $scope.V_Contract_Period_To = "";
        $scope.Subscription_Type = "1";

        $scope.InstitutionViewList = [];
        $scope.IsActive = true;
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.AddIntstitutionSubPopup = function () {
            $scope.Id = 0;
            $scope.Institution_Id = "0";
            $scope.ClearInstitutionSubscriptionPopup();
            angular.element('#InstitutionSubscriptionCreateModal').modal('show');
        }
        $scope.CancelIntstitutionSubPopup = function () {
            angular.element('#InstitutionSubscriptionCreateModal').modal('hide');
        }
        $scope.EditIntstitutionSubPopup = function (InsSubId, ActiveFlag) {
            if (ActiveFlag == "1") {
                $scope.ClearInstitutionSubscriptionPopup();
                $scope.Id = InsSubId;
                $scope.InstitutionSubscriptionDetails_View();
                angular.element('#InstitutionSubscriptionCreateModal').modal('show');
            }
            else {
                alert("Inactive Institution's Subscription cannot be edited")
            }
        }
        $scope.ViewIntstitutionSubPopup = function (InsSubId) {
            $scope.ClearInstitutionSubscriptionPopup();
            $scope.Id = InsSubId;
            $scope.InstitutionSubscriptionDetails_View();
            angular.element('#ViewInstitutionSubscriptionModal').modal('show');
        }
        $scope.CancelViewIntstitutionSubPopup = function () {
            angular.element('#ViewInstitutionSubscriptionModal').modal('hide');
        }
        /* on click Add Institution Subscription tool tip in list page calling the Add New  method and Open the Institution Subscription Details Add*/
        $scope.AddInstitutionSubsciption = function () {
            $scope.Id = 1;
            $location.path("/SaveInstitution_Subscription/");
        };
        // This is for to get Institution Details List 
        $http.get(baseUrl + '/api/Common/InstitutionNameList/').success(function (data) {
            $scope.InstitutiondetailsListTemp = [];
            $scope.InstitutiondetailsListTemp = data;
            var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
            $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
            //$scope.InstitutiondetailsListTemp.push(obj);
            $scope.InstitutiondetailsList = angular.copy($scope.InstitutiondetailsListTemp);

        })
        // This is for to get Institution Modiule List 
        $http.get(baseUrl + '/api/InstitutionSubscription/ModuleNameList/').success(function (data) {
            // only active Module    
            $scope.InstitutiontypeList = data;
        });
        // This is for to get Institution Language List 
        $http.get(baseUrl + '/api/InstitutionSubscription/LanguageNameList/').success(function (data) {
            // only active Language    
            $scope.LanguageList = data;
        });
        /*This is for Auto fill Details by selected Name of the Institution */
        $scope.InstituteGetDetails = function () {
            if ($scope.Institution_Id == "0") // if Select option selected
            {
                $scope.ClearInstitutionSubscriptionPopup();
                return false;
            }

            $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionDetailList/?Id=' + $scope.Institution_Id).success(function (data) {
                if (data.Email == null)
                    $scope.Email = "";
                else
                    $scope.Email = data.Email;
                $scope.Address1 = data.Institution_Address1;
                $scope.Address2 = data.Institution_Address2;
                $scope.Address3 = data.Institution_Address3;
                $scope.ZipCode = data.ZipCode;
                $scope.Country = data.CountryName;
                $scope.State = data.StateName;
                $scope.City = data.CityName;
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            });
            $scope.loading = false;
        }
        /* Validating the create page mandatory fields
        checking mandatory for the follwing fields
        Health Care Professionals,Patients,Contract Period From,Contract Period To
        and showing alert message when it is null.
        */
        $scope.Institution_SubscriptionAddEditValidations = function () {
            if (typeof ($scope.Institution_Id) == "undefined" || $scope.Institution_Id == "0") {
                alert("Please select Institution");
                return false;
            }
            else if (typeof ($scope.Health_Care_Professionals) == "undefined" || $scope.Health_Care_Professionals == "") {
                alert("Please enter No. of Health Care Professionals");
                return false;
            }
            else if (typeof ($scope.Patients) == "undefined" || $scope.Patients == "") {
                alert("Please enter No. of Patients");
                return false;
            }
            else if (typeof ($scope.Contract_Period_From) == "undefined" || $scope.Contract_Period_From == "") {
                alert("Please select Contract Period From");
                return false;
            }
            else if (typeof ($scope.Contract_Period_To) == "undefined" || $scope.Contract_Period_To == "") {
                alert("Please select Contract Period To");
                return false;
            }
            if (($scope.Contract_Period_From != "0") && ($scope.Contract_Period_To != "0")) {

                $scope.Contract_Period_From = moment($scope.Contract_Period_From).format('DD-MMM-YYYY');
                $scope.Contract_Period_To = moment($scope.Contract_Period_To).format('DD-MMM-YYYY');

                if ((ParseDate($scope.Contract_Period_To) < ParseDate($scope.Contract_Period_From))) {
                alert("Contract Period From should not be greater than Contract Period To");
                    $scope.Contract_Period_From = DateFormatEdit($scope.Contract_Period_From);
                    $scope.Contract_Period_To = DateFormatEdit($scope.Contract_Period_To);
                    return false;
                }
                $scope.Contract_Period_From = DateFormatEdit($scope.Contract_Period_From);
                $scope.Contract_Period_To = DateFormatEdit($scope.Contract_Period_To);
            }
        
        return true;
        };
        /*on click Save calling the insert update function for Institution Subscription */
        $scope.InstitutionAddList = [];
        $scope.InstitutionAddLanguageList = [];
        $scope.InstitutionModule_List = [];
        $scope.InstitutionLanguage_List = [];
        $scope.Institution_SubscriptionAddEdit = function () {
            $scope.InstitutionModule_List = [];
            $scope.InstitutionLanguage_List = [];
            if ($scope.Institution_SubscriptionAddEditValidations() == true) {
                //$("#chatLoaderPV").show();
                angular.forEach($scope.InstitutionAddList, function (SelectedInstitutiontype, index) {
                    if (SelectedInstitutiontype == true) {
                        {
                            var obj = {
                                Id: 0,
                                Institution_Subcription_Id: $scope.Id,
                                ModuleId: index + 1
                            }
                            $scope.InstitutionModule_List.push(obj);
                        }
                    }
                });
                angular.forEach($scope.InstitutionAddLanguageList, function (SelectedInstitutiontype, index) {
                    if (SelectedInstitutiontype == true) {
                        {
                            var obj = {
                                Id: 0,
                                Institution_Subcription_Id: $scope.Id,
                                LanguageId: index + 1
                            }
                            $scope.InstitutionLanguage_List.push(obj);
                        }
                    }
                });
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $scope.Institution_Id,
                    Health_Care_Professionals: $scope.Health_Care_Professionals,
                    No_Of_Patients: $scope.Patients,
                    Contract_PeriodFrom: moment($scope.Contract_Period_From).format('DD-MMM-YYYY'),
                    Contract_PeriodTo: moment($scope.Contract_Period_To).format('DD-MMM-YYYY'),
                    Subscription_Type: $scope.Subscription_Type,
                    Institution_Modules: $scope.InstitutionModule_List,
                    Module_List: $scope.InstitutiontypeList,
                    Institution_Languages: $scope.InstitutionLanguage_List,
                    Language_List: $scope.LanguageList
                }

                //$http.post(baseUrl + '/api/InstitutionSubscription/InstitutionSubscription_AddEdit/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                //    alert(data.Message);
                //    if (data.ReturnFlag == "1") {
                //        $scope.CancelIntstitutionSubPopup();
                //        $scope.InstitutionSubscriptionDetailsListTemplate();
                //    }
                //    $("#chatLoaderPV").hide();
                //}).error(function (data) {
                //    $scope.error = "An error has occurred while adding InstitutionSubcription details" + data.ExceptionMessage;
                //});
            }
        }
        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterInstitutionSubscriptionList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Institution.Institution_Name).match(searchstring) ||
                        angular.lowercase(value.Institution.INSTITUTION_SHORTNAME).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Contract_PeriodFrom, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Contract_PeriodTo, "dd-MMM-yyyy")).match(searchstring);
                });
            }
        }

        /*THIS IS FOR LIST FUNCTION*/
        $scope.InstitutionSubscriptionDetailsListTemplate = function () {
            $("#chatLoaderPV").show();
            $scope.rowCollectionTemplate = [];
            $scope.Institution_Id = "0";
            $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscription_List/Id?=' + $scope.Institution_Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.rowCollectionTemplate = data;
                $scope.rowCollection = $ff($scope.rowCollectionTemplate, function (value) {
                    return value.Institution.IsActive == "1";
                });
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
        /*THIS IS FOR LIST FUNCTION*/
        $scope.InstitutionSubscriptionDetailsFilter = function () {

            if ($scope.IsActive == true) {
                $scope.rowCollection = $ff($scope.rowCollectionTemplate, function (value) {
                    return value.Institution.IsActive == "1";
                })
            }
            else if ($scope.IsActive == false) {
                $scope.rowCollection = angular.copy($scope.rowCollectionTemplate);
            }

            $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        };
        $scope.InstitutionChildList = [];
        $scope.InstitutionLanguageList = [];
        /*THIS IS FOR View FUNCTION*/
        $scope.InstitutionSubscriptionDetails_View = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionDetails_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.InstitutiontypeList = data.Module_List;
                $scope.InstitutionChildList = data.ChildModuleList;
                $scope.LanguageList = data.Language_List;
                $scope.InstitutionLanguageList = data.ChildLanguageList;
                $scope.Institution_Id = data.Institution_Id.toString();
                $scope.ViewInstitution_Name = data.Institution.Institution_Name;
                $scope.Email = data.Institution.Email;
                $scope.Address1 = data.Institution.Institution_Address1;
                $scope.Address2 = data.Institution.Institution_Address2;
                $scope.Address3 = data.Institution.Institution_Address3;
                $scope.ZipCode = data.Institution.ZipCode;
                $scope.Country = data.Institution.CountryName;
                $scope.State = data.Institution.StateName;
                $scope.City = data.Institution.CityName;
                //$scope.Contract_Period_From = $filter('date')(data.Contract_PeriodFrom, "dd-MMM-yyyy");
                $scope.Contract_Period_From = DateFormatEdit($filter('date')(data.Contract_PeriodFrom, "dd-MMM-yyyy"));
                $scope.Health_Care_Professionals = data.Health_Care_Professionals;
                $scope.Patients = data.No_Of_Patients;
                //$scope.Contract_Period_To = $filter('date')(data.Contract_PeriodTo, "dd-MMM-yyyy");
                $scope.Contract_Period_To = DateFormatEdit($filter('date')(data.Contract_PeriodTo, "dd-MMM-yyyy"));
                $scope.Subscription_Type = data.Subscription_Type;
                $scope.InsSub_Id = data.SubscriptionId;

                angular.forEach($scope.InstitutiontypeList, function (item, modIndex) {

                    if ($ff($scope.InstitutionChildList, function (value) {
                        return value.ModuleId == item.Id;
                    }).length > 0) {
                        $scope.InstitutionAddList[modIndex] = true;
                    }
                    else {
                        $scope.InstitutionAddList[modIndex] = false;
                    }
                })

                angular.forEach($scope.LanguageList, function (item, modIndex) {

                    if ($ff($scope.InstitutionLanguageList, function (value) {
                        return value.LanguageId == item.Id;
                    }).length > 0) {
                        $scope.InstitutionAddLanguageList[modIndex] = true;
                    }
                    else {
                        $scope.InstitutionAddLanguageList[modIndex] = false;
                    }
                })
                $("#chatLoaderPV").hide();
            });
        };

        //This is for clear the contents in the Page
        $scope.ClearInstitutionSubscriptionPopup = function () {
            $scope.Health_Care_Professionals = "";
            $scope.Patients = "";
            $scope.Contract_Period_From = "";
            $scope.Contract_Period_To = "";
            $scope.Subscription_Type = "1";
            $scope.InstitutionModule_List = [];
            $scope.InstitutionAddList = [];
            $scope.InstitutionAddLanguageList = [];
            $scope.Institution_Id = "0";

            $scope.Email = "";
            $scope.Address1 = "";
            $scope.Address2 = "";
            $scope.Address3 = "";
            $scope.ZipCode = "";
            $scope.Country = "";
            $scope.State = "";
            $scope.City = "";
        }
        $scope.InstitutionSubscription_Delete = function () {
            alert("Subscription cannot be activated / deactivated")
        };

    }
]);

// This is for User controller functions/ /
MyCortexControllers.controller("UserController", ['$scope', '$q', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $q, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.SearchMsg = "No Data Available";
        $scope.currentTab = "1";
        $scope.CountryFlag = false;
        $scope.StateFlag = false;
        $scope.CityFlag = false;
        $scope.CountryDuplicateId = "0";
        $scope.StateDuplicateId = "0";
        $scope.LocationDuplicateId = "0";
        $scope.Id = "0";
        $scope.UserType = "0";
        $scope.InstitutionId = "0";
        $scope.FirstName = "";
        $scope.MiddleName = "";
        $scope.LastName = "";
        $scope.Employee_No = "";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.DepartmentId = "0";
        $scope.UserTypeId = "0";
        $scope.GenderId = "0";
        $scope.Health_License = "";
        $scope.Title_Id = 0;
        $scope.NationalityId = "0";
        $scope.DOB = "";
        $scope.Address1 = "";
        $scope.Address2 = "";
        $scope.Address3 = "";
        $scope.PostalZipCode = "";
        $scope.EMR_Avalability = "";
        $scope.EthnicGroupId = "0";
        $scope.CountryId = "0";
        $scope.StateId = "0";
        $scope.CityId = "0";
        $scope.MaritalStatusId = "0";
        $scope.BloodGroupId = "0";
        $scope.Smoker = "0";
        $scope.Diabetic = "0";
        $scope.HyperTension = "0";
        $scope.Cholestrol = "0";
        $scope.CurrentMedicineflag = "0";
        $scope.PastMedicineflag = "0";
        $scope.MedicalHistoryflag = "0";
        $scope.MNR_No = "";
        $scope.PatientNo = "";
        $scope.Createdby_ShortName = "";
        $scope.NationalId = "";
        $scope.InsuranceId = "";
        $scope.EMERG_CONT_FIRSTNAME = "";
        $scope.EMERG_CONT_MIDDLENAME = "";
        $scope.EMERG_CONT_LASTNAME = "";
        $scope.CAFFEINATEDBEVERAGES_TEXT = "";
        $scope.ALCOHALSUBSTANCE_TEXT = "";
        $scope.SMOKESUBSTANCE_TEXT = "";
        $scope.ALERGYSUBSTANCE_TEXT = "";
        $scope.EXCERCISE_TEXT = "";
        $scope.MaritalStatusId = "0";
        $scope.BloodGroupId = "0";
        $scope.EMERG_CONT_RELATIONSHIP_ID = "0";
        $scope.DIETDESCRIBE_ID = "0";
        $scope.EXCERCISE_SCHEDULEID = "0";
        $scope.ALERGYSUBSTANCE_ID = "0";
        $scope.SMOKESUBSTANCE_ID = "0";
        $scope.ALCOHALSUBSTANCE_ID = "0";
        $scope.CAFFEINATED_BEVERAGESID = "0";
        $scope.InstitutionList = [];
        $scope.DepartmentList = [];
        $scope.UserDetailsList = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.searchquery = "";
        $scope.UserTypeList = [];
        $scope.GroupTypeList = [];
        $scope.IsActive = true;
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.CountryList = [];
        $scope.StateList = [];
        $scope.LocationList = [];
        $scope.SelectedInstitution = "0";
        $scope.UserGroupDetails_List = [];
        $scope.UserInstitutionDetails_List = [];
        $scope.UserLanguageDetails_List = [];
        $scope.SelectedLanuage = [];
        $scope.Patientsearchquery = "";
        $scope.UserDetailsList = [];
        $scope.rowCollectionFilter = [];
        $scope.MedicineRow = "-1";
        $scope.MedicalHistoryRow = "-1";
        $scope.HealthProblemRow = "-1";
        $scope.BusinessUserList = [];
        $scope.BusinessUserFilter = [];
        $scope.BusinessUserflag = 0;
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.searchquery = "";
        $scope.SearchEncryptedQuery = "";
        $scope.Business_Usersearchquery = "";
        $scope.PatientList = [];
        $scope.PatientListFilter = [];
        $scope.Patientemptydata = [];
        $scope.Patientflag = 0;
        $scope.Patientsearchquery = "";
        $scope.PatientChronicCondition_List = [];
        $scope.ChildId = "0";
        $scope.HealthProblem_Id = "0";
        $scope.Medical_History_Id = "0";
        $scope.VACCINATIONS = "2";
        $scope.CURRENTLY_TAKEMEDICINE = "2";
        $scope.PAST_MEDICALHISTORY = "1";
        $scope.FAMILYHEALTH_PROBLEMHISTORY = "2";
        $scope.MenuTypeId = 0;
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.Pat_UserTypeId = $window.localStorage['UserTypeId'];

        $scope.InsCountryId = "0";
        $scope.InsStateId = "0";
        $scope.InsCityId = "0";
        $scope.PhotoValue = 0;
        $scope.UserPhotoValue = 0;
        $scope.Patient_Type = "1";
        $scope.Emergency_MobileNo = "";
        $scope.CertificateValue = 0;
        var photoview = false;
        $scope.uploadview = false;
        $scope.uploadme = null;
        $scope.DropDownListValue = 2;
        $scope.EditParameter = $routeParams.Editpatient;
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.total_pages = 1;

        $scope.loadCount = 3;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.LoginType = $routeParams.LoginUserType;

        $scope.ClearGroup = function () {
            $scope.SelectedGroup = "0";
        }

        $scope.TabClick = false;

        $scope.Businessuesrclickcount = 1;
        $scope.AddUserPopUP = function () {
            $("#UserLogo").val('');
            photoview = false;
            $scope.uploadview = false;
            $scope.loadCount = 3;
            $scope.currentTab = "1";
            $scope.getBase64Image();
            if ($scope.Pat_UserTypeId != 1) {
                $scope.InstitutionSubscriptionLicensecheck(4);
            }
            // var UserTypeId = 4;
            //$scope.InstitutionSubscriptionLicensecheck(UserTypeId);
            $scope.AppConfigurationProfileImageList();
            $scope.DropDownListValue = 1;
            if ($scope.Businessuesrclickcount == 1) {
                $scope.BusinessUserDropdownList();
            }
            $scope.SuperAdminDropdownsList();
            angular.element('#UserModal').modal('show');
        }

        $scope.DefaultCountryState = function () {
            //$scope.CountryId = $scope.InsCountryId;
            //$scope.StateId = $scope.InsStateId;
            //$scope.CountryBased_StateFunction();
            ////$scope.Country_onChange();
            //$scope.CityId = $scope.InsCityId;
            $scope.loadCount = $scope.loadCount - 1;
            $scope.CountryId = $scope.InsCountryId;

            $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.InsCountryId).success(function (data) {
                $scope.StateName_List = data;
                $scope.StateId = $scope.InsStateId;
                $scope.loadCount = $scope.loadCount - 1;
            });
            $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.InsCountryId + '&StateId=' + $scope.InsStateId).success(function (data) {
                //$scope.LocationName_List =data ;    
                $scope.LocationName_List = data;
                $scope.CityId = $scope.InsCityId;
                $scope.loadCount = $scope.loadCount - 1;
            });

            //$scope.StateBased_CityFunction();
            ////$scope.State_onChange();

            //$scope.CountryDuplicateId = $scope.CountryId;
            //$scope.StateDuplicateId = $scope.StateId;
            //$scope.LocationDuplicateId = $scope.CityId;

            //if ($scope.CountryFlag = true) {
            //    $scope.CountryId = $scope.CountryDuplicateId;
            //    $scope.CountryFlag = false;
            //}
            //if ($scope.StateFlag = true) {
            //    $scope.StateId = $scope.StateDuplicateId;
            //    $scope.StateFlag = false;
            //}
            //if ($scope.CityFlag = true) {
            //    $scope.CityId = $scope.LocationDuplicateId;
            //    $scope.CityFlag = false;
            //}
        }
        $scope.ViewUserPopUP = function (CatId) {
            $("#UserLogo").val('');
            $scope.uploadme = null;
            $scope.Id = CatId;
            photoview = true;
            $scope.uploadview = false;
            $scope.DropDownListValue = 2;
            $scope.Admin_View($scope.MenuTypeId);
            $scope.currentTab = "1";
            angular.element('#UserViewModel').modal('show');
        }

        $scope.EditUserPopUP = function (CatId) {
            $scope.uploadme = null;
            $scope.Id = CatId;
            photoview = true;
            $scope.uploadview = false;
            $scope.EditParameter = 4;
            $scope.DropDownListValue = 1;
            $scope.SuperAdminDropdownsList();
            if ($scope.Businessuesrclickcount == 1) {
                $scope.InstitutionBased_CountryStateList();
                $scope.BusinessUserDropdownList();
            }
            $scope.AppConfigurationProfileImageList();
            $scope.Admin_View($scope.MenuTypeId);
            $scope.currentTab = "1";
            angular.element('#UserModal').modal('show');
        }

        $scope.PatientView_Cancel = function () {
            if ($scope.PageParameter == 2) {
                $scope.currentTab = "1";
                $location.path("/PatientList/3");
                $scope.ClearPopUp();
            }
            else if ($scope.PageParameter == 1) {
                $window.localStorage['CurrentTabId'] = 1;
                $location.path("/PatientVitals/0/1");
            }
            else if ($scope.PageParameter == 3) {
                // Today Appointment Page
                $location.path("/PatientVitals/" + $scope.Id + "/2");
            }
            else if ($scope.PageParameter == 4) {
                // 30days Appointment Page
                $location.path("/PatientVitals/" + $scope.Id + "/3");
            }
            else if ($scope.PageParameter == 5) {
                // User Profile Patient Vitals
                    $location.path("/PatientVitals/" + $scope.Id + "/4");
            }
            else if ($scope.PageParameter == 6) {
                // Diagostic Alert
                $location.path("/PatientVitals/" + $scope.Id + "/5");
            }
            else if ($scope.PageParameter == 7) {
                // Compliance Alert
                $location.path("/PatientVitals/" + $scope.Id + "/6");
            }
            else if ($scope.PageParameter == 8) {
                // Care Giver Assigned Patients
                $location.path("/PatientVitals/" + $scope.Id + "/7");
            }
            else if ($scope.PageParameter == 0) {
                // Patient Approval
                $location.path("/PatientApproval");
            }
        };

        photoview = false;
        var request = "";
        $scope.getBase64Image = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.Gender_Name;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.Id;
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.Id;
                    }
                });

                var picPath = "";
                //super clinician           
                if ($scope.UserTypeId == 7 && $scope.GenderId == maleId) {
                    picPath = "../../Images/Clinician_Male.png";
                }
                else if ($scope.UserTypeId == 7 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/Clinician_Female.png";
                }
                //care coordinator
                else if ($scope.UserTypeId == 6 && $scope.GenderId == maleId) {
                    picPath = "../../Images/CC_Male.png";
                }
                else if ($scope.UserTypeId == 6 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/CC_Female.png";
                }
                //care giver
                else if ($scope.UserTypeId == 5 && $scope.GenderId == maleId) {
                    picPath = "../../Images/CG_Male.png";
                }
                else if ($scope.UserTypeId == 5 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/CG_Female.png";
                }
                //clinician
                else if ($scope.UserTypeId == 4 && $scope.GenderId == maleId) {
                    picPath = "../../Images/Clinician_Male.png";
                }
                else if ($scope.UserTypeId == 4 && $scope.GenderId == feMaleId) {
                    picPath = "../../Images/Clinician_Female.png";
                }
                else {
                    picPath = "../../Images/others.png";
                }
                if (photoview == false) {
                    var request = new XMLHttpRequest();
                    request.open('GET', picPath, true);
                    request.responseType = 'blob';
                    request.onload = function () {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);
                        reader.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };

        // patient creation
        $scope.PatientgetBase64Image = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.Gender_Name;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.Id;
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.Id;
                    }
                });

                var picPath = "../../Images/others.png";
                if (typeof($scope.Gender_Name) != "undefined")
                if ($scope.GenderId == feMaleId) {
                    picPath = "../../Images/Patient_Female.png";
                }
                else if ($scope.GenderId == maleId) {
                    picPath = "../../Images/Patient_Male.png";
                }
                

                if (photoview == false) {
                    var request = new XMLHttpRequest();
                    request.open('GET', picPath, true);
                    request.responseType = 'blob';
                    request.onload = function () {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);
                        reader.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };

        //Admin creation
        $scope.AdmingetBase64Image = function () {
            if ($scope.UserPhotoValue == 0) {
                var maleId = 0;
                var feMaleId = 0;
                angular.forEach($scope.GenderList, function (value, index) {
                    $scope.Gender_Name = value.Gender_Name;
                    if ($scope.Gender_Name.toLowerCase() == "male") {
                        maleId = value.Id;
                    }
                    else if ($scope.Gender_Name.toLowerCase() == "female") {
                        feMaleId = value.Id;
                    }
                });

                var picPath = "";
                if ($scope.GenderId == feMaleId) {
                    picPath = "../../Images/female.png";
                }
                else if ($scope.GenderId == maleId) {
                    picPath = "../../Images/male.png";
                }
                else {
                    picPath = "../../Images/others.png";
                }
                if (photoview == false) {
                    var request = new XMLHttpRequest();
                    request.open('GET', picPath, true);
                    request.responseType = 'blob';
                    request.onload = function () {
                        var reader = new FileReader();
                        reader.readAsDataURL(request.response);
                        reader.onload = function (e) {
                            $scope.uploadmes = e.target.result;
                            $scope.uploadme = $scope.uploadmes;
                            $scope.$apply();
                        };
                    };
                    request.send();
                }
            }
        };
        $scope.CancelPopup = function () {
            angular.element('#UserModal').modal('hide');
            angular.element('#UserViewModel').modal('hide');
            angular.element('#PatientCreateModal').modal('hide');
            angular.element('#PatientViewModel').modal('hide');
            $scope.ClearPopUp();
        }

        $scope.AddPatientPopup = function () {
            $scope.currentTab = "1";
            $scope.DropDownListValue = 1;
            var UserTypeId = 2;
            $scope.InstitutionSubscriptionLicensecheck(UserTypeId);
            $scope.AppConfigurationProfileImageList();
            $location.path("/PatientCreate/" + "2" + "/" + "3");
         }
        $scope.SubscriptionValidation = function () {
            if ($scope.Id == 0 && $scope.InstitutionId > 0)
                $scope.InstitutionSubscriptionLicensecheck(3);
        }
        $scope.InstitutionSubscriptionLicensecheck = function (UserTypeId) {
            if (UserTypeId == 3) {
                var obj = {
                    INSTITUTION_ID: $scope.InstitutionId,
                    UserType_Id: UserTypeId,
                };
            }
            else {
                var obj = {
                    INSTITUTION_ID: $window.localStorage['InstitutionId'],
                    UserType_Id: UserTypeId,
                };
            }
            $http.post(baseUrl + '/api/User/InstitutionSubscriptionLicensecheck/', obj).success(function (data) {
                if (data.ReturnFlag == 0) {
                    alert(data.Message);
                }
            }).error(function (data) {
                $scope.error = "An error has occurred InstitutionSubscriptionLicensecheck" + data;
            });

        };
        $scope.ViewId = 1;
        $scope.ViewPatientPopUp = function (CatId) {
            $scope.Id = CatId;
            $scope.currentTab = "1";
            $scope.DropDownListValue = 1;
            //$scope.Admin_View($scope.MenuTypeId);
            $location.path("/PatientView/" + $scope.Id + "/2" + "/" + "3");
        }
        $scope.EditPatientPopUp = function (CatId) {
            $scope.Id = CatId;
            $scope.DropDownListValue = 3;
            $scope.AppConfigurationProfileImageList();
            //$scope.Admin_View($scope.MenuTypeId);
            $location.path("/PatientEdit/" + $scope.Id + "/2" + "/" + "3" + "/4");
        }

        $scope.ClearPopUp = function () {
            $scope.Id = "0";
            $scope.UserType = "0";
            $scope.InstitutionId = "0";
            $scope.FirstName = "";
            $scope.MiddleName = "";
            $scope.LastName = "";
            $scope.Employee_No = "";
            $scope.EmailId = "";
            $scope.MobileNo = "";
            $scope.DepartmentId = "0";
            $scope.UserTypeId = "0";
            $scope.GenderId = "0";
            $scope.Health_License = "";
            $scope.Title_Id = 0;
            $scope.NationalityId = "0";
            $scope.DOB = "";
            $scope.Address1 = "";
            $scope.Address2 = "";
            $scope.Address3 = "";
            $scope.PostalZipCode = "";
            $scope.EMR_Avalability = "";
            $scope.EthnicGroupId = "0";
            $scope.CountryId = "0";
            $scope.StateId = "0";
            $scope.CityId = "0";
            $scope.MaritalStatusId = "0";
            $scope.BloodGroupId = "0";
            $scope.Smoker = "0";
            $scope.Diabetic = "0";
            $scope.HyperTension = "0";
            $scope.Cholestrol = "0";
            //$scope.CurrentMedicineflag = "0";
            //$scope.PastMedicineflag = "0";
            //$scope.MedicalHistoryflag = "0";
            $scope.MNR_No = "";
            $scope.PatientNo = "";
            $scope.NationalId = "";
            $scope.InsuranceId = "";
            $scope.EMERG_CONT_FIRSTNAME = "";
            $scope.EMERG_CONT_MIDDLENAME = "";
            $scope.EMERG_CONT_LASTNAME = "";
            $scope.CAFFEINATEDBEVERAGES_TEXT = "";
            $scope.ALCOHALSUBSTANCE_TEXT = "";
            $scope.SMOKESUBSTANCE_TEXT = "";
            $scope.ALERGYSUBSTANCE_TEXT = "";
            $scope.EXCERCISE_TEXT = "";
            $scope.MaritalStatusId = "0";
            $scope.BloodGroupId = "0";
            $scope.EMERG_CONT_RELATIONSHIP_ID = "0";
            $scope.DIETDESCRIBE_ID = "0";
            $scope.EXCERCISE_SCHEDULEID = "0";
            $scope.ALERGYSUBSTANCE_ID = "0";
            $scope.SMOKESUBSTANCE_ID = "0";
            $scope.ALCOHALSUBSTANCE_ID = "0";
            $scope.CAFFEINATED_BEVERAGESID = "0";
            $scope.ChronicConditionList = [];
            $scope.RelationshipList = [];
            $scope.DietTypeList = [];
            $scope.ScheduleList = [];
            $scope.AlergySubstanceList = [];
            $scope.BloodGroupList = [];
            $scope.EthnicGroupList = [];
            $scope.MaritalStatusList = [];
            $scope.PatientChronicCondition_List = [];
            $scope.SelectedGroup = "0";
            $scope.SelectedInstitution = "0";
            $scope.SelectedLanguage = "0";
            $scope.Home_PhoneNo = "";
            $scope.HomeAreaCode = "";
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = null;
            $('#UserLogo').val('');
            $scope.resumedoc = "";
            $('#Userdocument').val('');
            $scope.CertificateFileName = "";
            $scope.Google_EmailId = "";
            $scope.FB_EmailId = "";
            $scope.SelectedChronicCondition = "0";
            $scope.MedicineRow = "-1";
            //$scope.MedicalHistoryRow = "-1";
            $scope.HealthProblemRow = "-1";
            $scope.PhotoValue = 0;
            $scope.CertificateValue = 0;
            $scope.Emergency_MobileNo = "";
            $scope.EditFileName = "";
            $scope.Editresumedoc = "";
            $('#EditDocument').val('');
            $scope.CertificateFileName = "";
        }


        // editable time value from app settings	

        $scope.AppConfigurationProfileImageList = function () {
            $scope.ProfileImageSize = "5242880";    // 5 MB
            $scope.ConfigCode = "PROFILE_PICTURE";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).
                success(function (data) {
                    if (data[0] != undefined) {
                        $scope.ProfileImageSize = parseInt(data[0].ConfigValue);
                    }
                });
        }

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }
        //$http.get(baseUrl + '/api/Common/InstitutionNameList/').success(function (data) {
        //    $scope.InstitutionList = data;
        //});
        $scope.SuperAdminDropdownsList = function () {
            if ($scope.LoginType == 1 || $scope.LoginType == 3) {
                $http.get(baseUrl + '/api/Common/InstitutionNameList/').success(function (data) {
                    $scope.InstitutiondetailsListTemp = [];
                    $scope.InstitutiondetailsListTemp = data;
                    var obj = { "Id": 0, "Name": "Select", "IsActive": 0 };
                    $scope.InstitutiondetailsListTemp.splice(0, 0, obj);
                    //$scope.InstitutiondetailsListTemp.push(obj);
                    $scope.InstitutionList = angular.copy($scope.InstitutiondetailsListTemp);
                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(
                    function (data) {
                        $scope.GenderList = data;
                    });

                $http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                    $scope.DepartmentList = data;
                });
            }
        }


        $scope.Businesstab1 = 0;
        $scope.BusinessUserDropdownList = function () {
            if ($scope.LoginType == 2 && $scope.DropDownListValue == 1) {

                $http.get(baseUrl + '/api/User/BusinessUser_UserTypeList/').success(function (data) {
                    console.log(data);
                    $scope.UserTypeList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });

                $http.get(baseUrl + '/api/Common/GenderList/').success(
                    function (data) {
                        $scope.GenderList = data;
                        $scope.Businesstab1 = $scope.Businesstab1 + 1;
                    });
                $http.get(baseUrl + '/api/User/DepartmentList/').success(function (data) {
                    $scope.DepartmentList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
            $scope.Businessuesrclickcount = $scope.Businessuesrclickcount + 1;
        }

        $scope.$watch('Businesstab1', function () {
            if ($scope.Businesstab1 == 3) {
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
                $http.get(baseUrl + '/api/User/DoctorInstitutionList/').success(function (data) {
                    $scope.DoctorInstitutionList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
            if ($scope.Businesstab1 == 5) {
                $http.get(baseUrl + '/api/Common/LanguageList/').success(function (data) {
                    $scope.LanguageList = data;
                    $scope.Businesstab1 = $scope.Businesstab1 + 1;
                });
            }
        });

        if ($scope.LoginType == 2) {
            $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.GroupTypeList = data;
            });
        }

        //$scope.Patientcreatefunction = function()
        //{
        $scope.tab1 = 0;
        $scope.Patientcreatefunction = function () {
            $http.get(baseUrl + '/api/Common/GenderList/').success(
                function (data) {
                    $scope.GenderList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                    $scope.PatientgetBase64Image();
                });

            $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.GroupTypeList = data;
                $scope.tab1 = $scope.tab1 + 1;
            });
        }

        $scope.$watch('tab1', function () {
            if ($scope.tab1 == 2) {
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });

                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/ChronicConditionList/').success(function (data) {
                    $scope.ChronicConditionList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
            }

            if ($scope.tab1 == 7) {
                $http.get(baseUrl + '/api/Common/RelationshipList/').success(function (data) {
                    $scope.RelationshipList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
            }

            if ($scope.tab1 == 8) {
                $http.get(baseUrl + '/api/Common/OptionTypeList/').success(function (data) {
                    $scope.OptionTypeList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                //$http.get(baseUrl + '/api/Common/RelationshipList/').success(function (data) {
                //    $scope.RelationshipList = data;
                //    $scope.tab1=$scope.tab1+1;
                //});
                $http.get(baseUrl + '/api/Common/DietTypeList/').success(function (data) {
                    $scope.DietTypeList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
                $http.get(baseUrl + '/api/Common/ScheduleList/').success(function (data) {
                    $scope.ScheduleList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });

                $http.get(baseUrl + 'api/User/AllergyTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.AlergySubstanceList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                })
            }

        });


        //}   
        $scope.patientDropdownList = function () {
            if ($scope.LoginType == 3 && $scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/GenderList/').success(
                    function (data) {
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
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.GroupTypeList = data;
                });

                $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                    //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List').success(function (data) {
                    $scope.CountryNameList = data;
                });
            }
        };
        /*$http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
            $scope.CountryList = data;
        });
        $http.get(baseUrl + '/api/Common/StateList/').success(function (data) {
            $scope.StateList = data;
        });
        $http.get(baseUrl + '/api/Common/GetLocationList/').success(function (data) {
            $scope.LocationList = data;
        });*/

        /*
        Calling api method for the dropdown list in the html page for the fields
        Country,State,Locaiton  
        */
        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];
        //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List/').success(function (data) {
        //    //only active Country
        //    $scope.CountryNameList = $ff(data.CountryList, { IsActive: 1 });
        //    $scope.State_Template = data.StateList;
        //    $scope.City_Template = data.LocationList;
        //});
        $scope.InstitutionBased_CountryStateList = function () {
            if (typeof ($routeParams.Id) == "undefined") {
                $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                    //$http.get(baseUrl + '/api/Common/Get_CountryStateLocation_List').success(function (data) {
                    $scope.CountryNameList = data;
                    //only active Country
                    //$scope.CountryNameList = $ff(data.CountryList, { IsActive: 1 });
                    //$scope.State_Template = data.StateList;
                    //$scope.City_Template = data.LocationList;
                    $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.InstituteId).success(function (data) {
                        $scope.InsCountryId = data.CountryId.toString();
                        $scope.InsStateId = data.StateId.toString();
                        $scope.InsCityId = data.CityId.toString();
                        $scope.DefaultCountryState();
                        /*$scope.CountryBased_StateFunction();
                        //$scope.Country_onChange();
                        //  $scope.CityId = $scope.InsCityId;
                        $scope.StateBased_CityFunction();*/
                    });
                });
            }
        }


        $scope.CountryBased_StateFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CountryId).success(function (data) {
                    $scope.StateName_List = data;
                    $scope.LocationName_List = [];
                    $scope.CityId = "0";
                });
            }
        }
        $scope.StateBased_CityFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CountryId + '&StateId=' + $scope.StateId).success(function (data) {
                    $scope.LocationName_List = data;
                });
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

        $scope.User_Admin_List = function (MenuType) {
            $("#chatLoaderPV").show();
            $scope.MenuTypeId = MenuType;
            $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
            $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.MenuTypeId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.emptydata = [];
                $scope.UserDetailsList = [];
                $scope.UserDetailsList = data;
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
            });
        }

        $scope.BusinessUser_List = function (MenuType) {
            $("#chatLoaderPV").show();
            $scope.MenuTypeId = MenuType;
            $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
            $http.get(baseUrl + '/api/User/UserDetailsbyUserType_List/Id?=' + $scope.MenuTypeId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

                $scope.BusineessUseremptydata = [];
                $scope.BusinessUserList = [];
                $scope.BusinessUserList = data;
                $scope.BusinessUserFilter = angular.copy($scope.BusinessUserList);
                if ($scope.BusinessUserFilter.length > 0) {
                    $scope.BusinessUserflag = 1;
                }
                else {
                    $scope.BusinessUserflag = 0;
                }
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
            });
        }


        $scope.setPage = function (PageNo) {
            if (PageNo == 0) {
                PageNo = $scope.inputPageNo;
            }
            else
                $scope.inputPageNo = PageNo;

            $scope.current_page = PageNo;
            $scope.Patient_List(3);
        }

        $scope.Patient_List = function (MenuType) {
            $("#chatLoaderPV").show();
            $scope.MenuTypeId = MenuType;
            $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;
            $scope.CommaSeparated_Group = $scope.filter_GroupId.toString();

            $scope.PageCountArray = [];
            $scope.Patientemptydata = [];
            $scope.PatientList = [];

            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_page * $scope.page_size;
                $scope.Input_Type = 1;
                $scope.SearchEncryptedQuery = $scope.searchquery; 
                    var obj = {
                        InputType: $scope.Input_Type,
                        DecryptInput: $scope.SearchEncryptedQuery
                    };
                $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                    $scope.SearchEncryptedQuery = data; 

                    $http.get(baseUrl + '/api/User/Patient_List/Id?=' + $scope.Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId +
                        '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' +
                        $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus +
                        '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId +
                        '&Group_Id=' + $scope.filter_GroupId + '&IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId'] + '&StartRowNumber=' + $scope.PageStart +
                        '&EndRowNumber=' + $scope.PageEnd + '&SearchQuery=' + $scope.searchquery + '&SearchEncryptedQuery=' + $scope.SearchEncryptedQuery).success(function (data) {
                            console.log(data);
                            $("#chatLoaderPV").hide();
                            if (data.length == 0) {
                                $scope.SearchMsg = "No Data Available";
                            }
                            $scope.Patientemptydata = [];
                            $scope.PatientList = [];
                            $scope.PatientList = data;
                            $scope.Patientemptydata = data;
                            $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                            $scope.total_pages = Math.ceil(($scope.PatientCount) / ($scope.page_size));


                        });
                });
            });
            $scope.loadCount = 0;
            if ($scope.LoginType == 3) {
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.GroupTypeList = data;
                    $scope.tab1 = $scope.tab1 + 1;
                });
            }
        }

        /* Filter the master list function.*/
        $scope.filterInstitutionList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.UserDetailsList);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.UserDetailsList, function (value) {
                    return angular.lowercase(value.InstitutionName).match(searchstring) ||
                        angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.Department_Name).match(searchstring) ||
                        angular.lowercase(value.EMAILID).match(searchstring) ||
                        angular.lowercase(value.EMPLOYEMENTNO).match(searchstring);
                });
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        $scope.filterBusinessList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.Business_Usersearchquery);
            if ($scope.Business_Usersearchquery == "") {
                $scope.BusinessUserFilter = angular.copy($scope.BusinessUserList);
            }
            else {
                $scope.BusinessUserFilter = $ff($scope.BusinessUserList, function (value) {
                    return angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.EMAILID).match(searchstring) ||
                        angular.lowercase(value.Department_Name).match(searchstring) ||
                        angular.lowercase(value.EMPLOYEMENTNO).match(searchstring) ||
                        angular.lowercase(value.UserName).match(searchstring) ||
                        angular.lowercase(value.GroupName).match(searchstring);
                });
                if ($scope.BusinessUserFilter.length > 0) {
                    $scope.BusinessUserflag = 1;
                }
                else {
                    $scope.BusinessUserflag = 0;
                }
            }
        }

        /* Filter the master list function.*/
        $scope.PatientFilterChange = function () {
            //$scope.ResultListFiltered = [];
            //var searchstring = angular.lowercase($scope.Patientsearchquery);
            //if ($scope.Patientsearchquery == "") {
            //    $scope.PatientListFilter = angular.copy($scope.PatientList);
            //}
            //else {
            //    $scope.PatientListFilter = $ff($scope.PatientList, function (value) {
            //        return angular.lowercase(value.MNR_NO).match(searchstring) ||
            //            angular.lowercase(value.FullName).match(searchstring) ||
            //            angular.lowercase(value.MOBILE_NO).match(searchstring) ||
            //            angular.lowercase(value.EMAILID).match(searchstring) ||
            //            angular.lowercase(value.GroupName == null ? "" : value.GroupName).match(searchstring);
            //    });
            //    if ($scope.PatientListFilter.length > 0) {
            //        $scope.Patientflag = 1;
            //    }
            //    else {
            //        $scope.Patientflag = 0;
            //    }
            //}
            $("#chatLoaderPV").show();
            $scope.Patientemptydata = [];
            $scope.Patient_List(3);
        }
        $scope.Adminimageclear = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.AdmingetBase64Image();
        };


        $scope.imageclear = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.getBase64Image();
        };

        $scope.imageclearPatient = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.uploadme = "";
            $('#UserLogo').val('');
            photoview = false;
            $scope.uploadview = false;
            $scope.UserPhotoValue = 0;
            $scope.PatientgetBase64Image();
        };

        /* Read file name for the  Photo and file */
        $scope.EditdocfileChange = function () {
            if ($('#EditDocument')[0].files[0] != undefined) {
                $scope.CertificateFileName = $('#EditDocument')[0].files[0]['name'];
            }
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
            if ($('#UserLogo')[0].files[0] != undefined) {
                $scope.FileName = $('#UserLogo')[0].files[0]['name'];
            }
        }

        //this is for image upload function//
        $scope.uploadImage = function (Photo) {
            var filename = "";
            //var fd = new FormData();
            if ($('#UserLogo')[0].files[0] != undefined) {
                FileName = $('#UserLogo')[0].files[0]['name'];
            }
        }


        $scope.User_Admin_AddEdit_Validations = function () {
            if ($scope.MenuTypeId == 1 || $scope.MenuTypeId == 2) {
                if (($scope.MenuTypeId == 1) && (($scope.InstitutionId) == "undefined" || $scope.InstitutionId == "0")) {
                    alert("Please select Institution");
                    return false;
                }
                else if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                    alert("Please enter First Name");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                    alert("Please enter Last Name");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.Employee_No) == "undefined" || $scope.Employee_No == "") {
                    alert("Please enter Employment No.");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                    alert("Please select Gender");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.DepartmentId) == "undefined" || $scope.DepartmentId == "0") {
                    alert("Please select Department");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                    alert("Please enter Email");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (EmailFormate($scope.EmailId) == false) {
                    alert("Invalid email format");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }
                else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                    alert("Please enter Mobile No.");
                    if ($scope.MenuTypeId == 2) {
                        $scope.currentTab = 1;
                    }
                    return false;
                }

                if ($scope.uploadme != "") {
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
                        alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico");
                        return false;
                    }
                }
            }
            if ($scope.MenuTypeId == 2) {
                if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                    alert("Please select Type of User");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.Health_License) == "undefined" || $scope.Health_License == "") {
                    alert("Please enter Health License under Additional Info");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                    alert("Please select Nationality under Additional Info");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
                    alert("Please select Date of Birth under Additional info");
                    $scope.currentTab = 2;
                    return false;
                }
                //else if (isDate($scope.DOB) == false) {
                //    alert("Date of Birth is in Invalid format, please enter dd-mm-yyyy");
                //    $scope.currentTab = 2;
                //    return false;
                //}
                else if ($scope.AgeRestrictioncalculation() == false) {
                    alert("Age should be more than " + $scope.JAge + " years.Please enter a valid Date of Birth");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                    alert("Please select Country under Address Info");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.StateId) == "undefined" || $scope.StateId == "0") {
                    alert("Please select State under Address Info");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.CityId) == "undefined" || $scope.CityId == "0") {
                    alert("Please select City under Address Info");
                    $scope.currentTab = 3;
                    return false;
                }

                if ($scope.CertificateFileName != "") {
                    var fileval = 0;
                    $scope.filetype = $scope.CertificateFileName.split(".");
                    var fileExtenstion = "";
                    if ($scope.filetype.length > 0) {
                        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                    }
                    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico"
                        || fileExtenstion.toLocaleLowerCase() == "pdf" || fileExtenstion.toLocaleLowerCase() == "xls" || fileExtenstion.toLocaleLowerCase() == "xlsx"
                        || fileExtenstion.toLocaleLowerCase() == "doc" || fileExtenstion.toLocaleLowerCase() == "docx" || fileExtenstion.toLocaleLowerCase() == "odt"
                        || fileExtenstion.toLocaleLowerCase() == "txt" || fileExtenstion.toLocaleLowerCase() == "pptx" || fileExtenstion.toLocaleLowerCase() == "ppt"
                        || fileExtenstion.toLocaleLowerCase() == "rtf" || fileExtenstion.toLocaleLowerCase() == "tex"
                    ) {// check more condition with MIME type                      
                        fileval = 1;
                    }
                    else {
                        fileval = 2;
                    }
                    if (fileval == 2) {
                        alert("Please choose jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex file.");
                        return false;
                    }
                }
            }
            if ($scope.MenuTypeId == 3) {
                if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                    alert("Please enter First Name");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                    alert("Please enter Last Name");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                    alert("Please select Gender");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.MNR_No) == "undefined" || $scope.MNR_No == "") {
                    alert("Please enter MNR No.");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.NationalId) == "undefined" || $scope.NationalId == "") {
                    alert("Please enter National ID");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.InsuranceId) == "undefined" || $scope.InsuranceId == "") {
                    alert("Please enter Insurance ID");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                    alert("Please enter Email");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.EmailId) == false) {
                    alert("Invalid email format");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.Google_EmailId) == false) {
                    alert("Invalid Google Email format");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (EmailFormate($scope.FB_EmailId) == false) {
                    alert("Invalid Facebook Email format");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                    alert("Please enter Mobile No.");
                    $scope.currentTab = 1;
                    return false;
                }
                else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                    alert("Please select Nationality under Additional Info");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.MaritalStatusId) == "undefined" || $scope.MaritalStatusId == "0") {
                    alert("Please select Marital Status under Additional Info");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.BloodGroupId) == "undefined" || $scope.BloodGroupId == "0") {
                    alert("Please select Blood Group under Additional Info");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.EthnicGroupId) == "undefined" || $scope.EthnicGroupId == "0") {
                    alert("Please select Ethnic Group under Additional Info");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
                    alert("Please select Date of Birth under Additional info");
                    $scope.currentTab = 2;
                    return false;
                }
                //else if (isDate($scope.DOB) == false) {
                //    alert("Date of Birth is in Invalid format, please enter dd-mm-yyyy");
                //    $scope.currentTab = 2;
                //    return false;
                //}
                else if ($scope.AgeRestrictioncalculation() == false) {
                    alert("Age should be more than " + $scope.JAge + " years.Please enter a valid Date of Birth");
                    $scope.currentTab = 2;
                    return false;
                }
                else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                    alert("Please select Country under Address Info");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.StateId) == "undefined" || $scope.StateId == "0") {
                    alert("Please select State under Address Info");
                    $scope.currentTab = 3;
                    return false;
                }
                else if (typeof ($scope.CityId) == "undefined" || $scope.CityId == "0") {
                    alert("Please select City under Address Info");
                    $scope.currentTab = 3;
                    return false;
                }
                if ($scope.CURRENTLY_TAKEMEDICINE == 1) {
                    if (($ff($scope.AddMedicines, { Status: 1 }).length == 0)) {
                        alert("Please add atleast one row for Currrently Take Medicine under Medical Info");
                        $scope.currentTab = 5;
                        return false;
                    }
                    else {
                        var AMitem = 0;
                        angular.forEach($scope.AddMedicines, function (value, index) {
                            if ((value.MedicineName == null) || (value.MedicineName == undefined) || (value.MedicineName == "")) {
                                AMitem = 1;
                            }
                        });
                        if ($scope.AddMedicines.length < 1 || AMitem == 1) {
                            alert("Please enter Medicine Name under Medical Info");
                            $scope.currentTab = 5;
                            return false;
                        }
                    }
                }
                if ($scope.PAST_MEDICALHISTORY == 1 && ($ff($scope.AddMedicalHistory, { Status: 1 }).length > 0)) {
                    var MHitem = 0;
                    angular.forEach($scope.AddMedicalHistory, function (value, index) {
                        if (value.Medical_History == null || value.Medical_History == undefined || value.Medical_History == "") {
                            MHitem = 1;
                        }
                    });
                    if ($scope.AddMedicalHistory.length < 1 || MHitem == 1) {
                        alert("Please enter Medical History under Medical Info");
                        $scope.currentTab = 5;
                        return false;
                    }
                }
                if ($scope.FAMILYHEALTH_PROBLEMHISTORY == 1) {
                    if (($ff($scope.AddHealthProblem, { Status: 1 }).length == 0)) {
                        alert("Please add atleast one row for family Health Problem History under Medical Info");
                        $scope.currentTab = 5;
                        return false;
                    }
                    else {
                        var Relation_Healthitem = 0;
                        var HealthProb_Item = 0;
                        angular.forEach($ff($scope.AddHealthProblem, { Status: 1 }), function (value, index) {
                            if (value.Relationship_Id == 0 || value.Relationship_Id == undefined || value.Relationship_Id == null) {
                                Relation_Healthitem = 1;
                            }
                            if (value.Health_Problem == null || value.Health_Problem == undefined || value.Health_Problem == "") {
                                HealthProb_Item = 1;
                            }
                        });
                        if ($scope.AddHealthProblem.length < 1 || Relation_Healthitem == 1) {
                            alert("Please select Relationship under Medical Info");
                            $scope.currentTab = 5;
                            return false;
                        }
                        if ($scope.AddHealthProblem.length < 1 || HealthProb_Item == 1) {
                            alert("Please enter Health Problem under Medical Info");
                            $scope.currentTab = 5;
                            return false;
                        }
                    }
                }
                if ($scope.uploadme != "") {
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
                        alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico");
                        return false;
                    }
                }
            }
            if ($scope.uploadme != "" && $scope.uploadme != null) {
                if ($scope.dataURItoBlob($scope.uploadme).size > $scope.ProfileImageSize) {
                    var alertmsg = "Uploaded Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024 / 1024).toString() + "MB";
                    if ($scope.ProfileImageSize <= 1045504) {
                        alertmsg = "Uploaded Photo size cannot be greater than " + ($scope.ProfileImageSize / 1024).toString() + "KB";
                    }
                    alert(alertmsg);
                    $scope.currentTab = 1;
                    return false;
                }
            }
            if ($scope.Editresumedoc != null) {
                if ($scope.Editresumedoc != undefined && $scope.Editresumedoc != null && $scope.Editresumedoc != "") {
                    if ($scope.dataURItoBlob($scope.Editresumedoc).size > 1048576) {
                        alert("Certificate file size cannot be greater than 1MB");
                        $scope.currentTab = 5;
                        return false;
                    }
                }
            }
            return true;
        }

        $scope.AgeRestictLimit = function () {
            $scope.JAge = 18;
            var deferred = $q.defer();

            if ($scope.MenuTypeId == 2)
                $scope.ConfigCode = "BUSINESS_USER_MIN_AGE";
            else if ($scope.MenuTypeId == 3)
                $scope.ConfigCode = "PATIENT_MIN_AGE";

            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                if (data[0] != undefined) {
                    $scope.JAge = parseInt(data[0].ConfigValue);
                }
                deferred.resolve($scope.JAge);
            });
            return deferred.promise;
        };

        //$scope.AgeRestrictioncalculation = function () {
        //    $scope.Today_Date = $filter('date')(new Date(), 'DD-MMM-YYYY');
        //    $scope.Join_Day = moment(ParseDate($scope.Today_Date).subtract($scope.JAge, 'years')).format("DD-MMM-YYYY");
        //    if ((ParseDate($scope.DOB)) > (ParseDate($scope.Join_Day))) {
        //        return false;
        //    }
        //    return true;
        //};
        $scope.AgeRestrictioncalculation = function () {
            $scope.Today_Date = $filter('date')(new Date(), 'DD-MMM-YYYY');
            $scope.Join_Day = moment(ParseDate($scope.Today_Date).subtract($scope.JAge, 'years')).format("DD-MMM-YYYY");
            $scope.DOB = moment($scope.DOB).format('DD-MMM-YYYY');
            if ((ParseDate($scope.DOB)) > (ParseDate($scope.Join_Day))) {
                $scope.DOB = DateFormatEdit($scope.DOB, "dd-MMM-yyyy");
                return false;
            }
            $scope.DOB = DateFormatEdit($scope.DOB, "dd-MMM-yyyy");
            return true;
        };
        //$scope.Country_onChange = function () {
        //    $scope.StateNameList = [];            
        //    $scope.StateNameList = $ff($scope.StateList, { CountryId: $scope.CountryId });
        //};
        //$scope.StateClearFunction = function () {
        //    $scope.StateId = "0";
        //    $scope.CityId = "0";
        //};
        //$scope.State_onChange = function () {
        //    $scope.CityNameList = [];
        //    $scope.CityNameList = $ff($scope.LocationList, { StateId: $scope.StateId });
        //};
        //$scope.LocationClearFunction = function () {
        //    $scope.CityId = "0";
        //};
        $scope.Admin_View = function (MenuType) {
            if (($scope.LoginType == 3 || $scope.LoginType == 2) && $scope.EditParameter == 4) {
                $scope.DropDownListValue = 4;
            } 
           
            $scope.loadCount = 3;
            $("#chatLoaderPV").show();
            photoview = true;
            var methodcnt = 2;
            $scope.MenuTypeId = MenuType;
            if (MenuType == 3) {
                if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                    $scope.Id = $routeParams.Id;
                    $scope.DuplicatesId = $routeParams.Id;
                }
            } 
            $scope.EditSelectedGroup = [];
            $scope.SelectedGroup = [];
            $scope.EditSelectedInstitution = [];
            $scope.SelectedInstitution = [];
            $scope.EditSelectedLanguage = [];
            $scope.SelectedLanguage = [];
            $scope.EditSelectedChronicondition = [];
            $scope.SelectedChronicCondition = [];
            if ($scope.Id > 0) {
                $http.get(baseUrl + '/api/User/UserDetails_GetPhoto/?Id=' + $scope.Id).success(function (data) {
                    methodcnt = methodcnt - 1;
                    if (methodcnt == 0)
                        $scope.uploadview = true;
                    if (data.PhotoBlob != null) {
                        $scope.uploadme = 'data:image/png;base64,' + data.PhotoBlob;

                    }
                    else {
                        $scope.uploadme = null;
                    }

                })

                if ($scope.LoginType == 2) {
                    $http.get(baseUrl + '/api/User/UserDetails_GetCertificate/?Id=' + $scope.Id).success(function (data) {
                        if (data.CertificateBlob != null) {
                            $scope.Editresumedoc = 'data:image/png;base64,' + data.CertificateBlob;
                        }
                        else {
                            $scope.Editresumedoc = null;
                        }
                    })
                }

                $http.get(baseUrl + '/api/User/UserDetails_View/Id?=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.Id = data.Id;
                    $scope.InstitutionId = data.INSTITUTION_ID.toString();
                    $scope.DepartmentId = data.DEPARTMENT_ID.toString();
                    $scope.FirstName = data.FirstName;
                    $scope.MiddleName = data.MiddleName;
                    $scope.LastName = data.LastName;
                    $scope.Employee_No = data.EMPLOYEMENTNO;
                    $scope.EmailId = data.EMAILID;
                    $scope.MobileNo = data.MOBILE_NO;
                    $scope.ViewDepartmentName = data.Department_Name;
                    $scope.ViewInstitutionName = data.InstitutionName;
                    $scope.Photo = data.Photo;
                    $scope.UserLogo = data.Photo;
                    //$scope.uploadme = data.Photo;
                    $scope.FileName = data.FileName;
                    $scope.PhotoFullpath = data.Photo_Fullpath;
                    $scope.UserTypeId = data.UserType_Id.toString();
                    $scope.Health_License = data.HEALTH_LICENSE;
                    $scope.File_Name = data.FILE_NAME;
                    $scope.CertificateFileName = data.FILE_NAME;
                    $scope.Resume = data.FILE_NAME;
                    $scope.resumedoc = data.FILE_NAME;
                    $scope.File_FullPath = data.FILE_FULLPATH;
                    $scope.Upload_FileName = data.UPLOAD_FILENAME;
                    $scope.GenderId = data.GENDER_ID.toString();
                    $scope.NationalityId = data.NATIONALITY_ID.toString();
                    $scope.EthnicGroupId = data.ETHINICGROUP_ID.toString();
                    $scope.DOB  = DateFormatEdit($filter('date')(data.DOB, "dd-MMM-yyyy"));
                    $scope.HomeAreaCode = data.HOME_AREACODE;
                    $scope.Home_PhoneNo = data.HOME_PHONENO;
                    $scope.MobileAreaCode = data.MOBIL_AREACODE;
                    $scope.PostalZipCode = data.POSTEL_ZIPCODE;
                    $scope.EMR_Avalability = data.EMR_AVAILABILITY;
                    $scope.Address1 = data.ADDRESS1;
                    $scope.Address2 = data.ADDRESS2;
                    $scope.Address3 = data.ADDRESS3;
                    $scope.CountryId = data.COUNTRY_ID.toString();
                    $scope.StateId = data.STATE_ID.toString();
                    $scope.CityId = data.CITY_ID.toString();

                    $scope.CountryDuplicateId = $scope.CountryId;
                    $scope.CountryFlag = true;
                    $scope.StateDuplicateId = $scope.StateId;
                    $scope.StateFlag = true;
                    $scope.LocationDuplicateId = $scope.CityId;
                    $scope.CityFlag = true;
                    if ($scope.DropDownListValue == 4) {

                        $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                            $scope.CountryNameList = data;
                            if ($scope.CountryFlag == true) {
                                $scope.CountryId = $scope.CountryDuplicateId;
                                $scope.CountryFlag = false;
                                $scope.loadCount = $scope.loadCount - 1;
                            }
                        });
                        $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + data.COUNTRY_ID.toString()).success(function (data) {
                            $scope.StateName_List = data;
                            if ($scope.StateFlag == true) {
                                $scope.StateId = $scope.StateDuplicateId;
                                $scope.StateFlag = false;
                                $scope.loadCount = $scope.loadCount - 1;
                            }
                        });
                        $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + data.COUNTRY_ID.toString() + '&StateId=' + data.STATE_ID.toString()).success(function (data) {
                            //$scope.LocationName_List =data ;    
                            $scope.LocationName_List = data;
                            if ($scope.CityFlag == true) {
                                $scope.CityId = $scope.LocationDuplicateId;
                                $scope.CityFlag = false;
                                $scope.loadCount = $scope.loadCount - 1;
                            }
                        });
                    }
                    $scope.MaritalStatusId = data.MARITALSTATUS_ID.toString();
                    $scope.BloodGroupId = data.BLOODGROUP_ID.toString();
                    $scope.PatientNo = data.PATIENTNO;
                    $scope.Createdby_ShortName = data.Createdby_ShortName;
                    $scope.InsuranceId = data.INSURANCEID;
                    $scope.MNR_No = data.MNR_NO;
                    $scope.NationalId = data.NATIONALID;
                    $scope.EthnicGroup = data.EthnicGroup;
                    $scope.ViewGender = data.GENDER_NAME;
                    $scope.ViewNationality = data.Nationality;
                    $scope.ViewUserName = data.UserName;
                    $scope.ViewGroupName = data.GroupName;
                    $scope.ViewCountryName = data.COUNTRY_NAME;
                    $scope.ViewStateName = data.StateName;
                    $scope.ViewLocationName = data.LocationName;
                    $scope.Institution = data.Institution;
                    $scope.LanguageKnown = data.LanguageKnown;
                    $scope.MaritalStatus = data.MaritalStatus;
                    $scope.ViewBloodGroup = data.BLOODGROUP_NAME;
                    $scope.RelationShipName = data.RelationShipName;
                    $scope.DietDescribe = data.DietDescribe;
                    $scope.AlergySubstance = data.AlergySubstance;
                    $scope.ChronicCondition = data.ChronicCondition;
                    $scope.EXCERCISE_SCHEDULE = data.EXCERCISE_SCHEDULE;
                    $scope.SMOKESUBSTANCE = data.SMOKESUBSTANCE;
                    $scope.ALCOHALSUBSTANCE = data.ALCOHALSUBSTANCE;
                    $scope.CAFFEINATED_BEVERAGES = data.CAFFEINATED_BEVERAGES;
                    $scope.DIETDESCRIBE_ID = data.DIETDESCRIBE_ID.toString();
                    $scope.EXCERCISE_SCHEDULEID = data.EXCERCISE_SCHEDULEID.toString();
                    $scope.ALERGYSUBSTANCE_ID = data.ALERGYSUBSTANCE_ID.toString();
                    $scope.SMOKESUBSTANCE_ID = data.SMOKESUBSTANCE_ID.toString();
                    $scope.ALCOHALSUBSTANCE_ID = data.ALCOHALSUBSTANCE_ID.toString();
                    $scope.CAFFEINATED_BEVERAGESID = data.CAFFEINATED_BEVERAGESID.toString();
                    $scope.EMERG_CONT_RELATIONSHIP_ID = data.EMERG_CONT_RELATIONSHIP_ID.toString();
                    $scope.CURRENTLY_TAKEMEDICINE = data.CURRENTLY_TAKEMEDICINE;
                    $scope.PAST_MEDICALHISTORY = data.PAST_MEDICALHISTORY;
                    $scope.FAMILYHEALTH_PROBLEMHISTORY = data.FAMILYHEALTH_PROBLEMHISTORY;
                    $scope.VACCINATIONS = data.VACCINATIONS;
                    $scope.EXCERCISE_TEXT = data.EXCERCISE_TEXT;
                    $scope.ALERGYSUBSTANCE_TEXT = data.ALERGYSUBSTANCE_TEXT;
                    $scope.SMOKESUBSTANCE_TEXT = data.SMOKESUBSTANCE_TEXT;
                    $scope.ALCOHALSUBSTANCE_TEXT = data.ALCOHALSUBSTANCE_TEXT;
                    $scope.CAFFEINATEDBEVERAGES_TEXT = data.CAFFEINATEDBEVERAGES_TEXT;
                    $scope.EMERG_CONT_FIRSTNAME = data.EMERG_CONT_FIRSTNAME;
                    $scope.EMERG_CONT_MIDDLENAME = data.EMERG_CONT_MIDDLENAME;
                    $scope.EMERG_CONT_LASTNAME = data.EMERG_CONT_LASTNAME;
                    $scope.Emergency_MobileNo = data.Emergency_MobileNo;
                    $scope.Google_EmailId = data.GOOGLE_EMAILID;
                    $scope.FB_EmailId = data.FB_EMAILID;
                    $scope.Patient_Type = data.Patient_Type;

                    $scope.Diabetic = data.DIABETIC.toString();
                    $scope.HyperTension = data.HYPERTENSION.toString();
                    $scope.Cholestrol = data.CHOLESTEROL.toString();

                    $scope.ViewDiabetic = data.Diabetic_Option;
                    $scope.ViewCholestrol = data.Cholesterol_Option;
                    $scope.ViewHyperTension = data.HyperTension_Option;

                    $scope.AddMedicines = data.AddMedicines;
                    $scope.AddMedicalHistory = data.AddMedicalHistory;
                    $scope.AddHealthProblem = data.AddHealthProblem;
                    $scope.ApprovalFlag = data.Approval_flag;
                    methodcnt = methodcnt - 1;
                    if (methodcnt == 0)
                        $scope.uploadview = true;

                    if ($scope.UserTypeId == 2) {
                        if ($scope.AddMedicines.length > 0) {
                            $scope.CurrentMedicineflag = 1;
                        }
                        else {
                            $scope.CurrentMedicineflag = 0;
                        }
                        if ($scope.AddMedicalHistory.length > 0) {
                            $scope.PastMedicineflag = 1;
                        }
                        else {
                            $scope.PastMedicineflag = 0;
                        }

                        if ($scope.AddHealthProblem.length > 0) {
                            $scope.MedicalHistoryflag = 1;
                        }
                        else {
                            $scope.MedicalHistoryflag = 0;
                        }
                    }
                    angular.forEach(data.SelectedGroupList, function (value, index) {
                        $scope.EditSelectedGroup.push(value.Group_Id);
                        $scope.SelectedGroup = $scope.EditSelectedGroup;
                    });
                    angular.forEach(data.SelectedInstitutionList, function (value, index) {
                        $scope.EditSelectedInstitution.push(value.Institution_Id);
                        $scope.SelectedInstitution = $scope.EditSelectedInstitution;
                    });
                    angular.forEach(data.SelectedLanguageList, function (value, index) {
                        $scope.EditSelectedLanguage.push(value.Language_Id);
                        $scope.SelectedLanguage = $scope.EditSelectedLanguage;
                    });
                    angular.forEach(data.SelectedChronicConnditionList, function (value, index) {
                        $scope.EditSelectedChronicondition.push(value.Chronic_Id);
                        $scope.SelectedChronicCondition = $scope.EditSelectedChronicondition;
                    });
                    //$scope.CountryBased_StateFunction();
                    //$scope.StateBased_CityFunction();
                    //$scope.Country_onChange();
                    //$scope.State_onChange();

                    $("#chatLoaderPV").hide(); 
                });
            }
            else {
                $("#chatLoaderPV").hide();
                photoview = false
            }
        }

        $scope.PhotoUplaodSelected = function () {
            $scope.PhotoValue = 1;
            $scope.UserPhotoValue = 1;
        };

        $scope.CertificateUplaodSelected = function () {
            $scope.CertificateValue = 1;
        };


        $scope.UserDetails_InActive = function (GetId) {
            $scope.Id = GetId;
            var del = confirm("Do you like to deactivate the selected User?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/UserDetails_InActive/?Id=' + $scope.Id).success(function (data) {
                    if (data.Status == "True") {
                        alert(data.Message);
                        if ($scope.MenuTypeId == 1)
                            $scope.User_Admin_List($scope.MenuTypeId);
                        else if ($scope.MenuTypeId == 2)
                            $scope.BusinessUser_List($scope.MenuTypeId);
                        else if ($scope.MenuTypeId == 3)
                            $scope.Patient_List($scope.MenuTypeId);
                    }
                    else {
                        alert(data.Message);
                    }
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting User Details" + data;
                });
            }
        };
        $scope.UserDetails_Active = function (GetId) {
            $scope.Id = GetId;
            var del = confirm("Do you like to activate the selected User?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/UserDetails_Active/?Id=' + $scope.Id).success(function (data) {
                    if (data.Status == "True") {
                        alert("User Details has been activated Successfully");
                        if ($scope.MenuTypeId == 1)
                            $scope.User_Admin_List($scope.MenuTypeId);
                        else if ($scope.MenuTypeId == 2)
                            $scope.BusinessUser_List($scope.MenuTypeId);
                        else if ($scope.MenuTypeId == 3)
                            $scope.Patient_List($scope.MenuTypeId);
                    }
                    else {
                        alert(data.Message);
                    }
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting User Details" + data;
                });
            }
        };
        // Add row concept
        $scope.AddMedicines = [{
            'Id': $scope.ChildId,
            'MedicineName': $scope.MedicineName,
            'Remarks': $scope.Remarks,
            'Status': 1
        }];
        /*This is a Addrow function to add new row and save Medicine details*/
        $scope.AddMedicine_Insert = function () {
            if ($scope.MedicineRow >= 0) {
                var obj = {
                    'Id': $scope.ChildId,
                    'MedicineName': $scope.MedicineName,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                }
                $scope.AddMedicines[$scope.MedicineRow] = obj;
            }
            else {
                $scope.AddMedicines.push({
                    'Id': $scope.ChildId,
                    'MedicineName': $scope.MedicineName,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                })
            }
        };
        $scope.AddHealthProblem = [{
            'Id': $scope.HealthProblem_Id,
            'Relationship_Id': $scope.Relationship_Id,
            'Health_Problem': $scope.Health_Problem,
            'Remarks': $scope.Remarks,
            'Status': 1
        }];
        //$scope.AddMedicalHistory = [{
        //    'Id': $scope.Medical_History_Id,
        //    'Medical_History': $scope.Medical_History,
        //    'Remarks': $scope.Remarks,
        //    'Status': 1
        //}];
        $scope.AddMedicalHistory = [];
        /*This is a Addrow function to add new row and save Medical History details*/
        $scope.AddMedicalHistory_Insert = function () {
            if ($scope.MedicalHistoryRow >= 0) {
                var obj = {
                    'Id': $scope.Medical_History_Id,
                    'Medical_History': $scope.Medical_History,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                }
                $scope.AddMedicalHistory[$scope.MedicalHistoryRow] = obj;
            }
            else {
                $scope.AddMedicalHistory.push({
                    'Id': $scope.Medical_History_Id,
                    'Medical_History': $scope.Medical_History,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                })
            }
        };
        $scope.AddHealthProblem = [{
            'Id': $scope.HealthProblem_Id,
            'Relationship_Id': $scope.Relationship_Id,
            'Health_Problem': $scope.Health_Problem,
            'Remarks': $scope.Remarks,
            'Status': 1
        }];
        /*This is a Addrow function to add new row and save Family Health Problem details*/
        $scope.AddHealthProblem_Insert = function () {
            if ($scope.HealthProblemRow >= 0) {
                var obj = {
                    'Id': $scope.HealthProblem_Id,
                    'Relationship_Id': $scope.Relationship_Id,
                    'Health_Problem': $scope.Health_Problem,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                }
                $scope.AddHealthProblem[$scope.HealthProblemRow] = obj;
            }
            else {
                $scope.AddHealthProblem.push({
                    'Id': $scope.HealthProblem_Id,
                    'Relationship_Id': $scope.Relationship_Id,
                    'Health_Problem': $scope.Health_Problem,
                    'Remarks': $scope.Remarks,
                    'Status': 1
                })
            }
        };
        $scope.User_InsertUpdate = function () {
            var myPromise = $scope.AgeRestictLimit();
            $scope.Is_Master = false;
            myPromise.then(function (resolve) {

                if (($scope.MenuTypeId == 2 || $scope.MenuTypeId == 3) || ($scope.MenuTypeId == 1 && $scope.LoginType == 3)) // for business users
                {
                    $scope.InstitutionId = $window.localStorage['InstitutionId'];
                }
                if ($scope.MenuTypeId == 1 && $scope.LoginType == 1) {
                    $scope.Is_Master = true;
                }
                if ($scope.User_Admin_AddEdit_Validations() == true) {
                    $("#chatLoaderPV").show();
                    $scope.UserInstitutionDetails_List = [];
                    angular.forEach($scope.SelectedInstitution, function (value, index) {
                        var Institutionobj = {
                            Id: 0,
                            Institution_Id: value
                        }
                        $scope.UserInstitutionDetails_List.push(Institutionobj);
                    });
                    $scope.UserLanguageDetails_List = [];
                    angular.forEach($scope.SelectedLanguage, function (value, index) {
                        var Languageobj = {
                            Id: 0,
                            Language_Id: value
                        }
                        $scope.UserLanguageDetails_List.push(Languageobj);
                    });
                    $scope.UserGroupDetails_List = [];
                    angular.forEach($scope.SelectedGroup, function (value, index) {
                        var obj = {
                            Id: 0,
                            Group_Id: value
                        }
                        $scope.UserGroupDetails_List.push(obj);
                    });
                    $scope.PatientChronicCondition_List = [];
                    angular.forEach($scope.SelectedChronicCondition, function (value, index) {
                        var obj = {
                            Id: 0,
                            Chronic_Id: value
                        }
                        $scope.PatientChronicCondition_List.push(obj);
                    });
                    var FileName = "";
                    var CertificateFileName = "";
                    var Licensefilename = "";
                    var fd = new FormData();
                    var imgBlob;
                    var imgBlobfile;
                    var itemIndexLogo = -1;
                    var itemIndexfile = -1;
                    var fd = new FormData();
                    //if ($('#UserLogo')[0].files[0] != undefined) {
                    //    FileName = $('#UserLogo')[0].files[0]['name'];
                    //    imgBlob = $scope.dataURItoBlob($scope.uploadme);
                    //    itemIndexLogo = 0;
                    //}

                    //if (itemIndexLogo != -1) {
                    //    fd.append('file', imgBlob);
                    //}
                    /*
                    calling the api method for read the file path 
                    and saving the image uploaded in the local server. 
                    */

                    if ($scope.DOB == "" || $scope.DOB == undefined || $scope.DOB == null) {
                        var obj = {
                            Id: $scope.Id,
                            INSTITUTION_ID: $scope.InstitutionId == 0 ? null : $scope.InstitutionId,
                            FirstName: $scope.FirstName,
                            MiddleName: $scope.MiddleName,
                            LastName: $scope.LastName,
                            EMPLOYEMENTNO: $scope.Employee_No,
                            DEPARTMENT_ID: $scope.DepartmentId == 0 ? null : $scope.DepartmentId,
                            EMAILID: $scope.EmailId,
                            MOBILE_NO: $scope.MobileNo,
                            FileName: $scope.FileName,
                            Photo_Fullpath: "",
                            Photo: $scope.UserLogo,
                            UserType_Id: $scope.MenuTypeId == 1 ? 3 : $scope.MenuTypeId == 3 ? 2 : $scope.UserTypeId,
                            TITLE_ID: $scope.Title_Id == 0 ? null : $scope.Title_Id,
                            HEALTH_LICENSE: $scope.Health_License,
                            FILE_NAME: $scope.CertificateFileName,
                            FILE_FULLPATH: "",
                            UPLOAD_FILENAME: $scope.Resume,
                            GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                            NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                            ETHINICGROUP_ID: $scope.EthnicGroupId == 0 ? null : $scope.EthnicGroupId,
                            DOB: "",
                            HOME_AREACODE: $scope.HomeAreaCode,
                            HOME_PHONENO: $scope.Home_PhoneNo,
                            MOBIL_AREACODE: $scope.MobileAreaCode,
                            POSTEL_ZIPCODE: $scope.PostalZipCode,
                            EMR_AVAILABILITY: $scope.EMR_Avalability,
                            ADDRESS1: $scope.Address1,
                            ADDRESS2: $scope.Address2,
                            ADDRESS3: $scope.Address3,
                            COUNTRY_ID: $scope.CountryId == 0 ? null : $scope.CountryId,
                            STATE_ID: $scope.StateId == 0 ? null : $scope.StateId,
                            CITY_ID: $scope.CityId == 0 ? null : $scope.CityId,
                            MARITALSTATUS_ID: $scope.MaritalStatusId == 0 ? null : $scope.MaritalStatusId,
                            BLOODGROUP_ID: $scope.BloodGroupId == 0 ? null : $scope.BloodGroupId,
                            PATIENTNO: $scope.PatientNo,
                            INSURANCEID: $scope.InsuranceId,
                            MNR_NO: $scope.MNR_No,
                            NATIONALID: $scope.NationalId,
                            SMOKER: $scope.Smoker == 0 ? null : $scope.Smoker,
                            DIABETIC: $scope.Diabetic == 0 ? null : $scope.Diabetic,
                            HYPERTENSION: $scope.HyperTension == 0 ? null : $scope.HyperTension,
                            CHOLESTEROL: $scope.Cholestrol == 0 ? null : $scope.Cholestrol,
                            SelectedGroupList: $scope.UserGroupDetails_List,
                            GroupTypeList: $scope.GroupTypeList,
                            SelectedInstitutionList: $scope.UserInstitutionDetails_List,
                            InstitutionList: $scope.DoctorInstitutionList,
                            SelectedLanguageList: $scope.UserLanguageDetails_List,
                            LanguageList: $scope.LanguageList,
                            CURRENTLY_TAKEMEDICINE: $scope.CURRENTLY_TAKEMEDICINE,
                            PAST_MEDICALHISTORY: $scope.PAST_MEDICALHISTORY,
                            FAMILYHEALTH_PROBLEMHISTORY: $scope.FAMILYHEALTH_PROBLEMHISTORY,
                            VACCINATIONS: $scope.VACCINATIONS,
                            DIETDESCRIBE_ID: $scope.DIETDESCRIBE_ID == 0 ? null : $scope.DIETDESCRIBE_ID,
                            EXCERCISE_SCHEDULEID: $scope.EXCERCISE_SCHEDULEID == 0 ? null : $scope.EXCERCISE_SCHEDULEID,
                            EXCERCISE_TEXT: $scope.EXCERCISE_TEXT,
                            ALERGYSUBSTANCE_ID: $scope.ALERGYSUBSTANCE_ID == 0 ? null : $scope.ALERGYSUBSTANCE_ID,
                            ALERGYSUBSTANCE_TEXT: $scope.ALERGYSUBSTANCE_TEXT,
                            SMOKESUBSTANCE_ID: $scope.SMOKESUBSTANCE_ID == 0 ? null : $scope.SMOKESUBSTANCE_ID,
                            SMOKESUBSTANCE_TEXT: $scope.SMOKESUBSTANCE_TEXT,
                            ALCOHALSUBSTANCE_ID: $scope.ALCOHALSUBSTANCE_ID == 0 ? null : $scope.ALCOHALSUBSTANCE_ID,
                            ALCOHALSUBSTANCE_TEXT: $scope.ALCOHALSUBSTANCE_TEXT,
                            CAFFEINATED_BEVERAGESID: $scope.CAFFEINATED_BEVERAGESID == 0 ? null : $scope.CAFFEINATED_BEVERAGESID,
                            CAFFEINATEDBEVERAGES_TEXT: $scope.CAFFEINATEDBEVERAGES_TEXT,
                            EMERG_CONT_FIRSTNAME: $scope.EMERG_CONT_FIRSTNAME,
                            EMERG_CONT_MIDDLENAME: $scope.EMERG_CONT_MIDDLENAME,
                            EMERG_CONT_LASTNAME: $scope.EMERG_CONT_LASTNAME,
                            EMERG_CONT_RELATIONSHIP_ID: $scope.EMERG_CONT_RELATIONSHIP_ID == 0 ? null : $scope.EMERG_CONT_RELATIONSHIP_ID,
                            SelectedChronicConnditionList: $scope.PatientChronicCondition_List,
                            ChronicConditionList: $scope.ChronicConditionList,
                            AddMedicines: $scope.AddMedicines,
                            AddMedicalHistory: $scope.AddMedicalHistory,
                            AddHealthProblem: $scope.AddHealthProblem,
                            MenuType: $scope.MenuTypeId,
                            GOOGLE_EMAILID: $scope.Google_EmailId,
                            FB_EMAILID: $scope.FB_EmailId,
                            CREATED_BY: $window.localStorage['UserId'],
                            ApprovalFlag: "1",      //  USER APPROVED WHEN IT IS CREATED BY HOSPITAL ADMIN OR SUPER ADMIN
                            Patient_Type: $scope.Patient_Type,
                            Emergency_MobileNo: $scope.Emergency_MobileNo,
                            IS_MASTER: $scope.Is_Master
                        }
                    } else {
                        var obj = {
                            Id: $scope.Id,
                            INSTITUTION_ID: $scope.InstitutionId == 0 ? null : $scope.InstitutionId,
                            FirstName: $scope.FirstName,
                            MiddleName: $scope.MiddleName,
                            LastName: $scope.LastName,
                            EMPLOYEMENTNO: $scope.Employee_No,
                            DEPARTMENT_ID: $scope.DepartmentId == 0 ? null : $scope.DepartmentId,
                            EMAILID: $scope.EmailId,
                            MOBILE_NO: $scope.MobileNo,
                            FileName: $scope.FileName,
                            Photo_Fullpath: "",
                            Photo: $scope.UserLogo,
                            UserType_Id: $scope.MenuTypeId == 1 ? 3 : $scope.MenuTypeId == 3 ? 2 : $scope.UserTypeId,
                            TITLE_ID: $scope.Title_Id == 0 ? null : $scope.Title_Id,
                            HEALTH_LICENSE: $scope.Health_License,
                            FILE_NAME: $scope.CertificateFileName,
                            FILE_FULLPATH: "",
                            UPLOAD_FILENAME: $scope.Resume,
                            GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                            NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                            ETHINICGROUP_ID: $scope.EthnicGroupId == 0 ? null : $scope.EthnicGroupId,
                            DOB: moment($scope.DOB).format('DD-MMM-YYYY'),
                            HOME_AREACODE: $scope.HomeAreaCode,
                            HOME_PHONENO: $scope.Home_PhoneNo,
                            MOBIL_AREACODE: $scope.MobileAreaCode,
                            POSTEL_ZIPCODE: $scope.PostalZipCode,
                            EMR_AVAILABILITY: $scope.EMR_Avalability,
                            ADDRESS1: $scope.Address1,
                            ADDRESS2: $scope.Address2,
                            ADDRESS3: $scope.Address3,
                            COUNTRY_ID: $scope.CountryId == 0 ? null : $scope.CountryId,
                            STATE_ID: $scope.StateId == 0 ? null : $scope.StateId,
                            CITY_ID: $scope.CityId == 0 ? null : $scope.CityId,
                            MARITALSTATUS_ID: $scope.MaritalStatusId == 0 ? null : $scope.MaritalStatusId,
                            BLOODGROUP_ID: $scope.BloodGroupId == 0 ? null : $scope.BloodGroupId,
                            PATIENTNO: $scope.PatientNo,
                            INSURANCEID: $scope.InsuranceId,
                            MNR_NO: $scope.MNR_No,
                            NATIONALID: $scope.NationalId,
                            SMOKER: $scope.Smoker == 0 ? null : $scope.Smoker,
                            DIABETIC: $scope.Diabetic == 0 ? null : $scope.Diabetic,
                            HYPERTENSION: $scope.HyperTension == 0 ? null : $scope.HyperTension,
                            CHOLESTEROL: $scope.Cholestrol == 0 ? null : $scope.Cholestrol,
                            SelectedGroupList: $scope.UserGroupDetails_List,
                            GroupTypeList: $scope.GroupTypeList,
                            SelectedInstitutionList: $scope.UserInstitutionDetails_List,
                            InstitutionList: $scope.DoctorInstitutionList,
                            SelectedLanguageList: $scope.UserLanguageDetails_List,
                            LanguageList: $scope.LanguageList,
                            CURRENTLY_TAKEMEDICINE: $scope.CURRENTLY_TAKEMEDICINE,
                            PAST_MEDICALHISTORY: $scope.PAST_MEDICALHISTORY,
                            FAMILYHEALTH_PROBLEMHISTORY: $scope.FAMILYHEALTH_PROBLEMHISTORY,
                            VACCINATIONS: $scope.VACCINATIONS,
                            DIETDESCRIBE_ID: $scope.DIETDESCRIBE_ID == 0 ? null : $scope.DIETDESCRIBE_ID,
                            EXCERCISE_SCHEDULEID: $scope.EXCERCISE_SCHEDULEID == 0 ? null : $scope.EXCERCISE_SCHEDULEID,
                            EXCERCISE_TEXT: $scope.EXCERCISE_TEXT,
                            ALERGYSUBSTANCE_ID: $scope.ALERGYSUBSTANCE_ID == 0 ? null : $scope.ALERGYSUBSTANCE_ID,
                            ALERGYSUBSTANCE_TEXT: $scope.ALERGYSUBSTANCE_TEXT,
                            SMOKESUBSTANCE_ID: $scope.SMOKESUBSTANCE_ID == 0 ? null : $scope.SMOKESUBSTANCE_ID,
                            SMOKESUBSTANCE_TEXT: $scope.SMOKESUBSTANCE_TEXT,
                            ALCOHALSUBSTANCE_ID: $scope.ALCOHALSUBSTANCE_ID == 0 ? null : $scope.ALCOHALSUBSTANCE_ID,
                            ALCOHALSUBSTANCE_TEXT: $scope.ALCOHALSUBSTANCE_TEXT,
                            CAFFEINATED_BEVERAGESID: $scope.CAFFEINATED_BEVERAGESID == 0 ? null : $scope.CAFFEINATED_BEVERAGESID,
                            CAFFEINATEDBEVERAGES_TEXT: $scope.CAFFEINATEDBEVERAGES_TEXT,
                            EMERG_CONT_FIRSTNAME: $scope.EMERG_CONT_FIRSTNAME,
                            EMERG_CONT_MIDDLENAME: $scope.EMERG_CONT_MIDDLENAME,
                            EMERG_CONT_LASTNAME: $scope.EMERG_CONT_LASTNAME,
                            EMERG_CONT_RELATIONSHIP_ID: $scope.EMERG_CONT_RELATIONSHIP_ID == 0 ? null : $scope.EMERG_CONT_RELATIONSHIP_ID,
                            SelectedChronicConnditionList: $scope.PatientChronicCondition_List,
                            ChronicConditionList: $scope.ChronicConditionList,
                            AddMedicines: $scope.AddMedicines,
                            AddMedicalHistory: $scope.AddMedicalHistory,
                            AddHealthProblem: $scope.AddHealthProblem,
                            MenuType: $scope.MenuTypeId,
                            GOOGLE_EMAILID: $scope.Google_EmailId,
                            FB_EMAILID: $scope.FB_EmailId,
                            CREATED_BY: $window.localStorage['UserId'],
                            ApprovalFlag: "1",      //  USER APPROVED WHEN IT IS CREATED BY HOSPITAL ADMIN OR SUPER ADMIN
                            Patient_Type: $scope.Patient_Type,
                            Emergency_MobileNo: $scope.Emergency_MobileNo,
                            IS_MASTER: $scope.Is_Master
                        }
                    }
                    $http.post(baseUrl + '/api/User/User_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                        alert(data.Message);
                        /*if (data.Message == "Email already exists cannot be Duplicated") {
                            alert("Email already exists, cannot be Duplicate");
                            return false;
                        }
                        else if (data.Message == "User created successfully") {
                            alert("User created successfully");
                        }
                        else if (data.Message == "User updated successfully") {
                            alert("User updated successfully");
                        }*/
                        var userid = data.UserDetails.Id;

                        if (photoview == false) {
                            photoview = true;

                            imgBlob = $scope.dataURItoBlob($scope.uploadme);
                            itemIndexLogo = 0;

                            if (itemIndexLogo != -1) {
                                fd.append('file', imgBlob);
                            }
                            /*
                            calling the api method for read the file path 
                            and saving the image uploaded in the local server. 
                            */
                            
                            $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=1' + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
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
                                        $scope.UserLogo = "";
                                    }
                                    else if (itemIndexLogo > -1) {
                                        if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                            $scope.UserLogo = response[itemIndexLogo];
                                        }
                                    }
                                });
                        }
                        if ($scope.PhotoValue == 1 && photoview == false && $scope.Id == 0) {
                            if ($('#UserLogo')[0].files[0] != undefined) {
                                FileName = $('#UserLogo')[0].files[0]['name'];
                                imgBlob = $scope.dataURItoBlob($scope.uploadme);
                                itemIndexLogo = 0;
                            }
                            if (itemIndexLogo != -1) {
                                fd.append('file', imgBlob);
                            }
                            /*	
                            calling the api method for read the file path 	
                            and saving the image uploaded in the local server. 	
                            */
                            $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
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
                                        $scope.UserLogo = "";
                                    }
                                    else if (itemIndexLogo > -1) {
                                        if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                            $scope.UserLogo = response[itemIndexLogo];
                                        }
                                    }
                                });
                        }
                        else if ($scope.PhotoValue == 1 && photoview == true && $scope.Id > 0) {
                            if ($('#UserLogo')[0].files[0] != undefined) {
                                FileName = $('#UserLogo')[0].files[0]['name'];
                                imgBlob = $scope.dataURItoBlob($scope.uploadme);
                                itemIndexLogo = 0;
                            }

                            if (itemIndexLogo != -1) {
                                fd.append('file', imgBlob);
                            }
                            /*
                            calling the api method for read the file path 
                            and saving the image uploaded in the local server. 
                            */

                            $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
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
                                        $scope.UserLogo = "";
                                    }
                                    else if (itemIndexLogo > -1) {
                                        if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                            $scope.UserLogo = response[itemIndexLogo];
                                        }
                                    }
                                });
                        }
                        if ($scope.CertificateValue == 1) {
                            if ($scope.MenuTypeId == 2) {
                                if ($('#EditDocument')[0].files[0] != undefined) {
                                    $scope.CertificateFileName = $('#EditDocument')[0].files[0]['name'];
                                    imgBlobfile = $scope.dataURItoBlob($scope.Editresumedoc);
                                    if (itemIndexLogo == -1) {
                                        itemIndexfile = 0;
                                    }
                                    else {
                                        itemIndexfile = 1;
                                    }
                                }
                                if (itemIndexfile != -1) {
                                    fd.append('file1', imgBlobfile);
                                }
                            }
                            $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=' + $scope.PhotoValue + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + $window.localStorage['UserId'],
                                fd,
                                {
                                    transformRequest: angular.identity,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                }
                            )
                                .success(function (response) {
                                    if ($scope.Resume == "") {
                                        $scope.EditDocument = "";
                                    }
                                    //else if (itemIndexLogo > -1) {
                                    //    if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                    //        $scope.UserLogo = response[itemIndexLogo];
                                    //    }
                                    //}
                                    if ($scope.MenuTypeId === 2) {
                                        if ($scope.EditDocument == "") {
                                            $scope.Resume = "";
                                        }

                                        else if (itemIndexfile > -1) {
                                            if ($scope.CertificateFileName != "" && response[itemIndexfile] != "") {
                                                $scope.Resume = response[itemIndexfile];
                                            }
                                        }
                                    }
                                })
                        }
                        if (data.ReturnFlag == "1") {
                            if ($scope.MenuTypeId == 1) {
                                $scope.User_Admin_List($scope.MenuTypeId);
                            }
                            if ($scope.MenuTypeId == 2) {
                                $scope.BusinessUser_List($scope.MenuTypeId);
                            }
                            $scope.CancelPopup();
                            if ($scope.MenuTypeId == 3) {
                                $scope.ListRedirect();
                            }
                            if ($scope.PageParameter == 1) {
                                $scope.Cancel_PatientData_Edit();
                            }
                            if ($scope.PageParameter == 0) {
                                $scope.Cancel_PatientAppproval_Edit();
                            }
                            $("#UserLogo").val('');
                        }

                        $("#chatLoaderPV").hide();
                    });
                }
            });
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
            $scope.Patient_List($scope.MenuTypeId);
        }
        $scope.ListRedirect = function () {
            $scope.Patient_List($scope.MenuTypeId);
            $location.path("/PatientList/3");
        };
        $scope.fileclear = function () {
            $scope.Editresumedoc = "";
            $('#EditDocument').val('');
            $scope.CertificateFileName = "";
        };
        $scope.RemoveMedicine_Item = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this Current Medical Details?");
            if (del == true) {
                var Previous_Item = [];
                if ($scope.Id == 0) {
                    angular.forEach($scope.AddMedicines, function (selectedPre, index) {
                        if (index != rowIndex)
                            Previous_Item.push(selectedPre);
                    });
                    $scope.AddMedicines = Previous_Item;
                }
                else if ($scope.Id > 0) {
                    angular.forEach($scope.AddMedicines, function (selectedPre, index) {
                        if (selectedPre.Id == Delete_Id) {
                            selectedPre.Status = 0;
                        }
                    });
                    if ($ff($scope.AddMedicines, { StatusId: 1 }).length > 0) {
                        $scope.CurrentMedicineflag = 1;
                    }
                    else {
                        $scope.CurrentMedicineflag = 0;
                    }
                }
            }
        };
        $scope.RemoveMedicalHistory_Item = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this Past Medical Details?");
            if (del == true) {
                var Previous_MedicalHistoryItem = [];
                if ($scope.Id == 0) {
                    angular.forEach($scope.AddMedicalHistory, function (selectedPre, index) {
                        if (index != rowIndex)
                            Previous_MedicalHistoryItem.push(selectedPre);
                    });
                    $scope.AddMedicalHistory = Previous_MedicalHistoryItem;
                } else if ($scope.Id > 0) {
                    angular.forEach($scope.AddMedicalHistory, function (selectedPre, index) {
                        if (selectedPre.Id == Delete_Id) {
                            selectedPre.Status = 0;
                        }
                    });
                    if ($ff($scope.AddMedicalHistory, { StatusId: 1 }).length > 0) {
                        $scope.PastMedicineflag = 1;
                    }
                    else {
                        $scope.PastMedicineflag = 0;
                    }
                }
            }
        };
        $scope.RemoveHealthProblem_Item = function (Delete_Id, rowIndex) {
            var del = confirm("Do you like to delete this Family Health Problem Details?");
            if (del == true) {
                var Previous_HealthProblemItem = [];
                if ($scope.Id == 0) {
                    angular.forEach($scope.AddHealthProblem, function (selectedPre, index) {
                        if (index != rowIndex)
                            Previous_HealthProblemItem.push(selectedPre);
                    });
                    $scope.AddHealthProblem = Previous_HealthProblemItem;
                } else if ($scope.Id > 0) {
                    angular.forEach($scope.AddHealthProblem, function (selectedPre, index) {
                        if (selectedPre.Id == Delete_Id) {
                            selectedPre.Status = 0;
                        }
                    });
                    if ($ff($scope.AddHealthProblem, { StatusId: 1 }).length > 0) {
                        $scope.MedicalHistoryflag = 1;
                    }
                    else {
                        $scope.MedicalHistoryflag = 0;
                    }
                }
            }
        };

        $scope.ClearHealthProblem = function () {
            $scope.AddHealthProblem = [{
                'Id': 0,
                'Relationship_Id': 0,
                'Health_Problem': "",
                'Remarks': "",
                'Status': 1
            }];

        };
        $scope.ClearMedicalHistory = function () {
            angular.forEach($scope.AddMedicalHistory, function (value, index) {
                value.Id = 0;
                value.Medical_History = "";
                value.Remarks = "";
                value.Status = 1;
            });
        };
        $scope.ClearMedicine_Item = function () {
            $scope.AddMedicines = [{
                'Id': 0,
                'MedicineName': "",
                'Remarks': "",
                'Status': 1,
            }];
        };
        $scope.Url = baseUrl;
        $scope.AssignedGroupList = [];
        $scope.AssignedGroup = "0";
        $scope.AssignedGroup_Id = "0";
        $scope.CreateGroupName = "";
        $scope.Create_GroupId = "0";
        $scope.checkAll = function () {
            if ($scope.SelectedAllPatient == true) {
                $scope.SelectedAllPatient = true;
            } else {
                $scope.SelectedAllPatient = false;
            }
            angular.forEach($scope.Patientemptydata, function (row) {
                row.SelectedPatient = $scope.SelectedAllPatient;
            });
        };
        $scope.AssignGroup = function () {
            var cnt = ($filter('filter')($scope.Patientemptydata, 'true')).length;
            if (cnt == 0) {
                alert("Please select atleast one Patient to Assign Group");
            }
            else if (typeof ($scope.AssignedGroup) == "undefined" || $scope.AssignedGroup == "0") {
                alert("Please select Group");
                return false;
            }
            else {
                $scope.AssignedGroupList = [];
                angular.forEach($scope.Patientemptydata, function (SelectedPatient, index) {
                    if (SelectedPatient.SelectedPatient == true) {
                        var AssignGroupobj = {
                            Id: $scope.AssignedGroup_Id,
                            Group_Id: $scope.AssignedGroup.toString(),
                            User_Id: SelectedPatient.Id
                        };
                        $scope.AssignedGroupList.push(AssignGroupobj);
                    }
                });
                $http.post(baseUrl + '/api/User/AssignedGroup_Insert/', $scope.AssignedGroupList).success(function (data) {
                    if (data == 1) {
                        alert("Group updated successfully");
                        $scope.ClearPatientGroupPopup();
                        $scope.Patient_List(3);
                    }
                });
            }
        }
        $scope.ClearPatientGroupPopup = function () {
            $scope.AssignedGroup = "0";
            $scope.SelectedAllPatient = false;
            angular.forEach($scope.PatientListFilter, function (SelectedPatient, index) {
                SelectedPatient.SelectedPatient = false;
            });
        }
        $scope.AddGroupPopup = function () {
            angular.element('#GroupCreateModal').modal('show');
        }
        $scope.CancelGroupPopup = function () {
            angular.element('#GroupCreateModal').modal('hide');
            $scope.GroupClearPopUp();
        }
        $scope.GroupClearPopUp = function () {
            $scope.CreateGroupName = "";
            $scope.Create_GroupId = "0";
        };
        $scope.AddGroup_Insert = function () {
            if (typeof ($scope.CreateGroupName) == "undefined" || $scope.CreateGroupName == "") {
                alert("Please enter Group Name");
                return false;
            }
            else {
                var Groupobj = {
                    Id: $scope.Create_GroupId,
                    CreateGroupName: $scope.CreateGroupName,
                    Institution_Id: $window.localStorage['InstitutionId'],

                }
                $http.post(baseUrl + '/api/User/GroupMaster_Insert/', Groupobj).success(function (data) {
                    alert(data.returnMessage);
                    if (data.flag == "2") // clear only if group is valid and record updated
                    {
                        $scope.CancelGroupPopup();
                        $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                            $scope.GroupTypeList = data;
                        });
                    }
                })
            }
        }
        $scope.Cancel_PatientEdit = function () {
            if ($scope.PageParameter == 2) {
                $scope.currentTab = "1";
                $location.path("/PatientList/3");
                $scope.ClearPopUp();
            }
            else if ($scope.PageParameter == 1) {
                $scope.Id = $routeParams.Id;
                $window.localStorage['CurrentTabId'] = $scope.currentTab;
                //$scope.Admin_View($scope.MenuTypeId);
                $location.path("/PatientView/" + $scope.Id + "/1" + "/3");
            }
            else if ($scope.PageParameter == 0) {
                $window.localStorage['CurrentTabId'] = $scope.currentTab;
                $scope.Id = $routeParams.Id;
                $location.path("/PatientView/" + $scope.Id + "/0" + "/3");
            }
        }
        $scope.Cancel_PatientData_Edit = function () {
            $scope.Id = $routeParams.Id;
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $location.path("/PatientView/" + $scope.Id + "/1" + "/3");
        }
        $scope.Cancel_PatientAppproval_Edit = function () {
            $scope.Id = $routeParams.Id;
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $location.path("/PatientView/" + $scope.Id + "/0" + "/3");
        }
        $scope.EditPatientData = function () {
            //$scope.Admin_View($scope.MenuTypeId);
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $scope.Id = $routeParams.Id;
            $location.path("/PatientEdit/" + $scope.Id + "/1" + "/3/4");
        }
        $scope.EditCurrentTab = '1';
        if ($scope.PageParameter == 1) {
            $scope.EditCurrentTab = $window.localStorage['CurrentTabId'];
        }
        else {
            $window.localStorage['CurrentTabId'] = 1;
        }

        //$scope.Active_PatientApproval = function () {
        //    var msg = confirm("Do you like to Approve the Patient?");
        //    if (msg == true) {
        //        $http.get(baseUrl + '/api/PatientApproval/PatientApproval_Active/?Id=' + $routeParams.Id).success(function (data) {
        //            alert(data.Message);
        //            $location.path("/PatientApproval");
        //        }).error(function (data) {
        //            $scope.error = "AN error has occured while deleting patient approval records" + data;
        //        });
        //    }
        //};

        $scope.EditPatientData_Approval = function () {
            //$scope.Admin_View($scope.MenuTypeId);
            $window.localStorage['CurrentTabId'] = $scope.currentTab;
            $scope.Id = $routeParams.Id;
            $location.path("/PatientEdit/" + $scope.Id + "/0" + "/3/4");
        }


        $scope.MoreInfoPopup = function () {
            $scope.Remarks = "";
            angular.element('#MoreInfoModal').modal('show');
        }
        $scope.Cancel_MoreInfoPopup = function () {
            $scope.Remarks = "";
            angular.element('#MoreInfoModal').modal('hide');
        }
        $scope.Patient_Approval_Id = "0";
        $scope.PatientApproval_History_Insert = function () {
            if (typeof ($scope.Remarks) == "undefined" || $scope.Remarks == "") {
                alert("Please enter Remarks");
                return false;
            }
            else {
                var obj = {
                    Id: $scope.Patient_Approval_Id,
                    Patient_Id: $routeParams.Id,
                    Remarks: $scope.Remarks,
                    Created_By: $window.localStorage['UserId']
                };
                $http.post(baseUrl + '/api/PatientApproval/PatientApproval_History_Insert/', obj).success(function (data) {
                    if (data == 1) {
                        //alert("Patient Approval History Inserted Successfully");
                        //location.href = 'mailto:' + $scope.EmailId;
                        $scope.Cancel_MoreInfoPopup();
                        $location.path("/PatientApproval");
                    }
                });
            }
        }

        /** Check All Functions for Businner users Group **/
        $scope.BuisnessUsercheckAll = function () {
            if ($scope.SelectedAllBuisnessUser == true) {
                $scope.SelectedAllBuisnessUser = true;
            } else {
                $scope.SelectedAllBuisnessUser = false;
            }
            angular.forEach($scope.BusinessUserFilter, function (row) {
                if (row.UserType_Id != 7)
                    row.SelectedBuisnessuser = $scope.SelectedAllBuisnessUser;
            });
        };

        /**Buisness User Update Assigned Group**/
        $scope.SelectedBuisnessuser = $window.localStorage['UserId'];
        $scope.BuisnessuserAssignGroup = function () {
            var cnt = ($filter('filter')($scope.BusinessUserFilter, 'true')).length;
            if (cnt == 0) {
                alert("Please select atleast one Business User to Assign Group");
            }
            else if (typeof ($scope.AssignedGroup) == "undefined" || $scope.AssignedGroup == "0") {
                alert("Please select Group");
                return false;
            }
            else {
                $scope.AssignedGroupList = [];
                angular.forEach($scope.BusinessUserFilter, function (SelectedBuisnessuser, index) {
                    if (SelectedBuisnessuser.SelectedBuisnessuser == true) {
                        var AssignGroupobj = {
                            Id: $scope.AssignedGroup_Id,
                            Group_Id: $scope.AssignedGroup.toString(),
                            User_Id: SelectedBuisnessuser.Id
                        };
                        $scope.AssignedGroupList.push(AssignGroupobj);
                    }
                });
                $http.post(baseUrl + '/api/User/AssignedGroup_Insert/', $scope.AssignedGroupList).success(function (data) {
                    $scope.AssignedGroup = "";
                    if (data == 1) {
                        alert("Group updated successfully");

                        $scope.ClearUserGroupPopup();
                        //$scope.AssignedGroup="0";
                        $scope.BusinessUser_List(2);
                    }
                });
            }
        }

        $scope.ClearUserGroupPopup = function () {
            $scope.AssignedGroup = "0";
            $scope.SelectedAllBuisnessUser = false;
            angular.forEach($scope.BusinessUserFilter, function (SelectedBuisnessuser, index) {
                SelectedBuisnessuser.SelectedBuisnessuser = false;
            });
        }
        $scope.Active_PatientApproval = function () {
            $scope.ApprovedPatientList = [];
            var msg = confirm("Do you like to Approve the Patient?");
            if (msg == true) {
                var ApprovePatientobj = {
                    Patient_Id: $routeParams.Id
                };
                $scope.ApprovedPatientList.push(ApprovePatientobj);
                $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).success(function (data) {
                    alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        $location.path("/PatientApproval");
                    }
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting patient approval records" + data;
                });
            }
        };
    }
]);


/* THIS IS FOR INSTITUTION SUBSCRIPTION HOSPITAL ADMIN FUNCTION*/
MyCortexControllers.controller("InstitutionHospitalAdminController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
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
            $http.get(baseUrl + '/api/Institution/Institution_GetPhoto/?Id=' + $scope.InstituteId).success(function (data) {
                if (data.PhotoBlob != null) {
                    $scope.uploadme = 'data:image/png;base64,' + data.PhotoBlob;
                }
                else {
                    $scope.uploadme = null;
                }
            })
            $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $scope.InstituteId).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Institution_Name = data.Institution_Name;
                $scope.INSTITUTION_SHORTNAME = data.INSTITUTION_SHORTNAME;
                $scope.Address1 = data.Institution_Address1;
                $scope.Address2 = data.Institution_Address2;
                $scope.Address3 = data.Institution_Address3;
                $scope.ZipCode = data.ZipCode;
                $scope.Email = data.Email;
                $scope.CountryId = data.CountryId.toString();
                $scope.CountryDuplicateId = $scope.CountryId;
                $scope.CountryFlag = true;
                //$scope.Country_onChange();           
                $scope.ViewCountryName = data.CountryName;
                //   $scope.CountryBased_StateFunction();
                $scope.StateNameId = data.StateId.toString();
                $scope.StateDuplicateId = $scope.StateNameId;
                $scope.StateFlag = true;

                //$scope.State_onChange();
                //  $scope.StateBased_CityFunction();
                $scope.ViewStateName = data.StateName;
                $scope.LocationNameId = data.CityId.toString();
                $scope.LocationDuplicateId = $scope.LocationNameId;
                $scope.CityFlag = true;
                if (DropDownListValue == 1) {
                    $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                        $scope.CountryNameList = data;
                        if ($scope.CountryFlag == true) {
                            $scope.CountryId = $scope.CountryDuplicateId;
                            $scope.CountryFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    });
                    $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + data.CountryId.toString()).success(function (data) {
                        $scope.StateName_List = data;
                        if ($scope.StateFlag == true) {
                            $scope.StateNameId = $scope.StateDuplicateId;
                            $scope.StateFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
                        }
                    });
                    $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + data.CountryId.toString() + '&StateId=' + data.StateId.toString()).success(function (data) {
                        //$scope.LocationName_List =data ;    
                        $scope.LocationName_List = data;
                        if ($scope.CityFlag == true) {
                            $scope.LocationNameId = $scope.LocationDuplicateId;
                            $scope.CityFlag = false;
                            $scope.loadCount = $scope.loadCount - 1;
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


        $scope.EditInstitutionHospitalAdmin = function () {
            //$scope.InstitutionDetails_View();
            $scope.DropDownListValue = 1;
            $location.path("/EditInstitutionHospitalAdmin");
        };


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
        $scope.StateClearFunction = function () {
            $scope.StateNameId = "0";
        };

        $scope.StateBased_CityFunction = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CountryId + '&StateId=' + $scope.StateNameId).success(function (data) {
                    $scope.LocationName_List = data;
                    if ($scope.CityFlag == true) {
                        $scope.LocationNameId = $scope.LocationDuplicateId
                    }
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
                alert("Please enter Institution Name");
                return false;
            }
            else if (typeof ($scope.INSTITUTION_SHORTNAME) == "undefined" || $scope.INSTITUTION_SHORTNAME == "") {
                alert("Please enter Short Name");
                return false;
            }
            else if (typeof ($scope.Email) == "undefined" || $scope.Email == "") {
                alert("Please enter Email");
                return false;
            }
            else if (EmailFormate($scope.Email) == false) {
                alert("Invalid email format");
                return false;
            }
            else if (typeof ($scope.CountryId) == "undefined" || $scope.CountryId == "0") {
                alert("Please select Country");
                return false;
            }
            else if (typeof ($scope.StateNameId) == "undefined" || $scope.StateNameId == "0") {
                alert("Please select State");
                return false;
            }
            else if (typeof ($scope.LocationNameId) == "undefined" || $scope.LocationNameId == "0") {
                alert("Please select City");
                return false;
            }
            if ($scope.uploadme != "") {
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
                    alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico");
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
                $http.post(baseUrl + '/api/Institution/Institution_AddEdit/', obj).success(function (data) {
                    var insId = data.Institute[0].Id;

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
                            .success(function (response) {
                                if ($scope.FileName == "") {
                                    $scope.InstitutionLogo = "";
                                }
                                else if (itemIndexLogo > -1) {
                                    if ($scope.FileName != "" && response[itemIndexLogo] != "") {
                                        $scope.InstitutionLogo = response[itemIndexLogo];
                                    }
                                }
                                $http.get(baseUrl + '/Home/LoginLogoDetails/').success(function (resImage) {
                                    document.getElementById("InstLogo").src = resImage[0];
                                    alert(data.Message);
                                    $scope.CancelInstitutionHospitalAdmin();
                                }).error(function (response) {
                                    $scope.Photo = "";
                                });
                            })
                            .error(function (response) {
                                $scope.Photo = "";
                            });
                    }
                    else {
                        alert(data.Message);
                        $scope.CancelInstitutionHospitalAdmin();
                    }
                    $("#InstitutionLogo").val('');
                })
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

    }

]);

/* THIS IS FOR INSTITUTION SUBSCRIPTION HOSPITAL ADMIN CONTROLLER FUNCTION */
MyCortexControllers.controller("InstitutionSubscriptionHospitalAdminController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {

        //Declaration and initialization of Scope Variables.
        $scope.ChildId = 0;
        $scope.Institution_Id = "0";
        $scope.Health_Care_Professionals = "";
        $scope.Patients = "";
        $scope.Contract_Period_From = "";
        $scope.Contract_Period_To = "";
        $scope.Subscription_Type = "1";
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.InstitutionViewList = [];
        $scope.IsActive = true;

        /* on click view, view popup opened*/
        $scope.ViewInstitution = function () {
            $scope.InstitutionDetails_View();
            alert("test");
            $location.path("/InstitutionHospitalAdmin_view/" + $scope.InstituteId);
        };

        // This is for to get Institution Modiule List 
        //$http.get(baseUrl + '/api/InstitutionSubscription/ModuleNameList/').success(function (data) {
        //    // only active Country    
        //    $scope.InstitutiontypeList = data;
        //});

        /*on click Save calling the insert update function for Institution Subscription */
        $scope.InstitutionAddList = [];
        $scope.InstitutionAddLanguageList = [];
        $scope.InstitutionModule_List = [];
        $scope.InstitutionLanguage_List = [];
        $scope.InstitutionChildList = [];
        /*THIS IS FOR View FUNCTION*/
        $scope.InstitutionSubscriptionDetails_View = function () {
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/InstitutionSubscription/InstitutionSubscriptionActiveDetails_View/?Id=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = data.Id;
                $scope.InstitutiontypeList = data.Module_List;
                $scope.InstitutionChildList = data.ChildModuleList;
                $scope.LanguageList = data.Language_List;
                $scope.InstitutionLanguageList = data.ChildLanguageList;
                $scope.Institution_Id = data.Institution_Id.toString();
                $scope.ViewInstitution_Name = data.Institution.Institution_Name;
                $scope.Email = data.Institution.Email;
                $scope.Address1 = data.Institution.Institution_Address1;
                $scope.Address2 = data.Institution.Institution_Address2;
                $scope.Address3 = data.Institution.Institution_Address3;
                $scope.ZipCode = data.Institution.ZipCode;
                $scope.Country = data.Institution.CountryName;
                $scope.State = data.Institution.StateName;
                $scope.City = data.Institution.CityName;
                $scope.Contract_Period_From = $filter('date')(data.Contract_PeriodFrom, "dd-MMM-yyyy");
                $scope.Health_Care_Professionals = data.Health_Care_Professionals;
                $scope.Patients = data.No_Of_Patients;
                $scope.Contract_Period_To = $filter('date')(data.Contract_PeriodTo, "dd-MMM-yyyy");
                $scope.Subscription_Type = data.Subscription_Type;
                $scope.InsSub_Id = data.SubscriptionId;

                angular.forEach($scope.InstitutiontypeList, function (item, modIndex) {
                    if ($ff($scope.InstitutionChildList, function (value) {
                        return value.ModuleId == item.Id;
                    }).length > 0) {
                        $scope.InstitutionAddList[modIndex] = true;
                    }
                    else {
                        $scope.InstitutionAddList[modIndex] = false;
                    }
                })

                angular.forEach($scope.LanguageList, function (item, modIndex) {

                    if ($ff($scope.InstitutionLanguageList, function (value) {
                        return value.LanguageId == item.Id;
                    }).length > 0) {
                        $scope.InstitutionAddLanguageList[modIndex] = true;
                    }
                    else {
                        $scope.InstitutionAddLanguageList[modIndex] = false;
                    }
                })
            });
        };

    }
]);

MyCortexControllers.controller("AllergyMasterList", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {

        $scope.AllergyMasterflag = 0;
        $scope.AllergyMasterIsActive = true;

        $scope.AllergyMasteremptydata = [];
        $scope.AllergyMasterListData = [];

        $scope.Institution_Id = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

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
            $scope.AllergyMasterList_Details();
        }

        $scope.AllergyMasterList_Details = function () {
            $("#chatLoaderPV").show();
            $scope.ISact = 1;       // default active
            if ($scope.AllergyMasterIsActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.AllergyMasterIsActive == false) {
                $scope.ISact = 0 //all
            }

            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.page_size = data1[0].ConfigValue;
                $scope.PageStart = (($scope.current_page - 1) * ($scope.page_size)) + 1;
                $scope.PageEnd = $scope.current_page * $scope.page_size;
                $http.get(baseUrl + '/api/User/AllergtMaster_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + $scope.Institution_Id + '&StartRowNumber=' + $scope.PageStart +
                    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.AllergyMasteremptydata = [];
                        $scope.AllergyMasterListData = [];
                        $scope.AllergyMasterListData = data;
                        $scope.AllergyCount = $scope.AllergyMasterListData[0].TotalRecord;
                        $scope.AllergyMasterListFilterData = data;
                        $scope.AllergyMasterList = angular.copy($scope.AllergyMasterListData);
                        if ($scope.AllergyMasterList.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        $scope.Allergt_pages = Math.ceil(($scope.AllergyCount) / ($scope.page_size));

                    })
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        };

        /*  This is for Allergy searchquery*/
        $scope.filterAllergyMasterList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.AllergyMastersearchquery);
            if ($scope.AllergyMastersearchquery == "") {
                $scope.AllergyMasterList = angular.copy($scope.AllergyMasterListFilterData);
            }
            else {
                var val;
                $scope.AllergyMasterList = $ff($scope.AllergyMasterListFilterData, function (value) {
                    return angular.lowercase(value.AllergyTypeName).match(searchstring) ||
                        angular.lowercase(value.AllergenName).match(searchstring);
                });
                if ($scope.AllergyMasterList.length > 0) {
                    $scope.AllergyMasterflag = 1;
                }
                else {
                    $scope.AllergyMasterflag = 0;
                }
            }
        }
    }
]);

MyCortexControllers.controller("UserHealthDataDetailsController", ['$scope', '$sce', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$interval',
    function ($scope, $sce, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $interval) {
        if (chatService.checkCall($routeParams.Id)) {
            alert('You cannot switch patient during call.')
            $window.history.back();
            return false;
        }
        $scope.SearchMsg = "No Data Available";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.LiveDataCurrentTime = "";
        $scope.PatientLiveDataList = [];
        $scope.PatientType = 1;
        $scope.LiveTabClick = function () {
            $('.chartTabs').addClass('charTabsNone');
            if ($scope.LiveDataCurrentTime == "") {
                $scope.LiveDataCurrentTime = $filter('date')(new Date(), "dd-MMM-yyyy hh:mm:ss a");
            }

            //Initialize the Timer to run every 10000 milliseconds i.e. 10 second.
            $scope.LiveDataPromise = $interval(function () {
                $http.get(baseUrl + '/api/User/PatientLiveData_List/?Patient_Id=' + $scope.SelectedPatientId + '&DataTime=' + $scope.LiveDataCurrentTime + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    $scope.PatientLiveDataList = angular.copy(data.PatientHealthDataList);
                    //    $scope.SearchMsg="No Live data";
                })
            }, 10000) // 10000 ms execution

            /*cancel timer
            
            if (angular.isDefined($scope.LiveDataPromise)) {
                $interval.cancel($scope.LiveDataPromise);
            }
            */
        }
        $scope.CancelLiveData = function () {
            if (angular.isDefined($scope.LiveDataPromise)) {
                $interval.cancel($scope.LiveDataPromise);
            }
        }
        $scope.LiveData_IsImage = function (FileName) {
            var file = FileName;
            var fileType = file.substr((file.lastIndexOf('.') + 1));
            var validImageTypes = ["gif", "jpeg", "png", "jpg", "ico", "gif"];
            if ($.inArray(fileType, validImageTypes) >= 0) {
                return true;
            }
            else { return false; }
        }

       

        $scope.flag = 0;
        $scope.MNR_No = "";
        $scope.Type_Id = 0;
        $scope.LSType_Id = 0;
        $scope.VitalsType_Id = 0;
        $scope.VitalChart = '1';
        $scope.PatientHealthDataTableList = [];
        // $scope.Mode = $routeParams.Id;
        $scope.AppointmentFromTime = new Date();
        $scope.AppointmentToTime = new Date();
        $scope.Doctor_Id = "";
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.allergyActive = true;
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        // $scope.ParamGroup_Id=2;    
        $scope.GroupParameterNameList = [];
        $scope.VitalsParameterList_Data = [];
        $scope.LabParameterList_Data = [];
        $scope.ParameterId = "0";
        $scope.getParameterList = function () {
            $http.get(baseUrl + '/api/User/GroupParameterNameList/?Patient_Id=' + $scope.SelectedPatientId + '&UnitGroupType_Id=' + $scope.unitgrouptype).success(function (data) {
                $scope.GroupParameterNameList = data;

            });
        }

        // editable time value from app settings
        $scope.PATIENTDATA_EDITTIME = 0;
        $scope.ConfigCode = "PATIENTDATA_EDITTIME";
        $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data) {
            if (data[0] != undefined) {
                $scope.PATIENTDATA_EDITTIME = parseInt(data[0].ConfigValue);
            }
        });
        // is editale check based on allowed editable time configuration
        $scope.IsEditableCheck = function (itemDate) {
            var diffminutes = moment().diff(moment(itemDate), 'minutes');
            if ($scope.PATIENTDATA_EDITTIME < diffminutes) {
                return false;
            }
            else {
                return true;
            }
        }

        $scope.PageParameter = $routeParams.PageParameter;
        if ($routeParams.PageParameter == "1") {
            $scope.SelectedPatientId = $window.localStorage['UserId'];
        }
        else {
            $scope.SelectedPatientId = $routeParams.Id;
        }
        $window.localStorage['SelectedPatientId'] = $scope.SelectedPatientId;

        $scope.PatientToTrans_CancelPopup = function () {
            //For Today Appointment Page
            $location.path("/TodaysAppoint_ments/");
        }

        $scope.CGAddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/1");
        }

        $scope.AddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/2");
        }

        $scope.AddPatientHomePopup = function () {
            $location.path("/Carecoordinatorpatient/4");
        }


        $scope.searchDoctor = function () {
            angular.element('#searchDoctor').modal('show');
        }
        $scope.ParameterSettingslist = [];
        /*ARRAY LIST FOR THE CHILD TABLE CUSTOMER DETAILS */
        $scope.ParameterSettingslist = [{
            'Id': 0,
            'Protocol_Id': 0,
            'ProtocolName': '',
            'Institution_Id': 0,
            'Institution_Name': '',
            'Parameter_Id': 0,
            'ParameterName': '',
            'Units_Id': 0,
            'UnitsName': '',
            'Com_DurationType': 0,
            'DurationName': '',
            'Diag_HighMax_One': '',
            'Diag_HighMin_One': '',
            'Diag_MediumMax_One': '',
            'Diag_MediumMin_One': '',
            'Diag_LowMax_One': '',
            'Diag_LowMin_One': '',
            'Diag_HighMax_Two': '',
            'Diag_HighMin_Two': '',
            'Diag_MediumMax_Two': '',
            'Diag_MediumMin_Two': '',
            'Diag_LowMax_Two': '',
            'Diag_LowMin_Two': '',
            'Comp_Duration': '',
            'Comp_High': '',
            'Comp_Medium': '',
            'Comp_Low': '',
            'Isactive': 1,
            'Created_By': '',
            'NormalRange_High': '',
            'NormalRange_Low': ''
        }];

        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.ParameterSettingslist1 = [];
        $http.get(baseUrl + 'api/ParameterSettings/ViewEditProtocolParameters/?Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.ViewParamList = data;
        });
        $scope.ParameterSettings_ViewEdit = function () {

            angular.forEach($scope.ParameterSettingslist, function (masterVal, masterInd) {
                $scope.ViewParamList1 = $ff($scope.ViewParamList, { Parameter_ID: masterVal.Parameter_Id }, true);

                if ($scope.ViewParamList1.length > 0) {
                    angular.forEach($scope.ViewParamList1, function (masterVal1, masterInd1) {

                        masterVal.NormalRange_High = masterVal1.NormalRange_High;
                        masterVal.NormalRange_Low = masterVal1.NormalRange_low;
                    })
                }

                else {
                    masterVal.NormalRange_High = "";
                    masterVal.NormalRange_Low = "";

                };

            });
        };


        $scope.ProtocolDetails_View = function () {
            if ($scope.assignedProtocolId == "" || typeof ($scope.assignedProtocolId) == undefined) {
                alert("Monitoring Protocol is not assigned");
            }
            else {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/User/ProtocolMonitoringProtocolView/?Id=' + $scope.assignedProtocolId).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.PROTOCOLNAME = data.Protocol_Name;
                    $scope.ParameterSettingslist = data.ChildModuleList;

                    if ($scope.ParameterSettingslist.length > 0) {
                        angular.element('#MonitoringProtocolCreateModal').modal('show');
                    }
                    else {
                        alert("Monitoring protocol is not assigned");
                    }
                });
            }
        }
        /*Open the monitoring protocol */
        $scope.openProtocol = function () {

            $scope.ProtocolDetails_View();
        }
        /*Cancel the monitoring protocol */
        $scope.CancelProtocol = function () {
            angular.element('#MonitoringProtocolCreateModal').modal('hide');
        }

        $scope.PatientAppointmentpopup = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }

        $scope.CancelPatientAppointment = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }

        $scope.PatientDetailsView = function () {
            if ($scope.PageParameter == 1) {
                //Patient data page to Patient View profile
                $location.path("/PatientView/" + $scope.Id + "/1/3");
            }
            else if ($scope.PageParameter == 2) {
                //Doctor Pages -> Patient Data pages -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/3/3");
            }
            else if ($scope.PageParameter == 3) {
                $location.path("/PatientView/" + $scope.Id + "/4/3");
            }
            else if ($scope.PageParameter == 4) {
                //Doctor Pages -> All Patients -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/5/3");
            }
            else if ($scope.PageParameter == 5) {
                //Care Coordinator ->Diagostic Alert -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/6/3");
            }
            else if ($scope.PageParameter == 6) {
                //Care Coordinator ->Compliance Alert -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/7/3");
            }
            else if ($scope.PageParameter == 7) {
                //Care Giver ->Assigned Patient -> Patient View page
                $location.path("/PatientView/" + $scope.Id + "/8/3");
            }
        }

        $scope.EditPatientDetails = function () {
            $location.path("/PatientEdit/" + $scope.Id + "/1/3");
        }

        $scope.PatientGroupList = function () {
            $scope.PatientGroupNameList();
            angular.element('#PatientGroupListModal').modal('show');
        }
        $scope.PatientGroupflag = 0;
        $scope.GroupName_List = [];
        /*This function is for List the Group Name based on UserId*/
        $scope.PatientGroupNameList = function () {
            $http.get(baseUrl + '/api/User/PatientGroupNameList/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                $scope.GroupName_List = data;
                $scope.SearchMsg = "No Data Available";

            })
        };

        $scope.PatientAllergiesList = function (row) {
            $scope.data = row;
            if ($scope.data.length == 0) {
                angular.element('#PatientAllergyListModal').modal('hide');
            }
            else {
                $scope.PatientAllergiesNameList();
                angular.element('#PatientAllergyListModal').modal('show');
            }
        }

        //$scope.PatientAllergiesNameList = function () {
        //    $scope.PatientId = $window.localStorage['UserId'];
        //    $http.get(baseUrl + '/api/User/PatientAllergiesNameList/?PatientId=' + $scope.PatientId).success(function (data) {
        //        $scope.AllergiesName_List = data;
        //    })
        //};

        $scope.CancelPatientGroupNamePopup = function () {
            angular.element('#PatientGroupListModal').modal('hide');

        };

        $scope.CancelPatientAllergyNamePopup = function () {
            angular.element('#PatientAllergyListModal').modal('hide');
        }

        $scope.PatientEditProfileCancel = function () {
            $location.path("/Carecoordinatorpatient/Id");
        }
        $scope.MonitoringProtocolId = "";
        $scope.Monitoring_ProtocolId = "";
        $scope.assignedProtocolId = "";
        ``
        var photoview = false;
        $scope.uploadview = false;
        $scope.unitgrouptype = 1;
        $scope.UnitGroupTypeList = [];
        $scope.MyAppoinmentdata = [];
        $scope.MyAppointment = [];

        $scope.getUnitGroupType_List = function () {
            $http.get(baseUrl + '/api/Common/getUnitGroupType/').success(function (data) {
                $scope.UnitGroupTypeList = data;
            });

        }
        $scope.UnitGroupPreference = function () {
            //$http.get(baseUrl + '/api/ParameterSettings/UnitGroupPreferenceGet/?institutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
            //    $scope.unitgrouptype = data.PreferenceType;
            //})

        }

        $scope.MyAppointments = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/DoctorAppoinmentsList/?PatientId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                //var Patient = parseInt(window.localStorage['SelectedPatientId']);
                $scope.MyAppoinmentdata = data;
                //angular.forEach($scope.MyAppoinmentdata, function (value, index) {
                //    if (Patient === value.Patient_Id) {
                //        $scope.MyAppointment.push(value);
                //    }
                //});
            });
            $http.get(baseUrl + '/api/User/Chronic_Conditions/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                if (data.length !== 0) {
                    $('#chronic').show();
                    var Chronic_Condition = document.getElementById('Chronic_Condition');
                    let innerHtmlData = ""
                    for (let i = 0; i < data.length; i++) {
                        innerHtmlData = innerHtmlData + "<li>" + data[i].ChronicCondition + "</li>";
                    }
                    Chronic_Condition.innerHTML = innerHtmlData;
                } else {
                    $('#chronic').hide();
                }
            });
        }

        $scope.PatientBasicDetails_List = function () {
            $("#chatLoaderPV").show();
            photoview = true;
            var methodcnt = 2;
            $http.get(baseUrl + '/api/User/UserDetails_GetPhoto/?Id=' + $scope.SelectedPatientId).success(function (data) {
                methodcnt = methodcnt - 1;
                if (methodcnt == 0)
                    $scope.uploadview = true;
                if (data.PhotoBlob != null) {
                    $scope.uploadme = 'data:image/png;base64,' + data.PhotoBlob;
                }
                else {
                    $scope.uploadme = null;
                }
            })
            $http.get(baseUrl + '/api/User/PatientBasicDetailsList/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.Id = data.PatientId;
                $scope.FullName = data.FullName;
                $scope.MobileNo = data.MOBILE_NO;
                $scope.Photo = data.Photo;
                $scope.FileName = data.FileName;
                $scope.DOB = $filter('date')(data.DOB, "dd-MMM-yyyy");
                $scope.MNR_No = data.MNR_NO;
                $scope.NationalId = data.NATIONALID;
                $scope.GenderId = data.GenderId;
                $scope.ViewGenderName = data.GENDER_NAME;
                $scope.PatientType = data.Patient_Type;
                $scope.showUserType = data.UserType;
                $scope.PhotoBlobs = data.PhotoBlobs;
                methodcnt = methodcnt - 1;
                $('#User_id').show();
                $('#patient_profile').show();
                var imgSrc = document.getElementById('imgSrc');
                imgSrc.src = $scope.PhotoBlobs;
                var NATIONALITY_ID = document.getElementById('NATIONALITY_ID');
                NATIONALITY_ID.textContent = $scope.NationalId;

                var USERTYPE_ID = document.getElementById('USERTYPE_ID');
                USERTYPE_ID.textContent = $scope.showUserType;
                var MOBILE_NO = document.getElementById('MOBILE_NO');
                MOBILE_NO.textContent = $scope.MobileNo;

                var DOB = document.getElementById('DOB');
                $scope.DOB = moment($scope.DOB).format('DD-MMM-YYYY')
                DOB.textContent = $scope.DOB;

                var fullname = document.getElementById('fullname');
                fullname.textContent = $scope.FullName;

                var Gender = document.getElementById('Gender');
                Gender.textContent = $scope.ViewGenderName;

                var dob = $scope.DOB;
                var gt = DateFormat(dob);
                dob = gt.replace(/-/gi, '');
                var year = dob.substr(4, 9);
                var month = dob.substr(2, 2);
                var day = dob.substr(0, 2);
                var today = new Date();
                var age = today.getFullYear() - year;

                Age = document.getElementById('Age');
                Age.textContent = age.toString();
                if (methodcnt == 0)
                    $scope.uploadview = true;
                if ($scope.PatientType == 2) {
                    $('#divPatientType').attr('style', 'display : none');
                }
                else
                    $('#divPatientType').attr('style', 'display : none');
                if (data.Protocol_Id != null) {
                    $scope.MonitoringProtocolId = data.Protocol_Id.toString();
                    $scope.ViewProtocolName = data.ProtocolName;
                    $scope.assignedProtocolId = $scope.MonitoringProtocolId;
                    $scope.Monitoring_ProtocolId = $scope.MonitoringProtocolId;
                }
                if ($scope.UserTypeId != 2) {
                    $scope.chattingWith = data.FullName;
                }
            });
        }

        $scope.myMeetingURL = '';
        $scope.myMeeting = function (meetingdomain) {
            var key = "";

            var obj =
            {
                name: "conference38",
                username: "appsAdmin",
                key : "ab3049da9a0cd8d6e8b7c62586752472"
            }

            $http.post('https://mymeeting.mycortex.ca/apps/apiservice/api/getconferencedetails', obj).success(function (data) {
                if (data == "Conference not available") {
                    var objAdd =
                    {
                        "action": "Add",
                        "username": "appsAdmin",
                        "key": "ab3049da9a0cd8d6e8b7c62586752472",
                        "name": "conference38",
                        "audio": "on",
                        "video": "off",
                        "chat": "off",
                    }
                    $http.post('https://mymeeting.mycortex.ca/apps/apiservice/api/videoConfSettings', objAdd).success(function (data) {
                        if (data.status == "Added") {
                            var objAdd =
                            {
                                "action": "changeConferenceMode",
                                "username": "appsAdmin",
                                "key": "ab3049da9a0cd8d6e8b7c62586752472",
                                "name": "conference38",
                                "conferenceMode": "on"
                            }
                            $http.post('https://mymeeting.mycortex.ca/apps/apiservice/api/videoConfSettings', objAdd).success(function (data) {
                                if (data.status != "") {
                                    key = data.hashKey;
                                    if (meetingdomain == 1) {
                                        url = 'https://mymeeting.mycortex.ca/meeting/?key=' + key;
                                    } else if (meetingdomain == 2) {
                                        url = 'https://mycortex.livebox.co.in/meeting/?key=' + key;
                                    }
                                    $scope.myMeetingURL = $sce.trustAsResourceUrl(url);
                                    angular.element('#ViewMyMeetingModal').modal('show');
                                    //window.open(url);
                                }
                            });
                        }
                    });
                }
                else {
                    key = data.Hashkey;
                    if (meetingdomain == 1) {
                        url = 'https://mymeeting.mycortex.ca/meeting/?key=' + key;
                    } else if (meetingdomain == 2) {
                        url = 'https://mycortex.livebox.co.in/meeting/?key=' + key;
                    }
                    $scope.myMeetingURL = $sce.trustAsResourceUrl(url);
                    angular.element('#ViewMyMeetingModal').modal('show');
                    // window.open(url);
                }
               
            }).error(function (data) {
                $scope.error = "Error: " + data;
            });
        }

        $scope.CancelMyMeeting = function () {
            $scope.myMeetingURL = '';
            angular.element('#ViewMyMeetingModal').modal('hide');
        }

        $scope.HelathDataList = [];

        $scope.DayDetailsList = function (TabClicked) {
            $scope.Type_Id = 1;
            $scope.ActivitiesDaysClick(TabClicked, 1);

        }
        $scope.WeeKDetailsList = function (TabClicked) {
            $scope.Type_Id = 2;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }
        $scope.OneWeekDetailsList = function (TabClicked) {
            $scope.Type_Id = 3;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }

        $scope.ThreeMonthDetailsList = function (TabClicked) {
            $scope.Type_Id = 4;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }
        $scope.OneYearKDetailsList = function (TabClicked) {
            $scope.Type_Id = 5;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }

        $scope.FromYearDetailsList = function (TabClicked) {
            $scope.Type_Id = 6;
            $scope.ActivitiesDaysClick(TabClicked, 1);
        }
        $scope.AllDetailsList = function (TabClicked, ChartORData) {
            $scope.Type_Id = 7;
            $scope.ActivitiesDaysClick(TabClicked, ChartORData);
        }
        $scope.ActivitiesDaysClick = function (TabClicked, ChartORData) {
            if (TabClicked == "1") {
                $scope.LSType_Id = $scope.Type_Id;
                $scope.ParamGroup_Id = 1;
            }
            else if (TabClicked == "2") {
                $scope.VitalsType_Id = $scope.Type_Id;
                $scope.ParamGroup_Id = 2;
            }
            else if (TabClicked == "3") {
                $scope.VitalsType_Id = $scope.Type_Id;
                $scope.ParamGroup_Id = 3;
            }
            $scope.GeneralFunction($scope.ParamGroup_Id, ChartORData);
        }


        $scope.GeneralFunction = function (ParamGroup_Id, ChartORData) {
            $scope.ParameterList = [];
            $scope.PatientHealthDataChartList = [];
            $scope.ParamGroup_Id = ParamGroup_Id;
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/PatientHealthDataDetails_List/?Patient_Id=' + $scope.SelectedPatientId + '&OptionType_Id=' + $scope.Type_Id + '&Group_Id=' + $scope.ParamGroup_Id + '&Login_Session_Id=' + $scope.LoginSessionId + '&UnitsGroupType=' + $scope.unitgrouptype).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                // only active items for Chart
                if (ChartORData == 1) {
                    $scope.PatientHealthDataChartList = $ff(data.PatientHealthDataList, { IsActive: 1 }, true);
                    $scope.Parameter_List = [];
                    $scope.ParameterChild_List = [];

                    angular.forEach($ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true), function (valueparam, indexparam) {
                        if (valueparam.ParameterParent_Id == "0") {
                            var currentParam = {
                                Id: valueparam.ParameterId,
                                Name: 'Chart' + valueparam.ParameterId,
                                hadChild: valueparam.ParameterHas_Child,
                                ParamName: valueparam.ParameterName,
                                GroupId: valueparam.Group_Id
                            };
                            $scope.Parameter_List.push(currentParam);
                        }
                        else {
                            var currentParamChild = {
                                Id: valueparam.ParameterId,
                                Parent_Id: valueparam.ParameterParent_Id,
                                Name: 'Chart' + valueparam.ParameterId,
                                GroupId: valueparam.Group_Id,
                                ParamName: valueparam.ParameterName,
                            };
                            $scope.ParameterChild_List.push(currentParamChild);
                        }


                    });

                    $scope.PatientHealthRecordDetailsList($ff($scope.Parameter_List, { GroupId: ParamGroup_Id }, true), $scope.PatientHealthDataChartList, $scope.ParameterChild_List);
                }
                // all active&inactive items for tableview/detail view
                else if (ChartORData == 2) {
                    //$scope.PatientHealthDataChartList = data.PatientHealthDataList;
                    $scope.PatientHealthDataChartList = data.PatientHealthDataList;
                    $scope.vitalsFilterAllItem();

                }
            })
        };
        $scope.VitalsIsActive = true;
        $scope.vitalsFilterAllItem = function () {
            $("#chatLoaderPV").show();
            if ($scope.VitalsIsActive == true) {
                // if active   - filter only active        
                //$scope.PatientHealthDataTableList = $filter('orderBy')(angular.copy($ff($scope.PatientHealthDataChartList, {IsActive :1}, true)), 'Id', true);
                $scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($filter('orderBy')(angular.copy($ff($scope.PatientHealthDataChartList, { IsActive: 1 }, true)), 'Id', true)));

            }
            else {
                // if inactive - filter all
                $scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($scope.filterExcludeBMI($filter('orderBy')(angular.copy($scope.PatientHealthDataChartList), 'Id', true))));
            }
            // to refresh sorting
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.PatientHealthDataTableList = angular.copy($scope.PatientHealthDataTableList);
                });
            }, 100);
            angular.forEach($scope.PatientHealthDataTableList, function (value2, index2) {
                $scope.EditVitalRow_EditFlag[index2] = 1;
            });
            $("#chatLoaderPV").hide();
        }
        $scope.filterExcludeBMI = function (rowSet) {
            $scope.localfilterSet = [];
            angular.forEach(rowSet, function (row, rowIndex) {
                if (row.ParameterId != "13")
                    $scope.localfilterSet.push(row);
            });
            return $scope.localfilterSet;
        }


        /* Filter the master list function.*/
        $scope.filterParameterList = function () {
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.PatientHealthDataTableList = [];
                $scope.vitalsFilterAllItem();
            }
            else {
                $scope.PatientHealthDataTableList = $scope.filterExcludeBMI(($filter('orderBy')($ff($scope.PatientHealthDataTableList, function (value) {
                    return angular.lowercase(value.ParameterName).match(searchstring) ||
                        angular.lowercase(value.UOM_Name).match(searchstring) ||
                        angular.lowercase(value.ParameterValue.toString()).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Activity_DateTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.Createdby_FullName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                }), 'Id', true)));
                // to refresh sorting
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.PatientHealthDataTableList = angular.copy($scope.PatientHealthDataTableList);
                    });
                }, 100);
            }

        }

        // are Tabs clicked once    -- 0 not clicked , 1 - clicked
        $scope.LifestyleTab_Clicked = "0";
        $scope.VitalTab_Clicked = "0";
        $scope.LabTab_Clicked = "0";
        $scope.TabClickDataLoad = function (TabClicked) {
            var callFunction = true;
            $('.chartTabs').removeClass('charTabsNone');
            $scope.ParamGroup_Id = 0;
            if (TabClicked == "1" && $scope.LifestyleTab_Clicked == "0") {
                callFunction = false
                $scope.LSType_Id = 2;
                $scope.Type_Id = 2;
                $scope.ParamGroup_Id = 1;
            }
            else if (TabClicked == "2" && $scope.VitalTab_Clicked == "0") {
                callFunction = false;
                $scope.VitalsType_Id = 2;
                $scope.Type_Id = 2;
                $scope.ParamGroup_Id = 2;
                //$scope.getParameterList();
                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
                //console.log($scope.VitalsParameterList_Data);
            }
            else if (TabClicked == "2" && $scope.VitalTab_Clicked == "1") {
                callFunction = false;
                $scope.ParamGroup_Id = 2;
                //$scope.getParameterList();
                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
                //console.log($scope.VitalsParameterList_Data);
            }
            else if (TabClicked == "3" && $scope.LabTab_Clicked == "0") {
                callFunction = false;
                $scope.VitalsType_Id = 2;
                $scope.Type_Id = 2;
                $scope.ParamGroup_Id = 3;
                //$scope.getParameterList();

                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
            }
            else if (TabClicked == "3" && $scope.LabTab_Clicked == "1") {
                callFunction = false;
                $scope.ParamGroup_Id = 3;
                //$scope.getParameterList();

                $scope.VitalsParameterList_Data = $ff($scope.GroupParameterNameList, { Group_Id: $scope.ParamGroup_Id }, true);
            }

            if (callFunction == true) {
                if (TabClicked == "1") {
                    $scope.Type_Id = $scope.LSType_Id;
                }
                else if (TabClicked == "2") {
                    $scope.Type_Id = $scope.VitalsType_Id;
                }
                else if (TabClicked == "3") {
                    $scope.Type_Id = $scope.VitalsType_Id;
                }
            }
            if (callFunction == false) {
                $scope.GeneralFunction($scope.ParamGroup_Id, 1);
                if (TabClicked == "1") {
                    $scope.LifestyleTab_Clicked = "1";
                }
                else if (TabClicked == "2") {
                    $scope.VitalTab_Clicked = "1";
                }
                else if (TabClicked == "3") {
                    $scope.LabTab_Clicked = "1";
                }
            }
        }

        // $scope.getParameterList();
        setTimeout(function () {
        }, 1000);
        setTimeout(function () {
            $scope.$apply(function () {
                // default tab is LifeStyle, and load data for Lifestyle
                $scope.TabClickDataLoad("1");
            });
        }, 1000);

        $scope.PatientHealthRecordDetailsList = function (ParameterList, PatientHealthDataChartList, ParameterChild_List) {
            $scope.XAxisHealthDataSummary = [];
            $scope.HelathDataChartSummary = [];
            $scope.yName = [];
            $scope.SChartTitle = [];
            $scope.ParameterList = [];
            $scope.PatientHealthDataChartList = [];
            $scope.ParameterList = ParameterList;
            $scope.PatientHealthDataChartList = PatientHealthDataChartList;
            $scope.ParameterChild_List = ParameterChild_List;
            $scope.parameterItemsList = [];
            var chartxvalue;
            chartxvalue = 'Days';
            angular.forEach($scope.ParameterList, function (value2, index2) {
                $scope.HelathDataChartSummary = [];
                $scope.HelathDataChartSummaryCollection = [];
                $scope.XAxisHealthDataSummary = [];
                $scope.HelathDataChartSummaryArray = [];
                $scope.HelathDataChartSummaryArrayCollection = [];
                $scope.yName = [];
                $scope.SChartTitle = [];
                $scope.parameterItemsList = [];
                if (value2.hadChild == 1) {
                    $scope.parameterItemsList = $ff($scope.ParameterChild_List, { Parent_Id: value2.Id }, true);
                }
                else {
                    var paramItem = {
                        Id: value2.Id,
                        Parent_Id: 0,
                        Name: value2.Name,
                    };
                    $scope.parameterItemsList.push(paramItem)
                }
                $scope.HelathDataChartSummary = [];
                $scope.HelathDataChartSummaryArray = [];
                $scope.HelathDataChartSummaryCollection = [];
                $scope.XAxisHealthDataSummary = [];
                $scope.XAxisHealthDataSummaryCollection = [];

                $scope.HelathDataChartSummaryArrayCollection = [];
                var minval = 0;
                var maxval = 0;
                var normalRangeTitle = "";
                angular.forEach($scope.parameterItemsList, function (value4, index4) {
                    $scope.HelathDataChartSummary = [];
                    //$scope.XAxisHealthDataSummary = [];
                    angular.forEach($ff($scope.PatientHealthDataChartList, { ParameterId: value4.Id }, true), function (value1, index1) {

                        $scope.HelathDataChartSummary.push(
                            {
                                "name": value4.XAxis,
                                "y": value1.ParameterValue,
                                "ActivityDate": $filter('date')(value1.Activity_DateTime, "dd-MMM-yyyy hh:mm:ss a"),
                                "UOM": value1.UOM_Name,
                                "DeviceType": value1.DeviceType,
                                "DeviceNo": value1.DeviceNo,
                                "TypeName": value1.TypeName,
                                "Createdby_ShortName": value1.Createdby_ShortName,
                            }
                        )
                        $scope.XAxisHealthDataSummary.push(value1.XAxis);

                        if ((value1.ParameterValue < minval && value1.ParameterValue != 0) || minval == 0) {
                            minval = value1.ParameterValue;
                        }
                        if (value1.ParameterValue > maxval && value1.ParameterValue != 0) {
                            maxval = value1.ParameterValue;
                        }
                    })

                    if ($scope.parameterItemsList.length > 1) {
                        $scope.HelathDataChartSummaryCollection.push({
                            name: value4.ParamName,//$ff($scope.GroupParameterNameList, { ParameterId: value4.Id }, true)[0].ParameterName,
                            data: $scope.HelathDataChartSummary,
                        });
                        //lineWidth: 5,
                    }
                    else {
                        $scope.HelathDataChartSummaryCollection = [{
                            name: value2.ParamName,//$ff($scope.GroupParameterNameList, { ParameterId: value4.Id }, true)[0].ParameterName,
                            data: $scope.HelathDataChartSummary
                        }];
                        //lineWidth: 5,
                    }

                })
                // 
                var normalRangeBandMin = 0;
                var normalRangeBandMax = 0;
                $scope.Max_Possible = "";
                $scope.Min_Possible = "";
                $scope.yName = "";
                $scope.SChartTitle = "";
                var bandcolor = "rgba(68, 170, 213, 0.1)";
                var objfil = $ff($scope.GroupParameterNameList, { ParameterId: value2.Id }, true)
                if (objfil.length > 0) {
                    if (objfil[0].ParameterHas_Child == "1") {
                        var currentItem = 0;
                        angular.forEach($ff($scope.GroupParameterNameList, { ParameterParent_Id: value2.Id }, true), function (valchild, indexchild) {
                            if (currentItem != 0 && currentItem < valchild.Average) {
                                normalRangeBandMin = currentItem;
                                normalRangeBandMax = valchild.Average;
                            }
                            else if (currentItem != 0 && currentItem > valchild.Average) {
                                normalRangeBandMin = valchild.Average;
                                normalRangeBandMax = currentItem;
                            }
                            currentItem = valchild.Average;
                        });
                        normalRangeTitle = normalRangeBandMin + "-" + normalRangeBandMax;

                    }
                    else {
                        normalRangeBandMin = objfil[0].Average;
                        normalRangeBandMax = objfil[0].Average;
                        bandcolor = "#292a4d";
                        normalRangeTitle = normalRangeBandMin;
                    }
                }
                if (objfil.length > 0) {
                    $scope.yName = objfil[0].UOM_Name;
                    $scope.SChartTitle = objfil[0].ParameterName;

                    $scope.Max_Possible = objfil[0].Max_Possible;
                    $scope.Min_Possible = objfil[0].Min_Possible;
                }
                if ($scope.Max_Possible == 0) $scope.Max_Possible = maxval;
                if ($scope.Max_Possible == 0) $scope.Min_Possible = minval;

                var tickInterval = 1;
                if ($scope.Max_Possible < tickInterval)
                    tickInterval = $scope.Max_Possible;
                Highcharts.chart(value2.Name, {
                    chart:
                    {
                        zoomType: 'x'
                    },
                    title: {
                        text: $scope.SChartTitle
                    },
                    subtitle: {
                        text: 'Normal Value : ' + normalRangeTitle,
                        align: 'right'
                    },
                    credits: {
                        enabled: false
                    },
                    yAxis: {
                        allowDecimals: false,
                        tickInterval: tickInterval,
                        //startOnTick: true,
                        max: $scope.Max_Possible,
                        min: $scope.Min_Possible,
                        title: {
                            text: $scope.yName
                        },
                        labels: {
                            formatter: function () {
                                return '' + this.value;
                            }
                        },
                        plotBands: [{
                            color: bandcolor, // Color value
                            thickness: '50%',
                            from: normalRangeBandMin, // Start of the plot band
                            to: normalRangeBandMax// End of the plot band
                        }]
                    },
                    xAxis: {
                        type: 'datetime',
                        categories: $scope.XAxisHealthDataSummary,
                    },
                    tooltip: {
                        split: false,
                        //useHtml: true,
                        shared: false,
                        //pointFormat: '<b>{point.ActivityDate}</b> <b>{point.y} {point.UOM}</b>' 

                        formatter: function () {
                            return '<b>' + this.point.ActivityDate + '</b><br/>' +
                                '<b>' + this.point.y + '</b> ' + this.point.UOM + '<br/>' + this.point.DeviceType + ' ' + this.point.DeviceNo
                                + '<br>' + this.point.TypeName + ':' + this.point.Createdby_ShortName;
                        },

                    },
                    series: $scope.HelathDataChartSummaryCollection
                })

            })
        };

        /**
                     * In the chart render event, add icons on top of the circular shapes
                     */
                function renderIcons() {

                    // Move icon
                    if (!this.series[0].icon) {
                        this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
                            .attr({
                                stroke: '#303030',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                'stroke-width': 2,
                                zIndex: 10
                            })
                            .add(this.series[2].group);
                    }
                    this.series[0].icon.translate(
                        this.chartWidth / 2 - 10,
                        this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
                        (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
                    );

                    // Exercise icon
                    if (!this.series[1].icon) {
                        this.series[1].icon = this.renderer.path(
                            ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
                                'M', 8, -8, 'L', 16, 0, 8, 8]
                        )
                            .attr({
                                stroke: '#ffffff',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                'stroke-width': 2,
                                zIndex: 10
                            })
                            .add(this.series[2].group);
                    }
                    this.series[1].icon.translate(
                        this.chartWidth / 2 - 10,
                        this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
                        (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
                    );

                    // Stand icon
                    if (!this.series[2].icon) {
                        this.series[2].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
                            .attr({
                                stroke: '#303030',
                                'stroke-linecap': 'round',
                                'stroke-linejoin': 'round',
                                'stroke-width': 2,
                                zIndex: 10
                            })
                            .add(this.series[2].group);
                    }

                    this.series[2].icon.translate(
                        this.chartWidth / 2 - 10,
                        this.plotHeight / 2 - this.series[2].points[0].shapeArgs.innerR -
                        (this.series[2].points[0].shapeArgs.r - this.series[2].points[0].shapeArgs.innerR) / 2
                    );
                }

        $scope.GoalDataDateBasedDeatailsList = [];
        $scope.HealthDataDateBasedDeatailsList = [];

        $scope.StepCountDateBased = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/PatientDailyGoalData_List/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.GoalDataDateBasedDeatailsList = data.PatientHealthDataList;
                $scope.StepCount_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 1
                }, true)
                $scope.CaloriesExpanded_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 2
                }, true)
                $scope.DistanceCovered_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 3
                }, true)
                $scope.Sleeping_List = $ff($scope.GoalDataDateBasedDeatailsList, {
                    ParameterId: 4
                }, true)
                $scope.ActualStepCountList = [];
                $scope.ActualStepCountRadius = [];
                $scope.ActualDistanceCoveredList = [];
                $scope.ActualDistanceCoveredRadius = [];
                $scope.ActualCaloriesExpandedList = [];
                $scope.ActualCaloriesExpandedRadius = [];
                $scope.ActualHeartRateList = [];
                $scope.ActualHeartRateRadius = [];
                $scope.ActualSleepingList = [];
                $scope.ActualSleepingRadius = [];
                var radiusMaster = 80;
                var radius = radiusMaster;
                var colorIndex = 1;
                var GoalStepCounts;
                var GoalCaloriesExpended;
                var GoalDistanceCovered;
                var GoalHeartRate;
                var GoalSleeping;
                var incValue = 40;
                //angular.forEach($scope.GoalDataDateBasedDeatailsList, function (value, index) {
                angular.forEach($scope.StepCount_List, function (value, index) {
                    var PercentageStepCount = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objStepCount = {
                        name: 'Steps',
                        data: [{
                            color: "#fd950c",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageStepCount,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualStepCountList.push(objStepCount);


                    var objStepCountRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualStepCountRadius.push(objStepCountRadius);
                    GoalStepCounts = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;

                })
                radius = radiusMaster;
                angular.forEach($scope.CaloriesExpanded_List, function (value, index) {
                    var PercentageCaloriesExpanded = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objCaloriesExpanded = {
                        name: 'Calories',
                        data: [{
                            color: "#4aa64e",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageCaloriesExpanded,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualCaloriesExpandedList.push(objCaloriesExpanded);


                    var objCaloriesExpandedRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualCaloriesExpandedRadius.push(objCaloriesExpandedRadius);
                    GoalCaloriesExpanded = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;

                })
                radius = radiusMaster;
                angular.forEach($scope.DistanceCovered_List, function (value, index) {
                    var PercentageDistanceCovered = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objDistanceCovered = {
                        name: 'Distance',
                        data: [{
                            color: "#e63d39",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageDistanceCovered,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualDistanceCoveredList.push(objDistanceCovered);

                    var objDistanceCoveredRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualDistanceCoveredRadius.push(objDistanceCoveredRadius);
                    GoalDistanceCovered = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;

                })
                radius = radiusMaster;
                angular.forEach($scope.Sleeping_List, function (value, index) {
                    var PercentageSleeping = Math.round((value.ParameterValue / value.ParameterTarget) * 100)

                    var objSleeping = {
                        name: 'Sleeping',
                        data: [{
                            color: "#04afc4",
                            radius: radius + incValue + '%',
                            innerRadius: radius + 1 + '%',
                            y: PercentageSleeping,     // convert to percentage for Target
                            yPercent: value.ParameterValue,
                        }]
                    }
                    $scope.ActualSleepingList.push(objSleeping);


                    var objSleepingRadius = { // Track for Stand
                        outerRadius: radius + incValue + '%',
                        innerRadius: radius + 1 + '%',
                        backgroundColor: Highcharts.color("#333")
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }
                    $scope.ActualSleepingRadius.push(objSleepingRadius);
                    GoalSleeping = value.ParameterTarget;
                    radius = radius + incValue;

                    colorIndex = colorIndex + 1;
                    if (colorIndex == 4)
                        colorIndex = 1;
                })

                

                $('#DemoChart').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                        events: {
                            render: renderIcons
                        }
                    },
                    title: {
                        text: 'Activity',
                        style: {
                            fontSize: '24px'
                        }
                    },

                    tooltip: {
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '16px'
                        },
                        valueSuffix: '%',
                        pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15
                            };
                        }
                    },

                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: [{ // Track for Move
                            outerRadius: '112%',
                            innerRadius: '88%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Exercise
                            outerRadius: '87%',
                            innerRadius: '63%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }, { // Track for Stand
                            outerRadius: '62%',
                            innerRadius: '38%',
                            backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
                                .setOpacity(0.3)
                                .get(),
                            borderWidth: 0
                        }]
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: []
                    },

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                enabled: false
                            },
                            linecap: 'round',
                            stickyTracking: false,
                            rounded: true
                        }
                    },

                    series: [{
                            name: 'Move',
                            data: [{
                                color: Highcharts.getOptions().colors[0],
                                radius: '112%',
                                innerRadius: '88%',
                                y: $scope.ActualStepCountList[0]["data"][0].y
                            }]
                        },
                        {
                            name: 'Exercise',
                            data: [{
                                color: Highcharts.getOptions().colors[1],
                                radius: '87%',
                                innerRadius: '63%',
                                y: $scope.ActualCaloriesExpandedList[0]["data"][0].y
                            }]
                        }, {
                            name: 'Stand',
                            data: [{
                                color: Highcharts.getOptions().colors[2],
                                radius: '62%',
                                innerRadius: '38%',
                                y: $scope.ActualDistanceCoveredList[0]["data"][0].y
                            }]
                        }]
                });
                $('#Step_Count').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: "110%"
                    },

                    title: {
                        //text: 'StepCount:' + GoalStepCounts,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },
                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualStepCountRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {
                                    return (`<div class='datalabel'><p class="datalabelh"><i class="fas fa-shoe-prints"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalStepCounts}</p></div>`);
                                },
                            },


                        }
                    },
                    series: $scope.ActualStepCountList

                })
                //${45}/${GoalStepCounts}
                $('#Calories_Expended').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        //text: 'Calories:' + GoalCaloriesExpanded,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualCaloriesExpandedRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {

                                    return (`<div class='datalabel'><p class="datalabelh_rot"><i class="fas fa-dumbbell"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalCaloriesExpanded}</p></div>`);
                                },
                            },


                        }
                    },
                    series:
                        $scope.ActualCaloriesExpandedList
                })

                $('#Distance_Covered').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                    },
                    title: {
                        //text: 'StepCount:' + GoalStepCounts,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },
                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualDistanceCoveredRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {

                                    return (`<div class='datalabel'><p class="datalabelh_rot"><i class="fas fa-burn"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalDistanceCovered}</p></div>`);
                                },
                            },


                        }
                    },
                    series:
                        $scope.ActualDistanceCoveredList
                })
                $('#SleepingChart').highcharts({
                    chart: {
                        type: 'solidgauge',
                        height: '110%',
                    },
                    title: {
                        //text: 'StepCount:' + GoalStepCounts,
                        text: "",
                        style: {
                            fontSize: '12px'
                        }
                    },
                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false,
                        borderWidth: 0,
                        backgroundColor: 'none',
                        shadow: false,
                        style: {
                            fontSize: '8px'
                        },
                        //valueSuffix: '%',
                        //pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',GoalDistanceCovered
                        pointFormat: '<br><span style="font-size:2em; color: blue; font-weight: bold">{point.yPercent}</span>',
                        positioner: function (labelWidth) {
                            return {
                                x: (this.chart.chartWidth - labelWidth) / 2,
                                y: (this.chart.plotHeight / 2) + 15 + 16
                            };
                        }
                    },
                    pane: {
                        startAngle: 0,
                        endAngle: 360,
                        background: $scope.ActualSleepingRadius
                    },
                    yAxis: {
                        min: 0,
                        max: 100,
                        lineWidth: 0,
                        tickPositions: [],
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                enabled: true,
                                useHTML: true,
                                formatter: function () {

                                    return (`<div class='datalabel'><p class="datalabelh_rot"><i class="fas fa-bed"></i></p>
                                <p class="datalabeld">${this.point.yPercent}</p><p class="datalabelt">${GoalSleeping}</p></div>`);
                                },
                            },


                        }
                    },
                    series:
                        $scope.ActualSleepingList
                })

            })
        };

        $scope.PatientListData = [];
        $scope.PatientData = [];
        $scope.PatientAppointmentCount = 0;
        $scope.appointmentDoctorId = 0;
        $scope.getMyAppointments = function () {
            $http.get(baseUrl + '/api/User/PatientAppointmentList/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (Patientdata) {
                $scope.PatientListData = Patientdata.PatientAppointmentList;
                $scope.PatientAppointmentCount = $scope.PatientListData.length;
                // to show first appointment
                if ($scope.PatientAppointmentCount > 0) {
                    $scope.PatientData = $scope.PatientListData[0];
                    $scope.DoctorName = $scope.PatientData.DoctorName;
                    $scope.appointmentDoctorId = $scope.PatientData.Doctor_Id;
                    $scope.AppointmentTime = $scope.PatientData.Appointment_FromTime;
                    var Declare = moment($scope.PatientData.Appointment_Date).format('DD-MMM-YYYY');
                    $scope.AppointmentDate = DateFormatEdit(Declare);
                    $scope.PhotoBlob = $scope.PatientData.PhotoBlob;
                    $scope.ViewGenderName = $scope.PatientData.ViewGenderName;
                    $window.localStorage['selectedDoctor'] = $scope.appointmentDoctorId;
                    //  $scope.TimeDifference = $scope.PatientData.TimeDifference;
                    if ($scope.AppointmentTime != null) {
                        var startdate = moment(new Date($scope.AppointmentTime));
                        var enddate = moment(new Date());
                        var diff = Math.abs(enddate - startdate);
                        var days = Math.floor(diff / (60 * 60 * 24 * 1000));
                        var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
                        var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                        var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

                        var timeDiffString = "";
                        if (days != 0) {
                            timeDiffString = timeDiffString + days + ' day ';
                        }
                        else if (hours != 0) {
                            timeDiffString = timeDiffString + hours + ' hr ';
                        }
                        else if (minutes != 0) {
                            timeDiffString = timeDiffString + minutes + ' min ';
                        }
                        else if (seconds != 0) {
                            timeDiffString = timeDiffString + seconds + ' sec';
                        }
                        $scope.TimeDifference = timeDiffString;
                    }
                    $scope.Appointment_Id = $scope.PatientData.Id;
                    if ($scope.UserTypeId == 4 || $scope.UserTypeId == 7) {
                        $scope.chattingWith = $scope.DoctorName;
                    }
                }
            });
        }
        // call my appointments only in patient login
        if ($routeParams.PageParameter == "1") {
            $scope.getMyAppointments();
        }


        $scope.index = 0;
        $scope.Next_PatientAppointment = function (Type) {
            if (Type == 1) {
                $scope.index = $scope.index + 1;
                $scope.disable_Next = ($scope.PatientAppointmentCount) - 1;
            }
            if (Type == 2) {
                $scope.index = $scope.index - 1;
            }
            $scope.PatientData = $scope.PatientListData[$scope.index];
            $scope.appointmentDoctorId = $scope.PatientData.Doctor_Id;
            $scope.DoctorName = $scope.PatientData.DoctorName;
            $scope.AppointmentTime = $scope.PatientData.Appointment_FromTime;
            $scope.AppointmentDate = $scope.PatientData.Appointment_Date;
            $window.localStorage['selectedDoctor'] = $scope.appointmentDoctorId;
            //$scope.TimeDifference = $scope.PatientData.TimeDifference;

            if ($scope.AppointmentTime != null) {
                var startdate = moment(new Date($scope.AppointmentTime));
                var enddate = moment(new Date());
                var diff = Math.abs(enddate - startdate);
                var days = Math.floor(diff / (60 * 60 * 24 * 1000));
                var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
                var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

                var timeDiffString = "";
                if (days != 0) {
                    timeDiffString = timeDiffString + days + ' day ';
                }
                else if (hours != 0) {
                    timeDiffString = timeDiffString + hours + ' hr ';
                }
                else if (minutes != 0) {
                    timeDiffString = timeDiffString + minutes + ' min ';
                }
                else if (seconds != 0) {
                    timeDiffString = timeDiffString + seconds + ' sec';
                }
                $scope.TimeDifference = timeDiffString;
            }

            $scope.PhotoBlob = $scope.PatientData.PhotoBlob;
            $scope.ViewGenderName = $scope.PatientData.ViewGenderName;
            $scope.Appointment_Id = $scope.PatientData.Id;
            if ($scope.UserTypeId == 4 || $scope.UserTypeId == 7) {
                $scope.chattingWith = $scope.DoctorName;
            }
        }

        $scope.AddVitalsPopUp = function () {
            angular.element('#PatientVitalsCreateModal').modal('show');
        }

        // Add row concept for Patient Vital Parameters
        $scope.AddVitalParameters = [{
            'Id': 0,
            'ParameterId': 0,
            'UOM_Name': '',
            'ParameterValue': '',
            'IsActive': 1
        }];

        /*This is a Addrow function to add new row and save Family Health Problem details*/
        $scope.AddParameterVitals_Insert = function () {
            if ($scope.AddVitalParameters.length > 0) {
                var obj = {
                    'Id': 0,
                    'ParameterId': 0,
                    'UOM_Name': '',
                    'ParameterValue': '',
                    'IsActive': 1
                }
                $scope.AddVitalParameters.push(obj);
            }
            else {
                $scope.AddVitalParameters = [{
                    'Id': 0,
                    'ParameterId': 0,
                    'UOM_Name': '',
                    'ParameterValue': '',
                    'IsActive': 1
                }];
            }
        };

        $scope.VitalParameterDelete = function (itemIndex) {
            var del = confirm("Do you like to delete the selected Parameter?");
            if (del == true) {
                $scope.AddVitalParameters.splice(itemIndex, 1);
                if ($scope.AddVitalParameters.length == 0) {
                    $scope.AddVitalParameters = [{
                        'Id': 0,
                        'ParameterId': 0,
                        'UOM_Name': '',
                        'ParameterValue': '',
                        'IsActive': 1
                    }];
                }
            }
        };

        $scope.ParameterInsert_UpdateValidations = function () {
            var TSDuplicate = 0;
            var varlidationCheck = 0;
            var paramExist = 0;
            var DuplicateParam = '';
            //angular.forEach($scope.VitalsParameterList_Data, function (value, index) {
            angular.forEach($scope.AddVitalParameters, function (value1, index1) {
                if (value1.ParameterId != '' || value1.ParameterId > 0) {
                    paramExist = 1;
                }
                var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: value1.ParameterId }, true)[0]
                if (checkobj != null) {
                    angular.forEach($scope.AddVitalParameters, function (value2, index2) {
                        if (index1 > index2 && value1.ParameterId == value2.ParameterId) {
                            TSDuplicate = 1;
                            if (DuplicateParam != '')
                                DuplicateParam = DuplicateParam + ',';
                            DuplicateParam = DuplicateParam + checkobj.ParameterName;
                        };
                    });
                    if (value1.ParameterValue == '' || value1.ParameterValue <= 0) {
                        varlidationCheck = 1;
                        alert("Please enter value for " + checkobj.ParameterName);
                        return false;
                    }
                    else if (checkobj.Min_Possible > parseFloat(value1.ParameterValue) && checkobj.Min_Possible > 0) {
                        varlidationCheck = 1;
                        alert(checkobj.ParameterName + " value cannot be less than " + checkobj.Min_Possible);
                        return false;
                    }
                    else if (checkobj.Max_Possible < parseFloat(value1.ParameterValue) && checkobj.Max_Possible > 0) {
                        varlidationCheck = 1;
                        alert(checkobj.ParameterName + " value cannot be greater than " + checkobj.Max_Possible);
                        return false;
                    }
                }
            });
            if (TSDuplicate == 1) {
                alert('Parameters ' + DuplicateParam + 'already exist, cannot be Duplicated');
                return false;
            }
            else if (varlidationCheck == 1) {
                return false;
            }
            else if (paramExist == 0) {
                alert('Please enter Parameter details to Save');
                return false;
            }
            return true;

        };
        $scope.ParameterInsert_Update = function (itemIndex) {
            if ($scope.ParameterInsert_UpdateValidations() == true) {
                $("#chatLoaderPV").show();
                var filteredObj = $ff($scope.AddVitalParameters, function (value) {
                    return value.ParameterId != '';
                });
                var obj = {
                    Id: $scope.Id,
                    ActivityDate: $filter('date')(new Date(), 'dd-MMM-yyyy HH:mm:ss'),
                    Created_By: $window.localStorage['UserId'],
                    Patient_Id: $scope.SelectedPatientId,
                    DeviceType: 'MANUAL',
                    Device_No: 'MANUAL',
                    PatientHealthDataModel: filteredObj,
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/PatientHealthDataBulk_Insert_Update/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    var alemsg = "";
                    if ($scope.currentTab == '2') {
                        alemsg = "Vitals data inserted Successfully"
                    }
                    else {
                        alemsg = "Lab data inserted Successfully"
                    }
                    if (data == '1') {
                        alert(alemsg);

                        $scope.ParameterCancelPopup();
                        $scope.HistoryDetails($scope.currentTab);      // vitals grid view refresh

                    }
                    else {
                        alert("Error in creating Vitals!");
                    }
                });
            }

        };
        $scope.ParameterClickEdit = function (rowData, rowIndex) {
            var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: rowData.ParameterId }, true)[0];
            if (checkobj.IsFormulaParam == "1") {
                alert(checkobj.ParameterName + " cannot be edited");
            }
            else {
                if ($scope.IsEditableCheck(rowData.Activity_Date) == false) {
                    alert("Parameter value cannot be edited");
                }
                else {
                    $scope.EditVitalRow_EditFlag[rowIndex] = 2;
                }
            }
        }
        $scope.ParameterEdit_Update = function (rowData, rowIndex) {
            if (rowData.newParameterValue == '') {
                alert("Please enter value");
                return false;
            }
            var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: rowData.ParameterId }, true)[0];
            if (checkobj.Min_Possible > parseFloat(rowData.newParameterValue) && checkobj.Min_Possible > 0) {
                alert(checkobj.ParameterName + " value cannot be less than " + checkobj.Min_Possible);
                return false;
            }
            else if (checkobj.Max_Possible < parseFloat(rowData.newParameterValue) && checkobj.Max_Possible > 0) {
                alert(checkobj.ParameterName + " value cannot be greater than " + checkobj.Max_Possible);
                return false;
            }


            if (rowData.Id == 0) {
                rowData.Modified_By == null;
            }
            else {
                rowData.Modified_By = $window.localStorage['UserId'];
            }
            rowData.ParameterValue = rowData.newParameterValue;
            $("#chatLoaderPV").show();
            $http.post(baseUrl + '/api/User/PatientHealthData_Insert_Update/?Login_Session_Id=' + $scope.LoginSessionId, rowData).success(function (data) {
                $("#chatLoaderPV").hide();
                if (data.ReturnFlag == "1") {
                    $scope.EditVitalRow_EditFlag[rowIndex] = 1;
                    alert("Vitals data updated Successfully");
                }
                else {
                    $("#chatLoaderPV").hide();
                    alert("Error in creating Vitals!");
                }

            });

        };
        $scope.ChartActive = function () {
            $scope.VitalChart = 1;
        }
        $scope.EditVitalRow_EditFlag = [];
        $scope.HistoryDetails = function (current_Tab) {
            $scope.TabClicked = current_Tab;
            var ChartORData = 2;
            $scope.AllDetailsList($scope.TabClicked, ChartORData);
        };

        $scope.VitalParametersDetailsHistory = function () {
            angular.element('#PatientVitalsParameterHistoryCreateModal').modal('show');
        }


        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.CancelEdit = function (row, rownum) {
            var del = confirm("Do you like to cancel the Edit?");
            if (del == true) {
                $scope.EditVitalRow_EditFlag[rownum] = 1;
                row.newParameterValue = row.ParameterValue;
            }
        };
        $scope.DeleteParameters = function (comId, paramId) {
            var checkobj = $ff($scope.GroupParameterNameList, { ParameterId: paramId }, true)[0]
            if (checkobj.IsFormulaParam == "1") {
                alert(checkobj.ParameterName + " cannot be deactivated");
            }
            else {
                $scope.Id = comId;
                $scope.Parameter_Delete();
            }
        };
        $scope.Parameter_Delete = function () {
            var del = confirm("Do you like to deactivate the selected Parameter?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/User/ParametersDetails_Delete/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.HistoryDetails();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Parameter" + data;
                });

            };
        };

        /*'Active' the Institution*/
        $scope.ReInsertParameters = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertParametersDetails();

        };

        /* 
        Calling the api method to inactived the details of the company 
        for the  company Id,
        and redirected to the list page.
        */
        $scope.ReInsertParametersDetails = function () {
            var Ins = confirm("Do you like to activate the selected Parameter?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/User/ParametersDetails_Active/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.HistoryDetails();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ReInsertParameterDetails" + data;
                });
            };
        }

        $scope.EditVitalParameters = function (CatId, activeFlag) {
            if (activeFlag == 1) {
                // $scope.InstitutionClear();
                $scope.Id = CatId;
                //$scope.VitalParametersView();

            }
            else {
                alert("Inactive record cannot be edited");
            }
        };

        $scope.ParameterCancelPopup = function () {
            angular.element('#PatientVitalsCreateModal').modal('hide');
            $scope.ClearParameterPopup();
        }
        $scope.ClearParameterPopup = function () {
            $scope.AddVitalParameters = [{
                'Id': 0,
                'ParameterId': 0,
                'UOM_Name': '',
                'ParameterValue': '',
                'IsActive': 1
            }];
            $scope.UOMName = "";
        }
        $scope.PatientTo30days_CancelPopup = function () {
            //For Today Appointment Page	
            $location.path("/Thirtydays_appointments/");
        }

        $scope.CancelAppointmentModal = function (AppointmentId) {
            var msg = confirm("Do you like to Cancel the Patient Appointment?");
            if (msg == true) {
                $scope.Cancelled_Remarks = "";
                $scope.Appointment_Id = AppointmentId;
                angular.element('#PatientAppointmentModal').modal('show');
                $scope.ReasonTypeDropList();
            }
        }
        $scope.ReasonTypeDropList = function () {
            // if($window.localStorage['UserTypeId']==2 || $window.localStorage['UserTypeId']==4  ||$window.localStorage['UserTypeId']==7 ){

            $http.get(baseUrl + '/api/PatientAppointments/AppointmentReasonType_List/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AppointmentReasonTypeListTemp = [];
                $scope.AppointmentReasonTypeListTemp = data;
                var obj = { "ReasonTypeId": 0, "ReasonType": "Select", "IsActive": 1 };
                $scope.AppointmentReasonTypeListTemp.splice(0, 0, obj);
                $scope.AppointmentReasonTypeList = angular.copy($scope.AppointmentReasonTypeListTemp);
            });
            //  }
        }
        $scope.Cancel_CancelledAppointment = function (AppointmentId) {
            angular.element('#PatientAppointmentModal').modal('hide');
            $scope.Cancelled_Remarks = "";
            $scope.ReasonTypeId = '0';
        }

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.Update_CancelledAppointment = function (Appointment_Id) {
            if (typeof ($scope.ReasonTypeId) == "undefined" || $scope.ReasonTypeId == "0") {
                alert("Please select Reason Type");
                return false;
            }
            else {
                var obj = {
                    CancelledBy_Id: $scope.SelectedPatientId,
                    Id: $scope.Appointment_Id,
                    Cancelled_Remarks: $scope.Cancelled_Remarks,
                    ReasonTypeId: $scope.ReasonTypeId
                }
                $("#chatLoaderPV").show();
                $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    angular.element('#PatientAppointmentModal').modal('hide');
                    $scope.Cancelled_Remarks = "";
                    $scope.ReasonTypeId = '0';
                    $scope.getMyAppointments();
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while Updating Appointment Details" + data;
                });
            }
        }
        $scope.DiagosticAlert_CancelPopup = function () {
            //Diagostic Alert
            $location.path("/Carecoordinator/1");
        }
        $scope.ComplianceAlert_CancelPopup = function () {
            //Compliaance Alert
            $location.path("/CarecoordinatorCompliance/2");
        }
        $scope.CareGiver_CancelPopup = function () {
            //Care Giver Assigned Patient
            $location.path("/CareGiverAssignedPatients");
        }
        $scope.UserTypeId = $window.localStorage['UserTypeId'];
        $scope.UserId = $window.localStorage['UserId'];
        $scope.CareGiverAssign_Function = function () {
            if ($scope.UserTypeId == "6") {
                //Assign care Giver only in Coordinator Login
                //$scope.ParameterValueList = [];
                //$http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId).success(function (data) {
                //    $scope.ParameterValueList = data;
                //});

                $scope.CareGiverList = [];
                $http.post(baseUrl + '/api/CareCoordinnator/CareGiver_List/?Id=' + $scope.SelectedPatientId).success(function (data) {
                    $scope.CareGiverList = data;
                });
            }
        }
        var HighCountVital;

        if ($scope.UserTypeId != "3" || $scope.UserTypeId != "1") {
            //Assign care Giver only in Coordinator Login
            $scope.ParameterValueList = [];
            $http.get(baseUrl + '/api/CareCoordinnator/Get_ParameterValue/?PatientId=' + $scope.SelectedPatientId + '&UserTypeId=' + $scope.UserTypeId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.ParameterValueList = data;
                //angular.forEach($scope.ParameterValueList, function (value, index) {
                //    console.log(value);
                //    if(value.HighCount!= 0 ) 
                //    {
                //        HighCountVital= (value.HighCount).length;
                //        console.log(HighCountVital);
                //    }
                //});


            });
        }

        $scope.yellowcount = 1;
        $scope.AlertCountDisplay = function () {
            $('#tableid1').hide();
            $('#tableid').hide();
            $scope.yellowcount++;
            var x = document.getElementById(tableid1);
            var y = document.getElementById(tableid2);
            var MediumCountVital;
            
            if ($scope.yellowcount == 2) {
                angular.forEach($scope.ParameterValueList, function (value, index) {
                    console.log(value);
                    if (value.MediumCount != 0) {
                        MediumCountVital = value.MediumCount;
                        console.log(MediumCountVital);
                    }
                });
                if (MediumCountVital > 0) {
                    $('#tableid1').show();
                    return true;
                } else {
                    return true;
                }

            } else if ($scope.yellowcount == 3) {
                $('#tableid1').hide();
                $('#tableid2').show();

            } else {

                //i.src = "../../Images/expand.gif"
                $('#tableid1').hide();
                $('#tableid2').hide();
                $scope.yellowcount = 1; 
                //document.getElementById(tableid + '_img').title = 'Click to Expand';
                //count = $scope.yellowcount - 3;

            }
            return true;
        };
        $scope.Assign_CareGiver_Id = "0";
        $scope.CC_Remarks = "";
        $scope.CareGiver_Id = "0";
        $scope.ReasonTypeId = '0';
        $scope.AllPatient_CancelPopup = function () {
            //All Patients
            $location.path("/PatientAppointments");
        }
        $scope.Assign_CareGiver = function () {
            if (typeof ($scope.CareGiver_Id) == "undefined" || $scope.CareGiver_Id == "0") {
                alert("Please select Care Giver");
                return false;
            }
            else {
                var obj = {
                    Id: $scope.Assign_CareGiver_Id,
                    Coordinator_Id: $scope.UserId,
                    Patient_Id: $scope.SelectedPatientId,
                    CareGiver_Id: $scope.CareGiver_Id.toString(),
                    CC_Remarks: $scope.CC_Remarks,
                    Created_By: $scope.UserId,
                    CC_Date: moment($window.localStorage['CC_Date']).format('YYYY-MM-DD HH:mm:ss'),
                    Page_Type: $scope.PageParameter == 5 ? 0 : 1,
                    Institution_Id: $window.localStorage['InstitutionId'],
                }
                $("#chatLoaderPV").show();
                $http.post(baseUrl + '/api/CareCoordinnator/Assign_CareGiver/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    $scope.CareGiver_Id = "0";
                    $scope.CC_Remarks = "";
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while Assigning CareGiver" + data;
                });
            }
        }
        //Care Giver Login
        $scope.CG_Remarks = "";
        $scope.CG_Update_ClearAlerts = function () {

            if (typeof ($scope.CG_Remarks) == "undefined" || $scope.CG_Remarks == "") {
                alert("Please enter Notes / Remarks to clear alert");
                return false;
            }
            else {
                var obj = {
                    Patient_Id: $scope.SelectedPatientId,
                    CareGiver_Id: $scope.UserId,
                    CG_Remarks: $scope.CG_Remarks,
                    Page_Type: $scope.PageParameter == 7 ? 0 : 1
                }
                $("#chatLoaderPV").show();
                $http.post(baseUrl + '/api/CareGiver/CG_Update_ClearAlerts/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    if ((data == 1) || (data == 3)) {
                        alert("Clear Alerts updated successfully");
                        $scope.CG_Remarks = "";
                    }
                    else if (data == 2) {
                        alert("Alert already cleared by Caregiver, cannot be cleared");
                    }
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while Update Clear Alerts" + data;
                });
            }
        }

        $scope.appointmentClear = function () {
            $scope.searchquery = '';
            $scope.Doctor_Id = '';
            $scope.AppointmentFromTime = '';
            $scope.AppointmentToTime = '';
            $scope.AppointmentDate = '';
            $scope.ReasonForVisit = '';
            $scope.ReasonTypeId = '0';
        }
        $scope.DoctorSeachPopup = function () {
            $scope.DoctorListforAppointments();
            $scope.filterDoctorList();
            angular.element('#DoctorSelectionModal').modal('show');

        }

        /* Patient Based Group Based PatientBasedGroupBasedClinicianList*/
        $scope.searchquery = '';
        $scope.DoctorsDetailsList = [];
        $scope.DoctorListforAppointments = function () {
            $http.get(baseUrl + '/api/PatientAppointments/PatientBasedGroupBasedClinicianList/?Patient_Id=' + $scope.SelectedPatientId).success(function (data) {
                $scope.DoctorsDetailsList = data;
                $scope.filterDoctorListforAppointmentCreation();
            });
        }
        $scope.Convert24to12Timeformat = function (inputTime) {
            var outputTime = null;
            if (inputTime != '' && inputTime != null) {
                inputTime = inputTime.toString(); //value to string for splitting
                var splitTime = inputTime.split(':');
                splitTime.splice(2, 1);
                var ampm = (splitTime[0] >= 12 ? ' PM' : ' AM'); //determine AM or PM
                splitTime[0] = splitTime[0] % 12;
                splitTime[0] = (splitTime[0] == 0 ? 12 : splitTime[0]); //adjust for 0 = 12
                outputTime = splitTime.join(':') + ampm;
            }
            return outputTime;
        };
        $scope.Convert12To24Timeformat = function (timeval) {
            var outputTime = null;
            if (timeval != '' && timeval != null) {
                var time = timeval;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12) hours = hours + 12;
                if (AMPM == "AM" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                outputTime = sHours + ":" + sMinutes;
            }
            return outputTime;
        };
        /* Validating the create page Appointment From Time Should not be greater than Appointment to time
       */
        $scope.PatientAppointment_InsertUpdateValidations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.AppointmentDate = moment($scope.AppointmentDate).format('DD-MMM-YYYY');

            if ($scope.Doctor_Id == "") {
                alert("Please select Doctor");
                return false;
            }
            else if ($scope.AppointmentDate == "") {
                alert("Please select Appointment Date");
                return false;
            }
            else if ($scope.AppointmentFromTime == "") {
                alert("Please select Appointment From time");
                return false;
            }
            else if ($scope.AppointmentToTime == "") {
                alert("Please select Appointment To time");
                return false;
            }
            /*else if (($scope.AppointmentToTime) < ($scope.AppointmentFromTime)) {
                alert("Appointment From Time should not be greater than Appointment To Time");
                return false;
            }*/
            else if ($scope.AppointmentDate < today) {
                alert("Appointment Date Can Be Booked Only For Future");
                return false;
            }
            else if ($scope.AppointmentDate != "") {
                if (moment($scope.AppointmentDate + " " + $scope.AppointmentFromTime) > moment($scope.AppointmentDate + " " + $scope.AppointmentToTime)) {
                    alert("Appointment From Time should not be greater than Appointment To Time");
                    $scope.AppointmentDate = DateFormatEdit($scope.AppointmentDate);
                    return false;
                }
            }
            else if (moment().diff(moment($scope.AppointmentDate + " " + $scope.AppointmentFromTime), 'minute') > 0) {
                alert("Appointment can be booked only for future");
                return false;
            }
            else if ($scope.ReasonForVisit == "" || $scope.ReasonForVisit == undefined) {
                alert("Please enter Reason for Visit");
                return false;
            }
            $scope.AppointmentDate = DateFormatEdit($scope.AppointmentDate);
            return true;
        };
        $scope.Institution_Id = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.PatientAppointment_InsertUpdate = function (SelectedDoctor_Id) {

            if ($scope.PatientAppointment_InsertUpdateValidations() == true) {
                var obj = {
                    Institution_Id: $scope.Institution_Id,
                    Doctor_Id: $scope.Doctor_Id,
                    Patient_Id: $scope.SelectedPatientId,
                    Appointment_Date: moment($scope.AppointmentDate).format('DD-MMM-YYYY'),
                    AppointmentFromTime: $scope.AppointmentFromTime == '' ? null : $scope.Convert12To24Timeformat($scope.AppointmentFromTime),
                    AppointmentToTime: $scope.AppointmentToTime == '' ? null : $scope.Convert12To24Timeformat($scope.AppointmentToTime),
                    Appointment_Type: 1,
                    ReasonForVisit: $scope.ReasonForVisit == null ? '' : $scope.ReasonForVisit,
                    //Remarks:'Heavy Headache',
                    Status: 1,
                    Created_By: $window.localStorage['UserId'],
                    Page_Type: $scope.PageParameter == 7 ? 0 : 1
                }
                $("#chatLoaderPV").show();
                $http.post(baseUrl + '/api/PatientAppointments/PatientAppointment_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    $scope.appointmentClear();
                    $scope.MyAppointments();
                })
            }
        }

        $scope.DoctorCollectionFilter = [];
        $scope.searchquery = "";
        $scope.filterDoctorListforAppointmentCreation = function () {
            $scope.DoctorCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == '') {
                if ($scope.DoctorsDetailsList.length > 0) {
                    $scope.DoctorCollectionFilter = angular.copy($scope.DoctorsDetailsList);
                }
            }
            else {
                $scope.DoctorCollectionFilter = $ff($scope.DoctorsDetailsList, function (value) {
                    return angular.lowercase(value.DoctorName).match(searchstring) ||
                        angular.lowercase(value.Doctor_DepartmentName).match(searchstring)
                });
            }
        }

        $scope.DoctorSelection = function (rowDoctor) {
            $scope.searchquery = rowDoctor.DoctorName;
            $scope.Doctor_Id = rowDoctor.Doctor_Id
            angular.element('#DoctorSelectionModal').modal('hide');
        }

        $scope.CancelDoctorSelectionModalPopup = function () {
            angular.element('#DoctorSelectionModal').modal('hide');
        }
        /* Open doctor appointment history popup*/
        $scope.DoctorAppoinmentModal = function () {
            $scope.DoctorAppoinmentList();
            angular.element('#DoctorAppoinmentModal').modal('show');
        }
        /* Cancel doctor appointment history popup*/
        $scope.CancelDoctorAppoinmentModal = function () {
            angular.element('#DoctorAppoinmentModal').modal('hide');
        }

        $scope.DoctorAppointmentsearchquery = "";
        $scope.filterDoctorList = function () {
            $scope.DoctorAppoinmentFilter = [];
            // $scope.DoctorAppoinmentFilter = [];
            var searchstring = angular.lowercase($scope.DoctorAppointmentsearchquery);
            if ($scope.searchstring == "") {
                $scope.DoctorAppoinmentFilter = [];
                $scope.DoctorAppoinmentFilter = angular.copy($scope.DoctorAppoinmentdata);
            }
            else {
                $scope.DoctorAppoinmentFilter = $ff($scope.DoctorAppoinmentdata, function (value) {
                    return angular.lowercase(($filter('date')(value.Appointment_Date, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.DoctorName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Appointment_FromTime, "hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Appointment_ToTime, "hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.Created_By_Name).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(value.ReasonForVisit).match(searchstring) ||
                        angular.lowercase(value.ReasonType).match(searchstring) ||
                        angular.lowercase(value.PatientName).match(searchstring);
                });
            }
        }

        /* doctor appoinment list function.*/
        $scope.DoctorAppoinmentdata = [];
        $scope.DoctorAppoinmentemptydata = [];
        $scope.DoctorAppoinmentFilter = [];
        $scope.Appointmentflag = 0;

        $scope.DoctorAppoinmentList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/DoctorAppoinmentHistoryList/?PatientId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.DoctorAppoinmentemptydata = data;
                $scope.DoctorAppoinmentdata = data;
                $scope.DoctorAppoinmentFilter = angular.copy($scope.DoctorAppoinmentdata);
                if ($scope.DoctorAppoinmentFilter.length > 0) {
                    $scope.Appointmentflag = 1;
                }
                else {
                    $scope.Appointmentflag = 0;
                }
            });

        }


        /* Care Co-ordinator popup function*/
        $scope.CareCoordinatorModal = function () {
            $scope.CareCoordinatorList();
            angular.element('#CareCoordinatorModal').modal('show');
        }

        $scope.CancelCareCoordinatorModal = function () {
            angular.element('#CareCoordinatorModal').modal('hide');
        }

        /* FILTER THE MASTER LIST FUNCTION.*/

        $scope.CareCoordinatorsearchquery = "";
        $scope.filterCareCoordinatorList = function () {
            $scope.CareCoordinatorFilter = [];
            var searchstring = angular.lowercase($scope.CareCoordinatorsearchquery);
            if ($scope.searchstring == "") {
                $scope.CareCoordinatorFilter = angular.copy($scope.CareCoordinatordata);
            }
            else {
                $scope.CareCoordinatorFilter = $ff($scope.CareCoordinatordata, function (value) {
                    return angular.lowercase(value.Coordinator).match(searchstring) ||
                        angular.lowercase(value.CareGiver).match(searchstring) ||
                        angular.lowercase(value.CC_Remarks).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
            }
        }


        /* Filter the Co-ordinator list function.*/
        $scope.CareCoordinatordata = [];
        $scope.CareCoordinatoremptydata = [];
        $scope.CareCoordinatorFilter = [];
        $scope.flag = 0;

        $scope.CareCoordinatorList = function () {
            $http.get(baseUrl + '/api/CareCoordinnator/Care_Coordinatorhistory/?CareGiverId=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.CareCoordinatoremptydata = data;
                $scope.CareCoordinatordata = data;
                $scope.CareCoordinatorFilter = angular.copy($scope.CareCoordinatordata);
                if ($scope.CareCoordinatorFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                $scope.SearchMsg = "No Data Available";
            });

        }

        $scope.CancelAlertHistorypopup = function () {
            angular.element('#ViewClearAlertsHistoryModal').modal('hide');
        }

        // cancel function in pop up menu
        $scope.CancelPopup = function () {
            angular.element('#ViewClearAlertsHistoryModal').modal('hide')
        }


        $scope.ViewClearAlertHistoryPopup = function (ViewAlert) {
            $scope.AlertsClear();
            $scope.SelectedPatientIdvalue = ViewAlert;
            $scope.ViewAlertHistory();
            $scope.FilterViewData = [];

            angular.element('#ViewClearAlertsHistoryModal').modal('show');
        };

        $scope.SelectedPatientIdvalue = [];
        $scope.ViewData = [];

        $scope.FilterViewData = [];

        //View for Clear alerts history

        $scope.ViewAlertHistory = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/CareGiver/AlertHistory_View/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.FilterView = [];
                $scope.FilterView = data
                $scope.ViewData = data;
                //$scope.FilterView=data;


            }).error(function (data) {

                $scope.error = "An error has occcurred " + data.ExceptionMessage;
            });
        }

        $scope.AlertsClear = function () {
            $scope.CareGiverIdvalue = "";
            $scope.SelectedPatientIdvalue = "";
            $scope.alerts = "";
            $scope.createddate = "";
        }

        //Search filter for clear alert history view
        $scope.searchqueryval = "";
        $scope.filterViewAlertHistory = function () {
            $scope.ResultViewFiltered = [];
            var searchstring = angular.lowercase($scope.searchqueryval);
            if ($scope.searchqueryval == "") {
                $scope.FilterViewData = angular.copy($scope.ViewData);

            }
            else {
                $scope.FilterViewData = $ff($scope.ViewData, function (value) {
                    return angular.lowercase(value.CaregiverName).match(searchstring) ||
                        angular.lowercase(value.CC_Remarks).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);

                });
            }
        }

        /***Monitoring Protocol Search dropdown list based Institution_Id***/
        $scope.MonitoringProtocolList = function () {
            //UserTypeId ==4||UserTypeId==7
            $scope.MonitoringProtocol_List = [];
            if ($scope.UserTypeId == "4" || $scope.UserTypeId == "7") {
                $http.get(baseUrl + '/api/Protocol/StandardProtocol_List/?IsActive=1&InstitutionId=' + $scope.Institution_Id).success(function (data) {
                    $scope.MonitoringProtocolListTemp = [];
                    $scope.MonitoringProtocolListTemp = data;
                    var obj = { "Id": "", "ProtocolName": "No protocol assigned", "IsActive": 1 };
                    $scope.MonitoringProtocolListTemp.splice(0, 0, obj);
                    $scope.MonitoringProtocol_List = angular.copy($scope.MonitoringProtocolListTemp);
                    if ($scope.assignedProtocolId != "") {
                        $scope.Monitoring_ProtocolId = $scope.assignedProtocolId;
                    }
                });
            }

        }

        /** Insert and Update Patient Assigned monitoring protocol controller functions */
        $scope.AssignedProtocol_InsertUpdate = function (Monitoring_ProtocolId) {
            if ($scope.assignedProtocolId == $scope.Monitoring_ProtocolId) {
                alert('This protocol is already assigned to this patient');
                return false;
            }
            var del = true;
            if ($scope.Monitoring_ProtocolId == 0) {
                del = confirm('Are you sure to Remove Protocol to this patient?');
            }
            if (del == true) {
                $("#chatLoaderPV").show();
                var prtobj = {
                    PatientId: $scope.SelectedPatientId,
                    Protocol_Id: $scope.Monitoring_ProtocolId == 0 ? '' : $scope.Monitoring_ProtocolId,
                    Created_By: $window.localStorage['UserId']
                };
                $http.post(baseUrl + '/api/User/PatientAssignedProtocol_InsertUpdate', prtobj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.assignedProtocolId = $scope.Monitoring_ProtocolId;
                    alert('Protocol updated successfully')
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while assigning Protocol " + data;
                    alert($scope.error);
                });
            }
        }


        /* This is for MonitoringHistoryListPopUP */
        $scope.MonitoringHistoryListPopUP = function () {
            $scope.MonitoringProtocolHistoryList();
            angular.element('#MonitoringProtocolHistoryPopup').modal('show');
        }


        /* This is for MonitoringProtocolHistoryListData */
        $scope.PatientAssignedProtocolDataList = [];
        $scope.MonitoringProtocolHistoryListData = [];
        $scope.MonitoringProtocolHistoryList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/User/ProtocolHistorylist/?Patient_Id=' + $scope.SelectedPatientId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.MonitoringProtocolEmptyData = [];
                $scope.MonitoringProtocolHistoryListData = [];
                $scope.MonitoringProtocolHistoryListData = data;
                $scope.PatientAssignedProtocolDataList = angular.copy($scope.MonitoringProtocolHistoryListData);
                if ($scope.PatientAssignedProtocolDataList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }

            })
        }

        $scope.searchquery = "";
        $scope.filterassignedProtocolList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.PatientAssignedProtocolDataList = [];
                $scope.PatientAssignedProtocolDataList = angular.copy($scope.MonitoringProtocolHistoryListData);
            }
            else {
                var val;
                $scope.PatientAssignedProtocolDataList = $ff($scope.MonitoringProtocolHistoryListData, function (value) {
                    if (value.ProtocolName == null) {
                        val = "";
                    }
                    else {
                        val = value.ProtocolName;
                    }
                    return angular.lowercase(val).match(searchstring) ||
                        angular.lowercase(value.Doctor_Name).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Protocol_Assigned_On, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
            }
        }

        /* This is for MonitoringProtocolHistoryListCancelPopUp */
        $scope.MonitoringProtocolHistoryListCancelPopUp = function () {
            angular.element('#MonitoringProtocolHistoryPopup').modal('hide');
        }

        //For ICD10
        $scope.ICDTabCount = 1;
        /* This is for AddNewpopup function from List  window page */
        $scope.AddPatientICD10Popup = function () {
            $scope.Id = 0;
            $scope.Icd10AddnewClear();

            //$scope.ICD10CategoryClearFunction();
            $scope.Icd10Clear();
            angular.element('#CreateICDModal').modal('show');

            setTimeout(function () {
                $scope.calenderSet($scope.AddICD10List.length);
            }, 1000);

        }

        /* This is for Cancel  function from View Popup window page */
        $scope.CancelViewICD10Popup = function () {
            angular.element('#ViewICD10modal').modal('hide');
        }

        /* This is for Cancel  function for  edit Popup window page */
        $scope.CancelEditICD10Popup = function () {
            angular.element('#EditICD10Modal').modal('hide');
        }

        /* This is for Cancel function from Addnew Popup window page */
        $scope.CancelAddICD10Popup = function () {
            angular.element('#CreateICDModal').modal('hide');
        }

        /* This is for View Popup function from List  window page */
        $scope.ViewPatientICD10 = function (CatId, editval) {

            if (editval == 2) {
                $scope.Id = CatId;
                $scope.PatientICD10Details_View();
                angular.element('#ViewICD10modal').modal('show');
            }
        };

        /* This is for Edit Popup function from List  window page */
        $scope.EditPatientICD10 = function (CatId, createdDt, editval) {
            if ($scope.IsEditableCheck(createdDt) == false) {
                alert("ICD10 Cannot be edited");
            }
            else {
                $scope.Icd10AddnewClear();
                $scope.Icd10Clear();
                $scope.Id = CatId;
                $scope.PatientICD10Details_View();
                angular.element('#EditICD10Modal').modal('show');
            }
        };

        /* This is for Patient ICD10 Details Delete function*/
        $scope.DeletePatientICD10 = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10_Delete();
        };
        $scope.Category_ID = "0";
        $scope.AddICD10List = [];
        $scope.CategoryIDList = [];
        $scope.ICDCodeList = [];
        $scope.rowcollectionfiltericd10 = [];

        /* This is for intilize Addrow Columns scope values */
        $scope.AddICD10List = [{
            'Id': 0,
            'Category_ID': 0,
            'Category_Name': '',
            'Code_ID': '0',
            'ICDCode': '',
            'ICD_Description': '',
            'ICD_Remarks': '',
            'Active_From': '',
            'Active_To': ''

        }];


        $scope.Icd10AddnewClear = function () {
            $scope.AddICD10List = [{
                'Id': 0,
                'Category_ID': 0,
                'Category_Name': '',
                'Code_ID': '0',
                'ICDCode': '',
                'ICD_Description': '',
                'ICD_Remarks': '',
                'Active_From': '',
                'Active_To': ''

            }];

        }



        /**ICD10_CATEGORY_LIST function**/

        //$http.get(baseUrl + '/api/User/ICD10_CategoryList/').success(function (data) {        
        //});

        /* This is for to add new Add row  function  */
        $scope.PatientICD10Insert = function () {
            if ($scope.AddICD10List.length > 0) {
                var obj = {
                    'Id': 0,
                    'Category_ID': "0",
                    'Category_Name': '',
                    'Code_ID': '0',
                    'ICDCode': '',
                    'ICD_Description': '',
                    'ICD_Remarks': '',
                    'Active_From': '',
                    'Active_To': ''
                }
                $scope.AddICD10List.push(obj);
            }
            else {
                $scope.AddICD10List = [{
                    'Id': 0,
                    'Category_ID': '0',
                    'Category_Name': '',
                    'Code_ID': '0',
                    'ICDCode': '',
                    'ICD_Description': '',
                    'ICD_Remarks': '',
                    'Active_From': '',
                    'Active_To': ''
                }];
            }
            $scope.ICD10codeSearchPopup($scope.AddICD10List.length - 1);

            setTimeout(function () {
                $scope.calenderSet($scope.AddICD10List.length);
            }, 1000);

        }
        $scope.calenderSet = function (idxval) {


            $("#DivICDFrom" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });

            $("#DivICDTo" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });
        }

        /* This is for delete row  function  */
        $scope.ICD10Delete = function (itemIndex) {
            var del = confirm("Do you like to delete the selected ICD10 Details?");
            if (del == true) {

                $scope.AddICD10List.splice(itemIndex, 1);
                if ($scope.AddICD10List.length == 0) {
                    $scope.AddICD10List = [{
                        'Id': 0,
                        'Category_ID': 0,
                        'Category_Name': '',
                        'Code_ID': '0',
                        'ICDCode': '',
                        'ICD_Description': '',
                        'ICD_Remarks': '',
                        'Active_From': '',
                        'Active_To': ''
                    }];

                }
            }
        }

        /* This is for PatientICD10 Insert and update Validations */
        $scope.PatientICD10_InsertUpdateValidations = function () {
            
            var validateflag = true;
            var validationMsg = "";
            angular.forEach($scope.AddICD10List, function (value, index) {
                value.Active_From = moment(value.Active_From).format('DD-MMM-YYYY');
                value.Active_To = moment(value.Active_To).format('DD-MMM-YYYY');

                if (value.Code_ID == 0 || value.Code_ID == "") {
                    validationMsg = validationMsg + "Please select ICD Code";
                    validateflag = false;
                    return false;
                }

                if ((value.Active_From) == "") {
                    validationMsg = validationMsg + "Please select Active From Date";
                    validateflag = false;
                    return false;
                }
                if ((value.Active_To) == "") {
                    validationMsg = validationMsg + "Please select Active To Date";
                    validateflag = false;
                    return false;
                }
                if ((value.Active_From !== null) && (value.Active_To !== null)) {
                    if ((ParseDate(value.Active_To) < ParseDate(value.Active_From))) {
                        validationMsg = validationMsg + "Active From Date should not be greater than Active To Date";
                        value.Active_From = DateFormatEdit(value.Active_From);
                        value.Active_To = DateFormatEdit(value.Active_To);
                        validateflag = false;
                        return false;
                    }
                }
            });

            var TSDuplicate = 0;
            var Duplicateparameter = '';
            angular.forEach($scope.AddICD10List, function (value1, index1) {
                angular.forEach($scope.AddICD10List, function (value2, index2) {
                    if (index1 > index2 && value1.Category_ID == value2.Category_ID && value1.Code_ID == value2.Code_ID) {
                        TSDuplicate = 1;
                        Duplicateparameter = Duplicateparameter + value2.Category_Name + ',';
                    };
                });
            });
            if (TSDuplicate == 1) {
                alert('Category Name' + Duplicateparameter + ' already exist, cannot be Duplicated');
                return false;
            }

            if (validateflag == false) {
                alert(validationMsg);
                return false;
            }
            value.Active_From = DateFormatEdit(value.Active_From);
            value.Active_To = DateFormatEdit(value.Active_To);
            return true;
        }


        /* This is for Patient ICD10 Insert and Update function  */
        $scope.AddICD10List = [];
        $scope.Id = 0;
        $scope.PatientICD10_InsertUpdate = function () {
            if ($scope.PatientICD10_InsertUpdateValidations() == true) {
                $scope.insertcount = 0;
                $scope.ICD10GroupList = [];
                $("#chatLoaderPV").show();
                angular.forEach($scope.AddICD10List, function (value, index) {
                    var obj = {
                        Id: $scope.Id,
                        Code_ID: value.Code_ID,
                        Remarks: value.ICD_Remarks,
                        Patient_Id: $scope.SelectedPatientId,
                        Active_From: $filter('date')(value.Active_From, "dd-MMM-yyyy"),
                        Active_To: $filter('date')(value.Active_To, "dd-MMM-yyyy"),
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                        InstitutionId: $window.localStorage['InstitutionId']
                    }
                    $scope.ICD10GroupList.push(obj);
                })

                $http.post(baseUrl + '/api/User/Patient_ICD10Details_AddEdit/?Login_Session_Id=' + $scope.LoginSessionId, $scope.ICD10GroupList).success(function (data) {
                    //$scope.insertcount = $scope.insertcount+1;                
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    if (data.ReturnFlag == "2") {
                        $scope.CancelAddICD10Popup();
                        $scope.CancelEditICD10Popup();
                        $scope.PatientICD10List();
                    }
                });
            }
        }


        $scope.ActiveStatus = 1;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.ICDListpageTabCount = 1;
        $scope.ICD10TabLoadList = function () {
            $('.chartTabs').addClass('charTabsNone');
            if ($scope.ICDListpageTabCount == 1) {
                $scope.PatientICD10List();
            }
            $scope.ICDListpageTabCount = $scope.ICDListpageTabCount + 1;
        }

        /* Patient ICD10 Details list function*/
        $scope.ICDListTabCount = 1;
        $scope.PatientICD10List = function () {
            $scope.ICD10_flag = 0;
            $scope.DiagnosisICD10List = [];
            $scope.rowcollectionfiltericd10 = [];
            $scope.ISact = 1;
            if ($scope.allergyActive == true) {
                $scope.ISact = 1
            }
            else if ($scope.allergyActive == false) {
                $scope.ISact = -1
            }
            $("#chatLoaderPV").show();
            $scope.SearchMsg = "No Data Available"
            $http.get(baseUrl + 'api/User/PatientICD10_Details_List/?Patient_Id=' + $scope.SelectedPatientId + '&Isactive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DiagnosisICD10List = [];
                $scope.DiagnosisICD10List = data;
                $scope.rowcollectionfiltericd10 = angular.copy($scope.DiagnosisICD10List);
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "the error occured! " + data;
            })
            $scope.SearchMsg = "No Data Available";
        }


        /* FILTER THE  LIST FUNCTION.*/
        $scope.searchquerydata = "";
        $scope.rowcollectionfiltericd10emptyData = [];
        $scope.filterICD10List = function () {
            $scope.ResultListFiltered = [];
            $scope.rowcollectionfiltericd10emptyData = [];
            var searchstring = angular.lowercase($scope.searchquerydata);
            if ($scope.searchquerydata == "") {
                $scope.rowcollectionfiltericd10 = [];
                $scope.rowcollectionfiltericd10 = angular.copy($scope.DiagnosisICD10List);
            }
            else {
                $scope.rowcollectionfiltericd10 = $ff($scope.DiagnosisICD10List, function (value) {
                    return angular.lowercase(value.CategoryName).match(searchstring) ||
                        angular.lowercase(value.ICD_Code).match(searchstring) ||
                        angular.lowercase(value.Description).match(searchstring) ||
                        angular.lowercase(value.Doctor_Name).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Active_From, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Active_To, "dd-MMM-yyyy")).match(searchstring);
                });
            }
        }


        /* Patient ICD10 Details View function*/
        $scope.PatientICD10Details_View = function () {
            $scope.AddICD10List = [];
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/PatientICD10_Details_View/?ID=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.AddICD10List = [{
                    'Id': data.Id,
                    'Category_ID': data.Category_ID == null ? 0 : data.Category_ID.toString(),
                    'Category_Name': data.CategoryName,
                    'Code_ID': data.Code_ID.toString(),
                    'ICD_Code': data.ICD_Code,
                    'ICD_Description': data.Description,
                    'Created_By': data.Doctor_Name,
                    'Active_From': DateFormatEdit($filter('date')(data.Active_From, "dd-MMM-yyyy")),
                    'Active_To': DateFormatEdit($filter('date')(data.Active_To, "dd-MMM-yyyy")),
                    'ICD_Remarks': data.Remarks
                }];

                $scope.Id = data.Id;
                $scope.Category_ID = data.Category_ID;
                $scope.Code_ID = data.Code_ID;
                $scope.CategoryName = data.CategoryName;
                $scope.ICD_Code = data.ICD_Code;
                $scope.ICD_Description = data.Description;
                $scope.Created_By = data.Doctor_Name;
                $scope.Active_From = DateFormatEdit($filter('date')(data.Active_From, "dd-MMM-yyyy"));
                $scope.Active_To = DateFormatEdit($filter('date')(data.Active_To, "dd-MMM-yyyy"));
                $scope.ICD_Remarks = data.Remarks;
                //$scope.Icd10Clear();
                // $scope.ICD10CodeByCategory($scope.Category_ID);
            });
        }


        $scope.Defaultcategory = function () {
            $scope.Category_ID = $scope.Category_ID;
        }

        $scope.Icd10Clear = function () {
            $scope.Id = 0,
                $scope.Category_ID = 0,
                $scope.ICD_Description = "",
                $scope.ICDCode = "",
                $scope.Category_Name = "",
                $scope.Active_From = "",
                $scope.Active_To = "",
                $scope.Code_ID = "",
                $scope.ICD10CodeList = [];
            $scope.ICD10CodeListsFilter = [];
            $scope.selectedICD10Row = "";
        }

        /*THIS IS FOR DELETE FUNCTION */
        $scope.ViewICD10_Delete = function () {

            var del = confirm("Do you like to deactivate the selected ICD 10 details?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/PatientICD10_Details_InActive/?ID=' + $scope.Id).success(function (data) {
                    alert(" ICD10 details has been deactivated Successfully");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                });
            }
        };

        /* Patient ICD10 Details Active function*/
        $scope.ActiveICD10 = function (PId) {
            $scope.Id = PId;
            $scope.ICDMaster_Active();
        };

        $scope.PatientICD10_Active = function () {

            var Ins = confirm("Do you like to activate the selected ICD10 details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/User/PatientICD10_Details_Active/?ID=' + $scope.Id).success(function (data) {
                    alert("Selected ICD 10 details has been activated successfully");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting ICD1O records" + data;
                });
            }
        };
        /***To get ICD10Code Search filter List Function**/
        $scope.ICD10CodeSearch = "";
        $scope.ICD10CodeList = [];
        $scope.ICD10CodeListsFilter = [];
        $scope.SelectedIcdRow = 0;

        $scope.ICD10codesearchkey = function (Selectedrow) {
            var SearchICD10Code = angular.lowercase($scope.ICD10CodeSearch);

            if (SearchICD10Code.length >= 3) {
                $http.get(baseUrl + 'api/User/ICD10Code_List/?ICD10CodeSearch=' + SearchICD10Code + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                    $scope.ICD10CodeList = [];
                    $scope.ICD10CodeListsFilter = [];
                    $scope.ICD10CodeList = data;
                    $scope.ICD10CodeListsFilter = angular.copy($scope.ICD10CodeList);
                    if ($scope.ICD10CodeListsFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $scope.SearchMsg = "No Data Available";
                });
            }

        }

        /**ICD10 Code Search button Click Popup window**/
        $scope.ICD10codeSearchPopup = function (SelectedRow) {
            $scope.ICD10CodeSearch = "";
            $scope.selectedICD10Row = SelectedRow;
            angular.element('#ICD10CodeListModal').modal('show');
            $("#txtICD10CodeSearch").focus();
        }
        /**ICD10 Code Select button Click Popup window**/
        $scope.ICD10CodeSelect = function (ICD10codeItem) {
            angular.forEach($scope.AddICD10List, function (value, index) {

                if (index == $scope.selectedICD10Row) {
                    value.Code_ID = ICD10codeItem.Id;
                    value.ICD_Code = ICD10codeItem.ICD_Code;
                    value.CategoryName = ICD10codeItem.CategoryName;
                    value.Description = ICD10codeItem.Description;
                }
            });
            angular.element('#ICD10CodeListModal').modal('hide');
        }

        /**ICD10 Code Cancel Popup window**/
        $scope.ICD10codeSearchCancelPopup = function () {
            angular.element('#ICD10CodeListModal').modal('hide');
        }

        $scope.InActiveICDPatient = function (comId) {
            $scope.Id = comId;
            $scope.ICD10Details_Delete();
        };
        $scope.ICD10Details_Delete = function () {
            var del = confirm("Do you like to deactivate the selected ICD10 Details?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/PatientICD10Details_InActive/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected ICD10 Details has been deactivated Successfully");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting ICD10 Details!" + data;
                });
            };
        };

        /*'Active' the ICD10Details*/
        $scope.ActiveICDPatient = function (comId) {
            $scope.Id = comId;
            $scope.ICD10Details();

        };

        /* 
        Calling the api method to inactived the details of the ICD10Details 
        for the  ICD10Details Id,
        and redirected to the list page.
        */
        $scope.ICD10Details = function () {
            var Ins = confirm("Do you like to activate the selected ICD10 Details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/User/PatientICD10Details_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected ICD10 Details has been activated successfully");
                    $scope.PatientICD10List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ICD10 Details" + data;
                });
            };
        }

        //  This is for  Patient Medication function	
        // This is for AddPopup	
        $scope.MedicationTabCount = 1;
        $scope.AddMedicationPopUp = function () {
            $scope.PatientMedicationCreateModalClear();
            if ($scope.MedicationTabCount == 1) {
                $scope.DropLoadMedication();
                $scope.MedicationTabCount = $scope.MedicationTabCount + 1;
            }
            angular.element('#PatientMedicationCreateModal').modal('show');
            setTimeout(function () {
                $scope.calenderSet1($scope.AddMedicationDetails.length);
            }, 1000);

        }
        $scope.CancelMedicationPopUp = function () {
            angular.element('#PatientMedicationCreateModal').modal('hide');
        }
        $scope.DrugDropDown = 2;
        //This is for viewpopup	
        $scope.MedicationViewPopup = function (MedicationViewId, editval) {
            if (editval == 2) {
                $scope.Id = MedicationViewId;
                $scope.PatientMedicationView();
                $scope.DrugDropDown = 1;
                $scope.PatientMedicationCreateModalClear();
                angular.element('#ViewMedicationPopModal').modal('show');
            }
        }
        $scope.CancelViewPopup = function () {
            $scope.PatientMedicationCreateModalClear();
            angular.element('#ViewMedicationPopModal').modal('hide');
        }
        //This is for Editpopup	
        $scope.EditMedication = function (MedicationViewId, createdDt, editval) {
            if ($scope.IsEditableCheck(createdDt) == false) {
                alert("Medication Cannot be edited");
            }
            else {
                if (editval == 3) {
                    if ($scope.MedicationTabCount == 1) {
                        $scope.DropLoadMedication();
                        $scope.MedicationTabCount = $scope.MedicationTabCount + 1;
                    }
                    // $scope.medId=MedicationViewId;	
                    $scope.Id = MedicationViewId;
                    $scope.PatientMedicationView();
                    $scope.DrugDropDown = 2;
                    $scope.PatientMedicationCreateModalClear();
                    angular.element('#PatientMedicationEditModal').modal('show');
                }
            }
        }
        $scope.CancelEditPopUp = function () {
            $scope.PatientMedicationCreateModalClear();
            angular.element('#PatientMedicationEditModal').modal('hide');
        }

        $scope.MedicationListTabCount = 1;
        $scope.MedicationTabLoadList = function () {
            $('.chartTabs').addClass('charTabsNone');
            if ($scope.MedicationListTabCount == 1) {
                $scope.PatientMedicationList();
            }
            $scope.MedicationListTabCount = $scope.MedicationListTabCount + 1;
        }
        $scope.FrequencyDuplicateId = "0";
        $scope.RouteDuplicateId = "0";
        $scope.DropLoadMedication = function () {
            if ($scope.UserTypeId == 4 || $scope.UserTypeId == 5 || $scope.UserTypeId == 7) {
                // This is for DropDown list	
                $scope.DrugIds = "0";
                $scope.DrugId = "0";
                $scope.RouteId = "0";
                FrequencyId = "0";
                $scope.DrugbasedDetails = function (DrugId, $index) {
                    $scope.DrugId = DrugId;
                    $http.get(baseUrl + '/api/User/DrugCodeBased_DrugDetails/?DrugCodeId=' + $scope.DrugId + '&Institution_Id=' + $scope.Institution_Id).success(function (data) {
                        angular.forEach($scope.AddMedicationDetails, function (value1, index1) {
                            angular.forEach(data, function (value, index) {
                                if (value1.DrugId == value.DrugId) {
                                    value1.GenericName = value.Generic_name;
                                    value1.StrengthName = value.StrengthName;
                                    value1.Dosage_FromName = value.Dosage_FromName;
                                    value1.Item_Code = value.Item_Code;
                                }
                            });
                        });
                    });
                }
                $scope.DrugbasedDetailsClearFunction = function () {
                    $scope.DrugCodeId = "0";
                }
                $scope.RouteList = [];
                $http.get(baseUrl + 'api/User/RouteList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                    $scope.RouteListTemp = [];
                    $scope.RouteListTemp = data;
                    var obj = { "Id": 0, "RouteName": "Select", "IsActive": 1 };
                    $scope.RouteListTemp.splice(0, 0, obj);
                    $scope.RouteList = angular.copy($scope.RouteListTemp);
                })
                $scope.FrequencyList = [];
                $http.get(baseUrl + 'api/User/FrequencyList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                    $scope.FrequencyListTemp = [];
                    $scope.FrequencyListTemp = data;
                    var obj = { "Id": 0, "FrequencyName": "Select", "IsActive": 1 };
                    $scope.FrequencyListTemp.splice(0, 0, obj);
                    $scope.FrequencyList = angular.copy($scope.FrequencyListTemp);
                })
                $scope.FrequencybasedDetailslist = function (row) {
                    $scope.FrequencyId = row.FrequencyId;
                    $http.get(baseUrl + '/api/User/FrequencybasedDetails/?FrequencyId=' + $scope.FrequencyId).success(function (data) {
                        row.NoOfDays = data.NoOfDays;
                        $scope.NoOfDays = data.NoOfDays;
                    });
                }
            }
        }
        // Add row concept  for Patient MedicationDetails
        $scope.AddMedicationDetails = [{
            'Id': 0,
            'PatientId': 0,
            'DrugId': "",
            'FrequencyId': 0,
            'RouteId': 0,
            'NoOfDays': "",
            ' StartDate': "",
            'EndDate': "",
            ' Created_By': 0

        }];
        // Add row function for Patient MedicationDetails
        $scope.AddMedicationDetailsInsert = function () {
            if ($scope.AddMedicationDetails.length > 0) {
                var obj = {
                    'Id': 0,
                    'PatientId': 0,
                    'DrugId': "",
                    'FrequencyId': 0,
                    'RouteId': 0,
                    ' NoOfDays': "",
                    ' StartDate': "",
                    'EndDate': "",
                    ' Created_By': 0
                }
                $scope.AddMedicationDetails.push(obj);
            }
            else {
                $scope.AddMedicationDetails = [{
                    'Id': 0,
                    'PatientId': 0,
                    'DrugId': "",
                    'FrequencyId': 0,
                    'RouteId': 0,
                    ' NoOfDays': "",
                    ' StartDate': "",
                    'EndDate': "",
                    ' Created_By': 0
                }];
            }
            $scope.DrugcodeSearchPopup($scope.AddMedicationDetails.length - 1);

            setTimeout(function () {
                $scope.calenderSet1($scope.AddMedicationDetails.length);
            }, 1000);

        };
        $scope.calenderSet1 = function (idxval) {
            $("#DivMedicationFrom" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });

            $("#DivMedicationTo" + idxval).bootstrapDP({
                format: "dd-M-yyyy",
                forceParse: false,
                //endDate: '+0d',
                startDate: new Date(),
                autoclose: true,
                todayHighlight: true,
                toggleActive: true,
                todayBtn: true
            });
        }
        //This is for MedicationDetailsDelete
        $scope.MedicationDetailsDelete = function (itemIndex) {
            var del = confirm("Do you like to delete the selected Details?");
            if (del == true) {
                $scope.AddMedicationDetails.splice(itemIndex, 1);
                if ($scope.AddMedicationDetails.length == 0) {
                    $scope.AddMedicationDetails = [{
                        'Id': 0,
                        'PatientId': 0,
                        'DrugId': "",
                        'FrequencyId': 0,
                        'RouteId': 0,
                        ' NoOfDays': "",
                        ' StartDate': "",
                        'EndDate': "",
                        ' Created_By': 0
                    }];
                }
            }
        };
        ///* This is for PatientMedication Insert and update Validations */
        $scope.PatientMedication_InsertUpdate_Validationcontrols = function () {
            var Drugflag = 0;
            var Frequency = 0;
            var Route = 0;
            var Startdate = 0;
            var Enddate = 0;
            var dateval = 0;
            var validateflag = true;
            var validationMsg = "";
            angular.forEach($scope.AddMedicationDetails, function (value, index) {
                value.StartDate = moment(value.StartDate).format('DD-MMM-YYYY');
                value.EndDate = moment(value.EndDate).format('DD-MMM-YYYY');

                if (value.DrugCodeId == null) {
                    Drugflag = 1;
                }
                if (value.FrequencyId == "") {
                    Frequency = 1;
                }
                if (value.RouteId == "") {
                    Route = 1;
                }
                if (value.StartDate == null || value.StartDate == "") {
                    Startdate = 1;
                }
                if (value.EndDate == null || value.EndDate == "") {
                    Enddate = 1;
                }
                if ((value.StartDate !== null) && (value.EndDate !== null)) {

                    if ((ParseDate(value.EndDate) < ParseDate(value.StartDate))) {
                        dateval = 1;
                        value.StartDate = DateFormatEdit(value.StartDate);
                        value.EndDate = DateFormatEdit(value.EndDate);
                    }
                }
            });
            if (Drugflag == 1) {
                alert("Please select Drug Code");
                return false;
            }
            if (Frequency == 1) {
                alert("Please select Frequency");
                return false;
            }
            if (Route == 1) {
                alert("Please select Route");
                return false;
            }
            if (Startdate == 1) {
                alert("Please select Start date");
                return false;
            }
            if (Enddate == 1) {
                alert("Please select End date");
                return false;
            }
            if (dateval == 1) {
                alert("Start Date Should not be greater than End Date");
                return false;
            };
            value.StartDate = DateFormatEdit(value.StartDate);
            value.EndDate = DateFormatEdit(value.EndDate);
            return true;
        }

        //search  query
        $scope.filterMedicationList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.Medicationsearchquery);
            if ($scope.Medicationsearchquery == "") {
                $scope.PatientMedicationListData = angular.copy($scope.PatientMedicationListFilterData);

            }
            else {
                $scope.PatientMedicationListData = $ff($scope.PatientMedicationListFilterData, function (value) {
                    return angular.lowercase(value.Drug_Code).match(searchstring) ||
                        angular.lowercase(value.FrequencyName).match(searchstring) ||
                        angular.lowercase(value.FrequencyName).match(searchstring) ||
                        angular.lowercase(value.Generic_name).match(searchstring) ||
                        angular.lowercase(value.Item_Code).match(searchstring) ||
                        angular.lowercase(value.Dosage_FromName).match(searchstring) ||
                        angular.lowercase(value.StrengthName).match(searchstring) ||
                        //  angular.lowercase(value.NoOfDays).match(searchstring)||
                        angular.lowercase(value.RouteName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.StartDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.EndDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);


                });
            }
        }
        /***To get Drug Code Search filter List Function**/
        $scope.CodeSearch = "";
        $scope.DrugCodeList = [];
        $scope.DrugCodeListsFilter = [];
        $scope.selectedMedicationRow = 0;
        $scope.Drugcodesearchkey = function (selectedRow) {
            var SearchDrugCode = angular.lowercase($scope.CodeSearch);
            if (SearchDrugCode.length > 2) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + 'api/User/DrugCode_List/?DrugCodeSearch=' + SearchDrugCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.SearchMsg = "No Data Available";
                    $scope.DrugCodeList = [];
                    $scope.DrugCodeListsFilter = [];
                    $scope.DrugCodeList = data;
                    $scope.DrugCodeListsFilter = angular.copy($scope.DrugCodeList);
                    if ($scope.DrugCodeListsFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }

                });
            }
            else {
                $scope.DrugCodeList = [];
                $scope.DrugCodeListsFilter = [];
            }
            angular.element('#DrugCodeListModal').modal('show');

        }
        /**Drug Code Search button Click Popup window**/
        $scope.DrugcodeSearchPopup = function (selectedRow) {
            $scope.CodeSearch = "";
            $scope.DrugCodeListsFilter = [];
            $scope.selectedMedicationRow = selectedRow;
            angular.element('#DrugCodeListModal').modal('show');
            $("#txtdrugCodeSearch").focus();
        }
        $scope.DrugCodeSelect = function (rowItem) {
            angular.forEach($scope.AddMedicationDetails, function (value, index) {
                if (index == $scope.selectedMedicationRow) {
                    value.DrugCodeId = rowItem.Id;
                    value.DrugCode = rowItem.Drug_Code;
                    value.Generic_name = rowItem.Generic_name;
                    value.StrengthName = rowItem.StrengthName;
                    value.Dosage_FormName = rowItem.Dosage_FromName;
                    value.Item_Code = rowItem.Item_Code;
                }
            });

            if ($scope.Id > 0) {
                angular.forEach($scope.AddMedicationDetails, function (value, index) {
                    $scope.Generic_name = value.GenericName;
                });
            }
            angular.element('#DrugCodeListModal').modal('hide');
        }

        $scope.DrugcodeSearchCancelPopup = function () {
            angular.element('#DrugCodeListModal').modal('hide');
        }
        $scope.PatientMedication_EditInsert_Validationcontrols = function () {
            if (typeof ($scope.DrugId) == "undefined" || $scope.DrugId == 0) {
                alert("Please select Drug Code");
                return false;
            }
            else if (typeof ($scope.FrequencyId) == "undefined" || $scope.FrequencyId == 0) {
                alert("Please select Frequency");
                return false;
            }
            else if (typeof ($scope.NoOfDays) == "undefined" || $scope.FrequencyId == "") {
                alert("Please enter No. of Days");
                return false;
            }
            else if (typeof ($scope.RouteId) == "undefined" || $scope.RouteId == 0) {
                alert("Please select Route");
                return false;
            }
            else if (typeof ($scope.StartDate) == "undefined" || $scope.StartDate == 0) {
                alert("Please select StartDate");
                return false;
            }
            else if (typeof ($scope.EndDate) == "undefined" || $scope.EndDate == 0) {
                alert("Please select EndDate");
                return false;
            }
            else if (($scope.StartDate !== null) && ($scope.EndDate !== null)) {
                $scope.StartDate = moment($scope.StartDate).format('DD-MMM-YYYY');
                $scope.EndDate = moment($scope.EndDate).format('DD-MMM-YYYY');

                if ((ParseDate($scope.EndDate) < ParseDate($scope.StartDate))) {
                    alert("Start Date Should not be greater than End Date");
                    $scope.StartDate = DateFormatEdit($scope.StartDate);
                    $scope.EndDate = DateFormatEdit($scope.EndDate);
                    return false;
                }
                $scope.StartDate = DateFormatEdit($scope.StartDate);
                $scope.EndDate = DateFormatEdit($scope.EndDate);
            }
            return true;
        };

        $scope.MedicationList = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.PatientMedication_EditInsert = function () {
            $scope.MedicationList = [];
            if ($scope.PatientMedication_EditInsert_Validationcontrols() == true) {
                var Medicationobj = {
                    Id: $scope.Id,
                    PatientId: $scope.SelectedPatientId,
                    DrugId: $scope.DrugCodeId,
                    FrequencyId: $scope.FrequencyId,
                    RouteId: $scope.RouteId,
                    NoOfDays: $scope.NoOfDays,
                    StartDate: $scope.StartDate,
                    EndDate: $scope.EndDate,
                    Created_By: $window.localStorage['UserId'],
                    Modified_By: $window.localStorage['UserId'],
                    InstitutionId: $window.localStorage['InstitutionId']
                }
                $scope.MedicationList.push(Medicationobj);
                $http.post(baseUrl + '/api/User/MedicationInsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.MedicationList).success(function (data) {
                    alert(data.Message);
                    if (data.ReturnFlag == "2") {
                        $scope.PatientMedicationCreateModalClear();
                        $scope.CancelMedicationPopUp();
                        $scope.CancelEditPopUp();
                        $scope.PatientMedicationList();
                    }

                });
            }
        };

        // This is for Medication InsertUpdate
        $scope.Id = 0;
        $scope.AddMedicationDetails = [];
        $scope.PatientMedication_InsertUpdate = function (itemIndex) {

            if ($scope.PatientMedication_InsertUpdate_Validationcontrols() == true) {
                $scope.MedicationList = [];
                $("#chatLoaderPV").show();
                angular.forEach($scope.AddMedicationDetails, function (value, index) {
                    var Medicationobj = {
                        Id: value.Id,
                        PatientId: $scope.SelectedPatientId,
                        DrugId: value.DrugCodeId,
                        FrequencyId: value.FrequencyId,
                        RouteId: value.RouteId,
                        NoOfDays: value.NoOfDays,
                        StartDate: value.StartDate,
                        EndDate: value.EndDate,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.MedicationList.push(Medicationobj);
                });

                $http.post(baseUrl + '/api/User/MedicationInsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.MedicationList).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    if (data.ReturnFlag == "2") {
                        $scope.PatientMedicationCreateModalClear();
                        $scope.CancelMedicationPopUp();
                        $scope.CancelEditPopUp();
                        $scope.PatientMedicationList();
                    }

                });
            }
        }

        //MedicationList
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.Medication_flag = 0;
        $scope.MedicationActive = true;
        $scope.PatientMedicationEmptyData = [];
        $scope.PatientMedicationListData = [];
        $scope.PatientMedicationListFilterData = [];
        $scope.PatientMedicationList = function () {
            $scope.ISact = 1;       // default active
            if ($scope.MedicationActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.MedicationActive == false) {
                $scope.ISact = -1 //all
            }
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/User/MedicationList/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.PatientMedicationEmptyData = [];
                $scope.PatientMedicationDataList = [];
                $scope.PatientMedicationListData = data;
                $scope.PatientMedicationListFilterData = data;
                $scope.PatientMedicationDataList = angular.copy($scope.PatientMedicationListData);
                if ($scope.PatientMedicationDataList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }

            })
        }
        //Medication View	
        $scope.PatientMedicationView = function () {
            $http.get(baseUrl + 'api/User/MedicationView/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.AddMedicationDetails = [{
                    'Id': data.Id,
                    'DrugId': data.DrugId.toString(),
                    'DrugCode': data.Drug_Code,
                    'Generic_name': data.Generic_name,
                    'StrengthName': data.StrengthName,
                    'Item_Code': data.Item_Code,
                    'FrequencyId': data.FrequencyId.toString(),
                    'NoOfDays': data.NoOfDays,
                    'RouteId': data.RouteId.toString(),
                    'StartDate': DateFormatEdit($filter('date')(data.StartDate, "dd-MMM-yyyy")),
                    'EndDate': DateFormatEdit($filter('date')(data.EndDate, "dd-MMM-yyyy"))
                }];
                $scope.Id = data.Id,
                    $scope.DrugId = data.DrugId.toString();
                $scope.Drug_Code = data.Drug_Code;
                $scope.DrugCodeId = data.DrugId,
                    $scope.Generic_name = data.Generic_name,
                    $scope.Item_Code = data.Item_Code,
                    $scope.StrengthName = data.StrengthName,
                    $scope.Dosage_FromName = data.Dosage_FromName,
                    $scope.ViewDrugCode = data.Drug_Code,
                    $scope.FrequencyId = data.FrequencyId.toString(),
                    $scope.FrequencyDuplicateId = $scope.FrequencyId;
                $scope.ViewFrequencyName = data.FrequencyName,
                    $scope.NoOfDays = data.NoOfDays,
                    $scope.RouteId = data.RouteId.toString(),
                    $scope.RouteDuplicateId = $scope.RouteId;
                $scope.ViewRouteName = data.RouteName,
                    $scope.StartDate = DateFormatEdit($filter('date')(data.StartDate, "dd-MMM-yyyy"));
                    $scope.EndDate = DateFormatEdit($filter('date')(data.EndDate, "dd-MMM-yyyy"));
                if ($scope.DrugDropDown == 2) {
                    $scope.DrugbasedDetails($scope.DrugId);
                }
            });
        }
        $scope.PatientMedicationCreateModalClear = function () {

            $scope.AddMedicationDetails = [{
                'Id': 0,
                'DrugId': 0,
                'Generic_name': '',
                'Item_Code': '',
                'Dosage_FromName': '',
                'StrengthName': '',
                'FrequencyId': 0,
                'NoOfDays': '',
                'RouteId': 0,
                'StartDate': '',
                'EndDate': ''

            }];
        }
        $scope.CancelEditMedicationPopUp = function () {
            $scope.PatientMedicationCreateModalClear();
            angular.element('#PatientMedicationEditModal').modal('hide');
        }



        /* 
       Calling the api method to detele the details of the Medication
       for the  Medication Id,
       and redirected to the list page.
       */
        $scope.InActiveMedication = function (MedId) {
            $scope.Id = MedId;
            $scope.Medication_Delete();
        };
        $scope.Medication_Delete = function () {
            var del = confirm("Do you like to deactivate the selected Medication?");
            if (del == true) {
                $http.get(baseUrl + '/api/User/MedicationDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Medication has been deactivated Successfully");
                    $scope.PatientMedicationList();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Medication!" + data;
                });
            };
        };

        /*'Active' the Medication*/
        $scope.ActiveMedication = function (MedId) {
            $scope.Id = MedId;
            $scope.MedicationDetails();
        };

        /* 
        Calling the api method to inactived the details of the Medication 
        for the  Medication Id,
        and redirected to the list page.
        */
        $scope.MedicationDetails = function () {
            var Ins = confirm("Do you like to activate the selected Medication?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/User/MedicationDetails_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Medication has been activated successfully");
                    $scope.PatientMedicationList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while Medication" + data;
                });
            };
        }

        $scope.AllergyTabClick = 1;
        $scope.AllergyClickDetailsList = function () {
            if ($scope.AllergyTabClick == 1) {
                $scope.AllergyDetailsList();
                $scope.AllergyTabClick = $scope.AllergyTabClick + 1;
            }
        }
        $scope.AllergyDropDown = 2;
        $scope.AllergenId = "0";
        $scope.AllergyTypeId = "0";
        $scope.AllergyOnsetId = "0";
        $scope.AllergySeverityId = "0";
        $scope.AllergyReactionId = "0";
        $scope.AllergyDetailsList = function () {
            /* This is for Patient Allergy Details*/
            $scope.AllergyTypeList = [];
            $http.get(baseUrl + 'api/User/AllergyTypeList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergyTypeListTemp = [];
                $scope.AllergyTypeListTemp = data;
                var obj = { "Id": 0, "AllergyTypeName": "Select", "IsActive": 1 };
                $scope.AllergyTypeListTemp.splice(0, 0, obj);
                $scope.AllergyTypeList = angular.copy($scope.AllergyTypeListTemp);
            })


            $scope.AllergenListfilter = [];
            $scope.AllegenBasedType = function (AllergyTypeId) {
                var id = "0"
                id = $scope.AllergenId;
                $http.get(baseUrl + 'api/User/AllergenList/?ALLERGYTYPE_ID=' + AllergyTypeId + '&Institution_Id=' + $scope.Institution_Id).success(function (data) {
                    $scope.AllergenListTemp = [];
                    $scope.AllergenListTemp = data;
                    var obj = { "Id": 0, "AllergenName": "Select", "IsActive": 1 };
                    $scope.AllergenListTemp.splice(0, 0, obj);
                    $scope.AllergenListfilter = angular.copy($scope.AllergenListTemp);
                    $scope.AllergenId = id;

                })
            }


            $scope.AllergenNameClearFunction = function () {
                $scope.AllergenId = "0";
            }

            $scope.AllergyOnsetList = [];
            $http.get(baseUrl + 'api/User/AllergyOnsetList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergyOnsetListTemp = [];
                $scope.AllergyOnsetListTemp = data;
                var obj = { "Id": 0, "AllergyOnsetName": "Select", "IsActive": 1 };
                $scope.AllergyOnsetListTemp.splice(0, 0, obj);
                $scope.AllergyOnsetList = angular.copy($scope.AllergyOnsetListTemp);
            })

            $scope.AllergySeverityList = [];
            $http.get(baseUrl + 'api/User/AllergySeverityList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergySeverityListTemp = [];
                $scope.AllergySeverityListTemp = data;
                var obj = { "Id": 0, "AllergySeverityName": "Select", "IsActive": 1 };
                $scope.AllergySeverityListTemp.splice(0, 0, obj);
                $scope.AllergySeverityList = angular.copy($scope.AllergySeverityListTemp);
            })
            $scope.AllergyReactionList = [];
            $http.get(baseUrl + 'api/User/AllergyReactionList/?Institution_Id=' + $scope.Institution_Id).success(function (data) {
                $scope.AllergyReactionList = data;
            })
        }
        $scope.AddAllergyPopUp = function () {
            $scope.PatientAllergyCreateModalClear();
            $scope.AllergyClickDetailsList();
            angular.element('#PatientAllergyCreateModal').modal('show');
        }
        $scope.CancelAllergyPopUp = function () {
            angular.element('#PatientAllergyCreateModal').modal('hide');
        }

        /*This is for Patient Allergy View Popup*/
        $scope.PatientAllergyViewPopUp = function (AllergyViewId) {
            $scope.PatientAllergyCreateModalClear();
            $scope.Id = AllergyViewId;
            $scope.PatientAllergyView();
            $scope.AllergyDropDown = 1;
            angular.element('#ViewAllergyPopModal').modal('show');
        }
        $scope.CancelViewAllergypopup = function () {
            angular.element('#ViewAllergyPopModal').modal('hide');
        }

        /* This is for Patient Allergy Edit Popup*/
        $scope.EditAllergy = function (AllergyViewId, createdDt) {
            if ($scope.IsEditableCheck(createdDt) == false) {
                alert("Allergy Cannot be edited");
            }
            else {
                $scope.AllergyClickDetailsList();
                $scope.Id = AllergyViewId;
                $scope.PatientAllergyView();
                $scope.AllergyDropDown = 2;
                angular.element('#PatientAllergyCreateModal').modal('show');
            }
        }
        $scope.CancelPopUp = function () {
            angular.element('#PatientAllergyCreateModal').modal('hide');
        }
        /* This is for Allergy Insert Update*/

        $scope.SelectedAllergyReaction = [];
        $scope.SelectedAllergyReactionList = [];
        $scope.Id = 0;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.AllergyInsert_Update = function () {
            if ($scope.AllergyInsert_Update_Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                $scope.SelectedAllergyReactionList = [];
                angular.forEach($scope.SelectedAllergyReaction, function (value, index) {

                    var obj = {
                        Id: value
                    }
                    $scope.SelectedAllergyReactionList.push(obj);
                });
                var obj = {
                    Id: $scope.Id,
                    OnSetDate: $scope.OnSetDate,
                    AllergenId: $scope.AllergenId,
                    AllergyTypeId: $scope.AllergyTypeId,
                    AllergyOnsetId: $scope.AllergyOnsetId == 0 ? null : $scope.AllergyOnsetId,
                    AllergySeverityId: $scope.AllergySeverityId == 0 ? null : $scope.AllergySeverityId,
                    AllergyReactionId: $scope.AllergyReactionId == 0 ? null : $scope.AllergyReactionId,
                    Remarks: $scope.Remarks == '' ? null : $scope.Remarks,
                    SelectedAllergyList: $scope.SelectedAllergyReactionList,
                    AllergyReaction_List: $scope.AllergyReactionList,
                    Patient_Id: $scope.SelectedPatientId,
                    Created_By: $window.localStorage['UserId'],
                    Modified_By: $window.localStorage['UserId'],
                };

                $http.post(baseUrl + 'api/User/Allergy_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    $scope.PatientAllergyList();
                    $scope.PatientAllergyCreateModalClear();
                    $scope.CancelAllergyPopUp();


                });
            }
        }
        /* This is for Mandatorycondition*/
        $scope.AllergyInsert_Update_Validationcontrols = function () {
            if (typeof ($scope.AllergyTypeId) == "" || $scope.AllergyTypeId == "0") {
                alert("Please select Allergy Type Name ");
                return false;
            }
            else if (typeof ($scope.AllergenId) == "" || $scope.AllergenId == "0") {
                alert("Please select Allergen Name");
                return false;
            }
            return true;
        }
        /* This is for Patient Allergy List*/
        $scope.Allergy_flag = 0;
        $scope.PatientAllergyListData = [];
        $scope.PatientAllergyListFilterData = [];
        $scope.PatientAssignedknownAllergyDataList = [];
        $scope.PatientAssignedknownAllergyActiveDataList = [];
        $scope.PatientAssignedAllergyDataList = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.PatientAllergyList = function () {
            $("#chatLoaderPV").show();
            $('.chartTabs').addClass('charTabsNone');
            $scope.ISact = 1;       // default active
            if ($scope.allergyActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.allergyActive == false) {
                $scope.ISact = -1 //all
            }
            $http.get(baseUrl + 'api/User/PatientAllergylist/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.PatientAllergyEmptyData = [];
                $scope.PatientAllergyListData = [];
                $scope.PatientAssignedAllergyDataList = [];
                $scope.PatientAllergyListData = data;
                $scope.PatientAllergyListFilterData = data;
                $scope.PatientAssignedAllergyDataList = angular.copy($scope.PatientAllergyListData);

                // $scope.PatientAssignedknownAllergyDataList =angular.copy($scope.PatientAssignedAllergyDataList);
                $scope.PatientAssignedknownAllergyActiveDataList = $ff($scope.PatientAllergyListFilterData, { IsActive: 1 }, true);

                if ($scope.PatientAssignedAllergyDataList.length > 0) {
                    $scope.Allergy_flag = 1;
                }
                else {
                    $scope.Allergy_flag = 0;
                }
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        };
        /* 
     Calling the api method to detele the details of the Allergy
     for the  Allergy Id,
     and redirected to the list page.
     */
        $scope.InActiveAllergy = function (comId) {
            $scope.Id = comId;
            $scope.Allergy_InActive();
        };
        $scope.Allergy_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Allergy?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/User/AllergyDetails_InActive/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.PatientAllergyList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                });
            };
        };

        /*'Active' the Allergy*/
        $scope.ActiveAllergy = function (comId) {
            $scope.Id = comId;
            $scope.Allergy_Active();
        };
        /* 
        Calling the api method to inactived the details of the Allergy 
        for the  Allergy Id,
        and redirected to the list page.
        */
        $scope.Allergy_Active = function () {
            var Ins = confirm("Do you like to activate the selected Allergy?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/User/AllergyDetails_Active/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.PatientAllergyList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                });
            };
        }

        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }
        $scope.AllergyTypeeId = "0";
        $scope.SeverityIdTemp = "";
        $scope.AssignedSeverityId = "";
        $scope.AllergyTypeDuplicateId = "0";
        $scope.AllergenDuplicateId = "0";
        /*This is for Patient Allergy View*/
        $scope.EditSelectedAllergyReaction = [];
        $scope.PatientAllergyView = function () {
            $("#chatLoaderPVV").show();
            $scope.AllergenListfilter = [];
            $scope.EditSelectedAllergyReaction = []

            $http.get(baseUrl + 'api/User/PatientAllergyView/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                console.log(data);
                $scope.AllergyTypeId = data.AllergyTypeId.toString();
                $scope.AllergyTypeDuplicateId = $scope.AllergyTypeId;

                $scope.AllergenId = data.AllergenId.toString();
                $scope.AllergenDuplicateId = $scope.AllergenId;
                if ($scope.AllergyDropDown == 2) {
                    $scope.AllegenBasedType($scope.AllergyTypeId);
                }
                $scope.ViewAllergyType = data.AllergyTypeName;
                $scope.ViewAllegenName = data.AllergenName;
                if (data.AllergySeverityId != null) {
                    $scope.SeverityIdTemp = data.AllergySeverityId;
                    $scope.ViewSeverity = data.AllergySeverityName;
                    $scope.AssignedSeverityId = $scope.SeverityIdTemp;
                    $scope.AllergySeverityId = $scope.SeverityIdTemp.toString();
                }
                else {
                    $scope.ViewSeverity = "";
                    $scope.AllergySeverityId = "0";
                }
                if (data.AllergyOnsetId == null) {
                    $scope.AllergyOnsetId = "0";
                }
                else {
                    $scope.AllergyOnsetId = data.AllergyOnsetId.toString();
                }
                $scope.ViewOnset = data.AllergyOnsetName,
                $scope.OnSetDate = DateFormatEdit($filter('date')(data.OnSetDate, "dd-MMM-yyyy"));
                $scope.Remarks = data.Remarks;
                $scope.ViewAllergyReactionName = data.AllergyReactionName;
                // For Multiselect dropdown	
                angular.forEach(data.AllergyReaction_List, function (value, index) {
                    $scope.EditSelectedAllergyReaction.push(value.Id);
                    $scope.SelectedAllergyReaction = $scope.EditSelectedAllergyReaction;
                });
            });
            $("#chatLoaderPVV").hide();
        }
        /*  This is for Allergy searchquery*/
        $scope.filterAllergyList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.Allergysearchquery);
            if ($scope.Allergysearchquery == "") {
                $scope.PatientAssignedAllergyDataList = angular.copy($scope.PatientAllergyListFilterData);
            }
            else {
                var val;
                $scope.PatientAssignedAllergyDataList = $ff($scope.PatientAllergyListFilterData, function (value) {


                    return angular.lowercase(value.AllergyTypeName).match(searchstring) ||
                        angular.lowercase(value.AllergenName).match(searchstring) ||
                        angular.lowercase(value.AllergySeverityName).match(searchstring) ||
                        angular.lowercase(value.AllergyOnsetName).match(searchstring) ||
                        angular.lowercase(value.AllergyReactionName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.OnSetDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
                if ($scope.PatientAssignedAllergyDataList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        $scope.PatientAllergyCreateModalClear = function () {
            $scope.Id = "0";
            $scope.AllergenId = "0";
            $scope.AllergyTypeId = "0";
            $scope.AllergyOnsetId = "0";
            $scope.AllergySeverityId = "0";
            $scope.AllergyReactionId = "0";
            $scope.OnSetDate = "";
            $scope.Remarks = "";
            $scope.SelectedAllergyReaction = "";
        }



        //Initilization For Patient Notes
        $scope.Id = "0";
        $scope.Notes = "";
        $scope.PatientNotesrowCollectionFilter = [];

        //To open a popup window form for add new notes
        $scope.PatientNotesAddPopup = function () {
            $scope.Id = 0;
            $scope.PatientNotesClear();
            angular.element('#PatientNotesAddEditModal').modal('show');
        }

        //To Close the patient notes model window for Add and Edit function. 
        $scope.CancelPatientNotesAddPopup = function () {
            angular.element('#PatientNotesAddEditModal').modal('hide');
        }


        //This is opening popup window form for view
        $scope.ViewPatientNotesPopUP = function (PatNoteId) {
            $scope.PatientNotesClear();
            $scope.Id = PatNoteId;
            $scope.PatientDetails_View();
            angular.element('#ViewPatientNoteModal').modal('show');

        }


        //To close the view patient popup modal
        $scope.CancelViewPatientNotespopup = function () {
            angular.element('#ViewPatientNoteModal').modal('hide');
        }


        //Edit Function for doctor notes open in modal window with data
        $scope.EditPatientNotes = function (PatNoteId, createdDt) {
            if ($scope.IsEditableCheck(createdDt) == false) {
                alert("Notes Cannot be edited");
            }
            else {
                $scope.Id = PatNoteId;
                $scope.PatientDetails_View();
                angular.element('#PatientNotesAddEditModal').modal('show');
            }

        }

        //Validation for insert function
        $scope.PatientNotesInsertUpdate_Validations = function () {
            if (typeof ($scope.Notes) == "" || $scope.Notes == "") {
                alert("Please enter Notes");
                return false;
            }
            return true;
        };

        //Insert function for doctor Notes
        $scope.PatientNotesInsertUpdate = function () {
            if ($scope.PatientNotesInsertUpdate_Validations() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    PatientId: $scope.SelectedPatientId,
                    Notes: $scope.Notes,
                    Created_By: $window.localStorage['UserId'],
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/PatientNotesInsertUpdate/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    if (data.ReturnFlag == "1") {
                        $scope.CancelPatientNotesAddPopup();
                        $scope.patientnotelist();
                    }
                }).error(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.error = "An error has occurred while adding patient notes" + data.ExceptionMessage;
                });
            }
        }
        $scope.PatientNotesListTabCount = 1;
        $scope.ClinicalNotesListData = function (CurrentTab) {
            if (CurrentTab == 7) {
                if ($scope.PatientNotesListTabCount == 1) {
                    $('.chartTabs').addClass('charTabsNone');
                    $scope.patientnotelist();
                }
                $scope.PatientNotesListTabCount = $scope.PatientNotesListTabCount + 1;
            }
        }
        $scope.NotesActive = true;

        //List function for doctor Notes   
        $scope.patientnotelist = function () {
            $scope.PatientNotesemptydata = [];
            $scope.PatientNotesrowCollection = [];
            $scope.ISact = 1;
            if ($scope.NotesActive == true) {
                $scope.ISact = 1
            }
            else if ($scope.NotesActive == false) {
                $scope.ISact = -1
            }
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/User/PatientNotes_List/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ISact + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.PatientNotesemptydata = [];
                $scope.PatientNotesrowCollection = [];
                $scope.PatientNotesrowCollection = data;
                $scope.PatientNotesrowCollectionFilter = angular.copy($scope.PatientNotesrowCollection);
                if ($scope.PatientNotesrowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "the error occured! " + data;
            })
        }

        //Search function for doctor notes
        $scope.filterPatientNotesList = function () {
            var searchstring = angular.lowercase($scope.searchNotesData);
            if ($scope.searchNotesData == "") {
                $scope.PatientNotesrowCollectionFilter = [];
                $scope.PatientNotesrowCollectionFilter = angular.copy($scope.PatientNotesrowCollection);
            }
            else {
                $scope.PatientNotesrowCollectionFilter = $ff($scope.PatientNotesrowCollection, function (value) {
                    return angular.lowercase(value.Notes).match(searchstring) ||
                        angular.lowercase(value.Created_By_Name).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
            }
        }

        //View Function for Doctor Notes
        $scope.PatientDetails_View = function () {
            $http.get(baseUrl + '/api/User/PatientNotes_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.Notes = data.Notes;
            });
        }

        //To open a patient notes show more function modal window
        $scope.NotesPopupModal = function (Notes, rowlist) {
            $scope.NotesFilterList = [];
            $scope.PatientNotesFilterNo = [];
            $scope.Notes = rowlist.Notes;
            angular.element('#ViewPatientNoteModal').modal('show');

        };

        //list page show 'more' function
        $(function () {
            $('[data-toggle="modal"]').hover(function () {
                var modalId = $(this).data('target');
                $(modalId).modal('hide');
            });

        });

        //To Clear the Notes in popup window
        $scope.PatientNotesClear = function () {
            $scope.Notes = "";
        }

        // Patient Other Data
        $scope.Patient_OtherData_AddModal = function () {
            angular.element('#Patient_OtherData_AddModal').modal('show');
        }
        $scope.Patient_OtherData_ViewModal = function (Id) {
            $scope.Patient_OtherData_View(Id);
            angular.element('#Patient_OtherData_ViewModal').modal('show');
        }
        $scope.Patient_OtherData_EditModal = function (Id, createdDt) {
            if ($scope.IsEditableCheck(createdDt) == false) {
                alert("Other Data Cannot be edited");
            }
            else {
                $scope.Patient_OtherData_View(Id);
                angular.element('#OtherData_EditModel').modal('show');
            }
        }
        $scope.OtherData_CancelPopup = function () {
            angular.element('#Patient_OtherData_AddModal').modal('hide');
            angular.element('#Patient_OtherData_ViewModal').modal('hide');
            angular.element('#OtherData_EditModel').modal('hide');
            $scope.OtherData_ClearPopup();
        }
        $scope.OtherData_ClearPopup = function () {
            $scope.Patient_OtherData = [{
                'OtherData_Id': 0,
                'resumedoc': $scope.resumedoc,
                'DocumentName': '',
                'Remarks': '',
            }];
            $scope.Remarks = "";
            $scope.DocumentName = "";
            $scope.EditFileName = "";
            $scope.Editresumedoc = "";
        }
        $scope.Patient_OtherData = [];
        $scope.Patient_OtherData = [{
            'OtherData_Id': 0,
            'resumedoc': $scope.resumedoc,
            'DocumentName': '',
            'Remarks': '',
        }];

        $scope.AddPatient_OtherData = function () {
            if ($scope.Patient_OtherData.length > 0) {
                var obj =
                {
                    'OtherData_Id': 0,
                    'resumedoc': $scope.resumedoc,
                    'DocumentName': '',
                    'Remarks': '',
                }
                $scope.Patient_OtherData.push(obj);
            }
            else {
                $scope.Patient_OtherData = [{
                    'OtherData_Id': 0,
                    'resumedoc': $scope.resumedoc,
                    'DocumentName': '',
                    'Remarks': '',
                }];
            };
        };
        $scope.docfileChange = function (e, index) {
            //if ($('#Userdocument')[0].files[0] != undefined) {
            //    $scope.CertificateFileName = $('#Userdocument')[0].files[0]['name'];
            //}
            var row = $scope.Patient_OtherData[index];
            if (row != undefined)
                row.CertificateFileName = e.files[0]['name'];
        }

        $scope.EditdocfileChange = function () {
            if ($('#EditDocument')[0].files[0] != undefined) {
                $scope.EditFileName = $('#EditDocument')[0].files[0]['name'];
            }
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
        $scope.Patient_OtherData_Insert_Validations = function () {
            if ($scope.Patient_OtherData.length == 0) {
                alert("Please add atleast one row");
                return false;
            }
            else {
                var AMitem = 0;
                angular.forEach($scope.Patient_OtherData, function (value, index) {
                    if ((value.DocumentName == null) || (value.DocumentName == undefined) || (value.DocumentName == "")) {
                        AMitem = 1;
                    }

                    $scope.filetype = value.CertificateFileName.split(".");
                    var fileExtenstion = "";
                    if ($scope.filetype.length > 0) {
                        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
                    }

                    //OpenDocument Text Documen (.odt),Microsoft Word Open XML Document (.docx),Microsoft Word Document (.doc),LaTex (.tex)
                    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico"
                        || fileExtenstion.toLocaleLowerCase() == "pdf" || fileExtenstion.toLocaleLowerCase() == "xls" || fileExtenstion.toLocaleLowerCase() == "xlsx"
                        || fileExtenstion.toLocaleLowerCase() == "doc" || fileExtenstion.toLocaleLowerCase() == "docx" || fileExtenstion.toLocaleLowerCase() == "odt"
                        || fileExtenstion.toLocaleLowerCase() == "txt" || fileExtenstion.toLocaleLowerCase() == "pptx" || fileExtenstion.toLocaleLowerCase() == "ppt"
                        || fileExtenstion.toLocaleLowerCase() == "rtf" || fileExtenstion.toLocaleLowerCase() == "tex"
                    ) {// check more condition with MIME type                      
                        fileval = 1;
                    }
                    else {
                        fileval = 2;
                    }
                    if (fileval == 2) {
                        alert("Please choose files of type jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex");
                        return false;
                    }
                });

                if ($scope.Patient_OtherData.length < 1 || AMitem == 1) {
                    alert("Please enter Document Name");
                    return false;
                }
                var Uploaditem = 0;
                angular.forEach($scope.Patient_OtherData, function (value, index) {
                    if ((value.CertificateFileName == null) || (value.CertificateFileName == undefined) || (value.CertificateFileName == "")) {
                        Uploaditem = 1;
                    }
                    else if ($scope.dataURItoBlob(value.resumedoc).size > 5242880) {

                        Uploaditem = 2;
                    }
                });
                if ($scope.Patient_OtherData.length < 1 || Uploaditem == 1) {
                    alert("Please upload Document");
                    return false;
                }
                else if (Uploaditem == 2) {
                    alert("Uploaded file size cannot be greater than 5MB");
                    return false;
                }
            }
            return true;
        }

        $scope.Patient_OtherData_InsertUpdate = function () {
            if ($scope.Patient_OtherData_Insert_Validations() == true) {
                $("#chatLoaderPV").show();
                var cnt = $scope.Patient_OtherData.length;
                $scope.insertcount = 0;
                angular.forEach($scope.Patient_OtherData, function (value, index) {
                    $scope.Id = "0",
                        $scope.Patient_Id = $scope.SelectedPatientId,
                        $scope.FileName = value.CertificateFileName,
                        $scope.DocumentName = value.DocumentName,
                        $scope.Remarks = value.Remarks,
                        $scope.Created_By = $window.localStorage['UserId'];
                    $scope.Modified_By = $window.localStorage['UserId'];
                    var fd = new FormData();
                    var imgBlob;
                    var imgBlobfile;
                    var itemIndexLogo = -1;
                    var itemIndexdoc = -1;
                    imgBlob = $scope.dataURItoBlob(value.resumedoc);
                    itemIndexLogo = 0;
                    if (itemIndexLogo != -1) {
                        fd.append('file', imgBlob);
                    }
                    /*
                    calling the api method for read the file path
                    and saving the image uploaded in the local server.
                    */
                    $http.post(baseUrl + '/api/User/Patient_OtherData_InsertUpdate?Patient_Id=' + $scope.SelectedPatientId + '&Id=' + $scope.Id + '&FileName=' + value.CertificateFileName + '&DocumentName=' + $scope.DocumentName + '&Remarks=' + $scope.Remarks + '&Created_By=' + $scope.Created_By,
                        fd,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    )
                        .success(function (response) {
                            $scope.insertcount = $scope.insertcount + 1;

                            if (cnt == $scope.insertcount) {
                                $("#chatLoaderPV").hide();
                                alert(response.Message);
                                $scope.OtherData_CancelPopup();
                                $scope.Patient_OtherData_List();
                            }
                        });
                })
            }
        }

        $scope.Patient_OtherData_Update_Validations = function () {


            if (typeof ($scope.DocumentName) == "undefined" || $scope.DocumentName == "" || $scope.DocumentName == null) {
                alert("Please enter Document Name");
                return false;
            }
            if (typeof ($scope.EditFileName) == "undefined" || $scope.EditFileName == "" || $scope.EditFileName == null) {
                alert("Please Upload Document");
                return false;
            }
            var fileval = 0;
            $scope.filetype = $scope.EditFileName.split(".");
            var fileExtenstion = "";

            if ($scope.filetype.length > 0) {
                fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
            }
            if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
                || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico"
                || fileExtenstion.toLocaleLowerCase() == "pdf" || fileExtenstion.toLocaleLowerCase() == "xls" || fileExtenstion.toLocaleLowerCase() == "xlsx"
                || fileExtenstion.toLocaleLowerCase() == "doc" || fileExtenstion.toLocaleLowerCase() == "docx" || fileExtenstion.toLocaleLowerCase() == "odt"
                || fileExtenstion.toLocaleLowerCase() == "txt" || fileExtenstion.toLocaleLowerCase() == "pptx" || fileExtenstion.toLocaleLowerCase() == "ppt"
                || fileExtenstion.toLocaleLowerCase() == "rtf" || fileExtenstion.toLocaleLowerCase() == "tex"
            ) {// check more condition with MIME type                      
                fileval = 1;
            }
            else {
                fileval = 2;
            }
            if (fileval == 2) {
                alert("Please choose jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex file.");
                return false;
            }
            if ($scope.CertificateValue == 1) {
                if ($scope.dataURItoBlob($scope.EditFileName).size > 5242880) {
                    alert("Uploaded file size cannot be greater than 5MB");
                    return false;
                }
            }
            return true;
        }

        $scope.CertificateValue = 0;
        $scope.CertificateUplaodSelected = function () {
            $scope.CertificateValue = 1;
        };
        $scope.Editresumedoc = "";
        $scope.Patient_OtherData_Edit = function () {
            if ($scope.Patient_OtherData_Update_Validations() == true) {
                $scope.Id = $scope.OtherData_Id,
                    $scope.Patient_Id = $scope.SelectedPatientId;
                $scope.Created_By = $window.localStorage['UserId'];
                $scope.Modified_By = $window.localStorage['UserId'];
                var fd = new FormData();
                var imgBlob;
                var imgBlobfile;
                var itemIndexLogo = -1;
                var itemIndexdoc = -1;

                if ($('#EditDocument')[0].files[0] != undefined) {
                    CertificateFileName = $('#EditDocument')[0].files[0]['name'];
                    imgBlob = $scope.dataURItoBlob($scope.Editresumedoc);
                    if (itemIndexLogo == -1) {
                        itemIndexfile = 0;
                    }
                    else {
                        itemIndexfile = 1;
                    }
                }
                if (itemIndexLogo != -1) {
                    fd.append('file', imgBlob);
                }
                /*
                calling the api method for read the file path
                and saving the image uploaded in the local server.
                */
                $http.post(baseUrl + '/api/User/Patient_OtherData_InsertUpdate?Patient_Id=' + $scope.SelectedPatientId + '&Id=' + $scope.Id + '&FileName=' + $scope.EditFileName + '&DocumentName=' + $scope.DocumentName + '&Remarks=' + $scope.Remarks + '&Created_By=' + $scope.Created_By,
                    fd,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                )
                    .success(function (response) {
                        alert(response.Message);
                        $scope.OtherData_CancelPopup();
                        $scope.Patient_OtherData_List();
                        $("#EditDocument").val('');
                    });
            }
        }

        $scope.PatientOtherDataListTabCount = 1;
        $scope.OthersListData = function (CurrentTab) {
            if (CurrentTab == 8) {
                if ($scope.PatientOtherDataListTabCount == 1) {
                    $('.chartTabs').addClass('charTabsNone');
                    $scope.Patient_OtherData_List();
                }
                $scope.PatientOtherDataListTabCount = $scope.PatientOtherDataListTabCount + 1;
            }
        }

        $scope.OtherData_IsActive = true;
        $scope.OtherData_List = [];
        $scope.OtherData_ListData = [];
        $scope.OtherDataflag = 0;
        $scope.Add_OtherDataflag = 0;
        $scope.OtherData_searchquery == ""
        $scope.Patient_OtherData_List = function () {
            $scope.ActiveStatus = $scope.OtherData_IsActive == true ? 1 : -1;
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/User/Patient_OtherData_List/?Patient_Id=' + $scope.SelectedPatientId + '&IsActive=' + $scope.ActiveStatus + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.SearchMsg = "No Data Available";
                $scope.OtherDataEmptyData = [];
                $scope.OtherData_List = [];
                $scope.OtherData_List = data;
                $scope.OtherData_ListData = angular.copy($scope.OtherData_List);
                if ($scope.OtherData_ListData.length > 0) {
                    $scope.OtherDataflag = 1;
                }
                else {
                    $scope.OtherDataflag = 0;
                }
            })
        }
        $scope.filter_OtherData = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.OtherData_searchquery);
            if ($scope.OtherData_searchquery == "") {
                $scope.OtherData_ListData = angular.copy($scope.OtherData_List);
            }
            else {
                $scope.OtherData_ListData = $ff($scope.OtherData_List, function (value) {
                    return angular.lowercase(value.DocumentName).match(searchstring) ||
                        angular.lowercase(value.FileName).match(searchstring) ||
                        angular.lowercase(value.Created_Name).match(searchstring) ||
                        angular.lowercase(value.Created_Date).match(searchstring);
                });
                if ($scope.OtherData_ListData.length > 0) {
                    $scope.OtherDataflag = 1;
                }
                else {
                    $scope.OtherDataflag = 0;
                }
            }

        }
        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }
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
        $scope.DownloadDocument = function (GetId) {
            $scope.OtherData_Id = GetId;
            var a = document.createElement("a");
            document.body.appendChild(a);
            $http.get(baseUrl + '/Home/GetPatient_OtherDataDocument/?Id=' + $scope.OtherData_Id).success(function (data) {
            });

        };
        $scope.Patient_OtherData_View = function (Id) {
            $scope.OtherData_Id = Id;
            $http.get(baseUrl + '/api/User/Patient_OtherData_View/Id?=' + $scope.OtherData_Id).success(function (data) {
                $scope.OtherData_Id = data.Id;
                $scope.FileName = data.FileName;
                $scope.EditFileName = data.FileName;

                $scope.DocumentName = data.DocumentName;
                $scope.Remarks = data.Remarks;
            });
        }
        $scope.RemovePatient_OtherData_Item = function (rowIndex) {
            var del = confirm("Do you like to delete document");
            if (del == true) {
                var Previous_DocumentItem = [];

                angular.forEach($scope.Patient_OtherData, function (selectedPre, index) {
                    if (index != rowIndex)
                        Previous_DocumentItem.push(selectedPre);
                });
                $scope.Patient_OtherData = Previous_DocumentItem;
                if ($scope.Patient_OtherData.length > 0) {
                    $scope.Add_OtherDataflag = 1;
                }
                else {
                    $scope.Add_OtherDataflag = 0;
                }
            }
        };
        $scope.Patient_OtherData_InActive = function (GetId) {
            $scope.Id = GetId;
            var del = confirm("Do you like to deactivate the selected Document?");
            if (del == true) {
                var obj = {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/Patient_OtherData_InActive', obj).success(function (data) {
                    alert(data.Message);
                    $scope.Patient_OtherData_List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Document" + data;
                });
            }
        };

        $scope.Patient_OtherData_Active = function (GetId) {
            $scope.Id = GetId;
            var del = confirm("Do you like to activate the selected Document?");
            if (del == true) {
                var obj = {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/Patient_OtherData_Active', obj).success(function (data) {
                    alert(data.Message);
                    $scope.Patient_OtherData_List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Document" + data;
                });
            }
        };

        $scope.Allergies = function () {
            angular.element('#PatientAllergyListModal').modal('show');
        }

        $scope.NoknownAllergies = function () {
            angular.element('#PatientAllergyListModal').modal('show');
        }

        $scope.DoctorNotesDetails_InActive = function (comId) {
            $scope.Id = comId;
            $scope.DoctorNotes_Delete();
        };
        $scope.DoctorNotes_Delete = function () {
            var del = confirm("Do you like to deactivate the selected Notes?");
            if (del == true) {
                var obj = {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/DoctorNotesDetails_InActive/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.patientnotelist();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                });
            }
        };

        /*'Active' the Institution*/
        $scope.DoctorNotesDetails_Active = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertDoctorNotesDetails();

        };

        /* 
        Calling the api method to inactived the details of the company 
        for the  company Id,
        and redirected to the list page.
        */
        $scope.ReInsertDoctorNotesDetails = function () {
            var Ins = confirm("Do you like to activate the selected Notes?");
            if (Ins == true) {
                var obj = {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId'],
                }
                $http.post(baseUrl + '/api/User/DoctorNotesDetails_Active/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.patientnotelist();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Doctor Notes" + data;
                });

            };
        }




    }
]);

// This is for Patient Appointments controller functions//    
MyCortexControllers.controller("PatientAppointmentController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.Doctor_Id = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.AppointmentDate = "";
        $scope.ReasonTypeId = 0;

        $scope.ViewPatientPopUp = function (eventId) {
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/2";
        }

        $scope.ViewPatientPopUp_30days = function (eventId) {
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/3";
        }

        $scope.CancelAppointmentModal = function (AppointmentId, AppointmentDate) {
            $scope.Cancelled_Remarks = "";
            $scope.Appointment_Id = AppointmentId;
            $scope.AppointmentDate = moment(AppointmentDate).format('DD-MMM-YYYY');
            angular.element('#PatientAppointmentModal').modal('show');
            $scope.ReasonTypeDropDownList();
            $scope.ClearAppointments();
            $scope.Cancelled_Remarks = "";
            $scope.ReasonTypeId = 0;
        }

        $scope.Cancel_CancelledAppointment = function (AppointmentId) {
            angular.element('#PatientAppointmentModal').modal('hide');
            $scope.Cancelled_Remarks = "";
            $scope.ReasonTypeId = 0;
        }
        $scope.ClearAppointments = function () {
            $scope.Cancelled_Remarks = "";
            $scope.ReasonTypeId = 0;
        }
        $scope.ReasonTypeDropDownList = function () {
            $http.get(baseUrl + '/api/PatientAppointments/AppointmentReasonType_List/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                $scope.AppointmentReasonTypeListTemp = [];
                $scope.AppointmentReasonTypeListTemp = data;
                var obj = { "ReasonTypeId": 0, "ReasonType": "Select", "IsActive": 1 };
                $scope.AppointmentReasonTypeListTemp.splice(0, 0, obj);
                $scope.AppointmentReasonTypeList = angular.copy($scope.AppointmentReasonTypeListTemp);
            });
        };
        $scope.Update_CancelledAppointment = function () {
            $("#chatLoaderPV").show();
            if (typeof ($scope.ReasonTypeId) == "undefined" || $scope.ReasonTypeId == "") {
                alert("Please select Reason Type for  cancellation");
                return false;
            }
            else {
                var obj = {
                    CancelledBy_Id: $scope.Doctor_Id,
                    Id: $scope.Appointment_Id,
                    Cancelled_Remarks: $scope.Cancelled_Remarks,
                    ReasonTypeId: $scope.ReasonTypeId
                }
                $http.post(baseUrl + '/api/PatientAppointments/CancelPatient_Appointment/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    alert(data.Message);
                    angular.element('#PatientAppointmentModal').modal('hide');
                    $scope.Cancelled_Remarks = "";
                    $scope.ReasonTypeId = '0';
                    // refresh monthly calendar
                    $scope.flag = 2;
                    $scope.dataCalendar1 = [];
                    $("#chatLoaderPV1").show();
                    $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
                        angular.forEach(patientdata, function (value, index) {
                            var obj = {
                                title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                                start: value.Appointment_FromTime,
                                end: value.Appointment_ToTime,
                                id: value.Patient_Id,
                                PatientName: value.PatientName,
                                Appointment_Id: value.Id,
                                MRN_No: value.MRN_No,
                                Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                                Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                                ReasonForVisit: value.ReasonForVisit
                            };
                            $scope.dataCalendar1.push(obj);
                        })
                        $('#calendar1').fullCalendar('removeEvents');
                        $('#calendar1').fullCalendar('removeEventSource', $scope.dataCalendar1)
                        $('#calendar1').fullCalendar('addEventSource', $scope.dataCalendar1)
                        $('#calendar1').fullCalendar('refetchEvents');
                        $("#chatLoaderPV1").hide();
                    }).error(function (data) {
                        $("#chatLoaderPV1").hide();
                        $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                    });

                    // refresh daily calendar
                    $scope.dataCalendar = [];
                    $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + $scope.AppointmentDate + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                        angular.forEach(data, function (value, index) {
                            var obj = {
                                title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                                start: value.Appointment_FromTime,
                                end: value.Appointment_ToTime,
                                id: value.Patient_Id,
                                PatientName: value.PatientName,
                                Appointment_Id: value.Id,
                                MRN_No: value.MRN_No,
                                Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                                Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                                ReasonForVisit: value.ReasonForVisit
                            };
                            $scope.dataCalendar.push(obj);
                        });
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar('removeEventSource', $scope.dataCalendar)
                        $('#calendar').fullCalendar('addEventSource', $scope.dataCalendar)
                        $('#calendar').fullCalendar('refetchEvents');
                        $("#chatLoaderPV").hide();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                    });
                }).error(function (data) {
                    $scope.error = "An error has occurred while Updating Appointment Details" + data;
                });
                $('#calendar1').fullCalendar('gotoDate', $scope.AppointmentDate);
                $('#calendar').fullCalendar('gotoDate', $scope.AppointmentDate);
            }
        }
        $scope.flag = 1;
        var scrollTime = moment().format("HH:mm:ss");
        angular.element(document).ready(function () {
            var calendar = $('#calendar').fullCalendar(
                {
                    timeZone: 'UTC',
                    scrollTime: scrollTime,
                    slotDuration: '00:15:00',
                    eventLimit: true,
                    displayEventTime: false,
                    slotEventOverlap: false,
                    header: {
                        left: '',
                        center: 'title',
                        right: ''
                    },
                    titleFormat: {
                        month: 'MMMM YYYY',   // like 'September 2009', for month view
                        week: 'MMM D YYYY', // like 'Sep 13 2009', for week views
                        day: 'MMMM D YYYY' // like 'September 8 2009', for day views
                    },
                    views: {
                        agendaFiveDay: {
                            type: 'agenda',
                            duration: { days: 5 },
                            buttonText: 'Five Day'
                        }
                    },
                    defaultView: 'agendaDay',
                    selectable: true,
                    selectHelper: true,
                    //eventClick: function (calEvent, jsEvent, view) {
                    //},
                    // Remove Event On Click
                    eventRender: function (event, element) {
                        if (event.id != undefined) {
                            element.html(event.title + '<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                        }
                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        $('.tooltipevent').remove();
                        if (jsEvent.target.id === 'Delete') {
                            var msg = confirm("Do you like to Cancel the Patient Appointment?");
                            if (msg == true) {
                                $scope.CancelAppointmentModal(calEvent.Appointment_Id, calEvent.start);
                            }
                        }
                        else {
                            $scope.Id = calEvent.id;
                            $scope.ViewPatientPopUp($scope.Id);
                        }
                    },
                    viewRender: function (view, element) {
                        $scope.FromDate = view.intervalStart._d;
                        $scope.ToDate = view.intervalEnd._d;
                        $scope.dataCalendar = [];
                        $("#chatLoaderPV1").show();
                        $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + view.intervalStart.format("DD-MMM-YYYY") + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                            angular.forEach(data, function (value, index) {
                                var obj = {
                                    title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                                    start: value.Appointment_FromTime,
                                    end: value.Appointment_ToTime,
                                    id: value.Patient_Id,
                                    PatientName: value.PatientName,
                                    Appointment_Id: value.Id,
                                    MRN_No: value.MRN_No,
                                    Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                                    Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                                    ReasonForVisit: value.ReasonForVisit
                                };
                                $scope.dataCalendar.push(obj);
                            });

                            $('#calendar').fullCalendar('removeEvents');
                            $('#calendar').fullCalendar('removeEventSource', $scope.dataCalendar)
                            $('#calendar').fullCalendar('addEventSource', $scope.dataCalendar)
                            $('#calendar').fullCalendar('refetchEvents');
                            $("#chatLoaderPV1").hide();
                        }).error(function (data) {
                            $("#chatLoaderPV1").hide();
                            $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                        });

                    },
                    eventMouseover: function (calEvent, jsEvent) {
                        //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' 
                        //            + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'
                        //            + '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'
                        //            + '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit 
                        //            +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';        
                        if (calEvent.MRN_No != undefined) {
                            var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                                + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.MRN_No + '</span></div>'
                                + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.Smoker + '</span></div>'
                                + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.ReasonForVisit
                                + '</span></div>' + '</div></div>' + '<div class="col-sm-6"><img src="' + calEvent.Photo + '"/><div class="col-sm-12"><h1><span>' + calEvent.PatientName + '</span></h1></div></div>' + '</div></div>';


                            var $tooltip = $(tooltip).appendTo('body');
                            $(this).mouseover(function (e) {
                                $(this).css('z-index', 10000);
                                $tooltip.fadeIn('500');
                                $tooltip.fadeTo('10', 1.9);
                            }).mousemove(function (e) {
                                $tooltip.css('top', e.pageY + 10);
                                $tooltip.css('left', e.pageX + 20);
                            });
                        };
                    },

                    eventMouseout: function (calEvent, jsEvent) {
                        $(this).css('z-index', 8);
                        $('.tooltipevent').remove();
                    },
                    events: $scope.dataCalendar,
                    timeFormat: 'H:mm:ss', // uppercase H for 24-hour clock
                    timezone: "local",
                    cache: false
                });

        });

        $scope.dayClicked = function (date) {
            $scope.flag = 3;
            $('#calendar').fullCalendar('gotoDate', date);
        }

        var dueStartDate = moment().add(1, 'days');
        var dueEndDate = moment().add(30, 'days');

        $scope.getMonthlyAppointment = function () {
            var calendar = $('#calendar1').fullCalendar(
                {
                    scrollTime: scrollTime,
                    slotDuration: '00:15:00',
                    visibleRange: {
                        start: '2020-02-01',
                        end: '2020-03-20'
                    },
                    eventLimit: true,
                    displayEventTime: false,

                    header: {
                        left: 'prev,next',
                        center: 'title',
                        right: ''
                    },
                    titleFormat: {
                        month: 'MMMM YYYY',   // like 'September 2009', for month view
                        week: 'MMM D YYYY', // like 'Sep 13 2009', for week views
                        day: 'MMMM D YYYY' // like 'September 8 2009', for day views
                    },
                    views: {
                        agendaFiveDay: {
                            type: 'agenda',
                            duration: { days: 5 },
                            buttonText: 'Five Day'
                        }
                    },
                    defaultView: 'month',
                    selectable: true,
                    selectHelper: true,
                    // Remove Event On Click
                    eventRender: function (event, element) {

                        var dateString = moment(event.start).format('YYYY-MM-DD');
                        $('#calendar1').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');
                        if (event.id != undefined) {
                            element.html(event.title + '<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                        }
                    },
                    eventAfterAllRender: function (view) {
                        for (cDay = view.start.clone(); cDay.isBefore(view.end); cDay.add(1, 'day')) {

                            var dateNum = cDay.format('YYYY-MM-DD');

                            var dayEl = $('.fc-day[data-date="' + dateNum + '"]');
                            var eventCount = $('.fc-event[date-num="' + dateNum + '"]').length;
                            if (eventCount) {
                                var html = '<div class="numberCircle">' +
                                    eventCount +
                                    '</div>';
                                dayEl.append(html);
                            }
                        }
                    },

                    dayClick: function (date, allDay, jsEvent, view) {
                        if (moment(date).isBetween(moment(dueStartDate).add(-1, "days"), moment(dueEndDate)) == false) {
                            alert("Appointment is only for 30 days, cannot view this date");
                            $('#calendar1').fullCalendar('gotoDate', dueStartDate);
                            return false;
                        }

                        $scope.dayClicked(date);
                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        $('.tooltipevent').remove();
                        if (jsEvent.target.id === 'Delete') {
                            var msg = confirm("Do you like to Canncel the Patient Appointment?");
                            if (msg == true) {
                                $scope.CancelAppointmentModal(calEvent.Appointment_Id, calEvent.start);
                            }
                        }
                        else {
                            $scope.Id = calEvent.id;
                            $scope.ViewPatientPopUp_30days($scope.Id);
                        }
                    },
                    viewRender: function (view, element) {
                        $scope.FromDate = view.intervalStart._d;
                        $scope.ToDate = view.intervalEnd._d;
                        $scope.dataCalendar1 = [];
                        $scope.flag = 2;
                        $scope.dataCalendar1 = [];
                        $("#chatLoaderPV1").show();
                        $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
                            angular.forEach(patientdata, function (value, index) {
                                var obj = {
                                    title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                                    start: value.Appointment_FromTime,
                                    end: value.Appointment_ToTime,
                                    id: value.Patient_Id,
                                    PatientName: value.PatientName,
                                    Appointment_Id: value.Id,
                                    MRN_No: value.MRN_No,
                                    Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                                    Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                                    ReasonForVisit: value.ReasonForVisit
                                };
                                $scope.dataCalendar1.push(obj);
                            })
                            $('#calendar1').fullCalendar('removeEvents');
                            $('#calendar1').fullCalendar('removeEventSource', $scope.dataCalendar1)
                            $('#calendar1').fullCalendar('addEventSource', $scope.dataCalendar1)
                            $('#calendar1').fullCalendar('refetchEvents');
                            $("#chatLoaderPV1").hide();
                        }).error(function (data) {
                            $("#chatLoaderPV1").hide();
                            $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                        });
                    },
                    eventMouseover: function (calEvent, jsEvent) {
                        //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';

                        var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                            + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.MRN_No + '</span></div>'
                            + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.Smoker + '</span></div>'
                            + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.ReasonForVisit
                            + '</span></div>' + '</div></div>' + '<div class="col-sm-6"><img src="' + calEvent.Photo + '"/><div class="col-sm-12"><h1><span>' + calEvent.PatientName + '</span></h1></div></div>' + '</div></div>';

                        var $tooltip = $(tooltip).appendTo('body');
                        $(this).mouseover(function (e) {
                            $(this).css('z-index', 10000);
                            $tooltip.fadeIn('500');
                            $tooltip.fadeTo('10', 1.9);
                        }).mousemove(function (e) {
                            $tooltip.css('top', e.pageY + 10);
                            $tooltip.css('left', e.pageX + 20);
                        });
                    },

                    eventMouseout: function (calEvent, jsEvent) {
                        $(this).css('z-index', 8);
                        $('.tooltipevent').remove();
                    },
                    events: $scope.dataCalendar1,
                    timeFormat: 'H:mm:ss', // uppercase H for 24-hour clock
                    timezone: "local",
                    cache: false
                });
        }
        $scope.getMonthlyAppointment();
    }

]);
/* THIS IS FOR PARAMETER SETTINGS CONTROLLER FUNCTION */
MyCortexControllers.controller("ParameterSettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$timeout',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $timeout) {
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.Units_ID = [];
        $scope.Units_Name = [];
        $scope.ProtocolParametersList = [];
        $scope.UnitMasterList = [];
        $scope.Min_Possible = [];
        $scope.NormalRange_High = [];
        $scope.NormalRange_low = [];
        $scope.Average = [];
        $scope.Max_Possible = [];
        $scope.Remarks = [];
        $scope.Diagnostic_Flag = [];
        $scope.UnitGroupType = 1;

        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.ParameterSettings_Validations = function () {

            var validateflag = true;
            var validationMsg = "";
            angular.forEach($scope.ProtocolParametersList, function (value, index) {

                var minval = 0;
                if ((parseFloat($scope.Min_Possible[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.Min_Possible[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Maximum Possible is greater than Minimum Possible for " + value.Name;
                    //alert("Maximum Possible is greater than Minimum Possible, cannot Save " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_low[value.Id]) > ($scope.NormalRange_High[value.Id])) && ($scope.NormalRange_low[value.Id] != "" && $scope.NormalRange_High[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range High is greater than normal Range Low for " + value.Name;
                    //alert("Please enter Normal Range High is greater than normal Range Low " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_High[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.NormalRange_High[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range High is less than than Maximum Possible for " + value.Name;
                    //alert("Please enter Normal Range High is less than than Maximum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_High[value.Id]) < ($scope.Min_Possible[value.Id])) && ($scope.NormalRange_High[value.Id] != "" && $scope.Min_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range High is less than Minimum Possible for " + value.Name;
                    //alert("Please enter Normal Range High is less than Minimum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }

                if ((parseFloat($scope.NormalRange_low[value.Id]) < ($scope.Min_Possible[value.Id])) && ($scope.NormalRange_low[value.Id] != "" && $scope.Min_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range Low is less than Minimum Possible for " + value.Name;
                    //alert("Please enter Normal Range Low is less than Minimum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.NormalRange_low[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.NormalRange_low[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Normal Range Low is greater than Maximum Possible for " + value.Name;
                    //alert("Please enter Normal Range Low is greater than Maximum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }

                if ((parseFloat($scope.Average[value.Id]) > ($scope.Max_Possible[value.Id])) && ($scope.Average[value.Id] != "" && $scope.Max_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is greater than Maximum Possible for " + value.Name;
                    //alert("Please enter Average is grater than Maximum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.Average[value.Id]) < ($scope.Min_Possible[value.Id])) && ($scope.Average[value.Id] != "" && $scope.Min_Possible[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is less than Minimum Possible for " + value.Name;
                    //alert("Please enter Average is less than Minimum Possible " + value.Name);
                    validateflag = false;
                    return false;
                }

                if ((parseFloat($scope.Average[value.Id]) > ($scope.NormalRange_High[value.Id])) && ($scope.Average[value.Id] != "" && $scope.NormalRange_High[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is grater than Normal Range High for " + value.Name;
                    //alert("Please enter Average is grater than Normal Range High " + value.Name);
                    validateflag = false;
                    return false;
                }
                if ((parseFloat($scope.Average[value.Id]) < ($scope.NormalRange_low[value.Id])) && ($scope.Average[value.Id] != "" && $scope.NormalRange_low[value.Id] != "")) {
                    validationMsg = validationMsg + "\n" + "Average is less than Normal Range Low for " + value.Name;
                    //alert("Please enter Average is less than Normal Range Low " + value.Name);
                    validateflag = false;
                    return false;
                }

                if (($scope.Min_Possible[value.Id] != "" || $scope.Max_Possible[value.Id] != "" || $scope.NormalRange_High[value.Id] != ""
                    || $scope.NormalRange_low[value.Id] != "" || $scope.Average[value.Id] != "") && ($scope.Units_ID[value.Id] == null || $scope.Units_ID[value.Id] == undefined)) {
                    validationMsg = validationMsg + "\n" + "Please select Units for " + value.Name;
                    //alert("Please select Units");
                    validateflag = false;
                    //return false;
                }
            });

            if (validateflag == false) {
                alert(validationMsg + "\n" + "cannot Save ");
                return false;
            }
            return true;
        }

        /* 
        Calling api method for the dropdown list in the html page for the field Category
        */
        //$http.get(baseUrl + '/api/ParameterSettings/ProtocolParameterMasterList/').success(function (data) {
        //    $scope.ProtocolParametersList = data;
        //    $scope.ResultListFiltered = $scope.ProtocolParametersList;
        //});

        /*Set Unit Group Preference*/
        $scope.SetUnitGroupPreference = function () {
            $http.get(baseUrl + '/api/ParameterSettings/UnitGroupPreferenceGet/?institutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                $scope.UnitGroupType = data.PreferenceType;
            })
        }

        /*Store Chat Preference*/
        $scope.SaveUnitGroupPreference = function () {
            var type = $scope.UnitGroupType;
            $http.get(baseUrl + '/api/ParameterSettings/UnitGroupPreferenceSave/?institutionId=' + $window.localStorage['InstitutionId'] + '&preferenceType=' + type).success(function (data) {
                return data;
            })
        }

        //$http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=0&Unitgroup_Type=1').success(function (data) {
        //    $scope.UnitMasterList = data;
        //});

        $scope.query = "";
        /* Filter the master list function.*/
        $scope.StandardFilterlist = function () {
            var searchstring = angular.lowercase($scope.query);
            if ($scope.query == "") {
                $scope.ProtocolParametersList = angular.copy($scope.ResultListFiltered);
            }
            else {
                $scope.ProtocolParametersList = $ff($scope.ResultListFiltered, function (value, index) {
                    var UnitsList_Name = "";

                    if ($ff($scope.UnitMasterList, function (unititem, unitindex) {
                        return unititem.Units_ID == $scope.Units_ID[value.Id];
                    })[0]) {
                        UnitsList_Name = $ff($scope.UnitMasterList, function (unititem, unitindex) {
                            return unititem.Units_ID == $scope.Units_ID[value.Id];
                        })[0].Units_Name
                    }
                    return angular.lowercase(value.Name).match(searchstring) ||
                        angular.lowercase(UnitsList_Name).match(searchstring)
                });
            }
        };

        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.ChatSettings_ViewEdit = function () {
            $("#chatLoaderPV").show();
            // $scope.UnitGroupType = UnitGroupType;
            $http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=0&Unitgroup_Type=' + $scope.UnitGroupType).success(function (data) {
                $scope.UnitMasterList = data;
                $http.get(baseUrl + '/api/ParameterSettings/ProtocolParameterMasterList/').success(function (data1) {
                    $scope.ProtocolParametersList = data1;
                    $scope.ResultListFiltered = $scope.ProtocolParametersList;
                    $http.get(baseUrl + 'api/ParameterSettings/ViewEditProtocolParameters/?Id=' + $scope.InstituteId + '&Unitgroup_Type=' + $scope.UnitGroupType).success(function (data) {
                        $scope.ViewParamList = data;
                        $("#chatLoaderPV").hide();
                        angular.forEach($scope.ProtocolParametersList, function (masterVal, masterInd) {
                            $scope.ViewParamList1 = $ff($scope.ViewParamList, { Parameter_ID: masterVal.Id }, true)[0];
                            if ($scope.ViewParamList1 != undefined) {

                                $scope.Units_ID[masterVal.Id] = $scope.ViewParamList1.Units_ID == null ? "0" : $scope.ViewParamList1.Units_ID.toString();
                                if ($scope.IsEdit == false) {
                                    $scope.Units_Name[masterVal.Id] = $scope.ViewParamList1.Units_Name == null ? "" : $scope.ViewParamList1.Units_Name.toString();
                                }
                                $scope.Diagnostic_Flag[masterVal.Id] = $scope.ViewParamList1.Diagnostic_Flag == null ? true : $scope.ViewParamList1.Diagnostic_Flag;
                                $scope.Max_Possible[masterVal.Id] = $scope.ViewParamList1.Max_Possible == null ? "" : $scope.ViewParamList1.Max_Possible;
                                $scope.Min_Possible[masterVal.Id] = $scope.ViewParamList1.Min_Possible == null ? "" : $scope.ViewParamList1.Min_Possible;
                                $scope.NormalRange_High[masterVal.Id] = $scope.ViewParamList1.NormalRange_High == null ? "" : $scope.ViewParamList1.NormalRange_High;
                                $scope.NormalRange_low[masterVal.Id] = $scope.ViewParamList1.NormalRange_low == null ? "" : $scope.ViewParamList1.NormalRange_low;
                                $scope.Average[masterVal.Id] = $scope.ViewParamList1.Average == null ? "" : $scope.ViewParamList1.Average;
                                $scope.Remarks[masterVal.Id] = $scope.ViewParamList1.Remarks == null ? "" : $scope.ViewParamList1.Remarks;
                            }
                            else {
                                $scope.Units_ID[masterVal.Id] = "0";
                                $scope.Diagnostic_Flag[masterVal.Id] = true;
                                $scope.Max_Possible[masterVal.Id] = "";
                                $scope.Min_Possible[masterVal.Id] = "";
                                $scope.NormalRange_High[masterVal.Id] = "";
                                $scope.NormalRange_low[masterVal.Id] = "";
                                $scope.Average[masterVal.Id] = "";
                                $scope.Remarks[masterVal.Id] = "";
                            }
                        });

                    }).error(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.error = "An error has occcurred while viewing standard parameter Details!" + data;
                        alert($scope.error);
                    });
                });
            });
        };

        $scope.User_Id = $window.localStorage['UserId'];
        $scope.UnitsParameterdata = [];
        /* THIS IS FOR ADD/EDIT PROCEDURE */

        $scope.StandardParameter_AddEdit = function () {
            $scope.SaveUnitGroupPreference();
            $scope.UnitsParameterdata = [];
            if ($scope.ParameterSettings_Validations() == true) {
                $("#chatLoaderPV").show();
                angular.forEach($scope.ProtocolParametersList, function (value, index) {
                    var obj = {
                        Id: $scope.Id,
                        Institution_ID: $scope.InstituteId,
                        //   User_Id: $scope.User_Id,
                        Parameter_ID: value.Id,
                        Units_ID: $scope.Units_ID[value.Id] == 0 ? null : $scope.Units_ID[value.Id],
                        Diagnostic_Flag: $scope.Diagnostic_Flag[value.Id] == null ? false : $scope.Diagnostic_Flag[value.Id],
                        Max_Possible: $scope.Max_Possible[value.Id] == null ? "" : $scope.Max_Possible[value.Id],
                        Min_Possible: $scope.Min_Possible[value.Id] == null ? "" : $scope.Min_Possible[value.Id],
                        NormalRange_High: $scope.NormalRange_High[value.Id] == null ? "" : $scope.NormalRange_High[value.Id],
                        NormalRange_low: $scope.NormalRange_low[value.Id] == null ? "" : $scope.NormalRange_low[value.Id],
                        Average: $scope.Average[value.Id] == null ? "" : $scope.Average[value.Id],
                        Remarks: $scope.Remarks[value.Id] == null ? "" : $scope.Remarks[value.Id],
                    }
                    $scope.UnitsParameterdata.push(obj);
                });

                angular.forEach($scope.UnitsParameterdata, function (value, index) {
                    if (value.Units_ID == undefined) {
                        value.Units_ID = null;
                    }
                })

                $http.post(baseUrl + '/api/ParameterSettings/ParameterSettings_AddEdit/', $scope.UnitsParameterdata).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert("Standard parameter saved successfully");
                    $scope.ChatSettings_ViewEdit();
                    $scope.IsEdit = false;
                    //$location.path("/ParameterSettings");
                });
            }
        };

        $scope.IsEdit = false;
        $scope.StandardParameterEdit = function () {
            $scope.IsEdit = true;
        }
        $scope.IsEdit = false;
        $scope.StandardParameterCancel = function () {
            $scope.ChatSettings_ViewEdit();
            $scope.IsEdit = false;
            // $location.path("/ParameterSettings");
        }
    }
]);


MyCortexControllers.controller("CareCoordinatorController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.currentTab = '1';
        $scope.flag = 0;
        $scope.Coordinator_Id = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.UserTypeId = $window.localStorage['UserTypeId'];

        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.rowCollectionFilter = [];
        $scope.CareCoordinator_PatientList = [];
        $scope.coordinator_searchquery = "";

        $scope.CC_PatientNo = "";
        $scope.CC_InsuranceId = "";
        $scope.CC_GenderId = "0";
        $scope.CC_NationalityId = "0";
        $scope.CC_EthinicGroupId = "0";
        $scope.CC_MOBILE_NO = "";
        $scope.CC_HomePhoneNo = "";
        $scope.CC_Email = "";
        $scope.CC_MaritalStatus = "0";
        $scope.CC_CountryId = "0";
        $scope.CC_StataId = "0";
        $scope.CC_CityId = "0";
        $scope.CC_BloodGroupId = "0";
        $scope.CC_GroupId = "0";
        $scope.PageNumber = 1;
        $scope.loadCount = 0;
        $scope.TabClick = false;

        $scope.Reset_CC_Filter = function () {
            $scope.CC_PatientNo = "";
            $scope.CC_InsuranceId = "";
            $scope.CC_GenderId = "0";
            $scope.CC_NationalityId = "0";
            $scope.CC_EthinicGroupId = "0";
            $scope.CC_MOBILE_NO = "";
            $scope.CC_HomePhoneNo = "";
            $scope.CC_Email = "";
            $scope.CC_MaritalStatus = "0";
            $scope.CC_CountryId = "0";
            $scope.CC_StataId = "0";
            $scope.CC_CityId = "0";
            $scope.CC_BloodGroupId = "0";
            $scope.CC_GroupId = "0";
            $scope.CareCoordinator_PatientListFunction(1);
        }

        $scope.CarecoordinatorDropdownList = function () {
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
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $scope.CountryStateList();
            }
        }

        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;
            });
        }

        $scope.CC_Country_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.CC_CountryId).success(function (data) {
                    $scope.StateNameList = data;
                    $scope.CityNameList = [];
                    $scope.CC_CityId = "0";
                });
            }
        }
        $scope.CC_State_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.CC_CountryId + '&StateId=' + $scope.CC_StataId).success(function (data) {
                    $scope.CityNameList = data;
                });
            }
        }
        $scope.PatientFilterCopy = [];
        $scope.PatientFilterCopyList = [];
        $scope.PageCountArray = [];
        $scope.CareCoordinator_PatientListFunction = function (PageNumber) {
            $("#chatLoaderPV").show();
            $scope.PatientFilterCopy = [];
            $scope.PageNumber = PageNumber;
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.Patient_PerPage = data1[0].ConfigValue;
                $http.post(baseUrl + '/api/CareCoordinnator/CareCoordinator_PatientList/?Coordinator_Id=' + $scope.Coordinator_Id + '&PATIENTNO=' + $scope.CC_PatientNo + '&INSURANCEID=' + $scope.CC_InsuranceId + '&GENDER_ID=' + $scope.CC_GenderId + '&NATIONALITY_ID=' + $scope.CC_NationalityId + '&ETHINICGROUP_ID=' + $scope.CC_EthinicGroupId + '&MOBILE_NO=' + $scope.CC_MOBILE_NO + '&HOME_PHONENO=' + $scope.CC_HomePhoneNo + '&EMAILID=' + $scope.CC_Email + '&MARITALSTATUS_ID=' + $scope.CC_MaritalStatus + '&COUNTRY_ID=' + $scope.CC_CountryId + '&STATE_ID=' + $scope.CC_StataId + '&CITY_ID=' + $scope.CC_CityId + '&BLOODGROUP_ID=' + $scope.CC_BloodGroupId + '&Group_Id=' + $scope.CC_GroupId + '&TypeId=' + $scope.PageParameter + '&UserTypeId=' + $scope.UserTypeId
                ).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.emptydata = [];
                    $scope.CareCoordinator_PatientList = [];
                    $window.localStorage['CC_Date'] = new Date();
                    $scope.CareCoordinator_PatientList = data;
                    $scope.PatientCount = $scope.CareCoordinator_PatientList.length;
                    total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                    for (var i = 0; i < total; i++) {
                        var obj = {
                            PageNumber: i + 1
                        }
                        $scope.PageCountArray.push(obj);
                    }
                    $scope.rowCollectionFilter = angular.copy($scope.CareCoordinator_PatientList);
                    $scope.PatientFilterCopyList = angular.copy($scope.CareCoordinator_PatientList);
                    $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                    $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                    //Get the records for Page Load
                    $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value, index) {
                        return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
                    });
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                });
            });

        }


        $scope.Next_CareCoordinator_PatientListFunction = function (PageNumber) {
            $scope.PageNumber = PageNumber;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            //Get the records for Page Load
            $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }

        $scope.Coordinator_ListFilter = function () {
            $scope.ResultListFiltered = [];
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            var searchstring = angular.lowercase($scope.coordinator_searchquery);
            if ($scope.coordinator_searchquery == "") {
                $scope.rowCollectionFilter = [];
                $scope.rowCollectionFilter = angular.copy($scope.PatientFilterCopyList);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.PatientFilterCopyList, function (value) {
                    return angular.lowercase(value.PatientName).match(searchstring) ||
                        angular.lowercase(value.MRN_NO).match(searchstring) ||
                        angular.lowercase(value.Smoker_Option).match(searchstring) ||
                        angular.lowercase(value.Diabetic_Option).match(searchstring) ||
                        angular.lowercase(value.Diabetic_Option).match(searchstring) ||
                        angular.lowercase(value.Cholestrol_Option).match(searchstring);
                });

            }
            $scope.PatientCount = $scope.rowCollectionFilter.length;
            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
            for (var i = 0; i < total; i++) {
                var obj = {
                    PageNumber: i + 1
                }
                $scope.PageCountArray.push(obj);
            }
            $scope.CareCoordinator_PatientList = $scope.rowCollectionFilter;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            $scope.rowCollectionFilter = $ff($scope.rowCollectionFilter, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }
        $scope.AlertArray = [];
        $scope.HighSelected = false;
        $scope.MediumSelected = false;
        $scope.LowSelected = false;
        $scope.Filter_Selected = ["1", "2", "3"];
        $scope.Coordinator_Filter = function () {
            $scope.PageNumber = 1;
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            $scope.HighSelected = false;
            $scope.MediumSelected = false;
            $scope.LowSelected = false;
            $scope.SelectedFilter = $scope.Filter_Selected.toString();
            /*if ((($scope.SelectedFilter.match('1')) && ($scope.SelectedFilter.match('2')) && ($scope.SelectedFilter.match('3')))) {
                $scope.CareCoordinator_PatientList = angular.copy($scope.PatientFilterCopyList);
            }*/
            if ($scope.CareCoordinator_PatientList.length == 0) {
                $scope.CareCoordinator_PatientList = angular.copy($scope.PatientFilterCopyList);
            }
            if (($scope.SelectedFilter.match('1'))) {
                $scope.HighSelected = true;
            }
            if (($scope.SelectedFilter.match('2'))) {
                $scope.MediumSelected = true;
            }
            if (($scope.SelectedFilter.match('3'))) {
                $scope.LowSelected = true;
            }
            $scope.rowCollectionFilter = $ff($scope.CareCoordinator_PatientList, function (value) {
                return (value.HighCount > 0 && $scope.HighSelected == true) ||
                    (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                    (value.LowCount > 0 && $scope.LowSelected == true);

                /*return ((value.HighCount > 0 && $scope.HighSelected == true) || (value.HighCount == 0 && ($scope.MediumSelected == true || $scope.LowSelected == true)) ||
                ($scope.HighSelected == false && ($scope.MediumSelected == true || $scope.LowSelected == true))) &&
                ((value.MediumCount > 0 && $scope.MediumSelected == true) || (value.MediumCount == 0 && ($scope.HighSelected == true || $scope.LowSelected == true)) ||
                ($scope.MediumSelected == false && ($scope.HighSelected == true || $scope.LowSelected == true))) &&
                ((value.LowCount > 0 && $scope.LowSelected == true) || (value.LowCount == 0 && ($scope.HighSelected == true || $scope.MediumSelected == true)) ||
                ($scope.LowSelected == false && ($scope.HighSelected == true || $scope.MediumSelected == true)))
                ;*/
            });
            $scope.PatientCount = $scope.rowCollectionFilter.length;
            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
            for (var i = 0; i < total; i++) {
                var obj = {
                    PageNumber: i + 1
                }
                $scope.PageCountArray.push(obj);
            }
            $scope.CareCoordinator_PatientList = $scope.rowCollectionFilter;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            $scope.rowCollectionFilter = $ff($scope.rowCollectionFilter, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }
        $scope.DiagosticAlert_PatientData = function (eventId) {
            //Diagostic Alert
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/5";
        }
        $scope.ComplianceAlert_PatientData = function (eventId) {
            //Compliance Alert
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/6";
        }
    }
]);

MyCortexControllers.controller("CareGiverAssignedPatientsController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.caregiver_PatientList = [];
        $scope.caregiver_searchquery = "";
        $scope.CareGiver_Id = $window.localStorage['UserId'];
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.CG_PatientNo = "";
        $scope.CG_InsuranceId = "";
        $scope.CG_GenderId = "0";
        $scope.CG_NationalityId = "0";
        $scope.CG_EthinicGroupId = "0";
        $scope.CG_MOBILE_NO = "";
        $scope.CG_HomePhoneNo = "";
        $scope.CG_Email = "";
        $scope.CG_MaritalStatus = "0";
        $scope.CG_CountryId = "0";
        $scope.CG_StateId = "0";
        $scope.CG_CityId = "0";
        $scope.CG_BloodGroupId = "0";
        $scope.CG_GroupId = "0";
        $scope.PageNumber = 1;
        $scope.TabClick = false;

        $scope.ResetFilter = function () {
            $scope.CG_PatientNo = "";
            $scope.CG_InsuranceId = "";
            $scope.CG_GenderId = "0";
            $scope.CG_NationalityId = "0";
            $scope.CG_EthinicGroupId = "0";
            $scope.CG_MOBILE_NO = "";
            $scope.CG_HomePhoneNo = "";
            $scope.CG_Email = "";
            $scope.CG_MaritalStatus = "0";
            $scope.CG_CountryId = "0";
            $scope.CG_StateId = "0";
            $scope.CG_CityId = "0";
            $scope.CG_BloodGroupId = "0";
            $scope.CG_GroupId = "0";
            $scope.CareGiver_PatientListFunction(1)
        }

        $scope.CaregiverPatientsDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $scope.CountryStateList();
            }
        }
        $scope.loadCount = 0;
        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;

            });
        }
        $scope.CG_Country_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_StateList/?CountryId=' + $scope.filter_CountryId).success(function (data) {
                    $scope.StateNameList = data;
                    $scope.CityNameList = [];
                    $scope.filter_CityId = "0";
                });
            }
        };
        $scope.CG_State_onChange = function () {
            if ($scope.loadCount == 0) {
                $http.get(baseUrl + '/api/Common/Get_LocationList/?CountryId=' + $scope.filter_CountryId + '&StateId=' + $scope.filter_StataId).success(function (data) {
                    $scope.CityNameList = data;
                });
            }
        };
        $scope.PageCountArray = [];
        $scope.PatientFilterCopy = [];
        $scope.PatientFilterCopyList = [];
        $scope.CareGiver_PatientListFunction = function (PageNumber) {
            $("#chatLoaderPV").show();
            $scope.PageNumber = PageNumber;
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.Patient_PerPage = data1[0].ConfigValue;
                $http.get(baseUrl + '/api/CareGiver/CareGiver_AssignedPatientList/?CareGiver_Id=' + $scope.CareGiver_Id + '&PATIENTNO=' + $scope.CG_PatientNo + '&INSURANCEID=' + $scope.CG_InsuranceId + '&GENDER_ID=' + $scope.CG_GenderId + '&NATIONALITY_ID=' + $scope.CG_NationalityId + '&ETHINICGROUP_ID=' + $scope.CG_EthinicGroupId + '&MOBILE_NO=' + $scope.CG_MOBILE_NO + '&HOME_PHONENO=' + $scope.CG_HomePhoneNo + '&EMAILID=' + $scope.CG_Email + '&MARITALSTATUS_ID=' + $scope.CG_MaritalStatus + '&COUNTRY_ID=' + $scope.CG_CountryId + '&STATE_ID=' + $scope.CG_StataId + '&CITY_ID=' + $scope.CG_CityId + '&BLOODGROUP_ID=' + $scope.CG_BloodGroupId + '&Group_Id=' + $scope.CG_GroupId + '&PageNumber=' + $scope.PageNumber + '&Login_Session_Id=' + $scope.LoginSessionId
                ).success(function (data) {
                    $("#chatLoaderPV").hide();
                    $scope.emptydata = [];
                    $scope.CareGiver_PatientList = [];
                    $scope.CareGiver_PatientList = data;
                    $scope.PatientCount = $scope.CareGiver_PatientList.length;
                    total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                    for (var i = 0; i < total; i++) {
                        var obj = {
                            PageNumber: i + 1
                        }
                        $scope.PageCountArray.push(obj);
                    }
                    $scope.rowCollectionFilter = angular.copy($scope.CareGiver_PatientList);
                    $scope.PatientFilterCopyList = angular.copy($scope.CareGiver_PatientList);
                    $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                    $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                    //Get the records for Page Load
                    $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value, index) {
                        return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
                    });
                    if ($scope.rowCollectionFilter.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                });
            });
        }
        $scope.Next_CareGiver_PatientListFunction = function (PageNumber) {
            $scope.PageNumber = PageNumber;
            $scope.SelectedFilter = $scope.Filter_Selected.toString();
            //if($scope.caregiver_searchquery == "" && (($scope.SelectedFilter.match('1')) && ($scope.SelectedFilter.match('2')) && ($scope.SelectedFilter.match('3'))))
            //{
            //    $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopyList);
            //}
            //else
            //{
            //    $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopy);
            //}
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            //Get the records for Page Load
            $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }

        $scope.HighSelected = false;
        $scope.MediumSelected = false;
        $scope.LowSelected = false;
        $scope.NoAlertSelected = false;
        $scope.Filter_Selected = ["1", "2", "3", "4"];
        $scope.Coordinator_Filter = function () {
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            $scope.HighSelected = false;
            $scope.MediumSelected = false;
            $scope.LowSelected = false;
            $scope.NoAlertSelected = false;
            $scope.SelectedFilter = $scope.Filter_Selected.toString();
            /*if ((($scope.SelectedFilter.match('1')) && ($scope.SelectedFilter.match('2')) && ($scope.SelectedFilter.match('3')) && ($scope.SelectedFilter.match('4')))) {
                $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopyList);
            }
            else*/
            if ($scope.CareGiver_PatientList.length == 0) {
                $scope.CareGiver_PatientList = angular.copy($scope.PatientFilterCopyList);
            }
            if (($scope.SelectedFilter.match('1'))) {
                $scope.HighSelected = true;
            }
            if (($scope.SelectedFilter.match('2'))) {
                $scope.MediumSelected = true;
            }
            if (($scope.SelectedFilter.match('3'))) {
                $scope.LowSelected = true;
            }
            if (($scope.SelectedFilter.match('4'))) {
                $scope.NoAlertSelected = true;
            }
            $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value) {
                return (value.HighCount > 0 && $scope.HighSelected == true) ||
                    (value.MediumCount > 0 && $scope.MediumSelected == true) ||
                    (value.LowCount > 0 && $scope.LowSelected == true) ||
                    ($scope.NoAlertSelected == true && value.HighCount == 0 && value.MediumCount == 0 && value.LowCount == 0);

            });
        }

        $scope.CareGiver_ListFilter = function () {
            $scope.ResultListFiltered = [];
            $scope.PageCountArray = [];
            $scope.PageNumber = 1;
            var searchstring = angular.lowercase($scope.caregiver_searchquery);
            if ($scope.caregiver_searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.CareGiver_PatientList);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.CareGiver_PatientList, function (value) {
                    return angular.lowercase(value.PatientName).match(searchstring) ||
                        angular.lowercase(value.MRN_NO).match(searchstring);
                });
            }
            $scope.PatientCount = $scope.rowCollectionFilter.length;
            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
            for (var i = 0; i < total; i++) {
                var obj = {
                    PageNumber: i + 1
                }
                $scope.PageCountArray.push(obj);
            }
            $scope.CareGiver_PatientList = $scope.rowCollectionFilter;
            $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
            $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
            $scope.rowCollectionFilter = $ff($scope.rowCollectionFilter, function (value, index) {
                return (index >= ($scope.PageStart - 1) && index <= $scope.PageEnd - 1);
            });
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.flag = 1;
            }
            else {
                $scope.flag = 0;
            }
        }
        $scope.CareGiver_AssignedPatients = function (eventId) {
            //Care Giver Assigned patients
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/7";
        }
    }
]);

/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("ParameterController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter) {

        $scope.AddParameterPopup = function () {

            angular.element('#ParameterCreateModal').modal('show');
        }

        $scope.CancelParameterPopup = function () {

            angular.element('#ParameterCreateModal').modal('hide');
        }

        $scope.ViewIntstitutionPopup = function () {

            angular.element('#ViewModal').modal('show');
        }

        $scope.CancelViewIntstitutionPopup = function () {

            angular.element('#ViewModal').modal('hide');
        }

    }

]);

// This is for ICD10 controller functions//    
MyCortexControllers.controller("ICD10Controller", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {

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
                alert("Please enter ICD Code");
                return false;
            }
            else if (typeof ($scope.Description) == "undefined" || $scope.Description == 0) {
                alert("Please enter ICD Description");
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
                $http.post(baseUrl + '/api/MasterICD/MasterICD_AddEdit/', obj).success(function (data) {
                    $("#chatLoaderPV").hide();
                    alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.ICD10list();
                    }
                    //$scope.AddId = data;
                    angular.element('#ICD10Modal').modal('hide');
                })
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
            $scope.ICD10list();
        }

        $scope.ICD10list = function () {
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
                $http.get(baseUrl + '/api/MasterICD/ICDMasterList/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&StartRowNumber=' + $scope.PageStart +
                    '&EndRowNumber=' + $scope.PageEnd).success(function (data) {
                        $("#chatLoaderPV").hide();
                        $scope.emptydata = [];
                        $scope.rowCollection = [];
                        $scope.rowCollection = data;
                        $scope.PatientCount = $scope.rowCollection[0].TotalRecord;
                        $scope.rowCollectionFilter = angular.copy($scope.rowCollection);

                        if ($scope.rowCollectionFilter.length > 0) {
                            $scope.flag = 1;
                        }
                        else {
                            $scope.flag = 0;
                        }
                        $http.get(baseUrl + '/api/MasterICD/CategoryMasterList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                            $("#chatLoaderPV").hide();
                            $scope.CategoryIDListTemp = [];
                            $scope.CategoryIDListTemp = data;
                            var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                            $scope.CategoryIDListTemp.splice(0, 0, obj);
                            $scope.CategoryIDList = angular.copy($scope.CategoryIDListTemp);
                        });
                        $scope.total_page = Math.ceil(($scope.PatientCount) / ($scope.page_size));
                    })
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        };

        $scope.searchquery = "";
        /* FILTER THE MASTER LIST FUNCTION.*/
        $scope.fliterICD10List = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.ICD_Code).match(searchstring) ||
                        angular.lowercase(value.Description).match(searchstring) ||
                        angular.lowercase(value.CategoryName).match(searchstring);
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

            $http.get(baseUrl + '/api/MasterICD/ICDMasterView/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = data.Id;
                $scope.ICD_Code = data.ICD_Code;
                $scope.Description = data.Description;
                $scope.Category_ID = data.Category_ID.toString();
                $scope.ViewCategoryName = data.CategoryName;
            });
        }

        $scope.DeleteICD10 = function (DId) {
            $scope.Id = DId;
            $scope.ICDMaster_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.ICDMaster_Delete = function () {

            var del = confirm("Do you like to deactivate the selected ICD 10 details?");
            if (del == true) {
                $http.get(baseUrl + '/api/MasterICD/ICDMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert(" ICD 10 details has been deactivated Successfully");
                    $scope.ICD10list();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                });
            }
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

            var Ins = confirm("Do you like to activate the selected ICD 10 details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/MasterICD/ICDMaster_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected ICD 10 details has been activated successfully");
                    $scope.ICD10list();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting ICD 1O records" + data;
                });
            }
        };

        $scope.Active_ErrorFunction = function () {
            alert("Inactive ICD 10 details cannot be edited");
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }


        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddICD10PopUP = function () {
            angular.element('#ICD10Modal').modal('show');
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


// This is for Drug DB controller functions//    
MyCortexControllers.controller("DrugDBController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {

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
                alert("Please enter Generic Name");
                return false;
            }
            else if (typeof ($scope.Strength_ID) == "undefined" || $scope.Strength_ID == 0) {
                alert("Please select Strength");
                return false;
            }
            else if (typeof ($scope.Dosage_From_ID) == "undefined" || $scope.Dosage_From_ID == 0) {
                alert("Please select Dosage Form");
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

                $http.post(baseUrl + '/api/DrugDBMaster/DrugDBMaster_AddEdit/', obj).success(function (data) {
                    alert(data.Message);
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
            alert("Inactive Drug DB details cannot be edited");
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
                        $scope.DrugCount = $scope.rowCollection[0].TotalRecord;
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
            alert("Inactive record cannot be edited");
        }

        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddDrugDBPopUP = function () {
            $scope.ClearPopup();
            angular.element('#DrugDBModal').modal('show');
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

            var del = confirm("Do you like to deactivate the selected Drug DB details?");
            if (del == true) {
                $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMaster_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert(" Drug DB details has been deactivated Successfully");
                    $scope.DrugDB_List();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  Drug DB details" + data;
                });
            }
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

            var Ins = confirm("Do you like to activate the selected Drug DB details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/DrugDBMaster/DrugDBMaster_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Drug DB details has been activated successfully");
                    $scope.DrugDB_List();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting Drug DB records" + data;
                });
            }
        };
    }
]);

// This is for AlertConfiguration controller functions//    
MyCortexControllers.controller("AlertConfigurationController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddAlertConfigurationPopUP = function () {
            angular.element('#AlertConfigurationModal').modal('show');
        }

        $scope.ViewICD10PopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10();
            angular.element('#AlertConfigurationViewModal').modal('show');
        }

        $scope.EditICD10PopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewITSection();
            angular.element('#AlertConfigurationModal').modal('show');
        }

        $scope.CancelPopUP = function () {
            angular.element('#AlertConfigurationModal').modal('hide')
        }

        $scope.ListICD10PopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.ICDCodeList();

        }
    }
]);

// This is for Protocol controller functions//    
MyCortexControllers.controller("ProtocolController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddProtocolPopUP = function () {
            angular.element('#ProtocolModal').modal('show');
        }
        $scope.ViewProtocolPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewICD10();
            angular.element('#ProtocolViewModal').modal('show');
        }

        $scope.EditProtocolPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewITSection();
            angular.element('#ProtocolModal').modal('show');
        }

        $scope.CancelProtocolPopUP = function () {
            angular.element('#ProtocolModal').modal('hide')
        }


        $scope.ListProtocolPopUP = function (CatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.DrugDBList();

        }

    }
]);

// This is for User controller functions/ /
MyCortexControllers.controller("PatientController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddPatientPopup = function () {
            angular.element('#PatientCreateModal').modal('show');
        }

        $scope.CancelPopup = function () {
            angular.element('#PatientCreateModal').modal('hide')
        }
        $scope.AdvanceSearchPopup = function () {
            angular.element('#ViewModal').modal('show')
        }
    }
]);


// This is for Monitoring Protocol controller functions/ /
MyCortexControllers.controller("MonitoringProtocolController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {

        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.IsActive = true;
        $scope.Protocol_Names = "0";
        $scope.Cloneval = 0;
        $scope.Id = 0;
        $scope.IsAdd = 0;
        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddMonitoringProtocolPopup = function () {
            $scope.IsAdd = 1;
            angular.element('#ProtocolCreateModal').modal('show');
            $scope.MonitoringProtocolDropDownList();

        }

        $scope.AddCloneProtocolPopup = function () {
            $scope.Cloneval = 1;
            angular.element('#ProtocolCreateModal').modal('show');
        }

        $scope.CancelMonitoringProtocolPopup = function () {
            angular.element('#ProtocolCreateModal').modal('hide')
        }

        $scope.flag = 0;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        /*THIS IS FOR LIST FUNCTION*/
        $scope.rowCollectionFilter = [];
        $scope.MonitoringProtocolDetailsListGo = function () {
            $("#chatLoaderPV").show();
            $scope.emptydata = [];
            $scope.rowCollection = [];
            $scope.Institution_Id = "";

            $scope.ActiveStatus = $scope.IsActive == true ? 1 : 0;

            $http.get(baseUrl + 'api/Protocol/StandardProtocol_List/?IsActive=' + $scope.ActiveStatus + '&InstitutionId=' + $scope.InstituteId).success(function (data) {
                $("#chatLoaderPV").hide();
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
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        };

        $scope.CloneProtocolList = [];
        $scope.CloneProtocolFunction = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/Protocol/StandardProtocol_View/?Id=' + $scope.Protocol_Names).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.ParameterSettingslist = data;
                angular.forEach($scope.ParameterSettingslist, function (value, index) {
                    // $scope.ProtocolName = value.ProtocolName;
                    value.Id = "0";
                });

            });
        };
        $scope.ParameterTypeList = [];
        $scope.MonitoringProtocolDropDownList = function () {
            $scope.ViewParamList = [];
            $http.get(baseUrl + 'api/ParameterSettings/ViewEditProtocolParameters/?Id=' + $scope.InstituteId).success(function (data) {
                $scope.ViewParamList = data;
            })

            $scope.UnitTypeList = [];
            $scope.ParameterTypeList = [];
            $http.get(baseUrl + '/api/Protocol/ParameterNameList/?InstitutionId=' + $scope.InstituteId).success(function (data) {
                $scope.ParameterTypeList = data;

                if ($scope.IsAdd == 1) {
                    if ($scope.ParameterTypeList.length == 0)
                        alert("Standard parameter is not configured, Monitoring Protocol cannot be created");
                }
                $scope.IsAdd = 0;

            });

            $scope.DurationTypeList = [];
            $http.get(baseUrl + '/api/Protocol/DurationTypeDetails/').success(function (data) {
                $scope.DurationTypeList = data;
            });

            $http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=0').success(function (data) {
                $scope.UnitTypeList = data;
            });

        }

        $scope.ViewParamList1 = [];
        $scope.ParameterSettingslist1 = [];
        $scope.ParameterSettings_ViewEdit = function (row) {

            ParamId = row.Parameter_Id;
            $scope.ViewParamList1 = $ff($scope.ViewParamList, { Parameter_ID: ParamId }, true);

            if ($scope.ViewParamList1.length > 0) {
                $ff($scope.ViewParamList1, function (masterVal1, masterInd1) {
                    return row.NormalRange_High = masterVal1.NormalRange_High,
                        row.NormalRange_Low = masterVal1.NormalRange_low,
                        row.Units_Id = masterVal1.Units_ID
                })
            }

            else {
                row.NormalRange_High = "";
                row.NormalRange_Low = "";
                row.Units_Id = "";
            };
        };


        /* on click view, view popup opened*/
        $scope.ViewProtocol = function (CatId) {
            $scope.ProtocolClear();
            $scope.CloneProtocolClear();
            $scope.Id = CatId;
            $scope.ProtocolDetails_View();
            angular.element('#ProtocolviewModal').modal('show');
        };

        /* on click Edit, edit popup opened*/
        $scope.EditProtocol = function (CatId, activeFlag) {
            if (activeFlag == 1) {
                $scope.ProtocolClear();
                $scope.CloneProtocolClear();
                $scope.Id = CatId;
                $scope.ProtocolDetails_View();
                angular.element('#ProtocolCreateModal').modal('show');
                $scope.MonitoringProtocolDropDownList();
            }
            else {
                alert("Inactive record cannot be edited");
            }
        };

        /* 
        Calling api method for the dropdown list in the html page for the field Category
        */
        //$scope.UnitTypeList = [];
        //$scope.ParameterTypeList = [];
        //$http.get(baseUrl + '/api/ParameterSettings/ProtocolParameterMasterList/').success(function (data) {           
        //    $scope.ParameterTypeList = data;
        //});

        //$scope.ProtocolNameList = [];
        //$http.get(baseUrl + '/api/Protocol/ProtocolNameDetails/?InstitutionId=' + $scope.InstituteId).success(function (data) {           
        //    $scope.ProtocolNameList = data;
        //});






        $scope.query = "";
        /* Filter the master list function.*/
        $scope.filterProtocolList = function () {
            var searchstring = angular.lowercase($scope.query);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = [];
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.ProtocolName).match(searchstring)
                });
            }
        }


        $scope.GetParamName = function (Param) {
            var ParamId = Param;
            var Param_Name = "";
            Param_Name = $.grep($scope.getSkill, function (Param) {
                return Param.Id == ParamId;
            })[0].ParameterName;

            return Param_Name;
        }

        /* Validating the create page mandatory fields
       checking mandatory for the follwing fields
       InstituionName,InstitutionPrintName,Email,CountryName,StateName,LocationName,Registrationdate
       and showing alert message when it is null.
       */
        $scope.ProtocolMonitoring_Validations = function () {

            if ((typeof ($scope.Protocol_Names) == "undefined" || ($scope.Protocol_Names == 0)) && ($scope.Cloneval == 1)) {
                alert("Please select Clone Name");
                return false;
            }
            if (typeof ($scope.ProtocolName) == "undefined" || $scope.ProtocolName == "") {
                alert("Please enter Protocol Name");
                return false;
            }

            var paramval = 0;
            var unitsval = 0;
            var HighMax = 0;
            var MediumMax = 0;
            var LowMax = 0;
            var HighMax1 = 0;
            var HighMin1 = 0;
            var MediumMax1 = 0;
            var val = 0;
            var valone = 0;
            var valtwo = 0;
            var valthree = 0;
            var valfour = 0;
            var valfive = 0;
            var valsix = 0;
            var splitval = 0;
            var highonesplitval = 0;
            var Normalrange = 0;
            var minPossible = 0;
            var maxPossible = 0;

            var stdone = 0;
            var stdtwo = 0;
            var stdthree = 0;
            var stdfour = 0;
            var stdfive = 0;
            var stdsix = 0;

            angular.forEach($scope.ParameterSettingslist, function (value, index) {
                if (value.Parameter_Id == null || value.Parameter_Id == 0) {
                    paramval = 1;
                }

                minPossible = $ff($scope.ViewParamList, { Parameter_ID: value.Parameter_Id }, true)[0].Min_Possible;
                maxPossible = $ff($scope.ViewParamList, { Parameter_ID: value.Parameter_Id }, true)[0].Max_Possible;

                if (value.Units_Id == null || value.Units_Id == 0) {
                    unitsval = 1;
                }

                if (parseFloat(value.Comp_Duration < value.Comp_Low) && value.Comp_Duration != null) {
                    HighMax = 1;
                }
                if (parseFloat(value.Comp_Duration < value.Comp_Medium) && value.Comp_Duration != null) {
                    MediumMax = 1;
                }
                if (parseFloat(value.Comp_Duration < value.Comp_High) && value.Comp_Duration != null) {
                    LowMax = 1;
                }

                if (parseFloat(value.Comp_Medium > value.Comp_Low) && value.Comp_Duration != null && value.Comp_Low != null) {
                    HighMax1 = 1;
                }
                if (parseFloat(value.Comp_High > value.Comp_Medium) && value.Comp_Duration != null && value.Comp_Medium != null) {
                    HighMin1 = 1;
                }
                if (parseFloat(value.Comp_High > value.Comp_Low) && value.Comp_Duration != null && value.Comp_Medium != null && value.Comp_Low != null) {
                    MediumMax1 = 1;
                }
                if (parseFloat(value.NormalRange_low) > parseFloat(value.NormalRange_High)) {
                    Normalrange = 1;
                }
                if (parseFloat(value.Diag_HighMin_One) > parseFloat(value.Diag_HighMax_One)) {
                    valone = 1;
                }
                if (parseFloat(value.Diag_MediumMin_One) > parseFloat(value.Diag_MediumMax_One)) {
                    valtwo = 1;
                }
                if (parseFloat(value.Diag_LowMin_One) > parseFloat(value.Diag_LowMax_One)) {
                    valthree = 1;
                }
                if (parseFloat(value.Diag_HighMin_Two) > parseFloat(value.Diag_HighMax_Two)) {
                    valfour = 1;
                }
                if (parseFloat(value.Diag_MediumMin_Two) > parseFloat(value.Diag_MediumMax_Two)) {
                    valfive = 1;
                }
                if (parseFloat(value.Diag_LowMin_Two) > parseFloat(value.Diag_LowMax_Two)) {
                    valsix = 1;
                }

                stdone = 0;
                stdtwo = 0;
                stdthree = 0;
                stdfour = 0;
                stdfive = 0;
                stdsix = 0;

                if (parseFloat(minPossible) < parseFloat(value.Diag_HighMin_One) || parseFloat(maxPossible) > parseFloat(value.Diag_HighMax_One)) {
                    stdone = 1;
                }
                if (parseFloat(minPossible) < parseFloat(value.Diag_MediumMin_One) || parseFloat(maxPossible) > parseFloat(value.Diag_MediumMax_One)) {
                    stdtwo = 1;
                }
                if (parseFloat(minPossible) < parseFloat(value.Diag_LowMin_One) || parseFloat(maxPossible) > parseFloat(value.Diag_LowMax_One)) {
                    stdthree = 1;
                }
                if (parseFloat(minPossible) < parseFloat(value.Diag_HighMin_Two) || parseFloat(maxPossible) > parseFloat(value.Diag_HighMax_Two)) {
                    stdfour = 1;
                }
                if (parseFloat(minPossible) < parseFloat(value.Diag_MediumMin_Two) || parseFloat(maxPossible) > parseFloat(value.Diag_MediumMax_Two)) {
                    stdfive = 1;
                }
                if (parseFloat(minPossible) < parseFloat(value.Diag_LowMin_Two) || parseFloat(maxPossible) > parseFloat(value.Diag_LowMax_Two)) {
                    stdsix = 1;
                }
                //if (value.COMP_HIGH !=null|| value.COMP_MEDIUM!=null || value.COMP_LOW!=null)  {
                //    val = 1;
                //}               

                if (((value.Diag_HighMin_One + "").split(".")[1] == "")
                    || ((value.Diag_HighMax_One + "").split(".")[1] == "")
                    || ((value.Diag_MediumMin_One + "").split(".")[1] == "")
                    || ((value.Diag_MediumMax_One + "").split(".")[1] == "")
                    || ((value.Diag_LowMin_One + "").split(".")[1] == "")
                    || ((value.Diag_LowMax_One + "").split(".")[1] == "")
                    || ((value.Diag_HighMin_Two + "").split(".")[1] == "")
                    || ((value.Diag_HighMax_Two + "").split(".")[1] == "")
                    || ((value.Diag_MediumMin_Two + "").split(".")[1] == "")
                    || ((value.Diag_MediumMax_Two + "").split(".")[1] == "")
                    || ((value.Diag_LowMin_Two + "").split(".")[1] == "")
                    || ((value.Diag_LowMax_Two + "").split(".")[1] == "")
                ) {
                    splitval = 1;
                }
            });

            if (($scope.ParameterSettingslist.length) != null) {
                var Empvalue = 0;
                angular.forEach($scope.ParameterSettingslist, function (value, index) {

                    if (value.Parameter_Id == null || value.Parameter_Id == 0) {
                        Empvalue = 1;
                    }
                });

                if (Empvalue == 1) {
                    alert("Please select any one Parameter");
                    return false
                }
                if (paramval == 1) {
                    alert("Please select Parameter ");
                    return false
                }

                if (HighMax == 1) {
                    alert("Please enter Compliance Low less than Compliance Count ");
                    return false
                }

                if (MediumMax == 1) {
                    alert("Please enter Compliance Medium less than Compliance Count ");
                    return false
                }

                if (LowMax == 1) {
                    alert("Please enter Compliance High less than Compliance Count");
                    return false
                }

                if (HighMax1 == 1) {
                    alert("Please enter Compliance Medium less than Compliance Low");
                    return false
                }

                if (HighMin1 == 1) {
                    alert("Please enter Compliance High less than Compliance Medium");
                    return false
                }

                if (valone == 1) {
                    alert("Please enter Diagnostic High Max One greater than Diagnostic High Min One");
                    return false
                }
                if (valtwo == 1) {
                    alert("Please enter Diagnostic Medium Max One greater than Medium Min One");
                    return false
                }
                if (valthree == 1) {
                    alert("Please enter Diagnostic Low Max One greater than Diagnostic Low Min One");
                    return false
                }
                if (valfour == 1) {
                    alert("Please enter Diagnostic High Max Two greater than Diagnostic High Min Two");
                    return false
                }
                if (valfive == 1) {
                    alert("Please enter Diagnostic Medium Max Two greater than Diagnostic Medium Min Two");
                    return false
                }
                if (valsix == 1) {
                    alert("Please enter Diagnostic Low Max Two greater than Diagnostic Low Min Two");
                    return false
                }

                /*
                if (stdone == 1) {
                    alert("Please enter Diagnostic High one for the possible range " + minPossible+ "-" +  maxPossible);
                    return false
                }
                if (stdtwo == 1) {
                    alert("Please enter Diagnostic Medium one for the possible range " + minPossible + "-" + maxPossible);
                    return false
                }
                if (stdthree == 1) {
                    alert("Please enter Diagnostic Low one for the possible range " + minPossible + "-" + maxPossible);
                    return false
                }
                if (stdfour == 1) {
                    alert("Please enter Diagnostic High two for the possible range " + minPossible + "-" + maxPossible);
                    return false
                }
                if (stdfive == 1) {
                    alert("Please enter Diagnostic Medium two for the possible range " + minPossible + "-" + maxPossible);
                    return false
                }
                if (stdsix == 1) {
                    alert("Please enter Diagnostic Low two for the possible range " + minPossible + "-" + maxPossible);
                    return false
                }*/

                if (splitval == 1) {
                    alert("Please enter valid values");
                    return false
                }
                if (Normalrange == 1) {
                    alert("Please enter Diagnostic From greater than Diagnostic Low");
                    return false
                }
                //if (val == 1) {
                //    alert("Please enter Compliance Count");
                //    return false
                //}                

            };


            var TSDuplicate = 0;
            var Duplicateparameter = '';
            angular.forEach($scope.ParameterSettingslist, function (value1, index1) {
                angular.forEach($scope.ParameterSettingslist, function (value2, index2) {
                    if (index1 > index2 && value1.Parameter_Id == value2.Parameter_Id) {
                        TSDuplicate = 1;
                        Duplicateparameter = Duplicateparameter + value2.ParameterName + ',';
                    };
                });
            });


            var MinvalueDuplicate1 = 0;
            var DuplicateMinvalue1 = '';
            var MinvalueDuplicate2 = 0;
            var DuplicateMinvalue2 = '';
            var MinvalueDuplicate3 = 0;
            var DuplicateMinvalue3 = '';
            var MinvalueDuplicate4 = 0;
            var DuplicateMinvalue4 = '';
            var MinvalueDuplicate5 = 0;
            var DuplicateMinvalue5 = '';
            var MinvalueDuplicate6 = 0;
            var DuplicateMinvalue6 = '';


            angular.forEach($scope.ParameterSettingslist, function (value1, index1) {
                angular.forEach($scope.ParameterSettingslist, function (value2, index2) {

                    if (value1.Diag_MediumMin_One != null && value1.Diag_MediumMax_One != null) {
                        //Medium //hight min and max
                        if ((parseFloat(value1.Diag_MediumMin_One) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_MediumMin_One) < parseFloat(value1.Diag_HighMax_One))
                            || (parseFloat(value1.Diag_MediumMax_One) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_MediumMax_One) < parseFloat(value1.Diag_HighMax_One))
                            //low min and max
                            || (parseFloat(value1.Diag_MediumMin_One) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_MediumMin_One) < parseFloat(value1.Diag_LowMax_One))
                            || (parseFloat(value1.Diag_MediumMax_One) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_MediumMax_One) < parseFloat(value1.Diag_LowMax_One))
                            //high1 min and max
                            || (parseFloat(value1.Diag_MediumMin_One) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_MediumMin_One) < parseFloat(value1.Diag_HighMax_Two))
                            || (parseFloat(value1.Diag_MediumMax_One) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_MediumMax_One) < parseFloat(value1.Diag_HighMax_Two))
                            //medium1 min and max
                            || (parseFloat(value1.Diag_MediumMin_One) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_MediumMin_One) < (value1.Diag_MediumMax_Two))
                            || (parseFloat(value1.Diag_MediumMax_One) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_MediumMax_One) < parseFloat(value1.Diag_MediumMax_Two))
                            //low1 min and max
                            || (parseFloat(value1.Diag_MediumMin_One) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_MediumMin_One) < parseFloat(value1.Diag_LowMax_Two))
                            || (parseFloat(value1.Diag_MediumMax_One) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_MediumMax_One) < parseFloat(value1.Diag_LowMax_Two))

                        ) {
                            MinvalueDuplicate1 = 1;
                            DuplicateMinvalue1 = "Diagnostic already exist for Parameter " + value1.ParameterName + " ( Min Value " + value1.Diag_MediumMin_One + " to " + "Max Value " + value1.Diag_MediumMax_One + " )";
                        }
                    }

                    if (value1.Diag_HighMin_One != null && value1.Diag_HighMax_One != null) {
                        //High // Medium min and max
                        if ((parseFloat(value1.Diag_HighMin_One) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_HighMin_One) < parseFloat(value1.Diag_MediumMax_One))
                            || (parseFloat(value1.Diag_HighMax_One) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_HighMax_One) < parseFloat(value1.Diag_MediumMax_One))
                            //low min and max
                            || (parseFloat(value1.Diag_HighMin_One) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_HighMin_One) < parseFloat(value1.Diag_LowMax_One))
                            || (parseFloat(value1.Diag_HighMax_One) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_HighMax_One) < parseFloat(value1.Diag_LowMax_One))
                            //high1 min and max
                            || (parseFloat(value1.Diag_HighMin_One) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_HighMin_One) < parseFloat(value1.Diag_HighMax_Two))
                            || (parseFloat(value1.Diag_HighMax_One) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_HighMax_One) < parseFloat(value1.Diag_HighMax_Two))
                            //medium1 min and max
                            || (parseFloat(value1.Diag_HighMin_One) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_HighMin_One) < parseFloat(value1.Diag_MediumMax_Two))
                            || (parseFloat(value1.Diag_HighMax_One) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_HighMax_One) < parseFloat(value1.Diag_MediumMax_Two))
                            //low1 min and max
                            || (parseFloat(value1.Diag_HighMin_One) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_HighMin_One) < parseFloat(value1.Diag_LowMax_Two))
                            || (parseFloat(value1.Diag_HighMax_One) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_HighMax_One) < parseFloat(value1.Diag_LowMax_Two))

                        ) {
                            MinvalueDuplicate2 = 1;
                            DuplicateMinvalue2 = "Diagnostic already exist for Parameter " + value1.ParameterName + "  ( Min Value" + value1.Diag_HighMin_One + " to " + "Max Value " + value1.Diag_HighMax_One + " )";
                        }
                    }

                    if (value1.Diag_LowMin_One != null && value1.Diag_LowMax_One != null) {
                        //Low // high min and max
                        if ((parseFloat(value1.Diag_LowMin_One) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_LowMin_One) < parseFloat(value1.Diag_MediumMax_One))
                            || (parseFloat(value1.Diag_LowMax_One) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_LowMax_One) < parseFloat(value1.Diag_MediumMax_One))
                            //low min and max
                            || (parseFloat(value1.Diag_LowMin_One) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_LowMin_One) < parseFloat(value1.Diag_HighMax_One))
                            || (parseFloat(value1.Diag_LowMax_One) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_LowMax_One) < parseFloat(value1.Diag_HighMax_One))
                            //high1 min and max
                            || (parseFloat(value1.Diag_LowMin_One) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_LowMin_One) < parseFloat(value1.Diag_HighMax_Two))
                            || (parseFloat(value1.Diag_LowMax_One) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_LowMax_One) < parseFloat(value1.Diag_HighMax_Two))
                            //medium1 min and max
                            || (parseFloat(value1.Diag_LowMin_One) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_LowMin_One) < parseFloat(value1.Diag_MediumMax_Two))
                            || (parseFloat(value1.Diag_LowMax_One) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_LowMax_One) < parseFloat(value1.Diag_MediumMax_Two))
                            //low1 min and max
                            || (parseFloat(value1.Diag_LowMin_One) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_LowMin_One) < parseFloat(value1.Diag_LowMax_Two))
                            || (parseFloat(value1.Diag_LowMax_One) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_LowMax_One) < parseFloat(value1.Diag_LowMax_Two))

                        ) {
                            MinvalueDuplicate3 = 1;
                            DuplicateMinvalue3 = "Diagnostic already exist for Parameter " + value1.ParameterName + "  ( Min Value " + value1.Diag_LowMin_One + " to " + "Max Value " + value1.Diag_LowMax_One + " )";
                        }
                    }

                    if (value1.Diag_HighMin_Two != null && value1.Diag_HighMax_Two != null) {
                        //High1 // high min and max
                        if ((parseFloat(value1.Diag_HighMin_Two) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_HighMin_Two) < parseFloat(value1.Diag_MediumMax_One))
                            || (parseFloat(value1.Diag_HighMax_Two) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_HighMax_Two) < parseFloat(value1.Diag_MediumMax_One))
                            //low min and max
                            || (parseFloat(value1.Diag_HighMin_Two) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_HighMin_Two) < parseFloat(value1.Diag_HighMax_One))
                            || (parseFloat(value1.Diag_HighMax_Two) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_HighMax_Two) < parseFloat(value1.Diag_HighMax_One))
                            //high1 min and max
                            || (parseFloat(value1.Diag_HighMin_Two) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_HighMin_Two) < parseFloat(value1.Diag_LowMax_One))
                            || (parseFloat(value1.Diag_HighMax_Two) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_HighMax_Two) < parseFloat(value1.Diag_LowMax_One))
                            //medium1 min and max
                            || (parseFloat(value1.Diag_HighMin_Two) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_HighMin_Two) < parseFloat(value1.Diag_MediumMax_Two))
                            || (parseFloat(value1.Diag_HighMax_Two) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_HighMax_Two) < parseFloat(value1.Diag_MediumMax_Two))
                            //low1 min and max
                            || (parseFloat(value1.Diag_HighMin_Two) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_HighMin_Two) < parseFloat(value1.Diag_LowMax_Two))
                            || (parseFloat(value1.Diag_HighMax_Two) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_HighMax_Two) < parseFloat(value1.Diag_LowMax_Two))

                        ) {
                            MinvalueDuplicate4 = 1;
                            DuplicateMinvalue4 = "Diagnostic already exist for Parameter " + value1.ParameterName + "  ( Min Value " + value1.Diag_HighMin_Two + " to " + "Max Value " + value1.Diag_HighMax_Two + " )";
                        }
                    }

                    if (value1.Diag_MediumMin_Two != null && value1.Diag_MediumMax_Two != null) {
                        //Medium1 // high min and max
                        if ((parseFloat(value1.Diag_MediumMin_Two) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_MediumMin_Two) < parseFloat(value1.Diag_MediumMax_One))
                            || (parseFloat(value1.Diag_MediumMax_Two) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_MediumMax_Two) < parseFloat(value1.Diag_MediumMax_One))
                            //low min and max
                            || (parseFloat(value1.Diag_MediumMin_Two) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_MediumMin_Two) < parseFloat(value1.Diag_HighMax_One))
                            || (parseFloat(value1.Diag_MediumMax_Two) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_MediumMax_Two) < parseFloat(value1.Diag_HighMax_One))
                            //high1 min and max
                            || (parseFloat(value1.Diag_MediumMin_Two) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_MediumMin_Two) < parseFloat(value1.Diag_LowMax_One))
                            || (parseFloat(value1.Diag_MediumMax_Two) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_MediumMax_Two) < parseFloat(value1.Diag_LowMax_One))
                            //medium1 min and max
                            || (parseFloat(value1.Diag_MediumMin_Two) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_MediumMin_Two) < parseFloat(value1.Diag_HighMax_Two))
                            || (parseFloat(value1.Diag_MediumMax_Two) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_MediumMax_Two) < parseFloat(value1.Diag_HighMax_Two))
                            //low1 min and max
                            || (parseFloat(value1.Diag_MediumMin_Two) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_MediumMin_Two) < parseFloat(value1.Diag_LowMax_Two))
                            || (parseFloat(value1.Diag_MediumMax_Two) > parseFloat(value1.Diag_LowMin_Two) && parseFloat(value1.Diag_MediumMax_Two) < parseFloat(value1.Diag_LowMax_Two))

                        ) {
                            MinvalueDuplicate5 = 1;
                            DuplicateMinvalue5 = "Diagnostic already exist for Parameter " + value1.ParameterName + "  ( Min Value " + value1.Diag_MediumMin_Two + " to " + "Max Value " + value1.Diag_MediumMax_Two + " )";
                        }
                    }

                    if (value1.Diag_LowMin_Two != null && value1.Diag_LowMax_Two != null) {
                        //low1 // high min and max
                        if ((parseFloat(value1.Diag_LowMin_Two) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_LowMin_Two) < parseFloat(value1.Diag_MediumMax_One))
                            || (parseFloat(value1.Diag_LowMax_Two) > parseFloat(value1.Diag_MediumMin_One) && parseFloat(value1.Diag_LowMax_Two) < parseFloat(value1.Diag_MediumMax_One))
                            //low min and max
                            || (parseFloat(value1.Diag_LowMin_Two) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_LowMin_Two) < parseFloat(value1.Diag_HighMax_One))
                            || (parseFloat(value1.Diag_LowMax_Two) > parseFloat(value1.Diag_HighMin_One) && parseFloat(value1.Diag_LowMax_Two) < parseFloat(value1.Diag_HighMax_One))
                            //high1 min and max
                            || (parseFloat(value1.Diag_LowMin_Two) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_LowMin_Two) < parseFloat(value1.Diag_LowMax_One))
                            || (parseFloat(value1.Diag_LowMax_Two) > parseFloat(value1.Diag_LowMin_One) && parseFloat(value1.Diag_LowMax_Two) < parseFloat(value1.Diag_LowMax_One))
                            //medium1 min and max
                            || (parseFloat(value1.Diag_LowMin_Two) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_LowMin_Two) < parseFloat(value1.Diag_HighMax_Two))
                            || (parseFloat(value1.Diag_LowMax_Two) > parseFloat(value1.Diag_HighMin_Two) && parseFloat(value1.Diag_LowMax_Two) < parseFloat(value1.Diag_HighMax_Two))
                            //low1 min and max
                            || (parseFloat(value1.Diag_LowMin_Two) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_LowMin_Two) < parseFloat(value1.Diag_MediumMax_Two))
                            || (parseFloat(value1.Diag_LowMax_Two) > parseFloat(value1.Diag_MediumMin_Two) && parseFloat(value1.Diag_LowMax_Two) < parseFloat(value1.Diag_MediumMax_Two))
                        ) {
                            MinvalueDuplicate6 = 1;
                            DuplicateMinvalue6 = "Diagnostic already exist for Parameter " + value1.ParameterName + "  ( Min Value " + value1.Diag_LowMin_Two + " to " + "Max Value " + value1.Diag_LowMax_Two + " )";
                        }
                    }

                })
            });


            if (TSDuplicate == 1) {
                alert('Parameters ' + Duplicateparameter + ' already exist, cannot be Duplicated');
                return false;
            }
            if (MinvalueDuplicate1 == 1) {
                alert(DuplicateMinvalue1);
                return false;
            }
            if (MinvalueDuplicate2 == 1) {
                alert(DuplicateMinvalue2);
                return false;
            }
            if (MinvalueDuplicate3 == 1) {
                alert(DuplicateMinvalue3);
                return false;
            }
            if (MinvalueDuplicate4 == 1) {
                alert(DuplicateMinvalue4);
                return false;
            }
            if (MinvalueDuplicate5 == 1) {
                alert(DuplicateMinvalue5);
                return false;
            }
            if (MinvalueDuplicate6 == 1) {
                alert(DuplicateMinvalue6);
                return false;
            }
            return true;
        }


        $scope.ParameterSettingslist = [];
        /*ARRAY LIST FOR THE CHILD TABLE CUSTOMER DETAILS */
        $scope.ParameterSettingslist = [{
            'Id': 0,
            'Protocol_Id': 0,
            'ProtocolName': '',
            'Institution_Id': 0,
            'Institution_Name': '',
            'Parameter_Id': 0,
            'ParameterName': '',
            'Units_Id': '',
            'UnitsName': '',
            'Com_DurationType': 0,
            'DurationName': '',
            'Diag_HighMax_One': '',
            'Diag_HighMin_One': '',
            'Diag_MediumMax_One': '',
            'Diag_MediumMin_One': '',
            'Diag_LowMax_One': '',
            'Diag_LowMin_One': '',
            'Diag_HighMax_Two': '',
            'Diag_HighMin_Two': '',
            'Diag_MediumMax_Two': '',
            'Diag_MediumMin_Two': '',
            'Diag_LowMax_Two': '',
            'Diag_LowMin_Two': '',
            'Comp_Duration': '',
            'Comp_High': '',
            'Comp_Medium': '',
            'Comp_Low': '',
            'Isactive': 1,
            'Created_By': '',
            'NormalRange_High': '',
            'NormalRange_Low': ''
        }];

        /*Add New Row */
        $scope.MonitoringParameterSettings_Insert = function () {
            if ($scope.ParameterSettingslist.length > 0) {
                var obj =
                {
                    'Id': 0,
                    'Protocol_Id': 0,
                    'ProtocolName': '',
                    'Institution_Id': 0,
                    'Institution_Name': '',
                    'Parameter_Id': 0,
                    'ParameterName': '',
                    'Units_Id': '',
                    'UnitsName': '',
                    'Com_DurationType': 0,
                    'DurationName': '',
                    'Diag_HighMax_One': '',
                    'Diag_HighMin_One': '',
                    'Diag_MediumMax_One': '',
                    'Diag_MediumMin_One': '',
                    'Diag_LowMax_One': '',
                    'Diag_LowMin_One': '',
                    'Diag_HighMax_Two': '',
                    'Diag_HighMin_Two': '',
                    'Diag_MediumMax_Two': '',
                    'Diag_MediumMin_Two': '',
                    'Diag_LowMax_Two': '',
                    'Diag_LowMin_Two': '',
                    'Comp_Duration': '',
                    'Comp_High': '',
                    'Comp_Medium': '',
                    'Comp_Low': '',
                    'Isactive': 1,
                    'Created_By': '',
                    'NormalRange_High': '',
                    'NormalRange_Low': ''
                }
                $scope.ParameterSettingslist.push(obj);
            }
            else {
                $scope.ParameterSettingslist = [{
                    'Id': 0,
                    'Protocol_Id': 0,
                    'ProtocolName': '',
                    'Institution_Id': 0,
                    'Institution_Name': '',
                    'Parameter_Id': 0,
                    'ParameterName': '',
                    'Units_Id': '',
                    'UnitsName': '',
                    'Com_DurationType': 0,
                    'DurationName': '',
                    'Diag_HighMax_One': '',
                    'Diag_HighMin_One': '',
                    'Diag_MediumMax_One': '',
                    'Diag_MediumMin_One': '',
                    'Diag_LowMax_One': '',
                    'Diag_LowMin_One': '',
                    'Diag_HighMax_Two': '',
                    'Diag_HighMin_Two': '',
                    'Diag_MediumMax_Two': '',
                    'Diag_MediumMin_Two': '',
                    'Diag_LowMax_Two': '',
                    'Diag_LowMin_Two': '',
                    'Comp_Duration': '',
                    'Comp_High': '',
                    'Comp_Medium': '',
                    'Comp_Low': '',
                    'Isactive': 1,
                    'Created_By': '',
                    'NormalRange_High': '',
                    'NormalRange_Low': ''
                }];
            };
        };

        /*on click Save calling the insert update function for Monitoring Protocol
         and check the Monitoring Protocol Name already exist,if exist it display alert message or its 
         calling the insert update function*/
        $scope.Id = 0;
        $scope.ChildId = 0;
        $scope.InstituteId = 0;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.User_Id = $window.localStorage['UserId'];
        $scope.ParameterSettingslist = [];
        $scope.MonitoringDetails = [];
        $scope.ProtocolParameter_AddEdit = function () {
            $scope.MonitoringDetails = [];

            if ($scope.ProtocolMonitoring_Validations() == true) {
                $("#chatLoaderPV").show();
                if ($scope.ParameterSettingslistDelete.length > 0) {
                    angular.forEach($scope.ParameterSettingslistDelete, function (Selected1, index1) {
                        $scope.ProtocolDetails_Delete(Selected1.Id);
                    });
                }

                angular.forEach($scope.ParameterSettingslist, function (Selected, index) {

                    var obj = {
                        Id: Selected.Id,
                        // PROTOCOL_ID: Selected.PARAMETER_ID,
                        Institution_Id: $scope.InstituteId == 0 ? null : $scope.InstituteId,
                        Parameter_Id: Selected.Parameter_Id == 0 ? null : Selected.Parameter_Id,
                        Units_Id: Selected.Units_Id == 0 ? null : Selected.Units_Id,
                        Diag_HighMax_One: Selected.Diag_HighMax_One,
                        Diag_HighMin_One: Selected.Diag_HighMin_One,
                        Diag_MediumMax_One: Selected.Diag_MediumMax_One,
                        Diag_MediumMin_One: Selected.Diag_MediumMin_One,
                        Diag_LowMax_One: Selected.Diag_LowMax_One,
                        Diag_LowMin_One: Selected.Diag_LowMin_One,
                        Diag_HighMax_Two: Selected.Diag_HighMax_Two,
                        Diag_HighMin_Two: Selected.Diag_HighMin_Two,
                        Diag_MediumMax_Two: Selected.Diag_MediumMax_Two,
                        Diag_MediumMin_Two: Selected.Diag_MediumMin_Two,
                        Diag_LowMax_Two: Selected.Diag_LowMax_Two,
                        Diag_LowMin_Two: Selected.Diag_LowMin_Two,
                        Com_DurationType: Selected.Com_DurationType == 0 ? null : Selected.Com_DurationType,
                        Comp_Duration: Selected.Comp_Duration,
                        Comp_High: Selected.Comp_High,
                        Comp_Medium: Selected.Comp_Medium,
                        Comp_Low: Selected.Comp_Low,
                        //ISACTIVE: Selected.IsActive,
                        Created_By: $scope.User_Id,
                        NormalRange_High: Selected.NormalRange_High,
                        NormalRange_Low: Selected.NormalRange_Low,
                    }
                    $scope.MonitoringDetails.push(obj);
                });

                var obj1 = {
                    Id: $scope.Id,
                    Institution_Id: $scope.InstituteId == 0 ? null : $scope.InstituteId,
                    Protocol_Name: $scope.ProtocolName,
                    Created_By: $scope.User_Id,
                    ChildModuleList: $scope.MonitoringDetails
                };

                $http.post(baseUrl + '/api/Protocol/ProtocolMonitoring_AddEdit/', obj1).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //$http.post(baseUrl + '/api/StandaredProtocol/ProtocolMonitoring_AddEdit/', obj).success(function (data) {
                    alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        $scope.CancelProtocol();

                        $scope.MonitoringProtocolDetailsListGo();

                        $scope.ProtocolClear();
                        $scope.CloneProtocolFunction();
                    }
                });
            }
        }

        $scope.CloneProtocolClear = function () {
            $scope.Cloneval = 0;
        };


        /* Protocol clear fucntion */
        $scope.ProtocolClear = function () {
            $scope.Id = 0;
            $scope.Protocol_Id = "0";
            $scope.ProtocolName = "";
            $scope.Protocol_Names = "0";
            //  $scope.Cloneval =0;
            $scope.ParameterSettingslist = [];
            $scope.ParameterSettingslist = [{
                // 'Id': 0,
                'Protocol_Id': 0,
                'ProtocolName': '',
                'Institution_Id': 0,
                'Institution_Name': '',
                'Parameter_Id': 0,
                'ParameterName': '',
                'Units_Id': '',
                'UnitsName': '',
                'Com_DurationType': 0,
                'DurationName': '',
                'Diag_HighMax_One': '',
                'Diag_HighMin_One': '',
                'Diag_MediumMax_One': '',
                'Diag_MediumMin_One': '',
                'Diag_LowMax_One': '',
                'Diag_LowMin_One': '',
                'Diag_HighMax_Two': '',
                'Diag_HighMin_Two': '',
                'Diag_MediumMax_Two': '',
                'Diag_MediumMin_Two': '',
                'Diag_LowMax_Two': '',
                'Diag_LowMin_Two': '',
                'Comp_Duration': '',
                'Comp_High': '',
                'Comp_Medium': '',
                'Comp_Low': '',
                'Isactive': 1,
                'Created_By': '',
                'NormalRange_High': '',
                'NormalRange_Low': ''
            }];
        };

        $scope.DuplicatesId = 0;
        /*THIS IS FOR View FUNCTION*/
        $scope.ProtocolDetails_View = function () {

            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_View/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = data.Id;
                $scope.Institution_Name = data.Institution_Id;
                $scope.ViewInstitution_Name = data.Institution_Name;
                $scope.ProtocolName = data.Protocol_Name;
                $scope.ParameterSettingslist = data.ChildModuleList;

                angular.forEach($scope.ParameterSettingslist, function (value, index) {
                    if (value.NormalRange_High == null || value.NormalRange_Low == null) {
                        $scope.ParameterSettings_ViewEdit();
                    }
                })
            });
        }

        /* THIS IS FUNCTION FOR CLOSE Page  */
        $scope.CancelProtocol = function () {
            angular.element('#ProtocolCreateModal').modal('hide');
        };
        $scope.CancelCloneProtocol = function () {
            angular.element('#CloneProtocolCreateModal').modal('hide');
        };
        $scope.CancelViewProtocol = function () {
            angular.element('#ProtocolviewModal').modal('hide');
        }

        /* 
        Calling the api method to detele the details of the Protocol Monitoring 
        for the Protocol Monitoring Id,
        and redirected to the list page.
        */
        $scope.DeleteInstitution = function (comId) {
            $scope.Id = comId;
            $scope.Institution_Delete();
        };

        $scope.Institution_Delete = function () {
            var del = confirm("Do you like to deactivate the selected Institution?");
            if (del == true) {
                $http.get(baseUrl + 'api/Institution/InstitutionDetails_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Institution has been deactivated Successfully");
                    $scope.InstitutionDetailsListGo();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Institution!" + data;
                });
            };
        };

        /*'Active' the Protocol Monitoring*/
        $scope.ReInsertProtocol = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertProtocolDetails();
        };

        /* 
        Calling the api method to inactived the details of the Protocol Monitoring
        and redirected to the list page.
        */
        $scope.ReInsertProtocolDetails = function () {
            var Ins = confirm("Do you like to activate the selected Monitoring Protocol?");
            if (Ins == true) {
                $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Monitoring Protocol has been activated successfully");
                    $scope.MonitoringProtocolDetailsListGo();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ReInsert Monitoring Protocol Details" + data;
                });
            };
        }

        /* Calling the api method to detele the details of the Protocol Monitoring 
        for the Protocol Monitoring Id,
        and redirected to the list page.
        */
        $scope.InActiveProtocol = function (comId) {
            $scope.Id = comId;
            $scope.Protocol_InActive();
        };
        $scope.Protocol_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Monitoring Protocol?");
            if (del == true) {
                $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_InActive/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Monitoring Protocol has been deactivated Successfully");
                    $scope.MonitoringProtocolDetailsListGo();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Monitoring Protocol!" + data;
                });
            };
        };

        /*'Active' the Protocol Monitoring*/
        $scope.ReInsertInstitution = function (comId) {
            $scope.Id = comId;
            $scope.ReInsertInstitutionDetails();

        };

        /* 
        Calling the api method to inactived the details of the Protocol 
        for the  Protocol Id,
        and redirected to the list page.
        */
        $scope.ReInsertInstitutionDetails = function () {
            var Ins = confirm("Do you like to activate the selected Institution?");
            if (Ins == true) {
                $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Institution has been activated successfully");
                    $scope.InstitutionDetailsListGo();
                }).error(function (data) {
                    $scope.error = "An error has occurred while ReInsertInstitutionDetails" + data;
                });
            };
        }

        /*Calling api method for delete selected Skill details for the Protocol name*/
        $scope.ProtocolDetails_Delete = function (ParamId) {

            $http.get(baseUrl + '/api/Protocol/ProtocolMonitoring_Delete/?Id=' + ParamId).success(function (Vitaldata) {
            }).error(function (Vitaldata) {
                $scope.error = "AN error has occured while deleting records" + Vitaldata;
            });
        };
        $scope.ParameterSettingslistDelete = [];
        $scope.MonitoringProtocolDelete = function (itemIndex, ParamId) {
            var del = confirm("Do you like to delete the selected Parameter?");
            if (del == true) {
                if ($scope.Id <= 0) {
                    $scope.ParameterSettingslist.splice(itemIndex, 1);
                    if ($scope.ParameterSettingslist.length == 0) {
                        $scope.ParameterSettingslist = [{
                            'Id': 0,
                            'Protocol_Id': 0,
                            'ProtocolName': '',
                            'Institution_Id': 0,
                            'Institution_Name': '',
                            'Parameter_Id': 0,
                            'ParameterName': '',
                            'Units_Id': 0,
                            'UnitsName': '',
                            'Com_DurationType': 0,
                            'DurationName': '',
                            'Diag_HighMax_One': '',
                            'Diag_HighMin_One': '',
                            'Diag_MediumMax_One': '',
                            'Diag_MediumMin_One': '',
                            'Diag_LowMax_One': '',
                            'Diag_LowMin_One': '',
                            'Diag_HighMax_Two': '',
                            'Diag_HighMin_Two': '',
                            'Diag_MediumMax_Two': '',
                            'Diag_MediumMin_Two': '',
                            'Diag_LowMax_Two': '',
                            'Diag_LowMin_Two': '',
                            'Comp_Duration': '',
                            'Comp_High': '',
                            'Comp_Medium': '',
                            'Comp_Low': '',
                            'Isactive': 1,
                            'Created_By': '',
                            'NormalRange_High': '',
                            'NormalRange_Low': ''
                        }];
                    }
                }
                else {

                    $scope.ParameterSettingslistDelete.push(ParamId);

                    $scope.ParameterSettingslist.splice(itemIndex, 1);

                    if ($scope.ParameterSettingslist.length == 0) {
                        $scope.ParameterSettingslist = [{
                            'Id': 0,
                            'Protocol_Id': 0,
                            'ProtocolName': '',
                            'Institution_Id': 0,
                            'Institution_Name': '',
                            'Parameter_Id': 0,
                            'ParameterName': '',
                            'Units_Id': 0,
                            'UnitsName': '',
                            'Com_DurationType': 0,
                            'DurationName': '',
                            'Diag_HighMax_One': '',
                            'Diag_HighMin_One': '',
                            'Diag_MediumMax_One': '',
                            'Diag_MediumMin_One': '',
                            'Diag_LowMax_One': '',
                            'Diag_LowMin_One': '',
                            'Diag_HighMax_Two': '',
                            'Diag_HighMin_Two': '',
                            'Diag_MediumMax_Two': '',
                            'Diag_MediumMin_Two': '',
                            'Diag_LowMax_Two': '',
                            'Diag_LowMin_Two': '',
                            'Comp_Duration': '',
                            'Comp_High': '',
                            'Comp_Medium': '',
                            'Comp_Low': '',
                            'Isactive': 1,
                            'Created_By': '',
                            'NormalRange_High': '',
                            'NormalRange_Low': ''
                        }];

                    }
                }
            }
        };

        /*on clicking Remove in Protocol Filed its calling the Protocol delete funtion */
        $scope.RemoveQualification_Item = function (rowItem) {
            var del = confirm("Do you like to delete this Protocol?");
            if (del == true) {
                var Protocol_Item = [];

                if ($scope.Id <= 0) {
                    angular.forEach($scope.ParameterSettingslist, function (selectedQual, index) {
                        if (index != rowItem) {
                            Protocol_Item.push(selectedQual);
                        }
                    });
                    $scope.ParameterSettingslist = Protocol_Item;
                }
                else if ($scope.Id > 0) {
                    angular.forEach($scope.ParameterSettingslist, function (selectedQual, index) {
                        if (index == rowItem) {
                            $scope.QuaId = selectedQual.Id;
                            $scope.ProtocolDetails_Delete();
                            $scope.AddQualification = [];;
                        }
                        else {
                            Protocol_Item.push(selectedQual);
                        }
                        $scope.AddQualification = Protocol_Item;
                    });

                }
            }
        };
    }
]);


/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("DoctorProfileController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']

        $scope.AddDoctorProfileCreatePopup = function () {

            angular.element('#DoctorProfilePopupCreateModal').modal('show');
        }
        $scope.CancelIntstitutionSubPopup = function () {

            angular.element('#InstitutionsubCreateModal').modal('hide');
        }
        $scope.ViewIntstitutionSubPopup = function () {

            angular.element('#ViewsubModal').modal('show');
        }
        $scope.CancelCreateDoctorProfilePopup = function () {

            angular.element('#DoctorProfilePopupCreateModal').modal('hide');
        }
    }
]);

MyCortexControllers.controller("CoordinatorController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Mode = $routeParams.Id;


        $scope.CGAddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/1");
        }

        $scope.AddPatientPopup = function () {
            $location.path("/Carecoordinatorpatient/2");
        }

        $scope.AddPatientHomePopup = function () {
            $location.path("/Carecoordinatorpatient/4");
        }


        $scope.searchDoctor = function () {

            angular.element('#searchDoctor').modal('show');
        }
        $scope.openProtocol = function () {

            angular.element('#MonitoringProtocolCreateModal').modal('show');
        }


        $scope.PatientAppointmentpopup = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }
        $scope.CancelPatientAppointment = function () {
            angular.element('#PatientAppointmentCreateModal').modal('show');
        }
    }
]);

MyCortexControllers.controller("AllPatientListController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.SearchMsg = "No Data Available";
        $scope.searchquery = "";
        $scope.SearchEncryptedQuery = "";
        $scope.PatientFilter = [];
        $scope.PatientList = [];
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.flag = 0;
        $scope.CommaSeparated_Group = $scope.filter_GroupId.toString();
        $scope.Doctor_Id = $window.localStorage['UserId'];
        $scope.ActiveStatus = "1";
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.PageCountArray = [];
        $scope.Patient_PerPage = 0;
        $scope.PatientCount = 0;
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.PageNumber = 1;
        $scope.loadCount = 0;
        $scope.TabClick = false;

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
            //$scope.PatientListFunction(1);
            $scope.Next_PatientListFunction(1);
        }

        $scope.AllPatientsDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $scope.CountryStateList();
            }
        }

        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;

            });
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
        $scope.PatientFilterCopy = [];
        $scope.PatientFilterCopyList = [];


        $scope.PatientListFunction = function (PageNumber) {
            $("#chatLoaderPV").show();
            $scope.PageNumber = PageNumber;
            $scope.PageCountArray = [];
            //Get the Count of All Patient List
            //  $http.get(baseUrl + '/api/AllPatientList/GetPatientList_Count/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&UserTypeId=' + $scope.UserTypeId 
            //).success(function (data) {
            //    $scope.PatientCount = data[0].PatientCount;
            //Get the Patient Per Page Count
            $scope.ConfigCode = "PATIENTPAGE_COUNT";
            $scope.SelectedInstitutionId = $window.localStorage['InstitutionId'];
            $scope.UserTypeId = $window.localStorage['UserTypeId'];
            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data1) {
                $scope.Patient_PerPage = data1[0].ConfigValue;
                $scope.PageStart = (($scope.PageNumber - 1) * ($scope.Patient_PerPage)) + 1;
                $scope.PageEnd = $scope.PageNumber * $scope.Patient_PerPage;
                $scope.Input_Type = 1;
                $scope.SearchEncryptedQuery = $scope.searchquery;
                var obj = {
                    InputType: $scope.Input_Type,
                    DecryptInput: $scope.SearchEncryptedQuery
                };
                $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                    $scope.SearchEncryptedQuery = data;



                    //Get the Patient List
                    $http.get(baseUrl + '/api/AllPatientList/PatientList/?Doctor_Id=' + $scope.Doctor_Id + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&UserTypeId=' + $scope.UserTypeId + '&StartRowNumber=' + $scope.PageStart + '&EndRowNumber=' + $scope.PageEnd + '&SearchQuery=' + $scope.searchquery + '&SearchEncryptedQuery=' + $scope.SearchEncryptedQuery
                    ).success(function (Patientdata) {
                        $("#chatLoaderPV").hide();
                        $scope.SearchMsg = "No Data Available";
                        $scope.PageCountArray = [];
                        $scope.Patientemptydata = [];
                        $scope.PatientList = [];
                        $scope.PatientList = Patientdata;
                        $scope.Patientemptydata = Patientdata;
                        //$scope.PatientCount = $scope.PatientList.length;
                        $scope.PatientCount = $scope.PatientList[0].TotalRecord;
                        if ($scope.searchquery == '') {
                            total = Math.ceil(($scope.PatientCount) / ($scope.Patient_PerPage));
                            for (var i = 0; i < total; i++) {
                                var obj = {
                                    PageNumber: i + 1
                                }
                                $scope.PageCountArray.push(obj);
                            }
                        }
                        $scope.PatientFilter = angular.copy($scope.PatientList);
                        $scope.PatientFilterCopyList = angular.copy($scope.PatientList);

                    });
                });
            });
        }
        $scope.filterPatientList = function () {
            $("#chatLoaderPV").show();
            $scope.Patientemptydata = [];
            $scope.PatientListFunction(1);
        }
        $scope.Next_PatientListFunction = function (PageNumber) {
            $scope.PageNumber = PageNumber;
            $("#chatLoaderPV").show();
            $scope.Patientemptydata = [];
            $scope.PatientListFunction(PageNumber);
        }
        $scope.AllPatient_PatientData = function (eventId) {
            //All Patients
            $scope.Id = eventId;
            $window.location.href = baseUrl + "/Home/Index#/PatientVitals/" + $scope.Id + "/4";
        }
    }
]);

/* THIS IS FOR CHAT SETTINGS CONTROLLER FUNCTION */
MyCortexControllers.controller("ChatSettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', '$timeout', '$document',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, $timeout, $document) {
        $scope.Id = 0;
        $scope.Flag = [];
        $scope.UserGroupList = [];
        $scope.checkboxObj = [];
        $scope.UserGroupListtwo = [];

        $scope.ChatSettingslist = [];
        $scope.User_Id = $window.localStorage['UserId'];
        $scope.Institution_Id = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        // inittialize the list object for user type
        $http.get(baseUrl + '/api/ChatSettings/ChatSettingsUserType_List/').success(function (data) {

            $scope.UserGroupList = data;
            $scope.UserGroupListtwo = data;
            $scope.firstobj = [];
            $scope.secondobj = [];
            angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {

                angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {
                    var name = Ivalue.Id.toString();
                })
            })

        });

        $http.get(baseUrl + '/api/ChatSettings/ChatPreferenceGet/').success(function (data) {

            $scope.UserGroupList = data;
            $scope.UserGroupListtwo = data;
            $scope.firstobj = [];
            $scope.secondobj = [];
            angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {

                angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {
                    var name = Ivalue.Id.toString();
                })
            })

        });


        //Assign the usertype true or false
        $scope.updateCheckValue = function (OId, IId, $event) {
            var obj = { "OuterId": OId, "InnerId": IId, "Flag": true[0] }
            $scope.checkboxObj.push(obj);

            var checkbox = $event.target;
            var filterObj = $ff($scope.checkboxObj, { "OuterId": OId, "InnerId": IId }, true)[0];
            var checkbox = checkbox.checked;
            if (checkbox == true) {
                filterObj.Flag = 1;
            }
            else {
                filterObj.Flag = 0;
            }
        }


        $scope.ViewupdateCheckValue = function (idx, parentidx, $event) {
            $("#chatLoaderPV").show();
            // call after binding all checkboxes
            if (idx == $scope.UserGroupList.length && parentidx == $scope.UserGroupList.length) {
                setTimeout(function () {
                    $http.get(baseUrl + 'api/ChatSettings/ViewEditChatSettings/?Id=' + $scope.Institution_Id).success(function (data) {
                        $scope.ChatSettingslist = data;

                        angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {
                            angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {

                                var target = document.getElementById('chk-' + Ovalue.Id + '-' + Ivalue.Id);
                                target.checked = false;
                                var filObj = $ff($scope.ChatSettingslist, { "FromUser_TypeId": Ovalue.Id, "ToUser_TypeId": Ivalue.Id }, 1)

                                if ((typeof (filObj) != undefined || typeof (filObj) != null) && filObj.length > 0) {
                                    if (filObj[0].Flag == 1) {
                                        target.checked = true;
                                        var obj = { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id, "Flag": true }
                                        $scope.checkboxObj.push(obj);
                                    }
                                    else {
                                        var obj = { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id, "Flag": false }
                                        $scope.checkboxObj.push(obj);
                                    }
                                }
                                else {
                                    var obj = { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id, "Flag": false }
                                    $scope.checkboxObj.push(obj);
                                }
                            })
                        })
                        $("#chatLoaderPV").hide();
                    })
                }, 1500);
            }

        }


        $scope.FromUser_TypeId = [];
        $scope.ToUser_TypeId = [];
        /*
          Call the api method for insert and Update the record for a chat settings
          and display the record of selected chat settings when Id is greater than 0
          in edit.html and provide an option for select and modify the chat settings and save the chat settings record
          */
        $scope.ChatSettings_AddEdit = function () {
            
            $scope.SaveChatPreference();

            var savecnt = $scope.UserGroupList.length * 2;
            var lpcnt = 0;
            $("#chatLoaderPV").show();
            angular.forEach($scope.UserGroupList, function (Ovalue, Oindex) {
                angular.forEach($scope.UserGroupList, function (Ivalue, Iindex) {
                    var flagstatus = 0;

                    if (($scope.checkboxObj != undefined || $scope.checkboxObj != null) && $scope.checkboxObj.length > 0) {
                        flagstatus = $ff($scope.checkboxObj, { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id }, 1)[0].Flag
                    }
                    else {
                        flagstatus = $ff($scope.checkboxObj, { "OuterId": Ovalue.Id, "InnerId": Ivalue.Id }, 0)[0]
                    };

                    var obj = {
                        Id: $scope.Id,
                        Institution_Id: $scope.Institution_Id,
                        FromUser_TypeId: Ovalue.Id,
                        ToUser_TypeId: Ivalue.Id,
                        Flag: flagstatus,
                        Created_by: $scope.User_Id
                    }

                    if (obj.Flag == true) {
                        obj.Flag = 1;
                    }
                    else {
                        obj.Flag = 0;
                    };

                    
                    $http.post(baseUrl + '/api/ChatSettings/ChatSettings_AddEdit/', obj).success(function (data) {
                       
                        lpcnt = lpcnt + 1 
                        if (savecnt == lpcnt) { 
                            alert(data.Message);
                            $location.path("/EditChatSettings/" + $scope.Institution_Id);
                            //$scope.loading = false;
                            //$rootScope.$broadcast('hide'); 
                            $("#chatLoaderPV").hide();
                        } 
                        
                    })
                   
                }) 
            }) 
            
        };

        /*Store Chat Preference*/
        $scope.SaveChatPreference = function () {
            var type = $scope.Preference_Type;
            $http.get(baseUrl + '/api/ChatSettings/ChatPreferenceSave/?institutionId=' + $window.localStorage['InstitutionId'] + '&preferenceType=' + type).success(function (data) {
                return data;
            })
        }

        /*Set Chat Preference*/
        $scope.SetChatPreference = function () {
            $http.get(baseUrl + '/api/ChatSettings/ChatPreferenceGet/?institutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                $scope.Preference_Type = data.PreferenceType;
            })
        }

        /*LIST REDIRECT FUNCTION */
        $scope.ListRedirect = function () {
            $location.path("/ChatSettings");
        }
    }
]);

// This is for Change Password and Rest Password controller functions/ /
MyCortexControllers.controller("PasswordController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', '$timeout', '$rootScope',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, $timeout, $rootScope) {
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Id = "0";
        $scope.Institution_Id = "";
        $scope.UserTypeName = "0";
        $scope.Usertypelist = [];
        $scope.Userlist = [];
        $scope.Validationchangepasscontrols = function () {
            if (typeof ($scope.Password) != ($scope.OldPassword == "")) {
                $scope.errorlist = "Not a valid password";
                return false;
            }
            return true;
        };

        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.policyExist = false;
        $scope.PasswordPolicyDetails = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/Common/PasswordPolicyDetails_View/?Insitution_Id=' + $scope.InstituteId).success(function (data) {
                if (data != null) {
                    $scope.Insitution_Id = data.Insitution_Id;
                    $scope.Insitution_Name = data.Insitution_Name;
                    $scope.Minimum_Length = data.Minimum_Length;
                    $scope.Maximum_Length = data.Maximum_Length;
                    $scope.UpperCase_Required = data.UpperCase_Required;
                    $scope.LowerCase_Required = data.LowerCase_Required;
                    $scope.Numeric_Required = data.Numeric_Required;
                    $scope.SpecialChar_Required = data.SpecialChar_Required;
                    $scope.Without_Char = data.Without_Char;
                    $scope.Expiry_Period = data.Expiry_Period;
                    $scope.Allow_UserName = data.Allow_UserName;
                    $scope.Restrict_LastPassword = data.Restrict_LastPassword;
                    $scope.MaxLoginMins = data.MaxLoginMins;
                }
                //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
                //$scope.NewPassword = "";
                $("#chatLoaderPV").hide();
            });
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
        };
        $scope.PasswordPolicyDetails();

        $scope.Validationcontrolspassword = function () {
            $scope.PasswordPolicyDetails();

            if (typeof ($scope.OldPassword) == "undefined" || $scope.OldPassword == '') {
                alert("Please enter Password");
                return false;
            }

            if (typeof ($scope.NewPassword) == "undefined" || $scope.NewPassword == '') {
                alert("Please enter New password");
                return false;
            }
            else if (typeof ($scope.confirmpassword) == "undefined" || $scope.confirmpassword == '') {
                alert("Please enter Confirm password");
                return false;
            }

            else if (($scope.confirmpassword) != ($scope.NewPassword)) {
                alert("New password and Confirm Password mismatch Please enter same password");
                return false;
            }
            //Password policy based validations
            else if (parseInt(('' + $scope.NewPassword).length) < parseInt($scope.Minimum_Length)) {
                alert("Your Name Should Contain Minimum Length is " + $scope.Minimum_Length);
                return false;
            }

            else if (parseInt(('' + $scope.NewPassword).length) > parseInt($scope.Maximum_Length)) {
                alert("Sorry You are Exceeding the Limit is " + $scope.Maximum_Length);
                return false;
            }
            $scope.flag = 0;
            $scope.flagchar = 0;

            var newpass = ('' + $scope.NewPassword).length;

            /* Validation for new password have a special character password */
            if (($scope.SpecialChar_Required != null)) {

                var newpasschar = ('' + $scope.NewPassword).length;
                var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

                while (newpasschar--) {

                    var y = $scope.NewPassword.substring(newpasschar, newpasschar + 1);

                    if (y.match(format)) {

                        $scope.flagchar += 1;
                    }
                }

                if ($scope.flagchar <= 0) {
                    alert("Please enter atleast one special character ");
                    return false;
                }
            }


            $scope.flagspl = 0;
            $scope.flagchars = 0;
            /* Validation for new password have not a special character and number in password */
            if (($scope.Without_Char != null)) {

                var newpasssplchar = ('' + $scope.NewPassword).length;
                while (newpasssplchar--) {
                    var z = $scope.NewPassword.substring(newpasssplchar, newpasssplchar + 1);

                    var leng = ('' + $scope.Without_Char).length;
                    while (leng--) {
                        var a = $scope.Without_Char.substring(leng, leng + 1);

                        if (angular.equals(z, a)) {
                            alert($scope.Without_Char + "  characters not allowed, please check");
                            return false;
                        }

                    }

                }
            }


            /* Validation for new password have a number password */
            if (($scope.Numeric_Required != null)) {
                while (newpass--) {
                    var x = $scope.NewPassword.substring(newpass, newpass + 1);
                    if (!isNaN(x)) {
                        $scope.flag += 1;
                    }
                }
                if ($scope.flag <= 0) {
                    alert("Please enter atleast one number ");
                    return false;
                }
            }

            /* Allow the user name same as password*/
            $scope.flagAllow = 0;
            if (($scope.Allow_UserName == null)) {
                $scope.username = $window.localStorage['Username'];
                var user = $scope.username;
                var pwd = $scope.NewPassword;
                if (user == pwd) {
                    alert("Username and password is same, please check the password");
                    return false;
                }

            }

            $scope.flagUpper = 0;
            $scope.flagcharUpper = 0;

            var newpass = ('' + $scope.NewPassword).length;

            /* Validation for new password have a special character password */
            if (($scope.UpperCase_Required != null)) {

                var newpassupperchar = ('' + $scope.NewPassword).length;
                var format = /[A-Z]/;

                while (newpassupperchar--) {

                    var y = $scope.NewPassword.substring(newpassupperchar, newpassupperchar + 1);

                    if (y.match(format)) {

                        $scope.flagcharUpper += 1;
                    }
                }

                if ($scope.flagcharUpper <= 0) {
                    alert("Please enter atleast one uppercase letter ");
                    return false;
                }
            }

            $scope.flagLower = 0;
            $scope.flagcharLower = 0;

            var newpass = ('' + $scope.NewPassword).length;

            /* Validation for new password have a special character password */
            if (($scope.LowerCase_Required != null)) {

                var newpasslowerchar = ('' + $scope.NewPassword).length;
                var formats = /[a-z]/;

                while (newpasslowerchar--) {

                    var y = $scope.NewPassword.substring(newpasslowerchar, newpasslowerchar + 1);

                    if (y.match(formats)) {

                        $scope.flagcharLower += 1;
                    }
                }

                if ($scope.flagcharLower <= 0) {
                    alert("Please enter atleast one lowercase letter ");
                    return false;
                }
            }


            return true;
        }
        /* Validating the create page mandatory fields
                checking mandatory for the follwing fields
                NewPasssword,ReenterPassword
                and showing alert message when it is null.
                */
        $scope.Validationresetcontrols = function () {
            //$scope.PasswordPolicyDetails();
            if (typeof ($scope.UserTypeName) == "undefined" || $scope.UserTypeName == 0) {
                alert("Please select User Type");
                return false;
            }
            if (typeof ($scope.User_Selected) == "undefined" || $scope.User_Selected == '') {
                alert("Please select User");
                return false;
            }
            if (typeof ($scope.NewPassword) == "undefined" || $scope.NewPassword == '') {
                alert("Please enter New password");
                return false;
            }
            if (typeof ($scope.ReenterPassword) == "undefined" || $scope.ReenterPassword == '') {
                alert("Please enter Re-enter password");
                return false;
            }
            if (($scope.NewPassword) != ($scope.ReenterPassword)) {
                alert("New password and Re-enter Password mismatch please enter same password");
                return NewPasssword;
            }
            //Password policy based validations
            else if (parseInt(('' + $scope.NewPassword).length) < parseInt($scope.Minimum_Length)) {
                alert("Your Name Should Contain Minimum Length is " + $scope.Minimum_Length);
                return false;
            }

            else if (parseInt(('' + $scope.NewPassword).length) > parseInt($scope.Maximum_Length)) {
                alert("Sorry You are Exceeding the Limit is " + $scope.Maximum_Length);
                return false;
            }
            $scope.flag = 0;
            $scope.flagchar = 0;

            var newpass = ('' + $scope.NewPassword).length;

            /* Validation for new password have a special character password */
            if (($scope.SpecialChar_Required != null)) {

                var newpasschar = ('' + $scope.NewPassword).length;
                var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

                while (newpasschar--) {

                    var y = $scope.NewPassword.substring(newpasschar, newpasschar + 1);

                    if (y.match(format)) {

                        $scope.flagchar += 1;
                    }
                }

                if ($scope.flagchar <= 0) {
                    alert("Please enter atleast one special character ");
                    return false;
                }
            }


            $scope.flagspl = 0;
            $scope.flagchars = 0;
            /* Validation for new password have not a special character and number in password */
            if (($scope.Without_Char != null)) {

                var newpasssplchar = ('' + $scope.NewPassword).length;
                while (newpasssplchar--) {
                    var z = $scope.NewPassword.substring(newpasssplchar, newpasssplchar + 1);

                    var leng = ('' + $scope.Without_Char).length;
                    while (leng--) {
                        var a = $scope.Without_Char.substring(leng, leng + 1);

                        if (angular.equals(z, a)) {
                            alert($scope.Without_Char + "  characters not allowed, please check");
                            return false;
                        }

                    }

                }
            }


            /* Validation for new password have a number password */
            if (($scope.Numeric_Required != null)) {
                while (newpass--) {
                    var x = $scope.NewPassword.substring(newpass, newpass + 1);
                    if (!isNaN(x)) {
                        $scope.flag += 1;
                    }
                }
                if ($scope.flag <= 0) {
                    alert("Please enter atleast one number ");
                    return false;
                }
            }

            /* Allow the user name same as password*/
            $scope.flagAllow = 0;
            if (($scope.Allow_UserName == null)) {
                $scope.username = $window.localStorage['Username'];
                var user = $scope.username;
                var pwd = $scope.NewPassword;
                if (user == pwd) {
                    alert("Username and password is same, please check the password");
                    return false;
                }

            }

            $scope.flagUpper = 0;
            $scope.flagcharUpper = 0;

            var newpass = ('' + $scope.NewPassword).length;

            /* Validation for new password have a special character password */
            if (($scope.UpperCase_Required != null)) {

                var newpassupperchar = ('' + $scope.NewPassword).length;
                var format = /[A-Z]/;

                while (newpassupperchar--) {

                    var y = $scope.NewPassword.substring(newpassupperchar, newpassupperchar + 1);

                    if (y.match(format)) {

                        $scope.flagcharUpper += 1;
                    }
                }

                if ($scope.flagcharUpper <= 0) {
                    alert("Please enter atleast one uppercase letter ");
                    return false;
                }
            }

            $scope.flagLower = 0;
            $scope.flagcharLower = 0;

            var newpass = ('' + $scope.NewPassword).length;

            /* Validation for new password have a special character password */
            if (($scope.LowerCase_Required != null)) {

                var newpasslowerchar = ('' + $scope.NewPassword).length;
                var formats = /[a-z]/;

                while (newpasslowerchar--) {

                    var y = $scope.NewPassword.substring(newpasslowerchar, newpasslowerchar + 1);

                    if (y.match(formats)) {

                        $scope.flagcharLower += 1;
                    }
                }

                if ($scope.flagcharLower <= 0) {
                    alert("Please enter atleast one lowercase letter ");
                    return false;
                }
            }

            return true;

        };
        $scope.PageParameter = $routeParams.Id;
        $scope.CancelPopup = function () {
            angular.element('#ChangepasswordpopupModal').modal('hide');
        }
        /*
    Call the api method for insert and Update the record for a change password
    and display the record of selected change password when Id is greater than 0
    in edit.html and provide an option for create and modify the change password and save the change password record
    */
        $scope.ChangePassword = function () {
            if ($scope.Validationcontrolspassword() == true) {
                $("#chatLoaderPV").show();
                $scope.changepasswordId = $window.localStorage['UserId'];
                $scope.ModifiedUser_Id = $window.localStorage['UserId'];
                $scope.InstituteId = $window.localStorage['InstitutionId'];

                var obj = {
                    UserId: $scope.changepasswordId,
                    InstitutionId: $window.localStorage['InstitutionId'],
                    NewPassword: $scope.NewPassword,
                    ReenterPassword: $scope.confirmpassword,
                    Password: $scope.OldPassword,
                    LoginType: $scope.PageParameter
                };
                $http.post(baseUrl + '/api/Login/ChangePassword', obj)
                    /*/?Id=' + $scope.changepasswordId
                    + '&NewPassword=' + $scope.NewPassword
                    + '&OldPassword=' + $scope.OldPassword
                    + '&Confirmpassword=' + $scope.confirmpassword
                    + '&ModifiedUser_Id=' + $scope.ModifiedUser_Id
                    + '&InstitutionId=' + $scope.InstituteId
                    + '&PageTypeId=' + $scope.PageParameter*/
                    .success(function (data) {
                        alert(data.Message);
                        if (data.ReturnFlag == "1") {
                            $scope.ClearPassword();
                            angular.element('#ChangepasswordpopupModal').modal('hide');
                        }
                    }).error(function (data) {
                        $scope.error = "Problem in changing the password duplicate!" + data.ExceptionMessage;
                    });
                $("#chatLoaderPV").hide();
            }
        };

        /* User type details list*/
        $http.get(baseUrl + '/api/Login/Usertypedetailslist/').success(function (data) {
            //$scope.Usertypelist = data;
            $scope.Usertypelist = [];
            $("#chatLoaderPV").show();
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
            angular.forEach(data, function (row, value) {
                if (row.Id != 1 && row.Id != 3)
                    $scope.Usertypelist.push(row)
            });
            $("#chatLoaderPV").hide();
        });

        /* User basic details list*/
        $scope.Userdetailsdatalist = function () { 
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + $scope.UserTypeName + '&InstitutionId=' + $scope.InstituteId).success(function(data) {
                $scope.Userlist = data; 
                $("#chatLoaderPV").hide();
            });
        };

        $scope.ClearPassword = function () {
            $scope.NewPassword = "";
            $scope.OldPassword = "";
            $scope.confirmpassword = "";
            $scope.ModifiedUser_Id = "";
            $scope.User_Id = "";
            $scope.ReenterPassword = "";
            $scope.UserTypeName = "0";
            $scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
        };
        /*
       Call the api method for insert and Update the record for a reset password
       and display the record of selected reset password when Id is greater than 0
       in edit.html and provide an option for create and modify the reset password and save the reset password record
       */
        $scope.ResetPassword = function () {
            if ($scope.Validationresetcontrols() == true) {
                $("#chatLoaderPV").show();
                if ($scope.User_Selected != undefined) {
                    $scope.User_Id = $scope.User_Selected.originalObject.Id;
                    {
                        $scope.ResetpasswordId = $window.localStorage['UserId'];
                        $http.get(baseUrl + '/api/Login/ResetPassword/?Id=' + $scope.User_Id
                            + '&NewPassword=' + $scope.NewPassword
                            + '&ReenterPassword=' + $scope.ReenterPassword
                            + '&created_By=' + $window.localStorage['UserId']
                            + '&EmailId=""'
                            + '&InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                                alert(data.Message);
                                $scope.ClearPassword();
                                $("#chatLoaderPV").hide();
                            }).error(function (data) {
                                $scope.error = "An error has occurred while deleting reset password details" + data;
                            });
                    }
                }
            }
        };

        //validation for password policy insert update
        $scope.ValidationPasswordControls = function () {
            if (typeof ($scope.Minimum_Length) == "undefined" || $scope.Minimum_Length == "") {
                alert("Please enter Minimum Length");
                return false;
            }
            else if (typeof ($scope.Maximum_Length) == "undefined" || $scope.Maximum_Length == "") {
                alert("Please enter Maximum Length");
                return false;
            }
            else if (parseInt($scope.Maximum_Length) < parseInt($scope.Minimum_Length)) {
                alert("Please enter Maximum Length greater than Minimum Length");
                return false;
            }
            else if (typeof ($scope.Expiry_Period) == "undefined" || $scope.Expiry_Period == "" && $scope.AllowExpiryDays != 1) {
                alert("Please enter Password  Expiry Period");
                return false;
            }
            return true;
        };


        //Insert function for password policy

        //Insert function for password policy  //Insert function for password policy
        $scope.PasswordPolicyInsertUpdate = function () {
            if ($scope.ValidationPasswordControls() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    Minimum_Length: $scope.Minimum_Length,
                    Maximum_Length: $scope.Maximum_Length,
                    UpperCase_Required: $scope.UpperCase_Required == 0 ? null : $scope.UpperCase_Required,
                    LowerCase_Required: $scope.LowerCase_Required == 0 ? null : $scope.LowerCase_Required,
                    Numeric_Required: $scope.Numeric_Required == 0 ? null : $scope.Numeric_Required,
                    SpecialChar_Required: $scope.SpecialChar_Required == 0 ? null : $scope.SpecialChar_Required,
                    Without_Char: $scope.Without_Char == "" ? null : $scope.Without_Char,
                    AllowExpiryDays: $scope.AllowExpiryDays == 0 ? null : $scope.AllowExpiryDays,
                    Expiry_Period: $scope.Expiry_Period == 0 ? null : $scope.Expiry_Period,
                    Allow_UserName: $scope.Allow_UserName == 0 ? null : $scope.Allow_UserName,
                    Restrict_LastPassword: $scope.Restrict_LastPassword == "" ? null : $scope.Restrict_LastPassword,
                    MaxLoginTime: $scope.MaxLoginTime == "" ? null : $scope.MaxLoginTime,
                    MaxLoginHours: $scope.MaxLoginHours == "" ? null : $scope.MaxLoginHours,
                    MaxLoginMins: $scope.MaxLoginMins == "" ? null : $scope.MaxLoginMins,
                    Remember_Password: $scope.Remember_Password == 0 ? null : $scope.Remember_Password,
                    Institution_Id: $scope.InstituteId = $window.localStorage['InstitutionId'],
                    Created_By: $scope.Created_By = $window.localStorage['UserId']
                };
                $scope.loading = true;

                $http.post(baseUrl + '/api/Common/PasswordPolicy_InsertUpdate/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.PasswordPolicyView();
                    $scope.ClearFields();

                    if (data.ReturnFlag == "1") {
                        $location.path("/EditPasswordPolicy/");
                        $scope.loading = false;
                        $rootScope.$broadcast('hide');
                    }
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "An error has occurred while adding Password Policy Details!" + data.ExceptionMessage;
                });

            };
        }

        //view function for password policy
        $scope.PasswordPolicyView = function () {
            $("#chatLoaderPV").show();
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
           //  $scope.NewPassword = "";
            $http.get(baseUrl + '/api/Common/PasswordPolicy_View/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                if (data != null) {
                    $scope.policyExist = true;
                    $scope.Institution_Id = data.Institution_Id;
                    $scope.Insitution_Name = data.Insitution_Name;
                    $scope.Minimum_Length = data.Minimum_Length;
                    $scope.Maximum_Length = data.Maximum_Length;
                    $scope.UpperCase_Required = data.UpperCase_Required;
                    $scope.LowerCase_Required = data.LowerCase_Required;
                    $scope.Numeric_Required = data.Numeric_Required;
                    $scope.SpecialChar_Required = data.SpecialChar_Required;
                    $scope.Without_Char = data.Without_Char;
                    $scope.AllowExpiryDays = data.AllowExpiryDays;
                    $scope.Expiry_Period = data.Expiry_Period;
                    $scope.Allow_UserName = data.Allow_UserName;
                    $scope.Restrict_LastPassword = data.Restrict_LastPassword;
                    $scope.MaxLoginTime = data.MaxLoginTime;
                    $scope.MaxLoginHours = data.MaxLoginHours;
                    $scope.MaxLoginMins = data.MaxLoginMins;
                    $scope.Created_By = data.Created_By;
                    $scope.Remember_Password = data.Remember_Password;
                    $scope.Created_Dt = data.Created_Dt;
                }
                $("#chatLoaderPV").hide();
                //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
                //$scope.NewPassword = "";
            });
        };

        //view function for password policy
        $scope.PasswordPolicyDetails = function () {
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
            $http.get(baseUrl + '/api/Common/PasswordPolicyDetails_View/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.Institution_Id = data.Institution_Id;
                $scope.Insitution_Name = data.Insitution_Name;
                $scope.Minimum_Length = data.Minimum_Length;
                $scope.Maximum_Length = data.Maximum_Length;
                $scope.UpperCase_Required = data.UpperCase_Required;
                $scope.LowerCase_Required = data.LowerCase_Required;
                $scope.Numeric_Required = data.Numeric_Required;
                $scope.SpecialChar_Required = data.SpecialChar_Required;
                $scope.Without_Char = data.Without_Char;
                $scope.AllowExpiryDays = data.AllowExpiryDays;
                $scope.Expiry_Period = data.Expiry_Period;
                $scope.Allow_UserName = data.Allow_UserName;
                $scope.Restrict_LastPassword = data.Restrict_LastPassword;
                $scope.MaxLoginTime = data.MaxLoginTime;
                $scope.MaxLoginHours = data.MaxLoginHours;
                $scope.MaxLoginMins = data.MaxLoginMins;
                $scope.Created_By = data.Created_By;
                $scope.Remember_Password = data.Remember_Password;
                $scope.Created_Dt = data.Created_Dt;
            });
        };
        //clear function for expiry period
        $scope.ClearPasswordExpiryperiod = function () {
            $scope.Expiry_Period = "";

        }

        /*Clear the scope variables values*/
        $scope.ClearFields = function () {
            $scope.Minimum_Length = "";
            $scope.Maximum_Length = "";
            $scope.UpperCase_Required = "";
            $scope.LowerCase_Required = "";
            $scope.Numeric_Required = "";
            $scope.SpecialChar_Required = "";
            $scope.Without_Char = "";
            $scope.Expiry_Period = "";
            $scope.Allow_UserName = "";
            $scope.Restrict_LastPassword = "";
            $scope.MaxLoginTime = "";
            $scope.MaxLoginHours = "";
            $scope.MaxLoginMins = "";
            $scope.Institution_Id = "";
            $scope.Created_By = "";
            $scope.Created_Dt = "";
            $scope.Remember_Password = "";
            $scope.AllowExpiryDays = "";
        };

        /**Change Password Popup function**/
        angular.element('#ChangepasswordpopupModal').modal('show');
        $('#ChangepasswordpopupModal').on('hide.bs.modal', function () {
            //window.location.href = baseUrl + "/Home/Index#/home";
            var res = $rootScope.previousPage.split("/");
            if (res[res.length - 2].toLowerCase() == "changepassword") {
                window.location.href = baseUrl + "/Home/Index#/home";
            }
            else {
                window.location.href = $rootScope.previousPage;
            }

            //$PreviousState.goToLastState();
        })

        /**Cancel Change Password Popup function**/
        $scope.CancelChangePasswordPopup = function () {
            angular.element('#ChangepasswordpopupModal').modal('hide');
        };



    }
]);

MyCortexControllers.controller("PatientApprovalController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {

        $scope.Id = "0";
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.Approvalflag = 0;
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.loadCount = 0;
        $scope.rowCollectionFilter = [];
        $scope.TabClick = false;

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
            $scope.PatientApprovalList();
        }

        $scope.PatientApprovalDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $scope.CountryStateList();
            }
        };

        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;
            });
        }
        /*   $scope.Filter_Country_onChange = function () {
               $scope.StateNameList = $ff($scope.State_Template, { CountryId: $scope.filter_CountryId });
               setTimeout(function () {
                   jQuery("#stateselectpicker").selectpicker('refresh')
               }, 500);
           };
           $scope.Filter_State_onChange = function () {
               $scope.CityNameList = $ff($scope.City_Template, { StateId: $scope.filter_StataId });
           };*/

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

        //* THIS IS FOR LIST FUNCTION */

        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.Approvalflag = 0;
        $scope.rowCollectionFilter = [];
        /*List Page Pagination*/

        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.PatientApprovalList = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/PatientApproval/PatientApproval_List/?InstitutionId=' + $scope.InstitutionId + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId
            ).success(function (data) {

                $scope.emptydata = [];
                $scope.rowCollection = [];
                $scope.rowCollection = data;
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.Approvalflag = 1;
                }
                else {
                    $scope.Approvalflag = 0;
                }
                $("#chatLoaderPV").hide();
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        };

        $scope.Active_PatientApproval = function (PId) {
            $scope.Id = PId;
            $location.path("/PatientView/" + $scope.Id + "/0/3");
        };


        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterPatientList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.MRN_NO).match(searchstring) ||
                        angular.lowercase(value.Mobile_No).match(searchstring) ||
                        angular.lowercase(value.EmailId).match(searchstring) ||
                        angular.lowercase(value.PendingSince).match(searchstring);
                });
            }
            if ($scope.rowCollectionFilter.length > 0) {
                $scope.Approvalflag = 1;
            }
            else {
                $scope.Approvalflag = 0;
            }
        }
        $scope.checkAll = function () {
            if ($scope.SelectedAllPatient == true) {
                $scope.SelectedAllPatient = true;
            } else {
                $scope.SelectedAllPatient = false;
            }
            angular.forEach($scope.rowCollectionFilter, function (row) {
                if (row.Approval_Flag == 0)
                    row.SelectedPatient = $scope.SelectedAllPatient;
            });
        };
        $scope.ApprovePatient = function () {
            //var cnt = ($filter('filter')($scope.rowCollectionFilter, 'true')).length;
            var cnt = $ff(($filter('filter')($scope.rowCollectionFilter, 'true')), { Approval_Flag: 0 }).length;
            if (cnt == 0) {
                alert("Please select atleast one Patient to Approve");
            }
            else {
                $http.get(baseUrl + '/api/PatientApproval/Get_PatientCount/?InstitutionId=' + $scope.InstitutionId).success(function (data) {
                    $scope.PatientCount = data[0].PatientCount;
                    if ($scope.PatientCount >= cnt) {
                        var msg = confirm("Do you like to Approve the Selected Patient?");
                        if (msg == true) {
                            $scope.ApprovedPatientList = [];
                            angular.forEach($scope.rowCollectionFilter, function (SelectedPatient, index) {
                                if (SelectedPatient.SelectedPatient == true) {
                                    if (SelectedPatient.Approval_Flag == 0) {
                                        var ApprovePatientobj = {
                                            Patient_Id: SelectedPatient.Id
                                        };
                                        $scope.ApprovedPatientList.push(ApprovePatientobj);
                                    }
                                }
                            });
                            $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).success(function (data) {
                                alert(data.Message);
                                if (data.ReturnFlag == 1) {
                                    $scope.PatientApprovalList();
                                    $scope.SelectedAllPatient = false;
                                }
                            });
                        }
                    }
                    else {
                        alert("Maximum Number of Patient License reached already, cannot be approved");
                        return false;
                    }
                });
            }
        }
    }

]);


/* THIS IS FOR EMPLOYEE EMAIL CONFIGURATION CONTROLLER FUNCTION */
MyCortexControllers.controller("EmailConfigurationController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {


        // Declaration and initialization of Scope Variables.
        $scope.Id = 0;
        $scope.InstitutionName = "0";
        $scope.SSL_Enable = "0";
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        /*clear the company details */
        $scope.clearInstitution = function () {
            if ($scope.InstitutionName != null) {
                $scope.ClearFields();
            }
        };

        /* Email configuration Validation function   */
        $scope.EmailConfigurationValidation = function () {
            if (typeof ($scope.Sender_Email_Id) == "undefined" || $scope.Sender_Email_Id == "") {
                alert("Please enter Sender Email ID");
                return false;
            }
            else if (typeof ($scope.UserName) == "undefined" || $scope.UserName == "") {
                alert("Please enter User Name");
                return false;
            }
            else if (typeof ($scope.Password) == "undefined" || $scope.Password == "") {
                alert("Please enter Password");
                return false;
            }
            else if (typeof ($scope.ServerName) == "undefined" || $scope.ServerName == "") {
                alert("Please enter Server Name(SMTP)");
                return false;
            }
            else if (typeof ($scope.PortNo) == "undefined" || $scope.PortNo == "") {
                alert("Please enter Port No");
                return false;
            }
            else if (typeof ($scope.DisplayName) == "undefined" || $scope.DisplayName == "") {
                alert("Please enter Display Name");
                return false;
            }
            else if (typeof ($scope.SSL_Enable) == "undefined" || $scope.SSL_Enable == 0) {
                alert("Please select SSL Enable");
                return false;
            }
            if (EmailFormate($scope.Sender_Email_Id) == false) {
                alert("Invalid email format");
                return false;
            }
            return true;
        };

        /* Institution Dropdown function  */
        $scope.InstitutionList = [];
        $scope.InstitutionFilterList = [];
        $http.get(baseUrl + '/api/Institution/InstitutionDetails_View/?Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.Insitution_Name = data.Institution_Name;
            // $scope.InstitutionFilterList =  angular.copy($scope.InstitutionList); 
        });

        $scope.Id = 0;
        $scope.Sender_Email_Id = "";
        $scope.UserName = "";
        $scope.Password = "";
        $scope.ServerName = "";
        $scope.PortNo = "";
        $scope.DisplayName = "";
        $scope.SSL_Enable = "0";
        $scope.Id = "0";
        $scope.Remarks = "";
        /* Email configurations Save and Update Function*/
        $scope.EmailConfiguration_AddEdit = function () {
            if ($scope.EmailConfigurationValidation() == true) {
                $("#chatLoaderPV").show();
                var val_sslen = 2;
                if ($scope.SSL_Enable == "1") {
                    val_sslen = 1;

                }
                else {
                    val_sslen = 2;
                }
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $window.localStorage['InstitutionId'],
                    Sender_Email_Id: $scope.Sender_Email_Id,
                    UserName: $scope.UserName,
                    Password: $scope.Password,
                    ServerName: $scope.ServerName,
                    PortNo: $scope.PortNo,
                    DisplayName: $scope.DisplayName,
                    EConfigSSL_Enable: val_sslen,
                    Remarks: $scope.Remarks,
                    Created_By: $window.localStorage['UserId']
                };
                $http.post(baseUrl + '/api/EmailConfiguration/EmailConfiguration_AddEdit/', obj).success(function (data) {
                    alert("Email setup saved successfully");
                    $scope.EmailConfiguration_ViewEdit();
                    //$scope.ClearFields();
                    //   $scope.clearInstitution();
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "An error has occurred while adding Email Configuration!" + data.ExceptionMessage;
                });
            }
        };
        /* Email configurations View and Edit Function*/
        $scope.EmailConfiguration_ViewEdit = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + 'api/EmailConfiguration/EmailConfiguration_View/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
                if (data != null) {
                    $scope.Id = data.Id;
                    $scope.Insitution_Name = data.Institution_Name;
                    $scope.Sender_Email_Id = data.Sender_Email_Id;
                    $scope.UserName = data.UserName;
                    $scope.Password = data.Password;
                    $scope.ServerName = data.ServerName;
                    $scope.PortNo = data.PortNo;
                    $scope.DisplayName = data.DisplayName;
                    $scope.SSL_Enable = data.EConfigSSL_Enable.toString();
                    //   $scope.SSL_Enable = data.SSL_Enable.toString();
                    $scope.Remarks = data.Remarks;
                }
                $("#chatLoaderPV").hide();
            });
        };


        /* Clear the scope variables */
        $scope.ClearFields = function () {
            $scope.Id = 0;
            $scope.Sender_Email_Id = "";
            $scope.UserName = "";
            $scope.Password = "";
            $scope.ServerName = "";
            $scope.PortNo = "";
            $scope.DisplayName = "";
            $scope.SSL_Enable = "0";
            $scope.Id = "0";
            $scope.Remarks = "";
        }


    }
]);

MyCortexControllers.controller("EmailTemplateController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
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
        $http.get(baseUrl + '/api/EmailTemplate/TemplateTag_List/?Id=' + $scope.InstituteId).success(function (data) {
            $scope.TemplateTagList = data;
        });

        $scope.TemplateTagMappingList = [];
        $scope.TempMappinglist = function () {
            if ($scope.PageParameter == 1) {
                $scope.Type = "1"; //For Email
            }
            else if ($scope.PageParameter == 2) {
                $scope.Type = "2";//For Notification
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
            if (typeof ($scope.TemplateName) == "undefined" || $scope.TemplateName == "") {
                alert("Please enter Template Name");
                return false;
            }

            else if (typeof ($scope.EmailSubject) == "undefined" || $scope.EmailSubject == "") {
                if ($scope.PageParameter == 1)
                    alert("Please enter Email Subject");
                else
                    alert("Please enter Notification Title");

                return false;
            }
            else if (typeof ($scope.Template) == "undefined" || $scope.Template == "") {
                if ($scope.PageParameter == 1)
                    alert("Please enter Email Template");
                else
                    alert("Please enter Notification Message");

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
            $("#chatLoaderPV").show();
            if ($scope.Validationcontrols() == true) {

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
                            Email_TemplateId: $scope.PageParameter == 1 ? '1' : $scope.PageParameter == 2 ? '2' : '',
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
                    TemplateType_Id: $scope.PageParameter == 1 ? '1' : $scope.PageParameter == 2 ? '2' : '',
                    //Type_Id: $scope.Type,
                    EmailSubject: $scope.EmailSubject,
                    EmailTemplate: $scope.Template,
                    ModifiedUser_Id: $scope.Patient_Id,
                    Created_By: $scope.Patient_Id,
                    EmailTemplateTagList: $scope.EmailTemplateTagDetails,
                    TemplateName: $scope.TemplateName
                }

                $http.post(baseUrl + '/api/EmailTemplate/EmailTemplateTag_AddEdit/', obj).success(function (data) {
                    alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.EmailTemplatelist();
                    }
                    //$scope.AddId = data;
                    $("#chatLoaderPV").hide();
                    angular.element('#EmailTemplateModal').modal('hide');
                })
            }
        }

        /* THIS IS FOR LIST PROCEDURE */
        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];

        $scope.EmailTemplatelist = function () {
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
                if ($scope.TemplateType_Id == 1) {
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

            var del = confirm("Do you like to deactivate the selected Template?");
            if (del == true) {
                $http.get(baseUrl + '/api/EmailTemplate/EmailTemplate_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert("Template has been deactivated Successfully");
                    $scope.EmailTemplatelist();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting  ICD 10 details" + data;
                });
            }
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

            var Ins = confirm("Do you like to activate the selected Template?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/EmailTemplate/EmailTemplate_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Template has been activated successfully");
                    $scope.EmailTemplatelist();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting ICD 1O records" + data;
                });
            }
        };

        $scope.Active_ErrorFunction = function () {
            alert("Inactive Template cannot be edited");
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }

        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddEmailTemplatePopUP = function () {
            angular.element('#EmailTemplateModal').modal('show');
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
            if ($scope.PageParameter == 1) {
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

MyCortexControllers.controller("EmailHistoryController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.PageParameter = $routeParams.PageParameter;

        $scope.currentTab = "1";
        $scope.Id = "0";
        $scope.IsActive = true;
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
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.TabClick = false;
        $scope.Patient_Id = $window.localStorage['UserId'];
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

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

        $scope.MessageingHistoryDropdownList = function () {
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
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstituteId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $scope.InstitutionBased_CountryStateList();
            }
        }

        $scope.TemplateTagList = [];
        $http.get(baseUrl + '/api/EmailTemplate/TemplateTag_List/?Id=' + $scope.InstituteId).success(function (data) {
            $scope.TemplateTagList = data;
        });
        $scope.ConfigCode = "EMAILHISTORY_DATE_LIMIT";
        $scope.ValidateDays = 14;
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.InstituteId)
            .success(function (data) {
                if (data[0] != undefined) {
                    $scope.ValidateDays = parseInt(data[0].ConfigValue);
                }
                else {
                    $scope.ValidateDays = 14;
                }
            });

        $scope.FilterValidation = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.Period_From = moment($scope.Period_From).format('DD-MMM-YYYY');
            $scope.Period_To = moment($scope.Period_To).format('DD-MMM-YYYY');

            if (typeof ($scope.Period_From) == "undefined" || $scope.Period_From == "") {
                alert("Please select Period From");
                return false;
            }
            //else if (isDate($scope.Period_From) == false) {
            //    alert("Period From is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            if (typeof ($scope.Period_To) == "undefined" || $scope.Period_To == "") {
                alert("Please select Period To");
                return false;
            }
            //else if (isDate($scope.Period_To) == false) {
            //    alert("Period To is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}

            var date1 = new Date($scope.Period_From);
            var date2 = new Date($scope.Period_To);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= $scope.ValidateDays) {
                alert($scope.ValidateDays + '  ' + "days only allowed to filter");
                return false;
            }

            /*var date1 = new Date($scope.Period_From);
            var date2 = new Date($scope.Period_To);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 14) {
                alert("14 days only allowed to filter");
                return false;
            }*/
            var retval = true;
            if ($scope.Period_From > today) {
                alert("FromDate Can Be Booked Only For Past");
                $scope.Period_From = DateFormatEdit($scope.Period_From);
                $scope.Period_To = DateFormatEdit($scope.Period_To);
                retval = false;
                return false;
            }

            if ($scope.Period_To > today) {
                alert("To Date Can Be Booked Only For Past");
                $scope.Period_From = DateFormatEdit($scope.Period_From);
                $scope.Period_To = DateFormatEdit($scope.Period_To);
                retval = false;
                return false;
            }

            if (($scope.Period_From != "") && ($scope.Period_To != "")) {

                if ((ParseDate($scope.Period_From) > ParseDate($scope.Period_To))) {
                    alert("From Date should not be greater than To Date");
                    $scope.Period_From = DateFormatEdit($scope.Period_From);
                    $scope.Period_To = DateFormatEdit($scope.Period_To);
                    retval = false;
                    return false;
                }
            }

            $scope.Period_From = DateFormatEdit($scope.Period_From);
            $scope.Period_To = DateFormatEdit($scope.Period_To);
            return retval;
        };

        $scope.DefaultCountryState = function () {
            $scope.CountryId = $scope.InsCountryId;
            $scope.StateId = $scope.InsStateId;
            $scope.Country_onChange();
            $scope.CityId = $scope.InsCityId;
            $scope.State_onChange();
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

        $scope.TemplateTagMappingList = [];
        $scope.TempMappinglist = function () {
            $scope.Type = "1"; //For Email
            $http.get(baseUrl + '/api/EmailTemplate/EmailTemplateTagMapping_List/?Id=' + $scope.Type + '&Institution_Id=' + $scope.InstituteId).success(function (data) {
                $scope.TemplateTagMappingList = data;
            });
        };

        $scope.Emailemptydata = [];
        $scope.EmailrowCollectionFilter = [];
        $scope.Emaildatalist = [];
        $scope.EmailHistoryDetailslist = function () {
            if ($scope.FilterValidation() == true) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/SendEmail/EmailHistory_List/?Id=' + $scope.Id + '&Period_From=' + $scope.Period_From + '&Period_To=' + $scope.Period_To + '&Email_Stauts=' + $scope.Email_Stauts
                    + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId']
                    + '&TemplateType_Id=' + $scope.PageParameter + '&Login_Session_Id=' + $scope.LoginSessionId
                ).success(function (data) {
                    //$scope.Emailemptydata = [];
                    $scope.EmailrowCollectionFilter = [];
                    $scope.Emaildatalist = data;
                    //$scope.EmailrowCollectionFilter = data;
                    $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
                    $("#chatLoaderPV").hide();
                });
            }
        };

        $scope.Email_Stauts = "0"
        $scope.searchquerylist = "";
        //$scope.EmailrowCollectionFilter =[];
        /* FILTER THE LIST FUNCTION.*/
        $scope.filterEmailHistoryList = function () {
            // $scope.EmailStatusList();
            $scope.EmailrowCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquerylist);
            /* if ($scope.searchquerylist == "") {
                 if ($scope.EmailrowCollectionFilter.length > 0) {
                     $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
                 }
             }*/
            if ($scope.searchquerylist == "") {
                //  $scope.EmailrowCollectionFilter = [];
                $scope.EmailrowCollectionFilter = angular.copy($scope.Emaildatalist);
            }
            else {
                $scope.EmailrowCollectionFilter = $ff($scope.Emaildatalist, function (value) {
                    if (value.Email_Status == 0) {
                        val = "";
                    }
                    else {
                        val = value.Email_Status;
                    }
                    return angular.lowercase(value.EmailId).match(searchstring) ||
                        angular.lowercase(value.TypeName).match(searchstring) ||
                        angular.lowercase(value.FullName).match(searchstring) ||
                        angular.lowercase(value.TemplateName).match(searchstring) ||
                        angular.lowercase(value.EmailSubject).match(searchstring) ||
                        angular.lowercase(value.EmailTemplate).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.Send_Date, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(val).match(searchstring) ||
                        angular.lowercase(value.Email_Error_Reason).match(searchstring) ||
                        angular.lowercase(value.EmailStatusType).match(searchstring);
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
        $scope.EmailBody_ViewModel = function (EmailId, EmailSubject, EmailBody) {
            angular.element('#EmailBody_ViewModel').modal('show');
            $scope.EmailId = EmailId;
            $scope.EmailSubject = EmailSubject;
            $scope.Generated_Template = EmailBody;
        }
        $scope.EmailBody_CancelModel = function () {
            angular.element('#EmailBody_ViewModel').modal('hide');
        }

    }
]);

MyCortexControllers.controller("SendEmailController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.UserId = $window.localStorage['UserId'];
        $scope.InstitutionId = $window.localStorage['InstitutionId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id']
        $scope.UserTypeId = "0";
        $scope.Template_Id = "0";
        $scope.Usertypelistdata = [];
        $scope.SentEmailTemplateList = [];
        $scope.SendEmailUserList = [];
        $scope.Generated_TemplateList = [];
        $scope.Filter_SendEmailUserList = [];
        $scope.flag = "0";
        //More Filter Initialization
        $scope.Filter_PatientNo = "";
        $scope.filter_InsuranceId = "";
        $scope.filter_MOBILE_NO = "";
        $scope.filter_HomePhoneNo = "";
        $scope.filter_Email = "";
        $scope.Filter_GenderId = "0";
        $scope.filter_NationalityId = "0";
        $scope.filter_EthinicGroupId = "0";
        $scope.filter_MaritalStatus = "0";
        $scope.filter_CountryId = "0";
        $scope.filter_StataId = "0";
        $scope.filter_CityId = "0";
        $scope.filter_BloodGroupId = "0";
        $scope.filter_GroupId = "0";
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.MaritalStatusList = [];
        $scope.GroupTypeList = [];
        $scope.GenderList = [];
        $scope.NationalityList = [];
        $scope.loadCount = 0;
        $scope.TabClick = false;

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
            $scope.Get_SendEmail_UserList();
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

        $scope.SendEmailDropdownList = function () {
            if ($scope.TabClick == false) {
                $scope.TabClick = true;
                $http.get(baseUrl + '/api/Common/BloodGroupList/').success(function (data) {
                    $scope.BloodGroupList = data;
                });
                $http.get(baseUrl + '/api/Common/MaritalStatusList/').success(function (data) {
                    $scope.MaritalStatusList = data;
                });
                $http.get(baseUrl + '/api/Common/GroupTypeList/?Institution_Id=' + $scope.InstitutionId).success(function (data) {
                    $scope.GroupTypeList = data;
                });
                $http.get(baseUrl + '/api/Common/GenderList/').success(function (data) {
                    $scope.GenderList = data;
                });
                $http.get(baseUrl + '/api/Common/NationalityList/').success(function (data) {
                    $scope.NationalityList = data;
                });
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').success(function (data) {
                    $scope.EthnicGroupList = data;
                });
                $scope.CountryStateList();
            }
        }

        $scope.State_Template = [];
        $scope.City_Template = [];
        $scope.CountryNameList = [];
        $scope.StateNameList = [];
        $scope.CityNameList = [];

        $scope.CountryStateList = function () {
            $http.get(baseUrl + '/api/Common/CountryList/').success(function (data) {
                $scope.CountryNameList = data;
            });
        }
        //List Page Pagination.
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.GenerateTemplate = function (GetId, EmailId) {
            if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                alert("Please select Template");
                return false;
            }
            else {
                angular.element('#Template_PreviewModel').modal('show');
                $scope.PrimaryKeyId = GetId;
                $http.post(baseUrl + '/api/SendEmail/GenerateTemplate/?Id=' + $scope.PrimaryKeyId + '&Template_Id=' + $scope.Template_Id + '&Institution_Id=' + $scope.InstitutionId + '&TemplateType_Id=' + $scope.PageParameter).success(function (data) {
                    $scope.Generated_TemplateList = data;
                    $scope.EmailSubject = $scope.Generated_TemplateList.Email_Subject;
                    $scope.Generated_Template = $scope.Generated_TemplateList.Email_Body;
                    $scope.EmailId = EmailId;
                });
            }
        }
        /* Get the List of User Type */
        $http.get(baseUrl + '/api/SendEmail/Email_UserTypeList/').success(function (data) {
            $scope.Usertypelistdata = data;
        });

        /*Get the List of Template */
        $http.get(baseUrl + '/api/SendEmail/Email_TemplateTypeList/?InstitutionId=' + $scope.InstitutionId + '&TemplateType_Id=' + $scope.PageParameter).success(function (data) {
            $scope.SentEmailTemplateList = data;
        });
        /* Get the list of User for Send Email */
        $scope.Get_SendEmail_UserList = function () {

            if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                alert("Please select User Type");
                return false;
            }
            else if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                alert("Please select Template");
                return false;
            }
            else {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/SendEmail/Get_SendEmail_UserList/?UserTypeId=' + $scope.UserTypeId + '&Institution_Id=' + $scope.InstitutionId + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId).success(function (data) {
                    $scope.emptydata = [];
                    $scope.SendEmailUserList = data;
                    $scope.Filter_SendEmailUserList = angular.copy($scope.SendEmailUserList);
                    if ($scope.Filter_SendEmailUserList.length > 0) {
                        $scope.flag = 1;
                    }
                    else {
                        $scope.flag = 0;
                    }
                    $("#chatLoaderPV").hide();
                });
            }
        }
        $scope.searchquery = "";
        /* FILTER THE LIST FUNCTION.*/
        $scope.ListFilter = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.Filter_SendEmailUserList = angular.copy($scope.SendEmailUserList);
            }
            else {
                $scope.Filter_SendEmailUserList = $ff($scope.SendEmailUserList, function (value) {
                    return angular.lowercase(value.UserName).match(searchstring) ||
                        angular.lowercase(value.UserType).match(searchstring) ||
                        angular.lowercase(value.EmailId).match(searchstring);
                });
                if ($scope.Filter_SendEmailUserList.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        $scope.checkAll = function () {
            if ($scope.SelectedAllUser == true) {
                $scope.SelectedAllUser = true;
            } else {
                $scope.SelectedAllUser = false;
            }
            angular.forEach($scope.Filter_SendEmailUserList, function (row) {
                row.SelectedUser = $scope.SelectedAllUser;
            });
        };

        $scope.SendEmail_Insert = function () {

            var cnt = ($filter('filter')($scope.Filter_SendEmailUserList, 'true')).length;
            if (cnt == 0) {
                alert("Please select atleast one User");
            }
            else if (typeof ($scope.Template_Id) == "undefined" || $scope.Template_Id == "0") {
                alert("Please select Template");
                return false;
            }
            else {
                $("#chatLoaderPV").show();
                var msgtype = "email";
                if ($scope.PageParameter == "2")
                    msgtype = "notification"
                var msg = confirm("Do you like to send " + msgtype + " for selected users?");
                if (msg == true) {
                    $scope.SelectedUserList = [];
                    angular.forEach($scope.Filter_SendEmailUserList, function (SelectedUser, index) {
                        if (SelectedUser.SelectedUser == true) {

                            var obj = {
                                UserId: SelectedUser.Id,
                                Template_Id: $scope.Template_Id,
                                Created_By: $scope.UserId,
                                Institution_Id: $scope.InstitutionId,
                                TemplateType_Id: $scope.PageParameter
                            };
                            $scope.SelectedUserList.push(obj);
                        }
                    });
                    $http.post(baseUrl + '/api/SendEmail/SendEmail_AddEdit/', $scope.SelectedUserList).success(function (data) {
                        alert(data.Message);
                        if (data.ReturnFlag == 1) {
                            $scope.ClearValues();
                            $scope.Get_SendEmail_UserList();
                        }
                        $("#chatLoaderPV").hide();
                    });

                }
            }
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
    }
]);

MyCortexControllers.controller("EmailUndeliveredController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.PageParameter = $routeParams.PageParameter;
        $scope.currentTab = "1";
        $scope.Id = "0";
        $scope.IsActive = true;
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
                alert("s");
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
                alert("Please select Period From");
                return false;
            }
            //else if (isDate($scope.Period_From) == false) {
            //    alert("Period From is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            if (typeof ($scope.Period_To) == "undefined" || $scope.Period_To == "") {
                alert("Please select Period To");
                return false;
            }
            //else if (isDate($scope.Period_To) == false) {
            //    alert("Period To is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            var date1 = new Date($scope.Period_From);
            var date2 = new Date($scope.Period_To);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 14) {
                alert("14 days only allowed to filter");
                return false;
            }
            if ($scope.Period_From > today) {
                alert("FromDate Can Be Booked Only For Past");
                $scope.Period_From = DateFormatEdit($scope.Period_From);
                $scope.Period_To = DateFormatEdit($scope.Period_From);
                return false;
            }
            if ($scope.Period_To > today) {
                alert("To Date Can Be Booked Only For Past");
                $scope.Period_From = DateFormatEdit($scope.Period_From);
                $scope.Period_To = DateFormatEdit($scope.Period_From);
                return false;
            }
            if (($scope.Period_From != "") && ($scope.Period_To != "")) {
                if ((ParseDate($scope.Period_From) > ParseDate($scope.Period_To))) {
                    alert("From Date should not be greater than To Date");
                    $scope.Period_From = DateFormatEdit($scope.Period_From);
                    $scope.Period_To = DateFormatEdit($scope.Period_To);
                    return false;
                } 
            }
            $scope.Period_From = DateFormatEdit($scope.Period_From);
            $scope.Period_To = DateFormatEdit($scope.Period_To);
            return true;
        };


        $scope.Emailemptydata = [];
        $scope.EmailrowCollectionFilter = [];
        $scope.Emaildatalist = [];
        $scope.UndeliveredEmailDetailslist = function () {
            if ($scope.FilterValidation() == true) {
                $("#chatLoaderPV").show();
                $scope.Email_Stauts = "2";
                $http.get(baseUrl + '/api/SendEmail/EmailHistory_List/?Id=' + $scope.Id + '&Period_From=' + $scope.Period_From + '&Period_To=' + $scope.Period_To + '&Email_Stauts=' + $scope.Email_Stauts
                    + '&PATIENTNO=' + $scope.Filter_PatientNo + '&INSURANCEID=' + $scope.filter_InsuranceId + '&GENDER_ID=' + $scope.Filter_GenderId + '&NATIONALITY_ID=' + $scope.filter_NationalityId + '&ETHINICGROUP_ID=' + $scope.filter_EthinicGroupId + '&MOBILE_NO=' + $scope.filter_MOBILE_NO + '&HOME_PHONENO=' + $scope.filter_HomePhoneNo + '&EMAILID=' + $scope.filter_Email + '&MARITALSTATUS_ID=' + $scope.filter_MaritalStatus + '&COUNTRY_ID=' + $scope.filter_CountryId + '&STATE_ID=' + $scope.filter_StataId + '&CITY_ID=' + $scope.filter_CityId + '&BLOODGROUP_ID=' + $scope.filter_BloodGroupId + '&Group_Id=' + $scope.filter_GroupId + '&IsActive=' + $scope.ActiveStatus + '&INSTITUTION_ID=' + $window.localStorage['InstitutionId']
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
                alert("Please select atleast one User");
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
                            $scope.SelectedUserList.push(obj);
                        }
                    });
                    $http.post(baseUrl + '/api/SendEmail/UndeliveredEmail_Insert/', $scope.SelectedUserList).success(function (data) {
                        alert(data.Message);
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
                alert(data.Message);
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

MyCortexControllers.controller("CommonController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.DecryptInput = "";
        $scope.Input_Type = 1;
        $scope.EncryptDecryptvalue = function () {
            var obj = {
                InputType: $scope.Input_Type,
                DecryptInput: $scope.DecryptInput
            };
            $http.post(baseUrl + '/api/Common/EncryptDecrypt', obj).success(function (data) {
                $scope.DecryptResult = data;
            })
                .error(function () {
                    $scope.DecryptResult = "Invalid format";
                });
        };
    }
]);
MyCortexControllers.controller("NotificationViewController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.User_Id = $window.localStorage['UserId'];
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        $scope.changeBackColor = [];
        $scope.NotificationUpdate = function (index1, SendEmailId, MessageSubject, MessageContent, ReadFlag) {
            $scope.changeBackColor = [];
            angular.element('#NotificationViewModel').modal('show');
            $scope.SendEmail_Id = SendEmailId;
            $scope.MessageSubject = MessageSubject;
            $scope.MessageContent = MessageContent;
            if (ReadFlag == 1) {
                $http.post(baseUrl + '/api/SendEmail/Notification_Update/?SendEmail_Id=' + $scope.SendEmail_Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    angular.forEach($scope.UserNotificationList_Filter, function (row, index) {
                        if (index == index1)
                            row.ReadFlag = "2";
                    });
                });
            }
        }
        $scope.UserNotificationList = [];
        $scope.flag = 0;
        $scope.UserNotificationList_Filter = [];
        $scope.searchquery = "";
        $scope.NotificationList = function () {
            $http.get(baseUrl + '/api/SendEmail/User_get_NotificationList/?User_Id=' + $scope.User_Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.emptydata = [];
                $scope.UserNotificationList = data.usernotification;
                $scope.UserNotificationList_Filter = angular.copy($scope.UserNotificationList);
                if ($scope.UserNotificationList_Filter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            });
        }
        $scope.ListFilter = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.UserNotificationList_Filter = angular.copy($scope.UserNotificationList);
            }
            else {
                $scope.UserNotificationList_Filter = $ff($scope.UserNotificationList, function (value) {
                    return angular.lowercase(value.MessageSubject).match(searchstring) ||
                        angular.lowercase(value.MessageBody).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.SentDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);
                });
                if ($scope.UserNotificationList_Filter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }
        $scope.closeNotification = function () {
            window.location.href = baseUrl + "/Home/Index#/home";
        }
        $scope.CancelModel = function () {
            angular.element('#NotificationViewModel').modal('hide');
        }
    }
]);
/* Email Alert Configuration Controller*/
MyCortexControllers.controller("EmailAlertlistController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {

        $scope.currentTab = "1";
        $scope.Id = "0";

        $scope.flag = 0;
        $scope.IsActive = true;

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
        /* THIS IS FOR VALIDATION CONTROL */
        $scope.Validationcontrols = function () {
            if (typeof ($scope.Event) == "undefined" || $scope.Event == "0") {
                alert("Please select Event");
                return false;
            }
            else if (($scope.EmailTemplate == 0) && $scope.EmailFlag == true) {
                alert("Please select Email Template");
                return false;
            }
            else if (($scope.AppTemplate == 0) && $scope.AppFlag == true) {
                alert("Please select App Template");
                return false;
            }
            else if (($scope.WebTemplate == 0) && $scope.WebFlag == true) {
                alert("Please select Web Template");
                return false;
            }

            if (($scope.EmailFlag == false) && ($scope.AppFlag == false) && ($scope.WebFlag == false)) {
                alert("Please select Email or App or Web for alert");
                return false;
            }
            if ($scope.AlertDays != null) {
                if ($scope.AlertDays.split(".")) {
                    if (($scope.AlertDays + "").split(".")[1] == "") {
                        alert("Please enter valid values");
                        return false;
                    }
                }
            }
            return true;
        };

        /* Email Alert List Function*/
        $scope.AlertEvent = [];
        $scope.AlertEventType = [];
        $scope.EmailTempalteTypeList = [];
        $scope.AppTempalteTypeList = [];
        $scope.TempalteTypeList = [];

        $scope.Eventselected = function () {
            $http.get(baseUrl + '/api/EmailAlertConfig/AlertEvent_List/?Institution_Id=' + $scope.InstituteId + '&Id=0').success(function (data) {
                $scope.AlertListTemp = [];
                $scope.AlertListTemp = data;
                var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                $scope.AlertListTemp.splice(0, 0, obj);
                $scope.AlertEvent = angular.copy($scope.AlertListTemp);

            });
        };
        $scope.Eventselected();
        $scope.EventDurationUOM = "";
        $scope.DurationDisplayCheck = function () {
            $scope.Eventtype = "1";
            angular.forEach($scope.AlertEvent, function (Selected, index) {
                if ($scope.Event == Selected.Id) {
                    $scope.Eventtype = Selected.EventType_Id;

                    if (Selected.EventCode == "DOCTOR_APPOINTMENT_REMINDER" || Selected.EventCode == "PAT_APPOINTMENT_REMINDER") {
                        $scope.EventDurationUOM = "mins"
                    }
                    else if (Selected.EventCode == "PASSWORD_EXPIRY") {
                        $scope.EventDurationUOM = "days"
                    }
                    else if (Selected.EventCode == "NEAR_PAT_LIMIT" || Selected.EventCode == "NEAR_USR_LIMIT"
                        || Selected.EventCode == "TARGET_DAILY" || Selected.EventCode == "TARGET_WEEKLY") {
                        $scope.EventDurationUOM = "%"
                    }
                }
            })
        }

        /* Email Flag List Function*/
        $scope.Emailselectlist = function () {
            $scope.EmailTempId = 1;
            $http.get(baseUrl + '/api/EmailAlertConfig/Template_List/?Institution_Id=' + $scope.InstituteId + '&TemplateType_Id=' + $scope.EmailTempId).success(function (data) {
                $scope.EmailTempalteTypeListTemp = [];
                $scope.EmailTempalteTypeListTemp = data;
                var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                $scope.EmailTempalteTypeListTemp.splice(0, 0, obj);
                $scope.EmailTempalteTypeList = angular.copy($scope.EmailTempalteTypeListTemp);
            });
        }
        $scope.Emailselectlist();

        /* Email Notification List Function*/
        $scope.Appselect = function () {
            $scope.AppTempId = 2;
            $http.get(baseUrl + '/api/EmailAlertConfig/Template_List/?Institution_Id=' + $scope.InstituteId + '&TemplateType_Id=' + $scope.AppTempId).success(function (data) {

                $scope.AppTempalteTypeListTemp = [];
                $scope.AppTempalteTypeListTemp = data;
                var obj = { "Id": 0, "Name": "Select", "IsActive": 1 };
                $scope.AppTempalteTypeListTemp.splice(0, 0, obj);
                $scope.AppTempalteTypeList = angular.copy($scope.AppTempalteTypeListTemp);

                $scope.TempalteTypeList = angular.copy($scope.AppTempalteTypeListTemp);
            });

        }
        $scope.Appselect();

        $scope.EventBasedToList = function () {
            $http.get(baseUrl + '/api/EmailAlertConfig/EventTo_List/?EventId=' + $scope.Event).success(function (data) {
                $scope.EventCC = data[0].EventCC;
                $scope.EventTo = data[0].EventTo;
            });
        };
        $scope.EventToClearFunction = function () {
            $scope.EventCC = "";
            $scope.EventTo = "";
        }

        $scope.EmailTemplate = "0";
        $scope.AppTemplate = "0";
        $scope.WebTemplate = "0";
        /* THIS IS FOR ADD/EDIT FUNCTION */
        $scope.EmailAlertAddEdit = function () {
            if ($scope.Validationcontrols() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    Institution_Id: $scope.InstituteId,
                    Event_Id: $scope.Event,
                    EmailFlag: $scope.EmailFlag,
                    AppFlag: $scope.AppFlag,
                    WebFlag: $scope.WebFlag,
                    EmailTemplate_Id: $scope.EmailTemplate == 0 ? null : $scope.EmailTemplate,
                    AppTemplate_Id: $scope.AppTemplate == 0 ? null : $scope.AppTemplate,
                    WebTemplate_Id: $scope.WebTemplate == 0 ? null : $scope.WebTemplate,
                    AlertDays: $scope.AlertDays,
                    ModifiedUser_Id: $scope.Patient_Id,
                    Created_By: $scope.Patient_Id
                }
                $http.post(baseUrl + '/api/EmailAlertConfig/EmailAlertDetails_AddEdit/', obj).success(function (data) {
                    alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        $scope.ClearPopup();
                        $scope.CancelPopUP();
                        $scope.EmailAlertlist();
                    }
                    $("#chatLoaderPV").hide();
                })
            }
        }

        /* THIS IS FOR LIST PROCEDURE */
        $scope.emptydata = [];
        $scope.rowCollection = [];
        $scope.flag = 0;
        $scope.rowCollectionFilter = [];
        $scope.Id = 0;
        $scope.EmailAlertlist = function () {
            $("#chatLoaderPV").show();
            $scope.ISact = 1;       // default active
            if ($scope.IsActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.IsActive == false) {
                $scope.ISact = -1 //all
            }
            $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_List/?Id=' + $scope.InstituteId + '&IsActive=' + $scope.ISact).success(function (data) {
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

        $scope.searchquery = "";
        /* FILTER THE LIST FUNCTION.*/
        $scope.filteralertList = function () {
            $scope.rowCollectionFilter = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if ($scope.searchquery == "") {
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.EventName).match(searchstring) ||
                        angular.lowercase(value.EmailTemplate == null ? '' : value.EmailTemplate).match(searchstring) ||
                        angular.lowercase(value.AppTemplate == null ? '' : value.AppTemplate).match(searchstring) ||
                        angular.lowercase(value.WebTemplate == null ? '' : value.WebTemplate).match(searchstring);
                });
            }
        }
        $scope.DuplicatesId = 0;
        $scope.assignedEvent = "";
        $scope.assignedEmailTemplate = "";
        $scope.assignedNotificationTemplate = "";
        $scope.assignedAppTemplate = "";
        /* THIS IS FOR VIEW FUNCTION */
        $scope.ViewEmailAlert = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_View/?Id=' + $scope.Id).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Institution_Id = data.Institution_Id;
                $scope.Institution_Name = data.Institution_Name;

                $scope.EmailFlag = data.EmailFlag;
                $scope.AppFlag = data.AppFlag;
                $scope.WebFlag = data.WebFlag;
                if (data.EmailTemplate_Id != null) {
                    $scope.EmailTemplate = data.EmailTemplate_Id.toString();
                    $scope.EmailTempId = 1;
                    $scope.ViewEmailTemplateName = data.EmailTemplate;
                }
                if (data.AppTemplate_Id != null) {
                    $scope.AppTemplate = data.AppTemplate_Id.toString();
                    $scope.AppTempId = 2;
                    $scope.ViewAppTemplateName = data.AppTemplate;
                }

                if (data.WebTemplate_Id != null) {
                    $scope.WebTemplate = data.WebTemplate_Id.toString();
                    $scope.WebTempId = 2;
                    $scope.ViewWebTemplateName = data.WebTemplate;
                }

                $scope.AlertDays = data.AlertDays;

                $scope.Event = data.Event_Id.toString();
                $scope.ViewEvent = data.EventName;
                $scope.assignedEvent = $scope.Event;
                $scope.Event = $scope.Event;
                $scope.DurationDisplayCheck();
                $scope.EventBasedToList();
                $("#chatLoaderPV").hide();
            });
        }

        $scope.DeleteEmailAlert = function (DId) {
            $scope.Id = DId;
            $scope.EmailAlert_Delete();
        };
        /*THIS IS FOR DELETE FUNCTION */
        $scope.EmailAlert_Delete = function () {

            var del = confirm("Do you like to deactivate the selected Alert details?");
            if (del == true) {
                $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_Delete/?Id=' + $scope.Id).success(function (data) {
                    alert("Alert has been deactivated Successfully");
                    $scope.EmailAlertlist();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Alert details" + data;
                });
            }
        };

        /* THIS IS FOR ACTIVE FUNCTION*/
        $scope.ActiveEmailAlert = function (PId) {
            $scope.Id = PId;
            $scope.EmailAlert_Active();
        };

        /* 
            Calling the api method to activate the details of Email Template
            matching the specified Email Template Id,
            and redirected to the list page.
           */
        $scope.EmailAlert_Active = function () {

            var Ins = confirm("Do you like to activate the selected Alert details?");
            if (Ins == true) {
                $http.get(baseUrl + '/api/EmailAlertConfig/EmailAlert_Active/?Id=' + $scope.Id).success(function (data) {
                    alert("Selected Alert details has been activated successfully");
                    $scope.EmailAlertlist();
                }).error(function (data) {
                    $scope.error = "An error has occured while deleting alert records" + data;
                });
            }
        };

        $scope.Active_ErrorFunction = function () {
            alert("Inactive Alert details cannot be edited");
        };

        /*calling Alert message for cannot edit inactive record function */
        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }

        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD */
        $scope.AddEmailAlertPopUP = function () {
            angular.element('#EmailAlertModal').modal('show');
            //  $scope.ClearPopup();
        }

        /* THIS IS OPENING POP WINDOW FORM VIEW */
        $scope.ViewEmailAlertPopUP = function (CatId) {
            $scope.Id = CatId;
            $scope.EventClear();
            $scope.ViewEmailAlert();
            angular.element('#EmailAlertViewModal').modal('show');
        }

        /* THIS IS OPENING POP WINDOW FORM EDIT */
        $scope.EditEmailAlert = function (CatId) {
            $scope.Id = CatId;
            $scope.EventClear();
            $scope.ViewEmailAlert();
            angular.element('#EmailAlertModal').modal('show');
        }

        /* THIS IS CANCEL POPUP FUNCTION */
        $scope.CancelPopUP = function () {
            angular.element('#EmailAlertModal').modal('hide')
        }

        /* THIS IS CANCEL VIEW POPUP FUNCTION*/
        $scope.CancelViewPopup = function () {
            angular.element('#EmailAlertViewModal').modal('hide')
        }
        $scope.EventClear = function () {
            $scope.Institution_Id = "0";
            $scope.Institution_Name = "";
            $scope.EmailFlag = 0;
            $scope.EmailTemplate = "0";
            $scope.AppFlag = 0;
            $scope.AppTemplate = "0";
            $scope.AppFlag = 0;
            $scope.AppTemplate = "0";
            $scope.AlertDays = "";
            $scope.WebTempId = -1;
            $scope.AppTempId = -1;
            $scope.EmailTempId = -1;
            $scope.EventCC = "";
            $scope.EventTo = "";
        };

        /* THIS IS CLEAR POPUP FUNCTION */
        $scope.ClearPopup = function () {
            $scope.Id = "0";
            $scope.Institution_Id = "0";
            $scope.Institution_Name = "";
            $scope.Event_Id = "0";
            $scope.Event = "0";
            $scope.EmailFlag = 0;
            $scope.EmailTemplate = "0";
            $scope.AppFlag = 0;
            $scope.AppTemplate = "0";
            $scope.WebFlag = 0;
            $scope.WebTemplate = "0";
            $scope.AlertDays = "";
            $scope.WebTempId = -1;
            $scope.AppTempId = -1;
            $scope.EmailTempId = -1;
        }

        /* THIS IS OPENING POP WINDOW FORM LIST */
        $scope.ListEmailAlertPopUP = function (EmailAlertCatId) {
            if ($routeParams.Id == 0) {
                $scope.rowCollection = [];
            }
            $scope.Id = CatId;
            $scope.EmailAlertList();
        }
    }
]);
MyCortexControllers.controller("PatientReportList", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.Reportflag = 0;
        $scope.UserTypeId = 0;
        $scope.UserNameId = 0;
        $scope.Id = "0";
        $scope.Usertype_listdata = [];
        $scope.UserName_listdata = [];
        $scope.ShortNameId = "";

        $scope.Period_From = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));
        $scope.Period_To = DateFormatEdit($filter('date')(new Date(), 'dd-MMM-yyyy'));

        $scope.InstituteId = $window.localStorage['InstitutionId'];

        $http.get(baseUrl + '/api/ReportDetails/TableShortName_List/').success(function (data) {
            $scope.TableShortName_listdata = data;
        });

        /* User type details list*/
        $http.get(baseUrl + '/api/Login/Usertypedetailslist/').success(function (data) {
            $scope.Usertype_listdataTemp = [];
            $scope.Usertype_listdataTemp = data;
            var obj = { "Id": 0, "TypeName": "Select", "IsActive": 1 };
            $scope.Usertype_listdataTemp.splice(0, 0, obj);
            $scope.Usertype_listdata = angular.copy($scope.Usertype_listdataTemp);
            $scope.UserTypeId = 0;
        });

        $scope.UserTypeBaseduserName = function () {
            $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + $scope.UserTypeId + '&InstitutionId=' + $scope.InstituteId).success(function (data) {
                $scope.UserName_listdataTemp = [];
                $scope.UserName_listdataTemp = data;
                var obj = { "Id": 0, "FullName": "Select", "IsActive": 1 };
                $scope.UserName_listdataTemp.splice(0, 0, obj);
                $scope.UserName_listdata = angular.copy($scope.UserName_listdataTemp);
                $scope.UserNameId = 0;
            });
        }

        $scope.ConfigCode = "REPORT_DATE_LIMIT";
        $scope.ValidateDays = 90;
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.InstituteId)
            .success(function (data) {
                if (data[0] != undefined) {
                    $scope.ValidateDays = parseInt(data[0].ConfigValue);
                }
                else {
                    $scope.ValidateDays = 90;
                }
            });

        $scope.patientReportValidation = function () {
            if (typeof ($scope.UserTypeId) == "undefined" || $scope.UserTypeId == "0") {
                alert("Please select User Type");
                return false;
            }
            else if (typeof ($scope.UserNameId) == "undefined" || $scope.UserNameId == "0") {
                alert("Please select User Name");
                return false;
            }

            //else if (isDate($scope.Period_From) == false) {
            //    alert("Period From is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            if (typeof ($scope.Period_To) == "undefined" || $scope.Period_To == "") {
                alert("Please select Period To");
                return false;
            }
            //else if (isDate($scope.Period_To) == false) {
            //    alert("Period To is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            //var date1 = new Date($scope.Period_From);
            var date1 = new Date($scope.Period_From);
            var date2 = new Date($scope.Period_To);
            var diffTime = Math.abs(date2 - date1);
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= $scope.ValidateDays) {
                alert($scope.ValidateDays.toString() + " days only allowed Audit Report");
                return false;
            }
            var retval = true;
            if (($scope.Period_From != "") && ($scope.Period_To != "")) {
                $scope.Period_From = moment($scope.Period_From).format('DD-MMM-YYYY');
                $scope.Period_To = moment($scope.Period_To).format('DD-MMM-YYYY');

                if ((ParseDate($scope.Period_From) > ParseDate($scope.Period_To))) {
                    alert("From Date should not be greater than To Date");
                    $scope.Period_From = DateFormatEdit($scope.Period_From);
                    $scope.Period_To = DateFormatEdit($scope.Period_To);
                    retval = false;
                    return false;
                }
                $scope.Period_From = DateFormatEdit($scope.Period_From);
                $scope.Period_To = DateFormatEdit($scope.Period_To);
            }

            return retval;
        };

        $scope.PatientReportListData = [];
        $scope.filterReportList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchreportquery);
            if ($scope.searchreportquery == "") {
                $scope.PatientDetailsFilteredDataList = [];
                $scope.PatientDetailsFilteredDataList = angular.copy($scope.ReportDetails_ListOrder);

            }
            else {
                $scope.PatientDetailsFilteredDataList = $ff($scope.ReportDetails_ListOrder, function (value) {
                    return angular.lowercase(value.ShortName).match(searchstring) ||
                        angular.lowercase(value.TableDisplayName).match(searchstring) ||
                        angular.lowercase(value.Details).match(searchstring) ||
                        angular.lowercase(value.ColumnOrder).match(searchstring) ||
                        angular.lowercase(value.Action).match(searchstring) ||
                        angular.lowercase(value.NewValue).match(searchstring) ||
                        angular.lowercase(value.OldValue == null ? "" : value.OldValue).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ActionDateTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);


                });
            }
        };

        $scope.ReportDetailsemptydata = [];
        $scope.PatientDetailsFilteredDataList = [];
        $scope.PatientReportDetailslist = function () {
            if ($scope.patientReportValidation() == true) {
                $("#chatLoaderPV").show();
                $http.get(baseUrl + '/api/ReportDetails/PatientReportDetails_List?' +
                    'Period_From=' + moment($scope.Period_From).format('DD-MMM-YYYY') +
                    '&Period_To=' + moment($scope.Period_To).format('DD-MMM-YYYY') +
                    '&ShortNameId=' + $scope.ShortNameId +
                    '&UserNameId=' + $scope.UserNameId
                    + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

                        $scope.ReportDetails_ListOrder = [];
                        $scope.ReportDetails_ListOrder = data;
                        $scope.PatientDetailsFilteredDataList = angular.copy($scope.ReportDetails_ListOrder);
                        if ($scope.PatientDetailsFilteredDataList.length > 0) {
                            $scope.Reportflag = 1;
                        }
                        else {
                            $scope.Reportflag = 0;
                        }
                        $("#chatLoaderPV").hide();
                    });
            }
        };


    }
]);

MyCortexControllers.controller("AppointmentSlotController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {

        //List Page Pagination.
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
                alert("Inactive record cannot be edited");
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
                alert("Please select Doctor");
                return false;
            }
            if (typeof ($scope.SelectedDoctor1) == "undefined" || $scope.SelectedDoctor1 == "0" && $scope.Id > 0) {
                alert("Please select Doctor");
                return false;
            }
            //else if (typeof ($scope.Appoinment_Hours) == "undefined" || $scope.Appoinment_Hours == "") {
            //    alert("Please enter New Appointment Hours");
            //    return false;
            //}
            else if (typeof ($scope.Appoinment_Minutes) == "undefined" || $scope.Appoinment_Minutes == "") {
                alert("Please enter New Appointment Minutes");
                return false;
            }
            else if (typeof ($scope.FollowUp_Appoinment) == "undefined" || $scope.FollowUp_Appoinment == "") {
                alert("Please enter Followup Appointment");
                return false;
            }
            else if (typeof ($scope.SlotInterval) == "undefined" || $scope.SlotInterval == "") {
                alert("Please enter Slot Interval");
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
    }
]);

MyCortexControllers.controller("SlotTimingController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        //  $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.ShiftName = "";
        $scope.IsActive = true;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.ViewShiftTimingsSlot = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewShiftTimings();
            angular.element('#ViewAppointmentSlotModal').modal('show');
        }

        $scope.EditShiftTimingsSlot = function (CatId, ActiveFlag) {
            if (ActiveFlag == 1) {
                $scope.ClearShiftTimingPopUp();
                $scope.Id = CatId;
                $scope.ViewShiftTimings();
                angular.element('#AppointmentSlotModal').modal('show');
            }
            else {
                alert("Inactive record cannot be edited");
            }
        };

        $scope.AddTiming = function () {
            angular.element('#AppointmentSlotModal').modal('show');
        }

        $scope.CancelTiming = function () {
            angular.element('#AppointmentSlotModal').modal('hide');
        }

        $scope.AddDoctorShift = function () {
            angular.element('#DoctorShiftModal').modal('show');
        }

        $scope.CancelDoctorShift = function () {
            angular.element('#DoctorShiftModal').modal('hide');
        }
        $scope.Convert24to12Timeformat = function (inputTime) {
            var outputTime = null;
            if (inputTime != '' && inputTime != null) {
                inputTime = inputTime.toString(); //value to string for splitting
                var splitTime = inputTime.split(':');
                splitTime.splice(2, 1);
                var ampm = (splitTime[0] >= 12 ? ' PM' : ' AM'); //determine AM or PM
                splitTime[0] = splitTime[0] % 12;
                splitTime[0] = (splitTime[0] == 0 ? 12 : splitTime[0]); //adjust for 0 = 12
                outputTime = splitTime.join(':') + ampm;
            }
            return outputTime;
        };
        $scope.Convert12To24Timeformat = function (timeval) {
            var outputTime = null;
            if (timeval != '' && timeval != null) {
                var time = timeval;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12) hours = hours + 12;
                if (AMPM == "AM" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                outputTime = sHours + ":" + sMinutes;
            }
            return outputTime;
        };

        $scope.ShiftTimings_InsertUpdateValidations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.ShiftFromDate = moment($scope.ShiftFromDate).format('DD-MMM-YYYY');
            $scope.ShiftToDate = moment($scope.ShiftToDate).format('DD-MMM-YYYY');

            if ($scope.ShiftName == "") {
                alert("Please enter Shift");
                return false;
            }
            else if (($scope.ShiftFromDate < today)) {
                alert("Shift Timing From Date Can Be Booked Only For Future");
                $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                return false;
            }  
            else if (($scope.ShiftToDate < today)) {
                alert("Shift Timing ToDate Can Be Booked Only For Future");
                $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                return false;
            } 
            else if ((typeof ($scope.ShiftFromDate) != "") && (typeof ($scope.ShiftToDate) != "")) {

                if (moment($scope.ShiftFromDate + " " + $scope.ShiftFromTime) > moment($scope.ShiftToDate + " " + $scope.ShiftEndTime)) {
                    if (($scope.ShiftFromDate !== null) && ($scope.ShiftToDate !== null)) {
                        if ((ParseDate($scope.ShiftToDate) < ParseDate($scope.ShiftFromDate))) {
                            alert("From Date Should not be greater than To Date");
                            $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                            $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                            return false;
                        }
                        alert("Shift From Time should not be greater than Shift To Time");
                        $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
                        $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
                        return false;
                    }

                }
            }
            else if ($scope.ShiftFromTime == "") {
                alert("Please select Shift From time");
                return false;
            }
            else if ($scope.ShiftEndTime == "") {
                alert("Please select Shift To time");
                return false;
            }

            else if (typeof ($scope.ShiftFromDate) == "undefined" || $scope.ShiftFromDate == 0) {
                alert("Please select From Date");
                return false;
            }
            else if (typeof ($scope.ShiftToDate) == "undefined" || $scope.ShiftToDate == 0) {
                alert("Please select To Date");
                return false;
            }
            $scope.ShiftFromDate = DateFormatEdit($scope.ShiftFromDate);
            $scope.ShiftToDate = DateFormatEdit($scope.ShiftToDate);
            return true;
        };

        $scope.ShiftTimingAddEdit = function () {
            if ($scope.ShiftTimings_InsertUpdateValidations() == true) {
                $("#chatLoaderPV").show();
                var obj = {
                    Id: $scope.Id,
                    InstituteId: $window.localStorage['InstitutionId'],
                    ShiftName: $scope.ShiftName,
                    ShiftFromTime: $scope.ShiftFromTime == '' ? null : $scope.Convert12To24Timeformat($scope.ShiftFromTime),
                    ShiftEndTime: $scope.ShiftEndTime == '' ? null : $scope.Convert12To24Timeformat($scope.ShiftEndTime),
                    ShiftFromDate: moment($scope.ShiftFromDate).format('DD-MMM-YYYY'),
                    ShiftToDate: moment($scope.ShiftToDate).format('DD-MMM-YYYY'),
                };
                $http.post(baseUrl + '/api/ShiftTmings/ShiftTimings_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, obj).success(function (data) {
                    alert(data.Message);
                    $scope.ShiftTimingList();
                    $scope.ClearShiftTimingPopUp();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Parameter" + data;
                });
                $("#chatLoaderPV").hide();
            }
        };

        $scope.searchquerySlotTimings = "";
        /* Filter the master list function.*/
        $scope.FilterSlotTimingList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquerySlotTimings);
            if (searchstring == "") {
                $scope.rowCollectionShiftTimingsFilter = [];
                $scope.rowCollectionShiftTimingsFilter = angular.copy($scope.rowCollectionShiftTimings);
            }
            else {
                $scope.rowCollectionShiftTimingsFilter = $ff($scope.rowCollectionShiftTimings, function (value) {
                    return angular.lowercase(value.ShiftName).match(searchstring) ||
                        angular.lowercase($filter('date')(value.ShiftToDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.ShiftFromDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ShiftFromTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ShiftEndTime, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring);

                });
            }
        }
        $scope.ShiftTimingList = function () {
            $("#chatLoaderPV").show();
            $scope.emptydataShiftTimings = [];
            $scope.rowCollectionShiftTimings = [];

            $scope.ISact = 1;       // default active
            if ($scope.IsActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.IsActive == false) {
                $scope.ISact = -1 //all
            }

            $http.get(baseUrl + '/api/ShiftTmings/ShiftTimings_List/Id?=0' + '&IsActive=' + $scope.ISact + '&InstituteId=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.emptydataShiftTimings = [];
                $scope.rowCollectionShiftTimings = [];
                $scope.rowCollectionShiftTimings = data;
                $scope.rowCollectionShiftTimingsFilter = angular.copy($scope.rowCollectionShiftTimings);
                if ($scope.rowCollectionShiftTimingsFilter.length > 0) {
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
        $scope.ClearShiftTimingPopUp = function () {
            $scope.Id = 0;
            $scope.InstituteId = "";
            $scope.ShiftName = "";
            $scope.ShiftFromTime = "";
            $scope.ShiftEndTime = "";
            $scope.ShiftFromDate = "";
            $scope.ShiftToDate = "";
            $scope.CancelShiftTimingPopUp();
        }

        $scope.CancelShiftTimingPopUp = function () {
            angular.element('#AppointmentSlotModal').modal('hide');
            angular.element('#ViewAppointmentSlotModal').modal('hide');

        };

        $scope.ViewShiftTimings = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/ShiftTmings/ShiftTimings_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Id = data.Id;
                $scope.ShiftName = data.ShiftName;
                var SFD = moment(data.ShiftFromDate).format('DD-MMM-YYYY');
                $scope.ShiftFromDate = DateFormatEdit(SFD);
                var STD = moment(data.ShiftToDate).format('DD-MMM-YYYY');
                $scope.ShiftToDate = DateFormatEdit(STD);
                $scope.ShiftFromTime = $filter('date')(data.ShiftFromTime, "hh:mm a");
                $scope.ShiftEndTime = $filter('date')(data.ShiftEndTime, "hh:mm a");
            });
            $("#chatLoaderPV").hide();
        };

        /* 
    Calling the api method to detele the details of the Allergy
    for the  Allergy Id,
    and redirected to the list page.
    */
        $scope.DeleteShiftTimingsSlot = function (comId) {
            $scope.Id = comId;
            $scope.ShiftTimings_InActive();
        };
        $scope.ShiftTimings_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Shift Slot?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/ShiftTmings/ShiftTimings_InActive/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.ShiftTimingList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Shift Slot" + data;
                });
            };
        };

        /*'Active' the Allergy*/
        $scope.ReInsertShiftTimingsSlot = function (comId) {
            $scope.Id = comId;
            $scope.ShiftTimings_Active();
        };
        /* 
        Calling the api method to inactived the details of the Allergy 
        for the  Allergy Id,
        and redirected to the list page.
        */
        $scope.ShiftTimings_Active = function () {
            $http.get(baseUrl + '/api/ShiftTmings/ActivateShiftTiming_List/?Id=' + $scope.Id
                + '&Institution_Id=' + $window.localStorage['InstitutionId']
            ).success(function (data) {
                if (data.returnval == 1) {
                    alert("Activate Shift Slot is already created, Please check");
                }
                else {
                    var Ins = confirm("Do you like to activate the selected Shift Slot?");
                    if (Ins == true) {
                        var obj =
                        {
                            Id: $scope.Id,
                            Modified_By: $window.localStorage['UserId']
                        }

                        $http.post(baseUrl + '/api/ShiftTmings/ShiftTimings_Active/', obj).success(function (data) {
                            alert(data.Message);
                            $scope.ShiftTimingList();
                        }).error(function (data) {
                            $scope.error = "An error has occurred while deleting Shift Slot" + data;
                        });
                    };
                }
            })
        }

        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }

    }

]);

MyCortexControllers.controller("DoctorShiftController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {

        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }

        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.listdata = [];
        $scope.Institution_Name = "";
        $scope.Doctor_Id = "0";
        $scope.Doctor_Name = "";
        $scope.SundayChildModuleList = [];
        $scope.MondayChildModuleList = [];
        $scope.TuesdayChildModuleList = [];
        $scope.WednessdayChildModuleList = [];
        $scope.ThursdayChildModuleList = [];
        $scope.FridayChildModuleList = [];
        $scope.SaturdayChildModuleList = [];
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.Doctor_Id = [];

        $scope.DuplicateId = "0";
        $scope.flag = 0;
        $scope.IsActive = true;
        $scope.rowCollection = [];
        $scope.rowCollectionFilter = [];
        $scope.Id = 0;

        $scope.AddSlot = function () {
            $scope.Id = 0;
            // $scope.AppoinmentSlotClear();
            angular.element('#DoctorShiftModal').modal('show');
        }
        $scope.CancelSlot = function () {
            angular.element('#DoctorShiftModal').modal('hide');
        }

        $scope.ViewAppoinmentpopup = function () {
            angular.element('#ViewDoctorShiftModal').modal('show');
        }

        $scope.CancelDoctorShiftpopup = function () {
            angular.element('#ViewDoctorShiftModal').modal('hide');
        }

        /* on click view, view popup opened*/
        $scope.ViewDoctorShift = function (DId, DoctorId) {
            $scope.DoctorShiftClear();
            $scope.Id = DId;
            $scope.DoctorShift_View(DoctorId);
            angular.element('#ViewDoctorShiftModal').modal('show');

        };
        /* on click Edit, edit popup opened*/
        $scope.EditDoctorShift = function (DId, activeFlag, DoctorId) {
            if (activeFlag == 1) {
                $scope.DoctorShiftClear();
                $scope.Id = DId;
                $scope.DoctorShift_View(DoctorId);
                angular.element('#DoctorShiftModal').modal('show');
            }
            else {
                alert("Inactive record cannot be edited");
            }
        };
        /* 
     Calling api method for the dropdown list in the html page for the fields 
     Doctor List
     */
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.DoctorList = [];
        $scope.DoctorListActive = [];
        $scope.DoctorShiftListTemp = [];
        $http.get(baseUrl + '/api/AppoinmentSlot/Doctors_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {

            //var obj = { "Id": 0, "Name": "Select", "IsActive": 0 };
            //$scope.DoctorShiftListTemp.splice(0, 0, obj);
            ////$scope.InstitutiondetailsListTemp.push(obj);
            //$scope.DoctorList = angular.copy($scope.DoctorShiftListTemp);
            $scope.DoctorList = data;
            //$ff(data, { IsActive: 1 });
            $scope.DoctorListActive = data;
        });
        $scope.DoctorShiftList = [];
        $scope.DoctorShiftListActive = [];
        $http.get(baseUrl + '/api/DoctorShift/Shift_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {
            $scope.DoctorShiftList = $ff(data, { IsActive: 1 });
            $scope.DoctorShiftListActive = data;
        });

        $scope.WeekdayList = [];
        $scope.WeekdayActiveList = [];
        $http.get(baseUrl + '/api/DoctorShift/Days_List/?Institution_Id=' + $scope.InstituteId).success(function (data) {
            $scope.WeekdayList = data;
            $scope.WeekdayActiveList = $ff(data, { IsActive: 1 });

            $scope.day1 = data[0].WeekDayName;
            $scope.day1Id = data[0].Id;
            $scope.day2 = data[1].WeekDayName;
            $scope.day2Id = data[1].Id;
            $scope.day3 = data[2].WeekDayName;
            $scope.day3Id = data[2].Id;
            $scope.day4 = data[3].WeekDayName;
            $scope.day4Id = data[3].Id;
            $scope.day5 = data[4].WeekDayName;
            $scope.day5Id = data[4].Id;
            $scope.day6 = data[5].WeekDayName;
            $scope.day6Id = data[5].Id;
            $scope.day7 = data[6].WeekDayName;
            $scope.day7Id = data[6].Id;
        });

        $scope.searchquery = "";
        /* Filter the master list function.*/
        $scope.filterDoctorShiftList = function () {
            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchquery);
            if (searchstring == "") {
                $scope.rowCollectionFilter = [];
                $scope.rowCollectionFilter = angular.copy($scope.rowCollection);
            }
            else {
                $scope.rowCollectionFilter = $ff($scope.rowCollection, function (value) {
                    return angular.lowercase(value.Doctor_Name).match(searchstring) ||
                        angular.lowercase(value.ShiftName).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.FromDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring) ||
                        angular.lowercase(($filter('date')(value.ToDate, "dd-MMM-yyyy hh:mm:ss a"))).match(searchstring)
                });
                if ($scope.rowCollectionFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
            }
        }

        /* Validating the create page mandatory fields
           checking mandatory for the follwing fields
            Doctor Id, Sunday shift, Monday Shift, Tuesday Shift, Wednesday Shift, Thursday Shift, Friday Shift, Saturday Shift, From date, To date
           and showing alert message when it is null.
           */
        $scope.DoctorShiftAddEdit_Validations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.FromDate = moment($scope.FromDate).format('DD-MMM-YYYY');
            $scope.ToDate = moment($scope.ToDate).format('DD-MMM-YYYY');

            if (($scope.Doctor_Id.length == 0) && $scope.Id == 0) {
                alert("Please select Doctor");
                return false;
            }
            if (typeof ($scope.Doctor_Id1) == "undefined" || $scope.Doctor_Id1 == "0" && $scope.Id > 0) {
                alert("Please select Doctor");
                return false;
            }
            //else if ($scope.SundayShift.length == 0) {
            //    alert("Please select " + $scope.day1);
            //    return false;
            //}
            //else if ($scope.MondayShift.length == 0) {
            //    alert("Please select " + $scope.day2);
            //    return false;
            //}
            //else if ($scope.TuesdayShift.length == 0) {
            //    alert("Please select " + $scope.day3);
            //    return false;
            //}
            //else if ($scope.WednessdayShift.length == 0) {
            //    alert("Please select " + $scope.day4);
            //    return false;
            //}
            //else if ($scope.ThursdayShift.length == 0) {
            //    alert("Please select " + $scope.day5);
            //    return false;
            //}
            //else if ($scope.FridayShift.length == 0) {
            //    alert("Please select " + $scope.day6);
            //    return false;
            //}
            //else if ($scope.SaturdayShift.length == 0) {
            //    alert("Please select " + $scope.day7);
            //    return false;
            //}
            else if (typeof ($scope.FromDate) == "undefined" || $scope.FromDate == null) {
                alert("Please select From Date");
                return false;
            }
            else if (typeof ($scope.ToDate) == "undefined" || $scope.ToDate == null) {
                alert("Please select To Date");
                return false;
            }
            else if ($scope.FromDate < today) {
                alert("FromDate Can Be Booked Only For Past");
                $scope.FromDate = DateFormatEdit($scope.FromDate);
                $scope.ToDate = DateFormatEdit($scope.ToDate);
                return false;
            }
            else if ($scope.ToDate < today) {
                alert("To Date Can Be Booked Only For Past");
                $scope.FromDate = DateFormatEdit($scope.FromDate);
                $scope.ToDate = DateFormatEdit($scope.ToDate);
                return false;
            }
            if (($scope.FromDate !== null) && ($scope.ToDate !== null)) {
                if ((ParseDate($scope.ToDate) < ParseDate($scope.FromDate))) {
                    alert("From Date should not be greater than To Date");
                    $scope.FromDate = DateFormatEdit($scope.FromDate);
                    $scope.ToDate = DateFormatEdit($scope.ToDate);
                    return false;
                }
            }
            $scope.FromDate = DateFormatEdit($scope.FromDate);
            $scope.ToDate = DateFormatEdit($scope.ToDate);
            return true;
        }

        $('#AppointmentSlotModal').on('hide.bs.modal', function () {
            console.log('hide');
            //return false;
        })

        /*on click Save calling the insert update function for Doctor shift
         and check the  Doctor shift already exist,if exist it display alert message or its 
         calling the insert update function*/

        $scope.DoctorShift_AddEdit = function () {

            $scope.ShiftDetails = [];
            $scope.DoctorListfiltersDetails = [];
            if ($scope.DoctorShiftAddEdit_Validations() == true) {
                $("#chatLoaderPV").show();

                $scope.SundayShiftDetails = [];
                angular.forEach($scope.SundayShift, function (value, index1) {
                    var obj = {
                        Id: 0,
                        DayMaster_Id: $scope.day1Id == 0 ? null : $scope.day1Id,
                        Shift_Id: value,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.SundayShiftDetails.push(obj);
                });

                $scope.MondayShiftDetails = [];
                angular.forEach($scope.MondayShift, function (Selected1, index) {
                    var obj1 = {
                        Id: 0,
                        DayMaster_Id: $scope.day2Id == 0 ? null : $scope.day2Id,
                        Shift_Id: Selected1,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.MondayShiftDetails.push(obj1);
                });

                $scope.TuesdayShiftDetails = [];
                angular.forEach($scope.TuesdayShift, function (Selected2, index) {
                    var obj2 = {
                        Id: 0,
                        DayMaster_Id: $scope.day3Id == 0 ? null : $scope.day3Id,
                        Shift_Id: Selected2,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.TuesdayShiftDetails.push(obj2);

                });

                $scope.WednessdayShiftDetails = [];
                angular.forEach($scope.WednessdayShift, function (Selected3, index) {
                    var obj3 = {
                        Id: 0,
                        DayMaster_Id: $scope.day4Id == 0 ? null : $scope.day4Id,
                        Shift_Id: Selected3,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.WednessdayShiftDetails.push(obj3);
                });

                $scope.ThursdayShiftDetails = [];
                angular.forEach($scope.ThursdayShift, function (Selected4, index) {
                    var obj4 = {
                        Id: 0,
                        DayMaster_Id: $scope.day5Id == 0 ? null : $scope.day5Id,
                        Shift_Id: Selected4,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.ThursdayShiftDetails.push(obj4);
                });

                $scope.FridayShiftDetails = [];
                angular.forEach($scope.FridayShift, function (Selected5, index) {
                    var obj5 = {
                        Id: 0,
                        DayMaster_Id: $scope.day6Id == 0 ? null : $scope.day6Id,
                        Shift_Id: Selected5,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.FridayShiftDetails.push(obj5);
                });

                $scope.SaturdayShiftDetails = [];
                angular.forEach($scope.SaturdayShift, function (Selected6, index) {

                    var obj6 = {
                        Id: 0,
                        DayMaster_Id: $scope.day7Id == 0 ? null : $scope.day7Id,
                        Shift_Id: Selected6,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                    }
                    $scope.SaturdayShiftDetails.push(obj6);
                });

                if ($scope.Id == 0) {
                    angular.forEach($scope.Doctor_Id, function (Selected, index) {

                        var obj8 = {
                            Id: $scope.Id,
                            Institution_Id: $window.localStorage['InstitutionId'],
                            Doctor_Id: Selected,
                            FromDate: moment($scope.FromDate).format('DD-MMM-YYYY'),
                            ToDate: moment($scope.ToDate).format('DD-MMM-YYYY'),
                            Created_By: $window.localStorage['UserId'],
                            Modified_By: $window.localStorage['UserId'],
                            SundayChildModuleList: $scope.SundayShiftDetails,
                            MondayChildModuleList: $scope.MondayShiftDetails,
                            TuesdayChildModuleList: $scope.TuesdayShiftDetails,
                            WednessdayChildModuleList: $scope.WednessdayShiftDetails,
                            ThursdayChildModuleList: $scope.ThursdayShiftDetails,
                            FridayChildModuleList: $scope.FridayShiftDetails,
                            SaturdayChildModuleList: $scope.SaturdayShiftDetails,
                            DoctorShiftList: $scope.DoctorShiftList
                        };
                        $scope.DoctorListfiltersDetails.push(obj8)
                    })
                }
                else {
                    var obj9 = {
                        Id: $scope.Id,
                        Institution_Id: $window.localStorage['InstitutionId'],
                        Doctor_Id: $scope.Doctor_Id1,
                        FromDate: $scope.FromDate,
                        ToDate: $scope.ToDate,
                        Created_By: $window.localStorage['UserId'],
                        Modified_By: $window.localStorage['UserId'],
                        SundayChildModuleList: $scope.SundayShiftDetails,
                        MondayChildModuleList: $scope.MondayShiftDetails,
                        TuesdayChildModuleList: $scope.TuesdayShiftDetails,
                        WednessdayChildModuleList: $scope.WednessdayShiftDetails,
                        ThursdayChildModuleList: $scope.ThursdayShiftDetails,
                        FridayChildModuleList: $scope.FridayShiftDetails,
                        SaturdayChildModuleList: $scope.SaturdayShiftDetails,
                        DoctorShiftList: $scope.DoctorShiftList
                    };
                    $scope.DoctorListfiltersDetails.push(obj9)
                }

                $http.post(baseUrl + '/api/DoctorShift/DoctorShift_AddEdit/', $scope.DoctorListfiltersDetails).success(function (data) {
                    // $("#chatLoaderPV").hide();
                    alert(data.Message);
                    if (data.ReturnFlag == "1") {
                        $scope.CancelSlot();
                        $scope.DoctorShiftClear();
                        $scope.DoctorShiftListGo();
                    }
                })
                $("#chatLoaderPV").hide();
            }
        }

        $scope.DoctorShiftClear = function () {
            $scope.Institution_Name = "";
            $scope.Doctor_Id = "0";
            $scope.Doctor_Id1 = "0";
            $scope.Doctor_Id = [];
            //$scope.Doctor_Id = "";
            $scope.Doctor_Name = "";
            //   $scope.DoctorList =[];
            $scope.SundayShift = [];
            $scope.MondayShift = [];
            $scope.TuesdayShift = [];
            $scope.WednessdayShift = [];
            $scope.ThursdayShift = [];
            $scope.FridayShift = [];
            $scope.SaturdayShift = [];
            $scope.FromDate = "";
            $scope.ToDate = "";

            $scope.EditSundayChildModuleList = [];
            $scope.EditMondayChildModuleList = [];
            $scope.EditTuesdayChildModuleList = [];
            $scope.EditWednessdayChildModuleList = [];
            $scope.EditThursdayChildModuleList = [];
            $scope.EditFridayChildModuleList = [];
            $scope.EditSaturdayChildModuleList = [];

            $scope.SundayShiftview = "";
            $scope.MondayShiftview = "";
            $scope.TuesdayShiftview = "";
            $scope.WednessdayShiftview = "";
            $scope.ThursdayShiftview = "";
            $scope.FridayShiftview = "";
            $scope.SaturdayShiftview = "";
        }

        $scope.SundayShift2 = [];
        $scope.MondayShift2 = [];
        $scope.TuesdayShift2 = [];
        $scope.WednessdayShift2 = [];
        $scope.ThursdayShift2 = [];
        $scope.FridayShift2 = [];
        $scope.SaturdayShift2 = [];

        /*THIS IS FOR LIST FUNCTION*/
        $scope.DoctorShiftListGo = function () {
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

            $http.get(baseUrl + '/api/DoctorShift/DoctorShift_List/?IsActive=' + $scope.ISact + '&InstitutionId=' + $scope.InstituteId + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {

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
        $scope.EditSundayChildModuleList = [];
        $scope.EditMondayChildModuleList = [];
        $scope.EditTuesdayChildModuleList = [];
        $scope.EditWednessdayChildModuleList = [];
        $scope.EditThursdayChildModuleList = [];
        $scope.EditFridayChildModuleList = [];
        $scope.EditSaturdayChildModuleList = [];
        $scope.ChildModuleList = [];

        $scope.SundayShift = [];
        $scope.MondayShift = [];
        $scope.TuesdayShift = [];
        $scope.WednessdayShift = [];
        $scope.ThursdayShift = [];
        $scope.FridayShift = [];
        $scope.SaturdayShift = [];
        $scope.SundayShiftview = "";
        $scope.MondayShiftview = "";
        $scope.TuesdayShiftview = "";
        $scope.WednessdayShiftview = "";
        $scope.ThursdayShiftview = "";
        $scope.FridayShiftview = "";
        $scope.SaturdayShiftview = "";

        $scope.EditSundayChildModuleList1 = [];
        /*THIS IS FOR View FUNCTION*/
        $scope.DoctorShift_View = function (DoctorId) {
            $("#chatLoaderPV").show();
            $scope.EditSelectedDoctor = [];
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
            }
            $scope.SundayShift1 = [];
            $scope.MondayShift1 = [];
            $scope.TuesdayShift1 = [];
            $scope.WednessdayShift1 = [];
            $scope.ThursdayShift1 = [];
            $scope.FridayShift1 = [];
            $scope.SaturdayShift1 = [];
            $http.get(baseUrl + '/api/DoctorShift/DoctorShift_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                //   $scope.Id = data.Id;
                $scope.Doctor_Id1 = data.Doctor_Id.toString();
                $scope.Doctor_Name = data.Doctor_Name;
                var F_D = moment(data.FromDate, "dd-MMM-yyyy");
                $scope.FromDate = DateFormatEdit(F_D);
                var T_D = $filter('date')(data.ToDate, "dd-MMM-yyyy");
                $scope.ToDate = DateFormatEdit(T_D);
                $scope.EditSelectedDoctor.push(data.Doctor_Id);
                $scope.Doctor_Id = $scope.EditSelectedDoctor;

                // var weekDays = {Sunday:[],Monday:[],Tuesday:[],Wednesday:[],Thursday:[],Friday:[],Saturday:[]}
                var shiftName = $ff(data.ChildModuleList, function (value) {
                    if (value.WeekdayName == $scope.day1) {
                        if ($scope.SundayShiftview == "") {
                            $scope.SundayShiftview = ($scope.SundayShiftview + value.ShiftName);
                        }
                        else {
                            $scope.SundayShiftview = $scope.SundayShiftview + "," + value.ShiftName;
                        }
                        return $scope.SundayShift1.push(value.Shift_Id)
                        //$scope.SundayShift = $scope.SundayShift;
                    }
                    if (value.WeekdayName == $scope.day2) {
                        if ($scope.MondayShiftview == "") {
                            $scope.MondayShiftview = $scope.MondayShiftview + value.ShiftName;
                        }
                        else {
                            $scope.MondayShiftview = $scope.MondayShiftview + "," + value.ShiftName;
                        }
                        return $scope.MondayShift1.push(value.Shift_Id)
                    }

                    if (value.WeekdayName == $scope.day3) {
                        if ($scope.TuesdayShiftview == "") {
                            $scope.TuesdayShiftview = $scope.TuesdayShiftview + value.ShiftName;
                        }
                        else {
                            $scope.TuesdayShiftview = $scope.TuesdayShiftview + "," + value.ShiftName;
                        }
                        return $scope.TuesdayShift1.push(value.Shift_Id)
                    }
                    if (value.WeekdayName == $scope.day4) {
                        if ($scope.WednessdayShiftview == "") {
                            $scope.WednessdayShiftview = $scope.WednessdayShiftview + value.ShiftName;
                        }
                        else {
                            $scope.WednessdayShiftview = $scope.WednessdayShiftview + "," + value.ShiftName;
                        }
                        return $scope.WednessdayShift1.push(value.Shift_Id)
                    }
                    if (value.WeekdayName == $scope.day5) {
                        if ($scope.ThursdayShiftview == "") {
                            $scope.ThursdayShiftview = $scope.ThursdayShiftview + value.ShiftName;
                        }
                        else {
                            $scope.ThursdayShiftview = $scope.ThursdayShiftview + "," + value.ShiftName;
                        }
                        return $scope.ThursdayShift1.push(value.Shift_Id)
                    }
                    if (value.WeekdayName == $scope.day6) {
                        if ($scope.FridayShiftview == "") {
                            $scope.FridayShiftview = $scope.FridayShiftview + value.ShiftName;
                        }
                        else {
                            $scope.FridayShiftview = $scope.FridayShiftview + "," + value.ShiftName;
                        }
                        return $scope.FridayShift1.push(value.Shift_Id)
                    }
                    if (value.WeekdayName == $scope.day7) {
                        if ($scope.SaturdayShiftview == "") {
                            $scope.SaturdayShiftview = $scope.SaturdayShiftview + value.ShiftName;
                        }
                        else {
                            $scope.SaturdayShiftview = $scope.SaturdayShiftview + "," + value.ShiftName;
                        }
                        return $scope.SaturdayShift1.push(value.Shift_Id)
                    }
                })

                //$scope.MondayShift=[2,3];
                $scope.SundayShift = $scope.SundayShift1;
                $scope.MondayShift = $scope.MondayShift1;
                $scope.TuesdayShift = $scope.TuesdayShift1;
                $scope.WednessdayShift = $scope.WednessdayShift1;
                $scope.ThursdayShift = $scope.ThursdayShift1;
                $scope.FridayShift = $scope.FridayShift1;
                $scope.SaturdayShift = $scope.SaturdayShift1;
                $("#chatLoaderPV").hide();

            })
        };

        /* 
        Calling the api method to detele the details of the Doctor shift
        for the Doctor shift Id,
        and redirected to the list page.
        */
        $scope.DeleteDoctorShift = function (comId) {
            $scope.Id = comId;
            $scope.DoctorShift_Delete();
        };
        $scope.DoctorShift_Delete = function () {
            var del = confirm("Do you like to deactivate the selected Doctor Shift?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }
                $http.post(baseUrl + '/api/DoctorShift/DoctorShift_Delete/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.DoctorShiftListGo();
                }).error(function (data) {
                    $scope.error = "AN error has occured while deleting Institution!" + data;
                });
            };
        };

        /*'Active' the Doctor shift */
        $scope.ReInsertDoctorShift = function (comId, DoctorId) {
            $scope.Id = comId;
            $scope.ReInsertDoctorShiftList(DoctorId);
        };

        /* 
        Calling the api method to inactived the details of the Doctor shift
        for the Doctor shift Id,
        and redirected to the list page.
        */
        $scope.ReInsertDoctorShiftList = function (DoctorId) {
            $http.get(baseUrl + '/api/DoctorShift/ActivateDoctorShift_List/?Id=' + $scope.Id
                + '&Institution_Id=' + $window.localStorage['InstitutionId']
                + '&Doctor_Id=' + DoctorId
            ).success(function (data) {
                if (data.returnval == 1) {
                    alert("Activate Doctor Shift is already created, Please check");
                }
                else {
                    var Ins = confirm("Do you like to activate the selected Appoinment Slot?");
                    if (Ins == true) {
                        var obj =
                        {
                            Id: $scope.Id,
                            Modified_By: $window.localStorage['UserId']
                        }
                        $http.post(baseUrl + '/api/DoctorShift/DoctorShift_Active/', obj).success(function (data) {
                            alert(data.Message);
                            $scope.DoctorShiftListGo();
                        }).error(function (data) {
                            $scope.error = "An error has occurred while ReInsertAppoinment Slot" + data;
                        });
                    };
                }
            })
        }
    }
]);

MyCortexControllers.controller("AttendanceDetailsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        //  $scope.InstituteId = $window.localStorage['InstitutionId'];
        //Declaration and initialization of Scope Variables.
        $scope.ShiftName = "";
        $scope.IsActive = true;
        $scope.Id = 0;
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.page_size = 0;
        $scope.ConfigCode = "PAGINATION";
        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            if (data[0] != undefined) {
                $scope.page_size = parseInt(data[0].ConfigValue);
                $window.localStorage['Pagesize'] = $scope.page_size;
            }
        });
        /*List Page Pagination*/
        $scope.listdata = [];
        $scope.current_page = 1;
        $scope.page_size = $window.localStorage['Pagesize'];
        $scope.rembemberCurrentPage = function (p) {
            $scope.current_page = p
        }
        /* on click Add New, Add popup opened*/
        $scope.AddAttendance = function () {
            angular.element('#AttendanceAddModal').modal('show');
        }
        /* on click view, view popup opened*/
        $scope.ViewAttendance = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewAttendanceList();
            angular.element('#ViewAttendanceModal').modal('show');
        }
        /* on click Edit, edit popup opened*/
        $scope.EditAttendance = function (CatId, ActiveFlag, AttendanceToDate) {
            $scope.AttendanceTo_Date = $filter('date')(AttendanceToDate, "dd-MMM-yyyy");
            $scope.Today_Date = $filter('date')(new Date(), 'dd-MMM-yyyy');
            if (ActiveFlag == 1) {
                $scope.ClearAttendancePopUp();
                $scope.Id = CatId;
                $scope.ViewAttendanceList();
                if ($scope.Today_Date <= $scope.AttendanceTo_Date) {
                    angular.element('#AttendanceAddModal').modal('show');
                }
                else {
                    alert("Completed To date  record cannot be edited");
                }
            }
            else {
                alert("Inactive record cannot be edited");
            }
        };

        $scope.CancelSlot = function () {
            angular.element('#AttendanceModal').modal('hide');
        }

        $scope.CancelAttendanceDetails = function () {
            angular.element('#AttendanceAddModal').modal('hide');
        }

        /* User basic details list*/
        /*  $scope.InstituteId=$window.localStorage['InstitutionId'];
          $scope.DoctorList = [];
          $scope.DoctorListActive = [];
      
              $http.get(baseUrl + '/api/Attendance/UserType_List/?Institution_Id=' +$window.localStorage['InstitutionId']).success(function (data) {  
               
                      $scope.UserTypeList =data;   
           
          });*/
        $scope.DoctorList = [];
        $scope.DoctorListActive = [];
        $http.get(baseUrl + '/api/AppoinmentSlot/Doctors_List/?Institution_Id=' + $window.localStorage['InstitutionId']).success(function (data) {
            $scope.UserTypeList = $ff(data, { IsActive: 1 });;
            $scope.UserTypeList = data;
        });

        //$scope.InstituteId=$window.localStorage['InstitutionId'];
        //$scope.Attendance_List = [];
        //$http.get(baseUrl + '/api/Attendance/Attendance_List/?Institution_Id=' +$scope.InstituteId).success(function (data) {        
        //    $scope.Attendance_List =data;
        //});


        $scope.Convert24to12Timeformat = function (inputTime) {
            var outputTime = null;
            if (inputTime != '' && inputTime != null) {
                inputTime = inputTime.toString(); //value to string for splitting
                var splitTime = inputTime.split(':');
                splitTime.splice(2, 1);
                var ampm = (splitTime[0] >= 12 ? ' PM' : ' AM'); //determine AM or PM
                splitTime[0] = splitTime[0] % 12;
                splitTime[0] = (splitTime[0] == 0 ? 12 : splitTime[0]); //adjust for 0 = 12
                outputTime = splitTime.join(':') + ampm;
            }
            return outputTime;
        };
        $scope.Convert12To24Timeformat = function (timeval) {
            var outputTime = null;
            if (timeval != '' && timeval != null) {
                var time = timeval;
                var hours = Number(time.match(/^(\d+)/)[1]);
                var minutes = Number(time.match(/:(\d+)/)[1]);
                var AMPM = time.match(/\s(.*)$/)[1];
                if (AMPM == "PM" && hours < 12) hours = hours + 12;
                if (AMPM == "AM" && hours == 12) hours = hours - 12;
                var sHours = hours.toString();
                var sMinutes = minutes.toString();
                if (hours < 10) sHours = "0" + sHours;
                if (minutes < 10) sMinutes = "0" + sMinutes;
                outputTime = sHours + ":" + sMinutes;
            }
            return outputTime;
        };

        /* Validating the create page mandatory fields
           checking mandatory for the follwing fields
           Doctor Name,From Date,To Date
           and showing alert message when it is null.
           */
        $scope.DoctorAttendance_InsertUpdateValidations = function () {
            var today = moment(new Date()).format('DD-MMM-YYYY');
            $scope.AttendanceFromDate = moment($scope.AttendanceFromDate).format('DD-MMM-YYYY');
            $scope.AttendanceToDate = moment($scope.AttendanceToDate).format('DD-MMM-YYYY');

            if ($scope.SelectedAttendance == "" || $scope.SelectedAttendance == undefined) {
                alert("Please select Doctor");
                return false;
            }

            else if (typeof ($scope.AttendanceFromDate) == "undefined" || $scope.AttendanceFromDate == 0) {
                alert("Please select From Date");
                return false;
            }
            else if (typeof ($scope.AttendanceToDate) == "undefined" || $scope.AttendanceToDate == 0) {
                alert("Please select To Date");
                return false;
            }
            else if ($scope.AttendanceFromDate < today) {
                alert("From Date Can Be Booked Only For Future");
                $scope.AttendanceFromDate = DateFormatEdit($scope.AttendanceFromDate);
                $scope.AttendanceToDate = DateFormatEdit($scope.AttendanceToDate);
                return false;
            }
            else if ($scope.AttendanceToDate < today) {
                alert("To Date Can Be Booked Only For Future");
                $scope.AttendanceFromDate = DateFormatEdit($scope.AttendanceFromDate);
                $scope.AttendanceToDate = DateFormatEdit($scope.AttendanceToDate);
                return false;
            }

            else if (($scope.AttendanceFromDate !== null) && ($scope.AttendanceToDate !== null)) {
                if ((ParseDate($scope.AttendanceToDate) < ParseDate($scope.AttendanceFromDate))) {
                    alert("From Date Should not be greater than To Date");
                    $scope.AttendanceFromDate = DateFormatEdit($scope.AttendanceFromDate);
                    $scope.AttendanceToDate = DateFormatEdit($scope.AttendanceToDate);
                    return false;
                }
            }
            $scope.AttendanceFromDate = DateFormatEdit($scope.AttendanceFromDate);
            $scope.AttendanceToDate = DateFormatEdit($scope.AttendanceToDate);
            return true;
        };
        /*on click Save calling the insert update function for Doctor Holiday
            and check the Doctor Name  already exist between From Date and To Date,if exist it display alert message or its 
            calling the insert update function*/
        $scope.SelectedAttendance = [];
        $scope.DoctorAttendanceDetails = [];
        $scope.AttendanceAddEdit = function () {
            $scope.DoctorAttendanceDetails = [];
            if ($scope.DoctorAttendance_InsertUpdateValidations() == true) {
                $("#chatLoaderPV").show();
                if ($scope.Id == 0) {
                    angular.forEach($scope.SelectedAttendance, function (value, index) {
                        var obj = {
                            Id: $scope.Id,
                            Institution_Id: $window.localStorage['InstitutionId'],
                            AttendanceFromDate: moment($scope.AttendanceFromDate).format('DD-MMM-YYYY'),
                            AttendanceToDate: moment($scope.AttendanceToDate).format('DD-MMM-YYYY'),
                            Doctor_Id: value,
                            Remarks: $scope.Remarks
                        };
                        $scope.DoctorAttendanceDetails.push(obj)
                    });
                }
                else {
                    var obj = {
                        Id: $scope.Id,
                        Institution_Id: $window.localStorage['InstitutionId'],
                        AttendanceFromDate: moment($scope.AttendanceFromDate).format('DD-MMM-YYYY'),
                        AttendanceToDate: moment($scope.AttendanceToDate).format('DD-MMM-YYYY'),
                        Doctor_Id: $scope.EditSelectedAttendance,
                        Remarks: $scope.Remarks
                    };
                    $scope.DoctorAttendanceDetails.push(obj)
                }
                $http.post(baseUrl + '/api/Attendance/AttendanceDetails_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.DoctorAttendanceDetails).success(function (data) {
                    alert(data.Message);
                    $scope.AttendanceList();
                    $scope.ClearAttendancePopUp();
                    $("#chatLoaderPV").hide();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Parameter" + data;
                });
            }
        };

        $scope.searchqueryAttendance = "";
        /* Filter the master list function for Search*/
        $scope.FilterAttendanceList = function () {

            $scope.ResultListFiltered = [];
            var searchstring = angular.lowercase($scope.searchqueryAttendance);
            if (searchstring == "") {
                $scope.rowCollectionAttendanceFilter = [];
                $scope.rowCollectionAttendanceFilter = angular.copy($scope.rowCollectionAttendance);
            }
            else {
                $scope.rowCollectionAttendanceFilter = $ff($scope.rowCollectionAttendance, function (value) {
                    return angular.lowercase(value.DoctorName).match(searchstring) ||
                        angular.lowercase($filter('date')(value.AttendanceFromDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase($filter('date')(value.AttendanceToDate, "dd-MMM-yyyy")).match(searchstring) ||
                        angular.lowercase(value.CreatedByName).match(searchstring) ||
                        angular.lowercase($filter('date')(value.Created_Dt, "dd-MMM-yyyy hh:mm:ss a")).match(searchstring);

                });
            }
        }
        /*THIS IS FOR LIST FUNCTION*/

        $scope.AttendanceList = function () {
            $("#chatLoaderPV").show();
            $scope.emptydataAttendance = [];
            $scope.rowCollectionAttendance = [];

            $scope.ISact = 1;       // default active
            if ($scope.IsActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.IsActive == false) {
                $scope.ISact = -1 //all
            }

            $http.get(baseUrl + '/api/Attendance/Attendance_List/?Id=0' + '&IsActive=' + $scope.ISact + '&Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId
            ).success(function (data) {
                $scope.emptydataAttendance = [];
                $scope.rowCollectionAttendance = [];
                $scope.rowCollectionAttendance = data;
                $scope.rowCollectionAttendanceFilter = angular.copy($scope.rowCollectionAttendance);
                if ($scope.rowCollectionAttendanceFilter.length > 0) {
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

        /*THIS IS FOR View FUNCTION*/
        $scope.Edit_SelectedDoctor = [];
        $scope.Edit_SelectedDoctorList = [];
        $scope.ViewAttendanceList = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/Attendance/Attendance_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.DuplicatesId = data.Id;
                $scope.Doctor_Id = data.Doctor_Id.toString();
                $scope.DoctorName = data.DoctorName;
                var ATT_FROM = moment(data.AttendanceFromDate).format('DD-MMM-YYYY');
                $scope.AttendanceFromDate = DateFormatEdit(ATT_FROM);
                var ATT_TO = moment(data.AttendanceToDate).format('DD-MMM-YYYY');
                $scope.AttendanceToDate = DateFormatEdit(ATT_TO);
                $scope.Edit_SelectedDoctor.push(data.Doctor_Id);
                $scope.EditSelectedAttendance = data.Doctor_Id.toString();
                $scope.SelectedAttendance = $scope.Edit_SelectedDoctor;
                $scope.Remarks = data.Remarks;
                $("#chatLoaderPV").hide();
            });
        };

        $scope.ClearAttendancePopUp = function () {
            $scope.Id = 0;
            $scope.InstituteId = "";
            $scope.Remarks = "";
            $scope.SelectedAttendance = [];
            $scope.AttendanceFromDate = "";
            $scope.AttendanceToDate = "";
            $scope.CancelAttendancePopUp();
        }
        /* THIS IS FUNCTION FOR CLOSE Modal Window  */
        $scope.CancelAttendancePopUp = function () {
            angular.element('#AttendanceAddModal').modal('hide');
            angular.element('#ViewAttendanceModal').modal('hide');
        };
        /*InActive the Doctor Holiday*/
        $scope.DeleteAttendance = function (comId) {
            $scope.Id = comId;
            $scope.Attendance_InActive();
        };
        /* 
        Calling the api method to inactived the details of the  Holiday 
        for the  Doctor ,
        and redirected to the list page.
        */
        $scope.Attendance_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Holiday?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/Attendance/Attendance_InActive/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.AttendanceList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Holiday" + data;
                });
            };
        };

        /*Active the Doctor Holiday*/
        $scope.ReInsertAttendance = function (comId) {
            $scope.Id = comId;
            $scope.Attendance_Active();
        };
        /* 
       Calling the api method to Actived the details of the  Holiday 
       for the  Doctor ,
       and redirected to the list page.
       */
        $scope.Attendance_Active = function () {
            var Ins = confirm("Do you like to activate the selected  Holiday?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/Attendance/Attendance_Active/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.AttendanceList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Holiday" + data;
                });
            };
        }

        $scope.ErrorFunction = function () {
            alert("Inactive record cannot be edited");
        }

    }

]);

MyCortexControllers.controller("WebConfigurationController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        $scope.IsActive = true;
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.Config_value = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.IsEdit = false;
        $scope.WebConfigEdit = function () {
            $scope.IsEdit = true;
        }

        $scope.WebConfigCancel = function () {
            $scope.WebConfigurationList();
            $scope.IsEdit = false;
        }

        $scope.searchqueryWebConfiguration = "";
        /* Filter the master list function for Search*/
        $scope.FilterWebConfigurationList = function () {
            var searchstring = angular.lowercase($scope.searchqueryWebConfiguration);
            if ($scope.searchqueryWebConfiguration == "") {
                $scope.rowCollectionWebConfiguration = angular.copy($scope.rowCollectionWebConfigurationFilter);
            }
            else {
                $scope.rowCollectionWebConfiguration = $ff($scope.rowCollectionWebConfigurationFilter, function (value, index) {
                    return angular.lowercase(value.CONFIGCODE).match(searchstring)
                });
            }
        };

        /* on click Add New, Add popup opened*/
        $scope.AddWebConfiguration = function () {
            angular.element('#WebConfigurationAddModal').modal('show');
        }

        $scope.CancelWebConfigurationDetails = function () {
            angular.element('#WebConfigurationAddModal').modal('hide');
        }

        $scope.ClearWebConfigurationPopUp = function () {
            $scope.Id = 0;
            $scope.Institution_Id = "";
            $scope.Remarks = "";
            $scope.Config_Code = "";
            $scope.Config_Name = "";
            $scope.Config_Value = "";
            $scope.Config_Type = "";
            $scope.CancelWebConfigurationPopUp();
        }

        /*THIS IS FOR LIST FUNCTION*/
        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.WebConfigurationList = function () {
            $("#chatLoaderPV").show();
            $scope.emptydataWebConfiguration = [];
            $scope.rowCollectionWebConfiguration = [];

            $scope.ISact = 1;       // default active
            if ($scope.IsActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.IsActive == false) {
                $scope.ISact = 0 //all
            }

            $http.get(baseUrl + '/api/WebConfiguration/WebConfiguration_List/?IsActive=' + $scope.ISact + '&Institution_Id=' + $window.localStorage['InstitutionId']
            ).success(function (data) {
                $scope.emptydataWebConfiguration = [];
                $scope.rowCollectionWebConfiguration = [];
                $scope.rowCollectionWebConfiguration = data;
                $scope.rowCollectionWebConfigurationFilter = angular.copy($scope.rowCollectionWebConfiguration);
                if ($scope.rowCollectionWebConfigurationFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                $("#chatLoaderPV").hide();
                angular.forEach($scope.rowCollectionWebConfiguration, function (masterVal, masterInd) {
                    $scope.Config_value[masterVal.ID] = masterVal.CONFIGVALUE;
                });
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            })
        };

        /* on click view, view popup opened*/
        $scope.ViewWebConfiguration = function (CatId) {
            $scope.Id = CatId;
            $scope.ViewWebConfigurationList();
            angular.element('#ViewWebConfigurationModal').modal('show');
        }

        $scope.ViewWebConfigurationList = function () {
            $("#chatLoaderPV").show();
            if ($routeParams.Id != undefined && $routeParams.Id > 0) {
                $scope.Id = $routeParams.Id;
                $scope.DuplicatesId = $routeParams.Id;
            }
            $http.get(baseUrl + '/api/WebConfiguration/WebConfiguration_View/?Id=' + $scope.Id + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                $scope.DuplicatesId = data.ID;
                $scope.Institution_Id = data.INSTITUTION_ID.toString();
                $scope.Config_Code = data.CONFIGCODE;
                $scope.Config_Name = data.CONFIGINFO;
                $scope.Config_Value = data.CONFIGVALUE;
                $scope.Config_Type = data.CONFIG_TYPEDEFINITION;
                $scope.Remarks = data.REMARKS;
                $("#chatLoaderPV").hide();
            });
        };

        /* THIS IS FUNCTION FOR CLOSE Modal Window  */
        $scope.CancelWebConfigurationPopUp = function () {
            angular.element('#WebConfigurationAddModal').modal('hide');
            angular.element('#ViewWebConfigurationModal').modal('hide');
        };

        $scope.WebConfigurationDetails = [];
        $scope.WebConfigurationAddEdit = function () {
            $("#chatLoaderPV").show();
            $scope.WebConfigurationDetails = [];
            var obj = {
                ID: $scope.Id,
                INSTITUTION_ID: $window.localStorage['InstitutionId'],
                CONFIGCODE: $scope.Config_Code,
                CONFIGINFO: $scope.Config_Name,
                CONFIGVALUE: $scope.Config_Value,
                CONFIG_TYPEDEFINITION: $scope.Config_Type,
                REMARKS: $scope.Remarks
            };
            $scope.WebConfigurationDetails.push(obj)
            $http.post(baseUrl + '/api/WebConfiguration/WebConfiguration_InsertUpdate/?Login_Session_Id=' + $scope.LoginSessionId, $scope.WebConfigurationDetails).success(function (data) {
                alert(data.Message);
                $scope.WebConfigurationList();
                $scope.ClearWebConfigurationPopUp();
                $scope.searchqueryWebConfiguration = "";
                $("#chatLoaderPV").hide();
            }).error(function (data) {
                $scope.error = "An error has occurred while deleting Parameter" + data;
            });

        };

        $scope.WebConfigurationDetails = [];
        $scope.Configuration_AddEdit = function () {
            $("#chatLoaderPV").show();
            angular.forEach($scope.rowCollectionWebConfiguration, function (value, index) {
                var obj = {
                    Id: value.ID,
                    INSTITUTION_ID: $scope.INSTITUTION_ID,
                    CONFIGVALUE: $scope.Config_value[value.ID] == 0 ? null : $scope.Config_value[value.ID],
                }
                $scope.WebConfigurationDetails.push(obj);
            });

            $http.post(baseUrl + '/api/WebConfiguration/Configuration_AddEdit/', $scope.WebConfigurationDetails).success(function (data) {
                $("#chatLoaderPV").hide();
                alert("Configuration Data saved successfully");
                $scope.WebConfigurationDetails = [];
                $scope.Config_value = [];
                $scope.searchqueryWebConfiguration = "";
                $scope.WebConfigurationList();
                $scope.IsEdit = false;
                //$location.path("/ParameterSettings");
            });

        };

        /* on click Edit, edit popup opened*/
        $scope.EditWebConfiguration = function (CatId, ActiveFlag) {
            if (ActiveFlag == 1) {
                $scope.ClearWebConfigurationPopUp();
                $scope.Id = CatId;
                $scope.ViewWebConfigurationList();
                angular.element('#WebConfigurationAddModal').modal('show');
            }
            else {
                alert("Inactive record cannot be edited");
            }
        };

        /*InActive the WebConfiguration*/
        $scope.DeleteWebConfiguration = function (comId) {
            $scope.Id = comId;
            $scope.WebConfiguration_InActive();
        };
        /*
        Calling the api method to inactived the details of the  WebConfiguration ,
            and redirected to the list page.
            */
        $scope.WebConfiguration_InActive = function () {
            var del = confirm("Do you like to deactivate the selected Web Configuration?");
            if (del == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/WebConfiguration/WebConfiguration_InActive/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.WebConfigurationList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while deleting Holiday" + data;
                });
            };
        };

        /*Active the Doctor Holiday*/
        $scope.ReInsertWebConfiguration = function (comId) {
            $scope.Id = comId;
            $scope.WebConfiguration_Active();
        };
        /* 
       Calling the api method to Actived the details of the  WebConfiguration,
       and redirected to the list page.
       */
        $scope.WebConfiguration_Active = function () {
            var Ins = confirm("Do you like to activate the selected  Web Configuration?");
            if (Ins == true) {
                var obj =
                {
                    Id: $scope.Id,
                    Modified_By: $window.localStorage['UserId']
                }

                $http.post(baseUrl + '/api/WebConfiguration/WebConfiguration_Active/', obj).success(function (data) {
                    alert(data.Message);
                    $scope.WebConfigurationList();
                }).error(function (data) {
                    $scope.error = "An error has occurred while Activating WebConfiguration" + data;
                });
            };
        }
    }
]);

MyCortexControllers.controller("LanguageSettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff) {
        $scope.IsActive = true;
        $scope.Id = 0;
        $scope.User_Id = 0;
        $scope.LanguageText = [];
        $scope.InstitutionLanguageList = [];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];

        $scope.LanguageList = function () {
            $http.get(baseUrl + '/api/Common/getInstitutionLanguages/?Institution_Id=' + $window.localStorage['InstitutionId']
            ).success(function (data) {
                $scope.InstitutionLanguageList = [];
                $scope.InstitutionLanguageList = data;
                $scope.selectedLanguage = data[0].DefaultLanguageId.toString();
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
            });
        };

        $scope.IsEdit = false;
        $scope.LanguageSettingsEdit = function () {
            $scope.IsEdit = true;
        }

        $scope.LanguageSettingsCancel = function () {
            $scope.LanguageSettingsList();
            $scope.IsEdit = false;
        }

        $scope.searchqueryLanguageSettings = "";
        /* Filter the master list function for Search*/
        $scope.FilterLanguageSettingsList = function () {
            var data = $scope.rowCollectionLanguageSettingsFilter.filter(item => item.LANGUAGE_ID === parseInt($scope.selectedLanguage));

            var searchstring = angular.lowercase($scope.searchqueryLanguageSettings);
            if ($scope.searchqueryLanguageSettings == "") {
                $scope.rowCollectionLanguageSettings = angular.copy(data);
            }
            else {
                $scope.rowCollectionLanguageSettings = $ff(data, function (value, index) {
                    return angular.lowercase(value.LANGUAGE_KEY).match(searchstring)
                });
            }
            angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                $scope.LanguageText[masterVal.ID] = masterVal.LANGUAGE_TEXT;
            });
        };

        /*THIS IS FOR LIST FUNCTION*/
        $scope.ViewParamList = [];
        $scope.ViewParamList1 = [];
        $scope.LanguageSettingsList = function () {
            $("#chatLoaderPV").show();
            $scope.LanguageList();

            $scope.emptydataLanguageSettings = [];
            $scope.rowCollectionLanguageSettings = [];
            
            $scope.ISact = 1;       // default active
            if ($scope.IsActive == true) {
                $scope.ISact = 1  //active
            }
            else if ($scope.IsActive == false) {
                $scope.ISact = 0 //all
            }
            
            $http.get(baseUrl + '/api/LanguageSettings/LanguageSettings_List/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Login_Session_Id=' + $scope.LoginSessionId
            ).success(function (data) {
                
                $scope.emptydataLanguageSettings = [];
                $scope.rowCollectionLanguageSettings = [];
                $scope.rowCollectionLanguageSettingsFilter = angular.copy(data);
                $scope.rowCollectionLanguageSettings = data.filter(item => item.LANGUAGE_ID === parseInt($scope.selectedLanguage));
                if ($scope.rowCollectionLanguageSettingsFilter.length > 0) {
                    $scope.flag = 1;
                }
                else {
                    $scope.flag = 0;
                }
                angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                    $scope.LanguageText[masterVal.ID] = masterVal.LANGUAGE_TEXT;
                });
                $("#chatLoaderPV").hide();
            }).error(function (data) {
                $scope.error = "AN error has occured while Listing the records!" + data;
                $("#chatLoaderPV").hide();
            })
        };

        $scope.LanguageSettingsDetails = [];
        $scope.LanguageSettings_AddEdit = function () {
            $("#chatLoaderPV").show();
            angular.forEach($scope.rowCollectionLanguageSettings, function (value, index) {
                var obj = {
                    ID: value.ID,
                    INSTITUTION_ID: $window.localStorage['InstitutionId'],
                    LANGUAGE_TEXT: $scope.LanguateText[value.ID],
                }
                $scope.LanguageSettingsDetails.push(obj);
            });

            $http.post(baseUrl + '/api/LanguageSettings/LanguageSettings_AddEdit/', $scope.LanguageSettingsDetails).success(function (data) {
                $scope.LanguageSettingsDetails = [];
                $scope.LanguageText = [];
                $scope.searchqueryLanguageSettings = "";
                $scope.LanguageSettingsList();
                $("#chatLoaderPV").hide();
                alert("LanguageSettings Data saved successfully");
                $scope.IsEdit = false;
            });

        };

        $scope.LanguageDefaultSave = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/LanguageSettings/LanguageDefault_Save/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Language_Id=' + $scope.selectedLanguage
            ).success(function (data) {
                if (data == 1) {
                    $scope.LanguageList();
                    $("#chatLoaderPV").hide();
                    alert("Saved successfully.");
                }
                else {
                    $("#chatLoaderPV").hide();
                    alert("Error occurred.");
                }
            })
        }
    }
]);

angular.module("angular-bootstrap-select", [])
    .directive("selectpicker",
        [
            "$parse", "$timeout",
            function ($parse, $timeout) {
                return {
                    restrict: "A",
                    require: ["?ngModel", "?collectionName"],
                    compile: function (tElement, tAttrs, transclude) {
                        //tElement.selectpicker();

                        if (angular.isUndefined(tAttrs.ngModel)) {
                            throw new Error("Please add ng-model attribute!");
                        } else if (angular.isUndefined(tAttrs.collectionName)) {
                            throw new Error("Please add data-collection-name attribute!");
                        }

                        return function (scope, element, attrs, ngModel) {
                            if (angular.isUndefined(ngModel)) {
                                return;
                            }
                            function refresh(newVal) {
                                scope.$applyAsync(function () {
                                    if (attrs.ngOptions && /track by/.test(attrs.ngOptions)) element.val(newVal);
                                    element.selectpicker('refresh');
                                });
                            }
                            attrs.$observe('spTheme', function (val) {
                                $timeout(function () {
                                    element.data('selectpicker').$button.removeClass(function (i, c) {
                                        return (c.match(/(^|\s)?btn-\S+/g) || []).join(' ');
                                    });
                                    element.selectpicker('setStyle', val);
                                });
                            });

                            scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                                if (newVal !== oldVal) {
                                    $timeout(function () {
                                        element.selectpicker("val", element.val());
                                    });
                                }
                            });

                            scope.$watch(attrs.collectionName, function (newVal, oldVal) {
                                $timeout(function () {
                                    element.selectpicker("refresh");
                                });
                            });

                            $timeout(function () {
                                element.selectpicker($parse(attrs.selectpicker)());
                                element.selectpicker('refresh');
                            });

                            if (attrs.ngModel) {
                                scope.$watch(attrs.ngModel, refresh, true);
                            }

                            if (attrs.ngDisabled) {
                                scope.$watch(attrs.ngDisabled, refresh, true);
                            }

                            scope.$on('$destroy', function () {
                                $timeout(function () {
                                    element.selectpicker('destroy');
                                });
                            });
                            ngModel.$render = function () {
                                element.selectpicker("val", ngModel.$viewValue || "");
                            };

                            ngModel.$viewValue = element.val();
                        };
                    }
                }
            }
        ]
    );