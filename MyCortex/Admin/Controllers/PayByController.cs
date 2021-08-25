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
MIIEowIBAAKCAQEAw9tNs+wAAOA3ccfYKRN3ywGiWBBa0LYpaQqqloPsqEkrkB5h
56eZpH0i8JUWS7d2Eq77FdnaKL0zhax13sPikLA9+aYJgD6iutJ5lRdPq8if8FY9
EryEy1bBfP8b5xVpPAwmy3qsc6xQ081ey1/Xczv50d/yMONrI2FrMEG6ivRSI41r
QnlARJPn5Aij3kodahowxMVypNZ9jEDm3TuvWEpzu0MoMtEKCA73VBZs7xGHiCGW
d8xbDOzA/hlIj+dkVubsd8k0A3AapgkR+tHfP5tnyjqJBT0oxjEN816lYnySkA4x
58IQobhAXQKMUTsA5L/s/XhP5Oin0aKNMWkMoQIDAQABAoIBAFbMNd9q04WP2IKA
QnfRvOEm1D+a3+RnFmsK4xbZWGQsKTYxgModKKYRHw7nw33CzHzzNysz5M7xKogv
Kf2TajEdKhodT1CacZvB80fzkMdcniTw0xgem+tRg2ZV2JPMlVqbOAYtU4ff8eIr
vbr7uovDJK+yQ68O2khPwCUevAEgBz97On2WBDX2CojKDErKFNw5vl1MDjq0raaO
H/GtD1SlYTLExl9KoKScDGUmFYPFpEb7OAOwgLqrUWgYU7GFKJ08jRXKYR2MmQaH
CQUjvNoAg64ucExYul1irFLFvDWES+cVcKIde15A/h3li1n1A2kGE6b1bxKJgv/n
Eivp1AECgYEA5+B6JcZq3NcMhPDiwzGM6x7rHTTCdj3CUOaZ1+NtVAwRnFZmUrFy
h6T+z1IV3dUf0thwuENj0L2vr6ghoWMBsXraDv3CBX8CdNfmCuqKdbX90BZIAAX2
4Y5Nmkl4sPZjdxLgZFuKcHUc/imqeDyH1Rf+99vEbuasA2PUwWt+HhECgYEA2DuC
LA6mVF+VIeA+wmrAp5uwBe01nnQ9Ptir1NbJhH96r1dFd150wckXINcSn02aVsGt
I72ooi+KzvPMCsuCpLNRfWGQhEw/wX1T3MD6yBTDKVxHuqZG9Z2GW9E6DSTW6vId
Mw5d79JhijRwpDcbe+uyNtdfI4XmbP4gj5A4tZECgYBtBQjJC/IgZOeY9ZzYQ0rL
HR1T/QNVDpJ28QTyERbNBmOdSq4PQSjlB7laBnELfHHa8zKEIAMlGJoqj3VIaMFa
DbXKiJqZdO7VutCI3188GtX76Q3vHN7Hi92Gpfad1SpMyM5BwRxk5Vs9UJ+6qlL+
6KpTJLvFnKTRbzWPvxdr0QKBgQCg8BnAxN6TadjLr+XGOkJN/ZiTsKv51bZH8mhi
L8MpNOCRZLk1UT5BhXQLY0he/RlkfR5qvZynqg78XYR+fF4uS7DZSyaO8Vl6n9ct
NQzyolFnlWFl0KB76tS3vhAg/Exh7fZBq+3Ks6EZhlJYRxPTteec3cvX2q9YbAS8
FbG/oQKBgHRg9OnOPlSq8MJPo/Oow2y3iEmLiiRN2ZLaL8vvwoivqYaa9wnqyOnY
6a0yKEmZAVu0gMptIzTIoXF2+gPQifvSGT9tki2uL9lLNUYSrARTbMv0pZwkggmj
uznxpDsT4n01E7Sg2qRZTSSABhoAYy4K2RaaBgQMxYBiFkfLqrNp
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
