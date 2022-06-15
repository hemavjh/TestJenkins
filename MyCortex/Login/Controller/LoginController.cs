using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using MyCortex.Repositories;
using MyCortex.Repositories.Login;
using MyCortex.Login.Model;
using System.Web;
  
using MyCortex.User.Model;
using MyCortex.Utilities;
using System.Configuration;
using MyCortex.Repositories.Uesr;
using MyCortex.Admin.Models;
using MyCortex.Repositories.Admin;
using MyCortex.Email.SendGrid;
using SendGrid.Helpers.Mail;
using MyCortex.Notification;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Masters.Models;
using MyCortex.Repositories.Masters;
using Newtonsoft.Json.Linq;

namespace MyCortex.Login.Controller
{
    public class LoginController : ApiController
    {
        static readonly ILoginRepository repository = new LoginRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        static readonly AlertEventRepository alertrepository = new AlertEventRepository();
        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
        static readonly ISMSConfigurationRepository SMSrepository = new SMSConfigurationRepository();
        static readonly IUserRepository userrepo = new UserRepository();

        private LoginRepository login = new LoginRepository();
 
        private object AlertEventReturn;

        IList<AppConfigurationModel> model;
        private Int64 InstanceNameId = Convert.ToInt64(ConfigurationManager.AppSettings["InstanceNameId"]);
        private string Productid;

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        [HttpGet]
        public HttpResponseMessage getProductName()
        {
            string resp = "{\"instanceId\":  \'" + InstanceNameId + "\' }";
            var jObject = JObject.Parse(resp);
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(jObject.ToString(), Encoding.UTF8, "application/json");
            return response;
        }

        [HttpGet]
        public bool CheckExpiryDate()
        {
            bool isExpired = true;
            isExpired = repository.CheckExpiryDate();
            return isExpired;
        }

