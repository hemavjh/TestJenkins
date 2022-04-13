using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Notification.Models
{
    public class AlertEventResultModel
    {
        public IList<AlertEventModel> AlertEventTemplateList { get; set; }
        public IList<EmailListModel> AlertEventEmailList { get; set; }
    }
    public class AlertEventModel
    {
        public long UserId { get; set; }
        public long Institution_Id { get; set; }
        public long Template_Id { get; set; }
        public long TemplateType_Id { get; set; }
        public long TemplateFor { get; set; }
        public string FromEmail_Id { get; set; }
        //public IList<EmailListModel> EmailListModel { get; set; }
        public string TempSubject { get; set; }
        public string TempBody { get; set; }
    }

    public class EmailListModel
    {
        public string EmailId { get; set; }
        public int  EmailType_Flag { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }

        public string mobile_no { get; set; }
        public string SMSSourceId { get; set; }
        public string SMSUserName { get; set; }
        public string SMSApiId { get; set; }
    }

    public class Appointment_AlertEventModel
    {
        public long Id { get; set; }
        public long Appointment_Id { get; set; }
        public DateTime Remainder_SentTime { get; set; }
        public long Event_Id { get; set; }
        public int Appointment_Status { get; set; }
        public long Patient_Id { get; set; }
        public long Doctor_Id { get; set; }
        public long Institution_Id { get; set; }
        public string Event_Code { get; set; }

    }

    public class PasswordExpiry_AlertEventModel
    {
        public long UserId { get; set; }
        public string Event_Code { get; set; }
        public long Institution_Id { get; set; }
        public long Event_Id { get; set; }
        public int ExpiryDays { get; set; }
    }

    public class UserLimit_AlertEventModel
    {
        public long UserId { get; set; }
        public string Event_Code { get; set; }
        public long Institution_Id { get; set; }
        public long Event_Id { get; set; }
        public int Percentage { get; set; }
    }
    public class TargetAchived_AlertEventModel
    {
        public long UserId { get; set; }
        public string Event_Code { get; set; }
        public long Institution_Id { get; set; }
        public long Event_Id { get; set; }
        public int Percentage { get; set; }
        public string ParameterName { get; set; }
    }

    public class LicenceExpiry_AlertEventModel
    {
        public long HosAdmin_Id { get; set; }
        public string Event_Code { get; set; }
        public long Institution_Id { get; set; }
        public long Event_Id { get; set; }
        public int ExpiryDays { get; set; }
    }
}