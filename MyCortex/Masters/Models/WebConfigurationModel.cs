using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class WebConfigurationModel
    {
        public long Id { get; set; }
        public string KeyName { get; set; }
        public string Value { get; set; }
        public int IsActive { get; set; }
        public long Created_by { get; set; }
        public DateTime Created_Dt { get; set; }
    }

    public class WebConfigurationReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<WebConfigurationModel> Configuration { get; set; }
    }
}