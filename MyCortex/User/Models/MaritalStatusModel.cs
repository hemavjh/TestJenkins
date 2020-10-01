using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class MaritalStatusModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int? IsActive { get; set; }
    }
}