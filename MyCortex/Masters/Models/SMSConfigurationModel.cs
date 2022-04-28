using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Admin.Models
{
    public class SMSConfigurationModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Insitution_Name { get; set; }
        public string Source_Id { get; set; }
        public string UserName { get; set; }
        public string ApiId { get; set; }
        public int Created_By { get; set; }
    
    }
    public class SendSMSModel
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
        public string MobileNO { get; set; }
        public string UserType { get; set; }
        public DateTime Send_Date { get; set; }
        public string SMSSource_Id { get; set; }
        public string SMSUserName { get; set; }
        public string SMSApiId { get; set; }
        public string ResponseId { get; set; }
    }

    public class CheckSMSConfiguration
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string MobileNo { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public int Created_By { get; set; }
        public string SMSApiId { get; set; }
        public string SMSUserName { get; set; }
        public string SMSSource { get; set; }

    }
    public class SMSResponseData
    {
        public int ErrorCode { get; set; }
        public string Description { get; set; }
        public string Id { get; set; }
        public string OriginatingAddress { get; set; }
        public string DestinationAddress { get; set; }
        public int MessageCount { get; set; }
    }

}