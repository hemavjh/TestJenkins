using System;
using Microsoft.Owin;
using Owin;
using MyCortex.Provider;
using Microsoft.Owin.Security.OAuth;
using System.Web.Http;

[assembly: OwinStartup(typeof(MyCortex.App_Start.Startup))]

namespace MyCortex.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            // Configure the application for OAuth based flow
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);

            var myProvider = new AuthorizationServiceProvider();
            OAuthAuthorizationServerOptions options = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp=true,
                TokenEndpointPath = new PathString("/Token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(7),
                Provider=myProvider
                // , RefreshTokenProvider = new ApplicationRefreshTokenProvider()
            };
            //app.UseOAuthAuthorizationServer(options);


            app.UseOAuthAuthorizationServer(options);


            // token consumption
            var oauthConfig = new Microsoft.Owin.Security.OAuth.OAuthBearerAuthenticationOptions
            {
                AuthenticationMode = Microsoft.Owin.Security.AuthenticationMode.Active,
                AuthenticationType = "Bearer"
            };

            app.UseOAuthBearerAuthentication(oauthConfig);
            //app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());


            HttpConfiguration config = new HttpConfiguration();
            WebApiConfig.Register(config);
        }
    }
}
