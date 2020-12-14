using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Models
{
    public class PatientDeviceDataModel
    {
        public long Id { get; set; }
        public long Patient_Id { get; set; }
        public long Institution_Id { get; set; }
        public string DeviceType { get; set; }
        public string DeviceNo { get; set; }
        public string DeviceData { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public DateTime Created_Dt { get; set; }
    }

    public class PatientDeviceDataReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public IList<PatientDeviceDataModel> DeviceData { get; set; }
    }
}