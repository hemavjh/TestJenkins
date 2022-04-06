using log4net;
using MyCortex.Admin.Models;
using MyCortex.Provider;
using MyCortex.Repositories;
using MyCortex.Repositories.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Http;
using System.Net.Http.Formatting;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;

namespace MyCortex.Admin.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class SMSConfigurationController : ApiController
    {
        static readonly ISMSConfigurationRepository repository = new SMSConfigurationRepository();
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// to Insert/Update the entered SMS Configuration Information into database of a institution
        /// </summary>
        /// <param name="model">SMS Configuration details</param>      
        /// <returns>Identity (Primary Key) value of the Inserted/Updated record</returns>
        [HttpPost]
        public HttpResponseMessage SMSConfiguration_AddEdit(SMSConfigurationModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    long Id = repository.SMSConfiguration_AddEdit(model);
                    return Request.CreateResponse(HttpStatusCode.OK, Id);
                }
                catch (Exception ex)
                {
                    _logger.Error(ex.Message, ex);
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
                }
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

        }

        /// to get SMS configuration details of a institution
        /// </summary>
        /// <param name="Institution_Id">Institution Id</param>
        /// <returns>SMS configuration details of a institution</returns>
        [HttpGet]
        public SMSConfigurationModel SMSConfiguration_View(long Institution_Id)
        {
            SMSConfigurationModel model = new SMSConfigurationModel();
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.SMSConfiguration_View(Institution_Id);
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
            }

            return model;
        }

        [HttpPost]
        public bool CheckSMSConfiguration(CheckSMSConfiguration smsModel)
        {
            try
            {
                    string
                        SMSPrefixMbNO = string.Empty, SMSSuffixMbNO = string.Empty, SMSMbNO = string.Empty, SMSSubject = string.Empty,
                        SMSBody = string.Empty, SMSURL = string.Empty, SMSApiId = string.Empty, SMSUserName = string.Empty, SMSSource = string.Empty;
                    string MobileNo = smsModel.MobileNo.Replace(@"~", @"").Replace(@"+", @"");

                    SMSMbNO = MobileNo;
                    SMSSubject = smsModel.Subject;
                    SMSBody = smsModel.Body;
                    SMSApiId = "Kv2n09u8";
                    SMSUserName = "MyHealth";
                    SMSSource = "OILHDK";

                    SMSURL = "https://txt.speroinfotech.ae/API/SendSMS?" + "username=" + SMSUserName + "&apiId=" + SMSApiId + "&json=True&destination=" + SMSMbNO + "&source=" + SMSSource + "&text=" + SMSBody;

                    HttpClient client = new HttpClient();
                    client.BaseAddress = new Uri(SMSURL);

                    // Add an Accept header for JSON format.
                    client.DefaultRequestHeaders.Accept.Add(
                    new MediaTypeWithQualityHeaderValue("application/json"));

                    // List data response.
                    HttpResponseMessage smsResponse = client.GetAsync(SMSURL).Result;
                    // Blocking call! Program will wait here until a response is received or a timeout occurs.
                    if (smsResponse.IsSuccessStatusCode)
                    {
                    // Parse the response body.
                    //var dataObjects = smsResponse.Content.ReadAsAsync<IEnumerable<DataObject>>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
                    var dataObj = smsResponse.Content.ReadAsStringAsync().Result.ToString();
                        //foreach (var d in dataObjects)
                        //{
                        //    Console.WriteLine("{0}", d.Name);
                        //}
                        //sendemailrepository.SendEmail_Update(EntityId, "", 1, "");
                        //sendemailrepository.SendEmail_Update(sendEmailModel[0].Id, "", 1, "");
                    }
                    else
                    {
                        Console.WriteLine("{0} ({1})", (int)smsResponse.StatusCode, smsResponse.ReasonPhrase);
                        //sendemailrepository.SendEmail_Update(EntityId, smsResponse.ReasonPhrase, 2, "");
                        //sendemailrepository.SendEmail_Update(sendEmailModel[0].Id, smsResponse.ReasonPhrase, 2, "");
                    }
                    //Make any other calls using HttpClient here.
                    //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                    client.Dispose();
                    return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
