using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Admin.Models
{
    public class MonitoringProtocolModel
    {
        public long Id { get; set; }
        public long? Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public string Protocol_Name { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public int flag { get; set; }
        public string Name { get; set; }
        public string DisplayParameterName { get; set; }
        public int Is_Selected { get; set; }
        public IList<ProtocolModel> ChildModuleList { get; set; }
    }
        public class MonitoringProtocolReturnModels
        {
            public int ReturnFlag { get; set; }
            public string Status { get; set; }
            public string Message { get; set; }
            public IList<MonitoringProtocolModel> Protocol { get; set; }
        }

    public class MonitoringProtocolNewModel
    {
        public long Id { get; set; }
        public long? Institution_Id { get; set; }
        public string Institution_Name { get; set; }
        public string Protocol_Name { get; set; }
        public int IsActive { get; set; }
        public long Created_By { get; set; }
        public int flag { get; set; }
        public string Name { get; set; }
        public int Is_Selected { get; set; }
        public IList<DiagCompMonitoringProtocol> ChildModuleList { get; set; }
    }

    public class DiagCompMonitoringProtocol
    {
        public IList<Diag_ProtocolModel> Diag_ParameterSettingslist { get; set;}
        public IList<Comp_ProtocolModel> Comp_ParameterSettingslist { get; set;}
    }
}