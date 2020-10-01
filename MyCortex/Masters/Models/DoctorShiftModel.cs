using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Masters.Models
{
    public class WeekDayModel 
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public int IsActive { get; set; }
        public string WeekDayName { get; set; }
        public string WeekDayNumber { get; set; }
        public int OrderNumber { get; set; }
    }
    public class DoctorShiftModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long Doctor_Id { get; set; }
        public string Doctor_Name { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public long? Modified_By { get; set; }
        public string Department_Name { get;set; }
        public int flag { get; set; }
        public long DayMaster_Id { get; set; }
        public string WeekDayName { get; set;} 
        public long? Shift_Id { get; set; }
        public string ShiftName { get; set; }

        public string Sunday { get; set; }
        public string Monday { get; set; }
        public string Tuesday { get; set; }
        public string Wednessday { get; set; }
        public string Thursday { get; set; }
        public string Friday { get; set; }
        public string Saturday { get; set; }
        public int returnval { get; set; }

        public IList<WeekDayModel> DoctorShiftList { get; set; }
        public IList<DoctorShiftDayDetailsModel> ChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> SundayChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> MondayChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> TuesdayChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> WednessdayChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> ThursdayChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> FridayChildModuleList { get; set; }
        public IList<DoctorShiftDayDetailsModel> SaturdayChildModuleList { get; set; }
    }
    public class DoctorShiftDayDetailsModel
    {
        public long Id { get; set; }
        public long DoctorShift_Id { get; set; }       
        public long DayMaster_Id { get; set; }

        public string WeekdayName { get; set; }
        public string Sunday { get; set; }
        public string Monday { get; set; }
        public string Tuesday { get; set; }
        public string Wednessday { get; set; }
        public string Thursday { get; set; }
        public string Friday { get; set; }
        public string Saturday { get; set; }

        public long? Shift_Id { get; set; }
        public string ShiftName { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public long? Modified_By { get; set; }
    }
     public class DoctorShiftReturnModels
        {
            public int ReturnFlag { get; set; }
            public string Status { get; set; }
            public string Message { get; set; }
            public IList<DoctorShiftModel> DoctorShift { get; set; }
        }   
}