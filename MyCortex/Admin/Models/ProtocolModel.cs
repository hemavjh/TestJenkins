using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Admin.Models
{
    public class ProtocolModel
    {
        public long Id { get; set; }
        public long? Protocol_Id { get; set; }
        public string ProtocolName { get; set; }
        public long? Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public long? Parameter_Id { get; set; }
        public string ParameterName { get; set; }
        public long? Units_Id { get; set; }
        public string UnitsName { get; set; }       
        public long? Com_DurationType { get; set; }
        public string DurationName { get; set; }
        public decimal? Diag_HighMax_One { get; set; }
        public decimal? Diag_HighMin_One { get; set; }
        public decimal? Diag_MediumMax_One { get; set; }
        public decimal? Diag_MediumMin_One { get; set; }
        public decimal? Diag_LowMax_One { get; set; }
        public decimal? Diag_LowMin_One{ get; set; }
        public decimal? Diag_HighMax_Two { get; set; }
        public decimal? Diag_HighMin_Two { get; set; }
        public decimal? Diag_MediumMax_Two { get; set; }
        public decimal? Diag_MediumMin_Two { get; set; }
        public decimal? Diag_LowMax_Two { get; set; }
        public decimal? Diag_LowMin_Two { get; set; }
        public int? Comp_Duration{ get; set; }
        public int? Comp_High { get; set; }
        public int? Comp_Medium { get; set; }
        public int? Comp_Low { get; set; }
        public decimal? NormalRange_High { get; set; }
        public decimal? NormalRange_Low { get; set; }

        public long PatientId { get; set; }
        public string Patient_Name { get; set; }
        public string Doctor_Name { get; set; }
        public DateTime Protocol_Assigned_On { get; set; }

        public int? Isactive { get; set; }
        public long Created_By { get; set; }
        public int flag { get; set; }  
    }
    public class ProtocolReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<ProtocolModel> Protocol { get; set; }
    }
}