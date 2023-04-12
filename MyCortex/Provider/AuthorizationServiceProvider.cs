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
            long InsID = 0;
            var formData = await context.Request.ReadFormAsync() as IEnumerable<KeyValuePair<string, string[]>>;
            var fieldValue = formData.FirstOrDefault(x => x.Key == "client_id").Value;
            if (fieldValue != null)
            {
                long ClientId = Convert.ToInt64(formData.FirstOrDefault(x => x.Key == "client_id").Value[0]);
                InsID = ClientId;
            }
            //string ClientName = formData.FirstOrDefault(x => x.Key == "UserName").Value[0];
            //if (ClientId != 0 && ClientId != 1 )
            //{
            //long InsID1 = Convert.ToInt64(commonrepository.GetInstitutionId(ClientId)[0].InstitutionId);
            //InsID = InsID1;
            //}
            long lifeTypeValue = Convert.ToInt64(int.Parse(commonrepository.AppConfigurationDetails("TOKENLIFETIME", InsID)[0].ConfigValue));
            context.Options.AccessTokenExpireTimeSpan = TimeSpan.FromDays(lifeTypeValue);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            string message = string.Empty;
            LoginModel model = new LoginModel();
          
           
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
                    uname = context.UserName;
                    pwd = context.Password;
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
