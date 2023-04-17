using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;
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
            routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" });

            // routes.MapMvcAttributeRoutes();

            routes.MapRoute("login", "login", new { controller = "Home", action = "LoginIndex", id = UrlParameter.Optional });
            routes.MapRoute("loginout", "Home/LoginOut", new { controller = "Home", action = "LoginOut", id = UrlParameter.Optional });
            routes.MapRoute("LoginIndex", "Home/LoginIndex", new { controller = "Home", action = "LoginIndex", id = UrlParameter.Optional });
            routes.MapRoute("LoginOutAllDevice", "Home/LoginOutAllDevice", new { controller = "Home", action = "LoginOutAllDevice", id = UrlParameter.Optional });
            routes.MapRoute("signup", "signup/{id}", new { controller = "Home", action = "LoginIndex", id = UrlParameter.Optional });
            routes.MapRoute("home", "Home/Index/home", new { controller = "Home", action = "Index", id = UrlParameter.Optional });
            routes.MapRoute("homenotify", "Home/Notify/", new { controller = "Home", action = "Notify", id = UrlParameter.Optional });
            routes.MapRoute("LiveBoxNotify", "Home/LiveBoxNotify/", new { controller = "Home", action = "LiveBoxNotify", id = UrlParameter.Optional });
            routes.MapRoute("SMSNotify", "Home/SMSNotify/", new { controller = "Home", action = "SMSNotify", id = UrlParameter.Optional });

            
            // Route override to work with Angularjs and HTML5 routing
            //routes.MapRoute(
            //    name: "loginIndex",
            //    url: "{*.}",
            //    defaults: new { controller = "Home", action = "LoginIndex" }
            //);
            routes.MapRoute(
                 name: "HomeIndex",
                // url: "Home/{*url}",
                 url: "Home/{*.}",
                 defaults: new { controller = "Home", action = "Index" }
              );
            routes.MapRoute(
                name: "Default", 
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "LoginIndex", id = UrlParameter.Optional }
            );           
        }
    }
}
