using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MyCortex.User.Model
{
    public class PatientAppointmentsModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public long Doctor_Id { get; set; }
        public long Patient_Id { get; set; }
        public string DoctorName { get; set; }
        public string Doctor_DepartmentName { get; set; }
        public string PatientName { get; set; }
        public DateTime Appointment_Date { get; set; }
        public DateTime Appointment_FromTime { get; set; }
        public DateTime Appointment_ToTime { get; set; }

        public TimeSpan AppointmentFromTime { get; set; }
        public TimeSpan AppointmentToTime { get; set; }

        public long Appointment_Type { get; set; }
        public string ReasonForVisit { get; set; }
        public string Remarks { get; set; }
        public long Status { get; set; }
        public long Created_By { get; set; }
        public string Created_By_Name { get; set; }
        public string Cancelled_Remarks { get; set; }
        public DateTime? Cancelled_Date { get; set; }
        public string Cancelled_By { get; set; }
        public DateTime Created_Dt { get; set; }
        public int flag { get; set; }
        public long CancelledBy_Id { get; set; }
        public string MRN_No { get; set; }
        public string Photo { get; set; }
        public string TimeDifference { get; set; }
        public string Smoker { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string ViewGenderName { get; set; }
        public int Page_Type { get; set; }
        public long ReasonTypeId { get; set; }
        public string ReasonType { get; set; }
        public int IsActive { get; set; }
    }
    public class PatientAppointmentsReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }

        public int ReturnFlag { get; set; }

        public PatientAppointmentsModel AppointmentDetails { get; set; }
        public IList<PatientAppointmentsModel> PatientAppointmentList { get; set; }
    }

    public class ScheduledDaysListModel
    {
        public DateTime Date { get; set; }
        public string WeekDay { get; set; }
        public int Day { get; set; }
        public string Month { get; set; }
    }

    public class ScheduledDaysListReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }

        public int ReturnFlag { get; set; }
        public IList<ScheduledDaysListModel> ScheduledDaysList { get; set; }
    }

    public class DoctorAppointmentTimeSlotModel
    {
        public DateTime AppointmentFromDateTime { get; set; }
        public DateTime AppointmentToDateTime { get; set; }
        public string AppointmentTime { get; set; }
        public bool IsBooked { get; set; }
    }

    public class DoctorAppointmentTimeSlotReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }

        public int ReturnFlag { get; set; }
        public IList<DoctorAppointmentTimeSlotModel> DoctorAppointmentTimeSlotList { get; set; }
    }

    public class AppointmentReasonType
    {
        public long ReasonTypeId { get; set; }
        public string ReasonType { get; set; }
        public int IsActive { get; set; }
    }
}