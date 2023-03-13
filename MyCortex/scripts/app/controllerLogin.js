var EmpApp = angular.module('AllyController', [
    'ngRoute',
    'AllyControllersLogin',
    'toastr'    
]);

EmpApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, $location) {
    var baseUrl = $("base").first().attr("href");
    $locationProvider.hashPrefix('');
    //$locationProvider.html5Mode(true).hashPrefix('*');
   // $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('!');
    
    $routeProvider.
        //when('/', {
        //    templateUrl: baseUrl + 'Login/Views/Login.html',
        //    controller: 'LoginController'
        //}).
        when('/login', {
            templateUrl: baseUrl + 'Login/Views/Login.html',
            controller: 'LoginController'
        }).
        when('/signup/:InstitutionCode', {
            templateUrl: baseUrl + 'Login/Views/Signup.html',
            controller: 'SignupController'
        }).
        when('/ChangePassword/:no/:Id/:str/:pwd', {
            templateUrl: baseUrl + 'Login/Views/ChangePassword.html',
            controller: 'PasswordController'
        }).
        otherwise({
            redirectTo: '/login'
        });  
}]);

EmpApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});
EmpApp.directive('fileModel', ['$parse', function ($parse) {
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
EmpApp.directive("fileread", [
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
                    if (changeEvent.target.files.length !== 0) {
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    }
                });
            }
        }
    }
]);

EmpApp.directive('uploadFile', ['$parse', function ($parse) {
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
EmpApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
            .then(function () {
            }, function errorCallback() {
            });
            //.error(function () {
            //});
    }
}]);

var MyCortexControllers = angular.module("AllyControllersLogin", []);
var baseUrl = $("base").first().attr("href");
console.log(baseUrl);
if (baseUrl == "/") {
    baseUrl = "";
}




