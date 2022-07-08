  
using MyCortex.Template.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.Template;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using MyCortex.Repositories.Uesr;
using MyCortex.User.Model;
using MyCortex.Admin.Models;
using MyCortex.Email.SendGrid;
using SendGrid.Helpers.Mail;
using MyCortex.Repositories.Admin;
using MyCortex.Utilities;
using MyCortex.Notification.Firebase;
using MyCortex.Notification.Model;
using MyCortex.Notification.Models;
using MyCortex.Provider;
using System.Net.Http.Headers;
using System.Security.Cryptography.Xml;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace MyCortex.Template.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class SendEmailController : ApiController
    {
        static readonly ISendEmailRepository repository = new SendEmailRepository();

        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
        static readonly IUserRepository userrepository = new UserRepository();

 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        /// <summary>
        /// Email User Type name List
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<SendEmail_UsertypeModal> Email_UserTypeList()
        {
            IEnumerable<SendEmail_UsertypeModal> model;
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Email_UserTypeList();
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }   
        }

        /// <summary>
        /// Email Teplate List
        /// </summary>
        /// <param name="InstitutionId">Institution Id</param>
        /// <param name="TemplateType_Id">TemplateType Id</param>
        /// <returns></returns>
        [HttpGet]
        public IList<SendEmailTemplateModel> Email_TemplateTypeList(long InstitutionId, long TemplateType_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<SendEmailTemplateModel> model;
            try
            {
                   _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Email_TemplateTypeList(InstitutionId, TemplateType_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// user list to send mail for the selected filter
        /// </summary>
        /// <param name="UserTypeId"></param>
        /// <param name="Institution_Id"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <returns></returns>
        public IList<SendEmailModel> Get_SendEmail_UserList(string UserTypeId, long Institution_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<SendEmailModel> model;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                model = repository.Get_SendEmail_UserList(UserTypeId, Institution_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to insert/update a Email sent
        /// </summary>
        /// <param name="Emailobj">email details model</param>
        /// <returns>inserted/updated Email sent</returns>
        [HttpPost]
        public HttpResponseMessage SendEmail_AddEdit([FromBody]List<SendEmailModel> Emailobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<SendEmailModel> ModelData = new List<SendEmailModel>();
            SendEmailReturnModels model = new SendEmailReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.SendEmail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                long Institution_Id;
                /*var request = HttpContext.Current.Request.Url.Authority;
                UserModel Ins_model = new UserModel();
                Ins_model = userrepository.GetInstitutionForWebURL(request);
                Institution_Id  = (long)Ins_model.INSTITUTION_ID;*/
                Institution_Id = long.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
                EmailConfigurationModel emailModel = new EmailConfigurationModel();
                emailModel = emailrepository.EmailConfiguration_View(Institution_Id);

                foreach (SendEmailModel itemData in Emailobj)
                {

                    SendEmailModel model1 = new SendEmailModel();
                    model1 = repository.GenerateTemplate(itemData.UserId, itemData.Template_Id, itemData.Institution_Id, itemData.TemplateType_Id);
                    itemData.Email_Subject = model1.Email_Subject;
                    itemData.Email_Body = model1.Email_Body;
                    ModelData = repository.SendEmail_AddEdit(itemData);

                    if (itemData.TemplateType_Id == 1)
                    {
                        if (emailModel != null)
                        {
                            /*SendGridMessage msg = SendGridApiManager.ComposeSendGridMessage(emailModel.UserName, emailModel.Sender_Email_Id, itemData.Email_Subject, itemData.Email_Body, itemData.UserName, EncryptPassword.Decrypt(ModelData[0].EmailId));

                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendEmailAsync(msg, ModelData[0].Id);*/
                            AlertEventModel alert = new AlertEventModel();
                            alert.Template_Id = itemData.Template_Id;
                            alert.TempBody = itemData.Email_Body;
                            alert.TempSubject = itemData.Email_Subject;

                            List<EmailListModel> elList = new List<EmailListModel>();
                            EmailListModel el = new EmailListModel();
                            el.UserName = itemData.UserName;
                            el.EmailId = ModelData[0].EmailId;
                            el.EmailType_Flag = 1;
                            elList.Add(el);

                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendComposedSMTPEmail(emailModel, alert, elList, ModelData[0].Id, "", 0);

                        }
                    }
                    else if (itemData.TemplateType_Id == 3) {
                        if (itemData.MobileNO != null || itemData.MobileNO != string.Empty) {

                            string[] EncryptMbNO; string[] SMSSplMbNo;
                            string
                                SMSPrefixMbNO = string.Empty, SMSSuffixMbNO = string.Empty, SMSMbNO = string.Empty, SMSSubject = string.Empty,
                                SMSBody = string.Empty, SMSURL = string.Empty, SMSApiId = string.Empty, SMSUserName = string.Empty, SMSSource = string.Empty;
                            bool containsTildeSpecialCharacter, containsPlusSpecialCharacter = false;
                            Regex rgx = new Regex("[^A-Za-z0-9]");
                            
                            containsTildeSpecialCharacter = rgx.IsMatch(itemData.MobileNO);
                            EncryptMbNO = itemData.MobileNO.Split('~');

                            if (containsTildeSpecialCharacter)
                            {
                                SMSPrefixMbNO = EncryptMbNO[0];
                                SMSSuffixMbNO = EncryptMbNO[1];
                                SMSMbNO = SMSPrefixMbNO + SMSSuffixMbNO;
                                containsPlusSpecialCharacter = rgx.IsMatch(SMSPrefixMbNO);
                            }
                            if (containsPlusSpecialCharacter)
                            {
                                SMSSplMbNo = SMSPrefixMbNO.Split('+');
                                SMSMbNO = SMSSplMbNo[1] + SMSSuffixMbNO;
                            }
                            else
                            {
                                SMSMbNO = EncryptMbNO[0];
                            }
                            SMSSubject = model1.Email_Subject;
                            SMSBody = model1.Email_Body;
                            //SMSApiId = "Kv2n09u8";
                            //SMSUserName = "MyHealth";
                            //SMSSource = "OILHDK";
                            SMSApiId = itemData.SMSApiId;
                            SMSUserName = itemData.SMSUserName;
                            SMSSource = itemData.SMSSource_Id;

                            SMSBody = SMSBody.Replace("<br>", "");
                            SMSBody = SMSBody.Replace("<br /> ", "");
                            SMSBody = SMSBody.Replace("<p>", "");
                            SMSBody = SMSBody.Replace("</p> ", "\n<p ");
                            SMSBody = SMSBody.Replace("&nbsp;", " ");
                            SMSBody = SMSBody.Replace("\n", " ");
                            //string[] OldWords = {"&nbsp;", "&amp;", "&quot;", "&lt;","&gt;", "&reg;", "&copy;", "&bull;", "&trade;","&#39;"};
                            //string[] NewWords = { " ", "&", "\"", "<", ">", "Â®", "Â©", "â€¢", "â„¢", "\'" };
                            //for (int i = 0; i < OldWords.Length; i++)
                            //{
                            //    SMSBody.Replace(OldWords[i], NewWords[i]);
                            //}
                            // Finally, remove all HTML tags and return plain text
                            //return 
                            var TextPlan = "";
                            TextPlan = System.Text.RegularExpressions.Regex.Replace(SMSBody.ToString(), "<[^>]*>", "");

                            SMSURL = "https://txt.speroinfotech.ae/API/SendSMS?" + "username=" + SMSUserName + "&apiId=" + SMSApiId + "&json=True&destination=" + SMSMbNO + "&source=" + SMSSource + "&text=" + TextPlan;
                            
                            HttpClient client = new HttpClient();
                            client.BaseAddress = new Uri(SMSURL);

                            // Add an Accept header for JSON format.
                            client.DefaultRequestHeaders.Accept.Add(
                            new MediaTypeWithQualityHeaderValue("application/json"));

                            // List data response.
                            HttpResponseMessage smsResponse = client.GetAsync(SMSURL).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
                            if (smsResponse.IsSuccessStatusCode)
                            {
                                // Parse the response body.
                                //var dataObjects = smsResponse.Content.ReadAsAsync<IEnumerable<DataObject>>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
                                //foreach (var d in dataObjects)
                                //{
                                //    Console.WriteLine("{0}", d.Name);
                                //}
                                var dataObj1 = smsResponse.Content.ReadAsStringAsync().Result.ToString();
                                var dataObj = JsonConvert.DeserializeObject<SMSResponseData>(dataObj1);

                                model1.Id = ModelData[0].Id;
                                model1.Email_Subject = model1.Email_Subject;
                                model1.Email_Body = model1.Email_Body;
                                model1.ResponseId = dataObj.Id;
                                ModelData = repository.SendEmail_AddEdit(model1);
                                repository.SendEmail_Update(ModelData[0].Id, "", 1, "");
                            }
                            else
                            {
                                Console.WriteLine("{0} ({1})", (int)smsResponse.StatusCode, smsResponse.ReasonPhrase);
                                repository.SendEmail_Update(ModelData[0].Id, smsResponse.ReasonPhrase, 2, "");
                            }

                            //Make any other calls using HttpClient here.

                            //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                            client.Dispose();
                        }
                    }
                    else
                    {
                        PushNotificationMessage message = new PushNotificationMessage();
                        message.Title = itemData.Email_Subject;
                        message.Message = itemData.Email_Body;

                        PushNotificationApiManager.sendNotification(message, ModelData[0].Id, itemData.UserId, 4);
                    }
                }

                var msgtype = "Send Email";
                if (Emailobj[0].TemplateType_Id == 2)
                {
                    msgtype = "Send Notification";
                }
                if (Emailobj[0].TemplateType_Id == 3)
                { msgtype = "Send SMS"; }

                //SendEmail_Update[Send Email Update Method Name] 
                if (ModelData.Any(item => item.flag == 0) == true)
                {
                    messagestr = msgtype + " not created, Please check the data";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = msgtype + " created Successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = msgtype + " updated Successfully";
                    model.ReturnFlag = 1;

                }
                model.SendEmail = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Send Email";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.SendEmail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
        /// <summary>
        /// to get composed email detail from Email template based on Event and Template
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Template_Id"></param>
        /// <param name="Institution_Id"></param>
        /// <param name="TemplateType_Id"></param>
        /// <returns></returns>
        public SendEmailModel GenerateTemplate(long Id, long Template_Id, long Institution_Id, long TemplateType_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
               _MyLogger.Exceptions("INFO", _AppLogger, "Controller", null, _AppMethod);
                SendEmailModel model = new SendEmailModel();
                model = repository.GenerateTemplate(Id, Template_Id, Institution_Id, TemplateType_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to get Email sent History for the given filter
        /// </summary>
        /// <param name="Id"></param>
        /// <param name="Period_From"></param>
        /// <param name="Period_To"></param>
        /// <param name="Email_Stauts"></param>
        /// <param name="PATIENTNO"></param>
        /// <param name="INSURANCEID"></param>
        /// <param name="GENDER_ID"></param>
        /// <param name="NATIONALITY_ID"></param>
        /// <param name="ETHINICGROUP_ID"></param>
        /// <param name="MOBILE_NO"></param>
        /// <param name="HOME_PHONENO"></param>
        /// <param name="EMAILID"></param>
        /// <param name="MARITALSTATUS_ID"></param>
        /// <param name="COUNTRY_ID"></param>
        /// <param name="STATE_ID"></param>
        /// <param name="CITY_ID"></param>
        /// <param name="BLOODGROUP_ID"></param>
        /// <param name="Group_Id"></param>
        /// <param name="IsActive"></param>
        /// <param name="INSTITUTION_ID"></param>
        /// <param name="TemplateType_Id"></param>
        /// <returns></returns>
        [HttpGet]
        public IList<EmailHistoryListModel> EmailHistory_List(long? Id, DateTime? Period_From, DateTime? Period_To, int? Email_Stauts, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int? IsActive, long? INSTITUTION_ID, long TemplateType_Id, Guid Login_Session_Id)
        {
            IList<EmailHistoryListModel> model;
            try
            {
                model = repository.EmailHistory_List(Id, Period_From, Period_To, Email_Stauts, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id, IsActive, INSTITUTION_ID, TemplateType_Id, Login_Session_Id);
                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get list of undelivered email 
        /// </summary>
        /// <param name="Emailobj">filters to get undelivered email</param>
        /// <returns>list of undelivered email </returns>
        [HttpPost]
        public HttpResponseMessage UndeliveredEmail_Insert([FromBody]List<SendEmailModel> Emailobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<SendEmailModel> ModelData = new List<SendEmailModel>();
            SendEmailReturnModels model = new SendEmailReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.SendEmail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                long Institution_Id;
                Institution_Id = long.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
                EmailConfigurationModel emailModel = new EmailConfigurationModel();
                emailModel = emailrepository.EmailConfiguration_View(Institution_Id);

                foreach (SendEmailModel itemData in Emailobj)
                {
                    SendEmailModel model1 = new SendEmailModel();
                    model1 = repository.GenerateTemplate(itemData.UserId, itemData.Template_Id, itemData.Institution_Id, itemData.TemplateType_Id);
                    itemData.Email_Subject = model1.Email_Subject;
                    itemData.Email_Body = model1.Email_Body;
                    ModelData = repository.SendEmail_ResendListing(itemData);

                    if (itemData.TemplateType_Id == 1)
                    {
                        if (emailModel != null)
                        {
                            AlertEventModel alert = new AlertEventModel();
                            alert.Template_Id = itemData.Template_Id;
                            alert.TempBody = itemData.Email_Body;
                            alert.TempSubject = itemData.Email_Subject;

                            List<EmailListModel> elList = new List<EmailListModel>();
                            EmailListModel el = new EmailListModel();
                            el.UserName = itemData.UserName;
                            el.EmailId = ModelData[0].EmailId;
                            el.EmailType_Flag = 1;
                            elList.Add(el);

                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendComposedSMTPEmail(emailModel, alert, elList, ModelData[0].Id, "", 0);
                        }
                    }
                    else
                    {
                        PushNotificationMessage message = new PushNotificationMessage();
                        message.Title = itemData.Email_Subject;
                        message.Message = itemData.Email_Body;

                        PushNotificationApiManager.sendNotification(message, ModelData[0].Id, ModelData[0].UserId, 4);
                    }
                }

                var msgtype = "Send Email";
                if (Emailobj[0].TemplateType_Id == 2)
                {
                    msgtype = "Send Notification";
                }
                if (Emailobj[0].TemplateType_Id == 3)
                { msgtype = "Send SMS"; }

                //SendEmail_Update[Send Email Update Method Name] 
                if (ModelData.Any(item => item.flag == 0) == true)
                {
                    messagestr = msgtype + " not created, Please check the data";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = msgtype + " created Successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = msgtype + " updated Successfully";
                    model.ReturnFlag = 1;

                }

                //SendEmail_Update[Send Email Update Method Name] 
                messagestr = msgtype+ " created Successfully";
                model.ReturnFlag = 1;
                model.SendEmail = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Send Email";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.SendEmail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to edit/alter a undelivered email
        /// </summary>
        /// <param name="Emailobj">Email modified detail</param>
        /// <returns>updated email detail</returns>
        [HttpPost]
        public HttpResponseMessage UndeliveredEmail_Edit([FromBody] SendEmailModel Emailobj)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<SendEmailModel> ModelData = new List<SendEmailModel>();
            SendEmailReturnModels model = new SendEmailReturnModels();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.SendEmail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {

                long Institution_Id;
                Institution_Id = long.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
                EmailConfigurationModel emailModel = new EmailConfigurationModel();
                emailModel = emailrepository.EmailConfiguration_View(Institution_Id);

                ModelData = repository.SendEmail_AddEdit(Emailobj);

                var msgtype = "Send Email";
                if (Emailobj.TemplateType_Id == 2)
                {
                    msgtype = "Send Notification";
                }
                if (Emailobj.TemplateType_Id == 3)
                {
                    msgtype = "Send SMS";
                }
                //SendEmail_Update[Send Email Update Method Name] 
                if (ModelData.Any(item => item.flag == 0) == true)
                {
                    messagestr = msgtype + " not created, Please check the data";
                    model.ReturnFlag = 0;
                }
                else if (ModelData.Any(item => item.flag == 1) == true)
                {
                    messagestr = msgtype + " created successfully";
                    model.ReturnFlag = 1;
                }
                else if (ModelData.Any(item => item.flag == 2) == true)
                {
                    messagestr = msgtype + " updated successfully";
                    model.ReturnFlag = 1;

                }
                if (model.ReturnFlag == 1)
                {
                    if (Emailobj.TemplateType_Id == 1)
                    {
                        if (emailModel != null)
                        {
                            SendGridMessage msg = SendGridApiManager.ComposeSendGridMessage(emailModel.UserName, emailModel.Sender_Email_Id, Emailobj.Email_Subject, Emailobj.Email_Body, Emailobj.UserName, ModelData[0].EmailId);

                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendEmailAsync(msg, ModelData[0].Id);
                        }
                    }
                    else if (Emailobj.TemplateType_Id == 2)
                    {
                        PushNotificationMessage message = new PushNotificationMessage();
                        message.Title = Emailobj.Email_Subject;
                        message.Message = Emailobj.Email_Body;

                        PushNotificationApiManager.sendNotification(message, ModelData[0].Id, Emailobj.UserId, 4);
                    }
                    else if (Emailobj.TemplateType_Id == 3) 
                    {
                        if (Emailobj.MobileNO != null || Emailobj.MobileNO != string.Empty)
                        {
                            string
                                SMSMbNO = string.Empty, SMSSubject = string.Empty,
                                SMSBody = string.Empty, SMSURL = string.Empty, SMSApiId = string.Empty, SMSUserName = string.Empty, SMSSource = string.Empty;
                            
                            SMSMbNO = Emailobj.MobileNO.Replace(@"~", @"").Replace(@"+", @"");
                            SMSSubject = Emailobj.Email_Subject;
                            SMSBody = Emailobj.Email_Body;
                            SMSApiId = "Kv2n09u8";
                            SMSUserName = "MyHealth";
                            SMSSource = "Medspero";

                            SMSURL = "https://txt.speroinfotech.ae/API/SendSMS?" + "username=" + SMSUserName + "&apiId=" + SMSApiId + "&json=True&destination=" + SMSMbNO + "&source=" + SMSSource + "&text=" + SMSBody;

                            HttpClient client = new HttpClient();
                            client.BaseAddress = new Uri(SMSURL);

                            // Add an Accept header for JSON format.
                            client.DefaultRequestHeaders.Accept.Add(
                            new MediaTypeWithQualityHeaderValue("application/json"));

                            // List data response.
                            HttpResponseMessage smsResponse = client.GetAsync(SMSURL).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
                            Console.WriteLine(client.GetAsync(SMSURL).Result);
                            if (smsResponse.IsSuccessStatusCode)
                            {
                                repository.SendEmail_Update(ModelData[0].Id, "", 1, "");
                            }
                            else
                            {
                                Console.WriteLine("{0} ({1})", (int)smsResponse.StatusCode, smsResponse.ReasonPhrase);
                                repository.SendEmail_Update(ModelData[0].Id, smsResponse.ReasonPhrase, 2, "");
                            }

                            //Make any other calls using HttpClient here.

                            //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                            client.Dispose();
                        }
                    }
                }
                model.SendEmail = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in creating Send Email";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.SendEmail = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to update User FCM token for Notification sending
        /// </summary>
        /// <param name="UserFCM">User FCM Token detail</param>
        /// <returns>updated FCM Token detail</returns>
        [HttpPost]
        public HttpResponseMessage UpdateUser_FCMTocken([FromBody]NotifictaionUserFCM UserFCM)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            NotifictaionUserFCM model = new NotifictaionUserFCM();
            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            try
            {
                model = repository.UpdateUser_FCMTocken(UserFCM);
                    
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);                
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to Delete User FCM token for Notification sending
        /// </summary>
        /// <param name="UserFCM">User FCM Token detail</param>
        /// <returns>Deleted FCM Token detail</returns>
        [HttpPost]
        public HttpResponseMessage DeleteUser_FCMTocken([FromBody] NotifictaionUserFCM UserFCM)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            NotifictaionUserFCM model = new NotifictaionUserFCM();
            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            try
            {
                model = repository.DeleteUser_FCMTocken(UserFCM);

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }

        /// <summary>
        /// to get FCM token of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>FCM token detail of a user</returns>
        [HttpGet]
        public List<NotifictaionUserFCM> UserFCMToken_Get_List(long User_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            List<NotifictaionUserFCM> model = new List<NotifictaionUserFCM>();
            if (!ModelState.IsValid)
            {
                return null;
            }
            try
            {
                model = repository.UserFCMToken_Get_List(User_Id);

                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to get Notification list of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>Notification list of a user</returns>
        [HttpGet]
        public UserNotificationListModel User_get_NotificationList(long User_Id,Guid Login_Session_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationListModel model = new UserNotificationListModel();
            if (!ModelState.IsValid)
            {
                return null;
            }
            try
            {
                model = repository.User_get_NotificationList(User_Id, Login_Session_Id);

                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }

        /// <summary>
        /// to get Notification list of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>Notification list of a user</returns>
        [HttpGet]
        public UserNotificationListModel ClearNotification_Update(long User_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationListModel model = new UserNotificationListModel();
            if (!ModelState.IsValid)
            {
                return null;
            }
            try
            {
                model = repository.ClearNotification_Update(User_Id);

                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to get Notification list of a user
        /// </summary>
        /// <param name="User_Id">User Id</param>
        /// <returns>Notification list of a user</returns>
        [HttpGet]
        public UserNotificationListModel CountNotification_Update(long User_Id)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationListModel model = new UserNotificationListModel();
            if (!ModelState.IsValid)
            {
                return null;
            }
            try
            {
                model = repository.CountNotification_Update(User_Id);

                return model;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return null;
            }
        }
        /// <summary>
        /// to insert/update a notification for a user
        /// </summary>
        /// <param name="SendEmail_Id">Email config id</param>
        /// <returns>inserted/updated notification</returns>
        [HttpPost]
        public HttpResponseMessage Notification_Update(Guid Login_Session_Id, [FromBody]SendEmailModel sendEmailModel)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            UserNotificationModel ModelData = new UserNotificationModel();
            NotificationReturnModel model = new NotificationReturnModel();
            if (!ModelState.IsValid)
            {
                model.Status = "False";
                model.Message = "Invalid data";
                model.NotificationDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
            string messagestr = "";
            try
            {
                ModelData = repository.Notification_Update(sendEmailModel.Id, Login_Session_Id);
                messagestr = "Notification updated successfully";
                model.NotificationDetails = ModelData;
                model.Message = messagestr;
                model.Status = "True";
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, model);
                return response;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                model.Status = "False";
                model.Message = "Error in Update Notification";
                model.Error_Code = ex.Message;
                model.ReturnFlag = 0;
                model.NotificationDetails = ModelData;
                return Request.CreateResponse(HttpStatusCode.BadRequest, model);
            }
        }
    }
}