using MyCortex.User.Controllers;
using MyCortex.User.Model;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
  
using System.Data;
using System.Web.Script.Serialization;
using MyCortex.Utilities;

namespace MyCortex.Repositories.User
{
    public class PatientApprovalRepository : IPatientApprovalRepository
    {
        ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public PatientApprovalRepository()
        {

            db = new ClsDataBase();
        }
        /// <summary>
        /// to get list of patients pending for approval based on given filter
        /// </summary>
        /// <param name="InstitutionId"></param>
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
        /// <returns>list of patients pending for approval based on given filter</returns>
        public IList<PatientApprovalModel> PatientApproval_List(long? InstitutionId, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
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
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTAPPROVAL_SP_LIST]", param);
                List<PatientApprovalModel> lst = (from p in dt.AsEnumerable()
                                                  select new PatientApprovalModel()
                                                  {
                                                      Id = p.Field<long>("ID"),
                                                      FullName = p.Field<string>("FULLNAME"),
                                                      Mobile_No = p.Field<string>("MOBILE_NO"),
                                                      MRN_NO = p.Field<string>("MRN_NO"),
                                                      PendingSince = p.Field<string>("PENDINGSINCE"),
                                                      Remarks = p.Field<string>("Remarks"),
                                                      Approval_Flag = p.Field<int>("Approval_Flag"),
                                                      EmailId = p.Field<string>("EMAILID")
                                                  }).ToList();
                return lst;
            }

            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }

        }

        public PatientApprovalReturnModel PatientApproval_Active(long Id)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_APPROVAL_SP_UPDATE]", param);
                PatientApprovalReturnModel Active = (from p in dt.AsEnumerable()
                                                     select new PatientApprovalReturnModel()
                                                     {
                                                         ReturnFlag = p.Field<int>("flag"),
                                                     }).FirstOrDefault();
                return Active;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Approve selected multiple patients
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>status of approval of multiple patients</returns>

        public PatientApprovalReturnModel Multiple_PatientApproval_Active(List<PatientApprovalModel> obj)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            string Message = "";
            int Flag = 0;
            foreach (PatientApprovalModel item in obj)
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", item.Patient_Id));
                var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
                _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
                try
                {
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_SP_APPROVE_VALIDATION]", param);
                    PatientApprovalReturnModel validation = (from p in dt.AsEnumerable()
                                                             select new PatientApprovalReturnModel()
                                                             {
                                                                 ReturnFlag = p.Field<int>("flag"),
                                                             }).FirstOrDefault();
                    if (validation.ReturnFlag == 1)
                    {
                        DataTable dt1 = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_APPROVAL_SP_UPDATE]", param);
                        PatientApprovalReturnModel Update = (from p in dt1.AsEnumerable()
                                                             select new PatientApprovalReturnModel()
                                                             {
                                                                 ReturnFlag = p.Field<int>("flag"),
                                                             }).FirstOrDefault();

                        Flag = Update.ReturnFlag;
                    }
                    else
                    {
                        PatientApprovalReturnModel result = (from p in dt.AsEnumerable()
                                                             select new PatientApprovalReturnModel()
                                                             {
                                                                 ReturnFlag = p.Field<int>("flag"),
                                                                 MessageString = p.Field<string>("msgstr"),
                                                                 FullName = p.Field<string>("FullName"),
                                                             }).FirstOrDefault();
                        Message = Message + result.MessageString + " " + "for the User" + " " + result.FullName + "\r\n";
                        Flag = result.ReturnFlag;
                    }
                }
                catch (Exception ex)
                {
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    return null;
                }
            }
            return new PatientApprovalReturnModel
            {
                Message = Message,
                ReturnFlag = Flag
            };
        }

        /// <summary>
        /// patient approval getting additional info
        /// </summary>
        /// <param name="model"></param>
        /// <returns>to insert patient approval required additional info/</returns>
        public long PatientApproval_History_Insert(PatientApprovalModel obj)
        {
            long retid;
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@Patient_Id", obj.Patient_Id));
            param.Add(new DataParameter("@Remarks", obj.Remarks));
            param.Add(new DataParameter("@Created_By", obj.Created_By));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                retid = ClsDataBase.Insert("[MYCORTEX].[PATIENTAPPROVAL_HISTORY_SP_INSERT]", param, true);
                return retid;
            }
            catch (Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }
        /// <summary>
        /// patient approval pending count of a institution
        /// </summary>
        /// <param name="InstitutionId"></param>
        /// <returns>patient approval pending count of a institution</returns>
        public IList<PatientApprovalModel> Get_PatientCount(long InstitutionId)
        {
            List<DataParameter> param = new List<DataParameter>();
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_PATIENTLICENCE_COUNT]", param);
                List<PatientApprovalModel> lst = (from p in dt.AsEnumerable()
                                                  select new PatientApprovalModel()
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