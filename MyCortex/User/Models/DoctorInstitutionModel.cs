using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class DoctorInstitutionModel
    {
        public long Id { get; set; }
        public string InstitutionName { get; set; }
        public int? IsActive { get; set; }
    }
}
