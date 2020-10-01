using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class DoctorNotesModel
    {
        public DoctorNotesModel()
        {

        }
        public long Id { get; set; }
        public long PatientId { get; set; }
        public string Notes { get; set; }
        public long Created_By { get; set; }
        public int flag { get; set; }
        public string Created_By_Name { get; set; }
        public DateTime Created_Dt { get; set; }
        public int IsActive { get; set; }
        public long Modified_By { get; set; }
    }

    public class DoctorNotesReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public IList<DoctorNotesModel> NotesDetails { get; set; }
    }
}