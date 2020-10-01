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
        public string Email_Subject { get; set; }
        public int EMAIL_STATUS { get; set; }
        public string EMAIL_ERROR_REASON { get; set; }
        public int flag { get; set; }
        public string UserName { get; set; }    
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public string EmailId { get; set; }
        public string UserType { get; set; }
        public DateTime Send_Date { get; set; }
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
    }
}