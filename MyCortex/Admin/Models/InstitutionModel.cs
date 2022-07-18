using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCortex.Admin.Models
{

    public class InstitutionModel
    {
        public InstitutionModel()
        {

        }
        public long Id { get; set; }
        [Required]
        public string Institution_Name { get; set; }
        public string INSTITUTION_SHORTNAME { get; set; }
        public string Institution_Address1 { get; set; }
        public string Institution_Address2 { get; set; }
        public string Institution_Address3 { get; set; }
        public string ZipCode { get; set; }
        public string Email { get; set; }
        [Required]
        public long CountryId { get; set; }
        public string CountryName { get; set; }
        [Required]
        public long StateId { get; set; }
        public string StateName { get; set; }
        public string CountryISO2 { get; set; }
        [Required]
        public long CityId { get; set; }
        public string CityName { get; set; }
        public string Photo { get; set; }
        public string FileName { get; set; }
        public string Photo_Fullpath { get; set; }    
        public int? IsActive { get; set; }
        public int? ModifiedUser_Id { get; set; }
        public long Created_by { get; set; }
        public DateTime Created_Dt { get; set; }
        public int returnval { get; set; }
        public int flag { get; set; }        
    }

    public class InstitutionReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<InstitutionModel> Institute { get; set; }
    }
}
