using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MyCortex.Masters.Models
{
    public class DrugDBMasterModel
    {
        public long Id { get; set; }
        public string Generic_name { get; set; }
        public long Strength_ID { get; set; }
        public string StrengthName { get; set; }
        public long Dosage_From_ID { get; set; }
        public string Dosage_FromName { get; set; }
        public string Item_Code { get; set; }
        public string Drug_Code { get; set; }
        public long Dosage_Time { get; set; }
        public string Dosage_TimeName { get; set; }
        public long Administration_ID { get; set; }
        public string Administration_Name { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public DateTime Created_Dt { get; set; }
        public int returnval { get; set; }
        public int flag { get; set; }
        public long InstitutionId { get; set; }
        public string Institution_Name { get; set; }
        public long PatientId { get; set; }
        public long? DrugId { get; set; }
        public long? FrequencyId { get; set; }
        public long? RouteId { get; set; }
        public decimal? NoOfDays { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string FrequencyName { get; set; }
        public string RouteName { get; set; }
        public string Created_By_Name { get; set; }
        
        }
    public class DrugDBMasterReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<DrugDBMasterModel> DrugDBMaster { get; set; }
    }
}