MyCortexControllers.run(['$rootScope', '$window',
    function ($rootScope, $window) {
        $rootScope.user = {};
        $window.onload = function () {
            if (!localStorage.justOnce) {
                localStorage.setItem("justOnce", "true");
                window.location.reload();
                console.log('page reloaded');
            }
        };

        jQuery.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=FB_CONFIG&Institution_Id=-1')
            .done(function (data) {
                var jsonobj = jQuery.parseJSON(data[0].ConfigValue);
                $window.fbAsyncInit = function () {
                    console.log('FB API called');
                    FB.init({
                        //appId: '907938093354960',
                        //appId: '114164749908714',
                        appId: jsonobj.appId,
                        channelUrl: jsonobj.channelUrl,
                        status: jsonobj.status,
                        cookie: jsonobj.cookie,
                        xfbml: jsonobj.xfbml,
                        version: jsonobj.version
                    });
                    console.log('sync it function is over');
                };

            });


        (function (d) {
            var js,
                id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
                return;
            }

            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            ref.parentNode.insertBefore(js, ref);

        }(document));
    }]);

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
MyCortexControllers.service('browser', ['$window', function ($window) {
    return function () {
        var userAgent = $window.navigator.userAgent;
        var browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };

        for (var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };
        return 'unknown';
    }
}]);
/* THIS IS FOR LOGIN CONTROLLER FUNCTION */
MyCortexControllers.controller("LoginController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService, toastr) {
        //Declaration and initialization of Scope Variables.  
        $scope.Id = "0";
        $scope.FirstName = "";
        $scope.MiddleName = "";
        $scope.LastName = "";
        $scope.MNR_No = "";
        $scope.PatientNo = "";
        $scope.NationalId = "";
        $scope.UID = "";
        $scope.InsuranceId = "";
        $scope.GenderId = "0";
        $scope.NationalityId = "0";
        $scope.MaritalStatusId = "0";
        $scope.EthnicGroupId = "0";
        $scope.BloodGroupId = "0";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.UserTypeId = 2;
        $scope.NationalityList = [];
        $scope.MaritalStatusList = [];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];

        $scope.GenderList = [];
        $scope.ProductName = "";
        $scope.Productlogin = "";
        $window.localStorage['UserId'] = "0";
        $scope.ProductName1 = "";

        // for Remember Me
        $scope.Username = ($rememberMeService('dXNlcm5hbWVocm1z'));
        $scope.Password = ($rememberMeService('cGFzc3dvcmRocm1z'));
        $scope.remember = ($rememberMeService('cmVtZW1iZXJocm1z'));
        // end
        $scope.usernamekeypress = "";
        //Only '. special characters & numbers  // special characters & characters not allowed.(Candidate Name.)
        $scope.usernamekeypress = function (e) {
            var charCode = e.charCode || e.keyCode || e.which;
            if ((charCode >= 33 && charCode <= 39) || (charCode >= 40 && charCode <= 45) || (charCode >= 47 && charCode <= 43) || (charCode >= 58 && charCode <= 63) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) {
                toastr.warning("Special characters are not allowed except @ and dot.", "warning");
                //swal.fire("Numbers & Special characters are not allowed.");
                if (e.preventDefault) {
                    e.preventDefault();
                } else if (typeof e.returnValue !== "undefined") {
                    e.returnValue = false;
                }
            }
        }
        $scope.forgotPasswordEmail = "";
        $scope.forgotPasswordValidate = function () {
            $("#chatLoaderPV").show();
            if (typeof ($scope.forgotPasswordEmail) == "undefined" || $scope.forgotPasswordEmail == "") {
                //alert("Please enter Email");
                toastr.warning("Please enter Email", "warning");
                return false;
            }

            else if (EmailFormate($scope.forgotPasswordEmail) == false) {
                //alert("Invalid Email format");
                toastr.info("Invalid Email format", "info");
                return false;
            }
            $http.get(baseUrl + '/api/Login/ForgotPassword/?EmailId=' + $scope.forgotPasswordEmail).then(function (response) {
                if (response != null) {
                    //alert(data.Message)
                    if (response.data.ReturnFlag == "1") {
                        toastr.success(response.data.Message, "success");
                        $("#chatLoaderPV").hide();
                        angular.element('#forgotPasswordModal').modal('hide');
                        $scope.forgotPasswordEmail = "";
                    }
                    else if (response.data.ReturnFlag == "0") {
                        toastr.info(response.data.Message, "info");
                    }
                }
                else {
                    //alert("This Email is not registered, Invalid Email")
                    toastr.info("This Email is not registered, Invalid Email", "info");
                }
            }, function errorCallback(response) {
                //alert("This Email is not registered, Invalid Email")
                toastr.info("This Email is not registered, Invalid Email", "info");
                $scope.error = "An error has occurred while deleting reset password details" + response.data;
            });
            //    .error(function (response) {
            //    //alert("This Email is not registered, Invalid Email")
            //    toastr.info("This Email is not registered, Invalid Email", "info");
            //    $scope.error = "An error has occurred while deleting reset password details" + response;
            //});
        }



        /*This is th eValidation for sign Up page 
        The validations are FirstName,Last Name,MRN No,Gender,Nationality,DOB,Email and Mobile No.*/
        $scope.SignupLogin_AddEdit_Validations = function () {
            if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                alert("Please enter First Name");
                return false;
            }
            else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                alert("Please enter Last Name");
                return false;
            }
            else if (typeof ($scope.MNR_No) == "undefined" || $scope.MNR_No == "") {
                alert("Please enter MRN No.");
                return false;
            }
            else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                alert("Please select Sex");
                return false;
            }
            else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                alert("Please select Nationality");
                return false;
            }
            else if (typeof ($scope.MaritalStatusId) == "undefined" || $scope.MaritalStatusId == "0") {
                alert("Please select MaritalStatus");
                return false;
            }
            else if (typeof ($scope.EthnicGroupId) == "undefined" || $scope.EthnicGroupId == "0") {
                alert("Please select EthnicGroup", "warning");
                return false;
            }
            else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
                alert("Please select Date of Birth");
                return false;
            }
            else if (typeof ($scope.BloodGroupId) == "undefined" || $scope.BloodGroupId == "0") {
                alert("Please select BloodGroup");
                return false;
            }
            //else if (isDate($scope.DOB) == false) {
            //    alert("Date of Birth is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                alert("Please enter Email");
                return false;
            }
            else if (EmailFormate($scope.EmailId) == false) {
                //alert("Invalid Email format");
                toastr.warning("Invalid Email format", "warning");
                return false;
            }
            else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                alert("Please enter Mobile No.");
                return false;
            }
            return true;
        };
        $http.get(baseUrl + '/api/Login/GetProduct_Details/').then(function (response) {
            $scope.ProductName1 = response.data[0].ProductName;
            var chk = $window.localStorage['inactivity_logout'];
            if (chk === '1') {
                $scope.errorlist = 'Your session has expired, please provide your credentials to login again.';
                $window.localStorage['inactivity_logout'] = '0';
            }
            if ($scope.ProductName1 == 'MyCortex') {
                $scope.Productlogin = 0;
                //$scope.Id1 = 'Emirates ID';
                //$scope.Id2 = 'UID';
            } else if ($scope.ProductName1 == 'MyHealth') {
                $scope.Productlogin = 1;
                //$scope.Id1 = 'Emirates ID';
                //$scope.Id2 = 'UID';
            } else {
                $scope.Productlogin = 2;
                //$scope.Id1 = 'Identification Number 1';
                //$scope.Id2 = 'Identification Number 2';
            }

            if ($scope.Productlogin == '1') {
                document.getElementById('LoginSection').className = "loginBgHel";
            }
            else if ($scope.Productlogin == '0') {
                document.getElementById('LoginSection').className = "loginBgCor";
            } else {
                document.getElementById('LoginSection').className = "loginBgHiv";
            }
        }, function errorCallback(response) { 
        });
        $http.get(baseUrl + '/api/Login/GetProduct_Details/').then(function (response) {
            $scope.PrdImg = response.data[0].ProductImg;
            $scope.PrdDefaultLogo = response.data[0].ProductDefaultlogo;
            $scope.prdtname = response.data[0].ProductName;
        }, function errorCallback(response) { 
        });
        $http.get(baseUrl + '/api/Login/getProductName/').then(function (response) {
            var ProductName = response.data["instanceId"];
            $('#productname').val(ProductName);
            if ($('#productname').val() == "0") {
                $scope.prdName = "MyHealth";
                $scope.prductName = " MyHealth?";
            } else if ($('#productname').val() == "2") {
                $scope.prdName = "STC MyCortex";
                $scope.prductName = " STC MyCortex?";
            } else {
                $scope.prdName = "MyCortex  ";
                $scope.prductName = " MyCortex?";
            }
        }, function errorCallback(response) { 
        });



        /*This is Insert Function for SignUp */
        $scope.SignupLogin_AddEdit = function () {
            if ($scope.SignupLogin_AddEdit_Validations() == true) {
                // window.location.href = baseUrl + "/Home/Index#;
                $("#chatLoaderPV").show();
                var tokendata = "UserName=admin&Password=admin&grant_type=password"
                $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.data.access_token;

                    var data = {
                        Id: $scope.Id,
                        FirstName: $scope.FirstName,
                        MiddleName: $scope.MiddleName,
                        LastName: $scope.LastName,
                        NATIONALID: $scope.NationalId,
                        UID: $scope.UID,
                        INSURANCEID: $scope.InsuranceId,
                        MNR_NO: $scope.MNR_No,
                        GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                        NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                        MARITALSTATUS_ID: $scope.MaritalStatusId == 0 ? null : $scope.MaritalStatusId,
                        ETHINICGROUP_ID: $scope.EthnicGroupId == 0 ? null : $scope.EthnicGroupId,
                        DOB: moment($scope.DOB).format('DD-MMM-YYYY'),
                        BLOODGROUP_ID: $scope.BloodGroupId == 0 ? null : $scope.BloodGroupId,
                        EMAILID: $scope.EmailId,
                        MOBILE_NO: $scope.MobileNo,
                        UserType_Id: $scope.UserTypeId,
                        ApprovalFlag: 0,
                        //, INSTITUTION_ID: 1
                    }
                    var config = {
                        headers: {
                            'Authorization': 'Bearer ' + $window.localStorage['dFhNCjOpdzPNNHxx54e+0w==']
                        }
                    };
                    //$http({
                    //    method: 'POST',
                    //    url: baseUrl + 'api/User/User_InsertUpdate/',
                    //    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] },
                    //    data: data
                    //}).success(function (data) {
                    $http.post(baseUrl + 'api/User/User_InsertUpdate?Login_Session_Id={00000000-0000-0000-0000-000000000000}', data, config).then(function (response) {
                        //alert(data.Message);
                        toastr.info(response.data.Message, "info");
                        $scope.CancelSignUpPopup();
                        if ($scope.MenuTypeId == 3) {
                            $scope.ListRedirect();
                        }
                    }, function errorCallback(response) {
                    });
                    $("#chatLoaderPV").hide();
                }, function errorCallback(err) {
                    //console.log(err);
                    toastr.warning(err, "warning");
                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                    //alert('error');
                    toastr.info("error", "info");
                });
                //    .error(function (err) {
                //    //console.log(err);
                //    toastr.warning(err, "warning");
                //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                //    //alert('error');
                //    toastr.info("error", "info");
                //});
            }
        };
        //This is for Clear the values
        $scope.CancelSignUpPopup = function () {
            $scope.FirstName = "";
            $scope.MiddleName = "";
            $scope.LastName = "";
            $scope.MNR_No = "";
            $scope.PatientNo = "";
            $scope.NationalId = "";
            $scope.UID = "";
            $scope.InsuranceId = "";
            $scope.GenderId = "0";
            $scope.NationalityId = "0";
            $scope.MaritalStatusId = "0";
            $scope.EthnicGroupId = "0";
            $scope.BloodGroupId = "0";
            $scope.EmailId = "";
            $scope.MobileNo = "";
            $scope.HideSignUpModal();
        }

        $('#signupModal').on('show.bs.modal', function () {
            if ($scope.NationalityList.length == 0) {
                // This is for to get Nationality List 
                $http.get(baseUrl + 'api/Common/NationalityList/').then(function (response) {
                    $scope.NationalityList = response;
                }, function errorCallback(response) { 
                });
            }
            if ($scope.MaritalStatusList.length == 0) {
                $http.get(baseUrl + 'api/Common/MaritalStatusList/').then(function (response) {
                    $scope.MaritalStatusList = response;
                }, function errorCallback(response) { 
                });
            }
            if ($scope.EthnicGroupList == 0) {
                $http.get(baseUrl + '/api/Common/EthnicGroupList/').then(function (response) {
                    $scope.EthnicGroupList = response;
                }, function errorCallback(response) { 
                });
            }
            if ($scope.BloodGroupList == 0) {
                $http.get(baseUrl + '/api/Common/BloodGroupList/').then(function (response) {
                    $scope.BloodGroupList = response;
                }, function errorCallback(response) { 
                });
            }
            if ($scope.GenderList.length == 0) {
                // This is for to get Gender List
                $http.get(baseUrl + 'api/Common/GenderList/').then(function (response) {
                    $scope.GenderList = response;
                }, function errorCallback(response) { 
                });
            }
        });

        //This function is hide the Sign up Popup Modal
        $scope.HideSignUpModal = function () {
            angular.element('#signupModal').modal('hide')
        };

        //This function is hide the forgot Password Popup Modal
        $scope.showForgotPasswprd = function () {
            angular.element('#forgotPasswordModal').modal('hide')
        };

        //This function is hide the forgot Password Popup Modal
        $scope.HideForgotPasswprd = function () {
            angular.element('#forgotPasswordModal').modal('hide')
        };

        $scope.Validationcontrols = function () {
            $scope.errorlist = null;

            if (typeof ($scope.Username) == "undefined" || $scope.Username == "" || $scope.Username == null) {
                $scope.errorlist = "Please enter Email";
                $("#chatLoaderPV").hide();
                $("#chatLoaderPV1").hide();
                return false;
            }
            else if (typeof ($scope.Password) == "undefined" || $scope.Password == "" || $scope.Password == null) {
                $scope.errorlist = "Please enter Password";
                $("#chatLoaderPV").hide();
                $("#chatLoaderPV1").hide();
                return false;
            }
            return true;
        };

        //function getOS() {
        //    var userAgent = window.navigator.userAgent,
        //        platform = window.navigator.platform,
        //        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        //        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        //        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        //        os = null;

        //    if (macosPlatforms.indexOf(platform) !== -1) {
        //        os = 'Mac OS';
        //    } else if (iosPlatforms.indexOf(platform) !== -1) {
        //        os = 'iOS';
        //    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        //        os = 'Windows';
        //    } else if (/Android/.test(userAgent)) {
        //        os = 'Android';
        //    } else if (!os && /Linux/.test(platform)) {
        //        os = 'Linux';
        //    }

        //    return os;
        //}

        //alert(getOS());

        var IpAddress = "";
        //$http.get("http://api.ipify.org/?format=json").then(function (response) {
        //    IpAddress = response.data.ip;
        //});

        var Login_Country = "";
        var Login_City = "";
        var Login_CountryCode = "";
        var Login_Longitude = "";
        var Login_Latitude = "";
        var Login_region = "";
        var Login_regionName = "";
        var Login_timeZoneName = "";
        var Login_zipCode = "";
        //$http.get("http://ip-api.com/json").then(function (response) {
        //$http.get("https://ipapi.co/json/").then(function (response) {
        //    //Login_Country = response.data.country;
        //    //Login_City = response.data.city;
        //    //IpAddress = response.data.query;
        //    //Login_CountryCode = response.data.countryCode;
        //    //Login_Latitude = response.data.lat;
        //    //Login_Longitude = response.data.lon;
        //    //Login_region = response.data.region;
        //    //Login_regionName = response.data.regionName;
        //    //Login_timeZoneName = response.data.timezone;
        //    //Login_zipCode = response.data.zip;
        //    Login_Country = response.data.country_name;
        //    Login_City = response.data.city;
        //    IpAddress = response.data.ip;
        //    Login_CountryCode = response.data.country_code;
        //    Login_Latitude = response.data.latitude;
        //    Login_Longitude = response.data.longitude;
        //    Login_region = response.data.region_code;
        //    Login_regionName = response.data.region;
        //    Login_timeZoneName = response.data.timezone;
        //    Login_zipCode = response.data.postal;
        //});

        navigator.sayswho = (function () {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
        //LoginController js
        $scope.UserLogin_AddEdit = function () {
            if ($scope.isExpired) {
                return false;
            }
            var isMYH = false;
            //$scope.ProductName1 = 'MyHealth';
            //if ($scope.ProductName1 == 'MyHealth') {
            //    isMYH = true;
            //}
            if ($scope.ProductName1 == 'Hive') {
                $("#chatLoaderPV1").show();
            } else {
                $("#chatLoaderPV").show();
            }
            var offsetTime = new Date().getTimezoneOffset();

            $scope.errorlist = "";
            $http.get(baseUrl + '/api/Login/CheckDBConnection/').then(function (response) {
                if (response.data == false) {
                    $scope.errorlist = "Invalid DB Connection";
                    return;
                }
            }, function errorCallback(response) { 
            });

            if ($scope.Validationcontrols() == true) {
                $scope.Password = $scope.Password.replace(/(#|&)/g, "amp");
                var obj = {
                    UserName: $scope.Username,
                    Password: $scope.Password,
                    DeviceType: "Web",
                    LoginType: "1",
                    Sys_TimeDifference: offsetTime,
                    Browser_Version: navigator.sayswho,
                    Login_Country: Login_Country,
                    Login_City: Login_City,
                    Login_IpAddress: IpAddress,
                    countryCode: Login_CountryCode,
                    Latitude: Login_Latitude,
                    Longitude: Login_Longitude,
                    region: Login_region,
                    regionName: Login_regionName,
                    timezoneName: Login_timeZoneName,
                    zipcode: Login_zipCode,
                    isMYH: isMYH
                };

                //$http.get(baseUrl + '/api/Login/Userlogin_AddEdit/?Id=' + $scope.Id + '&UserName=' + $scope.Username + '&Password=' + $scope.Password).success(function (data) {
                $http.post(baseUrl + '/api/Login/Userlogin_CheckValidity/', obj).then(function (response) {
                    if (response.data.Status == 'False') {
                        $("#chatLoaderPV").hide();
                        $("#chatLoaderPV1").hide();
                        $scope.errorlist = response.data.Message;
                    } else {
                        $scope.UserId = response.data.UserId;
                        $scope.UserTypeId = response.data.UserTypeId;
                        $scope.InstitutionId = response.data.InstitutionId;
                        $window.localStorage['User_Mobile_No'] = response.data.UserDetails.MOBILE_NO;
                        $window.localStorage['UserId'] = $scope.UserId;
                        $window.sessionStorage['UserId'] = $scope.UserId;
                        $window.localStorage['Auth_Session_Id'] = 1;
                        $window.localStorage['inactivity_logout'] = 0;
                        $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                        $window.localStorage['Login_Session_Id'] = response.data.Login_Session_Id;
                        $window.localStorage['FullName'] = response.data.UserDetails.FullName;
                        if ($scope.UserTypeId == 1) {
                            $window.localStorage['InstitutionId'] = -1;
                        }
                        else {
                            $window.localStorage['InstitutionId'] = $scope.InstitutionId;
                        }
                        var Message = response.data.Messagetype;

                        if ($scope.remember == true) {
                            $rememberMeService('dXNlcm5hbWVocm1z', ($scope.Username));
                            $rememberMeService('cGFzc3dvcmRocm1z', ($scope.Password));
                            $rememberMeService('cmVtZW1iZXJocm1z', ($scope.remember));

                        } else {
                            $rememberMeService('dXNlcm5hbWVocm1z', '');
                            $rememberMeService('cGFzc3dvcmRocm1z', '');
                            $rememberMeService('cmVtZW1iZXJocm1z', '');
                        }

                        var data = response.data.data;
                        //var tokendata = "UserName=admin&Password=admin&grant_type=password&LoginType=1"
                        //$http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;
                        //}).error(function (err) {
                        //    console.log(err);
                        //    alert('error');
                        //});

                        var UserName = $scope.Username.toLowerCase();
                        var Password1 = $scope.Password;
                        var Password = Password1.replace(/(#|&)/g, "amp");
                        var LoginType = $scope.LoginType;
                        var tokendata = "UserName=" + UserName + "&Password=" + Password + "&grant_type=password"
                        $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                            $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.data.access_token;
                        }, function errorCallback(err) {
                            $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                            console.log(err);
                        });
                        //    .error(function (err) {
                        //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                        //    console.log(err);
                        //});

                        //$window.sessionStorage['dFhNCjOpdzPNNHxx54e+0w=='] = $window.localStorage['dFhNCjOpdzPNNHxx54e+0w==']
                        $scope.ConfigCode = "WEBIDLETIME";
                        var IdleDays = 0;
                        $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId'])
                            .then(function (data1) {
                                if (data1.data[0] != undefined) {
                                    if ($scope.UserTypeId === 1) {
                                        IdleDays = 86400;
                                        $window.localStorage['IdleDays'] = IdleDays;
                                        $scope.UserLogin(data, Message);
                                    } else {
                                        IdleDays = parseInt(data1.data[0].ConfigValue);
                                        $window.localStorage['IdleDays'] = IdleDays;
                                        $scope.UserLogin(data, Message);
                                    }
                                } else {
                                    if ($scope.UserTypeId === 1) {
                                        IdleDays = 86400;
                                        $window.localStorage['IdleDays'] = IdleDays;
                                        $scope.UserLogin(data, Message);
                                    } else {
                                        IdleDays = 600;
                                        $window.localStorage['IdleDays'] = IdleDays;
                                        $scope.UserLogin(data, Message);
                                    }
                                }
                            }, function errorCallback(err) {
                                IdleDays = 600;
                                $window.localStorage['IdleDays'] = 600;
                                $scope.UserLogin(data, Message);
                            });
                        //.error(function (err) {
                        //    IdleDays = 600;
                        //    $window.localStorage['IdleDays'] = 600;
                        //    $scope.UserLogin(data, Message);
                        //});
                    }
                }, function errorCallback(err) {
                    $("#chatLoaderPV").hide();
                    $("#chatLoaderPV1").hide();
                    $scope.errorlist = "Login Failed! \n Invalid Username or Password ";
                });
                //.error(function (data) {
                //    $("#chatLoaderPV").hide();
                //    $("#chatLoaderPV1").hide();
                //    $scope.errorlist = "Login Failed! \n Invalid Username or Password ";
                //});
            }

            //$scope.ConfigCode = "WEBIDLETIME";
            //var IdleDays = 0;
            //$http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId'])
            //    .success(function (data) {
            //        if (data[0] != undefined) {
            //            IdleDays = parseInt(data[0].ConfigValue);
            //            $window.localStorage['IdleDays'] = IdleDays;
            //        }
            //});   
        };

        $scope.UserLogin = function (data, Message) {
            $("#chatLoaderPV").hide();
            $("#chatLoaderPV1").hide();
            if (data == "1") {
                toastr.error("Username and/or Password are not matching, please verify", "Warning");
                // $scope.errorlist = "Username and/or Password are not matching, please verify";
            }
            else if (data == "2") {
                //$scope.errorlist = "Contract period expired, cannot login";
                toastr.error("Contract period expired, cannot login", "Warning");
            }
            else if (data == "3") {
                //$scope.errorlist = "Contract Time Exceed,contact admin";
                //alert("Contract period expired, Please contact Admin for renewal");
                toastr.error("Contract period expired, Please contact Admin for renewal", "Warning");
                window.location.href = baseUrl + "/Home/Index#/home";
            }
            else if (data == "4" || data == "5") {
                window.location.href = baseUrl + "/home";
                //$location.path("/Home/Index/home");
            }
            else if (data == "6" || data == "10") {
                $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                $window.localStorage['UserId'] = $scope.UserId;

                window.location.href = baseUrl + "/Home/Index#/ChangePassword/1";
                $scope.errorlist = Message;
                toastr.error(Message, "Warning");
            }
            else if (data == "7") {
                $scope.errorlist = Message;
                toastr.error(Message, "Warning");
            }
            else if (data == "8") {
                $scope.errorlist = Message;
                toastr.error(Message, "Warning");
            }
            else if (data == "9") {
                //$scope.errorlist = "Username and/or Password are not active, please verify";
                //toastr.error("Username and/or Password are not active, please verify", "Warning");

                $scope.errorlist = "Inactive User Cannot Login";
                toastr.error("Inactive User Cannot Login", "Warning");
            }
            else if (data == "13") {
                toastr.error("Waiting for approval", "Warning");
            }
            else if (data == "18") {
                toastr.error("UserName Not Found")
            }
            else if (data == "16") {
                toastr.error("Username and Password does not exists. Please verify.", "Warning");
            }
            else {
                $scope.errorlist = "Username and/or Password are not matching, please verify";
                toastr.error("Username and/or Password are not matching, please verify", "Warning");
            }
        }

        $scope.getAccessToken = function () {
            var offsetTime = new Date().getTimezoneOffset();
            FB.login(function (response) {

                $scope.loginStatus = response.status;
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        var uid = response.authResponse.userID;
                        var accessToken = response.authResponse.accessToken;
                        $scope.accessToken = accessToken;

                        FB.api('/me?fields=id,name,email,first_name,last_name,age_range,picture.type(large)', { access_token: accessToken }, function (response) {
                            $scope.first_name = response.first_name;
                            $scope.last_name = response.last_name;
                            $scope.gender = response.gender;
                            $scope.email = response.email;
                            $scope.name = response.name;

                            $scope.UserId = "0";

                            var obj = {
                                UserName: $scope.email,
                                Password: "",
                                DeviceType: "Web",
                                LoginType: "3",
                                Sys_TimeDifference: offsetTime,
                                Browser_Version: navigator.sayswho,
                                Login_Country: Login_Country,
                                Login_City: Login_City,
                                Login_IpAddress: IpAddress
                            };

                            //$http.get(baseUrl + '/api/Login/Userlogin_AddEdit/?Id=' + $scope.Id + '&UserName=' + $scope.Username + '&Password=' + $scope.Password).success(function (data) {
                            $http.post(baseUrl + '/api/Login/Userlogin_CheckValidity/', obj).then(function (response) {
                                $scope.UserId = response.data.UserId;
                                $scope.UserTypeId = response.data.UserTypeId;
                                $scope.InstitutionId = response.data.InstitutionId;
                                $window.localStorage['UserId'] = $scope.UserId;
                                $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                                $window.localStorage['Login_Session_Id'] = response.data.Login_Session_Id;

                                if ($scope.UserTypeId == 1) {
                                    $window.localStorage['InstitutionId'] = -1;
                                }
                                else {
                                    $window.localStorage['InstitutionId'] = $scope.InstitutionId;
                                }
                                var Message = response.data.Messagetype;

                                if ($scope.remember == true) {
                                    $rememberMeService('dXNlcm5hbWVocm1z', ($scope.Username));
                                    $rememberMeService('cGFzc3dvcmRocm1z', ($scope.Password));
                                    $rememberMeService('cmVtZW1iZXJocm1z', ($scope.remember));

                                } else {
                                    $rememberMeService('dXNlcm5hbWVocm1z', '');
                                    $rememberMeService('cGFzc3dvcmRocm1z', '');
                                    $rememberMeService('cmVtZW1iZXJocm1z', '');
                                }

                                var data = response.data.data;
                                //var tokendata = "UserName=admin&Password=admin&grant_type=password&LoginType=1"
                                //$http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                                //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;
                                //}).error(function (err) {
                                //    console.log(err);
                                //    alert('error');
                                //});


                                //var UserName = $scope.Username;
                                //var Password = $scope.Password;
                                //var LoginType = "3";
                                //var tokendata = "UserName=" + UserName + "&Password=#1#" + "&grant_type=password"
                                //$http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                                //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;
                                //}).error(function (err) {
                                //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                                //    alert('error');
                                //});
                                var UserName = $scope.Username;
                                var Password = $scope.Password;
                                var LoginType = $scope.LoginType;
                                var tokendata = "UserName=" + UserName + "&Password=" + Password + "&grant_type=password"
                                $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.data.access_token;
                                }, function errorCallback(err) {
                                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                                    console.log(err);
                                });
                                //.error(function (err) {
                                //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                                //    console.log(err);
                                //});
                                $scope.ConfigCode = "WEBIDLETIME";
                                var IdleDays = 0;
                                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId'])
                                    .then(function (data1) {
                                        if (data1.data[0] != undefined) {
                                            IdleDays = parseInt(data1.data[0].ConfigValue);
                                            $window.localStorage['IdleDays'] = IdleDays;
                                            $scope.UserLogin(data, Message);
                                        } else {
                                            IdleDays = 600;
                                            $window.localStorage['IdleDays'] = IdleDays;
                                            $scope.UserLogin(data, Message);
                                        }
                                    }, function errorCallback(err) {
                                        IdleDays = 600;
                                        $window.localStorage['IdleDays'] = 600;
                                        $scope.UserLogin(data, Message);
                                    });
                                //.error(function (err) {
                                //        IdleDays = 600;
                                //        $window.localStorage['IdleDays'] = 600;
                                //        $scope.UserLogin(data, Message);
                                //    });
                            });

                        });
                    } else if (response.status === 'not_authorized') {
                        $scope.errorlist = "User is not authorised";
                    } else {
                        $scope.errorlist = "User not logged in";
                    }
                });
            }, { scope: 'email,public_profile' });
        }

        $scope.GoogleLogin = function () {
            var offsetTime = new Date().getTimezoneOffset();
            var obj1 = {
                UserName: $scope.Username,
                Password: $scope.Password,
                DeviceType: "Web",
                LoginType: "2",
                Sys_TimeDifference: offsetTime,
                Browser_Version: navigator.sayswho,
                Login_Country: Login_Country,
                Login_City: Login_City,
                Login_IpAddress: IpAddress
            };


            var redirect = baseUrl + 'Home/LoginUsingGoogle/?Sys_TimeDifference=' + offsetTime + '&Browser_Version=' + navigator.sayswho + '&Login_Country=' + Login_Country
                + '&Login_City=' + Login_City + '&IPAdddress=' + IpAddress;
            // $http.post(baseUrl + '/api/PatientApproval/Multiple_PatientApproval_Active/', $scope.ApprovedPatientList).success(function (data) {
            window.location.href = redirect;
        }

        $http.get(baseUrl + '/api/Login/CheckExpiryDate/').then(function (response) {
            if (response.data == true) {
                $scope.errorlist = "Your MyCortex version is outdated. Please contact Administrator for upgrade or email us on admin@mycortex.health";
                $scope.isExpired = true;
            }
        }, function errorCallback(response) { 
        });
    }
]);

