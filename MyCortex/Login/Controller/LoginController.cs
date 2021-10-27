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
using log4net;
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
        static readonly IUserRepository userrepo = new UserRepository();

        private LoginRepository login = new LoginRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private object AlertEventReturn;

        IList<AppConfigurationModel> model;
        private Int64 InstanceNameId = Convert.ToInt64(ConfigurationManager.AppSettings["InstanceNameId"]);
        private string Productid;


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
            IList<EmployeeLoginModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GetProduct_Details();
                return model;
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
        [AllowAnonymous]
        [HttpPost]
        public HttpResponseMessage Userlogin_CheckValidity([FromBody] LoginModel loginObj)
        {
            
             
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
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
                
                _logger.Info("username:" + loginObj.Username + " " + loginObj.Password);
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
                // string VisitorsIPAddr ='';
                try
                {
                    // encrypt the password
                    var username = loginObj.Username.ToLower();
                    DataEncryption EncryptPassword = new DataEncryption();
                    loginObj.Password = EncryptPassword.Encrypt(loginObj.Password);
                    loginObj.Username = EncryptPassword.Encrypt(username);
                    model = repository.Userlogin_AddEdit(loginObj);
                    _logger.Info("Model:" + model.data + " " + model.UserId);

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
                        model.Status = "False";
                    }
                    //model.UserDetails = ModelData;
                    model.Message = messagestr;// "User created successfully";

                    model.Error_Code = "";
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                    return response;
                }
                catch (Exception ex)
                {
                    _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
            IList<EmployeeLoginModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.BuildVersion_Details();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            if (_logger.IsInfoEnabled)
                _logger.Info("Controller");

            return UserDetails_Get_GoogleMail(HttpContext.Current.Session["EmailId"].ToString());
        }
        /// <summary>
        /// get user details based on Google Email id in the user profile
        /// </summary>
        /// <returns>a user details</returns>
        [HttpGet]
        public HttpResponseMessage UserDetails_Get_GoogleMail(string EmailId)
        {
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
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
                    _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);

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
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
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
                    _logger.Error(ex.Message, ex);
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
        [HttpPost]
        public HttpResponseMessage ChangePassword(LoginModel loginMod)
        //long Id, string NewPassword, string OldPassword, string Confirmpassword, long ModifiedUser_Id, long InstitutionId, int PageTypeId)
        {
            ResetPasswordReturnModel model = new ResetPasswordReturnModel();
            int flag = 0;
            if (loginMod.UserId > 0 && loginMod.NewPassword == loginMod.ReenterPassword)
            {
                try
                {
                    if (_logger.IsInfoEnabled)
                        _logger.Info("Controller");
                    //NewPassword = Encrypt(NewPassword);
                    //OldPassword = Encrypt(OldPassword);
                    //Confirmpassword = Encrypt(Confirmpassword);
                    DataEncryption EncryptPassword = new DataEncryption();
                    loginMod.NewPassword = EncryptPassword.Encrypt(loginMod.NewPassword);
                    loginMod.Password = EncryptPassword.Encrypt(loginMod.Password);
                    flag = repository.ChangePassword(loginMod.UserId, loginMod.NewPassword, loginMod.Password, loginMod.ReenterPassword, loginMod.UserId, loginMod.InstitutionId, loginMod.LoginType);
                    if (flag > 0)
                    {
                        model.Status = "True";
                        model.ReturnFlag = 1;
                        model.Message = "Password Changed successfully";
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
                    _logger.Error(ex.Message, ex);
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
            string generatedpwd = "";
            string messagestr = "";
            string productname = "MyCortex";
            if(InstanceNameId == 1)
            {
                productname = "MyHealth - Reset Password";
            }else  if(InstanceNameId == 2)
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

                    if (_logger.IsInfoEnabled)
                        _logger.Info("Controller");

                    var request = HttpContext.Current.Request.Url.Authority;
                    // UserModel Ins_model = new UserModel();
                    // Ins_model = userrepo.GetInstitutionForWebURL(request);
                    //long InstitutionId = Ins_model;
                    DataEncryption EncryptPassword = new DataEncryption();
                    long InstitutionId = repository.Get_UserInstitution(EncryptPassword.Encrypt(EmailId));
                    long UserTypeId = repository.Get_UserType(EncryptPassword.Encrypt(EmailId));
                    // long InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);//userrepo.GetInstitutionForWebURL(request);

                    EmailGeneration egmodel = new EmailGeneration();
                    generatedpwd = egmodel.GeneratePassword_ByPasswordPolicy(InstitutionId);
                    if (generatedpwd == "")
                        generatedpwd = ConfigurationManager.AppSettings["User.defaultPassword"];

                    //NewPassword = Encrypt(NewPassword);
                    //ReenterPassword = Encrypt(ReenterPassword);
                    
                    string NewPassword = EncryptPassword.Encrypt(generatedpwd);
                    long UserId = 0;
                    model = repository.ResetPassword(UserId, NewPassword, NewPassword, InstitutionId, UserId, EncryptPassword.Encrypt(EmailId));
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
                    _logger.Error(ex.Message, ex);
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
                    if (_logger.IsInfoEnabled)
                        _logger.Info("Controller");

                    DataEncryption EncryptPassword = new DataEncryption();
                    NewPassword = EncryptPassword.Encrypt(NewPassword);
                    ReenterPassword = EncryptPassword.Encrypt(ReenterPassword);
                    if (EmailId != "\"\"")
                        EmailId = EncryptPassword.Decrypt(EmailId);

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
                    _logger.Error(ex.Message, ex);
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
            IEnumerable<UsertypeModal> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Userdetailslist(UserTypeId, InstitutionId);
                return model;
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
        [HttpGet]
        public IEnumerable<UsertypeModal> Usertypedetailslist()
        {
            IEnumerable<UsertypeModal> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Usertypedetailslist();
                return model;
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
        [HttpGet]
        public LoginModel GetPasswordHistory_Count(long UserId)
        {
            LoginModel model = new LoginModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.GetPasswordHistory_Count(UserId);
                return model;
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
        [HttpGet]
        public UsertypeModal LastPasswordChangeTime(long UserId)
        {
            UsertypeModal model = new UsertypeModal();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.LastPasswordChangeTime(UserId);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
    }
}

