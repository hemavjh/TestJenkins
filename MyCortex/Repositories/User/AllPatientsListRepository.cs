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

namespace MyCortex.Repositories.User
{
    public class AllPatientsListRepository : IAllPatientRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

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
        public IList<AllPatientListModel> PatientList(long Doctor_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, long? UserTypeId,int StartRowNumber, int EndRowNumber,string SearchQuery)
        {

            DataEncryption EncryptPassword = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber",StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@Doctor_Id", Doctor_Id));
            param.Add(new DataParameter("@PatientNo", EncryptPassword.Encrypt(PATIENTNO)));
            param.Add(new DataParameter("@InsuranceNo", EncryptPassword.Encrypt(INSURANCEID)));
            param.Add(new DataParameter("@GenderId", GENDER_ID));
            param.Add(new DataParameter("@NationalityId", NATIONALITY_ID));
            param.Add(new DataParameter("@EthnicGroupId", ETHINICGROUP_ID));
            param.Add(new DataParameter("@MobileNo", EncryptPassword.Encrypt(MOBILE_NO)));
            param.Add(new DataParameter("@PhoneNo", HOME_PHONENO));
            param.Add(new DataParameter("@Email", EncryptPassword.Encrypt(EMAILID==null?null:EMAILID.ToLower())));
            param.Add(new DataParameter("@MaritalStatusId", MARITALSTATUS_ID));
            param.Add(new DataParameter("@CountryId", COUNTRY_ID));
            param.Add(new DataParameter("@StateId", STATE_ID));
            param.Add(new DataParameter("@CityId", CITY_ID));
            param.Add(new DataParameter("@BloodGroupId", BLOODGROUP_ID));
            param.Add(new DataParameter("@GroupId", Group_Id));
            param.Add(new DataParameter("@UserTypeId", UserTypeId));
            param.Add(new DataParameter("@SearchQuery", SearchQuery));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataEncryption DecryptFields = new DataEncryption();
                DataEncryption encrypt = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_SP_LIST_BASEDONGROUPS]", param);

                List<AllPatientListModel> lst = (from p in dt.AsEnumerable()
                                                 select new AllPatientListModel()
                                                 {
                                                     TotalRecord = p.Field<string>("TotalRecords"),
                                                     Id = p.Field<long>("Id"),
                                                     Smoker_Option = p.Field<string>("Smoker"),
                                                     Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                                     Cholestrol_Option = p.Field<string>("Cholstrol_Option"),
                                                     HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                                     MRN_NO = DecryptFields.Decrypt(p.Field<string>("MRN_NO")),
                                                     PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                     Photo = p.Field<string>("PHOTO_NAME"),
                                                     PhotoBlob = p.IsNull("PHOTOBLOB") ? null : encrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
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
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataEncryption DecryptFields = new DataEncryption();
                DataEncryption encrypt = new DataEncryption();
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
    }
}