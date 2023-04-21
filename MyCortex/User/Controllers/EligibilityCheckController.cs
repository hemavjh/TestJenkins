using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.IO;
using System.Web.Http;
using Newtonsoft.Json;
using MyCortex.Masters.Models;
using MyCortex.Provider;
using System.Text;
using System.Runtime.Serialization.Json;
using MyCortex.Repositories.Masters;
using MyCortex.Repositories.Uesr;
using MyCortex.Home.Models;
using System.Web.Script.Serialization;
using System.Web.Http.Results;
using System.Web.Services.Description;
using Stripe;
using Newtonsoft.Json.Linq;
using MyCortex.Admin.Controllers;
using MyCortex.User.Model;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Threading;
using System.Web.Helpers;

namespace MyCortex.User.Controllers
{
    public class EligibilityCheckController : ApiController
    {
        static readonly IUserRepository repository = new UserRepository();
        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        static readonly IPatientAppointmentsRepository Prepository = new PatientAppointmentRepository();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;


        [HttpGet]
        [Authorize]
        public async Task<HttpResponseMessage> CheckEligibility(long? AppointmentId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<EligibilityParamModel> ModelData = new List<EligibilityParamModel>();
            EligibilityParamReturnModel model = new EligibilityParamReturnModel();

            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.Error_Code = "";
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            string LanguageKey = "";
            try
            {
                ModelData = Prepository.Get_DetailsByAppointment(AppointmentId);
                if (ModelData.Count > 0)
                {
                    var CountryCode = ModelData[0].MOBILE_NO.Split('~')[0];
                    var MobileNumber = ModelData[0].MOBILE_NO.Split('~')[1];
                    if (CountryCode == null || CountryCode == "undefined" || CountryCode == "")
                    {
                        CountryCode = "+971";
                    }
                    var PayerId = ModelData[0].PayorId;
                    EligibilityParamModel re = new EligibilityParamModel();
                    re.NATIONALITY_ID = ModelData[0].NATIONALITY_ID;
                    re.Clinicianlist = ModelData[0].Clinicianlist;
                    re.MOBILE_NO = MobileNumber;
                    re.PayorId = PayerId;
                    re.ServiceCategory = 12;
                    re.countrycode = CountryCode;
                    re.facilityLicense = ModelData[0].facilityLicense;

                    var Appconfig_Value = ModelData[0].facilityLicense;
                    var Eligibility_Timeout = ModelData[0].Eligibility_Timeout;
                    var Id = ModelData[0].AppointmentId;
                    var BaseUrl = ModelData[0].BaseUrl;

                    var json = JsonConvert.SerializeObject(re, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                    var jObject = JObject.Parse(json);
                    var loadobj = JsonConvert.DeserializeObject<JObject>(jObject.ToString());

                    HttpClient client = new HttpClient();
                    var content = new StringContent(loadobj.ToString());
                    content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                     client.BaseAddress = new Uri(BaseUrl); //("http://localhost:49000/"); // if we check in local, please change the base url
                    //client.BaseAddress = new Uri("http://localhost:49000/"); // if we check in local, please change the base url
                    var response1 = await client.PostAsync("/api/EligibilityCheck/AddEligibilityEequest/", content);
                    var responseContent = await response1.Content.ReadAsStringAsync();
                    if (responseContent != null)
                    {
                        if (responseContent.Contains("["))
                        {
                            var jArray = responseContent.Replace("[", string.Empty); //JObject.Parse(responseContent);
                            jArray = jArray.Replace("]", string.Empty); //JObject.Parse(responseContent);
                            responseContent = jArray;
                        }
                        var loadobj1 = JsonConvert.DeserializeObject<JObject>(responseContent.ToString());
                        var loadobj2 = JsonConvert.DeserializeObject<RequestEligibilityResponse_useList>(responseContent);
                        if (loadobj2.status == 1)
                        {
                            var eligibility_Id = loadobj2.data.eligibilityId;
                            var content1 = new StringContent("");
                            content1.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                            for (int j = 0; j < Eligibility_Timeout; j++)
                            {
                                if (j == Eligibility_Timeout)
                                {
                                    // Patient appointment status update
                                    await PatientAppointmentStatusUpdate(Id, 5, 4, BaseUrl);
                                    // cancel the eligibility id
                                    await CancelEligibility(eligibility_Id, BaseUrl);

                                    messagestr = "Insurance Rejected";
                                    LanguageKey = "insurancerejected";
                                    model.ReturnFlag = 1;
                                    break;
                                }
                                else
                                {
                                    var responsedet = await client.GetAsync("/api/PayBy/EligibilityRequestDetail?eligibilityID=" + eligibility_Id + "&facilityLicense=" + Appconfig_Value);
                                    var responseDetContent = responsedet.Content.ReadAsStringAsync(); // get the 
                                    if (responseDetContent != null)
                                    {
                                        // This is for get all data
                                        var loadobj3 = JsonConvert.DeserializeObject<RequestEligibilityDetailResponse_bylist>(responseDetContent.Result.ToString());

                                        //this is for get the result value
                                        var loadobj4 = JsonConvert.DeserializeObject<eligibilityCheck>(responseDetContent.Result.ToString());
                                        var result = loadobj4.result;

                                        await CancelEligibility(eligibility_Id, BaseUrl);

                                        if (result == false)
                                        {
                                          await PatientAppointmentStatusUpdate(Id, 5, 4, BaseUrl);

                                            messagestr = "Insurance Rejected";
                                            LanguageKey = "insurancerejected";
                                        }
                                        else
                                        {
                                           await PatientAppointmentStatusUpdate(Id, 1, 3, BaseUrl); 

                                            messagestr = "Insurance Approved";
                                            LanguageKey = "insuranceapproved";
                                        }                                        
                                        model.ReturnFlag = 1;

                                        break;
                                    }
                                    else
                                    {
                                        System.Threading.Thread.Sleep(60000);
                                    }
                                }
                            };
                            model.Status = "True";
                        }
                        else if (loadobj2.status == -2)
                        {
                            messagestr = "particular patient already requested...";
                            LanguageKey = "patientalreadyrequested";
                            model.Status = "False";
                        }
                        else if (loadobj2.status == -3 || loadobj2.status == -1)
                        {
                            if (loadobj2.status == -1)
                            {                               
                                await PatientAppointmentStatusUpdate(Id, 5, 4, BaseUrl);
                            }
                            model.ReturnFlag = 1;
                            messagestr = loadobj2.errors;
                            LanguageKey = "";
                            model.Status = "False";
                        }
                    }
                }
                else
                {
                    messagestr = "Invalid Appointment";
                    LanguageKey = "invalidappointment";
                    model.Status = "False";
                }
                model.Error_Code = "";
                model.Message = messagestr;
                model.LanguageKey = LanguageKey;
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in eligibility checking in appointment";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        public async Task PatientAppointmentStatusUpdate(long AppointmentId, int Status, int PaymentStatusId, string BaseUrl)
        {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(BaseUrl); 
            //client.BaseAddress = new Uri("http://localhost:49000/"); // if we check in local, please change the base url

            UpdateAppointment jobj1 = new UpdateAppointment();
            jobj1.Appointment_Id = AppointmentId;
            jobj1.Status = Status;
            jobj1.PaymentStatus_Id = PaymentStatusId;
            var json31 = JsonConvert.SerializeObject(jobj1, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore});
            var jObject41 = JObject.Parse(json31);
            var loadobj51 = JsonConvert.DeserializeObject<JObject>(jObject41.ToString());
            var content21 = new StringContent(loadobj51.ToString());
            content21.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            var responseupd1 = await client.PostAsync("/api/PatientAppointments/Patient_Appointment_Status_Update/", content21);
            var responseUpdateContent1 = await responseupd1.Content.ReadAsStringAsync();
        }
        public async Task CancelEligibility(long eligibility_Id, string BaseUrl)
        {           
                HttpClient client = new HttpClient();
                 client.BaseAddress = new Uri(BaseUrl); //("http://localhost:49000/"); // if we check in local, please change the base url
                //client.BaseAddress = new Uri("http://localhost:49000/"); // if we check in local, please change the base url

                FalseEligibility jobj = new FalseEligibility();
                jobj.eligibilityId = eligibility_Id;
                var json3 = JsonConvert.SerializeObject(jobj, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                var jObject4 = JObject.Parse(json3);
                var loadobj5 = JsonConvert.DeserializeObject<JObject>(jObject4.ToString());
                var content2 = new StringContent(loadobj5.ToString());
                content2.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                var responseCan = await client.PostAsync("/api/EligibilityCheck/CancelEligibilityEequest/", content2);
                var responseCancelContent = await responseCan.Content.ReadAsStringAsync();    //   .content.ReadAsStringAsync();
        }


        [HttpPost]
        //[Authorize]
        public HttpResponseMessage AddEligibilityEequest([FromBody] Newtonsoft.Json.Linq.JObject form)
        {
            object objResponse;
            try
            {
                string emiratesId = Convert.ToString(form["NATIONALITY_ID"]);
                // int consultationCategoryId = Convert.ToInt32(form["ConsultationCategory"]);
                string clinicianLicense = Convert.ToString(form["Clinicianlist"]);
                string mobileNumber = Convert.ToString(form["MOBILE_NO"]);
                int payerId = Convert.ToInt32(form["PayorId"]);
                int serviceCategoryId = Convert.ToInt32(form["ServiceCategory"]);
                string countryCode = Convert.ToString(form["countrycode"]);
                string facilityLicense = Convert.ToString(form["facilityLicense"]);

                RequestEligibility re = new RequestEligibility();
                re.emiratesId = emiratesId;
                // re.consultationCategoryId = consultationCategoryId;
                re.clinicianLicense = clinicianLicense;
                re.mobileNumber = mobileNumber;
                re.payerId = payerId;
                re.serviceCategoryId = serviceCategoryId;
                re.countryCode = countryCode;
                re.facilityLicense = facilityLicense;

                //RequestEligibility re = new RequestEligibility
                //{
                //    emiratesId = "784199765832854",
                //    clinicianLicense = "GN30148",
                //    consultationCategoryId = 4,
                //    countryCode = "+971",
                //    mobileNumber = "566767676",
                //    payerId = 305,
                //    referralLetterRefNo = "",
                //    serviceCategoryId = 12,
                //    facilityLicense = "MF2007",
                //};

                string url = "https://integration.inhealth.ae/api/eligibilitycheck/addeligibilityrequest";
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";
                req.Accept = "*/*";
                // req.Headers["Connection"] = "keep-alive";
                // req.Headers["Accept-Encoding"] = "gzip, deflate, br";
                req.Headers["Content-Language"] = "en";
                req.Headers["Authorization"] = "c2d0928a-7463-428d-bd12-72fda8757089";
                string strJPostData = JsonConvert.SerializeObject(re, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                UTF8Encoding encoding = new UTF8Encoding();
                byte[] post = encoding.GetBytes(strJPostData);
                req.ContentLength = post.Length;
                using (Stream writer = req.GetRequestStream())
                {
                    writer.Write(post, 0, post.Length);
                }
                using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
                {
                    DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(RequestEligibilityResponse));
                    objResponse = jsonSerializer.ReadObject(res.GetResponseStream());
                }
            }
            catch (Exception ex)
            {
               return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
            return Request.CreateResponse(HttpStatusCode.OK, objResponse);
        }

        //[HttpPost]
        //[Authorize]
        //public HttpResponseMessage AddEligibilityEequest_ByService([FromBody] Newtonsoft.Json.Linq.JObject form)
        //{
        //    object objResponse;
        //    try
        //    {
        //        string emiratesId = Convert.ToString(form["NATIONALITY_ID"]);
        //        int consultationCategoryId = Convert.ToInt32(form["ConsultationCategory"]);
        //        string clinicianLicense = Convert.ToString(form["Clinicianlist"]);
        //        string mobileNumber = Convert.ToString(form["MOBILE_NO"]);
        //        int payerId = Convert.ToInt32(form["PayorId"]);
        //        int serviceCategoryId = Convert.ToInt32(form["ServiceCategory"]);
        //        string countryCode = Convert.ToString(form["countrycode"]);

        //        RequestEligibility re = new RequestEligibility();
        //        re.emiratesId = emiratesId;
        //        re.consultationCategoryId = consultationCategoryId;
        //        re.clinicianLicense = clinicianLicense;
        //        re.mobileNumber = mobileNumber;
        //        re.payerId = payerId;
        //        re.serviceCategoryId = serviceCategoryId;
        //        re.countryCode = countryCode;
        //        re.facilityLicense = "MF2007";

        //        //RequestEligibility re = new RequestEligibility
        //        //{
        //        //    emiratesId = "784199765832854",
        //        //    clinicianLicense = "GN30148",
        //        //    consultationCategoryId = 4,
        //        //    countryCode = "+971",
        //        //    mobileNumber = "566767676",
        //        //    payerId = 305,
        //        //    referralLetterRefNo = "",
        //        //    serviceCategoryId = 12,
        //        //    facilityLicense = "MF2007",
        //        //};

        //        string url = "https://integration.inhealth.ae/api/eligibilitycheck/addeligibilityrequest";
        //        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
        //        req.Method = "POST";
        //        req.ContentType = "application/json";
        //        req.Accept = "*/*";
        //        // req.Headers["Connection"] = "keep-alive";
        //        // req.Headers["Accept-Encoding"] = "gzip, deflate, br";
        //        req.Headers["Content-Language"] = "en";
        //        req.Headers["Authorization"] = "c2d0928a-7463-428d-bd12-72fda8757089";
        //        string strJPostData = JsonConvert.SerializeObject(re, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        //        UTF8Encoding encoding = new UTF8Encoding();
        //        byte[] post = encoding.GetBytes(strJPostData);
        //        req.ContentLength = post.Length;
        //        using (Stream writer = req.GetRequestStream())
        //        {
        //            writer.Write(post, 0, post.Length);
        //        }
        //        using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
        //        {
        //            DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(RequestEligibilityResponse));
        //            objResponse = jsonSerializer.ReadObject(res.GetResponseStream());

        //            var statusvalue = ((MyCortex.Home.Models.RequestEligibilityResponse)objResponse).status;
                    
        //            string facilityLicense = "MF2007";
        //            if (statusvalue == 1)
        //            {
        //                var EligibilityId = ((MyCortex.Home.Models.RequestEligibilityResponse)objResponse).data.eligibilityId;

        //                PayByController Paybycheck = new PayByController();
        //                Paybycheck.EligibilityRequestDetail_ByService(EligibilityId, facilityLicense);
        //            }
        //        }                             
        //    }
        //    catch (Exception ex)
        //    {
        //        return Request.CreateResponse(HttpStatusCode.NotAcceptable);
        //    }


        //    return null; //Request.CreateResponse(HttpStatusCode.OK, objResponse);
        //}

        [HttpPost]
        //[Authorize]
        public HttpResponseMessage CancelEligibilityEequest([FromBody] Newtonsoft.Json.Linq.JObject form)
        {
            object objResponse;
            try
            {
                string eligibilityId = Convert.ToString(form["eligibilityId"]);
                RequestCancelEligibility re = new RequestCancelEligibility();
                re.eligibilityId = eligibilityId;

                string url = "https://integration.inhealth.ae/api/eligibilitycheck/CancelEligibilityCheckRequest?eligibilityID=" + eligibilityId;
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";
                req.Accept = "*/*";
                // req.Headers["Connection"] = "keep-alive";
                // req.Headers["Accept-Encoding"] = "gzip, deflate, br";
                req.Headers["Content-Language"] = "en";
                req.Headers["Authorization"] = "c2d0928a-7463-428d-bd12-72fda8757089";
                string strJPostData = JsonConvert.SerializeObject(re, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                UTF8Encoding encoding = new UTF8Encoding();
                byte[] post = encoding.GetBytes(strJPostData);
                req.ContentLength = post.Length;
                using (Stream writer = req.GetRequestStream())
                {
                    writer.Write(post, 0, post.Length);
                }
                using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
                {
                    DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(RequestCancelEligibilityResponse));
                    objResponse = jsonSerializer.ReadObject(res.GetResponseStream());
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotAcceptable);
            }
            return Request.CreateResponse(HttpStatusCode.OK, objResponse);
        }
    }
    
}
