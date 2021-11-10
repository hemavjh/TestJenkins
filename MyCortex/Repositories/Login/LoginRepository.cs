using MyCortexDB;
using MyCortex.Login.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using log4net;
using System.Web.Script.Serialization;
using MyCortex.User.Model;
using MyCortex.Utilities;
using MyCortex.Notification.Model;
using MyCortex.Masters.Models;

namespace MyCortex.Repositories.Login
{
    public class LoginRepository : ILoginRepository
    {
        ClsDataBase db;
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        /// <summary>
        /// Initializes a new instance of the class.       
        /// </summary>
        public LoginRepository()
        {
            db = new ClsDataBase();
        }


        /// <summary>
        /// check login user authentication, stores Login History
        /// </summary>
        /// <param name="loginObj">Login Credentials</param>
        /// <returns>Login validity details and User Information</returns>
        public LoginModel Userlogin_AddEdit(LoginModel obj)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@UserName", obj.Username));
            param.Add(new DataParameter("@Password", obj.Password));
            param.Add(new DataParameter("@DeviceType", obj.DeviceType));
            param.Add(new DataParameter("@LoginType", obj.LoginType));
            param.Add(new DataParameter("@TimeDifference", obj.Sys_TimeDifference));
            param.Add(new DataParameter("@Browser_Version", obj.Browser_Version));
            param.Add(new DataParameter("@Login_Country", obj.Login_Country));
            param.Add(new DataParameter("@Login_City", obj.Login_City));
            param.Add(new DataParameter("@Login_IpAddress", obj.Login_IpAddress));
            param.Add(new DataParameter("@Is_Tab", obj.isTab));
            param.Add(new DataParameter("@Ref_Id", obj.Tab_Ref_ID));
            param.Add(new DataParameter("@Language_Id", obj.LanguageId));
            //   param.Add(new DataParameter("@SESSION_ID", Login_Session_Id));


            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].LOGIN_SP_VALIDATIONSCHECK_INSERT", param);
            LoginModel lst = (from p in dt.AsEnumerable()
                              select
                              new LoginModel()
                              {
                                  UserId = p.Field<long>("UserId"),
                                  data = p.Field<int>("data"),
                                  UserTypeId = p.Field<long>("UserTypeId"),
                                  InstitutionId = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                  Messagetype = p.Field<string>("Messagetype"),
                                  TabID = p.Field<long>("TABID"),
                                  Login_Session_Id = p.Field<Guid?>("Session_Id"),

                                  UserDetails = new UserModel()
                                  {
                                      Id = p.IsNull("Id") ? 0 : p.Field<long>("Id"),
                                      INSTITUTION_ID = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                      FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                      MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                      LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                      EMPLOYEMENTNO = p.Field<string>("EMPLOYEMENTNO") ?? "",
                                      EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")) ?? "",
                                      // EMAILID = p.Field<string>("EMAILID") ?? "",
                                      DEPARTMENT_ID = p.IsNull("DEPARTMENT_ID") ? 0 : p.Field<long>("DEPARTMENT_ID"),
                                      MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")) ?? "",
                                      //DOB = p.Field<DateTime?>("DOB"),
                                      DOB_Encrypt = DecryptFields.Decrypt(p.Field<string>("DOB_Encrypt")),
                                      Department_Name = p.Field<string>("Department_Name") ?? "",
                                      InstitutionName = p.Field<string>("InstitutionName") ?? "",
                                      IsActive = p.Field<int?>("IsActive"),
                                      Photo = p.Field<string>("PHOTO_NAME") ?? "",
                                      Photo_Fullpath = p.Field<string>("PHOTO_FULLPATH") ?? "",
                                      FileName = p.Field<string>("PHOTO_FILENAME") ?? "",
                                      UserType_Id = p.Field<long?>("UserType_Id"),
                                      HEALTH_LICENSE = p.Field<string>("HEALTH_LICENSE") ?? "",
                                      GENDER_ID = p.IsNull("GENDER_ID") ? 0 : p.Field<long>("GENDER_ID"),
                                      NATIONALITY_ID = p.IsNull("NATIONALITY_ID") ? 0 : p.Field<long>("NATIONALITY_ID"),
                                      ETHINICGROUP_ID = p.IsNull("ETHINICGROUP_ID") ? 0 : p.Field<long>("ETHINICGROUP_ID"),
                                      EMR_AVAILABILITY = p.Field<bool?>("EMR_AVAILABILITY"),
                                      ADDRESS1 = p.Field<string>("ADDRESS1") ?? "",
                                      ADDRESS2 = p.Field<string>("ADDRESS2") ?? "",
                                      ADDRESS3 = p.Field<string>("ADDRESS3") ?? "",
                                      HOME_AREACODE = p.Field<string>("HOME_AREACODE") ?? "",
                                      HOME_PHONENO = p.Field<string>("HOME_PHONENO") ?? "",
                                      MOBIL_AREACODE = p.Field<string>("MOBILE_AREACODE") ?? "",
                                      POSTEL_ZIPCODE = p.Field<string>("POSTEL_ZIPCODE") ?? "",
                                      COUNTRY_ID = p.IsNull("COUNTRY_ID") ? 0 : p.Field<long>("COUNTRY_ID"),
                                      STATE_ID = p.IsNull("STATE_ID") ? 0 : p.Field<long>("STATE_ID"),
                                      CITY_ID = p.IsNull("CITY_ID") ? 0 : p.Field<long>("CITY_ID"),
                                      BLOODGROUP_ID = p.IsNull("BLOODGROUP_ID") ? 0 : p.Field<long>("BLOODGROUP_ID"),
                                      MARITALSTATUS_ID = p.IsNull("MARITALSTATUS_ID") ? 0 : p.Field<long>("MARITALSTATUS_ID"),
                                      PATIENTNO = p.Field<string>("PATIENTNO") ?? "",
                                      MNR_NO = DecryptFields.Decrypt(p.Field<string>("MNR_NO")) ?? "",
                                      INSURANCEID = DecryptFields.Decrypt(p.Field<string>("INSURANCEID")) ?? "",
                                      NATIONALID = DecryptFields.Decrypt(p.Field<string>("NATIONALID")) ?? "",
                                      EthnicGroup = p.Field<string>("EthnicGroup") ?? "",
                                      UserName = p.Field<string>("UserName") ?? "",
                                      GENDER_NAME = p.Field<string>("GENDER_NAME") ?? "",
                                      Nationality = p.Field<string>("Nationality") ?? "",
                                      MaritalStatus = p.Field<string>("MaritalStatus") ?? "",
                                      BLOODGROUP_NAME = p.Field<string>("BLOODGROUP_NAME") ?? "",
                                      RelationShipName = p.Field<string>("RelationShipName") ?? "",
                                      DietDescribe = p.Field<string>("DietDescribe") ?? "",
                                      AlergySubstance = p.Field<string>("AlergySubstance") ?? "",
                                      EXCERCISE_SCHEDULE = p.Field<string>("EXCERCISE_SCHEDULE") ?? "",
                                      SMOKESUBSTANCE = p.Field<string>("SMOKESUBSTANCE") ?? "",
                                      ALCOHALSUBSTANCE = p.Field<string>("ALCOHALSUBSTANCE") ?? "",
                                      CAFFEINATED_BEVERAGES = p.Field<string>("CAFFEINATED_BEVERAGES") ?? "",
                                      CURRENTLY_TAKEMEDICINE = p.Field<int?>("CURRENTLY_TAKEMEDICINE") ?? 0,
                                      PAST_MEDICALHISTORY = p.Field<int?>("PAST_MEDICALHISTORY") ?? 0,
                                      FAMILYHEALTH_PROBLEMHISTORY = p.Field<int?>("FAMILYHEALTH_PROBLEMHISTORY") ?? 0,
                                      VACCINATIONS = p.Field<int?>("VACCINATIONS") ?? 0,
                                      DIETDESCRIBE_ID = p.IsNull("DIETTYPE_ID") ? 0 : p.Field<long?>("DIETTYPE_ID"),
                                      EXCERCISE_SCHEDULEID = p.IsNull("EXCERCISE_SCHEDULEID") ? 0 : p.Field<long?>("EXCERCISE_SCHEDULEID"),
                                      EXCERCISE_TEXT = p.Field<string>("EXCERCISE_TEXT") ?? "",
                                      ALERGYSUBSTANCE_ID = p.IsNull("ALERGYSUBSTANCE_ID") ? 0 : p.Field<long>("ALERGYSUBSTANCE_ID"),
                                      ALERGYSUBSTANCE_TEXT = p.Field<string>("ALERGYSUBSTANCE_TEXT") ?? "",
                                      SMOKESUBSTANCE_ID = p.IsNull("SMOKESUBSTANCE_ID") ? 0 : p.Field<long>("SMOKESUBSTANCE_ID"),
                                      SMOKESUBSTANCE_TEXT = p.Field<string>("SMOKESUBSTANCE_TEXT") ?? "",
                                      ALCOHALSUBSTANCE_ID = p.IsNull("ALCOHALSUBSTANCE_ID") ? 0 : p.Field<long>("ALCOHALSUBSTANCE_ID"),
                                      ALCOHALSUBSTANCE_TEXT = p.Field<string>("ALCOHALSUBSTANCE_TEXT") ?? "",
                                      CAFFEINATED_BEVERAGESID = p.IsNull("CAFFEINATED_BEVERAGESID") ? 0 : p.Field<long>("CAFFEINATED_BEVERAGESID"),
                                      CAFFEINATEDBEVERAGES_TEXT = p.Field<string>("CAFFEINATEDBEVERAGES_TEXT") ?? "",
                                      EMERG_CONT_FIRSTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_FIRSTNAME")) ?? "",
                                      EMERG_CONT_MIDDLENAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_MIDDLENAME")) ?? "",
                                      EMERG_CONT_LASTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_LASTNAME")) ?? "",
                                      Emergency_MobileNo = DecryptFields.Decrypt(p.Field<string>("EMRG_CONT_PHONENO")) ?? "",
                                      EMERG_CONT_RELATIONSHIP_ID = p.IsNull("EMERG_CONT_RELATIONSHIP_ID") ? 0 : p.Field<long>("EMERG_CONT_RELATIONSHIP_ID"),
                                      Patient_Type = p.IsNull("PATIENT_TYPE") ? 0 : p.Field<int>("PATIENT_TYPE"),
                                      Unitgroup_preference = p.Field<int?>("UNITGROUP_PREFERENCE") ?? 0,
                                      Language_preference = p.Field<int?>("LANGUAGE_PREFERENCE") ?? 0,
                                      Payment_preference = p.Field<long?>("PAYMENT_PREFERENCE") ?? 0,
                                      Insurance_Preference = p.Field<long?>("INSURANCE_PREFERENCE") ?? 0,

                                  },
                              }).FirstOrDefault();
            if (lst.UserDetails.DOB_Encrypt != "")
            {
                var time = lst.UserDetails.DOB_Encrypt.Split(' ');

                var time4 = time[0].Split('/');
                try
                {
                    var time1 = time4[0];
                    var time2 = time4[1];
                    var time3 = time4[2];

                    DateTime dt1 = new DateTime();
                    try
                    {
                        var dateime = time2 + '/' + time1 + '/' + time3;
                        dt1 = Convert.ToDateTime(dateime);
                    }
                    catch (Exception ex)
                    {
                        var dateime = time1 + '/' + time2 + '/' + time3;
                        dt1 = Convert.ToDateTime(dateime);
                    }
                    lst.UserDetails.DOB = dt1;
                }
                catch (Exception ex1)
                {
                    time4 = time[0].Split('-');
                    var time1 = time4[0];
                    var time2 = time4[1];
                    var time3 = time4[2];


                    DateTime dt1 = new DateTime();
                    try
                    {
                        var dateime = time2 + '-' + time1 + '-' + time3;
                        dt1 = Convert.ToDateTime(dateime);
                    }
                    catch (Exception ex2)
                    {
                        var dateime = time1 + '-' + time2 + '-' + time3;
                        dt1 = Convert.ToDateTime(dateime);
                    }
                    lst.UserDetails.DOB = dt1;
                }
                //lst.UserDetails.DOB = Convert.ToDateTime(lst.UserDetails.DOB_Encrypt);
                /*_logger.Info(lst.UserDetails.DOB_Encrypt);
                string[] tokens = lst.UserDetails.DOB_Encrypt.Split('/');
                
                //lst.UserDetails.DOB = new DateTime(int.Parse(tokens[2].Substring(0, 4)), int.Parse(tokens[0]), int.Parse(tokens[1]));
                lst.UserDetails.DOB = new DateTime(int.Parse(tokens[2].Substring(0, 4)), int.Parse(tokens[0]), int.Parse(tokens[1]));*/
            }
            return lst;
        }

        /// <summary>
        /// get user details based on Google Email id in the user profile
        /// </summary>
        /// <returns>a user details</returns>
        public LoginModel UserDetails_Get_GoogleMail(string EmailId)
        {
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@EMAIL", EmailId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                //bool chk = ClsDataBase.checkConnection();
                DataEncryption DecryptFields = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERDETAILS_SP_BYGOOGLEMAIL", param);
                LoginModel lst = (from p in dt.AsEnumerable()
                                  select
                                  new LoginModel()
                                  {
                                      UserId = p.Field<long>("UserId"),
                                      data = p.Field<int>("data"),
                                      UserTypeId = p.Field<long>("UserTypeId"),
                                      InstitutionId = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                      UserDetails = new UserModel()
                                      {
                                          Id = p.IsNull("Id") ? 0 : p.Field<long>("Id"),
                                          INSTITUTION_ID = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                          FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                          MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                          LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                          EMPLOYEMENTNO = p.Field<string>("EMPLOYEMENTNO") ?? "",
                                          EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")) ?? "",
                                          // EMAILID = p.Field<string>("EMAILID") ?? "",
                                          DEPARTMENT_ID = p.IsNull("DEPARTMENT_ID") ? 0 : p.Field<long>("DEPARTMENT_ID"),
                                          MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")) ?? "",
                                          //DOB = p.Field<DateTime?>("DOB"),
                                          DOB_Encrypt = DecryptFields.Decrypt(p.Field<string>("DOB_Encrypt")),
                                          Department_Name = p.Field<string>("Department_Name") ?? "",
                                          InstitutionName = p.Field<string>("InstitutionName") ?? "",
                                          IsActive = p.Field<int?>("IsActive"),
                                          Photo = p.Field<string>("PHOTO_NAME") ?? "",
                                          Photo_Fullpath = p.Field<string>("PHOTO_FULLPATH") ?? "",
                                          FileName = p.Field<string>("PHOTO_FILENAME") ?? "",
                                          UserType_Id = p.Field<long?>("UserType_Id"),
                                          HEALTH_LICENSE = p.Field<string>("HEALTH_LICENSE") ?? "",
                                          GENDER_ID = p.IsNull("GENDER_ID") ? 0 : p.Field<long>("GENDER_ID"),
                                          NATIONALITY_ID = p.IsNull("NATIONALITY_ID") ? 0 : p.Field<long>("NATIONALITY_ID"),
                                          ETHINICGROUP_ID = p.IsNull("ETHINICGROUP_ID") ? 0 : p.Field<long>("ETHINICGROUP_ID"),
                                          EMR_AVAILABILITY = p.Field<bool?>("EMR_AVAILABILITY"),
                                          ADDRESS1 = p.Field<string>("ADDRESS1") ?? "",
                                          ADDRESS2 = p.Field<string>("ADDRESS2") ?? "",
                                          ADDRESS3 = p.Field<string>("ADDRESS3") ?? "",
                                          HOME_AREACODE = p.Field<string>("HOME_AREACODE") ?? "",
                                          HOME_PHONENO = p.Field<string>("HOME_PHONENO") ?? "",
                                          MOBIL_AREACODE = p.Field<string>("MOBILE_AREACODE") ?? "",
                                          POSTEL_ZIPCODE = p.Field<string>("POSTEL_ZIPCODE") ?? "",
                                          COUNTRY_ID = p.IsNull("COUNTRY_ID") ? 0 : p.Field<long>("COUNTRY_ID"),
                                          STATE_ID = p.IsNull("STATE_ID") ? 0 : p.Field<long>("STATE_ID"),
                                          CITY_ID = p.IsNull("CITY_ID") ? 0 : p.Field<long>("CITY_ID"),
                                          BLOODGROUP_ID = p.IsNull("BLOODGROUP_ID") ? 0 : p.Field<long>("BLOODGROUP_ID"),
                                          MARITALSTATUS_ID = p.IsNull("MARITALSTATUS_ID") ? 0 : p.Field<long>("MARITALSTATUS_ID"),
                                          PATIENTNO = p.Field<string>("PATIENTNO") ?? "",
                                          MNR_NO = DecryptFields.Decrypt(p.Field<string>("MNR_NO")) ?? "",
                                          INSURANCEID = DecryptFields.Decrypt(p.Field<string>("INSURANCEID")) ?? "",
                                          NATIONALID = DecryptFields.Decrypt(p.Field<string>("NATIONALID")) ?? "",
                                          EthnicGroup = p.Field<string>("EthnicGroup") ?? "",
                                          UserName = p.Field<string>("UserName") ?? "",
                                          GENDER_NAME = p.Field<string>("GENDER_NAME") ?? "",
                                          Nationality = p.Field<string>("Nationality") ?? "",
                                          MaritalStatus = p.Field<string>("MaritalStatus") ?? "",
                                          BLOODGROUP_NAME = p.Field<string>("BLOODGROUP_NAME") ?? "",
                                          RelationShipName = p.Field<string>("RelationShipName") ?? "",
                                          DietDescribe = p.Field<string>("DietDescribe") ?? "",
                                          AlergySubstance = p.Field<string>("AlergySubstance") ?? "",
                                          EXCERCISE_SCHEDULE = p.Field<string>("EXCERCISE_SCHEDULE") ?? "",
                                          SMOKESUBSTANCE = p.Field<string>("SMOKESUBSTANCE") ?? "",
                                          ALCOHALSUBSTANCE = p.Field<string>("ALCOHALSUBSTANCE") ?? "",
                                          CAFFEINATED_BEVERAGES = p.Field<string>("CAFFEINATED_BEVERAGES") ?? "",
                                          CURRENTLY_TAKEMEDICINE = p.Field<int?>("CURRENTLY_TAKEMEDICINE") ?? 0,
                                          PAST_MEDICALHISTORY = p.Field<int?>("PAST_MEDICALHISTORY") ?? 0,
                                          FAMILYHEALTH_PROBLEMHISTORY = p.Field<int?>("FAMILYHEALTH_PROBLEMHISTORY") ?? 0,
                                          VACCINATIONS = p.Field<int?>("VACCINATIONS") ?? 0,
                                          DIETDESCRIBE_ID = p.IsNull("DIETTYPE_ID") ? 0 : p.Field<long?>("DIETTYPE_ID"),
                                          EXCERCISE_SCHEDULEID = p.IsNull("EXCERCISE_SCHEDULEID") ? 0 : p.Field<long?>("EXCERCISE_SCHEDULEID"),
                                          EXCERCISE_TEXT = p.Field<string>("EXCERCISE_TEXT") ?? "",
                                          ALERGYSUBSTANCE_ID = p.IsNull("ALERGYSUBSTANCE_ID") ? 0 : p.Field<long>("ALERGYSUBSTANCE_ID"),
                                          ALERGYSUBSTANCE_TEXT = p.Field<string>("ALERGYSUBSTANCE_TEXT") ?? "",
                                          SMOKESUBSTANCE_ID = p.IsNull("SMOKESUBSTANCE_ID") ? 0 : p.Field<long>("SMOKESUBSTANCE_ID"),
                                          SMOKESUBSTANCE_TEXT = p.Field<string>("SMOKESUBSTANCE_TEXT") ?? "",
                                          ALCOHALSUBSTANCE_ID = p.IsNull("ALCOHALSUBSTANCE_ID") ? 0 : p.Field<long>("ALCOHALSUBSTANCE_ID"),
                                          ALCOHALSUBSTANCE_TEXT = p.Field<string>("ALCOHALSUBSTANCE_TEXT") ?? "",
                                          CAFFEINATED_BEVERAGESID = p.IsNull("CAFFEINATED_BEVERAGESID") ? 0 : p.Field<long>("CAFFEINATED_BEVERAGESID"),
                                          CAFFEINATEDBEVERAGES_TEXT = p.Field<string>("CAFFEINATEDBEVERAGES_TEXT") ?? "",
                                          EMERG_CONT_FIRSTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_FIRSTNAME")) ?? "",
                                          EMERG_CONT_MIDDLENAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_MIDDLENAME")) ?? "",
                                          EMERG_CONT_LASTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_LASTNAME")) ?? "",
                                          Emergency_MobileNo = DecryptFields.Decrypt(p.Field<string>("EMRG_CONT_PHONENO")) ?? "",
                                          EMERG_CONT_RELATIONSHIP_ID = p.IsNull("EMERG_CONT_RELATIONSHIP_ID") ? 0 : p.Field<long>("EMERG_CONT_RELATIONSHIP_ID"),

                                      },
                                  }).FirstOrDefault();
                if (lst.UserDetails.DOB_Encrypt != "")
                {
                    var time = lst.UserDetails.DOB_Encrypt.Split(' ');

                    var time4 = time[0].Split('/');
                    try
                    {
                        var time1 = time4[0];
                        var time2 = time4[1];
                        var time3 = time4[2];

                        DateTime dt1 = new DateTime();
                        try
                        {
                            var dateime = time2 + '/' + time1 + '/' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        catch (Exception ex)
                        {
                            var dateime = time1 + '/' + time2 + '/' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        lst.UserDetails.DOB = dt1;
                    }
                    catch (Exception ex1)
                    {
                        time4 = time[0].Split('-');
                        var time1 = time4[0];
                        var time2 = time4[1];
                        var time3 = time4[2];


                        DateTime dt1 = new DateTime();
                        try
                        {
                            var dateime = time2 + '-' + time1 + '-' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        catch (Exception ex2)
                        {
                            var dateime = time1 + '-' + time2 + '-' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        lst.UserDetails.DOB = dt1;
                    }
                }
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// user details based on FB Email id
        /// </summary>
        /// <param name="EmailId">Users FB Email Id</param>
        /// <returns>User details</returns>
        public LoginModel UserDetails_Get_FBMail(string EmailId)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            //param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@EMAIL", EmailId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                //bool chk = ClsDataBase.checkConnection();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].USERDETAILS_SP_BYFBEMAIL", param);
                LoginModel lst = (from p in dt.AsEnumerable()
                                  select
                                  new LoginModel()
                                  {
                                      UserId = p.Field<long>("UserId"),
                                      data = p.Field<int>("data"),
                                      UserTypeId = p.Field<long>("UserTypeId"),
                                      InstitutionId = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                      UserDetails = new UserModel()
                                      {
                                          Id = p.IsNull("Id") ? 0 : p.Field<long>("Id"),
                                          INSTITUTION_ID = p.IsNull("INSTITUTION_ID") ? 0 : p.Field<long>("INSTITUTION_ID"),
                                          FirstName = DecryptFields.Decrypt(p.Field<string>("FirstName")),
                                          MiddleName = DecryptFields.Decrypt(p.Field<string>("MiddleName")),
                                          LastName = DecryptFields.Decrypt(p.Field<string>("LastName")),
                                          EMPLOYEMENTNO = p.Field<string>("EMPLOYEMENTNO") ?? "",
                                          EMAILID = DecryptFields.Decrypt(p.Field<string>("EMAILID")) ?? "",
                                          // EMAILID = p.Field<string>("EMAILID") ?? "",
                                          DEPARTMENT_ID = p.IsNull("DEPARTMENT_ID") ? 0 : p.Field<long>("DEPARTMENT_ID"),
                                          MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")) ?? "",
                                          //DOB = p.Field<DateTime?>("DOB"),
                                          DOB_Encrypt = DecryptFields.Decrypt(p.Field<string>("DOB_Encrypt")),
                                          Department_Name = p.Field<string>("Department_Name") ?? "",
                                          InstitutionName = p.Field<string>("InstitutionName") ?? "",
                                          IsActive = p.Field<int?>("IsActive"),
                                          Photo = p.Field<string>("PHOTO_NAME") ?? "",
                                          Photo_Fullpath = p.Field<string>("PHOTO_FULLPATH") ?? "",
                                          FileName = p.Field<string>("PHOTO_FILENAME") ?? "",
                                          UserType_Id = p.Field<long?>("UserType_Id"),
                                          HEALTH_LICENSE = p.Field<string>("HEALTH_LICENSE") ?? "",
                                          GENDER_ID = p.IsNull("GENDER_ID") ? 0 : p.Field<long>("GENDER_ID"),
                                          NATIONALITY_ID = p.IsNull("NATIONALITY_ID") ? 0 : p.Field<long>("NATIONALITY_ID"),
                                          ETHINICGROUP_ID = p.IsNull("ETHINICGROUP_ID") ? 0 : p.Field<long>("ETHINICGROUP_ID"),
                                          EMR_AVAILABILITY = p.Field<bool?>("EMR_AVAILABILITY"),
                                          ADDRESS1 = p.Field<string>("ADDRESS1") ?? "",
                                          ADDRESS2 = p.Field<string>("ADDRESS2") ?? "",
                                          ADDRESS3 = p.Field<string>("ADDRESS3") ?? "",
                                          HOME_AREACODE = p.Field<string>("HOME_AREACODE") ?? "",
                                          HOME_PHONENO = p.Field<string>("HOME_PHONENO") ?? "",
                                          MOBIL_AREACODE = p.Field<string>("MOBILE_AREACODE") ?? "",
                                          POSTEL_ZIPCODE = p.Field<string>("POSTEL_ZIPCODE") ?? "",
                                          COUNTRY_ID = p.IsNull("COUNTRY_ID") ? 0 : p.Field<long>("COUNTRY_ID"),
                                          STATE_ID = p.IsNull("STATE_ID") ? 0 : p.Field<long>("STATE_ID"),
                                          CITY_ID = p.IsNull("CITY_ID") ? 0 : p.Field<long>("CITY_ID"),
                                          BLOODGROUP_ID = p.IsNull("BLOODGROUP_ID") ? 0 : p.Field<long>("BLOODGROUP_ID"),
                                          MARITALSTATUS_ID = p.IsNull("MARITALSTATUS_ID") ? 0 : p.Field<long>("MARITALSTATUS_ID"),
                                          PATIENTNO = p.Field<string>("PATIENTNO") ?? "",
                                          MNR_NO = DecryptFields.Decrypt(p.Field<string>("MNR_NO")) ?? "",
                                          INSURANCEID = DecryptFields.Decrypt(p.Field<string>("INSURANCEID")) ?? "",
                                          NATIONALID = DecryptFields.Decrypt(p.Field<string>("NATIONALID")) ?? "",
                                          EthnicGroup = p.Field<string>("EthnicGroup") ?? "",
                                          UserName = p.Field<string>("UserName") ?? "",
                                          GENDER_NAME = p.Field<string>("GENDER_NAME") ?? "",
                                          Nationality = p.Field<string>("Nationality") ?? "",
                                          MaritalStatus = p.Field<string>("MaritalStatus") ?? "",
                                          BLOODGROUP_NAME = p.Field<string>("BLOODGROUP_NAME") ?? "",
                                          RelationShipName = p.Field<string>("RelationShipName") ?? "",
                                          DietDescribe = p.Field<string>("DietDescribe") ?? "",
                                          AlergySubstance = p.Field<string>("AlergySubstance") ?? "",
                                          EXCERCISE_SCHEDULE = p.Field<string>("EXCERCISE_SCHEDULE") ?? "",
                                          SMOKESUBSTANCE = p.Field<string>("SMOKESUBSTANCE") ?? "",
                                          ALCOHALSUBSTANCE = p.Field<string>("ALCOHALSUBSTANCE") ?? "",
                                          CAFFEINATED_BEVERAGES = p.Field<string>("CAFFEINATED_BEVERAGES") ?? "",
                                          CURRENTLY_TAKEMEDICINE = p.Field<int?>("CURRENTLY_TAKEMEDICINE") ?? 0,
                                          PAST_MEDICALHISTORY = p.Field<int?>("PAST_MEDICALHISTORY") ?? 0,
                                          FAMILYHEALTH_PROBLEMHISTORY = p.Field<int?>("FAMILYHEALTH_PROBLEMHISTORY") ?? 0,
                                          VACCINATIONS = p.Field<int?>("VACCINATIONS") ?? 0,
                                          DIETDESCRIBE_ID = p.IsNull("DIETTYPE_ID") ? 0 : p.Field<long?>("DIETTYPE_ID"),
                                          EXCERCISE_SCHEDULEID = p.IsNull("EXCERCISE_SCHEDULEID") ? 0 : p.Field<long?>("EXCERCISE_SCHEDULEID"),
                                          EXCERCISE_TEXT = p.Field<string>("EXCERCISE_TEXT") ?? "",
                                          ALERGYSUBSTANCE_ID = p.IsNull("ALERGYSUBSTANCE_ID") ? 0 : p.Field<long>("ALERGYSUBSTANCE_ID"),
                                          ALERGYSUBSTANCE_TEXT = p.Field<string>("ALERGYSUBSTANCE_TEXT") ?? "",
                                          SMOKESUBSTANCE_ID = p.IsNull("SMOKESUBSTANCE_ID") ? 0 : p.Field<long>("SMOKESUBSTANCE_ID"),
                                          SMOKESUBSTANCE_TEXT = p.Field<string>("SMOKESUBSTANCE_TEXT") ?? "",
                                          ALCOHALSUBSTANCE_ID = p.IsNull("ALCOHALSUBSTANCE_ID") ? 0 : p.Field<long>("ALCOHALSUBSTANCE_ID"),
                                          ALCOHALSUBSTANCE_TEXT = p.Field<string>("ALCOHALSUBSTANCE_TEXT") ?? "",
                                          CAFFEINATED_BEVERAGESID = p.IsNull("CAFFEINATED_BEVERAGESID") ? 0 : p.Field<long>("CAFFEINATED_BEVERAGESID"),
                                          CAFFEINATEDBEVERAGES_TEXT = p.Field<string>("CAFFEINATEDBEVERAGES_TEXT") ?? "",
                                          EMERG_CONT_FIRSTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_FIRSTNAME")) ?? "",
                                          EMERG_CONT_MIDDLENAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_MIDDLENAME")) ?? "",
                                          EMERG_CONT_LASTNAME = DecryptFields.Decrypt(p.Field<string>("EMERG_CONT_LASTNAME")) ?? "",
                                          Emergency_MobileNo = DecryptFields.Decrypt(p.Field<string>("EMRG_CONT_PHONENO")) ?? "",
                                          EMERG_CONT_RELATIONSHIP_ID = p.IsNull("EMERG_CONT_RELATIONSHIP_ID") ? 0 : p.Field<long>("EMERG_CONT_RELATIONSHIP_ID"),

                                      },
                                  }).FirstOrDefault();
                if (lst.UserDetails.DOB_Encrypt != "")
                {
                    var time = lst.UserDetails.DOB_Encrypt.Split(' ');

                    var time4 = time[0].Split('/');
                    try
                    {
                        var time1 = time4[0];
                        var time2 = time4[1];
                        var time3 = time4[2];

                        DateTime dt1 = new DateTime();
                        try
                        {
                            var dateime = time2 + '/' + time1 + '/' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        catch (Exception ex)
                        {
                            var dateime = time1 + '/' + time2 + '/' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        lst.UserDetails.DOB = dt1;
                    }
                    catch (Exception ex1)
                    {
                        time4 = time[0].Split('-');
                        var time1 = time4[0];
                        var time2 = time4[1];
                        var time3 = time4[2];


                        DateTime dt1 = new DateTime();
                        try
                        {
                            var dateime = time2 + '-' + time1 + '-' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        catch (Exception ex2)
                        {
                            var dateime = time1 + '-' + time2 + '-' + time3;
                            dt1 = Convert.ToDateTime(dateime);
                        }
                        lst.UserDetails.DOB = dt1;
                    }
                }
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>  /// User logout details update
        /// </summary>

        /// <param name="UserId">logged in user id</param>
        /// <returns>logout response</returns>
        public long User_LogOut(long UserId, string SessionId)
        {
            long retid;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USERID", UserId));
            param.Add(new DataParameter("@SESSIONID", SessionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                retid = ClsDataBase.Update("[MYCORTEX].USER_SP_LOGOUT", param);
                return retid;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public long User_LogOutAllDevice(long UserId)
        {
            long retid;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USERID", UserId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                retid = ClsDataBase.Update("[MYCORTEX].USER_SP_LOGOUTALLDEVICE", param);
                return retid;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public long Get_UserInstitution(string EmailId)
        {
            long InstitutionId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@EMAILID", EmailId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_INSTITUTION_GET]", param);
                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        return InstitutionId = Convert.ToInt64(dt.Rows[0][0]);
                    }
                    else
                    {
                        return 0;
                    }
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }
        public long Get_UserType(string EmailId)
        {
            long InstitutionId;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@EMAILID", EmailId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_TYPE_GET]", param);
                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        return InstitutionId = Convert.ToInt64(dt.Rows[0][0]);
                    }
                    else
                    {
                        return 0;
                    }
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        /// <summary>      
        /// checking DB connection validity
        /// </summary>          
        /// <returns>True if valid connection, False if Invalid Connection</returns>
        public bool CheckDBConnection()
        {
            if (ClsDataBase.checkConnection() == false)
            {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Build version details
        /// </summary>
        /// <returns>Build version details</returns>
        public IList<EmployeeLoginModel> BuildVersion_Details()
        {
            List<DataParameter> param = new List<DataParameter>();
            //  param.Add(new DataParameter("@Id", Id));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].AppBuild_SP_VersionDetails", param);
                List<EmployeeLoginModel> LPH = (from p in dt.AsEnumerable()
                                                select new EmployeeLoginModel()
                                                {
                                                    Id = p.Field<long>("Id"),
                                                    ExecutionDate = p.Field<DateTime?>("BUILD_DATE"),
                                                    BuildNo = p.Field<string>("BUILD_VERSION"),
                                                    SystemName = p.Field<string>("SYSTEM_NAME"),
                                                    LoginUser = p.Field<string>("BUILD_USER"),

                                                }).ToList();
                return LPH;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>      
        /// to get the user information to display in layout page when the user login
        /// user information = User last logouttime, User profile photo URL, User Name
        /// </summary>      
        /// <param name="Id">Logged in Employee Id</param>         
        /// <returns>returns basic user information as serialized JSON object</returns>
        public IList<EmployeeLoginModel> UserLogged_Details(long Id)
        {

            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@SESSION_ID", HttpContext.Current.Session["Login_Session_Id"]));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataEncryption decrypt = new DataEncryption();
                DataEncryption DecryptFields = new DataEncryption();
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERLOGIN_SP_DETAILS]", param);

                IList<EmployeeLoginModel> LPH = (from p in dt.AsEnumerable()
                                                select new EmployeeLoginModel()
                                                {
                                                    LogInTime = p.Field<DateTime?>("LogInTime"),
                                                    Photo = p.Field<string>("PHOTO_NAME"),
                                                    FileName = p.Field<string>("PHOTO_FILENAME"),
                                                    FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                                    GENDER_NAME = p.Field<string>("GENDER_NAME"),
                                                    Photo_Fullpath = p.IsNull("PHOTO_FULLPATH") ? null : p.Field<string>("PHOTO_FULLPATH"),
                                                    Employee_Name = p.IsNull("EMAILID") ? null : DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                                    Name = p.IsNull("Name") ? null : p.Field<string>("Name"),
                                                    // BlobName = decrypt.DecryptFile(p.IsNull("BLOBDATA") ? null : p.Field<byte[]>("BLOBDATA")),
                                                    PhotoBlob = p.IsNull("BLOBDATA") ? null : decrypt.DecryptFile(p.Field<byte[]>("BLOBDATA")),
                                                    PatientType = p.Field<int>("PATIENT_TYPE"),
                                                    NATIONALITY_ID = p.Field<long>("NATIONALITY_ID"),
                                                    DOB = p.Field<DateTime>("DOB"),
                                                    MOBILE_NO = DecryptFields.Decrypt(p.Field<string>("MOBILE_NO")),
                                                    USERTYPE_ID = p.Field<long>("USERTYPE_ID"),
                                                    UserType = p.Field<string>("USERTYPE")
                                                }).ToList();


                return LPH;

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>     
        /// to Update Password of a user for Change password
        /// </summary>
        /// <param name="NewPassword">New password</param>        
        /// <param name="OldPassword">Old Password</param>  
        /// <param name="Confirmpassword">Confirm new password</param>  
        /// <returns>success/failure of change password</returns>
        public int ChangePassword(long Id, string NewPassword, string OldPassword, string Confirmpassword, long ModifiedUser_Id, long InstitutionId, int PageTypeId)
        {
            int flag = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@NewPassword", NewPassword));
            param.Add(new DataParameter("@OldPassword", OldPassword));
            param.Add(new DataParameter("@Confirmpassword", Confirmpassword));
            param.Add(new DataParameter("@ModifiedUser_Id", Id));
            param.Add(new DataParameter("@InstitutionId", InstitutionId));
            param.Add(new DataParameter("@PAGETYPEID", PageTypeId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                flag = ClsDataBase.Update("[MYCORTEX].[LOGIN_SP_CHANGEPASSWORD]", param);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return flag;
        }

        /// <summary>     
        /// to Reset Password of a user
        /// </summary>
        /// <param name="NewPassword">NewPassword</param>        
        /// <param name="ReenterPassword">Reentered Password</param>        
        /// <returns>success/failure response</returns>
        public ResetPasswordReturnModel ResetPassword(long Id, string NewPassword, string ReenterPassword, long Institution_Id, long createdBy, string EmailId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@Id", Id));
            param.Add(new DataParameter("@NewPassword", NewPassword));
            param.Add(new DataParameter("@ReenterPassword", ReenterPassword));
            param.Add(new DataParameter("@EmailId", EmailId));
            param.Add(new DataParameter("@MODIFIEDUSER_ID", createdBy));
            param.Add(new DataParameter("@INSTITUTIONID", Institution_Id));

            //  param.Add(new DataParameter("@FullName", FullName));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[LOGIN_SP_RESETPASSWORD]", param);
                ResetPasswordReturnModel Active = (from p in dt.AsEnumerable()
                                                   select new ResetPasswordReturnModel()
                                                   {
                                                       ReturnFlag = p.Field<int>("flag"),
                                                       ResetPassword = new LoginModel()
                                                       {
                                                           UserId = p.IsNull("ID") ? 0 : p.Field<long>("ID"),
                                                           Username = p.Field<string>("FULLNAME") ?? "",
                                                           Email = p.Field<string>("EMAILID") ?? "",
                                                       }
                                                   }).FirstOrDefault();
                return Active;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        /// <summary>
        /// Getting User Basic Details for the given filter
        /// </summary>
        /// <param name="UserTypeId"> User Type Id (business users, patient)</param>
        /// <param name="InstitutionId">institution of the user</param>
        /// <returns>user basic details list model</returns>
        public IList<UsertypeModal> Userdetailslist(int UserTypeId, long InstitutionId)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@USERTYPEID", UserTypeId));
            param.Add(new DataParameter("@INSTITUTIONID", InstitutionId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTYPE_BASIC_DETAILS]", param);
                List<UsertypeModal> lst = (from p in dt.AsEnumerable()
                                           select new UsertypeModal()
                                           {
                                               Id = p.Field<long>("ID"),
                                               FirstName = DecryptFields.Decrypt(p.Field<string>("FIRSTNAME")),
                                               FullName = DecryptFields.Decrypt(p.Field<string>("FULLNAME")),
                                               //FirstName = p.Field<string>("FIRSTNAME"),
                                               //FullName = p.Field<string>("FULLNAME"),
                                               Department_Id = p.Field<long?>("DEPARTMENT_ID"),
                                               EmailId = DecryptFields.Decrypt(p.Field<string>("EMAILID")),
                                               // EmailId = p.Field<string>("EMAILID"),
                                               UserType_Id = p.Field<long?>("USERTYPE_ID")
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
        /// User Type Details to populate dropdown
        /// </summary>          
        /// <returns>User Type Details </returns>
        public IList<UsertypeModal> Usertypedetailslist()
        {
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USERTYPE_DETAILS_LIST]");
                List<UsertypeModal> lst = (from p in dt.AsEnumerable()
                                           select new UsertypeModal()
                                           {
                                               Id = p.Field<long>("ID"),
                                               TypeName = p.Field<string>("TYPENAME"),
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
        /// get the count of password change history of a user - if no history, change password prompted for the user
        /// </summary>
        /// <param name="UserId">User id</param>
        /// <returns>change password history count</returns>
        public LoginModel GetPasswordHistory_Count(long UserId)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@UserId", UserId));
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {

                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_PASSWORDHISTORY_COUNT]", param);
                LoginModel lst = (from p in dt.AsEnumerable()
                                  select new LoginModel()
                                  {
                                      PasswordCount = p.Field<int>("PasswordCount")
                                  }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        public List<UserNotificationListModel> User_get_NotificationCount(long User_Id)
        {
            UserNotificationListModel model = new UserNotificationListModel();
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@USER_ID", User_Id));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].NOTIFICATION_UNREAD_COUNT", param);
                List<UserNotificationListModel> lst = (from p in dt.AsEnumerable()
                                                       select new UserNotificationListModel()
                                                       {
                                                           NotificationTotal = p.Field<int>("TotalCount"),
                                                           NotificationUnread = p.Field<int>("UnreadCount")
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
        /// User changed or reset the password date
        /// </summary>
        /// <param name="UserId">logged in user id</param>
        /// <returns>Retuen the date</returns>
        public UsertypeModal LastPasswordChangeTime(long UserId)
        {
            DataEncryption DecryptFields = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            _logger.Info(serializer.Serialize(param.Select(x => new { x.ParameterName, x.Value })));
            try
            {
                param.Add(new DataParameter("@USERID", UserId));
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[USER_SP_LASTPASSWORDCHANGETIME]", param);
                UsertypeModal lst = (from p in dt.AsEnumerable()
                                     select new UsertypeModal()
                                     {
                                         ChangedDate = p.Field<DateTime?>("PASSWORDCHANGEDDATE")
                                     }).FirstOrDefault();
                return lst;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// check login user authentication, stores Login History
        /// </summary>
        /// <param name="loginObj">Login Credentials</param>
        /// <returns>Login validity details and User Information</returns>
        //  public LoginModel Userlogin_Validate(System.Security.Claims.ClaimsIdentity identity)
        public LoginModel Userlogin_Validate(string Username, string Password)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@UserName", Username));
            param.Add(new DataParameter("@Password", Password));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].LOGIN_SP_SUPERADMINVALIDATION", param);
            LoginModel lst = (from p in dt.AsEnumerable()
                              select
                              new LoginModel()
                              {
                                  data = p.Field<int>("FLAG"),
                              }).FirstOrDefault();
            return lst;
        }

        /// <summary>
        /// check expiry date
        /// </summary>
        /// <param name="InstanceId">Instance Id</param>
        /// <returns>expired or not</returns>
        //  public bool CheckExpiryDate(Int64 InstanceId)
        public bool CheckExpiryDate()
        {
            bool isExpired = true;
            DataEncryption DecryptFields = new DataEncryption();
            try
            {
                String ExpiryDate = ClsDataBase.GetScalar("[MYCORTEX].[GET_EXPIRYDATE]").ToString();

                if(!String.IsNullOrEmpty(ExpiryDate))
                    ExpiryDate = DecryptFields.Decrypt(ExpiryDate);

                if (Convert.ToDateTime(ExpiryDate) > DateTime.UtcNow.Date)
                    isExpired = false;

                if(Convert.ToDateTime(ExpiryDate) == DateTime.UtcNow.Date)
                    isExpired = false;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return isExpired;
        }
        /// <summary>
        /// Product details
        /// </summary>
        /// <returns>Product details</returns>
        public IList<EmployeeLoginModel> GetProduct_Details()
        {
            try
            {
                DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_SP_EXPIRYDATE");

                IList<EmployeeLoginModel> lst = (from p in dt.AsEnumerable()
                                                 select new EmployeeLoginModel()
                                                 {
                                                    ProductName = p.Field<string>("PRODUCTNAME"),
                                                    ProductImg = p.Field<string>("PRODUCTIMAGE"),
                                                    ProductCopyRight = p.Field<string>("COPYRIGHT"),
                                                 }).ToList();
                return lst;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}


