var LanguageSettingscontroller = angular.module("LanguageSettingsController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


LanguageSettingscontroller.controller("LanguageSettingsController", ['$scope', '$http', '$routeParams', '$location', '$rootScope', '$window', '$filter', 'filterFilter', 'toastr',
    function ($scope, $http, $routeParams, $location, $rootScope, $window, $filter, $ff, toastr) {
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
            if ($window.localStorage['UserTypeId'] == 3) {
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
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.LanguageSettingsDetails = [];
        $scope.LanguageSettings_AddEdit = function () {
            $("#chatLoaderPV").show();
            angular.forEach($scope.rowCollectionLanguageSettings, function (value, index) {
                var obj = {
                    ID: value.ID,
                    INSTITUTION_ID: $window.localStorage['InstitutionId'],
                    LANGUAGE_ID: parseInt($scope.selectedLanguage),
                    LANGUAGE_TEXT: $scope.LanguageText[value.ID],
                    LANGUAGE_KEY: $scope.rowCollectionLanguageSettings[index].LANGUAGE_KEY,
                    LANGUAGE_DEFAULT: $scope.rowCollectionLanguageSettings[index].LANGUAGE_DEFAULT
                }
                $('#save').attr("disabled", true);
                $scope.LanguageSettingsDetails.push(obj);
            });

            $http.post(baseUrl + '/api/LanguageSettings/LanguageSettings_AddEdit/', $scope.LanguageSettingsDetails).success(function (data) {
                $scope.LanguageSettingsDetails = [];
                $scope.LanguageText = [];
                $scope.searchqueryLanguageSettings = "";
                $scope.LanguageSettingsList();
                $("#chatLoaderPV").hide();
                //alert("LanguageSettings Data saved successfully");
                toastr.success("LanguageSettings Data saved successfully", "success");
                $('#save').attr("disabled", false);
                $scope.IsEdit = false;
            });

        };

        $scope.LanguageDefaultSave = function () {
            $("#chatLoaderPV").show();
            $('#btnsave').attr("disabled", true);
            $http.get(baseUrl + '/api/LanguageSettings/LanguageDefault_Save/?Institution_Id=' + $window.localStorage['InstitutionId'] + '&Language_Id=' + $scope.selectedLanguage
            ).success(function (data) {
                if (data == 1) {
                    $scope.LanguageList();
                    $("#chatLoaderPV").hide();
                    //alert("Saved successfully.");
                    toastr.success("Saved successfully.", "success");
                    $('#btnsave').attr("disabled", false);
                }
                else {
                    $("#chatLoaderPV").hide();
                    //alert("Error occurred.");
                    toastr.error("Error occurred.", "warning");
                }
            })
        }

        $scope.SampleLanguageExport = function () {
            var data = document.getElementById('language_excel_format');
            var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
            XLSX.write(file, { bookType: 'xlsx', bookSST: true, type: 'base64' });
            XLSX.writeFile(file, 'sample.xlsx');
        }

        $scope.LanguageExport = function () {
            var data = document.getElementById('language_table');
            var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
            XLSX.write(file, { bookType: 'xlsx', bookSST: true, type: 'base64' });
            XLSX.writeFile(file, 'language.xlsx');
        }

        $scope.SelectFile = function (file) {
            $scope.SelectedFile = file;
        };
        $scope.Upload = function () {
            var regex = /^(.*)+(.xls|.xlsx)$/;
            if (regex.test($scope.SelectedFile.name.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    $scope.rowCollectionLanguageSettings = [];
                    var reader = new FileReader();
                    //For Browsers other than IE.
                    if (reader.readAsBinaryString) {
                        reader.onload = function (e) {
                            $scope.ProcessExcel(e.target.result);
                        };
                        reader.readAsBinaryString($scope.SelectedFile);
                    } else {
                        //For IE Browser.
                        reader.onload = function (e) {
                            var data = "";
                            var bytes = new Uint8Array(e.target.result);
                            for (var i = 0; i < bytes.byteLength; i++) {
                                data += String.fromCharCode(bytes[i]);
                            }
                            $scope.ProcessExcel(data);
                        };
                        reader.readAsArrayBuffer($scope.SelectedFile);
                    }
                } else {
                    toastr.error("This browser does not support HTML5.", "warning");
                }
            } else {
                toastr.error("Please upload a valid Excel file.", "warning");
            }
        };

        $scope.ProcessExcel = function (data) {
            //Read the Excel File data.
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            //Fetch the name of First Sheet.
            var firstSheet = workbook.SheetNames[0];

            //Read all rows from First Sheet into an JSON array.
            var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

            //Display the data from Excel file in Table.
            $scope.$apply(function () {
                $scope.LanguageText = excelRows.map(x => x.LANGUAGE_TEXT);
                $scope.rowCollectionLanguageSettings = excelRows;
            });
        };
    }
]);