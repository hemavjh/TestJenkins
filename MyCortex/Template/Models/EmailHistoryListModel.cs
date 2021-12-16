using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Template.Models
{
    public class EmailHistoryListModel
    {
        public long Id { get; set; }
        public long Template_Id { get; set; }
        public long UserId { get; set; }
        public string Email_Body { get; set; }
        public string Email_Subject { get; set; }
        public int Email_Status { get; set; }
        public string Email_Error_Reason { get; set; }
        public DateTime Send_Date { get; set; }
        public int IsActive { get; set; }
        public string FullName { get; set; }
        public long UserType_Id { get; set; }
        public string TypeName { get; set; }
        public string TemplateName { get; set; }
        public string EmailSubject { get; set; }
        public string EmailTemplate { get; set; }
        public string EmailId { get; set; }
        public string EmailStatusType { get; set; }
        public string MobileNO { get; set; }
    }
}