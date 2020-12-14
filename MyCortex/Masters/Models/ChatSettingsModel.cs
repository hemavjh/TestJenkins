using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class ChatSettingsModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long FromUser_TypeId { get; set; }
        public long ToUser_TypeId { get; set; }
        public string FromUser { get; set; }
        public string ToUser { get; set; }
        public int Flag { get; set; }
        public int IsActive { get; set; }
        public long Created_by { get; set; }
        public DateTime Created_dt { get; set; }
        public int FlagType { get; set; }
    }
    public class UserTypeModel
    {
        public long Id { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
    }
    public class ChatReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<ChatSettingsModel> chat { get; set; }
    }

}