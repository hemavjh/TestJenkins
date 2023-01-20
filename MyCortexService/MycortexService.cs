using MyCortex.Home.Models;
using MyCortex.Masters.Models;
using MyCortex.Notification;
using MyCortex.Notification.Firebase;
using MyCortex.Notification.Models;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Repositories.Template;
using MyCortex.Repositories.Uesr;
using MyCortex.User.Controllers;
using MyCortex.User.Model;
using MyCortexDB;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using static MyCortex.Notification.Firebase.PushNotificationApiManager;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using static System.Net.WebRequestMethods;
using System.Web;

//using static System.Net.WebRequestMethods;
//using System.Runtime.Remoting.Contexts;
//using System.Net;
//using System.Web.Http.Results;
//using System.Runtime.Serialization;


namespace MyCortexService
{
    public partial class MycortexService : ServiceBase
    {
        Timer timer = new Timer();
        Timer timer2 = new Timer();
        Timer timer3 = new Timer();
        private string executedTime = "";
        private string lastexecutedTime = "";
        private string executedTimeNow = "";
        private Boolean isJob1running = false;
        private Boolean isJob2running = false;
        private Boolean isJob3running = false;

        static readonly SendEmailRepository emailrepository = new SendEmailRepository();
        static readonly AlertEventRepository alertrepository = new AlertEventRepository();
        static readonly UserRepository userrepository = new UserRepository();

       
    //string test = HttpContext.Current.Request.Url.Scheme;
    //    string baseUrl = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + HttpContext.Current.Request.ApplicationPath.TrimEnd('/') + "/";
        public MycortexService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //Debugger.Launch(); // Launches VS2012 debugger.
            timer.Elapsed += new ElapsedEventHandler(OnElapsedTime);
            timer.Interval = 60000; //number in milisecinds     // 60000 = one minute
            timer.Enabled = true;

            timer2.Elapsed += new ElapsedEventHandler(OnElapsedTime2);
            timer2.Interval = 300000; //number in milisecinds     // 300000 = 5 minute
            timer2.Enabled = true;

            timer3.Elapsed += new ElapsedEventHandler(OnElapsedTime3);
            timer3.Interval = 60000; //number in milisecinds     // 60000 = one minute
            timer3.Enabled = true;            
        }

        public void onDebug()
        {
            OnStart(null);
        }
        
