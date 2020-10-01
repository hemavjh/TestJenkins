using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class ShiftTimingsModel
    {
        public long Id { get; set; }
        public long InstituteId { get; set; }
        public string ShiftName { get; set; }
        public DateTime ShiftFromTime { get; set; }
        public DateTime ShiftEndTime { get; set; }
        public DateTime ShiftFromDate { get; set; }
        public DateTime ShiftToDate { get; set; }
        public int Flag { get; set; }
        public int IsActive { get; set; }
        public long Created_by { get; set; }
        public DateTime Created_dt { get; set; }
        public long Modified_By { get; set; }
        public int returnval { get; set; }
    }

    public class ShiftTimingsReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<ShiftTimingsModel> ShiftTiming { get; set; }
    }
}
