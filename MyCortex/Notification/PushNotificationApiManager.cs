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

namespace MyCortex.Notification.Firebase
{
    public class PushNotificationApiManager
    {
        static readonly ISendEmailRepository repository = new SendEmailRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        private readonly static MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        /// <summary>
        /// sends Firebase Push Notification
        /// </summary>
        /// <param name="message">Notification Composed Message</param>
        /// <param name="templateId">Notification Template Id</param>
        /// <returns></returns>
        private async static Task<IRestResponse> SendPushNotification(PushNotificationMessage message, long templateId, string Url)
        {
            string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
            _AppLogger = "MyCortex.Notification.Firebase.PushNotificationApiManager";
            _AppMethod = "MoveNext";
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<AppConfigurationModel> model;
            model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));

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
                    click_action = Url
                },
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

                    if(result.results[0].message_id!=null)
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

        public static void sendNotification(PushNotificationMessage message, long templateId, long User_Id, long NotificationFor)
        {
            List<NotifictaionUserFCM> model = new List<NotifictaionUserFCM>();
            model = repository.UserFCMToken_Get_List(User_Id);
            //string url = HttpContext.Current.Request.Url.Authority;
            foreach (NotifictaionUserFCM itemData in model)
            {
                if ((NotificationFor == 3 && itemData.DeviceType == "web") || (NotificationFor == 2 && itemData.DeviceType != "web") || NotificationFor == 4)
                {
                    message.FCMToken = itemData.FCMToken;
                    SendPushNotification(message, templateId, itemData.SiteUrl);
                }
            }
            if (model.Count == 0)
            {
                repository.SendEmail_Update(templateId, "NotRegistered", 2, "");  // 1 -> Delivered,  2 -> NOT-Delivered
            }
        }

        public static void SendConfiguraionSettingNotification(PushNotificationMessage message, long User_Id,string Setting,long Institution_Id)
        {
            List<NotifictaionUserFCM> model = new List<NotifictaionUserFCM>();
            model = repository.UserFCMToken_Get_List(User_Id);
            // string url = HttpContext.Current.Request.Url.Authority;
            foreach (NotifictaionUserFCM itemData in model)
            {
                message.FCMToken = itemData.FCMToken;
                SendConfiguraionPushNotification(message, itemData.SiteUrl, Setting, Institution_Id);
            }
        }
        private async static void SendConfiguraionPushNotification(PushNotificationMessage message, string Url,string Setting,long Institution_Id)
        {
            string
            _AppLogger = string.Empty, _AppMethod = string.Empty;
            _AppLogger = "MyCortex.Notification.Firebase.PushNotificationApiManager";
            _AppMethod = "MoveNext";
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            IList<AppConfigurationModel> model;
            model = commonrepository.AppConfigurationDetails("FIREBASE_APITOKEN", Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]));

            var client = new RestClient("https://fcm.googleapis.com/fcm/send");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Authorization", "key=" + model[0].ConfigValue);

            message.Message = message.Message.Replace("\n\n", Environment.NewLine);

            var my_jsondata = new
            {
                notification = new
                {
                    title = "Setting",
                    body = "Configuration Updated",
                    click_action = Url
                },
                to = message.FCMToken
            };

            //Tranform it to Json object
            string json_data = JsonConvert.SerializeObject(my_jsondata);

            _MyLogger.Exceptions("INFO", _AppLogger, json_data, null, _AppMethod);
            request.AddParameter("application/json", json_data, ParameterType.RequestBody);

            int IS_NOTIFY = 0;
            string messageId = "";
            string errormsg = "";

            try
            {

                IRestResponse response = await client.ExecuteAsync(request);

                var result = JsonConvert.DeserializeObject<PushNotificationResponse>(response.Content);

                if (result != null)
                {
                    if (result.success == "1")
                        IS_NOTIFY = 1;
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
                 repository.Configuration_Update(Setting, IS_NOTIFY, Institution_Id); //returnObj.results
            }
        }
        public class PushNotificationMessage
        {
            public string FCMToken { get; set; }
            public string Title { get; set; }
            public string Message { get; set; }
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
}
