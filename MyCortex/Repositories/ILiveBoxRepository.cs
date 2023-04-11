using MyCortex.User.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyCortex.Repositories
{
    interface ILiveBoxRepository
    {
        int LiveBox_Notify_Log(string LogText);
        int LiveBox_Get_Institute(string UserId);
        int LiveBox_RemainingTime(string Conference_Id,string Remaning_Time);
        int LiveBox_Notify_UPDATE(string conferencename,long Institution_Id, string userID,string messageBody,string WebmessageBody);
        int LiveBox_Recording_url(string conferencename, string recording_url);
        IList<LiveboxModel> Get_AppointmentDuration(string Conference_ID);
        //IList<LiveboxModel> Get_AppointmentDuration_test(string Conference_ID);
    }
}
