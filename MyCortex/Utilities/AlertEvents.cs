using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Notification.Models;
using MyCortex.Repositories;
using MyCortex.Repositories.EmailAlert;
using MyCortex.Admin.Models;
using MyCortex.Repositories.Admin;
using SendGrid.Helpers.Mail;
using MyCortex.Email.SendGrid;
using MyCortex.Notification.Firebase;
  
using MyCortex.Repositories.Template;
using MyCortex.Template.Models;
using System.Text.RegularExpressions;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using static MyCortex.Notification.Firebase.PushNotificationApiManager;

namespace MyCortex.Notification
{
    public class AlertEvents
    {
        public enum EmailTypeVal
        {
            SendGrid = 1,
            SMTP= 2
        }

        static readonly ISendEmailRepository sendemailrepository = new SendEmailRepository();
        static readonly IAlertEventRepository repository = new AlertEventRepository();
        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
 

        private MyCortexLogger _MyLogger = new MyCortexLogger();
       string 
            _AppLogger = string.Empty, _AppMethod = string.Empty;
        public IList<AlertEventModel> AlertEvent_GenerateTemplate(long Entity_Id, long Institution_Id, string Event_Code)
        {
            IList<AlertEventModel> EventTemplatemodel;
            EventTemplatemodel = repository.AlertEvent_GenerateTemplate(Entity_Id, Event_Code, Institution_Id);
            //Get FromEmailId
            EmailConfigurationModel emailModel = new EmailConfigurationModel();
            emailModel = emailrepository.EmailConfiguration_View((long)Institution_Id);
            foreach (AlertEventModel itemData in EventTemplatemodel)
            {
                itemData.FromEmail_Id = emailModel.Sender_Email_Id;
            }
            return EventTemplatemodel;
        }
        public void SendAlert_Email_Notification(AlertEventResultModel alertList, EmailConfigurationModel emailModel, long Institution_Id, int emailType, long EntityId, string EventCode)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            foreach (AlertEventModel alert in alertList.AlertEventTemplateList)
            {
                if (alertList.AlertEventEmailList != null)
                {
                    //foreach (EmailListModel email in alertList.AlertEventEmailList)
                    for (int i = 0; i < alertList.AlertEventEmailList.Count; i++)
                    {
                        EmailListModel email = alertList.AlertEventEmailList[i];
                        alert.TempBody = alert.TempBody.Replace("&nbsp;", " ").Replace("\n\n", Environment.NewLine);
                        IList<SendEmailModel> sendEmailModel = new List<SendEmailModel>();
                        SendEmailModel model = new SendEmailModel();
                        model.Id = 0;
                        model.Institution_Id = Institution_Id;
                        model.Template_Id = alert.Template_Id;
                        model.UserId = alertList.AlertEventEmailList[i].UserId;
                        model.Email_Body = alert.TempBody;
                        model.Email_Subject = alert.TempSubject;
                        model.Created_By = alertList.AlertEventEmailList[i].UserId;
                        sendEmailModel = sendemailrepository.SendEmail_AddEdit(model);
                        if (alert.TemplateType_Id == 1)  // 1 for Email
                        {
                            if (alert.FromEmail_Id != null || emailModel.Sender_Email_Id != null)
                            {
                                /*_MyLogger.Exceptions("INFO", _AppLogger, "Email: " + alert.TempBody, null, _AppMethod);*/
                                if (emailType == 1)
                                {
                                    SendGridMessage msg = SendGridApiManager.ComposeMailMessage(
                                                            emailModel.Sender_Email_Id,
                                                            emailModel.Sender_Email_Id,
                                                            alert.TempSubject,
                                                            alert.TempBody,
                                                            alertList.AlertEventEmailList
                                                            );

                                    SendGridApiManager mail = new SendGridApiManager();
                                    var res = mail.SendEmailAsync(msg, sendEmailModel[0].Id);
                                }
                                else
                                {
                                    SendGridApiManager mail = new SendGridApiManager();
                                    IList<EmailListModel> em = new List<EmailListModel>();
                                    em.Add(email);
                                    var res = mail.SendComposedSMTPEmail(emailModel, alert, em, sendEmailModel[0].Id, EventCode, EntityId);

                                }

                            }
                        }
                        // sent only TO email Id users
                        else if (alert.TemplateType_Id == 2) // 2 for APP and Web Notification
                        {
                            PushNotificationMessage message = new PushNotificationMessage();
                            message.Title = alert.TempSubject;
                            alert.TempBody = alert.TempBody.Replace("<br>", "");
                            alert.TempBody = alert.TempBody.Replace("<br />", "");
                            alert.TempBody = alert.TempBody.Replace("<p>", "");
                            alert.TempBody = alert.TempBody.Replace("</p>", "");
                            alert.TempBody = alert.TempBody.Replace("&nbsp;", " ");
                            alert.TempBody = alert.TempBody.Replace("\n", " ");
                            message.Message = alert.TempBody;
                            /*_MyLogger.Exceptions("INFO", _AppLogger, "Notification: Title: " + message.Title + "Message: " + message.Message + "UserId: " + email.UserId, null, _AppMethod);*/
                            PushNotificationApiManager.sendNotification(message, sendEmailModel[0].Id, email.UserId, alert.TemplateFor);
                        }
                        else if (alert.TemplateType_Id == 3)  // 3 for SMS
                        {
                            //string[] EncryptMbNO; string[] SMSSplMbNo;
                            string
                                SMSPrefixMbNO = string.Empty, SMSSuffixMbNO = string.Empty, SMSMbNO = string.Empty, SMSSubject = string.Empty,
                                SMSBody = string.Empty, SMSURL = string.Empty, SMSApiId = string.Empty, SMSUserName = string.Empty, SMSSource = string.Empty;
                            //bool containsTildeSpecialCharacter, containsPlusSpecialCharacter = false;
                            //Regex rgx = new Regex("[^A-Za-z0-9]");
                            if (alertList.AlertEventEmailList[i].mobile_no != null)
                            {
                                string MobileNo = alertList.AlertEventEmailList[i].mobile_no.Replace(@"~", @"").Replace(@"+", @"");
                                //containsTildeSpecialCharacter = rgx.IsMatch(MobileNO);
                                //EncryptMbNO = MobileNO.Split('~');

                                //if (containsTildeSpecialCharacter)
                                //{
                                //    SMSPrefixMbNO = EncryptMbNO[0];
                                //    SMSSuffixMbNO = EncryptMbNO[1];
                                //    SMSMbNO = SMSPrefixMbNO + SMSSuffixMbNO;
                                //    containsPlusSpecialCharacter = rgx.IsMatch(SMSPrefixMbNO);
                                //}
                                //if (containsPlusSpecialCharacter)
                                //{
                                //    SMSSplMbNo = SMSPrefixMbNO.Split('+');
                                //    SMSMbNO = SMSSplMbNo[1] + SMSSuffixMbNO;
                                //}
                                //else
                                //{
                                //    SMSMbNO = EncryptMbNO[0];
                                //}
                                SMSMbNO = MobileNo;
                                SMSSubject = alert.TempSubject;
                                SMSBody = alert.TempBody;
                                //SMSApiId = "Kv2n09u8";
                                //SMSUserName = "MyHealth";
                                //SMSSource = "Medspero";
                                SMSApiId = alertList.AlertEventEmailList[i].SMSApiId;
                                SMSUserName = alertList.AlertEventEmailList[i].SMSUserName;
                                SMSSource = alertList.AlertEventEmailList[i].SMSSourceId;

                                SMSBody = SMSBody.Replace("<br>", "");
                                SMSBody = SMSBody.Replace("<br />", "");
                                SMSBody = SMSBody.Replace("<p>", "");
                                SMSBody = SMSBody.Replace("</p>", "");
                                SMSBody = SMSBody.Replace("&nbsp;", " ");
                                SMSBody = SMSBody.Replace("\n", " ");

                                SMSURL = "https://txt.speroinfotech.ae/API/SendSMS?" + "username=" + SMSUserName + "&apiId=" + SMSApiId + "&json=True&destination=" + SMSMbNO + "&source=" + SMSSource + "&text=" + SMSBody;

                                /*_MyLogger.Exceptions("INFO", _AppLogger, SMSURL, null, _AppMethod);*/
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
                                    //sendemailrepository.SendEmail_Update(EntityId, "", 1, "");
                                    var dataObj = smsResponse.Content.ReadAsStringAsync().Result.ToString();
                                    var dataObj1 = JsonConvert.DeserializeObject<SMSResponseData>(dataObj);

                                    model.Id = sendEmailModel[0].Id;
                                    model.Institution_Id = Institution_Id;
                                    model.Template_Id = alert.Template_Id;
                                    model.UserId = alertList.AlertEventEmailList[i].UserId;
                                    model.Email_Body = alert.TempBody;
                                    model.Email_Subject = alert.TempSubject;
                                    model.Created_By = alertList.AlertEventEmailList[i].UserId;
                                    model.ResponseId = dataObj1.Id;
                                    sendEmailModel = sendemailrepository.SendEmail_AddEdit(model);

                                    sendemailrepository.SendEmail_Update(sendEmailModel[0].Id, "", 1, "");
                                }
                                else
                                {
                                    Console.WriteLine("{0} ({1})", (int)smsResponse.StatusCode, smsResponse.ReasonPhrase);
                                    //sendemailrepository.SendEmail_Update(EntityId, smsResponse.ReasonPhrase, 2, "");
                                    sendemailrepository.SendEmail_Update(sendEmailModel[0].Id, smsResponse.ReasonPhrase, 2, "");
                                }

                                //Make any other calls using HttpClient here.

                                //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                                client.Dispose();
                            }
                        }
                    }
                }
            }
        }
        
        public int Generate_Email_Notification(string EventCode, long EntityId, long Institution_Id, IList<EmailListModel> EmailList)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<AlertEventModel> AlertEventTemplate;
                AlertEventTemplate = AlertEvent_GenerateTemplate(EntityId, Institution_Id, EventCode);
                AlertEventResultModel AlertEventResultList = new AlertEventResultModel();
                AlertEventResultList.AlertEventTemplateList = AlertEventTemplate;
                AlertEventResultList.AlertEventEmailList = EmailList;

                SendAlert_Email_Notification(AlertEventResultList, null, Institution_Id, (int)EmailTypeVal.SendGrid, EntityId, EventCode);
                return 1;
            }
            catch(Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }

        public int Generate_SMTPEmail_Notification(string EventCode, long EntityId, long Institution_Id, IList<EmailListModel> EmailList)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<AlertEventModel> EventTemplatemodel;
                
                EventTemplatemodel = repository.AlertEvent_GenerateTemplate(EntityId, EventCode, Institution_Id);
                //Get FromEmailId
                EmailConfigurationModel emailModel = new EmailConfigurationModel();
                emailModel = emailrepository.EmailConfiguration_View((long)Institution_Id);

                AlertEventResultModel AlertEventResultList = new AlertEventResultModel();
                AlertEventResultList.AlertEventTemplateList = EventTemplatemodel;
                AlertEventResultList.AlertEventEmailList = EmailList;


                SendAlert_Email_Notification(AlertEventResultList, emailModel, Institution_Id, (int)EmailTypeVal.SMTP, EntityId, EventCode);
                return 1;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }

        public int Generate_SMTPEmail_Notification_For_ChangePwd(string url, long EntityId, long Institution_Id, IList<EmailListModel> EmailList)
        {
             _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            try
            {
                IList<AlertEventModel> EventTemplatemodel = new List<AlertEventModel>();
                var AlertModel = new AlertEventModel();
                AlertModel.TempBody = url;
                AlertModel.TempSubject = "Change Password";
                AlertModel.TemplateType_Id = 1;
                AlertModel.Template_Id = -1;
                AlertModel.TemplateFor = 1; // 1 FOR Email
                AlertModel.UserId = EntityId;
                AlertModel.Institution_Id = Institution_Id;
                EventTemplatemodel.Add(AlertModel);

                //Get FromEmailId
                EmailConfigurationModel emailModel = new EmailConfigurationModel();
                emailModel = emailrepository.EmailConfiguration_View((long)Institution_Id);

                AlertEventResultModel AlertEventResultList = new AlertEventResultModel();
                AlertEventResultList.AlertEventTemplateList = EventTemplatemodel;
                AlertEventResultList.AlertEventEmailList = EmailList;


                SendAlert_Email_Notification_For_ChangePwd(AlertEventResultList, emailModel, Institution_Id, (int)EmailTypeVal.SMTP);
                return 1;
            }
            catch (Exception ex)
            {
              _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return 0;
            }
        }
        public void SendAlert_Email_Notification_For_ChangePwd(AlertEventResultModel alertList, EmailConfigurationModel emailModel, long Institution_Id, int emailType)
        {
            foreach (AlertEventModel alert in alertList.AlertEventTemplateList)
            {
                SendEmailModel model = new SendEmailModel();
                model.Id = 0;
                model.Institution_Id = Institution_Id;
                model.Template_Id = alert.Template_Id;
                model.UserId = alertList.AlertEventEmailList[0].UserId;
                model.Email_Body = alert.TempBody;
                model.Email_Subject = alert.TempSubject;
                model.Created_By = alertList.AlertEventEmailList[0].UserId;

                if (alert.TemplateType_Id == 1)
                {
                    if (alert.FromEmail_Id != null || emailModel.Sender_Email_Id != null)
                    {
                        if (emailType == 2)
                        {
                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendComposedSMTPEmail_For_ChangePwd(emailModel, alert, alertList.AlertEventEmailList);

                        }

                    }
                }
            }
        }

        public IList<EmailListModel> UserCreateEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.UserCreateEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> InstitutionCreateEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.InstitutionCreateEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> InstitutionEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.InstitutionEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> ClinicianNoteEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.ClinicianNoteEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }

        public IList<EmailListModel> Diagnostic_Compliance_AlertEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.Diagnostic_Compliance_AlertEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }

        public IList<EmailListModel> NewDataCapturedEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.NewDataCapturedEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> Patient_MoreInfo_AlertEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.Patient_MoreInfo_AlertEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }

        public IList<EmailListModel> Patient_SignUp_HosAdmin_AlertEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.Patient_SignUp_HosAdmin_AlertEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> Patient_AppointmentCreation_AlertEvent(long Entity_Id, long Institution_Id,string CGtype=null)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.Patient_AppointmentCreation_AlertEvent(Institution_Id, Entity_Id, CGtype);
            return EmailListModel;
        }
        public IList<EmailListModel> DoctorShift_AlertEvent(long Entity_Id, long Institution_Id, string CGtype = null)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.DoctorShift_AlertEvent(Institution_Id, Entity_Id, CGtype);
            return EmailListModel;
        }

        public IList<EmailListModel> Patient_Appointment_Cancel_AlertEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.Patient_Appointment_Cancel_AlertEvent(Institution_Id, Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> CG_Assign_AlertEvent(long Entity_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.CG_Assign_AlertEvent(Entity_Id);
            return EmailListModel;
        }
        public IList<EmailListModel> AppointmentRemainder_ForDoctor(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.AppointmentRemainder_ForDoctor(Entity_Id, Institution_Id);
            return EmailListModel;
        }
        public IList<Appointment_AlertEventModel> Get_AlertSchedule_List(long Entity_Id, long Institution_Id)
        {
            IList<Appointment_AlertEventModel> EmailListModel;
            EmailListModel = repository.Get_AlertSchedule_List();
            return EmailListModel;
        }
        public IList<UserLimit_AlertEventModel> AlertEvent_Get_UserLimit_List(long Institution_Id, long UserId)
        {
            IList<UserLimit_AlertEventModel> ReturnModel;
            ReturnModel = repository.AlertEvent_Get_UserLimit_List(Institution_Id, UserId);
            return ReturnModel;
        }

        public IList<EmailListModel> UserLimit_EmailList(long Institution_Id)
        {
            IList<EmailListModel> ReturnModel;
            ReturnModel = repository.UserLimit_EmailList(Institution_Id);
            return ReturnModel;
        }
        public TargetAchived_AlertEventModel AlertEvent_TargetAchievedDaily_List(long Institution_Id, long UserId)
        {
            TargetAchived_AlertEventModel ReturnModel;
            ReturnModel = repository.AlertEvent_TargetAchievedDaily_List(Institution_Id, UserId);
            return ReturnModel;
        }
    }
}