using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class InsuranceConsultationCategoryModel
    {
        public long ConsultationCategoryID { get; set; }
        public string Category { get; set; }
        public int? IsActive { get; set; }
    }
}