        public async static void EligibilityCheck()
        {
            Int64 Id = 0, Institution_Id;
            string Emirates_Id, Clinician_Licence,BaseUrl;
            // every appointment check the eligiblity before 3 hours 
            // Start                  
            int consultationCategoryId, payerId, serviceCategoryId;
            string MobileNumber, CountryCode, MobNumber;
            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[ELIGIBILITY_CHECK_SP_BEFOREHOURS]");
            if (dt.Rows.Count > 0)
            {
                try
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        
                        Id = Convert.ToInt64(dt.Rows[i]["ID"].ToString());
                        Institution_Id = Convert.ToInt64(dt.Rows[i]["INSTITUTION_ID"].ToString());
                        Emirates_Id = dt.Rows[i]["NATIONALID"].ToString();
                        Clinician_Licence = dt.Rows[i]["HEALTH_LICENSE"].ToString();
                        consultationCategoryId = 1;
                        payerId = 102;
                        serviceCategoryId = 1;
                        BaseUrl = dt.Rows[i]["BASEURL"].ToString(); 

                        MobNumber = dt.Rows[i]["MOBILE_NO"].ToString();
                        CountryCode = MobNumber.Split('~')[0];
                        MobileNumber = MobNumber.Split('~')[1];
                        if (CountryCode == null || CountryCode == "undefined" || CountryCode == "")
                        {
                            CountryCode = "+971";
                        }

                        RequestEligibilityParam re = new RequestEligibilityParam();
                        re.NATIONALITY_ID = Emirates_Id;
                        re.ConsultationCategory = consultationCategoryId;
                        re.Clinicianlist = Clinician_Licence;
                        re.MOBILE_NO = MobileNumber;
                        re.PayorId = payerId;
                        re.ServiceCategory = serviceCategoryId;
                        re.countrycode = CountryCode;
                        re.facilityLicense = "MF2007";

                        //var results = new SortedList<string, string>();
                        //results.Add("emiratesId", Emirates_Id);
                        //results.Add("consultationCategoryId", consultationCategoryId.ToString());
                        //results.Add("clinicianLicense", Clinician_Licence);
                        //results.Add("mobileNumber", MobileNumber);
                        //results.Add("payerId", payerId.ToString());
                        //results.Add("serviceCategoryId", serviceCategoryId.ToString());
                        //results.Add("countryCode", CountryCode);
                        //results.Add("facilityLicense", "MF2007");

                        //var container = new JsonContainer();
                        //container.Suggestions = results.Select(r => new JsonData
                        //{
                        //    Value = r.Key,
                        //    Data = r.Value
                        //}).ToList();

                        var json = JsonConvert.SerializeObject(re, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                        var jObject = JObject.Parse(json);
                        var loadobj = JsonConvert.DeserializeObject<JObject>(jObject.ToString());
                        //JObject  jobj = new JObject ();
                        //jobj = (JObject)(json);
                        //////////string strJPostData = JsonConvert.SerializeObject(re, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                        //JObject jobj = new JObject();
                        //jobj = JObject.FromObject(strJPostData);
                        //JArray jArray= new JArray();
                        //jArray = (JArray)strJPostData;


                        //EligibilityCheckController checkELigibility = new EligibilityCheckController();
                        //checkELigibility.AddEligibilityEequest_ByService(loadobj);


                        //HttpResponseMessage response = client.PostAsJsonAsync("api/values", loadobj);

                        // var ProductName =localStorage.getItem("dFhNCjOpdzPNNHxx54e+0w==");
                        //string baseURL = HttpContext.Current.Request.Url.Host;


                        //client.BaseAddress = new Uri("http://localhost:49000/#/login");
                        //var tokendata = "UserName=admin&Password=admin&grant_type=password";
                        //var response = await client.PostAsync("token", new StringContent (tokendata, Encoding.UTF8, "application/x-www-form-urlencoded"));
                        //if (response != null)
                        //{
                        //    //var accessToken = response.access_token;
                        //    Console.WriteLine(response.ToString());
                        //}

                        


                        HttpClient client = new HttpClient();
                        var content = new StringContent(loadobj.ToString());
                        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                        client.BaseAddress = new Uri(BaseUrl); //("http://localhost:49000/"); // if we check in local, please change the base url
                        var response1 = await client.PostAsync("/api/EligibilityCheck/AddEligibilityEequest/", content);
                        var responseContent = await response1.Content.ReadAsStringAsync();
                        if (responseContent != null)
                        {

                            //Console.WriteLine(responseContent.ToString());
                            //var json1 = JsonConvert.SerializeObject(responseContent, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                            //json1 = json1.Trim(new char[] { '[' });
                            if (responseContent.Contains("[")) { 
                                var jArray = responseContent.Replace("[", string.Empty); //JObject.Parse(responseContent);
                                jArray = jArray.Replace("]", string.Empty); //JObject.Parse(responseContent);
                                responseContent = jArray;
                            }
                            var loadobj1 = JsonConvert.DeserializeObject<JObject>(responseContent.ToString());
                            var loadobj2 = JsonConvert.DeserializeObject<RequestEligibilityResponse_useList>(responseContent);
                            if (loadobj2.status == 1)
                            {
                                var eligibility_Id = loadobj2.data.eligibilityId;
                                var content1 = new StringContent("");
                                content1.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                                var responsedet = await client.GetAsync("/api/PayBy/EligibilityRequestDetail?eligibilityID=" + eligibility_Id + "&facilityLicense=MF2007");
                                var responseDetContent = await responsedet.Content.ReadAsStringAsync(); // get the 
                                if (responseDetContent != null)
                                {
                                    //var jArray = responseDetContent.Replace("[", string.Empty);
                                    //jArray = jArray.Replace("]", string.Empty);

                                    // This is for get all data
                                    var loadobj3 = JsonConvert.DeserializeObject<RequestEligibilityDetailResponse_bylist>(responseDetContent.ToString());

                                    //this is for get the result value
                                    var loadobj4 = JsonConvert.DeserializeObject<eligibilityCheck>(responseDetContent.ToString());
                                    var result = loadobj4.result;
                                    if(result== false)
                                    {
                                        //Send 
                                        FalseEligibility jobj = new FalseEligibility();
                                        jobj.eligibilityId = eligibility_Id;
                                        
                                        //var jobj = "{ \"eligibilityId\" : " + eligibility_Id + " }";
                                        var json3 = JsonConvert.SerializeObject(jobj, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                                        var jObject4 = JObject.Parse(json3);
                                        var loadobj5 = JsonConvert.DeserializeObject<JObject>(jObject4.ToString());
                                        var content2 = new StringContent(loadobj5.ToString());
                                        content2.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                                        var responseCan = await client.PostAsync("/api/EligibilityCheck/CancelEligibilityEequest/", content2);
                                        var responseCancelContent = await responseCan.Content.ReadAsStringAsync();


                                        UpdateAppointment jobj1 = new UpdateAppointment();
                                        jobj1.Appointment_Id = Id;
                                        jobj1.Status = 1;
                                        jobj1.PaymentStatus_Id = 2;
                                       
                                        var json31 = JsonConvert.SerializeObject(jobj1, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                                        var jObject41 = JObject.Parse(json31);
                                        var loadobj51 = JsonConvert.DeserializeObject<JObject>(jObject41.ToString());
                                        var content21 = new StringContent(loadobj51.ToString());
                                        content21.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                                        var responseupd1 = await client.PostAsync("/api/PatientAppointments/Patient_Appointment_Status_Update/", content21);
                                        var responseUpdateContent1 = await responseupd1.Content.ReadAsStringAsync();

                                        //$http.post(baseUrl + '/api/PatientAppointments/Patient_Appointment_Status_Update/', obj).success(function(data) 
                                    }
                                    else
                                    {

                                        FalseEligibility jobj = new FalseEligibility();
                                        jobj.eligibilityId= eligibility_Id;

                                        var json3 = JsonConvert.SerializeObject(jobj, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                                        var jObject4 = JObject.Parse(json3);
                                        var loadobj5 = JsonConvert.DeserializeObject<JObject>(jObject4.ToString());
                                        var content2 = new StringContent(loadobj5.ToString());
                                        content2.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                                        var responseCan = await client.PostAsync("/api/EligibilityCheck/CancelEligibilityEequest/", content2);
                                        var responseCancelContent = await responseCan.Content.ReadAsStringAsync();
                                    }
                                    //if(loadobj3!= null)
                                    //    {
                                    //        if (loadobj3.data != null)
                                    //        {
                                    //            var loadobj4 = JsonConvert.DeserializeObject<eligibilityCheck>(responseDetContent.ToString());
                                    //            var result = loadobj4.result;                                                 
                                    //            var eligibility_response = loadobj3.data;

                                    //               // var save_user_appointment_eligibility_logs($scope.Appointment_Id, $scope.user_id, $scope.eligibility_Id, $scope.eligibility_response, $scope.eligibility_response);
                                    //        }   
                                    //        else
                                    //        {
                                    //        //toastr.warning("Request for eligibility failed, appointment could not be created...", "warning");
                                    //        // $scope.cancel_eligibility($scope.eligibility_Id);
                                    //        var jobj = "{ \"eligibilityId\" : "+ eligibility_Id + " }";
                                    //        var json3 = JsonConvert.SerializeObject(jobj, Newtonsoft.Json.Formatting.None, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
                                    //        var jObject4 = JObject.Parse(json3);
                                    //        var loadobj4 = JsonConvert.DeserializeObject<JObject>(jObject.ToString());

                                    //        var content2 = new StringContent(loadobj4.ToString());
                                    //        content2.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                                    //        var responseCan = await client.PostAsync("/api/EligibilityCheck/CancelEligibilityEequest/" + eligibility_Id + "&facilityLicense=MF2007", content2);
                                    //        var responseCancelContent = await responseCan.Content.ReadAsStringAsync();
                                    //        }
                                    //    }
                                }
                            }
                        }
                        //Page.ClientScript.RegisterStartupScript(this.GetType(), "CallMyScopeFunction", "angular.element(document.getElementById('div1')).scope().bindAllData()", true);
                    }
                }
                catch (Exception ex)
                {
                    //if (Id != 0)
                    //{
                    //    List<DataParameter> param1 = new List<DataParameter>();
                    //    param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                    //    param1.Add(new DataParameter("@id", Id));
                    //    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", param1);
                    //}
                    //TraceException(ex);
                }
            }
        }
        private void OnElapsedTime(object source, ElapsedEventArgs e)
        {
            isJob1running = false;
            if (!isJob1running)
            {
                isJob1running = true;
                WriteToFile("Service started at " + DateTime.Now);

                try
                {
                    string Event_Code = "";
                   // string baseUrl = "";

                    
                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    Int64 Id = 0, Institution_Id, Patient_Id, Doctor_Id, APPOINTMENT_ID, User_Id;
                    string Emirates_Id, Clinician_Licence;

                    // to execute the service daily once at the day start(at 12AM)
                    var dateAndTime = DateTime.Now;
                    executedTime = dateAndTime.ToString("dd/MM/yyyy");

                    if (executedTime == "" || executedTime != lastexecutedTime)
                    {
                        try
                        {
                            // archiving mail and notification > 365 days
                            emailrepository.SendArchivedetails();
                            lastexecutedTime = executedTime;

                            IList<PasswordExpiry_AlertEventModel> PwdEmailList;

                            // pwd expiry notification to user ex. before 90 days, 60 days,...
                            Event_Code = "PASSWORD_EXPIRY";
                            PwdEmailList = alertrepository.AlertEvent_Get_PasswordExpiry_List();

                            foreach (PasswordExpiry_AlertEventModel modobj in PwdEmailList)
                            {
                                EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.UserId);
                                // send email & notification
                                AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.UserId, (long)modobj.Institution_Id, EmailList);
                            }

                            IList<TargetAchived_AlertEventModel> targetweekly;
                            // target achived weekly alerts
                            // execute once a day
                            Event_Code = "TARGET_WEEKLY";
                            targetweekly = alertrepository.AlertEvent_TargetAchievedWeekly_List();

                            foreach (TargetAchived_AlertEventModel modobj in targetweekly)
                            {
                                EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.UserId);
                                // send email & notification
                                AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.UserId, (long)modobj.Institution_Id, EmailList);
                            }

                            IList<LicenceExpiry_AlertEventModel> LincenseExpiry;
                            // license expiry reminder
                            Event_Code = "LICENCE_EXPIRY";
                            LincenseExpiry = alertrepository.AlertEvent_Get_LicenceExpiry_List();

                            foreach (LicenceExpiry_AlertEventModel modobj in LincenseExpiry)
                            {
                                EmailList = alertrepository.InstitutionCreateEvent((long)modobj.Institution_Id, modobj.HosAdmin_Id);
                                // send email & notification
                                AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.HosAdmin_Id, (long)modobj.Institution_Id, EmailList);
                            }

                            IList<PatientHealthDataModel> complist;
                            // target achived weekly alerts
                            // execute once a day
                            Event_Code = "";
                            complist = alertrepository.PatientHealthData_Compliance_List();

                            foreach (PatientHealthDataModel modobj in complist)
                            {
                                if (modobj.HighCount > 0)
                                    Event_Code = "COMP_HIGH";
                                else if (modobj.MediumCount > 0)
                                    Event_Code = "COMP_MEDIUM";
                                else if (modobj.LowCount > 0)
                                    Event_Code = "COMP_LOW";
                                if (Event_Code != "")
                                {
                                    EmailList = alertrepository.UserSpecificEmailList((long)modobj.Institution_Id, modobj.Patient_Id);
                                    // send email & notification
                                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, modobj.Patient_Id, (long)modobj.Institution_Id, EmailList);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            TraceException(ex);
                        }
                    }



                    // TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION
                    // Start
                    List<DataParameter> param = new List<DataParameter>();
                    param.Add(new DataParameter("@type", "Get_Mail"));
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION", param);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());
                            PatientHealthDataModel phm = new PatientHealthDataModel();
                            phm = userrepository.PatientHealthData_AlertNotification_List(Id);
                            if (phm != null)
                            {
                                if (phm.HighCount > 0)
                                    Event_Code = "DIAG_HIGH";
                                else if (phm.MediumCount > 0)
                                    Event_Code = "DIAG_MEDIUM";
                                else if (phm.LowCount > 0)
                                    Event_Code = "DIAG_LOW";

                                if (phm.HighCount > 0 || phm.MediumCount > 0 || phm.LowCount > 0)
                                {
                                    EmailList = AlertEventReturn.Diagnostic_Compliance_AlertEvent((long)Patient_Id, (long)Institution_Id);

                                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Id, (long)Institution_Id, EmailList);
                                }
                            }

