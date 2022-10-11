using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
  

namespace MyCortex
{
    public class Global : HttpApplication
    {
        public static string _WebApiExecutionPath = "~/api";
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup

            ViewEngines.Engines.Clear();

            ViewEngines.Engines.Add(new CustomRazorViewEngine());

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            GlobalConfiguration.Configure(config => { config.Filters.Add(new LogFilterAttribute()); });
        }
        void Session_Start(object sender, EventArgs e)
        {
            HttpContext.Current.Session["UserName"] = "";
            HttpContext.Current.Session["UserId"] = "0";
        }

        void Session_End(object sender, EventArgs e)
        {
            Session["UserId"] = "-999";
            //HttpContext.Current.Session["UserId"] = "-9999";
        }
        protected void Application_PostAuthorizeRequest()
        {
            if (IsWebApiRequest())
            {
                HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            }
        }


        private static bool IsWebApiRequest()
        {
            
            return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith(_WebApiExecutionPath);
        }
        protected void Application_BeginRequest()
        {
            //if (Request.Headers.AllKeys.Contains("origin") || Request.Headers.AllKeys.Contains("Origin"))
            //{
            //    if (Request.Url != null)
            //    {
            //        if (Request.Url.Scheme + "://" + Request.Url.Authority != Request.Headers.GetValues("Origin")[0])
            //        {
            //            Response.Flush();
            //        }
            //    }
            //    else
            //    {
            //        Response.Flush();
            //    }
            //}

            //if (Request.Headers.AllKeys.Contains("Origin") && Request.HttpMethod == "OPTIONS")
            //{
            //    Response.Headers.Add("Access-Control-Allow-Origin", "https://localhost:49700");
            //    Response.Headers.Add("Access-Control-Allow-Headers",
            //      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            //    Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            //    Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            //    Response.Flush();
            //}
        }
    }
}