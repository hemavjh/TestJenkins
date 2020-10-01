'use strict';
EmpApp.factory('authInterceptorService', ['$q', '$location', function ($q, $location) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};

        //var authData = localStorageService.get('authorizationData');
        var token = 'xKvLXRpWEJRg219mEea6V_EkwZ5aq-TW3FeYeIuwM7geO9libRAU5J3nulSRy-swfg3tVCaA6mqvD_CG8J-h6JqcizS8URkuaN3ZUDoxfz0cW9kKpn7s7pTxv1gjWMHC64G9Wn3tMHOo1OvOnBI7NnAkmYnq5EzFLgBMfYJr_Uc26kU0sS7TZQOIdGAP3PmZfTHT2UFrwRQRoNyA3DLXW3bSMR2S8A2jHU_27gWsy3_sbdOBjJi_RJie7KcKG4M8dQ4UCKdlWvyCcU7xP5gkyzH1-ZIGgChqRJMFBfmUsXoDC0sbAbs9cHwOTiNNY7sZ';
        if (authData) {
            config.headers.Authorization = 'Bearer ' + token;//authData.token;
        }

        return config;
    }

    var _responseError = function (rejection) {
        alert(rejection.status);
        if (rejection.status === 401) {
            //$location.path('/login');

            $window.location.href = baseUrl + "/Home/LoginIndex#/";
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);