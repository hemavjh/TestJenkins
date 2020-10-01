using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class ScheduleMasterModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int? IsActive { get; set; }
    }
}