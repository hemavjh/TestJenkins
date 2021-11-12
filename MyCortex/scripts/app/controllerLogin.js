var EmpApp = angular.module('AllyController', [
    'ngRoute',
    'AllyControllersLogin',
    'toastr'
]);


EmpApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    var baseUrl = $("base").first().attr("href");

    $routeProvider.
    when('/login', {
        templateUrl: baseUrl + 'Login/Views/Login.html',
        controller: 'LoginController'
    }).
    when('/signup/:InstitutionCode', {
        templateUrl: baseUrl + 'Login/Views/Signup.html',
        controller: 'SignupController'
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

var MyCortexControllers = angular.module("AllyControllersLogin", []);
var baseUrl = $("base").first().attr("href");
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
    $scope.InsuranceId = "";
    $scope.GenderId = "0";
    $scope.NationalityId = "0";
    $scope.EmailId = "";
    $scope.MobileNo = "";
    $scope.UserTypeId = 2;
    $scope.NationalityList = [];
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
    $scope.forgotPasswordEmail = "";
    $scope.forgotPasswordValidate = function () {
        if (typeof ($scope.forgotPasswordEmail) == "undefined" || $scope.forgotPasswordEmail == "") {
            alert("Please enter Email");
            return false;
        }

        else if (EmailFormate($scope.forgotPasswordEmail) == false) {
            alert("Invalid Email format");
            return false;
        }
        $http.get(baseUrl + '/api/Login/ForgotPassword/?EmailId=' + $scope.forgotPasswordEmail).success(function (data) {
            if (data != null) {
                alert(data.Message)
                if (data.ReturnFlag == "1") {
                    angular.element('#forgotPasswordModal').modal('hide');
                    $scope.forgotPasswordEmail = "";
                }
            }
            else {
                alert("This Email is not registered, Invalid Email")
            }
        }).error(function (data) {
            alert("This Email is not registered, Invalid Email")
            $scope.error = "An error has occurred while deleting reset password details" + data;
        });
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
        else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
            alert("Please select Date of Birth");
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
            alert("Invalid Email format");
            return false;
        }
        else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
            alert("Please enter Mobile No.");
            return false;
        }
        return true;
    };
    $http.get(baseUrl + '/api/Login/GetProduct_Details/').success(function (data) {
        $scope.ProductName1 = data[0].ProductName;
        var chk = $window.localStorage['inactivity_logout'];
        if (chk === '1') {
            $scope.errorlist = 'Your session has expired, please provide your credentials to login again.';
            $window.localStorage['inactivity_logout'] = '0';
        }
        if ($scope.ProductName1 == 'MyCortex') {
            $scope.Productlogin = 0;
        } else {
            $scope.Productlogin = 1;
        }
    });
    $http.get(baseUrl + '/api/Login/getProductName/').success(function (data) {
        var ProductName = data;
        $('#productname').val(ProductName["instanceId"]);
        if ($('#productname').val() == "1") {
            $scope.prdName = "MyHealth";
            $scope.prductName = " MyHealth?";
        } else if ($('#productname').val() == "2") {
            $scope.prdName = "STC MyCortex";
            $scope.prductName = " STC MyCortex?";
        } else {
            $scope.prdName = "MyCortex  ";
            $scope.prductName = " MyCortex?";
        }
    });
            
        

    /*This is Insert Function for SignUp */
    $scope.SignupLogin_AddEdit = function () {
        if ($scope.SignupLogin_AddEdit_Validations() == true) {
            // window.location.href = baseUrl + "/Home/Index#;
            $("#chatLoaderPV").show();
            var tokendata = "UserName=admin&Password=admin&grant_type=password"
            $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;

                var data = {
                    Id: $scope.Id,
                    FirstName: $scope.FirstName,
                    MiddleName: $scope.MiddleName,
                    LastName: $scope.LastName,
                    NATIONALID: $scope.NationalId,
                    INSURANCEID: $scope.InsuranceId,
                    MNR_NO: $scope.MNR_No,
                    GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                    NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                    DOB: moment($scope.DOB).format('DD-MMM-YYYY'),
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
                $http.post(baseUrl + 'api/User/User_InsertUpdate?Login_Session_Id={00000000-0000-0000-0000-000000000000}', data, config).success(function (data) {
                    alert(data.Message);
                    $scope.CancelSignUpPopup();
                    if ($scope.MenuTypeId == 3) {
                        $scope.ListRedirect();
                    }
                });
                $("#chatLoaderPV").hide();
            }).error(function (err) {
                console.log(err);
                $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                alert('error');
            });
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
        $scope.InsuranceId = "";
        $scope.GenderId = "0";
        $scope.NationalityId = "0";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.HideSignUpModal();
    }

    $('#signupModal').on('show.bs.modal', function () {
        if ($scope.NationalityList.length == 0) {
            // This is for to get Nationality List 
            $http.get(baseUrl + 'api/Common/NationalityList/').success(function (data) {
                $scope.NationalityList = data;
            });
        }
        if ($scope.GenderList.length == 0) {
            // This is for to get Gender List
            $http.get(baseUrl + 'api/Common/GenderList/').success(function (data) {
                $scope.GenderList = data;
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

        if (typeof ($scope.Username) == "undefined" || $scope.Username == "") {
            $scope.errorlist = "Please enter Email";
            $("#chatLoaderPV").hide();
            return false;
        }
        else if (typeof ($scope.Password) == "undefined" || $scope.Password == "") {
            $scope.errorlist = "Please enter Password";
            $("#chatLoaderPV").hide();
            return false;
        }
        return true;
    };

    var IpAddress = "";
    $http.get("http://api.ipify.org/?format=json").then(function (response) {
        IpAddress = response.data.ip;
    });

    var Login_Country = "";
    var Login_City = "";
    $http.get("http://ip-api.com/json").then(function (response) {
        Login_Country = response.data.country;
        Login_City = response.data.city
    });

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
        $("#chatLoaderPV").show();
        var offsetTime = new Date().getTimezoneOffset();

        $scope.errorlist = "";
        $http.get(baseUrl + '/api/Login/CheckDBConnection/').success(function (data) { 
            if (data == false) {
                $scope.errorlist = "Invalid DB Connection";
                return;
            }
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
                Login_IpAddress: IpAddress
            };

            //$http.get(baseUrl + '/api/Login/Userlogin_AddEdit/?Id=' + $scope.Id + '&UserName=' + $scope.Username + '&Password=' + $scope.Password).success(function (data) {
            $http.post(baseUrl + '/api/Login/Userlogin_CheckValidity/', obj).success(function (data) {
                $scope.UserId = data.UserId;
                $scope.UserTypeId = data.UserTypeId;
                $scope.InstitutionId = data.InstitutionId;
                $window.localStorage['UserId'] = $scope.UserId;
                $window.sessionStorage['UserId'] = $scope.UserId;
                $window.localStorage['Auth_Session_Id'] = 1;
                $window.localStorage['inactivity_logout'] = 0;
                $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                $window.localStorage['Login_Session_Id'] = data.Login_Session_Id;
                if ($scope.UserTypeId == 1) {
                    $window.localStorage['InstitutionId'] = -1;
                }
                else {
                    $window.localStorage['InstitutionId'] = $scope.InstitutionId;
                }
                var Message = data.Messagetype;

                if ($scope.remember == true) {
                    $rememberMeService('dXNlcm5hbWVocm1z', ($scope.Username));
                    $rememberMeService('cGFzc3dvcmRocm1z', ($scope.Password));
                    $rememberMeService('cmVtZW1iZXJocm1z', ($scope.remember));

                } else {
                    $rememberMeService('dXNlcm5hbWVocm1z', '');
                    $rememberMeService('cGFzc3dvcmRocm1z', '');
                    $rememberMeService('cmVtZW1iZXJocm1z', '');
                }

                var data = data.data;
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
                var tokendata = "UserName=" + UserName + "&Password=" + Password +"&grant_type=password"
                $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;
                }).error(function (err) {                   
                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                    console.log(err);
                });
                $scope.ConfigCode = "WEBIDLETIME";
                var IdleDays = 0;
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId'])
                    .success(function (data1) {
                        if (data1[0] != undefined) {
                            IdleDays = parseInt(data1[0].ConfigValue);
                            $window.localStorage['IdleDays'] = IdleDays;
                            $scope.UserLogin(data, Message);
                        } else {
                            IdleDays = 600;
                            $window.localStorage['IdleDays'] = IdleDays;
                            $scope.UserLogin(data, Message);
                        }
                    }).error(function (err) {
                        IdleDays = 600;
                        $window.localStorage['IdleDays'] = 600;
                        $scope.UserLogin(data, Message);
                    }); 
            }).error(function (data) {
                $("#chatLoaderPV").hide();
                $scope.errorlist = "Login Failed! \n Invalid Username or Password ";
            });
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
            window.location.href = baseUrl + "/Home/Index#/home";
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
            $scope.errorlist = "Username and/or Password are not active, please verify";
            toastr.error("Username and/or Password are not active, please verify", "Warning");
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
                        $http.post(baseUrl + '/api/Login/Userlogin_CheckValidity/', obj).success(function (data) {
                            $scope.UserId = data.UserId;
                            $scope.UserTypeId = data.UserTypeId;
                            $scope.InstitutionId = data.InstitutionId;
                            $window.localStorage['UserId'] = $scope.UserId;
                            $window.localStorage['UserTypeId'] = $scope.UserTypeId;
                            $window.localStorage['Login_Session_Id'] = data.Login_Session_Id;

                            if ($scope.UserTypeId == 1) {
                                $window.localStorage['InstitutionId'] = -1;
                            }
                            else {
                                $window.localStorage['InstitutionId'] = $scope.InstitutionId;
                            }
                            var Message = data.Messagetype;

                            if ($scope.remember == true) {
                                $rememberMeService('dXNlcm5hbWVocm1z', ($scope.Username));
                                $rememberMeService('cGFzc3dvcmRocm1z', ($scope.Password));
                                $rememberMeService('cmVtZW1iZXJocm1z', ($scope.remember));

                            } else {
                                $rememberMeService('dXNlcm5hbWVocm1z', '');
                                $rememberMeService('cGFzc3dvcmRocm1z', '');
                                $rememberMeService('cmVtZW1iZXJocm1z', '');
                            }

                            var data = data.data;
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
                            $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                                $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;
                            }).error(function (err) {
                                $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                                console.log(err);
                            });	
                            $scope.ConfigCode = "WEBIDLETIME";
                            var IdleDays = 0;
                            $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $window.localStorage['InstitutionId'])
                                .success(function (data1) {
                                    if (data1[0] != undefined) {
                                        IdleDays = parseInt(data1[0].ConfigValue);
                                        $window.localStorage['IdleDays'] = IdleDays;
                                        $scope.UserLogin(data, Message);
                                    } else {
                                        IdleDays = 600;
                                        $window.localStorage['IdleDays'] = IdleDays;
                                        $scope.UserLogin(data, Message);
                                    }
                                }).error(function (err) {
                                    IdleDays = 600;
                                    $window.localStorage['IdleDays'] = 600;
                                    $scope.UserLogin(data,);
                                });  
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

    $http.get(baseUrl + '/api/Login/CheckExpiryDate/').success(function (data) {
        if (data == true) {
            $scope.errorlist = "Your MyCortex version is outdated. Please contact Administrator for upgrade or email us on admin@mycortex.health";
            $scope.isExpired = true;
        }
    });
}
]);

