using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using MyCortex.User.Model;

namespace MyCortex.User.Model
{
    public class ItemizedUserDetailsModel
    {

        public string TotalRecord { get; set; } 
        public long Id { get; set; }
        public long PatientId { get; set; }
        public long? INSTITUTION_ID { get; set; }
        public string InstitutionName { get; set; }
        public long? UserType_Id { get; set; }
        public long Modified_By { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string GENDER_NAME { get; set; }
        public string EMAILID { get; set; }
        public long? DEPARTMENT_ID { get; set; }
        public string Department_Name { get; set; }
        public string MOBILE_NO { get; set; }
        public string EMPLOYEMENTNO { get; set; }
        public string MNR_NO { get; set; }
        public int? IsActive { get; set; }
        public string UserName { get; set; }
        public string GroupName { get; set; }
        public DateTime? LoginTime { get; set; }
        public string NATIONALID { get; set; }
        public DateTime? DOB { get; set; }
        public string DOB_Encrypt { get; set; }
        public string Photo { get; set; }
        public string FileName { get; set; }
        public string Photo_Fullpath { get; set; }
        public long? GENDER_ID { get; set; }
        public long? Protocol_Id { get; set; }
        public string ProtocolName { get; set; }
        public int? Patient_Type { get; set; }
        public long Group_Id { get; set; }
        public IList<GroupTypeModel> GroupTypeList { get; set; }
        public int StartRowNumber { get; set; }
        public int EndRowNumber { get; set; }
        public string SearchQuery { get; set; }
        public bool Is_Master { get; set; }
        public string UserType { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string PhotoBlobs { get; set; }
    }

}