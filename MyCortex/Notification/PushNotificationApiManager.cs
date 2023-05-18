using System;
using System.Configuration;
using System.Threading.Tasks;
using MyCortex.Repositories;
using MyCortex.Repositories.Template;
using RestSharp;
using Newtonsoft.Json;
using MyCortex.Template.Models;
using System.Collections.Generic;
using System.Web;
using Newtonsoft.Json.Linq;
using MyCortex.Masters.Models;
using MyCortex.Repositories.Masters;
using MyCortex.Repositories.LiveBox;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Admin.Models;
using MyCortex.Repositories.Admin;
using MyCortex.Email.SendGrid;
using System.Web.Mvc;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Reflection;
using System.Text.RegularExpressions;

namespace MyCortex.Notification.Firebase
{
    public class PushNotificationApiManager
    {
        static readonly ILiveBoxRepository LBrepository = new LiveBoxRepository();
        static readonly ISendEmailRepository repository = new SendEmailRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        static readonly AlertEventRepository alertrepository = new AlertEventRepository();
        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();

        private readonly static MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;


        /// <summary>
        /// sends Firebase Push Notification
        /// </summary>
        /// <param name="message">Notification Composed Message</param>
        /// <param name="templateId">Notification Template Id</param>
        /// <returns></returns>
        private async static Task<IRestResponse> SendPushNotification(PushNotificationMessage message, long templateId, string Url, long Institution_Id)
        {
            string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
            _AppLogger = "MyCortex.Notification.Firebase.PushNotificationApiManager";
            _AppMethod = "MoveNext";
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            //long Institution_Id;
            //Institution_Id = long.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
            IList<AppConfigurationModel> model;
            //model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));
            model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Institution_Id);

            var client = new RestClient("https://fcm.googleapis.com/fcm/send");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json"); 
            request.AddHeader("Authorization", "key=" + model[0].ConfigValue);

            message.Message = message.Message.Replace("\n\n", Environment.NewLine);

            // HttpContext.Current.Request.Url.Host;
            // localhost
            var my_jsondata = new
            {
                notification = new
                {
                    title = message.Title,
                    body = message.Message,
                   // click_action = Url,
                    //user_id = User_Id,
                    //Conferencename = message.conferencename
                },
                //priority = "high",
                to = message.FCMToken
            };

            //Tranform it to Json object
            string json_data = JsonConvert.SerializeObject(my_jsondata);

            _MyLogger.Exceptions("INFO", _AppLogger, json_data, null, _AppMethod);
            request.AddParameter("application/json", json_data, ParameterType.RequestBody);

            int deliveryStatus = 2;
            string messageId = "";
            string errormsg = "";

            try
            {

                IRestResponse response = await client.ExecuteAsync(request);

                var result = JsonConvert.DeserializeObject<PushNotificationResponse>(response.Content);

                if (result != null)
                {
                    if (result.success == "1")
                        deliveryStatus = 1;

                    if (result.results[0].message_id != null)
                        messageId = result.results[0].message_id;

                    if (result.results[0].error != null)
                        errormsg = result.results[0].error;
                }
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
            finally
            {
                repository.SendEmail_Update(templateId, errormsg, deliveryStatus, messageId); //returnObj.results

            }

            return null;

        }

        public static async void sendNotification(PushNotificationMessage message, long templateId, long User_Id, long Institution_Id, long NotificationFor)
        {
            List<NotifictaionUserFCM> model = new List<NotifictaionUserFCM>();
            model = repository.UserFCMToken_Get_List(User_Id);
            //string url = HttpContext.Current.Request.Url.Authority;
            foreach (NotifictaionUserFCM itemData in model)
            {
                if ((NotificationFor == 3 && itemData.DeviceType == "web") || (NotificationFor == 2 && itemData.DeviceType != "web") || NotificationFor == 4)
                {
                    message.FCMToken = itemData.FCMToken;
                    try
                    {
                        await SendPushNotification(message, templateId, itemData.SiteUrl, Institution_Id);
                    }
                    catch
                    {
                    }
                }
            }
            if (model.Count == 0)
            {
                repository.SendEmail_Update(templateId, "NotRegistered", 2, "");  // 1 -> Delivered,  2 -> NOT-Delivered
            }
        }