        /// <summary>
        /// Product details
        /// </summary>
        /// <returns>Product details</returns>
        [HttpGet]
        public IList<EmployeeLoginModel> GetProduct_Details()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EmployeeLoginModel> model;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.GetProduct_Details();
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        /// <summary>
        /// check login user authentication, stores Login History
        /// </summary>
        /// <param name="loginObj">Login Credentials</param>
        /// <returns>Login validity details and User Information</returns>
        [AllowAnonymous]
        [HttpPost]
        public HttpResponseMessage Userlogin_CheckValidity([FromBody] LoginModel loginObj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                UserModel ModelData = new UserModel();
                LoginModel model = new LoginModel();
                //IList<TabDevicesModel> tabDevices;
                //IList<TabUserModel> tabUsers;
                if (loginObj.LoginType == 1)
                {
                    if (!ModelState.IsValid)
                    {
                        model.Status = "False";
                        model.Message = "Invalid data";
                        model.Error_Code = "";
                        model.UserDetails = ModelData;
                        model.ReturnFlag = 0;
                        return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                    }
                }

                if (repository.CheckExpiryDate())
                {
                    model.Status = "False";
                    model.Message = "Your MyCortex version is outdated. Please contact Administrator for upgrade or email us on admin@mycortex.health";
                    model.Error_Code = "";
                    model.UserDetails = ModelData;
                    model.ReturnFlag = 0;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }

                string messagestr = "";
                string languagekey = "";
                // string VisitorsIPAddr ='';
                try
                {
                    // encrypt the password
                    var username = loginObj.Username.ToLower();
                    //DataEncryption EncryptPassword = new DataEncryption();
                    //loginObj.Password = EncryptPassword.Encrypt(loginObj.Password);
                    //loginObj.Username = EncryptPassword.Encrypt(username);
                    model = repository.Userlogin_AddEdit(loginObj);

                    HttpContext.Current.Session["UserId"] = model.UserId.ToString();
                    HttpContext.Current.Session["UserTypeId"] = model.UserTypeId.ToString();
                    HttpContext.Current.Session["InstitutionId"] = model.InstitutionId.ToString();
                    HttpContext.Current.Session["Login_Session_Id"] = model.Login_Session_Id.ToString();

                    if ((model.data == 2) == true)
                    {
                        model.ReturnFlag = 0;
                        model.Status = "False";
                        messagestr = "Contract Period expired";
                    }
                    else if ((model.data == 3) == true)
                    {
                        model.ReturnFlag = 1;
                        model.Status = "True";
                        messagestr = "Contract time exceeded, but allow to access";
                    }
                    else if ((model.data == 4) == true || (model.data == 5) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Login  Successfully";
                        model.Status = "True";
                        //if (loginObj.isTab && !String.IsNullOrEmpty(loginObj.Tab_Ref_ID))
                        //{
                        //    model.TabDevices = repository.Get_TabDevices(model.InstitutionId, loginObj.Tab_Ref_ID);
                        //    model.TabUsers = repository.Get_TabUsers(model.InstitutionId, loginObj.Tab_Ref_ID);
                        //}
                    }
                    else if ((model.data == 1) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "User Name or Password Mismatch";
                        model.Status = "False";
                    }
                    else if ((model.data == 6) == true || (model.data == 7) == true || (model.data == 8) == true || (model.data == 10) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = model.Messagetype;
                        model.Status = "False";
                    }
                    else if ((model.data == 9) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Inactive User Cannot Login";
                        model.Status = "False";
                    }
                    else if ((model.data == 11) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Given Reference Id is not Available.";
                        model.Status = "False";
                    }
                    else if ((model.data == 12) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Selected Language not in your subscription.";
                        languagekey = "selectedlanguagenotinyoursubscription";
                        model.Status = "False";
                    }
                    else if ((model.data == 13) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Waiting for approval";
                        model.Status = "False";
                    }
                    else if ((model.data == 14) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "User is not available for given Ref ID.";
                        model.Status = "False";
                    }

                    //model.UserDetails = ModelData;
                    model.Message = messagestr;// "User created successfully";
                    model.LanguageKey = languagekey;
                    model.Error_Code = "";
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.Message = "Error in Login";
                    model.Status = "False";
                    model.UserDetails = ModelData;
                    model.ReturnFlag = 0;
                    model.Error_Code = ex.Message;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }



        /// <summary>      
        /// checking DB connection validity
        /// </summary>          
        /// <returns>True if valid connection, False if Invalid Connection</returns>
        [HttpGet]
        public bool CheckDBConnection()
        {
            if (repository.CheckDBConnection() == false)
            {
                return false;
            }
            return true;
        }



        /// <summary>
        /// Build version details
        /// </summary>
        /// <returns>Build version details</returns>
        [Authorize]
        [HttpGet]
        public IList<EmployeeLoginModel> BuildVersion_Details()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EmployeeLoginModel> model;
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.BuildVersion_Details();
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// get user details based on Google Email id in the user profile
        /// </summary>
        /// <returns>a user details</returns>
        [HttpGet]
        public HttpResponseMessage GoogleLogin_get_Email()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
            return UserDetails_Get_GoogleMail(HttpContext.Current.Session["EmailId"].ToString());
        }
        /// <summary>
        /// get user details based on Google Email id in the user profile
        /// </summary>
        /// <returns>a user details</returns>
        [HttpGet]
        public HttpResponseMessage UserDetails_Get_GoogleMail(string EmailId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                UserModel ModelData = new UserModel();
                LoginModel model = new LoginModel();
                if (EmailId == "")
                {
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Error_Code = "";
                    model.UserDetails = ModelData;
                    model.ReturnFlag = 0;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }

                string messagestr = "";
                try
                {
                    model = repository.UserDetails_Get_GoogleMail(EmailId);
                    HttpContext.Current.Session["UserId"] = model.UserId.ToString();
                    HttpContext.Current.Session["UserTypeId"] = model.UserTypeId.ToString();
                    HttpContext.Current.Session["InstitutionId"] = model.InstitutionId.ToString();

                    if ((model.data == 2) == true)
                    {
                        model.ReturnFlag = 0;
                        model.Status = "False";
                        messagestr = "Contract Period expired";
                    }
                    else if ((model.data == 3) == true)
                    {
                        model.ReturnFlag = 1;
                        model.Status = "True";
                        messagestr = "Contract time exceeded, but allow to access";
                    }
                    else if ((model.data == 4) == true || (model.data == 5) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Login  Successfully";
                        model.Status = "True";
                    }
                    else if ((model.data == 1) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "User Name Mismatch";
                        model.Status = "False";
                    }
                    model.Message = messagestr;

                    model.Error_Code = "";
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.Message = "Error in Login";
                    model.Status = "False";
                    model.UserDetails = ModelData;
                    model.ReturnFlag = 0;
                    model.Error_Code = ex.Message;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// User logout details update
        /// </summary>
        /// <param name="UserId">logged in user id</param>
        /// <returns>logout response</returns>
        [HttpGet]
        public HttpResponseMessage User_Logout(long UserId, string Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserReturnModel user = new UserReturnModel();
            try
            {
                login.User_LogOut(UserId, Login_Session_Id);

                user.Status = "True";
                user.Message = "Used logged out successfully";
                user.ReturnFlag = 1;

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, user);
                return response;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                user.Status = "False";
                user.Message = ex.Message;
                user.ReturnFlag = 0;

                return Request.CreateResponse(HttpStatusCode.BadRequest, user);
            }
        }
        /// <summary>
        /// user details based on FB Email id
        /// </summary>
        /// <param name="EmailId">Users FB Email Id</param>
        /// <returns>User details</returns>
        [HttpGet]
        public HttpResponseMessage UserDetails_Get_FBEmail(string EmailId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                UserModel ModelData = new UserModel();
                LoginModel model = new LoginModel();
                if (EmailId == "")
                {
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Error_Code = "";
                    model.UserDetails = ModelData;
                    model.ReturnFlag = 0;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }

                string messagestr = "";
                try
                {
                    model = repository.UserDetails_Get_FBMail(EmailId);
                    HttpContext.Current.Session["UserId"] = model.UserId.ToString();
                    HttpContext.Current.Session["UserTypeId"] = model.UserTypeId.ToString();
                    HttpContext.Current.Session["InstitutionId"] = model.InstitutionId.ToString();

                    if ((model.data == 2) == true)
                    {
                        model.ReturnFlag = 0;
                        model.Status = "False";
                        messagestr = "Contract Period expired";
                    }
                    else if ((model.data == 3) == true)
                    {
                        model.ReturnFlag = 1;
                        model.Status = "True";
                        messagestr = "Contract time exceeded, but allow to access";
                    }
                    else if ((model.data == 4) == true || (model.data == 5) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "Login  Successfully";
                        model.Status = "True";
                    }
                    else if ((model.data == 1) == true)
                    {
                        model.ReturnFlag = 1;
                        messagestr = "User Name Mismatch";
                        model.Status = "False";
                    }
                    model.Message = messagestr;

                    model.Error_Code = "";
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.Message = "Error in Login";
                    model.Status = "False";
                    model.UserDetails = ModelData;
                    model.ReturnFlag = 0;
                    model.Error_Code = ex.Message;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
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
        [HttpPost]
        public HttpResponseMessage ChangePassword(LoginModel loginMod)
        //long Id, string NewPassword, string OldPassword, string Confirmpassword, long ModifiedUser_Id, long InstitutionId, int PageTypeId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ResetPasswordReturnModel model = new ResetPasswordReturnModel();
            int flag = 0;
            if (loginMod.UserId > 0 && loginMod.NewPassword == loginMod.ReenterPassword)
            {
                try
                {
                       _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                    flag = repository.ChangePassword(loginMod.UserId, loginMod.NewPassword, loginMod.Password, loginMod.ReenterPassword, loginMod.UserId, loginMod.InstitutionId, loginMod.LoginType);
                    if (flag > 0)
                    {
                        model.Status = "True";
                        model.ReturnFlag = 1;
                        model.Message = "Password Changed successfully";
                    }
                    else if (flag == -1)
                    {
                        model.Status = "false";
                        model.ReturnFlag = 0;
                        model.Message = "The Old Password Not Matching With The Existing Password. Please Check!";
                    }
                    else if (flag == -11)
                    {
                        model.Status = "false";
                        model.ReturnFlag = 0;
                        model.Message = "The New Password Same Existing Password. Please Check!";
                    }
                    else
                    {
                        model.Status = "False";
                        model.ReturnFlag = 0;
                        model.Message = "Invalid password";
                    }

                    if (flag > 0)
                    {
                        string Event_Code = "CHANGE_PWD";
                        AlertEvents AlertEventReturn = new AlertEvents();
                        IList<EmailListModel> EmailList;

                        EmailList = alertrepository.UserSpecificEmailList((long)loginMod.InstitutionId, loginMod.UserId);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, loginMod.UserId, (long)loginMod.InstitutionId, EmailList);
                    }

                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.ReturnFlag = 0;
                    model.Message = ex.Message;

                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }

            }

            else
            {
                model.Status = "False";
                model.ReturnFlag = 0;
                model.Message = "Invalid password";
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to send password to user who uses forgot password option - user identified based on email id
        /// </summary>
        /// <param name="EmailId">users email id</param>
        /// <returns>success/failure reponse</returns>
        [HttpGet]
        public HttpResponseMessage ForgotPassword(string EmailId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            string generatedpwd = "";
            string messagestr = "";
            string productname = "MyCortex";
            if (InstanceNameId == 1)
            {
                productname = "MyHealth - Reset Password";
            }
            else if (InstanceNameId == 2)
            {
                productname = "STC MyCortex - Reset Password";
            }
            else
            {
                productname = "MyCortex - Reset Password";
            }
            if (EmailId != "")
            {
                LoginModel ModelData = new LoginModel();
                ResetPasswordReturnModel model = new ResetPasswordReturnModel();
                if (!ModelState.IsValid)
                {
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.ResetPassword = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
                try
                {

                       _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                    var request = HttpContext.Current.Request.Url.Authority;
                    // UserModel Ins_model = new UserModel();
                    // Ins_model = userrepo.GetInstitutionForWebURL(request);
                    //long InstitutionId = Ins_model;
                    long InstitutionId = repository.Get_UserInstitution(EmailId);
                    long UserTypeId = repository.Get_UserType(EmailId);
                    // long InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);//userrepo.GetInstitutionForWebURL(request);

                    EmailGeneration egmodel = new EmailGeneration();
                    generatedpwd = egmodel.GeneratePassword_ByPasswordPolicy(InstitutionId);
                    if (generatedpwd == "" || generatedpwd == null)
                        generatedpwd = ConfigurationManager.AppSettings["User.defaultPassword"];
                    if (generatedpwd == null)
                        generatedpwd = "P@ssw0rd";
                    //NewPassword = Encrypt(NewPassword);
                    //ReenterPassword = Encrypt(ReenterPassword);

                    string NewPassword = generatedpwd;
                    long UserId = 0;
                    model = repository.ResetPassword(UserId, NewPassword, NewPassword, InstitutionId, UserId, EmailId);
                    if ((model.ReturnFlag == 3) == true)
                    {
                        messagestr = "The Email does not exist, Please Check!";
                        model.ReturnFlag = 0;
                        model.Status = "False";
                    }
                    else if ((model.ReturnFlag == 2) == true)
                    {
                        messagestr = "The New Password is same as Existing Password, Please Check !";
                        model.ReturnFlag = 0;
                        model.Status = "False";
                    }
                    else if ((model.ReturnFlag == 1) == true)
                    {
                        messagestr = "Password sent to your registered email";
                        model.ReturnFlag = 1;
                        model.Status = "True";

                        if (UserTypeId != 3)
                        {
                            string Event_Code = "";
                            Event_Code = "RESET_PWD";
                            AlertEvents AlertEventReturn = new AlertEvents();
                            IList<EmailListModel> EmailList;
                            EmailList = AlertEventReturn.UserCreateEvent((long)model.ResetPassword.UserId, InstitutionId);
                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, (long)model.ResetPassword.UserId, InstitutionId, EmailList);
                        }
                        //EmailConfigurationModel emailModel = new EmailConfigurationModel();
                        //emailModel = emailrepository.EmailConfiguration_View(InstitutionId);
                        // if (emailModel != null)
                        // {
                        //     SendGridMessage msg = SendGridApiManager.ComposeSendGridMessage(emailModel.UserName, emailModel.Sender_Email_Id,
                        //         productname,
                        //         "New Password is : " + generatedpwd,
                        //         model.ResetPassword.Username, EncryptPassword.Decrypt(model.ResetPassword.Email));

                        //     SendGridApiManager mail = new SendGridApiManager();
                        //     var res = mail.SendEmailAsync(msg, 0);
                        // }
                        if (UserTypeId == 3)
                        {
                            EmailGeneration Generator = new EmailGeneration();
                            EmailGenerateModel MailMessage = new EmailGenerateModel();
                            MailMessage.Institution_Id = InstitutionId;
                            MailMessage.MessageToId = EmailId;
                            MailMessage.MessageSubject = "MyCortex - ForgotPassword";
                            MailMessage.MessageBody = "Your Forgot Password Is : " + generatedpwd + "";
                            MailMessage.Created_By = 0;
                            MailMessage.UserId = 0;
                            var insData = Generator.SendEmail(MailMessage);
                        }

                    }
                    model.Error_Code = "";
                    model.Message = messagestr;
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Error_Code = ex.Message;
                    model.ReturnFlag = 0;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// <summary>     
        /// to Reset Password of a user
        /// </summary>
        /// <param name="NewPassword">NewPassword</param>        
        /// <param name="ReenterPassword">Reentered Password</param>        
        /// <returns>success/failure response</returns>
        [HttpGet]
        public HttpResponseMessage ResetPassword(int Id, string NewPassword, string ReenterPassword, long InstitutionId, long created_By, string EmailId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            string messagestr = "";
            if (Id > 0)
            {
                LoginModel ModelData = new LoginModel();
                ResetPasswordReturnModel model = new ResetPasswordReturnModel();
                if (!ModelState.IsValid)
                {
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.ResetPassword = ModelData;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
                try
                {
                       _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);

                    model = repository.ResetPassword(Id, NewPassword, ReenterPassword, InstitutionId, created_By, EmailId);
                    if ((model.ReturnFlag == 3) == true)
                    {
                        messagestr = "Invalid Email, Please Check !";
                        model.ReturnFlag = 0;
                        model.Status = "False";
                    }
                    else if ((model.ReturnFlag == 2) == true)
                    {
                        messagestr = "The New Password is same as Existing Password, Please Check !";
                        model.ReturnFlag = 0;
                        model.Status = "False";
                    }
                    else if ((model.ReturnFlag == 1) == true)
                    {
                        messagestr = "Password changed successfully";
                        model.ReturnFlag = 1;
                        model.Status = "True";
                    }
                    if ((model.ReturnFlag == 1) == true)
                    {
                        string Event_Code = "RESET_PWD";
                        AlertEvents AlertEventReturn = new AlertEvents();
                        IList<EmailListModel> EmailList;

                        EmailList = alertrepository.UserSpecificEmailList(InstitutionId, Id);

                        AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Id, InstitutionId, EmailList);
                    }
                    model.Error_Code = "";
                    model.Message = messagestr;
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.Message = "Invalid data";
                    model.Error_Code = ex.Message;
                    model.ReturnFlag = 0;
                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        /// <summary>
        /// Getting User Basic Details for the given filter
        /// </summary>
        /// <param name="UserTypeId"> User Type Id (business users, patient)</param>
        /// <param name="InstitutionId">institution of the user</param>
        /// <returns>user basic details list model</returns>
        [HttpGet]
        public IEnumerable<UsertypeModal> Userdetailslist(int UserTypeId, long InstitutionId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IEnumerable<UsertypeModal> model;
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Userdetailslist(UserTypeId, InstitutionId);
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>      
        /// User Type Details to populate dropdown
        /// </summary>          
        /// <returns>User Type Details </returns>
        [HttpGet]
        public IEnumerable<UsertypeModal> Usertypedetailslist()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IEnumerable<UsertypeModal> model;
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Usertypedetailslist();
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// get the count of password change history of a user - if no history, change password prompted for the user
        /// </summary>
        /// <param name="UserId">User id</param>
        /// <returns>change password history count</returns>
        [HttpGet]
        public LoginModel GetPasswordHistory_Count(long UserId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            LoginModel model = new LoginModel();
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.GetPasswordHistory_Count(UserId);
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// User changed or reset the password date
        /// </summary>
        /// <param name="UserId">logged in user id</param>
        /// <returns>Retuen the date</returns>
        [HttpGet]
        public UsertypeModal LastPasswordChangeTime(long UserId)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UsertypeModal model = new UsertypeModal();
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.LastPasswordChangeTime(UserId);
                return model;
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [HttpPost]
        public HttpResponseMessage ChangePassword_For_User(LoginModel loginMod)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ResetPasswordReturnModel model = new ResetPasswordReturnModel();
            int flag = 0;
            if (loginMod.NewPassword == loginMod.ReenterPassword)
            {
                try
                {
                       _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                    Int64 userid = Convert.ToInt64(loginMod.Status) / 4;
                    if (userid > 0)
                    {
                        loginMod.UserId = userid;
                        loginMod.NewPassword = loginMod.NewPassword;
                        loginMod.Password = loginMod.Password.Replace("@", "/");
                        flag = repository.ChangePassword(loginMod.UserId, loginMod.NewPassword, loginMod.Password, loginMod.NewPassword, loginMod.UserId, loginMod.InstitutionId, loginMod.LoginType);
                        if (flag > 0)
                        {
                            model.Status = "True";
                            model.ReturnFlag = 1;
                            model.Message = "Password Changed successfully";
                        }
                        else if (flag == -1)
                        {
                            model.Status = "false";
                            model.ReturnFlag = 0;
                            model.Message = "The Old Password Not Matching With The Existing Password. Please Check!";
                        }
                        else if (flag == -11)
                        {
                            model.Status = "false";
                            model.ReturnFlag = 0;
                            model.Message = "The New Password Same Existing Password. Please Check!";
                        }
                        else
                        {
                            model.Status = "False";
                            model.ReturnFlag = 0;
                            model.Message = "Invalid password";
                        }

                        if (flag > 0)
                        {
                            string Event_Code = "CHANGE_PWD";
                            AlertEvents AlertEventReturn = new AlertEvents();
                            IList<EmailListModel> EmailList;

                            EmailList = alertrepository.UserSpecificEmailList((long)loginMod.InstitutionId, loginMod.UserId);

                            AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, loginMod.UserId, (long)loginMod.InstitutionId, EmailList);
                        }

                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                        return response;
                    }
                    else
                    {
                        model.Status = "False";
                        model.ReturnFlag = 0;
                        model.Message = "Invalid password";
                        return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                    }
                }
                catch (Exception ex)
                {
    
                   _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                    model.Status = "False";
                    model.ReturnFlag = 0;
                    model.Message = ex.Message;

                    return Request.CreateResponse(HttpStatusCode.BadRequest, model);
                }

            }

            else
            {
                model.Status = "False";
                model.ReturnFlag = 0;
                model.Message = "Invalid password";
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
    }
}

