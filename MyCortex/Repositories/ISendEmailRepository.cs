using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Template.Models;
using MyCortex.Admin.Models;
using MyCortex.Notification.Model;

namespace MyCortex.Repositories
{
    interface ISendEmailRepository
    {
        IList<SendEmail_UsertypeModal> Email_UserTypeList();
        IList<SendEmailTemplateModel> Email_TemplateTypeList(long InstitutionId, long TemplateType_Id);
        IList<SendEmailModel> Get_SendEmail_UserList(string UserTypeId, long Institution_Id, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id);
        SendEmailModel GenerateTemplate(long Id, long Template_Id, long Institution_Id, long TemplateType_Id);
        IList<SendEmailModel> SendEmail_AddEdit(SendEmailModel obj);
        IList<SendEmailModel> SendEmail_ResendListing(SendEmailModel obj);
        IList<EmailHistoryListModel> EmailHistory_List(long? Id, DateTime? Period_From, DateTime? Period_To, int? Email_Stauts, string PATIENTNO, string INSURANCEID, long? GENDER_ID, long? NATIONALITY_ID, long? ETHINICGROUP_ID, string MOBILE_NO, string HOME_PHONENO, string EMAILID, long? MARITALSTATUS_ID, long? COUNTRY_ID, long? STATE_ID, long? CITY_ID, long? BLOODGROUP_ID, string Group_Id, int? IsActive, long? INSTITUTION_ID, long TemplateType_Id, Guid Login_Session_Id);
        void SendEmail_Update(long Id, string Error_Reason, int Email_Status, string Sender_MessageId);
        NotifictaionUserFCM UpdateUser_FCMTocken(NotifictaionUserFCM objDetail);
        NotifictaionUserFCM DeleteUser_FCMTocken(NotifictaionUserFCM objDetail);
        List<NotifictaionUserFCM> UserFCMToken_Get_List(long User_Id);
        UserNotificationListModel User_get_NotificationList(long User_Id, Guid Login_Session_Id);
        UserNotificationListModel ClearNotification_Update (long User_Id);
        UserNotificationListModel CountNotification_Update(long User_Id);
        UserNotificationModel Notification_Update(long SendEmail_Id, Guid Login_Session_Id);
        void SendEmail_DeliveryStatus(string StatusEvent, string Sender_MessageId, string errorReason);
        IList<SendEmailModel> SendArchivedetails();
    }
}