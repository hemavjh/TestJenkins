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

namespace MyCortex.User.Controllers
{
    public class EligibilityCheckController : ApiController
    {
        static readonly IUserRepository repository = new UserRepository();
        static readonly IPasswordPolicyRepository pwdrepository = new PasswordPolicyRepository();
        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        [HttpPost]
        //[Authorize]
        public HttpResponseMessage AddEligibilityEequest([FromBody] Newtonsoft.Json.Linq.JObject form)
        {
            object objResponse;
            try
            {
                string emiratesId = Convert.ToString(form["NATIONALITY_ID"]);
                int consultationCategoryId = Convert.ToInt32(form["ConsultationCategory"]);
                string clinicianLicense = Convert.ToString(form["Clinicianlist"]);
                string mobileNumber = Convert.ToString(form["MOBILE_NO"]);
                int payerId = Convert.ToInt32(form["PayorId"]);
                int serviceCategoryId = Convert.ToInt32(form["ServiceCategory"]);
                string countryCode = Convert.ToString(form["countrycode"]);
                string facilityLicense = Convert.ToString(form["facilityLicense"]);

                RequestEligibility re = new RequestEligibility();
                re.emiratesId = emiratesId;
                re.consultationCategoryId = consultationCategoryId;
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
