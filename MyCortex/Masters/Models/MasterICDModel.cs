using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Masters.Models
{
    public class MasterICDModel
    {
        public long Id { get; set; }        
        public string ICD_Code { get; set; }
        public string Description { get; set; }
        public long? Category_ID { get; set; }
        public string CategoryName { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public DateTime Created_DT { get; set; }
        public DateTime Modified_DT { get; set; }
        public int Returnval { get; set; }
        public int flag { get; set; }
        public long InstitutionId { get; set; }
        public string Institution_Name { get; set; }
        public long Patient_Id { get; set; }
        public DateTime? Active_From { get; set; }
        public DateTime? Active_To { get; set; }
        public string Doctor_Name { get; set; }
        public long Code_ID { get; set; }
        public string Remarks { get; set; }
        public string Created_By_Name { get; set; }
    }
    public class MasterICDReturnModels
    {

        public string Status { get; set; }
        public string Message { get; set; }
        public IList<MasterICDModel> MasterICD { get; set; }
        public int ReturnFlag { get; set; }
    }
}