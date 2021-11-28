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

    public class CometChat_User
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string FullName { get; set; }
        public long DepartmentId { get; set; }
        public string EmailId { get; set; }
        public long UserTypeId { get; set; }
    }
}