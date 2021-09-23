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
using log4net;
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
using MyCortex.Repositories;
using MyCortex.Utilities;
using Stripe;
using Stripe.Checkout;
using System.Net;
using System.Text;
using System.IO;
using System.Runtime.Serialization.Json;
using MyCortex.Admin.Models;

namespace MyCortex.Home.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class HomeController : Controller
    {
        public string returnError = "";
        private CommonMenuRepository db = new CommonMenuRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        static readonly IGatewaySettingsRepository gatewayrepository = new GatewaySettingsRepository();
        static readonly IPatientAppointmentsRepository patientAppointmentsRepository = new PatientAppointmentRepository();
        private LoginRepository login = new LoginRepository();
        private UserRepository repository = new UserRepository();

        private InstitutionRepository Insrepository = new InstitutionRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

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
        public ActionResult Index()
        {
            try
            {
                long UserId = Convert.ToInt32(Session["UserId"].ToString());
                if (UserId > 0)
                {
                    //var lst = "";
                    var lst = db.CommonMenu_Listall(UserId);
                    ViewData.Model = lst;
                    return View(lst);

                }
                else
                {
                    return RedirectToAction("LoginIndex");
                }

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserId"] == null)
                Response.Redirect("LoginIndex");
        }

        // GET: Login Index
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

        /// <summary>
        /// to update user logout details
        /// </summary>
        /// <returns></returns>
        [CheckSessionOutFilter]
        public ActionResult LoginOut()
        {
            try
            {
                long UserID = Convert.ToInt32(Session["UserId"].ToString());
                string SessionId = Convert.ToString(Session["Login_Session_Id"].ToString());
                login.User_LogOut(UserID, SessionId);
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
                return RedirectToAction("LoginIndex");
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [CheckSessionOutFilter]
        public ActionResult LoginOutAllDevice()
        {
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
                return RedirectToAction("LoginIndex");
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
                        string DOB = "";
                        DOB = ((DateTime)i.DOB).ToString("dd-MM-yyyy");
                        t.Add(DOB.ToString());
                        t.Add(i.UserType.ToString());
                        t.Add(i.MOBILE_NO.ToString());
                        if (i.FullName != null)
                        {
                            string fullname = " ";
                            fullname = (i.FullName).ToString();
                            fullname = fullname.Replace(",", "");
                            t.Add(fullname);
                        }
                        t.Add(i.GENDER_NAME.ToString());
                        t.Add(i.Employee_Name.ToString());
                        t.Add(i.PatientType.ToString());
                        t.Add(i.UserType.ToString());
                    }
                    var json = jsonSerialiser.Serialize(t);
                    return Content(json);
                }
                return null;
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            //long EmployeeId = Convert.ToInt32(Session["UserId"].ToString());
            //long UserTypeId = Convert.ToInt32(Session["UserTypeId"].ToString());
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<EmployeeLoginModel> lst = login.GetProduct_Details();
                t.Add(lst[0].ProductName);
                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }


        [AllowAnonymous]
        [CheckSessionOutFilter]
        public ActionResult GetProduct_CopyRight()
        {
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// Institution logo of the logged in user
        /// </summary>
        /// <returns>Institution logo blob</returns>
        public ActionResult LoginLogoDetails()
        {
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
                    t.Add(lst[0].ProductImg);
                }

                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }
        /// <summary>
        /// Institution logo of the logged in user
        /// </summary>
        /// <returns>Institution logo blob</returns>
        public ActionResult LoginPageLogoDetails()
        {
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
                _logger.Error(ex.Message, ex);
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
            DataEncryption Encrypt = new DataEncryption();
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
            model1.Username = Encrypt.Encrypt(Session["EmailId"].ToString());
            model1.DeviceType = "Web";
            model1.LoginType = 2;
            model1.Sys_TimeDifference = Convert.ToInt32(Session["Sys_TimeDifference"].ToString());
            model1.Browser_Version = (Session["Browser_Version"].ToString());
            model1.Login_Country = (Session["Login_Country"].ToString());
            model1.Login_City = (Session["Login_City"].ToString());
            model1.Login_IpAddress = (Session["Login_IPAdddress"].ToString());


            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = login.Userlogin_AddEdit(model1);

            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            try
            {
                IList<EmployeeLoginModel> lst = login.BuildVersion_Details();
                foreach (var i in lst)
                {
                    t.Add(i.BuildNo.ToString());
                }
                var json = jsonSerialiser.Serialize(t);
                return Content(json);
            }

            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return null;
            }
        }

        [AllowAnonymous]
        public ActionResult ProductDetails()
        {

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
                _logger.Error(ex.Message, ex);
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
                //SuccessUrl = "http://localhost:49000/Home/Index#/PatientVitals/0/1",
                //CancelUrl = "http://localhost:49000/Home/Index#/PatientVitals/0/1",
                SuccessUrl = "https://mycortexdev.vjhsoftware.in/Home/Index#/PatientVitals/0/1",
                CancelUrl = "https://mycortexdev.vjhsoftware.in/Home/Index#/PatientVitals/0/1",
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
            dynamic data = JsonConvert.DeserializeObject(json);

            string OrderNumber = data.acquireOrder.orderNo;
            string merchantOrderNumber = data.acquireOrder.merchantOrderNo;
            string amount = data.acquireOrder.totalAmount.amount;
            string status = data.acquireOrder.status;
            long requestTime = data.acquireOrder.requestTime;
            string notifyId = data.notify_id;
            long notifyTimeStamp = data.notify_timestamp;
            //string data1 = data.toString();
            retid = patientAppointmentsRepository.PaymentProvider_Notity_Log(json);
            retid = patientAppointmentsRepository.PaymentStatusInfo_Insert(merchantOrderNumber, amount, OrderNumber, status, requestTime, notifyId, notifyTimeStamp);
            return null;
        }

        [HttpPost]
        public ActionResult CreatePayByCheckoutSession(long appointmentId)
        {
            string redirectUrl = string.Empty;
            string privateKey = string.Empty;
            string publicKey = string.Empty;
            string partnetId = string.Empty;
            string merchantOrderNumber = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10);
            int retid = patientAppointmentsRepository.PaymentStatus_Update(appointmentId, "Payment Initiated");
            gatewayModel = gatewayrepository.GatewaySettings_Details(15, 2, "PrivateKey");
            if (gatewayModel.Count > 0)
            {
                privateKey = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(15, 2, "PublicKey");
            if (gatewayModel.Count > 0)
            {
                publicKey = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(15, 2, "PartnerId");
            if (gatewayModel.Count > 0)
            {
                partnetId = gatewayModel[0].GatewayValue;
            }
            privateKey = privateKey.Replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .Replace("-----END RSA PRIVATE KEY-----", "");

            RsaHelper rsaHelper = new RsaHelper();
            //Console.OutputEncoding = System.Text.Encoding.Default;
            PayByCreateOrderRequest payByCreateReq = new PayByCreateOrderRequest();
            BizContent bizContent = new BizContent
            {
                merchantOrderNo = merchantOrderNumber,
                subject = "TeleConsultation",
                totalAmount = new TotalAmount
                {
                    currency = "AED",
                    amount = 25
                },
                paySceneCode = "PAYPAGE",
                paySceneParams = new PaySceneParams
                {
                    redirectUrl = "https://mycortexdev.vjhsoftware.in/Home/Index#/PatientVitals/0/1?orderId=414768633924763654"
                },
                notifyUrl = "https://mycortexdev.vjhsoftware.in/PatientAppointment/Notify/",
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
                    if (tokenRes != null && tokenRes.body != null && tokenRes.body.interActionParams != null && !string.IsNullOrEmpty(tokenRes.body.interActionParams.tokenUrl))
                    {
                        redirectUrl = tokenRes.body.interActionParams.tokenUrl;
                    }
                }
            }
            catch (WebException wx)
            {
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
                return null;
            }
            return new RedirectResult(redirectUrl);
        }
    }
}