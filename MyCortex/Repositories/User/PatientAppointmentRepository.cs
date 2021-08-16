using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using log4net;
using MyCortex.User.Model;
using MyCortexDB;
using MyCortex.Utilities;

namespace MyCortex.Repositories.Uesr
{
    public class PatientAppointmentRepository : IPatientAppointmentsRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public PatientAppointmentRepository()
        {
            db = new ClsDataBase();
        }

        /// <summary>
        /// Doctor's Patient Appointment list for a date
        /// </summary>
        /// <param name="Doctor_Id"></param>
        /// <param name="flag"></param>
        /// <param name="ViewDate"></param>
        /// <returns>Patient Appointment list for a date and doctor</returns>
        public IList<PatientAppointmentsModel> DoctorAppointmentList(long Doctor_Id, int flag, DateTime? ViewDate, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Doctor_Id", Doctor_Id));
            param.Add(new DataParameter("@flag", flag));
            param.Add(new DataParameter("@ViewDate", ViewDate));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataEncryption DecryptFields = new DataEncryption();
                DataEncryption decrypt = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTAPPOINTMENTS_SP_LIST_BASEDON_DATE]", param);
                List<PatientAppointmentsModel> lst = (from p in dt.AsEnumerable()
                                                      select new PatientAppointmentsModel()
                                                      {
                                                          Patient_Id = p.Field<long>("PATIENT_ID"),
                                                          Appointment_FromTime = p.Field<DateTime>("APPOINTMENT_FROMTIME"),
                                                          Appointment_ToTime = p.Field<DateTime>("APPOINTMENT_TOTIME"),
                                                          PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                          Id = p.Field<long>("Id"),
                                                          ReasonForVisit = p.Field<string>("REASONFOR_VISIT"),
                                                          MRN_No = DecryptFields.Decrypt(p.Field<string>("MRN_NO")),
                                                          Photo = p.Field<string>("PHOTO_NAME"),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          Smoker = p.Field<string>("Smoker"),
                                                      }).ToList();
                return lst;
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
        public PatientAppointmentsModel Update_CancelledAppointment(Guid Login_Session_Id,PatientAppointmentsModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@UserId", obj.CancelledBy_Id));
            param.Add(new DataParameter("@Cancel_Remarks", obj.Cancelled_Remarks));
            param.Add(new DataParameter("@ReasonTypeId", obj.ReasonTypeId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataEncryption DecryptFields = new DataEncryption();
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTAPPOINTMENT_SP_UPDATE_CANCELLEDAPPOINTMENT]", param);
            PatientAppointmentsModel insert = (from p in dt.AsEnumerable()
                                               select
                                               new PatientAppointmentsModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   flag = p.Field<int>("flag"),
                                                   Patient_Id = p.Field<long>("PATIENT_ID"),
                                                   Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                   DoctorName = DecryptFields.Decrypt(p.Field<string>("DoctorName")),
                                                   PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                   Status = p.Field<int>("Status"),
                                                   Cancelled_By = DecryptFields.Decrypt(p.Field<string>("Cancelled_Name")),
                                                   Cancelled_Remarks = p.Field<string>("CANCEL_REMARKS"),
                                                   Cancelled_Date = p.Field<DateTime>("CANCELED_DATE"),
                                                   Institution_Id= p.Field<long>("INSTITUTION_ID"),                                                   
                                               }).FirstOrDefault();
            return insert;
        }
        /// <summary>
        /// to insert a new patient appointment
        /// </summary>
        /// <param name="insobj"></param>
        /// <returns>inserted patient appointment</returns>
        public IList<PatientAppointmentsModel> PatientAppointment_InsertUpdate(Guid Login_Session_Id, PatientAppointmentsModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            //param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@DOCTOR_ID", obj.Doctor_Id));
            param.Add(new DataParameter("@PATIENT_ID", obj.Patient_Id));
            param.Add(new DataParameter("@APPOINTMENTDATE", obj.Appointment_Date));
            param.Add(new DataParameter("@APPOINTMENT_FROMTIME", obj.AppointmentFromTime));
            param.Add(new DataParameter("@APPOINTMENT_TOTIME", obj.AppointmentToTime));
            param.Add(new DataParameter("@APPOINTMENTTYPE_ID", obj.Appointment_Type));
            param.Add(new DataParameter("@REASONFOR_VISIT", obj.ReasonForVisit));
           // param.Add(new DataParameter("@REASONTYPE_ID", obj.ReasonTypeId));
            //param.Add(new DataParameter("@REMARKS", obj.Remarks));
            param.Add(new DataParameter("@STATUS", obj.Status));
            //param.Add(new DataParameter("@CANCELED_DATE", obj.Canceled_Date));
            //param.Add(new DataParameter("@CANCEL_REMARKS", obj.Cancel_Remarks));
            param.Add(new DataParameter("@CREATED_BY", obj.Created_By));
            // param.Add(new DataParameter("@CREATED_DATE", obj.Created_Date));
            param.Add(new DataParameter("@Page_Type", obj.Page_Type));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTAPPOINTMENT_SP_INSERTUPDATE", param);

            IList<PatientAppointmentsModel> INS = (from p in dt.AsEnumerable()
                                                   select
                                                   new PatientAppointmentsModel()
                                                   {
                                                       Id = p.Field<long>("Id"),
                                                       //Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                       Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                       Patient_Id = p.Field<long>("PATIENT_ID"),
                                                       Appointment_Date = p.Field<DateTime>("APPOINTMENT_DATE"),
                                                       Appointment_FromTime = p.Field<DateTime>("APPOINTMENT_FROMTIME"),
                                                       Appointment_ToTime = p.Field<DateTime>("APPOINTMENT_TOTIME"),
                                                       AppointmentFromTime = GetTimeSpan(p.Field<DateTime>("APPOINTMENT_FROMTIME").ToString()),
                                                       AppointmentToTime = GetTimeSpan(p.Field<DateTime>("APPOINTMENT_TOTIME").ToString()),

                                                       Appointment_Type = p.Field<long>("APPOINTMENT_TYPE"),
                                                       ReasonForVisit = p.Field<string>("REASONFOR_VISIT"),
                                                       Remarks = p.Field<string>("REMARKS"),
                                                       Status = p.Field<int>("STATUS"),
                                                       //Canceled_Date = p.Field<DateTime>("CANCELED_DATE"),
                                                       //Cancel_Remarks = p.Field<string>("CANCEL_REMARKS"),
                                                       Created_By = p.Field<int>("CREATED_BY"),
                                                    //   ReasonTypeId = p.Field<long>("REASONTYPE_ID"),    
                                                       //   Created_Date = p.Field<DateTime>("CREATED_DATE"),
                                                       flag = p.Field<int>("flag")

                                                   }).ToList();
            return INS;


        }
        