/* THIS IS FOR SIGNUP CONTROLLER FUNCTION */
MyCortexControllers.controller("SignupController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService, $ff, toastr) {
        //Declaration and initialization of Scope Variables.    
        $scope.InstitutionCode = $routeParams.InstitutionCode;
        $scope.PatSignUpFlag = 1;
        $scope.InstitutionId = 0;
        $scope.Id = "0";
        $scope.FirstName = "";
        $scope.MiddleName = "";
        $scope.LastName = "";
        $scope.MNR_No = "";
        $scope.PrefixMRN = "";
        $scope.PatientNo = "";
        $scope.NationalId = "";
        $scope.UID = "";
        $scope.InsuranceId = "";
        $scope.GenderId = "0";
        $scope.NationalityId = "0";
        $scope.MaritalStatusId = "0";
        $scope.EthnicGroupId = "0";
        $scope.Type = "0";
        $scope.CertificateValue = 0; 
        $scope.CertificateFileName = "";
        $scope.FileType = "";
        $scope.UIdFileName = "";
        $scope.EditFileName = "";
        $scope.BloodGroupId = "0";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.MobileNo_CC = "";
        $scope.UserTypeId = 2;
        $scope.NationalityList = [];
        $scope.MaritalStatusList = [];
        $scope.EthnicGroupList = [];
        $scope.BloodGroupList = [];
        $scope.GenderList = [];
        $window.localStorage['UserId'] = "0";
        $scope.SelectedLanguage = 0;
        $scope.InstitutionLanguageList = [];
        $scope.emptydataLanguageSettings = [];
        $scope.rowCollectionLanguageSettings = [];
        $scope.showUUIDFiles = [];
        $scope.showNationalityFiles = [];

        $scope.firstname = "First Name";
        $scope.middlename = "Middle Name";
        $scope.lastname = "Last Name";
        $scope.mrnnumber = "MRN number";
        $scope.nationalityid = "Nationality ID";
        $scope.insuranceid = "Insurance ID";
        $scope.gender = "Gender";
        $scope.nationality = "Nationality";
        $scope.MaritalStatus = "MaritalStatus"
        $scope.EthnicGroup = "EthnicGroup";
        $scope.BloodGroup = "BloodGroup";
        $scope.dob = "DOB";
        $scope.email = "Email";
        $scope.mobilenumber = "Mobile Number";
        $scope.changelanguage = "Change Language";

        $scope.defaultsignupacknowledgement = "By submitting this form you agree to share your medical information with MyCortex team for the purposes of medical evaluation and follow up.";
        $scope.signupacknowledgement = "By submitting this form you agree to share your medical information with MyCortex team for the purposes of medical evaluation and follow up.";
        if ($scope.InstitutionCode == "") {
            $scope.institutionName = "MyCortex";
        } else {
            $http.get(baseUrl + 'api/User/GetInstitutionName/?Code=' + $scope.InstitutionCode).then(function (indata) {
                if (indata.data != "") {
                    $scope.institutionName = indata.data;
                } else {
                    $scope.institutionName = "MyCortex";
                }
            }, function errorCallback(response) { 
            });
        }


        $http.get(baseUrl + 'api/User/GetInstitutionFromCode/?Code=' + $scope.InstitutionCode).then(function (response) {
            if (response.data[0].PatSignUpFlag == 0) {
                $scope.PatSignUpFlag = response.data[0].PatSignUpFlag;
                toastr.warning("You Haven't Subscribed For This Module. Please Contact Your Administrator", "warning");
            }
            if (response.data[0].INSTITUTION_ID !== 0) {
                $scope.InstitutionId = response.data[0].INSTITUTION_ID;
                $scope.SelectedInstitutionId = response.data[0].INSTITUTION_ID;
                //if ($scope.SelectedInstitutionId != "") {
                $scope.ConfigCode = "MRN_PREFIX";
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).then(function (data2) {
                    $scope.PrefixMRN = data2.data[0].ConfigValue;
                });
                //}
                $http.get(baseUrl + '/api/Common/getInstitutionLanguages/?Institution_Id=' + $scope.InstitutionId
                ).then(function (response) {
                    $scope.InstitutionLanguageList = [];
                    $scope.InstitutionLanguageList = response.data;
                    $scope.selectedLanguage = response.data[0].DefaultLanguageId.toString();
                    sessionid = $scope.uuid4();
                    $http.get(baseUrl + '/api/LanguageSettings/LanguageSettings_List/?Institution_Id=' + $scope.InstitutionId + '&Login_Session_Id=' + sessionid
                    ).then(function (response) {
                        $scope.emptydataLanguageSettings = [];
                        $scope.rowCollectionLanguageSettings = [];
                        $scope.rowCollectionLanguageSettingsFilter = angular.copy(response.data);
                        $scope.rowCollectionLanguageSettings = response.data.filter(item => item.LANGUAGE_ID === parseInt($scope.selectedLanguage));
                        angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                            if (masterVal.LANGUAGE_KEY === "firstname") {
                                $scope.firstname = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "middlename") {
                                $scope.middlename = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "lastname") {
                                $scope.lastname = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "mrnnumber") {
                                $scope.mrnnumber = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "nationalityid") {
                                $scope.nationalityid = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "insuranceid") {
                                $scope.insuranceid = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "gender") {
                                $scope.gender = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "nationality") {
                                $scope.nationality = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "MaritalStatus") {
                                $scope.MaritalStatus = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "EthnicGroup") {
                                $scope.EthnicGroup = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "BloodGroup") {
                                $scope.BloodGroup = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "dob") {
                                $scope.dob = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "email") {
                                $scope.email = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "mobilenumber") {
                                $scope.mobilenumber = masterVal.LANGUAGE_TEXT;
                            }
                            if (masterVal.LANGUAGE_KEY === "signupacknowledgement") {
                                $scope.signupacknowledgement = masterVal.LANGUAGE_TEXT;
                                $scope.signupacknowledgement = $scope.signupacknowledgement.replace(/MyCortex/g, $scope.institutionName);
                                $scope.defaultsignupacknowledgement = $scope.defaultsignupacknowledgement.replace(/MyCortex/g, $scope.institutionName);
                            }
                        });
                    }, function errorCallback(response) {
                        $scope.error = "AN error has occured while Listing the records!" + response.data;
                    });
                    //.error(function (response) {
                    //    $scope.error = "AN error has occured while Listing the records!" + response;
                    //    //$("#chatLoaderPV").hide();
                    //})
                }, function errorCallback(response) {
                    $scope.error = "AN error has occured while Listing the records!" + response.data;
                });
                //.error(function (response) {
                //    $scope.error = "AN error has occured while Listing the records!" + response;
                //});
            }
            else {
                //alert("There is no Institution for this code!!!");
                toastr.info("There is no Institution for this code!!!", "info");
            }
        }, function errorCallback(response) {
            $scope.error = "AN error has occured while Listing the records!" + response.data;
        });
        //.error(function (response) {
        //    $scope.error = "AN error has occured while Listing the records!" + response;
        //});

        $scope.uuid4 = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        $scope.FilterLanguageSettingsList = function () {
            var data = $scope.rowCollectionLanguageSettingsFilter.filter(item => item.LANGUAGE_ID === parseInt($scope.selectedLanguage));
            $scope.rowCollectionLanguageSettings = angular.copy(data);
            angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                if (masterVal.LANGUAGE_KEY === "firstname") {
                    $scope.firstname = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "middlename") {
                    $scope.middlename = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "lastname") {
                    $scope.lastname = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "mrnnumber") {
                    $scope.mrnnumber = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "nationalityid") {
                    $scope.nationalityid = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "insuranceid") {
                    $scope.insuranceid = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "gender") {
                    $scope.gender = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "nationality") {
                    $scope.nationality = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "MaritalStatus") {
                    $scope.MaritalStatus = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "EthnicGroup") {
                    $scope.EthnicGroup = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "BloodGroup") {
                    $scope.BloodGroup = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "dob") {
                    $scope.dob = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "email") {
                    $scope.email = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "mobilenumber") {
                    $scope.mobilenumber = masterVal.LANGUAGE_TEXT;
                }
                if (masterVal.LANGUAGE_KEY === "signupacknowledgement") {

                    $scope.signupacknowledgement = masterVal.LANGUAGE_TEXT;
                    $scope.signupacknowledgement = $scope.signupacknowledgement.replace(/MyCortex/g, $scope.institutionName);
                }
            });

        };

        /*This is th eValidation for sign Up page 
    The validations are FirstName,Last Name,MRN No,Gender,Nationality,DOB,Email and Mobile No.*/
        $scope.SignupLogin_AddEdit_Validations = function () {
            $scope.DOB = moment($scope.DOB).format('DD-MMM-YYYY');
            var today = moment(new Date()).format('DD-MMM-YYYY');

            if (typeof ($scope.FirstName) == "undefined" || $scope.FirstName == "") {
                angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                    if (masterVal.LANGUAGE_KEY === "pleaseenteravalidfirstName") {
                        alert(masterVal.LANGUAGE_TEXT);
                    }
                });
                return false;
            }
            else if (typeof ($scope.LastName) == "undefined" || $scope.LastName == "") {
                angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                    if (masterVal.LANGUAGE_KEY === "pleaseenteravalidlastName") {
                        //alert(masterVal.LANGUAGE_TEXT);
                        toastr.warning(masterVal.LANGUAGE_TEXT, "warning");
                    }
                });
                return false;
            }
            //else if (typeof ($scope.MNR_No) == "undefined" || $scope.MNR_No == "") {
            //    alert("Please enter MRN No.");
            //    return false;
            //}
            //else if (typeof ($scope.InsuranceId) == "undefined" || $scope.InsuranceId == "") {
            //    angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
            //        if (masterVal.LANGUAGE_KEY === "pleaseenteravalidinsuranceid") {
            //            //alert(masterVal.LANGUAGE_TEXT);
            //            toastr.warning(masterVal.LANGUAGE_TEXT, "warning");
            //        }
            //    });
            //    return false;
            //}
            else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                    if (masterVal.LANGUAGE_KEY === "selectgender") {
                        //alert(masterVal.LANGUAGE_TEXT);
                        toastr.warning(masterVal.LANGUAGE_TEXT, "warning");
                    }
                });
                return false;
            }
            //else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
            //    //alert("Please select Nationality");
            //    toastr.warning("Please select Nationality", "warning");
            //    return false;
            //}
            //else if (typeof ($scope.MaritalStatusId) == "undefined" || $scope.MaritalStatusId == "0") {
            //    toastr.warning("Please select Marital Status", "warning");
            //    return false;
            //}
            //else if (typeof ($scope.EthnicGroupId) == "undefined" || $scope.EthnicGroupId == "0") {
            //    toastr.warning("Please select EthnicGroup", "warning");
            //    return false;
            //}
            //else if (typeof ($scope.BloodGroupId) == "undefined" || $scope.BloodGroupId == "0") {
            //    toastr.warning("Please select BloodGroup","warning");
            //    return false;
            //}
            else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "" || $scope.DOB == "Invalid date") {
                //alert("Please select Date of Birth");
                toastr.warning("Please select Date of Birth", "warning");
                return false;
            }
            else if ($scope.NationalId == "" && $scope.UID == "" && $scope.ProductName =="MyHealth") {
                //alert("Please select Date of Birth");
                toastr.warning("Please Enter Emirates ID or UID", "warning");
                return false;
            }
            else if ($scope.showNationalityFiles.length == 0 && $scope.showUUIDFiles.length == 0 && $scope.ProductName == "MyHealth") {
                //alert("Please select Date of Birth");
                toastr.warning("Please Select Emirates ID or UID Images ", "warning");
                return false;
            }
           
            if ((ParseDate($scope.DOB)) > (ParseDate(today))) {
                //alert("DOB Can Be Only select past date");
                toastr.warning("DOB Can Be Only select past date", "warning");
                $scope.DOB = DateFormatEdit($scope.DOB);
                return false;
            }
            //else if (isDate($scope.DOB) == false) {
            //    alert("Date of Birth is in Invalid format, please enter dd-mm-yyyy");
            //    return false;
            //}
            else if (typeof ($scope.EmailId) == "undefined" || $scope.EmailId == "") {
                //alert("Please enter Email");
                toastr.warning("Please enter Email", "warning");
                return false;
            }
            else if (EmailFormate($scope.EmailId) == false) {
                //alert("Invalid Email format");
                toastr.warning("Invalid Email format", "warning");
                return false;
            }
            else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                //alert("Please enter Mobile No.");
                toastr.warning("Please enter Mobile No.", "warning");
                return false;
            }
            //if ($scope.CertificateFileName != "") {
            //    var fileval = 0;
            //    $scope.filetype = $scope.CertificateFileName.split(".");
            //    var fileExtenstion = "";
            //    if ($scope.filetype.length > 0) {
            //        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
            //    }
            //    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
            //        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico"
            //        || fileExtenstion.toLocaleLowerCase() == "pdf" || fileExtenstion.toLocaleLowerCase() == "xls" || fileExtenstion.toLocaleLowerCase() == "xlsx"
            //        || fileExtenstion.toLocaleLowerCase() == "doc" || fileExtenstion.toLocaleLowerCase() == "docx" || fileExtenstion.toLocaleLowerCase() == "odt"
            //        || fileExtenstion.toLocaleLowerCase() == "txt" || fileExtenstion.toLocaleLowerCase() == "pptx" || fileExtenstion.toLocaleLowerCase() == "ppt"
            //        || fileExtenstion.toLocaleLowerCase() == "rtf" || fileExtenstion.toLocaleLowerCase() == "tex"
            //    ) {
            //        fileval = 1;
            //    }
            //    else {
            //        fileval = 2;
            //    }
            //    if (fileval == 2) {
            //        toastr.warning("Please choose jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex file.", "warning");
            //        $("#chatLoaderPV").hide();
            //        return false;
            //    }
            //} 
            //if ($scope.Nationalityresumedoc != null) {
            //    if ($scope.Nationalityresumedoc != undefined && $scope.Nationalityresumedoc != null && $scope.Nationalityresumedoc != "") {
            //        if ($scope.dataURItoBlob($scope.Nationalityresumedoc).size > 1048576) {
            //            toastr.warning("Certificate file size cannot be greater than 1MB", "warning");
            //            $("#chatLoaderPV").hide();
            //            return false;
            //        }
            //    }
            //}
            //if ($scope.UIdFileName != "") {
            //    var fileval = 0;
            //    $scope.filetype = $scope.UIdFileName.split(".");
            //    var fileExtenstion = "";
            //    if ($scope.filetype.length > 0) {
            //        fileExtenstion = $scope.filetype[$scope.filetype.length - 1];
            //    }
            //    if (fileExtenstion.toLocaleLowerCase() == "jpeg" || fileExtenstion.toLocaleLowerCase() == "jpg" || fileExtenstion.toLocaleLowerCase() == "png"
            //        || fileExtenstion.toLocaleLowerCase() == "bmp" || fileExtenstion.toLocaleLowerCase() == "gif" || fileExtenstion.toLocaleLowerCase() == "ico"
            //        || fileExtenstion.toLocaleLowerCase() == "pdf" || fileExtenstion.toLocaleLowerCase() == "xls" || fileExtenstion.toLocaleLowerCase() == "xlsx"
            //        || fileExtenstion.toLocaleLowerCase() == "doc" || fileExtenstion.toLocaleLowerCase() == "docx" || fileExtenstion.toLocaleLowerCase() == "odt"
            //        || fileExtenstion.toLocaleLowerCase() == "txt" || fileExtenstion.toLocaleLowerCase() == "pptx" || fileExtenstion.toLocaleLowerCase() == "ppt"
            //        || fileExtenstion.toLocaleLowerCase() == "rtf" || fileExtenstion.toLocaleLowerCase() == "tex"
            //    ) {
            //        fileval = 1;
            //    }
            //    else {
            //        fileval = 2;
            //    }
            //    if (fileval == 2) {
            //        toastr.warning("Please choose jpeg/jpg/png/bmp/gif/ico/pdf/xls/xlsx/doc/docx/odt/txt/pptx/ppt/rtf/tex file.", "warning");
            //        $("#chatLoaderPV").hide();
            //        return false;
            //    }
            //}
            //if ($scope.UidDocument != null) {
            //    if ($scope.UidDocument != undefined && $scope.UidDocument != null && $scope.UidDocument != "") {
            //        if ($scope.dataURItoBlob($scope.UidDocument).size > 1048576) {
            //            toastr.warning("Certificate file size cannot be greater than 1MB", "warning");
            //            $("#chatLoaderPV").hide();
            //            return false;
            //        }
            //    }
            //}
            $scope.DOB = DateFormatEdit($scope.DOB);
            return true;
        };

        $http.get(baseUrl + '/api/Login/GetProduct_Details/').then(function (response) {
            $scope.PrdImg = response.data[0].ProductImg;
            $scope.ProductName =response.data[0].ProductName;
            if ($scope.ProductName == 'MyCortex') {
                $scope.Productlogin = 0;
                $scope.Id1 = 'Identification Number 1';
                $scope.Id2 = 'Identification Number 2';
                $scope.mandatory = '';
            } else if ($scope.ProductName == 'MyHealth') {
                $scope.Productlogin = 1;
                $scope.Id1 = 'Emirates Id';
                $scope.Id2 = 'UID';
                $scope.mandatory = "<sup><font class='mandatory-field'>*</font></sup>";
            } else {
                $scope.Productlogin = 2;
                $scope.Id1 = 'Identification Number 1';
                $scope.Id2 = 'Identification Number 2';
                $scope.mandatory = '';
            }

            if ($scope.Productlogin == '1') {
                document.getElementById('LoginSection').className = "loginBgHel";
            }
            else if ($scope.Productlogin == '0') {
                document.getElementById('LoginSection').className = "loginBgCor";
            } else {
                document.getElementById('LoginSection').className = "loginBgHiv";
            }
        }, function errorCallback(response) { 
        });

        $http.get(baseUrl + '/api/Login/getProductName/').then(function (response) {
            var ProductName = response.data;
            $('#productname').val(ProductName["instanceId"]);
            if ($('#productname').val() == "0") {
                $scope.prdName = "MyHealth";
                $scope.prductName = " MyHealth?";
            } else if ($('#productname').val() == "2") {
                $scope.prdName = "STC MyCortex";
                $scope.prductName = " STC MyCortex?";
            } else {
                $scope.prdName = "MyCortex  ";
                $scope.prductName = " MyCortex?";
            }
        }, function errorCallback(response) { 
        });
        $scope.EditdocfileChange = function (e) {
            if ($('#Nationalityresumedoc')[0].files.length <= 4) {
                let maxSize = (2 * 1024) * 1024;
                let fileSize = 0; 
                let filesizewarn = 0;
                $scope.showNationalityFiles = [];
                
                for (var i = 0; i < e.files.length; i++) {
                    fileSize = e.files[i].size; 
                    if (fileSize >= maxSize) {
                        $scope.fileexceed = "Each Image size exceeds 2 MB";               
                        filesizewarn = 1;
                    }                   
                }

                if (filesizewarn == 0) {
                    for (var i = 0; i < e.files.length; i++) {
                        $scope.showNationalityFiles.push(e.files[i])               
                    }
                    //$scope.showUUIDFiles = [];
                    //$scope.UID = '';
                } else {
                    toastr.warning($scope.fileexceed, "File Size");
                }
                           
            } else {
                toastr.warning("Maximum 4 images should be allowed", "Files Count");
            }
            //if ($('#Nationalityresumedoc')[0].files[0] != undefined) {
            //    $scope.CertificateFileName = $('#Nationalityresumedoc')[0].files[0]['name'];
            //    $scope.FileType = $('#Nationalityresumedoc')[0].files[0]['type'];
            //    // $scope.nationalityresumedoc = e.files[0];
            //}
        }

        $scope.nationalFileDelete = function (index) {
            // delete the file
            $scope.showNationalityFiles.splice(index, 1);
        }
        $scope.imageclearPatient = function () {
            $scope.Photo = "";
            $scope.FileName = "";
            $scope.UserProfieName = "";
            $('#UserLogo').val('');
            $scope.UserPhotoValue = 0;
            $scope.UserLogo = '';
        };
        $scope.UUIDFileDelete = function (index) {
            // delete the file
            $scope.showUUIDFiles.splice(index, 1);
        }
        $scope.photoChange = function (e) {
            //$scope.UserLogo = '';
            $scope.UserProfieName = "";
            //$('#UserLogo').val('');
            if ($('#UserLogo')[0].files[0] != undefined) {
                $scope.ProfieName = $('#UserLogo')[0].files[0]['name'];
                $scope.ProfieName = e.files[0]['name'];
                $scope.UserProfieName = $scope.ProfieName;
            }
        }
        $scope.UserPhotoValue = 0;
        $scope.PatientgetBase64Image = function () {
           
            //if ($scope.UserPhotoValue == 0) {
            //    var maleId = 0;
            //    var feMaleId = 0;
            //    angular.forEach($scope.GenderList, function (value, index) {
            //        $scope.Gender_Name = value.Gender_Name;
            //        if ($scope.Gender_Name.toLowerCase() == "male") {
            //            maleId = value.Id.toString();
            //        }
            //        else if ($scope.Gender_Name.toLowerCase() == 'female') {
            //            feMaleId = value.Id.toString();
            //        }
            //    });



            //    var picPath = "others.png";
            //    if (typeof ($scope.Gender_Name) != "undefined")
            //        if ($scope.GenderId == feMaleId) {
            //            picPath = "Patient_Female.png";
            //        }
            //        else if ($scope.GenderId == maleId) {
            //            picPath = "Patient_Male.png";
            //        }

            //    $scope.UserProfieName = picPath;                
            //}
        };
        
        $scope.UIDfileChange = function (e) {
            //if ($('#UidDocument')[0].files[0] != undefined) {
            //    $scope.UIdFileName = $('#UidDocument')[0].files[0]['name'];
            //    $scope.FileType = $('#UidDocument')[0].files[0]['type'];
            //}
            if ($('#UidDocument')[0].files.length <= 4) {
                let maxSize = (2 * 1024) * 1024;
                let fileSize = 0;
                let filesizewarn = 0;
                $scope.showUUIDFiles = [];

                for (var i = 0; i < e.files.length; i++) {
                    fileSize = e.files[i].size;
                    if (fileSize >= maxSize) {
                        $scope.fileexceed = "Each Image File size exceeds 2 MB";
                        filesizewarn = 1;
                    }
                }

                if (filesizewarn == 0) {
                    for (var i = 0; i < e.files.length; i++) {
                        $scope.showUUIDFiles.push(e.files[i])
                    }
                    //$scope.showNationalityFiles = [];
                    //$scope.NationalId = '';

                } else {
                    toastr.warning($scope.fileexceed, "File Size");
                }

            } else {
                toastr.warning("Maximum 4 images should be allowed", "Files Count");
            }
        }
        $scope.CertificateUplaodSelected = function () {
            $scope.CertificateValue = 1;
        };
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
        $scope.fnNationalityClear=function()
        {
            //if ($scope.UID != '') {
            //    $scope.NationalId = '';
            //    $scope.showNationalityFiles = [];
            //}             
        }
        $scope.fnUUIDClear = function () {
            //if ($scope.NationalId != '') {
            //    $scope.UID = '';
            //    $scope.showUUIDFiles = [];
            //}
        }
        /*This is Insert Function for SignUp */
        $scope.SignupLogin_AddEdit = function () {
            if ($scope.PatSignUpFlag == 1) {
                if ($scope.SignupLogin_AddEdit_Validations() == true) {
                    $scope.DocumentUpload = "";
                    if ($scope.CertificateFileName == $scope.CertificateFileName) {
                        $scope.DocumentUpload = $scope.CertificateFileName;
                    } else {
                        $scope.DocumentUpload = $scope.UIdFileName;
                    }
                    // window.location.href = baseUrl + "/Home/Index#;
                    $("#chatLoaderPV").show();
                    $('#submit').attr("disabled", true);
                    $scope.MobileNo_CC = document.getElementById("txthdFullNumber").value;
                    var tokendata = "UserName=admin&Password=admin&grant_type=password"
                    $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                        $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.data.access_token;

                        var data = {
                            Id: $scope.Id,
                            INSTITUTION_CODE: $scope.InstitutionCode,
                            FirstName: $scope.FirstName,
                            MiddleName: $scope.MiddleName,
                            LastName: $scope.LastName,
                            NATIONALID: $scope.NationalId,
                            UID: $scope.UID,
                            FILE_NAME: $scope.DocumentUpload,
                            FILETYPE: $scope.FileType,
                            INSURANCEID: $scope.InsuranceId,
                            //MNR_NO: $scope.MNR_No,
                            GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                            NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                            MARITALSTATUS_ID: $scope.MaritalStatusId == 0 ? null : $scope.MaritalStatusId,
                            ETHINICGROUP_ID: $scope.EthnicGroupId == 0 ? null : $scope.EthnicGroupId,
                            DOB: $scope.DOB,
                            BLOODGROUP_ID: $scope.BloodGroupId == 0 ? null : $scope.BloodGroupId,
                            EMAILID: $scope.EmailId,
                            MOBILE_NO: $scope.MobileNo_CC,
                            UserType_Id: $scope.UserTypeId,
                            ApprovalFlag: 0,
                            MrnPrefix: $scope.PrefixMRN,
                            User_Id: $window.localStorage['UserId']
                            //, INSTITUTION_ID: 1
                        }
                        var config = {
                            headers: {
                                'Authorization': 'Bearer ' + $window.localStorage['dFhNCjOpdzPNNHxx54e+0w==']
                            }
                        };
                        //$http({
                        //    method: 'POST',
                        //    url: baseUrl + 'api/User/User_InsertUpdate/',
                        //    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] },
                        //    data: data
                        //}).success(function (data) {
                        $http.post(baseUrl + 'api/User/User_InsertUpdate?Login_Session_Id={00000000-0000-0000-0000-000000000000}', data, config).then(function (res) {
                            $("#chatLoaderPV").hide();
                            if (res.data.ReturnFlag == 1) {
                                //alert("You have been signed up successfully");
                                toastr.success("You have been signed up successfully", "success");
                                $scope.submitted = false;
                                $('#submit').attr("disabled", false);
                                var userid = res.data.UserDetails.Id;
                                $scope.UserImageAttach(userid);
                                $scope.UserImageAttach1(userid);
                                $scope.UserImageAttach2(userid);
                                $scope.CancelSignUpPopup();
                            } else {
                                //alert(data.Message);
                                toastr.info(res.data.Message, "info");
                                $scope.submitted = false;
                                $('#submit').attr("disabled", false);
                            }
                            //if ($scope.MenuTypeId == 3) {
                            //    $scope.ListRedirect();
                            //}
                        }, function errorCallback(err) {
                            $("#chatLoaderPV").hide();
                            console.log(err);
                            //alert(err);
                            toastr.info("err", "info");
                        });
                        //    .error(function (err) {
                        //    $("#chatLoaderPV").hide();
                        //    console.log(err);
                        //    //alert(err);
                        //    toastr.info("err", "info");
                        //}
                        //);
                        //$("#chatLoaderPV").hide();
                    }, function errorCallback(err) {
                        console.log(err);
                        $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                        //alert('error');
                        toastr.info("error", "info");
                    });
                    //    .error(function (err) {
                    //    console.log(err);
                    //    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                    //    //alert('error');
                    //    toastr.info("error", "info");
                    //});
                }
            }
            else {
                toastr.warning("You Haven't Subscribed For This Module. Please Contact Your Administrator", "warning");
                return false;
            }
        };
        $scope.UserImageAttach = function (userid) {
            $scope.PhotoValue = 1;
            var photoview = false;
            var userid = userid;
            var FileName = "";
            $scope.Profile = "";
            var CertificateFileName = "";
            var FileType = "";
            var fd = new FormData();
            var imgBlobfile;
            var itemIndexLogo = -1;
            var itemIndexfile = -1;
            $scope.CertificateValue = '0';
            var fd1 = new FormData();

            //if ($scope.CertificateFileName !="") {
            if ($scope.showNationalityFiles.length > 0) {
                $scope.PhotoValue = 1;

                for (var i = 0; i < $scope.showNationalityFiles.length; i++) {
                    $scope.CertificateFileName = $scope.showNationalityFiles[i]['name'];
                    $scope.FileType = $scope.showNationalityFiles[i]['type'];
                    fd.append('file1', $scope.showNationalityFiles[i]);
                }
                $http.post(baseUrl + '/api/User/Attach_UserDocuments/?UserId=' + userid + '&Type=Emirates_Id ', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                ).then(function (response) {
                    $scope.showNationalityFiles = [];
                }, function errorCallback(response) {
                });
            }
        }
        $scope.UserImageAttach1 = function (userid) {
            $scope.PhotoValue = 1;
            var photoview = false;
            var userid = userid;
            var FileName = "";
            $scope.Profile = "";
            var CertificateFileName = "";
            var FileType = "";
            var fd = new FormData();
            var imgBlobfile;
            var itemIndexLogo = -1;
            var itemIndexfile = -1;
            $scope.CertificateValue = '0';
            var fd1 = new FormData();
            if ($scope.showUUIDFiles.length > 0) {
                for (var i = 0; i < $scope.showUUIDFiles.length; i++) {
                    $scope.CertificateFileName = $scope.showUUIDFiles[i]['name'];
                    $scope.FileType = $scope.showUUIDFiles[i]['type'];
                    fd.append('file1', $scope.showUUIDFiles[i]);
                }
                $http.post(baseUrl + '/api/User/Attach_UserDocuments/?UserId=' + userid + '&Type=UID', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                ).then(function (response) {
                    $scope.showUUIDFiles = [];
                }, function errorCallback(response) { 
                })
            }
        }
        $scope.UserImageAttach2 = function (userid) {
            $scope.PhotoValue = 1;
            var photoview = false;
            var userid = userid;
            var FileName = "";
            $scope.Profile = "";
            var CertificateFileName = "";
            var FileType = "";
            var fd = new FormData();
            var imgBlobfile;
            var itemIndexLogo = -1;
            var itemIndexfile = -1;
            $scope.CertificateValue = '0';
            var fd1 = new FormData();
            if ($scope.ProfieName != undefined) {
                imgBlob = $scope.dataURItoBlob($scope.UserLogo);
                itemIndexLogo = 0;

                if (itemIndexLogo != -1) {
                    fd1.append('file', imgBlob);
                }
                //imgBlob = $scope.UserLogo;
                //fd1.append('file1', imgBlob);
                $http.post(baseUrl + '/api/User/AttachPhoto/?Id=' + userid + '&Photo=1' + '&Certificate=' + $scope.CertificateValue + '&CREATED_BY=' + userid,
                    fd1,
                    {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }
                ).then(function (response) {
                    $scope.UserProfieName = "";
                    $scope.ProfieName = "";
                    $scope.UserLogo = '';
                    $('#UserLogo').val('');
                }, function errorCallback(response) { 
                })
            }
        }
        //This is for Clear the values
        $scope.CancelSignUpPopup = function () {
            $scope.FirstName = "";
            $scope.MiddleName = "";
            $scope.LastName = "";
            $scope.MNR_No = "";
            $scope.PatientNo = "";
            $scope.NationalId = "";
            $scope.UID = "";
            $scope.InsuranceId = "";
            $scope.GenderId = "0";
            $scope.NationalityId = "0";
            $scope.MaritalStatusId = "0";
            $scope.EthnicGroupId = "0";
            $scope.BloodGroupId = "0";
            $scope.FileType = "";
            $scope.EmailId = "";
            $scope.MobileNo = "";
            $scope.MobileNo_CC = "";
            $scope.DOB = "";
            $scope.CertificateFileName = "";
            $scope.Nationalityresumedoc = "";
            $scope.UIdFileName = "";
            $scope.UidDocument = "";
            $('#Nationalityresumedoc').val('');
            $('#UidDocument').val('');
            //$scope.HideSignUpModal();
        }

        // This is for to get Nationality List 
        $http.get(baseUrl + 'api/Common/NationalityList/').then(function (response) {
            $scope.NationalityList = response.data;
        }, function errorCallback(response) { 
        });

        $http.get(baseUrl + 'api/Common/MaritalStatusList/').then(function (response) {
            $scope.MaritalStatusList = response.data;
        }, function errorCallback(response) { 
        });

        $http.get(baseUrl + '/api/Common/EthnicGroupList/').then(function (response) {
            $scope.EthnicGroupList = response.data;
        }, function errorCallback(response) { 
        });

        $http.get(baseUrl + '/api/Common/BloodGroupList/').then(function (response) {
            $scope.BloodGroupList = response.data;
        }, function errorCallback(response) { 
        });

        // This is for to get Gender List
        $http.get(baseUrl + 'api/Common/GenderList/').then(function (response) {
            $scope.GenderList = response.data;
        }, function errorCallback(response) { 
        });

        var Login_Country = "";
        var Login_City = "";
        ////$http.get("http://ip-api.com/json").then(function (response) {
        //$http.get("https://ipapi.co/json/").then(function (response) {
        //    //Login_Country = response.data.country;
        //    //Login_City = response.data.city;
        //    Login_Country = response.data.country_name;
        //    Login_City = response.data.city
        //});

        navigator.sayswho = (function () {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
    }
]);

