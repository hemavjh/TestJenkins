using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class AppoinmentSlotModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long Doctor_Id { get; set; }
        public string Doctor_Name { get; set; }
        public int Appoinment_Hours { get; set; }
        public decimal Appoinment_Minutes { get; set; }
        public decimal FollowUp_Appoinment { get; set; }
        public decimal SlotInterval { get; set; }
        public long Created_By { get; set; }
        public long? Modified_By { get; set; }
        public int flag { get; set; }
        public string Department_Name { get; set; }
        public string Specialization { get; set; }
        public decimal NewAppoinment { get; set; }
        public IList<DoctorAppoinmentSlotModel> DoctorList { get; set; }
        public int IsActive { get; set; }
        public int returnval { get; set; }
    }
    public class DoctorAppoinmentSlotModel
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string Department_Name { get; set; }
        public string NameSpecialization { get; set; }
        public string ViewGenderName { get; set; }
        public string EmailId { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
    }
    public class AppoinmentSlotReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<AppoinmentSlotModel> Appoinment { get; set; }
    }
}