var MonitoringProtocol = angular.module("MonitoringProtocolController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


MonitoringProtocol.controller("MonitoringProtocolController", ['$scope', '$http', '$filter', '$routeParams', '$rootScope', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $rootScope, $location, $window, $ff, toastr) {

        $scope.isPatientMonitornigProtocol = "";
        $http.get(baseUrl + "/api/CommonMenu/CommonModule_List?InsId=" + $window.localStorage['InstitutionId']).success(function (response) {
            if (response != null) {
                if (response.length > 0) {
                    $scope.isPatientMonitornigProtocol = $filter('filter')(response, { Module_Name: "Monitoring Protocol" })[0];
                }
            }
        });

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



        $scope.CloneFromChange = function () {

            var Protocol_Names = document.getElementById('Select1').value;
            if (Protocol_Names != "0") {
                $('#divCloneProtocol').removeClass("ng-invalid");
                $('#divCloneProtocol').addClass("ng-valid");
            }
            else {
                $('#divCloneProtocol').removeClass("ng-valid");
                $('#divCloneProtocol').addClass("ng-invalid");
            }
        }

        /* THIS IS OPENING POP WINDOW FORM LIST FOR ADD,VIEW AND EDIT */
        $scope.AddMonitoringProtocolPopup = function () {
            if (typeof ($scope.isPatientMonitornigProtocol) != 'undefined' && $scope.isPatientMonitornigProtocol != "") {
                $scope.submitted = false;
                $scope.IsAdd = 1;
                $('#btnsave').attr("disabled", false);
                angular.element('#ProtocolCreateModal').modal('show');
                $scope.MonitoringProtocolDropDownList();
            }
            else {
                toastr.warning("You Haven't Subscribed For This Module. Please Contact Your Administrator", "warning");
            }
        }

        $scope.AddCloneProtocolPopup = function () {
            $scope.submitted = false;
            $('#divCloneProtocol').addClass("ng-invalid");
            $scope.Cloneval = 1;
            $('#btnsave').attr("disabled", false);
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
            if ($window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 5 || $window.localStorage['UserTypeId'] == 7) {
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
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        };

        $scope.CloneProtocolList = [];
        $scope.CloneProtocolFunction = function () {
            $("#chatLoaderPV").show();
            //$http.get(baseUrl + 'api/Protocol/StandardProtocol_View/?Id=' + $scope.Protocol_Names).success(function (data) {
            //    $("#chatLoaderPV").hide();
            //    $scope.ParameterSettingslist = data;
            //    angular.forEach($scope.ParameterSettingslist, function (value, index) {
            //        // $scope.ProtocolName = value.ProtocolName;
            //        value.Id = "0";
            //    });

            //});

            $scope.ParameterSettingslist = [{
                // 'Id': 0,
                'Protocol_Id': 0,
                'ProtocolName': '',
                'Institution_Id': 0,
                'Institution_Name': '',
                'Diag_ParameterSettingslist': [{
                    'Id': 0,
                    'Parameter_Id': 0,
                    //'Comp_Parameter_Id': 0,
                    'ParameterName': '',
                    'Units_Id': '',
                    'UnitsName': '',
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
                    //'Comp_High': '',
                    //'Comp_Medium': '',
                    //'Comp_Low': '',
                    'Isactive': 1,
                    'Created_By': $scope.User_Id,
                    'NormalRange_High': '',
                    'NormalRange_Low': '',
                    //'occur_inter': true,
                    //'occur_inter_val': 0
                }],
                'Comp_ParameterSettingslist': [{
                    'Id': 0,
                    'Protocol_Id': 0,
                    'ProtocolName': '',
                    'Institution_Id': 0,
                    'Institution_Name': '',
                    'Parameter_Id': 0,
                    'ParameterName': '',
                    'Com_DurationType': 0,
                    'DurationName': '',
                    'Comp_Duration': '0',
                    'Isactive': 1,
                    'Created_By': $scope.User_Id,
                    'occur_inter': true,
                    'occur_inter_val': 0,
                    'duration_list': [],
                    'starttime': '',
                    'endtime': '',
                    'selectedDays': '',
                    'WeeklyData': $scope.weeklist
                }]
            }];
            $scope.Diagostic_ParameterSettingslist = [{
                'Id': 0,
                'Parameter_Id': 0,
                'ParameterName': '',
                'Units_Id': '',
                'UnitsName': '',
                'NormalRange_High': '',
                'NormalRange_Low': '',
                'Diag_Range': 0,
                'Diag_Range_Min': '',
                'Diag_Range_Max': ''
            }];
            $scope.Id = $scope.Protocol_Names;
            $scope.ProtocolDetails_View();
            $('#btnsave').attr("disabled", false);
            angular.element('#ProtocolCreateModal').modal('show');
            $scope.MonitoringProtocolDropDownList();
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
                        //alert("Standard parameter is not configured, Monitoring Protocol cannot be created");
                        toastr.info("Standard parameter is not configured, Monitoring Protocol cannot be created", "info");
                }
                $scope.IsAdd = 0;

            });

            $scope.DurationTypeList = [];
            $http.get(baseUrl + '/api/Protocol/DurationTypeDetails/').success(function (data) {
                $scope.DurationTypeList = data;
            });

            $http.get(baseUrl + '/api/ParameterSettings/ParameterMappingList/?Parameter_Id=0&Unitgroup_Type=1&Institution_Id=' + $scope.InstituteId).success(function (data) {
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

        $scope.ParameterSettings_Compliance = function (row) {
            ParamId = row.Parameter_Id;
            $scope.ViewParamList1 = $ff($scope.ViewParamList, { Parameter_ID: ParamId }, true);
        };


        /* on click view, view popup opened*/
        $scope.ViewProtocol = function (CatId) {
            $scope.ProtocolClear();
            $scope.CloneProtocolClear();
            $scope.Id = CatId;
            $scope.ProtocolDetails_View();
            angular.element('#ProtocolviewModal').modal('show');
        };

        $scope.occuren_change = function (ind) {
            $scope.occu_val = 0;
            $scope.duration_list = [];
        }
        $scope.Id = 0;
        $scope.ChildId = 0;
        $scope.InstituteId = 0;
        $scope.InstituteId = $window.localStorage['InstitutionId'];
        $scope.User_Id = $window.localStorage['UserId'];
        $scope.ParameterSettingslist = [];
        $scope.MonitoringDetails = [];
        $scope.occu_no = true;
        $scope.occu_val = '';
        $scope.occu_st = '';
        $scope.duration_list = [];
        $scope.weekdays = [{ day: 'S', status: 0, days: 'Su' }, { day: 'M', status: 0, days: 'Mo' }, { day: 'T', status: 0, days: 'Tu' }, { day: 'W', status: 0, days: 'We' }, { day: 'T', status: 0, days: 'Th' }, { day: 'F', status: 0, days: 'Fr' }, { day: 'S', status: 0, days: 'Sa' }];
        $scope.weeklist = [{ day: 'S', status: 0, days: 'Su' }, { day: 'M', status: 0, days: 'Mo' }, { day: 'T', status: 0, days: 'Tu' }, { day: 'W', status: 0, days: 'We' }, { day: 'T', status: 0, days: 'Th' }, { day: 'F', status: 0, days: 'Fr' }, { day: 'S', status: 0, days: 'Sa' }];
        $scope.weeks = 0;
        $scope.index = 0;
        $scope.Ranges = [{id: 0, name: 'Select'},{ id: 1, name: 'High' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Low' }, { id: 4, name: 'Low' }, { id: 5, name: 'Medium' }, { id: 6, name: 'High' }]
        $scope.Diagostic_ParameterSettingslist = [{
            'Id': 0,
            'Parameter_Id': 0,
            'ParameterName': '',
            'Units_Id': '',
            'UnitsName': '',
            'NormalRange_High': '',
            'NormalRange_Low': '',
            'Diag_Range': 0,
            'Diag_Range_Min': '',
            'Diag_Range_Max': ''
        }];
        $scope.Comp_Entry_Insert = function () {
            var x = $scope.occu_val;
            if (x > 0 && x <= 24 && x != '' && x != null && x != 'undefined') {
                var inse;
                if ($scope.occu_no) {
                    inse = x;
                } else {
                    inse = 24 / x;
                }
                var z = [];
                for (let i = 0; i < Math.floor(inse); i++) {
                    var y = { time: 0 };
                    z.push(y);
                }
                $scope.duration_list = z;
            } else {
                $scope.duration_list = [];
            }
        }

        $scope.settiming = function () {
            //console.log(data);
            var data = $scope.occu_st;
            var ho = data.getHours();
            var mi = data.getMinutes();
            if ($scope.occu_no) {
                var z = [];
                for (let i = 0; i < $scope.duration_list.length; i++) {
                    var t = ho + i + 1;
                    var dat = new Date();
                    dat.setHours(t);
                    dat.setMinutes(mi);
                    dat.setSeconds(0);
                    dat.setMilliseconds(0);
                    var y = {
                        time: dat
                    };
                    z.push(y);
                }
                $scope.duration_list = z;
            } else {
                var z = [];
                for (let i = 0; i < $scope.duration_list.length; i++) {
                    var t = ho + ((i + 1) * $scope.occu_val);
                    var dat = new Date();
                    dat.setHours(t);
                    dat.setMinutes(mi);
                    dat.setSeconds(0);
                    dat.setMilliseconds(0);
                    var y = {
                        time: dat
                    };
                    z.push(y);
                }
                $scope.duration_list = z;
            }
        }

        $scope.endtiming = function () {
            if ($scope.occu_et != null) {
                var endtime = new Date($scope.occu_et);
                var y = 0;
                for (var i = 0; i < $scope.duration_list.length; i++) {
                    if (endtime < $scope.duration_list[i].time) {
                        y = 1;
                        break;
                    }
                }
                if (y == 1) {
                    toastr.info("Entry is greater than end time", "info");
                }
            }
        }

        $scope.array = Array(24).fill().map((e, i) => i + 1);

        /* on click Edit, edit popup opened*/
        $scope.EditProtocol = function (CatId, activeFlag) {
            if (activeFlag == 1) {
                $scope.ProtocolClear();
                $scope.CloneProtocolClear();
                $scope.Id = CatId;
                $scope.ProtocolDetails_View();
                $('#btnsave').attr("disabled", false);
                angular.element('#ProtocolCreateModal').modal('show');
                $scope.MonitoringProtocolDropDownList();
            }
            else {
                //alert("Inactive record cannot be edited");
                toastr.info("Inactive record cannot be edited", "info");
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

        $scope.addFields = function () {
            var number = document.getElementById("member").value;
            var container = document.getElementById("container");
            while (container.hasChildNodes()) {
                container.removeChild(container.lastChild);
            }
            for (i = 0; i < number; i++) {
                container.appendChild(document.createTextNode("Timing " + (i + 1)));
                var input = document.createElement("input");
                input.type = "time";
                input.name = "member" + i;
                input.id = "member" + i;
                container.appendChild(input);
                container.appendChild(document.createElement("br"));
            }
            for (i = 0; i < number; i++) {
                var number = document.getElementById("member" + (i + 1)).value;
                console.log(number);
            }
        }

        $scope.ComplianceWeekly = 0;
        $scope.ChangeMethod = function () {
            if ($scope.Compliancealert == 2) {
                $scope.ComplianceWeekly = 1;
            } else if ($scope.Compliancealert == 3) {
                $scope.ComplianceWeekly = 2;
            } else {
                $scope.ComplianceWeekly = 0;
            }
        }

        

        $scope.ChangeDuration = function (rw, ind) {
            if (rw.Com_DurationType != null) {
                angular.element('#ProtocolDateModal').modal('show');
                angular.element('#ProtocolCreateModal').modal('hide');
                if (rw.Com_DurationType == 2) {
                    $scope.weeks = 1;
                } else {
                    $scope.weeks = 0;
                }
                $scope.occu_no = rw.occur_inter;
                $scope.occu_val = rw.occur_inter_val;
                if (new Date(rw.starttime).toString() != 'Invalid Date') {
                    $scope.occu_st = new Date(rw.starttime);
                } else {
                    $scope.occu_st = rw.starttime;
                }
                if (new Date(rw.endtime).toString() != 'Invalid Date') {
                    $scope.occu_et = new Date(rw.endtime);
                } else {
                    $scope.occu_et = rw.endtime;
                }
                for (var i = 0; i < rw.duration_list.length; i++) {
                    if (new Date(rw.duration_list[i].time).toString() != 'Invalid Date') {
                        rw.duration_list[i].time = new Date(rw.duration_list[i].time);
                    }
                }
                $scope.duration_list = rw.duration_list;
                if (rw.Com_DurationType == 2) {
                    $scope.weekdays = rw.WeeklyData;
                } else {
                    $scope.weekdays = $scope.weeklist;
                }
                $scope.index = ind;
            }
        }

        $scope.closeschedule = function () {
            angular.element('#ProtocolCreateModal').modal('show');
            angular.element('#ProtocolDateModal').modal('hide');
            $scope.occu_no = true;
            $scope.occu_val = '';
            $scope.occu_st = '';
            $scope.occu_et = '';
            $scope.duration_list = [];
            $scope.weekdays = [{ day: 'S', status: 0, days: 'Su' }, { day: 'M', status: 0, days: 'Mo' }, { day: 'T', status: 0, days: 'Tu' }, { day: 'W', status: 0, days: 'We' }, { day: 'T', status: 0, days: 'Th' }, { day: 'F', status: 0, days: 'Fr' }, { day: 'S', status: 0, days: 'Sa' }];
            $scope.weeks = 0;
            $scope.index = 0;
        }

        $scope.ProtocolCompParameter_AddEdit = function () {
            if ($scope.occu_val <= 0) {
                toastr.warning("Please give valid input data", "warning");
                return;
            }
            if (Date.parse($scope.occu_st).toString() == 'NaN') {
                toastr.warning("Please give valid start datetime", "warning");
                return;
            }
            if (Date.parse($scope.occu_et).toString() == 'NaN') {
                toastr.warning("Please give valid end datetime", "warning");
                return;
            }
            var y = 0;
            for (var i = 0; i < $scope.duration_list.length; i++) {
                if (Date.parse($scope.duration_list[i].time).toString() == 'NaN') {
                    y = 1;
                    break;
                }
            }
            if (y == 1) {
                toastr.warning("Please give valid monitor datetime", "warning");
                return;
            }
            for (var i = 0; i < $scope.duration_list.length; i++) {
                $scope.duration_list[i].localtime = angular.element('#rw' + i.toString()).val();
            }
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[$scope.index].occur_inter = $scope.occu_no;
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[$scope.index].occur_inter_val = $scope.occu_val;
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[$scope.index].starttime = angular.element('#occ_st').val();
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[$scope.index].endtime = angular.element('#occ_et').val();
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[$scope.index].duration_list = $scope.duration_list;
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[$scope.index].selectedDays = $scope.weekdays.filter(x => x.status == 1).map(x => x.days).join(',');
            $scope.closeschedule();
        }

        /* Validating the create page mandatory fields
       checking mandatory for the follwing fields
       InstituionName,InstitutionPrintName,Email,CountryName,StateName,LocationName,Registrationdate
       and showing alert message when it is null.
       */
        $scope.ProtocolMonitoring_Validations = function () {

            if ((typeof ($scope.Protocol_Names) == "undefined" || ($scope.Protocol_Names == 0)) && ($scope.Cloneval == 1)) {
                //alert("Please select Clone Name");
                toastr.warning("Please select Clone Name", "warning");
                return false;
            }
            if (typeof ($scope.ProtocolName) == "undefined" || $scope.ProtocolName == "") {
                //alert("Please enter Protocol Name");
                toastr.warning("Please enter Protocol Name", "warning");
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
                    //alert("Please select any one Parameter");
                    toastr.warning("Please select any one Parameter", "warning");
                    return false
                }
                if (paramval == 1) {
                    //alert("Please select Parameter ");
                    toastr.warning("Please select Parameter ", "info");
                    return false
                }

                if (HighMax == 1) {
                    //alert("Please enter Compliance Low less than Compliance Count ");
                    toastr.warning("Please enter Compliance Low less than Compliance Count ", "warning");
                    return false
                }

                if (MediumMax == 1) {
                    //alert("Please enter Compliance Medium less than Compliance Count ");
                    toastr.warning("Please enter Compliance Medium less than Compliance Count ", "warning");
                    return false
                }

                if (LowMax == 1) {
                    //alert("Please enter Compliance High less than Compliance Count");
                    toastr.warning("Please enter Compliance High less than Compliance Count", "warning");
                    return false
                }

                if (HighMax1 == 1) {
                    //alert("Please enter Compliance Medium less than Compliance Low");
                    toastr.warning("Please enter Compliance Medium less than Compliance Low", "warning");
                    return false
                }

                if (HighMin1 == 1) {
                    //alert("Please enter Compliance High less than Compliance Medium");
                    toastr.warning("Please enter Compliance High less than Compliance Medium", "warning");
                    return false
                }

                if (valone == 1) {
                    //alert("Please enter Diagnostic High Max One greater than Diagnostic High Min One");
                    toastr.warning("Please enter Diagnostic High Max One greater than Diagnostic High Min One", "warning");
                    return false
                }
                if (valtwo == 1) {
                    //alert("Please enter Diagnostic Medium Max One greater than Medium Min One");
                    toastr.warning("Please enter Diagnostic Medium Max One greater than Medium Min One", "warning");
                    return false
                }
                if (valthree == 1) {
                    //alert("Please enter Diagnostic Low Max One greater than Diagnostic Low Min One");
                    toastr.warning("Please enter Diagnostic Low Max One greater than Diagnostic Low Min One", "warning");
                    return false
                }
                if (valfour == 1) {
                    //alert("Please enter Diagnostic High Max Two greater than Diagnostic High Min Two");
                    toastr.warning("Please enter Diagnostic High Max Two greater than Diagnostic High Min Two", "warning");
                    return false
                }
                if (valfive == 1) {
                    //alert("Please enter Diagnostic Medium Max Two greater than Diagnostic Medium Min Two");
                    toastr.warning("Please enter Diagnostic Medium Max Two greater than Diagnostic Medium Min Two", "warning");
                    return false
                }
                if (valsix == 1) {
                    //alert("Please enter Diagnostic Low Max Two greater than Diagnostic Low Min Two");
                    toastr.warning("Please enter Diagnostic Low Max Two greater than Diagnostic Low Min Two", "warning");
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
                    //alert("Please enter valid values");
                    toastr.warning("Please enter valid values", "warning");
                    return false
                }
                if (Normalrange == 1) {
                    //alert("Please enter Diagnostic From greater than Diagnostic Low");
                    toastr.warning("Please enter Diagnostic From greater than Diagnostic Low", "warning");
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
                //alert('Parameters ' + Duplicateparameter + ' already exist, cannot be Duplicated');
                toastr.info('Parameters ' + Duplicateparameter + ' already exist, cannot be Duplicated', "info");
                return false;
            }
            if (MinvalueDuplicate1 == 1) {
                //alert(DuplicateMinvalue1);
                toastr.info("DuplicateMinvalue1", "info");
                return false;
            }
            if (MinvalueDuplicate2 == 1) {
                //alert(DuplicateMinvalue2);
                toastr.info("DuplicateMinvalue2", "info");
                return false;
            }
            if (MinvalueDuplicate3 == 1) {
                //alert(DuplicateMinvalue3);
                toastr.info("DuplicateMinvalue3", "info");
                return false;
            }
            if (MinvalueDuplicate4 == 1) {
                //alert(DuplicateMinvalue4);
                toastr.info("DuplicateMinvalue4", "info");
                return false;
            }
            if (MinvalueDuplicate5 == 1) {
                //alert(DuplicateMinvalue5);
                toastr.info("DuplicateMinvalue5", "info");
                return false;
            }
            if (MinvalueDuplicate6 == 1) {
                //alert(DuplicateMinvalue6);
                toastr.info("DuplicateMinvalue6", "info");
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
            'Diag_ParameterSettingslist': [{
                'Id': 0,
                'Parameter_Id': 0,
                //'Comp_Parameter_Id': 0,
                'ParameterName': '',
                'Units_Id': '',
                'UnitsName': '',
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
                //'Comp_High': '',
                //'Comp_Medium': '',
                //'Comp_Low': '',
                'Isactive': 1,
                'Created_By': $scope.User_Id,
                'NormalRange_High': '',
                'NormalRange_Low': '',
            //'occur_inter': true,
            //'occur_inter_val': 0
            }],
            'Comp_ParameterSettingslist': [{
                'Id': 0,
                'Parameter_Id': 0,
                'ParameterName': '',
                'Com_DurationType': 0,
                'DurationName': '',
                'Comp_Duration': '0',
                'Isactive': 1,
                'Created_By': $scope.User_Id,
                'occur_inter': true,
                'occur_inter_val': 0,
                'duration_list': [],
                'starttime': '',
                'endtime': '',
                'selectedDays': '',
                'WeeklyData': $scope.weeklist
            }]
        }];

        /*Add New Row */
        $scope.MonitoringParameterSettings_Insert = function () {
            var obj = {
                'Id': 0,
                'Parameter_Id': 0,
                'ParameterName': '',
                'Units_Id': '',
                'UnitsName': '',
                'NormalRange_High': '',
                'NormalRange_Low': '',
                'Diag_Range': 0,
                'Diag_Range_Min': '',
                'Diag_Range_Max': ''
            };
            $scope.Diagostic_ParameterSettingslist.push(obj);
        };

        $scope.MonitoringParameterSettings_Compliance_Insert = function () {
            var obj = {
                'Id': 0,
                'Protocol_Id': 0,
                'ProtocolName': '',
                'Institution_Id': 0,
                'Institution_Name': '',
                'Parameter_Id': 0,
                'ParameterName': '',
                'Com_DurationType': 0,
                'DurationName': '',
                'Comp_Duration': '0',
                'Isactive': 1,
                'Created_By': $scope.User_Id,
                'occur_inter': true,
                'occur_inter_val': 0,
                'duration_list': [],
                'starttime': '',
                'endtime': '',
                'selectedDays': '',
                'WeeklyData': $scope.weeklist
            };
            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist.push(obj);
        }

        /*on click Save calling the insert update function for Monitoring Protocol
         and check the Monitoring Protocol Name already exist,if exist it display alert message or its 
         calling the insert update function*/
        
        $scope.ProtocolParameter_AddEdit = function () {
            $scope.MonitoringDetails = [];
            var dp = 0, dnh = 0, dnl = 0, r = 0, rm = 0, rx = 0;
            var zy = $scope.Diagostic_ParameterSettingslist;
            for (var i = 0; i < zy.length; i++) {
                if (zy[i].Parameter_Id == 0) {
                    dp = 1;
                    break;
                }
                if (zy[i].NormalRange_High == '') {
                    dnh = 1;
                    break;
                }
                if (zy[i].NormalRange_Low == '') {
                    dnl = 1;
                    break;
                }
                if (zy[i].Diag_Range == 0) {
                    r = 1;
                    break;
                }
                if (zy[i].Diag_Range_Min == '') {
                    rm = 1;
                    break;
                }
                if (zy[i].Diag_Range_Max == '') {
                    rx = 1;
                    break;
                }
            }
            if (dp == 1) {
                toastr.warning("Please select diagonastic parameter", "Warning");
                return;
            }
            if (dnh == 1) {
                toastr.warning("Please enter diagonastic normal range high value", "Warning");
                return;
            }
            if (dnl == 1) {
                toastr.warning("Please enter diagonastic normal range low value", "Warning");
                return;
            }
            if (r == 1) {
                toastr.warning("Please select diagonastic range type", "Warning");
                return;
            }
            if (rm == 1) {
                toastr.warning("Please enter diagonastic range high value", "Warning");
                return;
            }
            if (rx == 1) {
                toastr.warning("Please enter diagonastic range low value", "Warning");
                return;
            }
            var com = $scope.ParameterSettingslist[0].Comp_ParameterSettingslist;
            var z = 0, p = 0, d = 0;
            for (var i = 0; i < com.length; i++) {
                if (com[i].Parameter_Id == 0 || com[i].Parameter_Id == null || com[i].Parameter_Id == undefined) {
                    p = 1;
                    break;
                }
                if (com[i].Com_DurationType == 0 || com[i].Com_DurationType == null || com[i].Com_DurationType == undefined) {
                    d = 1;
                    break;
                }
                if (com[i].occur_inter_val <= 0) {
                    z = 1;
                    break;
                }
                if (Date.parse(com[i].starttime).toString() == 'NaN') {
                    z = 1; break;
                }
                if (Date.parse(com[i].endtime).toString() == 'NaN') {
                    z = 1; break;
                }
                var y = 0;
                for (var j = 0; j < com[i].duration_list.length; j++) {
                    if (Date.parse(com[i].duration_list[j].time).toString() == 'NaN') {
                        y = 1;
                        z = 1; break;
                    }
                }
                if (y == 1) {
                    z = 1; break;
                }
            }
            if (p == 1) {
                toastr.warning("Please select compliance parameter", "Warning");
                return;
            }
            if (d == 1) {
                toastr.warning("Please select compliance duration type", "Warning");
                return;
            }
            if (z == 1) {
                toastr.warning("Please give valid data", "Warning");
                return;
            }
            var diag_alert = [];
            var uni = zy.map(y => y.Parameter_Id).filter((item, i, ar) => ar.indexOf(item) === i);
            for (var b = 0; b < uni.length; b++) {
                var obj = {
                    'Id': 0,
                    'Parameter_Id': uni[b],
                    'ParameterName': '',
                    'Units_Id': '',
                    'UnitsName': '',
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
                    'Isactive': 1,
                    'Created_By': $scope.User_Id,
                    'NormalRange_High': '',
                    'NormalRange_Low': ''
                };
                diag_alert.push(obj);
            }
            for (var b1 = 0; b1 < zy.length; b1++) {
                for (var b2 = 0; b2 < diag_alert.length; b2++) {
                    if (zy[b1].Parameter_Id == diag_alert[b2].Parameter_Id) {
                        diag_alert[b2].ParameterName = zy[b1].ParameterName;
                        diag_alert[b2].Units_Id = zy[b1].Units_Id;
                        diag_alert[b2].UnitsName = zy[b1].UnitsName;
                        diag_alert[b2].NormalRange_High = zy[b1].NormalRange_High;
                        diag_alert[b2].NormalRange_Low = zy[b1].NormalRange_Low;
                        if (zy[b1].Diag_Range == 1) {
                            diag_alert[b2].Diag_HighMax_One = zy[b1].Diag_Range_Min;
                            diag_alert[b2].Diag_HighMin_One = zy[b1].Diag_Range_Max;
                        }
                        else if (zy[b1].Diag_Range == 2) {
                            diag_alert[b2].Diag_MediumMax_One = zy[b1].Diag_Range_Min;
                            diag_alert[b2].Diag_MediumMin_One = zy[b1].Diag_Range_Max;
                        }
                        else if (zy[b1].Diag_Range == 3) {
                            diag_alert[b2].Diag_LowMax_One = zy[b1].Diag_Range_Min;
                            diag_alert[b2].Diag_LowMin_One = zy[b1].Diag_Range_Max;
                        }
                        else if (zy[b1].Diag_Range == 4) {
                            diag_alert[b2].Diag_HighMax_Two = zy[b1].Diag_Range_Min;
                            diag_alert[b2].Diag_HighMin_Two = zy[b1].Diag_Range_Max;
                        }
                        else if (zy[b1].Diag_Range == 5) {
                            diag_alert[b2].Diag_MediumMax_Two = zy[b1].Diag_Range_Min;
                            diag_alert[b2].Diag_MediumMin_Two = zy[b1].Diag_Range_Max;
                        }
                        else if (zy[b1].Diag_Range == 6) {
                            diag_alert[b2].Diag_LowMax_Two = zy[b1].Diag_Range_Min;
                            diag_alert[b2].Diag_LowMin_Two = zy[b1].Diag_Range_Max;
                        }
                    }
                }
            }

            $scope.ParameterSettingslist[0].Diag_ParameterSettingslist = diag_alert;

            //if ($scope.ProtocolMonitoring_Validations() == true) {
                $("#chatLoaderPV").show();
                if ($scope.ParameterSettingslistDelete.length > 0) {
                    angular.forEach($scope.ParameterSettingslistDelete, function (Selected1, index1) {
                        $scope.ProtocolDetails_Delete(Selected1.Id);
                    });
                }

                //angular.forEach($scope.ParameterSettingslist, function (Selected, index) {

                //    var obj = {
                //        Id: Selected.Id,
                //        // PROTOCOL_ID: Selected.PARAMETER_ID,
                //        Institution_Id: $scope.InstituteId == 0 ? null : $scope.InstituteId,
                //        Parameter_Id: Selected.Parameter_Id == 0 ? null : Selected.Parameter_Id,
                //        Comp_Parameter_Id: Selected.Comp_Parameter_Id == 0 ? null : Selected.Comp_Parameter_Id,
                //        Units_Id: Selected.Units_Id == 0 ? null : Selected.Units_Id,
                //        Diag_HighMax_One: Selected.Diag_HighMax_One,
                //        Diag_HighMin_One: Selected.Diag_HighMin_One,
                //        Diag_MediumMax_One: Selected.Diag_MediumMax_One,
                //        Diag_MediumMin_One: Selected.Diag_MediumMin_One,
                //        Diag_LowMax_One: Selected.Diag_LowMax_One,
                //        Diag_LowMin_One: Selected.Diag_LowMin_One,
                //        Diag_HighMax_Two: Selected.Diag_HighMax_Two,
                //        Diag_HighMin_Two: Selected.Diag_HighMin_Two,
                //        Diag_MediumMax_Two: Selected.Diag_MediumMax_Two,
                //        Diag_MediumMin_Two: Selected.Diag_MediumMin_Two,
                //        Diag_LowMax_Two: Selected.Diag_LowMax_Two,
                //        Diag_LowMin_Two: Selected.Diag_LowMin_Two,
                //        Com_DurationType: Selected.Com_DurationType == 0 ? null : Selected.Com_DurationType,
                //        Comp_Duration: Selected.Comp_Duration,
                //        Comp_High: Selected.Comp_High,
                //        Comp_Medium: Selected.Comp_Medium,
                //        Comp_Low: Selected.Comp_Low,
                //        //ISACTIVE: Selected.IsActive,
                //        Created_By: $scope.User_Id,
                //        NormalRange_High: Selected.NormalRange_High,
                //        NormalRange_Low: Selected.NormalRange_Low,
                //    }
                //    $('#btnsave').attr("disabled", true);
                //    $scope.MonitoringDetails.push(obj);
                //});

                angular.forEach($scope.ParameterSettingslist[0].Comp_ParameterSettingslist, function (Selected, index) {
                    if ($scope.ParameterSettingslist[0].Comp_ParameterSettingslist[index].Com_DurationType == 1) {
                        $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[index].selectedDays = "";
                    }
                    $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[index].Protocol_Id = ($scope.Cloneval == 1) ? 0 : $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[index].Protocol_Id;
                    $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[index].Id = ($scope.Cloneval == 1) ? 0 : $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[index].Id;
                });

                $('#btnsave').attr("disabled", true);
                var obj1 = {
                    Id: ($scope.Cloneval == 1)? 0: $scope.Id,
                    Institution_Id: $scope.InstituteId == 0 ? null : $scope.InstituteId,
                    Protocol_Name: $scope.ProtocolName,
                    Created_By: $scope.User_Id,
                    ChildModuleList: $scope.ParameterSettingslist
                };

                $http.post(baseUrl + '/api/Protocol/ProtocolMonitoring_AddEditNew/', obj1).success(function (data) {
                    $("#chatLoaderPV").hide();
                    //$http.post(baseUrl + '/api/StandaredProtocol/ProtocolMonitoring_AddEdit/', obj).success(function (data) {
                    //alert(data.Message);
                    if (data.ReturnFlag == 0) {
                        toastr.warning(data.Message, "warning");
                    }
                    else if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    $('#btnsave').attr("disabled", false);
                    if (data.ReturnFlag == 1) {
                        $scope.CancelProtocol();

                        $scope.MonitoringProtocolDetailsListGo();

                        $scope.ProtocolClear();
                        /*$scope.CloneProtocolFunction();*/
                    }
                });
            //}
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
                'Diag_ParameterSettingslist': [{
                    'Id': 0,
                    'Parameter_Id': 0,
                    //'Comp_Parameter_Id': 0,
                    'ParameterName': '',
                    'Units_Id': '',
                    'UnitsName': '',
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
                    //'Comp_High': '',
                    //'Comp_Medium': '',
                    //'Comp_Low': '',
                    'Isactive': 1,
                    'Created_By': $scope.User_Id,
                    'NormalRange_High': '',
                    'NormalRange_Low': '',
                    //'occur_inter': true,
                    //'occur_inter_val': 0
                }],
                'Comp_ParameterSettingslist': [{
                    'Id': 0,
                    'Protocol_Id': 0,
                    'ProtocolName': '',
                    'Institution_Id': 0,
                    'Institution_Name': '',
                    'Parameter_Id': 0,
                    'ParameterName': '',
                    'Com_DurationType': 0,
                    'DurationName': '',
                    'Comp_Duration': '0',
                    'Isactive': 1,
                    'Created_By': $scope.User_Id,
                    'occur_inter': true,
                    'occur_inter_val': 0,
                    'duration_list': [],
                    'starttime': '',
                    'endtime': '',
                    'selectedDays': '',
                    'WeeklyData': $scope.weeklist
                }]
            }];
            $scope.Ranges = [{ id: 0, name: 'Select' }, { id: 1, name: 'High' }, { id: 2, name: 'Medium' }, { id: 3, name: 'Low' }, { id: 4, name: 'Low' }, { id: 5, name: 'Medium' }, { id: 6, name: 'High' }]
            $scope.Diagostic_ParameterSettingslist = [{
                'Id': 0,
                'Parameter_Id': 0,
                'ParameterName': '',
                'Units_Id': '',
                'UnitsName': '',
                'NormalRange_High': '',
                'NormalRange_Low': '',
                'Diag_Range': 0,
                'Diag_Range_Min': '',
                'Diag_Range_Max': ''
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
            $http.get(baseUrl + 'api/Protocol/ProtocolMonitoringNewView/?Id=' + $scope.Id).success(function (data) {
                $("#chatLoaderPV").hide();
                $scope.DuplicatesId = data.Id;
                $scope.Institution_Name = data.Institution_Id;
                $scope.ViewInstitution_Name = data.Institution_Name;
                $scope.ProtocolName = data.Protocol_Name;
                $scope.ParameterSettingslist = data.ChildModuleList;

                for (let i = 0; $scope.ParameterSettingslist[0].Comp_ParameterSettingslist.length > i; i++) {
                    var wd = [{ day: 'S', status: 0, days: 'Su' }, { day: 'M', status: 0, days: 'Mo' }, { day: 'T', status: 0, days: 'Tu' }, { day: 'W', status: 0, days: 'We' }, { day: 'T', status: 0, days: 'Th' }, { day: 'F', status: 0, days: 'Fr' }, { day: 'S', status: 0, days: 'Sa' }];
                    var y = $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[i].selectedDays.split(',');
                    for (let j = 0; y.length > j; j++) {
                        for (let z = 0; wd.length > z; z++) {
                            if (wd[z].days == y[j]) {
                                wd[z].status = 1;
                            }
                        }
                    }
                    $scope.ParameterSettingslist[0].Comp_ParameterSettingslist[i].WeeklyData = wd;
                }

                $scope.Diagostic_ParameterSettingslist = [];
                var di = $scope.ParameterSettingslist[0].Diag_ParameterSettingslist;
                for (let y = 0; y < di.length; y++) {
                    if (di[y].Diag_HighMax_One != '' && di[y].Diag_HighMin_One != '' && di[y].Diag_HighMax_One != null && di[y].Diag_HighMin_One != null) {
                        var obj = {
                            'Id': di[y].Id,
                            'Parameter_Id': di[y].Parameter_Id,
                            'ParameterName': di[y].ParameterName,
                            'Units_Id': di[y].Units_Id,
                            'UnitsName': di[y].UnitsName,
                            'NormalRange_High': di[y].NormalRange_High,
                            'NormalRange_Low': di[y].NormalRange_Low,
                            'Diag_Range': 1,
                            'Diag_Range_Min': di[y].Diag_HighMax_One,
                            'Diag_Range_Max': di[y].Diag_HighMin_One
                        }
                        $scope.Diagostic_ParameterSettingslist.push(obj);
                    }
                    if (di[y].Diag_MediumMax_One != '' && di[y].Diag_MediumMin_One != '' && di[y].Diag_MediumMax_One != null && di[y].Diag_MediumMin_One != null) {
                        var obj = {
                            'Id': di[y].Id,
                            'Parameter_Id': di[y].Parameter_Id,
                            'ParameterName': di[y].ParameterName,
                            'Units_Id': di[y].Units_Id,
                            'UnitsName': di[y].UnitsName,
                            'NormalRange_High': di[y].NormalRange_High,
                            'NormalRange_Low': di[y].NormalRange_Low,
                            'Diag_Range': 2,
                            'Diag_Range_Min': di[y].Diag_MediumMax_One,
                            'Diag_Range_Max': di[y].Diag_MediumMin_One
                        }
                        $scope.Diagostic_ParameterSettingslist.push(obj);
                    }
                    if (di[y].Diag_LowMax_One != '' && di[y].Diag_LowMin_One != '' && di[y].Diag_LowMax_One != null && di[y].Diag_LowMin_One != null) {
                        var obj = {
                            'Id': di[y].Id,
                            'Parameter_Id': di[y].Parameter_Id,
                            'ParameterName': di[y].ParameterName,
                            'Units_Id': di[y].Units_Id,
                            'UnitsName': di[y].UnitsName,
                            'NormalRange_High': di[y].NormalRange_High,
                            'NormalRange_Low': di[y].NormalRange_Low,
                            'Diag_Range': 3,
                            'Diag_Range_Min': di[y].Diag_LowMax_One,
                            'Diag_Range_Max': di[y].Diag_LowMin_One
                        }
                        $scope.Diagostic_ParameterSettingslist.push(obj);
                    }
                    if (di[y].Diag_HighMax_Two != '' && di[y].Diag_HighMin_Two != '' && di[y].Diag_HighMax_Two != null && di[y].Diag_HighMin_Two != null) {
                        var obj = {
                            'Id': di[y].Id,
                            'Parameter_Id': di[y].Parameter_Id,
                            'ParameterName': di[y].ParameterName,
                            'Units_Id': di[y].Units_Id,
                            'UnitsName': di[y].UnitsName,
                            'NormalRange_High': di[y].NormalRange_High,
                            'NormalRange_Low': di[y].NormalRange_Low,
                            'Diag_Range': 4,
                            'Diag_Range_Min': di[y].Diag_HighMax_Two,
                            'Diag_Range_Max': di[y].Diag_HighMin_Two
                        }
                        $scope.Diagostic_ParameterSettingslist.push(obj);
                    }
                    if (di[y].Diag_MediumMax_Two != '' && di[y].Diag_MediumMin_Two != '' && di[y].Diag_MediumMax_Two != null && di[y].Diag_MediumMin_Two != null) {
                        var obj = {
                            'Id': di[y].Id,
                            'Parameter_Id': di[y].Parameter_Id,
                            'ParameterName': di[y].ParameterName,
                            'Units_Id': di[y].Units_Id,
                            'UnitsName': di[y].UnitsName,
                            'NormalRange_High': di[y].NormalRange_High,
                            'NormalRange_Low': di[y].NormalRange_Low,
                            'Diag_Range': 5,
                            'Diag_Range_Min': di[y].Diag_MediumMax_Two,
                            'Diag_Range_Max': di[y].Diag_MediumMin_Two
                        }
                        $scope.Diagostic_ParameterSettingslist.push(obj);
                    }
                    if (di[y].Diag_LowMax_Two != '' && di[y].Diag_LowMin_Two != '' && di[y].Diag_LowMax_Two != null && di[y].Diag_LowMin_Two != null) {
                        var obj = {
                            'Id': di[y].Id,
                            'Parameter_Id': di[y].Parameter_Id,
                            'ParameterName': di[y].ParameterName,
                            'Units_Id': di[y].Units_Id,
                            'UnitsName': di[y].UnitsName,
                            'NormalRange_High': di[y].NormalRange_High,
                            'NormalRange_Low': di[y].NormalRange_Low,
                            'Diag_Range': 6,
                            'Diag_Range_Min': di[y].Diag_LowMax_Two,
                            'Diag_Range_Max': di[y].Diag_LowMin_Two
                        }
                        $scope.Diagostic_ParameterSettingslist.push(obj);
                    }
                }

                angular.forEach($scope.ParameterSettingslist, function (value, index) {
                    if (value.NormalRange_High == null || value.NormalRange_Low == null) {
                        //$scope.ParameterSettings_ViewEdit();
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
                    //alert("Selected Institution has been deactivated Successfully");
                    toastr.success("Selected Institution has been deactivated Successfully", "success");
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
            Swal.fire({
                title: 'Do you like to activate the selected Monitoring Protocol?',
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
                    $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_Active/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Monitoring Protocol has been activated successfully");
                        toastr.success("Selected Monitoring Protocol has been activated successfully", "success");
                        $scope.MonitoringProtocolDetailsListGo();
                    }).error(function (data) {
                        $scope.error = "An error has occurred while ReInsert Monitoring Protocol Details" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var Ins = confirm("Do you like to activate the selected Monitoring Protocol?");
             if (Ins == true) {
                 $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_Active/?Id=' + $scope.Id).success(function (data) {
                     //alert("Selected Monitoring Protocol has been activated successfully");
                     toastr.success("Selected Monitoring Protocol has been activated successfully", "success");
                     $scope.MonitoringProtocolDetailsListGo();
                 }).error(function (data) {
                     $scope.error = "An error has occurred while ReInsert Monitoring Protocol Details" + data;
                 });
             };*/
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
            Swal.fire({
                title: 'Do you like to deactivate the selected Monitoring Protocol?',
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
                    $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_InActive/?Id=' + $scope.Id).success(function (data) {
                        //alert("Selected Monitoring Protocol has been deactivated Successfully");
                        toastr.success("Selected Monitoring Protocol has been deactivated Successfully", "success");
                        $scope.MonitoringProtocolDetailsListGo();
                    }).error(function (data) {
                        $scope.error = "AN error has occured while deleting Monitoring Protocol!" + data;
                    });
                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            })
            /* var del = confirm("Do you like to deactivate the selected Monitoring Protocol?");
             if (del == true) {
                 $http.get(baseUrl + 'api/Protocol/ProtocolMonitoring_InActive/?Id=' + $scope.Id).success(function (data) {
                     //alert("Selected Monitoring Protocol has been deactivated Successfully");
                     toastr.success("Selected Monitoring Protocol has been deactivated Successfully", "success");
                     $scope.MonitoringProtocolDetailsListGo();
                 }).error(function (data) {
                     $scope.error = "AN error has occured while deleting Monitoring Protocol!" + data;
                 });
             };*/
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
                    //alert("Selected Institution has been activated successfully");
                    toastr.success("Selected Institution has been activated successfully", "success");
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

        $scope.MonitoringProtocolComp_Delete = function (itemIndex, ParamId) {
            Swal.fire({
                title: 'Do you like to delete the selected Parameter?',
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
                    $scope.$apply(() => {
                        if ($scope.Id <= 0) {
                            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist.splice(itemIndex, 1);
                            if ($scope.ParameterSettingslist[0].Comp_ParameterSettingslist.length == 0) {
                                $scope.ParameterSettingslist[0].Comp_ParameterSettingslist = [{
                                    'Id': 0,
                                    'Protocol_Id': 0,
                                    'ProtocolName': '',
                                    'Institution_Id': 0,
                                    'Institution_Name': '',
                                    'Parameter_Id': 0,
                                    'ParameterName': '',
                                    'Com_DurationType': 0,
                                    'DurationName': '',
                                    'Comp_Duration': '0',
                                    'Isactive': 1,
                                    'Created_By': $scope.User_Id,
                                    'occur_inter': true,
                                    'occur_inter_val': 0,
                                    'duration_list': [],
                                    'starttime': '',
                                    'endtime': '',
                                    'selectedDays': '',
                                    'WeeklyData': $scope.weeklist
                                }];
                            }
                        }
                        else {
                            $scope.ParameterSettingslist[0].Comp_ParameterSettingslist.splice(itemIndex, 1);

                            if ($scope.ParameterSettingslist[0].Comp_ParameterSettingslist.length == 0) {
                                $scope.ParameterSettingslist[0].Comp_ParameterSettingslist = [{
                                    'Id': 0,
                                    'Protocol_Id': 0,
                                    'ProtocolName': '',
                                    'Institution_Id': 0,
                                    'Institution_Name': '',
                                    'Parameter_Id': 0,
                                    'ParameterName': '',
                                    'Com_DurationType': 0,
                                    'DurationName': '',
                                    'Comp_Duration': '0',
                                    'Isactive': 1,
                                    'Created_By': $scope.User_Id,
                                    'occur_inter': true,
                                    'occur_inter_val': 0,
                                    'duration_list': [],
                                    'starttime': '',
                                    'endtime': '',
                                    'selectedDays': '',
                                    'WeeklyData': $scope.weeklist
                                }];

                            }
                        }
                    });

                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            });
        };

        $scope.ParameterSettingslistDelete = [];
        $scope.MonitoringProtocol_DiagDelete = function (index, id) {
            Swal.fire({
                title: 'Do you like to delete the selected Parameter?',
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
                    $scope.$apply(() => {
                        if ($scope.Id <= 0) {
                            $scope.Diagostic_ParameterSettingslist.splice(index, 1);
                            if ($scope.Diagostic_ParameterSettingslist.length == 0) {
                                $scope.Diagostic_ParameterSettingslist = [{
                                    'Id': 0,
                                    'Parameter_Id': 0,
                                    'ParameterName': '',
                                    'Units_Id': '',
                                    'UnitsName': '',
                                    'NormalRange_High': '',
                                    'NormalRange_Low': '',
                                    'Diag_Range': 0,
                                    'Diag_Range_Min': '',
                                    'Diag_Range_Max': ''
                                }];
                            }
                        }
                        else {
                            $scope.Diagostic_ParameterSettingslist.splice(index, 1);

                            if ($scope.Diagostic_ParameterSettingslist.length == 0) {
                                $scope.Diagostic_ParameterSettingslist = [{
                                    'Id': 0,
                                    'Parameter_Id': 0,
                                    'ParameterName': '',
                                    'Units_Id': '',
                                    'UnitsName': '',
                                    'NormalRange_High': '',
                                    'NormalRange_Low': '',
                                    'Diag_Range': 0,
                                    'Diag_Range_Min': '',
                                    'Diag_Range_Max': ''
                                }];

                            }
                        }
                    });

                } else if (result.isDenied) {
                }
            });
        }
        $scope.MonitoringProtocolDelete = function (itemIndex, ParamId) {
            Swal.fire({
                title: 'Do you like to delete the selected Parameter?',
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
                    $scope.$apply(() => {
                        if ($scope.Id <= 0) {
                            $scope.ParameterSettingslist.splice(itemIndex, 1);
                            if ($scope.ParameterSettingslist.length == 0) {
                                $scope.ParameterSettingslist = [{
                                    'Id': 0,
                                    'Protocol_Id': 0,
                                    'ProtocolName': '',
                                    'Institution_Id': 0,
                                    'Institution_Name': '',
                                    'Diag_ParameterSettingslist': [{
                                        'Parameter_Id': 0,
                                        //'Comp_Parameter_Id': 0,
                                        'ParameterName': '',
                                        'Units_Id': 0,
                                        'UnitsName': '',
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
                                        //'Comp_High': '',
                                        //'Comp_Medium': '',
                                        //'Comp_Low': '',
                                        'Isactive': 1,
                                        'Created_By': $scope.User_Id,
                                        'NormalRange_High': '',
                                        'NormalRange_Low': '',
                                        //'occur_inter': true,
                                        //'occur_inter_val': 0,
                                    }],
                                    'Comp_ParameterSettingslist': [{
                                        'Id': 0,
                                        'Protocol_Id': 0,
                                        'ProtocolName': '',
                                        'Institution_Id': 0,
                                        'Institution_Name': '',
                                        'Parameter_Id': 0,
                                        'ParameterName': '',
                                        'Com_DurationType': 0,
                                        'DurationName': '',
                                        'Comp_Duration': '0',
                                        'Isactive': 1,
                                        'Created_By': $scope.User_Id,
                                        'occur_inter': true,
                                        'occur_inter_val': 0,
                                        'duration_list': [],
                                        'starttime': '',
                                        'endtime': '',
                                        'selectedDays': '',
                                        'WeeklyData': $scope.weeklist
                                    }]
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
                                    'Diag_ParameterSettingslist': [{
                                        'Parameter_Id': 0,
                                        //'Comp_Parameter_Id': 0,
                                        'ParameterName': '',
                                        'Units_Id': 0,
                                        'UnitsName': '',
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
                                        //'Comp_High': '',
                                        //'Comp_Medium': '',
                                        //'Comp_Low': '',
                                        'Isactive': 1,
                                        'Created_By': $scope.User_Id,
                                        'NormalRange_High': '',
                                        'NormalRange_Low': '',
                                        //'occur_inter': true,
                                        //'occur_inter_val': 0
                                    }],
                                    'Comp_ParameterSettingslist': [{
                                        'Id': 0,
                                        'Protocol_Id': 0,
                                        'ProtocolName': '',
                                        'Institution_Id': 0,
                                        'Institution_Name': '',
                                        'Parameter_Id': 0,
                                        'ParameterName': '',
                                        'Com_DurationType': 0,
                                        'DurationName': '',
                                        'Comp_Duration': '0',
                                        'Isactive': 1,
                                        'Created_By': $scope.User_Id,
                                        'occur_inter': true,
                                        'occur_inter_val': 0,
                                        'duration_list': [],
                                        'starttime': '',
                                        'endtime': '',
                                        'selectedDays': '',
                                        'WeeklyData': $scope.weeklist
                                    }]
                                }];

                            }
                        }
                    });

                } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                }
            });
        };
        /*var del = confirm("Do you like to delete the selected Parameter?");
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
                            'Comp_Parameter_Id': 0,
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
                            'Comp_Duration': '0',
                            'Comp_High': '',
                            'Comp_Medium': '',
                            'Comp_Low': '',
                            'Isactive': 1,
                            'Created_By': $scope.User_Id,
                            'NormalRange_High': '',
                            'NormalRange_Low': '',
                            'occur_inter': true,
                            'occur_inter_val': 0,
                            'Comp_ParameterSettingslist': []
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
                            'Comp_Parameter_Id': 0,
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
                            'Comp_Duration': '0',
                            'Comp_High': '',
                            'Comp_Medium': '',
                            'Comp_Low': '',
                            'Isactive': 1,
                            'Created_By': $scope.User_Id,
                            'NormalRange_High': '',
                            'NormalRange_Low': ''
                            'occur_inter': true,
                            'occur_inter_val': 0,
                            'Comp_ParameterSettingslist': []
                        }];

                    }
                }
        }*/


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