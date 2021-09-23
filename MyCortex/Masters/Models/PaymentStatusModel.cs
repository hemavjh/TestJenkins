using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Masters.Models
{
    public class PaymentStatusModel
    {
        public long Id { get; set; }
        public string merchantOrderNo { get; set; }
        public string amount { get; set; }
        public string orderNo { get; set; }
        public string status { get; set; }
        public long requestTime { get; set; }
        public string notifyId { get; set; }
        public long notifyTime { get; set; }
        public long notifyTimeStamp { get; set; }
    }
}