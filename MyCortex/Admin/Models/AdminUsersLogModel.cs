using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyCortex.User.Model;

namespace MyCortex.Admin.Models
{
    public class AdminUsersLogModel
    {
        public long? ID { get; set; }
        public long? USERID { get; set; }
        public DateTime? LOGINTIME { get; set; }
        public DateTime? LOGOUTTIME { get; set; }
        public int ATTEMPT_COUNT { get; set; }
        public string FLAG { get; set; }
        public int BALANCE_ATTEMPT { get; set; }
        public string DEVICE_TYPE { get; set; }
        public string DEVICE_REFERENCE { get; set; }
        public DateTime CREATED_DT { get; set; }
        public int SESSION_ID { get; set; }
        public string LOGIN_COUNTRY { get; set; }
        public string LOGIN_CITY { get; set; }
        public string IPADDRESS { get; set; }
        public long? INSTITUTION_ID { get; set; }
        public string FULLNAME { get; set; }
        public string COUNTRYCODE { get; set; }
        public string LONGITUDE { get; set; }
        public string LATITUDE { get; set; }
        public string REGIONNAME { get; set; }
        public string ZIPCODE { get; set; }
        public string USERNAME { get; set; }
        public string STATUS { get; set; }
        public string FAILURE_REASON { get; set; }
    }
    public class All_UserList
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string FullName { get; set; }
        public long DepartmentId { get; set; }
        public string EmailId { get; set; }
        public long UserTypeId { get; set; }
    }

    public class EligibilityLogsModel
    {
        public long? Appointment_ID { get; set; }
        public long? Patient_ID { get; set; }
        public string Patient_Name { get; set; }
        public string Eligibility_ID { get; set; }
        public long? Clinician_ID { get; set; }
        public string Clinician_License { get; set; }
        public string Clinician_Name { get; set; }
        public string Clinician_Speciality { get; set; }
        public string Eligibility_Answer_ID { get; set; }
        public string ID_Payer { get; set; }
        public string Patient_First_Name { get; set; }
        public string Patient_Last_Name { get; set; }
        public string Patient_DOB { get; set; }
        public string Eligibility_Response_Date { get; set; }
        public string VIP { get; set; }
        public string Member_ID { get; set; }
        public string Package_Category { get; set; }
        public string Package_Name { get; set; }
        public string Network_Name { get; set; }
        public string Policy_Name { get; set; }
        public string Policy_State_Date { get; set; }
        public string Policy_Expiry_Date { get; set; }
        public long? Policy_ID { get; set; }
        public string Dental { get; set; }
        public string Network_Notes { get; set; }
        public string Limit { get; set; }
        public string Optical { get; set; }
        public string Outpatient_Deductible { get; set; }
        public string OOP_Limit { get; set; }
        public string Denial_Reason { get; set; }
        public string Denial_Code { get; set; }
        public string Eligibility_Request_Date { get; set; }
        public int Eligibility_Status { get; set; }
        public long? Payer_ID { get; set; }
        public string Payer_Name { get; set; }
        public long? Requested_By { get; set; }
        public string Eligibility_Response { get; set; }
        public string Eligibility_Request { get; set; }
        public long? INSTITUTION_ID { get; set; }
    }

    public class PatientModel
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
    }
}