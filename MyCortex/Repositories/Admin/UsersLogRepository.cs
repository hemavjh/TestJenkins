using MyCortex.Admin.Controllers;
using MyCortex.Admin.Models;
using MyCortexDB;
  
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using MyCortex.Utilities;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Admin
{
    public class UsersLogRepository : IUsersLogRepository    
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public UsersLogRepository()
        {
            db = new ClsDataBase();
        }

        public IList<AdminUsersLogModel> Admin_Userslog_List(long? Institution_Id, Guid login_session_id,long? User_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            
            param.Add(new DataParameter("@InstitutionId", Institution_Id));
            param.Add(new DataParameter("@UserId", User_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERS_LOG_LIST",param);
            List<AdminUsersLogModel> list = (from p in dt.AsEnumerable()
                                             select new AdminUsersLogModel()
                                             {
                                                 ID = p.Field<long?>("ID"),
                                                 FULLNAME = p.Field<string>("FULLNAME"),
                                                 INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID"),
                                                 LOGINTIME = p.Field<DateTime?>("LOGINTIME"),
                                                 LOGOUTTIME = p.Field<DateTime?>("LOGOUTTIME"),
                                                 COUNTRYCODE = p.Field<string>("COUNTRYCODE"),
                                                 LONGITUDE = p.Field<string>("LONGITUDE"),
                                                 LATITUDE = p.Field<string>("LATITUDE"),
                                                 REGIONNAME = p.Field<string>("REGIONNAME"),
                                                 ZIPCODE = p.Field<string>("ZIPCODE"),
                                                 USERNAME = p.Field<string>("USERNAME"),
                                                 STATUS = p.Field<string>("STATUS"),
                                                 FAILURE_REASON = p.Field<string>("FAILURE_REASON"),
                                                 LOGIN_COUNTRY = p.Field<string>("LOGIN_COUNTRY"),
                                                 LOGIN_CITY = p.Field<string>("LOGIN_CITY")
                                             }).ToList();
            return list;
        }
        public IList<All_UserList> GetAll_UserLists(long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_ALL_USERLIST]", param);
                List<All_UserList> lst = (from p in dt.AsEnumerable()
                                            select new All_UserList()
                                            {
                                                Id = p.Field<long>("ID"),
                                                FirstName = p.Field<string>("FIRSTNAME"),
                                                FullName = p.Field<string>("FULLNAME"),
                                                DepartmentId = p.Field<long>("DEPARTMENT_ID"),
                                                EmailId = p.Field<string>("EMAILID"),
                                                UserTypeId = p.Field<long>("USERTYPE_ID"),
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        public IList<EligibilityLogsModel>Eligibility_Logs_List(long? Institution_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_USER_APPOINTMENT_ELIGIBILITY_LOG]", param);
            List<EligibilityLogsModel> list = (from p in dt.AsEnumerable()
                select new EligibilityLogsModel()
                {
                    Appointment_ID = p.Field<long?>("APPOINTMENT_ID"),
                    Patient_ID = p.Field<long?>("PATIENT_ID"),
                    Patient_Name = p.Field<string>("PATIENTNAME"),
                    Eligibility_ID = p.Field<string>("ELIGIBILITY_ID"),
                    Clinician_ID = p.Field<long?>("CLINICIAN_ID"),
                    Clinician_License = p.Field<string>("CLINICIAN_LICENSE"),
                    Clinician_Name = p.Field<string>("CLINICIAN_NAME"),
                    Clinician_Speciality = p.Field<string>("CLINICIAN_SPECIALITY"),
                    Eligibility_Answer_ID = p.Field<string>("ELIGIBILITY_ANSWER_ID"),
                    ID_Payer = p.Field<string>("ID_PAYER"),
                    Patient_First_Name = p.Field<string>("PATIENT_FIRST_NAME"),
                    Patient_Last_Name = p.Field<string>("PATIENT_LAST_NAME"),
                    Patient_DOB = p.Field<string>("PATIENT_DOB"),
                    Eligibility_Response_Date = p.Field<string>("ELIGIBILITY_RESPONSE_DATE"),
                    Member_ID = p.Field<string>("MEMBER_ID"),
                    VIP = p.Field<string>("VIP"),
                    Package_Category = p.Field<string>("PACKAGE_CATEGORY"),
                    Package_Name = p.Field<string>("PACKAGE_NAME"),
                    Network_Name = p.Field<string>("NETWORK_NAME"),
                    Policy_Name = p.Field<string>("POLICY_NAME"),
                    Policy_State_Date = p.Field<string>("POLICY_STATE_DATE"),
                    Policy_Expiry_Date = p.Field<string>("POLICY_EXPIRY_DATE"),
                    Policy_ID = p.Field<long?>("POLICY_ID"),
                    Dental = p.Field<string>("DENTAL"),
                    Network_Notes = p.Field<string>("NETWORK_NOTES"),
                    Limit = p.Field<string>("LIMIT"),
                    Optical = p.Field<string>("OPTICAL"),
                    Outpatient_Deductible = p.Field<string>("OUTPATIENT_DEDUCTIBLE"),
                    OOP_Limit = p.Field<string>("OOP_LIMIT"),
                    Denial_Reason = p.Field<string>("DENIAL_REASON"),
                    Eligibility_Request_Date = p.Field<string>("ELIGIBILITY_REQUEST_DATE"),
                    Eligibility_Status = p.Field<int>("ELIGIBILITY_STATUS"),
                    Payer_ID = p.Field<long?>("PAYER_ID"),
                    Payer_Name = p.Field<string>("PAYER_NAME"),
                    Requested_By = p.Field<long?>("REQUESTED_BY"),
                    Eligibility_Request = p.Field<string>("ELIGIBILITY_REQUEST"),
                    Eligibility_Response = p.Field<string>("ELIGIBILITY_RESPONSE"),
                    INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID")

                }).ToList();
            return list;
        }

        public IList<EligibilityLogsModel> Eligibility_Logs_List_With_Patient(long? Institution_Id, long? Patient_id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@PATIENT_ID", Patient_id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_USER_APPOINTMENT_ELIGIBILITY_LOG]", param);
            List<EligibilityLogsModel> list = (from p in dt.AsEnumerable()
                                               select new EligibilityLogsModel()
                                               {
                                                   Appointment_ID = p.Field<long?>("APPOINTMENT_ID"),
                                                   Patient_ID = p.Field<long?>("PATIENT_ID"),
                                                   Patient_Name = p.Field<string>("PATIENTNAME"),
                                                   Eligibility_ID = p.Field<string>("ELIGIBILITY_ID"),
                                                   Clinician_ID = p.Field<long?>("CLINICIAN_ID"),
                                                   Clinician_License = p.Field<string>("CLINICIAN_LICENSE"),
                                                   Clinician_Name = p.Field<string>("CLINICIAN_NAME"),
                                                   Clinician_Speciality = p.Field<string>("CLINICIAN_SPECIALITY"),
                                                   Eligibility_Answer_ID = p.Field<string>("ELIGIBILITY_ANSWER_ID"),
                                                   ID_Payer = p.Field<string>("ID_PAYER"),
                                                   Patient_First_Name = p.Field<string>("PATIENT_FIRST_NAME"),
                                                   Patient_Last_Name = p.Field<string>("PATIENT_LAST_NAME"),
                                                   Patient_DOB = p.Field<string>("PATIENT_DOB"),
                                                   Eligibility_Response_Date = p.Field<string>("ELIGIBILITY_RESPONSE_DATE"),
                                                   Member_ID = p.Field<string>("MEMBER_ID"),
                                                   VIP = p.Field<string>("VIP"),
                                                   Package_Category = p.Field<string>("PACKAGE_CATEGORY"),
                                                   Package_Name = p.Field<string>("PACKAGE_NAME"),
                                                   Network_Name = p.Field<string>("NETWORK_NAME"),
                                                   Policy_Name = p.Field<string>("POLICY_NAME"),
                                                   Policy_State_Date = p.Field<string>("POLICY_STATE_DATE"),
                                                   Policy_Expiry_Date = p.Field<string>("POLICY_EXPIRY_DATE"),
                                                   Policy_ID = p.Field<long?>("POLICY_ID"),
                                                   Dental = p.Field<string>("DENTAL"),
                                                   Network_Notes = p.Field<string>("NETWORK_NOTES"),
                                                   Limit = p.Field<string>("LIMIT"),
                                                   Optical = p.Field<string>("OPTICAL"),
                                                   Outpatient_Deductible = p.Field<string>("OUTPATIENT_DEDUCTIBLE"),
                                                   OOP_Limit = p.Field<string>("OOP_LIMIT"),
                                                   Denial_Reason = p.Field<string>("DENIAL_REASON"),
                                                   Eligibility_Request_Date = p.Field<string>("ELIGIBILITY_REQUEST_DATE"),
                                                   Eligibility_Status = p.Field<int>("ELIGIBILITY_STATUS"),
                                                   Payer_ID = p.Field<long?>("PAYER_ID"),
                                                   Payer_Name = p.Field<string>("PAYER_NAME"),
                                                   Requested_By = p.Field<long?>("REQUESTED_BY"),
                                                   Eligibility_Request = p.Field<string>("ELIGIBILITY_REQUEST"),
                                                   Eligibility_Response = p.Field<string>("ELIGIBILITY_RESPONSE"),
                                                   INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID")

                                               }).ToList();
            return list;
        }

        public IList<EligibilityLogsModel> Eligibility_Logs_With_Patient_Filters(long? Institution_Id, long? Patient_id, DateTime sDate, DateTime eDate, int EligibilityStatus, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            param.Add(new DataParameter("@PATIENT_ID", Patient_id));
            param.Add(new DataParameter("@DATE", sDate));
            param.Add(new DataParameter("@ENDDATE", eDate));
            param.Add(new DataParameter("@ELIGIBILITY_STATUS_ID", EligibilityStatus));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_USER_APPOINTMENT_ELIGIBILITY_LOG]", param);
            List<EligibilityLogsModel> list = (from p in dt.AsEnumerable()
                                               select new EligibilityLogsModel()
                                               {
                                                   Appointment_ID = p.Field<long?>("APPOINTMENT_ID"),
                                                   Patient_ID = p.Field<long?>("PATIENT_ID"),
                                                   Patient_Name = p.Field<string>("PATIENTNAME"),
                                                   Eligibility_ID = p.Field<string>("ELIGIBILITY_ID"),
                                                   Clinician_ID = p.Field<long?>("CLINICIAN_ID"),
                                                   Clinician_License = p.Field<string>("CLINICIAN_LICENSE"),
                                                   Clinician_Name = p.Field<string>("CLINICIAN_NAME"),
                                                   Clinician_Speciality = p.Field<string>("CLINICIAN_SPECIALITY"),
                                                   Eligibility_Answer_ID = p.Field<string>("ELIGIBILITY_ANSWER_ID"),
                                                   ID_Payer = p.Field<string>("ID_PAYER"),
                                                   Patient_First_Name = p.Field<string>("PATIENT_FIRST_NAME"),
                                                   Patient_Last_Name = p.Field<string>("PATIENT_LAST_NAME"),
                                                   Patient_DOB = p.Field<string>("PATIENT_DOB"),
                                                   Eligibility_Response_Date = p.Field<string>("ELIGIBILITY_RESPONSE_DATE"),
                                                   Member_ID = p.Field<string>("MEMBER_ID"),
                                                   VIP = p.Field<string>("VIP"),
                                                   Package_Category = p.Field<string>("PACKAGE_CATEGORY"),
                                                   Package_Name = p.Field<string>("PACKAGE_NAME"),
                                                   Network_Name = p.Field<string>("NETWORK_NAME"),
                                                   Policy_Name = p.Field<string>("POLICY_NAME"),
                                                   Policy_State_Date = p.Field<string>("POLICY_STATE_DATE"),
                                                   Policy_Expiry_Date = p.Field<string>("POLICY_EXPIRY_DATE"),
                                                   Policy_ID = p.Field<long?>("POLICY_ID"),
                                                   Dental = p.Field<string>("DENTAL"),
                                                   Network_Notes = p.Field<string>("NETWORK_NOTES"),
                                                   Limit = p.Field<string>("LIMIT"),
                                                   Optical = p.Field<string>("OPTICAL"),
                                                   Outpatient_Deductible = p.Field<string>("OUTPATIENT_DEDUCTIBLE"),
                                                   OOP_Limit = p.Field<string>("OOP_LIMIT"),
                                                   Denial_Reason = p.Field<string>("DENIAL_REASON"),
                                                   Eligibility_Request_Date = p.Field<string>("ELIGIBILITY_REQUEST_DATE"),
                                                   Eligibility_Status = p.Field<int>("ELIGIBILITY_STATUS"),
                                                   Payer_ID = p.Field<long?>("PAYER_ID"),
                                                   Payer_Name = p.Field<string>("PAYER_NAME"),
                                                   Requested_By = p.Field<long?>("REQUESTED_BY"),
                                                   Eligibility_Request = p.Field<string>("ELIGIBILITY_REQUEST"),
                                                   Eligibility_Response = p.Field<string>("ELIGIBILITY_RESPONSE"),
                                                   INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID")

                                               }).ToList();
            return list;
        }

        public IList<PatientModel> Get_Patient_List(long InstitutionId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_PATIENT_LIST]", param);
                List<PatientModel> lst = (from p in dt.AsEnumerable()
                                          select new PatientModel()
                                          {
                                              Id = p.Field<long>("ID"),
                                              FirstName = p.Field<string>("FIRSTNAME"),
                                              MiddleName = p.Field<string>("MIDDLENAME"),
                                              LastName = p.Field<string>("LASTNAME"),
                                              FullName = p.Field<string>("FULLNAME"),
                                          }).ToList();
                return lst;
            }
            catch (Exception ex)
            {

                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
    }
}