                            {
                                Event_Code = "NEWDATA_CAPTURE";

                                EmailList = AlertEventReturn.NewDataCapturedEvent((long)Patient_Id, (long)Institution_Id);

                                AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Patient_Id, (long)Institution_Id, EmailList);

                                Event_Code = "TARGET_DAILY";
                                TargetAchived_AlertEventModel tarobj = new TargetAchived_AlertEventModel();
                                tarobj = AlertEventReturn.AlertEvent_TargetAchievedDaily_List((long)Institution_Id, (long)Patient_Id);

                                if (tarobj != null)
                                    AlertEventReturn.Generate_SMTPEmail_Notification(Event_Code, Patient_Id, (long)Institution_Id, EmailList);
                            }

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Update_Mail_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION", param1);
                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                                param1.Add(new DataParameter("@id", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_LIFESTYLEDATA_FOR_EMAIL_NOTIFICATION", param1);
                            }
                            TraceException(ex);
                        }
                    }
                    // End

                    // TBLPATIENT_APPOINTMENTS Creation
                    // Start

                    List<DataParameter> appoint_param = new List<DataParameter>();
                    appoint_param.Add(new DataParameter("@type", "Get_Mail"));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", appoint_param);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());
                            List<DataParameter> param_appointment = new List<DataParameter>();

                            param_appointment.Add(new DataParameter("@InstitutionId", Institution_Id));
                            dt = ClsDataBase.GetDataTable("MYCORTEX.ORGAPPOINTMENTLIST_VIEW", param_appointment);
                            if (Convert.ToBoolean(dt.Rows[0]["IS_DIRECTAPPOINTMENT"]) == true)
                            {
                                EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);
                                AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_CREATION", Id, (long)Institution_Id, EmailList);
                            }
                            else
                            {
                                EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);
                                AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_CREATION", Id, (long)Institution_Id, EmailList);
                                EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, "CC_CG");
                                AlertEventReturn.Generate_SMTPEmail_Notification("APPOINTMENT_APPROVAL", Id, (long)Institution_Id, EmailList);
                                // AlertEventReturn.Generate_SMTPEmail_Notification("APPOINTMENT_APPROVED", Id, (long)Institution_Id, EmailList);
                            }




                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Update_Mail_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);

                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                                param1.Add(new DataParameter("@id", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);
                            }
                            TraceException(ex);
                        }
                    }

                    List<DataParameter> appoint_aaproval_param = new List<DataParameter>();
                    appoint_aaproval_param.Add(new DataParameter("@type", "Get_Mail_Approval"));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", appoint_aaproval_param);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());
                            List<DataParameter> param_appointment = new List<DataParameter>();
                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, "CC_CG");

                            AlertEventReturn.Generate_SMTPEmail_Notification("APPOINTMENT_APPROVED", Id, (long)Institution_Id, EmailList);
                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Update_Mail_Notification_Approval"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);

                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@type", "Failed_Mail_Notification_approval"));
                                param1.Add(new DataParameter("@id", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_EMAIL_NOTIFICATION", param1);
                            }
                            TraceException(ex);
                        }
                    }
                    // End

                    // TBLPATIENT_APPOINTMENTS Cancel
                    // Start

                    List<DataParameter> appoint_can_param = new List<DataParameter>();
                    appoint_can_param.Add(new DataParameter("@type", "Get_Mail"));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", appoint_can_param);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());

                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);

                            AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_CANCEL", Id, (long)Institution_Id, EmailList);

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Update_Mail_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", param1);

                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@type", "Failed_Mail_Notification"));
                                param1.Add(new DataParameter("@id", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_FOR_CANCEL_EMAIL_NOTIFICATION]", param1);
                            }
                            TraceException(ex);
                        }
                    }

                    // End

                    //APPointments RESET by System
                    // Start

                    try
                    {
                        ClsDataBase.GetDataTable("[MYCORTEX].RESET_APPOINTMENTS_BY_SYSTEM");
                    }
                    catch (Exception ex)
                    {
                        TraceException(ex);
                    }

                    //END

                    // Deactivate Past Doctor Shift Details
                    // Start
                    try
                    {
                        ClsDataBase.GetDataTable("[MYCORTEX].[DEACTIVATE_PAST_DOCTORSHIFT]");
                    }
                    catch (Exception ex)
                    {
                        TraceException(ex);
                    }

                    // END

                    // TBLAPPOINTMENT_PAYMENT_STATUS FOR SUCCESS
                    // Start

                    List<DataParameter> paym_succ = new List<DataParameter>();
                    paym_succ.Add(new DataParameter("@type", "Get_Payment_Success_Mail"));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", paym_succ);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());

                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);

                            AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINT_PAYMENT_SUCCESS", Id, (long)Institution_Id, EmailList);

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Update_Payment_Success_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);

                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@type", "Failed_Payment_Success_Notification"));
                                param1.Add(new DataParameter("@id", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);
                            }
                            TraceException(ex);
                        }
                    }

                    // End

                    // TBLAPPOINTMENT_PAYMENT_STATUS FOR FAILURE
                    // Start

                    List<DataParameter> paym_fail = new List<DataParameter>();
                    paym_fail.Add(new DataParameter("@type", "Get_Payment_Failure_Mail"));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", paym_fail);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Patient_Id = Convert.ToInt64(dt.Rows[0]["PATIENT_ID"].ToString());

                            EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)Id, (long)Institution_Id, null);

                            AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINT_PAYMENT_FAILURE", Id, (long)Institution_Id, EmailList);

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@type", "Update_Payment_Failure_Notification"));
                            param1.Add(new DataParameter("@id", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);

                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@type", "Failed_Payment_Failure_Notification"));
                                param1.Add(new DataParameter("@id", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLAPPOINTMENT_PAYMENT_STATUS_FOR_EMAIL_NOTIFICATION]", param1);
                            }
                            TraceException(ex);
                        }
                    }

                    // End

                    // Appointment Reminder Notification for Patient and Doctor
                    // Start

                    List<DataParameter> appoint_rem = new List<DataParameter>();
                    appoint_rem.Add(new DataParameter("@TYPE", "Get_Mail"));
                    dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", appoint_rem);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                Id = Convert.ToInt64(dt.Rows[i]["id"].ToString());
                                Institution_Id = Convert.ToInt64(dt.Rows[i]["INSTITUTION_ID"].ToString());
                                Patient_Id = Convert.ToInt64(dt.Rows[i]["PATIENT_ID"].ToString());
                                APPOINTMENT_ID = Convert.ToInt64(dt.Rows[i]["APPOINTMENT_ID"].ToString());

                                EmailList = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)APPOINTMENT_ID, (long)Institution_Id, null);

                                IList<EmailListModel> EmailList2 = AlertEventReturn.Patient_AppointmentCreation_AlertEvent((long)APPOINTMENT_ID, (long)Institution_Id, "Doctor_Reminder");

                                AlertEventReturn.Generate_SMTPEmail_Notification("PAT_APPOINTMENT_REMINDER", APPOINTMENT_ID, (long)Institution_Id, EmailList);

                                AlertEventReturn.Generate_SMTPEmail_Notification("DOCTOR_APPOINTMENT_REMINDER", APPOINTMENT_ID, (long)Institution_Id, EmailList2);

                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@TYPE", "Update_Mail_Notification"));
                                param1.Add(new DataParameter("@ID", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                            }
                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@TYPE", "Failed_Mail_Notification"));
                                param1.Add(new DataParameter("@ID", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_TBLPATIENT_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_APPOINTMENTS_REMINDER_EMAIL_NOTIFICATION]", param1);
                            }
                            TraceException(ex);
                        }
                    }

                    EligibilityCheck(); 

                    // End

                }
                catch (Exception ex)
                {
                    WriteToFile(new String('-', 50));
                    WriteToFile(ex.StackTrace);
                    WriteToFile(new String('-', 50));
                }
                isJob1running = false;
            }
        }

        private void OnElapsedTime2(object source, ElapsedEventArgs e)
        {
            if (!isJob2running)
            {
                isJob2running = true;
                WriteToFile("Service started at " + DateTime.Now);

                // Doctor Shift Expiry Notification to Doctor and Admin
                // Start

                try
                {
                    string Event_Code = "";

                    AlertEvents AlertEventReturn = new AlertEvents();
                    IList<EmailListModel> EmailList;
                    Int64 Id = 0, Institution_Id, Patient_Id, Doctor_Id, APPOINTMENT_ID;

                    List<DataParameter> appoint_shi = new List<DataParameter>();
                    appoint_shi.Add(new DataParameter("@TYPE", "Get_Mail"));
                    DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_SHIFT_FOR_EMAIL_NOTIFICATION]", appoint_shi);
                    if (dt.Rows.Count > 0)
                    {
                        try
                        {
                            Id = Convert.ToInt64(dt.Rows[0]["id"].ToString());
                            Institution_Id = Convert.ToInt64(dt.Rows[0]["INSTITUTION_ID"].ToString());
                            Doctor_Id = Convert.ToInt64(dt.Rows[0]["DOCTOR_ID"].ToString());

                            EmailList = AlertEventReturn.DoctorShift_AlertEvent((long)Id, (long)Institution_Id, "DOCTOR");

                            IList<EmailListModel> EmailList2 = AlertEventReturn.DoctorShift_AlertEvent((long)Id, (long)Institution_Id, "HA");

                            AlertEventReturn.Generate_SMTPEmail_Notification("DOCTOR_SHIFT_EXPIRY", Id, (long)Institution_Id, EmailList);

                            AlertEventReturn.Generate_SMTPEmail_Notification("NOTIFY_ADMIN_DOCTOR_SHIFT_EXPIRY", Id, (long)Institution_Id, EmailList2);

                            List<DataParameter> param1 = new List<DataParameter>();
                            param1.Add(new DataParameter("@TYPE", "Update_Mail"));
                            param1.Add(new DataParameter("@ID", Id));
                            dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_SHIFT_FOR_EMAIL_NOTIFICATION]", param1);
                        }
                        catch (Exception ex)
                        {
                            if (Id != 0)
                            {
                                List<DataParameter> param1 = new List<DataParameter>();
                                param1.Add(new DataParameter("@TYPE", "Failed_Mail"));
                                param1.Add(new DataParameter("@ID", Id));
                                dt = ClsDataBase.GetDataTable("[MYCORTEX].[GET_UPDATE_DOCTOR_SHIFT_FOR_EMAIL_NOTIFICATION]", param1);
                            }
                            TraceException(ex);
                        }
                    }

                    // End
                }
                catch (Exception ex)
                {
                    TraceException(ex);
                }
                isJob2running = false;
            }
        }

        private void OnElapsedTime3(object source, ElapsedEventArgs e)
        {
            if (!isJob3running)
            {
                isJob3running = true;
                WriteToFile("Service3 started at " + DateTime.Now);
                // PushNotificationApiManager.SendConfiguraionSettingNotification();
                isJob3running = false;
            }
        }

        public void TraceException(Exception ex)
        {
            WriteToFile(new String('-', 50));
            WriteToFile(ex.StackTrace);
            WriteToFile(new String('-', 50));
        }

        protected override void OnStop()
        {
            WriteToFile("Service is stopped at " + DateTime.Now);
        }
        public void WriteToFile(string Message)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "\\Logs";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string filepath = AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ServiceLog_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
            if (!System.IO.File.Exists(filepath))
            {
                // Create a file to write to.   
                using (StreamWriter sw = System.IO.File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
            else
            {
                using (StreamWriter sw = System.IO.File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
        }       
    }
}