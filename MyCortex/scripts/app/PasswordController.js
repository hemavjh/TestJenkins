var Passwordcontroller = angular.module("PasswordController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

Passwordcontroller.controller("PasswordController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', '$timeout', '$rootScope', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, $timeout, $rootScope, toastr) {
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
                //alert("Please enter Password");
                toastr.warning("Please enter Password", "warning");
                return false;
            }

            if (typeof ($scope.NewPassword) == "undefined" || $scope.NewPassword == '') {
                //alert("Please enter New password");
                toastr.warning("Please enter Password", "warning");
                return false;
            }
            else if (typeof ($scope.confirmpassword) == "undefined" || $scope.confirmpassword == '') {
                //alert("Please enter Confirm password");
                toastr.warning("Please enter Confirm password", "warning");
                return false;
            }

            else if (($scope.confirmpassword) != ($scope.NewPassword)) {
                //alert("New password and Confirm Password mismatch Please enter same password");
                toastr.warning("New password and Confirm Password mismatch Please enter same password", "warning");
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
                    toastr.warning("Please enter atleast one special character ", "warning");
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
                    toastr.info("Username and password is same, please check the password", "info");
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
                    toastr.warning("Please enter atleast one uppercase letter ", "warning");
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
                    toastr.warning("Please enter atleast one lowercase letter ", "warning");
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
                //alert("Please select User Type");
                toastr.warning("Please select User Type", "warning");
                return false;
            }
            if (typeof ($scope.User_Selected) == "undefined" || $scope.User_Selected == '') {
                //alert("Please select User");
                toastr.warning("Please select User", "warning");
                return false;
            }
            if (typeof ($scope.NewPassword) == "undefined" || $scope.NewPassword == '') {
                //alert("Please enter New password");
                toastr.warning("Please enter New password", "warning");
                return false;
            }
            if (typeof ($scope.ReenterPassword) == "undefined" || $scope.ReenterPassword == '') {
                //alert("Please enter Re-enter password");
                toastr.warning("Please enter Re-enter password", "warning");
                return false;
            }
            if (($scope.NewPassword) != ($scope.ReenterPassword)) {
                //alert("New password and Re-enter Password mismatch please enter same password");
                toastr.warning("New password and Re-enter Password mismatch please enter same password", "warning");
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
                    toastr.warning("Please enter atleast one special character ", "warning");
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
                    toastr.info("Username and password is same, please check the password", "info");
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
                    toastr.warning("Please enter atleast one uppercase letter ", "warning");
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
                    toastr.warning("Please enter atleast one lowercase letter ", "warning");
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
                $scope.NewPassword = $scope.NewPassword.replace(/(#|&)/g, "amp");
                $scope.confirmpassword = $scope.confirmpassword.replace(/(#|&)/g, "amp");
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
        $http.get(baseUrl + '/api/Login/Usertypedetailslist/').success(function (data) {
            //$scope.Usertypelist = data;
            $scope.Usertypelist = [];
            $("#chatLoaderPV").show();
            //$scope.$broadcast('angucomplete-alt:clearInput', 'Div1');
            //$scope.NewPassword = "";
            angular.forEach(data, function (row, value) {
                if (row.Id != 1)
                    $scope.Usertypelist.push(row)
            });
            $("#chatLoaderPV").hide();
        });

        /* User basic details list*/
        $scope.Userdetailsdatalist = function () {
            $("#chatLoaderPV").show();
            $http.get(baseUrl + '/api/Login/Userdetailslist/?UserTypeId=' + $scope.UserTypeName + '&InstitutionId=' + $scope.InstituteId).success(function (data) {
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

     /*   $scope.UserTypeChange = function () {

            var UserTypeName = document.getElementById('Select2').value;
            if (UserTypeName != "0") {
                $('#divUserType').removeClass("ng-invalid");
                $('#divUserType').addClass("ng-valid");
            }
            else {
                $('#divUserType').removeClass("ng-valid");
                $('#divUserType').addClass("ng-invalid");
            }
        }
*/
        
     
        /*
       Call the api method for insert and Update the record for a reset password
       and display the record of selected reset password when Id is greater than 0
       in edit.html and provide an option for create and modify the reset password and save the reset password record
       */
        $scope.ResetPassword = function () {
            $scope.submitted = false;
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
                            + '&InstitutionId=' + $window.localStorage['InstitutionId']).success(function (data) {
                                //alert(data.Message);
                                toastr.success(data.Message, "success");
                                $('#btn-signup').attr("disabled", false);
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
                //alert("Please enter Minimum Length");
                toastr.warning("Please enter Minimum Length", "warning");
                return false;
            }
            else if (typeof ($scope.Maximum_Length) == "undefined" || $scope.Maximum_Length == "") {
                //alert("Please enter Maximum Length");
                toastr.warning("Please enter Maximum Length", "warning");
                return false;
            }
            else if (parseInt($scope.Maximum_Length) < parseInt($scope.Minimum_Length)) {
                //alert("Please enter Maximum Length greater than Minimum Length");
                toastr.warning("Please enter Maximum Length greater than Minimum Length", "warning");
                return false;
            }
            else if (typeof ($scope.Expiry_Period) == "undefined" || $scope.Expiry_Period == "" && $scope.AllowExpiryDays != 0) {
                //alert("Please enter Password  Expiry Period");
                toastr.warning("Please enter Password  Expiry Period", "warning");
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

                $http.post(baseUrl + '/api/Common/PasswordPolicy_InsertUpdate/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 2) {
                        toastr.success(data.Message, "success");
                    }
                    $('#btnsave').attr("disabled", false);
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
                    if ($scope.AllowExpiryDays == true) {
                        $("Text4").removeClass("ng-invalid");
                        $("Text4").addClass("ng-valid");
                    }
                    else {
                        $("Text4").removeClass("ng-valid");
                        $("Text4").addClass("ng-invalid");
                    }
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
            if ($scope.AllowExpiryDays == true) {
                $("#Text4").removeClass('ng-invalid');
                $("#Text4").addClass('ng-valid');
            }
            else {
                $("#Text4").removeClass('ng-valid');
                $("#Text4").addClass('ng-invalid');
            }
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