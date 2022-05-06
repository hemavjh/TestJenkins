using MyCortexDB;
using MyCortex.Login.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
  
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
        private MyCortexLogger _MyLogger = new MyCortexLogger();
        string
            _AppLogger = string.Empty, _AppMethod = string.Empty;

        public LogHandlerRepository()
        {

        }
        public bool SaveLog(string RequestUrl
            ,string RequestMethod
            ,string RequestBody
            ,DateTime? RequestTimestamp
            ,HttpStatusCode ResponseStatusCode
            ,string ResponseBody
            ,DateTime? ResponseTimestamp
            ,string SessionId)
        {
            _AppLogger = this.GetType().FullName;
            _AppMethod = System.Reflection.MethodBase.GetCurrentMethod().Name;
            DataEncryption EncryptContent = new DataEncryption();
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@RequestUrl", RequestUrl));
            param.Add(new DataParameter("@RequestMethod", RequestMethod));
            param.Add(new DataParameter("@RequestBody", EncryptContent.Encrypt(RequestBody)));
            param.Add(new DataParameter("@RequestTimestamp", RequestTimestamp));
            param.Add(new DataParameter("@ResponseStatusCode", ResponseStatusCode.ToString()));
            param.Add(new DataParameter("@ResponseBody", EncryptContent.Encrypt(ResponseBody)));
            param.Add(new DataParameter("@ResponseTimestamp", ResponseTimestamp));
            param.Add(new DataParameter("@SessionId", SessionId));

            try
            {
                ClsDataBase.Update("[MYCORTEX].[LOG_INSERT]", param);
                return true;
            }
            catch (Exception ex)
            {
                _MyLogger.Exceptions("ERROR", _AppLogger, ex.Message, ex, _AppMethod);
                return false;
            }
        }
    }
}