        //}

        //public static async void SendConfiguraionSettingNotification()
        //{
        //    List<FCMUserDetails> model = new List<FCMUserDetails>();
        //    model = repository.FCMUsersBasedonInstitution(Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));

        //    foreach (FCMUserDetails itemData in model)
        //    {
        //        PushNotificationMessage message = new PushNotificationMessage();
        //        message.Title = "Configuration Settings";
        //        message.Message = "configuration changed";
        //        message.FCMToken = itemData.FCMToken;
        //        await SendConfiguraionPushNotification(message, itemData.SiteUrl, itemData.Settings, itemData.Institution_Id);
        //    }
        //}
       // public static async Task<async> SendLiveboxNotificationAsync(PushNotificationMessage message, long User_Id, long Institution_Id, PushNotificationMessage Webmessage, string MobileNo, PushNotificationMessage SMSMessage)
        public static async Task<async> SendLiveboxNotificationAsync(PushNotificationMessage message, long User_Id, long Institution_Id, PushNotificationMessage Webmessage)
        {
            string
           _AppLogger = string.Empty, _AppMethod = string.Empty;
            _AppLogger = "MyCortex.Notification.Firebase.PushNotificationApiManager";
            _AppMethod = "MoveNext";
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            Int64 Id = 0;
            AlertEvents AlertEventReturn = new AlertEvents();    
            IList<EmailListModel> EmailList;
            //AlertEventModel EmailList =new AlertEventModel();
            List<NotifictaionUserFCM> model = new List<NotifictaionUserFCM>();
            EmailConfigurationModel emailModel = new EmailConfigurationModel();
            model = repository.UserFCMToken_Get_List(User_Id);
            // string url = HttpContext.Current.Request.Url.Authority;
            foreach (NotifictaionUserFCM itemData in model)
            {
                message.FCMToken = itemData.FCMToken;
                Webmessage.FCMToken = itemData.FCMToken;
                try
                {
                    Id = 0;
                    //without Event Code send email.
                    EmailList = alertrepository.UserSpecificEmailList(Institution_Id, User_Id);
                    //EmailConfigurationModel emailModel = new EmailConfigurationModel();
                    emailModel = emailrepository.EmailConfiguration_View(Institution_Id);
                    if (emailModel != null)
                    {
                        AlertEventModel alert = new AlertEventModel();
                        alert.Template_Id = 0;
                        alert.TempBody = message.Message;
                        alert.TempSubject = message.Title;

                        List<EmailListModel> elList = new List<EmailListModel>();
                        EmailListModel el = new EmailListModel();
                        el.UserName = EmailList[0].UserName;
                        el.EmailId = EmailList[0].EmailId;
                        el.EmailType_Flag = EmailList[0].EmailType_Flag;
                        elList.Add(el);

                        SendGridApiManager mail = new SendGridApiManager();
                        var res = mail.SendComposedSMTPEmail(emailModel, alert, elList, 0, "", User_Id);
                        //repository.LiveBox_UserDetails_Delete(User_Id);
                    }
                    //var l = await SendPushLiveboxNotification(message, itemData.SiteUrl, User_Id, Institution_Id, Webmessage, SMSMessage);
                    var l = await SendPushLiveboxNotification(message, itemData.SiteUrl, User_Id, Institution_Id, Webmessage);
                }
                catch
                {

                    }
                }
            if (model.Count == 0)
            {
            Id = 0;
            //without Event Code send email.
            EmailList = alertrepository.UserSpecificEmailList(Institution_Id, User_Id);
            //EmailConfigurationModel emailModel = new EmailConfigurationModel();
            emailModel = emailrepository.EmailConfiguration_View(Institution_Id);
            if (emailModel != null)
            {
                AlertEventModel alert = new AlertEventModel();
                alert.Template_Id = 0;
                alert.TempBody = message.Message;
                alert.TempSubject = message.Title;

                List<EmailListModel> elList = new List<EmailListModel>();
                EmailListModel el = new EmailListModel();
                el.UserName = EmailList[0].UserName;
                el.EmailId = EmailList[0].EmailId;
                el.EmailType_Flag = EmailList[0].EmailType_Flag;
                elList.Add(el);

                SendGridApiManager mail = new SendGridApiManager();
                var res = mail.SendComposedSMTPEmail(emailModel, alert, elList, 0, "", User_Id);
                repository.LiveBox_UserDetails_Delete(User_Id);
            }
                //if (MobileNo != null || MobileNo != string.Empty)
                //{

                //    string[] EncryptMbNO; string[] SMSSplMbNo;
                //    string
                //        SMSPrefixMbNO = string.Empty, SMSSuffixMbNO = string.Empty, SMSMbNO = string.Empty, SMSSubject = string.Empty,
                //        SMSBody = string.Empty, SMSURL = string.Empty, SMSApiId = string.Empty, SMSUserName = string.Empty, SMSSource = string.Empty;
                //    bool containsTildeSpecialCharacter, containsPlusSpecialCharacter = false;
                //    Regex rgx = new Regex("[^A-Za-z0-9]");

                //    containsTildeSpecialCharacter = rgx.IsMatch(MobileNo);
                //    EncryptMbNO = MobileNo.Split('~');

                //    if (containsTildeSpecialCharacter)
                //    {
                //        SMSPrefixMbNO = EncryptMbNO[0];
                //        SMSSuffixMbNO = EncryptMbNO[1];
                //        SMSMbNO = SMSPrefixMbNO + SMSSuffixMbNO;
                //        containsPlusSpecialCharacter = rgx.IsMatch(SMSPrefixMbNO);
                //    }
                //    if (containsPlusSpecialCharacter)
                //    {
                //        SMSSplMbNo = SMSPrefixMbNO.Split('+');
                //        SMSMbNO = SMSSplMbNo[1] + SMSSuffixMbNO;
                //    }
                //    else
                //    {
                //        SMSMbNO = EncryptMbNO[0];
                //    }
                //    SMSSubject = SMSMessage.Title;
                //    SMSBody = SMSMessage.Message;
                //    //SMSApiId = "Kv2n09u8";
                //    //SMSUserName = "MyHealth";
                //    //SMSSource = "OILHDK";
                //    SMSApiId = itemData.SMSApiId;
                //    SMSUserName = itemData.SMSUserName;
                //    SMSSource = itemData.SMSSource_Id;

                //    SMSBody = SMSBody.Replace("<br>", "");
                //    SMSBody = SMSBody.Replace("<br /> ", "");
                //    SMSBody = SMSBody.Replace("<p>", "");
                //    SMSBody = SMSBody.Replace("</p> ", "\n<p ");
                //    SMSBody = SMSBody.Replace("&nbsp;", " ");
                //    SMSBody = SMSBody.Replace("\n", " ");
                //    //string[] OldWords = {"&nbsp;", "&amp;", "&quot;", "&lt;","&gt;", "&reg;", "&copy;", "&bull;", "&trade;","&#39;"};
                //    //string[] NewWords = { " ", "&", "\"", "<", ">", "Â®", "Â©", "â€¢", "â„¢", "\'" };
                //    //for (int i = 0; i < OldWords.Length; i++)
                //    //{
                //    //    SMSBody.Replace(OldWords[i], NewWords[i]);
                //    //}
                //    // Finally, remove all HTML tags and return plain text
                //    //return 
                //    var TextPlan = "";
                //    TextPlan = System.Text.RegularExpressions.Regex.Replace(SMSBody.ToString(), "<[^>]*>", "");

                //    SMSURL = "https://txt.speroinfotech.ae/API/SendSMS?" + "username=" + SMSUserName + "&apiId=" + SMSApiId + "&json=True&destination=" + SMSMbNO + "&source=" + SMSSource + "&text=" + TextPlan;

                //    HttpClient client = new HttpClient();
                //    client.BaseAddress = new Uri(SMSURL);

                //    // Add an Accept header for JSON format.
                //    client.DefaultRequestHeaders.Accept.Add(
                //    new MediaTypeWithQualityHeaderValue("application/json"));

                //    // List data response.
                //    HttpResponseMessage smsResponse = client.GetAsync(SMSURL).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
                //    if (smsResponse.IsSuccessStatusCode)
                //    {
                //        // Parse the response body.
                //        //var dataObjects = smsResponse.Content.ReadAsAsync<IEnumerable<DataObject>>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
                //        //foreach (var d in dataObjects)
                //        //{
                //        //    Console.WriteLine("{0}", d.Name);
                //        //}
                //        var dataObj1 = smsResponse.Content.ReadAsStringAsync().Result.ToString();
                //        var dataObj = JsonConvert.DeserializeObject<SMSResponseData>(dataObj1);

                //        model1.Id = ModelData[0].Id;
                //        model1.Email_Subject = model1.Email_Subject;
                //        model1.Email_Body = model1.Email_Body;
                //        model1.ResponseId = dataObj.Id;
                //        ModelData = repository.SendEmail_AddEdit(model1);
                //        repository.SendEmail_Update(ModelData[0].Id, "", 1, "");
                //    }
                //    else
                //    {
                //        Console.WriteLine("{0} ({1})", (int)smsResponse.StatusCode, smsResponse.ReasonPhrase);
                //        repository.SendEmail_Update(ModelData[0].Id, smsResponse.ReasonPhrase, 2, "");
                //    }

                //    //Make any other calls using HttpClient here.

                //    //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                //    client.Dispose();
                //}
            }
            repository.LiveBox_UserDetails_Delete(User_Id);
            return null;
        }
        //public static async Task<ActionResult> SendPushLiveboxNotification(PushNotificationMessage message, string Url, long User_Id, long Institution_Id, PushNotificationMessage Webmessage,PushNotificationMessage SMSMessage)
        public static async Task<ActionResult> SendPushLiveboxNotification(PushNotificationMessage message, string Url, long User_Id, long Institution_Id, PushNotificationMessage Webmessage)
        {
            string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
            _AppLogger = "MyCortex.Notification.Firebase.PushNotificationApiManager";
            _AppMethod = "MoveNext";
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            //long Institution_Id;
            //Institution_Id = long.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
            IList<AppConfigurationModel> model;
            //model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));
            model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Institution_Id);

