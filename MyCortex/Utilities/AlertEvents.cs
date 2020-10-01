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
using log4net;
using MyCortex.Repositories.Template;
using MyCortex.Template.Models;

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
        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
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
        public void SendAlert_Email_Notification(AlertEventResultModel alertList, EmailConfigurationModel emailModel, long Institution_Id, int emailType)
        {
            foreach (AlertEventModel alert in alertList.AlertEventTemplateList)
            {
                IList<SendEmailModel> sendEmailModel = new List<SendEmailModel>();
                SendEmailModel model = new SendEmailModel();
                model.Id = 0;
                model.Institution_Id = Institution_Id;
                model.Template_Id = alert.Template_Id;
                model.UserId = alertList.AlertEventEmailList[0].UserId;
                model.Email_Body = alert.TempBody;
                model.Email_Subject = alert.TempSubject;
                model.Created_By = alertList.AlertEventEmailList[0].UserId;
                sendEmailModel = sendemailrepository.SendEmail_AddEdit(model);

                if (alert.TemplateType_Id == 1)
                {
                    if (alert.FromEmail_Id != null || emailModel.Sender_Email_Id!=null)
                    {
                        if (emailType == 1)
                        {
                            SendGridMessage msg = SendGridApiManager.ComposeMailMessage(
                                                    alert.FromEmail_Id,
                                                    alert.FromEmail_Id,
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
                            var res = mail.SendComposedSMTPEmail(emailModel, alert, alertList.AlertEventEmailList, sendEmailModel[0].Id);                           

                        }

                    }
                }
                // sent only TO email Id users
                else if(alert.TemplateType_Id==2)
                {
                    PushNotificationMessage message = new PushNotificationMessage();
                    message.Title = alert.TempSubject;
                    message.Message = alert.TempBody;

                    PushNotificationApiManager.sendNotification(message, sendEmailModel[0].Id, alert.UserId, alert.TemplateFor);
                }
            }
        }
        
        public int Generate_Email_Notification(string EventCode, long EntityId, long Institution_Id, IList<EmailListModel> EmailList)
        {
            try
            {
                IList<AlertEventModel> AlertEventTemplate;
                AlertEventTemplate = AlertEvent_GenerateTemplate(EntityId, Institution_Id, EventCode);
                AlertEventResultModel AlertEventResultList = new AlertEventResultModel();
                AlertEventResultList.AlertEventTemplateList = AlertEventTemplate;
                AlertEventResultList.AlertEventEmailList = EmailList;

                SendAlert_Email_Notification(AlertEventResultList, null, Institution_Id, (int)EmailTypeVal.SendGrid);
                return 1;
            }
            catch(Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
            }
        }

        public int Generate_SMTPEmail_Notification(string EventCode, long EntityId, long Institution_Id, IList<EmailListModel> EmailList)
        {
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


                SendAlert_Email_Notification(AlertEventResultList, emailModel, Institution_Id, (int)EmailTypeVal.SMTP);
                return 1;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
                return 0;
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
        public IList<EmailListModel> Patient_AppointmentCreation_AlertEvent(long Entity_Id, long Institution_Id)
        {
            IList<EmailListModel> EmailListModel;
            EmailListModel = repository.Patient_AppointmentCreation_AlertEvent(Institution_Id, Entity_Id);
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