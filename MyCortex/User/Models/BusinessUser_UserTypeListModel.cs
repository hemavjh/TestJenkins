using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class BusinessUser_UserTypeListModel
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public int? IsActive { get; set; }
    }
}