            var client = new RestClient("https://fcm.googleapis.com/fcm/send");
            string json_data1 = JsonConvert.SerializeObject(client);
            _MyLogger.Exceptions("INFO", _AppLogger, json_data1, null, _AppMethod);
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Authorization", "key=" + model[0].ConfigValue);

            Webmessage.Message = Webmessage.Message.Replace("\n\n", Environment.NewLine);

            // HttpContext.Current.Request.Url.Host;
            // localhost
            var my_jsondata = new
            {
                notification = new
                {
                    title = Webmessage.Title,
                    body = Webmessage.Message,
                    //click_action = Url,
                    user_id = User_Id,
                    Conferencename = Webmessage.conferencename
                },
                //priority = "high",
                data = new //android
                {
                    user_id = User_Id,
                    Conference_Name = Webmessage.conferencename
                },
                to = Webmessage.FCMToken,
            };

            //Tranform it to Json object
            string json_data = JsonConvert.SerializeObject(my_jsondata);

            _MyLogger.Exceptions("INFO", _AppLogger, json_data, null, _AppMethod);
            request.AddParameter("application/json", json_data, ParameterType.RequestBody);

            int deliveryStatus = 2;
            string messageId = "";
            string errormsg = "";

            try
            {

                IRestResponse response = await client.ExecuteAsync(request);

                var result = JsonConvert.DeserializeObject<PushNotificationResponse>(response.Content);

                if (result != null)
                {
                    if (result.success == "1")
                        deliveryStatus = 1;

                    if (result.results[0].message_id != null)
                        messageId = result.results[0].message_id;

                    if (result.results[0].error != null)
                        errormsg = result.results[0].error;
                }
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
            }
            finally
            {
                if (deliveryStatus == 1)
                {
                    repository.LiveBox_UserDetails_Delete(User_Id); //returnObj.results
                }
            }

