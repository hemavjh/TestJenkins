﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.CommonMenu.Models
{
    public class CommonMenuModel
    {
        public long Menu_Id { get; set; }
        public string Menu_Name { get; set; }
        public int Menu_Level { get; set; }
        public string Menu_URL { get; set; }
        public string Image_URL { get; set; }
        public int Parent_Id { get; set; }
        public int Display_Order { get; set; }
        public int IsActive { get; set; }
        public int HasChild { get; set; } 
    }
}