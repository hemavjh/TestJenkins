using MyCortex.Repositories;
using MyCortex.Repositories.Uesr;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Mvc;
using System.Web.Security;

namespace MyCortex.Provider
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    public class CheckSessionOutFilterAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext filterContext)
        {
            string SessionID;
            HttpContext ctx = HttpContext.Current;
            var queryStringCollection = HttpUtility.ParseQueryString(filterContext.Request.RequestUri.Query);
            bool iskey = queryStringCollection.ToString().ToUpper().Contains("LOGIN_SESSION_ID");
            if (iskey)
            {
                SessionID = queryStringCollection["Login_Session_Id"];
            }
            else
            {
                SessionID = (String)HttpContext.Current.Session["Login_Session_Id"];
            }
            if (!String.IsNullOrEmpty(SessionID))
            {
                IUserRepository commonrepository = new UserRepository();
                bool sessionstatus = commonrepository.UserSession_Status(SessionID);
                if (sessionstatus == false)
                {
                    filterContext.Response = filterContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Your SessionId is Invalid. Please Logout from App.");
                }
            }
            else
                filterContext.Response = filterContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Your SessionId is Invalid. Please Logout from App.");

            //ClaimsIdentity claimsIdentity = HttpContext.Current.User.Identity as ClaimsIdentity;
            //if (filterContext.Request.Headers.Authorization == null)
            //{
            //    filterContext.Response =
            //        new System.Net.Http.HttpResponseMessage(
            //             System.Net.HttpStatusCode.Unauthorized);
            //}
            //else
            //{
            //    string authToken = filterContext.Request.Headers.Authorization.Parameter;
            //}

            base.OnActionExecuting(filterContext);

        }
    }

        //public override void OnResultExecuting(ResultExecutingContext filterContext)
        //{

        //    HttpContext context = HttpContext.Current;

        //    // check  sessions here
        //    if (HttpContext.Current.Session["UserId"] == null)
        //    {
        //        filterContext.Result = new RedirectResult("~/Home/LoginIndex");
        //        return;
        //    }
        //    base.OnResultExecuting(filterContext);
        //}
        
}