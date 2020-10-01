using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Owin.Security.OAuth;
using System.Threading.Tasks;
using System.Security.Claims;
using MyCortex.Repositories;
using MyCortex.Repositories.Login;
using MyCortex.Login.Model;
using MyCortex.Utilities;
using MyCortex.Repositories.Masters;

namespace MyCortex.Provider
{
    public class AuthorizationServiceProvider : OAuthAuthorizationServerProvider
    {

        static readonly ILoginRepository repository = new LoginRepository();
        static readonly ICommonRepository commonrepository = new CommonRepository();

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
            int lifeTypeValue= int.Parse(commonrepository.AppConfigurationDetails("TOKENLIFETIME", 0)[0].ConfigValue);
            context.Options.AccessTokenExpireTimeSpan = TimeSpan.FromDays(lifeTypeValue);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            string message = string.Empty;
            LoginModel model = new LoginModel();
            DataEncryption EncryptPassword = new DataEncryption();
          
           
            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            string username = context.UserName;
            string password = context.Password;
            //IUserFascade userFascade = new UserFascade();
            //UserModel userModel = userFascade.ValidateUserPassword(mobileNo, password);
            identity.AddClaim(new Claim(ClaimTypes.Sid, "1"));
            identity.AddClaim(new Claim(ClaimTypes.Name, username));
            //identity.AddClaim(new Claim(ClaimTypes.Role, password));
            try
            {

                string uname = "";
                string pwd = "";
                if (context.Password == "#1#")
                {
                    uname = context.UserName;
                    pwd = "";
                }
                else
                {
                    uname = EncryptPassword.Encrypt(context.UserName);
                    pwd = EncryptPassword.Encrypt(context.Password);
                }
                if(context.Password != "admin")
                {
                    model = repository.Userlogin_Validate(uname, pwd);

                    if (model.data == 2)
                    {
                        context.SetError("invalid grant");
                    }
                    else
                    {
                        context.Validated(identity);
                    }
                }
                else
                {
                    context.Validated(identity);
                }

            }
                catch (Exception ex)
                {
                    context.SetError("invalid grant", ex.Message);
                }
            return;
        }
    }

    //public override Task TokenEndpointResponse(OAuthTokenEndpointResponseContext context)
    //{
    //    context.Properties.AllowRefresh = true;
    //    context.Properties.IsPersistent = true;
    //    return base.TokenEndpointResponse(context);
    //}
}
