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
    public class New_DoctorShiftModel
    {
        public long ID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int NewAppointment { get; set; }
        public int FollowUp { get; set; }
        public long NewAppointmentPrice { get; set; }
        public long FollowUpPrice { get; set; }
        public int Intervel { get; set; }
        public int CustomSlot { get; set; }
        public int BookingOpen { get; set; }
        public int BookingCancelLock { get; set; }
        public long Institution_Id { get; set; }
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
        public int Flag { get; set; }
        public long DoctorId { get; set; }
        public IList<SelectedDaysList> SelectedDaysList { get; set; }
        public IList<SlotsList> TimeSlot { get; set; }
        public IList<DoctorsId> Doctor_Id { get; set; }
        public long INSTITUTION_ID { get; set; }
        public int IsActive { get; set; }
        public long? MakeMeLookBusy { get; set; }
        public long? MinimumSlots { get; set; }

        public long DepartmentId { get; set; }

        public string Doctor_Name { get; set; }

        public IList<CcCg> CC_CG { get; set; }
    }
    public class CcCg
    {
        public long CcCg_Id { get; set; }
        public int IsActive { get; set; }
    }
    public class DoctorsId
    {
        public long DoctorId { get; set; }
        public int IsActive { get; set; }
    }
    public class SlotsList
    {
        public DateTime Day { get; set; }
        public int SHIFT { get; set; }
        public DateTime TimeSlotFromTime { get; set; }

        public DateTime TimeSlotToTime { get; set; }
    }
    public class SelectedDaysList
    {
        public long Id { get; set; }
        //public long DoctorShiftId { get; set; }

        public DateTime Day { get; set; }
        public IList<SlotsList> TimeSlot { get; set; }

        //public DateTime CreatedAt { get; set; }

        //public string CreatedBy { get; set; }
        public DateTime TimeSlotFromTime { get; set; }

        public DateTime TimeSlotToTime { get; set; }

        public int SHIFT { get; set; }

        //public int IsActive { get; set; }

        //public long ShiftId { get; set; }

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
    public class ByDateDepartmentModel
    {
        public long Id { get; set; }
        public string Department_Name { get; set; }
        public string DisplayDepartment_Name { get; set; }
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

    public class AppointmentTimeZone
    {
        public long TimeZoneId { get; set; }
        public string TimeZoneName { get; set; }
        public string UtcOffSet { get; set; }
        public string TimeZoneDisplayName { get; set; }
        public int IsActive { get; set; }
    }
    public class OrgAppointmentSettings
    {
        public long ID { get; set; }
        public long InstitutionId { get; set; }
        public int MaxScheduleDays { get; set; }
        public bool IsDirectAppointment { get; set; }
        public bool IsCc { get; set; }
        public bool IsCg { get; set; }
        public bool IsCl { get; set; }
        public bool IsSc { get; set; }
        public bool IsPatient { get; set; }
        public int MinRescheduleDays { get; set; }
        public int MinRescheduleHours { get; set; }
        public int MinRescheduleMinutes { get; set; }
        public bool IsAutoReschedule { get; set; }
        public string DefautTimeZone { get; set; }
        public bool IsAppointmentInHolidays { get; set; }
        public int IsActive { get; set; }
        public long CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public long MyAppConfigId { get; set; }
        public int NewAppointmentDuration { get; set; }
        public int FollowUpDuration { get; set; }
        public long NewAppointmentPrice { get; set; }
        public long FollowUpPrice { get; set; }
        public int AppointmentInterval { get; set; }
        public int ReminderDays { get; set; }
        public int ReminderHours { get; set; }
        public int ReminderMinutes { get; set; }
        public string DefaultWorkingDays { get; set; }
        public string DefaultHoliDays { get; set; }
        public int MinimumSlots { get; set; }
        public int Flag { get; set; }
        public IList<ReminderUserLists> ReminderTimeInterval { get; set; }

        //public IList<DefaultWorkingDays> DefaultWorkingDays { get; set; }
        public int CancelAppointmentUnPaidMinutes { get; set; }
        public int Eligibility_Timeout { get; set; }
    }

    public class OrgAppointmentModuleSettings
    {
        public long InstitutionId { get; set; }
        public int MaxScheduleDays { get; set; }
        public bool IsDirectAppointment { get; set; }
        public bool IsPatient { get; set; }
        public int MinRescheduleDays { get; set; }
        public int MinRescheduleHours { get; set; }
        public int MinRescheduleMinutes { get; set; }
        public int TimeZoneId { get; set; }
        public string TimeZoneDisplayName { get; set; }
        public int AppointmentModuleId { get; set; }
        public string AppointmentModuleName { get; set; }
    }

    public class OrgAppointmentSettingsReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<OrgAppointmentSettings> OrgAppointmentSettingDetails { get; set; }
    }
    public class ReminderUserLists
    {
        public int ReminderDays { get; set; }
        public int ReminderHours { get; set; }
        public int ReminderMinutes { get; set; }
        public long InstitutionId { get; set; }
        public long ID { get; set; }
        public long MyIntervalConfigId { get; set; }
        public long CreatedBy { get; set; }
        public int IsActive { get; set; }
    }

    public class AppointmentModule
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int IsActive { get; set; }
    }
}