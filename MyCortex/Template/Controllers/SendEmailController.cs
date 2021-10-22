﻿using log4net;
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

namespace MyCortex.Template.Controllers
{

    [Authorize]
    [CheckSessionOutFilter]
    public class SendEmailController : ApiController
    {
        static readonly ISendEmailRepository repository = new SendEmailRepository();

        static readonly IEmailConfigurationRepository emailrepository = new EmailConfigurationRepository();
        static readonly IUserRepository userrepository = new UserRepository();

        private readonly ILog _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        
        /// <summary>
        /// Email User Type name List
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IEnumerable<SendEmail_UsertypeModal> Email_UserTypeList()
        {
            IEnumerable<SendEmail_UsertypeModal> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Email_UserTypeList();
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            IList<SendEmailTemplateModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Email_TemplateTypeList(InstitutionId, TemplateType_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
            IList<SendEmailModel> model;
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                model = repository.Get_SendEmail_UserList(UserTypeId, Institution_Id, PATIENTNO, INSURANCEID, GENDER_ID, NATIONALITY_ID, ETHINICGROUP_ID, MOBILE_NO, HOME_PHONENO, EMAILID, MARITALSTATUS_ID, COUNTRY_ID, STATE_ID, CITY_ID, BLOODGROUP_ID, Group_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
                DataEncryption EncryptPassword = new DataEncryption();
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
                            el.EmailId = EncryptPassword.Decrypt(ModelData[0].EmailId);
                            el.EmailType_Flag = 1;
                            elList.Add(el);

                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendComposedSMTPEmail(emailModel, alert, elList, ModelData[0].Id);

                        }
                    }
                    else
                    {
                        PushNotificationMessage message = new PushNotificationMessage();
                        message.Title = itemData.Email_Subject;
                        message.Message = itemData.Email_Body;

                        PushNotificationApiManager.sendNotification(message, ModelData[0].Id, itemData.Created_By, 4);
                    }
                }

                var msgtype = "Send Email";
                if (Emailobj[0].TemplateType_Id == 2)
                {
                    msgtype = "Send Notification";
                }
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
                _logger.Error(ex.Message, ex);
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
            try
            {
                if (_logger.IsInfoEnabled)
                    _logger.Info("Controller");
                SendEmailModel model = new SendEmailModel();
                model = repository.GenerateTemplate(Id, Template_Id, Institution_Id, TemplateType_Id);
                return model;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
                foreach (SendEmailModel itemData in Emailobj)
                {
                    SendEmailModel model1 = new SendEmailModel();
                    model1 = repository.GenerateTemplate(itemData.UserId, itemData.Template_Id, itemData.Institution_Id, itemData.TemplateType_Id);
                    itemData.Email_Subject = model1.Email_Subject;
                    itemData.Email_Body = model1.Email_Body;
                }

                var msgtype = "Send Email";
                if (Emailobj[0].TemplateType_Id == 2)
                {
                    msgtype = "Send Notification";
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
                _logger.Error(ex.Message, ex);
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
                DataEncryption EncryptPassword = new DataEncryption();
                Institution_Id = long.Parse(HttpContext.Current.Session["InstitutionId"].ToString());
                EmailConfigurationModel emailModel = new EmailConfigurationModel();
                emailModel = emailrepository.EmailConfiguration_View(Institution_Id);

                ModelData = repository.SendEmail_AddEdit(Emailobj);

                var msgtype = "Send Email";
                if (Emailobj.TemplateType_Id == 2)
                {
                    msgtype = "Send Notification";
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
                            SendGridMessage msg = SendGridApiManager.ComposeSendGridMessage(emailModel.UserName, emailModel.Sender_Email_Id, Emailobj.Email_Subject, Emailobj.Email_Body, Emailobj.UserName, EncryptPassword.Decrypt(ModelData[0].EmailId));

                            SendGridApiManager mail = new SendGridApiManager();
                            var res = mail.SendEmailAsync(msg, ModelData[0].Id);
                        }
                    }
                    else
                    {
                        PushNotificationMessage message = new PushNotificationMessage();
                        message.Title = Emailobj.Email_Subject;
                        message.Message = Emailobj.Email_Body;

                        PushNotificationApiManager.sendNotification(message, ModelData[0].Id, Emailobj.UserId, 4);
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);                
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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
                _logger.Error(ex.Message, ex);
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