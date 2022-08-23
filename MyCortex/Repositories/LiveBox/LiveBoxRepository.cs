using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Data;
using MyCortexDB;
using MyCortex.Utilities;

namespace MyCortex.Repositories.LiveBox
{
    public class LiveBoxRepository : ILiveBoxRepository
    {
        ClsDataBase db;

        private JavaScriptSerializer serializer = new JavaScriptSerializer();

        public int LiveBox_Notify_Log(string LogText)
        {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@LOG_TEXT", LogText));
            retid = ClsDataBase.Insert("[MYCORTEX].[LIVEBOX_NOTIFY_LOG]", param, true);
            return retid;
        }
        public int LiveBox_Notify_UPDATE(string conferencename)
        {
            int retid = 0;
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@conferencename", conferencename));
            retid = ClsDataBase.Insert("[MYCORTEX].[LIVEBOX_NOTIFY_LOG_GET_SP]", param, true);
            return retid;

        }
    }
}