using MyCortexDB;
using MyCortex.Login.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using log4net;
using System.Web.Script.Serialization;
using MyCortex.User.Model;
using MyCortex.Utilities;
using MyCortex.Notification.Model;
using MyCortex.Masters.Models;
using System.Net;

namespace MyCortex.Repositories.LogHandler
{
    public class LogHandlerRepository : ILogHandlerRepository
    {
        public LogHandlerRepository()
        {

        }
        public bool SaveLog(string RequestUrl
            ,string RequestMethod
            ,string RequestBody
            ,DateTime? RequestTimestamp
            ,HttpStatusCode ResponseStatusCode
            ,string ResponseBody
            ,DateTime? ResponseTimestamp)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@RequestUrl", RequestUrl));
            param.Add(new DataParameter("@RequestMethod", RequestMethod));
            param.Add(new DataParameter("@RequestBody", RequestBody));
            param.Add(new DataParameter("@RequestTimestamp", RequestTimestamp));
            param.Add(new DataParameter("@ResponseStatusCode", ResponseStatusCode.ToString()));
            param.Add(new DataParameter("@ResponseBody", ResponseBody));
            param.Add(new DataParameter("@ResponseTimestamp", ResponseTimestamp));

            try
            {
                ClsDataBase.Update("[MYCORTEX].[LOG_INSERT]", param);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}