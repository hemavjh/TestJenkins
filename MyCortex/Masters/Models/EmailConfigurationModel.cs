using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Admin.Models
{
    public class EmailConfigurationModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Insitution_Name { get; set; }
        public string Sender_Email_Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ServerName { get; set; }
        public int PortNo { get; set; }
        public string DisplayName { get; set; }
        public Boolean SSL_Enable { get; set; }
        public int IsActive { get; set; }
        public int GUID { get; set; }
        public string Remarks { get; set; }
        public int Created_By { get; set; }
        public DateTime? Modified_Dt { get; set; }
        public int EConfigSSL_Enable { get; set; }
    }

    public class EmailConfigurationReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<EmailConfigurationModel> Institute { get; set; }
    }
}