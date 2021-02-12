using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyCortex.Masters.Models;

namespace MyCortex.Admin.Models
{
    public class MobileSettingsModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public PasswordPolicyModel PasswordData { get; set; }
        public IList<InstituteLanguageModel> Languages { get; set; }
    }
}