﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace MyCortex
{
    public class MyCortexLogHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string requestBody = string.Empty;
            string responseBody = string.Empty;
            
            string SessionID;
            var queryStringCollection = HttpUtility.ParseQueryString(request.RequestUri.Query);
            bool iskey = queryStringCollection.ToString().ToUpper().Contains("LOGIN_SESSION_ID");
            if (iskey)
            {
                SessionID = queryStringCollection["Login_Session_Id"];
            }
            else
            {
                SessionID = (String)HttpContext.Current.Session["Login_Session_Id"];
            }
            var tempHttpContextCurrent = HttpContext.Current;
            if (request.Content != null)
            {
                requestBody = await request.Content.ReadAsStringAsync();
            }

            var result = await base.SendAsync(request, cancellationToken);
            
            if (result.Content != null)
            {
                responseBody = await result.Content.ReadAsStringAsync();
            }
            HttpContext.Current = tempHttpContextCurrent;
            Repositories.LogHandler.LogHandlerRepository repository = new Repositories.LogHandler.LogHandlerRepository();

            try
            {
                repository.SaveLog(request.RequestUri.OriginalString
                    , request.Method.Method
                    , requestBody
                    , DateTime.Now
                    , result.StatusCode
                    , responseBody
                    , DateTime.Now
                    , SessionID);
            }
            catch 
            { 

            }
            return result;
        }

        public class LogMetadata
        {
            public string RequestUriOriginalString { get; set; }
            public string RequestMethod { get; set; }
            public string RequestBody { get; set; }
            public DateTime? RequestTimestamp { get; set; }
            public HttpStatusCode ResponseStatusCode { get; set; }
            public string ResponseBody { get; set; }
            public DateTime? ResponseTimestamp { get; set; }
        }
    }
}