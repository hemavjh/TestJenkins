using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class TabListModel
    {
        public string TotalRecord { get; set; }
        public long ID { get; set; }
        public string TabName { get; set; }
        public string RefId { get; set; }
        public string Model { get; set; }
        public string OS { get; set; }
        public int UsersCount { get; set; }
        public int DevicesCount { get; set; }
        public bool IsActive { get; set; }
        public long InstitutionId { get; set; }
        public long CreatedBy { get; set; }
        public string Vendor { get; set; }
        public int Flag { get; set; }
        public string DeviceName { get; set; }
        public string UserName { get; set; }
        public string PIN { get; set; }
        public IList<TabUserList> UserList { get; set; }
        public IList<UserTabUserList> SelectedTabUserList { get; set; }
        public IList<TabDevicesList> DevicesList { get; set; }
        public IList<UserTabDevicesList> SelectedTabDeviceList { get; set; }
    }

    public class TabIdReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public int data { get; set; }
        public long InstitutionId { get; set; }
        public long TabId { get; set; }
        public string RefId { get; set; }
    }

    public class TabDevicesModel
    {
        public int RowNumber { get; set; }
        public long ID { get; set; }
        public long TabId { get; set; }
        public string DeviceId { get; set; }
        public string DeviceName { get; set; } 
        public string Make { get; set; }
        public string DeviceType { get; set; }
        public string Series { get; set; }
        public string ModelNumber { get; set; }
        public string Purpose { get; set; }
        //public string Parameter { get; set; }

        public string Parameter { get; set; }
        public IList<DeviceParameterList> ParameterList { get; set; }

        public IList<SelectedDeviceParameterList> SelectedDeviceParameterList { get; set; }

        public bool IsActive { get; set; }
        public long CreatedBy { get; set; }
        public int Flag { get; set; }
        public long InstitutionId { get; set; }

        public long DeviceTypeId { get; set; }
    }

    public class TabUserModel
    {
        public long ID { get; set; }
        public int UnreadCount { get; set; }
        public long UserId { get; set; }
        public string PIN { get; set; }
        public string Photo { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string FingerPrint { get; set; }
        public bool IsActive { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public long UserTypeId { get; set; }
        public long GenderId { get; set; }
        public string GenderName { get; set; }
        public bool IsTemp { get; set; }
    }

    public class TabUserReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabListModel> TabUserDetails { get; set; }
        public TabUserDetails TabUserDetail { get; set; }

    }

    public class ParameterModels
    {
        public long ParameterId { get; set; }
        public string ParameterName { get; set; }
    }

    public class ParameterReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<ParameterModels> ParameterList { get; set; }
    }

    public class TabUserPinModel
    {
        public long InstitutionId { get; set; }
        public long TabId { get; set; }
        public long UserId { get; set; }
        public string PIN { get; set; }
        public int Flag { get; set; }
        public int IsTemp { get; set; }
    }

    public class TabUserPinReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }

    public class TabDeviceListReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabDevicesModel> TabDeviceList { get; set; }

    }

    public class TabUserListReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabUserModel> TabUserList { get; set; }
        public TabUserDashBordDetails  TabDashBoardList { get; set; }
    }

    public class TabAlertsReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<TabDashBoardAlertDetails> TabDashBoardAlertDetails { get; set; }
    }

    public class TabDevicesList
    {
        public long ID { get; set; }
        public string DeviceName { get; set; }
        public bool IsActive { get; set; }
        public long InstitutionId { get; set; }
    }
    

    public class TabUserList
    {
        public long ID { get; set; }
        public long UserId { get; set; }
        public string FullName { get; set; }
        public string PIN { get; set; }
        public bool IsActive { get; set; }
        public long? TabId { get; set; }
    }

    public class UserTabUserList
    {
        public long? Id { get; set; }
        public long? UserId { get; set; }
        public long? UserListId { get; set; }
        public string UserFullName { get; set; }
        public bool IsActive { get; set; }
        public string PIN { get; set; }
        public long? TabId { get; set; }
    }
    public class UserTabDevicesList
    {
        public long? Id { get; set; }
        public long? UserId { get; set; }
        public long? DeviceId { get; set; }
        public string DeviceName { get; set; }
        public bool IsActive { get; set; }
        public long? TabId { get; set; }
    }

    public class TabUserDetails
    {
        public long TabId { get; set; }
        public string TabRefId { get; set; }
        public string UserName { get; set; }
        public long  UserId { get; set; }
        public string PIN { get; set; }
        public int Flag { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string Password { get; set; }
        public long UserTypeId { get; set; }
    }

    public class TabAdminDetails
    {
        public long InstitutionId { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int Flag { get; set; }
    }

    public class TabAdminDetailsReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }

    public class SelectedDeviceParameterList
    {
        public long ID { get; set; }
        public long DeviceRowId { get; set; }

        public string ParameterName { get; set; }
        public DateTime CreatedAt { get; set; }

        public string CreatedBy { get; set; }

        public int IsActive { get; set; }

    }
    public class DeviceParameterList
    {
        public long ID { get; set; }
        public long DeviceRowId { get; set; }

        public string ParameterName { get; set; }
        public DateTime CreatedAt { get; set; }

        public string CreatedBy { get; set; }

        public int IsActive { get; set; }

    }

    public class TabUserDashBordDetails
    {
        public long UserGroupId { get; set; }
        public string UserGroupName { get; set; }
        public int IsActive { get; set; }
        public long InstitutionId { get; set; }
        public long TabId { get; set; }
        public long UserId { get; set; }
        public int UnreadCount { get; set; }
        public int Flag { get; set; }
        public string DeviceType { get; set; }
        public long UserTypeId { get; set; }
        public  TabDeviceUserDetails  UserDetails { get; set; }
        /*public IList<TabDeviceParameterDetails> TabParameterList { get; set; }*/
        public IList<TabDeviceParameterList> TabParameterList { get; set; }
        public IList<TabDashBoardAlertDetails> TabAlertsList { get; set; }
        public IList<TabDashBoardAppointmentDetails> TabAppointmentList { get; set; }
        public IList<TabDashBoardMedicationDetails> TabMedicationList { get; set; }
    }
    public class TabDeviceParameterDetails
    {
        public long ParameterId { get; set; }
        public string ParameterName { get; set; }
        public decimal ParameterValue { get; set; }
        public long UomId { get; set; }
        public string UomName { get; set; }
        public int? ParameterHasChild { get; set; }
        public int? ParameterParentId { get; set; }
        public decimal MaxPossible { get; set; }
        public decimal MinPossible { get; set; }
        public decimal RangeMax { get; set; }
        public decimal RangeMin { get; set; }
        public long GroupId { get; set; }
        public string GroupName { get; set; }
        public decimal Average { get; set; }
        public int IsFormulaParam { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
    public class TabDeviceParameterList
    {
        public IList<TabDeviceParameterValues> ParameterList { get; set; }
    }
    public class TabDeviceParameterValues
    {
        public DateTime ActivityDate { get; set; }
        public long ParameterId { get; set; }
        public long ParameterGroupId { get; set; }
        public string ParameterName { get; set; }
        public decimal ParameterValue { get; set; }
        public long UomId { get; set; }
        public string UomName { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }

    }
    public class TabDeviceUserDetails
    {
        public byte[] PhotoLobThumb { get; set; }
        public string UserName { get; set; }
    }
    public class TabDashBoardAlertDetails
    {
        public long ID { get; set; }
        public string PatientName { get; set; }
        public string ParameterName { get; set; }
        public decimal? Average { get; set; }
        public decimal? ParameterValue { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }
        public string UnitName { get; set; }
        public string PageType { get; set; }
        public DateTime? ActivityDate { get; set; }
        public string DeviceType { get; set; }
        public string DeviceNo { get; set; }
        public string FullName { get; set; }
        public string TypeName { get; set; }
        public string CreatedByShortName { get; set; }
        public string ComDurationType { get; set; }
        public string TimeDifference { get; set; }
    }
    public class TabDashBoardAppointmentDetails
    {
        public long Id { get; set; }
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
        public string Payment_Status { get; set; }
        public string Smoker { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string ViewGenderName { get; set; }
        public int Page_Type { get; set; }
        public long ReasonTypeId { get; set; }
        public long NewAppointmentId { get; set; }
        public string ReasonType { get; set; }
        public int IsActive { get; set; }
    }
    public class TabDashBoardMedicationDetails
    {
        public long ID { get; set; }
        public string GenericName { get; set; }
        public long StrengthId { get; set; }
        public string StrengthName { get; set; }
        public long DosageFromID { get; set; }
        public string DosageFromName { get; set; }
        public string ItemCode { get; set; }
        public string DrugCode { get; set; }
        public long DosageTime { get; set; }
        public string DosageTimeName { get; set; }
        public long AdministrationId { get; set; }
        public string AdministrationName { get; set; }
        public int IsActive { get; set; }
        public long CreatedBy { get; set; }
        public DateTime CreatedDt { get; set; }  
        public long InstitutionId { get; set; }
        public string InstitutionName { get; set; }
        public long PatientId { get; set; }
        public decimal? NoOfDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string FrequencyName { get; set; }
        public string RouteName { get; set; }
        public string CreatedByName { get; set; }
        public string TimeDifference { get; set; }
    }
    public class DashboardUserParameterSettingsModel
    {
        public long Id { get; set; }
        public long User_Id { get; set; }
        public string Parameter_Id { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        
    }
    public class DashboardUserParameterSettingsReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public DashboardUserParameterSettingsModel UserParamDetails { get; set; }
    }
}