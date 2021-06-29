using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;

namespace MyCortex.Repositories
{
    interface ILogHandlerRepository
    {
        bool SaveLog(string RequestUrl
            , string RequestMethod
            ,string RequestBody
            ,DateTime? RequestTimestamp
            ,HttpStatusCode ResponseStatusCode
            ,string ResponseBody
            ,DateTime? ResponseTimestamp);
    }
}