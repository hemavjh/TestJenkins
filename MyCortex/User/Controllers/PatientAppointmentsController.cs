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
                    string Event_Code = "";
                    Event_Code = "PAT_APPOINTMENT_CANCEL";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    EmailList = AlertEventReturn.Patient_Appointment_Cancel_AlertEvent((long)Obj.Id, (long)ModelData.Institution_Id);

                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Obj.Id, (long)ModelData.Institution_Id, EmailList);
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
                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    model.ReturnFlag = 1;
                    messagestr = "Patient Appointment created Successfully";
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    model.ReturnFlag = 1;
                    messagestr = "Patient Appointment updated Successfully";
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
                    string Event_Code = "";
                    Event_Code = "PAT_APPOINTMENT_CREATION";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)ModelData[0].Id, (long)insobj.Institution_Id);

                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData[0].Id, (long)insobj.Institution_Id, EmailList);
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
        public IList<PatientAppointmentsModel> DepartmentwiseDoctorList(long DepartmentId,long InstitutionId,DateTime Date)
        {
            try
            {
                IList<PatientAppointmentsModel> model;
                model = repository.DepartmentwiseDoctorList(DepartmentId, InstitutionId);
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
        public HttpResponseMessage GetScheduledDates(long TimezoneId, Guid Login_Session_Id)
        {
            IList<ScheduledDaysListModel> ModelData = new List<ScheduledDaysListModel>();
            ScheduledDaysListReturnModel model = new ScheduledDaysListReturnModel();
            string messagestr = "";
            try
            {
                ModelData = repository.GetScheduledDates(TimezoneId, Login_Session_Id);
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
        
    }
}