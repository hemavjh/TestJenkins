using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class DosageAdministrationModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int IsActive { get; set; }
        public int Created_By { get; set; }
        public DateTime Created_Dt { get; set; }
    }
}