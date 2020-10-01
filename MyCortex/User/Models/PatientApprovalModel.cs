using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class PatientApprovalModel
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string PendingSince { get; set; }
        public string Mobile_No { get; set; }
        public string MRN_NO { get; set; }
        public int Approval_Flag { get; set; }
        public long Patient_Id { get; set; }
        public long Created_By { get; set; }
        public string Remarks { get; set; }
        public int PatientCount { get; set; }
        public string EmailId { get; set; }
    }
    public class PatientApprovalReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public string MessageString { get; set; }
        public string FullName { get; set; }
    }
}