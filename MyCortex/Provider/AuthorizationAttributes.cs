using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;

namespace MyCortex.Provider
{
    public class AuthorizationAttributes : System.Web.Http.AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
        {
            if (!HttpContext.Current.User.Identity.IsAuthenticated)
            {
                //base.HandleUnauthorizedRequest(actionContext);
                actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
            }
            else
            {
                actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
            }
        }
    }
    //public class MycortexAuthorizationAttributes : System.Web.Http.AuthorizeAttribute
    //{
    //    protected override void HandleUnauthorizedRequest(HttpActionContext actionContext)
    //    {
    //        if (!HttpContext.Current.User.Identity.IsAuthenticated)
    //        {
    //            //base.HandleUnauthorizedRequest(actionContext);
    //            actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
    //        }
    //        else
    //        {
    //            actionContext.Response = new System.Net.Http.HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
    //        }
    //    }
    //}
}