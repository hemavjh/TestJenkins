using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Admin.Models
{
    public class LanguageMasterModel
    {
        public long Id { get; set; }
        public string LanguageName { get; set; }
        public bool IsActive { get; set; }
    }
}