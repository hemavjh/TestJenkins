var PatientAppointment = angular.module("PatientAppointmentController", ['ngTable', 'smart-table', 'frapontillo.bootstrap-duallistbox', 'daypilot', 'angucomplete-alt',
    'treestructure', 'angular-bootstrap-select', 'highcharts-ng']);
var baseUrl = $("base").first().attr("href");
if (baseUrl == "/") {
    baseUrl = "";
}


PatientAppointment.controller("PatientAppointmentController", ['$scope', '$http', '$filter', '$routeParams', '$location', '$window', 'filterFilter', 'toastr',
    function ($scope, $http, $filter, $routeParams, $location, $window, $ff, toastr) {
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
        $scope.CancelAppointmentModalList = function (AppointmentId, AppointmentDate) {
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
                    $scope.getMonthlyAppointment();
                    $scope.DailyCalendarView();
                    $scope.calendarListView();

                    $("#chatLoaderPV1").hide();

                    //$http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
                    //    angular.forEach(patientdata, function (value, index) {
                    //        var obj = {
                    //            title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                    //            start: value.Appointment_FromTime,
                    //            end: value.Appointment_ToTime,
                    //            id: value.Patient_Id,
                    //            PatientName: value.PatientName,
                    //            Appointment_Id: value.Id,
                    //            MRN_No: value.MRN_No,
                    //            Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                    //            Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                    //            ReasonForVisit: value.ReasonForVisit
                    //        };
                    //        $scope.dataCalendar1.push(obj);
                    //    })
                    //   //$('#calendar1').fullCalendar('removeEvents', $scope.Appointment_Id);
                    //   /// $('#calendar1').fullCalendar('removeEventSource', $scope.dataCalendar1)
                    //    // $('#calendar1').fullCalendar('addEventSource', $scope.dataCalendar1)
                    //    //calendar.refetchEvents();
                    //    //$('#calendar1').FullCalendar.refetchEvents();
                    //    $('#calendar1').FullCalendar('refetchEvents')
                    //    //$('#calendar1').fullCalendar('refetchEvents');
                    //    $("#chatLoaderPV1").hide();
                    //}).error(function (data) {
                    //    $("#chatLoaderPV1").hide();
                    //    $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                    //});

                    // refresh daily calendar
                    //$scope.dataCalendar = [];
                    //$http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + $scope.AppointmentDate + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    //    angular.forEach(data, function (value, index) {
                    //        var obj = {
                    //            title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                    //            start: value.Appointment_FromTime,
                    //            end: value.Appointment_ToTime,
                    //            id: value.Patient_Id,
                    //            PatientName: value.PatientName,
                    //            Appointment_Id: value.Id,
                    //            MRN_No: value.MRN_No,
                    //            Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                    //            Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                    //            ReasonForVisit: value.ReasonForVisit
                    //        };
                    //        $scope.dataCalendar.push(obj);
                    //    });
                    //    $('#calendar').fullCalendar('removeEvents',);
                    //    $('#calendar').fullCalendar('removeEventSource', $scope.dataCalendar)
                    //    $('#calendar').fullCalendar('addEventSource', $scope.dataCalendar)

                    //    calendar.addEventSource($scope.calendar1);
                    //    $('#calendar').fullCalendar('refetchEvents');
                    //    $("#chatLoaderPV").hide();
                    //}).error(function (data) {
                    //    $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                    //});
                }).error(function (data) {
                    $scope.error = "An error has occurred while Updating Appointment Details" + data;
                });
                //$('#calendar1').fullCalendar('gotoDate', $scope.AppointmentDate);
                //$('#calendar').fullCalendar('gotoDate', $scope.AppointmentDate);
            }
        }

        $scope.Update_CancelledAppointment_List = function () {
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
                   
                    $scope.calendarListView();

                    $("#chatLoaderPV1").hide();

                    //$http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
                    //    angular.forEach(patientdata, function (value, index) {
                    //        var obj = {
                    //            title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                    //            start: value.Appointment_FromTime,
                    //            end: value.Appointment_ToTime,
                    //            id: value.Patient_Id,
                    //            PatientName: value.PatientName,
                    //            Appointment_Id: value.Id,
                    //            MRN_No: value.MRN_No,
                    //            Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                    //            Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                    //            ReasonForVisit: value.ReasonForVisit
                    //        };
                    //        $scope.dataCalendar1.push(obj);
                    //    })
                    //   //$('#calendar1').fullCalendar('removeEvents', $scope.Appointment_Id);
                    //   /// $('#calendar1').fullCalendar('removeEventSource', $scope.dataCalendar1)
                    //    // $('#calendar1').fullCalendar('addEventSource', $scope.dataCalendar1)
                    //    //calendar.refetchEvents();
                    //    //$('#calendar1').FullCalendar.refetchEvents();
                    //    $('#calendar1').FullCalendar('refetchEvents')
                    //    //$('#calendar1').fullCalendar('refetchEvents');
                    //    $("#chatLoaderPV1").hide();
                    //}).error(function (data) {
                    //    $("#chatLoaderPV1").hide();
                    //    $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                    //});

                    // refresh daily calendar
                    //$scope.dataCalendar = [];
                    //$http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + $scope.AppointmentDate + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
                    //    angular.forEach(data, function (value, index) {
                    //        var obj = {
                    //            title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                    //            start: value.Appointment_FromTime,
                    //            end: value.Appointment_ToTime,
                    //            id: value.Patient_Id,
                    //            PatientName: value.PatientName,
                    //            Appointment_Id: value.Id,
                    //            MRN_No: value.MRN_No,
                    //            Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                    //            Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                    //            ReasonForVisit: value.ReasonForVisit
                    //        };
                    //        $scope.dataCalendar.push(obj);
                    //    });
                    //    $('#calendar').fullCalendar('removeEvents',);
                    //    $('#calendar').fullCalendar('removeEventSource', $scope.dataCalendar)
                    //    $('#calendar').fullCalendar('addEventSource', $scope.dataCalendar)

                    //    calendar.addEventSource($scope.calendar1);
                    //    $('#calendar').fullCalendar('refetchEvents');
                    //    $("#chatLoaderPV").hide();
                    //}).error(function (data) {
                    //    $scope.error = "An error has occurred while Listing Today's appointment!" + data;
                    //});
                }).error(function (data) {
                    $scope.error = "An error has occurred while Updating Appointment Details" + data;
                });
                //$('#calendar1').fullCalendar('gotoDate', $scope.AppointmentDate);
                //$('#calendar').fullCalendar('gotoDate', $scope.AppointmentDate);
            }
        }
        var scrollTime = moment().format("HH:mm:ss");

        $scope.calendarListView = function () {
            //-------------------This is list view area--------------------------
            var calendarEl5 = document.getElementById('calendar5');
            initialView = 'listYear'
            var calendar5 = new FullCalendar.Calendar(calendarEl5, {
                scrollTime: scrollTime,
                slotDuration: '00:15:00',
                visibleRange: {
                    start: '2020-02-01',
                    end: '2020-03-20'
                },
                eventLimit: true,
                displayEventTime: false,
                headerToolbar: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'listYear'
                },

                // customize the button names,
                // otherwise they'd all just say "list"
                views: {
                    //listDay: { buttonText: ' day ' },
                    //listWeek: { buttonText: ' week ' },
                    //listMonth: { buttonText: ' month ' },
                    listYear: { buttonText: ' Scheduler ' }
                },

                initialView: initialView,
                initialDate: output,
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                dayMaxEvents: true, // allow "more" link when too many events    
                selectable: true,
                selectHelper: true,
                eventDidMount: function (event) {
                    $(event.el).find('.fc-list-event-title').prepend('<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                },
                eventContent: function (event) {
                    //alert(JSON.stringify(event));
                    var dateString = moment(event.event.start).format('YYYY-MM-DD');

                    $('#calendar5').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');
                },
                eventMouseEnter: function (calEvent) {

                    var tip = calEvent.el;

                    //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';
                    var tooltip = '<div class="tooltipevent patientCard" style="top:' + ($(tip).offset().top - 5) + 'px;left:' + ($(tip).offset().left + ($(tip).width()) / 2) + 'px"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                        + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.event.extendedProps.MRN_No + '</span></div>'
                        + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.event.extendedProps.Smoker + '</span></div>'
                        + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.event.extendedProps.ReasonForVisit + '</span></div>'
                        //+ '<div class="col-sm-12"><label>Status.:</label><span>' + calEvent.event.extendedProps.Status + '</span></div>'
                        + '</div></div>' + '<div class="col-sm-3"><img style="width:50px; height:50px;" src="' + calEvent.event.extendedProps.Photo
                        + '"/><div class="col-sm-12"><h3><span>' + calEvent.event.extendedProps.PatientName + '</span></h3></div></div>' + '</div></div>';

                    var $tooltip = $('body').append(tooltip); //$(tooltip).appendTo('body');

                    $(tip).mouseover(function (e) {
                        //alert('eewrwr');
                        $(tip).css('z-index', 10000);
                        $tooltip.fadeIn('500');
                        $tooltip.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tooltip.css('top', e.pageY + 10);
                        $tooltip.css('left', e.pageX + 20);
                    });
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

                eventMouseLeave: function (calEvent, jsEvent) {
                    var tip = calEvent.el;
                    $(tip).css('z-index', 8);
                    $('.tooltipevent').remove();
                },
                //dayClick: function (date, allDay, jsEvent, view) {
                //    var startdate = moment(dueStartDate).format('YYYY-MM-DD');
                //    var date1 = moment(date).format('YYYY-MM-DD');
                //    var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
                //    if (moment(date1).isBetween(startdate, EndDate) == false) {
                //        toastr.info("Appointment is only for 30 days, cannot view this date", "info");
                //        $('#calendar5').fullCalendar('gotoDate', date1);
                //        return false;
                //    }

                //    $scope.dayClicked(date);
                //},
                eventClick: function (info) {
                    //alert(JSON.stringify(info));
                    //alert(info.event.extendedProps.Appointment_Id)
                    //alert(info.event.start)
                    $('.tooltipevent').remove();

                    if (info.jsEvent.target.id === 'Delete') {
                        //var msg = confirm("Do you like to Cancel the Patient Appointment?");
                        //if (msg == true) {
                        //    $scope.CancelAppointmentModalList(info.event.extendedProps.Appointment_Id, info.event.start);
                        //    var dateString = moment(info.event.start).format('YYYY-MM-DD');
                        //    $('#calendar5').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                        //}
                        Swal.fire({
                            title: 'Do you like to Cancel the Patient Appointment?',
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
                                $scope.CancelAppointmentModal(info.event.extendedProps.Appointment_Id, info.event.start);
                                var dateString = moment(info.event.start).format('YYYY-MM-DD');
                                $('#calendar5').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                            } else if (result.isDenied) {
                                //Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                    }
                    else {
                        $scope.Id = info.event.id;
                        $scope.ViewPatientPopUp_30days($scope.Id);
                    }
                },
                // Remove Event On Click
                //eventContent: function (event, element) {

                //    var dateString = moment(event.start).format('YYYY-MM-DD');
                //    $('#calendar5').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');
                //    if (event.id != undefined) {
                //        element.html(event.title + '<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                //    }
                //},
                //eventAfterAllRender: function (view) {
                //    for (cDay = view.start.clone(); cDay.isBefore(view.end); cDay.add(1, 'day')) {

                //        var dateNum = cDay.format('YYYY-MM-DD');

                //        var dayEl = $('.fc-day[data-date="' + dateNum + '"]');
                //        var eventCount = $('.fc-event[date-num="' + dateNum + '"]').length;
                //        if (eventCount) {
                //            var html = '<div class="numberCircle">' +
                //                eventCount +
                //                '</div>';
                //            dayEl.append(html);
                //        }
                //    }
                //},
                //eventMouseEnter: function (calEvent, view) {
                //    //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';
                //    var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                //        + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.event.extendedProps.MRN_No + '</span></div>'
                //        + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.event.extendedProps.Smoker + '</span></div>'
                //        + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.event.extendedProps.ReasonForVisit
                //        + '</span></div>' + '</div></div>' + '<div class="col-sm-6"><img src="' + calEvent.event.extendedProps.Photo + '"/><div class="col-sm-12"><h1><span>' + calEvent.event.extendedProps.PatientName + '</span></h1></div></div>' + '</div></div>';

                //    var $tooltip = $('body').append(tooltip); //$(tooltip).appendTo('body');

                //    $(this).mouseover(function (e) {
                //        alert('eewrwr');
                //        $(this).css('z-index', 10000);
                //        $tooltip.fadeIn('500');
                //        $tooltip.fadeTo('10', 1.9);
                //    }).mousemove(function (e) {
                //        $tooltip.css('top', e.pageY + 10);
                //        $tooltip.css('left', e.pageX + 20);
                //    });
                //},
                //eventMouseLeave: function (calEvent, jsEvent) {
                //    $(this).css('z-index', 8);
                //    $('.tooltipevent').remove();
                //},
                //dayClick: function (date, allDay, jsEvent, view) {
                //    var startdate = moment(dueStartDate).format('YYYY-MM-DD');
                //    var date1 = moment(date).format('YYYY-MM-DD');
                //    var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
                //    if (moment(date1).isBetween(startdate, EndDate) == false) {
                //        //alert("Appointment is only for 30 days, cannot view this date");
                //        toastr.info("Appointment is only for 30 days, cannot view this date", "info");
                //        $('#calendar5').fullCalendar('gotoDate', date1);
                //        return false;
                //    }

                //    $scope.dayClicked(date);
                //},
                //eventClick: function (calEvent, jsEvent, view) {

                //    $('.tooltipevent').remove();
                //    if (jsEvent.target.id === 'Delete') {
                //        var msg = confirm("Do you like to Canncel the Patient Appointment?");
                //        if (msg == true) {
                //            $scope.CancelAppointmentModal(calEvent.Appointment_Id, calEvent.start);
                //        }
                //    }
                //    else {
                //        $scope.Id = calEvent.id;
                //        $scope.ViewPatientPopUp_30days($scope.Id);
                //    }
                //},

                events: ''
            });
            //$scope.LoadEvents();
            $scope.calendar5 = [];
            $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + 2 + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
                angular.forEach(patientdata, function (value, index) {
                    var obj = {
                        title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName + (value.Status==5 ? '-(Waiting For Approval)' : ''),
                        start: value.Appointment_FromTime,
                        end: value.Appointment_ToTime,
                        id: value.Patient_Id,
                        PatientName: value.PatientName,
                        Appointment_Id: value.Id,
                        MRN_No: value.MRN_No,
                        Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                        Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                        ReasonForVisit: value.ReasonForVisit,
                        Status: value.Status
                    };
                    $scope.calendar5.push(obj);
                })
                calendar5.addEventSource($scope.calendar5);
            });

            calendar5.render();
        }
        $scope.flag = 1;
        $scope.DailyCalendarView = function () {
            var calendarEll = document.getElementById('calendar');
            var calendarE = new FullCalendar.Calendar(calendarEll, {
                scrollTime: scrollTime,
                slotDuration: '00:15:00',
                visibleRange: {
                    start: '2020-02-01',
                    end: '2020-03-20'
                },
                eventLimit: true,
                displayEventTime: false,
                headerToolbar: {
                    left: '', //prev,next today
                    center: 'title',
                    right: '' //'listDay,listWeek'
                },

                // customize the button names,
                // otherwise they'd all just say "list"
                views: {
                    // listDay: { buttonText: 'list day' },
                    // listWeek: { buttonText: 'list week' }
                },

                initialView: 'timeGridDay', //'listWeek',
                initialDate: output,
                navLinks: true, // can click day/week names to navigate views
                editable: true,
                dayMaxEvents: true, // allow "more" link when too many events    
                selectable: true,
                selectHelper: true,
                // Remove Event On Click
                eventDidMount: function (event) {
                    $(event.el).find('.fc-event-title').prepend('<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                },
                eventContent: function (event) {
                    //alert(JSON.stringify(event));
                    var dateString = moment(event.event.start).format('YYYY-MM-DD');

                    $('#calendar').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');
                },
                eventMouseEnter: function (calEvent) {

                    var tip = calEvent.el;

                    //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';
                    var tooltip = '<div class="tooltipevent patientCard" style="top:' + ($(tip).offset().top - 5) + 'px;left:' + ($(tip).offset().left + ($(tip).width()) / 2) + 'px"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                        + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.event.extendedProps.MRN_No + '</span></div>'
                        + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.event.extendedProps.Smoker + '</span></div>'
                        + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.event.extendedProps.ReasonForVisit
                        + '</span></div>' + '</div></div>' + '<div class="col-sm-3"><img style="width:50px; height:50px;" src="' + calEvent.event.extendedProps.Photo
                        + '"/><div class="col-sm-12"><h3><span>' + calEvent.event.extendedProps.PatientName + '</span></h3></div></div>' + '</div></div>';

                    var $tooltip = $('body').append(tooltip); //$(tooltip).appendTo('body');

                    $(tip).mouseover(function (e) {
                        //alert('eewrwr');
                        $(tip).css('z-index', 10000);
                        $tooltip.fadeIn('500');
                        $tooltip.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tooltip.css('top', e.pageY + 10);
                        $tooltip.css('left', e.pageX + 20);
                    });
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

                eventMouseLeave: function (calEvent, jsEvent) {
                    var tip = calEvent.el;
                    $(tip).css('z-index', 8);
                    $('.tooltipevent').remove();
                },
                dayClick: function (date, allDay, jsEvent, view) {
                    var startdate = moment(dueStartDate).format('YYYY-MM-DD');
                    var date1 = moment(date).format('YYYY-MM-DD');
                    var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
                    if (moment(date1).isBetween(startdate, EndDate) == false) {
                        //alert("Appointment is only for 30 days, cannot view this date");
                        toastr.info("Appointment is only for 30 days, cannot view this date", "info");
                        $('#calendar').fullCalendar('gotoDate', date1);
                        return false;
                    }

                    $scope.dayClicked(date);
                },
                eventClick: function (info) {
                    $('.tooltipevent').remove();

                    if (info.jsEvent.target.id === 'Delete') {
                        //var msg = confirm("Do you like to Cancel the Patient Appointment?");
                        //if (msg == true) {
                        //    $scope.CancelAppointmentModal(info.extendedProps.Appointment_Id, info.event.extendedProps.start);
                        //    var dateString = moment(info.event.start).format('YYYY-MM-DD');
                        //    $('#calendar').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                        //}
                        Swal.fire({
                            title: 'Do you like to Cancel the Patient Appointment?',
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
                                $scope.CancelAppointmentModal(info.event.extendedProps.Appointment_Id, info.event.start);
                                var dateString = moment(info.event.start).format('YYYY-MM-DD');
                                $('#calendar').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                            } else if (result.isDenied) {
                                //Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                    }
                    else {
                        $scope.Id = info.event.id;
                        $scope.ViewPatientPopUp_30days($scope.Id);
                    }
                },

                events: ''
            });
            $scope.calendar = [];
            $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + 2 + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
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
                    $scope.calendar.push(obj);
                })
                calendarE.addEventSource($scope.calendar);

                $("#chatLoaderPV1").hide();
            });

            calendarE.render();
        }

        //angular.element(document).ready(function () {
        //    if ($window.localStorage['UserTypeId'] == 4 || $window.localStorage['UserTypeId'] == 7 || $window.localStorage['UserTypeId'] == 5) {
        //        $scope.calendarListView();
        //        $scope.DailyCalendarView();

        //        //var calendar = $('#calendar').fullCalendar(
        //        //    {
        //        //        timeZone: 'UTC',
        //        //        scrollTime: scrollTime,
        //        //        slotDuration: '00:15:00',
        //        //        eventLimit: true,
        //        //        displayEventTime: false,
        //        //        slotEventOverlap: false,
        //        //        header: {
        //        //            left: '',
        //        //            center: 'title',
        //        //            right: ''
        //        //        },
        //        //        titleFormat: {
        //        //            month: 'MMMM YYYY',   // like 'September 2009', for month view
        //        //            week: 'MMM D YYYY', // like 'Sep 13 2009', for week views
        //        //            day: 'MMMM D YYYY' // like 'September 8 2009', for day views
        //        //        },
        //        //        views: {
        //        //            agendaFiveDay: {
        //        //                type: 'agenda',
        //        //                duration: { days: 5 },
        //        //                buttonText: 'Five Day'
        //        //            }
        //        //        },
        //        //        defaultView: 'agendaDay',
        //        //        selectable: true,
        //        //        selectHelper: true,
        //        //        //eventClick: function (calEvent, jsEvent, view) {
        //        //        //},
        //        //        // Remove Event On Click
        //        //        eventRender: function (event, element) {
        //        //            if (event.id != undefined) {
        //        //                element.html(event.title + '<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
        //        //            }
        //        //        },
        //        //        eventClick: function (calEvent, jsEvent, view) {
        //        //            $('.tooltipevent').remove();
        //        //            if (jsEvent.target.id === 'Delete') {
        //        //                var msg = confirm("Do you like to Cancel the Patient Appointment?");
        //        //                if (msg == true) {
        //        //                    $scope.CancelAppointmentModal(calEvent.Appointment_Id, calEvent.start);
        //        //                }
        //        //            }
        //        //            else {
        //        //                $scope.Id = calEvent.id;
        //        //                $scope.ViewPatientPopUp($scope.Id);
        //        //            }
        //        //        },
        //        //        viewRender: function (view, element) {
        //        //            $scope.FromDate = view.intervalStart._d;
        //        //            $scope.ToDate = view.intervalEnd._d;
        //        //            $scope.dataCalendar = [];
        //        //            $("#chatLoaderPV1").show();
        //        //            $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + view.intervalStart.format("DD-MMM-YYYY") + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (data) {
        //        //                angular.forEach(data, function (value, index) {
        //        //                    var obj = {
        //        //                        title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
        //        //                        start: value.Appointment_FromTime,
        //        //                        end: value.Appointment_ToTime,
        //        //                        id: value.Patient_Id,
        //        //                        PatientName: value.PatientName,
        //        //                        Appointment_Id: value.Id,
        //        //                        MRN_No: value.MRN_No,
        //        //                        Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
        //        //                        Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
        //        //                        ReasonForVisit: value.ReasonForVisit
        //        //                    };
        //        //                    $scope.dataCalendar.push(obj);
        //        //                });

        //        //                $('#calendar').fullCalendar('removeEvents');
        //        //                $('#calendar').fullCalendar('removeEventSource', $scope.dataCalendar)
        //        //                $('#calendar').fullCalendar('addEventSource', $scope.dataCalendar)
        //        //                $('#calendar').fullCalendar('refetchEvents');
        //        //                $("#chatLoaderPV1").hide();
        //        //            }).error(function (data) {
        //        //                $("#chatLoaderPV1").hide();
        //        //                $scope.error = "An error has occurred while Listing Today's appointment!" + data;
        //        //            });

        //        //        },
        //        //        eventMouseover: function (calEvent, jsEvent) {
        //        //            //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' 
        //        //            //            + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'
        //        //            //            + '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'
        //        //            //            + '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit 
        //        //            //            +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';        
        //        //            if (calEvent.MRN_No != undefined) {
        //        //                var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">'
        //        //                    + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.MRN_No + '</span></div>'
        //        //                    + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.Smoker + '</span></div>'
        //        //                    + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.ReasonForVisit
        //        //                    + '</span></div>' + '</div></div>' + '<div class="col-sm-6"><img src="' + calEvent.Photo + '"/><div class="col-sm-12"><h1><span>' + calEvent.PatientName + '</span></h1></div></div>' + '</div></div>';


        //        //                var $tooltip = $(tooltip).appendTo('body');
        //        //                $(this).mouseover(function (e) {
        //        //                    $(this).css('z-index', 10000);
        //        //                    $tooltip.fadeIn('500');
        //        //                    $tooltip.fadeTo('10', 1.9);
        //        //                }).mousemove(function (e) {
        //        //                    $tooltip.css('top', e.pageY + 10);
        //        //                    $tooltip.css('left', e.pageX + 20);
        //        //                });
        //        //            };
        //        //        },

        //        //        eventMouseout: function (calEvent, jsEvent) {
        //        //            $(this).css('z-index', 8);
        //        //            $('.tooltipevent').remove();
        //        //        },
        //        //        events: $scope.dataCalendar,
        //        //        timeFormat: 'H:mm:ss', // uppercase H for 24-hour clock
        //        //        timezone: "local",
        //        //        cache: false
        //        //    });
        //    } else {
        //        window.location.href = baseUrl + "/Home/LoginIndex";
        //    }
        //});

        $(document).ready(function () {
            $scope.dayClicked = function (date) {
                $scope.flag = 3;
                //$('#calendar').fullCalend(ar('gotoDate', date);
                var calendarEll = document.getElementById('calendar');
                var calendarE = new FullCalendar.Calendar(calendarEll, {
                    scrollTime: scrollTime,
                    slotDuration: '00:15:00',
                    visibleRange: {
                        start: '2020-02-01',
                        end: '2020-03-20'
                    },
                    eventLimit: true,
                    displayEventTime: false,
                    headerToolbar: {
                        left: '', //prev,next today
                        center: 'title',
                        right: '' //'listDay,listWeek'
                    },

                    // customize the button names,
                    // otherwise they'd all just say "list"
                    views: {
                        // listDay: { buttonText: 'list day' },
                        // listWeek: { buttonText: 'list week' }
                    },

                    initialView: 'timeGridDay', //'listWeek',
                    initialDate: output,
                    navLinks: true, // can click day/week names to navigate views
                    editable: true,
                    dayMaxEvents: true, // allow "more" link when too many events    
                    selectable: true,
                    selectHelper: true,
                    // Remove Event On Click
                    eventDidMount: function (event) {
                        $(event.el).find('.fc-event-title').prepend('<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                    },
                    eventContent: function (event) {
                        //alert(JSON.stringify(event));
                        var dateString = moment(event.event.start).format('YYYY-MM-DD');

                        $('#calendar').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');
                    },
                    eventMouseEnter: function (calEvent) {

                        var tip = calEvent.el;

                        //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';
                        var tooltip = '<div class="tooltipevent patientCard" style="top:' + ($(tip).offset().top - 5) + 'px;left:' + ($(tip).offset().left + ($(tip).width()) / 2) + 'px"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                            + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.event.extendedProps.MRN_No + '</span></div>'
                            + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.event.extendedProps.Smoker + '</span></div>'
                            + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.event.extendedProps.ReasonForVisit
                            + '</span></div>' + '</div></div>' + '<div class="col-sm-3"><img style="width:50px; height:50px;" src="' + calEvent.event.extendedProps.Photo
                            + '"/><div class="col-sm-12"><h3><span>' + calEvent.event.extendedProps.PatientName + '</span></h3></div></div>' + '</div></div>';

                        var $tooltip = $('body').append(tooltip); //$(tooltip).appendTo('body');

                        $(tip).mouseover(function (e) {
                            //alert('eewrwr');
                            $(tip).css('z-index', 10000);
                            $tooltip.fadeIn('500');
                            $tooltip.fadeTo('10', 1.9);
                        }).mousemove(function (e) {
                            $tooltip.css('top', e.pageY + 10);
                            $tooltip.css('left', e.pageX + 20);
                        });
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

                    eventMouseLeave: function (calEvent, jsEvent) {
                        var tip = calEvent.el;
                        $(tip).css('z-index', 8);
                        $('.tooltipevent').remove();
                    },
                    dayClick: function (date, allDay, jsEvent, view) {
                        var startdate = moment(dueStartDate).format('YYYY-MM-DD');
                        var date1 = moment(date).format('YYYY-MM-DD');
                        var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
                        if (moment(date1).isBetween(startdate, EndDate) == false) {
                            //alert("Appointment is only for 30 days, cannot view this date");
                            toastr.info("Appointment is only for 30 days, cannot view this date", "info");
                            $('#calendar').fullCalendar('gotoDate', date1);
                            return false;
                        }

                        $scope.dayClicked(date);
                    },
                    eventClick: function (info) {
                        //alert(JSON.stringify(info));
                        //alert(info.event.extendedProps.Appointment_Id)
                        //alert(info.event.start)
                        $('.tooltipevent').remove();

                        if (info.jsEvent.target.id === 'Delete') {
                            //var msg = confirm("Do you like to Cancel the Patient Appointment?");
                            //if (msg == true) {
                            //    $scope.CancelAppointmentModal(info.event.extendedProps.Appointment_Id, info.event.start);
                            //    var dateString = moment(info.event.start).format('YYYY-MM-DD');
                            //    $('#calendar').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                            //}
                            Swal.fire({
                                title: 'Do you like to Cancel the Patient Appointment?',
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
                                    $scope.CancelAppointmentModal(info.event.extendedProps.Appointment_Id, info.event.start);
                                    var dateString = moment(info.event.start).format('YYYY-MM-DD');
                                    $('#calendar').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                                } else if (result.isDenied) {
                                    //Swal.fire('Changes are not saved', '', 'info')
                                }
                            })
                        }
                        else {
                            $scope.Id = info.event.id;
                            $scope.ViewPatientPopUp_30days($scope.Id);
                        }
                    },

                    events: ''
                });
                $scope.calendar = [];
                $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + 2 + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
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
                        $scope.calendar.push(obj);
                    })
                    calendarE.addEventSource($scope.calendar);

                    $("#chatLoaderPV1").hide();
                });

                calendarE.render();
               
                //calendarE.fullCalendar('gotoDate', date);
                calendarE.gotoDate(date);
            }
            
        });
        $scope.FNCancel = function () {
            $('.tooltipevent').remove();
        }
        var dueStartDate = moment().subtract(1, 'days');
        var dueEndDate = moment().add(30, 'days');

        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '-' +
            (month < 10 ? '0' : '') + month + '-' +
            (day < 10 ? '0' : '') + day;

        $scope.getMonthlyAppointment = function () {
            //var calendar = $('#calendar1').fullCalendar(
            //    {
            //        scrollTime: scrollTime,
            //        slotDuration: '00:15:00',
            //        visibleRange: {
            //            start: '2020-02-01',
            //            end: '2020-03-20'
            //        },
            //        eventLimit: true,
            //        displayEventTime: false,

            //        header: {
            //            left: 'prev,next',
            //            center: 'title',
            //            right: ''
            //        },
            //        titleFormat: {
            //            month: 'MMMM YYYY',   // like 'September 2009', for month view
            //            week: 'MMM D YYYY', // like 'Sep 13 2009', for week views
            //            day: 'MMMM D YYYY' // like 'September 8 2009', for day views
            //        },
            //        views: {
            //            agendaFiveDay: {
            //                type: 'agenda',
            //                duration: { days: 5 },
            //                buttonText: 'Five Day'
            //            }
            //        },
            //        defaultView: 'month',
            //        selectable: true,
            //        selectHelper: true,
            //        // Remove Event On Click
            //        eventRender: function (event, element) {

            //            var dateString = moment(event.start).format('YYYY-MM-DD');
            //            $('#calendar1').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');
            //            if (event.id != undefined) {
            //                element.html(event.title + '<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
            //            }
            //        },
            //        eventAfterAllRender: function (view) {
            //            for (cDay = view.start.clone(); cDay.isBefore(view.end); cDay.add(1, 'day')) {

            //                var dateNum = cDay.format('YYYY-MM-DD');

            //                var dayEl = $('.fc-day[data-date="' + dateNum + '"]');
            //                var eventCount = $('.fc-event[date-num="' + dateNum + '"]').length;
            //                if (eventCount) {
            //                    var html = '<div class="numberCircle">' +
            //                        eventCount +
            //                        '</div>';
            //                    dayEl.append(html);
            //                }
            //            }
            //        },

            //        dayClick: function (date, allDay, jsEvent, view) {
            //            var startdate = moment(dueStartDate).format('YYYY-MM-DD');
            //            var date1 = moment(date).format('YYYY-MM-DD');
            //            var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
            //            if (moment(date1).isBetween(startdate, EndDate) == false) {
            //                //alert("Appointment is only for 30 days, cannot view this date");
            //                toastr.info("Appointment is only for 30 days, cannot view this date", "info");
            //                $('#calendar1').fullCalendar('gotoDate', date1);
            //                return false;
            //            }

            //            $scope.dayClicked(date);
            //        },
            //        eventClick: function (calEvent, jsEvent, view) {
            //            $('.tooltipevent').remove();
            //            if (jsEvent.target.id === 'Delete') {
            //                var msg = confirm("Do you like to Canncel the Patient Appointment?");
            //                if (msg == true) {
            //                    $scope.CancelAppointmentModal(calEvent.Appointment_Id, calEvent.start);
            //                }
            //            }
            //            else {
            //                $scope.Id = calEvent.id;
            //                $scope.ViewPatientPopUp_30days($scope.Id);
            //            }
            //        },
            //        viewRender: function (view, element) {
            //            $scope.FromDate = view.intervalStart._d;
            //            $scope.ToDate = view.intervalEnd._d;
            //            $scope.dataCalendar1 = [];
            //            $scope.flag = 2;
            //            $scope.dataCalendar1 = [];
            //            $("#chatLoaderPV1").show();
            //            $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + $scope.flag + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
            //                angular.forEach(patientdata, function (value, index) {
            //                    var obj = {
            //                        title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
            //                        start: value.Appointment_FromTime,
            //                        end: value.Appointment_ToTime,
            //                        id: value.Patient_Id,
            //                        PatientName: value.PatientName,
            //                        Appointment_Id: value.Id,
            //                        MRN_No: value.MRN_No,
            //                        Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
            //                        Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
            //                        ReasonForVisit: value.ReasonForVisit
            //                    };
            //                    $scope.dataCalendar1.push(obj);
            //                })
            //                $('#calendar1').fullCalendar('removeEvents');
            //                $('#calendar1').fullCalendar('removeEventSource', $scope.dataCalendar1)
            //                $('#calendar1').fullCalendar('addEventSource', $scope.dataCalendar1)
            //                $('#calendar1').fullCalendar('refetchEvents');
            //                $("#chatLoaderPV1").hide();
            //            }).error(function (data) {
            //                $("#chatLoaderPV1").hide();
            //                $scope.error = "An error has occurred while Listing Today's appointment!" + data;
            //            });
            //        },
            //        eventMouseover: function (calEvent, jsEvent) {
            //            //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';

            //            var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">'
            //                + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.MRN_No + '</span></div>'
            //                + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.Smoker + '</span></div>'
            //                + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.ReasonForVisit
            //                + '</span></div>' + '</div></div>' + '<div class="col-sm-6"><img src="' + calEvent.Photo + '"/><div class="col-sm-12"><h1><span>' + calEvent.PatientName + '</span></h1></div></div>' + '</div></div>';

            //            var $tooltip = $(tooltip).appendTo('body');
            //            $(this).mouseover(function (e) {
            //                $(this).css('z-index', 10000);
            //                $tooltip.fadeIn('500');
            //                $tooltip.fadeTo('10', 1.9);
            //            }).mousemove(function (e) {
            //                $tooltip.css('top', e.pageY + 10);
            //                $tooltip.css('left', e.pageX + 20);
            //            });
            //        },

            //        eventMouseout: function (calEvent, jsEvent) {
            //            $(this).css('z-index', 8);
            //            $('.tooltipevent').remove();
            //        },
            //        events: $scope.dataCalendar1,
            //        timeFormat: 'H:mm:ss', // uppercase H for 24-hour clock
            //        timezone: "local",
            //        cache: false
            //    });
                       
            
            //var LoadCalendarList = [];
            var calendarEl = document.getElementById('calendar1');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                scrollTime: scrollTime,
                slotDuration: '00:15:00',
                visibleRange: {
                    start: '2020-02-01',
                    end: '2020-03-20'
                },
                eventLimit: true,
                displayEventTime: false,
               
                headerToolbar: {
                    left: 'prev,next', //today
                    center: 'title',
                    right: '' //'listDay,listWeek'
                },

                initialView: 'dayGridMonth', //'listWeek',
                initialDate: output,
                navLinks: false, // can click day/week names to navigate views
                editable: true,
                dayMaxEvents: true, // allow "more" link when too many events    
                selectable: true,
                selectHelper: true,
               
                eventDidMount: function (event) {                   
                    $(event.el).find('.fc-event-title').prepend('<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>');
                },
                eventContent: function (event) {
                    //alert(JSON.stringify(event));
                    var dateString = moment(event.event.start).format('YYYY-MM-DD');
                    
                    $('#calendar1').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '#FAA732');                  
                },
                eventMouseEnter: function (calEvent) {
                   
                    var tip = calEvent.el;
                    
                    //var tooltip = '<div class="tooltipevent patientCard"><div class="row">' + '<div class="col-sm-6"><div class="row">' + '<div class="col-sm-8">'+ calEvent.PatientName +'</div>' + '<div class="col-sm-8"><label>MRN No.:</label>'+ calEvent.MRN_No +'</div>'+ '<div class="col-sm-8"><label>Smoker:</label>'+ calEvent.Smoker +'</div>'+ '<div class="col-sm-8"><label>Reason For Visit:</label>'+ calEvent.ReasonForVisit +'</div>'+'</div></div>' + '<div class="col-sm-6"><div><img src="'+calEvent.Photo + '"/></div></div>' + '</div></div>';
                    var tooltip = '<div class="tooltipevent patientCard" style="top:' + ($(tip).offset().top - 5) + 'px;left:' + ($(tip).offset().left + ($(tip).width()) / 2) + 'px"><div class="row">' + '<div class="col-sm-6"><div class="row">'
                        + '<div class="col-sm-12"><label>MRN No.:</label><span>' + calEvent.event.extendedProps.MRN_No + '</span></div>'
                        + '<div class="col-sm-12"><label>Smoker:</label><span>' + calEvent.event.extendedProps.Smoker + '</span></div>'
                        + '<div class="col-sm-12"><label>Reason For Visit:</label><span>' + calEvent.event.extendedProps.ReasonForVisit
                        + '</span></div>' + '</div></div>' + '<div class="col-sm-3"><img style="width:50px; height:50px;" src="' + calEvent.event.extendedProps.Photo
                        + '"/><div class="col-sm-12"><h3><span>' + calEvent.event.extendedProps.PatientName + '</span></h3></div></div>' + '</div></div>';

                   var $tooltip = $('body').append(tooltip); //$(tooltip).appendTo('body');

                    $(tip).mouseover(function (e) {
                        //alert('eewrwr');
                        $(tip).css('z-index', 10000);
                        $tooltip.fadeIn('500');
                        $tooltip.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tooltip.css('top', e.pageY + 10);
                        $tooltip.css('left', e.pageX + 20);
                    });
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
               
                eventMouseLeave: function (calEvent, jsEvent) {
                    var tip = calEvent.el;
                    $(tip).css('z-index', 8);
                        $('.tooltipevent').remove();
                    },
                dateClick: function (info) { //date, allDay, jsEvent, view) {
                    var startdate = moment(dueStartDate).format('YYYY-MM-DD');
                    var date1 = moment(info.date).format('YYYY-MM-DD');
                    var EndDate = moment(dueEndDate).format('YYYY-MM-DD');
                    if (moment(date1).isBetween(startdate, EndDate) == false) {                        
                        toastr.info("Appointment is only for 30 days, cannot view this date", "info");
                        $('#calendar1').fullCalendar('gotoDate', date1);
                        return false;
                    }

                    $scope.dayClicked(info.date);
                },
                eventClick: function (info) {
                    //alert(JSON.stringify(info));
                    //alert(info.event.extendedProps.Appointment_Id)
                    //alert(info.event.start)
                   $('.tooltipevent').remove();
                   
                    if (info.jsEvent.target.id === 'Delete') {
                        //var msg = confirm("Do you like to Cancel the Patient Appointment?");
                        //if (msg == true) {
                        //    $scope.CancelAppointmentModal(info.event.extendedProps.Appointment_Id, info.event.start);
                        //    var dateString = moment(info.event.start).format('YYYY-MM-DD');
                        //    $('#calendar1').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');                            
                        //}
                        Swal.fire({
                            title: 'Do you like to Cancel the Patient Appointment?',
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
                                $scope.CancelAppointmentModal(info.event.extendedProps.Appointment_Id, info.event.start);
                                var dateString = moment(info.event.start).format('YYYY-MM-DD');
                                $('#calendar1').find('.fc-day[data-date="' + dateString + '"]').css('background-color', '');
                            } else if (result.isDenied) {
                                //Swal.fire('Changes are not saved', '', 'info')
                            }
                        })
                    }
                    else {
                        $scope.Id = info.event.id;
                        $scope.ViewPatientPopUp_30days($scope.Id);
                    }
                },
                timeFormat: 'H:mm:ss', // uppercase H for 24-hour clock
                timezone: "local",
                cache: false,
                contentHeight: 600
                //events: ''
            });
            
            $scope.calendar1 = [];
            $http.get(baseUrl + '/api/PatientAppointments/DoctorAppointmentList/?Doctor_Id=' + $scope.Doctor_Id + '&flag=' + 2 + '&ViewDate=' + moment() + '&Login_Session_Id=' + $scope.LoginSessionId).success(function (patientdata) {
                $("#chatLoaderPV1").show();
                angular.forEach(patientdata, function (value, index) {
                    var obj = {
                        title: moment(value.Appointment_FromTime).format('hh:mm a') + '-' + moment(value.Appointment_ToTime).format('hh:mm a') + '-' + value.PatientName,
                        PatientName: value.PatientName,
                        start: value.Appointment_FromTime,
                        end: value.Appointment_ToTime,
                        id: value.Patient_Id,
                        Appointment_Id: value.Id,
                        MRN_No: value.MRN_No,
                        Photo: value.PhotoBlob == null ? '../../Images/male.png' : 'data:image/png;base64,' + value.PhotoBlob,
                        Smoker: value.Smoker == 1 ? 'Yes' ? value.Smoker == 2 : 'No' : 'UnKnown',
                        ReasonForVisit: value.ReasonForVisit,
                        Color: '#FAA732'
                    };
                    $scope.calendar1.push(obj);
                })
                calendar.addEventSource($scope.calendar1);
               
                $("#chatLoaderPV1").hide();
            });
           
            calendar.render();
        }
              
    }

]);