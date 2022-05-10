using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
  
using MyCortex.User.Model;
using MyCortexDB;
using MyCortex.Utilities;

namespace MyCortex.Repositories.User
{
    public class CareGiverRepository : ICareGiverRepository
    {
         ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public CareGiverRepository()
        {
            db = new ClsDataBase();
        }

        /// <summary>     
        /// to get assigned patient list to a caregiver on CG login     
        /// </summary>
        /// <returns>assigned patient list to a caregiver</returns>
        public IList<CareGiverModel> CareGiver_AssignedPatientList(long CareGiver_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, Guid Login_Session_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@CareGiver_Id", CareGiver_Id));
            param.Add(new DataParameter("@PatientNo", PATIENTNO));
            param.Add(new DataParameter("@InsuranceNo", INSURANCEID));
            param.Add(new DataParameter("@GenderId", GENDER_ID));
            param.Add(new DataParameter("@NationalityId", NATIONALITY_ID));
            param.Add(new DataParameter("@EthnicGroupId", ETHINICGROUP_ID));
            param.Add(new DataParameter("@MobileNo", MOBILE_NO));
            param.Add(new DataParameter("@PhoneNo", HOME_PHONENO));
            param.Add(new DataParameter("@Email", EMAILID==null?null:EMAILID.ToLower()));
            param.Add(new DataParameter("@MaritalStatusId", MARITALSTATUS_ID));
            param.Add(new DataParameter("@CountryId", COUNTRY_ID));
            param.Add(new DataParameter("@StateId", STATE_ID));
            param.Add(new DataParameter("@CityId", CITY_ID));
            param.Add(new DataParameter("@BloodGroupId", BLOODGROUP_ID));
            param.Add(new DataParameter("@GroupId", Group_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataEncryption decrypt = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[CAREGIVER_ASSIGNEDPATIENTS_SP_LIST]", param);

                List<CareGiverModel> lst = (from p in dt.AsEnumerable()
                                            select new CareGiverModel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Smoker_Option = p.Field<string>("Smoker"),
                                                          Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                                          Cholestrol_Option = p.Field<string>("Cholstrol_Option"),
                                                          HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                                          MRN_NO = p.Field<string>("MRN_NO"),
                                                          PatientName = p.Field<string>("PatientName"),
                                                          Photo = p.IsNull("PHOTO_NAME") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTO_NAME")),
                                                          ViewGenderName = p.Field<string>("VIEWGENDERNAME"),                                                          	
                                                          HighCount = p.Field<int>("HighCount"),	
                                                          MediumCount = p.Field<int>("MediumCount"),	
                                                          LowCount = p.Field<int>("LowCount"),
                                                          FirstName = p.Field<string>("FirstName"),
                                                          LastName = p.Field<string>("LastName"),
                                                            Mobile = p.Field<string>("Mobile"),
                                                            Email = p.Field<string>("Email"),
                                                            Patient_No = p.Field<string>("Patient_ID"),
                                                            National_ID = p.Field<string>("National_ID"),
                                                            Insurance_ID = p.Field<string>("Insurance_ID")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<CareGiverModel> GetCount_CareGiver_AssignedPatientList(long CareGiver_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@CareGiver_Id", CareGiver_Id));
            param.Add(new DataParameter("@PatientNo", PATIENTNO));
            param.Add(new DataParameter("@InsuranceNo", INSURANCEID));
            param.Add(new DataParameter("@GenderId", GENDER_ID));
            param.Add(new DataParameter("@NationalityId", NATIONALITY_ID));
            param.Add(new DataParameter("@EthnicGroupId", ETHINICGROUP_ID));
            param.Add(new DataParameter("@MobileNo", MOBILE_NO));
            param.Add(new DataParameter("@PhoneNo", HOME_PHONENO));
            param.Add(new DataParameter("@Email", EMAILID));
            param.Add(new DataParameter("@MaritalStatusId", MARITALSTATUS_ID));
            param.Add(new DataParameter("@CountryId", COUNTRY_ID));
            param.Add(new DataParameter("@StateId", STATE_ID));
            param.Add(new DataParameter("@CityId", CITY_ID));
            param.Add(new DataParameter("@BloodGroupId", BLOODGROUP_ID));
            param.Add(new DataParameter("@GroupId", Group_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETCOUNT_CAREGIVER_ASSIGNEDPATIENTS_SP_LIST]", param);
                List<CareGiverModel> lst = (from p in dt.AsEnumerable()
                                            select new CareGiverModel()
                                            {
                                                PatientCount = p.Field<int>("PatientCount")
                                            }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to clear assign CG alert 
        /// </summary>
        /// <param name="obj">CG assigned alert Id</param>
        /// <returns></returns>
        public long CG_Update_ClearAlerts(CareGiverModel obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long retid;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Patient_Id", obj.Patient_Id));
            param.Add(new DataParameter("@CareGiver_Id", obj.CareGiver_Id));
            param.Add(new DataParameter("@CG_Remarks", obj.CG_Remarks));
            param.Add(new DataParameter("@Page_Type", obj.Page_Type));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                retid = ClsDataBase.Insert("[MYCORTEX].[CAREGIVER_SP_UPDATESTATUS]", param, true);
                return retid;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }
        /// <summary>
        /// to get CG assigned patient history list
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns>CG assigned patient history list</returns>
        public IList<CG_Patient_NotesModel> GetClearAlertHistory_View(long Patient_Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PatientId", Patient_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[CLEARALERTS_SP_HISTORYVIEW]", param);
            List<CG_Patient_NotesModel> CGP = (from p in dt.AsEnumerable()
                                               select
                                               new CG_Patient_NotesModel()
                                               {
                                                   CareGiver_Id = p.Field<long>("CAREGIVER_ID"),
                                                   CaregiverName = p.Field<string>("FULLNAME"),
                                                   Patient_Id = p.Field<long>("PATIENT_ID"),
                                                   CC_Remarks = p.Field<string>("CC_REMARKS"),
                                                   Created_Dt = p.Field<DateTime>("CREATED_DT"),
                                               }).ToList();
            return CGP;
        }
    }
}