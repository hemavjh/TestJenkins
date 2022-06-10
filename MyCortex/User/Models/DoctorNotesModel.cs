using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class DoctorNotesModel
    {
        public string TotalRecord { get; set; }
        public int RowNumber { get; set; }
        public int UserTypeID { get; set; }
        public long Id { get; set; }
        public long PatientId { get; set; }
        public string Notes { get; set; }
        public string NotesType { get; set; }
        public int NotesFlag { get; set; }
        public int Importance { get; set; }
        public long Created_By { get; set; }
        public long Institution_Id { get; set; }
        public int flag { get; set; }
        public string Created_By_Name { get; set; }
        public DateTime Created_Dt { get; set; }
        public long Modified_By { get; set; }
        public int IsActive { get; set; }
    }

    public class DoctorNotesReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public IList<DoctorNotesModel> NotesDetails { get; set; }
        public DoctorNotesDataPagination _metadata { get; set; }
    }
    public class DoctorNotesDataPagination
    {
        public long page { get; set; }
        public long per_page { get; set; }
        public long page_count { get; set; }
        public long total_count { get; set; }
        public DoctorNotesDataLinks Links { get; set; }

    }

    public class DoctorNotesDataLinks
    {
        public string self { get; set; }
        public string first { get; set; }
        public string previous { get; set; }
        public string next { get; set; }
        public string last { get; set; }
    }
}