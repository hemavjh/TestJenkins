﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using log4net;
using MyCortexDB;
using MyCortex.User.Model;
using MyCortex.Masters.Models;
using MyCortex.User.Models;
using MyCortex.Utilities;
using MyCortex.Admin.Models;

namespace MyCortex.Repositories.Uesr
{
    public class UserRepository : IUserRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public UserRepository()
        {
            db = new ClsDataBase();
        }
        /// <summary>      
        /// Getting list of Doctor Affiliation Institution list
        /// </summary>          
        /// <returns>list of Doctor Affiliation Institution list</returns>
        public IList<DoctorInstitutionModel> DoctorInstitutionList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DOCTORINSTITUTION_SP_LIST");
                List<DoctorInstitutionModel> lst = (from p in dt.AsEnumerable()
                                       select new DoctorInstitutionModel()
                                       {
                                           Id = p.Field<long>("Id"),
                                           InstitutionName = p.Field<string>("INSTITUTIONNAME"),
                                           IsActive = p.Field<int>("IsActive")
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
        /// Getting list of department
        /// </summary>          
        /// <returns>list of department</returns>
        public IList<DepartmentModel> DepartmentList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DEPARTMENT_SP_LIST");
                List<DepartmentModel> lst = (from p in dt.AsEnumerable()
                                       select new DepartmentModel()
                                       {
                                           Id = p.Field<long>("Id"),
                                           Department_Name = p.Field<string>("Department_Name"),
                                           IsActive = p.Field<int>("IsActive")
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
        /// Getting list of business user types
        /// </summary>          
        /// <returns>list of business user types</returns>
        public IList<BusinessUser_UserTypeListModel> BusinessUser_UserTypeList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].BUSINESS_USER_SP_USERTYPELIST");
                List<BusinessUser_UserTypeListModel> lst = (from p in dt.AsEnumerable()
                                       select new BusinessUser_UserTypeListModel()
                                       {
                                           Id = p.Field<long>("Id"),
                                           UserName = p.Field<string>("TypeName"),
                                           IsActive = p.Field<int>("IsActive")
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
        /// to Insert/Update the Sign up Users, Hospital Admin and Business Users for a Institution
        /// </summary>
        /// <param name="userObj">User Information</param>
        /// <returns>Status message with inserted/updated user information</returns>
        public UserModel Admin_InsertUpdate(Guid Login_Session_Id,UserModel insobj)
        {
            long InsertId = 0;
            string flag = "";
            long Inserted_Group_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", insobj.Id));
            param.Add(new DataParameter("@InstitutionId", insobj.INSTITUTION_ID));
            param.Add(new DataParameter("@FirstName", insobj.FirstName));
            param.Add(new DataParameter("@MiddleName", insobj.MiddleName));
            param.Add(new DataParameter("@LastName", insobj.LastName));
            param.Add(new DataParameter("@Employment_No", insobj.EMPLOYEMENTNO));
            param.Add(new DataParameter("@EmailId", insobj.EMAILID));
            param.Add(new DataParameter("@DepartmentId", insobj.DEPARTMENT_ID));
            param.Add(new DataParameter("@MobileNo", insobj.MOBILE_NO));
            param.Add(new DataParameter("@Photo_Name", insobj.Photo));
            param.Add(new DataParameter("@Photo_FileName", insobj.FileName));
            param.Add(new DataParameter("@Photo_FullPath", insobj.Photo_Fullpath));
            param.Add(new DataParameter("@UserTypeId", insobj.UserType_Id));

            param.Add(new DataParameter("@TITLE_ID", insobj.TITLE_ID));
            param.Add(new DataParameter("@HEALTH_LICENSE", insobj.HEALTH_LICENSE));
            param.Add(new DataParameter("@FILE_NAME", insobj.FILE_NAME));
            param.Add(new DataParameter("@FILE_FULLPATH", insobj.FILE_FULLPATH));
            param.Add(new DataParameter("@UPLOAD_FILENAME", insobj.UPLOAD_FILENAME));
            param.Add(new DataParameter("@GENDER_ID", insobj.GENDER_ID));
            param.Add(new DataParameter("@NATIONALITY_ID", insobj.NATIONALITY_ID));
            param.Add(new DataParameter("@ETHINICGROUP_ID", insobj.ETHINICGROUP_ID));
            param.Add(new DataParameter("@DOB", insobj.DOB));
            param.Add(new DataParameter("@HOME_AREACODE", insobj.HOME_AREACODE));
            param.Add(new DataParameter("@HOME_PHONENO", insobj.HOME_PHONENO));
            param.Add(new DataParameter("@MOBIL_AREACODE", insobj.MOBIL_AREACODE));
            param.Add(new DataParameter("@POSTEL_ZIPCODE", insobj.POSTEL_ZIPCODE));
            param.Add(new DataParameter("@EMR_AVAILABILITY", insobj.EMR_AVAILABILITY));
            param.Add(new DataParameter("@ADDRESS1", insobj.ADDRESS1));
            param.Add(new DataParameter("@ADDRESS2", insobj.ADDRESS2));
            param.Add(new DataParameter("@ADDRESS3", insobj.ADDRESS3));
            param.Add(new DataParameter("@COUNTRY_ID", insobj.COUNTRY_ID));
            param.Add(new DataParameter("@STATE_ID", insobj.STATE_ID));
            param.Add(new DataParameter("@CITY_ID", insobj.CITY_ID));
            param.Add(new DataParameter("@MARITALSTATUS_ID", insobj.MARITALSTATUS_ID));
            param.Add(new DataParameter("@BLOODGROUP_ID", insobj.BLOODGROUP_ID));
            //param.Add(new DataParameter("@PATIENTNO", insobj.PATIENTNO));
            param.Add(new DataParameter("@INSURANCEID", insobj.INSURANCEID));
            param.Add(new DataParameter("@MNR_NO", insobj.MNR_NO));
            param.Add(new DataParameter("@NATIONALID", insobj.NATIONALID));
            param.Add(new DataParameter("@SMOKER", insobj.SMOKER));
            param.Add(new DataParameter("@DIABETIC", insobj.DIABETIC));
            param.Add(new DataParameter("@HYPERTENSION", insobj.HYPERTENSION));
            param.Add(new DataParameter("@CHOLESTEROL", insobj.CHOLESTEROL));
            param.Add(new DataParameter("@CURRENTLY_TAKEMEDICINE", insobj.CURRENTLY_TAKEMEDICINE));
            param.Add(new DataParameter("@PAST_MEDICALHISTORY", insobj.PAST_MEDICALHISTORY));
            param.Add(new DataParameter("@FAMILYHEALTH_PROBLEMHISTORY", insobj.FAMILYHEALTH_PROBLEMHISTORY));
            param.Add(new DataParameter("@VACCINATIONS", insobj.VACCINATIONS));
            param.Add(new DataParameter("@DIETDESCRIBE_ID", insobj.DIETDESCRIBE_ID));
            param.Add(new DataParameter("@EXCERCISE_SCHEDULEID", insobj.EXCERCISE_SCHEDULEID));
            param.Add(new DataParameter("@EXCERCISE_TEXT", insobj.EXCERCISE_TEXT));
            param.Add(new DataParameter("@ALERGYSUBSTANCE_ID", insobj.ALERGYSUBSTANCE_ID));
            param.Add(new DataParameter("@ALERGYSUBSTANCE_TEXT", insobj.ALERGYSUBSTANCE_TEXT));
            param.Add(new DataParameter("@SMOKESUBSTANCE_ID", insobj.SMOKESUBSTANCE_ID));
            param.Add(new DataParameter("@SMOKESUBSTANCE_TEXT", insobj.SMOKESUBSTANCE_TEXT));
            param.Add(new DataParameter("@ALCOHALSUBSTANCE_ID", insobj.ALCOHALSUBSTANCE_ID));
            param.Add(new DataParameter("@ALCOHALSUBSTANCE_TEXT", insobj.ALCOHALSUBSTANCE_TEXT));
            param.Add(new DataParameter("@CAFFEINATED_BEVERAGESID", insobj.CAFFEINATED_BEVERAGESID));
            param.Add(new DataParameter("@CAFFEINATEDBEVERAGES_TEXT", insobj.CAFFEINATEDBEVERAGES_TEXT));
            param.Add(new DataParameter("@EMERG_CONT_FIRSTNAME", insobj.EMERG_CONT_FIRSTNAME));
            param.Add(new DataParameter("@EMERG_CONT_MIDDLENAME", insobj.EMERG_CONT_MIDDLENAME));
            param.Add(new DataParameter("@EMERG_CONT_LASTNAME", insobj.EMERG_CONT_LASTNAME));
            param.Add(new DataParameter("@EMERG_CONT_RELATIONSHIP_ID", insobj.EMERG_CONT_RELATIONSHIP_ID));
            param.Add(new DataParameter("@GOOGLE_EMAILID", insobj.GOOGLE_EMAILID));
            param.Add(new DataParameter("@FB_EMAILID", insobj.FB_EMAILID));
            param.Add(new DataParameter("@APPROVAL_FLAG", insobj.ApprovalFlag));
            param.Add(new DataParameter("@PASSWORD", insobj.PASSWORD));
            param.Add(new DataParameter("@Patient_Type", insobj.Patient_Type));
            param.Add(new DataParameter("@Emergency_MobileNo", insobj.Emergency_MobileNo));
            param.Add(new DataParameter("@DOB_Encrypt", insobj.DOB_Encrypt));
            param.Add(new DataParameter("@FullName", insobj.FullName));
            //param.Add(new DataParameter("@ISACTIVE", insobj.ISACTIVE));
            param.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            //param.Add(new DataParameter("@CREATED_DT", insobj.CREATED_DT));
            List<DataParameter> param_1 = new List<DataParameter>();
            param_1.Add(new DataParameter("@InstitutionId", insobj.INSTITUTION_ID));

            DataTable dt_1 = ClsDataBase.GetDataTable("[MYCORTEX].[GET_PATIENTID_SP_LIST]", param_1);
            UserModel Get_Patient_No = (from p in dt_1.AsEnumerable()
                                        select new UserModel()
                                        {
                                            PATIENTNO = p.Field<string>("PATIENTNO"),
                                        }).FirstOrDefault();
            DataEncryption EncryptPassword = new DataEncryption();
            insobj.PATIENTNO = EncryptPassword.Encrypt(Get_Patient_No.PATIENTNO);
            param.Add(new DataParameter("@PATIENTNO", insobj.PATIENTNO));
            param.Add(new DataParameter("@IS_MASTER", insobj.IS_MASTER));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_ADMIN_SP_INSERTUPDATE]", param);
            DataRow dr = dt.Rows[0];
            if (dr.IsNull("Id") == true)
            {
                InsertId = 0;
            }
            else
            {
                InsertId = long.Parse((dr["Id"].ToString()));
            }
            if (InsertId > 0)
            {
                if (insobj.MenuType != 1)
                {
                    if (insobj.GroupTypeList != null)
                    {
                        foreach (GroupTypeModel item in insobj.GroupTypeList)
                        {

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@User_Id", InsertId));
                            param1.Add(new DataParameter("@Group_Id", item.Id));
                            param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                            var objExist = insobj.SelectedGroupList.Where(ChildItem => ChildItem.Group_Id == item.Id);

                            if (objExist.ToList().Count > 0)
                                //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                                param1.Add(new DataParameter("@Group_Selected", "1"));
                            else
                                param1.Add(new DataParameter("@Group_Selected", "0"));

                            Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].USER_SP_INSERTUPDATE_DOCTORADDITIONALDETAILS", param1, true);
                        }
                    }
                    if (insobj.MenuType == 2)
                    {
                        if (insobj.InstitutionList != null)
                        {
                            // Institution Child Table save
                            foreach (InstitutionMasterModel item in insobj.InstitutionList)
                            {

                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@User_Id", InsertId));
                                param1.Add(new DataParameter("@Institution_Id", item.Id));
                                param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                                var objExist = insobj.SelectedInstitutionList.Where(ChildItem => ChildItem.Institution_Id == item.Id);

                                if (objExist.ToList().Count > 0)
                                    param1.Add(new DataParameter("@Institution_Selected", "1"));
                                else
                                    param1.Add(new DataParameter("@Institution_Selected", "0"));

                                Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].USER_SP_INSERTUPDATE_INSTITTUTIONDETAILS", param1, true);
                            }
                        }
                        if (insobj.LanguageList != null)
                        {
                            // Language Child table save
                            foreach (LanguageProficiencyModel item in insobj.LanguageList)
                            {

                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@User_Id", InsertId));
                                param1.Add(new DataParameter("@Language_Id", item.Id));
                                param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                                var objExist = insobj.SelectedLanguageList.Where(ChildItem => ChildItem.Language_Id == item.Id);

                                if (objExist.ToList().Count > 0)
                                    param1.Add(new DataParameter("@Language_Selected", "1"));
                                else
                                    param1.Add(new DataParameter("@Language_Selected", "0"));

                                Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].USER_SP_INSERTUPDATE_LANGUAGEDETAILS", param1, true);
                            }
                        }
                    }
                    if (insobj.MenuType == 3)
                    {
                        if (insobj.ChronicConditionList != null)
                        {
                            foreach (ChronicConditionModel item in insobj.ChronicConditionList)
                            {

                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@User_Id", InsertId));
                                param1.Add(new DataParameter("@Chronic_Id", item.Id));
                                param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                                var objExist = insobj.SelectedChronicConnditionList.Where(ChildItem => ChildItem.Chronic_Id == item.Id);

                                if (objExist.ToList().Count > 0)
                                    param1.Add(new DataParameter("@Condition_Selected", "1"));
                                else
                                    param1.Add(new DataParameter("@Condition_Selected", "0"));

                                Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].PATIENT_SP_INSERTUPDATE_CHRONICCONDITION", param1, true);
                            }
                            if (insobj.CURRENTLY_TAKEMEDICINE == 1)
                            {
                                foreach (Patient_CurrentMedicalDetails item in insobj.AddMedicines)
                                {
                                    List<DataParameter> param1 = new List<DataParameter>();
                                    param1.Add(new DataParameter("@Id", item.Id));
                                    param1.Add(new DataParameter("@User_Id", InsertId));
                                    param1.Add(new DataParameter("@Medicine_Name", item.MedicineName));
                                    param1.Add(new DataParameter("@Remarks", item.Remarks));
                                    param1.Add(new DataParameter("@Status", item.Status));
                                    param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                                    Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].PATIENT_SP_INSERTUPDATE_CURRENTMEDICALDETAILS", param1, true);
                                }
                            }
                            if (insobj.PAST_MEDICALHISTORY == 1)
                            {
                                foreach (Patient_PastMedicalDetails item in insobj.AddMedicalHistory)
                                {
                                    List<DataParameter> param1 = new List<DataParameter>();
                                    param1.Add(new DataParameter("@Id", item.Id));
                                    param1.Add(new DataParameter("@User_Id", InsertId));
                                    param1.Add(new DataParameter("@Medicine_Name", item.Medical_History));
                                    param1.Add(new DataParameter("@Remarks", item.Remarks));
                                    param1.Add(new DataParameter("@Status", item.Status));
                                    param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                                    Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].PATIENT_SP_INSERTUPDATE_PASTMEDICALDETAILS", param1, true);
                                }
                            }
                            if (insobj.FAMILYHEALTH_PROBLEMHISTORY == 1)
                            {
                                foreach (Patient_FamilyHeealthHistoryDetails item in insobj.AddHealthProblem)
                                {
                                    List<DataParameter> param1 = new List<DataParameter>();
                                    param1.Add(new DataParameter("@Id", item.Id));
                                    param1.Add(new DataParameter("@User_Id", InsertId));
                                    param1.Add(new DataParameter("@Relationship_Id", item.Relationship_Id));
                                    param1.Add(new DataParameter("@Health_Problem", item.Health_Problem));
                                    param1.Add(new DataParameter("@Remarks", item.Remarks));
                                    param1.Add(new DataParameter("@Status", item.Status));
                                    param1.Add(new DataParameter("@CREATED_BY", insobj.CREATED_BY));
                                    Inserted_Group_Id = ClsDataBase.Insert("[MYCORTEX].PATIENT_SP_INSERTUPDATE_FAMILYHEALTHPROBLEM", param1, true);
                                }
                            }
                        }
                    }
                }
            }
            DataEncryption DecryptFields = new DataEncryption();
            UserModel insert = (from p in dt.AsEnumerable()
                                select
                                new UserModel()
                                {
                                    Id = p.IsNull("Id") ? 0 : p.Field<long>("Id"),
                                    flag = p.Field<int>("flag"),
                                    INSTITUTION_ID = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                    FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                    MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                    LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                    EMPLOYEMENTNO = p.Field<string>("EMPLOYEMENTNO"),
                                    EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                    DEPARTMENT_ID = p.IsNull("DEPARTMENT_ID") ? 0 : p.Field<long>("DEPARTMENT_ID"),
                                    MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")),
                                    DOB = p.Field<DateTime?>("DOB"),
                                    DOB_Encrypt = DecryptFields.Decrypt(p.Field<string>("DOB_Encrypt")),
                                    Department_Name = p.Field<string>("Department_Name"),
                                    InstitutionName = p.Field<string>("InstitutionName"),
                                    IsActive = p.Field<int?>("IsActive"),
                                    Photo = p.Field<string>("PHOTO_NAME"),
                                    Photo_Fullpath = p.Field<string>("PHOTO_FULLPATH"),
                                    FileName = p.Field<string>("PHOTO_FILENAME"),
                                    FILE_NAME = p.Field<string>("FILE_NAME"),
                                    FILE_FULLPATH = p.Field<string>("FILE_FULLPATH"),
                                    UPLOAD_FILENAME = p.Field<string>("UPLOAD_FILENAME"),
                                    UserType_Id = p.Field<long?>("UserType_Id"),
                                    HEALTH_LICENSE = p.Field<string>("HEALTH_LICENSE"),
                                    GENDER_ID = p.IsNull("GENDER_ID") ? 0 : p.Field<long>("GENDER_ID"),
                                    NATIONALITY_ID = p.IsNull("NATIONALITY_ID") ? 0 : p.Field<long>("NATIONALITY_ID"),
                                    ETHINICGROUP_ID = p.IsNull("ETHINICGROUP_ID") ? 0 : p.Field<long>("ETHINICGROUP_ID"),
                                    EMR_AVAILABILITY = p.Field<bool?>("EMR_AVAILABILITY"),
                                    ADDRESS1 = p.Field<string>("ADDRESS1"),
                                    ADDRESS2 = p.Field<string>("ADDRESS2"),
                                    ADDRESS3 = p.Field<string>("ADDRESS3"),
                                    HOME_AREACODE = p.Field<string>("HOME_AREACODE"),
                                    HOME_PHONENO = p.Field<string>("HOME_PHONENO"),
                                    MOBIL_AREACODE = p.Field<string>("MOBIL_AREACODE"),
                                    POSTEL_ZIPCODE = p.Field<string>("POSTEL_ZIPCODE"),
                                    COUNTRY_ID = p.IsNull("COUNTRY_ID") ? 0 : p.Field<long>("COUNTRY_ID"),
                                    STATE_ID = p.IsNull("STATE_ID") ? 0 : p.Field<long>("STATE_ID"),
                                    CITY_ID = p.IsNull("CITY_ID") ? 0 : p.Field<long>("CITY_ID"),
                                    BLOODGROUP_ID = p.IsNull("BLOODGROUP_ID") ? 0 : p.Field<long>("BLOODGROUP_ID"),
                                    MARITALSTATUS_ID = p.IsNull("MARITALSTATUS_ID") ? 0 : p.Field<long>("MARITALSTATUS_ID"),
                                    PATIENTNO = DecryptFields.Decrypt(p.Field<string>("PATIENTNO")),
                                    MNR_NO = DecryptFields.Decrypt(p.Field<string>("MNR_NO")),
                                    INSURANCEID = DecryptFields.Decrypt(p.Field<string>("INSURANCEID")),
                                    NATIONALID = DecryptFields.Decrypt(p.Field<string>("NATIONALID")),
                                    EthnicGroup = p.Field<string>("EthnicGroup"),
                                    UserName = p.Field<string>("UserName"),
                                    GENDER_NAME = p.Field<string>("GENDER_NAME"),
                                    Nationality = p.Field<string>("Nationality"),
                                    COUNTRY_NAME = p.Field<string>("COUNTRY_NAME"),
                                    StateName = p.Field<string>("StateName"),
                                    LocationName = p.Field<string>("LocationName"),
                                    MaritalStatus = p.Field<string>("MaritalStatus"),
                                    BLOODGROUP_NAME = p.Field<string>("BLOODGROUP_NAME"),
                                    RelationShipName = p.Field<string>("RelationShipName"),
                                    DietDescribe = p.Field<string>("DietDescribe"),
                                    AlergySubstance = p.Field<string>("AlergySubstance"),
                                    EXCERCISE_SCHEDULE = p.Field<string>("EXCERCISE_SCHEDULE"),
                                    SMOKESUBSTANCE = p.Field<string>("SMOKESUBSTANCE"),
                                    ALCOHALSUBSTANCE = p.Field<string>("ALCOHALSUBSTANCE"),
                                    CAFFEINATED_BEVERAGES = p.Field<string>("CAFFEINATED_BEVERAGES"),
                                    CURRENTLY_TAKEMEDICINE = p.Field<int?>("CURRENTLY_TAKEMEDICINE"),
                                    PAST_MEDICALHISTORY = p.Field<int?>("PAST_MEDICALHISTORY"),
                                    FAMILYHEALTH_PROBLEMHISTORY = p.Field<int?>("FAMILYHEALTH_PROBLEMHISTORY"),
                                    VACCINATIONS = p.Field<int?>("VACCINATIONS"),
                                    DIETDESCRIBE_ID = p.IsNull("DIETTYPE_ID") ? 0 : p.Field<long?>("DIETTYPE_ID"),
                                    EXCERCISE_SCHEDULEID = p.IsNull("EXCERCISE_SCHEDULEID") ? 0 : p.Field<long?>("EXCERCISE_SCHEDULEID"),
                                    EXCERCISE_TEXT = p.Field<string>("EXCERCISE_TEXT"),
                                    ALERGYSUBSTANCE_ID = p.IsNull("ALERGYSUBSTANCE_ID") ? 0 : p.Field<long>("ALERGYSUBSTANCE_ID"),
                                    ALERGYSUBSTANCE_TEXT = p.Field<string>("ALERGYSUBSTANCE_TEXT"),
                                    SMOKESUBSTANCE_ID = p.IsNull("SMOKESUBSTANCE_ID") ? 0 : p.Field<long>("SMOKESUBSTANCE_ID"),
                                    SMOKESUBSTANCE_TEXT = p.Field<string>("SMOKESUBSTANCE_TEXT"),
                                    ALCOHALSUBSTANCE_ID = p.IsNull("ALCOHALSUBSTANCE_ID") ? 0 : p.Field<long>("ALCOHALSUBSTANCE_ID"),
                                    ALCOHALSUBSTANCE_TEXT = p.Field<string>("ALCOHALSUBSTANCE_TEXT"),
                                    CAFFEINATED_BEVERAGESID = p.IsNull("CAFFEINATED_BEVERAGESID") ? 0 : p.Field<long>("CAFFEINATED_BEVERAGESID"),
                                    CAFFEINATEDBEVERAGES_TEXT = p.Field<string>("CAFFEINATEDBEVERAGES_TEXT"),
                                    EMERG_CONT_FIRSTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_FIRSTNAME")),
                                    EMERG_CONT_MIDDLENAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_MIDDLENAME")),
                                    EMERG_CONT_LASTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_LASTNAME")),
                                    EMERG_CONT_RELATIONSHIP_ID = p.IsNull("EMERG_CONT_RELATIONSHIP_ID") ? 0 : p.Field<long>("EMERG_CONT_RELATIONSHIP_ID"),
                                    GOOGLE_EMAILID = DecryptFields.Decrypt(p.Field<string>("Google_EmailId")),
                                    FB_EMAILID = DecryptFields.Decrypt(p.Field<string>("FB_EMAILID")),
                                    DIABETIC = p.IsNull("DIABETIC") ? 0 : p.Field<long>("DIABETIC"),
                                    HYPERTENSION = p.IsNull("HYPERTENSION") ? 0 : p.Field<long>("HYPERTENSION"),
                                    CHOLESTEROL = p.IsNull("CHOLESTEROL") ? 0 : p.Field<long>("CHOLESTEROL"),
                                    Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                    HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                    Cholesterol_Option = p.Field<string>("Cholestrol_Option"),
                                    Patient_Type = p.Field<int?>("Patient_Type"),
                                    Emergency_MobileNo = DecryptFields.Decrypt(p.Field<string>("EMRG_CONT_PHONENO")),
                                    FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                }).FirstOrDefault();
            if (insert.DOB_Encrypt != "")
            {
                insert.DOB = Convert.ToDateTime(insert.DOB_Encrypt);
                /*string[] tokens = insert.DOB_Encrypt.Split('/');
                insert.DOB = new DateTime(int.Parse(tokens[2].Substring(0, 4)), int.Parse(tokens[0]), int.Parse(tokens[1]));*/
            }

            if(InsertId>0)
            { 
                String FirstCharacter = insert.FirstName.ToString();
                String LastCharacter = insert.LastName.ToString();
                String Month = "00";
                if(insert.DOB!=null)
                    Month = insert.DOB.Value.Month.ToString("00");

                List<DataParameter> param2 = new List<DataParameter>();
                param2.Add(new DataParameter("@FirstNameChar", FirstCharacter.Substring(0, 1)));
                param2.Add(new DataParameter("@LastNameChar", LastCharacter.Substring(0, 1)));
                param2.Add(new DataParameter("@ID", InsertId));
                param2.Add(new DataParameter("@Month", Month));
                DataTable dt1 = ClsDataBase.GetDataTable("[MYCORTEX].[USER_SHORTCODE_SP_INSERTUPDATE]", param2);
            }

            return insert;
        }

        /// <summary>      
        /// Getting user list of a institution
        /// </summary>          
        /// <returns> user list of a institution</returns>
        //  [CheckSessionOut]
        public IList<ItemizedUserDetailsModel> UserDetails_List(long Id, long InstitutionId, int? IsActive, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            DataEncryption DecryptFields = new DataEncryption();
            //List<ItemizedUserDetailsModel> products = new List<ItemizedUserDetailsModel>();
            param.Add(new DataParameter("@MenuType", Id));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERDETAILS_SP_LIST", param);
            List<ItemizedUserDetailsModel> list = (from p in dt.AsEnumerable()
                                    select new ItemizedUserDetailsModel()
                                    {
                                        Id = p.Field<long>("Id"),
                                        INSTITUTION_ID = p.Field<long?>("INSTITUTION_ID"),
                                        //FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                        //MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                        //LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                        FullName = DecryptFields.Decrypt(p.Field<string>("FullName")),
                                        EMPLOYEMENTNO = p.Field<string>("EMPLOYEMENTNO"),
                                        EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                        DEPARTMENT_ID = p.Field<long?>("DEPARTMENT_ID"),
                                        MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")),
                                        Department_Name = p.Field<string>("Department_Name"),
                                        InstitutionName = p.Field<string>("InstitutionName"),
                                        IsActive = p.Field<int?>("IsActive"),
                                        UserName = p.Field<string>("UserName"),
                                        GroupName = p.Field<string>("GroupName") ?? "",
                                        LoginTime = p.Field<DateTime?>("LoginTime"),
                                        GENDER_NAME = p.Field<string>("Gender_Name"),
                                        UserType_Id = p.Field<long?>("UserType_Id")
                                    }).ToList();
            //list.FullName = list.FullName;
            return list;
        }
        /// <summary>
        /// to get list of patients based on given filter
        /// </summary>
        /// <param name="Id"></param>
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
        /// <param name="IsActive"></param>
        /// <param name="INSTITUTION_ID"></param>
         /// <param name="StartRowNumber"></param>
        ///  <param name="EndRowNumber"></param>
        /// <returns></returns>
        public IList<ItemizedUserDetailsModel> Patient_List(long? Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int? IsActive, long? INSTITUTION_ID, int StartRowNumber, int EndRowNumber,string SearchQuery,string SearchEncryptedQuery)
        {
            DataEncryption EncryptPassword = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@PatientNo", EncryptPassword.Encrypt(PATIENTNO)));
            param.Add(new DataParameter("@InsuranceNo", EncryptPassword.Encrypt(INSURANCEID)));
            param.Add(new DataParameter("@GenderId", GENDER_ID));
            param.Add(new DataParameter("@NationalityId", NATIONALITY_ID));
            param.Add(new DataParameter("@EthnicGroupId", ETHINICGROUP_ID));
            param.Add(new DataParameter("@MobileNo", EncryptPassword.Encrypt(MOBILE_NO)));
            param.Add(new DataParameter("@PhoneNo", HOME_PHONENO));
            param.Add(new DataParameter("@Email",  EncryptPassword.Encrypt(EMAILID)));
            param.Add(new DataParameter("@MaritalStatusId", MARITALSTATUS_ID));
            param.Add(new DataParameter("@CountryId", COUNTRY_ID));
            param.Add(new DataParameter("@StateId", STATE_ID));
            param.Add(new DataParameter("@CityId", CITY_ID));
            param.Add(new DataParameter("@BloodGroupId", BLOODGROUP_ID));
            param.Add(new DataParameter("@GroupId", Group_Id));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@InstitutionId", INSTITUTION_ID));
            param.Add(new DataParameter("@SearchQuery", SearchQuery));
            param.Add(new DataParameter("@SearchEncryptedQuery", EncryptPassword.Encrypt(SearchQuery)));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_SP_LIST", param);
            DataEncryption DecryptFields = new DataEncryption();
            List<ItemizedUserDetailsModel> list = (from p in dt.AsEnumerable()
                                                   select new ItemizedUserDetailsModel()
                                    {
                                        TotalRecord = p.Field<string>("TotalRecords"),
                                        Id = p.Field<long>("Id"),
                                        FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                        MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                        LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                        FullName = DecryptFields.Decrypt(p.Field<string>("FullName")),
                                        MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")),
                                        IsActive = p.Field<int?>("IsActive"),
                                        GroupName = p.Field<string>("GroupName"),
                                        MNR_NO = DecryptFields.Decrypt(p.Field<string>("MNR_NO")),
                                        GENDER_NAME = p.Field<string>("Gender_Name"),
                                        LoginTime = p.Field<DateTime?>("LOGINTIME"),
                                        EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")) ?? "",
                                    }).OrderBy(o=>o.FullName).ToList();
            return list;
        }

        /// <summary>
        /// to get User basic details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User basic details</returns>
        public UserModel UserDetails_View(long Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            DataEncryption DecryptFields = new DataEncryption();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERDETAILS_SP_VIEW", param);
            UserModel View = (from p in dt.AsEnumerable()
                              select
                              new UserModel()
                              {
                                  Id = p.Field<long>("Id"),
                                  INSTITUTION_ID = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                  FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                  MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                  LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                  EMPLOYEMENTNO = p.Field<string>("EMPLOYEMENTNO"),
                                  EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                  DEPARTMENT_ID = p.IsNull("DEPARTMENT_ID") ? 0 : p.Field<long>("DEPARTMENT_ID"),
                                  MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")),
                                  DOB = p.Field<DateTime?>("DOB"),
                                  DOB_Encrypt = DecryptFields.Decrypt(p.Field<string>("DOB_Encrypt")),
                                  Department_Name = p.Field<string>("Department_Name"),
                                  InstitutionName = p.Field<string>("InstitutionName"),
                                  IsActive = p.Field<int?>("IsActive"),
                                  Photo = p.Field<string>("PHOTO_NAME"),
                                  Photo_Fullpath = p.Field<string>("PHOTO_FULLPATH"),
                                  FileName = p.Field<string>("PHOTO_FILENAME"),
                                  FILE_NAME = p.Field<string>("FILE_NAME"),
                                  FILE_FULLPATH = p.Field<string>("FILE_FULLPATH"),
                                  UPLOAD_FILENAME = p.Field<string>("UPLOAD_FILENAME"),
                                  UserType_Id = p.Field<long?>("UserType_Id"),
                                  HEALTH_LICENSE = p.Field<string>("HEALTH_LICENSE"),
                                  GENDER_ID = p.IsNull("GENDER_ID") ? 0 : p.Field<long>("GENDER_ID"),
                                  NATIONALITY_ID = p.IsNull("NATIONALITY_ID") ? 0 : p.Field<long>("NATIONALITY_ID"),
                                  ETHINICGROUP_ID = p.IsNull("ETHINICGROUP_ID") ? 0 : p.Field<long>("ETHINICGROUP_ID"),
                                  EMR_AVAILABILITY = p.Field<bool?>("EMR_AVAILABILITY"),
                                  ADDRESS1 = p.Field<string>("ADDRESS1"),
                                  ADDRESS2 = p.Field<string>("ADDRESS2"),
                                  ADDRESS3 = p.Field<string>("ADDRESS3"),
                                  HOME_AREACODE = p.Field<string>("HOME_AREACODE"),
                                  HOME_PHONENO = p.Field<string>("HOME_PHONENO"),
                                  MOBIL_AREACODE = p.Field<string>("MOBIL_AREACODE"),
                                  POSTEL_ZIPCODE = p.Field<string>("POSTEL_ZIPCODE"),
                                  COUNTRY_ID = p.IsNull("COUNTRY_ID") ? 0 : p.Field<long>("COUNTRY_ID"),
                                  STATE_ID = p.IsNull("STATE_ID") ? 0 : p.Field<long>("STATE_ID"),
                                  CITY_ID = p.IsNull("CITY_ID") ? 0 : p.Field<long>("CITY_ID"),
                                  BLOODGROUP_ID = p.IsNull("BLOODGROUP_ID") ? 0 : p.Field<long>("BLOODGROUP_ID"),
                                  MARITALSTATUS_ID = p.IsNull("MARITALSTATUS_ID") ? 0 : p.Field<long>("MARITALSTATUS_ID"),
                                  // PATIENTNO = DecryptFields.Decrypt(p.Field<string>("PATIENTNO")),
                                  PATIENTNO = DecryptFields.Decrypt(p.Field<string>("PATIENTNO")),
                                  MNR_NO = DecryptFields.Decrypt(p.Field<string>("MNR_NO")),
                                  INSURANCEID = DecryptFields.Decrypt(p.Field<string>("INSURANCEID")),
                                  NATIONALID = DecryptFields.Decrypt(p.Field<string>("NATIONALID")),
                                  EthnicGroup = p.Field<string>("EthnicGroup"),
                                  UserName = p.Field<string>("UserName"),
                                  GENDER_NAME = p.Field<string>("GENDER_NAME"),
                                  Nationality = p.Field<string>("Nationality"),
                                  GroupName = p.Field<string>("GroupName"),
                                  COUNTRY_NAME = p.Field<string>("COUNTRY_NAME"),
                                  StateName = p.Field<string>("StateName"),
                                  LocationName = p.Field<string>("LocationName"),
                                  Institution = p.Field<string>("Institution"),
                                  LanguageKnown = p.Field<string>("LanguageKnown"),
                                  MaritalStatus = p.Field<string>("MaritalStatus"),
                                  BLOODGROUP_NAME = p.Field<string>("BLOODGROUP_NAME"),
                                  RelationShipName = p.Field<string>("RelationShipName"),
                                  DietDescribe = p.Field<string>("DietDescribe"),
                                  AlergySubstance = p.Field<string>("AlergySubstance"),
                                  ChronicCondition = p.Field<string>("ChronicCondition"),
                                  EXCERCISE_SCHEDULE = p.Field<string>("EXCERCISE_SCHEDULE"),
                                  SMOKESUBSTANCE = p.Field<string>("SMOKESUBSTANCE"),
                                  ALCOHALSUBSTANCE = p.Field<string>("ALCOHALSUBSTANCE"),
                                  CAFFEINATED_BEVERAGES = p.Field<string>("CAFFEINATED_BEVERAGES"),
                                  CURRENTLY_TAKEMEDICINE = p.Field<int?>("CURRENTLY_TAKEMEDICINE"),
                                  PAST_MEDICALHISTORY = p.Field<int?>("PAST_MEDICALHISTORY"),
                                  FAMILYHEALTH_PROBLEMHISTORY = p.Field<int?>("FAMILYHEALTH_PROBLEMHISTORY"),
                                  VACCINATIONS = p.Field<int?>("VACCINATIONS"),
                                  DIETDESCRIBE_ID = p.IsNull("DIETTYPE_ID") ? 0 : p.Field<long?>("DIETTYPE_ID"),
                                  EXCERCISE_SCHEDULEID = p.IsNull("EXCERCISE_SCHEDULEID") ? 0 : p.Field<long?>("EXCERCISE_SCHEDULEID"),
                                  EXCERCISE_TEXT = p.Field<string>("EXCERCISE_TEXT"),
                                  ALERGYSUBSTANCE_ID = p.IsNull("ALERGYSUBSTANCE_ID") ? 0 : p.Field<long>("ALERGYSUBSTANCE_ID"),
                                  ALERGYSUBSTANCE_TEXT = p.Field<string>("ALERGYSUBSTANCE_TEXT"),
                                  SMOKESUBSTANCE_ID = p.IsNull("SMOKESUBSTANCE_ID") ? 0 : p.Field<long>("SMOKESUBSTANCE_ID"),
                                  SMOKESUBSTANCE_TEXT = p.Field<string>("SMOKESUBSTANCE_TEXT"),
                                  ALCOHALSUBSTANCE_ID = p.IsNull("ALCOHALSUBSTANCE_ID") ? 0 : p.Field<long>("ALCOHALSUBSTANCE_ID"),
                                  ALCOHALSUBSTANCE_TEXT = p.Field<string>("ALCOHALSUBSTANCE_TEXT"),
                                  CAFFEINATED_BEVERAGESID = p.IsNull("CAFFEINATED_BEVERAGESID") ? 0 : p.Field<long>("CAFFEINATED_BEVERAGESID"),
                                  CAFFEINATEDBEVERAGES_TEXT = p.Field<string>("CAFFEINATEDBEVERAGES_TEXT"),
                                  EMERG_CONT_FIRSTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_FIRSTNAME")),
                                  EMERG_CONT_MIDDLENAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_MIDDLENAME")),
                                  EMERG_CONT_LASTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_LASTNAME")),
                                  EMERG_CONT_RELATIONSHIP_ID = p.IsNull("EMERG_CONT_RELATIONSHIP_ID") ? 0 : p.Field<long>("EMERG_CONT_RELATIONSHIP_ID"),
                                  GOOGLE_EMAILID = DecryptFields.Decrypt(p.Field<string>("Google_EmailId")),
                                  FB_EMAILID = DecryptFields.Decrypt(p.Field<string>("FB_EMAILID")),
                                  DIABETIC = p.IsNull("DIABETIC") ? 0 : p.Field<long>("DIABETIC"),
                                  HYPERTENSION = p.IsNull("HYPERTENSION") ? 0 : p.Field<long>("HYPERTENSION"),
                                  CHOLESTEROL = p.IsNull("CHOLESTEROL") ? 0 : p.Field<long>("CHOLESTEROL"),
                                  Diabetic_Option = p.Field<string>("Diabetic_Option"),
                                  HyperTension_Option = p.Field<string>("HyperTension_Option"),
                                  Cholesterol_Option = p.Field<string>("Cholestrol_Option"),
                                  Patient_Type = p.Field<int?>("Patient_Type"),
                                  Emergency_MobileNo = DecryptFields.Decrypt(p.Field<string>("EMRG_CONT_PHONENO")),
                                  Approval_flag = p.Field<int>("APPROVAL_FLAG"),
                                  Createdby_ShortName = p.Field<string>("SHORTNAME_CODE")
                              }).FirstOrDefault();
            if (View.DOB_Encrypt != "")
            {
                View.DOB = Convert.ToDateTime(View.DOB_Encrypt);
                /*string[] tokens = View.DOB_Encrypt.Split('/');
                View.DOB = new DateTime(int.Parse(tokens[2].Substring(0, 4)), int.Parse(tokens[0]), int.Parse(tokens[1]));*/
                //View.DOB= DateTime.ParseExact(View.DOB_Encrypt, "MM-dd-yyyy HH:mm:ss,fff", System.Globalization.CultureInfo.InvariantCulture);
            }
            if (View != null)
            {
                View.SelectedGroupList = USERGROUPDETAILS_VIEW(View.Id);
                if (View.Id > 0 && View.UserType_Id == 2)
                {
                    View.AddMedicines = Patient_CurrentMedicalDetails_View(View.Id);
                    View.AddMedicalHistory = Patient_PastMedicalDetails_View(View.Id);
                    View.AddHealthProblem = Patient_FamilyHistory_View(View.Id);
                    View.SelectedChronicConnditionList = Patient_ChronicCondition_View(View.Id);
                }
                else
                {
                    View.SelectedInstitutionList = User_InstitutionDetails_View(View.Id);
                    View.SelectedLanguageList = User_Languages_View(View.Id);
                }
            }
            else
            {
                View = new UserModel();
            }
            return View;
        }
        /// <summary>
        /// to add a new Group to a institution
        /// </summary>
        /// <param name="insobj">group details </param>
        /// <returns>status detail of group creation</returns>
        public GroupCreateModel GroupMaster_Insert(GroupCreateModel insobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", insobj.Id));
            param.Add(new DataParameter("@CreateGroupName", insobj.CreateGroupName));
            param.Add(new DataParameter("@INSTITUTION_ID", insobj.Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GROUPMASTER_SP_INSERT", param);
            GroupCreateModel Groupinsert = (from p in dt.AsEnumerable()
                                            select
                                            new GroupCreateModel()
                                            {
                                                Id = p.Field<long>("Id"),
                                                flag = p.Field<int>("flag")
                                            }).FirstOrDefault();
            return Groupinsert;
        }
        /// <summary>
        /// to add Group's to a patient/business user
        /// </summary>
        /// <param name="insobj">user and group details </param>
        /// <returns>status detail of group assigned to users</returns>
        public long AssignedGroup_Insert(List<AssignedGroupModel> obj)
        {
            long retid;
            foreach (AssignedGroupModel item in obj)
            {
                List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", item.Id));
                param.Add(new DataParameter("@UserId", item.User_Id));
                param.Add(new DataParameter("@GroupId", item.Group_Id));
                _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
                try
                {
                    retid = ClsDataBase.Insert("[MYCORTEX].PATIENT_SP_GROUPINSERT", param, true);
                }
                catch (Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                    return 0;
                }
            }
            return 1;
        }
        /// <summary>
        /// to get User Group details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Group details</returns>
        public IList<UserGroupDetails_List> USERGROUPDETAILS_VIEW(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERGROUPDETAILS_SP_VIEW", param);
            List<UserGroupDetails_List> INS = (from p in dt.AsEnumerable()
                                               select new UserGroupDetails_List()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   User_Id = p.Field<long>("UserId"),
                                                   Group_Id = p.Field<long>("Group_Id")
                                               }).ToList();
            return INS;
        }
        /// <summary>
        /// to get User Institution details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Institution details</returns>
        public IList<UserInstitutionDetails_List> User_InstitutionDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].BUSINESSUSER_SP_VIEW_INSTITUTIION", param);
            List<UserInstitutionDetails_List> INS = (from p in dt.AsEnumerable()
                                                     select new UserInstitutionDetails_List()
                                                     {
                                                         Id = p.Field<long>("Id"),
                                                         User_Id = p.Field<long>("UserId"),
                                                         Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                         Institution = p.Field<string>("Institution")
                                                     }).ToList();
            return INS;
        }
        /// <summary>
        /// to get User Language details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Language details</returns>
        public IList<UserLangaugeDetails_List> User_Languages_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].BUSINESSUSER_SP_VIEW_LANGUAGESKNOWN", param);
            List<UserLangaugeDetails_List> INS = (from p in dt.AsEnumerable()
                                                  select new UserLangaugeDetails_List()
                                                  {
                                                      Id = p.Field<long>("Id"),
                                                      User_Id = p.Field<long>("UserId"),
                                                      Language_Id = p.Field<long>("LANGUAGES_ID"),
                                                      Language = p.Field<string>("LanguageKnown")
                                                  }).ToList();
            return INS;
        }
        /// <summary>
        /// to get User Chrnic Condition details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Chronic Condition details</returns>
        public IList<PatientChronicCondition_List> Patient_ChronicCondition_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_SP_VIEW_CHRONICCONDITION", param);
            List<PatientChronicCondition_List> INS = (from p in dt.AsEnumerable()
                                                      select new PatientChronicCondition_List()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          User_Id = p.Field<long>("UserId"),
                                                          Chronic_Id = p.Field<long>("CHRONIC_ID"),
                                                          ChronicCondition = p.Field<string>("ChronicCondition")
                                                      }).ToList();
            return INS;
        }
        /// <summary>
        /// to get User Current Medical details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Current medical details</returns>
        public IList<Patient_CurrentMedicalDetails> Patient_CurrentMedicalDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_SP_VIEW_CURRENTMEDICALDETAILS", param);
            List<Patient_CurrentMedicalDetails> View = (from p in dt.AsEnumerable()
                                                        select new Patient_CurrentMedicalDetails()
                                                        {
                                                            Id = p.Field<long>("Id"),
                                                            User_Id = p.Field<long?>("UserId"),
                                                            MedicineName = p.Field<string>("MedicineName"),
                                                            Remarks = p.Field<string>("Remarks"),
                                                            Status = p.Field<int>("Status")
                                                        }).ToList();
            return View;
        }
        /// <summary>
        /// to get User Past Medical details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Past Medical details</returns>
        public IList<Patient_PastMedicalDetails> Patient_PastMedicalDetails_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_SP_VIEW_PASTMEDICALDETAILS", param);
            List<Patient_PastMedicalDetails> View = (from p in dt.AsEnumerable()
                                                     select new Patient_PastMedicalDetails()
                                                     {
                                                         Id = p.Field<long>("Id"),
                                                         User_Id = p.Field<long?>("UserId"),
                                                         Medical_History = p.Field<string>("MedicineName"),
                                                         Remarks = p.Field<string>("Remarks"),
                                                         Status = p.Field<int>("Status")
                                                     }).ToList();
            return View;
        }
        /// <summary>
        /// to get User Family History details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User Family History details</returns>
        public IList<Patient_FamilyHeealthHistoryDetails> Patient_FamilyHistory_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_SP_VIEW_FAMILYHEALTHPROBLEM", param);
            List<Patient_FamilyHeealthHistoryDetails> View = (from p in dt.AsEnumerable()
                                                              select new Patient_FamilyHeealthHistoryDetails()
                                                              {
                                                                  Id = p.Field<long>("Id"),
                                                                  User_Id = p.Field<long?>("UserId"),
                                                                  Relationship_Id = p.Field<long?>("Relationship_Id"),
                                                                  Relationship_Name = p.Field<string>("Relationship_Name"),
                                                                  Health_Problem = p.Field<string>("HealthProblem"),
                                                                  Remarks = p.Field<string>("Remarks"),
                                                                  Status = p.Field<int>("Status")
                                                              }).ToList();
            return View;
        }
        /// <summary>
        /// to deactivate a User
        /// </summary>
        /// <param name="Id">User id</param>
        /// <returns>success status of user deactivated</returns>
        public void UserDetails_InActive(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            ClsDataBase.Update("[MYCORTEX].USERDETAILS_SP_INACTIVE", param);
        }
        /// <summary>
        /// to activate a user
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>success status of user activated</returns>
        public UserReturnModel UserDetails_Active(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERDETAILS_SP_ACTIVE", param);
            UserReturnModel Active = (from p in dt.AsEnumerable()
                                      select new UserReturnModel()
                                      {
                                          ReturnFlag = p.Field<int>("flag"),
                                      }).FirstOrDefault();
            return Active;
        }
        /// <summary>
        /// Patient Basic detail of a Patient
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>Patient Basic detail of a Patient</returns>
        public ItemizedUserDetailsModel PatientBasicDetailsList(long PatientId)
        {
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@PATIENTID", PatientId));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].LIFESTYLE_SP_PATIENTDETAILSLIST", param);

            DataEncryption DecryptFields = new DataEncryption();
            ItemizedUserDetailsModel list = (from p in dt.AsEnumerable()
                              select
                              new ItemizedUserDetailsModel()

                              {
                                  PatientId = p.Field<long>("ID"),
                                  MNR_NO = DecryptFields.Decrypt(p.Field<string>("MRN_NO")),
                                  NATIONALID = DecryptFields.Decrypt(p.Field<string>("NATIONALID")),
                                  DOB = p.Field<DateTime?>("DOB"),
                                  DOB_Encrypt = DecryptFields.Decrypt(p.Field<string>("DOB_Encrypt")),
                                  MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")),
                                  FullName = DecryptFields.Decrypt(p.Field<string>("FullName")),
                                  Photo = p.Field<string>("PHOTO_NAME"),
                                  FileName = p.Field<string>("PHOTO_FULLPATH"),
                                  Photo_Fullpath = p.Field<string>("PHOTO_FILENAME"),
                                  GENDER_NAME = p.Field<string>("GENDER_NAME"),
                                  GENDER_ID = p.Field<long>("GenderId"),
                                  Protocol_Id = p.Field<long?>("MONITORING_PROTOCOL_ID"),
                                  ProtocolName = p.Field<string>("NAME"),
                                  Patient_Type = p.Field<int?>("PATIENT_TYPE"),
                                  

                              }).FirstOrDefault();
            if (list.DOB_Encrypt != "")
            {
                list.DOB = Convert.ToDateTime(list.DOB_Encrypt);
                /*string[] tokens = list.DOB_Encrypt.Split('/');
                list.DOB = new DateTime(int.Parse(tokens[2].Substring(0, 4)), int.Parse(tokens[0]), int.Parse(tokens[1]));*/
            }
            return list;
        }

        /// <summary>
        /// Patient group name list
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        public IList<ItemizedUserDetailsModel> PatientGroupNameList(long? PatientId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@UserId", PatientId));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_GROUPDETAILS_SP_LIST]", param);
            List<ItemizedUserDetailsModel> list = (from p in dt.AsEnumerable()
                                    select new ItemizedUserDetailsModel()
                                    {

                                        Group_Id = p.Field<long>("ID"),
                                        PatientId = p.Field<long>("USERID"),
                                        GroupName = p.Field<string>("GROUP_NAME"),

                                    }).ToList();
            return list;
        }

        /// <summary>
        /// patient's allergy list for patient data page
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>patient's allergy list</returns>
        public IList<PatientAllergiesNameListModels> PatientAllergiesNameList(long? PatientId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@UserId", PatientId));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ALLERGIESDETAILS_SP_LIST", param);
            List<PatientAllergiesNameListModels> list = (from p in dt.AsEnumerable()
                                                         select new PatientAllergiesNameListModels()
                                                         {
                                                             AllergyDetailsId = p.Field<long?>("ID"),
                                                             UserId = p.Field<long?>("PATIENT_ID"),
                                                             AllergyName = p.Field<string>("ALLERGYNAME"),
                                                             ActiveTo = p.Field<DateTime?>("ACTIVE_TO"),
                                                             IsActive = p.Field<int>("ISACTIVE"),
                                                         }).ToList();
            return list;
        }

        /// <summary>
        /// Patient Health Data List of a Patient for the selected option
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="OptionType_Id">Daily(1), 1 Week(2), 1 Month(3), 3 Month(4), 1 Year(5), Year Till Date(6) and All(7)</param>
        /// <returns>List of Health Data</returns>
        public IList<PatientHealthDataModel> HealthDataDetails_List(long Patient_Id, long OptionType_Id, long Group_Id, long UnitsGroupType, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENTID", Patient_Id));
            param.Add(new DataParameter("@TYPE", OptionType_Id));
            param.Add(new DataParameter("@PARAMGROUP_ID", Group_Id));
            param.Add(new DataParameter("@UNITSGROUP_ID", UnitsGroupType));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTHEALTHDATA_SP_LISTS]", param);
            DataEncryption DecryptFields = new DataEncryption();
            List<PatientHealthDataModel> list = (from p in dt.AsEnumerable()
                                                 select new PatientHealthDataModel()
                                                 {
                                                     ParameterId = p.Field<long>("PARAMETER"),
                                                     ParameterName = p.Field<string>("PARAMETERNAME"),
                                                     XAxis = p.Field<string>("xaxis") ?? "",
                                                     // Average = p.IsNull("PARAM_AVG") ? 0 : p.Field<decimal>("PARAM_AVG"),
                                                     UOM_Name = p.Field<string>("UNITNAME") ?? "",
                                                     Activity_Date = p.Field<DateTime>("ACTIVITYDATE"),
                                                     Activity_DateTime = p.Field<DateTime>("ACTIVITY_DATETIME"),
                                                     ParameterValue = p.IsNull("PARAMETERVALUE") ? 0 : p.Field<decimal>("PARAMETERVALUE"),
                                                     Id = p.Field<long>("LIFESTYLEID"),
                                                     IsActive = p.Field<int>("ISACTIVE"),
                                                     DeviceType = p.Field<string>("DeviceType"),
                                                     DeviceNo = p.Field<string>("Device_No"),
                                                     TypeName = p.Field<string>("TYPENAME") ?? "",
                                                     //Createdby_FullName = p.Field<string>("CREATEDBY_FULLNAME"),
                                                     Createdby_FullName = DecryptFields.Decrypt(p.Field<string>("CREATEDBY_FULLNAME")),
                                                     Createdby_ShortName = p.Field<string>("CREATEDBY_SHORTNAME") ?? "",
                                                     Created_Dt = p.Field<DateTime>("CREATED_DT")
                                                 }).ToList();
            return list;
        }

        /// <summary>
        /// Patient Health Data List of a Patient for the selected option
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="OptionType_Id">Daily(1), 1 Week(2), 1 Month(3), 3 Month(4), 1 Year(5), Year Till Date(6) and All(7)</param>
        /// <returns>List of Health Data</returns>
        public IList<PatientHealthDataModel> PatientLiveData_List(long Patient_Id, DateTime DataTime, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENTID", Patient_Id));
            param.Add(new DataParameter("@LIVEDATA_FROM", DataTime));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_HEALTHDATA_SP_LIVEDATA]", param);
            DataEncryption DecryptFields = new DataEncryption();
            List<PatientHealthDataModel> list = (from p in dt.AsEnumerable()
                                                 select new PatientHealthDataModel()
                                                 {
                                                     ParameterId = p.Field<long>("PARAMETER"),
                                                     ParameterName = p.Field<string>("PARAMETERNAME"),
                                                     UOM_Name = p.Field<string>("UNITNAME") ?? "",
                                                     Activity_Date = p.Field<DateTime>("ACTIVITYDATE"),
                                                     Activity_DateTime = p.Field<DateTime>("ACTIVITY_DATETIME"),
                                                     Average = p.IsNull("AVERAGE") ? 0 : p.Field<decimal>("AVERAGE"),
                                                     ParameterValue = p.IsNull("PARAMETERVALUE") ? 0 : p.Field<decimal>("PARAMETERVALUE"),
                                                     DeviceType = p.Field<string>("DeviceType"),
                                                     DeviceNo = p.Field<string>("Device_No"),
                                                     Createdby_FullName = DecryptFields.Decrypt(p.Field<string>("CREATEDBY_FULLNAME")),
                                                     Createdby_ShortName = p.Field<string>("CREATEDBY_SHORTNAME"),
                                                     Type_Id = p.Field<int>("TYPE_REF"),
                                                     LiveData_Blob = p.IsNull("PARAMETERVALUE") ? null : p.Field<byte[]>("BLOBDATA"),
                                                     TypeName = p.Field<string>("TYPENAME"),
                                                     HighCount = p.Field<int?>("HighCount"),
                                                     MediumCount = p.Field<int?>("MediumCount"),
                                                     LowCount = p.Field<int?>("LowCount"),
                                                 }).ToList();
            return list;
        }

        /// <summary>
        /// Daily Target vs Achieved details of a Patient
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns>List of Health Data for today</returns>
        public IList<PatientHealthDataModel> GoalDataDetails_List(long Patient_Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENTID", Patient_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTGOALDATA_SP_LIST]", param);
            List<PatientHealthDataModel> list = (from p in dt.AsEnumerable()
                                                 select new PatientHealthDataModel()
                                                 {

                                                     ParameterId = p.Field<long>("ParameterId"),
                                                     ParameterName = p.Field<string>("PARAMNAME"),
                                                     ParameterTarget = p.IsNull("AVERAGE") ? 0 : p.Field<decimal>("AVERAGE"),
                                                     ParameterValue = p.IsNull("PARAMETERVALUE") ? 0 : p.Field<decimal>("PARAMETERVALUE"),
                                                     Group_Id = p.Field<long>("GROUP_ID"),
                                                     Group_Name = p.Field<string>("GROUPNAME"),
                                                     Activity_Date = p.Field<DateTime>("ACTIVITYDATE")
                                                 }).ToList();
            return list;
        }

        /// <summary>
        /// Parameter list master
        /// </summary>
        /// <returns>List of Parameter list JSON</returns>
        public IList<MasterListModel> GetParameterNameList()
        {
            List<DataParameter> param = new List<DataParameter>();
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PARAMETERMASTER_SP_LIST");
            List<MasterListModel> list = (from p in dt.AsEnumerable()
                                          select new MasterListModel()
                                          {
                                              Id = p.Field<long>("ID"),
                                              Name = p.Field<string>("NAME"),
                                              IsActive = p.Field<int>("ISACTIVE")
                                          }).ToList();
            return list;
        }
        /// <summary>
        /// Insert Patient Health Data
        /// </summary>
        /// <param name="patientDataObj">Required Params: PatientId, ParameterId, ParameterValue, ActivityDate</param>
        /// <returns>inserted Health Data</returns>
        public PatientHealthDataModel PatientHealthData_Insert_Update(Guid Login_Session_Id, PatientHealthDataModel insobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", insobj.Id));
            param.Add(new DataParameter("@PATIENTID", insobj.Patient_Id));
            param.Add(new DataParameter("@PARAMETERID", insobj.ParameterId));
            param.Add(new DataParameter("@PARAMETERVALUE", insobj.ParameterValue));
            param.Add(new DataParameter("@ACTIVTY_DATE", insobj.Activity_Date));
            if (insobj.Id > 0)
            {
                param.Add(new DataParameter("@CREATEDBY", insobj.Modified_By));
            }
            else
            {
                param.Add(new DataParameter("@CREATEDBY", insobj.Created_By));
            }
            param.Add(new DataParameter("@DEVICETYPE", insobj.DeviceType));
            param.Add(new DataParameter("@DEVICE_NO", insobj.DeviceNo));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            //param.Add(new DataParameter("@MODIFIEDBY", insobj.Created_By));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTDATA_SP_INSERTUPDATE", param);
            PatientHealthDataModel list = (from p in dt.AsEnumerable()
                                           select new PatientHealthDataModel()
                                           {
                                               Patient_Id = p.Field<long>("PATIENT_ID"),
                                               ParameterId = p.Field<long>("PARAMETER_ID"),
                                               ParameterValue = p.IsNull("PARAMETERVALUE") ? 0 : p.Field<decimal>("PARAMETERVALUE"),
                                               Activity_Date = p.Field<DateTime>("ACTIVITY_DATE"),
                                               flag = p.Field<int>("flag"),
                                               DeviceType = p.Field<string>("DeviceType"),
                                               DeviceNo = p.Field<string>("Device_No"),
                                               Id = p.Field<long>("Id"),
                                               Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                           }).FirstOrDefault();
            return list;
        }
        /// <summary>
        /// to Insert/Update the Sign up Users, Hospital Admin and Business Users for a Institution
        /// </summary>
        /// <param name="userObj">User Information</param>
        /// <returns>Status message with inserted/updated user information</returns>
      //  public UserModel GetInstitutionForWebURL(string request)
        public long GetInstitutionForWebURL(string request)
        {
             long INSTITUTION_ID ;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@WEB_URL", request));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_SP_GET_INSTITUTION]", param);
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                /*   UserModel View = (from p in dt.AsEnumerable()
                                     select
                                     new UserModel()
                                     {
                                         INSTITUTION_ID = p.IsNull("Id") ? 0 : p.Field<long>("Id")
                                     }).FirstOrDefault();*/
                INSTITUTION_ID = dr.IsNull("Id") ? 0 : dr.Field<long>("Id");
            } else
            {
                INSTITUTION_ID = 0;
            }
            var data = (Convert.ToInt64(INSTITUTION_ID));
            return data;
            //DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ICD10DETAILS_SP_INSERTUPDATE", param);
            //DataRow dr = dt.Rows[0];
            //flag = (dr["FLAG"].ToString());
        }

        public long GetInstitutionFromShortName(string INSTITUTION_CODE)
        {
            long INSTITUTION_ID;
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@INSTITUTION_CODE", INSTITUTION_CODE));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_SP_GET_INSTITUTIONBYCODE]", param);
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                /*   UserModel View = (from p in dt.AsEnumerable()
                                     select
                                     new UserModel()
                                     {
                                         INSTITUTION_ID = p.IsNull("Id") ? 0 : p.Field<long>("Id")
                                     }).FirstOrDefault();*/
                INSTITUTION_ID = dr.IsNull("Id") ? 0 : dr.Field<long>("Id");
            }
            else
            {
                INSTITUTION_ID = 0;
            }
            var data = (Convert.ToInt64(INSTITUTION_ID));
            return data;
            //DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ICD10DETAILS_SP_INSERTUPDATE", param);
            //DataRow dr = dt.Rows[0];
            //flag = (dr["FLAG"].ToString());
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns></returns>
        public IList<PatientAppointmentsModel> PatientAppointmentList(long PatientId, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Patient_Id", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENTAPPOINTMENTS_SP_LIST]", param);
                DataEncryption DecryptFields = new DataEncryption();
                DataEncryption decrypt = new DataEncryption();
                List<PatientAppointmentsModel> lst = (from p in dt.AsEnumerable()
                                                      select new PatientAppointmentsModel()
                                                      {
                                                          Patient_Id = p.Field<long>("PATIENT_ID"),
                                                          Appointment_FromTime = p.Field<DateTime>("APPOINTMENT_FROMTIME"),
                                                          Appointment_ToTime = p.Field<DateTime>("APPOINTMENT_TOTIME"),
                                                          DoctorName = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                                          PatientName = DecryptFields.Decrypt(p.Field<string>("PATIENTNAME")),
                                                          //PatientName = p.Field<string>("PATIENTNAME"),
                                                          //DoctorName = p.Field<string>("DOCTORNAME"),
                                                          Appointment_Date = p.Field<DateTime>("APPOINTMENT_DATE"),
                                                          //Photo = p.Field<string>("PHOTO_NAME"),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          TimeDifference = p.Field<string>("TimeDifference"),
                                                          Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                          Id = p.Field<long>("Id"),
                                                          Doctor_DepartmentName = p.Field<string>("DEPARTMENT_NAME"),
                                                          ViewGenderName = p.Field<string>("GENDER_NAME"),
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
        /// Parameter list of a patient
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        public IList<ParametersListModel> GroupParameterNameList(long Patient_Id, long UnitGroupType_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@ParamGroup_Id", Group_Id));
            param.Add(new DataParameter("@Patient_Id", Patient_Id));
            param.Add(new DataParameter("@UNITSGROUP_ID", UnitGroupType_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[INSTITUTIONGROUPBASED_SP_PARAMETER]", param);
            List<ParametersListModel> list = (from p in dt.AsEnumerable()
                                              select new ParametersListModel()
                                              {

                                                  Group_Id = p.Field<long>("PARAMGROUP_ID"),
                                                  ParameterId = p.Field<long>("PARAMETER_ID"),
                                                  ParameterName = p.Field<string>("PARAMETERNAME"),
                                                  Group_Name = p.Field<string>("PARAMGROUPNAME"),
                                                  Max_Possible = p.IsNull("MAX_POSSIBLE") ? 0 : p.Field<decimal>("MAX_POSSIBLE"),
                                                  Min_Possible = p.IsNull("MIN_POSSIBLE") ? 0 : p.Field<decimal>("MIN_POSSIBLE"),
                                                  Average = p.IsNull("AVERAGE") ? 0 : p.Field<decimal>("AVERAGE"),
                                                  ParameterHas_Child = p.Field<int?>("HASCHILD"),
                                                  ParameterParent_Id = p.Field<int?>("PARENT_ID"),
                                                  UOM_Id = p.Field<long>("UOM_ID"),
                                                  UOM_Name = p.Field<string>("UOM_NAME"),
                                                  Range_Max = p.IsNull("NORMALRANGE_HIGH") ? 0 : p.Field<decimal>("NORMALRANGE_HIGH"),
                                                  Range_Min = p.IsNull("NORMALRANGE_LOW") ? 0 : p.Field<decimal>("NORMALRANGE_LOW"),
                                                  IsFormulaParam = p.Field<int>("FORMULAPARAM")

                                              }).ToList();
            return list;
        }

        /// <summary>
        /// Parameters - Parameters Details List - Action - Inactive
        /// Selected Parameters details to be deactivated  by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Parameters details to inactivate from Parameters database</returns>
        public IList<PatientHealthDataModel> ParametersDetails_Delete(PatientHealthDataModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTPARAMETER_SP_INACTIVE", param);
                IList<PatientHealthDataModel> list = (from p in dt.AsEnumerable()
                                                      select new PatientHealthDataModel()
                                                      {
                                                          flag = p.Field<int>("flag")
                                                      }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// Parameters - Parameters Details List - Action - Active
        /// activate Selected Parameters (LS,  details 
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Parameters details to activate again from Parameters database</returns>
        public IList<PatientHealthDataModel> ParametersDetails_Active(PatientHealthDataModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTPARAMETER_SP_ACTIVE", param);
                IList<PatientHealthDataModel> list = (from p in dt.AsEnumerable()
                                                      select new PatientHealthDataModel()
                                                      {
                                                          flag = p.Field<int>("flag")
                                                      }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /* This is for Delete Parameters Details */
        //public void ParametersDetails_Delete(long Id)
        //{
        //    List<DataParameter> param = new List<DataParameter>();
        //    param.Add(new DataParameter("@Id", Id));
        //    ClsDataBase.Update("[MYCORTEX].PATIENTPARAMETER_SP_INACTIVE", param);
        //}

        ///* This is for Delete Parameters  Details */
        //public void ParametersDetails_Active(long Id)
        //{
        //    List<DataParameter> param = new List<DataParameter>();
        //    param.Add(new DataParameter("@Id", Id));
        //    ClsDataBase.Update("[MYCORTEX].PATIENTPARAMETER_SP_ACTIVE", param);

        //}

        /// <summary>
        /// to attach photo or certificate of user
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Photo"></param>
        /// <param name="Certificate"></param>
        /// <returns></returns>
        public void UserDetails_PhotoUpload(byte[] imageFile, int Id)
        {
            DataEncryption encrypt = new DataEncryption();

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            //param.Add(new DataParameter("@BLOBDATA", encrypt.EncryptFile(imageFile)));
            if (imageFile != null)
            {
                param.Add(new DataParameter("@BLOBDATA", encrypt.EncryptFile(imageFile)));
            }
            else
            {
                param.Add(new DataParameter("@BLOBDATA", null));
            }
            ClsDataBase.Update("[MYCORTEX].TBLUPLOADUSER_SP_INSERTUPDATE", param);

        }


        public void UserDetails_PhotoImageCompress(byte[] imageFile,byte[] imageFile1, int Id,int Created_By)
        {
            DataEncryption encrypt = new DataEncryption();

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            //param.Add(new DataParameter("@BLOBDATA", encrypt.EncryptFile(imageFile)));
            if (imageFile != null)
            {
                param.Add(new DataParameter("@PHOTOBLOB_LOW", encrypt.EncryptFile(imageFile)));
                param.Add(new DataParameter("@PHOTOBLOB_THUMB", encrypt.EncryptFile(imageFile1)));
                param.Add(new DataParameter("@CREATED_BY", Created_By));
            }
            else
            {
                param.Add(new DataParameter("@PHOTOBLOB_LOW", null));
                param.Add(new DataParameter("@PHOTOBLOB_THUMB", null));
                param.Add(new DataParameter("@CREATED_BY", null));
            }
            ClsDataBase.Update("[MYCORTEX].TBLIMAGECOMPRESSUSER_SP_INSERTUPDATE", param);

        }

        /// <summary>
        /// to attach photo or certificate of user
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Photo"></param>
        /// <param name="Certificate"></param>
        /// <returns></returns>
        public void UserDetails_CertificateUpload(byte[] imageFile, int Id)
        {
            DataEncryption encrypt = new DataEncryption();

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            //param.Add(new DataParameter("@BLOBDATA", encrypt.EncryptFile(imageFile)));
            if (imageFile != null)
            {
                param.Add(new DataParameter("@BLOBCERTIFICATE", encrypt.EncryptFile(imageFile)));
            }
            else
            {
                param.Add(new DataParameter("@BLOBCERTIFICATE", null));
            }
            ClsDataBase.Update("[MYCORTEX].TBLCERTIFICATEUSER_SP_INSERTUPDATE", param);

        }

        /// <summary>
        /// to get photo of a business user/patient
        /// </summary>
        /// <param name="Id">User Id
        public PhotoUploadModal UserDetails_GetPhoto(int Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLUPLOADUSRE_SP_GETPHOTO", param);
            //  byte[] returnPhoto = (byte[])dt.Rows[0]["Id"];
            if (!Convert.IsDBNull(dt.Rows[0]["BLOBDATA"]))
            {
                byte[] returnPhoto = (byte[])dt.Rows[0]["BLOBDATA"];

                return new PhotoUploadModal
                {
                    Id = Id,
                    PhotoBlob = decrypt.DecryptFile(returnPhoto)
                };

                //return decrypt.DecryptFile(returnPhoto);
            }
            else
            {
                return new PhotoUploadModal
                {
                };
            }
        }

        /// <summary>
        /// to get document blob of a business user / patient
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns></returns>
        public PhotoUploadModal UserDetails_GetCertificate(long Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].TBLUPLOADUSRE_SP_GETCERTIFICATE", param);
            //  byte[] returnPhoto = (byte[])dt.Rows[0]["Id"];
            if (!Convert.IsDBNull(dt.Rows[0]["CERTIFICATEBLOBDATA"]))
            {
                byte[] returnCertificate = (byte[])dt.Rows[0]["CERTIFICATEBLOBDATA"];
                string FileName = (string)dt.Rows[0]["FILE_NAME"];

                return new PhotoUploadModal
                {
                    Id = Id,
                    CertificateBlob = decrypt.DecryptFile(returnCertificate),
                    FileName = FileName
                };

                //return decrypt.DecryptFile(returnPhoto);
            }
            else
            {
                return new PhotoUploadModal
                {
                };
            }
        }


        /// <summary>      
        /// to get the monitoring protocol name assigned to a patient
        /// </summary>      
        /// <param name="Id">Id of a Protocol</param>        
        /// <returns>monitoring protocol detail name assigned to a patient</returns>
        public IList<ProtocolModel> DoctorMonitoringProtocolView(long Patient_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Patient_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOL_MONITORING_SP_VIEW", param);
                List<ProtocolModel> INS = (from p in dt.AsEnumerable()
                                           select
                                           new ProtocolModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               Protocol_Id = p.Field<long?>("PROTOCOL_ID"),
                                               ProtocolName = p.Field<string>("PROTOCOLNAME"),
                                               Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                               Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                               Parameter_Id = p.Field<long?>("PARAMETER_ID"),
                                               ParameterName = p.Field<string>("PARAMETERNAME"),
                                               Units_Id = p.Field<long?>("UNITS_ID"),
                                               UnitsName = p.Field<string>("UNITSNAME"),
                                               Com_DurationType = p.Field<long?>("COM_DURATIONTYPE"),
                                               DurationName = p.Field<string>("DURATIONNAME"),
                                               Diag_HighMax_One = p.Field<decimal?>("DIAG_HIGHMAX_ONE"),
                                               Diag_HighMin_One = p.Field<decimal?>("DIAG_HIGHMIN_ONE"),
                                               Diag_MediumMax_One = p.Field<decimal?>("DIAG_MEDIUMMAX_ONE"),
                                               Diag_MediumMin_One = p.Field<decimal?>("DIAG_MEDIUMMIN_ONE"),
                                               Diag_LowMax_One = p.Field<decimal?>("DIAG_LOWMAX_ONE"),
                                               Diag_LowMin_One = p.Field<decimal?>("DIAG_LOWMIN_ONE"),
                                               Diag_HighMax_Two = p.Field<decimal?>("DIAG_HIGHMAX_TWO"),
                                               Diag_HighMin_Two = p.Field<decimal?>("DIAG_HIGHMIN_TWO"),
                                               Diag_MediumMax_Two = p.Field<decimal?>("DIAG_MEDIUMMAX_TWO"),
                                               Diag_MediumMin_Two = p.Field<decimal?>("DIAG_MEDIUMMIN_TWO"),
                                               Diag_LowMax_Two = p.Field<decimal?>("DIAG_LOWMAX_TWO"),
                                               Diag_LowMin_Two = p.Field<decimal?>("DIAG_LOWMIN_TWO"),
                                               Comp_Duration = p.Field<int?>("COMP_DURATION"),
                                               Comp_High = p.Field<int?>("COMP_HIGH"),
                                               Comp_Medium = p.Field<int?>("COMP_MEDIUM"),
                                               Comp_Low = p.Field<int?>("COMP_LOW"),
                                               //  ISACTIVE = p.Field<int?>("ISACTIVE"),
                                               Created_By = p.Field<long>("CREATED_BY"),
                                               NormalRange_High = p.Field<decimal?>("NORMALRANGE_HIGH"),
                                               NormalRange_Low = p.Field<decimal?>("NORMALRANGE_LOW"),
                                           }).ToList();
                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// to get the monitoring protocol detail assigned to a patient
        /// </summary>      
        /// <param name="Id">Id of a Protocol</param>        
        /// <returns>monitoring protocol detail detail assigned to a patient</returns>
        public MonitoringProtocolModel ProtocolMonitoringProtocolView(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PROTOCOLDETAILS_MONITORING_SP_VIEW", param);
                MonitoringProtocolModel INS = (from p in dt.AsEnumerable()
                                               select
                                               new MonitoringProtocolModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   Institution_Id = p.Field<long?>("INSTITUTION_ID"),
                                                   Institution_Name = p.Field<string>("INSTITUTION_NAME"),
                                                   Protocol_Name = p.Field<string>("PROTOCOL_NAME"),
                                                   IsActive = p.Field<int>("ISACTIVE"),
                                                   Created_By = p.Field<long>("CREATED_BY"),
                                               }).FirstOrDefault();
                INS.ChildModuleList = DoctorMonitoringProtocolView(INS.Id);
                return INS;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to get appointment history for a patient
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>appointment history for a patient</returns>
        public IList<PatientAppointmentsModel> DoctorAppoinmentHistoryList(long PatientId, Guid Login_Session_Id)
        {
            DataEncryption decrypt = new DataEncryption();
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENTID", PatientId));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DOCTORAPPOINMENTHISTORY_SP_VIEW", param);
                List<PatientAppointmentsModel> lst = (from p in dt.AsEnumerable()
                                                      select new PatientAppointmentsModel()
                                                      {
                                                          Id = p.Field<long>("Id"),
                                                          Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                          Patient_Id = p.Field<long>("PATIENT_ID"),
                                                          Doctor_Id = p.Field<long>("DOCTOR_ID"),
                                                          Appointment_Date = p.Field<DateTime>("APPOINTMENT_DATE"),
                                                          Appointment_FromTime = p.Field<DateTime>("APPOINTMENT_FROMTIME"),
                                                          Appointment_ToTime = p.Field<DateTime>("APPOINTMENT_TOTIME"),
                                                          Appointment_Type = p.Field<long>("APPOINTMENT_TYPE"),
                                                          ReasonForVisit = p.Field<string>("REASONFOR_VISIT"),
                                                          Remarks = p.Field<string>("REMARKS"),
                                                          // Status = p.Field<int>("STATUS"),
                                                          Cancelled_Date = p.Field<DateTime?>("CANCELED_DATE"),
                                                          Cancelled_Remarks = p.Field<string>("CANCEL_REMARKS"),
                                                          //IsActive = p.Field<int>("ISACTIVE"),
                                                          Created_By = p.Field<int>("CREATED_BY"),
                                                          DoctorName = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                                          PatientName = DecryptFields.Decrypt(p.Field<string>("PATIENTNAME")),
                                                          // DoctorName = p.Field<string>("DOCTORNAME"),
                                                          // PatientName = p.Field<string>("PATIENTNAME"),
                                                          // Created_By_Name = p.Field<string>("CREATEDBYNAME"),
                                                          Created_By_Name = DecryptFields.Decrypt(p.Field<string>("CREATEDBYNAME")),
                                                          PhotoBlob = p.IsNull("PHOTOBLOB") ? null : decrypt.DecryptFile(p.Field<byte[]>("PHOTOBLOB")),
                                                          Created_Dt = p.Field<DateTime>("CREATED_DT"),
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
        /// to insert the protocol assigned to a patient
        /// </summary>
        /// <param name="model">protocol and patient</param>
        /// <returns>inserted protocol assigned to a patient</returns>

        public void PatientAssignedProtocol_InsertUpdate(ProtocolModel prtobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", prtobj.PatientId));
            param.Add(new DataParameter("@MONITORING_PROTOCOL_ID", prtobj.Protocol_Id));
            param.Add(new DataParameter("@CREATED_BY", prtobj.Created_By));
            ClsDataBase.Insert("[MYCORTEX].PATIENTASSIGNEDPROTOCOL_SP_INSERTUPDATE", param);
        }


        /// <summary>
        /// monitoring protocol assigned history to a patient
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns>monitoring protocol assigned history list</returns>
        public IList<ProtocolModel> PatientAssignedProtocolHistorylist(long Patient_Id, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", Patient_Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ASSIGNEDPROTOCOL_HISTORY_SP_LIST", param);
            List<ProtocolModel> lst = (from p in dt.AsEnumerable()
                                       select new ProtocolModel()
                                       {
                                           Patient_Name = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                           //Patient_Name = p.Field<string>("FULLNAME"),
                                           ProtocolName = p.Field<string>("NAME"),
                                           Created_By = p.Field<long>("CREATED_BY"),
                                           Doctor_Name = DecryptFields.Decrypt(p.Field<string>("DOCTORNAME")),
                                           //Doctor_Name = p.Field<string>("DOCTORNAME"),
                                           Protocol_Assigned_On = p.Field<DateTime>("CREATED_ON")
                                       }).ToList();
            return lst;
        }

        /// <summary>
        /// ICD 10 Category name list
        /// </summary>
        /// <returns>ICD 10 Category name list</returns>
        public IList<MasterICDModel> ICD10CategoryList()
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ICD10_CATEGORYMASTER_SP_LIST");
                List<MasterICDModel> lst = (from p in dt.AsEnumerable()
                                            select new MasterICDModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                CategoryName = p.Field<string>("NAME"),
                                                IsActive = p.Field<int>("ISACTIVE")
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
        /// ICD 10 master list for a institution
        /// </summary>
        /// <param name="Institution_ID">Institution Id</param>
        /// <returns>ICD 10 master list for a institution</returns>
        public IList<MasterICDModel> ICD10CodeList(long Institution_ID)
        {
            List<DataParameter> paramm = new List<DataParameter>();
            _logger.Info(serializer.Serialize(paramm.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                paramm.Add(new DataParameter("@INSTITUTION_ID", Institution_ID));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ICD10_CODEMASTER_SP_LIST", paramm);
                List<MasterICDModel> lst = (from p in dt.AsEnumerable()
                                            select new MasterICDModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                Category_ID = p.IsNull("CATEGORY_ID") ? 0 : p.Field<long>("CATEGORY_ID"),
                                                ICD_Code = p.Field<string>("ICDCODE"),
                                                IsActive = p.Field<int>("ISACTIVE")
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
        /// to insert/update ICD 10 details to a patient
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public long PatientICD10Details_AddEdit(Guid Login_Session_Id, List<MasterICDModel> obj)
        {
            int insert;
            try
            {
                string flag = "";
                foreach (MasterICDModel item in obj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@PATIENT_ID", item.Patient_Id));
                    param.Add(new DataParameter("@CODE_ID", item.Code_ID));
                    param.Add(new DataParameter("@ICD10_REMARKS", item.Remarks));
                    param.Add(new DataParameter("@CREATED_BY", item.Created_By));
                    param.Add(new DataParameter("@ACTIVE_FROM", item.Active_From));
                    param.Add(new DataParameter("@ACTIVE_TO", item.Active_To));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ICD10DETAILS_SP_INSERTUPDATE", param);
                        DataRow dr = dt.Rows[0];
                        flag = (dr["FLAG"].ToString());

                    }

                }
                var data = (Convert.ToInt64(flag));
                return data;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);

            }
            return 0;
        }


        /// <summary>
        /// to insert/update ICD 10 details to a patient
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public string PatientICD10_Date_Overlapping(Guid Login_Session_Id,List<MasterICDModel> ICD10Groupobj)
        {
            try
            {
                string flag = null;
                string datalist = null;
                foreach (MasterICDModel item in ICD10Groupobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID ", item.Id));
                    param.Add(new DataParameter("@PATIENT_ID ", item.Patient_Id));
                    //param.Add(new DataParameter("@CATEGORY_ID ", item.Category_ID));
                    param.Add(new DataParameter("@CODE_ID", item.Code_ID));
                    param.Add(new DataParameter("@ACTIVE_FROM", item.Active_From));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    if (item.Active_To == null)
                    {
                        param.Add(new DataParameter("@ACTIVE_TO", ""));
                    }
                    else
                    {
                        param.Add(new DataParameter("@ACTIVE_TO", item.Active_To));
                    }
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ICD10_DATEOVERLAPPING", param);
                        DataRow dr = dt.Rows[0];
                        flag = dr["msg"].ToString();
                        datalist = (Convert.ToString(flag));
                        return datalist;
                    }
                }
                return datalist;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;

            }
        }

        /// <summary>
        /// ICD 10 details of a patient
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="Isactive"></param>
        /// <returns></returns>
        public IList<MasterICDModel> PatientICD10Details_List(long Patient_Id, int Isactive, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", Patient_Id));
            param.Add(new DataParameter("@ISACTIVE", Isactive));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ICD10DETAILS_SP_LIST ", param);
            List<MasterICDModel> list = (from p in dt.AsEnumerable()
                                         select new MasterICDModel()
                                         {
                                             Id = p.Field<long>("ID"),
                                             CategoryName = p.Field<string>("CATEGORY_NAME"),
                                             ICD_Code = p.Field<string>("ICDCODE"),
                                             Description = p.Field<string>("ICD10_DESCRIPTION"),
                                             Doctor_Name = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                             Active_From = p.Field<DateTime?>("ACTIVE_FROM"),
                                             Active_To = p.Field<DateTime?>("ACTIVE_TO"),
                                             Remarks = p.Field<string>("ICD_REMARKS"),
                                             Created_By_Name = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                             Created_DT = p.Field<DateTime>("CREATED_DT"),
                                             IsActive = p.Field<int>("ISACTIVE")

                                         }).ToList();
            return list;
        }


        /// <summary>
        /// a selected Patient ICD 10 detail
        /// </summary>
        /// <param name="Id">Patient ICD 10 Id</param>
        /// <returns>selected Patient ICD 10 detail</returns>
        public MasterICDModel PatientICD10Details_View(long ID, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();

            param.Add(new DataParameter("@ID", ID));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ICD10DETAILS_SP_VIEW", param);
            MasterICDModel INS = (from p in dt.AsEnumerable()
                                  select
                                  new MasterICDModel()
                                  {
                                      Id = p.Field<long>("ID"),
                                      CategoryName = p.Field<string>("CATEGORY_NAME"),
                                      ICD_Code = p.Field<string>("ICDCODE"),
                                      Category_ID = p.Field<long?>("CATEGORY_ID"),
                                      Code_ID = p.Field<long>("CODE_ID"),
                                      Description = p.Field<string>("ICD10_DESCRIPTION"),
                                      Remarks = p.Field<string>("ICD_REMARKS"),
                                      Doctor_Name = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                      Active_From = p.Field<DateTime?>("ACTIVE_FROM"),
                                      Active_To = p.Field<DateTime?>("ACTIVE_TO"),

                                  }).FirstOrDefault();
            return INS;
        }
        /// <summary>
        /// ICD 10 master list based on ICD 10 search list
        /// </summary>
        /// <param name="ICD10CodeSearch"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<MasterICDModel> ICD10Code_List(string ICD10CodeSearch, long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ICD10CODESEARCH", ICD10CodeSearch));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ICD10CODE_SEARCH_SP_LIST]", param);
            List<MasterICDModel> list = (from p in dt.AsEnumerable()
                                         select new MasterICDModel()
                                         {
                                             Id = p.Field<long>("ID"),
                                             ICD_Code = p.Field<string>("ICDCODE"),
                                             CategoryName = p.Field<string>("CATEGORY_NAME"),
                                             Description = p.Field<string>("DESCRIPTION")

                                         }).ToList();
            return list;
        }


        /// <summary>
        /// to deactivate a Patient ICD 10 detail
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public void PatientICD10Details_InActive(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            ClsDataBase.Update("[MYCORTEX].PATIENT_ICD10DETAILS_SP_INACTIVE", param);
        }

        /// <summary>
        /// to activate a Patient ICD 10 detail
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public void PatientICD10Details_Active(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", Id));
            ClsDataBase.Update("[MYCORTEX].PATIENT_ICD10DETAILS_SP_ACTIVE", param);
        }
        /// <summary>
        /// Drug Master list of a Institution based on search value
        /// </summary>
        /// <param name="DrugCodeSearch"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<DrugDBMasterModel> DrugCodeList()
        {
            List<DataParameter> param = new List<DataParameter>();
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].DRUGCODE_SP_LIST");
            List<DrugDBMasterModel> list = (from p in dt.AsEnumerable()
                                            select new DrugDBMasterModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                Drug_Code = p.Field<string>("DRUGCODE"),
                                                IsActive = p.Field<int>("ISACTIVE")
                                            }).ToList();
            return list;
        }

        /// <summary>
        /// Drug Master list of a institution and Drug Code
        /// </summary>
        /// <param name="DrugCodeId"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        public IList<DrugDBMasterModel> DrugCodeBased_DrugDetails(long DrugCodeId, long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@DRUGCODE_ID", DrugCodeId));
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DRUGCODEBASED_DRUGDETAILS]", param);
            List<DrugDBMasterModel> note = (from p in dt.AsEnumerable()
                                            select
                                            new DrugDBMasterModel()
                                            {
                                                DrugId = p.Field<long>("DRUGID"),
                                                Generic_name = p.Field<string>("GENERIC_NAME"),
                                                StrengthName = p.Field<string>("STRENGTHNAME"),
                                                Dosage_FromName = p.Field<string>("FORMNAME"),
                                                Item_Code = p.Field<string>("ITEMCODE"),
                                                IsActive = p.Field<int>("ISACTIVE")
                                            }).ToList();
            return note;
        }
        /// <summary>
        /// Drug route list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        public IList<DrugDBMasterModel> RouteList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ROUTEMASTER_SP_LIST", param);
            List<DrugDBMasterModel> list = (from p in dt.AsEnumerable()
                                            select new DrugDBMasterModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                RouteName = p.Field<string>("NAME"),
                                                IsActive = p.Field<int>("ISACTIVE")

                                            }).ToList();
            return list;
        }
        /// <summary>
        /// to get Frequency list of a Institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        public IList<DrugDBMasterModel> FrequencyList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].FREQUENCYDETAILS_SP_LIST", param);
            List<DrugDBMasterModel> list = (from p in dt.AsEnumerable()
                                            select new DrugDBMasterModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                FrequencyName = p.Field<string>("NAME"),
                                                IsActive = p.Field<int>("ISACTIVE")

                                            }).ToList();
            return list;
        }
        /// <summary>
        /// details of a selected frequency
        /// </summary>
        /// <param name="FrequencyId">Frequency Id</param>
        /// <returns>details of a selected frequency</returns>
        public DrugDBMasterModel FrequencybasedDetails(long FrequencyId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@FREQUENCY_ID", FrequencyId));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].FREQUENCYBASEDDERAILS_SP_LIST", param);
            DrugDBMasterModel list = (from p in dt.AsEnumerable()
                                      select new DrugDBMasterModel()
                                      {
                                          Id = p.Field<long>("ID"),
                                          RouteName = p.Field<string>("NAME"),
                                          NoOfDays = p.Field<decimal>("NOOFDAYS"),
                                          IsActive = p.Field<int>("ISACTIVE")

                                      }).FirstOrDefault();
            return list;
        }
        /// <summary>
        /// to insert/update Medication for a patient
        /// </summary>
        /// <param name="insobj">Medication details of a patient</param>
        /// <returns>inserted/updated Medication for a patient</returns>
        public long MedicationInsertUpdate(Guid Login_Session_Id,List<DrugDBMasterModel> insobj)
        {
            int insert;
            //long Inserted_AllergyReaction_Id;
            try
            {
                string flag = "";
                foreach (DrugDBMasterModel item in insobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@PATIENT_ID", item.PatientId));
                    param.Add(new DataParameter("@DRUGID", item.DrugId));
                    param.Add(new DataParameter("@FREQUENCYID", item.FrequencyId));
                    param.Add(new DataParameter("@ROUTEID", item.RouteId));
                    param.Add(new DataParameter("@NO_OF_DAYS", item.NoOfDays));
                    param.Add(new DataParameter("@STARTDATE", item.StartDate));
                    param.Add(new DataParameter("@ENDDATE", item.EndDate));
                    param.Add(new DataParameter("@CREATED_BY", item.Created_By));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    //param.Add(new DataParameter("@MODIFIED_BY", item.Created_By));
                    // flag = ClsDataBase.Insert("[MYCORTEX].PATIENT_MEDICATION_SP_INSERTUPDATE", param,true);
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_MEDICATION_SP_INSERTUPDATE", param);
                        DataRow dr = dt.Rows[0];
                        flag = (dr["FLAG"].ToString());
                    }
                }
                var data = (Convert.ToInt32(flag));
                return data;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);

            }
            return 0;
        }
        /// <summary>
        /// to insert/update Medication for a patient
        /// </summary>
        /// <param name="insobj">Medication details of a patient</param>
        /// <returns>inserted/updated Medication for a patient</returns>
        public string MedicationInsertUpdateDateOverLapping(Guid Login_Session_Id,List<DrugDBMasterModel> insobj)
        {
            try
            {
                string flag = null;
                string datalist = null;
                foreach (DrugDBMasterModel item in insobj)
                {
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@ID", item.Id));
                    param.Add(new DataParameter("@PATIENT_ID", item.PatientId));
                    param.Add(new DataParameter("@DRUGID", item.DrugId));
                    param.Add(new DataParameter("@STARTDATE", item.StartDate));
                    param.Add(new DataParameter("@ENDDATE", item.EndDate));
                    param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                    {
                        DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_MEDICATION_DATEOVERLAPPING", param);
                        DataRow dr = dt.Rows[0];
                        flag = dr["msg"].ToString();
                        datalist = (Convert.ToString(flag));
                        return datalist;
                    }
                }
                return datalist;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;

            }
        }

        /// <summary>
        /// Medication List of a Patient and Active flag
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="IsActive">Active flag</param>
        /// <returns></returns>
        public IList<DrugDBMasterModel> MedicationList(long Patient_Id, int IsActive, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", Patient_Id));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_MEDICATION_SP_LIST", param);
            DataEncryption DecryptFields = new DataEncryption();
            List<DrugDBMasterModel> lst = (from p in dt.AsEnumerable()
                                           select new DrugDBMasterModel()
                                           {
                                               Id = p.Field<long>("ID"),
                                               FrequencyName = p.Field<string>("FREQUENCYNAME"),
                                               RouteName = p.Field<string>("ROUTENAME"),
                                               Generic_name = p.Field<string>("GENERIC_NAME"),
                                               Drug_Code = p.Field<string>("DRUGCODE"),
                                               StartDate = p.Field<DateTime>("STARTDATE"),
                                               EndDate = p.Field<DateTime>("ENDDATE"),
                                               Item_Code = p.Field<string>("ITEMCODE"),
                                               StrengthName = p.Field<string>("STRENGTHNAME"),
                                               Dosage_FromName = p.Field<string>("DOSAGEFORMNAME"),
                                               NoOfDays = p.Field<decimal?>("NO_OF_DAYS"),
                                               Created_By_Name = DecryptFields.Decrypt(p.Field<string>("CREATEDBY")),
                                               Created_Dt = p.Field<DateTime>("CREATED_DT"),
                                               IsActive = p.Field<int>("ISACTIVE")

                                           }).ToList();

            return lst;
        }

        /// <summary>
        /// to deactivate a patient medication details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>deactivated patient medication detail</returns>
        public void MedicationDetails_InActive(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            ClsDataBase.Update("[MYCORTEX].[PATIENT_MEDICATION_SP_INACTIVE]", param);
        }

        /// <summary>
        /// to activate a patient medication details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>activated patient medication detail</returns>
        public void MedicationDetails_Active(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            ClsDataBase.Update("[MYCORTEX].[PATIENT_MEDICATION_SP_ACTIVE]", param);

        }
        /// <summary>
        /// Medication details of a selected Patient Medication
        /// </summary>
        /// <param name="Id">Patient medication Id</param>
        /// <returns>Medication details of a selected Patient Medication</returns>
        public DrugDBMasterModel MedicationView(long Id, Guid Login_Session_Id)
        {
            //long ViewId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_MEDICATION_SP_VIEW", param);
            DrugDBMasterModel View = (from p in dt.AsEnumerable()
                                      select
                                      new DrugDBMasterModel()
                                      {
                                          Id = p.Field<long>("ID"),
                                          FrequencyId = p.Field<long?>("FREQUENCYID"),
                                          FrequencyName = p.Field<string>("FREQUENCYNAME"),
                                          RouteId = p.Field<long?>("ROUTEID"),
                                          RouteName = p.Field<string>("ROUTENAME"),
                                          DrugId = p.Field<long?>("DRUGID"),
                                          Drug_Code = p.Field<string>("DRUGCODE"),
                                          StartDate = p.Field<DateTime>("STARTDATE"),
                                          EndDate = p.Field<DateTime>("ENDDATE"),
                                          Generic_name = p.Field<string>("GENERIC_NAME"),
                                          Item_Code = p.Field<string>("ITEMCODE"),
                                          StrengthName = p.Field<string>("STRENGTHNAME"),
                                          Dosage_FromName = p.Field<string>("DOSAGEFORMNAME"),
                                          NoOfDays = p.Field<decimal?>("NO_OF_DAYS")
                                      }).FirstOrDefault();
            return View;

        }

        /// <summary>
        /// Drug Master list of a Institution based on search value
        /// </summary>
        /// <param name="DrugCodeSearch"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<DrugDBMasterModel> DrugCodeList(string DrugCodeSearch, long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@DRUGSEARCH", DrugCodeSearch));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[DRUGCODE_SEARCH_SP_LIST]", param);
            List<DrugDBMasterModel> list = (from p in dt.AsEnumerable()
                                            select new DrugDBMasterModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                Drug_Code = p.Field<string>("DRUGCODE"),
                                                Generic_name = p.Field<string>("GENERIC_NAME"),
                                                Item_Code = p.Field<string>("ITEMCODE"),
                                                StrengthName = p.Field<string>("STRENGTH_NAME"),
                                                Dosage_FromName = p.Field<string>("DOSAGE_FORM")
                                            }).ToList();
            return list;
        }
        //For Allergy
        /// <summary>
        /// to get allergy type name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        public IList<AllergyTypeModel> AllergyTypeList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALERGYTYPE_SP_LIST", param);
            List<AllergyTypeModel> list = (from p in dt.AsEnumerable()
                                           select new AllergyTypeModel()
                                           {
                                               Id = p.Field<long>("Id"),
                                               AllergyTypeName = p.Field<string>("NAME"),
                                               IsActive = p.Field<int>("ISACTIVE")

                                           }).ToList();
            return list;
        }
        /// <summary>
        /// to get allergen name list of a Allergy Type and Institution
        /// </summary>
        /// <param name="ALLERGYTYPE_ID"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<AllergyenModel> AllergenList(long ALLERGYTYPE_ID, long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ALLERGYTYPEID", ALLERGYTYPE_ID));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALLERGEN_SP_LIST", param);
            List<AllergyenModel> list = (from p in dt.AsEnumerable()
                                         select new AllergyenModel()
                                         {
                                             Id = p.Field<long>("Id"),
                                             AllergenName = p.Field<string>("ALLERGENNAME"),
                                             IsActive = p.Field<int>("ISACTIVE"),
                                             AllergyTypeId = p.Field<long>("ALLERGYTYPE_ID")

                                         }).ToList();
            return list;
        }
        /// <summary>
        /// to get allergen onsert list of a Institution
        /// </summary>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<AllergyOnsetModel> AllergyOnsetList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALLERGYONSET_SP_LIST", param);
            List<AllergyOnsetModel> list = (from p in dt.AsEnumerable()
                                            select new AllergyOnsetModel()
                                            {
                                                Id = p.Field<long>("Id"),
                                                AllergyOnsetName = p.Field<string>("NAME"),
                                                IsActive = p.Field<int>("ISACTIVE")

                                            }).ToList();
            return list;
        }
        // <summary>
        /// to get allergen serverity list of a Institution
        /// </summary>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<AllergySeverityModel> AllergySeverityList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALLERGYSEVERITY_SP_LIST", param);
            List<AllergySeverityModel> list = (from p in dt.AsEnumerable()
                                               select new AllergySeverityModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   AllergySeverityName = p.Field<string>("NAME"),
                                                   IsActive = p.Field<int>("ISACTIVE")

                                               }).ToList();
            return list;
        }
        /// <summary>
        /// to get allergen reaction list of a Institution
        /// </summary>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<AllergyReactionModel> AllergyReactionList(long Institution_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Institution_Id", Institution_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALLERGYREACTION_SP_LIST", param);
            List<AllergyReactionModel> list = (from p in dt.AsEnumerable()
                                               select new AllergyReactionModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   AllergyReactionName = p.Field<string>("ALLERGYREACTIONNAME"),
                                                   IsActive = p.Field<int>("ISACTIVE")

                                               }).ToList();
            return list;
        }
        /// <summary>
        /// to insert/update allergy to a patient
        /// </summary>
        /// <param name="insobj">allergy detail model</param>
        /// <returns>inserted/updated allergy to a patient</returns>
        public IList<AllergyModel> Allergy_AddEdit(Guid Login_Session_Id, AllergyModel insobj)
        {
            var InsertId = "";
            long Inserted_AllergyReaction_Id;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", insobj.Id));
            param.Add(new DataParameter("@ALLERGEN_ID", insobj.AllergenId));
            param.Add(new DataParameter("@ALLERGYTYPE_ID", insobj.AllergyTypeId));
            param.Add(new DataParameter("@ONSET_ID", insobj.AllergyOnsetId));
            param.Add(new DataParameter("@SEVERITY_ID", insobj.AllergySeverityId));
            param.Add(new DataParameter("@ONSET_DATE", insobj.OnSetDate));
            param.Add(new DataParameter("@REMARKS", insobj.Remarks));
            param.Add(new DataParameter("@PATIENT_ID", insobj.Patient_Id));
            param.Add(new DataParameter("@CREATED_BY", insobj.Created_By));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            //param.Add(new DataParameter("@MODIFIED_BY", insobj.Created_By));
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ALLERGY_SP_INSERTUPDATE", param);
                DataRow dr = dt.Rows[0];
                InsertId = (dr["Id"].ToString());

                IList<AllergyModel> insert = (from p in dt.AsEnumerable()
                                              select
                                              new AllergyModel()
                                              {
                                                  Id = p.Field<long>("Id"),
                                                  AllergenId = p.Field<long>("ALLERGEN_ID"),
                                                  AllergyTypeId = p.Field<long>("ALLERGYTYPE_ID"),
                                                  AllergyOnsetId = p.Field<long?>("ONSET_ID"),
                                                  AllergySeverityId = p.Field<long?>("SEVERITY_ID"),
                                                  OnSetDate = p.Field<DateTime?>("ONSET_DATE"),
                                                  Remarks = p.Field<string>("Remarks"),
                                                  flag = p.Field<int>("flag"),
                                                  Patient_Id = p.Field<long>("PATIENT_ID"),
                                                  Created_By = p.Field<long>("CREATED_BY"),
                                                  Institution_Id = p.Field<long>("INSTITUTION_ID")
                                              }).ToList();



                foreach (AllergyReactionModel item in insobj.AllergyReaction_List)
                {

                    List<DataParameter> param1 = new List<DataParameter>();
                    param1.Add(new DataParameter("@ALLERGYDETAILS_ID", InsertId));
                    param1.Add(new DataParameter("@AllergyReaction_Id", item.Id));
                    var objExist = insobj.SelectedAllergyList.Where(ChildItem => ChildItem.Id == item.Id);

                    param1.Add(new DataParameter("@CREATED_BY", insobj.Created_By));

                    if (objExist.ToList().Count > 0)
                        //    if (obj.Institution_Modules.Select(ChildItem=>ChildItem.ModuleId = item.Id).ToList()==0)
                        param1.Add(new DataParameter("@MODULE_SELECTED", "1"));
                    else
                        param1.Add(new DataParameter("@MODULE_SELECTED", "0"));

                    Inserted_AllergyReaction_Id = ClsDataBase.Insert("[MYCORTEX].PATIENT_SP_INSERTUPDATE_ALLERGYREACTIONDETAILS", param1, true);
                }
                return insert;
            }
        }

        /// <summary>
        /// to get allergy list of a patient
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="IsActive">Active Flag</param>
        /// <returns>allergy list of a patient</returns>
        public IList<AllergyModel> PatientAllergylist(long Patient_Id, int IsActive, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PatientId", Patient_Id));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ALLERGY_DETAILS_SP_LIST", param);
            List<AllergyModel> lst = (from p in dt.AsEnumerable()
                                      select new AllergyModel()
                                      {
                                          Id = p.Field<long>("ID"),
                                          AllergenName = p.Field<string>("ALLERGENNAME"),
                                          AllergyTypeName = p.Field<string>("ALLERGYTYPE"),
                                          AllergySeverityName = p.Field<string>("SEVERITY") ?? "",
                                          AllergyOnsetName = p.Field<string>("ONSETNAME") ?? "",
                                          OnSetDate = p.Field<DateTime?>("ONSETDATE"),
                                          AllergyReactionName = p.Field<string>("ALLERGYREACTIONNAME") ?? "",
                                          IsActive = p.Field<int>("ISACTIVE"),
                                          Created_By_Name = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                          Created_Dt = p.Field<DateTime>("CREATED_DT"),
                                          Remarks = p.Field<string>("REMARKS")
                                      }).ToList();

            return lst;
        }


        /// <summary>
        /// a Patient's allergy details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public AllergyModel PatientAllergyView(long Id, Guid Login_Session_Id)
        {
            //long ViewId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ALLERGYDETAILS_SP_VIEW", param);
            AllergyModel ViewAllergy = (from p in dt.AsEnumerable()
                                        select
                                        new AllergyModel()
                                        {
                                            Id = p.Field<long>("ID"),
                                            AllergenId = p.Field<long>("ALLERGEN_ID"),
                                            AllergenName = p.Field<string>("ALLERGENNAME"),
                                            AllergyTypeId = p.Field<long>("ALLERGYTYPE_ID"),
                                            AllergyTypeName = p.Field<string>("ALLERGYTYPE"),
                                            AllergySeverityId = p.Field<long?>("SEVERITY_ID"),
                                            AllergySeverityName = p.Field<string>("SEVERITY"),
                                            AllergyOnsetId = p.Field<long?>("ONSET_ID"),
                                            AllergyOnsetName = p.Field<string>("ONSETNAME"),
                                            AllergyReactionName = p.Field<string>("ALLERGYREACTIONNAME"),
                                            OnSetDate = p.Field<DateTime?>("ONSETDATE"),
                                            Remarks = p.Field<string>("REMARKS"),
                                            Created_By = p.Field<long>("CREATEDBY"),
                                            Patient_Id = p.Field<long>("PATIENT_ID")
                                        }).FirstOrDefault();

            if (ViewAllergy != null)
            {
                if (ViewAllergy.Id > 0)
                {
                    ViewAllergy.AllergyReaction_List = PatientAllergyReactionView(ViewAllergy.Id);

                }
                else
                {
                    ViewAllergy = new AllergyModel();
                }
                return ViewAllergy;

            }
            return ViewAllergy;
        }
        /*This is for Patient Allergy Reaction View*/
        public IList<AllergyReactionModel> PatientAllergyReactionView(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.[PATIENTALLERGYREACTION_SP_VIEW]", param);
            List<AllergyReactionModel> ViewAllergy = (from p in dt.AsEnumerable()
                                                      select new AllergyReactionModel()
                                                      {
                                                          Id = p.Field<long?>("ID"),
                                                          AllergyReactionName = p.Field<string>("ALLERGYREACTIONNAME")
                                                      }).ToList();
            return ViewAllergy;
        }



        /// <summary>
        /// to insert/update Clinical notes for a patient
        /// </summary>
        /// <param name="noteobj"></param>
        /// <returns>inserted/updated Clinical notes for a patient</returns>
        public IList<DoctorNotesModel> PatientNotes_InsertUpdate(DoctorNotesModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@ID", noteobj.Id));
            param.Add(new DataParameter("@PATIENT_ID", noteobj.PatientId));
            param.Add(new DataParameter("@NOTES", noteobj.Notes));
            param.Add(new DataParameter("@CREATED_BY", noteobj.Created_By));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTNOTES_SP_INSERTUPDATE", param);
            IList<DoctorNotesModel> list = (from p in dt.AsEnumerable()
                                            select new DoctorNotesModel()
                                            {
                                                Id = p.Field<long>("ID"),
                                                PatientId = p.Field<long>("PATIENT_ID"),
                                                Notes = p.Field<string>("NOTES"),
                                                Created_By = p.Field<long>("CREATED_BY"),
                                                Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                                flag = p.Field<int>("flag")
                                            }).ToList();
            return list;
        }

        /// <summary>
        /// to get Clinical notes list of a patient
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="IsActive"></param>
        /// <returns>Clinical notes list of a patient</returns>
        public IList<DoctorNotesModel> PatientNotes_List(long idval, int IsActive, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataEncryption DecryptFields = new DataEncryption();
                param.Add(new DataParameter("@patientid", idval));
                param.Add(new DataParameter("@ISACTIVE", IsActive));
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTDOCTORNOTES_SP_LIST ", param);

                List<DoctorNotesModel> list = (from p in dt.AsEnumerable()
                                               select new DoctorNotesModel()
                                               {
                                                   Id = p.Field<long>("ID"),
                                                   PatientId = p.Field<long>("PATIENT_ID"),
                                                   Notes = p.Field<string>("NOTES"),
                                                   Created_By = p.Field<long>("CREATED_BY"),
                                                   Created_By_Name = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                   Created_Dt = p.Field<DateTime>("CREATED_DT"),
                                                   IsActive = p.Field<int>("ISACTIVE")
                                               }).ToList();
                return list;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// to deactivate a clinical note
        /// </summary>
        /// <param name="noteobj"></param>
        /// <returns></returns>
        public IList<DoctorNotesModel> DoctorNotesDetails_InActive(DoctorNotesModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_NOTES_SP_INACTIVE", param);
                IList<DoctorNotesModel> list = (from p in dt.AsEnumerable()
                                                select new DoctorNotesModel()
                                                {
                                                    flag = p.Field<int>("flag")
                                                }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// to activate a Clinical Note of a patient
        /// </summary>
        /// <param name="noteobj">clinical note detail</param>
        /// <returns>activated Clinical Note of a patient</returns>
        public IList<DoctorNotesModel> DoctorNotesDetails_Active(DoctorNotesModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_NOTES_SP_ACTIVE", param);
                IList<DoctorNotesModel> list = (from p in dt.AsEnumerable()
                                                select new DoctorNotesModel()
                                                {
                                                    flag = p.Field<int>("flag")
                                                }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// details of a Client note
        /// </summary>
        /// <param name="Id">Client note Id</param>
        /// <returns>details of a Client note</returns>
        public DoctorNotesModel PatientNotes_View(long Id, Guid Login_Session_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@Id", Id));
                param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENTNOTES_SP_VIEW", param);
                DoctorNotesModel note = (from p in dt.AsEnumerable()
                                         select
                                         new DoctorNotesModel()
                                         {
                                             Id = p.Field<long>("ID"),
                                             PatientId = p.Field<long>("PATIENT_ID"),
                                             Notes = p.Field<string>("NOTES"),
                                             Created_By = p.Field<long>("CREATED_BY"),
                                             Created_Dt = p.Field<DateTime>("CREATED_DT"),
                                         }).FirstOrDefault();
                return note;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// to insert/update Patient other data document
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="Id"></param>
        /// <param name="FileName"></param>
        /// <param name="DocumentName"></param>
        /// <param name="Remarks"></param>
        /// <param name="Created_By"></param>
        /// <returns>inserted/updated Patient other data document</returns>
        public Patient_OtherDataModel Patient_OtherData_InsertUpdate(long Patient_Id, long Id, string FileName, string DocumentName, string Remarks, byte[] fileData, long Created_By)
        {
            List<DataParameter> param = new List<DataParameter>();
            DataEncryption encrypt = new DataEncryption();

            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@Patient_Id", Patient_Id));
            param.Add(new DataParameter("@DocumentName", DocumentName));
            param.Add(new DataParameter("@FileName", FileName));
            param.Add(new DataParameter("@DocumentBlobData", (fileData)));
            param.Add(new DataParameter("@Remarks", Remarks));
            param.Add(new DataParameter("@Created_By", Created_By));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_OTHERDATA_INSERTUPDATE]", param);
            DataEncryption DecryptFields = new DataEncryption();
            Patient_OtherDataModel insert = (from p in dt.AsEnumerable()
                                             select
                                             new Patient_OtherDataModel()
                                             {
                                                 Id = p.Field<long>("Id"),
                                                 Patient_Id = p.Field<long>("PATIENT_ID"),
                                                 DocumentName = p.Field<string>("DOCUMENT_NAME"),
                                                 FileName = p.Field<string>("FILE_NAME"),
                                                 IsActive = p.Field<int>("ISACTIVE"),
                                                 Created_By = p.Field<long>("CREATED_BY"),
                                                 Created_Name = p.Field<string>("Created_Name"),
                                                 PatientName = p.Field<string>("PatientName"),
                                                 Remarks = p.Field<string>("Remarks"),
                                                 flag = p.Field<int>("flag"),
                                                 Institution_Id = p.Field<long>("INSTITUTION_ID"),
                                             }).FirstOrDefault();

            return insert;
        }


        /// <summary>
        /// Patient other data detail of a selected patient other data
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public Patient_OtherDataModel Patient_OtherData_View(long Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_SP_OTHERDATA_VIEW]", param);
                Patient_OtherDataModel View = (from p in dt.AsEnumerable()
                                               select
                                               new Patient_OtherDataModel()
                                               {
                                                   Id = p.Field<long>("Id"),
                                                   Patient_Id = p.Field<long>("PATIENT_ID"),
                                                   DocumentName = p.Field<string>("DOCUMENT_NAME"),
                                                   FileName = p.Field<string>("FILE_NAME"),
                                                   IsActive = p.Field<int>("ISACTIVE"),
                                                   Created_By = p.Field<long>("CREATED_BY"),
                                                   Created_Name = p.Field<string>("Created_Name"),
                                                   PatientName = p.Field<string>("PatientName"),
                                                   Remarks = p.Field<string>("Remarks")
                                               }).FirstOrDefault();
                return View;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Patient other data list of a selected patient and active flag
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="IsActive">Active flag</param>
        /// <returns></returns>
        public IList<Patient_OtherDataModel> Patient_OtherData_List(long Patient_Id, int IsActive, Guid Login_Session_Id)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@PATIENT_ID", Patient_Id));
            param.Add(new DataParameter("@IsActive", IsActive));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_SP_OTHERDATA_LIST]", param);
                List<Patient_OtherDataModel> lst = (from p in dt.AsEnumerable()
                                                    select new Patient_OtherDataModel()
                                                    {
                                                        Id = p.Field<long>("Id"),
                                                        Patient_Id = p.Field<long>("PATIENT_ID"),
                                                        DocumentName = p.Field<string>("DOCUMENT_NAME"),
                                                        FileName = p.Field<string>("FILE_NAME"),
                                                        IsActive = p.Field<int>("ISACTIVE"),
                                                        Created_By = p.Field<long>("CREATED_BY"),
                                                        Created_Name = DecryptFields.Decrypt(p.Field<string>("Created_Name")),
                                                        PatientName = DecryptFields.Decrypt(p.Field<string>("PatientName")),
                                                        Remarks = p.Field<string>("Remarks"),
                                                        Created_Date = p.Field<DateTime>("Created_dt")
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
        /// to get patient other data document
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public Patient_OtherDataModel Patient_OtherData_GetDocument(long Id)
        {
            DataEncryption decrypt = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_OTHERDATA_SP_GETDOCUMENT]", param);
            //  byte[] returnPhoto = (byte[])dt.Rows[0]["Id"];
            if (!Convert.IsDBNull(dt.Rows[0]["BLOBDATA"]))
            {
                byte[] returnDocument = (byte[])dt.Rows[0]["BLOBDATA"];
                string FileName = (string)dt.Rows[0]["FILE_NAME"];
                return new Patient_OtherDataModel
                {
                    Id = Id,
                    DocumentBlobData = (returnDocument),
                    FileName = FileName
                };

                //return decrypt.DecryptFile(returnPhoto);
            }
            else
            {
                return new Patient_OtherDataModel
                {
                };
            }
        }
        /// <summary>
        /// to deactivate a patient's other data
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>deactivated a patient's other data</returns>
        public Patient_OtherDataModel Patient_OtherData_InActive(long Id, long Modified_By)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@Modified_By", Modified_By));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_OTHERDATA_SP_INACTIVE", param);
                Patient_OtherDataModel list = (from p in dt.AsEnumerable()
                                               select new Patient_OtherDataModel()
                                               {
                                                   flag = p.Field<int>("flag")
                                               }).FirstOrDefault();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// to activated a patient's other data
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>activated a patient's other data</returns>
        public Patient_OtherDataModel Patient_OtherData_Active(long Id, long Modified_By)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", Id));
                param.Add(new DataParameter("@Modified_By", Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_OTHERDATA_SP_ACTIVE", param);
                Patient_OtherDataModel list = (from p in dt.AsEnumerable()
                                               select new Patient_OtherDataModel()
                                               {
                                                   flag = p.Field<int>("flag")
                                               }).FirstOrDefault();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }



        /// <summary>
        /// list of users with group exist in selected user list
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns></returns>
        public IList<UserGroupDetails_List> GroupBasedUserList_ByUser(long User_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USER_ID", User_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataEncryption EncryptField = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("MYCORTEX.USERBASED_DEPARTMENT_SP_LIST", param);
                List<UserGroupDetails_List> list = (from p in dt.AsEnumerable()
                                                    select new UserGroupDetails_List()
                                                    {
                                                        User_Id = p.Field<long>("ID"),
                                                        Dept_Id = p.IsNull("DEPT_ID") ? 0 : p.Field<long>("DEPT_ID"),
                                                        DeptName = p.Field<string>("DEPARTMENT_NAME"),
                                                        UserName = EncryptField.Decrypt(p.Field<string>("FULLNAME")),
                                                        GenderName = p.Field<string>("GENDER_NAME"),
                                                        GroupName = p.Field<string>("USERTYPE_NAME")

                                                    }).ToList();
                return list;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }

        /// <summary>
        /// to deactivate a patient allergy
        /// </summary>
        /// <param name="noteobj">patient allergy detail id</param>
        /// <returns>deactivated patient allergy</returns>
        public IList<AllergyModel> AllergyDetails_InActive(AllergyModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ALLERGY_SP_INACTIVE", param);
                IList<AllergyModel> list = (from p in dt.AsEnumerable()
                                            select new AllergyModel()
                                            {
                                                flag = p.Field<int>("flag")
                                            }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// to activated a patient allergy
        /// </summary>
        /// <param name="noteobj">patient allergy detail id</param>
        /// <returns>activated patient allergy</returns>
        public IList<AllergyModel> AllergyDetails_Active(AllergyModel noteobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                // List<DataParameter> param = new List<DataParameter>();
                param.Add(new DataParameter("@Id", noteobj.Id));
                param.Add(new DataParameter("@Modified_By", noteobj.Modified_By));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].PATIENT_ALLERGY_SP_ACTIVE", param);
                IList<AllergyModel> list = (from p in dt.AsEnumerable()
                                            select new AllergyModel()
                                            {
                                                flag = p.Field<int>("flag")
                                            }).ToList();
                return list;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// allergy list of a institution
        /// </summary>
        /// <param name="IsActive"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        public IList<AllergyModel> AllergyMasterList(int IsActive, long Institution_Id,int StartRowNumber,int EndRowNumber)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@StartRowNumber", StartRowNumber));
            param.Add(new DataParameter("@EndRowNumber", EndRowNumber));
            param.Add(new DataParameter("@ISACTIVE", IsActive));
            param.Add(new DataParameter("@INSTITUTION_ID", Institution_Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));

            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].ALLERGEYMASTER_SP_LIST", param);
                List<AllergyModel> list = (from p in dt.AsEnumerable()
                                           select new AllergyModel()
                                           {
                                               TotalRecord = p.Field<string>("TotalRecords"),
                                               Id = p.Field<long>("Id"),
                                               AllergyTypeName = p.Field<string>("NAME"),
                                               AllergenName = p.Field<string>("ALLERGENNAME"),
                                               IsActive = p.Field<int>("ISACTIVE")


                                           }).ToList();
                return list;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Insert Patient Health Data
        /// </summary>
        /// <param name="patientDataObj">Required Params: PatientId, ParameterId, ParameterValue, ActivityDate</param>
        /// <returns>inserted Health Data</returns>
        public PatientHealthDataModel PatientHealthData_AlertNotification_List(long HealthData_Id)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@LifeStyleData_Id", HealthData_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ALERTEVENT_GET_DIAGNOSTICALERT]", param);
            DataEncryption DecryptFields = new DataEncryption();
            PatientHealthDataModel list = (from p in dt.AsEnumerable()
                                           select new PatientHealthDataModel()
                                           {
                                               Patient_Id = p.Field<long>("Id"),
                                               HighCount = p.Field<int?>("HighCount"),
                                               MediumCount = p.Field<int?>("MediumCount"),
                                               LowCount = p.Field<int?>("LowCount"),
                                           }).FirstOrDefault();
            return list;
        }

        /// <summary>
        /// to check patient and business user license count
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>List the flag and User Type</returns>

        public UserModel InstitutionSubscriptionLicensecheck(UserModel obj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@InstitutionId", obj.INSTITUTION_ID));
            param.Add(new DataParameter("@UserTypeId", obj.UserType_Id));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_SUBSCRPTION_VALIDATION]", param);
            UserModel list = (from p in dt.AsEnumerable()
                              select new UserModel()
                              {
                                  flag = p.Field<int>("FLAG"),
                                  UserType_Id = p.Field<long>("USERTYPEID"),
                              }).FirstOrDefault();
            return list;
        }

        public UserModel Patient_Update(Guid Login_Session_Id, UserModel insobj)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", insobj.Id));
            param.Add(new DataParameter("@EmailId", insobj.EMAILID));
            param.Add(new DataParameter("@MobileNo", insobj.MOBILE_NO));
            param.Add(new DataParameter("@GOOGLE_EMAILID", insobj.GOOGLE_EMAILID));
            param.Add(new DataParameter("@FB_EMAILID", insobj.FB_EMAILID));
            param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[PATIENT_SP_UPDATE]", param);

            DataRow dr = dt.Rows[0];
            if (dr.IsNull("flag") == true)
            {
                insobj.flag = 1;
            }
            else
            {
                DataEncryption DecryptFields = new DataEncryption();
                insobj.EMAILID = DecryptFields.Decrypt(insobj.EMAILID);
                insobj.MOBILE_NO = DecryptFields.Decrypt(insobj.MOBILE_NO);
                insobj.GOOGLE_EMAILID = DecryptFields.Decrypt(insobj.GOOGLE_EMAILID);
                insobj.FB_EMAILID = DecryptFields.Decrypt(insobj.FB_EMAILID);
                insobj.flag = int.Parse((dr["flag"].ToString()));
            }
            

            return insobj;
        }

        public bool UserSession_Status(string Login_Session_Id)
        {
            bool SessionStatus = false;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@LOGINSESSIONID", Login_Session_Id));
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[LOGINSESSION_SP_CHECK]", param);
            if (dt.Rows.Count > 0)
            {
                DataRow dr = dt.Rows[0];
                if (int.Parse((dr["SESSIONSTATUS"].ToString())) == 1)
                {
                    SessionStatus = true;
                }
            }
            return SessionStatus;
        }

    }
}
