using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MyCortex.Masters.Models
{
    public class AppConfigurationModel
    {
        public long Institution_Id { get; set; }
        public string ConfigCode { get; set; }
        public string ConfigInfo { get; set; }
        public string ConfigValue { get; set; }
        public string ConfigTypeDefinition { get; set; }

    }
}