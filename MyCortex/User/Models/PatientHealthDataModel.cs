using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MyCortex.User.Model
{
    public class PatientHealthDataModel
    {
        public string TotalRecord { get; set; }
        public int RowNumber { get; set; }
        public long Id { get; set; }
        public long Patient_Id { get; set; }
        public int Type_Id { get; set; }
        public int flag { get; set; }
        public long? ModifiedUser_Id { get; set; }
        public long Created_By { get; set; }
        public DateTime Created_Dt { get; set; }
        public DateTime Activity_Date { get; set; }
        public string ParameterName { get; set; }
        public long ParameterId { get; set; }
        public decimal ParameterValue { get; set; }
        public decimal ParameterTarget { get; set; }
        public long UOM_Id { get; set; }
        public string UOM_Name { get; set; }
        public string XAxis { get; set; }
        public long Group_Id { get; set; }
        public string Group_Name { get; set; }

        public decimal Average { get; set; }
        public int IsActive { get; set; }
        public DateTime Activity_DateTime { get; set; }
        public DateTime UTC_DATE_TIME { get; set; }

        public string DeviceType { get; set; }
        public string DeviceNo { get; set; }
        public string Createdby_FullName { get; set; }
        public string Createdby_ShortName { get; set; }

        public long Modified_By { get; set; }
        public byte[] LiveData_Blob { get; set; }
        //public decimal PARAM_AVG { get; set; }
        public IList<PatientHealthDataModel> PatientHelathData_DateModules { get; set; }

        public string TypeName { get; set; }
        public int? HighCount { get; set; }
        public int? MediumCount { get; set; }
        public int? LowCount { get; set; }
        public long Institution_Id { get; set; }
        public long Units_Group_Id { get; set; }
        public long Units_Id { get; set; }
    }

    public class IntegrationAppHistoryModel
    {
        public long AppId { get; set; }
        public string AppType { get; set; }
        public long PatientId { get; set; }
        public int IsDisconnect { get; set; }
    }

    public class IntegrationAppHistoryReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public IntegrationAppHistoryModel IntegrationAppHistory { get; set; }
    }

    public class PatientHealthDataReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public decimal Average_Value { get; set; }
        public PatientHealthDataModel PatientHealthDataDetails { get; set; }
        public PatientHealthDataPagination _metadata { get; set; }
        public IList<PatientHealthDataModel> PatientHealthDataList { get; set; }
    }
    public class ParametersListModel
    {
        public long ParameterId { get; set; }
        public string ParameterName { get; set; }
        public decimal ParameterValue { get; set; }
        public long UOM_Id { get; set; }
        public string UOM_Name { get; set; }
        public int? ParameterHas_Child { get; set; }
        public int? ParameterParent_Id { get; set; }
        public decimal Max_Possible { get; set; }
        public decimal Min_Possible { get; set; }
        public decimal Range_Max { get; set; }
        public decimal Range_Min { get; set; }
        public long Group_Id { get; set; }
        public string Group_Name { get; set; }
        public decimal Average { get; set; }
        public int IsFormulaParam { get; set; }
    }
    public class PatientHealthDataListModel
    {
        public long Created_By { get; set; }
        public DateTime ActivityDate { get; set; }
        public long Patient_Id { get; set; }
        public IList<PatientHealthDataModel> PatientHealthDataModel { get; set; }
    }
    public class PatientInstituteModel
    {
        public long Institution_Id { get; set; }
    }

    public class PatientHealthDataPagination
    {
        public long page { get; set; }
        public long per_page { get; set; }
        public long page_count { get; set; }
        public long total_count { get; set; }
        public PatientHealthDataLinks Links { get; set; }

    }

    public class PatientHealthDataLinks
    {
        public string self { get; set; }
        public string first { get; set; }
        public string previous { get; set; }
        public string next { get; set; }
        public string last { get; set; }
    }

    public class CG_PatientAppointmentConfirm
    {
        public string Id { get; set; }
        public string SESSION_ID { get; set; }
        public string Institution_Id { get; set; }
        public string user_id { get; set; }
    }

}