using MyCortex.User.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class TabListModel
    {
        public string TotalRecord { get; set; }
        public long ID { get; set; }
        public string TabName { get; set; }
        public string RefId { get; set; }
        public string Model { get; set; }
        public string OS { get; set; }
        public int UsersCount { get; set; }
        public int DevicesCount { get; set; }
        public bool IsActive { get; set; }
    }

    public class TabDevicesModel
    {
        public long ID { get; set; }
        public long TAB_ID { get; set; }
        public long DEVICE_ID { get; set; }
        public string DEVICENAME { get; set; }
        public string MANUFACTURE { get; set; }
        public string MAKE { get; set; }
        public string BRAND_NAME { get; set; }
        public string SERIES { get; set; }
        public string MODEL_NUMBER { get; set; }
        public string PURPOSE { get; set; }
        public string PARAMETER { get; set; }
        public bool IsActive { get; set; }
    }

    public class TabUserModel
    {
        public long ID { get; set; }
        public long USER_ID { get; set; }
        public string PIN { get; set; }
        public string PHOTO { get; set; }
        public string FINGERPRINT { get; set; }
        public bool ISACTIVE { get; set; }
        public string FIRSTNAME { get; set; }
        public string MIDDLENAME { get; set; }
        public string LASTNAME { get; set; }
        public string EMAILID { get; set; }
        public long USERTYPE_ID { get; set; }
        public long GENDER_ID { get; set; }
        public string GENDER_NAME { get; set; }

    }


}