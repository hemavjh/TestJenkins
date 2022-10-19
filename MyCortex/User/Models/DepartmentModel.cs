using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class DepartmentModel
    {
        public long Id { get; set; }
        public string Department_Name { get; set; }
        public int? IsActive { get; set; }
    }

    public class LiveboxModel
    {
        public TimeSpan Duration { get; set; }
        public Guid ConferenceId { get; set; }

    }
}