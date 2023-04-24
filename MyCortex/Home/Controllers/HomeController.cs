using MyCortex.Repositories.Login;
//using MyCortex.Repositories.Menu;
using MyCortex.CommonMenu.Models;
using MyCortex.Login.Model;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
  
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Configuration;
using System.Web.Http.Cors;
using MyCortex.Repositories.Menu;
using MyCortex.User.Model;
using MyCortex.Repositories.Uesr;
using MyCortex.Masters.Models;
using MyCortex.Notification.Model;
using MyCortex.Repositories.Admin;
using MyCortex.Provider;
using MyCortex.Repositories.Masters;
using MyCortex.Repositories.LiveBox;
using MyCortex.Repositories;
using MyCortex.Utilities;
using Stripe;
using Stripe.Checkout;
using System.Net;
using System.Text;
using System.IO;
using System.Runtime.Serialization.Json;
using MyCortex.Admin.Models;
using MyCortex.Notification.Firebase;
using System.Web.UI;
using Newtonsoft.Json.Linq;
using MyCortex.User.Controller;
using MyCortex.User.Models;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using Microsoft.Owin.Logging;

namespace MyCortex.Home.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomeController : Controller
    {
        public string returnError = "";
        private CommonMenuRepository db = new CommonMenuRepository();
        static readonly AlertEventRepository alertrepository = new AlertEventRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        static readonly IGatewaySettingsRepository gatewayrepository = new GatewaySettingsRepository();
        static readonly IPatientAppointmentsRepository patientAppointmentsRepository = new PatientAppointmentRepository();
        static readonly ILiveBoxRepository liveBoxRepository = new LiveBoxRepository();        
        private LoginRepository login = new LoginRepository();
        private UserRepository repository = new UserRepository();

        private InstitutionRepository Insrepository = new InstitutionRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        IList<AppConfigurationModel> model;
        IList<GatewaySettingsModel> gatewayModel;
        private Int64 InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);
        private string ClientId;
        private string SecretKey;
        private string RedirectUrl;

        int i = 0;

        public HomeController()
        {
            model = commonrepository.AppConfigurationDetails("Google.ClientID", InstitutionId);
            if (model.Count > 0)
            {
                ClientId = model[0].ConfigValue;
            }
            model = commonrepository.AppConfigurationDetails("Google.SecretKey", InstitutionId);
            if (model.Count > 0)
            {
                SecretKey = model[0].ConfigValue;
            }
            model = commonrepository.AppConfigurationDetails("Google.RedirectUrl", InstitutionId);
            if (model.Count > 0)
            {
                RedirectUrl = model[0].ConfigValue;
            }
            StripeConfiguration.ApiKey = "sk_test_4pcdIsoglCrClOcCveS68nis";

        }

        /// <summary>
        /// Index action result - for menu layout and user details
        /// </summary>
        /// <returns>menu layout and user details</returns>
        /// 
        //   [CheckSessionOut]
        [CheckSessionOutFilter]
        //[NoDirectAccess]
        //[Route("Index")]       
        public ActionResult Index()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                long UserId = Convert.ToInt32(Session["UserId"].ToString());
                _MyLogger.Exceptions("Warn", _AppLogger, "Session UserId" + UserId, null, _AppMethod);
                if (UserId > 0)
                {
                    //var lst = "";
                    var lst = db.CommonMenu_Listall(UserId);
                    ViewData.Model = lst;
                    return View(lst);

                }
                else
                {
                    _MyLogger.Exceptions("Warn", _AppLogger, "page go to login", null, _AppMethod);
                    return RedirectToAction("LoginIndex");
                }

            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        public ActionResult Error(string aspxerrorpath)
        {
            return this.Redirect("~/#/" + aspxerrorpath);
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserId"] == null)
            {
                 _AppLogger = this.GetType().FullName;
                _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
                _MyLogger.Exceptions("Warn", _AppLogger, "session is null so page go to login", null, _AppMethod);
                Response.Redirect("LoginIndex");
            }
        }

        // GET: Login Index
        [Route("LoginIndex")]
        public ActionResult LoginIndex()
        {

            Session["UserId"] = "0";
            Session["key"] = "";
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
            Response.Cache.SetNoStore();
            Session.Abandon();

            return View((object)returnError);
        }
        
        //[HttpPost]
        //public ActionResult BrowserClose()
        //{
        //    _AppLogger = this.GetType().FullName;
        //    _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
        //    try
        //    {
        //        long UserID = Convert.ToInt32(Session["UserId"].ToString());
        //        string login_session_id = Session["Login_Session_Id"] as string;
        //        if (!string.IsNullOrEmpty(login_session_id))
        //        {
        //            string SessionId = Convert.ToString(Session["Login_Session_Id"].ToString());
        //            login.User_LogOut(UserID, SessionId);
        //        }
        //        Session["UserId"] = "0";
        //        Session["key"] = "";
        //        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        //        Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
        //        Response.Cache.SetNoStore();
        //        Session.Abandon();
        //        Session.Clear();
        //        returnError = "";
        //        return JavaScript("window.close();");

        //    }
        //    catch (Exception ex)
        //    {
        //        _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
        //        return null;
        //    }
        //}

        /// <summary>
        /// to update user logout details
        /// </summary>
        /// <returns></returns>
        [CheckSessionOutFilter]
        public ActionResult LoginOut()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                long UserID = Convert.ToInt32(Session["UserId"].ToString());
                string login_session_id = Session["Login_Session_Id"] as string;
                if (!string.IsNullOrEmpty(login_session_id))
                {
                    string SessionId = Convert.ToString(Session["Login_Session_Id"].ToString());
                    login.User_LogOut(UserID, SessionId);
                }
                Session["UserId"] = "0";
                Session["key"] = "";
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
                Response.Cache.SetNoStore();
                Session.Abandon();
                Session.Clear();

                //var claimsIdentity = (ClaimsIdentity)User.Identity;
                //IEnumerable<Claim> claims = claimsIdentity.Claims;


                //var authenticationManager = HttpContext.GetOwinContext().Authentication;
                //////authenticationManager.SignOut(MyAuthentication.ApplicationCookie);
                //authenticationManager.SignOut(HttpContext.GetOwinContext()
                //           .Authentication.GetAuthenticationTypes()
                //           .Select(o => o.AuthenticationType).ToArray());

                //HttpContext.GetOwinContext().Authentication.SignOut("Bearer");

                //// Second we clear the principal to ensure the user does not retain any authentication
                //HttpContext.User = new GenericPrincipal(new GenericIdentity(string.Empty), null);

                returnError = "";
                /*_MyLogger.Exceptions("Warn", _AppLogger, "LoginOut button clicked", null, _AppMethod);*/
                return RedirectToAction("LoginIndex","Home");
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [CheckSessionOutFilter]
        public ActionResult LoginOutAllDevice()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                long UserID = Convert.ToInt32(Session["UserId"].ToString());
                login.User_LogOutAllDevice(UserID);
                Session["UserId"] = "0";
                Session["key"] = "";
                Response.Cache.SetCacheability(HttpCacheability.NoCache);
                Response.Cache.SetExpires(DateTime.UtcNow.AddHours(-1));
                Response.Cache.SetNoStore();
                Session.Abandon();

                //var claimsIdentity = (ClaimsIdentity)User.Identity;
                //IEnumerable<Claim> claims = claimsIdentity.Claims;


                //var authenticationManager = HttpContext.GetOwinContext().Authentication;
                //////authenticationManager.SignOut(MyAuthentication.ApplicationCookie);
                //authenticationManager.SignOut(HttpContext.GetOwinContext()
                //           .Authentication.GetAuthenticationTypes()
                //           .Select(o => o.AuthenticationType).ToArray());

                //HttpContext.GetOwinContext().Authentication.SignOut("Bearer");

                //// Second we clear the principal to ensure the user does not retain any authentication
                //HttpContext.User = new GenericPrincipal(new GenericIdentity(string.Empty), null);

                returnError = "";
                /*_MyLogger.Exceptions("Warn", _AppLogger, "LoginOutAllDevice button clicked", null, _AppMethod);*/
                return RedirectToAction("LoginIndex");
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }






        /// <summary>
        /// Patient Chronic details - SelectedPatient
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [CheckSessionOutFilter]
        public ActionResult ChronicList()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long Patient_Id = Convert.ToInt32(Session["UserId"].ToString());
            //long Patient_Id = Convert.ToInt32(Session["SelectedPatientId"].ToString());
            var res = "";

            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<PatientChronicCondition_List> lst = repository.Chronic_Conditions(Patient_Id);
                //foreach (var i in lst)
                //{

                //}
                var json = jsonSerialiser.Serialize(lst);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// logged in user basic details - user name, last login, user photo, patient type
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [CheckSessionOutFilter]
        public ActionResult LoginDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long EmployeeId = Convert.ToInt32(Session["UserId"].ToString());
            var res = "";

            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer { MaxJsonLength = Int32.MaxValue };
            try
            {
                IList<EmployeeLoginModel> lst = login.UserLogged_Details(EmployeeId);
                if(lst != null)
                {
                    foreach (var i in lst)
                    {
                        string sqlFormattedDate = "";

                        if (i.LogInTime != null)
                        {
                            sqlFormattedDate = ((DateTime)i.LogInTime).ToString("dd-MMM-yyyy hh:mm:ss tt");
                        }

                        res = "" + i.LogInTime.ToString();

                        t.Add(sqlFormattedDate);

                        if ((i.PhotoBlob != null))
                        {
                            //t.Add(i.PhotoBlob.ToString());                      
                            var base64 = Convert.ToBase64String(i.PhotoBlob);
                            var imgSrc = String.Format("data:image/gif;base64,{0}", base64);
                            t.Add(imgSrc);

                        }
                        else if (((i.PhotoBlob == null)) && (i.Name.ToLower() == "male"))
                        {
                            t.Add("Images/maleemp.png");
                        }
                        else if (((i.PhotoBlob == null)) && (i.Name.ToLower() == "female"))
                        {
                            t.Add("Images/femaleemp.png");
                        }
                        else if (((i.Name.ToLower() != "male") && (i.Name.ToLower() != "female")) && ((i.PhotoBlob == null)))
                        {
                            t.Add("Images/admin.jpg");
                        }
                        t.Add(i.NATIONALITY_ID.ToString());
                        //string DOB = "";
                        //DOB = ((DateTime)i.DOB).ToString("dd-MM-yyyy");
                        t.Add("");
                        t.Add(i.UserType.ToString());
                        t.Add(i.MOBILE_NO.ToString());
                        if (i.FullName != null)
                        {
                            string fullname = " ";
                            fullname = (i.FullName).ToString();
                            fullname = fullname.Replace(",", "");
                            t.Add(fullname);
                        }
                        if (i.GENDER_NAME != null)
                        {
                            t.Add(i.GENDER_NAME.ToString());
                        }
                        else
                        {
                            t.Add("");
                        }
                        if (i.Employee_Name != null)
                        {
                            t.Add(i.Employee_Name.ToString());
                        }
                        t.Add(i.PatientType.ToString());
                        t.Add(i.UserType.ToString());
                    }
                    if (EmployeeId == 1)
                    {
                        t[8] = "Admin";
                    }
                    var json = jsonSerialiser.Serialize(t);
                    return Content(json);
                }
                return null;
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// get unread Product Details of the logged in user
        /// </summary>
        /// <returns>Product Details</returns>
        [AllowAnonymous]
        [CheckSessionOutFilter]
        public ActionResult GetProduct_Details()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            //long EmployeeId = Convert.ToInt32(Session["UserId"].ToString());
            //long UserTypeId = Convert.ToInt32(Session["UserTypeId"].ToString());
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<EmployeeLoginModel> lst = login.GetProduct_Details();
                t.Add(lst[0].ProductName);
                t.Add(lst[0].ProductImg);
                t.Add(lst[0].PoweredBy);
                t.Add(lst[0].ProductFavIcon);
                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }


        [AllowAnonymous]
        [CheckSessionOutFilter]
        public ActionResult GetProduct_CopyRight()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            //long EmployeeId = Convert.ToInt32(Session["UserId"].ToString());
            //long UserTypeId = Convert.ToInt32(Session["UserTypeId"].ToString());
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<EmployeeLoginModel> lst = login.GetProduct_Details();
                t.Add(lst[0].ProductCopyRight);
                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }



        /// <summary>
        /// get unread notification count of the logged in user
        /// </summary>
        /// <returns>unread notification count</returns>
        [AllowAnonymous]
        [CheckSessionOutFilter]
        public ActionResult GetUnread_Notification_Count()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long EmployeeId = Convert.ToInt32(Session["UserId"].ToString());
            long UserTypeId = Convert.ToInt32(Session["UserTypeId"].ToString());
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<UserNotificationListModel> lst = login.User_get_NotificationCount(EmployeeId);
                foreach (var i in lst)
                {

                    t.Add(i.NotificationUnread.ToString());
                }
                t.Add(UserTypeId.ToString());
                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Institution logo of the logged in user
        /// </summary>
        /// <returns>Institution logo blob</returns>
        public ActionResult LoginLogoDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            long Institution_Id = Convert.ToInt32(Session["InstitutionId"].ToString());
            var res = "";

            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                PhotoUploadModal modal;
                modal = Insrepository.Institution_GetPhoto(Institution_Id);

                if ((modal.PhotoBlob != null))
                {
                    //t.Add(i.PhotoBlob.ToString());                      
                    var base64 = Convert.ToBase64String(modal.PhotoBlob);
                    var imgSrc = String.Format("data:image/gif;base64,{0}", base64);
                    t.Add(imgSrc);
                }
                else
                {
                    IList<EmployeeLoginModel> lst = login.GetProduct_Details();
                    //t.Add(lst[0].ProductImg);
                    t.Add(lst[0].ProductDefaultlogo);
                }

                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Institution logo of the logged in user
        /// </summary>
        /// <returns>Institution logo blob</returns>
        public ActionResult LoginPageLogoDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            var res = "";
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<EmployeeLoginModel> lst = login.GetProduct_Details();
                t.Add(lst[0].ProductImg);

                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// Google + login action
        /// </summary>
        public void LoginUsingGoogle(int Sys_TimeDifference, string Browser_Version, string Login_Country, string Login_City, string IPAdddress)
        {
            Session["Sys_TimeDifference"] = Sys_TimeDifference;
            Session["Browser_Version"] = Browser_Version;
            Session["Login_Country"] = Login_Country;
            Session["Login_City"] = Login_City;
            Session["Login_IPAdddress"] = IPAdddress;

            Response.Redirect($"https://accounts.google.com/o/oauth2/v2/auth?client_id={ClientId}&response_type=code&scope=openid%20email%20profile&redirect_uri={RedirectUrl}&state=abcdef");
        }

        /// <summary>
        /// successful google login return action - user identification and returns the user detail
        /// </summary>
        /// <param name="code"></param>
        /// <param name="state"></param>
        /// <param name="session_state"></param>
        /// <returns></returns>
        public async Task<ActionResult> SaveGoogleUser(string code, string state, string scope)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            if (string.IsNullOrEmpty(code))
            {
                return RedirectToRoute("Default");
            }

            var httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://www.googleapis.com")
            };
            var requestUrl = $"oauth2/v4/token?code={code}&client_id={ClientId}&client_secret={SecretKey}&redirect_uri={RedirectUrl}&grant_type=authorization_code";

            var dict = new Dictionary<string, string>
            {
                { "Content-Type", "application/x-www-form-urlencoded" }
            };
            var req = new HttpRequestMessage(HttpMethod.Post, requestUrl) { Content = new FormUrlEncodedContent(dict) };
            var response = await httpClient.SendAsync(req);
            var token = JsonConvert.DeserializeObject<GmailToken>(await response.Content.ReadAsStringAsync());
            var obj = await GetuserProfile(token.AccessToken);
            //IdToken property stores user data in Base64Encoded form
            //var data = Convert.FromBase64String(token.IdToken.Split('.')[1]);
            //var base64Decoded = System.Text.ASCIIEncoding.ASCII.GetString(data);
            Session["EmailId"] = obj.Email;

            LoginModel model;
            LoginModel model1 = new LoginModel();
            model1.Username = Session["EmailId"].ToString();
            model1.DeviceType = "Web";
            model1.LoginType = 2;
            model1.Sys_TimeDifference = Convert.ToInt32(Session["Sys_TimeDifference"].ToString());
            model1.Browser_Version = (Session["Browser_Version"].ToString());
            model1.Login_Country = (Session["Login_Country"].ToString());
            model1.Login_City = (Session["Login_City"].ToString());
            model1.Login_IpAddress = (Session["Login_IPAdddress"].ToString());


            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = login.Userlogin_AddEdit(model1);

            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                returnError = "Error";
                return View("LoginIndex");
            }
            if (model == null)
            {
                returnError = "Error";
                return View("LoginIndex");
            }
            else
            {
                if (model.UserId > 0)
                {
                    Session["UserId"] = model.UserId.ToString();
                    Session["UserTypeId"] = model.UserTypeId.ToString();
                    Session["InstitutionId"] = model.InstitutionId.ToString();

                    returnError = "";
                    //return View("Index");
                    var lst = db.CommonMenu_Listall(model.UserId);
                    ViewData.Model = lst;
                    return View("Index");
                }
                else
                {
                    returnError = "Error";
                    return View("LoginIndex");
                }
            }
        }
        /// <summary>
        /// get profile details from Google API in the Google + login
        /// </summary>
        /// <param name="accesstoken"></param>
        /// <returns></returns>
        public async Task<UserProfile> GetuserProfile(string accesstoken)
        {
            var httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://www.googleapis.com")
            };
            string url = $"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={accesstoken}";
            var response = await httpClient.GetAsync(url);
            return JsonConvert.DeserializeObject<UserProfile>(await response.Content.ReadAsStringAsync());
        }

        /// <summary>
        /// current application build number
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public ActionResult BuildDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<EmployeeLoginModel> lst = login.BuildVersion_Details();
                foreach (var i in lst)
                {
                    t.Add(i.BuildNo.ToString());
                    t.Add(i.SiteURL.ToString());
                }
                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        [AllowAnonymous]
        public ActionResult ProductDetails()
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<string> t = new List<string>();
            Int64 InstanceNameId = Convert.ToInt64(ConfigurationManager.AppSettings["InstanceNameId"]);
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {

                string[] list = new string[3] { "MyHealth", "STC MyCortex", "MyCortex.health" };

                if (InstanceNameId == 1)
                {
                    t.Add(list[0].ToString());
                }
                else if (InstanceNameId == 2)
                {
                    t.Add(list[1].ToString());
                }
                else
                {
                    t.Add(list[2].ToString());
                }

                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// document blob of a patient health data Other Data
        /// </summary>
        /// <param name="Id">patient health data Other Data Id</param>
        /// <returns>Other data document blob details</returns>
        [CheckSessionOutFilter]
        public ActionResult GetPatient_OtherDataDocument(long Id)
        {
            Patient_OtherDataModel model = new Patient_OtherDataModel();
            model = repository.Patient_OtherData_GetDocument(Id);
            FileContentResult result = new FileContentResult(model.DocumentBlobData, "application/octet-stream")
            {
                FileDownloadName = model.FileName
            };

            return result;
        }

        /// <summary>
        /// document details (without blob) of a patient health data Other Data
        /// </summary>
        /// <param name="Id">patient health data Other Data Id</param>
        /// <returns>Other data document details (without blob)</returns>
        [CheckSessionOutFilter]
        public ActionResult GetPatient_UserDocument(long Id)
        {
            PhotoUploadModal model = new PhotoUploadModal();
            model = repository.UserDetails_GetCertificate(Id);
            FileContentResult result = new FileContentResult(model.CertificateBlob, "application/octet-stream")
            {
                FileDownloadName = model.FileName
            };
            return result;
        }

        [CheckSessionOutFilter]
        [HttpPost]
        public ActionResult CreateCharge(string stripeToken, string stripeEmail)
        {
            Stripe.StripeConfiguration.ApiKey = "sk_test_4pcdIsoglCrClOcCveS68nis";

            var myCharge = new Stripe.ChargeCreateOptions();
            // always set these properties
            myCharge.Amount = 2000;
            myCharge.Currency = "USD";
            myCharge.ReceiptEmail = stripeEmail;
            myCharge.Description = "Tele Appointment Charges";
            myCharge.Source = stripeToken;
            myCharge.Capture = true;
            var chargeService = new Stripe.ChargeService();
            Charge stripeCharge = chargeService.Create(myCharge);
            return null;
        }

        [HttpPost]
        public ActionResult CreateStripeCheckoutSession(string stripeToken, string stripeEmail)
        {
            Stripe.StripeConfiguration.ApiKey = "sk_test_4pcdIsoglCrClOcCveS68nis";

            SessionCreateOptions options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
                {
                  "card",
                  //"alipay",
                  //"alipay, card, ideal, fpx, bacs_debit, bancontact, giropay, p24, eps, sofort, sepa_debit, grabpay, afterpay_clearpay, acss_debit, wechat_pay, boleto, or oxxo"
                },
                LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                      UnitAmount = 2000,
                      Currency = "usd",
                      ProductData = new SessionLineItemPriceDataProductDataOptions
                      {
                        Name = "Tele Appointment Charges",
                      },
                    },
                    Quantity = 1,
                  },
                },
                Mode = "payment",
                //SuccessUrl = "http://localhost:49000/Home/Index/PatientVitals/0/1",
                //CancelUrl = "http://localhost:49000/Home/Index/PatientVitals/0/1",
                SuccessUrl = "https://mycortexdev.vjhsoftware.in/Home/Index/PatientVitals/0/1",
                CancelUrl = "https://mycortexdev.vjhsoftware.in/Home/Index/PatientVitals/0/1",
            };
            var service = new SessionService();
            Session session = service.Create(options);

            return new RedirectResult(session.Url);
        }

        [HttpPost]
        public ActionResult Notify()
        {
            int retid = 0;
            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();
            retid = patientAppointmentsRepository.PaymentProvider_Notity_Log(json);
            dynamic data = JsonConvert.DeserializeObject(json);

            string OrderNumber = data.acquireOrder.orderNo;
            string merchantOrderNumber = data.acquireOrder.merchantOrderNo;
            string amount = data.acquireOrder.totalAmount.amount;
            string status = data.acquireOrder.status;
            long requestTime = data.acquireOrder.requestTime;
            string notifyId = data.notify_id;
            long notifyTimeStamp = data.notify_timestamp;
            //string data1 = data.toString();
            retid = patientAppointmentsRepository.PaymentStatusInfo_Insert(merchantOrderNumber, amount, OrderNumber, status, requestTime, notifyId, notifyTimeStamp);
            return Content("SUCCESS");
        }
        [HttpPost]
        public ActionResult SMSNotify()
        {
            int retid = 0;
            Stream req = Request.InputStream;
            req.Seek(0, System.IO.SeekOrigin.Begin);
            string json = new StreamReader(req).ReadToEnd();
            retid = patientAppointmentsRepository.Sms_Notify_Log(json);
            dynamic data = JsonConvert.DeserializeObject(json);

            //{ "version":"1.0","messageId":"33d21322-04eb-4992-b950-d41d0a7e2a71","toNumber":"971551911260","status":"sms_sent","statusCode":0,"MessageStatus":1}
            string MessageId = data.messageId;
            string PNumber = data.toNumber;
            string Status = data.status;
            string StatusCode = data.statusCode;
            string MessageStatus = data.MessageStatus;
            retid = patientAppointmentsRepository.SMSStatus_Update(MessageId,PNumber,Status,StatusCode,MessageStatus);
            //retid = patientAppointmentsRepository.PaymentStatusInfo_Insert(merchantOrderNumber, amount, OrderNumber, status, requestTime, notifyId, notifyTimeStamp);
            return Content("SUCCESS");
        }

        [HttpPost]
        public ActionResult LiveBoxNotify()
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                int retid = 0;
                string userID = "";
               
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                _MyLogger.Exceptions("Warn", _AppLogger, "Home/Livebox notify"+ json, null, _AppMethod);
                if (json.Contains("recordedvideoURL"))
                {
                    string conference_name = JObject.Parse(json)["conferencename"].ToString();
                    string Recordingurl = JObject.Parse(json)["recordedvideoURL"].ToString();

                    string Url = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                    string source_path = System.Web.HttpContext.Current.Server.MapPath("~/Images");
                    string pathToNewFolder = System.IO.Path.Combine(source_path, "Video");
                    DirectoryInfo directory = Directory.CreateDirectory(pathToNewFolder);
                    try
                    {
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        var postedFile = httpRequest.Files[Recordingurl];
                        var fileid = System.Guid.NewGuid() + ".mp4";
                        string returnPath = System.IO.Path.Combine(pathToNewFolder, fileid);
                        ServicePointManager.Expect100Continue = true;
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                        string url = Recordingurl;
                        string savePath = returnPath;
                        WebClient client = new WebClient();
                        client.DownloadFile(url, savePath);

                        FileStream fs = new FileStream(returnPath, FileMode.OpenOrCreate);
                        StreamWriter str = new StreamWriter(fs);
                        str.BaseStream.Seek(0, SeekOrigin.End);
                        str.Write(Recordingurl);
                        str.Flush();
                        str.Close();
                        fs.Close();
                        int response = repository.VideoCall_Recording_Logs(conference_name, fileid, Recordingurl, "Video");
                    }
                    catch (Exception err)
                    {
                        Console.WriteLine(err.Message);
                    }
                }
                if (json.Contains("recordedaudioURL"))
                {
                    string conference_name = JObject.Parse(json)["conferencename"].ToString();
                    string Recordingaudiourl = JObject.Parse(json)["recordedaudioURL"].ToString();

                    string Url = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                    string source_path = System.Web.HttpContext.Current.Server.MapPath("~/Images");
                    _MyLogger.Exceptions("Warn", _AppLogger, "Source Path " + source_path, null, _AppMethod);
                    string pathToNewFolder = System.IO.Path.Combine(source_path, "Audio");
                    DirectoryInfo directory = Directory.CreateDirectory(pathToNewFolder);
                    try
                    {
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        var postedFile = httpRequest.Files[Recordingaudiourl];
                        var fileid = System.Guid.NewGuid() + ".mp3";
                        string returnPath = System.IO.Path.Combine(pathToNewFolder, fileid);
                        ServicePointManager.Expect100Continue = true;
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                        string url = Recordingaudiourl;
                        string savePath = returnPath;
                        WebClient client = new WebClient();
                        client.DownloadFile(url, savePath);

                        FileStream fs = new FileStream(returnPath, FileMode.OpenOrCreate);
                        StreamWriter str = new StreamWriter(fs);
                        str.BaseStream.Seek(0, SeekOrigin.End);
                        str.Write(Recordingaudiourl);
                        str.Flush();
                        str.Close();
                        fs.Close();
                        _MyLogger.Exceptions("Warn", _AppLogger, "file name" + fileid, null, _AppMethod);
                        int response = repository.VideoCall_Recording_Logs(conference_name, fileid, Recordingaudiourl, "Audio");
                    }
                    catch (Exception err)
                    {
                        Console.WriteLine(err.Message);
                    }
                }
                dynamic data = JsonConvert.DeserializeObject(json);
                string conferencename = data.conferencename;
              
                
                if (json.Contains("recordedvideoURL"))
                {
                    string recording_url = data.recordedvideoURL;
                    retid = liveBoxRepository.LiveBox_Recording_url(conferencename, recording_url);
                }
                if (json.Contains("recordedaudioURL"))
                {
                    string recordingaudio_url = data.recordedaudioURL;
                    retid = liveBoxRepository.LiveBox_Recording_url(conferencename, recordingaudio_url);
                }
                //retid = liveBoxRepository.LiveBox_Notify_UPDATE(conferencename, InstitutionId,userID);

                //PushNotificationMessage message = new PushNotificationMessage();
                //message.Title = "Notification For Call";
                //message.Message = "call end";
                //long userid = 102111;
                string ConferenceId = JObject.Parse(json)["conferencename"].ToString();                

                if (json.Contains("remainingtime"))
                {
                    string RemainingTime = JObject.Parse(json)["remainingtime"].ToString();

                    retid = liveBoxRepository.LiveBox_RemainingTime(ConferenceId, RemainingTime);
                    Get_AppointmentDuration(ConferenceId);
                }
                else
                {
                    Get_AppointmentDuration(ConferenceId);
                }


                //PushNotificationApiManager.sendNotification(message, 0, userid, 4);
                string baseUrl = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                string redirectUrl = "https://" + baseUrl + "/Home/Index/PatientVitals/0/1";
                if (redirectUrl != String.Empty)
                {
                    var controller = new PatientAppointmentsController
                    {
                        Request = new System.Net.Http.HttpRequestMessage(),
                        Configuration = new System.Web.Http.HttpConfiguration()
                    };
                    var response = controller.RedirectToPatientVitals(redirectUrl);
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }

        [HttpGet]
        public long GetUserid(string UserName)
        {
            long Id;
            Id = repository.GetUserid(UserName);
            return Id;
        }

        //[HttpGet]
        //public long Get_AppointmentDuration(string Conference_ID)
        //{
        //    long duration;
        //    duration = repository.Get_AppointmentDuration(Conference_ID);
        //    return duration;
        //}

        [HttpPost]
        public ActionResult LiveBoxVideoNotify()
        {
            try
            {
                int retid = 0;
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                //PushNotificationMessage message = new PushNotificationMessage();
                //message.Title = "Notification For Call";
                //message.Message = "call end";
                //long userid = Convert.ToInt64(Session["UserId"].ToString());
                //PushNotificationApiManager.sendNotification(message, 0, userid, 4);
                if (json.Contains("recordedvideoURL"))
                {
                    string conference_name = JObject.Parse(json)["conferencename"].ToString();
                    string recording_url = JObject.Parse(json)["recordedvideoURL"].ToString();
                    string Recordingurl = JObject.Parse(json)["recordedvideoURL"].ToString();
                    
                    string baseUrl = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                    string source_path = System.Web.HttpContext.Current.Server.MapPath("~/Images");
                    string pathToNewFolder = System.IO.Path.Combine(source_path, "Video");
                    DirectoryInfo directory = Directory.CreateDirectory(pathToNewFolder);
                    try
                    {
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        var postedFile = httpRequest.Files[recording_url];
                        var fileid = System.Guid.NewGuid() + ".txt";
                        string returnPath = System.IO.Path.Combine(pathToNewFolder, fileid);
                        //ServicePointManager.Expect100Continue = true;
                        //ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                        //string url = Recordingurl;
                        //string savePath = returnPath;
                        //WebClient client = new WebClient();
                        //client.DownloadFile(url, savePath);

                        FileStream fs = new FileStream(returnPath, FileMode.OpenOrCreate);
                        StreamWriter str = new StreamWriter(fs);
                        str.BaseStream.Seek(0, SeekOrigin.End);
                        str.Write(recording_url);
                        str.Flush();
                        str.Close();
                        fs.Close();
                        int response = repository.Save_Video_Call_Recording_Logs(conference_name, returnPath, Recordingurl);
                    }
                    catch (Exception err)
                    {
                        Console.WriteLine(err.Message);
                    }
                }
                if (json.Contains("recordedaudioURL"))
                {
                    string conference_name = JObject.Parse(json)["conferencename"].ToString();
                    string recordingaudio_url = JObject.Parse(json)["recordedaudioURL"].ToString();
                    string Recordingaudiourl = JObject.Parse(json)["recordedaudioURL"].ToString();

                    string baseUrl = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                    string source_path = System.Web.HttpContext.Current.Server.MapPath("~/Images");
                    string pathToNewFolder = System.IO.Path.Combine(source_path, "Audio");
                    DirectoryInfo directory = Directory.CreateDirectory(pathToNewFolder);
                    try
                    {
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        var postedFile = httpRequest.Files[recordingaudio_url];
                        var fileid = System.Guid.NewGuid() + ".txt";
                        string returnPath = System.IO.Path.Combine(pathToNewFolder, fileid);
                        //ServicePointManager.Expect100Continue = true;
                        //ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                        //string url = Recordingurl;
                        //string savePath = returnPath;
                        //WebClient client = new WebClient();
                        //client.DownloadFile(url, savePath);

                        FileStream fs = new FileStream(returnPath, FileMode.OpenOrCreate);
                        StreamWriter str = new StreamWriter(fs);
                        str.BaseStream.Seek(0, SeekOrigin.End);
                        str.Write(recordingaudio_url);
                        str.Flush();
                        str.Close();
                        fs.Close();
                        int response = repository.Save_Video_Call_Recording_Logs(conference_name, returnPath, Recordingaudiourl);
                    }
                    catch (Exception err)
                    {
                        Console.WriteLine(err.Message);
                    }
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }

        [HttpPost]
        public ActionResult LiveBoxRemainingTimeNotify()
        {
            try
            {
                int retFlag = 0;
                //{"conferencename":"eb62b1ec-2fd5-4718-b8d9-fe2cc8c3971e","RemainingConferenceTime":"29:30"}
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                string ConferenceId = JObject.Parse(json)["conferencename"].ToString();
                string RemainingTime = JObject.Parse(json)["remainingtime"].ToString();

                if (json.Contains("remainingtime"))
                {
                    retFlag = liveBoxRepository.LiveBox_RemainingTime(ConferenceId, RemainingTime);
                    Get_AppointmentDuration(ConferenceId);
                }
                else
                {
                    Get_AppointmentDuration(ConferenceId);
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }

        //[HttpGet]
        //public ActionResult Get_AppointmentDuration(string Conference_ID)
        //{
        //    List<string> t = new List<string>();
        //    var jsonSerialiser = new JavaScriptSerializer();
        //    try
        //    {
        //        IList<LiveboxModel> lst = (IList<LiveboxModel>)liveBoxRepository.Get_AppointmentDuration(Conference_ID);
        //        t.Add(lst[0].ConferenceId.ToString());
        //        t.Add(lst[0].Duration.ToString());
        //        var json = jsonSerialiser.Serialize(t);
        //        return Content(json);
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}
        [HttpGet]
        public ActionResult Get_AppointmentDuration(string Conference_ID)
        {
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            string ConferenceName = "ConferenceId";
            string Duration = "Duration";
            //string Doctor_Id = "Doctor_Id";
            //string Patient_Id= "Patient_Id";

            try
            {
                IList<LiveboxModel> lst = (IList<LiveboxModel>)liveBoxRepository.Get_AppointmentDuration(Conference_ID);
                IDictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add(new KeyValuePair<string, string>(ConferenceName, lst[0].ConferenceId.ToString()));
                dic.Add(new KeyValuePair<string, string>(Duration, lst[0].Duration.ToString()));
               // dic.Add(new KeyValuePair<string, string>(Doctor_Id, lst[0].Doctor_Id.ToString()));
               // dic.Add(new KeyValuePair<string, string>(Patient_Id, lst[0].Patient_Id.ToString()));

                //Doctor_Id = lst[0].Doctor_Id.ToString();

                //t.Add(lst[0].ConferenceId.ToString());
                //t.Add(lst[0].Duration.ToString());
                var json = jsonSerialiser.Serialize(dic);

                //if (json.Contains("Doctor_Id"))
                //{
                //    long DoctorID = Convert.ToInt64(JObject.Parse(json)["Doctor_Id"].ToString());
                //    IList<EmailListModel> EmailList = alertrepository.UserSpecificEmailList(InstitutionId, DoctorID);
                //}
                //if (json.Contains("Patient_Id"))
                //{
                //    long PatientID = Convert.ToInt64(JObject.Parse(json)["Patient_Id"].ToString());
                //    IList<EmailListModel> EmailList = alertrepository.UserSpecificEmailList(InstitutionId, PatientID);
                //}

                return Content(json);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpPost]
        public ActionResult RefundNotify(long id, string  merchantorderno)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                int retid = 0;
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = patientAppointmentsRepository.PaymentProvider_Notity_Log(json);
                dynamic data = JsonConvert.DeserializeObject(json);

                //string OrderNumber = data.refundOrder.orderNo;
                //string merchantOrderNumber = data.refundOrder.refundMerchantOrderNo;
                //string originMerchantOrderNo = data.refundOrder.originMerchantOrderNo;
                //string amount = data.refundOrder.amount.amount;
                //string status = data.refundOrder.status;
                ////long requestTime = data.acquireOrder.requestTime;
                //string notifyId = data.notify_id;
                //long notifyTimeStamp = data.notify_timestamp;
                ////string data1 = data.toString();
                //retid = patientAppointmentsRepository.PaymentRefundStatusInfo_Insert(merchantOrderNumber, originMerchantOrderNo, amount, OrderNumber, status, notifyId, notifyTimeStamp);
                string status = data.refundOrder.status;
                if (status == "REFUNDED_SETTLED")
                {
                    long refundAppointmentId = id;
                    string refundMerchantOrderNo = merchantorderno;
                    retid = patientAppointmentsRepository.PaymentStatus_Update(refundAppointmentId, "Refund Settled", refundMerchantOrderNo);
                }
                return Content("SUCCESS");
            }
            catch(Exception ex)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Content("Error");
            }
        }

        [HttpPost]
        public ActionResult CreatePayByCheckoutSession(FormCollection form)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string redirectUrl = string.Empty;
            string privateKey = string.Empty;
            string publicKey = string.Empty;
            string partnetId = string.Empty;
            //string baseUrl = HttpContext.Request.Url.Authority;
            long appointmentId = Convert.ToInt64(form["paymentAppointmentId"]);
            long departmentId = Convert.ToInt64(form["paymentdepartmentId"]);
            long PInstitutionId = Convert.ToInt64(form["paymentInstitutionId"]);
            string redirectParam = Convert.ToString(form["RedirectParam"]);
            double amount2 = Convert.ToDouble(gatewayrepository.PatientAmount(PInstitutionId, departmentId, appointmentId));
            string merchantOrderNumber = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10);
            int retid = patientAppointmentsRepository.PaymentStatus_Update(appointmentId, "Payment Initiated", merchantOrderNumber);
            string baseUrl = HttpContext.Request.Url.Host.ToString();
            gatewayModel = gatewayrepository.GatewaySettings_Details(PInstitutionId, 2, "RSAPrivateKey");
            if (gatewayModel.Count > 0)
            {
                privateKey = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(PInstitutionId, 2, "PublicKey");
            if (gatewayModel.Count > 0)
            {
                publicKey = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(PInstitutionId, 2, "PartnerId");
            if (gatewayModel.Count > 0)
            {
                partnetId = gatewayModel[0].GatewayValue;
            }
            privateKey = privateKey.Replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .Replace("-----END RSA PRIVATE KEY-----", "");

            RsaHelper rsaHelper = new RsaHelper();
            //Console.OutputEncoding = System.Text.Encoding.Default;
            string json = Request.Url.GetLeftPart(UriPartial.Authority);
            int retid1 = patientAppointmentsRepository.PaymentProvider_Notity_Log(json);
            PayByCreateOrderRequest payByCreateReq = new PayByCreateOrderRequest();
            BizContent bizContent = new BizContent
            {
                merchantOrderNo = merchantOrderNumber,
                subject = "TeleConsultation",
                totalAmount = new TotalAmount
                {
                    currency = "AED",
                    amount = amount2
                },
                paySceneCode = "PAYPAGE",
                paySceneParams = new PaySceneParams
                {
                    redirectUrl =  "https://"+ baseUrl + "/Home/Index/PatientVitals/"+ redirectParam //+"0/1?orderId=414768633924763654"
                },
                notifyUrl = "https://"+ baseUrl +"/Home/Notify/",
                accessoryContent = new AccessoryContent
                {
                    amountDetail = new AmountDetail
                    {
                        vatAmount = new VatAmount
                        {
                            currency = "AED",
                            amount = 20.65
                        },
                        amount = new Amount
                        {
                            currency = "AED",
                            amount = 1.09
                        }
                    },
                    goodsDetail = new GoodsDetail
                    {
                        body = "TeleConsultation",
                        categoriesTree = "CT12",
                        goodsCategory = "GC10",
                        goodsId = "GI1005",
                        goodsName = "Consulation",
                        price = new User.Model.Price
                        {
                            currency = "AED",
                            amount = 10.87
                        },
                        quantity = 2
                    },
                    terminalDetail = new TerminalDetail
                    {
                        operatorId = "OP1000000000000001",
                        storeId = "SI100000000000002",
                        terminalId = "TI100999999999900",
                        merchantName = "MyCortex",
                        storeName = "MyCortexQA"
                    }
                }
            };
            DateTime unixRef = new DateTime(1970, 1, 1, 0, 0, 0);

            payByCreateReq.requestTime = (DateTime.UtcNow.Ticks - unixRef.Ticks) / 10000;
            payByCreateReq.bizContent = bizContent;
            try
            {
                string url = "https://uat.test2pay.com/sgs/api/acquire2/placeOrder";
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";
                req.Headers["Content-Language"] = "en";

                string strJPostData = JsonConvert.SerializeObject(payByCreateReq, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                string signParams = strJPostData.Replace("\n", "").Replace(" ", "").Replace("\t", "").Replace("\r", "").Replace("\\", "");
                privateKey = privateKey.Replace("\r\n", "");
                string sign = rsaHelper.Sign(signParams, privateKey);
                req.Headers["sign"] = sign;
                req.Headers["Partner-Id"] = partnetId;

                UTF8Encoding encoding = new UTF8Encoding();
                byte[] post = encoding.GetBytes(strJPostData);
                req.ContentLength = post.Length;

                using (Stream writer = req.GetRequestStream())
                {
                    writer.Write(post, 0, post.Length);
                }

                using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
                {
                    DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(PayByCreateOrderResponse));
                    object objResponse = jsonSerializer.ReadObject(res.GetResponseStream());
                    PayByCreateOrderResponse tokenRes = objResponse as PayByCreateOrderResponse;
                    var toekndata = new JavaScriptSerializer().Serialize(tokenRes);
                    /*_MyLogger.Exceptions("INFO", _AppLogger, tokenRes.body.interActionParams.tokenUrl, null, _AppMethod);*/
                    if (tokenRes != null && tokenRes.body != null && tokenRes.body.interActionParams != null && !string.IsNullOrEmpty(tokenRes.body.interActionParams.tokenUrl))
                    {
                        redirectUrl = tokenRes.body.interActionParams.tokenUrl;
                    }
                }
            }
            catch (WebException wx)
            {
               _MyLogger.Exceptions("ERROR", _AppLogger, wx.Message, wx, _AppMethod);
                if (wx.Message != null)
                {
                    using (WebResponse response = wx.Response)
                    {
                        if (wx.Response != null)
                        {
                            HttpWebResponse httpResponse = (HttpWebResponse)response;
                            using (Stream data = response.GetResponseStream())
                            {
                                string text = new StreamReader(data).ReadToEnd();
                                if (!string.IsNullOrEmpty(text))
                                {

                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
            _MyLogger.Exceptions("Warn", _AppLogger, redirectUrl, null, _AppMethod);
            return new RedirectResult(redirectUrl);
        }

        [HttpPost]
        public ActionResult RefundPayByCheckoutSession(FormCollection form)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string redirectUrl = string.Empty;
            string privateKey = string.Empty;
            string publicKey = string.Empty;
            string partnetId = string.Empty;
            string baseUrl = HttpContext.Request.Url.Host.ToString();
            try
            {
                redirectUrl = "https://"+ baseUrl + "/Home/Index/PatientVitals/0/1";
                long refundAppointmentId = Convert.ToInt64(form["refundAppointmentId"]);
                string refundMerchantOrderNo = Convert.ToString(form["refundMerchantOrderNo"]);
                double refundAmount = Convert.ToInt64(form["refundAmount"]);
                string refundOrderNo = Convert.ToString(form["refundOrderNo"]);
                long refundInstitutionId = Convert.ToInt64(form["refundInstitutionId"]);
                //double amount2 = Convert.ToDouble(gatewayrepository.PatientAmount(PInstitutionId, departmentId));
                string merchantOrderNumber = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10);
                int retid = patientAppointmentsRepository.PaymentStatus_Update(refundAppointmentId, "Refund Initiated", refundMerchantOrderNo);

                gatewayModel = gatewayrepository.GatewaySettings_Details(refundInstitutionId, 2, "RSAPrivateKey");
                if (gatewayModel.Count > 0)
                {
                    privateKey = gatewayModel[0].GatewayValue;
                }
                gatewayModel = gatewayrepository.GatewaySettings_Details(refundInstitutionId, 2, "PublicKey");
                if (gatewayModel.Count > 0)
                {
                    publicKey = gatewayModel[0].GatewayValue;
                }
                gatewayModel = gatewayrepository.GatewaySettings_Details(refundInstitutionId, 2, "PartnerId");
                if (gatewayModel.Count > 0)
                {
                    partnetId = gatewayModel[0].GatewayValue;
                }
                privateKey = privateKey.Replace("-----BEGIN RSA PRIVATE KEY-----", "")
                    .Replace("-----END RSA PRIVATE KEY-----", "");

                RsaHelper rsaHelper = new RsaHelper();
                PayByCreateOrderRequest payByCreateReq = new PayByCreateOrderRequest();
                BizContent bizContent = new BizContent
                {
                    refundMerchantOrderNo = merchantOrderNumber,
                    originMerchantOrderNo = refundMerchantOrderNo,
                    amount = new TotalAmount
                    {
                        currency = "AED",
                        amount = refundAmount
                    },
                    operatorName = "zxy",
                    reason = "refund",
                    notifyUrl = "https://"+ baseUrl +"/Home/RefundNotify?id="+ refundAppointmentId + "&merchantorderno="+ refundMerchantOrderNo +"",
                };
                DateTime unixRef = new DateTime(1970, 1, 1, 0, 0, 0);
                payByCreateReq.requestTime = (DateTime.UtcNow.Ticks - unixRef.Ticks) / 10000;
                payByCreateReq.bizContent = bizContent;
                try
                {
                    string url = "https://uat.test2pay.com/sgs/api/acquire2/refund/placeOrder";
                    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                    req.Method = "POST";
                    req.ContentType = "application/json";
                    req.Headers["Content-Language"] = "en";

                    string strJPostData = JsonConvert.SerializeObject(payByCreateReq, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                    string signParams = strJPostData.Replace("\n", "").Replace(" ", "").Replace("\t", "").Replace("\r", "").Replace("\\", "");
                    privateKey = privateKey.Replace("\r\n", "");
                    string sign = rsaHelper.Sign(signParams, privateKey);
                    req.Headers["sign"] = sign;
                    req.Headers["Partner-Id"] = partnetId;

                    UTF8Encoding encoding = new UTF8Encoding();
                    byte[] post = encoding.GetBytes(strJPostData);
                    req.ContentLength = post.Length;

                    using (Stream writer = req.GetRequestStream())
                    {
                        writer.Write(post, 0, post.Length);
                    }

                    using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
                    {
                        DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(PayByCreateOrderResponse));
                        object objResponse = jsonSerializer.ReadObject(res.GetResponseStream());
                        PayByCreateOrderResponse tokenRes = objResponse as PayByCreateOrderResponse;
                        if (tokenRes != null && tokenRes.body != null && tokenRes.body.interActionParams != null && !string.IsNullOrEmpty(tokenRes.body.interActionParams.tokenUrl))
                        {
                            redirectUrl = tokenRes.body.interActionParams.tokenUrl;
                        }
                    }
                }
                catch (WebException wx)
                {
                   _MyLogger.Exceptions("ERROR", _AppLogger, wx.Message, wx, _AppMethod);
                    if (wx.Message != null)
                    {
                        using (WebResponse response = wx.Response)
                        {
                            if (wx.Response != null)
                            {
                                HttpWebResponse httpResponse = (HttpWebResponse)response;
                                using (Stream data = response.GetResponseStream())
                                {
                                    string text = new StreamReader(data).ReadToEnd();
                                    if (!string.IsNullOrEmpty(text))
                                    {

                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
 
               _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
            return new RedirectResult(redirectUrl);
        }
    }
}