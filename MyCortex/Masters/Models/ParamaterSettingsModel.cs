using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Masters.Models
{
    public class ParamaterSettingsModel
    {
        public long Id { get; set; }
        public long? Institution_ID { get; set; }
        public int User_Id { get; set; }
        public long? Parameter_ID { get; set; }
        public long? Units_ID { get; set; }
        public decimal? Max_Possible { get; set; }
        public decimal? Min_Possible { get; set; }
        public decimal? NormalRange_High { get; set; }
        public decimal? NormalRange_low { get; set; }
        public decimal? Average { get; set; }
        public string Remarks { get; set; }
        public int IsActive { get; set; }
        public int? Created_By { get; set; }
        public DateTime Created_DT { get; set; }
        public DateTime Modified_DT { get; set; }
        public int Returnval { get; set; }
        public int flag { get; set; }
        public string Institution_Name { get; set; }
        public string Parameter_Name { get; set; }
        public string DisplayParameter_Name { get; set; }
        public string DisplayUnits_Name { get; set; }
        public string Units_Name { get; set; }
        public bool Diagnostic_Flag { get; set; }
        public bool Compliance_Flag { get; set; }
        public string UnitsGroup_Name { get; set; }
        public string Units_with_Group_Name { get; set; }
        public long? UnitsGroup_ID { get; set; }
    }
}