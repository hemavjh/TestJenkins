using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace MyCortex.Login.Model
{
    public class EmployeeLoginModel
    {
        public long Id { get; set; }
        public long EmployeeId { get; set; }
        public DateTime? LogInTime { get; set; }
        public DateTime? LogOutTime { get; set; }
        public int CountVal { get; set; }
        public int ModifiedUser_Id { get; set; }
        public int Flag { get; set; }
        public DateTime? LogCheckTime { get; set; }
        public int Balance { get; set; }
        public int data { get; set; }
        //public IList<EmployeeModel> Emp { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Employee_Name { get; set; }
         public string Photo { get; set; }
        public string Photo_Fullpath { get; set; }
        public string FileName { get; set; }
        public byte[] PhotoBlob { get; set; }

        public string BuildNo { get; set; }
        public string SystemName { get; set; }
        public string LoginUser { get; set; }
        public DateTime? ExecutionDate { get; set; }
        public string Name { get; set; }

        public int LoginUser_Permission_Flag { get; set; }
        public int PatientType { get; set; }
        public long NATIONALITY_ID { get; set; }
        public DateTime? DOB { get; set; }
        public string MOBILE_NO { get; set; }
        public long USERTYPE_ID { get; set; }
        public string UserType { get; set; }

        public string FullName { get; set; }

        public string GENDER_NAME { get; set; }

        public string ProductName { get; set; }
        public string ProductImg { get; set; }
        public string ProductDefaultlogo { get; set; }
        public string ProductCopyRight { get; set; }
        public string PoweredBy { get; set; }
    }

    public class UsertypeModal
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string FullName { get; set; }
        public long? Department_Id { get; set; }
        public string EmailId { get; set; }
        public long? UserType_Id { get; set; }
        public long Institution_Id { get; set; }
        public string TypeName { get; set; }
        public int IsActive { get; set; }
        public DateTime? ChangedDate { get; set; }
    }
}