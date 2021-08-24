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
MIIEogIBAAKCAQEAgjba3T3Bnff/wqvaYvsm8bQRSgC0HgvkGgh/1QUE2Se62OHi
tXfHTxPf/076O0S96hWq1CMI9xm91KmggnQSp0RFCwbPpJnm79HmsO5cx1V8B7EN
OrYVYNFHPuXvCaQiFSCA9TbCwpOaO2lfugqaJC6scnwhGXQUNHeBfuK5yh9kIza1
rjeRVsEco8oSwnyWvaSNmpZ7JfPx/BIseb+5Qiwn4VBnFpS3nDVvrBqsHXFQCvu8
F11eJSH13KKgwtA4ftBBIkH7KWGrbx0ZRWKqQ3U34roq93dJU8huSVc7JKzxLZ/9
avrDF6Jj/pB0lYw3bn7Ep/w0A0t17UBoxsNBmwIDAQABAoIBAHeLct2g38tuLiGD
8qfimbtXLHQ7NyFKm2yHFwzzYaMXxYNtxdwCDjn8Li5PTI3zK0PoBoBhdc6dlFjU
Lib191YW6CgaZbFhFdJgayFOhGEAizDojBO1rOTI3VbSc+TvCddJkvsM/jrylasr
r5W2PBMxwmIMsbqThiUw/fMGpbj4PTvUWNhCrzi+nohXOpf0AqICy+N98gCKSS5W
Uae8HVGB+tpmRtIgYEbjYuyQgSSNcQFfD8mz9FG1SbKXwYNkrVSz1b4ZzPnlAxsg
XZs5DlWs9VLaH6NI/XlgjrIpUIJgTyN/7P470vu+QWLqxO6TymJkZ42qyQ4cjyYR
q6kaK9kCgYEA/cW0GcJXplClHCSHQwtzm7SusgFrZVEQji4HOgCD0Lqk2vuKK8/G
N/queYtDYWDOGcn6y7QXjQu7pPkhGAdMRaoFYnqya2Tu2zMs5bnod7xfZGwhJjAR
Pn1RVOfGe4qAMoso0bnq9iFl/xmqSjuIoZ2RrlJU78ezYfXDXibLIZcCgYEAg1t7
gCoiHefNjfhd90i40TXB8fOx1EaEL2MUH/YvuOcLNg5ZCOkX4lD0fFR0VaEEWfg+
8rmE4+TrB90YpvmiklsQxB8pXVlYmovSEvaQbkMlsTikLmXZjr1wL0tuiWwxlIix
mrU06h88AIsax/7hkFXK23+iYQEc9qtr5U1ymJ0CgYAcvU0eNbIzdaKdQ03GO//F
vHqkUiDVgo67a18KJJDJDLoqyp3lREyQfmVQAoOI/auZpBQxCZ45LQD9N/GVhQ4Q
PacKdhbKrs2WKX+GLL21AbJT7yL57iulxg917CHAT/kgwD3JMqL3aOTiNQfiDEf2
9Z9P/Kb92MHp8ClF+mK61QKBgB9T3Bpu8gAL3pwzVcW6FEng9kZMBmdIAhKDILOW
tT7161iTB2z2mnmhMQ3N3ojlg/IpIGonEKiBWgRgGJcKBlm9WjxL6kOXIWiKXCml
oECLxxuDFLT0GXTPfUfqR4yCvzhbeXAaM2p61IaUpmh4Qzd3HpBG2mUkLNIvg+YG
GISJAoGAXhZZWiNDcbYPuzGhlBdnKkzfYfq3X2flSo43BCrjDWEZavnfGfm2Hiih
UB4cPTTtPFjI2towIumfOmri6MHw11lw1BAY08O0EE4EdULErdNq8v5OWxRYhL5H
D2QRcfFsj1g76l8D1nkUGduatiHZ3QtDKs7IfRdsxffuqJRiuv0=
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
