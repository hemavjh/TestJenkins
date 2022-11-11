var MyCortexControllers = angular.module("AllyControllers", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}

var DatetimepickerdtToday = new Date();
var Datetimepickermonth = DatetimepickerdtToday.getMonth() + 1;
var Datetimepickerday = DatetimepickerdtToday.getDate();
var Datetimepickeryear = DatetimepickerdtToday.getFullYear();
if (Datetimepickermonth < 10)
    Datetimepickermonth = '0' + Datetimepickermonth.toString();
if (Datetimepickerday < 10)
    Datetimepickerday = '0' + Datetimepickerday.toString();
var DatetimepickermaxDate = Datetimepickeryear + '-' + Datetimepickermonth + '-' + Datetimepickerday;

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
                    if (changeEvent.target.files.length !== 0) {
                            reader.readAsDataURL(changeEvent.target.files[0]);
                    }
                });
            }
        }
    }
]);

MyCortexControllers.directive("filereadmulti", [
    function () {
        return {
            scope: {
                filereadmulti:"=?"
            },
            
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.filereadmulti = [];
                    //console.log(this.hasOwnProperty('filereadmulti'))
                    if (changeEvent.target.files.length <= 4) {
                        for (var i = 0; i < changeEvent.target.files.length; i++) {
                            var reader;
                            reader = new FileReader();

                            reader.onload = function (loadEvent) {
                                scope.$apply(function () {
                                    scope.filereadmulti.push(loadEvent.target.result);
                                });
                            }
                            if (changeEvent.target.files.length !== 0) {
                                reader.readAsDataURL(changeEvent.target.files[i]);
                            }
                        }
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
        element.datepicker({
            dateFormat: "dd-MMM-yyyy"
        });
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

MyCortexControllers.service('InstSub', ['$log', function ($log) {
    this.myService = 0;
    this.SubscriptionInstiID = 0;
    return {
        getInstiID: function () {
            return this.myService;
        },
        setInstiID: function (data) {
            this.myService = data;
        },
        getSubID: function () {
            return this.SubscriptionInstiID;
        },
        setSubID: function (data) {
            this.SubscriptionInstiID = data;
        }
    };
}]);

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