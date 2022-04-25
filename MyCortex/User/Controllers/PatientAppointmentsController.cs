using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using log4net;
using System.Security.Cryptography;
using MyCortex.Repositories.Admin;
using MyCortex.Repositories;
using MyCortex.Repositories.Uesr;
using MyCortex.User.Model;
using MyCortex.Notification;
using MyCortex.Notification.Models;
using MyCortex.Provider;
using System.Text;
using System.Text.RegularExpressions;

namespace MyCortex.User.Controller
{
    [Authorize]
    [CheckSessionOutFilter]
    public class PatientAppointmentsController : ApiController
    {
        static readonly IPatientAppointmentsRepository repository = new PatientAppointmentRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Doctor's Patient Appointment list for a date
        /// </summary>
        /// <param name="Doctor_Id"></param>
        /// <param name="flag"></param>
        /// <param name="ViewDate"></param>
        /// <returns>Patient Appointment list for a date and doctor</returns>
        [HttpGet]
        public IList<PatientAppointmentsModel> DoctorAppointmentList(long Doctor_Id, int flag, DateTime? ViewDate, Guid Login_Session_Id)
        {
            try
            {
                IList<PatientAppointmentsModel> model;
                model = repository.DoctorAppointmentList(Doctor_Id, flag, ViewDate, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to cancel a patient appointment
        /// </summary>
        /// <param name="Obj"></param>
        /// <returns>cancelled patient appointment</returns>
        public HttpResponseMessage CancelPatient_Appointment(Guid Login_Session_Id,[FromBody] PatientAppointmentsModel Obj)
        {
            PatientAppointmentsModel ModelData = new PatientAppointmentsModel();
            PatientAppointmentsReturnModel model = new PatientAppointmentsReturnModel();

            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                model.AppointmentDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.Update_CancelledAppointment(Login_Session_Id,Obj);
                if ((ModelData.flag == 1) == true)
                {
                    messagestr = "Appointment Cancelled Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((ModelData.flag == 3) == true)
                {
                    messagestr = "Appointment Can't Be Cancelled, Cancelation Time Is End!";
                    model.ReturnFlag = 0;
                    model.Status = "True";
                }
                else
                {
                    messagestr = "Error in Cancelling the Appointment";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.Error_Code = "";
                model.AppointmentDetails = ModelData;
                model.Message = messagestr;

                if ((ModelData.flag == 1) == true)
                {
                    //string Event_Code = "";
                    //Event_Code = "PAT_APPOINTMENT_CANCEL";

                    //AlertEvents AlertEventReturn = new AlertEvents();
                    //IList<EmailListModel> EmailList;
                    //EmailList = AlertEventReturn.Patient_Appointment_Cancel_AlertEvent((long)Obj.Id, (long)ModelData.Institution_Id);

                    //AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Obj.Id, (long)ModelData.Institution_Id, EmailList);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Cancelling Appointment";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.AppointmentDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to insert a new patient appointment
        /// </summary>
        /// <param name="insobj"></param>
        /// <returns>inserted patient appointment</returns>
        [HttpPost]
        public HttpResponseMessage PatientAppointment_InsertUpdate(Guid Login_Session_Id,[FromBody] PatientAppointmentsModel insobj)
        {
            IList<PatientAppointmentsModel> ModelData = new List<PatientAppointmentsModel>();
            PatientAppointmentsReturnModel model = new PatientAppointmentsReturnModel();
            string TimeZoneName = insobj.TimeZoneName;
            string UtcOffSet = insobj.UtcOffSet;
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientAppointmentList = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.PatientAppointment_InsertUpdate(Login_Session_Id,insobj);
                if(insobj.ReasonForVisit=="" || insobj.ReasonForVisit==null)
                {
                    model.Status = "False";
                    model.ReturnFlag = 0;
                    messagestr = "Reason for Visit should not be empty.";
                }
                else if (ModelData.Any(item => item.flag == 1) == true)
                {
                    model.Status = "True";
                    model.ReturnFlag = 1;
                    messagestr = "Patient Appointment created Successfully";
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    model.Status = "True";
                    model.ReturnFlag = 1;
                    messagestr = "Patient Appointment updated Successfully";
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    model.Status = "False";
                    model.ReturnFlag = 0;
                    messagestr = "Patient Appointment already created by CareGiver, cannot be created";
                }
                else if (ModelData.Any(item => item.flag == 4) == true)
                {
                    model.Status = "False";
                    model.ReturnFlag = 1;
                    messagestr = "Patient Appointment Can't Added, Subscription Timezone Missing!";
                }
                model.PatientAppointmentList = ModelData;
                model.Message = messagestr;// "User created successfully";

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    //  below code moved to windows service

                    //string Event_Code = "";
                    //Event_Code = "PAT_APPOINTMENT_CREATION";

                    //AlertEvents AlertEventReturn = new AlertEvents();
                    //IList<EmailListModel> EmailList;
                    //EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)ModelData[0].Id, (long)insobj.Institution_Id);

                    //AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData[0].Id, (long)insobj.Institution_Id, EmailList);

                    test(ModelData[0].Id, ModelData[0].AppointmentFromTime, ModelData[0].AppointmentToTime, TimeZoneName, UtcOffSet);

                    //var calendar = new Ical.Net.Calendar();
                    //foreach (var res in reg.Reservations)
                    //{
                    //    calendar.Events.Add(new Event
                    //    {
                    //        Class = "PUBLIC",
                    //        Summary = res.Summary,
                    //        Created = new CalDateTime(DateTime.Now),
                    //        Description = res.Details,
                    //        Start = new CalDateTime(Convert.ToDateTime(res.BeginDate)),
                    //        End = new CalDateTime(Convert.ToDateTime(res.EndDate)),
                    //        Sequence = 0,
                    //        Uid = Guid.NewGuid().ToString(),
                    //        Location = res.Location,
                    //    });
                    //}
                    //var serializer = new CalendarSerializer(new SerializationContext());
                    //var serializedCalendar = serializer.SerializeToString(calendar);
                    //var bytesCalendar = Encoding.UTF8.GetBytes(serializedCalendar);
                    //MemoryStream ms = new MemoryStream(bytesCalendar);
                    //System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(ms, "event.ics", "text/calendar");

                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Subscription";
                model.PatientAppointmentList = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        public void test(long id, DateTime appoint_from, DateTime appoint_to, string TimeZoneName, string UtcOffSet)
        {
            try
            {
                UtcOffSet = UtcOffSet.Replace(":", "");
                TimeZoneName = "Etc/UTC";
                //some variables for demo purposes
                DateTime DateStart = appoint_from;
                DateTime DateEnd = appoint_to;
                string Summary = "Appointment Details";
                string Location = "Event location";
                string Description = "Appointment Details";

                //create a new stringbuilder instance
                StringBuilder sb = new StringBuilder();

                //start the calendar item
                sb.AppendLine("BEGIN:VCALENDAR");
                sb.AppendLine("VERSION:2.0");
                sb.AppendLine("METHOD:REQUEST");
                sb.AppendLine("PRODID:mycortexdev1.vjhsoftware.in");
                sb.AppendLine("CALSCALE:GREGORIAN");
                //create a time zone if needed, TZID to be used in the event itself
                sb.AppendLine("BEGIN:VTIMEZONE");
                sb.AppendLine("TZID:" + TimeZoneName);
                sb.AppendLine("BEGIN:STANDARD");
                sb.AppendLine("TZOFFSETTO:" + UtcOffSet);
                sb.AppendLine("TZOFFSETFROM:" + UtcOffSet);
                sb.AppendLine("END:STANDARD");
                sb.AppendLine("END:VTIMEZONE");

                //add the event
                sb.AppendLine("BEGIN:VEVENT");
                sb.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
                sb.AppendLine(string.Format("DESCRIPTION:{0}", "Please Attend the Appointment with this schedule"));
                sb.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", "Please Attend the Appointment with this schedule"));
                //with time zone specified
                sb.AppendLine("DTSTART;TZID=" + TimeZoneName + ":" + DateStart.ToString("yyyyMMddTHHmm00"));
                sb.AppendLine("DTEND;TZID=" + TimeZoneName + ":" + DateEnd.ToString("yyyyMMddTHHmm00"));
                //or without
                sb.AppendLine("DTSTART:" + DateStart.ToString("yyyyMMddTHHmm00"));
                sb.AppendLine("DTEND:" + DateEnd.ToString("yyyyMMddTHHmm00"));
                sb.AppendLine("SUMMARY:" + Summary + "");
                sb.AppendLine("LOCATION:" + Location + "");
                sb.AppendLine("DESCRIPTION:" + Description + "");
                sb.AppendLine("PRIORITY:3");
                sb.AppendLine("BEGIN:VALARM");
                sb.AppendLine("TRIGGER:-PT15M");
                sb.AppendLine("ACTION:DISPLAY");
                sb.AppendLine("DESCRIPTION:Reminder");
                sb.AppendLine("END:VALARM");
                sb.AppendLine("END:VEVENT");

                //end calendar item
                sb.AppendLine("END:VCALENDAR");

                //create a string from the stringbuilder
                string CalendarItem = sb.ToString();

                var createfolder = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("/Appointments/" + id.ToString() + "/"), "");  // DateTime.Now.ToString("dd-MM-yyyy")
                if (!Directory.Exists(createfolder))
                {
                    System.IO.Directory.CreateDirectory(createfolder);
                }
                string fileName = createfolder + "/" + id.ToString() + ".ics";
                if (File.Exists(fileName))
                {
                    File.Delete(fileName);
                }

                using (StreamWriter sw = File.CreateText(fileName))
                {
                    sw.WriteLine(CalendarItem);
                }

                ////send the calendar item to the browser
                //HttpContext.Current.Response.ClearHeaders();
                //HttpContext.Current.Response.Clear();
                //HttpContext.Current.Response.Buffer = true;
                //HttpContext.Current.Response.ContentType = "text/calendar";
                //HttpContext.Current.Response.AddHeader("content-length", CalendarItem.Length.ToString());
                //HttpContext.Current.Response.AddHeader("content-disposition", "attachment; filename=\"" + FileName + ".ics\"");
                //HttpContext.Current.Response.Write(CalendarItem);
                //HttpContext.Current.Response.Flush();
                //HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }

        }

        [HttpPost]
        public HttpResponseMessage AppointmentReSchedule_InsertUpdate(Guid Login_Session_Id, [FromBody] PatientAppointmentsModel insobj)
        {
            IList<PatientAppointmentsModel> ModelData = new List<PatientAppointmentsModel>();
            PatientAppointmentsReturnModel model = new PatientAppointmentsReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientAppointmentList = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.AppointmentReSchedule_InsertUpdate(Login_Session_Id, insobj);
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    model.ReturnFlag = 1;
                    messagestr = "Patient Appointment ReScheduled Successfully";
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    model.ReturnFlag = 0;
                    messagestr = "Patient Appointment Cannot be ReScheduled, ReScheduled Time Is End!";
                }
                else if (ModelData.Any(item => item.flag == 3) == true)
                {
                    model.ReturnFlag = 0;
                    messagestr = "Patient Appointment already created by CareGiver, cannot be created";
                }
                model.PatientAppointmentList = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    //string Event_Code = "";
                    //Event_Code = "PAT_APPOINTMENT_CREATION";

                    //AlertEvents AlertEventReturn = new AlertEvents();
                    //IList<EmailListModel> EmailList;
                    //EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)ModelData[0].Id, (long)insobj.Institution_Id);

                    //AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData[0].Id, (long)insobj.Institution_Id, EmailList);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Subscription";
                model.PatientAppointmentList = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// Doctor name list based on selected patient's group
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<PatientAppointmentsModel> PatientBasedGroupBasedClinicianList(long Patient_Id)
        {
            try
            {
                IList<PatientAppointmentsModel> model;
                model = repository.PatientBasedGroupBasedClinicianList(Patient_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [HttpGet]
        public IList<AppointmentPaymentHistory> AppointmentPaymentHistory(long appointmentId, Guid Login_Session_Id, long Institution_Id)
        {
            try
            {
                IList<AppointmentPaymentHistory> model;
                model = repository.AppointmentPaymentHistory(appointmentId, Login_Session_Id, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [HttpGet]
        public IList<PatientAppointmentsModel> DepartmentwiseDoctorList(string DepartmentIds,long InstitutionId,DateTime Date,Int32 IsShift = 0)
        {
            try
            {
                IList<PatientAppointmentsModel> model;
                model = repository.DepartmentwiseDoctorList(DepartmentIds, InstitutionId, Date, IsShift);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Appointment Reason type name list of a Institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>Appointment Reason type name list</returns>
        [HttpGet]
        public IList<AppointmentReasonType> AppointmentReasonType_List(long Institution_Id)
        {
            try
            {
                IList<AppointmentReasonType> model;
                model = repository.AppointmentReasonType_List(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [HttpGet]
        public HttpResponseMessage GetScheduledDates(Guid Login_Session_Id,long InstitutionId)
        {
            IList<ScheduledDaysListModel> ModelData = new List<ScheduledDaysListModel>();
            ScheduledDaysListReturnModel model = new ScheduledDaysListReturnModel();
            string messagestr = "";
            try
            {
                ModelData = repository.GetScheduledDates(Login_Session_Id, InstitutionId);
                model.Status = "True";
                model.Message = "List of Scheduled Date Data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                model.ScheduledDaysList = ModelData;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch(Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in getting Scheduled Date";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.ScheduledDaysList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetDoctorAppointmentTimeSlot(long DoctorId,DateTime Date, int IsNew, Guid Login_Session_Id, long TimeZoneId, long Institution_Id)
        {
            IList<DoctorAppointmentTimeSlotModel> ModelData = new List<DoctorAppointmentTimeSlotModel>();
            DoctorAppointmentTimeSlotReturnModel model = new DoctorAppointmentTimeSlotReturnModel();
            string messagestr = "";
            try
            {
                ModelData = repository.GetAppointmentTimeSlots(DoctorId, Date, IsNew, Login_Session_Id, TimeZoneId, Institution_Id);
                model.DoctorAppointmentTimeSlotList = ModelData;
                model.Status = "True";
                model.Message = "List of Slots";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in getting Scheduled Date";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.DoctorAppointmentTimeSlotList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public HttpResponseMessage GetDoctorAppointmentDetails(long DoctorId, DateTime Date, Guid Login_Session_Id, long TimeZoneId, long Institution_Id)
        {
            IList<DoctorAppointmentTimeSlotModel> ModelData = new List<DoctorAppointmentTimeSlotModel>();
            DoctorAppointmentTimeSlotReturnModel model = new DoctorAppointmentTimeSlotReturnModel();
            string messagestr = "";
            try
            {
                ModelData = repository.GetDoctorAppointmentDetails(DoctorId, Date, Login_Session_Id, TimeZoneId, Institution_Id);
                model.DoctorAppointmentTimeSlotList = ModelData;
                model.Status = "True";
                model.Message = "List of Slots";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in getting Scheduled Date";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.DoctorAppointmentTimeSlotList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpPost]
        public HttpResponseMessage AddDoctorShiftInsertUpdate([FromBody] DoctorShiftModel obj, Guid Login_Session_Id)
        {

            IList<DoctorShiftModel> ModelData = new List<DoctorShiftModel>();
            DoctorAppointmentTimeSlotReturnModel model = new DoctorAppointmentTimeSlotReturnModel();


            string messagestr = "";
            try
            {
                ModelData = repository.DoctorShift_InsertUpdate(obj, Login_Session_Id);
                if (ModelData.Any(item => item.Flag == 1) == true)
                {
                    messagestr = "Doctor Shift already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 2) == true)
                {
                    messagestr = "Doctor Shift Added successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 3) == true)
                {
                    messagestr = "DoctorShift Updated Successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.Flag == 4) == true)
                {
                    messagestr = "Doctor Shift already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 5) == true)
                {
                    messagestr = "Doctor have holiday, Entry not allowed";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 6) == true)
                {
                    messagestr = "Please select another one CG";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.Flag == 7) == true)
                {
                    messagestr = "Doctor Shift Can't Added, TimeZone Missing In Subscription!";
                    model.ReturnFlag = 0;
                }
                model.DoctorShiftAddList = ModelData;
                model.Message = messagestr;// "Doctor Shift created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Add DoctorShift";
                model.DoctorShiftAddList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        [HttpGet]
        public int DoctorShift_Editable(long Id)
        {
            try
            {
                int y = repository.DoctorShift_Editable(Id);
                return y;
            }
            catch(Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

    }
}