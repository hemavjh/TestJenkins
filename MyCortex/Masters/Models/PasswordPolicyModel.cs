using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MyCortex.Admin.Models
{
    public class PasswordPolicyModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public string Insitution_Name { get; set; }
        public int Minimum_Length { get; set; }
        public int Maximum_Length { get; set; }
        public bool? UpperCase_Required { get; set; }
        public bool? LowerCase_Required { get; set; }
        public bool? Numeric_Required { get; set; }
        public bool? SpecialChar_Required { get; set; }
        public string Without_Char { get; set; }
        public int? Expiry_Period { get; set; }
        public bool? Allow_UserName { get; set; }
        public int? Restrict_LastPassword { get; set; }
        public bool? AllowExpiryDays { get; set; }
        public int? MaxLoginTime { get; set; }
        public int? MaxLoginHours { get; set; }
        public int? MaxLoginMins { get; set; }
        public bool? Remember_Password { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public DateTime Created_Dt { get; set; }
        public int? flag { get; set; }
    }

    public class PasswordPolicyReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public IList<PasswordPolicyModel> PasswordData { get; set; }
    }
}