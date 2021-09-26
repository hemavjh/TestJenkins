using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.User.Model
{
    public class TotalAmount
    {
        public string currency { get; set; }
        public double amount { get; set; }
    }

    public class PaySceneParams
    {
        public string redirectUrl { get; set; }
        public string iapDeviceId { get; set; }
        public string appId { get; set; }
    }

    public class VatAmount
    {
        public string currency { get; set; }
        public double amount { get; set; }
    }

    public class Amount
    {
        public string currency { get; set; }
        public double amount { get; set; }
    }

    public class AmountDetail
    {
        public VatAmount vatAmount { get; set; }
        public Amount amount { get; set; }
    }

    public class Price
    {
        public string currency { get; set; }
        public double amount { get; set; }
    }

    public class GoodsDetail
    {
        public string body { get; set; }
        public string categoriesTree { get; set; }
        public string goodsCategory { get; set; }
        public string goodsId { get; set; }
        public string goodsName { get; set; }
        public Price price { get; set; }
        public int quantity { get; set; }
    }

    public class TerminalDetail
    {
        public string operatorId { get; set; }
        public string storeId { get; set; }
        public string terminalId { get; set; }
        public string merchantName { get; set; }
        public string storeName { get; set; }
    }

    public class AccessoryContent
    {
        public AmountDetail amountDetail { get; set; }
        public GoodsDetail goodsDetail { get; set; }
        public TerminalDetail terminalDetail { get; set; }
    }

    public class BizContent
    {
        public string merchantOrderNo { get; set; }
        public string subject { get; set; }
        public TotalAmount totalAmount { get; set; }
        public string paySceneCode { get; set; }
        public PaySceneParams paySceneParams { get; set; }
        public string notifyUrl { get; set; }
        public string refundMerchantOrderNo { get; set; }
        public string originMerchantOrderNo { get; set; }
        public TotalAmount amount { get; set; }
        public string operatorName { get; set; }
        public string reason { get; set; }
        public AccessoryContent accessoryContent { get; set; }
    }

    public class PayByCreateOrderRequest
    {
        public long requestTime { get; set; }
        public BizContent bizContent { get; set; }
    }

    public class AcquireOrder
    {
        public string merchantOrderNo { get; set; }
        public string orderNo { get; set; }
        public string deviceId { get; set; }
        public string status { get; set; }
        public string product { get; set; }
        public TotalAmount totalAmount { get; set; }
        public string payeeMid { get; set; }
        public long expiredTime { get; set; }
        public string notifyUrl { get; set; }
        public string subject { get; set; }
        public long requestTime { get; set; }
        public AccessoryContent accessoryContent { get; set; }
        public string paySceneCode { get; set; }
        public string revoked { get; set; }
    }

    public class InterActionParams
    {
        public string tokenUrl { get; set; }
    }

    public class Body
    {
        public AcquireOrder acquireOrder { get; set; }
        public InterActionParams interActionParams { get; set; }
        public bool isFetching { get; set; }
    }

    public class Head
    {
        public string applyStatus { get; set; }
        public string code { get; set; }
        public string msg { get; set; }
        public string traceCode { get; set; }
    }

    public class PayByCreateOrderResponse
    {
        public Body body { get; set; }
        public Head head { get; set; }
    }
}