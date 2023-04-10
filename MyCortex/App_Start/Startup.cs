﻿using System;
using Microsoft.Owin;
using Owin;
using MyCortex.Provider;
using Microsoft.Owin.Security.OAuth;
using System.Web.Http;
using Microsoft.Owin.Security.Infrastructure;
using System.Threading.Tasks;
using MyCortex.Repositories.Login;
using MyCortex.Repositories.Masters;
using MyCortex.Repositories;
using MyCortex.Home.Models;

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
                Provider=myProvider,
                RefreshTokenProvider = new ApplicationRefreshTokenProvider()
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

    public class ApplicationRefreshTokenProvider : IAuthenticationTokenProvider
    {
        static readonly ILoginRepository repository = new LoginRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();
        public void Create(AuthenticationTokenCreateContext context)
        {
            //int expire = int.Parse(commonrepository.AppConfigurationDetails("TOKENLIFETIME", 0)[0].ConfigValue); ;
            //context.Ticket.Properties.ExpiresUtc = new DateTimeOffset(DateTime.Now.AddDays(expire));
            var expirydate = context.Ticket.Properties.ExpiresUtc;
            var issudate = context.Ticket.Properties.IssuedUtc;
            TimeSpan interval = (TimeSpan)(expirydate - issudate);
            double Hours = interval.TotalMinutes;
            context.Ticket.Properties.ExpiresUtc = new DateTimeOffset(DateTime.Now.AddMinutes(Hours + 1));
            context.SetToken(context.SerializeTicket());
        }

        public Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            Create(context);
            return Task.CompletedTask;
        }

        public void Receive(AuthenticationTokenReceiveContext context)
        {
            context.DeserializeTicket(context.Token);
        }

        public Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {
            Receive(context);
            return Task.CompletedTask;
        }
    }
}
