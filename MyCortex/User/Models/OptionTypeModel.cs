﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class OptionTypeModel
    {
        public long Id { get; set; }
        public string OptionName { get; set; }
        public int IsActive { get; set; }
    }
}