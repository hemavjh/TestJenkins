using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using log4net;
using MyCortex.Repositories.Admin;
using MyCortex.Repositories;
using MyCortex.User.Model;
using MyCortex.Utilities;
using MyCortex.Admin.Models;
using System.Configuration;
using MyCortex.Masters.Models;
using MyCortex.Repositories.Uesr;
using System.Net.Security;
using MyCortex.Email.SendGrid;
using System.Net.Mail;
using SendGrid.Helpers.Mail;
using MyCortex.Notification.Models;
using MyCortex.Notification;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Repositories.Masters;
using MyCortex.Provider;
using MyCortex.User.Models;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace MyCortex.User.Controller
{
    [Authorize]
    public class UserController : ApiController
    {
        static readonly IUserRepository repository = new UserRepository();
        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        IList<AppConfigurationModel> AppConfigmodel;
        private Int64 InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);

        /// <summary>      
        /// Getting list of Doctor Affiliation Institution list
        /// </summary>          
        /// <returns>list of Doctor Affiliation Institution list</returns>
        [HttpGet]
        public IList<DoctorInstitutionModel> DoctorInstitutionList()
        {
            IList<DoctorInstitutionModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DoctorInstitutionList();
                return model;
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
        [HttpGet]
        public IList<DepartmentModel> DepartmentList()
        {
            IList<DepartmentModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DepartmentList();
                return model;
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
        [HttpGet]
        public IList<BusinessUser_UserTypeListModel> BusinessUser_UserTypeList()
        {
            IList<BusinessUser_UserTypeListModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.BusinessUser_UserTypeList();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>      
        /// Getting user list of a institution
        /// </summary>          
        /// <returns> user list of a institution</returns>
      //  [CheckSessionOutFilter]
        [HttpGet]
        public IList<ItemizedUserDetailsModel> UserDetailsbyUserType_List(long Id, int? IsActive, Guid Login_Session_Id)
        {
            IList<ItemizedUserDetailsModel> model;
            model = UserDetails_List(Id, Int32.Parse(HttpContext.Current.Session["InstitutionId"].ToString()), IsActive, Login_Session_Id);
            return model;
        }
        /// <summary>      
        /// Getting user list of a institution
        /// </summary>          
        /// <returns> user list of a institution</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<ItemizedUserDetailsModel> UserDetails_List(long Id, long InstitutionId, int? IsActive, Guid Login_Session_Id)
        {
            IList<ItemizedUserDetailsModel> model;
            model = repository.UserDetails_List(Id, InstitutionId, IsActive, Login_Session_Id);
            return model;
        }

        [AllowAnonymous]
        public long GetInstitutionFromCode(string Code)
        {
            long InstitutionId = 0;
            InstitutionId = repository.GetInstitutionFromShortName(Code);
            return InstitutionId;
        }
        [AllowAnonymous]
        public string GetInstitutionName(string Code)
        {
            string InstitutionName = "";
            InstitutionName = repository.GetInstitutionName(Code);
            return InstitutionName;
        }


        /// <summary>
        /// to Insert/Update the Sign up Users, Hospital Admin and Business Users for a Institution
        /// </summary>
        /// <param name="userObj">User Information</param>
        /// <returns>Status message with inserted/updated user information</returns>
        [AllowAnonymous]
        public HttpResponseMessage User_InsertUpdate(Guid Login_Session_Id, [FromBody] UserModel userObj)
        {
            if (Login_Session_Id == null)
            {
                Login_Session_Id = new Guid();
            }
            // var LoginSession = Login_Session_Id;
            var request = HttpContext.Current.Request.Url.Authority;
            if (userObj.INSTITUTION_ID == null || userObj.INSTITUTION_ID == 0)
            {
                if (!string.IsNullOrEmpty(userObj.INSTITUTION_CODE))
                {
                    userObj.INSTITUTION_ID = repository.GetInstitutionFromShortName(userObj.INSTITUTION_CODE);
                }
                //else
                //{
                //    userObj.INSTITUTION_ID = repository.GetInstitutionForWebURL(request);
                //}
                //  return model;
                //UserModel Ins_model = new UserModel();
                //Ins_model = repository.GetInstitutionForWebURL(request);
                //   userObj.INSTITUTION_ID = Ins_model.INSTITUTION_ID;
            }
            if (userObj.INSTITUTION_ID == 0)
            {
                // userObj.INSTITUTION_ID = InstitutionId;
                return Request.CreateResponse(HttpStatusCode.PreconditionFailed, "Invalid Institution!");
            }
            string defaultPwd = "P@ssw0rd";
            AppConfigmodel = commonrepository.AppConfigurationDetails("User.defaultPassword", InstitutionId);
             if (AppConfigmodel.Count > 0)
            {
                defaultPwd = AppConfigmodel[0].ConfigValue;
            }
            // string defaultPwd = ConfigurationManager.AppSettings["User.defaultPassword"];
            string generatedPwd = "";
            if (ModelState.IsValid)
            {
                if (userObj.Photo != null)
                {
                    userObj.Photo_Fullpath = System.Web.HttpContext.Current.Server.MapPath("~/" + userObj.Photo);
                }
                if (userObj.UPLOAD_FILENAME != null)
                {
                    userObj.FILE_FULLPATH = System.Web.HttpContext.Current.Server.MapPath("~/" + userObj.UPLOAD_FILENAME);
                }  
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            UserModel ModelData = new UserModel();
            UserReturnModel model = new UserReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            //if (userObj.INSTITUTION_ID == null || userObj.INSTITUTION_ID == 0)
            //{
            //    model.Status = "False";
            //    model.Message = "Invalid Institution!";
            //    model.Error_Code = "";
            //    model.ReturnFlag = 0;
            //    model.UserDetails = ModelData;
            //    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            //}
            string messagestr = "";
            try
            {
                if (userObj.UserType_Id <= 0 || userObj.UserType_Id == null)
                    throw new System.ArgumentException("User Type is missing", "UserData");
                else if (userObj.EMAILID == "" || userObj.EMAILID == null)
                    throw new System.ArgumentException("User Name is missing", "UserData");
                else if (userObj.INSTITUTION_ID <= 0 || userObj.INSTITUTION_ID == null)
                    throw new System.ArgumentException("Institution is missing", "UserData");
                else if (userObj.ApprovalFlag == "" || userObj.ApprovalFlag == null)
                    throw new System.ArgumentException("Approval Flag is missing", "UserData");

                EmailGeneration egmodel = new EmailGeneration();
                if(userObj.Id==0)
                    generatedPwd = egmodel.GeneratePassword_ByPasswordPolicy(userObj.INSTITUTION_ID.Value);

                userObj.PASSWORD = generatedPwd;
                if (userObj.PASSWORD == "") userObj.PASSWORD = defaultPwd;   // this is for demo // default pwd when password policy not exist for the institution
                DataEncryption EncryptPassword = new DataEncryption();
                userObj.PASSWORD = EncryptPassword.Encrypt(userObj.PASSWORD);
                string FormulaforFullName = "";
                FormulaforFullName = "[L],[F]";
                /*get full name formula*/
                IList<AppConfigurationModel> modelLF_Formula;
                modelLF_Formula = commonrepository.AppConfigurationDetails("FULLNAME_FORMULA", userObj.INSTITUTION_ID.Value);
                if (modelLF_Formula[0].ConfigValue != null)
                    FormulaforFullName = modelLF_Formula[0].ConfigValue;

                string Replaced_FullName = "";
                Replaced_FullName = FormulaforFullName.Replace("[L]", userObj.LastName).Replace("[F]", userObj.FirstName);
                userObj.FullName = EncryptPassword.Encrypt(Replaced_FullName);
                userObj.FirstName = EncryptPassword.Encrypt(userObj.FirstName);
                userObj.MiddleName = EncryptPassword.Encrypt(userObj.MiddleName);
                userObj.LastName = EncryptPassword.Encrypt(userObj.LastName);
                //userObj.MNR_NO = EncryptPassword.Encrypt(userObj.MNR_NO);
                userObj.INSURANCEID = EncryptPassword.Encrypt(userObj.INSURANCEID);
                userObj.NATIONALID = EncryptPassword.Encrypt(userObj.NATIONALID);
                userObj.MOBILE_NO = EncryptPassword.Encrypt(userObj.MOBILE_NO);
                userObj.EMERG_CONT_FIRSTNAME = EncryptPassword.Encrypt(userObj.EMERG_CONT_FIRSTNAME);
                userObj.EMERG_CONT_LASTNAME = EncryptPassword.Encrypt(userObj.EMERG_CONT_LASTNAME);
                userObj.DOB_Encrypt = EncryptPassword.Encrypt(userObj.DOB.ToString());
                userObj.EMERG_CONT_MIDDLENAME = EncryptPassword.Encrypt(userObj.EMERG_CONT_MIDDLENAME);
                userObj.Emergency_MobileNo = EncryptPassword.Encrypt(userObj.Emergency_MobileNo);
                userObj.EMAILID = EncryptPassword.Encrypt(userObj.EMAILID.ToLower());
                userObj.GOOGLE_EMAILID = EncryptPassword.Encrypt(userObj.GOOGLE_EMAILID);
                userObj.FB_EMAILID = EncryptPassword.Encrypt(userObj.FB_EMAILID);
                userObj.appleUserID = EncryptPassword.Encrypt(userObj.appleUserID);
                //userObj.PATIENT_ID = EncryptPassword.Encrypt(userObj.PATIENT_ID);
                if (userObj.ApprovalFlag == "0")
                {
                    userObj.Patient_Type = 1;
                }
                ModelData = repository.Admin_InsertUpdate(Login_Session_Id,userObj);

                if ((ModelData.flag == 1) == true)
                {
                    messagestr = "Email already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }else if ((ModelData.flag == 8) == true)
                {
                    if(userObj.GOOGLE_EMAILID != "")
                    {
                        messagestr = "The Gmail added is linked with another user. Please contact your hospital administrator";
                    }else if (userObj.FB_EMAILID != "")
                    {
                        messagestr = "The facebook added is linked with another user. Please contact your hospital administrator";
                    }
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 10) == true)
                {
                    if (userObj.GOOGLE_EMAILID != "")
                    {
                        messagestr = "the Gmail added is linked with " + Replaced_FullName + " ";
                    }else if (userObj.FB_EMAILID != "")
                    {
                        messagestr = "the facebook added is linked with " + Replaced_FullName + " ";
                    }
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 11) == true)
                {
                    messagestr = "Employment Number already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }

                else if ((ModelData.flag == 12) == true)
                {
                    messagestr = "Patient ID already exists, cannot be Duplicated";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }

                else if ((ModelData.flag == 2) == true)
                {
                    messagestr = "User created successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((ModelData.flag == 3) == true)
                {
                    messagestr = "User updated successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((ModelData.flag == 4) == true)
                {
                    messagestr = "Master Admin already exist for this Institution, cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 5) == true)
                {
                    messagestr = "Maximum Number of Patient License reached already, cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 6) == true)
                {
                    messagestr = "Maximum Number of Business Users License reached already, cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }

                model.Error_Code = "";
                model.UserDetails = ModelData;
                model.Message = messagestr;// "User created successfully";

                // create cometchat user only in insert
                if (ModelData.flag == 2)
                {
                    createCometChatUser(ModelData, (long)userObj.INSTITUTION_ID, 0);
                }
                else if(ModelData.flag == 3)
                {
                    createCometChatUser(ModelData, (long)userObj.INSTITUTION_ID, 1);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                // mailing the generated pwd to User
                if ((ModelData.flag == 2) == true)
                {
                    /*EmailGeneration Generator = new EmailGeneration();
                    EmailGenerateModel MailMessage = new EmailGenerateModel();
                    MailMessage.Institution_Id = userObj.INSTITUTION_ID.Value;
                    MailMessage.MessageToId = userObj.EMAILID;
                    MailMessage.MessageSubject = "Welcome - Mycortex Registration";
                    MailMessage.MessageBody = PasswordEmailBodyCompose(userObj.EMAILID, generatedPwd);
                    MailMessage.Created_By = userObj.CREATED_BY ?? 0;
                    var userid = ModelData.Id;
                    MailMessage.UserId = userid;
                    Generator.SendEmail(MailMessage);*/

                    /*
                    EmailConfigurationModel emailModel = new EmailConfigurationModel();
                    emailModel = emailrepository.EmailConfiguration_View((long)userObj.INSTITUTION_ID);
                    if (emailModel != null)
                    {
                        SendGridMessage msg = SendGridApiManager.ComposeSendGridMessage(emailModel.UserName, emailModel.Sender_Email_Id, "Welcome - Mycortex Registration", PasswordEmailBodyCompose(EncryptPassword.Decrypt(userObj.EMAILID), EncryptPassword.Decrypt(userObj.PASSWORD)), model.UserDetails.FullName, EncryptPassword.Decrypt(userObj.EMAILID));

                        SendGridApiManager mail = new SendGridApiManager();
                        var res = mail.SendEmailAsync(msg, 0);
                    }*/

                    string Event_Code = "";
                    if (userObj.ApprovalFlag == "0" && userObj.UserType_Id == 2)
                    {
                        Event_Code = "PATIENTSIGNUP";
                    }
                    else if(userObj.UserType_Id !=2 && userObj.UserType_Id != 3)
                    {
                        Event_Code = "BUSUSER_CREATE";
                    }
                    else if (userObj.UserType_Id == 3)
                    {
                        Event_Code = "INS_CREATION";
                    }
                    else if (userObj.ApprovalFlag != "0" && userObj.UserType_Id == 2)
                    {
                        Event_Code = "PAT_SIGNUP_APPROVE";
                    }

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    if(Event_Code == "INS_CREATION")
                    {
                        EmailList = AlertEventReturn.InstitutionCreateEvent((long)ModelData.Id, (long)userObj.INSTITUTION_ID);
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData.Id, -1, EmailList);
                    }
                    else
                    {
                        EmailList = AlertEventReturn.UserCreateEvent((long)ModelData.Id, (long)userObj.INSTITUTION_ID);
                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData.Id, (long)userObj.INSTITUTION_ID, EmailList);
                    }


                    if (userObj.ApprovalFlag == "0" && userObj.UserType_Id == 2)
                    {
                        Event_Code = "PAT_SIGNUP_HOSADMIN";
                        AlertEvents AlertEventReturn_HA = new AlertEvents();
                        IList<EmailListModel> EmailList_HA;
                        EmailList_HA = AlertEventReturn.Patient_SignUp_HosAdmin_AlertEvent((long)ModelData.Id, (long)userObj.INSTITUTION_ID);

                        AlertEventReturn_HA.Generate_SMTPEmail_Notification(Event_Code, ModelData.Id, (long)userObj.INSTITUTION_ID, EmailList_HA);
                    }

                    IList<UserLimit_AlertEventModel> ReturnModel;
                    ReturnModel = AlertEventReturn.AlertEvent_Get_UserLimit_List((long)userObj.INSTITUTION_ID, ModelData.Id);
                    if (ReturnModel.Count >= 1)
                    {
                        if (userObj.UserType_Id == 2)
                            Event_Code = "NEAR_PAT_LIMIT";
                        else
                            Event_Code = "NEAR_USR_LIMIT";

                        EmailList = AlertEventReturn.UserLimit_EmailList((long)userObj.INSTITUTION_ID);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData.Id, (long)userObj.INSTITUTION_ID, EmailList);
                    }

                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating User";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        private string PasswordEmailBodyCompose(string Email, string Password)
        {
            string bdy = "";
            bdy = "Dear " + Email + "<br>" + "Welcome!" + "<br>" + "Your password to access Mycortex application is: " + Password + "<br>" + "Thanks," + "<br>" + "Mycortex Team";
            return bdy;
        }
        /// <summary>
        /// to Create a User in Cometchat
        /// </summary>
        /// <param name="usrObj">user detail</param>
        /// <param name="Institution">Institution Id</param>
        /// <returns></returns>
        public int createCometChatUser(UserModel usrObj, long Institution, int isCreate = 0)
        {

            DataEncryption EncryptPassword = new DataEncryption();
            IList<AppConfigurationModel> App_Id;
            IList<AppConfigurationModel> App_Key;

            string AppId = "COMETCHAT_APPID";
            string Appkey = "COMETCHAT_APPKEY";
            long InstitutionId = Institution;
            App_Id = commonrepository.AppConfigurationDetails(AppId, InstitutionId);
            App_Key = commonrepository.AppConfigurationDetails(Appkey, InstitutionId);

            try
            {
                // Ignore certificate warnings
                ServicePointManager.ServerCertificateValidationCallback =
                     new RemoteCertificateValidationCallback(delegate { return true; });
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;

                string url = "https://api-eu.cometchat.io/v2.0/users";
                if (isCreate == 1)
                    url = "https://api-eu.cometchat.io/v2.0/users/" + usrObj.Id.ToString();

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
                httpWebRequest.ContentType = "application/json";
                if (isCreate == 1)
                    httpWebRequest.Method = "PUT";
                else
                    httpWebRequest.Method = "POST";

                // UAT
                //httpWebRequest.Headers.Add("appId", "14908c195427850");
                //httpWebRequest.Headers.Add("apiKey", "a65b79708a7339c54bf120cb2c2fd36be88cee86");

                //QA
                //httpWebRequest.Headers.Add("appId", ConfigurationManager.AppSettings["CometChat.AppId"].ToString());
                //httpWebRequest.Headers.Add("apiKey", ConfigurationManager.AppSettings["CometChat.APIKey"].ToString());

                httpWebRequest.Headers.Add("appId", App_Id[0].ConfigValue);
                httpWebRequest.Headers.Add("apiKey", App_Key[0].ConfigValue);

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    //string json = "{\"uid\":\"" + usrObj.EMAILID.Replace("@","").Replace(".","") + "_" + usrObj.INSTITUTION_ID.ToString() + "_" + usrObj.Id.ToString() + "\",\"name\":\"mycortexdev1_1_1\",\"metadata\":\"{name:" + usrObj.EMAILID + ", Id:" + usrObj.Id.ToString() + "}\"}";
                    string json = "{\"uid\":\"" + usrObj.Id.ToString() + "\",\"name\":\"" + usrObj.FullName + "\",\"metadata\":\"{Email:" + usrObj.EMAILID + ", Id:" + usrObj.Id.ToString() + "}\"}";
                    //string json = "{\"metadata\":\"{Email:" + usrObj.EMAILID + ", Id:" + usrObj.Id.ToString() + "}\"}";
                    streamWriter.Write(json);
                }
                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                return 1;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }
        /// <summary>
        /// to get User basic details of a User Id 
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>User basic details</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public UserModel UserDetails_View(long Id, Guid Login_Session_Id)
        {
            UserModel model = new UserModel();
            model = repository.UserDetails_View(Id, Login_Session_Id);
            return model;
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
        /// <param name="EndRowNumber"></param>
        /// <param name="SearchQuery"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<ItemizedUserDetailsModel> Patient_List(long? Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int? IsActive, long? INSTITUTION_ID, int StartRowNumber, int EndRowNumber,String SearchQuery,string SearchEncryptedQuery)
        {
            IList<ItemizedUserDetailsModel> model;
            if (INSTITUTION_ID == null)
            {
                INSTITUTION_ID = Int16.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
            }
            else if (INSTITUTION_ID == 0)
            {
                INSTITUTION_ID = Int16.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
            }
            model = repository.Patient_List(Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, IsActive, INSTITUTION_ID, StartRowNumber, EndRowNumber, SearchQuery, SearchEncryptedQuery);
            return model;
        }
        /// <summary>
        /// to deactivate a User
        /// </summary>
        /// <param name="Id">User id</param>
        /// <returns>success status of user deactivated</returns>
        [HttpGet]
        public HttpResponseMessage UserDetails_InActive(long Id)
        {
            if (Id > 0)
            {
                string messagestr = "";
                UserModel ModelData = new UserModel();
                UserReturnModel model = new UserReturnModel();
                try
                {
                    model = repository.UserDetails_InActive(Id);
                    if ((model.ReturnFlag == 2) == true)
                    {
                        messagestr = "Master Admin Can't Be Deactivate!";
                        model.ReturnFlag = 0;
                        model.Status = "False";
                    }
                    else if ((model.ReturnFlag == 1) == true)
                    {
                        messagestr = "User Details has been Deactivated Successfully";
                        model.ReturnFlag = 1;
                        model.Status = "True";
                    }

                    model.Error_Code = "";
                    model.UserDetails = ModelData;
                    model.Message = messagestr;
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Error_Code = ex.Message;
                    model.ReturnFlag = 0;
                    model.UserDetails = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
                //repository.UserDetails_InActive(Id);
                //HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                //return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }
        /// <summary>
        /// to activate a user
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns>success status of user activated</returns>
        [HttpGet]
        public HttpResponseMessage UserDetails_Active(long Id)
        {
            //UserModel model = new UserModel();
            UserModel ModelData = new UserModel();
            UserReturnModel model = new UserReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }

            string messagestr = "";
            try
            {
                model = repository.UserDetails_Active(Id);

                if ((model.ReturnFlag == 2) == true)
                {
                    messagestr = "Maximum Number of Patient License reached already, cannot be activated";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((model.ReturnFlag == 3) == true)
                {
                    messagestr = "Maximum Number of Business Users License reached already, cannot be activated";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((model.ReturnFlag == 1) == true)
                {
                    messagestr = "User Details has been activated Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }

                model.Error_Code = "";
                model.UserDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        /// <summary>
        /// to add a new Group to a institution
        /// </summary>
        /// <param name="insobj">group details </param>
        /// <returns>status detail of group creation</returns>
        public HttpResponseMessage GroupMaster_Insert([FromBody] GroupCreateModel insobj)
        {
            GroupCreateModel ModelData = new GroupCreateModel();
            string messagestr = "";
            try
            {
                ModelData = repository.GroupMaster_Insert(insobj);
                if ((ModelData.flag == 1) == true)
                {
                    messagestr = "Group Name already exist, cannot be Duplicated";
                }
                else if ((ModelData.flag == 2) == true)
                {
                    messagestr = "Group created successfully";
                }
                ModelData.returnMessage = messagestr;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, ModelData);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return Request.CreateResponse(HttpStatusCode.BadRequest, ModelData);
            }
        }

        /// <summary>
        /// to add Group's to a patient/business user
        /// </summary>
        /// <param name="insobj">user and group details </param>
        /// <returns>status detail of group assigned to users</returns>
        public HttpResponseMessage AssignedGroup_Insert(List<AssignedGroupModel> model)
        {
            try
            {
                long id = repository.AssignedGroup_Insert(model);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, id);
                return response;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);

            }
        }

        /// <summary>
        /// Patient Basic detail of a Patient
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>Patient Basic detail of a Patient</returns>
        [HttpGet]
        public ItemizedUserDetailsModel PatientBasicDetailsList(long PatientId)
        {
            ItemizedUserDetailsModel model = new ItemizedUserDetailsModel();
            model = repository.PatientBasicDetailsList(PatientId);
            return model;
        }

        /// <summary>
        /// Patient group name list
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<ItemizedUserDetailsModel> PatientGroupNameList(long? PatientId)
        {
            IList<ItemizedUserDetailsModel> model;
            model = repository.PatientGroupNameList(PatientId);
            return model;
        }

        /// <summary>
        /// patient's allergy list for patient data page
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>patient's allergy list</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<PatientAllergiesNameListModels> PatientAllergiesNameList(long? PatientId)
        {
            IList<PatientAllergiesNameListModels> model;
            model = repository.PatientAllergiesNameList(PatientId);
            return model;
        }

        /// <summary>
        /// Patient Health Data List of a Patient for the selected option
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="OptionType_Id">Daily(1), 1 Week(2), 1 Month(3), 3 Month(4), 1 Year(5), Year Till Date(6) and All(7)</param>
        /// <returns>List of Health Data</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientHealthDataDetails_List(long Patient_Id, int OptionType_Id, long Group_Id, Guid Login_Session_Id, int Active = 1, long UnitsGroupType = 1, long StartRowNumber = 0, long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {
            IList<PatientHealthDataModel> model = new List<PatientHealthDataModel>();
            PatientHealthDataReturnModel modelReturn = new PatientHealthDataReturnModel();
            IList<AppConfigurationModel> configList;
            PatientHealthDataPagination _metadata = new PatientHealthDataPagination();
            try
            {
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }
                
                model = repository.HealthDataDetails_List(Patient_Id, OptionType_Id, Group_Id, UnitsGroupType, Login_Session_Id, StartRowNumber, EndRowNumber, Active);
                if (model != null)
                {
                    if(model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new PatientHealthDataLinks();
                        _metadata.Links.self = "/api/User/PatientHealthDataDetails_List?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                            "&Group_Id=" + Group_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/PatientHealthDataDetails_List?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                            "&Group_Id=" + Group_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/PatientHealthDataDetails_List?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                            "&Group_Id=" + Group_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/PatientHealthDataDetails_List?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                           "&Group_Id=" + Group_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/PatientHealthDataDetails_List?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                           "&Group_Id=" + Group_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }

                modelReturn.Status = "True";
                modelReturn.Message = "List of Patient Health Data";
                modelReturn.Error_Code = "";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                modelReturn.PatientHealthDataList = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                modelReturn.Status = "False";
                modelReturn.Message = "Error in getting Patient Health Data";
                modelReturn.Error_Code = ex.Message;
                modelReturn.ReturnFlag = 0;
                modelReturn.PatientHealthDataList = model;
                return Request.CreateResponse(HttpStatusCode.BadRequest, modelReturn);
            }
        }

        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientHealthData_List_On_Parameter(long Patient_Id, int OptionType_Id, long Group_Id, long Parameter_Id, Guid Login_Session_Id, int Active = 1, long UnitsGroupType = 1, long StartRowNumber = 0, long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {
            IList<PatientHealthDataModel> model = new List<PatientHealthDataModel>();
            PatientHealthDataReturnModel modelReturn = new PatientHealthDataReturnModel();
            IList<AppConfigurationModel> configList;
            PatientHealthDataPagination _metadata = new PatientHealthDataPagination();
            try
            {
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }

                model = repository.HealthData_List_On_Parameter(Patient_Id, OptionType_Id, Group_Id, Parameter_Id, UnitsGroupType, Login_Session_Id, StartRowNumber, EndRowNumber, Active);
                if (model != null)
                {
                    if (model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new PatientHealthDataLinks();
                        _metadata.Links.self = "/api/User/PatientHealthData_List_On_Parameter?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                            "&Group_Id=" + Group_Id + "&Parameter_Id=" + Parameter_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/PatientHealthData_List_On_Parameter?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                            "&Group_Id=" + Group_Id + "&Parameter_Id=" + Parameter_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/PatientHealthData_List_On_Parameter?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                            "&Group_Id=" + Group_Id + "&Parameter_Id=" + Parameter_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/PatientHealthData_List_On_Parameter?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                           "&Group_Id=" + Group_Id + "&Parameter_Id=" + Parameter_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/PatientHealthData_List_On_Parameter?Patient_Id=" + Patient_Id + "&OptionType_Id=" + OptionType_Id +
                           "&Group_Id=" + Group_Id + "&Parameter_Id=" + Parameter_Id + "&Active=" + Active + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }

                modelReturn.Status = "True";
                modelReturn.Message = "List of Patient Health Data";
                modelReturn.Error_Code = "";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                if (model.Count > 0)
                {
                    modelReturn.Average_Value = getAverage(model);
                } else
                {
                    modelReturn.Average_Value = 0;
                }
                modelReturn.PatientHealthDataList = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                modelReturn.Status = "False";
                modelReturn.Message = "Error in getting Patient Health Data";
                modelReturn.Error_Code = ex.Message;
                modelReturn.ReturnFlag = 0;
                modelReturn.PatientHealthDataList = model;
                return Request.CreateResponse(HttpStatusCode.BadRequest, modelReturn);
            }
        }

        private decimal getAverage(IList<PatientHealthDataModel> PatientHealthDataList)
        {
            decimal Total=0, Average=0;

            for (int i=0; i<PatientHealthDataList.Count; i++)
            {
                Total = Total + PatientHealthDataList[i].ParameterValue;
            }
            Average = Total / PatientHealthDataList.Count;
            return Average;
            /*return Average.ToString("#.##");*/
        }

        /// <summary>
        /// Patient Health Data List of a Patient for the selected option
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="OptionType_Id">Daily(1), 1 Week(2), 1 Month(3), 3 Month(4), 1 Year(5), Year Till Date(6) and All(7)</param>
        /// <returns>List of Health Data</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientLiveData_List(long Patient_Id, DateTime DataTime, Guid Login_Session_Id)
        {
            IList<PatientHealthDataModel> model = new List<PatientHealthDataModel>();
            PatientHealthDataReturnModel modelReturn = new PatientHealthDataReturnModel();
            try
            {
                model = repository.PatientLiveData_List(Patient_Id, DataTime, Login_Session_Id);

                modelReturn.Status = "True";
                modelReturn.Message = "List of Patient Health Data";
                modelReturn.Error_Code = "";
                modelReturn.ReturnFlag = 0;
                modelReturn.PatientHealthDataList = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                modelReturn.Status = "False";
                modelReturn.Message = "Error in getting Patient Health Data";
                modelReturn.Error_Code = ex.Message;
                modelReturn.ReturnFlag = 0;
                modelReturn.PatientHealthDataList = model;
                return Request.CreateResponse(HttpStatusCode.BadRequest, modelReturn);
            }
        }
        /// <summary>
        /// Daily Target vs Achieved details of a Patient
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns>List of Health Data for today</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientDailyGoalData_List(long Patient_Id, Guid Login_Session_Id)
        {

            IList<PatientHealthDataModel> model = new List<PatientHealthDataModel>();
            PatientHealthDataReturnModel modelReturn = new PatientHealthDataReturnModel();
            try
            {
                model = repository.GoalDataDetails_List(Patient_Id, Login_Session_Id);

                modelReturn.Status = "True";
                modelReturn.Message = "List of Patient Health Data for Today";
                modelReturn.Error_Code = "";
                modelReturn.ReturnFlag = 0;
                modelReturn.PatientHealthDataList = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                modelReturn.Status = "False";
                modelReturn.Message = "Error in getting Patient Health Data";
                modelReturn.Error_Code = ex.Message;
                modelReturn.ReturnFlag = 0;
                modelReturn.PatientHealthDataList = model;
                return Request.CreateResponse(HttpStatusCode.BadRequest, modelReturn);
            }
        }

        /// <summary>
        /// Parameter list master
        /// </summary>
        /// <returns>List of Parameter list JSON</returns>
        [HttpGet]
        public IList<MasterListModel> GetParameterNameList()
        {
            IList<MasterListModel> model;
            model = repository.GetParameterNameList();
            return model;
        }
        /// <summary>
        /// Insert Patient Health Data
        /// </summary>
        /// <param name="patientDataObj">Required Params: PatientId, ParameterId, ParameterValue, ActivityDate</param>
        /// <returns>inserted Health Data</returns>
      //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientHealthData_Insert_Update(Guid Login_Session_Id, [FromBody] PatientHealthDataModel patientDataObj)
        {
            PatientHealthDataModel ModelData = new PatientHealthDataModel();
            PatientHealthDataReturnModel model = new PatientHealthDataReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                model.PatientHealthDataDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                if (patientDataObj.ParameterId <= 0)
                    throw new System.ArgumentException("Parameter is missing", "HealthData");
                else if (patientDataObj.Patient_Id <= 0 && patientDataObj.Id <= 0)
                    throw new System.ArgumentException("Patient ID is missing", "HealthData");

                ModelData = repository.PatientHealthData_Insert_Update(Login_Session_Id,patientDataObj);
                if ((ModelData.flag == 0) == true)
                {
                    messagestr = "Patient data not created, Please check the data";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 1) == true)
                {
                    messagestr = "Patient Data created Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((ModelData.flag == 2) == true)
                {
                    messagestr = "Patient Data updated Successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((ModelData.flag == 3) == true)
                {
                    messagestr = "Patient Data Already Exits";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                model.Error_Code = "";
                model.PatientHealthDataDetails = ModelData;
                model.Message = messagestr;
                if ((ModelData.flag == 1) == true || (ModelData.flag == 2) == true)
                {
                    PatientHealthDataModel phm = new PatientHealthDataModel();
                    phm = repository.PatientHealthData_AlertNotification_List(ModelData.Id);
                    string Event_Code = "";
                    if (phm != null)
                    {
                        if (phm.HighCount > 0)
                            Event_Code = "DIAG_HIGH";
                        if (phm.MediumCount > 0)
                            Event_Code = "DIAG_MEDIUM";
                        if (phm.LowCount > 0)
                            Event_Code = "DIAG_LOW";

                        if (phm.HighCount > 0 || phm.MediumCount > 0 || phm.LowCount > 0)
                        {
                            AlertEvents AlertEventReturn = new AlertEvents();
                            IList<EmailListModel> EmailList;
                            EmailList = AlertEventReturn.Diagnostic_Compliance_AlertEvent((long)ModelData.Patient_Id, (long)ModelData.Institution_Id);

                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData.Id, (long)ModelData.Institution_Id, EmailList);
                        }
                    }
                }
                if ((ModelData.flag == 1) == true)
                {
                    string Event_Code = "";
                    Event_Code = "NEWDATA_CAPTURE";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    EmailList = AlertEventReturn.NewDataCapturedEvent((long)patientDataObj.Patient_Id, (long)ModelData.Institution_Id);

                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, patientDataObj.Patient_Id, (long)ModelData.Institution_Id, EmailList);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);

                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Health Data";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.PatientHealthDataDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientAppointmentList(long Patient_Id,Guid Login_Session_Id)
        {
            IList<PatientAppointmentsModel> ModelData = new List<PatientAppointmentsModel>();
            PatientAppointmentsReturnModel model = new PatientAppointmentsReturnModel();
            try
            {

                ModelData = repository.PatientAppointmentList(Patient_Id,Login_Session_Id);
                model.Status = "True";
                model.Message = "Patient Appointment";
                model.Error_Code = "";
                model.ReturnFlag = 1;
                model.PatientAppointmentList = ModelData;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in getting Patient Appointments";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.PatientAppointmentList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


        [HttpGet]
        [CheckSessionOutFilter]
        public HttpResponseMessage PatientPreviousAppointmentList(long Patient_Id, Guid Login_Session_Id)
        {
            IList<PatientAppointmentsModel> ModelData = new List<PatientAppointmentsModel>();
            PatientAppointmentsReturnModel model = new PatientAppointmentsReturnModel();
            try
            {

                ModelData = repository.PatientPreviousAppointmentList(Patient_Id, Login_Session_Id);
                model.Status = "True";
                model.Message = "Patient Previous Appointments";
                model.Error_Code = "";
                model.ReturnFlag = 1;
                model.PatientAppointmentList = ModelData;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in getting Patient Appointments";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.PatientAppointmentList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        /// <summary>
        /// Insert Patient Health Data
        /// </summary>
        /// <param name="patientDataObj">Required Params: PatientId, ParameterId, ParameterValue, ActivityDate</param>
        /// <returns>inserted Health Data</returns>
      //  [CheckSessionOutFilter]
        public int PatientHealthDataBulk_Insert_Update(Guid Login_Session_Id,PatientHealthDataListModel patientDataListObj)
        {
            var Loginsession = Login_Session_Id;
            PatientHealthDataModel model = new PatientHealthDataModel();
            if (!ModelState.IsValid)
            {
                return 0;
            }
            try
            {
                foreach (PatientHealthDataModel itemData in patientDataListObj.PatientHealthDataModel)
                {
                    itemData.Activity_Date = patientDataListObj.ActivityDate;
                    itemData.Created_By = patientDataListObj.Created_By;
                    itemData.Patient_Id = patientDataListObj.Patient_Id;
                    model = repository.PatientHealthData_Insert_Update(Login_Session_Id,itemData);

                    PatientHealthDataModel phm = new PatientHealthDataModel();
                    phm = repository.PatientHealthData_AlertNotification_List(model.Id);
                    string Event_Code = "";
                    if(phm != null)
                    {
                        if (phm.HighCount > 0)
                            Event_Code = "DIAG_HIGH";
                        else if (phm.MediumCount > 0)
                            Event_Code = "DIAG_MEDIUM";
                        else if (phm.LowCount > 0)
                            Event_Code = "DIAG_LOW";

                        if (phm.HighCount > 0 || phm.MediumCount > 0 || phm.LowCount > 0)
                        {
                            AlertEvents AlertEventReturn = new AlertEvents();
                            IList<EmailListModel> EmailList;
                            EmailList = AlertEventReturn.Diagnostic_Compliance_AlertEvent((long)patientDataListObj.Patient_Id, (long)model.Institution_Id);

                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, model.Id, (long)model.Institution_Id, EmailList);
                        }
                    }

                    {
                        Event_Code = "NEWDATA_CAPTURE";

                        AlertEvents AlertEventReturn = new AlertEvents();
                        IList<EmailListModel> EmailList;
                        EmailList = AlertEventReturn.NewDataCapturedEvent((long)patientDataListObj.Patient_Id, (long)model.Institution_Id);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, patientDataListObj.Patient_Id, (long)model.Institution_Id, EmailList);

                        Event_Code = "TARGET_DAILY";
                        TargetAchived_AlertEventModel tarobj = new TargetAchived_AlertEventModel();
                        tarobj = AlertEventReturn.AlertEvent_TargetAchievedDaily_List((long)model.Institution_Id, (long)patientDataListObj.Patient_Id);

                        if(tarobj != null)
                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, patientDataListObj.Patient_Id, (long)model.Institution_Id, EmailList);
                    }
                }

                return 1;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }

        }


        /// <summary>
        /// Parameter list of a patient
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<ParametersListModel> GroupParameterNameList(long Patient_Id, long UnitGroupType_Id = 1)
        {
            IList<ParametersListModel> model;
            model = repository.GroupParameterNameList(Patient_Id,UnitGroupType_Id);
            return model;
        }

        /// <summary>
        /// Parameter list of a patient
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<PatientInstituteModel> GETPATIENTINSTITUTION(long ID)
        {
            IList<PatientInstituteModel> model;
            model = repository.GETPATIENTINSTITUTION(ID);
            return model;
        }

        /// <summary>
        /// Parameters - Parameters Details List - Action - Inactive
        /// Selected Parameters details to be deactivated  by Id
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Parameters details to inactivate from Parameters database</returns>
        //[HttpGet]
        //public HttpResponseMessage ParametersDetails_Delete(long Id)
        //{
        //    if (Id > 0)
        //    {
        //        repository.ParametersDetails_Delete(Id);
        //        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
        //        return response;
        //    }
        //    else
        //    {
        //        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        //    }

        //}


        [HttpPost]
        public HttpResponseMessage ParametersDetails_Delete([FromBody] PatientHealthDataModel noteobj)
        {
            IList<PatientHealthDataModel> ModelData = new List<PatientHealthDataModel>();
            PatientHealthDataReturnModel model = new PatientHealthDataReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientHealthDataList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.ParametersDetails_Delete(noteobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Health Data deactivated Successfully";
                    model.ReturnFlag = 2;
                }

                model.PatientHealthDataList = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Health Data";
                model.ReturnFlag = 0;
                model.PatientHealthDataList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        /// <summary>
        /// Parameters - Parameters Details List - Action - Active
        /// activate Selected Parameters (LS,  details 
        /// </summary>
        /// <param name="Id">Id</param>
        /// <returns>Selected ID related Parameters details to activate again from Parameters database</returns>

        [HttpPost]
        public HttpResponseMessage ParametersDetails_Active([FromBody] PatientHealthDataModel noteobj)
        {
            IList<PatientHealthDataModel> ModelData = new List<PatientHealthDataModel>();
            PatientHealthDataReturnModel model = new PatientHealthDataReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientHealthDataList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.ParametersDetails_Active(noteobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Health Data activated successfully";
                    model.ReturnFlag = 2;
                }

                model.PatientHealthDataList = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Allergy";
                model.ReturnFlag = 0;
                model.PatientHealthDataList = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to attach photo or certificate of user
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Photo"></param>
        /// <param name="Certificate"></param>
        /// <returns></returns>
        [HttpPost]
        public List<string> AttachPhoto(int Id, int Photo, int Certificate,int CREATED_BY)
        {
            var UserId = Id;
            var Created_By = CREATED_BY;
            HttpResponseMessage result = null;
            string filePath = "";
            string returnPath = "";
            var docfiles = new List<string>();
            try
            {
                //if (fileName != null)
                {
                    var httpRequest = HttpContext.Current.Request;
                    if (httpRequest.Files.Count > 0)
                    {
                        foreach (string file in httpRequest.Files)
                        {
                            var postedFile = httpRequest.Files[file]; 
                             
                            byte[] fileData = null;
                            using (var binaryReader = new BinaryReader(postedFile.InputStream))
                            {
                                fileData = binaryReader.ReadBytes(postedFile.ContentLength);
                            }
                            //Image x = (Bitmap)((new ImageConverter()).ConvertFrom(fileData));
                            Image img = ToImage(fileData);
                            Size thumbnailSize = GetThumbnailSize(img);
                            Image ThumImage = ResizeImage(img, thumbnailSize.Width,thumbnailSize.Height);
                            Image Cimage = ResizeImage(img, 40, 40);
                            //ImageConverter Class convert Image object to Byte array.
                            byte[] compressimage = (byte[])(new ImageConverter()).ConvertTo(Cimage, typeof(byte[]));
                            byte[] compressimage1 = (byte[])(new ImageConverter()).ConvertTo(ThumImage, typeof(byte[]));


                            if (Photo == 1)
                            {
                                repository.UserDetails_PhotoUpload(fileData, UserId);
                                repository.UserDetails_PhotoImageCompress(compressimage, compressimage1, UserId, Created_By);
                            }
                            else if (Certificate == 1)
                            {
                                repository.UserDetails_CertificateUpload(fileData, UserId);
                            }

                            docfiles.Add(postedFile.ToString());
                        }
                        result = Request.CreateResponse(HttpStatusCode.OK, docfiles);
                    }
                    else
                    {
                        repository.UserDetails_PhotoUpload(null, UserId);
                        result = Request.CreateResponse(HttpStatusCode.OK);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return docfiles;
        }

        /// <summary>
        /// to get photo of a business user/patient
        /// </summary>
        /// <param name="Id">User Id
        [HttpGet]
        public PhotoUploadModal UserDetails_GetPhoto(int Id)
        {
            PhotoUploadModal model = new PhotoUploadModal();
            // IList<InstitutionModel> model;         
            model = repository.UserDetails_GetPhoto(Id);

            return model;
        }
        /// <summary>
        /// to get document blob of a business user / patient
        /// </summary>
        /// <param name="Id">User Id</param>
        /// <returns></returns>
        [HttpGet]
        public PhotoUploadModal UserDetails_GetCertificate(long Id)
        {
            PhotoUploadModal model = new PhotoUploadModal();
            // IList<InstitutionModel> model;         
            model = repository.UserDetails_GetCertificate(Id);

            return model;
        }

        /// <summary>      
        /// to get the monitoring protocol name assigned to a patient
        /// </summary>      
        /// <param name="Id">Id of a Protocol</param>        
        /// <returns>monitoring protocol detail name assigned to a patient</returns>
        [HttpGet]
        public IList<ProtocolModel> DoctorMonitoringProtocolView(long Patient_Id)
        {
            IList<ProtocolModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DoctorMonitoringProtocolView(Patient_Id);
                return model;
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
        [HttpGet]
        //  [CheckSessionOutFilter]
        public MonitoringProtocolModel ProtocolMonitoringProtocolView(long Id)
        {
            MonitoringProtocolModel model = new MonitoringProtocolModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ProtocolMonitoringProtocolView(Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return model;
        }

        /// <summary>
        /// to get appointment history for a patient
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>appointment history for a patient</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<PatientAppointmentsModel> DoctorAppoinmentHistoryList(long PatientId, Guid Login_Session_Id)
        {
            try
            {
                IList<PatientAppointmentsModel> model;
                model = repository.DoctorAppoinmentHistoryList(PatientId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<PatientAppointmentsModel> DoctorAppoinmentsList(long PatientId, Guid Login_Session_Id)
        {
            try
            {
                IList<PatientAppointmentsModel> model;
                model = repository.DoctorAppoinmentsList(PatientId, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to get Cronic history for a patient
        /// </summary>
        /// <param name="PatientId">Patient Id</param>
        /// <returns>Cronic history for a patient</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<PatientChronicCondition_List> Chronic_Conditions(long PatientId)
        {
            try
            {
                IList<PatientChronicCondition_List> model;
                model = repository.Chronic_Conditions(PatientId);
                return model;
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
        [HttpPost]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientAssignedProtocol_InsertUpdate(ProtocolModel model)
        {
            if (ModelState.IsValid)
            {
                repository.PatientAssignedProtocol_InsertUpdate(model);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// monitoring protocol assigned history to a patient
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <returns>monitoring protocol assigned history list</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<ProtocolModel> ProtocolHistorylist(long Patient_Id, Guid Login_Session_Id)
        {
            IList<ProtocolModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.PatientAssignedProtocolHistorylist(Patient_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }


        }

        /// <summary>
        /// ICD 10 Category name list
        /// </summary>
        /// <returns>ICD 10 Category name list</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<MasterICDModel> ICD10_CategoryList()
        {
            IList<MasterICDModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ICD10CategoryList();
                return model;
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
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<MasterICDModel> ICD10_CodeList(long Institution_ID)
        {
            IList<MasterICDModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ICD10CodeList(Institution_ID);
                return model;
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
        [HttpPost]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage Patient_ICD10Details_AddEdit(Guid Login_Session_Id,[FromBody] List<MasterICDModel> obj)
        {
            IList<MasterICDModel> ModelData = new List<MasterICDModel>();
            MasterICDReturnModels model = new MasterICDReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.MasterICD = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            long retflag = 0;
            string messagestr = "";
            string msg = "";
            try
            {
                msg = repository.PatientICD10_Date_Overlapping(Login_Session_Id,obj);
                //  msg = "";
                if (msg != "")
                {
                    model.Message = msg;
                    model.ReturnFlag = 1;
                }
                else
                {
                    retflag = repository.PatientICD10Details_AddEdit(Login_Session_Id,obj);
                    if ((retflag == 2) == true)
                    {
                        messagestr = "ICD10 Saved Successfully";
                        model.ReturnFlag = 2;
                    }
                    else if ((retflag == 3) == true)
                    {
                        messagestr = "ICD10 updated Successfully";
                        model.ReturnFlag = 2;
                    }
                    else if ((retflag == 1) == true)
                    {
                        messagestr = "ICD10 category already exists for this active from date, cannot create";
                        model.ReturnFlag = 1;
                    }

                    if ((retflag == 2) == true)
                    {
                        string Event_Code = "";
                        Event_Code = "NEWDATA_CAPTURE";

                        AlertEvents AlertEventReturn = new AlertEvents();
                        IList<EmailListModel> EmailList;
                        EmailList = AlertEventReturn.NewDataCapturedEvent((long)obj[0].Patient_Id, (long)obj[0].InstitutionId);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, obj[0].Patient_Id, (long)obj[0].InstitutionId, EmailList);
                    }
                }
                model.MasterICD = ModelData;
                if (msg != "")
                {
                    model.Message = msg;// "User created successfully";
                }
                else
                {
                    model.Message = messagestr;
                }
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating ICD10";
                model.MasterICD = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// ICD 10 details of a patient
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="Isactive"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientICD10_Details_List(long Patient_Id, int Isactive, Guid Login_Session_Id,long StartRowNumber = 0,long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {

            IList<MasterICDModel> model = new List<MasterICDModel>();
            MasterICDReturnModels modelReturn = new MasterICDReturnModels();
            IList<AppConfigurationModel> configList;
            MasterICDDataPagination _metadata = new MasterICDDataPagination();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }

                model = repository.PatientICD10Details_List(Patient_Id, Isactive, Login_Session_Id, StartRowNumber,EndRowNumber,Institution_Id,Page);
                if (model != null)
                {
                    if (model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new MasterICDDataLinks();
                        _metadata.Links.self = "/api/User/PatientICD10_Details_List?Patient_Id=" + Patient_Id + "&Active=" + Isactive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/PatientICD10_Details_List?Patient_Id=" + Patient_Id + "&Active=" + Isactive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/PatientICD10_Details_List?Patient_Id=" + Patient_Id + "&Active=" + Isactive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/PatientICD10_Details_List?Patient_Id=" + Patient_Id + "&Active=" + Isactive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/PatientICD10_Details_List?Patient_Id=" + Patient_Id + "&Active=" + Isactive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }
                modelReturn.Status = "True";
                modelReturn.Message = "List of MasterICD10 Data";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                modelReturn.MasterICD = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// ICD 10 master list based on ICD 10 search list
        /// </summary>
        /// <param name="ICD10CodeSearch"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<MasterICDModel> ICD10Code_List(string ICD10CodeSearch, long Institution_Id)
        {
            IList<MasterICDModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.ICD10Code_List(ICD10CodeSearch, Institution_Id);
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// a selected Patient ICD 10 detail
        /// </summary>
        /// <param name="Id">Patient ICD 10 Id</param>
        /// <returns>selected Patient ICD 10 detail</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public MasterICDModel PatientICD10_Details_View(long Id, Guid Login_Session_Id)
        {
            MasterICDModel model = new MasterICDModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.PatientICD10Details_View(Id, Login_Session_Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return model;
        }

        /// <summary>
        /// to deactivate a Patient ICD 10 detail
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage PatientICD10Details_InActive(long Id)
        {
            if (Id > 0)
            {
                repository.PatientICD10Details_InActive(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// <summary>
        /// to activate a Patient ICD 10 detail
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        public HttpResponseMessage PatientICD10Details_Active(long Id)
        {
            if (Id > 0)
            {
                repository.PatientICD10Details_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }


        /// <summary>
        /// to get allergy type name list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        [HttpGet]
        public IList<AllergyTypeModel> AllergyTypeList(long Institution_Id)
        {
            IList<AllergyTypeModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AllergyTypeList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }


        }
        /// <summary>
        /// to get allergen name list of a Allergy Type and Institution
        /// </summary>
        /// <param name="ALLERGYTYPE_ID"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<AllergyenModel> AllergenList(long ALLERGYTYPE_ID, long Institution_Id)
        {
            IList<AllergyenModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AllergenList(ALLERGYTYPE_ID, Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }

        /// <summary>
        /// to get allergen onsert list of a Institution
        /// </summary>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<AllergyOnsetModel> AllergyOnsetList(long Institution_Id)
        {
            IList<AllergyOnsetModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AllergyOnsetList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }


        }

        /// <summary>
        /// to get allergen serverity list of a Institution
        /// </summary>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<AllergySeverityModel> AllergySeverityList(long Institution_Id)
        {
            IList<AllergySeverityModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AllergySeverityList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }

        /// <summary>
        /// to get allergen reaction list of a Institution
        /// </summary>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<AllergyReactionModel> AllergyReactionList(long Institution_Id)
        {
            IList<AllergyReactionModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AllergyReactionList(Institution_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }

        }

        /// <summary>
        /// to insert/update allergy to a patient
        /// </summary>
        /// <param name="insobj">allergy detail model</param>
        /// <returns>inserted/updated allergy to a patient</returns>
        [HttpPost]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage Allergy_InsertUpdate(Guid Login_Session_Id,[FromBody] AllergyModel insobj)
        {
            IList<AllergyModel> ModelData = new List<AllergyModel>();
            PatientAllergyDetailsReturnModel model = new PatientAllergyDetailsReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientAllergyDetails = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.Allergy_AddEdit(Login_Session_Id,insobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    model.ReturnFlag = 1;
                    messagestr = "Allergy created successfully";
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    model.ReturnFlag = 2;
                    messagestr = "Allergy updated successfully";
                }
                model.PatientAllergyDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    string Event_Code = "";
                    Event_Code = "NEWDATA_CAPTURE";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    EmailList = AlertEventReturn.NewDataCapturedEvent((long)insobj.Patient_Id, (long)ModelData[0].Institution_Id);

                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, insobj.Patient_Id, (long)ModelData[0].Institution_Id, EmailList);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Creating Allergy";
                model.PatientAllergyDetails = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


        /// <summary>
        /// to get allergy list of a patient
        /// </summary>
        /// <param name="Patient_Id">Patient Id</param>
        /// <param name="IsActive">Active Flag</param>
        /// <returns>allergy list of a patient</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientAllergylist(long Patient_Id, int IsActive, Guid Login_Session_Id, long StartRowNumber = 0, long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {
            //IList<AllergyModel> model;
            IList<AllergyModel> model = new List<AllergyModel>();
            PatientAllergyDetailsReturnModel modelReturn = new PatientAllergyDetailsReturnModel();
            IList<AppConfigurationModel> configList;
            AllergyDataPagination _metadata = new AllergyDataPagination();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }
                model = repository.PatientAllergylist(Patient_Id, IsActive, Login_Session_Id, StartRowNumber, EndRowNumber);
                if (model != null)
                {
                    if (model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new AllergyDataLinks();
                        _metadata.Links.self = "/api/User/PatientAllergylist?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/PatientAllergylist?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/PatientAllergylist?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/PatientAllergylist?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/PatientAllergylist?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }

                modelReturn.Status = "True";
                modelReturn.Message = "List of Allergy List Data";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                modelReturn.PatientAllergyDetails = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;

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
        [HttpPost]
        public HttpResponseMessage AllergyDetails_InActive([FromBody] AllergyModel noteobj)
        {
            IList<AllergyModel> ModelData = new List<AllergyModel>();
            PatientAllergyDetailsReturnModel model = new PatientAllergyDetailsReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientAllergyDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.AllergyDetails_InActive(noteobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Allergy deactivated successfully";
                    model.ReturnFlag = 2;
                }

                model.PatientAllergyDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Allergy";
                model.ReturnFlag = 0;
                model.PatientAllergyDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to activated a patient allergy
        /// </summary>
        /// <param name="noteobj">patient allergy detail id</param>
        /// <returns>activated patient allergy</returns>
        [HttpPost]
        public HttpResponseMessage AllergyDetails_Active([FromBody] AllergyModel noteobj)
        {
            IList<AllergyModel> ModelData = new List<AllergyModel>();
            PatientAllergyDetailsReturnModel model = new PatientAllergyDetailsReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.PatientAllergyDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.AllergyDetails_Active(noteobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Allergy activated successfully";
                    model.ReturnFlag = 2;
                }

                model.PatientAllergyDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Allergy";
                model.ReturnFlag = 0;
                model.PatientAllergyDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to activate a Clinical Note of a patient
        /// </summary>
        /// <param name="noteobj">clinical note detail</param>
        /// <returns>activated Clinical Note of a patient</returns>
        [HttpPost]
        public HttpResponseMessage DoctorNotesDetails_Active([FromBody] DoctorNotesModel noteobj)
        {
            IList<DoctorNotesModel> ModelData = new List<DoctorNotesModel>();
            DoctorNotesReturnModel model = new DoctorNotesReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.NotesDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.DoctorNotesDetails_Active(noteobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Notes activated successfully";
                    model.ReturnFlag = 2;
                }

                model.NotesDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Notes";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.NotesDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// a Patient's allergy details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public AllergyModel PatientAllergyView(long Id, Guid Login_Session_Id)
        {
            AllergyModel model = new AllergyModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.PatientAllergyView(Id, Login_Session_Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }
            return model;
        }

        /// <summary>
        /// Drug Master list of a Institution based on search value
        /// </summary>
        /// <param name="DrugCodeSearch"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<DrugDBMasterModel> DrugCode_List(string DrugCodeSearch, long Institution_Id)
        {
            IList<DrugDBMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DrugCodeList(DrugCodeSearch, Institution_Id);
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to insert/update Clinical notes for a patient
        /// </summary>
        /// <param name="noteobj"></param>
        /// <returns>inserted/updated Clinical notes for a patient</returns>
      //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientNotesInsertUpdate([FromBody] DoctorNotesModel noteobj)
        {
            IList<DoctorNotesModel> ModelData = new List<DoctorNotesModel>();
            DoctorNotesReturnModel model = new DoctorNotesReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.NotesDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.PatientNotes_InsertUpdate(noteobj);
                if (ModelData.Any(item => item.flag == 0) == true)
                {
                    messagestr = "Patient Notes not created, Please check the data";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Notes created Successfully";
                    model.ReturnFlag = 1;

                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = "Patient Notes updated Successfully";
                    model.ReturnFlag = 1;
                }

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    string Event_Code = "";
                    Event_Code = "CLINICIAN_NOTE";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    EmailList = AlertEventReturn.ClinicianNoteEvent((long)noteobj.PatientId, (long)ModelData[0].Institution_Id);

                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, ModelData[0].Id, (long)ModelData[0].Institution_Id, EmailList);
                }

                //if (ModelData.Any(item => item.flag == 1) == true)
                //{
                //    string Event_Code = "";
                //    Event_Code = "NEWDATA_CAPTURE";

                //    AlertEvents AlertEventReturn = new AlertEvents();
                //    IList<EmailListModel> EmailList;
                //    EmailList = AlertEventReturn.NewDataCapturedEvent((long)noteobj.PatientId, (long)ModelData[0].Institution_Id);

                //    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, noteobj.PatientId, (long)ModelData[0].Institution_Id, EmailList);
                //}

                model.NotesDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Notes";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.NotesDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to get Clinical notes list of a patient
        /// </summary>
        /// <param name="Patient_Id"></param>
        /// <param name="IsActive"></param>
        /// <returns>Clinical notes list of a patient</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage PatientNotes_List(long Patient_Id, int IsActive, Guid Login_Session_Id, long StartRowNumber = 0, long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {
            IList<DoctorNotesModel> model = new List<DoctorNotesModel>();
            DoctorNotesReturnModel modelReturn = new DoctorNotesReturnModel();
            IList<AppConfigurationModel> configList;
            DoctorNotesDataPagination _metadata = new DoctorNotesDataPagination();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }
                model = repository.PatientNotes_List(Patient_Id, IsActive, Login_Session_Id, StartRowNumber, EndRowNumber);
                if (model != null)
                {
                    if (model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new DoctorNotesDataLinks();
                        _metadata.Links.self = "/api/User/PatientNotes_List?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/PatientNotes_List?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/PatientNotes_List?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/PatientNotes_List?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/PatientNotes_List?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }

                modelReturn.Status = "True";
                modelReturn.Message = "List of Notes List Data";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                modelReturn.NotesDetails = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
                //return model;
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
        [HttpGet]
        //  [CheckSessionOutFilter]
        public DoctorNotesModel PatientNotes_View(long Id, Guid Login_Session_Id)
        {
            DoctorNotesModel model = new DoctorNotesModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.PatientNotes_View(Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        /// <summary>
        /// Drug Code master List
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IList<DrugDBMasterModel> DrugCodeList()
        {
            IList<DrugDBMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DrugCodeList();
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Drug Master list of a institution and Drug Code
        /// </summary>
        /// <param name="DrugCodeId"></param>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<DrugDBMasterModel> DrugCodeBased_DrugDetails(long DrugCodeId, long Institution_Id)
        {
            IList<DrugDBMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.DrugCodeBased_DrugDetails(DrugCodeId, Institution_Id);
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Drug route list of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        [HttpGet]
        public IList<DrugDBMasterModel> RouteList(long Institution_Id)
        {
            IList<DrugDBMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.RouteList(Institution_Id);
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to get Frequency list of a Institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<DrugDBMasterModel> FrequencyList(long Institution_Id)
        {
            IList<DrugDBMasterModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.FrequencyList(Institution_Id);
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// details of a selected frequency
        /// </summary>
        /// <param name="FrequencyId">Frequency Id</param>
        /// <returns>details of a selected frequency</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public DrugDBMasterModel FrequencybasedDetails(long FrequencyId)
        {
            DrugDBMasterModel model = new DrugDBMasterModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.FrequencybasedDetails(FrequencyId);
                return model;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to insert/update Medication for a patient
        /// </summary>
        /// <param name="insobj">Medication details of a patient</param>
        /// <returns>inserted/updated Medication for a patient</returns>
        [HttpPost]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage MedicationInsertUpdate(Guid Login_Session_Id,[FromBody] List<DrugDBMasterModel> insobj)
        {
            IList<DrugDBMasterModel> ModelData = new List<DrugDBMasterModel>();
            DrugDBMasterReturnModels model = new DrugDBMasterReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.DrugDBMaster = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            long flagret = 0;
            string msg = "";
            string messagestr = "";
            try
            {
                msg = repository.MedicationInsertUpdateDateOverLapping(Login_Session_Id,insobj);
                if (msg != "")
                {
                    model.Message = msg;
                }
                else
                {
                    flagret = repository.MedicationInsertUpdate(Login_Session_Id,insobj);

                    if ((flagret == 2) == true)
                    {
                        messagestr = "Medication created successfully";
                        model.ReturnFlag = 2;
                        model.Status = "False";
                    }
                    else if ((flagret == 3) == true)
                    {
                        messagestr = "Medication updated successfully";
                        model.ReturnFlag = 2;
                        model.Status = "False";
                    }

                    if (ModelData.Any(item => item.flag == 1) == true)
                    {
                        string Event_Code = "";
                        Event_Code = "NEWDATA_CAPTURE";

                        AlertEvents AlertEventReturn = new AlertEvents();
                        IList<EmailListModel> EmailList;
                        EmailList = AlertEventReturn.NewDataCapturedEvent((long)insobj[0].PatientId, (long)insobj[0].InstitutionId);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, insobj[0].PatientId, (long)insobj[0].InstitutionId, EmailList);
                    }


                }
                model.DrugDBMaster = ModelData;
                if (msg != "")
                {
                    model.Message = msg;
                }
                else
                {
                    model.Message = messagestr;
                }
                model.Status = "True";

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Medication";
                model.DrugDBMaster = ModelData;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// Medication details of a selected Patient Medication
        /// </summary>
        /// <param name="Id">Patient medication Id</param>
        /// <returns>Medication details of a selected Patient Medication</returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public DrugDBMasterModel MedicationView(long Id,Guid Login_Session_Id)
        {
            DrugDBMasterModel model = new DrugDBMasterModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.MedicationView(Id, Login_Session_Id);
                return model;
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
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage MedicationList(long Patient_Id, int IsActive, Guid Login_Session_Id,long StartRowNumber = 0, long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {
            IList<DrugDBMasterModel> model = new List<DrugDBMasterModel>();
            DrugDBMasterReturnModels modelReturn = new DrugDBMasterReturnModels();
            IList<AppConfigurationModel> configList;
            DrugDBDataPagination _metadata = new DrugDBDataPagination();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }
                model = repository.MedicationList(Patient_Id, IsActive, Login_Session_Id, StartRowNumber, EndRowNumber);
                if (model != null)
                {
                    if (model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new DrugDBDataLinks();
                        _metadata.Links.self = "/api/User/MedicationList?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/MedicationList?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/MedicationList?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/MedicationList?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/MedicationList?Patient_Id=" + Patient_Id + "&Active=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }

                modelReturn.Status = "True";
                modelReturn.Message = "List of Medication List Data";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                modelReturn.DrugDBMaster = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to deactivate a patient medication details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>deactivated patient medication detail</returns>
        [HttpGet]
        public HttpResponseMessage MedicationDetails_Delete(long Id)
        {
            if (Id > 0)
            {
                repository.MedicationDetails_InActive(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// <summary>
        /// to activate a patient medication details
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>activated patient medication detail</returns>
        [HttpGet]
        public HttpResponseMessage MedicationDetails_Active(long Id)
        {
            if (Id > 0)
            {
                repository.MedicationDetails_Active(Id);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);

                return response;

            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
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
        [HttpPost]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage Patient_OtherData_InsertUpdate(long Patient_Id, long Id, string FileName, string DocumentName, string Remarks, long Created_By)
        {
            Patient_OtherDataModel ModelData = new Patient_OtherDataModel();
            DocumentReturnModel model = new DocumentReturnModel();
            try
            {
                string messagestr = "";
                HttpResponseMessage result = null;
                string filePath = "";
                string returnPath = "";
                byte[] fileData = null;
                var docfiles = new List<string>();
                try
                {
                    //if (fileName != null)
                    {
                        var httpRequest = HttpContext.Current.Request;
                        if (httpRequest.Files.Count > 0)
                        {
                            foreach (string file in httpRequest.Files)
                            {
                                var postedFile = httpRequest.Files[file];

                                using (var binaryReader = new BinaryReader(postedFile.InputStream))
                                {
                                    fileData = binaryReader.ReadBytes(postedFile.ContentLength);

                                }

                                docfiles.Add(postedFile.ToString());
                            }
                            result = Request.CreateResponse(HttpStatusCode.OK, docfiles);
                        }
                        else
                        {
                            result = Request.CreateResponse(HttpStatusCode.OK);
                        }
                    }

                }
                catch (Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                }
                // return docfiles;
                ModelData = repository.Patient_OtherData_InsertUpdate(Patient_Id, Id, FileName, DocumentName, Remarks, fileData, Created_By);

                if ((ModelData.flag == 1) == true)
                {
                    messagestr = "Patient Other Data created successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                else if ((ModelData.flag == 2) == true)
                {
                    messagestr = "Patient Other Data updated successfully";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }

                model.Error_Code = "";
                model.DocumentDetails = ModelData;
                model.Message = messagestr;// "User created successfully";

                if ((ModelData.flag == 1) == true)
                {
                    string Event_Code = "";
                    Event_Code = "NEWDATA_CAPTURE";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    EmailList = AlertEventReturn.NewDataCapturedEvent((long)Patient_Id, (long)ModelData.Institution_Id);

                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Patient_Id, (long)ModelData.Institution_Id, EmailList);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);


                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Document";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.DocumentDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// Patient other data detail of a selected patient other data
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        //  [CheckSessionOutFilter]
        public Patient_OtherDataModel Patient_OtherData_View(long Id)
        {
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                Patient_OtherDataModel model = new Patient_OtherDataModel();
                model = repository.Patient_OtherData_View(Id);
                return model;
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
        [HttpGet]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage Patient_OtherData_List(long Patient_Id, int IsActive,Guid Login_Session_Id, long StartRowNumber = 0, long EndRowNumber = 0, long Institution_Id = 0, int Page = 0)
        {
            IList<Patient_OtherDataModel> model = new List<Patient_OtherDataModel>(); 
            DocumentReturnModel modelReturn = new DocumentReturnModel();
            IList<AppConfigurationModel> configList;
            OthersDataPagination _metadata = new OthersDataPagination();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller"); 
                 
                configList = commonrepository.AppConfigurationDetails("PATIENTPAGE_COUNT", Institution_Id);
                _metadata.per_page = Convert.ToInt64(configList[0].ConfigValue);
                if (Page != 0)
                {
                    _metadata.page = Page;
                    StartRowNumber = ((Page - 1) * _metadata.per_page) + 1;
                    EndRowNumber = Page * _metadata.per_page;
                }
                model = repository.Patient_OtherData_List(Patient_Id, IsActive, Login_Session_Id, StartRowNumber, EndRowNumber);
                if (model != null)
                {
                    if (model.Count > 0)
                    {
                        _metadata.total_count = Convert.ToInt64(model[0].TotalRecord);
                        _metadata.page_count = Convert.ToInt64(Math.Ceiling(Convert.ToDecimal(model[0].TotalRecord) / _metadata.per_page));
                        _metadata.Links = new OthersDataLinks();
                        _metadata.Links.self = "/api/User/Patient_OtherData_List?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + Page;
                        _metadata.Links.first = "/api/User/Patient_OtherData_List?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=1";
                        _metadata.Links.last = "/api/User/Patient_OtherData_List?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + _metadata.page_count;
                        int previous = Page > 1 ? Page - 1 : 1;
                        _metadata.Links.previous = "/api/User/Patient_OtherData_List?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + previous;
                        int next = Page == _metadata.page_count ? Page : Page + 1;
                        _metadata.Links.next = "/api/User/Patient_OtherData_List?Patient_Id=" + Patient_Id + "&IsActive=" + IsActive + "&Login_Session_Id=" + Login_Session_Id + "&Institution_Id=" + Institution_Id + "&Page=" + next;
                    }
                }

                modelReturn.Status = "True";
                modelReturn.Message = "List of Others Data";
                modelReturn.ReturnFlag = 0;
                if (Page != 0 & model.Count > 0)
                {
                    modelReturn._metadata = _metadata;
                }
                modelReturn.DocumentDetails1 = model;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, modelReturn);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// to deactivate a patient's other data
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>deactivated a patient's other data</returns>
        [HttpPost]
        public HttpResponseMessage Patient_OtherData_InActive(Patient_OtherDataModel OtherData)
        {
            Patient_OtherDataModel ModelData = new Patient_OtherDataModel();
            DocumentReturnModel model = new DocumentReturnModel();

            string messagestr = "";
            try
            {
                ModelData = repository.Patient_OtherData_InActive(OtherData.Id, OtherData.Modified_By);

                if (ModelData.flag == 1)
                {
                    messagestr = "Patient Document deactivated successfully";
                    model.Status = "True";
                    model.ReturnFlag = 2;
                }

                model.Error_Code = "";
                model.DocumentDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);

                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Document";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.DocumentDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to activated a patient's other data
        /// </summary>
        /// <param name="OtherData"></param>
        /// <returns>activated a patient's other data</returns>
        [HttpPost]
        //  [CheckSessionOutFilter]
        public HttpResponseMessage Patient_OtherData_Active(Patient_OtherDataModel OtherData)
        {
            Patient_OtherDataModel ModelData = new Patient_OtherDataModel();
            DocumentReturnModel model = new DocumentReturnModel();

            string messagestr = "";
            try
            {
                ModelData = repository.Patient_OtherData_Active(OtherData.Id, OtherData.Modified_By);

                if (ModelData.flag == 1)
                {
                    messagestr = "Patient Document activated successfully";
                    model.Status = "True";
                    model.ReturnFlag = 2;
                }

                model.DocumentDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Document";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.DocumentDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to get patient other data document
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        public Patient_OtherDataModel Patient_OtherData_GetDocument(long Id)
        {
            Patient_OtherDataModel model = new Patient_OtherDataModel();
            model = repository.Patient_OtherData_GetDocument(Id);

            return model;
        }

        /// <summary>
        /// list of users with group exist in selected user list
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public IList<UserGroupDetails_List> UserBasedDept_List(long User_Id)
        {
            try
            {
                IList<UserGroupDetails_List> model;
                model = repository.GroupBasedUserList_ByUser(User_Id);
                return model;
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
        [HttpGet]
        //  [CheckSessionOutFilter]
        public IList<AllergyModel> AllergtMaster_List(int IsActive, long Institution_Id, int StartRowNumber, int EndRowNumber)
        {
            IList<AllergyModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.AllergyMasterList(IsActive, Institution_Id,  StartRowNumber,  EndRowNumber);
                return model;
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
        [HttpPost]
        public HttpResponseMessage DoctorNotesDetails_InActive([FromBody] DoctorNotesModel noteobj)
        {
            IList<DoctorNotesModel> ModelData = new List<DoctorNotesModel>();
            DoctorNotesReturnModel model = new DoctorNotesReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.NotesDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.DoctorNotesDetails_InActive(noteobj);

                if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = "Patient Notes deactivated successfully";
                    model.ReturnFlag = 2;
                }

                model.NotesDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in creating Patient Notes";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.NotesDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to send alert to users when cometchat call missed
        /// </summary>
        /// <param name="from"></param>
        /// <param name="missedby"></param>
        /// <param name="UserId"></param>
        /// <param name="Institution_Id"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        public bool userCallMissed_Alert(string from, string missedby, long UserId, long Institution_Id)
        {
            try
            {

                IAlertEventRepository repository = new AlertEventRepository();
                string Event_Code = "";
                // from doctor to patient
                if (from.ToLower() == "d" && missedby.ToLower() == "u")
                    Event_Code = "MISSEDCALL_PAT";
                // from patient to doctor
                else if (from.ToLower() == "u" && missedby.ToLower() == "d")
                    Event_Code = "MISSEDCALL_DOC";

                if (Event_Code != "")
                {
                    IList<EmailListModel> EmailList;
                    EmailList = repository.UserSpecificEmailList(Institution_Id, UserId);

                    AlertEvents AE = new AlertEvents();
                    AE.Generate_SMTPEmail_Notification(Event_Code, UserId, Institution_Id, EmailList);
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        /// <summary>
        /// to check patient and business user license Count 
        /// </summary>
        /// <param name="obj"></param>
        /// <returns>List the flag and User Type</returns>
        public HttpResponseMessage InstitutionSubscriptionLicensecheck([FromBody] UserModel obj)
        {
            UserModel ModelData = new UserModel();
            UserReturnModel model = new UserReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.InstitutionSubscriptionLicensecheck(obj);
                if ((ModelData.flag == 2) == true)
                {
                    messagestr = "License not exist, new users cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 3) == true)
                {
                    messagestr = "License is not active, new users cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 4) == true)
                {
                    messagestr = "Maximum Number of Patient License reached already, new Patient cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 5) == true)
                {
                    messagestr = "Maximum Number of Business Users License reached already, new Business user cannot be created";
                    model.ReturnFlag = 0;
                    model.Status = "False";
                }
                else if ((ModelData.flag == 1) == true)
                {
                    messagestr = "";
                    model.ReturnFlag = 1;
                    model.Status = "True";
                }
                model.UserDetails = ModelData;
                model.Message = messagestr;// "User created successfully";
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Listing Validation details";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        public HttpResponseMessage Patient_Update([FromBody] UserModel userObj, Guid Login_Session_Id)
        {
            var LoginSession = Login_Session_Id;

            UserModel ModelData = new UserModel();
            UserReturnModel model = new UserReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "1";
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            try
            {
                DataEncryption EncryptPassword = new DataEncryption();
                userObj.MOBILE_NO = EncryptPassword.Encrypt(userObj.MOBILE_NO);
                userObj.EMAILID = EncryptPassword.Encrypt(userObj.EMAILID.ToLower());
                userObj.GOOGLE_EMAILID = EncryptPassword.Encrypt(userObj.GOOGLE_EMAILID);
                userObj.FB_EMAILID = EncryptPassword.Encrypt(userObj.FB_EMAILID);
                userObj.appleUserID = EncryptPassword.Encrypt(userObj.appleUserID);
                userObj.PatientId = EncryptPassword.Encrypt(userObj.PatientId);
                ModelData = repository.Patient_Update(Login_Session_Id, userObj);

                if (ModelData.flag > 0)
                {
                    model.ReturnFlag = 1;
                    model.Status = "False";
                    model.Error_Code = "1";
                    model.UserDetails = ModelData;
                    model.Message = "Email address already exists, cannot be duplicated";
                }
                else
                {
                    model.ReturnFlag = 0;
                    model.Status = "True";
                    model.Error_Code = "";
                    model.UserDetails = ModelData;
                    model.Message = "User Updated successfully";
                }

                return Request.CreateResponse(HttpStatusCode.OK, model);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                model.Status = "False";
                model.Message = "Error in Updating User";
                model.Error_Code = "1";
                model.ReturnFlag = 0;
                model.UserDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }


          
       public static void CompressImage(string SoucePath, string DestPath, int quality)
       {
            var FileName = Path.GetFileName(SoucePath);
            DestPath = DestPath + "\\" + FileName;

            using (Bitmap bmp1 = new Bitmap(SoucePath))
            {
                ImageCodecInfo jpgEncoder = GetEncoder(ImageFormat.Jpeg);

                System.Drawing.Imaging.Encoder QualityEncoder = System.Drawing.Imaging.Encoder.Quality;

                EncoderParameters myEncoderParameters = new EncoderParameters(1);

                EncoderParameter myEncoderParameter = new EncoderParameter(QualityEncoder, quality);

                myEncoderParameters.Param[0] = myEncoderParameter;
                bmp1.Save(DestPath, jpgEncoder, myEncoderParameters);

            }
        }

        private static ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }

        static Size GetThumbnailSize(Image original)
        {
            // Maximum size of any dimension.
            const int maxPixels = 40;

            // Width and height.
            int originalWidth = original.Width;
            int originalHeight = original.Height;

            // Compute best factor to scale entire image based on larger dimension.
            double factor;
            if (originalWidth > originalHeight)
            {
                factor = (double)maxPixels / originalWidth;
            }
            else
            {
                factor = (double)maxPixels / originalHeight;
            }

            // Return thumbnail size.
            return new Size((int)(originalWidth * factor), (int)(originalHeight * factor));
        }

        public static Bitmap CreateThumbnail(string filename, int width, int height)
        {

            Bitmap bmpOut = null;
            try
            {
                Bitmap loBMP = new Bitmap(filename);
                ImageFormat loFormat = loBMP.RawFormat;

                decimal lnRatio;
                int lnNewWidth = 0;
                int lnNewHeight = 0;

                //*** If the image is smaller than a thumbnail just return it
                if (loBMP.Width < width && loBMP.Height < height)
                    return loBMP;

                if (loBMP.Width > loBMP.Height)
                {
                    lnRatio = (decimal)width / loBMP.Width;
                    lnNewWidth = width;
                    decimal lnTemp = loBMP.Height * lnRatio;
                    lnNewHeight = (int)lnTemp;
                }

                else
                {
                    lnRatio = (decimal)height / loBMP.Height;
                    lnNewHeight = height;
                    decimal lnTemp = loBMP.Width * lnRatio;
                    lnNewWidth = (int)lnTemp;

                }

                bmpOut = new Bitmap(lnNewWidth, lnNewHeight);
                Graphics g = Graphics.FromImage(bmpOut);
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.FillRectangle(Brushes.White, 0, 0, lnNewWidth, lnNewHeight);
                g.DrawImage(loBMP, 0, 0, lnNewWidth, lnNewHeight);

                loBMP.Dispose();
            }
            catch
            {
                return null;
            }
            return bmpOut;
        }
        private Image ToImage(byte[] byptes)
        {
            using (var ms = new MemoryStream(byptes))
            {
                return Image.FromStream(ms);
            }
        }

        public string ImageToBase64(Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }

        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            var destRect = new Rectangle(0, 0, width, height);
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                using (var wrapMode = new ImageAttributes())
                {
                    wrapMode.SetWrapMode(WrapMode.TileFlipXY);
                    graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
                }
            }

            return destImage;
        }

    }
}
