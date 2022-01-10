using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
}