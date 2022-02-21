using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class CareGiverModel
    {
        public long Id { get; set; }
        public long Doctor_Id { get; set; }
        public long Patient_Id { get; set; }
        public string PatientName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Smoker_Option { get; set; }
        public string Diabetic_Option { get; set; }
        public string Cholestrol_Option { get; set; }
        public string HyperTension_Option { get; set; }
        public string MRN_NO { get; set; }
        public byte[] Photo { get; set; }
        public string FileName { get; set; }
        public string Photo_Fullpath { get; set; }
        public long CareGiver_Id { get; set; }
        public string CG_Remarks { get; set; }
        public string ViewGenderName { get; set; }
        public int Page_Type { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }
        public int PatientCount { get; set; }
        public string Patient_No { get; set; }
        public string National_ID { get; set; }
        public string Insurance_ID { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
    }


    public class CG_Patient_NotesModel
    {
        public long CareGiver_Id { get; set; }
        public string CaregiverName { get; set; }
        public long Patient_Id { get; set; }
        public string CC_Remarks { get; set; }
        public DateTime Created_Dt { get; set; }
    }
}