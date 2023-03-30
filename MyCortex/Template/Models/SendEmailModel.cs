using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Template.Models
{
    public class SendEmailModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public long Template_Id { get; set; }
        public long TemplateType_Id { get; set; }
        public long UserId { get; set; }
        public string Email_Body { get; set; }
        public string Email_Body1 { get; set; } // this is for password tag convert to *       
        public string Email_Subject { get; set; }
        public int EMAIL_STATUS { get; set; }
        public string EMAIL_ERROR_REASON { get; set; }
        public int flag { get; set; }
        public string UserName { get; set; }    
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public string EmailId { get; set; }
        public string MobileNO { get; set; }
        public string UserType { get; set; }
        public DateTime Send_Date { get; set; }
        public string SMSSource_Id { get; set; }
        public string SMSUserName { get; set; }
        public string SMSApiId { get; set; }
        public string ResponseId { get; set; }
    }

    public class SendEmailReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<SendEmailModel> SendEmail { get; set; }
        public string Error_Code { get; set; }
    }

    public class SendEmail_UsertypeModal
    {
        public long Id { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
    }
    public class SendEmailTemplateModel
    {
        public long Id { get; set; }
        public string TemplateName { get; set; }
        public string EmailTemplate { get; set; }
        public int IsActive { get; set; }
    }
    public class NotifictaionUserFCM
    {
        public long User_Id { get; set; }
        public string FCMToken { get; set; }
        public string DeviceType { get; set; }
        public string SiteUrl { get; set; }
        public int flag { get; set; }
        //public Guid Login_Session_Id { get; set; }
    }

    public class FCMUserDetails
    {
        public long User_Id { get; set; }
        public string Settings { get; set; }
        public long Institution_Id { get; set; }
        public string DeviceType { get; set; }
        public string FCMToken { get; set; }
        public string SiteUrl { get; set; }
    }
}