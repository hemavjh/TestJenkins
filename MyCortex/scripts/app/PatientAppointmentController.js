var PatientAppointment = angular.module("PatientAppointmentController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


PatientAppointment.controller("PatientAppointmentController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff) {
        $scope.Doctor_Id = $window.localStorage['UserId'];
        $scope.LoginSessionId = $window.localStorage['Login_Session_Id'];
        $scope.AppointmentDate = "";
        $scope.Appointmentdate = "";
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
                //alert("Please select Reason Type for  cancellation");
                toastr.warning("Please select Reason Type for  cancellation", "warning");
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
                    //alert(data.Message);
                    if (data.ReturnFlag == 1) {
                        toastr.success(data.Message, "success");
                    }
                    else if (data.ReturnFlag == 0) {
                        toastr.info(data.Message, "info");
                    }
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
            if ($window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 7 || $window.localStorage['UserTypeId'] == 5) {

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
            } else {
                window.location.href = baseUrl + "/Home/LoginIndex";
            }
        });

        $scope.dayClicked = function (date) {
            $scope.flag = 3;
            $('#calendar').fullCalendar('gotoDate', date);
        }

        var dueStartDate = moment().subtract(1, 'days');
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
                        var startdate = moment(dueStartDate).format('YYYY-MM-DD');
                        var date1 = moment(date).format('YYYY-MM-DD');
                        var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
                        if (moment(date1).isBetween(startdate, EndDate) == false) {
                            //alert("Appointment is only for 30 days, cannot view this date");
                            toastr.info("Appointment is only for 30 days, cannot view this date", "info");
                            $('#calendar1').fullCalendar('gotoDate', date1);
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