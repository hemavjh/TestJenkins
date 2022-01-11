using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MyCortex.Notification.Models;
using MyCortex.User.Model;

namespace MyCortex.Repositories
{
    interface IAlertEventRepository
    {
        IList<EmailListModel> UserCreateEvent(long Institution_Id, long Entity_Id);
        IList<AlertEventModel> AlertEvent_GenerateTemplate(long Entity_Id, string EventName, long Institution_Id);
        IList<EmailListModel> InstitutionCreateEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> InstitutionEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> ClinicianNoteEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> Diagnostic_Compliance_AlertEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> NewDataCapturedEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> Patient_MoreInfo_AlertEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> Patient_SignUp_HosAdmin_AlertEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> Patient_AppointmentCreation_AlertEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> Patient_Appointment_Cancel_AlertEvent(long Institution_Id, long Entity_Id);
        IList<EmailListModel> CG_Assign_AlertEvent(long Entity_Id);
        IList<EmailListModel> AppointmentRemainder_ForDoctor(long Institution_Id, long Entity_Id);
        void Get_AlertSchedule();
        IList<Appointment_AlertEventModel> Get_AlertSchedule_List();
        IList<EmailListModel> UserSpecificEmailList(long Institution_Id, long Entity_Id);
        bool Appointment_Schedule_UpdateList(long Schedule_Id);
        IList<PasswordExpiry_AlertEventModel> AlertEvent_Get_PasswordExpiry_List();
        IList<UserLimit_AlertEventModel> AlertEvent_Get_UserLimit_List(long Institution_Id, long UserId);
        TargetAchived_AlertEventModel AlertEvent_TargetAchievedDaily_List(long Institution_Id, long UserId);
        IList<TargetAchived_AlertEventModel> AlertEvent_TargetAchievedWeekly_List();
        IList<EmailListModel> UserLimit_EmailList(long Institution_Id);
        List<PatientHealthDataModel> PatientHealthData_Compliance_List();
        IList<LicenceExpiry_AlertEventModel> AlertEvent_Get_LicenceExpiry_List();
    }
}