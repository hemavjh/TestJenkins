using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Admin.Models
{
    public class GatewayMaster
    {
        public long Id { get; set; }
        public string PaymentGatewayName { get; set; }
        public int IsActive { get; set; }
        public long DefaultPaymentGatewayId { get; set; }
        public string PaymentName { get; internal set; }
        public string GateWayType { get; internal set; }
    }

    public class GatewaySettingsModel
    {
        public long Id { get; set; }
        public long InstitutionId { get; set; }
        public long GatewayId { get; set; }
        public string GatewayKey { get; set; }
        public string GatewayValue { get; set; }
        //public string GatewayUrl{ get; set; }
    }

    public class GatewaySettingsReturnModels
    {
        public int ReturnFlag { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
        public GatewaySettingsModel GatewaySettings { get; set; }
    }
    public class GatewayInsuranceList
    {
        public long Id { get; set; }
        public string PaymentName { get; set; }
        public int IsActive { get; set; }
        public long GateWayType { get; set; }
    }
}