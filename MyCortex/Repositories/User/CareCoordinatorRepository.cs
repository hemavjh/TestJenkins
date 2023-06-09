﻿using System;
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
    public class CareCoordinatorRepository : ICarecoordinatorRepository
    {
         ClsDataBase db;
 
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public CareCoordinatorRepository()
        {
            db = new ClsDataBase();
        }
        /// <summary>
        /// to get the diagnostic and compliance patient list for the selected filter
        /// </summary>
        /// <param name="Coordinator_Id"></param>
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
        /// <param name="TypeId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<CareCoordinatorModel> CareCoordinator_PatientList(long Coordinator_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int TypeId, long UserTypeId, Guid Login_Session_Id)  
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Coordinator_Id", Coordinator_Id));
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
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataEncryption decrypt = new DataEncryption();
                DataTable dt = new DataTable();
                if (TypeId == 1)
                {
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[DIAGOSTICALERT_SP_PATIENTLIST]", param);
                }
                else
                {
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[COMPLIANCEALERT_SP_PATIENTLIST]", param);
                }
                List<CareCoordinatorModel> lst = (from p in dt.AsEnumerable()
                                                  select new CareCoordinatorModel()
                                                  {
                                                      Id = p.Field<long>("Id"),
                                                      MRN_NO = p.Field<string>("MRN_NO"),
                                                      PatientName = p.Field<string>("PatientName"),
                                                      FirstName = p.Field<string>("FirstName"),
                                                      LastName = p.Field<string>("LastName"),
                                                      Photo = p.Field<string>("PHOTO_NAME"),
                                                      HighCount = p.Field<int>("HighCount"),
                                                      MediumCount = p.Field<int>("MediumCount"),
                                                      LowCount = p.Field<int>("LowCount"),
                                                      Smoker_Option = p.Field<string>("Smoker"),
                                                      Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                                      Cholestrol_Option = p.Field<string>("Cholstrol_Option"),
                                                      HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                                      PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
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

        public IList<CareCoordinatorModel> CareCoordinator_FilterPatientList(long Coordinator_Id, string PATIENTNO, string INSURANCEID, string NATIONALITY_ID, string MOBILE_NO, string EMAILID, long UserTypeId, string FIRSTNAME, string LASTNAME, string MRN, int TypeId, Guid Login_Session_Id, int? AdvanceFilter)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Coordinator_Id", Coordinator_Id));
            param.Add(new DataParameter("@PatientNo", string.IsNullOrEmpty(PATIENTNO)? "" : PATIENTNO.ToLower()));
            param.Add(new DataParameter("@InsuranceNo", string.IsNullOrEmpty(INSURANCEID) ? "" : INSURANCEID.ToLower()));
            param.Add(new DataParameter("@NationalityId", string.IsNullOrEmpty(NATIONALITY_ID) ? "" : NATIONALITY_ID.ToLower()));
            param.Add(new DataParameter("@MobileNo", string.IsNullOrEmpty(MOBILE_NO) ? "" : MOBILE_NO.ToLower()));
            param.Add(new DataParameter("@Email", string.IsNullOrEmpty(EMAILID) ? "" : EMAILID.ToLower()));
            param.Add(new DataParameter("@FIRSTNAME", string.IsNullOrEmpty(FIRSTNAME) ? "" : FIRSTNAME.ToLower()));
            param.Add(new DataParameter("@LASTNAME", string.IsNullOrEmpty(LASTNAME) ? "" : LASTNAME.ToLower()));
            param.Add(new DataParameter("@MRN", string.IsNullOrEmpty(MRN) ? "" : MRN.ToLower()));
            param.Add(new DataParameter("@UserTypeId", UserTypeId));
            param.Add(new DataParameter("@AdvanceFilter", AdvanceFilter));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                //DataEncryption decrypt = new DataEncryption();
                DataTable dt = new DataTable();
                if (TypeId == 1)
                {
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[DIAGOSTICALERT_SP_FILTERPATIENTLIST]", param);
                }
                else
                {
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[COMPLIANCEALERT_SP_FILTERPATIENTLIST]", param);
                }
                List<CareCoordinatorModel> lst = new List<CareCoordinatorModel>();
                //List <CareCoordinatorModel> lst = (from p in dt.AsEnumerable()
                //                                  select new CareCoordinatorModel()
                //                                  {
                //                                      Id = p.Field<long>("Id"),
                //                                      MRN_NO = p.Field<string>("MRN_NO"),
                //                                      PatientName = p.Field<string>("PatientName"),
                //                                      FirstName = p.Field<string>("FirstName"),
                //                                      LastName = p.Field<string>("LastName"),
                //                                      Photo = p.Field<string>("PHOTO_NAME"),
                //                                      HighCount = p.Field<int>("HighCount"),
                //                                      MediumCount = p.Field<int>("MediumCount"),
                //                                      LowCount = p.Field<int>("LowCount"),
                //                                      Smoker_Option = p.Field<string>("Smoker"),
                //                                      Diabetic_Option = p.Field<string>("Diabetic_Option"),
                //                                      Cholestrol_Option = p.Field<string>("Cholstrol_Option"),
                //                                      HyperTension_Option = p.Field<string>("HyperTension_Option"),
                //                                      PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                //                                      ViewGenderName = p.Field<string>("VIEWGENDERNAME"),
                //                                  }).ToList();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    CareCoordinatorModel cc = new CareCoordinatorModel();
                    cc.Id = Convert.ToInt64(dt.Rows[i]["Id"].ToString());
                    cc.MRN_NO = dt.Rows[i]["MRN_NO"].ToString();
                    cc.PatientName = dt.Rows[i]["PatientName"].ToString();
                    cc.FirstName = dt.Rows[i]["FirstName"].ToString();
                    cc.LastName = dt.Rows[i]["LastName"].ToString();
                    cc.Photo = dt.Rows[i]["PHOTO_NAME"].ToString();
                    cc.HighCount = Convert.ToInt32(dt.Rows[i]["HighCount"].ToString());
                    cc.MediumCount = Convert.ToInt32(dt.Rows[i]["MediumCount"].ToString());
                    cc.LowCount = Convert.ToInt32(dt.Rows[i]["LowCount"].ToString());
                    cc.Smoker_Option = dt.Rows[i]["Smoker"].ToString();
                    cc.Diabetic_Option = dt.Rows[i]["Diabetic_Option"].ToString();
                    cc.Cholestrol_Option = dt.Rows[i]["Cholstrol_Option"].ToString();
                    cc.HyperTension_Option = dt.Rows[i]["HyperTension_Option"].ToString();
                    cc.ViewGenderName = dt.Rows[i]["VIEWGENDERNAME"].ToString();
                    lst.Add(cc);
                }

                return lst;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>     
        /// Get the Care Giver name List based on users group        
        /// </summary>
        /// <returns> Care Giver List based on users groups</returns>
        public IList<CareGiverListModel> CareGiver_List(long Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Patient_Id", Id));

            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[CAREGIVER_SP_LIST_BASEDONGROUP]", param);

                List<CareGiverListModel> lst = (from p in dt.AsEnumerable()
                                                select new CareGiverListModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    Name = p.Field<string>("FullName")
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
        /// to insert Assign the Care Giver to a Patient.        
        /// </summary>  
        /// <returns>Inserted Care Giver Records with Status</returns>
        public List<AssignCareGiverModel> Assign_CareGiver(AssignCareGiverModel obj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", obj.Id));
            param.Add(new DataParameter("@Coordinator_Id", obj.Coordinator_Id));
            param.Add(new DataParameter("@Patient_Id", obj.Patient_Id));
            param.Add(new DataParameter("@CareGiver_Id", obj.CareGiver_Id));
            param.Add(new DataParameter("@CC_Remarks", obj.CC_Remarks));
            param.Add(new DataParameter("@Created_By", obj.Created_By));
            param.Add(new DataParameter("@CC_Date", obj.CC_Date));
            param.Add(new DataParameter("@Page_Type", obj.Page_Type));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].CAREGIVER_SP_ASSIGN", param);

                List<AssignCareGiverModel> insert = (from p in dt.AsEnumerable()
                                               select
                                               new AssignCareGiverModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   flag = p.Field<int>("flag"),
                                                   Coordinator_Id = p.Field<long>("COORDINATOR_ID"),
                                                   Patient_Id = p.Field<long>("PATIENT_ID"),
                                                   CC_Remarks = p.Field<string>("CC_REMARKS"),
                                                   PatientName = p.Field<string>("PatientName"),
                                                   Coordinator = p.Field<string>("Coordinator"),
                                                   CareGiver = p.Field<string>("CareGiver"),
                                               }).ToList();

                return insert;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// get user parameter values of a selected patient
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<GetParameterValueModel> Get_ParameterValue(long PatientId, long UserTypeId, Guid Login_Session_Id, int StartRowNumber, int EndRowNumber, int Alert_Type, long Language_ID)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PatientId", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@AlertType", Alert_Type));
            param.Add(new DataParameter("@Language_ID", Language_ID));
            try
            {
                DataTable dt = new DataTable();
                if (UserTypeId == 6)
                {
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETPARAMETERVALUE_SP_LIST]", param);
                }
                else
                {
                    param.Add(new DataParameter("@VIEWUSER", UserTypeId));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[CAREGIVER_GETPARAMETERVALUE_SP_LIST]", param);
                }
                List<GetParameterValueModel> list = (from p in dt.AsEnumerable()
                                                     select new GetParameterValueModel()
                                                     {
                                                         Id = p.Field<long>("Id"),
                                                         PatientName = p.Field<string>("PatientName"),
                                                         HighCount = p.Field<int>("HighCount"),
                                                         MediumCount = p.Field<int>("MediumCount"),
                                                         LowCount = p.Field<int>("LowCount"),
                                                         ParameterName = p.Field<string>("ParameterName"),
                                                         ParameterValue = p.Field<decimal?>("PARAMETERVALUE"),
                                                         Average = p.Field<decimal?>("AVERAGE"),
                                                         UnitName = p.Field<string>("UnitName"),
                                                         PageType = p.Field<string>("PageType"),
                                                         Activity_Date = p.Field<DateTime?>("ACTIVITY_DATE"),
                                                         DeviceType = p.Field<string>("DEVICETYPE"),
                                                         Device_No = p.Field<string>("DEVICE_NO"),
                                                         FullName = p.Field<string>("FULLNAME"),
                                                         TypeName = p.Field<string>("TYPENAME"),
                                                         Createdby_ShortName = p.Field<string>("CREATEDBY_SHORTNAME"),
                                                         Com_DurationType = p.Field<string>("DurationType"),
                                                         DisplayParameterName = p.Field<string>("DISPLAYPARAMETERNAME"),
                                                         DisplayUnitName = p.Field<string>("DISPLAYUNITNAME"),
                                                     }).ToList();
                return list;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// get user parameter values of a selected patient
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<GetParameterValueCountModel> Get_ParameterValueCount(long PatientId, long UserTypeId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PatientId", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            try
            {
                //DataEncryption DecryptFields = new DataEncryption();
                DataTable dt = new DataTable();
                if (UserTypeId == 6)
                {
                    //dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETPARAMETERVALUE_SP_LIST]", param);
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETPARAMETERVALUELISTCOUNT_SP_LIST]", param);
                }
                else
                {
                    param.Add(new DataParameter("@VIEWUSER", UserTypeId));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[CAREGIVER_GETPARAMETERVALUECOUNT_SP_LIST]", param);
                }
                List<GetParameterValueCountModel> list = (from p in dt.AsEnumerable()
                                                     select new GetParameterValueCountModel()
                                                     {
                                                         //Id = p.Field<long>("Id"),
                                                         //PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                         HighCount = p.Field<int>("HighCount"),
                                                         MediumCount = p.Field<int>("MediumCount"),
                                                         LowCount = p.Field<int>("LowCount"),
                                                         //ParameterName = p.Field<string>("ParameterName"),
                                                         //ParameterValue = p.Field<decimal?>("PARAMETERVALUE"),
                                                         //Average = p.Field<decimal?>("AVERAGE"),
                                                         //UnitName = p.Field<string>("UnitName"),
                                                         //PageType = p.Field<string>("PageType"),
                                                         //Activity_Date = p.Field<DateTime?>("ACTIVITY_DATE"),
                                                         //DeviceType = p.Field<string>("DEVICETYPE"),
                                                         //Device_No = p.Field<string>("DEVICE_NO"),
                                                         //FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                         //TypeName = p.Field<string>("TYPENAME"),
                                                         //Createdby_ShortName = p.Field<string>("CREATEDBY_SHORTNAME"),
                                                         //Com_DurationType = p.Field<string>("DurationType"),
                                                     }).ToList();
                return list;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>     
        /// Get the assign caregiver history
        /// </summary>
        /// <returns> assign caregiver history list</returns>
        public IList<AssignCareGiverModel> Care_Coordinatorhistory(long CareGiverId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@CAREGIVER_ID", CareGiverId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ASSIGNCAREGIVERHISTORY_SP_VIEW", param);

                List<AssignCareGiverModel> lst = (from p in dt.AsEnumerable()
                                                  select new AssignCareGiverModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    Patient_Id = p.Field<long>("PATIENT_ID"),
                                                    Coordinator_Id = p.Field<long>("COORDINATOR_ID"),
                                                    Created_By = p.Field<long>("CREATED_BY"),
                                                    CareGiverIdView = p.Field<long>("CAREGIVER_ID"),
                                                    CC_Remarks = p.Field<string>("CC_REMARKS"),
                                                    CG_Assign_Status = p.Field<int>("CG_ASSIGN_STATUS"),
                                                    Appoinment_Id_Ref = p.Field<long?>("APPOINTMENT_ID_REF"),
                                                    CG_Remarks = p.Field<string>("CG_REMARKS"),
                                                    PatientName = p.Field<string>("PATIENTNAME"),
                                                    Coordinator = p.Field<string>("COORDINATORNAME"),
                                                    Createdbyname = p.Field<string>("CREATEDBYNAME"),
                                                    CareGiver = p.Field<string>("CAREGIVERNAME"),
                                                    PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                    Created_dt = p.Field<DateTime>("CREATED_DT")
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
        /// diagnostic alert count for the selected filter 
        /// </summary>
        /// <param name="Coordinator_Id"></param>
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
        /// <param name="TypeId"></param>
        /// <param name="UserTypeId"></param>
        /// <returns></returns>
        public IList<CareCoordinatorModel> Diagnostic_GetPatientList_Count(long Coordinator_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int TypeId, long UserTypeId, Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Coordinator_Id", Coordinator_Id));
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
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            var senddata = new JavaScriptSerializer().Serialize(param.Select(x => new { x.ParameterName, x.Value }));
            _MyLogger.Exceptions("INFO", _AppLogger, senddata, null, _AppMethod);
            try
            {
                DataTable dt = new DataTable();
                if (TypeId == 1)
                {
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETCOUNT_DIAGOSTICALERT_SP_PATIENTLIST]", param);
                }
                else
                {
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GETCOUNT_COMPLIANCEALERT_SP_PATIENTLIST]", param);
                }
                List<CareCoordinatorModel> lst = (from p in dt.AsEnumerable()
                                                  select new CareCoordinatorModel()
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