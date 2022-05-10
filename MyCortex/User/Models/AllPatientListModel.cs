using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class AllPatientListModel
    {
        public string TotalRecord { get; set; }
        public long Id { get; set; }
        public long InstitutionId { get; set; }
        public long Doctor_Id { get; set; }
        public long Patient_Id { get; set; }
        public string PatientName { get; set; }
        public string EmailId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Mobileno { get; set; }
        public long UserTypeId { get; set; }
        public string Smoker_Option { get; set; }
        public string Diabetic_Option { get; set; }
        public string Cholestrol_Option { get; set; }
        public string HyperTension_Option { get; set; }
        public string MRN_NO { get; set; }
        public string Photo { get; set; }
        public byte[] PhotoBlob { get; set; }
        public string FileName { get; set; }
        public string Photo_Fullpath { get; set; }
        public int HighCount { get; set; }
        public int MediumCount { get; set; }
        public int LowCount { get; set; }
        public long GenderId { get; set; }
        public int PatientType { get; set; }
        public string ViewGenderName { get; set; }
        public string GenderName { get; set; }
        public int? PatientCount { get; set; }
        public int RequestedPageIndex {  get; set;  }
        public int RequestedPageRowCount {  get; set;  }
        public int StartRowNumber { get; set; }
        public int EndRowNumber { get; set; }
        

    }
    public class PageModal
    {
      
        public int iDisplayStart { get; set; }
        public int iDisplayLength { get; set; }
    }
 }