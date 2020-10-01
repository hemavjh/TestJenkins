using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyCortex.Notification.Model
{
    public class UserNotificationModel
    {
        public long Id { get; set; }
        public long Institution_Id { get; set; }
        public long UserId { get; set; }
        public string MessageSubject { get; set; }
        public string MessageBody { get; set; }
        public long TemplateId { get; set; }
        public long Created_By { get; set; }
        public int ReadFlag { get; set; }

        public DateTime SentDate { get; set; }
    }
    public class NotificationReturnModel
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string Error_Code { get; set; }
        public int ReturnFlag { get; set; }
        public UserNotificationModel NotificationDetails { get; set; }
    }
    public class UserNotificationListModel
    {
        public long UserId { get; set; }
        public int NotificationTotal { get; set; }
        public int NotificationUnread { get; set; }
        public List<UserNotificationModel> usernotification { get; set; }
    }
}

