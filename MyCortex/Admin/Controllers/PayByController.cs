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

namespace MyCortex.Admin.Controllers
{
    [Authorize]
    [CheckSessionOutFilter]
    public class PayByController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Token(double amount, string iapDeviceId = "", string appId = "")
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

            string privateKey = @"-----BEGIN RSA PRIVATE KEY-----
                                MIIEowIBAAKCAQEAwLU/OfsdLuZlohfGcnmXXfJWAwY3LAYOZ+c9rQG1/AvLTPyo
                                m3++IoCL0p5Ur6xNaU27dOjPJD2w+lZ2P5PljwDQtz7yyreF38c+yJ9usS84QWvx
                                s6MKw6GoafqKYuczLnwD1f0Cw0oHX2A4Ab8ymx9jXwWG5eKSrxe6F1azLVfI0Sdp
                                AOf4eWgIQO3isZJbyBfxKy36mOMrxO7amCBQ7aAd8Sfa+LIZCakiQdja9EYX9a8H
                                0CLKwXBxpwUg/X0LuuhyAvGt0MDvlXugJtYGeoNtZh1+w/riCImdWTwNlamjxXuW
                                WnmrC4Frn/tzrW5YfhJoQijEF3AC88KDpD3ESwIDAQABAoIBABn5E8F7z+4fTXlw
                                XOXW74jQ/bjAoLUFR/HHH+/ueBm1eTwyHYN/zx+VVcMYZe+beH+F44sZSbnnuq+y
                                8ZMWGu2QPZFFIbIi1B9aGmMt4dxtsdZXdycwBWZipnFKPFaiNKrCOj4gMLwjgSTg
                                sgvCOk7gByOqegkH5Z9FwmYc4F9u5lrI4onvJkw7Wy8lsatronsAbXagpl3neuk6
                                qp4ieuivv6IX5z76q0gLWiC+jtumM1I+YOXPY6y0IDooXkWuK3ytTs3wACBzZi2+
                                yIJH6yJ4d2upaZLJHHiaeRNAuNtKtyUihkfsisPTcS5TpDpj//8B5iop6K5rcpWV
                                fGUdkaECgYEA8ypOiVtgknRioRjcYQFXX0+nnrnA5XLj3cmE/tIPe151mKALsMEy
                                +3Kc/lcqCMQs/gpBqWwU4/zQflTXDJV7IukhG8dyXQfr9Fynz6RfWv8auE76P9Re
                                l/FmTCYPzSQgTMZh9RQOvLQFENGUX2pdR5goSLcOlvCFXwfQpWvhPBECgYEAyuEn
                                B4CdVNJ1B8pX6OQKtGb3E28iGxLfmnl/mX9CZH6n+b42abhiCfLJaxC3eCJUbcCZ
                                pkLj687rVdLJLhyy5ihTVgW9rvayEYi7hR//oLfoDvXmYFjEZLRPaJFItYgClruU
                                w26fBWajMNFVwrvqer2wtFYXdN+d1lmNtMIWBpsCgYBLpnzahOAtkCHjJp3hXA53
                                q4tleTrG55B2vqwuruF8Ky4AtsIMUn7u9YBcLHf6VDX/Luewstxo9Y1T0Ec7NgIi
                                IU9Ymhs9UCqbUnwuwF+eKsGAV6nJU+O9968wv6Ko2rVlzU5KddwD3ym4SsuTR78P
                                eAoIXVMfqGKF5yOFY2OmUQKBgQCdE4e5Wk3132A24OYBbZYQKOxBQrkgRxOSsWEm
                                wg3watO5HBla7yQQ2cYyu+WhAMtnkkgkHwQCjdlNQH780cF9S1mCb7112pDx3HB7
                                WNP9ZoYoFyEAFZow8h3NMzcdPanrdF5wlZRPhTDyWhFRTVb1IyrN5R4SIhQ9YmbB
                                vcd54wKBgEyb+rltiBXlSlHHV9wfIrhQvh3ewINF6nrQANFhd09was4wk7X5oXhU
                                j1cyg6cJUsE1LcGSUdTRt1eBYhypxSIFOdi0g/rDrEFpaQzF7BjWhICdY1ibuH8m
                                sXzFI9qNjHKC9G4Tlyqq93ju+3lDcNitej8mMNtlvGvNDRd5dUJF
                                -----END RSA PRIVATE KEY-----";

            string publicKey = @"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoEJwfig+cc1tDspuy1KlfSJabiZBechcDX9+iqBy8WjMHN+Y7XxIF9xaxBmcts65gh4Dle0mhcDR8j8pX1mDLyjzGhLFizyevqNIlC84TRLpzUden0pp59S35dP5TmrgCpM/M6LMaxy1CgBT2RTJKIGaaC9ac7of+QRAiyhdMftO1wIaaf4jno3P2EdVBLzup5ZyC3wq+CNe/D9SHS7bZRg7WXul2of4YeELToXvXx3pbWffhd8uLveJiLZxwvsE0o4Rf+1uOi79x63LzEuDQtgrVMQ2ayM3+QSLVyOneTZlUYju8i1SMxA7PlfQC/AFnR8Z6UHdmQ5vGwVt+UvgwIDAQAB";

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
                    amount = amount
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
                req.Headers["Partner-Id"] = "200000042613";

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
