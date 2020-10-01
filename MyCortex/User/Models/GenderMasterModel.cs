using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class GenderMasterModel
    {
        public long Id { get; set; }
        public string Gender_Name { get; set; }
        public int? IsActive { get; set; }
    }

    public class GenderMasterReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int ReturnFlag { get; set; }
        public IList<GenderMasterModel> GenderMaster { get; set; }

    }
}