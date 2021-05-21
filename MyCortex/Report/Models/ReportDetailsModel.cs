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

    public class AutomatedTestReportDetails
    {
        public long ROWID { get; set; }
        public long  TEST_ID  { get; set; }
        public string TEST_REF { get; set; }
        public DateTime?  TEST_START_DTTM { get; set; }
        public DateTime? TEST_END_DTTM { get; set; }
        public bool TEST_RESULT { get; set; }
        public string TEST_RESULT_REASON { get; set; }
        public string  TEST_REPORT { get; set; }
        public string TEST_SESSION { get; set; }
        public DateTime? CREATED_DTTM { get; set; }
        public int Flag { get; set; }
    }

    public class AutomatedTestReportDetailsValidate
    {
        public long TEST_ID { get; set; }
        public string TEST_REF { get; set; }
        public DateTime? TEST_START_DTTM { get; set; }
        public DateTime? TEST_END_DTTM { get; set; }
        public bool TEST_RESULT { get; set; }
        public string TEST_RESULT_REASON { get; set; }
        public string TEST_REPORT { get; set; }
        public string TEST_SESSION { get; set; }
        public DateTime? CREATED_DTTM { get; set; }
        public int Flag { get; set; }
    }


    public class AutomatedTestReportReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public IList<AutomatedTestReportDetails> AutomatedTestReportDetails { get; set; }
        public  AutomatedTestReportDetails  AutomatedTestReportDetails1 { get; set; }
    }

}