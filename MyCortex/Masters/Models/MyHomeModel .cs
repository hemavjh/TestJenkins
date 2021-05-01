using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class TabListModel
    {
        public long ID { get; set; }
        public string TabName { get; set; }
        public string RefId { get; set; }
        public string Model { get; set; }
        public string OS { get; set; }
        public int UsersCount { get; set; }
        public int DevicesCount { get; set; }
        public bool IsActive { get; set; }
    }
}