using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class CareCoordinatorModel
    {
        public long Id { get; set; }
        public long Doctor_Id { get; set; }
        public long Patient_Id { get; set; }
        public string PatientName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Smoker_Option { get; set; }
        public string Diabetic_Option { get; set; }
        public string Cholestrol_Option { get; set; }
        public string HyperTension_Option { get; set; }
        public string MRN_NO { get; set; }
        public string Photo { get; set; }
        public string FileName { get; set; }
        public string Photo_Fullpath { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }
        public long CareGiver_Id { get; set; }
        public string CG_Remarks { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string ViewGenderName { get; set; }
        public int PatientCount { get; set; }
    }
    public class AssignCareGiverModel
    {
        public long Id { get; set; }
        public long Coordinator_Id { get; set; }
        public string CareGiver_Id { get; set; }
        public long Patient_Id { get; set; }
        public string PatientName { get; set; }
        public string Coordinator { get; set; }
        public string CareGiver { get; set; }
        public string CC_Remarks { get; set; }
        public int flag { get; set; }
        public long Created_By { get; set; }
        public DateTime CC_Date { get; set; }
        public DateTime Created_dt { get; set; }
        public int CG_Assign_Status { get; set; }
        public long? Appoinment_Id_Ref { get; set; }
        public string CG_Remarks { get; set; }
        public string Createdbyname { get; set; }
        public byte[] PhotoBlob { get; set; }
        public int Page_Type { get; set; }
        public long CareGiverIdView { get; set; }
        public long Institution_Id { get; set; }

    }
    public class ReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public List<AssignCareGiverModel> CareGiverDetails { get; set; }
    }
    public class GetParameterValueModel
    {
        public long Id { get; set; }
        public string PatientName { get; set; }
        public string ParameterName { get; set; }
        public decimal? Average { get; set; }
        public decimal? ParameterValue { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }
        public string UnitName { get; set; }
        public string PageType { get; set; }
        public DateTime? Activity_Date { get; set; }
        public string DeviceType { get; set; }
        public string Device_No { get; set; }
        public string FullName { get; set; }
        public string TypeName { get; set; }
        public string Createdby_ShortName { get; set; }
        public string Com_DurationType { get; set; }
    }
    public class GetParameterValueCountModel
    {
        //public long Id { get; set; }
        //public decimal? ParameterValue { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }       
    }
    public class CareGiverListModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
    }
}