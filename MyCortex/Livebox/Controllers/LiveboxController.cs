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
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                dynamic data = JsonConvert.DeserializeObject(json);
                string conferencename = data.conferencename;
                retid = liveBoxRepository.LiveBox_Notify_UPDATE(conferencename);
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
        public ActionResult LiveBoxNotification()
        {
            try
            {
                int retid = 0;
                Stream req = Request.InputStream;
                req.Seek(0, System.IO.SeekOrigin.Begin);
                string json = new StreamReader(req).ReadToEnd();
                retid = liveBoxRepository.LiveBox_Notify_Log(json);
                return Content("SUCCESS");
            }
            catch (Exception e)
            {
                return Content("Failure : " + e.Message);
            }
        }
    }
}