using MyCortex.Repositories.Login;
//using MyCortex.Repositories.Menu;
using MyCortex.CommonMenu.Models;
using MyCortex.Login.Model;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
  
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.Configuration;
using System.Web.Http.Cors;
using MyCortex.Repositories.Menu;
using MyCortex.User.Model;
using MyCortex.Repositories.Uesr;
using MyCortex.Masters.Models;
using MyCortex.Notification.Model;
//using MyCortex.Repositories.Admin;
using MyCortex.Provider;
//using MyCortex.Repositories.Masters;
using MyCortex.Repositories.LiveBox;
using MyCortex.Repositories;
using MyCortex.Utilities;
using Stripe;
using Stripe.Checkout;
using System.Net;
using System.Text;
using System.IO;
using System.Runtime.Serialization.Json;
using MyCortex.Admin.Models;
using MyCortex.Notification.Firebase;
using System.Web.UI;
using Newtonsoft.Json.Linq;
using MyCortex.User.Controller;
using MyCortex.User.Models;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Notification;
using MyCortexDB;
using static MyCortex.Notification.Firebase.PushNotificationApiManager;
using System.Data;

namespace MyCortex.Livebox.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LiveboxController : Controller
    {
        public string returnError = "";
        private CommonMenuRepository db = new CommonMenuRepository();
        //static readonly ICommonRepository commonrepository = new CommonRepository();
        //static readonly IGatewaySettingsRepository gatewayrepository = new GatewaySettingsRepository();
        //static readonly IPatientAppointmentsRepository patientAppointmentsRepository = new PatientAppointmentRepository();
        static readonly AlertEventRepository alertrepository = new AlertEventRepository();
        static readonly ILiveBoxRepository liveBoxRepository = new LiveBoxRepository();
        //private LoginRepository login = new LoginRepository();
        private UserRepository repository = new UserRepository();

        //private InstitutionRepository Insrepository = new InstitutionRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        IList<AppConfigurationModel> model;
        IList<GatewaySettingsModel> gatewayModel;
        private Int64 InstitutionId = Convert.ToInt64(ConfigurationManager.AppSettings["InstitutionId"]);
        private string ClientId;
        private string SecretKey;
        private string RedirectUrl;

        int i = 0;

        public LiveboxController()
        {
           
        }

        [HttpPost]
        public ActionResult LiveBoxNotify()
        {
            try
            {
                int retid = 0;
                string userID = "";
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                dynamic data = JsonConvert.DeserializeObject(json);
                string conferencename = data.conferencename;
                string recording_url = data.recordedvideoURL;
                if (recording_url != "" || recording_url != String.Empty)
                {
                    retid = liveBoxRepository.LiveBox_Recording_url(conferencename, recording_url);
                }
                retid = liveBoxRepository.LiveBox_Notify_UPDATE(conferencename, InstitutionId,userID);
                //PushNotificationMessage message = new PushNotificationMessage();
                //message.Title = "Notification For Call";
                //message.Message = "call end";
                //long userid = 102111;

                //PushNotificationApiManager.sendNotification(message, 0, userid, 4);
                
                string ConferenceId = JObject.Parse(json)["conferencename"].ToString();
                string RemainingTime = JObject.Parse(json)["remainingtime"].ToString();

                if (json.Contains("remainingtime"))
                {
                    retid = liveBoxRepository.LiveBox_RemainingTime(ConferenceId, RemainingTime);
                    Get_AppointmentDuration(ConferenceId);
                }
                else
                {
                    Get_AppointmentDuration(ConferenceId);
                }

                string baseUrl = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                string redirectUrl = "https://" + baseUrl + "/Home/Index#/PatientVitals/0/1";
                if (redirectUrl != String.Empty)
                {
                    var controller = new PatientAppointmentsController
                    {
                        Request = new System.Net.Http.HttpRequestMessage(),
                        Configuration = new System.Web.Http.HttpConfiguration()
                    };
                    var response = controller.RedirectToPatientVitals(redirectUrl);
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }

        [HttpPost]
        public ActionResult LiveBoxVideoNotify()
        {
            try
            {
                int retid = 0;
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                //PushNotificationMessage message = new PushNotificationMessage();
                //message.Title = "Notification For Call";
                //message.Message = "call end";
                //long userid = Convert.ToInt64(Session["UserId"].ToString());
                //PushNotificationApiManager.sendNotification(message, 0, userid, 4);
                if (json.Contains("recordedvideoURL"))
                {
                    string conference_name = JObject.Parse(json)["conferencename"].ToString();
                    string recording_url = JObject.Parse(json)["recordedvideoURL"].ToString();
                    string Recordingurl = JObject.Parse(json)["recordedvideoURL"].ToString();
                    string baseUrl = System.Web.HttpContext.Current.Request.Url.Host.ToString();
                    string source_path = System.Web.HttpContext.Current.Server.MapPath("~/Images");
                    string pathToNewFolder = System.IO.Path.Combine(source_path, "Video");
                    DirectoryInfo directory = Directory.CreateDirectory(pathToNewFolder);
                    try
                    {
                        var httpRequest = System.Web.HttpContext.Current.Request;
                        var postedFile = httpRequest.Files[recording_url];
                        var fileid = System.Guid.NewGuid() + ".txt";
                        string returnPath = System.IO.Path.Combine(pathToNewFolder, fileid);

                        FileStream fs = new FileStream(returnPath, FileMode.OpenOrCreate);
                        StreamWriter str = new StreamWriter(fs);
                        str.BaseStream.Seek(0, SeekOrigin.End);
                        str.Write(recording_url);
                        str.Flush();
                        str.Close();
                        fs.Close();
                        int response = repository.Save_Video_Call_Recording_Logs(conference_name, returnPath, Recordingurl);
                    }
                    catch (Exception err)
                    {
                        Console.WriteLine(err.Message);
                    }
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }

        [HttpPost]
        public ActionResult LiveBoxRemainingTimeNotify()
        {
            try
            {
                int retFlag = 0;
                //{"conferencename":"eb62b1ec-2fd5-4718-b8d9-fe2cc8c3971e","RemainingConferenceTime":"29:30"}
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                string ConferenceId = JObject.Parse(json)["conferencename"].ToString();
                string RemainingTime = JObject.Parse(json)["remainingtime"].ToString();

                if (json.Contains("remainingtime")) { 
                    retFlag = liveBoxRepository.LiveBox_RemainingTime(ConferenceId, RemainingTime);                
                    Get_AppointmentDuration(ConferenceId);
                }
                else
                {
                    Get_AppointmentDuration(ConferenceId);
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }

        [HttpPost]
        public ActionResult LiveBoxNotification()
        {
            try
            {
                int retid = 0;
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                string ConferenceId = JObject.Parse(json)["conferencename"].ToString();
                string userID = "";

                if (json.Contains("WaitingUserStatus"))
                {
                    userID = JObject.Parse(json)["userid"].ToString();
                    retid = liveBoxRepository.LiveBox_Notify_UPDATE(ConferenceId, InstitutionId, userID);                   
                }
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }   
        }


        //public ActionResult Get_AppointmentDuration(string Conference_ID)
        //{
        //    List<string> t = new List<string>();
        //    var jsonSerialiser = new JavaScriptSerializer();
        //    try
        //    {
        //        IList<LiveboxModel> lst = (IList<LiveboxModel>)liveBoxRepository.Get_AppointmentDuration(Conference_ID);
        //        t.Add(lst[0].ConferenceId.ToString());
        //        t.Add(lst[0].Duration.ToString());
        //        var json = jsonSerialiser.Serialize(t);
        //        return Content(json);
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}
        [HttpGet]
        public ActionResult Get_AppointmentDuration(string Conference_ID)
        {
            //List<string> t = new List<string>();
            //var jsonSerialiser = new JavaScriptSerializer();
            //string ConferenceName = "ConferenceId";
            //string Duration = "Duration";
            //int Doctor_Id,Patient_Id;

            //try
            //{
            //    IList<LiveboxModel> lst = (IList<LiveboxModel>)liveBoxRepository.Get_AppointmentDuration(Conference_ID);
            //    IDictionary<string,string> dic = new Dictionary<string,string>();
            //    dic.Add(new KeyValuePair<string,string>(ConferenceName, lst[0].ConferenceId.ToString()));
            //    dic.Add(new KeyValuePair<string, string>(Duration, lst[0].Duration.ToString()));

            //    //Doctor_Id = lst[0].Doctor_Id.ToString();

            //    //t.Add(lst[0].ConferenceId.ToString());
            //    //t.Add(lst[0].Duration.ToString());
            //    var json = jsonSerialiser.Serialize(dic);

            //    IList<EmailListModel> EmailList=alertrepository.UserSpecificEmailList(InstitutionId, Id);

            //    return Content(json);
            //}
            //catch (Exception ex)
            //{
            //    return null;
            //}
            List<string> t = new List<string>();
            var jsonSerialiser = new JavaScriptSerializer();
            string ConferenceName = "ConferenceId";
            string Duration = "Duration";
            string Doctor_Id = "Doctor_Id";
            string Patient_Id = "Patient_Id";

            try
            {
                IList<LiveboxModel> lst = (IList<LiveboxModel>)liveBoxRepository.Get_AppointmentDuration(Conference_ID);
                IDictionary<string, string> dic = new Dictionary<string, string>();
                dic.Add(new KeyValuePair<string, string>(ConferenceName, lst[0].ConferenceId.ToString()));
                dic.Add(new KeyValuePair<string, string>(Duration, lst[0].Duration.ToString()));
              //  dic.Add(new KeyValuePair<string, string>(Doctor_Id, lst[0].Doctor_Id.ToString()));
                //dic.Add(new KeyValuePair<string, string>(Patient_Id, lst[0].Patient_Id.ToString()));

                var json = jsonSerialiser.Serialize(dic);
                //AlertEvents AlertEventReturn = new AlertEvents();

                //if (json.Contains("Doctor_Id"))
                //{
                //    long DoctorID = Convert.ToInt64(JObject.Parse(json)["Doctor_Id"].ToString());
                //    //IList<EmailListModel> EmailList = alertrepository.UserSpecificEmailList(InstitutionId, DoctorID);
                   
                //}
                //if (json.Contains("Patient_Id"))
                //{
                //    long PatientID = Convert.ToInt64(JObject.Parse(json)["Patient_Id"].ToString());
                //    //IList<EmailListModel> EmailList = alertrepository.UserSpecificEmailList(InstitutionId, PatientID);                   
                //}
                
                return Content(json);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}