/* THIS IS FOR SIGNUP CONTROLLER FUNCTION */
MyCortexControllers.controller("SignupController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', '$rootScope', '$timeout', 'rememberMe', 'filterFilter',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $rootScope, $timeout, $rememberMeService, $ff) {
        //Declaration and initialization of Scope Variables.    
        $scope.InstitutionCode = $routeParams.InstitutionCode;
        $scope.InstitutionId = 0;
        $scope.Id = "0";
        $scope.FirstName = "";
        $scope.MiddleName = "";
        $scope.LastName = "";
        $scope.MNR_No = "";
        $scope.PrefixMRN = "";
        $scope.PatientNo = "";
        $scope.NationalId = "";
        $scope.InsuranceId = "";
        $scope.GenderId = "0";
        $scope.NationalityId = "0";
        $scope.EmailId = "";
        $scope.MobileNo = "";
        $scope.UserTypeId = 2;
        $scope.NationalityList = [];
        $scope.GenderList = [];
        $window.localStorage['UserId'] = "0";
        $scope.SelectedLanguage = 0;
        $scope.InstitutionLanguageList = [];
        $scope.emptydataLanguageSettings = [];
        $scope.rowCollectionLanguageSettings = [];

        $scope.firstname = "First Name";
        $scope.middlename = "Middle Name";
        $scope.lastname = "Last Name";
        $scope.mrnnumber = "MRN number";
        $scope.nationalityid = "Nationality ID";
        $scope.insuranceid = "Insurance ID";
        $scope.gender = "Gender";
        $scope.nationality = "Nationality";
        $scope.dob = "DOB";
        $scope.email = "Email";
        $scope.mobilenumber = "Mobile Number";
        $scope.changelanguage = "Change Language";
        
        $scope.defaultsignupacknowledgement = "By submitting this form you agree to share your medical information with MyCortex team for the purposes of medical evaluation and follow up.";
        $scope.signupacknowledgement = "By submitting this form you agree to share your medical information with MyCortex team for the purposes of medical evaluation and follow up.";
        if ($scope.InstitutionCode == "") {
            $scope.institutionName = "MyCortex";
        } else {
            $http.get(baseUrl + 'api/User/GetInstitutionName/?Code=' + $scope.InstitutionCode).success(function (indata) {
                if (indata != "") {
                    $scope.institutionName = indata;
                } else {
                    $scope.institutionName = "MyCortex";
                }
                 
            }); 
        }
        

        $http.get(baseUrl + 'api/User/GetInstitutionFromCode/?Code=' + $scope.InstitutionCode).success(function (data) {
            if (data !== 0) {
                $scope.InstitutionId = data;
                $scope.SelectedInstitutionId = data;
                //if ($scope.SelectedInstitutionId != "") {
                $scope.ConfigCode = "MRN_PREFIX";
                $http.get(baseUrl + '/api/Common/AppConfigurationDetails/?ConfigCode=' + $scope.ConfigCode + '&Institution_Id=' + $scope.SelectedInstitutionId).success(function (data2) {
                    $scope.PrefixMRN = data2[0].ConfigValue;
                });
                //}
                $http.get(baseUrl + '/api/Common/getInstitutionLanguages/?Institution_Id=' + $scope.InstitutionId
                ).success(function (data) {
                    $scope.InstitutionLanguageList = [];
                    $scope.InstitutionLanguageList = data;
                    $scope.selectedLanguage = data[0].DefaultLanguageId.toString();
                    sessionid = $scope.uuid4();
                    $http.get(baseUrl + '/api/LanguageSettings/LanguageSettings_List/?Institution_Id=' + $scope.InstitutionId + '&Login_Session_Id=' + sessionid
                    ).success(function (data) {
                        $scope.emptydataLanguageSettings = [];
                        $scope.rowCollectionLanguageSettings = [];
                        $scope.rowCollectionLanguageSettingsFilter = angular.copy(data);
                        $scope.rowCollectionLanguageSettings = data.filter(item => item.LANGUAGE_ID === parseInt($scope.selectedLanguage));
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
                    }).error(function (data) {
                        $scope.error = "AN error has occured while Listing the records!" + data;
                        //$("#chatLoaderPV").hide();
                    })
                }).error(function (data) {
                    $scope.error = "AN error has occured while Listing the records!" + data;
                });
            }
            else {
                alert("There is no Institution for this code!!!");
            }
        }).error(function (data) {
            $scope.error = "AN error has occured while Listing the records!" + data;
        });

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
                        alert(masterVal.LANGUAGE_TEXT);
                    }
                });
                return false;
            }
            //else if (typeof ($scope.MNR_No) == "undefined" || $scope.MNR_No == "") {
            //    alert("Please enter MRN No.");
            //    return false;
            //}
            else if (typeof ($scope.NationalId) == "undefined" || $scope.NationalId == "") {
                alert("Please enter NationalId.");
                return false;
            }
            else if (typeof ($scope.InsuranceId) == "undefined" || $scope.InsuranceId == "") {
                angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                    if (masterVal.LANGUAGE_KEY === "pleaseenteravalidinsuranceid") {
                        alert(masterVal.LANGUAGE_TEXT);
                    }
                });
                return false;
            }
            else if (typeof ($scope.GenderId) == "undefined" || $scope.GenderId == "0") {
                angular.forEach($scope.rowCollectionLanguageSettings, function (masterVal, masterInd) {
                    if (masterVal.LANGUAGE_KEY === "selectgender") {
                        alert(masterVal.LANGUAGE_TEXT);
                    }
                });
                return false;
            }
            else if (typeof ($scope.NationalityId) == "undefined" || $scope.NationalityId == "0") {
                alert("Please select Nationality");
                return false;
            }
            else if (typeof ($scope.DOB) == "undefined" || $scope.DOB == "") {
                alert("Please select Date of Birth");
                return false;
            } 
            if ((ParseDate($scope.DOB)) > (ParseDate(today))) {
                alert("DOB Can Be Only select past date");
                $scope.DOB = DateFormatEdit($scope.DOB);
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
                alert("Invalid Email format");
                return false;
            }
            else if (typeof ($scope.MobileNo) == "undefined" || $scope.MobileNo == "") {
                alert("Please enter Mobile No.");
                return false;
            }
            $scope.DOB = DateFormatEdit($scope.DOB);
            return true;
        };

        $http.get(baseUrl + '/api/Login/getProductName/').success(function (data) {
            var ProductName = data;
            $('#productname').val(ProductName["instanceId"]);
            if ($('#productname').val() == "1") {
                $scope.prdName = "MyHealth";
                $scope.prductName = " MyHealth?";
            } else if ($('#productname').val() == "2") {
                $scope.prdName = "STC MyCortex";
                $scope.prductName = " STC MyCortex?";
            } else {
                $scope.prdName = "MyCortex  ";
                $scope.prductName = " MyCortex?";
            }
        });

        /*This is Insert Function for SignUp */
        $scope.SignupLogin_AddEdit = function () {
            if ($scope.SignupLogin_AddEdit_Validations() == true) {
                // window.location.href = baseUrl + "/Home/Index#;
                $("#chatLoaderPV").show();
                var tokendata = "UserName=admin&Password=admin&grant_type=password"
                $http.post(baseUrl + 'token', tokendata, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = response.access_token;

                    var data = {
                        Id: $scope.Id,
                        INSTITUTION_CODE: $scope.InstitutionCode,
                        FirstName: $scope.FirstName,
                        MiddleName: $scope.MiddleName,
                        LastName: $scope.LastName,
                        NATIONALID: $scope.NationalId,
                        INSURANCEID: $scope.InsuranceId,
                        //MNR_NO: $scope.MNR_No,
                        GENDER_ID: $scope.GenderId == 0 ? null : $scope.GenderId,
                        NATIONALITY_ID: $scope.NationalityId == 0 ? null : $scope.NationalityId,
                        DOB: $scope.DOB,
                        EMAILID: $scope.EmailId,
                        MOBILE_NO: $scope.MobileNo,
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
                    $http.post(baseUrl + 'api/User/User_InsertUpdate?Login_Session_Id={00000000-0000-0000-0000-000000000000}', data, config).success(function (data) {
                        $("#chatLoaderPV").hide();
                        if (data.ReturnFlag == 1) {
                            alert("You have been signed up successfully");
                            $scope.CancelSignUpPopup();
                        } else {
                            alert(data.Message);
                        }
                        //if ($scope.MenuTypeId == 3) {
                        //    $scope.ListRedirect();
                        //}
                    }).error(function (err) {
                        $("#chatLoaderPV").hide();
                        console.log(err);
                        alert(err);
                    });
                    //$("#chatLoaderPV").hide();
                }).error(function (err) {
                    console.log(err);
                    $window.localStorage['dFhNCjOpdzPNNHxx54e+0w=='] = '';
                    alert('error');
                });
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
            $scope.InsuranceId = "";
            $scope.GenderId = "0";
            $scope.NationalityId = "0";
            $scope.EmailId = "";
            $scope.MobileNo = "";
            $scope.DOB = "";
            //$scope.HideSignUpModal();
        }

        // This is for to get Nationality List 
        $http.get(baseUrl + 'api/Common/NationalityList/').success(function (data) {
            $scope.NationalityList = data;
        });

        // This is for to get Gender List
        $http.get(baseUrl + 'api/Common/GenderList/').success(function (data) {
            $scope.GenderList = data;
        });

        var Login_Country = "";
        var Login_City = "";
        $http.get("http://ip-api.com/json").then(function (response) {
            Login_Country = response.data.country;
            Login_City = response.data.city
        });

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