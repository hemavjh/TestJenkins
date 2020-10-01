using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class AttendanceModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string FullName { get; set; }
        public string Department_Name { get; set; }
        public string NameSpecialization { get; set; }
        public string ViewGenderName { get; set; }
        public string EmailId { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
        public int Flag { get; set; }
        public DateTime AttendanceFromDate { get; set; }
        public DateTime AttendanceToDate { get; set; }
        public int StatusId { get; set; }
        public long Doctor_Id { get; set; }
        public long Modified_By { get; set; }
        public string DoctorName { get; set; }
        public string CreatedByName { get; set; }
        public long Created_by { get; set; }
        public string Remarks { get; set; }
        public DateTime Created_Dt { get; set; }
        //  public IList<AttendanceUserTypeDetails_List> SelectedAttendanceList { get; set; }
    }

    public class AttendanceReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<AttendanceModel> Attendance { get; set; }
    }

    public class AttendanceUserTypeDetails_List
    {
        public long? Id { get; set; }
        public long? User_Id { get; set; }
    }
}
