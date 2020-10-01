using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Admin.Models
{
    public class EmailGenerateModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public long UserId { get; set; }
        public string MessageToId { get; set; }
        public string MessageSubject { get; set; }
        public string MessageBody { get; set; }
        public int TemplateId { get; set; }
        public string User_EmailId_Address { get; set; }
        public string Subject { get; set; }
        public string MailBody { get; set; }
        public int Created_By { get; set; }
        public string Sender_Details { get; set; }
        public int Modified_UserId { get; set; }
        public int flag { get; set; }

        public DateTime SentDate { get; set; }
    }
}