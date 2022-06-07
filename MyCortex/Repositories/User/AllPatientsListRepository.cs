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
    public class AllPatientsListRepository : IAllPatientRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public AllPatientsListRepository()
        {
            db = new ClsDataBase();
        }
        /// <summary>
        /// to get All patient details based on the logged in user for the given filter
        /// </summary>
        /// <param name="Doctor_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="UserTypeId"></param>
        /// <param name="StartRowNumber"></param>
        ///  <param name="EndRowNumber"></param>
        /// <returns>All patient details for the logged in user</returns>
        public IList<AllPatientListModel> PatientList(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId,int StartRowNumber, int EndRowNumber,string SearchQuery,string SearchEncryptedQuery)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber",StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@Doctor_Id", Doctor_Id));
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
            param.Add(new DataParameter("@UserTypeId", UserTypeId));
            param.Add(new DataParameter("@SearchQuery", SearchQuery));
            param.Add(new DataParameter("@SearchEncryptedQuery",SearchQuery));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataEncryption encrypt = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_SP_LIST_BASEDONGROUPS]", param);

                List<AllPatientListModel> lst = (from p in dt.AsEnumerable()
                                                 select new AllPatientListModel()
                                                 {
                                                     TotalRecord = p.Field<string>("TotalRecords"),
                                                     Id = p.Field<long>("Id"),
                                                     InstitutionId = p.Field<long>("INSTITUTION_ID"),
                                                     Patient_Id = p.Field<long>("Id"),
                                                     Smoker_Option = p.Field<string>("Smoker"),
                                                     Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                                     Cholestrol_Option = p.Field<string>("Cholstrol_Option"),
                                                     HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                                     MRN_NO = p.Field<string>("MRN_NO"),
                                                     PatientName = p.Field<string>("PatientName"),
                                                     EmailId = p.Field<string>("EmailId"),
                                                     FirstName = p.Field<string>("FirstName"),
                                                     MiddleName = p.Field<string>("MiddleName"),
                                                     LastName = p.Field<string>("LastName"),
                                                     UserTypeId = p.Field<long>("USERTYPE_ID"),
                                                     GenderId = p.Field<long>("GENDER_ID"),
                                                     GenderName = p.Field<string>("GENDER_NAME"),
                                                     Mobileno = p.Field<string>("MOBILE_NO"),
                                                     PatientType = p.Field<int>("PATIENT_TYPE"),
                                                     Photo = p.Field<string>("PHOTO_NAME"),
                                                     PhotoBlob = p.IsNull("PHOTOBLOB") ? null : encrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                     ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                                                    
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public IList<AllPatientListModel> SearchPatientList(long Doctor_Id, string PATIENTNO, string INSURANCEID, string NATIONALITY_ID, string MOBILE_NO, string EMAILID, string FIRSTNAME, string LASTNAME, string MRN, long? UserTypeId, int StartRowNumber, int EndRowNumber, int? AdvanceFilter)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@Doctor_Id", Doctor_Id));
            param.Add(new DataParameter("@PatientNo", PATIENTNO == null ? "" : PATIENTNO));
            param.Add(new DataParameter("@InsuranceNo", INSURANCEID == null ? "" : INSURANCEID));
            param.Add(new DataParameter("@FIRSTNAME", FIRSTNAME == null ? "" : FIRSTNAME));
            param.Add(new DataParameter("@NationalityId", NATIONALITY_ID == null ? "" : NATIONALITY_ID));
            param.Add(new DataParameter("@LASTNAME", LASTNAME == null ? "" : LASTNAME));
            param.Add(new DataParameter("@MobileNo", MOBILE_NO == null ? "" : MOBILE_NO));
            param.Add(new DataParameter("@MRN", MRN == null ? "" : MRN));
            param.Add(new DataParameter("@Email", EMAILID == null ? "" : EMAILID.ToLower()));
            param.Add(new DataParameter("@UserTypeId", UserTypeId));
            param.Add(new DataParameter("@AdvanceFilter", AdvanceFilter));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataEncryption encrypt = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[CG_SEARCH_PATIENT_LIST]", param);

                List<AllPatientListModel> lst = (from p in dt.AsEnumerable()
                                                 select new AllPatientListModel()
                                                 {
                                                     //TotalRecord = p.Field<string>("TotalRecords"),
                                                     Id = p.Field<long>("Id"),
                                                     Smoker_Option = p.Field<string>("Smoker"),
                                                     Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                                     Cholestrol_Option = p.Field<string>("Cholstrol_Option"),
                                                     HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                                     MRN_NO = p.Field<string>("MRN_NO"),
                                                     PatientName = p.Field<string>("PatientName"),
                                                     Photo = p.Field<string>("PHOTO_NAME"),
                                                     PhotoBlob = p.IsNull("PHOTOBLOB") ? null : encrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                     ViewGenderName = p.Field<string>("VIEWGENDERNAME"),

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
        /// to get All patient count based on the logged in user for the given filter
        /// </summary>
        /// <param name="Doctor_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<AllPatientListModel> GetPatientList_Count(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Doctor_Id", Doctor_Id));
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
            param.Add(new DataParameter("@UserTypeId", UserTypeId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETCOUNT_PATIENT_SP_LIST_BASEDONGROUPS]", param);
                List<AllPatientListModel> lst = (from p in dt.AsEnumerable()
                                                 select new AllPatientListModel()
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
    }
}