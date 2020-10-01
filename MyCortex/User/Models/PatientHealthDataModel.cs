using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace MyCortex.User.Model
{
    public class PatientHealthDataModel
    {
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
    }

    public class PatientHealthDataReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        
        public int ReturnFlag { get; set; }
        public PatientHealthDataModel PatientHealthDataDetails { get; set; }
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

}