MyCortexControllers.controller("PasswordController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', '$timeout', '$rootScope', '$toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, $timeout, $rootScope, toastr) {
        $scope.fix = parseInt($routeParams.no) / 3;
        $scope.userid = $routeParams.str;
        $scope.InstituteId = $routeParams.Id;
        $scope.OldPassword = $routeParams.pwd;
        $scope.PageParameter = 1;
        $scope.IsMaster = 0;
        //$scope.cur = parseInt((new Date().getDate()).toString() + (new Date().getMonth() + 1).toString() + (new Date().getFullYear()).toString());
        $scope.cur = new Date().getTime();
        var no = $scope.fix.toString();
        var len = no.length;
        var tim = new Date(parseInt(no.substr(len - 4, 4)), parseInt(no.substr(len - 6, 2)), parseInt(no.substr(len - 8, 2))).getTime();
        $scope.fix = tim;
        if ($scope.fix >= $scope.cur) {
            $scope.PageParameter = 2; // dont change it
        } else {
            $scope.PageParameter = 1; // dont change it
            toastr.warning("Please Contact Your Admin", "warning");
            window.location.href = baseUrl + "/Home/Index#/home";
        }
        //$scope.LoginSessionId = $window.localStorage['Login_Session_Id']
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


        $scope.policyExist = false;
        $scope.PasswordPolicyDetails = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/Common/PasswordPolicyDetails_View/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                if (response.data != null) {
                    $scope.Insitution_Id = response.data.Insitution_Id;
                    $scope.Insitution_Name = response.data.Insitution_Name;
                    $scope.Minimum_Length = response.data.Minimum_Length;
                    $scope.Maximum_Length = response.data.Maximum_Length;
                    $scope.UpperCase_Required = response.data.UpperCase_Required;
                    $scope.LowerCase_Required = response.data.LowerCase_Required;
                    $scope.Numeric_Required = response.data.Numeric_Required;
                    $scope.SpecialChar_Required = response.data.SpecialChar_Required;
                    $scope.Without_Char = response.data.Without_Char;
                    $scope.Expiry_Period = response.data.Expiry_Period;
                    $scope.Allow_UserName = response.data.Allow_UserName;
                    $scope.Restrict_LastPassword = response.data.Restrict_LastPassword;
                    $scope.MaxLoginMins = response.data.MaxLoginMins;
                }
                //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
                //$scope.NewPassword = "";
                $("#chatLoaderPV").hide();
            }, function errorCallback(response) { 
            });
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
        };
        $scope.PasswordPolicyDetails();

        $scope.Validationcontrolspassword = function () {
            $scope.PasswordPolicyDetails();

            //if (typeof ($scope.OldPassword) == "undefined" || $scope.OldPassword == '') {
            //    alert("Please enter Password");
            //    return false;
            //}

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
                //alert("Your Name Should Contain Minimum Length is " + $scope.Minimum_Length);
                toastr.warning("Your Name Should Contain Minimum Length is " + $scope.Minimum_Length, "warning");
                return false;
            }

            else if (parseInt(('' + $scope.NewPassword).length) > parseInt($scope.Maximum_Length)) {
                //alert("Sorry You are Exceeding the Limit is " + $scope.Maximum_Length);
                toastr.warning("Sorry You are Exceeding the Limit is " + $scope.Maximum_Length, "warning");
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
                    //alert("Please enter atleast one special character ");
                    toastr.info("Please enter atleast one special character ", "info");
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
                            //alert($scope.Without_Char + "  characters not allowed, please check");
                            toastr.info($scope.Without_Char + "  characters not allowed, please check", "info");
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
                    //alert("Please enter atleast one number ");
                    toastr.warning("Please enter atleast one number ", "warning");
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
                    //alert("Username and password is same, please check the password");
                    toastr.inf("Username and password is same, please check the password", "info");
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
                    //alert("Please enter atleast one uppercase letter ");
                    toastr.info("Please enter atleast one uppercase letter ", "info");
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
                    //alert("Please enter atleast one lowercase letter ");
                    toastr.info("Please enter atleast one lowercase letter ", "info");
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
                //alert("Your Name Should Contain Minimum Length is " + $scope.Minimum_Length);
                toastr.warning("Your Name Should Contain Minimum Length is " + $scope.Minimum_Length, "warning");
                return false;
            }

            else if (parseInt(('' + $scope.NewPassword).length) > parseInt($scope.Maximum_Length)) {
                //alert("Sorry You are Exceeding the Limit is " + $scope.Maximum_Length);
                toastr.warning("Sorry You are Exceeding the Limit is " + $scope.Maximum_Length, "warning");
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
                    //alert("Please enter atleast one special character ");
                    toastr.info("Please enter atleast one special character ", "info");
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
                    //alert("Please enter atleast one number ");
                    toastr.info("Please enter atleast one number ", "info");
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
                    //alert("Username and password is same, please check the password");
                    toastr.warning("Username and password is same, please check the password", "warning");
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
                    //alert("Please enter atleast one uppercase letter ");
                    toastr.info("Please enter atleast one uppercase letter ", "info");
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
                    //alert("Please enter atleast one lowercase letter ");
                    toastr.info("Please enter atleast one lowercase letter ", "info");
                    return false;
                }
            }

            return true;

        };

        $scope.CancelPopup = function () {
            if (confirm('Are you sure?')) {
                window.location.href = baseUrl + "/#/login";
            }
        }
        /*
    Call the api method for insert and Update the record for a change password
    and display the record of selected change password when Id is greater than 0
    in edit.html and provide an option for create and modify the change password and save the change password record
    */
        $scope.ChangePassword = function () {
            if ($scope.Validationcontrolspassword() == true) {
                $("#chatLoaderPV").show();
                $scope.InstituteId = $window.localStorage['InstitutionId'];
                $scope.NewPassword = $scope.NewPassword.replace(/(#|&)/g, "amp");
                $scope.confirmpassword = $scope.confirmpassword.replace(/(#|&)/g, "amp");
                var obj = {
                    Status: $scope.userid,
                    InstitutionId: $window.localStorage['InstitutionId'],
                    NewPassword: $scope.NewPassword,
                    ReenterPassword: $scope.confirmpassword,
                    LoginType: $scope.PageParameter,
                    Password: $scope.OldPassword
                };
                $http.post(baseUrl + '/api/Login/ChangePassword_For_User', obj)
                    /*/?Id=' + $scope.changepasswordId
                    + '&NewPassword=' + $scope.NewPassword
                    + '&OldPassword=' + $scope.OldPassword
                    + '&Confirmpassword=' + $scope.confirmpassword
                    + '&ModifiedUser_Id=' + $scope.ModifiedUser_Id
                    + '&InstitutionId=' + $scope.InstituteId
                    + '&PageTypeId=' + $scope.PageParameter*/
                    .then(function (res) {
                        //alert(data.Message);
                        if (data.ReturnFlag == "1") {
                            toastr.success(res.data.Message, "success");
                            $scope.ClearPassword();
                            angular.element('#ChangepasswordpopupModal').modal('hide');
                            window.location.href = baseUrl + "/#/login";
                        }
                        else if (data.ReturnFlag == "0") {
                            toastr.info(res.data.Message, "info");
                        }
                    }, function errorCallback(res) { 
                        $scope.error = "Problem in changing the password duplicate!" + res.data.ExceptionMessage;
                    });//.error(function (res) {
                    //    $scope.error = "Problem in changing the password duplicate!" + data.ExceptionMessage;
                    //});
                $("#chatLoaderPV").hide();
            }
        };
        $scope.PasswordChecking = function () {
            var elless = $scope.NewPassword;
            var isUpperCaseLetter = (/[A-Z]/.test(elless));
            if (isUpperCaseLetter) {
                document.getElementById("UpperCase").checked = true;
            } else {
                document.getElementById("UpperCase").checked = false;
            }
            var isNumber = (/[0-9]/.test(elless));
            if (isNumber) {
                document.getElementById("Numeric").checked = true;
            } else {
                document.getElementById("Numeric").checked = false;
            }
            if (elless == null || elless == undefined || elless == "") {
                document.getElementById("Blank").checked = true;
            } else {
                document.getElementById("Blank").checked = false;
            }
            var Passwordlength = elless.length;
            if (Passwordlength >= $scope.Minimum_Length) {
                document.getElementById("Minchar").checked = true;
            } else {
                document.getElementById("Minchar").checked = false;
            }
            if (Passwordlength <= $scope.Maximum_Length & Passwordlength >= $scope.Minimum_Length) {
                document.getElementById("Maxchar").checked = true;
            } else {
                document.getElementById("Maxchar").checked = false;
            }
            if ($scope.NewPassword == $scope.confirmpassword & $scope.NewPassword != "") {
                document.getElementById("MatchOk").checked = true;
            } else {
                document.getElementById("MatchOk").checked = false;
            }
        }
        $scope.PasswordConfirm = function () {
            if ($scope.NewPassword == $scope.confirmpassword & $scope.NewPassword != "") {
                document.getElementById("MatchOk").checked = true;
            } else {
                document.getElementById("MatchOk").checked = false;
            }
        }

        /* User type details list*/
        $http.get(baseUrl + '/api/Login/Usertypedetailslist/').then(function (response) {
            //$scope.Usertypelist = data;
            $scope.Usertypelist = [];
            $("#chatLoaderPV").show();
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
            angular.forEach(response.data, function (row, value) {
                if (row.Id != 1)
                    $scope.Usertypelist.push(row)
            });
            $("#chatLoaderPV").hide();
        }, function errorCallback(response) { 
        });

        /* User basic details list*/
        $scope.Userdetailsdatalist = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + $scope.UserTypeName + '&InstitutionId=' + $scope.InstituteId + '&IS_MASTER=' + $scope.IsMaster).then(function (response) {
                $scope.Userlist = response.data;
                $("#chatLoaderPV").hide();
            }, function errorCallback(response) { 
            });
        };

        $scope.ClearPassword = function () {
            $scope.NewPassword = "";
            //$scope.OldPassword = "";
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
                $('#btn-signup').attr("disabled", true);
                if ($scope.User_Selected != undefined) {
                    $scope.User_Id = $scope.User_Selected.originalObject.Id;
                    {
                        $scope.ResetpasswordId = $window.localStorage['UserId'];
                        $scope.NewPassword = $scope.NewPassword.replace(/(#|&)/g, "amp");
                        $scope.ReenterPassword = $scope.ReenterPassword.replace(/(#|&)/g, "amp");
                        $http.get(baseUrl + '/api/Login/ResetPassword/?Id=' + $scope.User_Id
                            + '&NewPassword=' + $scope.NewPassword
                            + '&ReenterPassword=' + $scope.ReenterPassword
                            + '&created_By=' + $window.localStorage['UserId']
                            + '&EmailId=""'
                            + '&InstitutionId=' + $window.localStorage['InstitutionId']).then(function (response) {
                                //alert(data.Message);
                                if (response.data.ReturnFlag == "1") {
                                    toastr.success(response.data.Message, "success");
                                }
                                else if (response.data.ReturnFlag == "0") {
                                    toastr.info(response.data.Message, "info");
                                }
                                $('#btn-signup').attr("disabled", false);
                                $scope.ClearPassword();
                                $("#chatLoaderPV").hide();                            
                            }, function errorCallback(response) {
                                $scope.error = "An error has occurred while deleting reset password details" + response;
                            });
                            //.error(function (response) {
                            //    $scope.error = "An error has occurred while deleting reset password details" + response;
                            //});
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
                $('#btnsave').attr("disabled", true);
                $scope.loading = true;

                $http.post(baseUrl + '/api/Common/PasswordPolicy_InsertUpdate/', obj).then(function (res) {
                    alert(res.data.Message);
                    $('#btnsave').attr("disabled", false);
                    $scope.PasswordPolicyView();
                    $scope.ClearFields();

                    if (res.data.ReturnFlag == "1") {
                        $location.path("/EditPasswordPolicy/");
                        $scope.loading = false;
                        $rootScope.$broadcast('hide');
                    }
                    $("#chatLoaderPV").hide();
                }, function errorCallback(res) { 
                    $scope.error = "An error has occurred while adding Password Policy Details!" + res.data.ExceptionMessage;
                });
                //    .error(function (data) {
                //    $scope.error = "An error has occurred while adding Password Policy Details!" + data.ExceptionMessage;
                //});

            };
        }

        //view function for password policy
        $scope.PasswordPolicyView = function () {

            $("#chatLoaderPV").show();
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //  $scope.NewPassword = "";
            $http.get(baseUrl + '/api/Common/PasswordPolicy_View/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                if (response.data != null) {
                    $scope.policyExist = true;
                    $scope.Institution_Id = response.data.Institution_Id;
                    $scope.Insitution_Name = response.data.Insitution_Name;
                    $scope.Minimum_Length = response.data.Minimum_Length;
                    $scope.Maximum_Length = response.data.Maximum_Length;
                    $scope.UpperCase_Required = response.data.UpperCase_Required;
                    $scope.LowerCase_Required = response.data.LowerCase_Required;
                    $scope.Numeric_Required = response.data.Numeric_Required;
                    $scope.SpecialChar_Required = response.data.SpecialChar_Required;
                    $scope.Without_Char = response.data.Without_Char;
                    $scope.AllowExpiryDays = response.data.AllowExpiryDays;
                    $scope.Expiry_Period = response.data.Expiry_Period;
                    $scope.Allow_UserName = response.data.Allow_UserName;
                    $scope.Restrict_LastPassword = response.data.Restrict_LastPassword;
                    $scope.MaxLoginTime = response.data.MaxLoginTime;
                    $scope.MaxLoginHours = response.data.MaxLoginHours;
                    $scope.MaxLoginMins = response.data.MaxLoginMins;
                    $scope.Created_By = response.data.Created_By;
                    $scope.Remember_Password = response.data.Remember_Password;
                    $scope.Created_Dt = response.data.Created_Dt;
                }
                $("#chatLoaderPV").hide();
                //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
                //$scope.NewPassword = "";
            }, function errorCallback(response) { 
            });

        };

        //view function for password policy
        $scope.PasswordPolicyDetails = function () {
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
            $http.get(baseUrl + '/api/Common/PasswordPolicyDetails_View/?Institution_Id=' + $scope.InstituteId).then(function (response) {
                if (response.data != null) {
                    $scope.Institution_Id = response.data.Institution_Id;
                    $scope.Insitution_Name = response.data.Insitution_Name;
                    $scope.Minimum_Length = response.data.Minimum_Length;
                    $scope.Maximum_Length = response.data.Maximum_Length;
                    $scope.UpperCase_Required = response.data.UpperCase_Required;
                    $scope.LowerCase_Required = response.data.LowerCase_Required;
                    $scope.Numeric_Required = response.data.Numeric_Required;
                    $scope.SpecialChar_Required = response.data.SpecialChar_Required;
                    $scope.Without_Char = response.data.Without_Char;
                    $scope.AllowExpiryDays = response.data.AllowExpiryDays;
                    $scope.Expiry_Period = response.data.Expiry_Period;
                    $scope.Allow_UserName = response.data.Allow_UserName;
                    $scope.Restrict_LastPassword = response.data.Restrict_LastPassword;
                    $scope.MaxLoginTime = response.data.MaxLoginTime;
                    $scope.MaxLoginHours = response.data.MaxLoginHours;
                    $scope.MaxLoginMins = response.data.MaxLoginMins;
                    $scope.Created_By = response.data.Created_By;
                    $scope.Remember_Password = response.data.Remember_Password;
                    $scope.Created_Dt = response.data.Created_Dt;
                }
            }, function errorCallback(response) {
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
        //$('#ChangepasswordpopupModal').on('hide.bs.modal', function () {
        //    //window.location.href = baseUrl + "/Home/Index#/home";
        //    var res = $rootScope.previousPage.split("/");
        //    if (res[res.length - 2].toLowerCase() == "changepassword") {
        //        window.location.href = baseUrl + "/Home/Index#/home";
        //    }
        //    else {
        //        window.location.href = $rootScope.previousPage;
        //    }

        //    //$PreviousState.goToLastState();
        //})

        /**Cancel Change Password Popup function**/
        $scope.CancelChangePasswordPopup = function () {
            angular.element('#ChangepasswordpopupModal').modal('hide');
        };



    }
]);