            return null;
        }
        //private async static Task SendConfiguraionPushNotification(PushNotificationMessage message, string Url, string Setting, long Institution_Id)
        //{
        //    string
        //    _AppLogger = string.Empty, _AppMethod = string.Empty;
        //    _AppLogger = "MyCortex.Notification.Firebase.PushNotificationApiManager";
        //    _AppMethod = "MoveNext";
        //    _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
        //    IList<AppConfigurationModel> model;
        //    model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));

        //    var client = new RestClient("https://fcm.googleapis.com/fcm/send");
        //    client.Timeout = -1;
        //    var request = new RestRequest(Method.POST);
        //    request.AddHeader("Content-Type", "application/json");
        //    request.AddHeader("Authorization", "key=" + model[0].ConfigValue);

        //    message.Message = message.Message.Replace("\n\n", Environment.NewLine);

        //    var my_jsondata = new
        //    {
        //        notification = new
        //        {
        //            title = message.Title,
        //            body = message.Message,
        //            click_action = Url
        //        },
        //        to = message.FCMToken
        //    };

        //    //Tranform it to Json object
        //    string json_data = JsonConvert.SerializeObject(my_jsondata);

        //    _MyLogger.Exceptions("INFO", _AppLogger, json_data, null, _AppMethod);
        //    request.AddParameter("application/json", json_data, ParameterType.RequestBody);

