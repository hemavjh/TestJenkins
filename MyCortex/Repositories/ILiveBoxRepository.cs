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
        int LiveBox_Notify_UPDATE(string conferencename);
        int LiveBox_Recording_url(string conferencename, string recording_url);
    }
}
