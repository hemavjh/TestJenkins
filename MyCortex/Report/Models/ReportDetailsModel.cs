using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class ReportDetailsModel
    {
        public string TotalRecord { get; set; }
        public long UserTypeId { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
        public long UserId { get; set; }
        public string FullName { get; set; }
        public long ShortNameId { get; set; }
        public string ShortName { get; set; }
        public string TableDisplayName { get; set; }
        public string NewValue { get; set; }
        public string OldValue { get; set; }
        public DateTime? ActionDateTime { get; set; }
        public string Details { get; set; }
        public string Action { get; set; }
        public string ColumnOrder { get; set; }
     
    }
    
}