        public IList<PatientAppointmentsModel> AppointmentReSchedule_InsertUpdate(Guid Login_Session_Id, PatientAppointmentsModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@UserId", obj.CancelledBy_Id));
            param.Add(new DataParameter("@Cancel_Remarks", obj.Cancelled_Remarks));
            param.Add(new DataParameter("@ReasonTypeId", obj.ReasonTypeId));
            //param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
            param.Add(new DataParameter("@DOCTOR_ID", obj.Doctor_Id));
            param.Add(new DataParameter("@PATIENT_ID", obj.Patient_Id));
            param.Add(new DataParameter("@APPOINTMENTDATE", obj.Appointment_Date));
            param.Add(new DataParameter("@APPOINTMENT_FROMTIME", obj.AppointmentFromTime));
            param.Add(new DataParameter("@APPOINTMENT_TOTIME", obj.AppointmentToTime));
            param.Add(new DataParameter("@APPOINTMENTTYPE_ID", obj.Appointment_Type));
            param.Add(new DataParameter("@REASONFOR_VISIT", obj.ReasonForVisit));
            // param.Add(new DataParameter("@REASONTYPE_ID", obj.ReasonTypeId));
            //param.Add(new DataParameter("@REMARKS", obj.Remarks));
            param.Add(new DataParameter("@STATUS", obj.Status));
            //param.Add(new DataParameter("@CANCELED_DATE", obj.Canceled_Date));
            //param.Add(new DataParameter("@CANCEL_REMARKS", obj.Cancel_Remarks));
            // param.Add(new DataParameter("@CREATED_DATE", obj.Created_Date));
            param.Add(new DataParameter("@Page_Type", obj.Page_Type));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataEncryption DecryptFields = new DataEncryption();
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTAPPOINTMENT_SP_UPDATE_RESCHEDULEAPPOINTMENT", param);

            IList<PatientAppointmentsModel> INS = (from p in dt.AsEnumerable()
                                                   select
                                                   new PatientAppointmentsModel()
                                                   {
                                                       Id = p.Field<long>("Id"),
                                                       flag = p.Field<int>("flag"),
                                                       Patient_Id = p.Field<long>("PATIENT_ID"),
                                                       Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                       DoctorName = DecryptFields.Decrypt(p.Field<string>("DoctorName")),
                                                       PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                       Status = p.Field<int>("Status"),
                                                       Cancelled_By = DecryptFields.Decrypt(p.Field<string>("Cancelled_Name")),
                                                       Cancelled_Remarks = p.Field<string>("CANCEL_REMARKS"),
                                                       Cancelled_Date = p.Field<DateTime>("CANCELED_DATE"),
                                                       Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                       NewAppointmentId = p.Field<long>("NewAppointmentId")
                                                   }).ToList();
            return INS;


        }
        private TimeSpan GetTimeSpan(string timeString)
        {
            //var takeTimePart = timeString.Split(new char[] { ' ' });
            //var timeValues = takeTimePart[1].Split(new char[] { ':' });
            ////Assuming that timeValues array will have 3 elements.
            //var timeSpan = new TimeSpan(Convert.ToInt32(timeValues[0]), Convert.ToInt32(timeValues[1]), Convert.ToInt32(timeValues[2]));
            return Convert.ToDateTime(timeString).TimeOfDay;
        }
        /// <summary>
        /// Doctor name list based on selected patient's group
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        public IList<PatientAppointmentsModel> PatientBasedGroupBasedClinicianList(long Patient_Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", Patient_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTGROUPBASEDCLINICIAN_SP_LIST]", param);
                List<PatientAppointmentsModel> lst = (from p in dt.AsEnumerable()
                                                      select new PatientAppointmentsModel()
                                                      {
                                                          Doctor_Id = p.Field<long>("ID"),
                                                          DoctorName = decrypt.Decrypt(p.Field<string>("FULLNAME")),
                                                          Doctor_DepartmentName = p.Field<string>("DEPARTMENT_NAME"),
                                                          // Name_Specialization = p.Field<string>("NAMESPECIALIZATION"),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                                                      }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<PatientAppointmentsModel> DepartmentwiseDoctorList(string DepartmentIds,long InstitutionId, DateTime Date)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@DepartmentIds", DepartmentIds));
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DEPARTMENTWISEDOCTOR_SP_LIST]", param);
                List<PatientAppointmentsModel> lst = (from p in dt.AsEnumerable()
                                                      select new PatientAppointmentsModel()
                                                      {
                                                          Doctor_Id = p.Field<long>("ID"),
                                                          DoctorName = decrypt.Decrypt(p.Field<string>("FULLNAME")),
                                                          Doctor_DepartmentName = p.Field<string>("DEPARTMENT_NAME"),
                                                          // Name_Specialization = p.Field<string>("NAMESPECIALIZATION"),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                                                      }).ToList();
                return lst;
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
        public IList<AppointmentReasonType> AppointmentReasonType_List(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[APPOINTMENTREASONTYPE_SP_LIST]", param);
                List<AppointmentReasonType> lst = (from p in dt.AsEnumerable()
                                                      select new AppointmentReasonType()
                                                      {
                                                          ReasonTypeId = p.Field<long>("ID"),                                                         
                                                          ReasonType = p.Field<string>("REASONTYPE"),
                                                          IsActive = p.Field<int>("ISACTIVE"), 
                                                      }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<ScheduledDaysListModel> GetScheduledDates(long TimezoneId, Guid Login_Session_Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@TIMEZONEID", TimezoneId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETMAXSCHEDULE_SP_LIST]", param);
                List<ScheduledDaysListModel> lst = (from p in dt.AsEnumerable()
                                                    select new ScheduledDaysListModel()
                                                    {
                                                        Date = p.Field<DateTime>("Date"),
                                                        Day = p.Field<int>("DAY"),
                                                        Month = p.Field<string>("MONTH"),
                                                        // Name_Specialization = p.Field<string>("NAMESPECIALIZATION"),
                                                        WeekDay = p.Field<string>("Dayname"),
                                                    }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        public IList<DoctorAppointmentTimeSlotModel> GetAppointmentTimeSlots(long DoctorId, long TimezoneId,DateTime Date, int IsNew, Guid Login_Session_Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@DOCTORID", DoctorId));
            param.Add(new DataParameter("@TIMEZONEID", TimezoneId));
            param.Add(new DataParameter("@DATE", Date));
            param.Add(new DataParameter("@ISNEW", IsNew));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETDOCTORTIMESLOT_SP_LIST]", param);
                List<DoctorAppointmentTimeSlotModel> lst = (from p in dt.AsEnumerable()
                                                            select new DoctorAppointmentTimeSlotModel()
                                                            {
                                                                AppointmentFromDateTime = p.Field<DateTime>("APPOINTMENTFROMDATETIME"),
                                                                AppointmentToDateTime = p.Field<DateTime>("APPOINTMENTTODATETIME"),
                                                                FromTime = p.Field<string>("FromTime"),
                                                                ToTime = p.Field<string>("ToTime"),
                                                                AppointmentTime = p.Field<string>("APPOINTMENTTIME"),
                                                                IsBooked = p.Field<bool>("ISBOOKED"),
                                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        public IList<DoctorShiftModel> DoctorShift_InsertUpdate(DoctorShiftModel obj, Guid Login_Session_Id)
        {
            long InsertId = 0;
            int Flag = 0;
            long Duplicate_Doctor = 0;
            DataTable Dt3 = new DataTable();
            var x1 = (from doc in obj.Doctor_Id where doc.IsActive == 1 select doc.DoctorId).ToArray();
            string doc1 = String.Join(",", x1);
            doc1 = "," + doc1 + ",";

            if(obj.ID== 0)
            {
                List<DataParameter> param3 = new List<DataParameter>();
                param3.Add(new DataParameter("@DOCTOR_IDS ", doc1));
                param3.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
                DataTable dt3 = ClsDataBase.GetDataTable("[MYCORTEX].[TBLDOCTORSHIFT_Duplicate_Check]", param3);
                DataRow dr3 = dt3.Rows[0];
                Duplicate_Doctor = long.Parse((dr3["DuplicateCount"].ToString()));
            }
            else
            {
                Duplicate_Doctor = 0;
            }
            

            if(Duplicate_Doctor == 0)
            {
                foreach (DoctorsId item in obj.Doctor_Id)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", obj.ID));
                    param.Add(new DataParameter("@INSTITUTION_ID", obj.Institution_Id));
                    param.Add(new DataParameter("@DOCTOR_ID", item.DoctorId));
                    param.Add(new DataParameter("@FROMDATE", obj.FromDate));
                    param.Add(new DataParameter("@TODATE", obj.ToDate));
                    param.Add(new DataParameter("@NEWAPPOINTMENT", obj.NewAppointment));
                    param.Add(new DataParameter("@FOLLOWUP", obj.FollowUp));
                    param.Add(new DataParameter("@INTERVAL", obj.Intervel));
                    param.Add(new DataParameter("@CUSTOMSLOT", obj.CustomSlot));
                    param.Add(new DataParameter("@BOOKINGOPEN", obj.BookingOpen));
                    param.Add(new DataParameter("@BOOKINGCANCELLOCK", obj.BookingCancelLock));
                    param.Add(new DataParameter("@CREATED_BY", obj.CreatedBy));
                    param.Add(new DataParameter("@MODIFIED_BY", obj.CreatedBy));
                    //param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
                    try
                    {
                        Dt3 = ClsDataBase.GetDataTable("[MYCORTEX].[TBLNEWDOCTORSHIFT_SP_INSERTUPDATE]", param);
                        DataRow dr = Dt3.Rows[0];
                        if (dr.IsNull("Id") == true)
                        {
                            InsertId = 0;
                        }
                        else
                        {
                            InsertId = long.Parse((dr["Id"].ToString()));
                            Flag = int.Parse((dr["flag"].ToString()));
                        }
                        if (InsertId > 0)
                        {
                            foreach (CcCg item3 in obj.CC_CG)
                            {
                                List<DataParameter> param2 = new List<DataParameter>();
                                param2.Add(new DataParameter("@Id", item3.Id));
                                param2.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                param2.Add(new DataParameter("@CC_CG", item3.CcCg_Id));
                                param2.Add(new DataParameter("@ISACTIVE", item3.IsActive));
                                param2.Add(new DataParameter("@CREATED_BY", obj.CreatedBy));
                                param2.Add(new DataParameter("@SESSION_ID", Login_Session_Id));

                                DataTable dt_1 = ClsDataBase.GetDataTable("[MYCORTEX].[DoctorShift_CcCg_INSERTUPDATE]", param2);
                                DataRow dr_1 = dt_1.Rows[0];
                            }
                        }
                        if (InsertId > 0 && (Flag == 2 || Flag == 3))
                        {
                            foreach (SelectedDaysList item1 in obj.SelectedDaysList)
                            {
                                foreach (SlotsList item2 in item1.TimeSlot)
                                {
                                    List<DataParameter> param1 = new List<DataParameter>();
                                    param1.Add(new DataParameter("@Id", item1.Id));
                                    param1.Add(new DataParameter("@DOCTORSHIFT_ID", InsertId));
                                    param1.Add(new DataParameter("@SHIFT_DATE", item1.Day));
                                    param1.Add(new DataParameter("@SHIFT_STARTTIME", item2.TimeSlotFromTime.TimeOfDay.ToString()));
                                    param1.Add(new DataParameter("@SHIFT_ENDTIME", item2.TimeSlotToTime.TimeOfDay.ToString()));
                                    param1.Add(new DataParameter("@SHIFT", item2.Shift));
                                    param1.Add(new DataParameter("@ISACTIVE", item.IsActive));
                                    param1.Add(new DataParameter("@CREATED_BY", obj.CreatedBy));
                                    param1.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                                    _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
                                    try
                                    {
                                        DataTable dt1 = ClsDataBase.GetDataTable("[MYCORTEX].[DoctorShift_TimeSlot_INSERTUPDATE]", param1);
                                        DataRow dr1 = dt1.Rows[0];
                                    }
                                    catch (Exception ex)
                                    {
                                        _logger.Error(ex.Message, ex);
                                        return null;

                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.Error(ex.Message, ex);
                        return null;

                    }
                }
                IList<DoctorShiftModel> INS = (from p in Dt3.AsEnumerable()
                                               select
                                               new DoctorShiftModel()
                                               {
                                                   ID = p.Field<long>("Id"),
                                                   Flag = p.Field<int>("flag"),
                                               }).ToList();
                return INS;
            }
            else
            {
                Flag = 4;
                IList<DoctorShiftModel> INS1 = new List<DoctorShiftModel>();
                DoctorShiftModel d = new DoctorShiftModel();
                d.Flag = 4;
                INS1.Add(d);
                return INS1;
            }
            
        }
    }
}