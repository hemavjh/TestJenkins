using MyCortex.Masters.Models;
using MyCortex.User.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyCortex.Login.Model
{
    public class LoginModel
    {
        public long Id { get; set; }
        public int data { get; set; }
        public long UserId { get; set; }
        public long UserTypeId { get; set; }
        public long InstitutionId { get; set; }
        public int LanguageId { get; set; }

        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Error_Code { get; set; }
        public string Message { get; set; }
        public string LanguageKey { get; set; }
        public string DeviceType { get; set; }
        public UserModel UserDetails { get; set; }

        public int returnval { get; set; }
        public int LoginType { get; set; }
        public string Messagetype { get; set; }
        [Required]
        public string Username { get; set; }

        [StringLength(100)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public DateTime Created_Dt { get; set; }

        public string NewPassword { get; set; }
        public string ReenterPassword { get; set; }
        public int PasswordCount { get; set; }
        public int flag { get; set; }

        public int InputType { get; set; }
        public string DecryptInput { get; set; }
        public string ResultValue { get; set; }

        public string Login_IpAddress { get; set; }
        public Guid? Login_Session_Id { get; set; }
        public int Sys_TimeDifference { get; set; }
        public string Browser_Version { get; set; }
        public string Login_Country { get; set; }
        public string Login_City { get; set; }
        public string GOOGLE_EMAILID { get; set; }
        public string FB_EMAILID { get; set; }
        public string appleUserID { get; set; }
        public bool isTab { get; set; }
        public bool IsClinicalUser { get; set; }
        public string Tab_Ref_ID { get; set; }
        public long TabID { get; set; }
        public string TabName { get; set; }
        public IList<TabDevicesModel> TabDevices { get; set; }
        public IList<TabUserModel> TabUsers { get; set; }
        public string DeviceId { get; set; }
        public string DeviceMACAddress { get; set; }
        public string DeviceIPAddress { get; set; }
        public string DeviceName { get; set; }
        public string DeviceModel { get; set; }
        public string DeviceOS { get; set; }
        public string DeviceMiscInfo { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public DateTime? LocalDateTime { get; set; }
        public string countryCode { get; set; }
        public string region { get; set; }
        public string regionName { get; set; }
        public string timeZone { get; set; }
        public string zipcode { get; set; }
    }

    public class GmailToken
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("expires_in")]
        public long ExpiresIn { get; set; }

        [JsonProperty("id_token")]
        public string IdToken { get; set; }
    }
    //* JsonProperty(PropertyName = "name") attribute used here  
    //* to map json property name with object property name   
    //* while deseralizing a json into object 
    public partial class UserProfile
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("verified_email")]
        public bool VerifiedEmail { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("given_name")]
        public string GivenName { get; set; }

        [JsonProperty("family_name")]
        public string FamilyName { get; set; }

        [JsonProperty("link")]
        public string Link { get; set; }

        [JsonProperty("picture")]
        public string Picture { get; set; }

        [JsonProperty("gender")]
        public string Gender { get; set; }

        [JsonProperty("locale")]
        public string Locale { get; set; }
    }
    public class ResetPasswordReturnModel
    {
        public string Error_Code { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public int ReturnFlag { get; set; }
        public LoginModel ResetPassword { get; set; }

    }
}