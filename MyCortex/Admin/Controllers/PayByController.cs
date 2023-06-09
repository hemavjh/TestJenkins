﻿using MyCortex.Admin.Models;
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
using MyCortex.User.Model;
using System.Text;
using System.Runtime.Serialization.Json;
using MyCortex.Repositories.Masters;
using MyCortex.Repositories.Uesr;
using MyCortex.Home.Models;
using System.Web.Script.Serialization;
using System.Web.Http.Results;

namespace MyCortex.Admin.Controllers
{

    public class PayByController : ApiController
    {
        static readonly IGatewaySettingsRepository gatewayrepository = new GatewaySettingsRepository();
        static readonly IPatientAppointmentsRepository patientAppointmentsRepository = new PatientAppointmentRepository();
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
        _AppLogger = string.Empty, _AppMethod = string.Empty;

        IList<GatewaySettingsModel> gatewayModel;
        [HttpGet]
        [Authorize]
        [CheckSessionOutFilter]
        public HttpResponseMessage Token(double amount, string iapDeviceId = "", string appId = "", long Institution_Id = 0, long Department_Id = 0, long Appointment_Id = 0)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            string token = string.Empty;
            string payBySign = string.Empty;

            string payCode = "PAYPAGE";

            string merchantOrderNumber = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10);
            int retid = patientAppointmentsRepository.PaymentStatus_Update(Appointment_Id, "Payment Initiated", merchantOrderNumber);
            //string baseUrl = HttpContext.Current.Request.Url.Authority;
            //retid = patientAppointmentsRepository.PaymentProvider_Notity_Log(baseUrl);
            string baseUrl = HttpContext.Current.Request.Url.Host.ToString();
            retid = patientAppointmentsRepository.PaymentProvider_Notity_Log(baseUrl + " --  domain test");
            PaySceneParams paySceneParams = new PaySceneParams
            {
                redirectUrl = "https://" + baseUrl + "/Home/Index#/PatientVitals/0/1?orderId=414768633924763654"
            };

