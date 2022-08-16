﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class InsuranceServiceCategoryModel
    {
        public long Id { get; set; }
        public long ServiceCategoryID { get; set; }
        public string Category { get; set; }
        public int? IsActive { get; set; }
    }
}