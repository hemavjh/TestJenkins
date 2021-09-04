using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.User.Model;


namespace MyCortex.Repositories
{
    interface IPatientAppointmentsRepository
    {
        IList<PatientAppointmentsModel> DoctorAppointmentList(long Doctor_Id, int flag, DateTime? ViewDate, Guid Login_Session_Id);
        PatientAppointmentsModel Update_CancelledAppointment(Guid Login_Session_Id, PatientAppointmentsModel obj);
        IList<PatientAppointmentsModel> PatientAppointment_InsertUpdate(Guid Login_Session_Id,PatientAppointmentsModel insobj);
        IList<PatientAppointmentsModel> AppointmentReSchedule_InsertUpdate(Guid Login_Session_Id, PatientAppointmentsModel obj);
        IList<PatientAppointmentsModel> PatientBasedGroupBasedClinicianList(long Patient_Id);
        IList<PatientAppointmentsModel> DepartmentwiseDoctorList(string DepartmentIds, long InstitutionId, DateTime Date);
        IList<AppointmentReasonType> AppointmentReasonType_List(long Institution_Id);
        IList<ScheduledDaysListModel> GetScheduledDates(Guid Login_Session_Id);
        IList<DoctorAppointmentTimeSlotModel> GetAppointmentTimeSlots(long DoctorId,DateTime Date, int IsNew, Guid Login_Session_Id, long TimeZoneId = 0);

        IList<DoctorShiftModel> DoctorShift_InsertUpdate(DoctorShiftModel obj, Guid Login_Session_Id);
    }   
}