            if (!string.IsNullOrEmpty(iapDeviceId) && !string.IsNullOrEmpty(appId))
            {
                payCode = "INAPP";
                paySceneParams = new PaySceneParams
                {
                    iapDeviceId = iapDeviceId,
                    appId = appId
                };
            }
            string privateKey = string.Empty;
            string publicKey = string.Empty;
            string partnetId = string.Empty;
            string PaybyUrl = string.Empty;
            double amount2 = Convert.ToDouble(gatewayrepository.PatientAmount(Institution_Id, Department_Id, Appointment_Id));
            gatewayModel = gatewayrepository.GatewaySettings_Details(Institution_Id, 2, "RSAPrivateKey");
            if (gatewayModel.Count > 0)
            {
                privateKey = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(Institution_Id, 2, "PublicKey");
            if (gatewayModel.Count > 0)
            {
                publicKey = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(Institution_Id, 2, "PartnerId");
            if (gatewayModel.Count > 0)
            {
                partnetId = gatewayModel[0].GatewayValue;
            }
            gatewayModel = gatewayrepository.GatewaySettings_Details(Institution_Id, 2, "Gateway Url");
            if (gatewayModel.Count > 0)
            {
                PaybyUrl = gatewayModel[0].GatewayValue;
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
                    amount = amount2
                },
                paySceneCode = payCode,
                paySceneParams = paySceneParams,
                notifyUrl = "https://" + baseUrl + "/Home/Notify/"
            };
            DateTime unixRef = new DateTime(1970, 1, 1, 0, 0, 0);

            payByCreateReq.requestTime = (DateTime.UtcNow.Ticks - unixRef.Ticks) / 10000;
            payByCreateReq.bizContent = bizContent;
            try
            {
                string url = PaybyUrl;
                    //"https://uat.test2pay.com/sgs/api/acquire2/placeOrder";
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
                    if (tokenRes != null)
                    {
                        if (tokenRes.head != null && tokenRes.head.code == "0")
                        {
                            if (tokenRes.body != null && tokenRes.body.interActionParams != null && !string.IsNullOrEmpty(tokenRes.body.interActionParams.tokenUrl))
                            {
                                token = tokenRes.body.interActionParams.tokenUrl;
                                if (!string.IsNullOrEmpty(iapDeviceId) && !string.IsNullOrEmpty(appId))
                                {
                                    string signString = string.Format("iapAppId={0}&iapDeviceId={1}&iapPartnerId={2}&token={3}", appId, iapDeviceId, partnetId, token);
                                    payBySign = rsaHelper.Sign(signString, privateKey);
                                }
                            }
                        }
                        else
                        {
                            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, tokenRes.head.msg);
                        }
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
                                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, text);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Token = token, Sign = payBySign });
        }

        //[HttpPost]
        //public HttpResponseMessage Notify()
        //{
        //    Request.Content.ReadAsStringAsync;
        //    string status = "OK";
        //    return Request.CreateResponse(HttpStatusCode.OK, status);
        //}

        [HttpPost]
        public HttpResponseMessage RefundNotify(long id, string merchantorderno, [FromBody] Newtonsoft.Json.Linq.JObject refund)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                int retid = 0;
                string json = refund.ToString();
                retid = patientAppointmentsRepository.PaymentProvider_Notity_Log(json);
                dynamic data = JsonConvert.DeserializeObject(json);
                string status = Newtonsoft.Json.Linq.JObject.FromObject(refund)["refundOrder"]["status"].ToString();
                if (status == "REFUNDED_SETTLED")
                {
                    long refundAppointmentId = id;
                    string refundMerchantOrderNo = merchantorderno;
                    retid = patientAppointmentsRepository.PaymentStatus_Update(refundAppointmentId, "Refund Settled", refundMerchantOrderNo);
                }
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Error");
            }
        }

        [HttpPost]
        public HttpResponseMessage RefundPayByCheckoutSession([FromBody] Newtonsoft.Json.Linq.JObject form)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            string redirectUrl = string.Empty;
            string privateKey = string.Empty;
            string publicKey = string.Empty;
            string partnetId = string.Empty;
            string PaybyUrl = string.Empty;
            //string baseUrl = HttpContext.Request.Url.Authority;
            try
            {
                //redirectUrl = "https://mycortexdev1.vjhsoftware.in/Home/Index#/PatientVitals/0/1";
                long refundAppointmentId = Convert.ToInt64(Newtonsoft.Json.Linq.JObject.FromObject(form)["refundAppointmentId"].ToString());
                string refundMerchantOrderNo = Convert.ToString(Newtonsoft.Json.Linq.JObject.FromObject(form)["refundMerchantOrderNo"].ToString());
                double refundAmount = Convert.ToInt64(Newtonsoft.Json.Linq.JObject.FromObject(form)["refundAmount"].ToString());
                string refundOrderNo = Convert.ToString(Newtonsoft.Json.Linq.JObject.FromObject(form)["refundOrderNo"].ToString());
                long refundInstitutionId = Convert.ToInt64(Newtonsoft.Json.Linq.JObject.FromObject(form)["refundInstitutionId"].ToString());
                //double amount2 = Convert.ToDouble(gatewayrepository.PatientAmount(PInstitutionId, departmentId));
                string merchantOrderNumber = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10);
                int retid = patientAppointmentsRepository.PaymentStatus_Update(refundAppointmentId, "Refund Initiated", refundMerchantOrderNo);
                string baseUrl = HttpContext.Current.Request.Url.Host.ToString();
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
                gatewayModel = gatewayrepository.GatewaySettings_Details(refundInstitutionId, 2, "Gateway Url");
                if (gatewayModel.Count > 0)
                {
                    PaybyUrl = gatewayModel[0].GatewayValue;
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
                    notifyUrl = "https://" + baseUrl + "/api/PayBy/RefundNotify?id=" + refundAppointmentId + "&merchantorderno=" + refundMerchantOrderNo + "",
                };
                DateTime unixRef = new DateTime(1970, 1, 1, 0, 0, 0);
                payByCreateReq.requestTime = (DateTime.UtcNow.Ticks - unixRef.Ticks) / 10000;
                payByCreateReq.bizContent = bizContent;
                try
                {
                    string url = PaybyUrl;
                        //"https://uat.test2pay.com/sgs/api/acquire2/refund/placeOrder";
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
                return Request.CreateResponse(HttpStatusCode.OK, new { status = 1 });
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateResponse(HttpStatusCode.OK, new { status = 0 });
            }
        }

        [HttpPost]
        public HttpResponseMessage CreatePayByCheckoutSession([FromBody] Newtonsoft.Json.Linq.JObject form)
        {
            string redirectUrl = string.Empty;
            try
            {
                _AppLogger = this.GetType().FullName;
                _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                string privateKey = string.Empty;
                string publicKey = string.Empty;
                string partnetId = string.Empty;
                string PaybyUrl = string.Empty;

                //string baseUrl = HttpContext.Request.Url.Authority;
                long appointmentId = Convert.ToInt64(form["paymentAppointmentId"]);
                long departmentId = Convert.ToInt64(form["paymentdepartmentId"]);
                long PInstitutionId = Convert.ToInt64(form["paymentInstitutionId"]);
                string redirectParam = Convert.ToString(form["RedirectParam"]);
                double amount2 = Convert.ToDouble(gatewayrepository.PatientAmount(PInstitutionId, departmentId, appointmentId));
                string merchantOrderNumber = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10);
                int retid = patientAppointmentsRepository.PaymentStatus_Update(appointmentId, "Payment Initiated", merchantOrderNumber);
                string baseUrl = HttpContext.Current.Request.Url.Host.ToString();
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
                gatewayModel = gatewayrepository.GatewaySettings_Details(PInstitutionId, 2, "Gateway Url");
                if (gatewayModel.Count > 0)
                {
                    PaybyUrl = gatewayModel[0].GatewayValue;
                }
                privateKey = privateKey.Replace("-----BEGIN RSA PRIVATE KEY-----", "")
                    .Replace("-----END RSA PRIVATE KEY-----", "");

                RsaHelper rsaHelper = new RsaHelper();
                //Console.OutputEncoding = System.Text.Encoding.Default;
                string json = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority);
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
                        redirectUrl = "https://" + baseUrl + "/Home/Index#/PatientVitals/" + redirectParam //+"0/1?orderId=414768633924763654"
                    },
                    notifyUrl = "https://" + baseUrl + "/Home/Notify/",
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

                string url = PaybyUrl; 
                 //"https://uat.test2pay.com/sgs/api/acquire2/placeOrder";
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
                    if (tokenRes != null && tokenRes.body != null && tokenRes.body.interActionParams != null && !string.IsNullOrEmpty(tokenRes.body.interActionParams.tokenUrl))
                    {
                        _MyLogger.Exceptions("INFO", _AppLogger, tokenRes.body.interActionParams.tokenUrl, null, _AppMethod);
                        redirectUrl = tokenRes.body.interActionParams.tokenUrl;
                    }
                    else
                    {
                        _MyLogger.Exceptions("INFO", _AppLogger, "", null, _AppMethod);
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
                return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, error = ex.Message });
            }
            _MyLogger.Exceptions("Warn", _AppLogger, redirectUrl, null, _AppMethod);
            if (redirectUrl != String.Empty)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { status = 1, url = redirectUrl });
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { status = 0, error = "Payby Configuration Error" });
            }

        }

        [HttpPost]
        public HttpResponseMessage EligibilityRequestCall([FromBody] Newtonsoft.Json.Linq.JObject form)
        {
            object objResponse;
            try
            {
                RequestEligibility re = new RequestEligibility
                {
                    emiratesId = "784199765832854",
                    clinicianLicense = "GN30148",
                    consultationCategoryId = 4,
                    countryCode = "+971",
                    mobileNumber = "566767676",
                    payerId = 305,
                    referralLetterRefNo = "",
                    serviceCategoryId = 12,
                    facilityLicense = "MF2007",
                };

                string url = "https://integration.inhealth.ae/api/eligibilitycheck/addeligibilityrequest";
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json";
                req.Accept = "*/*";
                //req.Headers["Connection"] = "keep-alive";
                //req.Headers["Accept-Encoding"] = "gzip, deflate, br";
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

        [HttpGet]
        //[Authorize]
        public HttpResponseMessage EligibilityRequestDetail(long eligibilityID, string facilityLicense)
        {
            object objResponse;
            string url = "https://integration.inhealth.ae/api/eligibilitycheck/GetEligibilityRequestDetailsByEligibilityId?eligibilityID=" + eligibilityID + "&facilityLicense=" + facilityLicense;
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = "GET";
            req.ContentType = "application/json";
            req.Accept = "*/*";
            //req.Headers["Connection"] = "keep-alive";
            //req.Headers["Accept-Encoding"] = "gzip, deflate, br";
            req.Headers["Content-Language"] = "en";
            req.Headers["Authorization"] = "c2d0928a-7463-428d-bd12-72fda8757089";

            using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
            {
                DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(RequestEligibilityDetailResponse));
                objResponse = jsonSerializer.ReadObject(res.GetResponseStream());
            }
            return Request.CreateResponse(HttpStatusCode.OK, objResponse);

        }
        //[HttpGet]
        //[Authorize]
        //public HttpResponseMessage EligibilityRequestDetail_ByService(long eligibilityID, string facilityLicense)
        //{
        //    object objResponse;
        //    string url = "https://integration.inhealth.ae/api/eligibilitycheck/GetEligibilityRequestDetailsByEligibilityId?eligibilityID=" + eligibilityID + "&facilityLicense=" + facilityLicense;
        //    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
        //    req.Method = "GET";
        //    req.ContentType = "application/json";
        //    req.Accept = "*/*";
        //    //req.Headers["Connection"] = "keep-alive";
        //    //req.Headers["Accept-Encoding"] = "gzip, deflate, br";
        //    req.Headers["Content-Language"] = "en";
        //    req.Headers["Authorization"] = "c2d0928a-7463-428d-bd12-72fda8757089";

        //    using (HttpWebResponse res = (HttpWebResponse)req.GetResponse())
        //    {
        //        DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(RequestEligibilityDetailResponse));
        //        objResponse = jsonSerializer.ReadObject(res.GetResponseStream());

        //        var DataVal = ((MyCortex.Home.Models.RequestEligibilityResponse)objResponse).data;
        //        //var EligibilityId = ((MyCortex.Home.Models.RequestEligibilityResponse)objResponse).data.eligibilityCheck.result;
        //        if (objResponse != null)
        //        {

        //            if (DataVal != null)
        //            {
        //                //    result = DataVal.eligibilityCheck.result;
        //                //    $scope.result = response_data.data.eligibilityCheck.result;
        //                //    $scope.eligibility_response = response_data.data;
        //                //    $scope.save_user_appointment_eligibility_logs($scope.Appointment_Id, $scope.user_id, $scope.eligibility_Id, $scope.eligibility_response, $scope.eligibility_response);
        //            }
        //            else
        //               {
        //                //    toastr.warning("Request for eligibility failed, appointment could not be created...", "warning");
        //                //    $scope.cancel_eligibility($scope.eligibility_Id);
        //            }
        //        }
        //    }
        //    return null; //Request.CreateResponse(HttpStatusCode.OK, objResponse);

        //}
    }
}
