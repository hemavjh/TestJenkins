using MyCortexDB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace MyCortex
{
    public class MyCortexLogger
    {
        public void Exceptions(string Level, string Logger, string Message, Exception Exception, string Method)
        {
            List<DataParameter> param = new List<DataParameter>();
            param.Add(new DataParameter("@LOGDATE", DateTime.UtcNow));
            param.Add(new DataParameter("@LEVEL", Level));
            param.Add(new DataParameter("@LOGGER", Logger));
            param.Add(new DataParameter("@MESSAGE", Message));
            param.Add(new DataParameter("@EXCEPTION", Exception == null ? string.Empty : Exception.ToString()));
            param.Add(new DataParameter("@METHOD", Method));

            DataTable dt = ClsDataBase.GetDataTable("[MYCORTEX].APPLICATIONLOG_INSERT", param);
        }



    }
}