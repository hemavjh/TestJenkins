using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class NationalityModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int? IsActive { get; set; }
    }

    public class NationalityReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int ReturnFlag { get; set; }
        public IList<NationalityModel> Nationality { get; set; }

    }
}