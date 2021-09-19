    using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class InstitutionMasterModel
    {
        public long? Id { get; set; }
        public string InstitutionName { get; set; }
        public int? IsActive { get; set; }
    }

    public class UnitGroupTypeModel
    {
        public long Id { get; set; }
        public string UnitGroupName { get; set; }
        public int? IsActive { get; set; }
    }
}