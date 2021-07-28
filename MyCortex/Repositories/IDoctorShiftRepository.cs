using MyCortex.Masters.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Repositories
{
    interface IDoctorShiftRepository
    {
        IList<SelectedDaysList> DoctorShiftDayDetails_View(long Id, Guid Login_Session_Id);
        IList<New_DoctorShiftModel> DoctorShift_List(int IsActive, long InstitutionId, Guid Login_Session_Id);
        long DoctorShift_AddEdit(List<DoctorShiftModel> obj);
        New_DoctorShiftModel DoctorShift_View(long Id, Guid Login_Session_Id);
        IList<ShiftTimingsModel> Shift_List(long InstitutionId);
        IList<WeekDayModel> Days_List(long InstitutionId);
        IList<DoctorShiftModel> DoctorShift_Active(DoctorShiftModel noteobj);
        IList<DoctorShiftModel> DoctorShift_Delete(DoctorShiftModel noteobj);
        DoctorShiftModel ActivateDoctorShift_List(long Id, long Institution_Id, long Doctor_Id);
        IList<AppointmentTimeZone> GetTimeZoneList();
        IList<OrgAppointmentSettings> GetOrgAppointmentSettings(Guid Login_Session_Id, OrgAppointmentSettings insobj);
        OrgAppointmentSettings APPOINTMENTLISTDETAILS(long InstitutionId);
        void APPOINTMENTRESETDETAILS(long InstitutionId);
    }
}                                        