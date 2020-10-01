using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Admin.Models
{
    public class ModuleMasterModel
    {
        public long Id { get; set; }
        public string ModuleName { get; set; }
        public int IsActive { get; set; }
    }
}