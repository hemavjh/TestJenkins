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
        public int id { get; set; }
        public long Institution_Id { get; set; }
        public long Doctor_Id { get; set; }
        public long Patient_Id { get; set; }
        public string DoctorName { get; set; }

        public long DoctorDepartmentId { get; set; }
        public string Doctor_DepartmentName { get; set; }
        public string PatientName { get; set; }
        public DateTime Appointment_Date { get; set; }
        public DateTime Appointment_FromTime { get; set; }
        public DateTime Appointment_ToTime { get; set; }

        public DateTime AppointmentFromTime { get; set; }
        public DateTime AppointmentToTime { get; set; }
        public string Appointment_ToTime2 { get; set; }
        public string Appointment_FromTime2 { get; set; }
        public long? Appointment_Module_Id { get; set; }
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
        public long TimeZone_Id { get; set; }
        public string Smoker { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string ViewGenderName { get; set; }
        public int Page_Type { get; set; }
        public long ReasonTypeId { get; set; }
        public long NewAppointmentId { get; set; }
        public string ReasonType { get; set; }
        public int IsActive { get; set; }
        public string Payment_Status { get; set; }
        public long PaymentStatusId { get; set; }
        public string MerchantOrderNo { get; set; }
        public string Amount { get; set; }
        public string OrderNo { get; set; }
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

    public class AppointmentPaymentHistory
    {
        public long SNO { get; set; }

        public long ID { get; set; }

        public string APPOINTMENT_DATE { get; set; }

        public string PAYMENT_STATUS { get; set; }

        public string PAYMENT_DATE { get; set; }

        public string PAYMENT_TIME { get; set; }
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
        public string FromTime { get; set; }
        public string ToTime { get; set; }
        public string AppointmentTime { get; set; }
        public bool IsBooked { get; set; }
        public string PatientName { get; set; }
        public long? id { get; set; }
    }

    public class DoctorAppointmentTimeSlotReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }

        public int ReturnFlag { get; set; }
        public IList<DoctorAppointmentTimeSlotModel> DoctorAppointmentTimeSlotList { get; set; }

        public IList<DoctorShiftModel> DoctorShiftAddList { get; set; }
    }

    public class AppointmentReasonType
    {
        public long ReasonTypeId { get; set; }
        public string ReasonType { get; set; }
        public int IsActive { get; set; }
    }

    public class DoctorShiftModel
    {
        public long ID { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public long NewAppointment { get; set; }
        public long FollowUp { get; set; }
        public long NewAppointmentPrice { get; set; }
        public long FollowUpPrice { get; set; }
        public long Intervel { get; set; }
        public long CustomSlot { get; set; }
        public long BookingOpen { get; set; }
        public long BookingCancelLock { get; set; }
        public long Institution_Id { get; set; }
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
        public int Flag { get; set; }
        public long DoctorId { get; set; }
        public IList<SelectedDaysList> SelectedDaysList { get; set; }
        public IList<SlotsList> TimeSlot { get; set; }
        public IList<DoctorsId> Doctor_Id { get; set; }

        public IList<CcCg> CC_CG { get; set; }
    }
    public class CcCg
    {
        public int Id { get; set; }
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
        public int Shift { get; set; }
        public DateTime TimeSlotFromTime { get; set; }

        public DateTime TimeSlotToTime { get; set; }
    }
    public class SelectedDaysList
    {
        public long Id { get; set; }
        public long DoctorShiftId { get; set; }

        public DateTime Day { get; set; }
        public IList<SlotsList> TimeSlot { get; set; }

        public DateTime CreatedAt { get; set; }

        public string CreatedBy { get; set; }

        public int IsActive { get; set; }

        public long ShiftId { get; set; }

    }

    public class AppointmentFeeModel
    {
        public long Id { get; set; }
        public long InstitutionId { get; set; }
        public long DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string Amount { get; set; }
    }



}