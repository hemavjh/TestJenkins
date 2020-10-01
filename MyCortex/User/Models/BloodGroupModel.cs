using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class BloodGroupModel
    {
        public long Id { get; set; }
        public string BloodGroup_Name { get; set; }
        public int? IsActive { get; set; }
    }
}