        //    int IS_NOTIFY = 0;
        //    string messageId = "";
        //    string errormsg = "";

        //    try
        //    {

        //        IRestResponse response = await client.ExecuteAsync(request);

        //        var result = JsonConvert.DeserializeObject<PushNotificationResponse>(response.Content);
        //        if (result != null)
        //        {
        //            if (result.success == "1")
        //                IS_NOTIFY = 1;
        //            if (result.results[0].message_id != null)
        //                messageId = result.results[0].message_id;

        //            if (result.results[0].error != null)
        //                errormsg = result.results[0].error;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
        //    }
        //    finally
        //    {
        //        repository.Configuration_Update(Setting, IS_NOTIFY, Institution_Id); //returnObj.results
        //    }
        //}
        public class PushNotificationMessage
        {
            internal string conferencename;

            public string FCMToken { get; set; }
            public string Title { get; set; }
            public string Message { get; set; }
        }
        public class PushNotificationInputModel
        {
            public long Institution_Id { get; set; }
            public long User_Id { get; set; }
            public string MobileNo { get; set; }
        }
        public class PushNotificationResponse
        {
            public string multicast_id { get; set; }
            public string success { get; set; }
            public string failure { get; set; }
            public string canonical_ids { get; set; }
            public List<PushNotificationResponseMessage> results { get; set; }
        }
        public class PushNotificationResponseMessage
        {
            public string message_id { get; set; }
            public string error { get; set; }
        }

        public static void SendConfiguraionsettingNotification(PushNotificationMessage message, long user_Id, long setting)
        {
            throw new NotImplementedException();
        }
    }

    public class async
    {
    }
}