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
   
}