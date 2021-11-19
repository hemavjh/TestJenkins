using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class Patient_OtherDataModel
    {
        public string TotalRecord { get; set; }
        public long Id { get; set; }
        public int RowNumber { get; set; }
        public long Patient_Id { get; set; }
        public long Appointment_Id { get; set; }
        public string FileName { get; set; }
        public string DocumentName { get; set; }
        public string Remarks { get; set; }
        public string Filetype { get; set; }
        public long Created_By { get; set; }
        public int Is_Appointment { get; set; }
        public List<string> DocumentData { get; set; }
        public byte[] DocumentBlobData { get; set; }
        public int flag { get; set; }
        public int IsActive { get; set; }
        public string PatientName { get; set; }
        public string Created_Name { get; set; }
        public DateTime Created_Date { get; set; }
        public long Modified_By { get; set; }
        public long Institution_Id { get; set; }
    }

    public class DocumentReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public Patient_OtherDataModel DocumentDetails { get; set; }
        public IList<Patient_OtherDataModel> DocumentDetails1 { get; set; }
        public OthersDataPagination _metadata { get; set; }
    }
    public class OthersDataPagination
    {
        public long page { get; set; }
        public long per_page { get; set; }
        public long page_count { get; set; }
        public long total_count { get; set; }
        public OthersDataLinks Links { get; set; }

    }

    public class OthersDataLinks
    {
        public string self { get; set; }
        public string first { get; set; }
        public string previous { get; set; }
        public string next { get; set; }
        public string last { get; set; }
    }
}