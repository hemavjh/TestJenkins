using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class WebConfigurationModel
    {
        public long ID { get; set; }
        public long INSTITUTION_ID { get; set; }
        public string CONFIGCODE { get; set; }
        public string CONFIGINFO { get; set; }
        public string CONFIGVALUE { get; set; }
        public string CONFIG_TYPEDEFINITION { get; set; }
        public string REMARKS { get; set; }
        public int ISACTIVE { get; set; }
        public int Flag { get; set; }
        public string CHRONICID { get; set; }
        public string CHRONICNAME { get; set; }
        public int IsSystemDefine { get; set; }
        public string IS_DISPLAY { get ; set; }
    }

    public class WebConfigurationReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<WebConfigurationModel> Configuration { get; set; }
    }

    public class Configuration_Setting
    {
        public long ID { get; set; }
        public long User_Id { get; set; }
        public long INSTITUTION_ID { get; set; }
        public long IS_NOTIFY { get; set; }
        public string FCMToken { get; set; }
    }
}