using MyCortex.Admin.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using log4net;
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

namespace MyCortex.Admin.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class PayByController : ApiController
    {
        static readonly IGatewaySettingsRepository gatewayrepository = new GatewaySettingsRepository();
        IList<GatewaySettingsModel> gatewayModel;
        [HttpGet]
        public HttpResponseMessage Token(double amount, string iapDeviceId = "", string appId = "", string Institution_Id = "", string Department_Id = "")
        {
            string token = string.Empty;
            
            string payCode = "PAYPAGE";
            
            PaySceneParams paySceneParams = new PaySceneParams
            {
                redirectUrl = "https://mycortexdev.vjhsoftware.in/Home/Index#/PatientVitals/0/1?orderId=414768633924763654"
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
            double amount2 = Convert.ToInt64(gatewayrepository.PatientAmount(Convert.ToInt64(Institution_Id), Convert.ToInt64(Department_Id)));
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
                merchantOrderNo = Guid.NewGuid().ToString().Replace("-", "").PadLeft(10),
                subject = "TeleConsultation",
                totalAmount = new TotalAmount
                {
                    currency = "AED",
                    amount = amount2
                },
                paySceneCode = payCode,
                paySceneParams = paySceneParams,
                notifyUrl = "https://mycortexdev.vjhsoftware.in"
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
                    if (tokenRes != null)
                    {
                        if (tokenRes.head != null && tokenRes.head.code == "0")
                        {
                            if (tokenRes.body != null && tokenRes.body.interActionParams != null && !string.IsNullOrEmpty(tokenRes.body.interActionParams.tokenUrl))
                            {
                                token = tokenRes.body.interActionParams.tokenUrl;
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
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            return Request.CreateResponse(HttpStatusCode.OK, new { Token = token });
        }
    }
}
