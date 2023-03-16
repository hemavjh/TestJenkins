using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MyCortex
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.RouteExistingFiles = true;
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
           // routes.MapMvcAttributeRoutes();

            routes.MapRoute("home", "Home/Index/home/{id}", new { controller = "Home", action = "Index", id = UrlParameter.Optional });
            //routes.MapRoute(
            // name: "CatchAll",
            // url: "{*any}",
            // defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);
           // routes.MapRoute(
           //    name: "superadmin",
           //    url: "{controller}/{action}/{id}",
           //    defaults: new { controller = "SuperAdmin_UserList", action = "Home/Index", id = UrlParameter.Optional }
           //);

            routes.MapRoute(
                name: "Default", 
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "LoginIndex", id = UrlParameter.Optional }
            );
        }
    }
}
